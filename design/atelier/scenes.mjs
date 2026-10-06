// Lot J — les scènes de l'histoire, au trait de la troupe : les images plein écran du tutoriel, des veillées, d'Anya et
// de la finale (les mêmes que src/components/Game/PrologueArt.vue, même cadre 400 × 400, même mise en place). Chaque
// scène est un seul SVG qui s'anime tout seul (CSS dans le SVG : flammes, Brume qui flotte, clignements, étoiles,
// brume qui dérive) ; sans animation (mouvement réduit), il montre l'image clé. Le cadre se recadre sur l'écran
// (« slice ») : l'essentiel tient dans le milieu, x de 108 à 292 (téléphone en hauteur) et y de 88 à 312 (écran large).
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const T = require('./troupe');
const { OUT, P, E, L, limb, clip, frame, r2 } = T;
const { CAST } = require('./naufrages');
const { brumeFrame } = require('./brume');
const { cord } = require('./naufrage');
const { cannelleScene, rivetScene } = require('./arrivees');
const { seated, POSES: SEAT, jar, rod, boulder } = require('./dormeurs');

const KEYS = ['aster', 'cannelle', 'rivet', 'ondin', 'sylve', 'galet', 'melisse'];
// les maîtres : base (tenue de maître) et nau (tenue de naufragé)
const M = Object.fromEntries(KEYS.map((k, i) => [k, CAST[i]]));
const f1 = n => Math.round(n * 10) / 10;

/* ---------- outils ---------- */
// Identifiants préfixés : une scène réunit plusieurs images du kit (chacune a ses découpes)
let seq = 0;
const scope = body => { const t = `z${(seq++).toString(36)}`; return body.replace(/id="([^"]+)"/g, `id="${t}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${t}$1)`).replace(/href="#([^"]+)"/g, `href="#${t}$1"`); };
// Une image du kit (repère 48 × 64, pieds en 24, 62) posée pieds en (x, y), à l'échelle k, en miroir si flip
const put = (body, x, y, k, flip = false, extra = '') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${flip ? -k : k} ${k}) translate(-24 -62)"${extra}>${scope(body)}</g>`;
// Brume (repère 40 × 48, bas de la flamme en 20, 32) posée en (x, y)
const putB = (body, x, y, k) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k}) translate(-20 -32)">${scope(body)}</g>`;
const g = (cls, body, extra = '') => `<g class="${cls}"${extra}>${body}</g>`;
const at = (x, y, body, k = 1) => `<g transform="translate(${f1(x)} ${f1(y)})${k !== 1 ? ` scale(${k})` : ''}">${body}</g>`;
const ln = (pts, color, w, extra = '') => `<path d="${pts}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const S = 2.4; // trait du décor au premier plan (les personnages, à l'échelle 3, ont un trait de 3,3)
const path = (d, fill, w = S, line = OUT, extra = '') => `<path d="${d}" fill="${fill}"${w ? ` stroke="${line}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"` : ''}${extra}/>`;
const ell = (cx, cy, rx, ry, fill, w = S, line = OUT, extra = '') => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}"${w ? ` stroke="${line}" stroke-width="${w}"` : ''}${extra}/>`;
const cut = (id, d, inner) => `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;

// Images empilées qui défilent (CSS) : sans animation, on ne voit que la première
function cycle(frames, ms, cls = 'sc-cy') {
  const n = frames.length, dur = n * ms;
  // les suivantes sont cachées (l'animation les montre chacune à son tour)
  return frames.map((f, i) => `<g class="${cls}"${i ? ' opacity="0"' : ''} style="animation-duration:${dur}ms;animation-delay:-${((n - i) % n) * ms}ms;--n:${n}">${f}</g>`).join('');
}
// Un personnage qui cligne : l'image yeux ouverts, et par-dessus l'image yeux fermés, cachée sauf un instant
const blinker = (open, shut, delay = 0) => open + `<g class="sc-blink" opacity="0" style="animation-delay:${delay}ms">${shut}</g>`;
// Un maître au repos posé dans la scène, qui cligne de temps en temps (chacun à son moment)
const stand = (c, view, x, y, k, flip, expr, tint, delay = 0) => lit(tint, blinker(put(frame(c, view, 'repos', 0, expr), x, y, k, flip), put(frame(c, view, 'repos', 1), x, y, k, flip), delay));

/* ---------- lumières ---------- */
// Teintes posées sur les personnages selon la lumière de la scène (multiplication douce par une matrice de couleur)
const TINTS = {
  nuit: '0.78 0 0 0 0.02 0 0.82 0 0 0.03 0 0 0.94 0 0.08 0 0 0 1 0',
  feu: '1 0 0 0 0.03 0 0.9 0 0 0.01 0 0 0.76 0 0 0 0 0 1 0',
  tempete: '0.56 0 0 0 0 0 0.6 0 0 0.02 0 0 0.74 0 0.08 0 0 0 1 0',
  aube: '1 0 0 0 0.02 0 0.94 0 0 0.01 0 0 0.9 0 0.03 0 0 0 1 0',
  petitjour: '0.9 0 0 0 0.02 0 0.92 0 0 0.03 0 0 0.98 0 0.05 0 0 0 1 0'
};
const tintDefs = () => Object.entries(TINTS).map(([k, m]) => `<filter id="sc-${k}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`).join('');
const lit = (tint, body) => `<g filter="url(#sc-${tint})">${body}</g>`;

/* ---------- l'animation (CSS dans le SVG, noms en sc-) ---------- */
const CSS = `
.sc-cy{animation-iteration-count:infinite;animation-timing-function:step-end}
.sc-blink{animation:sc-blink 4.6s step-end infinite}
@keyframes sc-blink{0%{opacity:0}93%{opacity:1}97%{opacity:0}}
.sc-float{animation:sc-float 4s ease-in-out infinite}
@keyframes sc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.sc-twinkle{animation:sc-twinkle 4s ease-in-out infinite}
@keyframes sc-twinkle{0%,100%{opacity:1}50%{opacity:.35}}
.sc-drift{animation:sc-drift 14s ease-in-out infinite alternate}
@keyframes sc-drift{from{transform:translateX(-14px)}to{transform:translateX(14px)}}
.sc-glow{animation:sc-glow 1.6s ease-in-out infinite}
@keyframes sc-glow{0%,100%{opacity:.8}50%{opacity:1}}
.sc-foam{animation:sc-foam 3s ease-in-out infinite}
@keyframes sc-foam{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
.sc-shiver{animation:sc-shiver .2s linear infinite}
@keyframes sc-shiver{0%,100%{transform:translateX(0)}50%{transform:translateX(1.4px)}}
.sc-rain{animation:sc-rain .5s linear infinite}
@keyframes sc-rain{from{transform:translate(0,0)}to{transform:translate(-8px,26px)}}
.sc-bolt{animation:sc-bolt 3.2s linear infinite}
@keyframes sc-bolt{0%,8%,14%,100%{opacity:0}9%,12%{opacity:1}}
.sc-roll{animation:sc-roll 3s ease-in-out infinite}
@keyframes sc-roll{0%,100%{transform:rotate(-4deg)}50%{transform:translateY(4px) rotate(5deg)}}
.sc-wave{animation:sc-wave 6.2s cubic-bezier(.5,0,.3,1) forwards}
@keyframes sc-wave{0%{transform:translateY(260px)}70%{transform:translateY(40px)}100%{transform:translateY(-40px)}}
.sc-dark{opacity:0;animation:sc-dark 1s ease-in 6s forwards}
@keyframes sc-dark{to{opacity:1}}
@media (prefers-reduced-motion:reduce){.sc-cy,.sc-blink,.sc-float,.sc-twinkle,.sc-drift,.sc-glow,.sc-foam,.sc-shiver,.sc-rain,.sc-bolt,.sc-roll,.sc-wave,.sc-dark{animation:none}}`;
// Le cycle d'images : chaque image visible 1/n du temps (n = 2, 3, 4, 6, 8), un rien plus pour ne jamais laisser de trou
const cycleCss = [2, 3, 4, 6, 8].map(n => `.sc-cy[style*="--n:${n}"]{animation-name:sc-cy${n}}@keyframes sc-cy${n}{0%{opacity:1}${r2(100 / n + 0.4)}%{opacity:0}100%{opacity:0}}`).join('');

/* ---------- le ciel, la mer, la plage ---------- */
const SKIES = {
  nuit: ['#16224A', '#283A6C', '#43558C'],
  tempete: ['#080D1C', '#141F38', '#1E2C4A'],
  petitjour: ['#22345E', '#4A6090', '#8C9CC0'],
  horizon: ['#22345E', '#86709A', '#F0AE80'],
  aube: ['#2E4270', '#C08A7A', '#F8D890']
};
// (h : où le dégradé finit, l'horizon de la scène : le clair du ciel est juste au-dessus de la mer)
function sky(kind, h = 400) {
  const [a, b, c] = SKIES[kind];
  return `<linearGradient id="sc-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${h}"><stop offset="0" stop-color="${a}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`
    + '<rect width="400" height="400" fill="url(#sc-sky)"/>';
}
// Étoiles : petites étoiles à quatre branches et points, qui scintillent chacune à son rythme
const STARS = [[40, 40, 3.4], [92, 70, 2], [150, 30, 4], [210, 58, 1.6], [356, 140, 2.4], [300, 26, 3], [120, 120, 1.6], [380, 40, 3.2], [20, 150, 2.2], [178, 96, 1.4], [330, 92, 1.8], [64, 104, 1.4]];
const star4 = (x, y, s, fill) => `<path d="M${f1(x)},${f1(y - s)} Q${f1(x + s * 0.2)},${f1(y - s * 0.2)} ${f1(x + s)},${f1(y)} Q${f1(x + s * 0.2)},${f1(y + s * 0.2)} ${f1(x)},${f1(y + s)} Q${f1(x - s * 0.2)},${f1(y + s * 0.2)} ${f1(x - s)},${f1(y)} Q${f1(x - s * 0.2)},${f1(y - s * 0.2)} ${f1(x)},${f1(y - s)} Z" fill="${fill}"/>`;
function stars(list = STARS, fill = '#F2F4FF') {
  return list.map(([x, y, s], k) => g('sc-twinkle', s > 2.6 ? star4(x, y, s, fill) : `<circle cx="${x}" cy="${y}" r="${f1(s * 0.5)}" fill="${fill}"/>`, ` style="animation-delay:-${f1(k * 0.7)}s"`)).join('');
}
// La lune : disque clair cerné, un croissant d'ombre, deux cratères, un halo
function moon(x, y, r) {
  return `<radialGradient id="sc-moonhalo"><stop offset="0" stop-color="#DCE8FF" stop-opacity=".45"/><stop offset="1" stop-color="#DCE8FF" stop-opacity="0"/></radialGradient>`
    + `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="url(#sc-moonhalo)"/>`
    + ell(x, y, r, r, '#F4F1E2', 2, '#8A94B4')
    + cut('sc-moon', `M${x - r},${y} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0`, ell(x + r * 0.5, y + r * 0.35, r * 0.85, r * 0.95, '#DCD8C6', 0))
    + ell(x - r * 0.35, y - r * 0.2, r * 0.2, r * 0.16, '#E2DECC', 0) + ell(x + r * 0.15, y + r * 0.45, r * 0.13, r * 0.1, '#D2CEBC', 0);
}
// Une ligne de vagues (pour la mer et l'écume)
const waveD = (y, amp, len, off = 0, x0 = -20, x1 = 420) => {
  let d = `M${x0},${y}`;
  for (let x = x0; x < x1; x += len) d += ` Q${f1(x + len / 4 + off)},${f1(y - amp)} ${f1(x + len / 2)},${y} Q${f1(x + len * 0.75 + off)},${f1(y + amp)} ${f1(x + len)},${y}`;
  return d;
};
// La mer de nuit, de l'horizon (y0) à y1, avec ses lignes de houle
function sea(y0, y1 = 400, c = ['#2B4A7A', '#1A3157'], line = '#5E80B4') {
  return `<linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`
    + `<rect x="0" y="${y0}" width="400" height="${y1 - y0}" fill="url(#sc-sea)"/>`
    + ln(`M0,${y0} H400`, '#7E9CCB', 1.6, ' opacity=".7"')
    + g('sc-foam', [0.22, 0.5, 0.82].map((t, k) => ln(waveD(f1(y0 + (y1 - y0) * t), 1.6 + k, 26 + k * 10, 0), line, 1.4 + k * 0.3, ' opacity=".55"')).join(''));
}
// La plage de nuit : le sable monte de y (bord de l'eau), un liseré d'écume, quelques coquillages et cailloux
function sand(y, c = ['#8A7C68', '#5C5244'], wet = '#6E6656') {
  const top = `M0,${y + 6} Q90,${y - 4} 170,${y + 6} T400,${y}`;
  return `<linearGradient id="sc-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`
    + path(`${top} V400 H0 Z`, wet, 0)
    + path(`M0,${y + 14} Q90,${y + 4} 170,${y + 14} T400,${y + 8} V400 H0 Z`, 'url(#sc-sand)', 0)
    + g('sc-foam', ln(`M0,${y + 6} Q90,${y - 4} 170,${y + 6} T400,${y}`, '#DCE6F4', 2.4, ' opacity=".8"'))
    + [[60, y + 60, 4, 2.4], [312, y + 48, 3.4, 2], [372, y + 92, 5, 3], [30, y + 104, 3, 2]].map(([x, yy, rx, ry]) => ell(x, yy, rx, ry, '#9A9286', 1.4, '#4A4036')).join('')
    + `<path d="M232,${y + 72} q4,-6 8,0 q-4,2 -8,0 Z" fill="#D8C8B0" stroke="#4A4036" stroke-width="1.2"/>`;
}
// La brume : nappes claires qui dérivent (devant tout) ; thin : quand le feu la fait reculer
const MIST = [[80, 250, 140, 18], [300, 262, 160, 20], [190, 300, 200, 24], [60, 330, 130, 16], [330, 346, 150, 18]];
// (nappes au bord fondu : un dégradé radial étiré sur chaque ellipse)
const mist = (o = 0.17, list = MIST) => `<radialGradient id="sc-mist"><stop offset="0" stop-color="#D6E2F2" stop-opacity="${o * 1.6}"/><stop offset=".6" stop-color="#D6E2F2" stop-opacity="${o}"/><stop offset="1" stop-color="#D6E2F2" stop-opacity="0"/></radialGradient>`
  + list.map(([x, y, rx, ry], k) => g('sc-drift', ell(x, y, rx * 1.15, ry * 1.6, 'url(#sc-mist)', 0), ` style="animation-delay:-${f1(k * 2.6)}s"`)).join('');

/* ---------- objets de scène ---------- */
// Bois flotté, caisse, pierre : le trait de la troupe à l'échelle de la scène
const WOOD = { side: '#9A6A3E', light: '#B8875A', dark: '#6E4A2A', end: '#D2A878', ring: '#8A5E36' };
function log(a, b, w, c = WOOD) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
  return `<g transform="translate(${f1(a[0])} ${f1(a[1])}) rotate(${f1(ang)})">`
    + path(`M0,${f1(-w / 2)} H${f1(len)} V${f1(w / 2)} H0 Z`, c.side)
    + ln(`M4,${f1(-w * 0.12)} H${f1(len * 0.6)} M${f1(len * 0.3)},${f1(w * 0.2)} H${f1(len - 6)}`, c.dark, 1.2, ' opacity=".7"')
    + ell(len, 0, w * 0.32, w / 2, c.end) + ell(len, 0, w * 0.14, w * 0.22, 'none', 1.1, c.ring) + '</g>';
}
function crate(x, y, w, h, rot = 0, id = 'cr') {
  const d = `M${x},${y} h${w} v${h} h${-w} Z`;
  return `<g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">` + path(d, '#A8743F')
    + cut(`sc-${id}`, d, `<rect x="${x}" y="${f1(y + h * 0.7)}" width="${w}" height="${f1(h * 0.3)}" fill="#8A5A30"/>`
      + ln(`M${x},${f1(y + h / 3)} h${w} M${x},${f1(y + h * 2 / 3)} h${w}`, OUT, 1.2, ' opacity=".55"'))
    + path(`M${x + 3},${y + 3} L${x + w - 3},${y + h - 3}`, 'none', 3.4, OUT) + ln(`M${x + 3},${y + 3} L${x + w - 3},${y + h - 3}`, '#C29060', 1.6)
    + path(d, 'none') + '</g>';
}
function rock(d, fill = '#4A4852', shade = '#36343E', hi = '#5E5C68', id = 'rk', cracks = '') {
  // le rocher : sa couleur, l'ombre décalée en bas à droite, un reflet de lune en haut à gauche, quelques fissures
  return path(d, fill) + cut(`sc-${id}`, d, `<path d="${d}" fill="${shade}" transform="translate(16 12)"/>` + `<path d="${d}" fill="${fill}" transform="translate(6 6)"/>`
    + `<path d="${d}" fill="${hi}" transform="translate(-12 -14)" opacity=".55"/>` + `<path d="${d}" fill="${fill}" transform="translate(-4 -2)"/>`
    + (cracks ? ln(cracks, OUT, 1.6, ' opacity=".55"') : '')) + path(d, 'none');
}

// Le feu de camp : pierres en cercle, bûches croisées, flammes (3 images), halo ; posé au sol en (x, y), échelle k
function flame(n, k = 1) {
  const sw = [0, 3, -3][n], h = [1, 1.08, 0.95][n];
  const tip = (x, y, w, hh, s) => `M${x},0 C${f1(x - w)},${f1(-hh * 0.2)} ${f1(x - w * 0.8)},${f1(-hh * 0.62)} ${f1(x + s)},${f1(-hh)} C${f1(x + w * 0.8)},${f1(-hh * 0.62)} ${f1(x + w)},${f1(-hh * 0.2)} ${x},0 Z`;
  return path(tip(0, 0, 22, 62 * h, sw), '#F28C28', 2.2, '#A8401A')
    + path(tip(-13, 0, 10, 34 * h, sw * 0.6 - 4), '#F25C28', 1.8, '#A8401A')
    + path(tip(13, 0, 9, 30 * h, sw * 0.6 + 4), '#F25C28', 1.8, '#A8401A')
    + path(tip(0, 0, 13, 40 * h, sw * 0.7), '#FFC94A', 0)
    + path(tip(0, 0, 6, 20 * h, sw * 0.4), '#FFF4C2', 0);
}
function campfire(x, y, k = 1, { glow = 120, out = false } = {}) {
  let s = `<radialGradient id="sc-fireglow"><stop offset="0" stop-color="#FFBE64" stop-opacity=".55"/><stop offset="1" stop-color="#FF963C" stop-opacity="0"/></radialGradient>`;
  s += glow ? g('sc-glow', `<circle cx="${x}" cy="${y - 20 * k}" r="${glow}" fill="url(#sc-fireglow)"/>`) : '';
  let o = '';
  // pierres de l'âtre, celles du fond d'abord
  const ring = [[-34, -4, 9, 6], [-18, -9, 8, 5], [0, -10, 8, 5], [18, -9, 8, 5], [34, -4, 9, 6]];
  o += ring.map(([dx, dy, rx, ry]) => ell(dx, dy, rx, ry, '#8E8A84', 2, OUT) + ell(dx - rx * 0.3, dy - ry * 0.35, rx * 0.4, ry * 0.3, '#ACA8A0', 0)).join('');
  o += log([-30, 4], [26, -8], 10) + log([30, 4], [-24, -8], 10, { ...WOOD, side: '#8A5C34' });
  o += out ? '' : g('sc-flames', cycle([0, 1, 2].map(n => flame(n)), 150), ' transform="translate(0 -4)"');
  o += [[-38, 6, 10, 6.5], [-14, 9, 9, 6], [12, 9, 9, 6], [38, 6, 10, 6.5]].map(([dx, dy, rx, ry]) => ell(dx, dy, rx, ry, '#9A968E', 2, OUT) + ell(dx - rx * 0.3, dy - ry * 0.35, rx * 0.4, ry * 0.3, '#B8B4AC', 0)).join('');
  // braises
  o += out ? '' : [[-6, 2], [5, 4], [16, 1]].map(([dx, dy]) => ell(dx, dy, 3, 1.8, '#FFB347', 0)).join('');
  return s + at(x, y, o, k);
}

// Brume dans la scène : 4 images de flottement (flamme qui vacille), qui monte et descend
function brume(x, y, k, { stage = 's1', expr = 'neutre', still = false } = {}) {
  const frames = [0, 1, 2, 3].map(n => putB(brumeFrame(stage, n, expr), x, y, k));
  return g(still ? '' : 'sc-float', cycle(frames, 260));
}

/* ---------- les scènes ---------- */
const SC = {};

// 1a — L'Hirondelle dans la tempête : quatre silhouettes sur le pont, une vague, le noir
SC.storm = {
  label: 'L\'Hirondelle dans la tempête', step: 'T1', thought: false,
  draw() {
    let s = sky('tempete');
    // nuages d'orage : grosses masses cernées
    const CL = 'M-60,10 Q-66,-8 -46,-12 Q-44,-30 -22,-28 Q-12,-44 10,-36 Q28,-46 40,-28 Q62,-30 62,-10 Q74,0 62,12 Z';
    let nc = 0;
    // un bord clair en haut (la lune derrière), le ventre plus sombre
    const cloud = (x, y, k, fill) => at(x, y, path(CL, fill, 0) + cut(`sc-cl${nc++}`, CL, `<path d="${CL}" fill="#34426A" transform="translate(-3 -5)"/><path d="${CL}" fill="${fill}" transform="translate(2 3)"/><rect x="-80" y="2" width="160" height="20" fill="#121A30" opacity=".55"/>`) + path(CL, 'none', 2.4, '#060A14'), k);
    s += cloud(80, 46, 1.4, '#1C2742') + cloud(300, 30, 1.6, '#202C4A') + cloud(200, 80, 1.1, '#26324F');
    s += g('sc-bolt', path('M336,52 L318,112 L334,108 L314,168 L348,98 L332,102 L346,52 Z', '#FFF6C8', 2, '#F2C64E'));
    s += sea(250, 400, ['#1E3456', '#0E1A30'], '#3E5E8E');
    // l'Hirondelle, qui roule : coque, bordé, mât, voile déchirée, le nom peint ; l'équipage agrippé au plat-bord
    const crew = ['aster', 'cannelle', 'rivet', 'ondin'].map((k, i) => put(frame(M[k].base, 'front', 'repos', 0, i === 3 ? 'triste' : 'surpris'), -48 + i * 32, 7, 0.92)).join('');
    let ship = '';
    ship += limb([-4, -2], [-4, -150], 7, '#7A5232').replace(/stroke-width="([\d.]+)"/, (m, w) => `stroke-width="${w}"`);
    ship += path('M0,-142 Q58,-112 40,-40 L2,-36 Z', '#E6DCC3', 2.4) + path('M18,-118 Q34,-92 26,-60 L36,-68 Q40,-96 18,-118 Z', '#C9BB98', 0)
      + path('M-8,-134 Q-48,-114 -54,-64 L-34,-72 L-40,-50 L-8,-46 Z', '#D8CCB0', 2.4)
      + ln('M2,-36 L40,-40 M-8,-46 L-40,-50', OUT, 1.4) + ln('M-4,-150 L84,-6 M-4,-150 L-96,-4', '#3C2819', 1.2, ' opacity=".8"');
    ship += lit('tempete', crew);
    const hull = 'M-104,-4 L104,-4 Q96,18 76,36 L-80,36 Q-98,18 -104,-4 Z';
    ship += path(hull, '#7A5232', 2.6) + cut('sc-hull', hull, `<rect x="-110" y="18" width="220" height="20" fill="#5E3E24"/>` + ln('M-104,6 H104 M-100,16 H100 M-92,26 H92', '#4A2E18', 1.4))
      + path(hull, 'none', 2.6) + path('M-108,-8 H108 V-1 H-108 Z', '#A8743F', 2.4)
      + `<text x="44" y="22" font-size="11" fill="#F2D27A" font-family="Georgia, serif" font-style="italic" text-anchor="middle">l’Hirondelle</text>`;
    s += at(200, 246, g('sc-roll', ship));
    s += g('sc-rain', Array.from({ length: 30 }, (_, k) => ln(`M${(k * 37) % 440 - 20},${(k * 53) % 320 - 20} l-10,26`, 'rgba(190,210,240,.45)', 1.6)).join(''));
    // la vague qui monte et avale tout : crête d'écume cernée, rouleaux
    const wave = 'M-20,480 L-20,262 Q40,122 150,152 Q230,174 250,122 Q262,94 300,102 Q270,122 284,152 Q320,212 420,232 L420,480 Z';
    s += g('sc-wave', path(wave, '#1C3254', 2.6, '#0A1424') + cut('sc-wave', wave, ln('M-20,300 Q60,200 170,230 Q250,250 300,200 Q340,250 420,270', '#2E4C78', 10, ' opacity=".7"'))
      + ln('M-14,258 Q40,126 150,156 Q228,176 248,126 Q260,100 294,104', '#E6F0FF', 4) + ln('M300,104 Q272,124 286,152', '#E6F0FF', 3)
      + [[120, 148], [196, 158], [60, 186]].map(([x, y]) => ell(x, y, 5, 3.4, '#E6F0FF', 1.6, '#0A1424')).join(''), ' transform="translate(0 170)"');
    s += g('sc-dark', '<rect width="400" height="400" fill="#000"/>');
    return s;
  }
};


// La Grève la nuit (le fond de presque tout le tutoriel) : ciel, lune, étoiles, mer, sable, débris du naufrage
function barrel(x, y, rot = 0) {
  // un tonneau couché, à moitié ensablé : douelles, cerclages
  const d = `M${x - 22},${y - 14} Q${x},${y - 20} ${x + 22},${y - 14} L${x + 22},${y + 10} Q${x},${y + 16} ${x - 22},${y + 10} Z`;
  return `<g transform="rotate(${rot} ${x} ${y})">` + path(d, '#A06E40') + cut('sc-barrel', d, ln(`M${x - 22},${y - 4} Q${x},${y - 10} ${x + 22},${y - 4} M${x - 22},${y + 2} Q${x},${y - 4} ${x + 22},${y + 2}`, '#5E3E22', 1.2, ' opacity=".7"')
    + `<rect x="${x - 15}" y="${y - 24}" width="5" height="44" fill="#6E6A66"/><rect x="${x + 10}" y="${y - 24}" width="5" height="44" fill="#6E6A66"/>`) + path(d, 'none')
    + ell(x + 22, y - 2, 6, 12.5, '#C8955E') + ell(x + 22, y - 2, 3.4, 8, 'none', 1.2, '#8A5E36') + '</g>';
}
function oar(x, y, rot) {
  // un aviron cassé planté dans le sable
  return `<g transform="rotate(${rot} ${x} ${y})">` + limb([x, y], [x, y - 70], 5, '#B8875A').replace(/stroke="#3C2819" stroke-width="([\d.]+)"/, (m, w) => `stroke="${OUT}" stroke-width="${r2(+w - 0.6)}"`)
    + path(`M${x - 3},${y - 70} L${x - 6},${y - 82} L${x - 1},${y - 78} L${x + 2},${y - 86} L${x + 4},${y - 70} Z`, '#D2A878', 2)
    + path(`M${x - 9},${y} Q${x},${y - 6} ${x + 9},${y} Z`, '#7E7060', 0) + '</g>';
}
function rope(x, y) {
  // un rouleau de cordage : trois tours de corde (cordon cerné), le bout qui traîne dans le sable
  const turn = (rx, ry, dy) => ln(`M${x - rx},${y + dy} a${rx},${ry} 0 1 0 ${2 * rx},0 a${rx},${ry} 0 1 0 ${-2 * rx},0`, OUT, 5.6) + ln(`M${x - rx},${y + dy} a${rx},${ry} 0 1 0 ${2 * rx},0 a${rx},${ry} 0 1 0 ${-2 * rx},0`, '#C29A5E', 3.2);
  const end = `M${x + 15},${y + 2} Q${x + 26},${y + 9} ${x + 38},${y + 5}`;
  return ell(x, y + 3, 19, 6, 'rgba(40,30,20,.25)', 0) + turn(15, 6, 0) + turn(10.5, 4.2, -2.6) + turn(6, 2.4, -4.6)
    + ln(end, OUT, 5.6) + ln(end, '#C29A5E', 3.2) + ln(`M${x + 36},${y + 3} l3,4`, OUT, 1.2);
}
// une touffe d'algues échouées, un coquillage
const kelp = (x, y, k = 1) => at(x, y, ln('M0,0 Q-6,-8 -2,-16 M0,0 Q4,-10 10,-14 M0,0 Q-10,-4 -16,-2', OUT, 4.6) + ln('M0,0 Q-6,-8 -2,-16 M0,0 Q4,-10 10,-14 M0,0 Q-10,-4 -16,-2', '#5E8A4A', 2.4), k);
const shell = (x, y, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})">` + path('M-6,2 Q-7,-6 0,-7 Q7,-6 6,2 Z', '#EAD8C0', 1.6) + ln('M0,1 L0,-6 M-3,1 L-3.6,-4.6 M3,1 L3.6,-4.6', '#B89A7A', 1) + '</g>';
function greve({ skyKind = 'nuit', mistO = 0.18, debris = true, moonAt = [252, 72] } = {}) {
  let s = sky(skyKind) + stars() + (moonAt ? moon(moonAt[0], moonAt[1], 16) : '');
  // au loin, la côte de l'île : une ligne de collines sombres
  s += path('M0,232 L0,214 Q30,200 64,210 Q92,190 128,206 Q150,214 170,232 Z', '#2A3760', 0) + path('M300,232 Q320,206 352,212 Q378,196 400,206 L400,232 Z', '#2A3760', 0);
  s += sea(232, 300);
  s += sand(262);
  if (debris) {
    s += barrel(56, 300, -8) + oar(344, 292, 14);
    s += log([96, 312], [174, 300], 11, { side: '#8A6440', light: '#A87E54', dark: '#5E4026', end: '#C29A6A', ring: '#7A5434' });
    s += crate(258, 270, 34, 28, 4, 'gc') + rope(300, 318);
    s += kelp(92, 318) + kelp(250, 302, 0.8) + kelp(372, 316, 0.9) + shell(196, 330, -10) + shell(36, 350, 20);
  }
  return s;
}
const lightMist = (o) => mist(o);

SC.beach = {
  label: 'La Grève, la nuit, la brume', step: 'T1', thought: true,
  draw: () => greve() + mist(0.22)
};
// 1c — une flamme bleue approche, deux yeux s'ouvrent
SC.wisp = {
  label: 'Un feu follet', step: 'T1', thought: true,
  draw: () => greve() + brume(200, 226, 3) + mist(0.2)
};
// 1d — Brume sursaute, se cache derrière un rocher et passe la tête
SC.rock = {
  label: 'Brume derrière le rocher', step: 'T1',
  draw() {
    let s = greve({ debris: false });
    s += barrel(56, 300, -8) + log([96, 318], [160, 308], 11);
    // le gros rocher (derrière Brume), Brume, puis la pierre de devant qui la cache à moitié
    s += rock('M168,314 Q164,236 214,220 Q258,208 284,246 Q304,280 298,314 Z', '#4E4C58', '#3A3844', '#6E6C7A', 'rkb', 'M190,244 l10,14 l-4,12 M276,262 l-10,8 l2,12');
    s += brume(238, 258, 2.7, { expr: 'surpris' });
    s += rock('M204,316 Q202,278 232,272 Q264,266 280,288 Q292,304 288,316 Z', '#5A5864', '#43414D', '#7A7886', 'rkf', 'M226,286 l8,10 l-2,8') + kelp(286, 316, 0.8);
    s += path('M170,316 Q230,322 300,316', 'none', 2.4) + mist(0.18);
    return s;
  }
};
// 1e — Brume souffle sur des débris : le Feu de camp s'allume, la brume recule
SC.fire = {
  label: 'Le premier feu', step: 'T1',
  draw: () => greve({ debris: false }) + barrel(56, 300, -8) + crate(300, 278, 34, 28, 4, 'fc') + campfire(214, 304, 1.3, { glow: 140 }) + brume(140, 262, 2.6, { expr: 'content' }) + mist(0.07)
};


// Le Grimoire fermé : cuir grenat, coins et filets d'or, la couronne des sept sceaux (médaillons d'or et leur sigle,
// copiés de src/book/grimoire.js) autour de la gemme ; tranche des pages à droite et en bas, fermoir. Centre en (x, y)
const SIGILS = {
  I: 'M8 2.5a4 4 0 0 0 8 0M16 9.5a4 4 0 1 1-8 0a4 4 0 1 1 8 0M12 13.5v8M8.8 18h6.4',
  II: 'M9 2.5v12M5.8 5.6h6.4M9 11.5c1.6-2.8 6.6-2.6 6.6 1.6c0 2.6-3 3.6-3 6.2c0 1.2.8 2.2 2.2 2.2',
  III: 'M15.5 3.2a8.8 8.8 0 1 0 0 17.6a7.2 7.2 0 1 1 0-17.6z',
  IV: 'M17 8.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M12 13.5v8.5M8.5 18.2h7',
  V: 'M14.5 14.5a5 5 0 1 1-10 0a5 5 0 1 1 10 0M13.2 10.8L20 4M14.6 4H20v5.4',
  VI: 'M5.5 7c1.4-2.6 5.6-3 6.6-.4c1 2.6-2 6.4-6.4 10.4h13.6M16 11.5v10',
  VII: 'M20 12a8 8 0 1 1-16 0a8 8 0 1 1 16 0M13.7 12a1.7 1.7 0 1 1-3.4 0a1.7 1.7 0 1 1 3.4 0'
};
const CHAPTERS = Object.keys(SIGILS);
const GOLD = { light: '#F6DE9A', base: '#D6A84A', dark: '#8A6420' };
// un sigle (repère 24 × 24) centré en (x, y), de taille k
const sigil = (id, x, y, k, color, w = 2.2, extra = '') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k}) translate(-12 -12)"${extra}><path d="${SIGILS[id]}" fill="none" stroke="${color}" stroke-width="${f1(w / k)}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
function grimoire(x, y, { broken = [], lit = [], gem = 'rouge' } = {}) {
  const W = 66, H = 84;
  let o = '';
  // ombre au sol
  o += ell(0, H + 30, 56, 9, 'rgba(10,14,30,.35)', 0);
  // le dos du livre (l'autre plat) et la tranche des pages, en épaisseur vers le bas à droite
  o += path(`M${-W + 8},${-H + 8} H${W + 8} V${H + 8} H${-W + 8} Z`, '#4A1418', S);
  const pages = `M${W},${-H + 4} L${W + 6},${-H + 8} V${H + 4} L${W},${H} Z M${-W + 4},${H} H${W} L${W + 6},${H + 4} H${-W + 10} Z`;
  o += path(pages, '#F2E6CC', 1.8) + ln(Array.from({ length: 6 }, (_, k) => `M${W + 1.5},${-H + 14 + k * 26} V${-H + 26 + k * 26}`).join(' '), '#C9B48A', 1);
  // le plat : cuir, ombre en bas à droite, filets d'or, coins d'or
  const cover = `M${-W + 8},${-H} H${W - 8} Q${W},${-H} ${W},${-H + 8} V${H - 8} Q${W},${H} ${W - 8},${H} H${-W + 8} Q${-W},${H} ${-W},${H - 8} V${-H + 8} Q${-W},${-H} ${-W + 8},${-H} Z`;
  o += `<linearGradient id="sc-leather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9A3440"/><stop offset=".55" stop-color="#7A2A31"/><stop offset="1" stop-color="#4E161B"/></linearGradient>`;
  o += path(cover, 'url(#sc-leather)', S) + cut('sc-cover', cover, `<rect x="${-W}" y="${-H}" width="12" height="${2 * H}" fill="#5C1F25"/>` + ln(`M${-W + 12},${-H} V${H}`, '#3A1014', 1.4)
    + [-H + 22, H - 22].map(yy => ln(`M${-W},${yy} H${-W + 12}`, GOLD.base, 2)).join(''));
  o += `<rect x="${-W + 20}" y="${-H + 10}" width="${2 * W - 30}" height="${2 * H - 20}" rx="4" fill="none" stroke="${GOLD.base}" stroke-width="1.8"/>`
    + `<rect x="${-W + 25}" y="${-H + 15}" width="${2 * W - 40}" height="${2 * H - 30}" rx="3" fill="none" stroke="${GOLD.base}" stroke-width="0.9" opacity=".8"/>`;
  for (const [cx, cy, sx, sy] of [[W, -H, -1, 1], [W, H, -1, -1], [-W + 12, -H, 1, 1], [-W + 12, H, 1, -1]]) o += path(`M${cx},${cy} h${sx * 16} l${-sx * 16},${sy * 16} Z`, GOLD.base, 1.6) + ell(cx + sx * 4.6, cy + sy * 4.6, 1.6, 1.6, GOLD.light, 0);
  // le fermoir (une patte de cuir et sa boucle d'or) sur la tranche droite
  o += path(`M${W - 4},-8 H${W + 10} V8 H${W - 4} Z`, '#5C1F25', 2) + path(`M${W - 9},-11 h10 v22 h-10 Z`, GOLD.base, 2) + ell(W - 4, 0, 2.2, 2.2, GOLD.dark, 0);
  // la couronne : grand cercle d'or, les sept médaillons, la gemme au centre
  const cx = 5, R = 40;
  o += ell(cx, 0, 29, 29, 'none', 1.6, GOLD.base) + ell(cx, 0, 52, 52, 'none', 1, GOLD.base, ' opacity=".55"');
  CHAPTERS.forEach((id, k) => {
    const a = -Math.PI / 2 + (k * Math.PI * 2) / 7, mx = cx + Math.cos(a) * R, my = Math.sin(a) * R;
    const isB = broken.includes(id), isL = lit.includes(id) || isB;
    if (isL) o += g('sc-glow', ell(mx, my, 16, 16, 'url(#sc-sealglow)', 0), ` style="animation-delay:-${k * 0.3}s"`);
    o += ell(mx, my, 10, 10, isL ? '#F2D27A' : GOLD.base, 1.8) + ell(mx, my, 7.6, 7.6, isL ? '#FFF0C0' : '#B8862E', 0);
    o += sigil(id, mx, my, 0.55, isL ? '#C2862A' : '#F6DE9A', 1.9);
    if (isB) o += ln(`M${f1(mx - 9)},${f1(my - 4)} l5,3 l2,-4 l4,5 l5,-2`, OUT, 1.4);
  });
  const gemC = gem === 'verte' ? ['#9EE07A', '#5EA84A', '#E4FFD0'] : ['#C2475A', '#8E2B3A', '#F2A0AE'];
  if (gem === 'verte') o += g('sc-glow', ell(cx, 0, 30, 30, 'url(#sc-anyaglow)', 0));
  o += ell(cx, 0, 13, 13, GOLD.base, 2) + path(`M${cx},-10 L${cx + 9},0 L${cx},10 L${cx - 9},0 Z`, gemC[0], 1.6) + path(`M${cx},-10 L${cx + 9},0 L${cx},0 Z`, gemC[1], 0) + path(`M${cx - 3},-5 l3,-2 l2,3 Z`, gemC[2], 0) + path(`M${cx},-10 L${cx + 9},0 L${cx},10 L${cx - 9},0 Z`, 'none', 1.6);
  const defs = `<radialGradient id="sc-sealglow"><stop offset="0" stop-color="#FFE6A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE6A8" stop-opacity="0"/></radialGradient>`
    + `<radialGradient id="sc-anyaglow"><stop offset="0" stop-color="#FAECAA" stop-opacity=".85"/><stop offset=".5" stop-color="#BEE68C" stop-opacity=".4"/><stop offset="1" stop-color="#A0DC78" stop-opacity="0"/></radialGradient>`
    + `<radialGradient id="sc-bookglow"><stop offset="0" stop-color="#78D2FF" stop-opacity=".5"/><stop offset="1" stop-color="#78D2FF" stop-opacity="0"/></radialGradient>`;
  return defs + g('sc-glow', `<circle cx="${x}" cy="${y}" r="120" fill="url(#sc-bookglow)"/>`) + at(x, y, g('sc-float', o));
}

// 1f — Brume apporte le livre fermé par sept sceaux
SC.book = {
  label: 'Le Grimoire', step: 'T1',
  draw: () => greve({ debris: false }) + barrel(56, 300, -8) + grimoire(200, 214) + brume(200, 104, 2.1, { expr: 'content' }) + mist(0.1)
};
// 1i — le premier sceau : Saturne se brise, des rayons
SC.seal = {
  label: 'Le sceau de Saturne se brise', step: 'T1',
  draw() {
    const R = 40, a = -Math.PI / 2 + (Math.PI * 2) / 7, sx = 200 + 5 + Math.cos(a) * R, sy = 214 + Math.sin(a) * R;
    const rays = Array.from({ length: 12 }, (_, k) => { const t = k * Math.PI / 6 + 0.2; return ln(`M${f1(sx + Math.cos(t) * 16)},${f1(sy + Math.sin(t) * 16)} L${f1(sx + Math.cos(t) * (k % 2 ? 30 : 40))},${f1(sy + Math.sin(t) * (k % 2 ? 30 : 40))}`, '#FFE29A', 3, ' opacity=".9"'); }).join('');
    return greve({ debris: false }) + barrel(56, 300, -8) + grimoire(200, 214, { broken: ['II'] }) + g('sc-float', g('sc-glow', rays)) + brume(118, 128, 2.1, { expr: 'surpris' }) + mist(0.1);
  }
};


// 2a — le Vent a chassé la brume : Aster, dans l'eau jusqu'à la taille, tire des caisses (tenue de naufragée)
function asterPull(nau, n) {
  // les deux mains sur la corde, côté droit ; la corde file vers la caisse (le geste du plan d'entrée)
  return {
    ...nau,
    pose: () => ({
      expr: 'content', eyeMode: 'squeeze', open: true,
      left: cord(`M27.6,43.8 L33.8,42.4 Q39.4,${n ? 44.2 : 43.6} 44.2,${n ? 42.4 : 41.8}`, 0.9, '#B08850') + T.arm(nau, [16, 34], [28.4, 43.6], [19.4, 42.4]),
      right: T.arm(nau, [32, 34], [33.6, 42.4], [35.8, 38])
    })
  };
}
SC.aster = {
  label: 'Aster dans les vagues', step: 'T2',
  draw() {
    let s = sky('petitjour', 210) + stars(STARS.filter(([, y]) => y < 110), '#E6ECFF') + moon(312, 64, 13);
    s += path('M0,200 L0,186 Q40,172 80,182 Q110,166 150,180 Q166,188 180,200 Z', '#3A4C78', 0) + path('M290,200 Q316,178 350,184 Q380,170 400,178 L400,200 Z', '#3A4C78', 0);
    s += sea(200, 400, ['#4A6A9A', '#2A4A78'], '#88A8D4');
    // les caisses qui flottent au loin
    s += crate(96, 236, 30, 24, -10, 'ac1') + crate(326, 226, 22, 18, 8, 'ac2');
    // Aster et la caisse au bout de sa corde ; l'eau devant, jusqu'à la taille, l'écume autour d'elle
    const X = 178, Y = 338, K = 3;
    s += crate(242, 256, 40, 32, -8, 'ac3');
    s += cycle([0, 1].map(n => lit('petitjour', put(T.frame(asterPull(M.aster.nau, n), 'se', 'action', 0), X, Y + (n ? -1.6 : 0), K))), 700);
    const front = `${waveD(286, 4, 46, 0)} L420,420 L-20,420 Z`;
    s += g('sc-foam', path(front, '#3E6496', 2.4, '#E6F0FF') + cut('sc-front', front, ln(waveD(318, 3, 38, 8), '#88A8D4', 2, ' opacity=".6"') + ln(waveD(356, 3, 52, -6), '#88A8D4', 2, ' opacity=".5"')));
    // éclaboussures autour d'elle et de la caisse
    s += g('sc-foam', [[146, 284, 1], [214, 284, -1], [232, 290, 1], [290, 290, -1]].map(([x, y, k]) => ln(`M${x - 9 * k},${y + 2} Q${x - 5 * k},${y - 7} ${x},${y - 2}`, '#F4FAFF', 2.4)).join(''));
    s += [[150, 246], [214, 252]].map(([x, y]) => put(T.drop(24, 62, 0.8, '#BFE6FF'), x, y, K)).join('');
    // le bord de la plage, au premier plan : c'est de là qu'on la regarde
    s += path('M-10,378 Q100,366 210,376 T410,370 V410 H-10 Z', '#8A7C68', 0) + g('sc-foam', ln('M-10,378 Q100,366 210,376 T410,370', '#E6F0FF', 2.6)) + kelp(84, 392, 0.9) + shell(300, 392, 12);
    return s;
  }
};

// 3a — derrière l'épave, Cannelle grelotte, la louche serrée contre elle ; Brume, les yeux ronds (le plan d'entrée × 3)
SC.cannelle = {
  label: 'Cannelle derrière l\'épave', step: 'T3',
  draw() {
    let s = greve({ debris: false });
    // l'épave au fond : la coque couchée de l'Hirondelle et son mât brisé
    s += path('M268,266 Q268,236 300,228 L400,220 V270 Z', '#5E4630', S) + ln('M280,250 L400,240 M276,260 L400,254', '#3E2E1E', 1.6)
      + limb([352, 226], [362, 196], 6, '#6E5034') + path('M357,198 l4,-8 l3,6 l3,-5 l1,8 Z', '#8A6440', 1.6);
    s += barrel(52, 300, -8) + ell(176, 312, 96, 8, 'rgba(30,24,18,.35)', 0);
    s += at(80, 126, cycle([0, 1].map(n => lit('nuit', cannelleScene(M.cannelle.nau, n))), 110), 3);
    s += brume(312, 178, 2, { expr: 'surpris' }) + mist(0.16);
    return s;
  }
};

// 3b — devant le feu, elle se redresse : « Cuisinière du bord, et fière de l'être ! » (son souvenir : un éclat d'or, son
// sceau ♂ qui s'allume au-dessus d'elle)
const sparkles = (list, fill = '#FFE29A') => list.map(([x, y, sz], k) => g('sc-twinkle', star4(x, y, sz, fill), ` style="animation-delay:-${f1(k * 0.5)}s;animation-duration:1.6s"`)).join('');
SC['cannelle-feu'] = {
  label: 'Cannelle se souvient', step: 'T3',
  draw() {
    let s = greve({ debris: false }) + crate(330, 284, 34, 28, 6, 'cf');
    s += campfire(150, 306, 1.1) + brume(84, 246, 2.1, { expr: 'content' });
    s += `<radialGradient id="sc-souv"><stop offset="0" stop-color="#FFE6A8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE6A8" stop-opacity="0"/></radialGradient>`;
    s += g('sc-glow', `<circle cx="262" cy="200" r="90" fill="url(#sc-souv)"/>`);
    s += cycle([0, 1].map(n => lit('feu', put(T.frame(M.cannelle.nau, 'front', 'action', n), 262, 312, 3))), 600);
    s += g('sc-glow', sigil('V', 300, 98, 1.2, '#FFE29A', 3.2, ' filter="url(#sc-blur)"') + sigil('V', 300, 98, 1.2, '#FFF4CC', 2.4));
    s += `<filter id="sc-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>`;
    s += sparkles([[214, 150, 5], [318, 168, 4], [232, 232, 3.4], [328, 240, 4.4], [276, 128, 3]]);
    return s + mist(0.06);
  }
};


// 4a — sous une voile échouée, Rivet trie des vis par taille (le plan d'entrée × 3)
SC.rivet = {
  label: 'Rivet sous la voile', step: 'T4',
  draw: () => greve({ debris: false }) + barrel(46, 300, -8) + rope(330, 320)
    + ell(200, 312, 112, 7, 'rgba(30,24,18,.35)', 0) + at(80, 125, cycle([0, 1].map(n => lit('nuit', rivetScene(M.rivet.nau, n))), 700), 3)
    + brume(104, 226, 1.8, { expr: 'content' }) + mist(0.14)
};

// 5b — La Source : la brume se lève sur un dormeur réveillé (les yeux encore lourds), le bocal vide ; Cannelle accourt
function source() {
  // une clairière : herbe, roseaux, la source cerclée de pierres, un arbre sombre au fond
  let s = sky('nuit', 300) + stars() + moon(300, 66, 14);
  s += path('M0,236 Q60,214 120,224 Q170,206 230,220 Q300,200 400,222 V260 H0 Z', '#2A3E5A', 0);
  s += path('M0,250 Q110,238 200,246 T400,244 V400 H0 Z', '#3E5E4A', 0) + path('M0,276 Q120,262 220,272 T400,268 V400 H0 Z', '#4A6E50', 0);
  // arbres sombres
  for (const [x, y, k] of [[46, 252, 1], [356, 248, 1.2]]) s += at(x, y, limb([0, 0], [0, -40], 6, '#4A3624') + path('M-26,-36 Q-34,-64 -10,-72 Q0,-94 18,-76 Q40,-70 30,-44 Q34,-28 14,-30 Q0,-24 -12,-30 Q-30,-24 -26,-36 Z', '#2E5240', S), k);
  // la source : l'eau claire cerclée de pierres, des reflets
  const pool = 'M96,322 Q98,296 160,292 Q232,290 246,314 Q244,338 168,340 Q100,340 96,322 Z';
  s += path(pool, '#5E9EC2', S) + cut('sc-pool', pool, ell(170, 306, 60, 9, '#8CC6E2', 0) + g('sc-foam', ell(160, 318, 26, 5, 'none', 1.6, '#E6F7FC') + ell(160, 318, 40, 8, 'none', 1.2, '#E6F7FC', ' opacity=".6"')));
  for (const [x, y, rx, ry] of [[98, 312, 11, 7], [124, 294, 9, 6], [214, 294, 10, 6], [246, 318, 9, 7], [110, 338, 11, 6], [206, 340, 12, 6]]) s += ell(x, y, rx, ry, '#9A968E', 2) + ell(x - rx * 0.3, y - ry * 0.35, rx * 0.4, ry * 0.3, '#B8B4AC', 0);
  // roseaux
  s += [70, 78, 86, 256, 264].map((x, k) => ln(`M${x},${330 - (k % 2) * 6} q-6,-30 2,-50`, OUT, 4.4) + ln(`M${x},${330 - (k % 2) * 6} q-6,-30 2,-50`, '#6E9A4A', 2.4) + ell(x + 1, 286 - (k % 2) * 6, 2.6, 7, '#8A5A30', 1.4)).join('');
  return s;
}
// Ondin réveillé : assis contre son rocher, les yeux lourds, sans ronfler
function ondinAwake(c, n) {
  const sleepy = { ...c, head: (cc, ctx, a) => c.head(cc, { ...ctx, eyeMode: 'sleepy' }, a) };
  return seated(sleepy, n, { ...SEAT.Ondin, expr: 'neutre', tilt: 6, face: () => '' });
}
SC.ondin = {
  label: 'Ondin à La Source', step: 'T5',
  draw() {
    let s = source();
    s += lit('nuit', put(ondinAwake(M.ondin.nau, 0), 294, 318, 2.3));
    // Cannelle (souvenir retrouvé : sa tenue de maîtresse) court vers lui
    s += cycle([0, 1, 2, 3].map(n => lit('nuit', put(T.frame(M.cannelle.base, 'se', 'marche', n, 'rire'), 196, 270, 1.9, true))), 160);
    s += brume(110, 206, 1.9, { expr: 'content' }) + mist(0.12);
    return s;
  }
};

// 5f — fin du tutoriel, « Le Campement » : le feu, le Puits, cinq visages
function well(x, y, k = 1) {
  // le Puits d'Ondin : margelle de pierres, deux montants, un petit toit, le seau
  let o = ell(0, 10, 30, 9, '#6E6A66', S) + path('M-30,10 V-14 H30 V10 Z', '#8E8A84', S)
    + cut('sc-well', 'M-30,10 V-14 H30 V10 Z', ln('M-30,-6 H30 M-30,2 H30 M-15,-14 V-6 M10,-14 V-6 M-4,-6 V2 M20,-6 V2 M-22,2 V10 M6,2 V10', OUT, 1.2, ' opacity=".55"') + '<rect x="12" y="-14" width="18" height="24" fill="#6E6A66" opacity=".5"/>')
    + ell(0, -14, 30, 8, '#A8A49C', S) + ell(0, -14, 23, 5.4, '#2A4A68', 1.6);
  o += limb([-24, -14], [-24, -60], 4, '#8A5A30') + limb([24, -14], [24, -60], 4, '#8A5A30') + limb([-24, -46], [24, -46], 2.6, '#A8743F');
  o += path('M-36,-56 L0,-80 L36,-56 Z', '#A8743F', S) + ln('M-26,-62 L0,-78 L26,-62', '#7A4E2C', 1.4);
  o += ln('M0,-46 V-30', OUT, 1.4) + path('M-7,-30 h14 l-2,12 h-10 Z', '#9AA2AD', 2);
  return at(x, y, o, k);
}
SC.campement = {
  label: 'Le Campement', step: 'T5',
  draw() {
    let s = greve({ debris: false }) + well(350, 280, 1.05);
    // au fond : Aster (naufragée, son souvenir viendra) et Rivet (naufragé aussi) ; devant : Cannelle et Ondin, souvenir
    // retrouvé ; chacun tourné vers le feu (le trois quarts avant regarde vers la gauche : miroir pour ceux de gauche)
    s += stand(M.aster.nau, 'se', 162, 284, 1.7, true, 'content', 'feu', -1200) + stand(M.rivet.nau, 'se', 248, 284, 1.7, false, 'neutre', 'feu', -3100);
    s += campfire(204, 318, 1.05, { glow: 140 });
    s += stand(M.cannelle.base, 'se', 98, 332, 2, true, 'content', 'feu', -400) + stand(M.ondin.base, 'se', 306, 334, 1.85, false, 'content', 'feu', -2300);
    s += brume(204, 200, 1.9, { expr: 'content' }) + mist(0.06);
    return s;
  }
};

export { SC, M, KEYS, stand, CSS, cycleCss, tintDefs, scope, put, putB, g, at, ln, path, ell, cut, cycle, blinker, lit, sky, stars, moon, sea, sand, mist, log, crate, rock, campfire, brume, flame, waveD, star4, f1, S };

// Le SVG complet d'une scène
// (identifiants préfixés par la scène : deux scènes peuvent vivre dans la même page)
export function sceneSvg(key, opts = {}) {
  seq = 0;
  const pfx = `${key.replace(/[^a-z0-9]/gi, '')}-`;
  const body = `<defs>${tintDefs()}</defs>${SC[key].draw(opts)}`.replace(/id="([^"]+)"/g, `id="${pfx}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${pfx}$1)`).replace(/href="#([^"]+)"/g, `href="#${pfx}$1"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><style>${CSS}${cycleCss}</style>${body}</svg>`;
}
