// Les listes des bêtes, en un seul endroit : les profils (preview_betes.js), les bêtes orientées (preview_betes3.mjs),
// les égarés (preview_egares.mjs). Le générateur des bêtes (generateur_betes.mjs) dessine les mêmes, avec les mêmes
// fonctions (betes.js, betes3.js, egares.js).
const Bt = require('./betes');
const G = require('./egares');

// ---- les profils ----
const WALK = ['marche1', 'marche2', 'repos', 'clignement', 'joie'];
const FLY = ['vol1', 'vol2', 'repos', 'joie'];

// [groupe, fichier, libellé, cadre, poses, dessin(pose)]
const q = (id, v) => { const c = Bt.Q[id](v); return [c.size, WALK, p => Bt.quad(c, p)]; };
const b = (id, v) => { const c = Bt.B[id](v); return [c.size, WALK, p => Bt.bird(c, p)]; };
const PROFILS = [
  ['ferme', 'poule_rousse', 'Poule rousse', ...b('hen', 'rousse')], ['ferme', 'poule_blanche', 'Poule blanche', ...b('hen', 'blanche')],
  ['ferme', 'poule_noire', 'Poule noire', ...b('hen', 'noire')], ['ferme', 'poule_grise', 'Poule grise', ...b('hen', 'grise')],
  ['ferme', 'poussin', 'Poussin', ...b('chick')],
  ['ferme', 'vache', 'Vache', ...q('cow')], ['ferme', 'vache_rousse', 'Vache rousse', ...q('cow', 'rousse')],
  ['ferme', 'mouton', 'Mouton', ...q('sheep')], ['ferme', 'mouton_noir', 'Mouton noir', ...q('sheep', 'noir')],
  ['ferme', 'cochon', 'Cochon', ...q('pig')], ['ferme', 'cochon_tachete', 'Cochon tacheté', ...q('pig', 'tachete')],
  ['ferme', 'chevre', 'Chèvre', ...q('goat')], ['ferme', 'chevre_brune', 'Chèvre brune', ...q('goat', 'brune')],
  ['ferme', 'chat', 'Chat', ...q('cat')], ['ferme', 'chien', 'Chien', ...q('dog')],
  ['bois', 'cerf', 'Cerf', ...q('deer')], ['bois', 'renard', 'Renard', ...q('fox')], ['bois', 'lapin', 'Lapin', ...q('rabbit')],
  ['bois', 'herisson', 'Hérisson', ...q('hedgehog')], ['bois', 'ecureuil', 'Écureuil', ...q('squirrel')], ['bois', 'loutre', 'Loutre', ...q('otter')],
  ['eau', 'heron', 'Héron', ...b('heron')],
  ...['orange', 'blanc', 'or'].map(v => ['eau', `koi_${v}`, `Koï ${v}`, 'KOI', ['nage1', 'nage2', 'joie'], p => Bt.koi(v, p)]),
  ['climat', 'renard_polaire', 'Renard polaire (cimes)', ...q('snowFox')], ['climat', 'bouquetin', 'Bouquetin (cimes)', ...q('ibex')],
  ['climat', 'macareux', 'Macareux (landes)', ...b('puffin')], ['climat', 'poney', 'Poney (landes)', ...q('pony')],
  ['climat', 'grenouille', 'Grenouille (marais)', ...q('frog')], ['climat', 'tortue', 'Tortue (marais)', ...q('tortoise')],
  ['climat', 'fennec', 'Fennec (dunes)', ...q('fennec')], ['climat', 'chameau', 'Chameau (dunes)', ...q('camel')],
  ['climat', 'cameleon', 'Caméléon (jungle)', ...q('chameleon')], ['climat', 'toucan', 'Toucan (jungle)', ...b('toucan')],
  ['climat', 'salamandre', 'Salamandre (volcan)', ...q('salamander')], ['climat', 'corbeau', 'Corbeau (volcan)', ...b('crow')],
  ['bestiaire', 'mesange', 'Mésange', ...b('bird')],
  ...['jaune', 'bleu', 'lune'].map(v => ['bestiaire', `papillon_${v}`, `Papillon ${v}`, 'BUTTERFLY', FLY, p => Bt.butterfly(v, p)]),
  ['bestiaire', 'luciole', 'Luciole', 'FIREFLY', ['vol1', 'vol2', 'joie'], p => Bt.firefly(p)],
  ['bestiaire', 'abeille', 'Abeille', 'BEE', FLY, p => Bt.bee(p)],
  ['bestiaire', 'hibou', 'Hibou (de face)', 'OWL', WALK, p => Bt.owl(p)],
  ['bestiaire', 'meduse', 'Méduse', 'JELLY', ['0', '1'], p => Bt.jelly(+p)],
  ['familiers', 'tictac', 'Tic-Tac (abeille mécanique de Rivet)', 'TICTAC', FLY, p => Bt.bee(p, true)],
  ['familiers', 'amie_tictac', 'L\'amie de Tic-Tac (Rivet la fabrique quand on écrit Abeille)', 'TICTAC', FLY, p => Bt.beeFriend(p)],
  ['familiers', 'mousse', 'Mousse (renardeau de Sylve)', ...q('kit')],
  ['familiers', 'bocal_vide', 'Bocal d\'Ondin (vide)', 'BOWL', ['0'], () => Bt.bowl('vide', 0)],
  ['familiers', 'bocal_bulle', 'Bocal d\'Ondin (Bulle revenu)', 'BOWL', ['0', '1'], p => Bt.bowl('bulle', +p)],
  ['mer', 'dauphin', 'Dauphin', 'DOLPHIN', ['0', '1', '2'], p => Bt.dolphin(+p)],
  ['mer', 'baleine_dos', 'Baleine (dos qui souffle)', 'WHALE_BACK', ['0', '1'], p => Bt.whaleBack(+p)],
  ['mer', 'baleine_queue', 'Baleine (queue)', 'WHALE_FLUKE', ['0', '1'], p => Bt.whaleFluke(+p)],
  ...['sardine', 'dorade', 'volant'].map(v => ['mer', `poisson_${v}`, `Poisson ${v === 'volant' ? 'volant' : v}`, 'FISH', ['0', '1'], p => Bt.fish(v, +p)]),
  ['mer', 'mouette', 'Mouette', ...b('gull')],
  ['mer', 'mouette_vol', 'Mouette en vol (envol, vol, plané)', 'GULL_FLY', ['envol1', 'envol2', 'envol3', 'vol1', 'vol2', 'vol3', 'vol4', 'plane'], p => Bt.gullFly(p)]
];

// ---- les bêtes orientées (trois quarts avant et dos) ----
const AVANT = ['marche1', 'marche2', 'repos', 'clignement', 'joie'];
const DOS = ['marche1', 'marche2', 'repos'];
const q3 = (id, v) => ({ c: Bt.Q[id](v), bird: false });
const b3 = (id, v) => ({ c: Bt.B[id](v), bird: true });
// [groupe, dossier, libellé, bête] : les marcheurs du lot B
const ORIENTEES = [
  ['ferme', 'poule_rousse', 'Poule rousse', b3('hen', 'rousse')], ['ferme', 'poule_blanche', 'Poule blanche', b3('hen', 'blanche')],
  ['ferme', 'poule_noire', 'Poule noire', b3('hen', 'noire')], ['ferme', 'poule_grise', 'Poule grise', b3('hen', 'grise')],
  ['ferme', 'poussin', 'Poussin', b3('chick')],
  ['ferme', 'vache', 'Vache', q3('cow')], ['ferme', 'vache_rousse', 'Vache rousse', q3('cow', 'rousse')],
  ['ferme', 'mouton', 'Mouton', q3('sheep')], ['ferme', 'mouton_noir', 'Mouton noir', q3('sheep', 'noir')],
  ['ferme', 'cochon', 'Cochon', q3('pig')], ['ferme', 'cochon_tachete', 'Cochon tacheté', q3('pig', 'tachete')],
  ['ferme', 'chevre', 'Chèvre', q3('goat')], ['ferme', 'chevre_brune', 'Chèvre brune', q3('goat', 'brune')],
  ['ferme', 'chat', 'Chat', q3('cat')], ['ferme', 'chien', 'Chien', q3('dog')],
  ['bois', 'cerf', 'Cerf', q3('deer')], ['bois', 'renard', 'Renard', q3('fox')], ['bois', 'lapin', 'Lapin', q3('rabbit')],
  ['bois', 'herisson', 'Hérisson', q3('hedgehog')], ['bois', 'ecureuil', 'Écureuil', q3('squirrel')], ['bois', 'loutre', 'Loutre', q3('otter')],
  ['eau', 'heron', 'Héron', b3('heron')],
  ['climat', 'renard_polaire', 'Renard polaire (cimes)', q3('snowFox')], ['climat', 'bouquetin', 'Bouquetin (cimes)', q3('ibex')],
  ['climat', 'macareux', 'Macareux (landes)', b3('puffin')], ['climat', 'poney', 'Poney (landes)', q3('pony')],
  ['climat', 'grenouille', 'Grenouille (marais)', q3('frog')], ['climat', 'tortue', 'Tortue (marais)', q3('tortoise')],
  ['climat', 'fennec', 'Fennec (dunes)', q3('fennec')], ['climat', 'chameau', 'Chameau (dunes)', q3('camel')],
  ['climat', 'cameleon', 'Caméléon (jungle)', q3('chameleon')], ['climat', 'toucan', 'Toucan (jungle)', b3('toucan')],
  ['climat', 'salamandre', 'Salamandre (volcan)', q3('salamander')], ['climat', 'corbeau', 'Corbeau (volcan)', b3('crow')],
  ['bestiaire', 'mesange', 'Mésange', b3('bird')],
  ['familiers', 'mousse', 'Mousse (renardeau de Sylve)', q3('kit')],
  ['mer', 'mouette', 'Mouette', b3('gull')]
];

// ---- les égarés ----
// [sujet, nom, dessin(vue, pose)]
const EGARES = [
  ['fantome', 'Petit fantôme', (v, p) => G.fantome(v, p)],
  ['zombie', 'Petit zombie tout mou', (v, p) => G.zombie(v, p)],
  ...Object.entries(G.BETES).map(([climat, b]) => [`${b.nom.split(' (')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ /g, '-')}`, b.nom, (v, p) => G.bete(climat, v, p), climat])
];

module.exports = { WALK, FLY, PROFILS, AVANT, DOS, ORIENTEES, EGARES };
