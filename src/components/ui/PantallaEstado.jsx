import { motion } from 'motion/react';
import IconoKirei from './IconoKirei.jsx';
import s from './PantallaEstado.module.css';

const SUAVE = [0.22, 1, 0.36, 1];

// "4 [ícono] 4": el ícono sin señal ocupa el lugar del cero.
export function Pantalla404Arte() {
  return (
    <p className={s.numero} aria-hidden="true">
      <span>4</span>
      <IconoKirei estado="sinSenal" alto={180} className={s.numeroIcono} />
      <span>4</span>
    </p>
  );
}

// Pantalla de marca para 404, errores y productos que ya no están. Sin arte, muestra el ícono sin señal.
export default function PantallaEstado({ etiqueta, titulo, texto, arte, children }) {
  return (
    <section className={`contenedor ${s.pantalla}`}>
      <motion.div className={s.arte} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: SUAVE }}>
        {arte ?? <IconoKirei estado="sinSenal" alto={200} />}
      </motion.div>
      <div className={s.texto}>
        <p className={s.etiqueta}>{etiqueta}</p>
        <h1 className={s.titulo}>{titulo}</h1>
        <p className={s.bajada}>{texto}</p>
        {children && <div className={s.acciones}>{children}</div>}
      </div>
    </section>
  );
}
