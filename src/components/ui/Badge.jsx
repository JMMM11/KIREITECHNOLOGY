import Icono from './Icono.jsx';
import { ICONOS_ESTADO } from '../iconos.js';
import s from './Badge.module.css';

// Insignia de estado: color + ícono + texto, nunca solo color.
export default function Badge({ estado, className = '' }) {
  const e = ICONOS_ESTADO[estado];
  if (!e) return null;
  return (
    <span
      className={`${s.badge} ${e.lleno ? s.lleno : ''} ${className}`}
      style={{ '--fg': `var(--e-${estado}-fg)`, '--bg': `var(--e-${estado}-bg)` }}
    >
      <Icono de={e.de} mov={e.mov} tam={13} />
      {e.texto}
    </span>
  );
}
