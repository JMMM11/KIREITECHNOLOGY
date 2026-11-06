// Textos de cada sección. Los componentes no escriben copy a mano.
import { formatoPrecio } from '../lib/formatoPrecio.js';
import { SITIO, TARIFAS } from './sitio.js';

// Portada: la foto se recoge en una tarjeta al bajar. Los botones se ven desde el primer momento.
export const HERO = {
  fotos: [
    { src: 'Productos/principal.png', ancho: 2560, alto: 1440 },
    { src: 'Productos/principal2.png', ancho: 1672, alto: 941 },
  ],
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
  // Logos recortados de la imagen de marcas del dueño (public/marcas/).
  marcas: {
    titulo: 'Marcas con las que trabajamos.',
    lista: [
      { nombre: 'Lenovo', logo: 'marcas/lenovo.png', ancho: 107, alto: 42 },
      { nombre: 'Xiaomi', logo: 'marcas/xiaomi.png', ancho: 90, alto: 85 },
      { nombre: 'LIGE', logo: 'marcas/lige.png', ancho: 130, alto: 66 },
      { nombre: 'Razer', logo: 'marcas/razer.png', ancho: 112, alto: 108 },
      { nombre: 'Samsung', logo: 'marcas/samsung.png', ancho: 98, alto: 40 },
      { nombre: 'Huawei', logo: 'marcas/huawei.png', ancho: 100, alto: 90 },
      { nombre: 'SHEIN', logo: 'marcas/shein.png', ancho: 100, alto: 34 },
      { nombre: 'Pokémon', logo: 'marcas/pokemon.png', ancho: 200, alto: 85 },
    ],
  },
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
      `Pago con ${SITIO.pagoEnLinea}: búscanos como ${SITIO.yappy} y envíanos el comprobante por WhatsApp.`,
      `Contra entrega: en pedidos desde ${formatoPrecio(TARIFAS.contraEntregaMinimo)}, con un cargo de ${formatoPrecio(TARIFAS.contraEntregaCargo)}.`,
      'No guardamos datos de pago.',
    ],
  },
  {
    id: 'por-pedido', titulo: 'Cómo hacer un pedido', resumen: 'Abono del 50% por Yappy, llega en 15 días',
    parrafos: [
      'Para realizar pedidos en la tienda puedes escribir a nuestro WhatsApp y seguir estos pasos:',
      ...SITIO.pasosPedido.map((p, i) => `${i + 1}. ${p}`),
      SITIO.tiempoPorPedido,
      `Los productos de más de ${formatoPrecio(SITIO.porPedidoDesde)} se traen por pedido.`,
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
      'El responsable del tratamiento de tus datos es [pendiente: nombre completo], persona natural que opera la tienda en línea Kirei Technology desde Panamá Oeste (RUC [pendiente]). No tenemos local abierto al público. Puedes contactar al responsable por WhatsApp al +507 6156 0839 o al correo [pendiente].',

      '## 2. Datos que recopilamos',
      'Recopilamos únicamente los datos necesarios para gestionar tu pedido o cita:',
      ['Nombre completo.', 'Número de teléfono (WhatsApp).', 'Correo electrónico (opcional al hacer pedido).', 'Dirección de entrega, cuando solicitas envío a domicilio.', 'Historial de pedidos dentro de la tienda.', 'Comentarios que publiques en un producto, que se muestran con tu nombre y la inicial de tu apellido.'],
      'No recopilamos datos sensibles como cédula, datos bancarios completos ni información de salud.',

      '## 3. Finalidad del tratamiento',
      'Usamos tus datos exclusivamente para:',
      ['Procesar y coordinar tu pedido o cita de reparación.', 'Enviarte actualizaciones sobre el estado de tu pedido por WhatsApp.', 'Responder tus consultas.', 'Cumplir obligaciones legales y fiscales.'],
      'No usamos tus datos para publicidad de terceros ni los cedemos a empresas externas con fines comerciales.',

      '## 4. Base legal del tratamiento',
      'El tratamiento de tus datos se realiza bajo las siguientes bases legales (Art. 10, Ley 81):',
      ['Ejecución de un contrato de compraventa: para procesar tu pedido.', 'Consentimiento del titular: cuando nos proporcionas datos de forma voluntaria, como tu correo.', 'Interés legítimo: para comunicarte el estado de tu pedido y atender tus reclamos.', 'Cumplimiento de obligación legal: para efectos fiscales y comerciales.'],

      '## 5. Tiempo de conservación',
      'Conservamos tus datos mientras sea necesario para los fines indicados. El historial de pedidos se conserva por un máximo de 5 años, en cumplimiento de las obligaciones fiscales y comerciales de la República de Panamá. Las cuentas que no se usen durante [pendiente: número de años] años se eliminan junto con su perfil, direcciones, favoritos y comentarios; sus pedidos se conservan solo por el plazo fiscal. Los comentarios publicados se conservan hasta que los borres o los ocultemos. Tu cuenta se conserva mientras no la elimines. Después de esos plazos, los datos se eliminan o anonimizamos.',

      '## 6. Tus derechos (ARCO + portabilidad)',
      'De acuerdo con la Ley 81 de 2019, tienes los siguientes derechos sobre tus datos:',
      ['Acceso: conocer qué datos personales tuyos tenemos y cómo los usamos.', 'Rectificación: solicitar la corrección de datos inexactos o incompletos.', 'Cancelación o supresión: pedir que eliminemos tus datos cuando ya no sean necesarios.', 'Oposición: oponerte al tratamiento en determinadas circunstancias.', 'Portabilidad: recibir tus datos en un formato estructurado y de uso común.', 'Revocación del consentimiento: retirar en cualquier momento el consentimiento dado, sin que ello afecte la licitud del tratamiento anterior.'],
      'Desde Mi cuenta, en Seguridad y privacidad, puedes descargar una copia de tus datos y eliminar tu cuenta. Para cualquier otro derecho, escríbenos por WhatsApp al +507 6156 0839 o al correo [pendiente], indicando tu nombre y el derecho que deseas ejercer. Respondemos en un plazo máximo de 30 días hábiles.',

      '## 7. Transferencia de datos',
      'Kirei Technology no vende, alquila ni cede tus datos a terceros con fines comerciales. Para operar la tienda utilizamos servicios de Firebase y Google Cloud (Google LLC), que actúan como encargados del tratamiento bajo sus condiciones contractuales y medidas de seguridad. Por esta razón, tus datos pueden almacenarse en servidores ubicados fuera de Panamá. Para subir fotos de productos usamos Cloudinary, que solo recibe las imágenes que publica el administrador. Si activamos el monitoreo de errores con Sentry (Functional Software, Inc., Estados Unidos), este recibe informes técnicos de fallos de la página (qué falló, en qué archivo y en qué navegador), sin tu nombre, correo, teléfono, dirección ni dirección IP. [Pendiente: confirmar si se activa Sentry y si se graban repeticiones de sesión.]',

      '## 8. Seguridad',
      'Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra acceso no autorizado, pérdida o destrucción: cifrado en tránsito (HTTPS/TLS), controles de acceso por roles en la base de datos y copias de seguridad periódicas. Solo el administrador de la tienda puede ver la lista de clientes, y el acceso al panel exige una cuenta protegida por contraseña. En caso de incidente de seguridad que afecte tus datos, te notificaremos en el plazo legalmente exigido.',

      '## 9. Cookies y almacenamiento local',
      'La tienda no usa herramientas de analítica ni publicidad de terceros. Solo guarda en tu navegador lo necesario para tu sesión, tu carrito y la lista de productos que viste. Puedes borrarlo desde la configuración de tu navegador; si lo haces, tu carrito se vaciará y tendrás que volver a entrar a tu cuenta.',

      '## 10. Menores de edad',
      'Esta tienda vende solo a personas mayores de 18 años. Al crear una cuenta o hacer un pedido confirmas que eres mayor de edad. No recopilamos datos de menores de forma consciente; si nos enteramos de que una cuenta es de un menor, la eliminamos.',

      '## 11. Modificaciones a esta política',
      'Podemos actualizar esta política cuando cambien nuestras prácticas o la legislación. La fecha de la última actualización aparece al pie de este documento. El uso continuado de la tienda después de la publicación de cambios implica la aceptación de la política actualizada.',

      '## 12. Contacto y autoridad de control',
      'Para cualquier consulta sobre esta política o el tratamiento de tus datos, contáctanos por WhatsApp al +507 6156 0839. Si consideras que tus derechos no han sido atendidos, puedes presentar una reclamación ante la Autoridad Nacional de Transparencia y Acceso a la Información (ANTAI), que es la autoridad de control en materia de protección de datos en Panamá. Más información en www.antai.gob.pa.',

      'Última actualización: noviembre 2026. [Pendiente: revisión por asesor legal antes de publicar.]',
    ],
  },
  {
    id: 'terminos',
    titulo: 'Términos',
    tituloLargo: 'Términos y condiciones',
    parrafos: [
      'Estos términos y condiciones regulan el uso de la tienda en línea de Kirei Technology y la relación comercial entre el comprador y el vendedor, de conformidad con el Código de Comercio de la República de Panamá y la Ley 45 de 2007 sobre Protección al Consumidor y Defensa de la Competencia.',

      '## 1. Identificación del vendedor',
      'Kirei Technology es una tienda en línea operada por [pendiente: nombre completo], persona natural, con RUC [pendiente], desde Panamá Oeste. No tiene local abierto al público. Teléfono y WhatsApp: +507 6156 0839. Correo: [pendiente]. Solo vendemos a mayores de 18 años.',

      '## 2. Aceptación',
      'Al realizar un pedido en esta tienda, el comprador declara haber leído y aceptado estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de los términos, no realices la compra.',

      '## 3. Productos y precios',
      'Todos los precios están expresados en dólares estadounidenses (USD), moneda de curso legal en la República de Panamá. Los precios incluyen los impuestos aplicables conforme a la ley panameña. Kirei Technology se reserva el derecho de modificar precios en cualquier momento, pero el precio que se aplicará a tu pedido será el vigente en el momento en que confirmes la compra por WhatsApp.',
      'Vendemos productos originales de marcas de las que somos vendedores autorizados y productos compatibles. Cuando un producto compatible menciona una marca (por ejemplo, un reloj compatible con Samsung o Huawei), indica con qué equipos funciona, no que lo fabrique esa marca. [Pendiente: indicar en cada producto si es original o compatible.]',
      'Nos esforzamos por mantener la información de los productos actualizada. En caso de error evidente en el precio, nos comunicaremos contigo antes de procesar el pedido.',

      '## 4. Proceso de compra y confirmación',
      'El contrato de compraventa queda perfeccionado cuando Kirei Technology confirma tu pedido por WhatsApp. Los pasos del proceso son:',
      ['Seleccionas los productos y completas el formulario de pedido en la tienda.', 'Recibes un mensaje de WhatsApp de confirmación con el resumen del pedido y los datos de pago.', 'Realizas el pago según las instrucciones recibidas.', 'Kirei Technology confirma la recepción del pago y coordina la entrega.'],
      'Kirei Technology puede rechazar o cancelar un pedido por causas justificadas (falta de stock, error en el precio, datos incorrectos), en cuyo caso se te notificará de inmediato y se devolverá el importe pagado.',

      '## 5. Métodos de pago',
      'Aceptamos los siguientes métodos de pago:',
      ['Yappy (pago móvil): al usuario @kireitechnology. Envía el comprobante por WhatsApp.', 'Productos por pedido (los de más de $60.00): se reservan con un abono del 50% y llegan en 15 días, sin contar fines de semana. El saldo se paga al entregar el producto. Si el producto no llega en ese plazo, se devuelve el abono completo.', 'Contra entrega: disponible en pedidos desde $30.00, con un cargo adicional de $5.00. Solo para entregas dentro de Panamá.'],
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
      '[Pendiente: el dueño confirma el plazo y las condiciones de devolución.] Puedes solicitar la devolución de un producto dentro de los 7 días hábiles siguientes a la recepción, siempre que:',
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
      'Para cualquier consulta relacionada con tu pedido o estos términos, contáctanos por WhatsApp al +507 6156 0839 o al correo [pendiente]. Atendemos por WhatsApp, sin horario fijo: respondemos lo antes posible.',

      'Última actualización: octubre 2026. [Pendiente: revisión por asesor legal antes de publicar.]',
    ],
  },
];
