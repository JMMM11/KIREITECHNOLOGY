// Solo lo usa el panel /admin: sesión, productos, pedidos, citas y subida de fotos.
import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db } from './firebase.js';
import { auth } from './auth.js';
import { PRODUCTOS } from '../data/productos.js';
import { actualizarPedido, listarPedidos } from './pedidos.js';
import { cambiarEstadoCita, listarCitas } from './citas.js';

export const vigilarSesion = (fn) => onAuthStateChanged(auth, fn);
export const entrar = (correo, clave) => signInWithEmailAndPassword(auth, correo, clave);
export const salir = () => signOut(auth);

// Incluye borradores: las reglas solo se los dejan leer al administrador.
export async function todosLosProductos() {
  const snap = await getDocs(collection(db, 'productos'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

// Firestore rechaza campos undefined; el viaje por JSON los quita.
const limpio = (datos) => JSON.parse(JSON.stringify(datos));
export const guardarProducto = ({ id, ...datos }) => setDoc(doc(db, 'productos', id), limpio(datos));
export const borrarProducto = (id) => deleteDoc(doc(db, 'productos', id));

// Primera vez: copia los productos de data/productos.js a la base de datos.
export async function importarLocales() {
  const lote = writeBatch(db);
  for (const { id, ...datos } of PRODUCTOS) lote.set(doc(db, 'productos', id), limpio(datos));
  await lote.commit();
}

// Subida sin firma: el preset público de Cloudinary limita formato, tamaño y carpeta. La clave secreta nunca va aquí.
export async function subirFoto(archivo) {
  const nube = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!nube || !preset) throw new Error('Falta configurar Cloudinary en .env.local.');
  const datos = new FormData();
  datos.append('file', archivo);
  datos.append('upload_preset', preset);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${nube}/image/upload`, { method: 'POST', body: datos });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message ?? 'No se pudo subir la foto.');
  // f_auto,q_auto: formato y peso livianos según el navegador; c_limit,w_1600: nunca más ancha que 1600px.
  return { src: j.secure_url.replace('/upload/', '/upload/f_auto,q_auto,c_limit,w_1600/'), ancho: j.width, alto: j.height };
}

export const pedidos = () => listarPedidos(db);
export const actualizar = (id, cambios) => actualizarPedido(db, id, cambios);
export const citas = () => listarCitas(db);
export const estadoCita = (id, estado) => cambiarEstadoCita(db, id, estado);
