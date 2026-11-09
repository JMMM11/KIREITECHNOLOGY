import { partirDescripcion } from '../../lib/catalogo.js';
import s from './DescripcionProducto.module.css';

// El resto de la descripción va debajo del producto para que el botón de compra siga a la vista.
// El primer párrafo ya se muestra junto al precio, así que aquí no se repite.
export default function DescripcionProducto({ texto }) {
  const todos = partirDescripcion(texto);
  const bloques = todos[0]?.tipo === 'parrafo' ? todos.slice(1) : todos;
  if (!bloques.length) return null;
  return (
    <section className={s.seccion} aria-labelledby="descripcion-titulo">
      <h2 id="descripcion-titulo" className="titulo">Características</h2>
      <div className={s.cuerpo}>
        {bloques.map((b, i) => (b.tipo === 'lista'
          ? <ul key={i} className={s.lista}>{b.items.map((it) => {
              const [etiqueta, ...resto] = it.split(': ');
              return <li key={it}>{resto.length ? <><strong>{etiqueta}:</strong> {resto.join(': ')}</> : it}</li>;
            })}</ul>
          : <p key={i}>{b.texto}</p>))}
      </div>
    </section>
  );
}
