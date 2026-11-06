import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoProducto, listarProductos, obtenerProducto } from '../src/services/tienda.js';
import { filtrarCatalogo, precioDe, quedanPocas, variosPrecios } from '../src/lib/catalogo.js';
import { PRODUCTOS } from '../src/data/productos.js';

test('el estado lo decide la capa de datos', () => {
  assert.equal(estadoProducto({ stock: 0 }), 'agotado');
  assert.equal(estadoProducto({ stock: 5, precioCentavos: 800, precioAntesCentavos: 1000 }), 'oferta');
  assert.equal(estadoProducto({ stock: 2 }), 'ultimas');
  assert.equal(estadoProducto({ stock: null, nuevo: true }), 'nuevo');
  assert.equal(estadoProducto({ stock: null }), null);
  // Con 3 o más, el cliente no ve aviso de unidades: el número es para el admin.
  assert.equal(estadoProducto({ stock: 3 }), null);
  assert.equal(estadoProducto({ stock: 15 }), null);
});

test('cada opción usa su precio o el del producto', () => {
  const p = { precioCentavos: 2500, variantes: [{ id: 'negro', precioCentavos: 3000 }, { id: 'blanco' }] };
  assert.equal(precioDe(p, p.variantes[0]), 3000);
  assert.equal(precioDe(p, p.variantes[1]), 2500);
  assert.equal(variosPrecios(p), true);
  assert.equal(variosPrecios({ precioCentavos: 2000, variantes: [{ id: 'a' }, { id: 'b' }] }), false);
  assert.equal(variosPrecios({ precioCentavos: 2000 }), false);
  assert.deepEqual([0, 1, 2, 3, null].map(quedanPocas), [false, true, true, false, false]);
});

test('el precio base de un producto con opciones es el menor de ellas', () => {
  for (const p of PRODUCTOS.filter((x) => x.variantes?.some((v) => v.precioCentavos != null))) {
    assert.equal(p.precioCentavos, Math.min(...p.variantes.map((v) => precioDe(p, v))), p.id);
  }
});

test('solo se listan productos publicados', async () => {
  const lista = await listarProductos();
  assert.ok(lista.length > 0);
  assert.ok(lista.every((p) => p.estado === 'publicado'));
  assert.equal(PRODUCTOS.filter((p) => p.estado !== 'publicado').length + lista.length, PRODUCTOS.length);
  assert.equal(await obtenerProducto('no-existe'), null);
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

test('cada foto de producto y de portada existe', async () => {
  const { existsSync } = await import('node:fs');
  const { HERO } = await import('../src/data/textos.js');
  const { FOTOS_REPARACION, SERVICIOS, GRUPOS_SERVICIO } = await import('../src/data/servicios.js');
  const fotos = [...HERO.fotos, ...PRODUCTOS.flatMap((p) => p.fotos ?? []), ...Object.values(FOTOS_REPARACION), ...[...GRUPOS_SERVICIO, ...SERVICIOS].map((x) => x.foto).filter(Boolean)];
  for (const f of fotos) assert.ok(existsSync(new URL(`../${f.src}`, import.meta.url)), `${f.src} no existe`);
  // La tienda sirve las copias livianas: si falta una, corre scripts/fotos-web.ps1.
  const { anchosWeb, rutaWeb } = await import('../src/lib/fotos.js');
  for (const f of fotos) {
    for (const w of anchosWeb(f.src)) assert.ok(existsSync(new URL(`../${rutaWeb(f.src, w)}`, import.meta.url)), `falta ${rutaWeb(f.src, w)}`);
  }
});

test('ruta de la copia liviana de una foto', async () => {
  const { anchosWeb, rutaWeb } = await import('../src/lib/fotos.js');
  assert.equal(rutaWeb('Productos/Lenovo GM2 Pro (1).png', 640), 'Productos/web/Lenovo GM2 Pro (1).png-640.jpg');
  assert.notEqual(rutaWeb('Productos/X (1).png', 640), rutaWeb('Productos/X (1).jpeg', 640));
  assert.deepEqual(anchosWeb('Productos/principal2.png'), [960, 1920]);
  assert.deepEqual(anchosWeb('Productos/Hogwarts (2).jpg'), [640, 1280]);
});

test('el UID del dueño es el mismo en el código y en firestore.rules', async () => {
  const { readFileSync } = await import('node:fs');
  const { SITIO } = await import('../src/data/sitio.js');
  const reglas = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
  assert.ok(reglas.includes(`request.auth.uid == '${SITIO.duenoUid}'`));
});

test('datos de producto para Google: precio, rango y disponibilidad', async () => {
  const { datosProducto } = await import('../src/lib/seo.js');
  const porId = (id) => PRODUCTOS.find((p) => p.id === id);
  const gm2 = datosProducto(porId('lenovo-gm2-pro'));
  assert.equal(gm2['@type'], 'Product');
  assert.deepEqual([gm2.offers['@type'], gm2.offers.lowPrice, gm2.offers.highPrice], ['AggregateOffer', '25.00', '30.00']);
  assert.ok(gm2.image[0].startsWith('https://') && gm2.image[0].includes('/Productos/web/'));
  assert.equal(datosProducto(porId('redmi-buds-4-harry-potter')).offers.availability, 'https://schema.org/BackOrder');
  assert.equal(datosProducto(porId('lenovo-thinkplus-xt62')).offers.price, '20.00');
  assert.equal(datosProducto(porId('lige-correa-metal')).offers, undefined);
  assert.equal(datosProducto({ ...porId('lenovo-thinkplus-xt62'), stock: 0 }).offers.availability, 'https://schema.org/OutOfStock');
});
