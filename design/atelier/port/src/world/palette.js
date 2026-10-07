// Palette et petits motifs communs aux sprites de l'île : mêmes matières, même lumière, partout.
import { P, face, box, shadow, cylinder, mixHex, EDGE } from './iso.js';

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
// Bloc de roche taillée (carrière) : la boîte, un pied plus sombre, des strates ondulées sur les deux faces, l'arête du
// dessus éclairée, des éclats, une fissure sur chaque face et de la mousse au bord du dessus pour les grands blocs.
// Pas de hasard : tout se place selon les dimensions du bloc.
export function rockBox(u0, v0, u1, v1, z0, z1, c) {
  const h = z1 - z0, du = u1 - u0, dv = v1 - v0;
  const pts2 = list => list.map(q => P(...q).map(n => rnd2(n)).join(',')).join(' ');
  const line = (list, color, w, extra = '') => `<polyline points="${pts2(list)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const L = mixHex(c.left, INK_OUT, 0.38), R = mixHex(c.right, INK_OUT, 0.38);
  let out = box(u0, v0, u1, v1, z0, z1, c)
    + face([[u0, v1, z0], [u1, v1, z0], [u1, v1, z0 + 2.4], [u0, v1, z0 + 2.4]], 'rgba(40,30,20,.16)')
    + face([[u1, v0, z0], [u1, v1, z0], [u1, v1, z0 + 2.4], [u1, v0, z0 + 2.4]], 'rgba(40,30,20,.2)');
  const n = Math.floor(h / 14);
  for (let i = 1; i <= n; i++) {
    const z = z0 + (h * i) / (n + 1), w = i % 2 ? 1.4 : -1.2;
    out += line([[u0 + du * 0.02, v1, z], [u0 + du * 0.3, v1, z + w], [u0 + du * 0.62, v1, z - w * 0.7], [u1 - du * 0.02, v1, z + w * 0.4]], L, 0.8, ' opacity=".6"')
      + line([[u1, v0 + dv * 0.03, z - w * 0.5], [u1, v0 + dv * 0.4, z + w * 0.6], [u1, v0 + dv * 0.75, z - w * 0.3], [u1, v1 - dv * 0.02, z + w * 0.4]], R, 0.8, ' opacity=".6"');
  }
  const e = Math.min(0.035, du * 0.1, dv * 0.1);
  out += line([[u0 + e, v1 - e, z1], [u1 - e, v1 - e, z1], [u1 - e, v0 + e, z1]], mixHex(c.top, '#FFFFFF', 0.55), 1.1, ' opacity=".9"');
  if (h >= 7) {
    [[0.18, 0.3], [0.47, 0.62], [0.81, 0.4]].forEach(([a, b]) => {
      const [x, y] = P(u0 + du * a, v1, z0 + h * b), [x2, y2] = P(u1, v0 + dv * (1 - a), z0 + h * (1 - b * 0.8));
      out += `<path d="M${rnd2(x - 1.2)},${rnd2(y)} l1.2,-0.8 l1,0.9 Z" fill="${L}" opacity=".55"/><path d="M${rnd2(x2 - 1)},${rnd2(y2)} l1,-0.8 l1.1,0.8 Z" fill="${R}" opacity=".55"/>`;
    });
  }
  if (h >= 20 && du >= 0.3) {
    const cu = u0 + du * 0.7;
    out += line([[cu, v1, z1], [cu - 0.03, v1, z1 - h * 0.14], [cu + 0.015, v1, z1 - h * 0.26], [cu - 0.02, v1, z1 - h * 0.4]], INK_OUT, 0.9, ' opacity=".75"')
      + line([[cu + 0.015, v1, z1 - h * 0.26], [cu + 0.06, v1, z1 - h * 0.32]], INK_OUT, 0.7, ' opacity=".6"');
  }
  if (h >= 20 && dv >= 0.3) {
    const cv = v0 + dv * 0.35;
    out += line([[u1, cv, z1], [u1, cv + 0.03, z1 - h * 0.12], [u1, cv - 0.01, z1 - h * 0.22], [u1, cv + 0.02, z1 - h * 0.33]], INK_OUT, 0.9, ' opacity=".7"');
  }
  if (h >= 20) {
    const moss = (a, b, k) => {
      const q = [[-0.05, 0], [0, 0.02], [0.05, 0]].map(([d, dz]) => P(k === 'L' ? a + d : u1, k === 'L' ? v1 : b + d, z1 + dz * 10));
      const r = [2.2, 2.7, 2];
      return q.map(([x, y], i) => disc2(x, y, r[i] + 0.7, INK_OUT)).join('') + q.map(([x, y], i) => disc2(x, y, r[i], '#6E9E45')).join('')
        + q.map(([x, y], i) => disc2(x - 0.5, y - 0.6, r[i] * 0.7, '#8CBF5B')).join('')
        + `<path d="M${rnd2(q[1][0] - 1)},${rnd2(q[1][1] + 2)} q1,3.4 2,0" fill="#6E9E45" stroke="${INK_OUT}" stroke-width="0.6"/>`;
    };
    out += (du >= 0.5 ? moss(u0 + du * 0.24, 0, 'L') : '') + (dv >= 0.5 ? moss(0, v0 + dv * 0.68, 'R') : '');
  }
  return out;
}
// Margelle ronde de pierre (puits, bassins, vasques) : le cylindre, ses assises, l'arête avant du dessus éclairée et un
// pied plus sombre au ras du sol. Pierre blanche : assises plus pâles.
export function stoneRing(u, v, z0, z1, r, stone, id, n = 1) {
  const [x, y0] = P(u, v, z0), [, y1] = P(u, v, z1);
  const rx = r * 45.25, ry = r * 22.63;
  const arc = (yc, k) => `M${rnd2(x - rx * k)},${rnd2(yc)} A${rnd2(rx * k)},${rnd2(ry * k)} 0 0 0 ${rnd2(x + rx * k)},${rnd2(yc)}`;
  return cylinder(u, v, z0, z1, r, stone, id)
    + stoneCourses(u, v, z0, z1, r, n, stone.top === '#FFFFFF' ? 'rgba(120,110,95,.4)' : 'rgba(95,85,70,.45)')
    + `<path d="${arc(y0 - 1.2, 0.99)}" fill="none" stroke="rgba(40,30,20,.2)" stroke-width="2.2"/>`
    + `<path d="${arc(y1, 0.95)}" fill="none" stroke="${mixHex(stone.top, '#FFFFFF', 0.6)}" stroke-width="1.1"/>`;
}
// Eau d'un bassin rond de rayon r à la hauteur z : le bord arrière reste sombre (l'ombre de la margelle), le centre
// s'éclaircit vers l'avant, un reflet, deux rides et deux éclats
export function pool(u, v, z, r, deep = '#4C9CC8', light = '#7CC4E8') {
  const [x, y] = P(u, v, z);
  const rx = r * 45.25, ry = r * 22.63;
  const ripple = k => `<path d="M${rnd2(x + rx * (0.15 - k))},${rnd2(y + ry * 0.18)} A${rnd2(rx * k)},${rnd2(ry * k)} 0 0 0 ${rnd2(x + rx * (0.15 + k))},${rnd2(y + ry * 0.18)}" fill="none" stroke="#FFFFFF" stroke-width="0.7" opacity=".6"/>`;
  const star = (sx, sy, k) => `<path d="M${rnd2(sx)},${rnd2(sy - k)} L${rnd2(sx + k * 0.3)},${rnd2(sy - k * 0.3)} L${rnd2(sx + k)},${rnd2(sy)} L${rnd2(sx + k * 0.3)},${rnd2(sy + k * 0.3)} L${rnd2(sx)},${rnd2(sy + k)} L${rnd2(sx - k * 0.3)},${rnd2(sy + k * 0.3)} L${rnd2(sx - k)},${rnd2(sy)} L${rnd2(sx - k * 0.3)},${rnd2(sy - k * 0.3)} Z" fill="#FFFFFF"/>`;
  const k = Math.min(2.6, Math.max(1.2, r * 4));
  return `<ellipse cx="${rnd2(x)}" cy="${rnd2(y)}" rx="${rnd2(rx)}" ry="${rnd2(ry)}" fill="${deep}"/>`
    + `<ellipse cx="${rnd2(x)}" cy="${rnd2(y + ry * 0.12)}" rx="${rnd2(rx * 0.92)}" ry="${rnd2(ry * 0.8)}" fill="${mixHex(deep, light, 0.45)}"/>`
    + `<ellipse cx="${rnd2(x - rx * 0.3)}" cy="${rnd2(y - ry * 0.08)}" rx="${rnd2(rx * 0.36)}" ry="${rnd2(ry * 0.3)}" fill="${light}" opacity=".75"/>`
    + ripple(0.36) + ripple(0.2)
    + star(x + rx * 0.5, y - ry * 0.12, k) + star(x - rx * 0.52, y + ry * 0.36, k * 0.7);
}
// Anse du Ponton, ronde, de rayon r autour de (u, v) : rive de sable détourée, haut-fond clair, eau plus profonde au
// centre, liseré d'écume, vaguelettes et deux éclats
export function cove(u, v, r, light = '#6FC0E4', deep = '#5AAED7') {
  const [x, y] = P(u, v, 0);
  const rx = r * 45.25, ry = r * 22.63;
  const el = (cx, cy, ax, ay, extra) => `<ellipse cx="${rnd2(cx)}" cy="${rnd2(cy)}" rx="${rnd2(ax)}" ry="${rnd2(ay)}"${extra}/>`;
  const wave = (a, b, k) => { const wx = x + rx * a, wy = y + ry * b; return `<path d="M${rnd2(wx - 3 * k)},${rnd2(wy)} q${rnd2(1.5 * k)},${rnd2(-1.6 * k)} ${rnd2(3 * k)},0 q${rnd2(1.5 * k)},${rnd2(1.6 * k)} ${rnd2(3 * k)},0" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity=".7"/>`; };
  const star = (sx, sy, k) => `<path d="M${rnd2(sx)},${rnd2(sy - k)} L${rnd2(sx + k * 0.3)},${rnd2(sy - k * 0.3)} L${rnd2(sx + k)},${rnd2(sy)} L${rnd2(sx + k * 0.3)},${rnd2(sy + k * 0.3)} L${rnd2(sx)},${rnd2(sy + k)} L${rnd2(sx - k * 0.3)},${rnd2(sy + k * 0.3)} L${rnd2(sx - k)},${rnd2(sy)} L${rnd2(sx - k * 0.3)},${rnd2(sy - k * 0.3)} Z" fill="#FFFFFF"/>`;
  const k = Math.min(1.6, Math.max(1, r));
  return el(x, y, rx * 1.02, ry * 1.02, ` fill="#EAD9A6" stroke="${INK_OUT}" stroke-width="0.7"`)
    + el(x, y, rx * 0.93, ry * 0.91, ` fill="${light}"`)
    + el(x, y - ry * 0.04, rx * 0.8, ry * 0.76, ` fill="${deep}"`)
    + el(x, y - ry * 0.1, rx * 0.58, ry * 0.48, ` fill="${mixHex(deep, '#2F7FB0', 0.4)}" opacity=".55"`)
    + el(x, y, rx * 0.87, ry * 0.84, ' fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-dasharray="7 5" opacity=".55"')
    + [[-0.55, 0.3], [0.5, 0.45], [-0.15, 0.62], [0.62, -0.2], [-0.62, -0.3]].map(([a, b]) => wave(a, b, k)).join('')
    + star(x - rx * 0.4, y + ry * 0.45, 1.8 * k) + star(x + rx * 0.3, y + ry * 0.7, 1.3 * k);
}
// Planche de terre du Potager de [u0, u1] × [v0, v1], haute de h : la boîte de terre, l'arête avant du dessus éclairée,
// des grumeaux sur les flancs et quelques mottes sur le dessus (places fixes)
export function soilBed(u0, v0, u1, v1, h) {
  const du = u1 - u0, dv = v1 - v0;
  const pt = q => P(...q).map(n => rnd2(n)).join(',');
  const speck = (q, rx, c) => { const [x, y] = P(...q); return `<ellipse cx="${rnd2(x)}" cy="${rnd2(y)}" rx="${rx}" ry="${rnd2(rx * 0.6)}" fill="${c}"/>`; };
  return box(u0, v0, u1, v1, 0, h, SOIL)
    + `<polyline points="${pt([u0 + 0.02, v1 - 0.02, h])} ${pt([u1 - 0.02, v1 - 0.02, h])} ${pt([u1 - 0.02, v0 + 0.02, h])}" fill="none" stroke="#B07A50" stroke-width="1" opacity=".9"/>`
    + [0.12, 0.31, 0.5, 0.66, 0.84].map((a, k) => speck([u0 + du * a, v1, h * (k % 2 ? 0.35 : 0.62)], 1, k % 2 ? '#4E301C' : '#946240')).join('')
    + [0.2, 0.45, 0.72].map((a, k) => speck([u1, v0 + dv * a, h * (k % 2 ? 0.6 : 0.35)], 0.9, k % 2 ? '#946240' : '#3F2716')).join('')
    + [[0.08, 0.92], [0.5, 0.95], [0.93, 0.5], [0.95, 0.12]].map(([a, b], k) => speck([u0 + du * a, v0 + dv * b, h], 1.4, k % 2 ? '#7A4E30' : '#A87445')).join('');
}
// Sillon de terre le long de u, de u0 à u1, centré en v, demi-largeur w, à la hauteur z : creux sombre, la pente
// éclairée de la butte suivante
export function furrow(u0, u1, v, w, z) {
  const pt = q => P(...q).map(n => rnd2(n)).join(',');
  return face([[u0, v - w, z], [u1, v - w, z], [u1, v + w, z], [u0, v + w, z]], '#6B4329')
    + `<polyline points="${pt([u0, v - w * 0.4, z])} ${pt([u1, v - w * 0.4, z])}" fill="none" stroke="#5A3820" stroke-width="0.9"/>`
    + `<polyline points="${pt([u0, v + w, z])} ${pt([u1, v + w, z])}" fill="none" stroke="#B07A50" stroke-width="0.9" opacity=".85"/>`;
}
// Paire de feuilles détourées en V au pied (x, y) d'un plant : demi-axes rx × ry, écart d ; nervure claire
export function leafPair(x, y, rx, ry, d, c1 = '#86CB5E', c2 = '#6DB64C') {
  const leaf = (cx, a, c) => `<g transform="rotate(${a} ${rnd2(cx)} ${rnd2(y - d)})"><ellipse cx="${rnd2(cx)}" cy="${rnd2(y - d)}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${INK_OUT}" stroke-width="0.5"/>`
    + `<line x1="${rnd2(cx - rx * 0.7)}" y1="${rnd2(y - d)}" x2="${rnd2(cx + rx * 0.7)}" y2="${rnd2(y - d)}" stroke="#C8EBA0" stroke-width="0.5" opacity=".8"/></g>`;
  return leaf(x - d, -30, c1) + leaf(x + d, 30, c2);
}
// Bardeaux de bois sur le pan avant d'un toit à deux pans (même géométrie que gable) : rangs, joints décalés, reflet
export function shingles(u0, v0, u1, v1, z, h, o = 0.08) {
  const vm = (v0 + v1) / 2, a = u0 - o, b = u1 + o, ve = v1 + o;
  const at = (u, k) => P(u, vm + (ve - vm) * k, z + h * (1 - k)).map(n => rnd2(n)).join(',');
  return [0.2, 0.4, 0.6, 0.8].map((k, r) => {
    let out = `<polyline points="${at(a, k)} ${at(b, k)}" stroke="rgba(60,35,20,.45)" stroke-width="0.8"/>`
      + `<polyline points="${at(a, k - 0.16)} ${at(b, k - 0.16)}" stroke="rgba(255,235,210,.2)" stroke-width="0.6"/>`;
    for (let u = a + (r % 2 ? 0.07 : 0.14); u < b - 0.03; u += 0.14) out += `<polyline points="${at(u, k - 0.2)} ${at(u, k)}" stroke="rgba(60,35,20,.35)" stroke-width="0.6"/>`;
    return out;
  }).join('');
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
// Texture du toit d'un bâtiment : celle du skin de toit porté, sinon celle de son toit d'origine (base : un skin de
// toit, « toit-rouge » pour les tuiles rouges d'origine)
export function roofTextureOf(skin, base, ...geo) {
  return roofTexture(ROOF_KIND[skin] ? skin : base, ...geo);
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
