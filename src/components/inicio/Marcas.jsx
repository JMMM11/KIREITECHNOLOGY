import { useState } from 'react';
import { INICIO } from '../../data/textos.js';
import s from './Marcas.module.css';

// Cinta infinita de logos. La lista va dos veces seguidas y se desplaza la mitad: al terminar, empieza igual.
// Se detiene al pasar el mouse, al enfocar y con el botón (pedido de accesibilidad para todo lo que se mueve solo).
// Con "reducir movimiento" los logos quedan quietos en filas.
export default function Marcas() {
  const { titulo, lista } = INICIO.marcas;
  const [pausada, setPausada] = useState(false);
  const logos = (copia) => lista.map((m) => (
    <li key={`${copia}-${m.nombre}`} className={s.marca} aria-hidden={copia ? 'true' : undefined}>
      <img src={`${import.meta.env.BASE_URL}${m.logo}`} alt={copia ? '' : m.nombre} width={m.ancho} height={m.alto} loading="lazy" decoding="async" />
    </li>
  ));
  return (
    <section className={`seccion ${s.seccion}`} aria-labelledby="marcas-titulo">
      <div className={`contenedor ${s.cabecera}`}>
        <h2 id="marcas-titulo" className="titulo">{titulo}</h2>
        <button type="button" className={s.pausa} onClick={() => setPausada((p) => !p)} aria-pressed={pausada}>
          {pausada ? 'Reanudar' : 'Pausar'}
        </button>
      </div>
      <div className={s.ventana}>
        <ul className={`${s.cinta} ${pausada ? s.pausada : ''}`} aria-label="Marcas">
          {logos(0)}
          {logos(1)}
        </ul>
      </div>
    </section>
  );
}
