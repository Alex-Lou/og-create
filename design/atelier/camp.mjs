// Lot G3 — le camp des naufragés, en vue iso du jeu (géométrie et lumière de world/iso.js, trait de la troupe), dans
// l'ordre de l'histoire : l'épave de l'Hirondelle et le feu de débris (T1), puis le coin de chaque naufragé à son
// arrivée, en trois états (débris → abri de fortune → cabanon) avant le palier I de son bâtiment ; les objets du camp ;
// la tente et le hamac des voyageurs. Dessins en pixels du jeu ; l'aperçu les agrandit × 1,25 (cadres du jeu × 1,25).
import { P, face, box, gable, disc, cylinder, boulder, shadow, sprite, EDGE, mixHex } from './port/src/world/iso.js';
import { WOOD, WOOD_DARK, STONE, THATCH, LEAVES, BUILDING_BOX, PROP_BOX, pebble, planksLeft, planksRight } from './port/src/world/palette.js';
import { flameFrames } from './port/src/world/sprites.js';

const OUT = '#3C2819';
const f2 = n => Math.round(n * 100) / 100;
const pts = list => list.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ');
// Trait d'écran (deux points écran), et trait cerné (contour puis couleur)
const ln = (a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;
const tk = (a, b, color, w) => ln(a, b, OUT, w + 1.44) + ln(a, b, color, w);
const pathTk = (d, color, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${f2(w + 1.44)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
// Chemin passant par des points du repère (u, v, z)
const iso = list => list.map(p => P(...p));
const dOf = list => 'M' + pts(iso(list)).split(' ').join(' L');
let uid = 0;
const id = p => `${p}${uid++}`;

/* ---------- matières ---------- */
const DRIFT = { top: '#DCCBAA', left: '#C2AF8C', right: '#9E8C6C' }; // bois flotté, blanchi par le sel
const CRATE = { top: '#D2A574', left: '#B8875A', right: '#94683F' };
const CANVAS = { light: '#EDE4CD', mid: '#D9CDB0', dark: '#B9AA88', seam: '#B3A27C' };
const SAND = { light: '#F1E3B8', mid: '#E2CF9A', dark: '#C9B47E' };
const ROPE = '#C9A66B';
const IRON = { top: '#6E7178', left: '#55585F', right: '#3F4248' };

/* ---------- petits objets ---------- */
// Caisse repêchée : planches, une traverse en diagonale sur la face avant ; s : demi-côté (cases), h : hauteur (px)
function crate(u, v, s, h, z0 = 0, c = CRATE) {
  const u0 = u - s, u1 = u + s, v0 = v - s, v1 = v + s;
  return box(u0, v0, u1, v1, z0, z0 + h, c)
    + planksLeft(u0, u1, v1, z0, z0 + h, h / 3) + planksRight(u1, v0, v1, z0, z0 + h, h / 3)
    + ln(P(u0 + 0.02, v1, z0 + 1), P(u1 - 0.02, v1, z0 + h - 1), 'rgba(70,40,20,.45)', 0.9)
    + ln(P(u1, v1 - 0.02, z0 + 1), P(u1, v0 + 0.02, z0 + h - 1), 'rgba(40,20,10,.4)', 0.9);
}
// Planche couchée (bois flotté) de a à b (u, v), largeur w (cases), épaisseur t (px)
function plank(a, b, w, t = 2, c = DRIFT, z0 = 0) {
  const du = b[0] - a[0], dv = b[1] - a[1], l = Math.hypot(du, dv) || 1, nu = -dv / l * w / 2, nv = du / l * w / 2;
  const q = [[a[0] + nu, a[1] + nv], [b[0] + nu, b[1] + nv], [b[0] - nu, b[1] - nv], [a[0] - nu, a[1] - nv]];
  // côté visible : celui qui regarde le joueur (+u+v)
  const front = (nu + nv) > 0 ? [q[0], q[1]] : [q[3], q[2]];
  return face([[front[0][0], front[0][1], z0], [front[1][0], front[1][1], z0], [front[1][0], front[1][1], z0 + t], [front[0][0], front[0][1], z0 + t]], c.left, EDGE)
    + face(q.map(([x, y]) => [x, y, z0 + t]), c.top, EDGE);
}
// Bâton ou poteau (écran) cerné, du pied (u, v, z0) au sommet (u2, v2, z1)
const stick = (u, v, z0, u2, v2, z1, w = 2, color = DRIFT.left) => tk(P(u, v, z0), P(u2, v2, z1), color, w);
// Corde (écran) qui pend entre deux points, flèche sag
const rope = (a, b, sag = 3, w = 0.8, color = ROPE) => pathTk(`M${f2(a[0])},${f2(a[1])} Q${f2((a[0] + b[0]) / 2)},${f2((a[1] + b[1]) / 2 + sag)} ${f2(b[0])},${f2(b[1])}`, color, w);
// Galet arrondi (pebble du jeu, cerné)
const stone = (u, v, s, c = STONE) => { const [x, y] = P(u, v, 0); return ell(x + s * 0.1, y + s * 0.15, s + 0.4, s * 0.66 + 0.4, OUT) + pebble(u, v, s, c); };
// Tas de sable (dune basse) autour de (u, v)
const dune = (u, v, ru, rv, h) => { const [x, y] = P(u, v, 0); const rx = (ru + rv) * 22, ry = (ru + rv) * 11; return ell(x, y, rx, ry, SAND.mid) + ell(x - rx * 0.15, y - h * 0.3 - ry * 0.12, rx * 0.72, ry * 0.62, SAND.light); };
// Algue échouée
const kelp = (u, v, rot = 0) => { const [x, y] = P(u, v, 0); return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${rot})">${pathTk('M-6,0 Q-3,-2.4 0,0 Q3,2.4 6,0', '#5C8A45', 1.2)}${ell(-3, -1.2, 1.4, 0.8, '#6E9E50', ` stroke="${OUT}" stroke-width="0.5"`)}</g>`; };

/* ---------- le feu de débris (T1 : Brume l'allume) ---------- */
// Bouts de bois flotté qui se rejoignent au milieu (bouts charbonneux), une planche cassée, un lit de braises ; la
// flamme du jeu (3 images) par-dessus
function driftFire(u = 0, v = 0, s = 1, n = 0) {
  let o = shadow(u, v, 0.4 * s, 0.18) + disc(u, v, 0, 0.2 * s, '#4A3020') + disc(u, v, 0.4, 0.13 * s, '#C9622E');
  const [cx, cy] = P(u, v, 0.6);
  o += [[-2.6, -0.6], [1.8, 0.4], [0.2, 1.4], [-0.6, -1.4]].map(([dx, dy]) => ell(cx + dx * s, cy + dy * s, 0.8 * s, 0.5 * s, '#FFB347')).join('');
  const logs = [[[-0.34, 0.06], [0.02, -0.01]], [[0.26, -0.26], [0.01, 0]], [[0.06, 0.34], [0, 0.01]], [[-0.18, -0.3], [0, 0]]];
  for (const [a, b] of logs) {
    const A = P(u + a[0] * s, v + a[1] * s, 1), B = P(u + b[0] * s, v + b[1] * s, 7.5 * s);
    o += tk(A, B, DRIFT.left, 2.6 * s) + ln([A[0] + (B[0] - A[0]) * 0.62, A[1] + (B[1] - A[1]) * 0.62], B, '#3A2A20', 2.4 * s);
  }
  o += plank([u - 0.42 * s, v + 0.24 * s], [u - 0.14 * s, v + 0.36 * s], 0.09 * s, 1.8, DRIFT) + stone(u + 0.34 * s, v + 0.18 * s, 2.6 * s);
  const flame = flameFrames(u, v, 0.8 * s)[n % 3].svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return o + flame;
}

/* ---------- l'épave de l'Hirondelle (T1, la Grève) ---------- */
// L'avant du petit navire de croisière, échoué dans le sable le long de u (la proue vers +u), gîté vers le joueur ;
// l'arrière s'est arraché dans la brume. Coque blanche, carène rouge à moitié ensablée, liseré bleu, hublots qui
// rouillent, l'hirondelle peinte à la proue, l'ancre qui pend ; pont de bois, bastingage blanc (crevé côté joueur), le
// salon-passerelle aux vitres bleues (une fendue), la bouée, la cheminée jaune à bande bleue qui penche, le mât de
// proue et sa guirlande d'ampoules ; dans le sable : la bouée, la chaise longue rayée retournée, une valise, une caisse
const HULL = { white: '#ECE8DE', white2: '#E4DFD3', dark: '#BDB7AA', red: '#B8483A', redD: '#8E352B', navy: '#2E4E8C', glass: '#5E7A9E', deck: '#C49C6E', cabin: '#F4F0E6', cabinS: '#D6D0C2', roof: '#DCD6C8', funnel: '#F2C04B', funnelS: '#D4A23A', band: '#3E5A8C' };
const SWALLOW = 'M-3.2,-0.6 Q-1.6,-1.8 0,-0.2 Q1.6,-1.8 3.2,-0.6 Q1.4,-0.4 0.6,0.6 L1.4,2.4 L0,1.4 L-1.4,2.4 L-0.6,0.6 Q-1.4,-0.4 -3.2,-0.6 Z';
// Bouée rouge et blanche à plat (x, y écran), rayon r
const lifebuoy = (x, y, r, flat = 0.5) => ell(x, y, r + 1.3, r * flat + 1.3, OUT)
  + `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(r)}" ry="${f2(r * flat)}" fill="none" stroke="${HULL.cabin}" stroke-width="${f2(r * 0.5)}"/>`
  + `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(r)}" ry="${f2(r * flat)}" fill="none" stroke="#D8483A" stroke-width="${f2(r * 0.5)}" stroke-dasharray="${f2(r * 0.79)} ${f2(r * 0.79)}"/>`
  + ell(x, y, r * 0.72, r * flat * 0.72, 'none', ` stroke="${OUT}" stroke-width="0.6"`);
function hirondelle() {
  const Z = u => 20 + (u + 1.25) * 2.4; // hauteur du plat-bord (la tonture remonte vers la proue)
  const D = (u, v) => Z(u) - v * 10; // le pont penche vers le joueur (côté +v plus bas)
  const side = [[-1.25, 0.44], [-0.9, 0.48], [-0.2, 0.5], [0.5, 0.47], [1.0, 0.34], [1.35, 0.16], [1.58, 0]];
  const far = side.slice(0, -1).reverse().map(([u, v]) => [u, -v]);
  const hullAt = u => { for (let i = 0; i < side.length - 1; i++) { const [ua, va] = side[i], [ub, vb] = side[i + 1]; if (u >= ua && u <= ub) return va + (vb - va) * (u - ua) / (ub - ua); } return 0; };
  // point du bordé côté joueur à la hauteur z (le bordé rentre un peu vers le bas)
  const onSide = (u, z) => { const v = hullAt(u), d = D(u, v); return [u, v * (0.84 + 0.16 * Math.min(1, z / d)), z]; };
  const band = (ua, ub, z0, z1, fill) => face([onSide(ua, z0), onSide(ub, z0), onSide(ub, Math.min(z1, D(ub, hullAt(ub)))), onSide(ua, Math.min(z1, D(ua, hullAt(ua))))], fill);
  let o = shadow(0.15, 0.15, 1.45, 0.2);
  o += dune(-0.3, -0.72, 0.85, 0.3, 4) + dune(0.9, -0.5, 0.5, 0.25, 3);
  // bordé visible : côté +v (éclairé) blanc, carène rouge, liseré bleu sous le plat-bord ; à la proue, côté -v (ombre)
  for (let i = 0; i < side.length - 1; i++) {
    const [ua, va] = side[i], [ub, vb] = side[i + 1];
    o += face([[ua, va * 0.84, 0], [ub, vb * 0.84, 0], [ub, vb, D(ub, vb)], [ua, va, D(ua, va)]], i % 2 ? HULL.white2 : HULL.white, EDGE);
    o += band(ua, ub, 0, 6.5, HULL.red) + band(ua, ub, D(ua, va) - 4.2, D(ua, va) - 2.6, HULL.navy);
  }
  for (const [ua, va, ub, vb] of [[1.0, -0.34, 1.35, -0.16], [1.35, -0.16, 1.58, 0]]) {
    o += face([[ua, va * 0.84, 0], [ub, vb * 0.84, 0], [ub, vb, D(ub, vb)], [ua, va, D(ua, va)]], HULL.dark, EDGE)
      + face([[ua, va * 0.84, 0], [ub, vb * 0.84, 0], [ub, vb * 0.86, 6.5], [ua, va * 0.86, 6.5]], HULL.redD);
  }
  o += `<polyline points="${pts([P(1.0, -0.34 * 0.84, 6.5), P(1.35, -0.16 * 0.86, 6.5), P(1.58, 0, 6.5)])}" fill="none" stroke="rgba(40,25,10,.45)" stroke-width="0.7"/>`;
  o += `<polyline points="${pts(side.map(([u]) => P(...onSide(u, 6.5))))}" fill="none" stroke="rgba(40,25,10,.45)" stroke-width="0.7"/>`;
  // l'arrière arraché : le bordé déchiqueté laisse voir l'intérieur sombre de la coque
  o += `<polygon points="${pts([[-1.25, 0], [-1.25, 4], [-1.16, 6], [-1.22, 10.5], [-1.12, 13], [-1.2, 17], [-1.13, 19.6], [-1.25, 23]].map(([u, z]) => P(...onSide(u, Math.min(z, D(u, hullAt(u)))))))}" fill="#2E2218"${EDGE}/>`;
  o += ln(P(...onSide(-1.2, 8.6)), P(...onSide(-1.25, 8.6)), '#6E6A62', 1) + ln(P(...onSide(-1.17, 15.4)), P(...onSide(-1.25, 15.4)), '#6E6A62', 1);
  // hublots (cerclés de laiton), coulures de rouille dessous
  for (const u of [-0.98, -0.74, -0.5, 0.06, 0.3, 0.54, 0.78]) {
    const [x, y] = P(...onSide(u, D(u, hullAt(u)) - 9.4));
    o += ln([x + 0.4, y + 2.6], [x + 0.9, y + 7.4], 'rgba(160,90,40,.35)', 1.1)
      + ell(x, y, 2.3, 2.5, '#C9A24A', ` stroke="${OUT}" stroke-width="0.6"`) + ell(x, y, 1.5, 1.7, HULL.glass) + ell(x - 0.5, y - 0.6, 0.5, 0.5, '#FFFFFF', ' opacity=".8"');
  }
  // la déchirure dans le bordé : tôles tordues, l'entrepont dans l'ombre
  const gash = [[-0.38, 7.5], [-0.16, 5.6], [0.0, 10], [-0.08, 14.6], [-0.22, 12.4], [-0.34, 15.2]];
  o += `<polygon points="${pts(gash.map(([u, z]) => P(...onSide(u, z))))}" fill="#2E2218"${EDGE}/>`;
  o += ln(P(...onSide(-0.3, 11.6)), P(...onSide(-0.12, 11.2)), '#6E6A62', 1.2);
  for (const [u, z, dx, dy] of [[-0.16, 5.8, 2, 1.6], [0, 10, 2.2, -0.6], [-0.34, 15, -1.6, -1.8]]) { const [x, y] = P(...onSide(u, z)); o += `<path d="M${f2(x)},${f2(y)} l${dx},${dy} l${f2(-dx * 0.4)},${f2(dy * 0.9 + 1)} Z" fill="${HULL.white2}"${EDGE}/>`; }
  // l'hirondelle peinte à la proue, l'écubier et l'ancre qui pend
  { const [x, y] = P(...onSide(1.02, 15)); o += `<g transform="translate(${f2(x)} ${f2(y)}) matrix(1.5 -0.55 0 1.5 0 0)"><path d="${SWALLOW}" fill="${HULL.navy}"/></g>`; }
  { const [x, y] = P(...onSide(1.3, 19.6)); o += ell(x, y, 1.9, 1.5, '#2E2218', EDGE) + tk([x, y + 1.2], [x + 0.6, y + 9], IRON.left, 1.4)
      + pathTk(`M${f2(x - 2.6)},${f2(y + 8)} Q${f2(x + 0.6)},${f2(y + 11.6)} ${f2(x + 3.8)},${f2(y + 8)}`, IRON.top, 1.2) + tk([x - 1.4, y + 3], [x + 2.6, y + 3], IRON.left, 1); }
  // le sable qui ensevelit le pied de la coque, devant : un banc continu qui remonte contre le bordé
  const us = Array.from({ length: 15 }, (_, i) => -1.2 + i * (2.7 / 14));
  const tOf = u => Math.sin(((u + 1.2) / 2.7) * Math.PI);
  const inner = us.map(u => P(u, hullAt(u) * 0.96, 0.5 + 4.5 * Math.sqrt(tOf(u))));
  const outer = us.slice().reverse().map((u, i) => P(u + 0.03, hullAt(u) + tOf(u) * (0.22 + 0.06 * Math.sin(i * 1.9)) + 0.01, 0));
  o += `<polygon points="${pts([...inner, ...outer])}" fill="${SAND.light}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
    + `<polyline points="${pts(us.slice(2, -2).map((u, i) => P(u + 0.04, hullAt(u) + 0.1 + 0.03 * Math.sin(i * 2.3), 1.6)))}" fill="none" stroke="${SAND.dark}" stroke-width="0.9" opacity="0.6"/>`;
  o += pathTk(`M${pts([P(...onSide(0.42, 9))])} Q${pts([P(...onSide(0.5, 5))])} ${pts([P(...onSide(0.46, 1.4))])}`, '#5C8A45', 1);
  // le pont penché, planches le long de u ; l'arrière arraché (bord déchiqueté, trou sombre, planches cassées)
  const stern = [[-1.25, -0.3], [-1.16, -0.18], [-1.27, -0.06], [-1.14, 0.08], [-1.24, 0.2], [-1.15, 0.32]];
  const deck = [...side.slice(1), ...far.slice(0, -1), [-0.9, -0.48], ...stern, [-1.25, 0.44]].map(([u, v]) => P(u, v, D(u, v)));
  o += `<polygon points="${pts(deck)}" fill="${HULL.deck}"${EDGE}/>`;
  for (const k of [-0.32, -0.16, 0, 0.16, 0.32]) { const ue = 1.12 - Math.abs(k) * 1.2; o += ln(P(-1.12, k, D(-1.12, k)), P(ue, k, D(ue, k)), 'rgba(90,60,30,.35)', 0.7); }
  const hole = [[-1.12, -0.22], [-0.96, -0.3], [-0.9, -0.1], [-0.98, 0.1], [-1.1, 0.06]];
  o += `<polygon points="${pts(hole.map(([u, v]) => P(u, v, D(u, v))))}" fill="#2E2218"${EDGE}/>`;
  for (const [u, v, du] of [[-0.96, -0.22, 0.08], [-0.94, 0.02, 0.09]]) o += ln(P(u, v, D(u, v)), P(u - du, v, D(u, v) + 1.4), '#B08A5A', 2) + ln(P(u, v, D(u, v)), P(u - du, v, D(u, v) + 1.4), OUT, 0.5);
  // bastingage du fond (côté -v) : poteaux et main courante blancs
  const rail = (list, broken = []) => {
    let r = '';
    const ok = u => !broken.some(([a, b]) => u > a && u < b);
    for (const [u, v] of list) if (ok(u)) r += tk(P(u, v, D(u, v)), P(u, v, D(u, v) + 5.2), HULL.cabin, 0.8);
    let run = [];
    const flush = () => { if (run.length > 1) r += pathTk('M' + pts(run.map(([u, v]) => P(u, v, D(u, v) + 5.2))).split(' ').join(' L'), HULL.cabin, 1); run = []; };
    for (const p of list) { if (ok(p[0])) run.push(p); else flush(); }
    flush();
    return r;
  };
  const along = (pts0, n) => Array.from({ length: n + 1 }, (_, i) => { const u = pts0[0] + (pts0[1] - pts0[0]) * i / n; return u; });
  o += rail(along([-1.0, 1.3], 13).map(u => [u, -hullAt(u) * 0.94]));
  // le salon-passerelle : murs blancs, vitres bleues (une fendue), porte bleue, toit ; il suit la gîte du pont
  const cu0 = -0.78, cu1 = -0.08, cv0 = -0.26, cv1 = 0.2, H = 13;
  o += face([[cu0, cv1, D(cu0, cv1)], [cu1, cv1, D(cu1, cv1)], [cu1, cv1, D(cu1, cv1) + H], [cu0, cv1, D(cu0, cv1) + H]], HULL.cabin, EDGE);
  o += face([[cu1, cv0, D(cu1, cv0)], [cu1, cv1, D(cu1, cv1)], [cu1, cv1, D(cu1, cv1) + H], [cu1, cv0, D(cu1, cv0) + H]], HULL.cabinS, EDGE);
  o += face([[cu0 - 0.03, cv0 - 0.03, D(cu0, cv0) + H], [cu1 + 0.04, cv0 - 0.03, D(cu1, cv0) + H], [cu1 + 0.04, cv1 + 0.04, D(cu1, cv1) + H], [cu0 - 0.03, cv1 + 0.04, D(cu0, cv1) + H]], HULL.roof, EDGE)
    + face([[cu0 - 0.03, cv1 + 0.04, D(cu0, cv1) + H], [cu1 + 0.04, cv1 + 0.04, D(cu1, cv1) + H], [cu1 + 0.04, cv1 + 0.04, D(cu1, cv1) + H - 1.6], [cu0 - 0.03, cv1 + 0.04, D(cu0, cv1) + H - 1.6]], HULL.navy, EDGE);
  for (const [i, u] of [-0.72, -0.6, -0.48].entries()) {
    const q = [[u, cv1, D(u, cv1) + 5], [u + 0.08, cv1, D(u + 0.08, cv1) + 5], [u + 0.08, cv1, D(u + 0.08, cv1) + 10], [u, cv1, D(u, cv1) + 10]];
    o += face(q, i === 1 ? '#3E4E66' : HULL.glass, EDGE);
    if (i === 1) o += `<polyline points="${pts([P(u + 0.02, cv1, D(u, cv1) + 9.4), P(u + 0.05, cv1, D(u, cv1) + 7.2), P(u + 0.03, cv1, D(u, cv1) + 5.6)])}" fill="none" stroke="#DCE6F0" stroke-width="0.6"/>`;
    else o += ln(P(u + 0.015, cv1, D(u, cv1) + 9.2), P(u + 0.045, cv1, D(u, cv1) + 6.4), 'rgba(255,255,255,.55)', 0.7);
  }
  o += face([[-0.18, cv1, D(-0.18, cv1)], [-0.12, cv1, D(-0.12, cv1)], [-0.12, cv1, D(-0.12, cv1) + 10.4], [-0.18, cv1, D(-0.18, cv1) + 10.4]], HULL.navy, EDGE);
  for (const v of [-0.18, -0.04, 0.1]) o += face([[cu1, v, D(cu1, v) + 5.6], [cu1, v + 0.08, D(cu1, v + 0.08) + 5.6], [cu1, v + 0.08, D(cu1, v + 0.08) + 10.4], [cu1, v, D(cu1, v) + 10.4]], '#4E6A8E', EDGE);
  // la cheminée jaune à bande bleue, qui penche vers le joueur, sur le toit
  {
    const fu = -0.5, fv = -0.04, z0 = D(fu, fv) + H, h = 15, r = 6.2;
    const [bx, by] = P(fu, fv, z0), [tx, ty] = P(fu, fv + 0.09, z0 + h);
    const at = k => [bx + (tx - bx) * k, by + (ty - by) * k];
    const body = (k0, k1, fill) => { const [ax, ay] = at(k0), [cx, cy] = at(k1); return `<path d="M${f2(ax - r)},${f2(ay)} L${f2(cx - r)},${f2(cy)} A${r},${f2(r * 0.5)} 0 0 0 ${f2(cx + r)},${f2(cy)} L${f2(ax + r)},${f2(ay)} A${r},${f2(r * 0.5)} 0 0 1 ${f2(ax - r)},${f2(ay)} Z" fill="${fill}"/>`; };
    o += body(0, 1, HULL.funnel) + body(0.5, 0.72, HULL.band) + body(0.88, 1, '#2E2E36');
    const [sx, sy] = at(0.61); o += `<g transform="translate(${f2(sx - 1)} ${f2(sy + 1)}) scale(0.62)"><path d="${SWALLOW}" fill="#F4EEDF"/></g>`;
    o += `<path d="M${f2(bx + r * 0.25)},${f2(by + r * 0.48)} L${f2(tx + r * 0.25)},${f2(ty + r * 0.48)} L${f2(tx + r)},${f2(ty)} L${f2(bx + r)},${f2(by)} Z" fill="rgba(60,30,10,.16)"/>`;
    o += `<path d="M${f2(bx - r)},${f2(by)} L${f2(tx - r)},${f2(ty)} M${f2(bx + r)},${f2(by)} L${f2(tx + r)},${f2(ty)} M${f2(bx - r)},${f2(by)} A${r},${f2(r * 0.5)} 0 0 0 ${f2(bx + r)},${f2(by)}" fill="none" stroke="${OUT}" stroke-width="0.8"/>`;
    o += ell(tx, ty, r, r * 0.5, '#4A3A30', EDGE) + ell(tx, ty + 0.4, r * 0.7, r * 0.32, '#1E1814');
  }
  // la bouée accrochée au mur du salon
  { const [x, y] = P(-0.29, cv1 + 0.01, D(-0.29, cv1) + 7.4); o += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(-12)">${lifebuoy(0, 0, 3.4, 0.95)}</g>`; }
  // le mât de proue (blanc, une lanterne), la guirlande d'ampoules qui pend jusqu'à la cheminée et au plat-bord
  const [m0x, m0y] = P(1.04, 0, D(1.04, 0)), [m1x, m1y] = P(1.04, 0.07, D(1.04, 0) + 26);
  o += tk([m0x, m0y], [m1x, m1y], HULL.cabin, 1.6) + tk([m1x - 4, m1y + 5], [m1x + 4, m1y + 5.6], HULL.cabin, 1) + ell(m1x, m1y - 1.2, 1.8, 2, '#FFD15A', EDGE);
  const [fx, fy] = (() => { const [x, y] = P(-0.5, 0.05, D(-0.5, -0.04) + H + 12.6); return [x + 5.4, y + 1]; })();
  const garland = (a, b, sag, n) => {
    let g = `<path d="M${f2(a[0])},${f2(a[1])} Q${f2((a[0] + b[0]) / 2)},${f2((a[1] + b[1]) / 2 + sag * 2)} ${f2(b[0])},${f2(b[1])}" fill="none" stroke="#3A3A40" stroke-width="0.7"/>`;
    const cols = ['#F2584A', '#FFD15A', '#5EA8E8', '#7EC45B'];
    for (let i = 1; i < n; i++) { const t = i / n, x = (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * (a[0] + b[0]) / 2 + t * t * b[0], y = (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * ((a[1] + b[1]) / 2 + sag * 2) + t * t * b[1]; g += ell(x, y + 1, 1.1, 1.4, i % 5 === 3 ? '#5A5450' : cols[i % 4], ` stroke="${OUT}" stroke-width="0.4"`); }
    return g;
  };
  o += garland([m1x, m1y + 4], [fx, fy], 8, 9) + garland([m1x, m1y + 5], P(1.3, 0.16, D(1.3, 0.16) + 5), 4, 4);
  // bastingage côté joueur, crevé au milieu (un bout tordu)
  o += rail(along([-1.0, 1.32], 13).map(u => [u, hullAt(u)]), [[0.05, 0.5]]);
  { const a = P(0.04, hullAt(0.04), D(0.04, hullAt(0.04)) + 5.2), b = P(...onSide(0.1, D(0.1, hullAt(0.1)) - 5)); o += pathTk(`M${pts([a])} Q${f2(a[0] + 3.2)},${f2(a[1] + 1)} ${pts([b])}`, HULL.cabin, 1); }
  // dans le sable : algues, la bouée tombée, la chaise longue rayée retournée, une valise, une caisse
  o += kelp(-0.35, 1.25, 8) + kelp(1.05, 0.72, -14);
  { const [x, y] = P(0.62, 1.08, 0.6); o += lifebuoy(x, y, 4.6, 0.5); }
  {
    const c = [[-0.72, 0.98], [-0.42, 0.86], [-0.34, 1.06], [-0.64, 1.18]];
    o += face(c.map(([u, v]) => [u, v, 1.2]), '#F4F0E6', EDGE);
    for (const k of [0.2, 0.47, 0.74]) { const a = [c[0][0] + (c[1][0] - c[0][0]) * k, c[0][1] + (c[1][1] - c[0][1]) * k], b = [c[3][0] + (c[2][0] - c[3][0]) * k, c[3][1] + (c[2][1] - c[3][1]) * k], d = 0.05; o += face([[a[0], a[1], 1.2], [a[0] + d * 0.9, a[1] - d * 0.4, 1.2], [b[0] + d * 0.9, b[1] - d * 0.4, 1.2], [b[0], b[1], 1.2]], '#D8483A'); }
    o += stick(-0.7, 1.02, 1.2, -0.66, 1.0, 7.6, 1.4, WOOD.left) + stick(-0.4, 0.9, 1.2, -0.44, 0.92, 7.2, 1.4, WOOD.left) + tk(P(-0.66, 1.0, 7.6), P(-0.44, 0.92, 7.2), WOOD.top, 1.2);
  }
  {
    const vu = 1.14, vv = 0.98;
    o += shadow(vu, vv, 0.16, 0.16) + box(vu - 0.1, vv - 0.07, vu + 0.1, vv + 0.07, 0, 7, { top: '#B0743E', left: '#96602F', right: '#7A4C24' });
    o += face([[vu - 0.02, vv + 0.07, 0], [vu + 0.02, vv + 0.07, 0], [vu + 0.02, vv + 0.07, 7], [vu - 0.02, vv + 0.07, 7]], '#5A3A1C') + face([[vu - 0.02, vv - 0.07, 7], [vu + 0.02, vv - 0.07, 7], [vu + 0.02, vv + 0.07, 7], [vu - 0.02, vv + 0.07, 7]], '#5A3A1C');
    const [x1, y1] = P(vu - 0.06, vv + 0.07, 3.6), [x2, y2] = P(vu + 0.06, vv + 0.07, 4.4);
    o += ell(x1, y1, 1.6, 1.4, '#F2C04B', EDGE) + ell(x2, y2, 1.4, 1.2, '#5EA8E8', EDGE);
    const [hx, hy] = P(vu, vv, 7); o += pathTk(`M${f2(hx - 2.4)},${f2(hy)} Q${f2(hx)},${f2(hy - 3)} ${f2(hx + 2.4)},${f2(hy)}`, '#5A3A1C', 0.8);
  }
  o += crate(-1.0, 0.98, 0.12, 8);
  id('hirt'); // l'ancienne épave prenait un identifiant (son tonneau) : on le consomme pour que ceux des autres dessins ne bougent pas
  return o;
}

/* ---------- aides des coins ---------- */
// Sol du coin : une tache de sable (grève) ou de terre battue, sous l'ombre douce du jeu
const ground = (kind = 'sable') => shadow(0, 0.05, 1.02, 0.16) + disc(0.02, 0.05, 0, 0.92, kind === 'sable' ? 'rgba(232,212,160,.55)' : 'rgba(150,120,80,.22)');
// Rame plantée : manche du sol à z, pale en haut (u, v : pied ; lean : penchée vers +u)
function oar(u, v, h, lean = 0.06) {
  const a = P(u, v, 0), b = P(u + lean, v, h);
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
  const c = [b[0] - ux * 2, b[1] - uy * 2], t = [b[0] + ux * 11, b[1] + uy * 11];
  const blade = `M${f2(c[0] - 2.6)},${f2(c[1])} Q${f2(t[0] - 4)},${f2(t[1] + 4)} ${f2(t[0])},${f2(t[1])} Q${f2(t[0] + 4)},${f2(t[1] + 4)} ${f2(c[0] + 2.6)},${f2(c[1])} Z`;
  return tk(a, b, WOOD.left, 2.2) + `<path d="${blade}" fill="${WOOD.top}"${EDGE}/>` + ln(c, [t[0], t[1] + 2], 'rgba(90,55,25,.35)', 0.7);
}
// Tonneau couché le long de u : deux fonds, cerclages
function barrelLying(u, v, len = 0.36, r = 7) {
  const a = P(u - len / 2, v, r), b = P(u + len / 2, v, r);
  const body = `M${f2(a[0])},${f2(a[1] - r)} L${f2(b[0])},${f2(b[1] - r)} A${f2(r * 0.55)},${r} 0 0 1 ${f2(b[0])},${f2(b[1] + r)} L${f2(a[0])},${f2(a[1] + r)} Z`;
  let o = shadow(u, v, len * 0.7, 0.18) + `<path d="${body}" fill="#A8825A"${EDGE}/>`;
  for (const k of [0.22, 0.5, 0.78]) { const p = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; o += `<path d="M${f2(p[0])},${f2(p[1] - r)} A${f2(r * 0.55)},${r} 0 0 1 ${f2(p[0])},${f2(p[1] + r)}" fill="none" stroke="#5E4630" stroke-width="1"/>`; }
  return o + ell(a[0], a[1], r * 0.55, r, '#C9A274', EDGE) + ell(a[0], a[1], r * 0.32, r * 0.62, '#A8825A');
}
// Rouleau de corde posé au sol
const coil = (u, v, r = 0.13) => { const [x, y] = P(u, v, 1); const rx = r * 45, ry = r * 22.6; return ell(x, y + 1, rx + 0.6, ry + 0.6, OUT) + [1, 0.72, 0.46].map((k, i) => ell(x, y - i * 0.6, rx * k, ry * k, i % 2 ? '#B08850' : ROPE, ` stroke="${OUT}" stroke-width="0.5"`)).join(''); };
// Tas de voile mouillée : une toile molle retombée en tas (bosses arrondies), ombrée à droite, des plis, un coin
// qui traîne au sol
function canvasHeap(u, v, ru, rv, h, seed = 3) {
  const [x, y] = P(u, v, 0), rx = (ru + rv) * 32, ry = (ru + rv) * 16, k = seed % 2 ? 1 : -1;
  const d = `M${f2(x - rx)},${f2(y)} Q${f2(x - rx * 0.95)},${f2(y - h * 0.9)} ${f2(x - rx * 0.4)},${f2(y - h)} Q${f2(x - rx * 0.1)},${f2(y - h * 1.25)} ${f2(x + rx * 0.25)},${f2(y - h * 0.95)}`
    + ` Q${f2(x + rx * 0.7)},${f2(y - h * 1.05)} ${f2(x + rx * 0.9)},${f2(y - h * 0.4)} Q${f2(x + rx * 1.05)},${f2(y + ry * 0.2)} ${f2(x + rx * 0.6)},${f2(y + ry * 0.7)}`
    + ` Q${f2(x)},${f2(y + ry * 1.05)} ${f2(x - rx * 0.6)},${f2(y + ry * 0.7)} Q${f2(x - rx * 1.02)},${f2(y + ry * 0.4)} ${f2(x - rx)},${f2(y)} Z`;
  const cid = id('heap');
  const corner = `M${f2(x + rx * 0.5 * k)},${f2(y + ry * 0.6)} L${f2(x + rx * 1.15 * k)},${f2(y + ry * 1.2)} L${f2(x + rx * 0.2 * k)},${f2(y + ry * 0.95)} Z`;
  return `<path d="${corner}" fill="${CANVAS.mid}"${EDGE}/>`
    + `<path d="${d}" fill="${CANVAS.light}"${EDGE}/>`
    + `<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})"><ellipse cx="${f2(x + rx * 0.75)}" cy="${f2(y - h * 0.3)}" rx="${f2(rx * 0.6)}" ry="${f2(h * 1.2)}" fill="${CANVAS.dark}" opacity="0.55"/>`
    + `<ellipse cx="${f2(x - rx * 0.3)}" cy="${f2(y - h * 0.9)}" rx="${f2(rx * 0.3)}" ry="${f2(h * 0.18)}" fill="#FFFFFF" opacity="0.35"/></g>`
    + `<path d="M${f2(x - rx * 0.55)},${f2(y - h * 0.55)} Q${f2(x - rx * 0.2)},${f2(y - h * 0.2)} ${f2(x + rx * 0.1)},${f2(y - h * 0.5)}" fill="none" stroke="${CANVAS.dark}" stroke-width="0.8" stroke-linecap="round"/>`
    + `<path d="M${f2(x + rx * 0.2)},${f2(y - h * 0.15)} Q${f2(x + rx * 0.45)},${f2(y + ry * 0.2)} ${f2(x + rx * 0.7)},${f2(y - h * 0.1)}" fill="none" stroke="${CANVAS.dark}" stroke-width="0.8" stroke-linecap="round"/>`
    + `<path d="M${f2(x - rx * 0.8)},${f2(y - h * 0.2)} Q${f2(x - rx * 0.2)},${f2(y + ry * 0.1)} ${f2(x + rx * 0.5)},${f2(y + ry * 0.35)}" fill="none" stroke="${CANVAS.seam}" stroke-width="0.7" stroke-dasharray="1.6 1.2"/>`;
}
// Coquillage, étoile de mer
const shell = (u, v) => { const [x, y] = P(u, v, 0); return `<path d="M${f2(x - 2)},${f2(y)} Q${f2(x)},${f2(y - 3.4)} ${f2(x + 2)},${f2(y)} Z" fill="#F4E4D4" stroke="${OUT}" stroke-width="0.5"/>`; };
// Voile tendue (un pan de toile) : quatre coins du repère, coutures, ombre sous le pan
function sailPanel(corners, c = CANVAS, seams = 2) {
  const q = iso(corners);
  let o = `<polygon points="${pts(q)}" fill="${c.light}"${EDGE}/>`;
  for (let i = 1; i <= seams; i++) {
    const k = i / (seams + 1);
    const a = [q[0][0] + (q[1][0] - q[0][0]) * k, q[0][1] + (q[1][1] - q[0][1]) * k], b = [q[3][0] + (q[2][0] - q[3][0]) * k, q[3][1] + (q[2][1] - q[3][1]) * k];
    o += `<path d="M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])}" stroke="${c.seam}" stroke-width="0.7" stroke-dasharray="1.6 1.2" fill="none"/>`;
  }
  return o;
}
// Foulard rouge en fanion au bout d'un mât (vent vers +u)
const flag = (x, y, n = 0) => `<path d="M${f2(x)},${f2(y)} Q${f2(x + 6)},${f2(y + (n ? 2 : -1))} ${f2(x + 12)},${f2(y + 1)} L${f2(x + 9)},${f2(y + 3.4)} L${f2(x + 12)},${f2(y + 6)} Q${f2(x + 6)},${f2(y + (n ? 7 : 4.4))} ${f2(x)},${f2(y + 5.6)} Z" fill="#C8463A"${EDGE}/>`;

/* ---------- le coin d'Aster (T2, la Crique) : avant le Ponton ---------- */
// 1. débris : ce qu'elle a repêché le premier soir (caisses, tonneau, voile mouillée, rame plantée, corde, longue-vue)
function asterDebris() {
  let o = ground('sable');
  o += oar(-0.62, -0.5, 30) + canvasHeap(-0.18, -0.42, 0.26, 0.2, 10, 5);
  o += crate(0.36, -0.36, 0.17, 13) + crate(0.34, -0.38, 0.12, 9, 13) + crate(0.66, -0.06, 0.12, 9);
  // la longue-vue posée sur la caisse du haut
  { const a = P(0.27, -0.4, 22.6), b = P(0.42, -0.36, 22.6); o += tk(a, b, '#C9A24A', 2.2) + ln([a[0], a[1] - 0.6], [b[0], b[1] - 0.6], '#F0D58A', 0.6); }
  o += coil(-0.42, 0.22) + barrelLying(0.12, 0.34, 0.34, 6.5);
  o += kelp(-0.7, 0.62, 12) + kelp(0.6, 0.66, -10) + shell(-0.1, 0.72) + shell(0.36, 0.74) + stone(0.78, 0.38, 2.6);
  return o;
}
// 2. abri : la voile tendue en coupe-vent, très inclinée, entre la rame plantée et un piquet, son pied lesté de
// galets derrière ; devant, à l'abri du vent du large, un lit de toile et sa couverture rouge ; caisses et tonneau
function asterShelter() {
  let o = ground('sable');
  const A = [-0.56, -0.18], B = [0.5, -0.22], hA = 34, hB = 26;
  // la voile, vue par en dessous (plus sombre), du haut des mâts jusqu'au sol derrière
  o += sailPanel([[-0.62, -0.66, 0], [0.56, -0.7, 0], [B[0], B[1], hB], [A[0], A[1], hA]], { light: CANVAS.mid, seam: CANVAS.dark }, 2);
  o += `<polyline points="${pts(iso([[A[0], A[1], hA], [B[0], B[1], hB]]))}" fill="none" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/>`
    + `<polyline points="${pts(iso([[A[0], A[1], hA], [B[0], B[1], hB]]))}" fill="none" stroke="${CANVAS.light}" stroke-width="1" stroke-linecap="round"/>`;
  for (const u of [-0.3, 0.05, 0.36]) o += stone(u, -0.64 - u * 0.03, 2.6);
  // devant : l'ombre de la voile, le lit de toile, la couverture rouge, la longue-vue posée
  o += `<polygon points="${pts(iso([[-0.56, -0.2, 0], [0.5, -0.24, 0], [0.42, 0.02, 0], [-0.5, 0.06, 0]]))}" fill="rgba(60,40,25,.14)"/>`;
  o += plank([-0.36, 0.02], [0.28, -0.02], 0.34, 2.4, { top: CANVAS.light, left: CANVAS.dark }) + plank([-0.3, 0.06], [0.02, 0.04], 0.26, 4, { top: '#C8463A', left: '#9A2F28' });
  { const a = P(0.12, -0.12, 3), b = P(0.24, -0.08, 3); o += tk(a, b, '#C9A24A', 2) + ln([a[0], a[1] - 0.5], [b[0], b[1] - 0.5], '#F0D58A', 0.5); }
  // les deux mâts, la pale de la rame en haut ; les cordes qui retiennent la voile vers l'avant
  o += stick(A[0], A[1], 0, A[0] + 0.02, A[1], hA, 2.2, WOOD.left) + stick(B[0], B[1], 0, B[0], B[1] + 0.01, hB, 2, DRIFT.left);
  { const t = P(A[0] + 0.02, A[1], hA); o += `<path d="M${f2(t[0] - 2.6)},${f2(t[1])} Q${f2(t[0] - 3)},${f2(t[1] - 9)} ${f2(t[0])},${f2(t[1] - 12)} Q${f2(t[0] + 3)},${f2(t[1] - 9)} ${f2(t[0] + 2.6)},${f2(t[1])} Z" fill="${WOOD.top}"${EDGE}/>`; }
  o += rope(P(A[0], A[1], hA - 1), P(-0.88, 0.42, 1), 3, 0.6) + rope(P(B[0], B[1], hB - 1), P(0.84, 0.36, 1), 3, 0.6);
  o += stick(-0.88, 0.42, 0, -0.86, 0.42, 5, 1.6, WOOD_DARK.left) + stick(0.84, 0.36, 0, 0.86, 0.36, 5, 1.6, WOOD_DARK.left);
  // à côté : caisses, tonneau, corde, algue
  o += crate(0.76, -0.4, 0.13, 10) + crate(0.66, 0.06, 0.11, 8) + barrelLying(-0.04, 0.6, 0.3, 6) + coil(-0.6, 0.56) + kelp(0.4, 0.8, -10) + shell(0.18, 0.84);
  return o;
}
// 3. cabanon : une cabane faite des planches des caisses, toit de toile à voile, mât de vigie au foulard rouge
function asterCabin(n = 0) {
  let o = ground('sable');
  const u0 = -0.6, u1 = 0.2, v0 = -0.66, v1 = 0.02, h = 20;
  // le mât de vigie derrière, à droite, le foulard rouge
  o += stick(0.56, -0.62, 0, 0.56, -0.62, 50, 2.4, WOOD_DARK.left) + stick(0.44, -0.62, 40, 0.68, -0.62, 40, 1.6, WOOD_DARK.left);
  { const t = P(0.56, -0.62, 50); o += flag(t[0] + 1, t[1] - 1, n); }
  o += rope(P(0.56, -0.62, 46), P(0.9, -0.3, 1), 3, 0.6);
  // murs de planches de caisses (planches de teintes différentes, une planche marquée)
  o += box(u0, v0, u1, v1, 0, h, CRATE) + planksLeft(u0, u1, v1, 0, h, 4) + planksRight(u1, v0, v1, 0, h, 4);
  o += face([[-0.36, v1, 7], [-0.12, v1, 7], [-0.12, v1, 11], [-0.36, v1, 11]], '#9C7148', EDGE);
  o += face([[u1, -0.5, 4], [u1, -0.3, 4], [u1, -0.3, 8], [u1, -0.5, 8]], '#A97E52', EDGE);
  // la porte (un pan de voile en rideau), une lucarne
  o += face([[-0.06, v1, 0], [0.12, v1, 0], [0.12, v1, 15], [-0.06, v1, 15]], '#2E2218', EDGE);
  o += face([[-0.06, v1, 15], [0.04, v1, 15], [0.03, v1, 4], [-0.06, v1, 2]], CANVAS.light, EDGE);
  o += face([[u1, -0.18, 11], [u1, -0.06, 11], [u1, -0.06, 16], [u1, -0.18, 16]], '#2E2218', EDGE);
  // toit de toile à voile, rayé de coutures, tenu par des cordes
  o += gable(u0, v0, u1, v1, h, 12, { front: CANVAS.light, back: CANVAS.mid, gable: CANVAS.dark }, 0.1);
  for (const k of [0.33, 0.66]) { const u = u0 - 0.1 + (u1 - u0 + 0.2) * k; o += ln(P(u, (v0 + v1) / 2, h + 12), P(u, v1 + 0.1, h), CANVAS.seam, 0.7); }
  o += rope(P(u0 - 0.06, v1 + 0.1, h - 1), P(u0 - 0.2, v1 + 0.24, 0), 1, 0.6) + rope(P(u1 + 0.06, v1 + 0.1, h - 1), P(u1 + 0.24, v1 + 0.26, 0), 1, 0.6);
  // devant : la rame contre le mur, les caisses, la corde, le tonneau debout
  o += stick(-0.5, 0.06, 0, -0.44, 0.04, 26, 2, WOOD.left);
  o += crate(0.56, 0.2, 0.12, 9) + coil(-0.62, 0.48) + cylinder(0.36, 0.52, 0, 12, 0.11, { top: '#C9A274', left: '#A8825A', right: '#7A5A3E' }, id('ast')) + kelp(0.7, 0.74, -10);
  return o;
}

/* ---------- le coin de Cannelle (T3, derrière l'épave) : avant le feu de camp du Foyer ---------- */
// Un pan de coque de l'Hirondelle dressé en coupe-vent (bordages courbes, membrures), un trépied de bois flotté et la
// marmite cabossée au-dessus d'un petit feu, deux caisses pour s'asseoir, la louche posée, des poissons séchant
function hullWall(pts3, h0, h1, c = { a: '#8E6A48', b: '#86633F' }) {
  // pan de coque debout le long d'une courbe au sol (liste [u, v]) ; hauteur de h0 (bouts) à h1 (milieu), bord cassé
  let o = '';
  const n = pts3.length - 1;
  for (let i = 0; i < n; i++) {
    const [ua, va] = pts3[i], [ub, vb] = pts3[i + 1];
    const ha = h0 + (h1 - h0) * Math.sin((i / n) * Math.PI), hb = h0 + (h1 - h0) * Math.sin(((i + 1) / n) * Math.PI);
    const jag = i % 2 ? -2.4 : 1.6;
    o += face([[ua, va, 0], [ub, vb, 0], [ub, vb, hb + jag], [ua, va, ha]], i % 2 ? c.a : c.b, EDGE);
    for (const k of [0.33, 0.66]) o += ln(P(ua, va, ha * k), P(ub, vb, hb * k), 'rgba(40,25,10,.35)', 0.7);
  }
  return o;
}
function cannelleKitchen(n = 0) {
  let o = ground('sable');
  // le pan de coque derrière, courbe ; deux membrures qui dépassent
  const curve = [[-0.78, -0.2], [-0.66, -0.52], [-0.4, -0.72], [-0.06, -0.8], [0.3, -0.76], [0.6, -0.58]];
  o += stick(-0.5, -0.66, 0, -0.52, -0.66, 30, 2.4, '#7A5A3E') + stick(0.18, -0.8, 0, 0.18, -0.8, 27, 2.4, '#7A5A3E');
  o += hullWall(curve, 10, 24);
  o += [[-0.6, -0.58, 10], [0.4, -0.7, 14]].map(([u, v, z]) => { const [x, y] = P(u, v, z); return ell(x, y, 1, 0.7, '#D9D2C2', ` stroke="${OUT}" stroke-width="0.4"`); }).join('');
  // des poissons qui sèchent sur une corde tendue entre les membrures
  { const a = P(-0.5, -0.64, 26), b = P(0.18, -0.78, 23); o += rope(a, b, 4, 0.5);
    for (const t of [0.25, 0.5, 0.75]) { const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + 4 * Math.sin(t * Math.PI) - 0.4; o += ln([x, y], [x, y + 2], OUT, 0.5) + `<path d="M${f2(x)},${f2(y + 2)} q2.2,2.6 0,6 q-2.2,-3.4 0,-6 Z M${f2(x - 1.4)},${f2(y + 9.2)} L${f2(x)},${f2(y + 7.6)} L${f2(x + 1.4)},${f2(y + 9.2)} Z" fill="#9FB4C2" stroke="${OUT}" stroke-width="0.5"/>`; } }
  // le feu, le trépied et la marmite qui pend
  o += driftFire(0.04, -0.06, 0.66, n);
  const top = P(0.04, -0.06, 40);
  for (const [u, v] of [[-0.3, -0.26], [0.34, -0.22], [0.06, 0.28]]) o += tk(P(u, v, 0), top, DRIFT.left, 2);
  o += ln(top, P(0.04, -0.06, 25), OUT, 0.9);
  { const [x, y] = P(0.04, -0.06, 19); o += `<path d="M${f2(x - 6.6)},${f2(y - 5)} L${f2(x - 6)},${f2(y + 2)} Q${f2(x)},${f2(y + 5.6)} ${f2(x + 6)},${f2(y + 2)} L${f2(x + 6.6)},${f2(y - 5)} Z" fill="${IRON.left}"${EDGE}/>`
    + ell(x, y - 5, 6.6, 2.6, IRON.top, EDGE) + ell(x, y - 5, 5.2, 1.8, '#C9934E') + `<path d="M${f2(x - 6.4)},${f2(y - 5)} Q${f2(x)},${f2(y - 14)} ${f2(x + 6.4)},${f2(y - 5)}" fill="none" stroke="${OUT}" stroke-width="0.8"/>`
    + `<path d="M${f2(x + 2.4)},${f2(y + 0.6)} l1.4,1.6 l1.2,-0.8" fill="none" stroke="${OUT}" stroke-width="0.6"/>`; }
  // les caisses pour s'asseoir, la louche posée dessus, un seau
  o += crate(-0.5, 0.24, 0.13, 9) + crate(0.56, 0.18, 0.13, 9);
  { const a = P(0.46, 0.12, 9.6), b = P(0.66, 0.24, 9.6); o += tk(a, b, '#C27C45', 1.4) + ell(b[0] + 2.4, b[1] + 0.6, 3, 1.8, '#C27C45', EDGE) + ell(b[0] + 2.4, b[1] + 0.4, 2, 1.1, '#8F5530'); }
  o += cylinder(-0.2, 0.58, 0, 9, 0.1, { top: '#C9CED6', left: '#AEB4BC', right: '#868C94' }, id('cas')) + kelp(0.5, 0.74, -8) + shell(-0.62, 0.66);
  return o;
}

/* ---------- le coin de Rivet (T4, sous une voile échouée) : avant l'établi et l'Atelier ---------- */
// Roue dentée posée à plat (rot : angle), boîte de vis, pendule cassée
function gear(u, v, r, z = 0, rot = 0) {
  const [x, y] = P(u, v, z);
  const ptsG = Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8 + rot, rr = i % 2 ? r * 0.76 : r; return [x + Math.cos(a) * rr * 1.4, y + Math.sin(a) * rr * 0.7]; });
  return `<polygon points="${pts(ptsG)}" fill="${IRON.top}"${EDGE}/>` + ell(x, y, r * 0.55, r * 0.28, IRON.right) + ell(x, y, r * 0.2, r * 0.1, OUT);
}
function screwTin(u, v) {
  const [x, y] = P(u, v, 0);
  return box(u - 0.08, v - 0.06, u + 0.08, v + 0.06, 0, 4, { top: '#C9CED6', left: '#AEB4BC', right: '#868C94' })
    + [[-3, -4.6], [-1, -4.8], [1.2, -4.4], [3, -4.8]].map(([dx, dy]) => ell(x + dx, y + dy, 0.8, 0.5, '#D9C27A', ` stroke="${OUT}" stroke-width="0.4"`)).join('');
}
function brokenClock(u, v) {
  const [x, y] = P(u, v, 0);
  return `<path d="M${f2(x - 5)},${f2(y)} L${f2(x - 5)},${f2(y - 12)} Q${f2(x)},${f2(y - 18)} ${f2(x + 5)},${f2(y - 12)} L${f2(x + 5)},${f2(y)} Z" fill="#8A5A36"${EDGE}/>`
    + ell(x, y - 10, 3.4, 3.4, '#F4EEDF', EDGE) + ln([x, y - 10], [x + 1.6, y - 12], OUT, 0.6) + ln([x, y - 10], [x - 1, y - 8], OUT, 0.6)
    + `<path d="M${f2(x - 2.6)},${f2(y - 12.4)} L${f2(x - 0.6)},${f2(y - 9.6)} L${f2(x + 0.8)},${f2(y - 11)} L${f2(x + 2.4)},${f2(y - 8.6)}" fill="none" stroke="${OUT}" stroke-width="0.45"/>`;
}
// 1. débris : la voile échouée retombée en tas sur une rame, la ferraille triée par tas, la pendule cassée
function rivetDebris() {
  let o = ground('sable');
  o += stick(-0.4, -0.5, 0, -0.32, -0.52, 22, 2.2, WOOD.left) + canvasHeap(-0.1, -0.42, 0.42, 0.3, 14, 7) + canvasHeap(-0.46, -0.3, 0.2, 0.16, 7, 2);
  o += brokenClock(0.48, -0.44) + gear(0.2, -0.02, 4.6, 0, 0.2) + gear(0.42, 0.06, 3.2, 0, 0.6) + gear(0.56, 0.24, 2.4, 0, 0.1);
  o += screwTin(-0.28, 0.18) + [[-0.06, 0.34], [0.08, 0.4], [-0.16, 0.46]].map(([u, v]) => { const [x, y] = P(u, v, 0); return ell(x, y, 2.6, 1.2, '#B8C0C8', EDGE) + ell(x - 0.6, y - 0.4, 1, 0.4, '#E4E8EC'); }).join('');
  o += kelp(-0.7, 0.5, 10) + shell(0.66, 0.6) + stone(0.78, 0.2, 2.4);
  return o;
}
// 2. abri : la voile tendue en tente sur une rame (pignon ouvert : l'intérieur sombre, une couverture), et devant,
// l'établi de caisses et de planche, ses outils et ses rouages
function rivetShelter() {
  let o = ground('sable');
  const u0 = -0.7, u1 = 0.2, v0 = -0.72, v1 = -0.06;
  o += gable(u0, v0, u1, v1, 0, 30, { front: CANVAS.light, back: CANVAS.mid, gable: '#2E2218' }, 0.06);
  o += ell(...P(0.12, -0.38, 0.6), 7, 2.6, '#C8463A', EDGE).replace('<ellipse cx="', '<ellipse cx="');
  for (const k of [0.33, 0.66]) { const u = u0 + (u1 - u0) * k; o += ln(P(u, (v0 + v1) / 2, 30), P(u, v1 + 0.06, 0), CANVAS.seam, 0.7); }
  o += stick(u0 - 0.14, (v0 + v1) / 2, 30, u1 + 0.16, (v0 + v1) / 2, 30, 2.2, WOOD.left);
  { const t = P(u1 + 0.16, (v0 + v1) / 2, 30); o += `<path d="M${f2(t[0] - 1.2)},${f2(t[1] - 2.6)} Q${f2(t[0] + 6)},${f2(t[1] - 1.4)} ${f2(t[0] + 9)},${f2(t[1] + 2)} Q${f2(t[0] + 5)},${f2(t[1] + 3.6)} ${f2(t[0] - 1.2)},${f2(t[1] + 2.6)} Z" fill="${WOOD.top}"${EDGE}/>`; }
  // l'établi : deux caisses, une planche dessus, le marteau, une roue dentée, la boîte de vis
  o += crate(0.18, 0.28, 0.12, 12) + crate(0.66, 0.06, 0.12, 12);
  o += face([[0.02, 0.06, 12], [0.8, -0.16, 12], [0.82, 0.08, 12], [0.04, 0.32, 12]], WOOD.top, EDGE) + face([[0.04, 0.32, 12], [0.82, 0.08, 12], [0.82, 0.08, 14], [0.04, 0.32, 14]], WOOD.left, EDGE).replace(/points="[^"]*"/, m => m);
  o += gear(0.5, 0.0, 3, 12.5, 0.3) + screwTin(0.24, 0.12).replace(/(<polygon[^>]*>)/, '$1') ;
  { const a = P(0.34, 0.18, 13), b = P(0.48, 0.14, 13); o += tk(a, b, '#A8743F', 1.2) + `<rect x="${f2(b[0] - 0.6)}" y="${f2(b[1] - 3)}" width="2.4" height="5" rx="0.6" fill="${IRON.left}"${EDGE}/>`; }
  o += brokenClock(-0.6, 0.36) + kelp(0.6, 0.66, -10);
  return o;
}
// 3. cabanon : un appentis de planches au toit de toile, ouvert devant ; l'établi avec son étau, des outils pendus,
// une caisse de ferraille, la pendule réparée qui sèche
function rivetCabin() {
  let o = ground('sable');
  const u0 = -0.7, u1 = 0.4, v0 = -0.74, v1 = -0.14;
  // mur du fond et mur de côté (planches), toit de toile en pente vers l'arrière
  o += face([[u0, v0, 0], [u1, v0, 0], [u1, v0, 22], [u0, v0, 22]], WOOD_DARK.left, EDGE) + planksLeft(u0, u1, v0, 0, 22, 5);
  o += face([[u0, v0, 0], [u0, v1, 0], [u0, v1, 26], [u0, v0, 22]], WOOD_DARK.right, EDGE);
  // des outils pendus au mur du fond
  for (const [u, l] of [[-0.42, 8], [-0.24, 6], [-0.06, 9]]) { const a = P(u, v0 + 0.01, 18), b = P(u, v0 + 0.01, 18 - l); o += ln(a, b, IRON.left, 1.4) + ln(a, b, OUT, 0.3); }
  o += brokenClock(0.2, v0 + 0.06).replace('#8A5A36', '#A87650');
  // l'établi le long du fond, l'étau
  o += box(-0.6, v0 + 0.06, 0.1, v0 + 0.26, 0, 11, WOOD) + planksLeft(-0.6, 0.1, v0 + 0.26, 0, 11, 3.6);
  o += box(-0.2, v0 + 0.1, -0.06, v0 + 0.2, 11, 15, IRON) + gear(-0.4, v0 + 0.16, 2.6, 11.2, 0.4);
  // poteau avant et toit de toile
  o += stick(u1, v1, 0, u1, v1, 26, 2.2, DRIFT.left) + stick(u0 + 0.02, v1, 0, u0 + 0.02, v1, 26, 2.2, DRIFT.left);
  o += face([[u0 - 0.06, v1 + 0.08, 27], [u1 + 0.08, v1 + 0.08, 27], [u1 + 0.08, v0 - 0.04, 23], [u0 - 0.06, v0 - 0.04, 23]], CANVAS.light, EDGE);
  for (const k of [0.25, 0.5, 0.75]) { const u = u0 + (u1 - u0) * k; o += ln(P(u, v1 + 0.08, 27), P(u, v0 - 0.04, 23), CANVAS.seam, 0.7); }
  o += `<polyline points="${pts(iso([[u0 - 0.06, v1 + 0.08, 27], [u1 + 0.08, v1 + 0.08, 27]]))}" fill="none" stroke="${CANVAS.dark}" stroke-width="1.4"/>`;
  // devant : la caisse de ferraille, des rouages, la boîte de vis
  o += crate(0.62, 0.12, 0.13, 10) + gear(0.62, 0.12, 2.8, 10.4, 0.2) + gear(0.1, 0.24, 3.6, 0, 0.5) + screwTin(-0.3, 0.3) + kelp(-0.66, 0.6, 10);
  return o;
}

/* ---------- aides : eau, feuilles, bateaux ---------- */
const WATER = { deep: '#6FB8D2', mid: '#8FCDE0', light: '#CFEFF7' };
// Petite source : une mare entourée de pierres moussues, des ronds dans l'eau (n : l'image)
function pool(u, v, r, n = 0) {
  let o = disc(u, v, 0, r + 0.06, '#7A6A54') + disc(u, v, 0.5, r, WATER.deep, EDGE) + disc(u - r * 0.15, v - r * 0.15, 0.6, r * 0.62, WATER.mid);
  const [x, y] = P(u, v, 0.8);
  o += ell(x + (n ? 2 : -1), y, (n ? 6 : 4) * r * 2.4, (n ? 3 : 2) * r * 2.4, 'none', ` stroke="${WATER.light}" stroke-width="0.7"`);
  const ring = Array.from({ length: 7 }, (_, k) => { const a = (k / 7) * Math.PI * 2 + 0.3; return [u + Math.cos(a) * (r + 0.05), v + Math.sin(a) * (r + 0.05), k]; }).sort((p, q) => p[0] + p[1] - q[0] - q[1]);
  for (const [pu, pv, k] of ring) o += stone(pu, pv, 2.6 + (k % 3) * 0.6, k % 2 ? STONE : { top: '#D9DCC8', left: '#B7BCA4', right: '#8E947E' });
  return o;
}
// Bocal couché ou debout
const jarAt = (u, v, z = 0, lying = false) => { const [x, y] = P(u, v, z); return lying
  ? `<g transform="translate(${f2(x)} ${f2(y - 2.2)}) rotate(78)">${`<rect x="-2" y="-2.8" width="4" height="5.2" rx="1.2" fill="#D6ECF2" fill-opacity="0.8" stroke="${OUT}" stroke-width="0.7"/><rect x="-1.4" y="-3.8" width="2.8" height="1.4" rx="0.4" fill="#B07E4C" stroke="${OUT}" stroke-width="0.6"/>`}</g>`
  : `<rect x="${f2(x - 2)}" y="${f2(y - 5.6)}" width="4" height="5.6" rx="1.2" fill="#D6ECF2" fill-opacity="0.8" stroke="${OUT}" stroke-width="0.7"/><rect x="${f2(x - 1.4)}" y="${f2(y - 7)}" width="2.8" height="1.6" rx="0.4" fill="#B07E4C" stroke="${OUT}" stroke-width="0.6"/>`
    + ln([x - 1.1, y - 4.6], [x - 1.1, y - 1.4], '#FFFFFF', 0.6); };
// Grande feuille (vue de dessus, posée ou en toiture) : centre écran, longueur, angle
const bigLeaf = (x, y, l, rot, c = '#6FAE4E', cs = '#4F8F3A') => `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${rot})"><path d="M0,${f2(-l / 2)} Q${f2(l * 0.32)},0 0,${f2(l / 2)} Q${f2(-l * 0.32)},0 0,${f2(-l / 2)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.6"/><path d="M0,${f2(-l / 2 + 1)} L0,${f2(l / 2 - 1)}" stroke="${cs}" stroke-width="0.6"/></g>`;
// Tas de feuilles (nid) : boules de feuilles mêlées
const leafPile = (u, v, r, cols = ['#9AB85A', '#7EA548', '#C9B25A']) => { const [x, y] = P(u, v, 2); let o = ell(x, y + 1, r * 30 + 1, r * 15 + 1, OUT); for (let i = 0; i < 9; i++) { const a = i * 2.4; o += ell(x + Math.cos(a) * r * 18 * ((i % 3) / 3 + 0.4), y + Math.sin(a) * r * 8 * ((i % 3) / 3 + 0.4) - 1, r * 13, r * 7, cols[i % 3]); } return o; };
// Barque (debout, ouverte) le long de u : bordé, intérieur, banc ; ou retournée (quille en l'air)
function boatHull(u, v, len, half, h, flipped = false, c = { out: '#B07A45', side: '#8A5A32', inside: '#6E4A2C', rim: '#C99A62' }) {
  const N = 9, side = Array.from({ length: N }, (_, i) => { const t = i / (N - 1), uu = u - len / 2 + len * t; return [uu, half * Math.sin(t * Math.PI) ** 0.7]; });
  const near = side.map(([uu, vv]) => [uu, v + vv]), far = side.map(([uu, vv]) => [uu, v - vv]).reverse();
  let o = shadow(u, v, len * 0.55, 0.18);
  if (!flipped) {
    o += `<polygon points="${pts([...near.map(([a, b]) => P(a, b, h)), ...far.map(([a, b]) => P(a, b, h))])}" fill="${c.inside}"${EDGE}/>`;
    o += `<polygon points="${pts([...near.map(([a, b]) => P(a, b, h)), ...near.slice().reverse().map(([a, b]) => P(a, v + (b - v) * 0.55, 0))])}" fill="${c.side}"${EDGE}/>`;
    o += `<polyline points="${pts(near.map(([a, b]) => P(a, v + (b - v) * 0.8, h * 0.45)))}" fill="none" stroke="rgba(40,25,10,.35)" stroke-width="0.8"/>`;
    o += face([[u - 0.04, v - half * 0.9, h - 1], [u + 0.04, v - half * 0.9, h - 1], [u + 0.04, v + half * 0.9, h - 1], [u - 0.04, v + half * 0.9, h - 1]], c.rim, EDGE);
    o += `<polyline points="${pts(near.map(([a, b]) => P(a, b, h)))}" fill="none" stroke="${OUT}" stroke-width="2.2"/><polyline points="${pts(near.map(([a, b]) => P(a, b, h)))}" fill="none" stroke="${c.rim}" stroke-width="1"/>`;
  } else {
    // retournée : la coque bombée, les bordages et la quille sur le dessus
    const top = side.map(([uu]) => [uu, v]);
    o += `<polygon points="${pts([...near.map(([a, b]) => P(a, b, 0)), ...top.slice().reverse().map(([a, b], i) => P(a, b, h * Math.sin(((N - 1 - i) / (N - 1)) * Math.PI) ** 0.5))])}" fill="${c.out}"${EDGE}/>`;
    for (const k of [0.33, 0.66]) o += `<polyline points="${pts(side.map(([a, vv], i) => P(a, v + vv * k, h * (1 - k * 0.6) * Math.sin((i / (N - 1)) * Math.PI) ** 0.5)))}" fill="none" stroke="rgba(40,25,10,.4)" stroke-width="0.8"/>`;
    o += `<polyline points="${pts(top.map(([a, b], i) => P(a, b, h * Math.sin((i / (N - 1)) * Math.PI) ** 0.5)))}" fill="none" stroke="${OUT}" stroke-width="2.4"/><polyline points="${pts(top.map(([a, b], i) => P(a, b, h * Math.sin((i / (N - 1)) * Math.PI) ** 0.5)))}" fill="none" stroke="${c.side}" stroke-width="1.1"/>`;
  }
  return o;
}
// Graines et pousses : un carré de semis (terre bêchée, rangs de pousses), des piquets
function seedBed(u, v, s, sprouts = 3) {
  let o = box(u - s, v - s * 0.7, u + s, v + s * 0.7, 0, 2, { top: '#946240', left: '#784C2E', right: '#5E3A22' });
  for (let r = 0; r < 3; r++) { const vv = v - s * 0.45 + r * s * 0.45; o += ln(P(u - s * 0.85, vv, 2), P(u + s * 0.85, vv, 2), 'rgba(50,30,15,.45)', 0.8);
    for (let k = 0; k < sprouts; k++) { const [x, y] = P(u - s * 0.6 + k * (s * 1.2) / Math.max(1, sprouts - 1), vv, 2); o += ln([x, y], [x, y - 3], '#5F8F3C', 0.8) + ell(x - 1.2, y - 3, 1.2, 0.7, '#7EC45B', ` stroke="${OUT}" stroke-width="0.35"`) + ell(x + 1.2, y - 3.4, 1.2, 0.7, '#7EC45B', ` stroke="${OUT}" stroke-width="0.35"`); } }
  return o;
}
// Boîte à graines en fer (Mélisse)
const seedTin = (u, v, z = 0) => box(u - 0.07, v - 0.05, u + 0.07, v + 0.05, z, z + 4, { top: '#9AA2AD', left: '#6E7480', right: '#545A65' }) + (() => { const [x, y] = P(u, v + 0.05, z + 2); return `<rect x="${f2(x - 0.8)}" y="${f2(y - 1)}" width="1.6" height="1.6" rx="0.3" fill="#F2C94C" stroke="${OUT}" stroke-width="0.4"/>`; })();
const seedsSpill = (u, v) => { const [x, y] = P(u, v, 0); return [[0, 0, '#C9A45A'], [3, 1, '#8A5A2E'], [-3, 1.4, '#E2C27A'], [1.4, 2.4, '#7FA65A'], [-1.6, -1, '#C9A45A'], [4.6, -0.6, '#8A5A2E']].map(([dx, dy, c]) => ell(x + dx, y + dy, 1.1, 0.8, c, ` stroke="${OUT}" stroke-width="0.35"`)).join(''); };

/* ---------- le coin d'Ondin (T5, La Source) : avant le Puits ---------- */
// 1. débris : la source entre les pierres, le gros rocher contre lequel il dormait, un lit de mousse, le bocal vide
function ondinDebris(n = 0) {
  let o = ground('terre');
  o += boulder(-0.44, -0.5, 0.42, 0.36, 22, STONE, 4, 0.18, 0.72) + (() => { const [x, y] = P(-0.4, -0.5, 21); return ell(x, y, 7, 2.6, '#8DAE6A') + ell(x + 3, y + 1, 3, 1.2, '#A9C27A'); })();
  o += leafPile(-0.18, -0.12, 0.3, ['#8DAE6A', '#7A9C58', '#A9C27A']);
  o += pool(0.36, 0.08, 0.26, n);
  o += jarAt(0.0, 0.36, 0, true) + stick(-0.06, -0.3, 0, -0.16, -0.38, 18, 1.4, '#A8743F') + stone(-0.6, 0.4, 3) + stone(0.7, 0.56, 2.4);
  return o;
}
// 2. abri : un toit de grandes feuilles sur deux fourches, au-dessus du lit de mousse ; une rigole de pierres part de la
// source ; les bocaux alignés sur une pierre plate
function ondinShelter(n = 0) {
  let o = ground('terre');
  o += boulder(-0.52, -0.58, 0.38, 0.32, 20, STONE, 4, 0.18, 0.72) + (() => { const [x, y] = P(-0.48, -0.58, 19); return ell(x, y, 6, 2.4, '#8DAE6A'); })();
  o += leafPile(-0.24, -0.22, 0.28, ['#8DAE6A', '#7A9C58', '#A9C27A']);
  // les fourches et la perche, le toit de feuilles
  o += stick(-0.56, -0.02, 0, -0.56, -0.02, 20, 1.8, '#8A6440') + stick(0.08, -0.12, 0, 0.08, -0.12, 20, 1.8, '#8A6440') + stick(-0.62, -0.02, 20, 0.14, -0.12, 20, 1.6, '#8A6440');
  { const a = P(-0.56, -0.02, 20), b = P(0.08, -0.12, 20); for (let i = 0; i < 6; i++) { const t = i / 5, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; o += bigLeaf(x - 4, y - 7, 15, -64 + i * 3, i % 2 ? '#6FAE4E' : '#7EBA58'); } }
  o += pool(0.4, 0.12, 0.24, n);
  // la rigole de pierres qui part de la source vers l'avant
  for (let i = 0; i < 4; i++) { const u = 0.38 - i * 0.12, v = 0.38 + i * 0.1; o += disc(u, v, 0, 0.06, WATER.mid) + stone(u - 0.06, v + 0.05, 1.8) + stone(u + 0.06, v - 0.05, 1.8); }
  o += box(0.56, -0.42, 0.78, -0.28, 0, 3, STONE) + jarAt(0.6, -0.36, 3) + jarAt(0.68, -0.33, 3) + jarAt(0.75, -0.3, 3);
  return o;
}
// 3. cabanon : une cabane ronde en pierres sèches au toit de mousse, près de la source ; un seau pend à une fourche
function ondinCabin(n = 0) {
  let o = ground('terre');
  const cu = -0.32, cv = -0.38;
  o += cylinder(cu, cv, 0, 18, 0.36, { top: '#BDB5A3', left: '#B4AC9A', right: '#8C8474' }, id('ond'));
  { const [x, y] = P(cu, cv, 0); for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 0.9 + 0.12 + (r % 2) * 0.25; const xx = x - Math.cos(a) * 16, yy = y - r * 4.4 - 2 + Math.sin(a) * 7.6; o += `<path d="M${f2(xx - 2.2)},${f2(yy)} q2.2,-1.6 4.4,0" fill="none" stroke="rgba(70,60,45,.45)" stroke-width="0.7"/>`; } }
  // la porte, le toit de mousse en cône aplati
  o += face([[cu - 0.08, cv + 0.36, 0], [cu + 0.1, cv + 0.34, 0], [cu + 0.1, cv + 0.34, 12], [cu - 0.08, cv + 0.36, 12]], '#2E2218', EDGE);
  { const [x, y] = P(cu, cv, 18); o += `<path d="M${f2(x - 19)},${f2(y + 1)} Q${f2(x - 10)},${f2(y - 12)} ${f2(x)},${f2(y - 15)} Q${f2(x + 10)},${f2(y - 12)} ${f2(x + 19)},${f2(y + 1)} Q${f2(x)},${f2(y + 9)} ${f2(x - 19)},${f2(y + 1)} Z" fill="#7EA548"${EDGE}/>`
    + ell(x - 5, y - 7, 6, 2.6, '#9DC066') + ell(x + 8, y - 2, 4, 1.8, '#6E9440') + [[-12, -1], [-4, 3], [6, 3.4], [13, 0]].map(([dx, dy]) => ell(x + dx, y + dy, 1.4, 0.9, '#5C8A45')).join(''); }
  o += pool(0.38, 0.14, 0.24, n);
  // la fourche et le seau de bois au bout d'une corde
  o += stick(0.66, -0.2, 0, 0.66, -0.2, 26, 1.8, '#8A6440') + stick(0.66, -0.2, 26, 0.6, -0.2, 31, 1.4, '#8A6440') + stick(0.66, -0.2, 26, 0.74, -0.2, 31, 1.4, '#8A6440');
  { const a = P(0.66, -0.2, 26), b = P(0.5, 0.0, 12); o += ln(a, b, ROPE, 0.8) + cylinder(0.5, 0.0, 6, 12, 0.06, { top: '#5E4630', left: '#A8743F', right: '#7E5530' }, id('ond')); }
  o += jarAt(0.1, 0.42) + jarAt(0.18, 0.46) + stone(-0.66, 0.36, 2.8);
  return o;
}

/* ---------- le coin de Sylve (acte I, La Lisière) : avant le Bosquet ---------- */
// Radeau de bois flotté : rondins liés de corde (un cassé), couché au sol
function raft(u, v, broken = true) {
  let o = shadow(u, v, 0.45, 0.16);
  for (let i = 0; i < 5; i++) { const vv = v - 0.2 + i * 0.1, du = broken && i === 3 ? 0.18 : 0; o += plank([u - 0.36, vv], [u + 0.36 - du, vv], 0.09, 3.2, DRIFT); }
  for (const uu of [u - 0.22, u + 0.18]) o += ln(P(uu, v - 0.24, 3.4), P(uu, v + 0.24, 3.4), ROPE, 1.2) + ln(P(uu, v - 0.24, 3.4), P(uu, v + 0.24, 3.4), OUT, 0.3);
  return o;
}
// 1. débris : le radeau brisé, la pagaie cassée, le nid de feuilles où elle dormait roulée en boule
function sylveDebris() {
  let o = ground('terre');
  o += raft(0.12, -0.3) + plank([0.5, 0.08], [0.72, 0.24], 0.08, 2.6, DRIFT);
  o += stick(-0.66, 0.14, 1, -0.26, 0.36, 1, 1.8, '#A8743F') + (() => { const [x, y] = P(-0.24, 0.37, 1); return `<path d="M${f2(x)},${f2(y)} Q${f2(x + 6)},${f2(y - 1)} ${f2(x + 8)},${f2(y + 2)} Q${f2(x + 5)},${f2(y + 4)} ${f2(x)},${f2(y + 2)} Z" fill="${WOOD.top}"${EDGE}/>`; })();
  o += leafPile(-0.42, -0.22, 0.34) + kelp(0.6, 0.6, -6) + stone(0.74, -0.3, 2.6);
  return o;
}
// 2. abri : les planches du radeau dressées en appentis contre une souche, couvertes de branchages ; dessous, la litière
function sylveShelter() {
  let o = ground('terre');
  o += cylinder(-0.5, -0.56, 0, 12, 0.16, { top: '#C9A274', left: '#8A6440', right: '#6A4A30' }, id('syl'));
  { const [x, y] = P(-0.5, -0.56, 12); o += ell(x, y, 6, 3, 'none', ` stroke="#8A6440" stroke-width="0.7"`) + ell(x, y, 3, 1.5, 'none', ` stroke="#8A6440" stroke-width="0.6"`); }
  o += leafPile(-0.18, -0.04, 0.3);
  // les planches posées en pente, de la souche jusqu'au sol devant à droite
  for (let i = 0; i < 4; i++) { const u = -0.38 + i * 0.18; o += face([[u, -0.5, 13], [u + 0.15, -0.5, 13], [u + 0.15 + 0.06, 0.06, 0], [u + 0.06, 0.06, 0]], i % 2 ? DRIFT.top : DRIFT.left, EDGE); }
  // branchages feuillus par-dessus
  { const a = P(-0.36, -0.5, 13), b = P(0.38, -0.46, 11); for (let i = 0; i < 7; i++) { const t = i / 6, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; o += bigLeaf(x, y + 2, 12, 70 + (i % 3) * 12, i % 2 ? '#6FAE4E' : '#86C06A'); } }
  o += raft(0.48, 0.36).replace(/plank/g, 'plank') + kelp(-0.66, 0.5, 8);
  return o;
}
// 3. cabanon : une hutte de branches tressées au toit de feuilles, au pied d'un jeune arbre ; un fagot de bois mort
function sylveCabin() {
  let o = ground('terre');
  // le jeune arbre derrière
  o += shadow(-0.68, 0.02, 0.3, 0.18) + box(-0.72, -0.02, -0.64, 0.06, 0, 22, WOOD_DARK);
  { const [x, y] = P(-0.68, 0.02, 0); o += [[-8, -30, 10], [7, -32, 10.5], [0, -42, 12]].map(([dx, dy, r]) => `<circle cx="${f2(x + dx + r * 0.08)}" cy="${f2(y + dy + r * 0.1)}" r="${f2(r + 0.7)}" fill="${OUT}"/>`).join('')
    + [[-8, -30, 10], [7, -32, 10.5], [0, -42, 12]].map(([dx, dy, r]) => `<circle cx="${f2(x + dx)}" cy="${f2(y + dy)}" r="${f2(r)}" fill="${LEAVES.mid}"/><circle cx="${f2(x + dx - r * 0.3)}" cy="${f2(y + dy - r * 0.32)}" r="${f2(r * 0.45)}" fill="${LEAVES.light}"/>`).join(''); }
  // la hutte : murs de baguettes tressées (piquets et lignes de tressage), porte, toit de feuilles
  const cu = -0.18, cv = -0.3;
  o += cylinder(cu, cv, 0, 16, 0.34, { top: '#B08A5A', left: '#B08A5A', right: '#86683E' }, id('syl'));
  { const [x, y] = P(cu, cv, 0); for (let k = 0; k < 9; k++) { const a = (k / 8) * Math.PI; const xx = x - Math.cos(a) * 15.4, yy = y + Math.sin(a) * 7.7; o += ln([xx, yy], [xx, yy - 16], '#6E5230', 1); }
    for (let r = 1; r < 4; r++) o += `<path d="M${f2(x - 15.4)},${f2(y - r * 4)} A15.4,7.7 0 0 0 ${f2(x + 15.4)},${f2(y - r * 4)}" fill="none" stroke="#C9A274" stroke-width="1.1"/>`; }
  o += face([[cu - 0.06, cv + 0.34, 0], [cu + 0.12, cv + 0.32, 0], [cu + 0.12, cv + 0.32, 11], [cu - 0.06, cv + 0.34, 11]], '#2E2218', EDGE);
  { const [x, y] = P(cu, cv, 16); o += `<path d="M${f2(x - 18)},${f2(y + 2)} Q${f2(x - 8)},${f2(y - 14)} ${f2(x)},${f2(y - 18)} Q${f2(x + 8)},${f2(y - 14)} ${f2(x + 18)},${f2(y + 2)} Q${f2(x)},${f2(y + 9)} ${f2(x - 18)},${f2(y + 2)} Z" fill="#5E9E4A"${EDGE}/>`;
    for (let i = 0; i < 8; i++) o += bigLeaf(x - 13 + i * 3.7, y - 2 - Math.sin((i / 7) * Math.PI) * 9, 9, 100 + i * 6, i % 2 ? '#6FAE4E' : '#86C06A'); }
  // le fagot de bois mort, la plume de geai plantée dans le toit
  o += [0, 1, 2].map(i => stick(0.4, 0.2 + i * 0.04, 2 + i, 0.72, 0.1 + i * 0.04, 2 + i, 1.6, '#8A6440')).join('') + ln(P(0.56, 0.12, 3), P(0.56, 0.24, 3), ROPE, 1);
  { const [x, y] = P(cu, cv, 32); o += `<path d="M${f2(x + 2)},${f2(y)} Q${f2(x + 4)},${f2(y - 6)} ${f2(x + 9)},${f2(y - 9)} Q${f2(x + 7)},${f2(y - 3)} ${f2(x + 3)},${f2(y + 1)} Z" fill="#3E7FC1" stroke="${OUT}" stroke-width="0.6"/>`; }
  return o;
}

/* ---------- le coin de Galet (acte II, la Fissure de La Colline) : avant la Carrière ---------- */
// Le rocher fendu (une lueur dans la fente), un muret de pierres sèches en demi-cercle devant, les blocs du caboteur,
// le maillet et le ciseau posés sur un bloc
function galetNook() {
  let o = ground('terre');
  // le rocher, large et bas, fendu de haut en bas (la lueur dans la fente)
  o += boulder(-0.3, -0.5, 0.64, 0.44, 24, STONE, 7, 0.16, 0.8);
  { const a = P(-0.14, -0.2, 22), m = P(-0.08, -0.14, 11), b = P(-0.1, -0.1, 1);
    const d = `M${f2(a[0])},${f2(a[1])} L${f2(m[0] - 2.4)},${f2(m[1])} L${f2(m[0] + 1)},${f2(m[1] + 5)} L${f2(b[0])},${f2(b[1])}`;
    o += `<path d="${d}" fill="none" stroke="#8FE3E8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.28"/>`
      + `<path d="${d}" fill="none" stroke="#3C3A36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="${d}" fill="none" stroke="#8FE3E8" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>`; }
  // le muret de pierres sèches en arc devant la fente : deux rangs de pierres rondes
  const arc = k => { const a = Math.PI * 0.14 + (k / 6) * Math.PI * 0.72; return [-0.12 + Math.cos(a) * 0.44, -0.2 + Math.sin(a) * 0.34]; };
  const row1 = Array.from({ length: 7 }, (_, k) => arc(k)).sort((p, q) => p[0] + p[1] - q[0] - q[1]);
  for (const [u, v] of row1) o += stone(u, v, 4.4, STONE);
  for (let k = 0; k < 6; k++) { const [u1, v1] = arc(k), [u2, v2] = arc(k + 1); const [x, y] = P((u1 + u2) / 2, (v1 + v2) / 2, 5); o += ell(x + 0.4, y + 0.6, 4.2, 2.8, OUT) + ell(x, y, 3.8, 2.5, k % 2 ? '#D9D3C4' : '#C3BBA9') + ell(x - 1.2, y - 0.8, 1.6, 0.9, '#E9E4D8'); }
  // les blocs du caboteur, le maillet et le ciseau posés sur le plus grand
  o += box(0.4, 0.2, 0.66, 0.4, 0, 10, { top: '#C9C4BA', left: '#A9A49A', right: '#86817A' }) + box(0.5, 0.5, 0.68, 0.64, 0, 7, STONE);
  { const a = P(0.44, 0.26, 10.6), b = P(0.62, 0.32, 10.6); o += tk(a, b, '#A8743F', 1.4) + `<rect x="${f2(b[0] - 0.4)}" y="${f2(b[1] - 3.4)}" width="4.6" height="4" rx="1" fill="#A8743F"${EDGE}/>`; }
  o += stick(0.44, 0.34, 10.6, 0.52, 0.38, 10.6, 1, '#B8C0C8') + stone(-0.66, 0.42, 3) + stone(0.76, -0.2, 2.6);
  return o;
}

/* ---------- le coin de Mélisse (acte III, Les Jardins) : avant le Potager ---------- */
// 1. débris : la barque de graines échouée, les graines répandues, la boîte en fer, la rame cassée
function melisseDebris() {
  let o = ground('terre');
  o += boatHull(0.0, -0.3, 0.9, 0.24, 9) + seedsSpill(-0.16, -0.3).replace(/<ellipse/g, '<ellipse') ;
  { const [x, y] = P(0.02, -0.3, 9); o += [[-6, 0, '#C9A45A'], [-2, 1, '#8A5A2E'], [3, -0.4, '#E2C27A'], [6, 1, '#7FA65A']].map(([dx, dy, c]) => ell(x + dx, y + dy, 1.6, 1.1, c, ` stroke="${OUT}" stroke-width="0.35"`)).join(''); }
  o += seedsSpill(0.2, 0.2) + seedsSpill(-0.3, 0.3) + seedTin(0.46, 0.06);
  o += plank([-0.64, 0.4], [-0.3, 0.6], 0.07, 2, WOOD) + stone(0.7, 0.5, 2.6);
  return o;
}
// 2. abri : la barque retournée, posée sur deux pierres, sert de toit ; dessous, un lit de mousse ; devant, le
// premier carré de semis et ses piquets
function melisseShelter() {
  let o = ground('terre');
  o += stone(-0.42, -0.42, 4) + stone(0.36, -0.46, 4);
  o += boatHull(0.0, -0.44, 0.96, 0.22, 12, true);
  { const [x, y] = P(-0.02, -0.24, 0); o += ell(x, y, 16, 4, '#2E2218', ' opacity=".55"') + ell(x - 2, y, 10, 2.6, '#8DAE6A'); }
  o += seedBed(0.1, 0.36, 0.26, 3) + stick(-0.2, 0.22, 0, -0.2, 0.22, 9, 1.2, '#8A6440') + stick(0.42, 0.18, 0, 0.42, 0.18, 9, 1.2, '#8A6440');
  o += seedTin(-0.56, 0.24);
  return o;
}
// 3. cabanon : une remise faite des planches de la barque, toit de chaume ; des bocaux de graines sur une étagère, deux
// carrés de semis, un tournesol qui pousse déjà
function melisseCabin() {
  let o = ground('terre');
  const u0 = -0.62, u1 = 0.1, v0 = -0.7, v1 = -0.18, h = 18;
  o += box(u0, v0, u1, v1, 0, h, { top: '#C99A62', left: '#B07A45', right: '#8A5A32' }) + planksLeft(u0, u1, v1, 0, h, 3.6) + planksRight(u1, v0, v1, 0, h, 3.6);
  o += face([[-0.18, v1, 0], [0.0, v1, 0], [0.0, v1, 13], [-0.18, v1, 13]], '#2E2218', EDGE);
  o += gable(u0, v0, u1, v1, h, 13, { front: THATCH.front, back: THATCH.back, gable: '#B07A45' }, 0.1);
  // l'étagère et ses bocaux de graines sur le mur de droite
  o += face([[u1, -0.62, 9], [u1, -0.3, 9], [u1 + 0.06, -0.3, 9], [u1 + 0.06, -0.62, 9]], WOOD.top, EDGE);
  for (const [v, c] of [[-0.56, '#E2C27A'], [-0.46, '#7FA65A'], [-0.36, '#C9A45A']]) { const [x, y] = P(u1 + 0.04, v, 9); o += `<rect x="${f2(x - 1.8)}" y="${f2(y - 5)}" width="3.6" height="5" rx="1" fill="${c}" stroke="${OUT}" stroke-width="0.6"/><rect x="${f2(x - 1.3)}" y="${f2(y - 6.2)}" width="2.6" height="1.4" rx="0.4" fill="#B07E4C" stroke="${OUT}" stroke-width="0.5"/>`; }
  o += seedBed(-0.3, 0.3, 0.24, 3) + seedBed(0.4, 0.06, 0.2, 2);
  // le tournesol
  { const [x, y] = P(0.74, -0.16, 0); o += ln([x, y], [x, y - 24], '#5F8F3C', 1.6) + ell(x - 3, y - 10, 3, 1.4, '#7EC45B', ` stroke="${OUT}" stroke-width="0.4"`)
    + Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * Math.PI * 2; return ell(x + Math.cos(a) * 4, y - 26 + Math.sin(a) * 4, 2.2, 1.2, '#F2C94C', ` stroke="${OUT}" stroke-width="0.4" transform="rotate(${f2((a * 180) / Math.PI)} ${f2(x + Math.cos(a) * 4)} ${f2(y - 26 + Math.sin(a) * 4)})"`); }).join('') + ell(x, y - 26, 2.8, 2.8, '#8A5A2E', EDGE); }
  o += seedTin(-0.66, 0.0);
  return o;
}

/* ---------- les voyageurs (actes IV-V) : ceux qui veulent rester ---------- */
// Tente de toile sur deux perches et une faîtière, pignon ouvert (l'intérieur sombre, un sac de voyage)
function tent() {
  const u0 = -0.5, u1 = 0.36, v0 = -0.4, v1 = 0.3, vm = (v0 + v1) / 2;
  let o = ground('terre');
  // le piquet, la corde et la perche du fond passent derrière la toile
  o += stick(-0.84, -0.05, 0, -0.82, -0.05, 4, 1.4, WOOD_DARK.left) + rope(P(u0 - 0.06, vm, 30), P(-0.84, -0.05, 1), 2, 0.6);
  o += stick(u0 - 0.06, vm, 0, u0 - 0.06, vm, 30, 1.6, WOOD_DARK.left);
  o += gable(u0, v0, u1, v1, 0, 26, { front: '#E6D3A8', back: '#CDB68A', gable: '#2E2218' }, 0.05);
  for (const k of [0.33, 0.66]) { const u = u0 + (u1 - u0) * k; o += ln(P(u, vm, 26), P(u, v1 + 0.05, 0), '#B39A6C', 0.7); }
  { const [x, y] = P(u1 - 0.04, -0.02, 0); o += `<rect x="${f2(x - 3.6)}" y="${f2(y - 6)}" width="7.2" height="6" rx="1.6" fill="#8C6A46"${EDGE}/>` + ln([x - 2, y - 6], [x - 1, y - 8.6], OUT, 0.6) + ln([x + 2, y - 6], [x + 1, y - 8.6], OUT, 0.6); }
  // les pans relevés du pignon, la perche, la corde et le piquet de devant
  o += face([[u1 + 0.05, v0 + 0.02, 0], [u1 + 0.05, vm, 26], [u1 + 0.2, v0 - 0.02, 2]], '#D9C496', EDGE) + face([[u1 + 0.05, v1 - 0.02, 0], [u1 + 0.05, vm, 26], [u1 + 0.22, v1 + 0.04, 2]], '#E6D3A8', EDGE);
  o += stick(u1 + 0.06, vm, 0, u1 + 0.06, vm, 30, 1.6, WOOD_DARK.left);
  o += rope(P(u1 + 0.06, vm, 30), P(0.8, -0.05, 1), 2, 0.6) + stick(0.8, -0.05, 0, 0.82, -0.05, 4, 1.4, WOOD_DARK.left);
  // un fanion de voyageur au sommet
  { const t = P(u1 + 0.06, vm, 30); o += `<path d="M${f2(t[0])},${f2(t[1])} L${f2(t[0] + 8)},${f2(t[1] + 2)} L${f2(t[0])},${f2(t[1] + 4.4)} Z" fill="#6FA3D9"${EDGE}/>`; }
  return o;
}
// Hamac de toile tendu entre deux poteaux : deux lisières qui s'écartent au milieu (on voit l'intérieur), le ventre de
// la toile dépasse sous la lisière de devant, une bande rouge ; les bouts sont froncés et pendus par une corde
// (n : il se balance de côté)
function hammock(n = 0) {
  let o = ground('terre');
  const a = [-0.52, -0.22], b = [0.5, 0.02], zTop = 24, zEnd = 18, sag = 9, w0 = 0.15, sway = n ? 0.05 : 0;
  const N = 14;
  const at = (t, dv, dz = 0) => {
    const s = Math.sin(Math.PI * t);
    return P(a[0] + (b[0] - a[0]) * (0.16 + 0.68 * t), a[1] + (b[1] - a[1]) * (0.16 + 0.68 * t) + dv + sway * s, zEnd - sag * s + dz);
  };
  const wid = t => w0 * Math.pow(Math.sin(Math.PI * t), 0.55);
  const curve = (dvf, dzf = () => 0) => Array.from({ length: N + 1 }, (_, i) => { const t = i / N; return at(t, dvf(t), dzf(t)); });
  const far = curve(t => -wid(t)), near = curve(t => wid(t)), belly = curve(t => 0, t => -4.2 * Math.sin(Math.PI * t));
  const d = q => q.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)},${f2(y)}`).join(' ');
  // poteau du fond et sa corde
  o += stick(a[0], a[1], 0, a[0], a[1], zTop + 2, 2.4, WOOD.left);
  o += rope(P(a[0], a[1], zTop), at(0, 0), 0.6, 0.7);
  o += shadow((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.12, 0.34, 0.14);
  // le ventre de la toile, puis l'intérieur (entre les deux lisières), la bande rouge sur la lisière de devant
  o += `<path d="${d(near)} ${d([...belly].reverse()).replace('M', 'L')} Z" fill="${CANVAS.dark}"${EDGE}/>`;
  o += `<path d="${d(far)} ${d([...near].reverse()).replace('M', 'L')} Z" fill="${CANVAS.light}"${EDGE}/>`;
  o += `<path d="${d(curve(t => -wid(t) * 0.4, () => -2.4))}" fill="none" stroke="${CANVAS.mid}" stroke-width="1.6" stroke-linecap="round"/>`;
  o += `<path d="${d(curve(t => wid(t) * 0.82))}" fill="none" stroke="#C8463A" stroke-width="1.3" stroke-linecap="round"/>`;
  // les fronces aux deux bouts
  for (const t of [0, 1]) { const [x, y] = at(t, 0); o += ell(x, y, 1.6, 1.2, CANVAS.mid, EDGE); }
  // poteau de devant et sa corde
  o += rope(at(1, 0), P(b[0], b[1], zTop), 0.6, 0.7);
  o += stick(b[0], b[1], 0, b[0], b[1], zTop + 2, 2.4, WOOD.left);
  return o;
}

/* ---------- objets du camp ---------- */
// Étendoir : deux bâtons, une corde tendue de face, des habits qui sèchent (n : le vent les pousse de côté)
function clothesline(n = 0) {
  const a = [-0.3, 0.3], b = [0.3, -0.3], w = n ? 1.6 : 0;
  let o = shadow(0, 0, 0.42, 0.12);
  o += stick(a[0], a[1], 0, a[0], a[1], 26, 1.8, DRIFT.left) + stick(b[0], b[1], 0, b[0], b[1], 26, 1.8, DRIFT.left);
  const A = P(a[0], a[1], 23), B = P(b[0], b[1], 23), sag = 4;
  o += rope(A, B, sag * 2, 0.6);
  const at = t => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + sag * 4 * t * (1 - t)];
  // chemise jaune (celle d'Aster ?), pantalon bleu, chiffon blanc
  { const [x, y] = at(0.24); o += `<path d="M${f2(x - 5)},${f2(y)} L${f2(x + 5)},${f2(y)} L${f2(x + 7 + w)},${f2(y + 3.4)} L${f2(x + 4.4 + w * 0.6)},${f2(y + 4.4)} L${f2(x + 4.2 + w)},${f2(y + 12)} L${f2(x - 4.2 + w)},${f2(y + 12)} L${f2(x - 4.4 + w * 0.6)},${f2(y + 4.4)} L${f2(x - 7 + w)},${f2(y + 3.4)} Z" fill="#F2C04B"${EDGE}/>` + ln([x, y + 1], [x + w * 0.8, y + 11.4], '#CC9A2F', 0.6) + `<path d="M${f2(x - 1.8)},${f2(y)} L${f2(x)},${f2(y + 2.2)} L${f2(x + 1.8)},${f2(y)}" fill="none" stroke="${OUT}" stroke-width="0.5"/>`; }
  { const [x, y] = at(0.55); o += `<path d="M${f2(x - 4)},${f2(y)} L${f2(x + 4)},${f2(y)} L${f2(x + 4.4 + w)},${f2(y + 12)} L${f2(x + 1 + w)},${f2(y + 12)} L${f2(x + w * 0.5)},${f2(y + 4)} L${f2(x - 1 + w)},${f2(y + 12)} L${f2(x - 4.4 + w)},${f2(y + 12)} Z" fill="#6FA3D9"${EDGE}/>` + ln([x - 3.4 + w, y + 10.6], [x - 1.6 + w, y + 10.6], '#4F82B8', 0.6); }
  { const [x, y] = at(0.8); o += `<path d="M${f2(x - 3.2)},${f2(y)} L${f2(x + 3.2)},${f2(y)} L${f2(x + 3.4 + w)},${f2(y + 6.4)} L${f2(x + 1 + w)},${f2(y + 5.6)} L${f2(x - 1 + w)},${f2(y + 6.8)} L${f2(x - 3.4 + w)},${f2(y + 6.2)} Z" fill="#F4EEDF"${EDGE}/>`; }
  for (const t of [0.24, 0.55, 0.8]) for (const dx of [-2.6, 2.6]) { const [x, y] = at(t); o += `<rect x="${f2(x + dx - 0.7)}" y="${f2(y - 1.6)}" width="1.4" height="2.8" rx="0.4" fill="#A8743F" stroke="${OUT}" stroke-width="0.4"/>`; }
  return o;
}
// Tonneau qui recueille l'eau de pluie : deux perches derrière lui tiennent une toile en entonnoir qui goutte dedans
function rainBarrel() {
  let o = shadow(0, 0.02, 0.22, 0.18);
  o += stick(-0.2, -0.16, 0, -0.2, -0.16, 30, 1.5, DRIFT.left) + stick(0.16, -0.22, 0, 0.16, -0.22, 28, 1.5, DRIFT.left);
  o += cylinder(0, 0, 0, 16, 0.15, { top: '#4E7E9C', left: '#A8825A', right: '#7A5A3E' }, id('ton'));
  for (const z of [4, 12]) { const [x, y] = P(0, 0, z); o += `<path d="M${f2(x - 6.8)},${f2(y)} A6.8,3.4 0 0 0 ${f2(x + 6.8)},${f2(y)}" fill="none" stroke="#5E4630" stroke-width="1.1"/>`; }
  { const [x, y] = P(0, 0, 16); o += ell(x - 1.6, y - 0.2, 2.6, 0.9, '#8FCDE0') + ell(x + 0.6, y + 0.4, 1.4, 0.5, 'none', ' stroke="#BFE6F0" stroke-width="0.5"'); }
  // la toile : deux coins aux perches, deux coins noués plus bas, le milieu creusé jusqu'au bec
  const t1 = P(-0.2, -0.16, 28), t2 = P(0.16, -0.22, 26), l1 = P(-0.17, 0.1, 22), l2 = P(0.15, 0.04, 21.4), bec = P(0.0, -0.01, 19);
  o += `<path d="M${f2(t1[0])},${f2(t1[1])} Q${f2((t1[0] + t2[0]) / 2)},${f2((t1[1] + t2[1]) / 2 + 2.4)} ${f2(t2[0])},${f2(t2[1])} L${f2(l2[0])},${f2(l2[1])} Q${f2(bec[0] + 2)},${f2(bec[1] + 1.4)} ${f2(bec[0])},${f2(bec[1] + 1.6)} Q${f2(bec[0] - 2)},${f2(bec[1] + 1.4)} ${f2(l1[0])},${f2(l1[1])} Z" fill="${CANVAS.light}"${EDGE}/>`;
  o += `<path d="M${f2(t1[0] + 1)},${f2(t1[1] + 1.2)} Q${f2(bec[0] - 1.6)},${f2(bec[1] - 2.4)} ${f2(bec[0])},${f2(bec[1] + 1)} Q${f2(bec[0] + 1.6)},${f2(bec[1] - 2.4)} ${f2(t2[0] - 1)},${f2(t2[1] + 1.2)}" fill="none" stroke="${CANVAS.dark}" stroke-width="0.7"/>`;
  // les coins du bas noués au cerclage du tonneau par une ficelle
  for (const [l, r] of [[l1, P(-0.11, 0.1, 13)], [l2, P(0.12, 0.08, 13)]]) o += ln(l, r, ROPE, 0.5) + ell(l[0], l[1], 0.9, 0.7, ROPE, ` stroke="${OUT}" stroke-width="0.35"`);
  o += `<path d="M${f2(bec[0])},${f2(bec[1] + 2.6)} q-1.1,1.6 0,2.4 q1.1,-0.8 0,-2.4 Z" fill="#8FCDE0" stroke="${OUT}" stroke-width="0.4"/>`;
  return o;
}
// Rondin couché d'un bout (u0, v0) à l'autre (u1, v1), rayon r : enveloppe des deux sections, le bout de devant montre
// ses cernes
function logLying(u0, v0, u1, v1, r, c = { bark: WOOD.left, dark: WOOD.right, end: '#E7C08A', ring: '#C99A62' }) {
  const L = Math.hypot(u1 - u0, v1 - v0), nu = -(v1 - v0) / L, nv = (u1 - u0) / L, k = r / 32;
  const ring = (u, v, rr = 1) => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return P(u + nu * Math.cos(a) * k * rr, v + nv * Math.cos(a) * k * rr, r + Math.sin(a) * r * rr); });
  const all = [...ring(u0, v0), ...ring(u1, v1)].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const p of all) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of [...all].reverse()) { while (hi.length > 1 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  const hull = [...lo.slice(0, -1), ...hi.slice(0, -1)];
  // le bout tourné vers nous (le plus grand u + v)
  const [fu, fv] = u1 + v1 >= u0 + v0 ? [u1, v1] : [u0, v0], [bu, bv] = fu === u1 ? [u0, v0] : [u1, v1];
  let o = `<polygon points="${pts(hull)}" fill="${c.bark}"${EDGE}/>`;
  for (const t of [0.3, 0.62]) { const a = P(bu + (fu - bu) * t, bv + (fv - bv) * t, r * 1.7), b = P(bu + (fu - bu) * (t + 0.2), bv + (fv - bv) * (t + 0.2), r * 1.62); o += ln(a, b, c.dark, 0.7); }
  { const a = P(bu + (fu - bu) * 0.1, bv + (fv - bv) * 0.1, r * 0.5), b = P(bu + (fu - bu) * 0.85, bv + (fv - bv) * 0.85, r * 0.45); o += ln(a, b, c.dark, 0.9); }
  o += `<polygon points="${pts(ring(fu, fv))}" fill="${c.end}"${EDGE}/>` + `<polygon points="${pts(ring(fu, fv, 0.55))}" fill="none" stroke="${c.ring}" stroke-width="0.6"/>` + `<polygon points="${pts(ring(fu, fv, 0.2))}" fill="${c.ring}"/>`;
  return o;
}
// Deux rondins pour s'asseoir autour du feu : une souche debout, un tronc couché
const logSeats = () => shadow(0, 0.02, 0.4, 0.18)
  + cylinder(-0.2, -0.08, 0, 9, 0.12, { top: '#E7C08A', left: WOOD.left, right: WOOD.right }, id('ron'))
  + (() => { const [x, y] = P(-0.2, -0.08, 9); return ell(x, y, 3, 1.5, 'none', ` stroke="#C99A62" stroke-width="0.6"`) + ell(x, y, 0.9, 0.45, '#C99A62') + ln([x + 1.4, y + 0.5], [x + 3.6, y + 1.4], '#B07A45', 0.5); })()
  + logLying(0.0, 0.12, 0.34, 0.22, 4.2);
// Filet de pêche qui sèche entre deux perches, presque de face : mailles en losange, flotteurs de liège sur la ralingue
// du haut, le bas qui traîne en tas sur le sable
function net() {
  const a = [-0.34, 0.22], b = [0.3, -0.24];
  let o = shadow(0, 0.02, 0.42, 0.14);
  o += stick(a[0], a[1], 0, a[0], a[1], 25, 1.8, DRIFT.left) + stick(b[0], b[1], 0, b[0], b[1], 25, 1.8, DRIFT.left);
  const A = P(a[0], a[1], 22), B = P(b[0], b[1], 22), A0 = P(a[0], a[1], 4), B0 = P(b[0], b[1], 4);
  const top = t => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + 12 * t * (1 - t)];
  const bot = t => [A0[0] + (B0[0] - A0[0]) * t, A0[1] + (B0[1] - A0[1]) * t + 1.6 * Math.sin(t * 9)];
  const N = 12, T = Array.from({ length: N + 1 }, (_, i) => i / N);
  const outline = [...T.map(top), ...[...T].reverse().map(bot)];
  o += `<polygon points="${pts(outline)}" fill="rgba(176,136,80,.16)"/>`;
  // les mailles : deux familles de diagonales entre la ralingue du haut et le bas
  const lerp = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
  for (let i = -3; i <= 9; i++) for (const dir of [1, -1]) {
    const t0 = i / 6, t1 = t0 + dir * 0.34;
    const seg = [];
    for (let k = 0; k <= 10; k++) { const kk = k / 10, t = t0 + (t1 - t0) * kk; if (t < 0 || t > 1) continue; seg.push(lerp(top(t), bot(t), kk)); }
    if (seg.length > 1) o += `<polyline points="${pts(seg)}" fill="none" stroke="#9E7A46" stroke-width="0.55"/>`;
  }
  o += `<polyline points="${pts(T.map(top))}" fill="none" stroke="${OUT}" stroke-width="1.6"/><polyline points="${pts(T.map(top))}" fill="none" stroke="${ROPE}" stroke-width="0.7"/>`;
  // le tas de filet au pied, et les flotteurs
  { const [x, y] = P(-0.02, 0.06, 0); o += `<path d="M${f2(x - 12)},${f2(y + 1)} Q${f2(x - 8)},${f2(y - 4)} ${f2(x - 2)},${f2(y - 2.6)} Q${f2(x + 4)},${f2(y - 5)} ${f2(x + 10)},${f2(y - 1)} Q${f2(x + 6)},${f2(y + 3.4)} ${f2(x - 2)},${f2(y + 3)} Q${f2(x - 8)},${f2(y + 3.6)} ${f2(x - 12)},${f2(y + 1)} Z" fill="#B8955E"${EDGE}/>`
    + [[-8, 0.4, 4], [-3, -0.6, 5], [3, -1, 4], [7, 0.4, 3]].map(([dx, dy, l]) => `<path d="M${f2(x + dx - l / 2)},${f2(y + dy)} q${f2(l / 2)},-1.4 ${f2(l)},0" fill="none" stroke="#8C6A3E" stroke-width="0.5"/>`).join('') + ell(x + 6, y + 0.6, 1.6, 1.1, '#E2A85A', EDGE); }
  for (const t of [0.16, 0.38, 0.62, 0.84]) { const [x, y] = top(t); o += ell(x, y + 0.4, 2, 1.4, '#E2A85A', EDGE); }
  return o;
}
// Paillasse : un matelas de toile bourré de paille (bords bombés, brins qui dépassent), une couverture jetée dessus
// dont l'ourlet retombe sur le côté, un baluchon roulé en guise d'oreiller
function strawBed() {
  const u0 = -0.32, u1 = 0.3, v0 = -0.15, v1 = 0.15, h = 4.4;
  const q = (pA, pB, bul) => { const m = [(pA[0] + pB[0]) / 2, (pA[1] + pB[1]) / 2 + bul]; return `Q${f2(m[0])},${f2(m[1])} ${f2(pB[0])},${f2(pB[1])}`; };
  const T = [P(u0, v0, h), P(u1, v0, h), P(u1, v1, h), P(u0, v1, h)], B = [P(u1, v0, 0), P(u1, v1, 0), P(u0, v1, 0)];
  let o = shadow(0, 0.02, 0.4, 0.16);
  // flancs bombés (gauche, éclairé ; droite, à l'ombre), puis le dessus
  o += `<path d="M${f2(T[3][0])},${f2(T[3][1])} ${q(T[3], T[2], 1.2)} L${f2(B[1][0])},${f2(B[1][1])} ${q(B[1], B[2], 1.6)} Z" fill="#D8BE78"${EDGE}/>`;
  o += `<path d="M${f2(T[2][0])},${f2(T[2][1])} ${q(T[2], T[1], 1)} L${f2(B[0][0])},${f2(B[0][1])} ${q(B[0], B[1], 1.4)} Z" fill="#B99A55"${EDGE}/>`;
  o += `<path d="M${f2(T[0][0])},${f2(T[0][1])} ${q(T[0], T[1], -1)} ${q(T[1], T[2], 0.6)} ${q(T[2], T[3], 1.2)} ${q(T[3], T[0], -0.6)} Z" fill="#E8CF8A"${EDGE}/>`;
  // les piqûres du matelas et les brins de paille qui dépassent des coutures
  for (const k of [0.3, 0.6]) { const [x, y] = P(u0 + (u1 - u0) * k, 0, h + 0.4); o += ell(x, y, 0.7, 0.4, '#B99A55'); }
  for (const [u, v, z, dx, dy] of [[-0.3, 0.15, 3, -2.6, 1.4], [-0.08, 0.16, 1.6, -1, 2.4], [0.16, 0.16, 2.2, 1.6, 2], [0.3, 0.02, 3, 2.6, 0.4], [0.3, -0.1, 1.4, 2.2, -0.8], [-0.33, -0.06, 4.2, -2.4, -1]]) {
    const [x, y] = P(u, v, z); o += ln([x, y], [x + dx, y + dy], '#C9A85C', 0.6) + ln([x + 0.6, y], [x + dx * 0.7 + 0.8, y + dy * 0.8 - 0.4], '#E8CF8A', 0.5);
  }
  // la couverture (bleu délavé du Foyer) jetée en travers : elle retombe en festons sur les deux flancs, son bord de
  // tête est retourné (on voit l'envers, plus clair), quelques plis
  const c0 = -0.06, c1 = 0.31, hc = h + 0.7, va = v0 - 0.015, vb = v1 + 0.015;
  const scallop = (pA, pB, n, dip) => { let d = ''; for (let i = 1; i <= n; i++) { const t0 = (i - 1) / n, t1 = i / n, m = [pA[0] + (pB[0] - pA[0]) * (t0 + t1) / 2, pA[1] + (pB[1] - pA[1]) * (t0 + t1) / 2 + dip]; const e = [pA[0] + (pB[0] - pA[0]) * t1, pA[1] + (pB[1] - pA[1]) * t1]; d += ` Q${f2(m[0])},${f2(m[1])} ${f2(e[0])},${f2(e[1])}`; } return d; };
  const TL = P(c0, va, hc), TR = P(c1, va, hc), BR = P(c1, vb, hc), BL = P(c0, vb, hc);
  const hBR = P(c1 + 0.012, vb + 0.012, 1.4), hBL = P(c0, vb + 0.012, 1.8), hTR = P(c1 + 0.012, va, 2.2);
  o += `<path d="M${f2(BR[0])},${f2(BR[1])} L${f2(TR[0])},${f2(TR[1])} L${f2(hTR[0])},${f2(hTR[1])}${scallop(hTR, hBR, 2, 1.4)} Z" fill="#62789A"${EDGE}/>`;
  o += `<path d="M${f2(BL[0])},${f2(BL[1])} L${f2(BR[0])},${f2(BR[1])} L${f2(hBR[0])},${f2(hBR[1])}${scallop(hBR, hBL, 3, 1.6)} Z" fill="#7F96B2"${EDGE}/>`;
  for (const k of [0.33, 0.66]) { const p1 = P(c1 - (c1 - c0) * k, vb, hc - 0.4), p2 = P(c1 - (c1 - c0) * k + 0.01, vb + 0.012, 2.4); o += ln(p1, p2, '#6A82A2', 0.6); }
  o += `<path d="M${f2(TL[0])},${f2(TL[1])} Q${f2((TL[0] + TR[0]) / 2)},${f2((TL[1] + TR[1]) / 2 - 1)} ${f2(TR[0])},${f2(TR[1])} L${f2(BR[0])},${f2(BR[1])} L${f2(BL[0])},${f2(BL[1])} Q${f2((BL[0] + TL[0]) / 2 - 0.6)},${f2((BL[1] + TL[1]) / 2)} ${f2(TL[0])},${f2(TL[1])} Z" fill="#93A9C2"${EDGE}/>`;
  for (const [ka, kb, bow] of [[0.32, 0.5, 1.2], [0.62, 0.78, -1]]) { const p1 = P(c0 + (c1 - c0) * ka, va + 0.04, hc), p2 = P(c0 + (c1 - c0) * kb, vb - 0.04, hc); o += `<path d="M${f2(p1[0])},${f2(p1[1])} Q${f2((p1[0] + p2[0]) / 2 + bow)},${f2((p1[1] + p2[1]) / 2)} ${f2(p2[0])},${f2(p2[1])}" fill="none" stroke="#7F96B2" stroke-width="0.7" stroke-linecap="round"/>`; }
  { const f0 = P(c0, va, hc + 0.5), f1 = P(c0 + 0.08, va, hc + 0.5), f2_ = P(c0 + 0.08, vb, hc + 0.5), f3 = P(c0, vb, hc + 0.5);
    o += `<path d="M${f2(f0[0])},${f2(f0[1])} L${f2(f1[0])},${f2(f1[1])} Q${f2((f1[0] + f2_[0]) / 2 + 0.6)},${f2((f1[1] + f2_[1]) / 2)} ${f2(f2_[0])},${f2(f2_[1])} L${f2(f3[0])},${f2(f3[1])} Z" fill="#B7C6D8"${EDGE}/>`
      + `<path d="M${f2(f0[0] + 1.2)},${f2(f0[1] + 0.9)} L${f2(f3[0] + 1.2)},${f2(f3[1] - 0.2)}" fill="none" stroke="#C8463A" stroke-width="0.7" stroke-dasharray="1.4 1"/>`; }
  // le baluchon-oreiller à la tête
  { const [x, y] = P(u0 + 0.1, 0, h + 2.6); o += ell(x, y, 6.4, 3.4, '#E6DCC3', EDGE) + `<path d="M${f2(x - 4)},${f2(y - 1.6)} Q${f2(x - 1)},${f2(y + 0.4)} ${f2(x + 3)},${f2(y - 2)}" fill="none" stroke="#C2B494" stroke-width="0.6"/>` + ell(x + 5.4, y - 1.4, 1.4, 1, '#C2B494', EDGE); }
  return o;
}
// Torche de bois flotté plantée : tête d'étoupe goudronnée liée de corde, la flamme du jeu posée dessus (3 images)
function torch(n = 0) {
  let o = shadow(0, 0, 0.14, 0.16) + stick(0, 0, 0, 0, 0, 21, 2.2, DRIFT.left);
  const [x, y] = P(0, 0, 22);
  o += ell(x, y - 6, 7, 6, 'rgba(255,214,120,.22)');
  o += `<path d="M${f2(x - 2.4)},${f2(y + 2.2)} L${f2(x - 3.2)},${f2(y - 2.4)} Q${f2(x)},${f2(y - 3.6)} ${f2(x + 3.2)},${f2(y - 2.4)} L${f2(x + 2.4)},${f2(y + 2.2)} Q${f2(x)},${f2(y + 3)} ${f2(x - 2.4)},${f2(y + 2.2)} Z" fill="#5E4630"${EDGE}/>`
    + ln([x - 2.8, y - 0.4], [x + 2.8, y - 0.4], ROPE, 0.8) + ln([x - 2.5, y + 1.2], [x + 2.5, y + 1.2], ROPE, 0.6);
  // la base de la flamme (y = -4 dans flameFrames) posée sur le haut de la tête
  const flame = flameFrames(0, 0, 0.6)[n % 3].svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return o + `<g transform="translate(0 ${f2(y - 2.6 + 4)})">${flame}</g>`;
}
// « SOS » écrit en galets sur le sable, lisible depuis la caméra : lettres alignées sur l'écran, écrasées comme posées
// au sol (hauteur à moitié), un galet tous les ~2,6 px le long du tracé
function sos() {
  const toUV = (sx, sy) => [(sx / 32 + sy / 16) / 2, (sy / 16 - sx / 32) / 2];
  const W = 10, H = 7.6, gap = 4.4;
  const S = [[1, 0.12], [0.55, 0], [0.05, 0.16], [0.08, 0.42], [0.5, 0.52], [0.94, 0.62], [0.96, 0.88], [0.48, 1], [0, 0.88]];
  const O = Array.from({ length: 17 }, (_, k) => { const a = (k / 16) * Math.PI * 2 - Math.PI / 2; return [0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5]; });
  const sample = (poly, x0) => {
    const q = poly.map(([a, b]) => [x0 + a * W, b * H]);
    const out = [q[0]]; let carry = 0;
    for (let i = 1; i < q.length; i++) {
      const [ax, ay] = q[i - 1], [bx, by] = q[i], L = Math.hypot(bx - ax, by - ay);
      let d = 2.6 - carry;
      while (d <= L) { out.push([ax + (bx - ax) * d / L, ay + (by - ay) * d / L]); d += 2.6; }
      carry = L - (d - 2.6);
    }
    return out;
  };
  const x0 = -(3 * W + 2 * gap) / 2, y0 = -H / 2;
  const dots = [...sample(S, x0), ...sample(O, x0 + W + gap).slice(0, -1), ...sample(S, x0 + 2 * (W + gap))].map(([x, y]) => [x, y + y0]);
  let o = disc(0, 0, 0, 0.62, 'rgba(232,212,160,.55)');
  dots.sort((a, b) => a[1] - b[1]).forEach(([x, y], i) => { const [u, v] = toUV(x, y); o += stone(u, v, 1.15 + (i % 3) * 0.12); });
  return o;
}
// Pile de caisses repêchées ; sur celle de devant, l'hirondelle peinte au pochoir (la marque du navire)
const crateStack = () => shadow(0, 0, 0.3, 0.16) + crate(-0.06, -0.06, 0.15, 12) + crate(0.2, 0.14, 0.12, 9) + crate(-0.04, -0.08, 0.11, 8, 12)
  + (() => { const [x, y] = P(0.2, 0.26, 4.6); return `<g transform="translate(${f2(x)} ${f2(y)}) matrix(1 0.5 0 1 0 0)"><path d="M-3.2,-0.6 Q-1.6,-1.8 0,-0.2 Q1.6,-1.8 3.2,-0.6 Q1.4,-0.4 0.6,0.6 L1.4,2.4 L0,1.4 L-1.4,2.4 L-0.6,0.6 Q-1.4,-0.4 -3.2,-0.6 Z" fill="#F4EEDF" opacity=".85"/></g>`; })();

export const CAMP = {
  feu_debris: { frame: PROP_BOX, n: 3, label: 'Feu de débris', step: 'T1', draw: n => driftFire(0, 0, 1, n) },
  hirondelle: { frame: { x: -88, y: -100, w: 176, h: 150 }, n: 1, label: 'Épave de l\'Hirondelle', step: 'T1', draw: () => hirondelle() },
  aster_debris: { frame: BUILDING_BOX, n: 1, label: 'Aster · débris', step: 'T2', draw: () => asterDebris() },
  aster_abri: { frame: BUILDING_BOX, n: 1, label: 'Aster · abri', step: 'I', draw: () => asterShelter() },
  aster_cabanon: { frame: BUILDING_BOX, n: 2, label: 'Aster · cabanon', step: 'II', draw: n => asterCabin(n) },
  cannelle_debris: { frame: BUILDING_BOX, n: 3, label: 'Cannelle · cuisine de l\'épave', step: 'T3', draw: n => cannelleKitchen(n) },
  rivet_debris: { frame: BUILDING_BOX, n: 1, label: 'Rivet · débris', step: 'T4', draw: () => rivetDebris() },
  rivet_abri: { frame: BUILDING_BOX, n: 1, label: 'Rivet · abri', step: 'I', draw: () => rivetShelter() },
  rivet_cabanon: { frame: BUILDING_BOX, n: 1, label: 'Rivet · cabanon', step: 'II', draw: () => rivetCabin() },
  ondin_debris: { frame: BUILDING_BOX, n: 2, label: 'Ondin · débris', step: 'T5', draw: n => ondinDebris(n) },
  ondin_abri: { frame: BUILDING_BOX, n: 2, label: 'Ondin · abri', step: 'I', draw: n => ondinShelter(n) },
  ondin_cabanon: { frame: BUILDING_BOX, n: 2, label: 'Ondin · cabanon', step: 'II', draw: n => ondinCabin(n) },
  sylve_debris: { frame: BUILDING_BOX, n: 1, label: 'Sylve · débris', step: 'I', draw: () => sylveDebris() },
  sylve_abri: { frame: BUILDING_BOX, n: 1, label: 'Sylve · abri', step: 'I', draw: () => sylveShelter() },
  sylve_cabanon: { frame: BUILDING_BOX, n: 1, label: 'Sylve · cabanon', step: 'II', draw: () => sylveCabin() },
  galet_debris: { frame: BUILDING_BOX, n: 1, label: 'Galet · muret de la Fissure', step: 'II', draw: () => galetNook() },
  melisse_debris: { frame: BUILDING_BOX, n: 1, label: 'Mélisse · débris', step: 'III', draw: () => melisseDebris() },
  melisse_abri: { frame: BUILDING_BOX, n: 1, label: 'Mélisse · abri', step: 'III', draw: () => melisseShelter() },
  melisse_cabanon: { frame: BUILDING_BOX, n: 1, label: 'Mélisse · cabanon', step: 'III', draw: () => melisseCabin() },
  tente: { frame: BUILDING_BOX, n: 1, label: 'Tente de voyageur', step: 'IV', draw: () => tent() },
  hamac: { frame: BUILDING_BOX, n: 2, label: 'Hamac', step: 'IV', draw: n => hammock(n) },
  etendoir: { frame: PROP_BOX, n: 2, label: 'Étendoir', step: 'T3', draw: n => clothesline(n) },
  tonneau: { frame: PROP_BOX, n: 1, label: 'Tonneau d\'eau de pluie', step: 'T5', draw: () => rainBarrel() },
  rondins: { frame: PROP_BOX, n: 1, label: 'Rondins', step: 'T3', draw: () => logSeats() },
  filet: { frame: PROP_BOX, n: 1, label: 'Filet tendu', step: 'T2', draw: () => net() },
  paillasse: { frame: PROP_BOX, n: 1, label: 'Paillasse', step: 'T5', draw: () => strawBed() },
  torche: { frame: PROP_BOX, n: 3, label: 'Torche de bois flotté', step: 'I', draw: n => torch(n) },
  sos: { frame: PROP_BOX, n: 1, label: 'SOS en galets', step: 'T2', draw: () => sos() },
  caisses: { frame: PROP_BOX, n: 1, label: 'Pile de caisses', step: 'T2', draw: () => crateStack() }
};
export { crate, plank, stick, rope, stone, dune, kelp, shell, logLying, driftFire, DRIFT, CRATE, CANVAS, SAND, ROPE, IRON, ln, tk, pathTk, ell, iso, dOf, id, OUT, f2, pts };
