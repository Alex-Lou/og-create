// L'ouverture en papier découpé, en cinématique de plans (choix de l'auteur, 16 oct. : le niveau d'Alice Madness
// Returns, celui de la porte du phare, partout ; game/scenePlans.js). Chaque scène est une pile de plans de papier,
// chacun dans son fichier, avec sa marge (MARGE : la caméra ne découvre jamais ses bords), et sa partition : la caméra,
// les mouvements des plans, temps par temps (un par bulle). Les plans ne bougent pas en eux-mêmes ; ce qui vit (un
// reflet, l'écume, une mouette) est dans leur plan « anime », léger (au plus 30 animations, sans filtre).
const { Defs, hash, f, W } = require('./ouverture');
const { courbe, piece, papiers, spirale, volute, rugueux, ENCRE } = require('./papier');
const CE = require('./carte_embarquement');

const MARGE = 40;
const G = -MARGE, D_ = W + MARGE; // les bords d'un plan, marge comprise

// ——— le couchant de la plage de Brumelune (01_paupieres, puis 01_greve, 01_carte) ———
const COUCHANT = { haut: '#241E4A', mi: '#5E3A6E', bas: '#D8664A', horizon: '#FFD98E', soleil: '#FFF4CC', merLoin: '#5B4878', merPres: '#2B3558', mouille: '#9C6A62', sable: '#D6A77E', ombre: '#8E6450' };
const HORIZON = 186, RIVAGE = 252, SOLEIL = 236;

// le ciel : le lavis du couchant, la lueur du soleil à moitié couché, des bandes de nuages bordées d'or (le dessin des
// nuages de la porte du phare), deux oiseaux qui rentrent
function cielCouchant(p) {
  const D = Defs(`${p}c`), C = COUCHANT;
  let s = papiers(`${p}c`);
  s += `<rect x="${G}" y="${G}" width="${D_ - G}" height="${HORIZON + 4 - G}" fill="${D.lin([[0, C.haut], [0.45, C.mi], [0.82, C.bas], [1, C.horizon]], 0, G, 0, HORIZON)}"/><rect x="${G}" y="${G}" width="${D_ - G}" height="${HORIZON + 4 - G}" fill="url(#${p}cciel)"/>`;
  s += `<circle cx="${SOLEIL}" cy="${HORIZON}" r="170" fill="${D.rad([[0, '#FFE6A8', 0.8], [0.22, '#FFB070', 0.38], [1, '#FF8060', 0]], SOLEIL, HORIZON, 170)}"/>`;
  s += piece(D, courbe(t => [SOLEIL - 24 + 48 * t, HORIZON + 1 - Math.sin(Math.PI * t) * 24], 16), D.rad([[0, '#FFFFF0'], [0.6, C.soleil], [1, '#FFC27A']], SOLEIL, HORIZON, 24), { seed: 1, amp: 0.4, encre: 1.2 });
  const nuage = (x, y, l, h, c, i) => piece(D, [...courbe(t => [x + l * t, y + h - h * (0.5 + 0.5 * Math.sin(Math.PI * t)) * (0.78 + 0.28 * Math.sin(t * 11 + i * 1.7))], 22), [x + l, y + h], [x, y + h]], D.lin([[0, c[0]], [1, c[1]]], 0, y, 0, y + h), { seed: 10 + i, amp: 1.1, bord: c[2], bordN: 23, texture: `${p}cciel` });
  s += nuage(-30, 36, 170, 18, ['#6A3E70', '#4A2C5A', '#FFB27A'], 0) + nuage(210, 20, 210, 22, ['#74447A', '#4E2E60', '#FFC08A'], 1);
  s += nuage(90, 92, 150, 14, ['#8A4A70', '#5E3460', '#FFB27A'], 2) + nuage(276, 118, 160, 16, ['#9A5270', '#6A3A60', '#FFD08A'], 3) + nuage(-20, 140, 120, 12, ['#A85A6A', '#7A4060', '#FFD08A'], 4);
  s += `<path d="M64,${HORIZON - 96} q4,-4 8,0 q4,-4 8,0 M88,${HORIZON - 104} q3,-3 6,0 q3,-3 6,0" fill="none" stroke="#2A1A38" stroke-width="1.1" stroke-linecap="round"/>`;
  return D.out(s);
}
// la mer : violette au loin, des rangées de vagues de papier lisérées de lilas, le chemin d'or sous le soleil
function merCouchant(p) {
  const D = Defs(`${p}m`), C = COUCHANT;
  let s = papiers(`${p}m`);
  s += `<rect x="${G}" y="${HORIZON - 2}" width="${D_ - G}" height="${RIVAGE + 14 - HORIZON}" fill="${D.lin([[0, C.merLoin], [0.5, '#45406E'], [1, C.merPres]], 0, HORIZON, 0, RIVAGE)}"/><rect x="${G}" y="${HORIZON - 2}" width="${D_ - G}" height="${RIVAGE + 14 - HORIZON}" fill="url(#${p}mmer)"/>`;
  s += `<path d="M${G},${HORIZON + 0.5} L${D_},${HORIZON + 0.5}" stroke="${C.horizon}" stroke-width="1.4" opacity="0.8"/>`;
  const rangee = (y, a, w, c, i) => piece(D, [...courbe(t => { const x = G + (D_ - G) * t, ph = (x / w) * Math.PI * 2; return [x, y - a * Math.max(0, Math.sin(ph)) * 1.1]; }, 60), [D_, y + 40], [G, y + 40]], c[0], { seed: 20 + i, amp: 0.8, bord: c[1], bordN: 61, texture: `${p}mmer` });
  s += rangee(HORIZON + 16, 2.6, 36, ['#4E4476', '#B49ACE'], 0) + rangee(HORIZON + 34, 3.6, 48, ['#3C3A6A', '#9A86C0'], 1) + rangee(HORIZON + 52, 4.6, 60, ['#2E3260', '#8270B0'], 2);
  // le chemin d'or : des éclats de papier couchés, de plus en plus larges vers nous
  for (let i = 0; i < 16; i++) {
    const t = i / 16, y = HORIZON + 4 + (RIVAGE - HORIZON - 12) * t ** 1.3, w = 6 + 30 * t + 8 * hash(i, 3), x = SOLEIL + (hash(i, 5) - 0.5) * (14 + 60 * t);
    s += piece(D, [[x - w / 2, y], [x + w / 2, y - 0.6], [x + w / 2 - 1, y + 1.4 + t * 1.4], [x - w / 2 + 1, y + 1.6 + t * 1.4]], '#FFE2A0', { seed: 30 + i, amp: 0.3, encre: 0 });
  }
  return D.out(s);
}
// la plage : le sable mouillé qui reflète le ciel, la dentelle d'écume, le sable sec ; ce que la mer a rendu
function plageCouchant(p) {
  const D = Defs(`${p}p`), C = COUCHANT;
  let s = papiers(`${p}p`);
  const mouille = [...courbe(t => [G + (D_ - G) * t, RIVAGE - 4 + 5 * Math.sin(t * 9) - 3 * Math.sin(t * 3.4)], 30), [D_, D_], [G, D_]];
  s += piece(D, mouille, D.lin([[0, '#B07A8A'], [0.4, C.mouille], [1, '#7A4E50']], 0, RIVAGE, 0, RIVAGE + 50), { seed: 40, amp: 0.8, encre: 1 });
  s += `<ellipse cx="${SOLEIL}" cy="${RIVAGE + 12}" rx="34" ry="12" fill="${D.rad([[0, '#FFE2A0', 0.55], [1, '#FFE2A0', 0]], SOLEIL, RIVAGE + 12, 34)}"/>`;
  // la dentelle d'écume, sur le bord de la vague qui vient de se retirer
  s += piece(D, [...courbe(t => [G + (D_ - G) * t, RIVAGE + 2 + 4 * Math.sin(t * 13) + 1.6 * Math.sin(t * 47)], 60), ...courbe(t => [D_ - (D_ - G) * t, RIVAGE + 6 + 4 * Math.sin((1 - t) * 13)], 30)], '#FFF2E2', { seed: 41, amp: 0.6, encre: 0.9 });
  // le sable sec : une grande feuille au bord ondulé, son grain, son ombre
  const sec = [...courbe(t => [G + (D_ - G) * t, RIVAGE + 22 + 8 * Math.sin(t * 5 + 1) + 3 * Math.sin(t * 17)], 34), [D_, D_], [G, D_]];
  s += piece(D, sec, D.lin([[0, '#E2B48A'], [0.5, C.sable], [1, C.ombre]], 0, RIVAGE + 16, 0, D_), { seed: 42, amp: 1.2, bord: '#F8D8B0', bordN: 35, texture: `${p}proc` });
  // ce que la mer a rendu : une valise, une planche, un aviron cassé ; des coquillages, une étoile de mer, des algues
  const valise = (x, y, k) => piece(D, [[x - 15 * k, y], [x + 15 * k, y], [x + 14 * k, y - 13 * k], [x - 14 * k, y - 13 * k]], '#7A4A30', { seed: 50, amp: 0.5, texture: `${p}pbois`, encre: 1.2 })
    + piece(D, [[x - 14 * k, y - 13 * k], [x - 6 * k, y - 22 * k], [x + 20 * k, y - 21 * k], [x + 14 * k, y - 13 * k]], '#8E5A3A', { seed: 51, amp: 0.4, texture: `${p}pbois`, encre: 1.1 })
    + `<path d="M${f(x - 7 * k)},${f(y - 6 * k)} l${f(5 * k)},-1 l${f(4 * k)},${f(2 * k)} l${f(6 * k)},-1" fill="none" stroke="#E8D8C8" stroke-width="${f(1.4 * k)}"/>`;
  s += valise(332, 282, 0.9);
  s += piece(D, [[30, 286], [92, 276], [93, 282], [31, 292]], '#8A6648', { seed: 52, amp: 0.4, texture: `${p}pbois`, encre: 1.1 });
  s += piece(D, [[168, 308], [214, 300], [215, 304], [169, 312]], '#A8845E', { seed: 53, amp: 0.3, texture: `${p}pbois`, encre: 1 }) + piece(D, [[214, 298], [230, 293], [233, 304], [216, 306]], '#A8845E', { seed: 54, amp: 0.4, encre: 1 });
  const coquillage = (x, y, r, c) => piece(D, courbe(t => [x + r * Math.cos(Math.PI + t * Math.PI), y - r * 1.2 * Math.sin(t * Math.PI)], 8), c, { seed: x, amp: 0.2, encre: 0.8 }) + `<path d="M${x},${y} L${x},${f(y - r)} M${f(x - r * 0.5)},${y} L${f(x - r * 0.2)},${f(y - r * 0.9)} M${f(x + r * 0.5)},${y} L${f(x + r * 0.2)},${f(y - r * 0.9)}" stroke="#A88A76" stroke-width="0.5"/>`;
  s += coquillage(150, 342, 5, '#F2DCC8') + coquillage(262, 368, 4, '#F6C8B8') + coquillage(60, 362, 4.4, '#F2E2D0');
  const etoile = (x, y, r, a, c) => piece(D, Array.from({ length: 10 }, (_, k) => { const an = a + (k / 10) * Math.PI * 2, rr = k % 2 ? r * 0.42 : r; return [x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.7]; }), c, { seed: x + 7, amp: 0.3, encre: 0.9 });
  s += etoile(232, 340, 10, 0.3, '#E8744A') + etoile(96, 384, 7, 1.1, '#D85A6A');
  for (const [x, y, k] of [[22, 322, 1.1], [304, 306, 0.8], [190, 380, 0.9]]) s += `<path d="M${x},${y} q${f(6 * k)},${f(-4 * k)} ${f(14 * k)},${f(-1 * k)} t${f(12 * k)},${f(-2 * k)} t${f(10 * k)},${f(2 * k)}" fill="none" stroke="#3E4A2A" stroke-width="${f(2.4 * k)}" stroke-linecap="round"/>`;
  for (const [x, y, rx, ry, i] of [[70, 346, 9, 5, 0], [330, 360, 12, 6, 1], [300, 322, 6, 3.4, 2], [380, 396, 10, 5, 3]]) s += piece(D, courbe(t => [x + rx * Math.cos(t * Math.PI * 2), y + ry * Math.sin(t * Math.PI * 2)], 10), D.lin([[0, '#B8A0A0'], [1, '#4E3E46']], x - rx, y - ry, x + rx, y + ry), { seed: 60 + i, amp: 0.5, encre: 1 });
  return D.out(s);
}

// ——— 01_paupieres — le réveil, par ses yeux : les paupières battent deux fois, le flou se dissipe, la plage au
// couchant ; on est couché sur le sable, l'horizon penche, puis la tête se redresse un peu ———
function premierPlan(p) {
  const D = Defs(`${p}f`);
  let s = '';
  // tout près de l'œil (flou : peint petit, agrandi) : un galet, une touffe d'algues, des grains de sable
  s += piece(D, courbe(t => [40 + 46 * Math.cos(t * Math.PI * 2), 432 + 26 * Math.sin(t * Math.PI * 2)], 14), D.lin([[0, '#8A6A62'], [1, '#2A1E22']], 0, 400, 80, 460), { seed: 70, amp: 1, encre: 0 });
  s += `<path d="M300,450 q10,-40 -6,-70 M316,450 q4,-36 18,-62 M330,452 q-2,-30 -20,-50" fill="none" stroke="#2A3220" stroke-width="7" stroke-linecap="round"/>`;
  for (let i = 0; i < 9; i++) s += piece(D, courbe(t => [hash(i, 61) * 400 + 9 * Math.cos(t * Math.PI * 2), 400 + hash(i, 63) * 30 + 6 * Math.sin(t * Math.PI * 2)], 8), '#C89A72', { seed: 71 + i, amp: 0.5, encre: 0 });
  return D.out(s);
}
// la lumière chaude qui passe à travers les cils : les bords de la vue, sombres et rougis
const cils = p => { const D = Defs(`${p}l`); return D.out(`<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.rad([[0, '#FFD8A0', 0], [0.62, '#5A2E3A', 0.22], [1, '#1A0E18', 0.82]], 200, 200, 300)}"/>`); };
// une paupière : la peau sombre, coupée en arc au bord des cils, un liseré de peau éclairée par le jour qui passe, les cils
function paupiere(p, haut) {
  const D = Defs(`${p}${haut ? 'h' : 'b'}`);
  const bord = haut ? courbe(t => [G - 10 + (D_ - G + 20) * t, 196 + 26 * Math.sin(Math.PI * t)], 30) : courbe(t => [G - 10 + (D_ - G + 20) * t, 214 - 22 * Math.sin(Math.PI * t)], 30);
  const loin = haut ? G - 340 : D_ + 320;
  const pts = haut ? [[G - 10, loin], [D_ + 10, loin], ...bord.slice().reverse()] : [...bord, [D_ + 10, loin], [G - 10, loin]];
  let s = piece(D, pts, '#0A0508', { seed: haut ? 80 : 81, amp: 1.2, encre: 0 });
  s += `<path d="M${bord.map(([x, y]) => `${f(x)},${f(y + (haut ? -3 : 3))}`).join(' L')}" fill="none" stroke="#4A2228" stroke-width="6" opacity="0.85"/>`;
  if (haut) s += `<path d="${bord.filter((_, k) => k % 2).map(([x, y], k) => `M${f(x)},${f(y - 1)} l${f(-2 + (k % 3))},${f(7 + 2 * hash(k, 9))}`).join(' ')}" stroke="#0A0508" stroke-width="1.6" stroke-linecap="round"/>`;
  return D.out(s);
}
// ce qui vit : le chemin d'or qui scintille, deux volutes dans les nuages, une mouette qui passe
function vivantCouchant(p) {
  let s = '';
  for (let i = 0; i < 9; i++) {
    const t = i / 9, y = HORIZON + 6 + (RIVAGE - HORIZON - 14) * t ** 1.3, w = 8 + 26 * t, x = SOLEIL + (hash(i, 15) - 0.5) * (16 + 56 * t), d = 1 + hash(i, 17) * 1.4;
    s += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(1.2 + 1.4 * t)}" rx="0.6" fill="#FFF4CC" opacity="0"><animate attributeName="opacity" values="0;0.9;0" dur="${f(d)}s" begin="${f(-hash(i, 19) * d)}s" repeatCount="indefinite"/></rect>`;
  }
  s += volute(spirale(150, 38, 8, 1, 1.6), '#FFC08A', 6, 0, 1.4) + volute(spirale(370, 120, 7, -1, 1.5), '#FFD08A', 7, 2, 1.3);
  s += `<g><animateMotion path="M-30,120 Q120,80 240,104 T460,70" dur="16s" repeatCount="indefinite"/><g transform="scale(1.2)"><path d="M-7,0 Q-3.5,-3.6 0,0 Q3.5,-3.6 7,0" fill="none" stroke="#2A1A38" stroke-width="1.3" stroke-linecap="round"><animateTransform attributeName="transform" type="scale" values="1 1;1 -0.5;1 1" dur="0.6s" repeatCount="indefinite"/></path></g></g>`;
  return s;
}

// La scène : ses plans et sa partition
function paupieres01() {
  const p = 'pau';
  const ciel = cielCouchant(p), mer = merCouchant(p), plage = plageCouchant(p);
  return {
    plans: [
      { id: 'ciel', profondeur: 0.12, marge: MARGE, dessin: () => ciel },
      { id: 'mer', profondeur: 0.3, marge: MARGE, dessin: () => mer },
      { id: 'plage', profondeur: 0.55, marge: MARGE, dessin: () => plage },
      { id: 'anime', profondeur: 0.4, dessin: () => vivantCouchant(p) },
      // (le flou du réveil : la même vue, peinte toute petite, agrandie ; elle se dissipe)
      { id: 'flou', profondeur: 0.4, marge: MARGE, flou: 0.05, dessin: () => ciel + mer + plage },
      { id: 'premier', profondeur: 1, marge: MARGE, flou: 0.3, dessin: () => premierPlan(p) },
      { id: 'cils', profondeur: 0, marge: MARGE, dessin: () => cils(p) },
      { id: 'paupiere-haut', profondeur: 0, marge: MARGE, dessin: () => paupiere(p, true) },
      { id: 'paupiere-bas', profondeur: 0, marge: MARGE, dessin: () => paupiere(p, false) }
    ],
    partition: {
      temps: [{
        duree: 3800,
        camera: [[0, { y: 10, z: 1.16, r: -7 }], [3800, { y: 0, z: 1.06, r: -3.5 }]],
        pistes: {
          'paupiere-haut': [[0, { y: 0 }], [700, { y: 0, e: 'ease-out' }], [1150, { y: -86, e: 'ease-in' }], [1500, { y: 0 }], [2150, { y: -176, e: 'ease-in' }], [2550, { y: -8 }], [2900, { y: -8, e: 'ease-in-out' }], [3800, { y: -340 }]],
          'paupiere-bas': [[0, { y: 0 }], [700, { y: 0, e: 'ease-out' }], [1150, { y: 70, e: 'ease-in' }], [1500, { y: 0 }], [2150, { y: 150, e: 'ease-in' }], [2550, { y: 5 }], [2900, { y: 5, e: 'ease-in-out' }], [3800, { y: 320 }]],
          flou: [[0, { o: 1 }], [900, { o: 1 }], [1250, { o: 0.78 }], [1600, { o: 0.92 }], [2300, { o: 0.45 }], [2800, { o: 0.62 }], [3800, { o: 0 }]]
        }
      }],
      repos: { duree: 14000, camera: { x: -5, z: 0.03, r: 0.8 } }
    }
  };
}

// ——— les outils communs de l'ouverture ———
// une pièce posée sur le plan d'en dessous : son ombre de papier (le même contour, sombre, décalé), puis elle
const decoupe = (D, pts, fill, o = {}) => `<path d="${rugueux(pts, o.amp ?? 1.4, o.seed ?? 1)}" fill="#05060C" opacity="${o.ombre ?? 0.45}" transform="translate(${o.dx ?? 2} ${o.dy ?? 3})"/>` + piece(D, pts, fill, o);
// une ellipse en points (pour les pièces rondes)
const ovale = (x, y, rx, ry, n = 16, a0 = 0) => courbe(t => [x + rx * Math.cos(a0 + t * Math.PI * 2), y + ry * Math.sin(a0 + t * Math.PI * 2)], n).slice(0, -1);
// des clés de piste espacées régulièrement sur une durée : vals(k, t) → la clé k (t de 0 à 1)
const cles = (duree, n, vals) => Array.from({ length: n + 1 }, (_, k) => [Math.round((duree * k) / n), vals(k, k / n)]);
// la houle vue du pont : le ciel et la mer roulent (r, en degrés) et montent et descendent (y) autour de l'horizon ; elle
// part du plat et y revient (les temps s'enchaînent sans saut). amp : [r, y] ; n : le nombre de demi-roulis
const houle = (duree, n, [ar, ay], plus = () => ({})) => cles(duree, n, (k, t) => ({ r: k % n ? (k % 2 ? ar : -ar) * (0.8 + 0.4 * hash(k, ar)) : 0, y: k % n ? (k % 2 ? -ay : ay) : 0, ...plus(t), e: 'ease-in-out' }));
// un éclair : des clés d'opacité (à, force) sur une durée
const eclairs = (duree, coups) => {
  const k = [[0, { o: 0 }]];
  for (const [t, a] of coups) k.push([t - 1, { o: 0, e: 'linear' }], [t + 40, { o: a, e: 'linear' }], [t + 120, { o: a * 0.15, e: 'linear' }], [t + 190, { o: a * 0.8, e: 'ease-out' }], [t + 520, { o: 0 }]);
  return [...k, [duree, { o: 0 }]];
};
// une secousse de la caméra autour d'une clé : n à-coups de plus en plus faibles, à partir de t
const secousse = (t, cle, amp, n = 5) => Array.from({ length: n }, (_, k) => [t + k * 70, { ...cle, x: (cle.x || 0) + (k % 2 ? -1 : 1) * amp * (1 - k / n), y: (cle.y || 0) + (k % 2 ? 1 : -1) * amp * 0.7 * (1 - k / n), e: 'linear' }]).concat([[t + n * 70, { ...cle }]]);

// ——— la tempête : le pont de l'Hirondelle, la nuit (01_pont, 01_vague) ———
const TEMPETE = { haut: '#070A1C', mi: '#121838', bas: '#242C54', nuage: '#1A2244', nuageBas: '#262F58', lisere: '#7084C0', mer: '#0B152E', merClair: '#1B2A50', crete: '#9AB0DA', bois: '#5A3E2C', boisClair: '#7A5A40', rampe: '#E4DCCB' };
const HORIZON_T = 172;
// le ciel d'orage : des bancs de nuages de papier, boursouflés, bordés de la lueur des éclairs, de plus en plus bas et
// sombres ; des rideaux de pluie au loin
function cielTempete(p) {
  const D = Defs(`${p}c`), C = TEMPETE;
  let s = papiers(`${p}c`);
  s += `<rect x="${G}" y="${G}" width="${D_ - G}" height="${HORIZON_T + 10 - G}" fill="${D.lin([[0, C.haut], [0.6, C.mi], [1, C.bas]], 0, G, 0, HORIZON_T)}"/><rect x="${G}" y="${G}" width="${D_ - G}" height="${HORIZON_T + 10 - G}" fill="url(#${p}cciel)" opacity="0.6"/>`;
  // une lueur pâle derrière les nuages (la lune noyée)
  s += `<circle cx="300" cy="60" r="120" fill="${D.rad([[0, '#8A9CD0', 0.35], [1, '#8A9CD0', 0]], 300, 60, 120)}"/>`;
  const banc = (y, h, bosses, c, i) => {
    const haut = courbe(t => { const x = G - 20 + (D_ - G + 40) * t; return [x, y - h * Math.abs(Math.sin(t * Math.PI * bosses + i)) ** 0.7 * (0.7 + 0.3 * Math.sin(t * 7 + i))]; }, bosses * 8);
    return decoupe(D, [...haut, [D_ + 20, y + 60], [G - 20, y + 60]], D.lin([[0, c[0]], [1, c[1]]], 0, y - h, 0, y + 50), { seed: 90 + i, amp: 1.2, bord: C.lisere, bordN: haut.length, texture: `${p}cciel`, ombre: 0.55, dy: 4 });
  };
  s += banc(30, 26, 4, ['#262E56', '#161C3A'], 0) + banc(78, 30, 3, ['#222A50', '#141A36'], 1) + banc(128, 34, 5, ['#1E2648', '#10152E'], 2) + banc(176, 28, 4, ['#1A2040', '#0C1028'], 3);
  // les rideaux de pluie, au loin, sous les nuages
  for (let i = 0; i < 5; i++) { const x = 20 + i * 90 + 30 * hash(i, 3); s += `<path d="M${f(x)},150 l-26,70 M${f(x + 10)},150 l-26,70 M${f(x + 22)},152 l-24,66" stroke="#5A6A9A" stroke-width="1" opacity="0.25"/>`; }
  return D.out(s);
}
// la mer démontée : des rangées de lames de papier, pointues, leurs crêtes qui s'enroulent, l'écume
function merTempete(p) {
  const D = Defs(`${p}m`), C = TEMPETE;
  let s = papiers(`${p}m`);
  s += `<rect x="${G}" y="${HORIZON_T - 2}" width="${D_ - G}" height="${D_ - HORIZON_T}" fill="${D.lin([[0, C.merClair], [1, C.mer]], 0, HORIZON_T, 0, 320)}"/><rect x="${G}" y="${HORIZON_T - 2}" width="${D_ - G}" height="${D_ - HORIZON_T}" fill="url(#${p}mmer)"/>`;
  const rangee = (y, a, w, c, i) => {
    const haut = courbe(t => { const x = G + (D_ - G) * t, ph = (x / w + i * 0.37) % 1; return [x, y - a * Math.pow(1 - Math.abs(ph * 2 - 1), 1.8)]; }, 90);
    let r = decoupe(D, [...haut, [D_, y + 90], [G, y + 90]], c[0], { seed: 100 + i, amp: 0.8, bord: c[1], bordN: 91, texture: `${p}mmer`, ombre: 0.5 });
    // les crêtes qui s'enroulent, une sur deux
    for (let x = G + w * (1 - ((i * 0.37) % 1)) - w / 2; x < D_; x += w * 2) r += `<path d="${spirale(x - 2, y - a - 1, a * 0.32, -1, 1.2)}" fill="none" stroke="${c[1]}" stroke-width="1.3" stroke-linecap="round" opacity="0.85"/>`;
    return r;
  };
  s += rangee(HORIZON_T + 8, 8, 40, ['#1A2850', '#7A90C0'], 0) + rangee(HORIZON_T + 24, 13, 58, ['#15224A', '#8AA0CE'], 1) + rangee(HORIZON_T + 44, 18, 80, ['#101C40', '#9AB0DA'], 2) + rangee(HORIZON_T + 70, 24, 110, ['#0C1636', '#AAC0E4'], 3);
  return D.out(s);
}
// la lame qui grossit au large : une montagne d'eau, ses bandes plus claires, sa crête qui se recourbe, des griffes d'écume
// (dessinée haute ; le jeu la tient cachée sous l'horizon, puis la fait monter)
function vagueLoin(p) {
  const D = Defs(`${p}v`);
  let s = papiers(`${p}v`);
  // son dos (de la droite, au large, jusqu'au sommet), sa crête qui se recourbe vers nous, le creux sous la crête, sa face
  const dos = courbe(t => [450 - 290 * t, 250 - 230 * Math.sin((t * Math.PI) / 2) ** 1.6], 26);
  const crete = courbe(t => [160 - 120 * t, 20 - 16 * Math.sin(t * Math.PI) + 58 * t * t], 14).slice(1);
  const creux = courbe(t => [40 + 66 * t - 20 * t * t, 78 + 26 * t + 30 * t * t], 10).slice(1);
  const face = courbe(t => [86 - 140 * t, 134 + 140 * t * t], 12).slice(1);
  const corps = [...dos, ...crete, ...creux, ...face, [G - 30, 300], [G - 30, 330], [450, 330]];
  s += decoupe(D, corps, D.lin([[0, '#3E5E9C'], [0.4, '#1E3462'], [1, '#0A1430']], 0, 30, 0, 300), { seed: 110, amp: 1, bord: '#A8BEE4', bordN: dos.length + crete.length, texture: `${p}vmer`, ombre: 0.6, dy: 6 });
  // les bandes claires qui filent le long du dos, vers la crête
  for (let i = 0; i < 4; i++) {
    const k = 0.18 + i * 0.16, b = courbe(t => [450 - 290 * t * (1 - k * 0.25), 250 - 230 * Math.sin((t * Math.PI) / 2) ** 1.6 + 70 * k + 10 * Math.sin(t * 8 + i)], 20);
    s += piece(D, [...b, ...b.slice().reverse().map(([x, y], j) => [x + 4, y + 5 + 3 * i * (j / b.length)])], ['#4A64A0', '#3A5490', '#30487E', '#283E6E'][i], { seed: 111 + i, amp: 0.6, encre: 0.7 });
  }
  // l'écume de la crête : une bande blanche festonnée, des griffes qui se recourbent vers nous
  const bord = [...dos.slice(-8), ...crete];
  const dessous = bord.map(([x, y], j) => [x + 3, y + 9 + 4 * Math.sin(j * 1.9)]).reverse();
  s += piece(D, [...bord, ...dessous], '#E6EEF8', { seed: 115, amp: 0.8, encre: 1.1, bord: '#FFFFFF', bordN: bord.length });
  for (let i = 0; i < 7; i++) {
    const [x, y] = crete[Math.min(crete.length - 1, 2 + i * 2)] || crete[crete.length - 1], l = 16 + 6 * hash(i, 4);
    const griffe = courbe(t => [x - l * 0.9 * t, y - 4 + l * 1.1 * t * t], 6);
    s += piece(D, [...griffe, ...griffe.slice(0, -1).reverse().map(([gx, gy], j) => [gx + 4 - j * 0.6, gy - 3 + j * 0.4])], '#F2F6FC', { seed: 116 + i, amp: 0.4, encre: 1 });
  }
  s += `<path d="${spirale(66, 92, 16, -1, 1.6)}" fill="none" stroke="#C8D8F0" stroke-width="2.4" stroke-linecap="round"/>`;
  // des traînées d'écume sur la face
  for (let i = 0; i < 6; i++) s += `<path d="M${f(150 + i * 40)},${f(120 + i * 22)} q-30,20 -54,58" fill="none" stroke="#A8BEE4" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/>`;
  return D.out(s);
}
// le pont de l'Hirondelle : le plancher mouillé, le bastingage blanc, la bouée, le mât et ses haubans, un canot de
// sauvetage pendu à ses bossoirs
function pontHirondelle(p) {
  const D = Defs(`${p}p`), C = TEMPETE;
  let s = papiers(`${p}p`);
  // le canot de sauvetage, à gauche, par-dessus bord : ses bossoirs, ses filins
  const bossoirs = 'M-30,250 Q-34,150 30,142 M96,250 Q92,154 150,146';
  s += `<path d="${bossoirs}" fill="none" stroke="${ENCRE}" stroke-width="7" stroke-linecap="round"/><path d="${bossoirs}" fill="none" stroke="#C8C2B4" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M30,142 L22,186 M150,146 L136,188" stroke="${ENCRE}" stroke-width="1.2"/>`;
  s += decoupe(D, [[-6, 184], [160, 188], [150, 212], [124, 226], [10, 224], [-6, 210]], '#EEE8DA', { seed: 120, amp: 0.8, bord: '#FFFFFF', bordN: 2 });
  s += piece(D, [[-4, 202], [154, 202], [150, 210], [-4, 210]], '#E8662E', { seed: 121, amp: 0.4, encre: 0.8 });
  // le plancher : des lattes de bois qui filent vers le point de fuite
  const fuite = [200, 110], y0 = 296;
  for (let i = -7; i <= 7; i++) {
    const xa = 200 + i * 62, xb = 200 + (i + 1) * 62, at = x => fuite[0] + (x - fuite[0]) * ((y0 - fuite[1]) / (D_ - fuite[1]));
    s += piece(D, [[at(xa), y0], [at(xb), y0], [xb, D_], [xa, D_]], (i + 7) % 2 ? C.bois : '#634634', { seed: 130 + i, amp: 0.5, texture: `${p}pbois`, encre: 1.1 });
  }
  // le plancher luisant de pluie : les reflets des guirlandes
  for (let i = 0; i < 7; i++) s += `<path d="M${f(30 + i * 52)},${f(330 + 30 * hash(i, 1))} q4,10 0,22" stroke="${['#FFD15A', '#F27A5A', '#7EC4E8', '#9BE07A'][i % 4]}" stroke-width="3" opacity="0.28" stroke-linecap="round"/>`;
  // le bastingage : ses montants, sa lisse du milieu, sa rambarde
  for (let i = 0; i < 11; i++) { const x = -26 + i * 46; s += decoupe(D, [[x, 250], [x + 8, 250], [x + 8, 300], [x, 300]], C.rampe, { seed: 140 + i, amp: 0.4, encre: 1.2, ombre: 0.4 }); }
  s += decoupe(D, [[G, 276], [D_, 274], [D_, 280], [G, 282]], '#D4CCBA', { seed: 151, amp: 0.4, encre: 1 });
  s += decoupe(D, [[G, 242], [D_, 238], [D_, 252], [G, 256]], C.rampe, { seed: 152, amp: 0.6, bord: '#FFFFFF', bordN: 2, ombre: 0.5, dy: 4 });
  // la bouée de l'Hirondelle, accrochée à la rambarde
  s += decoupe(D, ovale(86, 270, 24, 24, 20), '#F4EEDF', { seed: 153, amp: 0.5 });
  for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + 0.4; s += piece(D, [[86 + Math.cos(a) * 12, 270 + Math.sin(a) * 12], [86 + Math.cos(a) * 24, 270 + Math.sin(a) * 24], [86 + Math.cos(a + 0.75) * 24, 270 + Math.sin(a + 0.75) * 24], [86 + Math.cos(a + 0.75) * 12, 270 + Math.sin(a + 0.75) * 12]], '#E2502E', { seed: 154 + k, amp: 0.3, encre: 0.8 }); }
  s += piece(D, ovale(86, 270, 12, 12, 14), C.bois, { seed: 158, amp: 0.3 });
  // le mât, ses cerclages, ses haubans
  s += `<path d="M330,-40 L120,244 M338,-40 L404,240 M330,30 L220,242" stroke="${ENCRE}" stroke-width="1.3" opacity="0.8"/>`;
  s += decoupe(D, [[322, G], [340, G], [342, 302], [320, 302]], '#C9B08A', { seed: 160, amp: 0.6, texture: `${p}pbois`, bord: '#E8D4B0', bordN: 1, dy: 4 });
  for (const y of [60, 150, 236]) s += piece(D, [[319, y], [343, y], [343, y + 6], [319, y + 6]], '#4A4A52', { seed: 161 + y, amp: 0.3, encre: 0.8 });
  return D.out(s);
}
// le haut-parleur du capitaine, sur le mât : un pavillon de métal sur son support (son pivot : l'attache)
function hautParleur(p) {
  const D = Defs(`${p}h`);
  let s = `<path d="M322,96 L300,100" stroke="${ENCRE}" stroke-width="5" stroke-linecap="round"/><path d="M322,96 L300,100" stroke="#8A8E96" stroke-width="3" stroke-linecap="round"/>`;
  s += decoupe(D, [[304, 92], [300, 110], [262, 132], [252, 76]], D.lin([[0, '#B8BEC6'], [1, '#5E646E']], 250, 80, 300, 120), { seed: 170, amp: 0.6, bord: '#E8ECF2', bordN: 2 });
  s += piece(D, ovale(256, 104, 7, 28, 14, 0), '#14161C', { seed: 171, amp: 0.5 });
  s += `<path d="M300,104 q14,30 22,60" fill="none" stroke="${ENCRE}" stroke-width="1.4"/>`;
  return D.out(s);
}
// les guirlandes de la croisière, du mât vers la poupe : leurs ampoules qui se balancent (son pivot : le mât)
function guirlandes(p) {
  const D = Defs(`${p}g`);
  let s = '';
  const fil = (x0, y0, x1, y1, creux, i) => {
    const pt = t => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + creux * 4 * t * (1 - t)];
    let g = `<path d="M${courbe(pt, 20).map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}" fill="none" stroke="${ENCRE}" stroke-width="1.4"/>`;
    for (let k = 1; k < 10; k++) {
      const [x, y] = pt(k / 10), c = ['#FFD15A', '#F27A5A', '#7EC4E8', '#9BE07A'][(k + i) % 4];
      g += `<circle cx="${f(x)}" cy="${f(y + 9)}" r="11" fill="${D.rad([[0, c, 0.45], [1, c, 0]], x, y + 9, 11)}"/>`;
      g += `<path d="M${f(x)},${f(y)} l0,4" stroke="${ENCRE}" stroke-width="1.2"/>` + piece(D, ovale(x, y + 9, 3.6, 5, 10), c, { seed: 180 + k + i * 10, amp: 0.3, encre: 1 });
    }
    return g;
  };
  s += fil(330, 40, G - 20, 56, 56, 0) + fil(330, 118, G - 20, 100, 34, 1);
  return D.out(s);
}
// l'éclair : le ciel qui blanchit, et la foudre, au loin
function eclair(p) {
  const D = Defs(`${p}e`);
  const zig = [[150, G], [138, 40], [156, 52], [126, 130], [146, 138], [116, 214]];
  return D.out(`<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.rad([[0, '#E8F0FF', 0.75], [1, '#9AB0E0', 0.35]], 140, 80, 420)}"/>`
    + `<path d="M${zig.map(q => q.join(',')).join(' L')}" fill="none" stroke="#C8D8FF" stroke-width="7" stroke-linejoin="bevel" opacity="0.5"/><path d="M${zig.map(q => q.join(',')).join(' L')} M126,130 L98,170" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linejoin="bevel"/>`);
}
// tout près, au premier plan (flou) : un rouleau de cordage, un taquet
function premierPont(p) {
  const D = Defs(`${p}f`);
  let s = '';
  for (let k = 0; k < 4; k++) s += `<ellipse cx="40" cy="${404 - k * 9}" rx="${70 - k * 8}" ry="${26 - k * 3}" fill="none" stroke="#1E140C" stroke-width="12"/><ellipse cx="40" cy="${404 - k * 9}" rx="${70 - k * 8}" ry="${26 - k * 3}" fill="none" stroke="#8A6A44" stroke-width="8"/>`;
  s += piece(D, [[320, 430], [330, 396], [300, 392], [302, 384], [392, 384], [394, 392], [364, 396], [374, 430]], '#3A3C44', { seed: 190, amp: 0.6 });
  return D.out(s);
}
// ce qui vit sur le pont : la pluie en trois rideaux (chacun glisse en boucle), des ampoules qui grésillent
function vivantPont(p, force = 1) {
  let s = '';
  [[1, 0.9, 0.55], [0.7, 1.3, 0.4], [0.45, 1.9, 0.28]].forEach(([k, dur, op], j) => {
    let traits = '';
    for (let i = 0; i < Math.round(46 * force * k + 10); i++) { const x = hash(i, 201 + j) * 520 - 60, y = hash(i, 211 + j) * 400, l = 14 + 22 * k; traits += `M${f(x)},${f(y)} l${f(-l * 0.28)},${f(l)} `; }
    s += `<g opacity="${f(op)}"><animateTransform attributeName="transform" type="translate" from="0 -400" to="-112 0" dur="${f(dur)}s" repeatCount="indefinite"/><path d="${traits}" stroke="#B8C8E8" stroke-width="${f(0.8 + k)}" stroke-linecap="round"/><path d="${traits}" transform="translate(112 -400)" stroke="#B8C8E8" stroke-width="${f(0.8 + k)}" stroke-linecap="round"/></g>`;
  });
  return s;
}
// les ampoules qui grésillent (des taches de lumière sur le fil du haut, qui s'éteignent et se rallument)
const gresille = (p) => [3, 6, 8].map((k, i) => { const t = k / 10, x = 330 + (G - 20 - 330) * t, y = 40 + 20 * t + 60 * 4 * t * (1 - t) + 9; return `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#0A0C18" opacity="0"><animate attributeName="opacity" values="0;0;0.85;0;0.85;0" keyTimes="0;0.6;0.62;0.7;0.72;1" dur="${f(2.4 + i * 0.9)}s" repeatCount="indefinite"/></circle>`; }).join('');

// 01_pont — l'Hirondelle, troisième nuit de croisière : le pont dans la tempête, le capitaine au haut-parleur. Le ciel
// et la mer roulent ; la lame grossit au large de réplique en réplique ; le choc (« la coque est perforée ») secoue
// tout ; au dernier message, le haut-parleur grésille, se décroche, et la lame se dresse
function pont01() {
  const p = 'pon';
  const roule = { pivot: [200, HORIZON_T] };
  const T = [4200, 5200, 5200, 3600];
  // la lame : cachée sous l'horizon (y : 190), elle monte de temps en temps
  const lame = [[190, 190], [190, 150], [150, 110], [110, -10]];
  const mer = T.map((d, i) => houle(d, [4, 5, 5, 3][i], [[2.5, 4, 3.5, 7][i], [3, 5, 4, 8][i]]));
  const vague = T.map((d, i) => houle(d, [4, 5, 5, 3][i], [[2.5, 4, 3.5, 7][i], [3, 5, 4, 8][i]], t => ({}))
    .map(([t, c]) => [t, { ...c, y: c.y + lame[i][0] + (lame[i][1] - lame[i][0]) * (t / d) }]));
  const ballant = (d, n, a) => cles(d, n, k => ({ r: k % n ? (k % 2 ? a : -a * 0.7) : 0 }));
  const c0 = { x: -16, z: 1.04 }, c1 = { x: 0, z: 1.08 }, c2 = { x: 10, y: -4, z: 1.12 }, c3 = { x: -14, y: -6, z: 1.1 }, c4 = { x: 18, y: -24, z: 1.2, r: -4 };
  return {
    plans: [
      { id: 'ciel', profondeur: 0.08, marge: MARGE, ...roule, dessin: () => cielTempete(p) },
      { id: 'vague', profondeur: 0.2, marge: MARGE, ...roule, dessin: () => vagueLoin(p) },
      { id: 'mer', profondeur: 0.25, marge: MARGE, ...roule, dessin: () => merTempete(p) },
      { id: 'pont', profondeur: 0.7, marge: MARGE, dessin: () => pontHirondelle(p) },
      { id: 'haut-parleur', profondeur: 0.7, marge: MARGE, pivot: [318, 96], dessin: () => hautParleur(p) },
      { id: 'guirlandes', profondeur: 0.7, marge: MARGE, pivot: [330, 80], dessin: () => guirlandes(p) },
      { id: 'anime', profondeur: 0.8, dessin: () => vivantPont(p) + gresille(p) },
      { id: 'premier', profondeur: 1.15, marge: MARGE, flou: 0.35, dessin: () => premierPont(p) },
      { id: 'eclair', profondeur: 0, marge: MARGE, dessin: () => eclair(p) }
    ],
    partition: {
      temps: [
        { duree: T[0], camera: [[0, c0], [T[0], c1]], pistes: { ciel: mer[0], mer: mer[0], vague: vague[0], guirlandes: ballant(T[0], 4, 3), 'haut-parleur': ballant(T[0], 4, 1.5), eclair: eclairs(T[0], [[2400, 0.8]]) } },
        // (le choc : « nous venons de percuter un élément inconnu »)
        { duree: T[1], camera: [[0, c1], ...secousse(260, c1, 7), [T[1], c2]], pistes: { ciel: mer[1], mer: mer[1], vague: vague[1], guirlandes: [[0, { r: 0 }], [260, { r: 0 }], [420, { r: 9 }], [900, { r: -6 }], ...ballant(T[1], 5, 4).slice(2)], 'haut-parleur': [[0, { r: 0 }], [260, { r: 0 }], [330, { r: 6, e: 'linear' }], [400, { r: -5, e: 'linear' }], [480, { r: 3 }], [700, { r: 0 }], [T[1], { r: 0 }]], pont: [[0, { y: 0 }], [260, { y: 0, e: 'linear' }], [330, { y: 5 }], [600, { y: 0 }]], eclair: eclairs(T[1], []) } },
        { duree: T[2], camera: [[0, c2], [T[2], c3]], pistes: { ciel: mer[2], mer: mer[2], vague: vague[2], guirlandes: ballant(T[2], 5, 4), 'haut-parleur': ballant(T[2], 5, 1.5), eclair: eclairs(T[2], [[3200, 0.9]]) } },
        // (« Nous rencontrons des difficultés à manœ… — krrr — Aaah ! » : le haut-parleur se décroche, la lame se dresse)
        { duree: T[3], camera: [[0, c3], [1500, { ...c3, z: 1.12 }], ...secousse(1600, { ...c3, z: 1.12 }, 6, 6), [T[3], c4]], pistes: { ciel: mer[3], mer: mer[3], vague: vague[3], guirlandes: ballant(T[3], 4, 9), 'haut-parleur': [[0, { r: 0 }], [700, { r: 0, e: 'linear' }], [760, { r: 7, e: 'linear' }], [820, { r: -6, e: 'linear' }], [880, { r: 5, e: 'linear' }], [940, { r: -4 }], [1600, { r: 0, e: 'ease-in' }], [1900, { r: 38, e: 'ease-out' }], [2500, { r: 24 }], [3000, { r: 34 }], [T[3], { r: 28 }]], eclair: eclairs(T[3], [[1650, 1], [2900, 0.7]]) } }
      ],
      repos: { duree: 9000, camera: { x: -4, y: 2, z: 0.02 } }
    }
  };
}

// l'écume qui s'abat : un paquet de mer blanche, boursouflé, ses volutes, ses gouttes
function ecumeAbat(p) {
  const D = Defs(`${p}x`);
  let s = '';
  for (let i = 0; i < 14; i++) {
    const x = G + (D_ - G) * (i / 13) + 20 * (hash(i, 1) - 0.5), y = 30 + 110 * hash(i, 2), r = 44 + 36 * hash(i, 3);
    s += decoupe(D, ovale(x, y, r, r * 0.7, 18, hash(i, 4) * 6), i % 3 ? '#E4ECF6' : '#C8D6EA', { seed: 200 + i, amp: 2.4, ombre: 0.35, dy: 5, bord: '#FFFFFF', bordN: 9 });
    s += `<path d="${spirale(x, y - r * 0.4, r * 0.3, i % 2 ? 1 : -1, 1.4)}" fill="none" stroke="#9AB0D0" stroke-width="2" stroke-linecap="round"/>`;
  }
  // le dessous qui dégouline, des gouttes qui partent
  s = decoupe(D, [[G, G], [D_, G], [D_, 150], ...courbe(t => [D_ - (D_ - G) * t, 150 + 46 * Math.sqrt(Math.abs(Math.sin(t * Math.PI * 7))) + 12 * Math.sin(t * 5)], 84)], '#C4D4EA', { seed: 220, amp: 1, ombre: 0.4, dy: 6 }) + s;
  for (let i = 0; i < 14; i++) s += piece(D, ovale(G + hash(i, 7) * (D_ - G), 214 + hash(i, 8) * 40, 3 + 4 * hash(i, 9), 5 + 6 * hash(i, 9), 8), '#E8F0FA', { seed: 230 + i, amp: 0.5, encre: 0.9 });
  return D.out(s);
}
// l'eau qui noie tout : bleu-vert en haut, noire au fond (le début des racines)
const eauNoie = p => { const D = Defs(`${p}w`); return D.out(`<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.lin([[0, '#1B4A5C'], [0.3, '#0E2B3A'], [1, '#03090E']], 0, G, 0, D_)}"/>` + Array.from({ length: 14 }, (_, i) => `<circle cx="${f(hash(i, 1) * 400)}" cy="${f(hash(i, 2) * 400)}" r="${f(2 + 6 * hash(i, 3))}" fill="none" stroke="#BFF0EE" stroke-width="1.2" opacity="0.5"/>`).join('')); };

// 01_vague — la lame s'abat sur le pont : elle se dresse, se recourbe, l'écume nous tombe dessus, l'eau noie l'image
function vague01() {
  const p = 'vag';
  const roule = { pivot: [200, HORIZON_T] };
  const c0 = { x: 18, y: -24, z: 1.2, r: -4 }, c1 = { x: 18, y: -40, z: 1.26, r: -7 };
  const gite = [[0, { r: 0, y: 0 }], [2000, { r: 9, y: -6 }], [2600, { r: 12, y: -10 }]];
  return {
    plans: [
      { id: 'ciel', profondeur: 0.08, marge: MARGE, ...roule, dessin: () => cielTempete(p) },
      { id: 'mer', profondeur: 0.25, marge: MARGE, ...roule, dessin: () => merTempete(p) },
      // (elle bascule autour de sa base, au large : sa crête tombe sur le pont)
      { id: 'vague', profondeur: 0.2, marge: MARGE, pivot: [440, 300], dessin: () => vagueLoin(p) },
      { id: 'pont', profondeur: 0.7, marge: MARGE, dessin: () => pontHirondelle(p) },
      { id: 'haut-parleur', profondeur: 0.7, marge: MARGE, pivot: [318, 96], dessin: () => hautParleur(p) },
      { id: 'guirlandes', profondeur: 0.7, marge: MARGE, pivot: [330, 80], dessin: () => guirlandes(p) },
      { id: 'anime', profondeur: 0.8, dessin: () => vivantPont(p, 1.4) },
      { id: 'premier', profondeur: 1.15, marge: MARGE, flou: 0.35, dessin: () => premierPont(p) },
      { id: 'ecume', profondeur: 1, marge: MARGE, pivot: [200, 120], dessin: () => ecumeAbat(p) },
      { id: 'eau', profondeur: 0, marge: MARGE, dessin: () => eauNoie(p) }
    ],
    partition: {
      temps: [{
        duree: 2600,
        camera: [[0, c0], [1300, c1], ...secousse(1700, c1, 9, 6), [2600, { x: 10, y: -30, z: 1.4, r: -12 }]],
        pistes: {
          ciel: gite, mer: gite,
          // (elle part d'où l'a laissée le pont : en haut, y -10 ; elle grandit vers nous, se recourbe et tombe)
          vague: [[0, { y: -10 }], [1200, { y: 14, s: 1.05, r: 3, e: 'ease-in' }], [1950, { y: 30, s: 1.15, r: -16, e: 'ease-in' }], [2600, { y: 70, s: 1.25, r: -32 }]],
          'haut-parleur': [[0, { r: 28 }], [1700, { r: 44, e: 'ease-out' }], [2600, { r: 30 }]],
          guirlandes: [[0, { r: 0 }], [900, { r: 9 }], [1700, { r: -8, e: 'linear' }], [2600, { r: 14 }]],
          ecume: [[0, { y: -330, s: 0.9, o: 0 }], [1550, { y: -330, s: 0.9, o: 1, e: 'ease-in' }], [2250, { y: 30, s: 1.4, o: 1 }], [2600, { y: 120, s: 1.7, o: 1 }]],
          eau: [[0, { o: 0 }], [1900, { o: 0, e: 'ease-in' }], [2450, { o: 1 }], [2600, { o: 1 }]]
        }
      }]
    }
  };
}

// ——— sous la surface : les racines (01_racines) ———
// une racine : la bande de papier qui suit une courbe de Bézier (p0 → p3), large de w0 à sa base, effilée au bout
function racinePts(p0, c1, c2, p3, w0, n = 22) {
  const bz = t => { const u = 1 - t; return [0, 1].map(j => u * u * u * p0[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p3[j]); };
  const g = [], d = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n, [x, y] = bz(t), [x2, y2] = bz(Math.min(1, t + 0.01)), [x1, y1] = bz(Math.max(0, t - 0.01));
    const l = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / l, ny = (x2 - x1) / l, w = (w0 / 2) * (1 - t) ** 0.85 + 0.8;
    // (des nœuds : la racine se gonfle un peu, par endroits)
    const k2 = 1 + 0.18 * Math.max(0, Math.sin(t * 17));
    g.push([x + nx * w * k2, y + ny * w * k2]); d.push([x - nx * w, y - ny * w]);
  }
  return { pts: [...g, ...d.reverse()], dos: g, bz };
}
// une racine de papier : sombre, son dos pris dans la lumière (le liseré), son écorce, deux radicelles
function racinePapier(D, r, i, couleurs = ['#0E2430', '#020609'], lisere = '#3E8A8A') {
  const { pts, dos, bz } = racinePts(r.base, r.c1, r.c2, r.pointe, r.w);
  let s = '';
  for (let j = 0; j < 2; j++) {
    const t = 0.38 + j * 0.2, [x, y] = bz(t), a = (j ? -1 : 1) * 0.9 + (r.a || 0);
    s += piece(D, racinePts([x, y], [x + 20 * Math.cos(a), y - 24], [x + 36 * Math.cos(a), y - 40], [x + 46 * Math.cos(a + 0.4), y - 56], 12 - 3 * j, 10).pts, '#061620', { seed: 300 + i * 10 + j, amp: 0.6, encre: 1 });
  }
  s += decoupe(D, pts, D.lin([[0, couleurs[1]], [1, couleurs[0]]], r.base[0], r.base[1], r.pointe[0], r.pointe[1]), { seed: 310 + i, amp: 1.2, bord: lisere, bordN: dos.length, ombre: 0.5, dy: 4 });
  for (let j = 0; j < 3; j++) s += `<path d="M${courbe(t => { const [x, y] = bz(0.08 + t * 0.6); return [x + (j - 1) * 6 * (1 - t), y + (j - 1) * 4]; }, 10).map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}" fill="none" stroke="${j === 1 ? '#1E4048' : '#08161E'}" stroke-width="1.1" opacity="0.7"/>`;
  return s;
}
// l'eau, vue d'en dessous : le plafond de lumière de la surface, ses vaguelettes de papier, des rais de lumière
function eauRacines(p) {
  const D = Defs(`${p}e`);
  let s = `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.lin([[0, '#1B4A5C'], [0.22, '#0E2B3A'], [0.6, '#061722'], [1, '#010508']], 0, 0, 0, 400)}"/>`;
  s += piece(D, [[G, G], [D_, G], ...courbe(t => [D_ - (D_ - G) * t, 26 + 5 * Math.sin(t * 19) + 3 * Math.sin(t * 7)], 60)], D.lin([[0, '#9AD8D8'], [1, '#3E8A98']], 0, G, 0, 32), { seed: 320, amp: 0.8, encre: 1 });
  for (let i = 0; i < 9; i++) s += `<path d="M${f(G + i * 56)},${f(34 + 4 * hash(i, 1))} q14,-5 28,0 q12,4 24,-1" fill="none" stroke="#BFF0EE" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/>`;
  for (let i = 0; i < 4; i++) { const x = 20 + i * 110; s += `<path d="M${x},30 L${x + 40},30 L${x + 120},400 L${x + 30},400 Z" fill="${D.lin([[0, '#9FE0D2', 0.12], [1, '#9FE0D2', 0]], 0, 30, 0, 400)}"/>`; }
  return D.out(s);
}
// les racines du fond : immenses, pâles, perdues dans l'eau (peintes floues)
function racinesLoin(p) {
  const D = Defs(`${p}l`);
  return D.out([{ base: [-60, 440], c1: [40, 300], c2: [110, 220], pointe: [178, 120], w: 120 }, { base: [470, 460], c1: [380, 330], c2: [330, 240], pointe: [276, 140], w: 110 }, { base: [200, 470], c1: [230, 380], c2: [300, 330], pointe: [350, 250], w: 70 }]
    .map((r, i) => piece(D, racinePts(r.base, r.c1, r.c2, r.pointe, r.w).pts, '#0C2633', { seed: 330 + i, amp: 2, encre: 0 })).join(''));
}
// la coque de l'Hirondelle, vue d'en dessous, qui crève la surface : sa quille, sa carène rouge, l'hélice, le gouvernail ;
// son projecteur allumé
function coqueDessous(p) {
  const D = Defs(`${p}q`);
  let s = decoupe(D, [[54, 20], [288, 18], [282, 34], [250, 54], [170, 64], [100, 60], [64, 42]], D.lin([[0, '#2A5060'], [1, '#04101A']], 0, 20, 0, 64), { seed: 340, amp: 1, bord: '#4E8A96', bordN: 2, ombre: 0.6, dy: 5 });
  s += piece(D, [[64, 42], [100, 60], [170, 64], [250, 54], [282, 34], [280, 42], [250, 62], [170, 72], [100, 68], [62, 48]], '#5A1E1E', { seed: 341, amp: 0.6, encre: 1.1 });
  s += piece(D, [[96, 66], [250, 58], [250, 63], [96, 72]], '#2A0E10', { seed: 342, amp: 0.4, encre: 0.8 });
  // l'hélice et le gouvernail
  s += piece(D, [[278, 36], [300, 54], [292, 62], [272, 44]], '#06141E', { seed: 343, amp: 0.4 });
  s += piece(D, ovale(276, 50, 3, 12, 10, 0.4), '#8A7A4A', { seed: 344, amp: 0.3, encre: 0.8 }) + piece(D, ovale(276, 50, 12, 3, 10, 0.4), '#8A7A4A', { seed: 345, amp: 0.3, encre: 0.8 });
  // le projecteur
  s += `<circle cx="126" cy="66" r="12" fill="${D.rad([[0, '#F4FFF4', 0.8], [1, '#DFFFF4', 0]], 126, 66, 12)}"/>` + piece(D, ovale(126, 66, 4, 3.4, 10), '#F4FFF8', { seed: 346, amp: 0.2, encre: 1 });
  return D.out(s);
}
// le faisceau du projecteur : des cônes de lumière emboîtés, très doux sur leurs bords (peints flous) ; la lueur qu'il allume
function faisceau(p) {
  const D = Defs(`${p}f`);
  return D.out(`<path d="M126,66 L-10,440 L262,440 Z" fill="${D.lin([[0, '#DFFFF2', 0.4], [0.55, '#9FE0D2', 0.18], [1, '#6FBFB0', 0.03]], 126, 66, 128, 440)}"/>`
    + `<path d="M126,66 L60,440 L190,440 Z" fill="${D.lin([[0, '#F4FFF8', 0.5], [0.5, '#BFF2E4', 0.14], [1, '#BFF2E4', 0]], 126, 66, 128, 440)}"/>`
    + `<ellipse cx="140" cy="270" rx="120" ry="80" fill="${D.rad([[0, '#8FD8C8', 0.3], [1, '#8FD8C8', 0]], 140, 270, 120)}"/>`);
}
// les racines proches, devant
function racinesPres(p) {
  const D = Defs(`${p}r`);
  return D.out([
    { base: [-90, 360], c1: [30, 320], c2: [150, 300], pointe: [250, 196], w: 100, a: 0.3 },
    { base: [500, 330], c1: [400, 290], c2: [320, 330], pointe: [246, 292], w: 90, a: -0.2 },
    { base: [120, 490], c1: [150, 420], c2: [230, 400], pointe: [186, 318], w: 116 }
  ].map((r, i) => racinePapier(D, r, i)).join(''));
}
// la racine qui frappe : tendue vers la quille (sa pose quand elle la touche ; le jeu la fait tourner autour de sa base)
const RACINE_BASE = [-40, 430], QUILLE = [168, 68];
const racineFrappe = p => { const D = Defs(`${p}k`); return D.out(racinePapier(D, { base: RACINE_BASE, c1: [30, 300], c2: [200, 240], pointe: QUILLE, w: 88, a: 0.4 }, 5, ['#12303A', '#010407'], '#5AA8A0')); };
// le choc : l'onde blanche, les bulles qui jaillissent de la quille
function choc(p) {
  const D = Defs(`${p}o`);
  let s = `<circle cx="${QUILLE[0]}" cy="${QUILLE[1]}" r="40" fill="none" stroke="#DFFFF4" stroke-width="4"/><circle cx="${QUILLE[0]}" cy="${QUILLE[1]}" r="26" fill="none" stroke="#DFFFF4" stroke-width="1.6"/>`;
  for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + (hash(i, 71) - 0.5) * 3, v = 30 + hash(i, 73) * 50; s += piece(D, ovale(QUILLE[0] + Math.cos(a) * v, QUILLE[1] + Math.sin(a) * v * 0.6 + 26, 2 + 3 * hash(i, 75), 2 + 3 * hash(i, 75), 8), 'none', { seed: 350 + i, amp: 0.3, encre: 1 }).replace('stroke="#1E1A22"', 'stroke="#E8FFF8"'); }
  return D.out(s);
}
// ce qui vit sous l'eau : la neige marine qui dérive (trois nuées), les bulles qui remontent vers la coque
function vivantRacines() {
  let s = '';
  [[7, 0.5], [9, 0.35], [12, 0.22]].forEach(([dur, op], j) => {
    let pts = '';
    for (let i = 0; i < 26; i++) { const x = hash(i, 401 + j) * 420 - 10, y = hash(i, 411 + j) * 400; pts += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.6 + 1.2 * hash(i, 421 + j))}"/><circle cx="${f(x)}" cy="${f(y + 400)}" r="${f(0.6 + 1.2 * hash(i, 421 + j))}"/>`; }
    s += `<g fill="#CFF6EE" opacity="${op}"><animateTransform attributeName="transform" type="translate" from="0 0" to="${-8 + 6 * j} -400" dur="${dur * 3}s" repeatCount="indefinite"/>${pts}</g>`;
  });
  for (let i = 0; i < 12; i++) {
    const x = f(96 + hash(i, 31) * 70), r = f(1.4 + hash(i, 33) * 2.6), d = f(1.8 + hash(i, 35) * 1.4);
    s += `<circle cx="${x}" cy="190" r="${r}" fill="none" stroke="#DFFFF8" stroke-width="0.8" opacity="0.7"><animateTransform attributeName="transform" type="translate" from="0 0" to="${f(-8 + hash(i, 37) * 16)} -120" dur="${d}s" begin="${f(-hash(i, 39) * d)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.8;0" dur="${d}s" begin="${f(-hash(i, 39) * d)}s" repeatCount="indefinite"/></circle>`;
  }
  return s;
}
const aplat = (p, c) => `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${c}"/>`;

// 01_racines — sous la surface, la coque de l'Hirondelle tangue, son projecteur balaie l'eau ; des racines immenses
// ondulent ; l'une se ramasse en arrière, puis fouette jusqu'à la quille (2,45 s) : l'éclair, l'onde, le projecteur qui
// vacille ; le noir tombe à trois secondes
function racines01() {
  const p = 'rac', CHOC = 2450;
  const tangue = [[0, { r: -3 }], [1100, { r: 2.6 }], [2200, { r: -1.4 }], [CHOC, { r: -1 }], [CHOC + 60, { r: 3, y: -6, e: 'linear' }], [CHOC + 140, { r: -2.4, y: 4, e: 'linear' }], [CHOC + 240, { r: 1.4, y: -2 }], [3000, { r: 0, y: 0 }]];
  const lum = [[0, { r: -12 }], [1400, { r: 8 }], [CHOC, { r: -4, o: 1 }], [CHOC + 40, { r: -4, o: 0.15, e: 'linear' }], [CHOC + 100, { r: -2, o: 0.9, e: 'linear' }], [CHOC + 160, { r: 0, o: 0.1, e: 'linear' }], [CHOC + 260, { r: 2, o: 0.7, e: 'linear' }], [3000, { r: 4, o: 0.2 }]];
  const cam = { x: -6, y: 4, z: 1.02 };
  return {
    plans: [
      { id: 'eau', profondeur: 0.08, marge: MARGE, dessin: () => eauRacines(p) },
      { id: 'loin', profondeur: 0.2, marge: MARGE, flou: 0.25, dessin: () => racinesLoin(p) },
      { id: 'coque', profondeur: 0.4, marge: MARGE, pivot: [170, 40], dessin: () => coqueDessous(p) },
      { id: 'faisceau', profondeur: 0.4, marge: MARGE, flou: 0.3, pivot: [126, 66], dessin: () => faisceau(p) },
      { id: 'anime', profondeur: 0.4, dessin: () => vivantRacines() },
      { id: 'racines', profondeur: 0.65, marge: MARGE, pivot: [200, 420], dessin: () => racinesPres(p) },
      { id: 'frappe', profondeur: 0.4, marge: MARGE, pivot: RACINE_BASE, dessin: () => racineFrappe(p) },
      { id: 'choc', profondeur: 0.4, marge: MARGE, pivot: QUILLE, dessin: () => choc(p) },
      { id: 'eclair', profondeur: 0, marge: MARGE, dessin: () => aplat(p, '#DFFFF4') },
      { id: 'noir', profondeur: 0, marge: MARGE, dessin: () => aplat(p, '#000000') }
    ],
    partition: {
      temps: [{
        duree: 3000,
        camera: [[0, cam], [CHOC, { x: 0, y: 0, z: 1.07 }], ...secousse(CHOC, { x: 0, y: 0, z: 1.07 }, 8, 5), [3000, { x: 0, y: 0, z: 1.09 }]],
        pistes: {
          coque: tangue, faisceau: lum,
          racines: [[0, { r: -1.2 }], [1500, { r: 1.4 }], [3000, { r: -0.6 }]],
          // (elle ondule couchée, se ramasse en arrière, puis fouette jusqu'à la quille)
          frappe: [[0, { r: 50 }], [800, { r: 46 }], [1500, { r: 64, e: 'cubic-bezier(.75,0,1,1)' }], [CHOC, { r: 0, e: 'ease-out' }], [CHOC + 140, { r: -3 }], [3000, { r: 0 }]],
          choc: [[0, { s: 0.2, o: 0 }], [CHOC - 1, { s: 0.2, o: 0, e: 'linear' }], [CHOC, { s: 0.3, o: 1, e: 'ease-out' }], [CHOC + 500, { s: 2.4, o: 0 }], [3000, { s: 2.4, o: 0 }]],
          eclair: [[0, { o: 0 }], [CHOC - 1, { o: 0, e: 'linear' }], [CHOC + 60, { o: 0.5, e: 'ease-out' }], [CHOC + 350, { o: 0 }], [3000, { o: 0 }]],
          noir: [[0, { o: 0 }], [CHOC + 150, { o: 0, e: 'ease-in' }], [3000, { o: 1 }]]
        }
      }]
    }
  };
}

// ——— la grève au couchant, par ses yeux (01_greve, 01_carte) ———
// ce que la mer a rendu de l'Hirondelle, à droite : un morceau de coque (ses lattes blanches, sa bande rouge), une valise
// éventrée et ses habits, la bouée, un transat brisé, une guirlande de la croisière échouée
function debris(p) {
  const D = Defs(`${p}d`);
  let s = papiers(`${p}d`);
  // le morceau de coque, planté de biais dans le sable
  s += decoupe(D, [[268, 300], [356, 268], [366, 284], [276, 318]], '#EEE8DA', { seed: 500, amp: 0.8, bord: '#FFFFFF', bordN: 2, texture: `${p}dbois`, textureA: 0.4 });
  s += piece(D, [[272, 309], [361, 276], [363, 280], [274, 313]], '#C8463A', { seed: 501, amp: 0.4, encre: 0.8 });
  s += `<path d="M300,292 l4,14 M330,280 l4,14" stroke="${ENCRE}" stroke-width="1"/>` + piece(D, [[356, 268], [372, 258], [368, 272], [366, 284]], '#8A6648', { seed: 502, amp: 0.6, encre: 1 });
  // la valise éventrée, ses habits répandus
  s += decoupe(D, [[300, 352], [346, 352], [343, 336], [303, 336]], '#7A4A30', { seed: 503, amp: 0.6, texture: `${p}dbois` });
  s += piece(D, [[303, 336], [290, 312], [338, 306], [343, 336]], '#8E5A3A', { seed: 504, amp: 0.6, texture: `${p}dbois` }) + piece(D, [[306, 336], [314, 326], [324, 332], [334, 324], [340, 336]], '#E8E0D4', { seed: 505, amp: 0.5, encre: 0.9 });
  s += decoupe(D, [[344, 350], [362, 342], [380, 350], [366, 358]], '#4E7AB8', { seed: 506, amp: 0.6, encre: 1, ombre: 0.3 }) + decoupe(D, [[296, 354], [278, 360], [270, 352], [288, 346]], '#E8B84A', { seed: 507, amp: 0.6, encre: 1, ombre: 0.3 });
  // la bouée, à moitié ensablée
  s += decoupe(D, ovale(232, 330, 20, 8, 18), '#F4EEDF', { seed: 508, amp: 0.5, ombre: 0.35 });
  for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + 0.4; s += piece(D, [[232 + Math.cos(a) * 10, 330 + Math.sin(a) * 4], [232 + Math.cos(a) * 20, 330 + Math.sin(a) * 8], [232 + Math.cos(a + 0.7) * 20, 330 + Math.sin(a + 0.7) * 8], [232 + Math.cos(a + 0.7) * 10, 330 + Math.sin(a + 0.7) * 4]], '#E2502E', { seed: 509 + k, amp: 0.3, encre: 0.7 }); }
  s += piece(D, ovale(232, 330, 9, 3.4, 12), '#9C6A62', { seed: 513, amp: 0.3, encre: 0.8 });
  // le transat brisé, sa toile rayée
  s += `<path d="M380,320 L404,296 M392,326 L414,300" stroke="${ENCRE}" stroke-width="4" stroke-linecap="round"/><path d="M380,320 L404,296 M392,326 L414,300" stroke="#C8A878" stroke-width="2.4" stroke-linecap="round"/>`;
  s += decoupe(D, [[384, 312], [404, 292], [416, 302], [394, 322]], '#E8E2D4', { seed: 514, amp: 0.6, ombre: 0.35 });
  for (let k = 0; k < 3; k++) s += piece(D, [[388 + k * 7, 308 - k * 7], [392 + k * 7, 304 - k * 7], [402 + k * 7, 312 - k * 7], [398 + k * 7, 316 - k * 7]], '#3E78C8', { seed: 515 + k, amp: 0.3, encre: 0.6 });
  // la guirlande du pont, échouée : son fil emmêlé, ses ampoules éteintes
  const fil = courbe(t => [150 + 110 * t, 362 + 8 * Math.sin(t * 9) + 10 * t], 24);
  s += `<path d="M${fil.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}" fill="none" stroke="${ENCRE}" stroke-width="1.2"/>`;
  fil.filter((_, k) => k % 4 === 2).forEach(([x, y], k) => { s += piece(D, ovale(x + 2, y + 4, 2.6, 3.6, 8, 0.6), ['#C8A040', '#B85A48', '#5A90B0', '#78A85A'][k % 4], { seed: 518 + k, amp: 0.2, encre: 0.8 }); });
  // (le tout un peu rentré dans l'image : le regard s'y pose sans qu'il touche le bord)
  return D.out(`<g transform="translate(-50 -10)">${s}</g>`);
}
// le bord du regard : plus sombre, chaud (on vient de rouvrir les yeux)
const regard = p => { const D = Defs(`${p}g`); return D.out(`<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.rad([[0, '#FFD8A0', 0], [0.72, '#3A1E2E', 0.16], [1, '#1A0E18', 0.6]], 200, 210, 300)}"/>`); };

// 01_greve — le regard glisse : de l'horizon doré, à gauche, jusqu'aux débris de l'Hirondelle, à droite ; il s'y pose
function greve01() {
  const p = 'gre';
  const ciel = cielCouchant(p), mer = merCouchant(p), plage = plageCouchant(p);
  return {
    plans: [
      { id: 'ciel', profondeur: 0.12, marge: MARGE, dessin: () => ciel },
      { id: 'mer', profondeur: 0.3, marge: MARGE, dessin: () => mer },
      { id: 'plage', profondeur: 0.55, marge: MARGE, dessin: () => plage },
      { id: 'anime', profondeur: 0.3, dessin: () => vivantCouchant(p) },
      { id: 'debris', profondeur: 0.62, marge: MARGE, dessin: () => debris(p) },
      { id: 'premier', profondeur: 1, marge: MARGE, flou: 0.3, dessin: () => premierPlan(p) },
      { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regard(p) }
    ],
    partition: {
      temps: [{ duree: 6400, camera: [[0, { x: -80, y: -6, z: 1.32 }], [1100, { x: -76, y: -6, z: 1.32 }], [6400, { x: 64, y: 8, z: 1.34 }]] }],
      repos: { duree: 9000, camera: { x: -5, y: 2, z: 0.02 } }
    }
  };
}

// ——— la carte d'embarquement, sur le sable (01_carte, 00_tampon) ———
// où est posée la carte (320 × 210) sur le sable du gros plan : son centre, son angle, son échelle
const CARTE = { x: 200, y: 206, a: -14, k: 0.82 };
const surCarte = corps => `<g transform="translate(${CARTE.x} ${CARTE.y}) rotate(${CARTE.a}) scale(${CARTE.k}) translate(-160 -105)">${corps}</g>`;
// le sable mouillé de près, doré par le couchant : ses rides de papier, son grain, la lumière rasante ; empreinte : la
// trace humide qu'y laisse la carte
function sablePres(p, empreinte = false) {
  const D = Defs(`${p}s`);
  let s = papiers(`${p}s`) + `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.lin([[0, '#CC946E'], [0.5, '#B47C60'], [1, '#7E5046']], 0, G, 140, D_)}"/>`;
  for (let i = 0; i < 10; i++) {
    const y = G + 10 + i * 48, ride = courbe(t => [G + (D_ - G) * t, y + 7 * Math.sin(t * 8 + i) + 4 * Math.sin(t * 21)], 40);
    s += piece(D, [...ride, ...ride.slice().reverse().map(([x, yy]) => [x, yy + 12])], i % 2 ? '#C08A68' : '#B88262', { seed: 600 + i, amp: 0.6, encre: 0.7, bord: '#ECC29A', bordN: 41, texture: `${p}sroc`, textureA: 0.5 });
  }
  for (let i = 0; i < 26; i++) s += piece(D, ovale(G + hash(i, 81) * (D_ - G), G + hash(i, 83) * (D_ - G), 1.2 + 2 * hash(i, 85), 1 + 1.6 * hash(i, 85), 7), hash(i, 87) < 0.5 ? '#F2CFA6' : '#6A443A', { seed: 620 + i, amp: 0.3, encre: 0 });
  // un coquillage, un brin d'algue
  s += piece(D, courbe(t => [60 + 12 * Math.cos(Math.PI + t * Math.PI), 340 - 14 * Math.sin(t * Math.PI)], 10), '#F2DCC8', { seed: 650, amp: 0.3 }) + `<path d="M330,350 q16,-10 34,-2 t30,-4" fill="none" stroke="#3E4A2A" stroke-width="5" stroke-linecap="round"/>`;
  if (empreinte) s += surCarte(`<rect x="0" y="0" width="320" height="210" rx="10" fill="#6E4438" opacity="0.5"/><rect x="8" y="8" width="304" height="194" rx="8" fill="#5E3A30" opacity="0.25"/>`);
  s += `<rect x="${G}" y="${G}" width="${D_ - G}" height="${D_ - G}" fill="${D.rad([[0, '#FFD08A', 0.42], [1, '#FFD08A', 0]], 40, 40, 380)}"/>`;
  return D.out(s);
}
// la carte trempée, posée sur le sable, son ombre de papier
const carteSable = () => surCarte(`<rect x="5" y="9" width="320" height="210" rx="10" fill="#3A2016" opacity="0.32"/>${CE.carte('trempee')}`);
// l'eau qui vient lécher le haut du gros plan : le sable plus sombre et luisant, la dentelle d'écume (jamais sur la carte)
function ecumeCoin(p) {
  const D = Defs(`${p}u`);
  const bord = courbe(t => [G + (D_ - G) * t, 34 + 10 * Math.sin(t * 7 + 1) + 5 * Math.sin(t * 19)], 60);
  let s = piece(D, [[G, G - 60], [D_, G - 60], ...bord.slice().reverse()], D.lin([[0, '#7E5248'], [1, '#A06C5C']], 0, G, 0, 50), { seed: 660, amp: 0.6, encre: 0.8 });
  for (let i = 0; i < 6; i++) s += `<path d="M${f(G + 20 + i * 80)},${f(4 + 10 * hash(i, 1))} q20,-4 40,0" fill="none" stroke="#FFE2C0" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/>`;
  s += piece(D, [...bord, ...bord.slice().reverse().map(([x, y], k) => [x, y - 6 - 3 * Math.abs(Math.sin(k * 0.9))])], '#FFF4E6', { seed: 661, amp: 0.5, encre: 0.9 });
  for (let i = 0; i < 12; i++) { const [x, y] = bord[3 + i * 4]; s += piece(D, ovale(x, y + 5 + 4 * hash(i, 2), 2 + 2 * hash(i, 3), 1.4 + hash(i, 3), 8), '#FFF4E6', { seed: 662 + i, amp: 0.2, encre: 0.7 }); }
  return D.out(s);
}
// la tache blanche, au loin, sur le sable : la carte, toute petite
const TACHE = [128, 296];
const tache = p => { const D = Defs(`${p}t`); return D.out(`<g transform="rotate(-12 ${TACHE[0]} ${TACHE[1]})">${piece(D, [[TACHE[0] - 6, TACHE[1] - 3.6], [TACHE[0] + 6, TACHE[1] - 3.6], [TACHE[0] + 6, TACHE[1] + 3.6], [TACHE[0] - 6, TACHE[1] + 3.6]], '#F6EEDC', { seed: 670, amp: 0.2, encre: 0.7 })}<rect x="${TACHE[0] - 6}" y="${TACHE[1] - 3.6}" width="12" height="2.2" fill="#2E4E8C"/></g>`); };
// la lueur de la tache (ce qui vit au loin) et l'éclat qui accroche le couchant
const vivantTache = () => `<circle cx="${TACHE[0] + 4}" cy="${TACHE[1] - 2}" r="2.4" fill="#FFFFFF"><animate attributeName="opacity" values="0.2;1;0.4;0.2" dur="1.6s" repeatCount="indefinite"/><animate attributeName="r" values="1.4;3.4;1.8;1.4" dur="1.6s" repeatCount="indefinite"/></circle><path d="M${TACHE[0] + 4},${TACHE[1] - 9} v14 M${TACHE[0] - 3},${TACHE[1] - 2} h14" stroke="#FFFFFF" stroke-width="0.8" opacity="0"><animate attributeName="opacity" values="0;0;0.9;0" keyTimes="0;0.5;0.6;1" dur="3.2s" repeatCount="indefinite"/></path>`;

// 01_carte — « Ah, il y a quelque chose, là-bas » : une tache blanche au loin, le regard s'en approche ; « C'est ma carte
// d'embarquement… » : il plonge, le gros plan la montre, trempée ; « Regardons quand même » : le regard s'y attarde,
// l'eau vient lécher le coin
function carte01() {
  const p = 'car';
  const ciel = cielCouchant(p), mer = merCouchant(p), plage = plageCouchant(p);
  // (la caméra qui plonge vers la tache : à chaque zoom, la tache au centre ; d : la profondeur du sable)
  const d = 0.55, vise = (z, part = 1) => { const S = 1 + (z - 1) * d; return { x: Math.round(part * S * (TACHE[0] - 200) / d), y: Math.round(part * S * (TACHE[1] - 200) / d), z }; };
  const c0 = { x: -20, y: 0, z: 1.1 }, c1 = vise(1.35, 0.62), c2 = vise(2), c3 = vise(4.5);
  const pres = (cles) => ({ 'sable-pres': cles, carte: cles });
  const cache = T => [[0, { o: 0 }], [T, { o: 0 }]];
  return {
    plans: [
      { id: 'ciel', profondeur: 0.12, marge: MARGE, dessin: () => ciel },
      { id: 'mer', profondeur: 0.3, marge: MARGE, dessin: () => mer },
      { id: 'plage', profondeur: d, marge: MARGE, dessin: () => plage },
      { id: 'tache', profondeur: d, marge: MARGE, dessin: () => tache(p) },
      { id: 'anime', profondeur: d, dessin: () => vivantTache() },
      // (le gros plan : il ne suit pas la caméra, il a ses propres mouvements)
      { id: 'sable-pres', profondeur: 0, marge: MARGE, dessin: () => sablePres(p) },
      { id: 'carte', profondeur: 0, marge: MARGE, pivot: [CARTE.x, CARTE.y], dessin: () => carteSable() },
      { id: 'ecume', profondeur: 0, marge: MARGE, dessin: () => ecumeCoin(p) },
      { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regard(p) }
    ],
    partition: {
      temps: [
        { duree: 5000, camera: [[0, c0], [800, c0], [5000, c1]], pistes: { ...pres(cache(5000)), ecume: cache(5000) } },
        { duree: 2600, camera: [[0, c1], [1000, { ...c2, e: 'ease-in' }], [1900, c3], [2600, c3]], pistes: { ...pres([[0, { o: 0, s: 1.3 }], [1000, { o: 0, s: 1.3, e: 'ease-out' }], [1800, { o: 1, s: 1.06 }], [2600, { o: 1, s: 1 }]]), ecume: [[0, { o: 0, y: -60 }], [1000, { o: 0, y: -60 }], [1800, { o: 1, y: -50 }], [2600, { o: 1, y: -60 }]] } },
        { duree: 8000, pistes: { ...pres([[0, { o: 1, s: 1 }], [8000, { o: 1, s: 1.07 }]]), ecume: [[0, { o: 1, y: -60 }], [2600, { o: 1, y: 0 }], [4600, { o: 1, y: -50 }], [7000, { o: 1, y: -8 }], [8000, { o: 1, y: -40 }]] } }
      ],
      repos: { duree: 9000, camera: { x: -6, y: 3, z: 0.02 } }
    }
  };
}

// le tampon de bois, seul (vu d'en haut, posé sur la carte : le jeu le fait descendre de plus haut, plus grand) : son
// bloc, son caoutchouc rouge qui dépasse, son col et son pommeau tourné
const TAMPON_ICI = (() => { const a = (CARTE.a * Math.PI) / 180, x = (196 - 160) * CARTE.k, y = (176 - 105) * CARTE.k; return [CARTE.x + x * Math.cos(a) - y * Math.sin(a), CARTE.y + x * Math.sin(a) + y * Math.cos(a)]; })();
function outilTampon(p) {
  const D = Defs(`${p}h`), [tx, ty] = TAMPON_ICI;
  let s = `<g transform="translate(${f(tx)} ${f(ty)}) rotate(${CARTE.a - 11})">`;
  s += piece(D, [[-40, -14], [40, -14], [40, 18], [-40, 18]], '#C8463A', { seed: 701, amp: 0.4, encre: 1 });
  s += decoupe(D, [[-38, -17], [38, -17], [38, 14], [-38, 14]], '#6A4430', { seed: 700, amp: 0.5, texture: `${p}hbois`, bord: '#A47656', bordN: 2, dx: 5, dy: 7, ombre: 0.45 });
  s += `<path d="M-30,-6 L30,-6 M-30,4 L30,4" stroke="#4A2C1E" stroke-width="0.8" opacity="0.6"/>`;
  s += decoupe(D, ovale(0, -2, 12, 11, 14), '#7E5034', { seed: 702, amp: 0.4, dx: 3, dy: 4 });
  s += decoupe(D, ovale(-2, -6, 19, 17, 18), '#9A6A44', { seed: 703, amp: 0.5, bord: '#C89A6E', bordN: 8, texture: `${p}hbois`, dx: 4, dy: 6 });
  s += `<path d="M-12,-14 q8,-6 16,-2" fill="none" stroke="#E8C49A" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>`;
  return D.out(s + '</g>');
}
// le vent du large : des traits et des volutes qui filent, du sable soulevé
function vivantVent() {
  let s = '';
  for (let i = 0; i < 6; i++) { const y = 40 + i * 62, d = 1.4 + hash(i, 2); s += `<path d="M-60,${y} q60,-16 120,0 t120,-4" fill="none" stroke="#FFF2DE" stroke-width="2" stroke-linecap="round" opacity="0.6"><animateTransform attributeName="transform" type="translate" from="-80 20" to="480 -60" dur="${f(d)}s" begin="${f(-hash(i, 3) * d)}s" repeatCount="indefinite"/></path>`; }
  s += volute(spirale(120, 120, 10, 1, 1.6), '#FFF2DE', 2.4, 0, 1.6) + volute(spirale(300, 260, 12, -1, 1.5), '#FFF2DE', 2.8, 1, 1.6);
  let grains = '';
  for (let i = 0; i < 40; i++) grains += `<circle cx="${f(hash(i, 5) * 400)}" cy="${f(hash(i, 6) * 400)}" r="${f(0.8 + hash(i, 7))}"/>`;
  s += `<g fill="#F2CFA6" opacity="0.8"><animateTransform attributeName="transform" type="translate" from="-400 30" to="0 0" dur="1.2s" repeatCount="indefinite"/>${grains}<g transform="translate(400 -30)">${grains}</g></g>`;
  return s;
}

// 00_tampon — sur le sable, la carte qu'on a remplie : le tampon descend et claque « EMBARQUÉ » ; puis
// le vent du large la soulève et l'emporte au loin ; il reste sa trace humide dans le sable
function tampon00() {
  const p = 'tam', HIT = 560;
  const vol = [[0, {}], [1500, {}], [1800, { y: -4, r: -3, s: 1.02 }], [2250, { x: 50, y: -70, r: 18, s: 1.16, e: 'ease-in-out' }], [2850, { x: 170, y: -220, r: 62, s: 1.05 }], [3600, { x: 320, y: -440, r: 120, s: 0.8 }]];
  const coup = [[0, {}], [HIT, { e: 'linear' }], [HIT + 60, { y: 2.4 }], [HIT + 220, {}]];
  const cam = { x: 0, y: 0, z: 1.04 };
  return {
    plans: [
      { id: 'sable-pres', profondeur: 0.2, marge: MARGE, dessin: () => sablePres(p, true) },
      { id: 'carte', profondeur: 0.2, marge: MARGE, pivot: [CARTE.x, CARTE.y], dessin: () => carteSable() },
      { id: 'encre', profondeur: 0.2, marge: MARGE, pivot: [CARTE.x, CARTE.y], dessin: () => surCarte(CE.tampon()) },
      { id: 'tampon', profondeur: 0.35, marge: MARGE, pivot: TAMPON_ICI, dessin: () => outilTampon(p) },
      { id: 'anime', profondeur: 0.3, dessin: () => vivantVent() },
      { id: 'regard', profondeur: 0, marge: MARGE, dessin: () => regard(p) }
    ],
    partition: {
      temps: [{
        duree: 3600,
        camera: [[0, cam], ...secousse(HIT, cam, 4, 4), [1500, cam], [3600, { x: 10, y: -14, z: 1.08 }]],
        pistes: {
          tampon: [[0, { y: -300, x: 60, s: 1.8 }], [HIT, { y: 0, x: 0, s: 1, e: 'linear' }], [HIT + 160, { s: 0.98 }], [HIT + 320, { s: 1, e: 'ease-in' }], [1350, { y: -320, x: 80, s: 1.8 }], [3600, { y: -320, x: 80, s: 1.8 }]],
          carte: [...coup.slice(0, -1), ...vol.slice(1)],
          encre: [[0, { o: 0 }], [HIT, { o: 0, e: 'linear' }], [HIT + 40, { o: 1, y: 2.4 }], [HIT + 220, { o: 1 }], ...vol.slice(1).map(([t, c]) => [t, { ...c, o: 1 }])],
          anime: [[0, { o: 0 }], [1400, { o: 0 }], [1900, { o: 1 }], [3600, { o: 1 }]]
        }
      }]
    }
  };
}

module.exports = { paupieres01, pont01, vague01, racines01, greve01, carte01, tampon00, cielCouchant, merCouchant, plageCouchant, vivantCouchant, MARGE, COUCHANT, HORIZON, RIVAGE, SOLEIL, ENCRE };
