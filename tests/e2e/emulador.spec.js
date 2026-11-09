// Aislamiento entre cuentas desde la interfaz, con Firebase Auth y Firestore emulados (reglas reales).
// npm run test:e2e:emulador (necesita Java). No toca la base de datos real.
import { expect, test } from '@playwright/test';

const FIRESTORE = 'http://127.0.0.1:8080/v1/projects/demo-kirei/databases/(default)/documents';
const AUTH = 'http://127.0.0.1:9099/emulator/v1/projects/demo-kirei';
// "Bearer owner" solo existe en el emulador: deja preparar datos saltándose las reglas.
const DUENO_EMULADOR = { Authorization: 'Bearer owner', 'Content-Type': 'application/json' };

test.beforeAll(async ({ request }) => {
  await request.delete(`${FIRESTORE.replace('/v1/', '/emulator/v1/')}`);
  await request.delete(`${AUTH}/accounts`);
  await request.post(`${FIRESTORE}/productos?documentId=audifonos-prueba`, {
    headers: DUENO_EMULADOR,
    data: { fields: {
      nombre: { stringValue: 'Audífonos de prueba' }, categoriaId: { stringValue: 'audifonos' }, precioCentavos: { integerValue: '2000' },
      estado: { stringValue: 'publicado' }, descripcion: { stringValue: 'Producto de prueba.' }, fotos: { arrayValue: {} },
    } },
  });
});

async function crearCuenta(page, nombre, correo) {
  await page.goto('/cuenta');
  await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill(nombre);
  await page.getByRole('textbox', { name: 'Correo', exact: true }).fill(correo);
  await page.locator('input[type="password"]').fill('clave-segura-123');
  await page.getByRole('button', { name: 'Crear mi cuenta' }).click();
  await expect(page.getByText(`Hola, ${nombre}`).first()).toBeVisible({ timeout: 15000 });
}

test('una cuenta no ve el pedido de otra ni entra al panel', async ({ browser }) => {
  // Ana compra con su cuenta.
  const ana = await (await browser.newContext()).newPage();
  await ana.context().route(/wa\.me|whatsapp\.com/, (r) => r.fulfill({ status: 200, body: 'ok' }));
  await crearCuenta(ana, 'Ana', 'ana@ejemplo.com');
  await ana.goto('/producto/audifonos-prueba');
  await ana.getByRole('button', { name: 'Agregar al carrito' }).click();
  await ana.goto('/checkout');
  await ana.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Ana Pérez');
  await ana.locator('input[type="tel"]').fill('6123 4567');
  await ana.getByRole('button', { name: /Continuar a entrega/ }).click();
  await ana.getByRole('button', { name: /Continuar a pago/ }).click();
  await ana.getByRole('checkbox', { name: /acepto que Kirei Technology/i }).check();
  const ventana = ana.context().waitForEvent('page');
  await ana.getByRole('button', { name: /Enviar pedido/ }).click();
  await (await ventana).close();
  await expect(ana.getByRole('heading', { name: 'Pedido KT-1001 recibido.' })).toBeVisible();
  await ana.goto('/cuenta/pedidos/KT-1001');
  await expect(ana.getByText('Audífonos de prueba').first()).toBeVisible();

  // Beto, con otra cuenta, prueba la misma dirección y el panel.
  const beto = await (await browser.newContext()).newPage();
  await crearCuenta(beto, 'Beto', 'beto@ejemplo.com');
  await beto.goto('/cuenta/pedidos/KT-1001');
  await expect(beto.getByText('No encontramos ese pedido.')).toBeVisible();
  await expect(beto.getByText('Audífonos de prueba')).toHaveCount(0);
  await expect(beto.getByText('Ir al panel de administración')).toHaveCount(0);
  await beto.goto('/admin');
  await expect(beto.getByRole('heading', { name: 'Sin acceso al panel' })).toBeVisible();

  // Y lo que la interfaz no muestra tampoco se puede pedir directo a la base de datos con la sesión de Beto.
  const { token, uid } = await beto.evaluate(async () => {
    const db = await new Promise((listo) => { const r = indexedDB.open('firebaseLocalStorageDb'); r.onsuccess = () => listo(r.result); });
    const todo = await new Promise((listo) => { const q = db.transaction('firebaseLocalStorage').objectStore('firebaseLocalStorage').getAll(); q.onsuccess = () => listo(q.result); });
    const sesion = todo.find((x) => x.value?.stsTokenManager)?.value;
    return { token: sesion?.stsTokenManager.accessToken, uid: sesion?.uid };
  });
  expect(token).toBeTruthy();
  const conBeto = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const leer = await beto.request.get(`${FIRESTORE}/pedidos/KT-1001`, { headers: conBeto });
  expect(leer.status()).toBe(403);
  const hacerseAdmin = await beto.request.patch(`${FIRESTORE}/admins/${uid}`, { headers: conBeto, data: { fields: { nombre: { stringValue: 'Beto' }, correo: { stringValue: '' } } } });
  const subirPrecio = await beto.request.patch(`${FIRESTORE}/productos/audifonos-prueba?updateMask.fieldPaths=precioCentavos`, { headers: conBeto, data: { fields: { precioCentavos: { integerValue: '1' } } } });
  expect(subirPrecio.status()).toBe(403);
  expect(hacerseAdmin.status()).toBe(403);
});

test('un admin ve el resumen y cambia unidades en inventario', async ({ browser }) => {
  const admin = await (await browser.newContext()).newPage();
  await crearCuenta(admin, 'Carla', 'carla@prueba.test');
  const uid = await admin.evaluate(async () => {
    const db = await new Promise((listo) => { const r = indexedDB.open('firebaseLocalStorageDb'); r.onsuccess = () => listo(r.result); });
    const todo = await new Promise((listo) => { const q = db.transaction('firebaseLocalStorage').objectStore('firebaseLocalStorage').getAll(); q.onsuccess = () => listo(q.result); });
    return todo.find((x) => x.value?.stsTokenManager)?.value.uid;
  });
  await admin.request.patch(`${FIRESTORE}/admins/${uid}`, { headers: DUENO_EMULADOR, data: { fields: { nombre: { stringValue: 'Carla' } } } });

  await admin.goto('/admin');
  await expect(admin.getByRole('heading', { name: 'Resumen' })).toBeVisible({ timeout: 15000 });
  await expect(admin.getByRole('heading', { name: 'Ventas por mes' })).toBeVisible();
  if (process.env.CAPTURAS) await admin.screenshot({ path: 'test-results/panel-resumen.png', fullPage: true });

  await admin.getByRole('button', { name: 'Inventario', exact: true }).click();
  const campo = admin.getByLabel('Unidades de Audífonos de prueba');
  await campo.fill('2');
  await admin.getByRole('button', { name: 'Guardar' }).first().click();
  await expect(admin.getByText('Guardado.')).toBeVisible();
  if (process.env.CAPTURAS) await admin.screenshot({ path: 'test-results/panel-inventario.png', fullPage: true });
  const doc = await admin.request.get(`${FIRESTORE}/productos/audifonos-prueba`, { headers: DUENO_EMULADOR });
  expect((await doc.json()).fields.stock.integerValue).toBe('2');
});
