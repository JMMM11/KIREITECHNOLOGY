// Compila la tienda.
//   node scripts/compilar.mjs         -> dist/   para Firebase Hosting (base "/")
//   node scripts/compilar.mjs pages   -> _pages/ para GitHub Pages (base "/KIREITECHNOLOGY/")
// BASE_PATH y SALIDA cambian la base y la carpeta (las pruebas E2E compilan en _e2e/).
import { cpSync, copyFileSync, writeFileSync } from 'node:fs';
import { build } from 'vite';
import { CATEGORIAS } from '../src/data/catalogos.js';
import { PRODUCTOS } from '../src/data/productos.js';
import { SITIO } from '../src/data/sitio.js';
import { LEGAL } from '../src/data/textos.js';

const pages = process.argv[2] === 'pages';
process.env.BASE_PATH ??= pages ? '/KIREITECHNOLOGY/' : '/';
const salida = process.env.SALIDA ?? (pages ? '_pages' : 'dist');
await build({ build: { outDir: `../${salida}`, emptyOutDir: true } });

// Solo las copias livianas (web/) de las fotos: los originales no se publican.
for (const carpeta of ['Productos', 'reparaciones']) cpSync(`${carpeta}/web`, `${salida}/${carpeta}/web`, { recursive: true });
// GitHub Pages responde 404.html a las rutas que no son archivos: así /producto/x abre la tienda.
copyFileSync(`${salida}/index.html`, `${salida}/404.html`);

// Para Google: todas las páginas públicas, incluido cada producto publicado. Siempre con la dirección principal.
const rutas = [
  ['/', '1.0'], ['/tecnologia', '0.9'], ['/anime', '0.8'], ['/reparaciones', '0.8'], ['/ayuda', '0.6'], ['/contacto', '0.6'],
  ...LEGAL.map((d) => [`/legal/${d.id}`, d.id === 'envios' || d.id === 'devoluciones' ? '0.5' : '0.3']),
  ...CATEGORIAS.filter((c) => c.visible && c.seccion === 'tecnologia').map((c) => [`/tecnologia/${c.id}`, '0.8']),
  ...PRODUCTOS.filter((p) => p.estado === 'publicado').map((p) => [`/producto/${p.slug ?? p.id}`, '0.8']),
];
writeFileSync(`${salida}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rutas.map(([ruta, prioridad]) => `  <url><loc>${SITIO.url}${ruta}</loc><priority>${prioridad}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(`${salida}/robots.txt`, `User-agent: *
Allow: /
Disallow: /admin
Disallow: /cuenta
Disallow: /checkout
Disallow: /carrito

Sitemap: ${SITIO.url}/sitemap.xml
`);
