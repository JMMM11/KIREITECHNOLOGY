// Aroma: familias olfativas, ingredientes y catálogo de muestra.
// tono/tinta: el color propio de cada familia (fondo y texto), verificados a 4.5:1 en tests/aroma.test.js.
export const FAMILIAS = [
  { id: 'floral', nombre: 'Florales', frase: 'Pétalos recién abiertos.', notas: 'Rosa, jazmín, peonía', tono: '#F3DDE0', tinta: '#5A1F33' },
  { id: 'amaderada', nombre: 'Amaderadas', frase: 'Cálidas y con carácter.', notas: 'Sándalo, cedro, vetiver', tono: '#3B2A22', tinta: '#F6F1E7' },
  { id: 'citrica', nombre: 'Cítricas', frase: 'Luz de la mañana.', notas: 'Bergamota, limón, mandarina', tono: '#F1E7B4', tinta: '#4A3D08' },
  { id: 'oriental', nombre: 'Orientales', frase: 'Profundas y envolventes.', notas: 'Ámbar, incienso, especias', tono: '#4A1F3A', tinta: '#F6F1E7' },
  { id: 'fresca', nombre: 'Frescas', frase: 'Aire limpio, piel limpia.', notas: 'Notas marinas, menta, té verde', tono: '#D9E6E3', tinta: '#173B37' },
  { id: 'gourmand', nombre: 'Dulces y gourmand', frase: 'Para quedarse cerca.', notas: 'Vainilla, caramelo, haba tonka', tono: '#EBD5BC', tinta: '#4F2C12' },
];

export const INGREDIENTES = [
  { nombre: 'Vainilla', texto: 'Dulce y cremosa. Da calidez y hace que una fragancia se sienta cercana.' },
  { nombre: 'Sándalo', texto: 'Madera suave y lechosa. Es el fondo que hace durar el perfume en la piel.' },
  { nombre: 'Ámbar', texto: 'Resinoso y tibio. Aporta profundidad a las fragancias de noche.' },
  { nombre: 'Cítricos', texto: 'Bergamota, limón y mandarina. Son lo primero que se percibe: frescos y brillantes.' },
  { nombre: 'Flores', texto: 'Rosa, jazmín y azahar. El corazón de la mayoría de los perfumes.' },
  { nombre: 'Especias', texto: 'Pimienta rosa, cardamomo y canela. Un toque que despierta la mezcla.' },
];

// CATÁLOGO DE MUESTRA. No es inventario ni son precios de Kirei: son fichas de ejemplo para ver cómo queda la sección.
// Se muestran con la insignia "Muestra" y sin compra, solo mientras no haya perfumes publicados en la categoría "aroma".
// Los perfumes reales se crean en /admin con categoría Aroma; en la tabla de datos se ponen las filas
// "Familia", "Tamaño", "Intensidad" (Suave o Intensa) y "Momento" (Día o Noche), que es lo que leen los filtros.
const muestra = (id, nombre, familia, ml, precioCentavos, intensidad, momento, descripcion) =>
  ({ id, nombre, familia, ml, precioCentavos, intensidad, momento, descripcion, ejemplo: true });
export const PERFUMES_MUESTRA = [
  muestra('flor-de-lino', 'Flor de Lino', 'floral', 100, 4500, 'suave', 'dia', 'Peonía y jazmín sobre almizcle blanco. Limpio y luminoso.'),
  muestra('madera-negra', 'Madera Negra', 'amaderada', 100, 5500, 'intensa', 'noche', 'Cedro, vetiver y un fondo de cuero suave. Seco y elegante.'),
  muestra('citrico-507', 'Cítrico 507', 'citrica', 50, 3500, 'suave', 'dia', 'Bergamota y mandarina con un toque de albahaca. Fresco de principio a fin.'),
  muestra('ambar-nocturno', 'Ámbar Nocturno', 'oriental', 100, 6000, 'intensa', 'noche', 'Ámbar, incienso y cardamomo. Cálido, para salir de noche.'),
  muestra('brisa-marina', 'Brisa Marina', 'fresca', 100, 4000, 'suave', 'dia', 'Notas marinas, té verde y menta. Como recién salido de la ducha.'),
  muestra('vainilla-tostada', 'Vainilla Tostada', 'gourmand', 50, 3800, 'intensa', 'noche', 'Vainilla, caramelo y haba tonka. Dulce sin empalagar.'),
];

export const PREGUNTAS = [
  { id: 'caracter', texto: '¿Prefieres aromas dulces o frescos?', opciones: [['dulce', 'Dulces'], ['fresco', 'Frescos']] },
  { id: 'intensidad', texto: '¿Te gustan las fragancias suaves o intensas?', opciones: [['suave', 'Suaves'], ['intensa', 'Intensas']] },
  { id: 'momento', texto: '¿La buscas para el día o para la noche?', opciones: [['dia', 'Día'], ['noche', 'Noche']] },
  { id: 'familia', texto: '¿Qué familia te atrae más?', opciones: [['floral', 'Floral'], ['amaderada', 'Amaderada'], ['citrica', 'Cítrica'], ['oriental', 'Oriental']] },
];
