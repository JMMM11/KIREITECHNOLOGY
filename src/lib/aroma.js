import { leerDescripcion, normalizar, resumenDescripcion } from './catalogo.js';
import { FAMILIAS } from '../data/aroma.js';

const DULCES = ['gourmand', 'oriental', 'floral'];
const dato = (specs, nombre) => specs.find((s) => normalizar(s.dato) === nombre)?.valor ?? '';
const familiaDe = (texto) => FAMILIAS.find((f) => normalizar(f.nombre).startsWith(normalizar(texto).slice(0, 5)) || f.id === normalizar(texto))?.id ?? null;

// Un perfume listo para la página: los de muestra ya traen sus campos; los reales (del panel) los sacan de su tabla de datos.
export function datosPerfume(p) {
  if (p.familia) return p;
  const { specs } = leerDescripcion(p.descripcion);
  const tam = dato(specs, 'tamano') || dato(specs, 'presentacion');
  return {
    ...p,
    descripcion: resumenDescripcion(p.descripcion),
    familia: familiaDe(dato(specs, 'familia') || dato(specs, 'familia olfativa')),
    ml: Number.parseInt(tam, 10) || null,
    intensidad: normalizar(dato(specs, 'intensidad')).startsWith('int') ? 'intensa' : normalizar(dato(specs, 'intensidad')) ? 'suave' : null,
    momento: normalizar(dato(specs, 'momento')).startsWith('noc') ? 'noche' : normalizar(dato(specs, 'momento')) ? 'dia' : null,
  };
}

// Recomendador: un punto por respuesta que coincide. Devuelve los de mayor puntaje (mínimo 2), en el orden del catálogo.
// No hay azar: las mismas respuestas dan siempre los mismos perfumes.
export function recomendar(perfumes, r) {
  const puntos = (p) =>
    (r.caracter && (DULCES.includes(p.familia) ? 'dulce' : 'fresco') === r.caracter ? 1 : 0)
    + (r.intensidad && p.intensidad === r.intensidad ? 1 : 0)
    + (r.momento && p.momento === r.momento ? 1 : 0)
    + (r.familia && p.familia === r.familia ? 1 : 0);
  const con = perfumes.map((p) => [p, puntos(p)]);
  const mejor = Math.max(0, ...con.map(([, n]) => n));
  return mejor < 2 ? [] : con.filter(([, n]) => n === mejor).map(([p]) => p);
}
