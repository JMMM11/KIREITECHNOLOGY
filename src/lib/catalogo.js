// Búsqueda y orden del catálogo. Sin tildes ni mayúsculas para que "audifonos" encuentre "Audífonos".
export const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Cada opción (color, presentación) puede tener su propio precio; si no, vale el del producto.
export const precioDe = (p, v) => v?.precioCentavos ?? p.precioCentavos;
export const variosPrecios = (p) => new Set((p.variantes ?? []).map((v) => precioDe(p, v))).size > 1;

// El cliente solo ve las unidades cuando quedan menos de 3; el número exacto es para el admin.
export const quedanPocas = (stock) => stock != null && stock > 0 && stock < 3;

const porPrecio = (dir) => (a, b) => {
  if (a.precioCentavos == null) return 1;
  if (b.precioCentavos == null) return -1;
  return dir * (a.precioCentavos - b.precioCentavos);
};

const ORDENADORES = {
  relevancia: (a, b) => Number(!!b.destacado) - Number(!!a.destacado) || a.nombre.localeCompare(b.nombre, 'es'),
  'precio-asc': porPrecio(1),
  'precio-desc': porPrecio(-1),
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
};

// tambienEn: categorías extra donde también aparece (el reloj One Piece es anime y reloj).
export const enCategoria = (p, id) => p.categoriaId === id || !!p.tambienEn?.includes(id);

export function filtrarCatalogo(productos, { categoria = '', texto = '', orden = 'relevancia', soloDisponibles = false } = {}) {
  const q = normalizar(texto);
  return productos
    .filter((p) => !categoria || enCategoria(p, categoria))
    .filter((p) => !soloDisponibles || (p.estadoVenta !== 'agotado' && p.precioCentavos != null))
    .filter((p) => !q || normalizar(`${p.nombre} ${p.marca ?? ''} ${p.descripcion ?? ''}`).includes(q))
    .sort(ORDENADORES[orden] ?? ORDENADORES.relevancia);
}

// Descripción con formato simple: párrafos separados por una línea en blanco y listas con "- " al inicio de cada línea.
export function partirDescripcion(texto = '') {
  return texto.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const lineas = b.split('\n').map((l) => l.trim());
    return lineas.every((l) => l.startsWith('- '))
      ? { tipo: 'lista', items: lineas.map((l) => l.slice(2)) }
      : { tipo: 'parrafo', texto: lineas.join(' ') };
  });
}
// Primer párrafo: va junto al precio y en la descripción para Google.
export const resumenDescripcion = (texto = '') => partirDescripcion(texto).find((b) => b.tipo === 'parrafo')?.texto ?? '';
// Todo en una línea, para los datos estructurados.
export const descripcionPlana = (texto = '') => partirDescripcion(texto).map((b) => (b.tipo === 'lista' ? b.items.join('. ') : b.texto)).join(' ');

// Para el editor del panel: la descripción en tres partes (presentación, tabla de datos y nota final) y de vuelta a texto.
export function leerDescripcion(texto = '') {
  const bloques = partirDescripcion(texto);
  const intro = bloques[0]?.tipo === 'parrafo' ? bloques.shift().texto : '';
  const i = bloques.findIndex((b) => b.tipo === 'lista');
  const lista = i >= 0 ? bloques.splice(i, 1)[0].items : [];
  const specs = lista.map((it) => { const [dato, ...resto] = it.split(': '); return resto.length ? { dato, valor: resto.join(': ') } : { dato: '', valor: it }; });
  const nota = bloques.map((b) => (b.tipo === 'lista' ? b.items.map((x) => `- ${x}`).join('\n') : b.texto)).join('\n\n');
  return { intro, specs, nota };
}

export function armarDescripcion({ intro = '', specs = [], nota = '' }) {
  const filas = specs.map((s) => ({ dato: s.dato.trim().replace(/:$/, ''), valor: s.valor.trim().replace(/\s*\n\s*/g, ' ') })).filter((s) => s.valor);
  const lista = filas.map((s) => (s.dato ? `- ${s.dato}: ${s.valor}` : `- ${s.valor}`)).join('\n');
  return [intro.trim(), lista, nota.trim()].filter(Boolean).join('\n\n');
}
