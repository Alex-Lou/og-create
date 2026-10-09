// Retours sensoriels partagés : vibrations, étincelles, anneau, comète vers un emplacement.
// Tout est décoratif : rien ne se passe si le navigateur ne sait pas faire ou si l'animation est réduite.
// Chaque élément créé est retiré à la fin de son animation (aucun reste dans le DOM).
import { glyphSrc } from './glyph';

export const reducedMotion = () => Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
export const center = r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

// Motifs de vibration (ms) : un toucher, une réussite, une découverte, un échec
export const HAPTIC = {
  tap: 8,
  success: [18, 40, 28],
  discovery: [24, 50, 24, 50, 70],
  fail: [45, 35, 45]
};

// Seulement après un geste du joueur (sinon le navigateur refuse et prévient dans la console)
export function vibrate(pattern) {
  try {
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(pattern);
  } catch {
    // Vibration refusée (iframe, réglages) : sans conséquence
  }
}

let layer = null;
function fxLayer() {
  if (layer && layer.isConnected) return layer;
  layer = document.createElement('div');
  layer.className = 'oc-fx';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '1100', overflow: 'hidden' });
  document.body.appendChild(layer);
  return layer;
}
function spawn(style) {
  const el = document.createElement('div');
  Object.assign(el.style, { position: 'absolute', left: '0', top: '0', willChange: 'transform, opacity' }, style);
  fxLayer().appendChild(el);
  return el;
}
function play(el, keyframes, options) {
  const animation = el.animate(keyframes, { fill: 'both', ...options });
  return new Promise(resolve => {
    animation.onfinish = () => { el.remove(); resolve(); };
    animation.oncancel = () => { el.remove(); resolve(); };
  });
}

// Gerbe d'étincelles dorées autour d'un point de l'écran
export function burst(at, count = 18, spread = 90) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const dist = spread * (0.55 + Math.random() * 0.6);
    const white = i % 3 === 0;
    const el = spawn({
      width: '9px', height: '9px', borderRadius: '50%',
      background: white ? 'radial-gradient(circle, #fff 30%, rgba(255,255,255,.2) 80%)' : 'radial-gradient(circle, #FFF7D6 20%, #F2B640 70%)'
    });
    const s = 0.6 + Math.random() * 0.9;
    play(el, [
      { transform: `translate(${at.x - 4}px, ${at.y - 4}px) scale(${s})`, opacity: 1 },
      { transform: `translate(${at.x - 4 + Math.cos(angle) * dist}px, ${at.y - 4 + Math.sin(angle) * dist + 20}px) scale(0)`, opacity: 0 }
    ], { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(.15, .7, .3, 1)' });
  }
}

// Anneau lumineux qui s'élargit autour d'un point
export function ring(at, size) {
  if (reducedMotion()) return;
  const el = spawn({ width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '4px solid rgba(255, 214, 120, .95)', boxShadow: '0 0 24px rgba(255, 214, 120, .8)' });
  play(el, [
    { transform: `translate(${at.x - size / 2}px, ${at.y - size / 2}px) scale(.5)`, opacity: 1 },
    { transform: `translate(${at.x - size / 2}px, ${at.y - size / 2}px) scale(1.7)`, opacity: 0 }
  ], { duration: 700, easing: 'cubic-bezier(.2, .7, .3, 1)' });
}

// Confettis : des papiers de couleur jaillissent d'un point, puis retombent lentement en tournoyant (la fête se voit)
const CONFETTI = ['#F2B640', '#E2574C', '#3FA7D6', '#59B36A', '#B86BD6', '#FFF3C4'];
export function confetti(at, count = 32) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const up = 70 + Math.random() * 90;
    const x = Math.cos(angle) * up * 1.3, y = Math.sin(angle) * up;
    const fall = 140 + Math.random() * 120;
    const turn = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540);
    const el = spawn({ width: `${6 + Math.random() * 4}px`, height: `${9 + Math.random() * 5}px`, borderRadius: '2px', background: CONFETTI[i % CONFETTI.length] });
    play(el, [
      { transform: `translate(${at.x}px, ${at.y}px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${at.x + x}px, ${at.y + y}px) rotate(${turn / 3}deg)`, opacity: 1, offset: 0.3 },
      { transform: `translate(${at.x + x * 1.25}px, ${at.y + y + fall}px) rotate(${turn}deg)`, opacity: 0 }
    ], { duration: 1700 + Math.random() * 700, easing: 'cubic-bezier(.2, .6, .4, 1)', delay: Math.random() * 120 });
  }
}

// Une bannière de fête au-dessus d'un point : un titre, une ligne (les écus), qui grandit, reste lisible, puis s'efface
// (BANNER_MS en tout). Montrée même en animation réduite : sans bouger, le temps de la lire
export const BANNER_MS = 2400;
// (au-dessus des comètes : les écus qui volent passent derrière elle)
export function banner(at, title, line = '') {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  document.body.appendChild(el);
  Object.assign(el.style, {
    position: 'fixed', zIndex: 'calc(var(--z-comet) + 1)', pointerEvents: 'none', willChange: 'transform, opacity',
    left: `${Math.round(at.x)}px`, top: `${Math.round(at.y)}px`, display: 'grid', justifyItems: 'center', gap: '2px',
    padding: '8px 16px 9px', borderRadius: '14px', border: '2px solid #C98D1E', whiteSpace: 'nowrap',
    background: 'linear-gradient(180deg, #FFF4CF, #F2C55A)', boxShadow: '0 4px 0 rgba(90, 58, 18, .45), 0 10px 24px rgba(0, 0, 0, .3)',
    color: '#4A2E0C', textAlign: 'center'
  });
  const big = document.createElement('strong');
  big.textContent = title;
  Object.assign(big.style, { fontFamily: 'var(--font-display)', fontSize: '22px', lineHeight: '1.1' });
  el.appendChild(big);
  if (line) {
    const small = document.createElement('span');
    small.textContent = line;
    Object.assign(small.style, { fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: '900', color: '#2F6B3A' });
    el.appendChild(small);
  }
  const still = reducedMotion();
  const at0 = 'translate(-50%, -100%)';
  return play(el, still
    ? [{ transform: at0, opacity: 1 }, { transform: at0, opacity: 1, offset: 0.85 }, { transform: at0, opacity: 0 }]
    : [
      { transform: `${at0} translateY(14px) scale(.4)`, opacity: 0 },
      { transform: `${at0} translateY(-4px) scale(1.12)`, opacity: 1, offset: 0.14 },
      { transform: `${at0} scale(1)`, opacity: 1, offset: 0.24 },
      { transform: `${at0} scale(1)`, opacity: 1, offset: 0.82 },
      { transform: `${at0} translateY(-18px) scale(.96)`, opacity: 0 }
    ], { duration: BANNER_MS, easing: 'ease-out' });
}

// Comète : le glyphe part d'un rectangle (la carte touchée) et file vers l'élément cible (duration : sa course, en ms)
export function fly(glyph, from, target, duration = 420) {
  if (!from || !target?.animate || reducedMotion()) return;
  const to = target.getBoundingClientRect();
  const ghost = document.createElement('div');
  ghost.className = 'oc-comet';
  const src = glyphSrc(glyph);
  if (src) {
    const img = document.createElement('img');
    Object.assign(img, { src, alt: '' });
    Object.assign(img.style, { width: '1em', height: '1em' });
    ghost.appendChild(img);
  } else {
    ghost.textContent = glyph;
  }
  Object.assign(ghost.style, { left: `${from.left + from.width / 2 - 20}px`, top: `${from.top + from.height / 2 - 20}px` });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.25)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.8)`, opacity: 0.2 }
    ],
    { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  ).onfinish = () => ghost.remove();
}
