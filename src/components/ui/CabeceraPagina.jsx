import Aparece from './Aparece.jsx';
import s from './CabeceraPagina.module.css';

// Título, bajada y extras entran escalonados con la misma entrada de la portada.
export default function CabeceraPagina({ titulo, texto, children }) {
  return (
    <header className={`contenedor ${s.cabecera}`}>
      <Aparece como="h1" className="display">{titulo}</Aparece>
      {texto && <Aparece como="p" i={1} className="sub">{texto}</Aparece>}
      {children}
    </header>
  );
}
