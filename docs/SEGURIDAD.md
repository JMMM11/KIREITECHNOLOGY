# Seguridad y privacidad

## Modelo

La tienda no tiene servidor propio. El código del navegador es público y cualquiera puede leerlo o modificarlo, así que **la pantalla nunca es la protección**. La protección está en:

1. **`firestore.rules`:** Firestore rechaza cualquier lectura o escritura que no cumpla las reglas, venga de donde venga.
2. **Firebase Authentication:** identifica a cada persona con un UID. El dueño es un UID fijo en las reglas; los demás administradores están en la colección `admins`, que solo el dueño puede cambiar.
3. **Encabezados HTTP de `firebase.json`:** limitan qué puede hacer el navegador con la página.

## Quién puede hacer qué

| Colección | Público | Cliente con cuenta | Administrador |
| --- | --- | --- | --- |
| `productos` | Lee los publicados | Igual que el público | Lee todo y escribe |
| `usuarios` | Nada | Lee, crea, edita y borra solo su perfil, con campos y tamaños limitados. El correo solo puede ser el de su propia sesión. No puede agregar campos como `rol` o `admin` | Lee la lista de clientes |
| `admins` | Nada | Solo consulta si él mismo es admin | Lee la lista. Solo el dueño agrega o quita; nadie la edita |
| `pedidos` | Crea pedidos con forma y totales validados | Además, lee solo los suyos | Lee todos y cambia solo estado y seguimiento. Nadie los borra |
| `contadores/pedidos` | Solo sube de uno en uno junto con el pedido que numera | Igual | Igual |
| `citas` | Crea citas con campos validados | Igual | Lee, cambia el estado y borra |
| `comentarios` | Lee los publicados | Crea comentarios propios (nacen pendientes, máximo 500 caracteres), lee y borra los suyos | Lee todos, publica u oculta, borra |

Cada regla tiene pruebas en `tests/reglas/` que corren contra el emulador con `npm run test:reglas`. `tests/reglas/aislamiento.test.js` usa varias cuentas de prueba: una no puede leer, cambiar ni borrar datos de otra cambiando el id o el filtro, ni hacerse admin, ni cambiar precios. `tests/e2e/emulador.spec.js` repite lo mismo desde la interfaz y con la sesión de otra cuenta directo contra la base de datos.

## Cosas que la base de datos no puede validar sola

- **Precio de cada línea del pedido:** las reglas comprueban que el total cuadre, pero no pueden revisar uno por uno los precios contra el catálogo. El panel marca en rojo los pedidos con un precio distinto al del catálogo antes de confirmarlos.
- **Unidades:** se descuentan cuando el admin confirma el pedido y vuelven si lo cancela (`ajustarStock`, en una transacción). Mientras un pedido está "recibido", otra persona puede pedir la misma unidad: el admin decide al confirmar.
- **Unidades visibles:** el número exacto solo sale en el panel; el cliente ve "Solo quedan N" con 1 o 2. El dato sigue en el documento público del producto, así que alguien técnico podría leerlo.

## Encabezados de seguridad

Definidos en `firebase.json` para todas las rutas:

| Encabezado | Qué evita |
| --- | --- |
| `Content-Security-Policy` | Que se ejecuten scripts de sitios no autorizados (XSS). Solo permite la propia tienda, Google (inicio de sesión), Firebase y Cloudinary |
| `Strict-Transport-Security` | Que el navegador use HTTP sin cifrar |
| `X-Frame-Options: DENY` y `frame-ancestors 'none'` | Que otro sitio meta la tienda en un iframe para engañar clics |
| `X-Content-Type-Options: nosniff` | Que el navegador interprete un archivo como otro tipo |
| `Referrer-Policy` | Que la ruta completa se filtre a otros sitios |
| `Permissions-Policy` | El uso de cámara, micrófono, ubicación y pagos del navegador |
| `Cross-Origin-Opener-Policy` | Que otras ventanas controlen la tienda; permite las ventanas de inicio con Google y Apple |

Si agregas un servicio externo nuevo (por ejemplo, un mapa o analítica), tienes que agregar su dominio a la CSP. Si no, el navegador lo bloquea y lo dice en la consola.

## Secretos

- `.env.local` está en `.gitignore`. Solo contiene la configuración pública de Firebase y el nombre del preset de Cloudinary.
- La configuración de Firebase es pública por diseño; lo que protege los datos son las reglas.
- La clave secreta de Cloudinary nunca va en este proyecto. Las fotos se suben con un preset sin firma limitado a una carpeta.
- `firebase.json` no publica `src/`, `tests/`, `docs/` ni archivos ocultos.

## Privacidad (Ley 81 de 2019)

- **Minimización:** solo se piden nombre, teléfono y, para envíos, dirección. No se guardan datos de pago.
- **Acceso y portabilidad:** Mi cuenta > Seguridad y privacidad > Descargar mis datos (archivo JSON con perfil y pedidos).
- **Supresión:** Eliminar mi cuenta borra perfil, direcciones, favoritos y comentarios. Los pedidos se conservan para la garantía y las obligaciones fiscales.
- **Comentarios públicos:** muestran solo el nombre y la inicial del apellido.
- **Lista de clientes del admin:** muestra nombre, correo, teléfono, fecha y número de pedidos, sin direcciones.
- **Direcciones IP:** la tienda no guarda IP de nadie. Sentry, si se activa, no envía IP, cookies, cabeceras ni datos de formularios (`src/lib/monitoreo.js`, probado en `tests/monitoreo.test.js`). Google y GitHub sí registran IP en sus servidores como parte de su servicio.
- **Sin analítica ni publicidad de terceros.**

El texto completo para clientes está en `src/data/textos.js` (sección `LEGAL`) y se ve en `/legal/privacidad`.

## Relación con SOC 2, ISO 27001 e ISO 27701

El código aplica controles técnicos que esas normas piden: control de acceso con mínimo privilegio, validación de entradas, cifrado en tránsito, separación de secretos, pruebas de las reglas, dependencias auditadas (`npm audit`) y derechos de los titulares de datos. **No da una certificación:** para eso hacen falta políticas escritas, registros, gestión de riesgos y una auditoría externa.

## Controles pendientes

| Control | Por qué | Cómo |
| --- | --- | --- |
| Cambiar la contraseña del admin | Se compartió en un chat | Firebase Console > Authentication, o "¿Olvidaste tu contraseña?" |
| Verificación en dos pasos (MFA) para el admin | Si alguien obtiene la contraseña del admin, controla la tienda | Firebase Console: activar Identity Platform y MFA |
| App Check | Hoy un script puede crear pedidos y citas falsos en cantidad | Firebase Console > App Check, con reCAPTCHA Enterprise |
| Sentry sin IP en el servidor | Aunque el navegador no la envía, el servidor de Sentry podría deducirla de la conexión | En Sentry: Settings > Security & Privacy > Prevent Storing of IP Addresses |
| Encabezados en GitHub Pages | GitHub Pages no permite CSP ni los demás encabezados | Usar Firebase Hosting como dirección principal |
| Respaldos de Firestore | Recuperar datos si se borran por error | Respaldos programados (requiere el plan Blaze) |
| Protección contra enumeración de correos | Que no se pueda averiguar qué correos tienen cuenta | Firebase Console > Authentication > Configuración |
| Límite del preset de Cloudinary | Que nadie llene la cuenta con archivos | Cloudinary: limitar formato, tamaño y carpeta del preset |
| Revisión legal | Los textos legales tienen campos `[pendiente]` | Abogado en Panamá |

Para reportar un problema de seguridad, ver [SECURITY.md](../SECURITY.md).
