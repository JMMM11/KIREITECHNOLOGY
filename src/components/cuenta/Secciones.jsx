import { useState } from 'react';
import { Link } from 'wouter';
import Campo from '../ui/Campo.jsx';
import Icono from '../ui/Icono.jsx';
import TarjetaProducto from '../tienda/TarjetaProducto.jsx';
import { ICONOS } from '../iconos.js';
import { errores, validarNombre, validarRequerido, validarTelefono } from '../../lib/validacion.js';
import { fechaCorta, mensajeAuth, validarClave } from '../../lib/cuenta.js';
import { useCuenta } from '../../context/CuentaContext.jsx';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './Cuenta.module.css';

// Mensaje de éxito o error bajo un formulario, anunciado a lectores de pantalla.
function Resultado({ ok, error }) {
  if (error) return <p className="error-campo" role="alert">{error}</p>;
  return ok ? <p className={s.listo} role="status"><Icono de={ICONOS.elegido.de} mov="aparecer" tam={16} />{ok}</p> : null;
}

export function Perfil() {
  const { usuario, perfil, actualizarPerfil } = useCuenta();
  const [f, setF] = useState({ nombre: perfil.nombre, telefono: perfil.telefono ?? '' });
  const [err, setErr] = useState({});
  const [res, setRes] = useState({});
  const [guardando, setGuardando] = useState(false);

  async function guardar(e) {
    e.preventDefault();
    const fallos = errores({ nombre: validarNombre(f.nombre), telefono: f.telefono.trim() ? validarTelefono(f.telefono) : '' });
    setErr(fallos);
    setRes({});
    if (Object.keys(fallos).length) return;
    setGuardando(true);
    try {
      await actualizarPerfil({ nombre: f.nombre.trim(), telefono: f.telefono.trim() });
      setRes({ ok: 'Datos guardados.' });
    } catch { setRes({ error: 'No se pudo guardar. Revisa tu conexión.' }); }
    setGuardando(false);
  }

  return (
    <form className={s.formulario} onSubmit={guardar} noValidate>
      <h2 className={s.seccionTitulo}>Mi perfil</h2>
      <Campo etiqueta="Nombre" autoComplete="name" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} error={err.nombre} />
      <Campo etiqueta="Teléfono" opcional type="tel" autoComplete="tel" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} error={err.telefono} ayuda="Lo usamos para coordinar tus entregas por WhatsApp." />
      <Campo etiqueta="Correo" value={usuario.email} readOnly ayuda="Es tu usuario para entrar. Para cambiarlo, escríbenos." />
      {perfil.creadoEn && <p className="suave chico">Cliente desde el {fechaCorta(perfil.creadoEn)}.</p>}
      <Resultado {...res} />
      <button className="btn btn-marca" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
    </form>
  );
}

export function Favoritos() {
  const { perfil } = useCuenta();
  const { productoPorId, cargando } = useDatos();
  const lista = perfil.favoritos.map(productoPorId).filter(Boolean);
  if (!cargando && lista.length === 0) {
    return (
      <div className={s.vacio}>
        <span className={s.vacioIcono}><Icono de={ICONOS.favorito.de} mov="latido" tam={26} /></span>
        <p className={s.vacioTitulo}>Aún no guardas favoritos.</p>
        <p className="suave">Toca el corazón de un producto para tenerlo a mano aquí.</p>
        <Link href="/tecnologia" className="btn btn-accion">Explorar tecnología</Link>
      </div>
    );
  }
  return (
    <section>
      <h2 className={s.seccionTitulo}>Mis favoritos</h2>
      <ul className={s.favoritos}>
        {lista.map((p) => <li key={p.id} className={s.celda}><TarjetaProducto producto={p} /></li>)}
      </ul>
    </section>
  );
}

const NUEVA = { id: '', etiqueta: 'Casa', detalle: '' };

export function Direcciones() {
  const { perfil, actualizarPerfil } = useCuenta();
  const [editando, setEditando] = useState(null);
  const [err, setErr] = useState('');
  const [res, setRes] = useState({});
  const lista = perfil.direcciones ?? [];

  async function guardarLista(nueva, ok) {
    setRes({});
    try { await actualizarPerfil({ direcciones: nueva }); setRes({ ok }); setEditando(null); } catch { setRes({ error: 'No se pudo guardar. Revisa tu conexión.' }); }
  }

  function guardar(e) {
    e.preventDefault();
    const fallo = validarRequerido(editando.detalle, 'Escribe la dirección: provincia, corregimiento, calle y una referencia.');
    setErr(fallo);
    if (fallo) return;
    const d = { ...editando, detalle: editando.detalle.trim(), id: editando.id || Date.now().toString(36) };
    guardarLista(editando.id ? lista.map((x) => (x.id === d.id ? d : x)) : [...lista, d], 'Dirección guardada.');
  }

  return (
    <section className={s.formulario}>
      <h2 className={s.seccionTitulo}>Mis direcciones</h2>
      <p className="suave">La primera es la principal: la llenamos sola en el checkout.</p>
      {lista.length === 0 && !editando && <p className={s.aviso}>Aún no tienes direcciones guardadas.</p>}
      <ul className={s.lista}>
        {lista.map((d, i) => (
          <li key={d.id} className={s.direccion}>
            <div>
              <p className={s.pedidoNumero}>{d.etiqueta}{i === 0 && <span className={s.principal}>Principal</span>}</p>
              <p className="suave">{d.detalle}</p>
            </div>
            <div className={s.direccionAcciones}>
              {i > 0 && <button type="button" className={s.enlaceBoton} onClick={() => guardarLista([d, ...lista.filter((x) => x.id !== d.id)], 'Dirección principal cambiada.')}>Hacer principal</button>}
              <button type="button" className={s.enlaceBoton} onClick={() => { setEditando(d); setErr(''); }}>Editar</button>
              <button type="button" className={s.enlaceBoton} onClick={() => window.confirm('¿Borrar esta dirección?') && guardarLista(lista.filter((x) => x.id !== d.id), 'Dirección borrada.')}>Borrar</button>
            </div>
          </li>
        ))}
      </ul>
      <Resultado {...res} />
      {editando ? (
        <form className={s.formulario} onSubmit={guardar} noValidate>
          <Campo etiqueta="Nombre de la dirección" como="select" value={editando.etiqueta} onChange={(e) => setEditando({ ...editando, etiqueta: e.target.value })}>
            {['Casa', 'Trabajo', 'Otra'].map((x) => <option key={x}>{x}</option>)}
          </Campo>
          <Campo etiqueta="Dirección" como="textarea" rows={3} autoComplete="street-address" placeholder="Provincia, corregimiento, calle y referencia" value={editando.detalle} onChange={(e) => setEditando({ ...editando, detalle: e.target.value })} error={err} />
          <div className={s.acciones}>
            <button className="btn btn-marca">Guardar dirección</button>
            <button type="button" className="btn btn-fantasma" onClick={() => setEditando(null)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-fantasma" onClick={() => { setEditando(NUEVA); setErr(''); setRes({}); }}>Agregar dirección</button>
      )}
    </section>
  );
}

export function Seguridad() {
  const { cuenta } = useCuenta();
  const [clave, setClave] = useState({ actual: '', nueva: '' });
  const [errClave, setErrClave] = useState({});
  const [resClave, setResClave] = useState({});
  const [borrar, setBorrar] = useState({ clave: '', seguro: false });
  const [resBorrar, setResBorrar] = useState({});
  const [ocupado, setOcupado] = useState('');

  async function cambiar(e) {
    e.preventDefault();
    const fallos = errores({ actual: clave.actual ? '' : 'Escribe tu contraseña actual.', nueva: validarClave(clave.nueva) });
    setErrClave(fallos);
    setResClave({});
    if (Object.keys(fallos).length) return;
    setOcupado('clave');
    try {
      await (await cuenta()).cambiarClave(clave.actual, clave.nueva);
      setClave({ actual: '', nueva: '' });
      setResClave({ ok: 'Contraseña cambiada.' });
    } catch (error) { setResClave({ error: mensajeAuth(error) }); }
    setOcupado('');
  }

  async function eliminar(e) {
    e.preventDefault();
    if (!borrar.seguro || !borrar.clave) { setResBorrar({ error: 'Escribe tu contraseña y marca la casilla para confirmar.' }); return; }
    setOcupado('borrar');
    try { await (await cuenta()).borrarCuenta(borrar.clave); } catch (error) { setResBorrar({ error: mensajeAuth(error) }); setOcupado(''); }
  }

  return (
    <div className={s.formulario}>
      <h2 className={s.seccionTitulo}>Seguridad y privacidad</h2>
      <form className={s.bloque} onSubmit={cambiar} noValidate>
        <h3 className={s.bloqueTitulo}>Cambiar contraseña</h3>
        <Campo etiqueta="Contraseña actual" type="password" autoComplete="current-password" value={clave.actual} onChange={(e) => setClave({ ...clave, actual: e.target.value })} error={errClave.actual} />
        <Campo etiqueta="Contraseña nueva" type="password" autoComplete="new-password" ayuda="Mínimo 8 caracteres." value={clave.nueva} onChange={(e) => setClave({ ...clave, nueva: e.target.value })} error={errClave.nueva} />
        <Resultado {...resClave} />
        <button className="btn btn-marca" disabled={ocupado === 'clave'}>{ocupado === 'clave' ? 'Cambiando...' : 'Cambiar contraseña'}</button>
      </form>

      <div className={s.bloque}>
        <h3 className={s.bloqueTitulo}>Tus datos</h3>
        <p className="suave">Usamos tu nombre, teléfono y dirección solo para tus pedidos. <Link href="/legal/privacidad" className="enlace">Política de privacidad</Link></p>
      </div>

      <details className={s.peligro}>
        <summary>Eliminar mi cuenta</summary>
        <form className={s.formulario} onSubmit={eliminar} noValidate>
          <p className="suave">Se borran tu perfil, direcciones y favoritos. Tus pedidos se conservan para la garantía. No se puede deshacer.</p>
          <Campo etiqueta="Contraseña" type="password" autoComplete="current-password" value={borrar.clave} onChange={(e) => setBorrar({ ...borrar, clave: e.target.value })} />
          <label className={s.casilla}><input type="checkbox" checked={borrar.seguro} onChange={(e) => setBorrar({ ...borrar, seguro: e.target.checked })} /> Entiendo que mi cuenta se borra para siempre.</label>
          <Resultado {...resBorrar} />
          <button className={`btn btn-fantasma ${s.botonPeligro}`} disabled={ocupado === 'borrar'}>{ocupado === 'borrar' ? 'Eliminando...' : 'Eliminar mi cuenta'}</button>
        </form>
      </details>
    </div>
  );
}
