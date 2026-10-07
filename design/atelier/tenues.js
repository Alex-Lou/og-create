// Les tenues de saison de la troupe (brief § 6.4) : par maître, une tenue d'hiver à son style, faite des objets du
// catalogue de l'avatar (avatar_choix.js : le bonnet, le cache-oreilles, l'écharpe, le châle, la pèlerine, l'étole, les
// moufles, les bottes fourrées). Un seul dessin par objet (avatar_accessoires.js) : le maître le porte comme l'avatar
// (habiller), posé sur ses repères. enHiver(maître) rend le maître habillé pour l'hiver, à passer à troupe.frame comme
// le maître lui-même. Les coiffes passent par le crochet c.coiffe du maître (aster.js, rivet.js) : il range ce qui
// dépasserait (mèches, crayons) et pose la coiffe à sa place dans la tête.
const { couche, habiller } = require('../personnages/avatar_accessoires');

// Les tenues d'hiver, par maître : par emplacement, [objet, couleurs] ; sansFoulard : l'écharpe remplace le foulard du
// maître. Ondin garde son bonnet de nuit, Galet son bonnet troué, Mélisse son chapeau de paille et ses sabots, Aster
// son ciré.
const HIVER = {
  aster: { tete: ['bonnet', ['#3E5A8C', '#F1E6CC']], cou: ['echarpe', ['#C8463A', '#F1E6CC']], mains: ['moufles', ['#3E5A8C', '#F1E6CC']], sansFoulard: true },
  rivet: { tete: ['cacheOreilles', ['#C8463A', '#C8463A']], cou: ['echarpe', ['#E8A23A', '#F1E6CC']], mains: ['moufles', ['#C8463A', '#F1E6CC']] },
  cannelle: { dessus: ['chale', ['#7A3E5E', '#F1E6CC']], mains: ['moufles', ['#C8463A', '#F1E6CC']] },
  ondin: { cou: ['echarpe', ['#F2C04B', '#3E78C8']], mains: ['moufles', ['#F2C04B', '#3E78C8']], pieds: ['bottesFourrees', ['#5E3A22', '#F1E6CC']] },
  sylve: { dessus: ['etole', ['#E8DCC4']], mains: ['moufles', ['#6E7A44', '#E8DCC4']], pieds: ['bottesFourrees', ['#8A6A44', '#E8DCC4']] },
  galet: { dessus: ['pelerine', ['#6E5A8A', '#E8DCC4']], mains: ['moufles', ['#C8463A', '#F1E6CC']] },
  melisse: { cou: ['echarpe', ['#E3C27A', '#5A4A8A']], mains: ['moufles', ['#5A4A8A', '#E3C27A']] }
};
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Le maître habillé pour l'hiver
function enHiver(m) {
  const { sansFoulard, ...t } = HIVER[slug(m.name)];
  const c = habiller(m, Object.fromEntries(Object.entries(t).map(([place, [id, couleurs]]) => [place, { id, couleurs }])), 'hv');
  if (sansFoulard) c.neck = (cc, ctx) => couche(cc, 'cou', ctx);
  return c;
}

module.exports = { enHiver, HIVER };
