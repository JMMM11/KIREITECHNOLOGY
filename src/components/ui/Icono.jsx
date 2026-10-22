import { motion } from 'motion/react';

// Entrada única al aparecer en pantalla. El movimiento al pasar el cursor vive en styles/iconos.css.
const ENTRADA = {
  latido: { initial: { scale: 0.6 }, animate: { scale: [0.6, 1.18, 1] } },
  sacudir: { initial: { rotate: 0 }, animate: { rotate: [0, -14, 10, -4, 0] } },
  gota: { initial: { y: -8, opacity: 0.4 }, animate: { y: [-8, 2, 0], opacity: 1 } },
  empujar: { initial: { x: -6, opacity: 0.4 }, animate: { x: 0, opacity: 1 } },
  atras: { initial: { x: 6, opacity: 0.4 }, animate: { x: 0, opacity: 1 } },
  girar90: { initial: { rotate: -90 }, animate: { rotate: 0 } },
  giro: { initial: { rotate: -180, opacity: 0.4 }, animate: { rotate: 0, opacity: 1 } },
  aparecer: { initial: { scale: 0.6, opacity: 0.4 }, animate: { scale: 1, opacity: 1 } },
};

export default function Icono({ de: Componente, mov = 'aparecer', entrada = true, tam = 20, className }) {
  const svg = <Componente size={tam} aria-hidden="true" focusable="false" />;
  if (!entrada) return <span data-mov={mov} className={className}>{svg}</span>;
  const v = ENTRADA[mov] ?? ENTRADA.aparecer;
  return (
    <motion.span
      data-mov={mov}
      className={className}
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {svg}
    </motion.span>
  );
}
