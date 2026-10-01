// Retours sensoriels partagés par les modes : vibration, comète vers un emplacement, gerbe d'étincelles.
// Tout est décoratif : rien ne se passe si le navigateur ne sait pas faire ou si l'animation est réduite.

import { glyphSrc } from './glyph';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Motifs de vibration (ms) : un toucher, une réussite, une découverte, un échec
export const HAPTIC = {
  tap: 8,
  success: [18, 40, 28],
  discovery: [24, 50, 24, 50, 70],
  fail: [45, 35, 45]
};

export function vibrate(pattern) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Vibration refusée (iframe, réglages) : sans conséquence
  }
}

// Comète : le glyphe part d'un rectangle (la carte cliquée) et file vers l'élément cible
export function fly(glyph, from, target) {
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
    { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  ).onfinish = () => ghost.remove();
}

// Gerbe d'étincelles au premier plan (au-dessus des fenêtres), centrée sur un élément ou un point
export function burst(origin, { count = 18, spread = 130, tone = 'gold' } = {}) {
  if (!origin || reducedMotion()) return;
  const box = origin.getBoundingClientRect ? origin.getBoundingClientRect() : { left: origin.x, top: origin.y, width: 0, height: 0 };
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const layer = document.createElement('div');
  layer.className = `oc-burst oc-burst--${tone}`;
  Object.assign(layer.style, { left: `${x}px`, top: `${y}px` });

  const ring = document.createElement('span');
  ring.className = 'oc-burst__ring';
  layer.appendChild(ring);
  ring.animate([{ transform: 'scale(.2)', opacity: 0.9 }, { transform: 'scale(1)', opacity: 0 }], { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('span');
    spark.className = 'oc-burst__spark';
    layer.appendChild(spark);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const distance = spread * (0.45 + Math.random() * 0.55);
    spark.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 18}px) scale(.2)`, opacity: 0 }
      ],
      { duration: 650 + Math.random() * 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1200);
}
