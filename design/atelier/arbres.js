// Les arbres refaits au niveau des PNJ, un par un (l'arbre, le pommier, l'arbre d'automne, le bouleau, le sapin, le palmier,
// l'arbre mort). Même trait et même lumière que la troupe : le
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
// les teintes des saisons : le vert tendre du printemps, le vert froid de l'hiver (sous la neige)
const SAISON = {
  tendre: { devant: { light: '#F0FABE', mid: '#BFE47C', dark: '#7DB653' }, fond: { light: '#BBE08A', mid: '#8EC160', dark: '#5E9447' } },
  hiver: { devant: { light: '#CADDB4', mid: '#86AE78', dark: '#557F5E' }, fond: { light: '#9DC090', mid: '#6A9468', dark: '#466A52' } }
};
const TEINTES = { ...VERTS, ...AUTOMNE, ...SAISON };
const BOIS = { left: '#9C6A43', right: '#74492C', bark: '#55331E', light: '#B98458' };
const W = 1.1;

const rond = (x, y, r, fill) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}"/>`;
// Agrandit un tracé (tous ses nombres) depuis l'ancre : le trait, lui, garde son épaisseur
const sc = (d, k) => d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));

// Une touffe : union de lobes [x, y, r, reflet ?] sous un contour commun ; lobes sombres, aplat décalé en haut à gauche
// (il laisse un croissant d'ombre sous chaque lobe), reflet en croissant sur les lobes du haut, marques de feuilles
// neige : une calotte de neige sur les lobes du haut (blanche, ombrée de bleu dessous), comme le sapin enneigé
function touffe(id, lobes, c, marques, k, neige = false) {
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
    }).join('')
    + (neige ? hauts.map(([x, y, r]) => rond(x + r * 0.04, y - r * 0.46, r * 0.8, '#D6E4EE')).join('') + hauts.map(([x, y, r]) => rond(x - r * 0.04, y - r * 0.58, r * 0.78, '#FFFFFF')).join('')
      + hauts.map(([x, y, r]) => rond(x - r * 0.3, y - r * 0.82, r * 0.16, '#F2F7FC')).join('') : '');
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
// neige : le houppier sous la neige et une congère au pied (l'arbre d'hiver)
function arbre({ vert = 'doux', petit = false, fleuri = false, neige = false } = {}) {
  const c = TEINTES[vert], k = petit ? 0.76 : 1;
  const id = `arb${petit ? 'p' : 'g'}${vert[0]}${fleuri ? 'f' : ''}${neige ? 'n' : ''}`;
  return E(3 * k, 1.5, 27 * k, 12 * k, neige ? 'rgba(60,80,110,0.22)' : 'rgba(40,55,20,0.22)', 0) + tronc(`${id}t`, k)
    + touffe(`${id}a`, FOND, c.fond, [[-6, -69], [13, -66, 0.9], [24, -74, 0.8]], k, neige)
    + touffe(`${id}b`, DROITE, c.devant, [[15, -47], [25, -52, 0.9]], k, neige)
    + touffe(`${id}c`, GAUCHE, c.devant, [[-23, -46], [-15, -52, 0.9], [-31, -55, 0.8]], k, neige)
    + touffe(`${id}d`, MILIEU, c.devant, [[-3, -54], [3, -60, 0.8]], k, neige)
    + (fleuri ? pied(k) : '') + (neige ? congere(k) : '');
}

// Les 8 variantes : [fichier, libellé, options] ; « arbre » (grand, vert doux, pied sobre) est l'arbre par défaut
const ARBRES = [];
for (const petit of [false, true]) for (const vert of ['doux', 'profond']) for (const fleuri of [false, true]) {
  const fichier = ['arbre', petit && 'petit', vert === 'profond' && 'profond', fleuri && 'fleuri'].filter(Boolean).join('_');
  const libelle = `Arbre (${[petit ? 'petit' : 'grand', `vert ${vert}`, fleuri && 'pied fleuri'].filter(Boolean).join(', ')})`;
  ARBRES.push([fichier, libelle, { vert, petit, fleuri }]);
}

// ——— L'arbre au fil des saisons (l'automne a son propre arbre, plus bas) ———
// printemps : le vert tendre des jeunes feuilles, quelques fleurs blanches et roses dans le houppier, le pied fleuri ;
// hiver : le vert froid sous la neige, une congère au pied
const FLEURS_PRINTEMPS = [[-27, -52], [-8, -50], [2, -67], [21, -47], [27, -57], [-4, -78], [-18, -72], [12, -75]];
function arbreSaison({ saison = 'printemps', petit = false } = {}) {
  const k = petit ? 0.76 : 1;
  if (saison === 'hiver') return arbre({ vert: 'hiver', petit, neige: true });
  return arbre({ vert: 'tendre', petit, fleuri: true }) + FLEURS_PRINTEMPS.map(([x, y], i) => fleurette(x * k, y * k, i % 3 === 1 ? '#F7B6C8' : '#FFFFFF')).join('');
}
const ARBRES_SAISONS = [];
for (const saison of ['printemps', 'hiver']) for (const petit of [false, true]) {
  ARBRES_SAISONS.push([['arbre', saison, petit && 'petit'].filter(Boolean).join('_'), `Arbre ${saison === 'hiver' ? 'd\'hiver' : 'de printemps'} (${petit ? 'petit' : 'grand'}, ${saison === 'hiver' ? 'sous la neige, congère au pied' : 'vert tendre, en fleurs, pied fleuri'})`, { saison, petit }]);
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

// ——— Le sapin : des étages festonnés, ombrés comme les touffes, un tronc court ; en neige, chaque étage garde la sienne ———
const PINS = {
  doux: { light: '#A8D88A', mid: '#5FAE5C', dark: '#3B7F45' },
  profond: { light: '#8CC77A', mid: '#4A9650', dark: '#2C6A3C' }
};
// Un étage : pointe en haut, flancs à peine creusés, bas festonné de n bosses
function etageD(y, w, h, n) {
  const top = y - h, pas = (2 * w) / n;
  let d = `M0,${r2(top)} Q${r2(-w * 0.3)},${r2(top + h * 0.6)} ${r2(-w)},${r2(y)}`;
  for (let i = 0; i < n; i++) { const x0 = -w + i * pas; d += ` Q${r2(x0 + pas / 2)},${r2(y + 3.6)} ${r2(x0 + pas)},${r2(y)}`; }
  return d + ` Q${r2(w * 0.3)},${r2(top + h * 0.6)} 0,${r2(top)} Z`;
}
// ombre sur le côté droit et dans le creux de chaque feston, reflet le long du flanc gauche, marques d'aiguilles ; en
// neige : une calotte au bord ondulé qui descend jusqu'à yNeige (un peu sous l'étage d'au-dessus), une frange en bas
function etage(id, y, w, h, n, c, neige, yNeige) {
  const d = etageD(y, w, h, n), top = y - h, pas = (2 * w) / n;
  let dedans = `<path d="M${r2(w * 0.08)},${r2(top)} Q${r2(w * 0.45)},${r2(top + h * 0.6)} ${r2(w + 2)},${r2(y + 4)} L${r2(w * 0.12)},${r2(y + 4)} Z" fill="${c.dark}"/>`;
  for (let i = 0; i < n; i++) dedans += `<ellipse cx="${r2(-w + (i + 0.5) * pas)}" cy="${r2(y + 1.6)}" rx="${r2(pas * 0.42)}" ry="2" fill="${c.dark}" opacity="0.55"/>`;
  dedans += `<path d="M-1.2,${r2(top + 3)} Q${r2(-w * 0.32)},${r2(top + h * 0.6)} ${r2(-w + 3)},${r2(y - 1.2)}" stroke="${c.light}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    + [[-w * 0.45, y - h * 0.35], [w * 0.15, y - h * 0.55], [-w * 0.1, y - h * 0.2], [w * 0.5, y - h * 0.25]].map(([x, yy]) =>
      `<path d="M${r2(x - 1.8)},${r2(yy - 1.2)} L${r2(x)},${r2(yy + 0.6)} L${r2(x + 1.8)},${r2(yy - 1.2)}" stroke="${c.dark}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  if (neige) {
    const yc = yNeige, xc = (w * (yc - top) / h) * 1.08;
    dedans += `<path d="M0,${r2(top - 0.4)} Q${r2(-w * 0.18)},${r2(top + h * 0.3)} ${r2(-xc - 1)},${r2(yc)} Q${r2(-xc * 0.6)},${r2(yc + 3)} ${r2(-xc * 0.3)},${r2(yc + 0.6)} Q0,${r2(yc + 3.2)} ${r2(xc * 0.3)},${r2(yc + 0.4)} Q${r2(xc * 0.65)},${r2(yc + 2.8)} ${r2(xc + 1)},${r2(yc - 0.4)} Q${r2(w * 0.18)},${r2(top + h * 0.3)} 0,${r2(top - 0.4)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
      + `<path d="M${r2(w * 0.06)},${r2(top + 1.5)} Q${r2(w * 0.2)},${r2(top + h * 0.3)} ${r2(xc * 0.9)},${r2(yc)}" stroke="#D6E4EE" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  }
  let o = `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
  if (neige) {
    let f = `M${r2(-w + 1)},${r2(y - 0.2)}`;
    for (let i = 0; i < n; i++) { const x0 = -w + i * pas; f += ` Q${r2(x0 + pas / 2)},${r2(y + 3.4)} ${r2(Math.min(x0 + pas, w - 1))},${r2(y - 0.2)}`; }
    o += `<path d="${f}" stroke="${OUT}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${f}" stroke="#FFFFFF" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return o;
}
// tronc court : racines au pied, côté droit à l'ombre, un trait d'écorce
function troncSapin(id, k) {
  const d = sc('M-7.5,1.8 Q-4,0.6 -3.4,-4 L-3,-16 L3,-16 L3.4,-4 Q4,0.6 8,2 Q4.4,3.2 2,2 Q0,3.4 -2.2,2.2 Q-4.6,3.2 -7.5,1.8 Z', k);
  return `<path d="${d}" fill="${BOIS.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${sc('M0.8,4 L1,-17 L9,-17 L9,4 Z', k)}" fill="${BOIS.right}"/>`
    + `<path d="${sc('M-1.6,-4 L-1.4,-11', k)}" stroke="${BOIS.bark}" stroke-width="0.7" stroke-linecap="round"/></g>`;
}
const pommeDePin = (x, y, a) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"><path d="M0,-2.6 Q2.2,-1 1.8,1.2 Q0,3 -1.8,1.2 Q-2.2,-1 0,-2.6 Z" fill="#A0703F" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`
  + `<path d="M-1.4,-0.6 Q0,0.4 1.4,-0.6 M-1.5,1 Q0,2 1.5,1" stroke="#6E4A28" stroke-width="0.5" fill="none"/></g>`;
// congère au pied du sapin enneigé, ombre bleutée
const congere = k => `<path d="M${r2(-17 * k)},4 Q${r2(-14 * k)},-1 ${r2(-8 * k)},1.5 Q${r2(-5 * k)},-0.5 ${r2(-2 * k)},3 Q${r2(4 * k)},0 ${r2(8 * k)},3 Q${r2(13 * k)},0 ${r2(18 * k)},4.5 Q0,9 ${r2(-17 * k)},4 Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
  + `<path d="M${r2(3 * k)},5.5 Q${r2(10 * k)},6.6 ${r2(15 * k)},5" stroke="#D6E4EE" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
// [y du bas, demi-largeur, hauteur, festons], du bas vers le haut
const ETAGES = [[-10, 25, 28, 5], [-27, 20.5, 27, 4], [-44, 16, 25, 4], [-60, 11, 24, 3]];

// vert : 'doux' ou 'profond' ; petit : comme l'arbre ; neige : le sapin enneigé ; pied : pommes de pin (ou congère, en neige)
function sapin({ vert = 'doux', petit = false, neige = false, pied = false } = {}) {
  const c = PINS[vert], k = petit ? 0.76 : 1;
  const id = `sap${neige ? 'n' : ''}${petit ? 'p' : 'g'}${vert[0]}${pied ? 'x' : ''}`;
  return E(2 * k, 1.5, 24 * k, 10.5 * k, neige ? 'rgba(60,80,110,0.22)' : 'rgba(40,55,20,0.22)', 0) + troncSapin(`${id}t`, k)
    + ETAGES.map(([y, w, h, n], i) => etage(`${id}${i}`, y * k, w * k, h * k, n, c, neige, (i < ETAGES.length - 1 ? ETAGES[i + 1][0] + 6.5 : y - h * 0.55) * k)).join('')
    + (pied ? (neige ? congere(k) : pommeDePin(-12 * k, 5, -20) + pommeDePin(11 * k, 6, 30) + pommeDePin(15 * k, 3.4, 80)) : '');
}

// Les 16 sapins : [fichier, libellé, options] ; « sapin » et « sapin_neige » (grands, vert doux, pied sobre) par défaut
const SAPINS = [];
for (const neige of [false, true]) for (const petit of [false, true]) for (const vert of ['doux', 'profond']) for (const pied of [false, true]) {
  const fichier = [neige ? 'sapin_neige' : 'sapin', petit && 'petit', vert === 'profond' && 'profond', pied && (neige ? 'congere' : 'pommes_de_pin')].filter(Boolean).join('_');
  const libelle = `${neige ? 'Sapin enneigé' : 'Sapin'} (${[petit ? 'petit' : 'grand', `vert ${vert}`, pied && (neige ? 'congère au pied' : 'pommes de pin')].filter(Boolean).join(', ')})`;
  SAPINS.push([fichier, libelle, { vert, petit, neige, pied }]);
}

// ——— Le palmier : tronc courbe en anneaux empilés, palmes arquées aux folioles découpées, noix de coco sous la couronne ———
const PALMES = {
  doux: { devant: { light: '#C2E594', mid: '#82C65E', dark: '#4F9046' }, fond: { light: '#94C870', mid: '#5E9F4A', dark: '#3D7340' } },
  profond: { devant: { light: '#A6D67C', mid: '#66B052', dark: '#3E7C3E' }, fond: { light: '#7EB862', mid: '#4C8C44', dark: '#2F6136' } }
};
const STIPE = { left: '#C08A55', right: '#946339', light: '#D9A976' };
// point et tangente d'une courbe quadratique (a, c, b) en t
const qPt = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const qTan = (a, c, b, t) => [2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1])];
const pts = l => l.map(p => `${r2(p[0])},${r2(p[1])}`).join(' L');
// Une palme : de la couronne o vers (dx, dy), arquée ; bord du dessus lisse, bord du dessous découpé en folioles ;
// la moitié du dessous à l'ombre, nervure claire
function palme(id, o, dx, dy, larg, c, k) {
  const b = [o[0] + dx * k, o[1] + dy * k], ctl = [o[0] + dx * k * 0.5, o[1] + dy * k * 0.5 - Math.abs(dx) * 0.38 * k];
  const N = 14, axe = [], haut = [], bas = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = qPt(o, ctl, b, t), d = qTan(o, ctl, b, t), L = Math.hypot(d[0], d[1]) || 1;
    let nx = -d[1] / L, ny = d[0] / L;
    if (ny > 0) { nx = -nx; ny = -ny; } // la normale regarde vers le haut
    const w = larg * k * Math.pow(Math.sin(Math.PI * Math.min(t * 1.08, 1)), 0.75) + 0.3, cran = i % 2 ? 0.35 : 1;
    axe.push(p); haut.push([p[0] + nx * w * 0.55, p[1] + ny * w * 0.55]); bas.push([p[0] - nx * w * cran, p[1] - ny * w * cran]);
  }
  const d = `M${pts(haut.concat(bas.slice().reverse()))} Z`;
  return `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M${pts(axe.concat(bas.slice().reverse()))} Z" fill="${c.dark}"/>`
    + `<path d="M${r2(o[0])},${r2(o[1] - 0.8)} Q${r2(ctl[0])},${r2(ctl[1] - 0.8)} ${r2(b[0])},${r2(b[1] - 0.8)}" stroke="${c.light}" stroke-width="1" fill="none" stroke-linecap="round"/></g>`;
}
// Le tronc : huit anneaux le long d'une courbe, chacun un peu plus étroit, son bas arrondi par-dessus l'anneau d'en dessous
function stipe(id, k) {
  const a = [0, 0], ctl = [-7 * k, -32 * k], b = [8 * k, -62 * k], N = 8;
  let o = '';
  for (let i = 0; i < N; i++) {
    const t0 = i / N, t1 = (i + 1) / N, p0 = qPt(a, ctl, b, t0), p1 = qPt(a, ctl, b, t1);
    const w0 = (5 - 1.8 * t0) * k, w1 = (5 - 1.8 * t1) * k * 1.12;
    const d0 = qTan(a, ctl, b, t0), L0 = Math.hypot(d0[0], d0[1]), n0 = [-d0[1] / L0, d0[0] / L0];
    const d1 = qTan(a, ctl, b, t1), L1 = Math.hypot(d1[0], d1[1]), n1 = [-d1[1] / L1, d1[0] / L1];
    const l0 = [p0[0] - n0[0] * w0, p0[1] - n0[1] * w0], r0 = [p0[0] + n0[0] * w0, p0[1] + n0[1] * w0];
    const l1 = [p1[0] - n1[0] * w1, p1[1] - n1[1] * w1], r1 = [p1[0] + n1[0] * w1, p1[1] + n1[1] * w1];
    const d = `M${r2(l0[0])},${r2(l0[1])} L${r2(l1[0])},${r2(l1[1])} Q${r2(p1[0])},${r2(p1[1] + 1.4 * k)} ${r2(r1[0])},${r2(r1[1])} L${r2(r0[0])},${r2(r0[1])} Q${r2(p0[0])},${r2(p0[1] + 1.8 * k)} ${r2(l0[0])},${r2(l0[1])} Z`;
    o += `<path d="${d}" fill="${STIPE.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
      + `<defs><clipPath id="${id}${i}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id}${i})">`
      + `<path d="M${r2(p0[0] + n0[0] * w0 * 0.25)},${r2(p0[1] + 4)} L${r2(p1[0] + n1[0] * w1 * 0.25)},${r2(p1[1] - 2)} L${r2(p1[0] + n1[0] * 12)},${r2(p1[1] - 2)} L${r2(p0[0] + n0[0] * 12)},${r2(p0[1] + 4)} Z" fill="${STIPE.right}"/>`
      + `<path d="M${r2(l1[0])},${r2(l1[1] + 1.2)} Q${r2(p1[0])},${r2(p1[1] + 2.6 * k)} ${r2(r1[0])},${r2(r1[1] + 1.2)}" stroke="${STIPE.light}" stroke-width="0.9" fill="none" stroke-linecap="round"/></g>`;
  }
  return o;
}
const noixDeCoco = (x, y, s) => E(x, y, 3 * s, 3 * s, '#7A4E28', 0.9) + E(x - 0.9 * s, y - s, 0.9 * s, 0.8 * s, '#A87A4C', 0) + E(x + 0.4 * s, y + 1.2 * s, 0.35 * s, 0.35 * s, '#4E3018', 0);
// [dx, dy, largeur] : quatre palmes au fond, quatre devant
const PALMES_FOND = [[-30, 4, 6], [31, 6, 6], [-10, -22, 5.5], [14, -21, 5.5]];
const PALMES_DEVANT = [[-26, 17, 6.5], [27, 19, 6.5], [-20, -8, 6], [22, -6, 6]];

// vert : 'doux' ou 'profond' ; petit : comme l'arbre ; cocos : deux noix de coco tombées au pied
function palmier({ vert = 'doux', petit = false, cocos = false } = {}) {
  const c = PALMES[vert], k = petit ? 0.76 : 1, o = [8 * k, -62 * k], s = Math.max(k, 0.85);
  const id = `pal${petit ? 'p' : 'g'}${vert[0]}${cocos ? 'c' : ''}`;
  return E(3 * k, 1.5, 22 * k, 9.5 * k, 'rgba(40,55,20,0.22)', 0) + stipe(`${id}s`, k)
    + PALMES_FOND.map(([dx, dy, l], i) => palme(`${id}f${i}`, o, dx, dy, l, c.fond, k)).join('')
    + PALMES_DEVANT.map(([dx, dy, l], i) => palme(`${id}d${i}`, o, dx, dy, l, c.devant, k)).join('')
    + noixDeCoco(o[0] - 3.4 * k, o[1] + 6 * k, s) + noixDeCoco(o[0] + 3.6 * k, o[1] + 6.6 * k, s) + noixDeCoco(o[0] + 0.1 * k, o[1] + 9.6 * k, s)
    + (cocos ? noixDeCoco(-12 * k, 4.5, 0.95) + noixDeCoco(14 * k, 5.5, 0.9) : '');
}

// Les 8 palmiers : [fichier, libellé, options] ; « palmier » (grand, vert doux, pied sobre) est celui par défaut
const PALMIERS = [];
for (const petit of [false, true]) for (const vert of ['doux', 'profond']) for (const cocos of [false, true]) {
  const fichier = ['palmier', petit && 'petit', vert === 'profond' && 'profond', cocos && 'cocos'].filter(Boolean).join('_');
  const libelle = `Palmier (${[petit ? 'petit' : 'grand', `vert ${vert}`, cocos && 'noix de coco au pied'].filter(Boolean).join(', ')})`;
  PALMIERS.push([fichier, libelle, { vert, petit, cocos }]);
}

// ——— L'arbre mort : tronc noueux à racines et en fourche, branches nues qui s'affinent jusqu'aux brindilles, un nœud creux, du lichen ———
const BOIS_MORT = {
  gris: { left: '#A69B8F', right: '#7C7268', light: '#C4BAAE', bark: '#5E554C' },
  brun: { left: '#8A6A4F', right: '#664C37', light: '#A7876A', bark: '#4A3626' }
};
// [points de la branche, largeur au départ] : la largeur décroît d'un segment à l'autre
// (elles partent des deux bras de la fourche du tronc et du creux entre eux, et passent derrière lui)
const BRANCHES = [
  [[[-8.5, -42.7], [-16, -52], [-22, -63]], 3.6], [[[-13.5, -48.5], [-19, -48], [-23, -51]], 1.6],
  [[[0, -34], [1.2, -48], [-1, -62], [2, -75]], 3.6], [[[1.2, -48], [7, -57]], 1.6],
  [[[9.5, -41.2], [17, -47], [25, -57]], 3.6], [[[17, -47], [22, -43], [27, -45]], 1.5], [[[12.5, -43.5], [14, -55]], 1.5]
];
// une branche : segments en gélule, du plus épais au plus fin ; contour d'abord (pour toutes), puis le bois, puis l'ombre
function branchesMortes(c, k) {
  const segs = [];
  BRANCHES.forEach(([p, w0]) => { for (let i = 0; i < p.length - 1; i++) segs.push([p[i], p[i + 1], w0 * (1 - i / p.length * 0.75)]); });
  const seg = ([a, b], w, col) => `<path d="M${r2(a[0] * k)},${r2(a[1] * k)} L${r2(b[0] * k)},${r2(b[1] * k)}" stroke="${col}" stroke-width="${r2(w)}" stroke-linecap="round"/>`;
  return segs.map(([a, b, w]) => seg([a, b], w * k + W * 2, OUT)).join('') + segs.map(([a, b, w]) => seg([a, b], w * k, c.left)).join('')
    + segs.map(([a, b, w]) => seg([[a[0] + w * 0.22, a[1]], [b[0] + w * 0.22, b[1]]], w * k * 0.45, c.right)).join('');
}
function troncMort(id, c, k) {
  const d = sc('M-12,2.2 Q-7,0.8 -5.8,-5 Q-4.6,-14 -5.2,-22 Q-5.6,-30 -10.5,-41 L-6.5,-44.5 Q-2.2,-38 0,-35 Q2,-38.5 7.5,-43 L11.5,-39.5 Q5.6,-31 5,-22 Q4.4,-12 5.8,-6 Q7,0.6 12.5,2.6 Q8,4 4.8,2.4 Q2.4,4.8 -0.6,3.4 Q-3.4,4.6 -5.8,2.6 Q-9,3.6 -12,2.2 Z', k);
  const dedans = `<path d="${sc('M1.4,4 Q2.4,-12 1.8,-22 Q3.4,-32 8.5,-44.5 L16,-44.5 L16,4 Z', k)}" fill="${c.right}"/>`
    + `<path d="${sc('M-2.4,-6 Q-3,-12 -2.2,-17 M2.6,-9 Q3.2,-14 2.6,-19 M-3.2,-21 q0.4,-3 -0.2,-5', k)}" fill="none" stroke="${c.bark}" stroke-width="0.7" stroke-linecap="round"/>`
    + `<path d="${sc('M-4.4,-4 Q-3.8,-12 -4,-20', k)}" fill="none" stroke="${c.light}" stroke-width="1" stroke-linecap="round" opacity="0.8"/>`
    // le nœud creux et un peu de lichen
    + E(-0.6 * k, -15 * k, 2.4 * k, 3 * k, c.light, 0.8) + E(-0.4 * k, -14.6 * k, 1.5 * k, 2.1 * k, '#3A2E26', 0)
    + E(-3.6 * k, -25 * k, 2 * k, 1 * k, '#B7C46C', 0.5) + E(-2.2 * k, -24.4 * k, 1 * k, 0.6 * k, '#B7C46C', 0.4);
  return `<path d="${d}" fill="${c.left}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`;
}

// teinte : 'gris' ou 'brun' ; petit : comme l'arbre ; champignons : trois champignons au pied
function arbreMort({ teinte = 'gris', petit = false, champignons = false } = {}) {
  const c = BOIS_MORT[teinte], k = petit ? 0.76 : 1;
  const id = `mor${petit ? 'p' : 'g'}${teinte[0]}${champignons ? 'c' : ''}`;
  // raccords : le bois des deux grosses branches recouvre la couture au bout des bras de la fourche
  const raccord = (a, b) => `<path d="M${r2(a[0] * k)},${r2(a[1] * k)} L${r2(b[0] * k)},${r2(b[1] * k)}" stroke="${c.left}" stroke-width="${r2(3.6 * k)}" stroke-linecap="butt"/>`
    + `<path d="M${r2((a[0] + 0.8) * k)},${r2(a[1] * k)} L${r2((b[0] + 0.8) * k)},${r2(b[1] * k)}" stroke="${c.right}" stroke-width="${r2(1.6 * k)}" stroke-linecap="butt"/>`;
  return E(2 * k, 1.5, 19 * k, 8.5 * k, 'rgba(40,55,20,0.22)', 0) + branchesMortes(c, k) + troncMort(`${id}t`, c, k)
    + raccord([-7.6, -41.5], [-10, -45.6]) + raccord([8.6, -40.6], [11, -42.5])
    + (champignons ? champignon(-9 * k, 5.4) + champignon(10.5 * k, 5.6) + champignon(14 * k, 3.4) : '');
}

// Les 8 arbres morts : [fichier, libellé, options] ; « arbre_mort » (grand, gris, pied sobre) est celui par défaut
const ARBRES_MORTS = [];
for (const petit of [false, true]) for (const teinte of ['gris', 'brun']) for (const champignons of [false, true]) {
  const fichier = ['arbre_mort', petit && 'petit', teinte === 'brun' && 'brun', champignons && 'champignons'].filter(Boolean).join('_');
  const libelle = `Arbre mort (${[petit ? 'petit' : 'grand', teinte, champignons && 'champignons au pied'].filter(Boolean).join(', ')})`;
  ARBRES_MORTS.push([fichier, libelle, { teinte, petit, champignons }]);
}

module.exports = {
  arbre, ARBRES, arbreSaison, ARBRES_SAISONS, pommier, POMMIERS, automne, AUTOMNES, bouleau, BOULEAUX, sapin, SAPINS, palmier, PALMIERS, arbreMort, ARBRES_MORTS,
  // pour les autres plantes (plantes.js) : les verts, la touffe de feuillage, la fleurette, le champignon, l'herbe
  VERTS, TEINTES, fleurette, feuillage: touffe, champignon, herbe, congere, feuilleMorte, ROUSSES,
  // pour les arbres de saison (arbres_saisons.js) : les troncs, l'étage du sapin, le pied fleuri, le pétale, la pomme de pin
  tronc, troncBouleau, troncSapin, etage, ETAGES, pied, petale, pommeDePin, BOIS, W
};
