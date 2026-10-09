// Les erreurs du jeu en production vont au journal de l'API (serveur : routes/clientErrors.js) : le build retire la
// console, sans cela une erreur chez un joueur ne laissait aucune trace. Envoyé : le genre, le message, la source, la
// pile, le contexte Vue, l'écran (mode) et la version ; jamais le compte ni la partie (le serveur retire aussi adresses
// e-mail et paramètres d'adresse web). Au plus MAX_PER_PAGE rapports par page, chacun une seule fois.
import http from '@/services/http';

export const MAX_PER_PAGE = 5;
const sent = new Set();
let mode = null;

// L'écran affiché (App : currentMode), joint aux rapports
export function setErrorMode(value) {
  mode = value || null;
}

// Ce qui ne se signale pas : les réponses et coupures réseau (le serveur a son journal ; hors ligne, ce n'est pas un
// bogue), les requêtes annulées, la boucle bénigne de ResizeObserver, les scripts d'une autre origine (extensions)
export function worthReporting({ message, source, error }) {
  if (error && (error.isAxiosError || error.name === 'CanceledError' || error.code === 'ERR_CANCELED')) return false;
  if (!message || /ResizeObserver loop/.test(message)) return false;
  const origin = globalThis.location?.origin;
  if (source && origin && /^[a-z][a-z0-9+.-]*:/i.test(source) && !source.startsWith(origin)) return false;
  return true;
}

export function reportError({ kind, message, source, stack, info, error }) {
  if (!worthReporting({ message, source, error }) || sent.size >= MAX_PER_PAGE) return false;
  const key = `${kind}|${message}|${source || ''}`;
  if (sent.has(key)) return false;
  sent.add(key);
  http.post('/client-errors', { kind, message, source, stack, info, mode, version: import.meta.env.VITE_APP_VERSION })
    .catch(() => {});
  return true;
}

const describe = error => (error instanceof Error ? error.message : typeof error === 'string' ? error : String(error ?? ''));

// Branche le gestionnaire d'erreurs de Vue et ceux de la page (erreurs, promesses rejetées sans traitement)
export function installErrorReport(app) {
  app.config.errorHandler = (error, _instance, info) => {
    reportError({ kind: 'vue', message: describe(error), stack: error?.stack, info, error });
  };
  window.addEventListener('error', event => {
    reportError({ kind: 'error', message: event.message || describe(event.error), source: event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : undefined, stack: event.error?.stack, error: event.error });
  });
  window.addEventListener('unhandledrejection', event => {
    reportError({ kind: 'rejection', message: describe(event.reason), stack: event.reason?.stack, error: event.reason });
  });
}

// (tests)
export function resetErrorReport() {
  sent.clear();
  mode = null;
}
