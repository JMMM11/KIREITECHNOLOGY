import { Link } from 'wouter';
import Foto from '../ui/Foto.jsx';
import Parallax from '../ui/Parallax.jsx';
import { INICIO } from '../../data/textos.js';
import { FOTOS_REPARACION } from '../../data/servicios.js';
import s from './Inicio.module.css';

export default function ReparacionesInicio() {
  return (
    <section className="seccion" aria-labelledby="reparaciones-titulo">
      <div className="contenedor">
      <div className={s.reparaciones}>
        <Parallax className={s.reparacionesFoto}>
          <Foto foto={FOTOS_REPARACION.inicio} alt="Técnico revisando la placa de una laptop con un multímetro" sizes="(min-width: 900px) 30vw, 90vw" />
        </Parallax>
        <div className={s.reparacionesTexto}>
          <h2 id="reparaciones-titulo" className="titulo">{INICIO.reparaciones.titulo}</h2>
          <p className="suave">{INICIO.reparaciones.texto}</p>
          <Link href="/reparaciones" className="btn btn-marca">{INICIO.reparaciones.accion}</Link>
        </div>
      </div>
      </div>
    </section>
  );
}
