import { Link } from 'wouter';
import Aparece from '../components/ui/Aparece.jsx';
import { LEGAL } from '../data/textos.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Paginas.module.css';

// Privacidad, términos, envíos y devoluciones como pestañas de una sola página. Sin documento elegido, abre Privacidad.
export default function Legal({ params = {} }) {
  const doc = LEGAL.find((d) => d.id === params.doc) ?? LEGAL[0];
  useTituloPagina(doc.tituloLargo, doc.descripcion);

  return (
    <>
      <div className={s.legalBarra}>
        <div className={`contenedor ${s.legalBarraInterior}`}>
          <p className={s.legalMarca}>Legal</p>
          <nav aria-label="Documentos legales">
            <ul className={s.legalPestanas}>
              {LEGAL.map((d) => (
                <li key={d.id}>
                  <Link href={`/legal/${d.id}`} className={s.legalPestana} aria-current={d.id === doc.id ? 'page' : undefined}>{d.titulo}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <Aparece como="article" key={doc.id} className={`contenedor ${s.legalDoc}`}>
        <h1 className={s.legalTitulo}>{doc.tituloLargo}</h1>
        {doc.parrafos.map((item, i) =>
          Array.isArray(item)
            ? <ul key={i} className={s.legalLista}>{item.map((li, j) => <li key={j}>{li}</li>)}</ul>
            : item.startsWith('## ')
            ? <h2 key={i} className={s.legalSeccion}>{item.slice(3)}</h2>
            : <p key={i}>{item}</p>
        )}
      </Aparece>
    </>
  );
}
