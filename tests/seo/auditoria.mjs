// Auditoría SEO de las páginas públicas: título, descripción, canonical, un H1, orden de encabezados,
// alt en imágenes, JSON-LD y enlaces internos rotos (recorre todo lo que enlaza la tienda).
// Uso: con la tienda corriendo (npx vite --port 5192), `node tests/seo/auditoria.mjs http://localhost:5192`
import { chromium } from '@playwright/test';

const base = (process.argv[2] ?? 'http://localhost:5192').replace(/\/$/, '');
const privadas = /^\/(admin|cuenta|checkout|carrito)/;
const navegador = await chromium.launch({ channel: 'chrome' });
const pagina = await navegador.newPage();
const pendientes = ['/'];
const vistas = new Set();
const problemas = [];

while (pendientes.length) {
  const ruta = pendientes.shift();
  if (vistas.has(ruta)) continue;
  vistas.add(ruta);
  await pagina.goto(base + ruta, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(300);
  const d = await pagina.evaluate(() => ({
    titulo: document.title,
    descripcion: document.querySelector('meta[name="description"]')?.content ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
    niveles: [...document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')].map((h) => Number(h.tagName[1])),
    sinAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.src.split('/').pop()),
    jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => { try { const j = JSON.parse(s.textContent); return (j['@graph'] ?? [j]).map((x) => [x['@type']].flat().join('+')); } catch { return ['JSON inválido']; } }),
    enlaces: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
    es404: !!document.querySelector('[data-pagina-404]') || /Error 404/.test(document.body.innerText),
  }));
  const p = (m) => problemas.push(`${ruta}: ${m}`);
  if (d.es404) p('enlace roto, abre la página 404');
  if (!privadas.test(ruta)) {
    if (d.h1.length !== 1) p(`${d.h1.length} H1 (${d.h1.join(' | ')})`);
    if (!d.descripcion) p('sin meta descripción');
    if (!d.canonical.endsWith(ruta === '/' ? '/' : ruta)) p(`canonical ${d.canonical}`);
    if (d.titulo.length > 65) p(`título largo (${d.titulo.length}): ${d.titulo}`);
    if (d.descripcion.length > 160) p(`descripción larga (${d.descripcion.length})`);
    d.niveles.forEach((n, i) => { if (i && n > d.niveles[i - 1] + 1) p(`salto de encabezado h${d.niveles[i - 1]} a h${n}`); });
  }
  if (d.sinAlt.length) p(`imágenes sin alt: ${d.sinAlt.join(', ')}`);
  if (d.jsonld.includes('JSON inválido')) p('JSON-LD inválido');
  if (ruta.startsWith('/producto/') && !d.jsonld.includes('Product')) p('producto sin JSON-LD Product');
  console.log(`${ruta}  h1=${d.h1.length}  ld=[${d.jsonld.join(',')}]  "${d.titulo}"`);
  for (const h of d.enlaces) {
    if (!h.startsWith('/') || h.startsWith('//')) continue;
    const limpia = h.split(/[?#]/)[0];
    if (/\.(xml|txt|jpg|png|pdf)$/.test(limpia)) continue;
    if (!vistas.has(limpia) && !pendientes.includes(limpia)) pendientes.push(limpia);
  }
}
await navegador.close();
console.log(`\n${vistas.size} páginas revisadas, ${problemas.length} problemas`);
problemas.forEach((m) => console.log(' - ' + m));
process.exitCode = problemas.length ? 1 : 0;
