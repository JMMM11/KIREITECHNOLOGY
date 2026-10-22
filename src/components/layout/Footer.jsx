import { Link } from 'wouter';
import Logo from './Logo.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { SECCIONES } from '../../data/catalogos.js';
import { AYUDA, LEGAL } from '../../data/textos.js';
import { SITIO } from '../../data/sitio.js';
import s from './Footer.module.css';

// Métodos de pago. Los que tienen logo lo muestran (public/pagos); el resto va como texto.
const PAGOS = [{ nombre: SITIO.pagoEnLinea, logo: './pagos/yappy.webp' }, { nombre: 'Efectivo', clase: 'efectivo', icono: ICONOS.pago }];

// Pie claro: marca e Instagram, tienda, ayuda, contacto, métodos de pago y legales abajo.
export default function Footer() {
  return (
    <footer className={s.pie}>
      <div className={`contenedor ${s.rejilla}`}>
        <div className={s.marca}>
          <Logo variante="claro" alto={56} className={s.logo} />
          <p className="suave chico">{SITIO.cobertura}</p>
          <ul className={s.redes}>
            {SITIO.instagram.map((cuenta) => (
              <li key={cuenta}>
                <a href={`https://www.instagram.com/${cuenta}/`} target="_blank" rel="noopener noreferrer" className={s.red}>
                  <Icono de={ICONOS.instagram.de} mov={ICONOS.instagram.mov} entrada={false} tam={18} />
                  <span>@{cuenta}</span>
                  <span className="sr-only"> en Instagram (se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Tienda">
          <h2 className={s.titulo}>Tienda</h2>
          <ul className={s.lista}>
            {SECCIONES.map((sec) => <li key={sec.id}><Link href={sec.ruta}>{sec.nombre}</Link></li>)}
            <li><Link href="/reparaciones">Reparaciones</Link></li>
          </ul>
        </nav>
        <nav aria-label="Ayuda">
          <h2 className={s.titulo}>Ayuda</h2>
          <ul className={s.lista}>
            {AYUDA.map((a) => <li key={a.id}><Link href={`/ayuda/${a.id}`}>{a.titulo}</Link></li>)}
          </ul>
        </nav>
        <div className={s.contacto}>
          <h2 className={s.titulo}>Contacto</h2>
          <a className="btn btn-marca" href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} />{SITIO.telefono}
          </a>
          <p className="suave chico">{SITIO.ubicacion}{SITIO.ubicacionPendiente && ' [pendiente de confirmar]'}</p>
          <h2 className={`${s.titulo} ${s.tituloPagos}`}>Métodos de pago</h2>
          <ul className={s.pagos}>
            {PAGOS.map((p) => (
              <li key={p.nombre} className={`${s.pago} ${p.clase ? s[p.clase] : ''}`}>
                {p.logo ? <img src={p.logo} alt={p.nombre} width="88" height="22" /> : (
                  <>{p.icono && <Icono de={p.icono.de} mov={p.icono.mov} entrada={false} tam={18} />}{p.nombre}</>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="contenedor">
        <div className={s.base}>
          <p>© {new Date().getFullYear()} {SITIO.nombre}</p>
          <nav aria-label="Legal">
            <ul className={s.legales}>
              {LEGAL.map((d) => <li key={d.id}><Link href={`/legal/${d.id}`}>{d.titulo}</Link></li>)}
            </ul>
          </nav>
          {SITIO.vistaPrevia && <p className={s.aviso}>Vista previa: algunos estados son de ejemplo.</p>}
        </div>
      </div>
    </footer>
  );
}
