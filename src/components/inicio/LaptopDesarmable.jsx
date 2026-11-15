import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import Aparece from '../ui/Aparece.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { SITIO } from '../../data/sitio.js';
import s from './LaptopDesarmable.module.css';

const PASOS = [
  { id: 'diagnostico', titulo: 'Diagnóstico', texto: 'Revisamos tu equipo y te decimos qué tiene, antes de tocar nada.', piezas: ['Pantalla', 'Teclado', 'Carcasa'] },
  { id: 'desarme', titulo: 'Desarme', texto: 'Abrimos con cuidado y sacamos pieza por pieza: placa, memoria, almacenamiento, batería y ventilador.', piezas: ['Carcasa', 'Batería', 'Placa base', 'Ventilador', 'Teclado'] },
  { id: 'cambio', titulo: 'Reparación y mejora', texto: 'Cambiamos pantalla, batería o teclado, y ponemos al día la memoria y el almacenamiento.', piezas: ['Batería', 'Memoria RAM', 'SSD', 'Pantalla'] },
  { id: 'armado', titulo: 'Armado y prueba', texto: 'Cerramos, probamos que todo funcione y te la entregamos lista. También instalamos Windows y hacemos mantenimiento.', piezas: ['Carcasa', 'Batería', 'Placa base', 'Ventilador', 'Teclado', 'Pantalla'] },
];
const PIEZAS = ['Pantalla', 'Teclado', 'Ventilador', 'Placa base', 'Memoria RAM', 'SSD', 'Batería', 'Carcasa'];

// Medidas de la escena en px (se escala con CSS). v(): ancho, alto, altura armada, cuánto sube al desarmar, posición x, y y cuánto se mueve de lado.
const v = (w, h, z0, dz, x0 = 0, y0 = 0, dx = 0, dy = 0) => ({ '--w': w, '--h': h, '--z0': z0, '--dz': dz, '--x0': x0, '--y0': y0, '--dx': dx, '--dy': dy });
const sub = (w, h, x, y, lift) => ({ '--sw': w, '--sh': h, '--sx': x, '--sy': y, '--lift': lift });

// Componentes pequeños de la placa: [x, y, ancho, alto] desde el centro de la placa.
const CHIPS = [[-150, -70, 34, 26], [-110, 40, 26, 26], [20, -86, 40, 18], [40, 66, 36, 24], [-20, 84, 44, 16], [150, 56, 30, 30], [-190, 0, 22, 40], [190, -20, 20, 44]];
const CONDENSADORES = [[-186, -92], [-168, -92], [-150, -100], [96, 90], [112, 90], [128, 90], [186, 92], [-60, 98]];
const TORNILLOS = [[-214, -150], [214, -150], [-214, 150], [214, 150], [0, -150], [0, 150], [-214, 0], [214, 0]];

const ESTATICO = { '--e': 1, '--rz': -26, '--rx': 70, '--h-bat': 0, '--h-mem': 0, '--h-pant': 0, '--luz': 1 };
const suave = (t) => t * t * (3 - 2 * t);

export default function LaptopDesarmable({ conceptos = true }) {
  const reducir = useReducedMotion();
  const pista = useRef(null);
  const [paso, setPaso] = useState(0);
  const { scrollYProgress } = useScroll({ target: pista, offset: ['start start', 'end end'] });
  // Resorte corto: el scroll "se asienta" en vez de seguir al dedo a saltos.
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4 });
  const e0 = useTransform(p, [0, 0.1, 0.36, 0.6, 0.84, 1], [0, 0, 1, 1, 0, 0]);
  const e = useTransform(e0, suave);
  const rz = useTransform(p, [0, 1], [-34, 12]);
  const rx = useTransform(p, [0, 0.36, 0.6, 1], [60, 70, 70, 60]);
  const hBat = useTransform(p, [0.36, 0.41, 0.46, 0.5], [0, 1, 1, 0]);
  const hMem = useTransform(p, [0.44, 0.49, 0.54, 0.58], [0, 1, 1, 0]);
  const hPant = useTransform(p, [0.5, 0.55, 0.6, 0.64], [0, 1, 1, 0]);
  const luz = useTransform(p, [0.86, 0.96], [0, 1]);
  useMotionValueEvent(p, 'change', (x) => setPaso(x < 0.1 ? 0 : x < 0.36 ? 1 : x < 0.6 ? 2 : 3));

  const vivo = { '--e': e, '--rz': rz, '--rx': rx, '--h-bat': hBat, '--h-mem': hMem, '--h-pant': hPant, '--luz': luz };
  const consulta = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, quiero consultar por una mejora de memoria o almacenamiento.')}`;
  const activo = PASOS[reducir ? 1 : paso];

  return (
    <section className={`${s.seccion} tema-taller`} aria-labelledby="taller-titulo">
      <div className={`contenedor ${s.encabezado}`}>
        <p className={s.etiqueta}>Taller Kirei</p>
        <h2 id="taller-titulo" className={s.titulo}>Tu laptop, por dentro.</h2>
        <p className={s.bajada}>Abrimos, diagnosticamos y la dejamos funcionando. Mira cómo trabajamos.</p>
      </div>

      <div ref={pista} className={reducir ? s.pistaFija : s.pista}>
        <div className={s.escenario}>
          <div className={s.fondo} />
          <div className={`contenedor ${s.cuadro}`}>
            <div className={s.texto}>
              <ol className={s.pasos}>
                {PASOS.map((x, i) => (
                  <li key={x.id} className={s.paso} data-activo={x === activo ? '' : undefined} aria-current={x === activo ? 'step' : undefined}>
                    <span className={s.numero}>0{i + 1}</span>
                    <div>
                      <h3>{x.titulo}</h3>
                      <p>{x.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <ul className={s.piezas} aria-label="Piezas de la laptop">
                {PIEZAS.map((n) => <li key={n} data-activa={activo.piezas.includes(n) ? '' : undefined}>{n}</li>)}
              </ul>
            </div>

            <div className={s.vista} role="img" aria-label="Una laptop que se desarma pieza por pieza, se revisa y se vuelve a armar">
              <motion.div className={s.mundoCaja} style={reducir ? ESTATICO : vivo}>
                <div className={s.mundo}>
                  <i className={s.halo} />
                  <i className={s.suelo} />

                  <div className={`${s.pieza} ${s.solido} ${s.carcasa}`} style={v(480, 330, 0, 0)}>
                    <i className={s.rebaje} />
                    {TORNILLOS.map(([x, y]) => <i key={`p${x}${y}`} className={s.poste} style={{ left: `calc(50% + ${x * 0.97}px)`, top: `calc(50% + ${y * 0.96}px)` }} />)}
                  </div>

                  <div className={`${s.pieza} ${s.solido} ${s.bateria}`} style={v(330, 96, 6, 100, 0, 108)}>
                    <i /><i /><i />
                    <b className={s.conector} />
                  </div>

                  {[-1, 1].map((lado) => (
                    <div key={lado} className={`${s.pieza} ${s.solido} ${s.altavoz}`} style={v(78, 44, 6, 100, lado * 205, 110)}><i className={s.malla} /></div>
                  ))}

                  <div className={`${s.pieza} ${s.solido} ${s.placa}`} style={v(440, 228, 12, 205, 0, -44)}>
                    <i className={s.pistas} />
                    {CHIPS.map(([x, y, w, h]) => <i key={`c${x}${y}`} className={s.chip} style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, width: w, height: h }} />)}
                    {CONDENSADORES.map(([x, y]) => <i key={`k${x}${y}`} className={s.condensador} style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }} />)}
                    <i className={`${s.sub} ${s.solido} ${s.cpu}`} style={sub(74, 74, -62, -14, 34)}><b /></i>
                    <i className={`${s.sub} ${s.solido} ${s.gpu}`} style={sub(54, 54, 62, 26, 22)} />
                    <i className={`${s.sub} ${s.solido} ${s.ram}`} style={sub(150, 28, 128, -84, 52)} />
                    <i className={`${s.sub} ${s.solido} ${s.ram}`} style={sub(150, 28, 128, -50, 40)} />
                    <i className={`${s.sub} ${s.solido} ${s.ssd}`} style={sub(126, 26, -140, 82, 28)} />
                  </div>

                  <div className={`${s.pieza} ${s.enfriamiento}`} style={v(330, 170, 20, 305, -20, -50)}>
                    <i className={s.tubo} style={{ left: 120, top: 38, width: 130 }} />
                    <i className={s.tubo} style={{ left: 110, top: 74, width: 140 }} />
                    <i className={s.disipador} />
                    <svg className={s.ventilador} viewBox="-70 -70 140 140" aria-hidden="true">
                      <circle r="66" className={s.carcasaVent} />
                      <g className={s.aspas}>
                        {Array.from({ length: 9 }, (_, i) => <path key={i} transform={`rotate(${i * 40})`} d="M0 -9 C 8 -26 30 -48 54 -38 C 42 -24 24 -8 9 6 Z" />)}
                        <circle r="13" className={s.eje} />
                      </g>
                    </svg>
                  </div>

                  {[-1, 1].map((lado) => (
                    <div key={lado} className={`${s.pieza} ${s.solido} ${s.bisagra}`} style={v(54, 28, 16, 230, lado * 190, -152)} />
                  ))}

                  <div className={`${s.pieza} ${s.solido} ${s.deck}`} style={v(480, 330, 28, 410)}>
                    <i className={`${s.rejilla} ${s.izq}`} /><i className={`${s.rejilla} ${s.der}`} />
                    <div className={s.teclas}><i className={s.espacio} /></div>
                    <i className={s.trackpad} />
                  </div>

                  <div className={s.grupoPantalla}>
                    <div className={`${s.panel} ${s.tapa}`} style={{ '--cz': -4, '--dc': -90 }} />
                    <div className={`${s.panel} ${s.lcd}`} style={{ '--cz': 0, '--dc': -14 }}><i className={s.encendido} /></div>
                    <div className={`${s.panel} ${s.bisel}`} style={{ '--cz': 4, '--dc': 64 }}><i className={s.camara} /></div>
                  </div>

                  {TORNILLOS.map(([x, y]) => <i key={`t${x}${y}`} className={s.tornillo} style={{ '--x0': x, '--y0': y }} />)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {conceptos && (
        <div className={`contenedor ${s.conceptos}`}>
          <Aparece alVer como="article" className={s.concepto}>
            <Icono de={ICONOS.reparar.de} mov={ICONOS.reparar.mov} entrada={false} tam={26} />
            <h3>Reparación</h3>
            <p>Diagnóstico, pantalla, batería, teclado, sistema y limpieza.</p>
            <Link href="/reparaciones" className={s.enlace}>Agenda tu diagnóstico <span aria-hidden="true">›</span></Link>
          </Aparece>
          <Aparece alVer como="article" i={1} className={s.concepto}>
            <Icono de={ICONOS.mejorar.de} mov={ICONOS.mejorar.mov} entrada={false} tam={26} />
            <h3>Mejoras</h3>
            <p>Más memoria, más almacenamiento y Windows al día para que rinda como nueva.</p>
            <a href={consulta} target="_blank" rel="noopener noreferrer" className={s.enlace}>Consultar por WhatsApp <span aria-hidden="true">›</span></a>
          </Aparece>
          <Aparece alVer como="article" i={2} className={s.concepto}>
            <Icono de={ICONOS.tienda.de} mov={ICONOS.tienda.mov} entrada={false} tam={26} />
            <h3>Tienda</h3>
            <p>Audífonos, relojes y accesorios con garantía, con retiro gratis o envío a domicilio.</p>
            <Link href="/tecnologia" className={s.enlace}>Ver tecnología <span aria-hidden="true">›</span></Link>
          </Aparece>
        </div>
      )}
    </section>
  );
}
