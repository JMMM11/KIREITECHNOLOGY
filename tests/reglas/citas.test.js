// Prueba las reglas de "citas" contra el emulador de Firestore. Correr con: npm run test:reglas (necesita Java).
import { after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteApp, initializeApp } from 'firebase/app';
import { addDoc, collection, connectFirestoreEmulator, deleteDoc, doc, getDoc, getFirestore, serverTimestamp, terminate, updateDoc } from 'firebase/firestore';
import { datosCita } from '../../src/lib/cita.js';
import { cambiarEstadoCita, guardarCita, listarCitas } from '../../src/services/citas.js';

const PROYECTO = 'demo-kirei';
const [HOST, PUERTO] = (process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080').split(':');
const ADMIN = 'SiAnST1DF5RATL2pq75ehocMwD73';

const apps = [];
function base(uid) {
  const app = initializeApp({ projectId: PROYECTO }, `citas-${apps.length}`);
  apps.push(app);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, Number(PUERTO), uid ? { mockUserToken: { user_id: uid, sub: uid } } : undefined);
  return db;
}

const rechaza = (promesa) => assert.rejects(promesa, (e) => e.code === 'permission-denied');
const datos = (cambios = {}) => ({
  ...datosCita({ nombre: 'Ana Pérez', telefono: '6123 4567', dispositivo: 'Laptop', servicio: 'Limpieza', fechaPreferida: '2026-11-03', detalle: 'No enciende' }),
  ...cambios,
});

let cliente, admin, otro;
beforeEach(async () => {
  await fetch(`http://${HOST}:${PUERTO}/emulator/v1/projects/${PROYECTO}/databases/(default)/documents`, { method: 'DELETE' });
  cliente = base(null);
  admin = base(ADMIN);
  otro = base('cliente-con-cuenta');
});
after(async () => {
  await Promise.all(apps.map(async (a) => { await terminate(getFirestore(a)); await deleteApp(a); }));
});

test('cualquiera agenda una cita y el administrador la ve', async () => {
  const c = await guardarCita(cliente, datos());
  await guardarCita(cliente, datos({ fechaPreferida: '', detalle: '' }));
  const lista = await listarCitas(admin);
  assert.equal(lista.length, 2);
  assert.equal((await getDoc(doc(admin, 'citas', c.id))).data().estado, 'nueva');
});

test('solo el administrador lee, borra o cambia el estado', async () => {
  const c = await guardarCita(cliente, datos());
  await rechaza(listarCitas(cliente));
  await rechaza(listarCitas(otro));
  await rechaza(getDoc(doc(otro, 'citas', c.id)));
  await rechaza(cambiarEstadoCita(cliente, c.id, 'cancelada'));
  await rechaza(deleteDoc(doc(otro, 'citas', c.id)));
  await cambiarEstadoCita(admin, c.id, 'confirmada');
  assert.equal((await getDoc(doc(admin, 'citas', c.id))).data().estado, 'confirmada');
});

test('el administrador solo cambia el estado, y a uno conocido', async () => {
  const c = await guardarCita(cliente, datos());
  await rechaza(updateDoc(doc(admin, 'citas', c.id), { nombre: 'Otro' }));
  await rechaza(cambiarEstadoCita(admin, c.id, 'perdida'));
});

test('se rechazan citas con datos inválidos', async () => {
  const malas = [
    { ...datos(), precio: 0 },
    datos({ estado: 'confirmada' }),
    datos({ nombre: '' }),
    datos({ telefono: '123' }),
    datos({ servicio: '' }),
    datos({ fechaPreferida: 'mañana' }),
    datos({ detalle: 'x'.repeat(1001) }),
  ];
  for (const m of malas) await rechaza(addDoc(collection(cliente, 'citas'), { ...m, creadoEn: serverTimestamp() }));
  await rechaza(addDoc(collection(cliente, 'citas'), { ...datos(), creadoEn: new Date(0) }));
  const { estado, ...sinEstado } = datos();
  await rechaza(addDoc(collection(cliente, 'citas'), { ...sinEstado, creadoEn: serverTimestamp() }));
});
