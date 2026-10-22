import './arranque.jsx';

// Si se publicó una versión nueva, un fragmento viejo en caché falla al cargar: recargamos.
window.addEventListener('vite:preloadError', () => location.reload());
