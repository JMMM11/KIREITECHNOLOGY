import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El build queda en la raíz del repo para abrirlo con Go Live o publicarlo en GitHub Pages desde main.
export default defineConfig({
  plugins: [react()],
  root: 'src',
  base: './',
  publicDir: '../public',
  envDir: '..',
  build: { outDir: '..', emptyOutDir: false },
});
