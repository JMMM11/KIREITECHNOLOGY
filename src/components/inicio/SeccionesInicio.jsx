import { Link } from 'wouter';
import Foto from '../ui/Foto.jsx';
import MiniaturaCategoria from '../ui/MiniaturaCategoria.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { SECCIONES } from '../../data/catalogos.js';
import { INICIO } from '../../data/textos.js';
import { SITIO } from '../../data/sitio.js';
import { useDatos } from '../../context/DatosContext.jsx';
import s from './Inicio.module.css';

// Las dos secciones de la tienda, una al lado de la otra.
export default function SeccionesInicio() {
  const { productos, categorias, productoPorId } = useDatos();
  const [tecno, anime] = SECCIONES;
  const subcategorias = categorias.filter((c) => c.seccion === 'tecnologia');
  const cuantos = (seccion) => productos.filter((p) => categorias.find((c) => c.id === p.categoriaId)?.seccion === seccion).length;
  // Foto de ambiente: los thinkplus en sus colores.
  const escena = productoPorId('lenovo-thinkplus-xt62')?.fotos[4];
  const hayAnime = cuantos('anime') > 0;

  return (
    <section className={`seccion ${s.pegado}`} aria-labelledby="secciones-titulo">
      <div className="contenedor">
        <h2 id="secciones-titulo" className={`titulo ${s.tituloSeccion}`}>{INICIO.secciones.titulo}</h2>
        <div className={s.secciones}>
          <article className={s.seccionTecno} aria-labelledby="sec-tecno">
            <div className={s.seccionTexto}>
              <h3 id="sec-tecno" className={s.seccionNombre}>{tecno.nombre}</h3>
              <p className="suave">{tecno.frase}. {cuantos('tecnologia')} productos.</p>
              <ul className={s.categorias}>
                {subcategorias.map((c) => (
                  <li key={c.id}>
                    <Link href={`/tecnologia/${c.id}`} className={s.categoria}>
                      <MiniaturaCategoria categoriaId={c.id} tam={76} className={s.categoriaFoto} />
                      <span>{c.nombre}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={tecno.ruta} className="btn btn-marca">Ver tecnología</Link>
            </div>
            <div className={s.seccionEscena}>
              {escena && <Foto foto={escena} alt="" sizes="(min-width: 900px) 30vw, 90vw" />}
            </div>
          </article>

          <article className={s.seccionAnime} aria-labelledby="sec-anime">
            <h3 id="sec-anime" className={s.seccionNombre}>{anime.nombre}</h3>
            <p className={s.animeTexto}>{hayAnime ? `${anime.frase}.` : `Próximamente: ${anime.frase.toLowerCase()}.`}</p>
            {hayAnime
              ? <Link href={anime.ruta} className="btn btn-fantasma">Ver anime</Link>
              : (
                <a className="btn btn-fantasma" href={`https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent('Hola Kirei, avísenme cuando abran la sección Anime.')}`} target="_blank" rel="noopener noreferrer">
                  <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> Avísame
                </a>
              )}
          </article>
        </div>
      </div>
    </section>
  );
}
