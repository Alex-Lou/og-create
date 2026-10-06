// Les arbres refaits au niveau des PNJ, un par un (le premier : l'arbre). Même trait et même lumière que la troupe : le
// houppier est fait de touffes détourées comme les pièces d'un personnage (celle du fond plus sombre), chaque lobe a sa
// masse d'ombre en bas à droite et son reflet en croissant en haut à gauche, de petites marques de feuilles ; le tronc a
// ses racines, un peu d'écorce, et se sépare en deux branches sous les feuilles.
// Cadre et ancrage des plantes de deco.js (PROP, centre de la case en (0, 0)) : le jeu fait balancer le dessin entier
// depuis sa base, il n'y a donc qu'une image. Variantes : vert doux ou profond, grand ou petit, pied sobre ou fleuri.
const { OUT, P, E, r2 } = require('./troupe');

const VERTS = {
  // devant : touffes de devant (plus chaudes) ; fond : touffe du fond (plus froide et plus sombre)
  doux: { devant: { light: '#DFF3A8', mid: '#A5D466', dark: '#68A64B' }, fond: { light: '#A3D172', mid: '#77AF50', dark: '#4F8744' } },
  profond: { devant: { light: '#C4E27E', mid: '#86C153', dark: '#4F8E40' }, fond: { light: '#86BE5C', mid: '#5E9946', dark: '#3B6E3D' } }
};
const BOIS = { left: '#9C6A43', right: '#74492C', bark: '#55331E', light: '#B98458' };
const W = 1.1;

const rond = (x, y, r, fill) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}"/>`;
// Agrandit un tracé (tous ses nombres) depuis l'ancre : le trait, lui, garde son épaisseur
const sc = (d, k) => d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));

// Une touffe : union de lobes [x, y, r, reflet ?] sous un contour commun ; lobes sombres, aplat décalé en haut à gauche
// (il laisse un croissant d'ombre sous chaque lobe), reflet en croissant sur les lobes du haut, marques de feuilles
function touffe(id, lobes, c, marques, k) {
  const L = lobes.map(([x, y, r, f]) => [x * k, y * k, r * k, f]);
  const contour = L.map(([x, y, r]) => rond(x, y, r + W, OUT)).join('');
  const zone = `<clipPath id="${id}">${L.map(([x, y, r]) => rond(x, y, r, '#000')).join('')}</clipPath>`;
  const hauts = L.filter(l => l[3] !== 0);
  const dedans = L.map(([x, y, r]) => rond(x, y, r, c.dark)).join('')
    + L.map(([x, y, r]) => rond(x - r * 0.2, y - r * 0.32, r * 0.86, c.mid)).join('')
    + hauts.map(([x, y, r]) => rond(x - r * 0.34, y - r * 0.48, r * 0.5, c.light)).join('')
    + hauts.map(([x, y, r]) => rond(x - r * 0.22, y - r * 0.3, r * 0.5, c.mid)).join('')
    + marques.map(([x, y, s = 1]) => {
      const X = x * k, Y = y * k, S = s * Math.max(k, 0.85);
      return `<path d="M${r2(X - 2.6 * S)},${r2(Y)} Q${r2(X - 1.3 * S)},${r2(Y + 1.8 * S)} ${r2(X)},${r2(Y)} Q${r2(X + 1.3 * S)},${r2(Y + 1.8 * S)} ${r2(X + 2.6 * S)},${r2(Y)}" fill="none" stroke="${c.dark}" stroke-width="0.8" stroke-linecap="round"/>`;
    }).join('');
  return contour + `<defs>${zone}</defs><g clip-path="url(#${id})">${dedans}</g>`;
}

// Le tronc : racines au pied, deux maîtresses branches qui filent sous le houppier ; côté droit à l'ombre, l'ombre du
// houppier sur le haut, quelques traits d'écorce et un reflet à gauche
function tronc(id, k) {
  const d = sc('M-13,2.2 Q-8,0.6 -6.4,-5 Q-5,-16 -5,-26 Q-5.4,-34 -12,-44 L-5,-46 Q-1.4,-40 0,-36 Q1.6,-41 7,-47 L13,-43 Q5.6,-34 5.2,-26 Q5,-16 6.2,-6 Q7.6,0.4 13,2.6 Q8.6,4 5.2,2.4 Q2.6,5 -0.6,3.4 Q-3.6,4.8 -6,2.6 Q-9.4,3.6 -13,2.2 Z', k);
  const dedans = `<path d="${sc('M1.6,4 Q2.6,-14 2,-27 Q4,-36 9,-46 L16,-46 L16,4 Z', k)}" fill="${BOIS.right}"/>`
    + `<path d="${sc('M5.2,2.4 Q8,2.8 13,2.6 L14,6 L4,6 Z', k)}" fill="${BOIS.right}"/>`
    + `<ellipse cx="0" cy="${r2(-38 * k)}" rx="${r2(16 * k)}" ry="${r2(8 * k)}" fill="${BOIS.right}"/>`
    + `<path d="${sc('M-2.6,-7 Q-3.2,-13 -2.4,-19 M2.8,-11 Q3.4,-16 2.8,-22 M-3.4,-21 q0.4,-3 -0.2,-5', k)}" fill="none" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/>`
    + `<path d="${sc('M-4.6,-4 Q-4,-12 -4.2,-20', k)}" fill="none" stroke="${BOIS.light}" stroke-width="1" stroke-linecap="round" opacity="0.7"/>`;
  return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
}

// Le pied fleuri : une touffe d'herbe contre la racine gauche, un champignon entre les racines, trois fleurettes à droite
const herbe = (x, y, col, s = 1) => `<path d="${sc('M-3,0 Q-3.2,-3 -4.6,-4.6 Q-1.6,-3.6 -0.8,-1.4 Q-0.6,-4.8 0.4,-6.2 Q1.6,-3.6 1,-1.2 Q2.2,-3.6 4.4,-4.4 Q3,-2 3,0 Q0,1.2 -3,0 Z', s)}" transform="translate(${r2(x)} ${r2(y)})" fill="${col}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`;
const champignon = (x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">`
  + P('M-1,0 L-0.8,-2.2 L0.8,-2.2 L1,0 Z', '#F6EBD6', 0.7)
  + P('M-2.9,-2 Q-2.6,-5.2 0,-5.4 Q2.6,-5.2 2.9,-2 Q0,-1.3 -2.9,-2 Z', '#E2574C', 0.8)
  + E(-1, -3.8, 0.6, 0.5, '#FFFFFF', 0) + E(1.1, -3.1, 0.45, 0.4, '#FFFFFF', 0) + '</g>';
// fleurette : contour commun des cinq pétales, puis les pétales et le cœur
const PETALES = [0, 72, 144, 216, 288].map(a => [Math.cos((a - 90) * Math.PI / 180) * 1.2, Math.sin((a - 90) * Math.PI / 180) * 1.2]);
const fleurette = (x, y, col) => PETALES.map(([dx, dy]) => rond(x + dx, y + dy, 1.4, OUT)).join('')
  + PETALES.map(([dx, dy]) => rond(x + dx, y + dy, 0.95, col)).join('') + rond(x, y, 0.7, '#F2B33D');
function pied(k) {
  return herbe(-15 * k, 3, '#86B852', 0.85) + champignon(-7.5 * k, 5.2) + herbe(10.5 * k, 5.6, '#94C25C', 0.7)
    + fleurette(15 * k, 4.4, '#FFFFFF') + fleurette(19 * k, 2.6, '#F7B6C8') + fleurette(18.6 * k, 6.6, '#FFFFFF');
}

// Le houppier : la touffe du fond, puis la droite, la gauche et celle du milieu, devant
const FOND = [[-13, -74, 12.5], [4, -79, 14], [20, -70, 11.5], [-26, -63, 9.5], [29, -60, 8]];
const GAUCHE = [[-21, -55, 13], [-33, -50, 8], [-26, -41, 8, 0], [-13, -43, 8, 0]];
const DROITE = [[17, -55, 12], [28, -49, 8.5], [22, -40, 7.5, 0], [10, -45, 7.5, 0]];
const MILIEU = [[-2, -62, 11.5], [-9, -51, 7.5, 0], [5, -52, 8, 0]];

// vert : 'doux' ou 'profond' ; petit : à la hauteur de l'ancien arbre (à peine plus grand qu'un PNJ) ; fleuri : le pied fleuri
function arbre({ vert = 'doux', petit = false, fleuri = false } = {}) {
  const c = VERTS[vert], k = petit ? 0.76 : 1;
  const id = `arb${petit ? 'p' : 'g'}${vert[0]}${fleuri ? 'f' : ''}`;
  return E(3 * k, 1.5, 27 * k, 12 * k, 'rgba(40,55,20,0.22)', 0) + tronc(`${id}t`, k)
    + touffe(`${id}a`, FOND, c.fond, [[-6, -69], [13, -66, 0.9], [24, -74, 0.8]], k)
    + touffe(`${id}b`, DROITE, c.devant, [[15, -47], [25, -52, 0.9]], k)
    + touffe(`${id}c`, GAUCHE, c.devant, [[-23, -46], [-15, -52, 0.9], [-31, -55, 0.8]], k)
    + touffe(`${id}d`, MILIEU, c.devant, [[-3, -54], [3, -60, 0.8]], k)
    + (fleuri ? pied(k) : '');
}

// Les 8 variantes : [fichier, libellé, options] ; « arbre » (grand, vert doux, pied sobre) est l'arbre par défaut
const ARBRES = [];
for (const petit of [false, true]) for (const vert of ['doux', 'profond']) for (const fleuri of [false, true]) {
  const fichier = ['arbre', petit && 'petit', vert === 'profond' && 'profond', fleuri && 'fleuri'].filter(Boolean).join('_');
  const libelle = `Arbre (${[petit ? 'petit' : 'grand', `vert ${vert}`, fleuri && 'pied fleuri'].filter(Boolean).join(', ')})`;
  ARBRES.push([fichier, libelle, { vert, petit, fleuri }]);
}

module.exports = { arbre, ARBRES, VERTS, fleurette };
