// La rencontre en gravures découpées (le style de l'ouverture, choix de l'auteur, 16 oct.) : on se voit enfin face à la
// mer au couchant (02_plage), puis le soleil couché, une lueur erre dans la brume (02_lueur). Même plage que la grève
// (gravure_plage.js : son ciel, son soleil, sa mer, son sable) ; l'avatar, posé par le jeu, prend sa place dans la pile
// des plans, sous l'étalonnage. Brume reste celle du jeu (brume.js : sa flamme pâle du stade 0, ses yeux, ses
// étincelles), cernée d'encre et hachurée du côté de l'ombre.
const { hash, f } = require('./ouverture');
const { courbe, spirale } = require('./papier');
const { atelier, gravure, trait, ovale, chemin, ENCRE } = require('./gravure');
const { volute, teinte, plein, C, MARGE, G, D_ } = require('./theatre_pont');
const { decor, ciel, nuage, mer, plage, vivant, premier, unTemps, HORIZON, RIVAGE } = require('./gravure_plage');
const { brumeFrame, flamePath } = require('./brume');

// ——— ce que la mer a rendu, près de l'avatar : une planche, une valise fermée, un morceau de coque blanche ———
function debris(p) {
  const A = atelier(`${p}d`);
  let s = gravure(A, [[268, 300], [338, 290], [340, 297], [270, 308]], C.brun, { seed: 400, amp: 0.3, tailles: 0, trait: 1.5, portee: 0.5, dy: 4 });
  s += gravure(A, [[22, 318], [62, 316], [60, 300], [24, 302]], '#7A4A28', { seed: 401, amp: 0.4, tailles: 1, portee: 0.5, dy: 4 }) + trait('M36,302 q6,-6 12,0', 2, ENCRE) + gravure(A, [[40, 300], [46, 300], [46, 318], [40, 318]], C.ocre, { seed: 402, amp: 0.1, tailles: 0, trait: 0.8, portee: 0 });
  s += gravure(A, [[318, 334], [380, 326], [376, 312], [322, 318]], C.creme, { seed: 403, amp: 0.4, tailles: 1, portee: 0.5, dy: 4 }) + gravure(A, [[320, 328], [378, 320], [377, 316], [321, 323]], C.rouge, { seed: 404, amp: 0.2, tailles: 0, trait: 0.9, portee: 0 }) + `<circle cx="346" cy="318" r="2.6" fill="#2C3A44" stroke="${ENCRE}" stroke-width="0.9"/>`;
  return A.out(s);
}
// la langue d'eau qui monte sur le sable mouillé et se retire : l'eau sarcelle, sa dentelle d'écume
function lechee(p) {
  const A = atelier(`${p}l`);
  const bord = courbe(t => [G + (D_ - G) * t, RIVAGE + 12 + 5 * Math.sin(t * 7 + 0.6) + 2 * Math.sin(t * 23)], 60);
  let s = gravure(A, [[G, RIVAGE - 6], [D_, RIVAGE - 6], ...bord.slice().reverse()], '#5A6A62', { seed: 410, amp: 0.3, angle: 4, pas: 3, ombre: 0.2, tailles: 0, portee: 0, trait: 1.2, lumiere: [0, -1] });
  s += gravure(A, [...bord, ...bord.slice().reverse().map(([x, y], k) => [x, y - 4 - 2 * Math.abs(Math.sin(k * 0.8))])], C.creme, { seed: 411, amp: 0.3, tailles: 0, noir: false, trait: 1.1, portee: 0.3 });
  return A.out(s);
}
// l'ombre de l'avatar, longue, vers nous (le soleil est devant lui) : un aplat d'encre hachuré, à ses pieds
function ombreLongue(p, [x, y], l = 70) {
  const A = atelier(`${p}o`);
  return A.out(gravure(A, [[x - 18, y - 2], [x + 16, y - 3], [x - l * 0.45, y + l], [x - l * 0.95, y + l * 0.9]], '#2A1A10', { seed: 420, amp: 0.4, angle: 50, pas: 2.6, ombre: 0, tailles: 0, trait: 0, portee: 0, noir: false }));
}
// le contre-jour : l'avatar, de dos face au soleil, a le dos dans l'ombre
const contreJour = (p, [x, y]) => { const A = atelier(`${p}j`); return A.out(plein(A, A.rad([[0, '#1A0E08', 0.3], [0.5, '#1A0E08', 0.12], [1, '#1A0E08', 0]], x, y - 90, 150))); };

// ——— 02_plage : de dos, face à la mer, au couchant ———
const PIEDS_PLAGE = [144, 376];
function plage02() {
  const p = 'rp', D = 6000;
  const plans = [
    ...decor(p),
    { id: 'lechee', profondeur: 0.55, marge: MARGE, dessin: () => lechee(p) },
    { id: 'anime', profondeur: 0.3, dessin: () => vivant() },
    { id: 'debris', profondeur: 0.62, marge: MARGE, dessin: () => debris(p) },
    { id: 'ombre', profondeur: 0.66, marge: MARGE, dessin: () => ombreLongue(p, PIEDS_PLAGE) },
    { id: 'avatar', profondeur: 0.66 },
    { id: 'contre-jour', profondeur: 0.66, marge: MARGE, dessin: () => contreJour(p, PIEDS_PLAGE) },
    { id: 'premier', profondeur: 1, marge: MARGE, flou: 0.3, dessin: () => premier(p) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  const P = {
    soleil: [[0, { r: 0, y: 0 }], [D, { r: 16, y: 6 }]],
    lechee: [[0, { y: -10 }], [2200, { y: 8, e: 'ease-in-out' }], [4400, { y: -6, e: 'ease-in-out' }], [D, { y: 4 }]],
    ombre: [[0, { o: 0.55 }], [D, { o: 0.55 }]]
  };
  const camera = [[0, { x: 12, y: -6, z: 1.14 }], [D, { x: 0, y: 0, z: 1.06, e: 'ease-out' }]];
  return { plans, partition: { temps: [unTemps(D, camera, P)], repos: { duree: 9000, camera: { x: -5, y: 2, z: 0.02 }, pistes: { lechee: [2600, { y: 12 }], soleil: [9000, { r: 6 }] } } } };
}

// ——— 02_lueur : le soleil couché, la brume couvre la plage ; une lueur y erre ———
// le crépuscule qui tombe sur le ciel, la mer et le sable : le violet sarcelle d'en haut, plus léger à l'horizon
const crepuscule = p => { const A = atelier(`${p}k`); return A.out(plein(A, A.lin([[0, '#14183A', 0.62], [0.4, '#2A2448', 0.42], [0.55, '#3A2A48', 0.22], [1, '#1A1628', 0.42]], 0, G, 0, D_))); };
// la brume : un voile peint (flou), qui s'épaissit au milieu de sa bande et s'efface en haut et en bas
const voile = (p, i, y, h, op = 0.6) => { const A = atelier(`${p}v${i}`); return A.out(plein(A, A.lin([[0, '#C8C4DC', 0], [0.5, '#C8C4DC', op], [1, '#B4B0CC', 0]], 0, y - h, 0, y + h))); };
// des filets de brume en papier découpé : de longs rubans fins qui ondulent, épais au milieu, leurs bouts roulés en
// volutes ; ils prennent la lumière froide de Brume par dessous. l : [x0, y, longueur, amplitude, épaisseur]
function filets(p, i, liste) {
  const A = atelier(`${p}f${i}`);
  let s = '';
  liste.forEach(([x0, y, l, a, w], k) => {
    const axe = t => [x0 + l * t, y + a * Math.sin(Math.PI * 2 * (t * 1.2 + k * 0.37))], ep = t => w * Math.sin(Math.PI * t) ** 0.6 + 0.6;
    const pts = courbe(t => t, 40).map(t => { const [x, yy] = axe(t), [x2, y2] = axe(Math.min(1, t + 0.01)), [x1, y1] = axe(Math.max(0, t - 0.01)), l2 = Math.hypot(x2 - x1, y2 - y1) || 1; return [x, yy, -(y2 - y1) / l2, (x2 - x1) / l2, ep(t)]; });
    s += gravure(A, [...pts.map(([x, yy, nx, ny, e]) => [x + nx * e, yy + ny * e]), ...pts.slice().reverse().map(([x, yy, nx, ny, e]) => [x - nx * e * 0.6, yy - ny * e * 0.6])], A.lin([[0, '#E2DCEA'], [1, '#A8A4C2']], 0, y - w, 0, y + w), { seed: 440 + i * 7 + k, amp: 0.3, angle: 8, pas: 2.6, ombre: 0.2, tailles: 0, trait: 1.3, portee: 0, lumiere: [0, 1] });
    const [ax, ay] = axe(0), [bx, by] = axe(1);
    s += volute(ax + 2, ay - 5, 5 + w * 0.3, -1, 1.5, 1.3) + volute(bx - 2, by - 5, 5 + w * 0.3, 1, 1.5, 1.3);
  });
  return A.out(s);
}
// Brume, l'image n de son tremblement (stade 0, pâle) : sa flamme et ses yeux tels que le jeu les dessine, un cerne
// d'encre épais autour, des hachures fines du côté de l'ombre (à droite)
function brumeGravee(pref, n, expr = 'neutre') {
  const r = 8, ph = (n % 4) / 4, sway = Math.sin(ph * Math.PI * 2) * r * 0.32, jit = [[0, 0], [0.5, -0.2], [-0.4, 0.2], [0.3, 0.3]][n % 4];
  const x = 20 + jit[0], y = 32 + [0, -0.6, -1, -0.6][n % 4] + jit[1], contour = flamePath(x, y, r, sway), id = `${pref}${n}`;
  const hach = Array.from({ length: 9 }, (_, k) => `M${f(x - 2 + k * 1.6)},${f(y + r + 2)} l${f(8)},${f(-22)}`).join(' ');
  return `<path d="${contour}" fill="none" stroke="${ENCRE}" stroke-width="2.6" stroke-linejoin="round"/>`
    + brumeFrame('s0', n, expr).replace(/bhs0(\d)/g, `${id}h$1`)
    + `<defs><clipPath id="${id}c"><path d="${contour}"/></clipPath></defs><g clip-path="url(#${id}c)"><path d="${hach}" fill="none" stroke="#6E8792" stroke-width="0.45" opacity="0.7"/></g>`;
}
// Brume qui erre (10 s en boucle) : elle va, s'arrête, hésite, repart ; ses trois images tremblent (0, 1, 2, 1), elle
// cligne des yeux ; son halo froid, sa lumière sur le sable mouillé ; quelques volutes qui se dessinent dans le ciel
const ERRANCE = { pts: [[288, 232], [288, 232], [258, 222], [258, 222], [270, 214], [234, 230], [234, 230], [250, 238], [288, 232]], kts: [0, 0.12, 0.3, 0.42, 0.5, 0.66, 0.78, 0.88, 1] };
const va = (pts, dur, y = true) => `<animateTransform attributeName="transform" type="translate" values="${pts.map(([a, b]) => `${f(a)} ${y ? f(b) : 0}`).join(';')}" keyTimes="${ERRANCE.kts.join(';')}" calcMode="spline" keySplines="${Array(pts.length - 1).fill('0.45 0 0.55 1').join(';')}" dur="${dur}s" repeatCount="indefinite"/>`;
function lueurVive(p) {
  const { pts } = ERRANCE, ordre = [0, 1, 2, 1];
  const images = [0, 1, 2].map(n => `<g opacity="${n ? 0 : 1}"><animate attributeName="opacity" values="${ordre.map(k => (k === n ? 1 : 0)).join(';')}" keyTimes="0;0.25;0.5;0.75" calcMode="discrete" dur="0.84s" repeatCount="indefinite"/>${brumeGravee(`${p}v`, n)}</g>`).join('');
  const cligne = `<g><animate attributeName="opacity" values="1;0;1" keyTimes="0;0.62;0.653" calcMode="discrete" dur="4.2s" repeatCount="indefinite"/>${images}</g><g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.62;0.653" calcMode="discrete" dur="4.2s" repeatCount="indefinite"/>${brumeGravee(`${p}k`, 0, 'cligne')}</g>`;
  let s = `<defs><radialGradient id="${p}H"><stop offset="0" stop-color="#E4F6FF" stop-opacity="0.6"/><stop offset="0.35" stop-color="#BFE2F6" stop-opacity="0.26"/><stop offset="1" stop-color="#BFE2F6" stop-opacity="0"/></radialGradient><radialGradient id="${p}F"><stop offset="0" stop-color="#D8F0FF" stop-opacity="0.5"/><stop offset="1" stop-color="#D8F0FF" stop-opacity="0"/></radialGradient></defs>`;
  // (sa lumière sur le sable : elle la suit de côté, au ras de l'eau)
  s += `<g>${va(pts, 10, false)}<ellipse cx="0" cy="${RIVAGE + 8}" rx="46" ry="11" fill="url(#${p}F)"/></g>`;
  s += `<g>${va(pts, 10)}<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="1.7s" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" repeatCount="indefinite"/><circle cx="0" cy="-8" r="54" fill="url(#${p}H)"/><g transform="scale(1.4) translate(-20 -32)">${cligne}</g></g></g>`;
  for (const [x, y, r, sens, dur, beg] of [[70, 56, 8, 1, 6, 0], [190, 34, 6, -1, 7, 2.5], [340, 64, 7, 1, 6.5, 4]]) s += `<path d="${spirale(x, y, r, sens, 1.6)}" fill="none" stroke="${ENCRE}" stroke-width="2.4" stroke-linecap="round" opacity="0.6" stroke-dasharray="140" stroke-dashoffset="140"><animate attributeName="stroke-dashoffset" values="140;0;0;-140" keyTimes="0;0.4;0.7;1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path>`;
  return s;
}
// la lumière froide de Brume sur la scène (devant l'avatar : elle l'éclaire aussi, de côté)
const lumiereFroide = p => { const A = atelier(`${p}f`); return A.out(plein(A, A.rad([[0, '#CFE8F4', 0.16], [0.5, '#9AB8D0', 0.06], [1, '#9AB8D0', 0]], 262, 228, 220))); };
const PIEDS_LUEUR = [120, 384];
function lueur02() {
  const p = 'rl', D = 5200;
  const plans = [
    { id: 'ciel', profondeur: 0.1, marge: MARGE, flou: 0.2, dessin: () => ciel(p) },
    { id: 'nuage0', profondeur: 0.14, cadre: [-80, 24, 600, 60], dessin: () => nuage(p, 0, 60, 18, '#5A4A58') },
    { id: 'nuage1', profondeur: 0.18, cadre: [-80, 100, 600, 56], dessin: () => nuage(p, 1, 134, 14, '#7A5A58', -40, 480) },
    { id: 'mer', profondeur: 0.3, marge: MARGE, dessin: () => mer(p, false) },
    { id: 'plage', profondeur: 0.55, marge: MARGE, dessin: () => plage(p) },
    { id: 'crepuscule', profondeur: 0, marge: MARGE, dessin: () => crepuscule(p) },
    { id: 'voile0', profondeur: 0.32, marge: MARGE, flou: 0.2, dessin: () => voile(p, 0, HORIZON + 10, 22, 0.75) },
    { id: 'filets0', profondeur: 0.34, cadre: [-100, HORIZON - 20, 600, 50], dessin: () => filets(p, 0, [[-40, HORIZON + 8, 190, 3, 5], [170, HORIZON + 14, 250, 4, 6]]) },
    { id: 'voile1', profondeur: 0.48, marge: MARGE, flou: 0.2, dessin: () => voile(p, 1, 238, 30, 0.6) },
    { id: 'anime', profondeur: 0.52, dessin: () => lueurVive(p) },
    { id: 'filets1', profondeur: 0.56, cadre: [-100, 210, 600, 70], dessin: () => filets(p, 1, [[-30, 244, 200, 5, 7], [200, 254, 230, 4, 8], [90, 232, 160, 3, 5]]) },
    { id: 'avatar', profondeur: 0.7 },
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => lumiereFroide(p) },
    { id: 'voile2', profondeur: 0.85, marge: MARGE, flou: 0.2, dessin: () => voile(p, 2, 396, 34, 0.55) },
    { id: 'filets2', profondeur: 0.9, cadre: [-100, 340, 600, 80], dessin: () => filets(p, 2, [[-60, 362, 240, 5, 9], [220, 372, 240, 6, 10]]) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  const P = {
    filets0: [[0, { o: 0.85, x: 0 }], [D, { o: 0.85, x: -16 }]],
    filets1: [[0, { o: 0.8, x: -12 }], [D, { o: 0.8, x: 16 }]],
    filets2: [[0, { o: 0.7, x: -24 }], [D, { o: 0.7, x: 12 }]],
    voile2: [[0, { o: 0.9 }], [D, { o: 0.9 }]]
  };
  const camera = [[0, { x: -6, y: 4, z: 1.1 }], [D, { x: 4, y: 0, z: 1.14, e: 'ease-out' }]];
  return { plans, partition: { temps: [unTemps(D, camera, P)], repos: { duree: 10000, camera: { x: 5, y: -2, z: 0.02 }, pistes: { filets0: [12000, { x: 14 }], filets1: [9000, { x: -24 }], filets2: [8000, { x: 22 }] } } } };
}

module.exports = { plage02, lueur02 };
