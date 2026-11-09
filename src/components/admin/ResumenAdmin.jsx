import { useEffect, useState } from 'react';
import Cargando from '../ui/Cargando.jsx';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { ESTADOS_PEDIDO } from '../../lib/pedidos.js';
import { alertasInventario, resumirVentas } from '../../lib/reportes.js';
import { pedidos, todosLosProductos } from '../../services/admin.js';
import s from './Admin.module.css';

const MES = new Intl.DateTimeFormat('es-PA', { month: 'short' });

// Inicio del panel: cómo va la tienda y qué hay que atender hoy.
export default function ResumenAdmin({ ir }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([pedidos(), todosLosProductos()])
      .then(([ps, prods]) => setDatos({ r: resumirVentas(ps), a: alertasInventario(prods), pendientes: ps.filter((p) => p.estado === 'recibido').length }))
      .catch(() => setError('No se pudieron cargar los datos. Revisa tu conexión y que las reglas estén publicadas.'));
  }, []);
  if (error) return <p className={s.vacio} role="alert">{error}</p>;
  if (!datos) return <Cargando />;
  const { r, a, pendientes } = datos;
  const maxMes = Math.max(1, ...r.porMes.map((m) => m.totalCentavos));

  const tarjetas = [
    { titulo: 'Ventas', valor: formatoPrecio(r.totalCentavos), nota: `${r.ventas} pedidos confirmados, enviados o entregados` },
    { titulo: 'Ticket promedio', valor: formatoPrecio(r.ticketPromedioCentavos), nota: 'por pedido vendido' },
    { titulo: 'Por atender', valor: pendientes, nota: 'pedidos recibidos sin confirmar', accion: pendientes ? () => ir('pedidos') : null },
    { titulo: 'Inventario', valor: a.agotados.length + a.pocos.length, nota: 'agotados o con menos de 3', accion: () => ir('inventario') },
  ];
  const avisos = [
    [a.sinPrecio, 'sin precio'], [a.sinFoto, 'sin foto'], [a.borradores, 'en borrador'], [a.sinContar, 'sin unidades contadas'],
  ].filter(([lista]) => lista.length);

  return (
    <section className={s.seccion} aria-labelledby="resumen-titulo">
      <h1 id="resumen-titulo" className="titulo">Resumen</h1>
      <ul className={s.tarjetas}>
        {tarjetas.map((t) => (
          <li key={t.titulo} className={s.tarjeta}>
            <p className="suave chico">{t.titulo}</p>
            <p className={s.cifra}>{t.valor}</p>
            <p className="suave chico">{t.nota}</p>
            {t.accion && <button type="button" className={s.enlace} onClick={t.accion}>Ver</button>}
          </li>
        ))}
      </ul>

      <div className={s.reportes}>
        <section className={s.tarjeta} aria-labelledby="meses-titulo">
          <h2 id="meses-titulo" className={s.subtitulo}>Ventas por mes</h2>
          <ul className={s.barras}>
            {r.porMes.map((m) => (
              <li key={m.clave}>
                <span className={s.barraMes}>{MES.format(m.fecha)}</span>
                <span className={s.barraPista}><span className={s.barraRelleno} style={{ width: `${(m.totalCentavos / maxMes) * 100}%` }} /></span>
                <span className={s.barraValor}>{formatoPrecio(m.totalCentavos)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.tarjeta} aria-labelledby="top-titulo">
          <h2 id="top-titulo" className={s.subtitulo}>Lo más vendido</h2>
          {r.masVendidos.length === 0 ? <p className="suave chico">Todavía no hay ventas confirmadas.</p> : (
            <ol className={s.ranking}>
              {r.masVendidos.map((m) => <li key={m.productoId}><span>{m.nombre}</span><strong>{m.cantidad} u.</strong></li>)}
            </ol>
          )}
        </section>

        <section className={s.tarjeta} aria-labelledby="estados-titulo">
          <h2 id="estados-titulo" className={s.subtitulo}>Pedidos por estado</h2>
          <ul className={s.ranking}>
            {ESTADOS_PEDIDO.map((e) => <li key={e}><span className={s.capital}>{e}</span><strong>{r.porEstado[e] ?? 0}</strong></li>)}
          </ul>
        </section>
      </div>

      {avisos.length > 0 && (
        <section className={s.tarjeta} aria-labelledby="avisos-titulo">
          <h2 id="avisos-titulo" className={s.subtitulo}>Por revisar en el catálogo</h2>
          <ul className={s.ranking}>
            {avisos.map(([lista, texto]) => <li key={texto}><span>{lista.length} {texto}: {lista.map((p) => p.nombre).join(', ')}</span></li>)}
          </ul>
        </section>
      )}
    </section>
  );
}
