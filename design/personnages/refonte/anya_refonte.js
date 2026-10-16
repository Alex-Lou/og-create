// Anya, l'Âme de l'Île, refonte (choix de l'auteur, 16 oct.) : un esprit, la créatrice de l'île ; belle, mystérieuse,
// divine, qui « en jette ». Les formes de l'Anya d'origine (atelier/anya.js) : ses proportions (la tête de la troupe),
// les deux mèches qui encadrent le visage jusqu'à la taille, le manteau vivant qui l'enveloppe des épaules au sol, ouvert
// devant sur la robe claire, son ourlet de plumes, ses feuilles, ses fleurs et ses papillons ; le dos coiffé, une
// couronne de fleurs derrière la tête. Les couleurs et les effets de la refonte : lune et argent, la peau nacrée,
// bleutée, parcourue de veines comme des constellations qui luisent ; la chevelure d'argent, vivante, qui ondule ; les
// oreilles pointues ; les yeux bleu-gris, l'iris cerclé de lumière ; les grands bois de cerf d'argent, fleuris, où
// nichent un oiseau et des lucioles ; le diadème et la gemme verte au front (la Terre, au centre des sept sceaux du
// Grimoire) ; la robe qui se défait en brume au bas ; les voiles qui pendent de ses bras. Elle flotte : ses pieds ne
// touchent pas le sol.
// Repère 80 × 128 : son axe en x = 40, l'ombre au sol en y = 123 (le dessin est descendu de 3,6 : les bois restent dans le
// cadre ; elle s'élève de o.lev). Vues : face (front), trois quarts avant (se), dos (ne) ;
// c.miroir : la direction sera retournée par le jeu (l'oiseau des bois passe de l'autre côté avant).
// États (anya_tenues.js) : éveillée, ou endormie sous le Voile (pétrifiée, grise, la mousse à ses pieds, le lierre et
// des fleurs fermées qui l'enveloppent, sans lumière ; au réveil, les fleurs s'ouvrent, comme le Cercle qui fleurit).
const { P, E, L, clip, r2, OUT } = require('../troupe');
const { EXPR, ALIAS, X, eye, brow, mouth, extras } = require('./visage');
const { ik, ligneBras } = require('./membres');

const C = {
  skin: '#EEF1F7', skinS: '#C9D2E4', skinH: '#FFFFFF', lid: '#DCE2EE', under: '#B9C4DA', cheek: '#E9C6D6', nose: '#B4BED4',
  eye: '#26304A', iris: '#7E9CC0', irisD: '#3E5276', irisR: '#D8F0FF', irisO: '#4A5E80', irisL: '#E6F6FF', eyeRx: 2.3, eyeRy: 2.75, brow: '#AFC0DA', browW: 0.55, mouth: '#9C6A82',
  vein: '#BFE6FF', star: '#FFFFFF',
  hair: '#CBD5EA', hairS: '#8E9CC2', hairH: '#F6FAFF', hairD: '#6E7CA6',
  antler: '#E8E4DA', antlerS: '#B9B2A2', blossom: '#FFFFFF', blossomC: '#CDE6FF', bird: '#7FA9E0', birdS: '#4E78B4',
  gown: '#E9EEF8', gownS: '#AEBBD6', gownH: '#FFFFFF', silver: '#D7DEEA', silverS: '#9AA6BE',
  gem: '#4FC78A', gemS: '#2E8A5C', gemH: '#C8FFE0',
  veil: '#E8F0FF', glow: '200,225,255', mist: '#E6EEFA', firefly: '#F4FAFF',
  moss: '#7A8A62', mossS: '#5A6A48', ivy: '#5E8A6A', ivyS: '#3E6A4E', bud: '#EADFF2', budS: '#B9A8CC'
};

// Les saisons du manteau vivant : sa couleur, son ombre, ses nervures (qui luisent), son ourlet ; ses plumes, ce qui pousse
// dessus (orne : des feuilles, des fleurs, du givre), les ailes de ses papillons
const SAISONS = {
  ete: { nom: 'Été', cape: '#2E5C66', capeS: '#1E3E48', nerv: '#BFE6FF', hem: '#D7DEEA', plumes: ['#E8F0FF', '#BFD4E8', '#9FC4C8'], orne: 'feuilles', feuille: '#5E9A86', fleur: '#FFFFFF', ailes: ['#CFE8FF', '#FFFFFF'] },
  printemps: { nom: 'Printemps', cape: '#6E7EB8', capeS: '#4E5C92', nerv: '#FFFFFF', hem: '#F7D6E6', plumes: ['#FFFFFF', '#F7D6E6', '#CFE3C2'], orne: 'fleurs', feuille: '#CFE3C2', fleur: '#F7D6E6', ailes: ['#F7D6E6', '#FFFFFF'] },
  automne: { nom: 'Automne', cape: '#7A4A4E', capeS: '#58343A', nerv: '#F2D6A8', hem: '#E8C9A0', plumes: ['#F2D3A0', '#C9A27A', '#E8E4DA'], orne: 'feuilles', feuille: '#C2703E', fleur: '#F2C94C', ailes: ['#F2C9A0', '#FFF3DC'] },
  hiver: { nom: 'Hiver', cape: '#4E6E9E', capeS: '#34507A', nerv: '#FFFFFF', hem: '#FFFFFF', plumes: ['#FFFFFF', '#DDE7F0', '#B9CCDC'], orne: 'givre', feuille: '#FFFFFF', fleur: '#FFFFFF', ailes: ['#E8F4FF', '#FFFFFF'] }
};

// Ses expressions : celles de la troupe refondue ; au repos, sereine (les paupières mi-closes, le regard un peu bas, un
// très léger sourire) ; bienveillante ; les yeux fermés (endormie, ou quand elle crée)
const EXPR_A = {
  ...EXPR,
  veille: X({ brow: [-0.2, 0.15, -0.5], lid: 0.2, tilt: -0.08, look: [0, 0.25], under: 0.15, mouth: 'soft' }),
  bienveillante: X({ brow: [-0.4, -0.1, -0.6], lid: 0.2, low: 0.18, look: [0, 0.15], under: 0.2, mouth: 'half' }),
  recueillie: X({ brow: [-0.3, 0.2, -0.5], mode: 'closed', under: 0.2, mouth: 'soft' }),
  parle: X({ brow: [-0.3, -0.2, -0.5], lid: 0.18, look: [0, 0.1], under: 0.2, mouth: 'open' })
};

// La pierre (endormie sous le Voile) : toutes les couleurs passent au gris de la statue, plus ou moins (k : 0 → 1)
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbHex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
const pierre = (h, k) => {
  const c = hexRgb(h), g = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) * 0.78 + 30;
  return rgbHex(c.map((v, i) => v + ((g + [6, 2, -4][i]) - v) * k));
};

// ---- les petites choses ----
const fleur = (x, y, r, petal, coeur) => [0, 72, 144, 216, 288].map(a => E(x + Math.cos(a * Math.PI / 180) * r, y + Math.sin(a * Math.PI / 180) * r, r * 0.72, r * 0.72, petal, 0.45)).join('') + E(x, y, r * 0.5, r * 0.5, coeur, 0.3);
const feuille = (x, y, len, w, rot, fill, nerv) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">`
  + P(`M0,0 Q${r2(w)},${r2(len * 0.45)} 0,${r2(len)} Q${r2(-w)},${r2(len * 0.45)} 0,0 Z`, fill, 0.55) + L([0, 0.6], [0, len - 0.7], nerv, 0.3) + '</g>';
// une luciole : le halo pâle, le point lumineux
const luciole = (x, y, k = 1) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2.4 * k)}" fill="rgb(220,235,255)" opacity=".35"/>` + E(x, y, 0.75 * k, 0.75 * k, C.firefly, 0.3);
// une petite étoile à quatre branches (les veines, la gemme)
const etoile = (x, y, r, fill) => P(`M${r2(x)},${r2(y - r)} L${r2(x + r * 0.28)},${r2(y - r * 0.28)} L${r2(x + r)},${r2(y)} L${r2(x + r * 0.28)},${r2(y + r * 0.28)} L${r2(x)},${r2(y + r)} L${r2(x - r * 0.28)},${r2(y + r * 0.28)} L${r2(x - r)},${r2(y)} L${r2(x - r * 0.28)},${r2(y - r * 0.28)} Z`, fill, 0);
// une ligne lumineuse : un trait clair, son halo
const lueur = (d, col, w = 0.45, o = 0.9) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${r2(w * 3)}" stroke-linecap="round" opacity="${r2(o * 0.25)}"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;
// ce qui ondule sans cesse : deux formes d'un même chemin, en aller-retour adouci (dur : la durée, begin : le décalage)
const ondule = (a, b, dur = '5s', begin = '0s') => `<animate attributeName="d" dur="${dur}" begin="${begin}" repeatCount="indefinite" values="${a};${b};${a}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`;
// un chemin rempli, cerné, qui ondule (ou non : vivant false)
const vivant = (a, b, fill, w, vivante, dur, begin) => `<path d="${a}" fill="${fill}" stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round">${vivante ? ondule(a, b, dur, begin) : ''}</path>`;
const pt = q => `${r2(q[0])},${r2(q[1])}`;
const decaler = (d, kx, ky = 0) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + kx)},${r2(+y + ky)}`);

// ---- les bras ----
// Le bras : de l'épaule a à la main h, deux os (le bras, l'avant-bras) de longueur fixe ; le coude plie du côté s (+1 /
// -1). Un membre effilé, souple (la ligne de membres.js), cerné ; la peau, l'ombre du côté du corps, une veine de lumière.
// main : 'repos' (la main longue, les doigts joints), 'paume' (ouverte, vers nous), 'coupe' (au creux, vers le haut),
// 'tendue' (vers l'avant) ou du SVG ; voile : le voile qui pend du bras
const L1 = 16.2, L2 = 15.6;
function bras(K, a, h, s, { main = 'repos', voile = true, vivante = true, nuit = 0 } = {}) {
  const r = ik(a, h, L1, L2, s), e = r.milieu, b = r.bout;
  const pts = ligneBras(a, e, b);
  // la ligne, ses longueurs cumulées, ses normales
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = cum[cum.length - 1] || 1;
  const larg = t => (t < 0.5 ? 3.8 - t * 1.6 : 3 - (t - 0.5) * 1.4);
  const gauche = [], droite = [];
  pts.forEach((q, i) => {
    const p = pts[Math.max(0, i - 1)], n = pts[Math.min(pts.length - 1, i + 1)], dx = n[0] - p[0], dy = n[1] - p[1], d = Math.hypot(dx, dy) || 1;
    const w = larg(cum[i] / tot) / 2;
    gauche.push([q[0] - dy / d * w, q[1] + dx / d * w]); droite.push([q[0] + dy / d * w, q[1] - dx / d * w]);
  });
  const contour = `M${gauche.map(pt).join(' L')} L${droite.reverse().map(pt).join(' L')} Z`;
  // le voile : une manche ample et transparente, qui part du coude et s'évase jusque sous la main, en flottant (on voit
  // le bras au travers) ; dessinée par-dessus le bras
  let sv = '';
  if (voile) {
    const sx = a[0] < 40 ? -1 : 1, ux = b[0] - e[0], uy = b[1] - e[1], d = Math.hypot(ux, uy) || 1, nx = -uy / d, ny = ux / d;
    const o = (q, k, w) => [q[0] + ux / d * k + nx * w, q[1] + uy / d * k + ny * w];
    const forme = f => `M${pt(o(e, -0.6, 2))} Q${pt(o(e, d * 0.5, 2.6 + f))} ${pt(o(b, 3.2, 4.2 + f))} Q${pt(o(b, 5.6, 1.4 + f))} ${pt(o(b, 6.4, -1.6 + f * 0.4))} Q${pt(o(b, 3.6, -3.6))} ${pt(o(b, 1.6, -4.4 - f * 0.6))} Q${pt(o(e, d * 0.5, -2.8))} ${pt(o(e, -0.6, -2))} Z`;
    const va = forme(0), vb = forme(sx * 0.9);
    sv = `<path d="${va}" fill="${K.veil}" fill-opacity=".32" stroke="${K.silverS}" stroke-width="0.45" stroke-linejoin="round">${vivante ? ondule(va, vb, '4.4s') : ''}</path>`
      + `<path d="M${pt(o(b, 4.4, 3.2))} Q${pt(o(b, 6, 0))} ${pt(o(b, 2.4, -3.4))}" fill="none" stroke="${K.silver}" stroke-width="0.5" opacity=".9"/>`;
  }
  // l'ombre du côté du corps, la veine de lumière sur l'avant-bras
  const ombre = `<path d="M${pts.map(q => pt([q[0] + (a[0] < 40 ? 0.7 : -0.7), q[1]])).join(' L')}" fill="none" stroke="${K.skinS}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`;
  const veine = lueur(`M${pt(e)} Q${pt([(e[0] + b[0]) / 2 + 0.4, (e[1] + b[1]) / 2])} ${pt([b[0], b[1] - 0.6])}`, K.vein, 0.35, nuit ? 0 : 0.8);
  const bracelet = (() => { const q = pts[pts.length - 3] || b; return E(q[0], q[1], 1.5, 0.75, K.silver, 0.5); })();
  // le bras cerné sur ses deux bords seulement (pas de coupe à l'épaule : le mancheron la couvre)
  const bords = `M${gauche.map(pt).join(' L')} L${droite.map(pt).join(' L')}`;
  // le mancheron de la robe : il arrondit l'épaule et descend un peu sur le bras, bordé d'argent
  const u0 = [pts[1][0] - a[0], pts[1][1] - a[1]], d0 = Math.hypot(u0[0], u0[1]) || 1, ux0 = u0[0] / d0, uy0 = u0[1] / d0;
  const q = (k, m) => [a[0] + ux0 * k - uy0 * m, a[1] + uy0 * k + ux0 * m], w0 = larg(0) / 2;
  const manch = `M${pt(q(-1.4, -(w0 + 0.5)))} Q${pt(q(-3.6, 0))} ${pt(q(-1.4, w0 + 0.5))} L${pt(q(4.4, w0 + 1.1))} Q${pt(q(5.4, 0))} ${pt(q(4.4, -(w0 + 1.1)))} Z`;
  const mancheron = P(manch, K.gown, 0.8) + `<path d="M${pt(q(4.4, w0 + 1.1))} Q${pt(q(5.4, 0))} ${pt(q(4.4, -(w0 + 1.1)))}" fill="none" stroke="${K.silverS}" stroke-width="0.7"/>`
    + `<path d="M${pt(q(-0.6, -w0 * 0.4))} Q${pt(q(1.6, -w0 * 0.6))} ${pt(q(3.4, -w0 * 0.3))}" fill="none" stroke="${K.gownH}" stroke-width="0.6" stroke-linecap="round"/>`;
  return `<path d="${contour}" fill="${K.skin}"/><path d="${bords}" fill="none" stroke="${OUT}" stroke-width="0.85" stroke-linejoin="round"/>` + ombre + veine + bracelet + mainDe(K, b, e, main) + sv + mancheron;
}
// La main d'elfe : longue, les doigts fins ; orientée selon l'avant-bras (de e vers b)
function mainDe(K, b, e, kind) {
  if (typeof kind === 'string' && kind.startsWith('<')) return kind;
  const a = Math.atan2(b[1] - e[1], b[0] - e[0]) * 180 / Math.PI - 90;
  let s;
  if (kind === 'paume') {
    s = P('M-1.4,-1.2 Q-1.6,1.2 -1.1,2.4 L-1.1,4.6 Q-0.8,5.2 -0.5,4.6 L-0.4,2.9 L-0.2,5.2 Q0.1,5.8 0.4,5.2 L0.5,2.9 L0.8,4.8 Q1.1,5.3 1.4,4.7 L1.3,2.4 Q1.8,1.4 2.2,0.6 Q2.4,-0.2 1.8,-0.4 L1.2,0.4 L1.4,-1.2 Z', K.skin, 0.6);
  } else if (kind === 'coupe') {
    s = P('M-1.6,-0.8 Q-2.2,2.2 0,2.8 Q2.2,2.2 1.6,-0.8 Q0,0.4 -1.6,-0.8 Z', K.skin, 0.6);
  } else if (kind === 'tendue') {
    s = P('M-1.2,-1 Q-1.5,2 -0.9,4.4 Q0,5.4 0.9,4.4 Q1.5,2 1.2,-1 Z', K.skin, 0.6) + L([-0.3, 2.4], [-0.3, 4.4], K.skinS, 0.3) + L([0.35, 2.4], [0.35, 4.4], K.skinS, 0.3);
  } else {
    s = P('M-1.1,-1 Q-1.4,1.6 -0.8,3.9 Q0,4.8 0.8,3.9 Q1.4,1.6 1.1,-1 Z', K.skin, 0.6) + L([0, 2.2], [0, 3.9], K.skinS, 0.3);
  }
  return `<g transform="translate(${r2(b[0])} ${r2(b[1])}) rotate(${r2(kind === 'paume' ? 180 : a)})">${s}</g>`;
}

// ---- la chevelure ----
// De face : la masse derrière la tête et le cou, que le manteau cache plus bas (comme l'origine) ; de dos : la cascade
// qui s'affine en trois mèches ondulées jusqu'aux reins, ses mèches claires et sombres, la couronne de fleurs à l'arrière
// de la tête. Elle ondule sans cesse. kx : le décalage de la vue ; sw : le balancement ; vivante : l'ondulation
function chevelure(K, id, kx, sw, vivante, dos) {
  const X = x => r2(x + kx);
  if (!dos) {
    const f = o => `M${X(26.2)},32 Q${X(25.6)},14.2 ${X(40)},13.8 Q${X(54.4)},14.2 ${X(53.8)},32 L${X(54.8 + o * 0.4)},58 Q${X(40)},${r2(61 + o)} ${X(25.2 - o * 0.4)},58 Z`;
    return vivant(f(0), f(1), K.hair, 0.9, vivante, '6s') + clip(`${id}chc`, f(0), `<rect x="${X(46)}" y="12" width="12" height="52" fill="${K.hairS}" opacity=".55"/>`);
  }
  const f = o => `M${X(27.6)},31 Q${X(27.2)},13.8 ${X(40)},13.6 Q${X(52.8)},13.8 ${X(52.4)},31 Q${X(52)},37.4 ${X(48)},40 Q${X(50 + o * 0.4)},51 ${X(49.6 + o)},63 Q${X(49.4 + o + sw)},75 ${X(47.6 + o * 1.4 + sw * 1.6)},85 Q${X(46 + sw * 1.6)},81.4 ${X(44.2 + o + sw * 1.8)},87.6 Q${X(42.4 + sw * 1.8)},82.6 ${X(40 + o + sw * 2)},90 Q${X(37.6 + sw * 1.8)},82.6 ${X(35.8 + o + sw * 1.8)},87.6 Q${X(34 + sw * 1.6)},81.4 ${X(32.4 + o * 1.4 + sw * 1.6)},85 Q${X(30.6 + o + sw)},75 ${X(30.4 + o)},63 Q${X(30 + o * 0.4)},51 ${X(32)},40 Q${X(28)},37.4 ${X(27.6)},31 Z`;
  const a = f(0), b = f(1.2);
  const brins = o => `M${X(35.4)},40 Q${X(34 + o)},56 ${X(34.6 + sw)},72 Q${X(35 + sw)},80 ${X(36.4 + sw * 1.6)},85 M${X(40)},38 Q${X(40.4 + o)},60 ${X(40 + sw * 2)},88 M${X(44.6)},40 Q${X(46 + o)},56 ${X(45.4 + sw)},72 Q${X(45 + sw)},80 ${X(43.6 + sw * 1.6)},85`;
  let s = vivant(a, b, K.hair, 0.9, vivante, '6s')
    + `<clipPath id="${id}chc"><path d="${a}">${vivante ? ondule(a, b, '6s') : ''}</path></clipPath>`
    + `<g clip-path="url(#${id}chc)"><rect x="${X(45.4)}" y="12" width="16" height="84" fill="${K.hairS}" opacity=".6"/>`
    + `<path d="${brins(0)}" fill="none" stroke="${K.hairS}" stroke-width="0.8" stroke-linecap="round" opacity=".9">${vivante ? ondule(brins(0), brins(1), '5.6s') : ''}</path>`
    + `<path d="M${X(33.6)},19.6 Q${X(30.6)},26 ${X(30.8)},33 M${X(36.4)},17.4 Q${X(34.4)},22 ${X(34)},28 M${X(33.6)},46 Q${X(32.8)},58 ${X(33.2)},70" fill="none" stroke="${K.hairH}" stroke-width="1.2" stroke-linecap="round"/></g>`;
  // la couronne de fleurs derrière la tête : elle marque la tête et coupe la chevelure
  s += `<path d="M${X(29.4)},31.4 Q${X(40)},36.6 ${X(50.6)},31.4" fill="none" stroke="${K.hairS}" stroke-width="2.4" stroke-linecap="round"/>`
    + [[30.4, 31.6, -40], [35, 34, -15], [45, 34, 15], [49.6, 31.6, 40]].map(([x, y, r]) => feuille(+X(x), y, 3, 1.3, r, '#9CC4B4', '#6E9A8A')).join('')
    + [[32.6, 33, K.blossom], [37.6, 34.8, K.blossomC], [42.4, 34.8, K.blossom], [47.4, 33, K.blossomC]].map(([x, y, c]) => fleur(+X(x), y, 1.1, c, '#FFE7A3')).join('')
    + fleur(+X(37.4), 58, 0.9, K.blossom, '#FFE7A3') + fleur(+X(43.4), 70, 0.8, K.blossom, '#FFE7A3');
  return s;
}
// Les deux mèches qui encadrent le visage : elles sortent de derrière la joue, sous l'oreille, et tombent droit devant
// les épaules jusqu'à la taille (comme l'origine) ; leurs pointes ondulent ; deux fleurs prises dans chacune
function mechesDevant(K, X, sw, vivante) {
  const f = (sx, o) => {
    const x = v => (sx < 0 ? X(v) : X(80 - v));
    return `M${x(29.2)},27 Q${x(25.2)},40 ${x(25.8)},52 Q${x(26.6)},62 ${x(29.4 - o)},72.6 Q${x(31.4)},64 ${x(31.8)},54 Q${x(32.4)},42 ${x(31.6)},31 Z`;
  };
  const g = f(-1, sw * 0.6), d = f(1, -sw * 0.6), gb = f(-1, sw * 0.6 + 0.9), db = f(1, -sw * 0.6 - 0.9);
  const x = (sx, v) => +(sx < 0 ? X(v) : X(80 - v));
  return vivant(g, gb, K.hair, 0.8, vivante, '5s') + vivant(d, db, K.hair, 0.8, vivante, '5s', '-1.2s')
    + `<path d="M${x(-1, 27.4)},40 Q${x(-1, 27.2)},52 ${x(-1, 29)},64" fill="none" stroke="${K.hairH}" stroke-width="0.7" stroke-linecap="round"/>`
    + `<path d="M${x(1, 27.4)},40 Q${x(1, 27.2)},52 ${x(1, 29)},64" fill="none" stroke="${K.hairS}" stroke-width="0.6" stroke-linecap="round"/>`
    + [-1, 1].map(sx => fleur(x(sx, 28.4), 50, 1, K.blossom, K.blossomC) + fleur(x(sx, 29.6), 62, 0.85, K.blossom, K.blossomC)).join('');
}
// ---- la couronne ----
// Les grands bois de cerf d'argent : deux merrains qui montent en s'écartant, leurs andouillers, des fleurs blanches, des
// feuilles ; un oiseau bleu niché d'un côté (m : son côté), deux lucioles prises dans les branches ; le diadème d'argent
// sur le front, la gemme verte au milieu
function couronne(K, kx, m, nuit, n) {
  const tige = (d, w) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + 1.5)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${K.antler}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  let s = '';
  for (const sx of [-1, 1]) {
    const Xc = x => r2(40 + kx + sx * (x - 40));
    s += tige(`M${Xc(35)},18 Q${Xc(31)},12 ${Xc(27)},9 Q${Xc(22)},5.4 ${Xc(15)},4.4`, 1.9);
    s += tige(`M${Xc(29.6)},10.4 Q${Xc(29)},6 ${Xc(30.6)},2.2`, 1.3) + tige(`M${Xc(24)},7 Q${Xc(22.6)},3.6 ${Xc(23.4)},1.2`, 1.1)
      + tige(`M${Xc(26.4)},8.6 Q${Xc(21.6)},10.4 ${Xc(17)},11.2`, 1.1) + tige(`M${Xc(18.6)},4.9 Q${Xc(15.4)},7.6 ${Xc(12.6)},8.2`, 0.9);
    s += `<path d="M${Xc(33.6)},16.4 Q${Xc(30)},12 ${Xc(27)},10" fill="none" stroke="${K.antlerS}" stroke-width="0.5" opacity=".8"/>`;
    s += fleur(+Xc(30.6), 2.4, 1.1, K.blossom, K.blossomC) + fleur(+Xc(23.4), 1.6, 0.95, K.blossom, K.blossomC) + fleur(+Xc(15), 4.4, 1.05, K.blossom, K.blossomC)
      + fleur(+Xc(12.6), 8.2, 0.85, K.blossom, K.blossomC) + fleur(+Xc(17.2), 11.2, 0.9, K.blossom, K.blossomC)
      + feuille(+Xc(27.6), 9.2, 2.6, 1, sx * 60, '#9CC4B4', '#6E9A8A') + feuille(+Xc(20.4), 5.8, 2.2, 0.9, sx * 110, '#9CC4B4', '#6E9A8A');
  }
  // l'oiseau, niché dans le bois de son côté
  const bx = 40 + kx + m * 19.6, by = 8.4;
  s += `<g transform="translate(${r2(bx)} ${by}) scale(${-m} 1)">` + E(0, 0, 2.3, 1.9, K.bird, 0.65) + E(0.6, 0.7, 1.2, 0.9, '#FFFFFF', 0) + P('M-2,-0.4 L-3.8,0.4 L-2,0.8 Z', K.birdS, 0.45)
    + E(1, -0.7, 0.35, 0.35, OUT, 0) + P('M2.1,-0.5 L3.4,-0.2 L2.1,0.2 Z', '#E8C27A', 0.35) + '</g>';
  // deux lucioles prises dans les branches, qui changent de place d'une image à l'autre
  if (!nuit) s += [[23 + n % 2 * 2, 6], [57 - n % 2 * 2, 3.8]].map(([x, y]) => luciole(x + kx, y, 0.8)).join('');
  // le diadème d'argent et la gemme (qui luit, sauf sous le Voile)
  const dia = `M${r2(28.4 + kx)},22.4 Q${r2(40 + kx)},17.4 ${r2(51.6 + kx)},22.4`;
  s += `<path d="${dia}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="${dia}" fill="none" stroke="${K.silver}" stroke-width="0.8" stroke-linecap="round"/>`;
  const gx = 40 + kx, gy = 19.6;
  s += (nuit ? '' : `<circle cx="${r2(gx)}" cy="${gy}" r="3.2" fill="#B8FFD8" opacity=".35"/>`)
    + P(`M${r2(gx)},${r2(gy - 1.9)} L${r2(gx + 1.4)},${gy} L${r2(gx)},${r2(gy + 1.9)} L${r2(gx - 1.4)},${gy} Z`, K.gem, 0.6) + P(`M${r2(gx)},${r2(gy - 1.9)} L${r2(gx + 1.4)},${gy} L${r2(gx)},${gy} Z`, K.gemH, 0) + P(`M${r2(gx - 1.4)},${gy} L${r2(gx)},${r2(gy + 1.9)} L${r2(gx)},${gy} Z`, K.gemS, 0);
  return s;
}

// ---- la tête ----
// Le visage de face (de trois quarts, le même, ses x pressés vers le côté du fond) : rond comme celui de l'origine, le
// menton à peine fin
const FACE = 'M28,30.6 C28,22.2 33.4,18.4 40,18.4 C46.6,18.4 52,22.2 52,30.6 C52,37.6 47.2,43.2 40,43.8 C32.8,43.2 28,37.6 28,30.6 Z';
const pressX = (d, X) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${X(+x)},${y}`);
const VISAGES = {
  front: { kx: 0, X: x => r2(x), rk: [1, 1] },
  se: { kx: -2, X: x => r2(38 + (x - 40) * (x < 40 ? 0.94 : 0.8)), rk: [0.95, 0.8] }
};
for (const V of Object.values(VISAGES)) V.face = pressX(FACE, V.X);
// l'oreille pointue d'elfe, longue, qui part vers l'arrière et monte un peu : sa racine est derrière la joue (le visage,
// dessiné après, la recouvre : elle sort de la tête, pas posée dessus) ; x, y : la racine ; sx : son côté ; k : sa longueur
const oreille = (K, x, y, sx, k = 1) => {
  const X = dx => r2(x + sx * dx * k);
  return P(`M${X(1.2)},${r2(y - 2.6)} Q${X(-4.4)},${r2(y - 4.2)} ${X(-9.2)},${r2(y - 6.8)} Q${X(-6.8)},${r2(y - 1.2)} ${X(-3)},${r2(y + 2.4)} Q${X(-1)},${r2(y + 3.6)} ${X(1.2)},${r2(y + 2.8)} Z`, K.skin, 0.75)
    + `<path d="M${X(-0.6)},${r2(y - 0.8)} Q${X(-4)},${r2(y - 2.2)} ${X(-7.4)},${r2(y - 5.4)}" fill="none" stroke="${K.skinS}" stroke-width="0.55" stroke-linecap="round"/>`
    + `<path d="M${X(-1.4)},${r2(y + 1.4)} Q${X(-3)},${r2(y + 0.8)} ${X(-4.4)},${r2(y - 0.6)}" fill="none" stroke="${K.skinS}" stroke-width="0.45" stroke-linecap="round" opacity=".8"/>`
    + E(+X(-3.2), y + 2.1, 0.45, 0.45, K.silver, 0.3);
};
// les oreilles de face et de trois quarts, dessinées avant le visage ; de trois quarts, celle du fond plus courte
const oreilles = (K, view) => { const V = VISAGES[view] || VISAGES.front; return oreille(K, +V.X(28.6), 32.6, 1, view === 'se' ? 1.05 : 1) + oreille(K, +V.X(51.4), 32.6, -1, view === 'se' ? 0.72 : 1); };
// le cou : court, et qui s'évase doucement vers les épaules
function cou(K, kx, nuit) {
  return P(`M${r2(37 + kx)},41 L${r2(36.8 + kx)},45.6 Q${r2(36.2 + kx)},47 ${r2(35 + kx)},47.6 L${r2(45 + kx)},47.6 Q${r2(43.8 + kx)},47 ${r2(43.2 + kx)},45.6 L${r2(43 + kx)},41 Z`, K.skin, 0.75)
    + E(40 + kx, 43.4, 3, 1.1, K.skinS, 0)
    + lueur(`M${r2(41.6 + kx)},44.4 Q${r2(41.2 + kx)},45.6 ${r2(42 + kx)},46.8`, K.vein, 0.3, nuit ? 0 : 0.7);
}
function tete(c, K, view, expr, n, nuit) {
  const V = VISAGES[view] || VISAGES.front, Xv = V.X, kx = V.kx, id = `${c.uid}${view}${expr}${n}`;
  const name = ALIAS[expr] || expr;
  const ex = EXPR_A[name] || EXPR_A.veille;
  let s = '';
  // le visage : la nacre, l'ombre de la chevelure sous la frange et sur la joue du fond, les joues à peine roses, les
  // constellations sur la pommette
  s += P(V.face, K.skin) + clip(`${id}f`, V.face, `<path d="M26,17 Q40,21.4 54,17 L54,25 Q40,28.2 26,25 Z" fill="${K.skinS}" opacity=".5"/>`
    + `<rect x="${r2(48.4 + kx)}" y="17" width="5" height="28" fill="${K.skinS}" opacity=".45"/>`
    + E(+Xv(32), 37.2, 2.2 * V.rk[0], 1.1, K.cheek, 0).replace('/>', ' opacity=".55"/>') + E(+Xv(48), 37.2, 2.2 * V.rk[1], 1.1, K.cheek, 0).replace('/>', ' opacity=".55"/>')
    + (nuit ? '' : lueur(`M${Xv(31.4)},39.4 L${Xv(30.4)},37.4 L${Xv(31.4)},35.6`, K.vein, 0.25, 0.8) + etoile(+Xv(31.4), 35.6, 0.65, K.star) + etoile(+Xv(30.4), 37.4, 0.5, K.star)
      + lueur(`M${Xv(48.6)},39.4 L${Xv(49.6)},37.6`, K.vein, 0.25, 0.7) + etoile(+Xv(49.6), 37.6, 0.5, K.star))) + P(V.face, 'none');
  // la frange de l'origine : partagée au milieu, deux bandeaux qui passent sous le diadème et retombent sur les tempes
  const fr = pressX('M27.6,30 Q27.2,16.4 40,16 Q52.8,16.4 52.4,30 Q49.4,22.2 42.4,21.4 L40,24.4 L37.6,21.4 Q30.6,22.2 27.6,30 Z', Xv);
  s += P(fr, K.hair, 0.8) + `<path d="${pressX('M29.6,25.6 Q32.2,21.8 36.6,20.8', Xv)}" fill="none" stroke="${K.hairH}" stroke-width="0.9" stroke-linecap="round"/>`
    + `<path d="${pressX('M50.4,25.6 Q47.8,21.8 43.4,20.8', Xv)}" fill="none" stroke="${K.hairS}" stroke-width="0.6" stroke-linecap="round"/>`;
  // les yeux bleu-gris : l'iris en dégradé, cerclé de lumière, une étincelle ; les sourcils fins et hauts ; le nez fin ;
  // la petite bouche
  const ir = `${id}ir`;
  s += `<defs><radialGradient id="${ir}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${K.irisD}"/><stop offset=".5" stop-color="${K.iris}"/><stop offset=".8" stop-color="${K.irisR}"/><stop offset="1" stop-color="${K.irisO}"/></radialGradient></defs>`;
  const k = { ...K, iris: `url(#${ir})` };
  s += eye(`${id}e0`, +Xv(35), 32.4, 1, { ...ex, ...ex.eyeL, rk: V.rk[0], sparkle: true }, k) + eye(`${id}e1`, +Xv(45), 32.4, -1, { ...ex, ...ex.eyeR, rk: V.rk[1], sparkle: true }, k);
  s += brow(+Xv(35), 28, 1, ex.browL || ex.brow, false, 0.85 * V.rk[0], K) + brow(+Xv(45), 28, -1, ex.browR || ex.brow, false, 0.85 * V.rk[1], K);
  s += view === 'se' ? P('M38,34.2 Q36.8,36.6 38.2,37', 'none', 0.5).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`)
    : P('M39.4,36.6 Q40,37.2 40.6,36.6', 'none', 0.5).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`);
  s += `<g transform="translate(${r2(40 + kx)} 39.6) scale(0.8) translate(${r2(-(40 + kx))} -39.6)">${mouth(ex.mouth, 40 + kx, 39.6, `${id}m`, K)}</g>`;
  s += extras(ex.extras.filter(x => x !== 'zz'), n % 2, Xv);
  return s;
}
// la tête de dos : les oreilles, dessinées avant la chevelure (elles en sortent de chaque côté)
const teteDeDos = K => oreille(K, 29.6, 32.6, 1) + oreille(K, 50.4, 32.6, -1);

// ---- le corps ----
// une plume (l'ourlet du manteau), un papillon (ouvert : l'ouverture des ailes, 0 → 1.2)
const plume = (x, y, rot, fill) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">${P('M0,0 Q2.4,4 0,9 Q-2.4,4 0,0 Z', fill, 0.6)}${L([0, 1], [0, 8], OUT, 0.35)}</g>`;
const papillon = (x, y, open, fill, tache) => `<g transform="translate(${r2(x)} ${r2(y)})">`
  + [-1, 1].map(m => P(`M0,0 Q${r2(m * 3.2 * open)},-3.4 ${r2(m * 3.4 * open)},-0.4 Q${r2(m * 2.6 * open)},1.6 0,0.6 Z`, fill, 0.5) + E(m * 2.1 * open, -1, 0.55 * open, 0.55, tache, 0)).join('')
  + L([0, -1.2], [0, 1.4], OUT, 0.6) + '</g>';
// La robe claire, comme l'origine : le corsage jusqu'aux épaules, la jupe étroite qui descend devant, entre les pans du
// manteau, et se défait en brume au bas ; le liseré d'argent, la ceinture au croissant, la broderie de lune au milieu
function robe(K, id, kx, sw, vivante, dos) {
  const X = x => r2(x + kx);
  const corsage = `M${X(31.4)},47.4 Q${X(40)},44.2 ${X(48.6)},47.4 L${X(45.4)},63.6 Q${X(40)},65 ${X(34.6)},63.6 Z`;
  const jupe = o => `M${X(34.6)},63.2 Q${X(40)},64.6 ${X(45.4)},63.2 L${X(49.6 + sw * 0.6 + o)},113 Q${X(45 + sw * 0.8)},116.6 ${X(40 + sw * 0.8)},114.6 Q${X(35 + sw * 0.8)},116.6 ${X(30.4 + sw * 0.6 - o)},113 Z`;
  const ja = jupe(0), jb = jupe(0.8);
  let s = vivant(ja, jb, K.gown, 0.85, vivante, '5.2s')
    + `<clipPath id="${id}jc"><path d="${ja}">${vivante ? ondule(ja, jb, '5.2s') : ''}</path></clipPath>`
    + `<g clip-path="url(#${id}jc)"><rect x="${X(44)}" y="60" width="12" height="60" fill="${K.gownS}" opacity=".75"/>`
    + `<rect x="${X(31.6)}" y="64" width="1.8" height="48" fill="${K.gownH}" opacity=".8"/>`
    // la broderie de lune : une tige d'argent qui serpente, des croissants et des étoiles
    + (dos ? '' : `<path d="M${X(40)},66 Q${X(38.4)},78 ${X(40.8)},90 Q${X(39.2)},101 ${X(40)},112" fill="none" stroke="${K.silverS}" stroke-width="0.6"/>`
      + [[38.2, 74], [42, 86], [38.6, 98]].map(([x, y]) => `<path d="M${X(x)},${r2(y - 1.4)} A1.4,1.4 0 1,0 ${X(x)},${r2(y + 1.4)} A1,1.4 0 1,1 ${X(x)},${r2(y - 1.4)} Z" fill="${K.silverS}"/>`).join('')
      + [[42.2, 70], [37.8, 82], [42.4, 104]].map(([x, y]) => etoile(+X(x), y, 0.9, K.silver)).join(''))
    // la brume du bas : la robe se défait en voiles
    + `<rect x="10" y="100" width="60" height="18" fill="${K.mist}" opacity=".55"/></g>`;
  // les pans de brume qui flottent sous l'ourlet
  s += [[34.4, 0], [40, -0.8], [45.6, -1.6]].map(([x, b]) => {
    const pa = `M${X(x - 3 + sw * 0.8)},114 Q${X(x + sw)},119.4 ${X(x + 3 + sw * 0.8)},114 Q${X(x + sw * 0.9)},116.6 ${X(x - 3 + sw * 0.8)},114 Z`;
    const pb = decaler(pa, 0.6, 0.5);
    return `<path d="${pa}" fill="${K.mist}" fill-opacity=".6">${vivante ? ondule(pa, pb, '3.6s', `${b}s`) : ''}</path>`;
  }).join('');
  s += P(corsage, K.gown) + clip(`${id}cs`, corsage, `<rect x="${X(43.6)}" y="44" width="8" height="24" fill="${K.gownS}" opacity=".8"/><rect x="${X(33.4)}" y="49" width="1.4" height="13" rx="0.7" fill="${K.gownH}"/>`) + P(corsage, 'none');
  if (!dos) {
    // l'encolure, son liseré d'argent ; la ceinture d'argent à la taille, un croissant au milieu
    s += `<path d="M${X(34.6)},47 Q${X(40)},48.4 ${X(40)},53 Q${X(40)},48.4 ${X(45.4)},47" fill="none" stroke="${K.silverS}" stroke-width="0.7"/>`;
    s += P(`M${X(34.4)},62.4 Q${X(40)},64.2 ${X(45.6)},62.4 L${X(45.4)},64.2 Q${X(40)},66 ${X(34.6)},64.2 Z`, K.silver, 0.55);
    s += `<path d="M${X(40)},61.8 A1.6,1.6 0 1,0 ${X(40)},65 A1.2,1.6 0 1,1 ${X(40)},61.8 Z" fill="${K.silverS}"/>`;
  }
  return s;
}
// Le manteau vivant de l'origine : il tombe des épaules jusqu'au sol et l'enveloppe (de face, il encadre la robe) ; son
// ombre à droite, ses nervures qui luisent (une perche de chaque côté, des nervures qui s'en écartent vers l'ourlet),
// l'ourlet clair sous deux rangs de plumes ; ce que la saison fait pousser ; les papillons qui s'y posent (n : l'image,
// les ailes battent)
function manteau(K, S, id, kx, sw, vivante, dos, nuit, n) {
  const X = (x, lo) => r2(x + kx * 0.4 + (lo ? sw : 0));
  const forme = o => `M${X(29)},45 Q${X(40)},40.4 ${X(51)},45 Q${X(60)},70 ${X(65 + o, 1)},112 Q${X(53, 1)},${r2(118.6 + o * 0.6)} ${X(40, 1)},117.4 Q${X(27, 1)},${r2(118.6 + o * 0.6)} ${X(15 - o, 1)},112 Q${X(20)},70 ${X(29)},45 Z`;
  const ma = forme(0), mb = forme(1);
  const veines = [-1, 1].map(m => {
    const Y = (x, lo) => X(40 + m * (x - 40), lo);
    let d = `M${Y(30)},50 Q${Y(23)},78 ${Y(18.6, 1)},108`;
    for (const [y, x, dx, dy] of [[60, 26.6, -4.2, 6], [74, 23.6, -5, 7.4], [88, 21.2, -5.2, 7.6], [70, 25, 3.4, 6.4], [84, 22, 3.8, 7]]) d += ` M${Y(x, y > 95)},${y} Q${Y(x + dx * 0.3, y > 95)},${r2(y + dy * 0.7)} ${Y(x + dx, y + dy > 95)},${r2(y + dy)}`;
    return d;
  }).join(' ') + (dos ? ` M${X(40)},46 L${X(40, 1)},112` : '');
  const plumes = [16, 20.4, 24.8, 29.2, 33.6, 38, 42.4, 46.8, 51.2, 55.6, 60, 64.4].map((x, i) => plume(+X(x, 1), 106.4 + (i % 2) * 1.6, (i - 5.5) * 4, S.plumes[i % 3])).join('')
    + [18.6, 23.2, 27.8, 52.2, 56.8, 61.4].map((x, i) => plume(+X(x, 1), 97 + (i % 2) * 1.4, i < 3 ? -8 : 8, S.plumes[(i + 1) % 3])).join('');
  const bord = [[22.4, 60], [19.6, 74], [18, 88], [57.6, 60], [60.4, 74], [62, 88]];
  let orne = bord.map(([x, y], i) => feuille(+X(x), y, 4, 1.6, (x < 40 ? -30 : 30) + (i % 2 ? 16 : -8), S.feuille, S.capeS)).join('');
  if (S.orne === 'fleurs') orne += [[24, 66], [21, 82], [56, 66], [59, 82], [26, 92], [54, 92]].map(([x, y], i) => fleur(+X(x), y, i % 2 ? 1.1 : 1.4, S.fleur, '#FFE7A3')).join('');
  else if (S.orne === 'givre') orne += [[24, 66], [21, 82], [56, 66], [59, 82], [26, 92], [54, 92]].map(([x, y]) => etoile(+X(x), y, 1.6, '#FFFFFF') + etoile(+X(x) + 1.6, y + 3, 0.9, '#E8F4FF')).join('');
  else orne += [[24.4, 68], [56, 80], [21, 90]].map(([x, y]) => fleur(+X(x), y, 1.1, S.fleur, '#FFE7A3')).join('');
  const aile = r2(0.6 + 0.4 * Math.abs(Math.sin(((n || 0) % 8) / 8 * Math.PI * 4 + 1)));
  const papillons = dos ? papillon(+X(30), 84, aile, S.ailes[0], K.irisR) + papillon(+X(51), 72, r2(1.2 - aile * 0.5), S.ailes[1], K.irisR) + papillon(+X(46), 96, aile, S.ailes[0], K.irisR)
    : papillon(+X(21), 78, aile, S.ailes[0], K.irisR) + papillon(+X(60), 70, r2(1.2 - aile * 0.5), S.ailes[1], K.irisR) + papillon(+X(61.6, 1), 100, aile, S.ailes[0], K.irisR);
  const ourlet = `<path d="M${X(12, 1)},113 Q${X(40, 1)},121.6 ${X(68, 1)},113" fill="none" stroke="${S.hem}" stroke-width="2.4"/>`;
  return vivant(ma, mb, S.cape, 0.9, vivante, '6.4s')
    + `<clipPath id="${id}mc"><path d="${ma}">${vivante ? ondule(ma, mb, '6.4s') : ''}</path></clipPath><g clip-path="url(#${id}mc)"><rect x="${X(49)}" y="40" width="22" height="84" fill="${S.capeS}" opacity=".85"/>`
    + (nuit ? '' : lueur(veines, S.nerv, 0.7, 0.85)) + ourlet + plumes + orne + '</g>' + (nuit ? '' : papillons);
}

// Endormie sous le Voile (choix de l'auteur, 16 oct. : pas de racines, elles sont à ce qui dort sous l'île) : la mousse
// à ses pieds (mousse, derrière elle) ; le lierre qui monte le long du manteau et barre l'ourlet de la robe, ses feuilles,
// ses fleurs fermées (lierre, devant elle). eclos : 0 → 1, les boutons s'ouvrent en fleurs (l'éveil) ; k : sa présence
// (0 → 1, il s'efface quand elle se lève)
function mousse(K, k = 1) {
  return `<g opacity="${r2(k)}">` + [[24, 121.4, 6.4], [33, 122.6, 7], [44, 122.8, 7.4], [55, 121.6, 6.2], [40, 121, 5]].map(([x, y, r]) => E(x, y, r, r * 0.36, K.moss, 0.6)).join('')
    + [[26, 120.4], [36, 121.4], [47.6, 121.6], [53.4, 120.6]].map(([x, y]) => E(x, y, 1.6, 0.6, K.mossS, 0)).join('') + '</g>';
}
function lierre(K, eclos = 0, k = 1, dos = false) {
  const tige = d => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${K.ivy}" stroke-width="0.9" stroke-linecap="round"/>`;
  const brins = dos ? ['M17.6,112 Q22,98 21,86 Q20,76 24.4,66', 'M62.4,112 Q58,98 59,86 Q60,76 55.6,66', 'M28,114 Q40,106 52,114']
    : ['M17.6,112 Q22,98 21,86 Q20,76 24.4,66', 'M62.4,112 Q58,98 59,86 Q60,76 55.6,66', 'M31,112.6 Q40,105.4 49,112.6'];
  let s = brins.map(tige).join('');
  s += [[19.4, 104, -40], [22, 92, 30], [20.8, 80, -30], [60.6, 104, 40], [58, 92, -30], [59.2, 80, 30], [34.4, 109.6, -70], [45.6, 109.6, 70]]
    .map(([x, y, r]) => feuille(x, y, 3.2, 1.3, r, K.ivy, K.ivyS)).join('');
  // les boutons fermés, qui s'ouvrent en fleurs
  const boutons = [[22.4, 98], [20.6, 86], [23.6, 70], [57.6, 98], [59.4, 86], [56.4, 70], [40, 107]];
  s += boutons.map(([x, y], i) => {
    const e = Math.max(0, Math.min(1, eclos * 1.4 - i * 0.06));
    return e > 0.05 ? fleur(x, y, 0.6 + 0.7 * e, K.bud, '#FFE7A3') : P(`M${r2(x)},${r2(y - 1.6)} Q${r2(x + 1.2)},${r2(y)} ${r2(x)},${r2(y + 1)} Q${r2(x - 1.2)},${r2(y)} ${r2(x)},${r2(y - 1.6)} Z`, K.bud, 0.45)
      + `<path d="M${r2(x)},${r2(y - 1.2)} L${r2(x)},${r2(y + 0.6)}" stroke="${K.budS}" stroke-width="0.35"/>`;
  }).join('');
  return `<g opacity="${r2(k)}">${s}</g>`;
}

// ---- l'image ----
// anya(c, view, o) : une image d'Anya, de 80 × 128.
//   o.n : l'image ; o.lev : sa hauteur au-dessus du sol (elle flotte) ; o.sw : le balancement (le vent du déplacement,
//   -1 → 1) ; o.lean : le buste penché (degrés) ; o.expr ; o.blink ; o.bras : { g: [main, coude ±1, forme], d: […] } (les
//   mains, à gauche et à droite de l'écran ; un 4e terme false : sans le voile du bras) ; o.under, o.over : ce que le geste dessine derrière, devant ; o.glow : la
//   lueur (0 → 1.4) ; o.pierre : 0 → 1 (le gris de la statue, l'éveil) ; o.lierre : 0 → 1, la mousse et le lierre du
//   Voile (o.eclos : 0 → 1, ses fleurs s'ouvrent) ; o.fleurs : les fleurs au sol ;
//   o.brasDevant : les bras par-dessus les mèches et le visage (un geste qui les lève devant elle)
function anya(c, view, o = {}) {
  const S = SAISONS[c.saison || 'ete'], nuit = o.pierre >= 0.99, voilee = (o.pierre || 0) > 0;
  const base = { ...C, ...(c.pal || {}) };
  const K = voilee ? Object.fromEntries(Object.entries(base).map(([k, v]) => [k, typeof v === 'string' && v[0] === '#' ? pierre(v, o.pierre) : v])) : base;
  const Sk = voilee ? Object.fromEntries(Object.entries(S).map(([k, v]) => [k, typeof v === 'string' && v[0] === '#' ? pierre(v, o.pierre) : Array.isArray(v) ? v.map(x => pierre(x, o.pierre)) : v])) : S;
  const vivante = !voilee, dos = view === 'ne', se = view === 'se', mir = !!c.miroir;
  const id = `${c.uid}${view}${o.id || ''}${o.n || 0}`;
  const V = VISAGES[se ? 'se' : 'front'], kx = se ? V.kx : 0, kb = kx * 0.4, sw = o.sw || 0, lev = o.lev || 0;
  const expr = o.expr || (nuit ? 'recueillie' : 'veille');
  const glowK = nuit ? 0 : (o.glow != null ? o.glow : 1);
  let s = '';
  // l'ombre au sol (plus petite et plus claire quand elle s'élève), la lueur autour d'elle
  s += `<ellipse cx="40" cy="123" rx="${r2(14 - lev * 0.6)}" ry="2.2" fill="rgba(30,40,70,${r2(0.22 - lev * 0.012)})"/>`;
  if (glowK) s += `<defs><radialGradient id="${id}gl"><stop offset="0" stop-color="rgb(${C.glow})" stop-opacity="${r2(0.55 * glowK)}"/><stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/></radialGradient></defs>`
    + `<ellipse cx="40" cy="${r2(64 - lev)}" rx="${r2(40 * Math.min(1.1, 0.9 + glowK * 0.15))}" ry="64" fill="url(#${id}gl)"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" values=".8;1;.8" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></ellipse>`;
  // les fleurs qui éclosent au sol, sous elle
  s += o.fleurs || '';
  // les lucioles, leur moitié derrière elle
  const t = ((o.n || 0) % 8) / 8;
  const flies = nuit ? [] : [0, 1, 2, 3, 4, 5].map(i => { const a = (t + i / 6) * Math.PI * 2; return { x: 40 + Math.cos(a) * 30, y: 70 + Math.sin(a * 2) * 9 + Math.sin(a) * 30 - lev, back: Math.sin(a) < 0 }; });
  s += flies.filter(f => f.back).map(f => luciole(f.x, f.y)).join('');
  s += o.lierre ? mousse(K, o.lierre) : '';
  // le corps, qui flotte (et se penche)
  let g = '';
  const shL = [31.2 + kb, 48.6], shR = [48.8 + kb * (se ? 1.5 : 1), 48.6];
  const repos = { g: [[26.4 + kb, 79.4], -1, 'repos'], d: [[53.6 + kb, 79.4], 1, 'repos'] };
  const B = { ...repos, ...(o.bras || {}) };
  const unBras = ([h, sgn, forme, voile = true], a) => bras(K, a, h, sgn, { main: forme, voile, vivante, nuit });
  if (dos) {
    // de dos : la robe se devine, le manteau par-dessus, les bras sur les côtés, la chevelure qui sort entre les bois
    g += o.under || '';
    g += robe(K, id, 0, sw, vivante, true) + manteau(K, Sk, id, 0, sw, vivante, true, nuit, o.n);
    if (o.lierre) g += lierre(K, o.eclos || 0, o.lierre, true);
    g += unBras(B.g, shL) + unBras(B.d, shR);
    g += teteDeDos(K) + chevelure(K, id, 0, sw, vivante, true) + reflet40(couronne(K, 0, mir ? 1 : -1, nuit, o.n || 0), false);
  } else {
    // la chevelure derrière la tête, le manteau, la robe, le cou ; le bras du fond (de trois quarts) ; les bras ; les
    // mèches par-dessus le haut des bras (comme l'origine) ; les oreilles, le visage qui en recouvre la racine, la couronne
    g += chevelure(K, id, kx, sw, vivante, false) + manteau(K, Sk, id, kx, sw, vivante, false, nuit, o.n);
    g += o.under || '';
    g += robe(K, id, kb, sw, vivante, false) + cou(K, kx * 0.6, nuit);
    if (o.lierre) g += lierre(K, o.eclos || 0, o.lierre);
    if (se) g += unBras(B.d, shR);
    g += (o.brasDevant ? '' : unBras(B.g, shL) + (se ? '' : unBras(B.d, shR)));
    g += mechesDevant(K, V.X, sw, vivante);
    g += oreilles(K, view) + tete(c, K, view, o.blink && expr === 'veille' ? 'cligne' : expr, o.n || 0, nuit);
    g += couronne(K, kx, mir ? -1 : 1, nuit, o.n || 0);
    if (o.brasDevant) g += unBras(B.g, shL) + (se ? '' : unBras(B.d, shR));
  }
  g += o.over || '';
  const lean = o.lean ? ` rotate(${r2(o.lean)} 40 90)` : '';
  s += `<g transform="translate(0 ${r2(3.6 - lev)})${lean}">${g}</g>`;
  s += flies.filter(f => !f.back).map(f => luciole(f.x, f.y)).join('');
  // le Voile : une brume grise, froide, qui l'enveloppe (endormie)
  if (voilee) s += `<rect x="0" y="0" width="80" height="128" fill="#9EA6B4" opacity="${r2(0.22 * o.pierre)}"/>`;
  return s;
}
const reflet40 = (s, oui) => (oui ? `<g transform="translate(80 0) scale(-1 1)">${s}</g>` : s);

module.exports = { anya, C, SAISONS, EXPR: EXPR_A, bras, fleur, luciole, etoile, lueur, pierre, L1, L2 };
