// Productos reales de Kirei. Precios en centavos, tomados de la tabla del dueño. null = [pendiente].
// fotos: nombre base en public/fotos (existen -m.webp y -l.webp) con su tamaño original.
// recorte: versión sin fondo para las escenas 3D. stock: null = sin definir.
// licencia: 'propia' | 'generica' | 'con_licencia' | null (pendiente de confirmar).
const f = (base, ancho, alto) => ({ base, ancho, alto });

export const PRODUCTOS = [
  {
    id: 'redmi-buds-4-harry-potter', nombre: 'Redmi Buds 4 Edición Harry Potter', categoriaId: 'audifonos', marca: 'Xiaomi',
    precioCentavos: 10000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos inalámbricos con estuche temático de Hogwarts, funda de cuero con snitch dorada y caja de colección.',
    fotos: [f('redmi-hp-1', 521, 521), f('redmi-hp-2', 2560, 2560), f('redmi-hp-3', 554, 554)],
    recorte: f('recorte-redmi-hp-1', 475, 441), tono: 'claro',
  },
  {
    id: 'razer-pikachu', nombre: 'Audífonos Razer Edición Pikachu', categoriaId: 'audifonos', marca: 'Razer',
    precioCentavos: 5000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos amarillos con estuche en forma de Poké Ball y correa para llevarlo colgado.',
    fotos: [f('pikachu-1', 655, 655), f('pikachu-2', 570, 380)],
    recorte: f('recorte-pikachu-1', 598, 427), tono: 'claro',
  },
  {
    id: 'lenovo-gm2-pro', nombre: 'Lenovo GM2 Pro', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 2000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos gaming inalámbricos con luz LED en el estuche.',
    fotos: [f('gm2-1', 554, 554)], recorte: null, tono: 'foto',
  },
  {
    id: 'lenovo-thinkplus-xt62', nombre: 'Lenovo thinkplus XT62', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Audífonos inalámbricos con estuche compacto. Disponibles en cuatro colores.',
    fotos: [f('thinkplus-1', 942, 942), f('thinkplus-rosa', 627, 627), f('thinkplus-morado', 873, 873), f('thinkplus-negro', 577, 577)],
    recorte: f('recorte-thinkplus-1', 734, 860), tono: 'claro',
    opcion: 'Color',
    variantes: [
      { id: 'rosa', nombre: 'Rosa', muestra: '#F2B8C9', stock: null, foto: 1, recorte: f('recorte-thinkplus-rosa', 485, 570) },
      { id: 'morado', nombre: 'Morado', muestra: '#A99AF0', stock: null, foto: 2, recorte: f('recorte-thinkplus-morado', 539, 797) },
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', stock: null, foto: 3, recorte: f('recorte-thinkplus-negro', 523, 326) },
      { id: 'blanco', nombre: 'Blanco', muestra: '#F4F4F4', stock: null, foto: 0, recorte: f('recorte-thinkplus-1', 734, 860) },
    ],
  },
  {
    id: 'reloj-oro-rosa', nombre: 'Reloj inteligente Oro Rosa', categoriaId: 'relojes',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: 'generica',
    descripcion: 'Caja redonda en tono oro rosa con correa de eslabones de acero.',
    fotos: [f('reloj-oro-rosa', 475, 390)], recorte: f('recorte-reloj-oro-rosa', 444, 373), tono: 'oscuro',
  },
  {
    id: 'reloj-dorado', nombre: 'Reloj inteligente Dorado', categoriaId: 'relojes',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: 'generica',
    descripcion: 'Pantalla cuadrada con correa de malla milanesa dorada.',
    fotos: [f('reloj-dorado', 447, 460)], recorte: f('recorte-reloj-dorado', 374, 456), tono: 'oscuro',
  },
  {
    id: 'reloj-negro', nombre: 'Reloj inteligente Negro', categoriaId: 'relojes',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: 'generica',
    descripcion: 'Reloj inteligente negro con correa de acero.', fotos: [], recorte: null, proveedorUrl: null,
  },
  {
    id: 'power-bank-anime', nombre: 'Power bank magnético Anime 10000 mAh', categoriaId: 'cargadores',
    precioCentavos: 2800, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Batería portátil magnética de 10000 mAh con diseño anime.', fotos: [], recorte: null, proveedorUrl: null,
  },
  {
    id: 'lampara-led-anime', nombre: 'Lámpara LED acrílica 3D Anime', categoriaId: 'accesorios-pc',
    precioCentavos: 1800, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Lámpara de acrílico con efecto 3D y tres colores de luz.', fotos: [], recorte: null, proveedorUrl: null,
  },
  {
    id: 'mousepad-xl-anime', nombre: 'Mousepad gaming XL Anime (80 x 30 cm)', categoriaId: 'accesorios-pc',
    precioCentavos: 1500, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Superficie amplia de 80 x 30 cm para teclado y mouse.', fotos: [], recorte: null, proveedorUrl: null,
  },
  // Zona Anime: en borrador hasta que esté lista. La página muestra "Próximamente".
  { id: 'llaveros-acrilicos', nombre: 'Llaveros acrílicos y de metal (pack x10)', categoriaId: 'anime', precioCentavos: 1500, stock: null, estado: 'borrador', descripcion: 'Diez llaveros de tus personajes favoritos.', fotos: [] },
  { id: 'llavero-3d', nombre: 'Llavero 3D de silicona', categoriaId: 'anime', precioCentavos: 500, stock: null, estado: 'borrador', descripcion: 'Figura 3D de silicona.', fotos: [] },
  { id: 'peluche-kawaii', nombre: 'Peluche kawaii de 20 a 25 cm', categoriaId: 'anime', precioCentavos: 1500, stock: null, estado: 'borrador', descripcion: 'Personajes de Kimetsu, Jujutsu y Sanrio.', fotos: [] },
  { id: 'termo-anime', nombre: 'Termo de acero inoxidable Anime', categoriaId: 'anime', precioCentavos: 2000, stock: null, estado: 'borrador', descripcion: 'Mantiene tu bebida fría o caliente.', fotos: [] },
  { id: 'cartuchera-anime', nombre: 'Cartuchera de tela Anime', categoriaId: 'anime', precioCentavos: 800, stock: null, estado: 'borrador', descripcion: 'Para la escuela o el trabajo.', fotos: [] },
  { id: 'pines-anime', nombre: 'Set de pines de metal (pack x5)', categoriaId: 'anime', precioCentavos: 1000, stock: null, estado: 'borrador', descripcion: 'Cinco pines para tu mochila o chaqueta.', fotos: [] },
];
