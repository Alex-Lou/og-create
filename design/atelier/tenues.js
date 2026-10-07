// Les tenues de saison de la troupe (brief § 6.4) : par maître, une tenue d'hiver à son style, faite des objets du
// catalogue de l'avatar (avatar_choix.js : le bonnet, le cache-oreilles, l'écharpe, le châle, la pèlerine, l'étole, les
// moufles, les bottes fourrées). Un seul dessin par objet (avatar_accessoires.js) : le maître le porte comme l'avatar
// (habiller), posé sur ses repères. enHiver(maître) rend le maître habillé pour l'hiver, à passer à troupe.frame comme
// le maître lui-même. Les coiffes passent par le crochet c.coiffe du maître (aster.js, rivet.js) : il range ce qui
// dépasserait (mèches, crayons) et pose la coiffe à sa place dans la tête.
// Sous la pluie, sousLaPluie(maître) de même : le ciré du catalogue, ouvert par-dessus la tenue, et les bottes de pluie ;
// Aster et Ondin, qui portent déjà un ciré, en relèvent la capuche (la coiffe marquée capuche : aster.js, ondin.js).
const { couche, habiller } = require('../personnages/avatar_accessoires');
const { OUT, P, L, clip, r2 } = require('../personnages/troupe');
const { tone } = require('../personnages/avatar_choix');

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

// ---- sous la pluie ----

// La capuche relevée (Aster, Ondin : leur ciré a déjà sa capuche) [ciré, bord] : elle coiffe la tête jusqu'au menton, une
// ouverture ovale autour du visage, bordée (l'ombre est découpée au même contour, trou compris)
function capuche(uid, view, [col, bord]) {
  const S = tone(col, 0.82), k = view === 'se' ? -0.8 : 0, X = x => r2(x + k), reflet = 'rgba(255,255,255,.55)';
  const out = `M${X(9.4)},24 Q${X(8.6)},4.8 ${X(24)},4.6 Q${X(39.4)},4.8 ${X(38.6)},24 Q${X(38.4)},30.8 ${X(34.8)},33 Q${X(24)},34.6 ${X(13.2)},33 Q${X(9.6)},30.8 ${X(9.4)},24 Z`;
  if (view === 'ne') {
    return P(out, col) + clip(`${uid}cp${view}`, out, `<rect x="27" y="2" width="16" height="34" fill="${S}"/>` + L([20, 8], [19, 20], reflet, 0.9)) + P(out, 'none')
      + P('M24,4.8 Q24.6,18 24,33.6', 'none', 0.6) + P('M14,30.6 Q24,33.6 34,30.6', 'none', 0.6);
  }
  const fx = view === 'se' ? 22.6 : 24, rx = view === 'se' ? 10.4 : 10.8, ry = 9.8, cy = 22.4;
  const trou = `M${r2(fx - rx)},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0 Z`;
  const d = `${out} ${trou}`;
  return `<path d="${d}" fill="${col}" fill-rule="evenodd"/>`
    + `<clipPath id="${uid}cp${view}"><path d="${d}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${uid}cp${view})">`
    + `<rect x="${X(30)}" y="2" width="14" height="34" fill="${S}"/>${L([X(14), 11], [X(17.6), 7.4], reflet, 1)}</g>`
    + `<path d="${d}" fill="none" fill-rule="evenodd" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<ellipse cx="${fx}" cy="${cy}" rx="${r2(rx + 0.5)}" ry="${r2(ry + 0.5)}" fill="none" stroke="${OUT}" stroke-width="2.6"/>`
    + `<ellipse cx="${fx}" cy="${cy}" rx="${r2(rx + 0.5)}" ry="${r2(ry + 0.5)}" fill="none" stroke="${bord}" stroke-width="1.3"/>`;
}

// La troupe sous la pluie : capuche relevée [ciré, bord] (Aster, Ondin), ou ciré ouvert [couleur] ; les bottes de pluie ;
// sansCape : Sylve range sa cape de feuilles sous le ciré
const PLUIE = {
  aster: { capuche: ['#F2C04B', '#FFE49A'], bottes: '#C8463A' },
  ondin: { capuche: ['#3D7CC9', '#A9CBEF'], bottes: '#F2C04B' },
  rivet: { cire: '#E8873A', bottes: '#3E5A8C' },
  cannelle: { cire: '#4E8F5A', bottes: '#C8463A' },
  sylve: { cire: '#6FA3D9', bottes: '#F2C04B', sansCape: true },
  galet: { cire: '#C0453A', bottes: '#2E2A2A' },
  melisse: { cire: '#5A4A8A', bottes: '#7EC4A0' }
};

// Le maître sous la pluie
function sousLaPluie(m) {
  const t = PLUIE[slug(m.name)];
  const objets = { pieds: { id: 'bottesPluie', couleurs: [t.bottes] } };
  if (t.cire) objets.dessus = { id: 'cire', couleurs: [t.cire], ouvert: true };
  const c = habiller(m, objets, 'pl');
  if (t.capuche) {
    const f = (cc, ctx, nom) => (nom === 'tete' ? capuche(cc.uid, ctx.view, t.capuche) : '');
    f.capuche = true;
    c.coiffe = f;
  }
  if (t.sansCape) c.noCape = true;
  return c;
}

module.exports = { enHiver, HIVER, sousLaPluie, PLUIE };
