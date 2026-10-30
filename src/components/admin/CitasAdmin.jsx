import { useEffect, useState } from 'react';
import { fechaCorta } from '../../lib/cuenta.js';
import { ESTADOS_CITA } from '../../lib/cita.js';
import { normalizarTelefono } from '../../lib/validacion.js';
import { citas, estadoCita } from '../../services/admin.js';
import s from './Admin.module.css';

const NOMBRE_ESTADO = { nueva: 'Nueva', confirmada: 'Confirmada', completada: 'Completada', cancelada: 'Cancelada' };
const ACTIVAS = (c) => ['nueva', 'confirmada'].includes(c.estado);
const fechaPreferida = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-PA', { weekday: 'short', day: 'numeric', month: 'short' });

function FilaCita({ cita: c, alCambiar }) {
  const [msg, setMsg] = useState('');

  async function cambiar(estado) {
    setMsg('Guardando...');
    try {
      await estadoCita(c.id, estado);
      alCambiar(c.id, estado);
      setMsg('Guardado.');
    } catch { setMsg('No se pudo guardar. Revisa tu conexión.'); }
  }

  return (
    <li className={s.pedido}>
      <div className={s.pedidoCabeza}>
        <div>
          <strong>{c.nombre} · {c.dispositivo}</strong>
          <p className="suave chico">
            Recibida {fechaCorta(c.creadoEn)} · <a href={`https://wa.me/507${normalizarTelefono(c.telefono ?? '')}`} target="_blank" rel="noopener noreferrer">{c.telefono}</a>
          </p>
        </div>
      </div>
      <p className="chico">
        <strong>{c.servicio}</strong>
        {c.fechaPreferida ? ` · Prefiere el ${fechaPreferida(c.fechaPreferida)}` : ' · Sin fecha preferida'}
      </p>
      {c.detalle && <p className={`suave chico ${s.detalle}`}>{c.detalle}</p>}
      <div className={s.pedidoForm}>
        <label className={s.pedidoCampo}>
          Estado
          <select className="entrada" value={c.estado} onChange={(e) => cambiar(e.target.value)}>
            {ESTADOS_CITA.map((x) => <option key={x} value={x}>{NOMBRE_ESTADO[x]}</option>)}
          </select>
        </label>
        {msg && <span className="chico" role="status">{msg}</span>}
      </div>
    </li>
  );
}

// Citas que agendan los clientes en /reparaciones. El cliente las envía también por WhatsApp; aquí queda el registro.
export default function CitasAdmin() {
  const [lista, setLista] = useState(null);
  const [filtro, setFiltro] = useState('activas');
  const [error, setError] = useState('');

  const cargar = () => citas()
    .then((l) => { setLista(l); setError(''); })
    .catch(() => setError('No pudimos leer las citas. Revisa que las reglas nuevas estén publicadas.'));
  useEffect(() => { cargar(); }, []);

  const alCambiar = (id, estado) => setLista((l) => l.map((c) => (c.id === id ? { ...c, estado } : c)));
  const visibles = (lista ?? []).filter((c) => filtro === 'todas' || (filtro === 'activas' ? ACTIVAS(c) : c.estado === filtro));

  return (
    <section className={s.seccion}>
      <div className={s.cabecera}>
        <h1 className="titulo">Citas de reparación</h1>
        <div className={s.acciones}>
          <label className={s.filtro}>
            Mostrar
            <select className="entrada" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="activas">Pendientes</option>
              <option value="todas">Todas</option>
              {ESTADOS_CITA.map((e) => <option key={e} value={e}>{NOMBRE_ESTADO[e]}</option>)}
            </select>
          </label>
          <button type="button" className="btn btn-fantasma" onClick={cargar}>Actualizar</button>
        </div>
      </div>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando citas...</p>}
      {lista && visibles.length === 0 && <p className={s.vacio}>{lista.length ? 'No hay citas con este estado.' : 'Todavía no hay citas. Las que agenden en Reparaciones aparecerán aquí.'}</p>}
      {visibles.length > 0 && <ul className={s.pedidos}>{visibles.map((c) => <FilaCita key={c.id} cita={c} alCambiar={alCambiar} />)}</ul>}
    </section>
  );
}
