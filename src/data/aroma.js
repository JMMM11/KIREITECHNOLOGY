// Aroma: familias olfativas (las cinco del catálogo del dueño), ingredientes y preguntas del recomendador.
// Los perfumes son productos normales de la categoría "aroma" (src/data/productos.js o el panel).
// El color de cada familia lo pone src/components/aroma/Aroma.module.css, solo con la paleta de la marca.
export const FAMILIAS = [
  { id: 'gourmand', nombre: 'Gourmand y dulces', frase: 'Para quedarse cerca.', notas: 'Vainilla, caramelo, praliné' },
  { id: 'frutal', nombre: 'Frutales', frase: 'Jugosas y alegres.', notas: 'Frambuesa, pera, lichi' },
  { id: 'floral', nombre: 'Florales', frase: 'Pétalos recién abiertos.', notas: 'Rosa, jazmín, peonía' },
  { id: 'fresca', nombre: 'Frescas y acuáticas', frase: 'Aire limpio, piel limpia.', notas: 'Brisa marina, manzana verde' },
  { id: 'oriental', nombre: 'Orientales y amaderadas', frase: 'Profundas y envolventes.', notas: 'Ámbar, especias, cedro' },
];

export const INGREDIENTES = [
  { nombre: 'Vainilla', texto: 'Dulce y cremosa. Da calidez y hace que una fragancia se sienta cercana.' },
  { nombre: 'Sándalo', texto: 'Madera suave y lechosa. Es el fondo que hace durar el perfume en la piel.' },
  { nombre: 'Ámbar', texto: 'Resinoso y tibio. Aporta profundidad a las fragancias de noche.' },
  { nombre: 'Cítricos', texto: 'Bergamota, limón y mandarina. Son lo primero que se percibe: frescos y brillantes.' },
  { nombre: 'Flores', texto: 'Rosa, jazmín y azahar. El corazón de la mayoría de los perfumes.' },
  { nombre: 'Especias', texto: 'Pimienta rosa, cardamomo y canela. Un toque que despierta la mezcla.' },
];

export const GENEROS = [['mujer', 'Mujer'], ['hombre', 'Hombre']];

export const PREGUNTAS = [
  { id: 'genero', texto: '¿Para quién es?', opciones: GENEROS },
  { id: 'caracter', texto: '¿Prefieres aromas dulces o frescos?', opciones: [['dulce', 'Dulces'], ['fresco', 'Frescos']] },
  { id: 'intensidad', texto: '¿Te gustan las fragancias suaves o intensas?', opciones: [['suave', 'Suaves'], ['intensa', 'Intensas']] },
  { id: 'familia', texto: '¿Qué familia te atrae más?', opciones: FAMILIAS.map((f) => [f.id, f.nombre]) },
];
