import { motion } from 'motion/react';

const contenedor = { oculto: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { oculto: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } } };

// Revela los hijos en cascada al entrar en pantalla.
export function Escalonado({ como = 'div', className, children }) {
  const C = motion[como];
  return (
    <C className={className} variants={contenedor} initial="oculto" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
      {children}
    </C>
  );
}

export function ItemEscalonado({ como = 'div', className, children, ...resto }) {
  const C = motion[como];
  return <C className={className} variants={item} {...resto}>{children}</C>;
}
