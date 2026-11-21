import { useState } from 'react';
import Aparece from '../components/ui/Aparece.jsx';
import Foto from '../components/ui/Foto.jsx';
import TarjetaPerfume from '../components/aroma/TarjetaPerfume.jsx';
import Recomendador from '../components/aroma/Recomendador.jsx';
import { FAMILIAS, GENEROS, INGREDIENTES } from '../data/aroma.js';
import { SITIO } from '../data/sitio.js';
import { datosPerfume } from '../lib/aroma.js';
import { enCategoria } from '../lib/catalogo.js';
import { useDatos } from '../context/DatosContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from '../components/aroma/Aroma.module.css';

const hablar = `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, quiero saber de los perfumes de Aroma.')}`;
const PORTADA = { src: 'perfumes/36.png', ancho: 1080, alto: 1080 };   // Eclaire, de Lattafa

// Aroma: perfumería con el tema tema-aroma (papel, durazno, marino y cobre). Muestra los perfumes publicados en la categoría "aroma".
export default function Aroma() {
  useTituloPagina('Aroma', 'Perfumes de mujer y hombre en Panamá con Kirei Technology: Lattafa, Ariana Grande, Armaf y más. Envío a domicilio o retiro gratis.');
  const { productos } = useDatos();
  const [familia, setFamilia] = useState('');
  const [genero, setGenero] = useState('');
  const perfumes = productos.filter((p) => enCategoria(p, 'aroma')).map(datosPerfume);
  const visibles = perfumes.filter((p) => (!familia || p.familia === familia) && (!genero || p.genero === genero));
  const elegir = (id) => { setFamilia(id); document.getElementById('fragancias')?.scrollIntoView({ block: 'start' }); };

  return (
    <div className={`tema-aroma ${s.pagina}`}>
      <section className={s.hero} aria-labelledby="aroma-titulo">
        <div className={`contenedor ${s.heroCaja}`}>
          <div className={s.heroTexto}>
            <Aparece como="p" className={s.sobre}>Aroma · Perfumería Kirei</Aparece>
            <Aparece como="h1" i={1} id="aroma-titulo" className={s.heroTitulo}>Tu aroma, <span>tu energía.</span></Aparece>
            <Aparece como="p" i={2} className={s.heroBajada}>Perfumes de mujer y hombre de Lattafa, Ariana Grande, Armaf y más. Descubre el que expresa tu esencia.</Aparece>
            <Aparece i={3}><a href="#fragancias" className="btn btn-accion">Explorar fragancias</a></Aparece>
          </div>
          <Aparece i={2} className={s.heroFoto}>
            <Foto foto={PORTADA} alt="Perfume Eclaire de Lattafa con caramelo y vainilla" prioridad sizes="(min-width: 900px) 40vw, 90vw" />
          </Aparece>
        </div>
      </section>

      <section className={`contenedor ${s.bloque}`} aria-labelledby="familias-titulo">
        <Aparece alVer como="h2" id="familias-titulo" className={s.titulo}>Familias olfativas</Aparece>
        <Aparece alVer como="p" i={1} className={s.bajada}>Cada fragancia pertenece a un mundo. Toca uno para ver sus perfumes.</Aparece>
        <ul className={s.familias}>
          {FAMILIAS.map((f, i) => (
            <Aparece alVer como="li" i={i % 3} key={f.id}>
              <button type="button" className={s.familia} data-tono={f.id} aria-pressed={familia === f.id} onClick={() => elegir(f.id)}>
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
        <div className={s.filtros} role="group" aria-label="Filtrar por género">
          {[['', 'Todos'], ...GENEROS].map(([id, nombre]) => (
            <button key={id || 'todos'} type="button" className={s.filtro} aria-pressed={genero === id} onClick={() => setGenero(id)}>{nombre}</button>
          ))}
        </div>
        <div className={s.filtros} role="group" aria-label="Filtrar por familia">
          {[{ id: '', nombre: 'Todas' }, ...FAMILIAS].map((f) => (
            <button key={f.id || 'todas'} type="button" className={s.filtro} aria-pressed={familia === f.id} onClick={() => setFamilia(f.id)}>{f.nombre}</button>
          ))}
        </div>
        {visibles.length
          ? <ul className={s.perfumes}>{visibles.map((p) => <li key={p.id}><TarjetaPerfume perfume={p} i={perfumes.indexOf(p)} /></li>)}</ul>
          : <p className={s.aviso}>{perfumes.length ? 'No hay fragancias con esos filtros. ' : 'Estamos cargando los perfumes. '}{perfumes.length > 0 && <button type="button" className={s.enlaceBoton} onClick={() => { setFamilia(''); setGenero(''); }}>Ver todas</button>}</p>}
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
        <Aparece alVer como="p" className={s.cierreFrase}>Cada fragancia cuenta una historia. <span>Encuentra la tuya.</span></Aparece>
        <Aparece alVer i={1} className={s.cierreAcciones}>
          <a href="#fragancias" className="btn btn-accion">Ver la colección</a>
          <a href={hablar} target="_blank" rel="noopener noreferrer" className={`btn btn-fantasma ${s.fantasmaClaro}`}>Hablar con Kirei</a>
        </Aparece>
      </section>
    </div>
  );
}
