// Calcula el contraste WCAG de cada par texto/fondo de styles/tokens.css. Texto: 4.5:1. Bordes de controles: 3:1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));

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

test('pie de página: texto claro y foco naranja sobre azul marino', () => {
  assert.ok(contraste('#FFFFFF', tokens.marca) >= 4.5);
  assert.ok(contraste('#D8D8D8', tokens.marca) >= 4.5);
  assert.ok(contraste(tokens.accion, tokens.marca) >= 3);
});
