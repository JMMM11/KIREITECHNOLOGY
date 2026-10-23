import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aCentavos, idDesdeNombre, reordenarFotos } from '../src/components/admin/editor.js';

test('montos del panel a centavos', () => {
  assert.equal(aCentavos('20'), 2000);
  assert.equal(aCentavos('20,5'), 2050);
  assert.equal(aCentavos(' 19.99 '), 1999);
  assert.equal(aCentavos(''), null);
  assert.ok(Number.isNaN(aCentavos('abc')));
  assert.ok(Number.isNaN(aCentavos('-5')));
  assert.ok(Number.isNaN(aCentavos('1.999')));
});

test('id del producto sin tildes ni símbolos', () => {
  assert.equal(idDesdeNombre('Lámpara LED 3D (Anime)'), 'lampara-led-3d-anime');
});

test('los colores siguen a su foto al reordenar o quitar', () => {
  const datos = { fotos: ['a', 'b', 'c'], variantes: [{ foto: 0 }, { foto: 2 }, { foto: null }] };
  assert.deepEqual(reordenarFotos(datos, [2, 0, 1]), { fotos: ['c', 'a', 'b'], variantes: [{ foto: 1 }, { foto: 0 }, { foto: null }] });
  assert.deepEqual(reordenarFotos(datos, [0, 1]).variantes, [{ foto: 0 }, { foto: null }, { foto: null }]);
});
