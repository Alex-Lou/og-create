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

// Chemin fermé à coins arrondis (rayon r px, réduit sur les côtés courts) passant par des points écran
export function arrondi(points, r) {
  const n = points.length, vers = (a, b, d) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [a[0] + ((b[0] - a[0]) * d) / l, a[1] + ((b[1] - a[1]) * d) / l]; };
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = points[(i + n - 1) % n], c = points[i], q = points[(i + 1) % n];
    const k = Math.min(r, Math.hypot(p[0] - c[0], p[1] - c[1]) * 0.45, Math.hypot(q[0] - c[0], q[1] - c[1]) * 0.45);
    const a = vers(c, p, k), b = vers(c, q, k);
    d += `${i ? 'L' : 'M'}${f2(a[0])},${f2(a[1])} Q${f2(c[0])},${f2(c[1])} ${f2(b[0])},${f2(b[1])} `;
  }
  return `${d}Z`;
}
// Rocher : une boîte aux coins arrondis (silhouette au trait épais), faces en dégradé découpées dans la silhouette,
// arêtes intérieures douces, reflet clair sur les arêtes hautes, strates ; l'hiver, une calotte de neige sur le dessus
export function rocher(u0, v0, u1, v1, z0, z1, c, id, r = 6) {
  const A = P(u0, v0, z1), B = P(u0, v1, z1), C = P(u0, v1, z0), D = P(u1, v1, z0), E = P(u1, v0, z0), F = P(u1, v0, z1), G = P(u1, v1, z1);
  const sil = arrondi([A, B, C, D, E, F], r);
  const flat = l => l.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
  let out = degrade(`${id}-l`, c.left, mixHex(c.left, c.right, 0.35)) + degrade(`${id}-r`, mixHex(c.right, c.left, 0.25), c.right)
    + `<defs><clipPath id="${id}-s"><path d="${sil}"/></clipPath></defs><g clip-path="url(#${id}-s)">`
    + `<polygon points="${flat([B, C, D, G])}" fill="url(#${id}-l)"/><polygon points="${flat([G, D, E, F])}" fill="url(#${id}-r)"/>`
    + `<polygon points="${flat([A, B, G, F])}" fill="${HIVER ? NEIGE.light : c.top}"/>`;
  // strates ondulées sur les deux faces
  const h = z1 - z0, L = mixHex(c.left, INK, 0.3), R = mixHex(c.right, INK, 0.3);
  for (let i = 1; i <= Math.floor(h / 13); i++) {
    const z = z0 + (h * i) / (Math.floor(h / 13) + 1), w = i % 2 ? 1.3 : -1.1;
    const sL = [P(u0, v1, z), P(u0 + (u1 - u0) * 0.35, v1, z + w), P(u0 + (u1 - u0) * 0.7, v1, z - w * 0.6), P(u1, v1, z + w * 0.3)];
    const sR = [P(u1, v1, z - w * 0.4), P(u1, v1 + (v0 - v1) * 0.4, z + w * 0.6), P(u1, v1 + (v0 - v1) * 0.75, z - w * 0.3), P(u1, v0, z + w * 0.3)];
    out += `<polyline points="${flat(sL)}" fill="none" stroke="${L}" stroke-width="1" opacity=".55" stroke-linecap="round"/><polyline points="${flat(sR)}" fill="none" stroke="${R}" stroke-width="1" opacity=".55" stroke-linecap="round"/>`;
  }
  // arêtes intérieures et reflets
  out += trait(G, D, DETAIL, 'rgba(60,40,25,.55)')
    + `<polyline points="${flat([B, G, F])}" fill="none" stroke="rgba(60,40,25,.6)" stroke-width="${DETAIL}" stroke-linejoin="round"/>`
    + `<polyline points="${flat([[B[0] + 3, B[1] + 2.6], [G[0], G[1] + 2.4], [F[0] - 3, F[1] + 2.6]])}" fill="none" stroke="${HIVER ? NEIGE.light : mixHex(c.top, '#FFFFFF', 0.5)}" stroke-width="${HIVER ? 4 : 1.4}" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (HIVER) out += `<polyline points="${flat([[B[0] + 2, B[1] + 5.4], [G[0], G[1] + 5], [F[0] - 2, F[1] + 5.4]])}" fill="none" stroke="${NEIGE.shade}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>`;
  return `${out}</g><path d="${sil}" fill="none" stroke="${INK}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`;
}

// Arbre rond chibi en (u, v), échelle s : tronc évasé aux racines, feuillage de grosses boules (trait épais sur la seule
// silhouette, lobes marqués d'un fil sombre, volume clair en haut à gauche, reflets) ; l'hiver, de la neige sur le haut.
// colors : { light, mid, dark }
const BOULES = [[-10, -37, 11], [8, -41, 12], [17, -29, 9], [-17, -28, 9], [-9, -24, 10], [10, -23, 10], [0, -31, 11.5]];
export function arbreRond(u, v, s, colors, id) {
  const [x, y] = P(u, v, 0);
  const b = BOULES.map(([dx, dy, r]) => [x + dx * s, y + (dy - 5) * s, r * s]);
  const c = (cx, cy, r, fill, extra = '') => `<circle cx="${f2(cx)}" cy="${f2(cy)}" r="${f2(r)}" fill="${fill}"${extra}/>`;
  const w = 3.6 * s, t = y - 20 * s;
  let out = `<ellipse cx="${f2(x + 1)}" cy="${f2(y)}" rx="${f2(16 * s)}" ry="${f2(7 * s)}" fill="rgba(90,70,30,.2)"/>`
    + degrade(`${id}-t`, '#B47A48', '#7A4824')
    + `<path d="M${f2(x - w - 4 * s)},${f2(y + 1)} Q${f2(x - w)},${f2(y - 2 * s)} ${f2(x - w * 0.8)},${f2(t)} L${f2(x + w * 0.8)},${f2(t)} Q${f2(x + w)},${f2(y - 2 * s)} ${f2(x + w + 4 * s)},${f2(y + 1)} Q${f2(x)},${f2(y + 2.4 * s)} ${f2(x - w - 4 * s)},${f2(y + 1)} Z" fill="url(#${id}-t)" stroke="${INK}" stroke-width="${TRAIT}" stroke-linejoin="round"/>`
    + trait([x - w * 0.3, y - 2 * s], [x - w * 0.3, t + 2], 1, 'rgba(255,225,180,.5)');
  out += b.map(([cx, cy, r]) => c(cx, cy, r, INK, ` stroke="${INK}" stroke-width="${TRAIT * 2}"`)).join('')
    + b.map(([cx, cy, r]) => c(cx, cy, r, colors.dark)).join('')
    + b.map(([cx, cy, r]) => c(cx - r * 0.12, cy - r * 0.16, r * 0.84, colors.mid)).join('');
  out += [b[0], b[1], b[6], b[4]].map(([cx, cy, r]) => `<ellipse cx="${f2(cx - r * 0.34)}" cy="${f2(cy - r * 0.4)}" rx="${f2(r * 0.34)}" ry="${f2(r * 0.2)}" fill="${colors.light}" transform="rotate(-25 ${f2(cx - r * 0.34)} ${f2(cy - r * 0.4)})"/>`).join('');
  if (HIVER) out += [b[0], b[1], b[2], b[3]].map(([cx, cy, r]) => `<path d="M${f2(cx - r * 0.86)},${f2(cy - r * 0.4)} A${f2(r)},${f2(r)} 0 0 1 ${f2(cx + r * 0.86)},${f2(cy - r * 0.4)} Q${f2(cx + r * 0.5)},${f2(cy - r * 0.2)} ${f2(cx + r * 0.2)},${f2(cy - r * 0.36)} Q${f2(cx - r * 0.2)},${f2(cy - r * 0.16)} ${f2(cx - r * 0.86)},${f2(cy - r * 0.4)} Z" fill="${NEIGE.light}" stroke="${NEIGE.shade}" stroke-width="1"/>`).join('');
  return out;
}

// Bassin rond de pierre en (u, v), de z0 à z1, rayon R (cases) : fût en dégradé au trait épais, rangs de pierres,
// margelle claire, eau (glace l'hiver) avec reflets. pierre : { top, left, right }
export function bassinRond(u, v, z0, z1, R, pierre, id, eau = true) {
  const [x, y0] = P(u, v, z0), [, yh] = P(u, v, z1);
  const rx = R * 45.25, ry = R * 22.63, bord = ` stroke="${INK}" stroke-width="${TRAIT}" stroke-linejoin="round"`;
  const H = z1 - z0, n = Math.max(1, Math.round(H / 6));
  let out = degrade(id, pierre.left, pierre.right)
    + `<path d="M${f2(x - rx)},${f2(yh)} L${f2(x - rx)},${f2(y0)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y0)} L${f2(x + rx)},${f2(yh)} Z" fill="url(#${id})"${bord}/>`;
  for (let r = 1; r < n; r++) {
    const dz = (H * r) / n;
    out += `<path d="M${f2(x - rx)},${f2(y0 - dz)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y0 - dz)}" fill="none" stroke="rgba(70,55,35,.45)" stroke-width="${DETAIL}"/>`;
  }
  for (let r = 0; r < n; r++) {
    for (let a = r % 2 ? 0.45 : 0.85; a < Math.PI - 0.2; a += 0.75) {
      const px = x + rx * Math.cos(a), py = y0 + ry * Math.sin(a);
      out += trait([px, py - (H * r) / n], [px, py - (H * (r + 1)) / n], DETAIL, 'rgba(70,55,35,.45)');
    }
  }
  out += `<ellipse cx="${f2(x)}" cy="${f2(yh)}" rx="${f2(rx * 1.07)}" ry="${f2(ry * 1.07)}" fill="${HIVER ? NEIGE.light : pierre.top}"${bord}/>`;
  if (eau) {
    const glace = HIVER;
    out += degrade(`${id}-e`, glace ? '#E4F2FA' : '#4C8DB0', glace ? '#B9D7EA' : '#24506C', true)
      + `<ellipse cx="${f2(x)}" cy="${f2(yh + 0.6)}" rx="${f2(rx * 0.8)}" ry="${f2(ry * 0.76)}" fill="url(#${id}-e)" stroke="${INK}" stroke-width="${DETAIL}"/>`
      + `<path d="M${f2(x - rx * 0.5)},${f2(yh - ry * 0.25)} q${f2(rx * 0.18)},-2 ${f2(rx * 0.36)},0" stroke="${glace ? '#FFFFFF' : '#BFE3F5'}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
      + `<path d="M${f2(x + rx * 0.15)},${f2(yh + ry * 0.35)} q${f2(rx * 0.12)},-1.4 ${f2(rx * 0.24)},0" stroke="${glace ? '#FFFFFF' : '#9FD0EC'}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  }
  out += `<path d="M${f2(x - rx * 1.0)},${f2(yh + 1)} A${f2(rx)},${f2(ry)} 0 0 1 ${f2(x - rx * 0.1)},${f2(yh - ry * 1.0)}" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.5"/>`;
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
