// Carga de la página y sus archivos con usuarios virtuales, contra un servidor LOCAL (nunca contra producción).
// Uso: node tests/carga/estaticos.mjs http://localhost:5190 [usuarios] [segundos]
// Mide el servidor de vista previa de esta máquina, no la red de GitHub Pages ni Firebase.
const [base = 'http://localhost:5190', usuarios = '50', segundos = '20'] = process.argv.slice(2);
const html = await (await fetch(`${base}/`)).text();
const archivos = ['/', '/producto/lenovo-gm2-pro', ...[...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]), '/Productos/web/principal-960.jpg'];

const tiempos = [];
let errores = 0;
let bytes = 0;
const fin = Date.now() + Number(segundos) * 1000;
async function usuario() {
  while (Date.now() < fin) {
    for (const ruta of archivos) {
      const t0 = performance.now();
      try {
        const r = await fetch(base + ruta);
        bytes += (await r.arrayBuffer()).byteLength;
        if (!r.ok) errores += 1;
      } catch { errores += 1; }
      tiempos.push(performance.now() - t0);
    }
  }
}
const memoria0 = process.memoryUsage().rss;
await Promise.all(Array.from({ length: Number(usuarios) }, usuario));
tiempos.sort((a, b) => a - b);
const p = (n) => Math.round(tiempos[Math.min(tiempos.length - 1, Math.ceil((n / 100) * tiempos.length) - 1)]);
console.log(JSON.stringify({
  usuarios: Number(usuarios), segundos: Number(segundos), solicitudes: tiempos.length,
  solicitudesPorSegundo: Math.round(tiempos.length / Number(segundos)),
  p50: p(50), p95: p(95), p99: p(99), errores, tasaError: Number((errores / tiempos.length).toFixed(4)),
  megasServidos: Math.round(bytes / 1048576), memoriaClienteMB: Math.round((process.memoryUsage().rss - memoria0) / 1048576),
}));
