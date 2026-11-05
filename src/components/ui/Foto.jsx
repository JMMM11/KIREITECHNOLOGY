import { anchosWeb, rutaWeb } from '../../lib/fotos.js';
import s from './Foto.module.css';

const RUTA = import.meta.env.BASE_URL;

// Foto con ancho y alto definidos para que no salte el diseño.
// foto.src: archivo de Productos/ o reparaciones/ (se sirve su copia liviana de web/; el original no se toca)
// o URL completa de Cloudinary (ya llega optimizada).
export default function Foto({ foto, alt = '', sizes = '(min-width: 900px) 40vw, 90vw', prioridad = false, className = '' }) {
  if (!foto?.src) {
    return (
      <span className={`${s.vacia} ${className}`}>
        <img className={s.icono} src={`${RUTA}marca/kirei-icono.svg`} alt="" width="20" height="38" />
        <span>Foto pendiente</span>
      </span>
    );
  }
  const externa = /^https?:/.test(foto.src);
  const anchos = anchosWeb(foto.src);
  const url = (src) => `${RUTA}${encodeURI(src)}`;
  return (
    <img
      className={className}
      src={externa ? foto.src : url(rutaWeb(foto.src, anchos[1]))}
      srcSet={externa ? undefined : anchos.map((w) => `${url(rutaWeb(foto.src, w))} ${w}w`).join(', ')}
      sizes={externa ? undefined : sizes}
      width={foto.ancho}
      height={foto.alto}
      alt={alt}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchPriority={prioridad ? 'high' : undefined}
      decoding="async"
      draggable="false"
    />
  );
}
