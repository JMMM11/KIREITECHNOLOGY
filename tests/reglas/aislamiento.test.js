// Aislamiento entre cuentas y escalada de permisos, contra el emulador. Correr con: npm run test:reglas (necesita Java).
// Cada prueba usa cuentas de mentira independientes y hace lo que alguien podría hacer desde la consola del navegador.
import { after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteApp, initializeApp } from 'firebase/app';
import {
  collection, connectFirestoreEmulator, deleteDoc, doc, getDoc, getDocs, getFirestore, query, serverTimestamp,
  setDoc, terminate, updateDoc, where,
} from 'firebase/firestore';
import { armarPedido } from '../../src/lib/pedidos.js';
import { guardarPedido } from '../../src/services/pedidos.js';

const PROYECTO = 'demo-kirei';
const [HOST, PUERTO] = (process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080').split(':');
const DUENO = 'SiAnST1DF5RATL2pq75ehocMwD73';

const apps = [];
function base(uid, email) {
  const app = initializeApp({ projectId: PROYECTO }, `aislamiento-${apps.length}`);
  apps.push(app);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, Number(PUERTO), uid ? { mockUserToken: { user_id: uid, sub: uid, email } } : undefined);
  return db;
}

const rechaza = (promesa) => assert.rejects(promesa, (e) => e.code === 'permission-denied');
const perfil = (cambios = {}) => ({ nombre: 'Ana Pérez', telefono: '6123 4567', direcciones: [], favoritos: [], creadoEn: serverTimestamp(), ...cambios });
const pedido = (uid) => armarPedido({
  uid, cliente: { nombre: 'Ana Pérez', telefono: '6123 4567', correo: '', direccion: '' }, entrega: 'retiro', pago: 'linea', nota: '',
  items: [{ productoId: 'p1', variante: 'unica', varianteNombre: '', nombre: 'Audífonos', precioCentavos: 2000, cantidad: 1, foto: null }],
  totales: { subtotal: 2000, envio: 0, cargoContraEntrega: 0, total: 2000 },
});

let anonimo, ana, beto, dueno, empleado;
beforeEach(async () => {
  await fetch(`http://${HOST}:${PUERTO}/emulator/v1/projects/${PROYECTO}/databases/(default)/documents`, { method: 'DELETE' });
  anonimo = base(null);
  ana = base('ana', 'ana@ejemplo.com');
  beto = base('beto', 'beto@ejemplo.com');
  dueno = base(DUENO, 'dueno@ejemplo.com');
  empleado = base('empleado', 'empleado@ejemplo.com');
});
after(async () => {
  await Promise.all(apps.map(async (a) => { await terminate(getFirestore(a)); await deleteApp(a); }));
});

test('un cliente no lee, cambia ni borra el perfil de otro', async () => {
  await setDoc(doc(ana, 'usuarios', 'ana'), perfil({ correo: 'ana@ejemplo.com' }));
  await rechaza(getDoc(doc(beto, 'usuarios', 'ana')));
  await rechaza(setDoc(doc(beto, 'usuarios', 'ana'), perfil({ nombre: 'Hackeado' })));
  await rechaza(updateDoc(doc(beto, 'usuarios', 'ana'), { telefono: '6000 0000' }));
  await rechaza(deleteDoc(doc(beto, 'usuarios', 'ana')));
  await rechaza(getDocs(collection(beto, 'usuarios')));
  await rechaza(getDocs(collection(anonimo, 'usuarios')));
});

test('nadie se hace admin editando su propia cuenta', async () => {
  await rechaza(setDoc(doc(ana, 'usuarios', 'ana'), perfil({ rol: 'admin' })));
  await rechaza(setDoc(doc(ana, 'usuarios', 'ana'), perfil({ admin: true })));
  await rechaza(setDoc(doc(ana, 'admins', 'ana'), { nombre: 'Ana', correo: 'ana@ejemplo.com', agregadoEn: serverTimestamp() }));
  await rechaza(setDoc(doc(empleado, 'admins', 'empleado'), { nombre: '', correo: '', agregadoEn: serverTimestamp() }));
  // Su propio registro de acceso sí lo puede consultar (así la tienda sabe que no es admin) y no existe.
  assert.equal((await getDoc(doc(ana, 'admins', 'ana'))).exists(), false);
  await rechaza(getDocs(collection(ana, 'pedidos')));
});

test('el correo del perfil solo puede ser el de la propia sesión', async () => {
  await rechaza(setDoc(doc(ana, 'usuarios', 'ana'), perfil({ correo: 'dueno@ejemplo.com' })));
  await setDoc(doc(ana, 'usuarios', 'ana'), perfil({ correo: 'ana@ejemplo.com' }));
});

test('el dueño da acceso al panel; el admin nuevo trabaja pero no reparte accesos', async () => {
  await setDoc(doc(dueno, 'admins', 'empleado'), { nombre: 'Empleado', correo: 'empleado@ejemplo.com', agregadoEn: serverTimestamp() });
  const p = await guardarPedido(ana, pedido('ana'));
  assert.equal((await getDocs(collection(empleado, 'pedidos'))).size, 1);
  await updateDoc(doc(empleado, 'pedidos', p.id), { estado: 'confirmado', seguimiento: '', actualizadoEn: serverTimestamp() });
  await rechaza(setDoc(doc(empleado, 'admins', 'beto'), { nombre: 'Beto', correo: '', agregadoEn: serverTimestamp() }));
  await rechaza(deleteDoc(doc(empleado, 'admins', 'empleado')));
  await rechaza(updateDoc(doc(empleado, 'admins', 'empleado'), { nombre: 'Otro' }));
});

test('al quitarle el acceso, el ex admin ya no lee pedidos ni clientes', async () => {
  await setDoc(doc(dueno, 'admins', 'empleado'), { nombre: '', correo: '', agregadoEn: serverTimestamp() });
  await guardarPedido(ana, pedido('ana'));
  assert.equal((await getDocs(collection(empleado, 'pedidos'))).size, 1);
  await deleteDoc(doc(dueno, 'admins', 'empleado'));
  await rechaza(getDocs(collection(empleado, 'pedidos')));
  await rechaza(getDocs(collection(empleado, 'usuarios')));
});

test('un cliente no ve pedidos ajenos cambiando el id o el filtro', async () => {
  const deAna = await guardarPedido(ana, pedido('ana'));
  await rechaza(getDoc(doc(beto, 'pedidos', deAna.id)));
  await rechaza(getDocs(query(collection(beto, 'pedidos'), where('uid', '==', 'ana'))));
  await rechaza(updateDoc(doc(ana, 'pedidos', deAna.id), { estado: 'entregado', seguimiento: '', actualizadoEn: serverTimestamp() }));
  await rechaza(deleteDoc(doc(ana, 'pedidos', deAna.id)));
  // Firmar un pedido a nombre de otra cuenta tampoco.
  await rechaza(guardarPedido(beto, pedido('ana'), 1));
});

test('un cliente no cambia precios ni ve borradores', async () => {
  await setDoc(doc(dueno, 'productos', 'p1'), { nombre: 'Audífonos', precioCentavos: 2000, estado: 'publicado' });
  await setDoc(doc(dueno, 'productos', 'p2'), { nombre: 'Secreto', precioCentavos: 100, estado: 'borrador' });
  await rechaza(updateDoc(doc(ana, 'productos', 'p1'), { precioCentavos: 1 }));
  await rechaza(setDoc(doc(ana, 'productos', 'nuevo'), { nombre: 'Falso', estado: 'publicado' }));
  await rechaza(getDoc(doc(ana, 'productos', 'p2')));
  assert.equal((await getDoc(doc(anonimo, 'productos', 'p1'))).data().precioCentavos, 2000);
});
