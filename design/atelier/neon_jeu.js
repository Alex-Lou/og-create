// Tout le jeu en papier néon (choix de l'auteur, 18 oct. : « tout le jeu », l'avatar du joueur rendu en néon quel qu'il
// soit, game/acteur.js : gravee) : après le naufrage et le réveil (neon_naufrage.js, neon_reveil.js), les cinématiques
// gravées de la rencontre, du Vent, du cercle et du matin de Lorena gardent leurs pièces, leur caméra et leurs temps ;
// le décor du couchant, commun à la plage, reprend celui du réveil, le reste passe dans la palette vive.
const GR = require('./gravure_rencontre');
const GV = require('./gravure_vent');
const GC = require('./gravure_cercle');
const GL = require('./gravure_lorena');
const { enNeonScene } = require('./neon_reveil');

// [identifiant, la scène gravée, son préfixe, le décor du couchant (faux : le matin de Lorena a son propre ciel), la
// lumière sur l'avatar (neon_reveil.js : LUMIERES) : celle de la source qu'on voit (le couchant, Brume, la nuit, le matin)]
const CINEMATIQUES = [
  ['02_plage', GR.plage02, 'n2p'], ['02_lueur', GR.lueur02, 'n2l', true, 'brume'], ['02_approche', GR.approche02, 'n2a', true, 'brume'], ['02_rocher', GR.rocher02, 'n2r', true, 'brume'],
  ['03_livre', GV.livre03, 'n3l', true, 'brume'], ['03_vent', GV.vent03, 'n3v', true, 'brume'], ['03_trouee', GV.trouee03, 'n3t', true, 'nuit'], ['03_ciel', GV.ciel03, 'n3c', true, 'nuit'], ['03_nuit', GV.nuit03, 'n3n', true, 'nuit'],
  ['05_cercle', GC.cercle05, 'n5c', true, 'nuit'], ['05_promesse', GC.promesse05, 'n5p', true, 'nuit'],
  ['10_epave', GL.epave10, 'nae', false, 'matin'], ['10_aster', GL.aster10, 'naa', false, 'matin']
];
const cinematiques = CINEMATIQUES.map(([id, scene, p, decor = true, lumiere = 'couchant']) => [id, () => enNeonScene(scene, p, {}, false, decor, lumiere)]);

module.exports = { cinematiques };
