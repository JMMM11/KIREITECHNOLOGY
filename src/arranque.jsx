// Los estilos globales van primero para que los módulos de cada componente puedan ajustarlos.
import './styles/tokens.css';
import './styles/base.css';
import './styles/iconos.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { MotionConfig } from 'motion/react';
import { DatosProvider } from './context/DatosContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { CuentaProvider } from './context/CuentaContext.jsx';
import App from './App.jsx';
import { iniciarMonitoreo } from './lib/monitoreo.js';

iniciarMonitoreo();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
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
