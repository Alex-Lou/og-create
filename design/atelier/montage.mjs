// Le montage d'un bâtiment, par étapes (les chantiers) : le terrain marqué, la terre retournée, les fondations, la
// charpente, les murs, le toit ; puis le dévoilement, à jouer par-dessus le bâtiment fini. Les mêmes étapes servent au
// petit spectacle (elles défilent quand on bâtit) et au chantier qui dure (une étape par part du temps). Deux emprises :
// 2 × 2 cases (paliers I à III) et 3 × 3 (paliers IV à VII). L'échafaudage d'évolution entoure un bâtiment déjà là,
// en deux calques (derrière lui, devant lui). Géométrie et lumière de world/iso.js, trait de la troupe ; dessins en
// pixels du jeu (preview_montage.mjs les agrandit × 1,25).
import { P, face, box, gable, cylinder, shadow, EDGE } from './port/src/world/iso.js';
import { WOOD, WOOD_DARK, STONE, WALL, ROOF_RED, pebble, windowLeft, windowRight, doorLeft } from './port/src/world/palette.js';

const OUT = '#3C2819';
const f2 = n => Math.round(n * 100) / 100;
const pts = list => list.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
const ln = (a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;
const tk = (a, b, color, w) => ln(a, b, OUT, w + 1.44) + ln(a, b, color, w);
const pathTk = (d, color, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${f2(w + 1.44)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const poly = (list, fill, extra = EDGE) => `<polygon points="${pts(list)}" fill="${fill}"${extra}/>`;

/* ---------- matières ---------- */
const TERRE = { claire: '#B07A4A', moyenne: '#946240', sombre: '#784C2E', motte: '#8B5A34' };
const CORDE = '#F2E4C0';
const FANIONS = ['#E2574C', '#F2C04B', '#6FA3D9', '#FFF4E0', '#7EC45B'];
const COLOMBAGE = '#7A4E2C';
const DEDANS = { gauche: '#6E4A32', droite: '#5A3A28', sol: '#CFC6B4' };
const TUILE = { top: '#F08A6A', left: '#E06E52', right: '#B9503B' };
const SAPIN = ['#2F6E3A', '#4F9A4C', '#86C774'];

/* ---------- l'emprise ---------- */
// R : la demi-emprise (1 : 2 × 2 cases, 1,5 : 3 × 3) ; le corps du bâtiment occupe le fond, les matériaux attendent devant
function geo(emprise) {
  const R = emprise === '3x3' ? 1.5 : 1, hs = emprise === '3x3' ? 1.35 : 1;
  const F = Math.round(5 * hs), W = F + Math.round(26 * hs);
  return { R, hs, F, W, h: Math.round(17 * hs), u0: -0.6 * R, u1: 0.45 * R, v0: -0.6 * R, v1: 0.45 * R, k: 0.9 * R };
}

/* ---------- petits objets ---------- */
// Un petit objet agrandi de s autour de son pied (u, v) : sur la grande emprise, les objets grandissent avec le bâtiment
const gros = (u, v, s, body) => { if (s === 1) return body; const [x, y] = P(u, v, 0); return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${s}) translate(${f2(-x)} ${f2(-y)})">${body}</g>`; };
// Bouffée de poussière : trois boules crème cernées
const bouffee = (x, y, s, a = 1) => `<g opacity="${a}">${[[-s * 0.9, 0, s * 0.8], [s * 0.7, s * 0.1, s * 0.7], [0, -s * 0.6, s]].map(([dx, dy, r]) => ell(x + dx, y + dy, r + 0.6, r * 0.86 + 0.6, OUT)).join('')
  + [[-s * 0.9, 0, s * 0.8], [s * 0.7, s * 0.1, s * 0.7], [0, -s * 0.6, s]].map(([dx, dy, r]) => ell(x + dx, y + dy, r, r * 0.86, '#F4E8D0')).join('')
  + ell(x - s * 0.3, y - s * 0.9, s * 0.4, s * 0.26, '#FFFFFF', ' opacity=".7"')}</g>`;
// Piquet de bois taillé en pointe (u, v), haut de h px
function piquet(u, v, h) {
  const [tx, ty] = P(u, v, h);
  return box(u - 0.035, v - 0.035, u + 0.035, v + 0.035, 0, h, WOOD)
    + `<path d="M${f2(tx - 2.3)},${f2(ty + 1)} L${f2(tx)},${f2(ty - 3)} L${f2(tx + 2.3)},${f2(ty + 1)} Z" fill="${WOOD.top}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`;
}
// Guirlande de fanions du piquet a au piquet b (points écran), qui pend ; n : l'image (les fanions se balancent)
function guirlande(a, b, nb, n, decal = 0) {
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 4.4];
  const q = t => [(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * m[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * m[1] + t * t * b[1]];
  let s = pathTk(`M${f2(a[0])},${f2(a[1])} Q${f2(m[0])},${f2(m[1])} ${f2(b[0])},${f2(b[1])}`, CORDE, 0.7);
  for (let i = 1; i <= nb; i++) {
    const t = i / (nb + 1), [x, y] = q(t), sw = [0.9, 0, -0.9][(n + i) % 3];
    s += `<path d="M${f2(x - 2)},${f2(y - 0.2)} L${f2(x + 2)},${f2(y + 0.2)} L${f2(x + sw)},${f2(y + 4.6)} Z" fill="${FANIONS[(i + decal) % FANIONS.length]}" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>`;
  }
  return s;
}
// Pile de planches couchées le long de u, de u0 à u1, autour de v ; c : combien d'étages
function planches(u0, u1, v, c = 3) {
  let s = shadow((u0 + u1) / 2, v, (u1 - u0) * 0.45, 0.16);
  for (let i = 0; i < c; i++) { const d = i % 2 ? 0.03 : -0.02; s += box(u0 + d, v - 0.09, u1 + d, v + 0.09, i * 2.6, i * 2.6 + 2.6, WOOD); s += ln(P(u0 + d + 0.02, v + 0.09, i * 2.6 + 1.3), P(u1 + d - 0.02, v + 0.09, i * 2.6 + 1.3), 'rgba(90,55,25,.35)', 0.5); }
  return s;
}
// Pile de pierres de taille autour de (u, v), c pierres
function pierres(u, v, c = 3, couleur = STONE) {
  const place = [[0, 0, 0], [0.16, 0.02, 0], [0.07, 0.01, 6]].slice(0, c);
  return shadow(u + 0.08, v, 0.2, 0.16) + place.map(([du, dv, z]) => box(u + du - 0.08, v + dv - 0.08, u + du + 0.08, v + dv + 0.08, z, z + 6, couleur)
    + ln(P(u + du - 0.06, v + dv + 0.08, z + 3), P(u + du + 0.06, v + dv + 0.08, z + 3), 'rgba(120,110,95,.4)', 0.5)).join('');
}
// Pile de tuiles rouges autour de (u, v)
function tuiles(u, v) {
  let s = shadow(u, v, 0.16, 0.16);
  for (let i = 0; i < 4; i++) s += box(u - 0.1, v - 0.08, u + 0.1, v + 0.08, i * 2, i * 2 + 2, TUILE) + ln(P(u - 0.1, v + 0.08, i * 2 + 2), P(u + 0.1, v + 0.08, i * 2 + 2), 'rgba(255,255,255,.35)', 0.5);
  return s;
}
// Seau de mortier et sa truelle
function mortier(u, v) {
  const [mx, my] = P(u, v, 7);
  return shadow(u, v, 0.1, 0.18) + cylinder(u, v, 0, 7, 0.09, { top: '#CFC6B4', left: '#9AA6B2', right: '#6F7A85' }, `mortier${f2(u * 100)}${f2(v * 100)}`.replace(/[.-]/g, 'x'))
    + ell(mx, my, 3.6, 1.6, '#E6DFD0') + ell(mx - 1, my - 0.4, 1.4, 0.6, '#FFFFFF', ' opacity=".6"')
    + `<path d="M${f2(mx - 1)},${f2(my)} l3.4,-6" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/><path d="M${f2(mx - 1)},${f2(my)} l3.4,-6" stroke="${WOOD.right}" stroke-width="1.3" stroke-linecap="round"/>`
    + `<path d="M${f2(mx - 3)},${f2(my + 0.6)} l4,-1.4 l1,1.6 Z" fill="#9AA6B2" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`;
}
// Tas de terre et la pelle plantée dedans
function tas(u, v, s = 1) {
  const [hx, hy] = P(u, v, 0);
  const d = `M${f2(hx - 13 * s)},${f2(hy + 2)} Q${f2(hx - 9 * s)},${f2(hy - 8 * s)} ${f2(hx)},${f2(hy - 9 * s)} Q${f2(hx + 9 * s)},${f2(hy - 8 * s)} ${f2(hx + 13 * s)},${f2(hy + 2)} Q${f2(hx)},${f2(hy + 6)} ${f2(hx - 13 * s)},${f2(hy + 2)} Z`;
  return `<path d="${d}" fill="${TERRE.claire}" stroke="${OUT}" stroke-width="0.8"/>`
    + `<path d="M${f2(hx - 6 * s)},${f2(hy - 5 * s)} q4,-3 8,-1" stroke="#C99A62" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
    + ell(hx + 5 * s, hy - 1, 2, 1.2, TERRE.motte) + ell(hx - 8 * s, hy + 1, 1.6, 1, TERRE.sombre)
    + `<path d="M${f2(hx + 2)},${f2(hy - 4 * s)} l4.2,0.8 l-0.6,5.6 q-2,1.6 -4.2,-0.6 Z" fill="#9AA6B2" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
    + tk([hx + 4, hy - 3.6 * s], [hx + 8, hy - 3.6 * s - 17], WOOD.left, 1.4)
    + tk([hx + 5.6, hy - 3.6 * s - 18], [hx + 10.6, hy - 3.6 * s - 18], WOOD.top, 1.2);
}
// Brouette pleine (de terre ou de pierres), qui regarde vers la gauche
function brouette(u, v, charge = 'terre') {
  const [x, y] = P(u, v, 0);
  const caisse = [[x - 9, y - 9], [x + 6, y - 9], [x + 4, y - 3], [x - 7, y - 3]];
  let s = ell(x, y + 1.6, 12, 3.4, 'rgba(40,55,20,.18)');
  s += tk([x + 4, y - 4], [x + 12, y - 1], WOOD.left, 1.3) + tk([x + 3, y - 6], [x + 12.5, y - 3], WOOD.left, 1.3);
  s += tk([x + 3, y - 3], [x + 4, y + 1.2], WOOD_DARK.left, 1) ;
  s += charge === 'terre' ? `<path d="M${f2(x - 9)},${f2(y - 9)} Q${f2(x - 1.5)},${f2(y - 16)} ${f2(x + 6)},${f2(y - 9)} Z" fill="${TERRE.claire}" stroke="${OUT}" stroke-width="0.7"/>` + ell(x - 2, y - 12, 2, 1.1, TERRE.motte)
    : [[-5, -10.5], [0.5, -11], [-2.2, -13.4]].map(([dx, dy]) => ell(x + dx, y + dy, 3, 2.2, STONE.left, ` stroke="${OUT}" stroke-width="0.6"`) + ell(x + dx - 0.8, y + dy - 0.8, 1.2, 0.7, '#FFFFFF', ' opacity=".55"')).join('');
  s += poly(caisse, '#4F8FC0') + ln([x - 7.6, y - 7.4], [x + 4.8, y - 7.4], 'rgba(255,255,255,.4)', 0.8);
  s += ell(x - 8, y - 1, 3.4, 3.4, OUT) + ell(x - 8, y - 1, 2.4, 2.4, '#5A5250') + ell(x - 8, y - 1, 0.8, 0.8, '#C9C2B6');
  return s;
}
// Panneau du chantier : un poteau, une planchette jaune où une maisonnette est dessinée
function panneau(u, v) {
  const [sx, sy] = P(u, v, 19);
  return box(u - 0.025, v - 0.025, u + 0.025, v + 0.025, 0, 18, WOOD_DARK)
    + face([[u - 0.18, v, 14], [u + 0.18, v, 14], [u + 0.18, v, 24], [u - 0.18, v, 24]], '#F3D27A', EDGE)
    + `<path d="M${f2(sx - 4)},${f2(sy + 3.6)} L${f2(sx - 4)},${f2(sy - 0.4)} L${f2(sx)},${f2(sy - 3.6)} L${f2(sx + 4)},${f2(sy - 0.4)} L${f2(sx + 4)},${f2(sy + 3.6)} Z" fill="none" stroke="#4A3426" stroke-width="0.9" stroke-linejoin="round" opacity=".8"/>`
    + `<rect x="${f2(sx - 1)}" y="${f2(sy + 0.8)}" width="2" height="2.8" fill="#4A3426" opacity=".8"/>`;
}
// Caisse où attend le plan, déroulé sur le dessus (bleu, la maisonnette tracée en blanc), un galet sur un coin
function caissePlan(u, v) {
  const z = 9.2, c = 0.14, pt = (du, dv) => [u + du, v + dv, z];
  let s = shadow(u, v, 0.14, 0.16) + box(u - 0.11, v - 0.11, u + 0.11, v + 0.11, 0, 9, WOOD)
    + ln(P(u - 0.09, v + 0.11, 1), P(u + 0.09, v + 0.11, 8), 'rgba(70,40,20,.45)', 0.8);
  s += face([pt(-c, -c), pt(c, -c), pt(c, c), pt(-c, c)], '#6FA3D9', EDGE);
  const tr = (a, b) => ln(P(...pt(...a)), P(...pt(...b)), '#FFFFFF', 0.6);
  s += tr([-0.07, -0.06], [0.07, -0.06]) + tr([0.07, -0.06], [0.07, 0.07]) + tr([0.07, 0.07], [-0.07, 0.07]) + tr([-0.07, 0.07], [-0.07, -0.06]) + tr([-0.07, 0], [0.07, 0]) + tr([0, 0], [0, 0.07]);
  // le bout encore roulé, au fond
  const [ax, ay] = P(u - c + 0.01, v - c + 0.02, z + 1.2), [bx, by] = P(u - c + 0.01, v + c - 0.02, z + 1.2);
  s += `<path d="M${f2(ax)},${f2(ay)} L${f2(bx)},${f2(by)}" stroke="${OUT}" stroke-width="3.8" stroke-linecap="round"/><path d="M${f2(ax)},${f2(ay)} L${f2(bx)},${f2(by)}" stroke="#5E92C4" stroke-width="2.4" stroke-linecap="round"/>`
    + ln([ax + 0.6, ay - 0.6], [bx + 0.6, by - 0.6], 'rgba(255,255,255,.5)', 0.6);
  const [gx, gy] = P(u + c - 0.03, v + c - 0.03, z);
  return s + ell(gx, gy - 0.8, 2.2, 1.5, STONE.left, ` stroke="${OUT}" stroke-width="0.6"`) + ell(gx - 0.6, gy - 1.3, 0.9, 0.5, '#FFFFFF', ' opacity=".6"');
}
// Le tracé du bâtiment au sol : la chaux en pointillés, quatre petits piquets aux coins, le cordeau tendu entre eux
function trace(g) {
  const { u0, u1, v0, v1 } = g, c = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  let s = `<polygon points="${pts(c.map(([u, v]) => P(u, v, 0)))}" fill="none" stroke="#FFF8E8" stroke-width="1.5" stroke-dasharray="3.4 2.4" opacity=".9"/>`;
  const pq = ([u, v]) => box(u - 0.02, v - 0.02, u + 0.02, v + 0.02, 0, 5, WOOD);
  s += pq(c[0]) + pq(c[1]) + pq(c[3]);
  s += [[0, 1], [0, 3]].map(([a, b]) => ln(P(...c[a], 4), P(...c[b], 4), CORDE, 0.6)).join('');
  s += [[1, 2], [3, 2]].map(([a, b]) => ln(P(...c[a], 4), P(...c[b], 4), CORDE, 0.6)).join('') + pq(c[2]);
  return s;
}
// Échelle appuyée, du pied (au sol) à la tête ; deux montants, des barreaux
function echelle(pied, tete, nb) {
  const a = P(...pied), b = P(...tete), e = 2.6;
  let s = tk([a[0] - e, a[1]], [b[0] - e, b[1]], WOOD.left, 1.1) + tk([a[0] + e, a[1]], [b[0] + e, b[1]], WOOD.left, 1.1);
  for (let i = 1; i <= nb; i++) { const t = i / (nb + 1), x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; s += ln([x - e, y], [x + e, y], WOOD.right, 1); }
  return s;
}
// Seau pendu à une corde, qui se balance (n : l'image)
function seauPendu(haut, long, n) {
  const a = [-1.6, 0, 1.6][n % 3], b = [haut[0] + a, haut[1] + long];
  return ln(haut, b, OUT, 1.6) + ln(haut, b, CORDE, 0.7)
    + `<path d="M${f2(b[0] - 3)},${f2(b[1] + 0.6)} L${f2(b[0] + 3)},${f2(b[1] + 0.6)} L${f2(b[0] + 2.2)},${f2(b[1] + 5.4)} L${f2(b[0] - 2.2)},${f2(b[1] + 5.4)} Z" fill="#9AA6B2" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
    + ell(b[0], b[1] + 0.6, 3, 1, '#E6DFD0', ` stroke="${OUT}" stroke-width="0.5"`) + `<path d="M${f2(b[0] - 3)},${f2(b[1] + 0.6)} Q${f2(b[0])},${f2(b[1] - 2.6)} ${f2(b[0] + 3)},${f2(b[1] + 0.6)}" fill="none" stroke="${OUT}" stroke-width="0.5"/>`;
}

/* ---------- le corps du bâtiment, étape par étape ---------- */
// La dalle de fondation : pierre, assises sur les faces, dallage sur le dessus
function dalle(g) {
  const { u0, u1, v0, v1, F } = g;
  let s = box(u0 - 0.04, v0 - 0.04, u1 + 0.04, v1 + 0.04, 0, F, STONE);
  const n = Math.round((u1 - u0) / 0.22);
  for (let i = 1; i < n; i++) { const t = i / n; s += ln(P(u0 + (u1 - u0) * t, v0, F), P(u0 + (u1 - u0) * t, v1, F), 'rgba(120,110,95,.32)', 0.5) + ln(P(u0, v0 + (v1 - v0) * t, F), P(u1, v0 + (v1 - v0) * t, F), 'rgba(120,110,95,.32)', 0.5); }
  for (let i = 1; i < n; i++) { const t = (i + 0.5) / n; if (t < 1) s += ln(P(u0 + (u1 - u0) * t, v1 + 0.04, 0.6), P(u0 + (u1 - u0) * t, v1 + 0.04, F - 0.6), 'rgba(120,110,95,.4)', 0.5) + ln(P(u1 + 0.04, v0 + (v1 - v0) * t, 0.6), P(u1 + 0.04, v0 + (v1 - v0) * t, F - 0.6), 'rgba(90,80,70,.4)', 0.5); }
  return s;
}
// Poteau de charpente
const poteau = (u, v, z0, z1, c = WOOD) => box(u - 0.04, v - 0.04, u + 0.04, v + 0.04, z0, z1, c);
// Sablières (les poutres du haut) le long d'un bord : de a à b (u, v), à la hauteur z
function poutre(a, b, z, c = WOOD) {
  const du = b[0] - a[0], dv = b[1] - a[1];
  return du ? box(Math.min(a[0], b[0]) - 0.04, a[1] - 0.04, Math.max(a[0], b[0]) + 0.04, a[1] + 0.04, z - 3, z, c)
    : box(a[0] - 0.04, Math.min(a[1], b[1]) - 0.04, a[0] + 0.04, Math.max(a[1], b[1]) + 0.04, z - 3, z, c);
}
// La charpente : les poteaux, les sablières, une écharpe en biais sur chaque face visible ; fond : seulement ce qui est
// derrière le dedans (les poteaux et poutres du fond), devant : le reste
function charpente(g, part) {
  const { u0, u1, v0, v1, F, W } = g, um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
  if (part === 'fond') return poteau(u0, v0, F, W) + poteau(um, v0, F, W) + poteau(u0, vm, F, W) + poteau(u1, v0, F, W) + poteau(u0, v1, F, W)
    + poutre([u0, v0], [u1, v0], W) + poutre([u0, v0], [u0, v1], W);
  return poteau(um, v1, F, W) + poteau(u1, vm, F, W) + poteau(u1, v1, F, W)
    + poutre([u0, v1], [u1, v1], W) + poutre([u1, v0], [u1, v1], W)
    + tk(P(u0 + 0.06, v1 + 0.04, F + 2), P(um - 0.06, v1 + 0.04, W - 4), WOOD.left, 1.4) + tk(P(u1 + 0.04, vm + 0.06, F + 2), P(u1 + 0.04, v1 - 0.06, W - 4), WOOD.right, 1.4);
}
// Les murs : à colombages (enduit crème, bois brun), une fenêtre par face, la porte à gauche ; le dedans des murs du fond
// se voit par le haut (le toit n'est pas encore là)
function mursFond(g) {
  const { u0, u1, v0, v1, F, W } = g;
  return face([[u0, v0, F], [u1, v0, F], [u1, v0, W], [u0, v0, W]], DEDANS.gauche, EDGE)
    + face([[u0, v0, F], [u0, v1, F], [u0, v1, W], [u0, v0, W]], DEDANS.droite, EDGE)
    + face([[u0, v0, F], [u1, v0, F], [u1, v1, F], [u0, v1, F]], DEDANS.sol, EDGE);
}
function mursDevant(g) {
  const { u0, u1, v0, v1, F, W, R } = g, um = (u0 + u1) / 2, vm = (v0 + v1) / 2, zm = (F + W) / 2;
  let s = face([[u0, v1, F], [u1, v1, F], [u1, v1, W], [u0, v1, W]], WALL.left, EDGE) + face([[u1, v0, F], [u1, v1, F], [u1, v1, W], [u1, v0, W]], WALL.right, EDGE);
  // colombages : les poteaux, la lisse du milieu, les écharpes
  const bois = (a, b) => ln(P(...a), P(...b), COLOMBAGE, 1.6);
  s += bois([um, v1, F], [um, v1, W]) + bois([u0, v1, zm], [u1, v1, zm]) + bois([u1, vm, F], [u1, vm, W]) + bois([u1, v0, zm], [u1, v1, zm]);
  s += bois([u0 + 0.04, v1, F + 1], [um - 0.04, v1, zm - 1]) + bois([u1, v0 + 0.04, zm + 1], [u1, vm - 0.04, W - 1]);
  s += doorLeft(um + 0.08 * R, u1 - 0.1 * R, v1, Math.round(zm - F + 4) + F) + windowLeft(u0 + 0.1 * R, um - 0.1 * R, v1, zm + 2, W - 3) + windowRight(u1, vm + 0.08 * R, v1 - 0.1 * R, zm + 2, W - 3);
  s += poutre([u0, v1], [u1, v1], W) + poutre([u1, v0], [u1, v1], W);
  return s;
}
// Le toit en cours : le pan du fond couvert de tuiles, le pignon, le pan de devant à moitié latté ; le bouquet de faîte
function toit(g, n) {
  const { u0, u1, v0, v1, W, h } = g, vm = (v0 + v1) / 2, o = 0.08;
  let s = gable(u0, v0, u1, v1, W, h, { front: '#5A3A28', back: ROOF_RED.back, gable: WALL.right }, o);
  // le pignon à colombages
  s += ln(P(u1, vm, W), P(u1, vm, W + h - 2), COLOMBAGE, 1.4) + ln(P(u1, v0 + 0.1, W + 1), P(u1, vm, W + h - 2), COLOMBAGE, 1.2);
  // le pan de devant : les chevrons (du bas au faîtage), les lattes, puis les tuiles déjà posées en bas
  const A = (t, w) => [u0 - o + (u1 - u0 + 2 * o) * t, v1 + o + (vm - v1 - o) * w, W + h * w]; // t le long du faîtage, w de l'égout au faîtage
  for (let i = 0; i <= 6; i++) s += ln(P(...A(i / 6, 0)), P(...A(i / 6, 1)), WOOD.top, 1.6) + ln(P(...A(i / 6, 0)), P(...A(i / 6, 1)), 'rgba(60,40,25,.5)', 0.4);
  for (let j = 1; j <= 4; j++) s += ln(P(...A(0, j / 5)), P(...A(1, j / 5)), WOOD.left, 1.1);
  const bas = 0.42;
  s += poly([P(...A(0, 0)), P(...A(1, 0)), P(...A(1, bas)), P(...A(0, bas))], ROOF_RED.front);
  for (let j = 1; j <= 3; j++) s += ln(P(...A(0.01, (bas * j) / 3.4)), P(...A(0.99, (bas * j) / 3.4)), 'rgba(140,50,35,.45)', 0.7);
  for (let i = 1; i < 10; i++) s += ln(P(...A(i / 10, 0)), P(...A(i / 10 + 0.01, bas)), 'rgba(140,50,35,.25)', 0.5);
  // le bouquet de faîte, au bout du faîtage : un brin de sapin et ses rubans qui flottent
  const [bx, by] = P(u1 + o - 0.02, vm, W + h);
  s += tk([bx, by], [bx, by - 7], WOOD_DARK.left, 1);
  s += [[0, -7, 4.2, 6], [0, -10.4, 3.4, 5], [0, -13.2, 2.4, 4]].map(([dx, dy, w, hh], i) => `<path d="M${f2(bx + dx - w)},${f2(by + dy + 1)} L${f2(bx + dx)},${f2(by + dy - hh + 1)} L${f2(bx + dx + w)},${f2(by + dy + 1)} Z" fill="${SAPIN[i]}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`).join('');
  // les rubans : trois banderoles qui flottent vers la droite, en s'écartant, et ondulent d'une image à l'autre
  s += ['#E2574C', '#F2C04B', '#6FA3D9'].map((c, i) => {
    const o = [0, 1, 2][(n + i) % 3] - 1, x0 = bx + 0.8, y0 = by - 6.6 + i * 0.8;
    return pathTk(`M${f2(x0)},${f2(y0)} c${f2(2.6)},${f2(-1.4 + o)} ${f2(4.4)},${f2(1.6 + i * 0.8)} ${f2(6.6)},${f2(1 + i * 1.2)} s${f2(3.4)},${f2(-1.8 - o)} ${f2(5.4)},${f2(0.6 + i * 1.4)}`, c, 1);
  }).join('');
  return s;
}
// L'échafaudage le long de la face droite : deux perches, un plancher, un garde-corps, un fanion en haut
function echafaudageDroite(g, n) {
  const { u1, v0, v1, F, W } = g, ue = u1 + 0.16, z = Math.round((F + W) / 2) + 2;
  let s = '';
  for (const v of [v0 + 0.06, v1 - 0.02]) s += tk(P(ue, v, 0), P(ue, v, W + 6), WOOD_DARK.left, 1.2);
  s += box(u1 + 0.04, v0 + 0.02, ue + 0.04, v1 + 0.02, z - 2, z, WOOD) + ln(P(ue + 0.04, v0 + 0.06, z + 7), P(ue + 0.04, v1 - 0.02, z + 7), OUT, 2.2) + ln(P(ue + 0.04, v0 + 0.06, z + 7), P(ue + 0.04, v1 - 0.02, z + 7), WOOD.left, 1);
  const [fx, fy] = P(ue, v1 - 0.02, W + 6), w = [0, 1, -0.6][n % 3];
  s += `<path d="M${f2(fx)},${f2(fy)} L${f2(fx + 7 + w)},${f2(fy + 2 - w * 0.4)} L${f2(fx)},${f2(fy + 4.6)} Z" fill="#E2574C" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`;
  return s;
}

/* ---------- les étapes ---------- */
export const ETAPES = ['piquets', 'terrassement', 'fondations', 'charpente', 'murs', 'toit'];

// Une étape du montage ; emprise '2x2' ou '3x3' ; n : l'image (0 à 2)
export function montage(emprise, etape, n = 0) {
  const g = geo(emprise), { R, k, u0, u1, v0, v1, F, W } = g, i = ETAPES.indexOf(etape);
  if (i < 0) throw new Error('étape inconnue : ' + etape);
  const hp = 13; // la hauteur des piquets (la guirlande y est nouée)
  const coin = [[-k, -k], [k, -k], [k, k], [-k, k]].map(([u, v]) => P(u, v, hp - 1.5));
  const nb = Math.round(4 * R);
  let s = shadow(0, 0, 1.08 * R, 0.1);
  // le sol : piétiné au début, puis retourné (une tache de terre, des mottes, des cailloux)
  if (i === 0) s += [[-0.3, 0.1, 3], [0.25, -0.35, 2.6], [0.1, 0.4, 2.2]].map(([u, v, r]) => { const [x, y] = P(u * R, v * R, 0); return ell(x, y, r * 2.2, r, 'rgba(150,110,60,.18)'); }).join('');
  else {
    const blob = Array.from({ length: 28 }, (_, j) => { const t = (j / 28) * Math.PI * 2, r = 0.74 * R * (1 + 0.07 * Math.sin(t * 3 + 0.6) + 0.04 * Math.sin(t * 5)); return P(Math.cos(t) * r - 0.06 * R, Math.sin(t) * r - 0.06 * R, 0); });
    s += `<polygon points="${pts(blob)}" fill="rgba(150,105,60,.45)"/>`;
    s += [[-0.3, -0.2, 3.4], [0.2, 0.25, 2.8], [0.38, -0.32, 2.4], [-0.12, 0.42, 2], [0.04, -0.5, 2.2]].map(([u, v, r], j) => { const [x, y] = P(u * R, v * R, 0); return ell(x, y, r, r * 0.6, j % 2 ? TERRE.motte : TERRE.claire); }).join('');
    if (i <= 2) s += pebble(0.3 * R, -0.18 * R, 2.4) + pebble(-0.26 * R, 0.32 * R, 2);
  }
  // la guirlande du fond, les piquets du fond et des côtés
  s += guirlande(coin[0], coin[1], nb, n) + guirlande(coin[3], coin[0], nb, n, 2);
  s += piquet(-k, -k, hp) + piquet(k, -k, hp) + piquet(-k, k, hp);
  // le corps
  if (i >= 2) s += dalle(g);
  if (i >= 4) s += mursFond(g);
  if (i >= 3) s += charpente(g, 'fond');
  if (i >= 3) s += charpente(g, 'devant');
  if (i === 3) s += seauPendu(P(u1, (v0 + v1) / 2 + 0.06, W - 1.5), 10 + 2 * R, n);
  if (i >= 4) s += mursDevant(g);
  if (i >= 5) s += toit(g, n);
  if (i === 3 || i === 4) s += echelle([u0 + 0.14 * R, v1 + 0.24 * R, 0], [u0 + 0.14 * R, v1 + 0.04, W + 3], Math.round(5 * g.hs));
  if (i >= 4) s += echafaudageDroite(g, n);
  if (i === 4) s += seauPendu(P(u1 + 0.18, v1 - 0.02, W + 4), 14 * g.hs, n);
  // les matériaux qui attendent devant (un peu plus gros sur la grande emprise)
  const o = R === 1 ? 1 : 1.25, at = (u, v, f) => gros(u * R, v * R, o, f(u * R, v * R));
  if (i === 0) s += at(0.2, -0.12, caissePlan);
  if (i === 1) s += at(0.58, -0.24, (u, v) => brouette(u, v, 'terre'));
  if (i <= 1) s += trace(g);
  if (i === 2) s += at(0.7, -0.45, (u, v) => pierres(u, v, 3)) + at(0.72, 0.02, (u, v) => brouette(u, v, 'pierres')) + at(0.74, 0.44, mortier);
  if (i === 3) s += at(0.7, -0.45, (u, v) => pierres(u, v, 2)) + at(0.72, 0.1, mortier);
  if (i === 5) s += at(0.72, -0.36, tuiles);
  if (i >= 3) s += gros(0.09 * R, 0.72 * R, o, planches(-0.18 * R, 0.36 * R, 0.72 * R, i === 3 ? 3 : 2));
  if (i === 1) s += at(0.3, 0.24, (u, v) => tas(u, v, 1));
  s += at(-0.52, 0.8, panneau);
  // la guirlande de devant, le dernier piquet
  s += guirlande(coin[1], coin[2], nb, n, 1) + guirlande(coin[2], coin[3], nb, n, 3) + piquet(k, k, hp);
  // la poussière qui vole (terrassement, fondations)
  if (i === 1) { const [x, y] = P(0.3 * R, 0.24 * R, 12 * o); s += bouffee(x - 10 + n * 3, y - n * 2.4, 2.4 + n * 0.5, [0.95, 0.75, 0.45][n]); }
  if (i === 2) { const [x, y] = P(0.7 * R, -0.45 * R, 14 * o); s += bouffee(x + 6 - n * 2, y - n * 2.6, 2.2 + n * 0.5, [0.9, 0.7, 0.4][n]); }
  return s;
}

// Le dévoilement : un nuage de poussière qui s'ouvre, des étincelles, des pétales ; à jouer par-dessus le bâtiment fini
// (4 images), dans le même repère que lui
export function devoilement(emprise, n) {
  const { R, hs } = geo(emprise), t = (n + 1) / 4;
  let s = '';
  // les bouffées au pied, devant et sur les côtés (celles du fond passeraient sur le toit)
  const tour = 12;
  for (let j = 0; j < tour; j++) {
    const a = (j / tour) * Math.PI * 2 + 0.26, r = (0.7 + 0.42 * t) * R;
    if (Math.cos(a) + Math.sin(a) < -0.35) continue;
    const [x, y] = P(Math.cos(a) * r, Math.sin(a) * r, 2 + 6 * t);
    s += bouffee(x, y, (4.4 - 1.8 * t) * hs, f2(1.05 - t * 0.85));
  }
  const etoile = (x, y, r, c) => `<path d="M${f2(x)},${f2(y - r)} Q${f2(x + r * 0.18)},${f2(y - r * 0.18)} ${f2(x + r)},${f2(y)} Q${f2(x + r * 0.18)},${f2(y + r * 0.18)} ${f2(x)},${f2(y + r)} Q${f2(x - r * 0.18)},${f2(y + r * 0.18)} ${f2(x - r)},${f2(y)} Q${f2(x - r * 0.18)},${f2(y - r * 0.18)} ${f2(x)},${f2(y - r)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`;
  const vol = [[-38, -50], [34, -62], [-12, -84], [46, -30], [-48, -22], [10, -100]];
  vol.forEach(([x, y], j) => { if ((j + n) % 2 === 0 || n === 1) s += etoile(x * R * 0.9, y * hs - n * 6, (n === 1 ? 4.6 : 3.4) - (j % 3) * 0.6, j % 2 ? '#FFF4C2' : '#FFD36A'); });
  if (n >= 1) {
    const pet = [[-30, -40, '#F7A8B0'], [24, -52, '#FFFFFF'], [-6, -70, '#F2C04B'], [40, -18, '#B3E386'], [-44, -10, '#F7A8B0'], [14, -86, '#6FA3D9'], [0, -30, '#FFFFFF']];
    pet.forEach(([x, y, c], j) => { const yy = y * hs + (n - 1) * 9 + j, xx = x * R * 0.95 + Math.sin(j + n) * 3; s += `<ellipse cx="${f2(xx)}" cy="${f2(yy)}" rx="2.2" ry="1.3" transform="rotate(${(j * 47 + n * 30) % 180} ${f2(xx)} ${f2(yy)})" fill="${c}" stroke="${OUT}" stroke-width="0.45"/>`; });
  }
  return s;
}

// L'échafaudage d'évolution, autour d'un bâtiment déjà là : derriere (à dessiner avant lui) ou devant (après lui) ;
// des perches aux quatre coins de l'emprise ; derrière, deux planchers sur les deux faces du fond ; devant, sur la face
// droite seulement (le bâtiment reste lisible), une échelle, un seau pendu, un fanion
export function echafaudage(emprise, couche, n = 0) {
  const { R, hs } = geo(emprise), e = 0.9 * R, H = Math.round(50 * hs), z1 = Math.round(H * 0.42), z2 = Math.round(H * 0.84);
  const perche = (u, v) => tk(P(u, v, 0), P(u, v, H), WOOD_DARK.left, 1.2) + ell(...P(u, v, 0), 2.4, 1.2, 'rgba(40,55,20,.2)');
  const plancher = (a, b, z) => {
    const du = b[0] - a[0], w = 0.07;
    return du ? box(Math.min(a[0], b[0]), a[1] - w, Math.max(a[0], b[0]), a[1] + w, z - 1.8, z, WOOD) : box(a[0] - w, Math.min(a[1], b[1]), a[0] + w, Math.max(a[1], b[1]), z - 1.8, z, WOOD);
  };
  const rambarde = (a, b, z) => ln(P(a[0], a[1], z), P(b[0], b[1], z), OUT, 2) + ln(P(a[0], a[1], z), P(b[0], b[1], z), WOOD.left, 0.9);
  if (couche === 'derriere') {
    return perche(-e, -e) + perche(e, -e) + perche(-e, e)
      + [z1, z2].map(z => plancher([-e, -e], [e, -e], z) + plancher([-e, -e], [-e, e], z) + rambarde([-e, -e], [e, -e], z + 7) + rambarde([-e, -e], [-e, e], z + 7)).join('');
  }
  // devant : la face droite seulement (deux planchers, le garde-corps), l'échelle contre elle ; à gauche, une perche
  let s = perche(-e, e) + perche(e, -e);
  s += [z1, z2].map(z => plancher([e, -e], [e, e], z) + rambarde([e, -e], [e, e], z + 7)).join('');
  s += perche(e, e);
  s += echelle([e + 0.24, 0.1 * R, 0], [e + 0.03, 0.1 * R, z1 + 5], Math.round(4 * hs));
  const [fx, fy] = P(e, e, H), w = [0, 1, -0.6][n % 3];
  s += `<path d="M${f2(fx)},${f2(fy)} L${f2(fx + 8 + w)},${f2(fy + 2.2 - w * 0.4)} L${f2(fx)},${f2(fy + 5)} Z" fill="#F2C04B" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`;
  s += seauPendu(P(e, -0.35 * R, z2 + 6), 12 * hs, n);
  return s;
}
