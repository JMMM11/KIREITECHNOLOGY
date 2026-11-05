// Carga: muchos clientes comprando al mismo tiempo contra el emulador de Firestore (nunca contra la base real).
// Todos suben el mismo contador de pedidos, que es el cuello de botella de la tienda.
// Correr: npx -y firebase-tools@15 emulators:exec --only firestore --project demo-kirei "node tests/carga/pedidos-concurrentes.mjs"
import { deleteApp, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore, terminate } from 'firebase/firestore';
import { armarPedido } from '../../src/lib/pedidos.js';
import { guardarPedido } from '../../src/services/pedidos.js';

const [HOST, PUERTO] = (process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080').split(':');
const pedido = () => armarPedido({
  uid: null, cliente: { nombre: 'Cliente de carga', telefono: '6123 4567', correo: '', direccion: '' }, entrega: 'retiro', pago: 'linea', nota: '',
  items: [{ productoId: 'p1', variante: 'unica', varianteNombre: '', nombre: 'Audífonos', precioCentavos: 2000, cantidad: 1, foto: null }],
  totales: { subtotal: 2000, envio: 0, cargoContraEntrega: 0, total: 2000 },
});
const percentil = (ordenados, p) => ordenados[Math.min(ordenados.length - 1, Math.ceil((p / 100) * ordenados.length) - 1)];

for (const clientes of [10, 25, 50]) {
  await fetch(`http://${HOST}:${PUERTO}/emulator/v1/projects/demo-kirei/databases/(default)/documents`, { method: 'DELETE' });
  // Cada cliente con su propia conexión, como navegadores distintos.
  const apps = Array.from({ length: clientes }, (_, i) => initializeApp({ projectId: 'demo-kirei' }, `carga-${clientes}-${i}`));
  const dbs = apps.map((a) => { const db = getFirestore(a); connectFirestoreEmulator(db, HOST, Number(PUERTO)); return db; });
  const inicio = performance.now();
  const resultados = await Promise.all(dbs.map(async (db) => {
    const t0 = performance.now();
    try { const p = await guardarPedido(db, pedido()); return { ok: true, ms: performance.now() - t0, numero: p.numero }; }
    catch (e) { return { ok: false, ms: performance.now() - t0, error: e.code ?? e.message }; }
  }));
  const total = performance.now() - inicio;
  const ok = resultados.filter((r) => r.ok);
  const ms = ok.map((r) => r.ms).sort((a, b) => a - b);
  const numeros = new Set(ok.map((r) => r.numero));
  console.log(JSON.stringify({
    clientes, exitosos: ok.length, fallidos: clientes - ok.length,
    errores: [...new Set(resultados.filter((r) => !r.ok).map((r) => r.error))],
    numerosRepetidos: ok.length - numeros.size,
    p50: Math.round(percentil(ms, 50) ?? 0), p95: Math.round(percentil(ms, 95) ?? 0), p99: Math.round(percentil(ms, 99) ?? 0),
    pedidosPorSegundo: Number((ok.length / (total / 1000)).toFixed(1)),
  }));
  await Promise.all(apps.map(async (a) => { await terminate(getFirestore(a)); await deleteApp(a); }));
}
