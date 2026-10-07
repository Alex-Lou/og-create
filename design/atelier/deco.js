// Décor iso au trait de la troupe. Même projection que src/world/iso.js (losange 2:1, lumière en haut à gauche), à
// l'échelle de la troupe : une case fait 80 × 40 (le jeu : 64 × 32), le cadre d'un décor d'une case est PROP_BOX × 1,25.
// Ancre (0, 0) : centre de la case. z en pixels du jeu (× 1,25 à l'écran).
const { OUT, E, r2 } = require('./troupe');

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
// Rocher arrondi et bosselé : silhouette douce, côté clair en haut à gauche, ombre en bas à droite, reflet
// (u, v : centre au sol ; ru, rv : demi-taille en cases ; h : hauteur ; seed : forme)
function boulder(u, v, ru, rv, h, c, seed = 1) {
  const [x, y] = pt(u, v);
  const w = ru * TW * 0.78, d = rv * TH * 0.7, H = h * K;
  const j = k => 1 + 0.14 * Math.sin(seed * 12.9898 + k * 78.233);
  const path = `M${r2(x - w)},${r2(y)} Q${r2(x - w * 1.02)},${r2(y - H * 0.7 * j(1))} ${r2(x - w * 0.45)},${r2(y - H * j(2))} `
    + `Q${r2(x + w * 0.1)},${r2(y - H * 1.12 * j(3))} ${r2(x + w * 0.62)},${r2(y - H * 0.78 * j(4))} Q${r2(x + w * 1.04)},${r2(y - H * 0.42)} ${r2(x + w)},${r2(y)} `
    + `Q${x},${r2(y + d)} ${r2(x - w)},${r2(y)} Z`;
  // le nom de la découpe vient des réglages du rocher (pas d'un compteur), comme celui des lueurs
  const id = `rk${seed}_${[u, v, ru, rv, h].map(r2).join('_')}`.replace(/-/g, 'm').replace(/\./g, 'p');
  return `<path d="${path}" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<ellipse cx="${r2(x + w * 0.55)}" cy="${r2(y - H * 0.1)}" rx="${r2(w * 0.8)}" ry="${r2(H * 0.75)}" fill="${c.right}"/>`
    + `<ellipse cx="${r2(x - w * 0.25)}" cy="${r2(y - H * 0.95)}" rx="${r2(w * 0.7)}" ry="${r2(H * 0.38)}" fill="${c.top}"/>`
    + `</g><path d="M${r2(x - w * 0.6)},${r2(y - H * 0.7)} Q${r2(x - w * 0.35)},${r2(y - H * 0.98)} ${r2(x + w * 0.05)},${r2(y - H * 1.02)}" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>`;
}
const flower = (x, y, r, petal, heart = '#E8A13A') => [0, 72, 144, 216, 288].map(a => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.78, r * 0.78, petal, 0.5)).join('') + E(x, y, r * 0.55, r * 0.55, heart, 0.4);
const stroke = (d, w, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const thick = (d, w, color) => stroke(d, w + 2.2, OUT) + stroke(d, w, color);

module.exports = { K, TW, TH, PROP, BUILDING, BIG, pt, poly, face, shadow, box, crown, boulder, flower, stroke, thick, LEAVES, PINE, WOOD, WOOD_DARK, GRANITE };

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
// son nom vient de ses réglages (pas d'un compteur) : un même dessin porte le même nom, dans quelque ordre qu'on dessine
const glow = (x, y, r, rgb = '255,224,138', a = 0.38) => { const id = `lueur_${[x, y, r, a].map(r2).join('_')}_${rgb}`.replace(/,/g, '-').replace(/\./g, 'p'); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="rgb(${rgb})" stop-opacity="${r2(Math.min(0.9, a * 1.8))}"/><stop offset="0.45" stop-color="rgb(${rgb})" stop-opacity="${r2(a * 0.8)}"/><stop offset="1" stop-color="rgb(${rgb})" stop-opacity="0"/></radialGradient></defs><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 1.25)}" fill="url(#${id})"/>`; };
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
