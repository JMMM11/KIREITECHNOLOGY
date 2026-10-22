import { Link } from 'wouter';
import { motion } from 'motion/react';
import { LEGAL } from '../data/textos.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from './Paginas.module.css';

// Privacidad y términos como pestañas de una sola página. Sin documento elegido, abre Privacidad.
export default function Legal({ params = {} }) {
  const doc = LEGAL.find((d) => d.id === params.doc) ?? LEGAL[0];
  useTituloPagina(doc.tituloLargo);

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
      <motion.article
        key={doc.id}
        className={`contenedor ${s.legalDoc}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className={s.legalTitulo}>{doc.tituloLargo}</h1>
        {doc.parrafos.map((p) => <p key={p}>{p}</p>)}
      </motion.article>
    </>
  );
}
