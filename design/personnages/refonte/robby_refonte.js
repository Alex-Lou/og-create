// Robby (anciennement Galet, Saturnin dans HISTOIRE.md ; fichiers du jeu : galet), le vieux tailleur de runes, le mineur,
// refonte : le même personnage, le même cadre 48 × 64, le même trait et le même kit (troupe.js), poussé plus loin, comme
// Lorena, Agathe et Nathan. 75 ans, tout petit (la tête posée plus bas : HY), la barbe de lichen jusqu'à la ceinture, le
// bonnet de laine troué, la peau couleur granit, les sourcils blancs broussailleux, le maillet en main et le ciseau à la
// ceinture. Bourru, taiseux : « Hm. » Au repos, les paupières lourdes sous les sourcils, la bouche cachée sous la
// moustache. Ce qui raconte son histoire : des années seul dans la fissure de La Colline (ancien naufragé), la poussière
// de pierre partout sur lui, le lichen jusque dans la barbe, le bonnet reprisé.
// Ce que l'état laisse sur lui (robby_tenues.js) : la poussière de pierre, la mousse, le sel, la boue, les pièces, le
// bonnet troué ou reprisé, l'eau.
// Trois vues (face, trois quarts avant, dos) ; c.miroir : la direction sera retournée par le jeu, ses marques passent de
// l'autre côté avant, pour retomber du bon côté de son corps (le ciseau à sa hanche gauche, le maillet dans sa main
// droite, la reprise du bonnet à sa gauche).
// Trois tenues (c.tenue) : blouse (sa blouse de tailleur et sa ceinture), carrier (le tablier de cuir épais et les
// genouillères), pelisse (la veste de laine bouillie à col de mouton, pour la Lande).
const { P, E, L, clip, limb, r2, OUT, lerp, arm, shoe } = require('../troupe');
const galet = require('../galet');
const { EXPR, ALIAS, X, eye, mouth, extras, wind, rides } = require('./visage');
const { seam, suitOurlet } = require('./tissu');
const { fabriquerBras, poserBras } = require('./lorena_bras');
const { jambe } = require('./membres');
const { fondre } = require('../couleurs'); // le fondu néon des couleurs (le corps et les métaux gardent les leurs)

const HY = 4.4; // tout petit : la même tête, posée plus bas
const C = fondre({
  skin: '#B9B3A8', skinS: '#9C968B', lid: '#ABA59A', under: '#857F75', nose: '#A39C90', noseH: '#D2CDC4',
  eye: '#2A2622', iris: '#6F8A96', irisL: '#B5C9D0', eyeRx: 1.75, eyeRy: 2.25, brow: '#EEEAE0', mouth: '#5A3028',
  wool: '#B5562E', woolS: '#8E3F20', woolH: '#D07448', darn: '#C9B48A',
  beard: '#A3B48A', beardS: '#7F9068', beardH: '#C4D1AC', lichen: '#C9D27A', lichenB: '#9FB4AC',
  white: '#EEEAE0', whiteS: '#C9C3B6', hairB: '#D2CDC2',
  smock: '#6E6458', smockS: '#564E44', smockH: '#887E70', belt: '#4A3A2C', brass: '#C9A24A',
  apron: '#7A5A3E', apronS: '#5E442E', apronH: '#96745A',
  coat: '#5C6A72', coatS: '#46525A', coatH: '#7A8890', fleece: '#E6DCC8', fleeceS: '#C8BCA4', toggle: '#8A5A36',
  wood: '#A8743F', woodS: '#7E5530', steel: '#B8C0C8', steelS: '#8A949E', stone: '#A9A49A', stoneS: '#86817A', glow: '#8FE3E8',
  cheek: '#E3A396', rim: '#9FE3DA',
  dust: '#E4E0D6', moss: '#7E9A52', salt: '#FFF8E8', mud: '#6B5138', patch: '#8A7E66', cloth: '#E6D4AE', clothS: '#B8A27A'
});

// Les marques sur lui, réglées par l'état (robby_tenues.js) : poussière de pierre, mousse, sel, boue (0 → 1) ; le bonnet
// (troue : ses deux trous, reprise : l'un des trous reprisé) ; les pièces sur la blouse ; trempé (wet)
const MARKS = { dust: 1, moss: 0.6, salt: 0.3, dirt: 0.4, bonnet: 'troue', patch: true, wrist: false, wet: false };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
// sa palette, et les noms que les manches attendent (lorena_bras.js : coat → la blouse, ou la veste de la pelisse)
const pal = c => {
  const K = { ...C, ...(c.pal || {}) };
  const veste = c.tenue === 'pelisse';
  return { ...K, coat: veste ? K.coat : K.smock, coatS: veste ? K.coatS : K.smockS, coatH: veste ? K.coatH : K.smockH, shirt: K.smock, shirtS: K.smockS };
};
const reflet = (axe, s, oui) => (oui ? `<g transform="translate(${r2(2 * axe)} 0) scale(-1 1)">${s}</g>` : s);

// Ses expressions : celles de la troupe refondue ; au repos, bourru : les paupières lourdes, les sourcils bas et serrés,
// le regard un peu bas, la bouche sous la moustache (« Hm. »)
const EXPR_R = {
  ...EXPR,
  veille: X({ brow: [0.4, 0.15, -0.1], lid: 0.3, tilt: 0.12, look: [0, 0.2], under: 0.7, mouth: 'flat' }),
  concentree: { ...EXPR.concentree, mouth: 'press' }
};
// Son œil : celui de la refonte (visage.js), sans le petit trait de cil au coin extérieur (comme Nathan)
const oeil = (...a) => eye(...a).replace(/<path d="M[-\d.]+,[-\d.]+ l-?0\.7,-0\.[56]" [^>]*\/>/g, '');

// Le sourcil broussailleux : une touffe blanche qui suit le sourcil de la troupe (b : [bout intérieur, bout extérieur,
// cambrure]) et retombe en trois mèches vers l'extérieur, au-dessus de l'œil ; k : +1 si l'œil est à gauche du nez
function sourcil(x, y, k, b, sc, K) {
  const [bi, bo, arch] = b, hw = 2.7 * sc;
  const p = t => { const xx = x + k * hw * (1 - 2 * t), yy = y + bi + (bo - bi) * t + arch * (1 - (2 * t - 1) ** 2); return [xx, yy]; };
  const haut = [0, 0.25, 0.5, 0.75, 1].map((t, i) => { const [xx, yy] = p(t); return [xx, yy - (i % 2 ? 1.25 : 1.05) * sc]; });
  const [xo, yo] = p(1), [x6, y6] = p(0.62), [x8, y8] = p(0.84);
  const bas = [[xo - k * 0.2, yo + 1.4], [p(0.92)[0], p(0.92)[1] + 0.5], [x8, y8 + 1.3], [p(0.72)[0], p(0.72)[1] + 0.45], [x6, y6 + 1], [p(0.45)[0], p(0.45)[1] + 0.55], [p(0.15)[0], p(0.15)[1] + 0.6], [p(0)[0], p(0)[1] + 0.4]];
  const pts = [...haut, ...bas];
  const d = 'M' + pts.map(([a, c]) => `${r2(a)},${r2(c)}`).join(' L') + ' Z';
  const [xm, ym] = p(0.5);
  return P(d, K.brow, 0.55) + L([xm - k * 1.2, ym - 0.2], [xm + k * 1.4, ym + 0.3], K.whiteS, 0.4) + L([x8 + k * 0.3, y8 + 0.1], [x8 - k * 0.2, y8 + 0.9], K.whiteS, 0.35);
}

// ---- les objets ----
// Le maillet : le manche part de la main h, la tête au bout (rot en degrés, 0 = tête vers le bas) ; le cuir enroulé au
// manche, la tête usée au bord
function maillet(K, h, rot) {
  return `<g transform="rotate(${rot} ${r2(h[0])} ${r2(h[1])})">`
    + limb([h[0], h[1] - 1], [h[0], h[1] + 5.6], 1.2, K.wood) + [0.6, 1.4].map(dy => L([h[0] - 0.6, h[1] + dy], [h[0] + 0.6, h[1] + dy + 0.3], K.belt, 0.45)).join('')
    + `<rect x="${r2(h[0] - 2.4)}" y="${r2(h[1] + 5.2)}" width="4.8" height="2.8" rx="0.9" fill="${K.wood}" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="${r2(h[0] + 0.9)}" y="${r2(h[1] + 5.6)}" width="1.1" height="2" rx="0.4" fill="${K.woodS}"/>`
    + L([h[0] - 2, h[1] + 7.6], [h[0] + 1.6, h[1] + 7.6], '#C99A62', 0.4) + '</g>';
}
// Le ciseau de tailleur : manche en a, lame vers b ; la tête du manche écrasée par les coups
const ciseau = (K, a, b) => limb(a, [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], 1.3, K.wood) + limb([a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], b, 0.9, K.steel)
  + E(a[0], a[1], 0.95, 0.6, K.woodS, 0.5);

// ---- le corps ----
const BLOUSE = 'M15.6,37.4 Q24,35 32.4,37.4 L34,51 Q24,53.2 14,51 Z';
const bas = off => suitOurlet(14, 34, 51, 53.2, off);
// les pièces cousues sur la blouse (des années à la rapiécer) : sur le ventre à gauche, sur le flanc droit
const pieces = (K, k) => [[18.2 + k, 41.6, 3.4, 2.8, -4], [29.4 + k, 49.4, 2.8, 2.2, 6]].map(([x, y, w, h, a]) => `<g transform="rotate(${a} ${x} ${y})">${P(`M${r2(x - w / 2)},${r2(y - h / 2)} L${r2(x + w / 2)},${r2(y - h / 2)} L${r2(x + w / 2)},${r2(y + h / 2)} L${r2(x - w / 2)},${r2(y + h / 2)} Z`, K.patch, 0.5)}${seam(`M${r2(x - w / 2 + 0.4)},${r2(y - h / 2 + 0.4)} L${r2(x + w / 2 - 0.4)},${r2(y - h / 2 + 0.4)} L${r2(x + w / 2 - 0.4)},${r2(y + h / 2 - 0.4)} L${r2(x - w / 2 + 0.4)},${r2(y + h / 2 - 0.4)} Z`, 0.3)}</g>`).join('');
// la poussière de pierre : des traînées claires (où il s'essuie les mains, où les éclats tombent)
const poudre = (K, M, pts) => (M.dust ? pts.map(([x, y, rx, ry]) => E(x, y, rx, ry, K.dust, 0).replace('/>', ` opacity="${r2(0.7 * M.dust)}"/>`)).join('') : '');

function corps(c, ctx, K, M) {
  const view = ctx.view, u = c.uid, t = c.tenue || 'blouse', mir = !!c.miroir, dos = view === 'ne';
  const k = view === 'se' ? -1.6 : 0, axe = 24 + k;
  const shadeX = view === 'se' ? 26.2 : 27.8;
  const veste = t === 'pelisse';
  const tissu = veste ? K.coat : K.smock, tissuS = veste ? K.coatS : K.smockS, tissuH = veste ? K.coatH : K.smockH;
  // la blouse (ou la veste) : l'ombre côté brume, le reflet, deux plis, le sel et la boue au bas
  let s = P(BLOUSE, tissu) + clip(`${u}s`, BLOUSE, `<rect x="${shadeX}" y="34" width="9" height="20" fill="${tissuS}"/><rect x="16.2" y="39" width="1.1" height="10" rx="0.5" fill="${tissuH}" opacity=".8"/>`
    + `<rect x="33" y="40" width="1" height="11" fill="${K.rim}" opacity=".5"/><path d="M19.4,40 Q19,45 18.6,50.6 M29,40 Q29.4,45 29.8,50.8" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>`
    + (M.salt ? `<path d="${bas(1.6)}" fill="none" stroke="${K.salt}" stroke-width="0.6" opacity="${r2(0.6 * M.salt)}"/>` : '')
    + (M.dirt ? `<path d="${bas(1.8)} L36,56 L12,56 Z" fill="${K.mud}" opacity="${r2(0.3 * M.dirt)}"/>` : '')
    + (!dos && !veste && M.patch ? reflet(axe, pieces(K, k), mir) : '')
    // (de dos : une pièce sur l'omoplate droite, à droite de l'écran)
    + (dos && M.patch && !veste ? reflet(24, `<g transform="rotate(5 28.6 42)">${P('M26.8,40.6 L30.4,40.6 L30.4,43.4 L26.8,43.4 Z', K.patch, 0.5)}${seam('M27.2,41 L30,41 L30,43 L27.2,43 Z', 0.3)}</g>`, mir) : '')
    + poudre(K, M, [[20.6 + k, 44.4, 1.6, 0.6], [26.4 + k, 42.2, 1.1, 0.5], [30.6 + k, 46.6, 1, 0.45], [17.4 + k, 49.6, 1.2, 0.5]])) + P(BLOUSE, 'none');
  if (veste) s += pelisse(c, ctx, K, M);
  // la ceinture de cuir, sa boucle (de dos : l'ardillon dans le dos, un passant)
  s += P('M14.6,46.6 Q24,48.6 33.4,46.6 L33.6,48.6 Q24,50.6 14.4,48.6 Z', K.belt, 0.8) + seam('M15.2,47.4 Q24,49.4 32.8,47.4', 0.28);
  if (dos) {
    s += P('M24,38 L24,52', 'none', 0.6);
    if (t === 'carrier') s += `<path d="M18.4,37.4 L29.6,46.6 M29.6,37.4 L18.4,46.6" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round"/><path d="M18.4,37.4 L29.6,46.6 M29.6,37.4 L18.4,46.6" stroke="${K.apron}" stroke-width="0.9" stroke-linecap="round"/>`;
    // le ciseau, glissé à sa ceinture à gauche (de dos : à gauche de l'écran)
    return s + reflet(24, ciseau(K, [17.8, 44.6], [17, 51.4]), mir) + mouille(M, 52.6, ctx);
  }
  if (t === 'carrier') {
    // le tablier de cuir épais du carrier : bavette, bord surpiqué, les éclats de pierre qui l'ont griffé
    const ap = `M${18.8 + k},39.4 L${29.2 + k},39.4 L${30.2 + k},46.4 L${32.4 + k},55 Q${24 + k},56.6 ${15.6 + k},55 L${17.8 + k},46.4 Z`;
    s += L([19.2 + k, 39.6], [18.4 + k, 37.2], K.apronS, 1.1) + L([28.8 + k, 39.6], [29.6 + k, 37.2], K.apronS, 1.1);
    s += P(ap, K.apron) + clip(`${u}a`, ap, `<rect x="${27.6 + k}" y="38" width="8" height="20" fill="${K.apronS}"/>` + [[20.4, 47, 1.6], [25.6, 51.4, 1.2], [27.4, 44.2, 1], [21.8, 52.4, 1.4]].map(([x, y, l]) => L([x + k, y], [x + k + l, y + 0.4], K.apronH, 0.4)).join('')
      + poudre(K, M, [[22 + k, 49.6, 2, 0.8], [26.6 + k, 53.4, 1.4, 0.6]])) + P(ap, 'none') + seam(`M${19.4 + k},40.2 L${28.6 + k},40.2`, 0.3);
  }
  // le ciseau glissé dans la ceinture, à sa hanche gauche ; la boucle de laiton
  s += `<rect x="${r2(22.8 + k)}" y="46.6" width="2.4" height="2" rx="0.3" fill="${K.brass}" stroke="${OUT}" stroke-width="0.6"/>` + L([24 + k, 46.9], [24 + k, 48.3], K.belt, 0.4);
  s += reflet(axe, ciseau(K, [30.2 + k, 44.6], [31, 51.4]), mir);
  return s + mouille(M, 52.6, ctx);
}
// La pelisse : la veste de laine bouillie, ouverte sur la blouse, son col de mouton, ses brandebourgs de bois ; de dos, le
// col qui remonte sur la nuque
function pelisse(c, ctx, K, M) {
  const view = ctx.view, k = view === 'se' ? -1.6 : 0, u = c.uid;
  if (view === 'ne') return P('M16.6,36.2 Q24,33.4 31.4,36.2 Q32.4,38.6 30.6,39.6 Q24,38 17.4,39.6 Q15.6,38.6 16.6,36.2 Z', K.fleece, 0.8)
    + clip(`${u}pf`, 'M16.6,36.2 Q24,33.4 31.4,36.2 Q32.4,38.6 30.6,39.6 Q24,38 17.4,39.6 Q15.6,38.6 16.6,36.2 Z', [18.4, 21.4, 24.4, 27.4, 30].map(x => E(x, 37.8, 1, 0.7, K.fleeceS, 0)).join(''));
  let s = '';
  for (const [d, droite] of [[`M${15.6 + k},37.4 Q${19.6 + k},36.4 ${21.6 + k},37.6 L${22.4 + k},52.6 Q${17.6 + k},52.4 ${14 + k},51 Z`, false], [`M${32.4 + k},37.4 Q${28.4 + k},36.4 ${26.4 + k},37.6 L${25.6 + k},52.6 Q${30.4 + k},52.4 ${34 + k},51 Z`, true]]) {
    s += P(d, K.coat) + clip(`${u}p${droite ? 'r' : 'l'}`, d, (droite ? `<rect x="${27.6 + k}" y="34" width="9" height="20" fill="${K.coatS}"/>` : `<rect x="${16.2 + k}" y="39" width="1.1" height="10" rx="0.5" fill="${K.coatH}"/>`)
      + poudre(K, M, [[(droite ? 30 : 18.4) + k, 44, 1, 0.45]])) + P(d, 'none');
  }
  // le col de mouton, en bouclettes, sur les épaules et le long du devant
  const col = `M${16.4 + k},36.6 Q${20.4 + k},35.2 ${22.4 + k},38.8 L${21.6 + k},43.4 Q${19.6 + k},40.6 ${17 + k},39.6 Z`;
  for (const m of [false, true]) {
    const g = inner => (m ? `<g transform="translate(${r2(2 * (24 + k))} 0) scale(-1 1)">${inner}</g>` : inner);
    s += g(P(col, K.fleece, 0.8) + clip(`${u}mouton${m ? 'r' : 'l'}`, col, [[18, 37.6], [20.2, 37.6], [21.4, 40.2], [19.2, 39.6]].map(([x, y]) => E(x + k, y, 0.9, 0.65, K.fleeceS, 0)).join('')));
  }
  // les brandebourgs : deux bûchettes de bois et leurs ganses
  s += [42.6, 46.4].map(y => limb([22.2 + k, y], [25.8 + k, y], 0.55, K.belt) + limb([23.2 + k, y], [24.8 + k, y], 0.9, K.toggle)).join('');
  return s;
}
// trempé : des gouttes tombent du bas de la blouse et de la barbe, en continu ; debout seulement
const mouille = (M, hy, ctx) => (M.wet && !ctx.seatDy ? [[15.6, 0], [24.4, 0.55], [32.4, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r2(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r2(hy + 1)};${r2(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join('') : '');

// Les bras : les manches de la refonte (lorena_bras.js) ; la poussière de pierre sur les mains
const brasBase = fabriquerBras({ pal, marks });
function bras(c, a, b, elbow, main, partie = 'tout') {
  const M = marks(c);
  let s = brasBase(c, a, b, elbow, main, partie);
  // (la main réelle : les deux os du bras, membres.js)
  const m = poserBras(c, a, b, elbow, main).b;
  if (partie !== 'derriere' && main == null && M.dust) s += E(m[0] - 0.5, m[1] - 0.6, 0.9, 0.55, C.dust, 0).replace('/>', ` opacity="${r2(0.6 * M.dust)}"/>`);
  return s;
}

// La chaussure de travail, avec la boue ; au genou, la genouillère de cuir du carrier, ou la poussière
function pied(c, x, y, dir, tilt, genou) {
  const M = marks(c), K = pal(c);
  let s = '';
  const gx = x - c.legW / 2 + 0.4, gw = c.legW - 0.8;
  const g = genou || [x, (c.hip + y) / 2];
  if (c.tenue === 'carrier' && dir <= 0) s += `<rect x="${r2(g[0] - gw / 2 - 0.3)}" y="${r2(g[1] - 1.3)}" width="${r2(gw + 0.6)}" height="2.6" rx="0.8" fill="${K.apron}" stroke="${OUT}" stroke-width="0.6"/>` + L([g[0] - gw / 2, g[1]], [g[0] + gw / 2, g[1]], K.belt, 0.4);
  if (M.dust) s += E(g[0], g[1] + 0.1, gw / 2, 0.6, K.dust, 0).replace('/>', ` opacity="${r2(0.5 * M.dust)}"/>`);
  if (M.dirt) s += `<rect x="${r2(gx)}" y="${r2(y - 1.4)}" width="${r2(gw)}" height="2" fill="${K.mud}" opacity="${r2(0.5 * M.dirt)}"/>`;
  s += shoe(c, x, y, dir, tilt);
  if (M.dirt) s += E(x - 1.6, y + 3.6, 1.6, 0.7, K.mud, 0).replace('/>', ` opacity="${r2(0.8 * M.dirt)}"/>`);
  return s;
}

// ---- la tête ----
// La géométrie du visage selon la vue (de trois quarts : construit comme Nathan, autour de l'axe du visage)
const VUES = {
  front: { X: x => x, rk: [1, 1], k: 0, axe: 24, ears: [[11.8, 22.8], [36.2, 22.8]], fx: 24, rx: 11.6, kb: 0 },
  se: { X: x => r2(21 + (x - 24) * (x < 24 ? 0.86 : 0.98)), rk: [0.86, 1], k: -1.4, axe: 21, ears: [[35, 23.2]], fx: 22.6, rx: 11.2, kb: -2.2 }
};
const BARBE = 'M13.6,24.6 Q14,31 16.6,34.6 L16.4,40 L18.4,38.6 L19,45.4 L21.2,42.6 L22.4,48.6 L24,45 L25.6,48.6 L26.8,42.6 L29,45.4 L29.6,38.6 L31.6,40 L31.4,34.6 Q34,31 34.4,24.6 Q31,28.6 24,28.4 Q17,28.6 13.6,24.6 Z';
const decaler = (d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
// la petite queue du bonnet, qui bouge au vent
const QUEUE = ['M21.8,5.2 Q21.2,2.4 23.6,1.8 Q23.4,3.6 24.6,5 Z', 'M21.8,5.2 Q21.8,2.2 24.2,2 Q23.6,3.8 24.6,5 Z'];

// Le bonnet de laine : côtes du revers, mailles en V, la petite queue, deux trous (des mèches blanches en sortent) ; l'un
// reprisé (bonnet 'reprise') ; la mousse du lichen sur le haut (ermite)
function bonnet(c, ctx, K, M, k, mir, id) {
  const beanie = 'M11.6,16.4 Q10.8,6.2 22.4,4.8 Q32.8,3.8 36,9.8 Q37.4,12.8 36.4,16.4 Z';
  const trou = (x, y) => E(x, y, 1.1, 0.85, '#5E2A15', 0.6) + P(`M${r2(x - 0.6)},${r2(y + 0.3)} Q${x},${r2(y - 1.6)} ${r2(x + 0.7)},${r2(y + 0.2)}`, K.white, 0.5);
  const reprise = (x, y) => E(x, y, 1.4, 1.1, K.darn, 0.5) + [-0.6, 0, 0.6].map(d => L([x + d, y - 0.9], [x + d, y + 0.9], K.woolS, 0.3)).join('') + [-0.4, 0.4].map(d => L([x - 1.1, y + d], [x + 1.1, y + d], K.woolS, 0.3)).join('');
  const mailles = [7.6, 10.2, 12.6].map(y => [14, 17, 20, 23, 26, 29, 32, 35].map(x => `<path d="M${r2(x - 0.6)},${r2(y - 0.4)} L${x},${r2(y + 0.3)} L${r2(x + 0.6)},${r2(y - 0.4)}" fill="none" stroke="${K.woolS}" stroke-width="0.3" opacity=".7"/>`).join('')).join('');
  let s = `<g transform="translate(${k} 0)">` + wind(QUEUE[0], QUEUE[1], K.wool, 0.8, '2.3s')
    + P(beanie, K.wool) + clip(`${id}w`, beanie, `<rect x="8" y="2" width="34" height="16" fill="${K.woolS}"/><ellipse cx="21.6" cy="7.4" rx="12.6" ry="6.8" fill="${K.wool}"/>` + mailles
      + (M.moss ? E(26, 6.4, 3.4, 1.2, K.moss, 0).replace('/>', ` opacity="${r2(0.5 * M.moss)}"/>`) + E(29, 6.8, 1, 0.5, K.lichen, 0).replace('/>', ` opacity="${r2(0.7 * M.moss)}"/>`) : '')
      + poudre(K, M, [[16.4, 8.6, 1.6, 0.6]])) + P(beanie, 'none');
  // le trou de sa gauche (à droite de l'écran) est reprisé quand l'état le dit ; l'autre reste
  const tg = [29.6, 11.6], td = [18.4, 9.8];
  s += reflet(24, M.bonnet === 'reprise' ? reprise(...tg) : trou(...tg), mir) + reflet(24, trou(...td), mir);
  s += P('M11.2,14.4 Q24,11.6 36.8,14.4 L36.8,17.6 Q24,14.8 11.2,17.6 Z', K.wool, 0.9)
    + [14, 17, 20, 23, 26, 29, 32, 35].map(x => `<path d="M${x},${r2(13.6 + Math.abs(x - 24) * 0.08)} L${x},${r2(16.4 + Math.abs(x - 24) * 0.08)}" stroke="${K.woolS}" stroke-width="0.5"/>`).join('')
    + L([13, 15.4], [17.8, 14.4], K.woolH, 0.8) + '</g>';
  return s;
}

function tete(c, ctx) {
  const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
  if (ctx.view === 'ne') return `<g transform="translate(0 ${HY})">${teteDeDos(c, ctx, K, M, mir, id)}</g>`;
  const V = VUES[ctx.view] || VUES.front, Xv = V.X, k = V.k;
  const name = ALIAS[ctx.expr] || ctx.expr;
  const ex = ctx.blink && name === 'veille' ? EXPR_R.cligne : EXPR_R[name] || EXPR_R.veille;
  const face = `M${V.fx - V.rx},21.6 a${V.rx},10.4 0 1,0 ${2 * V.rx},0 a${V.rx},10.4 0 1,0 ${-2 * V.rx},0 Z`;
  let s = '';
  // les grandes oreilles du vieil homme, leur touffe de poils blancs ; les mèches blanches sous le bonnet
  for (const [x, y] of V.ears) {
    const o = x > 24 ? 1 : -1;
    s += E(x, y, 1.8, 2.5, K.skin) + P(`M${r2(x - o * 0.3)},${r2(y - 1.3)} Q${r2(x + o * 0.6)},${y} ${r2(x - o * 0.2)},${r2(y + 1.3)}`, 'none', 0.45) + L([x - o * 0.4, y - 0.2], [x - o * 0.1, y + 0.6], K.white, 0.5);
  }
  s += P(decaler('M12,16.8 Q9.6,18.6 10.6,21.6 Q11.6,19.6 13,19.6 Z', k), K.white, 0.8) + P(decaler('M36,16.8 Q38.4,18.6 37.4,21.6 Q36.4,19.6 35,19.6 Z', k), K.white, 0.8)
    + L([k + 10.8, 18.4], [k + 11.6, 20.4], K.whiteS, 0.35) + L([k + 37.2, 18.4], [k + 36.4, 20.4], K.whiteS, 0.35);
  // le visage couleur granit : l'ombre sous le bonnet, le contre-jour, les joues, les rides
  s += P(face, K.skin) + clip(`${id}f`, face, `<rect x="8" y="15" width="34" height="2.6" fill="${K.skinS}"/>`
    + `<g transform="translate(${k} 0)"><path d="M33.4,14 Q36.6,21.6 32.6,31.2 L37,31.2 L37,14 Z" fill="${K.rim}" opacity=".45"/><path d="M31.8,13 Q35,21 31.2,30.8 L33.6,30.8 Q37,21 33.6,13 Z" fill="${K.skinS}" opacity=".45"/></g>`
    + E(Xv(16.6), 25.2, 1.8 * V.rk[0], 0.95, K.cheek, 0).replace('/>', ' opacity=".55"/>') + E(Xv(31.4), 25.2, 1.8 * V.rk[1], 0.95, K.cheek, 0).replace('/>', ' opacity=".55"/>')
    + L([Xv(15.6), 19.4], [Xv(17.6), 19.8], K.skinS, 0.5) + L([Xv(30.4), 19.8], [Xv(32.4), 19.4], K.skinS, 0.5)
    + poudre(K, M, [[Xv(15.4), 23.4, 1, 0.45]])) + P(face, 'none');
  s += bonnet(c, ctx, K, M, k, mir, id);
  // les rides de l'âge (patte-d'oie, poches), le regard, les sourcils broussailleux par-dessus
  s += rides(Xv(19.4), 22.3, 1, K, V.rk[0]) + rides(Xv(28.6), 22.3, -1, K, V.rk[1]);
  s += oeil(`${id}e0`, Xv(19.4), 22.3, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + oeil(`${id}e1`, Xv(28.6), 22.3, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
  s += sourcil(Xv(19.4), 18.4, 1, ex.browL || ex.brow, V.rk[0], K) + sourcil(Xv(28.6), 18.4, -1, ex.browR || ex.brow, V.rk[1], K);
  // la barbe de lichen, la bouche (cachée sous la moustache quand elle est close : « Hm » ; ouverte, elle s'ouvre dans la
  // barbe), la moustache, le gros nez rond
  const ax = V.axe, kb = V.kb;
  const ouverte = ['laugh', 'wow', 'shout', 'fear', 'sob', 'o', 'open', 'teeth', 'chatter'].includes(ex.mouth);
  const barbe = decaler(BARBE, kb);
  s += P(barbe, K.beard) + clip(`${id}b`, barbe, `<rect x="${r2(27.6 + kb)}" y="24" width="10" height="26" fill="${K.beardS}"/>`
    + [18.6, 21.6, 24.6, 27.4, 30].map(x => `<path d="M${r2(x + kb)},30.6 Q${r2(x + kb - 0.6)},36 ${r2(x + kb + 0.4)},41.6" fill="none" stroke="${K.beardS}" stroke-width="0.5"/>`).join('')
    + `<rect x="${r2(16.6 + kb)}" y="29" width="1.1" height="7" rx="0.5" fill="${K.beardH}"/>`
    + [[19.6, 33.4, 1, K.lichen], [26.4, 37.2, 0.8, K.lichenB], [22.2, 40.4, 0.7, K.lichen], [28.8, 31.8, 0.6, K.lichenB]].map(([x, y, r, col]) => E(x + kb, y, r, r * 0.75, col, 0).replace('/>', ` opacity="${r2(0.5 + 0.4 * M.moss)}"/>`)).join('')
    + poudre(K, M, [[21 + kb, 36, 1.2, 0.5], [27 + kb, 43, 0.9, 0.4]])) + P(barbe, 'none');
  // la moustache : deux pans qui tombent sur la bouche, ses mèches ; le nez rond, son reflet, la narine
  const mx = ax;
  const moust = `M${r2(mx - 4.4)},27.6 Q${r2(mx - 2.6)},25 ${mx},26.2 Q${r2(mx + 2.6)},25 ${r2(mx + 4.4)},27.6 Q${r2(mx + 3.4)},29.2 ${r2(mx + 1.6)},28.2 Q${r2(mx + 0.8)},29 ${mx},28 Q${r2(mx - 0.8)},29 ${r2(mx - 1.6)},28.2 Q${r2(mx - 3.4)},29.2 ${r2(mx - 4.4)},27.6 Z`;
  if (ouverte) s += mouth(ex.mouth, ax, 28.6, `${id}m`, K);
  s += `<g transform="translate(0 ${ouverte ? -0.9 : 0})">` + P(moust, K.beardH, 0.8) + L([mx - 3, 27.2], [mx - 1.4, 27.6], K.beardS, 0.4) + L([mx + 3, 27.2], [mx + 1.4, 27.6], K.beardS, 0.4) + '</g>';
  const nx = ctx.view === 'se' ? ax - 0.6 : 24;
  s += E(nx, 24.6, 1.6, 1.35, K.nose, 0.8) + E(nx - 0.5, 24.1, 0.5, 0.38, K.noseH, 0) + P(`M${r2(nx + 0.4)},25.4 q0.5,0.2 0.9,-0.1`, 'none', 0.35);
  s += extras(ex.extras, ctx.n % 2, Xv);
  if (M.wet) s += gouttes(mir);
  return `<g transform="translate(0 ${HY})">${s}</g>`;
}
// trempé : deux gouttes tombent du bout de la barbe
const gouttes = mir => reflet(24, [[20.2, 44.4, 0], [26.6, 46.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 5}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(''), mir);

// La tête de dos : le bonnet, la couronne de cheveux blancs en mèches sur la nuque, les grandes oreilles, la nuque ridée,
// les touffes de barbe qui dépassent des deux côtés du cou (au lieu du crâne lisse de l'ancien dessin, qui faisait un
// visage vide)
function teteDeDos(c, ctx, K, M, mir, id) {
  const back = 'M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37,28.4 34.2,30.4 Q24,32.6 13.8,30.4 Q11,28.4 11.2,21 Z';
  let s = '';
  const touffe = m => {
    const d = 'M13.4,26 Q11.2,29 11.8,31.8 Q11.2,34 13,35 Q13.4,36.8 15.4,36.6 Q17,37.6 18.2,36.2 Q19.6,35.4 18.8,33.4 L17.4,28.4 Z';
    const g = inner => `<g transform="translate(${m < 0 ? 48 : 0} 0) scale(${m} 1)">${inner}</g>`;
    return g(P(d, K.beard) + clip(`${id}t${m}`, d, `<rect x="15.4" y="24" width="6" height="14" fill="${K.beardS}"/>` + E(14.6, 32.4, 0.7, 0.5, K.lichen, 0).replace('/>', ' opacity=".6"/>'))
      + P(d, 'none') + P('M13.6,30.6 Q13.4,33 14.6,34.6 M16,30.4 Q16.2,33 16.8,35', 'none', 0.5) + L([12.8, 31], [13.2, 33.2], K.beardH, 0.7));
  };
  s += touffe(1) + touffe(-1);
  // sous le bonnet, les cheveux blancs couvrent l'arrière de la tête jusqu'à la nuque : une masse en mèches arrondies,
  // ombrée côté brume, ses mèches dessinées ; la nuque ridée se voit au-dessous, entre les touffes de barbe
  const cheveux = 'M11.2,17.6 Q24,20.6 36.8,17.6 Q37.4,24 35.6,27.8 Q34.6,29.6 33,28.8 Q32,30.6 30.2,29.6 Q28.8,31 27,30 Q25.6,31.2 24,30.2 Q22.4,31.2 21,30 Q19.2,31 17.8,29.6 Q16,30.6 15,28.8 Q13.4,29.6 12.4,27.8 Q10.6,24 11.2,17.6 Z';
  s += P(back, K.skinS) + clip(`${id}h`, back, `<path d="M15,30.4 Q24,32.6 33,30.4" fill="none" stroke="${K.skin}" stroke-width="0.5"/><path d="M18,31.6 Q24,33 30,31.6" fill="none" stroke="${K.skin}" stroke-width="0.4"/>`) + P(back, 'none');
  s += P(cheveux, K.hairB) + clip(`${id}c`, cheveux, `<rect x="27.4" y="16" width="12" height="16" fill="${K.whiteS}"/>`
    + [14.6, 18, 21.4, 24.6, 27.8, 31, 34].map((x, j) => `<path d="M${x},${r2(19.4 + (j % 2) * 0.6)} Q${r2(x + (x < 24 ? -0.5 : 0.5))},24.4 ${r2(x + (x < 24 ? 0.2 : -0.2))},28.6" fill="none" stroke="${K.whiteS}" stroke-width="0.45"/>`).join('')
    + L([13.4, 20.4], [13.8, 25.6], '#FFFFFF', 0.7) + [16.4, 19.8, 23, 26.2].map(x => L([x, 19.8], [x + 0.3, 24.6], K.white, 0.6)).join('')) + P(cheveux, 'none');
  // les grandes oreilles passent devant les cheveux, leur touffe blanche
  s += [[11.6, 1], [36.4, -1]].map(([x, o]) => E(x, 23, 1.7, 2.4, K.skin) + P(`M${r2(x + o * 0.4)},21.8 Q${r2(x - o * 0.5)},23 ${r2(x + o * 0.3)},24.2`, 'none', 0.45) + L([x + o * 0.3, 22.4], [x + o * 0.1, 23.6], K.white, 0.5)).join('');
  // le bonnet de dos : la queue, le revers côtelé, un trou (et la reprise, à sa gauche : à gauche de l'écran)
  s += wind(decaler(QUEUE[0], 0).replace('M21.8,5.2', 'M24.6,5.2'), QUEUE[1].replace('M21.8,5.2', 'M24.6,5.2'), K.wool, 0.8, '2.3s')
    + P('M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z', K.wool) + clip(`${id}bw`, 'M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z', `<rect x="27" y="2" width="12" height="18" fill="${K.woolS}"/>`
      + [8.4, 11.2].map(y => [14, 17, 20, 23, 26, 29, 32, 35].map(x => `<path d="M${r2(x - 0.6)},${r2(y - 0.4)} L${x},${r2(y + 0.3)} L${r2(x + 0.6)},${r2(y - 0.4)}" fill="none" stroke="${K.woolS}" stroke-width="0.3" opacity=".7"/>`).join('')).join('')
      + (M.moss ? E(22, 6.6, 3.2, 1.1, K.moss, 0).replace('/>', ` opacity="${r2(0.5 * M.moss)}"/>`) : '')) + P('M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z', 'none')
    + P('M11.2,14.6 Q24,17.4 36.8,14.6 L36.8,17.8 Q24,20.6 11.2,17.8 Z', K.wool, 0.9)
    + [14, 17, 20, 23, 26, 29, 32, 35].map(x => `<path d="M${x},${r2(15.2 + (1 - Math.abs(x - 24) / 13) * 2.4)} L${x},${r2(17.6 + (1 - Math.abs(x - 24) / 13) * 2.4)}" stroke="${K.woolS}" stroke-width="0.5"/>`).join('');
  const tg = [17.6, 9.8];
  s += reflet(24, M.bonnet === 'reprise' ? E(tg[0], tg[1], 1.4, 1.1, K.darn, 0.5) + [-0.6, 0, 0.6].map(d => L([tg[0] + d, tg[1] - 0.9], [tg[0] + d, tg[1] + 0.9], K.woolS, 0.3)).join('')
    : E(tg[0], tg[1], 1.1, 0.85, '#5E2A15', 0.6) + P(`M${tg[0] - 0.6},${tg[1] + 0.3} Q${tg[0]},${tg[1] - 1.6} ${tg[0] + 0.7},${tg[1] + 0.2}`, K.white, 0.5), mir);
  s += E(29.4, 10.6, 1.1, 0.85, '#5E2A15', 0.6) + P('M28.8,10.9 Q29.4,9 30.1,10.8', K.white, 0.5);
  if (M.wet) s += gouttes(!mir);
  const ex = EXPR_R[ALIAS[ctx.expr] || ctx.expr] || EXPR_R.veille;
  return s + extras(ex.extras, ctx.n % 2, v => v, true);
}

const robby = {
  ...galet,
  name: 'Robby', uid: 'rb',
  teintes: [C.wool, C.beard, C.smock, C.white],
  sleeve: C.smock, cuff: null,
  foot: pied,
  // ses jambes : la cuisse et le tibia, le genou qui plie (membres.js)
  jambeOs: jambe, // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
  bras,
  // le maillet ne quitte pas sa main droite
  hold(c, h) { return maillet(pal(c), h, -8); },

  body(c, ctx) {
    return corps(c, ctx, pal(c), marks(c));
  },

  head(c, ctx) {
    return tete(c, ctx);
  },

  // le salut : il lève le maillet en guise de bonjour (« Hm. ») ; l'action : la rune (robby_gestes.js, tailler)
  pose(ctx) {
    const { pose, k } = ctx;
    if (pose === 'salut') {
      const h = lerp([36.4, 30.8], [37.6, 32.4], k);
      return { expr: 'veille', right: maillet(pal(this), h, 180) + arm(this, [31.6, 38.8], h) };
    }
    return require('./robby_gestes').GESTES.tailler.call(this, ctx);
  }
};

module.exports = { robby, C, MARKS, EXPR: EXPR_R, pal, marks, reflet, maillet, ciseau, HY };
