import { lazy } from 'react';
import PantallaEstado from '../components/ui/PantallaEstado.jsx';
import { conFirebase } from '../services/tienda.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';

// Firebase solo se carga si está configurado; sin claves, getAuth fallaría al abrir el panel.
const PanelAdmin = lazy(() => import('../components/admin/PanelAdmin.jsx'));

export default function Admin() {
  useTituloPagina('Administración');
  if (conFirebase) return <PanelAdmin />;
  return (
    <PantallaEstado etiqueta="Administración" titulo="Falta conectar Firebase." texto="Copia .env.example como .env.local, llena las claves de Firebase y vuelve a iniciar la web." />
  );
}
