// Calcula el contraste WCAG de cada par texto/fondo de styles/tokens.css. Texto: 4.5:1. Bordes de controles: 3:1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
// Tokens de un bloque (`:root`, `.tema-taller`...): cada tema remapea los mismos nombres.
const bloque = (selector) => {
  const cuerpo = css.slice(css.indexOf(selector + ' {')).split('\n}')[0];
  return Object.fromEntries([...cuerpo.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
};
const tokens = bloque(':root');

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const TEXTO = [
  ['texto', 'bg'], ['texto', 'superficie'], ['texto', 'superficie-2'],
  ['texto-suave', 'bg'], ['texto-suave', 'superficie'], ['texto-suave', 'superficie-2'],
  ['accion-texto', 'accion'], ['accion-texto', 'accion-hover'],
  ['marca-texto', 'marca'], ['marca-texto', 'marca-hover'],
  ['error', 'error-bg'], ['error', 'superficie'], ['efectivo-fg', 'efectivo-bg'],
  ...['nuevo', 'oferta', 'ultimas', 'agotado', 'recibido', 'confirmado', 'enviado', 'entregado', 'cancelado', 'ejemplo'].map((e) => [`e-${e}-fg`, `e-${e}-bg`]),
];
const CONTROLES = [['borde-fuerte', 'bg'], ['borde-fuerte', 'superficie'], ['foco', 'bg'], ['foco', 'superficie']];

test('texto con contraste AA (4.5:1)', () => {
  for (const [fg, bg] of TEXTO) {
    const r = contraste(tokens[fg], tokens[bg]);
    assert.ok(r >= 4.5, `--${fg} sobre --${bg}: ${r.toFixed(2)}`);
  }
});

test('bordes de controles y foco (3:1)', () => {
  for (const [fg, bg] of CONTROLES) {
    const r = contraste(tokens[fg], tokens[bg]);
    assert.ok(r >= 3, `--${fg} sobre --${bg}: ${r.toFixed(2)}`);
  }
});

test('tema taller: naranja y blanco sobre marino noche', () => {
  const t = bloque('.tema-taller');
  assert.ok(contraste(t['accion-texto'], t.accion) >= 4.5, 'texto del botón naranja');
  assert.ok(contraste(t['acento-texto'], t['fondo-taller']) >= 4.5, 'naranja de texto sobre marino noche');
  assert.ok(contraste(t['texto-claro'], t['fondo-taller']) >= 4.5, 'niebla sobre marino noche');
  assert.ok(contraste(t.accion, t['fondo-taller']) >= 3, 'botón naranja sobre marino noche');
  assert.ok(contraste('#FFFFFF', t['fondo-taller-2']) >= 4.5);
});

test('combinaciones permitidas del manual de marca', () => {
  const pares = [
    ['#111111', '#F7931E', 'negro sobre naranja (botón)'], ['#111111', '#E5850F', 'negro sobre naranja hover'],
    ['#F7931E', '#0B1F33', 'naranja sobre marino'], ['#FFFFFF', '#0B1F33', 'blanco sobre marino'],
    ['#B7C4D3', '#0B1F33', 'niebla sobre marino'], ['#D8D8D8', '#0B1F33', 'plata sobre marino'],
    ['#9A5200', '#F7F5F1', 'cobre sobre papel'], ['#9A5200', '#FDEBD3', 'cobre sobre durazno'], ['#8A4B00', '#FDEBD3', 'aviso sobre durazno'],
    ['#0B1F33', '#E4E9EF', 'marino sobre hielo'], ['#666666', '#F7F5F1', 'gris lema sobre papel'], ['#666666', '#FFFFFF', 'gris lema sobre blanco'],
    ['#111111', '#EFECE6', 'negro sobre arena'], ['#0B1F33', '#FFFFFF', 'marino sobre blanco'],
  ];
  for (const [fg, bg, nombre] of pares) assert.ok(contraste(fg, bg) >= 4.5, `${nombre}: ${contraste(fg, bg).toFixed(2)}`);
  // Prohibido por el manual: texto blanco sobre naranja (no llega ni a 3:1).
  assert.ok(contraste('#FFFFFF', '#F7931E') < 3);
});

test('pie de página: texto claro y foco naranja sobre azul marino', () => {
  assert.ok(contraste('#FFFFFF', tokens.marca) >= 4.5);
  assert.ok(contraste('#D8D8D8', tokens.marca) >= 4.5);
  assert.ok(contraste(tokens.accion, tokens.marca) >= 3);
});
