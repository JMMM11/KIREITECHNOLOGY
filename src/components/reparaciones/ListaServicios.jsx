import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { GRUPOS_SERVICIO } from '../../data/servicios.js';
import s from './Reparaciones.module.css';

// Servicios en dos pestañas. Cada fila lleva directo al formulario con el servicio elegido.
export default function ListaServicios({ onElegir }) {
  const [activo, setActivo] = useState(0);
  const pestanas = useRef([]);
  const grupo = GRUPOS_SERVICIO[activo];

  const tecla = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + GRUPOS_SERVICIO.length) % GRUPOS_SERVICIO.length;
    setActivo(n);
    pestanas.current[n]?.focus();
  };

  return (
    <section className="seccion" aria-labelledby="servicios-titulo">
      <div className="contenedor">
        <div className={s.serviciosCabecera}>
          <h2 id="servicios-titulo" className="titulo">Servicios</h2>
          <div role="tablist" aria-label="Tipo de servicio" className={s.pestanas}>
            {GRUPOS_SERVICIO.map((g, i) => (
              <button
                key={g.id}
                ref={(el) => { pestanas.current[i] = el; }}
                type="button"
                role="tab"
                id={`pestana-${g.id}`}
                aria-selected={i === activo}
                aria-controls={`panel-${g.id}`}
                tabIndex={i === activo ? 0 : -1}
                className={s.pestana}
                onClick={() => setActivo(i)}
                onKeyDown={(e) => tecla(e, i)}
              >
                {i === activo && <motion.span layoutId="pestana-activa" className={s.pestanaFondo} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className={s.pestanaTexto}>{g.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" id={`panel-${grupo.id}`} aria-labelledby={`pestana-${grupo.id}`} className={s.panel}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul key={grupo.id} className={s.lista} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {grupo.servicios.map((sv) => (
                <li key={sv.id} className={s.fila}>
                  <div className={s.filaTexto}>
                    <h3 className={s.filaNombre}>{sv.nombre}</h3>
                    <p className={s.filaDetalle}>{sv.detalle}</p>
                  </div>
                  <span className={s.filaPrecio}>[precio]</span>
                  <button type="button" className={s.agendar} onClick={() => onElegir(sv.nombre)} aria-label={`Agendar ${sv.nombre}`}>
                    Agendar <Icono de={ICONOS.siguiente.de} mov={ICONOS.siguiente.mov} entrada={false} tam={16} />
                  </button>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
        <p className={s.nota}>Solo sistemas basados en Windows.</p>
      </div>
    </section>
  );
}
