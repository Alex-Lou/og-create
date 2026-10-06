// Kit commun des paliers III à VII : cadre des grandes emprises, petits volumes récurrents (tour, toit conique,
// cheminée, chemin dallé, lanterne) sur la même géométrie et la même lumière que le reste.
import { P, box, face, gable, disc, cylinder, sprite, EDGE } from '../iso.js';
import { WOOD, WOOD_DARK, STONE, BRICK } from '../palette.js';

// Cadre d'un bâtiment de 3 × 3 cases (losange de ±96 px en largeur), assez haut pour un château
export const BIG_BOX = { x: -112, y: -200, w: 224, h: 264 };
export const big = body => sprite(body, BIG_BOX);

export const f2 = n => Math.round(n * 100) / 100;
export const xy = ([x, y]) => `${f2(x)},${f2(y)}`;
export const ln = (a, b, color, w = 1.2, extra = '') => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
export const poly = (points, fill, extra = '') => `<polygon points="${points.map(xy).join(' ')}" fill="${fill}"${extra}/>`;
export const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
export const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;
export const OUT = '#3C2819';
export const SLATE = { front: '#7D8AA0', back: '#5C6880' };
export const DARK_STONE = { top: '#B9B2A2', left: '#968E7C', right: '#736B5B' };
export const PLASTER = { top: '#FFF8EA', left: '#F6E9CF', right: '#DCC9A6' };
export const TIMBER = '#7A4E2C';
export const IRON = { top: '#B4BEC8', left: '#8E99A4', right: '#68737E' };
export const GOLD = { top: '#FFE08A', left: '#F2C04B', right: '#C8952A' };

// Toit conique sur une tour ronde : de (u, v, z), rayon r (cases), hauteur h ; colors { light, dark }
export function cone(u, v, z, r, h, colors, id) {
  const [x, y] = P(u, v, z);
  const rx = r * 45.25;
  const ry = r * 22.63;
  const apex = y - h;
  // Points de tangence du sommet à l'ellipse de base (si le sommet dépasse le haut de l'ellipse)
  const ty = h > ry ? y - (ry * ry) / h : y;
  const tx = h > ry ? rx * Math.sqrt(Math.max(0, 1 - ((y - ty) / ry) ** 2)) : rx;
  return `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${colors.light}"/><stop offset="1" stop-color="${colors.dark}"/></linearGradient></defs>`
    + `<path d="M${f2(x)},${f2(apex)} L${f2(x + tx)},${f2(ty)} A${f2(rx)},${f2(ry)} 0 1 1 ${f2(x - tx)},${f2(ty)} Z" fill="url(#${id})" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + `<path d="M${f2(x - rx)},${f2(y)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x + rx)},${f2(y)}" fill="none" stroke="rgba(40,30,50,.35)" stroke-width="1.2"/>`;
}
// Tour ronde : fût de pierre, meurtrières, toit conique et épi
export function tower(u, v, r, z0, z1, { stone = STONE, roof = { light: '#86B6E6', dark: '#3F6FA3' }, roofH = 26, id = 't' } = {}) {
  const [x, y] = P(u, v, z1);
  let slits = '';
  for (let k = 0; k < 2; k++) {
    const [sx, sy] = P(u - r * 0.3 + k * r * 0.6, v + r * 0.5, z0 + (z1 - z0) * (0.45 + k * 0.2));
    slits += `<rect x="${f2(sx - 1)}" y="${f2(sy - 3)}" width="2" height="6" rx="1" fill="#3A2A1E"/>`;
  }
  return cylinder(u, v, z0, z1, r, stone, `${id}-wall`)
    + `<path d="M${f2(x - r * 45.25)},${f2(y + 3)} A${f2(r * 45.25)},${f2(r * 22.63)} 0 0 0 ${f2(x + r * 45.25)},${f2(y + 3)}" fill="none" stroke="rgba(90,80,65,.35)" stroke-width="0.8"/>`
    + slits
    + cone(u, v, z1, r * 1.18, roofH, roof, `${id}-roof`)
    + ln([x, y - roofH], [x, y - roofH - 7], '#7A5A3A', 1.2) + dot(x, y - roofH - 8, 1.8, GOLD.left);
}
// Cheminée de briques posée à (u, v), du toit z0 jusqu'à z1
export function chimney(u, v, z0, z1, s = 0.08, colors = BRICK) {
  return box(u - s, v - s, u + s, v + s, z0, z1, colors) + box(u - s - 0.02, v - s - 0.02, u + s + 0.02, v + s + 0.02, z1, z1 + 2.5, DARK_STONE);
}
// Chemin dallé posé au sol, du point a au point b (en cases), largeur w
export function pavedPath(a, b, w = 0.22) {
  const [ua, va] = a;
  const [ub, vb] = b;
  const len = Math.hypot(ub - ua, vb - va);
  const nu = -(vb - va) / len * (w / 2);
  const nv = (ub - ua) / len * (w / 2);
  let out = face([[ua + nu, va + nv, 0.3], [ub + nu, vb + nv, 0.3], [ub - nu, vb - nv, 0.3], [ua - nu, va - nv, 0.3]], '#E2D3B4');
  const n = Math.max(2, Math.round(len / 0.14));
  for (let k = 0; k < n; k++) {
    const t0 = (k + 0.1) / n;
    const t1 = (k + 0.9) / n;
    const side = k % 2 ? 0.5 : 0;
    const p = (t, s) => [ua + (ub - ua) * t + nu * s, va + (vb - va) * t + nv * s, 0.5];
    out += face([p(t0, -0.85 + side), p(t1, -0.85 + side), p(t1, side - 0.05), p(t0, side - 0.05)], '#F0E4C8', ' stroke="rgba(150,130,100,.35)" stroke-width="0.5"');
  }
  return out;
}
// Lanterne sur poteau (lumière de nuit à prévoir dans le palier)
export function lampPost(u, v, h = 26) {
  const [x, y] = P(u, v, h);
  return box(u - 0.02, v - 0.02, u + 0.02, v + 0.02, 0, h, { top: '#3D3A36', left: '#55504A', right: '#3D3A36' })
    + `<path d="M${f2(x - 3.4)},${f2(y)} L${f2(x - 2.4)},${f2(y - 6)} L${f2(x + 2.4)},${f2(y - 6)} L${f2(x + 3.4)},${f2(y)} Z" fill="#FFE08A" stroke="#3D3A36" stroke-width="0.8"/>`
    + `<path d="M${f2(x - 3.8)},${f2(y - 6)} L${f2(x)},${f2(y - 9)} L${f2(x + 3.8)},${f2(y - 6)} Z" fill="#3D3A36"/>`;
}
// Massif de fleurs : petites touffes colorées autour de (u, v)
export function flowerBed(u, v, r = 0.18, colors = ['#F7A8C8', '#FFD45E', '#FFFFFF', '#E2574C']) {
  let out = disc(u, v, 0.2, r, '#7FBF5C');
  for (let k = 0; k < 9; k++) {
    const a = k * 2.4;
    const [x, y] = P(u + Math.cos(a) * r * 0.7 * ((k % 3) / 3 + 0.4), v + Math.sin(a) * r * 0.7 * ((k % 3) / 3 + 0.4), 3);
    out += dot(x, y, 1.6, colors[k % colors.length]) + dot(x, y, 0.6, '#FFF4C0');
  }
  return out;
}
// Fenêtre à petits bois sur la face gauche (v = vf) : u de ua à ub, z de z0 à z1 ; glass, volets
export function shuttered(ua, ub, vf, z0, z1, shutter = '#5C83C2', glass = '#FFE6A3') {
  const w = (ub - ua) * 0.42;
  return face([[ua, vf, z0], [ub, vf, z0], [ub, vf, z1], [ua, vf, z1]], glass, ' stroke="#FFFFFF" stroke-width="1"')
    + ln(P((ua + ub) / 2, vf, z0), P((ua + ub) / 2, vf, z1), '#FFFFFF', 0.8) + ln(P(ua, vf, (z0 + z1) / 2), P(ub, vf, (z0 + z1) / 2), '#FFFFFF', 0.8)
    + face([[ua - w, vf, z0], [ua, vf, z0], [ua, vf, z1], [ua - w, vf, z1]], shutter, EDGE)
    + face([[ub, vf, z0], [ub + w, vf, z0], [ub + w, vf, z1], [ub, vf, z1]], shutter, EDGE);
}
export function windowR(uf, va, vb, z0, z1, glass = '#FFE6A3') {
  return face([[uf, va, z0], [uf, vb, z0], [uf, vb, z1], [uf, va, z1]], glass, ' stroke="#FFFFFF" stroke-width="1"')
    + ln(P(uf, (va + vb) / 2, z0), P(uf, (va + vb) / 2, z1), '#FFFFFF', 0.8);
}
// Planches verticales sur une face gauche (bardage)
export function boardsLeft(u0, u1, vf, z0, z1, step = 0.07, color = 'rgba(60,35,15,.3)') {
  let out = '';
  for (let u = u0 + step; u < u1 - 0.01; u += step) out += ln(P(u, vf, z0), P(u, vf, z1), color, 0.6);
  return out;
}
export function boardsRight(uf, v0, v1, z0, z1, step = 0.07, color = 'rgba(40,20,10,.3)') {
  let out = '';
  for (let v = v0 + step; v < v1 - 0.01; v += step) out += ln(P(uf, v, z0), P(uf, v, z1), color, 0.6);
  return out;
}
// Pans de bois (colombages) sur une face gauche : poteaux, traverse, croix de Saint-André
export function timberLeft(u0, u1, vf, z0, z1) {
  const n = Math.max(2, Math.round((u1 - u0) / 0.22));
  const du = (u1 - u0) / n;
  let out = ln(P(u0, vf, z0), P(u1, vf, z0), TIMBER, 1.6) + ln(P(u0, vf, z1), P(u1, vf, z1), TIMBER, 1.6);
  for (let k = 0; k <= n; k++) out += ln(P(u0 + k * du, vf, z0), P(u0 + k * du, vf, z1), TIMBER, 1.4);
  for (let k = 0; k < n; k += 2) out += ln(P(u0 + k * du, vf, z0), P(u0 + (k + 1) * du, vf, z1), TIMBER, 1.1) + ln(P(u0 + (k + 1) * du, vf, z0), P(u0 + k * du, vf, z1), TIMBER, 1.1);
  return out;
}
export function timberRight(uf, v0, v1, z0, z1) {
  const n = Math.max(2, Math.round((v1 - v0) / 0.22));
  const dv = (v1 - v0) / n;
  let out = ln(P(uf, v0, z0), P(uf, v1, z0), TIMBER, 1.6) + ln(P(uf, v0, z1), P(uf, v1, z1), TIMBER, 1.6);
  for (let k = 0; k <= n; k++) out += ln(P(uf, v0 + k * dv, z0), P(uf, v0 + k * dv, z1), TIMBER, 1.4);
  return out;
}
// Assises de pierre sur une face gauche (lignes horizontales et joints décalés)
export function courseLeft(u0, u1, vf, z0, z1, rows = 3, color = 'rgba(90,80,65,.32)') {
  let out = '';
  const dz = (z1 - z0) / rows;
  for (let r = 1; r < rows; r++) out += ln(P(u0, vf, z0 + r * dz), P(u1, vf, z0 + r * dz), color, 0.6);
  for (let r = 0; r < rows; r++) {
    for (let u = u0 + (r % 2 ? 0.07 : 0.14); u < u1 - 0.03; u += 0.14) out += ln(P(u, vf, z0 + r * dz), P(u, vf, z0 + (r + 1) * dz), color, 0.5);
  }
  return out;
}
export function courseRight(uf, v0, v1, z0, z1, rows = 3, color = 'rgba(70,60,45,.32)') {
  let out = '';
  const dz = (z1 - z0) / rows;
  for (let r = 1; r < rows; r++) out += ln(P(uf, v0, z0 + r * dz), P(uf, v1, z0 + r * dz), color, 0.6);
  for (let r = 0; r < rows; r++) {
    for (let v = v0 + (r % 2 ? 0.07 : 0.14); v < v1 - 0.03; v += 0.14) out += ln(P(uf, v, z0 + r * dz), P(uf, v, z0 + (r + 1) * dz), color, 0.5);
  }
  return out;
}
// Tonneau et caisse, accessoires de bord
export function barrel(u, v, id, h = 12) {
  const [x, y] = P(u, v, 0);
  return disc(u + 0.1, v + 0.02, 0, 0.13, 'rgba(40,55,20,.2)') + cylinder(u, v, 0, h, 0.1, { top: '#C9935E', left: WOOD.left, right: WOOD.right }, id)
    + `<path d="M${f2(x - 7.1)},${f2(y - h * 0.25)} A7.1,3.55 0 0 0 ${f2(x + 7.1)},${f2(y - h * 0.25)} M${f2(x - 7.1)},${f2(y - h * 0.78)} A7.1,3.55 0 0 0 ${f2(x + 7.1)},${f2(y - h * 0.78)}" stroke="#5E3A22" stroke-width="1" fill="none"/>`;
}
export function crate(u, v, s = 0.13, h = 10) {
  const [x, y] = P(u, v + s, h / 2);
  return box(u - s, v - s, u + s, v + s, 0, h, { top: '#E0B47A', left: '#C99359', right: '#A06F3C' })
    + ln([x - 6, y - 3], [x + 2, y + 3], 'rgba(90,55,25,.5)', 0.8);
}
// Ouverture en plein cintre sur la face gauche (plan v = vf) : centre uc, demi-largeur w (cases), de z0, hauteur h
export function archLeft(uc, w, vf, z0, h, fill = '#3A2A1E', extra = '') {
  const pts = [[uc - w, vf, z0], [uc - w, vf, z0 + h - w * 32]];
  for (let k = 1; k < 12; k++) {
    const a = Math.PI - (k / 12) * Math.PI;
    pts.push([uc + Math.cos(a) * w, vf, z0 + h - w * 32 + Math.sin(a) * w * 32]);
  }
  pts.push([uc + w, vf, z0 + h - w * 32], [uc + w, vf, z0]);
  return face(pts, fill, extra);
}
export { P, box, face, gable, disc, cylinder, EDGE, WOOD, WOOD_DARK, STONE, BRICK };
// Lucarne sur le pan avant d'un toit à deux pans (faîtage le long de u, pan de vm à ve, de zr à ze) :
// fenêtre verticale centrée en u, à la fraction k du pan, avec son petit toit
export function dormer(u, w, vm, ve, zr, ze, k, roof) {
  const v = vm + (ve - vm) * k;
  const z0 = zr + (ze - zr) * k;
  const h = 11;
  return face([[u - w, v, z0], [u + w, v, z0], [u + w, v, z0 + h], [u - w, v, z0 + h]], PLASTER.left, EDGE)
    + face([[u - w * 0.6, v, z0 + 1.5], [u + w * 0.6, v, z0 + 1.5], [u + w * 0.6, v, z0 + h - 1.5], [u - w * 0.6, v, z0 + h - 1.5]], '#FFE6A3', ' stroke="#FFFFFF" stroke-width="0.8"')
    + face([[u + w, v, z0], [u + w, v - 0.12, z0 + 4], [u + w, v - 0.12, z0 + h], [u + w, v, z0 + h]], PLASTER.right, EDGE)
    + face([[u - w - 0.03, v + 0.02, z0 + h], [u, v + 0.02, z0 + h + 7], [u, v - 0.14, z0 + h + 7], [u - w - 0.03, v - 0.14, z0 + h]], roof.back, EDGE)
    + face([[u + w + 0.03, v + 0.02, z0 + h], [u, v + 0.02, z0 + h + 7], [u, v - 0.14, z0 + h + 7], [u + w + 0.03, v - 0.14, z0 + h]], roof.front, EDGE);
}
// Ombre douce au sol d'un grand bâtiment (3 × 3), décalée à l'opposé de la lumière
export const bigShadow = (rx = 82, ry = 38) => `<ellipse cx="8" cy="${f2(P(0, 0, 0)[1] + 6)}" rx="${rx}" ry="${ry}" fill="rgba(40,55,20,.12)"/>`;
