// Le trait « chibi » des bâtiments (cahier des charges du 11 oct.) : au niveau des personnages qui vivent autour.
// - Trait brun #3C2819 : épais sur les contours (TRAIT), plus fin sur les détails intérieurs (DETAIL), dans le repère
//   du jeu (le fichier de la bibliothèque le multiplie par 1,25).
// - Lumière en haut à gauche : un dégradé doux par grande surface, un reflet clair sur les arêtes hautes.
// - Formes rondes et généreuses : grosses planches peu nombreuses, poteaux ronds, détails lisibles.
// - Pas d'ombre en ellipse grise : le pied se pose sur des galets et une ombre de contact couleur du sol.
import { P, mixHex, HIVER, NEIGE, snowPan } from './iso.js';

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

// Toit à deux pans dont le faîtage suit v : le pignon (triangle) est sur la face +v, celle du joueur (la porte dessous) ;
// le pan qu'on voit est celui qui descend vers +u. Débord o, rive épaisse le long du pignon, neige l'hiver, rangs de
// tuiles rondes (rangs : nombre, couleur du trait). colors : { front, back, gable }
export function toitPignon(u0, v0, u1, v1, z, h, colors, o, id, rangs = 3) {
  const um = (u0 + u1) / 2;
  const R = P(um, v0 - o, z + h), Rf = P(um, v1 + o, z + h);
  const back = [[u0 - o, v0 - o, z], [u0 - o, v1 + o, z], [um, v1 + o, z + h], [um, v0 - o, z + h]];
  const front = [[um, v0 - o, z + h], [um, v1 + o, z + h], [u1 + o, v1 + o, z], [u1 + o, v0 - o, z]];
  const gable = [[u0, v1, z], [u1, v1, z], [um, v1, z + h]];
  let out = poly(back, colors.back) + (HIVER ? snowPan(R, Rf, P(u0 - o, v1 + o, z), P(u0 - o, v0 - o, z), 0.85) : '')
    + poly(gable, colors.gable)
    + degrade(`${id}-pan`, mixHex(colors.front, '#FFFFFF', 0.18), colors.front) + poly(front, `url(#${id}-pan)`);
  if (HIVER) out += snowPan(R, Rf, P(u1 + o, v1 + o, z), P(u1 + o, v0 - o, z), 0.8, true);
  else {
    // tuiles rondes en rangs, reflet sous le faîtage
    for (let r = 1; r <= rangs; r++) {
      const k = r / (rangs + 0.4);
      const at = v => P(um + (u1 + o - um) * k, v, z + h * (1 - k));
      let d = '';
      for (let v = v0 - o; v < v1 + o - 0.01; v += 0.13) {
        const p0 = at(v), p1 = at(Math.min(v + 0.13, v1 + o));
        d += `${d ? '' : `M${f2(p0[0])},${f2(p0[1])}`} Q${f2((p0[0] + p1[0]) / 2)},${f2((p0[1] + p1[1]) / 2 + 4)} ${f2(p1[0])},${f2(p1[1])}`;
      }
      out += `<path d="${d}" fill="none" stroke="rgba(30,45,80,.5)" stroke-width="1.4" stroke-linecap="round"/>`;
    }
    out += trait(P(um + 0.04, v0 - o + 0.05, z + h - 2), P(um + 0.04, v1 + o - 0.05, z + h - 2), 2, 'rgba(255,255,255,.45)');
  }
  // Rive du pignon : une planche épaisse qui suit les deux rampants, et le faîtage
  const rive = [P(u0 - o, v1 + o, z), P(um, v1 + o, z + h + 1), P(u1 + o, v1 + o, z)].map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
  out += `<polyline points="${rive}" fill="none" stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<polyline points="${rive}" fill="none" stroke="${HIVER ? NEIGE.light : mixHex(colors.back, '#3C2819', 0.15)}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>`
    + trait(R, Rf, 3.2, INK);
  return out;
}

// Galet rond du cercle de feu : contour épais, face sombre en bas à droite, reflet en haut à gauche
export function pierreRonde(u, v, s, c = { top: '#E9E2D2', left: '#CBBFA6', right: '#A3967C' }) {
  const [x, y] = P(u, v, 0);
  return `<ellipse cx="${f2(x)}" cy="${f2(y - s * 0.45)}" rx="${f2(s)}" ry="${f2(s * 0.78)}" fill="${c.left}" stroke="${INK}" stroke-width="${TRAIT}"/>`
    + `<path d="M${f2(x + s * 0.92)},${f2(y - s * 0.4)} A${f2(s)},${f2(s * 0.78)} 0 0 1 ${f2(x - s * 0.5)},${f2(y + s * 0.25)} Q${f2(x + s * 0.5)},${f2(y - s * 0.05)} ${f2(x + s * 0.92)},${f2(y - s * 0.4)} Z" fill="${c.right}"/>`
    + `<ellipse cx="${f2(x - s * 0.32)}" cy="${f2(y - s * 0.78)}" rx="${f2(s * 0.42)}" ry="${f2(s * 0.24)}" fill="${c.top}"/>`;
}
// Bûche couchée de (u0, v0) à (u1, v1), hauteur z (son dessous), rayon r px : écorce, reflet, bout scié à cernes
export function buche(u0, v0, u1, v1, z, r, c = { top: '#C98A52', left: '#9E6538', right: '#7A4824' }) {
  const proche = u1 + v1 >= u0 + v0;
  const e = P(proche ? u1 : u0, proche ? v1 : v0, z + r), g = P(proche ? u0 : u1, proche ? v0 : v1, z + r);
  const dx = e[0] - g[0], dy = e[1] - g[1];
  const ang = f2((Math.atan2(dy, dx) * 180) / Math.PI);
  const seg = (k0, k1, oy, w, col) => `<line x1="${f2(g[0] + dx * k0)}" y1="${f2(g[1] + dy * k0 + oy)}" x2="${f2(g[0] + dx * k1)}" y2="${f2(g[1] + dy * k1 + oy)}" stroke="${col}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;
  return seg(0, 1, 0, 2 * r + TRAIT * 2, INK) + seg(0, 1, 0, 2 * r, c.left) + seg(0.08, 0.92, r * 0.45, r * 0.7, c.right) + seg(0.1, 0.85, -r * 0.45, r * 0.5, c.top)
    + `<g transform="rotate(${ang} ${f2(e[0])} ${f2(e[1])})"><ellipse cx="${f2(e[0])}" cy="${f2(e[1])}" rx="${f2(r * 0.6)}" ry="${f2(r)}" fill="#EBC58E" stroke="${INK}" stroke-width="${DETAIL + 0.4}"/>`
    + `<ellipse cx="${f2(e[0])}" cy="${f2(e[1])}" rx="${f2(r * 0.3)}" ry="${f2(r * 0.5)}" fill="none" stroke="#B98552" stroke-width="1"/></g>`;
}
