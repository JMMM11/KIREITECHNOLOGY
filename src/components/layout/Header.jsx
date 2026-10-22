import { useId, useState } from 'react';
import { Link, useLocation } from 'wouter';
import Logo from './Logo.jsx';
import EnlaceNav from './EnlaceNav.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { useCarrito } from '../../context/CarritoContext.jsx';
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
      <span className={s.lupa}><Icono de={ICONOS.buscar.de} mov={ICONOS.buscar.mov} entrada={false} tam={18} /></span>
      <input id={id} type="search" className={s.campo} placeholder="Buscar productos" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
    </form>
  );
}

// Cabecera clara: logo, dos secciones (Tecnología y Anime), reparaciones, buscador y carrito.
export default function Header() {
  const { articulos, abrir } = useCarrito();
  return (
    <header className={s.header}>
      <div className={`contenedor ${s.barra}`}>
        <Link href="/" className={s.logo} aria-label="Kirei Technology, inicio"><Logo variante="claro" alto={44} /></Link>
        <nav aria-label="Principal" className={s.nav}>
          <ul className={s.lista}>
            <li><EnlaceNav href="/">Inicio</EnlaceNav></li>
            <li><EnlaceNav href="/tecnologia">Tecnología</EnlaceNav></li>
            <li><EnlaceNav href="/anime">Anime</EnlaceNav></li>
            <li><EnlaceNav href="/reparaciones">Reparaciones</EnlaceNav></li>
          </ul>
        </nav>
        <Buscador />
        <Link href="/buscar" className={s.buscarMovil} aria-label="Buscar productos">
          <Icono de={ICONOS.buscar.de} mov={ICONOS.buscar.mov} entrada={false} tam={22} />
        </Link>
        <button type="button" className={`btn btn-marca ${s.carrito}`} onClick={abrir} aria-haspopup="dialog">
          <Icono de={ICONOS.bolsa.de} mov={ICONOS.bolsa.mov} entrada={false} tam={18} />
          Carrito
          <span className={s.cuenta}>
            <span aria-hidden="true">{articulos}</span>
            <span className="sr-only">, {articulos} {articulos === 1 ? 'artículo' : 'artículos'}</span>
          </span>
        </button>
      </div>
    </header>
  );
}
