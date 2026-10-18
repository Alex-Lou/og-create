// Maggy (anciennement Mélisse ; fichiers du jeu : melisse) : ses tenues, ses palettes et ses états. habiller(tenue,
// palette, etat) rend Maggy prête à passer à troupe.frame, comme pour toute la troupe refondue :
//   frame(habiller('tablier', 'lavande', 'terreuse'), 'front', 'repos', 0)
// Les trois réglages se combinent librement ; chacun a sa valeur par défaut (le châle, la palette de la tenue, poursuivie).
// Son arrivée (choix de l'auteur, 16 oct.) : sa barque de graines s'est brisée sur une autre côte ; elle a erré dans la
// forêt, quelqu'un la suivait ; elle en sort, en danger, et trouve des gens : c'est la poursuivie (le châle accroché aux
// ronces, des feuilles et une brindille dans le chapeau de travers, la tresse défaite, une égratignure). La naufragée (le
// jour de la barque) : délavée par la mer (la même formule que les autres naufragés, naufrage.js), le bas de la robe
// déchiré, le châle noué à la taille, le bord du chapeau déchiré et une algue accrochée, un sabot perdu.
const { fade } = require('../../atelier/naufrage');
const { maggy, C } = require('./maggy_refonte');
const { fondre } = require('../couleurs'); // le fondu néon des couleurs (le corps et les métaux gardent les leurs)

// Les palettes du vêtement (la robe ; la pèlerine pour la pluie) : la couleur, son ombre, son reflet
const PALETTES = fondre({
  sauge: { nom: 'Sauge', m: C.dress, mS: C.dressS, mH: C.dressH },
  lavande: { nom: 'Lavande', m: '#9A8AB8', mS: '#7A6A98', mH: '#BCAED6' },
  ocre: { nom: 'Ocre', m: '#C49A4A', mS: '#9C7634', mH: '#DDBA74' },
  rose: { nom: 'Rose thé', m: '#C98A86', mS: '#A66A66', mH: '#E2AEAA' },
  aubergine: { nom: 'Aubergine', m: C.cape, mS: C.capeS, mH: C.capeH },
  mousse: { nom: 'Mousse', m: '#6E8A5A', mS: '#546E44', mH: '#92AA7E' }
});

// Les tenues : la forme (maggy_refonte.js), la palette par défaut, les couleurs qu'elle règle, les manches
const TENUES = {
  chale: { nom: 'Le châle de nuit', tenue: 'chale', palette: 'sauge', sleeves: null, cles: ['dress', 'dressS', 'dressH'] },
  tablier: { nom: 'Le tablier du Potager', tenue: 'tablier', palette: 'lavande', sleeves: 'roll', cles: ['dress', 'dressS', 'dressH'] },
  pluie: { nom: 'La pèlerine de pluie', tenue: 'pluie', palette: 'aubergine', sleeves: null, cles: ['cape', 'capeS', 'capeH'] }
};

// Les états, du plus propre au plus abîmé ; marks : les marques sur elle (maggy_refonte.js, MARKS)
const ETATS = {
  propre: { nom: 'Propre', quand: 'au village, un jour sans jardin', marks: { dirt: 0, ronces: false, salt: 0, patch: false } },
  terreuse: { nom: 'Terreuse', quand: 'une journée au Potager', marks: { dirt: 1, ronces: false, salt: 0, patch: false } },
  rafistole: { nom: 'Rafistolée', quand: 'recousue au camp', marks: { dirt: 0.3, ronces: false, salt: 0, patch: true } },
  poursuivie: { nom: 'Poursuivie', quand: 'son arrivée : elle sort de la forêt, quelqu\'un la suivait', marks: { dirt: 0.4, ronces: true, salt: 0, patch: false } },
  naufrage: { nom: 'Naufragée', quand: 'le jour où sa barque de graines s\'est brisée, sur une autre côte', marks: { dirt: 0.2, ronces: false, salt: 1, patch: false, naufrage: true }, naufrage: true },
  trempe: { nom: 'Trempée', quand: 'l\'averse sur le Potager', marks: { dirt: 0.4, ronces: false, salt: 0, patch: false, wet: true }, sombre: 0.82 }
};

// Une couleur assombrie (l'eau fonce le tissu, la paille et les cheveux)
function assombrir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const MOUILLE = ['dress', 'dressS', 'dressH', 'shawl', 'shawlS', 'shawlH', 'apron', 'apronS', 'cape', 'capeS', 'capeH', 'straw', 'strawS', 'strawH', 'hair', 'hairS', 'hairH', 'band', 'bandS'];
// délavé par la mer : la robe, le châle, le tablier, la pèlerine, la paille, le ruban
const DELAVE = ['dress', 'dressS', 'dressH', 'shawl', 'shawlS', 'shawlH', 'apron', 'apronS', 'cape', 'capeS', 'capeH', 'straw', 'strawS', 'strawH', 'band', 'bandS'];

function habiller(tenueId = 'chale', paletteId = null, etatId = 'poursuivie') {
  const T = TENUES[tenueId], E = ETATS[etatId];
  if (!T) throw new Error(`tenue inconnue : ${tenueId}`);
  if (!E) throw new Error(`état inconnu : ${etatId}`);
  const pp = PALETTES[paletteId || T.palette];
  if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
  const [km, kS, kH] = T.cles;
  let pal = { [km]: pp.m, [kS]: pp.mS, [kH]: pp.mH };
  const K = () => ({ ...C, ...pal });
  if (E.sombre) { const k0 = K(); pal = Object.fromEntries(MOUILLE.map(k => [k, assombrir(k0[k], E.sombre)])); }
  if (E.naufrage) { const k0 = K(); pal = { ...pal, ...Object.fromEntries(DELAVE.map(k => [k, fade(k0[k], 0.6)])) }; }
  const k1 = K();
  // les mains toujours terreuses ; une journée au Potager, plus encore
  const hand = E.marks.dirt >= 0.8 ? C.handDirt : C.hand;
  return {
    ...maggy,
    uid: `mg${tenueId.slice(0, 2)}${(paletteId || T.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
    tenue: T.tenue, pal, marks: E.marks, sleeves: T.sleeves, hand,
    sleeve: k1.dress, leg: E.sombre ? assombrir(C.stock, 0.9) : C.stock, legS: E.sombre ? assombrir(C.stockS, 0.9) : C.stockS,
    teintes: [k1.hair, k1.straw, k1.shawl, k1.dress, k1.lavender, k1.cape]
  };
}

module.exports = { habiller, TENUES, PALETTES, ETATS };
