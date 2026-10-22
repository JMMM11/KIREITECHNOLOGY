import s from './Esqueleto.module.css';

// Esqueletos con la forma final: nada de spinners.
export function EsqueletoTarjetas({ cantidad = 8 }) {
  return (
    <ul className={s.rejilla} aria-hidden="true">
      {Array.from({ length: cantidad }, (_, i) => (
        <li key={i} className={s.tarjeta}>
          <span className={s.foto} />
          <span className={s.linea} />
          <span className={`${s.linea} ${s.corta}`} />
        </li>
      ))}
    </ul>
  );
}
