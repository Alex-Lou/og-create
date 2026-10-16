// La rencontre en gravures découpées (le style de l'ouverture, choix de l'auteur, 16 oct.) : on se voit enfin face à la
// mer au couchant (02_plage) ; le soleil se couche et la brume monte, une lueur y erre près d'un rocher (02_lueur) ;
// elle fonce sur l'avatar (02_approche), puis sursaute et file derrière le rocher, d'où elle passe la tête (02_rocher).
// Même plage que la grève (gravure_plage.js : son ciel, son soleil, sa mer, son sable). Le temps passe d'une bulle à
// l'autre sans saut (soir : le soleil descend, le crépuscule tombe, la brume monte du large) ; chaque scène repart d'où
// la précédente l'a laissé. L'avatar, posé par le jeu, prend sa place dans la pile des plans, sous l'étalonnage.
// Brume reste celle du jeu (brume.js : sa flamme pâle du stade 0, ses yeux, ses étincelles), cernée d'encre et
// hachurée du côté de l'ombre.
const { hash, f } = require('./ouverture');
const { courbe, spirale } = require('./papier');
const { atelier, gravure, trait, ovale, ENCRE } = require('./gravure');
const { volute, teinte, plein, secoue, C, MARGE, G, D_ } = require('./theatre_pont');
const { decor, ciel, nuage, mer, plage, vivant, premier, unTemps, HORIZON, RIVAGE } = require('./gravure_plage');
const { brumeFrame, flamePath } = require('./brume');

// ——— le décor ———
// ce que la mer a rendu, près de l'avatar : une valise fermée, une planche, un morceau de coque blanche
function debris(p) {
  const A = atelier(`${p}d`);
  let s = gravure(A, [[226, 338], [288, 330], [290, 337], [228, 346]], C.brun, { seed: 400, amp: 0.3, tailles: 0, trait: 1.5, portee: 0.5, dy: 4 });
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
// le crépuscule qui tombe sur le ciel, la mer et le sable : le violet sarcelle d'en haut, plus léger à l'horizon
const crepuscule = p => { const A = atelier(`${p}k`); return A.out(plein(A, A.lin([[0, '#14183A', 0.62], [0.4, '#2A2448', 0.42], [0.55, '#3A2A48', 0.22], [1, '#1A1628', 0.42]], 0, G, 0, D_))); };
// la brume : un voile peint (flou), qui s'épaissit au milieu de sa bande et s'efface en haut et en bas
const voile = (p, i, y, h, op = 0.6) => { const A = atelier(`${p}v${i}`); return A.out(plein(A, A.lin([[0, '#C8C4DC', 0], [0.35, '#CCD2E8', op * 0.85], [0.5, '#D2DCEE', op], [0.7, '#C4C6DE', op * 0.8], [1, '#B4B0CC', 0]], 0, y - h, 0, y + h))); };
// des escarbilles de lumière froide qui dérivent dans la brume, et scintillent (calque anime : deux animations chacune)
const escarbilles = () => [[60, 300, 7], [150, 226, 9], [236, 330, 8], [300, 212, 10], [388, 290, 7.5], [110, 350, 8.5]].map(([x, y, d], i) => `<circle cx="${x}" cy="${y}" r="${f(1.2 + hash(i, 3))}" fill="#E8F6FF" opacity="0"><animate attributeName="opacity" values="0;0.9;0.3;0.8;0" dur="${f(d * 0.6)}s" begin="${f(-hash(i, 5) * d)}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;${f(14 - 28 * hash(i, 7))} -16;${f(10 - 20 * hash(i, 9))} -30" dur="${f(d)}s" begin="${f(-hash(i, 11) * d)}s" repeatCount="indefinite"/></circle>`).join('');
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
// le rocher où Brume se cachera : un gros bloc à moitié enfoui sur la plage (le même dans les quatre scènes et dans
// 03_livre : au loin dans 02_plage, on s'en approche dans 02_lueur) ; aux couleurs du soir, sa face du haut plus claire,
// son flanc droit dans l'ombre, ses fissures, sa mousse
const BLOC = [[164, 306], [156, 262, 176, 232], [190, 206, 214, 204], [236, 190, 262, 198], [296, 204, 312, 232], [330, 262, 326, 306], [290, 316, 244, 314], [196, 316, 164, 306]];
const blocPts = () => { const pts = []; let [x0, y0] = BLOC[0]; for (const [cx, cy, x, y] of BLOC.slice(1)) { for (let i = 1; i <= 8; i++) { const t = i / 8, u = 1 - t; pts.push([u * u * x0 + 2 * u * t * cx + t * t * x, u * u * y0 + 2 * u * t * cy + t * t * y]); } [x0, y0] = [x, y]; } return pts; };
function rocher(p) {
  const A = atelier(`${p}r`);
  let s = gravure(A, blocPts(), A.lin([[0, '#857D88'], [1, '#3E3846']], 0, 190, 0, 316), { seed: 460, amp: 0.6, angle: 40, pas: 2.8, ombre: 0.45, tailles: 2, tailleP: 5, trait: 2.2, portee: 0.5, dy: 6, lumiere: [-0.6, -0.8] });
  s += gravure(A, [[178, 232], [190, 208], [214, 205], [236, 192], [262, 199], [294, 206], [310, 232], [286, 238], [254, 222], [222, 230], [196, 244]], '#9A92A0', { seed: 461, amp: 0.4, angle: 20, pas: 2.6, ombre: 0.3, tailles: 1, trait: 1.2, portee: 0, lumiere: [-0.6, -0.8] });
  s += gravure(A, [[286, 238], [310, 232], [324, 262], [324, 304], [292, 311], [278, 280]], '#2E2834', { seed: 462, amp: 0.4, angle: 70, pas: 2.4, ombre: 0.2, tailles: 0, trait: 1.2, portee: 0 });
  s += trait('M226,206 q4,20 -2,40 q-4,16 4,30 M290,240 q-6,14 0,28 M190,250 q10,6 12,22', 1.6, ENCRE);
  for (const [x, y, r] of [[250, 270, 7], [282, 252, 5], [198, 284, 6], [300, 290, 4]]) s += gravure(A, ovale(x, y, r, r * 0.6, 12), '#5E6A3E', { seed: 463 + x, amp: 0.3, tailles: 0, trait: 0.9, portee: 0, pas: 1.8 });
  return A.out(s + volute(236, 224, 6, 1, 1.5, 1.4));
}
// la lumière froide de Brume sur l'arête du rocher, de son côté
const reflet = (p, d) => { const A = atelier(`${p}e`); return A.out(trait(d, 1.6, '#DFF4FF', 0.5) + trait(d, 5, '#DFF4FF', 0.1)); };
const ARETE_DROITE = 'M300,214 Q312,232 318,248 Q328,272 326,300', ARETE_HAUT = 'M196,212 Q212,203 226,200 Q244,192 262,198';
// la lumière froide de Brume sur la scène, autour d'elle (devant l'avatar : elle l'éclaire aussi, de côté)
const lumiereFroide = (p, [x, y]) => { const A = atelier(`${p}f`); return A.out(plein(A, A.rad([[0, '#CFE8F4', 0.18], [0.5, '#9AB8D0', 0.06], [1, '#9AB8D0', 0]], x, y, 220))); };

// ——— le soir qui tombe (k : 0 au couchant de 02_plage, 1 la brume et le crépuscule de 02_lueur) : l'état de chaque
// plan qui en dépend ———
const borne = v => Math.max(0, Math.min(1, v));
const soir = k => ({
  soleil: { y: 6 + 64 * k, r: 16 + 24 * k },
  mer: { o: borne(1 - k * 1.4) },
  crepuscule: { o: k },
  voile0: { o: borne(k * 1.6) },
  'voile-mer': { o: borne((k - 0.15) / 0.6) },
  filets0: { o: 0.85 * borne(k * 1.6 - 0.1), x: -16 * k },
  voile1: { o: borne((k - 0.45) / 0.55) },
  filets1: { o: 0.8 * borne((k - 0.5) / 0.5), x: -12 + 28 * k },
  voile3: { o: borne((k - 0.25) / 0.6) },
  filets3: { o: 0.75 * borne((k - 0.35) / 0.55), x: 18 - 30 * k },
  voile2: { o: 0.9 * borne((k - 0.6) / 0.4) },
  filets2: { o: 0.7 * borne((k - 0.65) / 0.35), x: -24 + 36 * k },
  ombre: { o: 0.55 * borne(1 - k * 1.5) },
  'contre-jour': { o: borne(1 - k * 1.2) }
});
// les pistes d'un temps où le soir passe de k0 à k1 (seulement les plans de la scène)
const soirDe = (plans, D, k0, k1) => { const a = soir(k0), b = soir(k1), ids = new Set(plans.map(q => q.id)), P = {}; for (const id of Object.keys(a)) if (ids.has(id)) P[id] = [[0, a[id]], [D, { ...b[id], e: 'ease-in-out' }]]; return P; };
// les plans du décor du soir, communs aux quatre scènes : le ciel, le soleil, les nuages, la mer (la nuit, puis celle
// au chemin d'or, qui s'efface), la plage, le crépuscule, la brume du large
const ROC_PIVOT = [244, 310], ROC_LOIN = { x: 106, y: -42, s: 0.3 }, ROC_PRES = { x: 0, y: 0, s: 1 };
const decorSoir = (p, avantRocher = []) => [
  ...decor(p).filter(q => q.id !== 'mer' && q.id !== 'plage'),
  { id: 'mer-soir', profondeur: 0.3, marge: MARGE, dessin: () => mer(p, false) },
  { id: 'mer', profondeur: 0.3, marge: MARGE, dessin: () => mer(p) },
  { id: 'plage', profondeur: 0.55, marge: MARGE, dessin: () => plage(p) },
  { id: 'lechee', profondeur: 0.55, marge: MARGE, dessin: () => lechee(p) },
  { id: 'crepuscule', profondeur: 0, marge: MARGE, dessin: () => crepuscule(p) },
  { id: 'voile0', profondeur: 0.32, marge: MARGE, flou: 0.2, dessin: () => voile(p, 0, HORIZON + 6, 34, 0.92) },
  { id: 'voile-mer', profondeur: 0.34, marge: MARGE, flou: 0.2, dessin: () => voile(p, 4, 222, 40, 0.72) },
  { id: 'filets0', profondeur: 0.36, cadre: [-100, HORIZON - 24, 600, 60], dessin: () => filets(p, 0, [[-40, HORIZON + 6, 200, 3, 7], [150, HORIZON + 14, 270, 4, 8], [40, HORIZON + 24, 180, 3, 6]]) },
  { id: 'voile1', profondeur: 0.48, marge: MARGE, flou: 0.2, dessin: () => voile(p, 1, 240, 38, 0.74) },
  { id: 'filets1', profondeur: 0.5, cadre: [-100, 206, 600, 70], dessin: () => filets(p, 1, [[-30, 234, 210, 4, 9], [180, 246, 250, 4, 10], [60, 222, 170, 3, 7]]) },
  ...avantRocher,
  { id: 'rocher', profondeur: 0.6, cadre: [140, 180, 200, 150], pivot: ROC_PIVOT, dessin: () => rocher(p) },
  // (la brume au ras du sable, au pied du rocher, entre la mer et l'avatar)
  { id: 'voile3', profondeur: 0.62, marge: MARGE, flou: 0.2, dessin: () => voile(p, 3, 322, 46, 0.74) },
  { id: 'filets3', profondeur: 0.64, cadre: [-100, 280, 600, 80], dessin: () => filets(p, 3, [[-50, 306, 240, 4, 10], [180, 320, 260, 5, 11], [70, 336, 200, 4, 8]]) }
];
// la brume du premier plan, aux pieds de l'avatar
const brumeDevant = p => [
  { id: 'voile2', profondeur: 0.85, marge: MARGE, flou: 0.2, dessin: () => voile(p, 2, 398, 42, 0.64) },
  { id: 'filets2', profondeur: 0.9, cadre: [-100, 336, 600, 90], dessin: () => filets(p, 2, [[-60, 362, 250, 5, 11], [210, 374, 250, 6, 12]]) }
];
const lecheeVa = D => [[0, { y: -10 }], [D * 0.4, { y: 8, e: 'ease-in-out' }], [D * 0.8, { y: -6, e: 'ease-in-out' }], [D, { y: 2 }]];

// ——— 02_plage : de dos, face à la mer, au couchant ; à chaque pensée, le soleil descend, la brume monte du large ———
const PIEDS_PLAGE = [144, 376];
function plage02() {
  const p = 'rp';
  const plans = [
    ...decorSoir(p),
    { id: 'anime', profondeur: 0.3, dessin: () => vivant() },
    { id: 'debris', profondeur: 0.62, marge: MARGE, dessin: () => debris(p) },
    { id: 'ombre', profondeur: 0.66, marge: MARGE, dessin: () => ombreLongue(p, PIEDS_PLAGE) },
    { id: 'avatar', profondeur: 0.66 },
    { id: 'contre-jour', profondeur: 0.66, marge: MARGE, dessin: () => contreJour(p, PIEDS_PLAGE) },
    ...brumeDevant(p),
    { id: 'premier', profondeur: 1, marge: MARGE, flou: 0.3, dessin: () => premier(p) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  // (une pensée par temps : le soir de k0 à k1 ; la caméra s'approche, puis dérive à peine ; les reflets s'éteignent)
  const SOIR = [[0, 0.06, 6000], [0.06, 0.16, 5000], [0.16, 0.3, 5000], [0.3, 0.44, 5000], [0.44, 0.6, 5000]];
  const cam = [{ x: 12, y: -6, z: 1.14 }, { x: 0, y: 0, z: 1.06 }, { x: -2, y: 0, z: 1.065 }, { x: -3, y: 1, z: 1.07 }, { x: -2, y: 1, z: 1.075 }, { x: 0, y: 0, z: 1.08 }];
  const temps = SOIR.map(([k0, k1, D], n) => unTemps(D, [[0, cam[n]], [D, { ...cam[n + 1], e: n ? 'ease-in-out' : 'ease-out' }]], { ...soirDe(plans, D, k0, k1), lechee: lecheeVa(D), rocher: [[0, ROC_LOIN], [D, ROC_LOIN]], anime: [[0, { o: borne(1 - k0 * 1.3) }], [D, { o: borne(1 - k1 * 1.3) }]] }));
  return { plans, partition: { temps, repos: { duree: 9000, camera: { x: -5, y: 2, z: 0.02 }, pistes: { lechee: [2600, { y: 12 }] } } } };
}

// ——— Brume ———
// l'image n de son tremblement (stade 0, pâle) : sa flamme et ses yeux tels que le jeu les dessine, un cerne d'encre
// épais autour, des hachures fines du côté de l'ombre (à droite)
function brumeGravee(pref, n, expr = 'neutre') {
  const r = 8, ph = (n % 4) / 4, sway = Math.sin(ph * Math.PI * 2) * r * 0.32, jit = [[0, 0], [0.5, -0.2], [-0.4, 0.2], [0.3, 0.3]][n % 4];
  const x = 20 + jit[0], y = 32 + [0, -0.6, -1, -0.6][n % 4] + jit[1], contour = flamePath(x, y, r, sway), id = `${pref}${n}`;
  const hach = Array.from({ length: 9 }, (_, k) => `M${f(x - 2 + k * 1.6)},${f(y + r + 2)} l${f(8)},${f(-22)}`).join(' ');
  return `<path d="${contour}" fill="none" stroke="${ENCRE}" stroke-width="2.6" stroke-linejoin="round"/>`
    + brumeFrame('s0', n, expr).replace(/bhs0(\d)/g, `${id}h$1`)
    + `<defs><clipPath id="${id}c"><path d="${contour}"/></clipPath></defs><g clip-path="url(#${id}c)"><path d="${hach}" fill="none" stroke="#6E8792" stroke-width="0.45" opacity="0.7"/></g>`;
}
// son halo froid (centré au milieu de sa flamme, en unités de la scène)
const HALO = p => `<radialGradient id="${p}H"><stop offset="0" stop-color="#E4F6FF" stop-opacity="0.6"/><stop offset="0.35" stop-color="#BFE2F6" stop-opacity="0.26"/><stop offset="1" stop-color="#BFE2F6" stop-opacity="0"/></radialGradient>`;
// Brume vivante (calque anime) : ses trois images tremblent (0, 1, 2, 1), elle cligne des yeux ; à l'échelle s, le bas
// de sa flamme en (0, 0)
function brumeVive(pref, s, expr = 'neutre', cligne = [4.2, 2.6]) {
  const ordre = [0, 1, 2, 1], [per, t0] = cligne, kc = `0;${f(t0 / per)};${f((t0 + 0.14) / per)}`;
  const images = [0, 1, 2].map(n => `<g opacity="${n ? 0 : 1}"><animate attributeName="opacity" values="${ordre.map(k => (k === n ? 1 : 0)).join(';')}" keyTimes="0;0.25;0.5;0.75" calcMode="discrete" dur="0.84s" repeatCount="indefinite"/>${brumeGravee(`${pref}v`, n, expr)}</g>`).join('');
  return `<g transform="scale(${s}) translate(-20 -32)"><g><animate attributeName="opacity" values="1;0;1" keyTimes="${kc}" calcMode="discrete" dur="${per}s" repeatCount="indefinite"/>${images}</g><g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="${kc}" calcMode="discrete" dur="${per}s" repeatCount="indefinite"/>${brumeGravee(`${pref}k`, 0, 'cligne')}</g></g>`;
}
// Brume en une image (une pièce que le jeu déplace d'un coup : la ruée, le sursaut) : son halo, sa flamme, ses yeux
const brumePiece = (p, [x, y], s, expr) => { const A = atelier(`${p}`); return A.out(`<defs>${HALO(p)}</defs><circle cx="${x}" cy="${f(y - 8 * s / 1.4)}" r="${f(38 * s / 1.4 + 16)}" fill="url(#${p}H)"/><g transform="translate(${x} ${y}) scale(${s}) translate(-20 -32)">${brumeGravee(`${p}b`, 0, expr)}</g>`); };
// la flaque de sa lumière sur le sable
const flaque = (p, [x, y], rx) => `<defs><radialGradient id="${p}F"><stop offset="0" stop-color="#D8F0FF" stop-opacity="0.5"/><stop offset="1" stop-color="#D8F0FF" stop-opacity="0"/></radialGradient></defs><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${f(rx * 0.24)}" fill="url(#${p}F)"/>`;
const spirales = () => [[70, 56, 8, 1, 6, 0], [190, 34, 6, -1, 7, 2.5], [340, 64, 7, 1, 6.5, 4]].map(([x, y, r, sens, dur, beg]) => `<path d="${spirale(x, y, r, sens, 1.6)}" fill="none" stroke="${ENCRE}" stroke-width="2.4" stroke-linecap="round" opacity="0.6" stroke-dasharray="140" stroke-dashoffset="140"><animate attributeName="stroke-dashoffset" values="140;0;0;-140" keyTimes="0;0.4;0.7;1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path>`).join('');

// ——— 02_lueur : l'avatar a avancé jusqu'au rocher (vu au loin dans 02_plage) ; le soleil finit de se coucher, la
// brume monte ; au large, un point de lumière palpite, dérive vers la plage en grandissant, hésite, et se pose au-dessus du sable, à côté du rocher : Brume
const PRES_ROCHER = [352, 262];
// (posée : elle flotte, tremble, cligne des yeux ; sa lumière sur le sable ; le repos la balance doucement)
function lueurVive(p) {
  const [x, y] = PRES_ROCHER;
  let s = `<defs>${HALO(p)}</defs>${flaque(p, [x, y + 36], 42)}`;
  s += `<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="1.7s" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" repeatCount="indefinite"/><circle cx="0" cy="-8" r="54" fill="url(#${p}H)"/>${brumeVive(p, 1.4)}</g></g>`;
  return s + spirales() + escarbilles();
}
function lueur02() {
  const p = 'rl';
  const plans = [
    ...decorSoir(p),
    { id: 'reflet', profondeur: 0.6, cadre: [140, 180, 200, 150], dessin: () => reflet(p, ARETE_DROITE) },
    { id: 'venue', profondeur: 0.6, marge: MARGE, pivot: PRES_ROCHER, dessin: () => brumePiece(`${p}w`, PRES_ROCHER, 1.4, 'curieuse') },
    { id: 'anime', profondeur: 0.6, dessin: () => lueurVive(p) },
    { id: 'avatar', profondeur: 0.7 },
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => lumiereFroide(p, PRES_ROCHER) },
    ...brumeDevant(p),
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  const D0 = 3600, D1 = 4000, POSE = D0 - 200, c0 = { x: 0, y: 0, z: 1.06 }, c1 = { x: 4, y: 2, z: 1.12 }, c2 = { x: 2, y: 2, z: 1.13 };
  // (sa venue : un point au large, qui palpite, dérive vers la plage en grandissant, recule un peu, et se pose)
  const venue = [[0, { x: -64, y: -66, s: 0.18, o: 0 }], [300, { x: -64, y: -66, s: 0.18, o: 0, e: 'ease-out' }], [600, { x: -64, y: -66, s: 0.22, o: 1 }], [950, { x: -62, y: -64, s: 0.18, o: 0.5 }], [1300, { x: -58, y: -62, s: 0.24, o: 1 }],
    [2000, { x: -38, y: -46, s: 0.36, o: 1, e: 'ease-in-out' }], [2450, { x: -14, y: -26, s: 0.62, e: 'ease-out' }], [2800, { x: -24, y: -22, s: 0.6, e: 'ease-in-out' }], [POSE, { x: 0, y: 0, s: 1, o: 1, e: 'ease-in-out' }], [D0 - 1, { x: 0, y: 0, s: 1, o: 1, e: 'linear' }], [D0, { o: 0 }]];
  const pose = [[0, { o: 0 }], [D0 - 1, { o: 0, e: 'linear' }], [D0, { o: 1 }]], luit = [[0, { o: 0 }], [1300, { o: 0, e: 'ease-in' }], [POSE, { o: 1 }], [D0, { o: 1 }]], reste = D => [[0, { o: 1 }], [D, { o: 1 }]];
  const temps = [
    unTemps(D0, [[0, c0], [D0, { ...c1, e: 'ease-in-out' }]], { ...soirDe(plans, D0, 0.6, 1), lechee: lecheeVa(D0), rocher: [[0, ROC_PRES], [D0, ROC_PRES]], venue, anime: pose, reflet: luit, lumiere: luit }),
    unTemps(D1, [[0, c1], [D1, { ...c2, e: 'ease-in-out' }]], { ...soirDe(plans, D1, 1, 1), lechee: lecheeVa(D1), rocher: [[0, ROC_PRES], [D1, ROC_PRES]], venue: [[0, { o: 0 }], [D1, { o: 0 }]], anime: reste(D1), reflet: reste(D1), lumiere: reste(D1) })
  ];
  return { plans, partition: { temps, repos: { duree: 10000, camera: { x: 5, y: -2, z: 0.02 }, pistes: { anime: [6000, { x: -10, y: -5 }], filets0: [12000, { x: 14 }], filets1: [9000, { x: -24 }], filets3: [10000, { x: 20 }], filets2: [8000, { x: 22 }], lechee: [2600, { y: 12 }] } } } };
}

// ——— 02_approche : elle fonce sur l'avatar à travers la brume, qui s'écarte ; elle s'arrête tout près, devant le
// rocher, les yeux ronds ———
const TOUT_PRES = [244, 296];
function approche02() {
  const p = 'ra', D = 1400, ARRIVE = 560;
  const plans = [
    ...decorSoir(p),
    { id: 'reflet', profondeur: 0.6, cadre: [140, 180, 200, 150], dessin: () => reflet(p, ARETE_HAUT) },
    { id: 'flaque', profondeur: 0.62, marge: MARGE, pivot: [TOUT_PRES[0], 316], dessin: () => { const A = atelier(`${p}q`); return A.out(flaque(`${p}q`, [TOUT_PRES[0], 316], 70)); } },
    { id: 'brume', profondeur: 0.62, marge: MARGE, pivot: TOUT_PRES, dessin: () => brumePiece(`${p}b`, TOUT_PRES, 3, 'curieuse') },
    { id: 'avatar', profondeur: 0.7 },
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => lumiereFroide(p, [TOUT_PRES[0], 260]) },
    ...brumeDevant(p),
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  // (de là où elle errait, toute petite, à tout près : elle grandit en fonçant ; un rien de recul, puis elle penche
  // la tête ; la brume s'écarte sur son passage)
  const loin = { x: PRES_ROCHER[0] - TOUT_PRES[0], y: PRES_ROCHER[1] - TOUT_PRES[1], s: 1.4 / 3 };
  const P = {
    ...soirDe(plans, D, 1, 1),
    brume: [[0, loin], [140, { ...loin, e: 'cubic-bezier(.7,0,.9,.6)' }], [ARRIVE, { x: 0, y: 0, s: 1.08, e: 'cubic-bezier(.2,.8,.4,1)' }], [ARRIVE + 260, { x: 2, y: -6, s: 1 }], [D, { x: 0, y: -2, s: 1, r: -9, e: 'ease-in-out' }]],
    flaque: [[0, { x: loin.x, y: -18, s: 0.4, o: 0.6 }], [140, { x: loin.x, y: -18, s: 0.4, o: 0.6, e: 'cubic-bezier(.7,0,.9,.6)' }], [ARRIVE, { x: 0, y: 0, s: 1.1, o: 1, e: 'ease-out' }], [D, { s: 1, o: 1 }]],
    filets1: [[0, { ...soir(1).filets1 }], [140, { ...soir(1).filets1, e: 'ease-out' }], [ARRIVE + 200, { o: 0.3, x: -60 }], [D, { o: 0.45, x: -44 }]],
    voile1: [[0, { o: 1 }], [140, { o: 1, e: 'ease-out' }], [ARRIVE + 200, { o: 0.45 }], [D, { o: 0.6 }]],
    filets3: [[0, { ...soir(1).filets3 }], [140, { ...soir(1).filets3, e: 'ease-out' }], [ARRIVE + 200, { o: 0.3, x: 50 }], [D, { o: 0.45, x: 36 }]],
    reflet: [[0, { o: 0 }], [ARRIVE, { o: 0, e: 'ease-out' }], [D, { o: 1 }]],
    lechee: lecheeVa(D)
  };
  const cam = { x: 4, y: 2, z: 1.12 }, arrivee = { x: 0, y: 6, z: 1.2 };
  return { plans, partition: { temps: [unTemps(D, [[0, cam], [ARRIVE, { ...arrivee, e: 'ease-out' }], ...secoue(ARRIVE + 10, arrivee, 3, 4), [D, arrivee]], P)], repos: { duree: 9000, camera: { x: -3, y: 2, z: 0.02 } } } };
}

// ——— 02_rocher : Brume sursaute aussi, bondit par-dessus le rocher et retombe derrière ; puis elle passe la tête ———
// (derrière le rocher, vivante : elle regarde, se cache par moments, revient)
const CACHEE = [212, 194];
function rocherVive(p) {
  const cache = '<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 30;0 30;0 0;0 0" keyTimes="0;0.5;0.56;0.66;0.74;1" calcMode="spline" keySplines="0 0 1 1;0.5 0 0.8 1;0 0 1 1;0.3 0 0.4 1;0 0 1 1" dur="7s" begin="4s" repeatCount="indefinite" additive="sum"/>';
  const regard = '<animateTransform attributeName="transform" type="rotate" values="0;-6;0;5;0" keyTimes="0;0.25;0.5;0.75;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" dur="4.6s" repeatCount="indefinite" additive="sum"/>';
  return `<defs>${HALO(p)}</defs><g transform="translate(${CACHEE[0]} ${CACHEE[1]})"><g>${cache}<g>${regard}<circle cx="0" cy="-14" r="60" fill="url(#${p}H)"/>${brumeVive(p, 2.3, 'gene', [3.2, 1])}</g></g></g>` + spirales() + escarbilles();
}
function rocher02() {
  const p = 'rr', D = 2600, HAUT = 620;
  const plans = [
    ...decorSoir(p, [{ id: 'anime', profondeur: 0.58, dessin: () => rocherVive(p) }]),
    { id: 'reflet', profondeur: 0.6, cadre: [140, 180, 200, 150], dessin: () => reflet(p, ARETE_HAUT) },
    { id: 'brume', profondeur: 0.62, marge: MARGE, pivot: TOUT_PRES, dessin: () => brumePiece(`${p}b`, TOUT_PRES, 3, 'surpris') },
    // (le rocher, encore, devant Brume qui retombe : elle passe derrière lui)
    { id: 'rocher-devant', profondeur: 0.6, cadre: [140, 180, 200, 150], dessin: () => rocher(`${p}d`) },
    { id: 'avatar', profondeur: 0.7 },
    { id: 'lumiere', profondeur: 0, marge: MARGE, dessin: () => lumiereFroide(p, [CACHEE[0], 210]) },
    ...brumeDevant(p),
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  const [cx, cy] = CACHEE, [tx, ty] = TOUT_PRES;
  const P = {
    ...soirDe(plans, D, 1, 1),
    // (le sursaut : elle bondit en l'air au-dessus du rocher, rapetisse en s'éloignant, retombe derrière lui)
    brume: [[0, { x: 0, y: 0, s: 1, r: -9 }], [160, { x: 0, y: -40, s: 1.04, r: 0, e: 'cubic-bezier(.2,.8,.4,1)' }], [HAUT, { x: cx + 16 - tx, y: 166 - ty, s: 0.84, r: 6, e: 'cubic-bezier(.4,0,.6,1)' }], [1080, { x: cx - tx, y: 262 - ty, s: 0.77, r: 0, e: 'ease-in' }], [1100, { x: cx - tx, y: 262 - ty, s: 0.77, o: 0 }]],
    'rocher-devant': [[0, { o: 0 }], [HAUT, { o: 0, e: 'linear' }], [HAUT + 1, { o: 1 }], [D, { o: 1 }]],
    // (puis, derrière, vivante : elle remonte et passe la tête)
    anime: [[0, { o: 0, y: 60 }], [1100, { o: 0, y: 60, e: 'linear' }], [1101, { o: 1, y: 60 }], [1500, { o: 1, y: 60, e: 'cubic-bezier(.3,0,.4,1)' }], [2200, { o: 1, y: 0 }], [D, { o: 1, y: 0 }]],
    reflet: [[0, { o: 0.4 }], [1500, { o: 0.4, e: 'ease-out' }], [2200, { o: 1 }], [D, { o: 1 }]],
    lechee: lecheeVa(D)
  };
  const cam = { x: 0, y: 6, z: 1.2 }, fin = { x: 0, y: 2, z: 1.14 };
  return { plans, partition: { temps: [unTemps(D, [[0, cam], [D, { ...fin, e: 'ease-in-out' }]], P)], repos: { duree: 10000, camera: { x: 4, y: -2, z: 0.02 }, pistes: { filets1: [9000, { x: -24 }], filets3: [10000, { x: 20 }], filets2: [8000, { x: 22 }], lechee: [2600, { y: 12 }] } } } };
}

module.exports = { plage02, lueur02, approche02, rocher02 };
