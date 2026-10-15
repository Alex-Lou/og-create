// Robby (anciennement Galet, Saturnin dans HISTOIRE.md ; fichiers du jeu : galet) : ses tenues, ses palettes et ses
// états. habiller(tenue, palette, etat) rend Robby prêt à passer à troupe.frame, comme pour Lorena, Agathe et Nathan :
//   frame(habiller('carrier', 'lichen', 'poussiere'), 'front', 'repos', 0, 'veille')
// Les trois réglages se combinent librement ; chacun a sa valeur par défaut (blouse, la palette de la tenue, ermite).
// Robby est un ancien naufragé (des années seul dans la fissure de La Colline) : son état d'arrivée est l'ermite. Le
// naufragé passe par la transformation commune de l'atelier (naufrage.js), avec le poncho de toile de voile du jeu
// (naufrages.js, SPECS.Galet) : délavé, le pantalon retroussé, un pied nu ; le poncho et le pied nu passent de l'autre
// côté quand le jeu retourne l'image. Naufragé, il a oublié son don (HISTOIRE.md, § 6.2) : la rune ne s'allume pas.
const { castaway, fade } = require('../../atelier/naufrage');
const { SPECS } = require('../../atelier/naufrages');
const { robby, C } = require('./robby_refonte');

// Les palettes du bonnet : wool, son ombre, son reflet (on le reconnaît à son bonnet)
const PALETTES = {
  rouille: { nom: 'Rouille', wool: C.wool, woolS: C.woolS, woolH: C.woolH },
  moutarde: { nom: 'Moutarde', wool: '#B88A2E', woolS: '#8C661E', woolH: '#DAB05A' },
  chauffe: { nom: 'Bleu de chauffe', wool: '#3E5F86', woolS: '#2B4565', woolH: '#6E8EB4' },
  lichen: { nom: 'Lichen', wool: '#7A8A4A', woolS: '#5A6834', woolH: '#A2B270' },
  ardoise: { nom: 'Ardoise', wool: '#5E646C', woolS: '#43484E', woolH: '#868C94' },
  bordeaux: { nom: 'Bordeaux', wool: '#8A3A3A', woolS: '#682828', woolH: '#B0605A' }
};

// Les tenues : la forme (robby_refonte.js, corps), la palette par défaut, les manches (le carrier les retrousse)
const TENUES = {
  blouse: { nom: 'La blouse de tailleur', tenue: 'blouse', palette: 'rouille', sleeves: null },
  carrier: { nom: 'Le tablier de carrier', tenue: 'carrier', palette: 'moutarde', sleeves: 'roll' },
  pelisse: { nom: 'La pelisse de la Lande', tenue: 'pelisse', palette: 'ardoise', sleeves: null }
};

// Les états, du plus propre au plus abîmé ; marks : les marques sur lui (robby_refonte.js, MARKS)
const ETATS = {
  propre: { nom: 'Propre', quand: 'au village, des actes plus tard', marks: { dust: 0, moss: 0, salt: 0, dirt: 0, bonnet: 'reprise', patch: false } },
  poussiere: { nom: 'Un peu sale', quand: 'une journée à la Carrière', marks: { dust: 1, moss: 0, salt: 0, dirt: 0.4, bonnet: 'reprise', patch: false } },
  rafistole: { nom: 'Rafistolé', quand: 'recousu au camp', marks: { dust: 0.5, moss: 0.2, salt: 0.1, dirt: 0.2, bonnet: 'reprise', patch: true } },
  ermite: { nom: 'L\'ermite de la fissure', quand: 'à son arrivée : des années seul', marks: { dust: 1, moss: 0.8, salt: 0.3, dirt: 0.5, bonnet: 'troue', patch: true } },
  naufrage: { nom: 'Naufragé', quand: 'le naufrage de son caboteur, il y a longtemps', marks: { dust: 0.4, moss: 0.6, salt: 1, dirt: 0.3, bonnet: 'troue', patch: true }, naufrage: true },
  trempe: { nom: 'Trempé', quand: 'l\'orage sur La Colline', marks: { dust: 0.3, moss: 0.6, salt: 0.2, dirt: 0.5, bonnet: 'troue', patch: true, wet: true }, sombre: 0.82 }
};

// Une couleur assombrie (l'eau fonce le tissu, la laine et la barbe)
function assombrir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const MOUILLE = ['wool', 'woolS', 'woolH', 'smock', 'smockS', 'smockH', 'apron', 'apronS', 'apronH', 'coat', 'coatS', 'coatH', 'fleece', 'fleeceS', 'beard', 'beardS', 'beardH', 'white', 'whiteS', 'hairB', 'brow'];

// Les lambeaux du naufragé, retournés pour les directions que le jeu retourne (autour du milieu, 24)
const retourner = parVue => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map(([x, ...r]) => [Math.round((48 - x) * 100) / 100, ...r])]));
// Le poncho, retourné de même autour de son milieu (de trois quarts, il glisse vers la gauche : 22,4)
const ponchoMiroir = capeFn => (cc, ctx) => {
  const s = capeFn(cc, ctx), axe = ctx.view === 'se' ? 22.4 : 24;
  return cc.miroir ? `<g transform="translate(${2 * axe} 0) scale(-1 1)">${s}</g>` : s;
};

function habiller(tenueId = 'blouse', paletteId = null, etatId = 'ermite') {
  const T = TENUES[tenueId], E = ETATS[etatId];
  if (!T) throw new Error(`tenue inconnue : ${tenueId}`);
  if (!E) throw new Error(`état inconnu : ${etatId}`);
  const pp = PALETTES[paletteId || T.palette];
  if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
  let pal = { ...pp };
  delete pal.nom;
  if (E.sombre) pal = Object.fromEntries(MOUILLE.map(k => [k, assombrir(pal[k] || C[k], E.sombre)]));
  const K = { ...C, ...pal };
  const veste = T.tenue === 'pelisse';
  const c = {
    ...robby,
    uid: `rb${tenueId.slice(0, 2)}${(paletteId || T.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
    tenue: T.tenue, pal, marks: E.marks, sleeves: T.sleeves,
    sleeve: veste ? K.coat : K.smock,
    leg: E.sombre ? assombrir(robby.leg, E.sombre) : robby.leg, legS: E.sombre ? assombrir(robby.legS, E.sombre) : robby.legS,
    teintes: [K.wool, K.beard, K.smock, K.white]
  };
  if (!E.naufrage) return c;
  // le naufragé : la blouse, le bonnet et le pantalon délavés par la mer (la même formule que les autres naufragés) ; le
  // poncho de toile de voile noué d'une corde ; il a oublié son don
  const delave = ['wool', 'woolS', 'woolH', 'smock', 'smockS', 'smockH', 'coat', 'coatS', 'coatH', 'apron', 'apronS', 'apronH'];
  const salee = Object.fromEntries(delave.map(k => [k, fade(K[k], 0.6)]));
  c.pal = { ...pal, ...salee };
  c.sleeve = veste ? salee.coat : salee.smock;
  c.leg = fade(robby.leg, 0.6); c.legS = fade(robby.legS, 0.6);
  c.teintes = [salee.wool, K.beard, salee.smock, K.white];
  c.sansDon = true;
  const S = SPECS.Galet;
  const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, col === '#6E6458' ? salee.smock : salee.smockS, ...r])]));
  const spec = { ...S, fade: [], map: {}, k: 0.6, tatters, capeFn: ponchoMiroir(S.capeFn), head: undefined };
  const droite = castaway(c, spec);
  const gauche = castaway(c, { ...spec, tatters: retourner(spec.tatters), bareSide: S.bareSide === 'right' ? 'left' : 'right' });
  // le jeu retourne l'image pour les directions de gauche : les lambeaux et le pied nu passent de l'autre côté avant
  return { ...droite, body: (cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx), foot: (cc, ...a) => (cc.miroir ? gauche : droite).foot(cc, ...a) };
}

module.exports = { habiller, TENUES, PALETTES, ETATS };
