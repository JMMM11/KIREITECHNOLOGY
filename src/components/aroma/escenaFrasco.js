// Escena three del frasco de la portada de Aroma: se importa bajo demanda, solo en /aroma.
// Animación automática: el frasco sube girando, luego flota en bucle con una luz naranja que lo rodea,
// partículas suaves alrededor y una leve inclinación hacia el puntero.
import {
  AdditiveBlending, ACESFilmicToneMapping, Box3, BufferAttribute, BufferGeometry, CanvasTexture, Color, DirectionalLight, Group, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PMREMGenerator, PointLight, Points, PointsMaterial, Scene, Vector3, WebGLRenderer,
  SRGBColorSpace,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const suave = (k) => 1 - (1 - Math.min(1, Math.max(0, k))) ** 3;

// Materiales físicos por nombre (los nombres vienen de scripts/modelo3d/frasco.py).
const MATERIALES = {
  // Vidrio: capa fina transparente que solo aporta reflejos. Líquido: el único material que refracta (three no anida dos
  // transmisiones), ámbar por absorción, como el vidrio grueso de un perfume.
  Vidrio: () => new MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0.03, transparent: true, opacity: 0.07, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.6, depthWrite: false }),
  Liquido: () => new MeshPhysicalMaterial({ color: '#FFB860', transmission: 1, thickness: 0.5, roughness: 0.05, ior: 1.4, attenuationColor: new Color('#E07A12'), attenuationDistance: 0.7, clearcoat: 1, emissive: '#D9680A', emissiveIntensity: 0.55, envMapIntensity: 1.4 }),
  Cobre: () => new MeshPhysicalMaterial({ color: '#C07A30', metalness: 1, roughness: 0.2, clearcoat: 0.5, envMapIntensity: 1.4 }),
  Etiqueta: () => new MeshStandardMaterial({ color: '#0B1F33', roughness: 0.38 }),
  Blanco: () => new MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.4 }),
};

export async function crearFrasco(contenedor, url, { quieto = false } = {}) {
  const tactil = matchMedia('(pointer: coarse)').matches;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, tactil ? 1.75 : 2));
  renderer.setClearColor(0x000000, 0);   // lienzo transparente: no se nota su borde sobre el fondo de la sección
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  contenedor.appendChild(renderer.domElement);

  const escena = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;   // estudio: reflejos del vidrio y el cobre
  escena.environment = entorno; escena.environmentIntensity = 0.9;
  const clave = new DirectionalLight('#FFF1E0', 2.2); clave.position.set(2.5, 3, 4);
  const contra = new DirectionalLight('#FDEBD3', 1.6); contra.position.set(-3, 2, -3);
  const naranja = new PointLight('#F7931E', 6, 6, 1.6);   // gira alrededor del frasco: los brillos se mueven
  escena.add(clave, contra, naranja);

  const gltf = await new GLTFLoader().loadAsync(url);
  const modelo = gltf.scene;
  modelo.traverse((o) => {
    if (o.isMesh && MATERIALES[o.material?.name]) { const n = o.material.name; o.material.dispose(); o.material = MATERIALES[n](); if (n === 'Vidrio') o.renderOrder = 2; }
  });
  const caja = new Box3().setFromObject(modelo), centro = caja.getCenter(new Vector3()), tam = caja.getSize(new Vector3());
  modelo.position.sub(centro);   // el frasco gira sobre su centro
  const frasco = new Group(); frasco.add(modelo); escena.add(frasco);

  // Halo de luz cálida detrás del frasco: se ve como luz de estudio y el líquido lo refracta, lo que le da volumen.
  const lienzoHalo = document.createElement('canvas'); lienzoHalo.width = lienzoHalo.height = 256;
  const g = lienzoHalo.getContext('2d'), grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgb(247 147 30 / 0.55)'); grad.addColorStop(0.3, 'rgb(229 133 15 / 0.2)'); grad.addColorStop(0.7, 'rgb(229 133 15 / 0.04)'); grad.addColorStop(1, 'rgb(229 133 15 / 0)');
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  const texHalo = new CanvasTexture(lienzoHalo); texHalo.colorSpace = SRGBColorSpace;
  const halo = new Mesh(new PlaneGeometry(tam.y * 1.7, tam.y * 1.7), new MeshBasicMaterial({ map: texHalo, transparent: true, depthWrite: false, toneMapped: false }));
  halo.position.z = -tam.z * 2.2; escena.add(halo);

  // Partículas: polvo de luz que sube despacio alrededor del frasco.
  const n = tactil ? 90 : 160, pos = new Float32Array(n * 3), vel = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = 0.5 + Math.random() * 0.9, a = Math.random() * Math.PI * 2;
    pos.set([Math.cos(a) * r, (Math.random() - 0.5) * tam.y * 1.8, Math.sin(a) * r - 0.2], i * 3); vel[i] = 0.03 + Math.random() * 0.06;
  }
  const geo = new BufferGeometry(); geo.setAttribute('position', new BufferAttribute(pos, 3));
  const polvo = new Points(geo, new PointsMaterial({ color: '#FDEBD3', size: 0.012, transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false }));
  escena.add(polvo);

  const camara = new PerspectiveCamera(26, 1, 0.1, 50);
  const distancia = (tam.y / 2) / Math.tan((26 * Math.PI) / 360) * 1.45;
  camara.position.set(0, tam.y * 0.08, distancia); camara.lookAt(0, 0, 0);

  const medir = () => {
    const w = contenedor.clientWidth || 1, h = contenedor.clientHeight || 1;
    renderer.setSize(w, h, false); camara.aspect = w / h;
    camara.position.z = distancia * Math.max(1, 0.62 / camara.aspect);   // en cajas angostas se aleja para que quepa
    camara.updateProjectionMatrix();
  };
  const obs = new ResizeObserver(() => { medir(); if (!id) renderer.render(escena, camara); }); obs.observe(contenedor); medir();

  // Puntero: el frasco se inclina un poco hacia él, con resorte.
  const meta = { x: 0, y: 0 }, giro = { x: 0, y: 0 };
  let id = 0, t0 = 0, previo = 0, tiempo = 0;

  const pose = (t, dt) => {
    const e = suave(t / 1.9);
    giro.x += (meta.x - giro.x) * Math.min(1, dt * 3); giro.y += (meta.y - giro.y) * Math.min(1, dt * 3);
    frasco.position.y = -tam.y * 0.85 * (1 - e) + Math.sin(t * 1.15) * tam.y * 0.025 * e;
    frasco.rotation.y = -2.4 * (1 - e) - 0.32 + Math.sin(t * 0.32) * 0.5 * e + giro.x * 0.35;
    frasco.rotation.x = giro.y * 0.12;
    frasco.rotation.z = Math.sin(t * 0.75) * 0.035 * e;
    frasco.scale.setScalar(0.88 + 0.12 * e);
    naranja.position.set(Math.cos(t * 0.6) * 1.4, Math.sin(t * 0.9) * tam.y * 0.4, Math.sin(t * 0.6) * 1.4 + 0.3);
    for (let i = 0; i < n; i++) {
      let y = pos[i * 3 + 1] + vel[i] * dt;
      if (y > tam.y * 0.9) y = -tam.y * 0.9;
      pos[i * 3 + 1] = y;
    }
    geo.attributes.position.needsUpdate = true;
    polvo.material.opacity = 0.55 * e;
    halo.material.opacity = e * (0.85 + Math.sin(t * 0.8) * 0.15);   // respira despacio
  };
  const cuadro = (ahora) => {
    id = requestAnimationFrame(cuadro);
    if (!t0) { t0 = ahora - tiempo * 1000; previo = ahora; }
    const dt = Math.min(0.05, (ahora - previo) / 1000); previo = ahora;
    tiempo = (ahora - t0) / 1000;
    pose(tiempo, dt);
    renderer.render(escena, camara);
  };

  if (quieto) { pose(6, 1); renderer.render(escena, camara); }   // movimiento reducido: un solo cuadro, ya presentado
  return {
    arrancar() { if (!quieto && !id) { t0 = 0; id = requestAnimationFrame(cuadro); } },   // retoma desde el tiempo guardado
    parar() { cancelAnimationFrame(id); id = 0; },
    puntero(x, y) { meta.x = x; meta.y = y; },
    destruir() {
      cancelAnimationFrame(id); id = 0; obs.disconnect();
      escena.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => m.dispose()); });
      texHalo.dispose();
      entorno.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
