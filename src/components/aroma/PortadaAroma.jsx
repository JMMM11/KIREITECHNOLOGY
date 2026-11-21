import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import s from './PortadaAroma.module.css';

// Portada de Aroma, automática: "AROMA." entra letra por letra y el frasco de Kirei sube girando y queda flotando,
// dibujado en 3D en vivo (src/components/aroma/escenaFrasco.js). Mientras carga, o sin WebGL, se ve su foto fija.
// Es un frasco decorativo de Kirei, no un producto en venta.
const MODELO = `${import.meta.env.BASE_URL}modelos/frasco.glb`;
const FOTO = `${import.meta.env.BASE_URL}aroma/frasco.webp`;
const LETRAS = 'AROMA.'.split('');

export default function PortadaAroma({ destino, telefono, enlaceTelefono }) {
  const reducir = useReducedMotion();
  const seccion = useRef(null), lienzo = useRef(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let api = null, vivo = true, visible = true;
    const seguir = () => (visible && !document.hidden ? api?.arrancar() : api?.parar());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; seguir(); });
    const mover = (e) => {
      const r = seccion.current.getBoundingClientRect();
      api?.puntero(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    import('./escenaFrasco.js')
      .then((m) => m.crearFrasco(lienzo.current, MODELO, { quieto: !!reducir }))
      .then((a) => {
        if (!vivo) return a.destruir();
        api = a; setListo(true);
        io.observe(seccion.current); document.addEventListener('visibilitychange', seguir);
        if (!reducir) seccion.current.addEventListener('pointermove', mover);
        seguir();
      })
      .catch(() => {});   // sin WebGL queda la foto fija
    const nodo = seccion.current;
    return () => { vivo = false; io.disconnect(); document.removeEventListener('visibilitychange', seguir); nodo.removeEventListener('pointermove', mover); api?.destruir(); };
  }, [reducir]);

  const ir = () => document.getElementById(destino)?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });

  return (
    <section ref={seccion} className={s.portada} aria-labelledby="aroma-titulo">
      <h1 id="aroma-titulo" className={s.titulo} aria-label="Aroma">
        {LETRAS.map((l, i) => <span key={i} aria-hidden="true" style={{ animationDelay: `${0.15 + i * 0.09}s` }}>{l}</span>)}
      </h1>

      <div className={s.frasco} data-listo={listo || undefined}>
        <img className={s.foto} src={FOTO} alt="" width="1000" height="1250" fetchPriority="high" />
        <div ref={lienzo} className={s.lienzo} role="img" aria-label="Frasco de perfume de vidrio ámbar con tapa de cobre y la etiqueta AROMA de Kirei, flotando." />
      </div>

      <div className={s.copia}>
        <p className={s.nota}>Una primera impresión inesperada.</p>
        <p className={s.sobre}>Perfumería Kirei</p>
        <h2 className={s.lema}>Descubre <span>tu esencia.</span></h2>
        <p className={s.texto}>Perfumes de mujer y hombre de Lattafa, Ariana Grande, Armaf y más.</p>
        <div className={s.acciones}>
          <button type="button" className={`btn btn-accion ${s.boton}`} onClick={ir}>Ver los perfumes <span aria-hidden="true">↓</span></button>
          <a className={s.telefono} href={enlaceTelefono} target="_blank" rel="noopener noreferrer">Pedidos: {telefono}</a>
        </div>
      </div>
    </section>
  );
}
