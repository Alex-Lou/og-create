// Les autres plantes refaites au niveau des PNJ, une par une, avec le trait, la lumière et les verts des arbres
// (arbres.js) : le buisson. Cadre et ancrage des plantes de deco.js (PROP, centre de la case en (0, 0)) ; le jeu fait
// balancer le dessin entier depuis sa base, il n'y a donc qu'une image.
const { OUT, E, r2 } = require('./troupe');
const { VERTS, fleurette, feuillage } = require('./arbres');

// ——— Le buisson : trois touffes basses (celle du fond plus sombre) et une au milieu, des fleurettes ou des baies ———
// baies : grappe de trois, rouges, reflet
const baie = (x, y) => E(x, y, 1.7, 1.7, '#D9443C', 0.8) + E(x - 0.5, y - 0.6, 0.5, 0.5, '#FFFFFF', 0);
const grappe = (x, y) => baie(x - 1.4, y + 0.6) + baie(x + 1.5, y + 0.8) + baie(x, y - 1);
const B_FOND = [[-9, -20, 8.5], [4, -23, 9], [13, -15, 7.5]];
const B_GAUCHE = [[-13, -10, 8], [-5, -8, 7, 0]];
const B_DROITE = [[11, -9, 7.5], [3, -7, 7, 0]];
const B_MILIEU = [[-2, -15, 8]];
const FLEURS_B = [[-10, -22, '#F7B6C8'], [5, -26, '#FFFFFF'], [12, -17, '#F7B6C8'], [-14, -11, '#FFFFFF'], [-2, -18, '#F7B6C8'], [9, -9, '#FFFFFF']];
const GRAPPES = [[-9, -21], [7, -24], [12, -12], [-12, -9], [-1, -15]];

// vert : 'doux' ou 'profond' ; petit : × 0,75 ; baies : des grappes de baies rouges plutôt que des fleurettes
function buisson({ vert = 'doux', petit = false, baies = false } = {}) {
  const c = VERTS[vert], k = petit ? 0.75 : 1;
  const id = `bui${petit ? 'p' : 'g'}${vert[0]}${baies ? 'b' : ''}`;
  return E(1.5 * k, 1, 21 * k, 8 * k, 'rgba(40,55,20,0.22)', 0)
    + feuillage(`${id}a`, B_FOND, c.fond, [[-3, -20, 0.8], [10, -18, 0.7]], k)
    + feuillage(`${id}b`, B_DROITE, c.devant, [[9, -6, 0.7]], k)
    + feuillage(`${id}c`, B_GAUCHE, c.devant, [[-12, -7, 0.7]], k)
    + feuillage(`${id}d`, B_MILIEU, c.devant, [[-2, -12, 0.7]], k)
    + (baies ? GRAPPES.map(([x, y]) => grappe(x * k, y * k)).join('') : FLEURS_B.map(([x, y, col]) => fleurette(x * k, y * k, col)).join(''));
}

// Les 8 buissons : [fichier, libellé, options] ; « buisson » (grand, vert doux, fleuri) est celui par défaut, comme avant
const BUISSONS = [];
for (const petit of [false, true]) for (const vert of ['doux', 'profond']) for (const baies of [false, true]) {
  const fichier = ['buisson', petit && 'petit', vert === 'profond' && 'profond', baies && 'baies'].filter(Boolean).join('_');
  const libelle = `Buisson (${[petit ? 'petit' : 'grand', `vert ${vert}`, baies ? 'à baies' : 'fleuri'].join(', ')})`;
  BUISSONS.push([fichier, libelle, { vert, petit, baies }]);
}

module.exports = { buisson, BUISSONS };
