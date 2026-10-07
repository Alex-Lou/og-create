// Lot F — météo et ciel, d'après src/world/sky.js, scene.js et climates.js (le jeu les peint au canvas). Ici en SVG :
// calques d'écran qui se répètent sans couture (tuiles) et bouclent (images), nuages, arc-en-ciel, éclair, soleil bas,
// teintes des moments du jour, lumières, et icônes au trait de la troupe. Mêmes couleurs et densités que le jeu.
const { OUT, P, E, L, r2 } = require('./troupe');

const TAU = Math.PI * 2;
// Hasard déterministe du jeu (scene.js)
const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const T = 256; // côté d'une tuile
// Dessine une particule et ses copies de l'autre côté des bords (la tuile se répète sans couture)
function wrapped(x, y, m, draw, W = T, H = T) {
  let o = '';
  const mx = ((x % W) + W) % W, my = ((y % H) + H) % H;
  for (const dx of [-W, 0, W]) for (const dy of [-H, 0, H]) {
    const px = mx + dx, py = my + dy;
    if (px > -m && px < W + m && py > -m && py < H + m) o += draw(px, py);
  }
  return o;
}
const line = (d, w, c, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const tk = (d, w, c) => line(d, w + 2.2, OUT) + line(d, w, c);

/* ================= Tuiles animées : { w, h, n, ms, draw(k) } ================= */
const TILES = {};
// Pluie : traits fins en biais ; une boucle = 1 tuile vers la droite, 4 vers le bas (deux vitesses)
const rain = night => ({
  w: T, h: T, n: 8, ms: 110,
  draw: k => {
    const c = night ? 'rgba(205,218,242,.42)' : 'rgba(168,186,212,.6)';
    let d = '';
    for (let i = 0; i < 24; i++) {
      const s = hash(i, 3) < 0.6 ? 1 : 2;
      const len = (9 + hash(i, 4) * 8) * 1.25;
      d += wrapped(hash(i, 1) * T + (s * T * k) / 8, hash(i, 2) * T + (s * 4 * T * k) / 8, 30, (x, y) => `M${r2(x)},${r2(y)} l${r2(-len * 0.25)},${r2(-len)} `);
    }
    return line(d, 1.4, c);
  }
});
TILES.pluie_jour = rain(false);
TILES.pluie_nuit = rain(true);
// Neige des Cimes : flocons qui tombent en se balançant ; une boucle = 1 tuile vers le bas
TILES.neige = { w: T, h: T, n: 16, ms: 200, draw: k => {
  let o = '';
  for (let i = 0; i < 16; i++) {
    const r = (1 + hash(i, 4) * 1.8) * 1.25;
    const x = hash(i, 1) * T + Math.sin((TAU * k) / 16 + i) * 14;
    o += wrapped(x, hash(i, 2) * T + (T * k) / 16, 6, (px, py) => E(px, py, r, r, 'rgba(255,255,255,.88)', 0));
  }
  return o;
} };
// Rafales des Landes : traits clairs qui filent vers la droite en ondulant
TILES.rafales = { w: T, h: T, n: 8, ms: 100, draw: k => {
  let d = '';
  for (let i = 0; i < 5; i++) {
    const len = (40 + hash(i, 8) * 60) * 1.25, wob = 6 * Math.sin((TAU * k) / 8 + i);
    d += wrapped(hash(i, 6) * T + (T * k) / 8, hash(i, 5) * T, len + 8, (x, y) => `M${r2(x)},${r2(y)} q${r2(len * 0.5)},${r2(-wob)} ${r2(len)},0 `);
  }
  return line(d, 1.5, 'rgba(255,255,255,.5)');
} };
// Bancs de brume (temps « brume » et brume tiède du Marais) : voile laiteux et grandes taches claires qui dérivent
const banks = (veil, bank, a) => ({ w: 2 * T, h: T, n: 12, ms: 500, draw: k => {
  const W = 2 * T;
  let o = `<defs><radialGradient id="b"><stop offset="0" stop-color="rgb(${bank})" stop-opacity="${a}"/><stop offset="1" stop-color="rgb(${bank})" stop-opacity="0"/></radialGradient></defs>`
    + `<rect width="${W}" height="${T}" fill="${veil}"/>`;
  for (let i = 0; i < 3; i++) {
    const R = 150;
    o += wrapped(hash(i, 61) * W + (W * k) / 12, T * (0.2 + i * 0.3) + Math.sin((TAU * k) / 12 + i) * 10, R, (x, y) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${R}" fill="url(#b)"/>`, W, T);
  }
  return o;
} });
TILES.brume = banks('rgba(236,239,243,.3)', '244,246,249', 0.32);
TILES.brume_marais = banks('rgba(228,236,228,.22)', '236,242,236', 0.34);
// Ondes de chaleur des Dunes : longues lignes claires qui ondulent et montent ; une boucle = un écart entre deux lignes
TILES.chaleur = { w: T, h: T, n: 6, ms: 160, draw: k => {
  let d = '';
  const gap = T / 7;
  for (let i = 0; i < 8; i++) {
    const y0 = T - (i * gap + (gap * k) / 6);
    let p = '';
    for (let x = 0; x <= T; x += 8) p += `${x ? 'L' : 'M'}${x},${r2(y0 + Math.sin((x / 128) * TAU + (TAU * k) / 6 + i) * 3.75)} `;
    d += p;
  }
  return line(d, 2.5, 'rgba(255,244,220,.3)');
} };
// Averse tropicale de la Jungle : voile vert et pluie drue presque droite
TILES.averse = { w: T, h: T, n: 8, ms: 100, draw: k => {
  let d = '';
  for (let i = 0; i < 28; i++) {
    const s = hash(i, 13) < 0.5 ? 1 : 2;
    const len = (14 + hash(i, 14) * 8) * 1.25;
    d += wrapped(hash(i, 11) * T, hash(i, 12) * T + (s * 4 * T * k) / 8, 32, (x, y) => `M${r2(x)},${r2(y)} l-2.5,${r2(-len)} `);
  }
  return `<rect width="${T}" height="${T}" fill="rgba(120,170,140,.1)"/>` + line(d, 1.6, 'rgba(190,215,225,.58)');
} };
// Cendres et braises du Volcan : flocons gris qui tombent, braises qui montent et vacillent
TILES.cendres = { w: T, h: T, n: 16, ms: 200, draw: k => {
  let o = '';
  for (let i = 0; i < 22; i++) {
    const ember = i % 5 === 0;
    const dir = ember ? -1 : 1;
    const x = hash(i, 21) * T + Math.sin((TAU * k) / 16 + i) * 18;
    o += wrapped(x, hash(i, 22) * T + (dir * T * k) / 16, 6, (px, py) => ember
      ? `<rect x="${r2(px)}" y="${r2(py)}" width="3" height="3" rx="0.8" fill="rgb(255,150,70)" fill-opacity="${r2(0.9 * (0.6 + 0.4 * Math.sin((TAU * k) / 4 + i)))}"/>`
      : `<rect x="${r2(px)}" y="${r2(py)}" width="3" height="2" rx="0.6" fill="rgba(90,84,80,.62)"/>`);
  }
  return o;
} };
// Étoiles qui se reflètent dans la mer, la nuit (pas sous un ciel couvert) : elles scintillent
TILES.etoiles = { w: T, h: T, n: 4, ms: 400, draw: k => {
  let o = '';
  for (let i = 0; i < 10; i++) {
    const a = 0.5 + 0.5 * Math.sin((TAU * k) / 4 + i * 3.1);
    o += `<rect x="${r2(hash(i, 21) * T)}" y="${r2(hash(i, 29) * T)}" width="2" height="2" rx="0.5" fill="rgb(255,248,220)" fill-opacity="${r2(a * 0.75)}"/>`;
  }
  return o;
} };

/* ================= Sprites : { frame, n, ms, draw(k) } ================= */
const SPR = {};
// Nuage du jeu (4 ellipses, échelle s) en ombre de cel : dessous ombré, liseré de la troupe adouci
const CLOUD_SHAPES = [
  [[0, 0, 46, 16], [-24, 3, 24, 12], [26, 4, 26, 11], [-4, -10, 26, 15]],
  [[0, 0, 40, 14], [-28, 4, 20, 10], [22, 2, 28, 13], [6, -11, 22, 14], [-14, -7, 16, 11]],
  [[0, 0, 52, 15], [-30, 3, 22, 11], [32, 4, 22, 10], [-8, -9, 24, 13], [16, -6, 18, 11]]
];
const CLOUD_COLORS = { jour: ['#FFFFFF', '#E3EAF2'], dore: ['#FFE1CC', '#F2C2A8'], nuit: ['#8E9AC0', '#6E7AA4'], pluie: ['#B0B6BF', '#8E95A0'] };
function cloud(shape, [top, under]) {
  const s = 1.25;
  const els = CLOUD_SHAPES[shape].map(([x, y, rx, ry]) => [x * s, y * s, rx * s, ry * s]);
  return `<g opacity="0.55">${els.map(([x, y, rx, ry]) => E(x, y, rx + 1.1, ry + 1.1, OUT, 0)).join('')}</g>`
    + els.map(([x, y, rx, ry]) => E(x, y, rx, ry, under, 0)).join('')
    + els.map(([x, y, rx, ry]) => E(x - rx * 0.06, y - ry * 0.18, rx * 0.94, ry * 0.8, top, 0)).join('');
}
for (let sh = 0; sh < 3; sh++) for (const [name, cols] of Object.entries(CLOUD_COLORS)) SPR[`nuage${sh + 1}_${name}`] = { group: 'nuages', frame: [-80, -38, 160, 66], n: 1, draw: () => cloud(sh, cols) };
SPR.ombre_nuage = { group: 'nuages', frame: [-80, -38, 160, 66], n: 1, draw: () => `<g opacity="0.22">${CLOUD_SHAPES[0].map(([x, y, rx, ry]) => E(x * 1.5, y * 1.5, rx * 1.5, ry * 1.5, 'rgb(30,50,40)', 0)).join('')}</g>` };
// Arc-en-ciel, à l'opposé du soleil, juste après une averse (le jeu le peint à 20 % d'opacité)
SPR.arc_en_ciel = { group: 'ciel', frame: [-200, -205, 400, 210], n: 1, draw: () => ['#E2463A', '#F08A3A', '#F2C04B', '#7EC45B', '#5AAED7', '#5C6FC2', '#9C6FD0']
  .map((c, i) => { const r = 195 - i * 8.75; return line(`M${-r},0 A${r},${r} 0 0 1 ${r},0`, 8.75, c); }).join('').replace(/^/, '<g opacity="0.6">') + '</g>' };
// Éclair d'orage (le jeu blanchit l'écran : voir « flash ») ; 2 images : il frappe, il s'éteint
SPR.eclair = { group: 'ciel', frame: [-50, -120, 100, 130], n: 2, draw: k => {
  const bolt = 'M6,-112 L-14,-58 L0,-58 L-16,-10 L-6,-10 L-12,8 L22,-34 L8,-34 L24,-76 L10,-76 L22,-112 Z';
  return (k ? '' : '<defs><radialGradient id="eclair-halo"><stop offset="0" stop-color="rgb(255,246,200)" stop-opacity=".7"/><stop offset=".5" stop-color="rgb(255,246,200)" stop-opacity=".25"/><stop offset="1" stop-color="rgb(255,246,200)" stop-opacity="0"/></radialGradient></defs><circle cx="2" cy="-52" r="48" fill="url(#eclair-halo)"/>') + P(bolt, k ? '#F2D27A' : '#FFF6C8', 1.6)
    + (k ? '' : line('M10,-104 L-6,-60', 1.6, 'rgba(255,255,255,.9)'));
} };
// Flash de l'orage : à poser sur tout l'écran, opacité donnée par la courbe de meteo.json
SPR.flash = { group: 'ciel', frame: [0, 0, 640, 360], stretch: true, n: 1, draw: () => '<rect width="640" height="360" fill="rgb(240,244,255)" fill-opacity="0.42"/>' };
// Soleil bas : grande lueur chaude, de la droite le matin, de la gauche le soir (mode de fusion « screen »)
const lowSun = (cx, rgb) => () => `<defs><radialGradient id="s" cx="${cx}" cy="-0.05" r="1.05" gradientTransform="translate(${cx} -0.05) scale(0.5625 1) translate(${-cx} 0.05)"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity=".32"/><stop offset=".55" stop-color="rgb(${rgb})" stop-opacity=".1"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><rect width="640" height="360" fill="url(#s)"/>`;
SPR.soleil_bas_matin = { group: 'ciel', frame: [0, 0, 640, 360], stretch: true, n: 1, draw: lowSun(0.815, '255,214,150') };
SPR.soleil_bas_soir = { group: 'ciel', frame: [0, 0, 640, 360], stretch: true, n: 1, draw: lowSun(0.185, '255,158,112') };
// Lucioles (la nuit, au-dessus de l'herbe) et halo chaud des fenêtres et des feux
SPR.luciole = { group: 'lumieres', frame: [-12, -12, 24, 24], n: 4, ms: 180, draw: k => {
  const a = 0.5 + 0.5 * Math.sin((TAU * k) / 4);
  return `<defs><radialGradient id="luciole-halo"><stop offset="0" stop-color="rgb(230,255,140)" stop-opacity="${r2(0.45 + 0.4 * a)}"/><stop offset="1" stop-color="rgb(230,255,140)" stop-opacity="0"/></radialGradient></defs><circle r="${r2(8 + 3 * a)}" fill="url(#luciole-halo)"/>` + E(0, 0, 2, 2, `rgba(250,255,190,${r2(0.6 + 0.4 * a)})`, 0);
} };
SPR.halo_chaud = { group: 'lumieres', frame: [-60, -60, 120, 120], n: 1, draw: () => '<defs><radialGradient id="h"><stop offset="0" stop-color="rgb(255,196,110)" stop-opacity=".55"/><stop offset=".4" stop-color="rgb(255,196,110)" stop-opacity=".22"/><stop offset="1" stop-color="rgb(255,196,110)" stop-opacity="0"/></radialGradient></defs><circle r="60" fill="url(#h)"/>' };

/* ================= Moments du jour (sky.js) : teinte de la scène (multiplier) et mer ================= */
const NIGHT = { tint: '#5A68A6', sea: ['#1D3557', '#13263F'], night: 1, warm: 0 };
const MOMENTS = [
  ['nuit', 'Nuit', 'au lever − 2 h, et au coucher + 1 h 36', NIGHT],
  ['aube_1', 'Aube (tôt)', 'au lever − 48 min', { tint: '#6E7CB6', sea: ['#2E4A78', '#1B3354'], night: 0.8, warm: 0.1 }],
  ['aube_2', 'Aube', 'au lever − 12 min', { tint: '#D0A9B4', sea: ['#9FA8CC', '#4C6E96'], night: 0.3, warm: 0.6 }],
  ['matin_1', 'Matin doré', 'au lever + 27 min', { tint: '#FFDCA6', sea: ['#F2CFA0', '#4F8FBF'], night: 0, warm: 1 }],
  ['matin_2', 'Matin', 'au lever + 2 h 12', { tint: '#FFF5E4', sea: ['#7CC4E6', '#3E8DBF'], night: 0, warm: 0.15 }],
  ['midi', 'Midi', 'midi solaire', { tint: '#FFFFFF', sea: ['#6CC0E6', '#3E8DBF'], night: 0, warm: 0 }],
  ['apres_midi_1', 'Après-midi', 'au coucher − 3 h', { tint: '#FFF7EA', sea: ['#72C2E4', '#3E8BBC'], night: 0, warm: 0.1 }],
  ['apres_midi_2', 'Fin d\'après-midi', 'au coucher − 1 h 12', { tint: '#FFE3B2', sea: ['#90C6DE', '#3E86B8'], night: 0, warm: 0.5 }],
  ['couchant', 'Couchant', 'au coucher − 9 min', { tint: '#FFBA88', sea: ['#F2AA82', '#3C6F9E'], night: 0.05, warm: 1 }],
  ['crepuscule_1', 'Crépuscule rosé', 'au coucher + 24 min', { tint: '#EEA4C0', sea: ['#C88AB0', '#2F5684'], night: 0.3, warm: 0.8 }],
  ['crepuscule_2', 'Crépuscule', 'au coucher + 57 min', { tint: '#8C80C4', sea: ['#4A4E8E', '#22355C'], night: 0.7, warm: 0.3 }]
];
const WEATHERS = {
  clair: { label: 'Ciel clair', cover: 0, rain: 0, storm: 0, mist: 0 }, voile: { label: 'Ciel voilé', cover: 0.72, rain: 0, storm: 0, mist: 0 },
  brume: { label: 'Brume', cover: 0.35, rain: 0, storm: 0, mist: 1 }, pluie: { label: 'Pluie', cover: 0.92, rain: 1, storm: 0, mist: 0.25 },
  orage: { label: 'Orage', cover: 1, rain: 1, storm: 1, mist: 0 }
};
const CLIMATES = {
  cimes: { nom: 'Les Cimes', teinte: 'rgba(200,222,255,.16)', air: 'neige' }, landes: { nom: 'Les Landes', teinte: 'rgba(170,160,190,.12)', air: 'rafales' },
  marais: { nom: 'Le Marais', teinte: 'rgba(150,175,140,.16)', air: 'brume_marais' }, dunes: { nom: 'Les Dunes', teinte: 'rgba(255,210,140,.15)', air: 'chaleur' },
  jungle: { nom: 'La Jungle', teinte: 'rgba(90,160,110,.14)', air: 'averse' }, volcan: { nom: 'Le Volcan', teinte: 'rgba(120,60,50,.2)', air: 'cendres' }
};

/* ================= Icônes 48 × 48 au trait de la troupe ================= */
const SUN = '#F2B23C', SUN_L = '#FFD77A';
const sun = (x, y, r, rays = true) => (rays ? Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * TAU; return tk(`M${r2(x + Math.cos(a) * (r + 3))},${r2(y + Math.sin(a) * (r + 3))} L${r2(x + Math.cos(a) * (r + 7))},${r2(y + Math.sin(a) * (r + 7))}`, 1.6, SUN); }).join('') : '')
  + E(x, y, r, r, SUN, 1.3) + E(x - r * 0.3, y - r * 0.3, r * 0.42, r * 0.42, SUN_L, 0);
const cloudIcon = (x, y, s, fill = '#F4F6FA', under = '#D6DCE4') => {
  const parts = [[0, 0, 13, 8], [-9, 2, 7, 6], [9, 2, 8, 6], [-2, -5, 8, 7], [5, -3, 6, 5]].map(([a, b, rx, ry]) => [x + a * s, y + b * s, rx * s, ry * s]);
  return parts.map(([a, b, rx, ry]) => E(a, b, rx + 1.3, ry + 1.3, OUT, 0)).join('') + parts.map(([a, b, rx, ry]) => E(a, b, rx, ry, under, 0)).join('')
    + parts.map(([a, b, rx, ry]) => E(a - rx * 0.05, b - ry * 0.2, rx * 0.92, ry * 0.75, fill, 0)).join('');
};
const moon = (x, y, r) => P(`M${x + r * 0.3},${y - r} A${r},${r} 0 1 0 ${x + r},${y + r * 0.45} A${r * 0.78},${r * 0.78} 0 1 1 ${x + r * 0.3},${y - r} Z`, '#F4ECD0', 1.3);
const twinkle = (x, y, s) => P(`M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s} Z`, '#FFF3C4', 0.7);
const horizon = (y, c = '#7EC45B') => P(`M2,${y} Q24,${y - 3} 46,${y} L46,46 L2,46 Z`, c, 1.3);
const panel = (id, c, body) => `<defs><clipPath id="${id}"><rect x="1.5" y="1.5" width="45" height="45" rx="11"/></clipPath></defs><g clip-path="url(#${id})"><rect x="1.5" y="1.5" width="45" height="45" fill="${c}"/>${body}</g><rect x="1.5" y="1.5" width="45" height="45" rx="11" fill="none" stroke="${OUT}" stroke-width="1.3"/>`;
const ICONS = {
  // Temps
  clair: () => sun(24, 24, 9),
  voile: () => sun(30, 17, 7) + cloudIcon(21, 29, 1.15),
  brume: () => sun(24, 17, 7, false) + tk('M7,28 H33 M13,34 H41 M7,40 H29', 2.4, '#C6CDD6'),
  pluie: () => cloudIcon(24, 19, 1.25, '#E6EAF0', '#BFC6D0') + tk('M15,33 l-2,6 M24,33 l-2,6 M33,33 l-2,6', 1.6, '#5AAED7'),
  orage: () => cloudIcon(24, 18, 1.25, '#9AA2B2', '#7D8696') + P('M25,26 L18,37 H24 L20,46 L31,33 H25 L29,26 Z', '#F2C04B', 1.2),
  arc_en_ciel: () => ['#E2463A', '#F2C04B', '#7EC45B', '#5AAED7', '#9C6FD0'].map((c, i) => line(`M${6 + i * 2.6},36 A${18 - i * 2.6},${18 - i * 2.6} 0 0 1 ${42 - i * 2.6},36`, 2.6, c)).join('') + cloudIcon(10.4, 37, 0.55) + cloudIcon(37.2, 37, 0.55),
  // Moments
  nuit: () => panel('ic-nuit', '#2B3566', moon(22, 22, 10) + twinkle(36, 12, 3.4) + twinkle(36, 32, 2.4) + twinkle(10, 38, 2)),
  aube: () => panel('ic-aube', '#B9A6D2', sun(24, 34, 8) + horizon(35, '#6E9F72') + twinkle(39, 10, 2.4)),
  matin: () => panel('ic-matin', '#FFE7C2', sun(19, 26, 7) + horizon(37)),
  midi: () => panel('ic-midi', '#CDEBFA', sun(24, 19, 7) + horizon(38)),
  apres_midi: () => panel('ic-apres-midi', '#E2F1F7', sun(30, 22, 7) + horizon(38)),
  couchant: () => panel('ic-couchant', '#FFC59E', sun(24, 36, 9) + horizon(35, '#7E8F5B') + tk('M6,24 H14 M34,24 H42', 1.4, '#F08A3A')),
  crepuscule: () => panel('ic-crepuscule', '#8C80C4', E(24, 39, 13, 6, '#EEA4C0', 0) + horizon(38, '#4E5E6E') + twinkle(14, 14, 2.8) + twinkle(33, 10, 2) + twinkle(38, 22, 1.6)),
  // Climats
  cimes: () => P('M3,42 L18,14 L26,26 L32,18 L45,42 Z', '#A8B4C8') + P('M14,21 L18,14 L22,21 L20,23 L18,21 L16,23 Z', '#FFFFFF', 0.9) + P('M29,23 L32,18 L35,23 L33,25 L32,23 L31,25 Z', '#FFFFFF', 0.9)
    + tk('M36,6 V16 M31,8.5 L41,13.5 M31,13.5 L41,8.5', 1.2, '#FFFFFF'),
  landes: () => tk('M6,16 H28 q8,0 8,-5 q0,-5 -5,-5 q-4,0 -4,4', 2.2, '#9FB4C8') + tk('M4,26 H36 q7,0 7,5 q0,5 -5,5 q-4,0 -4,-4', 2.2, '#9FB4C8') + tk('M10,36 H22', 2.2, '#9FB4C8'),
  marais: () => E(24, 38, 20, 6, '#7FB6A8', 1.3) + [12, 18, 30, 36].map((x, i) => tk(`M${x},38 L${x + (i % 2 ? 1 : -1)},${16 + i * 2}`, 1.4, '#6E9A44') + E(x + (i % 2 ? 1 : -1), 18 + i * 2, 1.8, 4, '#8A5A2E', 0.9)).join('') + tk('M6,28 H20 M26,24 H42', 2.4, 'rgba(236,242,236,.95)'),
  dunes: () => sun(33, 15, 5) + P('M2,38 Q14,22 26,32 Q34,26 46,30 L46,46 L2,46 Z', '#F2C77A') + P('M2,44 Q18,32 34,40 Q40,37 46,38 L46,46 L2,46 Z', '#E2A855', 1.1),
  jungle: () => P('M24,44 Q8,34 10,16 Q22,10 30,4 Q42,20 24,44 Z', '#5FAE5A') + line('M24,44 Q22,26 28,8', 1.4, '#2F7A3A') + line('M23,34 L14,28 M24,26 L15,19 M25,30 L33,22 M26,20 L32,14', 1, '#2F7A3A')
    + tk('M40,26 l-1.4,4 M36,34 l-1.4,4 M42,38 l-1.4,4', 1.3, '#5AAED7'),
  volcan: () => P('M4,44 L18,16 L30,16 L44,44 Z', '#6E625A') + P('M18,16 L21,24 L24,19 L27,25 L30,16 Z', '#E8573A', 1) + P('M22,19 L24,30 L26,19', '#F2A35A', 0)
    + E(20, 9, 4, 3, 'rgba(120,112,108,.8)', 0.9) + E(27, 6, 3.4, 2.6, 'rgba(150,142,138,.8)', 0.9)
};
const ICON_GROUPS = { temps: ['clair', 'voile', 'brume', 'pluie', 'orage', 'arc_en_ciel'], moments: ['nuit', 'aube', 'matin', 'midi', 'apres_midi', 'couchant', 'crepuscule'], climats: ['cimes', 'landes', 'marais', 'dunes', 'jungle', 'volcan'] };

module.exports = { TILES, SPR, MOMENTS, WEATHERS, CLIMATES, ICONS, ICON_GROUPS, T };
