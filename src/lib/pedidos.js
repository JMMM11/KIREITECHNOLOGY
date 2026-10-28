// Lógica pura de pedidos (probada en tests/pedidos.test.js). Lo que valida aquí lo vuelve a exigir firestore.rules.

// Orden del flujo; "cancelado" se puede elegir en cualquier momento desde el panel.
export const ESTADOS_PEDIDO = ['recibido', 'confirmado', 'enviado', 'entregado', 'cancelado'];
export const ENTREGAS_PEDIDO = ['retiro', 'punto_encuentro', 'domicilio'];
export const PAGOS_PEDIDO = ['linea', 'contra_entrega'];
export const MAX_ITEMS = 30;

// El contador vive en Firestore (contadores/pedidos.ultimo). Sin documento, el primero es KT-1001.
export const siguienteNumero = (ultimo) => (Number.isInteger(ultimo) ? ultimo : 1000) + 1;
export const idPedido = (numero) => `KT-${numero}`;

const texto = (v, max) => String(v ?? '').trim().slice(0, max);

// Deja el pedido con la forma exacta que aceptan las reglas: sin undefined, textos recortados, totales coherentes.
// uid: el del cliente con sesión (aparece en Mis pedidos) o null si compra sin cuenta.
export function armarPedido({ uid, cliente, entrega, pago, items, totales, nota }) {
  if (!items?.length) throw new Error('El pedido no tiene productos.');
  if (items.length > MAX_ITEMS) throw new Error(`Máximo ${MAX_ITEMS} productos distintos por pedido.`);
  if (!ENTREGAS_PEDIDO.includes(entrega)) throw new Error(`Entrega desconocida: ${entrega}`);
  if (!PAGOS_PEDIDO.includes(pago)) throw new Error(`Pago desconocido: ${pago}`);
  const subtotalCentavos = totales.subtotal;
  const envioCentavos = totales.envio ?? null;
  const cargoContraEntregaCentavos = totales.cargoContraEntrega ?? 0;
  return {
    uid: uid ?? null,
    estado: 'recibido',
    cliente: {
      nombre: texto(cliente.nombre, 80),
      telefono: texto(cliente.telefono, 20),
      correo: texto(cliente.correo, 120),
      direccion: entrega === 'domicilio' ? texto(cliente.direccion, 300) : '',
    },
    entrega,
    pago,
    nota: texto(nota, 500),
    items: items.map((i) => ({
      productoId: String(i.productoId),
      variante: texto(i.variante, 60),
      nombre: texto(i.nombre, 120),
      varianteNombre: texto(i.varianteNombre, 60),
      precioCentavos: i.precioCentavos,
      cantidad: i.cantidad,
      foto: i.foto ?? null,
    })),
    subtotalCentavos,
    envioCentavos,
    cargoContraEntregaCentavos,
    totalCentavos: subtotalCentavos + (envioCentavos ?? 0) + cargoContraEntregaCentavos,
  };
}

// Pedidos guardados antes del contador traían el número en el campo "numero" como texto (KT-XXXXXX).
export const etiquetaPedido = (p) => (typeof p.numero === 'string' ? p.numero : p.id);
