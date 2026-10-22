import { motion } from 'motion/react';
import Foto from '../ui/Foto.jsx';
import Icono from '../ui/Icono.jsx';
import Badge from '../ui/Badge.jsx';
import { ICONOS } from '../iconos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { useCarrito } from '../../context/CarritoContext.jsx';
import s from './LineaCarrito.module.css';

export default function LineaCarrito({ linea: l, editable = true }) {
  const { cambiarCantidad, quitar } = useCarrito();
  return (
    <motion.li
      layout
      className={s.linea}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 32, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={`${s.media} ${l.tono === 'oscuro' ? s.oscuro : ''}`}><Foto foto={l.foto} sizes="72px" /></span>
      <div className={s.info}>
        <p className={s.nombre}>{l.nombre}</p>
        {l.varianteNombre && <p className={s.detalle}>{l.varianteNombre}</p>}
        {l.ejemplo && <Badge estado="ejemplo" />}
        <p className={s.precio}>{formatoPrecio(l.precio * l.cantidad)}</p>
        {editable ? (
          <div className={s.controles}>
            <div className={s.stepper} role="group" aria-label={`Cantidad de ${l.nombre}`}>
              <button type="button" onClick={() => cambiarCantidad(l.clave, l.cantidad - 1)} aria-label="Quitar uno">
                <Icono de={ICONOS.menos.de} mov={ICONOS.menos.mov} entrada={false} tam={16} />
              </button>
              <output aria-live="polite">{l.cantidad}</output>
              <button type="button" onClick={() => cambiarCantidad(l.clave, l.cantidad + 1)} disabled={l.cantidad >= l.tope} aria-label="Agregar uno">
                <Icono de={ICONOS.mas.de} mov={ICONOS.mas.mov} entrada={false} tam={16} />
              </button>
            </div>
            <button type="button" className={s.quitar} onClick={() => quitar(l.clave)}>
              <Icono de={ICONOS.quitar.de} mov={ICONOS.quitar.mov} entrada={false} tam={16} />
              Quitar
            </button>
          </div>
        ) : (
          <p className={s.detalle}>Cantidad: {l.cantidad}</p>
        )}
      </div>
    </motion.li>
  );
}
