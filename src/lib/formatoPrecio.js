// Dinero siempre en centavos enteros. Se muestra en dólares, como en los anuncios de la tienda.
export function formatoPrecio(centavos) {
  if (centavos == null) return '[pendiente]';
  if (!Number.isInteger(centavos)) throw new TypeError('El monto debe ser un entero en centavos');
  const signo = centavos < 0 ? '-' : '';
  const abs = Math.abs(centavos);
  const enteros = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${signo}$${enteros}.${String(abs % 100).padStart(2, '0')}`;
}

export function porcentajeDescuento(precio, precioAntes) {
  if (precio == null || precioAntes == null || precioAntes <= precio) return 0;
  return Math.round((1 - precio / precioAntes) * 100);
}
