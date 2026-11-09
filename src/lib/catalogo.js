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
