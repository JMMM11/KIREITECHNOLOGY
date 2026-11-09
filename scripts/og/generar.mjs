// Genera public/og-kirei.jpg (1200 x 630) desde og.html con fotos reales de la tienda.
// Se dibuja al doble de tamaño y se reduce, para que el texto y las fotos queden nítidos.
// Uso: node scripts/og/generar.mjs
import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const plantilla = fileURLToPath(new URL('./og.html', import.meta.url));
const salida = fileURLToPath(new URL('../../public/og-kirei.jpg', import.meta.url));
const navegador = await chromium.launch({ channel: 'chrome' });
const grande = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await grande.goto(pathToFileURL(plantilla).href, { waitUntil: 'networkidle' });
await grande.evaluate(() => document.fonts.ready);
const png = await grande.screenshot({ type: 'png' });

// Reducción a 1200 x 630 con el propio navegador (sin dependencias extra) y JPEG de buena calidad.
const final = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await final.setContent(`<body style="margin:0"><img id="i" src="data:image/png;base64,${png.toString('base64')}" style="width:1200px;height:630px;display:block"></body>`);
await final.waitForFunction(() => document.getElementById('i').complete);
await final.screenshot({ path: salida, type: 'jpeg', quality: 90 });
await navegador.close();
console.log('Listo:', salida);
