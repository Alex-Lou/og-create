// Les rochers refaits au niveau des PNJ, un par un, avec le trait et la lumière des arbres (arbres.js) : le rocher, les
// rochers, l'aiguille, les rochers moussus.
// Cadre et ancrage des décors de deco.js (PROP, centre de la case en (0, 0)).
const { OUT, E, r2 } = require('./troupe');
const { fleurette, herbe, congere, feuilleMorte, ROUSSES } = require('./arbres');

// les teintes de la pierre : clair (le dessus, au soleil), moyen, sombre (le flanc droit), les fentes
const PIERRES = {
  gris: { light: '#D3CDC2', mid: '#ABA498', dark: '#857E73', fente: '#6B655C' },
  ocre: { light: '#EDCD9A', mid: '#CFA06E', dark: '#A7774D', fente: '#8A5E3A' },
  sombre: { light: '#A39D96', mid: '#7A746E', dark: '#56514C', fente: '#433E3A' }
};
const sc = (d, k) => d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));

// un bloc de pierre détouré : le dessus clair, le flanc droit sombre, une ombre au pied, les fentes, un reflet ;
// d, haut, flanc, fentes et reflet sont donnés à la taille 1 et mis à l'échelle k ; dedans : un dessin de plus, découpé
// dans le bloc (la mousse)
function bloc(id, { d, haut, flanc, fentes = '', reflet = '' }, c, k, dedans = '') {
  return `<path d="${sc(d, k)}" fill="${c.mid}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${sc(d, k)}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<path d="${sc(flanc, k)}" fill="${c.dark}"/>`
    + `<path d="${sc(haut, k)}" fill="${c.light}"/>`
    + `<path d="${sc('M-30,1 Q0,-3 30,1 L30,8 L-30,8 Z', k)}" fill="${c.dark}" opacity="0.55"/>`
    + (fentes && `<path d="${sc(fentes, k)}" stroke="${c.fente}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`)
    + (reflet && `<path d="${sc(reflet, k)}" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.75"/>`)
    + dedans + '</g>';
}

// le lézard qui prend le soleil, vu d'en haut, tête vers la droite : la queue enroulée, quatre pattes, l'œil, le sourire
const lezard = (x, y, a, s) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${r2(s)})">`
  + E(-2, -1.9, 1, 0.6, '#7BB34C', 0.5) + E(2.6, -1.9, 1, 0.6, '#7BB34C', 0.5)
  + `<path d="M-3,0.4 Q-7.6,1.8 -10,-0.4 Q-11.2,-2.2 -9.6,-2.8 Q-9.8,-1.4 -8,-0.6 Q-6,0 -3,-1.2 Z" fill="#8CC45A" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + E(0, 0, 4.2, 1.9, '#8CC45A', 0.7) + E(-0.6, -0.6, 2.6, 0.8, '#B7DE86', 0)
  + E(-1.6, 0.2, 0.45, 0.45, '#5E9A3E', 0) + E(0.6, 0.5, 0.45, 0.45, '#5E9A3E', 0) + E(1.8, -0.2, 0.4, 0.4, '#5E9A3E', 0)
  + E(-2, 1.9, 1, 0.6, '#7BB34C', 0.5) + E(2.6, 1.9, 1, 0.6, '#7BB34C', 0.5)
  + E(4.9, -0.4, 2.2, 1.6, '#8CC45A', 0.7) + E(4.5, -1, 1, 0.5, '#B7DE86', 0)
  + E(5.6, -0.9, 0.7, 0.75, OUT, 0) + E(5.4, -1.15, 0.24, 0.24, '#FFFFFF', 0)
  + `<path d="M5.4,0.4 Q6.2,0.8 6.8,0.2" stroke="${OUT}" stroke-width="0.45" fill="none" stroke-linecap="round"/>` + '</g>';

// ——— Le rocher : un gros bloc arrondi et son caillou ; un lézard y prend parfois le soleil ———
const ROCHER = {
  d: 'M-18,0 Q-20,-7 -15,-12 Q-11,-19 -2,-20 Q8,-21 13,-15 Q19,-9 18,-2 Q17,2 10,2.6 Q0,3.6 -10,2.6 Q-17,2 -18,0 Z',
  haut: 'M-22,-10 Q-14,-11 -4,-13.4 Q4,-15 9,-19 L9,-26 L-22,-26 Z',
  flanc: 'M4,-24 Q9,-14 6,-6 Q4,0 5,6 L26,6 L26,-24 Z',
  fentes: 'M-3,-20 Q-1.6,-16.6 -4,-13.6 M6,-6 Q9,-4.6 10.4,-1.4 M-12,-4 l3,1.2',
  reflet: 'M-13.4,-12.6 Q-10,-17 -5,-18'
};
const CAILLOU = {
  d: 'M-4,0.6 Q-4.6,-2.6 -1.4,-3.6 Q2.4,-4.2 3.8,-1.4 Q4.4,0.8 2,1.2 Q-1,1.6 -4,0.6 Z',
  haut: 'M-6,-1.6 Q-2,-2 2,-3.6 L2,-6 L-6,-6 Z',
  flanc: 'M1,-5 Q2.4,-2 1.4,2 L6,2 L6,-5 Z'
};

// teinte : 'gris' ou 'ocre' ; petit : × 0,75 ; lezard : un lézard au soleil sur le dessus
function rocher({ teinte = 'gris', petit = false, lezard: avecLezard = false } = {}) {
  const c = PIERRES[teinte], k = petit ? 0.75 : 1;
  const id = `roc${petit ? 'p' : 'g'}${teinte[0]}${avecLezard ? 'l' : ''}`;
  return E(1, 1.5, 22 * k, 6.5 * k, 'rgba(40,55,20,0.22)', 0)
    + bloc(`${id}a`, ROCHER, c, k)
    + `<g transform="translate(${r2(-21 * k)} ${r2(3.4 * k)})">${bloc(`${id}b`, CAILLOU, c, k)}</g>`
    + (avecLezard ? lezard(-1 * k, -18.6 * k, -12, Math.max(k, 0.85)) : '');
}

// ——— Le rocher au fil des saisons (en été, c'est le rocher au lézard) ———
// printemps : des touffes d'herbe neuve et des fleurettes au pied ; automne : des feuilles mortes sur le dessus et au
// pied ; hiver : une calotte de neige au bord ondulé sur le dessus (ombrée de bleu), une congère au pied
const NEIGE_ROCHER = 'M-22,-8.6 Q-17,-7.4 -13,-10.2 Q-8,-8 -3,-11.2 Q3,-9.4 7.6,-13 Q11.6,-10.4 15.6,-11.6 Q19,-9 22,-9.4 L22,-26 L-22,-26 Z';
const NEIGE_CAILLOU = 'M-6,-0.6 Q-3,0.4 -1,-1.6 Q1.4,-0.2 3,-1.8 Q4.6,-0.6 6,-0.8 L6,-6 L-6,-6 Z';
const neigeSur = (d, k) => `<path d="${sc(d.replace(/-?\d+(\.\d+)?,(-?\d+(\.\d+)?)/g, (m, x, y) => `${x},${r2(+y + 1.3)}`), k)}" fill="#D6E4EE"/><path d="${sc(d, k)}" fill="#FFFFFF"/>`;
function rocherSaison({ saison = 'hiver', petit = false } = {}) {
  const c = PIERRES.gris, k = petit ? 0.75 : 1, hiver = saison === 'hiver';
  const id = `rocs${saison[0]}${petit ? 'p' : 'g'}`;
  let o = E(1, 1.5, 22 * k, 6.5 * k, hiver ? 'rgba(60,80,110,0.22)' : 'rgba(40,55,20,0.22)', 0)
    + bloc(`${id}a`, ROCHER, c, k, hiver ? neigeSur(NEIGE_ROCHER, k) : '')
    + `<g transform="translate(${r2(-21 * k)} ${r2(3.4 * k)})">${bloc(`${id}b`, CAILLOU, c, k, hiver ? neigeSur(NEIGE_CAILLOU, k) : '')}</g>`;
  if (hiver) o += congere(k * 0.9);
  else if (saison === 'automne') o += [[-8, -17.6, 30, 0, 1], [3, -18.6, -40, 1, 0.95], [10, -14, 70, 2, 0.9]].map(([x, y, a, i, s]) => feuilleMorte(x * k, y * k, a, ROUSSES[i], s)).join('')
    + [[-14, 4.6, 50, 1], [8, 5.4, -20, 0], [15, 3.4, 80, 2], [-2, 6.2, 10, 2]].map(([x, y, a, i]) => feuilleMorte(x * k, y, a, ROUSSES[i])).join('');
  else o += herbe(-12 * k, 4.6, '#9ACD5E', 0.8) + herbe(14 * k, 3.6, '#8CC152', 0.75) + [[-6, 5.4, '#FFFFFF'], [9, 5.8, '#F7B6C8'], [18, 4.2, '#FFFFFF'], [-17, 6.4, '#F2C04B']].map(([x, y, col]) => fleurette(x * k, y, col)).join('');
  return o;
}
const ROCHERS_SAISONS = [];
for (const saison of ['printemps', 'automne', 'hiver']) for (const petit of [false, true]) {
  ROCHERS_SAISONS.push([['rocher', saison, petit && 'petit'].filter(Boolean).join('_'), `Rocher ${{ printemps: 'de printemps', automne: 'd\'automne', hiver: 'd\'hiver' }[saison]} (${petit ? 'petit' : 'grand'}, ${{ printemps: 'herbe neuve et fleurettes au pied', automne: 'feuilles mortes dessus et au pied', hiver: 'calotte de neige, congère au pied' }[saison]})`, { saison, petit }]);
}

// Les 8 rochers : [fichier, libellé, options] ; « rocher » (grand, gris, sans lézard) est celui par défaut
const ROCHERS = [];
for (const petit of [false, true]) for (const teinte of ['gris', 'ocre']) for (const lz of [false, true]) {
  const fichier = ['rocher', petit && 'petit', teinte === 'ocre' && 'ocre', lz && 'lezard'].filter(Boolean).join('_');
  const libelle = `Rocher (${[petit ? 'petit' : 'grand', teinte === 'ocre' ? 'grès ocre' : 'granite gris', lz && 'un lézard'].filter(Boolean).join(', ')})`;
  ROCHERS.push([fichier, libelle, { teinte, petit, lezard: lz }]);
}

// ——— Les rochers : un tas de trois blocs, un haut au fond, un plat devant, un caillou ; des galets au pied parfois ———
const BLOC_HAUT = {
  d: 'M-12,0 Q-13.6,-7 -10.4,-12.4 L-3,-16.6 Q2.6,-18.6 7,-15.6 Q11.6,-11.6 11.4,-5 Q11,0.6 4,1.6 Q-6,2 -12,0 Z',
  haut: 'M-16,-10 Q-8,-11 -1,-13 Q4,-14.4 8,-16 L8,-24 L-16,-24 Z',
  flanc: 'M5,-20 Q7.4,-11 5.6,-5 Q4.6,-1 5.4,4 L16,4 L16,-20 Z',
  fentes: 'M0,-17.4 Q1.4,-14 -0.6,-11.4 M-8,-3 l2.4,1',
  reflet: 'M-9.4,-11.6 L-4,-14.8'
};
const BLOC_PLAT = {
  d: 'M-10,0 Q-11.4,-4.4 -7.6,-7.4 Q-3,-10 3,-9.4 Q8.6,-8.6 10,-4.4 Q11,-0.6 7.6,0.8 Q0,2 -10,0 Z',
  haut: 'M-14,-4.6 Q-6,-5.4 0,-6.6 Q4,-7.4 7,-9.8 L7,-14 L-14,-14 Z',
  flanc: 'M3,-12 Q6,-6 4,-2 Q3.4,0 4,3 L14,3 L14,-12 Z',
  fentes: 'M-3,-9.4 Q-2,-7.4 -3.4,-5.6',
  reflet: 'M-7,-6.4 Q-5,-8.4 -2,-9'
};
// un galet : ovale plat détouré, le dessus clair
const galet = (x, y, rx, ry, c) => E(x, y, rx, ry, c.mid, 0.6) + E(x - rx * 0.3, y - ry * 0.35, rx * 0.45, ry * 0.35, c.light, 0);
const GALETS = [[-4, 9.4, 2.4, 1.3], [5, 10.2, 1.9, 1.05], [18, 8, 2.2, 1.2], [-21, 3.4, 1.7, 0.95], [-12.6, 10, 1.4, 0.8]];
const pose = (x, y, k, svg) => `<g transform="translate(${r2(x * k)} ${r2(y * k)})">${svg}</g>`;

// teinte : 'gris' ou 'sombre' ; petits : × 0,75 ; galets : des galets semés au pied
function rochers({ teinte = 'gris', petits = false, galets = false } = {}) {
  const c = PIERRES[teinte], k = petits ? 0.75 : 1;
  const id = `rcs${petits ? 'p' : 'g'}${teinte[0]}${galets ? 'g' : ''}`;
  return E(1, 3, 25 * k, 8 * k, 'rgba(40,55,20,0.22)', 0)
    + pose(-5, -1, k, bloc(`${id}a`, BLOC_HAUT, c, k * 1.1))
    + pose(-13, 4.6, k, bloc(`${id}b`, CAILLOU, c, k * 1.25))
    + pose(8, 4, k, bloc(`${id}c`, BLOC_PLAT, c, k))
    + (galets ? GALETS.map(([x, y, rx, ry]) => galet(x * k, y * k, rx * k, ry * k, c)).join('') : '');
}

// Les 8 rochers en tas : [fichier, libellé, options] ; « rochers » (grands, gris, sans galets) est celui par défaut
const ROCHERS_TAS = [];
for (const petits of [false, true]) for (const teinte of ['gris', 'sombre']) for (const ga of [false, true]) {
  const fichier = ['rochers', petits && 'petits', teinte === 'sombre' && 'sombres', ga && 'galets'].filter(Boolean).join('_');
  const libelle = `Rochers (${[petits ? 'petits' : 'grands', teinte === 'sombre' ? 'pierre sombre' : 'granite gris', ga && 'des galets au pied'].filter(Boolean).join(', ')})`;
  ROCHERS_TAS.push([fichier, libelle, { teinte, petits, galets: ga }]);
}

// ——— L'aiguille : une flèche de pierre dressée, un bloc plat et un caillou au pied ; double, ou un oiseau à la pointe ———
const AIGUILLE = {
  d: 'M-11,0 Q-12,-9 -9.6,-17 L-6.4,-27 Q-5,-33 -1.6,-37 L3.4,-35.4 Q6.4,-30 7.4,-24 L9.2,-15 Q11,-7 10.4,-2 Q9.4,1.6 3,1.8 Q-5,2 -11,0 Z',
  haut: 'M-16,-12 Q-10,-16 -7,-25 Q-4.4,-31 -1,-33.4 Q2,-33.4 4,-35 L4,-44 L-16,-44 Z',
  flanc: 'M2.4,-44 Q3,-30 4.2,-20 Q5.4,-8 4.4,4 L16,4 L16,-44 Z',
  fentes: 'M-9,-17 Q-6,-15.6 -3,-16.4 M-1.4,-31 Q0.4,-27.4 -1.8,-24 M5.4,-13 Q7.4,-10 6.8,-6 M-7,-6 l2.4,0.8',
  reflet: 'M-8.4,-18.6 L-5.8,-26.4'
};
// l'oiseau perché, tourné vers la gauche : rond, brun au ventre clair, l'aile, la queue, le bec orange, la joue rose
const oiseau = (x, y, s) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})">`
  + `<path d="M-0.6,-0.4 l-0.4,0.8 M1,-0.4 l0.4,0.8" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>`
  + `<path d="M2.6,-3 L6.6,-5.6 L6.4,-3 Z" fill="#8C6343" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`
  + E(0, -3.2, 3.6, 2.9, '#B98A5E', 0.7) + E(-0.9, -2.5, 2.2, 1.8, '#F1DDBF', 0)
  + `<path d="M-0.2,-4.4 Q2.6,-5.4 4,-3 Q2,-1.6 -0.2,-2.6 Z" fill="#8C6343" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`
  + E(-2.4, -6.2, 2.2, 2, '#B98A5E', 0.7) + E(-3.4, -5.4, 0.7, 0.4, '#F7A8B8', 0)
  + E(-3, -6.7, 0.55, 0.6, OUT, 0) + E(-3.15, -6.9, 0.18, 0.18, '#FFFFFF', 0)
  + `<path d="M-4.4,-6.5 L-6,-6 L-4.4,-5.5 Z" fill="#F2A33A" stroke="${OUT}" stroke-width="0.4" stroke-linejoin="round"/>` + '</g>';

// petite : × 0,75 ; double : une seconde aiguille, plus basse, derrière à droite ; oiseau : un oiseau perché à la pointe
function aiguille({ petite = false, double = false, oiseau: avecOiseau = false } = {}) {
  const c = PIERRES.gris, k = petite ? 0.75 : 1;
  const id = `aig${petite ? 'p' : 'g'}${double ? 'd' : ''}${avecOiseau ? 'o' : ''}`;
  return E(1, 2.5, 22 * k, 7 * k, 'rgba(40,55,20,0.22)', 0)
    + (double ? pose(10, -1.5, k, bloc(`${id}d`, AIGUILLE, c, k * 0.62)) : '')
    + pose(-2, 0, k, bloc(`${id}a`, AIGUILLE, c, k))
    + pose(-13, 4.4, k, bloc(`${id}b`, CAILLOU, c, k))
    + pose(10, 5, k, bloc(`${id}c`, BLOC_PLAT, c, k * 0.6))
    + (avecOiseau ? oiseau(-1.4 * k, -36.2 * k, Math.max(k, 0.85)) : '');
}

// Les 8 aiguilles : [fichier, libellé, options] ; « aiguille » (grande, seule, sans oiseau) est celle par défaut
const AIGUILLES = [];
for (const petite of [false, true]) for (const double of [false, true]) for (const oi of [false, true]) {
  const fichier = ['aiguille', petite && 'petite', double && 'double', oi && 'oiseau'].filter(Boolean).join('_');
  const libelle = `Aiguille de roche (${[petite ? 'petite' : 'grande', double ? 'double' : 'seule', oi && 'un oiseau perché'].filter(Boolean).join(', ')})`;
  AIGUILLES.push([fichier, libelle, { petite, double, oiseau: oi }]);
}

// ——— Les rochers moussus : un gros bloc et un plat coiffés de mousse, un caillou ; des fleurettes ou un escargot ———
const MOUSSE = { light: '#B5DC86', mid: '#8FC25E', dark: '#6FA24A', bord: '#5E8F3E' };
// la mousse sur le dessus d'un bloc : bord festonné (liseré plus sombre), ombrée à droite, un reflet ; donnée à la taille 1
function mousse(bord, ombre, reflet, k) {
  return `<path d="${sc(bord, k)}" fill="${MOUSSE.mid}" stroke="${MOUSSE.bord}" stroke-width="0.7" stroke-linejoin="round"/>`
    + `<path d="${sc(ombre, k)}" fill="${MOUSSE.dark}"/>` + `<path d="${sc(reflet, k)}" fill="${MOUSSE.light}"/>`;
}
const MOUSSE_ROCHER = ['M-22,-11 Q-18,-8.4 -15,-10.6 Q-12,-7.4 -8.6,-10 Q-5.6,-7.2 -2,-9.6 Q1.6,-6.8 4.6,-9.6 Q8,-7.4 10.6,-10.4 Q14,-8.2 22,-11 L22,-26 L-22,-26 Z',
  'M7,-26 Q9.6,-18 8.6,-11 Q12,-9 22,-11 L22,-26 Z', 'M-11,-15.6 Q-7,-18.4 -1,-17.6 Q-5,-15.8 -11,-15.6 Z'];
const MOUSSE_PLAT = ['M-14,-4 Q-10,-2.2 -7,-4 Q-4,-1.8 -1,-3.8 Q2,-1.8 5,-4 Q8,-2.2 14,-4.6 L14,-14 L-14,-14 Z',
  'M4,-14 Q6,-8 5,-3.4 Q8,-2.4 14,-4.6 L14,-14 Z', 'M-6,-7 Q-3,-8.8 1,-8.4 Q-2,-7.2 -6,-7 Z'];
const FLEURS_MOUSSE = [[-12, -12.6, '#FFFFFF'], [-4.6, -15.6, '#F7B6C8'], [3, -13, '#FFFFFF'], [12, 0.6, '#F7B6C8'], [16.4, 1.4, '#FFFFFF']];
// l'escargot, tourné vers la droite : le pied clair, les deux cornes à œil, la coquille orange en spirale, un reflet
const escargot = (x, y, s) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})">`
  + `<path d="M4.6,-2.8 L5.2,-5.8 M5.4,-2.6 L6.8,-5.2" stroke="${OUT}" stroke-width="0.5" stroke-linecap="round"/>` + E(5.2, -5.9, 0.5, 0.5, OUT, 0) + E(6.8, -5.3, 0.5, 0.5, OUT, 0)
  + `<path d="M-4.4,0 Q-5,-1.2 -2.6,-1.4 L3,-1.4 Q4.4,-1.6 4.8,-3.2 L5.6,-3.2 Q6.6,-0.6 5,0.2 Q0,0.6 -4.4,0 Z" fill="#E9D9B8" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + E(-0.4, -3.6, 3.4, 3.1, '#E59A55', 0.7) + E(-1.2, -4.6, 1.4, 0.9, '#F4BE84', 0)
  + `<path d="M-0.2,-3.4 a0.8,0.8 0 1 1 0.9,-0.6 a1.8,1.8 0 1 1 -2.6,1.6" stroke="#B9692F" stroke-width="0.55" fill="none" stroke-linecap="round"/>`
  + `<path d="M5.2,-1.2 Q5.6,-0.8 6,-1.2" stroke="${OUT}" stroke-width="0.4" fill="none" stroke-linecap="round"/>` + '</g>';

// petits : × 0,75 ; fleuris : des fleurettes dans la mousse ; escargot : un escargot au pied
function rochersMoussus({ petits = false, fleuris = false, escargot: avecEscargot = false } = {}) {
  const c = PIERRES.gris, k = petits ? 0.75 : 1;
  const id = `rcm${petits ? 'p' : 'g'}${fleuris ? 'f' : ''}${avecEscargot ? 'e' : ''}`;
  const kg = k * 0.82, kp = k * 0.85;
  return E(1, 2.5, 24 * k, 7.5 * k, 'rgba(40,55,20,0.22)', 0)
    + pose(-4, -1, k, bloc(`${id}a`, ROCHER, c, kg, mousse(...MOUSSE_ROCHER, kg)))
    + pose(-17, 4.6, k, bloc(`${id}b`, CAILLOU, c, k))
    + pose(11, 4, k, bloc(`${id}c`, BLOC_PLAT, c, kp, mousse(...MOUSSE_PLAT, kp)))
    + (fleuris ? FLEURS_MOUSSE.map(([x, y, col]) => fleurette(x * k, y * k, col)).join('') : '')
    + (avecEscargot ? escargot(-8 * k, 8 * k, Math.max(k, 0.85)) : '');
}

// Les 8 rochers moussus : [fichier, libellé, options] ; « rochers_moussus » (grands, sans fleurs ni escargot) par défaut
const ROCHERS_MOUSSUS = [];
for (const petits of [false, true]) for (const fleuris of [false, true]) for (const es of [false, true]) {
  const fichier = ['rochers_moussus', petits && 'petits', fleuris && 'fleuris', es && 'escargot'].filter(Boolean).join('_');
  const libelle = `Rochers moussus (${[petits ? 'petits' : 'grands', fleuris && 'mousse fleurie', es && 'un escargot'].filter(Boolean).join(', ')})`;
  ROCHERS_MOUSSUS.push([fichier, libelle, { petits, fleuris, escargot: es }]);
}

module.exports = { rocherSaison, ROCHERS_SAISONS, rocher, ROCHERS, rochers, ROCHERS_TAS, aiguille, AIGUILLES, rochersMoussus, ROCHERS_MOUSSUS };
