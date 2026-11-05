import Carrusel from '../ui/Carrusel.jsx';
import { INICIO } from '../../data/textos.js';
import s from './Inicio.module.css';

// Logos de las marcas que vende la tienda, en el mismo carrusel que "Lo más pedido": se mueve solo si el cliente quiere.
export default function Marcas() {
  const { titulo, lista } = INICIO.marcas;
  return (
    <div className="seccion">
      <div className="contenedor">
        <Carrusel id="marcas" titulo={titulo}>
          {lista.map((m) => (
            <div key={m.nombre} className={s.marca}>
              <img src={`${import.meta.env.BASE_URL}${m.logo}`} alt={m.nombre} width={m.ancho} height={m.alto} loading="lazy" decoding="async" />
            </div>
          ))}
        </Carrusel>
      </div>
    </div>
  );
}
