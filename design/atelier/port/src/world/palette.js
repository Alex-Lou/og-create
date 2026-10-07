// Palette et petits motifs communs aux sprites de l'île : mêmes matières, même lumière, partout.
import { P, face, box, shadow, mixHex, EDGE } from './iso.js';

// Palette « Vélin & Veillée », version île : chaque matière a son dessus, sa face gauche (éclairée) et sa face droite
export const WOOD = { top: '#E0A96C', left: '#BF8049', right: '#965C30' };
export const WOOD_DARK = { top: '#A9703F', left: '#8B5631', right: '#6A3F22' };
export const STONE = { top: '#E6E1D4', left: '#C3BBA9', right: '#9B927F' };
export const WALL = { top: '#FCF4E2', left: '#F3E4C4', right: '#D8C39B' };
export const BRICK = { top: '#E08A62', left: '#C66B47', right: '#A05035' };
export const SOIL = { top: '#946240', left: '#784C2E', right: '#5E3A22' };
export const ROOF_RED = { front: '#E06E52', back: '#B9503B' };
export const THATCH = { front: '#EBC46F', back: '#C99A45' };
export const LEAVES = { light: '#B3E386', mid: '#7EC45B', dark: '#4F8F3A' };
export const PINE = { light: '#86C774', mid: '#4F9A4C', dark: '#2F6E3A' };
export const GLASS = '#FFE6A3';
export const INK = '#4A3426';
const INK_OUT = '#3C2819';

export const BUILDING_BOX = { x: -76, y: -124, w: 152, h: 168 };
export const PROP_BOX = { x: -40, y: -92, w: 80, h: 112 };

/* ---------- Petits motifs ---------- */
// Pierre arrondie posée au sol (vue de 3/4) : masse, ombre, éclat
export function pebble(u, v, s, color = STONE) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${x + s * 0.12}" cy="${y + s * 0.18}" rx="${s}" ry="${s * 0.62}" fill="${color.right}"/>`
    + `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s * 0.66}" fill="${color.left}"/>`
    + `<ellipse cx="${x - s * 0.28}" cy="${y - s * 0.22}" rx="${s * 0.5}" ry="${s * 0.3}" fill="${color.top}"/>`;
}
// Porte sur la face gauche (côté v = vf) : u de ua à ub, hauteur h
export function doorLeft(ua, ub, vf, h, color = WOOD_DARK.right) {
  return face([[ua, vf, 0], [ub, vf, 0], [ub, vf, h], [ua, vf, h]], color, EDGE)
    + face([[ub - 0.04, vf, h * 0.45], [ub - 0.02, vf, h * 0.45], [ub - 0.02, vf, h * 0.5], [ub - 0.04, vf, h * 0.5]], '#F2C04B');
}
// Fenêtre sur la face gauche (v = vf) ou droite (u = uf), avec croisillon
export function windowLeft(ua, ub, vf, z0, z1, glass = GLASS) {
  const um = (ua + ub) / 2;
  const zm = (z0 + z1) / 2;
  return face([[ua, vf, z0], [ub, vf, z0], [ub, vf, z1], [ua, vf, z1]], glass, ' stroke="#7A4E2C" stroke-width="1.4" stroke-linejoin="round"')
    + `<polyline points="${[P(um, vf, z0), P(um, vf, z1)].map(p => p.join(',')).join(' ')}" stroke="#7A4E2C" stroke-width="1"/>`
    + `<polyline points="${[P(ua, vf, zm), P(ub, vf, zm)].map(p => p.join(',')).join(' ')}" stroke="#7A4E2C" stroke-width="1"/>`;
}
export function windowRight(uf, va, vb, z0, z1, glass = GLASS) {
  const vm = (va + vb) / 2;
  const zm = (z0 + z1) / 2;
  return face([[uf, va, z0], [uf, vb, z0], [uf, vb, z1], [uf, va, z1]], glass, ' stroke="#5E3A22" stroke-width="1.4" stroke-linejoin="round"')
    + `<polyline points="${[P(uf, vm, z0), P(uf, vm, z1)].map(p => p.join(',')).join(' ')}" stroke="#5E3A22" stroke-width="1"/>`
    + `<polyline points="${[P(uf, va, zm), P(uf, vb, zm)].map(p => p.join(',')).join(' ')}" stroke="#5E3A22" stroke-width="1"/>`;
}
// Lattes horizontales sur une face gauche de bois
export function planksLeft(u0, u1, vf, z0, z1, step = 6) {
  let out = '';
  for (let z = z0 + step; z < z1; z += step) {
    out += `<polyline points="${[P(u0, vf, z), P(u1, vf, z)].map(p => p.join(',')).join(' ')}" stroke="rgba(70,40,20,.25)" stroke-width="0.8"/>`;
  }
  return out;
}
export function planksRight(uf, v0, v1, z0, z1, step = 6) {
  let out = '';
  for (let z = z0 + step; z < z1; z += step) {
    out += `<polyline points="${[P(uf, v0, z), P(uf, v1, z)].map(p => p.join(',')).join(' ')}" stroke="rgba(40,20,10,.25)" stroke-width="0.8"/>`;
  }
  return out;
}
// Touffe de feuillage au trait des PNJ : lobes [dx, dy, r, reflet ?] autour de (x, y) à l'échelle s, sous un contour
// commun ; chaque lobe a son ombre en bas à droite, les lobes du haut un reflet en croissant et une marque de feuilles
const rnd2 = n => Math.round(n * 100) / 100;
const disc2 = (x, y, r, fill) => `<circle cx="${rnd2(x)}" cy="${rnd2(y)}" r="${rnd2(r)}" fill="${fill}"/>`;
export const treeId = (p, u, v, s) => `${p}${rnd2(u * 100)}_${rnd2(v * 100)}_${rnd2(s * 100)}`.replace(/[.-]/g, m => (m === '.' ? 'p' : 'm'));
export function touffe(id, x, y, s, lobes, c) {
  const L = lobes.map(([dx, dy, r, hi]) => [x + dx * s, y + dy * s, r * s, hi]);
  const hi = L.filter(l => l[3] !== 0);
  return L.map(([cx, cy, r]) => disc2(cx, cy, r + 0.9, INK_OUT)).join('')
    + `<defs><clipPath id="${id}">${L.map(([cx, cy, r]) => disc2(cx, cy, r, '#000')).join('')}</clipPath></defs><g clip-path="url(#${id})">`
    + L.map(([cx, cy, r]) => disc2(cx, cy, r, c.dark)).join('')
    + L.map(([cx, cy, r]) => disc2(cx - r * 0.18, cy - r * 0.3, r * 0.86, c.mid)).join('')
    + hi.map(([cx, cy, r]) => disc2(cx - r * 0.34, cy - r * 0.46, r * 0.46, c.light) + disc2(cx - r * 0.22, cy - r * 0.3, r * 0.46, c.mid)).join('')
    + hi.map(([cx, cy, r]) => `<path d="M${rnd2(cx + r * 0.05)},${rnd2(cy + r * 0.2)} q${rnd2(r * 0.12)},${rnd2(r * 0.16)} ${rnd2(r * 0.24)},0 q${rnd2(r * 0.12)},${rnd2(r * 0.16)} ${rnd2(r * 0.24)},0" fill="none" stroke="${c.dark}" stroke-width="${rnd2(0.5 + 0.3 * s)}" stroke-linecap="round"/>`).join('')
    + '</g>';
}
// La touffe du fond, plus froide et plus sombre que celles de devant
export const backLeaves = c => ({ light: c.mid, mid: mixHex(c.mid, c.dark, 0.55), dark: mixHex(c.dark, '#1E3A22', 0.35) });
// Tronc à racines et deux branches qui filent sous le houppier, en (x, y) : demi-largeur w, hauteur h avant les branches
export function treeTrunk(x, y, s, w = 2.4, h = 15) {
  const X = dx => rnd2(x + dx * s), Y = dy => rnd2(y + dy * s);
  const d = `M${X(-w - 2.2)},${Y(1.4)} Q${X(-w - 0.2)},${Y(0.2)} ${X(-w)},${Y(-4)} L${X(-w + 0.2)},${Y(-h)} Q${X(-w - 2.6)},${Y(-h - 4)} ${X(-w - 5.2)},${Y(-h - 7)} L${X(-w - 3.2)},${Y(-h - 8.4)} Q${X(-w)},${Y(-h - 5.6)} ${X(0)},${Y(-h - 3.6)} Q${X(w)},${Y(-h - 6)} ${X(w + 3)},${Y(-h - 8.6)} L${X(w + 4.8)},${Y(-h - 6.8)} Q${X(w + 2.2)},${Y(-h - 4)} ${X(w)},${Y(-h)} L${X(w + 0.2)},${Y(-4)} Q${X(w + 0.4)},${Y(0.2)} ${X(w + 2.6)},${Y(1.6)} Q${X(w * 1.1)},${Y(2.6)} ${X(0)},${Y(1.8)} Q${X(-w * 1.1)},${Y(2.6)} ${X(-w - 2.2)},${Y(1.4)} Z`;
  return `<path d="${d}" fill="${WOOD_DARK.left}" stroke="${INK_OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + `<path d="M${X(w * 0.25)},${Y(1.6)} L${X(w * 0.4)},${Y(-h)} L${X(w)},${Y(-h)} L${X(w + 0.2)},${Y(-4)} Q${X(w + 0.4)},${Y(0.2)} ${X(w + 2.6)},${Y(1.6)} Q${X(w * 1.1)},${Y(2.6)} ${X(w * 0.25)},${Y(1.6)} Z" fill="${WOOD_DARK.right}"/>`
    + `<path d="M${X(-w * 0.4)},${Y(-4)} q-0.3,-3 0,-6 M${X(w * 0.55)},${Y(-7)} q0.3,-2.6 0,-5" stroke="rgba(40,22,12,.5)" stroke-width="0.6" fill="none" stroke-linecap="round"/>`;
}
// Arbre rond : tronc à racines, houppier en deux touffes détourées (celle du fond plus sombre)
export function roundTree(u, v, scale = 1, colors = LEAVES) {
  const s = scale;
  const [x, y] = P(u, v, 0);
  const id = treeId('rt', u, v, s);
  return shadow(u, v, 0.34 * s) + treeTrunk(x, y, s)
    + touffe(id + 'f', x, y, s, [[-8, -34, 9], [6, -37, 10], [14, -27, 7.5], [-15, -26, 7]], backLeaves(colors))
    + touffe(id + 'a', x, y, s, [[-9, -23, 8.4], [9, -22, 8.4], [0, -29, 9.6], [-1, -18.6, 6.6, 0]], colors);
}


// Toits et matières alternatifs (skins de la boutique des ateliers)
export const BLUE_ROOF = { front: '#6FA3D9', back: '#4C7FB5' };
export const SLATE_ROOF = { front: '#7D8AA0', back: '#5C6880' };
export const WHITE_STONE = { top: '#FFFFFF', left: '#F4F0E8', right: '#D6CFC2' };
export const WHITE_WOOD = { top: '#FFFFFF', left: '#F3EFE6', right: '#CFC8BA' };
export const ROCKS = {
  'roche-ocre': { top: '#F2CD95', left: '#D9A464', right: '#B07A3F' },
  'roche-granit': { top: '#D3CBD1', left: '#A99FA8', right: '#7F7584' },
  'roche-cristal': STONE
};
export const FOLIAGE = {
  printemps: { light: '#D9F2A6', mid: '#A7DB78', dark: '#6FAE4C' },
  automne: { light: '#FFD27A', mid: '#F2994A', dark: '#C8622A' },
  givre: { light: '#FFFFFF', mid: '#D8E8F3', dark: '#A6C1D6' }
};
export const SAILS = { 'voile-rouge': ['#E2574C', '#B13A31'], 'voile-bleue': ['#6FA3D9', '#4C7FB5'], 'voile-rayee': ['stripes', '#E2574C'] };
// Toit d'un bâtiment selon son skin (foyer : rouge, bleu, chaume)
export function roofOf(skin, fallback) {
  if (skin === 'toit-rouge' || skin === 'toit-rouge-foyer') return { front: '#E06E52', back: '#B9503B' };
  if (skin === 'toit-bleu' || skin === 'toit-bleu-foyer') return BLUE_ROOF;
  if (skin === 'toit-chaume' || skin === 'toit-chaume-foyer') return { front: '#EBC46F', back: '#C99A45' };
  if (skin === 'toit-ardoise') return SLATE_ROOF;
  return fallback;
}
// Fleurs (printemps) ou neige (givre) posées sur un houppier en (x, y) de rayon r
export function seasonDots(skin, x, y, r) {
  if (skin === 'printemps') {
    return [[-0.5, -0.3], [0.3, -0.5], [0.55, 0.1], [-0.1, 0.2], [-0.6, 0.3]].map(([dx, dy]) => `<circle cx="${x + dx * r}" cy="${y + dy * r}" r="${r * 0.13}" fill="#F7A8C8"/><circle cx="${x + dx * r}" cy="${y + dy * r}" r="${r * 0.05}" fill="#FFE07A"/>`).join('');
  }
  if (skin === 'givre') return `<path d="M${x - r * 0.8},${y - r * 0.35} Q${x},${y - r * 1.25} ${x + r * 0.8},${y - r * 0.35} Q${x},${y - r * 0.7} ${x - r * 0.8},${y - r * 0.35} Z" fill="#FFFFFF" opacity=".95"/>`;
  return '';
}
// Éclats de cristal (skin « veines de cristal ») sur une roche en (u, v, z)
export function crystals(u, v, z, s = 1) {
  const [x, y] = P(u, v, z);
  return `<path d="M${x - 4 * s},${y} L${x - 2 * s},${y - 9 * s} L${x},${y} Z" fill="#B9A0F0"/><path d="M${x - 2 * s},${y - 9 * s} L${x},${y} L${x - 0.5 * s},${y - 1 * s} Z" fill="#8E73E0"/>`
    + `<path d="M${x},${y} L${x + 3 * s},${y - 12 * s} L${x + 6 * s},${y} Z" fill="#9FD3F2"/><path d="M${x + 3 * s},${y - 12 * s} L${x + 6 * s},${y} L${x + 4 * s},${y} Z" fill="#6FAED9"/>`;
}
// Texture du pan avant d'un toit à deux pans (même géométrie que gable) selon le skin porté :
// tuiles rondes (rouge), ardoises décalées (bleu, ardoise), brins de chaume. Sans skin : rien (toit d'origine).
const ROOF_KIND = {
  'toit-rouge': 'tiles', 'toit-bleu': 'slate', 'toit-bleu-foyer': 'slate', 'toit-ardoise': 'slate',
  'toit-chaume': 'thatch', 'toit-chaume-foyer': 'thatch'
};
export function roofTexture(skin, u0, v0, u1, v1, z, h, o = 0.08) {
  const kind = ROOF_KIND[skin];
  if (!kind) return '';
  const vm = (v0 + v1) / 2;
  const a = u0 - o;
  const b = u1 + o;
  const ve = v1 + o;
  // Point du pan : u le long du faîtage, k de 0 (faîtage) à 1 (égout)
  const at = (u, k) => P(u, vm + (ve - vm) * k, z + h * (1 - k)).map(n => Math.round(n * 100) / 100).join(',');
  const rows = [0.2, 0.4, 0.6, 0.8, 1];
  let out = '';
  if (kind === 'tiles') {
    const n = Math.max(4, Math.round((b - a) / 0.12));
    const du = (b - a) / n;
    for (const k of rows) {
      let d = `M${at(a, k)}`;
      for (let i = 0; i < n; i++) d += ` Q${at(a + (i + 0.5) * du, k + 0.09)} ${at(a + (i + 1) * du, k)}`;
      out += `<path d="${d}" fill="none" stroke="rgba(110,35,20,.45)" stroke-width="0.9"/>`
        + `<polyline points="${at(a, k - 0.06)} ${at(b, k - 0.06)}" stroke="rgba(255,220,200,.25)" stroke-width="0.7"/>`;
    }
  } else if (kind === 'slate') {
    const du = 0.15;
    rows.forEach((k, r) => {
      out += `<polyline points="${at(a, k)} ${at(b, k)}" stroke="rgba(25,35,55,.4)" stroke-width="0.8"/>`;
      for (let u = a + (r % 2 ? du / 2 : du); u < b - 0.02; u += du) out += `<polyline points="${at(u, k - 0.2)} ${at(u, k)}" stroke="rgba(25,35,55,.3)" stroke-width="0.6"/>`;
      out += `<polyline points="${at(a, k - 0.17)} ${at(b, k - 0.17)}" stroke="rgba(255,255,255,.18)" stroke-width="0.6"/>`;
    });
  } else {
    // Chaume : brins serrés, un peu irréguliers, et frange épaisse à l'égout
    for (let k = 0.12; k <= 1.01; k += 0.13) {
      for (let u = a + 0.02; u < b - 0.02; u += 0.055) {
        const j = Math.sin(u * 91 + k * 37) * 0.012;
        out += `<polyline points="${at(u + j, k - 0.11)} ${at(u + j + 0.012, k)}" stroke="rgba(150,105,40,.5)" stroke-width="0.6"/>`;
      }
    }
    out += `<polyline points="${at(a, 1.02)} ${at(b, 1.02)}" stroke="#A97B32" stroke-width="2" stroke-dasharray="1.6 1.4"/>`;
  }
  return out;
}
// Assises de pierre sur la face avant d'un cylindre (puits, bassin) : joints horizontaux et verticaux décalés
export function stoneCourses(u, v, z0, z1, r, n = 2, color = 'rgba(120,110,95,.4)') {
  const [x, y] = P(u, v, 0);
  const rx = r * 45.25;
  const ry = r * 22.63;
  const f = k => Math.round(k * 100) / 100;
  let out = '';
  for (let i = 0; i <= n; i++) {
    const z = z0 + ((z1 - z0) * i) / (n + 1);
    if (i > 0) out += `<path d="M${f(x - rx)},${f(y - z)} A${f(rx)},${f(ry)} 0 0 0 ${f(x + rx)},${f(y - z)}" fill="none" stroke="${color}" stroke-width="0.7"/>`;
    const top = z0 + ((z1 - z0) * (i + 1)) / (n + 1);
    for (let a = i % 2 ? 0.35 : 0.7; a < Math.PI - 0.2; a += 0.7) {
      const px = x + rx * Math.cos(a);
      const py = y + ry * Math.sin(a);
      out += `<line x1="${f(px)}" y1="${f(py - z)}" x2="${f(px)}" y2="${f(py - top)}" stroke="${color}" stroke-width="0.6"/>`;
    }
  }
  return out;
}
