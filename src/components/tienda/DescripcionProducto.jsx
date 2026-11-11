import { partirDescripcion } from '../../lib/catalogo.js';
import s from './DescripcionProducto.module.css';

// Especificaciones en tabla (dato a la izquierda, valor a la derecha): se leen de un vistazo.
// El primer párrafo ya se muestra junto al precio, así que aquí no se repite.
export default function DescripcionProducto({ producto: p }) {
  const todos = partirDescripcion(p.descripcion);
  const bloques = todos[0]?.tipo === 'parrafo' ? todos.slice(1) : todos;
  if (!bloques.length) return null;
  let marcaPuesta = !p.marca;
  return (
    <section className={s.seccion} aria-labelledby="descripcion-titulo">
      <h2 id="descripcion-titulo" className="titulo">Detalles y especificaciones</h2>
      <div className={s.cuerpo}>
        {bloques.map((b, i) => {
          if (b.tipo === 'parrafo') return <p key={i}>{b.texto}</p>;
          const filas = b.items.map((it) => it.split(/: (.*)/s)).filter((x) => x.length > 1);
          if (filas.length !== b.items.length) return <ul key={i} className={s.lista}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>;
          if (!marcaPuesta) { filas.unshift(['Marca', p.marca]); marcaPuesta = true; }
          return (
            <table key={i} className={s.tabla}>
              <tbody>
                {filas.map(([dato, valor]) => <tr key={dato}><th scope="row">{dato}</th><td>{valor}</td></tr>)}
              </tbody>
            </table>
          );
        })}
      </div>
    </section>
  );
}
