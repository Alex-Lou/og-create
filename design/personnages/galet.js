// Galet, le tailleur de runes : 75 ans, tout petit, barbe de lichen jusqu'à la ceinture, bonnet de laine troué,
// peau couleur granit, sourcils blancs broussailleux, maillet en main et ciseau à la ceinture. « Hm. »
// Action : il frappe le ciseau posé sur un bloc de pierre ; image 2 : la rune s'allume, la pierre chante.
const { OUT, P, E, L, limb, clip, expression, arm, r2 } = require('./troupe');

const C = {
  skin: '#B9B3A8', skinS: '#9C968B', nose: '#A39C90',
  wool: '#B5562E', woolS: '#8E3F20', woolH: '#D07448',
  beard: '#A3B48A', beardS: '#7F9068', beardH: '#C4D1AC', white: '#EEEAE0', whiteS: '#C9C3B6',
  smock: '#6E6458', smockS: '#564E44', belt: '#4A3A2C', brass: '#C9A24A',
  wood: '#A8743F', woodS: '#7E5530', steel: '#B8C0C8', stone: '#A9A49A', stoneS: '#86817A', glow: '#8FE3E8',
  cheek: '#E3A396', mouth: '#5A3028', tongue: '#D9786E'
};
const HY = 4.4; // tout petit : même tête, posée plus bas

// Maillet : le manche part de la main h, la tête au bout (rot en degrés, 0 = tête vers le bas)
function mallet(h, rot) {
  return `<g transform="rotate(${rot} ${r2(h[0])} ${r2(h[1])})">`
    + limb([h[0], h[1] - 1], [h[0], h[1] + 5.6], 1.2, C.wood)
    + `<rect x="${r2(h[0] - 2.4)}" y="${r2(h[1] + 5.2)}" width="4.8" height="2.8" rx="0.9" fill="${C.wood}" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="${r2(h[0] + 0.9)}" y="${r2(h[1] + 5.6)}" width="1.1" height="2" rx="0.4" fill="${C.woodS}"/></g>`;
}
// Ciseau de tailleur : manche en a, lame vers b
const chisel = (a, b) => limb(a, [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], 1.3, C.wood) + limb([a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45], b, 0.9, C.steel);

const SMOCK = 'M15.6,37.4 Q24,35 32.4,37.4 L34,51 Q24,53.2 14,51 Z';
// Barbe de lichen : des joues jusqu'à la ceinture, bas en mèches
const BEARD = 'M13.6,24.6 Q14,31 16.6,34.6 L16.4,40 L18.4,38.6 L19,45.4 L21.2,42.6 L22.4,48.6 L24,45 L25.6,48.6 L26.8,42.6 L29,45.4 L29.6,38.6 L31.6,40 L31.4,34.6 Q34,31 34.4,24.6 Q31,28.6 24,28.4 Q17,28.6 13.6,24.6 Z';

const galet = {
  name: 'Galet', uid: 'ga',
  skin: C.skin, skinS: C.skinS, sleeve: C.smock, cuff: C.smockS, armW: 4.2,
  leg: '#55504A', legS: '#403C37', legW: 4.6, hip: 50.4, ground: 56.8,
  shoe: '#4A3C30', shoeS: '#33291F', shoeH: '#6B5A4A',
  legX: { front: [21, 27], se: [20.6, 27.2], ne: [21.4, 27.6] },
  shoulders: [[16.4, 38.8], [31.6, 38.8]], hands: [[14.8, 48.2], [33.2, 48.2]],
  action: ['face_rune', 'front'],

  // le maillet ne quitte pas sa main droite
  hold(c, h) { return mallet(h, -8); },

  body(c, { view }) {
    let s = P(SMOCK, C.smock) + clip(`${c.uid}s`, SMOCK, `<rect x="${view === 'se' ? 26.2 : 27.8}" y="34" width="9" height="20" fill="${C.smockS}"/>`) + P(SMOCK, 'none');
    s += P('M14.6,46.6 Q24,48.6 33.4,46.6 L33.6,48.6 Q24,50.6 14.4,48.6 Z', C.belt, 0.8);
    if (view === 'ne') return s + P('M24,38 L24,52', 'none', 0.6);
    const k = view === 'se' ? -1.6 : 0;
    // ciseau glissé dans la ceinture, boucle de laiton
    s += `<rect x="${r2(22.8 + k)}" y="46.6" width="2.4" height="2" rx="0.3" fill="${C.brass}" stroke="${OUT}" stroke-width="0.6"/>`;
    return s + chisel([30.2 + k, 44.6], [31, 51.4]);
  },

  head(c, ctx) {
    const { view } = ctx;
    // bonnet de laine mou à revers côtelé, petite queue au sommet, deux trous d'où sortent des mèches blanches
    const beanie = 'M11.6,16.4 Q10.8,6.2 22.4,4.8 Q32.8,3.8 36,9.8 Q37.4,12.8 36.4,16.4 Z';
    const hole = (x, y) => E(x, y, 1.1, 0.85, '#5E2A15', 0.6) + P(`M${r2(x - 0.6)},${r2(y + 0.3)} Q${x},${r2(y - 1.6)} ${r2(x + 0.7)},${r2(y + 0.2)}`, C.white, 0.5);
    const woolCap = (k = 0) => `<g transform="translate(${k} 0)">`
      + P('M21.8,5.2 Q21.2,2.4 23.6,1.8 Q23.4,3.6 24.6,5 Z', C.wool, 0.8)
      + P(beanie, C.wool) + clip(`${ctx.id}w`, beanie, `<rect x="8" y="2" width="34" height="16" fill="${C.woolS}"/><ellipse cx="21.6" cy="7.4" rx="12.6" ry="6.8" fill="${C.wool}"/>`) + P(beanie, 'none')
      + hole(18.4, 9.8) + hole(29.6, 11.6)
      + P('M11.2,14.4 Q24,11.6 36.8,14.4 L36.8,17.6 Q24,14.8 11.2,17.6 Z', C.wool, 0.9)
      + [14, 17, 20, 23, 26, 29, 32, 35].map(x => `<path d="M${x},${r2(13.6 + Math.abs(x - 24) * 0.08)} L${x},${r2(16.4 + Math.abs(x - 24) * 0.08)}" stroke="${C.woolS}" stroke-width="0.5"/>`).join('')
      + L([13, 15.4], [17.8, 14.4], C.woolH, 0.8) + '</g>';
    let s = '';
    if (view === 'ne') {
      // de dos : crâne couleur granit, couronne de cheveux blancs sur la nuque
      // de dos, le crâne descend aussi bas que de face (la couronne de cheveux blancs touche le col)
      const back = 'M11.2,21 Q10.6,10 24,9.8 Q37.4,10 36.8,21 Q37,28.4 34.2,30.4 Q24,32.6 13.8,30.4 Q11,28.4 11.2,21 Z';
      s += E(12.4, 23, 1.7, 2.3, C.skin) + E(35.6, 23, 1.7, 2.3, C.skin);
      // la barbe de lichen dépasse des deux côtés du cou : deux touffes bouffantes qui sortent de sous la tête
      const tuft = m => {
        const d = 'M13.4,26 Q11.2,29 11.8,31.8 Q11.2,34 13,35 Q13.4,36.8 15.4,36.6 Q17,37.6 18.2,36.2 Q19.6,35.4 18.8,33.4 L17.4,28.4 Z';
        const g = inner => `<g transform="translate(${m < 0 ? 48 : 0} 0) scale(${m} 1)">${inner}</g>`;
        return g(P(d, C.beard) + clip(`${ctx.id}t${m}`, d, `<rect x="15.4" y="24" width="6" height="14" fill="${C.beardS}"/><path d="M8,34.6 Q14,36.4 22,34 L22,40 L8,40 Z" fill="${C.beardS}"/>`)
          + P(d, 'none') + P('M13.6,30.6 Q13.4,33 14.6,34.6 M16,30.4 Q16.2,33 16.8,35', 'none', 0.5) + L([12.8, 31], [13.2, 33.2], C.beardH, 0.7));
      };
      s += tuft(1) + tuft(-1);
      s += P(back, C.skin) + clip(`${c.uid}h`, back, `<rect x="27" y="8" width="12" height="22" fill="${C.skinS}"/>`
        + `<path d="M8,24.4 Q24,28.2 40,24.4 L40,34 L8,34 Z" fill="${C.white}"/><path d="M8,28.6 Q24,31.8 40,28.6 L40,34 L8,34 Z" fill="${C.whiteS}"/>`) + P(back, 'none');
      s += P('M11.2,24.8 Q24,28.6 36.8,24.8', 'none', 0.6) + P('M16,27.4 Q16.6,29 18.2,29.6', 'none', 0.5) + P('M30.4,27.4 Q30,29 28.6,29.6', 'none', 0.5);
      s += P('M24.6,5.2 Q25.2,2.4 22.8,1.8 Q23,3.6 21.8,5 Z', C.wool, 0.8)
        + P('M11.6,16.4 Q11,5.4 24,4.8 Q37,5.4 36.4,16.4 Q24,19 11.6,16.4 Z', C.wool) + P('M11.2,14.6 Q24,17.4 36.8,14.6 L36.8,17.8 Q24,20.6 11.2,17.8 Z', C.wool, 0.9)
        + E(26.6, 9.6, 1.1, 0.85, '#5E2A15', 0.6) + P('M26,9.9 Q26.6,8 27.3,9.8', C.white, 0.5);
      return `<g transform="translate(0 ${HY})">${s}</g>`;
    }
    const se = view === 'se';
    const k = se ? -1.4 : 0;
    const sx = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
    const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
    const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
    // oreilles, touffes blanches sous le bonnet
    s += se ? E(35, 23.2, 1.7, 2.3, C.skin) : E(11.8, 22.8, 1.7, 2.3, C.skin) + E(36.2, 22.8, 1.7, 2.3, C.skin);
    s += P(sx('M12,16.8 Q9.6,18.6 10.6,21.6 Q11.6,19.6 13,19.6 Z'), C.white, 0.8) + P(sx('M36,16.8 Q38.4,18.6 37.4,21.6 Q36.4,19.6 35,19.6 Z'), C.white, 0.8);
    const cheeks = se ? [[15.2, 1.6], [28.2, 1.3]] : [[16.6, 1.7], [31.4, 1.7]];
    s += P(face, C.skin);
    s += clip(`${c.uid}f`, face, `<rect x="8" y="15" width="34" height="2.6" fill="${C.skinS}"/>`
      + cheeks.map(([x, r]) => E(x, 25.2, r * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.4 : 0.9, C.cheek, 0)).join('')
      + L([15.6 + k, 19.4], [17.6 + k, 19.8], C.skinS, 0.5) + L([30.4 + k, 19.8], [32.4 + k, 19.4], C.skinS, 0.5));
    s += P(face, 'none');
    s += woolCap(k);
    // barbe de lichen et moustache ; le gros nez rond par-dessus
    const beard = sx(BEARD);
    s += P(beard, C.beard) + clip(`${c.uid}b`, beard, `<rect x="${se ? 26 : 27.6}" y="24" width="10" height="26" fill="${C.beardS}"/>`
      + [18.6, 21.6, 24.6, 27.4].map(x => `<path d="M${r2(x + k)},31 Q${r2(x + k - 0.6)},36 ${r2(x + k + 0.4)},41" fill="none" stroke="${C.beardS}" stroke-width="0.5"/>`).join('')
      + `<rect x="${r2(16.6 + k)}" y="29" width="1.1" height="7" rx="0.5" fill="${C.beardH}"/>`) + P(beard, 'none');
    const mx = se ? 20.8 : 24;
    s += P(`M${r2(mx - 4.2)},27.2 Q${r2(mx - 2.4)},25 ${mx},26.2 Q${r2(mx + 2.4)},25 ${r2(mx + 4.2)},27.2 Q${r2(mx + 2.2)},28.4 ${mx},27.4 Q${r2(mx - 2.2)},28.4 ${r2(mx - 4.2)},27.2 Z`, C.beardH, 0.8);
    s += E(se ? 20.4 : 24, 24.6, 1.5, 1.3, C.nose, 0.8) + E(se ? 19.9 : 23.5, 24.2, 0.45, 0.35, '#FFFFFF', 0);
    s += expression({
      eyes: se ? [[17.2, 21.4, 1.4], [25.2, 21.4, 1.2]] : [[19.4, 21.4, 1.45], [28.6, 21.4, 1.45]], ry: 2.1,
      brow: C.white, browY: -3.4, browW: 1.9,
      // au repos : les yeux mi-clos sous les sourcils broussailleux, la bouche cachée sous la moustache (« Hm. »)
      restEyes: 'sleepy',
      mouth: [mx, 28.2], mw: 1.5, mouthC: C.mouth, tongue: C.tongue,
      neutral: (x, y) => `M${r2(x - 0.8)},${r2(y + 0.3)} L${r2(x + 0.8)},${r2(y + 0.3)}`,
      cheeks, cheekY: 25.2, temple: [se ? 9.6 : 8.8, 18.6], anger: [39.4, 6.6], zz: [37.4, 3.4]
    }, ctx);
    return `<g transform="translate(0 ${HY})">${s}</g>`;
  },

  pose({ pose, n }) {
    if (pose === 'salut') {
      // il lève le maillet en guise de bonjour
      const h = n === 0 ? [36.4, 30.8] : [37.6, 32.4];
      return { open: true, right: mallet(h, 180) + arm(this, [31.6, 38.8], h) };
    }
    // action : bloc de pierre à côté de lui ; il tient le ciseau dessus et lève le maillet, puis frappe
    const block = P('M3.6,47.8 L13.4,47.8 L13.4,57.4 L3.6,57.4 Z', C.stone) + P('M3.6,47.8 L5.4,45.8 L15.2,45.8 L13.4,47.8 Z', '#C2BDB2', 0.9)
      + P('M13.4,47.8 L15.2,45.8 L15.2,55.4 L13.4,57.4 Z', C.stoneS, 0.9);
    const rune = n ? `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${C.glow}" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>` : '';
    const runeLine = `<path d="M6.6,50 L8.6,54.6 L10.6,50 M8.6,49.6 L8.6,55.4" fill="none" stroke="${n ? '#E9FFFF' : OUT}" stroke-width="${n ? 0.9 : 0.6}" stroke-linecap="round"/>`;
    const left = chisel([14.4, 46.8], [11.4, 49.8]) + arm(this, [16.4, 38.8], [14.6, 46.6], [12.2, 42.4]);
    const sparks = n ? [[10.6, 43.4, 9.2, 41.6], [13.2, 42.6, 13.6, 40.4], [8.6, 45.8, 6.6, 45]].map(([a, b, x, y]) => L([a, b], [x, y], '#F2C94C', 0.8)).join('')
      + `<g transform="rotate(-12 6.4 41.4)">${E(6.4, 41.4, 1.1, 0.8, OUT, 0)}${L([7.35, 41.4], [7.35, 37.8], OUT, 0.6)}<path d="M7.35,37.8 Q9,38.4 8.6,39.8" fill="none" stroke="${OUT}" stroke-width="0.6" stroke-linecap="round"/></g>` : '';
    const right = n === 0
      ? mallet([34, 30.4], 160) + arm(this, [31.6, 38.8], [34, 30.4], [37, 36.6])
      : mallet([19.6, 44.6], 118) + arm(this, [31.6, 38.8], [19.6, 44.6], [33.4, 46.2]);
    return { expr: n ? 'content' : 'neutre', left: block + rune + runeLine + left, right: '', over: right + sparks };
  }
};
module.exports = galet;
