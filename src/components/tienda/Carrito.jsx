import { Link } from 'wouter';
import { AnimatePresence } from 'motion/react';
import Modal from '../ui/Modal.jsx';
import Icono from '../ui/Icono.jsx';
import LineaCarrito from './LineaCarrito.jsx';
import { ICONOS } from '../iconos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { useCarrito } from '../../context/CarritoContext.jsx';
import s from './Carrito.module.css';

export function CarritoVacio({ onExplorar }) {
  return (
    <div className={s.vacio}>
      <span className={s.vacioIcono}><Icono de={ICONOS.bolsa.de} mov="latido" tam={28} /></span>
      <p className={s.vacioTitulo}>Tu carrito está vacío.</p>
      <p className="suave">Mira los audífonos y relojes que tenemos.</p>
      <Link href="/tecnologia" className="btn btn-marca" onClick={onExplorar}>Ver tecnología</Link>
    </div>
  );
}

export default function Carrito() {
  const { lineas, subtotal, abierto, cerrar } = useCarrito();
  const pie = lineas.length > 0 && (
    <>
      <div className={s.fila}><span>Subtotal</span><strong>{formatoPrecio(subtotal)}</strong></div>
      <p className={s.nota}>La entrega y los cargos se calculan en el checkout.</p>
      <Link href="/checkout" className="btn btn-accion btn-bloque" onClick={cerrar}>Ir a pagar {formatoPrecio(subtotal)}</Link>
      <Link href="/carrito" className={`enlace ${s.verCarrito}`} onClick={cerrar}>Ver carrito completo</Link>
    </>
  );
  return (
    <Modal abierto={abierto} onCerrar={cerrar} titulo="Tu carrito" pie={pie}>
      {lineas.length === 0 ? (
        <CarritoVacio onExplorar={cerrar} />
      ) : (
        <ul className={s.lista}>
          <AnimatePresence mode="popLayout" initial={false}>
            {lineas.map((l) => <LineaCarrito key={l.clave} linea={l} />)}
          </AnimatePresence>
        </ul>
      )}
    </Modal>
  );
}
