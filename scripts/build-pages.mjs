// Compila la tienda para GitHub Pages en _pages/: vive en /KIREITECHNOLOGY/ y no reescribe rutas como Firebase.
// Las pruebas E2E lo reutilizan con BASE_PATH=/ y SALIDA=_e2e.
import { cpSync, copyFileSync } from 'node:fs';
import { build } from 'vite';

process.env.BASE_PATH ??= '/KIREITECHNOLOGY/';
const salida = process.env.SALIDA ?? '_pages';
await build({ build: { outDir: `../${salida}`, emptyOutDir: true } });

// Solo las copias livianas (web/): la tienda no usa los originales. En el build normal ya están en la raíz del repo.
for (const carpeta of ['Productos', 'reparaciones']) cpSync(`${carpeta}/web`, `${salida}/${carpeta}/web`, { recursive: true });
// GitHub Pages responde 404.html a las rutas que no son archivos: así /producto/x abre la tienda.
copyFileSync(`${salida}/index.html`, `${salida}/404.html`);
