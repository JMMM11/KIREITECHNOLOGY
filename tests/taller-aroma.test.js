// Guion del desarme de la laptop y lógica de Aroma (familias, lectura de perfumes del panel y recomendador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DURACION, INICIO_CICLO, PASOS, PIEZAS, T_DESARMADA, avance, estado } from '../src/components/reparaciones/laptop/secuencia.js';
import { FAMILIAS, PREGUNTAS } from '../src/data/aroma.js';
import { PRODUCTOS } from '../src/data/productos.js';
import { datosPerfume, recomendar } from '../src/lib/aroma.js';

test('laptop: empieza y termina armada, y en el punto fijo está del todo desarmada', () => {
  for (const t of [0, INICIO_CICLO, DURACION]) assert.ok(estado(t).piezas.every((p) => p === 0), `armada en t=${t}`);
  assert.ok(estado(T_DESARMADA).piezas.every((p) => p === 1));
  assert.equal(estado(0).tapa, 0);
  assert.equal(estado(INICIO_CICLO).tapa, 1);
  assert.equal(estado(DURACION).pantalla, 1);
});

test('laptop: orden real del desarme y armado en orden inverso', () => {
  const de = (nodo) => PIEZAS.find((p) => p.nodo === nodo);
  const orden = ['Tornillo1', 'Teclado', 'Bateria', 'RAM1', 'SSD', 'Disipador', 'PlacaBase'].map(de);
  for (let i = 1; i < orden.length; i++) {
    assert.ok(orden[i - 1].sale < orden[i].sale, `${orden[i - 1].nodo} sale antes que ${orden[i].nodo}`);
    assert.ok(orden[i - 1].entra > orden[i].entra, `${orden[i - 1].nodo} vuelve después que ${orden[i].nodo}`);
  }
  // Nada sale mientras los tornillos siguen puestos ni vuelve a moverse después de cerrar.
  for (const pz of PIEZAS) { assert.equal(avance(pz, 4.9), 0); assert.ok(pz.entra + pz.dura <= 28); }
  assert.deepEqual(PASOS.map((p) => estado(p.hasta - 0.1).paso), [0, 1, 2, 3]);
});

const PERFUMES = PRODUCTOS.filter((p) => p.categoriaId === 'aroma').map(datosPerfume);

test('aroma: los 29 perfumes del dueño tienen familia, género y foto, y ninguno tiene precio inventado', () => {
  assert.equal(PERFUMES.length, 29);
  assert.equal(PERFUMES.filter((p) => p.genero === 'mujer').length, 20);
  assert.equal(PERFUMES.filter((p) => p.genero === 'hombre').length, 9);
  for (const p of PERFUMES) {
    assert.ok(FAMILIAS.some((f) => f.id === p.familia), `${p.id}: familia`);
    assert.equal(p.precioCentavos, null, `${p.id}: el precio lo da el dueño`);
    assert.ok(p.fotos.length >= 1, `${p.id}: foto`);
  }
  assert.equal(PERFUMES.find((p) => p.id === 'joop-joop-homme').ml, 125);
});

test('aroma: un perfume del panel saca familia, género, tamaño e intensidad de su tabla de datos', () => {
  const p = datosPerfume({ id: 'x', nombre: 'X', descripcion: 'Rosa y jazmín.\n\n- Familia: Florales\n- Para: Mujer\n- Tamaño: 100 ml\n- Intensidad: Intensa' });
  assert.deepEqual([p.familia, p.genero, p.ml, p.intensidad, p.descripcion], ['floral', 'mujer', 100, 'intensa', 'Rosa y jazmín.']);
  assert.equal(datosPerfume({ id: 'y', nombre: 'Y', descripcion: 'Sin datos.' }).familia, null);
});

test('aroma: el recomendador filtra el catálogo, sin azar', () => {
  const r = { genero: 'hombre', caracter: 'fresco', intensidad: 'intensa', familia: 'fresca' };
  assert.deepEqual(recomendar(PERFUMES, r).map((p) => p.id), ['nautica-voyage-intense']);
  assert.deepEqual(recomendar(PERFUMES, r), recomendar(PERFUMES, r));
  const dulces = recomendar(PERFUMES, { genero: 'mujer', caracter: 'dulce', intensidad: 'intensa', familia: 'gourmand' });
  assert.deepEqual(dulces.map((p) => p.id), ['lattafa-eclaire']);
  assert.deepEqual(recomendar([], r), []);
  assert.equal(PREGUNTAS.length, 4);
});
