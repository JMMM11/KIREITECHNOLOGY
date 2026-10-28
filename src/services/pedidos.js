// Pedidos en Firestore. Recibe la base de datos como parámetro para que tests/reglas/ la pruebe contra el emulador.
import { collection, doc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { idPedido, siguienteNumero } from '../lib/pedidos.js';

// Una transacción sube el contador (contadores/pedidos) y crea pedidos/KT-<número>: el número nunca se repite
// aunque dos clientes compren a la vez. firestore.rules exige los dos pasos juntos.
// Si otro cliente tomó el mismo número, Firestore responde permission-denied (las reglas ven el contador ya subido)
// en vez de reintentar solo; por eso se reintenta aquí con el número siguiente.
export async function guardarPedido(db, datos, intentos = 8) {
  const contador = doc(db, 'contadores', 'pedidos');
  for (let i = 1; ; i += 1) {
    try {
      return await runTransaction(db, async (tx) => {
        const actual = await tx.get(contador);
        const numero = siguienteNumero(actual.exists() ? actual.data().ultimo : null);
        const id = idPedido(numero);
        tx.set(doc(db, 'pedidos', id), { ...datos, numero, creadoEn: serverTimestamp() });
        tx.set(contador, { ultimo: numero });
        return { ...datos, id, numero, creadoEn: new Date().toISOString() };
      });
    } catch (e) {
      if (e.code !== 'permission-denied' || i >= intentos) throw e;
      await new Promise((listo) => setTimeout(listo, 50 * i + Math.random() * 100));
    }
  }
}

// Solo el administrador: las reglas rechazan la lectura a cualquier otro.
export async function listarPedidos(db, maximo = 200) {
  const snap = await getDocs(query(collection(db, 'pedidos'), orderBy('numero', 'desc'), limit(maximo)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// El cliente ve el estado y la nota de seguimiento en Mis pedidos.
export const actualizarPedido = (db, id, { estado, seguimiento = '' }) =>
  updateDoc(doc(db, 'pedidos', id), { estado, seguimiento: seguimiento.trim(), actualizadoEn: serverTimestamp() });
