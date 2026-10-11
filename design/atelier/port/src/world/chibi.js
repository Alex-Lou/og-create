// Le trait « chibi » des bâtiments (cahier des charges du 11 oct.) : au niveau des personnages qui vivent autour.
// - Trait brun #3C2819 : épais sur les contours (TRAIT), plus fin sur les détails intérieurs (DETAIL), dans le repère
//   du jeu (le fichier de la bibliothèque le multiplie par 1,25).
// - Lumière en haut à gauche : un dégradé doux par grande surface, un reflet clair sur les arêtes hautes.
// - Formes rondes et généreuses : grosses planches peu nombreuses, poteaux ronds, détails lisibles.
// - Pas d'ombre en ellipse grise : le pied se pose sur des galets et une ombre de contact couleur du sol.
import { P, mixHex } from './iso.js';

export const INK = '#3C2819';
export const TRAIT = 2.4;
export const DETAIL = 1.3;
// La mer du jeu : sous le sable, à SEA_Z × HS (terrain.js : -1,36 × 22)
export const MER = -30;

export const f2 = n => Math.round(n * 100) / 100;
const pts = list => list.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
// Polygone à partir de points (u, v, z), contour w
export const poly = (points, fill, w = TRAIT, extra = '') => `<polygon points="${pts(points.map(p => P(...p)))}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"${extra}/>`;
export const trait = (a, b, w = DETAIL, color = INK) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
// Dégradé linéaire (gauche clair → droite sombre, ou haut → bas) ; id unique dans le fichier
export const degrade = (id, c0, c1, vertical = false) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs>`;

export const BOIS = { clair: '#F2C48A', top: '#E3A964', left: '#C98448', right: '#9E5F30', joint: '#7A4824' };
export const SABLE = { ombre: 'rgba(150,105,50,.32)', galet: { top: '#F4E6C4', left: '#DCC79A', right: '#B9A274' } };

// Boîte arrondie à l'œil : trois faces en dégradé, contour épais, reflet clair sur les deux arêtes hautes
export function bloc(u0, v0, u1, v1, z0, z1, c, id, w = TRAIT) {
  const top = [[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]];
  const left = [[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]];
  const right = [[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]];
  const reflet = mixHex(c.top, '#FFFFFF', 0.45);
  return degrade(`${id}-l`, c.left, mixHex(c.left, c.right, 0.35)) + degrade(`${id}-r`, mixHex(c.right, c.left, 0.25), c.right)
    + poly(left, `url(#${id}-l)`, w) + poly(right, `url(#${id}-r)`, w) + poly(top, c.top, w)
    + trait(P(u0 + 0.03, v1, z1 - 0.8), P(u1 - 0.02, v1, z1 - 0.8), 1.1, reflet) + trait(P(u1, v1 - 0.03, z1 - 0.8), P(u1, v0 + 0.03, z1 - 0.8), 1, mixHex(c.right, '#FFFFFF', 0.3));
}

// Poteau rond (pilotis, bitte d'amarrage) en (u, v), de z0 à z1, rayon r (cases) : fût en dégradé, tête claire
export function poteau(u, v, z0, z1, r, c, id) {
  const [x, y0] = P(u, v, z0), [, y1] = P(u, v, z1);
  const rx = r * 45.25, ry = r * 22.63;
  return degrade(id, mixHex(c.left, '#FFFFFF', 0.12), c.right)
    + `<path d="M${f2(x - rx)},${f2(y1)} L${f2(x - rx)},${f2(y0)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y0)} L${f2(x + rx)},${f2(y1)} Z" fill="url(#${id})" stroke="${INK}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + `<ellipse cx="${f2(x)}" cy="${f2(y1)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${c.top}" stroke="${INK}" stroke-width="${TRAIT}"/>`
    + trait([x - rx * 0.45, y1 + ry + 1], [x - rx * 0.45, y0 - 1], 1, 'rgba(255,240,210,.55)');
}

// Galet du sol (socle) : rond, contour fin, reflet
export function galet(u, v, s, c = SABLE.galet) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${f2(x)}" cy="${f2(y - s * 0.3)}" rx="${f2(s)}" ry="${f2(s * 0.62)}" fill="${c.left}" stroke="${INK}" stroke-width="${DETAIL}"/>`
    + `<ellipse cx="${f2(x - s * 0.3)}" cy="${f2(y - s * 0.55)}" rx="${f2(s * 0.45)}" ry="${f2(s * 0.24)}" fill="${c.top}"/>`;
}

// Écume discrète au pied d'un pilotis, à la surface de la mer
export function ecume(u, v, r = 0.08) {
  const [x, y] = P(u, v, MER);
  return `<path d="M${f2(x - r * 70)},${f2(y + 1)} Q${f2(x)},${f2(y + r * 40)} ${f2(x + r * 70)},${f2(y + 1)}" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`
    + `<path d="M${f2(x - r * 110)},${f2(y + 3)} Q${f2(x)},${f2(y + r * 60 + 2)} ${f2(x + r * 110)},${f2(y + 3)}" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity=".5"/>`;
}

// Corde lovée (trois tours) posée à (u, v, z)
export function cordeLovee(u, v, z, s = 1) {
  const [x, y] = P(u, v, z);
  return [5.2, 3.6, 2].map((r, i) => `<ellipse cx="${f2(x)}" cy="${f2(y - i * 1.2)}" rx="${f2(r * s)}" ry="${f2(r * s * 0.5)}" fill="${i === 2 ? '#B98552' : 'none'}" stroke="${INK}" stroke-width="${f2(3.4 * s)}"/>`
    + `<ellipse cx="${f2(x)}" cy="${f2(y - i * 1.2)}" rx="${f2(r * s)}" ry="${f2(r * s * 0.5)}" fill="none" stroke="#E8C489" stroke-width="${f2(1.7 * s)}"/>`).join('');
}
