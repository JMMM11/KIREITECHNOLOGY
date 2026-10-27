import { Link } from 'wouter';
import { motion } from 'motion/react';
import Foto from '../ui/Foto.jsx';
import Badge from '../ui/Badge.jsx';
import Icono from '../ui/Icono.jsx';
import Precio from './Precio.jsx';
import BotonFavorito from './BotonFavorito.jsx';
import { ICONOS } from '../iconos.js';
import { useCarrito, variantesDe } from '../../context/CarritoContext.jsx';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './TarjetaProducto.module.css';

// El enlace cubre la tarjeta; el botón rápido queda encima, así no hay controles anidados.
export default function TarjetaProducto({ producto: p, prioridad = false }) {
  const { agregar, abrir } = useCarrito();
  const { categoriaPorId } = useDatos();
  const vs = variantesDe(p);
  const agregable = p.precioCentavos != null && p.estadoVenta !== 'agotado' && vs.length === 1;

  return (
    <motion.article layout className={s.tarjeta} data-tarjeta initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <div className={`${s.media} ${s[p.tono] ?? ''}`}>
        <Foto foto={p.fotos[0]} alt="" prioridad={prioridad} sizes="(min-width: 1100px) 22vw, (min-width: 700px) 30vw, 45vw" />
        <div className={s.insignias}>
          {p.estadoVenta && <Badge estado={p.estadoVenta} />}
          {p.ejemplo && <Badge estado="ejemplo" />}
        </div>
        <BotonFavorito producto={p} />
      </div>
      <div className={s.cuerpo}>
        <p className={s.categoria}>{categoriaPorId(p.categoriaId)?.nombre}</p>
        <h3 className={s.nombre}>
          <Link href={`/producto/${p.slug}`} className={s.enlace}>{p.nombre}</Link>
        </h3>
        <div className={s.pie}>
          <Precio producto={p} />
          {agregable && (
            <button
              type="button"
              className={s.rapido}
              onClick={() => { agregar(p.id, vs[0].id, 1); abrir(); }}
              aria-label={`Agregar ${p.nombre} al carrito`}
            >
              <Icono de={ICONOS.mas.de} mov={ICONOS.mas.mov} entrada={false} tam={18} />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
