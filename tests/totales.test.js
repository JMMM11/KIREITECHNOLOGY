// Ejecutar con: node tests/totales.test.js
const assert = require('node:assert/strict');
const { formatearDinero, calcularTotales } = require('../js/totales.js');

const tarifas = { envioDomicilio: 500, envioPuntoEncuentro: null, contraEntregaMinimo: 3000, contraEntregaCargo: 500 };

assert.equal(formatearDinero(2000), '$20.00');
assert.equal(formatearDinero(5), '$0.05');
assert.equal(formatearDinero(123456), '$1234.56');
assert.throws(() => formatearDinero(19.99));

// Retiro con Yappy: sin cargos.
let t = calcularTotales([{ precio: 2000, cantidad: 1 }], 'retiro', 'yappy', tarifas);
assert.equal(t.total, 2000);
assert.equal(t.contraEntregaPermitida, false);

// Domicilio con contra entrega: envío + cargo, y ya pasa el mínimo de $30.
t = calcularTotales([{ precio: 2000, cantidad: 1 }, { precio: 500, cantidad: 2 }], 'domicilio', 'contra_entrega', tarifas);
assert.equal(t.subtotal, 3000);
assert.equal(t.contraEntregaPermitida, true);
assert.equal(t.total, 3000 + 500 + 500);

// Punto de encuentro sin tarifa definida: no se suma y queda por confirmar.
t = calcularTotales([{ precio: 10000, cantidad: 1 }], 'punto', 'yappy', tarifas);
assert.equal(t.envioPorConfirmar, true);
assert.equal(t.total, 10000);

console.log('totales: ok');
