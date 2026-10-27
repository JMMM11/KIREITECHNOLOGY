// Ayudas puras de la cuenta del cliente (probadas en tests/cuenta.test.js).

const MENSAJES = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'Revisa el correo: debe tener la forma nombre@dominio.com.',
  'auth/email-already-in-use': 'Ya hay una cuenta con ese correo. Entra o recupera tu contraseña.',
  'auth/weak-password': 'La contraseña es muy corta: usa al menos 8 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos y vuelve a probar.',
  'auth/requires-recent-login': 'Por seguridad, sal y vuelve a entrar antes de hacer este cambio.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet y vuelve a intentarlo.',
};

export const mensajeAuth = (error) => MENSAJES[error?.code] ?? 'Algo salió mal. Vuelve a intentarlo.';

export function validarClave(v) {
  return v.length >= 8 ? '' : 'Usa al menos 8 caracteres.';
}

// Firestore guarda fechas como Timestamp; recién creadas aún no traen hora del servidor.
export function fechaCorta(ts) {
  const d = ts?.toDate?.() ?? (ts ? new Date(ts) : null);
  return d ? new Intl.DateTimeFormat('es-PA', { day: 'numeric', month: 'short', year: 'numeric' }).format(d) : 'Hace un momento';
}

// Número legible para WhatsApp y para el cliente, sin datos personales.
export const numeroPedido = (ahora = Date.now()) => `KT-${ahora.toString(36).slice(-6).toUpperCase()}`;

// Recibido → confirmado → enviado → entregado. Cancelado corta la línea.
export const PASOS_PEDIDO = ['recibido', 'confirmado', 'enviado', 'entregado'];
export const pasoPedido = (estado) => PASOS_PEDIDO.indexOf(estado);
