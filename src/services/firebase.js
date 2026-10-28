// Configuración pública de Firebase: no es secreta, la protección real son las reglas (firestore.rules).
// Los valores vienen de .env.local, que no se sube al repo.
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

export const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const db = getFirestore(app);

// Solo para pruebas locales (npx firebase-tools emulators:start): VITE_FIREBASE_EMULADOR=true en .env.local.
export const conEmulador = import.meta.env.VITE_FIREBASE_EMULADOR === 'true';
if (conEmulador) connectFirestoreEmulator(db, '127.0.0.1', 8080);
