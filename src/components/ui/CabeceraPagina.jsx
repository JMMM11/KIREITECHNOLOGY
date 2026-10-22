import { motion } from 'motion/react';
import s from './CabeceraPagina.module.css';

export default function CabeceraPagina({ titulo, texto, children }) {
  return (
    <header className={`contenedor ${s.cabecera}`}>
      <motion.h1
        className="display"
        initial={{ y: 14, filter: 'blur(6px)' }}
        animate={{ y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {titulo}
      </motion.h1>
      {texto && <p className="sub">{texto}</p>}
      {children}
    </header>
  );
}
