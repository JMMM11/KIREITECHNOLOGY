import { Link, useLocation } from 'wouter';
import { motion } from 'motion/react';
import s from './Header.module.css';

export const esActivo = (ubicacion, href) => (href === '/' ? ubicacion === '/' : ubicacion === href || ubicacion.startsWith(`${href}/`));

export function Indicador() {
  return <motion.span layoutId="indicador-nav" className={s.indicador} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />;
}

export default function EnlaceNav({ href, children }) {
  const [ubicacion] = useLocation();
  const activo = esActivo(ubicacion, href);
  return (
    <Link href={href} className={s.enlace} aria-current={activo ? 'page' : undefined}>
      {children}
      {activo && <Indicador />}
    </Link>
  );
}
