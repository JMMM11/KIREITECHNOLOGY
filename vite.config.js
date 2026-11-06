import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { SITIO } from './src/data/sitio.js';

// En desarrollo la raíz es src/: este plugin sirve también las fotos de Productos/ y reparaciones/.
// En la compilación, scripts/compilar.mjs copia sus copias livianas (web/).
const fotosProductos = {
  name: 'fotos-productos',
  configureServer(server) {
    for (const carpeta of ['Productos', 'reparaciones']) {
      server.middlewares.use(`/${carpeta}`, (req, res, next) => {
        const ruta = resolve(carpeta, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''));
        if (!ruta.startsWith(resolve(carpeta)) || !existsSync(ruta)) return next();
        createReadStream(ruta).pipe(res);
      });
    }
  },
};

// index.html usa %VITE_SITIO_URL% para canonical, Open Graph y datos de Google.
process.env.VITE_SITIO_URL = SITIO.url;

// Compila con npm run build (dist/, Firebase) o npm run build:pages (_pages/, GitHub Pages): ver scripts/compilar.mjs.
// base absoluta: con rutas sin # una ruta relativa se rompe al recargar /producto/x (buscaría /producto/assets/...).
export default defineConfig({
  plugins: [react(), fotosProductos],
  root: 'src',
  base: process.env.BASE_PATH ?? '/',
  publicDir: '../public',
  envDir: '..',
  build: { outDir: '../dist', emptyOutDir: true },
});
