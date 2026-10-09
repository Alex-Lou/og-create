// L'écran de démarrage (index.html, #splash) : visible dès les premiers octets de la page, il coche ses étapes au fil
// du chargement (le code du jeu, les polices, la partie du joueur), puis s'efface quand tout est là, mais jamais avant
// SPLASH_MIN_MS (le temps de le voir : 2,5 s depuis le début de la page). Au bout de SPLASH_MAX_MS, il s'efface dès que
// la partie est revenue (sans attendre des polices lentes) ; sans elle, le Grimoire serait vide : il reste, dit que le
// serveur se réveille (le client HTTP réessaie seul), puis, si le serveur ne répond toujours pas, propose de réessayer
// (splashFailed). Ce qui doit se jouer à l'écran (les scènes du tutoriel) attend qu'il parte : whenSplashGone().
// Un seul écran de chargement : pour un compte, qui arrive sur son île, il attend aussi l'île (splashExpect('ile')),
// et l'île ne montre pas de second écran derrière lui.
export const STEPS = ['code', 'fonts', 'carnet'];
export const SPLASH_MIN_MS = 2500;
export const SPLASH_MAX_MS = 6000;
// Le fondu de sortie : l'écran se dissout (0,8 s, le contenu s'étire et floute), puis un rideau noir tient un silence
// (HOLD_MS), avant de s'effacer lentement (REVEAL_MS) pour révéler la scène. Un vrai fondu au noir, garanti.
const FADE_MS = 700;
const HOLD_MS = 380;
const REVEAL_MS = 900;

const done = new Set();
const required = new Set(STEPS);
let late = false;
let gone = false;
let ready = false;
let release = null;
const goneSignal = new Promise(resolve => { release = resolve; });

const splashEl = () => (typeof document === 'undefined' ? null : document.getElementById('splash'));
const elapsed = () => (typeof performance === 'undefined' ? Infinity : performance.now());

// Une étape de plus à attendre (sa pastille, cachée dans index.html, paraît) : 'ile', l'île d'un compte
export function splashExpect(step) {
  const el = splashEl();
  if (!el || gone || required.has(step)) return;
  required.add(step);
  const item = el.querySelector(`[data-step="${step}"]`);
  if (item) item.hidden = false;
}

// Passé SPLASH_MAX_MS, l'écran n'attend plus que la partie, et l'île si elle est attendue (App la déclare prête au plus
// tard ISLAND_MAX_MS après son départ) : les polices lentes ne le retiennent plus
const essentialsDone = () => done.has('carnet') && (!required.has('ile') || done.has('ile'));

// Une étape est faite : cochée, la barre avance ; toutes faites (ou l'essentiel, passé le délai), l'écran s'efface
export function splashStep(step) {
  const el = splashEl();
  if (!el || gone || done.has(step)) return;
  done.add(step);
  const item = el.querySelector(`[data-step="${step}"]`);
  if (item) {
    item.classList.add('is-done');
    const mark = item.querySelector('b');
    if (mark) mark.textContent = '✓';
  }
  el.style.setProperty('--splash-p', `${Math.round(12 + (88 * [...required].filter(name => done.has(name)).length) / required.size)}%`);
  if ([...required].every(name => done.has(name)) || (late && essentialsDone())) splashReady();
}

// Tout est chargé (et SPLASH_MIN_MS passé) : l'écran cède la main — il montre « Entrée », et c'est le joueur qui
// décide d'entrer (le fondu ne vient qu'à son toucher). Tant qu'il n'entre pas, rien ne se joue.
function splashReady() {
  const el = splashEl();
  if (!el || ready || gone) return;
  const wait = SPLASH_MIN_MS - elapsed();
  if (wait > 0) {
    setTimeout(splashReady, wait);
    return;
  }
  ready = true;
  el.classList.add('is-ready');
}

// L'écran s'efface (en fondu), puis quitte la page : au toucher d'« Entrée »
export function splashDone() {
  const el = splashEl();
  if (!el) {
    release();
    return;
  }
  if (gone || !ready) return;
  gone = true;
  el.classList.remove('is-ready');
  el.classList.add('is-gone');
  // Le rideau noir paraît sous l'écran qui se dissout ; la scène se monte dessous, cachée
  const curtain = document.getElementById('splash-curtain');
  if (curtain) curtain.classList.add('is-on');
  release();
  setTimeout(() => {
    el.remove();
    if (curtain) curtain.classList.add('is-out');
  }, FADE_MS + HOLD_MS);
  setTimeout(() => {
    if (curtain) curtain.remove();
  }, FADE_MS + HOLD_MS + REVEAL_MS + 120);
}

// L'écran est parti (ou n'a jamais été là) : la promesse se tient dès le début de son fondu
export function whenSplashGone() {
  if (!splashEl()) release();
  return goneSignal;
}

// La partie n'a pas pu revenir : l'écran reste, le dit, et propose de recharger la page
export function splashFailed() {
  const el = splashEl();
  if (el && !gone) el.classList.add('is-failed');
}

// SPLASH_MAX_MS après le début de la page : l'écran s'efface si la partie est revenue, sinon il dit que le serveur se
// réveille
export function splashDeadline() {
  setTimeout(() => {
    late = true;
    if (essentialsDone()) splashReady();
    else if (!done.has('carnet')) splashEl()?.classList.add('is-slow');
  }, Math.max(0, SPLASH_MAX_MS - elapsed()));
}

// « Entrée » : le joueur décide d'entrer (l'écran s'efface alors en fondu)
document.getElementById('splash-enter')?.addEventListener('click', splashDone);
