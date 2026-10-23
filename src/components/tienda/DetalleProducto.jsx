import { useId, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'motion/react';
import Foto from '../ui/Foto.jsx';
import Badge from '../ui/Badge.jsx';
import Icono from '../ui/Icono.jsx';
import Profundidad from '../ui/Profundidad.jsx';
import Precio from './Precio.jsx';
import { ICONOS } from '../iconos.js';
import { formatoPrecio } from '../../lib/formatoPrecio.js';
import { useCarrito, variantesDe, topeCantidad } from '../../context/CarritoContext.jsx';
import { useDatos } from '../../context/DatosContext.jsx';
import { SITIO, TARIFAS } from '../../data/sitio.js';
import s from './DetalleProducto.module.css';

export default function DetalleProducto({ producto: p }) {
  const { agregar, abrir } = useCarrito();
  const { categoriaPorId } = useDatos();
  const vs = variantesDe(p);
  const [varianteId, setVarianteId] = useState(vs[0].id);
  const [fotoIndice, setFotoIndice] = useState(vs[0].foto ?? 0);
  const [cantidad, setCantidad] = useState(1);
  const idOpciones = useId();
  const v = vs.find((x) => x.id === varianteId);
  const tope = topeCantidad(v.stock ?? p.stock);
  const agotado = p.estadoVenta === 'agotado';
  const categoria = categoriaPorId(p.categoriaId);
  const consulta = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(`Hola Kirei, quiero saber el precio de ${p.nombre}${v.nombre ? ` (${v.nombre})` : ''}.`)}`;

  const elegirVariante = (nueva) => {
    setVarianteId(nueva.id);
    if (nueva.foto != null) setFotoIndice(nueva.foto);
    setCantidad(1);
  };

  return (
    <div className={s.detalle}>
      <div className={s.galeria}>
        <Profundidad className={`${s.principal} ${s[p.tono] ?? ''}`} intensidad={6}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={fotoIndice} className={s.principalFoto} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Foto foto={p.fotos[fotoIndice]} alt={p.nombre} prioridad sizes="(min-width: 900px) 50vw, 100vw" />
            </motion.div>
          </AnimatePresence>
        </Profundidad>
        {p.fotos.length > 1 && (
          <div className={s.miniaturas} role="group" aria-label="Fotos del producto">
            {p.fotos.map((f, i) => (
              <button key={f.src ?? f.base} type="button" className={s.miniatura} onClick={() => setFotoIndice(i)} aria-label={`Ver foto ${i + 1} de ${p.fotos.length}`} aria-current={i === fotoIndice ? 'true' : undefined}>
                <Foto foto={f} sizes="72px" />
                {i === fotoIndice && <motion.span layoutId="miniatura-activa" className={s.miniaturaActiva} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={s.info}>
        {categoria && <Link href={`/tecnologia/${categoria.id}`} className={s.categoria}>{categoria.nombre}</Link>}
        <h1 className={s.nombre}>{p.nombre}</h1>
        {(p.estadoVenta || p.ejemplo) && (
          <div className={s.insignias}>
            {p.estadoVenta && <Badge estado={p.estadoVenta} />}
            {p.ejemplo && <Badge estado="ejemplo" />}
          </div>
        )}
        <Precio producto={p} grande />
        <p className="suave">{p.descripcion}</p>

        {vs.length > 1 && (
          <fieldset className={s.opciones}>
            <legend id={idOpciones} className="leyenda">{p.opcion ?? 'Opción'}: <span className={s.opcionElegida}>{v.nombre}</span></legend>
            <div className={s.muestras}>
              {vs.map((x) => (
                <label key={x.id} className={s.muestra} title={x.nombre}>
                  <input type="radio" name={idOpciones} value={x.id} checked={x.id === varianteId} onChange={() => elegirVariante(x)} disabled={x.stock === 0} />
                  <span className={s.color} style={{ background: x.muestra }} />
                  <span className="sr-only">{x.nombre}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {p.precioCentavos != null && !agotado && (
          <div className={s.cantidad}>
            <span className="leyenda" id={`${idOpciones}-cant`}>Cantidad</span>
            <div className={s.stepper} role="group" aria-labelledby={`${idOpciones}-cant`}>
              <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} aria-label="Quitar uno">
                <Icono de={ICONOS.menos.de} mov={ICONOS.menos.mov} entrada={false} tam={16} />
              </button>
              <output aria-live="polite">{cantidad}</output>
              <button type="button" onClick={() => setCantidad((c) => Math.min(tope, c + 1))} disabled={cantidad >= tope} aria-label="Agregar uno">
                <Icono de={ICONOS.mas.de} mov={ICONOS.mas.mov} entrada={false} tam={16} />
              </button>
            </div>
          </div>
        )}

        {p.precioCentavos == null ? (
          <a className="btn btn-accion btn-bloque" href={consulta} target="_blank" rel="noopener noreferrer">
            <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> Consultar precio por WhatsApp
          </a>
        ) : agotado ? (
          <button type="button" className="btn btn-accion btn-bloque" disabled>Agotado por ahora</button>
        ) : (
          <button type="button" className="btn btn-accion btn-bloque" onClick={() => { agregar(p.id, v.id, cantidad); abrir(); }}>
            Agregar al carrito
          </button>
        )}

        <ul className={s.datos}>
          <li><Icono de={ICONOS.garantia.de} mov={ICONOS.garantia.mov} tam={20} /><span>{SITIO.garantia}</span></li>
          <li><Icono de={ICONOS.envio.de} mov={ICONOS.envio.mov} tam={20} /><span>Retiro gratis o envío a domicilio en Panamá por {formatoPrecio(TARIFAS.envioDomicilio)}.</span></li>
          <li><Icono de={ICONOS.pago.de} mov={ICONOS.pago.mov} tam={20} /><span>Pago en línea con {SITIO.pagoEnLinea} [pendiente] o contra entrega desde {formatoPrecio(TARIFAS.contraEntregaMinimo)} (cargo de {formatoPrecio(TARIFAS.contraEntregaCargo)}).</span></li>
        </ul>
      </div>
    </div>
  );
}
