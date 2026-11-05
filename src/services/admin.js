// Solo lo usa el panel /admin: sesión, productos, pedidos, citas y subida de fotos.
import { collection, deleteDoc, doc, getDocsFromServer, runTransaction, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db } from './firebase.js';
import { auth } from './auth.js';
import { PRODUCTOS } from '../data/productos.js';
import { actualizarPedido, listarPedidos } from './pedidos.js';
import { cambiarEstadoCita, listarCitas } from './citas.js';
import { borrarComentario, cambiarEstadoComentario, listarComentarios } from './comentarios.js';

export const vigilarSesion = (fn) => onAuthStateChanged(auth, fn);
export const entrar = (correo, clave) => signInWithEmailAndPassword(auth, correo, clave);
export const salir = () => signOut(auth);

// Incluye borradores: las reglas solo se los dejan leer al administrador.
export async function todosLosProductos() {
  const snap = await getDocsFromServer(collection(db, 'productos'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

// Firestore rechaza campos undefined; el viaje por JSON los quita.
const limpio = (datos) => JSON.parse(JSON.stringify(datos));
export const guardarProducto = ({ id, ...datos }) => setDoc(doc(db, 'productos', id), limpio(datos));
export const borrarProducto = (id) => deleteDoc(doc(db, 'productos', id));

// Deja la base de datos igual que data/productos.js: escribe esos productos y borra los que no están ahí.
// existentes: ids que hay hoy en Firestore (el panel ya los tiene cargados).
export async function importarLocales(existentes = []) {
  const lote = writeBatch(db);
  for (const { id, ...datos } of PRODUCTOS) lote.set(doc(db, 'productos', id), limpio(datos));
  for (const id of sobrantes(existentes)) lote.delete(doc(db, 'productos', id));
  await lote.commit();
}
export const sobrantes = (existentes) => existentes.filter((id) => !PRODUCTOS.some((p) => p.id === id));

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

// Solo datos de contacto y fecha: la dirección queda en la cuenta y el admin no la necesita para atender.
export async function clientes() {
  const snap = await getDocsFromServer(collection(db, 'usuarios'));
  return snap.docs.map((d) => ({ uid: d.id, nombre: d.data().nombre, correo: d.data().correo, telefono: d.data().telefono, creadoEn: d.data().creadoEn }))
    .sort((a, b) => (b.creadoEn?.seconds ?? 0) - (a.creadoEn?.seconds ?? 0));
}

// Acceso al panel. Las reglas solo dejan escribir aquí al dueño de la tienda.
export async function admins() {
  const snap = await getDocsFromServer(collection(db, 'admins'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}
export const darAcceso = ({ uid, nombre, correo }) => setDoc(doc(db, 'admins', uid), { nombre: nombre ?? '', correo: correo ?? '', agregadoEn: serverTimestamp() });
export const quitarAcceso = (uid) => deleteDoc(doc(db, 'admins', uid));

// Al confirmar un pedido se descuentan sus unidades; al cancelar uno confirmado se devuelven.
// Solo toca productos con stock contado (no null) para no inventar existencias.
// Transacción: si dos admins confirman pedidos a la vez, ninguno pisa la cuenta del otro.
export function ajustarStock(items, signo) {
  const porProducto = {};
  for (const i of items ?? []) porProducto[i.productoId] = (porProducto[i.productoId] ?? 0) + i.cantidad;
  return runTransaction(db, async (tx) => {
    const refs = Object.keys(porProducto).map((id) => doc(db, 'productos', id));
    const snaps = await Promise.all(refs.map((r) => tx.get(r)));
    snaps.forEach((snap, n) => {
      const stock = snap.exists() ? snap.data().stock : null;
      if (typeof stock === 'number') tx.update(refs[n], { stock: Math.max(0, stock + signo * porProducto[refs[n].id]) });
    });
  });
}
export { esAdmin } from './cuenta.js';
export const comentarios = () => listarComentarios(db);
export const estadoComentario = (id, estado) => cambiarEstadoComentario(db, id, estado);
export const eliminarComentario = (id) => borrarComentario(db, id);
