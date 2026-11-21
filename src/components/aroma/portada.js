// Mapeo del scroll de la portada de Aroma: datos puros, sin React, para poder probarlos.
export const N = 120;
export const lim = (v) => Math.min(1, Math.max(0, v));

// Opacidad y movimiento de cada texto según p, el avance del scroll en la pista (0 a 1).
export function pose(p) {
  const nota = lim((p - 0.28) / 0.11) * (1 - lim((p - 0.58) / 0.1));
  const final = lim((p - 0.81) / 0.16);
  return { cuadro: Math.round(p * (N - 1)), titulo: 1 - lim((p - 0.3) / 0.3), nota, final, sube: 1 - lim(p * 4) };
}

