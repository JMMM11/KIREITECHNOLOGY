import IconoKirei from './IconoKirei.jsx';
import s from './Cargando.module.css';

// Pantalla de carga con la antena de Kirei buscando señal. Aparece con un pequeño retraso para no parpadear en cargas rápidas.
export default function Cargando({ texto = 'Cargando' }) {
  return (
    <div className={s.cargando} role="status">
      <IconoKirei estado="cargando" alto={88} />
      <span className={s.texto}>{texto}</span>
    </div>
  );
}
