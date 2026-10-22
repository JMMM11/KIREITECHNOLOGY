// Validación en el borde. Cada regla devuelve un mensaje que dice qué falta y cómo arreglarlo, o '' si está bien.
export function validarNombre(v) {
  return v.trim().length >= 2 ? '' : 'Escribe tu nombre para saber a quién entregar.';
}

export function normalizarTelefono(v) {
  return v.replace(/\D/g, '').replace(/^507/, '');
}

export function validarTelefono(v) {
  if (!v.trim()) return 'Escribe tu teléfono para coordinar la entrega.';
  return /^\d{7,8}$/.test(normalizarTelefono(v)) ? '' : 'Usa un número de Panamá de 7 u 8 dígitos, por ejemplo 6123 4567.';
}

export function validarCorreo(v, { obligatorio = false } = {}) {
  if (!v.trim()) return obligatorio ? 'Escribe tu correo.' : '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revisa el correo: debe tener la forma nombre@dominio.com.';
}

export function validarRequerido(v, mensaje) {
  return String(v ?? '').trim() ? '' : mensaje;
}

// Recorre { campo: mensajeError } y devuelve solo los campos con error.
export function errores(mapa) {
  return Object.fromEntries(Object.entries(mapa).filter(([, m]) => m));
}
