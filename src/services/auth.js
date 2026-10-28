// Una sola instancia de Firebase Auth para el panel y las cuentas de clientes.
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { app, conEmulador } from './firebase.js';

export const auth = getAuth(app);
if (conEmulador) connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
