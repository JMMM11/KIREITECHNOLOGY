import { Link } from 'wouter';
import TarjetaProducto from '../tienda/TarjetaProducto.jsx';
import Carrusel from '../ui/Carrusel.jsx';
import { EsqueletoTarjeta } from '../ui/Esqueleto.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { INICIO } from '../../data/textos.js';
import { filtrarCatalogo } from '../../lib/catalogo.js';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './Inicio.module.css';

// Carrusel con lo que hay en la base de datos: cada producto nuevo del panel aparece aquí solo.
export default function MasPedidos() {
  const { productos, cargando } = useDatos();
  const lista = filtrarCatalogo(productos, { orden: 'relevancia' }).slice(0, 12);
  return (
    <div className={`seccion ${s.bandaBlanca}`}>
      <div className="contenedor">
        <Carrusel
          id="pedidos"
          titulo={INICIO.pedidos.titulo}
          accion={(
            <Link href="/tecnologia" className="enlace">
              {INICIO.pedidos.enlace} <Icono de={ICONOS.siguiente.de} mov={ICONOS.siguiente.mov} entrada={false} tam={16} />
            </Link>
          )}
        >
          {cargando
            ? Array.from({ length: 5 }, (_, i) => <EsqueletoTarjeta key={i} />)
            : lista.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
        </Carrusel>
      </div>
    </div>
  );
}
