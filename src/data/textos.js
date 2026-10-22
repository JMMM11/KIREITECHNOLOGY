// Textos de cada sección. Los componentes no escriben copy a mano.
import { formatoPrecio } from '../lib/formatoPrecio.js';
import { SITIO, TARIFAS } from './sitio.js';

// Portada: la foto se recoge en una tarjeta al bajar. Los botones se ven desde el primer momento.
export const HERO = {
  foto: { src: 'Productos/principal.png', ancho: 2560, alto: 1440 },
  titulo: 'Tecnología que te acompaña todo el día.',
  texto: `Audífonos, relojes y accesorios con garantía. Retira gratis o recibe en casa por ${formatoPrecio(TARIFAS.envioDomicilio)}.`,
  principal: { texto: 'Ver tecnología', a: '/tecnologia' },
  secundario: { texto: 'Reparaciones', a: '/reparaciones' },
};

export const INICIO = {
  secciones: { titulo: 'Elige una sección.' },
  pedidos: { titulo: 'Lo más pedido.', enlace: 'Ver toda la tecnología' },
  garantias: [
    { id: 'garantia', valor: 1, sufijo: ' semana', texto: 'de garantía en electrónica' },
    { id: 'retiro', valor: 0, prefijo: '$', texto: 'por retiro, lo coordinamos por WhatsApp' },
    { id: 'envio', valor: TARIFAS.envioDomicilio / 100, prefijo: '$', texto: 'envío a domicilio en Panamá' },
    { id: 'pago', valor: TARIFAS.contraEntregaMinimo / 100, prefijo: '$', texto: 'mínimo para pagar contra entrega' },
  ],
  reparaciones: {
    titulo: '¿Tu computadora falla?',
    texto: 'Diagnóstico, cambio de pantalla, batería o teclado e instalación de Windows.',
    accion: 'Agendar reparación',
  },
};

// Ayuda: cada tema es una fila que se abre. "resumen" se lee con la fila cerrada.
export const AYUDA = [
  {
    id: 'garantia', titulo: 'Garantía', resumen: '1 semana o según el daño',
    parrafos: [SITIO.garantia, 'Si algo falla, escríbenos por WhatsApp. Revisamos el equipo y te decimos qué cubre.'],
  },
  {
    id: 'envios', titulo: 'Entregas', resumen: `Retiro gratis, domicilio ${formatoPrecio(TARIFAS.envioDomicilio)}`,
    parrafos: [
      'Retiro: gratis. Coordinamos el lugar y la hora por WhatsApp.',
      `Envío a domicilio: ${formatoPrecio(TARIFAS.envioDomicilio)} dentro de Panamá.`,
      `Punto de encuentro: ${formatoPrecio(TARIFAS.envioPuntoEncuentro)}.`,
      SITIO.cobertura,
    ],
  },
  {
    id: 'pagos', titulo: 'Pagos', resumen: `${SITIO.pagoEnLinea} o efectivo`,
    parrafos: [
      `Pago en línea con ${SITIO.pagoEnLinea}: [pendiente]. Mientras tanto, te enviamos los datos de pago por WhatsApp.`,
      `Contra entrega: en pedidos desde ${formatoPrecio(TARIFAS.contraEntregaMinimo)}, con un cargo de ${formatoPrecio(TARIFAS.contraEntregaCargo)}.`,
      'No guardamos datos de pago.',
    ],
  },
  {
    id: 'pedidos', titulo: 'Estado de tu pedido', resumen: 'Recibido, confirmado, enviado y entregado',
    parrafos: ['Cada pedido pasa por estos estados. Te avisamos por WhatsApp en cada cambio.'],
    pasos: [
      { estado: 'recibido', texto: 'Recibimos tu pedido.' },
      { estado: 'confirmado', texto: 'Te respondimos por WhatsApp y el pedido queda confirmado.' },
      { estado: 'enviado', texto: 'Va en camino o está listo para retirar.' },
      { estado: 'entregado', texto: 'Ya lo tienes.' },
    ],
  },
];

// Documentos legales: van en el pie, como pestañas de una página aparte.
export const LEGAL = [
  {
    id: 'privacidad', titulo: 'Privacidad', tituloLargo: 'Política de privacidad',
    parrafos: [
      'Usamos tu nombre, teléfono, correo y dirección solo para gestionar tu pedido o tu cita.',
      'Puedes pedirnos ver, corregir o borrar tus datos escribiéndonos por WhatsApp.',
      'Tratamos tus datos según la Ley 81 de 2019 sobre protección de datos personales de Panamá.',
      '[Responsable del tratamiento, plazo de conservación y demás datos legales: pendiente de revisión legal.]',
    ],
  },
  {
    id: 'terminos', titulo: 'Términos y condiciones', tituloLargo: 'Términos y condiciones',
    parrafos: ['Los precios están en dólares.', 'Tu pedido queda confirmado cuando te respondemos por WhatsApp.', '[Términos completos: pendiente de revisión legal.]'],
  },
];
