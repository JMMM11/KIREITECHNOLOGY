import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import s from './Contador.module.css';

const ALTO = 1.1; // em por dígito

function Digito({ d, activo, retraso }) {
  return (
    <span className={s.ventana}>
      <motion.span
        className={s.tira}
        initial={false}
        animate={{ y: activo ? `${-(10 + d) * ALTO}em` : '0em' }}
        transition={{ type: 'spring', stiffness: 55, damping: 15, delay: retraso }}
      >
        {Array.from({ length: 20 }, (_, i) => <span key={i}>{i % 10}</span>)}
      </motion.span>
    </span>
  );
}

// Odómetro: cada dígito rueda dos vueltas hasta su valor. La clave se cuenta desde la derecha
// para que, si la cifra cambia en vivo, cada posición ruede a su nuevo dígito.
export default function Contador({ valor, prefijo = '', sufijo = '', className = '' }) {
  const ref = useRef(null);
  const visto = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const digitos = String(valor).split('');
  return (
    <span ref={ref} className={`${s.contador} ${className}`}>
      <span className="sr-only">{`${prefijo}${valor}${sufijo}`}</span>
      <span aria-hidden="true" className={s.visual}>
        {prefijo}
        {digitos.map((d, i) => (
          /\d/.test(d)
            ? <Digito key={digitos.length - i} d={Number(d)} activo={visto} retraso={i * 0.09} />
            : <span key={digitos.length - i}>{d}</span>
        ))}
        {sufijo}
      </span>
    </span>
  );
}
