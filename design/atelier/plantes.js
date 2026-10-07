// Les autres plantes refaites au niveau des PNJ, une par une, avec le trait, la lumière et les verts des arbres
// (arbres.js) : le buisson, la bruyère, les fleurs, le cactus, la souche, le rondin, les champignons, les roseaux, les
// nénuphars. Cadre et ancrage des plantes de deco.js (PROP, centre de la case en (0, 0)) ; le jeu fait
// balancer le dessin entier depuis sa base, il n'y a donc qu'une image.
const { OUT, E, r2 } = require('./troupe');
const { VERTS, TEINTES, fleurette, feuillage, champignon, herbe, congere, feuilleMorte, ROUSSES } = require('./arbres');

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

// ——— Le buisson au fil des saisons (au printemps, c'est le buisson fleuri) ———
// automne : roux, chargé de baies, des feuilles mortes au pied ; hiver : vert froid sous la neige, une congère au pied
const FEUILLES_B = [[-15, 3.4, 40, 0], [-9, 6, -30, 1], [10, 5.6, 70, 2], [16, 2.8, -15, 0]];
function buissonSaison({ saison = 'automne', petit = false } = {}) {
  const k = petit ? 0.75 : 1, neige = saison === 'hiver', c = TEINTES[neige ? 'hiver' : 'orange'];
  const id = `buis${saison[0]}${petit ? 'p' : 'g'}`;
  return E(1.5 * k, 1, 21 * k, 8 * k, neige ? 'rgba(60,80,110,0.22)' : 'rgba(40,55,20,0.22)', 0)
    + feuillage(`${id}a`, B_FOND, c.fond, [[-3, -20, 0.8], [10, -18, 0.7]], k, neige)
    + feuillage(`${id}b`, B_DROITE, c.devant, [[9, -6, 0.7]], k, neige)
    + feuillage(`${id}c`, B_GAUCHE, c.devant, [[-12, -7, 0.7]], k, neige)
    + feuillage(`${id}d`, B_MILIEU, c.devant, [[-2, -12, 0.7]], k, neige)
    + (neige ? congere(k * 0.8) : GRAPPES.map(([x, y]) => grappe(x * k, y * k)).join('') + FEUILLES_B.map(([x, y, a, i]) => feuilleMorte(x * k, y, a, ROUSSES[i])).join(''));
}
const BUISSONS_SAISONS = [];
for (const saison of ['automne', 'hiver']) for (const petit of [false, true]) {
  BUISSONS_SAISONS.push([['buisson', saison, petit && 'petit'].filter(Boolean).join('_'), `Buisson ${saison === 'hiver' ? 'd\'hiver' : 'd\'automne'} (${petit ? 'petit' : 'grand'}, ${saison === 'hiver' ? 'sous la neige, congère au pied' : 'roux, chargé de baies, feuilles mortes au pied'})`, { saison, petit }]);
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

// ——— Les fleurs : trois touffes sur tiges et feuilles, mélangées ou en marguerites ; une abeille butine parfois ———
const tige = (x0, y0, x1, y1) => {
  const d = `M${r2(x0)},${r2(y0)} Q${r2((x0 + x1) / 2 + (x1 > x0 ? -1 : 1))},${r2((y0 + y1) / 2)} ${r2(x1)},${r2(y1)}`;
  return `<path d="${d}" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#6FA84A" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
};
const feuilleTige = (x, y, a) => `<path d="M0,0 Q2.4,-2 5,-0.6 Q2.4,1.6 0,0 Z" fill="#86C15A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`;
// fleur à cinq pétales ronds (contour commun), cœur jaune
function fleur(x, y, col, s) {
  const p = [0, 72, 144, 216, 288].map(a => [x + Math.cos((a - 90) * Math.PI / 180) * 1.8 * s, y + Math.sin((a - 90) * Math.PI / 180) * 1.8 * s]);
  return p.map(([a, b]) => E(a, b, 1.75 * s + 0.6, 1.75 * s + 0.6, OUT, 0)).join('') + p.map(([a, b]) => E(a, b, 1.75 * s, 1.75 * s, col, 0)).join('')
    + p.map(([a, b]) => E(a - 0.4 * s, b - 0.5 * s, 0.6 * s, 0.6 * s, '#FFFFFF', 0).replace('/>', ' opacity="0.55"/>')).join('')
    + E(x, y, 1.1 * s, 1.1 * s, '#F2B33D', 0.6);
}
// marguerite : huit pétales allongés blancs, gros cœur jaune
function marguerite(x, y, s) {
  const p = [0, 45, 90, 135, 180, 225, 270, 315];
  const petale = (a, col, w) => `<ellipse cx="0" cy="${r2(-2.4 * s)}" rx="${r2(0.95 * s + w)}" ry="${r2(1.9 * s + w)}" fill="${col}" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`;
  return p.map(a => petale(a, OUT, 0.6)).join('') + p.map(a => petale(a, '#FFFFFF', 0)).join('') + E(x, y, 1.6 * s, 1.6 * s, '#F2B33D', 0.6) + E(x - 0.5 * s, y - 0.5 * s, 0.5 * s, 0.5 * s, '#FFE08A', 0);
}
// abeille : corps rayé, deux ailes claires
const abeille = (x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">`
  + E(-1.2, -2, 1.6, 1.2, '#FFFFFF', 0.6).replace('/>', ' opacity="0.9"/>') + E(1.2, -2.2, 1.6, 1.2, '#FFFFFF', 0.6).replace('/>', ' opacity="0.9"/>')
  + E(0, 0, 2.6, 1.8, '#FFD45E', 0.7) + `<path d="M-0.6,-1.7 L-0.6,1.7 M1,-1.6 L1,1.6" stroke="${OUT}" stroke-width="0.8"/>` + E(-2.2, -0.3, 0.9, 0.9, OUT, 0) + '</g>';
const COULEURS = ['#F7B6C8', '#FFD45E', '#FFFFFF', '#C9A8F0', '#F49A7A', '#FFD45E', '#F7B6C8', '#FFFFFF'];
// trois touffes réparties sur la case : [x, y du pied, fleurs [écart de la tige au sol, x et y de la fleur]]
const TOUFFES_FLEURS = [
  [-13, -1, [[-1, -4, -12], [1, 3, -14], [0, -1, -7]]],
  [12, 1, [[-1, -3, -13], [1, 3, -10]]],
  [0, 7, [[-1, -4, -11], [1, 2, -14], [0, 5, -7]]]
];

// marguerites : des marguerites plutôt qu'un bouquet mélangé ; petites : × 0,75 ; abeille : une abeille butine
function fleurs({ marguerites = false, petites = false, abeille: avecAbeille = false } = {}) {
  const k = petites ? 0.75 : 1;
  let o = E(1, 2, 22 * k, 8 * k, 'rgba(40,55,20,0.2)', 0), n = 0;
  TOUFFES_FLEURS.forEach(([cx, cy, fl], j) => {
    const X = cx * k, Y = cy * k;
    o += fl.map(([x0, x, y]) => tige(X + x0 * k, Y + 0.5, X + x * k, Y + (y + 1.5) * k)).join('');
    o += feuilleTige(X - 1.6 * k, Y - 3 * k, j % 2 ? -30 : -150) + feuilleTige(X + 1.2 * k, Y - 4.5 * k, j % 2 ? -150 : -25);
    o += fl.map(([, x, y]) => (marguerites ? marguerite(X + x * k, Y + y * k, k) : fleur(X + x * k, Y + y * k, COULEURS[n++ % COULEURS.length], k))).join('');
  });
  return o + (avecAbeille ? abeille(4 * k, -22 * k) : '');
}

// Les 8 fleurs : [fichier, libellé, options] ; « fleurs » (bouquet mélangé, grand, sans abeille) est celui par défaut
const FLEURS = [];
for (const petites of [false, true]) for (const marguerites of [false, true]) for (const ab of [false, true]) {
  const fichier = ['fleurs', petites && 'petites', marguerites && 'marguerites', ab && 'abeille'].filter(Boolean).join('_');
  const libelle = `Fleurs (${[marguerites ? 'marguerites' : 'bouquet mélangé', petites ? 'petit' : 'grand', ab && 'une abeille'].filter(Boolean).join(', ')})`;
  FLEURS.push([fichier, libelle, { marguerites, petites, abeille: ab }]);
}

// ——— Le cactus : un cierge à deux bras ou une boule, côtes et épines, une fleur au sommet ———
const CACTUS = { light: '#B9DE8E', mid: '#7EBE5E', dark: '#4E8E4A', cote: '#3F7A40', epine: '#FFF6DC' };
const corps = (id, d, ombre, cotes, epines) => `<path d="${d}" fill="${CACTUS.mid}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
  + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${ombre}" fill="${CACTUS.dark}"/>`
  + `<path d="${cotes}" stroke="${CACTUS.cote}" stroke-width="0.7" fill="none" stroke-linecap="round"/></g>`
  + epines.map(([x, y]) => `<path d="M${r2(x - 0.9)},${r2(y - 0.7)} L${r2(x)},${r2(y)} L${r2(x + 0.9)},${r2(y - 0.7)}" stroke="${CACTUS.epine}" stroke-width="0.55" fill="none" stroke-linecap="round"/>`).join('');
const sc2 = (d, k) => d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));
function cierge(id, k) {
  const brasG = sc2('M-5,-13.6 L-11,-13.6 Q-15.8,-13.6 -15.8,-18.4 L-15.8,-27.6 Q-15.8,-30.4 -13,-30.4 Q-10.2,-30.4 -10.2,-27.6 L-10.2,-19.4 L-5,-19.4 Z', k);
  const brasD = sc2('M5,-10 L10.6,-10 Q15.2,-10 15.2,-14.6 L15.2,-23.2 Q15.2,-26 12.5,-26 Q9.8,-26 9.8,-23.2 L9.8,-15.6 L5,-15.6 Z', k);
  const tronc = sc2('M-5.6,0.6 L-5.6,-35 Q-5.6,-41.5 0,-41.5 Q5.6,-41.5 5.6,-35 L5.6,0.6 Q0,2 -5.6,0.6 Z', k);
  return corps(`${id}g`, brasG, sc2('M-13,-13 L-9,-13 L-9,-31 L-13,-31 Z M-15,-16.4 L-4,-16.4 L-4,-12 L-15,-12 Z', k), sc2('M-13,-17 L-13,-28.4', k), [[-14.6 * k, -23 * k], [-11.4 * k, -26 * k], [-8 * k, -16 * k]])
    + corps(`${id}d`, brasD, sc2('M12.5,-9 L16,-9 L16,-27 L12.5,-27 Z M4,-12.6 L16,-12.6 L16,-9 L4,-9 Z', k), sc2('M12.5,-13.4 L12.5,-24', k), [[14 * k, -19 * k], [11 * k, -22.4 * k], [8 * k, -12.6 * k]])
    + corps(`${id}t`, tronc, sc2('M1.6,2 L1.6,-42 L7,-42 L7,2 Z', k), sc2('M-2.2,-1 L-2.2,-37 M2.2,-1 L2.2,-37', k),
      [[-4.4, -8], [-0.2, -14], [4, -6], [-4.4, -22], [4, -20], [-0.2, -29], [-4.2, -34], [3.8, -33]].map(([x, y]) => [x * k, y * k]))
    + `<path d="${sc2('M-3.8,-6 L-3.8,-32', k)}" stroke="${CACTUS.light}" stroke-width="${r2(1.1 * k)}" stroke-linecap="round" opacity="0.8"/>`;
}
function boule(id, k) {
  const d = sc2('M-11,0.4 Q-13.5,-8 -9.5,-14.5 Q-5,-20 0,-20 Q5,-20 9.5,-14.5 Q13.5,-8 11,0.4 Q0,3 -11,0.4 Z', k);
  return corps(`${id}b`, d, sc2('M3,3 Q6,-10 3,-21 L16,-21 L16,3 Z', k), sc2('M0,1.6 L0,-20 M-5,1.2 Q-8,-9 -4,-19 M5,1.2 Q8,-9 4,-19 M-9.5,0.8 Q-13,-7 -8.4,-15 M9.5,0.8 Q13,-7 8.4,-15', k),
    [[-2.5, -6], [2.5, -12], [-7, -10], [7, -5], [-2.5, -16], [6.5, -14], [-9, -3]].map(([x, y]) => [x * k, y * k]))
    + `<path d="${sc2('M-7,-4 Q-9,-10 -5,-16', k)}" stroke="${CACTUS.light}" stroke-width="${r2(1.1 * k)}" fill="none" stroke-linecap="round" opacity="0.8"/>`;
}
const caillou = (x, y, rx, ry) => E(x, y, rx, ry, '#B9A27A', 0.5) + E(x - rx * 0.25, y - ry * 0.3, rx * 0.55, ry * 0.45, '#D9C8A2', 0);
const cailloux = k => caillou(-10 * k, 3, 2.2 * k, 1.3 * k) + caillou(11 * k, 4, 1.8 * k, 1.1 * k) + caillou(8 * k, 1.6, 1.2 * k, 0.8 * k);

// forme : 'cierge' (à bras) ou 'boule' ; petit : × 0,75 ; fleur : une fleur rose au sommet
function cactus({ forme = 'cierge', petit = false, fleur: avecFleur = true } = {}) {
  const k = petit ? 0.75 : 1, id = `cac${forme[0]}${petit ? 'p' : 'g'}${avecFleur ? 'f' : ''}`;
  const haut = forme === 'cierge' ? -42 : -20.5;
  return E(1.5 * k, 1.5, 15 * k, 5.5 * k, 'rgba(60,50,20,0.22)', 0) + cailloux(k) + (forme === 'cierge' ? cierge(id, k) : boule(id, k))
    + (avecFleur ? fleur(0, haut * k - 1.4, '#F27A9A', 0.95) : '');
}

// Les 8 cactus : [fichier, libellé, options] ; « cactus » (cierge, grand, fleuri) est celui par défaut, comme avant
const CACTUS_LISTE = [];
for (const forme of ['cierge', 'boule']) for (const petit of [false, true]) for (const fl of [true, false]) {
  const fichier = ['cactus', forme === 'boule' && 'boule', petit && 'petit', !fl && 'sans_fleur'].filter(Boolean).join('_');
  const libelle = `Cactus (${[forme === 'boule' ? 'en boule' : 'cierge à bras', petit ? 'petit' : 'grand', fl ? 'fleuri' : 'sans fleur'].join(', ')})`;
  CACTUS_LISTE.push([fichier, libelle, { forme, petit, fleur: fl }]);
}

// ——— La souche : une coupe aux cernes du bois, l'écorce, les racines au pied ; une pousse ou des champignons ———
const ECORCES = {
  brune: { left: '#9C6A43', right: '#74492C', bark: '#55331E', coupe: '#E8C08A', cerne: '#C9965E' },
  grise: { left: '#A69B8F', right: '#7C7268', bark: '#5E554C', coupe: '#D9CDB8', cerne: '#B3A58C' }
};
function souche({ ecorce = 'brune', petite = false, champignons = false } = {}) {
  const c = ECORCES[ecorce], k = petite ? 0.75 : 1;
  const id = `sou${petite ? 'p' : 'g'}${ecorce[0]}${champignons ? 'c' : ''}`;
  const d = sc2('M-12.5,1.6 Q-9.2,0.6 -8.8,-3 L-9,-12 L9,-12 L8.8,-3 Q9.4,0.6 13,2 Q8.4,3.6 5.2,2.1 Q2,4.2 -1,2.8 Q-4.2,4.2 -6.6,2.3 Q-9.8,3.2 -12.5,1.6 Z', k);
  const flancs = `<path d="${d}" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<path d="${sc2('M2.4,4 L3,-13 L14,-13 L14,4 Z', k)}" fill="${c.right}"/>`
    + `<path d="${sc2('M-5.6,-2 L-6,-9.4 M-1.4,0 L-1.6,-8 M5.6,-1 L6,-8.6', k)}" stroke="${c.bark}" stroke-width="0.7" fill="none" stroke-linecap="round"/></g>`;
  // la coupe : ellipse claire, trois cernes, une fente
  const coupe = E(0, -12 * k, 9 * k, 3.8 * k, c.coupe, 1.1) + E(0, -12 * k, 6 * k, 2.4 * k, 'none', 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`)
    + E(0, -12 * k, 3 * k, 1.2 * k, 'none', 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`)
    + `<path d="${sc2('M1,-12 L5.6,-13.6', k)}" stroke="${c.cerne}" stroke-width="0.7" stroke-linecap="round"/>`;
  const pousse = `<path d="${sc2('M-5,-12.6 Q-5.6,-17 -4,-20', k)}" stroke="${OUT}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="${sc2('M-5,-12.6 Q-5.6,-17 -4,-20', k)}" stroke="#6FA84A" stroke-width="0.9" fill="none" stroke-linecap="round"/>`
    + `<path d="${sc2('M-4,-19.6 Q-1,-22.6 1.6,-20.4 Q-1,-18.4 -4,-19.6 Z M-4.6,-17 Q-8,-19.4 -9.6,-16.6 Q-7,-15.2 -4.6,-17 Z', k)}" fill="#86C15A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
  return E(1, 1.5, 15 * k, 5.5 * k, 'rgba(40,55,20,0.22)', 0) + flancs + coupe
    + (champignons ? champignon(-11 * k, 4.4) + champignon(11.5 * k, 4.8) + champignon(7.5 * k, 5.6) : pousse);
}

// Les 8 souches : [fichier, libellé, options] ; « souche » (grande, écorce brune, une pousse) est celle par défaut
const SOUCHES = [];
for (const petite of [false, true]) for (const ecorce of ['brune', 'grise']) for (const ch of [false, true]) {
  const fichier = ['souche', petite && 'petite', ecorce === 'grise' && 'grise', ch && 'champignons'].filter(Boolean).join('_');
  const libelle = `Souche (${[petite ? 'petite' : 'grande', `écorce ${ecorce}`, ch ? 'des champignons' : 'une pousse'].join(', ')})`;
  SOUCHES.push([fichier, libelle, { ecorce, petite, champignons: ch }]);
}

// ——— Le rondin : un tronc couché le long de la case, sa coupe aux cernes vers nous ; mousse et pousse, ou champignons ———
function rondin({ ecorce = 'brune', petit = false, champignons = false } = {}) {
  const c = ECORCES[ecorce], k = petit ? 0.75 : 1;
  const id = `ron${petit ? 'p' : 'g'}${ecorce[0]}${champignons ? 'c' : ''}`;
  // l'axe du tronc suit la case (2 : 1), de l'arrière gauche A à la coupe B ; r : rayon, ra : demi-largeur des bouts
  const A = [-21 * k, -4.5 * k], B = [18 * k, 15 * k], r = 6.8 * k, ra = 5.2 * k;
  const surAxe = (t, o) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + o * r];
  const d = `M${r2(A[0])},${r2(A[1] - r)} L${r2(B[0])},${r2(B[1] - r)} L${r2(B[0])},${r2(B[1] + r)} L${r2(A[0])},${r2(A[1] + r)} A${r2(ra)} ${r2(r)} 0 0 1 ${r2(A[0])},${r2(A[1] - r)} Z`;
  const dedans = `<path d="M${r2(A[0] - ra)},${r2(A[1] + r * 0.25)} L${r2(B[0])},${r2(B[1] + r * 0.25)} L${r2(B[0])},${r2(B[1] + r + 2)} L${r2(A[0] - ra)},${r2(A[1] + r + 2)} Z" fill="${c.right}"/>`
    + `<path d="M${r2(A[0] + 2 * k)},${r2(A[1] - r * 0.62)} L${r2(B[0] - 3 * k)},${r2(B[1] - r * 0.62)}" stroke="${c.coupe}" stroke-width="${r2(1.1 * k)}" stroke-linecap="round" opacity="0.6"/>`
    + [[0.2, -0.15, 5], [0.45, 0.2, 6], [0.7, -0.3, 4.5], [0.3, 0.55, 5]].map(([t, o, l]) => {
      const x = A[0] + (B[0] - A[0]) * t, y = A[1] + (B[1] - A[1]) * t + o * r;
      return `<path d="M${r2(x)},${r2(y)} l${r2(l * 0.89 * k)},${r2(l * 0.45 * k)}" stroke="${c.bark}" stroke-width="0.7" stroke-linecap="round"/>`;
    }).join('');
  const coupe = E(B[0], B[1], ra, r, c.coupe, 1.1)
    + E(B[0], B[1], ra * 0.62, r * 0.62, 'none', 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`)
    + E(B[0], B[1], ra * 0.28, r * 0.28, 'none', 0).replace('stroke="none"', `stroke="${c.cerne}" stroke-width="0.7"`);
  const mousse = E(A[0] + 7 * k, A[1] + 3.5 * k - r, 5 * k, 1.8 * k, '#9CCB6A', 0.8) + E(A[0] + 5.6 * k, A[1] + 3 * k - r - 0.6 * k, 2.4 * k, 0.7 * k, '#C8E59A', 0)
    + `<path d="M${r2(A[0] + 15 * k)},${r2(A[1] + 7.5 * k - r)} q0,-4 2.4,-5" stroke="${OUT}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${r2(A[0] + 15 * k)},${r2(A[1] + 7.5 * k - r)} q0,-4 2.4,-5" stroke="${c.left}" stroke-width="1" fill="none" stroke-linecap="round"/>`
    + `<path d="M${r2(A[0] + 17.2 * k)},${r2(A[1] + 2.6 * k - r)} q2.6,-2.4 5,-0.8 q-2.4,1.8 -5,0.8 Z" fill="#86C15A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`;
  return E(0, 8 * k, 26 * k, 9 * k, 'rgba(40,55,20,0.22)', 0)
    + `<path d="${d}" fill="${c.left}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${dedans}</g>`
    + coupe + mousse
    + (champignons ? [0.38, 0.5, 0.62].map((t, i) => { const [x, y] = surAxe(t, i === 1 ? 0.95 : 0.75); return champignon(x, y); }).join('') : '');
}

// Les 8 rondins : [fichier, libellé, options] ; « rondin » (grand, écorce brune, mousse et pousse) est celui par défaut
const RONDINS = [];
for (const petit of [false, true]) for (const ecorce of ['brune', 'grise']) for (const ch of [false, true]) {
  const fichier = ['rondin', petit && 'petit', ecorce === 'grise' && 'gris', ch && 'champignons'].filter(Boolean).join('_');
  const libelle = `Rondin (${[petit ? 'petit' : 'grand', `écorce ${ecorce}`, ch ? 'des champignons' : 'mousse et pousse'].join(', ')})`;
  RONDINS.push([fichier, libelle, { ecorce, petit, champignons: ch }]);
}

// ——— Les champignons : une famille de trois, amanites rouges à pois ou cèpes bruns ; la nuit, ils luisent ———
const CHAPEAUX = {
  rouges: { mid: '#E2574C', dark: '#B03A33', light: '#F59A86', pois: true },
  bruns: { mid: '#B7804C', dark: '#8A5A31', light: '#D9A876', pois: false },
  nuit: { mid: '#7FE0C0', dark: '#4FB59A', light: '#C8FFE8' }
};
// un champignon : pied clair un peu renflé, chapeau en dôme (ombre en bas à droite, reflet), lamelles dessous, pois
function champi(id, x, y, s, c, pois, nuit) {
  const pied = `M${r2(x - 1.6 * s)},${r2(y)} Q${r2(x - 2.1 * s)},${r2(y - 2.4 * s)} ${r2(x - 1.2 * s)},${r2(y - 4.4 * s)} L${r2(x + 1.2 * s)},${r2(y - 4.4 * s)} Q${r2(x + 2.1 * s)},${r2(y - 2.4 * s)} ${r2(x + 1.6 * s)},${r2(y)} Q${r2(x)},${r2(y + 0.8 * s)} ${r2(x - 1.6 * s)},${r2(y)} Z`;
  const ch = `M${r2(x - 4.6 * s)},${r2(y - 4 * s)} Q${r2(x - 4.4 * s)},${r2(y - 9.4 * s)} ${r2(x)},${r2(y - 9.8 * s)} Q${r2(x + 4.4 * s)},${r2(y - 9.4 * s)} ${r2(x + 4.6 * s)},${r2(y - 4 * s)} Q${r2(x)},${r2(y - 2.6 * s)} ${r2(x - 4.6 * s)},${r2(y - 4 * s)} Z`;
  return (nuit ? E(x, y - 6.4 * s, 7.4 * s, 6 * s, 'rgb(150,255,210)', 0).replace('/>', ' opacity="0.2"/>') + E(x, y - 6.6 * s, 5.4 * s, 4.4 * s, 'rgb(170,255,220)', 0).replace('/>', ' opacity="0.3"/>') : '')
    + `<path d="${pied}" fill="#F6EEDC" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + `<path d="M${r2(x + 0.2 * s)},${r2(y - 0.2)} Q${r2(x + 1.4 * s)},${r2(y - 2.4 * s)} ${r2(x + 0.6 * s)},${r2(y - 4.2 * s)} L${r2(x + 1.2 * s)},${r2(y - 4.4 * s)} Q${r2(x + 2.1 * s)},${r2(y - 2.4 * s)} ${r2(x + 1.6 * s)},${r2(y)} Z" fill="#DCCFB4"/>`
    + `<path d="${ch}" fill="${c.mid}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${ch}"/></clipPath></defs><g clip-path="url(#${id})">`
    + E(x + 2.2 * s, y - 4.4 * s, 4.6 * s, 3 * s, c.dark, 0) + E(x - 1.6 * s, y - 8.2 * s, 2 * s, 1.1 * s, c.light, 0) + '</g>'
    + `<path d="M${r2(x - 3.6 * s)},${r2(y - 3.9 * s)} Q${r2(x)},${r2(y - 2.9 * s)} ${r2(x + 3.6 * s)},${r2(y - 3.9 * s)}" stroke="${OUT}" stroke-width="0.5" fill="none" opacity="0.5"/>`
    + (pois ? [[-1.8, -7.4, 0.8], [1.4, -8.2, 0.6], [2.6, -6, 0.65], [-0.2, -5.6, 0.5]].map(([dx, dy, r]) => E(x + dx * s, y + dy * s, r * s * 1.2, r * s, '#FFFFFF', 0)).join('') : '');
}
// [x, y, taille] : le grand, le moyen, le petit
const FAMILLE = [[-5, 2, 1.25], [6, 4, 0.95], [11.5, 0, 0.7]];

// sorte : 'rouges' (amanites à pois) ou 'bruns' (cèpes) ; petits : × 0,75 ; nuit : ils luisent
function champignons({ sorte = 'rouges', petits = false, nuit = false } = {}) {
  const k = petits ? 0.75 : 1, c = nuit ? CHAPEAUX.nuit : CHAPEAUX[sorte];
  const id = `chp${petits ? 'p' : 'g'}${sorte[0]}${nuit ? 'n' : ''}`;
  return E(2 * k, 2, 14 * k, 5 * k, 'rgba(40,55,20,0.22)', 0) + herbe(-13 * k, 3.4, '#86B852', 0.7)
    + FAMILLE.map(([x, y, t], i) => champi(`${id}${i}`, x * k, y * k, t * k, c, CHAPEAUX[sorte].pois, nuit)).join('');
}

// Les 8 champignons : [fichier, libellé, options] ; « champignons » (rouges, grands, de jour) et « champignons_nuit »
// (rouges, grands, qui luisent) gardent leurs noms
const CHAMPIGNONS = [];
for (const petits of [false, true]) for (const sorte of ['rouges', 'bruns']) for (const nuit of [false, true]) {
  const fichier = ['champignons', petits && 'petits', sorte === 'bruns' && 'bruns', nuit && 'nuit'].filter(Boolean).join('_');
  const libelle = `Champignons (${[sorte === 'bruns' ? 'cèpes bruns' : 'amanites rouges', petits ? 'petits' : 'grands', nuit && 'la nuit, ils luisent'].filter(Boolean).join(', ')})`;
  CHAMPIGNONS.push([fichier, libelle, { sorte, petits, nuit }]);
}

// ——— Les roseaux : feuilles et massettes, dans une petite mare ou sur la rive ; une libellule s'y pose parfois ———
// la mare : eau détourée, plus claire en haut à gauche, deux rides
const mare = (k, rx = 24, ry = 10.5) => E(0, 1, rx * k, ry * k, '#8FC8E0', 1.1) + E(-3 * k, 0, rx * 0.68 * k, ry * 0.6 * k, '#B6E0F0', 0)
  + `<path d="M${r2(-14 * k)},${r2(3 * k)} q${r2(6 * k)},${r2(-2 * k)} ${r2(12 * k)},0 M${r2(4 * k)},${r2(6 * k)} q${r2(4 * k)},${r2(-1.4 * k)} ${r2(8 * k)},0" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.8"/>`;
// feuille de roseau : longue et fine, détourée, nervure claire
function feuilleRoseau(x, h, pli, k) {
  const d = `M${r2((x - 1.4) * k)},${r2(3 * k)} Q${r2((x - 1.2) * k)},${r2((3 - h * 0.55) * k)} ${r2((x + pli) * k)},${r2((3 - h) * k)} Q${r2((x + 1) * k)},${r2((3 - h * 0.5) * k)} ${r2((x + 1.4) * k)},${r2(3 * k)} Z`;
  return `<path d="${d}" fill="#7FB650" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + `<path d="M${r2((x - 0.3) * k)},${r2(2 * k)} Q${r2((x - 0.2) * k)},${r2((3 - h * 0.5) * k)} ${r2((x + pli * 0.8) * k)},${r2((3 - h * 0.9) * k)}" stroke="#B5DB86" stroke-width="0.7" fill="none" stroke-linecap="round"/>`;
}
// massette : tige détourée, épi brun en gélule (reflet), une pointe
function massette(x, h, k) {
  const tx = x + (x > 0 ? 1.2 : -1.2), top = 3 - h;
  return `<path d="M${r2(x * k)},${r2(3 * k)} Q${r2(x * k)},${r2((3 - h * 0.6) * k)} ${r2(tx * k)},${r2(top * k)}" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    + `<path d="M${r2(x * k)},${r2(3 * k)} Q${r2(x * k)},${r2((3 - h * 0.6) * k)} ${r2(tx * k)},${r2(top * k)}" stroke="#7EA850" stroke-width="1.1" fill="none" stroke-linecap="round"/>`
    + `<rect x="${r2((tx - 1.7) * k)}" y="${r2((top + 1) * k)}" width="${r2(3.4 * k)}" height="${r2(7.4 * k)}" rx="${r2(1.7 * k)}" fill="#8A5A36" stroke="${OUT}" stroke-width="0.9"/>`
    + `<rect x="${r2((tx - 1) * k)}" y="${r2((top + 2) * k)}" width="${r2(0.9 * k)}" height="${r2(4.4 * k)}" rx="${r2(0.45 * k)}" fill="#B88458"/>`
    + `<path d="M${r2(tx * k)},${r2((top + 1) * k)} L${r2(tx * k)},${r2((top - 1.6) * k)}" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round"/>`;
}
// libellule : corps fin bleu, quatre ailes claires
const libellule = (x, y) => `<g transform="translate(${r2(x)} ${r2(y)}) rotate(-12)">`
  + ['-2.4,-1.6,3.2,1', '2.4,-1.6,3.2,1', '-2.2,0.4,2.8,0.9', '2.2,0.4,2.8,0.9'].map(v => { const [cx, cy, rx, ry] = v.split(',').map(Number); return E(cx * 1.2, cy, rx, ry, '#EAF6FF', 0.5).replace('/>', ' opacity="0.9"/>'); }).join('')
  + `<path d="M0,-1 L0,5.4" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/><path d="M0,-1 L0,5.4" stroke="#4FA3C8" stroke-width="1" stroke-linecap="round"/>` + E(0, -1.6, 1.2, 1.1, '#4FA3C8', 0.7) + '</g>';
// [x, hauteur, pli de la pointe] et massettes [x, hauteur]
const FEUILLES_R = [[-12, 18, -3], [-7, 24, -2], [-2, 20, 2], [3, 26, 2.4], [8, 19, 3], [12, 15, 3.4]];
const MASSETTES = [[-9, 26], [0.5, 30], [6, 24]];

// petits : × 0,75 ; eau : dans une petite mare (sinon sur la rive) ; libellule : une libellule posée
function roseaux({ petits = false, eau = true, libellule: avecLibellule = false } = {}) {
  const k = petits ? 0.75 : 1;
  return (eau ? mare(k) : E(1, 2, 16 * k, 5.5 * k, 'rgba(40,55,20,0.22)', 0))
    + MASSETTES.map(([x, h]) => massette(x, h, k)).join('') + FEUILLES_R.map(([x, h, p]) => feuilleRoseau(x, h, p, k)).join('')
    + (avecLibellule ? libellule(9 * k, -25 * k) : '');
}

// Les 8 roseaux : [fichier, libellé, options] ; « roseaux » (grands, dans la mare, sans libellule) est celui par défaut
const ROSEAUX = [];
for (const petits of [false, true]) for (const eau of [true, false]) for (const lib of [false, true]) {
  const fichier = ['roseaux', petits && 'petits', !eau && 'rive', lib && 'libellule'].filter(Boolean).join('_');
  const libelle = `Roseaux (${[petits ? 'petits' : 'grands', eau ? 'dans une mare' : 'sur la rive', lib && 'une libellule'].filter(Boolean).join(', ')})`;
  ROSEAUX.push([fichier, libelle, { petits, eau, libellule: lib }]);
}

// ——— Les nénuphars : des feuilles rondes encochées sur une mare, des fleurs en étoile ; une grenouille s'y assoit ———
// une feuille vue de biais : disque aplati avec son encoche, plus claire en haut à gauche, nervures
function feuilleNenuphar(id, x, y, rx, a) {
  const ry = rx * 0.52, t = a * Math.PI / 180;
  const d = `M${r2(x)},${r2(y)} L${r2(x + rx * Math.cos(t - 0.22))},${r2(y + ry * Math.sin(t - 0.22))} A${r2(rx)} ${r2(ry)} 0 1 0 ${r2(x + rx * Math.cos(t + 0.22))},${r2(y + ry * Math.sin(t + 0.22))} Z`;
  return `<path d="${d}" fill="#79B85A" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${E(x - rx * 0.25, y - ry * 0.3, rx * 0.7, ry * 0.6, '#A2D27A', 0)}${E(x + rx * 0.4, y + ry * 0.5, rx * 0.7, ry * 0.5, '#5C9A47', 0)}</g>`
    + [0.9, 1.6, 2.4, 3.2, 4, 4.8].map(b => `<path d="M${r2(x)},${r2(y)} L${r2(x + rx * 0.75 * Math.cos(t + b))},${r2(y + ry * 0.75 * Math.sin(t + b))}" stroke="#5C9A47" stroke-width="0.5" stroke-linecap="round"/>`).join('');
}
// une fleur de nénuphar, vue de profil : pétales en pointe en éventail sur deux rangs, le cœur jaune entre les deux
function fleurNenuphar(x, y, c, s) {
  const petale = (a, rx, ry, col) => `<path d="M0,0 Q${r2(rx * s)},${r2(-ry * 0.55 * s)} 0,${r2(-ry * s)} Q${r2(-rx * s)},${r2(-ry * 0.55 * s)} 0,0 Z" fill="${col}" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round" transform="translate(${r2(x)} ${r2(y)}) rotate(${a})"/>`;
  return [-62, -32, 0, 32, 62].map(a => petale(a, 2.3, 6.4, c.fond)).join('')
    + E(x, y - 2.6 * s, 1.8 * s, 1.1 * s, '#F2C94C', 0.5)
    + [-40, -13, 13, 40].map(a => petale(a, 2, 5, c.devant)).join('');
}
// la grenouille : ronde, deux gros yeux, un sourire, les joues roses
const grenouille = (x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">`
  + E(0, -2.4, 4.4, 3.2, '#8CC45A', 0.9) + E(-1.2, -2.6, 2.2, 1.4, '#B7DE86', 0) + E(-3.4, -0.2, 1.6, 0.8, '#7BB34C', 0.7) + E(3.4, -0.2, 1.6, 0.8, '#7BB34C', 0.7)
  + E(-2.1, -5.4, 1.6, 1.5, '#8CC45A', 0.9) + E(2.1, -5.4, 1.6, 1.5, '#8CC45A', 0.9)
  + E(-2.1, -5.5, 0.95, 0.95, '#FFFFFF', 0) + E(2.1, -5.5, 0.95, 0.95, '#FFFFFF', 0) + E(-1.9, -5.4, 0.55, 0.6, OUT, 0) + E(2.3, -5.4, 0.55, 0.6, OUT, 0)
  + `<path d="M-1.4,-2.6 Q0,-1.6 1.4,-2.6" stroke="${OUT}" stroke-width="0.6" fill="none" stroke-linecap="round"/>` + E(-2.6, -2.4, 0.7, 0.4, '#F7A8B8', 0) + E(2.6, -2.4, 0.7, 0.4, '#F7A8B8', 0) + '</g>';
const FLEURS_EAU = { roses: { fond: '#F49AB8', devant: '#FBCADB' }, blancs: { fond: '#E8EEF0', devant: '#FFFFFF' } };
// [x, y, rayon, orientation de l'encoche]
const FEUILLES_N = [[-14, 1, 7, 20], [6, -4, 6.4, 150], [13, 5, 6, 60], [-3, 7, 5.4, 260]];

// teinte : fleurs 'roses' ou 'blancs' ; petits : × 0,75 ; grenouille : une grenouille assise sur une feuille
function nenuphars({ teinte = 'roses', petits = false, grenouille: avecGrenouille = false } = {}) {
  const k = petits ? 0.75 : 1, c = FLEURS_EAU[teinte];
  const id = `nen${petits ? 'p' : 'g'}${teinte[0]}${avecGrenouille ? 'r' : ''}`;
  return mare(k, 28, 12)
    + FEUILLES_N.map(([x, y, r, a], i) => feuilleNenuphar(`${id}${i}`, x * k, y * k, r * k, a)).join('')
    + fleurNenuphar(6 * k, -4.6 * k, c, k) + fleurNenuphar(-3 * k, 6.4 * k, c, 0.75 * k)
    + (avecGrenouille ? grenouille(-14 * k, 1.4 * k) : '');
}

// Les 8 nénuphars : [fichier, libellé, options] ; « nenuphars » (grands, fleurs roses, sans grenouille) est celui par défaut
const NENUPHARS = [];
for (const petits of [false, true]) for (const teinte of ['roses', 'blancs']) for (const gr of [false, true]) {
  const fichier = ['nenuphars', petits && 'petits', teinte === 'blancs' && 'blancs', gr && 'grenouille'].filter(Boolean).join('_');
  const libelle = `Nénuphars (${[petits ? 'petits' : 'grands', `fleurs ${teinte}`, gr && 'une grenouille'].filter(Boolean).join(', ')})`;
  NENUPHARS.push([fichier, libelle, { teinte, petits, grenouille: gr }]);
}

module.exports = {
  buissonSaison, BUISSONS_SAISONS,
  buisson, BUISSONS, bruyere, BRUYERES, fleurs, FLEURS, cactus, CACTUS_LISTE, souche, SOUCHES, rondin, RONDINS, champignons, CHAMPIGNONS,
  roseaux, ROSEAUX, nenuphars, NENUPHARS
};
