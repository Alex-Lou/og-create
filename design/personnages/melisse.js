// Mélisse, la jardinière des lunes : 35 ans, grand chapeau de paille orné de fleurs séchées, châle couleur nuit brodé
// de lunes, longue tresse, sabots, mains terreuses, boîte à graines en fer serrée contre elle ; calme absolu.
// Action : elle ouvre sa boîte à deux mains ; image 2 : des graines lumineuses s'en envolent comme de petites lunes.
const { OUT, P, E, L, clip, expression, arm, r2 } = require('./troupe');

const C = {
  skin: '#C68A62', skinS: '#A9704C', hand: '#8E6A4E',
  hair: '#2B2230', hairS: '#1C1620', hairH: '#4A3E52',
  straw: '#E3C27A', strawS: '#BF9A52', strawH: '#F2DCA0', band: '#7A4A6A',
  lavender: '#A88BD0', pink: '#E89AB0', yellow: '#F2C94C',
  shawl: '#2E3A6B', shawlS: '#232C52', moon: '#F4EEDF',
  dress: '#8FA27A', dressS: '#728560',
  iron: '#6E7480', ironS: '#545A65', ironH: '#9AA2AD', glow: '#F6E7A0',
  cheek: '#E39A8A', mouth: '#6A3028', tongue: '#D9786E'
};

// Croissant de lune (broderie, éclat)
const crescent = (x, y, r, fill = C.moon) => `<path d="M${r2(x)},${r2(y - r)} A${r} ${r} 0 1 0 ${r2(x)},${r2(y + r)} A${r2(r * 0.72)} ${r} 0 1 1 ${r2(x)},${r2(y - r)} Z" fill="${fill}"/>`;
// Petit bouquet de fleurs séchées sur le ruban du chapeau
const posy = (x, y) => [[0, 0, C.lavender], [1.6, -0.6, C.pink], [3, 0.2, C.yellow], [1.2, 1, C.lavender]].map(([dx, dy, f]) => E(x + dx, y + dy, 0.85, 0.85, f, 0.5)).join('');
// Boîte à graines en fer, rivetée ; open : couvercle relevé
function box(x, y, open = false) {
  const lid = open ? P(`M${r2(x - 3.7)},${r2(y - 2.2)} L${r2(x + 3.7)},${r2(y - 2.2)} L${r2(x + 2.8)},${r2(y - 5.2)} L${r2(x - 2.8)},${r2(y - 5.2)} Z`, C.ironS, 0.8)
    : `<rect x="${r2(x - 3.9)}" y="${r2(y - 3)}" width="7.8" height="1.6" rx="0.4" fill="${C.ironH}" stroke="${OUT}" stroke-width="0.8"/>`;
  return `<rect x="${r2(x - 3.7)}" y="${r2(y - 2.2)}" width="7.4" height="4.6" rx="0.6" fill="${C.iron}" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="${r2(x + 1.6)}" y="${r2(y - 1.8)}" width="1.6" height="3.8" fill="${C.ironS}"/>` + lid
    + [[-2.8, -1.2], [2.8, -1.2], [-2.8, 1.6], [2.8, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.35, 0.35, C.ironH, 0)).join('')
    + (open ? '' : `<rect x="${r2(x - 0.6)}" y="${r2(y - 1.8)}" width="1.2" height="1.4" rx="0.3" fill="${C.yellow}" stroke="${OUT}" stroke-width="0.5"/>`);
}

const DRESS = 'M16.2,33 Q24,30.4 31.8,33 L34.6,53.6 Q24,56 13.4,53.6 Z';
const SHAWL = 'M15.2,32.6 Q24,29.6 32.8,32.6 L34.2,40.8 L30.4,38.6 Q24,41.6 17.6,38.6 L13.8,40.8 Z';
const SHAWL_BACK = 'M15.2,32.6 Q24,29.6 32.8,32.6 L33.6,36.2 L24,47.4 L14.4,36.2 Z';

const melisse = {
  name: 'Mélisse', uid: 'me',
  skin: C.skin, skinS: C.skinS, hand: C.hand, sleeve: C.dress, cuff: null, armW: 3.8,
  leg: '#5A4A44', legS: '#463A35', legW: 4.4, hip: 50, ground: 56.8,
  shoe: '#A8743F', shoeS: '#7E5530', shoeH: '#C9965E',
  legX: { front: [20.6, 27.4], se: [20.2, 27.4], ne: [21, 27.8] },
  shoulders: [[16, 34.4], [32, 34.4]], hands: [[14.4, 45.4], [33.6, 45.4]],
  action: ['face_graines', 'front'],

  // la boîte à graines serrée contre elle : le bras gauche ne balance pas
  restLeft(c, { view }) {
    if (view === 'ne') return arm(c, [16, 34.4], [15.6, 41.8], [13.2, 40.2]);
    const k = view === 'se' ? -1.6 : 0;
    return box(21.8 + k, 43.4) + arm(c, [16, 34.4], [19.6 + k, 43.2], [13, 41]);
  },

  body(c, { view }) {
    let s = P(DRESS, C.dress) + clip(`${c.uid}d`, DRESS, `<rect x="${view === 'se' ? 26.4 : 27.8}" y="30" width="10" height="28" fill="${C.dressS}"/>`
      + `<path d="M12,52.6 Q24,55.2 36,52.6 L36,58 L12,58 Z" fill="${C.dressS}"/>`) + P(DRESS, 'none');
    if (c.noShawl) return s; // naufragée : le châle est noué à la taille (voir naufrages.js)
    const sh = view === 'ne' ? SHAWL_BACK : SHAWL;
    const moons = view === 'ne' ? [[19.6, 36.2], [24, 41.4], [28.4, 36.2], [24, 34.2]] : [[16.6, 36.4], [31.4, 36.4], [20.4, 35], [27.6, 35]];
    s += P(sh, C.shawl) + clip(`${c.uid}s`, sh, `<rect x="${view === 'se' ? 26.6 : 28}" y="28" width="9" height="22" fill="${C.shawlS}"/>`
      + moons.map(([x, y]) => crescent(x, y, 1)).join('')) + P(sh, 'none');
    // franges du châle
    const fr = view === 'ne' ? [[22.4, 46], [24, 47.6], [25.6, 46]] : [[14.4, 40.6], [15.4, 40], [32.6, 40], [33.6, 40.6]];
    return s + fr.map(([x, y]) => L([x, y], [x, y + 1.6], C.shawlS, 0.6)).join('');
  },

  // longue tresse sur l'épaule (de face et de trois quarts)
  neck(c, { view }) {
    if (view === 'ne') return '';
    const k = view === 'se' ? -1.4 : 0;
    let s = '';
    // sur l'épaule libre (l'autre bras tient la boîte)
    for (let i = 0; i < 5; i++) s += E(29.4 + k + (i % 2 ? -0.5 : 0.2), 31.6 + i * 2.4, 1.6, 1.5, C.hair, 0.8);
    return s + L([30 + k, 31], [29.4 + k, 33.6], C.hairH, 0.7) + E(29.2 + k, 44.2, 0.9, 0.9, C.pink, 0.6);
  },

  head(c, ctx) {
    const { view } = ctx;
    const brim = (m = 1) => `<g transform="translate(24 0) scale(${m} 1) translate(-24 0)">`
      + E(24, 12.4, 17.6, 4.4, C.straw) + clip(`${ctx.id}b${m}`, 'M6,12.4 a18,4.8 0 1,0 36,0 a18,4.8 0 1,0 -36,0 Z', `<ellipse cx="22" cy="11" rx="16" ry="3.4" fill="${C.strawH}"/><rect x="31" y="6" width="12" height="12" fill="${C.strawS}"/>`)
      + E(24, 12.4, 17.6, 4.4, 'none') + '</g>';
    const crown = (m = 1) => `<g transform="translate(24 0) scale(${m} 1) translate(-24 0)">`
      + P('M15.4,12.2 Q15.6,3.4 24,3.2 Q32.4,3.4 32.6,12.2 Q24,14 15.4,12.2 Z', C.straw)
      + P('M15.6,9.6 Q24,11.4 32.4,9.6 L32.6,12.2 Q24,14 15.4,12.2 Z', C.band, 0.8) + posy(16.8, 9.8)
      + L([18, 6], [21.4, 4.6], C.strawH, 1) + '</g>';
    let s = '';
    if (view === 'ne') {
      const back = 'M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37.4,27.6 34.6,30.2 Q29.6,32.4 24,32.6 Q18.4,32.4 13.4,30.2 Q10.6,27.6 11.2,21 Z';
      s += E(12.6, 23, 1.6, 2.2, C.skin);
      s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="8" width="34" height="26" fill="${C.hairS}"/><ellipse cx="22.4" cy="19" rx="13" ry="10" fill="${C.hair}"/>`) + P(back, 'none');
      s += P('M18,17 Q17.4,24 19,30.6', 'none', 0.6) + P('M29.6,17 Q30.4,24 28.8,30.8', 'none', 0.6) + P('M24,18 Q24.4,25 23.4,31.4', 'none', 0.6);
      // la tresse part de la nuque et passe sur l'épaule (de face, on la voit retomber devant)
      for (const [x, y] of [[22.6, 31.8], [20.4, 33.2], [18.2, 34.4]]) s += E(x, y, 1.6, 1.45, C.hair, 0.8);
      s += L([22, 31.2], [21, 31.9], C.hairH, 0.6);
      return s + brim(-1) + crown(-1);
    }
    const se = view === 'se';
    const k = se ? -1.4 : 0;
    const sx = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
    const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
    const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
    const back = 'M11.4,21 Q11,12 24,11.8 Q37,12 36.6,21 Q36.8,27 34.8,28.4 L13.2,28.4 Q11.2,27 11.4,21 Z';
    const bangs = sx('M12.4,20 Q12.6,13.4 24,13.2 Q35.4,13.4 35.6,20 Q33,15.6 25,15.2 L24,16.4 L23,15.2 Q15,15.6 12.4,20 Z');
    s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24" width="32" height="6" fill="${C.hairS}"/>`) + P(back, 'none');
    if (se) s += E(35, 23.2, 1.5, 2.1, C.skin);
    const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
    s += P(face, C.skin);
    // l'ombre du large bord du chapeau sur le front
    s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.6)"/><rect x="8" y="10" width="34" height="5.6" fill="${C.skinS}" opacity="0.6"/>`
      + cheeks.map(([x, r]) => E(x, 26.4, r * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.4 : 0.95, C.cheek, 0)).join(''));
    s += P(face, 'none');
    s += P(bangs, C.hair) + L([16 + k, 15.2], [20.6 + k, 14.4], C.hairH, 0.9);
    s += `<g transform="translate(${k} 0)">${brim()}${crown()}</g>`;
    s += expression({
      eyes: se ? [[17.2, 22.8, 1.5], [25.2, 22.8, 1.3]] : [[19.4, 22.8, 1.55], [28.6, 22.8, 1.55]], ry: 2.3,
      brow: C.hairS, browY: -4.1, browW: 1,
      // au repos : paupières lourdes et un sourire en coin, mystérieuse et tranquille
      restEyes: 'sleepy',
      mouth: [se ? 20.8 : 24, 27.4], mw: 1.6, mouthC: C.mouth, tongue: C.tongue,
      neutral: (mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.3)} Q${r2(mx + 0.2)},${r2(my + 1.2)} ${r2(mx + 1.4)},${r2(my + 0.1)}`,
      cheeks, cheekY: 26.4, temple: [se ? 11.6 : 10.8, 22.8], anger: [40.4, 6], zz: [36.4, 7.6]
    }, ctx);
    return s;
  },

  pose({ pose, n }) {
    if (pose === 'salut') {
      return { open: true, right: arm(this, [32, 34.4], n === 0 ? [37.4, 25.8] : [38.8, 27.8]) };
    }
    // action : la boîte tenue à deux mains ; image 2 : couvercle ouvert, les graines s'envolent en lueurs
    const seeds = n ? [[22.4, 37.2, 0.7], [25.6, 35.6, 0.8], [23.8, 33.6, 0.6], [20.6, 34.4, 0.55], [27.6, 33, 0.5]]
      .map(([x, y, r]) => E(x, y, r * 2.2, r * 2.2, C.glow, 0).replace('fill=', 'fill-opacity="0.45" fill=') + E(x, y, r, r, C.yellow, 0.4)).join('')
      + crescent(31, 36.6, 1.5, C.glow) : '';
    const left = box(24, 43.6, n === 1) + seeds + arm(this, [16, 34.4], [20.4, 43.4], [12.8, 40.6]);
    const right = arm(this, [32, 34.4], [27.6, 43.4], [35.2, 40.6]);
    return { expr: n ? 'content' : 'neutre', left, right };
  }
};
module.exports = melisse;
