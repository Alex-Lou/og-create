// Lot C — plantes et rochers en vue iso. SVG dans lib/plantes/, planche PNG (le losange de la case est montré en
// dessous pour juger l'ancrage ; il n'est pas dans les SVG).
const path = require('path');
const { unique, row, sheet, write, shoot } = require('./planche');
const { PROP, pt } = require('./deco');
const { arbre, ARBRES, arbreSaison, ARBRES_SAISONS, pommier, POMMIERS, automne, AUTOMNES, bouleau, BOULEAUX, sapin, SAPINS, palmier, PALMIERS, arbreMort, ARBRES_MORTS } = require('./arbres');
const { touffe, TOUFFES, touffeSaison, TOUFFES_SAISONS } = require('./herbes');
const { rocher, ROCHERS, rocherSaison, ROCHERS_SAISONS, rochers, ROCHERS_TAS, aiguille, AIGUILLES, rochersMoussus, ROCHERS_MOUSSUS } = require('./rochers');
const { coquillages, COQUILLAGES, boisFlotte, BOIS_FLOTTES } = require('./plage');
const { nid, NIDS, lanterne, LANTERNES, banc, BANCS_LISTE } = require('./objets');
const { buisson, BUISSONS, buissonSaison, BUISSONS_SAISONS, bruyere, BRUYERES, fleurs, FLEURS, cactus, CACTUS_LISTE, souche, SOUCHES, rondin, RONDINS, champignons, CHAMPIGNONS, roseaux, ROSEAUX, nenuphars, NENUPHARS } = require('./plantes');

const LIB = path.join(__dirname, 'lib', 'plantes');
const OUT = path.join(__dirname, 'planches');
// [fichier, libellé, id du décor du jeu, dessin]
const LIST = [
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
  // le nid, la lanterne et le banc refaits (objets.js) et leurs 8 variantes chacun
  ...NIDS.map(([fichier, libelle, o]) => [fichier, libelle, 'nest', () => nid(o)]),
  ...LANTERNES.map(([fichier, libelle, o]) => [fichier, libelle, 'lantern', () => lanterne(o)]),
  ...BANCS_LISTE.map(([fichier, libelle, o]) => [fichier, libelle, 'bench', () => banc(o)])
];
const svgOf = (body, scale = 1, withCell = false) => {
  const cell = withCell ? `<polygon points="${[pt(-0.5, -0.5), pt(0.5, -0.5), pt(0.5, 0.5), pt(-0.5, 0.5)].map(q => q.join(',')).join(' ')}" fill="#BFD99A" stroke="#A8C680" stroke-width="0.6"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PROP[2] * scale}" height="${PROP[3] * scale}" viewBox="${PROP.join(' ')}">${cell}${body}</svg>`;
};
const cells = [];
for (const [file, label, id, draw] of LIST) {
  const body = draw();
  write(path.join(LIB, `${file}.svg`), svgOf(body));
  cells.push([svgOf(unique(body), 1.4, true), `${label}<br><i>${id}</i>`]);
}
const rows = [];
for (let i = 0; i < cells.length; i += 6) rows.push(row(i ? '' : 'Décors naturels', cells.slice(i, i + 6)));
shoot([[path.join(OUT, 'plantes_rochers.png'), sheet('Plantes et rochers (vue iso)', 'Cadre d\'un décor d\'une case (PROP_BOX × 1,25), ancre au centre de la case. Le jeu fait balancer les plantes au vent. Losange de la case montré pour l\'ancrage.', rows), 1250]])
  .then(() => console.log('ok', LIST.length));
