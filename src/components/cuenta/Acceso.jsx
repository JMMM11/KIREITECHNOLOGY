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
        {modo === 'entrar' && <button type="button" className={s.enlaceBoton} onClick={() => ir('recuperar')}>Olvidé mi contraseña</button>}
        {modo === 'recuperar' && <button type="button" className={s.enlaceBoton} onClick={() => ir('entrar')}>Volver a entrar</button>}
        {modo === 'crear' && <p className="ayuda">Al crear tu cuenta aceptas que usemos tus datos solo para tus pedidos, según la política de privacidad.</p>}
      </form>
    </div>
  );
}
