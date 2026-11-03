import { useEffect, useId, useState } from 'react';
import { Link } from 'wouter';
import { useCuenta } from '../../context/CuentaContext.jsx';
import { conFirebase } from '../../services/tienda.js';
import { fechaCorta } from '../../lib/cuenta.js';
import s from './Comentarios.module.css';

// Firestore se descarga solo cuando hace falta, como en el resto de la tienda.
const servicio = () => Promise.all([import('../../services/firebase.js'), import('../../services/comentarios.js')])
  .then(([f, c]) => ({ db: f.db, c }));

// Solo nombre y la inicial del apellido: el comentario es público.
const nombrePublico = (nombre) => {
  const [primero, segundo] = nombre.split(/\s+/);
  return (segundo ? `${primero} ${segundo[0]}.` : primero).slice(0, 40);
};

export default function Comentarios({ productoId }) {
  const { usuario, perfil } = useCuenta();
  const idTexto = useId();
  const [lista, setLista] = useState(null);
  const [errorLista, setErrorLista] = useState(false);
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    if (!conFirebase) return;
    servicio().then(({ db, c }) => c.comentariosPublicados(db, productoId))
      .then((l) => { setLista(l); setErrorLista(false); })
      .catch(() => { setLista([]); setErrorLista(true); });
  }, [productoId]);

  if (!conFirebase) return null;

  async function enviar(e) {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    setEstado('enviando');
    try {
      const { db, c } = await servicio();
      const nombre = nombrePublico(perfil?.nombre?.trim() || usuario.displayName?.trim() || 'Cliente');
      await c.enviarComentario(db, { productoId, uid: usuario.uid, nombre, texto: limpio });
      setTexto('');
      setEstado('enviado');
    } catch { setEstado('error'); }
  }

  return (
    <section className={s.seccion} aria-labelledby="comentarios-titulo">
      <h2 id="comentarios-titulo" className="titulo">Comentarios</h2>
      {lista === null && <p className="suave">Cargando comentarios...</p>}
      {errorLista && <p className="error-campo" role="alert">No pudimos cargar los comentarios. Recarga la página para intentarlo de nuevo.</p>}
      {lista?.length === 0 && !errorLista && <p className="suave">Todavía no hay comentarios sobre este producto.</p>}
      {lista?.length > 0 && (
        <ul className={s.lista}>
          {lista.map((c) => (
            <li key={c.id} className={s.item}>
              <p><strong>{c.nombre}</strong> <span className="suave chico">· {fechaCorta(c.creadoEn)}</span></p>
              <p className="suave">{c.texto}</p>
            </li>
          ))}
        </ul>
      )}
      {usuario ? (
        <form className={s.formulario} onSubmit={enviar}>
          <label className="leyenda" htmlFor={idTexto}>Escribe tu comentario</label>
          <textarea id={idTexto} className="entrada" rows={3} maxLength={500} value={texto} onChange={(e) => setTexto(e.target.value)} required />
          <button type="submit" className="btn btn-fantasma" disabled={estado === 'enviando'}>{estado === 'enviando' ? 'Enviando...' : 'Enviar comentario'}</button>
          {estado === 'enviado' && <p className="suave chico" role="status">Gracias. Lo publicaremos después de revisarlo.</p>}
          {estado === 'error' && <p className="error-campo" role="alert">No pudimos enviarlo. Revisa tu conexión.</p>}
        </form>
      ) : (
        <p className="suave">Para comentar, <Link href="/cuenta" className="enlace">entra a tu cuenta</Link>.</p>
      )}
    </section>
  );
}
