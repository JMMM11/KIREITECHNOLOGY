// Productos reales de Kirei. Precios en centavos, tomados de la tabla del dueño. null = [pendiente].
// fotos: archivos originales de la carpeta Productos/ (sin convertir), con su ancho y alto. stock: null = sin definir.
// licencia: 'propia' | 'generica' | 'con_licencia' | null (pendiente de confirmar).
const f = (archivo, ancho, alto) => ({ src: `Productos/${archivo}`, ancho, alto });

export const PRODUCTOS = [
  {
    id: 'redmi-buds-4-harry-potter', nombre: 'Redmi Buds 4 Edición Harry Potter', categoriaId: 'audifonos', marca: 'Xiaomi',
    precioCentavos: 10000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos inalámbricos con estuche temático de Hogwarts, funda de cuero con snitch dorada y caja de colección.',
    fotos: [f('Hogwarts (2).jpg', 2560, 2560), f('Hogwarts (4).jpg', 2000, 1504), f('Hogwarts (3).jpg', 2560, 2560), f('Hogwarts (1).jpg', 2560, 2560)],
    tono: 'foto',
  },
  {
    id: 'razer-pikachu', nombre: 'Audífonos Razer Edición Pikachu', categoriaId: 'audifonos', marca: 'Razer',
    precioCentavos: 5000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos amarillos con estuche en forma de Poké Ball y correa para llevarlo colgado.',
    fotos: [f('Razer Pikachu (4).jpg', 800, 800), f('Razer Pikachu (2).jpg', 719, 719), f('Razer Pikachu (3).jpg', 800, 800), f('Razer Pikachu (1).jpg', 800, 800), f('Razer Pikachu (5).jpg', 500, 500), f('Razer Pikachu (6).jpg', 1200, 1200)],
    tono: 'foto',
  },
  {
    id: 'lenovo-gm2-pro', nombre: 'Lenovo GM2 Pro', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 2000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos gaming inalámbricos con luz LED en el estuche.',
    fotos: [f('Lenovo GM2 Pro (8).jpg', 1740, 2000), f('Lenovo GM2 Pro (7).jpg', 2682, 2676), f('Lenovo GM2 Pro (3).png', 757, 740), f('Lenovo GM2 Pro (6).jpg', 836, 1000), f('Lenovo GM2 Pro (14).jpg', 1506, 2013), f('Lenovo GM2 Pro (2).jpg', 1506, 2010), f('Lenovo GM2 Pro (1).png', 3000, 3000), f('Lenovo GM2 Pro (1).jpeg', 2400, 2400)],
    tono: 'foto',
    opcion: 'Color',
    // Negro abre con la primera foto; blanco con la del estuche blanco.
    variantes: [
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', stock: null, foto: 0 },
      { id: 'blanco', nombre: 'Blanco', muestra: '#F4F4F4', stock: null, foto: 6 },
    ],
  },
  {
    id: 'lenovo-thinkplus-xt62', nombre: 'Lenovo thinkplus XT62', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Audífonos inalámbricos con estuche compacto. Disponibles en cuatro colores.',
    // Las 4 primeras fotos son blanco, rosa, morado y negro: cada color de abajo apunta a la suya.
    fotos: [f('Lenovo thinkplus XT62 (4).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (7).jpg', 1000, 1000), f('Lenovo thinkplus XT62 (1).png', 2560, 2560), f('Lenovo thinkplus XT62 (1).jpeg', 800, 800), f('Lenovo thinkplus XT62 (5).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (6).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (3).jpg', 3000, 3000), f('Lenovo thinkplus XT62 (1).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (2).jpg', 1000, 1513)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'blanco', nombre: 'Blanco', muestra: '#F4F4F4', stock: null, foto: 0 },
      { id: 'rosa', nombre: 'Rosa', muestra: '#F2B8C9', stock: null, foto: 1 },
      { id: 'morado', nombre: 'Morado', muestra: '#A99AF0', stock: null, foto: 2 },
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', stock: null, foto: 3 },
    ],
  },
  {
    id: 'reloj-oro-rosa', nombre: 'Reloj inteligente Oro Rosa', categoriaId: 'relojes',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: 'generica',
    descripcion: 'Caja redonda en tono oro rosa con correa de eslabones de acero.',
    fotos: [],
  },
  {
    id: 'reloj-dorado', nombre: 'Reloj inteligente Dorado', categoriaId: 'relojes',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: 'generica',
    descripcion: 'Pantalla cuadrada con correa de malla milanesa dorada.',
    fotos: [],
  },
  {
    id: 'reloj-negro', nombre: 'Reloj inteligente Negro', categoriaId: 'relojes',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: 'generica',
    descripcion: 'Reloj inteligente negro con correa de acero.', fotos: [], proveedorUrl: null,
  },
  {
    id: 'power-bank-anime', nombre: 'Power bank magnético Anime 10000 mAh', categoriaId: 'cargadores',
    precioCentavos: 2800, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Batería portátil magnética de 10000 mAh con diseño anime.', fotos: [], proveedorUrl: null,
  },
  {
    id: 'lampara-led-anime', nombre: 'Lámpara LED acrílica 3D Anime', categoriaId: 'accesorios-pc',
    precioCentavos: 1800, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Lámpara de acrílico con efecto 3D y tres colores de luz.', fotos: [], proveedorUrl: null,
  },
  {
    id: 'mousepad-xl-anime', nombre: 'Mousepad gaming XL Anime (80 x 30 cm)', categoriaId: 'accesorios-pc',
    precioCentavos: 1500, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Superficie amplia de 80 x 30 cm para teclado y mouse.', fotos: [], proveedorUrl: null,
  },
  // Zona Anime: en borrador hasta que esté lista. La página muestra "Próximamente".
  { id: 'llaveros-acrilicos', nombre: 'Llaveros acrílicos y de metal (pack x10)', categoriaId: 'anime', precioCentavos: 1500, stock: null, estado: 'borrador', descripcion: 'Diez llaveros de tus personajes favoritos.', fotos: [] },
  { id: 'llavero-3d', nombre: 'Llavero 3D de silicona', categoriaId: 'anime', precioCentavos: 500, stock: null, estado: 'borrador', descripcion: 'Figura 3D de silicona.', fotos: [] },
  { id: 'peluche-kawaii', nombre: 'Peluche kawaii de 20 a 25 cm', categoriaId: 'anime', precioCentavos: 1500, stock: null, estado: 'borrador', descripcion: 'Personajes de Kimetsu, Jujutsu y Sanrio.', fotos: [] },
  { id: 'termo-anime', nombre: 'Termo de acero inoxidable Anime', categoriaId: 'anime', precioCentavos: 2000, stock: null, estado: 'borrador', descripcion: 'Mantiene tu bebida fría o caliente.', fotos: [] },
  { id: 'cartuchera-anime', nombre: 'Cartuchera de tela Anime', categoriaId: 'anime', precioCentavos: 800, stock: null, estado: 'borrador', descripcion: 'Para la escuela o el trabajo.', fotos: [] },
  { id: 'pines-anime', nombre: 'Set de pines de metal (pack x5)', categoriaId: 'anime', precioCentavos: 1000, stock: null, estado: 'borrador', descripcion: 'Cinco pines para tu mochila o chaqueta.', fotos: [] },
];
