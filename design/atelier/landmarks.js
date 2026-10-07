// Lieux remarquables (lot 9c) au trait de la troupe, d'après src/world/landmarkSprites.js. Une case, ancre au centre ;
// un lieu déborde de sa case comme un monument. Cadre LAND (le jeu les affiche × 1,35, la cascade × 1).
const { OUT, P, E, L, r2 } = require('./troupe');
const Dk = require('./deco');
const { feuillage, herbe, fleurette, palmier, champignon } = require('./arbres');
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
// Grotte de glace : un replat de neige aux bords bosselés ; le tertre à trois bosses, ses congères ; des grappes de
// cristaux à facettes ; la bouche bleue sous sa corniche de neige d'où pendent les stalactites, des éclats au fond,
// une langue de glace qui en sort ; des pas qui y mènent ; le froid s'échappe en volutes (2 images)
LM.grotte = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  // bord bosselé : une ellipse aux petites bosses régulières
  const bosses = (cx, cy, rx, ry, n) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  // un cristal à facettes : pan clair, pan d'ombre, pointe éclairée, un reflet, un seul trait autour
  const crystal = (cx, cy, h, w, lean = 0) => { const tip = [cx + lean, cy - h], bl = [cx - w, cy], br = [cx + w, cy], fb = [cx, cy + w * 0.45];
    return poly([bl, tip, fb], ICE.left, 0) + poly([fb, tip, br], ICE.right, 0)
      + poly([tip, [bl[0] + (tip[0] - bl[0]) * 0.7, bl[1] + (tip[1] - bl[1]) * 0.7], [fb[0] + (tip[0] - fb[0]) * 0.7, fb[1] + (tip[1] - fb[1]) * 0.7]], '#F6FDFF', 0)
      + L([cx - w * 0.45, cy - h * 0.12], [cx - w * 0.15 + lean * 0.6, cy - h * 0.62], 'rgba(255,255,255,.9)', 0.8)
      + poly([bl, tip, br, fb], 'none', 0.9); };
  // une grappe : deux petits cristaux qui s'écartent, le grand devant, un peu de neige au pied
  const grappe = (cx, cy, h, w) => crystal(cx - w * 1.3, cy + 1, h * 0.55, w * 0.7, -w * 0.9) + crystal(cx + w * 1.3, cy + 1.5, h * 0.62, w * 0.75, w)
    + crystal(cx, cy, h, w, w * 0.2) + E(cx, cy + w * 0.9, w * 2.3, w * 0.75, '#DCEAF5', 0) + P(bosses(cx, cy + w * 0.6, w * 2.1, w * 0.7, 8), SNOW.top, 0);
  // le replat de neige, son ombre bleutée sous le tertre, quelques cailloux
  let s = shadow(0, 0, 0.74, 0.12) + P(bosses(x, y + 8, 64, 27, 22), SNOW.top, 1.1)
    + E(x + 6, y + 10, 50, 13, '#DCEAF5', 0)
    + [[-50, 18, 2.8], [46, 22, 2.4], [-18, 30, 2]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.65, '#8E9AA8', 0.7) + E(x + dx - r * 0.3, y + dy - r * 0.25, r * 0.45, r * 0.25, '#C8D2DC', 0)).join('');
  // le tertre à trois bosses ; ombre en croissant côté droit (découpée dans le tertre), un seul trait autour
  const mound = `M${x - 52},${y + 6} Q${x - 56},${y - 22} ${x - 34},${y - 38} Q${x - 26},${y - 58} ${x - 2},${y - 56} Q${x + 18},${y - 66} ${x + 34},${y - 46} Q${x + 56},${y - 34} ${x + 52},${y - 4} Q${x + 50},${y + 10} ${x + 36},${y + 12} Q${x},${y + 22} ${x - 52},${y + 6} Z`;
  const id = `grotte-tertre-${f}`;
  s += `<defs><clipPath id="${id}"><path d="${mound}"/></clipPath></defs>`
    + `<path d="${mound}" fill="${SNOW.right}"/>`
    + `<g clip-path="url(#${id})"><path d="${mound}" fill="${SNOW.left}" transform="translate(-6 -3)"/><path d="${mound}" fill="${SNOW.top}" transform="translate(-13 -6)"/>`
    + `<path d="M${x - 40},${y - 22} q10,-6 22,-4 M${x - 8},${y - 44} q10,-5 20,-2 M${x + 22},${y - 30} q9,-2 16,4 M${x - 36},${y - 4} q6,-3 11,-1" fill="none" stroke="#C9DCEB" stroke-width="1.2" stroke-linecap="round"/>`
    + `<path d="M${x - 30},${y - 50} q6,-4 12,-3 M${x + 8},${y - 58} q5,-3 10,-1" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/></g>`
    + `<path d="${mound}" fill="none" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/>`;
  // les grappes de cristaux sur le tertre
  s += grappe(x - 22, y - 46, 24, 5) + crystal(x - 2, y - 52, 12, 3.4, 1) + grappe(x + 30, y - 38, 18, 4.2);
  // la bouche : un rebord de glace en voussoirs, le fond sombre en trois bleus, des éclats tout au fond
  const mx = x + 4, my = y + 12;
  s += `<path d="M${mx - 21},${my} Q${mx - 22},${my - 38} ${mx},${my - 40} Q${mx + 22},${my - 38} ${mx + 21},${my} Z" fill="${ICE.left}" stroke="${OUT}" stroke-width="1.1"/>`
    + `<path d="M${mx + 8},${my - 39} Q${mx + 22},${my - 36} ${mx + 21},${my} L${mx + 15},${my} Q${mx + 15},${my - 26} ${mx + 6},${my - 30} Z" fill="${ICE.right}"/>`
    + `<path d="M${mx - 15},${my} Q${mx - 15},${my - 29} ${mx},${my - 30} Q${mx + 15},${my - 29} ${mx + 15},${my} Z" fill="#2C5677" stroke="${OUT}" stroke-width="0.8"/>`
    + `<path d="M${mx - 10},${my} Q${mx - 9},${my - 20} ${mx},${my - 21} Q${mx + 9},${my - 20} ${mx + 10},${my} Z" fill="#1D4565"/>`
    + `<path d="M${mx - 5},${my} Q${mx - 4.6},${my - 11} ${mx},${my - 11.6} Q${mx + 4.6},${my - 11} ${mx + 5},${my} Z" fill="#132F48"/>`
    + [[-20, -10, -15, -9], [-17, -26, -12, -22], [0, -40, 0, -30], [17, -26, 12, -22], [20, -10, 15, -9]].map(([a1, b1, a2, b2]) => L([mx + a1, my + b1], [mx + a2, my + b2], '#7FB8D8', 0.8)).join('')
    + E(mx, my - 8, 7, 3.6, `rgba(130,200,255,${f ? 0.5 : 0.32})`, 0)
    + (f ? [[-5, -14, 1.8], [6, -8, 1.4]] : [[4, -15, 1.6], [-6, -7, 1.4]]).map(([dx, dy, r]) => P(`M${mx + dx},${my + dy - r * 1.6} l${r},${r * 1.6} l-${r},${r * 1.6} l-${r},-${r * 1.6} Z`, '#9FDCF8', 0)).join('');
  // la langue de glace qui sort de la grotte, ses reflets
  s += `<path d="M${mx - 15},${my} Q${mx - 20},${my + 7} ${mx - 28},${my + 11} Q${mx - 4},${my + 19} ${mx + 24},${my + 10} Q${mx + 18},${my + 5} ${mx + 15},${my} Z" fill="${ICE.top}" stroke="${ICE.right}" stroke-width="0.9"/>`
    + `<path d="M${mx - 16},${my + 8} l7,-1.2 M${mx + 4},${my + 12} l8,-1.4" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>`;
  // la corniche de neige posée sur la bouche, d'où pendent les stalactites
  const bord = dx => my - 37 + (dx * dx) / 80;
  let lip = `M${mx - 18},${r2(bord(-18))} Q${mx - 13},${my - 47} ${mx},${my - 47.5} Q${mx + 13},${my - 47} ${mx + 18},${r2(bord(18))}`;
  for (let dx = 18; dx > -18; dx -= 4.5) lip += ` Q${r2(mx + dx - 2.25)},${r2(bord(dx - 2.25) + 2.2)} ${r2(mx + dx - 4.5)},${r2(bord(dx - 4.5))}`;
  s += P(lip + ' Z', SNOW.top, 1.1) + `<path d="M${mx - 10},${my - 43} q6,-2 12,-1.6" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M${mx + 6},${my - 42} q6,1 9,5" stroke="#D6E4F0" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  for (const [dx, len] of [[-13.5, 5], [-9, 9], [-4.5, 6], [0, 11], [4.5, 6.5], [9, 9.5], [13.5, 5]]) {
    const yy = bord(dx) + 1.2;
    s += P(`M${mx + dx - 1.8},${r2(yy)} L${mx + dx + 1.8},${r2(yy)} L${mx + dx + 0.2},${r2(yy + len)} Z`, '#EAF7FF', 0.6) + L([mx + dx - 0.6, yy + 1], [mx + dx - 0.1, yy + len * 0.6], '#FFFFFF', 0.6);
  }
  // les aiguilles de glace au pied, et des pas qui mènent à la grotte
  s += grappe(x - 42, y + 8, 14, 3) + grappe(x + 42, y + 12, 15, 3.2);
  s += [[-40, 30, 0], [-33, 27, 1], [-27, 31, 0], [-20, 27, 1]].map(([dx, dy, k]) => E(x + dx, y + dy, 2, 1.1, '#C9D8E6', 0) + E(x + dx + 1.6, y + dy - 1.6, 1, 0.6, '#C9D8E6', 0)).join('');
  // le froid s'échappe de la bouche : deux volutes qui glissent vers la gauche et s'effacent
  const wisp = p => `<g opacity="${r2(0.85 * (1 - p * 0.8))}">${E(mx - 6 - p * 24, my - 10 - p * 10, 7 + p * 5, 3.2 + p * 2.4, 'rgba(234,246,255,.75)', 0)}${E(mx - 2 - p * 24, my - 13 - p * 10, 4.4 + p * 3, 2.4 + p * 1.6, 'rgba(255,255,255,.85)', 0)}`
    + `<path d="M${r2(mx - 10 - p * 24)},${r2(my - 10 - p * 10)} q-6,-3 -11,-1 q-4,2 -1.4,4.4 q2.4,1.4 3.4,-1.6" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/></g>`;
  s += wisp(f ? 0.5 : 0) + wisp(f ? 0 : 0.5);
  return s + (f ? sparkle(x + 34, y - 60, 3) + sparkle(x - 36, y - 24, 2.2) : sparkle(x - 18, y - 74, 3) + sparkle(x + 44, y - 20, 2.2));
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
// Saule millénaire : une berge d'herbe et sa mare (nénuphars, roseaux) ; un tronc noueux aux racines tordues, son creux
// et son écorce ; un houppier en dôme ; le rideau de branches, devant et derrière le tronc, qui ondule jusqu'à l'eau et
// y fait des ronds ; une feuille qui tombe (2 images)
const SAULE = { devant: { light: '#E6F6AA', mid: '#B4D96E', dark: '#7DAE50' }, fond: { light: '#B7DA7C', mid: '#8DBE57', dark: '#5E9443' } };
LM.saule = { n: 2, draw: f => {
  const [x, y] = at(0, 0), BOIS = { left: '#8E7458', right: '#6A5440', bark: '#4A3A2C', light: '#A88E70' };
  const bosses = (cx, cy, rx, ry, n) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  // une mèche du rideau : un ruban cerné qui pend et ondule, ses petites feuilles ; un rond dans l'eau si elle y touche
  const meche = (sx, sy, len, sw, c, eau) => {
    const ex = sx + sw, ey = sy + len, cx = sx + sw * 0.1 + (sx < x ? -2.2 : 2.2), cy = sy + len * 0.45, Q = t => [(1 - t) ** 2 * sx + 2 * t * (1 - t) * cx + t * t * ex, (1 - t) ** 2 * sy + 2 * t * (1 - t) * cy + t * t * ey];
    const d = `M${r2(sx)},${r2(sy)} Q${r2(cx)},${r2(cy)} ${r2(ex)},${r2(ey)}`;
    return `<path d="${d}" stroke="${OUT}" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c.mid}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
      + [0.28, 0.46, 0.64, 0.82].map((t, k) => { const [px, py] = Q(t), sg = k % 2 ? 1 : -1; return `<path d="M${r2(px)},${r2(py)} q${sg * 1.4},0.3 ${sg * 2.2},1.8" stroke="${c.mid}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${r2(px)},${r2(py)} q${sg * 1.4},0.3 ${sg * 2.2},1.8" stroke="${c.dark}" stroke-width="0.5" fill="none" stroke-linecap="round"/>`; }).join('')
      + (eau ? `<ellipse cx="${r2(ex)}" cy="${r2(ey + 1.4)}" rx="${3 + (f ? 1 : 0)}" ry="${1.2 + (f ? 0.4 : 0)}" fill="none" stroke="#E2F4FC" stroke-width="0.8"/>` : '');
  };
  const sw = (i, k = 1) => ((f ? 1.8 : -1.4) + (i % 3 - 1) * 0.6) * k;
  // la berge, la mare et ses reflets
  let s = shadow(0, 0, 0.8, 0.1) + P(bosses(x, y + 4, 64, 28, 22), '#9CC874', 1.1) + E(x - 8, y + 2, 42, 17, '#AED486', 0)
    + `<path d="M${x - 2},${y + 14} Q${x + 2},${y + 2} ${x + 20},${y + 3} Q${x + 46},${y + 4} ${x + 48},${y + 13} Q${x + 44},${y + 23} ${x + 22},${y + 23} Q${x + 2},${y + 23} ${x - 2},${y + 14} Z" fill="#7FC0E2" stroke="${OUT}" stroke-width="1"/>`
    + E(x + 20, y + 11, 18, 5, '#A6D8F0', 0) + `<path d="M${x + 10},${y + 16} l9,-1 M${x + 30},${y + 19} l7,-1" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`;
  // le rideau du fond, derrière le tronc
  s += [-42, -35, -27, -19, -10, -2, 7, 15, 24, 32, 40].map((sx, i) => meche(x + sx, y - 58 + Math.abs(sx) * 0.08, 50 - Math.abs(sx) * 0.05 + (i % 3) * 3, sw(i, 0.8) + (sx < 0 ? -1.5 : 1.5), SAULE.fond, false)).join('');
  // le tronc noueux : racines tordues, trois maîtresses branches, le pan d'ombre, le creux, l'écorce
  const d = `M${x - 21},${y + 3} Q${x - 12},${y} ${x - 10},${y - 8} Q${x - 13},${y - 22} ${x - 8},${y - 34} Q${x - 10},${y - 44} ${x - 21},${y - 52} L${x - 14},${y - 57} Q${x - 6},${y - 49} ${x - 3},${y - 44} Q${x - 2},${y - 53} ${x + 2},${y - 61} L${x + 9},${y - 59} Q${x + 5},${y - 51} ${x + 5},${y - 43} Q${x + 10},${y - 49} ${x + 19},${y - 53} L${x + 23},${y - 47} Q${x + 12},${y - 40} ${x + 9},${y - 32} Q${x + 12},${y - 18} ${x + 10},${y - 8} Q${x + 12},${y} ${x + 22},${y + 4} Q${x + 15},${y + 6} ${x + 9},${y + 4} Q${x + 5},${y + 7} ${x},${y + 5} Q${x - 5},${y + 7} ${x - 9},${y + 4} Q${x - 15},${y + 6} ${x - 21},${y + 3} Z`;
  const idT = `saule-tronc-${f}`;
  s += `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/><defs><clipPath id="${idT}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${idT})">`
    + `<path d="M${x + 3},${y + 8} Q${x + 6},${y - 14} ${x + 5},${y - 32} Q${x + 9},${y - 44} ${x + 15},${y - 60} L${x + 30},${y - 60} L${x + 30},${y + 8} Z" fill="${BOIS.right}"/>`
    + E(x, y - 48, 22, 8, BOIS.right, 0)
    + `<path d="M${x - 6},${y - 6} Q${x - 7},${y - 14} ${x - 5},${y - 20} M${x + 4},${y - 10} Q${x + 5},${y - 18} ${x + 3},${y - 26} M${x - 7},${y - 30} q1,-4 -0.4,-8 M${x + 1},${y - 36} q-1,-3 0,-6" fill="none" stroke="${BOIS.bark}" stroke-width="0.8" stroke-linecap="round"/>`
    + `<path d="M${x - 8},${y - 4} Q${x - 9},${y - 16} ${x - 7.4},${y - 26}" fill="none" stroke="${BOIS.light}" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/></g>`
    + E(x - 2, y - 20, 3.2, 4.4, BOIS.bark, 0.9) + E(x - 2, y - 19.4, 2, 3.2, '#2E2218', 0);
  // le houppier en dôme : la touffe du fond, puis les côtés et le milieu devant
  s += feuillage(`saule-a-${f}`, [[-30, -72, 15], [-12, -84, 17], [10, -86, 17], [29, -74, 15], [-40, -60, 11], [40, -60, 11], [0, -74, 16]].map(([a, b, r]) => [x + a, y + b, r]), SAULE.fond, [[-18, -78], [4, -80, 0.9], [22, -76, 0.9], [-34, -64, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1)
    + feuillage(`saule-b-${f}`, [[24, -64, 13], [36, -54, 9, 0], [13, -58, 10, 0]].map(([a, b, r, h]) => [x + a, y + b, r, h]), SAULE.devant, [[24, -58], [33, -52, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1)
    + feuillage(`saule-c-${f}`, [[-25, -62, 13], [-37, -54, 9, 0], [-14, -56, 10, 0]].map(([a, b, r, h]) => [x + a, y + b, r, h]), SAULE.devant, [[-26, -56], [-34, -50, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1)
    + feuillage(`saule-d-${f}`, [[-1, -70, 12], [-6, -60, 9, 0], [6, -61, 9, 0]].map(([a, b, r, h]) => [x + a, y + b, r, h]), SAULE.devant, [[-2, -64], [5, -68, 0.8]].map(([a, b, k]) => [x + a, y + b, k]), 1);
  // le rideau de devant : de longues mèches sur les côtés jusqu'au sol ou à l'eau, de plus courtes au milieu
  s += [[-47, -54, 52], [-42, -52, 56], [-36, -51, 50], [-30, -50, 54], [-23, -50, 30], [-15, -52, 22], [-7, -55, 16], [9, -56, 18], [16, -54, 26], [23, -52, 54], [29, -50, 62], [35, -51, 58], [41, -52, 64], [47, -54, 58]]
    .map(([sx, sy, len], i) => meche(x + sx, y + sy, len, sw(i) + (sx < 0 ? -2 : 2), SAULE.devant, sx > 20)).join('');
  // les nénuphars, les roseaux au bord de la mare, une touffe et des fleurettes sur la berge
  s += P(`M${x + 14},${y + 13} a5,1.9 0 1 1 1.4,1.4 L${x + 14},${y + 13} Z`, '#6FAE4E', 0.7) + P(`M${x + 38},${y + 17} a4,1.5 0 1 1 1.2,1.2 L${x + 38},${y + 17} Z`, '#6FAE4E', 0.7)
    + fleurette(x + 13, y + 11.6, '#F7B6C8')
    + [[-2, 12], [1, 16], [48, 11]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} l-1,-10 M${x + dx + 1.4},${y + dy} l0.6,-12 M${x + dx + 2.8},${y + dy} l1.8,-9" stroke="#5E8C3A" stroke-width="1.1" stroke-linecap="round"/>` + E(x + dx + 2, y + dy - 12.4, 0.9, 2.2, '#8A5A34', 0.5)).join('')
    + herbe(x - 40, y + 14, '#86B852', 0.9) + herbe(x - 24, y + 22, '#94C25C', 0.75) + fleurette(x - 32, y + 18, '#FFFFFF') + fleurette(x - 46, y + 8, '#F7B6C8');
  // une feuille qui tombe
  const [lx, ly, la] = f ? [30, -26, 140] : [34, -42, 20];
  return s + `<path d="M0,-2.6 Q1.6,0 0,2.6 Q-1.6,0 0,-2.6 Z" fill="${SAULE.devant.light}" stroke="${OUT}" stroke-width="0.6" transform="translate(${x + lx} ${y + ly}) rotate(${la})"/>`;
} };
// Cabane sur pilotis : l'eau du marais aux bords bosselés, ses roseaux et ses nénuphars ; quatre pieux croisillonnés
// et leurs ronds dans l'eau ; le plancher et son échelle ; la cabane de planches, sa porte, sa fenêtre allumée, son toit
// de chaume ; la lanterne au coin ; le filet qui sèche ; la barque amarrée et ses rames ; les lucioles qui tournent
// (2 images ; une lueur pour la lanterne et une par luciole, comme avant)
LM.pilotis = { n: 2, draw: f => {
  const [x, y] = at(0, 0), xy = p => p.map(r2).join(',');
  const bosses = (cx, cy, rx, ry, n) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  const CHAUME = { back: '#C99A45', front: '#E6BE6A', gable: '#8E6A44' };
  const roseaux = (rx, ry) => `<path d="M${rx},${ry} l-1.4,-11 M${rx + 1.6},${ry} l0.4,-13 M${rx + 3.2},${ry} l2,-10 M${rx - 1.4},${ry} l-3,-7" stroke="#5E8C3A" stroke-width="1.1" stroke-linecap="round"/>` + E(rx + 0.4, ry - 13.6, 0.9, 2.4, '#8A5A34', 0.5) + E(rx + 5.4, ry - 10.6, 0.8, 2, '#8A5A34', 0.5);
  // l'eau du marais, ses reflets, ses nénuphars, ses roseaux du fond
  let s = P(bosses(x, y + 4, 62, 27, 22), '#6FA8C8', 1.1) + E(x - 8, y + 2, 44, 16, '#8FC8E0', 0)
    + `<path d="M${x - 40},${y + 8} l10,-1.4 M${x + 26},${y + 20} l9,-1.2 M${x - 18},${y + 22} l7,-1" stroke="#E2F4FC" stroke-width="1.2" stroke-linecap="round"/>`
    + roseaux(x - 46, y - 2) + roseaux(x + 44, y - 4) + roseaux(x + 22, y - 14);
  s += [[-30, 16, 5], [40, 10, 4]].map(([dx, dy, r]) => P(`M${x + dx},${y + dy} a${r},${r * 0.4} 0 1 1 ${r * 0.3},${r * 0.3} L${x + dx},${y + dy} Z`, '#6FAE4E', 0.7)).join('') + fleurette(x - 31, y + 14.4, '#FFFFFF');
  // les pieux (de l'arrière vers l'avant), leurs ronds dans l'eau, le croisillon de devant
  const pieux = [[-0.22, -0.18], [0.22, -0.18], [-0.22, 0.18], [0.22, 0.18]];
  for (const [u, v] of pieux) { const [px, py] = at(u, v); s += `<ellipse cx="${r2(px)}" cy="${r2(py + 1)}" rx="${4.4 + f * 1.2}" ry="${1.8 + f * 0.4}" fill="none" stroke="#E2F4FC" stroke-width="0.8"/>` + post(u, v, -3, 18, WOOD_DARK, 0.03); }
  const barre = (p, q, w, c) => `<path d="M${xy(p)} L${xy(q)}" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="M${xy(p)} L${xy(q)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  s += barre(at(-0.22, 0.21, 3), at(0.22, 0.21, 16), 1.2, WOOD_DARK.left) + barre(at(-0.22, 0.21, 16), at(0.22, 0.21, 3), 1.2, WOOD_DARK.left);
  // le plancher et ses planches, la barque amarrée derrière l'échelle
  s += box(-0.3, -0.26, 0.3, 0.32, 18, 21, WOOD, 1);
  for (const u of [-0.18, -0.06, 0.06, 0.18]) s += L(at(u, -0.26, 21), at(u, 0.32, 21), WOOD.right, 0.6);
  const [bx, by] = at(0.66, 0.14);
  s += `<path d="M${xy(at(0.22, 0.18, 12))} Q${r2(bx - 10)},${r2(by - 8)} ${r2(bx - 14)},${r2(by - 4)}" stroke="#D8C8A0" stroke-width="0.8" fill="none"/>`
    + `<ellipse cx="${r2(bx)}" cy="${r2(by + 2)}" rx="18" ry="3.4" fill="none" stroke="#E2F4FC" stroke-width="0.8"/>`
    + P(`M${bx - 16},${by - 4} Q${bx - 12},${by + 4} ${bx},${by + 4} Q${bx + 12},${by + 4} ${bx + 16},${by - 4} Q${bx},${by - 1} ${bx - 16},${by - 4} Z`, WOOD.left, 1)
    + P(`M${bx - 13},${by - 3.4} Q${bx},${by - 0.6} ${bx + 13},${by - 3.4} Q${bx},${by + 1.6} ${bx - 13},${by - 3.4} Z`, WOOD.right, 0)
    + L([bx - 2, by - 2.4], [bx + 2, by - 1.4], WOOD.top, 1.6) + `<path d="M${bx - 6},${by - 2} L${bx + 14},${by - 9}" stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"/><path d="M${bx - 6},${by - 2} L${bx + 14},${by - 9}" stroke="${WOOD.top}" stroke-width="1.2" stroke-linecap="round"/>` + E(bx + 15, by - 9.4, 2.4, 1.1, WOOD.top, 0.8);
  const [lx, ly] = at(0.0, 0.33, 0);
  s += `<path d="M${r2(lx - 3)},${r2(ly + 2)} L${r2(lx - 3)},${r2(ly - 26)} M${r2(lx + 3)},${r2(ly + 1)} L${r2(lx + 3)},${r2(ly - 27)}" stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"/><path d="M${r2(lx - 3)},${r2(ly + 2)} L${r2(lx - 3)},${r2(ly - 26)} M${r2(lx + 3)},${r2(ly + 1)} L${r2(lx + 3)},${r2(ly - 27)}" stroke="${WOOD_DARK.left}" stroke-width="1.1" stroke-linecap="round"/>`
    + [4, 10, 16, 22].map(z => L([lx - 3, ly - z], [lx + 3, ly - z - 0.6], WOOD_DARK.left, 1.1)).join('');
  // la cabane : murs de planches, porte, fenêtre allumée, toit de chaume
  s += box(-0.24, -0.2, 0.2, 0.15, 21, 37, WOOD_DARK, 1);
  for (const u of [-0.15, -0.06, 0.03, 0.12]) s += L(at(u, 0.15, 21), at(u, 0.15, 37), WOOD_DARK.right, 0.6);
  for (const v of [-0.11, -0.02, 0.07]) s += L(at(0.2, v, 21), at(0.2, v, 37), '#56331C', 0.6);
  s += face([[-0.18, 0.15, 21], [-0.09, 0.15, 21], [-0.09, 0.15, 32], [-0.18, 0.15, 32]], '#3D2A1E', 0.9) + E(...at(-0.105, 0.15, 26.5), 0.7, 0.7, '#E0B060', 0);
  s += face([[0.2, -0.13, 25], [0.2, 0.01, 25], [0.2, 0.01, 33], [0.2, -0.13, 33]], '#FFD978', 0.9) + L(at(0.2, -0.06, 25), at(0.2, -0.06, 33), '#56331C', 0.8) + L(at(0.2, -0.13, 29), at(0.2, 0.01, 29), '#56331C', 0.8);
  s += Dk.gable(-0.24, -0.2, 0.2, 0.15, 37, 16, CHAUME, 0.08);
  for (const u of [-0.24, -0.13, -0.02, 0.09, 0.2]) s += L(at(u, 0.2, 38.4), at(u, 0.06, 46), '#C99A45', 0.7);
  s += [-0.26, -0.18, -0.1, -0.02, 0.06, 0.14, 0.22].map(u => L(at(u, 0.23, 37), at(u + 0.01, 0.23, 34.8), '#B88A3E', 1)).join('');
  // le filet qui sèche sur le bord du plancher
  const [nx, ny] = at(-0.17, 0.32, 18);
  s += `<path d="M${r2(nx)},${r2(ny)} Q${r2(nx - 6)},${r2(ny + 6)} ${r2(nx - 4)},${r2(ny + 15)} L${r2(nx + 4)},${r2(ny + 18)} Q${r2(nx + 2)},${r2(ny + 8)} ${r2(nx + 6)},${r2(ny + 3)} Z" fill="#E8DCC0" fill-opacity="0.45" stroke="#CDBB92" stroke-width="0.8"/>`
    + `<path d="M${r2(nx - 3)},${r2(ny + 5)} l7,2 M${r2(nx - 4)},${r2(ny + 10)} l7,2.4 M${r2(nx - 1)},${r2(ny + 2)} l-1,13 M${r2(nx + 2.6)},${r2(ny + 3)} l-1.4,14" stroke="#D8C8A0" stroke-width="0.6"/>`;
  // la lanterne au coin, sa lueur
  const [qx, qy] = at(0.2, 0.15, 35);
  s += L([qx, qy], [qx + 5, qy - 1], WOOD_DARK.right, 1.2) + L([qx + 5, qy - 1], [qx + 5, qy + 2], '#3D3A36', 0.7)
    + `<rect x="${r2(qx + 2.8)}" y="${r2(qy + 2)}" width="4.4" height="5.6" rx="1" fill="#FFD978" stroke="${OUT}" stroke-width="0.7"/>` + E(qx + 5, qy + 1.8, 2.6, 0.9, '#3D3A36', 0)
    + glow(qx + 5, qy + 5, 10, '255,214,120', f ? 0.42 : 0.34);
  // les lucioles qui tournent
  for (let i = 0; i < 4; i++) { const a = (i / 4 + f / 8) * TAU, [fx, fy] = at(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 30 + (i % 2) * 10); s += glow(fx, fy, 3, '255,236,150', 0.45) + E(fx, fy, 0.9, 0.9, '#FFF3A8', 0.3); }
  return s;
} };
// Source de l'oasis : un replat de sable aux bords bosselés, un anneau de verdure ; le bassin, sa rive de sable mouillé,
// ses reflets et ses ronds ; au milieu, un rocher de grès d'où l'eau jaillit et retombe en gerbe ; des lotus roses et
// blancs sur leurs feuilles ; trois palmiers (ceux des arbres refaits) qui se balancent ; une jarre, des touffes (2 images)
LM.oasis = { n: 2, draw: f => {
  const [x, y] = at(0, 0);
  const bosses = (cx, cy, rx, ry, n) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  const GRES_ROSE = { top: '#F0D49A', left: '#D9B474', right: '#B48A50' };
  // un palmier des arbres refaits, posé en (u, v), à l'échelle k, penché selon l'image (ids rendus uniques)
  const palme = (u, v, k, tag) => { const [px, py] = at(u, v); return `<g transform="translate(${r2(px)} ${r2(py)}) rotate(${f ? 1.6 : -1.2}) scale(${k})">${palmier({ vert: 'doux' }).replace(/<ellipse[^>]*rgba\(40,55,20,0\.22\)[^>]*\/>/, '').replace(/(id="|url\(#)pal/g, `$1oasis${tag}${f}pal`)}</g>`; };
  // un lotus : sa feuille échancrée, ses pétales pointus, son cœur
  const lotus = (lx, ly, col) => P(`M${lx},${ly} a6,2.4 0 1 1 1.8,1.6 Z`, '#6FAE4E', 0.7)
    + [-2.6, -1.3, 0, 1.3, 2.6].map(dx => P(`M${r2(lx + dx * 0.6)},${ly - 0.6} Q${r2(lx + dx - 1)},${r2(ly - 3.4 + Math.abs(dx) * 0.5)} ${r2(lx + dx * 1.1)},${r2(ly - 4.6 + Math.abs(dx) * 0.8)} Q${r2(lx + dx + 1)},${r2(ly - 3.4 + Math.abs(dx) * 0.5)} ${r2(lx + dx * 0.6 + 0.4)},${ly - 0.6} Z`, col, 0.5)).join('')
    + E(lx + 0.3, ly - 1.4, 1.1, 0.7, '#F2C94C', 0.4);
  // le sable, ses rides, l'anneau de verdure
  let s = shadow(0, 0, 0.8, 0.08) + P(bosses(x, y + 4, 66, 29, 22), SAND.top, 1.1) + E(x + 8, y + 12, 50, 14, '#F7E2B0', 0)
    + [[-48, 18], [40, 22], [-10, 28]].map(([dx, dy]) => `<path d="M${x + dx},${y + dy} q4,-1.6 8,0 q4,1.6 8,0" stroke="${SAND.left}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join('')
    + P(bosses(x, y + 2, 47, 20.5, 26), '#8FC46A', 1);
  // les palmiers du fond
  s += palme(-0.52, -0.42, 0.78, 'a') + palme(0.46, -0.48, 0.72, 'b');
  // le bassin : rive de sable mouillé, eau, reflets
  s += P(bosses(x, y + 2, 40, 16.5, 24), SAND.left, 0.9) + E(x, y + 2.4, 36, 14.4, WATER, 0.9) + E(x - 6, y + 1, 24, 8, WATER_LIGHT, 0)
    + `<path d="M${x - 26},${y + 6} l8,-1.2 M${x + 14},${y + 10} l9,-1.2" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`;
  // les ronds autour du rocher
  s += [0, 0.5].map(k => { const p = (k + f * 0.25) % 1; return `<ellipse cx="${x}" cy="${y + 2}" rx="${r2(12 + p * 18)}" ry="${r2(5 + p * 7)}" fill="none" stroke="#E6F6FF" stroke-width="0.9" opacity="${r2(0.85 * (1 - p))}"/>`; }).join('');
  // les lotus
  s += lotus(x - 22, y + 2, '#F7B6CE') + lotus(x + 24, y - 2, '#FFFFFF') + lotus(x - 6, y + 12, '#F7B6CE');
  // le rocher de grès et l'eau qui jaillit en gerbe
  s += Dk.boulder(0, 0.02, 0.13, 0.1, 11, GRES_ROSE, 4);
  const [jx, jy] = at(0, 0.02, 12), h = f ? 22 : 18;
  s += `<path d="M${jx - 2.4},${jy} Q${jx - 1.6},${jy - h * 0.7} ${jx},${jy - h} Q${jx + 1.6},${jy - h * 0.7} ${jx + 2.4},${jy} Z" fill="#DDF3FF" stroke="${OUT}" stroke-width="0.8"/>`
    + [[-13, -4, -2], [-10, -2, 0], [-15, -6, 3], [13, -3, -2], [10, -1, 0], [15, -5, 3]].map(([ex, ey, hy]) => `<path d="M${jx},${jy - h} Q${r2(jx + ex * 0.65)},${jy - h - 2 - hy} ${jx + ex},${jy + ey}" stroke="#9ED4F0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.8"/><path d="M${jx},${jy - h} Q${r2(jx + ex * 0.65)},${jy - h - 2 - hy} ${jx + ex},${jy + ey}" stroke="#F2FBFF" stroke-width="0.8" fill="none" stroke-linecap="round"/>`).join('')
    + `<path d="M${jx - 0.6},${jy - 2} L${jx - 0.3},${jy - h + 3}" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round"/>`
    + (f ? [[-16, -6], [15, -9], [-8, -16], [9, -18]] : [[-17, -2], [16, -4], [-11, -12], [12, -14]]).map(([dx, dy]) => E(jx + dx, jy + dy, 1, 1.3, '#BFE6FA', 0.5)).join('')
    + E(jx - 12, jy - 3, 3, 1.2, '#FFFFFF', 0) + E(jx + 13, jy - 2, 3, 1.2, '#FFFFFF', 0);
  // la jarre au bord de l'eau, des touffes et le palmier de devant
  const [ax, ay] = at(0.75, 0.05);
  s += P(`M${ax - 3},${ay} Q${ax - 6},${ay - 6} ${ax - 2.4},${ay - 10} L${ax - 2},${ay - 12} L${ax + 2},${ay - 12} L${ax + 2.4},${ay - 10} Q${ax + 6},${ay - 6} ${ax + 3},${ay} Q${ax},${ay + 1.4} ${ax - 3},${ay} Z`, '#C9764A', 0.9)
    + P(`M${ax + 0.6},${ay - 10} Q${ax + 5},${ay - 6} ${ax + 2.4},${ay - 0.6} Q${ax + 4},${ay - 6} ${ax + 0.6},${ay - 10} Z`, '#A85C36', 0) + E(ax, ay - 12, 2.4, 0.8, '#7E4426', 0.7) + L([ax - 3.4, ay - 6], [ax + 3.4, ay - 6], '#F2D3A0', 0.8);
  s += herbe(x + 44, y + 6, '#9CC86A', 0.9) + herbe(x - 44, y + 12, '#8CBF5C', 0.8) + herbe(x + 30, y + 20, '#9CC86A', 0.7) + fleurette(x + 50, y + 10, '#F7B6C8') + fleurette(x - 38, y + 18, '#FFFFFF');
  return s + palme(-0.5, 0.34, 0.86, 'c');
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
// Arbre-géant : un sol de jungle aux bords bosselés, fougères, champignons et fleurs ; un tronc énorme à l'écorce
// cannelée, sa mousse et son creux ; cinq racines-contreforts ; deux maîtresses branches ; une canopée en deux étages
// de touffes ; des lianes feuillues qui se balancent ; un perroquet sur la branche qui ouvre les ailes (2 images)
const JUNGLE = { devant: { light: '#BCE27E', mid: '#6FB24E', dark: '#3F7F3A' }, fond: { light: '#7CBF5A', mid: '#4E9442', dark: '#2F6634' } };
LM.arbre = { n: 2, draw: f => {
  const [x, y] = at(0, 0), BOIS = { left: '#8A623F', right: '#6A4730', bark: '#4A3020', light: '#A57A52' };
  const bosses = (cx, cy, rx, ry, n) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  const T = (lobes, marques, c, id) => feuillage(`arbre-${id}-${f}`, lobes.map(([a, b, r, h]) => [x + a, y + b, r, h]), c, marques.map(([a, b, k]) => [x + a, y + b, k]), 1);
  // une liane : un fil cerné qui pend et se balance, ses paires de feuilles, une fleur au bout pour certaines
  const liane = (lx, ly, len, ph, fleur) => {
    const sw = (f ? 2.4 : -1.8) * (ph % 2 ? 1 : 0.7), ex = lx + sw * 1.4, ey = ly + len, cx = lx + sw * 0.4, cy = ly + len * 0.5, d = `M${lx},${ly} Q${r2(cx)},${r2(cy)} ${r2(ex)},${r2(ey)}`;
    const Q = t => [(1 - t) ** 2 * lx + 2 * t * (1 - t) * cx + t * t * ex, (1 - t) ** 2 * ly + 2 * t * (1 - t) * cy + t * t * ey];
    return `<path d="${d}" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#4E8A3A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`
      + [0.3, 0.55, 0.8].map(t => { const [px, py] = Q(t); return P(`M${r2(px)},${r2(py)} q-2.6,-2.4 -5,-0.6 q2.2,2 5,0.6 Z`, JUNGLE.devant.mid, 0.6) + P(`M${r2(px)},${r2(py + 1)} q2.6,-2.4 5,-0.6 q-2.2,2 -5,0.6 Z`, JUNGLE.devant.light, 0.6); }).join('')
      + (fleur ? E(ex, ey + 1, 2, 2, '#F27A9A', 0.6) + E(ex, ey + 1, 0.8, 0.8, '#F2C94C', 0) : E(ex, ey + 1, 1.8, 1.2, JUNGLE.devant.light, 0.6));
  };
  // une touffe de grandes feuilles de jungle : amandes cernées et arquées, leur nervure
  const feuilles = (fx, fy, angles, len) => angles.map((ang, i) => `<g transform="translate(${fx} ${fy}) rotate(${ang})"><path d="M0,0 Q${r2(len * 0.5)},${r2(-len * 0.38)} ${len},0 Q${r2(len * 0.5)},${r2(len * 0.3)} 0,0 Z" fill="${i % 2 ? '#7DBE58' : '#5FA244'}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/><path d="M1,0 Q${r2(len * 0.5)},${r2(-len * 0.08)} ${r2(len - 1.5)},0" stroke="#3F7F3A" stroke-width="0.7" fill="none"/></g>`).join('');
  // le sol de la jungle
  let s = shadow(0, 0, 0.8, 0.12) + P(bosses(x, y + 4, 64, 28, 22), '#78B356', 1.1) + E(x - 6, y + 2, 46, 18, '#8CC466', 0)
    + [[-44, 16], [38, 18], [-10, 26], [50, 6]].map(([dx, dy]) => E(x + dx, y + dy, 2.4, 1.2, '#6AA34A', 0)).join('');
  // l'étage du fond de la canopée, les lianes du fond
  s += T([[-46, -100, 17], [46, -102, 17], [-28, -118, 21], [26, -120, 21], [0, -128, 22], [-60, -90, 12], [60, -92, 12]], [[-30, -112], [10, -122, 0.9], [40, -104, 0.9], [-52, -94, 0.8]], JUNGLE.fond, 'a');
  s += liane(x - 30, y - 92, 34, 1, false) + liane(x + 20, y - 94, 30, 2, false);
  // une racine-contrefort : une lame qui part du flanc du tronc et s'étale jusqu'au sol en pointe, son arête claire
  const racine = ([dx, dy, sd, h]) => { const T0 = [x + sd * 13, y - h], Pt = [x + dx, y + dy], B0 = [x + sd * 3, y + 4];
    return P(`M${T0[0]},${T0[1]} Q${r2(x + dx * 0.62)},${r2(y - h * 0.18)} ${Pt[0]},${Pt[1]} Q${r2(x + dx * 0.5)},${r2(y + dy + 0.6)} ${B0[0]},${B0[1]} L${x + sd * 9},${y - h * 0.4} Z`, sd < 0 ? BOIS.left : BOIS.right, 1.1)
      + `<path d="M${r2(T0[0] + sd * 0.6)},${r2(T0[1] + 2)} Q${r2(x + dx * 0.6)},${r2(y - h * 0.12)} ${r2(Pt[0] - sd * 1.6)},${r2(Pt[1] - 1.2)}" stroke="${sd < 0 ? BOIS.light : BOIS.bark}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`; };
  // les racines-contreforts du fond, que le tronc recouvre
  s += [[-44, 1, -1, 30], [44, 3, 1, 28]].map(racine).join('');
  // le tronc : écorce cannelée, pan d'ombre, mousse, creux
  const d = `M${x - 17},${y - 2} Q${x - 11},${y - 48} ${x - 15},${y - 94} L${x + 15},${y - 94} Q${x + 11},${y - 48} ${x + 17},${y - 2} Q${x},${y + 4} ${x - 17},${y - 2} Z`, idT = `arbre-tronc-${f}`;
  s += `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/><defs><clipPath id="${idT}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${idT})">`
    + `<path d="M${x + 4},${y + 4} Q${x + 7},${y - 48} ${x + 4},${y - 96} L${x + 20},${y - 96} L${x + 20},${y + 4} Z" fill="${BOIS.right}"/>` + E(x, y - 88, 20, 8, BOIS.right, 0)
    + [-10, -5, 0, 9, 13].map((dx, i) => `<path d="M${x + dx},${y} Q${x + dx * 0.7 + (i % 2 ? 1.5 : -1.5)},${y - 46} ${x + dx * 0.9},${y - 92}" stroke="${BOIS.bark}" stroke-width="0.9" fill="none" stroke-linecap="round"/>`).join('')
    + `<path d="M${x - 12},${y - 8} Q${x - 9},${y - 46} ${x - 12},${y - 86}" stroke="${BOIS.light}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.8"/>`
    + `<path d="M${x - 18},${y - 40} q5,-5 10,-2 q4,3 0,7 q-5,3 -10,0 Z" fill="#6FA84A"/><path d="M${x - 16},${y - 41} q4,-3 7,-1.6" stroke="#9CCB6A" stroke-width="1" fill="none" stroke-linecap="round"/></g>`
    + E(x + 2, y - 58, 4, 5.6, BOIS.bark, 0.9) + E(x + 2, y - 57.4, 2.6, 4, '#2E1E12', 0);
  // les racines-contreforts de devant
  s += [[-27, 11, -1, 22], [25, 11, 1, 20]].map(racine).join('');
  // les maîtresses branches
  s += P(`M${x - 12},${y - 82} Q${x - 30},${y - 94} ${x - 52},${y - 92} L${x - 52},${y - 86} Q${x - 30},${y - 86} ${x - 11},${y - 72} Z`, BOIS.left, 1.1)
    + P(`M${x + 12},${y - 80} Q${x + 30},${y - 90} ${x + 52},${y - 88} L${x + 52},${y - 82} Q${x + 30},${y - 82} ${x + 11},${y - 70} Z`, BOIS.right, 1.1);
  // l'étage de devant de la canopée
  s += T([[-46, -98, 14], [-58, -92, 9, 0], [-34, -94, 10, 0]], [[-46, -92], [-56, -88, 0.8]], JUNGLE.devant, 'b')
    + T([[48, -102, 14], [60, -96, 9, 0], [36, -98, 10, 0]], [[48, -96], [58, -92, 0.8]], JUNGLE.devant, 'c')
    + T([[-12, -114, 15], [13, -116, 15], [0, -106, 12, 0]], [[-12, -108], [12, -110, 0.9], [0, -102, 0.8]], JUNGLE.devant, 'd');
  // les lianes de devant
  s += liane(x - 48, y - 88, 44, 0, true) + liane(x - 38, y - 88, 28, 1, false) + liane(x + 42, y - 88, 46, 3, true) + liane(x + 54, y - 90, 30, 2, false);
  // le perroquet sur la branche droite : il ouvre les ailes sur la 2e image
  const [px, py] = [x + 28, y - 84];
  s += (f ? P(`M${px - 1},${py - 7} q-9,-9 -14,-4 q5,2 10,7 Z`, '#3D7FD0', 0.8) + P(`M${px + 1},${py - 7} q9,-9 14,-4 q-5,2 -10,7 Z`, '#3D7FD0', 0.8) : '')
    + P(`M${px - 1},${py - 1} l-1.6,8 l3,-1 l1,-7 Z`, '#3D7FD0', 0.8) + E(px, py - 5, 3.4, 5, '#E2402F', 0.9)
    + (f ? '' : P(`M${px - 2.6},${py - 7} q-1.6,4 0.6,8 q2,-3 1.4,-7 Z`, '#3D7FD0', 0.6))
    + E(px + 1, py - 11, 2.8, 2.8, '#E2402F', 0.9) + P(`M${px + 3.4},${py - 12} q3.2,0.6 1.6,4 q-1,-1.6 -2,-1.6 Z`, '#F2C04B', 0.6)
    + E(px + 1.8, py - 11.6, 0.9, 0.9, '#FFFFFF', 0) + E(px + 2, py - 11.6, 0.5, 0.5, '#2A2420', 0) + E(px - 0.6, py - 3.6, 1.2, 1.6, '#F2C04B', 0);
  // les fougères, les champignons et les fleurs au pied
  s += feuilles(x - 44, y + 14, [-160, -125, -95, -55], 12) + feuilles(x + 44, y + 14, [-125, -85, -55, -20], 12)
    + champignon(x - 22, y + 14) + champignon(x - 16, y + 16) + fleurette(x + 24, y + 18, '#F27A9A') + fleurette(x + 30, y + 16, '#F2C94C') + fleurette(x - 30, y + 22, '#F27A9A') + herbe(x + 8, y + 20, '#86B852', 0.8);
  return s;
} };
// Grande cascade : une falaise de roche à trois paliers, sa crête bosselée, ses couches, ses replats d'herbe et ses
// buissons ; sur le plateau, le ruisseau qui file au bord ; le rideau d'eau blanc qui tombe jusqu'en bas, ses filets qui
// défilent d'une image à l'autre, son écume au bord et sur les paliers ; le bassin, ses galets, ses embruns et un
// arc-en-ciel entier devant le rideau (2 images)
LM.cascade = { n: 2, draw: f => {
  const [x, y] = at(0, 0), R = { lit: '#B49C7A', mid: '#9A8262', shade: '#7C6648', strate: '#8C7454', ledge: '#C8B290' };
  const BUIS = { light: '#C9EC8E', mid: '#86C35C', dark: '#4F8E40' };
  const buisson = (bx, by, k, id) => feuillage(`cascade-${id}-${f}`, [[bx - 5 * k, by, 5.4 * k], [bx + 5 * k, by - 0.6 * k, 5.8 * k], [bx, by - 4.4 * k, 6.2 * k]], BUIS, [[bx, by - 2 * k, 0.7]], 1);
  const galet = (gx, gy, r) => E(gx, gy, r, r * 0.62, R.shade, 0.9) + E(gx - r * 0.15, gy - r * 0.16, r * 0.76, r * 0.42, R.mid, 0) + E(gx - r * 0.38, gy - r * 0.3, r * 0.32, r * 0.15, R.ledge, 0);
  // la falaise : crête bosselée, flancs bosselés ; le pan d'ombre à droite, le reflet à gauche
  const crete = [[-62, -94], [-48, -100], [-30, -97], [-14, -101], [14, -101], [30, -98], [46, -101], [62, -95]];
  let face = `M${x - 60},${y - 2} Q${x - 66},${y - 30} ${x - 61},${y - 58} Q${x - 66},${y - 78} ${x + crete[0][0]},${y + crete[0][1]}`;
  for (let i = 1; i < crete.length; i++) { const [a0, b0] = crete[i - 1], [a1, b1] = crete[i]; face += ` Q${x + (a0 + a1) / 2},${y + Math.min(b0, b1) - 3} ${x + a1},${y + b1}`; }
  face += ` Q${x + 66},${y - 74} ${x + 61},${y - 52} Q${x + 66},${y - 26} ${x + 60},${y - 4} Q${x},${y + 6} ${x - 60},${y - 2} Z`;
  const idF = `cascade-face-${f}`;
  let s = `<defs><clipPath id="${idF}"><path d="${face}"/></clipPath></defs><path d="${face}" fill="${R.lit}"/><g clip-path="url(#${idF})">`
    + `<path d="M${x + 26},${y - 110} Q${x + 34},${y - 50} ${x + 24},${y + 10} L${x + 80},${y + 10} L${x + 80},${y - 110} Z" fill="${R.shade}"/>`
    + `<path d="M${x - 58},${y - 6} Q${x - 62},${y - 40} ${x - 57},${y - 86}" stroke="${R.ledge}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>`
    // les couches dans chaque palier
    + [-86, -78, -58, -50, -30, -20].map((dy, i) => `<path d="M${x - 70},${y + dy} Q${x - 30},${y + dy + (i % 2 ? 2 : -2)} ${x},${y + dy} T${x + 70},${y + dy}" stroke="${R.strate}" stroke-width="0.9" fill="none"/>`).join('')
    // les deux replats : leur dessus clair, leur ombre portée dessous, leur frange d'herbe
    + [-68, -40].map(dy => `<path d="M${x - 70},${y + dy + 2} Q${x - 30},${y + dy + 5} ${x},${y + dy + 3} T${x + 70},${y + dy + 2} L${x + 70},${y + dy + 6} Q${x + 30},${y + dy + 8} ${x},${y + dy + 7} T${x - 70},${y + dy + 6} Z" fill="${R.shade}" opacity="0.7"/>`
      + `<path d="M${x - 70},${y + dy - 2} Q${x - 30},${y + dy + 1} ${x},${y + dy - 1} T${x + 70},${y + dy - 2} L${x + 70},${y + dy + 2} Q${x + 30},${y + dy + 4} ${x},${y + dy + 3} T${x - 70},${y + dy + 2} Z" fill="#8FC46A"/>`
      + `<path d="M${x - 70},${y + dy + 2} ${Array.from({ length: 28 }, (_, k) => `q2.5,${k % 2 ? 2.2 : 3.4} 5,0`).join(' ')}" stroke="#6FA84E" stroke-width="1" fill="none"/>`).join('')
    + `<path d="M${x - 40},${y - 14} l3,-6 l-1,-5 M${x + 40},${y - 80} l-2,6 l2,4" stroke="${R.shade}" stroke-width="0.8" fill="none" stroke-linecap="round"/></g>`
    + `<path d="${face}" fill="none" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/>`;
  // le plateau d'herbe sur la crête, ses buissons ; les buissons des replats
  let herbeTop = `M${x + crete[0][0] - 2},${y + crete[0][1] + 1}`;
  for (let i = 1; i < crete.length; i++) { const [a0, b0] = crete[i - 1], [a1, b1] = crete[i]; herbeTop += ` Q${x + (a0 + a1) / 2},${y + Math.min(b0, b1) - 7} ${x + a1},${y + b1 - 4}`; }
  herbeTop += ` L${x + 63},${y - 92}`;
  for (let i = crete.length - 1; i > 0; i--) { const [a0, b0] = crete[i], [a1, b1] = crete[i - 1]; herbeTop += ` Q${x + (a0 + a1) / 2 - 1},${y + Math.max(b0, b1) + 4} ${x + a1},${y + b1 + 2}`; }
  s += P(herbeTop + ' Z', '#8FC46A', 1);
  s += buisson(x - 46, y - 102, 1, 'a') + buisson(x + 44, y - 103, 0.9, 'b') + buisson(x - 52, y - 72, 0.7, 'c') + buisson(x + 50, y - 44, 0.75, 'd') + buisson(x - 34, y - 44, 0.6, 'e');
  // le ruisseau du plateau qui file vers le bord
  s += P(`M${x - 12},${y - 99} Q${x - 9},${y - 103} ${x - 6},${y - 106} Q${x + 1},${y - 108} ${x + 8},${y - 106} Q${x + 10},${y - 103} ${x + 12},${y - 99} Z`, '#7FC0E2', 0.9)
    + `<path d="M${x - 4},${y - 104} l5,-0.6 M${x + 1},${y - 101} l6,-0.4" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/>`;
  // le rideau d'eau, ses filets qui défilent, l'écume au bord et sur les paliers
  const rideau = `M${x - 12},${y - 99} Q${x - 14},${y - 50} ${x - 16},${y - 4} L${x + 16},${y - 4} Q${x + 14},${y - 50} ${x + 12},${y - 99} Z`, idR = `cascade-rideau-${f}`;
  s += `<defs><clipPath id="${idR}"><path d="${rideau}"/></clipPath></defs><path d="${rideau}" fill="#CFEAF7"/><g clip-path="url(#${idR})">`
    + `<path d="M${x + 4},${y - 100} L${x + 20},${y - 100} L${x + 20},${y} L${x + 6},${y} Z" fill="#A8D8F0"/>`
    + Array.from({ length: 7 }, (_, j) => { const xx = x - 11 + j * 3.7, off = ((f * 0.5 + j * 0.37) % 1) * 36; return [0, 36, 72].map(o => `<path d="M${r2(xx)},${r2(y - 108 + off + o)} l${r2((xx - x) * 0.04)},20" stroke="${j % 2 ? '#FFFFFF' : '#86C6E8'}" stroke-width="1.4" stroke-linecap="round"/>`).join(''); }).join('')
    + `</g><path d="${rideau}" fill="none" stroke="${OUT}" stroke-width="1"/>`;
  s += puff(x - 2, y - 99, 4.4, 0.95) + puff(x + 6, y - 100, 3.6, 0.9) + puff(x - 15, y - 66, 3.4, 0.85) + puff(x + 15, y - 64, 3.2, 0.85) + puff(x - 16, y - 38, 3.4, 0.85) + puff(x + 16, y - 37, 3.2, 0.85);
  // le bassin, ses galets, l'écume et les embruns au pied du rideau
  s += E(x, y + 4, 46, 13, WATER, 1.1) + E(x - 6, y + 3, 30, 7, WATER_LIGHT, 0) + `<path d="M${x - 34},${y + 8} l8,-1 M${x + 22},${y + 11} l9,-1.2" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>`
    + galet(x - 44, y + 4, 5) + galet(x - 36, y + 12, 3.6) + galet(x + 42, y + 6, 4.6) + galet(x + 34, y + 13, 3.2)
    + puff(x - 12, y - 4, 7, 0.9) + puff(x + 10, y - 6, 6.4, 0.85) + puff(x, y + 1, 6, 0.95) + puff(x - 4 + f * 4, y - 14 - f * 3, 5, 0.6) + puff(x + 8 - f * 4, y - 20 - f * 2, 4, 0.45);
  // l'arc-en-ciel entier dans les embruns, devant le rideau
  s += `<g opacity="0.6">${['#E8566A', '#F2A03C', '#F2D04B', '#7EC45B', '#5C8FD0', '#8C6FD0'].map((c, i) => { const r = 40 - i * 2.6; return `<path d="M${r2(x - r)},${y - 4} A${r2(r)},${r2(r * 0.85)} 0 0 1 ${r2(x + r)},${y - 4}" stroke="${c}" stroke-width="2.6" fill="none"/>`; }).join('')}</g>`;
  // des touffes au bord du bassin
  return s + herbe(x - 30, y + 16, '#86B852', 0.9) + herbe(x + 28, y + 17, '#94C25C', 0.8) + fleurette(x - 22, y + 18, '#FFFFFF') + fleurette(x + 36, y + 17, '#F7B6C8');
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
// Lac de lave : un sol de cendre aux bords bosselés, ses fissures rougeoyantes ; un anneau de blocs de basalte, éclairés
// d'orange côté lave ; le bassin qui bouillonne en quatre teintes, ses plaques de croûte ; des bulles qui crèvent d'une
// image à l'autre ; la lueur (une seule, comme avant), la fumée qui monte et des escarbilles (2 images)
LM.cratere = { n: 2, draw: f => {
  const [x, y] = at(0, 0), B = { lit: '#77707E', mid: '#524C5C', dark: '#36313F' };
  const bosses = (cx, cy, rx, ry, n) => { const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU, r = 1 + (i % 2 ? 0.05 : -0.03); return [cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r]; }); const mil = i => { const p = pts[i % n], q = pts[(i + 1) % n]; return `${r2((p[0] + q[0]) / 2)},${r2((p[1] + q[1]) / 2)}`; }; let d = `M${mil(n - 1)}`; for (let i = 0; i < n; i++) d += ` Q${r2(pts[i][0])},${r2(pts[i][1])} ${mil(i)}`; return d + ' Z'; };
  // un bloc de basalte bosselé ; côté lave, un liseré orangé
  const bloc = (bx, by, r, k, chaud) => P(bosses(bx, by, r, r * 0.72, 7 + (k % 3)), B.mid, 1) + E(bx - r * 0.18, by - r * 0.26, r * 0.66, r * 0.36, B.lit, 0) + E(bx - r * 0.34, by - r * 0.36, r * 0.26, r * 0.12, '#9C96A4', 0)
    + (chaud ? `<path d="M${r2(bx - r * 0.7)},${r2(by + r * 0.3)} Q${bx},${r2(by + r * 0.75)} ${r2(bx + r * 0.7)},${r2(by + r * 0.3)}" stroke="#F0843A" stroke-width="1.4" fill="none" stroke-linecap="round"/>` : '');
  // le sol de cendre et ses fissures rougeoyantes
  let s = shadow(0, 0, 0.8, 0.14) + P(bosses(x, y + 4, 64, 28, 22), '#6E6460', 1.1) + E(x - 6, y + 4, 46, 17, '#7C726C', 0)
    + `<path d="M${x - 50},${y + 10} l7,3 l4,-2 l6,4 M${x + 38},${y + 16} l6,-3 l5,2 M${x - 14},${y + 24} l5,-2 l6,2" stroke="#E0602E" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<path d="M${x - 50},${y + 10} l7,3 l4,-2 l6,4 M${x + 38},${y + 16} l6,-3 l5,2 M${x - 14},${y + 24} l5,-2 l6,2" stroke="#FFC46A" stroke-width="0.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    + [[-40, 20, 2.4], [46, 6, 2], [22, 24, 1.8]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.6, B.dark, 0.6)).join('');
  // l'anneau de basalte : la moitié du fond, puis le bassin, puis la moitié de devant
  const blocs = Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * TAU + 0.2; return { k, bx: x + Math.cos(a) * 38, by: y - 2 + Math.sin(a) * 16.5, r: 7 + (k * 5) % 4, fond: Math.sin(a) < 0 }; });
  s += blocs.filter(b => b.fond).map(b => bloc(b.bx, b.by - 2, b.r, b.k, true)).join('');
  // le bassin de lave en quatre teintes, ses plaques de croûte aux fentes vives
  s += E(x, y - 2, 33, 13.4, '#B83A28', 1) + E(x, y - 2.6, 29, 11.4, '#EE7430', 0) + E(x - 3, y - 3.4, 21, 7.8, '#FFB040', 0) + E(x - 5, y - 4, 11, 4, '#FFE39A', 0);
  s += [[-16, 2, 0], [14, -6, 1], [6, 5, 2]].map(([dx, dy, k]) => { const cx = x + dx + (f ? (k - 1) * 1.2 : 0), cy = y + dy; return P(`M${cx - 6},${cy} L${cx - 3},${cy - 3} L${cx + 4},${cy - 2.6} L${cx + 7},${cy + 0.4} L${cx + 2},${cy + 2.6} L${cx - 4},${cy + 2.2} Z`, '#4A3A36', 0.6) + L([cx - 2, cy - 2.4], [cx + 1, cy + 2.2], '#FF9A44', 0.7); }).join('');
  // les bulles qui gonflent et qui crèvent
  s += (f ? [[-6, -6, 2.6, 1], [18, 0, 2, 0], [-22, -2, 1.6, 0]] : [[8, -8, 2.2, 0], [-14, -5, 2.8, 1], [20, 2, 1.6, 0]]).map(([dx, dy, r, crev]) => crev
    ? `<ellipse cx="${x + dx}" cy="${y + dy}" rx="${r * 1.8}" ry="${r * 0.7}" fill="none" stroke="#FFE39A" stroke-width="0.9"/>` + [[-1, -1], [1, -1.2], [0, -1.6]].map(([gx, gy]) => E(x + dx + gx * r * 1.4, y + dy + gy * r * 1.6, 0.8, 1, '#FFC24A', 0)).join('')
    : E(x + dx, y + dy, r, r * 0.8, '#FFC24A', 0.7) + E(x + dx - r * 0.3, y + dy - r * 0.3, r * 0.35, r * 0.25, '#FFF1C0', 0)).join('');
  // la lueur du bassin
  s += glow(x, y - 6, 40, '255,140,60', f ? 0.3 : 0.24);
  s += blocs.filter(b => !b.fond).map(b => bloc(b.bx, b.by, b.r, b.k, false)).join('');
  // la fumée qui monte et les escarbilles
  const fumee = (cx, cy, r, a) => `<g opacity="${a}">${E(cx, cy, r, r * 0.72, '#8A8290', 0)}${E(cx + r * 0.6, cy - r * 0.3, r * 0.7, r * 0.55, '#A29AA6', 0)}${E(cx - r * 0.5, cy - r * 0.25, r * 0.6, r * 0.5, '#B4AEB8', 0)}</g>`;
  s += fumee(x - 6, y - 24 - f * 6, 8, 0.75) + fumee(x + 4, y - 40 - f * 6, 7, 0.55) + fumee(x - 2, y - 56 - f * 4, 6, 0.35);
  return s + (f ? [[-14, -22], [12, -30], [4, -16]] : [[-10, -30], [16, -20], [-2, -38]]).map(([dx, dy]) => E(x + dx, y + dy, 1, 1, '#FFB040', 0) + E(x + dx, y + dy, 0.4, 0.4, '#FFF1C0', 0)).join('');
} };

module.exports = { LM, LAND };
