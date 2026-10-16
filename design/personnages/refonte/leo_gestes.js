// Léo (anciennement Ondin ; fichiers du jeu : ondin) : les gestes du petit sourcier. Même branchement que les gestes de
// l'atelier (atelier/gestes.js) : chaque geste rend Léo prêt à passer à troupe.frame(…, vue, 'action', n) ; n va de 0 à
// 3 (quatre images). Sa magie est la sourcellerie : sa baguette trouve l'eau, et les choses perdues (HISTOIRE.md).
//   sourcier : la baguette à deux mains, la pointe en l'air ; elle frémit, tremble, puis plonge : l'eau jaillit du sol,
//     il se réveille d'un coup (« Là ! Ça tire ! ») ;
//   chercher : la baguette balaie à gauche, à droite, puis plonge vers ce qui brille au sol (une clé : « Je trouverai
//     toujours ce que tu as perdu. ») ;
//   bulle : il lève le bocal à hauteur des yeux et regarde Bulle nager (ou le bocal vide : « Bulle est retourné dans la
//     mer. ») ;
//   lune : la paume levée vers la lune, il lui chuchote ;
//   bailler : il bâille, la main devant la bouche, s'endort debout, puis sursaute.
// Ses bras d'enfant sont courts (membres.js : ils ne s'allongent pas) : tout ce qu'il tient reste à portée de ses mains.
// a, b : ses épaules, à gauche et à droite de l'écran.
const { OUT, E, P, L, r2, limb, arm } = require('../troupe');
const { pal, marks, baguette, bocal, goutte, HY } = require('./leo_refonte');

// le poing qui tient (un rond de peau), redessiné par-dessus ce qu'il serre
const poing = (c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin);

// La baguette tenue à deux mains : chaque branche de la fourche part d'un poing, elles se rejoignent en j ; la tige va
// jusqu'à la pointe ; la feuille sur la branche de gauche
function fourche(K, hl, hr, tip) {
  const j = [(hl[0] + hr[0]) / 2 + (tip[0] - (hl[0] + hr[0]) / 2) * 0.18, (hl[1] + hr[1]) / 2 + (tip[1] - (hl[1] + hr[1]) / 2) * 0.18];
  return limb(hl, j, 1.1, K.wood) + limb(hr, j, 1.1, K.wood) + limb(j, tip, 1.25, K.wood)
    + L([j[0] + (tip[0] - j[0]) * 0.45 - 0.2, j[1] + (tip[1] - j[1]) * 0.45], [j[0] + (tip[0] - j[0]) * 0.6 - 0.1, j[1] + (tip[1] - j[1]) * 0.6], K.bark, 0.45)
    + `<g transform="rotate(-30 ${r2(hl[0] + 0.6)} ${r2(hl[1] - 0.6)})">${P(`M${r2(hl[0] + 0.6)},${r2(hl[1] - 0.6)} q-1.3,-1.1 -2.6,0 q1.3,1.1 2.6,0 Z`, K.leaf, 0.5)}</g>`;
}
// le frémissement de la baguette : deux petits traits de part et d'autre de la pointe
const fremit = (tip, fort) => [-1, 1].map(s => L([tip[0] + s * 1.2, tip[1] - 0.6], [tip[0] + s * (fort ? 2.6 : 2), tip[1] - (fort ? 1.6 : 1.1)], OUT, 0.5)).join('');
// l'eau qui jaillit du sol, là où la pointe plonge : deux gouttes, une flaque claire
const jaillit = (K, x, y) => E(x, y + 0.4, 3.4, 0.9, K.water, 0.5) + goutte(x - 2.2, y - 3.4, 0.9) + goutte(x + 2.4, y - 2.8, 0.8) + goutte(x + 0.2, y - 5, 0.7);
// ce qui brille au sol : une vieille clé de fer, son éclat
const cle = (x, y) => E(x - 1.6, y - 0.6, 1.2, 1.2, 'none', 0.8) + L([x - 0.5, y - 0.4], [x + 2.6, y - 0.2], OUT, 1.6) + L([x - 0.5, y - 0.4], [x + 2.6, y - 0.2], '#C9A24A', 0.8)
  + L([x + 1.8, y - 0.2], [x + 1.8, y + 0.8], OUT, 0.8) + L([x + 2.5, y - 0.2], [x + 2.5, y + 0.6], OUT, 0.8)
  + [[0, -1], [0.75, -0.65], [-0.75, -0.65]].map(([dx, dy]) => L([x + 0.8 + dx * 1.6, y - 2 + dy * 1.6], [x + 0.8 + dx * 2.8, y - 2 + dy * 2.8], '#F2C94C', 0.55)).join('');

// ---- sourcier ----
function sourcier({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['veille', 'concentree', 'concentree', 'reveil'][i];
  // les deux poings devant la poitrine, à portée ; la pointe en l'air, puis qui plonge vers le sol devant lui
  const hl = se ? [18.8, 45.2] : [21.2, 45.4], hr = se ? [24, 45.6] : [26.8, 45.4];
  // (de face, la pointe monte en biais vers sa gauche, hors de la silhouette : pointée droit vers nous, elle ne se lirait
  // plus)
  const leve = se ? [12.4, 37.4] : [37.4, 34.4], sol = se ? [12.2, 57.6] : [24.6, 56.6];
  const tip = i === 3 ? sol : [leve[0] + (i === 2 ? (se ? -0.4 : 0.5) : 0), leve[1] + (i === 2 ? 0.4 : 0)];
  if (view === 'ne') {
    // de dos : la baguette est devant lui, cachée ; les poings remontent contre sa poitrine, les coudes s'écartent et
    // dépassent de chaque côté du ciré (ses bras d'enfant sont courts : les poings plus bas, les coudes resteraient cachés,
    // et il n'aurait plus de bras), puis au dernier temps l'eau jaillit de chaque côté
    const u = i === 3 ? 1 : 0;
    return { expr, left: '', right: '', under: arm(this, a, [a[0] + 2.8, a[1] + 4.4 + u * 1.2], [a[0] - 3.6, a[1] + 5]) + arm(this, b, [b[0] - 2.8, b[1] + 4.4 + u * 1.2], [b[0] + 3.6, b[1] + 5]),
      over: i === 3 ? goutte(10.6, 57.4, 0.9) + goutte(37.6, 57, 0.9) : '' };
  }
  const tiges = fourche(K, hl, hr, tip) + (i === 1 || i === 2 ? fremit(tip, i === 2) : '') + (i === 3 ? jaillit(K, sol[0], sol[1] + 3) : '');
  // (la baguette par-dessus les bras, les poings par-dessus la baguette : on la voit tenue)
  return { expr, left: '', right: '', over: arm(this, a, hl, [a[0] - 2.4, a[1] + 5.4]) + arm(this, b, hr, [b[0] + 2.4, b[1] + 5.4]) + tiges + poing(this, hl) + poing(this, hr) };
}

// ---- chercher ce qui est perdu ----
// la baguette dans la main droite, tendue devant lui : elle balaie à gauche (0), à droite (1), hésite (2), puis plonge
// vers le sol, où quelque chose brille (3)
function chercher({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['concentree', 'concentree', 'pensive', 'emerveillee'][i];
  // la main droite (à gauche de l'écran) devant la poitrine ; la rotation de la baguette autour du poing
  const h = se ? [19.2, 44.2] : [20.6, 44.4];
  const rot = [-55, 40, -10, 0][i];
  const trouve = se ? [12.4, 58] : [19.4, 58.4];
  const g = arm(this, b, this.hands[1]);
  if (view === 'ne') {
    // de dos, sa main droite est à droite de l'écran : elle tient la baguette devant lui (cachée, sauf la pointe quand elle
    // balaie de son côté), le coude dépasse ; la gauche pend
    const hd = [b[0] - 2.8, b[1] + 4.4];
    return { expr, left: arm(this, a, this.hands[0]), right: '', under: (i === 3 ? '' : baguette(K, hd, 1, -rot)) + arm(this, b, hd, [b[0] + 3.6, b[1] + 5]), over: i === 3 ? cle(31.6, 57) : '' };
  }
  const tige = i === 3 ? fourche(K, h, [h[0] + 1.6, h[1] + 0.4], [trouve[0] + 0.6, trouve[1] - 3.4]) : baguette(K, h, -1, rot);
  return { expr, left: '', right: g, over: (i === 3 ? cle(trouve[0], trouve[1]) : '') + tige + arm(this, a, h, [a[0] - 2.2, a[1] + 5.6]) };
}

// ---- Bulle ----
// le bocal levé à deux mains, à hauteur des yeux (sous le menton : ses bras sont courts) ; il le redescend un peu au
// dernier temps
function bulle({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), M = marks(this), i = n % 4, se = view === 'se';
  const revenu = M.bulle;
  const expr = revenu ? ['veille', 'tendresse', 'sourire', 'tendresse'][i] : ['veille', 'triste', 'pensive', 'veille'][i];
  const x = se ? 20.4 : 24, y = [46.4, 41.2, 41, 43.2][i];
  if (view === 'ne') return { expr, left: '', right: '', under: arm(this, a, [x - 2.6, y + 0.4], [a[0] - 2.4, a[1] + 5]) + arm(this, b, [x + 2.6, y + 0.4], [b[0] + 2.4, b[1] + 5]) };
  // (le bocal à la main n'est plus à la ceinture : leo_refonte.js ne le dessine pas pendant ce geste)
  const verre = bocal(K, x, y, revenu) + (revenu && i === 2 ? E(x + 0.6, y - 4.2, 0.45, 0.45, '#FFFFFF', 0.3) + E(x + 1.4, y - 6, 0.32, 0.32, '#FFFFFF', 0.25) : '');
  return { expr, left: '', right: '', over: verre + arm(this, a, [x - 2.6, y + 0.4], [a[0] - 2.6, a[1] + 5.2]) + arm(this, b, [x + 2.6, y + 0.4], [b[0] + 2.6, b[1] + 5.2]) };
}

// ---- parler à la lune ----
// la paume levée vers le croissant de lune, en haut à gauche ; il chuchote (trois petits points qui montent) ; la
// baguette reste dans l'autre main
const croissant = (x, y, r) => P(`M${r2(x)},${r2(y - r)} A${r},${r} 0 1,0 ${r2(x)},${r2(y + r)} A${r2(r * 0.75)},${r2(r * 0.85)} 0 1,1 ${r2(x)},${r2(y - r)} Z`, '#F7E9A8', 0.7);
function lune({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['pensive', 'emerveillee', 'tendresse', 'emerveillee'][i];
  const lever = [0, 1, 1, 0.8][i];
  const h = [r2(a[0] - 2.6 - lever * 1.4), r2(a[1] - 4 - lever * 3.6)];
  const paume = P(`M${r2(h[0] - 1.8)},${r2(h[1] + 0.4)} Q${r2(h[0] - 1.6)},${r2(h[1] - 1.8)} ${r2(h[0] + 0.2)},${r2(h[1] - 2.2)} Q${r2(h[0] + 1.8)},${r2(h[1] - 1.6)} ${r2(h[0] + 1.6)},${r2(h[1] + 0.6)} Q${h[0]},${r2(h[1] + 1.8)} ${r2(h[0] - 1.8)},${r2(h[1] + 0.4)} Z`, this.hand || this.skin, 0.8);
  const ciel = croissant(6.4, 6.6, 2.6) + (i % 2 ? E(9.8, 3.4, 0.45, 0.45, '#FFFFFF', 0) : E(3.4, 10.4, 0.4, 0.4, '#FFFFFF', 0));
  // le chuchotement : un, deux, trois petits points qui montent de sa bouche vers la lune (la bouche : sa tête d'enfant
  // est posée plus bas, HY)
  const bx = se ? 18.4 : 21.4, by = 27 + HY;
  const chut = [[0, 0], [-1.4, -1.6], [-2.8, -3.4]].slice(0, i).map(([dx, dy], j) => E(bx + dx, by + dy, r2(0.4 - j * 0.06), r2(0.4 - j * 0.06), '#FFFFFF', 0.3)).join('');
  const droite = baguette(K, this.hands[1], 1) + arm(this, b, this.hands[1]);
  if (view === 'ne') return { expr, left: arm(this, a, h, [a[0] - 3.4, a[1] - 1.4], paume), right: droite, over: ciel };
  return { expr, left: arm(this, a, h, [a[0] - 3.4, a[1] - 1.4], paume), right: droite, over: ciel + chut };
}

// ---- bâiller ----
// il bâille, la main devant la bouche (0, 1), s'endort debout (2 : les Zzz), puis sursaute (3)
function bailler({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se';
  const expr = ['epuisee', 'baille', 'endormie', 'reveil'][i];
  const droite = baguette(K, this.hands[1], 1, i === 2 ? 14 : 0) + arm(this, b, this.hands[1]);
  // la main devant la bouche (la bouche est basse : sa tête d'enfant est posée plus bas, HY)
  const bouche = se ? [20.6, 33.4] : [23.4, 33.6];
  if (i === 1) return { expr, left: '', right: droite, over: arm(this, a, bouche, [a[0] - 3, a[1] + 3]) };
  if (view === 'ne') return { expr, left: arm(this, a, this.hands[0]), right: droite };
  // le sursaut : les deux bras qui s'écartent un instant
  if (i === 3) return { expr, left: arm(this, a, [a[0] - 4.6, a[1] + 6.8], [a[0] - 3.2, a[1] + 3.2]), right: baguette(K, [b[0] + 4.6, b[1] + 6.8], 1, -20) + arm(this, b, [b[0] + 4.6, b[1] + 6.8], [b[0] + 3.2, b[1] + 3.2]) };
  return { expr, left: arm(this, a, this.hands[0]), right: droite };
}

const GESTES = { sourcier, chercher, bulle, lune, bailler };
// Léo et son geste : à passer à troupe.frame(…, vue, 'action', n) ; la baguette reste dans sa main là où le geste ne la
// prend pas
const avec = (c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] });

module.exports = { GESTES, avec, fourche, cle };
