// Escena three de la laptop: carga el GLB, ilumina y aplica el estado del guion. Se importa bajo demanda, solo en /reparaciones.
import {
  ACESFilmicToneMapping, CanvasTexture, DirectionalLight, HemisphereLight, Mesh, MeshBasicMaterial, PCFSoftShadowMap, PerspectiveCamera,
  PlaneGeometry, PMREMGenerator, Scene, ShadowMaterial, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PIEZAS } from './secuencia.js';

const ANGULO_TAPA = (108 * Math.PI) / 180;

// Lo que muestra la pantalla al encender: el logo de Kirei sobre marino noche, dibujado en un lienzo.
// El logo es un SVG del sitio; se dibuja cuando carga y la textura se actualiza.
function texturaPantalla() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 684;
  const x = c.getContext('2d');
  const fondo = () => {
    x.fillStyle = '#071524'; x.fillRect(0, 0, 1024, 684);
    const g = x.createRadialGradient(512, 330, 20, 512, 330, 520); g.addColorStop(0, 'rgb(247 147 30 / 0.28)'); g.addColorStop(1, 'rgb(247 147 30 / 0)');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 684);
    x.fillStyle = '#F7931E'; x.textAlign = 'center'; x.font = '600 32px Poppins, sans-serif'; x.fillText('Todo funcionando.', 512, 470);
  };
  fondo();
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace;
  const logo = new Image();
  logo.onload = () => { fondo(); x.drawImage(logo, 512 - 360, 240, 720, 172); t.needsUpdate = true; };
  logo.src = `${import.meta.env.BASE_URL}marca/kirei-logo-fondo-oscuro.svg`;
  return t;
}

export async function crearEscena(contenedor, url) {
  const tactil = matchMedia('(pointer: coarse)').matches;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, tactil ? 1.5 : 2));   // en celular se dibuja a menos resolución
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = !tactil; renderer.shadowMap.type = PCFSoftShadowMap;   // sin sombras proyectadas en celular
  contenedor.appendChild(renderer.domElement);

  const escena = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;   // luz de estudio: da los reflejos del aluminio
  escena.environment = entorno; escena.environmentIntensity = 0.85;
  const principal = new DirectionalLight('#fff4e8', 2.4); principal.position.set(260, 520, 420);
  principal.castShadow = !tactil; principal.shadow.mapSize.set(1024, 1024);
  Object.assign(principal.shadow.camera, { left: -360, right: 360, top: 360, bottom: -360, near: 100, far: 1400 }); principal.shadow.bias = -0.0015;
  const contra = new DirectionalLight('#B7C4D3', 1.1); contra.position.set(-420, 260, -380);   // contraluz niebla, frío y suave
  escena.add(principal, contra, new HemisphereLight('#dfe8f5', '#0f1216', 0.45));

  const piso = new Mesh(new PlaneGeometry(2400, 2400), new ShadowMaterial({ opacity: 0.38 }));
  piso.rotation.x = -Math.PI / 2; piso.position.y = -14.2; piso.receiveShadow = true; escena.add(piso);

  const camara = new PerspectiveCamera(30, 1, 10, 6000);
  const gltf = await new GLTFLoader().loadAsync(url);
  const laptop = gltf.scene; escena.add(laptop);
  laptop.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const nodo = (n) => laptop.getObjectByName(n);
  const partes = PIEZAS.map((pz) => { const o = nodo(pz.nodo); return o && { o, base: o.position.clone(), giroBase: o.rotation.clone() }; });
  const tapa = nodo('Pantalla'), rotor = nodo('VentiladorRotor');

  // Imagen de la pantalla encendida: un plano sobre el panel, dentro del grupo de la tapa.
  const luz = new Mesh(new PlaneGeometry(286, 191), new MeshBasicMaterial({ map: texturaPantalla(), transparent: true, opacity: 0, toneMapped: false }));
  luz.rotation.set(Math.PI / 2, 0, 0); luz.position.set(0, 3.0, 117); tapa.add(luz);

  let ancho = 1, alto = 1;
  const medir = () => {
    ancho = contenedor.clientWidth || 1; alto = contenedor.clientHeight || 1;
    renderer.setSize(ancho, alto, false); camara.aspect = ancho / alto; camara.updateProjectionMatrix();
  };
  const obs = new ResizeObserver(medir); obs.observe(contenedor); medir();

  const v = new Vector3();
  let ultimo = performance.now();
  return {
    // Aplica el estado del guion (ver secuencia.js) y dibuja un cuadro. t es el segundo del guion, para la órbita.
    poner(est, t) {
      const ahora = performance.now(), dt = Math.min(0.05, (ahora - ultimo) / 1000); ultimo = ahora;
      PIEZAS.forEach((pz, i) => {
        const parte = partes[i]; if (!parte) return;
        const p = est.piezas[i], { o, base, giroBase } = parte;
        o.position.set(base.x + pz.d[0] * p, base.y + pz.d[1] * p, base.z + pz.d[2] * p);
        if (pz.gira) o.rotation.set(giroBase.x + pz.gira[0] * p, giroBase.y + pz.gira[1] * p, giroBase.z + pz.gira[2] * p);
        if (pz.vueltas) o.rotation.y = giroBase.y + p * pz.vueltas * Math.PI * 2;   // el tornillo gira al salir
        if (pz.inclina) {                                                             // la RAM se levanta 25 grados antes de salir del zócalo
          const k = Math.min(1, p / 0.3) * (1 - Math.min(1, Math.max(0, (p - 0.3) / 0.4)));
          o.rotation.z = giroBase.z + 0.44 * k; o.position.x += 5 * k;
        }
      });
      tapa.rotation.x = -ANGULO_TAPA * est.tapa;
      luz.material.opacity = est.pantalla;
      if (rotor) rotor.rotation.y -= dt * (1.5 + 16 * est.pantalla);
      // Cámara: órbita lenta; se aleja y sube el punto de mira a medida que la laptop se abre.
      const e = est.abierta, estrecho = Math.max(1, 1.28 / camara.aspect);
      const az = -0.5 + 0.42 * Math.sin((t / 29) * Math.PI * 2), el = 0.36 + 0.12 * e;
      const r = (790 + 250 * e) * estrecho ** 0.7, cy = 64 + 62 * e;
      camara.position.set(Math.sin(az) * Math.cos(el) * r, cy + Math.sin(el) * r, 108 + Math.cos(az) * Math.cos(el) * r);
      camara.lookAt(0, cy, 96);
      renderer.render(escena, camara);
    },
    // Posición en pantalla (px dentro del contenedor) de una pieza, para las etiquetas.
    proyectar(i) {
      const parte = partes[i]; if (!parte) return null;
      parte.o.getWorldPosition(v).project(camara);
      return [(v.x * 0.5 + 0.5) * ancho, (-v.y * 0.5 + 0.5) * alto];
    },
    destruir() {
      obs.disconnect();
      escena.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); [].concat(o.material).forEach((m) => { m.map?.dispose(); m.dispose(); }); } });
      entorno.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
