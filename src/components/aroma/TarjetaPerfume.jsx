import { Link } from 'wouter';
import Foto from '../ui/Foto.jsx';
import Frasco from './Frasco.jsx';
import { FAMILIAS } from '../../data/aroma.js';
import { SITIO } from '../../data/sitio.js';
import s from './Aroma.module.css';

const iniciales = (nombre) => nombre.split(/\s+/).filter((x) => x.length > 2 || /\d/.test(x)).slice(0, 2).map((x) => x[0]).join('').toUpperCase();

// Ficha de un perfume: foto sobre arena, etiqueta de familia, nombre, descripción y botón naranja.
// Los perfumes se muestran sin precio: el pedido se hace por el WhatsApp de perfumes (SITIO.whatsappAroma).
export default function TarjetaPerfume({ perfume: p, i = 0 }) {
  const familia = FAMILIAS.find((f) => f.id === p.familia);
  const pagina = `/producto/${p.slug ?? p.id}`;
  const pedir = `https://wa.me/${SITIO.whatsappAroma}?text=${encodeURIComponent(`Hola Kirei, quiero pedir el perfume ${p.nombre}${p.marca ? ` de ${p.marca}` : ''}.`)}`;
  return (
    <article id={`p-${p.id}`} className={s.perfume}>
      <div className={s.perfumeMedia}>
        {p.fotos?.[0] ? <Foto foto={p.fotos[0]} alt="" sizes="(min-width: 1200px) 22vw, (min-width: 900px) 30vw, 45vw" /> : <Frasco forma={i} iniciales={iniciales(p.nombre)} className={s.frasco} />}
      </div>
      <div className={s.perfumeCuerpo}>
        {familia && <span className={s.etiqueta}>{familia.nombre}</span>}
        {p.marca && <p className={s.marca}>{p.marca}</p>}
        <h3 className={s.perfumeNombre}><Link href={pagina} className={s.nombreEnlace}>{p.nombre}</Link></h3>
        <p className={s.perfumeTexto}>{p.descripcion}</p>
        {p.ml && <p className={s.ml}>{p.ml} ml</p>}
        <div className={s.perfumePie}>
          <a className={`btn btn-accion ${s.accion}`} href={pedir} target="_blank" rel="noopener noreferrer">Pedir por WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
