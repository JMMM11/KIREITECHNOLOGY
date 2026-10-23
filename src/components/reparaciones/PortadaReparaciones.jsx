import { motion } from 'motion/react';
import Foto from '../ui/Foto.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { SITIO } from '../../data/sitio.js';
import { FOTOS_REPARACION } from '../../data/servicios.js';
import s from './Reparaciones.module.css';

const SUAVE = [0.22, 1, 0.36, 1];

export default function PortadaReparaciones({ onAgendar }) {
  const consulta = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, tengo una consulta de reparación.')}`;
  return (
    <section className="contenedor" aria-labelledby="reparaciones-titulo">
      <div className={s.portada}>
        <div className={s.portadaTexto}>
          <motion.h1
            id="reparaciones-titulo"
            className={s.portadaTitulo}
            initial={{ y: 16, filter: 'blur(8px)' }}
            animate={{ y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: SUAVE }}
          >
            Reparamos tu computadora.
          </motion.h1>
          <p className={s.portadaBajada}>Laptops y PCs con Windows. Pantalla, batería, teclado, sistema y limpieza.</p>
          <div className={s.portadaAcciones}>
            <button type="button" className="btn btn-accion" onClick={onAgendar}>Agendar cita</button>
            <a className={`btn btn-fantasma ${s.fantasmaClaro}`} href={consulta} target="_blank" rel="noopener noreferrer">
              <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> Preguntar por WhatsApp
            </a>
          </div>
        </div>
        <motion.div className={s.portadaFoto} initial={{ scale: 0.94, rotate: -2 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.7, ease: SUAVE }}>
          <Foto foto={FOTOS_REPARACION.portada} alt="Técnico reparando una laptop con lupa y destornillador" prioridad sizes="(min-width: 900px) 34vw, 90vw" />
        </motion.div>
      </div>
    </section>
  );
}
