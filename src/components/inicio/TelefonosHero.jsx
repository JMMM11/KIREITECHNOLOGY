import { motion, useReducedMotion } from 'motion/react';
import Foto from '../ui/Foto.jsx';
import { PRODUCTOS } from '../../data/productos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { precioDe } from '../../lib/catalogo.js';
import s from './TelefonosHero.module.css';

const SECCIONES_MENU = ['Tecnología', 'Reparaciones', 'Aroma', 'Anime'];
const gm2 = PRODUCTOS.find((p) => p.id === 'lenovo-gm2-pro');
const desde = Math.min(...gm2.variantes.map((v) => precioDe(gm2, v)));

// Un móvil con marco de titanio, isla, botones laterales y brillo. Todo el tamaño interior va en cqw: escala con el ancho del marco.
function Movil({ className, children }) {
  return (
    <div className={s.caja}>
      <div className={`${s.marco} ${className}`}>
        <div className={s.pantalla}>
          <span className={s.isla} />
          {children}
          <span className={s.brillo} />
          <span className={s.barra} />
        </div>
      </div>
    </div>
  );
}

// Decorativo: lo que dice la portada está en el texto. Los móviles flotan a destiempo para que no se vean pegados.
export default function TelefonosHero() {
  const reducir = useReducedMotion();
  const flota = (alto, duracion, retraso) => (reducir ? {} : {
    animate: { y: [0, -alto, 0] },
    transition: { duration: duracion, ease: 'easeInOut', repeat: Infinity, delay: retraso },
  });
  return (
    <div className={s.escena} aria-hidden="true">
      <span className={s.resplandor} />
      <motion.div className={`${s.lado} ${s.izquierdo}`} {...flota(10, 5.2, 1.4)}>
        <Movil className={s.menuMovil}>
          <div className={s.menu}>
            <span className={s.menuEtiqueta}>Kirei</span>
            <ul className={s.menuLista}>
              {SECCIONES_MENU.map((n, i) => (
                <li key={n} data-activo={i === 0 ? '' : undefined}><span>{n}</span><b>›</b></li>
              ))}
            </ul>
            <span className={s.menuPie}>Retiro gratis · Envío a domicilio</span>
          </div>
        </Movil>
      </motion.div>

      <motion.div className={`${s.lado} ${s.derecho}`} {...flota(14, 4.4, 1.9)}>
        <Movil className={s.inicioMovil}>
          <div className={s.inicio}>
            <div className={s.inicioBarra}>
              <img src={`${import.meta.env.BASE_URL}marca/kirei-icono-naranja.svg`} alt="" width="14" height="26" />
              <span className={s.bolsa} />
            </div>
            <p className={s.inicioTitulo}>Tecnología.<br /><span>Sin complicarte.</span></p>
            <div className={s.tarjeta}>
              <div className={s.tarjetaFoto}><Foto foto={gm2.fotos[0]} alt="" sizes="160px" /></div>
              <p className={s.tarjetaNombre}>{gm2.nombre}</p>
              <p className={s.tarjetaPrecio}>Desde {formatoPrecio(desde)}</p>
            </div>
            <span className={s.boton}>Agregar al carrito</span>
          </div>
        </Movil>
      </motion.div>
    </div>
  );
}
