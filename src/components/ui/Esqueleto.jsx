import s from './Esqueleto.module.css';

// Esqueletos con la forma final: nada de spinners.
export function EsqueletoTarjeta() {
  return (
    <span className={s.tarjeta} aria-hidden="true">
      <span className={s.foto} />
      <span className={s.linea} />
      <span className={`${s.linea} ${s.corta}`} />
    </span>
  );
}

export function EsqueletoTarjetas({ cantidad = 8 }) {
  return (
    <ul className={s.rejilla} aria-hidden="true">
      {Array.from({ length: cantidad }, (_, i) => <li key={i}><EsqueletoTarjeta /></li>)}
    </ul>
  );
}

// Ficha de producto: foto cuadrada a la izquierda, datos a la derecha, igual que la real.
export function EsqueletoProducto() {
  return (
    <div className={`contenedor ${s.producto}`} role="status">
      <span className="sr-only">Cargando producto</span>
      <span className={`${s.foto} ${s.productoFoto}`} aria-hidden="true" />
      <span className={s.productoInfo} aria-hidden="true">
        <span className={`${s.linea} ${s.corta}`} />
        <span className={`${s.linea} ${s.titulo}`} />
        <span className={`${s.linea} ${s.precio}`} />
        <span className={s.linea} />
        <span className={s.linea} />
        <span className={`${s.linea} ${s.boton}`} />
      </span>
    </div>
  );
}
