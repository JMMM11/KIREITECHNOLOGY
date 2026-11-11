import { useEffect } from 'react';
import { Link } from 'wouter';
import DetalleProducto from '../components/tienda/DetalleProducto.jsx';
import DescripcionProducto from '../components/tienda/DescripcionProducto.jsx';
import { resumenDescripcion } from '../lib/catalogo.js';
import Comentarios from '../components/tienda/Comentarios.jsx';
import TarjetaProducto from '../components/tienda/TarjetaProducto.jsx';
import { EsqueletoProducto } from '../components/ui/Esqueleto.jsx';
import PantallaEstado from '../components/ui/PantallaEstado.jsx';
import ErrorDatos from '../components/ui/ErrorDatos.jsx';
import { useDatos } from '../context/DatosContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { registrarVisto } from '../lib/vistos.js';
import { datosProducto } from '../lib/seo.js';
import s from './Producto.module.css';

export default function Producto({ params }) {
  const { productos, cargando, error } = useDatos();
  const p = productos.find((x) => x.slug === params.slug);
  useTituloPagina(p?.nombre ?? 'Producto', p ? `${p.nombre} en Panamá. ${resumenDescripcion(p.descripcion)}`.slice(0, 160) : undefined);
  useEffect(() => { if (p) registrarVisto(p.id); }, [p]);
  // Datos del producto para Google; se quitan al salir de la página.
  useEffect(() => {
    if (!p) return undefined;
    const script = Object.assign(document.createElement('script'), { type: 'application/ld+json', textContent: JSON.stringify(datosProducto(p)) });
    document.head.appendChild(script);
    return () => script.remove();
  }, [p]);

  if (cargando) return <EsqueletoProducto />;
  if (!p && error) return <ErrorDatos />;
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
      <DescripcionProducto producto={p} />
      <Comentarios productoId={p.id} />
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
