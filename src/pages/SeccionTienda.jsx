import { Link } from 'wouter';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import Aparece from '../components/ui/Aparece.jsx';
import TarjetaProducto from '../components/tienda/TarjetaProducto.jsx';
import Icono from '../components/ui/Icono.jsx';
import ErrorDatos from '../components/ui/ErrorDatos.jsx';
import { EsqueletoTarjetas } from '../components/ui/Esqueleto.jsx';
import { ICONOS } from '../components/iconos.js';
import { SITIO } from '../data/sitio.js';
import { useDatos } from '../context/DatosContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Paginas.module.css';

// Sección de la tienda con una sola categoría (Anime). Muestra "Próximamente" mientras no haya productos publicados.
// datos: { categoriaId, titulo, descripcion, vacio: { titulo, texto, mensaje }, cabecera: { titulo, texto } }
export default function SeccionTienda({ datos }) {
  useTituloPagina(datos.titulo, datos.descripcion);
  const { productos, cargando, error } = useDatos();
  const lista = productos.filter((p) => p.categoriaId === datos.categoriaId);

  if (cargando) return <div className="contenedor"><EsqueletoTarjetas cantidad={4} /></div>;
  if (error && productos.length === 0) return <ErrorDatos />;
  if (lista.length === 0) {
    return (
      <div className={`contenedor ${s.proximamente}`}>
        <Aparece como="h1" className="display">{datos.vacio.titulo}</Aparece>
        <Aparece como="p" i={1} className="sub">{datos.vacio.texto}</Aparece>
        <Aparece i={2} className={s.acciones}>
          <a className="btn btn-marca" href={`https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(datos.vacio.mensaje)}`} target="_blank" rel="noopener noreferrer">
            <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> Avísame por WhatsApp
          </a>
          <Link href="/tecnologia" className="btn btn-fantasma">Ver tecnología</Link>
        </Aparece>
      </div>
    );
  }

  return (
    <>
      <CabeceraPagina titulo={datos.cabecera.titulo} texto={datos.cabecera.texto} />
      <div className="contenedor">
        <h2 className={s.conteo}>{lista.length} {lista.length === 1 ? 'producto' : 'productos'}</h2>
        <ul className={s.rejilla}>
          {lista.map((p) => <li key={p.id} className={s.celda}><TarjetaProducto producto={p} /></li>)}
        </ul>
      </div>
    </>
  );
}
