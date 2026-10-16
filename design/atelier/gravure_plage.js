// La plage de Brumelune au couchant, en gravures découpées (le style de 01_pont, choix de l'auteur, 16 oct.) : le réveil
// (01_paupieres), la grève et l'épave de l'Hirondelle (01_greve), la carte d'embarquement sur le sable (01_carte), le
// tampon (00_tampon). Le couchant : un ciel de soufre et d'ocre qui vire au violet sarcelle (peint flou), le soleil
// gravé à moitié couché, la mer sarcelle et son chemin d'or, le sable ocre hachuré ; ce que la mer a rendu.
const { hash, f } = require('./ouverture');
const { courbe, spirale } = require('./papier');
const { atelier, gravure, trait, ovale, chemin, ENCRE } = require('./gravure');
const T = require('./theatre_pont');
const { parTemps, balance, bouffees, volute, bandeSpirale, teinte, plein, C, MARGE, G, D_ } = T;

const HORIZON = 186, RIVAGE = 252, SOLEIL = [236, 186];
const SABLE = '#D2A650', SABLE_MOUILLE = '#8A7A58';
// les clés d'un temps, pour la partition (un seul temps : la durée, la caméra, les pistes absolues)
const unTemps = (D, camera, P) => { const pistes = {}; for (const [id, cles] of Object.entries(P)) pistes[id] = parTemps([D], cles)[0]; return { duree: D, camera: parTemps([D], camera, ['x', 'y', 'z', 'r'])[0], pistes }; };

// ——— le décor du couchant ———
// le ciel : le soufre et l'ocre à l'horizon, le violet sarcelle en haut, des fumées de nuages (peint flou)
function ciel(p) {
  const A = atelier(`${p}c`);
  let s = plein(A, A.lin([[0, '#1E2E3A'], [0.4, '#4A4A52'], [0.75, '#C8783A'], [1, '#F2C25A']], 0, G, 0, HORIZON + 10));
  s += plein(A, A.rad([[0, '#FFE8A0', 0.9], [0.25, '#F2B048', 0.5], [1, '#C8602A', 0]], SOLEIL[0], SOLEIL[1], 260));
  for (let i = 0; i < 12; i++) { const x = hash(i, 51) * 480 - 40, y = 20 + hash(i, 52) * 130, r = 30 + 50 * hash(i, 53); s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.8)}" ry="${f(r * 0.45)}" fill="${A.rad([[0, i % 3 ? '#5A3A48' : '#E8A050', 0.55], [1, '#5A3A48', 0]], x, y, r * 1.8)}"/>`; }
  return A.out(s);
}
// le soleil gravé, à moitié couché ; sa couronne de rayons pointus (le jeu la fait tourner)
function soleil(p) {
  const A = atelier(`${p}s`), [x, y] = SOLEIL;
  const rayons = Array.from({ length: 32 }, (_, k) => { const a = Math.PI + (k / 31) * Math.PI, r = k % 2 ? 30 : 46 + 6 * (k % 4 === 0); return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });
  return A.out(gravure(A, [...rayons, [x + 30, y + 2], [x - 30, y + 2]], C.ocre, { seed: 31, amp: 0.3, tailles: 1, tailleP: 3, trait: 1.8, portee: 0.3, lumiere: [0, -1] })
    + gravure(A, [...courbe(t => [x + 26 * Math.cos(Math.PI + t * Math.PI), y + 26 * Math.sin(Math.PI + t * Math.PI)], 20), [x + 26, y + 2], [x - 26, y + 2]], '#FFE8A8', { seed: 32, tailles: 2, tailleP: 2.6, portee: 0, lumiere: [0, -1] }) + volute(x - 4, y - 14, 7, 1, 1.5, 1.6));
}
// une bande de nuages au couchant, en festons gravés, des volutes aux bouts
function nuage(p, i, y, h, couleur, x0 = -60, l0 = 520) {
  const A = atelier(`${p}n${i}`);
  const fest = [];
  for (let x = x0, k = 0; x < x0 + l0; k++) { const l = 50 * (0.7 + 0.6 * hash(k, i + 3)); fest.push([x, l, h * (0.55 + 0.45 * hash(k, i + 5))]); x += l; }
  const haut = fest.flatMap(([x, l, hh]) => courbe(t => [x + l * t, y - hh * Math.sin(Math.PI * t) ** 0.8], 10));
  let s = gravure(A, [...haut, [x0 + l0, y + 12], [x0, y + 14]], couleur, { seed: 40 + i, amp: 0.4, angle: 16, tailles: 1, portee: 0.5, dy: 5, lumiere: [0, 1] });
  fest.forEach(([x, l, hh], k) => { if (k % 2 === 0) s += volute(x + l * 0.8, y - hh * 0.4, Math.min(6, hh * 0.3), 1, 1.5, 1.4); });
  return A.out(s);
}
// la mer au couchant : des rangées gravées, le chemin d'or sous le soleil
function mer(p) {
  const A = atelier(`${p}m`);
  let s = gravure(A, [[G, HORIZON - 1], [D_, HORIZON - 1], [D_, RIVAGE + 20], [G, RIVAGE + 20]], A.lin([[0, '#4A5A62'], [0.5, '#2C4A4C'], [1, '#1E3A3C']], 0, HORIZON, 0, RIVAGE), { seed: 50, amp: 0, angle: 4, pas: 3.4, ombre: 0.3, tailles: 0, portee: 0, trait: 1.4, lumiere: [0, -1] });
  const rangee = (y, a, w, c, i) => { const haut = courbe(t => { const x = G + (D_ - G) * t, ph = ((x + i * 23) / w) % 1; return [x, y - a * Math.pow(Math.sin(Math.PI * ph), 2)]; }, 80); return gravure(A, [...haut, [D_, y + 40], [G, y + 40]], c, { seed: 51 + i, amp: 0.3, angle: 4, pas: 3.2, ombre: 0.25, tailles: 0, portee: 0.35, dy: 3, trait: 1.4, lumiere: [0, -1], dans: trait(chemin(haut.map(([x, yy]) => [x, yy + 7])), 0.8, ENCRE, 0.6) }); };
  s += rangee(HORIZON + 18, 3, 40, '#3E5458', 0) + rangee(HORIZON + 36, 4, 54, '#304A4C', 1) + rangee(HORIZON + 54, 5, 70, '#264244', 2);
  // le chemin d'or : des éclats de papier ocre, de plus en plus larges vers nous
  for (let i = 0; i < 12; i++) { const t = i / 12, y = HORIZON + 6 + (RIVAGE - HORIZON - 14) * t ** 1.3, w = 6 + 30 * t + 8 * hash(i, 3), x = SOLEIL[0] + (hash(i, 5) - 0.5) * (14 + 50 * t); s += gravure(A, [[x - w / 2, y], [x + w / 2, y - 0.6], [x + w / 2 - 1, y + 2 + t * 1.6], [x - w / 2 + 1, y + 2.2 + t * 1.6]], '#F2C25A', { seed: 60 + i, amp: 0.2, tailles: 0, noir: false, trait: 1, portee: 0 }); }
  return A.out(s);
}
// la plage : le sable mouillé, la dentelle d'écume, le sable sec hachuré ; coquillages, étoiles de mer, algues, galets
function plage(p) {
  const A = atelier(`${p}p`);
  let s = gravure(A, [...courbe(t => [G + (D_ - G) * t, RIVAGE - 4 + 5 * Math.sin(t * 9)], 30), [D_, D_], [G, D_]], SABLE_MOUILLE, { seed: 70, amp: 0.4, angle: 6, pas: 3, ombre: 0.3, tailles: 0, portee: 0, trait: 1.4, lumiere: [0, -1] });
  s += `<ellipse cx="${SOLEIL[0]}" cy="${RIVAGE + 10}" rx="40" ry="10" fill="${A.rad([[0, '#F2C25A', 0.6], [1, '#F2C25A', 0]], SOLEIL[0], RIVAGE + 10, 40)}"/>`;
  const dentelle = courbe(t => [G + (D_ - G) * t, RIVAGE + 3 + 4 * Math.sin(t * 13) + 1.6 * Math.sin(t * 47)], 60);
  s += gravure(A, [...dentelle, ...dentelle.slice().reverse().map(([x, y], k) => [x, y + 4 + 2 * Math.sin(k)])], C.creme, { seed: 71, amp: 0.3, tailles: 0, noir: false, trait: 1.1, portee: 0.3 });
  const sec = [...courbe(t => [G + (D_ - G) * t, RIVAGE + 22 + 8 * Math.sin(t * 5 + 1) + 3 * Math.sin(t * 17)], 34), [D_, D_], [G, D_]];
  s += gravure(A, sec, SABLE, { seed: 72, amp: 0.6, angle: 14, pas: 3.2, ombre: 0.35, tailles: 2, tailleP: 5, portee: 0.4, dy: 4, lumiere: [-0.2, -1] });
  for (let i = 0; i < 40; i++) s += `<circle cx="${f(G + hash(i, 81) * (D_ - G))}" cy="${f(RIVAGE + 30 + hash(i, 83) * 180)}" r="${f(0.6 + hash(i, 85))}" fill="${ENCRE}" opacity="0.5"/>`;
  const coquillage = (x, y, r, c) => gravure(A, courbe(t => [x + r * Math.cos(Math.PI + t * Math.PI), y - r * 1.2 * Math.sin(t * Math.PI)], 10), c, { seed: x, amp: 0.15, tailles: 0, noir: false, trait: 1, portee: 0.3, dx: 1, dy: 1 }) + trait(`M${x},${y} L${x},${f(y - r)} M${f(x - r * 0.5)},${y} L${f(x - r * 0.2)},${f(y - r * 0.9)} M${f(x + r * 0.5)},${y} L${f(x + r * 0.2)},${f(y - r * 0.9)}`, 0.6, ENCRE);
  const etoile = (x, y, r, a, c) => gravure(A, Array.from({ length: 10 }, (_, k) => { const an = a + (k / 10) * Math.PI * 2, rr = k % 2 ? r * 0.42 : r; return [x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.7]; }), c, { seed: x + 7, amp: 0.2, tailles: 0, trait: 1.1, portee: 0.35, dx: 1, dy: 1, pas: 2 });
  s += coquillage(150, 342, 5, C.creme) + coquillage(262, 368, 4, '#E8B8A0') + coquillage(60, 362, 4.4, C.creme) + etoile(232, 340, 10, 0.3, '#D86A3A') + etoile(96, 384, 7, 1.1, C.rouge);
  for (const [x, y, k] of [[22, 322, 1.1], [304, 306, 0.8], [190, 380, 0.9]]) s += trait(`M${x},${y} q${f(6 * k)},${f(-4 * k)} ${f(14 * k)},${f(-1 * k)} t${f(12 * k)},${f(-2 * k)} t${f(10 * k)},${f(2 * k)}`, 3.4 * k, ENCRE) + trait(`M${x},${y} q${f(6 * k)},${f(-4 * k)} ${f(14 * k)},${f(-1 * k)} t${f(12 * k)},${f(-2 * k)} t${f(10 * k)},${f(2 * k)}`, 1.6 * k, '#4E6A3A');
  for (const [x, y, rx, ry, i] of [[70, 346, 9, 5, 0], [330, 360, 12, 6, 1], [300, 322, 6, 3.4, 2], [380, 396, 10, 5, 3]]) s += gravure(A, ovale(x, y, rx, ry, 14), '#6A6A62', { seed: 90 + i, amp: 0.3, tailles: 0, trait: 1.2, portee: 0.4, dx: 1, dy: 2, pas: 2 });
  return A.out(s);
}
// ce qui vit au couchant : le chemin d'or qui scintille, une mouette, des volutes qui se dessinent dans le ciel
function vivant() {
  let s = '';
  for (let i = 0; i < 9; i++) { const t = i / 9, y = HORIZON + 6 + (RIVAGE - HORIZON - 14) * t ** 1.3, w = 8 + 26 * t, x = SOLEIL[0] + (hash(i, 15) - 0.5) * (16 + 50 * t), d = 1 + hash(i, 17) * 1.4; s += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(1.4 + 1.4 * t)}" fill="#FFF0B8" opacity="0"><animate attributeName="opacity" values="0;0.95;0" dur="${f(d)}s" begin="${f(-hash(i, 19) * d)}s" repeatCount="indefinite"/></rect>`; }
  s += `<g><animateMotion path="M-30,110 Q120,70 240,96 T460,60" dur="16s" repeatCount="indefinite"/><path d="M-8,0 Q-4,-4 0,0 Q4,-4 8,0" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-linecap="round"><animateTransform attributeName="transform" type="scale" values="1 1;1 -0.5;1 1" dur="0.6s" repeatCount="indefinite"/></path></g>`;
  for (const [x, y, r, sens, dur, beg] of [[60, 60, 8, 1, 6, 0], [170, 40, 6, -1, 7, 2], [330, 70, 7, 1, 6.5, 4], [380, 140, 5, -1, 5.5, 1], [110, 130, 6, 1, 7.5, 3]]) s += `<path d="${spirale(x, y, r, sens, 1.6)}" fill="none" stroke="${ENCRE}" stroke-width="2.4" stroke-linecap="round" opacity="0.7" stroke-dasharray="140" stroke-dashoffset="140"><animate attributeName="stroke-dashoffset" values="140;0;0;-140" keyTimes="0;0.4;0.7;1" dur="${f(dur)}s" begin="${f(-beg)}s" repeatCount="indefinite"/></path>`;
  return s;
}
// le premier plan, tout près (peint flou) : un galet, une touffe d'algues, des grains
function premier(p) { const A = atelier(`${p}f`); return A.out(gravure(A, ovale(40, 434, 50, 28, 20), '#4A4038', { seed: 95, amp: 0.8, tailles: 0, trait: 2, portee: 0 }) + trait('M300,450 q10,-40 -6,-70 M316,450 q4,-36 18,-62 M330,452 q-2,-30 -20,-50', 9, ENCRE) + trait('M300,450 q10,-40 -6,-70 M316,450 q4,-36 18,-62 M330,452 q-2,-30 -20,-50', 5, '#3E5A32')); }
// le bord du regard : plus sombre, chaud (on vient de rouvrir les yeux)
const regard = p => { const A = atelier(`${p}g`); return A.out(plein(A, A.rad([[0, '#000', 0], [0.68, '#2A1208', 0.2], [1, '#0A0402', 0.7]], 200, 210, 300))); };
const decor = (p, prof = {}) => [
  { id: 'ciel', profondeur: prof.ciel ?? 0.1, marge: MARGE, flou: 0.2, dessin: () => ciel(p) },
  { id: 'soleil', profondeur: prof.ciel ?? 0.12, cadre: [180, 130, 112, 64], pivot: SOLEIL, dessin: () => soleil(p) },
  { id: 'nuage0', profondeur: 0.14, cadre: [-80, 24, 600, 60], dessin: () => nuage(p, 0, 60, 18, '#5A4A58') },
  { id: 'nuage1', profondeur: 0.18, cadre: [-80, 100, 600, 56], dessin: () => nuage(p, 1, 134, 14, '#7A5A58', -40, 480) },
  { id: 'mer', profondeur: prof.mer ?? 0.3, marge: MARGE, dessin: () => mer(p) },
  { id: 'plage', profondeur: prof.plage ?? 0.55, marge: MARGE, dessin: () => plage(p) }
];

// ——— 01_paupieres : le réveil, par ses yeux ———
// une paupière : la peau sombre, gravée, coupée en arc au bord, ses cils d'encre
function paupiere(p, haut) {
  const A = atelier(`${p}${haut ? 'h' : 'b'}`);
  const bord = haut ? courbe(t => [G - 10 + (D_ - G + 20) * t, 196 + 26 * Math.sin(Math.PI * t)], 34) : courbe(t => [G - 10 + (D_ - G + 20) * t, 214 - 22 * Math.sin(Math.PI * t)], 34);
  const loin = haut ? G - 340 : D_ + 320;
  const pts = haut ? [[G - 10, loin], [D_ + 10, loin], ...bord.slice().reverse()] : [...bord, [D_ + 10, loin], [G - 10, loin]];
  let s = gravure(A, pts, '#2A140C', { seed: haut ? 100 : 101, amp: 0.6, angle: 20, pas: 2.6, ombre: 0, tailles: 3, tailleP: 5, portee: 0, trait: 2.6, lumiere: haut ? [0, 1] : [0, -1] });
  s += trait(chemin(bord.map(([x, y]) => [x, y + (haut ? -4 : 4)])), 5, '#6A3020', 0.8);
  if (haut) s += trait(bord.filter((_, k) => k % 2).map(([x, y], k) => `M${f(x)},${f(y - 1)} q${f(-2 + (k % 3))},${f(5)} ${f(-4 + (k % 3))},${f(9 + 3 * hash(k, 9))}`).join(' '), 1.8, ENCRE);
  return A.out(s);
}
function paupieres01() {
  const p = 'gp', D = 3800;
  const plans = [
    ...decor(p),
    { id: 'anime', profondeur: 0.4, dessin: () => vivant() },
    // (le flou du réveil : la même vue, peinte toute petite, agrandie ; elle se dissipe)
    { id: 'flou', profondeur: 0.4, marge: MARGE, flou: 0.05, dessin: () => ciel(p) + mer(p) + plage(p) },
    { id: 'premier', profondeur: 1, marge: MARGE, flou: 0.3, dessin: () => premier(p) },
    { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regard(p) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) },
    { id: 'paupiere-haut', profondeur: 0, marge: MARGE, dessin: () => paupiere(p, true) },
    { id: 'paupiere-bas', profondeur: 0, marge: MARGE, dessin: () => paupiere(p, false) }
  ];
  const P = {
    'paupiere-haut': [[0, { y: 0 }], [700, { y: 0, e: 'ease-out' }], [1150, { y: -86, e: 'ease-in' }], [1500, { y: 0 }], [2150, { y: -176, e: 'ease-in' }], [2550, { y: -8 }], [2900, { y: -8, e: 'ease-in-out' }], [D, { y: -340 }]],
    'paupiere-bas': [[0, { y: 0 }], [700, { y: 0, e: 'ease-out' }], [1150, { y: 70, e: 'ease-in' }], [1500, { y: 0 }], [2150, { y: 150, e: 'ease-in' }], [2550, { y: 5 }], [2900, { y: 5, e: 'ease-in-out' }], [D, { y: 320 }]],
    flou: [[0, { o: 1 }], [900, { o: 1 }], [1250, { o: 0.78 }], [1600, { o: 0.92 }], [2300, { o: 0.45 }], [2800, { o: 0.62 }], [D, { o: 0 }]],
    soleil: [[0, { r: 0 }], [D, { r: 14 }]]
  };
  return { plans, partition: { temps: [unTemps(D, [[0, { y: 10, z: 1.16, r: -7 }], [D, { y: 0, z: 1.06, r: -3.5 }]], P)], repos: { duree: 14000, camera: { x: -5, z: 0.03, r: 0.8 } } } };
}

// ——— 01_greve : le regard glisse vers ce que la mer a rendu de l'Hirondelle ———
// l'épave sur le sable : la cheminée rouge brisée et son hirondelle, le mât cassé et son fanion, le pavillon du
// gramophone cabossé, une valise éventrée, la bouée, une guirlande échouée
function epave(p) {
  const A = atelier(`${p}d`);
  let s = '';
  // le mât cassé, couché de biais, son fanion déchiré
  s += gravure(A, [[150, 318], [290, 282], [292, 288], [152, 325]], C.brun, { seed: 200, amp: 0.3, tailles: 0, trait: 1.6, portee: 0.5, dy: 4 }) + gravure(A, [[286, 276], [306, 270], [300, 278], [308, 282], [290, 286]], C.rouge, { seed: 201, amp: 0.3, tailles: 0, trait: 1.3, portee: 0.4 });
  // la cheminée brisée, plantée dans le sable, son bandeau noir, l'hirondelle
  s += gravure(A, [[256, 330], [300, 324], [306, 268], [296, 262], [286, 270], [276, 262], [262, 272]], C.rouge, { seed: 202, amp: 0.4, tailles: 1, portee: 0.55, dy: 5 });
  s += gravure(A, [[258, 300], [302, 296], [303, 286], [260, 290]], '#14100C', { seed: 203, amp: 0.2, tailles: 0, portee: 0, trait: 1.3 }) + `<path d="M268,316 q6,-6 10,-1 q4,-5 10,-2 q-6,1 -9,6 q-4,-3 -11,-3 Z" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.8"/>`;
  // le pavillon du gramophone, cabossé, à moitié dans le sable
  s += gravure(A, [[318, 330], [356, 300], [362, 312], [330, 338]], C.ocre, { seed: 204, amp: 0.4, tailles: 1, tailleP: 3, portee: 0.5, dy: 4 }) + gravure(A, ovale(358, 306, 9, 15, 18, 0.6), C.moutarde, { seed: 205, amp: 0.3, tailles: 1, tailleP: 2, trait: 1.6, portee: 0 }) + `<ellipse cx="359" cy="306" rx="5" ry="10" transform="rotate(34 359 306)" fill="#1A120A"/>`;
  // la valise éventrée, ses habits
  s += gravure(A, [[190, 352], [236, 352], [233, 336], [193, 336]], '#7A4A28', { seed: 206, amp: 0.4, tailles: 1, portee: 0.5, dy: 4 }) + gravure(A, [[193, 336], [180, 312], [228, 306], [233, 336]], '#8E5A30', { seed: 207, amp: 0.4, tailles: 0, portee: 0.4 });
  s += gravure(A, [[236, 350], [254, 342], [272, 350], [258, 358]], '#3A6A8A', { seed: 208, amp: 0.3, tailles: 0, trait: 1.2, portee: 0.35 }) + gravure(A, [[186, 354], [168, 360], [160, 352], [178, 346]], C.ocre, { seed: 209, amp: 0.3, tailles: 0, trait: 1.2, portee: 0.35 });
  // la bouée, à moitié ensablée
  s += gravure(A, ovale(130, 334, 20, 8, 20), C.creme, { seed: 210, amp: 0.3, tailles: 0, trait: 1.4, portee: 0.4 });
  for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + 0.4; s += `<path d="M${f(130 + Math.cos(a) * 10)},${f(334 + Math.sin(a) * 4)} L${f(130 + Math.cos(a) * 20)},${f(334 + Math.sin(a) * 8)} L${f(130 + Math.cos(a + 0.7) * 20)},${f(334 + Math.sin(a + 0.7) * 8)} L${f(130 + Math.cos(a + 0.7) * 10)},${f(334 + Math.sin(a + 0.7) * 4)} Z" fill="${C.rouge}" stroke="${ENCRE}" stroke-width="0.8"/>`; }
  s += `<ellipse cx="130" cy="334" rx="9" ry="3.4" fill="${SABLE_MOUILLE}" stroke="${ENCRE}" stroke-width="1"/>`;
  // la guirlande échouée, ses ampoules éteintes
  const fil = courbe(t => [60 + 110 * t, 364 + 8 * Math.sin(t * 9) + 10 * t], 24);
  s += trait(chemin(fil), 1, ENCRE);
  fil.filter((_, k) => k % 4 === 2).forEach(([x, y], k) => { s += `<circle cx="${f(x + 2)}" cy="${f(y + 4)}" r="2.6" fill="${['#A8882E', '#8A3A2A', '#4A7A78', '#6A8A3A'][k % 4]}" stroke="${ENCRE}" stroke-width="0.8"/>`; });
  return A.out(s);
}
function greve01() {
  const p = 'gg', D = 6400;
  const plans = [...decor(p), { id: 'anime', profondeur: 0.3, dessin: () => vivant() }, { id: 'epave', profondeur: 0.62, marge: MARGE, dessin: () => epave(p) }, { id: 'premier', profondeur: 1, marge: MARGE, flou: 0.3, dessin: () => premier(p) }, { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regard(p) }, { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }];
  return { plans, partition: { temps: [unTemps(D, [[0, { x: -80, y: -6, z: 1.32 }], [1100, { x: -76, y: -6, z: 1.32 }], [D, { x: 64, y: 8, z: 1.34 }]], { soleil: [[0, { r: 0 }], [D, { r: 20 }]] })], repos: { duree: 9000, camera: { x: -5, y: 2, z: 0.02 } } } };
}

// ——— la carte d'embarquement, gravée, sur le sable (01_carte, 00_tampon) ———
const CARTE = { x: 200, y: 206, a: -14 };
const surCarte = corps => `<g transform="translate(${CARTE.x} ${CARTE.y}) rotate(${CARTE.a}) translate(-130 -84)">${corps}</g>`;
// la carte trempée : papier crème, l'en-tête bleu nuit, la photo, les lignes ; les taches d'eau, le coin déchiré
function carteGravee(p) {
  const A = atelier(`${p}k`);
  let s = gravure(A, [[0, 0], [260, 0], [260, 140], [246, 150], [252, 158], [240, 168], [0, 168]], C.creme, { seed: 300, amp: 0.6, angle: 30, pas: 3.2, ombre: 0.5, tailles: 1, tailleP: 5, portee: 0.55, dx: 4, dy: 6, lumiere: [-0.5, -0.85] });
  s += gravure(A, [[3, 3], [257, 3], [257, 36], [3, 36]], '#22385C', { seed: 301, amp: 0.3, tailles: 0, portee: 0, trait: 1.2, pas: 2.6 });
  s += `<text x="44" y="25" font-family="Georgia, serif" font-size="14" font-weight="bold" letter-spacing="1.6" fill="${C.creme}">L’HIRONDELLE</text><path d="M18,22 q6,-6 10,-1 q4,-5 10,-2 q-6,1 -9,6 q-4,-3 -11,-3 Z" fill="${C.ocre}" stroke="${ENCRE}" stroke-width="0.6"/>`;
  s += gravure(A, [[16, 50], [76, 48], [78, 124], [18, 126]], '#F4ECD8', { seed: 302, amp: 0.3, tailles: 0, noir: false, trait: 1.2, portee: 0.35 }) + gravure(A, [[22, 56], [72, 54], [73, 112], [23, 114]], '#B8C0C0', { seed: 303, amp: 0.2, tailles: 0, trait: 0.8, portee: 0, pas: 2.4 });
  s += `<text x="92" y="60" font-family="Georgia, serif" font-size="11" font-style="italic" fill="#22385C">Carte d’embarquement</text>`;
  s += trait('M92,84 L240,84 M92,108 L170,108 M180,108 L240,108 M92,132 L240,132', 0.9, ENCRE, 0.7) + `<text x="92" y="80" font-family="Georgia, serif" font-size="6" fill="${ENCRE}">NOM</text><text x="92" y="104" font-family="Georgia, serif" font-size="6" fill="${ENCRE}">DÉPART</text><text x="180" y="104" font-family="Georgia, serif" font-size="6" fill="${ENCRE}">CABINE</text><text x="200" y="104" font-family="Georgia, serif" font-size="9" font-weight="bold" fill="#22385C">7</text>`;
  // l'encre coulée, les auréoles de l'eau, le pli
  s += trait(Array.from({ length: 10 }, (_, k) => `M${f(96 + k * 14)},${f(110 + 4 * hash(k, 1))} q1,${f(4 + 5 * hash(k, 2))} 0,${f(8 + 6 * hash(k, 2))}`).join(' '), 0.8, '#22385C', 0.4);
  for (const [x, y, rx, ry] of [[170, 120, 34, 20], [50, 150, 26, 12], [220, 60, 20, 30]]) s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#8A7A58" opacity="0.14" stroke="#5A4A30" stroke-width="0.8" stroke-opacity="0.4"/>`;
  s += trait('M84,0 Q96,84 110,168', 1.2, '#FFFFFF', 0.5) + trait('M86,0 Q98,84 112,168', 0.7, ENCRE, 0.35);
  return A.out(surCarte(s));
}
// l'encre du tampon : « EMBARQUÉ », rouge, un peu usée
const encreTampon = p => surCarte(`<g transform="rotate(-11 190 140)" opacity="0.9"><rect x="146" y="124" width="92" height="32" rx="5" fill="none" stroke="#B8301E" stroke-width="2.8"/><rect x="150" y="128" width="84" height="24" rx="3" fill="none" stroke="#B8301E" stroke-width="1"/><text x="192" y="145" font-family="Georgia, serif" font-size="12" font-weight="bold" letter-spacing="1" fill="#B8301E" text-anchor="middle">EMBARQUÉ</text>${Array.from({ length: 30 }, (_, k) => `<circle cx="${f(148 + hash(k, 3) * 90)}" cy="${f(124 + hash(k, 4) * 32)}" r="${f(0.4 + 0.8 * hash(k, 5))}" fill="${C.creme}"/>`).join('')}</g>`);
// le sable mouillé de près, ocre : ses rides gravées, ses grains ; empreinte : la trace humide de la carte
function sablePres(p, empreinte = false) {
  const A = atelier(`${p}z`);
  let s = gravure(A, [[G, G], [D_, G], [D_, D_], [G, D_]], A.lin([[0, '#C89A4A'], [1, '#8A6A3A']], 0, G, 140, D_), { seed: 320, amp: 0, angle: 10, pas: 3.6, ombre: 0.4, tailles: 0, portee: 0, trait: 0, lumiere: [-0.5, -0.85] });
  for (let i = 0; i < 10; i++) { const y = G + 10 + i * 48, ride = courbe(t => [G + (D_ - G) * t, y + 7 * Math.sin(t * 8 + i) + 4 * Math.sin(t * 21)], 40); s += gravure(A, [...ride, ...ride.slice().reverse().map(([x, yy]) => [x, yy + 12])], i % 2 ? '#B88C48' : '#A88044', { seed: 321 + i, amp: 0.4, angle: 6, pas: 2.6, ombre: 0.4, tailles: 0, trait: 1.2, portee: 0.3, dy: 2, lumiere: [0, -1] }); }
  for (let i = 0; i < 30; i++) s += `<circle cx="${f(G + hash(i, 81) * (D_ - G))}" cy="${f(G + hash(i, 83) * (D_ - G))}" r="${f(0.8 + 1.4 * hash(i, 85))}" fill="${hash(i, 87) < 0.5 ? C.creme : ENCRE}" stroke="${ENCRE}" stroke-width="0.5"/>`;
  s += gravure(A, courbe(t => [60 + 12 * Math.cos(Math.PI + t * Math.PI), 340 - 14 * Math.sin(t * Math.PI)], 10), C.creme, { seed: 340, amp: 0.2, tailles: 0, noir: false, trait: 1.2, portee: 0.4 }) + trait('M330,350 q16,-10 34,-2 t30,-4', 7, ENCRE) + trait('M330,350 q16,-10 34,-2 t30,-4', 3.4, '#4E6A3A');
  if (empreinte) s += surCarte(`<path d="M0,0 L260,0 L260,140 L246,150 L252,158 L240,168 L0,168 Z" fill="#5A4024" opacity="0.5"/>`);
  return A.out(s);
}
// l'eau qui vient lécher le haut du gros plan : le sable plus sombre, la dentelle d'écume (jamais sur la carte)
function ecumeBord(p) {
  const A = atelier(`${p}u`);
  const bord = courbe(t => [G + (D_ - G) * t, 34 + 10 * Math.sin(t * 7 + 1) + 5 * Math.sin(t * 19)], 60);
  let s = gravure(A, [[G, G - 60], [D_, G - 60], ...bord.slice().reverse()], '#5A6A5E', { seed: 350, amp: 0.4, angle: 4, pas: 3, tailles: 0, trait: 1.4, portee: 0.4, dy: 3, lumiere: [0, -1] });
  s += gravure(A, [...bord, ...bord.slice().reverse().map(([x, y], k) => [x, y - 6 - 3 * Math.abs(Math.sin(k * 0.9))])], C.creme, { seed: 351, amp: 0.3, tailles: 0, noir: false, trait: 1.2, portee: 0.3 });
  return A.out(s);
}
// la tache blanche au loin : la carte, toute petite, sur le sable
const TACHE = [128, 296];
const tache = p => { const A = atelier(`${p}t`); return A.out(`<g transform="rotate(-12 ${TACHE[0]} ${TACHE[1]})"><rect x="${TACHE[0] - 6}" y="${TACHE[1] - 3.6}" width="12" height="7.2" fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.8"/><rect x="${TACHE[0] - 6}" y="${TACHE[1] - 3.6}" width="12" height="2.2" fill="#22385C"/></g>`); };
const vivantTache = () => `<circle cx="${TACHE[0] + 4}" cy="${TACHE[1] - 2}" r="2.4" fill="#FFF8D8"><animate attributeName="opacity" values="0.2;1;0.4;0.2" dur="1.6s" repeatCount="indefinite"/><animate attributeName="r" values="1.4;3.4;1.8;1.4" dur="1.6s" repeatCount="indefinite"/></circle><path d="M${TACHE[0] + 4},${TACHE[1] - 9} v14 M${TACHE[0] - 3},${TACHE[1] - 2} h14" stroke="#FFF8D8" stroke-width="1" opacity="0"><animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.5;0.6;1" dur="3.2s" repeatCount="indefinite"/></path>`;
function carte01() {
  const p = 'gc', d = 0.55;
  const vise = (z, part = 1) => { const S = 1 + (z - 1) * d; return { x: Math.round((part * S * (TACHE[0] - 200)) / d), y: Math.round((part * S * (TACHE[1] - 200)) / d), z }; };
  const c0 = { x: -20, y: 0, z: 1.1 }, c1 = vise(1.35, 0.62), c2 = vise(2), c3 = vise(4.5);
  const pres = cles => ({ 'sable-pres': cles, carte: cles });
  const cache = t => [[0, { o: 0 }], [t, { o: 0 }]];
  const plans = [...decor(p, { plage: d }), { id: 'tache', profondeur: d, marge: MARGE, dessin: () => tache(p) }, { id: 'anime', profondeur: d, dessin: () => vivantTache() },
    { id: 'sable-pres', profondeur: 0, marge: MARGE, dessin: () => sablePres(p) }, { id: 'carte', profondeur: 0, marge: MARGE, pivot: [CARTE.x, CARTE.y], dessin: () => carteGravee(p) }, { id: 'ecume', profondeur: 0, marge: MARGE, dessin: () => ecumeBord(p) },
    { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regard(p) }, { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }];
  const temps = [
    unTemps(5000, [[0, c0], [800, c0], [5000, c1]], { ...pres(cache(5000)), ecume: cache(5000) }),
    unTemps(2600, [[0, c1], [1000, { ...c2, e: 'ease-in' }], [1900, c3], [2600, c3]], { ...pres([[0, { o: 0, s: 1.3 }], [1000, { o: 0, s: 1.3, e: 'ease-out' }], [1800, { o: 1, s: 1.06 }], [2600, { o: 1, s: 1 }]]), ecume: [[0, { o: 0, y: -60 }], [1000, { o: 0, y: -60 }], [1800, { o: 1, y: -50 }], [2600, { o: 1, y: -60 }]] }),
    unTemps(8000, [[0, c3], [8000, c3]], { ...pres([[0, { o: 1, s: 1 }], [8000, { o: 1, s: 1.07 }]]), ecume: [[0, { o: 1, y: -60 }], [2600, { o: 1, y: 0 }], [4600, { o: 1, y: -50 }], [7000, { o: 1, y: -8 }], [8000, { o: 1, y: -40 }]] })
  ];
  return { plans, partition: { temps, repos: { duree: 9000, camera: { x: -6, y: 3, z: 0.02 } } } };
}

// ——— 00_tampon : le tampon claque « EMBARQUÉ », puis le vent emporte la carte ———
const TAMPON_ICI = (() => { const a = (CARTE.a * Math.PI) / 180, x = 192 - 130, y = 140 - 84; return [CARTE.x + x * Math.cos(a) - y * Math.sin(a), CARTE.y + x * Math.sin(a) + y * Math.cos(a)]; })();
// le tampon de bois, seul, vu d'en haut : son bloc, son caoutchouc rouge, son col, son pommeau
function outil(p) {
  const A = atelier(`${p}o`), [tx, ty] = TAMPON_ICI;
  let s = `<g transform="translate(${f(tx)} ${f(ty)}) rotate(${CARTE.a - 11})">`;
  s += gravure(A, [[-48, -16], [48, -16], [48, 20], [-48, 20]], '#B8301E', { seed: 360, amp: 0.3, tailles: 0, portee: 0, trait: 1.4 });
  s += gravure(A, [[-46, -20], [46, -20], [46, 16], [-46, 16]], '#7A4A28', { seed: 361, amp: 0.4, angle: 0, tailles: 1, portee: 0.5, dx: 6, dy: 8 });
  s += gravure(A, ovale(-2, -6, 22, 20, 22), '#A87040', { seed: 362, amp: 0.4, tailles: 2, tailleP: 4, portee: 0.5, dx: 4, dy: 6 }) + volute(-4, -8, 7, 1, 1.5, 1.6);
  return A.out(s + '</g>');
}
// le vent du large : des traits et des volutes qui filent, du sable soulevé
function vent() {
  let s = '';
  for (let i = 0; i < 6; i++) { const y = 40 + i * 62, d = 1.4 + hash(i, 2); s += `<path d="M-60,${y} q60,-16 120,0 t120,-4" fill="none" stroke="${ENCRE}" stroke-width="2.4" stroke-linecap="round" opacity="0.6"><animateTransform attributeName="transform" type="translate" from="-80 20" to="480 -60" dur="${f(d)}s" begin="${f(-hash(i, 3) * d)}s" repeatCount="indefinite"/></path>`; }
  let grains = '';
  for (let i = 0; i < 40; i++) grains += `<circle cx="${f(hash(i, 5) * 400)}" cy="${f(hash(i, 6) * 400)}" r="${f(0.8 + hash(i, 7))}"/>`;
  return s + `<g fill="${C.creme}" stroke="${ENCRE}" stroke-width="0.4"><animateTransform attributeName="transform" type="translate" from="-400 30" to="0 0" dur="1.2s" repeatCount="indefinite"/>${grains}<g transform="translate(400 -30)">${grains}</g></g>`;
}
function tampon00() {
  const p = 'gt', D = 3600, HIT = 560;
  const vol = [[1500, {}], [1800, { y: -4, r: -3, s: 1.02 }], [2250, { x: 50, y: -70, r: 18, s: 1.16, e: 'ease-in-out' }], [2850, { x: 170, y: -220, r: 62, s: 1.05 }], [D, { x: 320, y: -440, r: 120, s: 0.8 }]];
  const plans = [
    { id: 'sable-pres', profondeur: 0.2, marge: MARGE, dessin: () => sablePres(p, true) },
    { id: 'carte', profondeur: 0.2, marge: MARGE, pivot: [CARTE.x, CARTE.y], dessin: () => carteGravee(p) },
    { id: 'encre', profondeur: 0.2, marge: MARGE, pivot: [CARTE.x, CARTE.y], dessin: () => encreTampon(p) },
    { id: 'tampon', profondeur: 0.35, marge: MARGE, pivot: TAMPON_ICI, dessin: () => outil(p) },
    { id: 'anime', profondeur: 0.3, dessin: () => vent() },
    { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regard(p) },
    { id: 'teinte', profondeur: 0, marge: MARGE, dessin: () => teinte(p) }
  ];
  const P = {
    tampon: [[0, { y: -300, x: 60, s: 1.8 }], [HIT, { y: 0, x: 0, s: 1, e: 'linear' }], [HIT + 160, { s: 0.98 }], [HIT + 320, { s: 1, e: 'ease-in' }], [1350, { y: -320, x: 80, s: 1.8 }], [D, { y: -320, x: 80, s: 1.8 }]],
    carte: [[0, {}], [HIT, { e: 'linear' }], [HIT + 60, { y: 2.4 }], ...vol],
    encre: [[0, { o: 0 }], [HIT, { o: 0, e: 'linear' }], [HIT + 40, { o: 1, y: 2.4 }], [HIT + 220, { o: 1 }], ...vol.map(([t, c]) => [t, { ...c, o: 1 }])],
    anime: [[0, { o: 0 }], [1400, { o: 0 }], [1900, { o: 1 }], [D, { o: 1 }]]
  };
  const cam = { x: 0, y: 0, z: 1.04 };
  return { plans, partition: { temps: [unTemps(D, [[0, cam], ...T.secoue(HIT, cam, 4, 4), [1500, cam], [D, { x: 10, y: -14, z: 1.08 }]], P)] } };
}

module.exports = { paupieres01, greve01, carte01, tampon00 };
