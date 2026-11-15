import { Link } from 'wouter';
import Foto from '../ui/Foto.jsx';
import Frasco from './Frasco.jsx';
import { FAMILIAS } from '../../data/aroma.js';
import { SITIO } from '../../data/sitio.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import s from './Aroma.module.css';

const iniciales = (nombre) => nombre.split(/\s+/).filter((x) => x.length > 2 || /\d/.test(x)).slice(0, 2).map((x) => x[0]).join('').toUpperCase();

// Ficha de un perfume. Los reales (del panel) llevan a su página; los de muestra solo permiten consultar.
export default function TarjetaPerfume({ perfume: p, i = 0 }) {
  const familia = FAMILIAS.find((f) => f.id === p.familia);
  const consulta = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(`Hola Kirei, quiero consultar por perfumes de la familia ${familia?.nombre.toLowerCase() ?? 'que tengan'}.`)}`;
  return (
    <article id={`p-${p.id}`} className={s.perfume}>
      <div className={s.perfumeMedia} style={familia && { '--tono': familia.tono }}>
        {p.fotos?.[0] ? <Foto foto={p.fotos[0]} alt="" sizes="(min-width: 900px) 30vw, 45vw" /> : <Frasco familia={p.familia} forma={i} iniciales={iniciales(p.nombre)} className={s.frasco} />}
        {p.ejemplo && <span className={s.muestra}>Muestra</span>}
      </div>
      <div className={s.perfumeCuerpo}>
        <p className={s.perfumeMeta}>{[p.marca, familia?.nombre, p.ml && `${p.ml} ml`].filter(Boolean).join(' · ')}</p>
        <h3 className={s.perfumeNombre}>{p.nombre}</h3>
        <p className={s.perfumeTexto}>{p.descripcion}</p>
        <div className={s.perfumePie}>
          <p className={s.precio}>{formatoPrecio(p.precioCentavos)}{p.ejemplo && <small> precio de ejemplo</small>}</p>
          {p.ejemplo
            ? <a className={s.accion} href={consulta} target="_blank" rel="noopener noreferrer">Consultar <span aria-hidden="true">›</span></a>
            : <Link className={s.accion} href={`/producto/${p.slug ?? p.id}`}>Ver detalles <span aria-hidden="true">›</span></Link>}
        </div>
      </div>
    </article>
  );
}
