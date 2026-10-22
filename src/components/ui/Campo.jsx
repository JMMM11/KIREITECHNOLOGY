import { useId } from 'react';
import Icono from './Icono.jsx';
import { ICONOS } from '../iconos.js';

// Campo con etiqueta arriba, ayuda opcional y error debajo, conectados con aria-describedby.
export default function Campo({ etiqueta, opcional, ayuda, error, como = 'input', children, ...props }) {
  const id = useId();
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const C = como;
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}{opcional && <span className="suave"> (opcional)</span>}</label>
      {ayuda && <p id={idAyuda} className="ayuda">{ayuda}</p>}
      <C
        id={id}
        className="entrada"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[idAyuda, idError].filter(Boolean).join(' ') || undefined}
        {...props}
      >
        {children}
      </C>
      {error && (
        <p id={idError} className="error-campo">
          <Icono de={ICONOS.info.de} mov="sacudir" entrada={false} tam={16} />{error}
        </p>
      )}
    </div>
  );
}
