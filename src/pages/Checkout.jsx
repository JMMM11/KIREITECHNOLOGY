import { useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'motion/react';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import Campo from '../components/ui/Campo.jsx';
import Badge from '../components/ui/Badge.jsx';
import Icono from '../components/ui/Icono.jsx';
import ResumenPedido from '../components/tienda/ResumenPedido.jsx';
import { CarritoVacio } from '../components/tienda/Carrito.jsx';
import { ICONOS } from '../components/iconos.js';
import { calcularTotales } from '../lib/totales.js';
import { formatoPrecio } from '../lib/formatoPrecio.js';
import { errores, validarCorreo, validarNombre, validarRequerido, validarTelefono } from '../lib/validacion.js';
import { crearPedido } from '../services/tienda.js';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { SITIO, TARIFAS } from '../data/sitio.js';
import s from './Checkout.module.css';

const PASOS = ['Tus datos', 'Entrega', 'Pago'];
const ENTREGAS = [
  { id: 'retiro', nombre: 'Retiro', detalle: 'Gratis. Coordinamos el lugar y la hora por WhatsApp.' },
  { id: 'punto_encuentro', nombre: 'Punto de encuentro', detalle: `Costo ${formatoPrecio(TARIFAS.envioPuntoEncuentro)}. Lo coordinamos por WhatsApp.` },
  { id: 'domicilio', nombre: 'Envío a domicilio', detalle: `${formatoPrecio(TARIFAS.envioDomicilio)} dentro de Panamá.` },
];
const NOMBRE_ENTREGA = Object.fromEntries(ENTREGAS.map((e) => [e.id, e.nombre]));

function mensajeWhatsApp(pedido, lineas, totales, f) {
  return [
    `Hola Kirei, quiero hacer este pedido (${pedido.id}):`,
    ...lineas.map((l) => `- ${l.cantidad} x ${l.nombre}${l.varianteNombre ? ` (${l.varianteNombre})` : ''}: ${formatoPrecio(l.precio * l.cantidad)}`),
    '',
    `Subtotal: ${formatoPrecio(totales.subtotal)}`,
    `Entrega: ${NOMBRE_ENTREGA[f.entrega]}${totales.envioPorConfirmar ? ' (costo por confirmar)' : ` (${formatoPrecio(totales.envio)})`}`,
    `Pago: ${f.pago === 'linea' ? `En línea con ${SITIO.pagoEnLinea}` : `Contra entrega (cargo ${formatoPrecio(totales.cargoContraEntrega)})`}`,
    `Total: ${formatoPrecio(totales.total)}`,
    '',
    `Nombre: ${f.nombre.trim()}`,
    `Teléfono: ${f.telefono.trim()}`,
    f.correo.trim() ? `Correo: ${f.correo.trim()}` : null,
    f.entrega === 'domicilio' ? `Dirección: ${f.direccion.trim()}` : null,
    f.nota.trim() ? `Nota: ${f.nota.trim()}` : null,
  ].filter((x) => x !== null).join('\n');
}

export default function Checkout() {
  useTituloPagina('Checkout');
  const { lineas, vaciar } = useCarrito();
  const [paso, setPaso] = useState(0);
  const [f, setF] = useState({ nombre: '', telefono: '', correo: '', entrega: 'retiro', direccion: '', pago: 'linea', nota: '', acepto: false });
  const [err, setErr] = useState({});
  const [envio, setEnvio] = useState({ estado: 'editando', pedido: null, enlace: '', error: '' });
  const formulario = useRef(null);

  const totales = useMemo(() => calcularTotales(lineas, f.entrega, f.pago, TARIFAS), [lineas, f.entrega, f.pago]);
  const pago = !totales.contraEntregaPermitida && f.pago === 'contra_entrega' ? 'linea' : f.pago;
  const t = pago === f.pago ? totales : calcularTotales(lineas, f.entrega, pago, TARIFAS);

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setF((x) => ({ ...x, [campo]: valor }));
    if (err[campo]) setErr((x) => ({ ...x, [campo]: '' }));
  };

  const validarPaso = (n) => errores(
    n === 0 ? { nombre: validarNombre(f.nombre), telefono: validarTelefono(f.telefono), correo: validarCorreo(f.correo) }
      : n === 1 ? { direccion: f.entrega === 'domicilio' ? validarRequerido(f.direccion, 'Escribe la dirección: provincia, corregimiento, calle y una referencia.') : '' }
      : { acepto: f.acepto ? '' : 'Marca la casilla para que podamos usar tus datos en este pedido.' },
  );

  const enfocarError = () => requestAnimationFrame(() => formulario.current?.querySelector('[aria-invalid="true"]')?.focus());

  const continuar = (e) => {
    e.preventDefault();
    const fallos = validarPaso(paso);
    if (Object.keys(fallos).length) { setErr(fallos); enfocarError(); return; }
    if (paso < PASOS.length - 1) { setPaso(paso + 1); return; }
    enviar();
  };

  async function enviar() {
    setEnvio({ estado: 'enviando', pedido: null, enlace: '', error: '' });
    try {
      const datos = { ...f, pago };
      const pedido = await crearPedido({
        cliente: { nombre: f.nombre.trim(), telefono: f.telefono.trim(), correo: f.correo.trim(), direccion: f.entrega === 'domicilio' ? f.direccion.trim() : '' },
        entrega: f.entrega, pago, nota: f.nota,
        items: lineas.map((l) => ({ productoId: l.productoId, nombre: l.nombre, varianteNombre: l.varianteNombre, precioCentavos: l.precio, cantidad: l.cantidad })),
        totales: t,
      });
      const enlace = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(mensajeWhatsApp(pedido, lineas, t, datos))}`;
      window.open(enlace, '_blank', 'noopener');
      setEnvio({ estado: 'exito', pedido: { ...pedido, lineas, totales: t }, enlace, error: '' });
      vaciar();
    } catch {
      setEnvio({ estado: 'error', pedido: null, enlace: '', error: 'No pudimos registrar tu pedido. Revisa tu conexión y vuelve a intentarlo.' });
    }
  }

  if (envio.estado === 'exito') {
    const p = envio.pedido;
    return (
      <div className={`contenedor ${s.exito}`}>
        <motion.span className={s.exitoIcono} initial={{ scale: 0.5, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <Icono de={ICONOS.whatsapp.de} mov="sacudir" tam={32} />
        </motion.span>
        <h1 className="display">Pedido {p.id} recibido.</h1>
        <Badge estado={p.estado} />
        <p className="sub">Abrimos WhatsApp con tu pedido. Envía el mensaje y te confirmamos el total de {formatoPrecio(p.totales.total)} y el pago.</p>
        <div className={s.exitoAcciones}>
          <a className="btn btn-accion" href={envio.enlace} target="_blank" rel="noopener noreferrer">Abrir WhatsApp otra vez</a>
          <Link href="/tecnologia" className="btn btn-fantasma">Seguir comprando</Link>
        </div>
      </div>
    );
  }

  if (lineas.length === 0) {
    return (<><CabeceraPagina titulo="Checkout." /><div className="contenedor"><CarritoVacio /></div></>);
  }

  const etiquetaFinal = `Enviar pedido de ${formatoPrecio(t.total)} por WhatsApp`;

  return (
    <>
      <CabeceraPagina titulo="Finaliza tu pedido." />
      <div className={`contenedor ${s.checkout}`}>
        <form ref={formulario} className={s.formulario} onSubmit={continuar} noValidate>
          <ol className={s.pasos}>
            {PASOS.map((nombre, i) => (
              <li key={nombre} className={s.paso} aria-current={i === paso ? 'step' : undefined}>
                <button type="button" disabled={i > paso} onClick={() => setPaso(i)} className={s.pasoBoton}>
                  <span className={s.pasoNumero}>{i < paso ? <Icono de={ICONOS.garantia.de} mov="giro" tam={14} /> : i + 1}</span>
                  {nombre}
                </button>
                {i === paso && <motion.span layoutId="paso-activo" className={s.pasoLinea} />}
              </li>
            ))}
          </ol>

          {envio.estado === 'error' && (
            <div className={s.alerta} role="alert">
              <p>{envio.error}</p>
              <button type="button" className="btn btn-marca" onClick={enviar}>Reintentar</button>
            </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.fieldset key={paso} className={s.grupo} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              <legend className={s.leyendaPaso}>{PASOS[paso]}</legend>
              {paso === 0 && (
                <>
                  <Campo etiqueta="Nombre" autoComplete="name" value={f.nombre} onChange={cambiar('nombre')} error={err.nombre} />
                  <Campo etiqueta="Teléfono" type="tel" inputMode="tel" autoComplete="tel" placeholder="6123 4567" value={f.telefono} onChange={cambiar('telefono')} error={err.telefono} ayuda="Te escribimos a este número para confirmar el pedido." />
                  <Campo etiqueta="Correo" opcional type="email" autoComplete="email" value={f.correo} onChange={cambiar('correo')} error={err.correo} />
                </>
              )}
              {paso === 1 && (
                <>
                  <div className={s.opciones} role="radiogroup" aria-label="Tipo de entrega">
                    {ENTREGAS.map((e) => (
                      <label key={e.id} className={s.opcion}>
                        <input type="radio" name="entrega" value={e.id} checked={f.entrega === e.id} onChange={cambiar('entrega')} />
                        <span className={s.opcionNombre}>{e.nombre}</span>
                        <span className={s.opcionDetalle}>{e.detalle}</span>
                      </label>
                    ))}
                  </div>
                  {f.entrega === 'domicilio' && (
                    <Campo como="textarea" etiqueta="Dirección de entrega" autoComplete="street-address" placeholder="Provincia, corregimiento, calle y referencia" value={f.direccion} onChange={cambiar('direccion')} error={err.direccion} />
                  )}
                </>
              )}
              {paso === 2 && (
                <>
                  <div className={s.opciones} role="radiogroup" aria-label="Forma de pago">
                    <label className={s.opcion}>
                      <input type="radio" name="pago" value="linea" checked={pago === 'linea'} onChange={cambiar('pago')} />
                      <span className={s.opcionNombre}>Pago en línea con {SITIO.pagoEnLinea}</span>
                      <span className={s.opcionDetalle}>[pendiente] Mientras se conecta, te enviamos los datos de pago por WhatsApp.</span>
                    </label>
                    <label className={s.opcion}>
                      <input type="radio" name="pago" value="contra_entrega" checked={pago === 'contra_entrega'} onChange={cambiar('pago')} disabled={!totales.contraEntregaPermitida} />
                      <span className={s.opcionNombre}>Contra entrega</span>
                      <span className={s.opcionDetalle}>
                        {totales.contraEntregaPermitida
                          ? `Pagas al recibir. Cargo de ${formatoPrecio(TARIFAS.contraEntregaCargo)}.`
                          : `Disponible desde ${formatoPrecio(TARIFAS.contraEntregaMinimo)}. Te faltan ${formatoPrecio(totales.faltaParaContraEntrega)}.`}
                      </span>
                    </label>
                  </div>
                  <Campo como="textarea" etiqueta="Nota" opcional placeholder="Algo que debamos saber" value={f.nota} onChange={cambiar('nota')} />
                  <div className="campo">
                    <label className={s.acepto}>
                      <input type="checkbox" checked={f.acepto} onChange={cambiar('acepto')} aria-invalid={err.acepto ? 'true' : undefined} aria-describedby={err.acepto ? 'acepto-error' : undefined} />
                      <span>Acepto que Kirei Technology use mis datos solo para gestionar este pedido. Lee la <Link href="/legal/privacidad">política de privacidad</Link>.</span>
                    </label>
                    {err.acepto && <p id="acepto-error" className="error-campo">{err.acepto}</p>}
                  </div>
                  <p className="ayuda">No guardamos datos de pago.</p>
                </>
              )}
            </motion.fieldset>
          </AnimatePresence>

          <div className={s.navegacion}>
            {paso > 0 && <button type="button" className="btn btn-fantasma" onClick={() => setPaso(paso - 1)}>Atrás</button>}
            <button type="submit" className={`btn ${paso === PASOS.length - 1 ? 'btn-accion' : 'btn-marca'} ${s.siguiente}`} disabled={envio.estado === 'enviando'}>
              {paso === PASOS.length - 1 ? (envio.estado === 'enviando' ? 'Enviando pedido' : etiquetaFinal) : `Continuar a ${PASOS[paso + 1].toLowerCase()}`}
            </button>
          </div>
        </form>

        <div className={s.lado}>
          <ResumenPedido lineas={lineas} totales={t} />
        </div>
      </div>
    </>
  );
}
