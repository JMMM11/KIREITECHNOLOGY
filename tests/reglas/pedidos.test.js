// Prueba firestore.rules contra el emulador de Firestore. Correr con: npm run test:reglas (necesita Java).
import { after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteApp, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, doc, getDoc, getFirestore, serverTimestamp, setDoc, terminate, updateDoc, writeBatch } from 'firebase/firestore';
import { armarPedido } from '../../src/lib/pedidos.js';
import { cambiarEstadoPedido, guardarPedido, listarPedidos } from '../../src/services/pedidos.js';

const PROYECTO = 'demo-kirei';
const [HOST, PUERTO] = (process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080').split(':');
const ADMIN = 'SiAnST1DF5RATL2pq75ehocMwD73';

const apps = [];
function base(uid) {
  const app = initializeApp({ projectId: PROYECTO }, `prueba-${apps.length}`);
  apps.push(app);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, HOST, Number(PUERTO), uid ? { mockUserToken: { user_id: uid, sub: uid } } : undefined);
  return db;
}

const rechaza = (promesa) => assert.rejects(promesa, (e) => e.code === 'permission-denied');

const ENTRADA = {
  cliente: { nombre: 'Ana Pérez', telefono: '6123 4567', correo: '', direccion: '' },
  entrega: 'retiro', pago: 'linea', nota: '',
  items: [{ productoId: 'lenovo-gm2-pro', nombre: 'Lenovo GM2 Pro', varianteNombre: '', precioCentavos: 2000, cantidad: 2 }],
  totales: { subtotal: 4000, envio: 0, cargoContraEntrega: 0 },
};
const datos = (cambios = {}) => ({ ...armarPedido(ENTRADA), ...cambios });

let cliente, admin;
beforeEach(async () => {
  await fetch(`http://${HOST}:${PUERTO}/emulator/v1/projects/${PROYECTO}/databases/(default)/documents`, { method: 'DELETE' });
  cliente = base(null);
  admin = base(ADMIN);
});
after(async () => {
  await Promise.all(apps.map(async (a) => { await terminate(getFirestore(a)); await deleteApp(a); }));
});

test('el cliente crea pedidos con número consecutivo que empieza en KT-1001', async () => {
  const p1 = await guardarPedido(cliente, datos());
  const p2 = await guardarPedido(cliente, datos());
  assert.equal(p1.id, 'KT-1001');
  assert.equal(p2.id, 'KT-1002');
  const guardado = (await getDoc(doc(admin, 'pedidos', 'KT-1002'))).data();
  assert.equal(guardado.numero, 1002);
  assert.equal(guardado.totalCentavos, 4000);
  assert.equal((await getDoc(doc(cliente, 'contadores', 'pedidos'))).data().ultimo, 1002);
});

test('dos compras a la vez no repiten número', async () => {
  const otro = base(null);
  await guardarPedido(cliente, datos());
  const ids = (await Promise.all([guardarPedido(cliente, datos()), guardarPedido(otro, datos())])).map((p) => p.id).sort();
  assert.deepEqual(ids, ['KT-1002', 'KT-1003']);
});

test('el cliente no puede leer, cambiar ni borrar pedidos', async () => {
  await guardarPedido(cliente, datos());
  await rechaza(getDoc(doc(cliente, 'pedidos', 'KT-1001')));
  await rechaza(listarPedidos(cliente));
  await rechaza(cambiarEstadoPedido(cliente, 'KT-1001', 'entregado'));
  await rechaza(setDoc(doc(cliente, 'pedidos', 'KT-1001'), { ...datos(), numero: 1001, creadoEn: serverTimestamp() }));
});

test('no se puede crear un pedido sin subir el contador, ni saltar o bajar números', async () => {
  await guardarPedido(cliente, datos());
  await rechaza(setDoc(doc(cliente, 'pedidos', 'KT-1002'), { ...datos(), numero: 1002, creadoEn: serverTimestamp() }));
  await rechaza(setDoc(doc(cliente, 'contadores', 'pedidos'), { ultimo: 1 }));
  const salto = writeBatch(cliente);
  salto.set(doc(cliente, 'pedidos', 'KT-1003'), { ...datos(), numero: 1003, creadoEn: serverTimestamp() });
  salto.set(doc(cliente, 'contadores', 'pedidos'), { ultimo: 1003 });
  await rechaza(salto.commit());
});

test('se rechazan pedidos con datos inválidos', async () => {
  const malos = [
    datos({ totalCentavos: 1 }),
    datos({ estado: 'entregado' }),
    datos({ items: [] }),
    datos({ pago: 'regalo' }),
    datos({ extra: true }),
    datos({ cliente: { ...datos().cliente, nombre: 'A' } }),
    datos({ entrega: 'domicilio', envioCentavos: 500, totalCentavos: 4500 }),
  ];
  for (const malo of malos) await rechaza(guardarPedido(cliente, malo, 1));
  assert.equal((await getDoc(doc(cliente, 'contadores', 'pedidos'))).exists(), false);
});

test('el administrador lista pedidos y cambia solo el estado', async () => {
  await guardarPedido(cliente, datos());
  await guardarPedido(cliente, datos());
  assert.deepEqual((await listarPedidos(admin)).map((p) => p.id), ['KT-1002', 'KT-1001']);
  await cambiarEstadoPedido(admin, 'KT-1001', 'confirmado');
  assert.equal((await getDoc(doc(admin, 'pedidos', 'KT-1001'))).data().estado, 'confirmado');
  await rechaza(cambiarEstadoPedido(admin, 'KT-1001', 'perdido'));
  await rechaza(updateDoc(doc(admin, 'pedidos', 'KT-1001'), { totalCentavos: 0 }));
});

test('cinco compras a la vez reciben cinco números distintos', async () => {
  const clientes = [cliente, ...Array.from({ length: 4 }, () => base(null))];
  const ids = (await Promise.all(clientes.map((c) => guardarPedido(c, datos())))).map((p) => p.id).sort();
  assert.deepEqual(ids, ['KT-1001', 'KT-1002', 'KT-1003', 'KT-1004', 'KT-1005']);
});
