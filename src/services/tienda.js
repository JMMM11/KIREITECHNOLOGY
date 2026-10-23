// Única puerta a los datos. Con Firebase configurado (.env.local) lee Firestore; si no, los archivos de data/.
// Los componentes no se enteran de la diferencia.
import { PRODUCTOS } from '../data/productos.js';
import { CATEGORIAS } from '../data/catalogos.js';
import { SITIO } from '../data/sitio.js';
import { ESTADOS_EJEMPLO, PEDIDOS_EJEMPLO } from '../data/productosEjemplo.js';

// El estado lo decide la capa de datos, no el componente.
export function estadoProducto(p) {
  if (p.stock === 0) return 'agotado';
  if (p.precioAntesCentavos != null && p.precioCentavos != null && p.precioAntesCentavos > p.precioCentavos) return 'oferta';
  if (p.stock != null && p.stock <= 3) return 'ultimas';
  if (p.nuevo) return 'nuevo';
  return null;
}

function preparar(p, vistaPrevia) {
  const ejemplo = vistaPrevia ? ESTADOS_EJEMPLO[p.id] : null;
  const base = ejemplo ? { ...p, ...ejemplo, ejemplo: true } : p;
  return { ...base, slug: base.slug ?? base.id, estadoVenta: estadoProducto(base) };
}

export const conFirebase = Boolean(import.meta.env?.VITE_FIREBASE_PROJECT_ID);

// Firebase se descarga solo si está configurado. Una consulta por visita; si falla, se puede reintentar.
let enNube = null;
function publicadosNube() {
  enNube ??= Promise.all([import('./firebase.js'), import('firebase/firestore')])
    .then(([{ db }, { collection, getDocs, query, where }]) => getDocs(query(collection(db, 'productos'), where('estado', '==', 'publicado'))))
    .then((snap) => snap.docs.map((d) => preparar({ id: d.id, ...d.data() }, false)))
    .catch((e) => { enNube = null; throw e; });
  return enNube;
}

const publicados = (vistaPrevia) => PRODUCTOS.filter((p) => p.estado === 'publicado').map((p) => preparar(p, vistaPrevia));
const categoriasVisibles = () => CATEGORIAS.filter((c) => c.visible).sort((a, b) => a.orden - b.orden);

// Datos disponibles al instante mientras son locales, para que la primera vista salga completa.
// Con backend devolverá null y la interfaz mostrará esqueletos.
export function datosIniciales() {
  if (conFirebase) return null;
  return { productos: publicados(SITIO.vistaPrevia), categorias: categoriasVisibles() };
}

export async function listarProductos() {
  return conFirebase ? publicadosNube() : publicados(SITIO.vistaPrevia);
}

export async function listarCategorias() {
  return categoriasVisibles();
}

export async function obtenerProducto(slug) {
  return (await listarProductos()).find((p) => p.slug === slug) ?? null;
}

export async function listarPedidosEjemplo() {
  return SITIO.vistaPrevia ? PEDIDOS_EJEMPLO : [];
}

let consecutivo = 1000;

// Hoy el pedido vive solo en esta sesión. Con backend: guardar en Firestore "pedidos" y que el servidor
// recalcule precios y totales; nunca confiar en los del navegador.
export async function crearPedido({ cliente, entrega, pago, items, totales }) {
  if (!items?.length) throw new Error('El pedido no tiene productos.');
  consecutivo += 1;
  return {
    id: `KT-${consecutivo}`,
    estado: 'recibido',
    creadoEn: new Date().toISOString(),
    cliente, entrega, pago, items,
    subtotalCentavos: totales.subtotal,
    envioCentavos: totales.envio ?? 0,
    totalCentavos: totales.total,
    local: true,
  };
}

// Igual que los pedidos: hoy queda en la sesión; luego irá a la colección "citas".
export async function crearCita(cita) {
  return { ...cita, id: `CT-${Date.now().toString(36).toUpperCase()}`, estado: 'nueva', creadoEn: new Date().toISOString(), local: true };
}
