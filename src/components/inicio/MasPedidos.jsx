import { Link } from 'wouter';
import TarjetaProducto from '../tienda/TarjetaProducto.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { INICIO } from '../../data/textos.js';
import { filtrarCatalogo } from '../../lib/catalogo.js';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './Inicio.module.css';

export default function MasPedidos() {
  const { productos } = useDatos();
  const lista = filtrarCatalogo(productos, { orden: 'relevancia' }).slice(0, 8);
  return (
    <section className={`seccion ${s.bandaBlanca}`} aria-labelledby="pedidos-titulo">
      <div className="contenedor">
        <div className={s.cabecera}>
          <h2 id="pedidos-titulo" className="titulo">{INICIO.pedidos.titulo}</h2>
          <Link href="/tecnologia" className="enlace">
            {INICIO.pedidos.enlace} <Icono de={ICONOS.siguiente.de} mov={ICONOS.siguiente.mov} entrada={false} tam={16} />
          </Link>
        </div>
        <ul className={s.productos}>
          {lista.map((p) => <li key={p.id} className={s.celda}><TarjetaProducto producto={p} /></li>)}
        </ul>
      </div>
    </section>
  );
}
