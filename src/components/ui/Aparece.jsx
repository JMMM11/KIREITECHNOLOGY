import { motion, useReducedMotion } from 'motion/react';

// Ease-out suave: arranca rápido y se posa sin rebote.
const SUAVE = [0.22, 1, 0.36, 1];

// Entrada de marca: cada bloque sube desde un desenfoque de 8 px, uno tras otro (i * 0.15 s).
// Al terminar quita el filtro: un blur(0) dejado puesto crearía una capa nueva para todo lo que lleva dentro.
// alVer: espera a que el bloque entre en pantalla (para lo que queda más abajo). Con movimiento reducido solo aparece.
export default function Aparece({ i = 0, como = 'div', alVer = false, className, children, ...props }) {
  const reducir = useReducedMotion();
  const M = motion[como];
  const destino = reducir ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } };
  return (
    <M
      className={className}
      initial={reducir ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(8px)' }}
      {...(alVer ? { whileInView: destino, viewport: { once: true, margin: '0px 0px -12% 0px' } } : { animate: destino })}
      transition={{ duration: reducir ? 0.3 : 0.9, delay: i * 0.15, ease: SUAVE }}
      {...props}
    >
      {children}
    </M>
  );
}
