import { useId, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence } from 'motion/react';
import CabeceraPagina from '../components/ui/CabeceraPagina.jsx';
import TarjetaProducto from '../components/tienda/TarjetaProducto.jsx';
import Icono from '../components/ui/Icono.jsx';
import { EsqueletoTarjetas } from '../components/ui/Esqueleto.jsx';
import { ICONOS } from '../components/iconos.js';
import MiniaturaCategoria from '../components/ui/MiniaturaCategoria.jsx';
import Desplegable from '../components/ui/Desplegable.jsx';
import { ORDENES, SECCIONES } from '../data/catalogos.js';
import { filtrarCatalogo } from '../lib/catalogo.js';
import { useDatos } from '../context/DatosContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Catalogo.module.css';

const TECNO = SECCIONES.find((x) => x.id === 'tecnologia');

// Sección Tecnología: categorías como botones arriba, buscador y orden. También sirve para /buscar.
export default function Catalogo({ params = {}, buscar = false }) {
  const { productos, categorias, cargando, error, reintentar } = useDatos();
  const inicial = params.q ? decodeURIComponent(params.q) : '';
  const [texto, setTexto] = useState(inicial);
  const [orden, setOrden] = useState('relevancia');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const idBusqueda = useId();

  const subcategorias = categorias.filter((c) => c.seccion === 'tecnologia');
  const categoria = subcategorias.find((c) => c.id === params.categoria);
  const catId = categoria?.id ?? '';
  const enSeccion = useMemo(() => productos.filter((p) => subcategorias.some((c) => c.id === p.categoriaId)), [productos, subcategorias]);
  useTituloPagina(categoria?.nombre ?? (buscar ? 'Buscar' : TECNO.nombre));

  const lista = useMemo(
    () => filtrarCatalogo(enSeccion, { categoria: catId, texto, orden, soloDisponibles }),
    [enSeccion, catId, texto, orden, soloDisponibles],
  );
  const conteo = (id) => filtrarCatalogo(enSeccion, { categoria: id, texto, soloDisponibles }).length;
  const limpiar = () => { setTexto(''); setSoloDisponibles(false); setOrden('relevancia'); };

  return (
    <>
      <CabeceraPagina
        titulo={buscar ? 'Buscar en la tienda' : (categoria?.nombre ?? TECNO.nombre)}
        texto={categoria?.frase ?? `${TECNO.frase}.`}
      />
      <div className={`contenedor ${s.pagina}`}>
        <nav aria-label="Categorías de tecnología">
          <ul className={s.chips}>
            {[{ id: '', nombre: 'Todo' }, ...subcategorias].map((c) => (
              <li key={c.id || 'todo'}>
                <Link href={c.id ? `/tecnologia/${c.id}` : '/tecnologia'} className={s.chip} aria-current={c.id === catId ? 'page' : undefined}>
                  {c.id && <MiniaturaCategoria categoriaId={c.id} tam={28} />}
                  {c.nombre}
                  <span className={s.chipConteo}>{conteo(c.id)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.herramientas}>
          <form className={s.busqueda} role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor={idBusqueda} className="sr-only">Buscar productos</label>
            <span className={s.lupa}><Icono de={ICONOS.buscar.de} mov={ICONOS.buscar.mov} entrada={false} tam={18} /></span>
            <input id={idBusqueda} type="search" className={`entrada ${s.campo}`} placeholder="Buscar productos" value={texto} onChange={(e) => setTexto(e.target.value)} autoFocus={buscar} autoComplete="off" />
          </form>
          <label className={s.check}>
            <input type="checkbox" checked={soloDisponibles} onChange={(e) => setSoloDisponibles(e.target.checked)} />
            Solo con precio
          </label>
          <Desplegable etiqueta="Ordenar" opciones={ORDENES} valor={orden} onCambio={setOrden} />
        </div>

        <section aria-labelledby="resultados-titulo">
          <h2 id="resultados-titulo" className={s.conteo} aria-live="polite">
            {cargando ? 'Cargando productos' : `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}`}
          </h2>
          {error && (
            <div className={s.estado} role="alert">
              <p>{error}</p>
              <button type="button" className="btn btn-marca" onClick={reintentar}>Reintentar</button>
            </div>
          )}
          {!error && cargando && <EsqueletoTarjetas />}
          {!error && !cargando && lista.length === 0 && (
            <div className={s.estado}>
              <p className={s.estadoTitulo}>No encontramos productos con esos filtros.</p>
              <p className="suave">Prueba con otra palabra o mira toda la tecnología.</p>
              <button type="button" className="btn btn-marca" onClick={limpiar}>Limpiar filtros</button>
            </div>
          )}
          {!error && !cargando && lista.length > 0 && (
            <ul className={s.rejilla}>
              <AnimatePresence mode="popLayout" initial={false}>
                {lista.map((p, i) => <li key={p.id} className={s.celda}><TarjetaProducto producto={p} prioridad={i < 4} /></li>)}
              </AnimatePresence>
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
