import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoProducto, listarProductos, obtenerProducto } from '../src/services/tienda.js';
import { filtrarCatalogo } from '../src/lib/catalogo.js';
import { PRODUCTOS } from '../src/data/productos.js';

test('el estado lo decide la capa de datos', () => {
  assert.equal(estadoProducto({ stock: 0 }), 'agotado');
  assert.equal(estadoProducto({ stock: 5, precioCentavos: 800, precioAntesCentavos: 1000 }), 'oferta');
  assert.equal(estadoProducto({ stock: 2 }), 'ultimas');
  assert.equal(estadoProducto({ stock: null, nuevo: true }), 'nuevo');
  assert.equal(estadoProducto({ stock: null }), null);
});

test('solo se listan productos publicados', async () => {
  const lista = await listarProductos();
  assert.ok(lista.length > 0);
  assert.ok(lista.every((p) => p.estado === 'publicado'));
  assert.ok(!lista.some((p) => p.categoriaId === 'anime'), 'la Zona Anime sigue en borrador');
  assert.equal(await obtenerProducto('llavero-3d'), null);
});

test('precios en centavos enteros o pendientes', () => {
  for (const p of PRODUCTOS) assert.ok(p.precioCentavos === null || Number.isInteger(p.precioCentavos), p.id);
});

test('búsqueda sin tildes y orden por precio con pendientes al final', async () => {
  const lista = await listarProductos();
  assert.ok(filtrarCatalogo(lista, { texto: 'audifonos' }).length >= 2);
  const orden = filtrarCatalogo(lista, { orden: 'precio-asc' });
  const conPrecio = orden.filter((p) => p.precioCentavos != null).map((p) => p.precioCentavos);
  assert.deepEqual(conPrecio, [...conPrecio].sort((a, b) => a - b));
  assert.equal(orden.at(-1).precioCentavos, null);
});

test('la búsqueda encuentra por marca', async () => {
  const lista = await listarProductos();
  assert.deepEqual(filtrarCatalogo(lista, { texto: 'xiaomi' }).map((p) => p.id), ['redmi-buds-4-harry-potter']);
  assert.equal(filtrarCatalogo(lista, { texto: 'Lenovo' }).length, 2);
});

test('cada marca tiene productos y logo', async () => {
  const { MARCAS } = await import('../src/data/catalogos.js');
  const { existsSync } = await import('node:fs');
  for (const m of MARCAS) {
    assert.ok(PRODUCTOS.some((p) => p.marca === m.nombre), `${m.nombre} sin productos`);
    assert.ok(existsSync(new URL(`../public/marcas/${m.logo}.svg`, import.meta.url)), `${m.logo}.svg no existe`);
  }
});
