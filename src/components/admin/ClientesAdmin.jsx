import { useEffect, useState } from 'react';
import { fechaCorta } from '../../lib/cuenta.js';
import { normalizarTelefono } from '../../lib/validacion.js';
import { clientes, pedidos } from '../../services/admin.js';
import s from './Admin.module.css';

// Cuentas registradas en la tienda. Las direcciones y los favoritos no se muestran aquí.
export default function ClientesAdmin() {
  const [lista, setLista] = useState(null);
  const [pedidosPorCliente, setPedidosPorCliente] = useState({});
  const [error, setError] = useState('');

  const cargar = () => Promise.all([clientes(), pedidos()])
    .then(([cuentas, todos]) => {
      setLista(cuentas);
      setPedidosPorCliente(todos.reduce((cuenta, p) => (p.uid ? { ...cuenta, [p.uid]: (cuenta[p.uid] ?? 0) + 1 } : cuenta), {}));
      setError('');
    })
    .catch(() => setError('No pudimos leer los clientes. Revisa que las reglas nuevas estén publicadas.'));
  useEffect(() => { cargar(); }, []);

  return (
    <section className={s.seccion}>
      <div className={s.cabecera}>
        <h1 className="titulo">Clientes</h1>
        <button type="button" className="btn btn-fantasma" onClick={cargar}>Actualizar</button>
      </div>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando clientes...</p>}
      {lista?.length === 0 && <p className={s.vacio}>Todavía no hay clientes con cuenta.</p>}
      {lista?.length > 0 && (
        <ul className={s.pedidos}>
          {lista.map((c) => (
            <li key={c.uid} className={s.pedido}>
              <div className={s.pedidoCabeza}>
                <div>
                  <strong>{c.nombre || 'Sin nombre'}</strong>
                  <p className="suave chico">
                    Registrado {fechaCorta(c.creadoEn)} · {pedidosPorCliente[c.uid] ?? 0} {pedidosPorCliente[c.uid] === 1 ? 'pedido' : 'pedidos'}
                  </p>
                </div>
                {c.telefono && <a className="btn btn-fantasma" href={`https://wa.me/507${normalizarTelefono(c.telefono)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
