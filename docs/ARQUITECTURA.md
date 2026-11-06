# Arquitectura

La tienda es una aplicación de una sola página (SPA) en React. No tiene servidor propio: el navegador habla directo con Firebase, y las reglas de Firestore deciden qué puede leer o escribir cada persona.

## Vista general

```mermaid
flowchart LR
  cliente["Cliente en el navegador"]
  admin["Dueño en /admin"]

  subgraph hosting["Firebase Hosting"]
    web["Tienda compilada: dist/"]
  end

  subgraph firebase["Firebase"]
    auth["Authentication: correo, Google, Apple"]
    db[("Firestore")]
    reglas{{"firestore.rules"}}
  end

  cloudinary["Cloudinary: fotos subidas"]
  whatsapp["WhatsApp de la tienda"]

  cliente -->|abre| web
  admin -->|abre| web
  web -->|inicia sesión| auth
  web -->|lee y escribe| reglas
  reglas -->|permite o rechaza| db
  web -->|sube fotos, solo admin| cloudinary
  web -->|mensaje con el pedido o la cita| whatsapp
```

## Capas del código

```mermaid
flowchart TD
  paginas["src/pages: una por ruta"]
  componentes["src/components: piezas de pantalla"]
  contexto["src/context: datos, carrito y cuenta compartidos"]
  servicios["src/services: única puerta a Firebase y Cloudinary"]
  lib["src/lib: lógica pura y probada"]
  datos["src/data: textos, precios y productos locales"]

  paginas --> componentes
  paginas --> contexto
  componentes --> contexto
  contexto --> servicios
  componentes --> lib
  servicios --> lib
  servicios --> datos
  componentes --> datos
```

| Carpeta | Qué hay |
| --- | --- |
| `src/pages` | Inicio, Catálogo, Producto, Carrito, Checkout, Anime, Reparaciones, Ayuda, Legal, Cuenta, Admin y 404 |
| `src/components/admin` | Panel: productos, pedidos, citas, clientes y comentarios |
| `src/components/cuenta` | Acceso, Mis pedidos, perfil, favoritos, direcciones y seguridad |
| `src/components/tienda` | Tarjetas, detalle, carrito, comentarios y precios |
| `src/components/ui` | Piezas reutilizables: fotos, campos, esqueletos de carga, pantallas de estado |
| `src/components/layout` | Encabezado, pie, navegación móvil, límite de errores y aviso de conexión |
| `src/context` | `DatosContext` (productos), `CarritoContext`, `CuentaContext` |
| `src/services` | `tienda.js` decide si los datos vienen de Firestore o de `src/data/` |
| `src/lib` | Totales, validaciones, armado de pedidos y citas, formato de precios |
| `src/data` | Textos de la tienda, tarifas, productos y textos legales |
| `tests/` | Pruebas de lógica; `tests/reglas/` prueba `firestore.rules` |
| `public/` | Archivos que se copian tal cual: logo, fuentes, íconos, `robots.txt`, `sitemap.xml` |
| `Productos/`, `reparaciones/` | Fotos originales de productos y servicios |

La compilación (`scripts/compilar.mjs`) va a `dist/`, que es lo que publica Firebase Hosting, o a `_pages/` para GitHub Pages. Copia las fotos livianas (`web/`) y genera `sitemap.xml` y `robots.txt` con `SITIO.url`. Los originales de las fotos, el código fuente y las pruebas no se publican.

## Base de datos

```mermaid
erDiagram
  USUARIOS ||--o{ PEDIDOS : "hace (opcional)"
  USUARIOS ||--o{ COMENTARIOS : escribe
  PRODUCTOS ||--o{ COMENTARIOS : recibe
  CONTADORES ||--|| PEDIDOS : numera
  USUARIOS ||--o| ADMINS : "puede tener acceso"

  PRODUCTOS {
    string id
    string nombre
    string categoriaId
    int precioCentavos
    int stock
    string estado "publicado o borrador"
    list fotos
    list variantes
  }
  USUARIOS {
    string uid
    string nombre
    string telefono
    list direcciones
    list favoritos
    timestamp creadoEn
  }
  PEDIDOS {
    string id "KT-1001"
    int numero
    string uid "null sin cuenta"
    string estado
    map cliente
    list items
    int totalCentavos
    timestamp creadoEn
  }
  CONTADORES {
    int ultimo
  }
  ADMINS {
    string uid "id del documento"
    string nombre
    string correo
    timestamp agregadoEn
  }
  CITAS {
    string nombre
    string telefono
    string servicio
    string estado
    timestamp creadoEn
  }
  COMENTARIOS {
    string productoId
    string uid
    string nombre "nombre e inicial"
    string texto
    string estado "pendiente, publicado u oculto"
    timestamp creadoEn
  }
```

Los precios se guardan en centavos (enteros) para evitar errores de redondeo.

## Flujo de un pedido

```mermaid
sequenceDiagram
  actor C as Cliente
  participant W as Tienda
  participant F as Firestore
  participant WA as WhatsApp

  C->>W: Confirma el pedido en Checkout
  W->>F: Transacción: sube contadores/pedidos y crea pedidos/KT-número
  alt Otro cliente tomó el mismo número
    F-->>W: permission-denied
    W->>F: Reintenta con el número siguiente (hasta 8 veces)
  end
  F-->>W: Pedido guardado
  W->>WA: Abre el chat con el resumen del pedido
  W-->>C: Pantalla de éxito con el número y botón para abrir WhatsApp otra vez
  Note over W,C: Si guardar falla, el carrito no se vacía y se muestra el error con opción de reintentar
```

Después, el dueño cambia el estado en `/admin > Pedidos` (recibido, confirmado, enviado, entregado o cancelado) y el cliente con cuenta lo ve en Mis pedidos.

## Flujo de un comentario

```mermaid
stateDiagram-v2
  [*] --> pendiente: el cliente con cuenta lo envía
  pendiente --> publicado: el admin lo aprueba
  pendiente --> oculto: el admin lo rechaza
  publicado --> oculto: el admin lo retira
  oculto --> publicado: el admin lo vuelve a mostrar
  pendiente --> [*]: borrado por el autor o el admin
  publicado --> [*]: borrado por el autor o el admin
  oculto --> [*]: borrado por el autor o el admin
```

Solo los comentarios `publicado` se ven en la tienda. Al eliminar su cuenta, el cliente borra todos sus comentarios.

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/tecnologia/:categoria?` | Catálogo |
| `/buscar/:q?` | Búsqueda |
| `/producto/:slug` | Detalle del producto |
| `/carrito`, `/checkout` | Carrito y compra |
| `/anime` | Zona Anime |
| `/reparaciones` | Servicios y citas |
| `/ayuda/:seccion?` | Preguntas frecuentes |
| `/legal/:doc?` | Privacidad y términos |
| `/cuenta/:seccion?/:id?` | Cuenta del cliente |
| `/admin` | Panel de administración |

Las rutas no usan `#`. Firebase Hosting responde `index.html` a cualquier ruta (`rewrites` en `firebase.json`) y por eso `vite.config.js` usa `base: '/'`: con rutas relativas, recargar `/producto/x` buscaría los archivos en `/producto/assets/`.
