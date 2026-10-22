import { Link } from 'wouter';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import TarjetaProducto from '../components/tienda/TarjetaProducto.jsx';
import Icono from '../components/ui/Icono.jsx';
import { ICONOS } from '../components/iconos.js';
import { SITIO } from '../data/sitio.js';
import { useDatos } from '../context/DatosContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Paginas.module.css';

// Muestra "Próximamente" mientras no haya productos anime publicados.
export default function Anime() {
  useTituloPagina('Anime');
  const { productos } = useDatos();
  const lista = productos.filter((p) => p.categoriaId === 'anime');

  if (lista.length === 0) {
    return (
      <div className={`contenedor ${s.proximamente}`}>
        <h1 className="display">Zona Anime: próximamente.</h1>
        <p className="sub">Llaveros, peluches, pines y más de tus series favoritas. Estamos preparando la sección.</p>
        <div className={s.acciones}>
          <a className="btn btn-marca" href={`https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, avísenme cuando abran la Zona Anime.')}`} target="_blank" rel="noopener noreferrer">
            <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> Avísame por WhatsApp
          </a>
          <Link href="/tecnologia" className="btn btn-fantasma">Ver tecnología</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <CabeceraPagina titulo="Zona Anime." texto="Llaveros, peluches, pines y más de tus series favoritas." />
      <div className="contenedor">
        <ul className={s.rejilla}>
          {lista.map((p) => <li key={p.id} className={s.celda}><TarjetaProducto producto={p} /></li>)}
        </ul>
      </div>
    </>
  );
}
