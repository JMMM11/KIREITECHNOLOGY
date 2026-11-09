// Celular (390 px, 4G simulada): desborde horizontal, LCP y CLS de cada página pública.
// Uso: con `npx vite preview --port 5193` corriendo, `node tests/seo/movil.mjs http://localhost:5193`
import { chromium } from '@playwright/test';

const base = (process.argv[2] ?? 'http://localhost:5193').replace(/\/$/, '');
const rutas = ['/', '/tecnologia', '/tecnologia/audifonos', '/producto/lenovo-gm2-pro', '/producto/heart-buds', '/anime', '/reparaciones',
  '/ayuda', '/contacto', '/legal/envios', '/legal/devoluciones', '/carrito', '/cuenta', '/no-existe'];
const navegador = await chromium.launch({ channel: 'chrome' });
let fallas = 0;
for (const ruta of rutas) {
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const pagina = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pagina);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: 9e6 / 8, uploadThroughput: 3e6 / 8 });
  await pagina.addInitScript(() => {
    window.__cls = 0; window.__lcp = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { const e = l.getEntries().at(-1); if (e) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await pagina.goto(base + ruta, { waitUntil: 'networkidle' });
  await pagina.mouse.wheel(0, 1500);
  await pagina.waitForTimeout(800);
  const m = await pagina.evaluate(() => ({ ancho: document.documentElement.scrollWidth, cls: window.__cls, lcp: window.__lcp }));
  const malo = m.ancho > 390 || m.cls > 0.1 || m.lcp > 2500;
  if (malo) fallas++;
  console.log(`${malo ? 'REVISAR' : 'ok     '} ${ruta.padEnd(28)} ancho=${m.ancho}  LCP=${Math.round(m.lcp)} ms  CLS=${m.cls.toFixed(3)}`);
  await ctx.close();
}
await navegador.close();
process.exitCode = fallas ? 1 : 0;
