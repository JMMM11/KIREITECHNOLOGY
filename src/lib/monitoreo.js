// Monitoreo de errores con Sentry. Solo se activa con VITE_SENTRY_DSN; sin él no se descarga nada.
// Privacidad: sin IP, sin cookies ni cabeceras, sin datos de formularios, y textos e imágenes ocultos en las repeticiones.
const DSN = import.meta.env?.VITE_SENTRY_DSN;

// Quita del evento todo lo que pueda identificar al cliente. Probado en tests/monitoreo.test.js.
export function limpiarEvento(evento) {
  if (evento.user) evento.user = { id: evento.user.id };
  if (evento.request) {
    delete evento.request.cookies;
    delete evento.request.headers;
    delete evento.request.data;
    if (evento.request.url) evento.request.url = evento.request.url.split('?')[0];
  }
  delete evento.extra?.datos;
  return evento;
}

let sentry = null;
export function iniciarMonitoreo() {
  if (!DSN || sentry) return;
  sentry = import('@sentry/react').then((S) => {
    const replay = import.meta.env.VITE_SENTRY_REPLAY === 'true';
    S.init({
      dsn: DSN,
      environment: import.meta.env.VITE_SENTRY_ENTORNO ?? import.meta.env.MODE,
      sendDefaultPii: false,
      tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRAZAS ?? 0.1),
      // Repeticiones solo si se activan a propósito, y solo de sesiones con error.
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: replay ? 1 : 0,
      integrations: [
        S.browserTracingIntegration(),
        ...(replay ? [S.replayIntegration({ maskAllText: true, maskAllInputs: true, blockAllMedia: true })] : []),
      ],
      beforeSend: limpiarEvento,
      beforeSendTransaction: limpiarEvento,
    });
    return S;
  }).catch(() => null);
}

export function reportarError(error, contexto) {
  sentry?.then((S) => S?.captureException(error, contexto ? { extra: { componente: contexto } } : undefined));
}
