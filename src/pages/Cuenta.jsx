import { Link } from 'wouter';
import Acceso from '../components/cuenta/Acceso.jsx';
import Pedidos from '../components/cuenta/Pedidos.jsx';
import { Direcciones, Favoritos, Perfil, Seguridad } from '../components/cuenta/Secciones.jsx';
import Icono from '../components/ui/Icono.jsx';
import PantallaEstado from '../components/ui/PantallaEstado.jsx';
import { ICONOS } from '../components/iconos.js';
import { conFirebase } from '../services/tienda.js';
import { formatoPrecio } from '../lib/formatoPrecio.js';
import { useCuenta } from '../context/CuentaContext.jsx';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import s from '../components/cuenta/Cuenta.module.css';

const MENU = [
  { id: 'perfil', titulo: 'Mi perfil', texto: 'Nombre, correo y teléfono.', icono: ICONOS.perfil, vista: Perfil },
  { id: 'pedidos', titulo: 'Mis pedidos', texto: 'Tus compras y su estado.', icono: ICONOS.pedidos, vista: Pedidos },
  { id: 'favoritos', titulo: 'Mis favoritos', texto: 'Los productos que guardaste.', icono: ICONOS.favorito, vista: Favoritos },
  { id: 'direcciones', titulo: 'Mis direcciones', texto: 'Dónde recibir tus pedidos.', icono: ICONOS.ubicacion, vista: Direcciones },
  { id: 'seguridad', titulo: 'Seguridad', texto: 'Contraseña, privacidad y sesión.', icono: ICONOS.seguridad, vista: Seguridad },
];

// Inicio de la cuenta: actividad arriba y un acceso claro para volver a comprar.
function Resumen() {
  const { perfil } = useCuenta();
  const { articulos, subtotal } = useCarrito();
  return (
    <div className={s.resumen}>
      <h2 className={s.grupoTitulo}>Mi actividad</h2>
      <div className={s.actividad}>
        <Link href="/cuenta/pedidos" className={s.tarjetaActividad}>
          <Icono de={ICONOS.pedidos.de} mov={ICONOS.pedidos.mov} tam={22} />
          <strong>Mis pedidos</strong>
          <span className="suave chico">Consulta tus compras y su estado.</span>
        </Link>
        <Link href="/cuenta/favoritos" className={s.tarjetaActividad}>
          <Icono de={ICONOS.favorito.de} mov={ICONOS.favorito.mov} tam={22} />
          <strong>Favoritos</strong>
          <span className="suave chico">{perfil.favoritos.length === 1 ? '1 producto guardado.' : `${perfil.favoritos.length} productos guardados.`}</span>
        </Link>
      </div>
      <div className={s.seguir}>
        {articulos > 0 ? (
          <>
            <p><strong>Tienes {articulos} {articulos === 1 ? 'producto' : 'productos'} en el carrito</strong> por {formatoPrecio(subtotal)}.</p>
            <Link href="/checkout" className="btn btn-accion">Terminar mi compra</Link>
          </>
        ) : (
          <>
            <p><strong>Sigue comprando.</strong> Audífonos, relojes y accesorios con garantía.</p>
            <Link href="/tecnologia" className="btn btn-accion">Explorar tecnología</Link>
          </>
        )}
      </div>
    </div>
  );
}

function Panel({ seccion, id }) {
  const { usuario, perfil, cuenta } = useCuenta();
  const actual = MENU.find((m) => m.id === seccion);
  const Vista = actual?.vista ?? Resumen;
  const nombre = perfil.nombre || usuario.email;

  return (
    <div className={`contenedor ${s.panel}`} data-seccion={actual ? 'si' : 'no'}>
      <header className={s.saludo}>
        <span className={s.avatar} aria-hidden="true">{nombre.charAt(0).toUpperCase()}</span>
        <div>
          <h1 className={s.hola}>Hola, {nombre.split(' ')[0]}</h1>
          <p className="suave chico">{usuario.email}</p>
        </div>
      </header>

      <nav className={s.lateral} aria-label="Mi cuenta">
        <h2 className={`${s.grupoTitulo} ${s.soloMovil}`}>Mi cuenta</h2>
        <ul className={s.menu}>
          {MENU.map((m) => (
            <li key={m.id}>
              <Link href={`/cuenta/${m.id}`} className={s.opcion} aria-current={m.id === seccion ? 'page' : undefined}>
                <Icono de={m.icono.de} mov={m.icono.mov} entrada={false} tam={20} />
                <span className={s.opcionTexto}><strong>{m.titulo}</strong><span className={`suave chico ${s.soloMovil}`}>{m.texto}</span></span>
                <Icono de={ICONOS.abrir.de} mov={ICONOS.abrir.mov} entrada={false} tam={16} className={s.soloMovil} />
              </Link>
            </li>
          ))}
          <li>
            <button type="button" className={s.opcion} onClick={() => cuenta().then((m) => m.salir())}>
              <Icono de={ICONOS.salir.de} mov={ICONOS.salir.mov} entrada={false} tam={20} />
              <span className={s.opcionTexto}><strong>Cerrar sesión</strong></span>
            </button>
          </li>
        </ul>
      </nav>

      <section className={s.contenido} aria-label={actual?.titulo ?? 'Resumen de mi cuenta'}>
        {actual && (
          <Link href="/cuenta" className={`${s.volver} ${s.soloMovil}`}>
            <Icono de={ICONOS.anterior.de} mov={ICONOS.anterior.mov} entrada={false} tam={16} /> Mi cuenta
          </Link>
        )}
        <Vista id={id} />
      </section>
    </div>
  );
}

export default function Cuenta({ params }) {
  const { usuario } = useCuenta();
  useTituloPagina('Mi cuenta');
  if (!conFirebase) {
    return <PantallaEstado etiqueta="Mi cuenta" titulo="Las cuentas aún no están activas." texto="Mientras tanto, haz tu pedido por WhatsApp y te atendemos al momento." />;
  }
  if (usuario === undefined) {
    return (
      <div className={`contenedor ${s.panel}`} role="status">
        <span className="sr-only">Cargando tu cuenta</span>
        <span className={s.esqueletoFila} aria-hidden="true" />
        <span className={s.esqueletoFila} aria-hidden="true" />
      </div>
    );
  }
  return usuario ? <Panel seccion={params.seccion} id={params.id} /> : <Acceso />;
}
