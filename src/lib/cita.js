// Forma de una cita en Firestore "citas". Los límites deben coincidir con firestore.rules.
export const LIMITES_CITA = { nombre: 80, telefono: 20, dispositivo: 40, servicio: 80, detalle: 1000 };
export const ESTADOS_CITA = ['nueva', 'confirmada', 'completada', 'cancelada'];

const corto = (v, max) => String(v ?? '').trim().slice(0, max);

// Solo los campos que aceptan las reglas: la casilla "acepto" no se guarda.
export function datosCita(f) {
  return {
    nombre: corto(f.nombre, LIMITES_CITA.nombre),
    telefono: corto(f.telefono, LIMITES_CITA.telefono),
    dispositivo: corto(f.dispositivo, LIMITES_CITA.dispositivo),
    servicio: corto(f.servicio, LIMITES_CITA.servicio),
    fechaPreferida: /^\d{4}-\d{2}-\d{2}$/.test(f.fechaPreferida ?? '') ? f.fechaPreferida : '',
    detalle: corto(f.detalle, LIMITES_CITA.detalle),
    estado: 'nueva',
  };
}
