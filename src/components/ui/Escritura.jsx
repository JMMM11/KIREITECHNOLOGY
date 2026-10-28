import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import s from './Escritura.module.css';

// Escribe y borra varias frases. Los lectores de pantalla leen solo la primera, fija.
// La frase más larga reserva el espacio, así el resto de la página nunca salta.
export default function Escritura({ frases, pausa = 2200 }) {
  const reducir = useReducedMotion();
  const [texto, setTexto] = useState(frases[0]);

  useEffect(() => {
    if (reducir || frases.length < 2) return undefined;
    let i = 0;
    let n = frases[0].length;
    let borrando = false;
    let t;
    const paso = () => {
      if (!borrando && n === frases[i].length) { borrando = true; t = setTimeout(paso, pausa); return; }
      if (borrando && n === 0) { borrando = false; i = (i + 1) % frases.length; t = setTimeout(paso, 300); return; }
      n += borrando ? -1 : 1;
      setTexto(frases[i].slice(0, n));
      t = setTimeout(paso, borrando ? 35 : 70);
    };
    paso();
    return () => clearTimeout(t);
  }, [frases, pausa, reducir]);

  const larga = frases.reduce((a, b) => (b.length > a.length ? b : a), '');
  return (
    <>
      <span className="sr-only">{frases[0]}</span>
      <span className={s.pila} aria-hidden="true">
        <span className={s.reserva}>{larga}</span>
        <span className={s.texto}>{texto}<span className={s.cursor} /></span>
      </span>
    </>
  );
}
