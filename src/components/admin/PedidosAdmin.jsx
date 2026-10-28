import { useEffect, useState } from 'react';
import Badge from '../ui/Badge.jsx';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { fechaCorta } from '../../lib/cuenta.js';
import { ESTADOS_PEDIDO, etiquetaPedido } from '../../lib/pedidos.js';
import { normalizarTelefono } from '../../lib/validacion.js';
import { ICONOS_ESTADO } from '../iconos.js';
import { actualizar, pedidos } from '../../services/admin.js';
import s from './Admin.module.css';

const ENTREGA = { retiro: 'Retiro', punto_encuentro: 'Punto de encuentro', domicilio: 'Envío a domicilio' };
const PAGO = { linea: 'En línea', contra_entrega: 'Contra entrega' };
const ACTIVOS = (p) => !['entregado', 'cancelado'].includes(p.estado);

function FilaPedido({ pedido: p, alGuardar }) {
  const [f, setF] = useState({ estado: p.estado, seguimiento: p.seguimiento ?? '' });
  const [msg, setMsg] = useState('');
  const cambiado = f.estado !== p.estado || f.seguimiento !== (p.seguimiento ?? '');
  const c = p.cliente ?? {};

  async function guardar(e) {
    e.preventDefault();
    setMsg('Guardando...');
    try {
      await actualizar(p.id, f);
      setMsg('Guardado.');
      alGuardar(p.id, { ...f, seguimiento: f.seguimiento.trim() });
    } catch { setMsg('No se pudo guardar. Revisa tu conexión.'); }
  }

  return (
    <li className={s.pedido}>
      <div className={s.pedidoCabeza}>
        <div>
          <strong>Pedido {etiquetaPedido(p)} · {c.nombre}</strong>
          <p className="suave chico">
            {fechaCorta(p.creadoEn)} · <a href={`https://wa.me/507${normalizarTelefono(c.telefono ?? '')}`} target="_blank" rel="noopener noreferrer">{c.telefono}</a>
            {c.correo && <> · <a href={`mailto:${c.correo}`}>{c.correo}</a></>}
            {p.uid ? ' · Con cuenta' : ' · Sin cuenta'}
          </p>
        </div>
        <Badge estado={p.estado} />
      </div>
      <ul className={s.items}>
        {p.items?.map((i, n) => (
          <li key={n}>{i.cantidad} x {i.nombre}{i.varianteNombre ? ` (${i.varianteNombre})` : ''}: {formatoPrecio(i.precioCentavos * i.cantidad)}</li>
        ))}
      </ul>
      <p className="chico">
        {ENTREGA[p.entrega] ?? p.entrega} {p.envioCentavos == null ? '(costo por confirmar)' : `(${formatoPrecio(p.envioCentavos)})`}
        {' · '}{PAGO[p.pago] ?? p.pago}
        {p.cargoContraEntregaCentavos > 0 && ` (cargo ${formatoPrecio(p.cargoContraEntregaCentavos)})`}
        {' · '}<strong>Total {formatoPrecio(p.totalCentavos)}</strong>
      </p>
      {c.direccion && <p className="suave chico">Dirección: {c.direccion}</p>}
      {p.nota && <p className="suave chico">Nota del cliente: {p.nota}</p>}
      <form className={s.pedidoForm} onSubmit={guardar}>
        <label className={s.pedidoCampo}>
          Estado
          <select className="entrada" value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })}>
            {ESTADOS_PEDIDO.map((x) => <option key={x} value={x}>{ICONOS_ESTADO[x].texto}</option>)}
          </select>
        </label>
        <label className={s.pedidoCampo}>
          Nota de seguimiento (la ve el cliente con cuenta)
          <input className="entrada" maxLength={300} value={f.seguimiento} onChange={(e) => setF({ ...f, seguimiento: e.target.value })} placeholder="Ej.: sale hoy por la tarde" />
        </label>
        <button className="btn btn-marca" disabled={!cambiado}>Guardar</button>
        {msg && <span className="chico" role="status">{msg}</span>}
      </form>
    </li>
  );
}

// Todos los pedidos, con o sin cuenta. El estado y la nota que se guardan aquí son los que el cliente ve en Mis pedidos.
export default function PedidosAdmin() {
  const [lista, setLista] = useState(null);
  const [filtro, setFiltro] = useState('activos');
  const [error, setError] = useState('');

  const cargar = () => pedidos()
    .then((l) => { setLista(l); setError(''); })
    .catch(() => setError('No pudimos leer los pedidos. Revisa que las reglas nuevas estén publicadas.'));
  useEffect(() => { cargar(); }, []);

  const alGuardar = (id, cambios) => setLista((l) => l.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
  const visibles = (lista ?? []).filter((p) => filtro === 'todos' || (filtro === 'activos' ? ACTIVOS(p) : p.estado === filtro));

  return (
    <section className={s.seccion}>
      <div className={s.cabecera}>
        <h1 className="titulo">Pedidos</h1>
        <div className={s.acciones}>
          <label className={s.filtro}>
            Mostrar
            <select className="entrada" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="activos">Pendientes</option>
              <option value="todos">Todos</option>
              {ESTADOS_PEDIDO.map((e) => <option key={e} value={e}>{ICONOS_ESTADO[e].texto}</option>)}
            </select>
          </label>
          <button type="button" className="btn btn-fantasma" onClick={cargar}>Actualizar</button>
        </div>
      </div>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando pedidos...</p>}
      {lista && visibles.length === 0 && <p className={s.vacio}>{lista.length ? 'No hay pedidos con este estado.' : 'Todavía no hay pedidos.'}</p>}
      {visibles.length > 0 && <ul className={s.pedidos}>{visibles.map((p) => <FilaPedido key={p.id} pedido={p} alGuardar={alGuardar} />)}</ul>}
    </section>
  );
}
