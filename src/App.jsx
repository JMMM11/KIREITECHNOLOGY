import { lazy, Suspense } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Layout from './components/layout/Layout.jsx';
import Cargando from './components/ui/Cargando.jsx';
import LimiteError from './components/layout/LimiteError.jsx';
import Inicio from './pages/Inicio.jsx';

const Catalogo = lazy(() => import('./pages/Catalogo.jsx'));
const Producto = lazy(() => import('./pages/Producto.jsx'));
const CarritoPagina = lazy(() => import('./pages/CarritoPagina.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Anime = lazy(() => import('./pages/Anime.jsx'));
const Reparaciones = lazy(() => import('./pages/Reparaciones.jsx'));
const Ayuda = lazy(() => import('./pages/Ayuda.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));
const NoEncontrada = lazy(() => import('./pages/NoEncontrada.jsx'));

export default function App() {
  const [ubicacion] = useLocation();
  return (
    <Layout>
      <LimiteError ubicacion={ubicacion}>
        <Suspense fallback={<Cargando />}>
          <Switch>
            <Route path="/" component={Inicio} />
            <Route path="/tecnologia/:categoria?" component={Catalogo} />
            <Route path="/buscar/:q?">{(params) => <Catalogo key={params.q ?? ''} params={params} buscar />}</Route>
            <Route path="/producto/:slug" component={Producto} />
            <Route path="/carrito" component={CarritoPagina} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/anime" component={Anime} />
            <Route path="/reparaciones" component={Reparaciones} />
            <Route path="/ayuda/:seccion?" component={Ayuda} />
            <Route path="/legal/:doc?" component={Legal} />
            <Route component={NoEncontrada} />
          </Switch>
        </Suspense>
      </LimiteError>
    </Layout>
  );
}
