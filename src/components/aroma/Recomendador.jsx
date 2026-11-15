import { useState } from 'react';
import { PREGUNTAS } from '../../data/aroma.js';
import { SITIO } from '../../data/sitio.js';
import { recomendar } from '../../lib/aroma.js';
import s from './Aroma.module.css';

const ayuda = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, ayúdenme a elegir un perfume.')}`;

// Cuatro preguntas que filtran el catálogo que se le pasa (ver lib/aroma.js). El resultado enlaza a la ficha de cada perfume.
export default function Recomendador({ perfumes }) {
  const [r, setR] = useState({});
  const completo = PREGUNTAS.every((p) => r[p.id]);
  const sugeridos = completo ? recomendar(perfumes, r) : [];
  return (
    <div className={s.recomendador}>
      <form className={s.preguntas} onSubmit={(e) => e.preventDefault()}>
        {PREGUNTAS.map((p) => (
          <fieldset key={p.id} className={s.pregunta}>
            <legend>{p.texto}</legend>
            <div className={s.opciones}>
              {p.opciones.map(([valor, texto]) => (
                <label key={valor} className={s.opcion}>
                  <input type="radio" name={p.id} value={valor} checked={r[p.id] === valor} onChange={() => setR((x) => ({ ...x, [p.id]: valor }))} />
                  <span>{texto}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </form>
      <div className={s.resultado} role="status">
        {!completo && <p className={s.resultadoVacio}>Responde las cuatro preguntas y te mostramos las fragancias del catálogo que mejor encajan.</p>}
        {completo && sugeridos.length === 0 && <p className={s.resultadoVacio}>Con esas respuestas no hay una fragancia que encaje en el catálogo actual. <a href={ayuda} target="_blank" rel="noopener noreferrer">Escríbenos</a> y te ayudamos a elegir.</p>}
        {sugeridos.length > 0 && (
          <>
            <p className={s.resultadoTitulo}>Para ti</p>
            <ul className={s.sugeridos}>
              {sugeridos.map((p) => <li key={p.id}><a href={`#p-${p.id}`}>{p.nombre}<span aria-hidden="true"> ›</span></a></li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
