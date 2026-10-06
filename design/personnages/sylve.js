// Sylve, la gardienne des bois : 17 ans, cape de feuilles cousues, cheveux sauvages pleins de brindilles et d'une plume
// de geai, pieds nus, deux traits verts peints sur chaque joue ; farouche.
// Action : elle chante à une graine posée dans ses mains en coupe ; image 2 : une pousse jaillit.
const { OUT, P, E, L, clip, expression, arm, bareFoot, r2 } = require('./troupe');

const C = {
  skin: '#E8B88E', skinS: '#CC9A70',
  hair: '#4A3328', hairS: '#33231B', hairH: '#6E4E3C', brow: '#2E1F18',
  twig: '#8A6440', feather: '#3E7FC1', featherS: '#1F3F66',
  leaf: '#5E9E4A', leafS: '#467A37', leafH: '#86C06A',
  tunic: '#A88655', tunicS: '#86683E', vine: '#4E7A34', paint: '#3F8F4A', seed: '#8A6440',
  cheek: '#EE9C8C', mouth: '#7A3B30', tongue: '#E07A72'
};

// Feuille en amande : base en (x, y), longueur len, demi-largeur w, rot en degrés (0 = pointe vers le bas)
const leaf = (x, y, len, w, rot, fill = C.leaf) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot})">`
  + P(`M0,0 Q${w},${r2(len / 2)} 0,${len} Q${-w},${r2(len / 2)} 0,0 Z`, fill, 0.7) + L([0, 0.6], [0, len - 0.8], C.leafS, 0.4) + '</g>';
// Liane : contour fin puis couleur
const vine = (d, w = 1) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 1.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.vine}" stroke-width="${w}" stroke-linecap="round"/>`;
// Brindille fourchue
const twig = (a, b, f) => L(a, b, OUT, 1.6) + L(f[0], f[1], OUT, 1.3) + L(a, b, C.twig, 0.8) + L(f[0], f[1], C.twig, 0.6);
// Plume de geai : base en (x, y), mirror -1 pour le dos
const feather = (x, y, m = 1) => `<g transform="translate(${x} ${y}) scale(${m} 1)">`
  + P('M0,0 Q1.8,-5.2 7,-8.2 Q5.8,-3 0.8,0.6 Z', C.feather, 0.8)
  + L([2.4, -3.4], [3.8, -2.2], C.featherS, 0.6) + L([3.8, -5.2], [5, -4], C.featherS, 0.6)
  + P('M5.6,-7.2 Q6.6,-7.8 7,-8.2 Q6.8,-7 6.2,-6.2 Z', '#FFFFFF', 0) + '</g>';
// Note de musique
const note = (x, y) => `<g transform="rotate(-12 ${x} ${y})">${E(x, y, 1.1, 0.8, OUT, 0)}${L([x + 0.95, y], [x + 0.95, y - 3.6], OUT, 0.6)}`
  + `<path d="M${r2(x + 0.95)},${r2(y - 3.6)} Q${r2(x + 2.6)},${r2(y - 3)} ${r2(x + 2.2)},${r2(y - 1.6)}" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>`;

// Cape de feuilles (bord festonné) ; la tunique au bas déchiré
const CAPE = 'M14.4,33 Q24,30.6 33.6,33 L37.6,52.4 Q36.2,54.4 34.6,52.8 Q33.2,55 31.4,53.2 Q29.8,55.2 28,53.4 Q26,55.4 24,53.6 Q22,55.4 20,53.4 Q18.2,55.2 16.6,53.2 Q14.8,55 13.4,52.8 Q11.8,54.4 10.4,52.4 Z';
const TUNIC = 'M16.2,32.6 Q24,30 31.8,32.6 L33.4,48.6 L31.2,50.4 L29.4,48.8 L27.2,50.6 L25,48.8 L23,50.6 L20.8,48.8 L18.8,50.4 L16.8,48.8 L14.6,50 Z';
function cape(uid, over) {
  // de dos, des rangées de feuilles se recouvrent ; de face, on ne voit que les bords derrière le corps
  const rows = over ? [38.4, 43.4, 48.4].map(y => `<path d="M10,${y} Q12,${y + 2} 14,${y} Q16,${y + 2} 18,${y} Q20,${y + 2} 22,${y} Q24,${y + 2} 26,${y} Q28,${y + 2} 30,${y} Q32,${y + 2} 34,${y} Q36,${y + 2} 38,${y}" fill="none" stroke="${C.leafS}" stroke-width="0.7"/>`).join('') : '';
  return P(CAPE, C.leaf) + clip(`${uid}cp`, CAPE, `<rect x="27" y="30" width="14" height="28" fill="${C.leafS}"/>${rows}`
    + `<rect x="13.6" y="35" width="1.2" height="15" rx="0.6" fill="${C.leafH}"/>`) + P(CAPE, 'none');
}

const sylve = {
  name: 'Sylve', uid: 'sy',
  skin: C.skin, skinS: C.skinS, sleeve: C.skin, cuff: C.vine, armW: 3.6,
  leg: C.skin, legS: C.skinS, legW: 4.4, hip: 47.6, ground: 56.6, foot: bareFoot,
  legX: { front: [20.6, 27.4], se: [20.2, 27.4], ne: [21, 27.8] },
  shoulders: [[16.2, 34], [31.8, 34]], hands: [[14.6, 45], [33.4, 45]],
  action: ['face_chant', 'front'],

  // c.noCape (naufragée) : la cape est perdue, il n'en reste que la liane (voir naufrages.js)
  backItems(c, { view }) { return view === 'ne' || c.noCape ? '' : cape(c.uid, false); },

  body(c, { view }) {
    let s = P(TUNIC, C.tunic) + clip(`${c.uid}t`, TUNIC, `<rect x="${view === 'se' ? 26.4 : 27.8}" y="30" width="9" height="22" fill="${C.tunicS}"/>`) + P(TUNIC, 'none');
    s += vine('M15.2,42.2 Q24,44 32.8,42.2', 1);
    if (view === 'ne') return s + (c.noCape ? '' : cape(c.uid, true)) + [16.6, 20.6, 24, 27.4, 31.4].map((x, i) => leaf(x, 31.6, 3.6, 1.4, [30, 12, 0, -12, -30][i])).join('');
    const k = view === 'se' ? -1.6 : 0;
    return s + leaf(19.6 + k, 43.4, 2.8, 1.1, 20) + leaf(20.6 + k, 43.4, 2.6, 1, -15);
  },

  // col de feuilles autour du cou (de face et de trois quarts)
  neck(c, { view }) {
    if (view === 'ne') return '';
    const k = view === 'se' ? -1.6 : 0;
    return [18.2, 21, 24, 27, 29.8].map((x, i) => leaf(x + k, 32.4, 4.2, 1.6, [38, 16, 0, -16, -38][i])).join('');
  },

  head(c, ctx) {
    const { view } = ctx;
    // longue chevelure sauvage aux pointes en désordre, jusqu'aux épaules
    const long = 'M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,30.4 L36.6,29.2 L36.4,33.4 L34.4,31.2 L33.4,34.6 L31.6,31.4 L16.4,31.4 L14.6,34.6 L13.6,31.2 L11.6,33.4 L11.4,29.2 L9.4,30.4 Z';
    let s = '';
    if (view === 'ne') {
      const back = 'M10.6,21 Q9.6,6.6 24,6.4 Q38.4,6.6 37.4,21 L38.6,31 L36.4,29.6 L36.6,34.4 L34,32 L33.2,36 L30.8,33 L29.4,36.6 L27.2,33.4 L24.6,37 L22.4,33.4 L20,36.6 L18.4,33 L15.8,35.6 L14.8,32 L12,34 L11.6,29.6 L9.4,31 Z';
      s += twig([35.4, 14.2], [39.8, 12.6], [[37.8, 13.2], [38.8, 15]]) + twig([11.8, 21.2], [7.8, 22.6], [[9.6, 21.8], [8.4, 20.2]]) + E(12.6, 23, 1.6, 2.2, C.skin);
      s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="4" width="34" height="36" fill="${C.hairS}"/><ellipse cx="22.4" cy="17.6" rx="13.4" ry="12.4" fill="${C.hair}"/>`) + P(back, 'none');
      s += P('M17,12 Q15.6,22 17.6,32', 'none', 0.6) + P('M24.4,11.4 Q25.4,22 23.6,33.6', 'none', 0.6) + P('M30.6,12.4 Q32,22 30.4,32', 'none', 0.6);
      s += L([16.8, 10], [22, 8.4], C.hairH, 1.2) + L([27, 16], [29.4, 15.4], C.twig, 0.8) + feather(13.4, 14.6, -1);
      return s;
    }
    const se = view === 'se';
    const k = se ? -1.4 : 0;
    const sx = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
    const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
    const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
    const bangs = sx('M11.8,19.6 Q11.4,8 24,7.8 Q36.6,8 36.2,19.6 L34,15.2 L33,18.6 L30.6,13.6 L29.4,17.4 L26.6,12.8 L24.6,16.8 L22.6,12.6 L20.4,17 L18.4,13.2 L16.6,17.6 L15,14.4 Z');
    // brindilles prises dans les cheveux, sur les côtés (pas sur le dessus : on dirait des bois de cerf)
    s += twig([12.6, 14.2], [8.2, 12.6], [[10.2, 13.2], [9.2, 15]]) + twig([36.2, 21.2], [40.2, 22.6], [[38.4, 21.8], [39.6, 20.2]]);
    s += P(long, C.hair) + clip(`${c.uid}h`, long, `<rect x="8" y="24" width="32" height="12" fill="${C.hairS}"/>`) + P(long, 'none');
    if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
    const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
    // traits verts peints sur les pommettes (deux par joue), découpés par le visage
    const paint = cheeks.map(([x, r]) => [-0.6, 0.6].map(dy => L([x - r * 0.9, 25.6 + dy * 1.6], [x + r * 0.9, 25.2 + dy * 1.6], C.paint, 0.75)).join('')).join('');
    s += P(face, C.skin);
    s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>`
      + cheeks.map(([x, r]) => E(x, 27.4, r * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.4 : 0.9, C.cheek, 0)).join('') + paint);
    s += P(face, 'none');
    // mèches qui encadrent le visage, frange en désordre, plume de geai sur le côté
    s += P(sx('M12.6,16.4 Q11.2,24 13.4,30 Q14,24 14.8,18.6 Z'), C.hair, 0.8) + P(sx('M35.4,16.4 Q36.8,24 34.6,30 Q34,24 33.2,18.6 Z'), C.hair, 0.8);
    s += P(bangs, C.hair) + L([15.6 + k, 11.2], [21.6 + k, 9.6], C.hairH, 1.2) + feather(34.4 + k, 14.6);
    s += expression({
      eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]], ry: 2.4,
      brow: C.brow, browY: -4.1, browW: 1.15,
      mouth: [se ? 20.8 : 24, 27.6], mw: 1.6, mouthC: C.mouth, tongue: C.tongue,
      // au repos : sur ses gardes, la bouche serrée de travers
      neutral: (mx, my) => `M${r2(mx - 1.1)},${r2(my + 0.7)} L${r2(mx + 1.1)},${r2(my + 0.4)}`,
      cheeks, cheekY: 27.4, temple: [se ? 11.6 : 10.8, 22.4], anger: [8.4, 12.6], zz: [3.6, 11.4]
    }, ctx);
    return s;
  },

  pose({ pose, n }) {
    if (pose === 'salut') {
      return { open: true, right: arm(this, [31.8, 34], n === 0 ? [37.2, 25.4] : [38.6, 27.4]) };
    }
    // action : mains en coupe, elle chante les yeux fermés ; image 2 : la graine germe, elle rit
    const left = arm(this, [16.2, 34], [22.2, 43.4], [12.6, 40.6]);
    const right = arm(this, [31.8, 34], [25.8, 43.4], [35.4, 40.6]);
    const seedOrSprout = n === 0
      ? E(24, 41.4, 1.1, 0.8, C.seed, 0.7) + note(36.4, 25.4) + note(39.6, 19.6)
      : L([24, 42], [24, 36.4], OUT, 1.8) + L([24, 42], [24, 36.4], C.vine, 0.9) + leaf(24, 37, 3.8, 1.5, 125) + leaf(24, 37, 3.8, 1.5, -125)
        + note(36.8, 22.4) + note(10.4, 24.6) + note(40.2, 16.8);
    return n === 0 ? { expr: 'content', eyeMode: 'blink', open: true, left, right, over: seedOrSprout }
      : { expr: 'rire', left, right, over: seedOrSprout };
  }
};
module.exports = sylve;
