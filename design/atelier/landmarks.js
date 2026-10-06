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
// une pierre levée : flancs bosselés, pan d'ombre à droite, reflet à gauche, lichens, mousse au pied, touffe ; sa
// spirale gravée, turquoise et lumineuse quand elle s'allume
const menhir = (u, v, h, w, lit, lean, id) => {
  const [x, y] = at(u, v), xy = p => p.map(r2).join(',');
  const pts = [[x - w, y], [x - w * 1.06 + lean * 0.35, y - h * 0.45], [x - w * 0.8 + lean * 0.85, y - h * 0.86], [x + lean, y - h - 2], [x + w * 0.82 + lean * 0.85, y - h * 0.82], [x + w * 1.04 + lean * 0.35, y - h * 0.42], [x + w, y]];
  let d = `M${xy(pts[0])}`;
  for (let i = 1; i < pts.length - 1; i++) d += ` Q${xy(pts[i])} ${r2((pts[i][0] + pts[i + 1][0]) / 2)},${r2((pts[i][1] + pts[i + 1][1]) / 2)}`;
  d += ` L${xy(pts[6])} Q${x},${r2(y + w * 0.5)} ${xy(pts[0])} Z`;
  const [gx, gy] = [r2(x - w * 0.1 + lean * 0.5), r2(y - h * 0.55)];
  return `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="${GRANITE.left}"/><g clip-path="url(#${id})">`
    + `<path d="M${r2(x + w * 0.15 + lean * 0.9)},${r2(y - h - 6)} L${r2(x + w * 1.4)},${r2(y - h - 6)} L${r2(x + w * 1.4)},${r2(y + w)} L${r2(x + w * 0.22)},${r2(y + w)} Q${r2(x + w * 0.4 + lean * 0.4)},${r2(y - h * 0.45)} ${r2(x + w * 0.15 + lean * 0.9)},${r2(y - h - 6)} Z" fill="${GRANITE.right}"/>`
    + `<path d="M${r2(x - w * 0.62 + lean * 0.8)},${r2(y - h * 0.8)} Q${r2(x - w * 0.9 + lean * 0.3)},${r2(y - h * 0.45)} ${r2(x - w * 0.72)},${r2(y - h * 0.12)}" stroke="${GRANITE.top}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    + E(x - w * 0.4 + lean * 0.4, y - h * 0.3, 1.8, 1.1, '#C8C27A', 0) + E(x + w * 0.3 + lean * 0.7, y - h * 0.74, 1.3, 0.8, '#E0DDB0', 0) + E(x - w * 0.2 + lean * 0.8, y - h * 0.82, 0.9, 0.6, '#C8C27A', 0)
    + `<path d="M${r2(x + w * 0.5 + lean * 0.5)},${r2(y - h * 0.36)} l-1.2,3 l1,2.4" stroke="#6A655C" stroke-width="0.7" fill="none" stroke-linecap="round"/>`
    + `<path d="M${r2(x - w * 1.2)},${r2(y + 1)} Q${r2(x - w * 0.8)},${r2(y - 4.4)} ${r2(x - w * 0.35)},${r2(y - 2.2)} Q${r2(x)},${r2(y - 5)} ${r2(x + w * 0.4)},${r2(y - 2)} Q${r2(x + w * 0.8)},${r2(y - 4)} ${r2(x + w * 1.2)},${r2(y + 1)} L${r2(x + w * 1.2)},${r2(y + w)} L${r2(x - w * 1.2)},${r2(y + w)} Z" fill="#7FA35A"/>`
    + `<path d="M${r2(x - w * 0.8)},${r2(y - 3.2)} q${r2(w * 0.3)},-1.4 ${r2(w * 0.5)},-0.6" stroke="#A8CC78" stroke-width="1" fill="none" stroke-linecap="round"/></g>`
    + `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<path d="M${gx},${gy} m-1.9,0 a1.9,1.9 0 1 1 1.9,1.9 a3,3 0 1 1 -3,-3" stroke="${lit ? '#6FF0D8' : '#857F74'}" stroke-width="${lit ? 1.3 : 0.9}" fill="none" stroke-linecap="round"/>`
    + (lit ? glow(gx, gy, 7, '120,235,215', 0.4) : '')
    + `<path d="M${r2(x + w * 0.9)},${r2(y + 1.5)} l-0.6,-4 M${r2(x + w * 1.1)},${r2(y + 1.5)} l0.8,-3.4 M${r2(x + w * 1.3)},${r2(y + 1.6)} l1.4,-2.4" stroke="#6E9A4A" stroke-width="0.9" stroke-linecap="round"/>`;
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
// Lac gelé : une nappe de glace aux rives bosselées sous un bourrelet de neige, ses craquelures et ses reflets ; une
// cabane de pêcheur au toit enneigé, sa cheminée qui fume, sa fenêtre chaude ; un trou de pêche, la canne posée sur sa
// fourche et son bouchon qui danse ; un seau d'où dépasse une queue de poisson ; des blocs taillés, des aiguilles de
// glace ; sous la glace, un poisson d'argent qui tourne (2 images)
const NEIGE_TOIT = { back: '#E3EEF6', front: '#FFFFFF', gable: '#C98A52' };
LM.lac = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  // la nappe de glace sous son bourrelet de neige
  const rive = (rx, ry, n, k) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.035) + (i % 5 ? 0 : 0.05) * k; return [x + Math.cos(t) * rx * r, y + 2 + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  let s = shadow(0, 0, 0.74, 0.08) + `<path d="${rive(64, 29, 18, 1)}" fill="#FFFFFF" stroke="${OUT}" stroke-width="1.1"/>` + `<path d="${rive(54, 23, 16, 0)}" fill="#CFEAF7" stroke="#9FC9E2" stroke-width="0.9"/>`
    + E(x + 6, y + 5, 30, 10, '#B4DDF0', 0) + E(x - 14, y - 4, 16, 4, '#E9F8FF', 0);
  // le poisson d'argent qui tourne sous la glace
  const ang = f ? 2.4 : 0.6, [fx, fy] = [x + 10 + Math.cos(ang) * 16, y + 6 + Math.sin(ang) * 6];
  s += `<g transform="translate(${r2(fx)} ${r2(fy)}) scale(${f ? -1 : 1} 1)" opacity="0.55">` + E(0, 0, 4, 1.6, '#8FA6B8', 0) + P('M-3.4,0 L-6,-1.8 L-5.4,0 L-6,1.8 Z', '#8FA6B8', 0) + '</g>';
  // les craquelures et les reflets de la glace
  s += `<path d="M${x - 30},${y + 8} l8,-3 l5,2 l7,-4 M${x + 18},${y + 14} l6,-4 l8,1 M${x + 28},${y - 6} l-5,-4 l3,-5" stroke="#9FC9E2" stroke-width="0.8" fill="none" stroke-linejoin="round"/>`
    + `<path d="M${x - 24},${y - 6} l10,-4 M${x - 20},${y - 3} l6,-2.4 M${x + 6},${y + 18} l9,-3.6" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`;
  // la cabane du pêcheur au fond, son toit enneigé, sa fenêtre chaude, sa cheminée qui fume
  s += box(-0.6, -0.6, -0.34, -0.36, 0, 16, WOOD) + Dk.gable(-0.62, -0.62, -0.32, -0.34, 16, 10, NEIGE_TOIT, 0.05);
  const [dx0, dy0] = at(-0.54, -0.36, 0), [wx, wy] = at(-0.34, -0.5, 8);
  s += `<path d="M${dx0},${dy0} l0,-10 l5,2.5 l0,10 Z" fill="#5A3A22" stroke="${OUT}" stroke-width="0.7"/>` + `<path d="M${wx - 0.4},${wy - 2} l4,-2 l0,4 l-4,2 Z" fill="#FFD27A" stroke="${OUT}" stroke-width="0.6"/>`
    + box(-0.4, -0.58, -0.35, -0.53, 22, 30, { top: '#9A8E80', left: '#7E7266', right: '#5E554B' }, 0.7);
  const [cx, cy] = at(-0.375, -0.555, 30);
  s += puff(cx + (f ? 3 : 1), cy - 6 - f * 4, 3.4, 0.85) + puff(cx + (f ? 7 : 4), cy - 14 - f * 3, 2.4, 0.6);
  // les aiguilles de glace et les blocs taillés
  for (const [u, v, h] of [[0.2, -0.62, 20], [0.3, -0.64, 13], [0.12, -0.66, 10]]) { const [a2, b2] = at(u, v); s += poly([[a2 - 3, b2], [a2, b2 - h], [a2 + 3, b2]], ICE.left, 0.8) + poly([[a2, b2 - h], [a2 + 3, b2], [a2 + 0.6, b2]], ICE.right, 0) + L([a2 - 1.4, b2 - 2], [a2 - 0.4, b2 - h * 0.6], '#FFFFFF', 0.6); }
  s += box(0.46, -0.48, 0.6, -0.34, 0, 7, ICE, 0.9) + box(0.48, -0.46, 0.58, -0.36, 7, 13, ICE, 0.9) + box(-0.62, 0.2, -0.42, 0.4, 0, 10, ICE, 0.9);
  // le trou de pêche, la canne sur sa fourche, le bouchon qui danse, le seau
  const [hx, hy] = at(0.06, 0.1);
  s += E(hx, hy, 10.4, 5, '#F4FBFF', 0.8) + E(hx, hy + 0.4, 8.4, 3.8, '#2E6A9E', 0) + E(hx - 2.4, hy - 0.6, 3, 0.8, '#5A90C0', 0);
  s += thick(`M${hx + 22},${hy - 2} L${hx + 22.4},${hy - 9}`, 0.7, WOOD_DARK.left) + thick(`M${hx + 26},${hy + 1} L${hx + 4},${hy - 20}`, 1, WOOD_DARK.left)
    + `<path d="M${hx + 4},${hy - 20} Q${hx - 2},${hy - 12} ${hx - 1},${hy - 1 + f}" fill="none" stroke="${OUT}" stroke-width="0.45"/>`
    + E(hx - 1, hy - 1 + f, 1.5, 1.3, '#E8483C', 0.6) + `<path d="M${hx - 2.4},${hy - 1.2 + f} h2.8" stroke="#FFFFFF" stroke-width="0.7"/>`
    + E(hx - 1, hy + 1.4, 3 + f, 1 + f * 0.4, 'none', 0).replace('stroke="none"', 'stroke="#9FC9E2" stroke-width="0.5"');
  const [bx, by] = at(-0.16, 0.34);
  return s + P(`M${bx - 4},${by - 7} L${bx + 4},${by - 7} L${bx + 3.2},${by} L${bx - 3.2},${by} Z`, '#8FA0B0', 0.8) + E(bx, by - 7, 4, 1.4, '#5E6E7E', 0.6)
    + P(`M${bx + 0.4},${by - 7.4} L${bx + 2.6},${by - 12} L${bx + 4.4},${by - 11} Z`, '#B8C8D6', 0.6) + L([bx - 3.6, by - 3.6], [bx + 3.6, by - 3.6], '#6E7E8E', 0.6);
} };
// Col du Vent : un replat d'herbe rase et de rocaille sur le col, des touffes et des edelweiss ; deux cairns de pierres
// plates ; entre eux, une corde de fanions qui claquent ; une manche à air rayée au bout de sa perche, gonflée puis
// retombante ; des traits de vent qui passent (2 images)
const ROCAILLE = [['#B9B2A6', '#D8D2C6', '#8E877B'], ['#A9A69F', '#CBC8C0', '#817E77'], ['#BDB4A2', '#DCD3C1', '#938A78']];
const galet = (x, y, rx, ry, [c, l, d]) => P(`M${r2(x - rx)},${r2(y)} Q${r2(x - rx)},${r2(y - ry * 1.5)} ${r2(x)},${r2(y - ry * 1.6)} Q${r2(x + rx)},${r2(y - ry * 1.5)} ${r2(x + rx)},${r2(y)} Q${r2(x + rx * 0.9)},${r2(y + ry * 0.9)} ${r2(x)},${r2(y + ry)} Q${r2(x - rx * 0.9)},${r2(y + ry * 0.9)} ${r2(x - rx)},${r2(y)} Z`, c, 0.9)
  + `<path d="M${r2(x - rx * 0.7)},${r2(y + ry * 0.45)} Q${r2(x)},${r2(y + ry * 1.05)} ${r2(x + rx * 0.85)},${r2(y + ry * 0.2)} Q${r2(x + rx * 0.8)},${r2(y + ry * 0.7)} ${r2(x)},${r2(y + ry * 0.92)} Q${r2(x - rx * 0.6)},${r2(y + ry * 0.8)} ${r2(x - rx * 0.7)},${r2(y + ry * 0.45)} Z" fill="${d}"/>`
  + E(x - rx * 0.3, y - ry * 0.75, rx * 0.45, ry * 0.4, l, 0);
const edelweiss = (x, y) => [0, 1, 2, 3, 4, 5].map(i => { const a = (i / 6) * TAU; return E(x + Math.cos(a) * 1.5, y + Math.sin(a) * 1, 1.1, 0.7, '#FFFFFF', 0.45); }).join('') + E(x, y, 0.8, 0.6, '#F2C94C', 0.3);
LM.col = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  // le replat d'herbe rase, sa rocaille, ses touffes et ses edelweiss
  const bord = Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * TAU, r = 1 + (i % 2 ? 0.05 : -0.04) + (i % 5 ? 0 : 0.06); return [x + Math.cos(t) * 62 * r, y + 2 + Math.sin(t) * 27 * r]; });
  const mil = i => { const p = bord[i % 16], q = bord[(i + 1) % 16]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; };
  let d = `M${mil(15)}`;
  for (let i = 0; i < 16; i++) d += ` Q${r2(bord[i][0])},${r2(bord[i][1])} ${mil(i)}`;
  let s = shadow(0, 0, 0.7, 0.08) + P(`${d} Z`, '#B9D48C', 0.9) + E(x - 8, y - 2, 40, 15, '#C9E0A0', 0);
  s += [[-40, 8, 4, 0], [36, 12, 3.4, 2], [-18, 18, 3, 1], [48, -2, 2.6, 0], [-50, -4, 2.4, 2], [14, -16, 2.2, 1]].map(([dx, dy, r, k]) => galet(x + dx, y + dy, r * 1.4, r * 0.75, ROCAILLE[k])).join('');
  s += [[-30, 14], [24, 18], [6, -10]].map(([dx, dy]) => `<path d="M${x + dx - 3},${y + dy} q-0.6,-3.6 -2.4,-5 M${x + dx},${y + dy} q0.2,-4.4 1,-6.4 M${x + dx + 3},${y + dy} q1,-3 3,-4" stroke="#6E9E4A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`).join('')
    + edelweiss(x - 24, y + 8) + edelweiss(x + 30, y + 6) + edelweiss(x - 6, y + 20);
  // les deux cairns de pierres plates
  const cairn = (u, v, k) => { const [cx, cy] = at(u, v); return [[0, 0, 11, 4, 0], [1.2, -6.6, 8.6, 3.4, 2], [-0.8, -12, 7, 3, 1], [1, -16.8, 5.4, 2.4, 0], [0, -20.6, 3.8, 1.9, 2]].map(([dx, dy, rx, ry, c]) => galet(cx + dx, cy + dy, rx, ry, ROCAILLE[(c + k) % 3])).join(''); };
  // les crêtes rocheuses du col, au fond, et leur neige
  const crete = (u, v, k) => { const [cx, cy] = at(u, v); return P(`M${r2(cx - 16 * k)},${r2(cy)} L${r2(cx - 11 * k)},${r2(cy - 16 * k)} L${r2(cx - 4 * k)},${r2(cy - 22 * k)} L${r2(cx + 2 * k)},${r2(cy - 30 * k)} L${r2(cx + 9 * k)},${r2(cy - 20 * k)} L${r2(cx + 15 * k)},${r2(cy - 12 * k)} L${r2(cx + 17 * k)},${r2(cy)} Q${r2(cx)},${r2(cy + 4 * k)} ${r2(cx - 16 * k)},${r2(cy)} Z`, '#A9A69F', 1)
    + `<path d="M${r2(cx + 2 * k)},${r2(cy - 30 * k)} L${r2(cx + 9 * k)},${r2(cy - 20 * k)} L${r2(cx + 15 * k)},${r2(cy - 12 * k)} L${r2(cx + 17 * k)},${r2(cy)} Q${r2(cx + 8 * k)},${r2(cy + 2.6 * k)} ${r2(cx + 2 * k)},${r2(cy + 3 * k)} L${r2(cx + 4 * k)},${r2(cy - 14 * k)} Z" fill="#817E77"/>`
    + P(`M${r2(cx - 4 * k)},${r2(cy - 22 * k)} L${r2(cx + 2 * k)},${r2(cy - 30 * k)} L${r2(cx + 7 * k)},${r2(cy - 23 * k)} L${r2(cx + 3 * k)},${r2(cy - 24.6 * k)} L${r2(cx)},${r2(cy - 21 * k)} L${r2(cx - 2 * k)},${r2(cy - 22.6 * k)} Z`, '#FFFFFF', 0.7); };
  s += crete(-0.62, -0.5, 1.1) + crete(0.06, -0.7, 0.85);
  s += cairn(-0.5, 0.2, 0);
  // la corde de fanions tendue d'un cairn à l'autre
  const a = at(-0.5, 0.2, 18), b = at(0.45, -0.32, 18), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 9];
  s += `<path d="M${r2(a[0])},${r2(a[1])} Q${r2(m[0])},${r2(m[1])} ${r2(b[0])},${r2(b[1])}" fill="none" stroke="${OUT}" stroke-width="0.7"/>`;
  const cols = ['#E8566A', '#F2C04B', '#5C8FD0', '#7EC45B', '#FFFFFF', '#E8566A', '#F2C04B', '#5C8FD0'];
  cols.forEach((c, i) => { const t = (i + 1) / 9, qx = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * m[0] + t * t * b[0], qy = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * m[1] + t * t * b[1], sw = (f ? 1.8 : -1.2) * (i % 2 ? 1 : -0.6); s += P(`M${r2(qx - 2.6)},${r2(qy)} L${r2(qx + 2.6)},${r2(qy)} L${r2(qx + 2.2)},${r2(qy + 5.4)} L${r2(qx + sw)},${r2(qy + 3.8)} L${r2(qx - 2.2)},${r2(qy + 5.4)} Z`, c, 0.6); });
  s += cairn(0.45, -0.32, 1);
  // la manche à air au bout de sa perche, gonflée par le vent puis retombante
  const [px, py] = at(0.16, 0.44), top = py - 44;
  s += L([px, py], [px, top], WOOD_DARK.left, 1.4) + E(px, py, 2.2, 1, '#8A7A62', 0.6) + E(px, top - 1, 1.4, 1.4, '#E2B546', 0.6);
  const len = f ? 20 : 15, drop = f ? 1 : 8, seg = 4;
  for (let i = 0; i < seg; i++) {
    const t0 = i / seg, t1 = (i + 1) / seg, h0 = 3.4 - t0 * 1.6, h1 = 3.4 - t1 * 1.6, x0 = px + 1 + len * t0, x1 = px + 1 + len * t1, y0 = top + 3 + drop * t0 * t0, y1 = top + 3 + drop * t1 * t1;
    s += P(`M${r2(x0)},${r2(y0 - h0)} L${r2(x1)},${r2(y1 - h1)} L${r2(x1)},${r2(y1 + h1)} L${r2(x0)},${r2(y0 + h0)} Z`, i % 2 ? '#FFFFFF' : '#E8566A', 0.7);
  }
  s += E(px + 1.4, top + 3, 1.2, 3.4, '#C8402E', 0.6);
  // les traits de vent qui passent
  return s + (f ? [[-40, -40], [10, -58], [-10, -24]] : [[-56, -34], [-6, -52], [20, -30]]).map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q10,-4 20,0 q6,2 10,-2" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.8"/>`).join('');
} };
// Cercle de menhirs : une clairière aux bords bosselés, un sentier tassé et ses cailloux en anneau ; sept pierres
// levées autour d'une table de pierre moussue ; leurs spirales s'allument deux par deux d'une image à l'autre. Le
// cercle fleuri : toutes les spirales allumées, une couronne de fleurs, des fleurs sur la table, une lueur dorée au
// centre (2 images chacun)
const menhirsDraw = fleuri => f => {
  const [x, y] = at(0, 0);
  const bosses = (cx, cy, rx, ry, n) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  // la clairière, son herbe plus claire au milieu, le sentier tassé en anneau et ses cailloux
  let s = shadow(0, 0, 0.78, 0.1) + P(bosses(x, y + 2, 62, 29, 22), fleuri ? '#A8D878' : '#9CC874', 1.1) + E(x - 4, y, 44, 19, fleuri ? '#BCE48E' : '#AED486', 0)
    + `<ellipse cx="${x}" cy="${y}" rx="41" ry="20.5" fill="none" stroke="#D2C394" stroke-width="6" opacity="0.6"/>`
    + [[-30, 10], [34, -6], [8, 19], [-20, -14], [22, 14]].map(([dx, dy]) => E(x + dx, y + dy, 1.6, 1, '#B4AD9F', 0.5)).join('');
  // la couronne de fleurs du cercle fleuri : la moitié du fond avant les pierres, celle de devant après
  const couronne = devant => fleuri ? Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * TAU, u = Math.cos(a) * 0.68, v = Math.sin(a) * 0.68; if ((u + v >= 0) !== devant) return ''; const [fx, fy] = at(u, v); return flower(fx, fy - 2, 1.6, ['#F7C6D9', '#FFFFFF', '#F2C94C', '#B48AE0'][i % 4]); }).join('') : '';
  s += couronne(false);
  // les sept pierres, rangées de l'arrière vers l'avant ; la table au milieu
  const lean = [-1.5, 1, 0, -1, 1.5, 0.5, -0.8];
  const lit = i => fleuri || i === f * 3 || i === f * 3 + 1;
  const stones = Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * TAU - Math.PI / 2 + 0.11; return { i, u: Math.cos(a) * 0.58, v: Math.sin(a) * 0.58, h: 24 + (i * 7) % 11 }; }).sort((p, q) => p.u + p.v - (q.u + q.v));
  const pierre = st => menhir(st.u, st.v, st.h, 5.2 + (st.i % 3) * 0.7, lit(st.i), lean[st.i], `menhir-${fleuri ? 'f' : 'c'}-${f}-${st.i}`);
  s += stones.filter(st => st.u + st.v < 0).map(pierre).join('');
  const TABLE = { top: '#D8D2C6', left: '#B4AD9F', right: '#8F887B' };
  s += box(-0.09, -0.06, -0.04, 0.06, 0, 6, GRANITE, 0.8) + box(0.04, -0.06, 0.09, 0.06, 0, 6, GRANITE, 0.8) + box(-0.17, -0.11, 0.17, 0.11, 6, 10, TABLE, 1);
  const [tx, ty] = at(0, 0, 10);
  s += E(tx - 6, ty - 1, 4, 1.8, '#8DB866', 0) + E(tx - 7, ty - 1.4, 2, 0.8, '#A8CC78', 0) + `<path d="M${tx + 2},${ty - 3} l3,2 l-1,2.6" stroke="#9A9387" stroke-width="0.7" fill="none" stroke-linecap="round"/>`;
  s += stones.filter(st => st.u + st.v >= 0).map(pierre).join('');
  s += couronne(true);
  if (fleuri) {
    s += [-8, 0, 8].map(dx => flower(tx + dx, ty - 1, 1.6, '#F7C6D9')).join('') + glow(tx, ty - 10, 26, '255,236,150', 0.22);
  }
  return s;
};
LM.menhirs = { n: 2, draw: menhirsDraw(false) };
LM.menhirs_fleuri = { n: 2, draw: menhirsDraw(true) };
// Arche des falaises : un rocher de falaise posé dans la mer, percé de part en part ; son flanc au soleil strié de
// couches, son bout à l'ombre, la voûte qui laisse voir la mer derrière ; un tapis d'herbe sur le dessus qui déborde en
// frange, des touffes et des fleurettes ; des rochers et de l'écume au pied, des vagues qui vont et viennent ; une
// mouette posée sur le sommet qui s'ébroue (2 images)
const FALAISE = { lit: '#D6BC96', mid: '#C2A47C', shade: '#A0835E', strate: '#B4966E', dark: '#6E5A44' };
LM.arche = { n: 2, draw: f => {
  const [x, y] = at(0, 0), c = FALAISE, V = 0.14, Z = 34;
  const F = (u, z) => at(u, V, z), B = (u, z) => at(u, -V, z), xy = p => p.map(r2).join(',');
  // un tracé lissé qui passe par le premier et le dernier point (milieux en points d'appui)
  const lisse = pts => { let d = `M${xy(pts[0])}`; for (let i = 1; i < pts.length - 1; i++) d += ` Q${xy(pts[i])} ${r2((pts[i][0] + pts[i + 1][0]) / 2)},${r2((pts[i][1] + pts[i + 1][1]) / 2)}`; return d + ` L${xy(pts[pts.length - 1])}`; };
  // la mer, ses hauts-fonds et ses vagues
  let s = E(x, y + 6, 70, 26, '#6FB0DA', 1) + E(x - 8, y + 2, 52, 16, '#8CC6E8', 0) + E(x - 16, y, 26, 6, '#B2DCF2', 0);
  // le rocher : des flancs bosselés, une crête naturelle ; le flanc au soleil vers nous, le bout à l'ombre
  const gauche = [[-0.58, 0], [-0.62, 6], [-0.6, 14], [-0.55, 21]], crete = [[-0.58, 25], [-0.42, 31], [-0.2, 34], [0.06, 35], [0.3, 33], [0.48, 31], [0.58, 28]], droite = [[0.6, 21], [0.56, 13], [0.6, 6], [0.58, 0]];
  const face = lisse([...gauche, ...crete, ...droite].map(([u, z]) => F(u, z))) + ' Z';
  const bout = [[0.58, 28], ...droite];
  s += poly([...bout.map(([u, z]) => F(u, z)), ...bout.slice().reverse().map(([u, z]) => B(u + 0.01, z - 1.5))], c.shade, 1.1);
  for (const z of [7, 14, 21]) s += L(F(0.59, z), B(0.6, z - 1.5), c.dark, 0.8);
  const idF = `arche-face-${f}`;
  s += `<defs><clipPath id="${idF}"><path d="${face}"/></clipPath></defs><path d="${face}" fill="${c.lit}"/>`;
  // les couches de la falaise : des bandes ondulées, le bas mouillé et ses algues
  s += `<g clip-path="url(#${idF})">`
    + [[9, 15, c.mid], [22, 27, c.mid]].map(([z0, z1]) => `<path d="M${xy(F(-0.7, z0))} Q${xy(F(-0.3, z0 + 2))} ${xy(F(0, z0))} T${xy(F(0.7, z0))} L${xy(F(0.7, z1))} Q${xy(F(0.3, z1 - 1.6))} ${xy(F(0, z1))} T${xy(F(-0.7, z1))} Z" fill="#CDB28C"/>`).join('')
    + [7, 15, 22, 28].map(z => `<path d="M${xy(F(-0.7, z))} Q${xy(F(-0.35, z + 1.6))} ${xy(F(0, z))} T${xy(F(0.7, z))}" stroke="${c.strate}" stroke-width="1" fill="none"/>`).join('')
    + `<path d="M${xy(F(-0.7, 0))} L${xy(F(-0.7, 4))} Q${xy(F(-0.35, 5.4))} ${xy(F(0, 3.6))} T${xy(F(0.7, 4))} L${xy(F(0.7, 0))} Z" fill="#9C8A66"/>`
    + `<path d="M${xy(F(-0.5, 4.4))} l1.4,3 M${xy(F(-0.42, 4.6))} l0.6,2.4 M${xy(F(0.36, 3.8))} l1,2.8 M${xy(F(0.46, 3.6))} l0.4,2.2" stroke="#6E8A4E" stroke-width="1" stroke-linecap="round"/>`
    + `<path d="M${xy(F(-0.44, 26))} l1.6,5 l-1.4,4 M${xy(F(0.4, 18))} l-1,5 l1.4,3" stroke="${c.dark}" stroke-width="0.8" fill="none" stroke-linecap="round"/></g>`
    + `<path d="${face}" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
  // la voûte : un trou irrégulier ; dedans l'intrados dans l'ombre et, par le trou de derrière, la mer
  const trouUZ = [[-0.28, 0], [-0.31, 6], [-0.28, 13], [-0.17, 20], [0.01, 24], [0.17, 21], [0.27, 15], [0.31, 7], [0.29, 0]];
  const trou = lisse(trouUZ.map(([u, z]) => F(u, z))) + ' Z', fond = lisse(trouUZ.map(([u, z]) => B(u, z))) + ' Z', id = `arche-trou-${f}`;
  s += `<defs><clipPath id="${id}"><path d="${trou}"/></clipPath></defs>`
    + `<path d="${trou}" fill="${c.dark}"/><g clip-path="url(#${id})"><path d="${trou}" fill="#5A4836" transform="translate(-3 -2)"/><path d="${fond}" fill="#8CC6E8"/>${E(x + 8, y - 4, 10, 2.4, '#B2DCF2', 0)}<path d="M${x - 2 + (f ? 3 : 0)},${y + 2} q6,2 12,0" stroke="#FFFFFF" stroke-width="1" fill="none"/></g>`
    + `<path d="${trou}" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
  // le tapis d'herbe du dessus, sa frange qui déborde, ses fleurettes
  const T = [...crete.map(([u, z]) => at(u, V + 0.02, z)), ...crete.slice().reverse().map(([u, z]) => at(u, -V - 0.02, z - 2))];
  s += poly(T, '#8FCB6A', 1);
  let frange = `M${xy(T[0])}`;
  for (let i = 1; i < crete.length; i++) { const p0 = T[i - 1], p1 = T[i]; frange += ` Q${r2((p0[0] + p1[0]) / 2 - 1)},${r2((p0[1] + p1[1]) / 2 + 3.4)} ${xy(p1)}`; }
  s += P(frange + ' Z', '#7EBE58', 0.8);
  for (const [u, v, col] of [[-0.36, 0.04, '#FFFFFF'], [-0.12, 0.05, '#F7B6C8'], [0.32, 0.02, '#FFFFFF'], [0.12, -0.05, '#F7B6C8']]) { const [fx, fy] = at(u, v, Z); s += Dk.flower(fx, fy - 1, 1.4, col, '#F2C94C'); }
  // les rochers au pied, chacun dans son collier d'écume ; les vagues qui vont et viennent
  const rocher = (dx, dy, r) => `<path d="M${x + dx - r * 1.3},${y + dy + r * 0.3} q${r * 1.3},${r * 0.7} ${r * 2.6},0" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
    + E(x + dx, y + dy, r, r * 0.66, c.shade, 0.9) + E(x + dx - r * 0.15, y + dy - r * 0.16, r * 0.78, r * 0.44, c.mid, 0) + E(x + dx - r * 0.38, y + dy - r * 0.3, r * 0.34, r * 0.16, c.lit, 0);
  s += rocher(-52, 8, 6.4) + rocher(-38, 17, 4.2) + rocher(52, 5, 5.6) + rocher(40, 15, 3.8);
  s += `<path d="${lisse([F(-0.62, 0.6), F(-0.3, -0.4), F(0, 0.8), F(0.3, -0.2), F(0.6, 0.6)])}" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="7 3"/>`;
  const k = f ? 3 : 0;
  s += `<path d="M${x - 46 - k},${y + 22} q-6,3 -12,1 M${x + 22 + k},${y + 24} q8,3 16,1 M${x - 16},${y + 28 + k * 0.5} q8,2 16,0 M${x + 54},${y + 14 - k * 0.5} q5,2 10,0" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  // la mouette posée sur le sommet qui s'ébroue
  const [gx, gy] = at(0.16, -0.02, Z);
  return s + gull(gx, gy - 4, f);
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
