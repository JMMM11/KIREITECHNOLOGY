import { useState } from 'react';
import Aparece from '../components/ui/Aparece.jsx';
import Frasco from '../components/aroma/Frasco.jsx';
import TarjetaPerfume from '../components/aroma/TarjetaPerfume.jsx';
import Recomendador from '../components/aroma/Recomendador.jsx';
import { IconoAroma } from '../components/ui/IconoAroma.jsx';
import { FAMILIAS, INGREDIENTES, PERFUMES_MUESTRA } from '../data/aroma.js';
import { SITIO } from '../data/sitio.js';
import { datosPerfume } from '../lib/aroma.js';
import { enCategoria } from '../lib/catalogo.js';
import { useDatos } from '../context/DatosContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from '../components/aroma/Aroma.module.css';

const hablar = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, quiero saber de los perfumes de Aroma.')}`;

// Aroma: perfumería con su propio tema (styles/tokens.css). Muestra los perfumes publicados en la categoría "aroma";
// mientras no haya ninguno, enseña el catálogo de muestra de data/aroma.js, marcado como tal.
export default function Aroma() {
  useTituloPagina('Aroma', 'Perfumes y fragancias en Panamá con Kirei Technology: florales, amaderadas, cítricas, orientales, frescas y dulces. Envío a domicilio o retiro gratis.');
  const { productos } = useDatos();
  const [familia, setFamilia] = useState('');
  const reales = productos.filter((p) => enCategoria(p, 'aroma')).map(datosPerfume);
  const perfumes = reales.length ? reales : PERFUMES_MUESTRA;
  const visibles = familia ? perfumes.filter((p) => p.familia === familia) : perfumes;
  const elegir = (id) => { setFamilia(id); document.getElementById('fragancias')?.scrollIntoView({ block: 'start' }); };

  return (
    <div className={`tema-aroma ${s.pagina}`}>
      <section className={s.hero} aria-labelledby="aroma-titulo">
        <div className={`contenedor ${s.heroCaja}`}>
          <div className={s.heroTexto}>
            <Aparece como="p" className={s.sobre}>Aroma · Perfumería Kirei</Aparece>
            <Aparece como="h1" i={1} id="aroma-titulo" className={s.heroTitulo}>The Art <em>of</em> Fragrance</Aparece>
            <Aparece como="p" i={2} className={s.heroBajada}>Descubre fragancias que expresan tu esencia.</Aparece>
            <Aparece i={3}><a href="#fragancias" className="btn btn-accion">Explorar fragancias</a></Aparece>
          </div>
          <Aparece i={2} className={s.heroArte} aria-hidden="true">
            <IconoAroma size={120} className={s.vapor} />
            <Frasco familia="gourmand" forma={1} className={s.heroFrasco} />
          </Aparece>
        </div>
      </section>

      <section className={`contenedor ${s.bloque}`} aria-labelledby="familias-titulo">
        <Aparece alVer como="h2" id="familias-titulo" className={s.titulo}>Familias olfativas</Aparece>
        <Aparece alVer como="p" i={1} className={s.bajada}>Cada fragancia pertenece a un mundo. Toca uno para ver sus perfumes.</Aparece>
        <ul className={s.familias}>
          {FAMILIAS.map((f, i) => (
            <Aparece alVer como="li" i={i % 3} key={f.id}>
              <button type="button" className={s.familia} style={{ '--tono': f.tono, '--tinta': f.tinta }} aria-pressed={familia === f.id} onClick={() => elegir(f.id)}>
                <span className={s.familiaNombre}>{f.nombre}</span>
                <span className={s.familiaFrase}>{f.frase}</span>
                <span className={s.familiaNotas}>{f.notas}</span>
              </button>
            </Aparece>
          ))}
        </ul>
      </section>

      <section id="fragancias" className={`contenedor ${s.bloque} ${s.ancla}`} aria-labelledby="fragancias-titulo">
        <h2 id="fragancias-titulo" className={s.titulo}>Fragancias</h2>
        {!reales.length && <p className={s.aviso}>Catálogo de muestra. Los nombres y los precios son ejemplos mientras cargamos los perfumes de la tienda.</p>}
        <div className={s.filtros} role="group" aria-label="Filtrar por familia">
          {[{ id: '', nombre: 'Todas' }, ...FAMILIAS].map((f) => (
            <button key={f.id || 'todas'} type="button" className={s.filtro} aria-pressed={familia === f.id} onClick={() => setFamilia(f.id)}>{f.nombre}</button>
          ))}
        </div>
        {visibles.length
          ? <ul className={s.perfumes}>{visibles.map((p) => <li key={p.id}><TarjetaPerfume perfume={p} i={perfumes.indexOf(p)} /></li>)}</ul>
          : <p className={s.aviso}>Todavía no hay fragancias de esta familia. <button type="button" className={s.enlaceBoton} onClick={() => setFamilia('')}>Ver todas</button></p>}
      </section>

      <section className={s.ingredientes} aria-labelledby="ingredientes-titulo">
        <div className="contenedor">
          <Aparece alVer como="h2" id="ingredientes-titulo" className={s.titulo}>Los ingredientes</Aparece>
          <ol className={s.listaIngredientes}>
            {INGREDIENTES.map((x, i) => (
              <Aparece alVer como="li" i={i % 2} key={x.nombre} className={s.ingrediente}>
                <span className={s.numero} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{x.nombre}</h3>
                <p>{x.texto}</p>
              </Aparece>
            ))}
          </ol>
        </div>
      </section>

      <section className={`contenedor ${s.bloque}`} aria-labelledby="encuentra-titulo">
        <Aparece alVer como="h2" id="encuentra-titulo" className={s.titulo}>Encuentra tu aroma</Aparece>
        <Aparece alVer como="p" i={1} className={s.bajada}>Cuatro preguntas. Te sugerimos solo fragancias que están en el catálogo.</Aparece>
        <Recomendador perfumes={perfumes} />
      </section>

      <section className={`contenedor ${s.cierre}`}>
        <Aparece alVer como="p" className={s.cierreFrase}>Cada fragancia cuenta una historia. <em>Encuentra la tuya.</em></Aparece>
        <Aparece alVer i={1} className={s.cierreAcciones}>
          <a href="#fragancias" className="btn btn-accion">Ver la colección</a>
          <a href={hablar} target="_blank" rel="noopener noreferrer" className="btn btn-fantasma">Hablar con Kirei</a>
        </Aparece>
      </section>
    </div>
  );
}
