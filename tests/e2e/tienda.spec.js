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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tecnología. Sin complicarte.');
  await expect(page.getByRole('heading', { name: 'Marcas con las que trabajamos.' })).toBeVisible();
  const cinta = page.getByRole('list', { name: 'Marcas' });
  // La cinta nunca está quieta (es infinita): se llega a ella por su título.
  await page.locator('#marcas-titulo').scrollIntoViewIfNeeded();
  // Los 8 logos con nombre (la copia repetida para el bucle está oculta a lectores de pantalla).
  await expect(cinta.getByRole('img')).toHaveCount(8);
  await expect(cinta.getByRole('img', { name: 'Lenovo' })).toHaveCount(1);
  // La cinta se mueve sola y el botón la detiene.
  const posicion = () => cinta.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  const antes = await posicion();
  await page.waitForTimeout(600);
  expect(await posicion()).not.toBe(antes);
  await page.getByRole('button', { name: 'Pausar' }).click();
  const quieta = await posicion();
  await page.waitForTimeout(600);
  expect(await posicion()).toBe(quieta);
  // Ninguna página debe moverse de lado en el celular.
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});

test('el buscador encuentra productos y avisa cuando no hay resultados', async ({ page }) => {
  await page.goto('/tecnologia');
  const campo = page.getByRole('main').getByRole('searchbox', { name: 'Buscar productos' });
  await campo.fill('lenovo');
  await expect(page.getByRole('main').getByRole('heading', { level: 3 })).toHaveCount(6);
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
  await page.getByRole('checkbox', { name: /acepto que Kirei Technology/i }).check();
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

test('Aroma existe como sección y avisa que llega pronto', async ({ page }) => {
  await page.goto('/');
  // Menú de escritorio o barra del teléfono: Aroma siempre está a un toque.
  await expect(page.getByRole('link', { name: 'Aroma' }).first()).toBeVisible();
  await page.goto('/aroma');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Art of Fragrance');
  // Sin perfumes publicados se ve el catálogo de muestra, marcado como tal y sin compra.
  await expect(page.getByText('Catálogo de muestra.')).toBeVisible();
  await expect(page.getByText('Muestra', { exact: true })).toHaveCount(6);
  await page.getByRole('group', { name: 'Filtrar por familia' }).getByRole('button', { name: 'Cítricas' }).click();
  await expect(page.getByRole('heading', { level: 3, name: 'Cítrico 507' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'Madera Negra' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Consultar/ }).first()).toHaveAttribute('href', /wa\.me\/50761560839/);
  // Recomendador: dulce, intensa, de noche y oriental lleva a Ámbar Nocturno.
  for (const opcion of ['Dulces', 'Intensas', 'Noche', 'Oriental']) await page.getByRole('radio', { name: opcion, exact: true }).check();
  await expect(page.getByRole('status').getByRole('link', { name: /Ámbar Nocturno/ })).toBeVisible();
});

test('la laptop 3D vive solo en reparaciones: carga, se reproduce sola y se puede pausar y recorrer', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#taller-titulo')).toHaveCount(0);            // en la portada no hay laptop
  await expect(page.getByRole('heading', { level: 3, name: 'Reparación' })).toBeVisible();
  await page.goto('/reparaciones');
  await page.locator('#taller-titulo').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-fase="lista"]')).toHaveCount(1, { timeout: 60_000 });
  await expect(page.locator('[data-fase] canvas')).toHaveCount(1);
  const barra = page.getByRole('slider', { name: 'Recorrer el desarme' });
  const antes = Number(await barra.inputValue());
  await page.waitForTimeout(1500);
  expect(Number(await barra.inputValue())).toBeGreaterThan(antes);         // avanza sin tocar nada
  await page.getByRole('button', { name: 'Pausar' }).click();
  const pausada = await barra.inputValue();
  await page.waitForTimeout(700);
  expect(await barra.inputValue()).toBe(pausada);
  await barra.fill('18');                                                    // recorrer a mano hasta la vista desarmada
  await expect(page.locator('li[aria-current="step"]')).toContainText('Reparación y mejora');
  await expect(page.getByRole('link', { name: 'Framework Laptop 13' })).toBeVisible();   // atribución de la licencia CC BY
});

test('con movimiento reducido la laptop 3D arranca quieta y desarmada', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:' + (process.env.PUERTO ?? '5190') + '/reparaciones');
  await page.locator('#taller-titulo').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-fase="lista"]')).toHaveCount(1, { timeout: 60_000 });
  const barra = page.getByRole('slider', { name: 'Recorrer el desarme' });
  await page.waitForTimeout(900);
  expect(Number(await barra.inputValue())).toBe(18);
  await expect(page.getByRole('button', { name: 'Reproducir' })).toBeVisible();
  await ctx.close();
});
