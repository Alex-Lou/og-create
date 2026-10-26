// Tout le jeu en papier néon (choix de l'auteur, 18 oct. : « tout le jeu », l'avatar du joueur rendu en néon quel qu'il
// soit, game/acteur.js : gravee) : après le naufrage et le réveil (neon_naufrage.js, neon_reveil.js), les cinématiques
// gravées de la rencontre, du Vent, du cercle et du matin de Lorena gardent leurs pièces, leur caméra et leurs temps ;
// le décor du couchant, commun à la plage, reprend celui du réveil, le reste passe dans la palette vive.
const GR = require('./gravure_rencontre');
const GV = require('./gravure_vent');
const GC = require('./gravure_cercle');
const GL = require('./gravure_lorena');
const { enNeonScene } = require('./neon_reveil');
const { melange } = require('./neon_naufrage');

// [identifiant, la scène gravée, son préfixe, le décor du couchant (faux : le matin de Lorena a son propre ciel), la
// lumière sur l'avatar (neon_reveil.js : LUMIERES) : celle de la source qu'on voit (le couchant, Brume, la nuit, le matin)]
const CINEMATIQUES = [
  ['02_plage', GR.plage02, 'n2p'], ['02_lueur', GR.lueur02, 'n2l', true, 'brume'], ['02_approche', GR.approche02, 'n2a', true, 'brume'], ['02_rocher', GR.rocher02, 'n2r', true, 'brume'],
  ['03_livre', GV.livre03, 'n3l', true, 'brume'], ['03_vent', GV.vent03, 'n3v', true, 'brume'], ['03_trouee', GV.trouee03, 'n3t', true, 'nuit'], ['03_ciel', GV.ciel03, 'n3c', true, 'nuit'], ['03_nuit', GV.nuit03, 'n3n', true, 'nuit'],
  ['05_cercle', GC.cercle05, 'n5c', true, 'nuit'], ['05_promesse', GC.promesse05, 'n5p', true, 'nuit'], ['05_feu', GC.feu05, 'n5f', true, 'feu'],
  ['10_epave', GL.epave10, 'nae', false, 'matin'], ['10_aster', GL.aster10, 'naa', false, 'matin']
];
// (l'herbe du cercle, trop vive une fois passée au néon : plongée dans la nuit)
const NUIT = '#0A0420', SOMBRES = new Set(['herbe']);
const assombrit = svg => svg.replace(/(?<!url\()(?<!href=")#[0-9a-fA-F]{6}\b/g, c => melange(c, NUIT, 0.45));
function cinematique(scene, p, decor, lumiere) {
  const sc = enNeonScene(scene, p, {}, false, decor, lumiere);
  for (const pl of sc.plans) if (SOMBRES.has(pl.id)) { const d = pl.dessin; pl.dessin = () => assombrit(d()); }
  return sc;
}
const cinematiques = CINEMATIQUES.map(([id, scene, p, decor = true, lumiere = 'couchant']) => [id, () => cinematique(scene, p, decor, lumiere)]);

module.exports = { cinematiques };
