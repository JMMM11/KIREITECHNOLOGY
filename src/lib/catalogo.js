// Búsqueda y orden del catálogo. Sin tildes ni mayúsculas para que "audifonos" encuentre "Audífonos".
export const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

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

export function filtrarCatalogo(productos, { categoria = '', texto = '', orden = 'relevancia', soloDisponibles = false } = {}) {
  const q = normalizar(texto);
  return productos
    .filter((p) => !categoria || p.categoriaId === categoria)
    .filter((p) => !soloDisponibles || (p.estadoVenta !== 'agotado' && p.precioCentavos != null))
    .filter((p) => !q || normalizar(`${p.nombre} ${p.marca ?? ''} ${p.descripcion ?? ''}`).includes(q))
    .sort(ORDENADORES[orden] ?? ORDENADORES.relevancia);
}
