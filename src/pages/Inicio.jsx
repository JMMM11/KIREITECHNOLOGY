import HeroZoom from '../components/inicio/HeroZoom.jsx';
import SeccionesInicio from '../components/inicio/SeccionesInicio.jsx';
import MasPedidos from '../components/inicio/MasPedidos.jsx';
import Garantias from '../components/inicio/Garantias.jsx';
import ReparacionesInicio from '../components/inicio/ReparacionesInicio.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

export default function Inicio() {
  useTituloPagina(null);
  return (
    <>
      <HeroZoom />
      <SeccionesInicio />
      <MasPedidos />
      <Garantias />
      <ReparacionesInicio />
    </>
  );
}
