// Cannelle, la cuisinière-guérisseuse : grande et ronde, chignon gris piqué d'une cuillère, robe cannelle aux manches
// retroussées, tablier crème taché, grande louche de cuivre en bandoulière, grosses joues rouges, petit nez.
// Action : elle brandit sa louche, le poing sur la hanche (de face).
const { P, E, L, limb, clip, expression, arm, r2 } = require('./troupe');

const C = {
  skin: '#E9B98F', skinS: '#CF9C72', nose: '#B97A58',
  hair: '#D9D4CC', hairS: '#ABA59C', hairH: '#F5F2EC', brow: '#8C857C',
  dress: '#A8553A', dressS: '#84402B', dressH: '#C46E4E',
  apron: '#F4E9D8', apronS: '#DCCDB5', stain: '#C9A27A',
  copper: '#C27C45', copperS: '#8F5530', copperH: '#EAA46C',
  strap: '#6B4226', spoon: '#C9CED6', spoonS: '#9AA2AD',
  cheek: '#F08F86', mouth: '#7A3B30', tongue: '#E07A72'
};

// Louche de cuivre : manche de a à b, cuilleron en b
function ladle(a, b, tilt = 0) {
  return limb(a, b, 1.5, C.copper) + L([a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1], [a[0] + (b[0] - a[0]) * 0.8, a[1] + (b[1] - a[1]) * 0.8], C.copperH, 0.5)
    + `<g transform="rotate(${tilt} ${r2(b[0])} ${r2(b[1])})">${E(b[0], b[1], 3.3, 2.6, C.copper)}${E(b[0], b[1] - 0.5, 2.3, 1.4, C.copperS, 0)}${E(b[0] - 1.2, b[1] + 0.9, 0.8, 0.45, C.copperH, 0)}</g>`;
}
// Robe en cloche ; sway : le bas qui balance en marchant
const DRESS = sway => `M15.2,33 Q24,30.2 32.8,33 Q${r2(37 + sway)},42 ${r2(37.6 + sway)},53.6 Q${r2(24 + sway)},57.2 ${r2(10.4 + sway)},53.6 Q${r2(11 + sway)},42 15.2,33 Z`;

const cannelle = {
  name: 'Cannelle', uid: 'ca',
  skin: C.skin, sleeve: C.dress, cuff: C.apron, armW: 4.3,
  leg: '#6A5A52', legS: '#54463F', legW: 4.8, hip: 50, ground: 56.8,
  shoe: '#8A5A2E', shoeS: '#6B4322', shoeH: '#B07E4C',
  legX: { front: [20.5, 27.5], se: [20, 27.4], ne: [20.8, 27.8] },
  shoulders: [[15, 35], [33, 35]], hands: [[12.6, 46.6], [35.4, 46.6]],
  action: ['face_louche', 'front'],

  // louche en bandoulière : dans le dos (face, trois quarts), sauf quand elle la brandit
  backItems(c, { view, pose }) {
    if (view === 'ne' || pose === 'action') return '';
    return ladle([15, 50], [37.6, 26.4], -25);
  },

  body(c, { view, ph, walk }) {
    const sway = walk ? ph * 0.7 : 0;
    const d = DRESS(sway);
    let s = P(d, C.dress) + clip(`${c.uid}d`, d, `<rect x="${view === 'se' ? 27.6 : 29.4}" y="30" width="12" height="30" fill="${C.dressS}"/>`
      + `<path d="M8,52 Q24,56 40,52 L40,60 L8,60 Z" fill="${C.dressS}"/><rect x="12.6" y="38" width="1.5" height="13" rx="0.75" fill="${C.dressH}"/>`) + P(d, 'none');
    if (view === 'ne') {
      // nœud du tablier dans le dos, et la louche en travers du dos
      s += P('M17,40.4 Q24,41.6 31,40.4', 'none', 0.8);
      s += P('M24,41 Q19.4,37.4 18.6,40.6 Q19.4,43.6 24,41 Z', C.apron, 0.9) + P('M24,41 Q28.6,37.4 29.4,40.6 Q28.6,43.6 24,41 Z', C.apron, 0.9);
      s += P('M23.4,41.6 L21.6,47.4 L23.4,47 Z', C.apron, 0.8) + P('M24.6,41.6 L26.4,47.4 L24.6,47 Z', C.apron, 0.8) + E(24, 41, 1.3, 1.1, C.apronS, 0.8);
      s += ladle([33, 50.4], [11.6, 26.2], 25);
      return s;
    }
    const k = view === 'se' ? -2 : 0;
    const ap = `M${18.8 + k},35.4 L${29.2 + k},35.4 L${30.4 + k},40.2 Q${r2(33.2 + k + sway)},47 ${r2(33 + k + sway)},53.4 Q${r2(24 + k + sway)},55.6 ${r2(15 + k + sway)},53.4 Q${r2(14.8 + k + sway)},47 ${17.6 + k},40.2 Z`;
    s += P(ap, C.apron) + clip(`${c.uid}a`, ap, `<rect x="${28 + k}" y="34" width="8" height="24" fill="${C.apronS}"/>`
      + E(21 + k, 46.6, 1.3, 0.85, C.stain, 0) + E(27.4 + k, 50.4, 0.95, 0.7, C.stain, 0) + E(22.4 + k, 51.6, 0.5, 0.4, C.stain, 0)) + P(ap, 'none');
    s += P(`M${17.6 + k},40.2 L${30.4 + k},40.2`, 'none', 0.8);
    s += P(`M${20.6 + k},43.6 L${27.4 + k},43.6 L${27 + k},47.8 Q${24 + k},48.8 ${21 + k},47.8 Z`, C.apron, 0.8);
    // bandoulière de la louche, en travers de la poitrine
    s += limb([31.4, 33.8], [16.8, 47.2], 1.15, C.strap);
    return s;
  },

  neck(c, { view }) {
    if (view === 'ne') return '';
    return P('M18.2,32.4 Q24,36.2 29.8,32.4 Q24,34.4 18.2,32.4 Z', C.apron, 0.9);
  },

  head(c, ctx) {
    const { view } = ctx;
    const spoon = limb([26.6, 8.6], [31.2, 3.4], 1.1, C.spoon)
      + `<g transform="rotate(40 32 2.6)">${E(32, 2.6, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.3, 0.5, 0.8, '#F2F4F7', 0)}</g>`;
    const bun = E(24, 8.6, 5.4, 4.3, C.hair) + P('M20.4,8.2 Q24,5.6 27.6,8.2', 'none', 0.6);
    let s = '';
    if (view === 'ne') {
      const back = 'M12,22 Q11,8.6 24,8.6 Q37,8.6 36,22 Q36.4,28.6 33,30 Q24,31.6 15,30 Q11.6,28.6 12,22 Z';
      s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="6" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.6" cy="18.8" rx="13.6" ry="11.6" fill="${C.hair}"/>`) + P(back, 'none');
      // cheveux tirés vers le chignon : mèches qui remontent de la nuque, reflet en haut à gauche
      s += P('M17.4,28.6 Q16.6,20.4 20.6,14.4', 'none', 0.6) + P('M24,30 Q23.4,21.6 24,15.4', 'none', 0.6) + P('M30.6,28.6 Q31.4,20.4 27.4,14.4', 'none', 0.6);
      s += L([14.6, 17.6], [16.8, 13.6], C.hairH, 1.2);
      s += limb([26.6, 9.6], [31.2, 3.8], 1.1, C.spoon) + `<g transform="rotate(40 32 3)">${E(32, 3, 1.3, 1.75, C.spoon, 0.9)}${E(31.7, 2.7, 0.5, 0.8, '#F2F4F7', 0)}</g>`;
      s += E(24, 10.4, 5.4, 4.4, C.hair) + P('M20.4,10.4 Q24,7.6 27.6,10.4', 'none', 0.6) + L([21, 8.8], [23.6, 7.9], C.hairH, 1.1);
      return s;
    }
    const se = view === 'se';
    const fx = se ? 22.6 : 24;
    const rx = se ? 11.3 : 11.6;
    const back = se ? 'M12.6,22 Q11.4,9 24,9 Q37.4,9 36.4,22 Q36.4,27 33.8,28 L15,28 Q12.6,27 12.6,22 Z'
      : 'M12,22 Q11,9 24,9 Q37,9 36,22 Q36,27 33.6,28 L14.4,28 Q12,27 12,22 Z';
    const face = `M${fx - rx},22.4 a${rx},10.2 0 1,0 ${2 * rx},0 a${rx},10.2 0 1,0 ${-2 * rx},0 Z`;
    const part = se ? 21.6 : 24;
    const bangs = `M${se ? 11.8 : 12.6},19.4 Q${se ? 12 : 12.6},9.8 ${part},9.6 Q${se ? 35 : 35.4},9.8 ${se ? 35.2 : 35.4},19.4 Q${se ? 32 : 32.6},13.8 ${part + 1},12.8 L${part},14.2 L${part - 1},12.8 Q${se ? 14.6 : 15.4},13.8 ${se ? 11.8 : 12.6},19.4 Z`;
    s += spoon + bun;
    s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P(back, 'none');
    // visage : ombre sous les cheveux, joues découpées par le visage
    const cheeks = se ? [[15.6, 2.2], [28.6, 1.8]] : [[16.4, 2.6], [31.6, 2.6]];
    s += P(face, C.skin);
    s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>`
      + cheeks.map(([x, r]) => E(x, 26.8, r * (ctx.expr === 'gene' ? 1.25 : 1), ctx.expr === 'gene' ? 2 : 1.6, C.cheek, 0)).join(''));
    s += P(face, 'none');
    s += P(bangs, C.hair) + L(se ? [14.6, 12.6] : [15.8, 12.6], se ? [19.4, 10.6] : [21, 10.6], C.hairH, 1.2);
    // petites rides de rire, nez, puis l'expression (sourcils gris) ; au repos, un doux sourire
    const outer = se ? [[14.6, 1]] : [[16.2, -1], [31.8, 1]];
    for (const [x, d] of outer) s += L([x, 23.4], [x + (d < 0 ? -1 : 1) * 1.1, 24.1], C.nose, 0.5);
    const nx = se ? 20.8 : 24;
    s += P(se ? `M${nx + 0.4},24.2 Q${nx - 1.4},25.6 ${nx + 0.6},26` : `M${nx - 0.9},25.5 Q${nx},26.3 ${nx + 0.9},25.5`, 'none', 0.8).replace('stroke="#3C2819"', `stroke="${C.nose}"`);
    s += expression({
      eyes: se ? [[17.2, 22.8, 1.4], [25.2, 22.8, 1.25]] : [[19.4, 22.8, 1.45], [28.6, 22.8, 1.45]], ry: 2.1,
      brow: C.brow, browY: -4.4, browW: 0.95,
      mouth: [se ? 21 : 24, 27.8], mw: 2.6, mouthC: C.mouth, tongue: C.tongue,
      neutral: (mx, my) => `M${r2(mx - 1.7)},${r2(my + 0.3)} Q${mx},${r2(my + 1.4)} ${r2(mx + 1.7)},${r2(my + 0.3)}`,
      cheeks, cheekY: 26.8, temple: [se ? 12.8 : 13.6, 13.4], anger: [38, 11], zz: [35.8, 6.2]
    }, ctx);
    return s;
  },

  pose({ pose, n }) {
    if (pose === 'salut') {
      return { open: true, right: arm(this, [33, 35], n === 0 ? [38.6, 26.4] : [40, 28.4]) };
    }
    // action : elle brandit la louche (main droite levée), le poing sur la hanche
    const hand = n === 0 ? [37.2, 29.6] : [38.2, 28.6];
    const bowl = n === 0 ? [39.6, 15.6] : [42.4, 18];
    const elbow = [9.6, 40.6];
    const left = arm(this, [15, 35], [14.8, 44.4], elbow);
    const right = ladle([hand[0] - 1, hand[1] + 3], bowl, n === 0 ? 10 : 35) + arm(this, [33, 35], hand);
    return { expr: 'rire', left, right };
  }
};
module.exports = cannelle;
