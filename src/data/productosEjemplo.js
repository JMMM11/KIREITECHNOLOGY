// Datos de vista previa. Solo se usan con SITIO.vistaPrevia = true y se marcan con "Ejemplo".
// No inventan productos ni precios: aplican estados de muestra sobre productos reales para ver cada insignia.
// "En oferta" necesita un precio anterior real; no hay ejemplo hasta que el dueño defina una oferta.
export const ESTADOS_EJEMPLO = {
  'lenovo-gm2-pro': { nuevo: true },
  'reloj-dorado': { stock: 2 },
  'lampara-led-anime': { stock: 0 },
};

const item = (productoId, nombre, precioCentavos, cantidad) => ({ productoId, nombre, precioCentavos, cantidad });

export const PEDIDOS_EJEMPLO = [
  { id: 'EJ-1041', estado: 'recibido', creadoEn: '2026-10-20', items: [item('lenovo-gm2-pro', 'Lenovo GM2 Pro', 2000, 1)], entrega: 'retiro', totalCentavos: 2000 },
  { id: 'EJ-1038', estado: 'confirmado', creadoEn: '2026-10-19', items: [item('razer-pikachu', 'Audífonos Razer Edición Pikachu', 5000, 1)], entrega: 'domicilio', totalCentavos: 5500 },
  { id: 'EJ-1032', estado: 'enviado', creadoEn: '2026-10-17', items: [item('redmi-buds-4-harry-potter', 'Redmi Buds 4 Edición Harry Potter', 10000, 1)], entrega: 'domicilio', totalCentavos: 10500 },
  { id: 'EJ-1027', estado: 'entregado', creadoEn: '2026-10-15', items: [item('lenovo-gm2-pro', 'Lenovo GM2 Pro', 2000, 2)], entrega: 'punto_encuentro', totalCentavos: 4000 },
].map((p) => ({ ...p, ejemplo: true }));
