// L'écran de démarrage (index.html, #splash) : visible dès les premiers octets de la page, il coche ses étapes au fil
// du chargement (le code du jeu, les polices, la partie du joueur), puis s'efface quand tout est là. Au bout de
// SPLASH_MAX_MS, il s'efface dès que la partie est revenue (sans attendre des polices lentes) ; sans elle, le Grimoire
// serait vide : il reste, dit que le serveur se réveille (le client HTTP réessaie seul), puis, si le serveur ne répond
// toujours pas, propose de réessayer (splashFailed).
const STEPS = ['code', 'fonts', 'carnet'];
const SPLASH_MAX_MS = 6000;
const done = new Set();
let late = false;
let gone = false;

// Une étape est faite : cochée, la barre avance ; toutes faites (ou la partie revenue, passé le délai), l'écran
// s'efface
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
  if (STEPS.every(name => done.has(name)) || (late && done.has('carnet'))) splashDone();
}

// L'écran s'efface (en fondu), puis quitte la page
export function splashDone() {
  const el = document.getElementById('splash');
  if (!el || gone) return;
  gone = true;
  el.classList.add('is-gone');
  setTimeout(() => el.remove(), 400);
}

// La partie n'a pas pu revenir : l'écran reste, le dit, et propose de recharger la page
export function splashFailed() {
  const el = document.getElementById('splash');
  if (el && !gone) el.classList.add('is-failed');
}

// SPLASH_MAX_MS après le début de la page : l'écran s'efface si la partie est revenue, sinon il dit que le serveur se
// réveille
export function splashDeadline() {
  setTimeout(() => {
    late = true;
    if (done.has('carnet')) splashDone();
    else document.getElementById('splash')?.classList.add('is-slow');
  }, Math.max(0, SPLASH_MAX_MS - performance.now()));
}
