// Effets du Livre : étincelles, anneau, vibrations, cinématique d'ouverture de chapitre.
// Chaque élément créé est retiré à la fin de son animation (aucun reste dans le DOM).
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const center = r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

let layer = null;
function fxLayer() {
  if (layer && layer.isConnected) return layer;
  layer = document.createElement('div');
  layer.className = 'book-fx';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '60', overflow: 'hidden' });
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

export function buzz(pattern) {
  try {
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(pattern);
  } catch { /* vibration refusée */ }
}

export function burst(at, count = 18, spread = 90) {
  if (reduceMotion()) return;
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

export function ring(at, size) {
  if (reduceMotion()) return;
  const el = spawn({ width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '4px solid rgba(255, 214, 120, .95)', boxShadow: '0 0 24px rgba(255, 214, 120, .8)' });
  play(el, [
    { transform: `translate(${at.x - size / 2}px, ${at.y - size / 2}px) scale(.5)`, opacity: 1 },
    { transform: `translate(${at.x - size / 2}px, ${at.y - size / 2}px) scale(1.7)`, opacity: 0 }
  ], { duration: 700, easing: 'cubic-bezier(.2, .7, .3, 1)' });
}

// Sceau de cire en deux moitiés, pour la cinématique
function sealSrc(color, label, half) {
  const clip = half === 'left'
    ? '<clipPath id="h"><path d="M0 0h33l-4 18 6 14-5 14 4 18H0z"/></clipPath>'
    : '<clipPath id="h"><path d="M33 0h31v64H34l-4-18 5-14-6-14z"/></clipPath>';
  const bumps = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return `<circle cx="${(32 + Math.cos(a) * 25).toFixed(1)}" cy="${(32 + Math.sin(a) * 25).toFixed(1)}" r="5"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 64 64"><defs>${clip}</defs><g clip-path="url(#h)"><g fill="${color}" stroke="#3B2A20" stroke-width="2">${bumps}</g><circle cx="32" cy="32" r="25" fill="${color}"/><circle cx="32" cy="32" r="18" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/><text x="32" y="39" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${label.length > 2 ? 15 : 20}" fill="rgba(255,255,255,.85)">${label}</text><path d="M20 18a16 16 0 0 1 12-5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/></g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Ouverture d'un chapitre : le sceau tremble puis se brise ; se résout quand le joueur continue
export function unlockCinematic(chapter, wax) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'book-unlock';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', `Chapitre ${chapter.id} ouvert`);
    overlay.innerHTML = `<div class="book-unlock__rays"></div>
      <div class="book-unlock__seal"><img alt="" src="${sealSrc(wax, chapter.id, 'left')}"><img alt="" src="${sealSrc(wax, chapter.id, 'right')}"></div>
      <div class="book-unlock__eyebrow">Chapitre ${chapter.id} ouvert</div>
      <div class="book-unlock__name"></div>
      <button type="button" class="book-unlock__go">Ouvrir le chapitre</button>`;
    overlay.querySelector('.book-unlock__name').textContent = chapter.name;
    document.body.appendChild(overlay);
    const [left, right] = overlay.querySelectorAll('.book-unlock__seal img');
    const fast = reduceMotion() ? 0.01 : 1;
    const opts = (duration, delay = 0, easing = 'ease-out') => ({ duration: duration * fast, delay: delay * fast, easing, fill: 'forwards' });
    const anims = [
      overlay.animate([{ opacity: 0 }, { opacity: 1 }], opts(300)),
      overlay.querySelector('.book-unlock__rays').animate([{ opacity: 0 }, { opacity: 1 }], opts(600, 900)),
      ...[left, right].map(el => el.animate([{ transform: 'scale(2.2) rotate(-12deg)', opacity: 0 }, { transform: 'scale(1) rotate(0deg)', opacity: 1, offset: 0.6 }, { transform: 'scale(1.06)', offset: 0.8 }, { transform: 'scale(1)', opacity: 1 }], opts(600, 100, 'cubic-bezier(.3, 1.4, .5, 1)'))),
      ...[left, right].map(el => el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px) rotate(-3deg)' }, { transform: 'translateX(4px) rotate(3deg)' }, { transform: 'translateX(0)' }], { ...opts(260, 700), iterations: 2 })),
      left.animate([{ transform: 'translate(0, 0) rotate(0)', opacity: 1 }, { transform: 'translate(-70px, 60px) rotate(-35deg)', opacity: 0 }], opts(650, 1250, 'cubic-bezier(.5, 0, .7, .4)')),
      right.animate([{ transform: 'translate(0, 0) rotate(0)', opacity: 1 }, { transform: 'translate(70px, 50px) rotate(30deg)', opacity: 0 }], opts(650, 1250, 'cubic-bezier(.5, 0, .7, .4)')),
      overlay.querySelector('.book-unlock__eyebrow').animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], opts(400, 1350)),
      overlay.querySelector('.book-unlock__name').animate([{ opacity: 0, transform: 'translateY(14px) scale(.96)' }, { opacity: 1, transform: 'none' }], opts(500, 1450, 'cubic-bezier(.3, 1.3, .5, 1)')),
      overlay.querySelector('.book-unlock__go').animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], opts(400, 1700))
    ];
    const timer = setTimeout(() => {
      buzz([20, 60, 20, 60, 40]);
      const seal = overlay.querySelector('.book-unlock__seal').getBoundingClientRect();
      burst(center(seal), 26, 140);
      ring(center(seal), 160);
    }, 1250 * fast);
    overlay.querySelector('.book-unlock__go').addEventListener('click', () => {
      clearTimeout(timer);
      const out = overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250 * fast, fill: 'forwards' });
      out.onfinish = () => {
        anims.forEach(a => a.cancel());
        overlay.remove();
        resolve();
      };
    }, { once: true });
  });
}
