// Productos vistos recientemente: solo en este navegador, nunca salen de él.
const CLAVE = 'kirei:vistos';

export function leerVistos() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) ?? []; } catch { return []; }
}

export function registrarVisto(id) {
  try { localStorage.setItem(CLAVE, JSON.stringify([id, ...leerVistos().filter((x) => x !== id)].slice(0, 12))); } catch { /* modo privado: no pasa nada */ }
}
