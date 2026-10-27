// Los estilos globales van primero para que los módulos de cada componente puedan ajustarlos.
import './styles/tokens.css';
import './styles/base.css';
import './styles/iconos.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { MotionConfig } from 'motion/react';
import { DatosProvider } from './context/DatosContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { CuentaProvider } from './context/CuentaContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router hook={useHashLocation}>
      <MotionConfig reducedMotion="user">
        <DatosProvider>
          <CuentaProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </CuentaProvider>
        </DatosProvider>
      </MotionConfig>
    </Router>
  </StrictMode>,
);
