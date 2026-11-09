import { Link } from 'wouter';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import Icono from '../components/ui/Icono.jsx';
import { ICONOS } from '../components/iconos.js';
import { SITIO } from '../data/sitio.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Paginas.module.css';

// Todos los canales en un solo lugar. Se atiende por WhatsApp, sin horario fijo.
export default function Contacto() {
  useTituloPagina('Contacto', `Escríbenos por WhatsApp al ${SITIO.telefono} o por Instagram. Tienda en línea desde Panamá Oeste, pagos con Yappy o efectivo.`);
  const canales = [
    { icono: ICONOS.whatsapp, titulo: 'WhatsApp', enlace: SITIO.telefono, texto: 'Pedidos, citas y dudas. Respondemos lo antes posible.', href: `https://wa.me/${SITIO.whatsapp}` },
    ...SITIO.instagram.map((cuenta) => ({ icono: ICONOS.instagram, titulo: 'Instagram', enlace: `@${cuenta}`, texto: 'Novedades y productos nuevos.', href: `https://instagram.com/${cuenta}` })),
    SITIO.correo
      ? { icono: ICONOS.correo, titulo: 'Correo', enlace: SITIO.correo, texto: 'Para lo que prefieras dejar por escrito.', href: `mailto:${SITIO.correo}` }
      : { icono: ICONOS.correo, titulo: 'Correo', texto: 'Correo de la tienda [pendiente]. Por ahora usa WhatsApp.' },
    { icono: ICONOS.ubicacion, titulo: 'Ubicación', texto: `${SITIO.ubicacion}. Sin local abierto al público. ${SITIO.cobertura}` },
  ];

  return (
    <>
      <CabeceraPagina titulo="Contacto." texto="Atendemos por WhatsApp, sin horario fijo." />
      <div className={`contenedor ${s.contactoPagina}`}>
        <ul className={s.canales}>
          {canales.map((c) => (
            <li key={c.titulo} className={s.canal}>
              <Icono de={c.icono.de} mov={c.icono.mov} entrada={false} tam={22} />
              <div>
                <h2 className={s.canalTitulo}>{c.titulo}</h2>
                {c.href && <a href={c.href} target="_blank" rel="noopener noreferrer">{c.enlace}</a>}
                <p className="suave chico">{c.texto}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="suave">
          Antes de escribir, quizá tu duda ya está en <Link href="/ayuda">Ayuda</Link>, en la <Link href="/legal/envios">política de envíos</Link> o
          en la <Link href="/legal/devoluciones">de devoluciones</Link>.
        </p>
      </div>
    </>
  );
}
