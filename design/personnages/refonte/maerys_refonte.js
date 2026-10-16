// Maerys (anciennement Sylve ; fichiers du jeu : sylve), la gardienne des bois, refonte : le même personnage, le même
// cadre 48 × 64, le même trait et le même kit (troupe.js), poussé plus loin, comme Lorena, Agathe, Nathan, Robby et Léo.
// 17 ans, une ancienne naufragée : son radeau s'est brisé il y a des années, elle vit seule dans la forêt depuis (HISTOIRE.md).
// Les cheveux sauvages de Sylve, pleins de brindilles, et la plume de geai, deux traits verts peints sur chaque joue, la cape
// de feuilles cousues, la tunique de lin au bas déchiré, la liane en ceinture et au poignet, pieds nus. Farouche : au
// repos, sur ses gardes, le regard de côté, la bouche serrée de travers.
// Ce que l'état laisse sur elle (maerys_tenues.js) : la terre, la mousse et les brindilles de la forêt, la pièce cousue
// au camp, l'eau ; naufragée, sa cape est perdue (il n'en reste que la liane et deux feuilles flétries), une bande de
// voile en ceinture, la tunique trouée.
// Trois vues (face, trois quarts avant, dos) ; c.miroir : la direction sera retournée par le jeu, ses marques passent de
// l'autre côté avant, pour retomber du bon côté de son corps (la plume de geai à sa gauche, le nœud de la liane à sa
// hanche droite, la pièce à sa hanche gauche, la terre sur sa joue droite).
// Trois tenues (c.tenue) : cape (la cape de feuilles et la tunique : son arrivée), robe (la robe de lin qu'Agathe lui
// coud au village, une fois apprivoisée), mousse (le manteau de mousse et d'écorce, pour la pluie et l'hiver).
const { P, E, L, clip, r2, OUT, W, lerp, arm, bareFoot, dechirure, filPendant } = require('../troupe');
const sylve = require('../sylve');
const { EXPR, ALIAS, X, eye, brow, mouth, extras } = require('./visage');
const { seam, suitOurlet } = require('./tissu');
const { jambe, poserBras, anneau, ligneBras, pointLigne, sousLigne, longueurLigne } = require('./membres');
const { capucheRabattue, reperes } = require('../avatar_accessoires');
const { hole, rip, cord } = require('../../atelier/naufrage');

const C = {
  skin: '#E8B88E', skinS: '#CC9A70', skinH: '#F6D3B0', lid: '#DFA982', under: '#B9856E', nose: '#B97A58', cheek: '#EE9C8C',
  eye: '#241B18', iris: '#6B8A3A', irisL: '#B5D27E', eyeRx: 1.8, eyeRy: 2.45, brow: '#2E1F18', browW: 0.95, mouth: '#7A3B30',
  hair: '#4A3328', hairS: '#33231B', hairH: '#7A5642', rim: '#9FE3DA',
  tunic: '#A88655', tunicS: '#86683E', tunicH: '#C2A274',
  robe: '#8FA86A', robeS: '#6F8A4E', robeH: '#B2C78E', thread: '#F2E6C8',
  moss: '#5F7F3E', mossS: '#45602A', mossH: '#86A75A', lichen: '#C9D9A0', bark: '#7A5636', barkS: '#5A3E26',
  leaf: '#5E9E4A', leafS: '#467A37', leafH: '#86C06A', vine: '#4E7A34', vineS: '#3A5E26',
  wither: '#8C9A4E', witherS: '#6E7A3A',
  twig: '#8A6440', feather: '#3E7FC1', featherS: '#1F3F66', featherH: '#9CC8EE',
  paint: '#3F8F4A', mud: '#6B5138', salt: '#FFF8E8', canvas: '#E6DCC3', canvasS: '#C9BB98', patch: '#B07E4C'
};

// Les marques sur elle, réglées par l'état (maerys_tenues.js) : la terre (dirt) et la mousse (moss) de la forêt (0 → 1),
// les brindilles dans les cheveux (twigs : 0, 1 ou 2), le sel (salt) ; la pièce cousue (patch) ; la cape (entiere, ou
// perdue : la naufragée) ; trempée (wet) ; son don (don : la naufragée l'a oublié, la graine ne germe plus)
const MARKS = { dirt: 0.5, moss: 0.6, twigs: 2, salt: 0, patch: false, cape: 'entiere', wet: false, don: true };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
// sa palette, et les noms des couleurs du vêtement selon la tenue (coat : la tunique, la robe ou le manteau de mousse)
const pal = c => {
  const K = { ...C, ...(c.pal || {}) };
  const t = c.tenue || 'cape';
  const [m, mS, mH] = t === 'robe' ? [K.robe, K.robeS, K.robeH] : t === 'mousse' ? [K.moss, K.mossS, K.mossH] : [K.tunic, K.tunicS, K.tunicH];
  return { ...K, coat: m, coatS: mS, coatH: mH };
};
// reflet : pour les directions retournées, ses marques passent de l'autre côté de l'axe (puis le jeu retourne l'image)
const reflet = (axe, s, oui) => (oui ? `<g transform="translate(${r2(2 * axe)} 0) scale(-1 1)">${s}</g>` : s);

// Ses expressions : celles de la troupe refondue ; au repos, aux aguets (le regard de côté, la bouche serrée de travers) ;
// le chant aux graines (les yeux fermés, la bouche ronde) ; cachée (les yeux grands ouverts, entre ses doigts)
const EXPR_M = {
  ...EXPR,
  veille: X({ brow: [0.35, -0.1, -0.25], lid: 0.16, tilt: 0.08, look: [-0.35, 0.05], under: 0.35, mouth: 'side' }),
  chante: X({ brow: [-0.7, -0.3, -0.6], mode: 'closed', under: 0.3, mouth: 'o' }),
  cachee: X({ brow: [-1.2, -0.6, -0.6], lid: 0, wide: true, look: [0.45, 0.15], under: 0.3, mouth: 'press' })
};

// ---- les petites choses de la forêt ----
// Une feuille en amande : la base en (x, y), longueur len, demi-largeur w, rot (degrés ; 0 : la pointe vers le bas)
const feuille = (x, y, len, w, rot, fill, nerv) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">`
  + P(`M0,0 Q${r2(w)},${r2(len * 0.45)} 0,${r2(len)} Q${r2(-w)},${r2(len * 0.45)} 0,0 Z`, fill, 0.6) + L([0, 0.5], [0, len - 0.7], nerv, 0.35) + '</g>';
// La liane : contour, couleur, un reflet en pointillé (les nœuds de la tige)
const liane = (K, d, w = 1) => cord(d, w, K.vine) + `<path d="${d}" fill="none" stroke="${K.leafH}" stroke-width="${r2(w * 0.35)}" stroke-linecap="round" stroke-dasharray=".8 1.4" opacity=".7"/>`;
// Une brindille fourchue : la tige de a à b, la fourche f
const brindille = (K, a, b, f) => L(a, b, OUT, 1.5) + L(f[0], f[1], OUT, 1.2) + L(a, b, K.twig, 0.75) + L(f[0], f[1], K.twig, 0.55);
// La plume de geai : bleue, barrée de sombre, la pointe blanche ; la base en (x, y), m : -1 pour la tourner vers la gauche
const plume = (K, x, y, m = 1, rot = 0) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot}) scale(${m} 1)">`
  + P('M0,0 Q1.6,-4.8 6.6,-7.8 Q5.6,-2.8 0.8,0.6 Z', K.feather, 0.75)
  + L([1.2, -1.6], [2.6, -1], K.featherS, 0.55) + L([2.4, -3.4], [3.8, -2.4], K.featherS, 0.55) + L([3.8, -5.2], [4.9, -4.2], K.featherS, 0.55)
  + L([0.9, -1.4], [4.2, -5.6], K.featherH, 0.35) + P('M5.4,-6.9 Q6.2,-7.5 6.6,-7.8 Q6.4,-6.6 5.9,-6 Z', '#FFFFFF', 0) + '</g>';

// ---- le corps ----
// Le bas déchiré, de droite à gauche ; en miroir, les lambeaux passent de l'autre côté (le même tracé lu à l'envers)
function basDechire(xr, xl, y, qx, qy, seed, mir) {
  if (!mir) return dechirure([xr, y], [qx, qy], [xl, y], seed);
  const m = dechirure([xl, y], [qx, qy], [xr, y], seed);
  const pts = m.d.split('L').map(s => s.trim()).filter(Boolean);
  pts.pop(); // le dernier point est le bout droit, déjà dessiné
  return { d: [...pts.reverse(), `${xl},${y}`].map(p => `L${p}`).join(' '), tips: m.tips };
}

// La cape de feuilles cousues : elle tombe des épaules à mi-cuisse, son bas fait de pointes de feuilles ; de face et de
// trois quarts, derrière elle (on la voit dépasser sur les côtés et sous la tunique) ; de dos, par-dessus, nouée au cou,
// elle couvre le dos entre les omoplates et s'évase vers le bas : ses bras restent visibles sur les côtés (choix de
// l'auteur, 16 oct.). sw : le bas qui balance en marchant
function capeForme(sw, dos) {
  const n = 7, x0 = dos ? 35.2 : 37.2, x1 = dos ? 12.8 : 10.8, y = 51.4;
  let d = dos ? `M16.6,33.2 Q24,31.4 31.4,33.2 Q33.6,41 ${r2(x0 + sw)},${y}` : `M14.8,33.4 Q24,31 33.2,33.4 Q36.4,42 ${r2(x0 + sw)},${y}`;
  const tips = [];
  for (let i = 0; i < n; i++) {
    const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n, m = (a + b) / 2, t = (i + 0.5) / n;
    const yy = y + 1.4 * Math.sin(Math.PI * t), ty = yy + 2.2 + (i % 2) * 0.5;
    d += ` Q${r2(a - 0.9 + sw)},${r2(yy + 1.6)} ${r2(m + sw)},${r2(ty)} Q${r2(b + 0.9 + sw)},${r2(yy + 1.6)} ${r2(b + sw)},${r2(y + 1.4 * Math.sin(Math.PI * (i + 1) / n))}`;
    tips.push([m + sw, ty]);
  }
  return { d: d + (dos ? ' Q14.4,41 16.6,33.2 Z' : ' Q11.6,42 14.8,33.4 Z'), tips };
}
function cape(c, ctx, K, dos) {
  const sw = r2((ctx.sway || 0) * 0.4), { d, tips } = capeForme(sw, dos), u = `${c.uid}cp${dos ? 'd' : ''}`;
  const shadeX = ctx.view === 'se' ? 26.6 : 28;
  // de dos, des rangées de feuilles qui se recouvrent ; de face, on n'en voit que les bords
  const rangs = dos ? [37.6, 42.2, 46.8].map((y, j) => {
    let p = `M10,${y}`;
    for (let x = 10; x < 38; x += 3.4) p += ` Q${r2(x + 1.7)},${r2(y + 2.1)} ${r2(x + 3.4)},${y}`;
    return `<path d="${p}" fill="none" stroke="${K.leafS}" stroke-width="0.6" transform="translate(${j % 2 ? 1.7 : 0} 0)"/>`;
  }).join('') + [39.4, 44, 48.6].map(y => [14.4, 21.2, 28, 34.8].map(x => L([x + 1.7, y - 0.6], [x + 1.7, y + 0.9], K.leafS, 0.35)).join('')).join('') : '';
  let s = P(d, K.leaf) + clip(u, d, `<rect x="${shadeX}" y="30" width="14" height="28" fill="${K.leafS}"/>` + rangs
    + `<rect x="12.6" y="36" width="1.2" height="14" rx="0.6" fill="${K.leafH}"/>`) + P(d, 'none');
  // les nervures des pointes
  s += tips.map(([x, y]) => L([x, y - 2.2], [x, y - 0.6], K.leafS, 0.35)).join('');
  return s;
}
// La naufragée : de sa cape, il ne reste qu'un bout de liane qui pend, et deux feuilles flétries
const resteDeCape = (K, k) => liane(K, `M${15.6 + k},33.8 Q${12.2 + k},38.4 ${12.6 + k},45.8`, 0.9)
  + feuille(12.4 + k, 40.6, 3.2, 1.3, 40, K.wither, K.witherS) + feuille(12.8 + k, 45.2, 3.4, 1.3, 14, K.wither, K.witherS);

// La tunique de lin (sous la cape) : sans manches, le bas en languettes déchirées qui suivent sa courbe, des fils qui
// pendent ; le tissu de lin (une trame fine), l'ombre côté brume
function tunique(c, ctx, K, M, k, mir) {
  const u = c.uid, sw = r2((ctx.sway || 0) * 0.3);
  const tb = basDechire(r2(33.8 + sw), r2(14.2 + sw), 49, r2(24 + sw), 51.6, 4, mir);
  const d = `M15.8,33 Q24,30.6 32.2,33 L${r2(33.8 + sw)},49 ${tb.d} Z`;
  const trame = [36, 38.4, 40.8, 43.2, 45.6, 48].map((y, i) => `<path d="M14,${y} L34,${y}" stroke="${K.coatS}" stroke-width="0.25" stroke-dasharray="${i % 2 ? '.6 1.4' : '1 1.1'}" opacity=".55"/>`).join('');
  let s = P(d, K.coat) + clip(`${u}t`, d, trame + `<rect x="${ctx.view === 'se' ? 26.4 : 27.8}" y="30" width="9" height="24" fill="${K.coatS}"/>`
    + `<rect x="16.6" y="36" width="1.2" height="11" rx="0.6" fill="${K.coatH}"/>`
    + `<path d="M19.8,37.6 Q19.2,43 18.6,49 M28.6,37.6 Q29.2,43 29.8,49" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".25"/>`
    + salete(K, M, 14, 34, 49, 51.6, k)) + P(d, 'none');
  s += tb.tips.map(([x, y], i) => filPendant(x, y, i ? -1 : 1)).join('');
  return s;
}
// La robe de lin qu'Agathe lui a cousue : un peu évasée, sous le genou ; l'encolure ronde lacée, une guirlande de feuilles
// brodée au bas (le point d'Agathe), la liane qu'elle garde en ceinture
function robe(c, ctx, K, M, k) {
  const u = c.uid, sw = r2((ctx.sway || 0) * 0.3);
  const d = `M15.6,33 Q24,30.6 32.4,33 Q35.4,43 ${r2(36 + sw)},52.8 Q${r2(24 + sw)},55.2 ${r2(12 + sw)},52.8 Q12.6,43 15.6,33 Z`;
  const ourlet = off => suitOurlet(12 + sw, 36 + sw, 52.8, 55.2, off);
  // la broderie : une tige qui court au-dessus de l'ourlet, des petites feuilles de part et d'autre
  const brode = `<path d="${ourlet(2.2)}" fill="none" stroke="${K.thread}" stroke-width="0.4" opacity=".9"/>`
    + [14.6, 18.2, 21.8, 25.4, 29, 32.6].map((x, i) => {
      const t = (x - 12) / 24, y = (1 - t) * (1 - t) * 52.8 + 2 * (1 - t) * t * 55.2 + t * t * 52.8 - 2.2, m = i % 2 ? 1 : -1;
      return `<path d="M${r2(x + sw)},${r2(y)} q${r2(m * 0.5)},-1 ${r2(m * 1.3)},-0.9 q-0.3,0.8 ${r2(-m * 1.3)},0.9 Z" fill="${K.thread}" opacity=".9"/>`;
    }).join('');
  let s = P(d, K.coat) + clip(`${u}r`, d, `<rect x="${ctx.view === 'se' ? 26.4 : 28.2}" y="30" width="12" height="28" fill="${K.coatS}"/>`
    + `<path d="${ourlet(0.9)} L38,58 L10,58 Z" fill="${K.coatS}"/>`
    + `<rect x="15.4" y="37" width="1.3" height="13" rx="0.65" fill="${K.coatH}"/>`
    + `<path d="M19.6,44 Q18.6,48.6 17.6,53.6 M28.8,44 Q29.8,48.6 30.8,53.6" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>`
    + brode + salete(K, M, 12, 36, 52.8, 55.2, k)) + P(d, 'none');
  if (ctx.view !== 'ne') {
    // l'encolure ronde, son lacet croisé
    const o = 24 + k;
    s += P(`M${r2(o - 3.4)},32.4 Q${o},35.2 ${r2(o + 3.4)},32.4`, 'none', 0.6)
      + `<path d="M${r2(o - 0.9)},34.6 L${r2(o + 0.9)},36.4 M${r2(o + 0.9)},34.6 L${r2(o - 0.9)},36.4" stroke="${K.thread}" stroke-width="0.45" stroke-linecap="round"/>`
      + E(o, 37, 0.45, 0.4, K.thread, 0.3);
  }
  return s;
}
// Le manteau de mousse et d'écorce : la mousse cousue sur une toile, des touffes au bas, des taches de lichen, deux
// chevilles d'écorce ; la capuche rabattue dans le dos
function manteau(c, ctx, K, M, k) {
  const u = c.uid, sw = r2((ctx.sway || 0) * 0.3);
  // le bas en touffes rondes ; assise, le manteau se plie sur ses genoux : le bas remonte d'autant (il reste dans le cadre)
  const h0 = r2(53.4 - (ctx.seatDy ? Math.max(0, 57.6 + ctx.seatDy - 63.2) : 0));
  let bas = '';
  const n = 9, x0 = 36.4, x1 = 11.6;
  for (let i = 0; i < n; i++) {
    const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n, t = (i + 0.5) / n, y = h0 + 1.6 * Math.sin(Math.PI * t);
    bas += ` Q${r2((a + b) / 2 + sw)},${r2(y + 1.9 + (i % 2) * 0.4)} ${r2(b + sw)},${r2(h0 + 1.6 * Math.sin(Math.PI * (i + 1) / n))}`;
  }
  const d = `M15.4,33 Q24,30.4 32.6,33 Q35.6,43 ${r2(36.4 + sw)},${h0}${bas} Q12.4,43 15.4,33 Z`;
  const taches = [[18.4, 38.6, 1.6], [29.6, 41.4, 1.3], [21.6, 47.6, 1.8], [31.4, 50.2, 1.2], [16.4, 51, 1.1], [26.4, 36.2, 1]]
    .map(([x, y, r]) => E(x + k, y, r, r * 0.7, K.mossS, 0).replace('/>', ' opacity=".55"/>')).join('');
  const lichen = [[19.6, 41.2], [27.4, 45.2], [17.4, 46.4], [30.6, 37.4], [24.6, 50.6]].map(([x, y]) => E(x + k, y, 0.55, 0.42, K.lichen, 0) + E(x + k + 0.7, y + 0.4, 0.3, 0.25, K.lichen, 0)).join('');
  let s = P(d, K.coat) + clip(`${u}m`, d, taches + `<rect x="${ctx.view === 'se' ? 26.6 : 28.4}" y="30" width="12" height="28" fill="${K.coatS}" opacity=".85"/>`
    + `<rect x="15.2" y="37" width="1.4" height="13" rx="0.7" fill="${K.coatH}"/>` + lichen
    + salete(K, M, 11.6, 36.4, h0, h0 + 1.6, k)) + P(d, 'none');
  // les brins de mousse qui dépassent du bord
  s += [[13.6, 44, -1], [35, 46.6, 1], [14.8, 38.4, -1]].map(([x, y, m]) => L([x, y], [x + m * 0.9, y + 0.5], OUT, 0.4)).join('');
  if (ctx.view === 'ne') return s + capucheRabattue(u, 'ne', reperes(c), K.coat, K.coatS);
  // l'ouverture, les deux chevilles d'écorce et leurs ganses de liane
  const o = 24 + k, pente = ctx.view === 'se' ? -0.6 : 0;
  s += P(`M${o},34.6 L${r2(o + pente)},54.6`, 'none', 0.8);
  for (const y of [38.6, 44.4]) {
    const x = o + pente * (y - 34) / 20;
    s += L([x - 1.4, y], [x + 0.6, y], K.vine, 0.6) + `<rect x="${r2(x + 0.2)}" y="${r2(y - 0.6)}" width="2.6" height="1.2" rx="0.55" fill="${K.bark}" stroke="${OUT}" stroke-width="0.5"/>` + L([x + 0.6, y - 0.25], [x + 2.2, y - 0.25], K.barkS, 0.3);
  }
  // le col de mousse épaisse
  s += P(`M${r2(17 + k)},33.2 Q${r2(20.6 + k)},33.6 ${o},36.4 Q${r2(27.4 + k)},33.6 ${r2(31 + k)},33.2 Q${o},31.6 ${r2(17 + k)},33.2 Z`, K.coatH, 0.7);
  return s;
}
// La terre et la mousse de la forêt (au bas du vêtement), le sel de la naufragée ; x0, x1, y0, yc : la courbe de l'ourlet
function salete(K, M, x0, x1, y0, yc, k) {
  let s = '';
  if (M.dirt) s += `<path d="${suitOurlet(x0, x1, y0, yc, 2.4, 0.3)} L40,60 L8,60 Z" fill="${K.mud}" opacity="${r2(0.35 * M.dirt)}"/>`
    + [[19 + k, 44.6, 1], [27.6 + k, 47.2, 0.8]].map(([x, y, r]) => E(x, y, r, r * 0.6, K.mud, 0).replace('/>', ` opacity="${r2(0.4 * M.dirt)}"/>`)).join('');
  if (M.moss) s += [[17.6 + k, 40.6], [29.8 + k, 44.4], [22.4 + k, 48.4]].map(([x, y]) => E(x, y, 0.8, 0.55, K.leafS, 0).replace('/>', ` opacity="${r2(0.8 * M.moss)}"/>`) + E(x + 0.5, y - 0.2, 0.35, 0.3, K.leafH, 0).replace('/>', ` opacity="${r2(0.8 * M.moss)}"/>`)).join('');
  if (M.salt) s += `<path d="${suitOurlet(x0, x1, y0, yc, 1.8, 0.22)}" fill="none" stroke="${K.salt}" stroke-width="0.65" opacity="${r2(0.7 * M.salt)}"/>`;
  return s;
}

function corps(c, ctx, K, M) {
  const view = ctx.view, t = c.tenue || 'cape', mir = !!c.miroir, dos = view === 'ne';
  const k = view === 'se' ? -1.6 : 0, axe = 24 + k;
  let s = t === 'robe' ? robe(c, ctx, K, M, k) : t === 'mousse' ? manteau(c, ctx, K, M, k) : tunique(c, ctx, K, M, k, mir);
  // la naufragée : la tunique trouée et déchirée
  if (M.cape === 'perdue') {
    const [hx, hy, rx, ry] = dos ? [20.4, 40.2, 28.4, 38.6] : view === 'se' ? [28, 38.4, 17, 37.6] : [29.4, 38.2, 18.4, 37.4];
    s += reflet(axe, hole(hx, hy, 0.9, K.coatS) + rip(rx, ry, 2), mir && !dos);
  }
  // la pièce cousue au camp (le point d'Agathe), sur sa hanche gauche (à droite de l'écran ; de dos, à gauche)
  if (M.patch) {
    const px = dos ? 15.8 : 28.4 + k;
    s += reflet(dos ? 24 : axe, P(`M${px},44.6 L${r2(px + 3.6)},44.4 L${r2(px + 3.8)},47.8 L${r2(px + 0.2)},48 Z`, K.patch, 0.55) + seam(`M${r2(px + 0.5)},45.1 L${r2(px + 3.1)},44.95 L${r2(px + 3.25)},47.3 L${r2(px + 0.65)},47.45 Z`, 0.35), mir);
  }
  // de dos : la cape par-dessus (rangées de feuilles), sauf la naufragée ; la robe et le manteau n'ont pas de cape
  if (dos && t === 'cape' && M.cape !== 'perdue') s += cape(c, ctx, K, true);
  // la ceinture : la liane (sous le manteau de mousse, rien), ou la bande de voile de la naufragée
  if (t !== 'mousse') s += ceinture(c, ctx, K, M, k, axe, mir, t === 'robe' ? 0.8 : 0);
  // de dos : le bas de la chevelure, sous les bras (maerys_refonte.js, chevelureDeDos)
  if (dos) s += basDeDos(K, `${c.uid}${ctx.view}`);
  return s + mouillee(M, t === 'robe' ? 54.4 : t === 'mousse' ? 55.2 : 50.6, ctx);
}
// La ceinture de liane, nouée à sa hanche droite (à gauche de l'écran ; de dos, à droite), une feuille glissée dans le nœud ;
// naufragée : une bande de toile de voile nouée sur le côté, les deux bouts qui pendent. dy : la robe la porte plus bas
function ceinture(c, ctx, K, M, k, axe, mir, dy) {
  const dos = ctx.view === 'ne';
  if (M.cape === 'perdue') {
    const band = `M15,${41.3 + dy} Q24,${43.1 + dy} 33,${41.3 + dy} L33.1,${43.5 + dy} Q24,${45.3 + dy} 14.9,${43.5 + dy} Z`;
    let o = P(band, K.canvas) + clip(`${c.uid}vb`, band, `<rect x="26" y="40" width="10" height="7" fill="${K.canvasS}"/>`) + P(band, 'none');
    if (dos) return o;
    const kx = 19.6 + k;
    o += reflet(axe, P(`M${r2(kx - 0.4)},${43.6 + dy} L${r2(kx - 1.8)},${47.8 + dy} L${r2(kx - 0.2)},${47.6 + dy} Z`, K.canvas, 0.7) + P(`M${r2(kx + 0.6)},${43.6 + dy} L${r2(kx + 1.4)},${47.2 + dy} L${r2(kx)},${47.4 + dy} Z`, K.canvasS, 0.7) + E(kx, 42.9 + dy, 1.5, 1.2, K.canvasS, 0.8), mir);
    return o;
  }
  let o = liane(K, `M15.2,${42.4 + dy} Q24,${44.2 + dy} 32.8,${42.4 + dy}`, 1);
  if (dos) return o + reflet(24, E(29.6, 43.4 + dy, 1.1, 0.9, K.vine, 0.7), mir);
  const kx = 19.4 + k;
  o += reflet(axe, E(kx, 43.4 + dy, 1.2, 1, K.vine, 0.7) + liane(K, `M${r2(kx - 0.3)},${44.2 + dy} Q${r2(kx - 1.2)},${46.2 + dy} ${r2(kx - 0.8)},${48 + dy}`, 0.7)
    + feuille(kx + 0.8, 43.8 + dy, 3, 1.15, -18, K.leaf, K.leafS) + feuille(kx - 0.4, 44 + dy, 2.6, 1, 22, K.leafH, K.leafS), mir);
  return o;
}
// trempée : des gouttes tombent du bas du vêtement, en continu ; debout seulement
const mouillee = (M, hy, ctx) => (M.wet && !ctx.seatDy ? [[15.2, 0], [24.4, 0.55], [32.8, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r2(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r2(hy + 1)};${r2(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join('') : '');

// ---- les bras ----
// Ses bras, dessinés par elle (troupe.arm passe la main à c.bras), sur la ligne souple de la refonte (membres.js) :
// - la cape : les bras nus, le bracelet de liane au poignet (une petite feuille y pousse) ;
// - la robe : la manche courte, bouffante à l'épaule, son ourlet brodé ; l'avant-bras nu, le bracelet ;
// - le manteau de mousse : la manche longue, l'ombre du côté droit, le pli du coude, le poignet en touffes de mousse.
// La lumière vient d'en haut à gauche de l'écran : le bras de gauche a son reflet.
// partie 'epaule' (de dos, les mains devant elle) : le haut du bras seul, de l'épaule au coude b, droit ; l'avant-bras
// part vers l'avant, caché par son corps (jamais un avant-bras en travers du dos)
function bras(c, a, b, elbow, main, partie = 'tout') {
  if (partie === 'epaule') elbow = null; else ({ b, elbow, main } = poserBras(c, a, b, elbow, main));
  const K = pal(c), M = marks(c), t = c.tenue || 'cape';
  const ligne = ligneBras(a, elbow, b), tot = longueurLigne(ligne);
  const pts = sousLigne(ligne, tot - 1.1, 0), len = tot - 1.1;
  const ici = k => { const { p, u: [ux, uy] } = pointLigne(pts, k); let nx = -uy, ny = ux; if (nx > 0) { nx = -nx; ny = -ny; } return { p, ux, uy, nx, ny }; };
  const off = (k, o, dk = 0) => { const { p, ux, uy, nx, ny } = ici(k); return [p[0] + nx * o + ux * dk, p[1] + ny * o + uy * dk]; };
  const pt = q => `${r2(q[0])},${r2(q[1])}`, chemin = l => 'M' + l.map(pt).join(' L');
  const trait = (d, color, w, extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const long = (k0, k1, o) => chemin(sousLigne(pts, k0, k1).map((q, i, l) => { const kk = k0 + (k1 - k0) * i / Math.max(1, l.length - 1), { nx, ny } = ici(kk); return [q[0] + nx * o, q[1] + ny * o]; }));
  const gauche = a[0] < 24, ombre = !gauche, w = c.armW;
  const avb = elbow ? Math.hypot(b[0] - elbow[0], b[1] - elbow[1]) : len;
  let s = '';
  if (partie !== 'devant') {
    if (t !== 'mousse') {
      // le bras nu : la peau, un reflet doux du côté de la lumière
      const dn = chemin(pts);
      s += trait(dn, OUT, w + W * 2) + trait(dn, c.skin, w);
      if (!ombre) s += trait(long(len - 1.2, Math.max(len * 0.35, 2.4), w * 0.24), K.skinH, 0.7, ' opacity=".7"');
    }
    if (t === 'robe' || t === 'mousse') {
      // la manche : courte et bouffante (la robe) ou jusqu'au poignet (le manteau)
      const fin = t === 'robe' ? Math.max(len - 4.4, 1) : 0;
      const tissu = ombre ? K.coatS : K.coat, dm = chemin(sousLigne(pts, len, fin));
      const large = t === 'robe' ? w + 0.9 : w + 0.3;
      s += trait(dm, OUT, large + W * 2) + trait(dm, tissu, large);
      if (t === 'robe') {
        // l'ourlet de la manche courte : une bande brodée, qui suit le bras
        const r = anneau(pts, fin + 0.9, fin, large / 2, 0.3);
        s += `<path d="${r.d}" fill="${K.coatS}" stroke="${OUT}" stroke-width="0.45" stroke-linejoin="round"/>` + trait(r.bord(fin + 0.45), K.thread, 0.35, ' stroke-dasharray=".5 .5"');
        if (!ombre) s += trait(long(len - 0.6, fin + 1.6, large * 0.22), K.coatH, 0.7, ' opacity=".8"');
      } else {
        // le reflet (ou le liseré de brume), le pli du coude, le poignet en touffes de mousse
        const haut = elbow ? len - avb : len * 0.6;
        s += ombre ? trait(long(len - haut * 0.18, len - haut * 0.7, -large * 0.32), K.rim, 0.55, ' opacity=".6"') : trait(long(len - haut * 0.18, len - haut * 0.7, large * 0.22), K.coatH, 0.8, ' opacity=".8"');
        if (elbow) s += trait(`M${pt(off(avb, large * 0.15))} Q${pt(off(avb, 0, 0.9))} ${pt(off(avb, -large * 0.3))}`, OUT, 0.42, ' opacity=".35"');
        const r = anneau(pts, 3, 1.3, large / 2 + 0.25, 0.3);
        s += `<path d="${r.d}" fill="${K.coatH}" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`;
        s += [-0.55, 0, 0.55].map(v => { const q = off(1.4, v * large); return E(q[0], q[1], 0.5, 0.45, K.coatH, 0.4); }).join('');
      }
    }
  }
  if (partie === 'derriere' || partie === 'epaule') return s;
  // le bracelet de liane (bras nus) : un anneau au poignet, une petite feuille qui y pousse
  if (t !== 'mousse' && M.cape !== 'perdue') {
    const r = anneau(pts, 3.7, 2.6, w / 2 + 0.15, 0.3), f = off(3.2, w * 0.55), { ux, uy } = ici(3.2);
    s += `<path d="${r.d}" fill="${K.vine}" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`
      + feuille(f[0], f[1], 2.2, 0.85, Math.atan2(uy, ux) * 180 / Math.PI - 90 + (gauche ? 40 : -40), K.leaf, K.leafS);
  }
  return s + (main != null ? main : E(b[0], b[1], 2.1, 2.1, c.hand || c.skin));
}

// Le pied nu : la terre de la forêt, un brin de mousse collé
function pied(c, x, y, dir, tilt) {
  const M = marks(c), K = pal(c);
  let s = bareFoot(c, x, y, dir, tilt);
  if (M.dirt) s += E(x - 0.4, y + 3.8, 2, 0.8, K.mud, 0).replace('/>', ` opacity="${r2(0.7 * M.dirt)}"/>`) + E(x + 1.4, y + 1.2, 0.5, 0.45, K.mud, 0).replace('/>', ` opacity="${r2(0.6 * M.dirt)}"/>`);
  if (M.moss) s += E(x + 1, y + 3.4, 0.6, 0.4, K.leafS, 0).replace('/>', ` opacity="${r2(0.8 * M.moss)}"/>`);
  return s;
}

// ---- la tête ----
// La géométrie du visage selon la vue (de trois quarts : les traits glissent vers la gauche, le lointain se resserre)
const VUES = {
  front: {
    X: x => x, rk: [1, 1], k: 0, mouth: 24, ear: null,
    face: 'M12.4,22.4 C12.4,15.6 17.6,12.2 24,12.2 C30.4,12.2 35.6,15.6 35.6,22.4 C35.6,28.4 30.6,32.4 24,32.4 C17.4,32.4 12.4,28.4 12.4,22.4 Z'
  },
  se: {
    X: x => r2(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), rk: [0.95, 0.82], k: -1.6, mouth: 21, ear: [34.6, 23.6],
    face: 'M11.3,22.4 C11.3,15.6 16.3,12.2 22.6,12.2 C28.9,12.2 33.9,15.6 33.9,22.4 C33.9,28.4 29,32.4 22.6,32.4 C16.2,32.4 11.3,28.4 11.3,22.4 Z'
  }
};
const decaler = (d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
// La coiffure de Sylve (choix de l'auteur, 16 oct.), la même de face, de trois quarts et de dos : la masse large aux
// pointes en zigzag, jusqu'aux épaules ; la frange en désordre, ses mèches pointues
const MASSE = 'M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,30.4 L36.6,29.2 L36.4,33.4 L34.4,31.2 L33.4,34.6 L31.6,31.4 L16.4,31.4 L14.6,34.6 L13.6,31.2 L11.6,33.4 L11.4,29.2 L9.4,30.4 Z';
const FRANGE = 'M11.8,19.6 Q11.4,8 24,7.8 Q36.6,8 36.2,19.6 L34,15.2 L33,18.6 L30.6,13.6 L29.4,17.4 L26.6,12.8 L24.6,16.8 L22.6,12.6 L20.4,17 L18.4,13.2 L16.6,17.6 L15,14.4 Z';
// les mèches de côté : elles sortent de sous la frange et pendent à côté du visage, derrière la joue (pas dessus), leur
// bout en deux pointes
const MECHE_G = 'M12.8,16 Q10.4,23.2 11.2,31 L12.4,28.6 L13.2,31.6 Q13.2,24.8 14.6,18.4 Z', MECHE_D = 'M35.2,16 Q37.6,23.2 36.8,31 L35.6,28.6 L34.8,31.6 Q34.8,24.8 33.4,18.4 Z';
const meches = (K, k) => [MECHE_G, MECHE_D].map(d => P(decaler(d, k), K.hair, 0.8)).join('')
  + L([12.4 + k, 19.4], [11.9 + k, 26.6], K.hairH, 0.5).replace('/>', ' opacity=".7"/>') + L([35.6 + k, 19.4], [36.1 + k, 26.6], K.hairS, 0.5);
// les brindilles prises dans les cheveux, sur les côtés (sur le dessus, on dirait des bois de cerf) ; n : 1 ou 2
const brindilles = (K, n, k) => (n >= 1 ? brindille(K, [36.2 + k, 21.2], [40.2 + k, 22.6], [[38.4 + k, 21.8], [39.6 + k, 20.2]]) : '')
  + (n >= 2 ? brindille(K, [12.6 + k, 14.2], [8.2 + k, 12.6], [[10.2 + k, 13.2], [9.2 + k, 15]]) : '');

function tete(c, ctx) {
  const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
  if (ctx.view === 'ne') return teteDeDos(c, ctx, K, M, mir, id);
  const V = VUES[ctx.view] || VUES.front, Xv = V.X, k = V.k, se = ctx.view === 'se', axe = 24 + k;
  const name = ALIAS[ctx.expr] || ctx.expr;
  const ex = ctx.blink && name === 'veille' ? EXPR_M.cligne : EXPR_M[name] || EXPR_M.veille;
  let s = '';
  // derrière : les brindilles, la masse des cheveux (l'ombre au bas, le contre-jour), les mèches de côté
  s += reflet(axe, brindilles(K, M.twigs, k), mir);
  const masse = decaler(MASSE, k);
  s += P(masse, K.hair) + clip(`${id}h`, masse, `<rect x="8" y="24" width="34" height="12" fill="${K.hairS}"/><path d="M${r2(35.4 + k)},12 Q${r2(38.6 + k)},20 ${r2(37.6 + k)},31 L41,31 L41,12 Z" fill="${K.rim}" opacity=".45"/>`) + P(masse, 'none');
  s += meches(K, k);
  if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, K.skin) + P(`M${r2(V.ear[0] + 0.1)},${r2(V.ear[1] - 1)} Q${r2(V.ear[0] + 0.8)},${V.ear[1]} ${r2(V.ear[0] + 0.1)},${r2(V.ear[1] + 1)}`, 'none', 0.5);
  // le visage : l'ombre de la frange, le contre-jour, les joues ; les deux traits verts peints sur chaque pommette ; la
  // terre sur sa joue droite, le sel de la naufragée
  const frange = decaler(FRANGE, k);
  const traits = [[16.6, 1], [31.4, -1]].map(([x]) => [26.2, 27.6].map(y => L([Xv(x - 1.7), y + 0.2], [Xv(x + 1.5), y - 0.2], K.paint, 0.7)).join('')).join('');
  s += P(V.face, K.skin) + clip(`${id}f`, V.face, `<path d="${frange}" fill="${K.skinS}" transform="translate(0 1.4)"/>`
    + `<g transform="translate(${k} 0)"><path d="M33.4,14.6 Q36.6,22.4 32.6,31.8 L37,31.8 L37,14.6 Z" fill="${K.rim}" opacity=".4"/></g>`
    + E(Xv(16.4), 27, 2.3 * V.rk[0], 1.3, K.cheek, 0).replace('/>', ' opacity=".5"/>') + E(Xv(31.6), 27, 2.3 * V.rk[1], 1.3, K.cheek, 0).replace('/>', ' opacity=".5"/>')
    + traits
    + (M.dirt ? reflet(Xv(24), `<ellipse cx="${Xv(18)}" cy="29.6" rx="1.5" ry="0.6" fill="${K.mud}" opacity="${r2(0.45 * M.dirt)}" transform="rotate(-12 ${Xv(18)} 29.6)"/>`, mir) : '')
    + (M.salt ? E(Xv(30.4), 16.4, 0.9, 0.4, K.salt, 0).replace('/>', ` opacity="${r2(0.6 * M.salt)}"/>`) : '')) + P(V.face, 'none');
  // la frange et ses reflets
  s += P(frange, K.hair) + clip(`${id}fr`, frange, `<path d="M10,17 Q24,13.4 38,17 L38,21 L10,21 Z" fill="${K.hairS}" opacity=".45"/>`) + P(frange, 'none')
    + L([15.6 + k, 11.2], [21.6 + k, 9.6], K.hairH, 1.1) + L([26.4 + k, 10], [29.4 + k, 10.8], K.hairH, 0.6);
  // la plume de geai, sur sa gauche (à droite de l'écran)
  s += reflet(axe, plume(K, 34 + k, 14.8, 1, -6), mir);
  // le petit nez droit (de trois quarts, son profil), la bouche, les sourcils, les yeux
  s += se ? P('M20.6,25.3 Q21.3,26 22.2,25.5', 'none', 0.65).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`)
    : P('M23.2,25.4 Q24,26.2 24.8,25.4', 'none', 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.4, 24.9, 0.32, 0.22, '#F6D3B4', 0);
  s += mouth(ex.mouth, V.mouth, 27.9, `${id}m`, K);
  s += brow(Xv(19.4), 18.6, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.6, -1, ex.browR || ex.brow, false, V.rk[1], K);
  s += eye(`${id}e0`, Xv(19.4), 22.8, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 22.8, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
  s += extras(ex.extras, ctx.n % 2, Xv);
  if (M.wet) s += gouttes(mir);
  return s;
}
// trempée : deux gouttes tombent du bout des mèches
const gouttes = mir => reflet(24, [[13.4, 31.4, 0], [35, 31.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 5}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(''), mir);

// La tête de dos : la coiffure de Sylve vue de dos, aussi large que de face, les pointes en zigzag jusqu'aux épaules ; la
// plume de geai sur sa gauche (à gauche de l'écran), les brindilles
const DOS = 'M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,31 L36.4,29.6 L36.6,33.6 L34,31.6 L33.2,34.8 L30.8,32.4 L29.4,35.2 L27.2,32.8 L24.6,35.6 L22.4,32.8 L20,35.2 L18.4,32.4 L15.8,34.8 L14.8,31.6 L12,33.6 L11.6,29.6 L9.4,31 Z';
// La chevelure de dos, en deux parts découpées dans le même dessin (le raccord ne se voit pas) : les pointes, sous les
// épaules, passent avec le corps, sous les bras (de dos, ses bras pendent devant ses pointes) ; le haut, avec la tête
const COUPE = 33.6;
function chevelureDeDos(K, id) {
  return P(DOS, K.hair) + clip(`${id}h`, DOS, `<rect x="8" y="6" width="34" height="36" fill="${K.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.6" ry="12.6" fill="${K.hair}"/><path d="M35.2,12 Q38.4,22 36.6,36 L40,36 L40,12 Z" fill="${K.rim}" opacity=".45"/>`) + P(DOS, 'none')
    + P('M17,12.4 Q15.6,22 17.2,32', 'none', 0.55) + P('M24.4,11.6 Q25.4,22 24,33.2', 'none', 0.55) + P('M30.8,12.6 Q32.2,22 30.8,32', 'none', 0.55);
}
const basDeDos = (K, id) => clip(`${id}cb`, `M0,${COUPE - 2.4} L48,${COUPE - 2.4} L48,64 L0,64 Z`, chevelureDeDos(K, `${id}b`));
function teteDeDos(c, ctx, K, M, mir, id) {
  // (de dos, sa gauche est à gauche de l'écran : les marques de face passent de l'autre côté)
  let s = reflet(24, brindilles(K, M.twigs, 0), !mir);
  s += clip(`${id}ch`, `M0,0 L48,0 L48,${COUPE} L0,${COUPE} Z`, chevelureDeDos(K, `${id}a`));
  s += L([16.8, 10], [22, 8.4], K.hairH, 1.1) + L([27, 16], [29.4, 15.4], K.twig, 0.8);
  s += reflet(24, plume(K, 34, 14.8, 1, -6), !mir);
  if (M.wet) s += gouttes(!mir);
  const ex = EXPR_M[ALIAS[ctx.expr] || ctx.expr] || EXPR_M.veille;
  return s + extras(ex.extras, ctx.n % 2, v => v, true);
}

const maerys = {
  ...sylve,
  name: 'Maerys', uid: 'my',
  teintes: [C.hair, C.tunic, C.leaf, C.feather],
  skin: C.skin, skinS: C.skinS, sleeve: C.skin, cuff: null, sleeves: null,
  leg: C.skin, legS: C.skinS,
  foot: pied,
  // ses jambes : la cuisse et le tibia (membres.js), nues
  jambeOs: jambe, // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
  bras,

  // derrière le corps : la cape de feuilles (de face et de trois quarts), ou ce qu'il en reste ; la capuche rabattue du
  // manteau de mousse
  backItems(c, ctx) {
    const K = pal(c), M = marks(c), t = c.tenue || 'cape', k = ctx.view === 'se' ? -1.6 : 0;
    if (ctx.view === 'ne') return '';
    if (t === 'mousse') return capucheRabattue(c.uid, ctx.view, reperes(c), K.coat, K.coatS);
    if (t !== 'cape') return '';
    if (M.cape === 'perdue') return reflet(24 + k, resteDeCape(K, k), !!c.miroir);
    return k ? `<g transform="translate(${k} 0)">${cape(c, ctx, K, false)}</g>` : cape(c, ctx, K, false);
  },

  // le col de feuilles qui noue la cape (de face et de trois quarts) ; de dos, la nuque sous les cheveux
  neck(c, ctx) {
    const K = pal(c), M = marks(c);
    if (ctx.view === 'ne' || (c.tenue || 'cape') !== 'cape' || M.cape === 'perdue') return '';
    const k = ctx.view === 'se' ? -1.6 : 0;
    return [18.2, 21, 24, 27, 29.8].map((x, i) => feuille(x + k, 32.2, 4, 1.55, [38, 16, 0, -16, -38][i], i % 2 ? K.leafS : K.leaf, i % 2 ? K.vineS : K.leafS)).join('')
      + liane(K, `M${17.6 + k},32.6 Q${24 + k},34.8 ${30.4 + k},32.6`, 0.6);
  },

  body(c, ctx) {
    return corps(c, ctx, pal(c), marks(c));
  },

  head(c, ctx) {
    return tete(c, ctx);
  },

  // le salut : farouche, elle lève la main ouverte à hauteur du visage, un petit signe ; l'action : le chant
  // aux graines (maerys_gestes.js)
  pose(ctx) {
    const { pose, k } = ctx;
    if (pose === 'salut') {
      const [a, b] = this.shoulders;
      const h = lerp([r2(b[0] + 3.6), r2(b[1] - 8.2)], [r2(b[0] + 5), r2(b[1] - 7.6)], k);
      // (la main levée passe devant ses cheveux, plus larges que ses épaules : par-dessus la tête)
      return { expr: 'sourire', left: arm(this, a, this.hands[0]), right: '', over: arm(this, b, h, [r2(b[0] + 5), r2(b[1] - 0.4)], require('./maerys_gestes').paume(this, h, -1)) };
    }
    return require('./maerys_gestes').GESTES.chanter.call(this, ctx);
  }
};

module.exports = { maerys, C, MARKS, EXPR: EXPR_M, pal, marks, reflet, feuille, liane, plume, brindille };
