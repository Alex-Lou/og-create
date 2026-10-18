// Nathan (anciennement Rivet, Jovin dans HISTOIRE.md ; fichiers du jeu : rivet) : ses tenues, ses palettes et ses états,
// du naufrage au propre. habiller(tenue, palette, etat) rend Nathan prêt à passer à troupe.frame, comme pour Lorena et
// Agathe :
//   frame(habiller('gilet', 'bordeaux', 'poussiere'), 'front', 'repos', 0, 'veille')
// Les trois réglages se combinent librement ; chacun a sa valeur par défaut (atelier, la palette de la tenue, rescape).
// Le naufragé passe par la transformation commune de l'atelier (naufrage.js), dans l'esprit de celui du jeu
// (naufrages.js, SPECS.Rivet) : couleurs délavées, pantalon retroussé et pieds nus, manches arrachées, un bandage sur
// l'avant-bras gauche (sur la vieille brûlure), lambeaux ; ses lambeaux passent de l'autre côté quand le jeu retourne
// l'image.
const { castaway, fade } = require('../../atelier/naufrage');
const { SPECS } = require('../../atelier/naufrages');
const { nathan, C } = require('./nathan_refonte');
const { fondre, fondu } = require('../couleurs'); // le fondu néon des couleurs (le corps et les métaux gardent les leurs)

// Les palettes de la chemise : shirt, son ombre, son reflet
const PALETTES = fondre({
  sarcelle: { nom: 'Sarcelle', shirt: C.shirt, shirtS: C.shirtS, shirtH: C.shirtH },
  bordeaux: { nom: 'Bordeaux', shirt: '#8A3A3A', shirtS: '#682828', shirtH: '#B0605A' },
  moutarde: { nom: 'Moutarde', shirt: '#B38A2E', shirtS: '#87661E', shirtH: '#D8B25A' },
  indigo: { nom: 'Indigo', shirt: '#3E5578', shirtS: '#2B3D59', shirtH: '#6E86AA' },
  ardoise: { nom: 'Ardoise', shirt: '#5E6B78', shirtS: '#434E5A', shirtH: '#8794A2' },
  bouteille: { nom: 'Vert bouteille', shirt: '#3E6E4A', shirtS: '#2B5134', shirtH: '#6A9A74' }
});

// Les tenues : la forme (nathan_refonte.js, corps), la palette par défaut ; à la forge, les gants
const TENUES = {
  atelier: { nom: 'L\'atelier : chemise et tablier de cuir', tenue: 'atelier', palette: 'sarcelle' },
  gilet: { nom: 'Le gilet d\'horloger', tenue: 'gilet', palette: 'sarcelle' },
  forge: { nom: 'La forge : grand tablier et gants', tenue: 'forge', palette: 'ardoise', gants: true }
};

// Les états, du plus propre au plus abîmé ; marks : les marques sur lui (nathan_refonte.js, MARKS)
const ETATS = {
  propre: { nom: 'Propre', quand: 'au Faubourg, des actes plus tard', marks: { grease: 0, soot: 0, salt: 0, dust: 0, dirt: 0, crack: false, pocket: 'clean', patch: false } },
  poussiere: { nom: 'Un peu sale', quand: 'une journée à l\'établi', marks: { grease: 0.8, soot: 0.3, salt: 0, dust: 1, dirt: 0.3, crack: false, pocket: 'clean', patch: false } },
  rafistole: { nom: 'Rafistolé', quand: 'recousu au camp ; la loupe reste fêlée', marks: { grease: 0.4, soot: 0.2, salt: 0.3, dust: 0.3, dirt: 0.2, crack: true, pocket: 'mended', patch: true } },
  rescape: { nom: 'Rescapé', quand: 'les premiers jours', marks: { grease: 1, soot: 0.5, salt: 1, dust: 0, dirt: 0.4, crack: true, pocket: 'torn', patch: false } },
  naufrage: { nom: 'Naufragé', quand: 'sous sa voile, à trier ses vis', marks: { grease: 0.6, soot: 0.3, salt: 1, dust: 0, dirt: 0.3, crack: true, pocket: 'torn', patch: false }, naufrage: true },
  trempe: { nom: 'Trempé', quand: 'sous l\'averse, au bord de l\'eau', marks: { grease: 0.5, soot: 0.2, salt: 0.4, dust: 0, dirt: 0.4, crack: true, pocket: 'torn', patch: false, wet: true }, sombre: 0.82 }
};

// Une couleur assombrie (l'eau fonce le tissu et les cheveux)
function assombrir(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// (les tissus, le cuir et les cheveux que l'eau fonce ; la peau, le laiton et l'acier gardent leur teinte)
const MOUILLE = ['shirt', 'shirtS', 'shirtH', 'collar', 'collarS', 'leather', 'leatherS', 'leatherH', 'forge', 'forgeS', 'forgeH', 'vest', 'vestS', 'vestH', 'lining', 'hair', 'hairS', 'hairH', 'grey', 'greyS', 'greyH', 'glove', 'gloveS'];

// Les lambeaux du naufragé, retournés pour les directions que le jeu retourne : ceux de la chemise autour du milieu (24),
// ceux du tablier autour du milieu du tablier (de trois quarts, il glisse vers la gauche : 22,2)
const AXE_TABLIER = { front: 24, se: 22.2, ne: 24 };
const retourner = (parVue, tablier) => Object.fromEntries(Object.entries(parVue).map(([v, l]) => [v, l.map(it => {
  const axe = tablier(it, v) ? AXE_TABLIER[v] : 24;
  return [Math.round((2 * axe - it[0]) * 100) / 100, ...it.slice(1)];
})]));

function habiller(tenueId = 'atelier', paletteId = null, etatId = 'rescape') {
  const T = TENUES[tenueId], E = ETATS[etatId];
  if (!T) throw new Error(`tenue inconnue : ${tenueId}`);
  if (!E) throw new Error(`état inconnu : ${etatId}`);
  const pp = PALETTES[paletteId || T.palette];
  if (!pp) throw new Error(`palette inconnue : ${paletteId}`);
  let pal = { ...pp };
  delete pal.nom;
  if (E.sombre) pal = Object.fromEntries(MOUILLE.map(k => [k, assombrir(pal[k] || C[k], E.sombre)]));
  const K = { ...C, ...pal };
  const c = {
    ...nathan,
    uid: `na${tenueId.slice(0, 2)}${(paletteId || T.palette).slice(0, 2)}${etatId.slice(0, 2)}`,
    tenue: T.tenue, pal, marks: E.marks, gants: !!T.gants,
    sleeve: K.shirt,
    leg: E.sombre ? assombrir(nathan.leg, E.sombre) : nathan.leg, legS: E.sombre ? assombrir(nathan.legS, E.sombre) : nathan.legS,
    teintes: [K.hair, K.shirt, K.leather, K.grey]
  };
  if (!E.naufrage) return c;
  // le naufragé : la chemise, le gilet et le pantalon délavés par la mer (la même formule que les autres naufragés), le
  // cuir un peu passé ; la loupe fêlée, la poche décousue et le cambouis viennent de l'état
  const delave = ['shirt', 'shirtS', 'shirtH', 'collar', 'collarS', 'vest', 'vestS', 'vestH'];
  const passe = ['leather', 'leatherS', 'leatherH', 'forge', 'forgeS', 'forgeH'];
  const salee = { ...Object.fromEntries(delave.map(k => [k, fade(K[k], 0.6)])), ...Object.fromEntries(passe.map(k => [k, fade(K[k], 0.3)])) };
  c.pal = { ...pal, ...salee };
  c.sleeve = salee.shirt;
  c.leg = fade(nathan.leg, 0.6); c.legS = fade(nathan.legS, 0.6);
  c.teintes = [K.hair, salee.shirt, salee.leather, K.grey];
  const S = SPECS.Rivet;
  // (les lambeaux de la chemise et du tablier dans ses couleurs à lui, déjà délavées : la transformation ne les recolore
  // pas ; le tablier se reconnaît à sa couleur de cuir)
  const recol = col => (col === fondu('#6B4328') ? salee.leatherS : col === fondu('#3F8A86') ? salee.shirt : salee.shirtS);
  const tatters = Object.fromEntries(Object.entries(S.tatters).map(([v, l]) => [v, l.map(([x, y, col, ...r]) => [x, y, recol(col), ...r])]));
  const holes = Object.fromEntries(Object.entries(S.holes).map(([v, l]) => [v, l.map(([x, y, w]) => [x, y, w, assombrir(salee.shirtS, 0.8)])]));
  const spec = { ...S, fade: [], map: {}, k: 0.6, tatters, holes, sleeves: 'torn', bandage: 'left', over: undefined, head: undefined };
  const droite = castaway(c, spec);
  const gauche = castaway(c, {
    ...spec,
    tatters: retourner(spec.tatters, it => it[2] === salee.leatherS),
    holes: retourner(spec.holes, () => false),
    rips: retourner(spec.rips, (it, v) => v !== 'ne')
  });
  // le jeu retourne l'image pour les directions de gauche : les lambeaux passent de l'autre côté avant, comme ses marques
  return { ...droite, body: (cc, ctx) => (cc.miroir ? gauche : droite).body(cc, ctx) };
}

module.exports = { habiller, TENUES, PALETTES, ETATS };
