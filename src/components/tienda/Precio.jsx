import { formatoPrecio, porcentajeDescuento } from '../../lib/formatoPrecio.js';
import s from './Precio.module.css';

// desde: el producto tiene opciones con precios distintos y aquí se muestra el menor.
export default function Precio({ producto, grande = false, desde = false }) {
  const { precioCentavos: precio, precioAntesCentavos: antes } = producto;
  const descuento = porcentajeDescuento(precio, antes);
  return (
    <p className={`${s.precio} ${grande ? s.grande : ''}`}>
      <span className={precio == null ? s.pendiente : ''}>{precio == null ? 'Precio [pendiente]' : `${desde ? 'Desde ' : ''}${formatoPrecio(precio)}`}</span>
      {descuento > 0 && (
        <>
          <del className={s.antes}><span className="sr-only">Antes </span>{formatoPrecio(antes)}</del>
          <span className={s.descuento}>-{descuento}%</span>
        </>
      )}
    </p>
  );
}
