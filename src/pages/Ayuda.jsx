import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import Badge from '../components/ui/Badge.jsx';
import Icono from '../components/ui/Icono.jsx';
import { ICONOS } from '../components/iconos.js';
import { AYUDA } from '../data/textos.js';
import { SITIO } from '../data/sitio.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Paginas.module.css';

// Cada tema es una fila que se abre; la lista misma es el índice. /ayuda/pagos abre "Pagos".
export default function Ayuda({ params = {} }) {
  useTituloPagina('Ayuda');
  const [abierto, setAbierto] = useState(params.seccion ?? null);

  useEffect(() => {
    if (!params.seccion) return;
    setAbierto(params.seccion);
    document.getElementById(params.seccion)?.scrollIntoView({ block: 'start' });
  }, [params.seccion]);

  return (
    <>
      <CabeceraPagina titulo="Ayuda." texto="Toca un tema para ver el detalle." />
      <div className={`contenedor ${s.ayuda}`}>
        <div className={s.temas}>
          {AYUDA.map((a, i) => (
            <details
              key={a.id}
              id={a.id}
              className={s.tema}
              open={abierto === a.id}
              onToggle={(e) => {
                const abierta = e.currentTarget.open;
                setAbierto((x) => (abierta ? a.id : x === a.id ? null : x));
              }}
            >
              <summary className={s.temaFila}>
                <span className={s.temaNumero} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className={s.temaTexto}>
                  <span className={s.temaTitulo}>{a.titulo}</span>
                  <span className={s.temaResumen}>{a.resumen}</span>
                </span>
                <span className={s.temaSigno} aria-hidden="true" />
              </summary>
              <div className={s.temaCuerpo}>
                {a.parrafos.map((p) => <p key={p}>{p}</p>)}
                {a.pasos && (
                  <ol className={s.pasos}>
                    {a.pasos.map((p) => (
                      <li key={p.estado} className={s.paso}><Badge estado={p.estado} /><span>{p.texto}</span></li>
                    ))}
                  </ol>
                )}
              </div>
            </details>
          ))}
        </div>

        <aside className={s.ayudaContacto} aria-labelledby="ayuda-contacto">
          <h2 id="ayuda-contacto" className={s.ayudaContactoTitulo}>¿Sigues con dudas?</h2>
          <p>Escríbenos y te respondemos por WhatsApp.</p>
          <a className="btn btn-accion" href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> {SITIO.telefono}
          </a>
          <p className={s.ayudaLegal}>
            <Link href="/legal/privacidad">Privacidad</Link> · <Link href="/legal/terminos">Términos y condiciones</Link>
          </p>
        </aside>
      </div>
    </>
  );
}
