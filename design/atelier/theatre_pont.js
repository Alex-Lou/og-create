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
  return `<defs><pattern id="${p}Tg" patternUnits="userSpaceOnUse" width="40" height="40">${grain}</pattern></defs>` + A.out(plein(A, A.rad([[0, C.soufre, 0.1], [1, C.soufre, 0]], 80, 60, 300)) + plein(A, A.lin([[0, '#1A3A36', 0.12], [1, '#1A3A36', 0.2]], 0, 0, 0, 400)) + plein(A, A.rad([[0, '#000', 0], [0.6, '#000', 0.1], [1, '#000', 0.7]], 200, 200, 330)) + plein(A, `url(#${p}Tg)`));
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

// la lame coupée en deux pour 01_vague : son corps (il reste derrière le navire) et sa crête, qui se détache de son dos
// et s'enroule vers l'avant, autour de ce point (CRETE), en suivant la courbe de la vague
const CRETE = [282, 104], ROULEAU = [206, 176];
function lameMorceaux() {
  const dos = courbe(t => [470 - 330 * t, 330 - 300 * Math.sin((t * Math.PI) / 2) ** 1.5], 30);
  const crete = courbe(t => [140 - 110 * t, 30 - 22 * Math.sin(t * Math.PI) + 64 * t * t], 16).slice(1);
  const creux = courbe(t => [30 + 50 * t, 94 + 40 * t + 30 * t * t], 10).slice(1);
  const face = courbe(t => [80 - 160 * t, 164 + 160 * t * t], 12).slice(1);
  const coupe = Math.max(1, creux.findIndex(([x]) => x >= 55));
  const dosHaut = [CRETE, ...dos.filter(([x]) => x < CRETE[0])];
  // (le bord extérieur de la langue : le dos, la crête, le haut du creux ; son bord intérieur, le même poussé vers
  // l'intérieur de la vague, épais au milieu, fin aux deux bouts)
  const dehors = [...dosHaut, ...crete, ...creux.slice(0, coupe)];
  const dedans = dehors.map((q, i) => {
    const a = dehors[Math.max(0, i - 1)], b = dehors[Math.min(dehors.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    let nx = dy / l, ny = -dx / l;
    if ((q[0] + nx * 10 - 250) ** 2 + (q[1] + ny * 10 - 220) ** 2 > (q[0] - 250) ** 2 + (q[1] - 220) ** 2) { nx = -nx; ny = -ny; }
    const t = i / (dehors.length - 1), e = 46 * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.8 + 6;
    return [q[0] + nx * e * (i ? 1 : 0), q[1] + ny * e * (i ? 1 : 0)];
  });
  return { dos, dosBas: dos.filter(([x]) => x >= CRETE[0]), dehors, dedans, creuxBas: creux.slice(coupe), face };
}
const taillesLame = () => [0.06, 0.1, 0.14, 0.19, 0.24, 0.3, 0.36, 0.43, 0.5, 0.58, 0.66, 0.75].map(k => chemin(courbe(t => [470 - 300 * t * (1 - k * 0.2), 330 - 290 * Math.sin((t * Math.PI) / 2) ** 1.5 + 90 * k], 22))).join(' ');
const peintureLame = A => A.lin([[0, C.sarcelleC], [0.5, C.sarcelle], [1, C.sarcelleS]], 0, 20, 0, 330);
// (les deux morceaux : mêmes hachures, même modelé, sur le cadre de la lame entière ; pas de trait sur la coupe)
const BOITE_LAME = [-93, -3, 566, 346];
const gravureLame = (A, pts, portee = 0.4) => gravure(A, pts, peintureLame(A), { seed: 130, amp: 0, angle: 60, pas: 2.4, ombre: 0.15, tailles: 0, trait: 0, portee, dy: 8, boite: BOITE_LAME, dans: trait(taillesLame(), 1.2, ENCRE, 0.85) });
function lameCorps(p) {
  const A = atelier(`${p}wc`), M = lameMorceaux();
  const fin = M.dedans[M.dedans.length - 1];
  let s = gravureLame(A, [...M.dosBas, ...M.dedans, fin, ...M.creuxBas, ...M.face, [-90, 340], [470, 340]]);
  s += trait(chemin(M.dosBas), 2, ENCRE) + trait(chemin([...M.creuxBas, ...M.face]), 2, ENCRE);
  for (let i = 0; i < 5; i++) s += volute(220 + i * 44, 150 + i * 34, 7 + i, -1, 1.5, 1.6);
  return A.out(s);
}
// une pose de la crête, dessinée image par image (papier découpé remplacé à chaque image, comme en animation en volume) :
// k de 0 (au repos, attachée au dos de la vague) à 1 (abattue sur le navire). Plus on va vers la pointe, plus elle
// s'enroule autour de son attache et retombe (l'eau se courbe, elle ne pivote pas d'un bloc) ; ses hachures restent
// celles de la lame entière, fixes dans le décor
function lameCrete(p, id, k = 0, portee = 0.4) {
  const A = atelier(`${p}${id}`), M = lameMorceaux(), n = M.dehors.length - 1;
  // (la forme d'arrivée : un rouleau centré au-dessus du navire ; la crête part de son attache, passe par-dessus et
  // retombe devant lui, épaisse au milieu ; chaque pose mêle la crête au repos et ce rouleau)
  const [cx, cy] = ROULEAU, a0 = Math.atan2(CRETE[1] - cy, CRETE[0] - cx), r0 = Math.hypot(CRETE[0] - cx, CRETE[1] - cy), balaye = (215 * Math.PI) / 180;
  const vers = (u, dedansOu) => { const th = a0 - balaye * u, R = r0 + (150 - r0) * Math.min(1, u * 2.2) ** 0.7, e = dedansOu ? (8 + 62 * Math.sin(Math.PI * Math.min(1, u * 1.1)) ** 0.7) * (u ? 1 : 0) : 0; return [cx + (R - e) * Math.cos(th), cy + (R - e) * Math.sin(th)]; };
  const melange = ([x, y], [tx, ty]) => [x + (tx - x) * k, y + (ty - y) * k];
  const dehors = M.dehors.map((q, i) => melange(q, vers(i / n, false))), dedans = M.dedans.map((q, i) => melange(q, vers(i / n, true)));
  const plie = (q, u) => { const i = Math.round(u * n); return melange(M.dehors[i], vers(i / n, false)); };
  let s = gravureLame(A, [...dehors, ...dedans.slice().reverse()], portee);
  s += trait(chemin(dehors), 2, ENCRE);
  // (les griffes d'écume, le long de la crête, tournées comme elle)
  const debut = M.dehors.findIndex(([x, y]) => x <= 140 && y < 90);
  for (let i = 0; i < 9; i++) {
    // (repère local : la tangente de la crête pliée, et sa normale vers le dehors, du dedans au dehors)
    const j = Math.min(n - 1, debut + i * 2), [x, y] = dehors[j], [x2, y2] = dehors[j + 1], [ix, iy] = dedans[j], l = 16 + 8 * hash(i, 3);
    const tl = Math.hypot(x2 - x, y2 - y) || 1, tx = (x2 - x) / tl, ty = (y2 - y) / tl, nl = Math.hypot(x - ix, y - iy) || 1, nx = (x - ix) / nl, ny = (y - iy) / nl;
    const g = courbe(t => [x + nx * l * t * 0.9 - tx * l * 0.8 * t * t, y + ny * l * t * 0.9 - ty * l * 0.8 * t * t], 6);
    s += gravure(A, [...g, ...g.slice(0, -1).reverse().map(([gx, gy], m) => [gx + tx * (6 - m), gy + ty * (6 - m)])], C.creme, { seed: 131 + i, amp: 0.3, tailles: 0, noir: false, trait: 1.4, portee: 0.5, dx: 2, dy: 3 });
  }
  const [vx, vy] = plie([56, 106], 0.97), [wx, wy] = plie([200, 64], 0.45);
  s += volute(vx, vy, 18, -1, 1.7, 2.6) + volute(wx, wy, 9, -1, 1.5, 1.6);
  return A.out(s);
}

// une fissure qui court sur la coque depuis un trou : des lézardes d'encre noire, leur bord éclairé de soufre, leurs
// ramifications (le jeu la fait grandir depuis le trou)
function fissure(p, id, [x, y], sens = 1, longueur = 60) {
  const A = atelier(`${p}${id}`);
  const branche = (x0, y0, a, l, k) => { const pts = [[x0, y0]]; let cx = x0, cy = y0; for (let i = 1; i <= 6; i++) { const aa = a + (hash(i, k) - 0.5) * 0.9; cx += Math.cos(aa) * (l / 6); cy += Math.sin(aa) * (l / 6); pts.push([cx, cy]); } return pts; };
  const lignes = [branche(x, y, sens > 0 ? -0.2 : Math.PI + 0.2, longueur, 1), branche(x, y, sens > 0 ? 0.5 : Math.PI - 0.5, longueur * 0.6, 2), branche(x, y, -Math.PI / 2 + 0.3 * sens, longueur * 0.4, 3), branche(x, y, Math.PI / 2 - 0.2 * sens, longueur * 0.35, 4)];
  let s = '';
  for (const l of lignes) s += trait(chemin(l), 3.2, ENCRE) + trait(chemin(l.map(([a, b]) => [a + 0.6, b - 0.8])), 0.9, C.soufre, 0.85);
  for (const l of lignes.slice(0, 2)) { const [a, b] = l[3]; s += trait(chemin(branche(a, b, (sens > 0 ? 0 : Math.PI) + 1.1, longueur * 0.25, 5)), 2, ENCRE); }
  return A.out(s);
}
// la cassure : au dernier coup, la coque craque au milieu, du pont jusqu'à la quille ; ses bords de tôle tordue, ses éclats
function cassure(p) {
  const A = atelier(`${p}K`);
  const zig = [[204, 204], [198, 216], [208, 226], [196, 240], [206, 252], [200, 268]];
  let s = gravure(A, [...zig.map(([x, y]) => [x - 4, y]), ...zig.slice().reverse().map(([x, y]) => [x + 4, y])], '#030201', { seed: 930, amp: 0.4, tailles: 0, noir: false, portee: 0, trait: 2 });
  s += trait(chemin(zig.map(([x, y]) => [x - 5, y])), 1, C.soufre, 0.9) + trait(chemin(zig.map(([x, y]) => [x + 5, y])), 1, C.creme, 0.6);
  for (let k = 0; k < 5; k++) { const [x, y] = zig[k], t = 3 + 2 * hash(k, 3), d = k % 2 ? 1 : -1; s += gravure(A, [[x + d * 5, y], [x + d * (9 + t), y - t], [x + d * (8 + t), y + t * 0.6]], k % 2 ? C.coque : '#4A4238', { seed: 931 + k, amp: 0.2, tailles: 0, trait: 1, portee: 0.4, dx: 1, dy: 1, pas: 1.6 }); }
  return A.out(s);
}
// un éclat arraché : une planche ou une tôle, rivetée (le jeu le projette depuis l'impact, puis il tombe à la mer)
function eclat(p, id, [x, y], i) {
  const A = atelier(`${p}${id}`);
  const l = 10 + 6 * hash(i, 1), h = 3 + 2 * hash(i, 2);
  return A.out(gravure(A, [[x - l / 2, y - h / 2], [x + l / 2, y - h / 2 - 1], [x + l / 2 - 2, y + h / 2], [x - l / 2 + 1, y + h / 2 + 1]], i % 3 ? C.coque : i % 2 ? C.brun : C.rouge, { seed: 940 + i, amp: 0.3, tailles: 0, trait: 1.1, portee: 0.4, dx: 1, dy: 1, pas: 1.6 }) + `<circle cx="${f(x - l / 3)}" cy="${f(y)}" r="0.8" fill="${C.creme}"/>`);
}
// les clés d'un éclat projeté depuis l'impact à t : il jaillit, tourne, retombe dans la mer
const projete = (t, dx, dy, r) => [[0, { o: 0 }], [t - 1, { o: 0, e: 'linear' }], [t, { o: 1, x: 0, y: 0, r: 0, e: 'cubic-bezier(.2,.8,.4,1)' }], [t + 450, { o: 1, x: dx, y: dy, r: r * 0.5, e: 'cubic-bezier(.5,0,.9,.5)' }], [t + 1200, { o: 1, x: dx * 1.7, y: 200, r }], [t + 1300, { o: 0, x: dx * 1.7, y: 220, r }]];

// ——— l'Hirondelle, de profil ———
const NAV = { pivot: [205, 250] };
const garde = (x0, x1, y, h = 6, pas = 7) => trait(`M${x0},${y - h} L${x1},${y - h}`, 1, C.creme, 0.85) + trait(Array.from({ length: Math.floor((x1 - x0) / pas) + 1 }, (_, k) => `M${f(x0 + k * pas)},${y} l0,${-h}`).join(' '), 0.6, C.creme, 0.7);
function navire(p) {
  const A = atelier(`${p}v`);
  let s = '';
  for (const [x, k] of [[148, 1], [222, -1]]) s += gravure(A, [[x - 3, 172], [x + 3, 172], [x + 3, 152], [x + 3 + 9 * k, 146], [x + 3 + 10 * k, 155], [x, 152], [x - 3, 156]], C.moutarde, { seed: 66 + x, amp: 0.2, tailles: 0, trait: 1.4, portee: 0.4 });
  // la cheminée, rouge sang, son bandeau noir, l'hirondelle de la compagnie
  s += gravure(A, [[166, 176], [206, 176], [210, 116], [170, 116]], C.rouge, { seed: 71, amp: 0.4, tailles: 1 });
  s += gravure(A, [[169, 130], [209, 130], [210, 116], [170, 116]], '#14100C', { seed: 72, amp: 0.3, tailles: 0, portee: 0, trait: 1.6 });
  s += `<path d="M178,154 q6,-6 10,-1 q4,-5 10,-2 q-6,1 -9,6 q-4,-3 -11,-3 Z" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.8"/>`;
  // les superstructures crème, leurs panneaux, les hublots allumés
  s += gravure(A, [[108, 214], [302, 214], [302, 172], [108, 172]], C.creme, { seed: 73, amp: 0.5, tailles: 1, ombre: 0.4 });
  s += trait(Array.from({ length: 8 }, (_, k) => `M${112 + k * 24},176 l0,34`).join(' '), 0.7, ENCRE, 0.6);
  for (let k = 0; k < 10; k++) s += `<circle cx="${122 + k * 17}" cy="193" r="3.8" fill="#3A3226" stroke="${ENCRE}" stroke-width="1.4"/>`;
  s += garde(108, 302, 172, 5, 6);
  s += gravure(A, [[244, 174], [302, 174], [308, 146], [248, 146]], C.creme, { seed: 74, amp: 0.4, tailles: 1, ombre: 0.4 });
  for (let k = 0; k < 4; k++) s += `<rect x="${254 + k * 12}" y="151" width="9" height="12" fill="#3A3226" stroke="${ENCRE}" stroke-width="1.2"/>`;
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
function fumee(p, i) { const A = atelier(`${p}u${i}`), [cx, cy] = CHEMINEE; return A.out(gravure(A, bandeSpirale(cx, cy - 6, 9 + i * 1.5, i % 2 ? 1 : -1, 1.6, 6 + i), ['#5A6A5E', '#4E5E54', '#64746A', '#56665A', '#1E1A16', '#2A2420'][i], { seed: 96 + i, amp: 0.4, tailles: 0, trait: 1.5, pas: 2.4, portee: 0.45, dx: 2, dy: 3 })); }
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
const breche = p => brecheEn(p, 'b', BRECHE);
function brecheEn(p, id, [bx, by]) {
  const A = atelier(`${p}${id}`);
  // le trou : noir, déchiqueté, hachuré de l'intérieur
  const trou = Array.from({ length: 16 }, (_, k) => { const a = (k / 16) * Math.PI * 2, r = k % 2 ? 5 : 11 + 4 * hash(k, 1); return [bx + Math.cos(a) * r * 1.3, by + Math.sin(a) * r * 0.8]; });
  let s = gravure(A, trou, '#0A0604', { seed: 110, amp: 0.4, angle: 60, pas: 1.8, ombre: 0, tailles: 2, tailleP: 2.4, portee: 0, trait: 2.2, encre: '#5A4A3A' });
  // les tôles arrachées, recourbées vers l'extérieur, leurs rivets
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.3, l = 12 + 5 * hash(k, 4), w = 0.32;
    const base = (da, r) => [bx + Math.cos(a + da) * r * 1.3, by + Math.sin(a + da) * r * 0.8];
    s += gravure(A, [base(-w, 9), base(-w * 0.4, l), [bx + Math.cos(a + 0.1) * (l + 5) * 1.3, by + Math.sin(a + 0.1) * (l + 5) * 0.8], base(w * 0.5, l * 0.9), base(w, 9)], k % 2 ? C.coque : '#4A4238', { seed: 112 + k, amp: 0.3, angle: 30, pas: 1.8, tailles: 0, trait: 1.3, portee: 0.5, dx: 1.5, dy: 2.5 });
    const [rx, ry] = base(0, l * 0.75); s += `<circle cx="${f(rx)}" cy="${f(ry)}" r="0.9" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.4"/>`;
  }
  // le jet d'eau qui s'y engouffre : plein, sarcelle et crème, ses tailles, ses gouttes
  const jet = courbe(t => [bx - 4 - 30 * t, by - 2 - 10 * Math.sin(t * Math.PI) + 14 * t * t], 10);
  s += gravure(A, [...jet.map(([x, y], k) => [x, y - 3 - k * 0.5]), ...jet.slice().reverse().map(([x, y], k) => [x, y + 3 + (10 - k) * 0.4])], '#8CC8B8', { seed: 118, amp: 0.3, angle: 0, pas: 2, ombre: 0.4, tailles: 1, tailleP: 2, trait: 1.3, portee: 0.35, dx: 1, dy: 2 });
  for (let k = 0; k < 6; k++) s += `<circle cx="${f(bx - 20 - 22 * hash(k, 6))}" cy="${f(by - 14 + 22 * hash(k, 7))}" r="${f(1 + 1.6 * hash(k, 8))}" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.7"/>`;
  return A.out(s);
}
// un impact : une gerbe pleine (une étoile de soufre et de crème, hachurée, son cœur blanc), des éclats de bois et de
// métal qui volent, des gouttes (le jeu la fait éclater puis s'éteindre)
function impact(p, id, [x, y], r, couleur = C.soufre) {
  const A = atelier(`${p}${id}`);
  const etoileImpact = (rr, n, seed) => Array.from({ length: n * 2 }, (_, k) => { const a = (k / (n * 2)) * Math.PI * 2 + seed, l = k % 2 ? rr * 0.38 : rr * (0.8 + 0.4 * hash(k, seed * 10)); return [x + Math.cos(a) * l, y + Math.sin(a) * l]; });
  let s = gravure(A, etoileImpact(r, 9, 1), couleur, { seed: 900, amp: 0.3, angle: 40, pas: 2.2, ombre: 0.3, tailles: 1, tailleP: 3, trait: 1.8, portee: 0.5, dx: 2, dy: 3 });
  s += gravure(A, etoileImpact(r * 0.55, 7, 2), '#FFF4C8', { seed: 901, amp: 0.2, tailles: 0, noir: false, ombre: 0.6, trait: 1.3, portee: 0 });
  for (let k = 0; k < 7; k++) { const a = k * 0.9 + 0.4, l = r * (1.05 + 0.5 * hash(k, 9)), sx = x + Math.cos(a) * l, sy = y + Math.sin(a) * l, t = 2 + 3 * hash(k, 10); s += gravure(A, [[sx - t, sy - t * 0.4], [sx + t * 1.4, sy - t * 0.6], [sx + t * 0.6, sy + t], [sx - t * 0.8, sy + t * 0.5]], k % 3 ? C.coque : C.brun, { seed: 902 + k, amp: 0.2, tailles: 0, trait: 1, portee: 0.4, dx: 1, dy: 1, pas: 1.6 }); }
  for (let k = 0; k < 6; k++) { const a = k * 1.1 + 0.1, l = r * (0.9 + 0.6 * hash(k, 11)); s += `<circle cx="${f(x + Math.cos(a) * l)}" cy="${f(y + Math.sin(a) * l)}" r="${f(1.2 + 1.4 * hash(k, 12))}" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.7"/>`; }
  s += volute(x, y, r * 0.18, 1, 1.5, 1.4);
  return A.out(s);
}
// les clés d'un impact : il éclate à t, grandit, puis s'éteint
const eclate = (t, duree = 520) => [[t - 1, { s: 0.2, o: 0, e: 'linear' }], [t, { s: 0.3, o: 1, e: 'cubic-bezier(.2,.9,.3,1.2)' }], [t + duree * 0.45, { s: 1.15, o: 1, r: 12, e: 'ease-in' }], [t + duree, { s: 1.4, o: 0, r: 20 }]];

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

// le mât, sa hune, ses étais (son pivot : son pied ; il se fend et penche au dernier message)
const MAT = [322, 214];
function mat(p) {
  const A = atelier(`${p}t`);
  return A.out(trait('M322,104 L62,206 M322,104 L356,212 M322,132 L300,172', 0.8, C.creme, 0.55) + gravure(A, [[319, 214], [325, 214], [324, 98], [320, 98]], C.brun, { seed: 70, amp: 0.2, tailles: 0, trait: 1.4, portee: 0.4, dx: 2, dy: 3 })
    + gravure(A, [[312, 116], [334, 116], [331, 126], [315, 126]], C.brun, { seed: 69, amp: 0.2, tailles: 0, trait: 1.4, portee: 0.4 }));
}
// la fente du mât (frappé par la foudre)
const fenteMat = p => { const A = atelier(`${p}y`); return A.out(trait('M321,150 L325,160 L320,168 L326,178', 2.2, ENCRE) + trait('M321,150 L325,160 L320,168', 0.8, C.soufre, 0.9)); };
// les lumières du bord : les hublots et les vitres de la passerelle allumés (elles vacillent, puis s'éteignent)
function lumieres(p) {
  const A = atelier(`${p}h`);
  let s = '';
  for (let k = 0; k < 10; k++) { const x = 122 + k * 17; s += `<circle cx="${x}" cy="193" r="9" fill="${A.rad([[0, C.fenetre, 0.55], [1, C.fenetre, 0]], x, 193, 9)}"/><circle cx="${x}" cy="193" r="3.8" fill="${C.fenetre}" stroke="${ENCRE}" stroke-width="1.4"/><path d="M${x - 1.6},191.6 a1.8,1.8 0 0 1 2.6,-0.6" stroke="#FFF8D8" stroke-width="0.8" fill="none"/>`; }
  for (let k = 0; k < 4; k++) s += `<rect x="${250 + k * 12}" y="147" width="17" height="20" fill="${A.rad([[0, C.fenetre, 0.5], [1, C.fenetre, 0]], 258 + k * 12, 157, 12)}"/><rect x="${254 + k * 12}" y="151" width="9" height="12" fill="${C.fenetre}" stroke="${ENCRE}" stroke-width="1.2"/>`;
  return A.out(s);
}

// ——— les racines de l'abîme : des tentacules de bois noir, épineux, qui sortent de la mer ———
// la bande d'une racine : elle suit une courbe de Bézier (p0 → p3), large de w0 à sa base, effilée au bout
function racinePts(p0, c1, c2, p3, w0, w1 = 0.8, n = 24) {
  const bz = t => { const u = 1 - t; return [0, 1].map(j => u * u * u * p0[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p3[j]); };
  const g = [], d = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n, [x, y] = bz(t), [x2, y2] = bz(Math.min(1, t + 0.01)), [x1, y1] = bz(Math.max(0, t - 0.01));
    const l = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / l, ny = (x2 - x1) / l, w = (w0 / 2) * (1 - t) + (w1 / 2) * t;
    // (des nœuds, des épines)
    const noeud = 1 + 0.16 * Math.max(0, Math.sin(t * 19)), epine = k % 5 === 2 ? 1.35 : 1;
    g.push([x + nx * w * noeud * epine, y + ny * w * noeud * epine]); d.push([x - nx * w * noeud, y - ny * w * noeud]);
  }
  return { pts: [...g, ...d.reverse()], bz };
}
// une racine gravée : sombre, ses tailles qui suivent sa longueur, ses radicelles en volutes
function racine(p, id, p0, c1, c2, p3, w0, w1, seed) {
  const A = atelier(`${p}${id}`), { pts, bz } = racinePts(p0, c1, c2, p3, w0, w1);
  const tailles = [-0.28, 0, 0.28].map(k => chemin(courbe(t => { const [x, y] = bz(t), [x2, y2] = bz(Math.min(1, t + 0.01)), l = Math.hypot(x2 - x, y2 - y) || 1; return [x - ((y2 - y) / l) * k * ((w0 * (1 - t) + w1 * t) / 2), y + ((x2 - x) / l) * k * ((w0 * (1 - t) + w1 * t) / 2)]; }, 20))).join(' ');
  let s = gravure(A, pts, A.lin([[0, '#140E08'], [1, '#3A2814']], p0[0], p0[1], p3[0], p3[1]), { seed, amp: 0.6, angle: 50, tailles: 0, pas: 2.6, ombre: 0.1, portee: 0.55, dx: 3, dy: 5, reflet: 0.12, modele: 0.5, dans: trait(tailles, 1, '#D8B060', 0.5) });
  s += trait(chemin(pts.slice(0, Math.floor(pts.length / 2))), 1.2, C.ocre, 0.75);
  for (const t of [0.35, 0.62]) { const [x, y] = bz(t); s += volute(x + 6, y - 8, 5 + 4 * (1 - t), t > 0.5 ? 1 : -1, 1.6, 1.6); }
  return A.out(s);
}
// le fond de jour : un ciel clair, laiteux, le soleil derrière une brume, quelques nuages blancs (peint flou)
const SOLEIL = [300, 86];
function fondJour(p) {
  const A = atelier(`${p}J`);
  let s = plein(A, A.lin([[0, '#6E9A90'], [0.55, '#A8C4AC'], [1, '#D8D4A0']], 0, G, 0, 260));
  s += plein(A, A.rad([[0, '#FFF0B0', 0.75], [0.35, '#F2D880', 0.3], [1, '#F2D880', 0]], SOLEIL[0], SOLEIL[1], 240));
  for (let i = 0; i < 9; i++) { const x = hash(i, 21) * 480 - 40, y = 30 + hash(i, 22) * 160, r = 30 + 40 * hash(i, 23); s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.6)}" ry="${f(r * 0.6)}" fill="${A.rad([[0, '#F4ECD0', 0.55], [1, '#F4ECD0', 0]], x, y, r * 1.6)}"/>`; }
  return A.out(s);
}
// le soleil gravé : son disque, sa couronne de rayons pointus (le jeu la fait tourner)
function soleil(p) {
  const A = atelier(`${p}S`), [x, y] = SOLEIL;
  const rayons = Array.from({ length: 32 }, (_, k) => { const a = (k / 32) * Math.PI * 2, r = k % 2 ? 34 : 50 + 6 * (k % 4 === 0); return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });
  return A.out(gravure(A, rayons, C.ocre, { seed: 22, amp: 0.3, tailles: 1, tailleP: 3, trait: 1.8, portee: 0.3, lumiere: [-0.7, -0.7] }) + gravure(A, ovale(x, y, 28, 28, 30), C.creme, { seed: 23, tailles: 3, tailleP: 2.6, lumiere: [-0.7, -0.7], portee: 0 }) + volute(x - 6, y - 8, 8, 1, 1.6, 1.8));
}

// ——— 01_pont : les pièces et la partition ———
// les repères de la scène (ms) : le pavillon entre, la coupe vers le navire, le choc, le retour au pavillon, sa sortie,
// le canot arraché, le dernier message, ses grésillements, le cri, la lame (choix de l'auteur, 17 oct. : le gramophone
// est bien, mais il dure trop longtemps : chacun de ses passages, un peu plus d'une seconde)
const REPERES = { COR_IN: 4300, COUPE: 5500, CHOC: 6500, RACCORD: 7600, SORT: 8800, ARRACHE: 13300, RETOUR: 15100, KRR: 15700, CRI: 16300, CHUTE: 16900 };
function pont01() {
  const p = 'tp', T = [4200, 5200, 5200, 4600], FIN = 19200;
  const cumulus = [[0, 40, 16, 2, '#E8DCB0'], [1, 126, 14, 3, '#D8D0A8']];
  const nuages = [[0, 34, 22, 3, '#4A625A'], [1, 66, 18, 4, '#3E5650'], [2, 164, 26, 3, '#344A46'], [3, 198, 18, 5, '#2C403E']];
  const mers = [[1, 214, 12, 70, '#2E5650'], [2, 236, 16, 92, C.sarcelle], [3, 264, 22, 116, '#24484A'], [4, 302, 28, 146, C.sarcelleS]];
  const m = { marge: MARGE };
  // les racines : [id, base, c1, c2, pointe, largeur à la base, au bout] ; chacune en deux segments (la base, puis la
  // pointe, attachée à elle : elle fouette)
  const RA = { base: ['racineA', [430, 430], [400, 360], [372, 330], [352, 300], 46, 26], bout: ['racineA-bout', [352, 300], [340, 280], [336, 262], [324, 248], 26, 2] };
  const RB = { base: ['racineB', [-30, 400], [10, 300], [40, 220], [92, 150], 54, 30], bout: ['racineB-bout', [92, 150], [124, 110], [160, 112], [164, 150], 30, 2] };
  const RC = { base: ['racineC', [-40, 330], [30, 290], [80, 300], [140, 262], 40, 22], bout: ['racineC-bout', [140, 262], [190, 236], [240, 250], [290, 236], 22, 2] };
  // les éclats arrachés à chaque coup : [id, d'où, dx, dy, rotation, rang]
  const ECLATS = [
    ['eclat1', [322, 240], 40, -60, 300, 1], ['eclat2', [318, 246], 70, -30, -260, 2], ['eclat3', [326, 250], 20, -80, 420, 3],
    ['eclat4', [186, 230], -50, -70, -340, 4], ['eclat5', [190, 236], -20, -90, 260, 5], ['eclat6', [182, 228], 30, -60, 380, 6],
    ['eclat7', [110, 244], -60, -50, 320, 7], ['eclat8', [114, 250], -30, -80, -300, 8], ['eclat9', [200, 236], 10, -70, 400, 9]
  ];
  const racinePlans = (R, prof, devant) => [
    { id: R.base[0], profondeur: prof, cadre: [-80, 60, 560, 400], pivot: R.base[1], dessin: () => racine(p, R.base[0], ...R.base.slice(1, 5), R.base[5], R.base[6], 500 + R.base[1][0]) },
    { id: R.bout[0], dans: R.base[0], derriere: !devant, cadre: [-80, 60, 560, 400], pivot: R.bout[1], dessin: () => racine(p, R.bout[0], ...R.bout.slice(1, 5), R.bout[5], R.bout[6], 600 + R.bout[1][0]) }
  ];
  const plans = [
    { id: 'jour', profondeur: 0.03, ...m, flou: 0.2, dessin: () => fondJour(p) },
    { id: 'fond', profondeur: 0.03, ...m, flou: 0.2, dessin: () => fond(p) },
    { id: 'lueur', profondeur: 0.05, ...m, flou: 0.15, dessin: () => lueur(p, 'L', 96, 40, 260, C.soufre) },
    { id: 'soleil', profondeur: 0.06, cadre: [240, 26, 120, 120], pivot: SOLEIL, dessin: () => soleil(p) },
    ...SPIRALES.map(([x, y], i) => ({ id: `spirale${i}`, profondeur: 0.06 + i * 0.01, cadre: [x - 30, y - 30, 60, 60], pivot: [x, y], dessin: () => spiraleCiel(p, i) })),
    ...cumulus.map(([i, y, h, b, c]) => ({ id: `cumulus${i}`, profondeur: 0.08 + i * 0.03, cadre: [-120, y - h - 16, 640, h + 50], dessin: () => nuage(p, 10 + i, y, h, b, c) })),
    ...nuages.slice(0, 2).map(([i, y, h, b, c]) => ({ id: `nuage${i}`, profondeur: 0.1 + i * 0.04, cadre: [-120, y - h - 16, 640, h + 50], dessin: () => nuage(p, i, y, h, b, c) })),
    { id: 'foudre', profondeur: 0.1, cadre: [60, -24, 72, 244], pivot: [104, -14], dessin: () => foudre(p) },
    ...nuages.slice(2).map(([i, y, h, b, c]) => ({ id: `nuage${i}`, profondeur: 0.1 + i * 0.04, cadre: [-120, y - h - 16, 640, h + 50], dessin: () => nuage(p, i, y, h, b, c) })),
    { id: 'brume1', profondeur: 0.15, ...m, flou: 0.15, dessin: () => brume(p, 'b1', 150, 300, '#4E6A5A', 0.5) },
    { id: 'lame', profondeur: 0.3, cadre: [-100, -14, 600, 364], pivot: [300, 300], dessin: () => lame(p) },
    ...mers.slice(0, 2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.1, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    { id: 'brume2', profondeur: 0.45, ...m, flou: 0.15, dessin: () => brume(p, 'b2', 190, 300, '#3E5A50', 0.4) },
    ...racinePlans(RB, 0.55, false),
    { id: 'navire', profondeur: 0.6, cadre: [36, 92, 344, 190], ...NAV, dessin: () => navire(p) },
    ...[0, 1, 2, 3, 4, 5].map(i => ({ id: `fumee${i}`, dans: 'navire', derriere: true, cadre: [140, 50, 100, 80], pivot: CHEMINEE, dessin: () => fumee(p, i) })),
    { id: 'lumieres', dans: 'navire', cadre: [112, 140, 200, 64], dessin: () => lumieres(p) },
    { id: 'mat', dans: 'navire', cadre: [56, 92, 306, 124], pivot: MAT, dessin: () => mat(p) },
    { id: 'fente-mat', dans: 'mat', cadre: [312, 144, 20, 40], dessin: () => fenteMat(p) },
    { id: 'guirlande', dans: 'mat', cadre: [56, 98, 306, 120], dessin: () => guirlande(p) },
    { id: 'fanion', dans: 'mat', cadre: [316, 92, 40, 22], pivot: FANION, dessin: () => fanion(p) },
    { id: 'cornet', dans: 'mat', cadre: [290, 114, 40, 34], pivot: CORNET, dessin: () => cornet(p) },
    ...[0, 1].map(i => ({ id: `onde${i}`, dans: 'cornet', cadre: [270, 104, 34, 54], pivot: [297, 131], dessin: () => onde(p, `o${i}`, [297, 131], 14 + i * 4, 0.9) })),
    { id: 'canot', dans: 'navire', cadre: [120, 132, 84, 46], pivot: CANOT, dessin: () => canot(p) },
    { id: 'breche', dans: 'navire', cadre: [292, 224, 62, 44], pivot: BRECHE, dessin: () => breche(p) },
    { id: 'breche2', dans: 'navire', cadre: [80, 226, 62, 44], pivot: [110, 248], dessin: () => brecheEn(p, 'b2', [110, 248]) },
    { id: 'breche3', dans: 'navire', cadre: [156, 210, 62, 44], pivot: [186, 234], dessin: () => brecheEn(p, 'b3', [186, 234]) },
    { id: 'fissure1', dans: 'navire', cadre: [232, 190, 130, 96], pivot: BRECHE, dessin: () => fissure(p, 'f1', BRECHE, -1, 70) },
    { id: 'fissure2', dans: 'navire', cadre: [116, 190, 140, 96], pivot: [186, 234], dessin: () => fissure(p, 'f2', [186, 234], 1, 64) },
    { id: 'fissure3', dans: 'navire', cadre: [60, 196, 130, 96], pivot: [110, 248], dessin: () => fissure(p, 'f3', [110, 248], 1, 70) },
    { id: 'cassure', dans: 'navire', cadre: [176, 196, 52, 80], pivot: [202, 236], dessin: () => cassure(p) },
    ...ECLATS.map(([id, c, , , , i]) => ({ id, dans: 'navire', cadre: [c[0] - 14, c[1] - 10, 28, 20], pivot: c, dessin: () => eclat(p, id, c, i) })),
    { id: 'impact-proue', dans: 'navire', cadre: [262, 186, 120, 120], pivot: BRECHE, dessin: () => impact(p, 'i1', BRECHE, 44) },
    { id: 'impact-canot', dans: 'navire', cadre: [120, 120, 90, 90], pivot: [164, 164], dessin: () => impact(p, 'i2', [164, 164], 32, C.creme) },
    { id: 'impact-poupe', dans: 'navire', cadre: [50, 188, 120, 120], pivot: [110, 248], dessin: () => impact(p, 'i3', [110, 248], 44) },
    ...PASSAGERS.flatMap(q => [
      { id: q.id, dans: 'navire', cadre: [q.x - 12, PIED - 44, 26, 48], pivot: [q.x, PIED - 11], dessin: () => passagerCorps(p, q) },
      { id: `${q.id}-jambe0`, dans: q.id, derriere: true, cadre: [q.x - 6, PIED - 14, 14, 18], pivot: [q.x - 1.4, PIED - 11], dessin: () => passagerJambe(p, q, 0) },
      { id: `${q.id}-jambe1`, dans: q.id, derriere: true, cadre: [q.x - 4, PIED - 14, 14, 18], pivot: [q.x + 1.4, PIED - 11], dessin: () => passagerJambe(p, q, 1) },
      { id: `${q.id}-bras`, dans: q.id, cadre: [q.x - 4, PIED - 28, 12, 20], pivot: [q.x + 0.5, PIED - 24], dessin: () => passagerBras(p, q) }
    ]),
    ...[0, 1].map(i => ({ id: `embrun${i}`, dans: 'navire', cadre: [324, 204, 64, 42], pivot: PROUE, dessin: () => embrun(p, i) })),
    ...racinePlans(RC, 0.62, true),
    ...mers.slice(2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.12, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    ...racinePlans(RA, 0.85, true),
    { id: 'anime', profondeur: 0.8, dessin: () => vivant() },
    { id: 'assombri', profondeur: 0, ...m, flou: 0.1, dessin: () => plein(null, '#081214') },
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
  // la météo qui empire : calme au départ, l'orage à la fin
  const force = t => (t < 4200 ? 0.45 : t < 9400 ? 0.45 + (0.55 * (t - 4200)) / 5200 : t < 14600 ? 1 + (0.5 * (t - 9400)) / 5200 : 2.3);
  const { COR_IN, COUPE, CHOC, RACCORD, SORT, ARRACHE, RETOUR, KRR, CRI, CHUTE } = REPERES;
  // (au « Aaah ! », le choc arrache le pavillon : on voit, juste après, le navire frappé)
  const FRAPPE = CRI + 350;
  // le ciel : le jour, puis les nuages d'orage qui arrivent, couvrent le soleil ; la nuit d'orage, la lueur de soufre
  P.fond = [[0, { o: 0 }], [4600, { o: 0, e: 'ease-in' }], [11000, { o: 1 }]];
  P.lueur = [[0, { o: 0 }], [6000, { o: 0 }], [10000, { o: 0.3 }]];
  P.soleil = [[0, { y: 160, r: 0 }], [200, { y: 160, e: 'cubic-bezier(.2,.8,.3,1)' }], [1500, { y: 0, r: 20 }], [5000, { y: 0, r: 60, o: 1 }], [10500, { y: 30, r: 140, o: 0.12 }], [FIN, { y: 40, r: 200, o: 0 }]];
  cumulus.forEach(([i]) => { const sens = i ? -1 : 1; P[`cumulus${i}`] = [[0, { x: sens * 470 }], [100 + i * 250, { x: sens * 470, e: 'cubic-bezier(.2,.85,.3,1)' }], [1300 + i * 250, { x: 0 }], [6000, { x: -sens * 30, o: 1 }], [11000, { x: -sens * 120, o: 0 }]]; });
  // (les nuages d'orage entrent l'un après l'autre, poussés par le vent)
  const entrees = [4400, 6200, 9700, 11500];
  nuages.forEach(([i]) => { const sens = i % 2 ? 1 : -1, t0 = entrees[i]; P[`nuage${i}`] = [[0, { x: sens * 480 }], [t0, { x: sens * 480, e: 'cubic-bezier(.3,.7,.3,1)' }], [t0 + 2400, { x: 0 }], ...balance(t0 + 2400, FIN, 6000 + i * 900, k => ({ x: (k % 2 ? 1 : -1) * sens * (12 + i * 5) }))]; });
  SPIRALES.forEach(([, , , sens], i) => { P[`spirale${i}`] = [[0, { s: 0, r: -180 * sens }], [300 + i * 140, { s: 0, r: -180 * sens, e: 'cubic-bezier(.2,.9,.3,1.3)' }], [1200 + i * 140, { s: 1, r: 0, e: 'linear' }], [FIN, { s: 1, r: sens * 420, x: (i % 2 ? 1 : -1) * 30 }]]; });
  // la mer : elle se lève au montage, puis grossit avec l'orage
  mers.forEach(([i], j) => { const t0 = 400 + j * 180; P[`mer${i}`] = [[0, { y: 300 }], [t0, { y: 300, e: 'cubic-bezier(.2,.9,.3,1.05)' }], [t0 + 900, { y: 0 }], ...balance(t0 + 900, FIN, 2300 + j * 300, (k, t) => ({ x: (k % 2 ? 1 : -1) * (8 + j * 3) * force(t), r: (k % 2 ? -1 : 1) * (1.4 + j * 0.3) * force(t), y: (k % 2 ? -1 : 1) * 3 * Math.max(0, force(t) - 1) })) ]; });
  // le navire : il entre, roule de plus en plus, encaisse les coups des racines, gîte
  P.navire = [[0, { x: -470 }], [700, { x: -470, e: 'cubic-bezier(.25,.8,.35,1)' }], [2800, { x: 0 }], ...balance(2800, CHOC, 2600, (k, t) => ({ r: (k % 2 ? 1 : -1) * 2.4 * force(t), y: (k % 2 ? -3 : 3) * force(t) })),
    ...secoue(CHOC, { r: 7, x: -6 }, 16, 8, 55), ...balance(CHOC + 480, ARRACHE, 2400, (k, t) => ({ r: 3.5 + (k % 2 ? 2.5 : -2.5) * force(t), y: k % 2 ? -4 : 4 })), ...secoue(ARRACHE, { r: 9, x: 5 }, 14, 8, 55), ...balance(ARRACHE + 480, FRAPPE, 2000, k => ({ r: 6 + (k % 2 ? 3 : -3), y: k % 2 ? -5 : 5 })), ...secoue(FRAPPE, { r: 10 }, 16, 9, 55), [FRAPPE + 520, { r: 9, y: 6, e: 'linear' }], [FRAPPE + 600, { r: 14, y: 10, e: 'ease-out' }], [FRAPPE + 800, { r: 12, y: 8, e: 'ease-in-out' }], ...balance(FRAPPE + 800, FIN, 1400, k => ({ r: 12 + (k % 2 ? -3 : 3), y: 8 }))];
  // la fumée : grise, puis noire après le choc (les deux dernières volutes)
  [0, 1, 2, 3].forEach(i => { const k = []; for (let t = -i * 700; t < FIN; t += 2800) { const a = Math.max(0, t); k.push([a, { x: 0, y: 0, s: 0.3, o: 0, e: 'linear' }], [a + 1, { x: 0, y: 0, s: 0.3, o: 1, e: 'ease-out' }], [t + 2800 - 1, { x: -70 - i * 10, y: -60, s: 1.7, r: (i % 2 ? 1 : -1) * 90, o: 0 }]); } P[`fumee${i}`] = k.filter(([t]) => t >= 0); });
  [4, 5].forEach(i => { P[`fumee${i}`] = bouffees(CHOC + 300 + (i - 4) * 900, FIN, 1800, { x: 0, y: 0, s: 0.4, r: 0, o: 1 }, { x: -110, y: -50, s: 2.2, r: (i % 2 ? 1 : -1) * 120, o: 0 }); });
  // les lumières du bord : elles vacillent au choc, à l'arrachement, puis s'éteignent au dernier message
  const vacille = t => [[t, { o: 1, e: 'linear' }], [t + 40, { o: 0.1, e: 'linear' }], [t + 110, { o: 0.9, e: 'linear' }], [t + 160, { o: 0.2, e: 'linear' }], [t + 260, { o: 1 }]];
  P.lumieres = [[0, { o: 1 }], ...vacille(CHOC), ...vacille(ARRACHE), ...vacille(KRR), [FRAPPE, { o: 1, e: 'linear' }], [FRAPPE + 40, { o: 0, e: 'linear' }], [FRAPPE + 140, { o: 0.6, e: 'linear' }], [FRAPPE + 200, { o: 0 }]];
  // le mât : la foudre le frappe au dernier message, il se fend et penche
  P.mat = [[0, { r: 0 }], [FRAPPE, { r: 0, e: 'linear' }], [FRAPPE + 80, { r: -4 }], [FRAPPE + 600, { r: -16, e: 'ease-in' }], [FRAPPE + 900, { r: -14 }], ...balance(FRAPPE + 900, FIN, 900, k => ({ r: k % 2 ? -18 : -13 }))];
  P['fente-mat'] = [[0, { o: 0 }], [FRAPPE, { o: 0, e: 'linear' }], [FRAPPE + 40, { o: 1 }]];
  P.fanion = balance(0, FIN, 360, (k, t) => ({ r: (k % 2 ? 1 : -1) * 8 * Math.max(0.6, force(t)) }));
  [0, 1].forEach(i => { const k = [[0, { s: 0, o: 0 }]]; for (let t = 5200 + i * 650; t < FIN; t += 1300) k.push([t, { s: 0.2, o: 1, e: 'ease-out' }], [t + 360, { s: 1.1, o: 1, e: 'ease-in' }], [t + 700, { s: 1.3, o: 0 }]); P[`embrun${i}`] = k; });
  // le canot : on le descend le long de la coque ; une racine l'arrache, il tombe à la mer
  P.canot = [[0, { r: 0 }], ...balance(2800, SORT + 200, 2600, k => ({ r: k % 2 ? 3 : -3 })), ...[0, 1, 2].flatMap(k => [[SORT + 600 + k * 700, { y: k * 11, r: k % 2 ? 4 : -4, e: 'ease-in' }], [SORT + 900 + k * 700, { y: k * 11 + 9, r: k % 2 ? -5 : 5 }]]), [ARRACHE, { y: 31, r: -3, e: 'ease-out' }], [ARRACHE + 160, { y: 10, x: -20, r: -50 }], [ARRACHE + 900, { y: 260, x: -60, r: -140, e: 'ease-in' }]];
  P.breche = [[0, { o: 0, s: 0.2 }], [CHOC, { o: 0, s: 0.2, e: 'linear' }], [CHOC + 60, { o: 1, s: 1.3, e: 'ease-out' }], [CHOC + 300, { o: 1, s: 1 }]];
  P.breche3 = [[0, { o: 0, s: 0.2 }], [ARRACHE + 40, { o: 0, s: 0.2, e: 'linear' }], [ARRACHE + 100, { o: 1, s: 1.3, e: 'ease-out' }], [ARRACHE + 340, { o: 1, s: 1 }]];
  // (les fissures grandissent depuis les trous, par à-coups ; elles s'allongent encore aux coups suivants)
  const fend = (t, s0 = 0.15, s1 = 1) => [[t - 1, { o: 0, s: s0, e: 'linear' }], [t, { o: 1, s: s0, e: 'cubic-bezier(.2,.9,.3,1)' }], [t + 120, { o: 1, s: s1 * 0.7, e: 'linear' }], [t + 200, { o: 1, s: s1 * 0.75, e: 'cubic-bezier(.2,.9,.3,1)' }], [t + 420, { o: 1, s: s1 }]];
  P.fissure1 = [[0, { o: 0, s: 0.15 }], ...fend(CHOC + 40, 0.15, 0.8), [ARRACHE, { o: 1, s: 0.8, e: 'linear' }], [ARRACHE + 100, { o: 1, s: 1.05 }], [FRAPPE, { o: 1, s: 1.05, e: 'linear' }], [FRAPPE + 120, { o: 1, s: 1.25 }]];
  P.fissure2 = [[0, { o: 0, s: 0.15 }], ...fend(ARRACHE + 60, 0.15, 0.85), [FRAPPE, { o: 1, s: 0.85, e: 'linear' }], [FRAPPE + 120, { o: 1, s: 1.15 }]];
  P.fissure3 = [[0, { o: 0, s: 0.15 }], ...fend(FRAPPE + 140, 0.15, 1)];
  P.cassure = [[0, { o: 0, s: 0.2 }], ...fend(FRAPPE + 520, 0.2, 1), [FIN, { o: 1, s: 1.1 }]];
  ECLATS.forEach(([id, , dx, dy, r, i]) => { const t = i <= 3 ? CHOC : i <= 6 ? ARRACHE + 60 : FRAPPE + 120 + (i === 9 ? 400 : 0); P[id] = projete(t + (i % 3) * 30, dx, dy, r); });
  P['impact-proue'] = [[0, { o: 0, s: 0.2 }], ...eclate(CHOC, 620)];
  P['impact-canot'] = [[0, { o: 0, s: 0.2 }], ...eclate(ARRACHE, 560)];
  P['impact-poupe'] = [[0, { o: 0, s: 0.2 }], ...eclate(FRAPPE + 100, 620)];
  P.breche2 = [[0, { o: 0, s: 0.2 }], [FRAPPE + 100, { o: 0, s: 0.2, e: 'linear' }], [FRAPPE + 160, { o: 1, s: 1.3, e: 'ease-out' }], [FRAPPE + 400, { o: 1, s: 1 }]];
  // les racines : A jaillit devant la proue et fouette la coque (le choc) ; B se dresse derrière le navire et arrache le
  // canot ; C s'enroule autour de la coque au dernier message
  P.racineA = [[0, { y: 260 }], [CHOC - 700, { y: 260, e: 'cubic-bezier(.2,.9,.3,1.1)' }], [CHOC - 250, { y: 0, r: 6 }], [CHOC + 300, { r: 0 }], ...balance(CHOC + 300, ARRACHE, 1800, k => ({ r: k % 2 ? 3 : -2 })), [ARRACHE, { y: 0 }], [ARRACHE + 1200, { y: 120, r: 10, e: 'ease-in-out' }], [CRI - 400, { y: 30, r: 0 }], ...balance(CRI - 400, FIN, 1600, k => ({ y: 30, r: k % 2 ? 4 : -3 }))];
  P['racineA-bout'] = [[0, { r: -60 }], [CHOC - 250, { r: -60, e: 'cubic-bezier(.7,0,1,1)' }], [CHOC, { r: 0, e: 'ease-out' }], [CHOC + 200, { r: 6 }], [CHOC + 700, { r: -10 }], ...balance(CHOC + 700, FIN, 1400, k => ({ r: k % 2 ? -18 : -4 }))];
  P.racineB = [[0, { y: 320 }], [ARRACHE - 1800, { y: 320, e: 'cubic-bezier(.3,.8,.3,1)' }], [ARRACHE - 500, { y: 0, r: -4 }], [ARRACHE, { r: 2 }], ...balance(ARRACHE + 200, FIN, 2000, k => ({ r: k % 2 ? 4 : -3, y: k % 2 ? 6 : 0 }))];
  P['racineB-bout'] = [[0, { r: 50 }], [ARRACHE - 400, { r: 50, e: 'cubic-bezier(.7,0,1,1)' }], [ARRACHE, { r: 0, e: 'ease-out' }], [ARRACHE + 200, { r: -14 }], [ARRACHE + 900, { r: 30 }], ...balance(ARRACHE + 900, FIN, 1500, k => ({ r: k % 2 ? 40 : 18 }))];
  P.racineC = [[0, { y: 200, x: -60 }], [FRAPPE - 900, { y: 200, x: -60, e: 'cubic-bezier(.2,.9,.3,1.05)' }], [FRAPPE - 200, { y: 0, x: 0 }], ...balance(FRAPPE, FIN, 1200, k => ({ r: k % 2 ? 3 : -2 }))];
  P['racineC-bout'] = [[0, { r: 70 }], [FRAPPE - 300, { r: 70, e: 'cubic-bezier(.7,0,1,1)' }], [FRAPPE + 100, { r: 0, e: 'ease-out' }], [FRAPPE + 300, { r: -6 }], ...balance(FRAPPE + 300, FIN, 900, k => ({ r: k % 2 ? 4 : -4 }))];
  // les passagers : ils se tiennent, chancellent au choc, courent vers le canot, reculent quand il est arraché ;
  // au dernier message, ils tombent
  PASSAGERS.forEach((q, j) => {
    const course = [-30, -52, -136][j], depart = SORT + 400 + j * 250, arrivee = SORT + 3000 + j * 300;
    P[q.id] = [[0, { x: 0 }], [CHOC, { x: 0, r: 0 }], [CHOC + 120, { r: -14, x: -3 }], [CHOC + 500, { r: 6 }], [CHOC + 900, { r: 0, x: 0 }], [depart, { x: 0, r: 0 }],
      ...balance(depart, arrivee, 360, (k, t) => ({ x: course * ((t - depart) / (arrivee - depart)), y: k % 2 ? -1.2 : 0, r: -6 })), [arrivee, { x: course, r: 0 }], [ARRACHE, { x: course, r: 0 }], [ARRACHE + 200, { x: course + 16, r: 18 }], [ARRACHE + 700, { x: course + 22, r: 4 }], [FRAPPE, { x: course + 22, r: 4 }], [FRAPPE + 300, { x: course + 34, r: 74, y: 3 }]];
    for (const g of [0, 1]) P[`${q.id}-jambe${g}`] = [[0, { r: 0 }], [depart, { r: 0 }], ...balance(depart, arrivee, 360, k => ({ r: (k % 2 ? 1 : -1) * (g ? -32 : 32) })), [arrivee + 100, { r: 0 }], [ARRACHE + 100, { r: g ? 20 : -14 }], [ARRACHE + 600, { r: 0 }], [FRAPPE + 300, { r: g ? 40 : -20 }]];
    P[`${q.id}-bras`] = [[0, { r: 0 }], [CHOC, { r: 0 }], [CHOC + 150, { r: -110 }], [CHOC + 900, { r: -20 }], [depart, { r: -20 }], ...balance(depart, arrivee, 360, k => ({ r: k % 2 ? -50 : 30 })), [arrivee + 100, { r: -150 }], [ARRACHE + 200, { r: -170 }], [FRAPPE + 300, { r: -170 }]];
  });
  // le petit pavillon du mât : il parle au loin (le deuxième message), ses ondes s'éloignent
  P.cornet = [[0, { r: 0 }], ...balance(SORT + 200, RETOUR - 200, 160, k => ({ r: k % 2 ? 3 : -2 })), [RETOUR, { r: 0 }]];
  [0, 1].forEach(i => { P[`onde${i}`] = bouffees(SORT + 300 + i * 300, RETOUR - 400, 600, { s: 0.4, o: 1, x: 0 }, { s: 1.8, o: 0, x: -10 }); });
  // la pluie : elle commence avec les premiers nuages, et forcit
  P.anime = [[0, { o: 0 }], [5600, { o: 0 }], [9400, { o: 1 }]];
  // la foudre : seulement quand l'orage est là (la deuxième foudre frappe le mât)
  const coups = [[11200, 0.8], [FRAPPE, 1], [18600, 1]];
  P.foudre = [[0, { s: 0.05, o: 0 }], ...coups.flatMap(([t]) => [[t - 1, { s: 0.05, o: 0, e: 'linear' }], [t, { s: 0.05, o: 1, e: 'ease-out' }], [t + 110, { s: 1, o: 1 }], [t + 320, { s: 1, o: 1, e: 'ease-in' }], [t + 600, { s: 1, o: 0 }]])];
  P.lueur.push(...coups.flatMap(([t, a]) => [[t - 1, { o: 0.3, e: 'linear' }], [t + 40, { o: a, e: 'linear' }], [t + 160, { o: 0.5 * a, e: 'linear' }], [t + 220, { o: a, e: 'ease-out' }], [t + 900, { o: 0.3 }]]));
  // (et un éclair blanc à chaque coup reçu)
  P.eclair = [[0, { o: 0 }], ...[...coups, [CHOC, 0.7], [ARRACHE, 0.6], [FRAPPE + 520, 0.5]].sort((u, v) => u[0] - v[0]).flatMap(([t, a]) => [[t - 1, { o: 0, e: 'linear' }], [t + 40, { o: 0.3 * a, e: 'linear' }], [t + 100, { o: 0.05, e: 'linear' }], [t + 160, { o: 0.2 * a, e: 'ease-out' }], [t + 420, { o: 0 }]])];
  // le jour qui s'assombrit
  P.assombri = [[0, { o: 0 }], [4600, { o: 0, e: 'ease-in' }], [11000, { o: 0.32 }], [FIN, { o: 0.42 }]];
  P.lame = [[0, { y: 330, o: 0 }], [CHUTE - 401, { y: 330, o: 0, e: 'linear' }], [CHUTE - 400, { y: 330, o: 1, e: 'cubic-bezier(.3,0,.2,1)' }], [FIN, { y: 0, o: 1 }]];
  // le pavillon en gros plan : il entre par la droite par-dessus la scène, parle (ses ondes, ses boucles), encaisse le
  // choc, ressort ; il retombe d'en haut, grésille (ses étincelles, sa fêlure), puis se décroche et tombe
  P.voile = [[0, { o: 0 }], [COR_IN, { o: 0 }], [COR_IN + 600, { o: 0.6 }], [COUPE, { o: 0.6 }], [COUPE + 350, { o: 0 }], [RACCORD, { o: 0 }], [RACCORD + 450, { o: 0.6 }], [SORT, { o: 0.6 }], [SORT + 500, { o: 0 }], [RETOUR, { o: 0 }], [RETOUR + 450, { o: 0.6 }], [CRI + 60, { o: 0.6 }], [CRI + 380, { o: 0 }]];
  P['lueur-cor'] = P.voile.map(([t, c]) => [t, { o: c.o * 1.2 }]);
  const vibre = (t0, t1, a = 1) => balance(t0, t1, 140, k => ({ s: k % 2 ? 1 + 0.018 * a : 1, r: k % 2 ? 0.6 * a : -0.6 * a }));
  P.cor = [[0, { x: 470, r: 10 }], [COR_IN, { x: 470, r: 10, e: 'cubic-bezier(.2,.9,.3,1.12)' }], [COR_IN + 700, { x: 0, r: -1.5 }], [COR_IN + 900, { x: 0, r: 0 }], ...vibre(COR_IN + 900, COUPE - 100), [COUPE, { x: 0, r: 0, e: 'cubic-bezier(.6,0,.8,.4)' }], [COUPE + 450, { x: 480, r: 14 }], [RACCORD, { x: 480, r: 14, e: 'cubic-bezier(.2,.9,.3,1.12)' }], [RACCORD + 550, { x: 0, r: -1.5 }], [RACCORD + 700, { x: 0, r: 0 }], ...secoue(RACCORD + 700, { r: 2 }, 8), ...vibre(RACCORD + 1100, SORT - 100), [SORT, { x: 0, r: 0, e: 'cubic-bezier(.6,0,.8,.4)' }], [SORT + 600, { x: 480, r: 14 }],
    [RETOUR - 1, { x: 480, r: 14, e: 'linear' }], [RETOUR, { x: 0, y: -460, r: -6, e: 'cubic-bezier(.3,1.35,.5,1)' }], [RETOUR + 550, { x: 0, y: 0, r: 0 }], ...vibre(RETOUR + 600, KRR, 1.4), ...secoue(KRR, { r: 3 }, 10, 10, 60), [CRI, { r: 6, e: 'linear' }], [CRI + 80, { r: -12, x: -14, y: 6, e: 'cubic-bezier(.4,0,.9,.6)' }], [CRI + 520, { r: -56, x: -90, y: 480 }]];
  [0, 1, 2].forEach(i => { P[`grosse-onde${i}`] = [...bouffees(COR_IN + 1000 + i * 220, COUPE - 300, 660, { s: 0.7, o: 1, x: 0 }, { s: 2.6, o: 0, x: -50 }), ...bouffees(RACCORD + 900 + i * 220, SORT - 300, 660, { s: 0.7, o: 1, x: 0 }, { s: 2.6, o: 0, x: -50 }).slice(1), ...bouffees(RETOUR + 700 + i * 220, KRR, 660, { s: 0.7, o: 1, x: 0 }, { s: 2.6, o: 0, x: -50 }).slice(1)]; });
  [0, 1].forEach(i => { P[`boucle${i}`] = [...bouffees(RACCORD + 1000 + i * 600, SORT - 400, 1400, { x: 0, y: 0, r: 0, s: 0.4, o: 1 }, { x: -170, y: (i ? 40 : -40), r: (i ? 1 : -1) * 360, s: 1.4, o: 0 }), ...bouffees(RETOUR + 900 + i * 500, KRR, 1000, { x: 0, y: 0, r: 0, s: 0.4, o: 1 }, { x: -170, y: (i ? 40 : -40), r: (i ? 1 : -1) * 360, s: 1.4, o: 0 }).slice(1)]; });
  P.etincelles = [[0, { o: 0, s: 0.3 }], ...[KRR, KRR + 260, KRR + 520, CRI - 100, CRI + 120].flatMap((t, i) => [[t, { o: 0, s: 0.3, e: 'linear' }], [t + 30, { o: 1, s: 0.8 + 0.2 * i, r: i * 40, e: 'ease-out' }], [t + 220, { o: 0, s: 1.5 + 0.2 * i, r: i * 40 + 30 }]])];
  P.felure = [[0, { o: 0, s: 0.4 }], [KRR + 500, { o: 0, s: 0.4, e: 'linear' }], [KRR + 540, { o: 1, s: 1 }]];
  // la caméra : une poussée lente, le pont pendant les canots, l'arrachement, puis elle lève les yeux vers la lame
  const camera = [[0, { z: 1.02 }], [4200, { z: 1.05 }], [COUPE, { z: 1.05 }], [CHOC - 100, { z: 1.22, x: 50, y: 20 }], ...secoue(CHOC, { z: 1.22, x: 50, y: 20 }, 13, 8, 50), [RACCORD + 300, { z: 1.08, x: 20, y: 6 }], [SORT + 300, { z: 1.05, x: 0, y: 0 }], [SORT + 2000, { z: 1.3, x: -40, y: 8 }], [ARRACHE - 200, { z: 1.3, x: -56, y: 0 }], ...secoue(ARRACHE, { z: 1.3, x: -56, y: 0 }, 11, 8, 50), [RETOUR + 200, { z: 1.08, x: 0, y: 0 }], ...secoue(FRAPPE, { z: 1.08 }, 13, 9, 50), ...secoue(FRAPPE + 520, { z: 1.08 }, 8, 6, 50), [FRAPPE + 1000, { z: 1.08, x: 0, y: 0 }], [FIN, { z: 1.02, x: 6, y: -24, r: -4 }]];
  const temps = T.map(d => ({ duree: d, camera: [], pistes: {} }));
  parTemps(T, camera, ['x', 'y', 'z', 'r']).forEach((c, n) => { temps[n].camera = c; });
  for (const [id, cles] of Object.entries(P)) parTemps(T, cles).forEach((c, n) => { temps[n].pistes[id] = c; });
  // (pas de démontage : la vague en est la suite, elle reprend où le pont s'arrête)
  return { plans, partition: { temps } };
}

// ——— 01_vague : la lame se recourbe et s'abat sur le navire ; l'écume ; l'eau engloutit tout ———
// une gerbe d'eau qui jaillit de l'impact : une masse d'écume pleine, hachurée, ses doigts recourbés, ses gouttes
function gerbe(p, i, [x, y], r) {
  const A = atelier(`${p}g${i}`);
  const n = 7, masse = [];
  for (let k = 0; k <= n * 2; k++) { const t = k / (n * 2), a = Math.PI + t * Math.PI, l = k % 2 ? r * 0.55 : r * (0.85 + 0.35 * hash(k, i)), cr = k % 2 ? 0 : 0.18 * (k % 4 ? 1 : -1); masse.push([x + Math.cos(a + cr) * l, y + Math.sin(a + cr) * l * 0.9]); }
  masse.push([x + r * 0.7, y + 8], [x - r * 0.7, y + 8]);
  // (la même eau que la lame : sarcelle, mêmes hachures ; l'écume crème seulement au bout des doigts)
  let s = gravure(A, masse, A.lin([[0, C.creme], [0.22, C.creme], [0.5, C.sarcelleC], [1, C.sarcelle]], 0, y - r * 1.15, 0, y + 8), { seed: 760 + i, amp: 0.4, angle: 60, pas: 2.4, ombre: 0.15, tailles: 2, tailleP: 4, trait: 1.8, portee: 0.5, dx: 2, dy: 4, lumiere: [-0.4, -0.9] });
  s += gravure(A, masse.slice(0, -2).filter((_, k) => k % 2 === 0).flatMap(([px, py]) => [[x + (px - x) * 0.55, y + (py - y) * 0.55]]).concat([[x + r * 0.35, y + 4], [x - r * 0.35, y + 4]]), C.sarcelleS, { seed: 770 + i, amp: 0.3, angle: 60, pas: 2.4, ombre: 0.15, tailles: 0, trait: 1.1, portee: 0 });
  for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.4, l = r * (1.05 + 0.4 * hash(k, i + 2)); s += `<circle cx="${f(x + Math.cos(a) * l)}" cy="${f(y + Math.sin(a) * l)}" r="${f(1.6 + 2 * hash(k, i + 3))}" fill="${k % 2 ? C.sarcelleC : C.creme}" stroke="${ENCRE}" stroke-width="0.9"/>`; }
  s += volute(x - r * 0.3, y - r * 0.35, r * 0.14, 1, 1.5, 1.4) + volute(x + r * 0.32, y - r * 0.3, r * 0.12, -1, 1.5, 1.4);
  return A.out(s);
}
// l'eau qui engloutit tout : la matière même de la lame (ses teintes, ses hachures), ses bulles (le début des racines)
function eau(p, id) {
  const A = atelier(`${p}${id}`);
  let s = gravure(A, [[G, G], [D_, G], [D_, D_], [G, D_]], A.lin([[0, C.sarcelle], [0.5, C.sarcelleS], [1, '#0C2224']], 0, G, 0, D_), { seed: 720, amp: 0, angle: 60, pas: 2.4, ombre: 0.15, tailles: 0, portee: 0, trait: 0, lumiere: [0, -1] });
  for (let i = 0; i < 16; i++) s += `<circle cx="${f(hash(i, 1) * 400)}" cy="${f(hash(i, 2) * 400)}" r="${f(2 + 6 * hash(i, 3))}" fill="none" stroke="${C.creme}" stroke-width="1.2" opacity="0.6"/>`;
  return A.out(s);
}
function vague01() {
  const p = 'tv', D = 2600, m = { marge: MARGE };
  const nuages = [[0, 34, 22, 3, '#4A625A'], [1, 66, 18, 4, '#3E5650'], [2, 164, 26, 3, '#344A46'], [3, 198, 18, 5, '#2C403E']];
  const mers = [[1, 214, 12, 70, '#2E5650'], [2, 236, 16, 92, C.sarcelle], [3, 264, 22, 116, '#24484A'], [4, 302, 28, 146, C.sarcelleS]];
  const ECUMES = [[[90, 236], 60], [[170, 226], 74], [[250, 232], 66], [[330, 240], 56], [[130, 250], 50]];
  // les poses de la crête : [rang, enroulement, devant le navire] ; la première au repos, la suivante remplace la
  // précédente toutes les ~130 ms (la crête se cabre un peu, puis s'enroule et s'abat)
  const POSES = [[0, 0, false], [1, -0.04, false], [2, 0.12, false], [3, 0.28, true], [4, 0.46, true], [5, 0.64, true], [6, 0.82, true], [7, 0.96, true], [8, 1.04, true]];
  const POSE_T = [0, 700, 950, 1080, 1210, 1340, 1470, 1600, 1740];
  const plans = [
    { id: 'fond', profondeur: 0.03, ...m, flou: 0.2, dessin: () => fond(p) },
    { id: 'lueur', profondeur: 0.05, ...m, flou: 0.15, dessin: () => lueur(p, 'L', 96, 40, 260, C.soufre) },
    ...nuages.map(([i, y, h, b, c]) => ({ id: `nuage${i}`, profondeur: 0.1 + i * 0.04, cadre: [-120, y - h - 16, 640, h + 50], dessin: () => nuage(p, i, y, h, b, c) })),
    { id: 'brume1', profondeur: 0.15, ...m, flou: 0.15, dessin: () => brume(p, 'b1', 150, 300, '#4E6A5A', 0.5) },
    // (la lame, derrière le navire : elle bascule autour de sa base, au large, et sa crête passe par-dessus lui)
    { id: 'lame', profondeur: 0.32, cadre: [-100, -14, 600, 364], dessin: () => lameCorps(p) },
    ...POSES.filter(([, , devant]) => !devant).map(([i, k]) => ({ id: `crete${i}`, profondeur: 0.32, cadre: [-60, -20, 380, 380], dessin: () => lameCrete(p, `c${i}`, k, i ? 0.4 : 0) })),
    ...mers.slice(0, 2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.1, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    { id: 'navire', profondeur: 0.6, cadre: [36, 92, 344, 190], ...NAV, dessin: () => navire(p) },
    { id: 'mat', dans: 'navire', cadre: [56, 92, 306, 124], pivot: MAT, dessin: () => mat(p) },
    { id: 'breche', dans: 'navire', cadre: [292, 224, 62, 44], pivot: BRECHE, dessin: () => breche(p) },
    { id: 'breche2', dans: 'navire', cadre: [80, 226, 62, 44], pivot: [110, 248], dessin: () => brecheEn(p, 'b2', [110, 248]) },
    ...mers.slice(2).map(([i, y, a, per, c]) => ({ id: `mer${i}`, profondeur: 0.3 + i * 0.12, cadre: [-90, y - a - 24, 580, 270], pivot: [200, y + 40], dessin: () => rouleau(p, i, y, a, per, c) })),
    ...POSES.filter(([, , devant]) => devant).map(([i, k]) => ({ id: `crete${i}`, profondeur: 0.32, cadre: [-60, -20, 380, 380], dessin: () => lameCrete(p, `c${i}`, k) })),
    ...ECUMES.map(([c, r], i) => ({ id: `gerbe${i}`, profondeur: 0.75, cadre: [c[0] - r * 1.3, c[1] - r * 1.3, r * 2.6, r * 1.6], pivot: c, dessin: () => gerbe(p, i, c, r) })),
    { id: 'anime', profondeur: 0.8, dessin: () => vivant() },
    { id: 'eau', profondeur: 0, ...m, dessin: () => eau(p, 'E') },
    { id: 'teinte', profondeur: 0, ...m, dessin: () => teinte(p) },
    { id: 'eclair', profondeur: 0, ...m, flou: 0.1, dessin: () => plein(null, '#F4E8B0') }
  ];
  const P = {
    // (le navire part d'où le pont l'a laissé : gîté, le mât penché)
    navire: [[0, { r: 12, y: 8 }], [900, { r: 15, y: 10 }], [1880, { r: 16, y: 12, e: 'ease-in' }], [2350, { r: 30, y: 90 }], [D, { r: 36, y: 140 }]],
    mat: [[0, { r: -16 }], [1700, { r: -18 }], [2100, { r: -40 }]],
    breche: [[0, { o: 1 }]], breche2: [[0, { o: 1 }]],
    lame: [[0, { y: 0 }], [D, { y: 10 }]],
    lueur: [[0, { o: 0.3 }], [200, { o: 0.3, e: 'linear' }], [240, { o: 1, e: 'linear' }], [420, { o: 0.4, e: 'linear' }], [480, { o: 0.9 }], [1200, { o: 0.3 }]],
    eclair: [[0, { o: 0 }], [200, { o: 0, e: 'linear' }], [240, { o: 0.35, e: 'linear' }], [320, { o: 0.05, e: 'linear' }], [380, { o: 0.25 }], [700, { o: 0 }]],
    eau: [[0, { o: 0 }], [2050, { o: 0, e: 'ease-in' }], [2500, { o: 1 }], [D, { o: 1 }]]
  };
  mers.forEach(([i], j) => { P[`mer${i}`] = balance(0, D, 1300 + j * 200, k => ({ x: (k % 2 ? 1 : -1) * (14 + j * 4), r: (k % 2 ? -1 : 1) * (3 + j * 0.6), y: k % 2 ? -6 : 6 })); });
  nuages.forEach(([i]) => { P[`nuage${i}`] = [[0, { x: 0 }], [D, { x: (i % 2 ? 1 : -1) * 30 }]]; });
  // (la crête de la lame se recourbe vers l'avant et s'abat sur le navire ; à l'impact, les gerbes jaillissent)
  // (la crête, image par image : chaque pose paraît à son instant et cède la place à la suivante ; la dernière reste)
  POSES.forEach(([i], j) => {
    const t0 = POSE_T[j], t1 = POSE_T[j + 1];
    P[`crete${i}`] = t1 === undefined ? [[0, { o: 0 }], [t0 - 1, { o: 0, e: 'linear' }], [t0, { o: 1 }], [D, { o: 1, y: 30 }]] : [[0, { o: t0 === 0 ? 1 : 0 }], ...(t0 ? [[t0 - 1, { o: 0, e: 'linear' }], [t0, { o: 1, e: 'linear' }]] : []), [t1 - 1, { o: 1, e: 'linear' }], [t1, { o: 0 }]];
  });
  // (elles naissent en ~110 ms, pas d'un coup)
  ECUMES.forEach((_, i) => { const t0 = 1820 + i * 60; P[`gerbe${i}`] = [[0, { s: 0.2, o: 0 }], [t0, { s: 0.2, o: 0, e: 'ease-out' }], [t0 + 110, { s: 0.55, o: 1, e: 'cubic-bezier(.2,.8,.3,1)' }], [t0 + 520, { s: 1.3, o: 1, y: -20 }], [D, { s: 1.6, o: 0.6, y: -10 }]]; });
  const camera = [[0, { z: 1.04, x: 6, y: -24, r: -4 }], [1600, { z: 1.12, x: 0, y: -10, r: -7 }], ...secoue(1700, { z: 1.12, x: 0, y: -10, r: -7 }, 9, 7), [D, { z: 1.3, x: 0, y: 10, r: -12 }]];
  const pistes = {};
  for (const [id, cles] of Object.entries(P)) pistes[id] = parTemps([D], cles)[0];
  return { plans, partition: { temps: [{ duree: D, camera: parTemps([D], camera, ['x', 'y', 'z', 'r'])[0], pistes }] } };
}

// ——— 01_racines : sous la surface, la coque vue d'en dessous, le faisceau ; les racines ; l'une fouette la quille ———
// l'eau, vue d'en dessous : sarcelle en haut, noire au fond, des rais de lumière (peinte floue)
function eauFond(p) {
  const A = atelier(`${p}F`);
  let s = plein(A, A.lin([[0, '#4E8A80'], [0.25, '#24504C'], [0.65, '#0C2224'], [1, '#030A0A']], 0, G, 0, D_));
  for (let i = 0; i < 4; i++) { const x = 30 + i * 110; s += `<path d="M${x},20 L${x + 40},20 L${x + 130},440 L${x + 30},440 Z" fill="${A.lin([[0, '#BFE8C8', 0.22], [1, '#BFE8C8', 0]], 0, 20, 0, 420)}"/>`; }
  for (let i = 0; i < 12; i++) { const x = hash(i, 31) * 480 - 40, y = 120 + hash(i, 32) * 300, r = 40 + 60 * hash(i, 33); s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.4)}" ry="${f(r * 0.6)}" fill="${A.rad([[0, '#0A1C1C', 0.6], [1, '#0A1C1C', 0]], x, y, r * 1.4)}"/>`; }
  return A.out(s);
}
// la surface vue d'en dessous : une bande de lumière ondulée, gravée
function surface(p) {
  const A = atelier(`${p}S`);
  const bord = courbe(t => [G + (D_ - G) * t, 30 + 5 * Math.sin(t * 19) + 3 * Math.sin(t * 7)], 70);
  return A.out(gravure(A, [[G, G], [D_, G], ...bord.slice().reverse()], A.lin([[0, '#E8E0A8'], [1, '#8AC0A8']], 0, G, 0, 34), { seed: 730, amp: 0.4, angle: 0, pas: 3, ombre: 0.5, tailles: 2, tailleP: 4, portee: 0.4, lumiere: [0, -1] }) + trait(Array.from({ length: 9 }, (_, i) => `M${f(G + 10 + i * 56)},${f(40 + 4 * hash(i, 1))} q14,-5 28,0 q12,4 24,-1`).join(' '), 1.2, C.creme, 0.6));
}
// la coque de l'Hirondelle, vue d'en dessous, gîtée : sa carène noire, la bande rouge, l'hélice, le projecteur
const QUILLE = [170, 70];
function coqueDessous(p) {
  const A = atelier(`${p}Q`);
  let s = gravure(A, [[50, 18], [292, 16], [284, 34], [252, 56], [170, 70], [100, 64], [62, 44]], C.coque, { seed: 740, amp: 0.6, angle: 70, tailles: 2, portee: 0.6, dy: 6, lumiere: [0, -1] });
  s += gravure(A, [[62, 44], [100, 64], [170, 70], [252, 56], [284, 34], [282, 42], [252, 64], [170, 78], [100, 72], [60, 50]], C.rouge, { seed: 741, amp: 0.4, tailles: 0, portee: 0, trait: 1.4, lumiere: [0, -1] });
  s += gravure(A, [[280, 38], [302, 56], [294, 64], [274, 46]], '#14100C', { seed: 742, amp: 0.2, tailles: 0, portee: 0.4, trait: 1.3 }) + `<circle cx="282" cy="52" r="4" fill="${C.ocre}" stroke="${ENCRE}" stroke-width="1.2"/>`;
  s += `<circle cx="128" cy="68" r="12" fill="${A.rad([[0, '#F4FFE0', 0.9], [1, '#F4FFE0', 0]], 128, 68, 12)}"/><circle cx="128" cy="68" r="4" fill="#FFFDE8" stroke="${ENCRE}" stroke-width="1.2"/>`;
  return A.out(s);
}
// le faisceau du projecteur : des cônes de lumière (peints flous)
const faisceau = p => { const A = atelier(`${p}B`); return A.out(`<path d="M128,68 L-10,440 L266,440 Z" fill="${A.lin([[0, '#F0FFD8', 0.5], [0.6, '#BFE8C0', 0.18], [1, '#BFE8C0', 0.02]], 128, 68, 130, 440)}"/><path d="M128,68 L64,440 L192,440 Z" fill="${A.lin([[0, '#FFFFF0', 0.55], [1, '#FFFFF0', 0]], 128, 68, 130, 440)}"/>`); };
// les racines du fond, immenses, perdues dans l'eau (peintes floues)
function racinesLoin(p) { const A = atelier(`${p}R`); return A.out([[[-60, 440], [40, 300], [110, 220], [178, 120], 120], [[470, 460], [380, 330], [330, 240], [276, 140], 110], [[200, 470], [230, 380], [300, 330], [350, 250], 70]].map(([a, b, c, d, w]) => `<path d="${chemin(racinePts(a, b, c, d, w).pts, true)}" fill="#0E2626"/>`).join('')); }
// l'onde du choc, et les bulles qui jaillissent de la quille
function choc(p) {
  const A = atelier(`${p}C`), [x, y] = QUILLE;
  // l'onde : un anneau plein, crème, hachuré, et un second, fin
  let s = gravure(A, [...ovale(x, y, 42, 42, 36), ...ovale(x, y, 32, 32, 36).reverse()], C.creme, { seed: 780, amp: 0.4, angle: 30, pas: 2.2, ombre: 0.4, tailles: 0, trait: 1.8, portee: 0.4, dx: 2, dy: 3 });
  s += trait(chemin(ovale(x, y, 24, 24, 26), true), 1.6, C.creme, 0.85);
  // les fissures qui rayonnent, les débris de la coque, une grappe de bulles pleines
  s += trait(Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2 + 0.2; return `M${f(x + Math.cos(a) * 8)},${f(y + Math.sin(a) * 8)} l${f(Math.cos(a + 0.3) * 8)},${f(Math.sin(a + 0.3) * 8)} l${f(Math.cos(a - 0.2) * 9)},${f(Math.sin(a - 0.2) * 9)}`; }).join(' '), 1.4, C.soufre, 0.9);
  for (let k = 0; k < 6; k++) { const a = Math.PI * 0.2 + k * 0.5, l = 48 + 14 * hash(k, 3), sx = x + Math.cos(a) * l, sy = y + Math.sin(a) * l * 0.7, t = 3 + 3 * hash(k, 4); s += gravure(A, [[sx - t, sy], [sx + t, sy - t * 0.6], [sx + t * 0.4, sy + t]], k % 2 ? C.coque : C.rouge, { seed: 782 + k, amp: 0.2, tailles: 0, trait: 1, portee: 0.4, dx: 1, dy: 1, pas: 1.6 }); }
  for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 + (hash(k, 71) - 0.5) * 3, v = 30 + hash(k, 73) * 50, cx = x + Math.cos(a) * v, cy = y + Math.sin(a) * v * 0.6 + 26, r = 2 + 3.4 * hash(k, 75); s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#8CC8B8" fill-opacity="0.5" stroke="${C.creme}" stroke-width="1.3"/><circle cx="${f(cx - r * 0.35)}" cy="${f(cy - r * 0.35)}" r="${f(r * 0.3)}" fill="#FFFFFF"/>`; }
  return A.out(s);
}
// ce qui vit sous l'eau : la neige marine qui dérive (trois nuées), les bulles qui remontent
function vivantSousEau() {
  let s = '';
  [[7, 0.5], [9, 0.35], [12, 0.22]].forEach(([dur, o], j) => {
    let pts = '';
    for (let i = 0; i < 24; i++) { const x = hash(i, 401 + j) * 420 - 10, y = hash(i, 411 + j) * 400, r = f(0.6 + 1.2 * hash(i, 421 + j)); pts += `<circle cx="${f(x)}" cy="${f(y)}" r="${r}"/><circle cx="${f(x)}" cy="${f(y + 400)}" r="${r}"/>`; }
    s += `<g fill="${C.creme}" opacity="${o}"><animateTransform attributeName="transform" type="translate" from="0 0" to="${-8 + 6 * j} -400" dur="${dur * 3}s" repeatCount="indefinite"/>${pts}</g>`;
  });
  for (let i = 0; i < 12; i++) { const x = f(96 + hash(i, 31) * 80), r = f(1.4 + hash(i, 33) * 2.6), d = f(1.8 + hash(i, 35) * 1.4); s += `<circle cx="${x}" cy="200" r="${r}" fill="none" stroke="${C.creme}" stroke-width="0.9" opacity="0.7"><animateTransform attributeName="transform" type="translate" from="0 0" to="${f(-8 + hash(i, 37) * 16)} -130" dur="${d}s" begin="${f(-hash(i, 39) * d)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.8;0" dur="${d}s" begin="${f(-hash(i, 39) * d)}s" repeatCount="indefinite"/></circle>`; }
  return s;
}
function racines01() {
  const p = 'tr', D = 3000, CHOC = 2450, m = { marge: MARGE };
  // les racines proches (base et pointe) ; la racine qui frappe : sa pose quand elle touche la quille
  const PRES = [
    { id: 'r1', base: [[-90, 380], [20, 330], [120, 310], [200, 240], 70, 34], bout: [[200, 240], [230, 214], [250, 200], [262, 176], 34, 2] },
    { id: 'r2', base: [[500, 360], [420, 300], [350, 320], [300, 280], 64, 30], bout: [[300, 280], [270, 256], [262, 236], [240, 226], 30, 2] },
    { id: 'r3', base: [[140, 500], [160, 430], [220, 410], [200, 340], 80, 36], bout: [[200, 340], [184, 312], [196, 292], [176, 270], 36, 2] }
  ];
  const FRAPPE = { base: [[-40, 440], [10, 360], [40, 300], [96, 240], 74, 40], bout: [[96, 240], [130, 180], [168, 130], [QUILLE[0], QUILLE[1] + 4], 40, 3] };
  const pieces = (id, R, prof, seed) => [
    { id, profondeur: prof, cadre: [-100, 40, 600, 480], pivot: R.base[0], dessin: () => racine(p, id, ...R.base.slice(0, 4), R.base[4], R.base[5], seed) },
    { id: `${id}-bout`, dans: id, cadre: [-100, 40, 600, 480], pivot: R.bout[0], dessin: () => racine(p, `${id}b`, ...R.bout.slice(0, 4), R.bout[4], R.bout[5], seed + 50) }
  ];
  const plans = [
    { id: 'fond', profondeur: 0.05, ...m, flou: 0.2, dessin: () => eauFond(p) },
    { id: 'loin', profondeur: 0.15, ...m, flou: 0.25, dessin: () => racinesLoin(p) },
    { id: 'surface', profondeur: 0.3, cadre: [G, G, D_ - G, 90], dessin: () => surface(p) },
    { id: 'coque', profondeur: 0.4, cadre: [40, 4, 272, 90], pivot: [170, 40], dessin: () => coqueDessous(p) },
    { id: 'faisceau', profondeur: 0.4, ...m, flou: 0.3, pivot: [128, 68], dessin: () => faisceau(p) },
    { id: 'anime', profondeur: 0.4, dessin: () => vivantSousEau() },
    ...PRES.flatMap((R, i) => pieces(R.id, R, 0.65, 800 + i * 10)),
    ...pieces('frappe', FRAPPE, 0.4, 860),
    { id: 'choc', profondeur: 0.4, cadre: [110, 10, 120, 120], pivot: QUILLE, dessin: () => choc(p) },
    { id: 'teinte', profondeur: 0, ...m, dessin: () => teinte(p) },
    { id: 'eclair', profondeur: 0, ...m, flou: 0.1, dessin: () => plein(null, '#E8FFF0') },
    { id: 'noir', profondeur: 0, ...m, flou: 0.1, dessin: () => plein(null, '#000') }
  ];
  const P = {
    coque: [[0, { r: -4, y: 0 }], [1100, { r: 3, y: 4 }], [2200, { r: -1, y: 8 }], [CHOC, { r: -1, y: 8, e: 'linear' }], [CHOC + 60, { r: 4, y: 0, e: 'linear' }], [CHOC + 140, { r: -3, y: 12, e: 'linear' }], [CHOC + 240, { r: 2, y: 6 }], [D, { r: 0, y: 10 }]],
    faisceau: [[0, { r: -12 }], [1400, { r: 8 }], [CHOC, { r: -4, o: 1 }], [CHOC + 40, { r: -4, o: 0.15, e: 'linear' }], [CHOC + 100, { r: -2, o: 0.9, e: 'linear' }], [CHOC + 160, { r: 0, o: 0.1, e: 'linear' }], [CHOC + 260, { r: 2, o: 0.7, e: 'linear' }], [D, { r: 4, o: 0.2 }]],
    frappe: [[0, { r: 40 }], [800, { r: 36 }], [1500, { r: 52, e: 'cubic-bezier(.75,0,1,1)' }], [CHOC, { r: 0, e: 'ease-out' }], [CHOC + 140, { r: -3 }], [D, { r: 0 }]],
    'frappe-bout': [[0, { r: 30 }], [1500, { r: 46, e: 'cubic-bezier(.75,0,1,1)' }], [CHOC, { r: 0, e: 'ease-out' }], [CHOC + 160, { r: -8 }], [D, { r: 0 }]],
    choc: [[0, { s: 0.2, o: 0 }], [CHOC - 1, { s: 0.2, o: 0, e: 'linear' }], [CHOC, { s: 0.3, o: 1, e: 'ease-out' }], [CHOC + 500, { s: 2.4, o: 0 }], [D, { s: 2.4, o: 0 }]],
    eclair: [[0, { o: 0 }], [CHOC - 1, { o: 0, e: 'linear' }], [CHOC + 60, { o: 0.45, e: 'ease-out' }], [CHOC + 350, { o: 0 }], [D, { o: 0 }]],
    noir: [[0, { o: 0 }], [CHOC + 150, { o: 0, e: 'ease-in' }], [D, { o: 1 }]]
  };
  PRES.forEach((R, i) => { P[R.id] = balance(0, D, 2200 + i * 400, k => ({ r: (k % 2 ? 1 : -1) * (1.6 + i * 0.4) })); P[`${R.id}-bout`] = balance(0, D, 1400 + i * 300, k => ({ r: (k % 2 ? -1 : 1) * (8 + i * 2) })); });
  const camera = [[0, { x: -6, y: 4, z: 1.02 }], [CHOC, { x: 0, y: 0, z: 1.08 }], ...secoue(CHOC, { x: 0, y: 0, z: 1.08 }, 8, 5), [D, { x: 0, y: 0, z: 1.1 }]];
  const pistes = {};
  for (const [id, cles] of Object.entries(P)) pistes[id] = parTemps([D], cles)[0];
  return { plans, partition: { temps: [{ duree: D, camera: parTemps([D], camera, ['x', 'y', 'z', 'r'])[0], pistes }] } };
}

// ——— 01_noir : les profondeurs ; ce qui reste de l'Hirondelle coule, très loin de la lumière ———
// le fond des profondeurs : un sarcelle presque noir, un dernier rai de lumière qui tombe de très haut (peint flou)
function profondeurs(p) {
  const A = atelier(`${p}F`);
  let s = plein(A, A.lin([[0, '#0E2422'], [0.4, '#061212'], [1, '#010303']], 0, G, 0, D_));
  s += `<path d="M150,${G} L250,${G} L300,440 L120,440 Z" fill="${A.lin([[0, '#8AC0A8', 0.2], [1, '#8AC0A8', 0]], 0, G, 0, 420)}"/>`;
  return A.out(s);
}
// l'épave qui coule, au loin : une silhouette gravée, pâle dans le rai de lumière
function epaveLoin(p) {
  const A = atelier(`${p}e`);
  return A.out(gravure(A, [[150, 150], [262, 128], [270, 138], [258, 168], [176, 186], [150, 172]], '#1C2E2C', { seed: 840, amp: 0.5, angle: 60, pas: 2.4, tailles: 1, trait: 1.6, portee: 0, encre: '#050A0A', lumiere: [0, -1] })
    + gravure(A, [[196, 128], [214, 124], [214, 98], [198, 102]], '#3A2422', { seed: 841, amp: 0.3, tailles: 0, trait: 1.3, portee: 0, encre: '#050A0A' }) + trait('M240,132 L232,92', 1.6, '#3A4A44'));
}
// un débris qui coule : le pavillon du gramophone, une bouée, une planche, une ampoule de la guirlande
function debris(p, i) {
  const A = atelier(`${p}d${i}`);
  const o = { amp: 0.3, tailles: 0, trait: 1.4, portee: 0, encre: '#050A0A', lumiere: [0, -1] };
  if (i === 0) return A.out(gravure(A, [[96, 236], [140, 210], [146, 222], [104, 246]], '#6A5428', { ...o, seed: 850, tailles: 1, tailleP: 2 }) + gravure(A, ovale(144, 216, 7, 13, 16, 0.5), '#4A3A1C', { ...o, seed: 851 }));
  if (i === 1) return A.out(gravure(A, ovale(300, 260, 16, 16, 20), '#6A5A48', { ...o, seed: 852 }) + `<circle cx="300" cy="260" r="7" fill="#081010" stroke="#050A0A" stroke-width="1"/>` + [0, 1, 2, 3].map(k => { const a = (k / 4) * Math.PI * 2 + 0.4; return `<path d="M${f(300 + Math.cos(a) * 8)},${f(260 + Math.sin(a) * 8)} L${f(300 + Math.cos(a) * 16)},${f(260 + Math.sin(a) * 16)}" stroke="#5A1E16" stroke-width="5"/>`; }).join(''));
  if (i === 2) return A.out(gravure(A, [[180, 300], [250, 288], [252, 294], [182, 306]], '#3A2C1C', { ...o, seed: 853 }));
  return A.out(`<circle cx="${70 + i * 40}" cy="${200 + i * 10}" r="3.4" fill="${['#8A6A2A', '#6A2A1E', '#2E5A58'][i % 3]}" stroke="#050A0A" stroke-width="1"/>`);
}
// ce qui vit dans les profondeurs : des bulles qui remontent, la neige marine
function vivantProfond() {
  let s = '';
  for (let i = 0; i < 12; i++) { const x = f(60 + hash(i, 61) * 280), r = f(1.2 + hash(i, 63) * 2.6), d = f(2.4 + hash(i, 65) * 2); s += `<circle cx="${x}" cy="380" r="${r}" fill="none" stroke="#8AC0A8" stroke-width="0.9" opacity="0.6"><animateTransform attributeName="transform" type="translate" from="0 0" to="${f(-10 + hash(i, 67) * 20)} -360" dur="${d}s" begin="${f(-hash(i, 69) * d)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.7;0" dur="${d}s" begin="${f(-hash(i, 69) * d)}s" repeatCount="indefinite"/></circle>`; }
  let neige = '';
  for (let i = 0; i < 30; i++) neige += `<circle cx="${f(hash(i, 71) * 400)}" cy="${f(hash(i, 72) * 400)}" r="${f(0.6 + hash(i, 73))}"/>`;
  return s + `<g fill="#8AC0A8" opacity="0.35"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 60" dur="6s" repeatCount="indefinite"/>${neige}</g>`;
}
function noir01() {
  const p = 'tn', D = 3000, m = { marge: MARGE };
  const plans = [
    { id: 'fond', profondeur: 0.05, ...m, flou: 0.2, dessin: () => profondeurs(p) },
    { id: 'epave', profondeur: 0.15, cadre: [140, 84, 140, 112], pivot: [210, 150], flou: 0.6, dessin: () => epaveLoin(p) },
    ...[0, 1, 2, 3, 4, 5].map(i => ({ id: `debris${i}`, profondeur: 0.3 + i * 0.05, cadre: [40, 160, 300, 170], pivot: [[120, 228], [300, 260], [216, 298], [190, 210], [230, 220], [270, 230]][i], dessin: () => debris(p, i) })),
    { id: 'anime', profondeur: 0.3, dessin: () => vivantProfond() },
    { id: 'teinte', profondeur: 0, ...m, dessin: () => teinte(p) }
  ];
  const P = { epave: [[0, { y: -10, r: -6 }], [D, { y: 30, r: 4, s: 0.85 }]] };
  [0, 1, 2, 3, 4, 5].forEach(i => { P[`debris${i}`] = [[0, { y: -40 - 20 * i, r: 0, o: 0.85 }], [D, { y: 70 + 10 * i, r: (i % 2 ? 1 : -1) * (30 + i * 15), o: 0.85 }]]; });
  const pistes = {};
  for (const [id, cles] of Object.entries(P)) pistes[id] = parTemps([D], cles)[0];
  return { plans, partition: { temps: [{ duree: D, camera: [[0, { z: 1.04 }], [D, { z: 1.1, y: 10 }]], pistes }] } };
}

module.exports = { pont01, vague01, racines01, noir01, valeur, parTemps, balance, secoue, bouffees, volute, bandeSpirale, teinte, plein, brume, lueur, navire, REPERES, C, MARGE, G, D_ };
