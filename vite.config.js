import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// En desarrollo la raíz es src/: este plugin sirve también las fotos originales de Productos/ (en el build ya están en la raíz).
const fotosProductos = {
  name: 'fotos-productos',
  configureServer(server) {
    server.middlewares.use('/Productos', (req, res, next) => {
      const ruta = resolve('Productos', decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''));
      if (!ruta.startsWith(resolve('Productos')) || !existsSync(ruta)) return next();
      createReadStream(ruta).pipe(res);
    });
  },
};

// El build queda en la raíz del repo para abrirlo con Go Live o publicarlo en GitHub Pages desde main.
export default defineConfig({
  plugins: [react(), fotosProductos],
  root: 'src',
  base: './',
  publicDir: '../public',
  envDir: '..',
  build: { outDir: '..', emptyOutDir: false },
});
