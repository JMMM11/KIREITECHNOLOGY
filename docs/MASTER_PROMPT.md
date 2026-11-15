# MASTER PROMPT: PREMIUM DIGITAL ECOSYSTEM

Especificación principal de la evolución del proyecto (versión 1.0, guardada el 15 de noviembre de 2026). Se ejecuta por fases, cada una con informe y pruebas, y se espera autorización antes de cambios estructurales o de recursos externos.

Estado de las fases: ver el final de este documento.

## 01. Visión general

Actuar como un equipo multidisciplinario (arquitecto de software, frontend senior, diseño UI/UX premium, artista técnico 3D, especialista en Blender, desarrollador Three.js / React Three Fiber, motion designer, ingeniero de rendimiento y QA).

Misión: llevar el proyecto existente a una experiencia digital comercial premium, con identidad visual profesional, interacciones avanzadas, animaciones cuidadas y arquitectura limpia. Nada genérico, nada de plantilla, nada que parezca generado automáticamente.

Importante: se trabaja sobre el proyecto existente. No se empieza de cero, no se reemplaza la arquitectura sin justificación, no se tocan secciones ajenas a los objetivos. Se conservan identidad, funcionalidades, navegación y componentes que ya funcionan.

## 02. Fase 1: auditoría del proyecto (obligatoria antes de desarrollar)

Analizar estructura, framework y versiones, dependencias, componentes, páginas, estilos, navegación, sistemas de animación, duplicados y problemas de rendimiento. Atención especial a Home, Servicios, Reparaciones, Anime, Aromas, catálogo y componentes compartidos.

Entregar: arquitectura actual, tecnologías reutilizables, archivos a modificar, componentes a conservar y a mejorar, recursos gráficos y 3D necesarios, dependencias justificadas, riesgos técnicos y plan de implementación. En esta fase no se modifican archivos, no se instalan dependencias ni se eliminan componentes.

## 03. Fase 2: identidad visual y sistema de diseño

Sistema visual coherente para toda la web: identidad general reconocible y dirección artística propia por sección.

- Tecnología y Reparaciones: fondo grafito y negro tecnológico, azul puro como único acento (sólido y consistente en botones, indicadores, iconos y detalles), elementos metálicos, iluminación controlada, interfaces limpias. Sin degradados azules exagerados, sin neón innecesario.
- Anime: conservar la dirección visual implementada. No rediseñar ni forzar que coincida con las demás secciones.
- Aromas: champán, marfil, ciruela, negro profundo, detalles dorados, fotografía editorial, composiciones asimétricas, iluminación cinematográfica. Debe transmitir lujo y experiencia sensorial, no una tienda tecnológica con perfumes.
- Reglas generales: consistencia tipográfica, jerarquía, espacios negativos, evitar exceso de tarjetas, sombras y degradados innecesarios, microinteracciones elegantes, legibilidad, responsive. No modificar lo que ya tiene calidad sin una razón.

## 04. Fase 3: Home y distribución del contenido

La portada es la entrada al ecosistema: servicios tecnológicos, reparaciones, productos, Anime y Aromas.

Regla: la laptop 3D desmontándose aparece una sola vez en toda la web, en Reparaciones. En Home se usa otra composición (fotografía de producto, elementos editoriales, tipografía). Cada sección aporta algo nuevo al recorrido.

## 05. Fase 4: experiencia 3D de la laptop en Reparaciones

Experiencia tridimensional hiperrealista, con la laptop como protagonista. Nada que parezca juguete, ilustración o simulación básica.

- Modelo: laptop profesional realista (referencias: ASUS ROG, Dell XPS, ThinkPad, MacBook Pro; sin copiar marcas). Chasis de aluminio, pantalla delgada, biseles proporcionados, teclado, trackpad, bisagras, puertos, tornillos, carcasa inferior, distribución interna coherente.
- Componentes con geometría independiente, nombre, transformación, posición y orientación originales y materiales: pantalla, carcasa superior e inferior, teclado, trackpad, placa madre, procesador, RAM, SSD, batería, ventiladores, disipador, heat pipes, altavoces, conectores, cables flex, tornillos. No inventar componentes; si el modelo no incluye una pieza, informarlo.
- Origen del modelo: Sketchfab, CGTrader, TurboSquid, Blender propio o Blender Python validado. Formatos GLB/GLTF (BLEND para preparar). Licencia comercial. Un modelo convincente no se presenta como réplica técnicamente auténtica si sus piezas son inventadas.
- Secuencia automática en seis estados: laptop completa con órbita suave; preparación; apertura y desmontaje ordenado (cubierta, tornillos, batería, ventiladores, refrigeración, placa, RAM, SSD); vista explotada con órbita; reensamblaje inverso; resultado final con pantalla encendida y contenido comercial.
- Automatización: inicia al entrar en la sección, no depende del scroll para completarse, puede repetirse, pausarse y reiniciarse, respeta movimiento reducido y ahorro de recursos.
- Física visual: respetar orígenes, ejes, orientaciones, distancias, secuencia y dependencias. Sin atravesar geometrías, sin desplazamientos aleatorios, sin simular con escalados o apariciones.
- Tecnologías: Three.js, React Three Fiber, Drei; GSAP solo si aporta valor; Blender para preparar. Comprobar compatibilidad con React antes de instalar.
- Dirección artística: grafito, azul puro, reflejos metálicos, materiales PBR, luz de estudio, sombras suaves, cámara cinematográfica. La laptop debe parecer un producto real fotografiado en estudio.

## 06. Fase 5: experiencia comercial de Reparaciones

La 3D se integra en una sección comercial completa. Servicios: diagnóstico, reparación de laptops, mantenimiento preventivo, limpieza interna, cambio de pantalla, sustitución de batería, reparación de placa madre, actualización de RAM, instalación de SSD, optimización del sistema. Composición editorial, sin cuadrícula excesiva de tarjetas. Cada servicio con nombre, descripción, recurso visual, información relevante y acción. Llamadas a la acción: solicitar diagnóstico, consultar reparación, ver componentes, contactar al servicio técnico.

## 07. Fase 6: Aromas, perfumería premium

Concepto: The Art of Fragrance. Lujo, elegancia, exclusividad, identidad, experiencia sensorial. No una cuadrícula básica.

- Hero inmersivo: frasco protagonista, fotografía o render hiperrealista, luz cinematográfica, reflejos, vapor sutil, serif sofisticada. Texto: "THE ART OF FRAGRANCE. Descubre fragancias que expresan tu esencia." Botón: Explorar fragancias.
- Olfactory World: familias florales, amaderadas, cítricas, orientales, frescas, dulces y gourmand, cada una con identidad visual.
- Featured Fragrances: catálogo con fotografía, marca, nombre, familia, tamaño, precio, descripción y botón. Información real; no inventar marcas, precios ni existencias.
- The Ingredients: vainilla, sándalo, ámbar, cítricos, flores, especias, con fotografía macro.
- Signature Collection: novedades, exclusivos, colecciones, destacados.
- Find Your Scent: recomendador con cuatro preguntas (dulce o fresco, suave o intenso, día o noche, familia) que filtra productos existentes. Sin recomendaciones aleatorias.
- Cierre: "Every fragrance tells a story. Find yours." Botón: Discover the collection.

### Catálogo y compra de Aromas

Debe mostrar perfumes concretos con sus características y precios. Cada ficha: nombre, marca cuando corresponda, precio en USD, presentación en ml, familia olfativa, descripción breve, disponibilidad solo si está confirmada, imagen cuando exista.

Sin fotografía: nada de espacios vacíos ni imágenes rotas. Presentación alternativa elegante (fondos sofisticados, siluetas de frasco, iniciales, elementos de las notas, composición tipográfica).

Productos de demostración: permitidos para visualizar el catálogo, identificados internamente como demostrativos y nunca presentados como inventario o precios reales. Estructura de datos reutilizable para sustituirlos por el catálogo real sin rediseñar.

El usuario debe poder explorar, ver precios, consultar características, filtrar por familia, abrir el detalle y contactar al negocio. Aromas mantiene el mismo nivel de funcionalidad que las demás secciones comerciales.

## 08. Fase 7: Anime

Conservar el diseño. Analizar implementación, identidad, animaciones, responsive y errores. Solo mejoras con razón concreta de usabilidad, rendimiento o consistencia técnica.

## 09. Fase 8: recursos, modelado y pipeline 3D

Blender para importar o construir, organizar piezas, corregir geometría, orígenes, materiales, pivotes, interferencias, animaciones de referencia y exportación. Se permite apoyo de IA (modelado, Python, materiales, renders), siempre revisado. Validar antes de exportar: piezas separadas, nombres, normales, UVs, materiales, escalas, pivotes, posiciones de montaje, estados armado y desarmado. Exportar GLB conservando geometría, nombres, jerarquía, materiales, texturas y transformaciones.

## 10. Fase 9: arquitectura y organización del código

Modular y reutilizable. Separar componentes visuales, lógica de animación, carga de modelos, cámara, iluminación, materiales, servicios comerciales, catálogo y navegación. Adaptar a la estructura real del proyecto sin reorganizar carpetas innecesariamente. Código legible, responsabilidades claras, manejo de errores, lazy loading, sin dependencias duplicadas. No sacrificar mantenibilidad por un efecto visual.

## 11. Fase 10: rendimiento y responsive

Comprimir GLB, optimizar texturas, reducir polígonos, instancing, controlar resolución, evitar renders innecesarios, liberar GPU, cargar bajo demanda con estado de carga elegante y sin bloquear la navegación. Escritorio: experiencia completa. Tablet: reducir complejidad. Móvil: adaptar dimensiones, resolución y sombras. Accesibilidad: prefers-reduced-motion, controles accesibles, contraste, animaciones que no bloquean. Medir FPS, carga, peso, memoria, errores de consola y móvil. No declarar optimizado sin comprobarlo.

## 12. Fase 11: pruebas y control de calidad

Pruebas generales (navegación, enlaces, botones, responsive, imágenes, animaciones, formularios, consola, navegadores), pruebas 3D (carga, piezas completas, sin intersecciones, desmontaje y ensamblaje completos, automática, repetible, cámara suave, rendimiento) y visuales (jerarquía, espaciado, tipografía, composición, color, transiciones, móvil, repeticiones). Informe final: funcionalidades, archivos, dependencias, recursos, resultados, problemas, limitaciones y mejoras. No afirmar que algo funciona sin probarlo.

## 13. Reglas inquebrantables

1. No eliminar funcionalidades existentes.
2. No reemplazar el proyecto por una plantilla.
3. No modificar secciones ajenas al trabajo solicitado.
4. No duplicar la experiencia 3D de la laptop.
5. No usar componentes ficticios para aparentar realismo.
6. No usar imágenes planas como sustituto de geometría 3D.
7. No presentar modelos simplificados como hardware auténtico.
8. No usar degradados azules excesivos.
9. Mantener el azul puro como acento tecnológico.
10. Conservar la identidad visual de Anime.
11. Mantener Aromas como experiencia editorial independiente.
12. No instalar paquetes sin comprobar compatibilidad.
13. No introducir dependencias innecesarias.
14. No generar código monolítico.
15. No ignorar errores de consola.
16. No sacrificar rendimiento por efectos visuales.
17. No inventar información comercial.
18. No afirmar que una prueba se completó si no se ejecutó.
19. No sobrescribir archivos importantes sin respaldo.
20. No realizar cambios destructivos sin autorización.

Metodología: por fases. Al terminar cada una: qué se desarrolló, archivos modificados, decisiones técnicas, pruebas, errores, y esperar autorización cuando el siguiente paso implique cambios estructurales o recursos externos pendientes. Calidad antes que velocidad. Si falta un recurso fundamental, detener esa parte y explicar qué se necesita.

## 14. Orden de ejecución

1. Auditoría del proyecto (sin modificar archivos).
2. Sistema visual.
3. Preparación del modelo 3D.
4. Prototipo 3D (GLB, cámara, luces, materiales).
5. Animación automática.
6. Integración en Reparaciones con los servicios.
7. Mejoras de Home (sin duplicaciones).
8. Aromas y Anime.
9. Optimización.
10. Control de calidad.

## 15. Entorno de desarrollo y producción

Blender es herramienta externa de desarrollo. Three.js y React Three Fiber son dependencias del proyecto que se ejecutan en el navegador. GSAP solo si resulta necesario. Node.js para desarrollo y compilación. Los visitantes no instalan nada; los GLB se sirven desde el hosting del proyecto; la página compilada funciona sin el entorno local.

## Estado de las fases en este proyecto

- Fase 1 (15 de noviembre de 2026): informe entregado. Hallazgos clave: la laptop CSS estaba en Home y Reparaciones; Anime no tiene identidad propia (comparte `SeccionTienda` con Aroma); Aroma está vacía; el acento global es naranja; no hay GLB ni Three.js; la CSP de Firebase necesitaría `'wasm-unsafe-eval'` para Draco.
- Fase 2 (15 de noviembre de 2026): temas por sección en `src/styles/tokens.css` (`tema-taller`, `tema-aroma`), aplicados a la portada de Reparaciones, la laptop, las tarjetas de la portada y la página Aroma. Detalle en `docs/ARQUITECTURA.md`, sección "Sistema visual". Decisión: el azul puro vive solo en el taller; el naranja sigue siendo la acción global. Anime se conserva con el tema global.
- Fases 3 a 11: pendientes.
