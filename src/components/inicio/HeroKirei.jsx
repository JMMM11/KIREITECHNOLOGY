import { Link } from 'wouter';
import TelefonosHero from './TelefonosHero.jsx';
import Aparece from '../ui/Aparece.jsx';
import s from './HeroKirei.module.css';

export default function HeroKirei() {
  return (
    <section className={s.hero} aria-labelledby="hero-titulo">
      <div className={`contenedor ${s.texto}`}>
        <Aparece i={0} como="p" className={s.marca}>Kirei Technology</Aparece>
        <h1 id="hero-titulo" className={s.titulo}>
          <Aparece i={1} como="span" className={s.linea}>Tecnología.</Aparece>
          {' '}
          <Aparece i={2} como="span" className={`${s.linea} ${s.suave}`}>Sin complicarte.</Aparece>
        </h1>
        <Aparece i={3} como="p" className={s.sub}>Compra, repara y recíbelo hoy en Panamá</Aparece>
        <Aparece i={4} className={s.enlaces}>
          <Link href="/tecnologia" className={s.enlace}>Comprar <span aria-hidden="true">›</span></Link>
          <Link href="/reparaciones" className={s.enlace}>Reparar <span aria-hidden="true">›</span></Link>
        </Aparece>
      </div>

      <Aparece i={5} className={s.escena}>
        <TelefonosHero />
      </Aparece>
    </section>
  );
}
