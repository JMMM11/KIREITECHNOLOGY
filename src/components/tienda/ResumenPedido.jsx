import { AnimatePresence } from 'motion/react';
import LineaCarrito from './LineaCarrito.jsx';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import s from './ResumenPedido.module.css';

export default function ResumenPedido({ lineas, totales, editable = false, titulo = 'Resumen' }) {
  return (
    <section className={s.resumen} aria-labelledby="resumen-titulo">
      <h2 id="resumen-titulo" className={s.titulo}>{titulo}</h2>
      <ul className={s.lista}>
        <AnimatePresence mode="popLayout" initial={false}>
          {lineas.map((l) => <LineaCarrito key={l.clave} linea={l} editable={editable} />)}
        </AnimatePresence>
      </ul>
      <dl className={s.totales} aria-live="polite">
        <div><dt>Subtotal</dt><dd>{formatoPrecio(totales.subtotal)}</dd></div>
        {totales.envio !== undefined && (
          <div><dt>Entrega</dt><dd>{totales.envioPorConfirmar ? 'Por confirmar' : totales.envio === 0 ? 'Gratis' : formatoPrecio(totales.envio)}</dd></div>
        )}
        {totales.cargoContraEntrega > 0 && <div><dt>Cargo contra entrega</dt><dd>{formatoPrecio(totales.cargoContraEntrega)}</dd></div>}
        <div className={s.total}><dt>Total</dt><dd>{formatoPrecio(totales.total)}</dd></div>
      </dl>
    </section>
  );
}
