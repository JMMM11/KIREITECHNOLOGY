import { useLocation } from 'wouter';
import { motion } from 'motion/react';
import { ICONOS } from '../iconos.js';
import { conFirebase } from '../../services/tienda.js';
import { useCuenta } from '../../context/CuentaContext.jsx';
import s from './BotonFavorito.module.css';

// Corazón para guardar productos. Sin sesión lleva a la cuenta y luego devuelve al cliente donde estaba.
export default function BotonFavorito({ producto, conTexto = false, className = '' }) {
  const { usuario, esFavorito, alternarFavorito } = useCuenta();
  const [, navegar] = useLocation();
  if (!conFirebase) return null;
  const activo = esFavorito(producto.id);
  const I = activo ? ICONOS.favorito.lleno : ICONOS.favorito.de;

  async function clic() {
    if (await alternarFavorito(producto.id)) return;
    try { sessionStorage.setItem('kirei:volver', window.location.hash.slice(1) || '/'); } catch { /* sin almacenamiento: vuelve al inicio */ }
    navegar('/cuenta');
  }

  return (
    <button
      type="button"
      className={`${conTexto ? s.conTexto : s.favorito} ${className}`}
      onClick={clic}
      disabled={usuario === undefined}
      aria-pressed={activo}
      aria-label={conTexto ? undefined : `Guardar ${producto.nombre} en favoritos`}
    >
      <motion.span key={String(activo)} className={s.corazon} data-activo={activo} initial={activo ? { scale: 0.5 } : false} animate={{ scale: [0.5, 1.25, 1] }} transition={{ duration: 0.35 }}>
        <I size={18} aria-hidden="true" focusable="false" />
      </motion.span>
      {conTexto && (activo ? 'Guardado en favoritos' : 'Guardar en favoritos')}
    </button>
  );
}
