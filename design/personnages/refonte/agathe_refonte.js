// Agathe (anciennement Marcelle ; fichiers du jeu : cannelle), la cuisinière-guérisseuse, refonte : le même personnage,
// le même cadre 48 × 64, le même trait et le même kit (troupe.js), poussé plus loin, comme Lorena.
// Grande et ronde, chignon gris piqué d'une cuillère, robe cannelle, tablier, grande louche de cuivre en bandoulière, joues
// rouges, petit nez. Yeux bruns à paupière lourde, les rides de son âge ; au repos, soucieuse (elle pense à Pierrot), le
// sourire devient rare. Ce que l'état laisse sur elle (agathe_tenues.js) : la suie du feu, le sel, la farine, la boue, le
// chignon défait, le tablier déchiré ou recousu, l'eau.
// Trois vues (face, trois quarts avant, dos) ; c.miroir : la direction sera retournée par le jeu, ses marques passent de
// l'autre côté avant, pour retomber du bon côté de son corps (la cuillère du chignon et la louche à sa gauche, la suie sur
// sa joue droite).
// Trois tenues (c.tenue) : robe (la robe et son tablier), cuisine (le grand tablier à bavette, liseré à carreaux, un
// torchon à la ceinture), laine (un gilet de laine sur la robe, sous le tablier).
const { P, E, L, clip, limb, arm, shoe, dechirure, r2, OUT } = require('../troupe');
const cannelle = require('../cannelle');
const { EXPR, ALIAS, X, eye, brow, mouth, extras, wind, rides } = require('./visage');
const { seam, suitOurlet } = require('./tissu');
const { fabriquerBras } = require('./lorena_bras');

const C = {
  skin: '#E9B98F', skinS: '#C99472', lid: '#E0AC84', under: '#B98A78', nose: '#B97A58',
  hair: '#D9D4CC', hairS: '#A9A39A', hairH: '#F5F2EC', brow: '#5E554C', browW: 0.7, rim: '#9FE3DA',
  eye: '#2A1F1A', iris: '#7A5634', irisL: '#C9A06A', eyeRx: 1.75, eyeRy: 2.3,
  dress: '#A8553A', dressS: '#84402B', dressH: '#C46E4E',
  apron: '#F2E6D2', apronS: '#D8C8AE', stain: '#C9A27A', soot: '#4A4440', salt: '#FFF8E8', flour: '#FFFFFF', mud: '#6B5138',
  check: '#C8463A', towel: '#D9E4EE', towelS: '#4F78A6', patch: '#8D7A5A',
  wool: '#B9A57E', woolS: '#8E7B57', woolH: '#D8C8A0', wood: '#8A5A36',
  copper: '#C27C45', copperS: '#8F5530', copperH: '#EAA46C',
  strap: '#6B4226', strapS: '#4E2F1A', spoon: '#C9CED6', spoonS: '#9AA2AD',
  herb: '#6E9A4A', herbS: '#4E7434',
  cheek: '#EE8C80', mouth: '#7A3B30', cloth: '#E6D4AE', clothS: '#B8A27A'
};

// Les marques sur elle, réglées par l'état (agathe_tenues.js) : suie, sel, farine, boue (0 → 1) ; le tablier (torn :
// déchiré, mended : recousu, clean : net) ; le chignon défait (wisps) ; le brin d'herbes ; trempée (wet)
const MARKS = { soot: 1, salt: 1, flour: 0, dirt: 0, apron: 'torn', wisps: true, herbs: true, wrist: false, wet: false };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
// sa palette, et les noms que les manches attendent (lorena_bras.js : coat → la robe ; en laine, le gilet)
const pal = c => {
  const K = { ...C, ...(c.pal || {}) };
  const laine = c.tenue === 'laine';
  return { ...K, coat: laine ? K.wool : K.dress, coatS: laine ? K.woolS : K.dressS, coatH: laine ? K.woolH : K.dressH, shirt: K.apron, shirtS: K.apronS, brass: K.copper };
};
// reflet : pour les directions retournées, ses marques passent de l'autre côté de l'axe (puis le jeu retourne l'image)
const reflet = (axe, s, oui) => (oui ? `<g transform="translate(${r2(2 * axe)} 0) scale(-1 1)">${s}</g>` : s);

// Ses expressions : celles de la troupe refondue ; au repos, soucieuse (les sourcils remontent au milieu, la bouche
// serrée, le regard un peu bas)
const EXPR_A = { ...EXPR, veille: X({ brow: [-1, 0.4, -0.6], lid: 0.24, tilt: -0.1, look: [0, 0.3], under: 0.55, mouth: 'press' }) };

// La louche de cuivre, cabossée : manche de a à b, cuilleron en b ; une bosse claire sur le cuilleron
function louche(K, a, b, tilt = 0) {
  return limb(a, b, 1.5, K.copper) + L([a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1], [a[0] + (b[0] - a[0]) * 0.8, a[1] + (b[1] - a[1]) * 0.8], K.copperH, 0.5)
    + `<g transform="rotate(${tilt} ${r2(b[0])} ${r2(b[1])})">${E(b[0], b[1], 3.3, 2.6, K.copper)}${E(b[0], b[1] - 0.5, 2.3, 1.4, K.copperS, 0)}${E(b[0] - 1.2, b[1] + 0.9, 0.8, 0.45, K.copperH, 0)}`
    + `<path d="M${r2(b[0] + 1.2)},${r2(b[1] + 1.4)} q0.8,-0.2 1.1,-1" fill="none" stroke="${K.copperS}" stroke-width="0.5"/></g>`;
}
// La robe en cloche ; sway : le bas qui balance en marchant
const DRESS = sway => `M15.2,33 Q24,30.2 32.8,33 Q${r2(37 + sway)},42 ${r2(37.6 + sway)},53.6 Q${r2(24 + sway)},57.2 ${r2(10.4 + sway)},53.6 Q${r2(11 + sway)},42 15.2,33 Z`;
// Le bas déchiré du tablier, de droite à gauche ; en miroir, ses lambeaux passent de l'autre côté (le même tracé lu à
// l'envers) : rend { d, tips }
function basDechire(xr, xl, y, qx, qy, seed, mir) {
  if (!mir) return dechirure([xr, y], [qx, qy], [xl, y], seed);
  const m = dechirure([xl, y], [qx, qy], [xr, y], seed);
  const pts = m.d.split('L').map(s => s.trim()).filter(Boolean);
  pts.pop(); // le dernier point est le bout droit, déjà dessiné
  return { d: [...pts.reverse(), `${xl},${y}`].map(p => `L${p}`).join(' '), tips: m.tips };
}
// Une bande à carreaux (le liseré du tablier de cuisine) le long d'un tracé
const carreaux = (d, K) => `<path d="${d}" fill="none" stroke="${K.check}" stroke-width="1.5"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray=".75 .75"/><path d="${d}" fill="none" stroke="${K.check}" stroke-width="0.5" opacity=".6"/>`;

// Le corps selon la vue : la robe (ou le gilet de laine), le tablier, la bandoulière
function corps(c, ctx, K, M) {
  const view = ctx.view, u = c.uid, t = c.tenue || 'robe', mir = !!c.miroir, dos = view === 'ne';
  const sway = ctx.walk ? ctx.ph * 0.7 : 0;
  const k = view === 'se' ? -2 : 0, axe = 24 + k; // le milieu du devant (de trois quarts, il glisse vers la gauche)
  const d = DRESS(sway);
  const hem = off => suitOurlet(10.4 + sway, 37.6 + sway, 53.6, 57.2, off, 0.22);
  const shadeX = view === 'se' ? 27.6 : 29.4;
  // la robe : ombre côté brume, reflet, deux plis, le sel et la boue au bas
  let s = P(d, K.dress) + clip(`${u}d`, d, `<rect x="${shadeX}" y="30" width="12" height="30" fill="${K.dressS}"/><path d="M8,52 Q24,56 40,52 L40,60 L8,60 Z" fill="${K.dressS}"/>`
    + `<rect x="12.6" y="38" width="1.5" height="13" rx="0.75" fill="${K.dressH}"/><rect x="${r2(37 + sway)}" y="38" width="1.3" height="15" fill="${K.rim}" opacity=".6"/>`
    + `<path d="M15.6,41 Q14.6,47 14.2,53" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".3"/><path d="M32.6,41 Q33.6,47 34,53" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".3"/>`
    + (M.salt ? `<path d="${hem(2.2)}" fill="none" stroke="${K.salt}" stroke-width="0.7" opacity="${r2(0.7 * M.salt)}"/><path d="${hem(4.4)}" fill="none" stroke="${K.salt}" stroke-width="0.5" opacity="${r2(0.35 * M.salt)}"/>` : '')
    + (M.dirt ? `<path d="${hem(2.6)} L40,60 L8,60 Z" fill="${K.mud}" opacity="${r2(0.3 * M.dirt)}"/>` : '')
    // la farine : elle s'essuie les mains sur les hanches, deux traces blanches sur les côtés de la robe
    + (M.flour ? [[12.9, 50.6, -20], [35.1, 50.4, 20]].map(([x, y, a]) => `<path d="M${r2(x - 1.2 + sway)},${y} q0.6,-1.6 1.4,-0.2 q0.5,-1.2 1,0.4 q-0.2,1.6 -1.2,1.4 q-1,0.2 -1.2,-1.6 Z" fill="${K.flour}" opacity="${r2(0.7 * M.flour)}" transform="rotate(${a} ${r2(x + sway)} ${y})"/>`).join('') : '')) + P(d, 'none');
  // le gilet de laine, par-dessus la robe : côtes du tricot, bord-côte au bas, l'ombre côté brume
  if (t === 'laine') {
    const G = 'M15.2,33 Q24,30.2 32.8,33 L34.2,44.4 Q24,46.6 13.8,44.4 Z';
    const cotes = [16, 17.6, 19.2, 20.8, 22.4, 25.6, 27.2, 28.8, 30.4, 32].map(x => `<path d="M${x},32 L${r2(x + (x - 24) * 0.06)},46" stroke="${OUT}" stroke-width="0.35" opacity=".2"/>`).join('');
    s += P(G, K.wool) + clip(`${u}g`, G, `<rect x="${shadeX}" y="30" width="12" height="18" fill="${K.woolS}"/>` + cotes
      + `<path d="${suitOurlet(13.8, 34.2, 44.4, 46.6, 0.9)}" fill="none" stroke="${K.woolS}" stroke-width="1.8"/><path d="${suitOurlet(13.8, 34.2, 44.4, 46.6, 0.9)}" fill="none" stroke="${K.woolH}" stroke-width="1.8" stroke-dasharray=".4 .6" opacity=".7"/>`) + P(G, 'none');
    if (!dos) s += P(`M${axe},33.2 L${axe},45.6`, 'none', 0.6);
  }
  if (dos) {
    // de dos : les liens du tablier noués au creux des reins (la bavette du tablier de cuisine : ses bretelles croisées),
    // la louche en travers du dos (le cuilleron sur son épaule gauche : à gauche de l'écran)
    if (t === 'cuisine') s += `<path d="M18.2,32.6 L29.6,40.4 M29.8,32.6 L18.4,40.4" stroke="${OUT}" stroke-width="1.9" stroke-linecap="round"/><path d="M18.2,32.6 L29.6,40.4 M29.8,32.6 L18.4,40.4" stroke="${K.apron}" stroke-width="1" stroke-linecap="round"/>`;
    s += P('M17,40.4 Q24,41.6 31,40.4', 'none', 0.8);
    s += P('M24,41 Q19.4,37.4 18.6,40.6 Q19.4,43.6 24,41 Z', K.apron, 0.9) + P('M24,41 Q28.6,37.4 29.4,40.6 Q28.6,43.6 24,41 Z', K.apron, 0.9);
    s += P('M23.4,41.6 L21.6,47.4 L23.4,47 Z', K.apron, 0.8) + P('M24.6,41.6 L26.4,47.4 L24.6,47 Z', K.apron, 0.8) + E(24, 41, 1.3, 1.1, K.apronS, 0.8);
    if ((ctx.pose !== 'action' || c.geste) && !c.sansLouche) s += reflet(24, louche(K, [33, 50.4], [11.6, 26.2], 25), mir);
    return s + (ctx.seatDy ? '' : mouillee(M, 53.6));
  }
  // le tablier (le grand tablier de cuisine monte en bavette jusqu'à la poitrine)
  const bavette = t === 'cuisine';
  const haut = bavette ? `M${20.4 + k},33.6 L${27.6 + k},33.6 L${28.4 + k},40.2` : `M${18.8 + k},35.4 L${29.2 + k},35.4 L${30.4 + k},40.2`;
  const gauche = bavette ? `${19.6 + k},40.2` : `${17.6 + k},40.2`;
  const tb = M.apron === 'torn' ? basDechire(r2(33 + k + sway), r2(15 + k + sway), 53.4, r2(24 + k + sway), 55.6, 6, mir) : null;
  const ap = `${haut} Q${r2(33.2 + k + sway)},47 ${r2(33 + k + sway)},53.4 ` + (tb ? tb.d : `Q${r2(24 + k + sway)},55.6 ${r2(15 + k + sway)},53.4`) + ` Q${r2(14.8 + k + sway)},47 ${gauche} Z`;
  const taches = E(21 + k, 46.6, 1.3, 0.85, K.stain, 0) + E(27.4 + k, 50.4, 0.95, 0.7, K.stain, 0) + E(22.4 + k, 51.6, 0.5, 0.4, K.stain, 0);
  const suie = M.soot ? `<path d="M${25.6 + k},49.2 q1.4,-0.6 2.6,0.4 q-0.6,1.2 -1.8,1 q-1,-0.2 -0.8,-1.4 Z" fill="${K.soot}" opacity="${r2(0.55 * M.soot)}"/><path d="M${26.2 + k},48.4 l0.6,-1.4 M${27.2 + k},48.6 l0.7,-1.2" stroke="${K.soot}" stroke-width="0.5" opacity="${r2(0.45 * M.soot)}"/>` : '';
  const farine = M.flour ? `<ellipse cx="${20.4 + k}" cy="44.6" rx="2.2" ry="1.4" fill="${K.flour}" opacity="${r2(0.55 * M.flour)}"/><ellipse cx="${23 + k}" cy="51" rx="1.6" ry="0.9" fill="${K.flour}" opacity="${r2(0.45 * M.flour)}"/><ellipse cx="${28.4 + k}" cy="45.4" rx="1" ry="0.7" fill="${K.flour}" opacity="${r2(0.4 * M.flour)}"/>` : '';
  const selT = M.salt ? `<path d="${suitOurlet(15 + k + sway, 33 + k + sway, 53.4, 55.6, 1.8, 0.2)}" fill="none" stroke="${K.salt}" stroke-width="0.55" opacity="${r2(0.6 * M.salt)}"/>` : '';
  const reprise = M.apron === 'mended' ? seam(suitOurlet(15 + k + sway, 33 + k + sway, 53.4, 55.6, 0.8)) : '';
  const liseres = bavette ? carreaux(suitOurlet(15 + k + sway, 33 + k + sway, 53.4, 55.6, 0.9), K) + carreaux(`M${20.8 + k},34.4 L${27.2 + k},34.4`, K) : '';
  s += P(ap, K.apron) + clip(`${u}a`, ap, `<rect x="${28 + k}" y="30" width="8" height="28" fill="${K.apronS}"/>` + reflet(axe, taches + suie, mir) + farine + selT + reprise + liseres) + P(ap, 'none');
  if (tb) for (const [x, y] of tb.tips) s += P(`M${r2(x)},${r2(y - 0.2)} q0.45,0.8 -0.1,1.7`, 'none', 0.45);
  if (M.apron === 'mended') s += reflet(axe, P(`M${17.8 + k},49 L${21.2 + k},48.8 L${21.4 + k},52 L${18 + k},52.2 Z`, K.patch, 0.55) + seam(`M${18.3 + k},49.5 L${20.7 + k},49.35 L${20.85 + k},51.55 L${18.45 + k},51.7 Z`, 0.35), mir);
  // la ceinture du tablier ; la bavette : ses bretelles jusqu'au cou
  s += P(`M${gauche.split(',')[0]},40.2 L${r2(30.4 + k - (bavette ? 2 : 0))},40.2`, 'none', 0.8) + seam(`M${18 + k + (bavette ? 2 : 0)},41 L${30 + k - (bavette ? 2 : 0)},41`, 0.35);
  if (bavette) s += `<path d="M${20.6 + k},33.8 L${19.4 + k},31.8 M${27.4 + k},33.8 L${28.6 + k},31.8" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${20.6 + k},33.8 L${19.4 + k},31.8 M${27.4 + k},33.8 L${28.6 + k},31.8" stroke="${K.apron}" stroke-width="0.8" stroke-linecap="round"/>`;
  // le torchon passé à la ceinture (tablier de cuisine), sur sa hanche droite, entre le bras et la poche
  if (bavette) s += reflet(axe, `<g transform="rotate(8 ${18.8 + k} 41)">${P(`M${17 + k},40 L${20.4 + k},40 L${20.2 + k},47.4 Q${18.6 + k},47.9 ${16.8 + k},47.2 Z`, K.towel, 0.6)}<rect x="${17.1 + k}" y="44.4" width="3.2" height="0.7" fill="${K.towelS}"/><rect x="${17.1 + k}" y="45.6" width="3.2" height="0.45" fill="${K.towelS}"/>${P(`M${16.8 + k},40.4 Q${18.6 + k},41.6 ${20.6 + k},40.4`, K.towel, 0.55)}</g>`, mir);
  // la poche et son brin d'herbes (du côté droit de la poche : la bandoulière passe à gauche)
  const herbes = M.herbs ? `<path d="M${26 + k},44 Q${26.4 + k},41.8 ${27.6 + k},40" fill="none" stroke="${K.herbS}" stroke-width="0.6"/>`
    + [[27.4, 40.4, 40], [26.2, 41.8, -30], [26.8, 42.9, 35]].map(([x, y, rr]) => `<g transform="translate(${x + k} ${y}) rotate(${rr})">${P('M0,0 Q0.9,1 0,2.2 Q-0.9,1 0,0 Z', K.herb, 0.4)}</g>`).join('') : '';
  s += reflet(axe, herbes, mir) + P(`M${20.6 + k},43.6 L${27.4 + k},43.6 L${27 + k},47.8 Q${24 + k},48.8 ${21 + k},47.8 Z`, K.apron, 0.8) + seam(`M${21.3 + k},44.3 L${26.7 + k},44.3`, 0.32);
  // la bandoulière de la louche, de son épaule gauche à sa hanche droite : cuir, surpiqûre
  s += reflet(24, limb([31.4, 33.8], [16.8, 47.2], 1.15, K.strap) + `<path d="M31,34.4 L17.2,46.6" fill="none" stroke="${K.strapS}" stroke-width="0.35" stroke-dasharray=".7 .6"/>`, mir);
  return s + (ctx.seatDy ? '' : mouillee(M, 53.6));
}
// trempée : des gouttes tombent du bas de la robe, en continu (debout : assise, la robe touche le sol)
const mouillee = (M, hy) => (M.wet ? [[14.4, 0], [24.6, 0.55], [34, 1.1]].map(([x, d]) => `<ellipse cx="${x}" cy="${r2(hy + 2.4)}" rx="0.45" ry="0.7" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${r2(hy + 2.4)};${r2(hy + 8)}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join('') : '');

// La chaussure, avec la boue de l'état : le bas des bas taché, des éclaboussures sur le cuir
function pied(c, x, y, dir, tilt) {
  const M = marks(c), K = pal(c);
  let s = '';
  const a = r2(x - c.legW / 2 + 0.55), b = r2(x + c.legW / 2 - 0.55);
  if (M.dirt) s += `<path d="M${a},${r2(y + 0.6)} L${a},${r2(y - 1.2)} Q${r2(x - 1)},${r2(y - 2.4)} ${r2(x - 0.2)},${r2(y - 1.4)} Q${r2(x + 0.8)},${r2(y - 0.6)} ${b},${r2(y - 1.9)} L${b},${r2(y + 0.6)} Z" fill="${K.mud}" opacity="${r2(0.5 * M.dirt)}"/>`;
  s += shoe(c, x, y, dir, tilt);
  if (M.dirt) s += `<path d="M${r2(x - 2.8)},${r2(y + 3.2)} Q${r2(x - 1)},${r2(y + 2.2)} ${r2(x + 0.6)},${r2(y + 3.6)} Q${r2(x - 1)},${r2(y + 4.6)} ${r2(x - 2.8)},${r2(y + 3.2)} Z" fill="${K.mud}" opacity="${r2(0.8 * M.dirt)}"/>`
    + E(x + 1.6, y + 1.4, 0.42, 0.42, K.mud, 0).replace('/>', ` opacity="${r2(0.8 * M.dirt)}"/>`);
  return s;
}

// La géométrie du visage selon la vue (de trois quarts : les traits glissent vers la gauche, le lointain se resserre)
const VUES = {
  front: {
    X: x => x, rk: [1, 1], dx: 0, mouth: 24, ear: null,
    face: 'M12.4,22.4 C12.4,15.6 17.6,12.2 24,12.2 C30.4,12.2 35.6,15.6 35.6,22.4 C35.6,28.6 30.6,32.6 24,32.6 C17.4,32.6 12.4,28.6 12.4,22.4 Z',
    back: 'M12,22 Q11,9 24,9 Q37,9 36,22 Q36,27 33.6,28 L14.4,28 Q12,27 12,22 Z',
    bangs: 'M12.6,19.4 Q12.6,9.8 24,9.6 Q35.4,9.8 35.4,19.4 Q32.6,13.8 25,12.8 L24,14.2 L23,12.8 Q15.4,13.8 12.6,19.4 Z'
  },
  se: {
    X: x => r2(21.4 + (x - 24) * (x < 24 ? 0.92 : 0.82)), rk: [0.95, 0.82], dx: -1.6, mouth: 21, ear: [35, 23.4],
    face: 'M11.3,22.4 C11.3,15.6 16.3,12.2 22.6,12.2 C28.9,12.2 33.9,15.6 33.9,22.4 C33.9,28.6 29,32.6 22.6,32.6 C16.2,32.6 11.3,28.6 11.3,22.4 Z',
    back: 'M12.6,22 Q11.4,9 24,9 Q37.4,9 36.4,22 Q36.4,27 33.8,28 L15,28 Q12.6,27 12.6,22 Z',
    bangs: 'M11.8,19.4 Q12,9.8 21.6,9.6 Q35,9.8 35.2,19.4 Q32,13.8 22.6,12.8 L21.6,14.2 L20.6,12.8 Q14.6,13.8 11.8,19.4 Z'
  }
};
// la mèche échappée : une mèche grise cernée, qui bouge au vent
const meche = (K, a, b, begin) => wind(a, b, 'none', 1.7, '1.9s', begin) + wind(a, b, 'none', 0.7, '1.9s', begin).replace(`stroke="${OUT}"`, `stroke="${K.hair}"`);
// le chignon et sa cuillère (sur sa gauche : à droite de l'écran de face et de trois quarts, à gauche de dos) ; y : sa hauteur
const cuillere = (K, dy = 0) => limb([26.6, 9.2 + dy], [31.2, 4 + dy * 0.7], 1.1, K.spoon) + `<g transform="rotate(40 32 ${r2(3.2 + dy * 0.7)})">${E(32, 3.2 + dy * 0.7, 1.3, 1.75, K.spoon, 0.9)}${E(31.7, 2.9 + dy * 0.7, 0.5, 0.8, '#F2F4F7', 0)}</g>`;

function tete(c, ctx) {
  const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`, mir = !!c.miroir;
  if (ctx.view === 'ne') return teteDeDos(c, ctx, K, M, mir, id);
  const V = VUES[ctx.view] || VUES.front, Xv = V.X;
  const name = ALIAS[ctx.expr] || ctx.expr;
  const ex = ctx.blink && name === 'veille' ? EXPR_A.cligne : EXPR_A[name] || EXPR_A.veille;
  let s = reflet(24, cuillere(K), mir);
  s += E(24, 8.6, 5.4, 4.3, K.hair) + P('M20.4,8.2 Q24,5.6 27.6,8.2', 'none', 0.6) + P('M21.4,10.4 Q24,8.8 26.8,10.2', 'none', 0.45) + L([20.6, 7.2], [22.8, 6.1], K.hairH, 1);
  if (M.wisps) s += reflet(24, meche(K, 'M20.2,7.6 Q17.2,6.2 15.8,8.4', 'M20.2,7.6 Q17,6.8 16,9.4', '0s'), mir);
  // les cheveux de derrière, l'oreille (de trois quarts), le visage rond, l'ombre sous les cheveux, le contre-jour, les joues
  s += P(V.back, K.hair) + clip(`${id}h`, V.back, `<rect x="8" y="24" width="32" height="6" fill="${K.hairS}"/><path d="M34.6,12 Q37.6,19 35.8,27 L39,27 L39,12 Z" fill="${K.rim}" opacity=".8"/>`) + P(V.back, 'none');
  if (V.ear) s += E(V.ear[0], V.ear[1], 1.5, 2.1, K.skin) + P(`M${r2(V.ear[0] + 0.1)},${r2(V.ear[1] - 1)} Q${r2(V.ear[0] + 0.8)},${V.ear[1]} ${r2(V.ear[0] + 0.1)},${r2(V.ear[1] + 1)}`, 'none', 0.5);
  s += P(V.face, K.skin) + clip(`${id}f`, V.face, `<path d="${V.bangs}" fill="${K.skinS}" transform="translate(0 1.4)"/>`
    + `<g transform="translate(${V.dx} 0)"><path d="M33.4,14.6 Q36.6,22.4 32.6,31.8 L37,31.8 L37,14.6 Z" fill="${K.rim}" opacity=".5"/><path d="M31.8,13.6 Q35,21.6 31.2,31.4 L33.6,31.4 Q37,21.6 33.6,13.6 Z" fill="${K.skinS}" opacity=".45"/></g>`
    + E(Xv(16.4), 26.8, 2.5 * V.rk[0], 1.5, K.cheek, 0).replace('/>', ' opacity=".6"/>') + E(Xv(31.6), 26.8, 2.5 * V.rk[1], 1.5, K.cheek, 0).replace('/>', ' opacity=".6"/>')) + P(V.face, 'none');
  s += P(V.bangs, K.hair) + clip(`${id}b`, V.bangs, `<path d="M11,17.6 Q24,14 37,17.6 L37,20 L11,20 Z" fill="${K.hairS}" opacity=".5"/>`) + P(V.bangs, 'none') + L([Xv(15.8), 12.6], [Xv(21), 10.6], K.hairH, 1.2);
  if (M.wisps) s += reflet(Xv(24), meche(K, `M${Xv(17.4)},14.4 Q${Xv(15.2)},16.4 ${Xv(15.4)},19.6`, `M${Xv(17.4)},14.4 Q${Xv(14.8)},16.8 ${Xv(15)},20.2`, '-.6s'), mir);
  // la suie du feu : sur sa joue droite et sur le front
  if (M.soot) s += reflet(Xv(24), `<ellipse cx="${Xv(17.4)}" cy="28.6" rx="1.7" ry="0.75" fill="${K.soot}" opacity="${r2(0.45 * M.soot)}" transform="rotate(-12 ${Xv(17.4)} 28.6)"/><ellipse cx="${Xv(19.2)}" cy="29.3" rx="0.45" ry="0.35" fill="${K.soot}" opacity="${r2(0.4 * M.soot)}"/>`
    + `<ellipse cx="${Xv(27.6)}" cy="15.6" rx="1.3" ry="0.55" fill="${K.soot}" opacity="${r2(0.35 * M.soot)}" transform="rotate(8 ${Xv(27.6)} 15.6)"/>`, mir);
  if (M.flour) s += `<ellipse cx="${Xv(29.6)}" cy="17.2" rx="1.2" ry="0.5" fill="${K.flour}" opacity="${r2(0.6 * M.flour)}"/>`;
  // le petit nez rond (de trois quarts, son profil), les rides de l'âge, puis le regard
  s += ctx.view === 'se'
    ? P('M21.2,24.2 Q19.4,25.6 21.4,26', 'none', 0.8).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`)
    : P('M23.1,25.4 Q24,26.4 24.9,25.4', 'none', 0.8).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.4, 24.9, 0.35, 0.25, '#F6D3B4', 0);
  s += rides(Xv(19.4), 22.8, 1, K, V.rk[0]) + rides(Xv(28.6), 22.8, -1, K, V.rk[1]);
  s += mouth(ex.mouth, V.mouth, 27.9, `${id}m`, K);
  s += brow(Xv(19.4), 18.4, 1, ex.browL || ex.brow, false, V.rk[0], K) + brow(Xv(28.6), 18.4, -1, ex.browR || ex.brow, false, V.rk[1], K);
  s += eye(`${id}e0`, Xv(19.4), 22.8, 1, { ...ex, ...ex.eyeL, rk: V.rk[0] }, K) + eye(`${id}e1`, Xv(28.6), 22.8, -1, { ...ex, ...ex.eyeR, rk: V.rk[1] }, K);
  s += extras(ex.extras, ctx.n % 2, Xv);
  if (M.wet) s += gouttes(mir);
  return s;
}
// trempée : deux gouttes tombent du chignon et d'une mèche
const gouttes = mir => reflet(24, [[28.6, 11, 0], [15.6, 20.4, 0.8]].map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="0.42" ry="0.65" fill="#A9DCFF" stroke="${OUT}" stroke-width="0.3"><animate attributeName="cy" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="${y};${y + 6}"/><animate attributeName="opacity" dur="1.6s" begin="-${d}s" repeatCount="indefinite" values="1;1;0" keyTimes="0;.7;1"/></ellipse>`).join(''), mir);

// La tête de dos : les cheveux tirés vers le chignon, la nuque, la frisette, la cuillère (sur sa gauche : à gauche de l'écran)
function teteDeDos(c, ctx, K, M, mir, id) {
  const back = 'M12,22 Q11,8.6 24,8.6 Q37,8.6 36,22 Q36.8,30 35.8,32.8 Q32.6,34 28.6,32.8 Q27,28.4 24,28.4 Q21,28.4 19.4,32.8 Q15.4,34 12.2,32.8 Q11.2,30 12,22 Z';
  let s = P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="6" width="34" height="30" fill="${K.hairS}"/><ellipse cx="22.6" cy="19.8" rx="13.8" ry="12.4" fill="${K.hair}"/><path d="M35.2,12 Q38,20 35.6,32 L39,32 L39,12 Z" fill="${K.rim}" opacity=".8"/>`) + P(back, 'none');
  s += P('M16.6,31.6 Q15.8,21.4 20.6,14.4', 'none', 0.6) + P('M24,26.4 Q23.4,21 24,15.4', 'none', 0.6) + P('M31.4,31.6 Q32.2,21.4 27.4,14.4', 'none', 0.6);
  const curl = `<path d="M26.4,29.2 Q27.4,30.6 26.6,31.4 Q25.8,31.8 25.7,31" fill="none" stroke="${OUT}" stroke-width="1.7" stroke-linecap="round"/><path d="M26.4,29.2 Q27.4,30.6 26.6,31.4 Q25.8,31.8 25.7,31" fill="none" stroke="${K.hair}" stroke-width="0.7" stroke-linecap="round"/>`;
  s += reflet(24, curl, mir) + L([14.6, 17.6], [16.8, 13.6], K.hairH, 1.2);
  // de dos, sa gauche est à gauche de l'écran : la cuillère y passe (en miroir, de l'autre côté)
  s += reflet(24, cuillere(K, 0.4), !mir);
  s += E(24, 10.4, 5.4, 4.4, K.hair) + P('M20.4,10.4 Q24,7.6 27.6,10.4', 'none', 0.6) + L([21, 8.8], [23.6, 7.9], K.hairH, 1.1);
  // les mèches défaites, du côté droit (de dos : à droite de l'écran), comme de face
  if (M.wisps) s += reflet(24, meche(K, 'M27.6,10.6 Q30.6,9.6 31.8,12', 'M27.6,10.6 Q30.8,10.4 31.4,13.2', '0s') + meche(K, 'M33.6,22.4 Q35.6,25.4 34.6,28.6', 'M33.6,22.4 Q36,25.8 35,29.2', '-.6s'), mir);
  if (M.wet) s += gouttes(!mir);
  const ex = EXPR_A[ALIAS[ctx.expr] || ctx.expr] || EXPR_A.veille;
  return s + extras(ex.extras, ctx.n % 2, v => v, true);
}

const agathe = {
  ...cannelle,
  name: 'Agathe', uid: 'ag',
  teintes: [C.hair, C.dress, C.apron, C.copper],
  sleeve: C.dress, cuff: null, sleeves: 'roll',
  foot: pied,
  // ses manches (lorena_bras.js) : retroussées aux coudes (en laine, longues, au bord-côte), à l'ombre du côté droit
  bras: fabriquerBras({ pal, marks }),

  // la louche dans le dos (de face et de trois quarts : le cuilleron sur son épaule gauche), sauf quand elle la tient
  backItems(c, ctx) {
    if (ctx.view === 'ne' || (ctx.pose === 'action' && !c.geste) || c.sansLouche) return '';
    return reflet(24, louche(pal(c), [15, 50], [37.6, 26.4], -25), !!c.miroir);
  },

  body(c, ctx) {
    return corps(c, ctx, pal(c), marks(c));
  },

  neck(c, ctx) {
    const K = pal(c);
    if (ctx.view === 'ne') return P('M19.8,25 L28.2,25 L28.4,31.95 Q24,31.25 19.6,31.95 Z', K.skinS, 0) + P('M19.6,31.95 Q24,31.25 28.4,31.95', 'none');
    return P('M18.2,32.4 Q24,36.2 29.8,32.4 Q24,34.4 18.2,32.4 Z', c.tenue === 'laine' ? K.woolH : K.apron, 0.9);
  },

  head(c, ctx) {
    return tete(c, ctx);
  },

  // le salut et l'action (elle brandit la louche, décidée : on ne touche pas au camp) : les gestes de cannelle.js, avec sa
  // louche cabossée
  pose(ctx) {
    const a = cannelle.pose.call(this, ctx);
    if (ctx.pose === 'salut' || !a) return a;
    const K = pal(this), n = ctx.n;
    const hand = n === 0 ? [37.2, 29.6] : [38.2, 28.6], bowl = n === 0 ? [39.6, 15.6] : [42.4, 18];
    return { ...a, expr: 'decidee', right: louche(K, [hand[0] - 1, hand[1] + 3], bowl, n === 0 ? 10 : 35) + arm(this, [33, 35], hand) };
  }
};

module.exports = { agathe, C, MARKS, EXPR: EXPR_A, pal, marks, louche, reflet };
