import { Link } from 'wouter';
import Foto from '../ui/Foto.jsx';
import { INICIO } from '../../data/textos.js';
import s from './Inicio.module.css';

export default function ReparacionesInicio() {
  return (
    <section className="seccion" aria-labelledby="reparaciones-titulo">
      <div className={`contenedor ${s.reparaciones}`}>
        <span className={s.reparacionesFoto}>
          <Foto foto={{ base: 'reparacion', ancho: 394, alto: 394 }} alt="Técnico reparando la placa de una laptop" sizes="(min-width: 900px) 30vw, 90vw" />
        </span>
        <div className={s.reparacionesTexto}>
          <h2 id="reparaciones-titulo" className="titulo">{INICIO.reparaciones.titulo}</h2>
          <p className="suave">{INICIO.reparaciones.texto}</p>
          <Link href="/reparaciones" className="btn btn-marca">{INICIO.reparaciones.accion}</Link>
        </div>
      </div>
    </section>
  );
}
