// Comportamiento de la tienda: cabecera, pie, carrito, catálogo, producto, checkout y reparaciones.
(function () {
  'use strict';

  const K = window.KIREI;
  const { formatearDinero, calcularTotales } = window.KireiTotales;
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const precioTexto = (c) => (c == null ? '[precio]' : formatearDinero(c));
  const buscarProducto = (id) => K.productos.find((p) => p.id === id);
  const variantesDe = (p) => p.variantes || [{ id: 'unica', nombre: '', stock: null }];
  const whatsapp = (numero, texto) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const icono = (trazos, tam = 22) =>
    `<svg viewBox="0 0 24 24" width="${tam}" height="${tam}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${trazos}</svg>`;
  const I = {
    bolsa: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: '<path d="M4 9h16M4 15h16"/>',
    cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
    flecha: '<path d="M9 6l6 6-6 6"/>',
    menos: '<path d="M6 12h12"/>',
    mas: '<path d="M12 6v12M6 12h12"/>',
  };

  function media(src, alt, tono, clase) {
    if (!src) {
      return `<div class="${clase} media media--vacia"><img src="assets/logo/kirei-icono.svg" alt="" width="26" height="50"><span>Foto pendiente</span></div>`;
    }
    return `<div class="${clase} media media--${tono || 'claro'}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"></div>`;
  }

  function tarjeta(p) {
    return `<a class="card reveal" href="producto.html?id=${encodeURIComponent(p.id)}">
      ${media(p.imgs[0], p.nombre, p.tono, 'card__media')}
      <span class="card__body"><h3 class="card__title">${esc(p.nombre)}</h3><span class="card__price">${precioTexto(p.precio)}</span></span>
    </a>`;
  }

  // Aparición al entrar en pantalla
  const observador = 'IntersectionObserver' in window
    ? new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); observador.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' })
    : null;
  function revelar(raiz = document) {
    $$('.reveal:not(.is-visible)', raiz).forEach((el) => (observador ? observador.observe(el) : el.classList.add('is-visible')));
  }

  // Cabecera y pie
  function pintarCabecera() {
    const enlaces = [
      ['index.html?cat=audifonos#tienda', 'Audífonos'],
      ['index.html?cat=relojes#tienda', 'Relojes'],
      ['index.html?cat=accesorios#tienda', 'Accesorios'],
      ['index.html#anime', 'Anime'],
      ['reparaciones.html', 'Reparaciones'],
    ];
    const cab = $('#cabecera');
    cab.innerHTML = `
      <div class="container header__bar">
        <a class="header__logo" href="index.html"><img src="assets/logo/kirei-logo-fondo-claro.svg" alt="Kirei Technology, inicio" width="151" height="36"></a>
        <nav class="header__nav" id="menu" aria-label="Principal">
          <ul>${enlaces.map(([href, texto]) => `<li><a href="${href}">${texto}</a></li>`).join('')}</ul>
        </nav>
        <div class="header__actions">
          <button class="icon-btn" type="button" id="abrir-carrito" aria-haspopup="dialog" aria-label="Carrito">${icono(I.bolsa)}<span class="cart-count" hidden></span></button>
          <button class="icon-btn header__menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menú">
            <span class="i-abrir">${icono(I.menu)}</span><span class="i-cerrar">${icono(I.cerrar)}</span>
          </button>
        </div>
      </div>`;
    const boton = $('.header__menu-btn', cab);
    const cerrar = () => { cab.classList.remove('is-open'); boton.setAttribute('aria-expanded', 'false'); };
    boton.addEventListener('click', () => boton.setAttribute('aria-expanded', String(cab.classList.toggle('is-open'))));
    $$('.header__nav a', cab).forEach((a) => a.addEventListener('click', cerrar));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
  }

  function pintarPie() {
    const c = K.contacto;
    $('#pie').innerHTML = `
      <div class="container footer__grid">
        <div class="footer__brand"><img src="assets/logo/kirei-logo-fondo-oscuro.svg" alt="Kirei Technology" width="168" height="40"></div>
        <div>
          <h2 class="footer__title">Contacto</h2>
          <ul>
            <li><a href="${whatsapp(c.ventasWhatsApp, 'Hola Kirei')}" target="_blank" rel="noopener">Ventas ${c.ventasTexto}</a></li>
            <li><a href="${whatsapp(c.reparacionesWhatsApp, 'Hola Kirei')}" target="_blank" rel="noopener">Reparaciones ${c.reparacionesTexto}</a></li>
            ${c.correo ? `<li><a href="mailto:${esc(c.correo)}">${esc(c.correo)}</a></li>` : ''}
          </ul>
        </div>
        <div><h2 class="footer__title">Redes</h2><p>${esc(c.redes)}</p></div>
        <div><h2 class="footer__title">Ubicación</h2><p>${esc(c.ubicacion)}</p></div>
        <div>
          <h2 class="footer__title">Legal</h2>
          <ul>
            <li><a href="legal.html#privacidad">Privacidad</a></li>
            <li><a href="legal.html#terminos">Términos</a></li>
            <li><a href="legal.html#garantia">Garantía y envíos</a></li>
          </ul>
        </div>
      </div>
      <div class="container"><p class="footer__bottom">© ${new Date().getFullYear()} Kirei Technology. Envíos solo dentro de Panamá.</p></div>`;
  }

  function llenarTarifas() {
    $$('[data-tarifa]').forEach((el) => { el.textContent = precioTexto(K.tarifas[el.dataset.tarifa]); });
  }

  // Carrito: guarda solo id, variante y cantidad. El precio se lee del catálogo.
  const CLAVE = 'kirei-carrito';
  const topeCantidad = (stock) => (stock == null ? 10 : stock); // shortcut: tope de 10 por línea mientras no haya stock real
  let carrito = (() => {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch { return []; }
  })().filter((l) => {
    const p = buscarProducto(l.id);
    return p && p.precio != null && Number.isInteger(l.cantidad) && l.cantidad > 0 && variantesDe(p).some((v) => v.id === l.variante);
  });

  function guardarCarrito() {
    try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch { /* sin almacenamiento: el carrito dura mientras la página esté abierta */ }
    pintarCarrito();
    document.dispatchEvent(new Event('carrito'));
  }

  function lineasCarrito() {
    return carrito.map((l) => {
      const p = buscarProducto(l.id);
      const v = variantesDe(p).find((x) => x.id === l.variante);
      return { id: p.id, variante: v.id, nombre: p.nombre, varianteNombre: v.nombre, precio: p.precio, cantidad: l.cantidad, img: v.img || p.imgs[0], tono: p.tono };
    });
  }

  function agregarAlCarrito(id, variante, cantidad) {
    const v = variantesDe(buscarProducto(id)).find((x) => x.id === variante);
    const linea = carrito.find((l) => l.id === id && l.variante === variante);
    const tope = topeCantidad(v.stock);
    if (linea) linea.cantidad = Math.min(tope, linea.cantidad + cantidad);
    else carrito.push({ id, variante, cantidad: Math.min(tope, cantidad) });
    guardarCarrito();
  }

  function lineaHTML(l) {
    const datos = `data-id="${esc(l.id)}" data-variante="${esc(l.variante)}"`;
    return `<li class="line">
      ${media(l.img, '', l.tono, 'line__media')}
      <div class="line__info">
        <p class="line__name">${esc(l.nombre)}</p>
        ${l.varianteNombre ? `<p class="muted small">${esc(l.varianteNombre)}</p>` : ''}
        <p>${formatearDinero(l.precio * l.cantidad)}</p>
        <div class="stepper">
          <button type="button" data-cantidad="-1" ${datos} aria-label="Quitar uno de ${esc(l.nombre)}">${icono(I.menos, 18)}</button>
          <output aria-live="polite">${l.cantidad}</output>
          <button type="button" data-cantidad="1" ${datos} aria-label="Agregar uno de ${esc(l.nombre)}">${icono(I.mas, 18)}</button>
        </div>
      </div>
    </li>`;
  }

  function montarCarrito() {
    const d = document.createElement('dialog');
    d.className = 'drawer';
    d.id = 'carrito';
    d.setAttribute('aria-labelledby', 'carrito-titulo');
    d.innerHTML = `<div class="drawer__panel">
      <div class="drawer__head"><h2 id="carrito-titulo">Tu carrito</h2><button class="icon-btn" type="button" data-cerrar aria-label="Cerrar carrito">${icono(I.cerrar)}</button></div>
      <div class="drawer__body" id="carrito-lineas"></div>
      <div class="drawer__foot" id="carrito-pie"></div>
    </div>`;
    document.body.append(d);
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-cerrar]')) d.close(); });
    $('#abrir-carrito').addEventListener('click', () => d.showModal());

    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cantidad]');
      if (!b) return;
      const l = carrito.find((x) => x.id === b.dataset.id && x.variante === b.dataset.variante);
      if (!l) return;
      const v = variantesDe(buscarProducto(l.id)).find((x) => x.id === l.variante);
      l.cantidad = Math.min(topeCantidad(v.stock), l.cantidad + Number(b.dataset.cantidad));
      carrito = carrito.filter((x) => x.cantidad > 0);
      const raiz = b.closest('dialog') || document;
      const selector = `[data-cantidad="${b.dataset.cantidad}"][data-id="${b.dataset.id}"][data-variante="${b.dataset.variante}"]`;
      guardarCarrito();
      ($(selector, raiz) || $('[data-cerrar]', d)).focus();
    });
    pintarCarrito();
  }

  function pintarCarrito() {
    const ls = lineasCarrito();
    const n = ls.reduce((s, l) => s + l.cantidad, 0);
    const contador = $('.cart-count');
    if (contador) { contador.textContent = n; contador.hidden = n === 0; }
    $('#abrir-carrito')?.setAttribute('aria-label', `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);
    const cuerpo = $('#carrito-lineas');
    const pie = $('#carrito-pie');
    if (!cuerpo) return;
    if (!ls.length) {
      cuerpo.innerHTML = `<div class="empty"><p>Tu carrito está vacío.</p><a class="link" href="index.html#tienda">Ver la tienda ${icono(I.flecha, 16)}</a></div>`;
      pie.innerHTML = '';
      return;
    }
    const subtotal = ls.reduce((s, l) => s + l.precio * l.cantidad, 0);
    cuerpo.innerHTML = `<ul class="lines">${ls.map(lineaHTML).join('')}</ul>`;
    pie.innerHTML = `<div class="row"><span>Subtotal</span><strong>${formatearDinero(subtotal)}</strong></div>
      <p class="muted small">El envío y los cargos se calculan al pagar.</p>
      <a class="btn btn--primary btn--block" href="checkout.html">Ir a pagar</a>`;
  }

  // Inicio
  function iniciarInicio() {
    const electronica = K.categorias.filter((c) => c.linea === 'electronica');

    $('#categorias-grid').innerHTML = K.categorias.map((c) => `
      <a class="cat-card reveal" href="${c.linea === 'anime' ? 'index.html#anime' : `index.html?cat=${c.id}#tienda`}">
        ${media(c.img, '', c.tono, 'cat-card__media')}
        <h3 class="cat-card__title">${esc(c.nombre)}</h3>
      </a>`).join('');

    const filtros = $('#tienda-filtros');
    filtros.innerHTML = [{ id: '', nombre: 'Todo' }, ...electronica]
      .map((c) => `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="false">${esc(c.nombre)}</button>`).join('');

    function filtrar(cat) {
      if (!electronica.some((c) => c.id === cat)) cat = '';
      $$('.chip', filtros).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
      const lista = K.productos.filter((p) => (cat ? p.categoria === cat : electronica.some((c) => c.id === p.categoria)));
      $('#tienda-grid').innerHTML = lista.map(tarjeta).join('');
      revelar($('#tienda-grid'));
      return cat;
    }

    filtros.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      const cat = filtrar(b.dataset.cat);
      history.replaceState(null, '', cat ? `?cat=${cat}#tienda` : '#tienda');
    });

    // Los enlaces de categoría de esta misma página filtran sin recargar
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href*="?cat="]');
      if (!a) return;
      const url = new URL(a.href);
      if (url.pathname !== location.pathname) return;
      e.preventDefault();
      filtrar(url.searchParams.get('cat'));
      history.replaceState(null, '', url.search + url.hash);
      $('#tienda').scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth' });
    });

    filtrar(new URLSearchParams(location.search).get('cat') || '');
    $('#anime-grid').innerHTML = K.productos.filter((p) => p.categoria === 'anime').map(tarjeta).join('');
  }

  // Producto
  function iniciarProducto() {
    const cont = $('#producto');
    const p = buscarProducto(new URLSearchParams(location.search).get('id'));
    if (!p) {
      cont.innerHTML = `<div class="empty"><h1 class="title">No encontramos este producto.</h1><a class="link" href="index.html#tienda">Ver la tienda ${icono(I.flecha, 16)}</a></div>`;
      return;
    }
    document.title = `${p.nombre} | Kirei Technology`;
    const vs = variantesDe(p);
    const categoria = K.categorias.find((c) => c.id === p.categoria);
    const t = K.tarifas;

    cont.innerHTML = `
      <div class="product">
        <div class="product__gallery">
          ${media(p.imgs[0], p.nombre, p.tono, 'product__main')}
          ${p.imgs.length > 1 ? `<div class="thumbs" role="group" aria-label="Fotos del producto">${p.imgs.map((src, i) => `
            <button type="button" class="thumb" data-src="${esc(src)}" aria-label="Ver foto ${i + 1}" ${i === 0 ? 'aria-current="true"' : ''}><img src="${esc(src)}" alt=""></button>`).join('')}</div>` : ''}
        </div>
        <div class="product__info">
          <p class="eyebrow">${esc(categoria.nombre)}</p>
          <h1 class="product__title">${esc(p.nombre)}</h1>
          <p class="muted">${esc(p.resumen)}</p>
          <p class="product__price">${precioTexto(p.precio)}</p>
          <form id="form-agregar" class="form">
            ${vs.length > 1 ? `<fieldset class="options"><legend>${esc(p.opcion || 'Opción')}</legend><div class="options__list">${vs.map((v, i) => `
              <label class="option"><input type="radio" name="variante" value="${esc(v.id)}" ${i === 0 ? 'checked' : ''} ${v.stock === 0 ? 'disabled' : ''}><span>${esc(v.nombre)}</span></label>`).join('')}</div></fieldset>`
              : `<input type="hidden" name="variante" value="${esc(vs[0].id)}">`}
            ${p.precio != null ? `<div class="field qty"><label for="cantidad">Cantidad</label><input class="input" id="cantidad" name="cantidad" type="number" inputmode="numeric" min="1" max="10" value="1" required></div>` : ''}
            <p class="small muted" id="stock" aria-live="polite"></p>
            ${p.precio != null
              ? '<button class="btn btn--primary btn--block" type="submit">Agregar al carrito</button>'
              : '<a class="btn btn--primary btn--block" id="consultar" target="_blank" rel="noopener" href="#">Consultar precio por WhatsApp</a>'}
          </form>
          <ul class="facts">
            <li><strong>Garantía de 1 semana.</strong> Si algo falla, revisamos el equipo y, según el daño, te damos una solución.</li>
            <li><strong>Entrega.</strong> Retiro gratis o envío a domicilio en Panamá por ${precioTexto(t.envioDomicilio)}.</li>
            <li><strong>Pago.</strong> Yappy o contra entrega en pedidos desde ${precioTexto(t.contraEntregaMinimo)}, con cargo de ${precioTexto(t.contraEntregaCargo)}.</li>
          </ul>
        </div>
      </div>
      <section class="section" aria-labelledby="relacionados-titulo" id="relacionados">
        <div class="section__head"><h2 class="title" id="relacionados-titulo">También te puede gustar</h2></div>
        <div class="grid" id="relacionados-grid"></div>
      </section>`;

    const form = $('#form-agregar');
    const principal = $('.product__main img');
    const varianteActual = () => vs.find((v) => v.id === (form.querySelector('[name="variante"]:checked') || form.variante).value);

    function mostrarFoto(src) {
      if (!principal || !src) return;
      principal.src = src;
      $$('.thumb').forEach((b) => (b.dataset.src === src ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    }

    function actualizar() {
      const v = varianteActual();
      const agotado = v.stock === 0;
      $('#stock').textContent = agotado ? 'Agotado por ahora.' : (v.stock != null && v.stock <= 3 ? `Quedan ${v.stock}.` : '');
      const enviar = $('button[type="submit"]', form);
      if (enviar) enviar.disabled = agotado;
      const cantidad = $('#cantidad');
      if (cantidad) cantidad.max = topeCantidad(v.stock);
      const consultar = $('#consultar');
      if (consultar) consultar.href = whatsapp(K.contacto.ventasWhatsApp, `Hola Kirei, quiero saber el precio de ${p.nombre}${v.nombre ? ` (${v.nombre})` : ''}.`);
    }

    form.addEventListener('change', (e) => {
      if (e.target.name === 'variante') mostrarFoto(varianteActual().img);
      actualizar();
    });
    $$('.thumb').forEach((b) => b.addEventListener('click', () => mostrarFoto(b.dataset.src)));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (p.precio == null || !form.reportValidity()) return;
      agregarAlCarrito(p.id, varianteActual().id, Number($('#cantidad').value));
      $('#carrito').showModal();
    });
    actualizar();

    const relacionados = K.productos.filter((x) => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);
    if (relacionados.length) $('#relacionados-grid').innerHTML = relacionados.map(tarjeta).join('');
    else $('#relacionados').remove();
  }

  // Checkout. Los datos personales no se guardan: van directo al mensaje de WhatsApp.
  function iniciarCheckout() {
    const form = $('#form-pedido');
    const t = K.tarifas;
    const nombreEntrega = (entrega, envio) => ({
      retiro: 'Retiro (gratis)',
      punto: `Punto de encuentro (${envio == null ? 'costo por confirmar' : formatearDinero(envio)})`,
      domicilio: `Envío a domicilio (${precioTexto(envio)})`,
    }[entrega]);

    function pintar() {
      const ls = lineasCarrito();
      $('#checkout-vacio').hidden = ls.length > 0;
      $('#checkout').hidden = ls.length === 0;
      if (!ls.length) return;

      const contra = $('#pago-contra');
      let r = calcularTotales(ls, form.entrega.value, form.pago.value, t);
      contra.disabled = !r.contraEntregaPermitida;
      if (contra.disabled && contra.checked) {
        $('#pago-yappy').checked = true;
        r = calcularTotales(ls, form.entrega.value, 'yappy', t);
      }
      $('#ayuda-contra').textContent = r.contraEntregaPermitida
        ? `Pagas al recibir. Cargo de ${formatearDinero(t.contraEntregaCargo)}.`
        : `Disponible desde ${formatearDinero(t.contraEntregaMinimo)}. Te faltan ${formatearDinero(t.contraEntregaMinimo - r.subtotal)}.`;

      const domicilio = form.entrega.value === 'domicilio';
      $('#campo-direccion').hidden = !domicilio;
      $('#direccion').required = domicilio;

      $('#resumen-lineas').innerHTML = `<ul class="lines">${ls.map(lineaHTML).join('')}</ul>`;
      $('#resumen-totales').innerHTML = `
        <div class="row"><span>Subtotal</span><span>${formatearDinero(r.subtotal)}</span></div>
        <div class="row"><span>Entrega</span><span>${r.envioPorConfirmar ? 'Por confirmar' : formatearDinero(r.envio)}</span></div>
        ${r.cargoContraEntrega ? `<div class="row"><span>Cargo contra entrega</span><span>${formatearDinero(r.cargoContraEntrega)}</span></div>` : ''}
        <div class="row row--total"><span>Total</span><span>${formatearDinero(r.total)}</span></div>`;
    }

    form.addEventListener('change', pintar);
    document.addEventListener('carrito', pintar);
    form.telefono.addEventListener('input', () => form.telefono.setCustomValidity(''));
    pintar();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const digitos = form.telefono.value.replace(/\D/g, '').replace(/^507/, '');
      form.telefono.setCustomValidity(/^\d{7,8}$/.test(digitos) ? '' : 'Escribe un teléfono de Panamá de 7 u 8 dígitos.');
      if (!form.reportValidity()) return;

      const ls = lineasCarrito();
      const r = calcularTotales(ls, form.entrega.value, form.pago.value, t);
      const texto = [
        'Hola Kirei, quiero hacer este pedido:',
        ...ls.map((l) => `- ${l.cantidad} x ${l.nombre}${l.varianteNombre ? ` (${l.varianteNombre})` : ''}: ${formatearDinero(l.precio * l.cantidad)}`),
        '',
        `Subtotal: ${formatearDinero(r.subtotal)}`,
        `Entrega: ${nombreEntrega(form.entrega.value, r.envio)}`,
        `Pago: ${form.pago.value === 'yappy' ? 'Yappy' : `Contra entrega (cargo ${formatearDinero(r.cargoContraEntrega)})`}`,
        `Total: ${formatearDinero(r.total)}${r.envioPorConfirmar ? ' + entrega por confirmar' : ''}`,
        '',
        `Nombre: ${form.nombre.value.trim()}`,
        `Teléfono: ${form.telefono.value.trim()}`,
        form.correo.value.trim() ? `Correo: ${form.correo.value.trim()}` : null,
        form.entrega.value === 'domicilio' ? `Dirección: ${form.direccion.value.trim()}` : null,
        form.nota.value.trim() ? `Nota: ${form.nota.value.trim()}` : null,
      ].filter((x) => x !== null).join('\n');

      // shortcut: el pedido y el pago se confirman por WhatsApp; cambiar por el botón de pago de Yappy cuando haya backend y credenciales de comercio
      window.open(whatsapp(K.contacto.ventasWhatsApp, texto), '_blank', 'noopener');
      $('#enviado').hidden = false;
      $('#enviado').focus();
    });

    $('#vaciar').addEventListener('click', () => {
      carrito = [];
      guardarCarrito();
    });
  }

  // Reparaciones
  function iniciarReparaciones() {
    $('#servicios').innerHTML = K.servicios.map((s) => `
      <li class="service reveal"><h3>${esc(s.nombre)}</h3><span class="service__price">[precio]</span><p>${esc(s.detalle)}</p></li>`).join('');
    const form = $('#form-cita');
    form.servicio.innerHTML = '<option value="">Elige un servicio</option>' + K.servicios.map((s) => `<option>${esc(s.nombre)}</option>`).join('');
    form.fecha.min = new Date().toISOString().slice(0, 10);
    form.telefono.addEventListener('input', () => form.telefono.setCustomValidity(''));

    const c = K.contacto;
    $('#contacto-reparaciones').innerHTML = `
      <li><a class="link" href="${whatsapp(c.reparacionesWhatsApp, 'Hola Kirei, tengo una consulta de reparación.')}" target="_blank" rel="noopener">WhatsApp ${c.reparacionesTexto}</a></li>
      ${c.correo ? `<li><a class="link" href="mailto:${esc(c.correo)}">${esc(c.correo)}</a></li>` : ''}
      <li>${esc(c.ubicacion)}</li>
      <li>${esc(c.redes)}</li>`;

    function mensaje() {
      const digitos = form.telefono.value.replace(/\D/g, '').replace(/^507/, '');
      form.telefono.setCustomValidity(/^\d{7,8}$/.test(digitos) ? '' : 'Escribe un teléfono de Panamá de 7 u 8 dígitos.');
      if (!form.reportValidity()) return null;
      return [
        'Hola Kirei, quiero agendar una cita de reparación.',
        `Servicio: ${form.servicio.value}`,
        `Equipo: ${form.equipo.value}`,
        form.modelo.value.trim() ? `Marca y modelo: ${form.modelo.value.trim()}` : null,
        `Problema: ${form.problema.value.trim()}`,
        form.fecha.value ? `Fecha preferida: ${form.fecha.value}` : null,
        '',
        `Nombre: ${form.nombre.value.trim()}`,
        `Teléfono: ${form.telefono.value.trim()}`,
        form.correo.value.trim() ? `Correo: ${form.correo.value.trim()}` : null,
      ].filter((x) => x !== null).join('\n');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = mensaje();
      if (texto) window.open(whatsapp(c.reparacionesWhatsApp, texto), '_blank', 'noopener');
    });

    const porCorreo = $('#cita-correo-btn');
    porCorreo.hidden = !c.correo;
    porCorreo.addEventListener('click', () => {
      const texto = mensaje();
      if (texto) location.href = `mailto:${c.correo}?subject=${encodeURIComponent('Cita de reparación')}&body=${encodeURIComponent(texto)}`;
    });
  }

  pintarCabecera();
  pintarPie();
  montarCarrito();
  llenarTarifas();
  ({ inicio: iniciarInicio, producto: iniciarProducto, checkout: iniciarCheckout, reparaciones: iniciarReparaciones })[document.body.dataset.pagina]?.();
  revelar();
})();
