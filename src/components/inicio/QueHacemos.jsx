import { Link } from 'wouter';
import Aparece from '../ui/Aparece.jsx';
import Foto from '../ui/Foto.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS, ICONOS_CATEGORIA } from '../iconos.js';
import { CATEGORIAS } from '../../data/catalogos.js';
import { PRODUCTOS } from '../../data/productos.js';
import { SITIO } from '../../data/sitio.js';
import s from './QueHacemos.module.css';

// Foto de ambiente de la tienda: los thinkplus en sus colores.
const ESCENA = PRODUCTOS.find((p) => p.id === 'lenovo-thinkplus-xt62')?.fotos[4];
const CATEGORIAS_TECNO = CATEGORIAS.filter((c) => c.seccion === 'tecnologia' && c.visible);
const aviso = (seccion) => `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(`Hola Kirei, avísenme cuando abran la sección ${seccion}.`)}`;

// Introducción de la portada: qué hace y qué vende Kirei. La compra ocurre en cada sección, no aquí.
export default function QueHacemos() {
  return (
    <section className={`seccion ${s.seccion}`} aria-labelledby="que-hacemos">
      <div className="contenedor">
        <div className={s.encabezado}>
          <Aparece alVer como="h2" id="que-hacemos" className={s.titulo}>Lo que hacemos.</Aparece>
          <Aparece alVer como="p" i={1} className={s.bajada}>Vendemos tecnología, reparamos tu computadora y muy pronto sumamos perfumes.</Aparece>
        </div>

        <div className={s.rejilla}>
          <Aparece alVer como="article" className={`${s.tarjeta} ${s.tecno}`} aria-labelledby="t-tecno">
            <div className={s.fotoFondo}>{ESCENA && <Foto foto={ESCENA} alt="" sizes="(min-width: 900px) 52vw, 92vw" />}</div>
            <div className={s.velo} />
            <div className={s.contenido}>
              <h3 id="t-tecno" className={s.nombre}>Tecnología</h3>
              <p className={s.texto}>Audífonos, relojes y accesorios con garantía. Aquí están los productos, con sus fotos, sus colores y sus precios.</p>
              <ul className={s.categorias}>
                {CATEGORIAS_TECNO.map((c) => {
                  const ic = ICONOS_CATEGORIA[c.id];
                  return (
                    <li key={c.id}>
                      <Link href={`/tecnologia/${c.id}`} className={s.chip}>
                        {ic && <Icono de={ic.de} mov={ic.mov} entrada={false} tam={16} />}{c.nombre}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/tecnologia" className={s.enlaceClaro}>Ver tecnología <span aria-hidden="true">›</span></Link>
            </div>
          </Aparece>

          <div className={s.columna}>
            <Aparece alVer como="article" i={1} className={`${s.tarjeta} ${s.taller} tema-taller`} aria-labelledby="t-taller">
              <Icono de={ICONOS.reparar.de} mov={ICONOS.reparar.mov} entrada={false} tam={28} />
              <h3 id="t-taller" className={s.nombre}>Reparaciones</h3>
              <p className={s.texto}>Diagnóstico, pantalla, batería, teclado y Windows. Mira cómo trabajamos.</p>
              <Link href="/reparaciones" className={s.enlaceClaro}>Ver reparaciones <span aria-hidden="true">›</span></Link>
            </Aparece>

            <div className={s.par}>
              <Aparece alVer como="article" i={2} className={`${s.tarjeta} ${s.aroma} tema-aroma`} aria-labelledby="t-aroma">
                <Icono de={ICONOS_CATEGORIA.aroma.de} mov={ICONOS_CATEGORIA.aroma.mov} entrada={false} tam={28} />
                <h3 id="t-aroma" className={s.nombre}>Aroma</h3>
                <p className={s.texto}>Perfumes y fragancias.</p>
                <span className={s.pronto}>Próximamente</span>
                <Link href="/aroma" className={s.enlace}>Conocer <span aria-hidden="true">›</span></Link>
              </Aparece>
              <Aparece alVer como="article" i={3} className={`${s.tarjeta} ${s.anime}`} aria-labelledby="t-anime">
                <Icono de={ICONOS_CATEGORIA.anime.de} mov={ICONOS_CATEGORIA.anime.mov} entrada={false} tam={28} />
                <h3 id="t-anime" className={s.nombre}>Anime</h3>
                <p className={s.texto}>Accesorios de tus series favoritas.</p>
                <Link href="/anime" className={s.enlaceClaro}>Ver anime <span aria-hidden="true">›</span></Link>
              </Aparece>
            </div>
          </div>
        </div>
        <p className={s.pie}>
          ¿Quieres que te avisemos cuando abra Aroma?{' '}
          <a href={aviso('Aroma')} target="_blank" rel="noopener noreferrer" className="enlace">Escríbenos por WhatsApp</a>.
        </p>
      </div>
    </section>
  );
}
