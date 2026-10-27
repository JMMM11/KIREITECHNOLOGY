import { useEffect, useState } from 'react';
import Badge from '../ui/Badge.jsx';
import { ICONOS_ESTADO } from '../iconos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { normalizarTelefono } from '../../lib/validacion.js';
import { ESTADOS_PEDIDO, fechaPedido } from '../../lib/pedidos.js';
import { cambiarEstado, pedidos } from '../../services/admin.js';
import s from './Admin.module.css';

const ENTREGA = { retiro: 'Retiro', punto_encuentro: 'Punto de encuentro', domicilio: 'Envío a domicilio' };
const PAGO = { linea: 'En línea', contra_entrega: 'Contra entrega' };
const fecha = (v) => fechaPedido(v)?.toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' }) ?? '';

function Pedido({ p, alCambiar }) {
  const c = p.cliente ?? {};
  return (
    <li className={s.pedido}>
      <details>
        <summary className={s.fila}>
          <span className={s.datos}>
            <strong>{p.id} · {c.nombre}</strong>
            <span className="suave chico">{fecha(p.creadoEn)} · {ENTREGA[p.entrega] ?? p.entrega} · {formatoPrecio(p.totalCentavos)}</span>
          </span>
          <Badge estado={p.estado} />
        </summary>
        <div className={s.detallePedido}>
          <ul className={s.items}>
            {p.items?.map((i, n) => (
              <li key={n}>{i.cantidad} x {i.nombre}{i.varianteNombre ? ` (${i.varianteNombre})` : ''}: {formatoPrecio(i.precioCentavos * i.cantidad)}</li>
            ))}
          </ul>
          <p className="chico">
            Subtotal {formatoPrecio(p.subtotalCentavos)} · Entrega {p.envioCentavos == null ? 'por confirmar' : formatoPrecio(p.envioCentavos)}
            {p.cargoContraEntregaCentavos > 0 && ` · Cargo contra entrega ${formatoPrecio(p.cargoContraEntregaCentavos)}`}
            {' · '}<strong>Total {formatoPrecio(p.totalCentavos)}</strong>
          </p>
          <p className="chico">
            Pago: {PAGO[p.pago] ?? p.pago} · Teléfono: <a href={`https://wa.me/507${normalizarTelefono(c.telefono ?? '')}`} target="_blank" rel="noopener noreferrer">{c.telefono}</a>
            {c.correo && <> · Correo: <a href={`mailto:${c.correo}`}>{c.correo}</a></>}
          </p>
          {c.direccion && <p className="chico">Dirección: {c.direccion}</p>}
          {p.nota && <p className="chico">Nota: {p.nota}</p>}
          <label className={s.cambioEstado}>
            Estado
            <select value={p.estado} onChange={(e) => alCambiar(p.id, e.target.value)}>
              {ESTADOS_PEDIDO.map((e) => <option key={e} value={e}>{ICONOS_ESTADO[e]?.texto ?? e}</option>)}
            </select>
          </label>
        </div>
      </details>
    </li>
  );
}

export default function Pedidos() {
  const [lista, setLista] = useState(null);
  const [filtro, setFiltro] = useState('activos');
  const [error, setError] = useState('');

  const cargar = () => pedidos()
    .then((l) => { setLista(l); setError(''); })
    .catch(() => setError('No pudimos leer los pedidos. Revisa que las reglas de Firestore estén publicadas y tu UID esté en ellas.'));
  useEffect(() => { cargar(); }, []);

  async function alCambiar(id, estado) {
    const antes = lista;
    setLista((l) => l.map((p) => (p.id === id ? { ...p, estado } : p)));
    try {
      await cambiarEstado(id, estado);
      setError('');
    } catch {
      setLista(antes);
      setError(`No se pudo cambiar el estado de ${id}. Revisa tu conexión.`);
    }
  }

  const visibles = (lista ?? []).filter((p) => filtro === 'todos' || (filtro === 'activos' ? !['entregado', 'cancelado'].includes(p.estado) : p.estado === filtro));

  return (
    <section className={s.seccion}>
      <div className={s.cabecera}>
        <h1 className="titulo">Pedidos</h1>
        <div className={s.acciones}>
          <label className={s.cambioEstado}>
            Mostrar
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="activos">Pendientes</option>
              <option value="todos">Todos</option>
              {ESTADOS_PEDIDO.map((e) => <option key={e} value={e}>{ICONOS_ESTADO[e]?.texto ?? e}</option>)}
            </select>
          </label>
          <button type="button" className="btn btn-fantasma" onClick={cargar}>Actualizar</button>
        </div>
      </div>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando pedidos...</p>}
      {lista && visibles.length === 0 && <p className="suave">{lista.length ? 'No hay pedidos con este estado.' : 'Todavía no hay pedidos.'}</p>}
      {visibles.length > 0 && <ul className={s.lista}>{visibles.map((p) => <Pedido key={p.id} p={p} alCambiar={alCambiar} />)}</ul>}
    </section>
  );
}
