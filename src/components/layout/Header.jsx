import { useId, useState } from 'react';
import { Link, useLocation } from 'wouter';
import Logo from './Logo.jsx';
import EnlaceNav from './EnlaceNav.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { SITIO, TARIFAS } from '../../data/sitio.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { useCuenta } from '../../context/CuentaContext.jsx';
import { conFirebase } from '../../services/tienda.js';
import s from './Header.module.css';

function Buscador() {
  const [, navegar] = useLocation();
  const [q, setQ] = useState('');
  const id = useId();
  return (
    <form
      role="search"
      className={s.buscador}
      onSubmit={(e) => { e.preventDefault(); navegar(q.trim() ? `/buscar/${encodeURIComponent(q.trim())}` : '/buscar'); }}
    >
      <label htmlFor={id} className="sr-only">Buscar productos</label>
      <input id={id} type="search" className={s.campo} placeholder="Buscar productos" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <button type="submit" className={s.lupa} aria-label="Buscar">
        <Icono de={ICONOS.buscar.de} mov={ICONOS.buscar.mov} entrada={false} tam={18} />
      </button>
    </form>
  );
}

// Acceso a la cuenta en dos líneas, como el WhatsApp: saludo arriba, destino abajo.
function AccesoCuenta() {
  const { usuario, perfil } = useCuenta();
  if (!conFirebase) return null;
  const nombre = perfil?.nombre?.split(' ')[0];
  return (
    <Link href="/cuenta" className={`${s.acceso} ${s.cuentaAcceso}`} aria-label={usuario ? `Mi cuenta, ${nombre ?? ''}` : 'Entrar o crear cuenta'}>
      <Icono de={ICONOS.cuenta.de} mov={ICONOS.cuenta.mov} entrada={false} tam={22} />
      <span className={s.accesoTexto}>
        <span className={s.accesoMini}>{usuario ? `Hola, ${nombre || 'cliente'}` : 'Hola, inicia sesión'}</span>
        <span className={s.accesoFuerte}>Mi cuenta</span>
      </span>
    </Link>
  );
}

// Dos filas, como las tiendas grandes: arriba logo, buscador y accesos; abajo las secciones.
// En celular el buscador baja a su propia fila y las secciones viven en la barra inferior.
export default function Header() {
  const { articulos, abrir } = useCarrito();
  return (
    <header className={s.header}>
      <div className={`contenedor ${s.barra}`}>
        <Link href="/" className={s.logo} aria-label="Kirei Technology, inicio"><Logo variante="claro" alto={44} /></Link>
        <Buscador />
        <a className={s.acceso} href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={`¿Dudas? Escríbenos por WhatsApp al ${SITIO.telefono}`}>
          <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={22} />
          <span className={s.accesoTexto}>
            <span className={s.accesoMini}>¿Dudas? Escríbenos</span>
            <span className={s.accesoFuerte}>{SITIO.telefono}</span>
          </span>
        </a>
        <AccesoCuenta />
        <button type="button" className={`btn btn-marca ${s.carrito}`} onClick={abrir} aria-haspopup="dialog">
          <Icono de={ICONOS.bolsa.de} mov={ICONOS.bolsa.mov} entrada={false} tam={18} />
          Carrito
          <span className={s.cuenta}>
            <span aria-hidden="true">{articulos}</span>
            <span className="sr-only">, {articulos} {articulos === 1 ? 'artículo' : 'artículos'}</span>
          </span>
        </button>
      </div>
      <div className={s.fila2}>
        <div className={`contenedor ${s.fila2Interior}`}>
          <nav aria-label="Principal">
            <ul className={s.lista}>
              <li><EnlaceNav href="/">Inicio</EnlaceNav></li>
              <li><EnlaceNav href="/tecnologia">Tecnología</EnlaceNav></li>
              <li><EnlaceNav href="/anime">Anime</EnlaceNav></li>
              <li><EnlaceNav href="/reparaciones">Reparaciones</EnlaceNav></li>
              <li><EnlaceNav href="/ayuda">Ayuda</EnlaceNav></li>
            </ul>
          </nav>
          <p className={s.aviso}>Retiro gratis · Envío a domicilio {formatoPrecio(TARIFAS.envioDomicilio)}</p>
        </div>
      </div>
    </header>
  );
}
