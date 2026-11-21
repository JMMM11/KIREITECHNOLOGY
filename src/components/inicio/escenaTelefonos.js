// Escena three de los dos teléfonos de la portada: se importa bajo demanda. Animación automática, como el frasco de Aroma:
// los teléfonos suben, flotan a destiempo, una luz los rodea y mueve los reflejos, y se inclinan un poco hacia el puntero.
// Pantallas dibujadas en un lienzo: una con el logo de Kirei encendido y la otra con la tienda.
import {
  ACESFilmicToneMapping, CanvasTexture, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PerspectiveCamera,
  PMREMGenerator, PointLight, Scene, Shape, ShapeGeometry, SRGBColorSpace, WebGLRenderer, BoxGeometry, ExtrudeGeometry,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const RUTA = import.meta.env.BASE_URL;
const suave = (k) => 1 - (1 - Math.min(1, Math.max(0, k))) ** 3;
const cargar = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });

// Medidas del teléfono (unidades libres): 9 x 19,2 como un iPhone.
const ANCHO = 0.9, ALTO = 1.92, GRUESO = 0.09, RADIO = 0.13, BORDE = 0.035;

function contorno(w, h, r) {
  const s = new Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function rectRedondo(w, h, r) {
  const x = -w / 2, y = -h / 2, g = new ShapeGeometry(contorno(w, h, r), 24), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - x) / w, (p.getY(i) - y) / h);   // la textura cubre la pantalla entera
  return g;
}

// Pantallas: se dibujan en 900 x 1920 y se guardan al doble (1800 x 3840) para que el texto salga nítido.
const K = 2;
function lienzo() { const c = document.createElement('canvas'); c.width = 900 * K; c.height = 1920 * K; const x = c.getContext('2d'); x.scale(K, K); return [c, x]; }
// Pantallas: Se dibujan de una vez y se actualizan cuando llegan las imágenes.
function pantallaLogo(logo) {
  const [c, x] = lienzo();
  x.fillStyle = '#071524'; x.fillRect(0, 0, 900, 1920);
  const g = x.createRadialGradient(450, 900, 30, 450, 900, 700); g.addColorStop(0, 'rgb(247 147 30 / 0.35)'); g.addColorStop(1, 'rgb(247 147 30 / 0)');
  x.fillStyle = g; x.fillRect(0, 0, 900, 1920);
  if (logo) x.drawImage(logo, 450 - 390, 780, 780, 186);
  x.fillStyle = '#F7931E'; x.textAlign = 'center'; x.font = '600 46px Poppins, sans-serif'; x.fillText('Tecnología · Reparaciones', 450, 1080);
  x.fillStyle = '#B7C4D3'; x.font = '400 40px Poppins, sans-serif'; x.fillText('Aroma · Anime', 450, 1145);
  x.fillStyle = 'rgb(255 255 255 / 0.5)'; x.beginPath(); x.roundRect(330, 1850, 240, 12, 6); x.fill();
  return c;
}
function pantallaTienda(foto, icono, precio) {
  const [c, x] = lienzo();
  x.fillStyle = '#F7F5F1'; x.fillRect(0, 0, 900, 1920);
  if (icono) x.drawImage(icono, 70, 150, 34, 64);
  x.strokeStyle = '#0B1F33'; x.lineWidth = 6; x.beginPath(); x.roundRect(770, 160, 56, 56, 10); x.stroke();
  x.textAlign = 'center'; x.fillStyle = '#0B1F33'; x.font = '600 104px Poppins, sans-serif'; x.fillText('Tecnología.', 450, 420);
  x.fillStyle = '#4A4A4A'; x.fillText('Sin', 450, 530); x.fillText('complicarte.', 450, 640);
  x.fillStyle = '#FFFFFF'; x.shadowColor = 'rgb(11 31 51 / 0.15)'; x.shadowBlur = 40; x.shadowOffsetY = 14;
  x.beginPath(); x.roundRect(80, 720, 740, 700, 56); x.fill(); x.shadowColor = 'transparent';
  if (foto) { x.save(); x.beginPath(); x.roundRect(110, 750, 680, 470, 36); x.clip(); x.drawImage(foto, 110, 750 - 120, 680, 680 * foto.height / foto.width); x.restore(); }
  x.fillStyle = '#111111'; x.font = '600 52px Poppins, sans-serif'; x.fillText('Lenovo GM2 Pro', 450, 1300);
  x.fillStyle = '#4A4A4A'; x.font = '400 44px Poppins, sans-serif'; x.fillText(`Desde ${precio}`, 450, 1370);
  x.fillStyle = '#F7931E'; x.beginPath(); x.roundRect(90, 1480, 720, 120, 60); x.fill();
  x.fillStyle = '#111111'; x.font = '600 48px Poppins, sans-serif'; x.fillText('Agregar al carrito', 450, 1557);
  x.fillStyle = 'rgb(11 31 51 / 0.6)'; x.beginPath(); x.roundRect(330, 1850, 240, 12, 6); x.fill();
  return c;
}

function telefono(lienzo, materiales) {
  const g = new Group();
  // Cuerpo: el contorno redondeado del teléfono extruido, con bisel en los cantos (marco de titanio).
  const cuerpo = new ExtrudeGeometry(contorno(ANCHO, ALTO, RADIO), { depth: GRUESO - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.018, bevelSegments: 5, curveSegments: 24 });
  cuerpo.translate(0, 0, -(GRUESO - 0.04) / 2); g.add(new Mesh(cuerpo, materiales.marco));
  const vidrio = new Mesh(rectRedondo(ANCHO - BORDE * 2, ALTO - BORDE * 2, RADIO - BORDE), materiales.negro);
  vidrio.position.z = GRUESO / 2 + 0.0015; g.add(vidrio);
  const tex = new CanvasTexture(lienzo); tex.colorSpace = SRGBColorSpace; tex.anisotropy = 16;   // three lo limita al máximo de la tarjeta gráfica
  const pantalla = new Mesh(rectRedondo(ANCHO - BORDE * 2 - 0.03, ALTO - BORDE * 2 - 0.03, RADIO - BORDE - 0.01), new MeshBasicMaterial({ map: tex, toneMapped: false }));
  pantalla.position.z = GRUESO / 2 + 0.003; g.add(pantalla);
  const brillo = new Mesh(rectRedondo(ANCHO - BORDE * 2, ALTO - BORDE * 2, RADIO - BORDE), materiales.cristal);   // reflejos sobre la pantalla
  brillo.position.z = GRUESO / 2 + 0.005; g.add(brillo);
  const isla = new Mesh(rectRedondo(0.26, 0.075, 0.0375), materiales.negro);
  isla.position.set(0, ALTO / 2 - 0.12, GRUESO / 2 + 0.006); g.add(isla);
  for (const [lado, y, h] of [[1, 0.35, 0.22], [-1, 0.42, 0.14], [-1, 0.22, 0.14]]) {   // encendido a la derecha, volumen a la izquierda
    const b = new Mesh(new BoxGeometry(0.012, h, 0.04), materiales.marco); b.position.set(lado * (ANCHO / 2 + 0.004), y, 0); g.add(b);
  }
  return { g, tex };
}

export async function crearTelefonos(contenedor, { quieto = false, foto, precio } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  contenedor.appendChild(renderer.domElement);

  const escena = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  escena.environment = entorno; escena.environmentIntensity = 1;
  const clave = new DirectionalLight('#FFF1E0', 2); clave.position.set(2, 3, 4);
  const naranja = new PointLight('#F7931E', 5, 6, 1.6);
  escena.add(clave, naranja);

  const materiales = {
    marco: new MeshPhysicalMaterial({ color: '#3A4350', metalness: 1, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 1.3 }),   // titanio
    negro: new MeshPhysicalMaterial({ color: '#050709', roughness: 0.2, clearcoat: 1 }),
    cristal: new MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0.05, transparent: true, opacity: 0.06, clearcoat: 1, envMapIntensity: 2, depthWrite: false }),
  };
  // Las letras de las pantallas usan Poppins: se espera a que cargue para no dibujar con otra fuente.
  const fuentes = Promise.all(['400 40px Poppins', '600 40px Poppins'].map((f) => document.fonts.load(f))).catch(() => {});
  const [logo, icono, imgFoto] = await Promise.all([cargar(`${RUTA}marca/kirei-logo-fondo-oscuro.svg`), cargar(`${RUTA}marca/kirei-icono-naranja.svg`), cargar(foto), fuentes]);
  const izq = telefono(pantallaLogo(logo), materiales), der = telefono(pantallaTienda(imgFoto, icono, precio), materiales);
  const grupoIzq = new Group(), grupoDer = new Group(); grupoIzq.add(izq.g); grupoDer.add(der.g);
  escena.add(grupoIzq, grupoDer);

  const camara = new PerspectiveCamera(28, 1, 0.1, 50);
  const medir = () => {
    const w = contenedor.clientWidth || 1, h = contenedor.clientHeight || 1;
    renderer.setSize(w, h, false); camara.aspect = w / h;
    camara.position.set(0, 0.1, 5.3 * Math.max(1, 1.15 / camara.aspect)); camara.lookAt(0, 0.08, 0);   // encuadre ajustado: sin aire de sobra abajo camara.updateProjectionMatrix();
  };
  let id = 0;
  const obs = new ResizeObserver(() => { medir(); if (!id) renderer.render(escena, camara); }); obs.observe(contenedor); medir();

  const meta = { x: 0, y: 0 }, giro = { x: 0, y: 0 };
  let t0 = 0, previo = 0, tiempo = 0;
  const pose = (t, dt) => {
    const e1 = suave((t - 0.1) / 1.6), e2 = suave((t - 0.35) / 1.6);
    giro.x += (meta.x - giro.x) * Math.min(1, dt * 3); giro.y += (meta.y - giro.y) * Math.min(1, dt * 3);
    // Izquierdo: más atrás y girado hacia la derecha. Derecho: delante, girado hacia la izquierda. Como la foto de producto.
    grupoIzq.position.set(-0.62, 0.05 - 1.6 * (1 - e1) + Math.sin(t * 1.2 + 1.4) * 0.05 * e1, -0.35);
    grupoIzq.rotation.set(0.1 + giro.y * 0.1, 0.38 - 1.2 * (1 - e1) + Math.sin(t * 0.4) * 0.08 + giro.x * 0.25, 0.12);
    grupoDer.position.set(0.6, 0.18 - 1.6 * (1 - e2) + Math.sin(t * 1.4) * 0.06 * e2, 0.15);
    grupoDer.rotation.set(0.1 + giro.y * 0.1, -0.32 + 1.2 * (1 - e2) + Math.sin(t * 0.45 + 1) * 0.08 + giro.x * 0.25, -0.1);
    naranja.position.set(Math.cos(t * 0.6) * 2.2, Math.sin(t * 0.8) * 1.2, 1.6 + Math.sin(t * 0.6) * 0.8);
  };
  const cuadro = (ahora) => {
    id = requestAnimationFrame(cuadro);
    if (!t0) { t0 = ahora - tiempo * 1000; previo = ahora; }
    const dt = Math.min(0.05, (ahora - previo) / 1000); previo = ahora;
    tiempo = (ahora - t0) / 1000;
    pose(tiempo, dt); renderer.render(escena, camara);
  };
  if (quieto) { pose(6, 1); renderer.render(escena, camara); }
  return {
    arrancar() { if (!quieto && !id) { t0 = 0; id = requestAnimationFrame(cuadro); } },
    parar() { cancelAnimationFrame(id); id = 0; },
    puntero(x, y) { meta.x = x; meta.y = y; },
    destruir() {
      cancelAnimationFrame(id); id = 0; obs.disconnect();
      escena.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material?.map) { o.material.map.dispose(); o.material.dispose(); } });
      Object.values(materiales).forEach((m) => m.dispose());
      entorno.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}

