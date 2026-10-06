// Les rochers refaits au niveau des PNJ, un par un, avec le trait et la lumière des arbres (arbres.js) : le rocher.
// Cadre et ancrage des décors de deco.js (PROP, centre de la case en (0, 0)).
const { OUT, E, r2 } = require('./troupe');

// les teintes de la pierre : clair (le dessus, au soleil), moyen, sombre (le flanc droit), les fentes
const PIERRES = {
  gris: { light: '#D3CDC2', mid: '#ABA498', dark: '#857E73', fente: '#6B655C' },
  ocre: { light: '#EDCD9A', mid: '#CFA06E', dark: '#A7774D', fente: '#8A5E3A' }
};
const sc = (d, k) => d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));

// un bloc de pierre détouré : le dessus clair, le flanc droit sombre, une ombre au pied, les fentes, un reflet ;
// d, haut, flanc, fentes et reflet sont donnés à la taille 1 et mis à l'échelle k
function bloc(id, { d, haut, flanc, fentes = '', reflet = '' }, c, k) {
  return `<path d="${sc(d, k)}" fill="${c.mid}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${sc(d, k)}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<path d="${sc(flanc, k)}" fill="${c.dark}"/>`
    + `<path d="${sc(haut, k)}" fill="${c.light}"/>`
    + `<path d="${sc('M-30,1 Q0,-3 30,1 L30,8 L-30,8 Z', k)}" fill="${c.dark}" opacity="0.55"/>`
    + (fentes && `<path d="${sc(fentes, k)}" stroke="${c.fente}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`)
    + (reflet && `<path d="${sc(reflet, k)}" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.75"/>`)
    + '</g>';
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

// Les 8 rochers : [fichier, libellé, options] ; « rocher » (grand, gris, sans lézard) est celui par défaut
const ROCHERS = [];
for (const petit of [false, true]) for (const teinte of ['gris', 'ocre']) for (const lz of [false, true]) {
  const fichier = ['rocher', petit && 'petit', teinte === 'ocre' && 'ocre', lz && 'lezard'].filter(Boolean).join('_');
  const libelle = `Rocher (${[petit ? 'petit' : 'grand', teinte === 'ocre' ? 'grès ocre' : 'granite gris', lz && 'un lézard'].filter(Boolean).join(', ')})`;
  ROCHERS.push([fichier, libelle, { teinte, petit, lezard: lz }]);
}

module.exports = { rocher, ROCHERS };
