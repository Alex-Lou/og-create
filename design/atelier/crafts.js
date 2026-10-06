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
// Massif : un parterre surélevé, son muret appareillé et ses pierres de bordure, la terre ; tulipes, marguerites et
// pompons sur leurs feuilles, qui ondulent (2 images)
const TERRE = { top: '#7E5233', grain: '#5E3A22' };
const feuille = (x, y, a, col = '#6FB24E') => `<path d="M0,0 Q-2.4,-1.2 -3.4,-3.6 Q-0.6,-3.2 0,0 Z" fill="${col}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`;
const pierreBord = (x, y) => E(x, y, 2.5, 1.35, STONE.left, 0.7) + E(x - 0.5, y - 0.35, 1.5, 0.7, STONE.top, 0);
// la tête d'une fleur du massif : 0 tulipe (coupe à trois pétales), 1 marguerite, 2 pompon
function teteMassif(x, y, k) {
  const sorte = k % 3, col = ['#E8566A', '#F7B6C8', '#F2C04B', '#B48AE0', '#F08A3A'][k % 5];
  if (sorte === 0) return P(`M${r2(x - 2.4)},${r2(y)} Q${r2(x - 2.8)},${r2(y - 3.6)} ${r2(x - 1.2)},${r2(y - 4)} L${r2(x)},${r2(y - 2.6)} L${r2(x + 1.2)},${r2(y - 4)} Q${r2(x + 2.8)},${r2(y - 3.6)} ${r2(x + 2.4)},${r2(y)} Q${r2(x)},${r2(y + 1.2)} ${r2(x - 2.4)},${r2(y)} Z`, col, 0.8)
    + E(x - 1, y - 2.2, 0.5, 1, '#FFFFFF', 0).replace('/>', ' opacity="0.5"/>');
  if (sorte === 1) return fleurette(x, y - 1.4, k % 2 ? '#FFFFFF' : '#F7B6C8');
  return E(x, y - 1.6, 2.4, 2.2, col, 0.8) + [[-1, -0.6], [0.8, -0.8], [0, 0.6], [-0.2, -1.6]].map(([dx, dy]) => E(x + dx, y - 1.6 + dy, 0.45, 0.45, '#FFFFFF', 0).replace('/>', ' opacity="0.45"/>')).join('');
}
C.massif = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.47, 0.12) + box(-0.38, -0.34, 0.38, 0.34, 0, 4.6, STONE);
  // les joints du muret, sur ses deux faces visibles
  for (const u of [-0.26, -0.06, 0.14, 0.32]) s += L(at(u, 0.34, 0.4), at(u, 0.34, 4.2), STONE.right, 0.6);
  for (const v of [-0.18, 0.02, 0.22]) s += L(at(0.38, v, 0.4), at(0.38, v, 4.2), STONE.right, 0.6);
  s += L(at(-0.38, 0.34, 2.3), at(0.38, 0.34, 2.3), STONE.right, 0.5) + L(at(0.38, -0.34, 2.3), at(0.38, 0.34, 2.3), STONE.right, 0.5);
  s += face([[-0.34, -0.3, 4.8], [0.34, -0.3, 4.8], [0.34, 0.3, 4.8], [-0.34, 0.3, 4.8]], TERRE.top, 0.6);
  for (const [du, dv] of [[-0.25, -0.1], [0.05, 0.18], [0.22, -0.2], [-0.1, 0.24], [0.28, 0.1]]) { const [x, y] = at(du, dv, 4.8); s += E(x, y, 0.8, 0.4, TERRE.grain, 0); }
  // les pierres de bordure du fond, puis les plantes rang par rang, puis la bordure de devant
  const bord = (fond) => {
    let o = '';
    for (let i = 0; i <= 7; i++) { const u = -0.36 + i * 0.103; o += pierreBord(...at(u, fond ? -0.33 : 0.33, 4.8)); }
    for (let i = 1; i <= 5; i++) { const v = -0.33 + i * 0.11; o += pierreBord(...at(fond ? -0.37 : 0.37, v, 4.8)); }
    return o;
  };
  s += bord(true);
  let k = 0;
  for (const dv of [-0.2, 0, 0.2]) for (const du of [-0.22, -0.07, 0.08, 0.23]) {
    const [x, y] = at(du + (k % 2) * 0.03, dv, 5);
    const sw = wave(f, 2, 1.2, k * 1.3), h = 5 + (k % 3) * 1;
    s += leafDot(x - 2.4, y - 0.6, 2.6) + leafDot(x + 2.2, y - 0.4, 2.4) + leafDot(x, y - 1.8, 2.8)
      + thick(`M${r2(x)},${r2(y - 2)} q${r2(sw * 0.2)},${r2(-h * 0.5)} ${r2(sw)},${r2(-h)}`, 0.7, '#5DAA45')
      + feuille(x + sw * 0.5, y - 2 - h * 0.45, -24 - (k % 2) * 10) + teteMassif(x + sw, y - 2 - h, k);
    k++;
  }
  return s + bord(false);
} };
// Muret : un mur de pierres sèches, moellons posés un à un sur trois assises, son chaperon de dalles ; la mousse s'y
// installe, une fleurette, une touffe au pied
const MOELLONS = ['#CFC7B4', '#C3BBA9', '#BBB29E', '#D6CFBE'];
// une pierre du parement : un quadrilatère de la face avant (v fixe) ou du bout (u fixe), un peu en retrait des joints
function moellon(a, b, z0, z1, face, fixe, col) {
  const p = face === 'avant' ? [[a, fixe, z0], [b, fixe, z0], [b, fixe, z1], [a, fixe, z1]] : [[fixe, a, z0], [fixe, b, z0], [fixe, b, z1], [fixe, a, z1]];
  const q = p.map(([u, v, z], i) => face === 'avant' ? [u + (i === 0 || i === 3 ? 0.008 : -0.008), v, z + (i < 2 ? 0.5 : -0.5)] : [u, v + (i === 0 || i === 3 ? 0.008 : -0.008), z + (i < 2 ? 0.5 : -0.5)]);
  return poly(q.map(r => at(...r)), col, 0.6) + L(at(...q[3]), at(...q[2]), '#FFFFFF', 0.5).replace('/>', ' opacity="0.5"/>');
}
C.muret = { n: 1, draw: () => {
  let s = shadow(0, 0, 0.44, 0.14) + box(-0.42, -0.1, 0.42, 0.1, 0, 15, { top: STONE.top, left: '#9E9584', right: '#857C6B' });
  const assises = [[0, 5, [-0.42, -0.2, 0.02, 0.22, 0.42]], [5, 10, [-0.42, -0.3, -0.08, 0.12, 0.3, 0.42]], [10, 15, [-0.42, -0.18, 0.06, 0.26, 0.42]]];
  assises.forEach(([z0, z1, us], r) => us.slice(1).forEach((b, i) => { s += moellon(us[i], b, z0, z1, 'avant', 0.1, MOELLONS[(i + r) % 4]); }));
  [[0, 5, [-0.1, 0.02, 0.1]], [5, 10, [-0.1, -0.03, 0.1]], [10, 15, [-0.1, 0.04, 0.1]]].forEach(([z0, z1, vs], r) => vs.slice(1).forEach((b, i) => { s += moellon(vs[i], b, z0, z1, 'bout', 0.42, ['#A9A08D', '#9E9584'][(i + r) % 2]); }));
  // le chaperon : trois dalles un peu débordantes
  for (const [a, b] of [[-0.45, -0.15], [-0.15, 0.15], [0.15, 0.45]]) s += box(a, -0.125, b, 0.125, 15, 18.2, WHITE_STONE, 0.9);
  const [m1x, m1y] = at(-0.3, 0.02, 18.2), [m2x, m2y] = at(0.2, 0.06, 18.2), [px, py] = at(0.28, 0.13, 0);
  // la mousse : des coussinets bosselés, plus clairs dessus, quelques brins qui pendent du chaperon
  const coussin = (x, y, n) => {
    const bosses = [[-3.2, 0.2, 1.8], [-1, -0.6, 2.2], [1.4, -0.2, 2], [3.2, 0.4, 1.5]].slice(0, n);
    return bosses.map(([dx, dy, r]) => E(x + dx, y + dy, r + 0.7, r * 0.62 + 0.6, OUT, 0)).join('') + bosses.map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.62, '#86C25A', 0)).join('')
      + bosses.map(([dx, dy, r]) => E(x + dx - r * 0.25, y + dy - r * 0.2, r * 0.5, r * 0.28, '#B5DC86', 0)).join('');
  };
  const brins = [[-0.36, 0.125], [-0.27, 0.125]].map(([u, v]) => { const [x, y] = at(u, v, 15.4); return thick(`M${r2(x)},${r2(y)} q0.4,2.2 -0.3,3.6`, 0.45, '#86C25A'); }).join('');
  return s + brins + coussin(m1x, m1y, 4) + coussin(m2x, m2y, 2) + fleurette(m2x + 1, m2y - 1.8, '#FFFFFF') + herbe(px, py, '#86B852', 0.7);
} };
// Lanterne : socle de pierre à deux degrés, poteau de fer et sa bague, la lanterne vitrée et son chapeau ; la flamme
// vacille (2 images). La flamme reste à z 41 : la lumière de nuit du jeu y est calée (creations.js, ART_LIGHTS)
const FER_LANTERNE = { light: '#6E757E', mid: '#474D55', dark: '#2E3238' };
C.lanterne = { n: 2, draw: f => {
  const [x, y] = at(0, 0), c = FER_LANTERNE;
  let s = shadow(0, 0, 0.26, 0.16) + box(-0.095, -0.095, 0.095, 0.095, 0, 3.4, STONE) + box(-0.066, -0.066, 0.066, 0.066, 3.4, 6.2, STONE);
  const [mx, my] = at(-0.07, 0.09, 3.4);
  s += E(mx + 1.2, my - 0.4, 2.6, 1, '#8FCB6A', 0.6);
  // le poteau : pied évasé, fût éclairé à gauche, bague à mi-hauteur
  s += `<path d="M${x - 3.2},${y - 7.6} Q${x - 2.2},${y - 10} ${x - 1.7},${y - 12} L${x + 1.7},${y - 12} Q${x + 2.2},${y - 10} ${x + 3.2},${y - 7.6} Z" fill="${c.mid}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + `<rect x="${x - 1.7}" y="${y - 45}" width="3.4" height="33.4" fill="${c.mid}" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="${x + 0.4}" y="${y - 44.6}" width="1" height="32.6" fill="${c.dark}"/><rect x="${x - 1.2}" y="${y - 44.6}" width="0.8" height="32.6" fill="${c.light}"/>`
    + E(x, y - 29, 2.6, 1.2, c.mid, 0.8) + E(x - 0.8, y - 29.4, 1, 0.4, c.light, 0);
  // la lueur, le plateau, les vitres et leurs croisillons, la flamme, le chapeau et son bouton
  s += glow(x, y - 52, 13 + f, '255,224,138', 0.3)
    + `<path d="M${x - 6.2},${y - 45} L${x + 6.2},${y - 45} L${x + 5},${y - 43.4} L${x - 5},${y - 43.4} Z" fill="${c.mid}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + poly([[x - 5.2, y - 45], [x + 5.2, y - 45], [x + 5.8, y - 57.4], [x - 5.8, y - 57.4]], '#FFE27A', 1)
    + flame(x, y - 46.6, 8.4 + f, 2.6, f * 0.5)
    + `<path d="M${x},${y - 45.4} L${x},${y - 57} M${x - 5.5},${y - 51.4} L${x + 5.5},${y - 51.4}" stroke="${c.mid}" stroke-width="0.7"/>`
    + `<path d="M${x - 4.4},${y - 46.4} L${x - 3},${y - 55.6}" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>`
    + poly([[x - 7.8, y - 57.4], [x + 7.8, y - 57.4], [x + 3, y - 62.2], [x - 3, y - 62.2]], c.mid, 1)
    + poly([[x + 0.8, y - 57.4], [x + 7.8, y - 57.4], [x + 3, y - 62.2], [x + 0.6, y - 62.2]], c.dark, 0)
    + E(x, y - 63.6, 1.6, 1.5, c.mid, 0.8) + E(x - 0.5, y - 64, 0.5, 0.45, c.light, 0);
  return s;
} };
// Banc : un banc de jardin à lattes, dossier à trois lattes, accoudoirs ; un coussin rouge piqué, son petit cœur
const BOIS_BANC = { lattes: { top: '#EBBE84', left: '#CB9259', right: '#A0683B' }, pieds: { top: '#A9703F', left: '#8B5631', right: '#6A3F22' } };
C.banc = { n: 1, draw: () => {
  const c = BOIS_BANC, L0 = 0.33;
  const pied = (u, v, z1) => box(u - 0.024, v - 0.024, u + 0.024, v + 0.024, 0, z1, c.pieds, 0.8);
  let s = shadow(0, 0.02, 0.44, 0.14);
  // le dossier : deux montants, trois lattes ; les pieds du fond, l'accoudoir de gauche
  s += pied(-L0 + 0.03, -0.09, 24) + pied(L0 - 0.03, -0.09, 24);
  for (const z of [13.4, 17.2, 21]) s += box(-L0, -0.108, L0, -0.082, z, z + 2.6, c.lattes, 0.9);
  s += pied(-L0 + 0.03, 0.07, 9);
  // l'assise : trois lattes ; les pieds de devant ; les accoudoirs
  for (const [v0, v1] of [[-0.094, -0.038], [-0.03, 0.026], [0.034, 0.09]]) s += box(-L0, v0, L0, v1, 9, 10.8, c.lattes, 0.9);
  s += pied(L0 - 0.03, 0.07, 9);
  const accoudoir = u => pied(u, 0.07, 15.6) + box(u - 0.032, -0.1, u + 0.032, 0.09, 15.6, 17.2, c.lattes, 0.8);
  s += accoudoir(-L0 + 0.03);
  // le coussin, entre les accoudoirs : bombé, plus clair dessus, piqué au centre, un petit cœur brodé
  const [cx, cy] = at(-0.02, 0, 10.8);
  s += `<path d="M${r2(cx - 7)},${r2(cy - 0.4)} Q${r2(cx - 7.6)},${r2(cy - 3.8)} ${r2(cx - 3)},${r2(cy - 4.3)} L${r2(cx + 3.4)},${r2(cy - 4.5)} Q${r2(cx + 7.8)},${r2(cy - 4)} ${r2(cx + 7)},${r2(cy - 0.4)} Q${r2(cx)},${r2(cy + 2)} ${r2(cx - 7)},${r2(cy - 0.4)} Z" fill="#E8566A" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + E(cx - 1.2, cy - 2.9, 3.8, 1.1, '#F28A98', 0) + E(cx + 0.2, cy - 2, 0.45, 0.35, '#B23A4C', 0)
    + `<path d="M${r2(cx + 3.8)},${r2(cy - 1.8)} q-0.8,-0.9 -1.4,-0.1 q-0.5,0.8 1.4,1.8 q1.9,-1 1.4,-1.8 q-0.6,-0.8 -1.4,0.1 Z" fill="#FFFFFF" opacity="0.85"/>`;
  return s + accoudoir(L0 - 0.03);
} };
// Épouvantail : croix de bois, chemise à carreaux rapiécée, paille aux manches et au col, tête de toile de jute aux
// yeux boutons et au sourire cousu, chapeau de paille et son ruban ; il penche au vent, un corbeau se pose (2 images)
const pailleSort = (x, y, a) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a})">${thick('M0,0 l-3.2,-1.4 M0,0 l-3.6,0.6 M0,0 l-2.8,2', 0.9, '#EBC46F')}</g>`;
C.epouvantail = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  const tilt = f ? 4 : -2;
  let s = shadow(0, 0, 0.3, 0.14) + herbe(x - 5, y + 1.4, '#86B852', 0.6) + `<g transform="rotate(${tilt} ${x} ${y})">`;
  // le poteau et la traverse
  s += `<rect x="${x - 1.7}" y="${y - 50}" width="3.4" height="50" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.9"/>` + `<rect x="${x + 0.3}" y="${y - 49.6}" width="1" height="49" fill="${WOOD_DARK.right}"/>`
    + thick(`M${x - 17},${y - 34} L${x + 17},${y - 34}`, 2.6, WOOD_DARK.left);
  // la paille qui sort des manches, puis la chemise : manches, corps à carreaux, pièce rouge cousue, boutons
  s += pailleSort(x - 16, y - 34, 0) + pailleSort(x + 16, y - 34, 180);
  s += P(`M${x - 15},${y - 37} L${x - 7},${y - 37.6} L${x - 7},${y - 31} L${x - 15},${y - 31.2} Z`, '#5C8FD0', 0.9) + P(`M${x + 15},${y - 37} L${x + 7},${y - 37.6} L${x + 7},${y - 31} L${x + 15},${y - 31.2} Z`, '#5C8FD0', 0.9)
    + `<rect x="${x - 16}" y="${y - 37.4}" width="2" height="6.4" rx="0.6" fill="#3E6FA8" stroke="${OUT}" stroke-width="0.6"/><rect x="${x + 14}" y="${y - 37.4}" width="2" height="6.4" rx="0.6" fill="#3E6FA8" stroke="${OUT}" stroke-width="0.6"/>`;
  const corps = `M${x - 9},${y - 38} L${x + 9},${y - 38} L${x + 8.4},${y - 19} Q${x},${y - 17} ${x - 8.4},${y - 19} Z`;
  s += P(corps, '#5C8FD0', 1)
    + `<path d="M${x - 4.4},${y - 37.6} L${x - 4.8},${y - 18.4} M${x + 3.6},${y - 37.6} L${x + 3.8},${y - 18} M${x - 8.6},${y - 31} L${x + 8.6},${y - 31} M${x - 8.4},${y - 24.6} L${x + 8.4},${y - 24.6}" stroke="#3E6FA8" stroke-width="1.2" opacity="0.7"/>`
    + `<rect x="${x + 1.4}" y="${y - 29}" width="5.4" height="5" fill="#E8566A" stroke="${OUT}" stroke-width="0.7" transform="rotate(-6 ${x + 4} ${y - 26.5})"/>`
    + `<path d="M${x + 1.8},${y - 28.4} l0.8,0 m1,0 l0.8,0 m1,0 l0.8,0 M${x + 1.8},${y - 24.4} l0.8,0 m1,0 l0.8,0 m1,0 l0.8,0" stroke="#FFFFFF" stroke-width="0.5" transform="rotate(-6 ${x + 4} ${y - 26.5})"/>`
    + E(x - 1.6, y - 33.6, 0.8, 0.8, '#F6EBD6', 0.5) + E(x - 1.6, y - 27.4, 0.8, 0.8, '#F6EBD6', 0.5);
  // le col de paille, la tête de jute : texture, ficelle, yeux boutons, joues, sourire cousu
  s += pailleSort(x - 2, y - 38.4, 100) + pailleSort(x + 2, y - 38.4, 80);
  s += E(x, y - 44, 6.6, 6.4, '#E9D2A0', 1) + [[-3, -46], [2.6, -41.4], [3.4, -47.4], [-2.2, -40.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.4, 0.4, '#C9AE78', 0)).join('')
    + thick(`M${x - 4.4},${y - 38.8} Q${x},${y - 37.6} ${x + 4.4},${y - 38.8}`, 0.7, '#B8935A')
    + E(x - 2.4, y - 44.6, 1.2, 1.2, '#3A2A24', 0.5) + E(x + 2.4, y - 44.6, 1.2, 1.2, '#3A2A24', 0.5) + E(x - 2.7, y - 45, 0.35, 0.35, '#FFFFFF', 0) + E(x + 2.1, y - 45, 0.35, 0.35, '#FFFFFF', 0)
    + E(x - 4, y - 42.2, 1, 0.6, '#F29AA8', 0) + E(x + 4, y - 42.2, 1, 0.6, '#F29AA8', 0)
    + `<path d="M${x - 2.6},${y - 41.8} Q${x},${y - 40} ${x + 2.6},${y - 41.8}" stroke="${OUT}" stroke-width="0.6" fill="none" stroke-linecap="round"/>`
    + `<path d="M${x - 1.6},${y - 41.6} l0,1.2 M${x},${y - 41} l0,1.2 M${x + 1.6},${y - 41.6} l0,1.2" stroke="${OUT}" stroke-width="0.45"/>`;
  // le chapeau de paille : bord, calotte, ruban rouge, une fleurette
  s += E(x, y - 49.4, 11, 2.8, '#EBC46F', 1) + `<path d="M${x - 9},${y - 49.6} q4,1.4 9,0.2 M${x + 2},${y - 50} q4,1 7,-0.4" stroke="#C9A045" stroke-width="0.5" fill="none"/>`
    + P(`M${x - 6},${y - 50} Q${x - 6},${y - 59} ${x},${y - 59.4} Q${x + 6},${y - 59} ${x + 6},${y - 50} Z`, '#EBC46F', 1)
    + `<path d="M${x - 6},${y - 51.6} Q${x},${y - 50.2} ${x + 6},${y - 51.6} L${x + 6},${y - 53.2} Q${x},${y - 51.8} ${x - 6},${y - 53.2} Z" fill="#E8566A" stroke="${OUT}" stroke-width="0.6"/>`
    + E(x - 2, y - 56.4, 1.8, 1.2, '#F7DC8C', 0) + fleurette(x + 4.4, y - 52.4, '#FFFFFF');
  s += '</g>';
  // le corbeau posé sur le bras, l'image où le vent tombe
  if (f) {
    const [bx, by] = [x + 17.6, y - 37.6];
    s += P(`M${bx - 4.6},${by + 1.4} L${bx - 7.6},${by + 3.4} L${bx - 4},${by + 2.6} Z`, '#2E2E38', 0.6)
      + E(bx - 1, by, 3.6, 2.6, '#2E2E38', 0.8) + E(bx - 1.6, by - 0.6, 1.8, 1, '#4A4A58', 0)
      + E(bx + 1.8, by - 2.6, 2, 1.9, '#2E2E38', 0.8) + E(bx + 2.4, by - 3, 0.5, 0.5, '#FFFFFF', 0)
      + P(`M${bx + 3.6},${by - 2.8} l2.2,0.6 l-2.2,0.6 Z`, '#F2B33D', 0.4)
      + `<path d="M${bx - 1.6},${by + 2.4} l0,1.4 M${bx + 0.4},${by + 2.4} l0,1.4" stroke="#F2B33D" stroke-width="0.6"/>`;
  }
  return s;
} };
// Nichoir : une maisonnette de planches sur son piquet et sa jambe de force, toit rouge à bardeaux, trou rond et son
// perchoir ; une mésange passe la tête, puis se pose au perchoir (2 images)
const PLANCHES_NICHOIR = { top: '#F6E7C8', left: '#EAD2A4', right: '#C7AA7A' };
const mesange = (x, y, s, corps) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})">`
  + (corps ? E(0.4, 1.8, 2.6, 2.2, '#F2D24A', 0.7) + P('M-1.4,0.6 Q1.6,-0.4 3.2,1.8 Q1.4,3.4 -1.2,2.6 Z', '#5C9CE0', 0.6) + P('M2.6,2 L5,3.4 L2.8,3.2 Z', '#4A80C0', 0.5) : '')
  + E(-1.2, -1, 2.2, 2, '#FFFFFF', 0.7) + P('M-3.2,-1.4 Q-1.4,-3.8 1,-2 Q-0.6,-1.6 -3.2,-1.4 Z', '#5C9CE0', 0.5)
  + E(-1.6, -0.9, 0.45, 0.5, OUT, 0) + E(-1.75, -1.1, 0.15, 0.15, '#FFFFFF', 0) + P('M-3.3,-0.6 L-4.6,-0.2 L-3.3,0.2 Z', '#3A3A44', 0.4)
  + E(-0.4, 0.2, 0.6, 0.35, '#F7A8B8', 0) + '</g>';
C.nichoir = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.22, 0.14) + post(0, 0, 0, 30, WOOD_DARK, 0.03);
  const [jx, jy] = at(0, 0.03, 22), [kx, ky] = at(0, 0.09, 30);
  s += thick(`M${r2(jx)},${r2(jy)} L${r2(kx)},${r2(ky)}`, 1.2, WOOD_DARK.left);
  s += box(-0.11, -0.11, 0.11, 0.11, 30, 44, PLANCHES_NICHOIR);
  // les planches de la façade et du côté
  for (const u of [-0.055, 0, 0.055]) s += L(at(u, 0.11, 30.6), at(u, 0.11, 43.6), '#CDB283', 0.5);
  for (const v of [-0.04, 0.04]) s += L(at(0.11, v, 30.6), at(0.11, v, 43.6), '#A88E62', 0.5);
  s += gable(-0.11, -0.11, 0.11, 0.11, 44, 10, ROOF_RED, 0.04);
  // les bardeaux du pan avant
  for (const t of [0.33, 0.66]) s += L(at(-0.15, t * 0.15, 54 - 10 * t), at(0.15, t * 0.15, 54 - 10 * t), '#B9503B', 0.6);
  s += E(...at(0.15, 0, 54), 1.2, 1, ROOF_RED.front, 0.7);
  // le trou rond et son perchoir
  const [hx, hy] = at(0, 0.11, 39);
  s += E(hx, hy - 1, 2.9, 2.9, '#B89A6A', 0.8) + E(hx, hy - 1, 2.2, 2.2, '#3A2A24', 0) + thick(`M${r2(hx)},${r2(hy + 3.2)} l-2.6,1.2`, 0.9, WOOD_DARK.left);
  s += f ? mesange(hx - 3.6, hy + 1.4, 1.05, true) : mesange(hx + 0.6, hy - 0.8, 0.78, false);
  return s;
} };
// Girouette : socle de pierre, mât de fer et sa boule de laiton, croix des points cardinaux ; le coq de cuivre, dressé
// sur sa flèche, tourne au vent (4 images)
const coqCuivre = () => trait2('M-10,0 L9,0', OUT, 2.4) + trait2('M-10,0 L9,0', COPPER.right, 1.1)
  + P('M11.6,0 L8,-2.4 L8,2.4 Z', COPPER.left, 0.8) + P('M-10,0 L-13,-3 L-11.4,0 L-13,3 Z', COPPER.left, 0.7)
  + trait2('M-0.6,-0.6 L-0.6,-3.4 M1.2,-0.6 L1.2,-3.4', OUT, 0.7)
  + P('M-3,-6 Q-8.6,-12 -6.4,-15.4 Q-4.2,-11.4 -1.4,-9 Z', COPPER.right, 0.8) + P('M-2.2,-6.6 Q-6,-14.6 -2.8,-16.6 Q-1.8,-12 0,-9.4 Z', COPPER.left, 0.8)
  + E(0.4, -5.4, 4.6, 3, COPPER.left, 0.9) + E(-0.6, -6.4, 2.6, 1.2, COPPER.top, 0) + P('M-1.6,-5.6 Q0.6,-3.4 3,-5.2', 'none', 0.6)
  + E(4, -9.4, 2.2, 2.1, COPPER.left, 0.9) + E(3.4, -10, 0.9, 0.6, COPPER.top, 0)
  + P('M2.8,-11.2 q0.4,-1.8 1.4,-0.8 q0.8,-1.6 1.5,-0.1 q0.8,-0.9 0.9,0.6 Z', '#E8483C', 0.6)
  + P('M6,-9.8 L8.2,-9.2 L6,-8.6 Z', '#F2B33D', 0.5) + E(5.6, -8, 0.6, 0.8, '#E8483C', 0.4) + E(4.6, -9.8, 0.45, 0.5, OUT, 0);
const trait2 = (d, col, w) => `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
C.girouette = { n: 4, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.22, 0.14) + box(-0.085, -0.085, 0.085, 0.085, 0, 2.6, STONE) + box(-0.06, -0.06, 0.06, 0.06, 2.6, 4.6, STONE);
  // le mât : éclairé à gauche, une bague, la boule de laiton
  s += `<rect x="${x - 1.3}" y="${y - 52}" width="2.6" height="46.4" fill="${IRON.left}" stroke="${OUT}" stroke-width="0.8"/>` + `<rect x="${x + 0.2}" y="${y - 51.6}" width="0.8" height="45.6" fill="${IRON.right}"/><rect x="${x - 1}" y="${y - 51.6}" width="0.6" height="45.6" fill="${IRON.top}"/>`
    + E(x, y - 24, 2.2, 1, IRON.left, 0.7) + E(x, y - 47, 2.4, 2.3, BRASS.left, 0.8) + E(x - 0.7, y - 47.7, 0.9, 0.7, BRASS.top, 0);
  // la croix des points cardinaux, ses bouts en boule, les lettres
  const bras = [[-11, 0], [11, 0], [-6, -4], [6, 4]];
  s += trait2(`M${x - 11},${y - 40} L${x + 11},${y - 40} M${x - 6},${y - 44} L${x + 6},${y - 36}`, OUT, 2.2) + trait2(`M${x - 11},${y - 40} L${x + 11},${y - 40} M${x - 6},${y - 44} L${x + 6},${y - 36}`, IRON.left, 1)
    + bras.map(([dx, dy]) => E(x + dx, y - 40 + dy, 1, 1, IRON.left, 0.6)).join('')
    + [['N', x - 7.4, y - 45.4], ['E', x + 12.6, y - 38.6], ['S', x + 6, y - 31.6], ['O', x - 15.6, y - 38.6]].map(([t, a, b]) => `<text x="${a}" y="${b}" font-family="sans-serif" font-size="4.4" font-weight="700" fill="${OUT}">${t}</text>`).join('');
  // le coq, qui tourne
  const sx = [1, 0.5, -1, -0.5][f];
  s += `<g transform="translate(${x} ${y - 52}) scale(${sx} 1)">${coqCuivre()}</g>`;
  return s;
} };
// Fontaine : un bassin rond de pierres appareillées, l'eau et ses ronds, un poisson rouge qui nage ; la colonne, sa
// vasque en coquille, le jet qui monte et l'eau qui retombe en filets et en gouttes (3 images)
C.fontaine = { n: 3, draw: f => {
  let s = shadow(0, 0, 0.52, 0.14) + cylinder(0, 0, 0.42, 0, 7, STONE);
  // les joints du bassin, sur sa face visible
  for (const a of [0.35, 0.95, 1.55, 2.15, 2.75]) { const [x0, y0] = at(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0.4), [, y1] = at(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 6.6); s += L([x0, y0], [x0, y1], STONE.right, 0.6); }
  s += disc(0, 0, 0.42, 7, STONE.top, 1) + disc(0, 0, 0.35, 7, WATER, 0.8) + disc(-0.05, -0.05, 0.22, 7, WATER_LIGHT, 0);
  // les ronds dans l'eau, le poisson rouge qui fait le tour
  for (let i = 0; i < 2; i++) { const p = ((f / 3) + i * 0.5) % 1; const [x, y] = at(0.02, 0.02, 7); s += E(x, y, 9 + p * 12, 4.5 + p * 6, 'none', 0).replace('stroke="none"', `stroke="#E8F6FF" stroke-width="0.7" opacity="${r2(0.8 - p * 0.7)}"`); }
  const a = (f / 3) * TAU + 0.8, [px, py] = at(Math.cos(a) * 0.25, Math.sin(a) * 0.25, 7), dir = Math.cos(a + Math.PI / 2) > 0 ? 1 : -1;
  s += `<g transform="translate(${r2(px)} ${r2(py)}) scale(${dir} 1)">` + E(0, 0, 2.6, 1.3, '#F08A3A', 0.6) + P('M-2.4,0 L-4.4,-1.4 L-4,0 L-4.4,1.4 Z', '#F2A35A', 0.5) + E(1.2, -0.3, 0.3, 0.3, OUT, 0) + '</g>';
  // la bague dans l'eau, la colonne, la vasque en coquille et son eau
  s += cylinder(0, 0, 0.075, 7, 8.4, STONE, 0.7) + cylinder(0, 0, 0.06, 8.4, 21, WHITE_STONE, 0.9);
  const [bx, by] = at(0, 0, 21.6), [, yn] = at(0, 0, 13);
  // le pied évasé qui porte la vasque
  s += P(`M${r2(bx - 3.36)},${r2(yn)} Q${r2(bx - 3.6)},${r2(by + 5.2)} ${r2(bx - 6.6)},${r2(by + 4)} L${r2(bx + 6.6)},${r2(by + 4)} Q${r2(bx + 3.6)},${r2(by + 5.2)} ${r2(bx + 3.36)},${r2(yn)} A3.36 1.68 0 0 1 ${r2(bx - 3.36)},${r2(yn)} Z`, WHITE_STONE.left, 0.9)
    + L([bx + 1.6, yn + 1.2], [bx + 2.4, by + 5], WHITE_STONE.right, 0.6);
  s += P(`M${r2(bx - 12)},${r2(by)} Q${r2(bx - 9.6)},${r2(by + 6)} ${r2(bx)},${r2(by + 6.4)} Q${r2(bx + 9.6)},${r2(by + 6)} ${r2(bx + 12)},${r2(by)} Z`, WHITE_STONE.left, 0.9)
    + [-7.2, -2.4, 2.4, 7.2].map(dx => L([bx + dx * 0.9, by + 0.6], [bx + dx * 0.5, by + 5.4], WHITE_STONE.right, 0.5)).join('')
    + E(bx, by, 12, 4.2, WHITE_STONE.top, 0.9) + E(bx, by + 0.2, 9.2, 2.9, WATER, 0.6) + E(bx - 1.6, by - 0.3, 4.4, 1.1, WATER_LIGHT, 0);
  // le jet, puis l'eau qui retombe de la vasque en filets, et les gouttes qui tombent (elles bougent d'une image à l'autre)
  const [x, y] = at(0, 0, 22);
  s += thick(`M${x},${y} L${x},${r2(y - 8)}`, 1.6, WATER_LIGHT) + E(x, y - 8.6, 1.8, 1.6, '#E8F6FF', 0.6);
  for (const dx of [-9, 9]) s += `<path d="M${r2(bx + dx)},${r2(by + 1.4)} q${dx > 0 ? 1.6 : -1.6},3 ${dx > 0 ? 2.4 : -2.4},9" stroke="#E8F6FF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.85"/>`;
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * TAU, p = ((f / 3) + i * 0.17) % 1;
    s += E(x + Math.cos(ang) * (4 + p * 5), y - 8 + p * 10 + Math.sin(ang) * 1.6, 0.8, 1.1, '#E8F6FF', 0.4);
  }
  return s;
} };
// Brasero : un trépied de fer forgé aux pieds en volute, une coupe ronde cerclée et rivetée, les braises qui rougeoient,
// trois flammes et des étincelles qui montent (3 images). Le feu reste vers z 24 : la lumière de nuit y est calée
C.brasero = { n: 3, draw: f => {
  const [x, y] = at(0, 0, 16);
  let s = shadow(0, 0, 0.3, 0.16);
  // le trépied : trois pieds de fer, chacun finit en volute au sol
  s += [[-0.13, 0.07], [0.13, 0.07], [0, -0.13]].map(([u, v]) => {
    const p = at(u, v, 0), tx = r2(x + (p[0] - x) * 0.7), side = p[0] < x ? -1 : p[0] > x ? 1 : 0.6;
    return thick(`M${tx},${y + 2} L${r2(p[0])},${r2(p[1] - 1.6)} q${r2(side * 1.6)},1.4 ${r2(side * 0.2)},2.6 q${r2(-side * 1.2)},0 ${r2(-side * 0.6)},-1.2`, 1.4, IRON.right);
  }).join('');
  // la lueur, la coupe : panse ronde, bandeau riveté, bord
  s += glow(x, y - 10, 18, '255,170,90', 0.32)
    + `<path d="M${x - 13},${y - 2} Q${x - 12},${y + 9} ${x},${y + 9.4} Q${x + 12},${y + 9} ${x + 13},${y - 2} Z" fill="${IRON.left}" stroke="${OUT}" stroke-width="1"/>`
    + `<path d="M${x + 1},${y + 9.3} Q${x + 11.4},${y + 8.6} ${x + 12.6},${y - 1.6} L${x + 13},${y - 2} Q${x + 6},${y + 2.6} ${x + 1},${y + 2.8} Z" fill="${IRON.right}"/>`
    + `<path d="M${x - 12.4},${y + 2.4} Q${x},${y + 7} ${x + 12.4},${y + 2.4}" stroke="${IRON.top}" stroke-width="1.6" fill="none"/>`
    + [-8, -3, 2, 7].map(dx => E(x + dx, y + 4.6 + Math.abs(dx) * -0.12, 0.55, 0.55, IRON.right, 0.4)).join('')
    + `<path d="M${x - 10},${y + 1} Q${x - 8},${y + 4} ${x - 4},${y + 4.6}" stroke="#FFFFFF" stroke-width="0.8" fill="none" opacity="0.35" stroke-linecap="round"/>`
    + E(x, y - 2, 13, 4, '#3A2620', 1);
  // les braises : des charbons sombres fendus d'orange, plus vifs une image sur trois
  s += [[-7, -2.2, 2.8], [-2, -3.2, 3], [3.4, -2.6, 2.8], [7.6, -1.8, 2.2], [0.6, -1, 2.4], [-4.6, -0.8, 2]].map(([dx, dy, r], i) =>
    E(x + dx, y + dy, r, r * 0.55, '#5A3A2A', 0.6) + E(x + dx, y + dy - 0.2, r * 0.55, r * 0.25, (i + f) % 3 ? '#E8573A' : '#FFB347', 0)).join('');
  // les flammes, puis des étincelles qui montent
  s += flame(x - 4, y - 2, 13 + f * 2, 4, f / 3) + flame(x + 4, y - 2, 11 + (2 - f), 3.6, f / 3 + 0.4) + flame(x, y - 2, 17 - f, 4.4, f / 3 + 0.2);
  for (let i = 0; i < 3; i++) { const p = ((f / 3) + i / 3) % 1; s += E(x - 5 + i * 5 + Math.sin(p * 6 + i) * 1.6, y - 18 - p * 14, 0.7, 0.7, '#FFD27A', 0).replace('/>', ` opacity="${r2(1 - p * 0.8)}"/>`); }
  return s;
} };
// Pergola : quatre poteaux sur leurs dés de pierre, deux poutres, cinq chevrons qui dépassent ; une glycine grimpe au
// poteau et ses grappes mauves pendent et se balancent (2 images)
// une grappe de glycine : des fleurs rondes en cône, du plus large au plus fin, qui suivent le balancement ; un seul
// contour pour toute la grappe (les fleurs posées d'abord en sombre un peu plus grandes), clair à gauche, sombre à droite
function grappe(x, y, sw, n = 6) {
  const fl = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), cx = x + sw * t * t, cy = y + 1.8 + i * 2.5, r = 2.2 - t * 1.1, dx = 2 * (1 - t * 0.75);
    fl.push([cx - dx, cy, r, 0], [cx + dx, cy + 0.6, r * 0.95, 1]);
  }
  fl.push([x + sw, y + 1.8 + n * 2.5 - 0.6, 0.9, 1]);
  return fl.map(([cx, cy, r]) => E(cx, cy, r + 0.75, r * 0.9 + 0.75, OUT, 0)).join('')
    + fl.map(([cx, cy, r]) => E(cx, cy, r, r * 0.9, '#C9A8F0', 0)).join('')
    + fl.map(([cx, cy, r, d]) => d ? E(cx + r * 0.25, cy + r * 0.25, r * 0.6, r * 0.5, '#A57BD8', 0) : E(cx - r * 0.3, cy - r * 0.3, r * 0.45, r * 0.35, '#EEE2FC', 0)).join('')
    + leafDot(x - 2.4, y - 0.6, 2.4) + leafDot(x + 2.2, y - 1, 2.2);
}
C.pergola = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.52, 0.12);
  for (const [u, v] of [[-0.36, -0.36], [0.36, -0.36], [-0.36, 0.36], [0.36, 0.36]]) s += box(u - 0.05, v - 0.05, u + 0.05, v + 0.05, 0, 2.6, STONE, 0.8) + post(u, v, 2.6, 36, WOOD, 0.035);
  // le cep de la glycine, enroulé au poteau de devant à gauche, et ses feuilles
  const [lx, ly] = at(-0.36, 0.36, 0);
  s += thick(`M${r2(lx + 2)},${r2(ly)} q-4,-6 0.6,-11 q4,-5 -0.6,-10 q-4,-5 0.8,-11`, 1, '#6E5A3A')
    + [[-1.6, -6, 2.2], [2.4, -13, 2.4], [-1.4, -21, 2.2], [2.2, -28, 2.4], [-0.6, -33, 2]].map(([dx, dy, r]) => leafDot(lx + dx, ly + dy, r)).join('');
  // les poutres et les chevrons, leurs bouts taillés
  s += box(-0.44, -0.385, 0.44, -0.335, 36, 40, WOOD) + box(-0.44, 0.335, 0.44, 0.385, 36, 40, WOOD);
  for (const u of [-0.32, -0.16, 0, 0.16, 0.32]) s += box(u - 0.022, -0.46, u + 0.022, 0.46, 40, 43, WOOD_DARK, 0.7);
  // les grappes qui pendent des poutres
  for (const [u, v, n] of [[-0.24, 0.36, 6], [0.06, 0.36, 7], [0.3, 0.36, 5], [0.36, 0.04, 6], [0.36, -0.22, 5]]) {
    const [x, y] = at(u, v, 37);
    s += grappe(x, y, wave(f, 2, 1.2, u * 9 + v * 4), n);
  }
  return s;
} };
// Statue : un socle mouluré à trois degrés et sa plaque gravée, une liseuse de marbre drapée, cheveux en chignon, qui
// lève un livre ouvert ; les plis de sa robe, le côté droit dans l'ombre ; du lierre au pied du socle
const MARBRE = { light: '#FBF8F1', mid: '#ECE6D8', dark: '#CFC6B2', pli: '#B9AF98' };
C.statue = { n: 1, draw: () => {
  const [x, y] = at(0, 0, 15), c = MARBRE;
  let s = shadow(0, 0, 0.32, 0.16) + box(-0.16, -0.16, 0.16, 0.16, 0, 3.4, STONE) + box(-0.12, -0.12, 0.12, 0.12, 3.4, 13, WHITE_STONE) + box(-0.14, -0.14, 0.14, 0.14, 13, 15, STONE);
  // la plaque gravée sur la face avant du socle
  const pl = [at(-0.09, 0.12, 6), at(0.03, 0.12, 6), at(0.03, 0.12, 10.6), at(-0.09, 0.12, 10.6)];
  s += poly(pl, '#E4DCC8', 0.6) + L(at(-0.075, 0.12, 9.2), at(0.015, 0.12, 9.2), c.pli, 0.5) + L(at(-0.075, 0.12, 7.6), at(0.0, 0.12, 7.6), c.pli, 0.5);
  // la robe : une cloche drapée, ombrée à droite, ses plis ; la ceinture
  const robe = `M${x - 7.4},${y} Q${x - 8.6},${y - 14} ${x - 4.4},${y - 25} L${x + 4.4},${y - 25} Q${x + 8.6},${y - 14} ${x + 7.4},${y} Q${x},${y + 1.6} ${x - 7.4},${y} Z`;
  s += P(robe, c.mid, 1) + `<path d="M${x + 1.2},${y - 25} L${x + 4.4},${y - 25} Q${x + 8.6},${y - 14} ${x + 7.4},${y} Q${x + 4},${y + 1} ${x + 2},${y + 1.2} Q${x + 4.6},${y - 12} ${x + 1.2},${y - 25} Z" fill="${c.dark}"/>`
    + `<path d="M${x - 3.6},${y - 22} Q${x - 4.6},${y - 11} ${x - 3.4},${y + 0.8} M${x - 0.6},${y - 21} Q${x - 1},${y - 10} ${x},${y + 1.2} M${x + 3},${y - 20} Q${x + 4.4},${y - 10} ${x + 4.6},${y + 0.8}" stroke="${c.pli}" stroke-width="0.6" fill="none"/>`
    + `<path d="M${x - 5.6},${y - 18} Q${x},${y - 16.4} ${x + 5.6},${y - 18}" stroke="${c.pli}" stroke-width="1" fill="none"/>`
    + `<path d="M${x - 6.4},${y - 8} Q${x - 4},${y - 13} ${x - 6},${y - 20}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  // le bras gauche replié sur la robe ; le bras droit levé et le livre ouvert
  s += P(`M${x - 4.6},${y - 24} Q${x - 6.4},${y - 18} ${x - 2},${y - 15.6} Q${x + 0.4},${y - 15.4} ${x},${y - 17} Q${x - 3},${y - 18} ${x - 2.6},${y - 23} Z`, c.light, 0.8);
  s += thick(`M${x + 3.4},${y - 24} Q${x + 6.6},${y - 28} ${x + 7.6},${y - 33.6}`, 1.6, c.mid)
    + P(`M${x + 3.4},${y - 34} L${x + 8.6},${y - 36.4} L${x + 8.6},${y - 41.4} L${x + 3.4},${y - 39} Z`, c.light, 0.8)
    + P(`M${x + 8.6},${y - 36.4} L${x + 13.6},${y - 34.6} L${x + 13.6},${y - 39.6} L${x + 8.6},${y - 41.4} Z`, c.mid, 0.8)
    + `<path d="M${x + 4.4},${y - 37.4} l3.4,-1.6 M${x + 4.4},${y - 36} l3.4,-1.6 M${x + 9.6},${y - 39.6} l3,1 M${x + 9.6},${y - 38.2} l3,1" stroke="${c.pli}" stroke-width="0.45"/>`
    + E(x + 8.2, y - 35.6, 1.5, 1.2, c.light, 0.7);
  // la tête : le visage, les yeux clos de la liseuse, le chignon
  s += E(x, y - 29, 3.6, 3.8, c.light, 0.9) + P(`M${x - 3.6},${y - 29.6} Q${x - 3.4},${y - 33.6} ${x},${y - 33.6} Q${x + 3.6},${y - 33.4} ${x + 3.6},${y - 29.4} Q${x + 1},${y - 31.6} ${x - 3.6},${y - 29.6} Z`, c.dark, 0.6)
    + E(x + 0.6, y - 34.6, 2, 1.6, c.mid, 0.7)
    + `<path d="M${x - 2},${y - 28.6} q0.7,0.6 1.4,0 M${x + 0.8},${y - 28.6} q0.7,0.6 1.4,0" stroke="${c.pli}" stroke-width="0.5" fill="none" stroke-linecap="round"/>`;
  // le lierre qui grimpe à l'angle du socle : une tige fine, des feuilles en cœur
  const [lx, ly] = at(-0.16, 0.16, 0), feuille = (fx, fy, a) => `<path d="M0,0 Q-2.4,-1.2 -1.8,-3 Q-0.8,-3.8 0,-2.8 Q0.8,-3.8 1.8,-3 Q2.4,-1.2 0,0 Z" transform="translate(${r2(fx)} ${r2(fy)}) rotate(${a})" fill="#5E9E48" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>`;
  return s + `<path d="M${r2(lx + 1)},${r2(ly)} Q${r2(lx - 1.4)},${r2(ly - 4)} ${r2(lx + 0.6)},${r2(ly - 8)} Q${r2(lx + 2.4)},${r2(ly - 11)} ${r2(lx + 0.4)},${r2(ly - 14)} M${r2(lx + 1)},${r2(ly)} Q${r2(lx + 4)},${r2(ly - 1)} ${r2(lx + 7)},${r2(ly + 1.6)}" stroke="#3E7A34" stroke-width="0.8" fill="none" stroke-linecap="round"/>`
    + feuille(lx - 0.6, ly - 2.4, -40) + feuille(lx + 1.4, ly - 6.6, 30) + feuille(lx - 0.2, ly - 10, -30) + feuille(lx + 1.2, ly - 13.6, 20) + feuille(lx + 4, ly - 0.2, 70) + feuille(lx + 6.6, ly + 1.8, 100);
} };
// Arche fleurie : une arche de jardin en bois peint, deux montants en treillage sur leurs dés de pierre, un cintre
// double et ses barreaux ; un rosier grimpant monte surtout à gauche, ses roses, ses boutons ; les feuilles frémissent
// et un pétale tombe (2 images)
const PEINT = { light: '#FBF7EF', mid: '#E9E1D2', dark: '#C9BDA8' };
const ROSES = [['#E8566A', '#B5344A'], ['#F5A3BE', '#D46F8E'], ['#FBD6E1', '#E59CB3']];
// une rose vue de face : la corolle, la spirale de son cœur, un reflet
const rose = (x, y, r, [c, d]) => E(x, y, r, r * 0.9, c, 0.6)
  + `<path d="M${r2(x - r * 0.55)},${r2(y + r * 0.1)} q${r2(r * 0.5)},${r2(-r * 0.75)} ${r2(r * 1.05)},${r2(-r * 0.05)} q${r2(-r * 0.2)},${r2(r * 0.55)} ${r2(-r * 0.6)},${r2(r * 0.4)} q${r2(-r * 0.3)},${r2(-r * 0.3)} ${r2(r * 0.1)},${r2(-r * 0.45)}" stroke="${d}" stroke-width="0.6" fill="none" stroke-linecap="round"/>`
  + E(x - r * 0.45, y - r * 0.4, r * 0.25, r * 0.18, '#FFFFFF', 0);
// un bouton de rose : la goutte rose dans son calice vert
const bouton = (x, y, c) => P(`M${r2(x)},${r2(y - 2.6)} Q${r2(x + 1.6)},${r2(y - 0.6)} ${r2(x)},${r2(y + 0.4)} Q${r2(x - 1.6)},${r2(y - 0.6)} ${r2(x)},${r2(y - 2.6)} Z`, c, 0.55)
  + P(`M${r2(x - 1.2)},${r2(y - 0.6)} Q${r2(x)},${r2(y + 1.6)} ${r2(x + 1.2)},${r2(y - 0.6)} Q${r2(x)},${r2(y)} ${r2(x - 1.2)},${r2(y - 0.6)} Z`, '#6FAE4E', 0.5);
C.arche = { n: 2, draw: f => {
  const H = 32, [, top] = at(0, 0, H);
  let s = shadow(0, 0, 0.42, 0.12);
  // les deux montants en treillage, chacun sur son dé de pierre
  for (const k of [-1, 1]) {
    const u = -0.25 * k, x0 = 20 * k - 3, x1 = 20 * k + 3, [, y0] = at(u, -u, 2.6);
    s += box(u - 0.05, -u - 0.05, u + 0.05, -u + 0.05, 0, 2.6, STONE, 0.8);
    let lat = '';
    for (let y = y0; y > top + 4; y -= 7) lat += `M${x0},${r2(y)} L${x1},${r2(y - 7)} M${x1},${r2(y)} L${x0},${r2(y - 7)} `;
    s += thick(lat, 0.8, PEINT.mid) + thick(`M${x0},${r2(y0)} L${x0},${r2(top)} M${x1},${r2(y0)} L${x1},${r2(top)}`, 1.6, PEINT.light)
      + `<path d="M${x1 + 0.4},${r2(y0)} L${x1 + 0.4},${r2(top)}" stroke="${PEINT.dark}" stroke-width="0.6"/>`;
  }
  // le cintre : deux arceaux et leurs barreaux
  const arc = (rx, ry) => `M${-rx},${r2(top)} A${rx} ${ry} 0 0 1 ${rx},${r2(top)}`;
  let rungs = '';
  for (let i = 1; i < 8; i++) { const t = (i / 8) * Math.PI, c = Math.cos(t), si = Math.sin(t); rungs += `M${r2(-17 * c)},${r2(top - 15 * si)} L${r2(-23 * c)},${r2(top - 21 * si)} `; }
  s += thick(rungs, 1, PEINT.mid) + thick(arc(23, 21), 1.6, PEINT.light) + thick(arc(17, 15), 1.6, PEINT.light)
    + `<path d="${arc(23, 20.2)}" stroke="#FFFFFF" stroke-width="0.6" fill="none" opacity="0.8"/>`;
  // le rosier : sa tige qui serpente au montant gauche, puis ses feuilles, ses roses et ses boutons le long du cintre
  s += `<path d="M-18,0 Q-24,-8 -19,-15 Q-15,-22 -21,-29 Q-25,-34 -20,${r2(top - 4)}" stroke="#4E7A34" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  const along = th => [r2(-20 * Math.cos(th)), r2(top - 18 * Math.sin(th))];
  const feuilles = [[-20, -4, 2.4], [-22, -12, 2.8], [-17.6, -18, 2.4], [-22.4, -25, 3], [-18, -31, 2.6], [-21, -37, 2.8], [21.4, -26, 2.4], [18.6, -33, 2.6], [22, -38, 2.4]];
  for (let i = 0; i <= 9; i++) { const [x, y] = along((i / 13) * Math.PI); feuilles.push([x + (i % 2 ? 1.4 : -1.2), y + (i % 2 ? 1 : -0.8), 2.6 + (i % 3) * 0.3]); }
  s += feuilles.map(([x, y, r], i) => leafDot(x + wave(f, 2, 0.5, i), y, r)).join('');
  s += [[-21, -9, 2.4, 0], [-19, -22, 2.6, 1], [-21.6, -34, 2.8, 0], [21, -30, 2.2, 1]].map(([x, y, r, c]) => rose(x, y, r, ROSES[c])).join('');
  for (const [i, r, c] of [[1, 2.8, 0], [3, 2.6, 1], [5, 2.8, 2], [7, 2.4, 0], [9, 2.4, 1]]) { const [x, y] = along((i / 13) * Math.PI); s += rose(x + wave(f, 2, 0.4, i), y - 0.6, r, ROSES[c]); }
  s += bouton(-23.4, -16, ROSES[0][0]) + bouton(-16.4, -28, ROSES[1][0]) + bouton(...along((11 / 13) * Math.PI), ROSES[2][0]);
  // le pétale qui tombe, plus bas d'une image à l'autre
  const [px, py] = [f ? -9 : -12, f ? -14 : -26];
  return s + `<path d="M${px},${py} q2,-1.4 3,0.4 q-1.6,1.4 -3,-0.4 Z" fill="${ROSES[1][0]}" stroke="${OUT}" stroke-width="0.5" transform="rotate(${f ? 40 : -20} ${px} ${py})"/>`;
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
