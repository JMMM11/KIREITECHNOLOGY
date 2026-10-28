// Cuentas de clientes: sesión, perfil, favoritos, direcciones y pedidos. Se carga solo cuando hace falta.
// Cada cliente solo puede leer y escribir lo suyo: lo exigen las reglas de firestore.rules, no esta pantalla.
import {
  EmailAuthProvider, GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, deleteUser,
  getAuth, onAuthStateChanged, reauthenticateWithCredential, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signOut, updatePassword, updateProfile,
} from 'firebase/auth';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { app, db } from './firebase.js';

const auth = getAuth(app);
const perfilRef = (uid) => doc(db, 'usuarios', uid);

export const vigilar = (fn) => onAuthStateChanged(auth, fn);
export const actual = () => auth.currentUser;
export const entrar = (correo, clave) => signInWithEmailAndPassword(auth, correo, clave);
export const salir = () => signOut(auth);
export const recuperar = (correo) => sendPasswordResetEmail(auth, correo);

// Crea el perfil si es la primera vez que entra con este proveedor.
async function perfilSiNuevo(user) {
  const ref = perfilRef(user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) await setDoc(ref, { nombre: user.displayName ?? '', telefono: '', direcciones: [], favoritos: [], creadoEn: serverTimestamp() });
}

export async function entrarGoogle() {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  await perfilSiNuevo(user);
}

export async function entrarApple() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('name');
  const { user } = await signInWithPopup(auth, provider);
  await perfilSiNuevo(user);
}

export async function registrar({ nombre, correo, clave }) {
  const { user } = await createUserWithEmailAndPassword(auth, correo, clave);
  await updateProfile(user, { displayName: nombre });
  await setDoc(perfilRef(user.uid), { nombre, telefono: '', direcciones: [], favoritos: [], creadoEn: serverTimestamp() });
}

export async function leerPerfil(uid) {
  const d = await getDoc(perfilRef(uid));
  return d.exists() ? d.data() : null;
}

export const guardarPerfil = (uid, datos) => setDoc(perfilRef(uid), datos, { merge: true });
export const marcarFavorito = (uid, id, poner) => setDoc(perfilRef(uid), { favoritos: poner ? arrayUnion(id) : arrayRemove(id) }, { merge: true });

// Cambios delicados piden la contraseña otra vez, como exige Firebase.
async function reautenticar(clave) {
  const u = auth.currentUser;
  await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, clave));
  return u;
}

export async function cambiarClave(actual, nueva) {
  await updatePassword(await reautenticar(actual), nueva);
}

// Los pedidos se conservan: la tienda los necesita para la garantía.
export async function borrarCuenta(clave) {
  const u = await reautenticar(clave);
  await deleteDoc(perfilRef(u.uid));
  await deleteUser(u);
}

export async function guardarPedido(pedido) {
  const ref = await addDoc(collection(db, 'pedidos'), { ...pedido, creadoEn: serverTimestamp() });
  return ref.id;
}

// Sin orderBy en la consulta: así no hace falta un índice compuesto. Se ordena aquí.
export async function misPedidos(uid) {
  const snap = await getDocs(query(collection(db, 'pedidos'), where('uid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.creadoEn?.seconds ?? 0) - (a.creadoEn?.seconds ?? 0));
}
