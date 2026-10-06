// Les autres plantes refaites au niveau des PNJ, une par une, avec le trait, la lumière et les verts des arbres
// (arbres.js) : le buisson, la bruyère, les fleurs, le cactus, la souche, le rondin. Cadre et ancrage des plantes de deco.js (PROP, centre de la case en (0, 0)) ; le jeu fait
// balancer le dessin entier depuis sa base, il n'y a donc qu'une image.
const { OUT, E, r2 } = require('./troupe');
const { VERTS, fleurette, feuillage, champignon } = require('./arbres');

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

module.exports = { buisson, BUISSONS, bruyere, BRUYERES, fleurs, FLEURS, cactus, CACTUS_LISTE, souche, SOUCHES, rondin, RONDINS };
