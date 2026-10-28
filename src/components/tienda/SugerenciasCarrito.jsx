import { useState } from 'react';
import Carrusel from '../ui/Carrusel.jsx';
import TarjetaProducto from './TarjetaProducto.jsx';
import { filtrarCatalogo } from '../../lib/catalogo.js';
import { leerVistos } from '../../lib/vistos.js';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './Carrito.module.css';

// Carrito vacío: lo que el cliente ya miró y lo destacado, para volver a comprar sin buscar.
export default function SugerenciasCarrito() {
  const { productos, productoPorId } = useDatos();
  const [vistos] = useState(leerVistos);
  const recientes = vistos.map(productoPorId).filter(Boolean);
  const destacados = filtrarCatalogo(productos, { orden: 'relevancia' }).filter((p) => !vistos.includes(p.id)).slice(0, 10);
  return (
    <div className={s.sugerencias}>
      {recientes.length > 0 && (
        <Carrusel id="vistos" titulo="Lo que viste hace poco">
          {recientes.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
        </Carrusel>
      )}
      {destacados.length > 0 && (
        <Carrusel id="sugeridos" titulo="Te puede interesar">
          {destacados.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
        </Carrusel>
      )}
    </div>
  );
}
