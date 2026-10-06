// Décor iso au trait de la troupe. Même projection que src/world/iso.js (losange 2:1, lumière en haut à gauche), à
// l'échelle de la troupe : une case fait 80 × 40 (le jeu : 64 × 32), le cadre d'un décor d'une case est PROP_BOX × 1,25.
// Ancre (0, 0) : centre de la case. z en pixels du jeu (× 1,25 à l'écran).
const { OUT, P, E, L, r2 } = require('./troupe');

const K = 1.25;
const TW = 64 * K, TH = 32 * K;
const PROP = [-40 * K, -92 * K, 80 * K, 112 * K];
const BUILDING = [-76 * K, -124 * K, 152 * K, 168 * K];
const BIG = [-112 * K, -200 * K, 224 * K, 264 * K];
const pt = (u, v, z = 0) => [((u - v) * TW) / 2, ((u + v) * TH) / 2 - z * K];

const LEAVES = { light: '#B3E386', mid: '#7EC45B', dark: '#4F8F3A' };
const PINE = { light: '#86C774', mid: '#4F9A4C', dark: '#2F6E3A' };
const WOOD = { top: '#E0A96C', left: '#BF8049', right: '#965C30' };
const WOOD_DARK = { top: '#A9703F', left: '#8B5631', right: '#6A3F22' };
const GRANITE = { top: '#CBC6BA', left: '#A6A094', right: '#7E786E' };

const poly = (points, fill, w = 0.9) => `<polygon points="${points.map(p => `${r2(p[0])},${r2(p[1])}`).join(' ')}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`;
const face = (pts3, fill, w) => poly(pts3.map(p => pt(...p)), fill, w);
const shadow = (u, v, r, a = 0.22) => { const [x, y] = pt(u, v); return E(x, y, r * TW * 0.55, r * TH * 0.55, `rgba(40,55,20,${a})`, 0); };
// Boîte droite (faces gauche, droite, dessus)
function box(u0, v0, u1, v1, z0, z1, c, w = 0.9) {
  return face([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]], c.left, w)
    + face([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]], c.right, w)
    + face([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]], c.top, w);
}
// Feuillage en deux passes : contour commun puis aplats, ombre en bas à droite, reflets en haut à gauche
function crown(blobs, c, id) {
  const out = blobs.map(([x, y, r]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r + 1.1)}" fill="${OUT}"/>`).join('');
  const base = blobs.map(([x, y, r]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${c.mid}"/>`).join('');
  const clipId = `cr${id}`;
  const clipPath = `<clipPath id="${clipId}">${blobs.map(([x, y, r]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}"/>`).join('')}</clipPath>`;
  const shade = blobs.map(([x, y, r]) => `<circle cx="${r2(x + r * 0.35)}" cy="${r2(y + r * 0.45)}" r="${r2(r * 0.85)}" fill="${c.dark}"/>`).join('');
  const lite = blobs.map(([x, y, r]) => `<circle cx="${r2(x - r * 0.25)}" cy="${r2(y - r * 0.3)}" r="${r2(r * 0.62)}" fill="${c.mid}"/>`).join('')
    + blobs.map(([x, y, r]) => `<circle cx="${r2(x - r * 0.4)}" cy="${r2(y - r * 0.45)}" r="${r2(r * 0.32)}" fill="${c.light}"/>`).join('');
  return out + base + `<defs>${clipPath}</defs><g clip-path="url(#${clipId})">${shade}${lite}</g>`;
}
// Tronc effilé (de la base vers le haut)
const trunk = (x, y, w, h, c) => `<path d="M${r2(x - w)},${r2(y)} Q${r2(x - w * 0.6)},${r2(y - h * 0.5)} ${r2(x - w * 0.45)},${r2(y - h)} L${r2(x + w * 0.45)},${r2(y - h)} Q${r2(x + w * 0.6)},${r2(y - h * 0.5)} ${r2(x + w)},${r2(y)} Q${x},${r2(y + w * 0.5)} ${r2(x - w)},${r2(y)} Z" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
  + `<path d="M${r2(x + w * 0.2)},${r2(y)} Q${r2(x + w * 0.35)},${r2(y - h * 0.5)} ${r2(x + w * 0.3)},${r2(y - h)} L${r2(x + w * 0.45)},${r2(y - h)} Q${r2(x + w * 0.6)},${r2(y - h * 0.5)} ${r2(x + w)},${r2(y)} Z" fill="${c.right}"/>`;
// Rocher arrondi et bosselé : silhouette douce, côté clair en haut à gauche, ombre en bas à droite, reflet
// (u, v : centre au sol ; ru, rv : demi-taille en cases ; h : hauteur ; seed : forme)
let rockN = 0;
function boulder(u, v, ru, rv, h, c, seed = 1) {
  const [x, y] = pt(u, v);
  const w = ru * TW * 0.78, d = rv * TH * 0.7, H = h * K;
  const j = k => 1 + 0.14 * Math.sin(seed * 12.9898 + k * 78.233);
  const path = `M${r2(x - w)},${r2(y)} Q${r2(x - w * 1.02)},${r2(y - H * 0.7 * j(1))} ${r2(x - w * 0.45)},${r2(y - H * j(2))} `
    + `Q${r2(x + w * 0.1)},${r2(y - H * 1.12 * j(3))} ${r2(x + w * 0.62)},${r2(y - H * 0.78 * j(4))} Q${r2(x + w * 1.04)},${r2(y - H * 0.42)} ${r2(x + w)},${r2(y)} `
    + `Q${x},${r2(y + d)} ${r2(x - w)},${r2(y)} Z`;
  const id = `rk${seed}_${rockN++}`;
  return `<path d="${path}" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<ellipse cx="${r2(x + w * 0.55)}" cy="${r2(y - H * 0.1)}" rx="${r2(w * 0.8)}" ry="${r2(H * 0.75)}" fill="${c.right}"/>`
    + `<ellipse cx="${r2(x - w * 0.25)}" cy="${r2(y - H * 0.95)}" rx="${r2(w * 0.7)}" ry="${r2(H * 0.38)}" fill="${c.top}"/>`
    + `</g><path d="M${r2(x - w * 0.6)},${r2(y - H * 0.7)} Q${r2(x - w * 0.35)},${r2(y - H * 0.98)} ${r2(x + w * 0.05)},${r2(y - H * 1.02)}" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>`;
}
const lichen = (u, v, z) => { const [x, y] = pt(u, v, z * 0.92); return E(x, y, 3.4, 1.6, '#B7C46C', 0.6) + E(x + 2.4, y + 0.6, 1.4, 0.8, '#B7C46C', 0.5); };
const flower = (x, y, r, petal, heart = '#E8A13A') => [0, 72, 144, 216, 288].map(a => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.78, r * 0.78, petal, 0.5)).join('') + E(x, y, r * 0.55, r * 0.55, heart, 0.4);
const stroke = (d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const thick = (d, w, color) => stroke(d, w + 2.2, OUT) + stroke(d, w, color);

// ——— Les décors naturels ———
const D = {};
D.tree = () => shadow(0, 0, 0.5) + trunk(0, 0, 4.4, 26, WOOD_DARK) + crown([[-12, -40, 13], [12, -42, 13.5], [0, -54, 15], [-2, -36, 12]], LEAVES, 'tr');
D.apple = () => D.tree().replace(/crtr/g, 'crap') + [[-10, -42], [6, -50], [13, -38], [-3, -34], [2, -56]].map(([x, y]) => E(x, y, 2.4, 2.4, '#E2574C', 0.8) + E(x - 0.7, y - 0.8, 0.7, 0.7, '#FFFFFF', 0)).join('');
D.autumn = () => shadow(0, 0, 0.5) + trunk(0, 0, 4.4, 26, WOOD_DARK) + crown([[-12, -40, 13], [12, -42, 13.5], [0, -54, 15], [-2, -36, 12]], { light: '#FFD27A', mid: '#F2994A', dark: '#C8622A' }, 'au')
  + [[-18, -4, 20], [14, -2, -30], [6, 3, 60]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P('M0,-2 Q1.4,0 0,2 Q-1.4,0 0,-2 Z', '#F2994A', 0.6)}</g>`).join('');
D.birch = () => {
  const t = `<path d="M-3.4,0 L-2.6,-34 L2.6,-34 L3.4,0 Q0,1.6 -3.4,0 Z" fill="#F4F1EA" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>` + [[-2.6, -6], [1, -12], [-2, -19], [1.4, -26]].map(([x, y]) => `<rect x="${x}" y="${y}" width="2.4" height="1" rx="0.5" fill="#3A3A3A"/>`).join('');
  return shadow(0, 0, 0.42) + t + crown([[-9, -46, 10], [9, -48, 10.5], [0, -58, 11], [0, -42, 9]], { light: '#D8F2A6', mid: '#A8D878', dark: '#6FAE4E' }, 'bi');
};
D.pine = () => {
  const tier = (y, w, h, k) => poly([[-w, y], [0, y - h], [w, y]], PINE.mid, 1.1) + `<path d="M${r2(w * 0.1)},${r2(y - h)} L${r2(w)},${r2(y)} L${r2(w * 0.2)},${r2(y)} Z" fill="${PINE.dark}"/>` + `<path d="M${r2(-w + 3)},${r2(y - 1)} L${r2(-w * 0.15)},${r2(y - h + 4)}" stroke="${PINE.light}" stroke-width="1.4" stroke-linecap="round"/>`;
  return shadow(0, 0, 0.4) + `<rect x="-2.6" y="-14" width="5.2" height="14" rx="1" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="1"/>` + tier(-10, 19, 27, 1) + tier(-25, 15, 25, 1) + tier(-39, 11, 22, 0);
};
// Sapin enneigé : chaque étage garde sa neige sur le haut de ses pentes (au-dessous de l'étage d'au-dessus), une frange
// de neige ourle le bas de chaque étage
D.snowpine = () => {
  const T = [[-10, 19, 27], [-25, 15, 25], [-39, 11, 22]];
  let s = shadow(0, 0, 0.4) + `<rect x="-2.6" y="-14" width="5.2" height="14" rx="1" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="1"/>`;
  T.forEach(([y, w, h], i) => {
    const top = y - h;
    s += poly([[-w, y], [0, top], [w, y]], PINE.mid, 1.1) + `<path d="M${r2(w * 0.1)},${r2(top)} L${r2(w)},${r2(y)} L${r2(w * 0.2)},${r2(y)} Z" fill="${PINE.dark}"/>`;
    const yc = i === T.length - 1 ? top + h * 0.42 : T[i + 1][0] + 5;
    const xc = (w * (yc - top)) / h;
    s += `<path d="M0,${r2(top)} L${r2(xc)},${r2(yc)} Q${r2(xc * 0.6)},${r2(yc - 3)} ${r2(xc * 0.3)},${r2(yc + 1)} Q0,${r2(yc - 2.6)} ${r2(-xc * 0.3)},${r2(yc + 1.2)} Q${r2(-xc * 0.62)},${r2(yc - 3)} ${r2(-xc)},${r2(yc)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
      + `<path d="M${r2(xc * 0.15)},${r2(top + 2)} L${r2(xc * 0.85)},${r2(yc - 1)}" stroke="#D6E4EE" stroke-width="1.2" stroke-linecap="round"/>`;
    s += thick(`M${r2(-w + 1.5)},${r2(y - 0.6)} q${r2(w * 0.25)},2 ${r2(w * 0.5)},0 q${r2(w * 0.25)},-2 ${r2(w * 0.5)},0.4 q${r2(w * 0.25)},2 ${r2(w * 0.5)},0 q${r2(w * 0.25)},-2 ${r2(w * 0.46)},-0.4`, 1.6, '#FFFFFF');
  });
  return s;
};
D.palm = () => {
  const tx = 10, ty = -62;
  const t = thick(`M-2,0 C-5,-24 2,-44 ${tx},${ty}`, 6, WOOD.left) + stroke(`M-2,0 C-5,-24 2,-44 ${tx},${ty}`, 6, WOOD.right).replace('stroke-linecap="round"', 'stroke-dasharray="1.8 4"');
  const frond = (dx, dy, c) => {
    const mx = tx + dx * 0.5, my = ty + dy * 0.5 - 10, len = Math.hypot(dx, dy) || 1, nx = (-dy / len) * 6, ny = (dx / len) * 6;
    return `<path d="M${tx},${ty} Q${r2(mx + nx)},${r2(my + ny)} ${tx + dx},${ty + dy} Q${r2(mx - nx)},${r2(my - ny)} ${tx},${ty} Z" fill="${c}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
      + `<path d="M${tx},${ty} Q${r2(mx)},${r2(my)} ${tx + dx},${ty + dy}" stroke="rgba(30,70,30,.4)" stroke-width="0.8" fill="none"/>`;
  };
  return shadow(0.1, 0, 0.4) + t + frond(-27, 5, PINE.dark) + frond(27, 7, PINE.dark) + frond(-19, 17, PINE.mid) + frond(20, 18, PINE.mid) + frond(-10, -15, LEAVES.mid) + frond(12, -14, LEAVES.light)
    + E(tx - 2.6, ty + 4, 3.2, 3.2, '#8A5A2B', 0.9) + E(tx + 3.6, ty + 5, 3.2, 3.2, '#6E4520', 0.9);
};
D.bush = () => shadow(0, 0, 0.42) + crown([[-9, -8, 10], [9, -8, 10.5], [0, -15, 11]], LEAVES, 'bu')
  + [[-6, -17, '#F27A9A'], [8, -12, '#F27A9A'], [1, -5, '#FFFFFF'], [-11, -6, '#FFFFFF']].map(([x, y, c]) => flower(x, y, 1.6, c)).join('');
D.rock = () => shadow(0, 0, 0.4) + boulder(0, 0, 0.3, 0.26, 15, GRANITE, 1) + lichen(-0.06, -0.08, 14) + boulder(-0.32, 0.26, 0.07, 0.06, 4, GRANITE, 7);
D.rocks = () => shadow(0, 0, 0.45) + boulder(-0.12, -0.1, 0.26, 0.22, 16, GRANITE, 2) + boulder(0.2, 0.14, 0.16, 0.14, 9, GRANITE, 3) + boulder(-0.26, 0.22, 0.1, 0.09, 5, GRANITE, 4) + lichen(-0.17, -0.16, 15);
D.crag = () => shadow(0, 0, 0.4) + boulder(0, 0, 0.27, 0.23, 33, GRANITE, 5) + boulder(0.22, 0.14, 0.13, 0.11, 10, GRANITE, 6) + boulder(-0.3, 0.2, 0.06, 0.05, 3, GRANITE, 8) + lichen(0.02, -0.06, 31);
D.mossy = () => shadow(0, 0, 0.42) + boulder(-0.06, -0.04, 0.26, 0.22, 14, { top: '#9CCB6A', left: '#A6A094', right: '#7E786E' }, 9) + boulder(0.22, 0.16, 0.12, 0.1, 7, { top: '#9CCB6A', left: '#A6A094', right: '#7E786E' }, 10)
  + [[-8, -16], [-2, -19], [6, -17]].map(([x, y]) => E(x, y, 2, 1, '#6FAE4E', 0)).join('') + flower(4, -18, 1.1, '#FFFFFF');
D.flowers = () => [[-0.25, -0.2, '#F27A9A'], [0.15, -0.25, '#FFD45E'], [0.25, 0.1, '#FFFFFF'], [-0.1, 0.2, '#B9A0F0'], [-0.3, 0.1, '#FFD45E'], [0.05, 0, '#F27A9A']].map(([u, v, c]) => {
  const [x, y] = pt(u, v);
  return thick(`M${x},${y} q-1,-5 0,-10`, 1, '#5DAA45') + `<path d="M${x},${r2(y - 4)} q2.6,-1 3.6,0.6 q-2,1.4 -3.6,-0.6 Z" fill="#7EC45B" stroke="${OUT}" stroke-width="0.6"/>` + flower(x, y - 11, 2.4, c);
}).join('');
D.tuft = () => thick('M-7,0 q1,-9 -2.6,-14 M-2.4,0 q0,-12 1.2,-17 M2.4,0 q1,-11 4.6,-14 M7,0 q0,-7 3.6,-11', 2, '#7EC45B') + stroke('M-2,-4 q0,-6 0.8,-10 M3,-3 q0.6,-5 2.6,-7', 0.8, '#B3E386');
D.stump = () => {
  const [x, y] = [0, 0];
  return shadow(0, 0, 0.32) + `<path d="M-10,-2 L-9,-12 Q0,-16 9,-12 L10,-2 Q0,3 -10,-2 Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="1.1"/>` + `<path d="M3,-13.6 Q8,-13 9,-12 L10,-2 Q6,0.6 3,0.8 Z" fill="${WOOD_DARK.right}"/>`
    + E(0, -12.4, 9, 3.6, '#E8C08A', 1) + E(0, -12.4, 5.6, 2.2, 'none', 0.6) + E(0, -12.4, 2.4, 1, 'none', 0.6)
    + thick('M-6,-14 q-1,-5 1,-8', 0.8, '#7EC45B') + `<path d="M-5,-22 q3,-2 4,0.6 q-2.6,1.6 -4,-0.6 Z" fill="#7EC45B" stroke="${OUT}" stroke-width="0.6"/>` + E(x - 13, y - 1, 2.4, 1.6, '#7EC45B', 0.7);
};
D.log = () => {
  // tronc couché le long de u
  const a = pt(-0.38, 0.05, 7), b = pt(0.36, 0.05, 7);
  return shadow(0, 0.05, 0.42) + `<path d="M${r2(a[0])},${r2(a[1] - 6)} L${r2(b[0])},${r2(b[1] - 6)} L${r2(b[0])},${r2(b[1] + 6)} L${r2(a[0])},${r2(a[1] + 6)} Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<path d="M${r2(a[0])},${r2(a[1] + 2)} L${r2(b[0])},${r2(b[1] + 2)} L${r2(b[0])},${r2(b[1] + 6)} L${r2(a[0])},${r2(a[1] + 6)} Z" fill="${WOOD_DARK.right}"/>`
    + E(b[0], b[1], 4.6, 6, '#E8C08A', 1.1) + E(b[0], b[1], 2.6, 3.4, 'none', 0.6) + E(a[0] + 8, a[1] - 5.4, 5, 1.6, '#9CCB6A', 0.7) + `<path d="M${r2(a[0] + 14)},${r2(a[1] - 4)} q0,-4 2.4,-5" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${r2(a[0] + 14)},${r2(a[1] - 4)} q0,-4 2.4,-5" stroke="${WOOD_DARK.left}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
};
D.mushrooms = (night) => {
  const m = (x, y, s, cap, dots) => `<path d="M${r2(x - s * 0.5)},${y} L${r2(x - s * 0.4)},${r2(y - s * 1.4)} L${r2(x + s * 0.4)},${r2(y - s * 1.4)} L${r2(x + s * 0.5)},${y} Q${x},${r2(y + s * 0.3)} ${r2(x - s * 0.5)},${y} Z" fill="#F6EEDC" stroke="${OUT}" stroke-width="0.9"/>`
    + (night ? `<circle cx="${x}" cy="${r2(y - s * 1.6)}" r="${r2(s * 2.4)}" fill="rgb(150,255,200)" fill-opacity="0.35"/>` : '')
    + P(`M${r2(x - s * 1.4)},${r2(y - s * 1.3)} Q${r2(x - s * 1.3)},${r2(y - s * 2.8)} ${x},${r2(y - s * 2.9)} Q${r2(x + s * 1.3)},${r2(y - s * 2.8)} ${r2(x + s * 1.4)},${r2(y - s * 1.3)} Q${x},${r2(y - s * 1)} ${r2(x - s * 1.4)},${r2(y - s * 1.3)} Z`, night ? '#7FE0B8' : cap, 1)
    + dots.map(([dx, dy]) => E(x + dx * s, y - (2 - dy) * s, s * 0.22, s * 0.18, '#FFFFFF', 0)).join('');
  return shadow(0, 0, 0.38) + m(-8, 1, 5, '#E8483C', [[-0.6, 0.2], [0.5, 0.1], [0, -0.5]]) + m(6, 4, 3.8, '#C8864A', []) + m(11, -1, 2.8, '#E8483C', [[0, 0]]) + E(-15, 3, 3.6, 1.6, '#7EC45B', 0.6);
};
D.reeds = () => {
  let s = E(0, 0, 26, 12, '#8FC8E0', 1) + E(-3, -1, 18, 7, '#B6E0F0', 0) + `<path d="M-14,2 q6,-2 12,0" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  for (const [x, h, c] of [[-10, 22, 1], [-5, 28, 1], [0, 24, 0], [5, 30, 1], [10, 20, 0], [13, 25, 1]]) {
    s += thick(`M${x},4 q-1,-${h * 0.6} ${x > 0 ? 1.4 : -1.4},-${h}`, 1, '#7EA850');
    if (c) s += `<rect x="${r2(x + (x > 0 ? 1.4 : -1.4) - 1.6)}" y="${r2(4 - h + 1)}" width="3.2" height="7" rx="1.6" fill="#8A5A36" stroke="${OUT}" stroke-width="0.9"/>`;
  }
  return s;
};
D.lily = () => E(0, 0, 30, 14, '#8FC8E0', 1) + E(-4, -1, 20, 8, '#B6E0F0', 0)
  + [[-12, 2, 0], [8, -3, 40], [14, 5, -30]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P('M0,0 L5.4,-1.6 A5.6,3 0 1,1 4.8,1.6 Z', '#7EC45B', 0.9)}${L([0, 0], [4, -0.6], '#4F8F3A', 0.5)}</g>`).join('')
  + [0, 60, 120, 180, 240, 300].map(a => `<g transform="translate(9 -5) rotate(${a})">${P('M0,0 Q1.6,-2.4 0,-4.4 Q-1.6,-2.4 0,0 Z', '#F7B6CE', 0.6)}</g>`).join('') + E(9, -5, 1.1, 0.9, '#F2C94C', 0.4);
D.shells = () => {
  const spiral = (x, y, s) => P(`M${x},${y} q${-4 * s},${-1 * s} ${-3 * s},${-4 * s} q${2 * s},${-2.6 * s} ${4.4 * s},${-0.4 * s} q${1.6 * s},${3 * s} ${-1.4 * s},${4.4 * s} Z`, '#F6D8C0', 0.9) + stroke(`M${r2(x - 1.6 * s)},${r2(y - 1.4 * s)} q${r2(1 * s)},${r2(-1.6 * s)} ${r2(2.4 * s)},${r2(-0.6 * s)}`, 0.6, '#C8A08A');
  const scallop = (x, y, s) => P(`M${x},${y} L${r2(x - 3.4 * s)},${r2(y - 3.4 * s)} Q${x},${r2(y - 6 * s)} ${r2(x + 3.4 * s)},${r2(y - 3.4 * s)} Z`, '#F2A8B8', 0.9) + [-1.6, 0, 1.6].map(d => stroke(`M${x},${y} L${r2(x + d * s)},${r2(y - 4.6 * s)}`, 0.5, '#C8788A')).join('');
  const star = (x, y, s) => P([0, 1, 2, 3, 4].map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5, b = a + Math.PI / 5; return `${i ? 'L' : 'M'}${r2(x + Math.cos(a) * 4 * s)},${r2(y + Math.sin(a) * 2.6 * s)} L${r2(x + Math.cos(b) * 1.8 * s)},${r2(y + Math.sin(b) * 1.2 * s)}`; }).join(' ') + ' Z', '#F29A4A', 0.9);
  return E(0, 0, 24, 11, 'rgba(255,240,200,.35)', 0) + spiral(-12, 3, 1.9) + scallop(11, 6, 1.6) + star(1, -7, 1.9) + E(-2, 8, 2.2, 1.2, '#FFFFFF', 0.6) + E(17, -3, 1.6, 0.9, '#F6D8C0', 0.6);
};
D.driftwood = () => shadow(0, 0, 0.4, 0.15) + thick('M-22,4 Q-8,-2 6,0 Q14,1 22,-4', 3, '#D8CDBA') + thick('M-4,-1 Q0,-8 6,-10', 1.6, '#D8CDBA') + thick('M10,0 Q14,-6 18,-6', 1.2, '#D8CDBA')
  + stroke('M-16,2 Q-8,-1 0,-0.4', 0.6, '#B8AC98') + E(-14, 6, 2, 1, '#F6D8C0', 0.6);
D.lantern = (lit) => {
  const halo = lit ? `<defs><radialGradient id="lanterne-lueur"><stop offset="0" stop-color="rgb(255,224,138)" stop-opacity=".72"/><stop offset=".45" stop-color="rgb(255,224,138)" stop-opacity=".32"/><stop offset="1" stop-color="rgb(255,224,138)" stop-opacity="0"/></radialGradient></defs><circle cx="0" cy="-44" r="20" fill="url(#lanterne-lueur)"/>` : '';
  return shadow(0, 0, 0.28) + halo + `<rect x="-2.2" y="-38" width="4.4" height="38" rx="1" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="1"/>` + `<rect x="0.6" y="-38" width="1.6" height="38" fill="${WOOD_DARK.right}"/>`
    + thick('M0,-38 L0,-41 L7,-41', 1.2, WOOD_DARK.left) + L([7, -41], [7, -39], OUT, 0.8)
    + poly([[3, -39], [11, -39], [12, -36], [12, -29], [2, -29], [2, -36]], lit ? '#FFE08A' : '#E8E2D2', 1) + L([2, -36], [12, -36], '#3E4248', 0.8) + L([7, -36], [7, -29], '#3E4248', 0.6)
    + poly([[1.6, -29], [12.4, -29], [11, -27], [3, -27]], '#3E4248', 0.8) + (lit ? E(5.4, -32.6, 0.9, 1.6, '#FFFFFF', 0) : '');
};
D.bench = () => {
  // banc de bois le long de u
  const seat = box(-0.32, -0.08, 0.32, 0.08, 9, 11, WOOD);
  const legs = [[-0.28, -0.06], [-0.28, 0.06], [0.28, -0.06], [0.28, 0.06]].map(([u, v]) => box(u - 0.02, v - 0.02, u + 0.02, v + 0.02, 0, 9, WOOD_DARK, 0.7)).join('');
  const back = box(-0.32, -0.1, 0.32, -0.07, 11, 22, WOOD);
  return shadow(0, 0, 0.4) + back + legs + seat + face([[-0.32, -0.1, 16], [0.32, -0.1, 16]], 'none', 0.6);
};
D.cactus = () => shadow(0, 0, 0.3) + `<rect x="-5" y="-40" width="10" height="40" rx="5" fill="#6FAE4E" stroke="${OUT}" stroke-width="1.1"/>`
  + thick('M-5,-20 L-11,-20 L-11,-30', 4.6, '#6FAE4E') + thick('M5,-14 L10,-14 L10,-26', 4.6, '#6FAE4E') + `<rect x="1.4" y="-38" width="2.2" height="36" rx="1.1" fill="#4F8F3A"/>`
  + [[-2, -30], [2, -20], [-2, -10], [-11, -26], [10, -22]].map(([x, y]) => L([x, y], [x - 1.4, y - 1], OUT, 0.5)).join('') + flower(0, -41, 2, '#F27A9A');
D.deadtree = () => shadow(0, 0, 0.36) + thick('M0,0 L-1,-26 M-1,-18 Q-8,-24 -12,-34 M-1,-26 Q2,-36 0,-44 M0,-30 Q8,-34 12,-42 M-8,-27 L-13,-26', 3, '#8E8A86') + stroke('M0,-2 L-0.6,-24', 1, '#6E6A66');
D.heather = () => shadow(0, 0, 0.42) + crown([[-9, -6, 7.6], [8, -6, 8], [0, -10, 8.6]], { light: '#E0B8F0', mid: '#B07AD0', dark: '#7E4AA6' }, 'he')
  + [[-10, -12], [-4, -16], [4, -15], [10, -11], [0, -6]].map(([x, y]) => E(x, y, 1.1, 1.1, '#F0D0FF', 0)).join('') + thick('M-14,0 q1,-4 -1,-6 M14,0 q-1,-4 1,-6', 0.8, '#6FAE4E');
D.nest = () => shadow(0, 0, 0.36) + boulder(0, 0.05, 0.3, 0.24, 10, GRANITE, 11) + E(0, -13, 11, 4.4, '#C8A070', 1.1) + stroke('M-10,-13 Q-4,-16 2,-14 M-6,-11 Q2,-9 9,-12 M-9,-12 Q0,-18 10,-13', 0.7, '#8A6440')
  + E(-3, -15, 2.4, 3, '#E8F2F6', 0.9) + E(2.6, -15.4, 2.2, 2.8, '#E0EAF0', 0.9) + E(-2.6, -15.8, 0.8, 0.5, '#B8C6D0', 0) + E(2.8, -16.4, 0.6, 0.4, '#B8C6D0', 0);

module.exports = { K, TW, TH, PROP, BUILDING, BIG, pt, poly, face, shadow, box, crown, trunk, boulder, lichen, flower, stroke, thick, LEAVES, PINE, WOOD, WOOD_DARK, GRANITE, D };

// ——— Volumes complémentaires ———
// Cylindre vertical (centre u, v ; rayon r en cases) de z0 à z1 ; c = { top, left, right }
function cylinder(u, v, r, z0, z1, c, w = 1) {
  const [x, y0] = pt(u, v, z0), [, y1] = pt(u, v, z1);
  const rx = r * TW * 0.7, ry = r * TH * 0.7;
  const side = `M${r2(x - rx)},${r2(y1)} L${r2(x - rx)},${r2(y0)} A${r2(rx)} ${r2(ry)} 0 0 0 ${r2(x + rx)},${r2(y0)} L${r2(x + rx)},${r2(y1)} Z`;
  return `<path d="${side}" fill="${c.left}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`
    + `<path d="M${r2(x + rx * 0.15)},${r2(y1 + ry)} L${r2(x + rx * 0.15)},${r2(y0 + ry)} A${r2(rx)} ${r2(ry)} 0 0 0 ${r2(x + rx)},${r2(y0)} L${r2(x + rx)},${r2(y1)} Z" fill="${c.right}"/>`
    + `<path d="${side}" fill="none" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round"/>`
    + E(x, y1, rx, ry, c.top, w);
}
// Disque posé au sol ou à z (eau, tapis…)
const disc = (u, v, r, z, fill, w = 1) => { const [x, y] = pt(u, v, z); return E(x, y, r * TW * 0.7, r * TH * 0.7, fill, w); };
// Toit à deux pans (faîtage le long de u), pignon visible côté +u
function gable(u0, v0, u1, v1, z, h, c, o = 0.08) {
  const vm = (v0 + v1) / 2, a = u0 - o, b = u1 + o;
  return face([[a, v0 - o, z], [b, v0 - o, z], [b, vm, z + h], [a, vm, z + h]], c.back, 1)
    + face([[u1, v0, z], [u1, v1, z], [u1, vm, z + h]], c.gable, 1)
    + face([[a, vm, z + h], [b, vm, z + h], [b, v1 + o, z], [a, v1 + o, z]], c.front, 1);
}
// Toit en pointe
function pyramid(u0, v0, u1, v1, z, h, c, o = 0.06) {
  const A = [u0 - o, v0 - o, z], B = [u1 + o, v0 - o, z], Cc = [u1 + o, v1 + o, z], Dd = [u0 - o, v1 + o, z], T = [(u0 + u1) / 2, (v0 + v1) / 2, z + h];
  return face([A, B, T], c.back, 1) + face([Dd, A, T], c.back, 1) + face([B, Cc, T], c.right, 1) + face([Cc, Dd, T], c.front, 1);
}
// Poteau carré et lisse
const post = (u, v, z0, z1, c = WOOD_DARK, w = 0.03) => box(u - w, v - w, u + w, v + w, z0, z1, c, 0.7);
const rail = (a, b, z, w = 2, c = WOOD_DARK.left) => { const p = pt(a[0], a[1], z), q = pt(b[0], b[1], z); return `<path d="M${r2(p[0])},${r2(p[1])} L${r2(q[0])},${r2(q[1])}" stroke="${OUT}" stroke-width="${w + 1.6}" stroke-linecap="round"/><path d="M${r2(p[0])},${r2(p[1])} L${r2(q[0])},${r2(q[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
// Flamme en trois couches (k : phase 0..1)
function flame(x, y, h, w, k) {
  const sway = Math.sin(k * Math.PI * 2) * w * 0.35;
  const tip = (s, dx) => `M${r2(x - w * s)},${r2(y)} Q${r2(x - w * s * 1.1)},${r2(y - h * s * 0.55)} ${r2(x + dx)},${r2(y - h * s)} Q${r2(x + w * s * 1.1)},${r2(y - h * s * 0.55)} ${r2(x + w * s)},${r2(y)} Z`;
  return `<path d="${tip(1, sway)}" fill="#E8573A" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="${tip(0.72, sway * 0.6)}" fill="#F59A3C"/><path d="${tip(0.42, sway * 0.3)}" fill="#FFE08A"/>`;
}
// Lueur : un dégradé qui s'efface vers le bord (pas un disque plat) ; identifiant propre à chaque lueur
let glowN = 0;
const glow = (x, y, r, rgb = '255,224,138', a = 0.38) => { const id = `lueur${glowN++}`; return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r2(Math.min(0.9, a * 1.8))}"/><stop offset="0.45" stop-color="rgb(${rgb})" stop-opacity="${r2(a * 0.8)}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 1.25)}" fill="url(#${id})"/>`; };
const STONE = { top: '#E6E1D4', left: '#C3BBA9', right: '#9B927F' };
const WHITE_STONE = { top: '#FBF8F1', left: '#E7E1D3', right: '#C9C0AC' };
const ROOF_RED = { back: '#B9503B', front: '#E06E52', gable: '#F3E4C4', right: '#B9503B' };
const ROOF_BLUE = { back: '#3E6FA8', front: '#5C8FD0', gable: '#F3E4C4', right: '#3E6FA8' };
const THATCH = { back: '#C99A45', front: '#EBC46F', gable: '#F3E4C4', right: '#C99A45' };
const WALL = { top: '#FCF4E2', left: '#F3E4C4', right: '#D8C39B' };
const SOIL = { top: '#946240', left: '#784C2E', right: '#5E3A22' };
const WATER = '#5BAFD8', WATER_LIGHT = '#9AD6F0';
const BRASS = { top: '#F4D67A', left: '#E2B546', right: '#B88A2E' };
const IRON = { top: '#9AA2AD', left: '#7E8691', right: '#5E6670' };
Object.assign(module.exports, { cylinder, disc, gable, pyramid, post, rail, flame, glow, STONE, WHITE_STONE, ROOF_RED, ROOF_BLUE, THATCH, WALL, SOIL, WATER, WATER_LIGHT, BRASS, IRON });
