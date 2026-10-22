import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Icono from './Icono.jsx';
import { ICONOS } from '../iconos.js';
import s from './Desplegable.module.css';

const listaAnim = {
  initial: { opacity: 0, y: -6, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } },
};

// Selector propio (botón + lista) en lugar del <select> nativo, cuya lista abierta no se puede estilizar.
// Teclado: flechas, Inicio/Fin, Enter o Espacio para elegir, Escape para cerrar.
export default function Desplegable({ etiqueta, opciones, valor, onCambio }) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const raiz = useRef(null);
  const boton = useRef(null);
  const lista = useRef(null);
  const id = useId();
  const actual = opciones.find((o) => o.id === valor) ?? opciones[0];

  const abrir = () => { setActivo(Math.max(0, opciones.findIndex((o) => o.id === valor))); setAbierto(true); };
  const cerrar = () => { setAbierto(false); boton.current?.focus(); };
  const elegir = (o) => { onCambio(o.id); cerrar(); };

  useEffect(() => { if (abierto) lista.current?.focus(); }, [abierto]);
  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => { if (!raiz.current?.contains(e.target)) setAbierto(false); };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [abierto]);

  const teclaLista = (e) => {
    const n = opciones.length;
    if (e.key === 'Tab') { setAbierto(false); return; }
    const acciones = {
      ArrowDown: () => setActivo((i) => (i + 1) % n),
      ArrowUp: () => setActivo((i) => (i - 1 + n) % n),
      Home: () => setActivo(0),
      End: () => setActivo(n - 1),
      Enter: () => elegir(opciones[activo]),
      ' ': () => elegir(opciones[activo]),
      Escape: cerrar,
    };
    if (!acciones[e.key]) return;
    e.preventDefault();
    acciones[e.key]();
  };

  return (
    <div ref={raiz} className={s.raiz}>
      <button
        ref={boton}
        type="button"
        className={s.boton}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => (abierto ? cerrar() : abrir())}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abrir(); } }}
      >
        <span className={s.prefijo}>{`${etiqueta}: `}</span>
        <span className={s.valor}>{actual.nombre}</span>
        <Icono de={ICONOS.desplegar.de} mov={ICONOS.desplegar.mov} entrada={false} tam={14} className={`${s.flecha} ${abierto ? s.girada : ''}`} />
      </button>
      <AnimatePresence>
        {abierto && (
          <motion.ul
            ref={lista}
            role="listbox"
            tabIndex={-1}
            aria-label={etiqueta}
            aria-activedescendant={`${id}-${opciones[activo].id}`}
            className={s.lista}
            onKeyDown={teclaLista}
            {...listaAnim}
          >
            {opciones.map((o, i) => (
              <li
                key={o.id}
                id={`${id}-${o.id}`}
                role="option"
                aria-selected={o.id === valor}
                className={`${s.opcion} ${i === activo ? s.activa : ''}`}
                onPointerEnter={() => setActivo(i)}
                onClick={() => elegir(o)}
              >
                {o.nombre}
                {o.id === valor && <Icono de={ICONOS.elegido.de} mov={ICONOS.elegido.mov} entrada={false} tam={16} className={s.marca} />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
