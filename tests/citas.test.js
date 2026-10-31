import { test } from 'node:test';
import assert from 'node:assert/strict';
import { datosCita, LIMITES_CITA } from '../src/lib/cita.js';
import { crearCita } from '../src/services/tienda.js';

test('la cita guarda solo los campos que aceptan las reglas', () => {
  const c = datosCita({ nombre: '  Ana ', telefono: '6123 4567', dispositivo: 'Laptop', servicio: 'Limpieza', fechaPreferida: '2026-11-03', detalle: 'x'.repeat(2000), acepto: true });
  assert.deepEqual(Object.keys(c).sort(), ['detalle', 'dispositivo', 'estado', 'fechaPreferida', 'nombre', 'servicio', 'telefono']);
  assert.equal(c.nombre, 'Ana');
  assert.equal(c.estado, 'nueva');
  assert.equal(c.detalle.length, LIMITES_CITA.detalle);
  assert.equal(datosCita({ fechaPreferida: 'mañana' }).fechaPreferida, '');
});

test('crearCita sin Firebase queda en la sesión', async () => {
  const c = await crearCita({ nombre: 'Ana', telefono: '61234567', dispositivo: 'Laptop', servicio: 'Limpieza', fechaPreferida: '', detalle: '', acepto: true });
  assert.ok(c.local && c.id.startsWith('CT-'));
  assert.equal('acepto' in c, false);
});
