// Textos de cada sección. Los componentes no escriben copy a mano.
import { formatoPrecio } from '../lib/formatoPrecio.js';
import { SITIO, TARIFAS } from './sitio.js';

// Portada: la foto se recoge en una tarjeta al bajar. Los botones se ven desde el primer momento.
export const HERO = {
  foto: { src: 'Productos/principal.png', ancho: 2560, alto: 1440 },
  titulo: 'Tecnología que te acompaña',
  // Se escriben una tras otra en la portada; la primera es la que leen los lectores de pantalla.
  frases: ['todo el día.', 'en cada llamada.', 'en tus partidas.', 'a donde vayas.'],
  texto: `Audífonos, relojes y accesorios con garantía. Retira gratis o recibe en casa por ${formatoPrecio(TARIFAS.envioDomicilio)}.`,
  principal: { texto: 'Explorar tecnología', a: '/tecnologia' },
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
    accion: 'Agenda tu diagnóstico',
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
// Formato: string normal = párrafo, '## Título' = encabezado de sección, string[] = lista con viñetas.
export const LEGAL = [
  {
    id: 'privacidad',
    titulo: 'Privacidad',
    tituloLargo: 'Política de privacidad',
    parrafos: [
      'Esta política explica cómo Kirei Technology recopila, usa y protege tus datos personales, de conformidad con la Ley 81 de 2019 sobre Protección de Datos Personales de la República de Panamá (LPDP) y su Decreto Ejecutivo 285 de 2021.',

      '## 1. Responsable del tratamiento',
      'El responsable del tratamiento de tus datos es Kirei Technology, con domicilio en Panamá Oeste, Montelimar, Calle Los Vientos [pendiente: número de local y RUC]. Puedes contactarnos por WhatsApp al +507 6156 0839 o al correo [pendiente].',

      '## 2. Datos que recopilamos',
      'Recopilamos únicamente los datos necesarios para gestionar tu pedido o cita:',
      ['Nombre completo.', 'Número de teléfono (WhatsApp).', 'Correo electrónico (opcional al hacer pedido).', 'Dirección de entrega, cuando solicitas envío a domicilio.', 'Historial de pedidos dentro de la tienda.'],
      'No recopilamos datos sensibles como cédula, datos bancarios completos ni información de salud.',

      '## 3. Finalidad del tratamiento',
      'Usamos tus datos exclusivamente para:',
      ['Procesar y coordinar tu pedido o cita de reparación.', 'Enviarte actualizaciones sobre el estado de tu pedido por WhatsApp.', 'Responder tus consultas.', 'Cumplir obligaciones legales y fiscales.'],
      'No usamos tus datos para publicidad de terceros ni los cedemos a empresas externas con fines comerciales.',

      '## 4. Base legal del tratamiento',
      'El tratamiento de tus datos se realiza bajo las siguientes bases legales (Art. 10, Ley 81):',
      ['Ejecución de un contrato de compraventa: para procesar tu pedido.', 'Consentimiento del titular: cuando nos proporcionas datos de forma voluntaria, como tu correo.', 'Interés legítimo: para comunicarte el estado de tu pedido y atender tus reclamos.', 'Cumplimiento de obligación legal: para efectos fiscales y comerciales.'],

      '## 5. Tiempo de conservación',
      'Conservamos tus datos mientras sea necesario para los fines indicados. El historial de pedidos se conserva por un máximo de 5 años, en cumplimiento de las obligaciones fiscales y comerciales de la República de Panamá. Después de ese plazo, los datos se eliminan o anonimizamos.',

      '## 6. Tus derechos (ARCO + portabilidad)',
      'De acuerdo con la Ley 81 de 2019, tienes los siguientes derechos sobre tus datos:',
      ['Acceso: conocer qué datos personales tuyos tenemos y cómo los usamos.', 'Rectificación: solicitar la corrección de datos inexactos o incompletos.', 'Cancelación o supresión: pedir que eliminemos tus datos cuando ya no sean necesarios.', 'Oposición: oponerte al tratamiento en determinadas circunstancias.', 'Portabilidad: recibir tus datos en un formato estructurado y de uso común.', 'Revocación del consentimiento: retirar en cualquier momento el consentimiento dado, sin que ello afecte la licitud del tratamiento anterior.'],
      'Para ejercer cualquiera de estos derechos, escríbenos por WhatsApp al +507 6156 0839 o al correo [pendiente], indicando tu nombre y el derecho que deseas ejercer. Respondemos en un plazo máximo de 30 días hábiles.',

      '## 7. Transferencia de datos',
      'Kirei Technology no vende, alquila ni cede tus datos a terceros con fines comerciales. Para operar la tienda utilizamos servicios de Firebase (Google LLC), que actúan como encargados del tratamiento bajo condiciones contractuales adecuadas y políticas de privacidad propias. Google LLC está adherido al Privacy Shield y cuenta con cláusulas contractuales tipo para transferencias internacionales.',

      '## 8. Seguridad',
      'Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra acceso no autorizado, pérdida o destrucción: cifrado en tránsito (HTTPS/TLS), controles de acceso por roles en la base de datos y copias de seguridad periódicas. En caso de incidente de seguridad que afecte tus datos, te notificaremos en el plazo legalmente exigido.',

      '## 9. Cookies y analítica',
      'La tienda puede utilizar cookies técnicas necesarias para el funcionamiento de la sesión y el carrito. [Pendiente: especificar si se usa Google Analytics u otra herramienta y añadir aviso de cookies en pantalla.] Puedes configurar tu navegador para rechazar cookies, aunque algunas funciones pueden verse afectadas.',

      '## 10. Menores de edad',
      'Esta tienda no está dirigida a menores de 18 años. Si eres menor, necesitas la autorización de tu padre, madre o tutor legal para realizar un pedido. No recopilamos datos de menores de forma consciente.',

      '## 11. Modificaciones a esta política',
      'Podemos actualizar esta política cuando cambien nuestras prácticas o la legislación. La fecha de la última actualización aparece al pie de este documento. El uso continuado de la tienda después de la publicación de cambios implica la aceptación de la política actualizada.',

      '## 12. Contacto y autoridad de control',
      'Para cualquier consulta sobre esta política o el tratamiento de tus datos, contáctanos por WhatsApp al +507 6156 0839. Si consideras que tus derechos no han sido atendidos, puedes presentar una reclamación ante la Autoridad Nacional de Transparencia y Acceso a la Información (ANTAI), que es la autoridad de control en materia de protección de datos en Panamá. Más información en www.antai.gob.pa.',

      'Última actualización: octubre 2026. [Pendiente: revisión por asesor legal antes de publicar.]',
    ],
  },
  {
    id: 'terminos',
    titulo: 'Términos',
    tituloLargo: 'Términos y condiciones',
    parrafos: [
      'Estos términos y condiciones regulan el uso de la tienda en línea de Kirei Technology y la relación comercial entre el comprador y el vendedor, de conformidad con el Código de Comercio de la República de Panamá y la Ley 45 de 2007 sobre Protección al Consumidor y Defensa de la Competencia.',

      '## 1. Identificación del vendedor',
      'Kirei Technology, con domicilio en Panamá Oeste, Montelimar, Calle Los Vientos [pendiente: número de local y RUC]. Teléfono de contacto: +507 6156 0839 (WhatsApp). Correo: [pendiente].',

      '## 2. Aceptación',
      'Al realizar un pedido en esta tienda, el comprador declara haber leído y aceptado estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de los términos, no realices la compra.',

      '## 3. Productos y precios',
      'Todos los precios están expresados en dólares estadounidenses (USD), moneda de curso legal en la República de Panamá. Los precios incluyen los impuestos aplicables conforme a la ley panameña. Kirei Technology se reserva el derecho de modificar precios en cualquier momento, pero el precio que se aplicará a tu pedido será el vigente en el momento en que confirmes la compra por WhatsApp.',
      'Nos esforzamos por mantener la información de los productos actualizada. En caso de error evidente en el precio, nos comunicaremos contigo antes de procesar el pedido.',

      '## 4. Proceso de compra y confirmación',
      'El contrato de compraventa queda perfeccionado cuando Kirei Technology confirma tu pedido por WhatsApp. Los pasos del proceso son:',
      ['Seleccionas los productos y completas el formulario de pedido en la tienda.', 'Recibes un mensaje de WhatsApp de confirmación con el resumen del pedido y los datos de pago.', 'Realizas el pago según las instrucciones recibidas.', 'Kirei Technology confirma la recepción del pago y coordina la entrega.'],
      'Kirei Technology puede rechazar o cancelar un pedido por causas justificadas (falta de stock, error en el precio, datos incorrectos), en cuyo caso se te notificará de inmediato y se devolverá el importe pagado.',

      '## 5. Métodos de pago',
      'Aceptamos los siguientes métodos de pago:',
      ['Yappy (pago móvil): los datos se envían por WhatsApp al confirmar el pedido.', 'Contra entrega: disponible en pedidos desde $30.00, con un cargo adicional de $5.00. Solo para entregas dentro de Panamá.'],
      'No almacenamos datos de tarjetas de crédito ni débito. Las transacciones se procesan a través de plataformas de pago seguras.',

      '## 6. Entregas y envíos',
      'Realizamos entregas exclusivamente dentro de la República de Panamá, bajo las siguientes modalidades:',
      ['Retiro gratis: el cliente coordina el lugar y la hora de encuentro por WhatsApp sin costo adicional.', 'Envío a domicilio: $5.00 (tarifa única dentro de Panamá). Los tiempos de entrega son estimados y pueden variar.', 'Punto de encuentro: tarifa a confirmar según la ubicación.'],
      'Los tiempos de entrega son estimados. Kirei Technology no se hace responsable de demoras ocasionadas por situaciones fuera de su control (clima, restricciones de tráfico, etc.). En caso de retraso significativo, te notificaremos por WhatsApp.',

      '## 7. Garantía',
      'Todos los productos vendidos por Kirei Technology cuentan con garantía de 1 semana o según el daño, con revisión técnica. Esta garantía cubre defectos de fabricación o funcionamiento no causados por mal uso del producto. Para hacer válida la garantía:',
      ['Contáctanos por WhatsApp al +507 6156 0839 dentro del plazo de garantía.', 'Describe el problema y, si es posible, adjunta fotos o video.', 'Coordinamos la revisión técnica del equipo.'],
      'La garantía no cubre daños por caídas, humedad, mal uso, modificaciones no autorizadas o desgaste natural.',

      '## 8. Devoluciones',
      'Puedes solicitar la devolución de un producto dentro de los 7 días hábiles siguientes a la recepción, siempre que:',
      ['El producto esté en las mismas condiciones en que fue entregado (sin uso, sin daños, con embalaje original).', 'Nos contactes por WhatsApp antes de devolver el producto para coordinar el proceso.'],
      'Los gastos de devolución corren por cuenta del comprador, salvo que el motivo sea un defecto imputable a Kirei Technology. La devolución del importe se realizará por el mismo método de pago utilizado en un plazo máximo de 10 días hábiles tras recibir y revisar el producto.',
      'De conformidad con la Ley 45 de 2007, el consumidor tiene derecho a retractarse de la compra en ventas a distancia dentro del plazo legal establecido.',

      '## 9. Responsabilidad',
      'Kirei Technology no será responsable de daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso de los productos adquiridos, más allá de lo establecido por la legislación panameña de protección al consumidor. Nuestra responsabilidad máxima se limita al valor del producto adquirido.',

      '## 10. Propiedad intelectual',
      'Todos los contenidos de esta tienda (imágenes, textos, logotipos, diseño) son propiedad de Kirei Technology o de sus respectivos titulares, y están protegidos por la Ley 35 de 1996 sobre Propiedad Industrial y la Ley 15 de 1994 sobre Derecho de Autor de la República de Panamá. Queda prohibida su reproducción o uso sin autorización previa y por escrito.',

      '## 11. Ley aplicable y resolución de conflictos',
      'Estos términos se rigen por la legislación de la República de Panamá. Cualquier controversia que surja de la relación comercial se someterá a los tribunales competentes de la República de Panamá. Antes de acudir a la vía judicial, te invitamos a contactarnos para resolver el problema de forma amistosa.',
      'Si como consumidor consideras que tus derechos han sido vulnerados, puedes presentar una queja ante la Autoridad de Protección al Consumidor y Defensa de la Competencia (ACODECO) en www.acodeco.gob.pa.',

      '## 12. Contacto',
      'Para cualquier consulta relacionada con tu pedido o estos términos, contáctanos por WhatsApp al +507 6156 0839 o al correo [pendiente]. Atendemos de lunes a sábado de [pendiente: horario].',

      'Última actualización: octubre 2026. [Pendiente: revisión por asesor legal antes de publicar.]',
    ],
  },
];
