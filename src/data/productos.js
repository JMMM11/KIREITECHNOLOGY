// Productos reales de Kirei. Precios en centavos, tomados de los afiches del dueño (KIRC.pdf). null = [pendiente].
// fotos: archivos de la carpeta Productos/, con su ancho y alto. stock: unidades (solo las ve el admin; el cliente ve
// cuántas quedan cuando son menos de 3). null = sin contar.
// variantes[].precioCentavos: precio propio de esa opción; si falta, vale el del producto.
// licencia: 'propia' | 'generica' | 'con_licencia' | null (pendiente de confirmar).
const f = (archivo, ancho, alto) => ({ src: `Productos/${archivo}`, ancho, alto });

export const PRODUCTOS = [
  {
    id: 'redmi-buds-4-harry-potter', nombre: 'Redmi Buds 4 Edición Harry Potter', categoriaId: 'audifonos', marca: 'Xiaomi',
    precioCentavos: 10000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: "Edición especial de colección de los Redmi Buds 4 de Xiaomi, inspirada en Harry Potter. El estuche de carga lleva el escudo de Hogwarts, los audífonos tienen el rayo de Harry y todo viene en una caja de colección con funda de cuero y la snitch dorada. Por dentro son los mismos Redmi Buds 4: cancelación activa de ruido y buena batería para todo el día.\n\n- Cancelación activa de ruido: reduce hasta 35 dB\n- Controladores: dinámicos de 10 mm\n- Bluetooth: 5.2, con baja latencia\n- Batería: unas 6 horas por carga y hasta 30 horas con el estuche\n- Resistencia: al polvo y a salpicaduras (IP54)\n- Incluye: audífonos, estuche de carga temático, funda de cuero con snitch y caja de colección Hogwarts\n\nIdeal como regalo para fanáticos de Harry Potter. Producto por pedido: se reserva con el 50% por Yappy y llega en 15 días hábiles.",
    fotos: [f('Hogwarts (2).jpg', 2560, 2560), f('Hogwarts (4).jpg', 2000, 1504), f('Hogwarts (3).jpg', 2560, 2560), f('Hogwarts (1).jpg', 2560, 2560)],
    tono: 'foto',
  },
  {
    id: 'petukita-box-pokemon', nombre: 'Audífonos inalámbricos Petukita Box Pokémon', categoriaId: 'audifonos',
    precioCentavos: 4500, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, licencia: null,
    descripcion: "Audífonos inalámbricos Petukita Box con estuche de carga en forma de Poké Ball, en rojo y blanco, y audífonos amarillos. Un diseño llamativo para fanáticos de Pokémon que además funciona como audífono de uso diario.\n\n- Peso de cada audífono: 4,5 g\n- Medidas de cada audífono: 17,5 mm de largo y 16,8 mm de ancho\n- Estuche de carga: 64 mm de diámetro, 90 g\n- Incluye: audífonos, estuche de carga, cable de carga, tapones de silicona, cordón y guía de uso\n\nElige con caja ($50.00), que trae la caja de presentación, ideal para regalo, o sin caja ($45.00). Entrega inmediata.",
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
    descripcion: "Audífonos originales Lenovo GM2 Pro (thinkplus Live Pods), pensados para juegos, música y deportes electrónicos. Tienen un modo dual: modo juego con baja latencia, para que el sonido vaya al ritmo de la pantalla, y modo música para escuchar con mejor calidad. El estuche tiene un diseño gamer con luz.\n\n- Bluetooth: 5.3\n- Modos: juego (baja latencia) y música\n- Micrófono: incorporado, para llamadas y partidas en línea\n- Colores: negro ($30.00) y blanco ($25.00)\n\nProducto original Lenovo. Entrega inmediata.",
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
    descripcion: "Audífonos deportivos Lenovo thinkplus XT62 con micrófono, de estuche compacto y ajuste cómodo para usarlos todo el día. Con control táctil y hasta 25 horas de reproducción.\n\n- Bluetooth: 5.3\n- Controlador: 8 mm, para alta calidad de audio\n- Códec: HD AAC y SBC\n- Control: táctil, fácil de usar\n- Latencia: ultrabaja\n- Reproducción: hasta 25 horas\n- Colores: blanco, rosado, morado y negro\n\nProducto original Lenovo. Entrega inmediata.",
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
    id: 'heart-buds', nombre: 'Audífonos inalámbricos Heart Buds', categoriaId: 'audifonos', marca: 'Lekgymr',
    precioCentavos: 2500, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, nuevo: true, licencia: null,
    descripcion: "Heart Buds de Lekgymr: audífonos inalámbricos Bluetooth en forma de corazón, con estuche de carga blanco. Son de moda, pensados para quien quiere unos audífonos que se vean distintos, y sirven para música, juegos y clases.\n\n- Tipo: inalámbricos TWS (cada audífono va por separado)\n- Estuche: de carga, blanco\n- Colores: rojo ($25.00), rosado, celeste y morado ($30.00)\n\nUn regalo original. Entrega inmediata.",
    fotos: [f('Heart Buds (1).png', 320, 320), f('Heart Buds (2).jpeg', 321, 321), f('Heart Buds (3).jpeg', 320, 320), f('Heart Buds (4).jpeg', 192, 192), f('Heart Buds (5).jpeg', 240, 240)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'rojo', nombre: 'Rojo', muestra: '#C0222B', precioCentavos: 2500, stock: null, foto: 0 },
      { id: 'rosa', nombre: 'Rosado', muestra: '#F2C9C4', precioCentavos: 3000, stock: null, foto: 3 },
      { id: 'celeste', nombre: 'Celeste', muestra: '#7CC9BE', precioCentavos: 3000, stock: null, foto: 2 },
      { id: 'morado', nombre: 'Morado', muestra: '#A99AF0', precioCentavos: 3000, stock: null, foto: 4 },
    ],
  },
  {
    id: 'auriculares-bt51-reduccion-ruido', nombre: 'Audífonos inalámbricos con reducción de ruido Bluetooth 5.1', categoriaId: 'audifonos',
    precioCentavos: 1200, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: "Audífonos inalámbricos con reducción de ruido y estuche de diseño gamer con luz. Buena opción económica para música y llamadas.\n\n- Bluetooth: 5.1\n- Alcance: unos 14 metros\n- Batería de los audífonos: recargable e integrada, de 200 mAh\n- Música o llamadas: de 5 a 6 horas\n- Altavoz: 13 mm\n- Sensibilidad: 102 dB\n- Voltaje de funcionamiento: 5 V\n- Colores: negro y amarillo\n\nProducto genérico. Entrega inmediata.",
    fotos: [f('Auriculares BT 5.1 (1).png', 432, 478), f('Auriculares BT 5.1 (2).jpeg', 268, 300), f('Auriculares BT 5.1 (3).png', 184, 184)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'amarillo', nombre: 'Amarillo', muestra: '#F2B233', stock: null, foto: 0 },
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', stock: null, foto: null },
    ],
  },
  {
    id: 'lenovo-xt95-pro', nombre: 'Lenovo thinkplus XT95 Pro', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 3000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: "Audífonos deportivos semi in-ear Lenovo thinkplus XT95 Pro. Su forma se apoya en la entrada del oído, cómoda para usarlos por horas y para hacer ejercicio. El estuche tiene un diseño transparente y existe en versión estándar o luminosa.\n\n- Bluetooth: 5.1\n- Alcance: hasta 10 metros sin obstáculos\n- Altavoz: 13 mm\n- Códec: AAC y SBC\n- Batería: 300 mAh el estuche y 30 mAh cada audífono\n- Colores: negro ($35.00) y blanco ($30.00)\n- Incluye: un par de audífonos, estuche de carga, cable de carga y manual\n\nProducto original Lenovo. Entrega inmediata.",
    fotos: [f('Lenovo XT95 Pro (1).jpeg', 320, 320), f('Lenovo XT95 Pro (2).png', 300, 300)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', precioCentavos: 3500, stock: null, foto: 0 },
      { id: 'blanco', nombre: 'Blanco', muestra: '#F4F4F4', precioCentavos: 3000, stock: null, foto: null },
    ],
  },
  {
    id: 'lenovo-lp80', nombre: 'Lenovo thinkplus LP80', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 2000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: "Audífonos inalámbricos Lenovo thinkplus LP80, resistentes al agua, con estuche transparente de acrílico. Su chip Bluetooth 5.0 da una conexión rápida y estable y buena calidad de sonido.\n\n- Bluetooth: 5.0\n- Alcance: conexión estable hasta 10 metros\n- Estuche: transparente de acrílico, de 300 mAh\n- Carga: con 1 hora de carga se usan unas 4 horas\n- Resistencia: al agua\n- Colores: negro ($25.00) y blanco ($20.00)\n\nProducto original Lenovo. Entrega inmediata.",
    fotos: [f('Lenovo LP80 (1).jpeg', 300, 299), f('Lenovo LP80 (2).png', 400, 225)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', precioCentavos: 2500, stock: null, foto: 0 },
      { id: 'blanco', nombre: 'Blanco', muestra: '#F4F4F4', precioCentavos: 2000, stock: null, foto: null },
    ],
  },
  {
    id: 'lenovo-bt10', nombre: 'Lenovo thinkplus BT10', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 2000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: "Audífonos de cuello Lenovo thinkplus BT10, diseñados para hacer ejercicio sin que se caigan: la banda se apoya en el cuello y los audífonos quedan siempre a la mano. Resisten el sudor y el agua.\n\n- Bluetooth: 5.0, alcance de hasta 15 metros\n- Resistencia: al agua y al sudor (IPX6)\n- Reducción de ruido: protege tus oídos en lugares ruidosos\n- Micrófono: incorporado, con cancelación de eco para que te escuchen claro\n- Música: hasta 6 horas\n\nProducto original Lenovo. Entrega inmediata.",
    fotos: [f('Lenovo BT10 (1).jpeg', 300, 300), f('Lenovo BT10 (2).png', 250, 250)],
    tono: 'foto',
  },
  {
    id: 'lenovo-he05x', nombre: 'Lenovo HE05X', categoriaId: 'audifonos', marca: 'Lenovo',
    precioCentavos: 2000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: "Audífonos de cuello Lenovo HE05X, ergonómicos y en color negro. Los audífonos son magnéticos: se pegan entre sí cuando no los usas, así no se enredan ni se pierden. El control en el cable maneja la música y las llamadas.\n\n- Bluetooth: 5.0\n- Resistencia: al agua y al sudor (IPX5)\n- Control: en el cable, para música y llamadas\n- Tiempo de carga: unas 2 horas\n- Llamadas: unas 6 horas\n- Música: unas 8 horas\n\nProducto original Lenovo. Entrega inmediata.",
    fotos: [f('Lenovo HE05X (1).jpeg', 320, 320), f('Lenovo HE05X (2).jpeg', 340, 340)],
    tono: 'foto',
  },
  {
    id: 'lige-pantalla-cuadrada', nombre: 'Reloj inteligente LIGE pantalla cuadrada', categoriaId: 'relojes', marca: 'LIGE',
    precioCentavos: 2500, precioAntesCentavos: null, stock: 15, estado: 'publicado', destacado: true, nuevo: true, licencia: null,
    descripcion: "Reloj inteligente LIGE con pantalla táctil, para hombre y mujer. Pantalla cuadrada grande, carga magnética y resistencia al agua. Se conecta a tu celular con la app FitPro.\n\n- Pantalla: TFT de 1,69 pulgadas, 240 x 280, totalmente táctil\n- Batería: 180 mAh, de 3 a 4 días\n- Carga: magnética\n- Resistencia al agua: IP67\n- Correa: 20 mm\n- App: FitPro\n- Colores: negro ($25.00) y dorado ($30.00)\n\nEntrega inmediata.",
    fotos: [f('LIGE_Smartwatch_Touchscreen_Men_Women.png', 777, 732), f('LIGE_Smartwatch_Touchscreen_Men_Women(4).png', 512, 557), f('LIGE_Smartwatch_Touchscreen_Men_Women(5).png', 667, 747), f('LIGE_Smartwatch_Touchscreen_Men_Women(6).png', 482, 507)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'dorado', nombre: 'Dorado', muestra: '#D4AF6A', precioCentavos: 3000, stock: null, foto: 0 },
      { id: 'negro', nombre: 'Negro', muestra: '#1E1E1E', precioCentavos: 2500, stock: null, foto: null },
    ],
  },
  {
    id: 'lige-active-2', nombre: 'Smartwatch Active 2 LIGE', categoriaId: 'relojes', marca: 'LIGE',
    precioCentavos: 3000, precioAntesCentavos: null, stock: 15, estado: 'publicado', destacado: true, nuevo: true, licencia: null,
    descripcion: "Reloj inteligente LIGE Active 2 con pantalla redonda AMOLED y llamadas, para hombre y mujer. Resistente al agua y con batería para casi una semana. Se conecta a tu celular con la app FitPro.\n\n- Pantalla: AMOLED de 1,28 pulgadas, táctil completa, 240 x 240\n- Llamadas: sí\n- Compatibilidad: Android 5.0 o superior e iOS 9.0 o superior\n- Batería: 240 mAh, de 5 a 7 días de uso y hasta 30 días en espera\n- Carga: magnética\n- Resistencia al agua: IP67\n- Correa: largo total de 226,6 mm y 21 mm de ancho\n- App: FitPro\n- Colores: crema ($30.00) y dorado ($35.00)\n\nEntrega inmediata.",
    fotos: [f('LIGE Active 2.png', 395, 395)],
    tono: 'foto',
    opcion: 'Color',
    variantes: [
      { id: 'dorado', nombre: 'Dorado', muestra: '#D4AF6A', precioCentavos: 3500, stock: null, foto: 0 },
      { id: 'crema', nombre: 'Crema', muestra: '#EAD9C6', precioCentavos: 3000, stock: null, foto: 0 },
    ],
  },
  {
    // Afiche 14: $50.00 en cada color (el título del afiche dice $45.00; confirmar con el dueño).
    id: 'lige-correa-metal', nombre: 'Reloj inteligente LIGE con correa de metal', categoriaId: 'relojes', marca: 'LIGE',
    precioCentavos: 5000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: false, nuevo: true, licencia: null,
    descripcion: "Reloj inteligente LIGE con correa de metal y pantalla AMOLED, para hombre y mujer. Mide presión arterial y oxígeno en sangre, hace llamadas por Bluetooth y es compatible con celulares Samsung y Huawei. Se conecta con la app FitCloudPro.\n\n- Salud: control de presión arterial y oxígeno en sangre\n- Llamadas: por Bluetooth\n- Compatibilidad: celulares Samsung y Huawei\n- Pantalla: AMOLED, 240 x 240, táctil completa\n- Batería: de polímero de litio, 220 mAh, de 7 a 10 días\n- Carga: magnética\n- Resistencia al agua: IP67\n- Correa: 22 mm\n- App: FitCloudPro\n- Colores: negro y dorado\n\nModelo 2023. Entrega inmediata.",
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
    id: 'reloj-bolsillo-one-piece', nombre: 'Reloj de bolsillo One Piece', categoriaId: 'anime', tambienEn: ['relojes'],
    precioCentavos: 1000, precioAntesCentavos: null, stock: null, estado: 'publicado', destacado: true, nuevo: true, licencia: 'generica',
    descripcion: "Reloj de bolsillo de One Piece con la calavera de los Piratas del Sombrero de Paja (Mugiwara) de Luffy, con su sombrero amarillo. La tapa calada deja ver la esfera y tiene la inscripción \"Mugiwara Pirates\". Por detrás lleva un grabado decorativo.\n\n- Tipo: reloj de bolsillo de cuarzo con tapa\n- Acabado: bronce envejecido\n- Incluye: cadena para colgar como collar o llevar en el bolsillo\n- Producto: genérico, no oficial\n\nUn regalo para estudiantes y fanáticos del anime. Entrega inmediata.",
    fotos: [f('Reloj_one_piece (3).jpeg', 1024, 1024), f('Reloj_one_piece (4).jpeg', 500, 500), f('Reloj_one_piece (2).jpg', 554, 554), f('Reloj_one_piece (1).jpeg', 500, 500)],
    tono: 'foto',
  },
];
