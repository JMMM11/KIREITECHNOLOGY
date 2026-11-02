import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Foto from '../ui/Foto.jsx';
import Icono from '../ui/Icono.jsx';
import Escritura from '../ui/Escritura.jsx';
import { ICONOS } from '../iconos.js';
import { HERO } from '../../data/textos.js';
import s from './Inicio.module.css';

const SUAVE = [0.22, 1, 0.36, 1];

// La foto ocupa todo el ancho y se recoge en una tarjeta redondeada mientras bajas.
// El texto y los botones se ven desde el primer momento.
export default function HeroZoom() {
  const ref = useRef(null);
  const reducir = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: reducir ? undefined : ref, offset: ['start start', 'end start'] });
  const scale = useTransform(p, [0, 0.6], [1, 0.9]);
  const radio = useTransform(p, [0, 0.6], [0, 28]);
  const borde = useMotionTemplate`${radio}px`;
  const imagen = useTransform(p, [0, 1], [1.12, 1]);
  const textoY = useTransform(p, [0, 0.6], [0, -40]);
  const [actual, setActual] = useState(0);
  const [fija, setFija] = useState(false);

  // Elegir una foto detiene el cambio automático: es la forma de pausarlo.
  useEffect(() => {
    if (reducir || fija) return undefined;
    const t = setInterval(() => setActual((a) => (a + 1) % HERO.fotos.length), 6000);
    return () => clearInterval(t);
  }, [reducir, fija]);

  return (
    <section ref={ref} className={s.hero} aria-labelledby="hero-titulo">
      <motion.div className={s.heroMarco} style={reducir ? undefined : { scale, borderRadius: borde }}>
        <motion.div className={s.heroImagen} style={reducir ? undefined : { scale: imagen }}>
          {HERO.fotos.map((foto, i) => (
            <Foto key={foto.src} foto={foto} alt="" prioridad={i === 0} sizes="100vw" className={i === actual ? s.heroActiva : undefined} />
          ))}
        </motion.div>
        <div className={s.heroVelo} aria-hidden="true" />
        <div className={s.heroPuntos} role="group" aria-label="Fotos de portada">
          {HERO.fotos.map((foto, i) => (
            <button
              key={foto.src}
              type="button"
              className={s.heroPunto}
              aria-label={`Foto ${i + 1} de ${HERO.fotos.length}`}
              aria-current={i === actual ? 'true' : undefined}
              onClick={() => { setActual(i); setFija(true); }}
            />
          ))}
        </div>
        <motion.div className={`contenedor ${s.heroTexto}`} style={reducir ? undefined : { y: textoY }}>
          <motion.h1
            id="hero-titulo"
            className={s.heroTitulo}
            initial={{ y: 18, filter: 'blur(8px)' }}
            animate={{ y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: SUAVE }}
          >
            {HERO.titulo} <Escritura frases={HERO.frases} />
          </motion.h1>
          <p className={s.heroBajada}>{HERO.texto}</p>
          <div className={s.heroAcciones}>
            <Link href={HERO.principal.a} className="btn btn-accion">{HERO.principal.texto}</Link>
            <Link href={HERO.secundario.a} className={`btn btn-fantasma ${s.heroFantasma}`}>
              {HERO.secundario.texto}
              <Icono de={ICONOS.siguiente.de} mov={ICONOS.siguiente.mov} entrada={false} tam={16} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
