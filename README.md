# Kirei Technology

Tienda online en HTML, CSS y JavaScript, sin dependencias.

## Ver la web

Abre `index.html` en el navegador. También puedes servirla con `python -m http.server`.

## Dónde editar

- `js/data.js`: productos, precios (en centavos), stock, servicios, teléfonos, correo y tarifas.
  - `precio: null` muestra "[precio]" y cambia el botón por "Consultar precio por WhatsApp".
  - `imgs: []` muestra "Foto pendiente". Las fotos van en `assets/img/`.
- `css/styles.css`: tokens de color y tipografía en `:root`.
- `js/totales.js`: cálculo de subtotal, envío y contra entrega.

## Pruebas

```
node tests/totales.test.js
```

## Cómo funciona el pedido

El carrito guarda solo productos y cantidades en el navegador. Al finalizar, la web arma
el mensaje del pedido y abre WhatsApp. No se guardan datos personales ni de pago.
El botón de pago de Yappy necesita un backend y credenciales de comercio. Está pendiente.

## Modelo de datos (para el backend futuro)

- categoria: id, nombre, linea (electronica, anime)
- producto: id, categoria, nombre, resumen, precio_centavos, imagenes
- variante: id, producto, nombre, stock
- cliente: nombre, telefono, correo, direccion (tabla aparte, Ley 81 de 2019)
- pedido: cliente, estado (pendiente, pagado, en_camino, entregado, cancelado), entrega, pago, cargos en centavos
- linea_pedido: pedido, variante, cantidad, precio_unitario_centavos (copiado al comprar)
- cita_reparacion: cliente, equipo, servicio, problema, fecha, estado (solicitada, confirmada, en_revision, lista, entregada, cancelada)
- mensaje_soporte: cliente, canal, texto, estado (abierto, respondido, cerrado)
