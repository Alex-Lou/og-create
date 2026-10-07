// Lot G4 — ce qui reste des Anciens, en vue iso du jeu (trait de la troupe) : une maison en ruine et une colonnade
// (actes III et VI : « Nous aussi, nous étions des naufragés »), une pierre à runes qui luit à la nuit tombée, une
// colonne brisée, la clé du phare sous sa pierre (acte VI) et le phare éteint de l'Îlot aux Mouettes (acte VI). Le
// Cercle de menhirs existe déjà (lieux remarquables, lib/decor/lieux/menhirs_*). Pierre des Anciens : un calcaire
// pâle et usé, mousse et lierre ; leurs runes : la spirale et les signes des menhirs, turquoise quand elles luisent.
import { P, face, box, disc, cylinder, boulder, shadow, EDGE, mixHex } from './port/src/world/iso.js';
import { WOOD, WOOD_DARK, BUILDING_BOX, PROP_BOX } from './port/src/world/palette.js';
import { OUT, f2, pts, ln, tk, pathTk, ell, kelp, logLying } from './camp.mjs';

let uid = 0;
const id = p => `r${p}${uid++}`;
const ANC = { top: '#DDD6C6', left: '#C1B9A7', right: '#9A9281' }; // pierre des Anciens
const ANC_DARK = { top: '#C9C1AF', left: '#ABA290', right: '#857D6D' };
const ROCK = { top: '#A9A59B', left: '#8F8B82', right: '#6E6A62' }; // rochers de l'îlot
const MOSS = '#8FAE5A', MOSS_DARK = '#6E8F42', IVY = '#5E8F3C', IVY_LIGHT = '#7FB04F';
const GLOW = '120,235,215';
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- runes ---------- */
// Quatre signes (la spirale des menhirs, la branche, l'œil, l'éclair) ; o : lueur de 0 (gravé, éteint) à 1
const GLYPHS = [
  'M0,0 m-1.6,0 a1.6,1.6 0 1 1 1.6,1.6 a2.6,2.6 0 1 1 -2.6,-2.6',
  'M0,3 L0,-3 M0,-0.8 L2,-2.8 M0,1.2 L-2,-0.8',
  'M-2.4,0 Q0,-2.4 2.4,0 Q0,2.4 -2.4,0 Z M0,0 m-0.5,0 a0.5,0.5 0 1 0 1,0 a0.5,0.5 0 1 0 -1,0',
  'M-2,-2.6 L0.6,-0.4 L-0.8,0.4 L2,2.6'
];
// skew : 1 sur une face +v (gauche), -1 sur une face +u (droite), 0 de face
function rune(x, y, k, o = 0, s = 1, skew = 0) {
  const d = GLYPHS[k % GLYPHS.length];
  const m = `matrix(${s} ${f2(0.5 * skew * s)} 0 ${s} ${f2(x)} ${f2(y)})`;
  const carved = `<path d="${d}" fill="none" stroke="rgba(70,58,44,.55)" stroke-width="${f2(1.1 / s)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lit = o > 0.02 ? `<path d="${d}" fill="none" stroke="rgba(${GLOW},${f2(o * 0.35)})" stroke-width="${f2(3 / s)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="rgba(${GLOW},${f2(o)})" stroke-width="${f2(0.9 / s)}" stroke-linecap="round" stroke-linejoin="round"/>` : '';
  return `<g transform="${m}">${carved}${lit}</g>`;
}

/* ---------- petits morceaux ---------- */
// Touffe d'herbe folle et feuille de lierre (pixels)
const tuft = (x, y, s = 1, c = '#7FA048') => `<path d="M${f2(x - 3 * s)},${f2(y)} Q${f2(x - 2 * s)},${f2(y - 4 * s)} ${f2(x - 3.4 * s)},${f2(y - 6 * s)} M${f2(x)},${f2(y)} Q${f2(x + 0.6 * s)},${f2(y - 5 * s)} ${f2(x - 0.4 * s)},${f2(y - 7.4 * s)} M${f2(x + 3 * s)},${f2(y)} Q${f2(x + 2.2 * s)},${f2(y - 4 * s)} ${f2(x + 3.8 * s)},${f2(y - 5.6 * s)}" fill="none" stroke="${c}" stroke-width="${f2(1.1 * s)}" stroke-linecap="round"/>`;
const leaf = (x, y, r, rot, c = IVY) => `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${rot})"><path d="M0,${f2(-r)} Q${f2(r * 0.9)},${f2(-r * 0.2)} 0,${f2(r)} Q${f2(-r * 0.9)},${f2(-r * 0.2)} 0,${f2(-r)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.4"/></g>`;
// Lierre : une tige qui serpente de a vers b (pixels), des feuilles de part et d'autre
function ivy(a, b, n = 6, seed = 1) {
  const pt = t => [lerp(a[0], b[0], t) + Math.sin(t * 9 + seed) * 2.2, lerp(a[1], b[1], t)];
  let d = `M${f2(a[0])},${f2(a[1])}`;
  for (let i = 1; i <= 12; i++) { const [x, y] = pt(i / 12); d += ` L${f2(x)},${f2(y)}`; }
  let o = `<path d="${d}" fill="none" stroke="#4E6E32" stroke-width="0.8" stroke-linecap="round"/>`;
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, [x, y] = pt(t); o += leaf(x + (i % 2 ? 2 : -2), y, 1.9, i % 2 ? 40 : -40, i % 3 ? IVY : IVY_LIGHT); }
  return o;
}
// Plaque de mousse posée sur un dessus (pixels)
const mossPad = (x, y, rx, ry) => ell(x, y, rx, ry, MOSS, ` stroke="${OUT}" stroke-width="0.4"`) + ell(x - rx * 0.25, y - ry * 0.25, rx * 0.45, ry * 0.4, '#A9C46E');
// Bloc de pierre taillé (boîte) avec ses joints : courses tous les ~6 px, joints verticaux décalés
function block(u0, v0, u1, v1, z0, z1, c = ANC, course = 6) {
  let o = box(u0, v0, u1, v1, z0, z1, c);
  for (let z = z0 + course, k = 0; z < z1 - 1; z += course, k++) {
    o += ln(P(u0, v1, z), P(u1, v1, z), 'rgba(90,75,55,.35)', 0.6) + ln(P(u1, v1, z), P(u1, v0, z), 'rgba(60,50,35,.35)', 0.6);
  }
  for (let z = z0, k = 0; z < z1 - 2; z += course, k++) {
    const t = k % 2 ? 0.35 : 0.7, zt = Math.min(z + course, z1);
    o += ln(P(lerp(u0, u1, t), v1, z), P(lerp(u0, u1, t), v1, zt), 'rgba(90,75,55,.3)', 0.6);
    o += ln(P(u1, lerp(v0, v1, 1 - t), z), P(u1, lerp(v0, v1, 1 - t), zt), 'rgba(60,50,35,.3)', 0.6);
  }
  return o;
}
// Bloc tombé, de travers (en pixels, losange incliné), moussu
function fallenBlock(u, v, s, h) {
  return shadow(u, v, s * 1.3, 0.2) + block(u - s, v - s * 0.7, u + s, v + s * 0.7, 0, h, ANC_DARK, 99) + mossPad(...P(u - s * 0.2, v - s * 0.1, h), 3, 1.4);
}
// Fût de colonne cannelé (cylindre) de z0 à z1, rayon r (cases) ; top : 'cap' (chapiteau) | 'broken' (cassure) | 'flat'
function column(u, v, z0, z1, r, top = 'flat', seed = 1) {
  const [x0, y0] = P(u, v, z0), rx = r * 64 * Math.SQRT1_2, ry = r * 32 * Math.SQRT1_2;
  let o = cylinder(u, v, z0, z1, r, ANC, id('col'));
  // cannelures
  for (const k of [-0.7, -0.35, 0, 0.35, 0.7]) o += ln([x0 + rx * k, y0 + ry * Math.sqrt(1 - k * k) - 1], [x0 + rx * k, y0 - (z1 - z0) + ry * Math.sqrt(1 - k * k) + (top === 'broken' ? 3 : 1)], k < 0 ? 'rgba(255,255,255,.28)' : 'rgba(60,50,35,.28)', 0.8);
  if (top === 'broken') {
    // cassure : un dessus déchiqueté, plus haut d'un côté, la tranche claire
    const yT = y0 - (z1 - z0);
    const jag = Array.from({ length: 10 }, (_, i) => { const a = Math.PI + (i / 9) * Math.PI, h = Math.abs(Math.sin(i * 1.7 + seed)) * 1.2 + (i < 4 ? 1.8 : i < 6 ? 0.9 : 0); return [x0 + Math.cos(a) * rx, yT + Math.sin(a) * ry - h]; });
    const front = `M${f2(x0 - rx)},${f2(yT)} A${f2(rx)},${f2(ry)} 0 0 0 ${f2(x0 + rx)},${f2(yT)}`;
    o += `<path d="${front} L${pts([...jag].reverse()).split(' ').join(' L')} Z" fill="${ANC.top}"${EDGE}/>`;
    o += `<path d="M${pts(jag.slice(2, 7)).split(' ').join(' L')}" fill="none" stroke="rgba(60,50,35,.35)" stroke-width="0.6"/>`;
  } else if (top === 'cap') {
    // chapiteau : un échine évasée puis un abaque carré
    o += cylinder(u, v, z1, z1 + 3, r * 1.25, ANC, id('ech'));
    o += box(u - r * 1.25, v - r * 1.25, u + r * 1.25, v + r * 1.25, z1 + 3, z1 + 6, ANC);
  }
  return o;
}

/* ---------- murs en ruine, d'un seul tenant ---------- */
// Un mur est une suite de tronçons de hauteurs différentes (le haut s'effrite) ; les faces sont pleines, les assises et
// les joints courent d'un tronçon à l'autre, et le trait ne cerne que les vraies arêtes (pas les joints entre tronçons).
const outline = (list, closed = false) => `<path d="M${pts(list.map(p => P(...p))).split(' ').join(' L')}${closed ? ' Z' : ''}" fill="none" stroke="${OUT}" stroke-width="0.72" stroke-linejoin="round" stroke-linecap="round"/>`;
const JOINT = 'rgba(90,75,55,.32)', JOINT_D = 'rgba(55,45,32,.32)';
// le long de u, de a0, à v0 (épaisseur th) : face avant +v ; renvoie des morceaux { k, d } à trier avec le reste
function wallU(a0, seg, v0, th, hs, c = ANC, course = 6) {
  const v1 = v0 + th, parts = [];
  hs.forEach((h, i) => {
    if (!h) return;
    const a = a0 + i * seg, b = a + seg, hp = i ? hs[i - 1] : 0, hn = i < hs.length - 1 ? hs[i + 1] : 0;
    let d = face([[a, v1, 0], [b, v1, 0], [b, v1, h], [a, v1, h]], c.left);
    for (let z = course; z < h - 1; z += course) d += ln(P(a, v1, z), P(b, v1, z), JOINT, 0.6);
    for (let z = 0, k = 0; z < h - 1; z += course, k++) for (let uj = a0 + (k % 2 ? 0.06 : 0.12); uj < b - 0.01; uj += 0.13) if (uj > a + 0.01) d += ln(P(uj, v1, z), P(uj, v1, Math.min(z + course, h)), JOINT, 0.6);
    if (hn < h) { const q = [[b, v1, hn], [b, v1, h], [b, v0, h], [b, v0, hn]]; d += face(q, c.right) + outline(q, true); for (let z = Math.ceil(hn / course) * course; z < h - 1; z += course) if (z > hn) d += ln(P(b, v1, z), P(b, v0, z), JOINT_D, 0.6); }
    const top = [[a, v0, h], [b, v0, h], [b, v1, h], [a, v1, h]];
    d += face(top, c.top) + outline(top, true) + outline([[a, v1, 0], [b, v1, 0]]);
    if (hp < h) d += outline([[a, v1, hp], [a, v1, h]]);
    parts.push({ k: (a + b) / 2 + v0 + th / 2, d });
  });
  return parts;
}
// le long de v, de b0, à u0 (épaisseur th) : face avant +u
function wallV(b0, seg, u0, th, hs, c = ANC, course = 6) {
  const u1 = u0 + th, parts = [];
  hs.forEach((h, i) => {
    if (!h) return;
    const a = b0 + i * seg, b = a + seg, hp = i ? hs[i - 1] : 0, hn = i < hs.length - 1 ? hs[i + 1] : 0;
    let d = face([[u1, a, 0], [u1, b, 0], [u1, b, h], [u1, a, h]], c.right);
    for (let z = course; z < h - 1; z += course) d += ln(P(u1, a, z), P(u1, b, z), JOINT_D, 0.6);
    for (let z = 0, k = 0; z < h - 1; z += course, k++) for (let vj = b0 + (k % 2 ? 0.06 : 0.12); vj < b - 0.01; vj += 0.13) if (vj > a + 0.01) d += ln(P(u1, vj, z), P(u1, vj, Math.min(z + course, h)), JOINT_D, 0.6);
    if (hn < h) { const q = [[u0, b, hn], [u1, b, hn], [u1, b, h], [u0, b, h]]; d += face(q, c.left) + outline(q, true); for (let z = Math.ceil(hn / course) * course; z < h - 1; z += course) if (z > hn) d += ln(P(u0, b, z), P(u1, b, z), JOINT, 0.6); }
    const top = [[u0, a, h], [u1, a, h], [u1, b, h], [u0, b, h]];
    d += face(top, c.top) + outline(top, true) + outline([[u1, a, 0], [u1, b, 0]]);
    if (hp < h) d += outline([[u1, a, hp], [u1, a, h]]);
    parts.push({ k: u0 + th / 2 + (a + b) / 2, d });
  });
  return parts;
}

/* ---------- 1. Maison en ruine ---------- */
// Un angle de murs (au fond) qui s'effrite vers l'avant, une porte sous un linteau gravé, les restes des murs de
// devant à ras du sol, un dallage où l'herbe repousse, un bloc tombé, un arbrisseau dans l'angle (la vie revient)
function ruinHouse() {
  const u0 = -0.82, v0 = -0.82, th = 0.14, seg = 0.14;
  let o = shadow(0, 0.05, 1.02, 0.14) + disc(0.02, 0.05, 0, 0.92, 'rgba(150,170,110,.28)');
  // l'angle du fond : mur le long de u (face vers nous à gauche) et mur le long de v (face à droite), la porte entre
  // deux piliers sous un linteau gravé
  const parts = [...wallU(u0 + th, seg, v0, th, [38, 34, 36, 27, 22, 13, 8, 4]), ...wallV(v0, seg, u0, th, [42, 36, 38, 0, 0, 34, 24, 15, 7])];
  { const a = v0 + 3 * seg, b = v0 + 5 * seg;
    const [x, y] = P(u0 + th, (a + b) / 2, 28.4);
    parts.push({ k: u0 + th / 2 + (a + b) / 2, d: box(u0, a, u0 + th, b, 25, 31.6, ANC_DARK) + rune(x, y, 0, 0, 0.9, -1) }); }
  // le seuil, qu'on voit par la porte
  parts.push({ k: u0 + v0 + 4 * seg - 0.01, d: face([[u0, v0 + 3 * seg, 0.4], [u0 + th + 0.05, v0 + 3 * seg, 0.4], [u0 + th + 0.05, v0 + 5 * seg, 0.4], [u0, v0 + 5 * seg, 0.4]], ANC_DARK.top, EDGE) });
  parts.sort((p, q) => p.k - q.k).forEach(p => { o += p.d; });
  // la mousse sur les dessus, le lierre sur les murs
  o += mossPad(...P(u0 + th + 1.5 * seg, v0 + th / 2, 34), 2.6, 1.2) + mossPad(...P(u0 + th / 2, v0 + 1.5 * seg, 36), 2.4, 1.1) + mossPad(...P(u0 + th + 4.5 * seg, v0 + th / 2, 22), 2.2, 1);
  o += ivy(P(u0 + th + 0.3, v0 + th, 0), P(u0 + th + 0.36, v0 + th, 30), 7, 2) + ivy(P(u0 + th, v0 + 7.5 * seg, 0), P(u0 + th, v0 + 7.2 * seg, 14), 4, 5);
  // le dallage : quelques dalles, l'herbe dans les joints
  for (const [u, v, s] of [[-0.42, -0.4, 0.13], [-0.14, -0.44, 0.12], [-0.44, -0.1, 0.12], [-0.12, -0.12, 0.13], [0.16, -0.38, 0.11], [-0.4, 0.2, 0.1], [0.14, 0.02, 0.1]]) {
    o += face([[u - s, v - s, 0], [u + s, v - s, 0], [u + s, v + s, 0], [u - s, v + s, 0]], u + v < -0.5 ? ANC_DARK.top : ANC.top, ` stroke="rgba(90,75,55,.5)" stroke-width="0.6"`);
  }
  for (const [u, v] of [[-0.28, -0.26], [0.02, -0.3], [-0.3, 0.06], [0.0, 0.04], [0.28, -0.2]]) o += tuft(...P(u, v, 0), 0.7);
  // l'arbrisseau qui pousse dans l'angle
  { const [x, y] = P(u0 + th + 0.12, v0 + th + 0.12, 0); o += tk([x, y], [x + 1, y - 14], WOOD_DARK.left, 1.2) + ell(x - 3, y - 16, 6, 5, IVY, EDGE) + ell(x + 4, y - 18, 5.4, 4.6, IVY_LIGHT, EDGE) + ell(x, y - 22, 5, 4.2, '#8FC060', EDGE); }
  // le bloc tombé
  o += fallenBlock(0.28, 0.22, 0.14, 7);
  // les restes des murs de devant, à ras du sol
  const front = [...wallU(u0, seg, 0.6, th, [6, 4, 7, 3, 0, 5], ANC, 99), ...wallV(v0 + th, seg, 0.6, th, [5, 7, 3, 0, 4], ANC, 99)];
  front.sort((p, q) => p.k - q.k).forEach(p => { o += p.d; });
  for (const [u, v] of [[0.7, 0.3], [-0.2, 0.76], [0.4, 0.74]]) o += tuft(...P(u, v, 0), 0.8);
  return o;
}

/* ---------- 2. Colonnade ---------- */
// Un soubassement à deux marches ; une colonne debout avec son chapiteau et un bout d'architrave, une colonne cassée
// à mi-hauteur, un tronçon, et une colonne tombée en tambours dans l'herbe ; une rune sur la marche
function colonnade() {
  let o = shadow(0, 0.05, 1.02, 0.14) + disc(0.02, 0.05, 0, 0.92, 'rgba(150,170,110,.28)');
  o += block(-0.86, -0.62, 0.5, 0.2, 0, 4, ANC_DARK, 99) + block(-0.78, -0.54, 0.42, 0.12, 4, 8, ANC, 99);
  for (const u of [-0.48, -0.18, 0.12]) o += ln(P(u, -0.54, 8), P(u, 0.12, 8), 'rgba(90,75,55,.35)', 0.6);
  for (const v of [-0.32, -0.1]) o += ln(P(-0.78, v, 8), P(0.42, v, 8), 'rgba(90,75,55,.35)', 0.6);
  o += `<path d="M${pts([P(0.2, -0.3, 8), P(0.26, -0.22, 8), P(0.24, -0.12, 8), P(0.32, -0.04, 8)]).split(' ').join(' L')}" fill="none" stroke="rgba(60,50,35,.5)" stroke-width="0.7"/>`;
  { const [x, y] = P(-0.2, 0.2, 2); o += rune(x, y, 1, 0, 0.8, 1) + rune(x + 9, y + 4.5, 3, 0, 0.8, 1); }
  // les colonnes, de la plus au fond à la plus proche
  const cols = [[-0.62, -0.38, 46, 'cap'], [-0.28, -0.2, 30, 'broken'], [0.06, -0.02, 12, 'broken'], [0.28, 0.0, 0, '']];
  for (const [u, v, h, top] of cols) {
    o += box(u - 0.11, v - 0.11, u + 0.11, v + 0.11, 8, 11, ANC);
    if (h) o += column(u, v, 11, 11 + h, 0.08, top, u * 10);
  }
  // un bout d'architrave sur la colonne debout, qui part vers le fond
  o += box(-0.92, -0.46, -0.42, -0.3, 63, 69, ANC_DARK);
  o += face([[-0.42, -0.46, 63], [-0.42, -0.3, 63], [-0.42, -0.3, 65.4], [-0.39, -0.36, 67.2], [-0.41, -0.41, 69], [-0.42, -0.46, 69]], ANC.top, EDGE);
  o += mossPad(...P(-0.7, -0.38, 69), 3, 1.3);
  o += ivy(P(-0.62 + 0.06, -0.38 + 0.08, 11), P(-0.62 + 0.04, -0.38 + 0.08, 50), 7, 3);
  // la colonne tombée : trois tambours dans l'herbe, devant
  o += shadow(0.3, 0.52, 0.5, 0.18);
  o += logLying(-0.1, 0.46, 0.12, 0.5, 5.6, { bark: ANC.left, dark: 'rgba(60,50,35,.3)', end: ANC.top, ring: ANC_DARK.left });
  o += logLying(0.2, 0.52, 0.42, 0.6, 5.6, { bark: ANC.left, dark: 'rgba(60,50,35,.3)', end: ANC.top, ring: ANC_DARK.left });
  o += logLying(0.52, 0.68, 0.7, 0.76, 5.6, { bark: ANC.left, dark: 'rgba(60,50,35,.3)', end: ANC.top, ring: ANC_DARK.left });
  // le chapiteau tombé à côté
  o += box(0.64, 0.28, 0.84, 0.48, 0, 4, ANC_DARK) + mossPad(...P(0.74, 0.38, 4), 2.6, 1.2);
  for (const [u, v] of [[0.0, 0.66], [0.46, 0.4], [0.7, 0.86], [-0.5, 0.4], [0.62, 0.02]]) o += tuft(...P(u, v, 0), 0.9);
  return o;
}

/* ---------- 3. Pierre à runes ---------- */
// Une stèle épaisse au sommet arrondi, plantée dans l'herbe ; ses runes luisent à la nuit tombée (n : 0 éteinte, 1 lit)
function runeStone(n = 0) {
  const o0 = n ? 0.95 : 0.0;
  let o = shadow(0, 0.02, 0.34, 0.2);
  // la dalle : face +v (large, éclairée), face +u (étroite, à l'ombre), sommet arrondi
  const a = P(-0.28, 0.1, 0), b = P(0.24, 0.1, 0), c = P(0.24, -0.06, 0);
  const H = 38, Hb = 31;
  o += `<path d="M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])} L${f2(b[0] - 1)},${f2(b[1] - Hb)} Q${f2((a[0] + b[0]) / 2 + 1)},${f2((a[1] + b[1]) / 2 - H - 6)} ${f2(a[0] + 1.2)},${f2(a[1] - Hb + 2)} Z" fill="${ANC_DARK.left}"${EDGE}/>`;
  o += `<path d="M${f2(b[0])},${f2(b[1])} L${f2(c[0])},${f2(c[1])} L${f2(c[0] - 0.8)},${f2(c[1] - Hb + 1)} Q${f2(c[0] - 2)},${f2(c[1] - Hb - 4)} ${f2(b[0] - 1)},${f2(b[1] - Hb)} Z" fill="${ANC_DARK.right}"${EDGE}/>`;
  // la tranche du sommet
  o += `<path d="M${f2(a[0] + 1.2)},${f2(a[1] - Hb + 2)} Q${f2((a[0] + b[0]) / 2 + 1)},${f2((a[1] + b[1]) / 2 - H - 6)} ${f2(b[0] - 1)},${f2(b[1] - Hb)} Q${f2(c[0] - 2)},${f2(c[1] - Hb - 4)} ${f2(c[0] - 4)},${f2(c[1] - Hb - 6)} Q${f2((a[0] + c[0]) / 2)},${f2((a[1] + c[1]) / 2 - H - 10)} ${f2(a[0] + 1.2)},${f2(a[1] - Hb + 2)} Z" fill="${ANC_DARK.top}"${EDGE}/>`;
  // le halo quand elles luisent
  if (n) { const [x, y] = P(0, 0.08, 18); o += ell(x, y, 16, 20, `rgba(${GLOW},.16)`); }
  // trois lignes de runes sur la face large, et une sur la tranche
  const at = (t, z) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t) - z];
  [[0.3, 25, 0], [0.62, 25.2, 2], [0.26, 16, 1], [0.56, 16.2, 3], [0.82, 16.4, 0], [0.34, 7, 2], [0.68, 7.2, 1]].forEach(([t, z, k]) => { const [x, y] = at(t, z); o += rune(x, y, k, o0, 0.72, 1); });
  { const [x, y] = [lerp(b[0], c[0], 0.5), lerp(b[1], c[1], 0.5) - 18]; o += rune(x, y, 1, o0 * 0.8, 0.7, -1); }
  // le lichen, l'herbe au pied
  o += ell(...at(0.8, 29), 2.2, 1.2, 'rgba(200,210,150,.9)') + ell(...at(0.14, 12), 1.6, 1, 'rgba(160,190,110,.85)');
  o += tuft(...P(-0.18, 0.12, 0), 0.9) + tuft(...P(0.14, 0.14, 0), 0.8) + tuft(...P(0.2, 0.0, 0), 0.7);
  // quelques étincelles qui montent quand elle luit
  if (n) for (const [dx, dy, r] of [[-8, -40, 1], [6, -46, 0.8], [10, -32, 0.7]]) o += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="rgba(${GLOW},.85)"/>`;
  return o;
}

/* ---------- 4. Colonne brisée ---------- */
const brokenColumn = () => shadow(0, 0, 0.24, 0.2)
  + block(-0.15, -0.15, 0.15, 0.15, 0, 6, ANC_DARK, 99) + (() => { const [x, y] = P(0, 0.15, 3); return rune(x, y, 0, 0, 0.75, 1); })()
  + column(0, 0, 6, 30, 0.09, 'broken', 2)
  + ivy(P(-0.04, 0.08, 6), P(-0.06, 0.08, 26), 5, 4)
  + box(0.16, 0.12, 0.3, 0.24, 0, 4, ANC) + tuft(...P(-0.16, 0.18, 0), 0.8) + tuft(...P(0.2, -0.12, 0), 0.7);

/* ---------- 5. La clé du phare ---------- */
// « J'ai laissé la clé du phare sous une pierre » : une dalle soulevée, calée sur un caillou ; dessous, le creux, une
// grosse clé de bronze verdie (n = 1 : elle brille)
function lighthouseKey(n = 0) {
  let o = shadow(0, 0, 0.34, 0.18);
  // le rocher du fond, contre lequel la dalle est rabattue
  o += boulder(0.02, -0.3, 0.2, 0.12, 12, ANC_DARK, 5, 0.2, 0.7);
  // la dalle, basculée en arrière : on voit son dessous, humide et plus sombre, et la rune qu'il cachait
  const q = [[-0.2, -0.1, 0], [0.2, -0.1, 0], [0.2, -0.24, 17], [-0.2, -0.24, 17]];
  o += face([[0.2, -0.1, 0], [0.2, -0.24, 17], [0.2, -0.27, 15.6], [0.2, -0.12, -0.6]], ANC_DARK.right, EDGE);
  o += face(q, '#8F8676', EDGE) + face([[-0.2, -0.24, 17], [0.2, -0.24, 17], [0.2, -0.27, 15.6], [-0.2, -0.27, 15.6]], ANC.top, EDGE);
  { const [x, y] = P(0, -0.17, 8.4); o += rune(x, y, 0, n ? 0.75 : 0.3, 0.95, 0); }
  o += ell(...P(-0.12, -0.14, 4), 1.6, 0.9, 'rgba(160,190,110,.85)') + ell(...P(0.12, -0.2, 12), 1.2, 0.7, 'rgba(160,190,110,.85)');
  // le creux laissé dans la terre, et la clé dedans
  o += face([[-0.18, -0.1, 0], [0.18, -0.1, 0], [0.18, 0.16, 0], [-0.18, 0.16, 0]], '#6B5A42', EDGE);
  o += face([[-0.18, -0.1, 0], [0.18, -0.1, 0], [0.18, -0.04, 0], [-0.18, -0.04, 0]], '#4E4030');
  { const [x, y] = P(0.0, 0.04, 0.4);
    const k = (st, w) => `<circle cx="-6" cy="0" r="3.2" fill="none" stroke="${st}" stroke-width="${w}"/><path d="M-2.8,0 L7.4,0 M5,0 L5,3.2 M7.4,0 L7.4,2.6" fill="none" stroke="${st}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    o += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(-10)">${k(OUT, 3)}${k('#C99A44', 1.5)}<circle cx="-6" cy="0" r="1.3" fill="#6B5A42"/><circle cx="-7.6" cy="-1.6" r="0.7" fill="#7FB0A0"/><circle cx="2" cy="-0.2" r="0.55" fill="#7FB0A0"/><path d="M-1.6,-0.6 L4,-0.6" stroke="#F0CF7A" stroke-width="0.5"/></g>`;
    if (n) o += ell(x, y, 11, 5, 'rgba(255,230,150,.25)') + `<path d="M${f2(x + 6)},${f2(y - 9)} l1,2.6 l2.6,1 l-2.6,1 l-1,2.6 l-1,-2.6 l-2.6,-1 l2.6,-1 Z" fill="#FFF6D0" stroke="${OUT}" stroke-width="0.3"/>`; }
  // les mottes au bord du creux, l'herbe
  for (const [u, v] of [[-0.2, 0.18], [0.2, 0.12], [0.06, 0.2]]) { const [x, y] = P(u, v, 0); o += ell(x, y, 2.4, 1.2, '#8A7454', ` stroke="${OUT}" stroke-width="0.4"`); }
  o += tuft(...P(-0.26, 0.2, 0), 0.8) + tuft(...P(0.28, 0.06, 0), 0.7) + tuft(...P(-0.3, -0.06, 0), 0.7);
  return o;
}

/* ---------- 6. Le phare éteint des Anciens ---------- */
// Sur les rochers de l'Îlot aux Mouettes : une tour de pierre qui s'affine, assises et joints, une fissure, une porte
// condamnée sous un linteau gravé, deux meurtrières ; la galerie à la rambarde cassée, la lanterne aux vitres brisées
// et sa lentille froide, le dôme vert-de-gris crevé ; des traînées blanches, des mouettes posées et en vol (n : 2 images)
function deadLighthouse(n = 0) {
  const Z0 = 16, Z1 = 112, R0 = 18, R1 = 12.5;
  const y = z => -z, rAt = z => lerp(R0, R1, (z - Z0) / (Z1 - Z0));
  let o = shadow(0, 0.05, 0.9, 0.16);
  // rochers du fond
  o += boulder(-0.52, -0.42, 0.34, 0.28, 13, ROCK, 4, 0.3, 0.48) + boulder(0.38, -0.54, 0.28, 0.24, 11, ROCK, 7, 0.3, 0.48);
  // le socle rocheux sous la tour
  o += boulder(0, 0, 0.68, 0.62, Z0 + 2, ROCK, 2, 0.18, 0.8);
  // la tour
  const g = id('tour');
  o += `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${ANC.left}"/><stop offset=".55" stop-color="${mixHex(ANC.left, ANC.right, 0.5)}"/><stop offset="1" stop-color="${ANC.right}"/></linearGradient></defs>`;
  o += `<path d="M${-R1},${y(Z1)} L${-R0},${y(Z0)} A${R0},${R0 / 2} 0 0 0 ${R0},${y(Z0)} L${R1},${y(Z1)} Z" fill="url(#${g})"${EDGE}/>`;
  // assises et joints décalés
  for (let z = Z0 + 8, k = 0; z < Z1 - 2; z += 8, k++) {
    const r = rAt(z);
    o += `<path d="M${f2(-r)},${f2(y(z))} A${f2(r)},${f2(r / 2)} 0 0 0 ${f2(r)},${f2(y(z))}" fill="none" stroke="rgba(80,65,45,.3)" stroke-width="0.7"/>`;
    for (const th of k % 2 ? [0.22, 0.5, 0.78] : [0.36, 0.64]) {
      const a = Math.PI * (1 - th), xx = Math.cos(a) * r, yy = y(z) + Math.sin(a) * r / 2;
      o += ln([xx, yy], [xx * rAt(z - 8) / r, yy + 8], 'rgba(80,65,45,.26)', 0.6);
    }
  }
  // la fissure, côté ombre
  o += `<path d="M7,${y(96)} L9.4,${y(88)} L7.6,${y(82)} L10.6,${y(72)} L9,${y(64)} L11.6,${y(56)}" fill="none" stroke="#4A3F33" stroke-width="0.9" stroke-linejoin="round"/>`;
  // les meurtrières (une fendue)
  for (const [x, z] of [[-4, 52], [-2.6, 84]]) o += `<path d="M${x - 1.4},${y(z)} L${x - 1.4},${y(z + 8)} Q${x},${y(z + 10)} ${x + 1.4},${y(z + 8)} L${x + 1.4},${y(z)} Z" fill="#2E2A26"${EDGE}/>`;
  // la porte condamnée et son linteau gravé
  o += `<path d="M-7,${y(Z0) + 7.6} L-7,${y(Z0 + 13)} Q-1,${y(Z0 + 20)} 5,${y(Z0 + 13)} L5,${y(Z0) + 8.8} Q-1,${y(Z0) + 10.4} -7,${y(Z0) + 7.6} Z" fill="${WOOD_DARK.right}"${EDGE}/>`;
  o += ln([-6.4, y(Z0 + 4)], [4.4, y(Z0 + 11)], WOOD.left, 1.6) + ln([-6.4, y(Z0 + 11)], [4.4, y(Z0 + 4)], WOOD.left, 1.6);
  o += `<path d="M-8.6,${y(Z0 + 19)} Q-1,${y(Z0 + 23.4)} 6.6,${y(Z0 + 19)} L6.6,${y(Z0 + 15.6)} Q-1,${y(Z0 + 20)} -8.6,${y(Z0 + 15.6)} Z" fill="${ANC_DARK.left}"${EDGE}/>`;
  o += rune(-1, y(Z0 + 19.2), 0, n ? 0.5 : 0.25, 0.75, 0);
  // le lierre qui grimpe côté lumière, les traînées blanches des mouettes
  o += ivy([-15, y(Z0) + 4], [-12.6, y(56)], 9, 1);
  for (const [x, z0, z1] of [[-8, Z1 - 2, Z1 - 22], [3, Z1 - 2, Z1 - 30], [9.6, Z1 - 2, Z1 - 16]]) o += `<path d="M${x},${y(z0)} q0.8,${(z0 - z1) * 0.4} -0.4,${z0 - z1}" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.2" stroke-linecap="round"/>`;
  // la galerie : consoles, dalle, rambarde (le fond d'abord)
  const RG = R1 + 6, yG = y(Z1);
  for (const k of [-0.75, -0.25, 0.25, 0.75]) { const x = k * R1, yy = yG + Math.sqrt(1 - k * k) * R1 / 2; o += `<path d="M${f2(x - 1.6)},${f2(yy)} L${f2(x + 1.6)},${f2(yy)} L${f2(x)},${f2(yy + 5)} Z" fill="${ANC_DARK.right}"${EDGE}/>`; }
  o += `<path d="M${-RG},${yG} L${-RG},${yG + 3} A${RG},${RG / 2} 0 0 0 ${RG},${yG + 3} L${RG},${yG} Z" fill="${ANC_DARK.left}"${EDGE}/>` + ell(0, yG, RG, RG / 2, ANC.top, EDGE);
  const post = (a, broken) => { const x = Math.cos(a) * (RG - 1.4), yy = yG + Math.sin(a) * (RG - 1.4) / 2; return broken ? tk([x, yy], [x + 1.6, yy - 3.4], '#4E5A5E', 0.7) : tk([x, yy], [x, yy - 7], '#4E5A5E', 0.7); };
  for (let i = 0; i < 6; i++) o += post(Math.PI + (i / 5) * Math.PI, false);
  o += `<path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 1 ${RG - 1.4},${yG - 7}" fill="none" stroke="${OUT}" stroke-width="1.9"/><path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 1 ${RG - 1.4},${yG - 7}" fill="none" stroke="#4E5A5E" stroke-width="0.8"/>`;
  // la lanterne : verre sombre, montants, vitres brisées, la lentille froide derrière
  const RL = 9.4, ZL0 = Z1, ZL1 = Z1 + 20, yL0 = y(ZL0), yL1 = y(ZL1);
  o += box(-0.17, -0.17, 0.17, 0.17, ZL0, ZL0 + 3, ANC_DARK);
  o += `<path d="M${-RL},${yL1} L${-RL},${yL0 - 3} A${RL},${RL / 2} 0 0 0 ${RL},${yL0 - 3} L${RL},${yL1} Z" fill="#3B4E57"${EDGE}/>`;
  o += ell(0, yL0 - 12, 5, 6.4, '#8E9AA0', EDGE) + ell(0, yL0 - 12, 3.2, 4.2, 'none', ' stroke="#6E7A80" stroke-width="0.6"') + ell(0, yL0 - 12, 1.4, 2, '#6E7A80');
  // vitres encore là (le reflet), et les trous (on voit la lentille)
  o += `<path d="M${-RL + 1},${yL1 + 2} L${-RL + 1},${yL0 - 4} L-4.4,${yL0 - 2.2} L-4.4,${yL1 + 4} Z" fill="rgba(140,170,180,.75)"/>`;
  o += `<path d="M4.6,${yL1 + 4} L4.6,${yL0 - 2.2} L${RL - 1},${yL0 - 4} L${RL - 1},${yL1 + 2} Z" fill="rgba(110,140,150,.8)"/>`;
  o += `<path d="M-4.4,${yL1 + 4} L4.6,${yL1 + 4} L4.6,${yL1 + 9} L2,${yL1 + 7} L0.4,${yL1 + 11} L-1.6,${yL1 + 8} L-4.4,${yL1 + 10} Z" fill="rgba(140,170,180,.75)"/>`;
  o += ln([-RL + 2.6, yL1 + 4], [-5.6, yL1 + 9], 'rgba(255,255,255,.6)', 0.8);
  for (const k of [-1, -0.47, 0.47, 1]) { const x = k * (RL - 0.2), yy = yL0 - 3 + Math.sqrt(Math.max(0, 1 - k * k)) * RL / 2; o += ln([x, yL1], [x, yy], '#2B2420', 1.1); }
  // le dôme vert-de-gris, crevé, sa girouette tordue
  const gd = id('dome'), RD = RL + 1.6;
  o += `<defs><linearGradient id="${gd}" x1="0" x2="1"><stop offset="0" stop-color="#7FAE9C"/><stop offset="1" stop-color="#4F7A6C"/></linearGradient></defs>`;
  o += `<path d="M${-RD},${yL1} Q${-RD},${yL1 - 13} 0,${yL1 - 14} Q${RD},${yL1 - 13} ${RD},${yL1} A${RD},${RD / 2} 0 0 1 ${-RD},${yL1} Z" fill="url(#${gd})"${EDGE}/>`;
  o += `<path d="M1.4,${yL1 - 9.6} L3.2,${yL1 - 11} L4.4,${yL1 - 9.4} L6.6,${yL1 - 9} L6.8,${yL1 - 6.4} L8.2,${yL1 - 4.4} L6.6,${yL1 - 2.6} L7,${yL1 - 0.8} L4.4,${yL1 - 1.6} L2.6,${yL1 - 0.4} L2.2,${yL1 - 3.2} L0.6,${yL1 - 5} L1.8,${yL1 - 6.8} Z" fill="#26302E"${EDGE}/>`
    + `<path d="M2.6,${yL1 - 10.6} Q5.2,${yL1 - 7} 5.4,${yL1 - 1.2}" fill="none" stroke="${OUT}" stroke-width="1.7"/><path d="M2.6,${yL1 - 10.6} Q5.2,${yL1 - 7} 5.4,${yL1 - 1.2}" fill="none" stroke="#6E9C8C" stroke-width="0.7"/>`
    + `<path d="M0.8,${yL1 - 5.2} Q4.6,${yL1 - 5.8} 8,${yL1 - 4.6}" fill="none" stroke="${OUT}" stroke-width="1.5"/><path d="M0.8,${yL1 - 5.2} Q4.6,${yL1 - 5.8} 8,${yL1 - 4.6}" fill="none" stroke="#6E9C8C" stroke-width="0.6"/>`;
  o += ell(0, yL1 + 0.2, RD, RD / 2.4, 'none', ' stroke="#3E6458" stroke-width="0.8"');
  o += tk([0, yL1 - 14], [0.4, yL1 - 19], '#4E5A5E', 0.8) + tk([0.4, yL1 - 19], [3.4, yL1 - 20.6], '#4E5A5E', 0.7);
  // la rambarde de devant (cassée à droite) et les mouettes posées
  for (let i = 0; i < 7; i++) { const a = (i / 6) * Math.PI; if (i === 5) continue; o += post(a, i === 4); }
  o += `<path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 0 ${f2(Math.cos(Math.PI * 0.62) * (RG - 1.4))},${f2(yG - 7 + Math.sin(Math.PI * 0.62) * (RG - 1.4) / 2)}" fill="none" stroke="${OUT}" stroke-width="1.9"/><path d="M${-RG + 1.4},${yG - 7} A${RG - 1.4},${(RG - 1.4) / 2} 0 0 0 ${f2(Math.cos(Math.PI * 0.62) * (RG - 1.4))},${f2(yG - 7 + Math.sin(Math.PI * 0.62) * (RG - 1.4) / 2)}" fill="none" stroke="#4E5A5E" stroke-width="0.8"/>`;
  const perched = (x, yy, flip = 1) => `<g transform="translate(${f2(x)} ${f2(yy)}) scale(${flip} 1)"><path d="M-3.4,0 Q-3,-3 0,-3.2 Q2.6,-3.4 3.6,-1.4 L1.6,0.4 Q-1,1.2 -3.4,0 Z" fill="#FBF8F0" stroke="${OUT}" stroke-width="0.45"/><path d="M-3.6,-0.8 Q-1,-2.2 1.4,-1 L-0.6,0.4 Z" fill="#AEB6BC" stroke="${OUT}" stroke-width="0.35"/><circle cx="2" cy="-2.4" r="0.5" fill="${OUT}"/><path d="M3.4,-1.8 L5,-1.4 L3.4,-1 Z" fill="#F2A23C"/><path d="M-0.4,0.6 L-0.4,2.4 M1,0.6 L1,2.4" stroke="#F2A23C" stroke-width="0.6"/></g>`;
  o += perched(-RG + 3, yG - 9.4) + perched(-3, yG + RG / 2 - 9.6, -1);
  // les rochers de devant, les algues, les fientes
  o += boulder(-0.52, 0.36, 0.3, 0.24, 10, ROCK, 9, 0.32, 0.44) + boulder(0.5, 0.26, 0.28, 0.24, 9, ROCK, 11, 0.32, 0.44) + boulder(-0.16, 0.56, 0.2, 0.15, 6, ROCK, 15, 0.32, 0.42) + boulder(0.14, 0.64, 0.24, 0.17, 7, ROCK, 13, 0.32, 0.44);
  for (const [u, v] of [[-0.24, 0.66], [0.66, 0.5], [-0.78, 0.1]]) o += tuft(...P(u, v, 0), 0.8, '#8FA65A');
  for (const [u, v, z] of [[-0.54, 0.34, 10], [0.48, 0.24, 9], [0.24, -0.3, 18], [-0.34, 0.12, 18], [0.14, 0.62, 7]]) { const [x, yy] = P(u, v, z); o += ell(x, yy, 1.6, 0.8, 'rgba(255,255,255,.85)'); }
  // les mouettes en vol (elles tournent autour du phare)
  const fly = (x, yy, up, s = 1) => `<path d="M${f2(x - 6 * s)},${f2(yy + (up ? -3 : 1.6) * s)} Q${f2(x - 3 * s)},${f2(yy + (up ? -3.4 : -1) * s)} ${f2(x)},${f2(yy)} Q${f2(x + 3 * s)},${f2(yy + (up ? -3.4 : -1) * s)} ${f2(x + 6 * s)},${f2(yy + (up ? -3 : 1.6) * s)}" fill="none" stroke="${OUT}" stroke-width="${f2(1.6 * s)}" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f2(x - 6 * s)},${f2(yy + (up ? -3 : 1.6) * s)} Q${f2(x - 3 * s)},${f2(yy + (up ? -3.4 : -1) * s)} ${f2(x)},${f2(yy)} Q${f2(x + 3 * s)},${f2(yy + (up ? -3.4 : -1) * s)} ${f2(x + 6 * s)},${f2(yy + (up ? -3 : 1.6) * s)}" fill="none" stroke="#FBF8F0" stroke-width="${f2(0.7 * s)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  o += n ? fly(-30, -150, false) + fly(28, -128, true, 0.8) + fly(-40, -100, true, 0.7) : fly(-26, -146, true) + fly(32, -132, false, 0.8) + fly(-42, -106, false, 0.7);
  return o;
}

export const RUINES = {
  ruine_maison: { frame: BUILDING_BOX, n: 1, label: 'Maison en ruine des Anciens', step: 'III', draw: () => ruinHouse() },
  colonnade: { frame: BUILDING_BOX, n: 1, label: 'Colonnade des Anciens', step: 'III', draw: () => colonnade() },
  pierre_runes: { frame: PROP_BOX, n: 2, label: 'Pierre à runes (jour, nuit)', step: 'III', draw: n => runeStone(n) },
  colonne_brisee: { frame: PROP_BOX, n: 1, label: 'Colonne brisée', step: 'III', draw: () => brokenColumn() },
  cle_du_phare: { frame: PROP_BOX, n: 2, label: 'La clé du phare sous sa pierre', step: 'VI', draw: n => lighthouseKey(n) },
  phare_eteint: { frame: { x: -72, y: -176, w: 144, h: 208 }, n: 2, label: 'Le phare éteint des Anciens', step: 'VI', draw: n => deadLighthouse(n) }
};
// Chaque dessin repart de zéro pour nommer ses dégradés (id) : ses noms ne dépendent plus de ce qu'on a dessiné avant, et
// le jeu (le générateur du décor) retrouve les fichiers à l'octet près
for (const a of Object.values(RUINES)) { const dessin = a.draw; a.draw = n => { uid = 0; return dessin(n); }; }
