// La gravure découpée (choix de l'auteur, 16 oct., d'après les cinématiques d'Alice Madness Returns) : chaque pièce est
// une découpe de papier vieilli (ocre, moutarde, sarcelle), cernée d'un trait d'encre noir épais, modelée à la manière
// d'une gravure : des hachures parallèles qui se resserrent du côté de l'ombre, des contre-hachures dans les noirs, des
// tailles qui suivent le contour. Jamais de tranche blanche ; une ombre portée sombre et douce. Sans filtre : les
// hachures sont découpées à la pièce (clipPath) et dosées par un masque en dégradé, du côté opposé à la lumière.
const { hash, f } = require('./ouverture');
const { rugueux, courbe } = require('./papier');

const ENCRE = '#0D0905';
// une ellipse en points
const ovale = (x, y, rx, ry, n = 20, a0 = 0) => courbe(t => [x + rx * Math.cos(a0 + t * Math.PI * 2), y + ry * Math.sin(a0 + t * Math.PI * 2)], n).slice(0, -1);
// un contour poussé vers l'extérieur de d (vers l'intérieur si d < 0)
function gonfle(pts, d) {
  const n = pts.length;
  let aire = 0;
  for (let i = 0; i < n; i++) aire += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
  const sens = aire >= 0 ? 1 : -1;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [p[0] + (sens * dy * d) / l, p[1] - (sens * dx * d) / l];
  });
}
const chemin = (pts, ferme = false) => `M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}${ferme ? ' Z' : ''}`;

// L'atelier d'un dessin : ses définitions (dégradés, découpes, masques), nommées d'après son préfixe
function atelier(pref) {
  let n = 0;
  const defs = [];
  const id = () => `${pref}${n++}`;
  const stops = list => list.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('');
  const A = {
    lin(list, x1, y1, x2, y2) { const i = id(); defs.push(`<linearGradient id="${i}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${stops(list)}</linearGradient>`); return `url(#${i})`; },
    rad(list, cx, cy, r) { const i = id(); defs.push(`<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}">${stops(list)}</radialGradient>`); return `url(#${i})`; },
    clip(d) { const i = id(); defs.push(`<clipPath id="${i}"><path d="${d}"/></clipPath>`); return `url(#${i})`; },
    // un masque : ce qu'il montre (blanc) et cache (noir), sur un cadre
    masque(peinture, [x, y, w, h]) { const i = id(); defs.push(`<mask id="${i}" maskUnits="userSpaceOnUse" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${peinture}"/></mask>`); return `url(#${i})`; },
    // le papier vieilli : des taches et des fibres, posées sur une pièce
    papier() {
      if (A._papier) return A._papier;
      const i = id(), t = Array.from({ length: 10 }, (_, k) => `<ellipse cx="${f(hash(k, 1) * 90)}" cy="${f(hash(k, 2) * 90)}" rx="${f(8 + 14 * hash(k, 3))}" ry="${f(5 + 9 * hash(k, 4))}" fill="${k % 3 ? '#3A2408' : '#FFF4C0'}" opacity="${k % 3 ? 0.035 : 0.03}"/>`).join('')
        + Array.from({ length: 50 }, (_, k) => `<circle cx="${f(hash(k, 5) * 90)}" cy="${f(hash(k, 6) * 90)}" r="${f(0.3 + 0.5 * hash(k, 7))}" fill="#2A1A06" opacity="0.18"/>`).join('');
      defs.push(`<pattern id="${i}" patternUnits="userSpaceOnUse" width="90" height="90">${t}</pattern>`);
      return (A._papier = `url(#${i})`);
    },
    out(body) { return `<defs>${defs.join('')}</defs>${body}`; }
  };
  return A;
}

// la lumière de la scène : d'où elle vient (un vecteur vers elle), en haut à droite par défaut
let LUMIERE = [0.55, -0.83];
const lumiere = v => { const l = Math.hypot(v[0], v[1]); LUMIERE = [v[0] / l, v[1] / l]; };

// des hachures : des traits parallèles (angle en degrés, pas), sur un cadre, un peu tremblés
function hachures([x, y, w, h], angle, pas, seed) {
  const a = (angle * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, cx = x + w / 2, cy = y + h / 2, R = Math.hypot(w, h) / 2 + 2;
  let d = '';
  for (let k = -R, i = 0; k <= R; k += pas, i++) {
    const j1 = (hash(i, seed) - 0.5) * pas * 0.5, j2 = (hash(i, seed + 1) - 0.5) * pas * 0.5;
    d += `M${f(cx + nx * (k + j1) - ux * R)},${f(cy + ny * (k + j1) - uy * R)} L${f(cx + nx * (k + j2) + ux * R)},${f(cy + ny * (k + j2) + uy * R)} `;
  }
  return d;
}
const boite = pts => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0 - 3, y0 - 3, x1 - x0 + 6, y1 - y0 + 6]; };

// Une pièce gravée. A : l'atelier ; pts : son contour ; couleur : son papier (ou une peinture). o : { seed, amp, angle
// (des hachures), pas, ombre (où l'ombre commence, de 0 : côté lumière à 1), noir (où commencent les contre-hachures),
// tailles (des traits de contour, du côté de l'ombre), trait (l'épaisseur du cerne), portee (l'ombre portée), lumiere
// (un vecteur vers la lumière, pour cette pièce), encre (la couleur des traits) }
function gravure(A, pts, couleur, o = {}) {
  const amp = o.amp ?? 0.5, seed = o.seed ?? 1, d = rugueux(pts, amp, seed, 6), b = boite(pts), [bx, by, bw, bh] = b;
  const L = o.lumiere || LUMIERE, cx = bx + bw / 2, cy = by + bh / 2, R = Math.hypot(bw, bh) / 2, encre = o.encre ?? ENCRE;
  // (du côté de la lumière vers celui de l'ombre)
  const sens = (debut, fin = 1) => A.masque(A.lin([[0, '#000'], [debut, '#000'], [fin, '#FFF']], cx + L[0] * R, cy + L[1] * R, cx - L[0] * R, cy - L[1] * R), b);
  const clip = A.clip(d), pas = o.pas ?? 3, angle = o.angle ?? 38;
  let s = o.portee === 0 ? '' : `<path d="${d}" fill="#000" opacity="${o.portee ?? 0.4}" transform="translate(${o.dx ?? 3} ${o.dy ?? 4})"/>`;
  s += `<path d="${d}" fill="${couleur}"/><path d="${d}" fill="${A.papier()}"/>`;
  s += `<g clip-path="${clip}">`;
  // le modelé : l'ombre peinte qui gagne la pièce, du côté opposé à la lumière ; un reflet du côté de la lumière
  s += `<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="${A.lin([[0, '#FFF2C0', o.reflet ?? 0.18], [0.45, '#FFF2C0', 0], [0.55, '#1A0E04', 0], [1, '#1A0E04', o.modele ?? 0.42]], cx + L[0] * R, cy + L[1] * R, cx - L[0] * R, cy - L[1] * R)}"/>`;
  s += `<path d="${hachures(b, angle, pas, seed)}" stroke="${encre}" stroke-width="${o.epaisseur ?? 1.1}" mask="${sens(o.ombre ?? 0.22)}" fill="none"/>`;
  if (o.noir !== false) s += `<path d="${hachures(b, angle + 74, pas * 1.05, seed + 7)}" stroke="${encre}" stroke-width="${(o.epaisseur ?? 1.1) * 0.9}" mask="${sens(o.noir ?? 0.55)}" fill="none"/>`;
  // les tailles : des traits qui suivent le contour, à l'intérieur, du côté de l'ombre
  const tailles = o.tailles ?? 2;
  if (tailles) { let t = ''; for (let k = 1; k <= tailles; k++) t += rugueux(gonfle(pts, -k * (o.tailleP ?? 3)), amp * 0.6, seed + 20 + k, 6) + ' '; s += `<path d="${t}" stroke="${encre}" stroke-width="0.6" fill="none" mask="${sens(0.45)}"/>`; }
  if (o.dans) s += o.dans;
  s += '</g>';
  s += `<path d="${d}" fill="none" stroke="${encre}" stroke-width="${o.trait ?? 2}" stroke-linejoin="round"/>`;
  return s;
}
// un trait d'encre
const trait = (d, w = 1.2, c = ENCRE, op = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;

module.exports = { atelier, gravure, hachures, trait, ovale, gonfle, chemin, boite, lumiere, ENCRE };
