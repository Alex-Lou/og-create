// Lot C — plantes et rochers en vue iso. SVG dans lib/plantes/, planche PNG (le losange de la case est montré en
// dessous pour juger l'ancrage ; il n'est pas dans les SVG).
const path = require('path');
const { unique, row, sheet, write, shoot } = require('./planche');
const { PROP, pt } = require('./deco');
const LIB = path.join(__dirname, 'lib', 'plantes');
const OUT = path.join(__dirname, 'planches');
// [fichier, libellé, id du décor du jeu, dessin] : la liste (plantes_liste.js), les fichiers écrits par le générateur
const { PLANTES: LIST } = require('./plantes_liste');
const { plante } = require('./generateur_plantes.mjs');

const svgOf = (body, scale = 1, withCell = false) => {
  const cell = withCell ? `<polygon points="${[pt(-0.5, -0.5), pt(0.5, -0.5), pt(0.5, 0.5), pt(-0.5, 0.5)].map(q => q.join(',')).join(' ')}" fill="#BFD99A" stroke="#A8C680" stroke-width="0.6"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PROP[2] * scale}" height="${PROP[3] * scale}" viewBox="${PROP.join(' ')}">${cell}${body}</svg>`;
};
const cells = [];
for (const [file, label, id, draw] of LIST) {
  const body = draw();
  write(path.join(LIB, `${file}.svg`), plante(file).svg); // le jeu dessine le même
  cells.push([svgOf(unique(body), 1.4, true), `${label}<br><i>${id}</i>`]);
}
// l'index des saisons : chaque arbre dans sa saison, pour que le jeu ne pioche que dans la saison en cours
const { SAISONS } = require('./arbres_saisons');
write(path.join(LIB, 'saisons.json'), JSON.stringify({
  _lisez_moi: [
    'Les arbres par saison : printemps, ete, automne, hiver ; dans chaque saison, une essence et la liste de ses fichiers (grand, moyen, petit ; deux teintes). Le jeu ne pioche que dans la saison en cours : rien ne se mélange.',
    'Trois essences nouvelles par saison (printemps : cerisier, magnolia, saule ; été : chêne, tilleul, pin parasol ; automne : érable, ginkgo, chêne roux ; hiver : bouleau nu, houx, sapin givré), plus les arbres de saison qui existaient déjà (arbre de printemps, arbre d\'automne, arbre d\'hiver, sapin enneigé).',
    'Les arbres sans saison (arbre, pommier, bouleau, sapin, palmier, arbre mort) ne sont pas ici : au jeu de décider s\'ils restent toute l\'année.',
    'Cadre et ancre : ceux des plantes (cadre ci-dessous, ancre au centre de la case).'
  ],
  cadre: PROP,
  ...SAISONS
}, null, 1));
const rows = [];
for (let i = 0; i < cells.length; i += 6) rows.push(row(i ? '' : 'Décors naturels', cells.slice(i, i + 6)));
shoot([[path.join(OUT, 'plantes_rochers.png'), sheet('Plantes et rochers (vue iso)', 'Cadre d\'un décor d\'une case (PROP_BOX × 1,25), ancre au centre de la case. Le jeu fait balancer les plantes au vent. Losange de la case montré pour l\'ancrage.', rows), 1250]])
  .then(() => console.log('ok', LIST.length));
