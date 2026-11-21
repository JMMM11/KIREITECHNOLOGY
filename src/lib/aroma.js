import { leerDescripcion, normalizar, resumenDescripcion } from './catalogo.js';
import { FAMILIAS } from '../data/aroma.js';

const DULCES = ['gourmand', 'frutal'];
const dato = (specs, nombre) => normalizar(specs.find((s) => normalizar(s.dato) === nombre)?.valor ?? '');
const familiaDe = (texto) => (texto ? FAMILIAS.find((f) => normalizar(f.nombre).slice(0, 5) === texto.slice(0, 5))?.id ?? null : null);

// Un perfume listo para la página Aroma: familia, género, tamaño e intensidad salen de las filas de su tabla de datos
// (Familia, Para, Tamaño, Intensidad), así funcionan igual los del archivo y los que se crean en el panel.
export function datosPerfume(p) {
  const { specs } = leerDescripcion(p.descripcion);
  const intensidad = dato(specs, 'intensidad');
  return {
    ...p,
    descripcion: resumenDescripcion(p.descripcion),
    familia: familiaDe(dato(specs, 'familia')),
    genero: dato(specs, 'para').startsWith('hom') ? 'hombre' : dato(specs, 'para').startsWith('muj') ? 'mujer' : null,
    ml: Number.parseInt(dato(specs, 'tamano'), 10) || null,
    intensidad: intensidad.startsWith('int') ? 'intensa' : intensidad.startsWith('sua') ? 'suave' : null,
  };
}

// Recomendador: un punto por respuesta que coincide. Devuelve los de mayor puntaje (mínimo 2), en el orden del catálogo.
// No hay azar: las mismas respuestas dan siempre los mismos perfumes. Un dato que el perfume no tiene no suma.
export function recomendar(perfumes, r) {
  const puntos = (p) =>
    (r.genero && p.genero === r.genero ? 1 : 0)
    + (r.caracter && p.familia && (DULCES.includes(p.familia) ? 'dulce' : p.familia === 'fresca' ? 'fresco' : '') === r.caracter ? 1 : 0)
    + (r.intensidad && p.intensidad === r.intensidad ? 1 : 0)
    + (r.familia && p.familia === r.familia ? 1 : 0);
  const con = perfumes.map((p) => [p, puntos(p)]);
  const mejor = Math.max(0, ...con.map(([, n]) => n));
  return mejor < 2 ? [] : con.filter(([, n]) => n === mejor).map(([p]) => p);
}
