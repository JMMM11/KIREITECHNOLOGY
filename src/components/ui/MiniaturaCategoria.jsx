import Foto from './Foto.jsx';
import Icono from './Icono.jsx';
import { ICONOS_CATEGORIA } from '../iconos.js';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './MiniaturaCategoria.module.css';

// Círculo con la primera foto de un producto real de la categoría. Si la categoría aún no tiene fotos, muestra su ícono.
export default function MiniaturaCategoria({ categoriaId, tam = 64, className = '' }) {
  const { productos } = useDatos();
  const p = productos.find((x) => x.categoriaId === categoriaId && x.fotos?.length);
  const ic = ICONOS_CATEGORIA[categoriaId];
  return (
    <span className={`${s.miniatura} ${className}`} style={{ '--tam': `${tam}px` }} aria-hidden="true">
      {p
        ? <Foto foto={p.fotos[0]} sizes={`${tam * 2}px`} />
        : ic && <Icono de={ic.de} mov={ic.mov} entrada={false} tam={Math.round(tam * 0.38)} />}
    </span>
  );
}
