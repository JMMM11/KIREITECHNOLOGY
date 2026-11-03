import { useEffect, useState } from 'react';
import { fechaCorta } from '../../lib/cuenta.js';
import { comentarios, eliminarComentario, estadoComentario, todosLosProductos } from '../../services/admin.js';
import s from './Admin.module.css';

const NOMBRE_ESTADO = { pendiente: 'Pendiente', publicado: 'Publicado', oculto: 'Oculto' };

function FilaComentario({ comentario: c, nombreProducto, alCambiar, alBorrar }) {
  const [msg, setMsg] = useState('');

  async function cambiar(estado) {
    setMsg('Guardando...');
    try {
      await estadoComentario(c.id, estado);
      alCambiar(c.id, estado);
      setMsg('Guardado.');
    } catch { setMsg('No se pudo guardar. Revisa tu conexión.'); }
  }

  async function borrar() {
    if (!window.confirm('¿Borrar este comentario? No se puede deshacer.')) return;
    try {
      await eliminarComentario(c.id);
      alBorrar(c.id);
    } catch { setMsg('No se pudo borrar. Revisa tu conexión.'); }
  }

  return (
    <li className={s.pedido}>
      <div className={s.pedidoCabeza}>
        <div>
          <strong>{c.nombre}</strong> <span className="suave chico">sobre {nombreProducto}</span>
          <p className="suave chico">{fechaCorta(c.creadoEn)} · {NOMBRE_ESTADO[c.estado]}</p>
        </div>
      </div>
      <p className="chico">{c.texto}</p>
      <div className={s.pedidoForm}>
        {c.estado !== 'publicado' && <button type="button" className="btn btn-marca" onClick={() => cambiar('publicado')}>Publicar</button>}
        {c.estado !== 'oculto' && <button type="button" className="btn btn-fantasma" onClick={() => cambiar('oculto')}>Ocultar</button>}
        <button type="button" className={`btn btn-fantasma ${s.peligro}`} onClick={borrar}>Borrar</button>
        {msg && <span className="chico" role="status">{msg}</span>}
      </div>
    </li>
  );
}

// Comentarios de clientes con cuenta. Los nuevos llegan pendientes: se publican solo si los revisas.
export default function ComentariosAdmin() {
  const [lista, setLista] = useState(null);
  const [nombres, setNombres] = useState({});
  const [filtro, setFiltro] = useState('pendiente');
  const [error, setError] = useState('');

  const cargar = () => Promise.all([comentarios(), todosLosProductos()])
    .then(([todos, productos]) => {
      setLista(todos);
      setNombres(Object.fromEntries(productos.map((p) => [p.id, p.nombre])));
      setError('');
    })
    .catch(() => setError('No pudimos leer los comentarios. Revisa que las reglas nuevas estén publicadas.'));
  useEffect(() => { cargar(); }, []);

  const alCambiar = (id, estado) => setLista((l) => l.map((c) => (c.id === id ? { ...c, estado } : c)));
  const alBorrar = (id) => setLista((l) => l.filter((c) => c.id !== id));
  const visibles = (lista ?? []).filter((c) => filtro === 'todos' || c.estado === filtro);

  return (
    <section className={s.seccion}>
      <div className={s.cabecera}>
        <h1 className="titulo">Comentarios</h1>
        <div className={s.acciones}>
          <label className={s.filtro}>
            Mostrar
            <select className="entrada" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="pendiente">Pendientes</option>
              <option value="publicado">Publicados</option>
              <option value="oculto">Ocultos</option>
              <option value="todos">Todos</option>
            </select>
          </label>
          <button type="button" className="btn btn-fantasma" onClick={cargar}>Actualizar</button>
        </div>
      </div>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando comentarios...</p>}
      {lista && visibles.length === 0 && <p className={s.vacio}>No hay comentarios con este estado.</p>}
      {visibles.length > 0 && (
        <ul className={s.pedidos}>
          {visibles.map((c) => (
            <FilaComentario key={c.id} comentario={c} nombreProducto={nombres[c.productoId] ?? c.productoId} alCambiar={alCambiar} alBorrar={alBorrar} />
          ))}
        </ul>
      )}
    </section>
  );
}
