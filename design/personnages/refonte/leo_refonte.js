// Léo (anciennement Ondin, Pierrot dans les premières bibles ; fichiers du jeu : ondin), le petit sourcier, refonte : le
// même personnage, le même cadre 48 × 64, le même trait et le même kit (troupe.js), poussé plus loin, comme Lorena,
// Agathe, Nathan et Robby. 10 ans (la tête d'enfant, de la même taille, posée plus bas sur un corps plus court : HY), les
// boucles blondes, le bonnet de nuit rayé et son pompon, le ciré bleu trop grand aux manches retroussées, pieds nus, la
// baguette de noisetier fourchue en main, le bocal de Bulle à la ceinture de corde. Toujours à moitié endormi (la brume
// le tient encore) : au repos, les paupières mi-closes, le regard qui monte vers la lune, une toute petite bouche.
// Ce que l'état laisse sur lui (leo_tenues.js) : le sel, le sable, l'algue dans les boucles (la vague qui l'a posé sur sa
// planche), la boue de La Source, la pièce au coude, l'eau ; Bulle dans le bocal, ou le bocal vide (HISTOIRE.md : Bulle
// revient quand on écrit le Poisson).
// Trois vues (face, trois quarts avant, dos) ; c.miroir : la direction sera retournée par le jeu, ses marques passent de
// l'autre côté avant, pour retomber du bon côté de son corps (le nœud de corde à sa hanche droite, le bocal à sa hanche
// gauche, la pièce au coude gauche, l'algue à sa droite).
// Trois tenues (c.tenue) : cire (son ciré trop grand), pyjama (le pyjama rayé, assorti au bonnet de nuit : la nuit au
// camp), tricot (le pull que « Tatie » Agathe lui a tricoté, trop grand lui aussi).
const { P, E, L, clip, limb, r2, OUT, lerp, arm, bareFoot } = require('../troupe');
const ondin = require('../ondin');
const { EXPR, ALIAS, X, eye: oeilTroupe, brow, mouth, extras } = require('./visage');
// Son œil : celui de la refonte (visage.js), sans le petit trait de cil au coin extérieur (un garçon, comme Nathan et Robby)
const eye = (...a) => oeilTroupe(...a).replace(/<path d="M[-\d.]+,[-\d.]+ l-?0\.7,-0\.[56]" [^>]*\/>/g, '');
const { seam, suitOurlet } = require('./tissu');
const { fabriquerBras } = require('./lorena_bras');
const { jambe } = require('./membres');
const { capucheRabattue, reperes } = require('../avatar_accessoires');

const HY = 4.4; // la tête d'enfant : la même taille que les adultes, posée plus bas sur un corps plus court
const C = {
  skin: '#F5CFA8', skinS: '#E0AE86', lid: '#F1C7A0', under: '#D9A786', cheek: '#F29C94',
  eye: '#231B18', iris: '#3F7FB8', irisL: '#A6D4F2', eyeRx: 1.9, eyeRy: 2.55, brow: '#B8862E', browW: 0.75, mouth: '#7A3B30',
  hair: '#E2B45A', hairS: '#B98A3A', hairH: '#F6D58E', hairD: '#9C7230',
  coat: '#3D7CC9', coatS: '#2E5F9E', coatH: '#7DB0E8', lining: '#A9CBEF', rim: '#BFE6F6',
  cap: '#BFD3F2', capS: '#93AEDB', cream: '#F4EEDF', creamS: '#DCCDB5',
  pyj: '#9FC3E8', pyjS: '#7EA4CC', pyjStripe: '#F4EEDF', knit: '#C26B3A', knitS: '#994F27', knitH: '#DE8A55',
  rope: '#D8C08A', ropeS: '#B49A62', wood: '#A8743F', woodS: '#7E5530', bark: '#8A5E34', leaf: '#7BB661', leafS: '#5A9446',
  glass: '#D6ECF2', cork: '#B07E4C', water: '#A9DCFF', fish: '#F08A3E', fishS: '#C8642A',
  salt: '#FFF8E8', sand: '#E8D3A2', sandS: '#C9B07A', mud: '#7A5E40', weed: '#5E9A62', weedS: '#3F7646', patch: '#8FB4DE', cloth: '#E6D4AE'
};

// Les marques sur lui, réglées par l'état (leo_tenues.js) : sel, sable, boue (0 → 1) ; l'algue dans les boucles ; la pièce
// au coude du ciré ; trempé (wet) ; Bulle dans le bocal (bulle)
const MARKS = { salt: 0.6, sand: 0.8, dirt: 0.2, weed: true, patch: false, wet: false, bulle: false, wrist: false, pompon: 'entier' };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
// sa palette, et les noms que les manches attendent (lorena_bras.js : coat → le ciré, le pyjama ou le pull)
const pal = c => {
  const K = { ...C, ...(c.pal || {}) };
  const t = c.tenue || 'cire';
  const [m, mS, mH] = t === 'pyjama' ? [K.pyj, K.pyjS, K.pyj] : t === 'tricot' ? [K.knit, K.knitS, K.knitH] : [K.coat, K.coatS, K.coatH];
  return { ...K, coat: m, coatS: mS, coatH: mH, shirt: m, shirtS: mS };
};
const reflet = (axe, s, oui) => (oui ? `<g transform="translate(${r2(2 * axe)} 0) scale(-1 1)">${s}</g>` : s);

// Ses expressions : celles de la troupe refondue ; au repos, à moitié endormi : les paupières lourdes, le regard qui
// monte (il parle à la lune), les sourcils doux, une toute petite bouche ; réveillé d'un coup : les yeux grands ouverts
const EXPR_L = {
  ...EXPR,
  veille: X({ brow: [-0.35, 0.2, -0.55], lid: 0.34, tilt: -0.06, look: [0.15, -0.3], under: 0.35, mouth: 'soft' }),
  reveil: X({ brow: [-1.3, -1, -0.9], lid: 0, wide: true, look: [0, 0], under: 0.4, mouth: 'o' }),
  // le bâillement : les yeux fermés, la bouche grande ouverte (une bouche à lui, dessinée par tete)
  baille: X({ brow: [-0.8, 0.4, -0.3], mode: 'closed', under: 0.6, mouth: 'yawn' }),
  concentree: { ...EXPR.concentree, mouth: 'press' }
};

// ---- les objets ----
// La baguette de noisetier fourchue, tenue par une branche en h ; side 1 : la tige part à droite, -1 : à gauche ; rot :
// la pointe tourne autour de la main (degrés ; 0 : elle pend). L'écorce, les nœuds, une feuille encore accrochée.
function baguette(K, h, side = 1, rot = 0) {
  const j = [h[0] + side * 0.6, h[1] + 2.4], b = [h[0] + side * 3.2, h[1] + 0.6], tip = [h[0] + side * 1.4, h[1] + 9.4];
  const s = limb(h, j, 1.1, K.wood) + limb(j, b, 1.1, K.wood) + limb(j, tip, 1.25, K.wood)
    + L([j[0] - side * 0.15, j[1] + 2.2], [j[0] - side * 0.05, j[1] + 3.2], K.bark, 0.45) + L([tip[0] + side * 0.05, tip[1] - 2.6], [tip[0] + side * 0.15, tip[1] - 1.6], K.bark, 0.45)
    + E(j[0] + side * 0.35, j[1] + 4.6, 0.32, 0.32, K.bark, 0)
    + `<g transform="rotate(${side * -35} ${r2(b[0])} ${r2(b[1])})">${P(`M${r2(b[0])},${r2(b[1])} Q${r2(b[0] + side * 1.3)},${r2(b[1] - 1.1)} ${r2(b[0] + side * 2.6)},${r2(b[1])} Q${r2(b[0] + side * 1.3)},${r2(b[1] + 1.1)} ${r2(b[0])},${r2(b[1])} Z`, K.leaf, 0.55)}${L([b[0] + side * 0.3, b[1]], [b[0] + side * 2.1, b[1]], K.leafS, 0.35)}</g>`;
  return rot ? `<g transform="rotate(${rot} ${r2(h[0])} ${r2(h[1])})">${s}</g>` : s;
}
// Le bocal de Bulle : verre transparent (ce qui est derrière se voit au travers), bouchon de liège, sa ficelle ; Bulle,
// le petit poisson orange, quand il est revenu (un fond d'eau, une bulle qui monte)
function bocal(K, x, y, bulle) {
  const d = `M${r2(x - 1.6)},${r2(y - 1.6)} L${r2(x + 1.6)},${r2(y - 1.6)} Q${r2(x + 2.1)},${r2(y - 1.2)} ${r2(x + 2)},${y} L${r2(x + 1.9)},${r2(y + 1.9)} Q${x},${r2(y + 2.6)} ${r2(x - 1.9)},${r2(y + 1.9)} L${r2(x - 2)},${y} Q${r2(x - 2.1)},${r2(y - 1.2)} ${r2(x - 1.6)},${r2(y - 1.6)} Z`;
  let s = `<path d="${d}" fill="${K.glass}" fill-opacity="0.6"/>`;
  if (bulle) {
    // l'eau jusqu'aux deux tiers, Bulle qui nage (la queue en V, l'œil), une bulle au-dessus
    s += clip(`${x}b${y}`.replace(/\./g, ''), d, `<rect x="${r2(x - 2.2)}" y="${r2(y - 0.6)}" width="4.4" height="3.4" fill="${K.water}" opacity=".75"/>`
      + P(`M${r2(x - 1)},${r2(y + 0.9)} Q${r2(x - 0.1)},${r2(y + 0.1)} ${r2(x + 0.7)},${r2(y + 0.9)} Q${r2(x - 0.1)},${r2(y + 1.7)} ${r2(x - 1)},${r2(y + 0.9)} Z`, K.fish, 0.4)
      + P(`M${r2(x + 0.6)},${r2(y + 0.9)} L${r2(x + 1.4)},${r2(y + 0.4)} L${r2(x + 1.4)},${r2(y + 1.4)} Z`, K.fishS, 0.35) + E(x - 0.5, y + 0.8, 0.18, 0.18, OUT, 0))
      + E(x - 0.6, y - 0.9, 0.32, 0.32, '#FFFFFF', 0.25);
  }
  s += `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + `<path d="M${r2(x - 1.1)},${r2(y - 0.6)} L${r2(x - 1.1)},${r2(y + 1.3)}" stroke="#FFFFFF" stroke-width="0.6" stroke-linecap="round"/>`
    + `<rect x="${r2(x - 1.3)}" y="${r2(y - 2.8)}" width="2.6" height="1.3" rx="0.4" fill="${K.cork}" stroke="${OUT}" stroke-width="0.7"/>`
    + L([x - 1.5, y - 1.7], [x + 1.5, y - 1.7], K.ropeS, 0.45);
  return s;
}
// La corde : contour fin puis couleur, le long d'un chemin ; ses torons
const corde = (K, d, w = 1.1) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${r2(w + 1.4)}" stroke-linecap="round"/>`
  + `<path d="${d}" fill="none" stroke="${K.rope}" stroke-width="${w}" stroke-linecap="round"/>`
  + `<path d="${d}" fill="none" stroke="${K.ropeS}" stroke-width="${r2(w * 0.45)}" stroke-dasharray=".5 .9" stroke-linecap="round"/>`;
// Une goutte d'eau
const goutte = (x, y, r) => P(`M${r2(x)},${r2(y - r * 1.7)} Q${r2(x + r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y + r)} Q${r2(x - r * 1.5)},${r2(y + r * 0.2)} ${r2(x)},${r2(y - r * 1.7)} Z`, C.water, 0.6);

// ---- le corps ----
// Le ciré trop grand : il tombe jusqu'aux genoux, s'évase un peu (l'enfant flotte dedans) ; en marchant, le bas balance à
// peine (ctx.sway, comme le ciré de Lorena)
const forme = sw => `M15.6,37.4 Q24,35 32.4,37.4 L35.2,52.4 Q${r2(24 + sw)},55.2 12.8,52.4 Z`;
const ourlet = (off, sw = 0, amp = 0) => suitOurlet(12.8, 35.2, 52.4, 55.2 + sw * 0, off, amp);
// le pull de Tatie : plus court (mi-cuisse), resserré par ses côtes au bas
const PULL = sw => `M15.4,37.4 Q24,35.2 32.6,37.4 L33.6,50.4 Q${r2(24 + sw)},52.2 14.4,50.4 Z`;

function corps(c, ctx, K, M) {
  const view = ctx.view, u = c.uid, t = c.tenue || 'cire', mir = !!c.miroir, dos = view === 'ne';
  const k = view === 'se' ? -1.6 : 0, axe = 24 + k, o = 24 + k;
  const shadeX = view === 'se' ? 26.2 : 27.8;
  const sw = r2((ctx.sway || 0) * 0.3);
  if (t === 'tricot') return pull(c, ctx, K, M, k, sw);
  if (t === 'pyjama') return pyjama(c, ctx, K, M, k, sw);
  const COAT = forme(sw);
  // le ciré : l'ombre côté brume, le reflet du ciré (long et brillant), le liseré de brume, deux plis, le sel en auréoles
  // au bas, le sable collé, la boue de La Source
  let s = P(COAT, K.coat) + clip(`${u}c`, COAT, `<rect x="${shadeX}" y="34" width="10" height="22" fill="${K.coatS}"/>`
    + `<path d="${ourlet(1.6)} L36,57 L12,57 Z" fill="${K.coatS}"/>`
    + `<rect x="15" y="39" width="1.3" height="11" rx="0.65" fill="${K.coatH}"/><rect x="16.8" y="40.6" width="0.6" height="4" rx="0.3" fill="#FFFFFF" opacity=".55"/>`
    + `<rect x="34.4" y="40" width="1" height="12" fill="${K.rim}" opacity=".55"/>`
    + `<path d="M19.6,41 Q19,46.6 18,52.6 M29.2,41.4 Q29.8,47 30.6,53" fill="none" stroke="${OUT}" stroke-width="0.4" opacity=".28"/>`
    + (M.salt ? `<path d="${ourlet(2.3, 0, 0.22)}" fill="none" stroke="${K.salt}" stroke-width="0.7" opacity="${r2(0.75 * M.salt)}"/><path d="${ourlet(4.6, 0, 0.3)}" fill="none" stroke="${K.salt}" stroke-width="0.5" opacity="${r2(0.4 * M.salt)}"/>` : '')
    + (M.sand ? [[17.6, 52.6, 1.4], [22.8, 53.8, 1], [30.4, 53, 1.2]].map(([x, y, r]) => E(x + k, y, r, r * 0.45, K.sand, 0).replace('/>', ` opacity="${r2(0.8 * M.sand)}"/>`)).join('') : '')
    + (M.dirt ? `<path d="${ourlet(2.2, 0, 0.18)} L36,57 L12,57 Z" fill="${K.mud}" opacity="${r2(0.3 * M.dirt)}"/>` : '')) + P(COAT, 'none');
  if (dos) {
    // de dos : l'empiècement, la couture du milieu, la capuche rabattue sur les épaules, la ceinture de corde, le nœud
    // dans le dos (à sa droite : à droite de l'écran)
    s += `<path d="M15.8,40.4 Q24,42 32.2,40.4" fill="none" stroke="${OUT}" stroke-width="0.5" opacity=".45"/>` + P('M24,41.6 L24,54.6', 'none', 0.7);
    s += capucheRabattue(u, 'ne', reperes(c), K.coat, K.coatS);
    s += corde(K, 'M13.9,46.6 Q24,48.8 34.1,46.6');
    return s + mouille(M, 54.6, ctx);
  }
  // le grand col rabattu (le dessous du ciré, plus sombre), l'ouverture, les deux chevilles de bois et leurs ganses
  s += P(`M${17 + k},37.2 Q${21 + k},37.2 ${24 + k},40.4 L${20.4 + k},42.2 Q${17.6 + k},40.4 ${17 + k},37.2 Z`, K.coatS, 0.8)
    + P(`M${31 + k},37.2 Q${27 + k},37.2 ${24 + k},40.4 L${27.6 + k},42.2 Q${30.4 + k},40.4 ${31 + k},37.2 Z`, K.coatS, 0.8)
    + L([18.6 + k, 38.2], [20.4 + k, 39.6], K.coatH, 0.45);
  const pente = view === 'se' ? -0.6 : 0;
  s += P(`M${o},40.2 L${r2(o + pente)},54.8`, 'none', 0.9);
  for (const y of [43.2, 49.6]) {
    const x = o + pente * (y - 40) / 14;
    s += L([x - 1.6, y], [x + 0.6, y], K.ropeS, 0.6) + `<rect x="${r2(x + 0.2)}" y="${r2(y - 0.55)}" width="2.6" height="1.1" rx="0.55" fill="${K.wood}" stroke="${OUT}" stroke-width="0.5"/>` + L([x + 0.6, y - 0.2], [x + 2.2, y - 0.2], '#C99A62', 0.3);
  }
  // la pièce cousue sur le pan droit (à gauche de l'écran), quand on l'a rafistolé au camp
  if (M.patch) s += reflet(axe, P(`M${15.6 + k},48.6 L${19.4 + k},48.4 L${19.6 + k},51.8 L${15.8 + k},52 Z`, K.patch, 0.55) + seam(`M${16.1 + k},49.1 L${18.9 + k},48.95 L${19.05 + k},51.3 L${16.3 + k},51.45 Z`, 0.35), mir);
  // la grande poche plaquée, sur son flanc gauche (à droite de l'écran), et son rabat
  s += reflet(axe, P(`M${28.6 + k},48.6 L${32.8 + k},48.4 L${33.4 + k},52.6 Q${31 + k},53.4 ${29 + k},52.8 Z`, K.coat, 0.6) + P(`M${28.4 + k},48.4 L${33 + k},48.2 L${33.1 + k},49.8 L${28.6 + k},50 Z`, K.coatS, 0.55), mir);
  // la ceinture de corde, nouée à sa hanche droite (à gauche de l'écran), les deux bouts qui pendent ; le bocal de Bulle
  // pendu à sa hanche gauche
  s += corde(K, 'M13.9,45.8 Q24,47.8 34.1,45.8');
  s += reflet(axe, corde(K, `M${20.2 + k},47 L${19.2 + k},50.2`, 0.8) + corde(K, `M${20.8 + k},47 L${21.6 + k},49.8`, 0.8) + E(20.5 + k, 46.9, 1.15, 0.95, K.rope, 0.7) + L([19.9 + k, 46.6], [21.1 + k, 47.2], K.ropeS, 0.4)
    + (c.geste === 'bulle' ? '' : L([27.8 + k, 47.2], [27.8 + k, 48.6], OUT, 0.6) + bocal(K, 27.8 + k, 50.8, M.bulle)), mir);
  return s + mouille(M, 54.6, ctx);
}
// Le pyjama rayé : la veste boutonnée, son petit col, les rayures qui suivent le corps ; le pantalon (ses jambes, c.leg)
function pyjama(c, ctx, K, M, k, sw) {
  const u = c.uid, dos = ctx.view === 'ne', o = 24 + k;
  const VESTE = `M15.6,37.4 Q24,35.2 32.4,37.4 L33.4,49.6 Q${r2(24 + sw)},51.2 14.6,49.6 Z`;
  const raies = [16.6, 19.4, 22.2, 25, 27.8, 30.6, 33.4].map(x => `<path d="M${r2(x + k * 0.4)},36 Q${r2(x + (x - 24) * 0.06 + k * 0.4)},43 ${r2(x + (x - 24) * 0.12 + k * 0.4)},51" fill="none" stroke="${K.pyjStripe}" stroke-width="1"/>`).join('');
  let s = P(VESTE, K.pyj) + clip(`${u}pj`, VESTE, raies + `<rect x="${ctx.view === 'se' ? 26.2 : 27.8}" y="34" width="10" height="20" fill="${K.pyjS}" opacity=".55"/>`
    + `<rect x="15.2" y="39" width="1.1" height="9" rx="0.55" fill="#FFFFFF" opacity=".35"/>`
    + (M.sand ? E(18 + k, 48.8, 1.3, 0.5, K.sand, 0).replace('/>', ` opacity="${r2(0.6 * M.sand)}"/>`) : '')) + P(VESTE, 'none');
  if (dos) return s + P('M24,38 L24,50.6', 'none', 0.5) + mouille(M, 50.8, ctx);
  // le petit col rond, la patte et trois boutons de nacre ; la poche de poitrine
  s += P(`M${19.4 + k},37 Q${21.8 + k},38.6 ${24 + k},38.4 L${23 + k},40.2 Q${20.6 + k},39.6 ${19.4 + k},37 Z`, K.pyjStripe, 0.6)
    + P(`M${28.6 + k},37 Q${26.2 + k},38.6 ${24 + k},38.4 L${25 + k},40.2 Q${27.4 + k},39.6 ${28.6 + k},37 Z`, K.pyjStripe, 0.6)
    + P(`M${o},39.6 L${o},50.4`, 'none', 0.6);
  for (const y of [42, 45.2, 48.4]) s += E(o + 0.9, y, 0.5, 0.5, '#F7F2E6', 0.35);
  s += reflet(24 + k, P(`M${28.2 + k},40.6 L${31.2 + k},40.4 L${31.4 + k},43.2 L${28.4 + k},43.4 Z`, K.pyj, 0.5) + L([28.2 + k, 40.6], [31.2 + k, 40.4], K.pyjStripe, 0.5), !!c.miroir);
  return s + mouille(M, 50.8, ctx);
}
// Le pull que Tatie lui a tricoté : trop grand, des côtes au col et au bas, les mailles en V, une reprise à la laine
// d'une autre couleur (la pièce) ; le bocal pend à sa ceinture de corde, par-dessus
function pull(c, ctx, K, M, k, sw) {
  const u = c.uid, dos = ctx.view === 'ne', mir = !!c.miroir, axe = 24 + k;
  const PL = PULL(sw);
  const mailles = [39.6, 42.2, 44.8, 47.4].map(y => [16.6, 19.4, 22.2, 25, 27.8, 30.6].map(x => `<path d="M${r2(x - 0.6 + k)},${r2(y - 0.45)} L${r2(x + k)},${r2(y + 0.35)} L${r2(x + 0.6 + k)},${r2(y - 0.45)}" fill="none" stroke="${K.knitS}" stroke-width="0.32" opacity=".75"/>`).join('')).join('');
  let s = P(PL, K.knit) + clip(`${u}tr`, PL, mailles + `<rect x="${ctx.view === 'se' ? 26.2 : 27.8}" y="34" width="10" height="20" fill="${K.knitS}" opacity=".7"/>`
    + `<rect x="15.2" y="39" width="1.2" height="9" rx="0.6" fill="${K.knitH}" opacity=".8"/>`
    + `<path d="M14,48.6 Q24,50.4 34,48.6 L34,53 L14,53 Z" fill="${K.knitS}"/>` + [15.6, 17.6, 19.6, 21.6, 23.6, 25.6, 27.6, 29.6, 31.6].map(x => L([x + k * 0.3, 49.2 + Math.abs(x - 24) * -0.02], [x + k * 0.3, 51.6], K.knit, 0.5)).join('')
    + (M.sand ? E(19 + k, 49.6, 1.3, 0.5, K.sand, 0).replace('/>', ` opacity="${r2(0.6 * M.sand)}"/>`) : '')) + P(PL, 'none');
  // le col roulé de côtes, au ras du cou
  s += P(`M18.6,36.4 Q24,34.6 29.4,36.4 L29,38.4 Q24,36.8 19,38.4 Z`, K.knitS, 0.7) + [20, 22, 24, 26, 28].map(x => L([x, 36.4 - (1 - Math.abs(x - 24) / 6) * 0.6], [x, 37.8 - (1 - Math.abs(x - 24) / 6) * 0.6], K.knit, 0.45)).join('');
  if (dos) return s + mouille(M, 51.4, ctx);
  // la reprise de Tatie, sur son flanc gauche (à droite de l'écran), à la laine crème
  if (M.patch) s += reflet(axe, P(`M${29 + k},42.4 L${31.6 + k},42.2 L${31.8 + k},44.8 L${29.2 + k},45 Z`, K.cream, 0.5) + [42.9, 43.7, 44.4].map(y => L([29.3 + k, y], [31.5 + k, y - 0.1], K.creamS, 0.35)).join(''), mir);
  // la ceinture de corde et le bocal, par-dessus le pull (il ne s'en sépare jamais)
  s += corde(K, 'M14.4,46.6 Q24,48.4 33.6,46.6') + (c.geste === 'bulle' ? '' : reflet(axe, L([27.8 + k, 47.6], [27.8 + k, 48.8], OUT, 0.6) + bocal(K, 27.8 + k, 51, M.bulle), mir));
  return s + mouille(M, 51.4, ctx);
}
// trempé : des gouttes tombent du bas du vêtement, en continu ; debout seulement
const mouille = (M, hy, ctx) => (M.wet && !ctx.seatDy ? [[15.6, 0], [24.4, 0.55], [32.4, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r2(hy + 1)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r2(hy + 1)};${r2(hy + 6)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join('') : '');

// Les bras : les manches de la refonte (lorena_bras.js) ; le ciré a les manches retroussées (c.sleeves 'roll'), le
// pyjama descend au poignet, le pull aussi
const bras = fabriquerBras({ pal, marks });

// Le pied nu : le sable collé aux orteils, la boue de La Source ; le bas du pyjama (son revers rayé, à la cheville)
function pied(c, x, y, dir, tilt) {
  const M = marks(c), K = pal(c);
  let s = bareFoot(c, x, y, dir, tilt);
  if (c.tenue === 'pyjama') s = `<rect x="${r2(x - c.legW / 2 - 0.2)}" y="${r2(y - 1.6)}" width="${r2(c.legW + 0.4)}" height="1.4" fill="${K.pyjStripe}" stroke="${OUT}" stroke-width="0.4"/>` + s;
  if (M.sand) s += [[-1.4, 4.2, 0.9], [0.8, 4.4, 0.7], [1.8, 3.6, 0.5]].map(([dx, dy, r]) => E(x + dx, y + dy, r, r * 0.55, K.sand, 0).replace('/>', ` opacity="${r2(0.85 * M.sand)}"/>`)).join('');
  if (M.dirt) s += E(x - 0.6, y + 3.9, 1.8, 0.75, K.mud, 0).replace('/>', ` opacity="${r2(0.7 * M.dirt)}"/>`);
  return s;
}

// ---- la tête ----
// La géométrie du visage selon la vue (de trois quarts : construit comme Nathan et Robby, autour de l'axe du visage)
const VUES = {
  front: { X: x => x, rk: [1, 1], k: 0, axe: 24, fx: 24, rx: 11.6 },
  se: { X: x => r2(21 + (x - 24) * (x < 24 ? 0.86 : 0.98)), rk: [0.86, 1], k: -1.4, axe: 21, fx: 22.6, rx: 11.2 }
};
const decaler = (d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);

// Le bonnet de nuit rayé : la pointe retombe à droite de l'écran, le pompon au bout ; les rayures crème suivent le
// cône ; le revers côtelé ; la pointe et le pompon se balancent doucement (il dort à moitié, même debout)
const CAP = 'M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.4,13.6 Q30,11.4 24,11.6 Q17,11.6 12,13.8 Z';
const CAP_DOS = 'M12,13.8 Q12.6,4.6 23.4,3.8 Q34.4,3.2 39.6,10.8 Q42.8,16 41.8,23.4 Q40.2,17 36.8,14.6 Q24,18 11.2,14.6 Q11.4,14.1 12,13.8 Z';
function bonnet(K, id, d = CAP, arrache = false) {
  const raies = [[19, 4.2], [25.6, 3.6], [31.6, 5], [36.8, 9.2]].map(([x, y], i) => `<path d="M${x},${y} Q${r2(x - 3.6 + i * 1.6)},${r2(y + 5)} ${r2(x - 6.4 + i * 3.4)},${r2(13 + i * 0.4)} L${r2(x - 4.4 + i * 3.4)},${r2(13.4 + i * 0.4)} Q${r2(x - 1.6 + i * 1.6)},${r2(y + 5)} ${r2(x + 2.2)},${r2(y - 0.2)} Z" fill="${K.cream}"/>`).join('')
    + '<path d="M38.6,13.4 Q40.8,17.6 40.6,21.6 L41.6,21.4 Q41.8,17 39.8,12.8 Z" fill="' + K.cream + '"/>';
  const pompon = E(41.6, 24.4, 2.2, 2.2, K.cream) + [[0, -1.6], [1.5, -0.6], [1.2, 1.3], [-1.3, 1.1], [-1.6, -0.7]].map(([dx, dy]) => E(41.6 + dx * 0.9, 24.4 + dy * 0.9, 0.55, 0.45, K.creamS, 0)).join('') + E(41, 23.6, 0.6, 0.5, '#FFFFFF', 0);
  const balance = '<animateTransform attributeName="transform" type="rotate" dur="2.6s" repeatCount="indefinite" values="0 37 13;3.5 37 13;0 37 13" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>';
  return P(d, K.cap) + clip(`${id}k`, d, `<rect x="8" y="0" width="38" height="26" fill="${K.capS}"/><ellipse cx="22" cy="5.6" rx="17" ry="9.4" fill="${K.cap}"/>${raies}`
    + '<path d="M14.6,10.6 Q18.6,6.4 24.6,5.6" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity=".55"/>') + P(d, 'none')
    + (arrache ? pendu(K) : `<g>${balance}${pompon}</g>`);
}
// naufragé : le bout du bonnet arraché, le pompon pend au bout d'un fil, et se balance
function pendu(K) {
  const balance = '<animateTransform attributeName="transform" type="rotate" dur="2.2s" repeatCount="indefinite" values="-4 41.8 23.4;5 41.8 23.4;-4 41.8 23.4" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>';
  return L([41, 23.6], [42.6, 23.9], OUT, 0.5) + L([41.4, 23.2], [41.2, 24.4], OUT, 0.4)
    + `<g>${balance}<path d="M41.8,23.4 Q42.6,25.6 42.4,27.8" fill="none" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>${E(42.4, 29.6, 2, 2, K.cream)}${E(42.9, 30.3, 0.75, 0.65, K.creamS, 0)}</g>`;
}
// le revers côtelé du bonnet, sur le front (de face) ou autour du crâne (de dos)
const revers = (K, d, nb = 9, y0 = 11.6, y1 = 14.2) => P(d, K.cream, 0.9) + Array.from({ length: nb }, (_, i) => 14.4 + i * (19.2 / (nb - 1))).map(x => L([x, y0 + 0.5 + Math.abs(x - 24) * 0.06], [x, y1 - 0.5 + Math.abs(x - 24) * 0.04], K.creamS, 0.28)).join('');

// les boucles blondes : la frange en boucles sous le revers, les mèches qui s'échappent sur les côtés, les vrilles
const FRANGE = 'M12,19.4 Q11.8,12.4 24,12.2 Q36.2,12.4 36,19.4 Q34.6,16.4 32.4,16.6 Q31.6,18.6 29.2,18.2 Q28.4,15.8 26,16.2 Q24.6,17.8 22.4,17 Q21.2,15.6 19.2,16.6 Q18.4,18.6 16,18 Q14.4,16.4 12,19.4 Z';
function vrilles(K, pts) {
  return pts.map(([x, y, k]) => `<path d="M${r2(x)},${r2(y)} q${r2(k * 0.9)},-0.9 ${r2(k * 1.6)},0.1 q${r2(k * 0.4)},0.9 ${r2(-k * 0.5)},1.1" fill="none" stroke="${K.hairS}" stroke-width="0.5" stroke-linecap="round"/>`).join('');
}
// l'algue prise dans les boucles (la vague qui l'a posé sur sa planche) : un ruban vert qui pend, sur sa droite
const algue = K => P('M11.6,17.6 Q9.4,19.4 10.4,21.6 Q9,23.4 10.2,25.4 Q9.4,27 10.6,28.6 Q11.4,27.4 11.2,26.2 Q12.4,24.6 11.4,23 Q12.6,21.2 11.6,19.8 Q12.8,18.8 12.6,17.8 Z', K.weed, 0.6)
  + `<path d="M11.2,18.6 Q10.4,20.4 11,22.4 Q10.2,24.2 10.8,26.4" fill="none" stroke="${K.weedS}" stroke-width="0.4"/>` + E(10.6, 21.4, 0.45, 0.3, '#9CCB8E', 0);

function tete(c, ctx) {
  const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
  if (ctx.view === 'ne') return `<g transform="translate(0 ${HY})">${teteDeDos(c, ctx, K, M, mir, id)}</g>`;
  const V = VUES[ctx.view] || VUES.front, Xv = V.X, k = V.k, se = ctx.view === 'se';
  const name = ALIAS[ctx.expr] || ctx.expr;
  const ex = ctx.blink && name === 'veille' ? EXPR_L.cligne : EXPR_L[name] || EXPR_L.veille;
  const face = `M${V.fx - V.rx},21.6 a${V.rx},10.4 0 1,0 ${2 * V.rx},0 a${V.rx},10.4 0 1,0 ${-2 * V.rx},0 Z`;
  let s = '';
  // derrière : la masse des boucles (jusqu'au bas des oreilles), les mèches qui s'échappent sur les côtés
  const back = se ? 'M12,21.6 Q10.6,10.6 24,10.4 Q38.2,10.6 37.4,21.6 Q37.8,25.8 36.2,27.6 Q35,28.6 34.2,27.4 L14,27.2 Q12.2,26.4 12,21.6 Z'
    : 'M11.4,21 Q10.6,11 24,10.6 Q37.4,11 36.6,21 Q37.2,25.4 35.6,27 Q34.4,28.2 33.4,26.8 L14.6,26.8 Q13.6,28.2 12.4,27 Q10.8,25.4 11.4,21 Z';
  s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="24.2" width="32" height="6" fill="${K.hairS}"/>` + vrilles(K, [[12.6, 24.8, 1], [34.4, 24.8, -1]])) + P(back, 'none');
  if (!se) s += P('M11.8,17.4 Q8.2,18.4 8.8,21.6 Q9.6,23.2 11.2,22.6 Q10.4,20.6 11.8,19.8 Z', K.hair, 0.8);
  s += P(decaler('M36.2,17.4 Q39.8,18.4 39.2,21.6 Q38.4,23.2 36.8,22.6 Q37.6,20.6 36.2,19.8 Z', k), K.hair, 0.8);
  // l'oreille de trois quarts (de face, les boucles les couvrent)
  if (se) s += E(35, 23.6, 1.5, 2.1, K.skin) + P('M35.3,22.5 Q34.5,23.6 35.2,24.7', 'none', 0.45);
  // le visage : l'ombre de la frange, les joues roses d'enfant, le contre-jour
  s += P(face, K.skin) + clip(`${id}f`, face, `<path d="${decaler(FRANGE, k)}" fill="${K.skinS}" transform="translate(0 1.4)"/>`
    + `<g transform="translate(${k} 0)"><path d="M33.4,14 Q36.6,21.6 32.6,31.2 L37,31.2 L37,14 Z" fill="${K.rim}" opacity=".35"/></g>`
    + E(Xv(16.4), 26.6, 2.2 * V.rk[0], 1.25, K.cheek, 0).replace('/>', ' opacity=".55"/>') + E(Xv(31.6), 26.6, 2.2 * V.rk[1], 1.25, K.cheek, 0).replace('/>', ' opacity=".55"/>')
    + (M.salt ? E(Xv(30.6), 23.2, 0.9, 0.4, K.salt, 0).replace('/>', ` opacity="${r2(0.6 * M.salt)}"/>`) : '')) + P(face, 'none');
  // la frange de boucles, ses reflets, ses vrilles ; l'algue prise dans les boucles
  const frange = decaler(FRANGE, k);
  s += P(frange, K.hair) + clip(`${id}fr`, frange, L([15.8 + k, 14.8], [21 + k, 13.9], K.hairH, 1) + L([26.4 + k, 13.8], [30.8 + k, 14.6], K.hairH, 0.7)
    + vrilles(K, [[17.2 + k, 16.6, 1], [23 + k, 15.8, 1], [28 + k, 16.2, -1], [32.6 + k, 16.8, -1]])) + P(frange, 'none');
  // (de trois quarts, le bord du visage rentre : l'algue reste prise dans les boucles, au bord de la joue)
  if (M.weed) s += reflet(24, `<g transform="translate(${se ? 1.4 : 0} 0)">${algue(K)}</g>`, mir);
  // le bonnet de nuit et son revers
  s += c.coiffe ? c.coiffe(c, ctx, 'tete') : `<g transform="translate(${k} 0)">${bonnet(K, id, CAP, M.pompon === 'arrache')}${revers(K, 'M11.6,13 Q24,8.6 36.4,13 L36.6,15.2 Q24,10.8 11.4,15.2 Z', 9, 10.6, 13.6)}</g>`;
  // les yeux d'enfant (grands, l'iris bleu d'eau), les sourcils clairs et fins, le nez bouton, la petite bouche
  s += eye(`${id}e0`, Xv(19.4), 23.3, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 23.3, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
  s += brow(Xv(19.4), 19.6, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 19.6, -1, ex.browR || ex.brow, false, V.rk[1], K);
  const nx = se ? V.axe - 0.4 : 24;
  s += P(`M${r2(nx - 0.7)},26 Q${nx},26.6 ${r2(nx + 0.7)},26`, 'none', 0.5) + E(nx - 0.3, 25.3, 0.35, 0.25, '#FFFFFF', 0).replace('/>', ' opacity=".6"/>');
  s += ex.mouth === 'yawn' ? P(`M${r2(V.axe - 1.4)},28.4 Q${V.axe},26.8 ${r2(V.axe + 1.4)},28.4 Q${r2(V.axe + 1.5)},31.6 ${V.axe},31.8 Q${r2(V.axe - 1.5)},31.6 ${r2(V.axe - 1.4)},28.4 Z`, K.mouth, 0.8) + E(V.axe, 30.6, 0.9, 0.6, '#D9786C', 0) : mouth(ex.mouth, V.axe, 27.8, `${id}m`, K);
  s += extras(ex.extras, ctx.n % 2, Xv);
  if (M.wet) s += gouttes(mir);
  return `<g transform="translate(0 ${HY})">${s}</g>`;
}
// trempé : deux gouttes tombent du bout des boucles
const gouttes = mir => reflet(24, [[13.2, 27.6, 0], [35.6, 27.6, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 5}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(''), mir);

// La tête de dos : les boucles descendent sur la nuque (en pointes rondes), les oreilles, le bonnet vu de dos (la pointe
// et le pompon retombent à gauche de l'écran), son revers qui fait le tour du crâne
function teteDeDos(c, ctx, K, M, mir, id) {
  const back = 'M11,21 Q10,8.6 24,8.4 Q38,8.6 37,21 Q37.4,28 36,31 Q35.6,33.4 34,32.2 Q33.2,34.4 31.4,32.8 Q30.2,34.6 28.6,32.8 Q27.4,34.2 26,32.6 Q25,30 24,29.6 Q23,30 22,32.6 Q20.6,34.2 19.4,32.8 Q17.8,34.6 16.6,32.8 Q14.8,34.4 14,32.2 Q12.4,33.4 12,31 Q10.6,28 11,21 Z';
  let s = E(12.6, 23, 1.6, 2.2, K.skin) + E(35.4, 23, 1.6, 2.2, K.skin);
  s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="6" width="34" height="30" fill="${K.hairS}"/><ellipse cx="22.4" cy="19.4" rx="13.8" ry="12" fill="${K.hair}"/>`
    + vrilles(K, [[15, 26.6, 1], [19.6, 28.2, 1], [26.6, 28.2, -1], [31.4, 26.6, -1], [17.4, 21.6, 1], [29.6, 21.6, -1]]) + L([14.6, 17.4], [16.4, 22.6], K.hairH, 0.8)) + P(back, 'none');
  s += P('M18.4,19 Q17.8,25.4 19.2,31.4', 'none', 0.5) + P('M28.8,19 Q29.8,25.4 28.6,31.4', 'none', 0.5);
  // (l'algue, à sa droite : de dos, à droite de l'écran)
  if (M.weed) s += reflet(24, `<g transform="translate(48 0) scale(-1 1)">${algue(K)}</g>`, mir);
  s += c.coiffe ? c.coiffe(c, ctx, 'tete')
    : `<g transform="translate(48 0) scale(-1 1)">${bonnet(K, id, CAP_DOS, M.pompon === 'arrache')}</g>` + revers(K, 'M11.2,13.4 Q24,16.8 36.8,13.4 L37,15.6 Q24,19 11,15.6 Z', 9, 13.6, 16.6);
  if (M.wet) s += gouttes(!mir);
  const ex = EXPR_L[ALIAS[ctx.expr] || ctx.expr] || EXPR_L.veille;
  return s + extras(ex.extras, ctx.n % 2, v => v, true);
}

const leo = {
  ...ondin,
  name: 'Léo', uid: 'le',
  teintes: [C.hair, C.coat, C.cap, C.lining],
  sleeve: C.coat, cuff: null, sleeves: 'roll',
  foot: pied,
  // ses jambes : la cuisse et le tibia (membres.js), nues sous le ciré
  jambeOs: jambe, // (les jambes à deux os, membres.js : troupe.leg passe par c.jambeOs ; c.jambe, lui, dit la règle de jambe.js)
  bras,
  // la baguette ne quitte pas sa main droite (repos et marche)
  hold(c, h) { return baguette(pal(c), h, 1); },

  // derrière le corps : la capuche rabattue de son ciré, qui dépasse derrière le cou (de face, de trois quarts)
  backItems(c, ctx) {
    const K = pal(c);
    if (ctx.view === 'ne' || (c.tenue || 'cire') !== 'cire') return '';
    return capucheRabattue(c.uid, ctx.view, reperes(c), K.coat, K.coatS);
  },

  // de dos : la nuque, rentrée sous le col (dans l'ombre des boucles)
  neck(c, ctx) {
    if (ctx.view !== 'ne') return '';
    return P('M19.8,30.4 L28.2,30.4 L28.4,36.55 Q24,35.85 19.6,36.55 Z', C.skinS, 0) + P('M19.6,36.55 Q24,35.85 28.4,36.55', 'none');
  },

  body(c, ctx) {
    return corps(c, ctx, pal(c), marks(c));
  },

  head(c, ctx) {
    return tete(c, ctx);
  },

  // le salut : il agite la main droite (la baguette passe dans la gauche), réveillé un instant ; l'action : la
  // sourcellerie (leo_gestes.js)
  pose(ctx) {
    const { pose, k } = ctx;
    if (pose === 'salut') {
      const [a, b] = this.shoulders;
      const h = lerp([r2(b[0] + 5.2), r2(b[1] - 7.8)], [r2(b[0] + 6.6), r2(b[1] - 7.2)], k);
      return { expr: 'sourire', left: baguette(pal(this), this.hands[0], -1) + arm(this, a, this.hands[0]), right: arm(this, b, h, [r2(b[0] + 5.6), r2(b[1] - 1)]) };
    }
    return require('./leo_gestes').GESTES.sourcier.call(this, ctx);
  }
};

module.exports = { leo, C, MARKS, EXPR: EXPR_L, pal, marks, reflet, baguette, bocal, corde, goutte, HY };
