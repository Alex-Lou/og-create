// La liste des plantes, des rochers et des petits décors d'une case, en un seul endroit : preview_plantes.js les publie,
// le générateur des plantes (generateur_plantes.mjs) les dessine, avec les mêmes fonctions.
const { arbre, ARBRES, arbreSaison, ARBRES_SAISONS, pommier, POMMIERS, automne, AUTOMNES, bouleau, BOULEAUX, sapin, SAPINS, palmier, PALMIERS, arbreMort, ARBRES_MORTS } = require('./arbres');
const { touffe, TOUFFES, touffeSaison, TOUFFES_SAISONS } = require('./herbes');
const { rocher, ROCHERS, rocherSaison, ROCHERS_SAISONS, rochers, ROCHERS_TAS, aiguille, AIGUILLES, rochersMoussus, ROCHERS_MOUSSUS } = require('./rochers');
const { coquillages, COQUILLAGES, boisFlotte, BOIS_FLOTTES } = require('./plage');
const { nid, NIDS, lanterne, LANTERNES, banc, BANCS_LISTE, bonhommeDeNeige, BONSHOMMES } = require('./objets');
const { buisson, BUISSONS, buissonSaison, BUISSONS_SAISONS, bruyere, BRUYERES, fleurs, FLEURS, cactus, CACTUS_LISTE, souche, SOUCHES, rondin, RONDINS, champignons, CHAMPIGNONS, roseaux, ROSEAUX, nenuphars, NENUPHARS } = require('./plantes');

// [fichier, libellé, id du décor du jeu, dessin]
const PLANTES = [
  // les arbres refaits (arbres.js) : l'arbre et ses 8 variantes, le pommier et ses 16, l'arbre d'automne et ses 8, le bouleau
  // et ses 8, le sapin et le sapin enneigé et leurs 8 chacun, le palmier et ses 8, l'arbre mort et ses 8
  ...ARBRES.map(([fichier, libelle, o]) => [fichier, libelle, 'tree', () => arbre(o)]),
  // l'arbre au printemps (vert tendre, en fleurs) et en hiver (sous la neige) ; l'automne a son arbre, juste après
  ...ARBRES_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, 'tree', () => arbreSaison(o)]),
  ...POMMIERS.map(([fichier, libelle, o]) => [fichier, libelle, 'apple', () => pommier(o)]),
  ...AUTOMNES.map(([fichier, libelle, o]) => [fichier, libelle, 'autumn', () => automne(o)]),
  ...BOULEAUX.map(([fichier, libelle, o]) => [fichier, libelle, 'birch', () => bouleau(o)]),
  ...SAPINS.map(([fichier, libelle, o]) => [fichier, libelle, o.neige ? 'snowpine' : 'pine', () => sapin(o)]),
  ...PALMIERS.map(([fichier, libelle, o]) => [fichier, libelle, 'palm', () => palmier(o)]),
  ...ARBRES_MORTS.map(([fichier, libelle, o]) => [fichier, libelle, 'deadtree', () => arbreMort(o)]),
  // les autres plantes refaites (plantes.js) : le buisson et ses 8 variantes, la bruyère et ses 8, les fleurs et leurs 8,
  // le cactus et ses 8, la souche et ses 8, le rondin et ses 8, les champignons et leurs 8, les roseaux et leurs 8, les
  // nénuphars et leurs 8
  ...BUISSONS.map(([fichier, libelle, o]) => [fichier, libelle, 'bush', () => buisson(o)]),
  // le buisson en automne (roux, à baies) et en hiver (sous la neige)
  ...BUISSONS_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, 'bush', () => buissonSaison(o)]),
  ...BRUYERES.map(([fichier, libelle, o]) => [fichier, libelle, 'heather', () => bruyere(o)]),
  ...FLEURS.map(([fichier, libelle, o]) => [fichier, libelle, 'flowers', () => fleurs(o)]),
  ...CACTUS_LISTE.map(([fichier, libelle, o]) => [fichier, libelle, 'cactus', () => cactus(o)]),
  ...SOUCHES.map(([fichier, libelle, o]) => [fichier, libelle, 'stump', () => souche(o)]),
  ...RONDINS.map(([fichier, libelle, o]) => [fichier, libelle, 'log', () => rondin(o)]),
  ...CHAMPIGNONS.map(([fichier, libelle, o]) => [fichier, libelle, 'mushrooms', () => champignons(o)]),
  ...ROSEAUX.map(([fichier, libelle, o]) => [fichier, libelle, 'reeds', () => roseaux(o)]),
  ...NENUPHARS.map(([fichier, libelle, o]) => [fichier, libelle, 'lily', () => nenuphars(o)]),
  // la touffe d'herbe refaite (herbes.js) et ses 16 variantes
  ...TOUFFES.map(([fichier, libelle, o]) => [fichier, libelle, 'tuft', () => touffe(o)]),
  // la touffe en automne (blonde) et en hiver (neige sur les pointes)
  ...TOUFFES_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, 'tuft', () => touffeSaison(o)]),
  // le rocher, les rochers en tas, l'aiguille et les rochers moussus refaits (rochers.js) et leurs 8 variantes chacun
  ...ROCHERS.map(([fichier, libelle, o]) => [fichier, libelle, 'rock', () => rocher(o)]),
  // le rocher au printemps (fleurettes au pied), en automne (feuilles mortes) et en hiver (sous la neige)
  ...ROCHERS_SAISONS.map(([fichier, libelle, o]) => [fichier, libelle, 'rock', () => rocherSaison(o)]),
  ...ROCHERS_TAS.map(([fichier, libelle, o]) => [fichier, libelle, 'rocks', () => rochers(o)]),
  ...AIGUILLES.map(([fichier, libelle, o]) => [fichier, libelle, 'crag', () => aiguille(o)]),
  ...ROCHERS_MOUSSUS.map(([fichier, libelle, o]) => [fichier, libelle, 'mossy', () => rochersMoussus(o)]),
  // les coquillages et le bois flotté refaits (plage.js) et leurs 8 variantes chacun
  ...COQUILLAGES.map(([fichier, libelle, o]) => [fichier, libelle, 'shells', () => coquillages(o)]),
  ...BOIS_FLOTTES.map(([fichier, libelle, o]) => [fichier, libelle, 'driftwood', () => boisFlotte(o)]),
  // le nid, la lanterne et le banc refaits (objets.js) et leurs 8 variantes chacun ; le bonhomme de neige
  ...NIDS.map(([fichier, libelle, o]) => [fichier, libelle, 'nest', () => nid(o)]),
  ...LANTERNES.map(([fichier, libelle, o]) => [fichier, libelle, 'lantern', () => lanterne(o)]),
  ...BANCS_LISTE.map(([fichier, libelle, o]) => [fichier, libelle, 'bench', () => banc(o)]),
  // le bonhomme de neige (l'hiver) et ses 8 variantes
  ...BONSHOMMES.map(([fichier, libelle, o]) => [fichier, libelle, 'snowman', () => bonhommeDeNeige(o)])
];

module.exports = { PLANTES };
