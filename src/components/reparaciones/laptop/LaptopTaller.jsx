import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import Aparece from '../../ui/Aparece.jsx';
import { DURACION, INICIO_CICLO, PASOS, PIEZAS, T_DESARMADA, estado } from './secuencia.js';
import s from './LaptopTaller.module.css';

const MODELO = `${import.meta.env.BASE_URL}modelos/laptop.glb`;
const ETIQUETAS = PIEZAS.map((pz, i) => pz.etiqueta && { i, texto: pz.etiqueta, lado: pz.lado }).filter(Boolean);

// La laptop del taller en 3D: se desarma y se arma sola, en bucle, sin controles.
// El modelo y three se cargan cuando la sección se acerca a la pantalla. Con movimiento reducido queda quieta y desarmada.
export default function LaptopTaller() {
  const reducir = useReducedMotion();
  const seccion = useRef(null), lienzo = useRef(null), etiquetas = useRef([]);
  const t = useRef(reducir ? T_DESARMADA : 0);
  const sucio = useRef(true);
  const [cerca, setCerca] = useState(false);
  const [fase, setFase] = useState('espera');   // espera | cargando | lista | error
  const [paso, setPaso] = useState(reducir ? 2 : 0);
  const andandoRef = useRef(!reducir);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setCerca(true); io.disconnect(); } }, { rootMargin: '700px' });
    io.observe(seccion.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!cerca) return undefined;
    let vivo = true, api = null, id = 0, visible = false, previo = performance.now();
    setFase('cargando');
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; previo = performance.now(); });
    const alCambiar = () => { sucio.current = true; };
    const cuadro = (ahora) => {
      id = requestAnimationFrame(cuadro);
      const dt = Math.min(0.1, (ahora - previo) / 1000); previo = ahora;
      if (!visible || document.hidden) return;            // fuera de pantalla no se dibuja
      if (andandoRef.current) { t.current += dt; if (t.current >= DURACION) t.current = INICIO_CICLO; }
      else if (!sucio.current) return;                     // en pausa solo se redibuja si algo cambió
      sucio.current = false;
      const est = estado(t.current);
      api.poner(est, t.current);
      setPaso((p) => (p === est.paso ? p : est.paso));
      ETIQUETAS.forEach((et, k) => {
        const el = etiquetas.current[k], p = est.piezas[et.i], pos = api.proyectar(et.i);
        if (!el || !pos) return;
        el.style.opacity = Math.max(0, (p - 0.8) * 5);
        el.style.transform = `translate(${pos[0].toFixed(1)}px, ${pos[1].toFixed(1)}px)`;
      });
    };
    import('./escena.js')
      .then((m) => m.crearEscena(lienzo.current, MODELO))
      .then((a) => {
        if (!vivo) { a.destruir(); return; }
        api = a; setFase('lista');
        io.observe(lienzo.current); addEventListener('resize', alCambiar);
        id = requestAnimationFrame(cuadro);
      })
      .catch(() => { if (vivo) setFase('error'); });
    return () => { vivo = false; cancelAnimationFrame(id); io.disconnect(); removeEventListener('resize', alCambiar); api?.destruir(); };
  }, [cerca]);

  const actual = PASOS[paso];

  return (
    <section ref={seccion} className={`${s.seccion} tema-taller`} aria-labelledby="taller-titulo">
      <div className={`contenedor ${s.encabezado}`}>
        <Aparece alVer como="p" className={s.sobre}>Taller Kirei</Aparece>
        <Aparece alVer como="h2" i={1} id="taller-titulo" className={s.titulo}>Tu laptop, por dentro.</Aparece>
        <Aparece alVer como="p" i={2} className={s.bajada}>Abrimos, diagnosticamos y la dejamos funcionando. Mira cómo trabajamos.</Aparece>
      </div>

      <div className={`contenedor ${s.escenario}`}>
        <div className={s.lienzo} data-fase={fase}>
          <div ref={lienzo} className={s.tres} role="img" aria-label="Laptop en 3D que se desarma pieza por pieza y se vuelve a armar: tornillos, teclado, batería, memoria RAM, SSD, ventilador, disipador y placa base." />
          {fase !== 'lista' && fase !== 'error' && <p className={s.cargando} role="status">Cargando el modelo 3D</p>}
          {fase === 'error' && <p className={s.cargando} role="status">No pudimos mostrar el modelo 3D en este navegador. El servicio es el mismo: lo ves en los pasos.</p>}
          <div className={s.etiquetas} aria-hidden="true">
            {ETIQUETAS.map((et, k) => (
              <span key={et.texto} ref={(el) => { etiquetas.current[k] = el; }} className={s.etiqueta} data-lado={et.lado}><i>{et.texto}</i></span>
            ))}
          </div>
        </div>

        <div className={s.panel}>
          <ol className={s.pasos}>
            {PASOS.map((p, i) => (
              <li key={p.titulo} className={s.marca} aria-current={i === paso ? 'step' : undefined}>
                <span>{String(i + 1).padStart(2, '0')}</span>{p.titulo}
              </li>
            ))}
          </ol>
          <div className={s.texto} aria-live="off">
            <h3 key={actual.titulo} className={s.pasoTitulo}>{actual.titulo}</h3>
            <p key={actual.texto} className={s.pasoTexto}>{actual.texto}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
