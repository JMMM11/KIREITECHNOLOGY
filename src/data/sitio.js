export const SITIO = {
  nombre: 'Kirei Technology',
  lema: 'POWER UP YOUR BEST SELF', // pendiente de confirmar
  telefono: '+507 6156 0839',
  whatsapp: '50761560839',
  correo: '', // [pendiente]: al definirlo, las citas también se pueden enviar por correo a la tienda
  instagram: ['kireitechnology'], // cuentas de Instagram, sin @
  ubicacion: 'Panamá Oeste, Montelimar, Calle Los Vientos',
  ubicacionPendiente: true,
  garantia: 'Garantía de 1 semana o según el daño, con revisión técnica.',
  cobertura: 'Envíos solo dentro de Panamá.',
  pagoEnLinea: 'Yappy',
  yappy: '@kireitechnology', // usuario de Yappy de la tienda (imagen de pedidos del dueño)
  // Cómo se paga un pedido con Yappy, tal como lo explica la tienda.
  pasosPedido: [
    'Escríbenos por WhatsApp con el artículo que te interesa.',
    'Búscanos en Yappy como @kireitechnology.',
    'Abona el 50% del artículo.',
    'Envíanos el comprobante por WhatsApp.',
  ],
  tiempoPorPedido: 'Los productos abonados llegan en 15 días (sin contar fines de semana). El saldo pendiente se paga al entregar el producto.',
  // Mientras sea true se muestran los estados de ejemplo y un aviso. Al lanzar, poner en false.
  vistaPrevia: false,
  // UID del dueño: el único que da acceso al panel a otras personas. Debe coincidir con firestore.rules.
  duenoUid: 'SiAnST1DF5RATL2pq75ehocMwD73',
  // Productos de más de este monto (centavos) se traen por pedido. Datos de la imagen de pedidos del dueño.
  porPedidoDesde: 6000,
  porPedido: 'Producto por pedido: se reserva abonando el 50% por Yappy (@kireitechnology) y llega en 15 días, sin contar fines de semana. El saldo se paga al entregarlo.',
};

// Montos en centavos. null = por confirmar.
export const TARIFAS = {
  envioDomicilio: 500,
  envioPuntoEncuentro: null,
  contraEntregaMinimo: 3000,
  contraEntregaCargo: 500,
};
