import { test } from 'node:test';
import assert from 'node:assert/strict';
import { limpiarEvento } from '../src/lib/monitoreo.js';

test('los errores que van a Sentry no llevan IP, cookies, cabeceras ni datos de formularios', () => {
  const evento = limpiarEvento({
    user: { id: 'uid-1', ip_address: '190.1.2.3', email: 'ana@ejemplo.com' },
    request: { url: 'https://tienda.pa/checkout?telefono=61234567', cookies: 'sesion=x', headers: { Authorization: 'Bearer t' }, data: { clave: 'x' } },
    extra: { datos: { telefono: '6123' }, componente: 'Checkout' },
  });
  assert.deepEqual(evento.user, { id: 'uid-1' });
  assert.deepEqual(evento.request, { url: 'https://tienda.pa/checkout' });
  assert.deepEqual(evento.extra, { componente: 'Checkout' });
  assert.deepEqual(limpiarEvento({ message: 'x' }), { message: 'x' });
});
