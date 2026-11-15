// Guion del desarme de la laptop y lógica de Aroma (familias, lectura de perfumes del panel y recomendador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DURACION, INICIO_CICLO, PASOS, PIEZAS, T_DESARMADA, avance, estado } from '../src/components/reparaciones/laptop/secuencia.js';
import { FAMILIAS, PERFUMES_MUESTRA, PREGUNTAS } from '../src/data/aroma.js';
import { datosPerfume, recomendar } from '../src/lib/aroma.js';
import { contraste } from './contraste.test.js';

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

test('aroma: cada familia se lee sobre su color y el catálogo de muestra está marcado', () => {
  for (const f of FAMILIAS) assert.ok(contraste(f.tinta, f.tono) >= 4.5, `${f.nombre}: ${contraste(f.tinta, f.tono).toFixed(2)}`);
  assert.ok(PERFUMES_MUESTRA.every((p) => p.ejemplo === true && FAMILIAS.some((f) => f.id === p.familia)));
  assert.deepEqual([...new Set(PERFUMES_MUESTRA.map((p) => p.familia))].sort(), FAMILIAS.map((f) => f.id).sort());
});

test('aroma: un perfume del panel saca familia, tamaño, intensidad y momento de su tabla de datos', () => {
  const p = datosPerfume({ id: 'x', nombre: 'X', descripcion: 'Rosa y jazmín.\n\n- Familia: Florales\n- Tamaño: 100 ml\n- Intensidad: Intensa\n- Momento: Noche' });
  assert.deepEqual([p.familia, p.ml, p.intensidad, p.momento, p.descripcion], ['floral', 100, 'intensa', 'noche', 'Rosa y jazmín.']);
});

test('aroma: el recomendador filtra el catálogo, sin azar', () => {
  const r = { caracter: 'dulce', intensidad: 'intensa', momento: 'noche', familia: 'oriental' };
  assert.deepEqual(recomendar(PERFUMES_MUESTRA, r).map((p) => p.id), ['ambar-nocturno']);
  assert.deepEqual(recomendar(PERFUMES_MUESTRA, r), recomendar(PERFUMES_MUESTRA, r));
  assert.deepEqual(recomendar(PERFUMES_MUESTRA, { caracter: 'fresco', intensidad: 'suave', momento: 'dia', familia: 'citrica' }).map((p) => p.id), ['citrico-507']);
  assert.deepEqual(recomendar([], r), []);
  assert.equal(PREGUNTAS.length, 4);
});
