// Lorena (anciennement Hermine ; fichiers du jeu : aster) : ses tenues, ses palettes et ses états, du naufrage au propre.
// habiller(tenue, palette, etat) rend Lorena prête à passer à troupe.frame, comme enHiver et sousLaPluie (atelier/tenues.js) :
//   frame(habiller('vareuse', 'nuit', 'rafistolee'), 'front', 'repos', 0, 'veille')
// Les trois réglages se combinent librement ; chacun a sa valeur par défaut (cire, la palette de la tenue, rescapee).
// La naufragée passe par la transformation commune de l'atelier (naufrage.js : délavé, pieds nus, voile, algue).
// Vue de face seulement pour l'étude : les autres vues reprennent encore le dessin d'aster.js.
const { castaway, weed, fade, CANVAS } = require('../../atelier/naufrage');
const { lorena, C } = require('./lorena_refonte');
const { fondre } = require('../couleurs'); // le fondu néon des couleurs (le corps et les métaux gardent les leurs)

// Les palettes du dessus (ciré, vareuse, gilet) : coat, son ombre, son reflet
const PALETTES = fondre({
  signal: { nom: 'Jaune signal', coat: C.coat, coatS: C.coatS, coatH: C.coatH },
  rouille: { nom: 'Rouille', coat: '#C9673A', coatS: '#9A4626', coatH: '#F2A57A' },
  algue: { nom: 'Algue', coat: '#8C9A4A', coatS: '#66712F', coatH: '#C9D486' },
  quart: { nom: 'Bleu de quart', coat: '#3E5F86', coatS: '#2B4565', coatH: '#7FA3C9' },
  nuit: { nom: 'Laine de nuit', coat: '#2F4058', coatS: '#1F2C3E', coatH: '#5E7A9C' },
  toile: { nom: 'Toile brute', coat: '#9C8656', coatS: '#73603A', coatH: '#CDB98A' }
});

// Les tenues : la forme (lorena_refonte.js, torse), la palette par défaut, les manches
const TENUES = {
  cire: { nom: 'Le ciré', tenue: 'cire', palette: 'signal' },
  ouvert: { nom: 'Ciré ouvert, marinière', tenue: 'ouvert', palette: 'signal' },
  vareuse: { nom: 'La vareuse de quart', tenue: 'vareuse', palette: 'nuit' },
  chemise: { nom: 'Chemise et gilet', tenue: 'chemise', palette: 'toile', sleeve: C.shirt, cuff: C.shirtS }
};

// Les états, du plus propre au plus abîmé ; marks : les marques sur elle (lorena_refonte.js, MARKS)
const ETATS = {
  propre: { nom: 'Propre', quand: 'au village, des actes plus tard', marks: { hem: 'clean', salt: 0, dirt: 0, patch: false, rope: false, plaster: false, wrist: false } },
  poussiere: { nom: 'Un peu sale', quand: 'une journée de chantier', marks: { hem: 'clean', salt: 0.3, dirt: 0.75, patch: false, rope: true, plaster: false, wrist: false } },
  rafistolee: { nom: 'Rafistolée', quand: 'recousue au camp', marks: { hem: 'mended', salt: 0.3, dirt: 0.25, patch: true, rope: true, plaster: false, wrist: false } },
  rescapee: { nom: 'Rescapée', quand: 'les premiers jours', marks: { hem: 'torn', salt: 1, dirt: 0.5, patch: true, rope: true, plaster: true, wrist: true } },
  naufragee: { nom: 'Naufragée', quand: 'sortie de l\'eau', marks: { hem: 'torn', salt: 1, dirt: 0.3, patch: true, rope: true, plaster: true, wrist: false }, naufrage: true },
  trempee: { nom: 'Trempée', quand: 'sous l\'averse, au bord de l\'eau', marks: { hem: 'torn', salt: 0.4, dirt: 0.3, patch: true, rope: true, plaster: true, wrist: true, wet: true }, sombre: 0.82 }
};

// Une couleur assombrie (l'eau fonce le tissu et les cheveux)
function assombrir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function habiller(tenueId = 'cire', paletteId = null, etatId = 'rescapee') {
  const T = TENUES[tenueId], E = ETATS[etatId];
  if (!T) throw new Error(`tenue inconnue : ${tenueId}`);
  if (!E) throw new Error(`état inconnu : ${etatId}`);
  const pp = PALETTES[paletteId || T.palette];
  if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
  let pal = { ...pp };
  delete pal.nom;
  let base = { leg: lorena.leg, legS: lorena.legS, hair: C.hair, hairS: C.hairS };
  if (E.sombre) {
    pal = Object.fromEntries(Object.entries(pal).map(([k, v]) => [k, assombrir(v, E.sombre)]));
    for (const k of ['hair', 'hairS', 'hairH', 'scarf', 'scarfS', 'shirt', 'shirtS']) pal[k] = assombrir(C[k], E.sombre);
    base = { leg: assombrir(lorena.leg, E.sombre), legS: assombrir(lorena.legS, E.sombre) };
  }
  const K = { ...C, ...pal };
  const c = {
    ...lorena,
    uid: `lo${tenueId.slice(0, 2)}${(paletteId || T.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
    tenue: T.tenue, pal, marks: E.marks,
    sleeve: T.sleeve ? (E.sombre ? assombrir(T.sleeve, E.sombre) : T.sleeve) : K.coat,
    cuff: T.cuff ? (E.sombre ? assombrir(T.cuff, E.sombre) : T.cuff) : null,
    leg: base.leg, legS: base.legS,
    teintes: [K.hair, K.coat, K.scarf, K.brass, K.rope, K.shirt]
  };
  if (!E.naufrage) return c;
  // la naufragée : les couleurs de la tenue délavées par la mer (la même formule que les autres naufragés), pour le
  // dessin de Lorena (buste, manches, foulard, capuche) ; la transformation commune délave le reste (jambes)
  const salee = Object.fromEntries(Object.entries(K).filter(([k]) => /^(coat|coatS|coatH|shirt|shirtS|scarf|scarfS|stripe)$/.test(k)).map(([k, v]) => [k, fade(v, 0.6)]));
  c.pal = { ...pal, ...salee };
  c.sleeve = T.sleeve ? fade(T.sleeve, 0.6) : salee.coat;
  c.teintes = [K.hair, salee.coat, salee.scarf, K.brass, K.rope, salee.shirt];
  // naufragée : la transformation commune (couleurs délavées, pantalon retroussé et pieds nus, manches arrachées, la voile
  // de son bateau nouée sur les épaules, bande rouge et œillet), une algue dans les cheveux ; la terre sur la joue vient de
  // l'état (marks.dirt)
  return castaway(c, {
    fade: [c.leg, c.legS], k: 0.6,
    skinS: C.skinS, leg: 'roll', sleeves: 'torn', bandage: 'right',
    cape: CANVAS,
    capeExtra: view => `<rect x="0" y="${view === 'ne' ? 39.2 : 38.6}" width="48" height="1.15" fill="#C8463A" opacity="0.9"/>`
      + `<circle cx="${view === 'ne' ? 30.4 : view === 'se' ? 15.2 : 16.4}" cy="${view === 'ne' ? 36.6 : 36.4}" r="0.75" fill="none" stroke="#B08A3A" stroke-width="0.55"/>`,
    head: () => weed('M18.4,7.4 Q12.8,8.2 11.8,13.2 Q11,17.4 12.4,20.4', [[11.6, 13.4, 30]])
  });
}

module.exports = { habiller, TENUES, PALETTES, ETATS };
