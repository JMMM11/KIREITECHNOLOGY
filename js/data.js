// Catálogo y configuración de la tienda. Editar aquí precios, stock y contacto.
// Dinero siempre en centavos enteros. precio: null se muestra como "[precio]" y pide consulta por WhatsApp.
// stock: null = sin definir (se puede pedir), 0 = agotado.
window.KIREI = {
  contacto: {
    // Números tomados de los diseños: ventas en los anuncios de productos, reparaciones en los de servicio.
    ventasWhatsApp: '50761560839',
    ventasTexto: '+507 6156 0839',
    reparacionesWhatsApp: '50767607690',
    reparacionesTexto: '+507 6760 7690',
    correo: '', // pendiente: al definirlo aparece el botón "Enviar por correo" en reparaciones
    redes: '@kireitechnology',
    ubicacion: 'Panamá Oeste, Montelimar, Calle Los Vientos',
  },

  tarifas: {
    envioDomicilio: 500,
    envioPuntoEncuentro: null, // pendiente
    contraEntregaMinimo: 3000,
    contraEntregaCargo: 500,
  },

  categorias: [
    { id: 'audifonos', nombre: 'Audífonos', linea: 'electronica', img: 'assets/img/redmi-hp-1.webp', tono: 'claro' },
    { id: 'relojes', nombre: 'Relojes inteligentes', linea: 'electronica', img: 'assets/img/reloj-dorado.webp', tono: 'oscuro' },
    { id: 'accesorios', nombre: 'Accesorios', linea: 'electronica', img: null },
    { id: 'anime', nombre: 'Anime', linea: 'anime', img: null },
  ],

  // tono de la foto: 'claro' (fondo blanco), 'oscuro' (fondo azul marino) o 'foto' (escena que llena el recuadro)
  productos: [
    {
      id: 'redmi-buds-4-harry-potter', categoria: 'audifonos', nombre: 'Redmi Buds 4 Edición Harry Potter', precio: 10000,
      resumen: 'Estuche temático, funda de cuero con snitch dorada y caja de colección.',
      imgs: ['assets/img/redmi-hp-1.webp', 'assets/img/redmi-hp-2.webp', 'assets/img/redmi-hp-3.webp'], tono: 'claro',
    },
    {
      id: 'razer-pikachu', categoria: 'audifonos', nombre: 'Audífonos Razer Edición Pikachu', precio: 5000,
      resumen: 'Audífonos amarillos con estuche en forma de Poké Ball.',
      imgs: ['assets/img/pikachu-1.webp', 'assets/img/pikachu-2.webp'], tono: 'claro',
    },
    {
      id: 'lenovo-gm2-pro', categoria: 'audifonos', nombre: 'Lenovo GM2 Pro', precio: 2000,
      resumen: 'Audífonos gaming con luz LED en el estuche.',
      imgs: ['assets/img/gm2-1.webp'], tono: 'foto',
    },
    {
      id: 'lenovo-thinkplus-xt62', categoria: 'audifonos', nombre: 'Lenovo thinkplus XT62', precio: null,
      resumen: 'Estuche compacto en cuatro colores.',
      imgs: ['assets/img/thinkplus-1.webp', 'assets/img/thinkplus-rosa.webp', 'assets/img/thinkplus-morado.webp', 'assets/img/thinkplus-negro.webp'], tono: 'claro',
      opcion: 'Color',
      variantes: [
        { id: 'rosa', nombre: 'Rosa', stock: null, img: 'assets/img/thinkplus-rosa.webp' },
        { id: 'morado', nombre: 'Morado', stock: null, img: 'assets/img/thinkplus-morado.webp' },
        { id: 'negro', nombre: 'Negro', stock: null, img: 'assets/img/thinkplus-negro.webp' },
        { id: 'blanco', nombre: 'Blanco', stock: null, img: 'assets/img/thinkplus-1.webp' },
      ],
    },
    {
      id: 'reloj-oro-rosa', categoria: 'relojes', nombre: 'Reloj inteligente Oro Rosa', precio: null,
      resumen: 'Caja redonda y correa de eslabones de acero.',
      imgs: ['assets/img/reloj-oro-rosa.webp'], tono: 'oscuro',
    },
    {
      id: 'reloj-dorado', categoria: 'relojes', nombre: 'Reloj inteligente Dorado', precio: null,
      resumen: 'Pantalla cuadrada y correa de malla milanesa.',
      imgs: ['assets/img/reloj-dorado.webp'], tono: 'oscuro',
    },
    {
      id: 'reloj-negro', categoria: 'relojes', nombre: 'Reloj inteligente Negro', precio: null,
      resumen: 'Correa de acero.', imgs: [],
    },
    {
      id: 'power-bank-anime', categoria: 'accesorios', nombre: 'Power bank magnético Anime 10000 mAh', precio: 2800,
      resumen: 'Cargador magnético con diseño anime.', imgs: [],
    },
    {
      id: 'lampara-led-anime', categoria: 'accesorios', nombre: 'Lámpara LED acrílica 3D Anime', precio: 1800,
      resumen: 'Tres colores de luz.', imgs: [],
    },
    { id: 'llaveros-acrilicos', categoria: 'anime', nombre: 'Llaveros acrílicos y de metal (pack x10)', precio: 1500, resumen: 'Diez llaveros de tus personajes favoritos.', imgs: [] },
    { id: 'llavero-3d', categoria: 'anime', nombre: 'Llavero 3D de silicona', precio: 500, resumen: 'Figura 3D de silicona.', imgs: [] },
    { id: 'peluche-kawaii', categoria: 'anime', nombre: 'Peluche kawaii de 20 a 25 cm', precio: 1500, resumen: 'Personajes de Kimetsu, Jujutsu y Sanrio.', imgs: [] },
    { id: 'mousepad-xl-anime', categoria: 'anime', nombre: 'Mousepad gaming XL Anime (80 x 30 cm)', precio: 1500, resumen: 'Superficie amplia para teclado y mouse.', imgs: [] },
    { id: 'termo-anime', categoria: 'anime', nombre: 'Termo de acero inoxidable Anime', precio: 2000, resumen: 'Mantiene tu bebida fría o caliente.', imgs: [] },
    { id: 'cartuchera-anime', categoria: 'anime', nombre: 'Cartuchera de tela Anime', precio: 800, resumen: 'Para la escuela o el trabajo.', imgs: [] },
    { id: 'pines-anime', categoria: 'anime', nombre: 'Set de pines de metal (pack x5)', precio: 1000, resumen: 'Cinco pines para tu mochila o chaqueta.', imgs: [] },
  ],

  servicios: [
    { nombre: 'Diagnóstico avanzado', detalle: 'Revisamos tu equipo y te decimos qué tiene.' },
    { nombre: 'Reparación de hardware y software', detalle: 'Fallas de piezas o del sistema.' },
    { nombre: 'Mantenimiento preventivo', detalle: 'Limpieza interna para que no se caliente.' },
    { nombre: 'Cambio de pantalla', detalle: 'Pantallas rotas o con fallas.' },
    { nombre: 'Cambio de batería', detalle: 'Cuando ya no aguanta la carga.' },
    { nombre: 'Cambio de teclado', detalle: 'Teclas que no responden.' },
    { nombre: 'Instalación de Windows 10 / 11', detalle: 'Instalación rápida y segura para laptops y PCs.' },
    { nombre: 'Actualización de computadoras', detalle: 'Ponemos al día tu sistema Windows.' },
    { nombre: 'Eliminación de virus y antivirus', detalle: 'Limpieza e instalación de antivirus.' },
  ],
};
