import { createApp } from 'vue';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import 'mobile-drag-drop/default.css';
import './styles/index.css';
import App from './components/App/App/App.vue';
import { splashStep, splashDeadline } from './utils/splash';

// L'écran de démarrage (index.html) : il s'efface au plus tard 6 s après le début de la page ; le code est là
splashDeadline();

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
if (import.meta.env.PROD) {
  app.config.silent = true;
  app.config.errorHandler = null;
  app.config.warnHandler = null;
}

app.mount('#app');
splashStep('code');
// Les polices du jeu (Fraunces, Nunito) chargées : l'encre a séché
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => splashStep('fonts'), () => splashStep('fonts'));
else splashStep('fonts');

// PWA : installable sur l'écran d'accueil, démarre hors ligne (production uniquement)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

