// Comentarios de clientes en cada producto. Recibe la base de datos como parámetro para que tests/reglas/ la pruebe.
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';

const porFecha = (a, b) => (a.creadoEn?.seconds ?? 0) - (b.creadoEn?.seconds ?? 0);

// Solo los publicados: las reglas dejan leer los demás únicamente al administrador y a su autor.
export async function comentariosPublicados(db, productoId) {
  const snap = await getDocs(query(collection(db, 'comentarios'), where('productoId', '==', productoId), where('estado', '==', 'publicado')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(porFecha);
}

// datos viene del formulario; firestore.rules exige esa misma forma y el estado inicial "pendiente".
export const enviarComentario = (db, datos) => addDoc(collection(db, 'comentarios'), { ...datos, estado: 'pendiente', creadoEn: serverTimestamp() });

// Solo el administrador: las reglas rechazan la lectura a cualquier otro.
export async function listarComentarios(db) {
  const snap = await getDocs(collection(db, 'comentarios'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => porFecha(b, a));
}

export const cambiarEstadoComentario = (db, id, estado) => updateDoc(doc(db, 'comentarios', id), { estado });
export const borrarComentario = (db, id) => deleteDoc(doc(db, 'comentarios', id));

// Al eliminar la cuenta: el cliente borra todo lo que escribió.
export async function borrarComentariosDe(db, uid) {
  const snap = await getDocs(query(collection(db, 'comentarios'), where('uid', '==', uid)));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}
