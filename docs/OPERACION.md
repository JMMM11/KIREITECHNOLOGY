# Operación

Guía para publicar la tienda, volver atrás y actuar cuando algo sale mal.

## Antes de publicar

1. `npm test` y `npm run test:reglas` pasan.
2. `src/data/sitio.js` tiene `vistaPrevia: false` en producción (con `true`, el pie avisa que algunos estados son de ejemplo).
3. No quedan datos `[pendiente]` que el cliente vaya a ver, o se aceptan conscientemente.
4. `npm run build` termina sin errores.
5. Revisión rápida con `npm run preview`: portada, una página de producto recargada directamente, carrito y checkout.

## Publicar

La primera vez en cada computadora hay que iniciar sesión en Firebase (si no, sale `Failed to authenticate, have you run firebase login?`):

```bash
npx firebase-tools login
```

Se abre el navegador: entra con la cuenta de Google dueña del proyecto `kirie-technology` y acepta. Después:

```bash
npm run build
npx firebase-tools deploy --only firestore:rules,hosting
```

- Solo cambiaste reglas: `npx firebase-tools deploy --only firestore:rules`.
- Solo cambiaste la web: `npx firebase-tools deploy --only hosting`.
- Publica las reglas **antes o junto** con una web que use una colección nueva. Si no, esa sección mostrará el error de permisos.

Después de publicar, abre la tienda en una ventana privada, abre la consola del navegador (F12) y revisa que no haya errores rojos, sobre todo de `Content Security Policy`.

## Que Google encuentre la tienda

Lo que ya hace el código: título y descripción propios en cada página, datos de negocio local (Panamá Oeste), preguntas frecuentes y, en cada producto, nombre, precio y disponibilidad en el formato que Google usa para mostrarlos en los resultados. `npm run build` genera `sitemap.xml` con cada producto publicado y `robots.txt`, que deja fuera el panel, la cuenta y el checkout.

Lo que tienes que hacer tú, una vez, cuando la tienda esté publicada en Firebase:

1. Entra a [Google Search Console](https://search.google.com/search-console) con tu cuenta de Google.
2. Agrega una propiedad de tipo **Prefijo de URL** con la dirección de `SITIO.url` (hoy `https://kirie-technology-93481.web.app`).
3. Verifícala con la opción **Etiqueta HTML**: copia solo el valor de `content` y pásamelo para ponerlo en `src/index.html`, o pégalo tú en el `<head>` como `<meta name="google-site-verification" content="...">`. Publica y pulsa **Verificar**.
4. En **Sitemaps**, envía `sitemap.xml`.
5. En **Inspección de URL**, pega la portada y pulsa **Solicitar indexación**. Google tarda de días a semanas en mostrarla.
6. Revisa un producto en la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results): debe detectar "Producto".
7. Crea tu ficha gratis en [Google Business Profile](https://www.google.com/business/) como negocio en línea de Panamá Oeste (sin dirección pública) con el enlace de la tienda y el WhatsApp. Es lo que más ayuda en búsquedas como "audífonos Panamá".

Lo que más ayuda después: que cada producto tenga fotos y descripción propias, enlazar la tienda desde Instagram y WhatsApp Business, y pedir a los clientes que comenten.

## Dominio propio

Cuando compres un dominio (por ejemplo `kireitechnology.com`):

1. Cómpralo donde prefieras (Google Domains ya no existe; sirven Namecheap, Cloudflare o un registrador panameño para `.com.pa`).
2. Firebase Console > Hosting > **Agregar dominio personalizado**. Firebase te da registros DNS (tipo A y TXT): cópialos en el panel del registrador. El certificado HTTPS se crea solo, en minutos u horas.
3. Cambia `url` en `src/data/sitio.js` por `https://tudominio.com` (sin `/` al final). Con eso se actualizan la dirección canónica, Open Graph, los datos para Google, el sitemap y robots.txt.
4. Firebase Console > Authentication > Configuración > **Dominios autorizados**: agrega el dominio (si no, el inicio de sesión con Google y Apple falla ahí).
5. `npm run build` y `npx firebase-tools deploy --only hosting`.
6. Search Console: agrega el dominio nuevo como propiedad y envía otra vez el sitemap. En la propiedad vieja usa **Cambio de dirección**.
7. Actualiza el enlace en Instagram, WhatsApp Business y Google Business Profile.

## Sentry: aviso cuando algo falla

Sentry es un servicio que te avisa por correo cuando a un cliente le falla algo en la página (por ejemplo, un botón que da error en cierto celular), con el archivo y la línea donde ocurrió. Así lo arreglas antes de que te escriban. La tienda ya lo trae listo pero apagado; no envía nombre, correo, teléfono ni IP.

1. Crea una cuenta en [sentry.io](https://sentry.io) (el plan gratuito alcanza para una tienda pequeña).
2. Crea un proyecto de tipo **React**. Sentry te muestra un **DSN** (una dirección que empieza con `https://` y termina en `.ingest.sentry.io/...`). Es público por diseño.
3. Ponlo en `.env.local` como `VITE_SENTRY_DSN=...` y en GitHub como variable `VITE_SENTRY_DSN`. Compila y publica.
4. En Sentry: Settings > Security & Privacy > activa **Prevent Storing of IP Addresses**.
5. Deja `VITE_SENTRY_REPLAY=false` salvo que quieras grabar las sesiones con error; si lo activas, hay que avisarlo en la política de privacidad.
6. Nunca pongas el "auth token" de Sentry en el proyecto: es secreto.

## Analítica: Google Analytics y Meta Pixel

- **Google Analytics 4** te dice cuántas personas visitan, desde dónde llegan y qué productos miran. Es gratis.
- **Meta Pixel** sirve para anuncios pagados en Facebook e Instagram: mide qué anuncio trajo a quién y arma públicos para volver a mostrarles anuncios. Solo vale la pena si vas a pagar publicidad en Meta.

Las dos usan cookies que identifican a la persona, así que antes hay que agregar un aviso de cookies con "Aceptar" y "Rechazar", y no cargar nada hasta que acepte. También hay que actualizar la política de privacidad y la CSP de `firebase.json`.

Recomendación: por ahora no instales ninguna. Usa Search Console (gratis y sin cookies) para ver qué buscan en Google para llegar a ti, y las estadísticas de Instagram para tus publicaciones. Si después quieres Google Analytics o vas a pagar anuncios en Meta, crea la cuenta, pásame el ID de medición (`G-...`) o el ID del píxel y agrego el aviso de cookies con ellos.

## Productos

`src/data/productos.js` es el catálogo del proyecto, pero la tienda con Firebase lee Firestore. Después de cambiar el archivo, entra a `/admin > Productos` y pulsa **Publicar catálogo del proyecto**: escribe esos productos y borra de Firestore los que no estén en el archivo. Los cambios hechos en el panel a esos productos se pierden, por eso pide confirmación.

## Administradores

El dueño (UID fijo en `firestore.rules` y `src/data/sitio.js`) suma gente al equipo así: la persona crea su cuenta en la tienda, el dueño entra a `/admin > Clientes` y pulsa **Dar acceso al panel** en su fila. Para quitarlo, **Quitar acceso al panel**. Los demás admins trabajan igual que el dueño, pero no pueden dar ni quitar accesos.

## Fotos

La tienda sirve copias livianas en JPG (`Productos/web/`, `reparaciones/web/`); los originales no se publican. Al agregar fotos, corre `powershell -File scripts/fotos-web.ps1`: `npm test` falla si falta alguna copia.

## Pruebas de carga

Nunca contra producción.

- Pedidos simultáneos contra el emulador: `npx -y firebase-tools@15 emulators:exec --only firestore --project demo-kirei "node tests/carga/pedidos-concurrentes.mjs"`.
- Página y archivos contra un servidor local: `node tests/carga/estaticos.mjs http://localhost:5190 50 20` (con `npx vite preview` corriendo).

## GitHub Pages

La tienda también vive en https://jmmm11.github.io/KIREITECHNOLOGY/. GitHub Pages sirve la página desde la carpeta `/KIREITECHNOLOGY/` y no reescribe rutas como Firebase, por eso tiene su propio build (`npm run build:pages`, carpeta `_pages/`, con `404.html` para abrir rutas como `/producto/x`).

- Se publica solo en cada push a `main` (`.github/workflows/pages.yml`).
- Configuración, una vez: Settings > Pages > Build and deployment > Source: **GitHub Actions**.
- Para que lea Firestore: Settings > Secrets and variables > Actions > Variables, con los mismos nombres de `.env.example`. Sin ellas, usa los productos de `src/data/`.
- Para iniciar sesión desde ahí: agrega `jmmm11.github.io` en Firebase Console > Authentication > Dominios autorizados.
- GitHub Pages no permite encabezados propios: la CSP y demás encabezados de seguridad solo aplican en Firebase.

## Volver a una versión anterior

- **Web:** Firebase Console > Hosting > historial de versiones > elegir la anterior > Revertir. Es inmediato y no toca la base de datos.
- **Reglas:** Firebase Console > Firestore > Reglas > historial; o vuelve a la versión anterior de `firestore.rules` con git y publica solo las reglas.
- **Código:** `git revert <commit>` crea un commit que deshace el cambio sin borrar historia.

## Si algo sale mal

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| La tienda muestra "No pudimos cargar los productos" | Sin internet, Firestore caído o reglas mal publicadas | Revisa status.firebase.google.com y la consola del navegador. Si fue una publicación de reglas, revierte las reglas |
| Una sección del admin dice "revisa que las reglas estén publicadas" | Se publicó la web sin las reglas nuevas | `npx firebase-tools deploy --only firestore:rules` |
| Página en blanco al recargar una ruta como `/producto/x` | Rutas relativas en el build | Confirma la `base` absoluta en `vite.config.js` y vuelve a compilar |
| GitHub Pages en blanco | Pages sirve el build de Firebase (`/assets/...`) en vez del suyo | Settings > Pages > Source: GitHub Actions, y revisa la pestaña Actions |
| La consola dice `Refused to load ... Content Security Policy` | Un dominio nuevo no está en la CSP | Agrégalo a `Content-Security-Policy` en `firebase.json` y publica |
| El inicio con Google o Apple falla en un dominio nuevo | Dominio no autorizado | Firebase Console > Authentication > Configuración > Dominios autorizados |
| No se pueden subir fotos | Falta configuración de Cloudinary o el preset cambió | Revisa `VITE_CLOUDINARY_*` en `.env.local` y el preset en Cloudinary |
| Clientes reportan pedidos que no llegaron | Falló el guardado o no enviaron el WhatsApp | Revisa `/admin > Pedidos`. El cliente ve el número del pedido en la pantalla de éxito |

## Incidente de seguridad o de datos

1. **Contener:** si la cuenta admin pudo verse comprometida, cambia la contraseña y cierra sesiones en Firebase Console > Authentication. Si un cambio de reglas abrió datos, revierte las reglas de inmediato.
2. **Revisar:** qué datos y de cuántos clientes se vieron afectados, y desde cuándo.
3. **Avisar:** la Ley 81 de 2019 exige notificar a los afectados y a la ANTAI. Consulta con tu asesor legal el plazo y el contenido.
4. **Corregir y documentar:** qué pasó, qué se hizo y qué cambia para que no se repita.

## Mantenimiento

- **Mensual:** `npm audit --omit=dev` y revisar actualizaciones de `firebase`, `react` y `vite`.
- **Tras cada cambio de reglas:** `npm run test:reglas`.
- **Cuando haya presupuesto:** activar los respaldos programados de Firestore (plan Blaze) y probar una restauración.
