import { useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import PortadaReparaciones from '../components/reparaciones/PortadaReparaciones.jsx';
import ListaServicios from '../components/reparaciones/ListaServicios.jsx';
import Campo from '../components/ui/Campo.jsx';
import Icono from '../components/ui/Icono.jsx';
import { ICONOS } from '../components/iconos.js';
import { SERVICIOS } from '../data/servicios.js';
import { DISPOSITIVOS } from '../data/catalogos.js';
import { SITIO } from '../data/sitio.js';
import { errores, validarNombre, validarRequerido, validarTelefono } from '../lib/validacion.js';
import { crearCita } from '../services/tienda.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Paginas.module.css';

const hoy = () => new Date().toISOString().slice(0, 10);

function textoCita(c) {
  return [
    'Hola Kirei, quiero agendar una cita de reparación.',
    `Dispositivo: ${c.dispositivo}`,
    `Servicio: ${c.servicio}`,
    c.fechaPreferida ? `Fecha preferida: ${c.fechaPreferida}` : null,
    c.detalle.trim() ? `Detalle: ${c.detalle.trim()}` : null,
    '',
    `Nombre: ${c.nombre.trim()}`,
    `Teléfono: ${c.telefono.trim()}`,
  ].filter((x) => x !== null).join('\n');
}

export default function Reparaciones() {
  useTituloPagina('Reparación de computadoras');
  const [f, setF] = useState({ nombre: '', telefono: '', dispositivo: '', servicio: '', fechaPreferida: '', detalle: '', acepto: false });
  const [err, setErr] = useState({});
  const [enviada, setEnviada] = useState(null);
  const formulario = useRef(null);

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setF((x) => ({ ...x, [campo]: valor }));
    if (err[campo]) setErr((x) => ({ ...x, [campo]: '' }));
  };

  const validar = () => {
    const fallos = errores({
      nombre: validarNombre(f.nombre),
      telefono: validarTelefono(f.telefono),
      dispositivo: validarRequerido(f.dispositivo, 'Elige el tipo de equipo.'),
      servicio: validarRequerido(f.servicio, 'Elige el servicio que necesitas.'),
      acepto: f.acepto ? '' : 'Marca la casilla para que podamos usar tus datos en esta cita.',
    });
    setErr(fallos);
    if (Object.keys(fallos).length) {
      requestAnimationFrame(() => formulario.current?.querySelector('[aria-invalid="true"]')?.focus());
      return false;
    }
    return true;
  };

  const reducir = useReducedMotion();
  const irAlFormulario = () => {
    setEnviada(null);
    requestAnimationFrame(() => {
      document.getElementById('cita')?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
      formulario.current?.querySelector('input')?.focus({ preventScroll: true });
    });
  };

  const enviar = async (canal) => {
    if (!validar()) return;
    // Se guarda en paralelo: WhatsApp se abre en el mismo clic (si espera a la red, el navegador lo bloquea)
    // y, si guardar falla, el mensaje igual llega a la tienda.
    const guardada = crearCita(f).catch(() => null);
    const texto = textoCita(f);
    if (canal === 'correo') location.href = `mailto:${SITIO.correo}?subject=${encodeURIComponent('Cita de reparación')}&body=${encodeURIComponent(texto)}`;
    else window.open(`https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    const cita = await guardada;
    setEnviada({ ...cita, canal });
  };

  return (
    <>
      <PortadaReparaciones onAgendar={() => irAlFormulario()} />
      <ListaServicios onElegir={(servicio) => { setF((x) => ({ ...x, servicio })); irAlFormulario(); }} />

      <section id="cita" className={`seccion ${s.citaSeccion}`} aria-labelledby="cita-titulo">
        <div className={`contenedor ${s.cita}`}>
          <div className={s.citaInfo}>
            <h2 id="cita-titulo" className="display">Agenda tu cita.</h2>
            <p className="sub">Cuéntanos qué le pasa a tu equipo y te respondemos para confirmar la fecha.</p>
            <ul className={s.contacto}>
              <li><a href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} tam={18} />{SITIO.telefono}</a></li>
              <li><Icono de={ICONOS.ubicacion.de} mov={ICONOS.ubicacion.mov} tam={18} />{SITIO.ubicacion}{SITIO.ubicacionPendiente && ' [pendiente de confirmar]'}</li>
              <li><Icono de={ICONOS.correo.de} mov={ICONOS.correo.mov} tam={18} />{SITIO.correo || 'Correo de la tienda [pendiente]'}</li>
            </ul>
          </div>

          {enviada ? (
            <div className={s.enviada} role="status">
              <Icono de={ICONOS.garantia.de} mov="giro" tam={28} />
              <h3 className="titulo">Cita lista para enviar.</h3>
              <p>Abrimos {enviada.canal === 'correo' ? 'tu correo' : 'WhatsApp'} con los datos. Envía el mensaje y te confirmamos la fecha.</p>
              <button type="button" className="btn btn-fantasma" onClick={() => setEnviada(null)}>Agendar otra cita</button>
            </div>
          ) : (
            <form ref={formulario} className={s.formulario} noValidate onSubmit={(e) => { e.preventDefault(); enviar('whatsapp'); }}>
              <Campo etiqueta="Nombre" autoComplete="name" value={f.nombre} onChange={cambiar('nombre')} error={err.nombre} />
              <Campo etiqueta="Teléfono" type="tel" inputMode="tel" autoComplete="tel" placeholder="6123 4567" value={f.telefono} onChange={cambiar('telefono')} error={err.telefono} />
              <Campo como="select" etiqueta="Dispositivo" value={f.dispositivo} onChange={cambiar('dispositivo')} error={err.dispositivo}>
                <option value="">Elige tu equipo</option>
                {DISPOSITIVOS.map((d) => <option key={d}>{d}</option>)}
              </Campo>
              <Campo como="select" etiqueta="Servicio" value={f.servicio} onChange={cambiar('servicio')} error={err.servicio}>
                <option value="">Elige un servicio</option>
                {SERVICIOS.map((sv) => <option key={sv.id}>{sv.nombre}</option>)}
              </Campo>
              <Campo etiqueta="Fecha preferida" opcional type="date" min={hoy()} value={f.fechaPreferida} onChange={cambiar('fechaPreferida')} />
              <Campo como="textarea" etiqueta="¿Qué le pasa?" opcional placeholder="Por ejemplo: no enciende, la pantalla parpadea" value={f.detalle} onChange={cambiar('detalle')} />
              <div className="campo">
                <label className={s.acepto}>
                  <input type="checkbox" checked={f.acepto} onChange={cambiar('acepto')} aria-invalid={err.acepto ? 'true' : undefined} aria-describedby={err.acepto ? 'acepto-cita' : undefined} />
                  <span>Acepto que Kirei Technology use mis datos solo para gestionar esta cita.</span>
                </label>
                {err.acepto && <p id="acepto-cita" className="error-campo">{err.acepto}</p>}
              </div>
              <div className={s.botones}>
                <button type="submit" className="btn btn-accion btn-bloque">
                  <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} />Enviar cita por WhatsApp
                </button>
                <button type="button" className="btn btn-fantasma btn-bloque" onClick={() => enviar('correo')} disabled={!SITIO.correo} aria-describedby={SITIO.correo ? undefined : 'correo-pendiente'}>
                  <Icono de={ICONOS.correo.de} mov={ICONOS.correo.mov} entrada={false} tam={18} />Enviar cita por correo
                </button>
                {!SITIO.correo && <p id="correo-pendiente" className="ayuda">El correo de la tienda está [pendiente]. Por ahora usa WhatsApp.</p>}
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
