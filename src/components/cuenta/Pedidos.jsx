import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import Badge from '../ui/Badge.jsx';
import Foto from '../ui/Foto.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS, ICONOS_ESTADO } from '../iconos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { PASOS_PEDIDO, fechaCorta, pasoPedido } from '../../lib/cuenta.js';
import { etiquetaPedido } from '../../lib/pedidos.js';
import { useCuenta } from '../../context/CuentaContext.jsx';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { SITIO } from '../../data/sitio.js';
import s from './Cuenta.module.css';

function Recibo({ pedido: p }) {
  const id = etiquetaPedido(p);
  return (
    <div className={s.reciboContenedor}>
      <div className={s.ticket}>
        <div className={s.ticketSeccion}>
          <p className={s.ticketMarca}>Kirei Technology</p>
          <div className={s.ticketCabeza}>
            <span>{fechaCorta(p.creadoEn)}</span>
            <span>{id}</span>
          </div>
        </div>

        <p className={s.noFiscal}>No Fiscal</p>

        <div className={s.ticketSeccion}>
          <p className={s.ticketLinea}><strong>Nombre Cliente:</strong> {p.cliente.nombre || '-'}</p>
          {p.cliente.telefono && <p className={s.ticketLinea}><strong>Tel:</strong> {p.cliente.telefono}</p>}
          {p.cliente.correo && <p className={s.ticketLinea}><strong>Correo:</strong> {p.cliente.correo}</p>}
          {p.cliente.direccion && <p className={s.ticketLinea}><strong>Direccion:</strong> {p.cliente.direccion}</p>}
        </div>

        <p className={s.noFiscal}>No Fiscal</p>

        <div className={s.ticketSeccion}>
          <p className={s.ticketSubtitulo}>DETALLE DEL PEDIDO</p>
          <div className={s.ticketEncabezado}>
            <span>Descripcion</span><span className={s.ticketC}>Cant.</span><span className={s.ticketR}>Total</span>
          </div>
          {p.items.map((it) => (
            <div key={`${it.productoId}:${it.variante}`} className={s.ticketItem}>
              <span>{it.nombre}{it.varianteNombre && ` · ${it.varianteNombre}`}</span>
              <span className={s.ticketC}>{it.cantidad}</span>
              <span className={s.ticketR}>{formatoPrecio(it.precioCentavos * it.cantidad)}</span>
            </div>
          ))}
        </div>

        <p className={s.noFiscal}>No Fiscal</p>

        <div className={s.ticketSeccion}>
          <div className={s.ticketFila}><span>Subtotal</span><span>{formatoPrecio(p.subtotalCentavos)}</span></div>
          <div className={s.ticketFila}><span>{ENTREGA[p.entrega] ?? p.entrega}</span><span>{p.envioCentavos == null ? 'Por confirmar' : formatoPrecio(p.envioCentavos)}</span></div>
          {p.cargoContraEntregaCentavos > 0 && (
            <div className={s.ticketFila}><span>Cargo contra entrega</span><span>{formatoPrecio(p.cargoContraEntregaCentavos)}</span></div>
          )}
          <div className={`${s.ticketFila} ${s.ticketTotal}`}><span>Tot. descuento</span><span>{formatoPrecio(p.totalCentavos)}</span></div>
        </div>

        <p className={s.noFiscal}>No Fiscal</p>

        <div className={s.ticketPie}>
          <p>{PAGO[p.pago] ?? p.pago}</p>
          <p>Gracias por tu compra.</p>
          <p>{SITIO.telefono}</p>
        </div>
      </div>
    </div>
  );
}

const ENTREGA = { retiro: 'Retiro', punto_encuentro: 'Punto de encuentro', domicilio: 'Envío a domicilio' };
const PAGO = { linea: `En línea con ${SITIO.pagoEnLinea}`, contra_entrega: 'Contra entrega' };

function EsqueletoPedidos() {
  return (
    <div className={s.lista} role="status">
      <span className="sr-only">Cargando tus pedidos</span>
      {[0, 1].map((i) => <span key={i} className={s.esqueletoFila} aria-hidden="true" />)}
    </div>
  );
}

// Lista y detalle comparten la misma lectura: el detalle sale del pedido ya cargado.
export default function Pedidos({ id }) {
  const { usuario, cuenta } = useCuenta();
  const [estado, setEstado] = useState({ cargando: true, error: '', pedidos: [] });

  const cargar = () => {
    setEstado((e) => ({ ...e, cargando: true, error: '' }));
    cuenta().then((m) => m.misPedidos(usuario.uid))
      .then((pedidos) => setEstado({ cargando: false, error: '', pedidos }))
      .catch(() => setEstado({ cargando: false, error: 'No pudimos cargar tus pedidos. Revisa tu conexión.', pedidos: [] }));
  };
  useEffect(cargar, [usuario.uid]);

  if (estado.cargando) return <EsqueletoPedidos />;
  if (estado.error) {
    return (
      <div className={s.vacio}>
        <p className="error-campo" role="alert">{estado.error}</p>
        <button type="button" className="btn btn-fantasma" onClick={cargar}>Reintentar</button>
      </div>
    );
  }
  if (id) {
    const pedido = estado.pedidos.find((p) => p.id === id);
    return pedido ? <DetallePedido pedido={pedido} /> : (
      <div className={s.vacio}>
        <p>No encontramos ese pedido.</p>
        <Link href="/cuenta/pedidos" className="btn btn-fantasma">Ver mis pedidos</Link>
      </div>
    );
  }
  if (estado.pedidos.length === 0) {
    return (
      <div className={s.vacio}>
        <span className={s.vacioIcono}><Icono de={ICONOS.pedidos.de} mov="gota" tam={26} /></span>
        <p className={s.vacioTitulo}>Aún no tienes pedidos.</p>
        <p className="suave">Cuando compres con tu cuenta, aquí verás cada pedido y su estado.</p>
        <Link href="/tecnologia" className="btn btn-accion">Explorar tecnología</Link>
      </div>
    );
  }
  return (
    <ul className={s.lista}>
      {estado.pedidos.map((p) => (
        <li key={p.id} className={s.pedido}>
          <div className={s.pedidoCabeza}>
            <div>
              <p className={s.pedidoNumero}>Pedido {etiquetaPedido(p)}</p>
              <p className="suave chico">{fechaCorta(p.creadoEn)} · {formatoPrecio(p.totalCentavos)}</p>
            </div>
            <Badge estado={p.estado} />
          </div>
          <ul className={s.pedidoFotos} aria-label="Productos del pedido">
            {p.items.map((it) => (
              <li key={`${it.productoId}:${it.variante}`} className={s.pedidoFoto} title={`${it.cantidad} x ${it.nombre}`}>
                <Foto foto={it.foto} sizes="56px" />
                <span className="sr-only">{it.cantidad} x {it.nombre}</span>
              </li>
            ))}
          </ul>
          <Link href={`/cuenta/pedidos/${p.id}`} className={s.enlaceFila}>
            Ver detalle y seguimiento <Icono de={ICONOS.abrir.de} mov={ICONOS.abrir.mov} entrada={false} tam={16} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DetallePedido({ pedido: p }) {
  const { agregar, abrir } = useCarrito();
  const actual = pasoPedido(p.estado);
  const cancelado = p.estado === 'cancelado';

  const comprarOtraVez = () => {
    for (const it of p.items) agregar(it.productoId, it.variante, it.cantidad);
    abrir();
  };

  return (
    <article className={s.detalle}>
      <Link href="/cuenta/pedidos" className={s.volver}>
        <Icono de={ICONOS.anterior.de} mov={ICONOS.anterior.mov} entrada={false} tam={16} /> Mis pedidos
      </Link>
      <div className={s.pedidoCabeza}>
        <div>
          <h2 className={s.seccionTitulo}>Pedido {etiquetaPedido(p)}</h2>
          <p className="suave chico">Hecho el {fechaCorta(p.creadoEn)}</p>
        </div>
        <Badge estado={p.estado} />
      </div>

      {cancelado ? (
        <p className={s.aviso}>Este pedido fue cancelado. Si tienes dudas, escríbenos por WhatsApp.</p>
      ) : (
        <ol className={s.linea} aria-label="Seguimiento del pedido">
          {PASOS_PEDIDO.map((paso, i) => (
            <li key={paso} className={s.lineaPaso} data-hecho={i <= actual} aria-current={i === actual ? 'step' : undefined}>
              <span className={s.lineaPunto}><Icono de={ICONOS_ESTADO[paso].de} mov="aparecer" entrada={false} tam={14} /></span>
              <span className={s.lineaTexto}>{ICONOS_ESTADO[paso].texto}</span>
            </li>
          ))}
        </ol>
      )}
      {p.seguimiento && <p className={s.aviso}><strong>Seguimiento:</strong> {p.seguimiento}</p>}

      <ul className={s.items}>
        {p.items.map((it) => (
          <li key={`${it.productoId}:${it.variante}`} className={s.item}>
            <span className={s.pedidoFoto}><Foto foto={it.foto} sizes="56px" /></span>
            <span className={s.itemNombre}>{it.nombre}{it.varianteNombre && <span className="suave chico"> · {it.varianteNombre}</span>}<span className="suave chico">Cantidad: {it.cantidad}</span></span>
            <span className={s.itemPrecio}>{formatoPrecio(it.precioCentavos * it.cantidad)}</span>
          </li>
        ))}
      </ul>

      <dl className={s.totales}>
        <div><dt>Subtotal</dt><dd>{formatoPrecio(p.subtotalCentavos)}</dd></div>
        <div><dt>Entrega: {ENTREGA[p.entrega] ?? p.entrega}</dt><dd>{p.envioCentavos == null ? 'Por confirmar' : formatoPrecio(p.envioCentavos)}</dd></div>
        {p.cargoContraEntregaCentavos > 0 && <div><dt>Cargo contra entrega</dt><dd>{formatoPrecio(p.cargoContraEntregaCentavos)}</dd></div>}
        <div><dt>Pago</dt><dd>{PAGO[p.pago] ?? p.pago}</dd></div>
        <div className={s.total}><dt>Total</dt><dd>{formatoPrecio(p.totalCentavos)}</dd></div>
      </dl>

      <Recibo pedido={p} />

      <div className={s.acciones}>
        <button type="button" className="btn btn-accion" onClick={comprarOtraVez}>Comprar otra vez</button>
        <a className="btn btn-fantasma" href={`https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(`Hola Kirei, tengo una consulta sobre mi pedido ${etiquetaPedido(p)}.`)}`} target="_blank" rel="noopener noreferrer">
          Preguntar por WhatsApp
        </a>
      </div>
      <Link href="/tecnologia" className="enlace">Seguir comprando</Link>
    </article>
  );
}
