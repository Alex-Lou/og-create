// Maerys (anciennement Sylve ; fichiers du jeu : sylve) : les gestes de la gardienne des bois. Même branchement que les
// gestes de l'atelier (atelier/gestes.js) et que ceux de Léo : chaque geste rend Maerys prête à passer à
// troupe.frame(…, vue, 'action', n) ; n va de 0 à 3 (quatre images). Sa magie : elle chante aux graines pour les faire
// pousser, et comprend les bêtes (HISTOIRE.md).
//   chanter : les mains en coupe, une graine dedans ; elle chante, les notes montent, la pousse sort et ouvre ses deux
//     feuilles, elle rit (naufragée, son don oublié : la graine ne germe pas) ;
//   oiseau : elle lève la main droite, un rouge-gorge vient s'y poser et chante ;
//   cachee : farouche, elle se cache le visage dans les mains, regarde entre ses doigts, puis se cache en riant ;
//   lanterne : la lanterne des Anciens de La Lisière, levée ; pas de flamme (elle a peur du feu) : une lueur et des
//     lucioles (« la lumière avant le feu ») ;
//   bois : le bois mort qu'elle rapporte (on ne coupe pas ses arbres) : une branche tombée, le fagot noué de liane.
// a, b : ses épaules, à gauche et à droite de l'écran ; de face et de trois quarts, sa main droite est à gauche de
// l'écran, de dos à droite.
const { OUT, E, P, L, r2, limb, arm } = require('../troupe');
const { pal, marks, feuille, liane } = require('./maerys_refonte');

// de dos, les mains devant elle (comme les sprites vus de dos des jeux en 2D) : le haut du bras descend le long du flanc,
// par-dessus la cape, jusqu'au coude plié ; l'avant-bras part vers l'avant, caché par son corps. e : le coude par rapport
// à l'épaule de gauche (la droite en miroir) ; à passer en « over » du geste
const coudesDeDos = (c, e) => { const [a, b] = c.shoulders; return arm(c, a, [r2(a[0] + e[0]), r2(a[1] + e[1])], undefined, '', 'epaule') + arm(c, b, [r2(b[0] - e[0]), r2(b[1] + e[1])], undefined, '', 'epaule'); };
// de dos, les mains levées au visage : le haut des deux bras seul, levé, le coude écarté par-dessus les pointes des
// cheveux (les mains, devant le visage, sont cachées par sa tête)
const brasLeves = (c, dx, dy) => { const [a, b] = c.shoulders; return arm(c, a, [r2(a[0] + dx), r2(a[1] + dy)], undefined, '', 'epaule') + arm(c, b, [r2(b[0] - dx), r2(b[1] + dy)], undefined, '', 'epaule'); };
// le poing qui tient (un rond de peau), redessiné par-dessus ce qu'il serre
const poing = (c, h) => E(h[0], h[1], 2.1, 2.1, c.hand || c.skin);
// Une note de musique (la tête ronde, la hampe, le crochet), penchée ; mir : l'image sera retournée par le jeu, la note
// l'est d'avance sur elle-même (son crochet retombe dans le bon sens)
const note = (x, y, a = -12, mir = false) => `<g transform="${mir ? `translate(${r2(2 * x)} 0) scale(-1 1) ` : ''}rotate(${mir ? -a : a} ${r2(x)} ${r2(y)})">${E(x, y, 1.05, 0.78, OUT, 0)}${L([x + 0.9, y], [x + 0.9, y - 3.4], OUT, 0.55)}`
  + `<path d="M${r2(x + 0.9)},${r2(y - 3.4)} Q${r2(x + 2.5)},${r2(y - 2.8)} ${r2(x + 2.1)},${r2(y - 1.5)}" fill="none" stroke="${OUT}" stroke-width="0.55" stroke-linecap="round"/></g>`;
// La paume ouverte, doigts en haut (vue de face) ; k : le côté du pouce (1 : vers la droite de l'écran)
function paume(c, [x, y], k) {
  const f = c.hand || c.skin;
  return E(x + k * 1.75, y + 0.6, 0.85, 1.25, f, 0.8)
    + P(`M${r2(x - 1.7)},${r2(y + 1.4)} L${r2(x - 1.7)},${r2(y - 0.9)} Q${r2(x - 1.7)},${r2(y - 2.5)} ${x},${r2(y - 2.5)} Q${r2(x + 1.7)},${r2(y - 2.5)} ${r2(x + 1.7)},${r2(y - 0.9)} L${r2(x + 1.7)},${r2(y + 1.4)} Q${x},${r2(y + 2.6)} ${r2(x - 1.7)},${r2(y + 1.4)} Z`, f, 0.85)
    + [-0.6, 0.6].map(d => L([x + d, y - 2.1], [x + d, y - 1], OUT, 0.4)).join('');
}

// ---- chanter à la graine ----
// les deux mains en coupe devant la poitrine ; la graine dedans, puis la pousse
function chanter({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), M = marks(this), i = n % 4, se = view === 'se';
  const don = M.don !== false;
  const expr = don ? ['chante', 'chante', 'emerveillee', 'rire'][i] : ['chante', 'chante', 'pensive', 'triste'][i];
  // les notes qui montent de sa bouche, de plus en plus haut (de dos, au-dessus de sa tête)
  // (de dos, du côté sans la plume : avant que le jeu retourne l'image, la plume de dos passe de l'autre côté, les notes
  // aussi)
  const nt = view === 'ne' ? [[36.4, 12.6], [39.6, 7.4], [33.2, 4.6]].map(([x, y]) => [this.miroir ? 48 - x : x, y]) : [[35.6, 27.2], [42.2, 24.6], [41.6, 16.4]];
  const notes = nt.slice(0, i === 0 ? 1 : i === 1 ? 2 : 3).map(([x, y], j) => note(x, y - (i % 2) * 0.6, j % 2 ? 10 : -12, !!this.miroir)).join('');
  if (view === 'ne') {
    // de dos : les mains en coupe devant elle, cachées ; les coudes dépassent de chaque côté ; les notes au-dessus
    return { expr, left: coudesDeDos(this, [-1.8, 6.6]), right: '', over: notes };
  }
  // (haut, contre la poitrine : les coudes s'écartent, la coupe ne se perd pas dans le nœud de la liane)
  const cx = se ? 22.2 : 24, hy = 39.4;
  const hl = [cx - 2.4, hy], hr = [cx + 2.4, hy];
  // la coupe : les deux mains jointes, les pouces repliés au-dessus
  const coupe = P(`M${r2(cx - 4.3)},${r2(hy - 0.9)} Q${r2(cx - 4.1)},${r2(hy + 3)} ${cx},${r2(hy + 3.3)} Q${r2(cx + 4.1)},${r2(hy + 3)} ${r2(cx + 4.3)},${r2(hy - 0.9)} Q${cx},${r2(hy + 0.5)} ${r2(cx - 4.3)},${r2(hy - 0.9)} Z`, this.hand || this.skin, 0.85)
    + P(`M${r2(cx - 3.4)},${r2(hy - 0.6)} Q${r2(cx - 2)},${r2(hy - 1.4)} ${r2(cx - 0.8)},${r2(hy - 0.2)}`, 'none', 0.45) + P(`M${r2(cx + 3.4)},${r2(hy - 0.6)} Q${r2(cx + 2)},${r2(hy - 1.4)} ${r2(cx + 0.8)},${r2(hy - 0.2)}`, 'none', 0.45)
    + L([cx, hy + 0.6], [cx, hy + 2.6], OUT, 0.4);
  // la graine, puis la pousse : la tige qui sort, ses deux feuilles qui s'ouvrent
  const graine = E(cx, hy - 0.2, 1, 0.75, K.twig, 0.6) + E(cx - 0.3, hy - 0.45, 0.3, 0.2, '#C9A27A', 0);
  const h = don ? [0, 0, 2.6, 4.4][i] : 0;
  const tige = h ? L([cx, hy - 0.4], [cx, hy - 0.4 - h], OUT, 1.5) + L([cx, hy - 0.4], [cx, hy - 0.4 - h], K.vine, 0.75)
    + feuille(cx, hy - 0.2 - h, i === 3 ? 3.4 : 2.2, i === 3 ? 1.4 : 1, 125, K.leaf, K.leafS) + feuille(cx, hy - 0.2 - h, i === 3 ? 3.4 : 2.2, i === 3 ? 1.4 : 1, -125, K.leafH, K.leafS) : '';
  return {
    expr, left: '', right: '',
    over: arm(this, a, hl, [a[0] - 3.4, a[1] + 3.8], '') + arm(this, b, hr, [b[0] + 3.4, b[1] + 3.8], '') + coupe + graine + tige + notes
  };
}

// ---- parler aux bêtes : le rouge-gorge ----
// Le rouge-gorge : le dos brun, la gorge orange, l'œil noir ; vol : les ailes levées ; m : -1 tourné vers la gauche
function rougeGorge(x, y, vol, m = 1) {
  const s = (vol ? `<path d="M-0.4,-0.6 Q-2.6,-3.8 -4.2,-2.4 Q-2.6,-1.4 -1.2,0.2 Z" fill="#7A5A3E" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` : '')
    + P('M-2.6,0.6 L-4.4,1.6 L-4,0.2 Z', '#6E4E34', 0.5)
    + E(0, 0, 2.6, 2.1, '#8A6A48', 0.7) + P('M0.4,-1.2 Q2.8,-0.6 2.2,1.2 Q1.2,2.2 0,1.6 Q0.6,0.2 0.4,-1.2 Z', '#E2783A', 0)
    + E(1.6, -1.6, 1.3, 1.2, '#8A6A48', 0.7) + P('M1.6,-1.2 Q2.8,-1 2.6,0 Q1.8,0.4 1.4,-0.4 Z', '#E2783A', 0)
    + E(2, -1.9, 0.32, 0.32, OUT, 0) + P('M2.8,-1.7 L3.8,-1.5 L2.8,-1.2 Z', '#4A3A2A', 0.3)
    + (vol ? `<path d="M0,-0.6 Q-1,-4.4 -3,-3.8 Q-1.8,-2 -0.6,0 Z" fill="#9A7A56" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>` : P('M-1.8,-0.2 Q-0.4,-1 0.8,0.2 Q-0.4,0.8 -1.8,-0.2 Z', '#7A5A3E', 0.45))
    + (vol ? '' : L([0.4, 2], [0.2, 2.9], OUT, 0.45) + L([1, 2], [1.1, 2.9], OUT, 0.45));
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${m} 1)">${s}</g>`;
}
function oiseau({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, dos = view === 'ne';
  const expr = ['emerveillee', 'sourire', 'tendresse', 'rire'][i];
  // la main droite levée, l'index tendu (le perchoir) ; de dos, sa droite est à droite de l'écran
  const s = dos ? b : a, d = dos ? 1 : -1;
  const lever = [0.6, 1, 1, 1][i];
  const h = [r2(s[0] + d * 3.4), r2(s[1] - 4.2 - lever * 2.4)];
  const doigt = poing(this, h) + L([h[0] + d * 1.2, h[1] - 0.6], [h[0] + d * 3.4, h[1] - 1.2], OUT, 1.5) + L([h[0] + d * 1.2, h[1] - 0.6], [h[0] + d * 3.2, h[1] - 1.15], this.hand || this.skin, 0.75);
  const leve = arm(this, s, h, [r2(s[0] + d * 4.6), r2(s[1] + 0.8)], doigt);
  const repos = dos ? arm(this, a, this.hands[0]) : arm(this, b, this.hands[1]);
  // le rouge-gorge : il arrive en volant (0), se pose (1), se tient sur le doigt (2), chante (3 : la note au-dessus de lui)
  const perche = [h[0] + d * 2.6, h[1] - 3.6];
  const [bx, by, vol] = [[d > 0 ? 42 : 6, 8, true], [perche[0] + d * 2.4, perche[1] - 3.2, true], [...perche, false], [...perche, false]][i];
  const bete = rougeGorge(bx, by, vol, -d) + (i === 3 ? note(perche[0] + d * 3.6, perche[1] - 5.2, d > 0 ? 12 : -12, !!this.miroir) : '');
  // (de face et de trois quarts, la main levée passe devant ses cheveux, plus larges que ses épaules : par-dessus la tête)
  // (le bras levé passe par-dessus ses cheveux : de face devant eux, de dos à côté de sa tête)
  return dos ? { expr, left: repos, right: '', over: leve + bete } : { expr, left: '', right: repos, over: leve + bete };
}

// ---- se cacher ----
// farouche : les mains sur les yeux (0), elle regarde entre ses doigts d'un œil (1), puis des deux (2, les mains
// descendent sur ses joues), et se cache de nouveau en riant (3)
function cachee({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, se = view === 'se';
  const expr = ['genee', 'cachee', 'cachee', 'rire'][i];
  if (view === 'ne') {
    // de dos : les mains devant le visage, cachées par sa tête ; les coudes levés s'écartent, de chaque côté (par-dessus
    // les pointes des cheveux)
    return { expr, left: '', right: '', over: brasLeves(this, -3.6, -5.6) };
  }
  // les yeux (de trois quarts, le lointain se resserre : maerys_refonte.js, VUES)
  const [xg, xd] = se ? [17.2, 25.2] : [19.4, 28.6];
  const yG = [24.4, 27.4, 27.6, 24.4][i], yD = [24.4, 24.4, 27.6, 24.4][i];
  const g = [xg, yG], dr = [xd, yD];
  return {
    expr, left: '', right: '',
    over: arm(this, a, g, [a[0] - 2.6, a[1] + 2.6], paume(this, g, 1)) + arm(this, b, dr, [b[0] + 2.6, b[1] + 2.6], paume(this, dr, -1))
  };
}

// ---- la lanterne des Anciens ----
// La vieille lanterne de La Lisière, pendue par son anse à la main h : le chapeau et le pied de bois sombre, le verre ;
// dedans, pas de flamme : une lueur verte et dorée, des lucioles (leurs places changent avec l'image) ; le halo autour,
// qui respire doucement (sans clignoter)
function lanterne(h, n, fort) {
  // (à l'échelle de la lanterne du kit, atelier/gestes.js : agrandie de 1,3 autour de l'anse)
  return `<g transform="translate(${r2(h[0])} ${r2(h[1])}) scale(1.3) translate(${r2(-h[0])} ${r2(-h[1])})">${petiteLanterne(h, n, fort)}</g>`;
}
function petiteLanterne(h, n, fort) {
  const [x, y0] = h, y = y0 + 1;
  const lu = [[[-0.9, 4.4], [0.8, 5.6], [0.2, 3.4]], [[0.7, 4.2], [-0.8, 5.2], [0.4, 6.2]], [[-0.4, 3.8], [1, 4.8], [-1, 6]], [[0.9, 3.6], [-0.6, 4.6], [0.3, 5.8]]][n % 4];
  const halo = `<circle cx="${x}" cy="${r2(y + 4.8)}" r="${fort ? 6 : 4.6}" fill="#EEF7A8" opacity=".3"><animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values=".24;.38;.24" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></circle>`
    + `<circle cx="${x}" cy="${r2(y + 4.8)}" r="${fort ? 3.9 : 3.1}" fill="#F7FBC8" opacity=".45"/>`;
  return halo
    + P(`M${r2(x - 1.5)},${r2(y + 1.2)} Q${x},${r2(y - 1.8)} ${r2(x + 1.5)},${r2(y + 1.2)}`, 'none', 0.75)
    + P(`M${r2(x - 2.5)},${r2(y + 2.5)} L${r2(x + 2.5)},${r2(y + 2.5)} L${r2(x + 1.6)},${r2(y + 1.1)} L${r2(x - 1.6)},${r2(y + 1.1)} Z`, '#5A4A3A', 0.75)
    + `<rect x="${r2(x - 2)}" y="${r2(y + 2.5)}" width="4" height="4.8" rx="0.6" fill="#EAF6D2" stroke="${OUT}" stroke-width="0.75"/>`
    + E(x, y + 4.9, 1.6, 1.9, '#DDF0A0', 0).replace('/>', ' opacity=".9"/>')
    + lu.map(([dx, dy]) => E(x + dx, y + dy, 0.42, 0.42, '#FBFFD0', 0.25)).join('')
    + L([x - 0.7, y + 2.9], [x - 0.7, y + 6.9], '#FFFFFF', 0.4).replace('/>', ' opacity=".7"/>')
    + `<rect x="${r2(x - 2.5)}" y="${r2(y + 7.2)}" width="5" height="1.2" rx="0.5" fill="#5A4A3A" stroke="${OUT}" stroke-width="0.75"/>`;
}
// les lucioles sorties de la lanterne, autour d'elle (à l'image 2)
const lucioles = (x, y) => [[-4.6, -2], [4.2, -3.4], [-2.4, -6.2], [5.2, 1.6]].map(([dx, dy]) => E(x + dx, y + dy, 0.45, 0.45, '#FBFFD0', 0.3) + E(x + dx, y + dy, 1, 1, '#E9F5B0', 0).replace('/>', ' opacity=".35"/>')).join('');
function lanternePose({ view, n }) {
  const [a, b] = this.shoulders, i = n % 4, dos = view === 'ne';
  const expr = ['veille', 'emerveillee', 'emerveillee', 'sourire'][i];
  // sa main droite : la lanterne au bout du bras (0), puis levée, le bras plié, à hauteur de l'épaule (1 à 3)
  const s = dos ? b : a, d = dos ? 1 : -1;
  const h = i === 0 ? (dos ? this.hands[1] : this.hands[0]) : [r2(s[0] + d * 4.2), r2(s[1] + 0.6 - (i === 2 ? 0.6 : 0))];
  const lum = lanterne([h[0], h[1] + 0.4], i, i > 0);
  const tient = lum + arm(this, s, h, i === 0 ? undefined : [r2(s[0] + d * 3), r2(s[1] + 5.4)]);
  const repos = dos ? arm(this, a, this.hands[0]) : arm(this, b, this.hands[1]);
  const autour = i === 2 ? lucioles(h[0], h[1] + 3) : '';
  // (de dos, la lanterne levée et son bras passent par-dessus les pointes des cheveux)
  return dos ? { expr, left: repos, right: i ? '' : tient, over: (i ? tient : '') + autour } : { expr, left: tient, right: repos, over: autour };
}

// ---- le bois mort ----
// Le fagot : quatre branches mortes, liées d'une liane ; c : son milieu, rot : sa pente (degrés), long : sa longueur
function fagot(K, [x, y], rot = -24, long = 1) {
  const br = [[-0.9, 0, 9.4], [0.4, -0.5, 10.4], [1.4, 0.4, 8.6], [-0.2, 0.9, 9.8]].map(([dx, dy, l0]) => [dx, dy, l0 * long]).map(([dx, dy, l]) => limb([x - l / 2, y + dy + dx * 0.2], [x + l / 2, y + dy - dx * 0.2], 1.05, K.twig)).join('');
  const q = 3.6 * long, noeuds = L([x + q, y - 0.4], [x + q + 1, y - 1.8], OUT, 1.1) + L([x + q, y - 0.4], [x + q + 1, y - 1.8], K.twig, 0.5) + L([x - q * 0.84, y + 0.6], [x - q * 0.84 - 1.2, y + 1.8], OUT, 1) + L([x - q * 0.84, y + 0.6], [x - q * 0.84 - 1.2, y + 1.8], K.twig, 0.45);
  return `<g transform="rotate(${rot} ${r2(x)} ${r2(y)})">${br}${noeuds}${liane(K, `M${r2(x - 0.4)},${r2(y - 2.2)} Q${r2(x + 0.6)},${r2(y)} ${r2(x - 0.2)},${r2(y + 2.6)}`, 0.7)}</g>`;
}
// une branche tombée, fourchue, tenue par le milieu
const branche = (K, h, rot) => `<g transform="rotate(${rot} ${r2(h[0])} ${r2(h[1])})">${limb([h[0] - 4.4, h[1]], [h[0] + 4.6, h[1]], 1.1, K.twig)}${limb([h[0] + 2, h[1]], [h[0] + 4, h[1] - 2], 0.8, K.twig)}${feuille(h[0] + 4.4, h[1] - 2.2, 2.2, 0.9, 200, K.wither, K.witherS)}</g>`;
function bois({ view, n }) {
  const [a, b] = this.shoulders, K = pal(this), i = n % 4, se = view === 'se', dos = view === 'ne';
  const expr = ['pensive', 'concentree', 'sourire', 'tendresse'][i];
  const cx = se ? 22.2 : 24;
  if (dos) {
    // de dos : le fagot serré contre elle, devant ; ses bouts dépassent de chaque côté, les coudes aussi
    return { expr, left: coudesDeDos(this, [-1.8, 6.8]), right: '', under: fagot(K, [24, 41.4], -12, 2.6) };
  }
  if (i < 2) {
    // le fagot sous son bras gauche (à droite de l'écran), calé contre la hanche, l'avant-bras par-dessus ; la branche
    // tombée dans la main droite, qu'elle regarde (0), puis qu'elle lève pour la glisser dans le fagot (1)
    const f = [r2(b[0] + 0.4), 45.6], hg = [r2(b[0] - 1.6), 46.4];
    const hb = i === 0 ? [r2(a[0] - 1.4), r2(a[1] + 9)] : [r2(a[0] + 2.8), r2(a[1] + 6.2)];
    return {
      expr, left: '', right: '',
      over: fagot(K, f, 14) + arm(this, b, hg, [b[0] + 2.6, b[1] + 5.6]) + branche(K, hb, i === 0 ? -70 : -20) + arm(this, a, hb, i === 0 ? undefined : [a[0] - 2.8, a[1] + 5]) + poing(this, hb)
    };
  }
  // le fagot serré à deux bras contre la poitrine, en travers : ses bouts dépassent de chaque côté ; il glisse un peu,
  // une feuille morte tombe (3)
  const f = [cx, 41.4 + (i === 3 ? 0.6 : 0)];
  return {
    expr, left: '', right: '',
    over: fagot(K, f, i === 3 ? -16 : -20, 1.5) + arm(this, a, [cx - 2.8, f[1] + 2.4], [a[0] - 3.2, a[1] + 4.6]) + arm(this, b, [cx + 3.2, f[1] + 0.4], [b[0] + 3.2, b[1] + 4.6])
      + (i === 3 ? feuille(cx + 8.2, 50.6, 2.4, 1, 70, K.wither, K.witherS) : '')
  };
}

const GESTES = { chanter, oiseau, cachee, lanterne: lanternePose, bois };
// Maerys et son geste : à passer à troupe.frame(…, vue, 'action', n)
const avec = (c, nom) => ({ ...c, uid: `${c.uid}${nom.slice(0, 2)}`, geste: nom, pose: GESTES[nom] });

module.exports = { GESTES, avec, rougeGorge, lanterne, fagot, note, paume };
