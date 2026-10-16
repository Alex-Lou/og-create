// 01_pont en théâtre de gravures découpées (choix de l'auteur, 16 oct., d'après les cinématiques d'Alice Madness Returns
// qu'il a montrées) : des dizaines de pièces de papier vieilli (ocre, crème, moutarde, sarcelle), cernées d'encre noire
// et modelées de hachures (gravure.js), qui entrent, glissent les unes sur les autres, pivotent sur leurs attaches,
// devant des fonds peints, flous, enfumés ; une lumière de soufre (l'orage) contre le froid de la nuit ; un étalonnage
// jaune et sarcelle, une vignette lourde, du grain. Des spirales partout, qui tournent. La voix du bord sort d'un
// pavillon de gramophone en cuivre (il n'y a pas de capitaine à l'image) : ses ondes d'encre, ses grésillements ; il se
// décroche au dernier message. Le décor se monte, puis se démonte (game/scenePlans.js : sortie).
const { hash, f } = require('./ouverture');
const { courbe, spirale } = require('./papier');
const { atelier, gravure, trait, ovale, chemin, lumiere, ENCRE } = require('./gravure');

const W = 400, MARGE = 40, G = -MARGE, D_ = W + MARGE;
// la lumière : la lueur de soufre de l'orage, en haut à gauche
lumiere([-0.62, -0.78]);
const C = { ocre: '#D6AE48', creme: '#E6D29A', moutarde: '#B4862A', sarcelle: '#2C5A54', sarcelleC: '#467866', sarcelleS: '#1A3634', rouge: '#8A2214', brun: '#4E3218', coque: '#2C2822', fenetre: '#F2C24E', soufre: '#E8B030' };
const plein = (A, peinture) => `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${peinture}"/>`;
// une spirale découpée : une bande qui s'enroule (x, y, r, sens), large de w
function bandeSpirale(x, y, r, sens = 1, tours = 1.7, w = 3) {
  const n = Math.round(tours * 14), pts = Array.from({ length: n + 1 }, (_, k) => { const a = (k / 14) * Math.PI * 2 * sens - Math.PI / 2, rr = r * (1 - k / (n + 3)); return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; });
  const bord = (k, s2) => { const [ax, ay] = pts[Math.max(0, k - 1)], [bx, by] = pts[Math.min(n, k + 1)], l = Math.hypot(bx - ax, by - ay) || 1, ww = (w / 2) * (1 - (k / n) * 0.7); return [pts[k][0] + (s2 * -(by - ay) * ww) / l, pts[k][1] + (s2 * (bx - ax) * ww) / l]; };
  return [...pts.map((_, k) => bord(k, 1)), ...pts.map((_, k) => bord(n - k, -1))];
}
// une volute d'encre : un trait noir épais, doublé de crème (elle se lit sur le sombre comme sur le clair)
const volute = (x, y, r, sens = 1, tours = 1.5, w = 2.2) => trait(spirale(x, y, r, sens, tours), w + 1.4, ENCRE) + trait(spirale(x, y, r, sens, tours), w * 0.5, C.creme, 0.9);

// ——— la partition, écrite sur toute la scène, puis découpée en temps ———
const DEF = { x: 0, y: 0, s: 1, r: 0, o: 1, z: 1 };
function valeur(cles, t, props) {
  if (t <= cles[0][0]) return { ...cles[0][1] };
  for (let i = 1; i < cles.length; i++) {
    const [t1, c1] = cles[i];
    if (t <= t1) {
      const [t0, c0] = cles[i - 1], k = (t - t0) / ((t1 - t0) || 1), v = {};
      for (const p of props) { const a = c0[p] ?? DEF[p], b = c1[p] ?? DEF[p]; if (c0[p] !== undefined || c1[p] !== undefined) v[p] = Math.round((a + (b - a) * k) * 100) / 100; }
      if (c0.e) v.e = c0.e;
      return v;
    }
  }
  return { ...cles[cles.length - 1][1] };
}
// des clés absolues [[t, cle], …] découpées selon les durées des temps (chaque temps part de là où le précédent s'arrête)
function parTemps(T, cles, props = ['x', 'y', 's', 'r', 'o']) {
  const tri = [...cles].sort((a, b) => a[0] - b[0]);
  let a = 0;
  return T.map(d => {
    const b = a + d, dedans = tri.filter(([t]) => t > a && t < b).map(([t, c]) => [t - a, c]);
    const out = [[0, valeur(tri, a, props)], ...dedans, [d, valeur(tri, b, props)]];
    a = b;
    return out;
  });
}
// un balancement de t0 à t1 : une clé à chaque demi-période, val(k, t)
const balance = (t0, t1, periode, val) => { const out = []; for (let t = t0, k = 0; t <= t1; t += periode / 2, k++) out.push([Math.round(t), { ...val(k, t), e: 'ease-in-out' }]); return out; };
// une secousse à t : n à-coups, de plus en plus faibles, autour d'une clé
const secoue = (t, cle, amp, n = 6, pas = 60) => Array.from({ length: n }, (_, k) => [t + k * pas, { ...cle, x: (cle.x || 0) + (k % 2 ? -1 : 1) * amp * (1 - k / n), y: (cle.y || 0) + (k % 2 ? 1 : -1) * amp * 0.6 * (1 - k / n), e: 'linear' }]).concat([[t + n * pas, { ...cle }]]);
// des bouffées qui repartent en boucle de t0 à t1 (tous les pas) : de la clé de départ à celle d'arrivée
const bouffees = (t0, t1, pas, de, vers, duree = pas) => { const k = []; for (let t = t0; t < t1; t += pas) k.push([t - 1, { ...de, o: 0, e: 'linear' }], [t, { ...de, e: 'ease-out' }], [t + duree - 1, { ...vers }]); return [[0, { ...de, o: 0 }], ...k, [t1 + duree, { ...vers, o: 0 }]]; };

// ——— le fond peint : la nuit d'orage, enfumée, la lueur de soufre (peint flou) ———
const LUNE = [300, 104];
function fond(p) {
  const A = atelier(`${p}F`);
  let s = plein(A, A.lin([[0, '#0C1618'], [0.5, '#1C2C2A'], [1, '#2C3A30']], 0, G, 0, 300));
  s += plein(A, A.rad([[0, C.soufre, 0.55], [0.5, '#C87A20', 0.18], [1, '#C87A20', 0]], 80, 60, 230));
  s += plein(A, A.rad([[0, C.creme, 0.3], [1, C.creme, 0]], LUNE[0], LUNE[1], 120));
  for (let i = 0; i < 16; i++) { const x = hash(i, 1) * 480 - 40, y = hash(i, 2) * 260 - 20, r = 40 + 70 * hash(i, 3); s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.4)}" ry="${f(r * 0.7)}" fill="${A.rad([[0, i % 3 ? '#4E5E52' : '#1A2424', 0.55], [1, '#4E5E52', 0]], x, y, r * 1.4)}"/>`; }
  for (let i = 0; i < 5; i++) s += `<path d="M${G},${f(60 + i * 46)} q120,${f(-20 + 40 * hash(i, 4))} 240,0 t240,0" fill="none" stroke="#0A1212" stroke-width="${f(10 + 10 * hash(i, 5))}" opacity="0.25"/>`;
  return A.out(s);
}
// une brume entre les plans (peinte floue)
const brume = (p, id, y0, y1, c, op) => { const A = atelier(`${p}${id}`); return A.out(plein(A, A.lin([[0, c, 0], [0.55, c, op], [1, c, 0]], 0, y0, 0, y1))); };
// la lueur de l'éclair, de soufre (peinte floue)
const lueur = (p, id, x, y, r, c) => { const A = atelier(`${p}${id}`); return A.out(plein(A, A.rad([[0, c, 0.85], [0.4, c, 0.35], [1, c, 0]], x, y, r))); };
// l'étalonnage commun : le jaune de soufre et le sarcelle, la vignette lourde, le grain
function teinte(p) {
  const A = atelier(`${p}T`);
  const grain = Array.from({ length: 70 }, (_, k) => `<circle cx="${f(hash(k, 11) * 40)}" cy="${f(hash(k, 12) * 40)}" r="${f(0.3 + 0.4 * hash(k, 13))}" fill="${k % 2 ? '#000' : '#FFF4C8'}" opacity="${k % 2 ? 0.22 : 0.1}"/>`).join('');
  return `<defs><pattern id="${p}Tg" patternUnits="userSpaceOnUse" width="40" height="40">${grain}</pattern></defs>` + A.out(plein(A, A.rad([[0, C.soufre, 0.1], [1, C.soufre, 0]], 80, 60, 300)) + plein(A, A.lin([[0, '#1A3A36', 0.12], [1, '#1A3A36', 0.2]], 0, 0, 0, 400)) + plein(A, A.rad([[0, '#000', 0], [0.55, '#000', 0.12], [1, '#000', 0.82]], 200, 200, 320)) + plein(A, `url(#${p}Tg)`));
}

// ——— le ciel : spirales, lune, nuages, foudre ———
const SPIRALES = [[56, 50, 15, 1], [176, 28, 11, -1], [128, 112, 13, 1], [372, 50, 12, -1], [236, 176, 9, 1], [20, 150, 10, -1]];
function spiraleCiel(p, i) { const [x, y, r, sens] = SPIRALES[i], A = atelier(`${p}s${i}`); return A.out(gravure(A, bandeSpirale(x, y, r, sens, 1.9, 4), C.ocre, { seed: 400 + i, amp: 0.2, tailles: 0, trait: 1.6, pas: 2.4, portee: 0.5, dx: 2, dy: 3 })); }
function lune(p) {
  const A = atelier(`${p}l`), [x, y] = LUNE;
  let s = gravure(A, ovale(x, y, 30, 30, 30), C.creme, { seed: 20, tailles: 4, tailleP: 2.6, lumiere: [-0.8, -0.6] });
  for (const [cx, cy, r] of [[290, 96, 6], [310, 112, 4.4], [296, 118, 3], [312, 92, 2.6]]) s += trait(chemin(ovale(cx, cy, r, r * 0.85, 12), true), 1, ENCRE, 0.8) + trait(`M${cx - r * 0.6},${cy + r * 0.3} q${r * 0.6},${r * 0.5} ${r * 1.2},0`, 0.8, ENCRE, 0.7);
  return A.out(s);
}
// une bande de nuages : des pointes tordues par le vent, gravées, des volutes aux pointes
function nuage(p, i, y, h, bosses, couleur) {
  const A = atelier(`${p}n${i}`);
  // (des festons de largeurs inégales, chacun une volute qui s'enroule à son bout, comme les nuages des gravures)
  const festons = [];
  for (let x = -110 + 30 * hash(i, 1), k = 0; x < 510; k++) { const l = 620 / (bosses * 2) * (0.7 + 0.6 * hash(k, i + 3)); festons.push([x, l, h * (0.55 + 0.45 * hash(k, i + 5))]); x += l; }
  const haut = festons.flatMap(([x, l, hh]) => courbe(t => [x + l * t, y - hh * Math.sin(Math.PI * t) ** 0.8 + (t > 0.85 ? (t - 0.85) * hh * 1.2 : 0)], 12));
  const bas = courbe(t => [510 - 620 * t, y + 16 + 5 * Math.sin(t * 13 + i)], 20);
  let s = gravure(A, [...haut, ...bas], couleur, { seed: 30 + i, amp: 0.4, angle: 18, tailles: 2, portee: 0.55, dy: 6, lumiere: [-0.4, -0.9] });
  festons.forEach(([x, l, hh], k) => { if (k % 2 === 0 || hash(k, i) < 0.5) s += volute(x + l * 0.82, y - hh * 0.42, Math.min(7, hh * 0.32), 1, 1.5, 1.5); s += trait(`M${f(x + l * 0.15)},${f(y - hh * 0.3)} q${f(l * 0.3)},${f(-hh * 0.45)} ${f(l * 0.6)},${f(-hh * 0.2)}`, 0.9, ENCRE, 0.7); });
  return A.out(s);
}
const FOUDRE = [[104, -14], [92, 46], [114, 58], [84, 130], [104, 138], [74, 210]];
function foudre(p) { const A = atelier(`${p}f`); return A.out(gravure(A, [...FOUDRE.map(([x, y]) => [x + 5, y]), ...FOUDRE.slice().reverse().map(([x, y]) => [x - 5, y + 4])], '#FFF2B0', { seed: 40, amp: 0.3, tailles: 0, noir: false, ombre: 0.9, portee: 0, trait: 2.2 })); }

// ——— la mer : des rouleaux gravés, leurs crêtes d'écume, la lame qui se dresse ———
function rouleau(p, i, y, a, periode, couleur) {
  const A = atelier(`${p}m${i}`);
  const crete = t => { const x = -80 + 560 * t, ph = ((x + i * 37) / periode) % 1; return [x, y - a * Math.pow(Math.sin(Math.PI * ph), 3) * (ph < 0.5 ? 1 : 0.7)]; };
  const haut = courbe(crete, 140);
  // (les tailles de la houle : des copies de la crête, plus serrées vers le bas)
  const tailles = [6, 11, 17, 24, 32, 42].map(dy => chemin(haut.map(([x, yy]) => [x, yy + dy + 2 * Math.sin(x * 0.05 + dy)]))).join(' ');
  let s = gravure(A, [...haut, [480, y + 230], [-80, y + 230]], couleur, { seed: 50 + i, amp: 0.4, angle: 6, pas: 3.2, ombre: 0.1, tailles: 0, dy: 6, lumiere: [0, -1], dans: trait(tailles, 0.8, ENCRE, 0.75) });
  for (let x = -80 + periode * 0.5 - ((i * 37) % periode); x < 480; x += periode) {
    const cy = y - a;
    s += gravure(A, [[x - 13, cy + 7], [x - 6, cy - 1], [x + 1, cy + 2], [x + 8, cy - 3], [x + 15, cy + 8], [x + 2, cy + 6]], C.creme, { seed: 60 + i + Math.round(x), amp: 0.3, tailles: 0, noir: false, trait: 1.4, portee: 0.4, dx: 1, dy: 2 });
    s += volute(x + 18, cy + 9, 3.4 + i * 0.6, -1, 1.4, 1.4);
  }
  return A.out(s);
}
function lame(p) {
  const A = atelier(`${p}w`);
  const dos = courbe(t => [470 - 330 * t, 330 - 300 * Math.sin((t * Math.PI) / 2) ** 1.5], 30);
  const crete = courbe(t => [140 - 110 * t, 30 - 22 * Math.sin(t * Math.PI) + 64 * t * t], 16).slice(1);
  const creux = courbe(t => [30 + 50 * t, 94 + 40 * t + 30 * t * t], 10).slice(1);
  const face = courbe(t => [80 - 160 * t, 164 + 160 * t * t], 12).slice(1);
  const tailles = [0.06, 0.1, 0.14, 0.19, 0.24, 0.3, 0.36, 0.43, 0.5, 0.58, 0.66, 0.75].map(k => chemin(courbe(t => [470 - 300 * t * (1 - k * 0.2), 330 - 290 * Math.sin((t * Math.PI) / 2) ** 1.5 + 90 * k], 22))).join(' ');
  let s = gravure(A, [...dos, ...crete, ...creux, ...face, [-90, 340], [470, 340]], A.lin([[0, C.sarcelleC], [0.5, C.sarcelle], [1, C.sarcelleS]], 0, 20, 0, 330), { seed: 130, amp: 0.6, angle: 60, pas: 2.4, ombre: 0.15, tailles: 0, dy: 8, dans: trait(tailles, 1.2, ENCRE, 0.85) });
  for (let i = 0; i < 9; i++) { const [x, y] = crete[Math.min(crete.length - 1, i * 2)] || crete[crete.length - 1], l = 16 + 8 * hash(i, 3); const g = courbe(t => [x - l * t, y - 6 + l * 1.2 * t * t], 6); s += gravure(A, [...g, ...g.slice(0, -1).reverse().map(([gx, gy], j) => [gx + 5 - j * 0.7, gy - 4 + j * 0.5])], C.creme, { seed: 131 + i, amp: 0.3, tailles: 0, noir: false, trait: 1.4, portee: 0.5, dx: 2, dy: 3 }); }
  for (let i = 0; i < 5; i++) s += volute(200 + i * 44, 130 + i * 34, 7 + i, -1, 1.5, 1.6);
  s += volute(56, 106, 18, -1, 1.7, 2.6);
  return A.out(s);
}

// ——— l'Hirondelle, de profil ———
const NAV = { pivot: [205, 250] };
const garde = (x0, x1, y, h = 6, pas = 7) => trait(`M${x0},${y - h} L${x1},${y - h}`, 1, C.creme, 0.85) + trait(Array.from({ length: Math.floor((x1 - x0) / pas) + 1 }, (_, k) => `M${f(x0 + k * pas)},${y} l0,${-h}`).join(' '), 0.6, C.creme, 0.7);
function navire(p) {
  const A = atelier(`${p}v`);
  let s = trait('M322,214 L322,98 M322,104 L62,206 M322,104 L356,212 M322,132 L300,172', 0.8, C.creme, 0.55);
  s += gravure(A, [[319, 214], [325, 214], [324, 98], [320, 98]], C.brun, { seed: 70, amp: 0.2, tailles: 0, trait: 1.4, portee: 0.4, dx: 2, dy: 3 });
  s += gravure(A, [[312, 116], [334, 116], [331, 126], [315, 126]], C.brun, { seed: 69, amp: 0.2, tailles: 0, trait: 1.4, portee: 0.4 });
  for (const [x, k] of [[148, 1], [222, -1]]) s += gravure(A, [[x - 3, 172], [x + 3, 172], [x + 3, 152], [x + 3 + 9 * k, 146], [x + 3 + 10 * k, 155], [x, 152], [x - 3, 156]], C.moutarde, { seed: 66 + x, amp: 0.2, tailles: 0, trait: 1.4, portee: 0.4 });
  // la cheminée, rouge sang, son bandeau noir, l'hirondelle de la compagnie
  s += gravure(A, [[166, 176], [206, 176], [210, 116], [170, 116]], C.rouge, { seed: 71, amp: 0.4, tailles: 1 });
  s += gravure(A, [[169, 130], [209, 130], [210, 116], [170, 116]], '#14100C', { seed: 72, amp: 0.3, tailles: 0, portee: 0, trait: 1.6 });
  s += `<path d="M178,154 q6,-6 10,-1 q4,-5 10,-2 q-6,1 -9,6 q-4,-3 -11,-3 Z" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.8"/>`;
  // les superstructures crème, leurs panneaux, les hublots allumés
  s += gravure(A, [[108, 214], [302, 214], [302, 172], [108, 172]], C.creme, { seed: 73, amp: 0.5, tailles: 1, ombre: 0.4 });
  s += trait(Array.from({ length: 8 }, (_, k) => `M${112 + k * 24},176 l0,34`).join(' '), 0.7, ENCRE, 0.6);
  for (let k = 0; k < 10; k++) { const x = 122 + k * 17; s += `<circle cx="${x}" cy="193" r="9" fill="${A.rad([[0, C.fenetre, 0.55], [1, C.fenetre, 0]], x, 193, 9)}"/><circle cx="${x}" cy="193" r="3.8" fill="${C.fenetre}" stroke="${ENCRE}" stroke-width="1.4"/><path d="M${x - 1.6},191.6 a1.8,1.8 0 0 1 2.6,-0.6" stroke="#FFF8D8" stroke-width="0.8" fill="none"/>`; }
  s += garde(108, 302, 172, 5, 6);
  s += gravure(A, [[244, 174], [302, 174], [308, 146], [248, 146]], C.creme, { seed: 74, amp: 0.4, tailles: 1, ombre: 0.4 });
  for (let k = 0; k < 4; k++) s += `<rect x="${254 + k * 12}" y="151" width="9" height="12" fill="${C.fenetre}" stroke="${ENCRE}" stroke-width="1.2"/>`;
  s += gravure(A, [[244, 147], [312, 147], [310, 142], [246, 142]], '#14100C', { seed: 79, amp: 0.2, tailles: 0, portee: 0.4, trait: 1.4 });
  // la coque, sombre, ses tôles et ses rivets, sa bande rouge, la flottaison, l'ancre
  s += gravure(A, [[50, 208], [356, 206], [368, 198], [348, 262], [96, 268], [58, 236]], C.coque, { seed: 90, amp: 0.6, angle: 70, tailles: 2, dy: 7 });
  s += gravure(A, [[60, 236], [352, 234], [348, 248], [74, 252]], C.rouge, { seed: 91, amp: 0.4, tailles: 0, portee: 0, trait: 1.4 });
  s += Array.from({ length: 40 }, (_, k) => `<circle cx="${f(62 + k * 7.4)}" cy="213" r="0.8" fill="${C.creme}" opacity="0.75"/>`).join('');
  s += trait(Array.from({ length: 13 }, (_, k) => `M${f(72 + k * 22)},216 l${f(-2 + k * 0.3)},18`).join(' '), 0.6, C.creme, 0.35);
  s += trait('M64,252 q12,-3 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t20,-1', 1, C.creme, 0.6) + trait('M340,214 l0,12 M335,219 l10,0 M333,224 q7,7 14,0', 1.2, C.creme, 0.9);
  s += garde(52, 356, 207, 6, 7);
  s += `<text x="292" y="230" font-family="Georgia, serif" font-size="8" font-weight="bold" letter-spacing="1.4" fill="${C.creme}" text-anchor="middle">L’HIRONDELLE</text>`;
  return A.out(s);
}
function guirlande(p) {
  const A = atelier(`${p}g`);
  const fil = (x0, y0, x1, y1, creux, seed) => {
    const pt = t => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + creux * 4 * t * (1 - t)];
    let g = trait(chemin(courbe(pt, 20)), 0.8, ENCRE, 0.9);
    for (let k = 1; k < 9; k++) { const [x, y] = pt(k / 9), c = ['#F2C24E', '#D8402A', '#5EB8B0', '#A8C850'][(k + seed) % 4]; g += `<circle cx="${f(x)}" cy="${f(y + 3)}" r="6" fill="${A.rad([[0, c, 0.5], [1, c, 0]], x, y + 3, 6)}"/><circle cx="${f(x)}" cy="${f(y + 3)}" r="1.9" fill="${c}" stroke="${ENCRE}" stroke-width="0.7"/>`; }
    return g;
  };
  return A.out(fil(322, 108, 66, 204, 18, 0) + fil(322, 108, 354, 206, 6, 2));
}
// le petit pavillon de cuivre, en haut du mât : la voix du bord (son pivot : son attache)
const CORNET = [323, 132];
function cornet(p) { const A = atelier(`${p}c`); return A.out(trait('M323,132 L314,130', 2, ENCRE) + gravure(A, [[316, 127], [316, 133], [298, 142], [296, 120]], C.ocre, { seed: 94, amp: 0.2, tailles: 1, tailleP: 2, trait: 1.4, portee: 0.4, pas: 2 }) + `<ellipse cx="297" cy="131" rx="3" ry="11" fill="#1A120A" stroke="${ENCRE}" stroke-width="1.2"/>`); }
// les ondes de sa voix : des arcs d'encre crème qui s'éloignent
const onde = (p, id, [x, y], r, ouverture = 0.9) => { const A = atelier(`${p}${id}`), a0 = Math.PI - ouverture, a1 = Math.PI + ouverture; const arc = rr => courbe(t => [x + Math.cos(a0 + (a1 - a0) * t) * rr, y + Math.sin(a0 + (a1 - a0) * t) * rr * 1.2], 16); return A.out(gravure(A, [...arc(r), ...arc(r - Math.max(2, r * 0.16)).reverse()], C.creme, { seed: 97 + Math.round(r), amp: 0.2, tailles: 0, noir: false, ombre: 0.9, trait: 1.4, portee: 0.35, dx: 1, dy: 2 })); };
const FANION = [322, 100];
const fanion = p => { const A = atelier(`${p}a`); return A.out(gravure(A, [[322, 98], [348, 101], [340, 104], [349, 108], [322, 108]], C.rouge, { seed: 95, amp: 0.3, tailles: 0, trait: 1.3, portee: 0.4, dx: 1, dy: 2 })); };
const CHEMINEE = [190, 110];
function fumee(p, i) { const A = atelier(`${p}u${i}`), [cx, cy] = CHEMINEE; return A.out(gravure(A, bandeSpirale(cx, cy - 6, 9 + i * 1.5, i % 2 ? 1 : -1, 1.6, 6 + i), ['#5A6A5E', '#4E5E54', '#64746A', '#56665A'][i % 4], { seed: 96 + i, amp: 0.4, tailles: 0, trait: 1.5, pas: 2.4, portee: 0.45, dx: 2, dy: 3 })); }
const PROUE = [356, 236];
function embrun(p, i) { const A = atelier(`${p}e${i}`), [x, y] = PROUE; return A.out(Array.from({ length: 5 }, (_, k) => { const a = -Math.PI / 2 + (k - 2) * 0.42 + i * 0.25, l = 14 + 12 * hash(k, i); return gravure(A, [[x + Math.cos(a - 0.14) * 4, y + Math.sin(a - 0.14) * 4], [x + Math.cos(a) * l, y + Math.sin(a) * l], [x + Math.cos(a + 0.14) * 4, y + Math.sin(a + 0.14) * 4]], k % 2 ? '#8CC8B8' : C.creme, { seed: 98 + k + i * 5, amp: 0.2, tailles: 0, noir: false, trait: 1.1, portee: 0.35, dx: 1, dy: 1 }); }).join('')); }
const CANOT = [148, 142];
function canot(p) {
  const A = atelier(`${p}k`);
  let s = trait('M128,174 Q126,142 148,140 M170,174 Q168,142 190,140', 3.4, ENCRE) + trait('M128,174 Q126,142 148,140 M170,174 Q168,142 190,140', 1.2, C.creme, 0.8) + trait('M148,140 L140,156 M190,140 L182,156', 0.8, C.creme, 0.8);
  s += gravure(A, [[128, 156], [196, 156], [188, 169], [136, 169]], C.creme, { seed: 100, amp: 0.3, tailles: 1, tailleP: 2, portee: 0.45, dx: 2, dy: 3 }) + gravure(A, [[130, 160], [194, 160], [192, 163.4], [132, 163.4]], '#D86A2A', { seed: 101, amp: 0.2, tailles: 0, portee: 0, trait: 1 });
  return A.out(s);
}
const BRECHE = [322, 246];
function breche(p) {
  const A = atelier(`${p}b`), [bx, by] = BRECHE;
  const pts = Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * Math.PI * 2, r = k % 2 ? 4 : 10 + 4 * hash(k, 1); return [bx + Math.cos(a) * r * 1.3, by + Math.sin(a) * r * 0.8]; });
  let s = gravure(A, pts, '#050302', { seed: 110, amp: 0.4, tailles: 0, noir: false, portee: 0, trait: 2 });
  for (let k = 0; k < 5; k++) { const a = Math.PI + (k - 2) * 0.35, l = 16 + 8 * hash(k, 2); s += gravure(A, [[bx + Math.cos(a - 0.15) * 6, by + Math.sin(a - 0.15) * 6], [bx + Math.cos(a) * l, by + Math.sin(a) * l * 0.7], [bx + Math.cos(a + 0.15) * 6, by + Math.sin(a + 0.15) * 6]], k % 2 ? '#8CC8B8' : C.creme, { seed: 111 + k, amp: 0.2, tailles: 0, noir: false, trait: 1.1, portee: 0.3, dx: 1, dy: 1 }); }
  return A.out(s);
}
// les passagers, en marionnettes gravées : le corps, deux jambes, un bras ; de grands yeux noirs
const PASSAGERS = [
  { id: 'p1', x: 126, manteau: '#3A4A44', tete: 'chapeau' },
  { id: 'p2', x: 152, manteau: C.rouge, tete: 'foulard' },
  { id: 'p3', x: 282, manteau: C.creme, tete: 'marin' }
];
const PIED = 207, PEAU = '#EADCB0';
const g1 = (seed, x = {}) => ({ seed, amp: 0.15, tailles: 0, trait: 1.1, pas: 1.6, epaisseur: 0.5, portee: 0.5, dx: 1, dy: 1.5, ...x });
function passagerCorps(p, q) {
  const A = atelier(`${p}${q.id}c`), x = q.x;
  let s = gravure(A, [[x - 5, PIED - 10], [x - 6, PIED - 22], [x - 3, PIED - 26], [x + 3, PIED - 26], [x + 6, PIED - 22], [x + 5, PIED - 10]], q.manteau, g1(300 + x));
  s += gravure(A, ovale(x, PIED - 30, 3.6, 4.4, 14), PEAU, g1(301 + x, { noir: false })) + `<ellipse cx="${x - 1.7}" cy="${PIED - 30.6}" rx="0.9" ry="1.1" fill="${ENCRE}"/><ellipse cx="${x + 0.8}" cy="${PIED - 30.6}" rx="0.8" ry="1" fill="${ENCRE}"/>`;
  if (q.tete === 'chapeau') s += gravure(A, [[x - 6, PIED - 33], [x + 5, PIED - 33], [x + 3, PIED - 34], [x + 3, PIED - 39], [x - 3, PIED - 39], [x - 3, PIED - 34]], '#14100C', g1(302 + x, { portee: 0.3 }));
  if (q.tete === 'foulard') s += gravure(A, [[x - 4.6, PIED - 29], [x - 4, PIED - 34], [x, PIED - 35.6], [x + 4.4, PIED - 33], [x + 4.6, PIED - 28], [x + 7, PIED - 24]], C.ocre, g1(303 + x, { portee: 0.3 }));
  if (q.tete === 'marin') s += gravure(A, [[x - 4.4, PIED - 32], [x + 4.4, PIED - 32], [x + 3.6, PIED - 36], [x - 3.6, PIED - 36]], '#F2E8C8', g1(304 + x, { portee: 0.3, noir: false })) + `<rect x="${x - 6}" y="${PIED - 22}" width="12" height="3" fill="#1C3048" stroke="${ENCRE}" stroke-width="0.6"/>`;
  return A.out(s);
}
const passagerJambe = (p, q, k) => { const A = atelier(`${p}${q.id}j${k}`), x = q.x + (k ? 1.4 : -1.4); return A.out(gravure(A, [[x - 1.6, PIED - 11], [x + 1.6, PIED - 11], [x + 1.4, PIED - 1], [x + 3.6, PIED - 1], [x + 3.6, PIED + 0.6], [x - 1.6, PIED + 0.6]], '#14100C', g1(310 + q.x + k, { portee: 0.3, noir: false }))); };
const passagerBras = (p, q) => { const A = atelier(`${p}${q.id}b`), x = q.x; return A.out(gravure(A, [[x - 1, PIED - 24], [x + 2, PIED - 24], [x + 3, PIED - 13], [x, PIED - 13]], q.manteau, g1(320 + x, { portee: 0.35 })) + `<circle cx="${x + 1.6}" cy="${PIED - 12}" r="1.4" fill="${PEAU}" stroke="${ENCRE}" stroke-width="0.6"/>`); };

// ——— le pavillon de gramophone, en gros plan : la voix du bord ———
const BOUCHE = [146, 180], ATTACHE = [352, 300];
function cor(p) {
  const A = atelier(`${p}C`), [mx, my] = BOUCHE;
  // (le profil d'une trompe : long et étroit vers le col, il s'évase d'un coup vers la bouche ; u : de la bouche au col)
  const yh = u => 186 - 126 * Math.pow(1 - u, 2.6), yb = u => 206 + 98 * Math.pow(1 - u, 2.6), xu = u => mx + (330 - mx) * u;
  const haut = courbe(u => [xu(u), yh(u)], 28), bas = courbe(u => [xu(1 - u), yb(1 - u)], 28);
  let s = '';
  // le col, qui descend vers son support ; le support de bois et ses boulons
  s += gravure(A, [[326, 186], [346, 188], [364, 230], [362, 292], [344, 292], [346, 236], [328, 210]], C.moutarde, { seed: 140, amp: 0.3, tailles: 1, angle: 80 });
  s += gravure(A, [[318, 288], [386, 288], [384, 320], [320, 320]], C.brun, { seed: 141, amp: 0.4, tailles: 1, angle: 20 }) + [330, 374].map(x => `<circle cx="${x}" cy="304" r="3.2" fill="${C.ocre}" stroke="${ENCRE}" stroke-width="1.2"/>`).join('');
  // le pavillon, son évasement de cuivre, ses nervures (des fuseaux du col à la bouche), ses rivets
  s += gravure(A, [...haut, [338, 190], [338, 206], ...bas], C.ocre, { seed: 142, amp: 0.4, angle: 30, tailles: 3, tailleP: 4, modele: 0.5 });
  for (let k = 1; k < 7; k++) { const v = k / 7; s += trait(chemin(courbe(u => [xu(u), yh(u) + (yb(u) - yh(u)) * v], 24)), 1, ENCRE, 0.7); }
  for (let k = 1; k < 5; k++) { const u = k / 5; s += trait(`M${f(xu(u))},${f(yh(u))} Q${f(xu(u) - 10 * (1 - u))},${f((yh(u) + yb(u)) / 2)} ${f(xu(u))},${f(yb(u))}`, 1.4, ENCRE, 0.85) + `<circle cx="${f(xu(u))}" cy="${f(yh(u) + 4)}" r="1.4" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.6"/><circle cx="${f(xu(u))}" cy="${f(yb(u) - 4)}" r="1.4" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.6"/>`; }
  // la bouche : son bord roulé, son fond noir qui s'enfonce en anneaux
  s += gravure(A, ovale(mx, my + 3, 30, 124, 40), C.moutarde, { seed: 143, amp: 0.3, tailles: 2, tailleP: 2.6, trait: 2.4 });
  s += gravure(A, ovale(mx + 3, my + 3, 23, 112, 40), '#1A120A', { seed: 144, amp: 0.3, tailles: 0, noir: false, portee: 0, trait: 1.6 });
  for (let k = 1; k < 5; k++) s += trait(chemin(ovale(mx + 3 + k * 4, my + 3, 23 - k * 4.6, 112 - k * 22, 30), true), 1, '#6A4A20', 0.8);
  s += `<ellipse cx="${mx + 20}" cy="${my + 3}" rx="3" ry="10" fill="${A.rad([[0, C.soufre, 0.9], [1, C.soufre, 0]], mx + 20, my + 3, 10)}"/>`;
  return A.out(s);
}
// une onde de la voix, en gros plan : un croissant crème cerné d'encre (le jeu la fait s'élargir et s'éteindre)
const ondeGrosse = (p, i) => onde(p, `O${i}`, BOUCHE, 46 + i * 6, 1.05);
// une boucle de son : une spirale d'encre qui s'échappe
function boucle(p, i) { const A = atelier(`${p}B${i}`), [x, y] = BOUCHE; return A.out(gravure(A, bandeSpirale(x - 40, y - 30 + i * 60, 10 + i * 2, i % 2 ? 1 : -1, 1.8, 3.4), C.creme, { seed: 150 + i, amp: 0.15, tailles: 0, noir: false, trait: 1.3, portee: 0.4, dx: 1, dy: 2 })); }
// les étincelles : des étoiles de papier jaune et rouge, cernées d'encre, dans un halo de soufre
const etoile = (x, y, r, a) => Array.from({ length: 8 }, (_, k) => { const an = a + (k / 8) * Math.PI * 2, rr = k % 2 ? r * 0.32 : r; return [x + Math.cos(an) * rr, y + Math.sin(an) * rr]; });
function etincelles(p, id, [x, y]) {
  const A = atelier(`${p}${id}`);
  let s = `<circle cx="${x}" cy="${y}" r="34" fill="${A.rad([[0, C.soufre, 0.55], [1, C.soufre, 0]], x, y, 34)}"/>`;
  for (let k = 0; k < 8; k++) { const a = k * 0.8 + 0.3, l = 8 + 20 * hash(k, 7); s += gravure(A, etoile(x + Math.cos(a) * l, y + Math.sin(a) * l, 4 + 4 * hash(k, 8), a), k % 2 ? '#F2C24E' : '#D8402A', { seed: 160 + k, amp: 0.15, tailles: 0, noir: false, trait: 1.2, portee: 0.4, dx: 1, dy: 1 }); }
  return A.out(s);
}
// la bosse et la fêlure, au dernier message
const felure = p => { const A = atelier(`${p}f`); return A.out(trait('M210,120 L228,138 L222,150 L242,166 M228,138 L246,128 M222,150 L206,170', 2.6, ENCRE) + trait('M210,120 L228,138 L222,150 L242,166', 0.8, C.soufre, 0.9)); };

// ce qui vit : la pluie en trois rideaux qui glissent en boucle ; des volutes qui se dessinent dans le ciel
const voluteVive = (d, dur, beg) => `<path d="${d}" fill="none" stroke="${ENCRE}" stroke-width="2.6" stroke-linecap="round" opacity="0.8" stroke-dasharray="140" stroke-dashoffset="140"><animate attributeName="stroke-dashoffset" values="140;0;0;-140" keyTimes="0;0.4;0.7;1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path><path d="${d}" fill="none" stroke="${C.creme}" stroke-width="1" stroke-linecap="round" opacity="0.9" stroke-dasharray="140" stroke-dashoffset="140"><animate attributeName="stroke-dashoffset" values="140;0;0;-140" keyTimes="0;0.4;0.7;1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path>`;
function vivant() {
  let s = '';
  [[1, 0.8, 0.5], [0.7, 1.15, 0.36], [0.45, 1.7, 0.24]].forEach(([k, dur, o], j) => {
    let traits = '';
    for (let i = 0; i < Math.round(48 * k + 10); i++) { const x = hash(i, 601 + j) * 520 - 60, y = hash(i, 611 + j) * 400, l = 12 + 20 * k; traits += `M${f(x)},${f(y)} l${f(-l * 0.32)},${f(l)} `; }
    s += `<g opacity="${f(o)}"><animateTransform attributeName="transform" type="translate" from="0 -400" to="-128 0" dur="${f(dur)}s" repeatCount="indefinite"/><path d="${traits}" stroke="${C.creme}" stroke-width="${f(0.6 + k)}" stroke-linecap="round"/><path d="${traits}" transform="translate(128 -400)" stroke="${C.creme}" stroke-width="${f(0.6 + k)}" stroke-linecap="round"/></g>`;
  });
  for (const [x, y, r, sens, dur, beg] of [[40, 90, 9, 1, 5, 0], [150, 70, 7, -1, 6, 2], [250, 40, 8, 1, 5.5, 4], [350, 130, 7, -1, 6.5, 1], [90, 150, 6, 1, 4.8, 3], [210, 120, 6, -1, 5.2, 0.5], [330, 20, 6, 1, 6, 2.5], [20, 30, 7, -1, 5.8, 1.5]]) s += voluteVive(spirale(x, y, r, sens, 1.6), dur, beg);
  return s;
}

// ——— 01_pont : les pièces et la partition ———
function pont01() {
  const p = 'tp', T = [4200, 5200, 5200, 3600], FIN = 18200;
  const nuages = [[0, 34, 22, 3, '#4A625A'], [1, 66, 18, 4, '#3E5650'], [2, 164, 26, 3, '#344A46'], [3, 198, 18, 5, '#2C403E']];
  const mers = [[1, 214, 12, 70, '#2E5650'], [2, 236, 16, 92, C.sarcelle], [3, 264, 22, 116, '#24484A'], [4, 302, 28, 146, C.sarcelleS]];
  const m = { marge: MARGE };
  const plans = [
    { id: 'fond', profondeur: 0.03, ...m, flou: 0.2, dessin: () => fond(p) },
    { id: 'lueur', profondeur: 0.05, ...m, flou: 0.15, dessin: () => lueur(p, 'L', 96, 40, 260, C.soufre) },
    ...SPIRALES.map(([x, y], i) => ({ id: `spirale${i}`, profondeur: 0.06 + i * 0.01, cadre: [x - 30, y - 30, 60, 60], pivot: [x, y], dessin: () => spiraleCiel(p, i) })),
    { id: 'lune', profondeur: 0.07, cadre: [260, 64, 82, 82], dessin: () => lune(p) },
    ...nuages.slice(0, 2).map(([i, y, h, b, c]) => ({ id: `nuage${i}`, profondeur: 0.1 + i * 0.04, cadre: [-120, y - h - 16, 640, h + 50], dessin: () => nuage(p, i, y, h, b, c) })),
    { id: 'foudre', profondeur: 0.1, cadre: [60, -24, 72, 244], pivot: [104, -14], dessin: () => foudre(p) },
    ...nuages.slice(2).map(([i, y, h, b, c]) => ({ id: `nuage${i}`, profondeur: 0.1 + i * 0.04, cadre: [-120, y - h - 16, 640, h + 50], dessin: () => nuage(p, i, y, h, b, c) })),
    { id: 'brume1', profondeur: 0.15, ...m, flou: 0.15, dessin: () => brume(p, 'b1', 150, 300, '#4E6A5A', 0.5) },
    { id: 'lame', profondeur: 0.3, cadre: [-100, -14, 600, 364], pivot: [300, 300], dessin: () => lame(p) },
    ...mers.slice(0, 2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.1, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    { id: 'brume2', profondeur: 0.45, ...m, flou: 0.15, dessin: () => brume(p, 'b2', 190, 300, '#3E5A50', 0.4) },
    { id: 'navire', profondeur: 0.6, cadre: [36, 92, 344, 190], ...NAV, dessin: () => navire(p) },
    ...[0, 1, 2, 3].map(i => ({ id: `fumee${i}`, dans: 'navire', derriere: true, cadre: [140, 50, 100, 80], pivot: CHEMINEE, dessin: () => fumee(p, i) })),
    { id: 'guirlande', dans: 'navire', cadre: [56, 98, 306, 120], dessin: () => guirlande(p) },
    { id: 'fanion', dans: 'navire', cadre: [316, 92, 40, 22], pivot: FANION, dessin: () => fanion(p) },
    { id: 'cornet', dans: 'navire', cadre: [290, 114, 40, 34], pivot: CORNET, dessin: () => cornet(p) },
    ...[0, 1].map(i => ({ id: `onde${i}`, dans: 'cornet', cadre: [270, 104, 34, 54], pivot: [297, 131], dessin: () => onde(p, `o${i}`, [297, 131], 14 + i * 4, 0.9) })),
    { id: 'canot', dans: 'navire', cadre: [120, 132, 84, 46], pivot: CANOT, dessin: () => canot(p) },
    { id: 'breche', dans: 'navire', cadre: [292, 224, 62, 44], pivot: BRECHE, dessin: () => breche(p) },
    ...PASSAGERS.flatMap(q => [
      { id: q.id, dans: 'navire', cadre: [q.x - 12, PIED - 44, 26, 48], pivot: [q.x, PIED - 11], dessin: () => passagerCorps(p, q) },
      { id: `${q.id}-jambe0`, dans: q.id, derriere: true, cadre: [q.x - 6, PIED - 14, 14, 18], pivot: [q.x - 1.4, PIED - 11], dessin: () => passagerJambe(p, q, 0) },
      { id: `${q.id}-jambe1`, dans: q.id, derriere: true, cadre: [q.x - 4, PIED - 14, 14, 18], pivot: [q.x + 1.4, PIED - 11], dessin: () => passagerJambe(p, q, 1) },
      { id: `${q.id}-bras`, dans: q.id, cadre: [q.x - 4, PIED - 28, 12, 20], pivot: [q.x + 0.5, PIED - 24], dessin: () => passagerBras(p, q) }
    ]),
    ...[0, 1].map(i => ({ id: `embrun${i}`, dans: 'navire', cadre: [324, 204, 64, 42], pivot: PROUE, dessin: () => embrun(p, i) })),
    ...mers.slice(2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.12, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    { id: 'anime', profondeur: 0.8, dessin: () => vivant() },
    { id: 'voile', profondeur: 0, ...m, flou: 0.1, dessin: () => plein(null, '#06080A') },
    { id: 'lueur-cor', profondeur: 0, ...m, flou: 0.15, dessin: () => lueur(p, 'K', 150, 180, 230, '#E89A30') },
    { id: 'cor', profondeur: 0, cadre: [96, 40, 300, 290], pivot: ATTACHE, dessin: () => cor(p) },
    ...[0, 1, 2].map(i => ({ id: `grosse-onde${i}`, dans: 'cor', derriere: true, cadre: [70, 40, 90, 290], pivot: BOUCHE, dessin: () => ondeGrosse(p, i) })),
    ...[0, 1].map(i => ({ id: `boucle${i}`, dans: 'cor', cadre: [76, 110 + i * 60, 60, 60], pivot: [BOUCHE[0] - 40, BOUCHE[1] - 30 + i * 60], dessin: () => boucle(p, i) })),
    { id: 'felure', dans: 'cor', cadre: [200, 110, 52, 70], dessin: () => felure(p) },
    { id: 'etincelles', dans: 'cor', cadre: [104, 60, 90, 90], pivot: [150, 100], dessin: () => etincelles(p, 'x', [150, 100]) },
    { id: 'teinte', profondeur: 0, ...m, dessin: () => teinte(p) },
    { id: 'eclair', profondeur: 0, ...m, flou: 0.1, dessin: () => plein(null, '#F4E8B0') }
  ];

  // ——— les pistes, sur toute la scène ———
  const P = {};
  const force = t => (t < 4200 ? 1 : t < 14600 ? 1.4 : 2.3);
  const COR_IN = 4300, CHOC = 6500, SORT = 9500, RETOUR = 14600, KRR = 15700, CRI = 16300, CHUTE = 16900;
  // le montage : les spirales tournent en entrant, les nuages glissent depuis les côtés, la lune monte, la mer se lève,
  // le navire entre
  SPIRALES.forEach(([, , , sens], i) => { P[`spirale${i}`] = [[0, { s: 0, r: -180 * sens }], [300 + i * 140, { s: 0, r: -180 * sens, e: 'cubic-bezier(.2,.9,.3,1.3)' }], [1200 + i * 140, { s: 1, r: 0, e: 'linear' }], [FIN, { s: 1, r: sens * 320, x: (i % 2 ? 1 : -1) * 20 }]]; });
  nuages.forEach(([i]) => { const sens = i % 2 ? 1 : -1; P[`nuage${i}`] = [[0, { x: sens * 470 }], [150 + i * 200, { x: sens * 470, e: 'cubic-bezier(.2,.85,.3,1)' }], [1250 + i * 200, { x: 0 }], ...balance(1250 + i * 200, FIN, 7000 + i * 900, k => ({ x: (k % 2 ? 1 : -1) * sens * (10 + i * 5) }))]; });
  P.lune = [[0, { y: 150 }], [250, { y: 150, e: 'cubic-bezier(.2,.8,.3,1)' }], [1600, { y: 0 }]];
  mers.forEach(([i], j) => { const t0 = 400 + j * 180; P[`mer${i}`] = [[0, { y: 300 }], [t0, { y: 300, e: 'cubic-bezier(.2,.9,.3,1.05)' }], [t0 + 900, { y: 0 }], ...balance(t0 + 900, FIN, 2300 + j * 300, (k, t) => ({ x: (k % 2 ? 1 : -1) * (8 + j * 3) * force(t), r: (k % 2 ? -1 : 1) * (1.4 + j * 0.3) * force(t) }))]; });
  P.navire = [[0, { x: -470 }], [700, { x: -470, e: 'cubic-bezier(.25,.8,.35,1)' }], [2800, { x: 0 }], ...balance(2800, CHOC, 2600, k => ({ r: (k % 2 ? 1 : -1) * 2.4 * (k > 2 ? 1.3 : 1), y: k % 2 ? -3 : 3 })),
    ...secoue(CHOC, { r: 2 }, 7), ...balance(CHOC + 420, CRI, 2600, k => ({ r: 3.5 + (k % 2 ? 2.5 : -2.5), y: k % 2 ? -4 : 4 })), [CRI, { r: 3 }], [CRI + 500, { r: 11, y: 6, e: 'ease-in-out' }], ...balance(CRI + 500, FIN, 1400, k => ({ r: 11 + (k % 2 ? -3 : 3), y: 6 }))];
  [0, 1, 2, 3].forEach(i => { const k = []; for (let t = -i * 700; t < FIN; t += 2800) { const a = Math.max(0, t); k.push([a, { x: 0, y: 0, s: 0.3, o: 0, e: 'linear' }], [a + 1, { x: 0, y: 0, s: 0.3, o: 1, e: 'ease-out' }], [t + 2800 - 1, { x: -70 - i * 10, y: -60, s: 1.7, r: (i % 2 ? 1 : -1) * 90, o: 0 }]); } P[`fumee${i}`] = k.filter(([t]) => t >= 0); });
  P.fanion = balance(0, FIN, 360, (k, t) => ({ r: (k % 2 ? 1 : -1) * 10 * force(t) }));
  [0, 1].forEach(i => { const k = [[0, { s: 0, o: 0 }]]; for (let t = 3200 + i * 650; t < FIN; t += 1300) k.push([t, { s: 0.2, o: 1, e: 'ease-out' }], [t + 360, { s: 1.1, o: 1, e: 'ease-in' }], [t + 700, { s: 1.3, o: 0 }]); P[`embrun${i}`] = k; });
  P.canot = [[0, { r: 0 }], ...balance(2800, SORT + 200, 2600, k => ({ r: k % 2 ? 3 : -3 })), ...[0, 1, 2, 3].flatMap(k => [[SORT + 600 + k * 700, { y: k * 11, r: k % 2 ? 4 : -4, e: 'ease-in' }], [SORT + 900 + k * 700, { y: k * 11 + 9, r: k % 2 ? -5 : 5 }]]), ...balance(SORT + 3400, FIN, 1500, k => ({ y: 42, r: k % 2 ? 6 : -5 }))];
  P.breche = [[0, { o: 0, s: 0.2 }], [CHOC, { o: 0, s: 0.2, e: 'linear' }], [CHOC + 60, { o: 1, s: 1.3, e: 'ease-out' }], [CHOC + 300, { o: 1, s: 1 }]];
  // les passagers : ils se tiennent, chancellent au choc, courent vers le canot ; au dernier message, ils tombent
  PASSAGERS.forEach((q, j) => {
    const course = [-40, -64, -150][j], depart = SORT + 400 + j * 250, arrivee = SORT + 3600 + j * 400;
    P[q.id] = [[0, { x: 0 }], [CHOC, { x: 0, r: 0 }], [CHOC + 120, { r: -14, x: -3 }], [CHOC + 500, { r: 6 }], [CHOC + 900, { r: 0, x: 0 }], [depart, { x: 0, r: 0 }],
      ...balance(depart, arrivee, 360, (k, t) => ({ x: course * ((t - depart) / (arrivee - depart)), y: k % 2 ? -1.2 : 0, r: -6 })), [arrivee, { x: course, r: 0 }], [CRI + 500, { x: course, r: 0 }], [CRI + 800, { x: course + 10, r: 70, y: 3 }]];
    for (const g of [0, 1]) P[`${q.id}-jambe${g}`] = [[0, { r: 0 }], [depart, { r: 0 }], ...balance(depart, arrivee, 360, k => ({ r: (k % 2 ? 1 : -1) * (g ? -32 : 32) })), [arrivee + 100, { r: 0 }], [CRI + 500, { r: 0 }], [CRI + 800, { r: g ? 40 : -20 }]];
    P[`${q.id}-bras`] = [[0, { r: 0 }], [CHOC, { r: 0 }], [CHOC + 150, { r: -110 }], [CHOC + 900, { r: -20 }], [depart, { r: -20 }], ...balance(depart, arrivee, 360, k => ({ r: k % 2 ? -50 : 30 })), [arrivee + 100, { r: -150 }], [CRI + 800, { r: -170 }]];
  });
  // le petit pavillon du mât : il vibre quand la voix parle au loin (le deuxième message), ses ondes s'éloignent
  P.cornet = [[0, { r: 0 }], ...balance(SORT + 200, RETOUR - 200, 160, k => ({ r: k % 2 ? 3 : -2 })), [RETOUR, { r: 0 }]];
  [0, 1].forEach(i => { P[`onde${i}`] = bouffees(SORT + 300 + i * 300, RETOUR - 400, 600, { s: 0.4, o: 1, x: 0 }, { s: 1.8, o: 0, x: -10 }); });
  // l'éclair : la foudre de papier, la lueur de soufre, le ciel qui blanchit
  const coups = [[3000, 1], [CHOC - 200, 0.8], [CRI, 1], [17800, 1]];
  P.foudre = [[0, { s: 0.05, o: 0 }], ...coups.flatMap(([t]) => [[t - 1, { s: 0.05, o: 0, e: 'linear' }], [t, { s: 0.05, o: 1, e: 'ease-out' }], [t + 110, { s: 1, o: 1 }], [t + 320, { s: 1, o: 1, e: 'ease-in' }], [t + 600, { s: 1, o: 0 }]])];
  P.lueur = [[0, { o: 0.25 }], ...coups.flatMap(([t, a]) => [[t - 1, { o: 0.25, e: 'linear' }], [t + 40, { o: a, e: 'linear' }], [t + 160, { o: 0.5 * a, e: 'linear' }], [t + 220, { o: a, e: 'ease-out' }], [t + 900, { o: 0.25 }]])];
  P.eclair = [[0, { o: 0 }], ...coups.flatMap(([t, a]) => [[t - 1, { o: 0, e: 'linear' }], [t + 40, { o: 0.3 * a, e: 'linear' }], [t + 100, { o: 0.05, e: 'linear' }], [t + 160, { o: 0.2 * a, e: 'ease-out' }], [t + 420, { o: 0 }]])];
  P.lame = [[0, { y: 330, o: 0 }], [CHUTE - 401, { y: 330, o: 0, e: 'linear' }], [CHUTE - 400, { y: 330, o: 1, e: 'cubic-bezier(.3,0,.2,1)' }], [FIN, { y: 0, o: 1 }]];
  // le pavillon en gros plan : il entre par la droite par-dessus la scène, parle (ses ondes, ses boucles), encaisse le
  // choc, ressort ; il retombe d'en haut, grésille (ses étincelles, sa fêlure), puis se décroche et tombe
  P.voile = [[0, { o: 0 }], [COR_IN, { o: 0 }], [COR_IN + 600, { o: 0.6 }], [SORT, { o: 0.6 }], [SORT + 500, { o: 0 }], [RETOUR, { o: 0 }], [RETOUR + 450, { o: 0.6 }], [CHUTE, { o: 0.6 }], [CHUTE + 600, { o: 0 }]];
  P['lueur-cor'] = P.voile.map(([t, c]) => [t, { o: c.o * 1.2 }]);
  const vibre = (t0, t1, a = 1) => balance(t0, t1, 140, k => ({ s: k % 2 ? 1 + 0.018 * a : 1, r: k % 2 ? 0.6 * a : -0.6 * a }));
  P.cor = [[0, { x: 470, r: 10 }], [COR_IN, { x: 470, r: 10, e: 'cubic-bezier(.2,.9,.3,1.12)' }], [COR_IN + 700, { x: 0, r: -1.5 }], [COR_IN + 900, { x: 0, r: 0 }], ...vibre(COR_IN + 900, CHOC - 100), ...secoue(CHOC, { r: 2 }, 12), ...vibre(CHOC + 500, SORT - 100), [SORT, { x: 0, r: 0, e: 'cubic-bezier(.6,0,.8,.4)' }], [SORT + 600, { x: 480, r: 14 }],
    [RETOUR - 1, { x: 480, r: 14, e: 'linear' }], [RETOUR, { x: 0, y: -460, r: -6, e: 'cubic-bezier(.3,1.35,.5,1)' }], [RETOUR + 550, { x: 0, y: 0, r: 0 }], ...vibre(RETOUR + 600, KRR, 1.4), ...secoue(KRR, { r: 3 }, 10, 10, 60), [CRI, { r: 6, e: 'ease-in' }], [CRI + 200, { r: -10, x: -6 }], [CHUTE, { r: -16, x: -10, y: 10, e: 'cubic-bezier(.5,0,.9,.6)' }], [CHUTE + 650, { r: -48, x: -60, y: 480 }]];
  [0, 1, 2].forEach(i => { P[`grosse-onde${i}`] = [...bouffees(COR_IN + 1000 + i * 220, CHOC - 200, 660, { s: 0.7, o: 1, x: 0 }, { s: 2.6, o: 0, x: -50 }), ...bouffees(CHOC + 600 + i * 220, SORT - 300, 660, { s: 0.7, o: 1, x: 0 }, { s: 2.6, o: 0, x: -50 }).slice(1), ...bouffees(RETOUR + 700 + i * 220, KRR, 660, { s: 0.7, o: 1, x: 0 }, { s: 2.6, o: 0, x: -50 }).slice(1)]; });
  [0, 1].forEach(i => { P[`boucle${i}`] = [...bouffees(COR_IN + 1400 + i * 700, SORT - 400, 1400, { x: 0, y: 0, r: 0, s: 0.4, o: 1 }, { x: -170, y: (i ? 40 : -40), r: (i ? 1 : -1) * 360, s: 1.4, o: 0 }), ...bouffees(RETOUR + 900 + i * 500, KRR, 1000, { x: 0, y: 0, r: 0, s: 0.4, o: 1 }, { x: -170, y: (i ? 40 : -40), r: (i ? 1 : -1) * 360, s: 1.4, o: 0 }).slice(1)]; });
  P.etincelles = [[0, { o: 0, s: 0.3 }], ...[KRR, KRR + 260, KRR + 520, CRI - 100, CRI + 120].flatMap((t, i) => [[t, { o: 0, s: 0.3, e: 'linear' }], [t + 30, { o: 1, s: 0.8 + 0.2 * i, r: i * 40, e: 'ease-out' }], [t + 220, { o: 0, s: 1.5 + 0.2 * i, r: i * 40 + 30 }]])];
  P.felure = [[0, { o: 0, s: 0.4 }], [KRR + 500, { o: 0, s: 0.4, e: 'linear' }], [KRR + 540, { o: 1, s: 1 }]];
  // la caméra : une poussée lente, puis le pont, puis elle lève les yeux vers la lame
  const camera = [[0, { z: 1.02 }], [4200, { z: 1.05 }], ...secoue(CHOC, { z: 1.05 }, 5), [SORT + 300, { z: 1.05, x: 0, y: 0 }], [SORT + 2000, { z: 1.32, x: -36, y: 8 }], [SORT + 4600, { z: 1.32, x: -64, y: 8 }], [RETOUR + 200, { z: 1.08, x: 0, y: 0 }], ...secoue(CRI, { z: 1.08 }, 6), [CHUTE + 200, { z: 1.08, x: 0, y: 0 }], [FIN, { z: 1.02, x: 6, y: -24, r: -4 }]];
  const temps = T.map(d => ({ duree: d, camera: [], pistes: {} }));
  parTemps(T, camera, ['x', 'y', 'z', 'r']).forEach((c, n) => { temps[n].camera = c; });
  for (const [id, cles] of Object.entries(P)) parTemps(T, cles).forEach((c, n) => { temps[n].pistes[id] = c; });
  // le démontage : le navire sombre en basculant, la mer retombe, les nuages et les spirales s'envolent
  const sortie = { duree: 650, pistes: { navire: [[0, {}], [650, { y: 140, r: 22, e: 'ease-in' }]], lune: [[0, {}], [650, { y: -220 }]] } };
  mers.forEach(([i], j) => { sortie.pistes[`mer${i}`] = [[0, {}], [80 * j, { e: 'ease-in' }], [650, { y: 320 }]]; });
  nuages.forEach(([i]) => { sortie.pistes[`nuage${i}`] = [[0, {}], [650, { x: (i % 2 ? 1 : -1) * 460, e: 'ease-in' }]]; });
  SPIRALES.forEach((_, i) => { sortie.pistes[`spirale${i}`] = [[0, {}], [650, { y: -260, r: 180 }]]; });
  return { plans, partition: { temps, sortie } };
}

module.exports = { pont01 };
