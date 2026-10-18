// Maerys (anciennement Sylve ; fichiers du jeu : sylve) : ses tenues, ses palettes et ses états. habiller(tenue, palette,
// etat) rend Maerys prête à passer à troupe.frame, comme pour Lorena, Agathe, Nathan, Robby et Léo :
//   frame(habiller('robe', 'sauge', 'propre'), 'front', 'repos', 0)
// Les trois réglages se combinent librement ; chacun a sa valeur par défaut (la cape, la palette de la tenue, sauvage).
// Comme Robby, c'est une ancienne naufragée : on ne la trouve pas endormie sur la plage, on la découvre, cachée dans les
// bois depuis des années (HISTOIRE.md, § 6.7) ; son état d'arrivée est le sauvage (la terre, la mousse, les brindilles).
// La naufragée (le jour où son radeau s'est brisé) : délavée par la mer (la même formule que les autres naufragés,
// naufrage.js), la cape perdue, une bande de voile en ceinture, la tunique trouée, et son don oublié (la graine ne germe
// plus : HISTOIRE.md, § 6.2).
const { fade } = require('../../atelier/naufrage');
const { maerys, C } = require('./maerys_refonte');
const { fondre } = require('../couleurs'); // le fondu néon des couleurs (le corps et les métaux gardent les leurs)

// Les palettes du vêtement (la tunique, la robe ou le manteau) : la couleur, son ombre, son reflet
const PALETTES = fondre({
  lin: { nom: 'Lin', m: C.tunic, mS: C.tunicS, mH: C.tunicH },
  sauge: { nom: 'Sauge', m: C.robe, mS: C.robeS, mH: C.robeH },
  mousse: { nom: 'Mousse', m: C.moss, mS: C.mossS, mH: C.mossH },
  ecorce: { nom: 'Écorce', m: '#8E5A3C', mS: '#6C412A', mH: '#B07A58' },
  bruyere: { nom: 'Bruyère', m: '#8A6A8C', mS: '#6A4E6C', mH: '#AE90B0' },
  automne: { nom: 'Automne', m: '#C0743E', mS: '#97562A', mH: '#DE9A62' }
});

// Les tenues : la forme (maerys_refonte.js, corps), la palette par défaut, les couleurs qu'elle règle
const TENUES = {
  cape: { nom: 'La cape de feuilles', tenue: 'cape', palette: 'lin', cles: ['tunic', 'tunicS', 'tunicH'] },
  robe: { nom: 'La robe d\'Agathe', tenue: 'robe', palette: 'sauge', cles: ['robe', 'robeS', 'robeH'] },
  mousse: { nom: 'Le manteau de mousse', tenue: 'mousse', palette: 'mousse', cles: ['moss', 'mossS', 'mossH'] }
};

// Les états, du plus propre au plus abîmé ; marks : les marques sur elle (maerys_refonte.js, MARKS)
const ETATS = {
  propre: { nom: 'Propre', quand: 'au village, apprivoisée', marks: { dirt: 0, moss: 0, twigs: 0, salt: 0, patch: false } },
  sale: { nom: 'Un peu sale', quand: 'une journée dans les bois', marks: { dirt: 1, moss: 0.8, twigs: 2, salt: 0, patch: false } },
  rafistole: { nom: 'Rafistolée', quand: 'recousue au camp', marks: { dirt: 0.2, moss: 0.2, twigs: 1, salt: 0, patch: true } },
  sauvage: { nom: 'Sauvage', quand: 'quand on la découvre, cachée à La Lisière depuis des années', marks: { dirt: 0.5, moss: 0.6, twigs: 2, salt: 0, patch: false } },
  naufrage: { nom: 'Naufragée', quand: 'le jour où son radeau s\'est brisé, il y a des années', marks: { dirt: 0.3, moss: 0.2, twigs: 1, salt: 1, patch: false, cape: 'perdue', don: false }, naufrage: true },
  trempe: { nom: 'Trempée', quand: 'la pluie, sous les arbres', marks: { dirt: 0.3, moss: 0.3, twigs: 1, salt: 0, patch: false, wet: true }, sombre: 0.82 }
};

// Une couleur assombrie (l'eau fonce le tissu, les feuilles et les cheveux)
function assombrir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const MOUILLE = ['tunic', 'tunicS', 'tunicH', 'robe', 'robeS', 'robeH', 'moss', 'mossS', 'mossH', 'leaf', 'leafS', 'leafH', 'vine', 'vineS', 'hair', 'hairS', 'hairH', 'canvas', 'canvasS'];
// délavé par la mer : le vêtement, les feuilles qui restent, la liane
const DELAVE = ['tunic', 'tunicS', 'tunicH', 'robe', 'robeS', 'robeH', 'moss', 'mossS', 'mossH', 'vine', 'vineS', 'leaf', 'leafS', 'leafH'];

function habiller(tenueId = 'cape', paletteId = null, etatId = 'sauvage') {
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
  const peau = E.sombre ? [assombrir(maerys.leg, 0.94), assombrir(maerys.legS, 0.94)] : [maerys.leg, maerys.legS];
  return {
    ...maerys,
    uid: `my${tenueId.slice(0, 2)}${(paletteId || T.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
    tenue: T.tenue, pal, marks: E.marks,
    leg: peau[0], legS: peau[1],
    teintes: [k1.hair, k1[km], k1.leaf, k1.feather]
  };
}

module.exports = { habiller, TENUES, PALETTES, ETATS };
