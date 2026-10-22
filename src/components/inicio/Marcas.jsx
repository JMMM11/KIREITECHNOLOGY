import { Link } from 'wouter';
import { MARCAS } from '../../data/catalogos.js';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './Inicio.module.css';

// Marcas que vendemos. Cada una lleva a la búsqueda con sus productos.
export default function Marcas() {
  const { productos } = useDatos();
  const lista = MARCAS
    .map((m) => ({ ...m, cuantos: productos.filter((p) => p.marca === m.nombre).length }))
    .filter((m) => m.cuantos > 0);
  if (!lista.length) return null;

  return (
    <section className="seccion" aria-labelledby="marcas-titulo">
      <div className="contenedor">
        <h2 id="marcas-titulo" className={`titulo ${s.tituloSeccion}`}>Marcas que vendemos</h2>
        <ul className={s.marcas}>
          {lista.map((m) => (
            <li key={m.nombre}>
              <Link href={`/buscar/${encodeURIComponent(m.nombre)}`} className={s.marca}>
                <img src={`./marcas/${m.logo}.svg`} alt="" width="44" height="44" className={s.marcaLogo} loading="lazy" />
                <span className={s.marcaNombre}>{m.nombre}</span>
                <span className={s.marcaConteo}>{m.cuantos} {m.cuantos === 1 ? 'producto' : 'productos'}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
