// Pruebas E2E en un navegador real. npm run test:e2e
// "tienda": compila sin Firebase (productos de src/data/) y no toca la base real.
// "emulador": cuentas y reglas reales contra los emuladores de Firebase (npm run test:e2e:emulador, necesita Java).
import { defineConfig, devices } from '@playwright/test';

// emulators:exec define FIREBASE_AUTH_EMULATOR_HOST: así npm run test:e2e:emulador elige estas pruebas en cualquier terminal.
const conEmulador = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST);
const puerto = conEmulador ? 5191 : 5190;
const entorno = conEmulador
  ? { VITE_FIREBASE_PROJECT_ID: 'demo-kirei', VITE_FIREBASE_API_KEY: 'demo', VITE_FIREBASE_AUTH_DOMAIN: 'localhost', VITE_FIREBASE_APP_ID: 'demo', VITE_FIREBASE_EMULADOR: 'true' }
  : { VITE_FIREBASE_PROJECT_ID: '' };

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: conEmulador ? /emulador\.spec\.js/ : /tienda\.spec\.js/,
  fullyParallel: !conEmulador,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${puerto}`, channel: 'chrome', trace: 'retain-on-failure' },
  projects: conEmulador
    ? [{ name: 'emulador', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }]
    : [
      { name: 'escritorio', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
      { name: 'celular', use: { ...devices['Pixel 7'], channel: 'chrome' } },
    ],
  webServer: {
    command: `node scripts/compilar.mjs && npx vite preview --outDir ../${conEmulador ? '_e2e_emulador' : '_e2e'} --port ${puerto} --strictPort`,
    port: puerto,
    reuseExistingServer: false,
    timeout: 180000,
    env: { ...entorno, BASE_PATH: '/', SALIDA: conEmulador ? '_e2e_emulador' : '_e2e', MSYS_NO_PATHCONV: '1' },
  },
});
