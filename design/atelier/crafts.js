// Créations d'île (lot 8 et 9d) au trait de la troupe, d'après les descriptions de src/world/craftSprites.js.
// Une case, ancre au centre, cadre PROP_BOX × 1,25. Chaque création : { n : nombre d'images, draw(f) }.
const { OUT, P, E, L, r2 } = require('./troupe');
const Dk = require('./deco');
const { herbe, fleurette } = require('./arbres');
const { pt, poly, face, shadow, box, crown, boulder, flower, stroke, thick, cylinder, disc, gable, pyramid, post, rail, flame, glow,
  LEAVES, WOOD, WOOD_DARK, GRANITE, STONE, WHITE_STONE, ROOF_RED, ROOF_BLUE, WALL, SOIL, WATER, WATER_LIGHT, BRASS, IRON } = Dk;

const TAU = Math.PI * 2;
const FLOWERS = ['#E8566A', '#F2C04B', '#B48AE0', '#FFFFFF', '#F08A3A'];
const leafDot = (x, y, r) => E(x + r * 0.2, y + r * 0.2, r, r, LEAVES.dark, 0.8) + E(x, y, r * 0.85, r * 0.85, LEAVES.mid, 0) + E(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.4, LEAVES.light, 0);
const stem = (x, y, h, sw = 0) => thick(`M${r2(x)},${r2(y)} q${r2(sw * 0.2)},${r2(-h * 0.5)} ${r2(sw)},${r2(-h)}`, 0.8, '#5DAA45');
const at = (u, v, z = 0) => pt(u, v, z);
const ellipseAt = (u, v, z, rx, ry, fill, w = 1) => { const [x, y] = at(u, v, z); return E(x, y, rx, ry, fill, w); };
const wave = (f, n, amp, ph = 0) => Math.sin((f / n) * TAU + ph) * amp;
const ICE = { top: '#E9F8FF', left: '#BFE7F7', right: '#8CCBE8' };
const OBSIDIAN = { top: '#4A4258', left: '#2C2A34', right: '#1C1A22' };
const SANDSTONE = { top: '#E6CFA0', left: '#CDB07A', right: '#A88A58' };
const REED = { top: '#D8C27A', left: '#C2A65A', right: '#9E8440' };
const COPPER = { top: '#F2A66A', left: '#D9824A', right: '#A85E30' };

const C = {};
// Clôture : deux lisses derrière, quatre planches à pointe clouées, pas tout à fait égales ; herbe et fleurettes au pied
const BOIS_CLOTURE = { top: '#EFC992', left: '#D49D60', right: '#A86F3E', grain: '#B47C46', lumiere: '#F8E0B6' };
// une planche à pointe, sa face avant tournée vers +v, son chant à droite, le biseau de la pointe
function planche(u, w, v0, v1, z0, z1, tip, c) {
  const a = u - w, b = u + w;
  return poly([at(a, v1, z0), at(b, v1, z0), at(b, v1, z1), at(u, v1, z1 + tip), at(a, v1, z1)], c.left, 1)
    + poly([at(b, v0, z0), at(b, v1, z0), at(b, v1, z1), at(b, v0, z1)], c.right, 0.8)
    + poly([at(b, v0, z1), at(b, v1, z1), at(u, v1, z1 + tip), at(u, v0, z1 + tip)], c.top, 0.8)
    + L(at(a + 0.012, v1, z0 + 2), at(a + 0.012, v1, z1 - 0.6), c.lumiere, 0.7)
    + L(at(u + 0.012, v1, z0 + 4), at(u + 0.006, v1, z1 - 3), c.grain, 0.5);
}
C.cloture = { n: 1, draw: () => {
  const c = BOIS_CLOTURE;
  let s = shadow(0, 0.06, 0.42, 0.14)
    + box(-0.47, -0.026, 0.45, -0.004, 6, 8.6, c, 0.9) + box(-0.47, -0.026, 0.45, -0.004, 13.4, 16, c, 0.9);
  [[-0.37, 17.6], [-0.12, 18.8], [0.13, 18], [0.37, 18.6]].forEach(([u, h]) => {
    s += planche(u, 0.052, 0, 0.026, 0, h, 4.4, c);
    for (const z of [7.3, 14.7]) for (const du of [-0.024, 0.024]) { const [x, y] = at(u + du, 0.026, z); s += E(x, y, 0.5, 0.5, '#5E4430', 0); }
  });
  const [ax, ay] = at(-0.38, 0.06), [bx, by] = at(0.12, 0.06), [cx, cy] = at(0.37, 0.07);
  return s + herbe(ax - 1, ay + 1, '#86B852', 0.7) + herbe(bx + 1.6, by + 1.4, '#94C25C', 0.6) + herbe(cx + 2, cy + 1, '#86B852', 0.55)
    + fleurette(bx - 3.4, by + 2.6, '#FFFFFF') + fleurette(ax + 5, ay + 3, '#F7B6C8');
} };
// Massif : bordure de pierres, terre, fleurs qui ondulent
C.massif = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.45, 0.12) + box(-0.38, -0.34, 0.38, 0.34, 0, 5, STONE) + face([[-0.34, -0.3, 5.2], [0.34, -0.3, 5.2], [0.34, 0.3, 5.2], [-0.34, 0.3, 5.2]], SOIL.top, 0.6);
  let k = 0;
  for (const dv of [-0.2, 0, 0.2]) for (const du of [-0.22, -0.07, 0.08, 0.23]) {
    const [x, y] = at(du + (k % 2) * 0.03, dv, 5.4);
    const sw = wave(f, 2, 1.4, k * 1.3);
    s += leafDot(x, y - 1.6, 2.8) + stem(x, y - 2, 7 + (k % 3), sw) + Dk.flower(x + sw, y - 9 - (k % 3), 1.8, FLOWERS[k % 5], '#F7E27A');
    k++;
  }
  return s;
} };
// Muret : moellons assisés, chaperon, mousse
C.muret = { n: 1, draw: () => {
  let s = shadow(0, 0, 0.42, 0.14) + box(-0.42, -0.1, 0.42, 0.1, 0, 15, STONE);
  for (const [z, off] of [[4, 0], [9.5, 0.1]]) for (let u = -0.42 + off; u < 0.4; u += 0.2) { const p = at(u, 0.1, z), q = at(Math.min(u + 0.2, 0.42), 0.1, z); s += `<path d="M${r2(p[0])},${r2(p[1])} L${r2(q[0])},${r2(q[1])} M${r2(q[0])},${r2(q[1])} l0,${-5.5 * 1.25}" stroke="${STONE.right}" stroke-width="0.7"/>`; }
  s += box(-0.44, -0.12, 0.44, 0.12, 15, 18, WHITE_STONE);
  const [mx, my] = at(-0.25, 0.05, 18.4);
  return s + E(mx, my, 5, 2, '#8FCB6A', 0.7) + E(mx + 18, my + 7, 3, 1.4, '#8FCB6A', 0.6) + Dk.flower(mx + 22, my + 5, 1.4, '#FFFFFF');
} };
// Lanterne : poteau de fer sur socle, lanterne vitrée, petit chapeau ; la flamme vacille
C.lanterne = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.26, 0.16) + box(-0.08, -0.08, 0.08, 0.08, 0, 5, STONE) + `<rect x="${x - 1.6}" y="${y - 44}" width="3.2" height="40" fill="${IRON.left}" stroke="${OUT}" stroke-width="0.9"/>`;
  s += glow(x, y - 52, 13 + f, '255,224,138', 0.3);
  s += poly([[x - 6, y - 46], [x + 6, y - 46], [x + 6.6, y - 58], [x - 6.6, y - 58]], '#FFE08A', 1) + `<path d="M${x},${y - 47} L${x},${y - 57} M${x - 6.2},${y - 52} L${x + 6.2},${y - 52}" stroke="${IRON.right}" stroke-width="0.8"/>`
    + flame(x, y - 48, 6 + f, 2.2, f * 0.5) + poly([[x - 8.6, y - 58], [x + 8.6, y - 58], [x, y - 65]], IRON.left, 1) + E(x, y - 66, 1.4, 1.4, IRON.top, 0.8);
  return s;
} };
// Banc : lattes, pieds sombres, un coussin
C.banc = { n: 1, draw: () => {
  const legs = [[-0.3, -0.07], [-0.3, 0.07], [0.3, -0.07], [0.3, 0.07]].map(([u, v]) => post(u, v, 0, 9, WOOD_DARK, 0.025)).join('');
  const back = box(-0.34, -0.11, 0.34, -0.08, 11, 23, WOOD);
  const seat = box(-0.34, -0.09, 0.34, 0.09, 9, 11.5, WOOD);
  const [cx, cy] = at(0.12, 0, 12);
  return shadow(0, 0, 0.42, 0.14) + back + legs + seat + E(cx, cy - 1.6, 7, 3, '#E8566A', 1) + E(cx - 2, cy - 2.6, 2.4, 1, '#F29AA8', 0);
} };
// Épouvantail : croix de bois, chemise rapiécée, chapeau de paille ; il penche au vent, un corbeau se pose
C.epouvantail = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  const tilt = f ? 4 : -2;
  let s = shadow(0, 0, 0.3, 0.14) + `<g transform="rotate(${tilt} ${x} ${y})">`;
  s += `<rect x="${x - 1.6}" y="${y - 50}" width="3.2" height="50" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.9"/>` + thick(`M${x - 17},${y - 34} L${x + 17},${y - 34}`, 2.6, WOOD_DARK.left);
  s += poly([[x - 11, y - 37], [x + 11, y - 37], [x + 9, y - 18], [x - 9, y - 18]], '#5C8FD0', 1) + `<rect x="${x + 1}" y="${y - 28}" width="5" height="5" fill="#E8566A" stroke="${OUT}" stroke-width="0.6"/>` + L([x, y - 37], [x, y - 18], '#3E6FA8', 0.6);
  s += thick(`M${x - 17},${y - 34} l-2,4 M${x + 17},${y - 34} l2,4`, 1, '#EBC46F');
  s += E(x, y - 44, 6.4, 6.6, '#F2DEB0', 1) + P(`M${x - 2.6},${y - 45} l1.2,1.2 m0,-1.2 l-1.2,1.2 M${x + 1.6},${y - 45} l1.2,1.2 m0,-1.2 l-1.2,1.2`, 'none', 0.6) + P(`M${x - 2.4},${y - 41.4} q2.4,1.6 4.8,0`, 'none', 0.6);
  s += E(x, y - 49.6, 11, 2.6, '#EBC46F', 1) + P(`M${x - 6},${y - 50} Q${x},${y - 60} ${x + 6},${y - 50} Z`, '#EBC46F', 1) + L([x - 6, y - 51], [x + 6, y - 51], '#E8566A', 1.2);
  s += '</g>';
  if (f) s += E(x + 16, y - 39, 3.2, 2.4, '#2E2E38', 0.8) + E(x + 18.6, y - 41.4, 1.8, 1.8, '#2E2E38', 0.8) + P(`M${x + 20.2},${y - 41.6} l2,0.6 l-2,0.6 Z`, '#5A5A64', 0.4) + E(x + 18.8, y - 42, 0.4, 0.4, '#FFFFFF', 0);
  return s;
} };
// Nichoir : maisonnette sur piquet, toit rouge, trou rond ; un oiseau entre et sort
C.nichoir = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.22, 0.14) + post(0, 0, 0, 30, WOOD_DARK, 0.03) + box(-0.11, -0.11, 0.11, 0.11, 30, 44, WOOD) + gable(-0.11, -0.11, 0.11, 0.11, 44, 10, ROOF_RED, 0.04);
  const [hx, hy] = at(0, 0.11, 39);
  s += E(hx - 4, hy - 1, 2.6, 2.6, '#3A2A24', 0.8) + L([hx - 4, hy + 2.6], [hx - 4, hy + 5], WOOD_DARK.right, 1);
  if (f) s += E(hx - 11, hy - 6, 3, 2.4, '#5C9CE0', 0.8) + E(hx - 9.6, hy - 5.4, 1.6, 1.2, '#FFE16A', 0) + E(hx - 9.4, hy - 7, 0.4, 0.4, '#2A2420', 0) + P(`M${hx - 8},${hy - 6.2} l1.6,0.4 l-1.6,0.4 Z`, '#3A3A44', 0.3);
  return s;
} };
// Girouette : mât de fer, croix des points cardinaux, coq de cuivre qui tourne (4 images)
C.girouette = { n: 4, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.22, 0.14) + box(-0.07, -0.07, 0.07, 0.07, 0, 4, STONE) + `<rect x="${x - 1.2}" y="${y - 52}" width="2.4" height="48" fill="${IRON.left}" stroke="${OUT}" stroke-width="0.8"/>`;
  s += thick(`M${x - 11},${y - 40} L${x + 11},${y - 40} M${x - 6},${y - 44} L${x + 6},${y - 36}`, 1, IRON.left);
  s += [['N', x - 6, y - 45], ['E', x + 12, y - 40], ['S', x + 6, y - 34], ['O', x - 13, y - 39]].map(([t, a, b]) => `<text x="${a}" y="${b}" font-family="sans-serif" font-size="4.4" font-weight="700" fill="${OUT}">${t}</text>`).join('');
  const sx = [1, 0.5, -1, -0.5][f];
  s += `<g transform="translate(${x} ${y - 54}) scale(${sx} 1)">` + P('M-7,0 L4,0 Q8,-1 7,-6 Q5,-9 3,-6 L2,-3 Q-2,-7 -6,-4 Z', COPPER.left, 0.9) + P('M3,-6 L4,-9.6 L6,-7 Z', '#E8483C', 0.6) + E(4.6, -5, 0.5, 0.5, OUT, 0) + P('M-7,0 L-10,-5 L-6,-3 Z', COPPER.right, 0.7) + '</g>';
  return s;
} };
// Fontaine : vasque ronde, colonne et coupe ; l'eau retombe en gouttes (3 images)
C.fontaine = { n: 3, draw: f => {
  let s = shadow(0, 0, 0.5, 0.14) + cylinder(0, 0, 0.42, 0, 7, STONE) + disc(0, 0, 0.36, 7, WATER, 0.8) + disc(-0.04, -0.04, 0.24, 7, WATER_LIGHT, 0);
  s += cylinder(0, 0, 0.06, 7, 22, WHITE_STONE, 0.9) + cylinder(0, 0, 0.18, 22, 25, STONE) + disc(0, 0, 0.14, 25, WATER_LIGHT, 0.6);
  const [x, y] = at(0, 0, 26);
  s += thick(`M${x},${y} L${x},${y - 7}`, 1.6, WATER_LIGHT) + E(x, y - 7.6, 1.6, 1.6, '#E8F6FF', 0.6);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU, p = ((f / 3) + i * 0.17) % 1;
    const dx = Math.cos(a) * (8 + p * 7), dy = Math.sin(a) * (4 + p * 3.5);
    s += E(x + dx, y + dy + p * 16, 0.9, 1.2, '#E8F6FF', 0.4);
  }
  return s;
} };
// Brasero : coupe de fer sur trois pieds, braises et flammes (3 images)
C.brasero = { n: 3, draw: f => {
  const [x, y] = at(0, 0, 16);
  let s = shadow(0, 0, 0.3, 0.16) + [[-0.12, 0.06], [0.12, 0.06], [0, -0.12]].map(([u, v]) => { const p = at(u, v, 0); return thick(`M${p[0]},${p[1]} L${r2(x + (p[0] - x) * 0.8)},${y + 1}`, 1.6, IRON.right); }).join('');
  s += glow(x, y - 10, 18, '255,170,90', 0.32) + `<path d="M${x - 13},${y - 2} Q${x},${y + 8} ${x + 13},${y - 2} Z" fill="${IRON.left}" stroke="${OUT}" stroke-width="1"/>` + E(x, y - 2, 13, 4, '#5A3A2A', 1);
  s += [[-6, -2.4], [0, -3.2], [6, -2], [-2, -1]].map(([dx, dy]) => E(x + dx, y + dy, 2.6, 1.4, '#E8573A', 0.6)).join('');
  s += flame(x - 4, y - 2, 13 + f * 2, 4, f / 3) + flame(x + 4, y - 2, 11 + (2 - f), 3.6, f / 3 + 0.4) + flame(x, y - 2, 17 - f, 4.4, f / 3 + 0.2);
  return s;
} };
// Pergola : quatre poteaux, poutres croisées, glycine mauve
C.pergola = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.5, 0.12);
  for (const [u, v] of [[-0.36, -0.36], [0.36, -0.36], [-0.36, 0.36], [0.36, 0.36]]) s += post(u, v, 0, 36, WOOD, 0.035);
  s += box(-0.42, -0.38, 0.42, -0.34, 36, 40, WOOD) + box(-0.42, 0.34, 0.42, 0.38, 36, 40, WOOD);
  for (const u of [-0.3, -0.1, 0.1, 0.3]) s += box(u - 0.02, -0.42, u + 0.02, 0.42, 40, 43, WOOD_DARK, 0.7);
  for (const [u, v] of [[-0.3, 0.36], [0, 0.36], [0.3, 0.36], [0.36, 0]]) {
    const [x, y] = at(u, v, 38);
    const sw = wave(f, 2, 1, u * 9);
    s += leafDot(x, y - 2, 4) + [0, 1, 2, 3].map(i => E(x + sw * (i / 3) + (i % 2 ? 1 : -1), y + 3 + i * 3.4, 2.4 - i * 0.3, 2 - i * 0.2, i % 2 ? '#B48AE0' : '#C9A8F0', 0.6)).join('');
  }
  const [lx, ly] = at(-0.36, 0.36, 0);
  return s + thick(`M${lx},${ly} q-2,-14 1,-30`, 1, '#4F8F3A');
} };
// Statue : socle mouluré, personnage drapé tenant un livre levé
C.statue = { n: 1, draw: () => {
  const [x, y] = at(0, 0, 14);
  let s = shadow(0, 0, 0.32, 0.16) + box(-0.16, -0.16, 0.16, 0.16, 0, 4, STONE) + box(-0.12, -0.12, 0.12, 0.12, 4, 14, WHITE_STONE);
  s += P(`M${x - 7},${y} Q${x - 9},${y - 18} ${x - 4},${y - 30} L${x + 4},${y - 30} Q${x + 9},${y - 18} ${x + 7},${y} Z`, WHITE_STONE.top, 1) + P(`M${x - 4},${y - 26} Q${x},${y - 14} ${x + 3},${y}`, 'none', 0.6) + P(`M${x + 2},${y - 28} Q${x + 5},${y - 16} ${x + 6},${y - 2}`, 'none', 0.5);
  s += E(x, y - 34, 4.6, 5, WHITE_STONE.top, 1) + P(`M${x - 4.6},${y - 35} Q${x},${y - 41} ${x + 4.6},${y - 35} Q${x},${y - 38} ${x - 4.6},${y - 35} Z`, WHITE_STONE.left, 0.6);
  s += thick(`M${x + 4},${y - 27} L${x + 9},${y - 38}`, 2.2, WHITE_STONE.top) + poly([[x + 6, y - 39], [x + 13, y - 41], [x + 13, y - 46], [x + 6, y - 44]], WHITE_STONE.top, 0.9) + L([x + 9.5, y - 40], [x + 9.5, y - 45], WHITE_STONE.right, 0.5);
  return s + E(x - 6, y + 1, 3, 1.2, '#8FCB6A', 0.6);
} };
// Arche fleurie : deux montants, cintre de feuilles et de roses qui frémissent
C.arche = { n: 2, draw: f => {
  // les deux montants face à nous (en travers de la case)
  let s = shadow(0, 0, 0.42, 0.12) + post(-0.26, 0.26, 0, 34, WOOD, 0.035) + post(0.26, -0.26, 0, 34, WOOD, 0.035);
  const a = at(-0.26, 0.26, 34), b = at(0.26, -0.26, 34);
  const arc = `M${a[0]},${a[1]} Q${r2((a[0] + b[0]) / 2)},${r2((a[1] + b[1]) / 2 - 24)} ${b[0]},${b[1]}`;
  s += thick(arc, 3, WOOD.left);
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ((a[0] + b[0]) / 2) + t * t * b[0], y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ((a[1] + b[1]) / 2 - 24) + t * t * b[1];
    s += leafDot(x + wave(f, 2, 0.6, i), y, 3.2) + (i % 2 ? Dk.flower(x + wave(f, 2, 0.6, i), y - 1, 1.5, i % 4 === 1 ? '#E8566A' : '#F7B6CE', '#F7E27A') : '');
  }
  for (const [u, v, k] of [[-0.26, 0.26, 0], [0.26, -0.26, 1]]) for (let z = 8; z < 34; z += 8) { const [x, y] = at(u, v, z); s += leafDot(x + (k ? 1.6 : -1.6), y, 2.4); }
  return s;
} };
// Étal du marché : table, cageots, auvent rayé qui ondule
C.etal = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.48, 0.14);
  for (const [u, v] of [[-0.34, -0.2], [0.34, -0.2], [-0.34, 0.2], [0.34, 0.2]]) s += post(u, v, 0, 12, WOOD_DARK, 0.025);
  s += box(-0.38, -0.24, 0.38, 0.24, 12, 15, WOOD);
  for (const [u, col] of [[-0.22, '#E2574C'], [0.02, '#F2994A'], [0.24, '#7EC45B']]) {
    s += box(u - 0.09, -0.14, u + 0.09, 0.08, 15, 21, WOOD_DARK, 0.7);
    for (let k = 0; k < 3; k++) { const [x, y] = at(u - 0.04 + k * 0.04, -0.03, 22); s += E(x, y, 2.4, 2.2, col, 0.7); }
  }
  for (const [u, v] of [[-0.34, -0.24], [0.34, -0.24]]) s += post(u, v, 15, 38, WOOD_DARK, 0.02);
  const fl = wave(f, 2, 1.4);
  const p0 = at(-0.42, -0.3, 38), p1 = at(0.42, -0.3, 38), p2 = at(0.42, 0.26, 30), p3 = at(-0.42, 0.26, 30);
  s += poly([p0, p1, p2, p3], '#FFFFFF', 1);
  for (let i = 0; i < 4; i++) { const t0 = i / 4 + 0.0625, t1 = t0 + 0.125; const q = (A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]; s += `<polygon points="${[q(p0, p1, t0), q(p0, p1, t1), q(p3, p2, t1), q(p3, p2, t0)].map(p => p.map(r2).join(',')).join(' ')}" fill="#E8566A"/>`; }
  for (let i = 0; i <= 8; i++) { const t = i / 8; const x = p3[0] + (p2[0] - p3[0]) * t, y = p3[1] + (p2[1] - p3[1]) * t; s += E(x, y + 2 + (i % 2 ? fl : -fl) * 0.4, 2.6, 2.2, i % 2 ? '#E8566A' : '#FFFFFF', 0.7); }
  return s;
} };
// Kiosque : estrade ronde, colonnettes, toit conique bleu, fanion
C.kiosque = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.5, 0.12) + cylinder(0, 0, 0.44, 0, 5, STONE);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + 0.3; const u = Math.cos(a) * 0.32, v = Math.sin(a) * 0.32; if (v < 0.05) s += post(u, v, 5, 32, WHITE_STONE, 0.022); }
  s += E(...at(0, 0, 5.2), 0, 0, 'none', 0) + disc(0, 0, 0.36, 5.2, '#E8D2A8', 0.6);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + 0.3; const u = Math.cos(a) * 0.32, v = Math.sin(a) * 0.32; if (v >= 0.05) s += post(u, v, 5, 32, WHITE_STONE, 0.022); }
  const [x, y] = at(0, 0, 32);
  s += `<path d="M${x - 30},${y + 2} L${x},${y - 22} L${x + 30},${y + 2} Q${x},${y + 14} ${x - 30},${y + 2} Z" fill="#5C8FD0" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/><path d="M${x},${y - 22} L${x + 30},${y + 2} Q${x + 15},${y + 9} ${x + 6},${y + 10} Z" fill="#3E6FA8"/>`;
  s += L([x, y - 22], [x, y - 32], IRON.right, 1.2) + P(`M${x},${y - 32} L${x + 9 + f * 1.6},${y - 30 + f} L${x},${y - 27} Z`, '#E8566A', 0.8);
  return s;
} };
// Cadran solaire : colonne, table des heures, style de bronze ; l'ombre tourne (2 images)
C.cadran = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.34, 0.16) + box(-0.14, -0.14, 0.14, 0.14, 0, 3, STONE) + cylinder(0, 0, 0.08, 3, 18, WHITE_STONE, 0.9) + cylinder(0, 0, 0.28, 18, 21, WHITE_STONE);
  const [x, y] = at(0, 0, 21);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; s += L([x + Math.cos(a) * 12, y + Math.sin(a) * 6], [x + Math.cos(a) * 14.6, y + Math.sin(a) * 7.2], '#8A8070', 0.7); }
  const sa = f ? 0.9 : -0.2;
  s += `<path d="M${x},${y} L${r2(x + Math.cos(sa) * 12)},${r2(y + Math.sin(sa) * 6)}" stroke="rgba(60,40,25,.35)" stroke-width="2" stroke-linecap="round"/>`;
  return s + poly([[x - 1, y], [x + 1, y], [x - 6, y - 9]], BRASS.left, 0.9);
} };
// Bassin : margelle, eau claire, nénuphars, poisson rouge ; des ronds dans l'eau (2 images)
C.bassin = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.5, 0.1) + box(-0.42, -0.36, 0.42, 0.36, 0, 5, STONE) + face([[-0.36, -0.3, 5], [0.36, -0.3, 5], [0.36, 0.3, 5], [-0.36, 0.3, 5]], WATER, 0.7) + face([[-0.36, -0.3, 5], [0.1, -0.3, 5], [-0.36, 0.06, 5]], WATER_LIGHT, 0);
  const [x, y] = at(0.05, 0.05, 5);
  s += [[-14, 2, 30], [10, -4, -20]].map(([dx, dy, r]) => `<g transform="translate(${x + dx} ${y + dy}) rotate(${r})">${P('M0,0 L4.4,-1.4 A4.6,2.4 0 1,1 4,1.4 Z', '#7EC45B', 0.8)}</g>`).join('') + Dk.flower(x + 12, y - 5, 1.4, '#F7B6CE', '#F2C94C');
  const fx = f ? 4 : -4;
  s += `<g transform="translate(${x + fx} ${y + 4}) scale(${f ? -1 : 1} 1)">${P('M-2,0 L-4,-1.6 L-3.6,0 L-4,1.6 Z', '#F08A3A', 0.5)}${E(0, 0, 2.6, 1.4, '#F6A04A', 0.6)}</g>`;
  s += E(x - 4 + f * 8, y - 2, 3 + f, 1.4 + f * 0.5, 'none', 0.5).replace(/stroke="[^"]+"/, 'stroke="#E8F6FF"');
  return s;
} };
// Longue-vue : trépied, lunette de laiton pointée vers le large ; un éclat glisse (2 images)
C.longuevue = { n: 2, draw: f => {
  const [x, y] = at(0, 0, 26);
  let s = shadow(0, 0, 0.3, 0.14) + [[-0.16, 0.1], [0.16, 0.1], [0, -0.16]].map(([u, v]) => { const p = at(u, v, 0); return thick(`M${p[0]},${p[1]} L${x},${y}`, 1.4, WOOD_DARK.left); }).join('');
  s += `<g transform="translate(${x} ${y}) rotate(-18)">` + `<rect x="-12" y="-2.6" width="24" height="5.2" rx="1.4" fill="${BRASS.left}" stroke="${OUT}" stroke-width="1"/>` + `<rect x="10" y="-3.6" width="4.6" height="7.2" rx="1" fill="${BRASS.right}" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="-16" y="-1.8" width="4.4" height="3.6" rx="0.8" fill="${BRASS.right}" stroke="${OUT}" stroke-width="0.8"/>` + `<rect x="${f ? 2 : -8}" y="-2" width="3" height="1.2" rx="0.6" fill="#FFFFFF" opacity="0.85"/>` + '</g>';
  return s + E(x, y, 1.6, 1.6, IRON.left, 0.7);
} };

// ——— Créations de climat ———
C.igloo = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  // dôme de blocs de neige : ombre en croissant à droite (découpée dans le dôme), joints des blocs, un seul trait autour
  const dome = `M${x - 30},${y} Q${x - 31},${y - 34} ${x},${y - 37} Q${x + 31},${y - 34} ${x + 30},${y} Q${x},${y + 9} ${x - 30},${y} Z`;
  const id = `igloo-dome-${f}`;
  let s = shadow(0, 0, 0.5, 0.12) + `<defs><clipPath id="${id}"><path d="${dome}"/></clipPath></defs>`
    + `<path d="${dome}" fill="${ICE.right}"/>`
    + `<g clip-path="url(#${id})"><path d="${dome}" fill="${ICE.left}" transform="translate(-4 -2)"/><path d="${dome}" fill="${ICE.top}" transform="translate(-9 -4)"/>`;
  const rows = [-8, -17, -26];
  for (const yy of rows) s += `<path d="M${x - 32},${y + yy + 2} Q${x},${y + yy + 7} ${x + 32},${y + yy + 2}" fill="none" stroke="#9FC9E2" stroke-width="0.8"/>`;
  [[-20, -4], [-6, -3], [8, -3], [22, -4], [-14, -13], [2, -12], [16, -13], [-6, -22], [10, -22]].forEach(([dx, dy]) => { s += `<path d="M${x + dx},${y + dy} l0.6,-6" stroke="#9FC9E2" stroke-width="0.8"/>`; });
  s += `</g><path d="${dome}" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
  // entrée en tunnel, lueur dorée la nuit (image 2)
  s += `<path d="M${x - 13},${y + 5} L${x - 13},${y - 8} Q${x - 4},${y - 17} ${x + 5},${y - 8} L${x + 5},${y + 7} Q${x - 4},${y + 9} ${x - 13},${y + 5} Z" fill="${ICE.top}" stroke="${OUT}" stroke-width="1"/>`
    + `<path d="M${x + 5},${y - 8} L${x + 5},${y + 7} L${x + 1},${y + 7.4} L${x + 1},${y - 9} Z" fill="${ICE.left}"/>`;
  s += `<path d="M${x - 9},${y + 5.5} L${x - 9},${y - 6} Q${x - 4},${y - 11} ${x + 1},${y - 6} L${x + 1},${y + 6.5} Z" fill="${f ? '#FFD27A' : '#3A4A5A'}" stroke="${OUT}" stroke-width="0.8"/>` + (f ? glow(x - 4, y - 1, 12, '255,210,120', 0.35) : '');
  return s;
} };
C.sculpture = { n: 2, draw: f => {
  const [x, y] = at(0, 0, 10);
  let s = shadow(0, 0, 0.34, 0.12) + box(-0.18, -0.18, 0.18, 0.18, 0, 10, ICE);
  s += P(`M${x - 10},${y - 2} Q${x - 12},${y - 12} ${x - 2},${y - 12} Q${x + 8},${y - 12} ${x + 10},${y - 4} Q${x},${y + 2} ${x - 10},${y - 2} Z`, '#E9F8FF', 1)
    + thick(`M${x + 4},${y - 10} Q${x + 10},${y - 18} ${x + 6},${y - 26} Q${x + 3},${y - 30} ${x + 7},${y - 31}`, 2.6, '#E9F8FF') + P(`M${x + 7},${y - 31} l4,0.8 l-4,0.8 Z`, '#BFE7F7', 0.6)
    + P(`M${x - 8},${y - 6} Q${x - 4},${y - 16} ${x + 4},${y - 10}`, 'none', 0.6);
  if (f) s += [[x - 10, y - 16], [x + 12, y - 22], [x + 2, y - 6]].map(([a, b]) => P(`M${a},${b - 2.4} L${a + 0.6},${b - 0.6} L${a + 2.4},${b} L${a + 0.6},${b + 0.6} L${a},${b + 2.4} L${a - 0.6},${b + 0.6} L${a - 2.4},${b} L${a - 0.6},${b - 0.6} Z`, '#FFFFFF', 0.4)).join('');
  return s;
} };
C.parc = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.5, 0.1) + disc(0, 0, 0.44, 0, '#A8D878', 0.6);
  const ring = [];
  for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU; ring.push([Math.cos(a) * 0.42, Math.sin(a) * 0.42]); }
  const back = ring.filter(([, v]) => v < 0), front = ring.filter(([, v]) => v >= 0);
  s += back.map(([u, v]) => post(u, v, 0, 12, WOOD, 0.025)).join('');
  const sheep = (u, v, flip, graze) => { const [x, y] = at(u, v); return `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">${[[-4, -6], [0, -7.6], [4, -6], [-2, -4], [2, -4]].map(([a, b]) => E(a, b, 3, 2.8, '#F8F4EC', 0.9)).join('')}${E(6.4, graze ? -3 : -6, 2.4, 2, '#5E5660', 0.9)}${E(7, graze ? -3.4 : -6.4, 0.4, 0.4, '#FFFFFF', 0)}${L([-3, -2], [-3, 0], '#5E5660', 1.4)}${L([3, -2], [3, 0], '#5E5660', 1.4)}</g>`; };
  s += sheep(-0.12, -0.06, false, f === 0) + sheep(0.14, 0.12, true, f === 1);
  s += front.map(([u, v]) => post(u, v, 0, 12, WOOD, 0.025)).join('');
  for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; if (a[1] >= 0 || b[1] >= 0) s += rail(a, b, 9, 1.6, WOOD.left); }
  return s;
} };
C.cairn = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.32, 0.14);
  const [x, y] = at(0, 0);
  const stones = [[0, 0, 13, 6], [1, -7, 10, 5], [-1, -13, 8, 4.4], [1, -18.4, 6, 3.6], [0, -22.6, 4, 2.8]];
  for (const [dx, dy, rx, ry] of stones) s += E(x + dx, y + dy - ry * 0.4, rx, ry, GRANITE.left, 1) + E(x + dx - rx * 0.25, y + dy - ry * 0.8, rx * 0.55, ry * 0.4, GRANITE.top, 0);
  const cols = ['#E8566A', '#F2C04B', '#5C8FD0'];
  cols.forEach((c, i) => { const yy = y - 9 - i * 5, sw = wave(f, 2, 3, i); s += thick(`M${x + 6},${yy} q6,${-2 + sw * 0.3} 12,${sw}`, 1.4, c); });
  return s;
} };
C.passerelle = { n: 2, draw: f => {
  let s = disc(0, 0, 0.5, 0, '#8FC8A8', 0.6) + disc(-0.05, 0, 0.36, 0, '#A8D8C0', 0);
  for (const [u, v] of [[-0.34, -0.14], [-0.34, 0.14], [0.34, -0.14], [0.34, 0.14]]) s += post(u, v, -2, 9, WOOD_DARK, 0.022);
  s += box(-0.42, -0.16, 0.42, 0.16, 9, 11, REED);
  for (let u = -0.38; u < 0.42; u += 0.08) { const a = at(u, -0.16, 11), b = at(u, 0.16, 11); s += L(a, b, REED.right, 0.6); }
  const [dx, dy] = at(0.2 - f * 0.3, -0.3, 26);
  s += `<g transform="translate(${dx} ${dy})">${L([-5, 0], [5, 0], '#3E8FA0', 1.4)}${E(-1, -1.6, 3.6, 1, '#D8EEF6', 0.4)}${E(-1, 1.6, 3.6, 1, '#D8EEF6', 0.4)}${E(4.6, 0, 1.2, 1.2, '#3E8FA0', 0.4)}</g>`;
  return s;
} };
C.heron = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.3, 0.12) + disc(0, 0, 0.3, 0, '#8FC8E0', 0.7) + `<rect x="${x - 0.8}" y="${y - 22}" width="1.6" height="22" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.6"/>`;
  s += E(x, y - 28, 9, 6, WOOD.left, 1) + P(`M${x - 8},${y - 27} L${x - 16},${y - 22} L${x - 7},${y - 24} Z`, WOOD_DARK.left, 0.8);
  const hy = f ? y - 40 : y - 44;
  s += thick(`M${x + 5},${y - 32} Q${x + 10},${y - 38} ${x + 5},${hy}`, 2.6, WOOD.left) + E(x + 6, hy - 1, 3.4, 3, WOOD.left, 1) + P(`M${x + 9},${hy - 1} L${x + 18},${hy + (f ? 4 : 1)} L${x + 9},${hy + 1} Z`, WOOD_DARK.left, 0.8) + E(x + 7, hy - 2, 0.6, 0.6, OUT, 0);
  return s;
} };
C.tente = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.5, 0.12) + ellipseAt(0.1, 0.25, 0, 14, 5, '#C8503A', 0.8) + ellipseAt(0.1, 0.25, 0, 10, 3.4, '#F2C04B', 0);
  const t = `M${x - 30},${y + 2} L${x - 4},${y - 40} L${x + 30},${y} Q${x},${y + 10} ${x - 30},${y + 2} Z`;
  s += `<path d="${t}" fill="#F4E6CC" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
  s += `<defs><clipPath id="tn${f}"><path d="${t}"/></clipPath></defs><g clip-path="url(#tn${f})">${[-20, -8, 4, 16].map(dx => `<path d="M${x + dx},${y + 10} L${x - 4 + dx * 0.2},${y - 40}" stroke="#C8503A" stroke-width="4"/>`).join('')}<path d="M${x - 4},${y - 40} L${x + 30},${y} L${x},${y + 10} Z" fill="rgba(60,40,25,.15)"/></g>`;
  s += `<path d="M${x - 4},${y - 22} L${x - 12 - f * 3},${y + 4} L${x + 2},${y + 6} Z" fill="#E8D4B0" stroke="${OUT}" stroke-width="0.9"/>` + L([x - 4, y - 40], [x - 4, y - 46], WOOD_DARK.left, 1.4);
  const [jx, jy] = at(0.36, 0.18, 0);
  return s + P(`M${jx - 3},${jy} Q${jx - 5},${jy - 6} ${jx - 2},${jy - 9} L${jx + 2},${jy - 9} Q${jx + 5},${jy - 6} ${jx + 3},${jy} Z`, '#D9824A', 0.9);
} };
C.cadransel = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.42, 0.1) + cylinder(0, 0, 0.36, 0, 4, { top: '#FBF8F1', left: '#E7E1D3', right: '#C9C0AC' });
  const [x, y] = at(0, 0, 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; s += L([x + Math.cos(a) * 16, y + Math.sin(a) * 8], [x + Math.cos(a) * 19, y + Math.sin(a) * 9.6], '#B8AC98', 0.8); }
  const sa = f ? 1 : 0;
  s += `<path d="M${x},${y} L${r2(x + Math.cos(sa) * 16)},${r2(y + Math.sin(sa) * 8)}" stroke="rgba(60,40,25,.3)" stroke-width="2.4" stroke-linecap="round"/>`;
  return s + poly([[x - 1.6, y], [x + 1.6, y], [x - 3, y - 16]], SANDSTONE.left, 1);
} };
C.hamac = { n: 2, draw: f => {
  const a = at(-0.28, 0.28, 26), b = at(0.28, -0.28, 26);
  let s = shadow(0, 0, 0.45, 0.12) + post(-0.28, 0.28, 0, 30, WOOD, 0.04) + post(0.28, -0.28, 0, 30, WOOD, 0.04);
  for (const [u, v] of [[-0.28, 0.28], [0.28, -0.28]]) { const [x, y] = at(u, v, 30); s += P(`M${x - 3},${y} L${x},${y - 5} L${x + 3},${y} Z`, '#E8566A', 0.8); }
  const sag = 12 + (f ? 2 : 0), mid = [(a[0] + b[0]) / 2 + (f ? 2 : -2), (a[1] + b[1]) / 2 + sag];
  s += `<path d="M${a[0]},${a[1]} Q${mid[0]},${mid[1] + 6} ${b[0]},${b[1]} Q${mid[0]},${mid[1] - 2} ${a[0]},${a[1]} Z" fill="#F2C04B" stroke="${OUT}" stroke-width="1"/>`;
  s += [-10, -3, 4, 11].map(dx => P(`M${mid[0] + dx},${mid[1] - 6} q1,4 0,8`, 'none', 0).replace('stroke="none"', 'stroke="#E8566A" stroke-width="1.2"')).join('');
  return s + E(mid[0] + 3, mid[1] - 4, 2.6, 2.2, '#F2994A', 0.8) + L([mid[0] + 3, mid[1] - 6], [mid[0] + 4, mid[1] - 8], '#4F8F3A', 0.8);
} };
C.totem = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.26, 0.14);
  const faces = [[0, '#D9824A', '#E8566A'], [-14, '#5C8FD0', '#F2C04B'], [-28, '#7EC45B', '#E8566A']];
  for (const [dy, c1, c2] of faces) {
    s += `<rect x="${x - 8}" y="${y + dy - 14}" width="16" height="14" rx="2" fill="${c1}" stroke="${OUT}" stroke-width="1"/>` + E(x - 3.4, y + dy - 9, 2, 2, '#FFFFFF', 0.6) + E(x + 3.4, y + dy - 9, 2, 2, '#FFFFFF', 0.6) + E(x - 3.4, y + dy - 9, 0.9, 0.9, OUT, 0) + E(x + 3.4, y + dy - 9, 0.9, 0.9, OUT, 0) + `<rect x="${x - 3.6}" y="${y + dy - 5}" width="7.2" height="2.6" rx="1" fill="${c2}" stroke="${OUT}" stroke-width="0.6"/>`;
  }
  const flap = f ? -2 : 0;
  return s + P(`M${x - 8},${y - 38} L${x - 20},${y - 44 + flap} L${x - 16},${y - 36} Z`, '#F2C04B', 0.9) + P(`M${x + 8},${y - 38} L${x + 20},${y - 44 + flap} L${x + 16},${y - 36} Z`, '#F2C04B', 0.9) + P(`M${x - 4},${y - 42} L${x},${y - 48} L${x + 4},${y - 42} Z`, '#E8566A', 0.8);
} };
C.obelisque = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.3, 0.16) + box(-0.14, -0.14, 0.14, 0.14, 0, 4, OBSIDIAN);
  s += poly([[x - 7, y - 3], [x - 4.4, y - 46], [x, y - 54], [x + 4.4, y - 46], [x + 7, y - 3], [x, y + 1]], OBSIDIAN.left, 1.1) + poly([[x, y - 54], [x + 4.4, y - 46], [x + 7, y - 3], [x, y + 1]], OBSIDIAN.right, 0);
  s += P(`M${x - 4},${y - 40} Q${x - 3},${y - 30} ${x - 4.6},${y - 12}`, 'none', 0).replace('stroke="none"', 'stroke="#6E6480" stroke-width="0.8"');
  const g = f ? '#FF8A4A' : '#E8573A';
  s += [[-2, -36], [-2.4, -28], [-2, -20], [-2.6, -12]].map(([dx, dy], i) => `<path d="M${x + dx},${y + dy} l2,-2 l-1,-1.4 M${x + dx + 0.6},${y + dy + 2} l1.4,0" stroke="${g}" stroke-width="0.9" stroke-linecap="round"/>`).join('');
  return s + (f ? glow(x - 1, y - 24, 12, '255,120,60', 0.22) : '');
} };
C.bassinchaud = { n: 3, draw: f => {
  let s = shadow(0, 0, 0.5, 0.1) + disc(0, 0, 0.42, 0, OBSIDIAN.left, 1) + disc(0, 0, 0.32, 1, '#5FD0C8', 0.8) + disc(-0.05, -0.04, 0.2, 1, '#9AE8E0', 0);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; const [x, y] = at(Math.cos(a) * 0.38, Math.sin(a) * 0.38, 1); s += E(x, y - 1.6, 4, 2.6, OBSIDIAN.top, 0.9); }
  const [x, y] = at(0, 0, 2);
  for (let i = 0; i < 3; i++) { const p = ((f / 3) + i / 3) % 1; s += thick(`M${x - 8 + i * 8},${y - 2 - p * 20} q-3,-4 0,-8 q3,-4 0,-8`, 1.4, '#FFFFFF').replace(/stroke="#FFFFFF"/, `stroke="#FFFFFF" opacity="${r2(1 - p)}"`).replace(/stroke="#3C2819"/, `stroke="#3C2819" opacity="${r2((1 - p) * 0.4)}"`); }
  return s;
} };

module.exports = { C };
