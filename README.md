# Kirei Technology

Tienda en línea de Kirei Technology (Panamá). React 19 + Vite, rutas con `#`, animaciones con Motion.
Con Firebase configurado (`.env.local`, ver `.env.example`) productos, cuentas y pedidos viven en Firestore; sin él, todo sale de `src/data/`.

## Pedidos

Cada pedido se guarda en `pedidos` con un número que no se repite (`KT-1001`, `KT-1002`...; contador en `contadores/pedidos`)
y luego se abre WhatsApp. Se ven y se gestionan en `/admin > Pedidos`; el cliente con cuenta los sigue en Mis pedidos.
Al cambiar `firestore.rules`, publícalas con `npx firebase-tools deploy --only firestore:rules` y pruébalas con `npm run test:reglas` (necesita Java).
