import { useEffect, useState } from 'react';
import { fechaCorta } from '../../lib/cuenta.js';
import { normalizarTelefono } from '../../lib/validacion.js';
import { SITIO } from '../../data/sitio.js';
import { admins, clientes, darAcceso, pedidos, quitarAcceso } from '../../services/admin.js';
import s from './Admin.module.css';

// Cuentas registradas en la tienda. Las direcciones y los favoritos no se muestran aquí.
// El dueño da acceso al panel a quien contrate: esa persona crea su cuenta en la tienda y aparece en esta lista.
export default function ClientesAdmin({ esDuenoTienda }) {
  const [lista, setLista] = useState(null);
  const [equipo, setEquipo] = useState([]);
  const [pedidosPorCliente, setPedidosPorCliente] = useState({});
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const cargar = () => Promise.all([clientes(), pedidos(), admins()])
    .then(([cuentas, todos, eq]) => {
      setLista(cuentas);
      setEquipo(eq.map((a) => a.uid));
      setPedidosPorCliente(todos.reduce((cuenta, p) => (p.uid ? { ...cuenta, [p.uid]: (cuenta[p.uid] ?? 0) + 1 } : cuenta), {}));
      setError('');
    })
    .catch(() => setError('No pudimos leer los clientes. Revisa que las reglas nuevas estén publicadas.'));
  useEffect(() => { cargar(); }, []);

  async function cambiarAcceso(c, dar) {
    const quien = c.nombre || c.correo || 'esta cuenta';
    const pregunta = dar
      ? `¿Dar acceso al panel a ${quien}${c.correo ? ` (${c.correo})` : ''}? Podrá ver pedidos, clientes y citas, y editar productos.`
      : `¿Quitar el acceso al panel a ${quien}?`;
    if (!window.confirm(pregunta)) return;
    setMsg('Guardando...');
    try {
      await (dar ? darAcceso(c) : quitarAcceso(c.uid));
      setEquipo((e) => (dar ? [...e, c.uid] : e.filter((u) => u !== c.uid)));
      setMsg(dar ? `${quien} ya tiene acceso al panel.` : `${quien} ya no tiene acceso.`);
    } catch { setMsg('No se pudo guardar. Solo el dueño de la tienda puede cambiar los accesos.'); }
  }

  return (
    <section className={s.seccion}>
      <div className={s.cabecera}>
        <h1 className="titulo">Clientes</h1>
        <button type="button" className="btn btn-fantasma" onClick={cargar}>Actualizar</button>
      </div>
      {esDuenoTienda && <p className="suave chico">Para sumar a alguien al equipo, pídele que cree su cuenta en la tienda y luego pulsa "Dar acceso al panel" en su fila.</p>}
      {msg && <p className="chico" role="status">{msg}</p>}
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando clientes...</p>}
      {lista?.length === 0 && <p className={s.vacio}>Todavía no hay clientes con cuenta.</p>}
      {lista?.length > 0 && (
        <ul className={s.pedidos}>
          {lista.map((c) => {
            const esEquipo = c.uid === SITIO.duenoUid || equipo.includes(c.uid);
            return (
              <li key={c.uid} className={s.pedido}>
                <div className={s.pedidoCabeza}>
                  <div>
                    <strong>{c.nombre || 'Sin nombre'}</strong>
                    {esEquipo && <span className={s.borrador}>{c.uid === SITIO.duenoUid ? 'Dueño' : 'Administrador'}</span>}
                    <p className="suave chico">
                      {c.correo && <>{c.correo} · </>}Registrado {fechaCorta(c.creadoEn)} · {pedidosPorCliente[c.uid] ?? 0} {pedidosPorCliente[c.uid] === 1 ? 'pedido' : 'pedidos'}
                    </p>
                  </div>
                  <div className={s.acciones}>
                    {c.telefono && <a className="btn btn-fantasma" href={`https://wa.me/507${normalizarTelefono(c.telefono)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                    {esDuenoTienda && c.uid !== SITIO.duenoUid && (
                      <button type="button" className={`btn btn-fantasma ${esEquipo ? s.peligro : ''}`} onClick={() => cambiarAcceso(c, !esEquipo)}>
                        {esEquipo ? 'Quitar acceso al panel' : 'Dar acceso al panel'}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
