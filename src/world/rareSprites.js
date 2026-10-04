// Pièces rares de la boutique (skins trouvés dans les butins) : chacune recolore son bâtiment (teinte de tints.js sous
// le même identifiant) et lui ajoute un accessoire dessiné et animé, à tous les paliers.
// Les accessoires suivent le format des articles de shopSprites.js (calques, cadre, images, motion), dans le repère du
// bâtiment ; ils se placent grâce à la crête de chaque dessin (point haut de sa masse, mesuré palier par palier) et à
// l'emprise (2 × 2 puis 3 × 3 cases). Les petites pièces mobiles (papillons, lucioles, pétales) sont de petites images
// déplacées par motion : rien de lourd en mémoire. lights(level, t) : lueurs de nuit [x, y, rayon, « r,g,b », force]
// en pixels écran depuis le centre du bâtiment.
import { P, box, disc } from './iso';
import { f2, ln, poly, ell, dot } from './tiers/kit';
import { WOOD_DARK } from './palette';

// Crête (x, y écran) de chaque bâtiment, paliers I à VII
const CRESTS = {
  foyer: [[-34, -11], [-9, -56], [18, -61], [23, -106], [41, -124], [63, -161], [30, -169]],
  carriere: [[-2, -68], [0, -67], [19, -74], [0, -116], [0, -116], [1, -107], [14, -136]],
  bosquet: [[-2, -63], [0, -67], [0, -69], [2, -123], [3, -119], [3, -119], [10, -143]],
  puits: [[-15, -60], [0, -41], [-19, -57], [0, -57], [-3, -105], [0, -119], [0, -57]],
  potager: [[3, -37], [-7, -55], [-1, -61], [-14, -84], [0, -98], [0, -108], [-3, -86]],
  atelier: [[-25, -59], [-25, -71], [-25, -71], [-32, -87], [-2, -95], [0, -148], [0, -133]],
  ponton: [[-19, -26], [-23, -52], [-19, -51], [0, -93], [0, -93], [0, -93], [0, -93]]
};
// Bouche de la cheminée de forge de l'Atelier (u, v, z), paliers I à VII (premier panache de fumée de chaque palier)
export const FORGE_CHIMNEYS = [[0.55, -0.05, 44], [0.55, -0.2, 58], [0.7, -0.34, 64], [0.91, -0.15, 96], [0.93, -0.15, 100], [0.93, -0.15, 108], [0.91, -0.15, 66]];

export const crestOf = (site, level) => CRESTS[site][Math.max(1, Math.min(level, 7)) - 1];
const half = level => (level >= 4 ? 1.5 : 1);
const xy = ([x, y]) => `${f2(x)},${f2(y)}`;
// Déplacement écran (dx, dy) d'un calque, dans l'unité de motion (itemLayers multiplie u et v par l'écart du palier)
const shift = (dx, dy, level) => [dx / 64 / half(level), -dx / 64 / half(level), -dy];
const sparkle = (x, y, r, fill, o = 1) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x)},${f2(y)} ${f2(x + r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y + r)} Q${f2(x)},${f2(y)} ${f2(x - r)},${f2(y)} Q${f2(x)},${f2(y)} ${f2(x)},${f2(y - r)} Z" fill="${fill}" opacity="${f2(o)}"/>`;
// Petit hasard fixe (positions répétables d'un dessin à l'autre)
const rand = k => {
  const s = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
// Cadre englobant des points écran, avec une marge
const frameOf = (points, m = 4) => {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const x = Math.floor(Math.min(...xs) - m);
  const y = Math.floor(Math.min(...ys) - m);
  return [x, y, Math.ceil(Math.max(...xs) + m) - x, Math.ceil(Math.max(...ys) + m) - y];
};
// Petite image mobile : cadre serré autour du point d'ancrage, place donnée par path(t, level) → [x, y] écran
const mover = (size, draw, path, n = 0, fps = 0) => ({
  at: [0, 0],
  frame: [-size, -size, size * 2, size * 2],
  n,
  fps,
  draw,
  motion: (t, level) => shift(...path(t, level), level)
});

/* ---------- Guirlandes (lampions, pavois) : de la crête jusqu'à deux mâts aux coins gauche et droit ---------- */
// Points d'une guirlande au palier : attache haute (crête, ou un mât arrière si le bâtiment est bas), mâts au sol
function garlandGeo(site, level) {
  const h = half(level);
  const [cx, cy] = crestOf(site, level);
  const poleH = level >= 4 ? 30 : 22;
  const poles = [[-0.95 * h, 0.95 * h], [0.95 * h, -0.95 * h]].map(([u, v]) => ({ u, v, top: P(u, v, poleH), base: P(u, v, 0) }));
  const high = cy < -40 ? [cx, cy + 2] : P(-0.85 * h, -0.85 * h, 44);
  return { high, poles, poleH, backPole: cy < -40 ? null : [-0.85 * h, -0.85 * h] };
}
// Chaînette de a à b creusée de sag px : son tracé et la place de n objets pendus
function chain(a, b, sag, n) {
  const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
  const at = t => [0, 1].map(i => (1 - t) * (1 - t) * a[i] + 2 * (1 - t) * t * c[i] + t * t * b[i]);
  return { d: `M${xy(a)} Q${xy(c)} ${xy(b)}`, points: Array.from({ length: n }, (_, k) => at((k + 1) / (n + 1))) };
}
const pole = (u, v, h) => box(u - 0.025, v - 0.025, u + 0.025, v + 0.025, 0, h, WOOD_DARK) + dot(...P(u, v, h + 1.2), 1.4, '#F2C04B');
function garlandFrame(site, level) {
  const g = garlandGeo(site, level);
  return frameOf([g.high, ...g.poles.map(p => p.top), ...g.poles.map(p => p.base)], 10);
}
function garland(site, level, n, hang, rope = '#5A4632') {
  const g = garlandGeo(site, level);
  let out = g.poles.map(p => pole(p.u, p.v, g.poleH)).join('') + (g.backPole ? pole(g.backPole[0], g.backPole[1], 44) : '');
  g.poles.forEach((p, side) => {
    const { d, points } = chain(g.high, p.top, 12 + half(level) * 6, n);
    out += `<path d="${d}" fill="none" stroke="${rope}" stroke-width="0.7"/>`;
    points.forEach((pt, k) => { out += hang(pt, k + side * n); });
  });
  return out;
}
// Lampion de papier pendu en (x, y)
const LAMPION_COLORS = ['#E2463A', '#F08A3A', '#F2C04B', '#C94FA0', '#E2463A'];
function lampion([x, y], k) {
  const c = LAMPION_COLORS[k % LAMPION_COLORS.length];
  return ln([x, y], [x, y + 2], '#5A4632', 0.5)
    + ell(x, y + 5.4, 2.7, 3.3, c, ' stroke="rgba(80,30,20,.45)" stroke-width="0.4"')
    + ln([x, y + 2.3], [x, y + 8.5], 'rgba(80,30,20,.35)', 0.4)
    + `<rect x="${f2(x - 1.3)}" y="${f2(y + 1.7)}" width="2.6" height="0.9" fill="#3A2A1E"/><rect x="${f2(x - 1.3)}" y="${f2(y + 8.3)}" width="2.6" height="0.9" fill="#3A2A1E"/>`
    + ell(x - 0.9, y + 4.4, 0.8, 1.4, 'rgba(255,240,200,.55)');
}
// Fanion triangulaire pendu en (x, y)
const PENNANT_COLORS = ['#E2463A', '#FFFFFF', '#2F6FB0', '#F2C04B'];
const pennant = ([x, y], k) => poly([[x - 2.6, y - 0.4], [x + 2.6, y + 0.4], [x + 0.2, y + 7]], PENNANT_COLORS[k % PENNANT_COLORS.length], ' stroke="rgba(40,30,20,.35)" stroke-width="0.4" stroke-linejoin="round"');

/* ---------- Petites bêtes et particules ---------- */
function butterfly(color, s = 1.5) {
  return (T, level, f) => {
    const w = (f === 0 ? 3.2 : 1.3) * s;
    const edge = ' stroke="rgba(60,40,30,.55)" stroke-width="0.4"';
    return ell(-w * 0.75, -1.4 * s, w, 2.2 * s, color, edge) + ell(w * 0.75, -1.4 * s, w, 2.2 * s, color, edge)
      + ell(-w * 0.55, 0.9 * s, w * 0.7, 1.3 * s, color, ' opacity=".85"') + ell(w * 0.55, 0.9 * s, w * 0.7, 1.3 * s, color, ' opacity=".85"')
      + dot(-w * 0.8, -1.6 * s, 0.6 * s, 'rgba(255,255,255,.7)') + dot(w * 0.8, -1.6 * s, 0.6 * s, 'rgba(255,255,255,.7)')
      + ln([0, -2.4 * s], [0, 2 * s], '#3A2A1E', 0.8);
  };
}
function gull(T, level, f) {
  const up = f === 0;
  const y = up ? -3.6 : 1.6;
  const d = `M-9,${f2(y)} Q-4.5,${f2(up ? -4.6 : -0.6)} 0,0 Q4.5,${f2(up ? -4.6 : -0.6)} 9,${f2(y)}`;
  return `<path d="${d}" fill="none" stroke="#5A6878" stroke-width="2.8" stroke-linecap="round"/>`
    + `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>`
    + ell(0, 0.4, 2.2, 1.4, '#FFFFFF', ' stroke="#5A6878" stroke-width="0.4"') + dot(1.9, 0.3, 0.6, '#F2A23C');
}
function dragonfly(T, level, f) {
  const w = f === 0 ? 4.2 : 2.6;
  return ell(-w * 0.6, -0.8, w * 0.6, 1, 'rgba(200,240,255,.75)', ' stroke="rgba(80,140,170,.6)" stroke-width="0.3"')
    + ell(w * 0.6, -0.8, w * 0.6, 1, 'rgba(200,240,255,.75)', ' stroke="rgba(80,140,170,.6)" stroke-width="0.3"')
    + ln([-0.2, -1.6], [0.6, 3.4], '#2F8FA8', 1.2) + dot(-0.3, -1.8, 0.9, '#1F6F86');
}
const bee = (T, level, f) => ell(0, 0, 2.3, 1.6, '#F2C04B', ' stroke="#3A2A1E" stroke-width="0.4"') + ln([-0.4, -1.4], [-0.4, 1.4], '#3A2A1E', 0.8) + ln([0.8, -1.4], [0.8, 1.4], '#3A2A1E', 0.8)
  + ell(-0.3, -2.1, f === 0 ? 1.7 : 0.8, 1, 'rgba(255,255,255,.9)');
const glowDot = (core, halo, s = 1) => () => dot(0, 0, 2.6 * s, halo) + dot(0, 0, 1.1 * s, core);
const petal = (k) => () => ell(0, 0, 2.8, 1.5, k % 2 ? '#F7B6CC' : '#FCD3E1', ` transform="rotate(${(k * 47) % 180})" stroke="rgba(200,110,140,.45)" stroke-width="0.3"`);

// Lucioles du lierre : six petites lueurs qui flânent autour du bâtiment (même trajet pour l'image et la lueur)
function fireflyAt(k, t, level) {
  const h = half(level);
  const [, cy] = crestOf('foyer', level);
  const x = Math.sin(t * 0.37 + k * 1.9) * 54 * h + Math.sin(t * 1.3 + k) * 5;
  const y = -12 - (k % 3) * Math.min(18, -cy / 5) + Math.cos(t * 0.53 + k * 2.3) * 8 + Math.cos(t * 0.37 + k * 1.9) * 10 * h;
  return [x, y];
}
const fireflyBlink = (k, t) => 0.55 + 0.45 * Math.sin(t * 2.1 + k * 1.7);

/* ---------- Potager ---------- */
const BUTTERFLY_COLORS = ['#F28AB2', '#FFD45E', '#6FB7E6', '#FFFFFF', '#B9A0F0', '#F08A3A', '#F7A8C8'];
// Rosier en fleurs posé au coin droit de l'emprise
function roseBush(T) {
  const [x, y] = T.p(0, 0, 0);
  const colors = ['#F28AB2', '#FFFFFF', '#E2574C', '#F7A8C8', '#FFD45E'];
  let out = T.shadow(0, 0, 0.22) + ell(x, y - 6, 10, 7, '#4F8F3A') + ell(x - 4, y - 8, 6.5, 5, '#6DB04F') + ell(x + 4, y - 9, 6, 4.5, '#7EC45B') + ell(x - 1, y - 12, 5, 3.6, '#8FCB6B');
  for (let i = 0; i < 9; i++) {
    const fx = x + (rand(i) - 0.5) * 16;
    const fy = y - 4 - rand(i + 20) * 10;
    out += dot(fx, fy, 1.7, colors[i % colors.length]) + dot(fx, fy, 0.6, '#FFF4C0');
  }
  return out;
}
const papillons = {
  layers: [
    { at: [0.95, -0.95], frame: [-13, -22, 26, 26], draw: roseBush },
    ...BUTTERFLY_COLORS.map((color, k) => mover(8, butterfly(color), (t, level) => {
      const h = half(level);
      const [, cy] = crestOf('potager', level);
      return [Math.sin(t * 0.45 + k * 1.3) * 52 * h + Math.sin(t * 1.7 + k) * 5, cy * (0.25 + (k % 3) * 0.22) - 6 * Math.sin(t * 0.9 + k * 2) + Math.cos(t * 0.45 + k * 1.3) * 12 * h];
    }, 2, 7 + k))
  ]
};

const SUNFLOWERS = [[-1, -0.62], [-1, -0.1], [-0.62, -1], [-0.1, -1], [-0.98, -0.98]];
function sunflower(x, y, h, s) {
  const top = y - h;
  let out = ln([x, y], [x + 1, top], '#4F8F3A', 1.5)
    + `<path d="M${f2(x + 0.4)},${f2(y - h * 0.4)} q-6,-3 -8,1 q5,2 8,-1 Z" fill="#6DB04F"/><path d="M${f2(x + 0.7)},${f2(y - h * 0.62)} q6,-3 8,1 q-5,2 -8,-1 Z" fill="#7EC45B"/>`;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    out += ell(x + 1 + Math.cos(a) * 4.6 * s, top + Math.sin(a) * 4.2 * s, 2.2 * s, 1.1 * s, i % 2 ? '#F2C04B' : '#FFD45E', ` transform="rotate(${f2((a * 180) / Math.PI)} ${f2(x + 1 + Math.cos(a) * 4.6 * s)} ${f2(top + Math.sin(a) * 4.2 * s)})"`);
  }
  out += dot(x + 1, top, 3.3 * s, '#7A4E2C') + dot(x + 0.4, top - 0.6, 1.6 * s, '#9A6A3C');
  return out;
}
const tournesols = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: level => frameOf(SUNFLOWERS.flatMap(([u, v]) => { const [x, y] = P(u * half(level), v * half(level)); return [[x, y], [x, y - (level >= 4 ? 50 : 38)]]; }), 12),
      draw: (T, level) => SUNFLOWERS.map(([u, v], k) => sunflower(...P(u * half(level), v * half(level)), (level >= 4 ? 40 : 30) + (k % 2) * 6, level >= 4 ? 1.2 : 1)).join('')
    },
    ...[0, 1].map(k => mover(4, bee, (t, level) => {
      const h = half(level);
      return [-30 * h + Math.sin(t * 1.1 + k * 3) * 22 * h + Math.sin(t * 6 + k) * 1.5, -24 * h - 10 + Math.cos(t * 0.9 + k * 2) * 8];
    }, 2, 14))
  ]
};

/* ---------- Carrière ---------- */
// Roche sombre veinée d'or, posée en (x, y) écran
function oreRock(x, y, s, k) {
  let out = `<path d="M${f2(x - 9 * s)},${f2(y)} L${f2(x - 7 * s)},${f2(y - 7 * s)} L${f2(x - 1 * s)},${f2(y - 11 * s)} L${f2(x + 6 * s)},${f2(y - 8 * s)} L${f2(x + 9 * s)},${f2(y)} Z" fill="#6E6A66" stroke="rgba(40,30,25,.4)" stroke-width="0.6" stroke-linejoin="round"/>`
    + `<path d="M${f2(x - 1 * s)},${f2(y - 11 * s)} L${f2(x + 6 * s)},${f2(y - 8 * s)} L${f2(x + 9 * s)},${f2(y)} L${f2(x + 1 * s)},${f2(y)} Z" fill="#4F4B48"/>`
    + `<polyline points="${xy([x - 6 * s, y - 2 * s])} ${xy([x - 3 * s, y - 6 * s])} ${xy([x, y - 4 * s])} ${xy([x + 4 * s, y - 8 * s])}" fill="none" stroke="#F2C04B" stroke-width="${f2(1.1 * s)}" stroke-linejoin="round"/>`;
  for (let i = 0; i < 3; i++) out += dot(x + (rand(k * 5 + i) - 0.5) * 12 * s, y - (2 + rand(k * 5 + i + 9) * 6) * s, 1 * s, '#FFE08A');
  return out;
}
// Éclats d'or : sept points répartis sur la masse du bâtiment, entre le sol et la crête
const GLINTS = [[-0.42, 0.3], [0.36, 0.22], [0.06, 0.55], [-0.2, 0.78], [0.45, 0.62], [-0.55, 0.62], [0.12, 0.08]];
const glintAt = (k, level) => {
  const [cx, cy] = crestOf('carriere', level);
  const [fx, fy] = GLINTS[k];
  return [cx * 0.4 + fx * 52 * half(level), cy * (1 - fy) - 6 * fy];
};
const filonOr = {
  layers: [
    {
      at: [0.9, -0.9],
      frame: [-20, -22, 40, 26],
      draw: T => {
        const [x, y] = T.p(0, 0, 0);
        let out = T.shadow(0, 0, 0.3) + oreRock(x - 7, y + 1, 1, 1) + oreRock(x + 7, y + 2, 0.8, 2);
        for (let i = 0; i < 9; i++) out += ell(x - 5 + (i % 4) * 3.4, y - 1 - Math.floor(i / 4) * 2.6, 2.2, 1.6, i % 2 ? '#F2C04B' : '#FFE08A', ' stroke="#A8782A" stroke-width="0.4"');
        return out + sparkle(x + 1, y - 10, 3, '#FFF6C8');
      }
    },
    ...GLINTS.map((_, k) => ({
      at: [0, 0],
      n: 4,
      fps: 5,
      frame: level => { const [x, y] = glintAt(k, level); return [Math.floor(x - 8), Math.floor(y - 8), 16, 16]; },
      draw: (T, level, f, n) => {
        const [x, y] = glintAt(k, level);
        const phase = Math.sin((((f + k) % n) / n) * Math.PI);
        return dot(x, y, 2.4 * phase + 0.4, 'rgba(255,214,90,.45)') + sparkle(x, y, 2 + 4.5 * phase, '#FFF2B0', 0.45 + 0.55 * phase);
      }
    }))
  ],
  lights: level => { const [cx, cy] = crestOf('carriere', level); return [[cx * 0.3, cy * 0.45, 24, '255,210,90', 0.55]]; }
};

const CRACKS = [
  [[-1, 0.55], [-0.82, 0.38], [-0.86, 0.18], [-0.66, 0.02], [-0.7, -0.2]],
  [[0.55, -1], [0.38, -0.84], [0.2, -0.88], [0.04, -0.68], [-0.18, -0.72]],
  [[-0.98, -0.98], [-0.8, -0.82], [-0.82, -0.62]]
];
const LAVA_POOL = [0.86, -0.5];
const crackPath = (crack, level) => crack.map(([u, v]) => xy(P(u * half(level), v * half(level)))).join(' ');
const lavaBubble = (T, level, f, n) => {
  const [x, y] = T.p(0, 0, 0);
  let out = '';
  for (let k = 0; k < 3; k++) {
    const p = ((f + k * 1.4) % n) / n;
    out += dot(x - 5 + k * 5, y - 1 - p * 4, 0.6 + p * 1.4, `rgba(255,220,120,${f2(1 - p)})`);
  }
  return out;
};
const coeurLave = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: level => frameOf([...CRACKS.flat(), [LAVA_POOL[0] + 0.3, LAVA_POOL[1]], [LAVA_POOL[0] - 0.3, LAVA_POOL[1]], [LAVA_POOL[0], LAVA_POOL[1] + 0.3], [LAVA_POOL[0], LAVA_POOL[1] - 0.3]].map(([u, v]) => P(u * half(level), v * half(level))), 6),
      draw: (T, level) => {
        const h = half(level);
        const [pu, pv] = [LAVA_POOL[0] * h, LAVA_POOL[1] * h];
        return CRACKS.map(crack => {
          const pts = crackPath(crack, level);
          return `<polyline points="${pts}" fill="none" stroke="#3A1A10" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`
            + `<polyline points="${pts}" fill="none" stroke="#FF7A2A" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`
            + `<polyline points="${pts}" fill="none" stroke="#FFD45E" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>`;
        }).join('')
          + disc(pu, pv, 0, 0.27, '#3A2620') + disc(pu, pv, 0.5, 0.22, '#E2501F') + disc(pu - 0.03, pv - 0.02, 0.8, 0.14, '#FF9A3A') + disc(pu - 0.05, pv - 0.03, 1, 0.07, '#FFD45E');
      }
    },
    { at: LAVA_POOL, n: 6, fps: 6, frame: [-12, -10, 24, 13], draw: lavaBubble },
    ...[0, 1, 2].map(k => mover(3, glowDot('#FFE08A', 'rgba(255,120,40,.55)'), (t, level) => {
      const [x, y] = P(LAVA_POOL[0] * half(level), LAVA_POOL[1] * half(level));
      const p = (t * 0.3 + k / 3) % 1;
      return [x + Math.sin(t * 2 + k * 2) * 4 + (k - 1) * 4, y - 4 - p * 34];
    }))
  ],
  lights: level => {
    const h = half(level);
    const [px, py] = P(LAVA_POOL[0] * h, LAVA_POOL[1] * h);
    const [lx, ly] = P(-0.8 * h, 0.2 * h);
    return [[px, py - 3, 26, '255,110,40', 1], [lx, ly, 16, '255,120,50', 0.7]];
  }
};

/* ---------- Bosquet ---------- */
// Lanternes des fées : pendues au houppier, autour de la crête
const FAIRY = [[-30, 20], [-12, 32], [14, 26], [32, 16], [-22, 46], [24, 42]];
const fairyAt = (k, level) => {
  const [cx, cy] = crestOf('bosquet', level);
  const h = half(level);
  return [cx + FAIRY[k][0] * h, cy + FAIRY[k][1] * h];
};
const fairyLantern = ([x, y]) => ln([x, y - 10], [x, y - 3.6], 'rgba(60,50,70,.7)', 0.6)
  + `<path d="M${f2(x - 2.6)},${f2(y - 3.6)} L${f2(x + 2.6)},${f2(y - 3.6)} L${f2(x + 2)},${f2(y + 3.4)} L${f2(x - 2)},${f2(y + 3.4)} Z" fill="#E6DCFF" stroke="#4A3A66" stroke-width="0.6" stroke-linejoin="round"/>`
  + dot(x, y, 1.6, '#FFFFFF') + `<path d="M${f2(x - 3.1)},${f2(y - 3.6)} L${f2(x)},${f2(y - 6)} L${f2(x + 3.1)},${f2(y - 3.6)} Z" fill="#4A3A66"/>`;
const MUSHROOMS = [[-0.92, 0.82], [-0.78, 0.94], [-0.96, 0.62], [-0.66, 0.84], [-0.84, 0.7]];
// Trois fées : une lueur aux ailes de verre qui tourne autour du houppier
const fairyAt3 = (k, t, level) => {
  const h = half(level);
  const [cx, cy] = crestOf('bosquet', level);
  const a = t * (0.5 + k * 0.12) + k * 2.1;
  return [cx + Math.cos(a) * (36 + k * 6) * h, cy + 34 * h + Math.sin(a) * 14 * h + Math.sin(t * 2.3 + k) * 3];
};
const fairy = (T, level, f) => {
  const w = f === 0 ? 3 : 1.6;
  return ell(-w, -1.2, w, 1.8, 'rgba(225,240,255,.8)', ' stroke="rgba(120,140,200,.6)" stroke-width="0.3"') + ell(w, -1.2, w, 1.8, 'rgba(225,240,255,.8)', ' stroke="rgba(120,140,200,.6)" stroke-width="0.3"')
    + dot(0, 0, 2.6, 'rgba(200,170,255,.55)') + dot(0, 0, 1.2, '#FFFFFF');
};
function mushroom(x, y, s, k) {
  const cap = k % 2 ? '#B9A0F0' : '#9FD3F2';
  return ln([x, y], [x, y - 4 * s], '#F4EEDC', 1.6 * s)
    + `<path d="M${f2(x - 3.6 * s)},${f2(y - 3.6 * s)} Q${f2(x)},${f2(y - 9 * s)} ${f2(x + 3.6 * s)},${f2(y - 3.6 * s)} Z" fill="${cap}" stroke="rgba(60,40,90,.4)" stroke-width="0.4"/>`
    + dot(x - 1.2 * s, y - 5.6 * s, 0.6 * s, '#FFFFFF') + dot(x + 1.4 * s, y - 5 * s, 0.5 * s, '#FFFFFF');
}
const fees = {
  layers: [
    {
      at: [0, 0],
      frame: level => frameOf(MUSHROOMS.map(([u, v]) => P(u * half(level), v * half(level))).flatMap(([x, y]) => [[x, y - 12], [x, y + 2]]), 6),
      draw: (T, level) => MUSHROOMS.map(([u, v], k) => mushroom(...P(u * half(level), v * half(level)), (level >= 4 ? 1.2 : 1) * (k % 3 ? 0.85 : 1.1), k)).join('')
    },
    {
      at: [0, 0],
      frame: level => frameOf(FAIRY.map((_, k) => fairyAt(k, level)).flatMap(([x, y]) => [[x, y - 11], [x, y + 4]]), 4),
      draw: (T, level) => FAIRY.map((_, k) => fairyLantern(fairyAt(k, level))).join(''),
      motion: t => [Math.sin(t * 1.2) * 0.008, -Math.sin(t * 1.2) * 0.008, 0]
    },
    ...[0, 1, 2].map(k => mover(5, fairy, (t, level) => fairyAt3(k, t, level), 2, 9))
  ],
  lights: (level, t) => [
    ...FAIRY.map((_, k) => [...fairyAt(k, level), 10, '205,175,255', 0.85]),
    ...[0, 1, 2].map(k => [...fairyAt3(k, t, level), 9, '225,215,255', 0.8]),
    [...P(-0.84 * half(level), 0.8 * half(level)), 14, '150,230,255', 0.7]
  ]
};

// Tapis de pétales au sol, en anneau autour du bâtiment : la moitié arrière (derrière lui) ou avant (devant)
function petalCarpet(level, front) {
  const h = half(level);
  let out = '';
  for (let k = 0; k < 40; k++) {
    const a = rand(k) * Math.PI * 2;
    const r = 0.6 + rand(k + 40) * 0.4;
    const u = Math.cos(a) * r * h;
    const v = Math.sin(a) * r * h;
    if ((u + v > 0) !== front) continue;
    const [x, y] = P(u, v);
    out += ell(x, y, 2.6, 1.2, k % 3 ? '#F7B6CC' : '#FCD3E1', ` transform="rotate(${Math.round(rand(k + 80) * 180)} ${f2(x)} ${f2(y)})" stroke="rgba(200,110,140,.3)" stroke-width="0.3"`);
  }
  return out;
}
const footprintFrame = level => frameOf([P(-1, -1), P(1, -1), P(1, 1), P(-1, 1)].map(([x, y]) => [x * half(level), y * half(level)]), 4);
const petales = {
  layers: [
    { at: [0, 0], back: true, frame: footprintFrame, draw: (T, level) => petalCarpet(level, false) },
    { at: [0, 0], frame: footprintFrame, draw: (T, level) => petalCarpet(level, true) },
    ...Array.from({ length: 12 }, (_, k) => mover(4, petal(k), (t, level) => {
      const h = half(level);
      const [cx, cy] = crestOf('bosquet', level);
      const p = (t * 0.11 + k / 12) % 1;
      const x0 = cx + (rand(k + 7) - 0.5) * 80 * h;
      return [x0 + Math.sin(t * 1.3 + k) * 6 + p * 10, cy + 18 + p * (-cy - 4 + (rand(k + 3) - 0.3) * 20 * h)];
    }))
  ]
};

/* ---------- Puits ---------- */
const RAINBOW = ['#E2463A', '#F08A3A', '#F2C04B', '#7EC45B', '#5AAED7', '#5C6FC2', '#9C6FD0'];
const rainbowGeo = level => {
  const [, cy] = crestOf('puits', level);
  const h = half(level);
  return { rx: 62 * h, ry: Math.max(-cy + 22, 56 * h), base: -6 * h };
};
const arcEnCiel = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: level => { const g = rainbowGeo(level); return frameOf([[-g.rx, g.base], [g.rx, g.base], [0, g.base - g.ry]], 6); },
      draw: (T, level) => {
        const g = rainbowGeo(level);
        const w = 2.4 * half(level);
        return RAINBOW.map((c, i) => {
          const rx = g.rx - i * w;
          const ry = g.ry - i * w;
          return `<path d="M${f2(-rx)},${f2(g.base)} A${f2(rx)},${f2(ry)} 0 0 1 ${f2(rx)},${f2(g.base)}" fill="none" stroke="${c}" stroke-width="${f2(w + 0.2)}" opacity=".62"/>`;
        }).join('');
      }
    },
    ...[0, 1, 2].map(k => ({
      at: [0, 0],
      n: 4,
      fps: 4,
      frame: level => { const g = rainbowGeo(level); const [x, y] = [[-g.rx, g.base - 2], [g.rx, g.base - 2], [g.rx * 0.5, g.base - g.ry * 0.87]][k]; return [Math.floor(x - 7), Math.floor(y - 7), 14, 14]; },
      draw: (T, level, f, n) => {
        const g = rainbowGeo(level);
        const [x, y] = [[-g.rx, g.base - 2], [g.rx, g.base - 2], [g.rx * 0.5, g.base - g.ry * 0.87]][k];
        const p = Math.sin((((f + k) % n) / n) * Math.PI);
        return sparkle(x, y, 2 + 3.5 * p, '#FFFFFF', 0.4 + 0.6 * p);
      }
    }))
  ]
};

const POND = [1, -1];
const nenuphars = {
  layers: [
    {
      at: POND,
      back: true,
      frame: [-26, -14, 52, 28],
      draw: T => {
        const pad = (du, dv, s) => { const [x, y] = T.p(du, dv, 0.6); return `<path d="M${f2(x)},${f2(y)} L${f2(x + 3.4 * s)},${f2(y - 1.2 * s)} A${f2(3.6 * s)},${f2(1.9 * s)} 0 1 1 ${f2(x + 3.4 * s)},${f2(y + 1.2 * s)} Z" fill="#6DB04F" stroke="#4F8F3A" stroke-width="0.4"/>`; };
        const lotus = (du, dv) => { const [x, y] = T.p(du, dv, 1.2); return ell(x - 1.4, y - 1, 1.3, 2.1, '#F7A8C8', ' transform="rotate(-25 ' + f2(x - 1.4) + ' ' + f2(y - 1) + ')"') + ell(x + 1.4, y - 1, 1.3, 2.1, '#F7A8C8', ' transform="rotate(25 ' + f2(x + 1.4) + ' ' + f2(y - 1) + ')"') + ell(x, y - 1.6, 1.2, 2.3, '#FCD3E1') + dot(x, y - 0.4, 0.8, '#FFD45E'); };
        return T.disc(0, 0, 0, 0.36, '#B9B2A2') + T.disc(0, 0, 0.3, 0.32, '#5AAED7') + T.disc(-0.04, -0.03, 0.4, 0.2, '#86C6E6')
          + pad(-0.14, 0.08, 1) + pad(0.12, -0.12, 0.9) + pad(0.06, 0.16, 0.8) + pad(-0.18, -0.12, 0.75)
          + lotus(-0.1, 0.06) + lotus(0.14, -0.1);
      }
    },
    ...[0, 1].map(k => mover(6, dragonfly, (t, level) => {
      const [x, y] = P(POND[0] * half(level), POND[1] * half(level));
      return [x + Math.sin(t * (0.8 + k * 0.3) + k * 3) * 16 + Math.sin(t * 3.1 + k) * 2, y - 10 - k * 5 + Math.cos(t * (0.9 + k * 0.2) + k) * 5];
    }, 2, 16))
  ]
};

/* ---------- Ponton ---------- */
const pavois = {
  layers: [{
    at: [0, 0],
    frame: level => garlandFrame('ponton', level),
    draw: (T, level) => garland('ponton', level, 7, pennant, '#3A2A1E'),
    motion: t => [Math.sin(t * 2.2) * 0.006, -Math.sin(t * 2.2) * 0.006, Math.sin(t * 1.7) * 0.5]
  }]
};

// Mouette posée sur la crête (au repos, elle tourne la tête de temps en temps), trois autres qui tournent au-dessus
const perchedGull = (T, level, f) => {
  const [x, y] = crestOf('ponton', level);
  const look = f === 3 ? -1 : 1;
  return ell(x, y - 3.2, 3.4, 2.2, '#FFFFFF', ' stroke="rgba(70,80,95,.5)" stroke-width="0.4"')
    + `<path d="M${f2(x - 3)},${f2(y - 3.6)} Q${f2(x - 0.5)},${f2(y - 5.6)} ${f2(x + 1.8)},${f2(y - 3.4)} Z" fill="#B8C2CC"/>`
    + dot(x + 2.4 * look, y - 5.6, 1.6, '#FFFFFF') + dot(x + 2.9 * look, y - 5.9, 0.4, '#2A2A2A')
    + poly([[x + 3.8 * look, y - 5.8], [x + 5.6 * look, y - 5.4], [x + 3.8 * look, y - 5.1]], '#F2A23C')
    + ln([x - 0.6, y - 1.2], [x - 0.6, y + 0.4], '#F2A23C', 0.5) + ln([x + 0.8, y - 1.2], [x + 0.8, y + 0.4], '#F2A23C', 0.5);
};
const mouettes = {
  layers: [
    {
      at: [0, 0],
      n: 4,
      fps: 0.7,
      frame: level => { const [x, y] = crestOf('ponton', level); return [Math.floor(x - 8), Math.floor(y - 10), 16, 12]; },
      draw: perchedGull
    },
    ...[0, 1, 2].map(k => mover(11, gull, (t, level) => {
      const h = half(level);
      const [cx, cy] = crestOf('ponton', level);
      const a = t * (0.42 + k * 0.07) + k * 2.1;
      return [cx + Math.cos(a) * (34 + k * 8) * h, cy - 22 - k * 6 + Math.sin(a) * 10 * h];
    }, 2, 5 + k))
  ]
};

/* ---------- Atelier ---------- */
const chimneyAt = level => P(...FORGE_CHIMNEYS[Math.max(1, Math.min(level, 7)) - 1]);
const sparks = (T, level, f, n) => {
  const [x, y] = chimneyAt(level);
  let out = dot(x, y - 1, 4, 'rgba(255,170,60,.35)') + dot(x, y - 1, 2, 'rgba(255,230,150,.7)');
  for (let k = 0; k < 16; k++) {
    const p = ((f / n) + k / 16) % 1;
    const vx = (rand(k) - 0.5) * 46;
    const up = 38 + rand(k + 9) * 14;
    const at = q => [x + vx * q, y - up * q + 34 * q * q];
    const [sx, sy] = at(p);
    const [tx, ty] = at(Math.max(0, p - 0.06));
    out += ln([tx, ty], [sx, sy], p < 0.45 ? '#FFE08A' : '#F08A3A', 1.5 * (1 - p) + 0.5) + dot(sx, sy, 0.9 * (1 - p) + 0.4, '#FFF6D0');
  }
  return out;
};
const etincelles = {
  layers: [{
    at: [0, 0],
    n: 6,
    fps: 10,
    frame: level => { const [x, y] = chimneyAt(level); return [Math.floor(x - 28), Math.floor(y - 30), 56, 40]; },
    draw: sparks
  }],
  lights: level => { const [x, y] = chimneyAt(level); return [[x, y - 6, 18, '255,170,60', 1]]; }
};

// Engrenages d'or sur la crête : un grand qui tourne, un petit qui lui répond, sur un mât
function gearPath(x, y, r, teeth, turn) {
  const pts = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = turn + (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r : r * 1.22;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.92]);
  }
  return `<polygon points="${pts.map(xy).join(' ')}" fill="#F2C04B" stroke="#A8782A" stroke-width="0.6" stroke-linejoin="round"/>`
    + dot(x, y, r * 0.55, '#FFE08A') + dot(x, y, r * 0.22, '#A8782A');
}
const gears = (T, level, f, n) => {
  const [x, y] = crestOf('atelier', level);
  const turn = (f / n) * ((Math.PI * 2) / 10);
  return ln([x, y], [x, y - 12], '#5A4632', 1.4)
    + gearPath(x, y - 21, 10, 10, turn)
    + gearPath(x + 15, y - 16.4, 5.6, 6, -turn * (10 / 6) + 0.3);
};
const engrenages = {
  layers: [{
    at: [0, 0],
    n: 6,
    fps: 6,
    frame: level => { const [x, y] = crestOf('atelier', level); return [Math.floor(x - 15), Math.floor(y - 35), 38, 37]; },
    draw: gears
  }],
  lights: level => { const [x, y] = crestOf('atelier', level); return [[x + 4, y - 20, 14, '255,215,120', 0.5]]; }
};

/* ---------- Foyer ---------- */
const lampions = {
  layers: [{
    at: [0, 0],
    frame: level => garlandFrame('foyer', level),
    draw: (T, level) => garland('foyer', level, 5, lampion),
    motion: t => [0, 0, Math.sin(t * 1.6) * 0.6]
  }],
  lights: level => {
    const g = garlandGeo('foyer', level);
    return [g.high, ...g.poles.map(p => chain(g.high, p.top, 12 + half(level) * 6, 5).points[2])].map(([x, y]) => [x, y + 5, 16, '255,150,80', 0.9]);
  }
};

// Treillis de bois couvert de lierre, debout au coin droit (plan v constant, de u0 à u1), haut de hz
const TRELLIS = { v: -0.94, u0: 0.42, u1: 0.98 };
function ivyTrellis(level) {
  const h = half(level);
  const { v, u0, u1 } = { v: TRELLIS.v * h, u0: TRELLIS.u0 * h, u1: TRELLIS.u1 * h };
  const hz = level >= 4 ? 40 : 30;
  let out = box(u0 - 0.03, v - 0.03, u0 + 0.03, v + 0.03, 0, hz, WOOD_DARK) + box(u1 - 0.03, v - 0.03, u1 + 0.03, v + 0.03, 0, hz, WOOD_DARK);
  // Lattes en losanges
  for (let i = 0; i <= 4; i++) {
    const a = u0 + ((u1 - u0) * i) / 4;
    out += ln(P(a, v, 0), P(Math.min(u1, a + (u1 - u0) / 2), v, hz * Math.min(1, ((u1 - a) / (u1 - u0)) * 2)), '#A9703F', 0.9)
      + ln(P(a, v, 0), P(Math.max(u0, a - (u1 - u0) / 2), v, hz * Math.min(1, ((a - u0) / (u1 - u0)) * 2)), '#A9703F', 0.9);
  }
  out += ln(P(u0, v, hz), P(u1, v, hz), '#8B5631', 1.4);
  // Lierre : dense en bas, plus clair vers le haut, quelques brins qui pendent
  for (let i = 0; i < 34; i++) {
    const t = rand(i);
    const z = hz * Math.pow(rand(i + 50), 0.8);
    const [x, y] = P(u0 + (u1 - u0) * t, v, z);
    out += ell(x, y, 2.6, 1.9, ['#3E7A30', '#4F8F3A', '#6DB04F'][i % 3], ` transform="rotate(${Math.round(rand(i + 9) * 60 - 30)} ${f2(x)} ${f2(y)})"`);
  }
  for (let i = 0; i < 4; i++) {
    const [x, y] = P(u0 + (u1 - u0) * (0.15 + i * 0.24), v, hz);
    out += `<path d="M${f2(x)},${f2(y)} q1.5,5 -0.5,${f2(7 + rand(i) * 6)}" fill="none" stroke="#3E7A30" stroke-width="0.8"/>` + ell(x - 0.3, y + 7 + rand(i) * 5, 1.6, 1.2, '#4F8F3A');
  }
  return out;
}
const lierre = {
  layers: [
    {
      at: [0, 0],
      back: true,
      frame: level => { const h = half(level); const hz = level >= 4 ? 40 : 30; return frameOf([P(TRELLIS.u0 * h, TRELLIS.v * h, hz), P(TRELLIS.u1 * h, TRELLIS.v * h, hz), P(TRELLIS.u0 * h, TRELLIS.v * h, 0), P(TRELLIS.u1 * h, TRELLIS.v * h, 0)], 8); },
      draw: (T, level) => ivyTrellis(level)
    },
    ...Array.from({ length: 6 }, (_, k) => mover(4, glowDot('#FFFBD0', 'rgba(210,255,120,.65)', 1.4), (t, level) => fireflyAt(k, t, level)))
  ],
  lights: (level, t) => Array.from({ length: 6 }, (_, k) => [...fireflyAt(k, t, level), 8, '210,255,120', fireflyBlink(k, t)])
};

export const RARE_SPRITES = {
  papillons,
  tournesols,
  'filon-or': filonOr,
  'coeur-lave': coeurLave,
  fees,
  petales,
  'arc-en-ciel': arcEnCiel,
  nenuphars,
  pavois,
  mouettes,
  etincelles,
  engrenages,
  lampions,
  lierre
};

// Lueurs de nuit d'une pièce rare portée au palier, à l'instant t (secondes) : [x, y, rayon, « r,g,b », force]
export function rareLights(id, level, t = 0) {
  const rare = RARE_SPRITES[id];
  return rare && rare.lights ? rare.lights(level, t) : [];
}
