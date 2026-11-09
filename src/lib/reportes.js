// Números del panel: ventas, pedidos por estado, lo más vendido e inventario. Sin Firebase: se prueba con datos de ejemplo.
const fecha = (ts) => ts?.toDate?.() ?? (ts ? new Date(ts) : null);
const CUENTA_COMO_VENTA = ['confirmado', 'enviado', 'entregado'];

export function resumirVentas(pedidos, { meses = 6, hoy = new Date() } = {}) {
  const ventas = pedidos.filter((p) => CUENTA_COMO_VENTA.includes(p.estado));
  const total = ventas.reduce((s, p) => s + (p.totalCentavos ?? 0), 0);

  const porEstado = {};
  for (const p of pedidos) porEstado[p.estado] = (porEstado[p.estado] ?? 0) + 1;

  // Últimos N meses, del más viejo al actual, aunque alguno no tenga ventas.
  const porMes = [];
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    porMes.push({ clave: `${d.getFullYear()}-${d.getMonth()}`, fecha: d, totalCentavos: 0, pedidos: 0 });
  }
  for (const p of ventas) {
    const d = fecha(p.creadoEn);
    const mes = d && porMes.find((m) => m.clave === `${d.getFullYear()}-${d.getMonth()}`);
    if (mes) { mes.totalCentavos += p.totalCentavos ?? 0; mes.pedidos += 1; }
  }

  const unidades = {};
  for (const p of ventas) {
    for (const i of p.items ?? []) {
      const u = (unidades[i.productoId] ??= { productoId: i.productoId, nombre: i.nombre, cantidad: 0, totalCentavos: 0 });
      u.cantidad += i.cantidad;
      u.totalCentavos += (i.precioCentavos ?? 0) * i.cantidad;
    }
  }
  const masVendidos = Object.values(unidades).sort((a, b) => b.cantidad - a.cantidad || b.totalCentavos - a.totalCentavos).slice(0, 5);

  return {
    totalCentavos: total,
    ventas: ventas.length,
    ticketPromedioCentavos: ventas.length ? Math.round(total / ventas.length) : 0,
    porEstado,
    porMes,
    masVendidos,
  };
}

// Qué revisar del catálogo: agotados, pocas unidades, sin precio, sin foto o en borrador.
export function alertasInventario(productos) {
  return {
    agotados: productos.filter((p) => p.stock === 0),
    pocos: productos.filter((p) => p.stock != null && p.stock > 0 && p.stock < 3),
    sinContar: productos.filter((p) => p.stock == null),
    sinPrecio: productos.filter((p) => p.precioCentavos == null && !(p.variantes ?? []).some((v) => v.precioCentavos != null)),
    sinFoto: productos.filter((p) => !p.fotos?.length),
    borradores: productos.filter((p) => p.estado !== 'publicado'),
  };
}
