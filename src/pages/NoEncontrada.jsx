import { Link } from 'wouter';
import PantallaEstado, { Pantalla404Arte } from '../components/ui/PantallaEstado.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

export default function NoEncontrada() {
  useTituloPagina('Página no encontrada');
  return (
    <PantallaEstado
      arte={<Pantalla404Arte />}
      etiqueta="Error 404"
      titulo="Aquí no hay señal."
      texto="La página que buscas no existe o cambió de lugar. Revisa el enlace o sigue por aquí."
    >
      <Link href="/" className="btn btn-marca">Ir al inicio</Link>
      <Link href="/tecnologia" className="btn btn-fantasma">Ver tecnología</Link>
    </PantallaEstado>
  );
}
