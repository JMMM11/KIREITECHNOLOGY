// Prueba las reglas de "comentarios" y la lectura de "usuarios" por el administrador. Correr con: npm run test:reglas (necesita Java).
import { after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteApp, initializeApp } from 'firebase/app';
import { addDoc, collection, connectFirestoreEmulator, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, terminate, updateDoc } from 'firebase/firestore';
import { borrarComentariosDe, comentariosPublicados, cambiarEstadoComentario, enviarComentario, listarComentarios } from '../../src/services/comentarios.js';

const PROYECTO = 'demo-kirei';
const [HOST, PUERTO] = (process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080').split(':');
const ADMIN = 'SiAnST1DF5RATL2pq75ehocMwD73';
const PRODUCTO = 'audifonos-x';

const apps = [];
function base(uid) {
  const app = initializeApp({ projectId: PROYECTO }, `comentarios-${apps.length}`);
  apps.push(app);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, Number(PUERTO), uid ? { mockUserToken: { user_id: uid, sub: uid } } : undefined);
  return db;
}

const rechaza = (promesa) => assert.rejects(promesa, (e) => e.code === 'permission-denied');
const datos = (cambios = {}) => ({ productoId: PRODUCTO, uid: 'cliente-1', nombre: 'Ana P.', texto: 'Muy buenos', ...cambios });

let anonimo, cliente, otro, admin;
beforeEach(async () => {
  await fetch(`http://${HOST}:${PUERTO}/emulator/v1/projects/${PROYECTO}/databases/(default)/documents`, { method: 'DELETE' });
  anonimo = base(null);
  cliente = base('cliente-1');
  otro = base('cliente-2');
  admin = base(ADMIN);
});
after(async () => {
  await Promise.all(apps.map(async (a) => { await terminate(getFirestore(a)); await deleteApp(a); }));
});

test('un cliente con cuenta comenta; nace pendiente y no se ve en público', async () => {
  const ref = await enviarComentario(cliente, datos());
  assert.equal((await getDoc(doc(cliente, 'comentarios', ref.id))).data().estado, 'pendiente');
  assert.deepEqual(await comentariosPublicados(anonimo, PRODUCTO), []);
});

test('sin cuenta no se puede comentar, ni firmar como otro', async () => {
  await rechaza(enviarComentario(anonimo, datos({ uid: 'cliente-1' })));
  await rechaza(enviarComentario(cliente, datos({ uid: 'cliente-2' })));
  await rechaza(enviarComentario(cliente, datos({ texto: '' })));
  await rechaza(enviarComentario(cliente, datos({ texto: 'x'.repeat(501) })));
  await rechaza(addDoc(collection(cliente, 'comentarios'), { ...datos(), estado: 'publicado', creadoEn: serverTimestamp() }));
});

test('el administrador publica u oculta; el público solo ve los publicados', async () => {
  const uno = await enviarComentario(cliente, datos({ texto: 'Primero' }));
  const dos = await enviarComentario(cliente, datos({ texto: 'Segundo' }));
  await cambiarEstadoComentario(admin, uno.id, 'publicado');
  await cambiarEstadoComentario(admin, dos.id, 'oculto');
  const publicos = await comentariosPublicados(anonimo, PRODUCTO);
  assert.deepEqual(publicos.map((c) => c.texto), ['Primero']);
  assert.equal((await listarComentarios(admin)).length, 2);
});

test('ni el autor ni otro cliente pueden publicar o editar el texto', async () => {
  const c = await enviarComentario(cliente, datos());
  await rechaza(cambiarEstadoComentario(cliente, c.id, 'publicado'));
  await rechaza(cambiarEstadoComentario(otro, c.id, 'publicado'));
  await rechaza(updateDoc(doc(admin, 'comentarios', c.id), { texto: 'Cambiado' }));
  await rechaza(updateDoc(doc(admin, 'comentarios', c.id), { estado: 'pendiente' }));
  await rechaza(getDocs(collection(otro, 'comentarios')));
});

test('el autor borra sus comentarios; otro cliente no', async () => {
  const c = await enviarComentario(cliente, datos());
  await enviarComentario(cliente, datos({ productoId: 'otro-producto' }));
  await rechaza(deleteDoc(doc(otro, 'comentarios', c.id)));
  await borrarComentariosDe(cliente, 'cliente-1');
  assert.equal((await listarComentarios(admin)).length, 0);
});

test('solo el administrador lee la lista de clientes', async () => {
  await setDoc(doc(cliente, 'usuarios', 'cliente-1'), { nombre: 'Ana Pérez', telefono: '6123 4567', direcciones: [], favoritos: [], creadoEn: serverTimestamp() });
  const lista = await getDocs(collection(admin, 'usuarios'));
  assert.equal(lista.size, 1);
  await rechaza(getDocs(collection(cliente, 'usuarios')));
  await rechaza(getDocs(collection(anonimo, 'usuarios')));
});
