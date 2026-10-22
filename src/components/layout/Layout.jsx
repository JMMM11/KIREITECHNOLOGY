import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import NavMovil from './NavMovil.jsx';
import Carrito from '../tienda/Carrito.jsx';
import s from './Layout.module.css';

export default function Layout({ children }) {
  const [ubicacion] = useLocation();
  const main = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, [ubicacion]);

  return (
    <>
      <a
        href="#contenido"
        className={s.saltar}
        onClick={(e) => { e.preventDefault(); main.current?.focus(); }}
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" ref={main} tabIndex={-1} className={s.main}>
        {children}
      </main>
      <Footer />
      <NavMovil />
      <Carrito />
    </>
  );
}
