import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

// Inclinación 3D que sigue al mouse. Los hijos con <Capa z> flotan a distinta profundidad.
// Solo con mouse y sin "reducir movimiento"; en táctil queda quieto.
export default function Profundidad({ children, className, intensidad = 10 }) {
  const ref = useRef(null);
  const reducir = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const resorte = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [intensidad, -intensidad]), resorte);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-intensidad, intensidad]), resorte);

  const mover = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const salir = () => { px.set(0); py.set(0); };

  return (
    <div ref={ref} className={className} style={{ perspective: 1100 }} onPointerMove={reducir ? undefined : mover} onPointerLeave={salir}>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}>
        {children}
      </motion.div>
    </div>
  );
}

export function Capa({ z = 0, className, style, children }) {
  return <div className={className} style={{ ...style, transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}>{children}</div>;
}
