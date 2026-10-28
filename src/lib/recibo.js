// Abre una ventana de impresión con el comprobante del pedido. Sin dependencias externas.
import { formatoPrecio } from './formatoPrecio.js';
import { etiquetaPedido } from './pedidos.js';
import { SITIO } from '../data/sitio.js';

// Datos de Firestore son de confianza, pero escapamos igual por si cambia la fuente.
const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ENTREGA = { retiro: 'Retiro en tienda', punto_encuentro: 'Punto de encuentro', domicilio: 'Envío a domicilio' };
const PAGO = { linea: `Pago en línea (${SITIO.pagoEnLinea})`, contra_entrega: 'Contra entrega' };

function fila(it) {
  return `<tr>
    <td>${esc(it.nombre)}${it.varianteNombre ? `<br><small>${esc(it.varianteNombre)}</small>` : ''}</td>
    <td class="c">${it.cantidad}</td>
    <td class="r">${formatoPrecio(it.precioCentavos)}</td>
    <td class="r">${formatoPrecio(it.precioCentavos * it.cantidad)}</td>
  </tr>`;
}

function fecha(ts) {
  if (!ts) return 'Hace un momento';
  const d = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('es-PA', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function abrirRecibo(pedido) {
  const w = window.open('', '_blank', 'width=700,height=900');
  if (!w) return;
  const id = etiquetaPedido(pedido);
  const html = `<!doctype html>
<html lang="es-PA">
<head>
<meta charset="utf-8">
<title>Comprobante ${id}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:system-ui,sans-serif;font-size:14px;color:#111;background:#f4f4f4;padding:32px 0}
  .hoja{background:#fff;max-width:600px;margin:0 auto;padding:40px 48px;box-shadow:0 2px 16px rgba(0,0,0,.08)}
  .marca{font-size:22px;font-weight:700;letter-spacing:-0.5px}
  .marca small{display:block;font-size:11px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:#888;margin-top:2px}
  .cabeza{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:20px;margin-bottom:24px}
  .id{text-align:right}
  .id .num{font-size:18px;font-weight:700}
  .id .fecha{font-size:12px;color:#666;margin-top:4px}
  .partes{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
  .parte h3{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:6px}
  .parte p{line-height:1.6}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  thead tr{border-bottom:1.5px solid #111}
  thead th{padding:8px 0;font-size:11px;letter-spacing:1px;text-transform:uppercase;text-align:left}
  thead th.c,thead th.r,td.c,td.r{text-align:right}
  td.c{text-align:center}
  tbody td{padding:10px 0;border-bottom:1px solid #e8e8e8;vertical-align:top}
  tbody td small{color:#666;font-size:12px}
  .sub{max-width:220px;margin-left:auto;border-top:1.5px solid #111;padding-top:12px}
  .sub .fila{display:flex;justify-content:space-between;padding:4px 0;color:#555;font-size:13px}
  .sub .total{display:flex;justify-content:space-between;padding:10px 0 0;font-size:16px;font-weight:700;border-top:1.5px solid #111;margin-top:4px;color:#111}
  .pie{margin-top:32px;padding-top:20px;border-top:1px solid #e8e8e8;color:#888;font-size:12px;line-height:1.7;text-align:center}
  .imprimir{display:flex;justify-content:flex-end;margin-bottom:20px}
  .imprimir button{padding:8px 20px;border:1.5px solid #111;background:#111;color:#fff;border-radius:6px;font-size:13px;cursor:pointer}
  @media print{.imprimir{display:none}body{background:#fff;padding:0}.hoja{box-shadow:none}}
</style>
</head>
<body>
<div class="imprimir"><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
<div class="hoja">
  <div class="cabeza">
    <div class="marca">Kirei Technology<small>Comprobante de compra</small></div>
    <div class="id"><div class="num">${id}</div><div class="fecha">${fecha(pedido.creadoEn)}</div></div>
  </div>

  <div class="partes">
    <div class="parte">
      <h3>De</h3>
      <p><strong>${SITIO.nombre}</strong><br>${SITIO.ubicacion}<br>${SITIO.telefono}</p>
    </div>
    <div class="parte">
      <h3>Para</h3>
      <p><strong>${esc(pedido.cliente.nombre) || '-'}</strong>${pedido.cliente.correo ? `<br>${esc(pedido.cliente.correo)}` : ''}${pedido.cliente.telefono ? `<br>${esc(pedido.cliente.telefono)}` : ''}${pedido.cliente.direccion ? `<br>${esc(pedido.cliente.direccion)}` : ''}</p>
    </div>
  </div>

  <table>
    <thead><tr><th>Concepto</th><th class="c">Cant.</th><th class="r">Precio</th><th class="r">Total</th></tr></thead>
    <tbody>${pedido.items.map(fila).join('')}</tbody>
  </table>

  <div class="sub">
    <div class="fila"><span>Subtotal</span><span>${formatoPrecio(pedido.subtotalCentavos)}</span></div>
    <div class="fila"><span>${ENTREGA[pedido.entrega] ?? pedido.entrega}</span><span>${pedido.envioCentavos == null ? 'Por confirmar' : formatoPrecio(pedido.envioCentavos)}</span></div>
    ${pedido.cargoContraEntregaCentavos > 0 ? `<div class="fila"><span>Cargo contra entrega</span><span>${formatoPrecio(pedido.cargoContraEntregaCentavos)}</span></div>` : ''}
    <div class="total"><span>Total</span><span>${formatoPrecio(pedido.totalCentavos)}</span></div>
  </div>

  <div class="pie">
    <p>${PAGO[pedido.pago] ?? pedido.pago} · Estado: ${pedido.estado}</p>
    <p>Gracias por tu compra. Para consultas: ${SITIO.telefono}</p>
  </div>
</div>
</body>
</html>`;
  w.document.write(html);
  w.document.close();
}
