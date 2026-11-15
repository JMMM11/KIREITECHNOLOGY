import HeroKirei from '../components/inicio/HeroKirei.jsx';
import QueHacemos from '../components/inicio/QueHacemos.jsx';
import LaptopDesarmable from '../components/inicio/LaptopDesarmable.jsx';
import Marcas from '../components/inicio/Marcas.jsx';
import Garantias from '../components/inicio/Garantias.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

// Portada: presenta lo que Kirei hace y vende. Los productos y los precios viven en cada sección.
export default function Inicio() {
  useTituloPagina(null);
  return (
    <>
      <HeroKirei />
      <QueHacemos />
      <LaptopDesarmable />
      <Marcas />
      <Garantias />
    </>
  );
}
