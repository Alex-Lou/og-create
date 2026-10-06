// Les arbres refaits au niveau des PNJ, un par un (l'arbre, le pommier, l'arbre d'automne, le bouleau). Même trait et même lumière que la troupe : le
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
// les teintes de l'arbre d'automne, sur le même modèle
const AUTOMNE = {
  orange: { devant: { light: '#FFD98A', mid: '#F5A04A', dark: '#D06A2E' }, fond: { light: '#F2B562', mid: '#DB7F3A', dark: '#A9502A' } },
  rouge: { devant: { light: '#FFB38A', mid: '#E8664A', dark: '#B8402F' }, fond: { light: '#E58A5E', mid: '#C4503A', dark: '#8E3328' } }
};
const TEINTES = { ...VERTS, ...AUTOMNE };
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

// vert : 'doux' ou 'profond' (ou une teinte d'automne) ; petit : à la hauteur de l'ancien arbre (à peine plus grand qu'un
// PNJ) ; fleuri : le pied fleuri
function arbre({ vert = 'doux', petit = false, fleuri = false } = {}) {
  const c = TEINTES[vert], k = petit ? 0.76 : 1;
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

// ——— Le pommier : l'arbre, ses pommes (ou ses fleurs) et, au pied, les pommes (ou les pétales) tombées ———
// Pomme : ronde, un peu plus large en haut, creux de la queue ; ombre en bas à droite, reflet, queue, parfois une feuille
function pomme(id, x, y, s, feuille) {
  const r = 2.7 * s;
  const d = `M${r2(x)},${r2(y - r * 0.7)} Q${r2(x + r * 1.1)},${r2(y - r * 1.25)} ${r2(x + r * 1.05)},${r2(y + r * 0.05)} Q${r2(x + r * 0.9)},${r2(y + r * 1.05)} ${r2(x)},${r2(y + r * 0.95)} `
    + `Q${r2(x - r * 0.9)},${r2(y + r * 1.05)} ${r2(x - r * 1.05)},${r2(y + r * 0.05)} Q${r2(x - r * 1.1)},${r2(y - r * 1.25)} ${r2(x)},${r2(y - r * 0.7)} Z`;
  return `<path d="${d}" fill="#E2574C" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${E(x + r * 0.55, y + r * 0.55, r * 0.95, r * 0.8, '#B83A35', 0)}</g>`
    + `<ellipse cx="${r2(x - r * 0.42)}" cy="${r2(y - r * 0.2)}" rx="${r2(r * 0.3)}" ry="${r2(r * 0.38)}" fill="#FFFFFF" opacity="0.85"/>`
    + `<path d="M${r2(x)},${r2(y - r * 0.6)} q${r2(0.2 * s)},${r2(-1.3 * s)} ${r2(0.9 * s)},${r2(-1.8 * s)}" stroke="${OUT}" stroke-width="${r2(0.9 * Math.max(s, 0.8))}" fill="none" stroke-linecap="round"/>`
    + (feuille ? `<path d="M${r2(x + 0.7 * s)},${r2(y - r * 0.85)} q${r2(1.6 * s)},${r2(-1.6 * s)} ${r2(3.2 * s)},${r2(-0.9 * s)} q${r2(-1.2 * s)},${r2(1.4 * s)} ${r2(-3.2 * s)},${r2(0.9 * s)} Z" fill="#8CC152" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>` : '');
}
// pétale tombé, en amande
const petale = (x, y, a, col) => `<path d="M0,-1.9 Q1.5,0 0,1.9 Q-1.5,0 0,-1.9 Z" fill="${col}" stroke="${OUT}" stroke-width="0.5" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`;
// [x, y, taille, feuille ?] : sur les touffes de devant, deux sur celle du fond
const POMMES = [[-26, -49, 1, true], [-15, -58, 1], [-31, -57, 0.9], [-7, -46, 1], [3, -66, 1, true], [13, -50, 1], [23, -45, 1, true], [27, -55, 0.9], [-3, -76, 0.9], [14, -73, 0.9]];
const TOMBEES = [[12, 5, 1], [-17, 6, 0.95, true]];
const FLEURS = [[-27, -52], [-17, -60], [-31, -45], [-8, -50], [2, -67], [-4, -58], [12, -52], [21, -47], [27, -57], [16, -60], [-4, -78], [12, -75], [-18, -72], [24, -68], [6, -84]];
const PETALES_SOL = [[-16, 4.5, 30, '#F7B6C8'], [-12, 7, -40, '#FFFFFF'], [9, 6, 70, '#FFFFFF'], [14, 3.5, -20, '#F7B6C8'], [18, 6.5, 50, '#FFFFFF'], [-20, 2.5, 80, '#FFFFFF']];

// vert, petit : comme l'arbre ; fleurs : en fleurs plutôt qu'en pommes ; tombees : pommes (ou pétales) tombées au pied
function pommier({ vert = 'doux', petit = false, fleurs = false, tombees = false } = {}) {
  const k = petit ? 0.76 : 1, s = 1.12 * Math.max(k, 0.85);
  const id = `pom${petit ? 'p' : 'g'}${vert[0]}${fleurs ? 'f' : ''}${tombees ? 't' : ''}`;
  let o = arbre({ vert, petit });
  if (fleurs) o += FLEURS.map(([x, y], i) => fleurette(x * k, y * k, i % 3 ? '#FFFFFF' : '#F7B6C8')).join('')
    + (tombees ? PETALES_SOL.map(([x, y, a, col]) => petale(x * k, y, a, col)).join('') : '');
  else o += POMMES.map(([x, y, t, f], i) => pomme(`${id}${i}`, x * k, y * k, t * s, f)).join('')
    + (tombees ? TOMBEES.map(([x, y, t, f], i) => pomme(`${id}s${i}`, x * k, y, t * 1.05, f)).join('') : '');
  return o;
}

// Les 16 pommiers : [fichier, libellé, options] ; « pommier » (grand, vert doux, en pommes, pied sobre) est celui par défaut
const POMMIERS = [];
for (const petit of [false, true]) for (const vert of ['doux', 'profond']) for (const fleurs of [false, true]) for (const tombees of [false, true]) {
  const fichier = ['pommier', petit && 'petit', vert === 'profond' && 'profond', fleurs && 'fleurs', tombees && 'tombees'].filter(Boolean).join('_');
  const libelle = `Pommier (${[petit ? 'petit' : 'grand', `vert ${vert}`, fleurs ? 'en fleurs' : 'en pommes', tombees && (fleurs ? 'pétales tombés' : 'pommes tombées')].filter(Boolean).join(', ')})`;
  POMMIERS.push([fichier, libelle, { vert, petit, fleurs, tombees }]);
}

// ——— L'arbre d'automne : l'arbre en orange ou en rouge et, au pied, des feuilles tombées (deux encore en l'air) ———
// feuille morte : amande pointue, nervure au milieu
const feuilleMorte = (x, y, a, col, s = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a}) scale(${s})">`
  + `<path d="M0,-2.8 Q2.2,-0.6 0,2.8 Q-2.2,-0.6 0,-2.8 Z" fill="${col}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + `<path d="M0,-1.8 L0,2.2" stroke="${OUT}" stroke-width="0.4" stroke-linecap="round" opacity="0.6"/></g>`;
const FEUILLES_SOL = [[-18, 3.5, 30, 0], [-12, 7, -50, 1], [-21, 7, 80, 2], [10, 6.5, 60, 1], [16, 3, -20, 0], [19, 7.5, 40, 2], [3, 8, -70, 0]];
const FEUILLES_AIR = [[-31, -30, 25, 1], [30, -22, -35, 0]];
const ROUSSES = ['#F5A04A', '#E8664A', '#F2C14E'];

// teinte : 'orange' ou 'rouge' ; petit : comme l'arbre ; feuilles : feuilles tombées au pied, deux encore en l'air
function automne({ teinte = 'orange', petit = false, feuilles = false } = {}) {
  const k = petit ? 0.76 : 1;
  return arbre({ vert: teinte, petit })
    + (feuilles ? FEUILLES_SOL.map(([x, y, a, i]) => feuilleMorte(x * k, y, a, ROUSSES[i])).join('')
      + FEUILLES_AIR.map(([x, y, a, i]) => feuilleMorte(x * k, y * k, a, ROUSSES[i], 1.1)).join('') : '');
}

// Les 8 arbres d'automne : [fichier, libellé, options] ; « arbre_automne » (grand, orange, pied sobre) est celui par défaut
const AUTOMNES = [];
for (const petit of [false, true]) for (const teinte of ['orange', 'rouge']) for (const feuilles of [false, true]) {
  const fichier = ['arbre_automne', petit && 'petit', teinte === 'rouge' && 'rouge', feuilles && 'feuilles'].filter(Boolean).join('_');
  const libelle = `Arbre d'automne (${[petit ? 'petit' : 'grand', teinte, feuilles && 'feuilles tombées'].filter(Boolean).join(', ')})`;
  AUTOMNES.push([fichier, libelle, { teinte, petit, feuilles }]);
}

// ——— Le bouleau : tronc fin et blanc marqué de noir, houppier plus haut et plus léger, d'un vert tendre ———
const VERTS_BOULEAU = {
  doux: { devant: { light: '#EEF8C0', mid: '#C3E27E', dark: '#8BBB55' }, fond: { light: '#C2DF8C', mid: '#98C45E', dark: '#6C9C47' } },
  profond: { devant: { light: '#D9EE9A', mid: '#A6D262', dark: '#6FA545' }, fond: { light: '#A4CC70', mid: '#7AAE4D', dark: '#527F3E' } }
};
const ECORCE = { left: '#F4F1EA', right: '#CFC8BA', marque: '#3A3A3A' };
// Le tronc du bouleau : fin, à peine évasé au pied, deux branches sous les feuilles ; côté droit à l'ombre, marques noires
// en lentilles, le pied plus sombre (l'écorce y est rugueuse)
function troncBouleau(id, k) {
  const d = sc('M-8,1.8 Q-4.5,0.6 -3.6,-4 Q-3,-20 -3.4,-36 Q-4,-44 -9,-52 L-5.4,-54.4 Q-1.6,-48 0,-44 Q1.4,-49 6,-55.4 L9.4,-52.4 Q4,-44 3.4,-36 Q3,-20 3.8,-5 Q5,0.6 8.5,2 Q5,3.2 2.6,2 Q0,3.6 -2.6,2.2 Q-5,3.4 -8,1.8 Z', k);
  const marques = [[-2.2, -9, 2.4], [1.4, -15, 2], [-2.4, -22, 2.2], [1.2, -28, 2.6], [-1.8, -34, 1.8], [-5.6, -46, 1.6], [4.6, -47, 1.6]];
  const dedans = `<path d="${sc('M1.2,4 Q1.8,-20 1.6,-36 Q3,-44 8,-56 L14,-56 L14,4 Z', k)}" fill="${ECORCE.right}"/>`
    + `<path d="${sc('M-9,4 L-9,-1.5 Q-4,-3.5 0,-3 Q4,-3.5 9,-1.5 L9,4 Z', k)}" fill="#8E877C"/>`
    + `<ellipse cx="0" cy="${r2(-44 * k)}" rx="${r2(12 * k)}" ry="${r2(6 * k)}" fill="${ECORCE.right}"/>`
    + marques.map(([x, y, w]) => `<path d="M${r2((x - w / 2) * k)},${r2(y * k)} Q${r2(x * k)},${r2((y - 0.9) * k)} ${r2((x + w / 2) * k)},${r2(y * k)} Q${r2(x * k)},${r2((y + 0.6) * k)} ${r2((x - w / 2) * k)},${r2(y * k)} Z" fill="${ECORCE.marque}"/>`).join('');
  return `<path d="${d}" fill="${ECORCE.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
}
const B_FOND = [[-10, -84, 10], [6, -90, 10.5], [17, -78, 9], [-19, -72, 8.5], [1, -75, 10]];
const B_GAUCHE = [[-16, -60, 10], [-24, -55, 7], [-19, -48, 6.5, 0], [-9, -50, 7, 0]];
const B_DROITE = [[14, -63, 9.5], [22, -57, 7], [17, -49, 6.5, 0], [7, -52, 6.5, 0]];
const B_MILIEU = [[-1, -71, 9], [-6, -61, 6.5, 0], [5, -62, 6.5, 0]];

// vert : 'doux' ou 'profond' (les verts tendres du bouleau) ; petit, fleuri : comme l'arbre
function bouleau({ vert = 'doux', petit = false, fleuri = false } = {}) {
  const c = VERTS_BOULEAU[vert], k = petit ? 0.76 : 1;
  const id = `bou${petit ? 'p' : 'g'}${vert[0]}${fleuri ? 'f' : ''}`;
  return E(2 * k, 1.5, 21 * k, 9.5 * k, 'rgba(40,55,20,0.22)', 0) + troncBouleau(`${id}t`, k)
    + touffe(`${id}a`, B_FOND, c.fond, [[-4, -80], [12, -76, 0.8]], k)
    + touffe(`${id}b`, B_DROITE, c.devant, [[13, -55, 0.8], [20, -60, 0.7]], k)
    + touffe(`${id}c`, B_GAUCHE, c.devant, [[-17, -53, 0.8], [-10, -58, 0.7]], k)
    + touffe(`${id}d`, B_MILIEU, c.devant, [[-2, -64, 0.8]], k)
    + (fleuri ? pied(k * 0.85) : '');
}

// Les 8 bouleaux : [fichier, libellé, options] ; « bouleau » (grand, vert doux, pied sobre) est celui par défaut
const BOULEAUX = [];
for (const petit of [false, true]) for (const vert of ['doux', 'profond']) for (const fleuri of [false, true]) {
  const fichier = ['bouleau', petit && 'petit', vert === 'profond' && 'profond', fleuri && 'fleuri'].filter(Boolean).join('_');
  const libelle = `Bouleau (${[petit ? 'petit' : 'grand', `vert ${vert}`, fleuri && 'pied fleuri'].filter(Boolean).join(', ')})`;
  BOULEAUX.push([fichier, libelle, { vert, petit, fleuri }]);
}

module.exports = { arbre, ARBRES, pommier, POMMIERS, automne, AUTOMNES, bouleau, BOULEAUX, VERTS, fleurette };
