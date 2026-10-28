import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import s from './Parallax.module.css';

// La foto se mueve más lento que la página: da profundidad sin mover el contenido de alrededor.
// Sobra un 15% de foto por lado, así nunca se ve el borde. Sin movimiento si el sistema pide reducirlo.
export default function Parallax({ children, className = '' }) {
  const ref = useRef(null);
  const reducir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return (
    <span ref={ref} className={`${s.marco} ${className}`}>
      <motion.span className={s.capa} style={reducir ? undefined : { y, scale: 1.15 }}>{children}</motion.span>
    </span>
  );
}
