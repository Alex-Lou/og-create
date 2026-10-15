// Agathe (anciennement Marcelle ; fichiers du jeu : cannelle), la cuisinière-guérisseuse, refonte d'étude : le même
// personnage, le même cadre 48 × 64, le même trait et le même kit (troupe.js), poussé plus loin, comme Lorena.
// Grande et ronde, chignon gris piqué d'une cuillère, robe cannelle aux manches retroussées, tablier, grande louche de
// cuivre en bandoulière, joues rouges, petit nez. Yeux bruns à paupière lourde, les rides de son âge ; au repos, soucieuse
// (elle pense à Pierrot), le sourire devient rare ; le naufrage sur elle : la suie du feu sur la joue et le front, le
// chignon à moitié défait, le tablier déchiré et taché, le sel au bas de la robe, un brin d'herbes dans la poche.
// Vue de face seulement pour l'étude : les autres vues reprennent encore le dessin de cannelle.js.
const { P, E, L, clip, limb, arm, dechirure, r2, OUT } = require('../troupe');
const cannelle = require('../cannelle');
const { EXPR, ALIAS, X, eye, brow, mouth, extras, wind, rides } = require('./visage');
const { seam, suitOurlet } = require('./tissu');
const { fabriquerBras } = require('./lorena_bras');

const C = {
  skin: '#E9B98F', skinS: '#C99472', lid: '#E0AC84', under: '#B98A78', nose: '#B97A58',
  hair: '#D9D4CC', hairS: '#A9A39A', hairH: '#F5F2EC', brow: '#5E554C', browW: 0.7, rim: '#9FE3DA',
  eye: '#2A1F1A', iris: '#7A5634', irisL: '#C9A06A', eyeRx: 1.75, eyeRy: 2.3,
  dress: '#A8553A', dressS: '#84402B', dressH: '#C46E4E',
  apron: '#F2E6D2', apronS: '#D8C8AE', stain: '#C9A27A', soot: '#4A4440', salt: '#FFF8E8',
  copper: '#C27C45', copperS: '#8F5530', copperH: '#EAA46C',
  strap: '#6B4226', strapS: '#4E2F1A', spoon: '#C9CED6', spoonS: '#9AA2AD',
  herb: '#6E9A4A', herbS: '#4E7434',
  cheek: '#EE8C80', mouth: '#7A3B30', cloth: '#E6D4AE', clothS: '#B8A27A'
};

// Les marques du naufrage sur elle, réglées par l'état (à venir : agathe_tenues.js) : suie, sel, tablier déchiré, chignon
// défait, brin d'herbes
const MARKS = { soot: 1, salt: 1, apron: 'torn', wisps: true, herbs: true, wrist: false, dirt: 0, wet: false };
const marks = c => ({ ...MARKS, ...(c.marks || {}) });
// sa palette, et les mêmes noms que pour Lorena là où les manches les attendent (lorena_bras.js : coat → la robe)
const pal = c => {
  const K = { ...C, ...(c.pal || {}) };
  return { ...K, coat: K.dress, coatS: K.dressS, coatH: K.dressH, shirt: K.apron, shirtS: K.apronS, brass: K.copper };
};

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

function corps(c, ctx, K, M) {
  const sway = ctx.walk ? ctx.ph * 0.7 : 0, u = c.uid;
  const d = DRESS(sway);
  const hem = off => suitOurlet(10.4 + sway, 37.6 + sway, 53.6, 57.2, off, 0.22);
  // la robe : ombre côté brume, reflet, deux plis, l'auréole de sel au bas
  let s = P(d, K.dress) + clip(`${u}d`, d, `<rect x="29.4" y="30" width="12" height="30" fill="${K.dressS}"/><path d="M8,52 Q24,56 40,52 L40,60 L8,60 Z" fill="${K.dressS}"/>`
    + `<rect x="12.6" y="38" width="1.5" height="13" rx="0.75" fill="${K.dressH}"/><rect x="${r2(37 + sway)}" y="38" width="1.3" height="15" fill="${K.rim}" opacity=".6"/>`
    + `<path d="M15.6,41 Q14.6,47 14.2,53" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".3"/><path d="M32.6,41 Q33.6,47 34,53" fill="none" stroke="${OUT}" stroke-width="0.45" opacity=".3"/>`
    + (M.salt ? `<path d="${hem(2.2)}" fill="none" stroke="${K.salt}" stroke-width="0.7" opacity="${r2(0.7 * M.salt)}"/><path d="${hem(4.4)}" fill="none" stroke="${K.salt}" stroke-width="0.5" opacity="${r2(0.35 * M.salt)}"/>` : '')) + P(d, 'none');
  // le tablier : son bas déchiré (un coin arraché), les taches de cuisine, la suie d'une main, la poche et son brin d'herbes
  const ah = M.apron === 'torn' ? dechirure([r2(33 + sway), 53.4], [r2(24 + sway), 55.6], [r2(15 + sway), 53.4], 6) : null;
  const ap = `M18.8,35.4 L29.2,35.4 L30.4,40.2 Q${r2(33.2 + sway)},47 ${r2(33 + sway)},53.4 ` + (ah ? ah.d : `Q${r2(24 + sway)},55.6 ${r2(15 + sway)},53.4`) + ` Q${r2(14.8 + sway)},47 17.6,40.2 Z`;
  s += P(ap, K.apron) + clip(`${u}a`, ap, `<rect x="28" y="34" width="8" height="24" fill="${K.apronS}"/>`
    + E(21, 46.6, 1.3, 0.85, K.stain, 0) + E(27.4, 50.4, 0.95, 0.7, K.stain, 0) + E(22.4, 51.6, 0.5, 0.4, K.stain, 0)
    + (M.soot ? `<path d="M25.6,49.2 q1.4,-0.6 2.6,0.4 q-0.6,1.2 -1.8,1 q-1,-0.2 -0.8,-1.4 Z" fill="${K.soot}" opacity="${r2(0.55 * M.soot)}"/><path d="M26.2,48.4 l0.6,-1.4 M27.2,48.6 l0.7,-1.2" stroke="${K.soot}" stroke-width="0.5" opacity="${r2(0.45 * M.soot)}"/>` : '')
    + (M.salt ? `<path d="${suitOurlet(15 + sway, 33 + sway, 53.4, 55.6, 1.8, 0.2)}" fill="none" stroke="${K.salt}" stroke-width="0.55" opacity="${r2(0.6 * M.salt)}"/>` : '')) + P(ap, 'none');
  if (ah) for (const [x, y] of ah.tips) s += P(`M${r2(x)},${r2(y - 0.2)} q0.45,0.8 -0.1,1.7`, 'none', 0.45);
  s += P('M17.6,40.2 L30.4,40.2', 'none', 0.8) + seam('M18,41 L30,41', 0.35);
  if (M.herbs) {
    // le brin d'herbes (de la guérisseuse), qui dépasse de la poche
    // (du côté droit de la poche : la bandoulière passe à gauche)
    s += `<path d="M26,44 Q26.4,41.8 27.6,40" fill="none" stroke="${K.herbS}" stroke-width="0.6"/>`
      + [[27.4, 40.4, 40], [26.2, 41.8, -30], [26.8, 42.9, 35]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P('M0,0 Q0.9,1 0,2.2 Q-0.9,1 0,0 Z', K.herb, 0.4)}</g>`).join('');
  }
  s += P('M20.6,43.6 L27.4,43.6 L27,47.8 Q24,48.8 21,47.8 Z', K.apron, 0.8) + seam('M21.3,44.3 L26.7,44.3', 0.32);
  // la bandoulière de la louche, en travers de la poitrine : cuir, surpiqûre
  s += limb([31.4, 33.8], [16.8, 47.2], 1.15, K.strap) + `<path d="M31,34.4 L17.2,46.6" fill="none" stroke="${K.strapS}" stroke-width="0.35" stroke-dasharray=".7 .6"/>`;
  return s;
}

const agathe = {
  ...cannelle,
  name: 'Agathe', uid: 'ag',
  teintes: [C.hair, C.dress, C.apron, C.copper],
  sleeve: C.dress, cuff: null, sleeves: 'roll',
  // ses manches (lorena_bras.js) : retroussées aux coudes, la robe à l'ombre du côté droit
  bras: fabriquerBras({ pal, marks }),

  backItems(c, ctx) {
    if (ctx.view !== 'front') return cannelle.backItems(c, ctx);
    if (ctx.pose === 'action') return '';
    return louche(pal(c), [15, 50], [37.6, 26.4], -25);
  },

  body(c, ctx) {
    if (ctx.view !== 'front') return cannelle.body(c, ctx);
    return corps(c, ctx, pal(c), marks(c));
  },

  head(c, ctx, act) {
    if (ctx.view !== 'front') return cannelle.head(c, ctx, act);
    const K = pal(c), M = marks(c), id = `${c.uid}${ctx.view}${ctx.expr}`;
    const name = ALIAS[ctx.expr] || ctx.expr;
    const ex = ctx.blink && name === 'veille' ? EXPR_A.cligne : EXPR_A[name] || EXPR_A.veille;
    let s = '';
    // le chignon, piqué de sa cuillère ; deux mèches échappées qui bougent au vent
    s += limb([26.6, 9.2], [31.2, 4], 1.1, K.spoon) + `<g transform="rotate(40 32 3.2)">${E(32, 3.2, 1.3, 1.75, K.spoon, 0.9)}${E(31.7, 2.9, 0.5, 0.8, '#F2F4F7', 0)}</g>`;
    s += E(24, 8.6, 5.4, 4.3, K.hair) + P('M20.4,8.2 Q24,5.6 27.6,8.2', 'none', 0.6) + P('M21.4,10.4 Q24,8.8 26.8,10.2', 'none', 0.45) + L([20.6, 7.2], [22.8, 6.1], K.hairH, 1);
    const meche = (a, b, begin) => wind(a, b, 'none', 1.7, '1.9s', begin) + wind(a, b, 'none', 0.7, '1.9s', begin).replace(`stroke="${OUT}"`, `stroke="${K.hair}"`);
    if (M.wisps) s += meche('M20.2,7.6 Q17.2,6.2 15.8,8.4', 'M20.2,7.6 Q17,6.8 16,9.4', '0s');
    // les cheveux de derrière, le visage rond, l'ombre sous les cheveux, le contre-jour, les joues
    const back = 'M12,22 Q11,9 24,9 Q37,9 36,22 Q36,27 33.6,28 L14.4,28 Q12,27 12,22 Z';
    s += P(back, K.hair) + clip(`${id}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${K.hairS}"/><path d="M34.6,12 Q37.6,19 35.8,27 L39,27 L39,12 Z" fill="${K.rim}" opacity=".8"/>`) + P(back, 'none');
    const face = 'M12.4,22.4 C12.4,15.6 17.6,12.2 24,12.2 C30.4,12.2 35.6,15.6 35.6,22.4 C35.6,28.6 30.6,32.6 24,32.6 C17.4,32.6 12.4,28.6 12.4,22.4 Z';
    const bangs = 'M12.6,19.4 Q12.6,9.8 24,9.6 Q35.4,9.8 35.4,19.4 Q32.6,13.8 25,12.8 L24,14.2 L23,12.8 Q15.4,13.8 12.6,19.4 Z';
    s += P(face, K.skin) + clip(`${id}f`, face, `<path d="${bangs}" fill="${K.skinS}" transform="translate(0 1.4)"/>`
      + `<path d="M33.4,14.6 Q36.6,22.4 32.6,31.8 L37,31.8 L37,14.6 Z" fill="${K.rim}" opacity=".5"/><path d="M31.8,13.6 Q35,21.6 31.2,31.4 L33.6,31.4 Q37,21.6 33.6,13.6 Z" fill="${K.skinS}" opacity=".45"/>`
      + E(16.4, 26.8, 2.5, 1.5, K.cheek, 0).replace('/>', ' opacity=".6"/>') + E(31.6, 26.8, 2.5, 1.5, K.cheek, 0).replace('/>', ' opacity=".6"/>')) + P(face, 'none');
    s += P(bangs, K.hair) + clip(`${id}b`, bangs, `<path d="M12,17.6 Q24,14 36,17.6 L36,20 L12,20 Z" fill="${K.hairS}" opacity=".5"/>`) + P(bangs, 'none') + L([15.8, 12.6], [21, 10.6], K.hairH, 1.2);
    if (M.wisps) s += meche('M17.4,14.4 Q15.2,16.4 15.4,19.6', 'M17.4,14.4 Q14.8,16.8 15,20.2', '-.6s');
    // la suie du feu : sur sa joue droite et sur le front
    if (M.soot) s += `<ellipse cx="17.4" cy="28.6" rx="1.7" ry="0.75" fill="${K.soot}" opacity="${r2(0.45 * M.soot)}" transform="rotate(-12 17.4 28.6)"/><ellipse cx="19.2" cy="29.3" rx="0.45" ry="0.35" fill="${K.soot}" opacity="${r2(0.4 * M.soot)}"/>`
      + `<ellipse cx="27.6" cy="15.6" rx="1.3" ry="0.55" fill="${K.soot}" opacity="${r2(0.35 * M.soot)}" transform="rotate(8 27.6 15.6)"/>`;
    // le petit nez rond, les rides de l'âge, puis le regard
    s += P('M23.1,25.4 Q24,26.4 24.9,25.4', 'none', 0.8).replace(`stroke="${OUT}"`, `stroke="${K.nose}"`) + E(24.4, 24.9, 0.35, 0.25, '#F6D3B4', 0);
    s += rides(19.4, 22.8, 1, K) + rides(28.6, 22.8, -1, K);
    s += mouth(ex.mouth, 24, 27.9, `${id}m`, K);
    s += brow(19.4, 18.4, 1, ex.browL || ex.brow, false, 1, K) + brow(28.6, 18.4, -1, ex.browR || ex.brow, false, 1, K);
    s += eye(`${id}e0`, 19.4, 22.8, 1, { ...ex, ...ex.eyeL }, K) + eye(`${id}e1`, 28.6, 22.8, -1, { ...ex, ...ex.eyeR }, K);
    s += extras(ex.extras, ctx.n % 2);
    return s;
  },

  // le salut et l'action (elle brandit la louche) : les gestes de cannelle.js, avec sa louche cabossée
  pose(ctx) {
    const a = cannelle.pose.call(this, ctx);
    if (ctx.pose === 'salut' || !a) return a;
    const K = pal(this), n = ctx.n;
    const hand = n === 0 ? [37.2, 29.6] : [38.2, 28.6], bowl = n === 0 ? [39.6, 15.6] : [42.4, 18];
    return { ...a, right: louche(K, [hand[0] - 1, hand[1] + 3], bowl, n === 0 ? 10 : 35) + arm(this, [33, 35], hand) };
  }
};

module.exports = { agathe, C, MARKS, EXPR: EXPR_A };
