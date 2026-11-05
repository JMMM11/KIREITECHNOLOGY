# Estados de cada pantalla

Regla de la tienda: el cliente nunca debe quedarse frente a una pantalla en blanco o con un mensaje falso. Cada pantalla que depende de datos muestra qué está pasando mientras carga, cuando no hay nada que mostrar y cuando algo falla, y siempre ofrece una salida (reintentar, volver o escribir por WhatsApp).

## Redes de seguridad generales

| Situación | Qué pasa | Dónde |
| --- | --- | --- |
| Una página falla al dibujarse | Pantalla "Algo se desconectó." con Recargar y WhatsApp. Al cambiar de ruta, el resto de la tienda sigue funcionando | `src/components/layout/LimiteError.jsx` |
| Una página tarda en descargarse | Indicador de carga | `src/components/ui/Cargando.jsx` |
| Los productos no cargan (sin internet o Firestore caído) | Aviso rojo bajo el encabezado con Reintentar y la nota "Tu carrito sigue guardado" | `src/components/layout/AvisoDatos.jsx` |
| Página que no puede mostrar nada sin productos | Pantalla "No pudimos cargar la tienda." con Reintentar y WhatsApp | `src/components/ui/ErrorDatos.jsx` |
| Ruta que no existe | Pantalla 404 con enlaces a la tienda | `src/pages/NoEncontrada.jsx` |
| Navegador en modo privado o sin almacenamiento | El carrito y "vistos" funcionan mientras la pestaña esté abierta, sin errores | `src/context/CarritoContext.jsx`, `src/lib/vistos.js` |
| Sin Firebase configurado | La tienda usa los productos de `src/data/` | `src/services/tienda.js` |
| Sin internet | Las lecturas usan `getDocsFromServer`: fallan con error en vez de devolver una lista vacía de la caché, así la tienda muestra el aviso y no "no hay productos" ni "no tienes pedidos" | `src/services/*.js` |

## Tienda

| Pantalla | Cargando | Vacío | Error | Éxito |
| --- | --- | --- | --- | --- |
| Inicio | Tarjetas esqueleto en "Lo más pedido"; los conteos se ocultan | Carrusel sin tarjetas | Aviso general con Reintentar | Productos y secciones |
| Catálogo y búsqueda | Tarjetas esqueleto y "Cargando productos" | "No encontramos productos con esos filtros." con Limpiar filtros | Mensaje con Reintentar | Rejilla de productos con conteo |
| Producto (pocas unidades) | | | | Con 1 o 2 unidades: insignia "Últimas unidades" y "Solo quedan N unidades." Con 3 o más no se muestra el número |
| Producto | Esqueleto de la ficha | "Este producto ya no está." con enlaces a la tienda | Pantalla de error con Reintentar (no dice que el producto no existe) | Ficha completa |
| Comentarios del producto | "Cargando comentarios..." | "Todavía no hay comentarios..." | "No pudimos cargar los comentarios..." | Lista de comentarios publicados |
| Enviar comentario | Botón "Enviando..." desactivado | Sin cuenta: enlace para entrar | "No pudimos enviarlo. Revisa tu conexión." | "Gracias. Lo publicaremos después de revisarlo." |
| Anime | Tarjetas esqueleto | "Zona Anime: próximamente." con aviso por WhatsApp | Pantalla de error con Reintentar | Rejilla de productos |
| Carrito | (usa los productos ya cargados) | "Tu carrito está vacío" con enlace a explorar | "Tus productos siguen guardados." con Reintentar; no dice que está vacío | Líneas con totales |
| Checkout | Botón "Enviando pedido" desactivado | Carrito vacío | Al cargar: igual que el carrito. Al enviar: "No pudimos registrar tu pedido..." sin vaciar el carrito | Número de pedido, estado y botón "Abrir WhatsApp otra vez" |
| Reparaciones | (envío inmediato) | (formulario) | Si guardar la cita falla, el mensaje igual sale por WhatsApp | "Cita lista para enviar." |

## Cuenta del cliente

| Pantalla | Cargando | Vacío | Error | Éxito |
| --- | --- | --- | --- | --- |
| Acceso | Botón "Un momento..." desactivado | (formulario) | Mensaje claro según el error de Firebase: contraseña incorrecta, correo usado, demasiados intentos, sin conexión | Entra a la cuenta |
| Mis pedidos | Esqueleto de la lista | "Aún no tienes pedidos." con enlace a la tienda | Mensaje con Reintentar | Lista y detalle con recibo |
| Pedido que no existe | | "No encontramos ese pedido." con enlace a Mis pedidos | | |
| Perfil y direcciones | Botón ocupado | (formulario) | "No se pudo guardar. Revisa tu conexión." | Confirmación |
| Favoritos | | Mensaje con enlace a la tienda | Si falla, el corazón vuelve a su estado anterior | Lista |
| Seguridad | Botones "Cambiando..." y "Eliminando..." | | Mensaje según el error | Confirmación |

## Panel de administración

| Sección | Cargando | Vacío | Error |
| --- | --- | --- | --- |
| Productos | "Cargando productos..." | Botón para importar los productos actuales | Mensaje que sugiere revisar el UID en las reglas |
| Pedidos, Citas, Clientes, Comentarios | "Cargando..." | Mensaje por filtro o "Todavía no hay..." | Mensaje que sugiere revisar que las reglas estén publicadas |
| Guardar un cambio | "Guardando..." | | "No se pudo guardar. Revisa tu conexión." |
| Subir fotos | Botón desactivado mientras sube | | Mensaje de Cloudinary o "Falta configurar Cloudinary" |

## Cómo comprobarlo

En Chrome, abre las herramientas de desarrollo, pestaña Red (Network), y elige "Sin conexión" (Offline) antes de recargar. Debes ver el aviso o la pantalla de error con Reintentar, nunca una página en blanco. Vuelve a "Sin limitación" y pulsa Reintentar: los productos deben aparecer sin recargar la página.

Al agregar una pantalla nueva que lea datos, cubre los cuatro casos de las tablas y agrégala aquí.
