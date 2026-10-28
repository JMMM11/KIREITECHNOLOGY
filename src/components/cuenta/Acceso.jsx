import { useState } from 'react';
import { useLocation } from 'wouter';
import Campo from '../ui/Campo.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { errores, validarCorreo, validarNombre } from '../../lib/validacion.js';
import { mensajeAuth, validarClave } from '../../lib/cuenta.js';
import { useCuenta } from '../../context/CuentaContext.jsx';
import s from './Cuenta.module.css';

const VENTAJAS = [
  { icono: ICONOS.pedidos, texto: 'Sigue el estado de tus pedidos.' },
  { icono: ICONOS.favorito, texto: 'Guarda tus productos favoritos.' },
  { icono: ICONOS.rapido, texto: 'Compra más rápido con tus datos guardados.' },
];

// Vuelve a donde estaba el cliente (por ejemplo, el producto que quiso guardar).
function volver(navegar) {
  try {
    const destino = sessionStorage.getItem('kirei:volver');
    sessionStorage.removeItem('kirei:volver');
    if (destino && destino.startsWith('/') && !destino.startsWith('/cuenta')) navegar(destino);
  } catch { /* sin almacenamiento: se queda en la cuenta */ }
}

export default function Acceso() {
  const { cuenta, recargarPerfil } = useCuenta();
  const [, navegar] = useLocation();
  const [modo, setModo] = useState('entrar');
  const [f, setF] = useState({ nombre: '', correo: '', clave: '' });
  const [err, setErr] = useState({});
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) => { setF({ ...f, [campo]: e.target.value }); if (err[campo]) setErr({ ...err, [campo]: '' }); };
  const ir = (m) => { setModo(m); setErr({}); setAviso(''); };

  async function entrarCon(proveedor) {
    setEnviando(true);
    try {
      const m = await cuenta();
      await (proveedor === 'google' ? m.entrarGoogle() : m.entrarApple());
      volver(navegar);
    } catch (error) {
      setErr({ general: mensajeAuth(error) });
    }
    setEnviando(false);
  }

  async function enviar(e) {
    e.preventDefault();
    const fallos = errores({
      nombre: modo === 'crear' ? validarNombre(f.nombre) : '',
      correo: validarCorreo(f.correo, { obligatorio: true }),
      clave: modo === 'crear' ? validarClave(f.clave) : modo === 'entrar' && !f.clave ? 'Escribe tu contraseña.' : '',
    });
    setErr(fallos);
    if (Object.keys(fallos).length) return;
    setEnviando(true);
    try {
      const m = await cuenta();
      if (modo === 'recuperar') {
        await m.recuperar(f.correo.trim());
        setAviso('Si hay una cuenta con ese correo, te enviamos un enlace para crear una contraseña nueva.');
      } else {
        if (modo === 'crear') {
          await m.registrar({ nombre: f.nombre.trim(), correo: f.correo.trim(), clave: f.clave });
          await recargarPerfil();
        } else {
          await m.entrar(f.correo.trim(), f.clave);
        }
        volver(navegar);
      }
    } catch (error) {
      setErr({ general: mensajeAuth(error) });
    }
    setEnviando(false);
  }

  const textoBoton = { entrar: 'Entrar a mi cuenta', crear: 'Crear mi cuenta', recuperar: 'Enviar enlace' }[modo];

  return (
    <div className={`contenedor ${s.acceso}`}>
      <div className={s.accesoIntro}>
        <p className={s.etiqueta}>Tu cuenta Kirei</p>
        <h1 className="display">Tus pedidos y favoritos, en un solo lugar.</h1>
        <ul className={s.ventajas}>
          {VENTAJAS.map((v) => (
            <li key={v.texto}><span className={s.ventajaIcono}><Icono de={v.icono.de} mov={v.icono.mov} tam={18} /></span>{v.texto}</li>
          ))}
        </ul>
      </div>

      <form className={s.accesoCaja} onSubmit={enviar} noValidate>
        {modo !== 'recuperar' ? (
          <div className={s.pestanas} role="group" aria-label="¿Ya tienes cuenta?">
            <button type="button" aria-pressed={modo === 'entrar'} className={s.pestana} onClick={() => ir('entrar')}>Entrar</button>
            <button type="button" aria-pressed={modo === 'crear'} className={s.pestana} onClick={() => ir('crear')}>Crear cuenta</button>
          </div>
        ) : (
          <h2 className={s.cajaTitulo}>Recupera tu contraseña</h2>
        )}

        {modo === 'crear' && <Campo etiqueta="Nombre" autoComplete="name" value={f.nombre} onChange={cambiar('nombre')} error={err.nombre} />}
        <Campo etiqueta="Correo" type="email" autoComplete="email" value={f.correo} onChange={cambiar('correo')} error={err.correo} />
        {modo !== 'recuperar' && (
          <Campo
            etiqueta="Contraseña" type="password" value={f.clave} onChange={cambiar('clave')} error={err.clave}
            autoComplete={modo === 'crear' ? 'new-password' : 'current-password'}
            ayuda={modo === 'crear' ? 'Mínimo 8 caracteres.' : undefined}
          />
        )}

        {err.general && <p className="error-campo" role="alert">{err.general}</p>}
        {aviso && <p className={s.aviso} role="status">{aviso}</p>}

        <button className="btn btn-accion btn-bloque" disabled={enviando}>{enviando ? 'Un momento...' : textoBoton}</button>

        {modo !== 'recuperar' && (
          <div className={s.socialSep}><span>o continúa con</span></div>
        )}
        {modo !== 'recuperar' && (
          <div className={s.socialBtns}>
            <button type="button" className={`btn btn-fantasma ${s.socialBtn}`} disabled={enviando} onClick={() => entrarCon('google')}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button type="button" className={`btn btn-fantasma ${s.socialBtn}`} disabled={enviando} onClick={() => entrarCon('apple')}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.39.07 2.35.74 3.16.78 1.21-.24 2.37-.93 3.67-.84 1.57.12 2.75.74 3.51 1.9-3.22 1.94-2.46 5.9.6 7.04-.65 1.44-1.47 2.87-2.94 4zm-3.23-17.45c.06 2.12-1.54 3.83-3.51 3.97-.27-2.07 1.5-3.9 3.51-3.97z"/></svg>
              Apple
            </button>
          </div>
        )}
        {modo === 'entrar' && <button type="button" className={s.enlaceBoton} onClick={() => ir('recuperar')}>Olvidé mi contraseña</button>}
        {modo === 'recuperar' && <button type="button" className={s.enlaceBoton} onClick={() => ir('entrar')}>Volver a entrar</button>}
        {modo === 'crear' && <p className="ayuda">Al crear tu cuenta aceptas que usemos tus datos solo para tus pedidos, según la política de privacidad.</p>}
      </form>
    </div>
  );
}
