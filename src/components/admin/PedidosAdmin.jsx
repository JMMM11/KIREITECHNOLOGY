import { useEffect, useState } from 'react';
import Badge from '../ui/Badge.jsx';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { PASOS_PEDIDO, fechaCorta } from '../../lib/cuenta.js';
import { normalizarTelefono } from '../../lib/validacion.js';
import { ICONOS_ESTADO } from '../iconos.js';
import { actualizarPedido, todosLosPedidos } from '../../services/admin.js';
import s from './Admin.module.css';

const ESTADOS = [...PASOS_PEDIDO, 'cancelado'];

function FilaPedido({ pedido: p, alGuardar }) {
  const [f, setF] = useState({ estado: p.estado, seguimiento: p.seguimiento ?? '' });
  const [msg, setMsg] = useState('');
  const cambiado = f.estado !== p.estado || f.seguimiento !== (p.seguimiento ?? '');

  async function guardar(e) {
    e.preventDefault();
    setMsg('Guardando...');
    try {
      await actualizarPedido(p.id, { estado: f.estado, seguimiento: f.seguimiento.trim() });
      setMsg('Guardado.');
      alGuardar();
    } catch { setMsg('No se pudo guardar.'); }
  }

  return (
    <li className={s.pedido}>
      <div className={s.pedidoCabeza}>
        <div>
          <strong>Pedido {p.numero}</strong>
          <p className="suave chico">
            {fechaCorta(p.creadoEn)} · {p.cliente?.nombre} ·{' '}
            <a href={`https://wa.me/507${normalizarTelefono(p.cliente?.telefono ?? '')}`} target="_blank" rel="noopener noreferrer">{p.cliente?.telefono}</a>
          </p>
        </div>
        <Badge estado={p.estado} />
      </div>
      <p className="chico">
        {p.items.map((it) => `${it.cantidad} x ${it.nombre}${it.varianteNombre ? ` (${it.varianteNombre})` : ''}`).join(', ')} · <strong>{formatoPrecio(p.totalCentavos)}</strong>
      </p>
      {p.cliente?.direccion && <p className="suave chico">Dirección: {p.cliente.direccion}</p>}
      <form className={s.pedidoForm} onSubmit={guardar}>
        <label className={s.pedidoCampo}>
          Estado
          <select className="entrada" value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })}>
            {ESTADOS.map((x) => <option key={x} value={x}>{ICONOS_ESTADO[x].texto}</option>)}
          </select>
        </label>
        <label className={s.pedidoCampo}>
          Nota de seguimiento (la ve el cliente)
          <input className="entrada" value={f.seguimiento} onChange={(e) => setF({ ...f, seguimiento: e.target.value })} placeholder="Ej.: sale hoy por la tarde" />
        </label>
        <button className="btn btn-marca" disabled={!cambiado}>Guardar</button>
        {msg && <span className="chico" role="status">{msg}</span>}
      </form>
    </li>
  );
}

// Pedidos de clientes con cuenta. El estado que se guarda aquí es el que el cliente ve en su seguimiento.
export default function PedidosAdmin() {
  const [lista, setLista] = useState(null);
  const [error, setError] = useState('');
  const cargar = () => todosLosPedidos().then(setLista).catch(() => setError('No pudimos leer los pedidos. Revisa que las reglas nuevas estén publicadas.'));
  useEffect(() => { cargar(); }, []);

  return (
    <section className={s.seccion}>
      <h1 className="titulo">Pedidos</h1>
      <p className="suave">Aquí salen los pedidos de clientes con cuenta. Los demás llegan solo por WhatsApp.</p>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando pedidos...</p>}
      {lista?.length === 0 && <p className={s.vacio}>Todavía no hay pedidos de clientes con cuenta.</p>}
      {lista?.length > 0 && <ul className={s.pedidos}>{lista.map((p) => <FilaPedido key={p.id} pedido={p} alGuardar={cargar} />)}</ul>}
    </section>
  );
}
