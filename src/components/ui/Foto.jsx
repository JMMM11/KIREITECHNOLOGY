import s from './Foto.module.css';

const RUTA = './fotos/';

// Foto en dos tamaños (-m y -l) con ancho y alto definidos para que no salte el diseño.
export default function Foto({ foto, alt = '', sizes = '(min-width: 900px) 40vw, 90vw', prioridad = false, className = '' }) {
  if (!foto) {
    return (
      <span className={`${s.vacia} ${className}`}>
        <img src="./marca/kirei-icono.svg" alt="" width="20" height="38" />
        <span>Foto pendiente</span>
      </span>
    );
  }
  const m = Math.min(600, foto.ancho);
  const l = Math.min(1200, foto.ancho);
  return (
    <img
      className={className}
      src={`${RUTA}${foto.base}-l.webp`}
      srcSet={`${RUTA}${foto.base}-m.webp ${m}w, ${RUTA}${foto.base}-l.webp ${l}w`}
      sizes={sizes}
      width={l}
      height={Math.round((foto.alto * l) / foto.ancho)}
      alt={alt}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchPriority={prioridad ? 'high' : undefined}
      decoding="async"
      draggable="false"
    />
  );
}
