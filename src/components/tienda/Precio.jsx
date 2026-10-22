import { formatoPrecio, porcentajeDescuento } from '../../lib/formatoPrecio.js';
import s from './Precio.module.css';

export default function Precio({ producto, grande = false }) {
  const { precioCentavos: precio, precioAntesCentavos: antes } = producto;
  const descuento = porcentajeDescuento(precio, antes);
  return (
    <p className={`${s.precio} ${grande ? s.grande : ''}`}>
      <span className={precio == null ? s.pendiente : ''}>{precio == null ? 'Precio [pendiente]' : formatoPrecio(precio)}</span>
      {descuento > 0 && (
        <>
          <del className={s.antes}><span className="sr-only">Antes </span>{formatoPrecio(antes)}</del>
          <span className={s.descuento}>-{descuento}%</span>
        </>
      )}
    </p>
  );
}
