import Contador from '../ui/Contador.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { INICIO } from '../../data/textos.js';
import s from './Inicio.module.css';

const ICONO = { garantia: ICONOS.garantia, retiro: ICONOS.retiro, envio: ICONOS.envio, pago: ICONOS.pago };

export default function Garantias() {
  return (
    <section className={s.garantias} aria-label="Garantía, entregas y pagos">
      <ul className={`contenedor ${s.garantiasLista}`}>
        {INICIO.garantias.map((g) => (
          <li key={g.id} className={s.garantia}>
            <span className={s.garantiaIcono}><Icono de={ICONO[g.id].de} mov={ICONO[g.id].mov} tam={22} /></span>
            <span className={s.garantiaValor}><Contador valor={g.valor} prefijo={g.prefijo} sufijo={g.sufijo} /></span>
            <span className={s.garantiaTexto}>{g.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
