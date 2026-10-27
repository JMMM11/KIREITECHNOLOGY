import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import Icono from './Icono.jsx';
import { ICONOS } from '../iconos.js';
import s from './Carrusel.module.css';

// Fila de productos con desplazamiento nativo: táctil en el teléfono, flechas y teclado en escritorio.
// Sin autoplay: el cliente decide cuándo moverse.
export default function Carrusel({ id, titulo, accion, children }) {
  const pista = useRef(null);
  const reducir = useReducedMotion();
  const [bordes, setBordes] = useState({ inicio: true, fin: false });

  useEffect(() => {
    const el = pista.current;
    const medir = () => setBordes((b) => {
      const inicio = el.scrollLeft <= 4;
      const fin = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      return b.inicio === inicio && b.fin === fin ? b : { inicio, fin };
    });
    medir();
    el.addEventListener('scroll', medir, { passive: true });
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => { el.removeEventListener('scroll', medir); obs.disconnect(); };
  }, [children]);

  const mover = (dir) => pista.current.scrollBy({ left: dir * pista.current.clientWidth * 0.9, behavior: reducir ? 'auto' : 'smooth' });
  const items = Array.isArray(children) ? children : [children];

  return (
    <section className={s.carrusel} aria-roledescription="carrusel" aria-labelledby={`${id}-titulo`}>
      <div className={s.cabecera}>
        <h2 id={`${id}-titulo`} className="titulo">{titulo}</h2>
        <div className={s.controles}>
          {accion}
          <button type="button" className={s.flecha} onClick={() => mover(-1)} disabled={bordes.inicio} aria-controls={`${id}-pista`} aria-label="Ver anteriores">
            <Icono de={ICONOS.anterior.de} mov={ICONOS.anterior.mov} entrada={false} tam={18} />
          </button>
          <button type="button" className={s.flecha} onClick={() => mover(1)} disabled={bordes.fin} aria-controls={`${id}-pista`} aria-label="Ver más">
            <Icono de={ICONOS.siguiente.de} mov={ICONOS.siguiente.mov} entrada={false} tam={18} />
          </button>
        </div>
      </div>
      <ul ref={pista} id={`${id}-pista`} className={s.pista}>
        {items.map((hijo, i) => (
          <li key={hijo.key ?? i} className={s.diapositiva} aria-roledescription="diapositiva" aria-label={`${i + 1} de ${items.length}`}>{hijo}</li>
        ))}
      </ul>
    </section>
  );
}
