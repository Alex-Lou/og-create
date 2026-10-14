// Amiral, le coq de Cannelle (demande du 14 octobre 2026) : échoué sur une caisse, « fier comme un amiral ». Il chante
// à l'aube, veille la nuit sur les poules et se tient très droit. Plus grand qu'une poule : crête rouge en dents de scie,
// barbillons, camail orange doré en pointes, poitrail roux sombre, longue queue en faucilles vert-bronze et noires aux
// reflets irisés ; une plume de mouette coincée dans la crête, souvenir de la mer. Fier mais choupi, jamais agressif.
// Même trait, même lumière et mêmes pattes que les poules (betes.js, betes3.js), dans le cadre de la poule
// ([-15, -22.5, 30, 25.5]) : le jeu le grandit lui-même. Vues : profil (tourné vers la droite), avant (trois quarts
// avant, il vient vers le bas à droite), dos (trois quarts dos) ; le miroir donne les autres directions.
// Poses : marche1, marche2, repos (debout, droit : il veille), clignement, joie (le chant : tête levée, bec grand
// ouvert, ailes un peu écartées, deux notes). Chaque dessin porte ses propres identifiants (coq-<vue>-<pose>-…).
const { OUT, P, E, clip, r2 } = require('./troupe');
const Bt = require('./betes');
const { eye, limb, stroke, contact, bez } = Bt;

const SH = 'rgba(40,55,20,.18)';
const f2p = q => `${r2(q[0])},${r2(q[1])}`;
const rot = (x, y, cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };

// La palette d'Amiral
const C = {
  crete: ['#FF8A70', '#E8433A', '#B82A28'],
  camail: ['#FFD67E', '#F4A63E', '#DB7428'],
  plumeCamail: '#C25E22',
  dos: ['#EC8E4C', '#C85E2C', '#913E1C'],
  poitrail: ['#BE6638', '#9C4A2A', '#74331E'],
  aile: '#8C3A1C', barre: '#2D6550',
  queue: ['#4BA57A', '#2C6E52', '#16211D'],
  couverture: ['#5DB488', '#33785A', '#1F3D33'],
  reflet: '#9CEBC8', irise: '#A894EC',
  bec: ['#FFD474', '#F2B33B', '#D08A22'],
  patte: '#F2B33B', patteLoin: '#C98E2A',
  tete: ['#FFCB66', '#F2A23E', '#D9782C'],
  joue: '#F7A8B0', oreillon: '#FFF6EA',
  mouette: ['#FFFFFF', '#E6ECF2', '#8E9AAA'],
  note: '#F2C94C', bouche: '#C9373A'
};

// ——— Petits outils ———
const defs = inner => `<defs>${inner}</defs>`;
const lin = (id, [x1, y1, x2, y2], stops, user = false) => `<linearGradient id="${id}"${user ? ' gradientUnits="userSpaceOnUse"' : ''} x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, [cx, cy, r], stops) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const url = id => `url(#${id})`;
// Une plume effilée le long d'une courbe de Bézier (p0 : la racine, p3 : la pointe), large de w0 à la racine
function ruban(p0, p1, p2, p3, w0, w1, fill, sw = 0.75, n = 12) {
  const pts = bez(p0, p1, p2, p3, n), L = [], R = [];
  pts.forEach((q, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
    const t = i / (n - 1), w = (w0 + (w1 - w0) * Math.pow(t, 0.85)) / 2;
    L.push([q[0] - (dy / m) * w, q[1] + (dx / m) * w]);
    R.push([q[0] + (dy / m) * w, q[1] - (dx / m) * w]);
  });
  return P(`M${L.map(f2p).join(' L')} L${R.reverse().map(f2p).join(' L')} Z`, fill, sw);
}
// La tige d'une plume (un trait fin le long de sa courbe, jusqu'à t1)
const tige = (p0, p1, p2, p3, w, col, t1 = 0.85, op = 1) => {
  const pts = bez(p0, p1, p2, p3, 8).slice(0, Math.max(2, Math.round(8 * t1)));
  return `<path d="M${pts.map(f2p).join(' L')}" fill="none" stroke="${col}" stroke-width="${r2(w)}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
};
// Un corps ovale tourné (ang), un peu plus plein devant (egg) : son contour
function ovale(cx, cy, rx, ry, ang, egg = 0.08) {
  const pts = [];
  for (let i = 0; i < 30; i++) { const t = (i / 30) * Math.PI * 2; pts.push(rot(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry * (1 + egg * Math.cos(t)), cx, cy, ang)); }
  return `M${pts.map(f2p).join(' L')} Z`;
}

// ——— Les pièces d'Amiral ———

// La queue : deux grandes faucilles noires et vert-bronze qui montent et retombent en arc, trois couvertures plus
// courtes ; un reflet vert d'eau et un éclat irisé sur chaque faucille. o : la racine ; k : sens (1 : la queue part
// vers la gauche) ; up : la hauteur ; sway : le balancement de la marche ; g : préfixe des dégradés
function queue(o, k, up, sway, g, lenK = 1) {
  const [x, y] = o, X = dx => x - dx * k * lenK, Y = dy => y - dy * up;
  const plumes = [
    // [p1, p2, p3 (décalages depuis la racine), largeur, dégradé] : la grande faucille au fond, une couverture,
    // la seconde faucille, deux couvertures devant
    [[1.0, 8.6], [8.0, 11.2], [8.8 + sway, 4.0], 3.3, 'q'],
    [[2.4, 4.6], [5.6, 6.2], [6.9 + sway * 0.6, 1.4], 2.5, 'c'],
    [[0.2, 6.6], [5.9, 8.8], [7.2 + sway * 0.8, 2.2], 3.0, 'q'],
    [[1.4, 2.4], [4.4, 3.0], [5.6 + sway * 0.5, -0.2], 2.3, 'c']
  ];
  let s = '';
  for (const [a, b, c2, w, gr] of plumes) {
    const p0 = [x, y], p1 = [X(a[0]), Y(a[1])], p2 = [X(b[0]), Y(b[1])], p3 = [X(c2[0]), Y(c2[1])];
    s += ruban(p0, p1, p2, p3, w, 0.2, url(`${g}${gr}`), 0.8);
    if (gr === 'q') s += tige(p0, p1, p2, p3, 0.5, C.reflet, 0.62, 0.55) + tige(p0, [p1[0], p1[1] + 0.4], [p2[0], p2[1] + 0.5], p3, 0.3, C.irise, 0.45, 0.6);
    else s += tige(p0, p1, p2, p3, 0.3, 'rgba(255,255,255,.35)', 0.7);
  }
  return s;
}
const queueDefs = (g, sens) => lin(`${g}q`, sens, [[0, C.queue[2]], [0.35, C.queue[1]], [0.7, C.queue[0]], [1, C.queue[2]]])
  + lin(`${g}c`, sens, [[0, C.couverture[2]], [0.5, C.couverture[1]], [1, C.couverture[0]]]);

// La patte écailleuse : la jambe, ses écailles, l'ergot derrière, trois doigts devant et un derrière ; hip : la hanche
// (cachée par le corps) ; foot : le pied au sol ; D : le sens du pied (vers l'avant), N : le côté (la profondeur)
function patte(hip, foot, col, D = [1, 0.12], N = [0, 0.35]) {
  const [fx, fy] = foot;
  const toe = (dx, dy) => stroke(`M${r2(fx)},${r2(fy - 0.5)} l${r2(dx)},${r2(dy)}`, 1.7, OUT) + stroke(`M${r2(fx)},${r2(fy - 0.5)} l${r2(dx)},${r2(dy)}`, 0.75, col);
  const at = t => [hip[0] + (fx - hip[0]) * t, hip[1] + (fy - 0.6 - hip[1]) * t];
  const sp = at(0.72);
  return contact(fx + 0.4 * D[0], 1.5) + limb(hip, [fx, fy - 0.6], 1.2, col)
    // l'ergot, pointé vers l'arrière
    + P(`M${f2p([sp[0] - 0.3 * D[0], sp[1] - 0.25])} L${f2p([sp[0] - 1.1 * D[0], sp[1] + 0.05 - 0.6 * D[1]])} L${f2p([sp[0] - 0.3 * D[0], sp[1] + 0.35])} Z`, col, 0.5)
    + [0.45, 0.6, 0.85].map(t => { const q = at(t); return stroke(`M${r2(q[0] - 0.4)},${r2(q[1])} L${r2(q[0] + 0.4)},${r2(q[1] + 0.16)}`, 0.24, 'rgba(60,40,25,.4)'); }).join('')
    + toe(D[0] * 1.5 - N[0], D[1] * 1.5 - N[1] + 0.25) + toe(D[0] * 1.9, D[1] * 1.9 + 0.45) + toe(D[0] * 1.4 + N[0], D[1] * 1.4 + N[1] + 0.55) + toe(-D[0] * 1.0, -D[1] * 1.0 - 0.05);
}

// La crête en dents de scie (cinq dents, la plus haute au milieu, une lame vers l'arrière) sur le dessus de la tête ;
// a : l'angle de la tête ; k : le sens (1 : le bec à droite) ; sq : l'écrasement de trois quarts
function crete(hx, hy, hr, k, g, sq = 1) {
  const top = dx => hy - Math.sqrt(Math.max(0, hr * hr - dx * dx)) + 1.6;
  const X = dx => hx + dx * k * sq;
  // les creux entre les dents (décalage, hauteur au-dessus du pied caché dans la tête) ; chaque dent est un lobe haut
  // et arrondi posé entre deux creux, le plus haut au milieu, et une lame vers l'arrière
  const creux = [[2.7, 1.6], [1.5, 2.85], [0.3, 3.3], [-0.9, 3.3], [-2.1, 2.85], [-3.2, 1.8]];
  const V = ([dx, h]) => [X(dx), top(dx) - h];
  let d = `M${f2p([X(2.85), top(2.85) + 0.6])} L${f2p(V(creux[0]))}`;
  for (let i = 1; i < creux.length; i++) d += ` A${r2(0.7 * sq)},1.1 0 1,0 ${f2p(V(creux[i]))}`;
  d += ` Q${f2p([X(-3.8), top(-3.2) - 1.3])} ${f2p([X(-3.6), top(-3.2) + 0.2])} L${f2p([X(-2.8), top(-2.8) + 0.8])} Z`;
  const hi = [1, 2, 3].map(i => { const [a, b] = [V(creux[i]), V(creux[i + 1])]; return E((a[0] + b[0]) / 2 + 0.08 * k, (a[1] + b[1]) / 2 - 0.75, 0.24 * sq + 0.06, 0.42, 'rgba(255,224,208,.75)', 0); }).join('');
  return P(d, url(`${g}cr`), 0.7) + clip(`${g}crc`, d, hi) + P(d, 'none', 0.7);
}
const creteDef = g => lin(`${g}cr`, [0, 0, 0, 1], [[0, C.crete[0]], [0.45, C.crete[1]], [1, C.crete[2]]]);

// La plume de mouette coincée derrière la crête : la tige qui dépasse, le vexille blanc et large, une encoche, la
// pointe grise
function mouette(base, tip, g) {
  const [bx, by] = base, [tx, ty] = tip, L0 = Math.hypot(tx - bx, ty - by), ux = (tx - bx) / L0, uy = (ty - by) / L0, nx = -uy, ny = ux;
  const at = (t, w) => [bx + ux * L0 * t + nx * w, by + uy * L0 * t + ny * w];
  const d = `M${f2p(at(0.18, 0))} Q${f2p(at(0.3, 1.05))} ${f2p(at(0.62, 0.95))} L${f2p(at(0.66, 0.55))} L${f2p(at(0.72, 0.85))} Q${f2p(at(0.9, 0.6))} ${f2p(at(1, 0))} Q${f2p(at(0.75, -0.75))} ${f2p(at(0.45, -0.8))} Q${f2p(at(0.25, -0.65))} ${f2p(at(0.18, 0))} Z`;
  return P(d, url(`${g}mo`), 0.55) + stroke(`M${f2p(at(0, 0))} Q${f2p(at(0.5, 0.12))} ${f2p(at(0.96, 0.02))}`, 0.32, '#7E8A9A');
}
const mouetteDef = (g, sens) => lin(`${g}mo`, sens, [[0, C.mouette[0]], [0.6, C.mouette[1]], [1, C.mouette[2]]]);

// Les barbillons : deux gouttes rouges sous le bec (l'une plus loin, plus sombre) ; sw : leur balancement
const barbillons = (x, y, sw, g) => E(x - 0.45 + sw * 0.6, y - 0.35, 0.45, 0.75, C.crete[2], 0.55) + E(x + sw, y - 0.15, 0.58, 0.95, url(`${g}cr`), 0.65)
  + E(x - 0.12 + sw, y - 0.5, 0.18, 0.3, 'rgba(255,220,200,.7)', 0);

// Deux notes de musique dorées (le chant)
const note = (x, y, k = 1) => E(x, y, 0.75 * k, 0.55 * k, C.note, 0.5) + stroke(`M${r2(x + 0.65 * k)},${r2(y - 0.1)} L${r2(x + 0.65 * k)},${r2(y - 2.6 * k)} Q${r2(x + 1.5 * k)},${r2(y - 2.2 * k)} ${r2(x + 1.6 * k)},${r2(y - 1.3 * k)}`, 0.5, OUT);
const notes = (x, y) => note(x, y, 1) + note(x + 2.2, y - 1.6, 0.85);

// Le bec de profil : fermé (légèrement crochu) ou grand ouvert (le chant, la bouche rouge)
function bec(x0, y0, ouvert, g) {
  if (ouvert) return P(`M${f2p([x0, y0 - 0.2])} L${f2p([x0 + 2.2, y0 - 1.05])} L${f2p([x0 + 1.9, y0 + 1.15])} Z`, C.bouche, 0.5)
    + P(`M${f2p([x0 - 0.3, y0 - 1.05])} Q${f2p([x0 + 1.3, y0 - 1.75])} ${f2p([x0 + 2.45, y0 - 1.25])} L${f2p([x0 + 0.25, y0 - 0.15])} Z`, url(`${g}be`), 0.7)
    + P(`M${f2p([x0 + 0.1, y0 + 0.2])} L${f2p([x0 + 2.05, y0 + 1.3])} Q${f2p([x0 + 0.9, y0 + 1.6])} ${f2p([x0 - 0.25, y0 + 1.05])} Z`, url(`${g}be`), 0.7);
  return P(`M${f2p([x0 - 0.3, y0 - 1.05])} Q${f2p([x0 + 1.5, y0 - 1.15])} ${f2p([x0 + 2.4, y0 + 0.45])} Q${f2p([x0 + 1.3, y0 + 1.15])} ${f2p([x0 - 0.25, y0 + 1.0])} Z`, url(`${g}be`), 0.75)
    + stroke(`M${f2p([x0 + 0.05, y0 + 0.2])} L${f2p([x0 + 1.95, y0 + 0.42])}`, 0.32, OUT) + E(x0 + 0.55, y0 - 0.45, 0.17, 0.12, OUT, 0);
}
const becDef = g => lin(`${g}be`, [0, 0, 0, 1], [[0, C.bec[0]], [0.55, C.bec[1]], [1, C.bec[2]]]);

// Le camail : la cape de plumes dorées du cou, le bord bas en pointes posé sur le corps. a : derrière la tête ;
// b : l'épaule ; c : le haut du poitrail ; d : la gorge ; n : le nombre de pointes
function camail(a, b, c, d, n, g, k = 1, sw = 0.85) {
  let edge = '';
  for (let i = 1; i <= n; i++) {
    const t0 = (i - 0.5) / n, t1 = i / n;
    const tip = [b[0] + (c[0] - b[0]) * t0, b[1] + (c[1] - b[1]) * t0 + 1.35];
    const v = [b[0] + (c[0] - b[0]) * t1, b[1] + (c[1] - b[1]) * t1];
    edge += ` Q${f2p([tip[0] - 0.25 * k, tip[1] - 0.5])} ${f2p(tip)} Q${f2p([tip[0] + 0.15 * k, tip[1] - 0.6])} ${f2p(v)}`;
  }
  const dd = `M${f2p(a)} Q${f2p([(a[0] + b[0]) / 2 - 0.9 * k, (a[1] + b[1]) / 2])} ${f2p(b)}${edge} Q${f2p([(c[0] + d[0]) / 2 + 0.7 * k, (c[1] + d[1]) / 2])} ${f2p(d)} Z`;
  // les plumes du camail : quelques traits fins vers les pointes
  const lines = [0.2, 0.45, 0.7].map(t => { const tip = [b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t + 0.9]; const top = [a[0] + (d[0] - a[0]) * t, a[1] + (d[1] - a[1]) * t + 1.2]; return stroke(`M${f2p(top)} Q${f2p([(top[0] + tip[0]) / 2 + 0.3 * k, (top[1] + tip[1]) / 2])} ${f2p(tip)}`, 0.32, C.plumeCamail); }).join('');
  return P(dd, url(`${g}ca`), sw) + clip(`${g}cac`, dd, lines) + P(dd, 'none', sw);
}
const camailDef = g => lin(`${g}ca`, [0, 0, 0, 1], [[0, C.camail[0]], [0.5, C.camail[1]], [1, C.camail[2]]]);
// Les lancettes de la selle : de longues plumes dorées et fines qui retombent sur le croupion
const selle = (o, k, g) => [[-0.2, 1.0, 2.1, 2.6], [0.6, 1.3, 2.6, 3.4], [1.4, 1.6, 2.9, 3.9]].map(([dx, a, b, c]) =>
  ruban([o[0] - dx * k, o[1]], [o[0] - (dx + a) * k, o[1] + 0.6], [o[0] - (dx + b) * k, o[1] + 1.6], [o[0] - (dx + c) * k, o[1] + 3.1], 0.95, 0.15, url(`${g}ca`), 0.55, 10)).join('');

// Le corps : dégradé roux (lumière en haut à gauche), le poitrail sombre devant, un reflet
const corpsDefs = g => rad(`${g}co`, ['35%', '28%', '75%'], [[0, C.dos[0]], [0.55, C.dos[1]], [1, C.dos[2]]])
  + rad(`${g}po`, ['40%', '30%', '70%'], [[0, C.poitrail[0]], [0.6, C.poitrail[1]], [1, C.poitrail[2]]])
  + rad(`${g}te`, ['38%', '30%', '72%'], [[0, C.tete[0]], [0.6, C.tete[1]], [1, C.tete[2]]]);
function corps(d, g, poitrail, reflet) {
  return P(d, url(`${g}co`), 1.05) + clip(`${g}cb`, d, poitrail + reflet) + P(d, 'none', 1.05);
}
// L'aile repliée (celle des poules), une barre vert-bronze en travers ; a : l'épaule, b : le bout, h : sa hauteur
function aile(a, b, h, g) {
  const dx = b[0] - a[0], dy = b[1] - a[1], pt = (t, v) => [a[0] + dx * t, a[1] + dy * t + h * v];
  return Bt.ailePlume(a, b, h, C.aile, `${g}ai`) + stroke(`M${f2p(pt(0.12, 0.22))} Q${f2p(pt(0.45, 0.42))} ${f2p(pt(0.8, 0.34))}`, 0.95, C.barre)
    + stroke(`M${f2p(pt(0.18, 0.12))} Q${f2p(pt(0.45, 0.3))} ${f2p(pt(0.72, 0.24))}`, 0.3, C.reflet).replace('/>', ' opacity="0.6"/>');
}

// ——— Profil (tourné vers la droite) ———
function profil(pose) {
  const g = `coq-profil-${pose}-`;
  const walk = pose === 'marche1' || pose === 'marche2', chant = pose === 'joie';
  const ph = pose === 'marche2' ? -1 : 1, bob = pose === 'marche2' ? -0.35 : 0;
  const mode = pose === 'clignement' ? 'blink' : chant ? 'joy' : 'open';
  const bx = -0.9, by = -6.7 + bob, brx = 5.3, bry = 4.7, ang = -0.12;
  const hr = 3.6;
  const [hx, hy] = chant ? [3.0, -13.5 + bob] : [3.55, -12.7 + bob + (walk ? ph * 0.3 : 0)];
  const tilt = chant ? -24 : 0;
  const body = ovale(bx, by, brx, bry, ang);
  let s = defs(corpsDefs(g) + queueDefs(g, [1, 1, 0, 0]) + creteDef(g) + mouetteDef(g, [1, 1, 0, 0]) + becDef(g) + camailDef(g));
  s += E(bx + 0.5, -0.15, 5.0, 1.25, SH, 0);
  // les pattes (la plus loin, plus sombre, d'abord)
  for (const [i, x] of [[1, bx - 0.6], [0, bx + 1.2]]) {
    const dx = walk ? (i ? -ph : ph) * 1.15 : 0, lift = walk && (i ? -ph : ph) < 0 ? -0.35 : 0;
    s += patte([x, by + bry * 0.55], [x + dx + 0.2, lift], i ? C.patteLoin : C.patte);
  }
  // la queue (derrière le corps), l'aile la plus loin quand il chante
  s += queue([bx - brx * 0.7, by - bry * 0.42], 1, 1, walk ? ph * 0.45 : 0, g, 0.92);
  if (chant) s += P(`M${f2p([bx + 1.6, by - 2.6])} Q${f2p([bx - 1.4, by - 6.4])} ${f2p([bx - 4.6, by - 4.4])} Q${f2p([bx - 2.2, by - 3.6])} ${f2p([bx - 0.4, by - 2.0])} Z`, tone(C.aile, 0.78), 0.8);
  // le corps, le poitrail sombre devant, un reflet
  const breast = `<ellipse cx="${r2(bx + brx * 0.55)}" cy="${r2(by + bry * 0.25)}" rx="${r2(brx * 0.62)}" ry="${r2(bry * 0.95)}" fill="${url(`${g}po`)}"/>`;
  const shine = stroke(`M${f2p([bx - brx * 0.55, by - bry * 0.55])} Q${f2p([bx - brx * 0.1, by - bry * 1.0])} ${f2p([bx + brx * 0.35, by - bry * 0.95])}`, 0.55, 'rgba(255,230,190,.55)');
  s += corps(body, g, breast, shine);
  // la selle sur le croupion, l'aile (relevée et un peu écartée quand il chante)
  s += selle([bx - brx * 0.25, by - bry * 0.88], 1, g);
  const wa = [bx + brx * 0.38, by - bry * 0.22], wb = [bx - brx * 0.82, by + bry * 0.2];
  const wing = aile(wa, wb, bry * 0.82, g);
  s += chant ? `<g transform="rotate(-14 ${r2(wa[0])} ${r2(wa[1])})">${wing}</g>` : wing;
  // le camail, de derrière la tête au haut du poitrail
  s += camail([hx - hr * 0.98, hy + 0.5], [bx - 0.4, by - bry * 0.62], [bx + brx * 0.9, by - bry * 0.32], [hx + hr * 0.5, hy + hr * 0.9], 5, g);
  // la tête (penchée en arrière quand il chante)
  let h = mouette([hx - 1.3, hy - hr + 1.5], [hx - 5.0, hy - hr - 1.0], g);
  h += crete(hx, hy, hr, 1, g);
  h += E(hx, hy, hr, hr, url(`${g}te`), 1.05);
  h += stroke(`M${f2p([hx - hr * 0.72, hy - hr * 0.2])} Q${f2p([hx - hr * 0.55, hy - hr * 0.7])} ${f2p([hx - hr * 0.1, hy - hr * 0.78])}`, 0.5, 'rgba(255,240,210,.7)');
  h += E(hx + 0.75, hy + 1.05, 0.85, 0.42, C.joue, 0);
  const x0 = hx + hr * 0.84, y0 = hy + 0.3;
  h += barbillons(x0 + 0.35, y0 + 2.0, walk ? -ph * 0.2 : 0, g);
  h += bec(x0, y0, chant, g);
  h += eye(hx + 0.95, hy - 0.55, 1.02, mode);
  s += tilt ? `<g transform="rotate(${tilt} ${r2(hx)} ${r2(hy)})">${h}</g>` : h;
  if (chant) s += notes(hx + 5.2, hy - 0.6);
  return s;
}
const tone = (hex, k) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('').toUpperCase();


// ——— Trois quarts : avant (il vient vers le bas à droite) et dos (il s'éloigne vers le haut à droite) ———
// Comme les poules (betes3.js) : le corps ovale couché dans la vue, la tête portée vers l'avant (F), les pattes de part
// et d'autre (S) ; de trois quarts avant la queue est derrière, de dos elle se dresse devant nous et la tête passe
// derrière le corps.
function trois(view, pose) {
  const se = view === 'avant';
  const g = `coq-${view}-${pose}-`;
  const walk = pose === 'marche1' || pose === 'marche2', chant = se && pose === 'joie';
  const ph = pose === 'marche2' ? -1 : 1, bob = pose === 'marche2' ? -0.35 : 0;
  const mode = pose === 'clignement' ? 'blink' : chant ? 'joy' : 'open';
  const F = se ? [1, 0.5] : [1, -0.5], S = se ? [-1, 0.5] : [1, 0.5];
  const by = -6.7 + bob, rx = 4.7, ry = 4.8, ang = se ? -0.05 : -0.22, egg = se ? 0.1 : -0.1;
  const at = (u, v) => rot(u * rx, by + v * ry * (1 + egg * u), 0, by, ang);
  const hr = se ? 3.65 : 3.5;
  const [hx, hy] = chant ? [2.3, -13.4 + bob] : se ? [2.6, -12.5 + bob + (walk ? ph * 0.3 : 0)] : [2.2, -12.9 + bob + (walk ? ph * 0.3 : 0)];
  const body = (() => { const pts = []; for (let i = 0; i < 30; i++) { const t = (i / 30) * Math.PI * 2; pts.push(at(Math.cos(t), Math.sin(t))); } return `M${pts.map(f2p).join(' L')} Z`; })();
  const D = se ? [0.86, 0.42] : [0.82, -0.32], N = se ? [-0.55, 0.3] : [0.55, 0.3];
  // une patte (near : du côté proche)
  const leg = near => {
    const sw = 1.25 * (near ? 1 : -1), st = walk ? (near ? ph : -ph) * 0.9 : 0;
    const fx = S[0] * sw + F[0] * st, fy = Math.min(0.5, (S[1] * sw + F[1] * st) * 0.62) + (walk && (near ? ph : -ph) < 0 ? -0.3 : 0);
    const hip = [S[0] * sw * 0.6, by + ry * (near ? 0.62 : 0.5) + S[1] * sw * 0.4];
    return patte(hip, [fx, fy], near ? C.patte : C.patteLoin, D, N);
  };
  let s = defs(corpsDefs(g) + queueDefs(g, se ? [1, 1, 0, 0] : [1, 1, 0, 0]) + creteDef(g) + mouetteDef(g, [1, 1, 0, 0]) + becDef(g) + camailDef(g));
  s += `<ellipse cx="0" cy="0.2" rx="${r2(rx * 1.1)}" ry="1.6" fill="${SH}"/>`;
  s += leg(false);
  // la tête (de dos, derrière le corps)
  const head = () => {
    let h = mouette([hx - 1.2, hy - hr + 1.5], [hx - 4.6, hy - hr - 1.2], g);
    h += crete(hx - (se ? 0.3 : -0.2), hy + (se ? 0 : 0.25), hr, 1, g, se ? 0.8 : 0.7);
    h += E(hx, hy, hr, hr, url(`${g}te`), 1.05);
    if (se) {
      h += stroke(`M${f2p([hx - hr * 0.78, hy - hr * 0.15])} Q${f2p([hx - hr * 0.62, hy - hr * 0.62])} ${f2p([hx - hr * 0.25, hy - hr * 0.72])}`, 0.5, 'rgba(255,240,210,.7)');
      h += E(hx - hr * 0.48, hy + 0.75, 0.8, 0.4, C.joue, 0) + E(hx + hr * 0.6, hy + 0.5, 0.6, 0.32, C.joue, 0);
      h += eye(hx - hr * 0.32, hy - 0.45, 1.0, mode) + eye(hx + hr * 0.36, hy - 0.7, 0.85, mode);
      // le bec, pointé vers nous en biais (grand ouvert vers le haut quand il chante), les barbillons dessous
      // le bec : un cône jaune vu en biais, pointé vers la droite et vers nous (grand ouvert vers le haut quand il
      // chante) ; les barbillons de part et d'autre dessous
      const bx0 = hx + hr * 0.4, by0 = hy + hr * 0.22, L1 = 2.7, w = 1.35;
      const dir = chant ? [0.9, -0.42] : [0.84, 0.54], nrm = [-dir[1], dir[0]], tip = [bx0 + dir[0] * L1, by0 + dir[1] * L1];
      h += E(bx0 - 0.3 + (walk ? -ph * 0.15 : 0), by0 + 1.75, 0.48, 0.78, C.crete[2], 0.55) + E(bx0 + 1.1 + (walk ? -ph * 0.15 : 0), by0 + 2.05, 0.55, 0.85, url(`${g}cr`), 0.6);
      if (chant) {
        const low = [bx0 + 0.6 * L1, by0 + 0.75 * L1];
        h += P(`M${f2p([bx0 + nrm[0] * w * 0.2, by0 + nrm[1] * w * 0.2])} L${f2p(tip)} L${f2p(low)} Z`, C.bouche, 0.5)
          + P(`M${f2p([bx0 - nrm[0] * w, by0 - nrm[1] * w])} L${f2p(tip)} L${f2p([bx0 + nrm[0] * 0.2, by0 + nrm[1] * 0.2])} Z`, C.bec[1], 0.55)
          + P(`M${f2p([bx0 + 0.1, by0 + 0.35])} L${f2p(low)} L${f2p([bx0 - 0.3, by0 + w])} Z`, C.bec[1], 0.55);
      } else h += P(`M${f2p([bx0 - nrm[0] * w, by0 - nrm[1] * w])} L${f2p(tip)} L${f2p([bx0 + nrm[0] * w, by0 + nrm[1] * w])} Z`, C.bec[1], 0.55)
        + stroke(`M${f2p([bx0, by0])} L${f2p([tip[0] - dir[0] * 0.3, tip[1] - dir[1] * 0.3])}`, 0.3, OUT)
        + stroke(`M${f2p([bx0 - nrm[0] * w * 0.6, by0 - nrm[1] * w * 0.6])} L${f2p([bx0 + dir[0] * 1.2 - nrm[0] * 0.5, by0 + dir[1] * 1.2 - nrm[1] * 0.5])}`, 0.35, C.bec[0]);
    } else {
      // de dos : la crête vue de derrière, la pointe du bec et un barbillon qui dépassent à droite
      // la nuque dans l'ombre (la lumière vient d'en haut à gauche) : la tête ne luit pas comme un fruit
      const nuque = `M${f2p([hx - hr, hy])} a${r2(hr)},${r2(hr)} 0 1,0 ${r2(2 * hr)},0 a${r2(hr)},${r2(hr)} 0 1,0 ${r2(-2 * hr)},0 Z`;
      h += clip(`${g}nq`, nuque, `<ellipse cx="${r2(hx + hr * 0.35)}" cy="${r2(hy + hr * 0.55)}" rx="${r2(hr * 0.95)}" ry="${r2(hr * 0.7)}" fill="${C.camail[2]}" opacity="0.45"/>`) + P(nuque, 'none', 1.05);
      h += E(hx + hr * 0.92, hy + 1.2, 0.6, 0.95, C.crete[2], 0.55);
      h += P(`M${f2p([hx + hr * 0.8, hy - 0.4])} L${f2p([hx + hr * 0.8 + 1.7, hy + 0.1])} L${f2p([hx + hr * 0.84, hy + 0.85])} Z`, C.bec[1], 0.55);
      h += stroke(`M${f2p([hx - hr * 0.75, hy - hr * 0.1])} Q${f2p([hx - hr * 0.6, hy - hr * 0.6])} ${f2p([hx - hr * 0.2, hy - hr * 0.7])}`, 0.5, 'rgba(255,240,210,.6)');
    }
    return chant ? `<g transform="rotate(-20 ${r2(hx)} ${r2(hy)})">${h}</g>` : h;
  };
  // la queue : derrière (au fond à gauche) de trois quarts avant ; de dos, elle se dresse sur le croupion, devant
  const tail = () => queue(se ? at(-0.8, -0.5) : at(-0.72, -0.15), 1, se ? 1 : 0.95, walk ? ph * 0.4 : 0, g, se ? 0.82 : 0.72);
  if (se) s += tail();
  // quand il chante : l'aile la plus loin, un peu écartée, dépasse à droite
  if (chant) { const a = at(0.2, -0.75), b = at(1.25, -0.95); s += P(`M${f2p(a)} Q${f2p([b[0] - 0.4, b[1] - 2.4])} ${f2p([b[0] + 1.2, b[1] - 0.6])} Q${f2p([b[0], b[1] + 0.9])} ${f2p(at(0.6, -0.2))} Z`, tone(C.aile, 0.8), 0.8); }
  // le corps, son poitrail sombre (devant de trois quarts avant), un reflet
  const pc = se ? at(0.42, 0.18) : at(0.1, 0.65);
  const breast = `<ellipse cx="${r2(pc[0])}" cy="${r2(pc[1])}" rx="${r2(rx * (se ? 0.72 : 0.6))}" ry="${r2(ry * (se ? 0.85 : 0.45))}" fill="${url(`${g}po`)}"${se ? '' : ' opacity="0.75"'}/>`;
  const sh0 = at(-0.6, -0.55), sh1 = at(-0.1, -0.98), sh2 = at(0.35, -0.92);
  s += corps(body, g, breast, stroke(`M${f2p(sh0)} Q${f2p(sh1)} ${f2p(sh2)}`, 0.55, 'rgba(255,230,190,.55)'));
  s += selle(se ? at(-0.4, -0.85) : at(-0.3, -0.8), 1, g);
  // l'aile du côté proche (à gauche de trois quarts avant, à droite de dos)
  {
    const wingUp = walk && ph < 0 ? -0.5 : 0;
    const wing = se ? aile(at(0.35, -0.2).map((n, k) => n + (k ? wingUp : 0)), at(-0.8, 0.08), ry * 0.74, g)
      : aile(at(0.55, -0.3).map((n, k) => n + (k ? wingUp : 0)), at(-0.45, 0.3), ry * 0.7, g);
    const a = se ? at(0.35, -0.2) : at(0.55, -0.3);
    s += chant ? `<g transform="rotate(16 ${r2(a[0])} ${r2(a[1])})">${wing}</g>` : wing;
  }
  // le camail, de derrière la tête aux épaules
  s += se
    ? camail([hx - hr * 0.95, hy + 0.5], at(-0.25, -0.88), at(0.78, -0.5), [hx + hr * 0.75, hy + hr * 0.75], 5, g)
    : camail([hx - hr * 0.92, hy + 0.2], at(-0.2, -0.95), at(0.7, -0.72), [hx + hr * 0.9, hy + 0.7], 5, g);
  s += head();
  s += leg(true);
  if (!se) s += tail();
  if (chant) s += notes(hx + 4.6, hy - 1.4);
  return s;
}

// ——— L'icône (32 × 32, pour les fiches) : le buste d'Amiral de profil, la crête, la plume de mouette, le camail en
// pointes sur ses épaules rousses ; les pièces du dessin agrandies (K), le trait ramené à celui des icônes (1,3) ———
const ICONE_K = 1.8, ICONE_O = [16.26, 14.67];
function icone() {
  const g = 'coq-icone-', k = 1 / ICONE_K, hr = 3.45;
  let s = defs(corpsDefs(g) + queueDefs(g, [1, 1, 0, 0]) + creteDef(g) + mouetteDef(g, [1, 1, 0, 0]) + becDef(g) + camailDef(g));
  const epaules = `M${f2p([-5.6, 8.2])} Q${f2p([-5.8, 4.4])} ${f2p([-1.2, 4.1])} Q${f2p([4.4, 4.0])} ${f2p([5.0, 8.2])} Z`;
  let b = P(epaules, url(`${g}co`), 1.3 * k) + clip(`${g}icp`, epaules, `<ellipse cx="2.6" cy="7.6" rx="3" ry="2.6" fill="${url(`${g}po`)}"/>`) + P(epaules, 'none', 1.3 * k);
  b += camail([-hr * 0.95, 0.6], [-4.3, 5.2], [3.8, 5.4], [hr * 0.6, hr * 0.85], 5, g, 1, 1.3 * k);
  b += mouette([-1.3, -hr + 1.5], [-5.0, -hr - 1.0], g);
  b += crete(0, 0, hr, 1, g);
  b += E(0, 0, hr, hr, url(`${g}te`), 1.3 * k);
  b += stroke(`M${f2p([-hr * 0.72, -hr * 0.2])} Q${f2p([-hr * 0.55, -hr * 0.7])} ${f2p([-hr * 0.1, -hr * 0.78])}`, 0.42, 'rgba(255,240,210,.75)');
  b += E(0.75, 1.05, 0.85, 0.42, C.joue, 0);
  const x0 = hr * 0.84, y0 = 0.3;
  b += barbillons(x0 + 0.35, y0 + 2.0, 0, g);
  b += bec(x0, y0, false, g);
  b += eye(0.95, -0.55, 1.02, 'open');
  return s + `<g transform="translate(${ICONE_O.join(' ')}) scale(${ICONE_K})">${b}</g>`;
}

module.exports = { profil, trois, icone, C, ruban, queue };
