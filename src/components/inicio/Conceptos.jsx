import { Link } from 'wouter';
import Aparece from '../ui/Aparece.jsx';
import { SITIO } from '../../data/sitio.js';
import s from './Conceptos.module.css';

const consulta = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, quiero consultar por una mejora de memoria o almacenamiento.')}`;
const FILAS = [
  { titulo: 'Reparación', texto: 'Diagnóstico, pantalla, batería, teclado, sistema y limpieza.', enlace: 'Agenda tu diagnóstico', href: '/reparaciones' },
  { titulo: 'Mejoras', texto: 'Más memoria, más almacenamiento y Windows al día para que rinda como nueva.', enlace: 'Consultar por WhatsApp', href: consulta, externo: true },
  { titulo: 'Tienda', texto: 'Audífonos, relojes y accesorios con garantía, con retiro gratis o envío a domicilio.', enlace: 'Ver tecnología', href: '/tecnologia' },
];

// Portada: los tres conceptos en filas tipográficas grandes. La laptop en 3D vive solo en /reparaciones.
export default function Conceptos() {
  return (
    <section className={`seccion ${s.seccion}`} aria-labelledby="conceptos-titulo">
      <div className="contenedor">
        <Aparece alVer como="h2" id="conceptos-titulo" className={s.sobre}>Cómo te ayudamos</Aparece>
        <ol className={s.filas}>
          {FILAS.map((f, i) => {
            const Enlace = f.externo ? 'a' : Link;
            const extra = f.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <Aparece alVer como="li" i={i} key={f.titulo} className={s.fila}>
                <span className={s.numero} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.titulo}>{f.titulo}</h3>
                <p className={s.texto}>{f.texto}</p>
                <Enlace href={f.href} className={s.enlace} {...extra}>{f.enlace} <span aria-hidden="true">›</span></Enlace>
              </Aparece>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
