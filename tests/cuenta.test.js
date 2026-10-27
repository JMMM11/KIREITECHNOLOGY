import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fechaCorta, mensajeAuth, numeroPedido, pasoPedido, validarClave } from '../src/lib/cuenta.js';
import { crearPedido } from '../src/services/tienda.js';

test('errores de Firebase en español y sin revelar si el correo existe', () => {
  assert.equal(mensajeAuth({ code: 'auth/user-not-found' }), mensajeAuth({ code: 'auth/wrong-password' }));
  assert.match(mensajeAuth({ code: 'auth/otro' }), /Vuelve a intentarlo/);
  assert.match(mensajeAuth(undefined), /Vuelve a intentarlo/);
});

test('contraseña de al menos 8 caracteres', () => {
  assert.notEqual(validarClave('1234567'), '');
  assert.equal(validarClave('12345678'), '');
});

test('número de pedido legible y estados en orden', () => {
  assert.match(numeroPedido(1_700_000_000_000), /^KT-[0-9A-Z]{6}$/);
  assert.equal(pasoPedido('recibido'), 0);
  assert.equal(pasoPedido('entregado'), 3);
  assert.equal(pasoPedido('cancelado'), -1);
});

test('fecha de pedido recién creado sin hora del servidor', () => {
  assert.equal(fechaCorta(null), 'Hace un momento');
  assert.match(fechaCorta({ toDate: () => new Date(2026, 9, 27) }), /2026/);
});

test('sin sesión el pedido queda local y empieza en recibido', async () => {
  const p = await crearPedido({ cliente: {}, entrega: 'retiro', pago: 'linea', items: [{ productoId: 'x', cantidad: 1 }], totales: { subtotal: 1000, total: 1000 } });
  assert.equal(p.estado, 'recibido');
  assert.equal(p.local, true);
  assert.equal(p.id, p.numero);
  await assert.rejects(crearPedido({ items: [], totales: {} }));
});
