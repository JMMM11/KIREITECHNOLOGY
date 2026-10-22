import { Component } from 'react';
import PantallaEstado from '../ui/PantallaEstado.jsx';
import Icono from '../ui/Icono.jsx';
import { ICONOS } from '../iconos.js';
import { SITIO } from '../../data/sitio.js';

// Si una página falla al mostrarse, enseña una pantalla de marca en vez de dejarla en blanco.
// Al cambiar de ruta se limpia el error para que el resto de la tienda siga funcionando.
export default class LimiteError extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) { return { error }; }

  componentDidCatch(error, info) { console.error(error, info.componentStack); }

  componentDidUpdate(prev) {
    if (this.state.error && prev.ubicacion !== this.props.ubicacion) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <PantallaEstado
        etiqueta="Error"
        titulo="Algo se desconectó."
        texto="Tuvimos un problema al mostrar esta página. Recarga para intentarlo de nuevo o escríbenos si sigue pasando."
      >
        <button type="button" className="btn btn-marca" onClick={() => location.reload()}>Recargar</button>
        <a className="btn btn-fantasma" href={`https://wa.me/${SITIO.whatsapp}`} target="_blank" rel="noopener noreferrer">
          <Icono de={ICONOS.whatsapp.de} mov={ICONOS.whatsapp.mov} entrada={false} tam={18} /> Escríbenos
        </a>
      </PantallaEstado>
    );
  }
}
