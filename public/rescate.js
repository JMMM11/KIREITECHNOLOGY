// Red de seguridad: si la app no arrancó en 10 s (una copia vieja en caché o la red falló), recarga una sola vez.
setTimeout(function () {
  try {
    if (!document.querySelector('#root > .arranque')) { sessionStorage.removeItem('kirei-rescate'); return; }
    if (sessionStorage.getItem('kirei-rescate')) return;   // ya se intentó: no recargar en bucle
    sessionStorage.setItem('kirei-rescate', '1');
  } catch (e) { return; }
  location.reload();
}, 10000);
