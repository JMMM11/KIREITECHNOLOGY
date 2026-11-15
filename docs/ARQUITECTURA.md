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
| `src/pages` | Inicio, Catálogo, Producto, Carrito, Checkout, Aroma, Anime, Reparaciones, Ayuda, Contacto, Legal, Cuenta, Admin y 404 |
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
| `/aroma` | Aroma (perfumes). Muestra "Próximamente" hasta que haya productos en la categoría `aroma` |
| `/anime` | Zona Anime |
| `/reparaciones` | Servicios y citas |
| `/ayuda/:seccion?` | Preguntas frecuentes |
| `/contacto` | Canales de contacto |
| `/legal/:doc?` | Privacidad, términos, envíos y devoluciones |
| `/cuenta/:seccion?/:id?` | Cuenta del cliente |
| `/admin` | Panel de administración |

Las rutas no usan `#`. Firebase Hosting responde `index.html` a cualquier ruta (`rewrites` en `firebase.json`) y por eso `vite.config.js` usa `base: '/'`: con rutas relativas, recargar `/producto/x` buscaría los archivos en `/producto/assets/`.

## Sistema visual

Los tokens viven en `src/styles/tokens.css` y `tests/contraste.test.js` verifica cada par texto/fondo.

- **Global (toda la web):** papel `#F7F5F1`, azul marino `#0B1F33` como marca, naranja `#F7931E` como acción. Poppins para leer, Unbounded para títulos. Radios: controles redondos, tarjetas 14 px. No se cambia por sección.
- **Temas por sección:** una clase en el contenedor (`tema-taller`, `tema-aroma`) remapea los tokens de rol (`--accion`, `--marca`, `--foco`, `--fuente-display`) solo dentro de ese bloque. Los componentes no saben del tema: un `btn btn-accion` sale azul en el taller y ciruela en Aroma sin tocar su CSS.
  - `tema-taller` (Reparaciones: portada, laptop, conceptos): grafito `#0F1216` y azul puro `#0A6CFF` como único acento, sin degradados de color. Para texto chico se usa `--acento-texto` (`#4D94FF`), porque el azul de los botones no llega a 4.5:1 sobre grafito.
  - `tema-aroma` (Aroma): marfil `#F6F1E7`, champán `#E9D9BC`, ciruela `#4A1F3A` (marca y acción), negro `#141014`, dorado `#A8853A` solo para líneas. Títulos en serif (Cormorant Garamond 500, autoalojada en `public/fuentes/`).
  - Anime no tiene tema propio: usa el global, con la tarjeta azul marino en la portada. Se decidió conservarla así.
- **Reglas:** un acento por sección; tarjetas solo cuando agrupan algo que se toca; sombras y degradados solo para profundidad real (el halo de la laptop), nunca de color a color; microinteracciones de 150 a 250 ms con `--ease-salida`; todo respeta `prefers-reduced-motion`.

## Portada y entrada de las páginas

La portada (`src/pages/Inicio.jsx`) presenta lo que Kirei hace y vende; los productos y los precios viven en cada sección (`/tecnologia`, `/aroma`, `/anime`).

- `HeroKirei`: título grande y dos móviles inclinados (`TelefonosHero`, hechos en CSS, con la interfaz de la tienda en la pantalla).
- `QueHacemos`: Tecnología, Reparaciones, Aroma y Anime.
- `Conceptos`: Reparación, Mejoras y Tienda en tres filas tipográficas grandes. La laptop en 3D no está en la portada: vive solo en `/reparaciones`.
- `Aparece` (`src/components/ui`): la entrada de marca (sube desde un desenfoque de 8 px, escalonada 0,15 s). La usan las cabeceras de todas las páginas.

Para agregar otra sección de la tienda (por ejemplo, otra línea de productos): una entrada en `SECCIONES` y otra en `CATEGORIAS` de `src/data/catalogos.js`, un archivo de página como `src/pages/Aroma.jsx`, la ruta en `src/App.jsx`, el enlace en `Header.jsx` y `NavMovil.jsx`, y la ruta en el sitemap de `scripts/compilar.mjs`.

## Laptop 3D del taller (`/reparaciones`)

`src/components/reparaciones/laptop/`, tres archivos con una responsabilidad cada uno:

- `secuencia.js`: el guion, datos puros. Qué pieza sale, hacia dónde (mm), cuándo sale y cuándo vuelve. `estado(t)` devuelve la posición de todo en el segundo `t`. No importa three, así que se prueba en `tests/taller-aroma.test.js`.
- `escena.js`: three. Carga `public/modelos/laptop.glb`, pone luz de estudio (`RoomEnvironment`), aplica el estado a los nodos por nombre y mueve la cámara. Es el único archivo que importa three y se carga con `import()` cuando la sección se acerca a la pantalla: el resto de la web no lo descarga.
- `LaptopTaller.jsx`: el componente. Reproduce el guion solo y en bucle, con Pausar, Reiniciar y una barra para recorrerlo. Fuera de pantalla o con la pestaña oculta no dibuja. Con movimiento reducido arranca quieta en la vista desarmada. Si WebGL falla, deja un mensaje y los pasos en texto.

El orden del desarme es el real del equipo: cinco tornillos por debajo, sale la cubierta del teclado y debajo están batería, memoria, SSD, WiFi, disipador con ventilador, placa y altavoces.

**De dónde sale el modelo.** Chasis, pantalla, teclado (78 teclas), trackpad, tarjetas de expansión y batería (4 celdas) son el CAD oficial de Framework Laptop 13, publicado con licencia CC BY 4.0 (https://github.com/FrameworkComputer/Framework-Laptop-13). La licencia obliga a dar crédito: está en el texto bajo la escena y no se debe quitar. El CAD publicado no trae la placa ni lo que va sobre ella, así que placa base, CPU, disipador, ventilador, RAM, SSD, WiFi, altavoces y tornillos están modelados en `scripts/modelo3d/construir.py` con las medidas de sus estándares (SO-DIMM 69,6 x 30 mm, M.2 2280 y 2230) y la distribución del equipo real. No son una réplica de la placa de Framework y la web lo dice.

**Regenerar el modelo** (solo si se cambia): convertir los STEP del repositorio de Framework con `scripts/modelo3d/step2obj.cjs` (usa `occt-import-js`, que se instala aparte y no es dependencia del proyecto), correr `blender -b -P scripts/modelo3d/construir.py -- <carpeta> <salida.glb>` con Blender 5.3 y pasar el resultado por `gltf-transform optimize --compress quantize`. Se cuantiza y no se usa Draco ni Meshopt a propósito: sus descompresores son WebAssembly y la política de seguridad de `firebase.json` (`script-src 'self'`) los bloquearía.

## Aroma (`/aroma`)

Página propia (`src/pages/Aroma.jsx`, piezas en `src/components/aroma/`) con el tema `tema-aroma`: portada, familias olfativas, catálogo con filtro, ingredientes, recomendador y cierre.

- **Perfumes reales:** se crean en `/admin` con categoría Aroma, como cualquier producto. En la tabla de datos del editor se ponen las filas `Familia` (Florales, Amaderadas, Cítricas, Orientales, Frescas o Dulces y gourmand), `Tamaño` (por ejemplo `100 ml`), `Intensidad` (Suave o Intensa) y `Momento` (Día o Noche). `datosPerfume` en `src/lib/aroma.js` las lee; de ahí salen el filtro por familia y el recomendador. No hay campos nuevos en la base ni cambios en las reglas.
- **Catálogo de muestra:** mientras no haya ningún perfume publicado, la página enseña `PERFUMES_MUESTRA` de `src/data/aroma.js`. Son nombres y precios de ejemplo, no inventario: llevan la insignia "Muestra", el texto "precio de ejemplo" y un aviso arriba, no se pueden comprar (solo consultar por WhatsApp) y no están en el buscador, el sitemap ni Firestore. En cuanto se publique el primer perfume real, las muestras dejan de mostrarse solas.
- **Sin foto:** un perfume sin foto se dibuja con `Frasco.jsx` (silueta, color de su familia e iniciales).
- **Recomendador:** `recomendar` puntúa cada perfume del catálogo visible con las cuatro respuestas y devuelve los de mayor puntaje. No hay azar.
- El ícono de Aroma (`src/components/ui/IconoAroma.jsx`) es el único propio; el resto son Bootstrap Icons.
