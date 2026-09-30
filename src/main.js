import { createApp } from 'vue';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import 'mobile-drag-drop/default.css';
import './styles/tokens.css';
import './styles/base.css';
import App from './components/General/App.vue';

// Glisser-déposer au doigt (le drag HTML5 ne réagit pas au tactile sur la plupart des mobiles) :
// maintenir ~200 ms pour saisir un élément ; un tap sélectionne toujours, un geste rapide fait défiler.
polyfill({
  holdToDrag: 200,
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});
// iOS : un écouteur non passif permet au polyfill de bloquer le défilement pendant un drag
window.addEventListener('touchmove', () => {}, { passive: false });

const app = createApp(App);

// Configuration pour réduire les logs
if (process.env.NODE_ENV === 'production') {
  app.config.silent = true;
  app.config.errorHandler = null;
  app.config.warnHandler = null;
}

app.mount('#app');

// PWA : installable sur l'écran d'accueil, démarre hors ligne (production uniquement)
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

