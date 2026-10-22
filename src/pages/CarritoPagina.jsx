import { Link } from 'wouter';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import ResumenPedido from '../components/tienda/ResumenPedido.jsx';
import { CarritoVacio } from '../components/tienda/Carrito.jsx';
import { formatoPrecio } from '../lib/formatoPrecio.js';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Checkout.module.css';

export default function CarritoPagina() {
  const { lineas, subtotal } = useCarrito();
  useTituloPagina('Carrito');
  return (
    <>
      <CabeceraPagina titulo="Tu carrito." />
      <div className={`contenedor ${s.carritoPagina}`}>
        {lineas.length === 0 ? <CarritoVacio /> : (
          <>
            <ResumenPedido lineas={lineas} totales={{ subtotal, total: subtotal }} editable titulo="Productos" />
            <div className={s.carritoAcciones}>
              <Link href="/checkout" className="btn btn-accion btn-bloque">Ir a pagar {formatoPrecio(subtotal)}</Link>
              <Link href="/tecnologia" className="enlace">Seguir comprando</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
