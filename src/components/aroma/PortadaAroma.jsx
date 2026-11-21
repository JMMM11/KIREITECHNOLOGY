import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { N, lim, pose } from './portada.js';
import s from './PortadaAroma.module.css';

// Portada de Aroma: la caja de Kirei se abre y el frasco sube flotando, ligado al scroll (no se reproduce solo).
// 120 cuadros con fondo transparente en public/aroma/frasco/ (scripts/modelo3d/perfume.py). Pista de 360svh con escena fija.
// p = avance del scroll en la pista (0 a 1); el cuadro es round(p * 119) y vuelve exacto al subir.
const ruta = (i) => `${import.meta.env.BASE_URL}aroma/frasco/${String(i).padStart(3, '0')}.webp`;

export default function PortadaAroma({ destino, telefono, enlaceTelefono }) {
  const reducir = useReducedMotion();
  const pista = useRef(null), lienzo = useRef(null), titulo = useRef(null), copia = useRef(null), nota = useRef(null), final = useRef(null);

  useEffect(() => {
    const c = lienzo.current, x = c.getContext('2d'), cuadros = new Array(N);
    let W = 0, H = 0, dpr = 1, alto = 0, vh = 0, id = 0, vivo = true, visible = true;

    const medir = () => {
      const r = c.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      alto = pista.current.offsetHeight; vh = innerHeight;
    };
    // Mientras un cuadro no ha llegado se dibuja el cargado más cercano: nunca queda en blanco.
    const cercano = (i) => {
      for (let d = 0; d < N; d++) { if (cuadros[i - d]) return cuadros[i - d]; if (cuadros[i + d]) return cuadros[i + d]; }
      return null;
    };
    const pintar = () => {
      id = 0;
      const p = lim(-pista.current.getBoundingClientRect().top / Math.max(1, alto - vh)), e = pose(p);
      titulo.current.style.opacity = e.titulo;
      copia.current.style.opacity = e.titulo;
      nota.current.style.opacity = e.nota;
      nota.current.style.transform = `translateY(${(1 - e.nota) * 25}px) rotate(-7deg)`;
      final.current.style.opacity = e.final;
      final.current.style.transform = `translateY(${(1 - e.final) * 45}px) scale(${0.85 + 0.15 * e.final})`;
      final.current.inert = e.final < 0.5;   // el botón final no se puede enfocar mientras no se ve
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      const img = cercano(e.cuadro); if (!img) return;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const fit = Math.min(W / iw, H / ih) * (W < 600 ? 1.25 : 1);
      x.drawImage(img, (W - iw * fit) / 2 + (W >= 600 ? 0.13 * W : 0), (H - ih * fit) / 2 - 0.15 * H * e.sube, iw * fit, ih * fit);
    };
    const pedir = () => { if (!id && visible && vivo) id = requestAnimationFrame(pintar); };
    const alRedimensionar = () => { medir(); pedir(); };

    // Carga: primero el cuadro 0, luego el resto con 6 descargas a la vez. Cada cuadro llega ya decodificado.
    const cargar = (i) => new Promise((listo) => {
      const img = new Image(); img.src = ruta(i);
      img.decode().then(() => { if (vivo) { cuadros[i] = img; pedir(); } }, () => {}).finally(listo);
    });
    cargar(0).then(() => {
      const cola = Array.from({ length: N - 1 }, (_, k) => k + 1);
      const trabajar = async () => { while (vivo && cola.length) await cargar(cola.shift()); };
      for (let k = 0; k < 6; k++) trabajar();
    });

    // Fuera de pantalla no se dibuja; al volver se retoma desde el scroll actual.
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; pedir(); });
    io.observe(pista.current);
    medir(); pedir();
    document.fonts?.ready.then(alRedimensionar);
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', alRedimensionar);
    return () => { vivo = false; cancelAnimationFrame(id); io.disconnect(); removeEventListener('scroll', pedir); removeEventListener('resize', alRedimensionar); };
  }, []);

  const ir = () => document.getElementById(destino)?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });

  return (
    <section ref={pista} className={s.pista} aria-labelledby="aroma-titulo">
      <div className={s.escena}>
        <h1 ref={titulo} id="aroma-titulo" className={s.titulo}>Aroma.</h1>
        <canvas ref={lienzo} className={s.lienzo} role="img" aria-label="La caja de Kirei se abre y de ella sube flotando un frasco de perfume de vidrio ámbar con tapa de cobre." />
        <div ref={copia} className={s.copia}>
          <p className={s.sobre}>Perfumería Kirei</p>
          <p className={s.texto}>Perfumes de mujer y hombre de Lattafa, Ariana Grande, Armaf y más. Baja y descubre el tuyo.</p>
          <a className={s.telefono} href={enlaceTelefono} target="_blank" rel="noopener noreferrer">Pedidos de perfumes: {telefono}</a>
        </div>
        <p ref={nota} className={s.nota} style={{ opacity: 0 }}>Una primera<br />impresión inesperada.</p>
        <div ref={final} className={s.final} style={{ opacity: 0 }} inert>
          <h2 className={s.finalTitulo}>Descubre<br /><span>tu esencia.</span></h2>
          <button type="button" className={`btn btn-accion ${s.boton}`} onClick={ir}>Ver los perfumes <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </section>
  );
}
