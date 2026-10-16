// Agathe (anciennement Marcelle ; fichiers du jeu : cannelle) : ses tenues, ses palettes et ses états, du naufrage au propre.
// habiller(tenue, palette, etat) rend Agathe prête à passer à troupe.frame, comme pour Lorena (lorena_tenues.js) :
//   frame(habiller('cuisine', 'prune', 'poussiere'), 'front', 'repos', 0, 'veille')
// Les trois réglages se combinent librement ; chacun a sa valeur par défaut (robe, la palette de la tenue, rescapee).
// La naufragée passe par la transformation commune de l'atelier (naufrage.js), avec la couverture rayée des naufragés
// (naufrages.js, SPECS.Cannelle), ses lambeaux passés de l'autre côté quand le jeu retourne l'image.
const { castaway, fade } = require('../../atelier/naufrage');
const { SPECS } = require('../../atelier/naufrages');
const { agathe, C } = require('./agathe_refonte');
const { r2 } = require('../troupe');

// Les palettes de la robe : dress, son ombre, son reflet
const PALETTES = {
  cannelle: { nom: 'Cannelle', dress: C.dress, dressS: C.dressS, dressH: C.dressH },
  prune: { nom: 'Prune', dress: '#7E4A62', dressS: '#5E3348', dressH: '#A26F87' },
  olive: { nom: 'Olive', dress: '#7D7A3E', dressS: '#5C5A2A', dressH: '#A6A262' },
  indigo: { nom: 'Indigo', dress: '#3F5578', dressS: '#2C3D59', dressH: '#6F86AA' },
  ocre: { nom: 'Ocre', dress: '#B8853A', dressS: '#8C6226', dressH: '#DCAA60' },
  brique: { nom: 'Brique', dress: '#9C3E34', dressS: '#742A23', dressH: '#C2625A' }
};

// Les tenues : la forme (agathe_refonte.js, corps), la palette par défaut, les manches
const TENUES = {
  robe: { nom: 'La robe et son tablier', tenue: 'robe', palette: 'cannelle', sleeves: 'roll' },
  cuisine: { nom: 'Le grand tablier de cuisine', tenue: 'cuisine', palette: 'cannelle', sleeves: 'roll' },
  // le gilet de laine : manches longues jusqu'au poignet (lorena_bras.js : le poignet et son bouton)
  laine: { nom: 'Le gilet de laine', tenue: 'laine', palette: 'cannelle', sleeves: null }
};

// Les états, du plus propre au plus abîmé ; marks : les marques sur elle (agathe_refonte.js, MARKS)
const ETATS = {
  propre: { nom: 'Propre', quand: 'au village, des actes plus tard', marks: { soot: 0, salt: 0, flour: 0, dirt: 0, apron: 'clean', wisps: false, herbs: true } },
  poussiere: { nom: 'Un peu sale', quand: 'une journée en cuisine', marks: { soot: 0.6, salt: 0, flour: 1, dirt: 0.3, apron: 'clean', wisps: true, herbs: true } },
  rafistolee: { nom: 'Rafistolée', quand: 'recousue au camp', marks: { soot: 0.3, salt: 0.3, flour: 0, dirt: 0.25, apron: 'mended', wisps: true, herbs: true } },
  rescapee: { nom: 'Rescapée', quand: 'les premiers jours', marks: { soot: 1, salt: 1, flour: 0, dirt: 0.5, apron: 'torn', wisps: true, herbs: true } },
  naufragee: { nom: 'Naufragée', quand: 'sur les rochers, deux nuits à regarder le feu', marks: { soot: 0.5, salt: 1, flour: 0, dirt: 0.3, apron: 'torn', wisps: true, herbs: false }, naufrage: true },
  trempee: { nom: 'Trempée', quand: 'sous l\'averse, au bord de l\'eau', marks: { soot: 0.3, salt: 0.4, flour: 0, dirt: 0.4, apron: 'torn', wisps: true, herbs: true, wet: true }, sombre: 0.82 }
};

// Une couleur assombrie (l'eau fonce le tissu et les cheveux)
function assombrir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// (les tissus et les cheveux que l'eau fonce ; la peau, le cuivre et le cuir gardent leur teinte)
const MOUILLE = ['dress', 'dressS', 'dressH', 'apron', 'apronS', 'wool', 'woolS', 'woolH', 'hair', 'hairS', 'hairH', 'towel', 'stain'];

// Les lambeaux de la naufragée, retournés pour les directions que le jeu retourne : ceux de la robe autour du milieu (24),
// ceux du tablier autour du milieu du tablier (de trois quarts, il glisse vers la gauche : 22)
const AXE_TABLIER = { front: 24, se: 22, ne: 24 };
const retourner = (parVue, tablier) => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map(it => {
  const axe = tablier(it) ? AXE_TABLIER[v] : 24;
  return [Math.round((2 * axe - it[0]) * 100) / 100, ...it.slice(1)];
})]));

function habiller(tenueId = 'robe', paletteId = null, etatId = 'rescapee') {
  const T = TENUES[tenueId], E = ETATS[etatId];
  if (!T) throw new Error(`tenue inconnue : ${tenueId}`);
  if (!E) throw new Error(`état inconnu : ${etatId}`);
  const pp = PALETTES[paletteId || T.palette];
  if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
  let pal = { ...pp };
  delete pal.nom;
  if (E.sombre) pal = Object.fromEntries(MOUILLE.map(k => [k, assombrir(pal[k] || C[k], E.sombre)]));
  const K = { ...C, ...pal };
  const laine = T.tenue === 'laine';
  const c = {
    ...agathe,
    uid: `ag${tenueId.slice(0, 2)}${(paletteId || T.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
    tenue: T.tenue, pal, marks: E.marks, sleeves: T.sleeves,
    sleeve: laine ? K.wool : K.dress,
    teintes: [K.hair, K.dress, K.apron, K.copper]
  };
  if (!E.naufrage) return c;
  // la naufragée : la robe, le tablier (et le gilet) délavés par la mer, la même formule que les autres naufragés ; jambes
  // et pieds nus, la couverture rayée nouée sur les épaules (SPECS.Cannelle) ; ses mèches et la suie viennent de l'état
  const teintes = ['dress', 'dressS', 'dressH', 'apron', 'apronS', 'wool', 'woolS', 'woolH'];
  const salee = Object.fromEntries(teintes.map(k => [k, fade(K[k], 0.6)]));
  c.pal = { ...pal, ...salee };
  c.sleeve = laine ? salee.wool : salee.dress;
  c.teintes = [K.hair, salee.dress, salee.apron, K.copper];
  const S = SPECS.Cannelle, dS = salee.dressS;
  // (les lambeaux de la robe et du tablier dans ses couleurs à elle, déjà délavées : la transformation ne les recolore pas)
  const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, col === '#84402B' ? dS : salee.apron, ...r])]));
  const spec = { ...S, sway: ctx => (ctx.walk ? r2(ctx.ph * 0.25) : 0), fade: [], k: 0.6, tatters, holes: Object.fromEntries(Object.entries(S.holes).map(([v, l]) => [v, l.map(([x, y, w]) => [x, y, w, assombrir(dS, 0.8)])])), head: undefined };
  const droite = castaway(c, spec);
  const gauche = castaway(c, { ...spec, tatters: retourner(spec.tatters, it => it[2] === salee.apron), holes: retourner(spec.holes, () => false), rips: retourner(spec.rips, () => true) });
  // le jeu retourne l'image pour les directions de gauche : les lambeaux passent de l'autre côté avant, comme ses marques
  // (les jambes nues : un ton de peau à peine décalé, pour que le visage garde sa lumière à lui ; la même teinte, il
  // prendrait le champ de lumière des habits, plat et pâle)
  return { ...droite, leg: '#E8B88E', body: (cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx) };
}

module.exports = { habiller, TENUES, PALETTES, ETATS };
