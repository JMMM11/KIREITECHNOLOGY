import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Foto from '../ui/Foto.jsx';
import { PRODUCTOS } from '../../data/productos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { precioDe } from '../../lib/catalogo.js';
import { rutaWeb } from '../../lib/fotos.js';
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

// Decorativo: lo que dice la portada está en el texto. Los teléfonos se dibujan en 3D en vivo (escenaTelefonos.js);
// mientras cargan, o sin WebGL, se ven estos mismos teléfonos hechos en CSS, que flotan a destiempo.
export default function TelefonosHero() {
  const reducir = useReducedMotion();
  const caja = useRef(null), lienzo = useRef(null);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    let api = null, vivo = true, visible = true;
    const seguir = () => (visible && !document.hidden ? api?.arrancar() : api?.parar());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; seguir(); });
    const mover = (e) => { const r = caja.current.getBoundingClientRect(); api?.puntero(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1); };
    const opciones = { quieto: !!reducir, foto: `${import.meta.env.BASE_URL}${encodeURI(rutaWeb(gm2.fotos[0].src, 640))}`, precio: formatoPrecio(desde) };
    import('./escenaTelefonos.js')
      .then((m) => m.crearTelefonos(lienzo.current, opciones))
      .then((a) => {
        if (!vivo) return a.destruir();
        api = a; setListo(true);
        io.observe(caja.current); document.addEventListener('visibilitychange', seguir);
        if (!reducir) addEventListener('pointermove', mover);
        seguir();
      })
      .catch(() => {});   // sin WebGL quedan los teléfonos de CSS
    return () => { vivo = false; io.disconnect(); document.removeEventListener('visibilitychange', seguir); removeEventListener('pointermove', mover); api?.destruir(); };
  }, [reducir]);
  const flota = (alto, duracion, retraso) => (reducir ? {} : {
    animate: { y: [0, -alto, 0] },
    transition: { duration: duracion, ease: 'easeInOut', repeat: Infinity, delay: retraso },
  });
  return (
    <div ref={caja} className={s.escena} data-listo={listo || undefined} aria-hidden="true">
      <span className={s.resplandor} />
      <div ref={lienzo} className={s.tres} />
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
