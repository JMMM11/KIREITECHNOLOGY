import { Link } from 'wouter';
import DetalleProducto from '../components/tienda/DetalleProducto.jsx';
import TarjetaProducto from '../components/tienda/TarjetaProducto.jsx';
import Cargando from '../components/ui/Cargando.jsx';
import PantallaEstado from '../components/ui/PantallaEstado.jsx';
import { useDatos } from '../context/DatosContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Producto.module.css';

export default function Producto({ params }) {
  const { productos, cargando } = useDatos();
  const p = productos.find((x) => x.slug === params.slug);
  useTituloPagina(p?.nombre ?? 'Producto');

  if (cargando) return <Cargando />;
  if (!p) {
    return (
      <PantallaEstado etiqueta="Producto no disponible" titulo="Este producto ya no está." texto="Puede que ya no esté a la venta. Mira lo que tenemos ahora.">
        <Link href="/tecnologia" className="btn btn-marca">Ver tecnología</Link>
        <Link href="/" className="btn btn-fantasma">Ir al inicio</Link>
      </PantallaEstado>
    );
  }
  const relacionados = productos.filter((x) => x.categoriaId === p.categoriaId && x.id !== p.id).slice(0, 4);

  return (
    <div className="contenedor">
      <DetalleProducto key={p.id} producto={p} />
      {relacionados.length > 0 && (
        <section className={s.relacionados} aria-labelledby="relacionados-titulo">
          <h2 id="relacionados-titulo" className="titulo">También te puede gustar</h2>
          <ul className={s.rejilla}>
            {relacionados.map((r) => <li key={r.id} className={s.celda}><TarjetaProducto producto={r} /></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
