// Maggy (anciennement Mélisse ; fichiers du jeu : melisse), la jardinière des lunes, refonte : le même personnage, le même
// cadre 48 × 64, le même trait et le même kit (troupe.js), poussé plus loin, comme Lorena, Agathe, Nathan, Robby, Léo et
// Maerys. 35 ans, le grand chapeau de paille au bouquet de fleurs séchées, la longue tresse sur l'épaule, le châle couleur
// nuit brodé de lunes, la robe sauge, les sabots, les mains toujours terreuses, la boîte à graines en fer serrée contre
// elle. Calme absolu : au repos, les paupières lourdes, un sourire en coin, le regard ailleurs.
// Son arrivée (choix de l'auteur, 16 oct.) : sa barque de graines s'est brisée sur une autre côte de l'île ; elle a erré
// dans la forêt, quelqu'un la suivait ; elle en sort, en danger, et trouve des gens. Ce que l'état laisse sur elle
// (maggy_tenues.js) : poursuivie, le châle accroché aux ronces, des feuilles et une brindille prises dans le chapeau de
// travers, la tresse défaite ; la terre du Potager, la pièce cousue au camp, l'eau ; naufragée, délavée, le châle noué à
// la taille, le bord du chapeau déchiré, un sabot perdu.
// Trois vues (face, trois quarts avant, dos) ; c.miroir : la direction sera retournée par le jeu, ses marques passent de
// l'autre côté avant, pour retomber du bon côté de son corps (la tresse sur son épaule gauche, le bouquet du chapeau à sa
// droite, la pièce à sa hanche gauche).
// Trois tenues (c.tenue) : chale (le châle de nuit sur la robe : son arrivée), tablier (le tablier du Potager, ses poches,
// le transplantoir, les manches retroussées), pluie (la pèlerine cirée, pour jardiner sous l'averse).
const { P, E, L, clip, r2, OUT, lerp, arm, shoe, bareFoot, dechirure, filPendant } = require('../troupe');
const melisse = require('../melisse');
const { EXPR, ALIAS, X, eye, brow, mouth, extras } = require('./visage');
const { seam, suitOurlet } = require('./tissu');
const { fabriquerBras } = require('./lorena_bras');
const { jambe } = require('./membres');
const { capucheRabattue, reperes } = require('../avatar_accessoires');
const { hole, rip } = require('../../atelier/naufrage');
const { fondre } = require('../couleurs'); // le fondu néon des couleurs (le corps et les métaux gardent les leurs)

const C = fondre({
  skin: '#C68A62', skinS: '#A9704C', lid: '#B97E58', under: '#8E5E44', nose: '#8E5A3E', cheek: '#E08A7A',
  eye: '#1E1620', iris: '#6E6A9E', irisL: '#B9B4E0', eyeRx: 1.8, eyeRy: 2.4, brow: '#1C1620', browW: 0.9, mouth: '#6A3028',
  hand: '#BA8A64', handDirt: '#7A5A40',
  hair: '#2B2230', hairS: '#1C1620', hairH: '#5A4A66', rim: '#9FE3DA',
  straw: '#E3C27A', strawS: '#BF9A52', strawH: '#F2DCA0', band: '#7A4A6A', bandS: '#5A3450',
  lavender: '#A88BD0', lavS: '#7E64A8', pink: '#E89AB0', yellow: '#F2C94C', stem: '#6E8A4A',
  shawl: '#2E3A6B', shawlS: '#232C52', shawlH: '#46578E', moon: '#F4EEDF',
  dress: '#8FA27A', dressS: '#728560', dressH: '#AABB94',
  apron: '#E6DCC3', apronS: '#C9BB98', apronH: '#F4EEDF',
  cape: '#6A4A6E', capeS: '#4E3452', capeH: '#9A7A9E',
  wood: '#A8743F', woodS: '#7E5530', woodH: '#C9965E', stock: '#5A4A44', stockS: '#463A35',
  iron: '#6E7480', ironS: '#545A65', ironH: '#9AA2AD', brass: '#C9A24A', glow: '#F6E7A0',
  mud: '#6B5138', salt: '#FFF8E8', leaf: '#5E9E4A', leafS: '#467A37', twig: '#8A6440', weed: '#5E9A62', patch: '#B07E4C'
});

// Les marques sur elle, réglées par l'état (maggy_tenues.js) : la terre (dirt, 0 → 1 : aux mains et au bas de la robe) ;
// poursuivie (ronces : le châle accroché, les feuilles dans le chapeau, la tresse défaite) ; le sel (salt) ; la pièce
// cousue (patch) ; trempée (wet) ; naufragée (naufrage : le châle noué à la taille, le chapeau déchiré, un sabot perdu)
const MARKS = { dirt: 0.3, ronces: true, salt: 0, patch: false, wet: false, naufrage: false };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
// sa palette, et les noms que les manches attendent (lorena_bras.js : coat → la robe ; sous la pèlerine aussi)
const pal = c => {
  const K = { ...C, ...(c.pal || {}) };
  return { ...K, coat: K.dress, coatS: K.dressS, coatH: K.dressH, shirt: K.dress, shirtS: K.dressS };
};
const reflet = (axe, s, oui) => (oui ? `<g transform="translate(${r2(2 * axe)} 0) scale(-1 1)">${s}</g>` : s);

// Ses expressions : celles de la troupe refondue ; au repos, calme absolu (les paupières lourdes, le regard un peu à côté,
// un sourire en coin) ; essoufflée (son arrivée : poursuivie) ; à la lune (les yeux fermés, paisible) ; le regard levé
const EXPR_G = {
  ...EXPR,
  veille: X({ brow: [-0.15, 0.1, -0.45], lid: 0.4, tilt: -0.02, look: [0.15, 0.1], under: 0.35, mouth: 'half' }),
  essoufflee: X({ brow: [-1, 0.35, -0.2], lid: 0.08, tilt: -0.3, look: [-0.45, 0], under: 0.6, mouth: 'open', extras: ['sweat'] }),
  lune: X({ brow: [-0.5, 0, -0.5], mode: 'closed', under: 0.3, mouth: 'soft' }),
  // le regard levé, doux (Lunette sur son chapeau)
  leve: X({ brow: [-0.6, -0.4, -0.6], lid: 0.08, look: [0.35, -0.75], under: 0.3, mouth: 'soft' })
};

// ---- les petites choses ----
// Un croissant de lune (la broderie du châle, les graines qui luisent)
const croissant = (x, y, r, fill) => `<path d="M${r2(x)},${r2(y - r)} A${r} ${r} 0 1 0 ${r2(x)},${r2(y + r)} A${r2(r * 0.72)} ${r} 0 1 1 ${r2(x)},${r2(y - r)} Z" fill="${fill}"/>`;
// Une feuille en amande (base en x, y ; rot en degrés, 0 : la pointe vers le bas)
const feuille = (x, y, len, w, rot, fill, nerv) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">`
  + P(`M0,0 Q${r2(w)},${r2(len * 0.45)} 0,${r2(len)} Q${r2(-w)},${r2(len * 0.45)} 0,0 Z`, fill, 0.55) + L([0, 0.5], [0, len - 0.7], nerv, 0.3) + '</g>';
// La boîte à graines en fer : rivetée, le croissant embouti sur le couvercle, le loquet de laiton, la peinture usée ;
// open : le couvercle relevé (les graines qui luisent dedans)
function boite(K, x, y, open = false) {
  const lid = open
    ? P(`M${r2(x - 3.7)},${r2(y - 2.2)} L${r2(x + 3.7)},${r2(y - 2.2)} L${r2(x + 2.9)},${r2(y - 5.4)} L${r2(x - 2.9)},${r2(y - 5.4)} Z`, K.ironS, 0.75)
      + croissant(x, y - 3.9, 0.8, K.ironH) + E(x, y - 1.6, 2.8, 0.8, K.glow, 0).replace('/>', ' opacity=".85"/>')
    : `<rect x="${r2(x - 3.9)}" y="${r2(y - 3)}" width="7.8" height="1.6" rx="0.45" fill="${K.ironH}" stroke="${OUT}" stroke-width="0.75"/>`;
  return `<rect x="${r2(x - 3.7)}" y="${r2(y - 2.2)}" width="7.4" height="4.6" rx="0.6" fill="${K.iron}" stroke="${OUT}" stroke-width="0.85"/>`
    + `<rect x="${r2(x + 1.6)}" y="${r2(y - 1.8)}" width="1.7" height="3.8" fill="${K.ironS}"/>` + L([x - 3, y + 1.6], [x - 1.2, y + 1.6], K.ironH, 0.4)
    + [[-2.8, -1.2], [2.8, -1.2], [-2.8, 1.6], [2.8, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.33, 0.33, K.ironH, 0)).join('') + lid
    + (open ? '' : croissant(x - 1.4, y - 2.25, 0.55, K.ironS) + `<rect x="${r2(x - 0.6)}" y="${r2(y - 1.8)}" width="1.2" height="1.4" rx="0.3" fill="${K.brass}" stroke="${OUT}" stroke-width="0.45"/>`);
}

// ---- le corps ----
// La robe sauge, un peu évasée, sous le genou ; sw : le bas qui balance en marchant
const ROBE = sw => `M16.2,33 Q24,30.4 31.8,33 Q34.2,43 ${r2(34.8 + sw)},53.4 Q${r2(24 + sw)},55.8 ${r2(13.2 + sw)},53.4 Q13.8,43 16.2,33 Z`;
function robe(c, ctx, K, M, k, mir) {
  const u = c.uid, sw = r2((ctx.sway || 0) * 0.3);
  // naufragée : le bas déchiré en languettes
  const tb = M.naufrage ? basDechire(r2(34.8 + sw), r2(13.2 + sw), 53.4, r2(24 + sw), 55.8, 7, mir) : null;
  const d = tb ? `M16.2,33 Q24,30.4 31.8,33 Q34.2,43 ${r2(34.8 + sw)},53.4 ${tb.d} Q13.8,43 16.2,33 Z` : ROBE(sw);
  const ourlet = off => suitOurlet(13.2 + sw, 34.8 + sw, 53.4, 55.8, off);
  let s = P(d, K.dress) + clip(`${u}r`, d, `<rect x="${ctx.view === 'se' ? 26.4 : 28}" y="30" width="12" height="28" fill="${K.dressS}"/>`
    + `<path d="${ourlet(1)} L38,58 L10,58 Z" fill="${K.dressS}"/>`
    + `<rect x="15.6" y="37" width="1.3" height="14" rx="0.65" fill="${K.dressH}"/>`
    + `<path d="M19.8,40 Q19,46.6 18.2,53.8 M28.6,40 Q29.4,46.6 30.2,53.8" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>`
    + (M.dirt ? `<path d="${ourlet(2.4)} L38,58 L10,58 Z" fill="${K.mud}" opacity="${r2(0.35 * M.dirt)}"/>` : '')
    + (M.salt ? `<path d="${ourlet(1.8)}" fill="none" stroke="${K.salt}" stroke-width="0.65" opacity="${r2(0.7 * M.salt)}"/>` : '')) + P(d, 'none');
  if (tb) s += tb.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join('');
  // poursuivie : l'accroc au bas de la robe, à la ronce
  if (M.ronces && !M.naufrage) s += reflet(24 + k, rip(30.4 + k, 51.6, 1.4), mir);
  return s;
}
// Le bas déchiré, de droite à gauche ; en miroir, les lambeaux passent de l'autre côté (le même tracé lu à l'envers)
function basDechire(xr, xl, y, qx, qy, seed, mir) {
  if (!mir) return dechirure([xr, y], [qx, qy], [xl, y], seed);
  const m = dechirure([xl, y], [qx, qy], [xr, y], seed);
  const pts = m.d.split('L').map(s => s.trim()).filter(Boolean);
  pts.pop();
  return { d: [...pts.reverse(), `${xl},${y}`].map(p => `L${p}`).join(' '), tips: m.tips };
}
// Le tablier du Potager : la bavette jusqu'à la poitrine, ses bretelles, deux grandes poches (le transplantoir, un sachet
// de graines), la terre ; de dos, les liens noués au creux des reins
function tablier(c, ctx, K, M, k, mir) {
  const u = c.uid, dos = ctx.view === 'ne', sw = r2((ctx.sway || 0) * 0.3), axe = 24 + k;
  if (dos) {
    return P('M17.4,41.6 Q24,42.8 30.6,41.6', 'none', 0.8) + P('M24,42.2 Q19.6,38.8 18.8,41.8 Q19.6,44.8 24,42.2 Z', K.apron, 0.8) + P('M24,42.2 Q28.4,38.8 29.2,41.8 Q28.4,44.8 24,42.2 Z', K.apron, 0.8)
      + P('M23.4,42.8 L21.8,48.4 L23.4,48 Z', K.apron, 0.7) + P('M24.6,42.8 L26.2,48.4 L24.6,48 Z', K.apron, 0.7) + E(24, 42.2, 1.2, 1, K.apronS, 0.7)
      + `<path d="M18.6,33.2 L29.4,41 M29.4,33.2 L18.6,41" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="M18.6,33.2 L29.4,41 M29.4,33.2 L18.6,41" stroke="${K.apron}" stroke-width="0.9" stroke-linecap="round"/>`;
  }
  const d = `M${20 + k},34.4 L${28 + k},34.4 L${28.8 + k},40.6 Q${r2(33.6 + k + sw)},46 ${r2(33.4 + k + sw)},52 Q${r2(24 + k + sw)},54 ${r2(14.6 + k + sw)},52 Q${r2(14.4 + k + sw)},46 ${19.2 + k},40.6 Z`;
  let s = P(d, K.apron) + clip(`${u}t`, d, `<rect x="${28 + k}" y="30" width="10" height="26" fill="${K.apronS}"/>`
    + (M.dirt ? [[19.6 + k, 49.2, 2], [27 + k, 50.6, 1.6], [23.4 + k, 45.4, 1.1]].map(([x, y, r]) => E(x, y, r, r * 0.6, K.mud, 0).replace('/>', ` opacity="${r2(0.45 * M.dirt)}"/>`)).join('') : '')) + P(d, 'none');
  s += `<path d="M${20.6 + k},34.6 L${19.6 + k},32 M${27.4 + k},34.6 L${28.4 + k},32" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${20.6 + k},34.6 L${19.6 + k},32 M${27.4 + k},34.6 L${28.4 + k},32" stroke="${K.apron}" stroke-width="0.8" stroke-linecap="round"/>`;
  s += P(`M${19.2 + k},40.6 L${28.8 + k},40.6`, 'none', 0.7) + seam(`M${19.6 + k},41.3 L${28.4 + k},41.3`, 0.32);
  // les deux poches : le transplantoir à sa droite (à gauche de l'écran), le sachet de graines à sa gauche
  const poches = P(`M${16.6 + k},45.2 L${22 + k},45.2 L${21.8 + k},49.6 Q${19.2 + k},50.4 ${16.8 + k},49.6 Z`, K.apron, 0.6) + seam(`M${17.1 + k},45.8 L${21.5 + k},45.8`, 0.3)
    + P(`M${26 + k},45.2 L${31.4 + k},45.2 L${31.2 + k},49.6 Q${28.6 + k},50.4 ${26.2 + k},49.6 Z`, K.apron, 0.6) + seam(`M${26.5 + k},45.8 L${30.9 + k},45.8`, 0.3)
    + L([18.4 + k, 45.4], [17.4 + k, 41.6], OUT, 1.6) + L([18.4 + k, 45.4], [17.4 + k, 41.6], K.wood, 0.8) + P(`M${16.6 + k},42.4 L${18.2 + k},41 L${17.6 + k},39.2 Q${16.4 + k},39.6 ${16.6 + k},42.4 Z`, K.ironH, 0.5)
    + `<rect x="${27.4 + k}" y="42.6" width="2.6" height="3.2" rx="0.3" fill="${K.yellow}" stroke="${OUT}" stroke-width="0.45" transform="rotate(8 ${28.7 + k} 44.2)"/>` + E(28.6 + k, 43.8, 0.5, 0.5, K.leaf, 0);
  s += reflet(axe, poches, mir);
  if (M.patch) s += reflet(axe, P(`M${19.4 + k},50.4 L${22.6 + k},50.2 L${22.8 + k},52.8 L${19.6 + k},53 Z`, K.patch, 0.5) + seam(`M${19.8 + k},50.8 L${22.2 + k},50.65 L${22.35 + k},52.4 L${19.95 + k},52.55 Z`, 0.3), mir);
  return s;
}

function corps(c, ctx, K, M) {
  const view = ctx.view, t = c.tenue || 'chale', mir = !!c.miroir, dos = view === 'ne';
  const k = view === 'se' ? -1.6 : 0, axe = 24 + k;
  let s = robe(c, ctx, K, M, k, mir);
  // l'encolure ronde de la robe (de face et de trois quarts)
  if (!dos) s += P(`M${r2(axe - 3.6)},32.6 Q${axe},35 ${r2(axe + 3.6)},32.6`, 'none', 0.55);
  if (t === 'tablier') s += tablier(c, ctx, K, M, k, mir);
  // la pièce cousue sur la robe (sous le châle et la pèlerine), à sa hanche gauche
  if (M.patch && t !== 'tablier') {
    const px = dos ? 15.6 : 28.6 + k;
    s += reflet(dos ? 24 : axe, P(`M${px},46.4 L${r2(px + 3.4)},46.2 L${r2(px + 3.6)},49.4 L${r2(px + 0.2)},49.6 Z`, K.patch, 0.5) + seam(`M${r2(px + 0.45)},46.85 L${r2(px + 2.95)},46.7 L${r2(px + 3.1)},48.95 L${r2(px + 0.6)},49.1 Z`, 0.3), mir);
  }
  // naufragée : le châle noué à la taille, la pointe qui pend sur sa hanche ; un trou dans la robe
  if (M.naufrage) {
    s += reflet(axe, hole(dos ? 20.4 : 29.6 + k, 44.6, 0.9, K.dressS), mir && !dos);
    s += `<path d="M15,43.2 Q24,45.4 33,43.2 L33,45.6 Q24,47.8 15,45.6 Z" fill="${K.shawl}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
      + (dos ? P('M22.4,46.6 L24,53 L25.6,46.6 Z', K.shawl, 0.7) + L([24, 52.6], [24, 54], K.shawlS, 0.5)
        : reflet(axe, E(19.6 + k, 44.6, 1.4, 1.1, K.shawlS, 0.7) + P(`M${19 + k},45.6 L${17.8 + k},50.2 L${19.6 + k},49.8 Z`, K.shawl, 0.65), mir));
  }
  return s + mouillee(M, t === 'tablier' ? 54.8 : 54.8, ctx);
}
// trempée : des gouttes tombent du bas de la robe, en continu ; debout seulement
const mouillee = (M, hy, ctx) => (M.wet && !ctx.seatDy ? [[15.4, 0], [24.4, 0.55], [33, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r2(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r2(hy + 1)};${r2(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join('') : '');

// Le châle couleur nuit, sur les épaules (par-dessus le haut des bras) : brodé de croissants et d'étoiles, ses franges ;
// de dos, sa pointe descend dans le dos. Poursuivie : accroché aux ronces (un accroc, une boucle de fil, une feuille prise).
const CHALE = 'M14.8,32.6 Q24,29.4 33.2,32.6 L34.6,41.2 L30.6,38.8 Q24,42 17.4,38.8 L13.4,41.2 Z';
const CHALE_DOS = 'M14.8,32.6 Q24,29.4 33.2,32.6 L34,36.4 L24,48.2 L14,36.4 Z';
function chale(c, ctx, K, M) {
  const u = c.uid, dos = ctx.view === 'ne', mir = !!c.miroir, k = ctx.view === 'se' ? -1.2 : 0;
  const d = dos ? CHALE_DOS : CHALE;
  const lunes = (dos ? [[19.6, 36.2], [24, 42], [28.4, 36.2], [24, 34.4]] : [[16.4, 36.6], [31.6, 36.6], [20.2, 35], [27.8, 35]]).map(([x, y]) => croissant(x, y, 1, K.moon)).join('')
    + (dos ? [[21.8, 39.2], [26.2, 39.2], [24, 37.4]] : [[18.2, 37.6], [29.8, 37.6], [24, 33.8]]).map(([x, y]) => P(`M${x},${r2(y - 0.6)} L${r2(x + 0.18)},${r2(y - 0.18)} L${r2(x + 0.6)},${y} L${r2(x + 0.18)},${r2(y + 0.18)} L${x},${r2(y + 0.6)} L${r2(x - 0.18)},${r2(y + 0.18)} L${r2(x - 0.6)},${y} L${r2(x - 0.18)},${r2(y - 0.18)} Z`, K.moon, 0)).join('');
  let s = P(d, K.shawl) + clip(`${u}ch`, d, `<rect x="${ctx.view === 'se' ? 26.6 : 28}" y="28" width="10" height="22" fill="${K.shawlS}"/>` + lunes
    + `<path d="M15.6,33.6 Q24,30.8 32.4,33.6" fill="none" stroke="${K.shawlH}" stroke-width="0.6" opacity=".7"/>`) + P(d, 'none');
  // les franges
  const fr = dos ? [[22.4, 46.6], [24, 48.2], [25.6, 46.6]] : [[13.6, 41], [14.8, 40.4], [33.2, 40.4], [34.4, 41]];
  s += fr.map(([x, y]) => L([x, y], [x, y + 1.7], K.shawlS, 0.55)).join('');
  // poursuivie : l'accroc sur le pan droit (à gauche de l'écran ; de dos, à droite), la boucle de fil, la feuille prise
  if (M.ronces) {
    const a = dos ? [30.6, 38.4] : [17.6, 38.4];
    s += reflet(24, rip(a[0], a[1], 1.6) + `<path d="M${a[0] + 0.4},${a[1] + 0.4} q0.9,1.4 -0.2,2.2 q-0.8,-0.6 0.2,-2.2" fill="none" stroke="${K.shawlS}" stroke-width="0.4"/>`
      + feuille(a[0] + 1.6, a[1] - 1.6, 2.2, 0.85, 30, K.leaf, K.leafS), mir && !dos);
  }
  return k && !dos ? `<g transform="translate(${k} 0)">${s}</g>` : s;
}
// La pèlerine cirée (la pluie) : sur les épaules jusqu'aux coudes, ouverte devant, deux brides ; le reflet ciré, l'eau qui
// perle ; de dos, la capuche rabattue
function pelerine(c, ctx, K) {
  const u = c.uid, dos = ctx.view === 'ne', k = ctx.view === 'se' ? -1.4 : 0, axe = 24 + k;
  // (elle s'arrête aux coudes : les avant-bras, les mains et la boîte restent dehors)
  const d = `M14.6,32.8 Q24,29.4 33.4,32.8 Q35.4,36.8 35.8,40.6 Q24,43.2 12.2,40.6 Q12.6,36.8 14.6,32.8 Z`;
  let s = P(d, K.cape) + clip(`${u}pl`, d, `<rect x="${ctx.view === 'se' ? 26.6 : 28.4}" y="28" width="10" height="20" fill="${K.capeS}"/>`
    + `<path d="M15.6,34.8 Q14.6,37.6 14.2,40" fill="none" stroke="${K.capeH}" stroke-width="1" stroke-linecap="round" opacity=".75"/><path d="M17.4,35.4 Q16.9,36.8 16.7,38.2" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-linecap="round" opacity=".5"/>`
    + `<path d="${suitOurlet(12.2, 35.8, 40.6, 43.2, 0.8)}" fill="none" stroke="${K.capeS}" stroke-width="1.2"/>`) + P(d, 'none');
  if (dos) return s + capucheRabattue(u, 'ne', reperes(c), K.cape, K.capeS) + P('M24,33 L24,41.6', 'none', 0.5);
  // l'ouverture devant, les deux brides et leurs boutons
  s += P(`M${axe},34.6 L${axe},41.8`, 'none', 0.7);
  for (const y of [35.8, 38.8]) s += L([axe - 1.4, y], [axe + 1.4, y], K.capeS, 0.8) + E(axe + 1.4, y, 0.5, 0.5, K.brass, 0.35);
  return s;
}

// Les bras : les manches de la refonte (lorena_bras.js) ; la robe a ses manches longues (le tablier : retroussées)
const bras = fabriquerBras({ pal, marks });

// Les sabots de bois sur les bas sombres ; la terre du Potager ; naufragée, le sabot droit perdu (le pied nu)
function pied(c, x, y, dir, tilt) {
  const M = marks(c), K = pal(c);
  const droit = (c.view === 'ne' ? x >= 24 : x < 24) !== !!c.miroir;
  let s = M.naufrage && droit ? bareFoot({ ...c, skin: K.skin, skinS: K.skinS }, x, y, dir, tilt) : shoe(c, x, y, dir, tilt);
  if (!(M.naufrage && droit)) s += L([x - 1.6, y + 1.4], [x + 1.2, y + 1.2], K.woodH, 0.4).replace('/>', ' opacity=".7"/>');
  if (M.dirt) s += E(x - 0.4, y + 3.8, 2, 0.8, K.mud, 0).replace('/>', ` opacity="${r2(0.7 * M.dirt)}"/>`);
  return s;
}

// ---- la tête ----
const VUES = {
  front: {
    X: x => x, rk: [1, 1], k: 0, mouth: 24, ear: null,
    face: 'M12.4,22.4 C12.4,15.6 17.6,12.2 24,12.2 C30.4,12.2 35.6,15.6 35.6,22.4 C35.6,28.4 30.6,32.4 24,32.4 C17.4,32.4 12.4,28.4 12.4,22.4 Z'
  },
  se: {
    X: x => r2(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), rk: [0.95, 0.82], k: -1.6, mouth: 21, ear: [34.6, 23.4],
    face: 'M11.3,22.4 C11.3,15.6 16.3,12.2 22.6,12.2 C28.9,12.2 33.9,15.6 33.9,22.4 C33.9,28.4 29,32.4 22.6,32.4 C16.2,32.4 11.3,28.4 11.3,22.4 Z'
  }
};
const decaler = (d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
// les cheveux sous le chapeau : la masse jusqu'aux oreilles, la frange partagée au milieu
const MASSE = 'M11.4,21 Q11,12 24,11.8 Q37,12 36.6,21 Q36.8,27 34.8,28.4 L13.2,28.4 Q11.2,27 11.4,21 Z';
const FRANGE = 'M12.4,20 Q12.6,13.4 24,13.2 Q35.4,13.4 35.6,20 Q33,15.6 25,15.2 L24,16.6 L23,15.2 Q15,15.6 12.4,20 Z';

// Le grand chapeau de paille : le bord (la paille tressée en cercles, son ombre), la calotte, le ruban prune et le
// bouquet de fleurs séchées (lavande, une rose, une fleur jaune) à sa droite ; poursuivie : de travers, une feuille et une
// brindille prises au bord ; naufragée : le bord déchiré, une algue accrochée
function chapeau(K, M, id, dos, mir) {
  const bord = `M6.4,12.6 a17.6,4.4 0 1,0 35.2,0 a17.6,4.4 0 1,0 -35.2,0 Z`;
  const tresse = [3.4, 2.2, 1].map(rr => `<ellipse cx="24" cy="12.6" rx="${r2(17.6 - (3.4 - rr) * 3.4)}" ry="${r2(4.4 - (3.4 - rr) * 0.9)}" fill="none" stroke="${K.strawS}" stroke-width="0.35" stroke-dasharray=".8 .7" opacity=".8"/>`).join('');
  let s = P(bord, K.straw) + clip(`${id}hb`, bord, `<ellipse cx="22" cy="11.2" rx="16" ry="3.4" fill="${K.strawH}"/><rect x="31" y="6" width="12" height="12" fill="${K.strawS}" opacity=".8"/>` + tresse) + P(bord, 'none');
  if (M.naufrage) s += reflet(24, P('M36.4,15.4 L37.6,17.8 L38.6,15.6 L39.8,16.6 L39.4,14.4 Z', '#E6DCC3', 0.5) + `<path d="M36.6,15.8 Q35.8,18.6 36.8,21" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M36.6,15.8 Q35.8,18.6 36.8,21" fill="none" stroke="${K.weed}" stroke-width="0.8" stroke-linecap="round"/>`, mir);
  const calotte = 'M15.4,12.4 Q15.6,3.4 24,3.2 Q32.4,3.4 32.6,12.4 Q24,14.2 15.4,12.4 Z';
  s += P(calotte, K.straw) + clip(`${id}hc`, calotte, `<rect x="27.4" y="2" width="8" height="12" fill="${K.strawS}" opacity=".8"/>` + [6.2, 8].map(y => `<path d="M15,${y} Q24,${y + 1.4} 33,${y}" fill="none" stroke="${K.strawS}" stroke-width="0.35" stroke-dasharray=".8 .7"/>`).join('')) + P(calotte, 'none');
  s += P('M15.6,9.8 Q24,11.6 32.4,9.8 L32.6,12.4 Q24,14.2 15.4,12.4 Z', K.band, 0.75) + L([16.2, 11.2], [21, 12.2], K.bandS, 0.5);
  s += L([18, 6], [21.4, 4.6], K.strawH, 1);
  // le bouquet : sur sa droite (à gauche de l'écran ; de dos, à droite)
  const bouquet = L([16.4, 11.6], [15.6, 7.8], K.stem, 0.5) + L([17.4, 11.6], [17.4, 7.4], K.stem, 0.5)
    + [7.8, 8.6, 9.4].map(y => E(15.6 + (9.4 - y) * 0.1, y, 0.45, 0.6, K.lavender, 0.3)).join('') + [7.4, 8.2].map(y => E(17.4, y, 0.42, 0.55, K.lavS, 0.3)).join('')
    + E(18.8, 10.6, 1, 1, K.pink, 0.5) + E(18.6, 10.4, 0.35, 0.35, '#F6C6D4', 0) + E(20.6, 11, 0.75, 0.75, K.yellow, 0.45) + feuille(17.6, 11.6, 2, 0.8, -60, K.leaf, K.leafS);
  s += reflet(24, bouquet, dos ? !mir : mir);
  if (M.ronces) s += reflet(24, feuille(33.8, 13.6, 2.6, 1, -40, K.leaf, K.leafS) + L([30.4, 13.8], [34.6, 15.6], OUT, 1.2) + L([30.4, 13.8], [34.6, 15.6], K.twig, 0.55) + L([33.2, 15], [33.8, 16.6], K.twig, 0.45), dos ? !mir : mir);
  // poursuivie : le chapeau de travers (penché vers sa droite)
  return M.ronces && !M.naufrage ? `<g transform="rotate(-5 24 9)">${s}</g>` : s;
}
// La tresse (la natte) : elle part de sous les cheveux, derrière la tête, et suit une courbe (p0 → p2, contrôle p1) en
// s'affinant (w0 → w1). Chaque mèche est un lobe arrondi, penché d'un côté puis de l'autre, qui recouvre la mèche du
// dessous (on dessine de bas en haut) ; son reflet, l'ombre de la mèche d'au-dessus. bout : le lien prune, sa fleur rose et
// la petite touffe ; poursuivie, la natte se défait (deux mèches s'échappent)
function natte(K, M, [p0, p1, p2], w0, w1, nb, bout) {
  const at = t => { const u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; };
  const tan = t => { const u = 1 - t; return [2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])]; };
  let s = '';
  for (let i = nb - 1; i >= 0; i--) {
    const t = (i + 0.5) / nb, [x, y] = at(t), [tx, ty] = tan(t), a = Math.atan2(ty, tx) * 180 / Math.PI - 90;
    const w = w0 + (w1 - w0) * t, m = i % 2 ? 1 : -1, len = Math.hypot(tx, ty) / nb * 0.78;
    // le lobe : une goutte arrondie, décalée vers son côté et penchée vers l'autre (le croisé de la natte)
    const lobe = `M${r2(-w * 0.5)},${r2(-len * 0.55)} Q${r2(w * 0.55)},${r2(-len * 0.9)} ${r2(w * 0.5)},${r2(len * 0.25)} Q${r2(w * 0.2)},${r2(len * 0.95)} ${r2(-w * 0.35)},${r2(len * 0.6)} Q${r2(-w * 0.62)},${r2(len * 0.1)} ${r2(-w * 0.5)},${r2(-len * 0.55)} Z`;
    s += `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(a)}) translate(${r2(m * w * 0.12)} 0) rotate(${m * 24}) scale(${m} 1)">`
      + P(lobe, K.hair, 0.65)
      + `<path d="M${r2(-w * 0.28)},${r2(-len * 0.35)} Q${r2(w * 0.12)},${r2(-len * 0.5)} ${r2(w * 0.3)},${r2(len * 0.05)}" fill="none" stroke="${K.hairH}" stroke-width="0.45" stroke-linecap="round" opacity=".85"/>`
      + `<path d="M${r2(-w * 0.32)},${r2(len * 0.42)} Q${r2(0)},${r2(len * 0.7)} ${r2(w * 0.3)},${r2(len * 0.35)}" fill="none" stroke="${K.hairS}" stroke-width="0.5" stroke-linecap="round"/></g>`;
  }
  if (bout) {
    const [x, y] = at(1), [tx, ty] = tan(1), a = Math.atan2(ty, tx) * 180 / Math.PI - 90;
    s += `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(a)})">`
      + P('M-0.9,0.2 Q-1.3,1.6 -0.8,2.6 L-0.3,1.8 L0.1,2.9 L0.5,1.8 L1,2.5 Q1.3,1.4 0.9,0.2 Z', K.hair, 0.6)
      + `<rect x="-1.1" y="-0.7" width="2.2" height="1.1" rx="0.45" fill="${K.band}" stroke="${OUT}" stroke-width="0.45"/>`
      + E(1.4, -0.4, 0.75, 0.75, K.pink, 0.4) + E(1.3, -0.5, 0.25, 0.25, '#F6C6D4', 0) + '</g>';
  }
  if (M.ronces) {
    const [x1, y1] = at(0.35), [x2, y2] = at(0.7);
    s += `<path d="M${r2(x1 + 1)},${r2(y1)} q1.6,1 1,3" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linecap="round"/><path d="M${r2(x1 + 1)},${r2(y1)} q1.6,1 1,3" fill="none" stroke="${K.hair}" stroke-width="0.5" stroke-linecap="round"/>`
      + `<path d="M${r2(x2 - 1)},${r2(y2)} q-1.4,0.9 -1,2.6" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linecap="round"/><path d="M${r2(x2 - 1)},${r2(y2)} q-1.4,0.9 -1,2.6" fill="none" stroke="${K.hair}" stroke-width="0.5" stroke-linecap="round"/>`;
  }
  return s;
}
// la tresse de face et de trois quarts : de derrière la joue (sous les cheveux), elle passe sur son épaule gauche (à droite
// de l'écran) et tombe devant, jusqu'à la taille
const tresse = (K, M, k) => natte(K, M, [[33 + k, 25.4], [32.4 + k, 33.2], [30.4 + k, 44.4]], 3.4, 2.2, 8, true);

function tete(c, ctx) {
  const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
  if (ctx.view === 'ne') return teteDeDos(c, ctx, K, M, mir, id);
  const V = VUES[ctx.view] || VUES.front, Xv = V.X, k = V.k, se = ctx.view === 'se', axe = 24 + k;
  const name = ALIAS[ctx.expr] || ctx.expr;
  const ex = ctx.blink && name === 'veille' ? EXPR_G.cligne : EXPR_G[name] || EXPR_G.veille;
  const masse = decaler(MASSE, k), frange = decaler(FRANGE, k);
  let s = P(masse, K.hair) + clip(`${id}h`, masse, `<rect x="8" y="24" width="34" height="6" fill="${K.hairS}"/><path d="M${r2(35 + k)},13 Q${r2(37.8 + k)},20 ${r2(36 + k)},28 L40,28 L40,13 Z" fill="${K.rim}" opacity=".45"/>`) + P(masse, 'none');
  if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, K.skin) + P(`M${r2(V.ear[0] + 0.1)},${r2(V.ear[1] - 1)} Q${r2(V.ear[0] + 0.8)},${V.ear[1]} ${r2(V.ear[0] + 0.1)},${r2(V.ear[1] + 1)}`, 'none', 0.5);
  // la tresse, avant le visage : elle sort de derrière la joue, sous les cheveux
  s += reflet(axe, tresse(K, M, k), mir);
  // le visage : l'ombre du large bord du chapeau sur le front, le contre-jour, les joues ; poursuivie, une égratignure de
  // ronce sur sa joue droite ; le sel de la naufragée
  s += P(V.face, K.skin) + clip(`${id}f`, V.face, `<path d="${frange}" fill="${K.skinS}" transform="translate(0 1.6)"/><rect x="8" y="10" width="34" height="6" fill="${K.skinS}" opacity=".55"/>`
    + `<g transform="translate(${k} 0)"><path d="M33.4,14.6 Q36.6,22.4 32.6,31.8 L37,31.8 L37,14.6 Z" fill="${K.rim}" opacity=".35"/></g>`
    + E(Xv(16.4), 26.8, 2.3 * V.rk[0], 1.3, K.cheek, 0).replace('/>', ' opacity=".5"/>') + E(Xv(31.6), 26.8, 2.3 * V.rk[1], 1.3, K.cheek, 0).replace('/>', ' opacity=".5"/>')
    + (M.ronces ? reflet(Xv(24), `<path d="M${Xv(15.4)},25.4 l1.6,0.9 M${Xv(15.8)},26.4 l1.2,0.6" stroke="#B5473A" stroke-width="0.4" stroke-linecap="round"/>`, mir) : '')
    + (M.salt ? E(Xv(30.4), 17, 0.9, 0.4, K.salt, 0).replace('/>', ` opacity="${r2(0.6 * M.salt)}"/>`) : '')) + P(V.face, 'none');
  s += P(frange, K.hair) + clip(`${id}fr`, frange, `<path d="M10,17.6 Q24,14.4 38,17.6 L38,21 L10,21 Z" fill="${K.hairS}" opacity=".45"/>`) + P(frange, 'none')
    + L([16 + k, 15.4], [20.6 + k, 14.6], K.hairH, 0.8) + L([27.4 + k, 14.6], [31.4 + k, 15.4], K.hairH, 0.6);
  // le nez, la bouche, les sourcils, les yeux (de lune : l'iris gris lavande)
  s += se ? P('M20.6,25.3 Q21.3,26 22.2,25.5', 'none', 0.65).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`)
    : P('M23.2,25.4 Q24,26.2 24.8,25.4', 'none', 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.4, 24.9, 0.32, 0.22, '#D9A47E', 0);
  s += mouth(ex.mouth, V.mouth, 27.9, `${id}m`, K);
  s += brow(Xv(19.4), 18.8, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.8, -1, ex.browR || ex.brow, false, V.rk[1], K);
  s += eye(`${id}e0`, Xv(19.4), 22.8, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 22.8, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
  // le chapeau
  s += `<g transform="translate(${k} 0)">${chapeau(K, M, id, false, mir)}</g>`;
  s += extras(ex.extras, ctx.n % 2, Xv);
  if (M.wet) s += gouttes(mir);
  return s;
}
// trempée : deux gouttes tombent du bord du chapeau
const gouttes = mir => reflet(24, [[8.4, 14.4, 0], [39.6, 14.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 6}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(''), mir);

// La tête de dos : les cheveux tirés vers la nuque, la tresse qui part de la nuque et passe sur son épaule gauche (à
// gauche de l'écran), le chapeau vu de dos
function teteDeDos(c, ctx, K, M, mir, id) {
  const back = 'M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37.6,29.4 35.4,32.2 Q30,33.8 24,33.8 Q18,33.8 12.6,32.2 Q10.4,29.4 11.2,21 Z';
  let s = E(12.6, 23, 1.6, 2.2, K.skin) + E(35.4, 23, 1.6, 2.2, K.skin);
  // la tresse, avant les cheveux : elle part de la nuque, sous eux, et passe sur son épaule gauche (de dos : à gauche de
  // l'écran), puis devant elle (on n'en voit que le début)
  s += reflet(24, natte(K, M, [[24.2, 30.6], [21.2, 35.8], [15.4, 36.6]], 3.6, 3, 5, false), mir);
  s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="8" width="34" height="27" fill="${K.hairS}"/><ellipse cx="22.4" cy="19" rx="13" ry="10" fill="${K.hair}"/><path d="M35.4,12 Q38.2,22 35.6,32 L39,32 L39,12 Z" fill="${K.rim}" opacity=".45"/>`) + P(back, 'none');
  s += P('M18,17 Q17.4,24 19.4,31', 'none', 0.55) + P('M29.6,17 Q30.4,24 28.6,31.2', 'none', 0.55) + P('M24,18 Q24.4,25 24,31.8', 'none', 0.55);
  s += `<g transform="translate(48 0) scale(-1 1)">${chapeau(K, M, `${id}d`, true, mir)}</g>`;
  if (M.wet) s += gouttes(!mir);
  const ex = EXPR_G[ALIAS[ctx.expr] || ctx.expr] || EXPR_G.veille;
  return s + extras(ex.extras, ctx.n % 2, v => v, true);
}

const maggy = {
  ...melisse,
  name: 'Maggy', uid: 'mg',
  teintes: [C.hair, C.straw, C.shawl, C.dress, C.lavender],
  sleeve: C.dress, cuff: null, sleeves: null, hand: C.hand,
  leg: C.stock, legS: C.stockS,
  shoe: C.wood, shoeS: C.woodS, shoeH: C.woodH,
  foot: pied,
  jambeOs: jambe, // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
  bras,

  // la boîte à graines serrée contre elle, au creux de son bras droit (à gauche de l'écran) : ce bras ne balance pas
  restLeft(c, ctx) {
    const K = pal(c), a = c.shoulders[0];
    if (ctx.view === 'ne') return arm(c, a, [15.8, 42], [13.2, 40.2]);
    const k = ctx.view === 'se' ? -1.6 : 0;
    return boite(K, 21.8 + k, 43.6) + arm(c, a, [19.8 + k, 43.4], [13, 41]);
  },

  // derrière le corps : la capuche rabattue de la pèlerine (de face, de trois quarts)
  backItems(c, ctx) {
    const K = pal(c);
    if (ctx.view === 'ne' || (c.tenue || 'chale') !== 'pluie') return '';
    return capucheRabattue(c.uid, ctx.view, reperes(c), K.cape, K.capeS);
  },

  body(c, ctx) {
    return corps(c, ctx, pal(c), marks(c));
  },

  // de dos, la nuque sous les cheveux
  neck(c, ctx) {
    if (ctx.view !== 'ne') return '';
    return P('M19.8,30.4 L28.2,30.4 L28.4,32.95 Q24,32.25 19.6,32.95 Z', C.skinS, 0);
  },

  // par-dessus le haut des bras : le châle (sauf naufragée : noué à la taille), ou la pèlerine
  overArms(c, ctx) {
    const K = pal(c), M = marks(c), t = c.tenue || 'chale';
    if (t === 'pluie') return pelerine(c, ctx, K);
    if (t === 'chale' && !M.naufrage) return chale(c, ctx, K, M);
    return '';
  },

  head(c, ctx) {
    return tete(c, ctx);
  },

  // le salut : la main gauche levée, lentement (la boîte reste dans l'autre bras) ; l'action : ouvrir la boîte
  // (maggy_gestes.js)
  pose(ctx) {
    const { pose, k } = ctx;
    if (pose === 'salut') {
      const [, b] = this.shoulders;
      const h = lerp([r2(b[0] + 4.2), r2(b[1] - 8.2)], [r2(b[0] + 5.2), r2(b[1] - 7.8)], k);
      return { expr: 'sourire', right: '', over: arm(this, b, h, [r2(b[0] + 5), r2(b[1] - 0.6)]) };
    }
    return require('./maggy_gestes').GESTES.boite.call(this, ctx);
  }
};

module.exports = { maggy, C, MARKS, EXPR: EXPR_G, pal, marks, reflet, boite, croissant, feuille };
