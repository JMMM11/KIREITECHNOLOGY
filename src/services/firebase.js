// Configuración pública de Firebase: no es secreta, la protección real son las reglas (firestore.rules).
// Los valores vienen de .env.local, que no se sube al repo.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const db = getFirestore(app);
