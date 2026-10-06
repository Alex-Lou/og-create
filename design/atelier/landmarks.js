// Lieux remarquables (lot 9c) au trait de la troupe, d'après src/world/landmarkSprites.js. Une case, ancre au centre ;
// un lieu déborde de sa case comme un monument. Cadre LAND (le jeu les affiche × 1,35, la cascade × 1).
const { OUT, P, E, L, r2 } = require('./troupe');
const Dk = require('./deco');
const { pt, poly, face, shadow, box, crown, boulder, flower, stroke, thick, cylinder, disc, post, rail, glow, LEAVES, PINE, WOOD, WOOD_DARK, GRANITE, STONE, WATER, WATER_LIGHT } = Dk;

const LAND = [-75, -150, 150, 190];
const TAU = Math.PI * 2;
const at = (u, v, z = 0) => pt(u, v, z);
const ICE = { top: '#E9F8FF', left: '#BFE7F7', right: '#8CCBE8' };
const SNOW = { top: '#FFFFFF', left: '#EAF2F8', right: '#C9D8E6' };
const SAND = { top: '#F2D79A', left: '#E2BF78', right: '#C49A58' };
const BASALT = { top: '#5A5660', left: '#3E3A44', right: '#2A2730' };
const SALT = { top: '#FBF8F1', left: '#EDE6D8', right: '#D2C8B4' };
const puff = (x, y, r, a = 0.85) => `<g opacity="${a}">${E(x, y, r, r * 0.8, '#FFFFFF', 0.7)}${E(x + r * 0.7, y - r * 0.3, r * 0.7, r * 0.6, '#FFFFFF', 0.7)}${E(x - r * 0.6, y - r * 0.2, r * 0.6, r * 0.5, '#FFFFFF', 0.7)}</g>`;
const sparkle = (x, y, s) => P(`M${x},${r2(y - s)} L${r2(x + s * 0.25)},${r2(y - s * 0.25)} L${r2(x + s)},${y} L${r2(x + s * 0.25)},${r2(y + s * 0.25)} L${x},${r2(y + s)} L${r2(x - s * 0.25)},${r2(y + s * 0.25)} L${r2(x - s)},${y} L${r2(x - s * 0.25)},${r2(y - s * 0.25)} Z`, '#FFFFFF', 0.5);
const leafDot = (x, y, r, c = LEAVES) => E(x + r * 0.2, y + r * 0.2, r, r, c.dark, 0.8) + E(x, y, r * 0.85, r * 0.85, c.mid, 0) + E(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.4, c.light, 0);
const gull = (x, y, flap) => `<g transform="translate(${r2(x)} ${r2(y)})">${E(0, 0, 3.4, 2.2, '#FFFFFF', 0.8)}${E(2.6, -1.8, 1.7, 1.7, '#FFFFFF', 0.8)}${P('M4,-1.8 l2.2,0.6 l-2.2,0.6 Z', '#F2C94C', 0.4)}${E(2.8, -2.2, 0.35, 0.35, OUT, 0)}${flap ? P('M-1,-1 L-5,-6 L1,-2 Z', '#A8B4C2', 0.6) : P('M-3,-0.4 Q0,-2 2,0 Q0,1 -3,-0.4 Z', '#A8B4C2', 0.5)}</g>`;
const palm = (x, y, h, sw) => {
  const tx = x + h * 0.18 + sw, ty = y - h;
  const fr = (dx, dy, c) => { const mx = tx + dx * 0.5, my = ty + dy * 0.5 - 6, len = Math.hypot(dx, dy) || 1, nx = (-dy / len) * 4, ny = (dx / len) * 4; return `<path d="M${r2(tx)},${r2(ty)} Q${r2(mx + nx)},${r2(my + ny)} ${r2(tx + dx)},${r2(ty + dy)} Q${r2(mx - nx)},${r2(my - ny)} ${r2(tx)},${r2(ty)} Z" fill="${c}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`; };
  return thick(`M${x},${y} Q${r2(x - 2)},${r2(y - h * 0.6)} ${r2(tx)},${r2(ty)}`, 3.4, WOOD.left) + fr(-16, 3, PINE.dark) + fr(16, 4, PINE.dark) + fr(-10, 10, PINE.mid) + fr(11, 10, PINE.mid) + fr(-6, -9, LEAVES.mid) + fr(7, -8, LEAVES.light);
};
const menhir = (u, v, h, w, lit) => {
  const [x, y] = at(u, v);
  return `<path d="M${r2(x - w)},${r2(y)} L${r2(x - w * 0.8)},${r2(y - h * 0.8)} Q${x},${r2(y - h - 3)} ${r2(x + w * 0.8)},${r2(y - h * 0.8)} L${r2(x + w)},${r2(y)} Q${x},${r2(y + w * 0.4)} ${r2(x - w)},${r2(y)} Z" fill="${GRANITE.left}" stroke="${OUT}" stroke-width="1.1"/>`
    + `<path d="M${r2(x + w * 0.2)},${r2(y - h - 1)} Q${r2(x + w * 0.8)},${r2(y - h * 0.8)} ${r2(x + w)},${r2(y)} L${r2(x + w * 0.3)},${r2(y + w * 0.3)} Z" fill="${GRANITE.right}"/>`
    + `<path d="M${r2(x - w * 0.3)},${r2(y - h * 0.62)} l${r2(w * 0.3)},-3 l${r2(w * 0.3)},3 M${r2(x)},${r2(y - h * 0.62 - 3)} l0,6" fill="none" stroke="${lit ? '#9FE8FF' : '#7E786E'}" stroke-width="${lit ? 1.1 : 0.7}" stroke-linecap="round"/>`
    + (lit ? glow(x, y - h * 0.6, 6, '160,230,255', 0.35) : '') + E(x - w * 0.4, y - h * 0.3, 1.8, 1, '#B7C46C', 0);
};

const LM = {};
LM.grotte = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  // Tertre de neige à trois bosses ; ombre en croissant côté droit (découpée dans le tertre), un seul trait autour
  const mound = `M${x - 52},${y + 6} Q${x - 56},${y - 22} ${x - 34},${y - 38} Q${x - 26},${y - 58} ${x - 2},${y - 56} Q${x + 18},${y - 66} ${x + 34},${y - 46} Q${x + 56},${y - 34} ${x + 52},${y - 4} Q${x + 50},${y + 10} ${x + 36},${y + 12} Q${x},${y + 22} ${x - 52},${y + 6} Z`;
  const id = `grotte-tertre-${f}`;
  const crystal = (cx, cy, h, w, lean = 0) => poly([[cx - w, cy], [cx + lean, cy - h], [cx, cy + w * 0.45]], ICE.left, 0) + poly([[cx, cy + w * 0.45], [cx + lean, cy - h], [cx + w, cy]], ICE.right, 0)
    + L([cx - w * 0.4, cy - h * 0.15], [cx - w * 0.1 + lean * 0.6, cy - h * 0.75], 'rgba(255,255,255,.85)', 0.8) + poly([[cx - w, cy], [cx + lean, cy - h], [cx + w, cy], [cx, cy + w * 0.45]], 'none', 0.9);
  let s = shadow(0, 0, 0.72, 0.14)
    + `<defs><clipPath id="${id}"><path d="${mound}"/></clipPath></defs>`
    + `<path d="${mound}" fill="${SNOW.right}"/>`
    + `<g clip-path="url(#${id})"><path d="${mound}" fill="${SNOW.left}" transform="translate(-6 -3)"/><path d="${mound}" fill="${SNOW.top}" transform="translate(-13 -6)"/>`
    // congères : quelques traits bleutés qui suivent le galbe
    + `<path d="M${x - 40},${y - 22} q10,-6 22,-4 M${x - 8},${y - 44} q10,-5 20,-2 M${x + 22},${y - 30} q9,-2 16,4 M${x - 30},${y - 2} q8,-3 14,-1" fill="none" stroke="#C9DCEB" stroke-width="1.2" stroke-linecap="round"/></g>`
    + `<path d="${mound}" fill="none" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/>`;
  // cristaux de glace sur le tertre
  s += crystal(x - 22, y - 44, 22, 5, -1) + crystal(x - 10, y - 50, 15, 4, 1) + crystal(x + 26, y - 40, 18, 4.5, 2);
  // bouche : arche au bord bleu glacé, fond sombre, lueur bleue, stalactites
  const mx = x + 4, my = y + 12;
  s += `<path d="M${mx - 20},${my} Q${mx - 21},${my - 36} ${mx},${my - 38} Q${mx + 21},${my - 36} ${mx + 20},${my} Z" fill="#8CCBE8" stroke="${OUT}" stroke-width="1.1"/>`
    + `<path d="M${mx - 15},${my} Q${mx - 15},${my - 29} ${mx},${my - 30} Q${mx + 15},${my - 29} ${mx + 15},${my} Z" fill="#2C5677"/>`
    + `<path d="M${mx - 10},${my} Q${mx - 9},${my - 20} ${mx},${my - 21} Q${mx + 9},${my - 20} ${mx + 10},${my} Z" fill="#183A55"/>`
    + E(mx, my - 8, 6, 3.4, `rgba(130,200,255,${f ? 0.55 : 0.35})`, 0);
  for (let i = 0; i < 6; i++) { const xx = mx - 12 + i * 4.8, yy = my - 27 + Math.abs(i - 2.5) * 2.4; s += poly([[xx - 2, yy], [xx + 2, yy], [xx, yy + 5 + (i % 2) * 3]], '#E8F6FF', 0.6); }
  // aiguilles de glace au pied
  for (const [dx, dy, h] of [[-42, 4, 13], [-35, 8, 8], [36, 8, 15], [43, 10, 9]]) s += crystal(x + dx, y + dy, h, 3);
  // le froid s'échappe de la bouche : deux volutes qui glissent vers la gauche et s'effacent
  const wisp = p => `<g opacity="${r2(0.8 * (1 - p * 0.8))}">${E(mx - 4 - p * 22, my - 9 - p * 9, 7 + p * 5, 3.2 + p * 2.4, 'rgba(234,246,255,.75)', 0)}${E(mx - p * 22, my - 12 - p * 9, 4.4 + p * 3, 2.4 + p * 1.6, 'rgba(255,255,255,.85)', 0)}${E(mx - 9 - p * 22, my - 7 - p * 9, 3.6 + p * 2, 2 + p * 1.2, 'rgba(255,255,255,.7)', 0)}</g>`;
  s += wisp(f ? 0.5 : 0) + wisp(f ? 0 : 0.5);
  return s + (f ? sparkle(x + 26, y - 58, 3) + sparkle(x - 34, y - 26, 2.2) : sparkle(x - 22, y - 66, 3) + sparkle(x + 40, y - 20, 2.2));
} };
LM.lac = { n: 2, draw: f => {
  // cabane du pêcheur au fond (porte, fenêtre), lac gelé, trou de pêche et canne, aiguilles puis blocs de glace taillés
  const hut = box(-0.62, -0.62, -0.36, -0.38, 0, 18, WOOD) + Dk.gable(-0.62, -0.62, -0.36, -0.38, 18, 11, { back: '#B9503B', front: '#E06E52', gable: '#E0A96C' }, 0.05);
  const [dx0, dy0] = at(-0.56, -0.38, 0), [wx, wy] = at(-0.36, -0.5, 9);
  let s = disc(0, 0, 0.75, 0, ICE.top, 1.2) + disc(-0.1, -0.08, 0.5, 0, '#DDF2FC', 0) + hut + `<path d="M${dx0},${dy0} l0,-11 l6,3 l0,11 Z" fill="#5A3A22" stroke="${OUT}" stroke-width="0.7"/>` + `<path d="M${wx - 0.5},${wy - 2} l4,-2 l0,4 l-4,2 Z" fill="#FFE6A3" stroke="${OUT}" stroke-width="0.6"/>`;
  for (const [u, v, h] of [[0.18, -0.62, 18], [0.3, -0.64, 12]]) { const [a2, b2] = at(u, v); s += poly([[a2 - 3, b2], [a2, b2 - h], [a2 + 3, b2]], ICE.left, 0.8) + poly([[a2, b2 - h], [a2 + 3, b2], [a2 + 0.6, b2]], ICE.right, 0); }
  const [x, y] = at(0.05, 0.08);
  s += E(x, y, 9, 4.4, '#2E6A9E', 1) + `<g opacity="0.6">${E(x - 8 + f * 16, y + 14, 4, 1.6, '#C9D8E6', 0)}</g>`;
  s += box(0.45, -0.5, 0.6, -0.35, 0, 8, ICE) + box(-0.62, 0.2, -0.4, 0.42, 0, 12, ICE);
  s += thick(`M${x + 22},${y - 6} L${x + 4},${y - 22}`, 1.2, WOOD_DARK.left) + `<path d="M${x + 4},${y - 22} Q${x - 2},${y - 12} ${x - 1},${y + f}" fill="none" stroke="${OUT}" stroke-width="0.5"/>` + E(x - 1, y + f - 1, 1.4, 1.4, '#E8483C', 0.6);
  return s;
} };
LM.col = { n: 2, draw: f => {
  let s = shadow(0, 0, 0.7, 0.1);
  const cairn = (u, v) => { const [x, y] = at(u, v); return [[0, 0, 9, 4.6], [1, -6, 7, 3.8], [0, -11, 5, 3], [1, -15, 3.4, 2.2]].map(([dx, dy, rx, ry]) => E(x + dx, y + dy, rx, ry, GRANITE.left, 1) + E(x + dx - rx * 0.3, y + dy - ry * 0.4, rx * 0.5, ry * 0.4, GRANITE.top, 0)).join(''); };
  s += cairn(-0.5, 0.2) + cairn(0.45, -0.3);
  const a = at(-0.5, 0.2, 24), b = at(0.45, -0.3, 26);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 8];
  s += `<path d="M${a[0]},${a[1]} Q${mid[0]},${mid[1]} ${b[0]},${b[1]}" fill="none" stroke="${OUT}" stroke-width="0.7"/>`;
  const cols = ['#E8566A', '#F2C04B', '#5C8FD0', '#7EC45B', '#B48AE0', '#F08A3A', '#FFFFFF'];
  for (let i = 1; i < 8; i++) { const t = i / 8, x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mid[0] + t * t * b[0], y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * mid[1] + t * t * b[1]; const sw = (f ? 1 : -1) * ((i % 2) ? 1.6 : -1); s += poly([[x - 2.6, y], [x + 2.6, y], [x + sw, y + 6]], cols[i - 1], 0.6); }
  const [px, py] = at(0.1, 0.45);
  s += `<rect x="${px - 0.9}" y="${py - 40}" width="1.8" height="40" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="0.6"/>`;
  const wl = f ? 18 : 14, droop = f ? 1 : 5;
  s += `<path d="M${px},${py - 40} L${px + wl},${py - 38 + droop} L${px + wl},${py - 33 + droop} L${px},${py - 33} Z" fill="#F08A3A" stroke="${OUT}" stroke-width="0.8"/>` + `<path d="M${px + wl * 0.4},${py - 39.4 + droop * 0.4} L${px + wl * 0.4},${py - 33.4 + droop * 0.4}" stroke="#FFFFFF" stroke-width="2"/>`;
  return s;
} };
const menhirsDraw = fleuri => f => {
  let s = shadow(0, 0, 0.75, 0.1) + (fleuri ? disc(0, 0, 0.62, 0, '#A8D878', 0.6) : '');
  const stones = [];
  for (let i = 0; i < 7; i++) { const a = (i / 7) * TAU - Math.PI / 2; stones.push([Math.cos(a) * 0.52, Math.sin(a) * 0.52, 26 + (i % 3) * 5, i]); }
  const lit = i => (i === f * 3 || i === f * 3 + 1 || fleuri);
  s += stones.filter(([, v]) => v < 0).map(([u, v, h, i]) => menhir(u, v, h, 6, lit(i))).join('');
  s += box(-0.16, -0.1, 0.16, 0.1, 6, 10, GRANITE) + box(-0.08, -0.06, -0.04, 0.06, 0, 6, GRANITE, 0.7) + box(0.04, -0.06, 0.08, 0.06, 0, 6, GRANITE, 0.7);
  s += stones.filter(([, v]) => v >= 0).map(([u, v, h, i]) => menhir(u, v, h, 6, lit(i))).join('');
  if (fleuri) {
    for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU; const [x, y] = at(Math.cos(a) * 0.66, Math.sin(a) * 0.66); s += flower(x, y - 2, 1.6, ['#F7C6D9', '#FFFFFF', '#F2C94C', '#B48AE0'][i % 4]); }
    const [tx, ty] = at(0, 0, 10);
    s += [-8, 0, 8].map(dx => flower(tx + dx, ty - 1, 1.6, '#F7C6D9')).join('') + glow(tx, ty - 10, 26, '255,236,150', 0.22);
  }
  return s;
};
LM.menhirs = { n: 2, draw: menhirsDraw(false) };
LM.menhirs_fleuri = { n: 2, draw: menhirsDraw(true) };
LM.arche = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = E(x, y + 6, 54, 16, '#7FB8E0', 1) + E(x - 6, y + 4, 36, 9, '#A8D4F0', 0);
  const rock = `M${x - 46},${y + 8} L${x - 44},${y - 40} Q${x - 30},${y - 60} ${x},${y - 60} Q${x + 34},${y - 58} ${x + 46},${y - 38} L${x + 48},${y + 8} L${x + 22},${y + 10} L${x + 20},${y - 14} Q${x},${y - 34} ${x - 18},${y - 14} L${x - 20},${y + 10} Z`;
  s += `<path d="${rock}" fill="#C8B08E" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/>`;
  s += `<defs><clipPath id="arc${f}"><path d="${rock}"/></clipPath></defs><g clip-path="url(#arc${f})"><rect x="${x + 14}" y="${y - 70}" width="40" height="90" fill="#A8906E"/>${[-30, -14, 2].map(dy => `<path d="M${x - 50},${y + dy} Q${x},${y + dy + 4} ${x + 50},${y + dy - 2}" stroke="#A8906E" stroke-width="0.8" fill="none"/>`).join('')}</g>`;
  s += `<path d="M${x - 44},${y - 40} Q${x - 30},${y - 62} ${x},${y - 62} Q${x + 34},${y - 60} ${x + 46},${y - 38} Q${x + 30},${y - 50} ${x},${y - 52} Q${x - 26},${y - 52} ${x - 44},${y - 40} Z" fill="#7EC45B" stroke="${OUT}" stroke-width="1"/>`;
  s += `<path d="M${x - 16},${y + 10} q-6,4 -14,2 M${x + 20},${y + 11} q8,3 16,1" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  return s + gull(x + 8, y - 64, f);
} };
LM.saule = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = E(x + 14, y + 8, 30, 10, '#8FC8E0', 1) + E(x + 10, y + 6, 20, 6, '#B6E0F0', 0) + shadow(-0.1, 0, 0.5, 0.15);
  s += `<path d="M${x - 9},${y + 2} Q${x - 14},${y - 20} ${x - 6},${y - 40} L${x + 6},${y - 40} Q${x + 2},${y - 24} ${x + 10},${y + 3} Q${x},${y + 7} ${x - 9},${y + 2} Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="1.2"/>` + `<path d="M${x - 6},${y - 10} q4,-4 2,-10 M${x + 2},${y - 22} q-3,-4 0,-8" stroke="${WOOD_DARK.right}" stroke-width="1" fill="none"/>`;
  s += crown([[-22, -52, 18], [20, -54, 19], [0, -66, 20], [-4, -46, 16]], { light: '#C8EE9A', mid: '#9CD06E', dark: '#6FAE4E' }, 'sa' + f);
  for (let i = 0; i < 12; i++) { const xx = x - 38 + i * 7, sw = (f ? 1.6 : -1.2) * ((i % 2) ? 1 : 0.6), len = 30 + (i % 3) * 8; s += thick(`M${xx},${y - 48} q${sw},${len * 0.5} ${sw * 1.8},${len}`, 1.2, '#9CD06E'); }
  return s;
} };
LM.pilotis = { n: 2, draw: f => {
  let s = disc(0, 0, 0.72, 0, '#6FA8C8', 1) + disc(-0.08, -0.05, 0.5, 0, '#8FC8E0', 0);
  for (const [u, v] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) s += post(u, v, -4, 20, WOOD_DARK, 0.03);
  s += box(-0.32, -0.32, 0.32, 0.32, 20, 23, WOOD) + box(-0.24, -0.24, 0.24, 0.24, 23, 42, WOOD) + Dk.gable(-0.24, -0.24, 0.24, 0.24, 42, 16, { back: '#C99A45', front: '#EBC46F', gable: '#F3E4C4' }, 0.07);
  const [dx, dy] = at(0, 0.24, 30);
  s += `<rect x="${dx - 3}" y="${dy - 9}" width="6" height="11" fill="#5A3A22" stroke="${OUT}" stroke-width="0.8"/>`;
  const [lx, ly] = at(0.24, 0.24, 36);
  s += glow(lx + 4, ly + 2, 10, '255,224,138', 0.35) + poly([[lx + 2, ly - 2], [lx + 7, ly - 2], [lx + 7, ly + 5], [lx + 2, ly + 5]], '#FFE08A', 0.8);
  const [bx, by] = at(0.45, 0.4, 0);
  s += `<path d="M${bx - 12},${by - 3} L${bx + 12},${by - 3} Q${bx + 9},${by + 3} ${bx},${by + 3} Q${bx - 9},${by + 3} ${bx - 12},${by - 3} Z" fill="${WOOD.left}" stroke="${OUT}" stroke-width="1"/>`;
  for (let i = 0; i < 4; i++) { const a = (i / 4 + f / 8) * TAU, [fx, fy] = at(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 34 + (i % 2) * 8); s += glow(fx, fy, 3, '255,236,150', 0.45) + E(fx, fy, 0.9, 0.9, '#FFF3A8', 0.3); }
  return s;
} };
LM.oasis = { n: 2, draw: f => {
  let s = disc(0, 0, 0.72, 0, SAND.top, 1) + disc(0, 0.04, 0.48, 0, WATER, 1) + disc(-0.06, 0, 0.32, 0, WATER_LIGHT, 0);
  const [x, y] = at(0, 0.04);
  s += boulder(0, 0.04, 0.1, 0.08, 8, GRANITE, 3) + thick(`M${x},${y - 9} Q${x - 4},${y - 18 - f * 3} ${x - 9},${y - 6}`, 1.4, WATER_LIGHT) + thick(`M${x},${y - 9} Q${x + 4},${y - 18 - f * 3} ${x + 9},${y - 6}`, 1.4, WATER_LIGHT);
  for (const [u, v] of [[-0.18, 0.2], [0.2, 0.18]]) { const [lx, ly] = at(u, v); s += [0, 60, 120, 180, 240, 300].map(a => `<g transform="translate(${lx} ${ly}) rotate(${a})">${P('M0,0 Q1.4,-2 0,-3.6 Q-1.4,-2 0,0 Z', '#F7B6CE', 0.5)}</g>`).join(''); }
  for (const [u, v, h] of [[-0.5, -0.3, 44], [0.5, -0.2, 50], [0.42, 0.45, 40]]) { const [px, py] = at(u, v); s += palm(px, py, h, f ? 1.4 : -1); }
  return s;
} };
LM.pyramide = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = `<path d="M${x - 62},${y + 6} Q${x - 30},${y - 14} ${x},${y - 6} Q${x + 34},${y - 18} ${x + 62},${y + 4} Q${x},${y + 22} ${x - 62},${y + 6} Z" fill="${SAND.top}" stroke="${OUT}" stroke-width="1.1"/>`;
  s += poly([[x - 34, y - 6], [x, y - 64], [x + 34, y - 8], [x, y + 4]], SAND.left, 1.2) + poly([[x, y - 64], [x + 34, y - 8], [x, y + 4]], SAND.right, 0);
  for (let i = 1; i < 6; i++) { const t = i / 6; s += `<path d="M${r2(x - 34 * (1 - t))},${r2(y - 6 - 58 * t + 10 * t * 0)} L${x},${r2(y + 4 - 68 * t)} L${r2(x + 34 * (1 - t))},${r2(y - 8 - 56 * t)}" stroke="${SAND.right}" stroke-width="0.6" fill="none"/>`; }
  s += poly([[x - 7, y - 52], [x, y - 64], [x + 7, y - 52], [x, y - 49]], '#F6C744', 1) + (f ? sparkle(x - 2, y - 60, 4) + glow(x, y - 58, 10, '255,220,120', 0.3) : '');
  s += `<path d="M${x - 62},${y + 6} Q${x - 30},${y - 2} ${x},${y + 6} Q${x + 34},${y - 4} ${x + 62},${y + 4} Q${x},${y + 22} ${x - 62},${y + 6} Z" fill="${SAND.top}" stroke="${OUT}" stroke-width="1.1"/>`;
  s += [0, 1, 2].map(i => `<path d="M${x + 14 + i * 8 + f * 6},${y - 20 + i * 4} q6,-2 12,0" stroke="#FFF4D8" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.8"/>`).join('');
  return s;
} };
LM.arbre = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  let s = shadow(0, 0, 0.75, 0.15);
  s += `<path d="M${x - 30},${y + 6} Q${x - 16},${y - 4} ${x - 14},${y - 30} L${x - 12},${y - 70} L${x + 12},${y - 70} L${x + 14},${y - 30} Q${x + 18},${y - 4} ${x + 32},${y + 6} Q${x},${y + 14} ${x - 30},${y + 6} Z" fill="${WOOD_DARK.left}" stroke="${OUT}" stroke-width="1.3"/>`;
  s += `<path d="M${x + 4},${y - 70} L${x + 12},${y - 70} L${x + 14},${y - 30} Q${x + 18},${y - 4} ${x + 32},${y + 6} Q${x + 14},${y + 11} ${x + 6},${y + 12} Z" fill="${WOOD_DARK.right}"/>`;
  s += `<path d="M${x - 4},${y + 10} L${x - 3},${y - 4} Q${x + 3},${y - 10} ${x + 7},${y - 4} L${x + 8},${y + 10} Z" fill="#3A2412" stroke="${OUT}" stroke-width="0.9"/>`;
  s += crown([[-34, -82, 22], [32, -84, 23], [0, -102, 26], [-14, -74, 20], [16, -74, 20]], { light: '#9CD06E', mid: '#5FA04A', dark: '#3F7A34' }, 'ag' + f);
  for (const [dx, len] of [[-26, 36], [-8, 46], [22, 40]]) s += thick(`M${x + dx},${y - 68} q${f ? 2 : -2},${len * 0.5} 0,${len}`, 1, '#4F8F3A') + E(x + dx, y - 68 + len, 1.6, 1.6, '#4F8F3A', 0.6);
  const [px, py] = [x + 24, y - 64];
  return s + E(px, py, 3.6, 4.6, '#E8483C', 0.9) + E(px + 2.4, py - 4, 2.4, 2.4, '#E8483C', 0.8) + P(`M${px + 4.4},${py - 4.6} l2,1 l-2,1 Z`, '#F2C94C', 0.5) + P(`M${px - 2},${py + 3} L${px - 4},${py + 10} L${px},${py + 4} Z`, '#5C8FD0', 0.7) + E(px + 2.8, py - 4.6, 0.5, 0.5, OUT, 0);
} };
LM.cascade = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  // large paroi à trois paliers au fond, l'eau tombe au milieu dans un bassin, embruns et arc-en-ciel
  const tiers = [[-6, 30], [-36, 26], [-64, 24]];
  let s = '';
  s += `<path d="M${x - 62},${y - 4} L${x - 62},${y - 96} L${x + 62},${y - 96} L${x + 62},${y - 4} Q${x},${y + 8} ${x - 62},${y - 4} Z" fill="#A8906E" stroke="${OUT}" stroke-width="1.2"/>`;
  s += `<path d="M${x + 20},${y - 96} L${x + 62},${y - 96} L${x + 62},${y - 4} Q${x + 40},${y + 2} ${x + 20},${y + 3} Z" fill="#86704F"/>`;
  for (const [dy] of tiers) s += `<path d="M${x - 62},${y + dy - 26} Q${x},${y + dy - 22} ${x + 62},${y + dy - 26}" stroke="#7A6448" stroke-width="1" fill="none"/>`;
  s += `<path d="M${x - 66},${y - 96} Q${x},${y - 112} ${x + 66},${y - 96} Q${x},${y - 88} ${x - 66},${y - 96} Z" fill="#7EC45B" stroke="${OUT}" stroke-width="1.1"/>`;
  s += [[-48, -100], [44, -102]].map(([dx, dy]) => crown([[dx - 5, dy, 6], [dx + 5, dy - 1, 6.4], [dx, dy - 6, 7]], LEAVES, 'cs' + dx + f)).join('');
  s += `<path d="M${x - 12},${y - 98} L${x + 12},${y - 98} L${x + 14},${y - 8} L${x - 14},${y - 8} Z" fill="#E8F6FF" stroke="${OUT}" stroke-width="0.9"/>`;
  for (let i = 0; i < 5; i++) { const xx = x - 9 + i * 4.6, off = (f * 11 + i * 9) % 22; s += `<path d="M${xx},${y - 96 + off} L${xx + 0.4},${y - 60 + off}" stroke="#9AD6F0" stroke-width="1.5"/>`; }
  s += E(x, y + 2, 40, 12, WATER, 1) + E(x - 6, y + 1, 26, 6, WATER_LIGHT, 0) + puff(x - 6, y - 8, 8, 0.85) + puff(x + 9, y - 12 - f * 2, 6, 0.75);
  // arc-en-ciel entier dans les embruns, au pied de la chute (devant le rideau d'eau, comme dans le jeu)
  s += `<g opacity="0.6">${['#E8566A', '#F2A03C', '#F2D04B', '#7EC45B', '#5C8FD0', '#8C6FD0'].map((c, i) => { const r = 40 - i * 2.6; return `<path d="M${r2(x - r)},${y - 4} A${r2(r)},${r2(r * 0.85)} 0 0 1 ${r2(x + r)},${y - 4}" stroke="${c}" stroke-width="2.6" fill="none"/>`; }).join('')}</g>`;
  return s;
} };
LM.geyser = { n: 2, draw: f => {
  let s = '';
  for (const [r, z] of [[0.7, 0], [0.54, 4], [0.38, 8]]) s += Dk.cylinder(0, 0, r, z, z + 4, SALT, 1);
  s += disc(0, 0, 0.22, 12, '#4FB8E0', 1) + disc(-0.03, -0.02, 0.12, 12, '#9AE0F8', 0);
  const [x, y] = at(0, 0, 12);
  if (f) s += `<path d="M${x - 5},${y} Q${x - 7},${y - 40} ${x - 2},${y - 70} L${x + 2},${y - 70} Q${x + 7},${y - 40} ${x + 5},${y} Z" fill="#E8F6FF" stroke="${OUT}" stroke-width="0.9"/>` + puff(x, y - 72, 9, 0.9) + puff(x - 10, y - 60, 6, 0.8) + puff(x + 10, y - 62, 6, 0.8);
  else s += puff(x - 2, y - 8, 6, 0.75) + puff(x + 4, y - 18, 5, 0.6);
  return s;
} };
LM.cratere = { n: 2, draw: f => {
  let s = Dk.cylinder(0, 0, 0.7, 0, 9, BASALT, 1.2) + disc(0, 0, 0.52, 9, '#E8573A', 1) + disc(-0.05, -0.04, 0.34, 9, '#F7A23B', 0) + disc(-0.08, -0.06, 0.16, 9, '#FFE08A', 0);
  const [x, y] = at(0, 0, 9);
  s += glow(x, y - 4, 40, '255,140,60', 0.25);
  s += (f ? [[-10, 2, 3], [12, -3, 2.4]] : [[4, 4, 2.6], [-14, -2, 2]]).map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.7, '#FFB04A', 0.8)).join('');
  for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU; const [bx, by] = at(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 9); s += E(bx, by - 1.6, 5, 3, BASALT.top, 0.9); }
  const smoke = (cx, cy, r, a) => `<g opacity="${a}">${E(cx, cy, r, r * 0.72, 'rgba(120,112,124,.7)', 0)}${E(cx + r * 0.6, cy - r * 0.3, r * 0.7, r * 0.55, 'rgba(150,142,152,.7)', 0)}${E(cx - r * 0.5, cy - r * 0.25, r * 0.6, r * 0.5, 'rgba(165,158,168,.6)', 0)}</g>`;
  s += smoke(x - 6, y - 22 - f * 6, 7, 0.75) + smoke(x + 3, y - 36 - f * 6, 6, 0.5);
  return s;
} };

module.exports = { LM, LAND };
