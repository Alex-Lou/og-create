// L'avatar en naufragé (HISTOIRE.md § 6.17) : le même dessin que l'avatar (design/personnages/avatar.js), passé par
// la transformation des naufragés (naufrage.js) : habits délavés, lambeaux à l'ourlet, un trou, manches retroussées
// ou arrachées, pantalon retroussé (ou jambes nues sous le short, la jupe, la robe), pieds nus, une algue dans les
// cheveux, du sable sur la joue. La mer garde les chapeaux, les sacs, ce qu'on tenait à la main, et efface le
// maquillage (ACCESSOIRES[id].garde) ; les lunettes, les bijoux, le foulard, le nœud restent. L'avatar garde ce look
// jusqu'au Campement (fin du tutoriel), où Cannelle recoud ses habits.
const { avatar, naufrageChoix, verifier, shortLeg, delave, ACCESSOIRES } = require('../personnages/avatar');
const { bareFoot } = require('./troupe');
const { castaway, weed, smudge } = require('./naufrage');

function avatarNaufrage(choix = {}, opts = {}) {
  const c = avatar(naufrageChoix(verifier(choix)), { ...opts, uid: (opts.uid || 'av') + 'n' });
  const { haut, bas } = c.o;
  const dy = c.dy;
  // les tissus se délavent (les bijoux et les montures, non)
  const tissus = Object.entries(c.o.accessoires).flatMap(([place, a]) => c.acc[place].filter((col, i) => ACCESSOIRES[a.id].zones[i] === 'tissu'));
  const fadeList = [c.top, c.topS, c.topH, c.tee, c.base, c.stripe, c.bas, c.basS, c.basH, c.cuff, ...tissus].filter(Boolean);
  // ce qui se voit à l'ourlet : le bas du haut (s'il n'est pas rentré), l'ourlet de la jupe ou de la robe
  const T = c.top === c.base ? c.top : c.base;
  const hemTop = bas === 'pantalon' || bas === 'short';
  const robe = bas === 'robe' || bas === 'robeEntiere';
  const jupe = bas === 'jupe' ? c.skirtHem : robe ? c.robeHem : null;
  const tatters = {};
  for (const [v, list, skirtX] of [
    ['front', [[17.4, 47.4, 2, 1], [29.4, 47.6, 2.2, 1.2]], [19.2, 29.4]],
    ['se', [[16.6, 47.2, 2, 1], [27.2, 47.6, 2, 1.1]], [17.8, 27.6]],
    ['ne', [[18.4, 47.4, 2, 1], [29.6, 47.2, 2.1, 1]], [19.6, 29.8]]
  ]) {
    tatters[v] = [
      ...(hemTop ? list.map(([x, y, w, k]) => [x, y + dy, T, w, k]) : []),
      ...(jupe ? [[skirtX[0], jupe + 0.6 + dy, c.bas, 2.1, 1], [skirtX[1], jupe + 0.8 + dy, c.bas, 2.2, 1.1]] : [])
    ];
  }
  // le trou : sur la bavette ou le corsage quand il y en a un devant (de dos, la robe seule couvre le haut du dos)
  const holeC = v => ((bas === 'salopette' && v !== 'ne') || robe ? c.basS : c.o.haut === 'mariniere' ? c.stripe : c.topS);
  const holes = { front: [[28.4, 39.8 + dy, 1.25, holeC('front')]], se: [[26.8, 40 + dy, 1.15, holeC('se')]], ne: [[20.2, 41.6 + dy, 1.2, holeC('ne')]] };
  const shift = s => (dy ? `<g transform="translate(0 ${dy})">${s}</g>` : s);
  const n = castaway(c, {
    fade: fadeList, leg: bas === 'pantalon' || bas === 'salopette' ? 'roll' : 'skin',
    // la robe d'une pièce garde ses manches courtes, comme le t-shirt
    sleeves: haut === 'tshirt' || haut === 'mariniere' || bas === 'robeEntiere' ? 'roll' : 'torn',
    sleeveCut: haut === 'tshirt' || bas === 'robeEntiere' ? 6.4 : haut === 'mariniere' ? 4.4 : 5,
    tatters, holes,
    rips: { front: [[19.6, 43.2 + dy, 2.4]], se: [[18.8, 43.4 + dy, 2.2]], ne: [[28.4, 43 + dy, 2.2]] },
    head: ({ view }) => shift(view === 'ne'
      ? weed('M30.4,10.6 Q33.2,14.4 32,19.4', [[32.4, 15, 24]])
      : view === 'se'
        ? weed('M13.4,11.6 Q15.8,15.2 14.6,20', [[14.8, 15.6, -20]]) + smudge(27.4, 27.6, '#A8885E')
        : weed('M14.2,11.8 Q16.8,15.4 15.6,20.2', [[15.8, 15.8, -20]]) + smudge(30.4, 27.6, '#A8885E'))
  });
  // le short délavé, effiloché au bas, par-dessus la jambe nue (castaway ne connaît que le pied)
  if (bas === 'short') {
    const worn = { bas: delave(c.bas), basS: delave(c.basS) };
    n.foot = (cc, x, y, dir, tilt) => shortLeg({ ...cc, ...worn }, x, true) + bareFoot(cc, x, y, dir, tilt);
  }
  return n;
}

module.exports = { avatarNaufrage };
