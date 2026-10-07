// L'écran de démarrage (index.html, #splash) : visible dès les premiers octets de la page, il coche ses étapes au fil
// du chargement (le code du jeu, les polices, la partie du joueur), puis s'efface quand tout est là, ou au plus tard
// SPLASH_MAX_MS après le début de la page (rien ne reste bloqué derrière lui).
const STEPS = ['code', 'fonts', 'carnet'];
const SPLASH_MAX_MS = 6000;
const done = new Set();
let gone = false;

// Une étape est faite : cochée, la barre avance ; toutes faites, l'écran s'efface
export function splashStep(step) {
  const el = document.getElementById('splash');
  if (!el || gone || done.has(step)) return;
  done.add(step);
  const item = el.querySelector(`[data-step="${step}"]`);
  if (item) {
    item.classList.add('is-done');
    const mark = item.querySelector('b');
    if (mark) mark.textContent = '✓';
  }
  el.style.setProperty('--splash-p', `${Math.round(12 + (88 * done.size) / STEPS.length)}%`);
  if (STEPS.every(name => done.has(name))) splashDone();
}

// L'écran s'efface (en fondu), puis quitte la page
export function splashDone() {
  const el = document.getElementById('splash');
  if (!el || gone) return;
  gone = true;
  el.classList.add('is-gone');
  setTimeout(() => el.remove(), 400);
}

// Au plus tard SPLASH_MAX_MS après le début de la page
export function splashDeadline() {
  setTimeout(splashDone, Math.max(0, SPLASH_MAX_MS - performance.now()));
}
