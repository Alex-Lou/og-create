// Palette et petits motifs communs aux sprites de l'île : mêmes matières, même lumière, partout.
import { P, box, shadow, foliage } from './iso';

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
// Arbre rond : tronc, houppier en trois boules
export function roundTree(u, v, scale = 1, colors = LEAVES) {
  const s = scale;
  const [x, y] = P(u, v, 0);
  return shadow(u, v, 0.34 * s)
    + box(u - 0.06 * s, v - 0.06 * s, u + 0.06 * s, v + 0.06 * s, 0, 16 * s, WOOD_DARK)
    + foliage(x - 7 * s, y - 24 * s, 10 * s, colors)
    + foliage(x + 7 * s, y - 25 * s, 10.5 * s, colors)
    + foliage(x, y - 34 * s, 12 * s, colors);
}


// Toits et matières alternatifs (skins de la boutique des ateliers)
export const BLUE_ROOF = { front: '#6FA3D9', back: '#4C7FB5' };
export const SLATE_ROOF = { front: '#7D8AA0', back: '#5C6880' };
// Cuivre patiné : vert-de-gris clair au soleil, plus profond à l'ombre
export const COPPER_ROOF = { front: '#7CC7B0', back: '#4F9886' };
export const WHITE_STONE = { top: '#FFFFFF', left: '#F4F0E8', right: '#D6CFC2' };
