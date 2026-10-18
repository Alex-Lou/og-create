// Nathan (anciennement Rivet, Jovin dans HISTOIRE.md ; fichiers du jeu : rivet), l'horloger-artificier, refonte : le même
// personnage, le même cadre 48 × 64, le même trait et le même kit (troupe.js), poussé plus loin, comme Lorena et Agathe.
// Les lunettes à quatre loupes relevées sur le crâne, le tablier de cuir aux mille poches, la chemise sarcelle, les cheveux
// châtains en bataille et l'épi gris rebelle, un crayon derrière chaque oreille. Le regard ailleurs : il pense déjà à
// autre chose (perfectionniste et distrait) ; une barbe de quelques jours. Ce qui raconte son histoire : la vieille
// brûlure sur l'avant-bras gauche et la brûlure ancienne du tablier (l'incendie de son atelier, son secret), les
// brassards d'horloger qui tiennent les manches retroussées, la clé de remontoir de Tic-Tac pendue au tablier.
// Ce que l'état laisse sur lui (nathan_tenues.js) : le cambouis, la suie, le sel, la sciure, la boue, la loupe fêlée,
// la poche décousue ou recousue, la pièce au genou, l'eau.
// Trois vues (face, trois quarts avant, dos) ; c.miroir : la direction sera retournée par le jeu, ses marques passent de
// l'autre côté avant, pour retomber du bon côté de son corps (l'épi gris et la brûlure à sa gauche, la clé à sa hanche
// gauche, le cambouis sur sa joue gauche).
// Trois tenues (c.tenue) : atelier (la chemise et le tablier de cuir), gilet (le gilet d'horloger, la montre de gousset
// et sa chaîne), forge (le grand tablier de forge et les gants).
const { P, E, L, clip, limb, r2, OUT, lerp, arm, shoe } = require('../troupe');
const rivet = require('../rivet');
const { EXPR, ALIAS, X, eye, brow, mouth, extras, wind } = require('./visage');
const { seam, suitOurlet } = require('./tissu');
const { fabriquerBras, poserBras } = require('./lorena_bras');
const { jambe, anneau, ligneBras, pointLigne, longueurLigne } = require('./membres');
const { fondre } = require('../couleurs'); // le fondu néon des couleurs (le corps et les métaux gardent les leurs)

const C = fondre({
  skin: '#DDA57C', skinS: '#C08A62', lid: '#D2966E', under: '#A87A68', nose: '#B37452', stubble: '#6E5240',
  hair: '#6B4A32', hairS: '#4F3524', hairH: '#8C6646', grey: '#CFCAC2', greyS: '#A8A29A', greyH: '#F2EFEA',
  brow: '#3B271B', browW: 1.05, rim: '#9FE3DA',
  eye: '#241C18', iris: '#8C6A3C', irisL: '#D8B47C', eyeRx: 1.85, eyeRy: 2.5,
  shirt: '#3F8A86', shirtS: '#2E6B68', shirtH: '#62A9A4', collar: '#EFE6D6', collarS: '#D3C7B2',
  leather: '#8A5A36', leatherS: '#6B4328', leatherH: '#A87650', forge: '#5E3E28', forgeS: '#452C1C', forgeH: '#7E5638',
  vest: '#5A4636', vestS: '#40322A', vestH: '#7A6352', lining: '#9C3E34',
  brass: '#C9A24A', brassS: '#8E6E2C', brassH: '#F0D58A', glass: '#CFEAF0', glassT: '#BFE3C6', strap: '#4A3426',
  steel: '#B8C0C8', steelS: '#8A949E', red: '#C8463A', wood: '#E2C28E', pencil: '#F2C94C', pencilS: '#C99A2E', eraser: '#EE8F8F',
  garter: '#3A3330', glove: '#9A6A42', gloveS: '#74502F',
  cheek: '#EE9C8C', mouth: '#7A3B30', scar: '#E49A86', scarH: '#F6C7B6',
  grease: '#3E3632', soot: '#4A4440', salt: '#FFF8E8', dust: '#E8D6AE', mud: '#6B5138', patch: '#C9B48A', cloth: '#E6D4AE', clothS: '#B8A27A'
});

// Les marques sur lui, réglées par l'état (nathan_tenues.js) : cambouis, suie, sel, sciure, boue (0 → 1) ; la loupe
// fêlée (crack) ; la poche à outils (torn : décousue, mended : recousue, clean : nette) ; la pièce au genou (patch) ;
// trempé (wet)
const MARKS = { grease: 1, soot: 0.5, salt: 1, dust: 0, dirt: 0.4, crack: true, pocket: 'torn', patch: false, wrist: false, wet: false };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
// sa palette, et les noms que les manches attendent (lorena_bras.js : coat → la chemise)
const pal = c => {
  const K = { ...C, ...(c.pal || {}) };
  return { ...K, coat: K.shirt, coatS: K.shirtS, coatH: K.shirtH };
};
const reflet = (axe, s, oui) => (oui ? `<g transform="translate(${r2(2 * axe)} 0) scale(-1 1)">${s}</g>` : s);

// Ses expressions : celles de la troupe refondue ; au repos, ailleurs : le regard posé un peu de côté, un sourcil à peine
// levé, la bouche close (il pense déjà à autre chose). (Choix de l'auteur, 15 oct. : le regard poussé en coin vers le
// haut et l'iris vert lui faisaient des yeux étranges : l'iris noisette, le regard droit, comme les autres.)
const EXPR_N = {
  ...EXPR,
  veille: X({ brow: [0.25, -0.1, -0.3], browR: [-0.35, -0.5, -0.45], lid: 0.16, tilt: 0, look: [0, 0.15], under: 0.4, mouth: 'flat' }),
  // concentré : les lèvres pincées (la lèvre mordue de la troupe lui faisait une dent de lapin)
  concentree: { ...EXPR.concentree, mouth: 'press' },
  // il examine de près ce qu'il tient à sa gauche (à droite de l'écran) : un œil plissé, le regard de ce côté
  examine: X({ brow: [0.9, -0.2, 0], browR: [-0.6, -1.1, -0.7], lid: 0.3, tilt: 0.3, low: 0.12, look: [0.6, -0.1], mouth: 'press' })
};

// Son œil : celui de la refonte (visage.js), sans le petit trait de cil au coin extérieur (choix de l'auteur, 15 oct. :
// sur lui, il faisait un œil maquillé, étrange)
const oeil = (...a) => eye(...a).replace(/<path d="M[-\d.]+,[-\d.]+ l-?0\.7,-0\.[56]" [^>]*\/>/g, '');

// ---- les objets ----
// Le crayon glissé derrière l'oreille : du bout caché (a) à la gomme (b) ; un pan du bois hexagonal, la virole de laiton
function crayon(K, a, b) {
  const t = 0.78, v = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return limb(a, b, 1.4, K.pencil) + L(a, v, K.pencilS, 0.35) + limb(v, [v[0] + (b[0] - a[0]) * 0.08, v[1] + (b[1] - a[1]) * 0.08], 1.45, K.brass) + E(b[0], b[1], 0.95, 0.95, K.eraser, 0.8);
}
const reflet0 = (d, w) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round"/>`;
// Une loupe : monture de laiton, deux vis, le verre (teinté pour la petite), le reflet ; fêlée (crack)
function loupe(K, x, y, r, teinte = false, fele = false) {
  let s = E(x, y, r, r, K.brass, 0.9) + E(x, y, r * 0.68, r * 0.68, teinte ? K.glassT : K.glass, 0.6)
    + reflet0(`M${r2(x - r * 0.42)},${r2(y - r * 0.1)} Q${r2(x - r * 0.36)},${r2(y - r * 0.4)} ${r2(x - r * 0.08)},${r2(y - r * 0.44)}`, 0.5)
    + E(x + r * 0.84, y - r * 0.1, 0.22, 0.22, K.brassS, 0) + E(x - r * 0.84, y + r * 0.1, 0.22, 0.22, K.brassS, 0);
  if (fele) {
    const q = r * 0.6;
    s += `<path d="M${r2(x - q * 0.9)},${r2(y - q * 0.7)} L${r2(x - q * 0.1)},${r2(y - q * 0.05)} L${r2(x - q * 0.35)},${r2(y + q * 0.75)} M${r2(x - q * 0.1)},${r2(y - q * 0.05)} L${r2(x + q * 0.85)},${r2(y + q * 0.2)}" fill="none" stroke="${OUT}" stroke-width="0.45" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return s;
}
// La clé de remontoir de Tic-Tac, au bout de sa cordelette : l'anneau, la tige, le panneton en trèfle
function cle(K, x, y, a = 0) {
  const anneau = `<circle cx="${x}" cy="${r2(y + 3.2)}" r="0.9" fill="none" stroke="${OUT}" stroke-width="1.3"/><circle cx="${x}" cy="${r2(y + 3.2)}" r="0.9" fill="none" stroke="${K.brass}" stroke-width="0.5"/>`;
  return `<g transform="rotate(${a} ${x} ${y})">${L([x, y], [x, y + 2.3], OUT, 0.45)}${anneau}${limb([x, y + 4.1], [x, y + 6.2], 0.55, K.brass)}`
    + `${E(x - 0.6, y + 6.5, 0.55, 0.45, K.brass, 0.4)}${E(x + 0.6, y + 6.5, 0.55, 0.45, K.brass, 0.4)}${E(x, y + 7, 0.5, 0.45, K.brass, 0.4)}</g>`;
}
// Un rivet de laiton
const rivetL = (K, x, y) => E(x, y, 0.48, 0.48, K.brass, 0.4) + E(x - 0.15, y - 0.15, 0.16, 0.16, K.brassH, 0);
// La vieille brûlure (sur le cuir) : une auréole sombre, le centre plus noir, deux craquelures
const roussi = (K, x, y, s = 1) => E(x, y, 1.5 * s, 1 * s, K.leatherS, 0).replace('/>', ' opacity=".9"/>') + E(x + 0.2 * s, y, 0.9 * s, 0.55 * s, '#2E2018', 0).replace('/>', ' opacity=".75"/>')
  + L([x - 0.6 * s, y - 0.2 * s], [x - 1.4 * s, y - 0.7 * s], '#2E2018', 0.3) + L([x + 0.8 * s, y + 0.3 * s], [x + 1.5 * s, y + 0.8 * s], '#2E2018', 0.3);

// ---- le corps ----
const TORSE = 'M16,32.4 Q24,29.8 32,32.4 L33.2,46.6 Q24,48.8 14.8,46.6 Z';
// le bas de la chemise (sous le tablier), et ce qui s'en voit
const BAS = off => suitOurlet(14.8, 33.2, 46.6, 48.8, off);
// le tablier de cuir (atelier) et le grand tablier de forge, qui descend aux tibias
const TABLIER = (k, bas) => `M${18.6 + k},35.2 L${29.4 + k},35.2 L${30.6 + k},40 L${r2(32.2 + k + (bas - 52) * 0.12)},${bas} Q${24 + k},${r2(bas + 1.8)} ${r2(15.8 + k - (bas - 52) * 0.12)},${bas} L${17.4 + k},40 Z`;

function corps(c, ctx, K, M) {
  const view = ctx.view, u = c.uid, t = c.tenue || 'atelier', mir = !!c.miroir, dos = view === 'ne';
  const k = view === 'se' ? -1.8 : 0, axe = 24 + k;
  const shadeX = view === 'se' ? 26.4 : 27.6;
  // la chemise : l'ombre côté brume, le reflet, le contre-jour, deux plis
  let s = P(TORSE, K.shirt) + clip(`${u}t`, TORSE, `<rect x="${shadeX}" y="30" width="10" height="20" fill="${K.shirtS}"/><rect x="16.6" y="34" width="1.2" height="11" rx="0.6" fill="${K.shirtH}" opacity=".8"/>`
    + `<rect x="32.3" y="34" width="1.1" height="12" fill="${K.rim}" opacity=".55"/><path d="M19.2,37 Q18.6,41.6 18.6,46" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/><path d="M29.4,37 Q30,41.6 30.2,46.4" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>`
    + (M.salt ? `<path d="${BAS(1.6)}" fill="none" stroke="${K.salt}" stroke-width="0.6" opacity="${r2(0.6 * M.salt)}"/>` : '')
    + (M.dust ? [[17.4, 44.6], [30.8, 43.8], [19.6, 39]].map(([x, y]) => E(x, y, 1.1, 0.5, K.dust, 0).replace('/>', ` opacity="${r2(0.7 * M.dust)}"/>`)).join('') : '')) + P(TORSE, 'none');
  if (dos) {
    if (t === 'gilet') return s + gilet(c, ctx, K, M, mir);
    // de dos : les bretelles croisées et le nœud du tablier (de forge : plus larges, une boucle de laiton)
    const lw = t === 'forge' ? 1.9 : 1.5, cuir = t === 'forge' ? K.forge : K.leather;
    s += limb([18.2, 32.8], [29, 41.2], lw, cuir) + limb([29.8, 32.8], [19, 41.2], lw, cuir);
    s += `<path d="M18.6,33.4 L28.6,41 M29.4,33.4 L19.4,41" fill="none" stroke="${K.leatherH}" stroke-width="0.3" stroke-dasharray=".6 .5" opacity=".8"/>`;
    if (t === 'forge') s += `<rect x="22.6" y="35.6" width="2.8" height="2.2" rx="0.4" fill="none" stroke="${OUT}" stroke-width="1.3"/><rect x="22.6" y="35.6" width="2.8" height="2.2" rx="0.4" fill="none" stroke="${K.brass}" stroke-width="0.55"/>`;
    s += P('M24,41.4 Q20.6,39.2 20.4,41.6 Q20.6,43.8 24,41.4 Z', cuir, 0.8) + P('M24,41.4 Q27.4,39.2 27.6,41.6 Q27.4,43.8 24,41.4 Z', cuir, 0.8)
      + limb([23.6, 41.8], [22.4, 45.4], 0.9, cuir) + limb([24.4, 41.8], [25.8, 45.2], 0.9, cuir) + E(24, 41.4, 1, 0.9, K.leatherS, 0.8);
    // la clé de Tic-Tac, à sa hanche gauche (de dos : à gauche de l'écran)
    s += reflet(24, cle(K, 15.6, 41.6, 8), mir);
    return s + mouille(M, 47.6, ctx);
  }
  if (t === 'gilet') return s + gilet(c, ctx, K, M, mir);
  // le tablier : sa bavette, ses bords surpiqués, ses rivets, ses poches ; ce qui est dedans
  // (le grand tablier de forge descend aux tibias ; assis, il se plie sur ses genoux)
  const forge = t === 'forge', bas = forge && !ctx.seatDy ? 55.4 : 52;
  const cuir = forge ? K.forge : K.leather, cuirS = forge ? K.forgeS : K.leatherS, cuirH = forge ? K.forgeH : K.leatherH;
  const ap = TABLIER(k, bas);
  // les bretelles du tablier, du haut de la bavette au cou
  s += L([19 + k, 35.4], [18.2 + k * 0.5, 32.4], cuirS, 1.2) + L([29 + k, 35.4], [29.8 + k * 0.5, 32.4], cuirS, 1.2);
  if (!forge) {
    // dans la poche à outils : le tournevis (manche rouge) et la règle, qui dépassent
    s += limb([21 + k, 44], [20.4 + k, 40.2], 0.7, K.steel) + limb([20.4 + k, 40.8], [20.1 + k, 39.4], 1.5, K.red);
    s += `<rect x="${25.6 + k}" y="39.2" width="1.6" height="6" rx="0.3" fill="${K.wood}" stroke="${OUT}" stroke-width="0.6"/>` + [40.2, 41.2, 42.2].map(y => L([25.7 + k, y], [26.3 + k, y], OUT, 0.3)).join('');
  }
  // la vieille brûlure, du côté droit du tablier (l'incendie) ; le cambouis, la suie, la sciure, le sel
  const taches = roussi(K, 18.6 + k, forge ? 50.6 : 49.2, 1) + (forge ? roussi(K, 27.6 + k, 53, 0.8) + roussi(K, 21.4 + k, 38.2, 0.6) : '')
    + (M.grease ? `<path d="M${27.4 + k},46.8 q1.2,-0.8 2.2,0 q-0.2,1.4 -1.2,1.4 q-1.2,0 -1,-1.4 Z" fill="${K.grease}" opacity="${r2(0.5 * M.grease)}"/><path d="M${28.2 + k},45.8 l0.5,-1.3 M${29.1 + k},46 l0.6,-1.1" stroke="${K.grease}" stroke-width="0.45" opacity="${r2(0.45 * M.grease)}"/>` : '')
    + (M.soot ? E(22.6 + k, bas - 2.4, 2.2, 0.9, K.soot, 0).replace('/>', ` opacity="${r2(0.4 * M.soot)}"/>`) : '');
  const sciure = M.dust ? [[20.4, 46.4], [26.6, 50], [22, 50.6], [28.4, 42.6]].map(([x, y]) => E(x + k, y, 0.9, 0.45, K.dust, 0).replace('/>', ` opacity="${r2(0.85 * M.dust)}"/>`)).join('') : '';
  const sel = M.salt ? `<path d="${suitOurlet(15.8 + k, 32.2 + k, bas, bas + 1.8, 1.4, 0.15)}" fill="none" stroke="${K.salt}" stroke-width="0.55" opacity="${r2(0.6 * M.salt)}"/>` : '';
  s += P(ap, cuir) + clip(`${u}a`, ap, `<rect x="${27.6 + k}" y="34" width="9" height="24" fill="${cuirS}"/><rect x="${18.4 + k}" y="35.8" width="1" height="${bas - 37}" rx="0.5" fill="${cuirH}"/>`
    + `<path d="M${19.6 + k},48 l2.4,0.6 M${25.4 + k},38.4 l1.6,-0.5 M${28.6 + k},49.4 l1.4,0.8" stroke="${cuirH}" stroke-width="0.35" opacity=".7"/>`
    + reflet(axe, taches, mir) + sciure + sel) + P(ap, 'none');
  // la surpiqûre le long des bords du tablier
  s += seam(`M${19.3 + k},35.9 L${28.7 + k},35.9 L${29.8 + k},40.2 L${r2(31.4 + k + (bas - 52) * 0.12)},${r2(bas - 0.8)}`, 0.3) + seam(`M${18.2 + k},40.2 L${r2(16.6 + k - (bas - 52) * 0.12)},${r2(bas - 0.8)}`, 0.3);
  if (!forge) {
    // la poche à outils, en trois compartiments ; décousue (sa moitié droite pend), recousue (grands points) ou nette
    const pk = `M${19.2 + k},43.2 L${28.8 + k},43.2 L${28.8 + k},48 Q${28.8 + k},48.8 ${28 + k},48.8 L${20 + k},48.8 Q${19.2 + k},48.8 ${19.2 + k},48 Z`;
    s += P(pk, cuirS, 0.8) + seam(`M${20 + k},44.2 L${28 + k},44.2`, 0.35) + L([22.4 + k, 43.4], [22.4 + k, 48.6], OUT, 0.5) + L([25.6 + k, 43.4], [25.6 + k, 48.6], OUT, 0.5);
    s += [[20.8, 43.2, 'brush'], [24, 43.2, 'pliers']].map(([x, y, o]) => o === 'brush' ? limb([x + k, y], [x + k - 0.3, y - 2.4], 0.7, K.wood) + E(x + k - 0.35, y - 2.8, 0.55, 0.7, K.hairS, 0.4)
      : limb([x + k - 0.3, y], [x + k - 0.6, y - 2.2], 0.45, K.steel) + limb([x + k + 0.3, y], [x + k + 0.6, y - 2.2], 0.45, K.steel)).join('');
    if (M.pocket === 'torn') {
      // la moitié droite décousue : le rabat pend, l'intérieur sombre, deux fils
      s += reflet(axe, `<rect x="${25.6 + k}" y="43.4" width="3.2" height="1.4" fill="#2E2018"/>` + P(`M${25.6 + k},44.8 L${28.8 + k},44.8 Q${28.6 + k},47.4 ${27.4 + k},49.2 Q${26.2 + k},47.6 ${25.6 + k},44.8 Z`, cuirS, 0.8)
        + `<path d="M${28.8 + k},44.6 q0.5,0.8 0.1,1.6 M${25.6 + k},44.6 q-0.4,0.9 0,1.5" fill="none" stroke="${K.cloth}" stroke-width="0.3"/>`, mir);
    } else if (M.pocket === 'mended') {
      s += reflet(axe, [44.4, 45.6, 46.8, 48].map(y => L([28.4 + k, y], [29.4 + k, y + 0.3], K.cloth, 0.4)).join(''), mir);
    }
    // la poche de poitrine et son crayon
    s += `<rect x="${21.6 + k}" y="36.4" width="4.6" height="3.4" rx="0.5" fill="${cuirS}" stroke="${OUT}" stroke-width="0.7"/>` + limb([22.6 + k, 37.6], [23.4 + k, 34.6], 0.8, K.pencil) + E(23.45 + k, 34.45, 0.45, 0.45, K.eraser, 0.35);
  } else {
    // le tablier de forge : une grande poche plaquée, rivée aux coins ; une pince de forge passée dedans
    s += `<rect x="${19.4 + k}" y="44" width="9.2" height="5.4" rx="0.6" fill="${cuirS}" stroke="${OUT}" stroke-width="0.8"/>` + seam(`M${20.1 + k},44.8 L${27.9 + k},44.8`, 0.32)
      + limb([24.6 + k, 44.2], [25.6 + k, 39.6], 0.55, K.steelS) + limb([25.4 + k, 44.2], [26.8 + k, 39.8], 0.55, K.steelS);
  }
  for (const [x, y] of [[19.4, 35.9], [28.6, 35.9], [17.6, 40.4], [30.4, 40.4]]) s += rivetL(K, x + k, y);
  s += L([17.4 + k, 40.6], [30.6 + k, 40.6], cuirS, 0.8);
  // la clé de Tic-Tac, au bout de sa cordelette, pendue à sa hanche gauche (à droite de l'écran)
  s += reflet(axe, cle(K, 30.2 + k, 40.8, -6), mir);
  return s + mouille(M, forge ? bas : 48.4, ctx);
}

// Le gilet d'horloger (tenue gilet) : quatre boutons de laiton, deux poches passepoilées, la chaîne de la montre de
// gousset ; de dos, la doublure et sa martingale à boucle
function gilet(c, ctx, K, M, mir) {
  const view = ctx.view, k = view === 'se' ? -1.6 : 0, u = c.uid;
  if (view === 'ne') {
    const G = 'M15.6,32.8 Q24,30.6 32.4,32.8 L33.4,46.4 Q24,48.4 14.6,46.4 Z';
    return P(G, K.lining) + clip(`${u}gd`, G, `<rect x="27.6" y="30" width="10" height="20" fill="${OUT}" opacity=".25"/><path d="M15,39 Q24,41 33,39" stroke="#FFFFFF" stroke-width="0.4" opacity=".3" fill="none"/>`) + P(G, 'none')
      + `<rect x="18.4" y="41.2" width="11.2" height="1.6" rx="0.4" fill="${K.vestS}" stroke="${OUT}" stroke-width="0.6"/><rect x="23" y="40.9" width="2" height="2.2" rx="0.3" fill="none" stroke="${K.brass}" stroke-width="0.5"/>`
      + mouille(M, 47.6, ctx);
  }
  const Gl = `M${16 + k},32.6 Q${19.6 + k},31.6 ${21.8 + k},32.6 L${24 + k},39.6 L${24 + k},47.8 Q${19 + k},47.6 ${14.8 + k},46.6 Z`;
  const Gr = `M${32 + k},32.6 Q${28.4 + k},31.6 ${26.2 + k},32.6 L${24 + k},39.6 L${24 + k},47.8 Q${29 + k},47.6 ${33.2 + k},46.6 Z`;
  let s = '';
  for (const [d, droite] of [[Gl, false], [Gr, true]]) {
    s += P(d, K.vest) + clip(`${u}g${droite ? 'r' : 'l'}`, d, (droite ? `<rect x="${27.6 + k}" y="30" width="10" height="20" fill="${K.vestS}"/>` : `<rect x="${16.4 + k}" y="34" width="1" height="11" rx="0.5" fill="${K.vestH}"/>`)
      + `<path d="M${(droite ? 31.6 : 16.4) + k},34 L${(droite ? 32.4 : 15.6) + k},46" stroke="${OUT}" stroke-width="0.3" opacity=".25"/>`) + P(d, 'none');
  }
  // le col de la chemise, la cravate dénouée (un simple ruban sombre)
  s += P(`M${22.6 + k},33.4 L${25.4 + k},33.4 L${24.6 + k},37.8 L${24 + k},38.6 L${23.4 + k},37.8 Z`, K.vestS, 0.7);
  s += [40.8, 42.8, 44.8, 46.6].map(y => rivetL(K, 24.3 + k, y).replace(/rx="0.48" ry="0.48"/, 'rx="0.55" ry="0.55"')).join('');
  // les poches passepoilées ; la montre dans celle de gauche (à droite de l'écran), sa chaîne jusqu'au bouton
  s += L([17.6 + k, 42], [21.2 + k, 41.8], OUT, 0.7) + L([26.8 + k, 41.8], [30.4 + k, 42], OUT, 0.7);
  s += reflet(24 + k, `<path d="M${24.6 + k},42.8 Q${27 + k},44.8 ${29 + k},41.8" fill="none" stroke="${OUT}" stroke-width="1"/><path d="M${24.6 + k},42.8 Q${27 + k},44.8 ${29 + k},41.8" fill="none" stroke="${K.brassH}" stroke-width="0.45" stroke-dasharray=".5 .3"/>`
    + E(29.2 + k, 41.2, 1.15, 1.15, K.brass, 0.7) + E(29.2 + k, 41.2, 0.7, 0.7, '#FFF8E8', 0.3) + L([29.2 + k, 41.2], [29.2 + k, 40.7], OUT, 0.25), mir);
  // le crayon dans la poche du haut, du côté droit
  s += reflet(24 + k, limb([19.2 + k, 37.4], [19.8 + k, 34.8], 0.8, K.pencil) + E(19.85 + k, 34.6, 0.45, 0.45, K.eraser, 0.35) + L([18 + k, 37.6], [20.8 + k, 37.4], OUT, 0.6), mir);
  if (M.grease) s += reflet(24 + k, `<ellipse cx="${18.6 + k}" cy="45.2" rx="1.2" ry="0.6" fill="${K.grease}" opacity="${r2(0.45 * M.grease)}"/>`, mir);
  return s + mouille(M, 48.4, ctx);
}
// trempé : des gouttes tombent du bas de la chemise (ou du tablier), en continu ; debout seulement
const mouille = (M, hy, ctx) => (M.wet && !ctx.seatDy ? [[16.6, 0], [24.4, 0.55], [31.4, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r2(hy + 1.4)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r2(hy + 1.4)};${r2(hy + 7)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join('') : '');

// Les bras : les manches de la refonte (lorena_bras.js), plus ce qui est à lui : le brassard d'horloger sur le haut du
// bras (il tient la manche retroussée), la vieille brûlure sur son avant-bras gauche, les gants de forge
const brasBase = fabriquerBras({ pal, marks });
function bras(c, a, b, elbow, main, partie = 'tout') {
  const K = pal(c);
  let s = brasBase(c, a, b, elbow, main, partie);
  // (la même géométrie que lorena_bras.js : les deux os, le coude calculé ; en courant, le bras se plie)
  const geo = poserBras(c, a, b, elbow, main);
  b = geo.b; elbow = geo.elbow;
  const view = c.view || 'front', gauche = a[0] < 24;
  const droit = (view === 'ne' ? !gauche : gauche) !== !!c.miroir;
  const w = c.armW;
  // la ligne du bras (membres.js) : ce qui est sur le bras la suit, là où il est
  const ligne = ligneBras(a, elbow, b), tot = longueurLigne(ligne);
  // une bande autour du bras, centrée à k du poignet, large de wd : un anneau (membres.js), cerné
  const band = (k, half, col, wd, courbe = 0) => `<path d="${anneau(ligne, k + wd / 2, k - wd / 2, half, courbe).d}" fill="${col}" stroke="${OUT}" stroke-width="0.45" stroke-linejoin="round"/>`;
  // le brassard : au tiers du haut du bras, la bande noire et sa petite boucle d'acier (pas sur la manche arrachée) ;
  // à plat (à mi-bras, un anneau bombé ferait une articulation)
  const avb = elbow ? Math.hypot(b[0] - elbow[0], b[1] - elbow[1]) : 0;
  if (partie !== 'devant' && c.sleeves !== 'torn' && !c.sansBrassard) {
    const k = elbow ? tot - (tot - avb) * 0.55 : tot * 0.64;
    s += band(k, w / 2 + 0.2, K.garter, 0.85);
    const m = pointLigne(ligne, k).p;
    s += E(m[0], m[1], 0.45, 0.45, K.steel, 0.35);
  }
  if (partie === 'derriere') return s;
  // l'avant-bras
  const len = elbow ? avb : tot;
  const nu = c.sleeves === 'torn' || c.sleeves === 'roll';
  const coupe = c.sleeves === 'torn' ? Math.min(4.4, len * 0.5) : Math.min(5.8, len * 0.55);
  const bande = c.sleeves === 'torn' && c.bandage && ((c.bandage === 'right') === droit);
  // la vieille brûlure, sur l'avant-bras gauche : une plaque lisse, plus rose, un reflet (sous le bandage, cachée)
  if (nu && !droit && !bande && len > 3.5) {
    const { p, u: [ux, uy] } = pointLigne(ligne, coupe * 0.62), ang = r2(Math.atan2(uy, ux) * 180 / Math.PI);
    s += `<g transform="rotate(${ang} ${r2(p[0])} ${r2(p[1])})"><path d="M${r2(p[0] - 1.1)},${r2(p[1] - 0.6)} Q${r2(p[0] - 0.2)},${r2(p[1] - 1.1)} ${r2(p[0] + 1)},${r2(p[1] - 0.5)} Q${r2(p[0] + 1.3)},${r2(p[1] + 0.4)} ${r2(p[0] + 0.3)},${r2(p[1] + 0.7)} Q${r2(p[0] - 0.9)},${r2(p[1] + 0.6)} ${r2(p[0] - 1.1)},${r2(p[1] - 0.6)} Z" fill="${K.scar}"/>`
      + `<path d="M${r2(p[0] - 0.5)},${r2(p[1] - 0.4)} q0.5,-0.2 0.9,0" fill="none" stroke="${K.scarH}" stroke-width="0.35" stroke-linecap="round"/></g>`;
  }
  // les gants de forge : le poing de cuir et son revers évasé, sur le poignet (un anneau à peine bombé)
  if (c.gants && main == null) {
    s += band(1.8, w / 2 + 0.55, K.glove, 1.3, 0.3) + E(b[0], b[1], 2.15, 2.15, K.glove, 0.9) + E(b[0] - 0.6, b[1] - 0.6, 0.7, 0.5, '#B98858', 0);
  }
  return s;
}

// La chaussure de travail, avec la boue de l'état ; au genou, la pièce (rafistolé) et la poussière
function pied(c, x, y, dir, tilt, genou) {
  const M = marks(c), K = pal(c);
  let s = '';
  const gx = x - c.legW / 2 + 0.5, gw = c.legW - 1;
  const g = genou || [x, (c.hip + y) / 2];
  // la pièce au genou droit (rafistolé), cousue au gros point (de face et de trois quarts, à gauche de l'écran ; de dos,
  // à droite)
  const droite = ((c.view || 'front') === 'ne' ? x > 24 : x < 24) !== !!c.miroir;
  if (M.patch && droite) s += `<rect x="${r2(g[0] - gw / 2)}" y="${r2(g[1] - 1.5)}" width="${r2(gw)}" height="3" rx="0.5" fill="${K.patch}" stroke="${OUT}" stroke-width="0.5"/>` + seam(`M${r2(g[0] - gw / 2 + 0.4)},${r2(g[1] - 1.1)} L${r2(g[0] + gw / 2 - 0.4)},${r2(g[1] - 1.1)}`, 0.3);
  if (M.dirt) s += `<rect x="${r2(gx)}" y="${r2(y - 1.6)}" width="${r2(gw)}" height="2.2" fill="${K.mud}" opacity="${r2(0.5 * M.dirt)}"/>`;
  if (M.salt) s += L([gx, y - 2.6], [gx + gw, y - 2.8], K.salt, 0.45).replace('/>', ` opacity="${r2(0.6 * M.salt)}"/>`);
  s += shoe(c, x, y, dir, tilt);
  // les lacets de la chaussure de travail (de face et de trois quarts)
  if (dir <= 0 && !tilt) s += L([x - 1, y + 0.9], [x + 0.4, y + 0.6], c.shoeH, 0.35) + L([x - 1, y + 1.7], [x + 0.6, y + 1.4], c.shoeH, 0.35);
  if (M.dirt) s += E(x - 1.6, y + 3.6, 1.6, 0.7, K.mud, 0).replace('/>', ` opacity="${r2(0.8 * M.dirt)}"/>`);
  return s;
}

// ---- la tête ----
// La géométrie du visage selon la vue (de trois quarts : les traits glissent vers la gauche, le lointain se resserre)
const VUES = {
  front: {
    X: x => x, rk: [1, 1], k: 0, mouth: 24,
    face: 'M12.4,21.6 C12.4,14.4 17.4,11.2 24,11.2 C30.6,11.2 35.6,14.4 35.6,21.6 C35.6,27.4 31.2,32 24,32 C16.8,32 12.4,27.4 12.4,21.6 Z',
    back: 'M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z',
    strap: 'M11.8,14.6 Q24,6.6 36.2,14.6 L36.4,16.8 Q24,8.8 11.6,16.8 Z',
    big: [[19.4, 10.8, 2.9], [28.6, 10.8, 2.9]], small: [[17.4, 8.6, 1.9], [30.6, 8.6, 1.9]],
    ears: [[11.8, 22.8], [36.2, 22.8]], pencils: [[[14, 20.8], [7.8, 19.4]], [[34, 20.8], [40.2, 19.4]]]
  },
  // (de trois quarts : l'axe du visage, nez et bouche, passe à 21, côté profil ; l'œil proche, côté oreille, garde sa
  // taille, l'œil lointain se resserre vers le profil ; les yeux gardent l'écart du kit. Choix de l'auteur, 15 oct. :
  // resserrés au milieu à la façon du kit, puis avec un grand nez en crochet, ses traits faisaient un visage serré et
  // mal proportionné.)
  se: {
    X: x => r2(21 + (x - 24) * (x < 24 ? 0.86 : 0.98)), rk: [0.86, 1], k: -1.4, mouth: 21, axe: 21,
    face: 'M11.4,21.6 C11.4,14.4 16.2,11.2 22.6,11.2 C29,11.2 33.8,14.4 33.8,21.6 C33.8,27.4 29.6,32 22.6,32 C15.6,32 11.4,27.4 11.4,21.6 Z',
    back: 'M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z',
    strap: 'M12.2,14.6 Q24,6.4 36.8,14.2 L37,16.4 Q24,8.6 12,16.8 Z',
    big: [[17.8, 10.8, 2.8], [26.6, 10.4, 2.5]], small: [[16, 8.6, 1.8], [28.4, 8.2, 1.6]],
    ears: [[35, 23.2]], pencils: [[[33.4, 20.8], [39.2, 19.2]]]
  }
};
// l'épi gris, la mèche rebelle qui jaillit du sommet et bouge au vent
const EPI = ['M22.6,8.4 Q21.6,3.6 25.6,2.4 Q24.4,4.8 26.6,8 Z', 'M22.6,8.4 Q22,3.8 26.2,2.8 Q24.8,5 26.6,8 Z'];
const epi = (K, begin = '0s') => wind(EPI[0], EPI[1], K.grey, 0.9, '2.1s', begin) + L([23.4, 7], [24.2, 4.2], K.greyS, 0.5);

function tete(c, ctx, act = {}) {
  const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
  if (ctx.view === 'ne') return teteDeDos(c, ctx, K, M, mir, id);
  const V = VUES[ctx.view] || VUES.front, Xv = V.X, k = V.k, ax = Xv(24);
  const sx = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
  const name = ALIAS[ctx.expr] || ctx.expr;
  const ex = ctx.blink && name === 'veille' ? EXPR_N.cligne : EXPR_N[name] || EXPR_N.veille;
  // l'épi, les cheveux de derrière, les oreilles et leurs crayons
  let s = epi(K) + P(V.back, K.hair) + clip(`${id}h`, V.back, `<rect x="8" y="24.6" width="32" height="6" fill="${K.hairS}"/><path d="M35,12 Q38,19 36,27 L39,27 L39,12 Z" fill="${K.rim}" opacity=".7"/>`) + P(V.back, 'none');
  for (const [x, y] of V.ears) s += E(x, y, 1.5, 2.1, K.skin) + P(`M${r2(x + (x > 24 ? -0.2 : 0.2))},${r2(y - 1)} Q${r2(x + (x > 24 ? 0.6 : -0.6))},${y} ${r2(x + (x > 24 ? -0.1 : 0.1))},${r2(y + 1)}`, 'none', 0.45);
  if (!c.coiffe) for (const [a, b] of V.pencils) s += crayon(K, a, b);
  // le visage ; dans son ombre : la frange, la barbe de quelques jours sur la mâchoire, le contre-jour, les joues
  const barbe = `M${r2(Xv(14))},25.6 Q${r2(Xv(16))},31.6 ${ax},32.4 Q${r2(Xv(32))},31.6 ${r2(Xv(34))},25.6 Q${r2(Xv(32.6))},29.8 ${ax},30.6 Q${r2(Xv(15.4))},29.8 ${r2(Xv(14))},25.6 Z`;
  const poils = [[16.6, 28.4], [18.4, 29.8], [20.6, 30.6], [27.4, 30.6], [29.6, 29.8], [31.4, 28.4], [22.6, 30.9], [25.4, 30.9]].map(([x, y]) => E(Xv(x), y, 0.18, 0.18, K.stubble, 0).replace('/>', ' opacity=".55"/>')).join('');
  // (la frange : ses mèches et la mèche grise de sa gauche ; en miroir, toute la frange se retourne autour de son milieu)
  const bangs = sx('M12,19.2 Q11.4,10 24,9.6 Q36.6,10 36.4,18.6 Q34.6,14.6 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q23,13.4 19.6,14.2 L19.4,17.4 Q16.6,14.2 14,16 Q12.6,17.4 12,19.2 Z');
  const grey = sx('M25,10 Q33.6,9.8 35.8,16.4 Q34.4,14.4 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q25.4,14.6 23.6,13.4 Q23.8,11 25,10 Z');
  const bx = 24 + k;
  s += P(V.face, K.skin) + clip(`${id}f`, V.face, reflet(bx, `<path d="${bangs}" fill="${K.skinS}" transform="translate(0 1.4)"/>`, mir)
    + `<path d="${barbe}" fill="${K.stubble}" opacity=".16"/>` + poils
    + `<g transform="translate(${k} 0)"><path d="M33.4,14 Q36.6,21.6 32.6,31.2 L37,31.2 L37,14 Z" fill="${K.rim}" opacity=".45"/><path d="M31.8,13 Q35,21 31.2,30.8 L33.6,30.8 Q37,21 33.6,13 Z" fill="${K.skinS}" opacity=".4"/></g>`
    + E(Xv(16.6), 26.2, 1.9 * V.rk[0], 1.05, K.cheek, 0).replace('/>', ' opacity=".55"/>') + E(Xv(31.4), 26.2, 1.9 * V.rk[1], 1.05, K.cheek, 0).replace('/>', ' opacity=".55"/>')) + P(V.face, 'none');
  // la frange en mèches ; celle de sa gauche est grise (à droite de l'écran ; en miroir, de l'autre côté)
  s += reflet(bx, P(bangs, K.hair) + clip(`${id}b`, bangs, `<rect x="8" y="15.6" width="32" height="4" fill="${K.hairS}" opacity=".5"/>`) + P(bangs, 'none') + L([15 + k, 12.6], [20 + k, 11], K.hairH, 1.2)
    + P(grey, K.grey, 0.8) + L([26.4 + k, 12.2], [29.4 + k, 12.6], K.greyH, 0.9) + L([27.4 + k, 14.4], [29.6 + k, 16.2], K.greyS, 0.4), mir);
  if (c.coiffe) s += c.coiffe(c, ctx, 'cheveux');
  // les lunettes relevées sur le crâne : la sangle cousue, les deux grandes loupes et les petites empilées, leur
  // charnière ; la grande de sa gauche fêlée (le naufrage). Pendant la loupe (act.lensDown), celle-là est sur l'œil.
  s += P(V.strap, K.strap, 0.8);
  const lunettes = V.big.map(([x, y, r], i) => {
    if (act.lensDown && i === 1) return '';
    const [sx0, sy0, sr] = V.small[i];
    // (la loupe fêlée, celle de sa gauche : à droite de l'écran ; en miroir, celle d'en face)
    return loupe(K, x, y, r, false, i === (mir ? 0 : 1) && M.crack) + L([x, y], [sx0, sy0], K.brassS, 0.6) + loupe(K, sx0, sy0, sr, true);
  }).join('') + L([V.big[0][0] + V.big[0][2] - 0.2, V.big[0][1]], [V.big[1][0] - V.big[1][2] + 0.2, V.big[1][1]], K.brassS, 0.9);
  s += lunettes;
  if (c.coiffe) s += c.coiffe(c, ctx, 'tete');
  // le cambouis : sur sa joue gauche, et l'empreinte d'un doigt sur le front ; la suie sur le nez
  if (M.grease) s += reflet(ax, `<ellipse cx="${Xv(30.8)}" cy="28.6" rx="1.6" ry="0.7" fill="${K.grease}" opacity="${r2(0.45 * M.grease)}" transform="rotate(-14 ${Xv(30.8)} 28.6)"/><ellipse cx="${Xv(20.6)}" cy="16.2" rx="0.9" ry="0.55" fill="${K.grease}" opacity="${r2(0.35 * M.grease)}"/>`, mir);
  if (M.soot) s += E(ctx.view === 'se' ? 20.4 : 23.6, 24.6, 0.9, 0.5, K.soot, 0).replace('/>', ` opacity="${r2(0.3 * M.soot)}"/>`);
  if (M.dust) s += E(Xv(27), 15, 1.4, 0.5, K.dust, 0).replace('/>', ` opacity="${r2(0.8 * M.dust)}"/>`);
  // le petit nez (de trois quarts, sur l'axe du visage, sa pointe vers le profil), puis le regard
  s += ctx.view === 'se'
    ? P(`M${r2(V.axe + 0.2)},24.5 Q${r2(V.axe - 0.8)},25.4 ${r2(V.axe + 0.3)},25.8`, 'none', 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(V.axe + 0.5, 24.9, 0.25, 0.32, '#F2C6A2', 0)
    : P('M23.3,25.2 Q24,26 24.8,25.3', 'none', 0.75).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.1, 24.7, 0.28, 0.36, '#F2C6A2', 0);
  s += mouth(ex.mouth, V.mouth, 27.2, `${id}m`, K);
  s += brow(Xv(19.4), 18.6, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.6, -1, ex.browR || ex.brow, false, V.rk[1], K);
  s += oeil(`${id}e0`, Xv(19.4), 22.6, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K);
  if (!act.lensDown) s += oeil(`${id}e1`, Xv(28.6), 22.6, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
  s += extras(ex.extras, ctx.n % 2, Xv);
  if (M.wet) s += gouttes(mir);
  return s;
}
// trempé : deux gouttes tombent des mèches
const gouttes = mir => reflet(24, [[14.2, 19.8, 0], [32.2, 18, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 6}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(''), mir);

// La tête de dos : les mèches en bataille jusqu'au col, la nuque entre celles du milieu, la sangle des lunettes et sa
// boucle, les deux crayons (un derrière chaque oreille), une mèche grise à sa gauche (à gauche de l'écran)
function teteDeDos(c, ctx, K, M, mir, id) {
  const back = 'M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.6,31.2 24,30.2 Q22.4,31.2 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z';
  let s = epi(K) + E(12.6, 23, 1.6, 2.2, K.skin) + E(35.4, 23, 1.6, 2.2, K.skin);
  s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="4" width="34" height="30" fill="${K.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.8" ry="12.8" fill="${K.hair}"/><path d="M35.4,10 Q38.4,19 36.4,30 L39,30 L39,10 Z" fill="${K.rim}" opacity=".7"/>`) + P(back, 'none');
  s += P('M17.6,15 Q16.8,21 18.4,28.6', 'none', 0.6) + P('M24.6,15 Q25.4,21 24.2,28.4', 'none', 0.6) + P('M31,16.4 Q32,22 30.6,29.2', 'none', 0.6) + L([16.6, 10.2], [21.6, 8.6], K.hairH, 1.2);
  // la mèche grise, côté gauche (de dos : à gauche de l'écran)
  s += reflet(24, P('M13.4,12.6 Q15.4,8.8 19.6,8.2 Q16.6,10.4 15.6,14.4 Q14.8,16.6 13.2,17.2 Q12.6,14.8 13.4,12.6 Z', K.grey, 0.7) + L([14.6, 11.8], [16.8, 9.6], K.greyH, 0.7), mir);
  s += P('M11.2,12.2 Q24,15.8 36.8,12.2 L37,14 Q24,17.6 11,14 Z', K.strap, 0.8) + seam('M12,13.4 Q24,16.8 36,13.4', 0.25)
    + `<rect x="22.6" y="14.6" width="2.8" height="2" rx="0.4" fill="${K.brass}" stroke="${OUT}" stroke-width="0.6"/>` + L([24, 14.8], [24, 16.4], K.brassS, 0.4);
  if (c.coiffe) s += c.coiffe(c, ctx, 'cheveux') + c.coiffe(c, ctx, 'tete');
  else s += crayon(K, [15.4, 20.6], [9.2, 19.2]) + crayon(K, [32.6, 20.6], [38.8, 19.2]);
  if (M.wet) s += gouttes(!mir);
  const ex = EXPR_N[ALIAS[ctx.expr] || ctx.expr] || EXPR_N.veille;
  return s + extras(ex.extras, ctx.n % 2, v => v, true);
}

// ---- la loupe sur l'œil (l'action) ----
// Une roue dentée d'acier (rot : son angle)
function rouage(K, x, y, r, rot) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 + (rot * Math.PI) / 180, rr = i % 2 ? r * 0.76 : r;
    pts.push(`${r2(x + rr * Math.cos(a))},${r2(y + rr * Math.sin(a))}`);
  }
  return P(`M${pts.join(' L')} Z`, K.steel, 0.8) + E(x, y, r * 0.42, r * 0.42, K.steelS, 0.7) + E(x, y, r * 0.16, r * 0.16, OUT, 0)
    + [0, 1, 2].map(i => { const a = (i * 120 + rot) * Math.PI / 180; return E(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, 0.32, 0.32, K.steelS, 0); }).join('');
}
// La loupe baissée sur son œil gauche : l'œil grossi derrière le verre ; ouvert (0), puis plissé de joie (1)
function loupeOeil(K, view, n) {
  const [x, y] = [view === 'se' ? 25.4 : 28.6, 22.6];
  const grossi = n === 0
    ? E(x, y + 0.2, 2.2, 2.7, K.eye, 0) + E(x, y + 0.9, 1.7, 2, K.iris, 0) + E(x, y + 0.7, 0.8, 0.9, K.eye, 0) + E(x + 0.8, y - 0.9, 0.85, 0.85, '#FFFFFF', 0) + E(x - 0.6, y + 1.4, 0.4, 0.4, '#FFFFFF', 0)
    : P(`M${x - 2.4},${y + 1} Q${x},${y - 1.8} ${x + 2.4},${y + 1}`, 'none', 1.3);
  return L([view === 'se' ? 27.8 : 31.4, 13.6], [view === 'se' ? 27.8 : 31, 19.4], K.brassS, 0.9)
    + E(x, y, 3.6, 3.6, K.brass, 0.9) + E(x, y, 2.9, 2.9, K.skin, 0) + grossi
    + `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="2.9" fill="${K.glass}" fill-opacity="0.35"/>`
    + reflet0(`M${r2(x - 1.8)},${r2(y - 0.6)} Q${r2(x - 1.6)},${r2(y - 1.8)} ${r2(x - 0.4)},${r2(y - 2.1)}`, 0.6)
    + E(x, y, 2.9, 2.9, 'none', 0.8) + E(x + 3.3, y - 1.2, 0.3, 0.3, K.brassS, 0) + E(x - 3.3, y + 1.2, 0.3, 0.3, K.brassS, 0);
}

const nathan = {
  ...rivet,
  name: 'Nathan', uid: 'na',
  teintes: [C.hair, C.shirt, C.leather, C.grey],
  sleeve: C.shirt, cuff: null, sleeves: 'roll',
  foot: pied,
  // ses jambes : la cuisse et le tibia, le genou qui plie (membres.js)
  jambeOs: jambe, // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
  bras,

  body(c, ctx) {
    return corps(c, ctx, pal(c), marks(c));
  },

  neck(c, { view }) {
    const K = pal(c);
    // de dos : la nuque dans l'ombre, rentrée sous le col
    if (view === 'ne') return P('M19.8,24 L28.2,24 L28.6,32.4 Q24,34.4 19.4,32.4 Z', K.skinS, 0) + P('M18.6,31.4 Q24,33.6 29.4,31.4 L29.4,33 Q24,35 18.6,33 Z', K.collar, 0.8) + L([19.4, 32.5], [28.6, 32.5], K.collarS, 0.35);
    // le col ouvert : ses deux pointes, le premier bouton défait, l'ombre de la gorge
    const k = view === 'se' ? -1.6 : 0;
    return E(24 + k, 32.6, 1.6, 1.2, K.skinS, 0) + P(`M${20.2 + k},31.6 L${23.8 + k},32.8 L${21.4 + k},34.8 Z`, K.collar, 0.8) + P(`M${27.8 + k},31.6 L${24.2 + k},32.8 L${26.6 + k},34.8 Z`, K.collar, 0.8)
      + L([21 + k, 32.4], [22.2 + k, 33.6], K.collarS, 0.4) + L([27 + k, 32.4], [25.8 + k, 33.6], K.collarS, 0.4);
  },

  head(c, ctx, act) {
    return tete(c, ctx, act || {});
  },

  // le salut, et l'action : la loupe baissée sur l'œil, un rouage levé ; image 2, le rouage tourne, il s'émerveille
  // (« Attends… Non. Si. ») ; le tournevis dans l'autre main
  pose({ pose, n, k, view }) {
    const K = pal(this);
    if (pose === 'salut') return { open: true, right: arm(this, [32, 34], lerp([37.4, 25.4], [38.8, 27.4], k)) };
    const g = rouage(K, 36.2, 25, 2.8, n ? 22.5 : 0)
      + (n ? L([39.8, 21], [41.2, 19.6], OUT, 0.6) + L([40.6, 24.2], [42.4, 23.8], OUT, 0.6) + L([37.8, 20.6], [38.2, 18.8], OUT, 0.6) : '');
    const right = arm(this, [32, 34], [35.8, 28.6], [37.6, 36.4]);
    const tournevis = limb([14.4 + (12.8 - 14.4) * 0.35, 44.2 + (50.2 - 44.2) * 0.35], [12.8, 50.2], 0.6, K.steel) + limb([14.4, 44.2], [13.76, 46.6], 1.6, K.red);
    const left = arm(this, [16, 34], [14.4, 45]) + tournevis;
    const expr = n ? 'emerveillee' : 'concentree';
    if (view === 'ne') return { expr, left, right: '', over: g + right };
    return { expr, lensDown: true, left, right: '', over: loupeOeil(K, view, n) + g + right };
  }
};

module.exports = { nathan, C, MARKS, EXPR: EXPR_N, pal, marks, reflet, rouage, crayon, cle };
