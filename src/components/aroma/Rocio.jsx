import { useEffect, useRef } from 'react';

// Animación de la portada de Aroma: del atomizador del frasco sale un rocío que viaja, forma las letras del título
// y se disuelve como una esencia, dejando el título real (texto de verdad, para Google y lectores de pantalla).
// escena: el contenedor donde se dibuja; titulo: el h1 que se "escribe"; boquilla: la foto del frasco.
// alMostrar: momento de mostrar el título real; alTerminar: el rocío ya se fue y el lienzo sobra.
const NIEBLA = ['#B7C4D3', '#FDEBD3', '#FFFFFF', '#E4E9EF'];
const suave = (k) => 1 - (1 - k) ** 3;
const limite = (k) => Math.min(1, Math.max(0, k));

// Las letras del título, dibujadas en su posición real, palabra por palabra, con su color y su fuente.
function letrasDelTitulo(h1, caja, ancho, alto) {
  const lienzo = document.createElement('canvas'); lienzo.width = ancho; lienzo.height = alto;
  const o = lienzo.getContext('2d', { willReadFrequently: true });
  const andar = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
  for (let nodo = andar.nextNode(); nodo; nodo = andar.nextNode()) {
    const est = getComputedStyle(nodo.parentElement);
    o.font = `${est.fontWeight} ${est.fontSize} ${est.fontFamily}`;
    if ('letterSpacing' in o) o.letterSpacing = est.letterSpacing === 'normal' ? '0px' : est.letterSpacing;
    o.fillStyle = est.color;
    for (const m of nodo.textContent.matchAll(/\S+/g)) {
      const rango = document.createRange(); rango.setStart(nodo, m.index); rango.setEnd(nodo, m.index + m[0].length);
      const r = rango.getBoundingClientRect(), med = o.measureText(m[0]);
      const sube = med.fontBoundingBoxAscent ?? med.actualBoundingBoxAscent, baja = med.fontBoundingBoxDescent ?? med.actualBoundingBoxDescent;
      o.fillText(m[0], r.left - caja.left, r.top - caja.top + r.height / 2 + (sube - baja) / 2);
    }
  }
  return o.getImageData(0, 0, ancho, alto).data;
}

export default function Rocio({ escena, titulo, boquilla, alMostrar, alTerminar }) {
  const lienzo = useRef(null);
  const avisos = useRef({ alMostrar, alTerminar });
  avisos.current = { alMostrar, alTerminar };

  useEffect(() => {
    let id = 0, vivo = true, mostrado = false;
    const mostrar = () => { if (!mostrado) { mostrado = true; avisos.current.alMostrar(); } };
    const terminar = () => { if (!vivo) return; vivo = false; cancelAnimationFrame(id); mostrar(); avisos.current.alTerminar(); };
    const seguro = setTimeout(terminar, 7000);   // pase lo que pase, el título aparece
    // Si cambia el ancho a mitad, las letras ya no coinciden y se corta. El alto no: en el celular cambia solo al esconderse la barra.
    const ancho0 = innerWidth;
    const alCambiar = () => { if (innerWidth !== ancho0) terminar(); };

    const empezar = async () => {
      await document.fonts?.ready;
      const c = lienzo.current, contenedor = escena.current, h1 = titulo.current;
      if (!vivo || !c || !contenedor || !h1) return terminar();
      const caja = contenedor.getBoundingClientRect();
      const W = Math.ceil(caja.width), H = Math.ceil(caja.height), dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = W * dpr; c.height = H * dpr;
      const x = c.getContext('2d'); x.scale(dpr, dpr);

      // Destino de cada gota: un punto de las letras.
      const datos = letrasDelTitulo(h1, caja, W, H);
      const paso = W < 640 ? 3 : 4, metas = [];
      for (let yy = 0; yy < H; yy += paso) for (let xx = 0; xx < W; xx += paso) {
        const i = (yy * W + xx) * 4;
        if (datos[i + 3] > 140) metas.push([xx, yy, `rgb(${datos[i]} ${datos[i + 1]} ${datos[i + 2]})`]);
      }
      if (!metas.length) return terminar();

      // Boquilla: arriba al centro de la foto del frasco (si no hay foto, a la derecha).
      const f = boquilla.current?.getBoundingClientRect();
      const bx = f ? f.left - caja.left + f.width * 0.5 : W * 0.85, by = f ? f.top - caja.top + f.height * 0.17 : H * 0.3;
      const tr = h1.getBoundingClientRect(), centroX = tr.left - caja.left + tr.width / 2, centroY = tr.top - caja.top + tr.height / 2;
      const rumbo = Math.atan2(centroY - by, centroX - bx), lejos = Math.hypot(centroX - bx, centroY - by) || 1;

      // Gotas que forman las letras: salen en abanico, hacen una curva y se posan; las más lejanas llegan después.
      const gotas = metas.map(([tx, ty, color]) => {
        const d = Math.hypot(tx - bx, ty - by) / (lejos * 1.6);
        const mx = (bx + tx) / 2, my = (by + ty) / 2, giro = (Math.random() - 0.5) * 220;
        return { tx, ty, color, retraso: 0.15 + d * 0.75 + Math.random() * 0.35, dura: 0.85 + Math.random() * 0.45,
          cx: mx - Math.sin(rumbo) * giro, cy: my + Math.cos(rumbo) * giro - 40, semilla: Math.random() * 6.28, deriva: 0.6 + Math.random() * 0.8 };
      });
      // Niebla: el chorro del atomizador, que no forma letras y se desvanece.
      const niebla = Array.from({ length: W < 640 ? 260 : 460 }, () => {
        const a = rumbo + (Math.random() - 0.5) * 0.9, v = 160 + Math.random() * 520;
        return { nace: Math.random() * 1.1, vida: 1.1 + Math.random() * 1.3, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, r: 1 + Math.random() * 3.5,
          color: NIEBLA[(Math.random() * NIEBLA.length) | 0] };
      });

      const forma = Math.max(...gotas.map((g) => g.retraso + g.dura));
      const revela = forma + 0.3, fin = revela + 1.5;
      const inicio = performance.now();

      const cuadro = (ahora) => {
        if (!vivo) return;
        const t = (ahora - inicio) / 1000;
        x.clearRect(0, 0, W, H);

        // Soplo en la boquilla al empezar.
        if (t < 0.5) {
          const k = 1 - t / 0.5, g = x.createRadialGradient(bx, by, 0, bx, by, 70);
          g.addColorStop(0, `rgb(253 235 211 / ${0.55 * k})`); g.addColorStop(1, 'rgb(253 235 211 / 0)');
          x.fillStyle = g; x.fillRect(bx - 70, by - 70, 140, 140);
        }

        x.globalCompositeOperation = 'lighter';
        x.filter = 'blur(2px)';   // niebla difusa (Safari lo ignora y queda nítida, igual se ve bien)
        for (const n of niebla) {
          const v = t - n.nace; if (v < 0 || v > n.vida) continue;
          const k = v / n.vida, frena = 1 - Math.exp(-v * 2.2);
          x.globalAlpha = 0.35 * (1 - k) * Math.min(1, v * 8);
          x.fillStyle = n.color; x.beginPath();
          x.arc(bx + (n.vx / 2.2) * frena, by + (n.vy / 2.2) * frena - 20 * v * v, n.r * (1 + k * 3), 0, 6.283); x.fill();
        }
        x.filter = 'none';
        x.globalCompositeOperation = 'source-over';

        // Gotas: viajan, se posan en las letras y, al final, se disuelven hacia arriba.
        const disuelve = limite((t - revela) / (fin - revela));
        for (const g of gotas) {
          const k = limite((t - g.retraso) / g.dura); if (k <= 0) continue;
          const e = suave(k), u = 1 - e;
          let px = u * u * bx + 2 * u * e * g.cx + e * e * g.tx, py = u * u * by + 2 * u * e * g.cy + e * e * g.ty;
          let tam = 3.2 - 2.4 * e + paso * 0.5 * e, alfa = 0.3 + 0.7 * e;
          if (disuelve > 0) {
            const d = disuelve * g.deriva;
            px += Math.sin(g.semilla + t * 2) * 18 * d; py -= 46 * d * d + 10 * d;
            tam *= 1 + d * 1.6; alfa *= 1 - disuelve;
          }
          x.globalAlpha = alfa; x.fillStyle = g.color;
          x.fillRect(px - tam / 2, py - tam / 2, tam, tam);
        }
        x.globalAlpha = 1;

        if (t >= revela) mostrar();
        if (t >= fin) { x.clearRect(0, 0, W, H); return terminar(); }
        id = requestAnimationFrame(cuadro);
      };
      id = requestAnimationFrame(cuadro);
    };

    // Espera a que la foto termine de entrar, para que la boquilla quede en su sitio.
    const espera = setTimeout(empezar, 650);
    addEventListener('resize', alCambiar);
    return () => { vivo = false; cancelAnimationFrame(id); clearTimeout(seguro); clearTimeout(espera); removeEventListener('resize', alCambiar); };
  }, [escena, titulo, boquilla]);

  return <canvas ref={lienzo} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />;
}
