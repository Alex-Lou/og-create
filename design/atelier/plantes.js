// Les autres plantes refaites au niveau des PNJ, une par une, avec le trait, la lumière et les verts des arbres
// (arbres.js) : le buisson, la bruyère. Cadre et ancrage des plantes de deco.js (PROP, centre de la case en (0, 0)) ; le jeu fait
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

// ——— La bruyère : un coussin de clochettes sur une base de feuillage, quelques épis ; un papillon s'y pose parfois ———
const FEUILLAGE_BRUYERE = { light: '#B5D58A', mid: '#79A65A', dark: '#4F7A44' };
const CLOCHETTES = {
  mauve: { light: '#ECCDF5', mid: '#B57AD6', dark: '#7E4AA6' },
  rose: { light: '#F9CFE0', mid: '#E07AAE', dark: '#A94A7E' }
};
// un épi : clochettes empilées, de plus en plus petites vers la pointe, plus sombres en bas
function epi(x, y, n, c, k) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const cx = x + Math.sin(i * 1.3) * 0.5 * k, cy = y - i * 2.3 * k, rx = (1.7 - i * 0.22) * k, ry = 1.35 * k;
    o += E(cx, cy, rx, ry, i < 1 ? c.dark : c.mid, 0.6) + E(cx - rx * 0.35, cy - ry * 0.3, rx * 0.35, ry * 0.3, c.light, 0);
  }
  return o;
}
// papillon posé : deux paires d'ailes détourées, un point sur chaque aile du haut
const papillon = (x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">`
  + `<path d="M0,0 Q-3.6,-4 -4.4,-1.2 Q-4,1 0,0.4 Z M0,0 Q3.6,-4 4.4,-1.2 Q4,1 0,0.4 Z" fill="#FFD45E" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + `<path d="M0,0.4 Q-3,1.2 -2.6,3 Q-1,2.6 0,0.6 Z M0,0.4 Q3,1.2 2.6,3 Q1,2.6 0,0.6 Z" fill="#F2A93B" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + E(-2.6, -1.4, 0.55, 0.55, OUT, 0) + E(2.6, -1.4, 0.55, 0.55, OUT, 0)
  + `<path d="M0,-0.6 L0,1.8 M0,-0.6 q-0.6,-1.4 -1.4,-1.8 M0,-0.6 q0.6,-1.4 1.4,-1.8" stroke="${OUT}" stroke-width="0.6" fill="none" stroke-linecap="round"/></g>`;
// la base verte, le coussin fleuri par-dessus (des clochettes claires piquées dedans), quelques épis qui dépassent
const R_BASE = [[-11, -3, 4.5], [0, -3, 5, 0], [11, -3, 4.5]];
const R_COUSSIN = [[-8, -9, 6.5], [1, -12, 7.5], [9, -8, 6], [-3, -6, 5.5, 0], [5, -6, 5.5, 0]];
const POINTS = [[-10, -10], [-6, -13], [-1, -16], [4, -15], [9, -11], [-4, -8], [2, -9], [7, -6], [-9, -6]];
const EPIS = [[-6, -15, 3], [0, -19, 3], [6, -16, 3]];

// teinte : 'mauve' ou 'rose' ; petit : × 0,75 ; papillon : un papillon posé sur le coussin
function bruyere({ teinte = 'mauve', petit = false, papillon: avecPapillon = false } = {}) {
  const c = CLOCHETTES[teinte], k = petit ? 0.75 : 1;
  const id = `bru${petit ? 'p' : 'g'}${teinte[0]}${avecPapillon ? 'b' : ''}`;
  return E(1, 1, 16 * k, 6 * k, 'rgba(40,55,20,0.22)', 0)
    + feuillage(`${id}a`, R_BASE, FEUILLAGE_BRUYERE, [], k)
    + EPIS.map(([x, y, n]) => epi(x * k, y * k, n, c, k)).join('')
    + feuillage(`${id}b`, R_COUSSIN, c, [], k)
    + POINTS.map(([x, y]) => E(x * k, y * k, 0.9 * k, 0.75 * k, c.light, 0) + E((x + 0.3) * k, (y + 0.5) * k, 0.5 * k, 0.3 * k, c.dark, 0)).join('')
    + (avecPapillon ? papillon(2 * k, -21 * k) : '');
}

// Les 8 bruyères : [fichier, libellé, options] ; « bruyere » (grande, mauve, sans papillon) est celle par défaut
const BRUYERES = [];
for (const petit of [false, true]) for (const teinte of ['mauve', 'rose']) for (const pap of [false, true]) {
  const fichier = ['bruyere', petit && 'petite', teinte === 'rose' && 'rose', pap && 'papillon'].filter(Boolean).join('_');
  const libelle = `Bruyère (${[petit ? 'petite' : 'grande', teinte, pap && 'un papillon posé'].filter(Boolean).join(', ')})`;
  BRUYERES.push([fichier, libelle, { teinte, petit, papillon: pap }]);
}

module.exports = { buisson, BUISSONS, bruyere, BRUYERES };
