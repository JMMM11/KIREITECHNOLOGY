// Flujos completos de cliente en un navegador real, sin Firebase (productos de src/data/). npm run test:e2e
import { expect, test } from '@playwright/test';

// Errores de consola o archivos que no cargan hacen fallar la prueba: la tienda no debe tener ninguno.
test.beforeEach(async ({ page }, info) => {
  info.errores = [];
  page.on('pageerror', (e) => info.errores.push(`excepción: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') info.errores.push(`consola: ${m.text()}`); });
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('wa.me')) info.errores.push(`${r.status()} ${r.url()}`); });
});
test.afterEach(async ({}, info) => { expect(info.errores, 'errores en la página').toEqual([]); });

const precio = (page) => page.getByRole('main').locator('p').filter({ hasText: /^\$|^Desde \$/ }).first();

test('la portada carga con sus secciones y el carrusel de marcas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tecnología que te acompaña');
  await expect(page.getByRole('heading', { name: 'Marcas con las que trabajamos.' })).toBeVisible();
  const marcas = page.locator('#marcas-pista');
  await marcas.scrollIntoViewIfNeeded();
  await expect(marcas.getByRole('img', { name: 'Lenovo' })).toBeVisible();
  const siguiente = page.locator('section', { has: page.locator('#marcas-titulo') }).getByRole('button', { name: 'Ver más' });
  if (await siguiente.isEnabled()) {
    await siguiente.click();
    await expect.poll(() => marcas.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  }
  // Ninguna página debe moverse de lado en el celular.
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});

test('el buscador encuentra productos y avisa cuando no hay resultados', async ({ page }) => {
  await page.goto('/tecnologia');
  const campo = page.getByRole('main').getByRole('searchbox', { name: 'Buscar productos' });
  await campo.fill('lenovo');
  await expect(page.getByRole('main').getByRole('heading', { level: 3 })).toHaveCount(2);
  await campo.fill('zzzz-no-existe');
  await expect(page.getByText('No encontramos productos con esos filtros.')).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros' }).click();
  await expect(campo).toHaveValue('');
});

test('cada color muestra su precio y el carrito usa el elegido', async ({ page }) => {
  await page.goto('/producto/lenovo-gm2-pro');
  await expect(precio(page)).toHaveText('$30.00');
  await page.getByTitle('Blanco').click();
  await expect(precio(page)).toHaveText('$25.00');
  await page.getByRole('button', { name: 'Agregar al carrito' }).click();
  await page.goto('/carrito');
  await expect(page.getByRole('main')).toContainText('Lenovo GM2 Pro');
  await expect(page.getByRole('main')).toContainText('Blanco');
  await expect(page.getByRole('main')).toContainText('$25.00');
});

test('los productos de más de $60 avisan que son por pedido', async ({ page }) => {
  await page.goto('/producto/redmi-buds-4-harry-potter');
  await expect(page.getByText(/Producto por pedido: se reserva abonando el 50%/)).toBeVisible();
  await page.goto('/producto/lenovo-thinkplus-xt62');
  await expect(page.getByText(/Producto por pedido/)).toHaveCount(0);
});

test('checkout: valida los datos, bloquea contra entrega bajo el mínimo y confirma el pedido', async ({ page, context }) => {
  await page.goto('/producto/lenovo-thinkplus-xt62');
  await page.getByRole('button', { name: 'Agregar al carrito' }).click();
  await page.goto('/checkout');
  const continuar = page.getByRole('button', { name: /Continuar a entrega/ });
  await continuar.click();
  await expect(page.locator('legend', { hasText: 'Tus datos' })).toBeVisible();
  await expect(page.locator('.error-campo').first()).toBeVisible();
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Ana Pérez');
  await page.locator('input[type="tel"]').fill('6123 4567');
  await continuar.click();
  await page.getByRole('button', { name: /Continuar a pago/ }).click();
  await expect(page.getByRole('radio', { name: /Contra entrega/ })).toBeDisabled();
  await expect(page.getByText(/Búscanos como @kireitechnology/)).toBeVisible();
  const enviar = page.getByRole('button', { name: /Enviar pedido de \$20\.00 por WhatsApp/ });
  await enviar.click();
  await expect(page.getByText('Marca la casilla para que podamos usar tus datos en este pedido.')).toBeVisible();
  await page.getByRole('checkbox', { name: /Acepto que Kirei Technology/ }).check();
  // WhatsApp no se abre de verdad: la prueba no sale a internet, solo revisa el mensaje armado.
  await context.route(/wa.me|whatsapp.com/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }));
  const whatsapp = context.waitForEvent('page');
  await enviar.click();
  const ventana = await whatsapp;
  const url = decodeURIComponent(ventana.url());
  expect(url).toContain('wa.me/50761560839');
  expect(url).toContain('1 x Lenovo thinkplus XT62 (Blanco): $20.00');
  await ventana.close();
  await expect(page.getByRole('heading', { name: /Pedido .+ recibido\./ })).toBeVisible();
  await page.goto('/carrito');
  await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
});

test('los enlaces directos y las rutas que no existen responden bien', async ({ page }) => {
  await page.goto('/producto/lige-active-2');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Smartwatch Active 2 LIGE');
  await page.goto('/legal/privacidad');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Política de privacidad');
  await page.goto('/ayuda/por-pedido');
  await expect(page.getByText('Búscanos en Yappy como @kireitechnology.', { exact: false })).toBeVisible();
  await page.goto('/producto/no-existe');
  await expect(page.getByRole('heading', { name: 'Este producto ya no está.' })).toBeVisible();
  await page.goto('/esta-pagina-no-existe');
  await expect(page.getByRole('heading', { name: 'Aquí no hay señal.' })).toBeVisible();
});
