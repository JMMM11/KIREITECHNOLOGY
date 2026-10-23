// Lógica pura del editor de productos (probada en tests/admin.test.js).

// "20", "20.5", "20,50" -> centavos. Vacío -> null (pendiente). Inválido -> NaN.
export function aCentavos(texto) {
  const v = texto.trim().replace(',', '.');
  if (!v) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(v)) return NaN;
  return Math.round(Number(v) * 100);
}

export const idDesdeNombre = (nombre) =>
  nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// orden: índices viejos en su nuevo orden. Los colores siguen apuntando a la misma foto; si se quitó, quedan sin foto.
export function reordenarFotos({ fotos, variantes }, orden) {
  return {
    fotos: orden.map((i) => fotos[i]),
    variantes: variantes.map((v) => ({ ...v, foto: v.foto == null || !orden.includes(v.foto) ? null : orden.indexOf(v.foto) })),
  };
}
