// Le cerf de lune, le compagnon d'Anya (choix de l'auteur, 16 oct.) : un sprite à part, qui se tient à ses côtés.
// Unique, majestueux : grand et élancé (le garrot à la hauteur de sa poitrine), la robe blanc nacré, d'immenses bois
// d'argent qui portent des fleurs et des lucioles, un croissant de lune qui flotte entre eux ; des veines de lumière
// bleutée comme des constellations sur le flanc et l'épaule ; la gorge claire ; les yeux bleu-gris, nobles, l'iris
// cerclé de lumière ; les sabots d'argent. Les couleurs et les effets d'Anya (anya_refonte.js).
// Repère 120 × 144 (ses grands bois demandent de la hauteur ; à la même échelle qu'Anya) : le sabot le plus proche touche
// y = 141. Vues : face (front), trois quarts avant (se), trois quarts dos (ne) ; poses : debout, marche.
const { P, E, clip, r2, OUT } = require('../troupe');
const { fleur, luciole, etoile, lueur } = require('./anya_refonte');
const { ik } = require('./membres');

const C = {
  coat: '#F4F6FA', coatS: '#C9D2E4', coatD: '#AEB9D0', belly: '#FFFFFF',
  antler: '#E8E4DA', antlerS: '#B9B2A2', antlerH: '#FFFFFF', hoof: '#D7DEEA', hoofS: '#9AA6BE',
  nose: '#4E566C', inner: '#E6D6EA', eye: '#26304A', iris: '#7E9CC0', irisD: '#3E5276', irisR: '#D8F0FF', irisO: '#4A5E80',
  vein: '#BFE6FF', star: '#FFFFFF', blossom: '#FFFFFF', blossomC: '#CDE6FF', moon: '#F6FAFF', glow: '200,225,255', silver: '#B9C6DC'
};

// une branche des bois : le trait sombre dessous, l'argent dessus, un reflet
const tige = (d, w, K) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + 1.5)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${K.antler}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// Les bois : deux immenses merrains qui s'ouvrent en lyre et montent, leurs andouillers, des fleurs, des lucioles prises
// dedans ; celui du fond, raccourci par la perspective ; le croissant de lune qui flotte entre eux, au-dessus du front.
// (Le repère de la tête : son axe en x = 82.7.)
function bois(K, n, kf = 0.78) {
  const fond = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(82.7 + (82.7 - x) * kf)},${y}`);
  const merrain = [
    ['M78,12.6 C74,4 66,-1 58,-4 C52,-6 47.6,-9 45.6,-13', 2.4], ['M70.6,1.2 Q68.4,-4 70,-9.8', 1.6], ['M61.4,-2.6 Q58.6,-8 60,-12.8', 1.4],
    ['M66.4,-0.4 Q60.4,2.4 54.6,1.4', 1.2], ['M52.4,-6.4 Q47.4,-6.6 44.4,-4.6', 1.1], ['M76.4,9 Q72.6,9.6 70.6,7.4', 1.2]
  ];
  let s = '';
  for (const [d, w] of merrain) s += tige(fond(d), w * (kf < 1 ? 0.9 : 1), K);
  for (const [d, w] of merrain) s += tige(d, w, K);
  s += `<path d="M76.8,10 C73.4,3.6 66,-0.6 58.6,-3" fill="none" stroke="${K.antlerH}" stroke-width="0.7" stroke-linecap="round" opacity=".85"/>`;
  const fl = [[70, -9.8, 1.2], [60, -12.8, 1.1], [45.6, -13, 1.1], [44.4, -4.6, 0.95], [54.6, 1.4, 0.9], [70.6, 7.4, 0.85]];
  s += fl.map(([x, y, r]) => fleur(+r2(82.7 + (82.7 - x) * kf), y, r * (kf < 1 ? 0.9 : 1), K.blossom, K.blossomC) + fleur(x, y, r, K.blossom, K.blossomC)).join('');
  // des feuilles d'argent, un brin de lierre de lumière qui pend du merrain proche
  s += lueur('M58,-4 Q57,1 58.4,5.6 Q59.4,8.6 58.2,11', K.vein, 0.35, 0.8) + etoile(58.2, 11, 0.8, K.star) + etoile(58.4, 5.6, 0.55, K.star);
  // les lucioles prises dans les bois (elles changent de place d'une image à l'autre)
  s += [[64 + n % 2 * 2, -6], [104 - n % 2 * 2, -6], [50, -1 + n % 2], [96, 2 - n % 2]].map(([x, y]) => luciole(x, y, 0.8)).join('');
  // le croissant de lune, qui flotte et luit doucement au-dessus du front
  const cr = 'M81.4,-6.6 A4.6,4.6 0 1,0 85.6,1.2 A3.7,3.7 0 1,1 81.4,-6.6 Z';
  s += `<g><animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" values="0 0;0 -0.9;0 0" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`
    + `<circle cx="82.4" cy="-2" r="6.4" fill="rgb(${C.glow})" opacity=".35"/><path d="${cr}" fill="${K.moon}" stroke="${K.coatS}" stroke-width="0.5"/></g>`;
  return s;
}

// L'œil de cerf : noble et calme, toujours ouvert : une amande au coin extérieur relevé, la paupière haute bien
// arquée, l'iris bleu-gris en dégradé cerclé de lumière, la pupille au milieu, un reflet et une étincelle ; un cil au coin
// extérieur. k : 1 pour l'œil de gauche (le coin extérieur à gauche), -1 pour celui de droite
function oeil(id, x, y, k, blink) {
  if (blink) return `<path d="M${r2(x - k * 2.6)},${r2(y - 0.2)} Q${r2(x)},${r2(y + 1.3)} ${r2(x + k * 2.3)},${r2(y + 0.4)}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linecap="round"/>`;
  const X = d => r2(x + k * d), ir = `${id}ir`;
  const haut = `M${X(-2.6)},${r2(y - 0.6)} C${X(-1.6)},${r2(y - 2.7)} ${X(1.2)},${r2(y - 2.6)} ${X(2.3)},${r2(y + 0.5)}`;
  const amande = `${haut} C${X(1)},${r2(y + 2.1)} ${X(-1.5)},${r2(y + 2)} ${X(-2.6)},${r2(y - 0.6)} Z`;
  return `<defs><radialGradient id="${ir}" cx=".5" cy=".4" r=".62"><stop offset="0" stop-color="${C.irisD}"/><stop offset=".5" stop-color="${C.iris}"/><stop offset=".8" stop-color="${C.irisR}"/><stop offset="1" stop-color="${C.irisO}"/></radialGradient></defs>`
    + P(amande, '#FFFFFF', 0) + clip(id, amande, E(+X(-0.15), y - 0.15, 1.75, 1.95, `url(#${ir})`, 0) + E(+X(-0.15), y - 0.2, 0.82, 0.95, C.eye, 0)
      + E(+X(-0.75), y - 0.95, 0.55, 0.55, '#FFFFFF', 0) + etoile(+X(0.55), y + 0.55, 0.42, '#FFFFFF'))
    + `<path d="${amande}" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`
    + `<path d="${haut}" fill="none" stroke="${OUT}" stroke-width="1" stroke-linecap="round"/>`
    + `<path d="M${X(-2.55)},${r2(y - 0.65)} l${r2(-k * 1.2)},-0.5" fill="none" stroke="${OUT}" stroke-width="0.7" stroke-linecap="round"/>`;
}

// La tête de trois quarts, portée haut, tournée vers nous : le front large, le long chanfrein, le museau qui s'affine,
// le nez sombre ; les oreilles en feuille sur les côtés ; les veines de lumière qui descendent du front
function tete(K, id, blink, frémit = false) {
  const t = 'M72.6,20 C72.6,13.6 78,11 82.6,11 C87.6,11 92.4,13.8 92.4,20 C92.4,24.6 90.6,28 89.6,31.6 C89,35.8 87.8,39.6 84.4,39.8 C81,40 79.6,36.6 78.8,33 C77.6,28.6 72.6,25.6 72.6,20 Z';
  const oreille = (x, y, sx, k) => `<g transform="translate(${x} ${y}) rotate(${sx * -30}) scale(${k} 1)">${P(`M0,0 Q${sx * -5.4},-3.8 ${sx * -10.4},-1.4 Q${sx * -5.4},3 0,2.8 Z`, K.coat, 0.75)}${P(`M${sx * -1.2},0.7 Q${sx * -5},-1.8 ${sx * -8.4},-0.9 Q${sx * -5},1.8 ${sx * -1.2},1.8 Z`, K.inner, 0)}</g>`;
  let s = (frémit ? `<g transform="rotate(-10 73.6 16.6)">${oreille(73.6, 16.6, 1, 1)}</g>` : oreille(73.6, 16.6, 1, 1)) + oreille(91.6, 16.6, -1, 0.85);
  s += P(t, K.coat) + clip(`${id}t`, t, `<rect x="88.4" y="10" width="8" height="32" fill="${K.coatS}" opacity=".55"/>`
    + E(84.2, 35.6, 4.6, 4, K.belly, 0)
    + lueur('M82.6,12.4 L82.5,17.2 M80,14.6 L82.5,17.2 L85.2,14.8 M82.5,17.2 L82.6,21', K.vein, 0.35, 0.9) + etoile(82.5, 17.2, 0.8, K.star)) + P(t, 'none');
  s += E(84.4, 37.6, 2.7, 1.6, K.nose, 0.5) + E(83.6, 37.1, 0.7, 0.4, '#8A94AE', 0);
  s += P('M82.6,39.8 Q84.4,40.8 86.2,39.8', 'none', 0.5);
  s += oeil(`${id}e0`, 77.6, 22.6, 1, blink) + oeil(`${id}e1`, 88, 22.4, -1, blink);
  return s;
}

// La tête de dos (il s'éloigne) : l'arrière du crâne, la nuque, les deux oreilles vues de dos, la base des bois
function teteDeDos(K, id, frémit) {
  const t = 'M73.6,22 C73.6,14.4 78,11.4 82.6,11.4 C87.4,11.4 91.6,14.4 91.6,22 C91.6,27.4 88.6,31 86,33 L79,33 C76.4,31 73.6,27.4 73.6,22 Z';
  const oreille = (x, y, sx, k) => `<g transform="translate(${x} ${y}) rotate(${sx * -16}) scale(${k} 1)">${P(`M0,0 Q${sx * -5.4},-3.8 ${sx * -10.4},-1.4 Q${sx * -5.4},3 0,2.8 Z`, K.coat, 0.75)}${P(`M${sx * -1.6},0.4 Q${sx * -5},-1.2 ${sx * -8},-0.9`, 'none', 0.45).replace(`stroke="${OUT}"`, `stroke="${K.coatS}"`)}</g>`;
  let s = (frémit ? `<g transform="rotate(-10 74.6 17.6)">${oreille(74.6, 17.6, 1, 1)}</g>` : oreille(74.6, 17.6, 1, 1)) + oreille(90.6, 17.6, -1, 0.9);
  s += P(t, K.coat) + clip(`${id}t`, t, `<rect x="87" y="10" width="8" height="26" fill="${K.coatS}" opacity=".55"/>`
    + lueur('M82.6,14 L82.6,20 M80.2,17 L82.6,20 L85,17', K.vein, 0.35, 0.85) + etoile(82.6, 20, 0.7, K.star)) + P(t, 'none');
  return s;
}

// La gorge : plus claire, comme chez un vrai cerf (choix de l'auteur, 16 oct. : pas de crinière, elle se lisait comme un
// bavoir) ; une tache blanche sous le menton, fondue dans le cou, sans cerne
const gorge = K => `<path d="M79.6,38 Q86,41 85.6,50 Q85,58 82.4,64 Q79.6,58 79,50 Q78.6,43 79.6,38 Z" fill="${K.belly}" opacity=".95"/>`;

// ---- les pattes ----
// Une patte modelée, d'un seul tenant : du haut (dans le corps : il n'est pas cerné, il s'y fond) à l'articulation (le
// genou devant, le jarret derrière, en pointe), au boulet, au sabot d'argent ; épaisse en haut, le canon fin. Ses
// points passent par une ligne adoucie aux articulations ; w : les largeurs en chacun des quatre points
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const vers = (p, q, k) => { const d = dist(p, q) || 1; return [p[0] + (q[0] - p[0]) / d * k, p[1] + (q[1] - p[1]) / d * k]; };
function ligne(pts, w) {
  // la ligne et sa largeur : droite le long des os, arrondie à chaque articulation
  const out = [[...pts[0], w[0]]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1], rr = Math.min(2.6, 0.4 * Math.min(dist(a, b), dist(b, c)));
    const p1 = vers(b, a, rr), p2 = vers(b, c, rr);
    out.push([...p1, w[i]]);
    for (let k = 1; k <= 4; k++) { const t = k / 4, u = 1 - t; out.push([u * u * p1[0] + 2 * u * t * b[0] + t * t * p2[0], u * u * p1[1] + 2 * u * t * b[1] + t * t * p2[1], w[i]]); }
  }
  out.push([...pts[pts.length - 1], w[w.length - 1]]);
  // (des points le long des os, pour que la largeur s'y amincisse doucement)
  const dense = [out[0]];
  for (let i = 1; i < out.length; i++) {
    const a = out[i - 1], b = out[i], n = Math.max(1, Math.round(dist(a, b) / 3));
    for (let k = 1; k <= n; k++) { const t = k / n; dense.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
  }
  return dense;
}
function patte(K, id, L, masque = null) {
  const far = L.far, col = far ? K.coatD : K.coat;
  const pts = ligne([L.top, L.joint, L.fet, L.g], L.w);
  const gauche = [], droite = [];
  pts.forEach((q, i) => {
    const p = pts[Math.max(0, i - 1)], n = pts[Math.min(pts.length - 1, i + 1)], d = dist(p, n) || 1, nx = -(n[1] - p[1]) / d, ny = (n[0] - p[0]) / d;
    gauche.push([q[0] + nx * q[2] / 2, q[1] + ny * q[2] / 2]); droite.push([q[0] - nx * q[2] / 2, q[1] - ny * q[2] / 2]);
  });
  const pt = q => `${r2(q[0])},${r2(q[1])}`;
  const bords = `M${gauche.map(pt).join(' L')} L${[...droite].reverse().map(pt).join(' L')}`;
  const contour = `${bords} Z`;
  // l'ombre du côté loin (à droite, comme tout le cerf), puis le sabot, incliné comme le paturon
  const ombre = `<path d="M${droite.map(q => pt([q[0] - 0.9, q[1]])).join(' L')}" fill="none" stroke="${far ? K.coatS : K.coatS}" stroke-width="1.6" stroke-linecap="round" opacity="${far ? 0.5 : 0.8}"/>`;
  const a = Math.atan2(L.g[1] - L.fet[1], L.g[0] - L.fet[0]) * 180 / Math.PI - 90;
  const hw = L.w[3] / 2 + 0.5;
  const sabot = `<g transform="translate(${r2(L.g[0])} ${r2(L.g[1])}) rotate(${r2(L.posé ? 0 : a)})">${P(`M${r2(-hw)},-2.6 L${r2(-hw - 0.4)},0 L${r2(hw + 0.6)},0 L${r2(hw)},-2.6 Z`, far ? K.hoofS : K.hoof, 0.7)}</g>`;
  const corps = `<path d="${contour}" fill="${col}"/>` + clip(id, contour, ombre)
    + `<path d="${bords}" fill="none" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round" stroke-linecap="round"/>`;
  return (masque ? `<g mask="url(#${masque})">${corps}</g>` : corps) + sabot;
}

// Les pattes de trois quarts avant, au repos : le haut (dans le corps), l'articulation, le boulet, le sabot au sol (g) ;
// les largeurs ; sens : de quel côté plie l'articulation (le genou en avant, le jarret en arrière) ; ph : la phase du pas
// (le pas latéral du cerf : arrière gauche, avant gauche, arrière droit, avant droit ; on voit son flanc gauche)
const PATTES_SE = {
  arriereFond: { top: [37.6, 74.6], joint: [31.8, 96.4], fet: [34.4, 108.8], g: [35, 114], w: [9, 4.4, 3.2, 3], far: true, sens: 1, ph: 0.5 },
  avantFond: { top: [68.2, 80], joint: [68.2, 97.4], fet: [68.4, 110.6], g: [68.6, 116.4], w: [7.8, 4.6, 3.2, 3], far: true, sens: -1, ph: 0.75 },
  arriere: { top: [44, 77], joint: [39, 100.6], fet: [42.4, 114], g: [43, 119.4], w: [12.4, 5, 3.6, 3.4], sens: 1, ph: 0 },
  avant: { top: [75.6, 75], joint: [75.8, 97.6], fet: [76.4, 113.6], g: [77, 121], w: [10.4, 5.4, 3.8, 3.6], sens: -1, ph: 0.25 }
};
// Couché, de trois quarts : les pattes repliées sous lui, le genou en avant, le canon posé au sol vers l'arrière ; la
// patte de derrière, le jarret au sol en arrière, le canon vers l'avant ; celle de l'avant du fond dépasse à peine
const PATTES_COUCHE_SE = {
  avantFond: { top: [70, 106], joint: [76, 115.6], fet: [69.4, 118.4], g: [64, 118.8], w: [7.6, 4.4, 3.2, 3], far: true },
  arriere: { top: [44, 104], joint: [31.4, 117.6], fet: [41.6, 120.6], g: [49, 121], w: [11.4, 5, 3.6, 3.4] },
  avant: { top: [78, 104], joint: [85.6, 116.4], fet: [78, 119.8], g: [71.4, 120.4], w: [9.4, 5, 3.6, 3.4] }
};
const PATTES_COUCHE_FACE = {
  avantG: { top: [54, 106], joint: [52, 115.8], fet: [54.6, 119.6], g: [57.4, 120], w: [9.6, 5.2, 3.8, 3.6] },
  avantD: { top: [70, 106], joint: [72, 115.8], fet: [69.4, 119.6], g: [66.6, 120], w: [9.6, 5.2, 3.8, 3.6] }
};
// Le salut : il incline la tête, le cou descend et s'avance (k : 0 → 1)
const SALUT = [0, 0.6, 1, 0.6];
// Couché : de combien le corps descend
const COUCHE_DY = 30;

// La patte à son pas : le sabot glisse au sol vers l'arrière (l'appui, 60 % du pas), puis se lève et revient vers l'avant
// (le lever) ; l'articulation se place par les longueurs de ses os (membres.js : ik), le boulet plie au lever.
// u : 0 → 1 dans le pas ; f : la direction d'avancée ; A : la demi-foulée ; dy : le corps qui monte et descend
function auPas(L, u, f, A, lift, dy) {
  const l1 = dist(L.top, L.joint), l2 = dist(L.joint, L.g);
  const top = [L.top[0], L.top[1] + dy];
  let g, posé = true, k = 0;
  if (u < 0.6) {
    const p = 1 - 2 * u / 0.6;
    g = [L.g[0] + f[0] * A * p, L.g[1] + f[1] * A * p];
  } else {
    const q = (u - 0.6) / 0.4, e = q * q * (3 - 2 * q), p = -1 + 2 * e;
    k = Math.sin(Math.PI * q);
    g = [L.g[0] + f[0] * A * p, L.g[1] + f[1] * A * p - lift * k];
    posé = false;
  }
  // (de face ou de dos, la patte avance vers nous ou s'éloigne : elle se replie sur elle-même, sans plier de côté)
  const r = f[0] === 0 ? (() => { const k0 = l1 / (l1 + l2); return { milieu: [top[0] + (g[0] - top[0]) * k0, top[1] + (g[1] - top[1]) * k0], bout: g }; })() : ik(top, g, l1, l2, L.sens);
  // le boulet : aux trois quarts du canon, un peu en arrière ; au lever, le paturon se replie vers l'arrière
  const j = r.milieu, b = r.bout, d = dist(j, b) || 1, nx = -(b[1] - j[1]) / d, ny = (b[0] - j[0]) / d;
  const back = -0.6 - k * 2.4;
  const fet = [j[0] + (b[0] - j[0]) * 0.76 + nx * back * Math.sign(f[0] || 1), j[1] + (b[1] - j[1]) * 0.76 + ny * back * Math.sign(f[0] || 1)];
  return { ...L, top, joint: j, fet, g: b, posé };
}
// ---- de face ----
// Il vient vers nous : le poitrail en avant, la crinière au milieu, le cou qui monte droit, la tête de face, les bois
// en lyre de chaque côté (sans raccourci) ; les pattes avant devant, celles de derrière plus haut entre elles et un peu
// en dehors. Axe en x = 62 (dans le repère du cerf)
const PATTES_FACE = {
  arriereG: { top: [49.6, 79], joint: [48.8, 98], fet: [49, 110.4], g: [49.2, 115.6], w: [8, 4.4, 3.2, 3], far: true, sens: 1, ph: 0 },
  arriereD: { top: [74.4, 79], joint: [75.2, 98], fet: [75, 110.4], g: [74.8, 115.6], w: [8, 4.4, 3.2, 3], far: true, sens: 1, ph: 0.5 },
  avantG: { top: [53.8, 74], joint: [53.4, 98], fet: [53.6, 113.6], g: [53.8, 121], w: [11, 5.4, 3.9, 3.6], sens: -1, ph: 0.25 },
  avantD: { top: [70.2, 74], joint: [70.6, 98], fet: [70.4, 113.6], g: [70.2, 121], w: [11, 5.4, 3.9, 3.6], sens: -1, ph: 0.75 }
};
function teteFace(K, id, blink, frémit) {
  const t = 'M52.6,20 C52.6,13.6 57,11 62,11 C67,11 71.4,13.6 71.4,20 C71.4,25 69,28.6 67.6,32 C66.6,36.2 65.4,40 62,40.2 C58.6,40 57.4,36.2 56.4,32 C55,28.6 52.6,25 52.6,20 Z';
  const oreille = (x, y, sx) => `<g transform="translate(${x} ${y}) rotate(${sx * -30})">${P(`M0,0 Q${sx * -5.4},-3.8 ${sx * -10.4},-1.4 Q${sx * -5.4},3 0,2.8 Z`, K.coat, 0.75)}${P(`M${sx * -1.2},0.7 Q${sx * -5},-1.8 ${sx * -8.4},-0.9 Q${sx * -5},1.8 ${sx * -1.2},1.8 Z`, K.inner, 0)}</g>`;
  let s = (frémit ? `<g transform="rotate(-10 53.6 16.6)">${oreille(53.6, 16.6, 1)}</g>` : oreille(53.6, 16.6, 1)) + oreille(70.4, 16.6, -1);
  s += P(t, K.coat) + clip(`${id}t`, t, `<rect x="67" y="10" width="8" height="32" fill="${K.coatS}" opacity=".45"/>`
    + E(62, 35.6, 4.6, 4.2, K.belly, 0)
    + lueur('M62,12.4 L62,17.2 M59.4,14.6 L62,17.2 L64.6,14.6 M62,17.2 L62,21', K.vein, 0.35, 0.9) + etoile(62, 17.2, 0.8, K.star)) + P(t, 'none');
  s += E(62, 37.8, 2.8, 1.6, K.nose, 0.5) + E(61.2, 37.3, 0.7, 0.4, '#8A94AE', 0) + P('M60.2,40 Q62,41 63.8,40', 'none', 0.5);
  s += oeil(`${id}e0`, 56.8, 22.8, 1, blink) + oeil(`${id}e1`, 67.2, 22.8, -1, blink);
  return s;
}
function gorgeFace(K) {
  return `<path d="M57.4,38 Q62,40.6 66.6,38 Q68.6,46 67.4,54 Q65,61 62,64 Q59,61 56.6,54 Q55.4,46 57.4,38 Z" fill="${K.belly}" opacity=".95"/>`;
}
function vueFace(K, id, pose, n, t, blink, br, bob, nod) {
  const walk = pose === 'marche', couche = pose === 'couche', k = pose === 'salut' ? SALUT[n % 4] : 0;
  const leg = key => {
    if (couche) return { ...PATTES_COUCHE_FACE[key], posé: false };
    const L = PATTES_FACE[key];
    return walk ? auPas(L, (t + L.ph) % 1, [0, 1], 2.4, key.startsWith('avant') ? 4 : 3.2, bob) : { ...L, posé: true };
  };
  if (couche) bob = COUCHE_DY;
  let g = `<ellipse cx="62" cy="${couche ? 120 : 118.4}" rx="${couche ? 26 : 22}" ry="4.2" fill="rgba(30,40,70,.2)"/>`;
  if (!couche) g += patte(K, `${id}pa`, leg('arriereG')) + patte(K, `${id}pb`, leg('arriereD'));
  // le ventre, derrière le poitrail (le haut des pattes de derrière s'y cache), le cou, puis le poitrail large et
  // profond, les épaules
  const ventre = 'M46.6,78 C46.6,73 53,70.6 62,70.6 C71,70.6 77.4,73 77.4,78 C77.4,83 71,86 62,86 C53,86 46.6,83 46.6,78 Z';
  const cou = `M55,56 C54.6,46 55.8,${r2(38 + k * 4)} 57,${r2(31 + k * 8)} L67,${r2(31 + k * 8)} C68.2,${r2(38 + k * 4)} 69.4,46 69,56 Z`;
  const poitrail = `M47.6,60 C47.6,${r2(52 + br)} 54.6,${r2(48 + br)} 62,${r2(48 + br)} C69.4,${r2(48 + br)} 76.4,${r2(52 + br)} 76.4,60 C78,70 75.4,79 69,83 C65,85.4 59,85.4 55,83 C48.6,79 46,70 47.6,60 Z`;
  let haut = P(ventre, K.coatS) + P(cou, K.coat) + clip(`${id}k`, cou, `<rect x="64.6" y="30" width="6" height="30" fill="${K.coatS}" opacity=".5"/>`) + P(cou, 'none');
  haut += P(poitrail, K.coat) + clip(`${id}c`, poitrail, `<ellipse cx="62" cy="86" rx="16" ry="6" fill="${K.coatS}" opacity=".85"/><rect x="71.4" y="48" width="8" height="40" fill="${K.coatS}" opacity=".5"/>`
    // les constellations sur les épaules
    + lueur('M50.4,62 L54,66.4 L51.8,72.6 M73.6,62 L70,66.4 L72.2,72.6', K.vein, 0.35, 0.8) + [[54, 66.4], [51.8, 72.6], [70, 66.4], [72.2, 72.6]].map(([x, y]) => etoile(x, y, 0.7, K.star)).join('')) + P(poitrail, 'none');
  g += `<g transform="translate(0 ${bob})">${haut}</g>`;
  g += `<mask id="${id}hors" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="144"><rect x="0" y="0" width="120" height="144" fill="#fff"/><path d="${poitrail}" fill="#000" stroke="#fff" stroke-width="2.4" transform="translate(0 ${bob})"/></mask>`;
  g += patte(K, `${id}pc`, leg('avantG'), `${id}hors`) + patte(K, `${id}pd`, leg('avantD'), `${id}hors`);
  haut = `<g transform="translate(0 ${r2(k * 3)})">${gorgeFace(K)}</g>` + `<g transform="translate(0 ${r2(br * 0.6 + nod + k * 8)})"><g transform="translate(-20.7 0)">${bois(K, n, 1)}</g>${teteFace(K, id, blink || k > 0.8, !walk && n % 4 === 2)}</g>`;
  g += `<g transform="translate(0 ${bob})">${haut}</g>`;
  return g;
}

// cerfLune(view, pose, n, o) : une image du cerf, 120 × 144.
//   pose 'debout' (4 images : il respire, une oreille frémit, la queue bat, un clignement à la 4e) ; 'marche' (8 images :
//   le pas latéral, le corps qui monte et descend, la tête qui accompagne) ; 'couche' (4 images : couché, les pattes
//   repliées, la tête haute ; il respire, une oreille frémit, il cligne) ; 'salut' (4 images : il incline la tête, les
//   yeux fermés au plus bas, et la relève). o.blink force le clignement.
function cerfLune(view = 'se', pose = 'debout', n = 0, o = {}) {
  const K = C, id = `cl${view}${pose}${n}`;
  const walk = pose === 'marche', couche = pose === 'couche';
  const N = walk ? 8 : 4, t = (n % N) / N;
  const blink = o.blink != null ? o.blink : !walk && n % 4 === 3;
  const br = walk ? 0 : [0, -0.4, -0.7, -0.4][n % 4];
  // la marche : le corps monte quand les sabots passent sous lui (deux fois par pas), la tête accompagne
  let bob = walk ? r2(-0.7 * Math.abs(Math.sin(t * Math.PI * 2))) : 0;
  const nod = walk ? r2(0.9 * Math.sin(t * Math.PI * 4)) : 0;
  let s = '';
  // la lueur autour de lui
  s += `<defs><radialGradient id="${id}gl"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity=".5"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs>`
    + `<ellipse cx="60" cy="72" rx="58" ry="70" fill="url(#${id}gl)"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" values=".8;1;.8" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></ellipse>`;
  if (view === 'front') return s + `<g transform="translate(-2 20)">${vueFace(K, id, pose, n, t, blink, br, bob, nod)}</g>`;
  // de trois quarts dos (il s'éloigne vers le haut à droite) : la même silhouette, la tête vue de dos, la croupe blanche
  // et la queue vers nous, la crinière du poitrail cachée de l'autre côté
  const dos = view === 'ne';
  // couché : le corps descend jusqu'au sol, les pattes repliées dessous ; le salut : la tête s'incline (k)
  const k = pose === 'salut' ? SALUT[n % 4] : 0;
  if (couche) bob = COUCHE_DY;
  let g = couche ? `<ellipse cx="56" cy="120.6" rx="34" ry="4.4" fill="rgba(30,40,70,.2)"/>`
    : `<ellipse cx="58" cy="117.4" rx="29" ry="4" fill="rgba(30,40,70,.2)" transform="rotate(${dos ? -6 : 6} 58 117.4)"/>`;
  const f = dos ? [1, -0.1] : [1, 0.1];
  const leg = key => {
    if (couche) return PATTES_COUCHE_SE[key] && { ...PATTES_COUCHE_SE[key], posé: false };
    const L = PATTES_SE[key];
    return walk ? auPas(L, (t + L.ph) % 1, f, key.startsWith('avant') ? 5.6 : 5, key.startsWith('avant') ? 4.4 : 3.6, bob) : { ...L, posé: true };
  };
  // les pattes du fond, la queue (elle bat)
  if (!couche) g += patte(K, `${id}pa`, leg('arriereFond'));
  g += patte(K, `${id}pb`, leg('avantFond'));
  const qa = walk ? r2(6 * Math.sin(t * Math.PI * 4)) : [0, -14, 0, 0][n % 4];
  const queue = dos ? 'M31,57.4 Q23.6,54.8 22.6,60.6 Q23.4,67.2 29.6,65.8 Z' : 'M30,59.4 Q24.2,57 23.4,61.8 Q24,66.4 29,65 Z';
  if (!dos) g += `<g transform="translate(0 ${bob}) rotate(${qa} 29.6 62)">${P(queue, K.belly, 0.75)}</g>`;
  // le corps et le cou d'une seule silhouette : le dos, la croupe, le ventre, le poitrail profond, le cou épais et cambré
  // qui monte vers la tête (il respire : le dos monte un peu)
  const nx = k * 1.6, ny = k * 11;
  const corps = `M${r2(76 + nx)},${r2(27 + ny)} C${r2(70 + nx * 0.6)},${r2(32 + ny * 0.6)} 64,42 60,${r2(50 + br)} C52,${r2(50 + br)} 42,${r2(51 + br)} 36,53.6 C30.4,56.2 28.6,61.6 29.4,67 C30.2,72.8 34.6,77.4 40.6,78.8 C49,80.6 58,80.8 66,80.4 C72,83 80,82 83,76 C86,70 86,62 84,56 C86,50 ${r2(86.6 + nx * 0.6)},${r2(44 + ny * 0.6)} ${r2(85 + nx)},${r2(38 + ny)} Z`;
  let haut = P(corps, K.coat) + clip(`${id}c`, corps,
    // l'ombre du ventre, le côté loin, la croupe et l'épaule, le cou
    `<ellipse cx="56" cy="88" rx="32" ry="9" fill="${K.coatS}" opacity=".85"/>`
    + `<path d="M32.6,59 Q33.8,70.6 42,78" fill="none" stroke="${K.coatS}" stroke-width="1.3" stroke-linecap="round"/><path d="M66,56 Q72,66 70,80" fill="none" stroke="${K.coatS}" stroke-width="1.3" stroke-linecap="round"/>`
    + `<path d="M64,44 Q70,34 76,29" fill="none" stroke="${K.belly}" stroke-width="2" stroke-linecap="round" opacity=".9"/>`
    // les constellations : des veines de lumière, des étoiles à leurs nœuds
    + lueur('M36,64 L43,60 L50,65 L57,60.4 M43,60 L42.4,70 M50,65 L53,72.6', K.vein, 0.4, 0.85)
    + [[36, 64, 0.8], [43, 60, 1], [50, 65, 0.9], [57, 60.4, 0.8], [42.4, 70, 0.7], [53, 72.6, 0.7]].map(([x, y, r]) => etoile(x, y, r, K.star)).join('')
    + lueur('M68,48 L72,56 L70,66', K.vein, 0.35, 0.75) + etoile(72, 56, 0.7, K.star)
    // des taches d'argent sur le dos, comme le faon qu'il a été
    + [[39, 56.4, 1.2], [47, 54.4, 1], [54, 54.6, 1.1], [44, 59.6, 0.8]].map(([x, y, r]) => E(x, y, r, r * 0.7, K.coatS, 0)).join('')
    // de dos : la croupe blanche autour de la queue, la ligne du dos jusqu'à la nuque
    + (dos ? E(32.2, 63.4, 5.4, 7.4, K.belly, 0) + `<path d="M36,53.6 C44,51.6 54,51.6 60.6,${r2(50 + br)} C65,43 70,35 75,29" fill="none" stroke="${K.coatS}" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>` : '')) + P(corps, 'none');
  if (dos) haut += `<g transform="rotate(${qa} 29.6 62)">${P(queue, K.belly, 0.75)}</g>`;
  g += `<g transform="translate(0 ${bob})">${haut}</g>`;
  // les pattes proches, la crinière, la tête, les bois ; les pattes proches ne se dessinent que hors du corps et sur son
  // cerne, qu'elles effacent (le haut de la patte se fond dans la cuisse, dans l'épaule)
  g += `<mask id="${id}hors" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="144"><rect x="0" y="0" width="120" height="144" fill="#fff"/><path d="${corps}" fill="#000" stroke="#fff" stroke-width="2.4" transform="translate(0 ${bob})"/></mask>`;
  g += patte(K, `${id}pc`, leg('arriere'), `${id}hors`) + patte(K, `${id}pd`, leg('avant'), `${id}hors`);
  // (le salut : la tête suit le haut du cou et s'incline vers l'avant)
  const incline = `translate(${r2(nx)} ${r2(br * 0.6 + nod + ny)}) rotate(${r2(k * 6)} 82.6 26)`;
  haut = dos ? `<g transform="${incline}">${teteDeDos(K, id, !walk && n % 4 === 2)}${bois(K, n)}</g>`
    : `<g transform="translate(${r2(nx * 0.4)} ${r2(ny * 0.4)})">${gorge(K)}</g>` + `<g transform="${incline}">${bois(K, n)}${tete(K, id, blink || k > 0.8, !walk && n % 4 === 2)}</g>`;
  g += `<g transform="translate(0 ${bob})">${haut}</g>`;
  return s + `<g transform="translate(-2 20)">${g}</g>`;
}

const svgCL = (body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${120 * scale}" height="${144 * scale}" viewBox="0 0 120 144">${body}</svg>`;

module.exports = { cerfLune, svgCL, C, PATTES_SE };
