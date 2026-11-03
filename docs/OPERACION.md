# Operación

Guía para publicar la tienda, volver atrás y actuar cuando algo sale mal.

## Antes de publicar

1. `npm test` y `npm run test:reglas` pasan.
2. `src/data/sitio.js` tiene `vistaPrevia: false` en producción (con `true`, el pie avisa que algunos estados son de ejemplo).
3. No quedan datos `[pendiente]` que el cliente vaya a ver, o se aceptan conscientemente.
4. `npm run build` termina sin errores.
5. Revisión rápida con `npm run preview`: portada, una página de producto recargada directamente, carrito y checkout.

## Publicar

```bash
npm run build
npx firebase-tools deploy --only firestore:rules,hosting
```

- Solo cambiaste reglas: `npx firebase-tools deploy --only firestore:rules`.
- Solo cambiaste la web: `npx firebase-tools deploy --only hosting`.
- Publica las reglas **antes o junto** con una web que use una colección nueva. Si no, esa sección mostrará el error de permisos.

Después de publicar, abre la tienda en una ventana privada, abre la consola del navegador (F12) y revisa que no haya errores rojos, sobre todo de `Content Security Policy`.

## Volver a una versión anterior

- **Web:** Firebase Console > Hosting > historial de versiones > elegir la anterior > Revertir. Es inmediato y no toca la base de datos.
- **Reglas:** Firebase Console > Firestore > Reglas > historial; o vuelve a la versión anterior de `firestore.rules` con git y publica solo las reglas.
- **Código:** `git revert <commit>` crea un commit que deshace el cambio sin borrar historia.

## Si algo sale mal

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| La tienda muestra "No pudimos cargar los productos" | Sin internet, Firestore caído o reglas mal publicadas | Revisa status.firebase.google.com y la consola del navegador. Si fue una publicación de reglas, revierte las reglas |
| Una sección del admin dice "revisa que las reglas estén publicadas" | Se publicó la web sin las reglas nuevas | `npx firebase-tools deploy --only firestore:rules` |
| Página en blanco al recargar una ruta como `/producto/x` | Rutas relativas en el build | Confirma `base: '/'` en `vite.config.js` y vuelve a compilar |
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
