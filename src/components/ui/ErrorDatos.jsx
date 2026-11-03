import PantallaEstado from './PantallaEstado.jsx';
import Icono from './Icono.jsx';
import { ICONOS } from '../iconos.js';
import { SITIO } from '../../data/sitio.js';
import { useDatos } from '../../context/DatosContext.jsx';

// Pantalla para páginas que no pueden mostrar nada sin los productos: dice qué pasó y deja reintentar.
export default function ErrorDatos() {
  const { error, cargando, reintentar } = useDatos();
  return (
    <PantallaEstado etiqueta="Sin conexión" titulo="No pudimos cargar la tienda." texto={error}>
      <button type="button" className="btn btn-marca" onClick={reintentar} disabled={cargando}>{cargando ? 'Reintentando...' : 'Reintentar'}</button>
      <a className="btn btn-fantasma" href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noopener noreferrer">
        <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> Escríbenos
      </a>
    </PantallaEstado>
  );
}
