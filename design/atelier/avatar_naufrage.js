// L'avatar en naufragé (HISTOIRE.md § 6.17) : le même dessin que l'avatar (design/personnages/avatar.js), passé par
// la transformation des naufragés (naufrage.js) : habits délavés, lambeaux à l'ourlet, un trou, manches retroussées
// ou arrachées, pantalon retroussé (ou jambes nues sous le short, la jupe, la robe), pieds nus, une algue dans les
// cheveux (sauf s'il l'a enlevée : choix algue), du sable sur la joue. Il garde tout ce qu'il a choisi (choix de l'auteur, 15 oct.), les tissus délavés
// comme ses habits (naufrageChoix). L'avatar garde ce look
// jusqu'au Campement (fin du tutoriel), où Cannelle recoud ses habits.
const { avatar, naufrageChoix, verifier, shortLeg, delave, ACCESSOIRES, familleHaut, familleBas } = require('../personnages/avatar');
const { bareFoot, r2, OUT } = require('./troupe');
const { castaway, smudge } = require('./naufrage');

// L'algue prise dans les cheveux : un brin de varech, ruban plat et mouillé, posé au sommet du crâne qui
// retombe sur le côté en suivant la courbe de la tête. Ses bords ondulent, une nervure le suit, il se tord une fois
// (l'envers, plus sombre), il luit, et son bout se fend en deux. Il reste au sommet : juste dans toutes les vues, même
// quand le jeu retourne l'image.
const VARECH = { face: '#6F8A36', envers: '#4F6626', clair: '#A8BC5C', reflet: '#E9F2C4' };
// le point et la direction d'une courbe de Bézier quadratique en t
const bez = (p0, p1, p2, t) => [0, 1].map(i => (1 - t) ** 2 * p0[i] + 2 * (1 - t) * t * p1[i] + t * t * p2[i]);
const tan = (p0, p1, p2, t) => { const d = [0, 1].map(i => 2 * (1 - t) * (p1[i] - p0[i]) + 2 * t * (p2[i] - p1[i])), l = Math.hypot(...d) || 1; return [d[0] / l, d[1] / l]; };
// le ruban entre t0 et t1 : largeur w, bords ondulés (le bout effilé ou fendu se dessine à part)
function ruban(p0, p1, p2, t0, t1, w, n = 16) {
  const a = [], b = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + (t1 - t0) * i / n, [x, y] = bez(p0, p1, p2, t), [tx, ty] = tan(p0, p1, p2, t);
    const e = w * Math.min(1, t * 5) * (1 - 0.35 * t) * (1 + 0.09 * Math.sin(t * 22)) / 2;
    a.push([x - ty * e, y + tx * e]); b.push([x + ty * e, y - tx * e]);
  }
  return 'M' + a.concat(b.reverse()).map(([x, y]) => `${r2(x)},${r2(y)}`).join(' L') + ' Z';
}
function algue(view, c) {
  const ne = view === 'ne', k = view === 'se' ? -1 : 0, X = x => r2(x + k);
  const P = ne ? [[X(23.6), 7.8], [X(31.4), 7.6], [X(33.2), 16.4]] : [[X(24.4), 7.6], [X(16.6), 7.6], [X(14.6), 16.2]];
  const w = 2.4, [p0, p1, p2] = P.map(p => p.map(Number));
  const tout = ruban(p0, p1, p2, 0, 0.9, w), envers = ruban(p0, p1, p2, 0.46, 0.62, w);
  // le bout fendu : deux languettes qui s'écartent
  const [ex, ey] = bez(p0, p1, p2, 0.88), [tx, ty] = tan(p0, p1, p2, 0.88), L1 = 1.7, o = 0.55;
  const langue = s => `M${r2(ex - ty * o * s)},${r2(ey + tx * o * s)} Q${r2(ex + tx * L1 * 0.6 - ty * o * s * 1.8)},${r2(ey + ty * L1 * 0.6 + tx * o * s * 1.8)} ${r2(ex + tx * L1 - ty * o * s * 1.3)},${r2(ey + ty * L1 + tx * o * s * 1.3)} Q${r2(ex + tx * L1 * 0.5)},${r2(ey + ty * L1 * 0.5)} ${r2(ex + ty * 0.1 * s)},${r2(ey - tx * 0.1 * s)} Z`;
  const bouts = langue(1) + ' ' + langue(-1);
  const nervure = Array.from({ length: 9 }, (_, i) => bez(p0, p1, p2, 0.1 + i * 0.1)).map(([x, y], i) => `${i ? 'L' : 'M'}${r2(x)},${r2(y)}`).join(' ');
  const [hx, hy] = bez(p0, p1, p2, 0.22), [h2x, h2y] = bez(p0, p1, p2, 0.38);
  return `<path d="${bouts}" fill="${VARECH.face}" stroke="${OUT}" stroke-width=".5" stroke-linejoin="round"/>`
    + `<path d="${tout}" fill="${VARECH.face}" stroke="${OUT}" stroke-width=".55" stroke-linejoin="round"/>`
    + `<path d="${envers}" fill="${VARECH.envers}"/>`
    + `<path d="${nervure}" fill="none" stroke="${VARECH.clair}" stroke-width=".45" stroke-linecap="round" opacity=".9"/>`
    + `<path d="M${r2(hx)},${r2(hy - 0.5)} L${r2(h2x)},${r2(h2y - 0.55)}" stroke="${VARECH.reflet}" stroke-width=".55" stroke-linecap="round" opacity=".85"/>`
;
}

function avatarNaufrage(choix = {}, opts = {}) {
  const c = avatar(naufrageChoix(verifier(choix)), { ...opts, uid: (opts.uid || 'av') + 'n' });
  // les pièces nouvelles s'abîment comme leur famille (le bermuda comme le short…)
  const haut = familleHaut(c.o.haut), bas = familleBas(c.o.bas);
  const dy = c.dy;
  // les tissus se délavent (les bijoux et les montures, non)
  const tissus = Object.entries(c.o.accessoires).flatMap(([place, a]) => c.acc[place].filter((col, i) => ACCESSOIRES[a.id].zones[i] === 'tissu'));
  const fadeList = [c.top, c.topS, c.topH, c.tee, c.base, c.stripe, c.bas, c.basS, c.basH, c.cuff, ...tissus].filter(Boolean);
  // le haut et la jupe (ou la robe) se déchirent dans leur propre contour, le long de l'ourlet (avatar.js : dechirure)
  const robe = bas === 'robe' || bas === 'robeEntiere';
  // le trou : sur la bavette ou le corsage quand il y en a un devant (de dos, la robe seule couvre le haut du dos)
  const holeC = v => ((bas === 'salopette' && v !== 'ne') || robe ? c.basS : c.o.haut === 'mariniere' ? c.stripe : c.topS);
  const holes = { front: [[28.4, 39.8 + dy, 1.25, holeC('front')]], se: [[26.8, 40 + dy, 1.15, holeC('se')]], ne: [[20.2, 41.6 + dy, 1.2, holeC('ne')]] };
  const shift = s => (dy ? `<g transform="translate(0 ${dy})">${s}</g>` : s);
  // la graine de la déchirure : la même pour un même naufragé (son haut et son bas)
  const dechire = 1 + ((c.o.haut.length * 7 + c.o.bas.length * 3) % 9);
  const n = castaway(c, {
    flags: { dechire },
    fade: fadeList, leg: bas === 'pantalon' || bas === 'salopette' ? 'roll' : 'skin',
    // la robe d'une pièce garde ses manches courtes, comme le t-shirt
    sleeves: haut === 'tshirt' || haut === 'mariniere' || bas === 'robeEntiere' ? 'roll' : 'torn',
    sleeveCut: haut === 'tshirt' || bas === 'robeEntiere' ? 6.4 : haut === 'mariniere' ? 4.4 : 5,
    holes,
    rips: { front: [[19.6, 43.2 + dy, 2.4]], se: [[18.8, 43.4 + dy, 2.2]], ne: [[28.4, 43 + dy, 2.2]] },
    head: ({ view }) => shift((c.o.algue === 'non' ? '' : algue(view, c)) + (view === 'se' ? smudge(27.4, 27.6, '#C4A2B8') : view === 'front' ? smudge(30.4, 27.6, '#C4A2B8') : ''))
  });
  // le short délavé, effiloché au bas, par-dessus la jambe nue (castaway ne connaît que le pied)
  if (bas === 'short') {
    const worn = { bas: delave(c.bas), basS: delave(c.basS) };
    n.foot = (cc, x, y, dir, tilt) => shortLeg({ ...cc, ...worn }, x, true, y) + bareFoot(cc, x, y, dir, tilt);
  }
  return n;
}

module.exports = { avatarNaufrage };
