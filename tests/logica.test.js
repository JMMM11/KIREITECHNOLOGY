import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatoPrecio, porcentajeDescuento } from '../src/lib/formatoPrecio.js';
import { calcularTotales, contarArticulos } from '../src/lib/totales.js';
import { validarTelefono, validarCorreo, validarNombre } from '../src/lib/validacion.js';
import { TARIFAS } from '../src/data/sitio.js';

test('formato de precio', () => {
  assert.equal(formatoPrecio(2000), '$20.00');
  assert.equal(formatoPrecio(5), '$0.05');
  assert.equal(formatoPrecio(123456), '$1,234.56');
  assert.equal(formatoPrecio(null), '[pendiente]');
  assert.throws(() => formatoPrecio(19.99));
});

test('porcentaje de descuento', () => {
  assert.equal(porcentajeDescuento(8000, 10000), 20);
  assert.equal(porcentajeDescuento(10000, 10000), 0);
  assert.equal(porcentajeDescuento(null, 10000), 0);
});

test('totales: retiro con pago en línea no suma cargos', () => {
  const t = calcularTotales([{ precio: 2000, cantidad: 1 }], 'retiro', 'linea', TARIFAS);
  assert.equal(t.total, 2000);
  assert.equal(t.contraEntregaPermitida, false);
  assert.equal(t.faltaParaContraEntrega, 1000);
});

test('totales: domicilio + contra entrega suma $10', () => {
  const lineas = [{ precio: 2000, cantidad: 1 }, { precio: 500, cantidad: 2 }];
  const t = calcularTotales(lineas, 'domicilio', 'contra_entrega', TARIFAS);
  assert.equal(t.subtotal, 3000);
  assert.equal(t.contraEntregaPermitida, true);
  assert.equal(t.total, 4000);
  assert.equal(contarArticulos(lineas), 3);
});

test('totales: punto de encuentro sin tarifa queda por confirmar', () => {
  const t = calcularTotales([{ precio: 10000, cantidad: 1 }], 'punto_encuentro', 'linea', TARIFAS);
  assert.equal(t.envioPorConfirmar, TARIFAS.envioPuntoEncuentro == null);
});

test('validación', () => {
  assert.equal(validarTelefono('6123-4567'), '');
  assert.equal(validarTelefono('+507 6123 4567'), '');
  assert.notEqual(validarTelefono('123'), '');
  assert.equal(validarCorreo(''), '');
  assert.notEqual(validarCorreo('ana@'), '');
  assert.notEqual(validarNombre(' '), '');
});
