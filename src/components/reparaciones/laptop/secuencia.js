// Guion del desarme: datos puros, sin three. La escena lo aplica a los nodos del GLB y el componente lo usa para el texto.
// El orden es el real del equipo: cinco tornillos por debajo, sale la cubierta del teclado y debajo está todo lo demás.
// Tiempos en segundos; desplazamientos en mm (las unidades del modelo).
export const DURACION = 32;
export const INICIO_CICLO = 3;   // al repetir, la tapa ya está abierta
export const T_DESARMADA = 18;   // punto fijo para movimiento reducido

const suave = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const tramo = (t, a, b) => suave((t - a) / (b - a));

const tornillos = [1, 2, 3, 4, 5].map((n, i) => ({ nodo: `Tornillo${n}`, d: [0, -46, 0], sale: 5 + i * 0.18, entra: 26 + i * 0.12, dura: 1.1, vueltas: 5 }));
// d: hacia dónde sale (x derecha, y arriba, z hacia el frente). gira: inclinación final en radianes, para que la cubierta mire a la cámara.
export const PIEZAS = [
  ...tornillos,
  { nodo: 'Teclado', d: [0, 214, -128], gira: [0.62, 0, 0], sale: 7, entra: 24.6, dura: 1.8, etiqueta: 'Teclado y trackpad', lado: 1 },
  { nodo: 'Bateria', d: [0, 34, 64], sale: 9, entra: 23.8, dura: 1.6, etiqueta: 'Batería', lado: 1 },
  { nodo: 'RAM1', d: [0, 128, 0], sale: 10, entra: 23.2, dura: 1.5, inclina: true },
  { nodo: 'RAM2', d: [0, 128, 0], sale: 10.25, entra: 23.05, dura: 1.5, inclina: true, etiqueta: 'Memoria RAM', lado: 1 },
  { nodo: 'SSD', d: [-22, 104, 12], sale: 10.8, entra: 22.6, dura: 1.5, etiqueta: 'SSD', lado: -1 },
  { nodo: 'WiFi', d: [22, 104, 12], sale: 11.2, entra: 22.3, dura: 1.4 },
  { nodo: 'Disipador', d: [0, 84, 0], sale: 11.8, entra: 21.7, dura: 1.6, etiqueta: 'Disipador', lado: 1 },
  { nodo: 'Ventilador', d: [-16, 60, 0], sale: 12, entra: 21.5, dura: 1.6, etiqueta: 'Ventilador', lado: -1 },
  { nodo: 'PlacaBase', d: [0, 34, 0], sale: 12.9, entra: 20.8, dura: 1.6, etiqueta: 'Placa base', lado: 1 },
  { nodo: 'AltavozIzq', d: [-36, 26, 30], sale: 13.6, entra: 20.4, dura: 1.4, etiqueta: 'Altavoces', lado: -1 },
  { nodo: 'AltavozDer', d: [36, 26, 30], sale: 13.6, entra: 20.4, dura: 1.4 },
  { nodo: 'TarjetaExpansion1', d: [-58, 0, 0], sale: 14.2, entra: 20, dura: 1.3 },
  { nodo: 'TarjetaExpansion2', d: [-58, 0, 0], sale: 14.35, entra: 20, dura: 1.3 },
  { nodo: 'TarjetaExpansion3', d: [58, 0, 0], sale: 14.2, entra: 20, dura: 1.3 },
  { nodo: 'TarjetaExpansion4', d: [58, 0, 0], sale: 14.35, entra: 20, dura: 1.3 },
];

export const PASOS = [
  { hasta: 5, titulo: 'Diagnóstico', texto: 'Revisamos tu equipo y te decimos qué tiene, antes de tocar nada.' },
  { hasta: 16, titulo: 'Desarme', texto: 'Cinco tornillos, sale la cubierta del teclado y debajo está todo: batería, memoria, almacenamiento, ventilador y placa.' },
  { hasta: 20, titulo: 'Reparación y mejora', texto: 'Cambiamos lo que falla y ponemos al día la memoria y el almacenamiento. Cada pieza se revisa por separado.' },
  { hasta: DURACION, titulo: 'Armado y prueba', texto: 'Cada pieza vuelve a su lugar, cerramos y probamos que todo funcione antes de entregártela.' },
];

// Cuánto ha salido una pieza (0 en su sitio, 1 fuera) en el segundo t.
export const avance = (pz, t) => tramo(t, pz.sale, pz.sale + pz.dura) * (1 - tramo(t, pz.entra, pz.entra + pz.dura));

export function estado(t) {
  const piezas = PIEZAS.map((pz) => avance(pz, t));
  return {
    piezas,
    tapa: tramo(t, 0.4, 2.8),                                    // 0 cerrada, 1 abierta
    abierta: piezas.reduce((a, b) => a + b, 0) / piezas.length,   // qué tan desarmada está, para la cámara
    pantalla: tramo(t, 28, 29.4),                                 // la pantalla se enciende al final
    paso: Math.max(0, PASOS.findIndex((p) => t < p.hasta)),
  };
}
