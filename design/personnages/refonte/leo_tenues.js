// Léo (anciennement Ondin ; fichiers du jeu : ondin) : ses tenues, ses palettes et ses états. habiller(tenue, palette,
// etat) rend Léo prêt à passer à troupe.frame, comme pour Lorena, Agathe, Nathan et Robby :
//   frame(habiller('pyjama', 'ciel', 'propre'), 'front', 'repos', 0, 'veille')
// Les trois réglages se combinent librement ; chacun a sa valeur par défaut (le ciré, la palette de la tenue, rescapé).
// Son arrivée (HISTOIRE.md, choix de l'auteur, 14 oct.) : une vague pose sa planche sur le sable, il dort dessus ; son
// état d'arrivée est le rescapé (le sel, le sable, l'algue dans les boucles). Le naufragé passe par la transformation
// commune de l'atelier (naufrage.js), avec le ciré effrangé et l'étoile de mer du jeu (naufrages.js, SPECS.Ondin) :
// délavé, le pompon arraché qui pend au bout d'un fil ; les lambeaux passent de l'autre côté quand le jeu retourne
// l'image. Bulle n'est dans son bocal que des actes plus tard (quand on écrit le Poisson : l'état propre).
const { castaway, fade } = require('../../atelier/naufrage');
const { SPECS } = require('../../atelier/naufrages');
const { leo, C } = require('./leo_refonte');

// Les palettes du vêtement (on le reconnaît à son ciré) : la couleur, son ombre, son reflet
const PALETTES = {
  bleu: { nom: 'Bleu ciré', m: C.coat, mS: C.coatS, mH: C.coatH },
  jaune: { nom: 'Jaune ciré', m: '#E8B83A', mS: '#C0902A', mH: '#F6D77A' },
  vert: { nom: 'Vert d\'eau', m: '#4FA58E', mS: '#3A806E', mH: '#86C9B6' },
  corail: { nom: 'Corail', m: '#E0705A', mS: '#B85444', mH: '#F2A08C' },
  ciel: { nom: 'Bleu ciel', m: C.pyj, mS: C.pyjS, mH: '#C8DDF2' },
  cannelle: { nom: 'Cannelle', m: C.knit, mS: C.knitS, mH: C.knitH }
};

// Les tenues : la forme (leo_refonte.js, corps), la palette par défaut, les manches (le ciré les retrousse : trop
// longues pour lui) ; les jambes (nues sous le ciré et le pull, le pantalon du pyjama)
const TENUES = {
  cire: { nom: 'Le ciré trop grand', tenue: 'cire', palette: 'bleu', sleeves: 'roll', cles: ['coat', 'coatS', 'coatH'] },
  pyjama: { nom: 'Le pyjama rayé', tenue: 'pyjama', palette: 'ciel', sleeves: null, cles: ['pyj', 'pyjS', null], jambes: true },
  tricot: { nom: 'Le pull de Tatie', tenue: 'tricot', palette: 'cannelle', sleeves: null, cles: ['knit', 'knitS', 'knitH'] }
};

// Les états, du plus propre au plus abîmé ; marks : les marques sur lui (leo_refonte.js, MARKS)
const ETATS = {
  propre: { nom: 'Propre', quand: 'au village, des actes plus tard : Bulle est revenu', marks: { salt: 0, sand: 0, dirt: 0, weed: false, patch: false, bulle: true } },
  source: { nom: 'Un peu sale', quand: 'une journée à La Source', marks: { salt: 0, sand: 0.3, dirt: 0.8, weed: false, patch: false } },
  rafistole: { nom: 'Rafistolé', quand: 'recousu au camp', marks: { salt: 0.2, sand: 0.3, dirt: 0.2, weed: false, patch: true } },
  rescape: { nom: 'Rescapé', quand: 'à son arrivée : la vague l\'a posé sur sa planche, endormi', marks: { salt: 1, sand: 1, dirt: 0, weed: true, patch: false } },
  naufrage: { nom: 'Naufragé', quand: 'le naufrage de l\'Hirondelle', marks: { salt: 1, sand: 0.6, dirt: 0.2, weed: true, patch: false, pompon: 'arrache' }, naufrage: true },
  trempe: { nom: 'Trempé', quand: 'la pluie, ou un plongeon à La Source', marks: { salt: 0.2, sand: 0.2, dirt: 0.3, weed: false, patch: false, wet: true }, sombre: 0.82 }
};

// Une couleur assombrie (l'eau fonce le tissu et les boucles)
function assombrir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const MOUILLE = ['coat', 'coatS', 'coatH', 'pyj', 'pyjS', 'knit', 'knitS', 'knitH', 'cap', 'capS', 'cream', 'creamS', 'hair', 'hairS', 'hairH', 'rope', 'ropeS'];

// Les lambeaux du naufragé, retournés pour les directions que le jeu retourne (autour du milieu, 24)
const retourner = parVue => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map(([x, ...r]) => [Math.round((48 - x) * 100) / 100, ...r])]));
// l'étoile de mer, retournée de même autour du milieu (de trois quarts, il glisse vers la gauche : 22,4)
const miroirDe = fn => (cc, ctx) => {
  const s = fn(cc, ctx), axe = ctx.view === 'se' ? 22.4 : 24;
  return cc.miroir ? `<g transform="translate(${2 * axe} 0) scale(-1 1)">${s}</g>` : s;
};

function habiller(tenueId = 'cire', paletteId = null, etatId = 'rescape') {
  const T = TENUES[tenueId], E = ETATS[etatId];
  if (!T) throw new Error(`tenue inconnue : ${tenueId}`);
  if (!E) throw new Error(`état inconnu : ${etatId}`);
  const pp = PALETTES[paletteId || T.palette];
  if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
  const [km, kS, kH] = T.cles;
  let pal = { [km]: pp.m, [kS]: pp.mS, ...(kH ? { [kH]: pp.mH } : {}) };
  if (E.sombre) pal = Object.fromEntries(MOUILLE.map(k => [k, assombrir(pal[k] || C[k], E.sombre)]));
  const K = { ...C, ...pal };
  // le pyjama habille les jambes ; sous le ciré et le pull, elles sont nues
  const peau = E.sombre ? [assombrir(leo.leg, 0.94), assombrir(leo.legS, 0.94)] : [leo.leg, leo.legS];
  const [jambe, jambeS] = T.jambes ? [K.pyj, K.pyjS] : peau;
  const c = {
    ...leo,
    uid: `le${tenueId.slice(0, 2)}${(paletteId || T.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
    tenue: T.tenue, pal, marks: E.marks, sleeves: T.sleeves,
    sleeve: K[km], leg: jambe, legS: jambeS,
    teintes: [K.hair, K[km], K.cap, K.lining]
  };
  if (!E.naufrage) return c;
  // le naufragé : le vêtement, le bonnet et les boucles délavés par la mer (la même formule que les autres naufragés) ;
  // le ciré effrangé et percé, l'étoile de mer accrochée (SPECS.Ondin)
  const delave = ['coat', 'coatS', 'coatH', 'pyj', 'pyjS', 'knit', 'knitS', 'knitH', 'cap', 'capS', 'cream', 'creamS'];
  const salee = Object.fromEntries(delave.map(k => [k, fade(K[k], 0.6)]));
  c.pal = { ...pal, ...salee };
  c.sleeve = salee[km];
  if (T.jambes) { c.leg = salee.pyj; c.legS = salee.pyjS; }
  c.teintes = [K.hair, salee[km], salee.cap, K.lining];
  const S = SPECS.Ondin;
  const ton = col => (col === '#264E82' ? fade(K[kS], 0.5) : salee[kS]);
  const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, ton(col), ...r])]));
  const holes = Object.fromEntries(Object.entries(S.holes).map(([v, l]) => [v, l.map(([x, y, r, col]) => [x, y, r, ton(col)])]));
  // (sa tête est à lui : le pompon arraché, l'algue dans les boucles sont dessinés par leo_refonte.js)
  const spec = { ...S, fade: [], map: {}, k: 0.6, tatters, holes, over: miroirDe(S.over), head: undefined, headFix: undefined };
  const droite = castaway(c, spec);
  const gauche = castaway(c, { ...spec, tatters: retourner(spec.tatters), holes: retourner(spec.holes), rips: retourner(S.rips) });
  // le jeu retourne l'image pour les directions de gauche : les lambeaux passent de l'autre côté avant
  return { ...droite, body: (cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx), foot: (cc, ...a) => (cc.miroir ? gauche : droite).foot(cc, ...a) };
}

module.exports = { habiller, TENUES, PALETTES, ETATS };
