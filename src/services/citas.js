// Citas de reparación en Firestore. Recibe la base de datos como parámetro para que tests/reglas/ la pruebe contra el emulador.
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';

// datos viene de datosCita (src/lib/cita.js); firestore.rules exige esa misma forma.
export async function guardarCita(db, datos) {
  const ref = await addDoc(collection(db, 'citas'), { ...datos, creadoEn: serverTimestamp() });
  return { ...datos, id: ref.id, creadoEn: new Date().toISOString() };
}

// Solo el administrador: las reglas rechazan la lectura a cualquier otro.
export async function listarCitas(db, maximo = 200) {
  const snap = await getDocs(query(collection(db, 'citas'), orderBy('creadoEn', 'desc'), limit(maximo)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export const cambiarEstadoCita = (db, id, estado) => updateDoc(doc(db, 'citas', id), { estado });
