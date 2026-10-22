import s from './IconoKirei.module.css';

// El ícono de la marca (antena con señal), tomado de public/marca/kirei-icono.svg.
// estado: 'normal' | 'cargando' (las ondas se encienden en secuencia) | 'sinSenal' (ondas apagadas).
export default function IconoKirei({ estado = 'normal', alto = 120, className = '' }) {
  return (
    <svg
      className={`${s.icono} ${s[estado] ?? ''} ${className}`}
      viewBox="14 8 92 214"
      height={alto}
      width={(alto * 92) / 214}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeWidth="8" strokeLinecap="round">
        <path className={s.ondaInterna} d="M38,44 A26,26 0 0 1 82,44" />
        <path className={s.ondaExterna} d="M26,34 A42,42 0 0 1 94,34" />
      </g>
      <circle className={s.punto} cx="60" cy="58" r="7" />
      <rect className={s.cuerpo} x="57.5" y="62" width="5" height="50" />
      <rect className={s.cuerpo} x="42" y="106" width="36" height="112" rx="18" />
      <rect className={s.ranura} x="49" y="124" width="5" height="76" rx="2.5" />
    </svg>
  );
}
