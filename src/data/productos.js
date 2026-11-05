// Productos reales de Kirei. Precios en centavos, tomados de las imágenes y la tabla del dueño. null = [pendiente].
// fotos: archivos de la carpeta Productos/, con su ancho y alto. stock: unidades (solo las ve el admin; el cliente ve
// cuántas quedan cuando son menos de 3). null = sin contar.
// variantes[].precioCentavos: precio propio de esa opción; si falta, vale el del producto.
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
    id: 'petukita-box-pokemon', nombre: 'Audífonos inalámbricos Petukita Box Pokémon', categoriaId: 'audifonos',
    precioCentavos: 4500, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos inalámbricos con estuche de carga en forma de Poké Ball. Incluye cable de carga, tapones de silicona, cordón y guía de uso. Cada audífono mide 17,5 x 16,8 mm y pesa 4,5 g; el estuche mide 64 mm de diámetro y pesa 90 g.',
    fotos: [f('Razer Pikachu (4).jpg', 800, 800), f('Razer Pikachu (2).jpg', 719, 719), f('Razer Pikachu (3).jpg', 800, 800), f('Razer Pikachu (1).jpg', 800, 800), f('Razer Pikachu (5).jpg', 500, 500), f('Razer Pikachu (6).jpg', 1200, 1200)],
    tono: 'foto',
    opcion: 'Presentación',
    variantes: [
      { id: 'con-caja', nombre: 'Con caja', precioCentavos: 5000, stock: null, foto: 0 },
      { id: 'sin-caja', nombre: 'Sin caja', precioCentavos: 4500, stock: null, foto: null },
    ],
  },
  {
    id: 'lenovo-gm2-pro', nombre: 'Lenovo GM2 Pro', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 2500, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: 'Audífonos originales Lenovo GM2 Pro con Bluetooth 5.3. Para juegos, música y deporte, con modo dual y micrófono.',
    fotos: [f('Lenovo GM2 Pro (8).jpg', 1740, 2000), f('Lenovo GM2 Pro (7).jpg', 2682, 2676), f('Lenovo GM2 Pro (3).png', 757, 740), f('Lenovo GM2 Pro (6).jpg', 836, 1000), f('Lenovo GM2 Pro (14).jpg', 1506, 2013), f('Lenovo GM2 Pro (2).jpg', 1506, 2010), f('Lenovo GM2 Pro (1).png', 3000, 3000), f('Lenovo GM2 Pro (1).jpeg', 2400, 2400)],
    tono: 'foto',
    opcion: 'Color',
    // Negro abre con la primera foto; blanco con la del estuche blanco.
    variantes: [
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', precioCentavos: 3000, stock: null, foto: 0 },
      { id: 'blanco', nombre: 'Blanco', muestra: '#F4F4F4', precioCentavos: 2500, stock: null, foto: 6 },
    ],
  },
  {
    id: 'lenovo-thinkplus-xt62', nombre: 'Lenovo thinkplus XT62', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 2000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, licencia: null,
    descripcion: 'Audífonos deportivos con micrófono y Bluetooth 5.3. Controlador de 8 mm, códec HD AAC/SBC, control táctil, latencia ultrabaja y hasta 25 horas de uso.',
    // Las 4 primeras fotos son blanco, rosa, morado y negro: cada color de abajo apunta a la suya.
    fotos: [f('Lenovo thinkplus XT62 (4).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (7).jpg', 1000, 1000), f('Lenovo thinkplus XT62 (1).png', 2560, 2560), f('Lenovo thinkplus XT62 (1).jpeg', 800, 800), f('Lenovo thinkplus XT62 (5).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (6).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (3).jpg', 3000, 3000), f('Lenovo thinkplus XT62 (1).jpg', 3200, 3200), f('Lenovo thinkplus XT62 (2).jpg', 1000, 1513)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'blanco', nombre: 'Blanco', muestra: '#F4F4F4', stock: null, foto: 0 },
      { id: 'rosa', nombre: 'Rosado', muestra: '#F2B8C9', stock: null, foto: 1 },
      { id: 'morado', nombre: 'Morado', muestra: '#A99AF0', stock: null, foto: 2 },
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', stock: null, foto: 3 },
    ],
  },
  {
    id: 'lige-pantalla-cuadrada', nombre: 'Reloj inteligente LIGE pantalla cuadrada', categoriaId: 'relojes', marca: 'LIGE',
    precioCentavos: 2628, precioAntesCentavos: null, stock: 15, estado: 'publicado', destacado: true, nuevo: true, licencia: null,
    descripcion: 'Pantalla táctil TFT de 1,69 pulgadas (240 x 280), batería de 180 mAh para 3 a 4 días, carga magnética, resistente al agua IP67 y correa de 20 mm. Se usa con la app FitPro.',
    fotos: [f('LIGE_Smartwatch_Touchscreen_Men_Women.png', 777, 732), f('LIGE_Smartwatch_Touchscreen_Men_Women(4).png', 512, 557), f('LIGE_Smartwatch_Touchscreen_Men_Women(5).png', 667, 747), f('LIGE_Smartwatch_Touchscreen_Men_Women(6).png', 482, 507)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'dorado', nombre: 'Dorado', muestra: '#D4AF6A', stock: null, foto: 0 },
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', stock: null, foto: null },
    ],
  },
  {
    id: 'lige-active-2', nombre: 'Smartwatch Active 2 LIGE', categoriaId: 'relojes', marca: 'LIGE',
    precioCentavos: 3998, precioAntesCentavos: null, stock: 15, estado: 'publicado', destacado: true, nuevo: true, licencia: null,
    descripcion: 'Pantalla táctil AMOLED de 1,28 pulgadas, llamadas, resistente al agua IP67 y carga magnética. Batería de 240 mAh para 5 a 7 días de uso (30 en espera). Compatible con Android 5.0 o superior e iOS 9.0. Correa de 21 mm. Se usa con la app FitPro.',
    fotos: [f('LIGE Active 2.png', 395, 395)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'dorado', nombre: 'Dorado', muestra: '#D4AF6A', stock: null, foto: 0 },
      { id: 'crema', nombre: 'Crema', muestra: '#EAD9C6', stock: null, foto: 0 },
    ],
  },
  {
    // Precio [pendiente]: la imagen dice $45.00 arriba y $50.00 en cada color.
    id: 'lige-correa-metal', nombre: 'Reloj inteligente LIGE con correa de metal', categoriaId: 'relojes', marca: 'LIGE',
    precioCentavos: null, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: 'Mide presión arterial y oxígeno en sangre, hace llamadas por Bluetooth y es compatible con Samsung y Huawei. Pantalla táctil de 240 x 240, carga magnética, resistente al agua IP67 y batería de 220 mAh para 7 a 10 días. Correa de 22 mm. Se usa con la app FitCloudPro.',
    fotos: [f('LIGE correa de metal.png', 383, 383)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'dorado', nombre: 'Dorado', muestra: '#D4AF6A', stock: null, foto: 0 },
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', stock: null, foto: null },
    ],
  },
  {
    id: 'soporte-smartphone', nombre: 'Soporte para smartphone', categoriaId: 'accesorios-pc',
    precioCentavos: 178, precioAntesCentavos: null, stock: 10, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: 'Soporte para sostener tu celular en el escritorio.',
    fotos: [],
  },
  {
    id: 'reloj-bolsillo-one-piece', nombre: 'Reloj de bolsillo One Piece', categoriaId: 'anime',
    precioCentavos: 1000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, nuevo: true, licencia: 'generica',
    descripcion: 'Reloj de bolsillo de cuarzo con cadena y tapa calada con la bandera de los Piratas del Sombrero de Paja. Un regalo para fanáticos de One Piece.',
    fotos: [f('Reloj_one_piece (3).jpeg', 1024, 1024), f('Reloj_one_piece (4).jpeg', 500, 500), f('Reloj_one_piece (2).jpg', 554, 554), f('Reloj_one_piece (1).jpeg', 500, 500)],
    tono: 'foto',
  },
];
