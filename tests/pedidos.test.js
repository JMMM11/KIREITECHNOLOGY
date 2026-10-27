import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ESTADOS_PEDIDO, armarPedido, fechaPedido, idPedido, siguienteNumero } from '../src/lib/pedidos.js';
import { crearPedido } from '../src/services/tienda.js';

const ENTRADA = {
  cliente: { nombre: '  Ana Pérez ', telefono: '6123 4567', correo: '', direccion: 'no se usa en retiro' },
  entrega: 'retiro', pago: 'linea', nota: ' Llamar antes ',
  items: [{ productoId: 'lenovo-gm2-pro', nombre: 'Lenovo GM2 Pro', varianteNombre: undefined, precioCentavos: 2000, cantidad: 2 }],
  totales: { subtotal: 4000, envio: 0, cargoContraEntrega: 0, total: 4000 },
};

test('número de pedido: empieza en KT-1001 y sigue del último guardado', () => {
  assert.equal(siguienteNumero(undefined), 1001);
  assert.equal(siguienteNumero(1041), 1042);
  assert.equal(idPedido(1042), 'KT-1042');
});

test('armarPedido deja la forma que exigen las reglas', () => {
  const p = armarPedido(ENTRADA);
  assert.equal(p.estado, 'recibido');
  assert.equal(p.cliente.nombre, 'Ana Pérez');
  assert.equal(p.cliente.direccion, '', 'la dirección solo se guarda para envío a domicilio');
  assert.equal(p.nota, 'Llamar antes');
  assert.equal(p.items[0].varianteNombre, '');
  assert.equal(p.totalCentavos, 4000);
  assert.ok(!JSON.stringify(p).includes('undefined'));
  assert.deepEqual(Object.keys(p).sort(), ['cargoContraEntregaCentavos', 'cliente', 'entrega', 'envioCentavos', 'estado', 'items', 'nota', 'pago', 'subtotalCentavos', 'totalCentavos']);
});

test('armarPedido: envío por confirmar queda en null y el total lo calcula él', () => {
  const p = armarPedido({ ...ENTRADA, entrega: 'punto_encuentro', pago: 'contra_entrega', totales: { subtotal: 4000, envio: null, cargoContraEntrega: 500, total: 1 } });
  assert.equal(p.envioCentavos, null);
  assert.equal(p.totalCentavos, 4500);
});

test('armarPedido rechaza pedidos vacíos u opciones desconocidas', () => {
  assert.throws(() => armarPedido({ ...ENTRADA, items: [] }));
  assert.throws(() => armarPedido({ ...ENTRADA, entrega: 'dron' }));
  assert.throws(() => armarPedido({ ...ENTRADA, pago: 'trueque' }));
});

test('sin Firebase el pedido queda en la sesión con número creciente', async () => {
  const a = await crearPedido(ENTRADA);
  const b = await crearPedido(ENTRADA);
  assert.match(a.id, /^KT-\d+$/);
  assert.equal(b.numero, a.numero + 1);
  assert.equal(a.local, true);
});

test('fecha del pedido desde Timestamp o texto', () => {
  assert.equal(fechaPedido({ toDate: () => new Date(0) }).getTime(), 0);
  assert.equal(fechaPedido('2026-10-27T00:00:00.000Z').getUTCDate(), 27);
  assert.equal(fechaPedido(null), null);
});

test('reglas y panel usan los mismos estados de pedido', () => {
  const reglas = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
  assert.ok(reglas.includes(`[${ESTADOS_PEDIDO.map((e) => `'${e}'`).join(', ')}]`));
  const tokens = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
  for (const e of ESTADOS_PEDIDO) assert.ok(tokens.includes(`--e-${e}-fg`), `falta el color de "${e}" en tokens.css`);
});
