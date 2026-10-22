import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import Icono from './Icono.jsx';
import { ICONOS } from '../iconos.js';
import s from './Modal.module.css';

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MOVIMIENTO = {
  derecha: { oculto: { x: '100%' }, visible: { x: 0 } },
  abajo: { oculto: { y: '100%' }, visible: { y: 0 } },
};

// Modal accesible: el resto de la página queda inert, el foco no sale, Escape cierra y el foco vuelve al botón.
export default function Modal({ abierto, onCerrar, titulo, lado = 'derecha', pie, children }) {
  const id = useId();
  const panel = useRef(null);
  const cerrarRef = useRef(onCerrar);
  useEffect(() => { cerrarRef.current = onCerrar; });

  useEffect(() => {
    if (!abierto) return undefined;
    const previo = document.activeElement;
    const raiz = document.getElementById('root');
    raiz.inert = true;
    document.body.style.overflow = 'hidden';
    const enfocables = () => [...(panel.current?.querySelectorAll(ENFOCABLES) ?? [])];
    const marco = requestAnimationFrame(() => (enfocables()[0] ?? panel.current)?.focus());

    const tecla = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); cerrarRef.current(); return; }
      if (e.key !== 'Tab') return;
      const f = enfocables();
      if (!f.length) return;
      const [primero, ultimo] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', tecla);
    return () => {
      cancelAnimationFrame(marco);
      raiz.inert = false;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', tecla);
      if (previo?.isConnected) previo.focus();
    };
  }, [abierto]);

  const m = MOVIMIENTO[lado];
  return createPortal(
    <AnimatePresence>
      {abierto && (
        <div className={s.capa} key="modal">
          <motion.div
            className={s.fondo}
            onClick={() => cerrarRef.current()}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={id}
            tabIndex={-1}
            className={`${s.panel} ${s[lado]}`}
            initial={m.oculto} animate={m.visible} exit={m.oculto}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={s.cabecera}>
              <h2 id={id} className={s.titulo}>{titulo}</h2>
              <button type="button" className={s.cerrar} onClick={() => cerrarRef.current()} aria-label="Cerrar">
                <Icono de={ICONOS.cerrar.de} mov={ICONOS.cerrar.mov} entrada={false} />
              </button>
            </div>
            <div className={s.cuerpo}>{children}</div>
            {pie && <div className={s.pie}>{pie}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
