import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import Icono from '../ui/Icono.jsx';
import Modal from '../ui/Modal.jsx';
import { esActivo } from './EnlaceNav.jsx';
import { ICONOS, ICONOS_NAV } from '../iconos.js';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { SITIO } from '../../data/sitio.js';
import s from './NavMovil.module.css';

const MAS = [
  { href: '/cuenta', texto: 'Mi cuenta: pedidos y favoritos', icono: ICONOS.cuenta },
  { href: '/reparaciones', texto: 'Reparaciones', icono: ICONOS.laptop },
  { href: '/ayuda', texto: 'Ayuda: garantía, entregas y pagos', icono: ICONOS.ayuda },
  { href: '/buscar', texto: 'Buscar productos', icono: ICONOS.buscar },
];

function Item({ href, texto, icono, activo }) {
  const I = activo ? icono.lleno : icono.de;
  return (
    <Link href={href} className={s.item} aria-current={activo ? 'page' : undefined}>
      <Icono de={I} mov={icono.mov} entrada={false} tam={22} />
      <span>{texto}</span>
    </Link>
  );
}

// Barra inferior fija en el teléfono con las dos secciones de la tienda siempre a mano.
export default function NavMovil() {
  const [ubicacion] = useLocation();
  const { articulos, abrir } = useCarrito();
  const [mas, setMas] = useState(false);

  return (
    <>
      <nav className={s.barra} aria-label="Navegación principal del teléfono">
        <Item href="/" texto="Inicio" icono={ICONOS_NAV.inicio} activo={ubicacion === '/'} />
        <Item href="/tecnologia" texto="Tecnología" icono={ICONOS_NAV.tecnologia} activo={esActivo(ubicacion, '/tecnologia')} />
        <Item href="/anime" texto="Anime" icono={ICONOS_NAV.anime} activo={esActivo(ubicacion, '/anime')} />
        <button type="button" className={s.item} onClick={abrir} aria-haspopup="dialog">
          <span className={s.conCuenta}>
            <Icono de={ICONOS_NAV.carrito.de} mov={ICONOS_NAV.carrito.mov} entrada={false} tam={22} />
            {articulos > 0 && <span className={s.cuenta} aria-hidden="true">{articulos}</span>}
          </span>
          <span>Carrito<span className="sr-only">, {articulos} {articulos === 1 ? 'artículo' : 'artículos'}</span></span>
        </button>
        <button type="button" className={s.item} onClick={() => setMas(true)} aria-haspopup="dialog">
          <Icono de={ICONOS_NAV.mas.de} mov={ICONOS_NAV.mas.mov} entrada={false} tam={22} />
          <span>Más</span>
        </button>
      </nav>
      <Modal abierto={mas} onCerrar={() => setMas(false)} titulo="Más" lado="abajo">
        <ul className={s.lista}>
          {MAS.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className={s.opcion} onClick={() => setMas(false)}>
                <Icono de={m.icono.de} mov={m.icono.mov} entrada={false} />{m.texto}
              </Link>
            </li>
          ))}
          <li>
            <a className={s.opcion} href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} />Escríbenos por WhatsApp
            </a>
          </li>
        </ul>
      </Modal>
    </>
  );
}
