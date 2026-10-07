// Rivet, l'horloger-artificier : lunettes à quatre loupes relevées sur le crâne, tablier de cuir aux mille poches,
// chemise sarcelle, cheveux châtains en bataille et une mèche grise rebelle, un crayon derrière chaque oreille.
// Action : il abaisse une loupe sur son œil (œil géant) et examine un rouage ; image 2 : le rouage tourne, « Si ! Si ! ».
const { P, E, L, limb, clip, expression, arm, r2 } = require('./troupe');

const C = {
  skin: '#DDA57C', skinS: '#C08A62',
  hair: '#6B4A32', hairS: '#4F3524', hairH: '#8C6646', grey: '#CFCAC2', greyS: '#A8A29A',
  shirt: '#3F8A86', shirtS: '#2E6B68', collar: '#EFE6D6',
  leather: '#8A5A36', leatherS: '#6B4328', leatherH: '#A87650',
  brass: '#C9A24A', brassS: '#8E6E2C', glass: '#CFEAF0', strap: '#4A3426',
  steel: '#B8C0C8', steelS: '#8A949E', red: '#C8463A', wood: '#E2C28E',
  pencil: '#F2C94C', eraser: '#EE8F8F', cheek: '#EE9C8C', mouth: '#7A3B30', tongue: '#E07A72'
};

// Crayon : du bout caché (a) à la gomme (b)
const pencil = (a, b) => limb(a, b, 1.4, C.pencil) + E(b[0], b[1], 0.95, 0.95, C.eraser, 0.8);
// Une loupe : monture de laiton, verre, reflet
// Reflet blanc (trait sans contour)
const glint = (d, w) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="${w}" stroke-linecap="round"/>`;
const lens = (x, y, r) => E(x, y, r, r, C.brass, 0.9) + E(x, y, r * 0.68, r * 0.68, C.glass, 0.6)
  + glint(`M${r2(x - r * 0.42)},${r2(y - r * 0.1)} Q${r2(x - r * 0.36)},${r2(y - r * 0.4)} ${r2(x - r * 0.08)},${r2(y - r * 0.44)}`, 0.5);
// Rouage d'acier (rot : angle)
function gear(x, y, r, rot) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 + (rot * Math.PI) / 180;
    const rr = i % 2 ? r * 0.76 : r;
    pts.push(`${r2(x + rr * Math.cos(a))},${r2(y + rr * Math.sin(a))}`);
  }
  return P(`M${pts.join(' L')} Z`, C.steel, 0.8) + E(x, y, r * 0.42, r * 0.42, C.steelS, 0.7) + E(x, y, r * 0.16, r * 0.16, '#3C2819', 0);
}
// Tournevis : manche rouge en a, pointe en b
const screwdriver = (a, b) => limb([a[0] + (b[0] - a[0]) * 0.35, a[1] + (b[1] - a[1]) * 0.35], b, 0.6, C.steel)
  + limb(a, [a[0] + (b[0] - a[0]) * 0.4, a[1] + (b[1] - a[1]) * 0.4], 1.6, C.red);

const TORSO = 'M16,32.4 Q24,29.8 32,32.4 L33.2,46.6 Q24,48.8 14.8,46.6 Z';
const APRON = k => `M${18.6 + k},35.2 L${29.4 + k},35.2 L${30.6 + k},40 L${32.2 + k},52 Q${24 + k},53.8 ${15.8 + k},52 L${17.4 + k},40 Z`;

const rivet = {
  name: 'Rivet', uid: 'ri',
  skin: C.skin, sleeve: C.shirt, cuff: C.shirtS, armW: 3.8,
  leg: '#4A4E5C', legS: '#383B47', legW: 4.8, hip: 46, ground: 56.6,
  shoe: '#3E3330', shoeS: '#2A221F', shoeH: '#5E504A',
  legX: { front: [20.5, 27.5], se: [20, 27.6], ne: [21, 28] },
  shoulders: [[16, 34], [32, 34]], hands: [[14.4, 45], [33.6, 45]],
  action: ['face_loupe', 'front'],

  body(c, { view }) {
    let s = P(TORSO, C.shirt) + clip(`${c.uid}t`, TORSO, `<rect x="${view === 'se' ? 26.4 : 27.6}" y="30" width="10" height="20" fill="${C.shirtS}"/>`) + P(TORSO, 'none');
    if (view === 'ne') {
      // de dos : bretelles croisées et nœud du tablier
      s += limb([18.2, 32.8], [29, 41.2], 1.5, C.leather) + limb([29.8, 32.8], [19, 41.2], 1.5, C.leather);
      s += P('M24,41.4 Q20.6,39.2 20.4,41.6 Q20.6,43.8 24,41.4 Z', C.leather, 0.8) + P('M24,41.4 Q27.4,39.2 27.6,41.6 Q27.4,43.8 24,41.4 Z', C.leather, 0.8)
        + limb([23.6, 41.8], [22.4, 45.4], 0.9, C.leather) + limb([24.4, 41.8], [25.8, 45.2], 0.9, C.leather) + E(24, 41.4, 1, 0.9, C.leatherS, 0.8);
      return s;
    }
    // tablier de cuir : bavette rivetée, poche à outils, poche de poitrine avec crayon
    const k = view === 'se' ? -1.8 : 0;
    const ap = APRON(k);
    s += L([19 + k, 35.4], [18.2 + k * 0.5, 32.4], C.leatherS, 1.2) + L([29 + k, 35.4], [29.8 + k * 0.5, 32.4], C.leatherS, 1.2);
    s += limb([21 + k, 44], [20.4 + k, 40.2], 0.7, C.steel) + limb([20.4 + k, 40.8], [20.1 + k, 39.4], 1.5, C.red); // tournevis dans la poche
    s += `<rect x="${25.6 + k}" y="39.2" width="1.6" height="6" rx="0.3" fill="${C.wood}" stroke="#3C2819" stroke-width="0.6"/>`; // règle
    s += P(ap, C.leather) + clip(`${c.uid}a`, ap, `<rect x="${27.6 + k}" y="34" width="8" height="22" fill="${C.leatherS}"/>`
      + `<rect x="${18.4 + k}" y="35.8" width="1" height="15" rx="0.5" fill="${C.leatherH}"/>`) + P(ap, 'none');
    s += `<rect x="${19.2 + k}" y="43.2" width="9.6" height="5.6" rx="0.8" fill="${C.leatherS}" stroke="#3C2819" stroke-width="0.8"/>`
      + `<path d="M${20 + k},44.2 L${28 + k},44.2" stroke="${C.leatherH}" stroke-width="0.5" stroke-dasharray="0.8 0.6"/>`
      + L([24 + k, 43.4], [24 + k, 48.6], '#3C2819', 0.5);
    s += `<rect x="${21.6 + k}" y="36.4" width="4.6" height="3.4" rx="0.5" fill="${C.leatherS}" stroke="#3C2819" stroke-width="0.7"/>`
      + limb([22.6 + k, 37.6], [23.4 + k, 34.6], 0.8, C.pencil);
    for (const [x, y] of [[19.4, 35.9], [28.6, 35.9], [17.6, 40.4], [30.4, 40.4]]) s += E(x + k, y, 0.45, 0.45, C.brass, 0.4);
    s += L([17.4 + k, 40.6], [30.6 + k, 40.6], C.leatherS, 0.8);
    return s;
  },

  neck(c, { view }) {
    // de dos : la nuque (dans l'ombre) entre les mèches, rentrée sous le col
    if (view === 'ne') return P('M19.8,24 L28.2,24 L28.6,32.4 Q24,34.4 19.4,32.4 Z', C.skinS, 0) + P('M18.6,31.4 Q24,33.6 29.4,31.4 L29.4,33 Q24,35 18.6,33 Z', C.collar, 0.8);
    const k = view === 'se' ? -1.6 : 0;
    return P(`M${20.2 + k},31.6 L${23.8 + k},32.8 L${21.4 + k},34.8 Z`, C.collar, 0.8) + P(`M${27.8 + k},31.6 L${24.2 + k},32.8 L${26.6 + k},34.8 Z`, C.collar, 0.8);
  },

  head(c, ctx, act) {
    const { view } = ctx;
    // épi gris : la mèche rebelle qui jaillit du sommet
    const cowlick = P('M22.6,8.4 Q21.6,3.6 25.6,2.4 Q24.4,4.8 26.6,8 Z', C.grey, 0.9) + L([23.4, 7], [24.2, 4.2], C.greyS, 0.5);
    let s = '';
    if (view === 'ne') {
      // la tête descend aussi bas que de face : les mèches en bataille couvrent le haut des bras et le col,
      // la nuque se voit entre celles du milieu
      const back = 'M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.4,27.4 36.2,30.4 L35.8,32.8 L34.2,31.6 L33.2,33.8 L31.6,32 L30.2,33.8 L28.8,31.9 L27.2,33.4 Q25.6,31.2 24,30.2 Q22.4,31.2 20.8,33.4 L19.2,31.9 L18,33.8 L16.6,32 L15,33.8 L13.8,31.6 L12.2,32.8 L11.8,30.4 Q10.6,27.4 11,21 Z';
      s += cowlick + E(12.6, 23, 1.6, 2.2, C.skin);
      s += P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="4" width="34" height="30" fill="${C.hairS}"/><ellipse cx="22.4" cy="18.4" rx="13.8" ry="12.8" fill="${C.hair}"/>`) + P(back, 'none');
      s += P('M17.6,15 Q16.8,21 18.4,28.6', 'none', 0.6) + P('M24.6,15 Q25.4,21 24.2,28.4', 'none', 0.6) + P('M31,16.4 Q32,22 30.6,29.2', 'none', 0.6) + L([16.6, 10.2], [21.6, 8.6], C.hairH, 1.2);
      // sangle des lunettes autour du crâne, boucle de laiton
      s += P('M11.2,12.2 Q24,15.8 36.8,12.2 L37,14 Q24,17.6 11,14 Z', C.strap, 0.8) + `<rect x="22.6" y="14.6" width="2.8" height="2" rx="0.4" fill="${C.brass}" stroke="#3C2819" stroke-width="0.6"/>`;
      s += pencil([15.4, 20.6], [9.2, 19.2]);
      return s;
    }
    const se = view === 'se';
    const k = se ? -1.4 : 0;
    const sx = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
    const back = se ? 'M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z'
      : 'M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z';
    const fx = se ? 22.6 : 24, rx = se ? 11.2 : 11.6;
    const face = `M${fx - rx},21.6 a${rx},10.4 0 1,0 ${2 * rx},0 a${rx},10.4 0 1,0 ${-2 * rx},0 Z`;
    // frange en trois mèches ; celle de droite est grise
    const bangs = sx('M12,19.2 Q11.4,10 24,9.6 Q36.6,10 36.4,18.6 Q34.6,14.6 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q23,13.4 19.6,14.2 L19.4,17.4 Q16.6,14.2 14,16 Q12.6,17.4 12,19.2 Z');
    const grey = sx('M25,10 Q33.6,9.8 35.8,16.4 Q34.4,14.4 31.6,14 L32.2,17.4 Q29.4,13.6 26,13.8 L26.6,17 Q25.4,14.6 23.6,13.4 Q23.8,11 25,10 Z');
    // crayons glissés derrière les oreilles (on n'en voit que le bout et la gomme)
    s += cowlick + P(back, C.hair) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="6" fill="${C.hairS}"/>`) + P(back, 'none');
    s += se ? E(35, 23.2, 1.5, 2.1, C.skin) + pencil([33.4, 20.8], [39.2, 19.2])
      : E(11.8, 22.8, 1.5, 2.1, C.skin) + E(36.2, 22.8, 1.5, 2.1, C.skin) + pencil([14, 20.8], [7.8, 19.4]) + pencil([34, 20.8], [40.2, 19.4]);
    const cheeks = se ? [[15.2, 1.7], [28.2, 1.4]] : [[16.6, 1.8], [31.4, 1.8]];
    s += P(face, C.skin);
    s += clip(`${c.uid}f`, face, `<path d="${bangs}" fill="${C.skinS}" transform="translate(0 1.4)"/>`
      + cheeks.map(([x, r]) => E(x, 26.2, r * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.5 : 1.05, C.cheek, 0)).join(''));
    s += P(face, 'none');
    s += P(bangs, C.hair) + P(grey, C.grey, 0.8) + L([15 + k, 12.6], [20 + k, 11], C.hairH, 1.2) + L([26.4 + k, 12.2], [29.4 + k, 12.6], '#F2EFEA', 0.9);
    // lunettes relevées sur le crâne : sangle, deux grandes loupes et une petite empilée sur chacune
    // (pendant l'action, celle de droite est baissée sur l'œil)
    s += P(se ? 'M12.2,14.6 Q24,6.4 36.8,14.2 L37,16.4 Q24,8.6 12,16.8 Z' : 'M11.8,14.6 Q24,6.6 36.2,14.6 L36.4,16.8 Q24,8.8 11.6,16.8 Z', C.strap, 0.8);
    const big = se ? [[17.8, 10.8, 2.8], [26.6, 10.4, 2.5]] : [[19.4, 10.8, 2.9], [28.6, 10.8, 2.9]];
    const small = se ? [[16, 8.6, 1.8], [28.4, 8.2, 1.6]] : [[17.4, 8.6, 1.9], [30.6, 8.6, 1.9]];
    big.forEach(([x, y, r], i) => {
      if (act.lensDown && i === 1) return;
      s += lens(x, y, r) + lens(small[i][0], small[i][1], small[i][2]);
    });
    s += expression({
      eyes: se ? [[17.2, 22.6, 1.55], [25.2, 22.6, 1.35]] : [[19.4, 22.6, 1.6], [28.6, 22.6, 1.6]], ry: 2.35,
      brow: '#3B271B', browY: -4, browW: 1.3,
      mouth: [se ? 20.8 : 24, 27.2], mw: 1.8, mouthC: C.mouth, tongue: C.tongue,
      // au repos : absorbé, un demi-sourire (il pense déjà à autre chose)
      neutral: (mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.6)} L${r2(mx + 0.7)},${r2(my + 0.6)} Q${r2(mx + 1.3)},${r2(my + 0.6)} ${r2(mx + 1.6)},${r2(my + 0.1)}`,
      cheeks, cheekY: 26.2, temple: [se ? 13 : 13.6, 20.4], anger: [40.6, 7.4], zz: [37, 8.4]
    }, ctx);
    return s;
  },

  pose({ pose, n, view }) {
    if (pose === 'salut') {
      return { open: true, right: arm(this, [32, 34], n === 0 ? [37.4, 25.4] : [38.8, 27.4]) };
    }
    // action : la loupe droite baissée sur l'œil (œil géant), un rouage levé ; image 2 : il tourne, eurêka
    // (de trois quarts, la loupe suit l'œil proche ; de dos, on ne voit ni la loupe ni l'œil)
    const [x, y] = [view === 'se' ? 25.2 : 28.6, 22.8];
    const eye = n === 0
      ? E(x, y, 2.3, 3, '#2A2420', 0) + E(x + 0.8, y - 1.3, 0.9, 0.9, '#FFFFFF', 0) + E(x - 0.7, y + 1.3, 0.45, 0.45, '#FFFFFF', 0)
      : P(`M${x - 2.6},${y + 1.2} Q${x},${y - 2} ${x + 2.6},${y + 1.2}`, 'none', 1.4);
    const loupe = L([31.4, 13.6], [31, 19.4], C.brassS, 0.9)
      + E(x, y, 3.6, 3.6, C.brass, 0.9) + E(x, y, 2.9, 2.9, C.skin, 0) + eye
      + `<ellipse cx="${x}" cy="${y}" rx="2.9" ry="2.9" fill="${C.glass}" fill-opacity="0.35"/>`
      + glint(`M${r2(x - 1.8)},${r2(y - 0.6)} Q${r2(x - 1.6)},${r2(y - 1.8)} ${r2(x - 0.4)},${r2(y - 2.1)}`, 0.6)
      + E(x, y, 2.9, 2.9, 'none', 0.8);
    const g = gear(36.2, 25, 2.8, n ? 22.5 : 0)
      + (n ? L([39.8, 21], [41.2, 19.6], '#3C2819', 0.6) + L([40.6, 24.2], [42.4, 23.8], '#3C2819', 0.6) + L([37.8, 20.6], [38.2, 18.8], '#3C2819', 0.6) : '');
    const right = arm(this, [32, 34], [35.8, 28.6], [37.6, 36.4]);
    const left = arm(this, [16, 34], [14.4, 45]) + screwdriver([14.4, 44.2], [12.8, 50.2]);
    if (view === 'ne') return { expr: n ? 'rire' : 'neutre', left, right: '', over: g + right };
    return { expr: n ? 'rire' : 'neutre', lensDown: true, left, right: '', over: loupe + g + right };
  }
};
module.exports = rivet;
