import { useEffect } from 'react';
import { SITIO } from '../data/sitio.js';

const BASE = 'Kirei Technology';
const meta = () => document.querySelector('meta[name="description"]');
const canonica = () => document.querySelector('link[rel="canonical"]');
// La descripción de index.html es la general; cada página puede poner la suya y se restaura al salir.
const DESCRIPCION_GENERAL = typeof document === 'undefined' ? '' : meta()?.content ?? '';

// Título, descripción y dirección canónica de cada página: Google los usa en los resultados de búsqueda.
export function useTituloPagina(titulo, descripcion) {
  useEffect(() => {
    const completo = `${titulo} | ${BASE}`;
    document.title = !titulo ? `${BASE} | Tecnología en Panamá` : completo.length > 60 ? titulo : completo;
    meta()?.setAttribute('content', descripcion || DESCRIPCION_GENERAL);
    // Siempre la dirección principal, aunque se vea desde GitHub Pages: así Google no ve dos tiendas.
    const ruta = location.pathname.slice(import.meta.env.BASE_URL.length - 1) || '/';
    canonica()?.setAttribute('href', `${SITIO.url}${ruta}`);
  }, [titulo, descripcion]);
}
