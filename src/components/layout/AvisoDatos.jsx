import { useDatos } from '../../context/DatosContext.jsx';
import s from './Layout.module.css';

// Si los productos no cargan, el carrito y la portada se verían vacíos sin explicación: este aviso lo dice.
export default function AvisoDatos() {
  const { error, cargando, reintentar } = useDatos();
  if (!error) return null;
  return (
    <div className={s.aviso} role="alert">
      <div className={`contenedor ${s.avisoInterior}`}>
        <p>{error} Tu carrito sigue guardado.</p>
        <button type="button" className="btn btn-fantasma" onClick={reintentar} disabled={cargando}>Reintentar</button>
      </div>
    </div>
  );
}
