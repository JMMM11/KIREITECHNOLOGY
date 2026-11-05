import { Link } from 'wouter';
import { useCuenta } from '../../context/CuentaContext.jsx';
import s from './Layout.module.css';

// Solo para cuentas de administrador: vuelta directa al panel desde cualquier página de la tienda.
export default function BarraAdmin() {
  const { esAdmin } = useCuenta();
  if (!esAdmin) return null;
  return (
    <div className={s.barraAdmin}>
      <div className={`contenedor ${s.barraAdminInterior}`}>
        <p>Estás viendo la tienda como administrador.</p>
        <Link href="/admin" className="btn btn-accion">Ir al panel de administración</Link>
      </div>
    </div>
  );
}
