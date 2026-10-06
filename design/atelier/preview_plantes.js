// Lot C — plantes et rochers en vue iso. SVG dans lib/plantes/, planche PNG (le losange de la case est montré en
// dessous pour juger l'ancrage ; il n'est pas dans les SVG).
const path = require('path');
const { unique, row, sheet, write, shoot } = require('./planche');
const { D, PROP, pt } = require('./deco');
const { up, M } = require('./decor2');
const { arbre, ARBRES, pommier, POMMIERS, automne, AUTOMNES, bouleau, BOULEAUX } = require('./arbres');
const { touffe, TOUFFES } = require('./herbes');

const LIB = path.join(__dirname, 'lib', 'plantes');
const OUT = path.join(__dirname, 'planches');
// [fichier, libellé, id du décor du jeu, dessin]
const LIST = [
  // les arbres refaits (arbres.js) : l'arbre et ses 8 variantes, le pommier et ses 16, l'arbre d'automne et ses 8, le bouleau et ses 8
  ...ARBRES.map(([fichier, libelle, o]) => [fichier, libelle, 'tree', () => arbre(o)]),
  ...POMMIERS.map(([fichier, libelle, o]) => [fichier, libelle, 'apple', () => pommier(o)]),
  ...AUTOMNES.map(([fichier, libelle, o]) => [fichier, libelle, 'autumn', () => automne(o)]),
  ...BOULEAUX.map(([fichier, libelle, o]) => [fichier, libelle, 'birch', () => bouleau(o)]),
  ['sapin', 'Sapin', 'pine', () => D.pine()], ['sapin_neige', 'Sapin enneigé', 'snowpine', () => D.snowpine()],
  ['palmier', 'Palmier', 'palm', () => D.palm()], ['buisson', 'Buisson fleuri', 'bush', () => D.bush()], ['bruyere', 'Bruyère', 'heather', () => D.heather()],
  ['fleurs', 'Fleurs', 'flowers', () => D.flowers()], ['cactus', 'Cactus', 'cactus', () => D.cactus()],
  // la touffe d'herbe refaite (herbes.js) et ses 16 variantes
  ...TOUFFES.map(([fichier, libelle, o]) => [fichier, libelle, 'tuft', () => touffe(o)]),
  ['arbre_mort', 'Arbre mort', 'deadtree', () => D.deadtree()], ['souche', 'Souche', 'stump', () => D.stump()], ['rondin', 'Rondin', 'log', () => D.log()],
  ['champignons', 'Champignons', 'mushrooms', () => D.mushrooms()], ['champignons_nuit', 'Champignons (la nuit, ils luisent)', 'mushrooms', () => D.mushrooms(true)],
  ['roseaux', 'Roseaux', 'reeds', () => D.reeds()], ['nenuphars', 'Nénuphars', 'lily', () => D.lily()],
  ['rocher', 'Rocher', 'rock', () => D.rock()], ['rochers', 'Rochers', 'rocks', () => D.rocks()], ['aiguille', 'Aiguille de roche', 'crag', () => D.crag()],
  ['rochers_moussus', 'Rochers moussus', 'mossy', () => D.mossy()], ['coquillages', 'Coquillages', 'shells', () => D.shells()], ['bois_flotte', 'Bois flotté', 'driftwood', () => D.driftwood()],
  ['nid', 'Nid de mouettes', 'nest', () => up(M.nid.draw())], ['lanterne', 'Lanterne (éteinte)', 'lantern', () => D.lantern(false)], ['lanterne_allumee', 'Lanterne (allumée)', 'lantern', () => D.lantern(true)],
  ['banc', 'Banc', 'bench', () => D.bench()]
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
