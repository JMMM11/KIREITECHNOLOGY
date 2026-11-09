import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import Logo from '../layout/Logo.jsx';
import Campo from '../ui/Campo.jsx';
import Foto from '../ui/Foto.jsx';
import Cargando from '../ui/Cargando.jsx';
import EditorProducto, { NUEVO } from './EditorProducto.jsx';
import PedidosAdmin from './PedidosAdmin.jsx';
import CitasAdmin from './CitasAdmin.jsx';
import ClientesAdmin from './ClientesAdmin.jsx';
import ComentariosAdmin from './ComentariosAdmin.jsx';
import ResumenAdmin from './ResumenAdmin.jsx';
import InventarioAdmin from './InventarioAdmin.jsx';
import { CATEGORIAS } from '../../data/catalogos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { entrar, esAdmin, importarLocales, salir, sobrantes, todosLosProductos, vigilarSesion } from '../../services/admin.js';
import { SITIO } from '../../data/sitio.js';
import { PRODUCTOS } from '../../data/productos.js';
import s from './Admin.module.css';

const VISTAS = [['resumen', 'Resumen'], ['productos', 'Productos'], ['inventario', 'Inventario'], ['pedidos', 'Pedidos'], ['citas', 'Citas'], ['clientes', 'Clientes'], ['comentarios', 'Comentarios']];
const NOMBRE_CATEGORIA = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c.nombre]));

function Entrar() {
  const [f, setF] = useState({ correo: '', clave: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await entrar(f.correo.trim(), f.clave);
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Correo o contraseña incorrectos.'
        : err.code === 'auth/too-many-requests' ? 'Demasiados intentos. Espera unos minutos.'
        : 'No pudimos iniciar sesión. Revisa tu conexión.');
      setEnviando(false);
    }
  }

  return (
    <form className={s.entrar} onSubmit={enviar}>
      <h1 className="titulo">Entrar al panel</h1>
      <Campo etiqueta="Correo" type="email" autoComplete="username" required value={f.correo} onChange={(e) => setF({ ...f, correo: e.target.value })} />
      <Campo etiqueta="Contraseña" type="password" autoComplete="current-password" required value={f.clave} onChange={(e) => setF({ ...f, clave: e.target.value })} />
      {error && <p className="error-campo" role="alert">{error}</p>}
      <button className="btn btn-marca btn-bloque" disabled={enviando}>{enviando ? 'Entrando...' : 'Entrar'}</button>
    </form>
  );
}

function Productos() {
  const [lista, setLista] = useState(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);
  const [importando, setImportando] = useState(false);

  const cargar = () => todosLosProductos()
    .then((l) => { setLista(l); setError(''); })
    .catch(() => setError('No pudimos leer los productos. Revisa que tu UID esté en las reglas de Firestore.'));
  useEffect(() => { cargar(); }, []);

  async function importar() {
    const ids = (lista ?? []).map((p) => p.id);
    const borrar = (lista ?? []).filter((p) => sobrantes(ids).includes(p.id)).map((p) => p.nombre);
    if (ids.length && !window.confirm(`La tienda quedará con los ${PRODUCTOS.length} productos del archivo del proyecto. Se perderán los cambios hechos aquí en esos productos${borrar.length ? ` y se borrarán: ${borrar.join(', ')}` : ''}. ¿Continuar?`)) return;
    setImportando(true);
    try { await importarLocales(ids); await cargar(); } catch { setError('No se pudieron publicar los productos.'); }
    setImportando(false);
  }

  if (editando) {
    return (
      <EditorProducto
        producto={editando}
        existentes={(lista ?? []).map((p) => p.id)}
        alTerminar={(cambio) => { setEditando(null); if (cambio) cargar(); }}
      />
    );
  }

  return (
    <section className={s.seccion}>
      <div className={s.cabecera}>
        <h1 className="titulo">Productos</h1>
        <div className={s.acciones}>
          {lista?.length > 0 && (
            <button type="button" className="btn btn-fantasma" onClick={importar} disabled={importando}>
              {importando ? 'Publicando...' : 'Publicar catálogo del proyecto'}
            </button>
          )}
          <button type="button" className="btn btn-marca" onClick={() => setEditando(NUEVO)} disabled={!lista}>Nuevo producto</button>
        </div>
      </div>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {lista === null && !error && <p className="suave">Cargando productos...</p>}
      {lista?.length === 0 && (
        <div className={s.vacio}>
          <p>La base de datos está vacía. Copia los productos que ya tiene la tienda para empezar a editarlos.</p>
          <button type="button" className="btn btn-accion" onClick={importar} disabled={importando}>
            {importando ? 'Importando...' : 'Importar productos actuales'}
          </button>
        </div>
      )}
      {lista?.length > 0 && (
        <ul className={s.lista}>
          {lista.map((p) => (
            <li key={p.id} className={s.fila}>
              <span className={s.miniatura}><Foto foto={p.fotos?.[0]} sizes="56px" /></span>
              <span className={s.datos}>
                <strong>{p.nombre}</strong>
                <span className="suave chico">
                  {NOMBRE_CATEGORIA[p.categoriaId] ?? p.categoriaId} · {formatoPrecio(p.precioCentavos)}
                  {p.stock === 0 ? ' · Agotado' : p.stock != null && ` · ${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}`}
                </span>
              </span>
              {p.estado !== 'publicado' && <span className={s.borrador}>Borrador</span>}
              <button type="button" className="btn btn-fantasma" onClick={() => setEditando(p)}>Editar</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Panel de la tienda: sesión con Firebase Auth. La seguridad real está en firestore.rules, no en esta pantalla.
export default function PanelAdmin() {
  const [usuario, setUsuario] = useState(undefined);
  const [admin, setAdmin] = useState(undefined);
  const [vista, setVista] = useState('resumen');
  useEffect(() => vigilarSesion(async (u) => {
    setAdmin(u ? await esAdmin(u.uid) : false);
    setUsuario(u);
  }), []);
  if (usuario === undefined) return <Cargando />;
  // Una cuenta de cliente que llega aquí no ve el panel. Aunque lo forzara, las reglas le negarían los datos.
  if (usuario && !admin) {
    return (
      <div className={s.admin}>
        <div className={`contenedor ${s.entrar}`}>
          <h1 className="titulo">Sin acceso al panel</h1>
          <p className="suave">La cuenta {usuario.email ?? ''} no es administradora. Si trabajas en la tienda, pide al dueño que te dé acceso.</p>
          <Link href="/" className="btn btn-marca">Ir a la tienda</Link>
          <button type="button" className="btn btn-fantasma" onClick={salir}>Salir de esta cuenta</button>
        </div>
      </div>
    );
  }
  const esDuenoTienda = usuario?.uid === SITIO.duenoUid;
  return (
    <div className={s.admin}>
      <header className={s.barra}>
        <div className={`contenedor ${s.barraInterior}`}>
          <Logo variante="claro" alto={32} />
          <span className={s.etiqueta}>Administración</span>
          <Link href="/" className={s.verTienda}>Ver tienda</Link>
          {usuario && <button type="button" className="btn btn-fantasma" onClick={salir}>Salir</button>}
        </div>
        {usuario && (
          <div className={`contenedor ${s.vistas}`} role="group" aria-label="Sección del panel">
            {VISTAS.map(([id, texto]) => (
              <button key={id} type="button" className={s.vista} aria-pressed={vista === id} onClick={() => setVista(id)}>{texto}</button>
            ))}
          </div>
        )}
      </header>
      <main className="contenedor">{!usuario ? <Entrar /> : {
        resumen: <ResumenAdmin ir={setVista} />,
        productos: <Productos />,
        inventario: <InventarioAdmin />,
        pedidos: <PedidosAdmin />,
        citas: <CitasAdmin />,
        clientes: <ClientesAdmin esDuenoTienda={esDuenoTienda} />,
        comentarios: <ComentariosAdmin />,
      }[vista]}</main>
    </div>
  );
}
