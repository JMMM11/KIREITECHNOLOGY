import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alertasInventario, resumirVentas } from '../src/lib/reportes.js';

const hoy = new Date(2026, 10, 8);
const pedido = (estado, total, mes, items) => ({ estado, totalCentavos: total, creadoEn: new Date(2026, mes, 3), items });
const gm2 = (cantidad) => ({ productoId: 'gm2', nombre: 'GM2', precioCentavos: 3000, cantidad });
const xt62 = (cantidad) => ({ productoId: 'xt62', nombre: 'XT62', precioCentavos: 2000, cantidad });

test('ventas: solo cuentan confirmados, enviados y entregados', () => {
  const r = resumirVentas([
    pedido('entregado', 3500, 10, [gm2(1)]),
    pedido('confirmado', 4000, 10, [xt62(2)]),
    pedido('recibido', 9999, 10, [gm2(5)]),
    pedido('cancelado', 9999, 10, [gm2(5)]),
    pedido('enviado', 2500, 8, [xt62(1)]),
  ], { hoy });
  assert.equal(r.totalCentavos, 10000);
  assert.equal(r.ventas, 3);
  assert.equal(r.ticketPromedioCentavos, 3333);
  assert.deepEqual(r.porEstado, { entregado: 1, confirmado: 1, recibido: 1, cancelado: 1, enviado: 1 });
  assert.deepEqual(r.masVendidos.map((m) => [m.productoId, m.cantidad]), [['xt62', 3], ['gm2', 1]]);
});

test('ventas por mes: los últimos 6, incluidos los vacíos, y fuera los más viejos', () => {
  const r = resumirVentas([pedido('entregado', 1000, 10, []), pedido('entregado', 500, 8, []), pedido('entregado', 700, 2, [])], { hoy });
  assert.equal(r.porMes.length, 6);
  assert.deepEqual(r.porMes.map((m) => m.totalCentavos), [0, 0, 0, 500, 0, 1000]);
  assert.equal(resumirVentas([], { hoy }).ticketPromedioCentavos, 0);
});

test('alertas de inventario', () => {
  const a = alertasInventario([
    { id: 'a', stock: 0, precioCentavos: 100, fotos: [1], estado: 'publicado' },
    { id: 'b', stock: 2, precioCentavos: null, variantes: [{ precioCentavos: 500 }], fotos: [1], estado: 'publicado' },
    { id: 'c', stock: null, precioCentavos: null, fotos: [], estado: 'borrador' },
  ]);
  assert.deepEqual(Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v.map((p) => p.id)])),
    { agotados: ['a'], pocos: ['b'], sinContar: ['c'], sinPrecio: ['c'], sinFoto: ['c'], borradores: ['c'] });
});
