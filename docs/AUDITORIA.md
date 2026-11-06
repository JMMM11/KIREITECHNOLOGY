# Auditoría técnica, noviembre 2026

Alcance: código del repositorio, reglas de Firestore, configuración de hosting y la tienda compilada. Las pruebas de seguridad y carga se hicieron en local y en los emuladores de Firebase, nunca contra la base de datos real. Se usó la guía `security-audit` de Cloudflare en modo guía (aislamiento de datos y lado del cliente), no su auditoría completa de varios agentes.

## Hallazgos y estado

| # | Gravedad | Hallazgo | Estado |
| --- | --- | --- | --- |
| 1 | Alta | GitHub Pages en blanco: el build buscaba los archivos en `/assets/` y la web vive en `/KIREITECHNOLOGY/` | Corregido: build propio para Pages con su base y `404.html`. Falta el paso manual en GitHub |
| 2 | Alta | Sin conexión, Firestore devolvía listas vacías de su caché: la tienda decía "no hay productos" y borrar la cuenta dejaba vivos los comentarios | Corregido: lecturas con `getDocsFromServer` |
| 3 | Media | El precio de cada línea del pedido lo manda el navegador; las reglas no pueden revisarlo línea por línea | Mitigado: el panel marca los pedidos con precio distinto al catálogo |
| 4 | Media | El stock nunca bajaba: se podía vender una unidad que ya no existía | Corregido: se descuenta al confirmar y vuelve al cancelar, en una transacción |
| 5 | Media | Con muchas compras a la vez, el contador de pedidos rechazaba parte de ellas | Mejorado: reintentos con espera aleatoria (ver métricas). Límite de diseño documentado |
| 6 | Media | Fotos de hasta 6 MB: la portada pesaba más de 8 MB | Corregido: copias livianas en JPG, originales intactos y sin publicar |
| 7 | Baja | Un cliente con sesión que abría `/admin` veía el panel vacío con errores | Corregido: pantalla "Sin acceso al panel" |
| 8 | Baja | `src/lib/recibo.js` sin uso | Eliminado |
| 9 | Informativa | Las unidades están en el documento público del producto | Documentado: la interfaz solo las muestra con menos de 3 |
| 10 | Informativa | GitHub Pages no permite encabezados de seguridad (CSP, HSTS propio) | Documentado: usar Firebase Hosting como dirección principal |

No se encontraron fallos de aislamiento entre cuentas en los escenarios probados.

## Pruebas ejecutadas

| Suite | Comando | Resultado |
| --- | --- | --- |
| Lógica y datos | `npm test` | 39 de 39 |
| Reglas (incluye 7 de aislamiento y escalada) | `npm run test:reglas` | 25 de 25 |
| E2E tienda, escritorio y celular | `npm run test:e2e` | 12 de 12 |
| E2E con cuentas reales en emuladores | `npm run test:e2e:emulador` | 1 de 1 |
| Envío a Sentry contra un receptor local | Manual, ver abajo | Llega el error con archivo, línea y entorno; sin IP, correo, cookies ni teléfono |
| Panel con la cuenta del dueño, en local contra Firebase real | Manual | Entra, las 5 pestañas cargan; Clientes y Comentarios piden publicar las reglas nuevas |

Casos de aislamiento cubiertos: leer, editar y borrar el perfil o el pedido de otra cuenta por id o por filtro; listar colecciones ajenas; firmar un pedido a nombre de otro; hacerse admin con campos `rol` o `admin` o escribiendo en `admins`; poner el correo de otra persona; un admin que reparte accesos; un ex admin que sigue leyendo; un cliente que cambia precios o ve borradores; y, desde la interfaz, otra cuenta que abre la dirección del pedido ajeno y luego usa su sesión directo contra la base de datos (respuesta 403).

No probado: tokens vencidos (el emulador no los valida igual que producción) y límites de intentos de Firebase Auth (son del servicio).

## Métricas medidas

Todas en esta computadora, no en la red de GitHub ni Firebase.

**Peso de la página** (sin caché, red 4G simulada de 9 Mbps y 40 ms):

| Página | Antes | Ahora | LCP ahora |
| --- | --- | --- | --- |
| Portada, celular | Más de 8 MB solo en las dos fotos de portada | 910 KB en total | 568 ms |
| Portada, escritorio | | 1,26 MB | 596 ms |
| Producto, celular | 5,6 MB solo en la foto principal de Hogwarts | 694 KB | 808 ms |

**Archivos estáticos** (servidor de vista previa local, usuarios virtuales recorriendo portada, producto, JS y foto):

| Usuarios | Solicitudes por segundo | p50 | p95 | p99 | Errores |
| --- | --- | --- | --- | --- | --- |
| 10 | 574 | 13 ms | 42 ms | 66 ms | 0 |
| 50 | 660 | 58 ms | 170 ms | 264 ms | 0 |
| 100 | 776 | 106 ms | 317 ms | 452 ms | 0 |

**Pedidos simultáneos** (emulador de Firestore, cada cliente con su conexión; con los reintentos nuevos):

| Compras a la vez | Guardadas | Rechazadas | Números repetidos | p50 | p95 |
| --- | --- | --- | --- | --- | --- |
| 10 | 10 | 0 | 0 | 6,4 s | 13,1 s |
| 25 | 22 | 3 | 0 | 18,5 s | 27,1 s |
| 50 | 27 | 23 | 0 | 21,6 s | 43,0 s |

Antes de los reintentos nuevos: 9/10, 11/25 y 15/50. El emulador procesa unos 0,8 pedidos por segundo porque todos suben el mismo contador. Firestore real es más rápido, pero no se midió. Si la tienda llega a recibir decenas de compras en el mismo minuto, la salida es numerar sin contador central, por ejemplo `KT-AAMMDD-XXXX`.

## Pendiente manual

1. Cambiar la contraseña del admin (se compartió en un chat).
2. Publicar reglas y web: `npx firebase-tools login` (una vez), luego `npm run build` y `npx firebase-tools deploy --only firestore:rules,hosting`.
3. En `/admin > Productos`, pulsar **Publicar catálogo del proyecto**.
4. GitHub: Settings > Pages > Source: GitHub Actions. Variables de Firebase y Sentry en Settings > Secrets and variables > Actions > Variables.
5. Agregar `jmmm11.github.io` en Firebase > Authentication > Dominios autorizados.
6. Sentry: crear el proyecto, poner el DSN en `VITE_SENTRY_DSN`, activar "Prevent Storing of IP Addresses" y, para ver el código original en los errores, subir los source maps con un token propio (nunca en el repositorio).
7. MFA para el admin, App Check y respaldos de Firestore (ver `docs/SEGURIDAD.md`).
8. Revisión legal de privacidad y términos.
