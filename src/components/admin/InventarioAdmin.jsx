import { useEffect, useState } from 'react';
import Foto from '../ui/Foto.jsx';
import Cargando from '../ui/Cargando.jsx';
import { guardarProducto, todosLosProductos } from '../../services/admin.js';
import s from './Admin.module.css';

// Unidades de cada producto en una sola lista. Vacío = sin contar (la tienda no muestra unidades ni bloquea la venta).
function FilaStock({ producto: p, alGuardar }) {
  const [valor, setValor] = useState(p.stock ?? '');
  const [msg, setMsg] = useState('');
  const nuevo = valor === '' ? null : Number(valor);
  const valido = nuevo === null || (Number.isInteger(nuevo) && nuevo >= 0 && nuevo <= 9999);
  const cambiado = nuevo !== (p.stock ?? null);

  async function guardar(e) {
    e.preventDefault();
    if (!valido || !cambiado) return;
    setMsg('Guardando...');
    try {
      await guardarProducto({ ...p, stock: nuevo });
      alGuardar(p.id, nuevo);
      setMsg('Guardado.');
    } catch { setMsg('No se pudo guardar. Revisa tu conexión.'); }
  }

  const estado = p.stock === 0 ? 'Agotado' : p.stock != null && p.stock < 3 ? 'Quedan pocas' : null;
  return (
    <li className={s.fila}>
      <span className={s.miniatura}><Foto foto={p.fotos?.[0]} sizes="56px" /></span>
      <span className={s.datos}>
        <strong>{p.nombre}</strong>
        <span className="suave chico">{estado ?? (p.stock == null ? 'Sin contar' : 'En existencia')}{msg && ` · ${msg}`}</span>
      </span>
      <form className={s.stock} onSubmit={guardar}>
        <label className="sr-only" htmlFor={`stock-${p.id}`}>Unidades de {p.nombre}</label>
        <input id={`stock-${p.id}`} type="number" inputMode="numeric" min="0" max="9999" step="1" value={valor}
          placeholder="Sin contar" aria-invalid={!valido} onChange={(e) => { setValor(e.target.value); setMsg(''); }} />
        <button type="submit" className="btn btn-fantasma" disabled={!valido || !cambiado}>Guardar</button>
      </form>
    </li>
  );
}

export default function InventarioAdmin() {
  const [lista, setLista] = useState(null);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');
  useEffect(() => {
    todosLosProductos().then(setLista).catch(() => setError('No se pudo cargar el inventario. Revisa tu conexión.'));
  }, []);
  if (error) return <p className={s.vacio} role="alert">{error}</p>;
  if (!lista) return <Cargando />;

  const FILTROS = {
    todos: () => true,
    atender: (p) => p.stock != null && p.stock < 3,
    sinContar: (p) => p.stock == null,
  };
  const vista = lista.filter(FILTROS[filtro]).sort((a, b) => (a.stock ?? 1e4) - (b.stock ?? 1e4));
  const actualizar = (id, stock) => setLista((l) => l.map((p) => (p.id === id ? { ...p, stock } : p)));

  return (
    <section className={s.seccion} aria-labelledby="inventario-titulo">
      <div className={s.cabecera}>
        <h1 id="inventario-titulo" className="titulo">Inventario</h1>
        <div className={s.acciones} role="group" aria-label="Filtrar">
          {[['todos', 'Todos'], ['atender', 'Agotados o pocas'], ['sinContar', 'Sin contar']].map(([id, texto]) => (
            <button key={id} type="button" className={s.vista} aria-pressed={filtro === id} onClick={() => setFiltro(id)}>{texto}</button>
          ))}
        </div>
      </div>
      <p className="suave chico">Al confirmar un pedido se descuentan sus unidades y al cancelarlo vuelven. El cliente solo ve el número cuando quedan menos de 3.</p>
      {vista.length === 0 ? <p className={s.vacio}>No hay productos en este filtro.</p> : (
        <ul className={s.lista}>{vista.map((p) => <FilaStock key={p.id} producto={p} alGuardar={actualizar} />)}</ul>
      )}
    </section>
  );
}
