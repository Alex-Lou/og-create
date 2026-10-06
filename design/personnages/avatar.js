// L'avatar du joueur (HISTOIRE.md § 6.17) : un personnage de la troupe qu'on compose soi-même.
// Même repère que la troupe (48 × 64, pieds en (24, 62)), mêmes vues, mêmes poses, mêmes expressions ;
// avatar(choix) rend un personnage pour troupe.frame(), comme aster.js ou rivet.js.
//
// Les choix (CHOIX) : taille et corpulence ; peau, forme du visage, yeux (couleur et forme), sourcils, bouche au repos,
// taches de rousseur, joues, grain de beauté ; coupe et couleur de cheveux ; haut (forme et couleur), bas (forme et
// couleur), chaussures, accessoire. Les couleurs de peau et de cheveux sont celles du jeu (src/world/villagers.js) :
// le petit format (lookPetit) les reprend telles quelles.
// Poses : repos, marche, salut, et trois gestes du tutoriel : ramasser (trois quarts avant), grelotter et lire (face).
const { OUT, P, E, L, limb, clip, expression, arm, shoe, r2 } = require('./troupe');

// ---- les choix ----
const CHOIX = {
  taille: { petite: 'Petite', moyenne: 'Moyenne', grande: 'Grande' },
  silhouette: { fine: 'Fine', moyenne: 'Moyenne', large: 'Large', ronde: 'Ronde' },
  peau: { porcelaine: '#F6D3B3', peche: '#F2C9A0', miel: '#E9B98F', cannelle: '#C98B5E', cacao: '#8D5A3B', ebene: '#6B4430' },
  visage: { rond: 'Rond', ovale: 'Ovale', carre: 'Carré' },
  yeux: { brun: '#2A2420', noisette: '#6B4A2A', vert: '#3E6B3A', bleu: '#3A5C8C', gris: '#4E5560' },
  formeYeux: { ronds: 'Ronds', amande: 'En amande', grands: 'Grands', rieurs: 'Rieurs', paisibles: 'Paisibles' },
  sourcils: { fins: 'Fins', epais: 'Épais', doux: 'Doux' },
  bouche: { douce: 'Douce', sourire: 'Souriante', malice: 'Malicieuse', serieuse: 'Sérieuse' },
  rousseur: { non: 'Sans', oui: 'Taches de rousseur' },
  joues: { roses: 'Roses', discretes: 'Discrètes' },
  grain: { non: 'Sans', joue: 'Sur la joue', levre: 'Au coin de la lèvre' },
  coupe: {
    courte: 'Courte', meche: 'Mèche', bataille: 'En bataille', carre: 'Carré', longue: 'Longue', queue: 'Queue de cheval',
    couettes: 'Couettes', chignon: 'Chignon', tresses: 'Tresses', bouclee: 'Bouclée', locks: 'Locks', rasee: 'Rasée'
  },
  cheveux: { noir: '#3A2A1E', brun: '#7A4E2C', chatain: '#C9873E', blond: '#E8C46A', roux: '#B94E3A', nuit: '#2E2E3A', blanc: '#D9D4CC', gris: '#8A8F98' },
  haut: { tshirt: 'T-shirt', mariniere: 'Marinière', pull: 'Pull', sweat: 'Sweat à capuche', chemise: 'Chemise', veste: 'Veste ouverte' },
  couleurHaut: { corail: '#E8705A', soleil: '#F2C04B', menthe: '#7EC4A0', ciel: '#6FA3D9', lavande: '#A48CD6', rose: '#E8879C', creme: '#F1E6CC', marine: '#3E5A8C', foret: '#4E7A4A', prune: '#7A3E5E' },
  bas: { pantalon: 'Pantalon', short: 'Short', jupe: 'Jupe', salopette: 'Salopette', robe: 'Robe chasuble' },
  couleurBas: { jean: '#3E5A8C', sable: '#C9B080', olive: '#6E7A44', charbon: '#4A4E5C', brique: '#9C4A36', creme: '#E6DCC3', noir: '#2E2A2A', bordeaux: '#6E2E3A' },
  chaussures: { cuir: '#5E3A22', toile: '#E6DCC3', rouge: '#B8463A', bleu: '#3E5A8C' },
  accessoire: { aucun: 'Aucun', lunettes: 'Lunettes rondes', bonnet: 'Bonnet', paille: 'Chapeau de paille', casquette: 'Casquette', foulard: 'Foulard', bandana: 'Bandana' }
};
// Les noms à afficher pour les choix de couleur (les autres choix portent déjà leur nom dans CHOIX)
const LIBELLES = {
  peau: { porcelaine: 'Porcelaine', peche: 'Pêche', miel: 'Miel', cannelle: 'Cannelle', cacao: 'Cacao', ebene: 'Ébène' },
  yeux: { brun: 'Bruns', noisette: 'Noisette', vert: 'Verts', bleu: 'Bleus', gris: 'Gris' },
  cheveux: { noir: 'Noirs', brun: 'Bruns', chatain: 'Châtains', blond: 'Blonds', roux: 'Roux', nuit: 'Bleu nuit', blanc: 'Blancs', gris: 'Gris' },
  couleurHaut: { corail: 'Corail', soleil: 'Soleil', menthe: 'Menthe', ciel: 'Ciel', lavande: 'Lavande', rose: 'Rose', creme: 'Crème', marine: 'Marine', foret: 'Forêt', prune: 'Prune' },
  couleurBas: { jean: 'Jean', sable: 'Sable', olive: 'Olive', charbon: 'Charbon', brique: 'Brique', creme: 'Crème', noir: 'Noir', bordeaux: 'Bordeaux' },
  chaussures: { cuir: 'Cuir', toile: 'Toile', rouge: 'Rouges', bleu: 'Bleues' }
};
const libelle = (cle, valeur) => (LIBELLES[cle] && LIBELLES[cle][valeur]) || CHOIX[cle][valeur];
const DEFAUT = {
  taille: 'moyenne', silhouette: 'moyenne', peau: 'peche', visage: 'rond', yeux: 'brun', formeYeux: 'ronds', sourcils: 'fins', bouche: 'douce',
  rousseur: 'non', joues: 'roses', grain: 'non', coupe: 'courte', cheveux: 'brun', haut: 'tshirt', couleurHaut: 'corail', bas: 'pantalon',
  couleurBas: 'jean', chaussures: 'cuir', accessoire: 'aucun'
};

// ---- couleurs ----
function hsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l];
}
function hex([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// mélange de deux couleurs (k = part de la seconde)
const mix = (a, b, k) => { const p = c => [0, 2, 4].map(i => parseInt(c.slice(1 + i, 3 + i), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('').toUpperCase(); };
// plus sombre (k < 1) ou plus clair (k > 1), en gardant la teinte
const tone = (c, k) => { const [h, s, l] = hsl(c); return hex([h, s, k < 1 ? l * k : l + (1 - l) * (k - 1)]); };

// ---- le corps : taille et corpulence ----
// Taille : le haut du corps monte ou descend, les pieds restent au sol (les jambes s'allongent ou raccourcissent)
const TAILLE = { petite: 3.2, moyenne: 0, grande: -2.4 };
// Corpulence : demi-largeur aux épaules (sw) et aux hanches (hw), ventre (b), épaisseur des bras et des jambes
const CORPS = {
  fine: { sw: 7.6, hw: 9.2, b: 0, arm: 3.4, legW: 5 },
  moyenne: { sw: 8.5, hw: 10.2, b: 0, arm: 3.8, legW: 5.4 },
  large: { sw: 10, hw: 11, b: 0, arm: 4.3, legW: 5.9 },
  ronde: { sw: 8.9, hw: 11.2, b: 1.8, arm: 4.1, legW: 6 }
};
// Torse des épaules aux hanches (hem : bas du haut, plus haut quand il est rentré dans la jupe, la robe ou la salopette)
function torso(k, hem = 46.6) {
  const mx = (k.sw + k.hw) / 2 + k.b, my = (32.6 + hem) / 2;
  return `M${r2(24 - k.sw)},32.6 Q24,30 ${r2(24 + k.sw)},32.6 Q${r2(24 + mx)},${r2(my)} ${r2(24 + k.hw)},${hem}`
    + ` Q24,${r2(hem + 3)} ${r2(24 - k.hw)},${hem} Q${r2(24 - mx)},${r2(my)} ${r2(24 - k.sw)},32.6 Z`;
}

// ---- la tête ----
// Repères communs (ceux de la troupe) : visage centré en 24 (face) ou 22,6 (trois quarts), yeux, bouche, oreilles
const FACE = { front: { fx: 24, rx: 11.6 }, se: { fx: 22.6, rx: 11.2 } };
// Le haut du visage est le même pour tous ; le bas change avec la forme (rond, ovale : menton plus fin, carré : mâchoire)
function faceD(v, forme = 'rond') {
  const { fx, rx } = FACE[v];
  const a = r2(fx - rx), b = r2(fx + rx);
  const low = forme === 'ovale' ? `C${a},28.4 ${r2(fx - 4.8)},33.4 ${fx},33.4 C${r2(fx + 4.8)},33.4 ${b},28.4 ${b},21.6`
    : forme === 'carre' ? `C${a},30.6 ${r2(fx - 8.6)},32 ${fx},32 C${r2(fx + 8.6)},32 ${b},30.6 ${b},21.6`
      : `a${rx},10.4 0 1,0 ${r2(2 * rx)},0`;
  return `M${a},21.6 ${low} a${rx},10.4 0 1,0 ${r2(-2 * rx)},0 Z`;
}
const BACK = {
  front: 'M11.4,21.6 Q10.4,7.2 24,6.6 Q37.6,7.2 36.6,21.6 Q36.8,26.4 35,27.6 L13,27.6 Q11.2,26.4 11.4,21.6 Z',
  se: 'M12,21.6 Q10.6,7.2 24,6.8 Q38.2,7.2 37.4,21.6 Q37.6,26.4 35.6,27.6 L14,27.6 Q12.2,26.4 12,21.6 Z',
  ne: 'M11,21 Q10,6.6 24,6.4 Q38,6.6 37,21 Q37.2,27 34.6,28.8 Q24,31 13.4,28.8 Q10.8,27 11,21 Z'
};
// Carré : la masse de cheveux descend jusqu'à la mâchoire, coupée droit
const BOB = {
  front: 'M10.8,21.6 Q10,7 24,6.6 Q38,7 37.2,21.6 L37.4,29.8 Q24,31 10.6,29.8 Z',
  se: 'M11.6,21.6 Q10.4,7 24,6.8 Q38.6,7 38,21.6 L38.2,29.8 Q26,31 11.8,29.6 Z',
  ne: 'M10.8,21 Q10,6.6 24,6.4 Q38,6.6 37.2,21 L37.4,30 Q24,31.6 10.6,30 Z'
};
// Franges : courte (mèches souples, raie de côté), la même un peu plus longue
const BANGS = {
  front: 'M12,19.4 Q11.6,9.6 24,9.2 Q36.4,9.6 36.2,18.6 Q33.4,13.8 28.4,13.4 Q25.4,15.6 21.6,15.2 Q17.4,15 14.6,17.4 Q12.8,18.6 12,19.4 Z',
  se: 'M11.4,19.4 Q11,9.6 23,9 Q35,9.4 35.4,18 Q32.6,13.6 27.6,13.2 Q24.6,15.4 20.6,15 Q16.6,14.8 13.8,17.2 Q12.2,18.4 11.4,19.4 Z'
};
const sx = (d, k) => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + k)},${y}`);
// symétrique autour de l'axe 24 (la mèche de droite d'après celle de gauche)
const mirror = d => d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${r2(48 - x)},${y}`);
// Les franges des nouvelles coupes, dessinées de face ; le trois quarts les décale vers le côté du regard
const FRANGE = {
  // carré : frange droite, coupée net au-dessus des sourcils
  carre: 'M12.2,19 Q11.4,9.4 24,9.2 Q36.6,9.4 35.8,19 Q35,16.8 33.2,16.6 L14.8,16.6 Q13,16.8 12.2,19 Z',
  // mèche : une grande mèche qui part du sommet et retombe sur le côté du front
  meche: 'M12,20.6 Q10.4,8.4 22.4,7.4 Q31,6.4 35,9.8 Q37.2,12.4 36.2,18.6 Q34.6,14.8 31.4,14 Q25.4,13.6 20.6,16.8 Q16,19.8 12,20.6 Z',
  // en bataille : frange en pointes
  bataille: 'M12.2,19.2 Q11.6,9.6 24,9.2 Q36.4,9.6 36,18.8 L33.8,15 L32.2,17.4 L29.8,13.6 L27.6,16.6 L25,13.4 L22.6,16.8 L20.2,13.8 L17.8,17 L15.6,14.4 L14,17.6 Z'
};
// En bataille : les épis du sommet (sans chapeau) ; seul le bord en pointes est cerné
const EPIS = {
  front: ['M12.6,13.4 Q12,8.6 14.6,7.4 L13.6,4.4 L17.8,6 L19,3.4 L22.4,5.6 L25.2,3.2 L27.4,5.8 L31.2,4.2 L31,7.4 Q35.6,9.2 35.4,13.4 Z',
    'M12.6,13.4 Q12,8.6 14.6,7.4 L13.6,4.4 L17.8,6 L19,3.4 L22.4,5.6 L25.2,3.2 L27.4,5.8 L31.2,4.2 L31,7.4 Q35.6,9.2 35.4,13.4'],
  ne: ['M12.2,12.6 Q11.6,8.2 14.4,7 L13.4,4.2 L17.6,5.8 L18.8,3.4 L22.4,5.4 L25.2,3.2 L27.6,5.6 L31.4,4.2 L31.4,7.4 Q36,9 35.8,12.6 Z',
    'M12.2,12.6 Q11.6,8.2 14.4,7 L13.4,4.2 L17.6,5.8 L18.8,3.4 L22.4,5.4 L25.2,3.2 L27.6,5.6 L31.4,4.2 L31.4,7.4 Q36,9 35.8,12.6']
};
// Couettes : une touffe de chaque côté, nouée à hauteur des oreilles
const COUETTE = 'M12.8,18 Q5.6,19.2 6.4,28.8 Q8.6,26.6 10.2,27.6 Q9.8,23.2 13,21.2 Z';

// Boucles : un nuage festonné autour d'un centre
function curls(cx, cy, rx, ry, n, bumps = 1.9) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
    if (i === 0) { d += `M${r2(x)},${r2(y)}`; continue; }
    const tm = ((i - 0.5) / n) * Math.PI * 2 - Math.PI / 2;
    d += ` Q${r2(cx + Math.cos(tm) * (rx + bumps))},${r2(cy + Math.sin(tm) * (ry + bumps))} ${r2(x)},${r2(y)}`;
  }
  return d + ' Z';
}
// Tresse : une suite d'écailles le long d'une ligne (x, y0) -> (x + dx, y1)
function braid(x, y0, y1, dx, c, n = 4) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = i / n, y = y0 + (y1 - y0) * t, xx = x + dx * t, h = (y1 - y0) / n;
    s += P(`M${r2(xx - 1.7)},${r2(y)} Q${r2(xx)},${r2(y + h * 1.2)} ${r2(xx + 1.7)},${r2(y)} Q${r2(xx)},${r2(y + h * 0.3)} ${r2(xx - 1.7)},${r2(y)} Z`, i % 2 ? c.hairS : c.hair, 0.8);
  }
  return s + E(x + dx, y1 + 0.6, 1.3, 1, c.tie, 0.7);
}
// Lock : une mèche roulée en corde (a -> b), deux petits anneaux plus sombres
function lock(a, b, c, w = 2.2) {
  const at = t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return limb(a, b, w, c.hair) + [0.38, 0.7].map(t => { const p = at(t); return L([p[0] - w * 0.45, p[1]], [p[0] + w * 0.45, p[1] + 0.3], c.hairS, 0.5); }).join('')
    + E(b[0], b[1] + 0.2, w * 0.5, 0.5, c.hairS, 0);
}
// Les locks par vue : celles de devant, le long des joues (par-dessus) ; de dos, tout le long du dos
const LOCKS = {
  front: [[[13.4, 17], [12, 32.6]], [[15.2, 19.4], [14.6, 30.4]], [[34.6, 17], [36, 32.6]], [[32.8, 19.4], [33.4, 30.4]]],
  se: [[[12.6, 17.6], [11.6, 31]], [[33.4, 16.4], [35.8, 33.4]], [[35.8, 18.6], [38, 31.4]]],
  ne: [[[13.6, 20], [13, 35.6]], [[18.4, 23], [18, 38]], [[24, 23.6], [24, 38.6]], [[29.6, 23], [30, 38]], [[34.4, 20], [35, 35.6]]]
};
// Le dessus des locks (de face) : les départs des mèches roulées, en sillons sur la frange
const LOCKS_HAUT = 'M17.4,10.4 Q16.4,13.4 16.8,16.6 M21.6,9.6 Q21,12.6 21.4,15.4 M26.4,9.8 Q26.8,12.4 26.4,14.4 M31,11 Q32,13.4 32.4,15.6';

// Les chapeaux couvrent le haut de la tête : pas d'épis ni de chignon au sommet dessous
const HATS = new Set(['bonnet', 'paille', 'casquette', 'bandana']);

// Ce que chaque coupe met derrière le corps (cheveux longs), derrière la tête, et par-dessus
function hairBehindBody(c, view) {
  if (c.o.coupe === 'longue') {
    if (view === 'ne') return '';
    const d = view === 'se' ? 'M12.4,22 Q11,34 13.6,40 L34.6,40 Q37.4,34 36.4,22 Z' : 'M11.6,22 Q10.4,34 13,40.4 L35,40.4 Q37.6,34 36.4,22 Z';
    return P(d, c.hairS);
  }
  return '';
}
function hairBack(c, view) {
  const { coupe } = c.o;
  const H = c.hair, S = c.hairS;
  const hat = HATS.has(c.o.accessoire);
  let s = '';
  if (coupe === 'chignon' && !hat) {
    s += view === 'ne' ? E(24, 8.6, 4.8, 4, H) + P('M20.2,7 Q24,4.8 27.8,7', 'none', 0.6)
      : E(view === 'se' ? 25.4 : 24, 6.6, 4.4, 3.6, H) + P(`M${view === 'se' ? 22 : 20.6},5.6 Q${view === 'se' ? 25.4 : 24},3.8 ${view === 'se' ? 28.8 : 27.4},5.6`, 'none', 0.6);
  }
  if (coupe === 'queue') {
    s += view === 'ne' ? '' : P(view === 'se' ? 'M33.4,11.6 Q41.6,11 42,20.4 Q39.6,18 35.6,18.6 Z' : 'M33.4,11.6 Q41.4,10.8 41.6,19.4 Q39.4,17.2 35.4,18.2 Z', H) + E(34.6, 13.2, 1.5, 1.4, c.tie, 0.9);
  }
  if (coupe === 'bouclee') {
    const cl = curls(view === 'se' ? 23.6 : 24, 17.6, 15.4, 12.8, 14);
    s += P(cl, H) + clip(`${c.uid}cb${view}`, cl, `<rect x="4" y="22" width="40" height="14" fill="${S}"/>`) + P(cl, 'none');
  }
  return s;
}

// Les deux couettes, de face (de trois quarts, celle du fond se décale vers la nuque)
const couettes = (c, view) => {
  const left = view === 'se' ? sx(COUETTE, -0.6) : COUETTE;
  const right = view === 'se' ? sx(mirror(COUETTE), 0.6) : mirror(COUETTE);
  const ties = view === 'se' ? [[11.6, 19.6], [36.8, 19.6]] : [[12.2, 19.6], [35.8, 19.6]];
  return P(left, c.hair) + P(right, c.hair) + P(sx('M8.6,22.4 Q8,25.4 8.4,27.6', view === 'se' ? -0.6 : 0), 'none', 0.5)
    + ties.map(([x, y]) => E(x, y, 1.5, 1.3, c.tie, 0.8)).join('');
};

function head(c, ctx) {
  const { view } = ctx;
  const o = c.o, H = c.hair, S = c.hairS, HI = c.hairH;
  const coupe = o.coupe;
  const hat = HATS.has(o.accessoire);
  let s = hairBack(c, view);
  // --- de dos : l'arrière de la tête ---
  if (view === 'ne') {
    s += E(12.6, 23, 1.6, 2.2, c.skin) + E(35.4, 23, 1.6, 2.2, c.skin);
    if (coupe === 'rasee') {
      // crâne rasé : la peau sous des cheveux très courts (teinte mêlée), une nuque nette, quelques traits de tondeuse
      const d = 'M11.4,21 Q10.6,8 24,7.6 Q37.4,8 36.6,21 Q36.6,26.4 34,28 Q24,30 14,28 Q11.4,26.4 11.4,21 Z';
      const buzz = 'M11.6,20.6 Q10.8,8.2 24,7.8 Q37.2,8.2 36.4,20.6 Q35.8,24.4 33.2,25.6 Q28.4,24.4 24,25.4 Q19.6,24.4 14.8,25.6 Q12.2,24.4 11.6,20.6 Z';
      s += P(d, c.skin) + P(buzz, c.buzz, 0.9) + [[17, 12], [21, 10.6], [26.4, 10.8], [30.6, 12.4], [19, 17], [24, 16.2], [29, 17.2], [16, 21.4], [32, 21.4]].map(([x, y]) => L([x, y], [x + 0.5, y + 1.1], c.buzzS, 0.5)).join('');
      return s + accessoryHead(c, view);
    }
    if (coupe !== 'bouclee') {
      const back = coupe === 'carre' ? BOB.ne : BACK.ne;
      s += P(back, H) + clip(`${c.uid}h`, back, `<rect x="8" y="4" width="34" height="32" fill="${S}"/><ellipse cx="22.4" cy="17.2" rx="13.8" ry="12" fill="${H}"/>`) + P(back, 'none');
      s += P('M18.6,13 Q17.8,20 19.4,27.4', 'none', 0.6) + P('M25,12.6 Q25.8,20 24.6,28', 'none', 0.6) + L([17, 10], [22.4, 8.6], HI, 1.3);
    }
    if (coupe === 'bataille' && !hat) s += P(EPIS.ne[0], H, 0) + P(EPIS.ne[1], 'none', 1) + L([16.6, 7.4], [21.4, 6.6], HI, 1.1);
    if (coupe === 'carre') s += P('M15.6,26 L15.4,29.8 M21.2,27.4 L21,30.8 M27,27.4 L27.2,30.8 M32.6,26 L32.8,29.8', 'none', 0.5);
    if (coupe === 'longue') s += P('M11.6,22 Q11,32 14,38.6 Q24,41 34,38.6 Q37,32 36.4,22 Q36,28.4 33.6,29.6 Q24,32 14.4,29.6 Q12,28.4 11.6,22 Z', H) + P('M20,30.8 Q20.4,35 19.4,38.6 M28,30.8 Q27.6,35 28.6,38.6', 'none', 0.55);
    if (coupe === 'queue') s += P('M22,25 Q20.4,33 22.6,38.6 Q24,39.6 25.4,38.6 Q27.6,33 26,25 Z', H) + E(24, 25.6, 2.2, 1.3, c.tie, 0.8);
    if (coupe === 'couettes') s += P('M24,7.6 L24,22', 'none', 0.6) + couettes(c, 'front');
    if (coupe === 'chignon' && hat) s += E(24, 25.2, 3.8, 3.2, H) + P('M21.2,24.4 Q24,22.8 26.8,24.4', 'none', 0.55);
    if (coupe === 'tresses') s += braid(17.2, 25.4, 37.6, -0.6, c) + braid(30.8, 25.4, 37.6, 0.6, c);
    if (coupe === 'bouclee') s += P('M17,12 Q24,9.6 31,12 M15.4,20 Q24,23 32.6,20', 'none', 0.55);
    if (coupe === 'locks') s += LOCKS.ne.map(([a, b]) => lock(a, b, c)).join('');
    return s + accessoryHead(c, view);
  }
  // --- de face ou de trois quarts ---
  const se = view === 'se';
  const k = se ? -1.4 : 0;
  const face = faceD(view, o.visage);
  const back = coupe === 'carre' ? BOB[view] : BACK[view];
  if (coupe !== 'rasee' && coupe !== 'bouclee') s += P(back, H) + clip(`${c.uid}h`, back, `<rect x="8" y="24.6" width="32" height="6" fill="${S}"/>`) + P(back, 'none');
  // oreilles (cachées par les cheveux longs de face, par le carré)
  if (se) { if (coupe !== 'carre') s += E(35, 23.2, 1.5, 2.1, c.skin); }
  else if (coupe !== 'longue' && coupe !== 'carre') s += E(11.8, 22.8, 1.5, 2.1, c.skin) + E(36.2, 22.8, 1.5, 2.1, c.skin);
  const fr = se ? [[15.8, 24.7], [17, 25.4], [14.9, 25.2], [26.8, 24.8], [27.8, 25.4]]
    : [[17.6, 24.8], [18.8, 25.5], [16.6, 25.3], [30.4, 24.8], [29.2, 25.5], [31.4, 25.3]];
  const cheeks = se ? [[15.2, 1.8], [28.2, 1.5]] : [[16.6, 1.9], [31.4, 1.9]];
  // la frange de la coupe (de trois quarts, décalée vers le côté du regard)
  const frange = coupe === 'rasee' || coupe === 'bouclee' ? null
    : FRANGE[coupe] ? (se ? sx(FRANGE[coupe], -1) : FRANGE[coupe]) : BANGS[view];
  s += P(face, c.skin);
  s += clip(`${c.uid}f`, face, (frange ? `<path d="${frange}" fill="${c.skinS}" transform="translate(0 1.4)"/>` : '')
    + cheeks.map(([x, rx]) => E(x, 26.2, rx * (ctx.expr === 'gene' ? 1.3 : 1), ctx.expr === 'gene' ? 1.6 : 1.1, c.cheek, 0)).join('')
    + (o.rousseur === 'oui' ? fr.map(([x, y]) => E(x, y, 0.38, 0.38, c.freckle, 0)).join('') : ''));
  s += P(face, 'none');
  if (o.grain !== 'non') { const [x, y] = GRAIN[o.grain][view]; s += E(x, y, 0.45, 0.45, c.mole, 0); }
  // le dessus de la tête selon la coupe
  if (coupe === 'rasee') {
    const cap = se ? 'M11.8,19.6 Q11.6,8.4 23,7.8 Q34.8,8.2 35.4,19 Q33,14.2 23.2,13.8 Q14.6,14 11.8,19.6 Z' : 'M12.4,19.8 Q12.2,8.2 24,7.8 Q35.8,8.2 35.6,19.8 Q33.4,13.8 24,13.6 Q14.6,13.8 12.4,19.8 Z';
    s += P(cap, c.buzz, 0.9) + L(se ? [15.4, 11.4] : [17, 11], se ? [21.4, 9.6] : [23, 9.4], tone(c.buzz, 1.25), 1);
  } else if (coupe === 'bouclee') {
    const top = curls(se ? 23.2 : 24, 11.6, 12.6, 4.6, 11, 1.6);
    s += P(top, H) + L(se ? [15.6, 9.6] : [17, 9.4], se ? [21, 8] : [22.4, 7.8], HI, 1.1);
  } else {
    if (coupe === 'bataille' && !hat) s += P(se ? sx(EPIS.front[0], -1) : EPIS.front[0], H, 0) + P(se ? sx(EPIS.front[1], -1) : EPIS.front[1], 'none', 1);
    s += P(frange, H) + L(se ? [15.6, 11.4] : [17, 11.2], se ? [22.6, 9.6] : [24, 9.6], HI, 1.3);
    if (coupe === 'meche') s += P(se ? sx('M31.4,8.8 Q24.4,9.8 19.2,16.4', -1) : 'M31.4,8.8 Q24.4,9.8 19.2,16.4', 'none', 0.55);
    if (coupe === 'longue') {
      // mèches qui tombent le long des joues (devant les oreilles)
      s += se ? P('M33.2,15 Q37.8,22 36.6,31.6 Q35,29.6 33.6,30.2 Q34.4,22 32,17.6 Z', H)
        : P('M14.4,15 Q9.8,22 11.2,31.6 Q12.8,29.6 14.2,30.2 Q13.4,22 15.6,17.6 Z', H) + P('M33.6,15 Q38.2,22 36.8,31.6 Q35.2,29.6 33.8,30.2 Q34.6,22 32.4,17.6 Z', H);
    }
    if (coupe === 'carre') {
      // le carré encadre le visage : une mèche de chaque côté, coupée droit à la mâchoire
      const lk = 'M14.2,15.4 Q10.4,20.4 11,29.4 L14.4,29.4 Q13.6,22.4 15.8,17.8 Z';
      s += se ? P(sx(mirror(lk), -0.4), H) : P(lk, H) + P(mirror(lk), H);
    }
    if (coupe === 'tresses') s += se ? braid(34.2, 26, 37.4, 0.8, c) : braid(13.4, 26, 37.8, -0.6, c) + braid(34.6, 26, 37.8, 0.6, c);
    if (coupe === 'couettes') s += couettes(c, view);
    if (coupe === 'locks') s += P(se ? sx(LOCKS_HAUT, -1) : LOCKS_HAUT, 'none', 0.6) + LOCKS[view].map(([a, b]) => lock(a, b, c)).join('');
  }
  // expression : sourcils de la couleur des cheveux (plus foncés), yeux de la couleur et de la forme choisies
  const brow = { fins: [1, -4.1], epais: [1.6, -4.2], doux: [0.95, -3.7] }[o.sourcils];
  const [ex, ey] = YEUX[o.formeYeux];
  const eyes = se ? [[17.2, 22.6, r2(1.55 * ex)], [25.2, 22.6, r2(1.35 * ex)]] : [[19.4, 22.6, r2(1.6 * ex)], [28.6, 22.6, r2(1.6 * ex)]];
  s += expression({
    eyes, ry: ey, eyeColor: c.eye, restEyes: o.formeYeux === 'paisibles' ? 'sleepy' : undefined,
    brow: tone(H, 0.55), browY: brow[1] - Math.max(0, ey - 2.35) * 0.6, browW: brow[0],
    mouth: [se ? 20.8 : 24, 27], mw: 1.7, mouthC: '#7A3B30', tongue: '#E07A72',
    neutral: BOUCHE[o.bouche],
    cheeks, cheekY: 26.2, temple: [se ? 12.6 : 13.4, 12.4], anger: [40, 6.8], zz: [36.4, 5.8 - Math.min(c.dy, 0)]
  }, ctx);
  // yeux ouverts (au repos ou contents) : la paupière des yeux rieurs, le trait des yeux en amande
  const open = !ctx.blink && !ctx.eyeMode && (ctx.expr === 'content' || (ctx.expr === 'neutre' && o.formeYeux !== 'paisibles'));
  if (open && o.formeYeux === 'rieurs') {
    for (const [x, y, rx] of eyes) {
      const t = y + ey * 0.42;
      s += `<path d="M${r2(x - rx - 0.5)},${r2(t + 0.5)} Q${x},${r2(t - 0.7)} ${r2(x + rx + 0.5)},${r2(t + 0.5)} L${r2(x + rx + 0.5)},${r2(y + ey + 0.7)} L${r2(x - rx - 0.5)},${r2(y + ey + 0.7)} Z" fill="${c.skin}"/>`
        + P(`M${r2(x - rx - 0.3)},${r2(t + 0.4)} Q${x},${r2(t - 0.6)} ${r2(x + rx + 0.3)},${r2(t + 0.4)}`, 'none', 0.8);
    }
  }
  if (open && o.formeYeux === 'amande') {
    // une paupière fine au-dessus de l'œil, qui file un peu vers la tempe
    const cx = (eyes[0][0] + eyes[1][0]) / 2;
    for (const [x, y, rx] of eyes) {
      const m = cx > x ? -1 : 1; // vers l'extérieur du visage
      s += P(`M${r2(x - m * rx * 0.9)},${r2(y - ey * 0.55)} Q${r2(x - m * rx * 0.1)},${r2(y - ey * 1.45)} ${r2(x + m * (rx + 0.7))},${r2(y - ey * 0.5)}`, 'none', 0.7);
    }
  }
  s += accessoryHead(c, view, k);
  return s;
}

// Formes des yeux : largeur (facteur) et hauteur (rayon vertical)
const YEUX = { ronds: [1, 2.35], amande: [1.12, 1.95], grands: [1.16, 2.75], rieurs: [1, 2.35], paisibles: [1, 2.35] };
// Bouche au repos (l'expression « neutre ») ; les autres expressions sont celles de la troupe
const BOUCHE = {
  douce: (mx, my) => `M${r2(mx - 1.4)},${r2(my + 0.3)} Q${mx},${r2(my + 1.3)} ${r2(mx + 1.4)},${r2(my + 0.3)}`,
  sourire: (mx, my) => `M${r2(mx - 2)},${r2(my)} Q${mx},${r2(my + 1.9)} ${r2(mx + 2)},${r2(my)}`,
  malice: (mx, my) => `M${r2(mx - 1.5)},${r2(my + 0.7)} Q${r2(mx + 0.3)},${r2(my + 1.3)} ${r2(mx + 1.7)},${r2(my - 0.2)}`,
  serieuse: (mx, my) => `M${r2(mx - 1.3)},${r2(my + 0.7)} Q${mx},${r2(my + 1)} ${r2(mx + 1.3)},${r2(my + 0.7)}`
};
// Grain de beauté : sur la joue, ou au coin de la lèvre
const GRAIN = { joue: { front: [31, 27.2], se: [26.8, 27] }, levre: { front: [26.4, 28.6], se: [23, 28.6] } };

// ---- accessoires ----
function accessoryHead(c, view, k = 0) {
  const a = c.o.accessoire;
  const se = view === 'se', ne = view === 'ne';
  if (a === 'lunettes' && !ne) {
    const lens = se ? [[17.2, 22.8, 2.9], [25.4, 22.8, 2.5]] : [[19.4, 22.8, 3.1], [28.6, 22.8, 3.1]];
    let s = lens.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(200,230,255,.25)" stroke="#3C2819" stroke-width="0.9"/>`).join('');
    s += P(se ? 'M20.1,22.4 Q21.2,21.6 22.9,22.4' : 'M22.5,22.4 Q24,21.4 25.5,22.4', 'none', 0.8);
    s += se ? P('M27.9,22.2 L34.4,21.4', 'none', 0.8) : P('M16.3,22.2 L12.2,21.6 M31.7,22.2 L35.8,21.6', 'none', 0.8);
    return s;
  }
  if (a === 'lunettes') return P('M11.6,21.4 L14.6,21.8 M36.4,21.4 L33.4,21.8', 'none', 0.8);
  if (a === 'bonnet') {
    const d = 'M11.2,15.4 Q10.8,4.6 24,4.4 Q37.2,4.6 36.8,15.4 Z';
    return P(sx(d, k), c.acc) + clip(`${c.uid}bn${view}`, sx(d, k), [14, 18.6, 23.2, 27.8, 32.4].map(x => L([x + k, 5], [x + k, 15], tone(c.acc, 0.82), 0.6)).join(''))
      + P(sx(d, k), 'none') + `<rect x="${r2(10.6 + k)}" y="13.4" width="26.8" height="3.4" rx="1.6" fill="${tone(c.acc, 0.85)}" stroke="${OUT}" stroke-width="1"/>`
      + E(24 + k, 4.9, 2.5, 2.1, '#F1E6CC');
  }
  if (a === 'paille') {
    const crown = sx('M15.6,13.4 Q15.8,5.2 24,5 Q32.2,5.2 32.4,13.4 Z', k);
    return E(24 + k, 13.6, ne ? 15.4 : 16.4, 3.4, '#F2D27E') + P(crown, '#E8C46A') + `<rect x="${r2(15.6 + k)}" y="10.6" width="16.8" height="2.2" fill="#C9473A"/>`
      + P(crown, 'none') + L([17.2 + k, 8], [21 + k, 6.4], '#FFF0B8', 0.9);
  }
  if (a === 'casquette') {
    const dome = sx('M11.6,15.6 Q11.4,5.6 24,5.4 Q36.6,5.6 36.4,15.6 Z', k);
    const visor = ne ? '' : se ? P('M9,15.6 Q8.4,12.6 16,13.6 L22,15.6 Q15,17.4 9,15.6 Z', tone(c.acc, 0.8)) : P('M15,15.4 Q24,12.6 33,15.4 Q24,19 15,15.4 Z', tone(c.acc, 0.8));
    return P(dome, c.acc) + P(sx('M23.4,5.6 L23.4,15.4', k), 'none', 0.5) + E(24 + k, 5.6, 1.1, 0.8, tone(c.acc, 0.8), 0.6) + visor;
  }
  if (a === 'bandana') {
    const d = ne ? 'M11.2,17.6 Q10.8,6 24,5.8 Q37.2,6 36.8,17.6 Q24,14.4 11.2,17.6 Z' : sx('M11.6,16.4 Q11.4,6.2 24,6 Q36.6,6.2 36.4,16.4 Q24,13 11.6,16.4 Z', k);
    let s = P(d, c.acc) + clip(`${c.uid}bd${view}`, d, [[16, 9], [21, 7.4], [27, 8], [31.6, 10.6], [19, 12.6], [28.6, 12.6]].map(([x, y]) => E(x + k, y, 0.7, 0.7, '#FFF4E0', 0)).join('')) + P(d, 'none');
    if (ne) s += P('M23,16.4 Q21.4,19.6 21.8,22.6 Q23,21.6 23.8,22.2 Q23.4,19.4 24.4,16.6 Z', tone(c.acc, 0.85), 0.8)
      + P('M25,16.4 Q27.4,19 27.6,22 Q26.4,21.2 25.6,21.8 Q25.4,19.2 23.8,16.8 Z', tone(c.acc, 0.85), 0.8) + E(24, 16.4, 1.8, 1.3, c.acc, 0.8);
    return s;
  }
  return '';
}

// ---- les habits ----
// Jupe (et bas de la robe) : de la taille au genou, un peu évasée ; elle suit la marche d'un rien
function skirt(c, view, sway, top, hem) {
  const { hw } = c.k;
  const a = hw + 0.2, b = hw + 2.4 + (hem - top) * 0.1;
  const d = `M${r2(24 - a)},${top} L${r2(24 + a)},${top} L${r2(24 + b + sway)},${hem} Q${r2(24 + sway)},${r2(hem + 1.8)} ${r2(24 - b + sway)},${hem} Z`;
  const shadeX = view === 'se' ? 25.4 : 27.2;
  const pleats = [-0.45, 0.1].map(t => L([24 + t * a, top + 2.4], [24 + t * b * 1.1 + sway, hem + 0.4], c.basS, 0.6)).join('');
  return P(d, c.bas) + clip(`${c.uid}sk`, d, `<path d="M${shadeX},${top} L48,${top} L48,${hem + 3} L${r2(shadeX + 1 + sway)},${hem + 3} Z" fill="${c.basS}"/>` + pleats
    + L([24 - a + 1, top + 1], [24 - b + 1.6 + sway, hem - 0.4], c.basH, 0.9)) + P(d, 'none');
}
// Jambe de short (par-dessus la jambe nue, elle la suit) : appelée par le pied de la troupe (c.foot)
function shortLeg(c, x, frayed = false) {
  const w = c.legW + 1.8, y0 = c.hip - 0.4, y1 = c.hip + c.shortLen;
  let s = `<rect x="${r2(x - w / 2)}" y="${r2(y0)}" width="${r2(w)}" height="${r2(y1 - y0)}" rx="1.2" fill="${c.bas}" stroke="${OUT}" stroke-width="1.1"/>`
    + `<rect x="${r2(x + w / 2 - 1.9)}" y="${r2(y0 + 0.6)}" width="1.2" height="${r2(y1 - y0 - 1.2)}" rx="0.5" fill="${c.basS}"/>`;
  s += frayed
    ? P(`M${r2(x - w / 2 + 0.2)},${r2(y1 - 0.2)} L${r2(x - w / 4)},${r2(y1 + 1.2)} L${x},${r2(y1 + 0.2)} L${r2(x + w / 4)},${r2(y1 + 1.4)} L${r2(x + w / 2 - 0.2)},${r2(y1 - 0.2)}`, 'none', 0.8)
    : L([x - w / 2 + 0.7, y1 - 1.2], [x + w / 2 - 0.7, y1 - 1.2], c.basS, 0.6);
  return s;
}

function body(c, ctx) {
  const { view, n, walk } = ctx;
  const k = c.k, haut = c.o.haut, bas = c.o.bas;
  const ne = view === 'ne', se = view === 'se';
  const tucked = bas === 'jupe' || bas === 'salopette' || bas === 'robe';
  const hem = tucked ? 44.8 : 46.6;
  const T = torso(k, hem);
  const top = c.top, topS = c.topS, topH = c.topH;
  const o = se ? 21.6 : 24; // le milieu du devant
  const sway = walk ? [0.5, 0, -0.5, 0][n] : 0;
  let s = '';
  // 1. ce qui passe sous le haut : la jupe, le bas de la robe, le fond du short
  if (bas === 'jupe') s += skirt(c, view, sway, 43.6, c.skirtHem);
  if (bas === 'robe') s += skirt(c, view, sway, 43.6, c.robeHem);
  if (bas === 'short') s += `<rect x="21.6" y="44.4" width="4.8" height="4.6" fill="${c.bas}"/>`;
  // 2. le haut
  const mar = haut === 'mariniere';
  s += P(T, mar ? c.base : top);
  let inner = mar
    ? [35.2, 38, 40.8, 43.6, 46.4].map(y => `<rect x="8" y="${y}" width="32" height="1.3" fill="${c.stripe}"/>`).join('')
      + `<rect x="${se ? 25.4 : 27.2}" y="30" width="14" height="22" fill="rgba(60,40,25,.13)"/>`
    : `<rect x="${se ? 25.4 : 27.2}" y="30" width="14" height="22" fill="${topS}"/><path d="M8,${hem - 0.6} Q24,${hem + 2.4} 40,${hem - 0.6} L40,52 L8,52 Z" fill="${topS}"/>`
      + `<rect x="${r2(24 - k.sw + 0.1)}" y="34" width="1.3" height="10" rx="0.6" fill="${topH}"/>`;
  if (haut === 'pull' || haut === 'sweat') inner += `<rect x="6" y="${hem - 2}" width="36" height="2" fill="${topS}"/>`
    + (haut === 'pull' ? [17, 20, 23, 26, 29, 32].map(x => L([x, hem - 1.8], [x, hem], tone(top, 0.7), 0.4)).join('') : '');
  // la veste ouverte laisse voir ce qu'il y a dessous : le t-shirt, ou la robe, la salopette
  const under = bas === 'robe' || bas === 'salopette' ? c.bas : c.tee;
  if (haut === 'veste' && !ne) {
    inner += `<path d="M${o - 3.4},31.6 L${o + 3.4},31.6 L${o + 3},49 L${o - 3},49 Z" fill="${under}"/>` + L([o - 3.3, 32], [o - 2.9, 48.8], OUT, 0.8) + L([o + 3.3, 32], [o + 2.9, 48.8], OUT, 0.8);
  }
  if (haut === 'sweat' && !ne) {
    const pk = `M${o - 5.2},40.6 L${o + 5.2},40.6 L${o + 6.4},${hem - 1.4} L${o - 6.4},${hem - 1.4} Z`;
    inner += P(pk, tone(top, 0.92), 0.7) + P(`M${o - 5.2},40.6 Q${o - 5.4},43 ${o - 6.4},${hem - 1.4} M${o + 5.2},40.6 Q${o + 5.4},43 ${o + 6.4},${hem - 1.4}`, 'none', 0.6);
  }
  s += clip(`${c.uid}t`, T, inner) + P(T, 'none');
  // 3. le col et les détails du devant ; de dos, la couture et la capuche
  if (ne) {
    s += P('M24,33.8 L24,47.4', 'none', 0.5);
    if (haut === 'chemise' || haut === 'veste') s += P('M17.6,31.4 Q24,34.4 30.4,31.4 L30,33.6 Q24,36.2 18,33.6 Z', topS, 0.8);
    if (haut === 'sweat') s += P('M16.4,30.8 Q24,29.2 31.6,30.8 Q32.8,37.6 24,40.2 Q15.2,37.6 16.4,30.8 Z', topS, 0.9) + P('M19.6,32.6 Q24,37.6 28.4,32.6', 'none', 0.6);
  } else if (haut === 'chemise') {
    s += P(`M${o - 4.6},31.2 L${o},34.8 L${o - 1.6},36.4 Z`, '#FFFDF6', 0.8) + P(`M${o + 4.6},31.2 L${o},34.8 L${o + 1.6},36.4 Z`, '#FFFDF6', 0.8);
    s += L([o, 35], [o + (se ? -0.4 : 0), hem + 1], OUT, 0.6) + [38.4, 41.8, 45].filter(y => y < hem).map(y => E(o + 1, y, 0.55, 0.55, '#FFFDF6', 0.5)).join('');
  } else if (haut === 'pull') {
    s += P(`M${o - 4},31.4 Q${o},34.6 ${o + 4},31.4 L${o + 4},32.8 Q${o},36 ${o - 4},32.8 Z`, topS, 0.8);
  } else if (haut === 'veste') {
    s += P(`M${o - 3.4},31.6 L${o - 1.2},36.4 L${o - 4.6},34 Z`, topS, 0.8) + P(`M${o + 3.4},31.6 L${o + 1.2},36.4 L${o + 4.6},34 Z`, topS, 0.8);
  } else if (mar) {
    s += P(`M${o - 5.4},31.8 Q${o},33.4 ${o + 5.4},31.8`, 'none', 0.8); // encolure bateau
  } else if (haut === 'tshirt') {
    s += P(`M${o - 3.2},31.4 Q${o},34.4 ${o + 3.2},31.4`, 'none', 0.8);
  }
  // 4. par-dessus le haut : la salopette (bavette et bretelles), le corsage de la robe (sauf sous la veste ouverte)
  if (bas === 'salopette') {
    s += P(`M${r2(24 - k.hw + 0.2)},43.2 L${r2(24 + k.hw - 0.2)},43.2 L${r2(24 + k.hw)},46.6 Q24,48 ${r2(24 - k.hw)},46.6 Z`, c.bas)
      + P(`M${r2(24 - k.hw + 1)},43.4 L${r2(24 - k.hw + 1.4)},46.2`, 'none', 0.5);
    if (haut !== 'veste' || ne) s += bretelles(c, view, o, true);
  }
  if (bas === 'robe' && (haut !== 'veste' || ne)) {
    const d = ne ? 'M0,40.2 Q24,41.6 48,40.2 L48,50 L0,50 Z' : `M${o - 6.6},36.6 Q${o},37.8 ${o + 6.6},36.6 L${r2(o + k.hw + 1.6)},45.8 L${r2(o - k.hw - 1.6)},45.8 Z`;
    s += clip(`${c.uid}rb`, T, P(d, c.bas) + `<rect x="${se ? 25.4 : 27.2}" y="36" width="14" height="12" fill="${c.basS}" opacity="0.7"/>`) + P(T, 'none')
      + bretelles(c, view, o, false);
  }
  return s;
}
// Bretelles de la salopette (avec la bavette) ou de la robe ; de dos, elles se croisent
function bretelles(c, view, o, bavette) {
  const { sw } = c.k;
  if (view === 'ne') {
    return limb([24 - sw + 2, 32.4], [27.4, bavette ? 43.4 : 40.6], 1.6, c.bas) + limb([24 + sw - 2, 32.4], [20.6, bavette ? 43.4 : 40.6], 1.6, c.bas);
  }
  let s = '';
  if (bavette) {
    const bib = `M${o - 5},37.2 L${o + 5},37.2 L${o + 5.4},44 L${o - 5.4},44 Z`;
    s += P(bib, c.bas) + clip(`${c.uid}bv`, bib, `<rect x="${o + 2.4}" y="36" width="5" height="9" fill="${c.basS}"/>`) + P(bib, 'none')
      + P(`M${o - 2.4},39.2 L${o + 2.4},39.2 L${o + 2.2},42 L${o - 2.2},42 Z`, 'none', 0.6);
  }
  const y0 = bavette ? 37.8 : 37.2, x0 = bavette ? 4.2 : 5.4;
  s += limb([o - x0, y0], [24 - sw + 1.8, 32.2], 1.6, c.bas) + limb([o + x0, y0], [24 + sw - 1.8, 32.2], 1.6, c.bas);
  if (bavette) s += E(o - x0, y0 + 0.2, 0.8, 0.8, '#E8C46A', 0.6) + E(o + x0, y0 + 0.2, 0.8, 0.8, '#E8C46A', 0.6);
  return s;
}

function neck(c, { view }) {
  const o = view === 'se' ? 21.6 : 24;
  let s = '';
  // la capuche du sweat, roulée autour du cou, et ses deux cordons (rentrés sous la robe ou la bavette)
  if (c.o.haut === 'sweat' && view !== 'ne') {
    const dessous = c.o.bas === 'robe' || c.o.bas === 'salopette';
    s += P(`M${o - 6.4},31 Q${o},35.6 ${o + 6.4},31 L${o + 8.2},32.6 Q${o},39 ${o - 8.2},32.6 Z`, c.topS, 0.9);
    if (!dessous) s += [-1.8, 1.8].map(d => L([o + d, 35.2], [o + d * 1.2, 40], OUT, 1.5) + L([o + d, 35.2], [o + d * 1.2, 40], c.tee, 0.6) + E(o + d * 1.2, 40.3, 0.6, 0.6, c.tee, 0.5)).join('');
  }
  if (c.o.accessoire !== 'foulard') return s;
  if (view === 'ne') return s + P('M16.8,31 Q24,34.4 31.2,31 L31.6,33.6 Q24,37 16.4,33.6 Z', c.acc);
  const kx = view === 'se' ? 18.6 : 20.8;
  return s + P('M16.8,31 Q24,34.6 31.2,31 L31.6,33.6 Q24,37.4 16.4,33.6 Z', c.acc) + P(`M${kx},35 L${kx - 1.6},40.4 L${kx + 1.4},39.8 L${kx + 1.6},35.6 Z`, c.acc) + E(kx + 0.6, 35.4, 1.7, 1.3, tone(c.acc, 0.8), 0.9);
}

// ---- les gestes ----
// Le Grimoire tenu ouvert contre soi (lire) : couverture brune, pages claires
function book(x, y) {
  return P(`M${x - 6},${y} L${x + 6},${y} L${x + 6},${y + 6.4} L${x - 6},${y + 6.4} Z`, '#7A4E2C', 0.9)
    + P(`M${x - 5.2},${y - 0.6} Q${x - 2.6},${y - 1.6} ${x},${y} Q${x + 2.6},${y - 1.6} ${x + 5.2},${y - 0.6} L${x + 5.2},${y + 5.4} Q${x + 2.6},${y + 4.6} ${x},${y + 5.8} Q${x - 2.6},${y + 4.6} ${x - 5.2},${y + 5.4} Z`, '#FBF4E2', 0.8)
    + L([x, y], [x, y + 5.8], OUT, 0.6) + [1.6, 2.8, 4].map(d => L([x - 4.2, y + d], [x - 1.2, y + d], '#C9B98F', 0.45) + L([x + 1.2, y + d], [x + 4.2, y + d], '#C9B98F', 0.45)).join('');
}

// Les gestes suivent la taille (dy) et la largeur des épaules (e : écart à la corpulence moyenne)
function pose({ pose, n }) {
  const dy = this.dy, e = this.k.sw - 8.5;
  const [shL, shR] = this.shoulders;
  if (pose === 'salut') return { open: true, right: arm(this, shR, n === 0 ? [37.4 + e * 0.64, 25.4 + dy] : [38.8 + e * 0.64, 27.4 + dy]) };
  if (this.geste === 'grelotter') {
    // bras croisés, les mains sur les bras ; il tremble (un demi-pixel d'une image à l'autre)
    const d = n ? 0.5 : -0.5;
    const left = arm(this, shL, [27.4 + d, 38.6 + dy], [19 + d - e * 0.5, 41 + dy]);
    const right = arm(this, shR, [20.6 + d, 38.2 + dy], [29 + d + e * 0.5, 40.6 + dy]);
    return { expr: 'triste', left: '', right: '', over: left + right };
  }
  if (this.geste === 'lire') {
    const left = arm(this, shL, [19.6, 41.4 + dy], [15.6 - e * 0.5, 41.4 + dy]);
    const right = arm(this, shR, [28.4, 41.4 + dy], [32.4 + e * 0.5, 41.4 + dy]);
    return { expr: n ? 'surpris' : 'neutre', left: '', right: '', over: book(24, 37.4 + dy) + left + right };
  }
  // ramasser (trois quarts avant) : le bras de devant descend vers le sol, la main ouverte, la tête suit
  const reach = n ? [13.2, 50.4 + dy * 0.6] : [14.4, 47 + dy * 0.6];
  return { expr: 'content', left: arm(this, shL, reach, [14.2 - e * 0.6, 40.6 + dy]) };
}

// ---- l'avatar ----
// Un choix inconnu est une erreur (jamais un dessin silencieusement faux)
function verifier(o) {
  for (const [k, v] of Object.entries(o)) if (CHOIX[k] && !(v in CHOIX[k])) throw new Error(`choix inconnu : ${k} = ${v}`);
  return o;
}
// Le haut du corps (tête, buste, ce qui passe derrière) se décale avec la taille
const up = (f, dy) => (dy ? (cc, ctx, act) => { const s = f(cc, ctx, act); return s ? `<g transform="translate(0 ${dy})">${s}</g>` : ''; } : f);

function avatar(choix = {}, opts = {}) {
  const o = verifier({ ...DEFAUT, ...choix });
  const k = CORPS[o.silhouette], dy = TAILLE[o.taille];
  const skin = CHOIX.peau[o.peau];
  const hair = CHOIX.cheveux[o.cheveux];
  const top = CHOIX.couleurHaut[o.couleurHaut];
  const bas = CHOIX.couleurBas[o.couleurBas];
  const shoeC = CHOIX.chaussures[o.chaussures];
  // jambes nues sous le short, la jupe et la robe
  const nues = o.bas === 'short' || o.bas === 'jupe' || o.bas === 'robe';
  const sp = (k.hw - 10.2) * 0.45;
  const legLen = 56.5 - (44.5 + dy);
  // marinière : rayures de la couleur choisie sur un fond écru (sur fond blanc quand la couleur est déjà crème)
  const mar = o.haut === 'mariniere';
  const base = mar ? (o.couleurHaut === 'creme' ? '#FFFDF6' : '#F4EEDF') : top;
  const stripe = mar && o.couleurHaut === 'creme' ? tone(top, 0.8) : top;
  const c = {
    name: 'Avatar', uid: opts.uid || 'av', o, k, dy, geste: opts.geste,
    skin, skinS: tone(skin, 0.88), mole: tone(skin, 0.5),
    hair, hairS: tone(hair, 0.74), hairH: tone(hair, 1.32), buzz: mix(hair, skin, 0.38), buzzS: tone(mix(hair, skin, 0.38), 0.78), tie: o.cheveux === 'roux' ? '#3E5A8C' : '#C8463A',
    eye: CHOIX.yeux[o.yeux], cheek: o.joues === 'roses' ? '#F29E9A' : tone('#F29E9A', 1.18), freckle: tone(skin, 0.7),
    top, topS: tone(top, 0.82), topH: tone(top, 1.28), tee: '#F4EEDF', base, stripe,
    bas, basS: tone(bas, 0.78), basH: tone(bas, 1.25),
    acc: o.accessoire === 'bonnet' ? '#4F5A72' : o.accessoire === 'casquette' ? '#3E78C8' : o.accessoire === 'bandana' ? '#C8463A' : o.accessoire === 'foulard' ? '#E8C46A' : null,
    sleeve: base, armW: k.arm,
    cuff: { pull: tone(top, 0.82), sweat: tone(top, 0.82), veste: tone(top, 0.82), chemise: '#FFFDF6', mariniere: stripe }[o.haut] || null,
    sleeves: o.haut === 'tshirt' || mar ? 'roll' : undefined, sleeveCut: mar ? 4.4 : 6.4,
    leg: nues ? skin : bas, legS: nues ? tone(skin, 0.88) : tone(bas, 0.78), legW: nues ? k.legW - 0.9 : k.legW,
    hip: r2(44.5 + dy), ground: 56.5,
    skirtHem: r2(44.5 + legLen * 0.6), robeHem: r2(44.5 + legLen * 0.66), shortLen: r2(legLen * 0.64),
    shoe: shoeC, shoeS: tone(shoeC, 0.72), shoeH: tone(shoeC, 1.25),
    legX: { front: [20.5 - sp, 27.5 + sp], se: [20 - sp, 27.6 + sp], ne: [21 - sp, 28 + sp] },
    shoulders: [[24 - (k.sw - 0.5), 34 + dy], [24 + (k.sw - 0.5), 34 + dy]],
    hands: [[24 - (k.hw - 0.4 + k.b * 0.6), 45.2 + dy], [24 + (k.hw - 0.4 + k.b * 0.6), 45.2 + dy]],
    backItems: up((cc, ctx) => hairBehindBody(cc, ctx.view), dy),
    body: up(body, dy), neck: up(neck, dy), head: up(head, dy), pose
  };
  if (o.bas === 'short') c.foot = (cc, x, y, dir, tilt) => shortLeg(cc, x) + shoe(cc, x, y, dir, tilt);
  return c;
}

// Les chapeaux, la mer les a gardés : le naufragé n'a plus que ses lunettes, son foulard ou son bandana
const CHAPEAUX = new Set(['bonnet', 'paille', 'casquette']);
const sansChapeau = choix => (CHAPEAUX.has(choix.accessoire) ? { ...choix, accessoire: 'aucun' } : choix);

// Couleur délavée par la mer (même formule que design/atelier/naufrage.js)
const delave = (c, k = 1) => { const [h, s, l] = hsl(c); return hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]); };

// Le même avatar au petit format du jeu : le « look » de src/world/villagers.js (villagerSprite). La forme du visage
// et des yeux, la bouche, le grain de beauté, la couleur des yeux et la forme du haut (sauf les rayures de la marinière)
// ne se voient qu'au grand format ; tout le reste se retrouve.
// Mesures de départ des silhouettes du jeu (BUILDS de villagers.js) : mince (slim) et costaud (broad)
const BUILD = { slim: { torso: 9, legs: 7 }, broad: { torso: 9.4, legs: 6.6 } };
function lookPetit(choix = {}, { naufrage = false } = {}) {
  const o = verifier({ ...DEFAUT, ...(naufrage ? sansChapeau(choix) : choix) });
  const f = c => (naufrage ? delave(c) : c);
  const mar = o.haut === 'mariniere';
  const top = CHOIX.couleurHaut[o.couleurHaut];
  const build = o.silhouette === 'large' || o.silhouette === 'ronde' ? 'broad' : 'slim';
  const t = { petite: [-0.6, -1.4], moyenne: [0, 0], grande: [0.4, 1] }[o.taille];
  const shape = { torso: BUILD[build].torso + t[0], legs: BUILD[build].legs + t[1] };
  if (o.silhouette === 'fine') shape.width = 8.2;
  if (o.silhouette === 'ronde') shape.width = 12.4;
  const look = {
    skin: CHOIX.peau[o.peau], hair: CHOIX.cheveux[o.cheveux],
    style: { courte: 'short', meche: 'swept', bataille: 'messy', carre: 'bob', longue: 'long', queue: 'ponytail', couettes: 'pigtails', chignon: 'bun', tresses: 'braids', bouclee: 'curly', locks: 'locs', rasee: 'buzz' }[o.coupe],
    top: f(mar ? (o.couleurHaut === 'creme' ? '#FFFDF6' : '#F4EEDF') : top), stripes: mar ? f(o.couleurHaut === 'creme' ? tone(top, 0.8) : top) : null,
    bottom: f(CHOIX.couleurBas[o.couleurBas]), bottomStyle: { short: 'shorts', jupe: 'skirt', salopette: 'overalls', robe: 'dress' }[o.bas] || null,
    shoes: CHOIX.chaussures[o.chaussures],
    build, shape,
    freckles: o.rousseur === 'oui', blush: o.joues === 'roses',
    glasses: o.accessoire === 'lunettes',
    hat: { bonnet: 'beanie', paille: 'straw', casquette: 'cap', bandana: 'scarf' }[o.accessoire] || null,
    neckerchief: o.accessoire === 'foulard' ? f('#E8C46A') : null,
    tool: null
  };
  if (naufrage) Object.assign(look, { barefoot: true, castaway: { sail: null, weed: true, bandage: false } });
  return look;
}

module.exports = { avatar, lookPetit, sansChapeau, shortLeg, CHOIX, LIBELLES, libelle, DEFAUT, tone, delave };
