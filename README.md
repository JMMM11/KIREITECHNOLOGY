# Kirei Technology

Tienda en línea de Kirei Technology (Panamá). React 19 + Vite, rutas con `#`, animaciones con Motion.
Todavía no hay base de datos: todo sale de `src/data/` a través de `src/services/tienda.js`.

## Uso diario

```
npm install        # una sola vez
npm run dev        # servidor de desarrollo con recarga
npm test           # pruebas de precios, totales, validación, datos y contraste
npm run build      # compila la web en la raíz del repo
```

Después de `npm run build`, abre `index.html` con **Go Live** en VS Code.
El código fuente vive en `src/`. Lo compilado (index.html, assets/, fotos/, fuentes/, marca/) queda en la raíz.

## Publicar en GitHub Pages

1. Sube el repo a GitHub con el build ya hecho (`npm run build` y commit).
2. En GitHub: **Settings > Pages > Build and deployment**.
3. En **Source** elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guarda.
4. En unos minutos la web queda en `https://<tu-usuario>.github.io/<repo>/`.

Si borras o renombras un archivo de `public/`, bórralo también de la raíz: el build no lo elimina solo.

## Dónde editar

| Qué | Archivo |
|---|---|
| Productos, precios (centavos), stock, fotos | `src/data/productos.js` |
| Teléfono, correo, tarifas, modo vista previa | `src/data/sitio.js` |
| Categorías y orden | `src/data/catalogos.js` |
| Servicios de reparación | `src/data/servicios.js` |
| Textos de portada y ayuda | `src/data/textos.js` |
| Colores y tipografía | `src/styles/tokens.css` |

- `precioCentavos: null` muestra "Precio [pendiente]" y un botón para consultar por WhatsApp.
- `fotos: []` muestra "Foto pendiente". Cada foto necesita `nombre-m.webp` (600 px) y `nombre-l.webp` (1200 px) en `public/fotos/`.
- `estado: 'borrador'` oculta el producto. La Zona Anime muestra "Próximamente" hasta que publiques uno.
- `SITIO.vistaPrevia = true` muestra estados de ejemplo (marcados "Ejemplo"). Ponlo en `false` al lanzar.

## Cómo funciona un pedido hoy

El carrito se guarda en el navegador. En el checkout se arma el pedido y se abre WhatsApp con el mensaje.
No se guardan datos personales ni de pago. Yappy se conecta cuando exista la cuenta de comercio.
Cuando se conecte Firebase, `src/services/tienda.js` guardará pedidos y citas, y el servidor recalculará los totales.
