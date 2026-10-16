// La première veillée en papier découpé (choix de l'auteur, 16 oct. : « plus naufragé que Teletubbies », une vraie
// histoire, chacun sa personnalité et une vraie pose, les objets aux vraies proportions, sérieux et pro ; l'effet de la
// cinématique de la porte du phare). Le premier soir après l'Hirondelle, au bord de l'île : l'orage monte de la mer ;
// au large, l'îlot et sa tour noire, éteinte ; l'épave, loin à gauche. Le camp tient avec ce que la mer a rendu : une
// voile déchirée tendue entre deux avirons contre le vent, des caisses de l'Hirondelle, un tonneau, des cordages, les
// habits qui sèchent ; le puits, la torche, le feu et la marmite d'Agathe. Chacun s'occupe :
//   - Agathe (Cannelle), assise sur une caisse, touille la soupe ;
//   - Nathan (Rivet), sur une autre, la loupe baissée, examine un rouage sauvé de l'horloge du bord ;
//   - Léo (Ondin), emmitouflé dans une couverture contre le puits, à moitié endormi, regarde la mer ;
//   - Lorena (Aster), debout, surveille le ciel qui tourne ; pour sa réplique sur le phare, elle vise l'îlot à la
//     longue-vue ;
//   - Brume flotte au-dessus d'eux ; l'avatar, assis au premier plan (le jeu le pose), tend les mains au feu.
// Tout est en pièces de papier coupées aux ciseaux (papier.js), chaque plan jette son ombre de papier sur le suivant ;
// les personnages sont ceux du jeu, en tenue de naufragé, éclairés de nuit. Ce qui vit (la flamme, les braises, la
// vapeur, Brume, le bras qui touille, le rouage, la tête de Léo, le linge et la voile au vent, l'éclair) est marqué
// vif : le calque anime de la scène figée (figer.js). Le sujet tient dans la bande x ≈ 108 à 292 (un téléphone en
// hauteur) : la tour, Léo et Lorena y sont.
const { frame } = require('./troupe');
const { assisPieces, dyOf } = require('./assis');
const { CAST } = require('./naufrages');
const { eclairerNuit, lumieresLocales } = require('./eclairage');
const { brumeVive, debut } = require('./rencontre');
const { Defs, vaVient, boucle, hash, f, W } = require('./ouverture');
const { ombrePapier, grain, rugueux, courbe, piece, papiers, spirale, volute, ENCRE } = require('./papier');
const { vif } = require('./figer');
const { touiller, avecMainsTendues } = require('./gestes');

const NAU = Object.fromEntries(CAST.filter(({ base }) => ['Cannelle', 'Rivet', 'Aster', 'Ondin'].includes(base.name)).map(({ base, nau }) => [base.name, nau]));
const NUIT = '#070B1C';
const HORIZON = 156;

// ——— les papiers propres au camp : le sable, la toile de voile, l'herbe de la dune ———
function papiersCamp(pref) {
  const motif = (id, corps, t = 80) => `<pattern id="${pref}${id}" patternUnits="userSpaceOnUse" width="${t}" height="${t}">${corps}</pattern>`;
  const grains = (n, k, c1, c2) => Array.from({ length: n }, (_, i) => `<circle cx="${f(hash(i, k) * 80)}" cy="${f(hash(i, k + 1) * 80)}" r="${f(0.35 + hash(i, k + 2) * 0.8)}" fill="${i % 3 ? c1 : c2}" opacity="${i % 3 ? 0.3 : 0.18}"/>`).join('');
  return `<defs>`
    + motif('sable', grains(60, 101, '#1A120C', '#F2D8B0'))
    + motif('toile', Array.from({ length: 20 }, (_, i) => `<path d="M0,${i * 4} L80,${i * 4 + 0.6}" stroke="#2A2218" stroke-width="0.4" opacity="0.18"/><path d="M${i * 4},0 L${i * 4 + 0.6},80" stroke="#2A2218" stroke-width="0.4" opacity="0.12"/>`).join(''))
    + motif('herbe', Array.from({ length: 30 }, (_, i) => { const x = hash(i, 121) * 80, y = hash(i, 122) * 80, l = 2 + 4 * hash(i, 123); return `<path d="M${f(x)},${f(y)} l${f((hash(i, 124) - 0.5) * 2)},${f(-l)}" stroke="#0A140C" stroke-width="0.6" opacity="0.3"/>`; }).join(''))
    + `</defs>`;
}

// ——— le ciel d'orage : l'indigo en lavis, la lune voilée à gauche, quelques étoiles encore, le front de nuages qui
// monte de la mer par la droite (des pièces de papier en rangs, bordées de clair, leurs volutes) ———
function ciel(D, P) {
  let s = `<rect width="${W}" height="${HORIZON + 4}" fill="${D.lin([[0, '#0A0E26'], [0.55, '#18224A'], [1, '#2E3A62']], 0, 0, 0, HORIZON)}"/><rect width="${W}" height="${HORIZON + 4}" fill="url(#${P}ciel)"/>`;
  for (let i = 0; i < 18; i++) {
    const x = hash(i, 5) * 170, y = 8 + hash(i, 6) * 90;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.4 + hash(i, 7) * 0.8)}" fill="#F4F0E0" opacity="${f(0.3 + 0.5 * hash(i, 8))}"/>`;
  }
  // le front d'orage : de longues bandes de papier (le dessin des nuages de la porte du phare), leur dessus ondulé
  // bordé de la lumière de la lune, leur volute qui s'enroule (elle se dessine dans le calque anime) ; en rangs qui se
  // chevauchent, du plus loin (haut, plus clair) au plus proche (bas, sombre), de plus en plus lourds vers la mer
  const nuage = (x, y, l, h, d, c, i, vive = false) => {
    const pts = [...courbe(t => [x + l * t, y + h - h * (0.5 + 0.5 * Math.sin(Math.PI * t)) * (0.78 + 0.28 * Math.sin(t * 11 + i * 1.7))], 22), [x + l, y + h], [x, y + h]];
    const v = volute(spirale(d > 0 ? x + l - h * 0.6 : x + h * 0.6, y + h * 0.12, h * 0.4, d, 1.8), c[2], 7 + i * 0.7, i * 1.3, 1.6);
    return ombrePapier(piece(D, pts, D.lin([[0, c[0]], [1, c[1]]], 0, y, 0, y + h), { seed: 10 + i, amp: 1.2, bord: c[2], bordN: 23, texture: `${P}ciel` }), 1.6, 2.6, 0.5) + (vive ? vif(v) : '');
  };
  s += nuage(150, 22, 200, 26, 1, ['#3E4A82', '#2A3262', '#A4B0E2'], 0) + nuage(300, 10, 130, 20, -1, ['#46528A', '#2E3868', '#AEBAEA'], 1);
  s += nuage(96, 58, 170, 22, -1, ['#323A6E', '#20284E', '#8692CC'], 2) + nuage(236, 50, 200, 34, 1, ['#2C3466', '#1C2248', '#7E8AC6'], 3);
  s += nuage(170, 96, 250, 30, -1, ['#232A54', '#151B3C', '#6672B0'], 4, true) + nuage(-20, 108, 120, 16, -1, ['#2A3260', '#1A2046', '#707CBA'], 5);
  s += nuage(250, 126, 180, 22, -1, ['#1A2046', '#10142E', '#525E9A'], 6);
  // des volutes de vent dans les nuages (figées : elles se dessinent dans le calque anime)
  return s;
}

// la lune, voilée, à gauche (posée par-dessus la nuit : elle garde son éclat)
const lune = D => `<circle cx="62" cy="44" r="70" fill="${D.rad([[0, '#E4ECFF', 0.32], [0.3, '#B8C8F0', 0.12], [1, '#B8C8F0', 0]], 62, 44, 70)}"/>`
  + piece(D, courbe(t => [62 + 13 * Math.cos(t * Math.PI * 2), 44 + 13 * Math.sin(t * Math.PI * 2)], 18), '#E8EEDC', { seed: 3, amp: 0.5, encre: 1.2 });

// ——— la mer : sombre, ses rangées de vagues de papier ; l'îlot et sa tour noire, éteinte ; l'épave, loin à gauche ———
const ILOT = [268, HORIZON];
function mer(D, P) {
  let s = `<rect y="${HORIZON}" width="${W}" height="70" fill="${D.lin([[0, '#1E2A52'], [1, '#0E1634']], 0, HORIZON, 0, HORIZON + 70)}"/><rect y="${HORIZON}" width="${W}" height="70" fill="url(#${P}mer)"/>`;
  s += `<path d="M0,${HORIZON + 0.6} L400,${HORIZON + 0.6}" stroke="#6A78B0" stroke-width="1" opacity="0.6"/>`;
  // l'épave de l'Hirondelle, couchée sur le flanc, loin à gauche
  const [ex, ey] = [52, HORIZON + 2];
  s += piece(D, [[ex - 26, ey], [ex - 20, ey - 7], [ex + 18, ey - 12], [ex + 28, ey - 5], [ex + 24, ey]], '#141A30', { seed: 41, amp: 0.6, encre: 1 })
    + `<path d="M${ex + 2},${ey - 10} L${ex + 10},${ey - 30} M${ex + 10},${ey - 30} L${ex + 22},${ey - 22}" stroke="#141A30" stroke-width="1.6" stroke-linecap="round"/>`;
  // l'îlot : deux rochers, la tour noire dessus, sa galerie, sa lanterne éteinte ; derrière, un ciel plus pâle sur
  // l'horizon (la lune sur la mer sous l'orage), où sa silhouette se découpe
  const [ix, iy] = ILOT;
  s += `<ellipse cx="${ix}" cy="${iy - 14}" rx="90" ry="34" fill="${D.rad([[0, '#8E9CD0', 0.5], [0.5, '#6A78B0', 0.18], [1, '#6A78B0', 0]], ix, iy - 14, 90)}"/>`;
  s += piece(D, [[ix - 34, iy], [ix - 24, iy - 8], [ix - 10, iy - 12], [ix + 6, iy - 10], [ix + 20, iy - 6], [ix + 36, iy]], '#10142A', { seed: 43, amp: 0.8, encre: 1.1 });
  s += piece(D, [[ix - 5, iy - 10], [ix - 3.6, iy - 40], [ix + 3.6, iy - 40], [ix + 5, iy - 10]], '#0A0C1C', { seed: 44, amp: 0.4, encre: 1 })
    + piece(D, [[ix - 6.4, iy - 40], [ix + 6.4, iy - 40], [ix + 6.4, iy - 42.4], [ix - 6.4, iy - 42.4]], '#0A0C1C', { seed: 45, amp: 0.2, encre: 0.8 })
    + piece(D, [[ix - 3.4, iy - 42.4], [ix - 3.4, iy - 48], [ix, iy - 51], [ix + 3.4, iy - 48], [ix + 3.4, iy - 42.4]], '#161A2E', { seed: 46, amp: 0.2, encre: 0.8 })
    + `<path d="M${ix - 2},${iy - 47} L${ix + 2},${iy - 47}" stroke="#3A4466" stroke-width="0.8"/>`;
  // les rangées de vagues : des feuilles coupées, leurs crêtes claires
  const rangee = (y, a, w, c, i) => {
    const pts = [...courbe(t => { const x = -20 + 440 * t, ph = (x / w) * Math.PI * 2; return [x, y - a * Math.max(0, Math.sin(ph)) * 1.1]; }, 48), [420, y + 30], [-20, y + 30]];
    return piece(D, pts, c[0], { seed: 50 + i, amp: 0.8, bord: c[1], bordN: 49, texture: `${P}mer` });
  };
  s += rangee(HORIZON + 14, 2.4, 34, ['#1C2850', '#5E6CA8'], 0) + rangee(HORIZON + 30, 3.4, 44, ['#162046', '#4E5C98'], 1);
  return s;
}

// ——— la terre : la dune et ses herbes couchées par le vent, puis le sol du camp, sable et herbe rase, piétiné autour
// du feu ———
function terre(D, P, feu) {
  let s = '';
  const dune = [...courbe(t => [-20 + 440 * t, HORIZON + 40 - 10 * Math.sin(t * Math.PI * 1.3 + 0.4) - 4 * Math.sin(t * 17)], 40), [420, 420], [-20, 420]];
  s += ombrePapier(piece(D, dune, D.lin([[0, '#3E3A44'], [1, '#262430']], 0, HORIZON + 30, 0, 260), { seed: 61, amp: 1.4, bord: '#7A7488', bordN: 41, texture: `${P}sable` }), 0, -2.6, 0.5);
  // les touffes d'oyat, longues, couchées vers la gauche (le vent vient de la mer)
  for (let i = 0; i < 22; i++) {
    const x = -6 + i * 20 + hash(i, 63) * 10, y = HORIZON + 40 - 10 * Math.sin((x + 20) / 440 * Math.PI * 1.3 + 0.4) - 4 * Math.sin(((x + 20) / 440) * 17) + 2;
    let t = '';
    for (let k = 0; k < 5; k++) { const h = 10 + 9 * hash(i * 5 + k, 64), pen = 3 + 7 * hash(i * 5 + k, 65), x1 = x + (k - 2) * 1.6; t += `M${f(x1)},${f(y)} Q${f(x1 - pen * 0.2)},${f(y - h * 0.6)} ${f(x1 - pen)},${f(y - h)} `; }
    s += `<path d="${t}" fill="none" stroke="#16161E" stroke-width="1.1" stroke-linecap="round"/>`;
  }
  // le sol du camp
  const sol = [...courbe(t => [-20 + 440 * t, HORIZON + 58 - 6 * Math.sin(t * Math.PI) + 3 * Math.sin(t * 11)], 30), [420, 420], [-20, 420]];
  s += ombrePapier(piece(D, sol, D.lin([[0, '#4A4038'], [0.5, '#3A322E'], [1, '#221E20']], 0, HORIZON + 50, 0, 400), { seed: 62, amp: 1.2, bord: '#8A7A66', bordN: 31, texture: `${P}sable` }), 0, -2.4, 0.55);
  // des plaques d'herbe rase
  for (const [x, y, rx, ry, i] of [[40, 300, 70, 18, 0], [360, 290, 60, 16, 1], [300, 376, 90, 20, 2], [60, 384, 60, 14, 3]]) {
    s += piece(D, courbe(t => [x + rx * Math.cos(t * Math.PI * 2), y + ry * Math.sin(t * Math.PI * 2)], 14), '#2E3A2A', { seed: 70 + i, amp: 2, encre: 0, texture: `${P}herbe` }).replace('stroke-width="0"', 'stroke-width="0" opacity="0.8"');
  }
  // la terre piétinée et la lumière du feu sur le sol
  s += `<ellipse cx="${feu[0]}" cy="${feu[1] + 6}" rx="150" ry="64" fill="${D.rad([[0, '#FFB872', 0.42], [0.35, '#E8884A', 0.2], [1, '#E8884A', 0]], feu[0], feu[1] + 6, 150)}"/>`;
  return s;
}

// ——— le camp : ce que la mer a rendu ———
// une caisse de l'Hirondelle (x, y : le milieu de son pied ; w, h ; l'hirondelle peinte au pochoir), vue de trois quarts
function caisse(D, P, x, y, w, h, i) {
  const p = 0.36 * w; // la profondeur, qui fuit vers le haut à droite
  let s = piece(D, [[x - w / 2, y], [x + w / 2, y], [x + w / 2, y - h], [x - w / 2, y - h]], '#6E5034', { seed: 200 + i, amp: 0.7, texture: `${P}bois`, encre: 1.3 });
  s += piece(D, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2 + p * 0.6, y - h - p * 0.5], [x - w / 2 + p * 0.6, y - h - p * 0.5]], '#8A6844', { seed: 210 + i, amp: 0.5, texture: `${P}bois`, encre: 1.2 });
  s += piece(D, [[x + w / 2, y], [x + w / 2 + p * 0.6, y - p * 0.5], [x + w / 2 + p * 0.6, y - h - p * 0.5], [x + w / 2, y - h]], '#4A3622', { seed: 220 + i, amp: 0.5, texture: `${P}bois`, encre: 1.2 });
  for (const k of [0.33, 0.66]) s += `<path d="M${f(x - w / 2 + 1)},${f(y - h * k)} L${f(x + w / 2 - 1)},${f(y - h * k)}" stroke="#2A1C10" stroke-width="0.8" opacity="0.7"/>`;
  // l'hirondelle, au pochoir, à moitié effacée par l'eau
  const hx = x, hy = y - h * 0.5, k = w / 40;
  s += `<path d="M${f(hx - 9 * k)},${f(hy - 2 * k)} Q${f(hx - 3 * k)},${f(hy - 3 * k)} ${f(hx)},${f(hy + 1 * k)} Q${f(hx + 3 * k)},${f(hy - 3 * k)} ${f(hx + 9 * k)},${f(hy - 2 * k)} Q${f(hx + 4 * k)},${f(hy + 1 * k)} ${f(hx + 1 * k)},${f(hy + 3 * k)} L${f(hx + 3 * k)},${f(hy + 7 * k)} L${f(hx)},${f(hy + 4.6 * k)} L${f(hx - 3 * k)},${f(hy + 7 * k)} L${f(hx - 1 * k)},${f(hy + 3 * k)} Q${f(hx - 4 * k)},${f(hy + 1 * k)} ${f(hx - 9 * k)},${f(hy - 2 * k)} Z" fill="#D8CCB0" opacity="0.55"/>`;
  return ombrePapier(s, 1.4, 1.6, 0.5);
}
// la voile de l'Hirondelle, déchirée, tendue entre deux avirons plantés dans le sable, contre le vent ; des habits
// sèchent sur son bord ; son coin arraché bat au vent (vivant)
function voile(D, P) {
  const av = (x, y0, y1, a) => piece(D, [[x - 1.6, y1], [x + 1.6, y1], [x + 1.6 + a, y0], [x - 1.6 + a, y0]], '#7A5A3A', { seed: 230 + x, amp: 0.3, texture: `${P}bois`, encre: 1.1 })
    + piece(D, [[x - 4 + a, y0], [x + 4 + a, y0], [x + 3 + a, y0 - 16], [x + a, y0 - 19], [x - 3 + a, y0 - 16]], '#8A6A48', { seed: 240 + x, amp: 0.4, texture: `${P}bois`, encre: 1.1 });
  let s = '';
  // les haubans de corde jusqu'aux piquets
  s += `<path d="M30,196 L4,252 M150,190 L178,246" stroke="#2A2218" stroke-width="0.9"/>`;
  s += av(30, 196, 266, -2) + av(150, 190, 262, 2);
  // la toile : ses bords qui pendent, son bas en lambeaux
  const toile = [[30, 200], ...courbe(t => [30 + 120 * t, 200 - 6 * t + 7 * Math.sin(Math.PI * t)], 12), [150, 196], [150, 244], ...courbe(t => [150 - 120 * t, 244 + 6 * Math.sin(t * 19) + (t > 0.55 && t < 0.8 ? 8 : 0)], 24), [30, 250]];
  s += piece(D, toile, D.lin([[0, '#B8AC92'], [0.6, '#8E846E'], [1, '#6A6252']], 30, 196, 150, 250), { seed: 250, amp: 1, texture: `${P}toile`, bord: '#E2D8C0', bordN: 14 });
  s += piece(D, [[70, 212], [92, 211], [93, 226], [71, 227]], '#9A7A5A', { seed: 251, amp: 0.6, texture: `${P}toile`, encre: 0.9 }) + `<path d="M71,212 l2,1.6 M75,211.6 l1.4,1.6 M80,211.4 l1.4,1.6 M85,211.2 l1.4,1.6 M90,211.1 l1.4,1.6" stroke="#2A2218" stroke-width="0.5"/>`;
  s += `<path d="M30,222 Q90,232 150,218" fill="none" stroke="#C8463A" stroke-width="3" opacity="0.55"/>`;
  // le linge qui sèche sur le bord : une chemise (vivante : elle se balance), une paire de chaussettes
  const chemise = vif(`<g>${vaVient('rotate', '-4 54 201', '5 54 201', 2.6)}${piece(D, [[44, 201], [64, 201], [70, 208], [66, 211], [64, 208], [63, 226], [45, 226], [44, 208], [42, 211], [38, 208]], '#C8D4DE', { seed: 260, amp: 0.5, encre: 1 })}</g>`);
  const chaussettes = `<g>${piece(D, [[100, 199], [104, 199], [104, 212], [110, 216], [108, 219], [100, 214]], '#A84E3E', { seed: 261, amp: 0.4, encre: 0.9 })}${piece(D, [[107, 199], [111, 199], [111, 210], [116, 214], [114, 217], [107, 212]], '#8E3E34', { seed: 262, amp: 0.4, encre: 0.9 })}</g>`;
  // le coin arraché qui bat au vent, à gauche (le vent le rabat contre l'aviron)
  const coin = vif(`<g>${vaVient('rotate', '10 30 226', '-8 30 226', 1.4)}${piece(D, [[30, 216], [14, 222], [20, 228], [12, 234], [30, 238]], '#A89C84', { seed: 263, amp: 0.6, texture: `${P}toile`, encre: 1 })}</g>`);
  return ombrePapier(s, 1.6, 2, 0.5) + chemise + chaussettes + coin;
}
// la torche de bois flotté plantée dans le sable : sa flamme de papier (vivante), sa lueur
function torche(D, P, x, y) {
  let s = piece(D, [[x - 2, y], [x + 2, y], [x + 1.6, y - 96], [x - 1.6, y - 96]], '#6A4A30', { seed: 270, amp: 0.4, texture: `${P}bois`, encre: 1.1 });
  s += piece(D, [[x - 5, y - 92], [x + 5, y - 92], [x + 4, y - 104], [x - 4, y - 104]], '#3A2A1E', { seed: 271, amp: 0.5, encre: 1.1 }) + `<path d="M${x - 5},${y - 97} L${x + 5},${y - 99} M${x - 5},${y - 101} L${x + 4},${y - 102}" stroke="#8A7A5A" stroke-width="0.8"/>`;
  const flamme = vif(`<g transform="translate(${x} ${y - 104})"><g>${vaVient('scale', '1 1', '0.86 1.16', 0.7)}${vaVient('skewX', '-8', '8', 1.3)}${piece(D, [[-6, 0], [-5, -8], [-1, -14], [1, -22], [3, -13], [6, -7], [6, 0]], '#F2862E', { seed: 272, amp: 0.6, encre: 1 })}${piece(D, [[-3, 0], [-2.4, -6], [0.6, -13], [2.6, -6], [3, 0]], '#FFD660', { seed: 273, amp: 0.4, encre: 0 })}</g></g>`);
  const lueur = `<circle cx="${x}" cy="${y - 112}" r="70" fill="${D.rad([[0, '#FFC070', 0.4], [0.4, '#FF9A50', 0.14], [1, '#FF9A50', 0]], x, y - 112, 70)}"/>`;
  return lueur + ombrePapier(s, 1.4, 1.6, 0.5) + flamme;
}
// le puits : un cercle de pierres sèches à hauteur de taille, son treuil de bois, le seau pendu
function puits(D, P, x, y) {
  const w = 74, h = 30, e = 10; // largeur, hauteur de la margelle, son ellipse
  let s = '';
  // les montants et le treuil (derrière la margelle)
  s += piece(D, [[x - w / 2 + 6, y - h], [x - w / 2 + 11, y - h], [x - w / 2 + 11, y - h - 50], [x - w / 2 + 6, y - h - 50]], '#6A4C32', { seed: 280, amp: 0.4, texture: `${P}bois`, encre: 1.1 });
  s += piece(D, [[x + w / 2 - 11, y - h], [x + w / 2 - 6, y - h], [x + w / 2 - 6, y - h - 50], [x + w / 2 - 11, y - h - 50]], '#5A3E28', { seed: 281, amp: 0.4, texture: `${P}bois`, encre: 1.1 });
  s += piece(D, [[x - w / 2 + 4, y - h - 46], [x + w / 2 - 4, y - h - 46], [x + w / 2 - 4, y - h - 40], [x - w / 2 + 4, y - h - 40]], '#7A5A3C', { seed: 282, amp: 0.4, texture: `${P}bois`, encre: 1.1 });
  s += `<path d="M${x + w / 2 - 4},${y - h - 43} l8,0 l0,9" fill="none" stroke="#2A2218" stroke-width="1.6" stroke-linecap="round"/>`;
  s += `<path d="M${x - 4},${y - h - 40} L${x - 4},${y - h - 18}" stroke="#2A2218" stroke-width="0.8"/>` + piece(D, [[x - 9, y - h - 18], [x + 1, y - h - 18], [x, y - h - 8], [x - 8, y - h - 8]], '#6E5A44', { seed: 283, amp: 0.4, encre: 1 });
  // la margelle : l'ouverture sombre, puis le mur de pierres
  s += piece(D, courbe(t => [x + (w / 2) * Math.cos(Math.PI + t * Math.PI * 2), y - h + e * Math.sin(Math.PI + t * Math.PI * 2)], 20), '#08090E', { seed: 284, amp: 0.6, encre: 1.2 });
  s += piece(D, [[x - w / 2, y - h], ...courbe(t => [x - w / 2 + w * t, y - h + e * Math.sin(t * Math.PI)], 14), [x + w / 2, y - h], [x + w / 2, y], ...courbe(t => [x + w / 2 - w * t, y + e * Math.sin((1 - t) * Math.PI)], 14), [x - w / 2, y]], D.lin([[0, '#6E6A70'], [1, '#3A3640']], x - w / 2, 0, x + w / 2, 0), { seed: 285, amp: 0.8, texture: `${P}pierre`, encre: 1.3 });
  for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) {
    const u = (k + (r % 2) * 0.5) / 6, xx = x - w / 2 + w * u, yy = y - h + 9 + r * 9 + e * Math.sin(u * Math.PI);
    s += `<path d="M${f(xx)},${f(yy)} l${f(w / 6 - 2)},0 M${f(xx)},${f(yy)} l0,${f(-8)}" stroke="#1A181E" stroke-width="0.8" opacity="0.6"/>`;
  }
  return ombrePapier(s, 1.6, 2, 0.5);
}
// le tonneau, le rouleau de cordage
function tonneau(D, P, x, y) {
  const w = 26, h = 34;
  let s = piece(D, [[x - w / 2, y], [x - w / 2 - 2, y - h / 2], [x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2 + 2, y - h / 2], [x + w / 2, y]], D.lin([[0, '#8A6440'], [1, '#4A321E']], x - w / 2, 0, x + w / 2, 0), { seed: 290, amp: 0.5, texture: `${P}bois`, encre: 1.2 });
  s += piece(D, courbe(t => [x + (w / 2) * Math.cos(t * Math.PI * 2), y - h + 3.4 * Math.sin(t * Math.PI * 2)], 14), '#5A402A', { seed: 291, amp: 0.3, encre: 1 });
  for (const k of [0.2, 0.8]) s += `<path d="M${f(x - w / 2 - 1)},${f(y - h * k)} Q${x},${f(y - h * k + 3)} ${f(x + w / 2 + 1)},${f(y - h * k)}" fill="none" stroke="#2A2A30" stroke-width="2"/>`;
  return ombrePapier(s, 1.4, 1.6, 0.5);
}
function cordage(D, x, y) {
  let s = '';
  for (let k = 0; k < 4; k++) s += `<ellipse cx="${x}" cy="${f(y - k * 2.4)}" rx="${f(18 - k * 2.6)}" ry="${f(6 - k * 0.8)}" fill="none" stroke="#2A2014" stroke-width="3.4"/><ellipse cx="${x}" cy="${f(y - k * 2.4)}" rx="${f(18 - k * 2.6)}" ry="${f(6 - k * 0.8)}" fill="none" stroke="#B89A6A" stroke-width="2"/>`;
  return s + `<path d="M${x + 16},${y + 1} q8,4 18,2" fill="none" stroke="#2A2014" stroke-width="3.4" stroke-linecap="round"/><path d="M${x + 16},${y + 1} q8,4 18,2" fill="none" stroke="#B89A6A" stroke-width="2" stroke-linecap="round"/>`;
}
// le feu : le cercle de pierres, le bois flotté croisé, le trépied de branches et la marmite d'Agathe ; les flammes de
// papier, des braises qui montent, la vapeur de la soupe (vivantes ; la marmite et les pierres de devant passent avec
// elles dans le calque anime, pour rester devant)
function foyer(D, P, [x, y]) {
  let s = '';
  // le trépied et la chaîne (derrière la marmite)
  const sommet = [x + 4, y - 64];
  for (const [bx, by] of [[x - 34, y + 8], [x + 36, y + 6]]) s += piece(D, [[bx - 1.8, by], [bx + 1.8, by], [sommet[0] + 1.2, sommet[1]], [sommet[0] - 1.2, sommet[1]]], '#5A4030', { seed: 300 + bx, amp: 0.4, texture: `${P}bois`, encre: 1 });
  s += `<path d="M${sommet[0]},${sommet[1]} L${sommet[0]},${y - 32}" stroke="#2A2A30" stroke-width="1.2" stroke-dasharray="2 1"/>`;
  // les pierres du cercle, derrière
  const pierre = (a, i) => { const px = x + Math.cos(a) * 30, py = y + Math.sin(a) * 9; return piece(D, courbe(t => [px + 7 * Math.cos(t * Math.PI * 2), py - 2 + 5 * Math.sin(t * Math.PI * 2)], 10), D.lin([[0, '#8E8A94'], [1, '#3A3640']], px, py - 7, px, py + 3), { seed: 310 + i, amp: 0.8, texture: `${P}pierre`, encre: 1.1 }); };
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + 0.2; if (Math.sin(a) < 0) s += pierre(a, i); }
  // les braises au fond, le bois flotté croisé
  s += `<ellipse cx="${x}" cy="${y}" rx="26" ry="7" fill="${D.rad([[0, '#FFD27A', 0.95], [0.6, '#E8662A', 0.7], [1, '#7A2A14', 0.6]], x, y, 26)}"/>`;
  for (const [a, b, c, d] of [[-22, 4, 18, -6], [-18, -5, 22, 3]]) s += piece(D, [[x + a, y + b - 2.4], [x + c, y + d - 2.4], [x + c, y + d + 2.4], [x + a, y + b + 2.4]], '#6A4A30', { seed: 320 + a, amp: 0.4, texture: `${P}bois`, encre: 1.1 });
  // la marmite noire, pendue, sa soupe qui fume
  const m = [x + 4, y - 22];
  const marmite = piece(D, [[m[0] - 15, m[1] - 8], [m[0] + 15, m[1] - 8], [m[0] + 14, m[1] + 4], [m[0] + 8, m[1] + 10], [m[0] - 8, m[1] + 10], [m[0] - 14, m[1] + 4]], D.lin([[0, '#3A3A44'], [1, '#121218']], m[0] - 15, 0, m[0] + 15, 0), { seed: 330, amp: 0.4, encre: 1.3 })
    + piece(D, courbe(t => [m[0] + 15 * Math.cos(t * Math.PI * 2), m[1] - 8 + 3 * Math.sin(t * Math.PI * 2)], 14), '#B8783A', { seed: 331, amp: 0.3, encre: 1 })
    + `<path d="M${m[0] - 15},${m[1] - 8} Q${m[0]},${m[1] - 22} ${m[0] + 15},${m[1] - 8}" fill="none" stroke="#2A2A30" stroke-width="1.2"/>`;
  // les flammes : des langues de papier qui lèchent les flancs de la marmite (vivantes)
  // (une langue de feu : son bord gauche se gonfle puis file vers la pointe, qui se recourbe ; le droit ondule)
  const langue = (h, w, k) => [...courbe(t => [-w * (1 - t) ** 0.8 * (1 + 0.18 * Math.sin(t * 5)) + k * h * 0.12 * t * t, -h * t], 10), ...courbe(t => [w * t ** 0.9 * (1 + 0.12 * Math.sin(t * 9)) + k * h * 0.12 * (1 - t) ** 2, -h * (1 - t)], 10).slice(1)];
  const flamme = (dx, h, w, c, cc, dur, beg, i) => `<g transform="translate(${x + dx} ${y - 2})"><g>${vaVient('scale', '1 1', '0.88 1.14', dur, beg)}${vaVient('skewX', '-7', '7', dur * 1.8, beg)}${piece(D, langue(h, w, i % 2 ? 1 : -1), c, { seed: 340 + i, amp: 0.4, encre: 1 })}${piece(D, langue(h * 0.55, w * 0.5, i % 2 ? 1 : -1), cc, { seed: 345 + i, amp: 0.3, encre: 0 })}</g></g>`;
  const flammes = (flamme(-14, 28, 7, '#E0502A', '#FFB03A', 0.74, 0, 0) + flamme(16, 26, 7, '#E0502A', '#FFB03A', 0.66, 0.3, 1) + flamme(-6, 20, 6, '#F28A2E', '#FFE07A', 0.58, 0.15, 2) + flamme(9, 18, 5, '#F28A2E', '#FFE07A', 0.52, 0.4, 3));
  const braises = ([0, 1].map(i => { const d = 1.6 + i * 0.4, bx = x - 10 + i * 9; return `<circle cx="${bx}" cy="${y - 14}" r="1.2" fill="#FFD27A"><animateTransform attributeName="transform" type="translate" values="0 0;${f(hash(i, 1) * 10 - 5)} -40;${f(hash(i, 2) * 16 - 8)} -80" dur="${d}s" begin="${f(-i * 0.5)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.8;0" dur="${d}s" begin="${f(-i * 0.5)}s" repeatCount="indefinite"/></circle>`; }).join(''));
  const vapeur = (volute(spirale(m[0] + 2, m[1] - 40, 8, 1, 1.6), '#C8CCDA', 4.4, 0, 1.6) + volute(spirale(m[0] - 6, m[1] - 30, 6, -1, 1.4), '#B0B4C8', 3.6, 1.2, 1.4));
  // les pierres de devant
  let devant = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + 0.2; if (Math.sin(a) >= 0) devant += pierre(a, i); }
  // (tout le devant du feu vit ensemble, dans l'ordre : la marmite et les pierres restent devant les flammes)
  return ombrePapier(s, 1, 1.4, 0.45) + vif(flammes + marmite + vapeur + braises + devant);
}
// le rondin sous l'avatar (le jeu pose l'avatar assis dessus)
function rondin(D, P, x, y, k) {
  const w = 17 * k, h = 5.2 * k;
  return ombrePapier(piece(D, [[x - w, y - h], [x + w, y - h], [x + w, y + h], [x - w, y + h]], D.lin([[0, '#8A6440'], [1, '#3A2618']], 0, y - h, 0, y + h), { seed: 350, amp: 0.8, texture: `${P}bois`, encre: 1.3 })
    + piece(D, courbe(t => [x + w + h * 0.55 * Math.cos(t * Math.PI * 2), y + h * Math.sin(t * Math.PI * 2)], 14), '#D8B080', { seed: 351, amp: 0.4, encre: 1.1 }), 1.4, 1.6, 0.5);
}

// ——— les personnages : ceux du jeu, en tenue de naufragé, éclairés de nuit, en marionnettes de papier ———
const BOITE = [-4, -6, 56, 74];
// une pièce éclairée (dans le repère du personnage), son ombre de découpe à l'opposé du feu
function eclaire(corps, id, l, ombre) {
  return corps ? `<use href="#${id}S" color="${NUIT}" opacity="0.4" transform="translate(${ombre[0]} ${ombre[1]})"/>${eclairerNuit(corps, id, BOITE, l)}` : '';
}
// la pose de métier d'un personnage (sa pose « action »), faite assis : ses bras et ce qu'il tient descendent avec ses
// épaules (assis.js : le buste descend de dyOf jusqu'au siège)
const assisMetier = n => function (ctx) {
  const act = this.pose.call(this, { ...ctx, pose: 'action', n, k: n % 2 });
  const dy = dyOf(this), bas = g => (g ? `<g transform="translate(0 ${dy})">${g}</g>` : g);
  return { ...act, left: bas(act.left), right: bas(act.right), over: bas(act.over), under: bas(act.under) };
};
// une marionnette assise : (x, y) ses pieds, s son échelle, m = -1 en miroir ; L les lumières de la scène ; vivants :
// les pièces qui bougent dans le calque anime ('brasG', 'brasD' : elles pivotent à l'épaule, 'tete' : au cou) ;
// entre : un dessin posé entre le corps et la tête (une couverture), dans le repère du personnage
function pantin(c, view, [x, y], s, m, id, L, feu, { geste = null, expr = null, vivants = [], entre = '', i = 0 } = {}) {
  const { l, repere } = lumieresLocales(L, x, y, s, m);
  const p = assisPieces(c, view, 0, expr, geste);
  const d = Math.hypot(x - feu[0], y - feu[1]) || 1, ombre = [f(((x - feu[0]) / d) * 0.8 * m), 0.8];
  const t = 3.2 + i * 0.6;
  const bouge = (nom, corps, pivot, a0, a1, dur) => {
    const lit = eclaire(corps, `${id}${nom}`, l, ombre);
    return vivants.includes(nom) ? vif(`<g>${vaVient('rotate', `${a0} ${f(pivot[0])} ${f(pivot[1])}`, `${a1} ${f(pivot[0])} ${f(pivot[1])}`, dur, i)}${lit}</g>`) : lit;
  };
  const [eg, ed] = p.epaules;
  const tout = eclaire(p.corps, `${id}c`, l, ombre) + bouge('brasG', p.brasG, eg, -4, 3, t * 0.4) + bouge('brasD', p.brasD, ed, 4, -3, t * 0.4)
    + entre + (p.dessus ? eclairerNuit(p.dessus, `${id}o`, BOITE, l) : '') + bouge('tete', p.tete, p.cou, -3, 4, t);
  return `<g transform="${repere}">${tout}</g>`;
}
// debout, d'un seul tenant (sa pose, image n, son expression ; plus : ce qu'il tient, dans son repère)
function debout(c, view, pose, n, [x, y], s, m, id, L, expr, plus = '') {
  const { l, repere } = lumieresLocales(L, x, y, s, m);
  return `<g transform="${repere}"><use href="#${id}S" color="${NUIT}" opacity="0.4" transform="translate(0.8 0.8)"/>${eclairerNuit(frame(c, view, pose, n, expr) + plus, id, BOITE, l)}</g>`;
}
// les habits de l'avatar, recousus par Agathe et pliés : la chemise sur le pantalon, les reprises au fil rouge ; posés
// sur ses mains tendues (repère du personnage debout, de trois quarts : les mains en 7,8 et 21, à 40)
const pileHabits = (D, P) => piece(D, [[6, 41.6], [22, 41.6], [21.4, 37], [6.6, 37]], '#4E6E96', { seed: 370, amp: 0.4, texture: `${P}toile`, encre: 0.8 })
  + piece(D, [[7, 37.4], [21, 37.4], [20, 33.4], [8, 33.4]], '#D8CCB0', { seed: 371, amp: 0.4, texture: `${P}toile`, encre: 0.8 })
  + `<path d="M10,35.4 l1,0.8 l1,-0.8 l1,0.8 l1,-0.8 M15,39.4 l1,0.8 l1,-0.8 l1,0.8" fill="none" stroke="#B8483A" stroke-width="0.5"/>`;
// la couverture de Léo, sur ses épaules (repère du personnage assis de trois quarts)
const couverture = (D, P) => piece(D, [[11, 40], [18, 35.6], [30, 35.6], [36, 41], [37, 56], [32, 60], [16, 60], [10, 55]], D.lin([[0, '#7A5A6E'], [1, '#4A3446']], 0, 36, 0, 60), { seed: 360, amp: 0.6, texture: `${P}toile`, encre: 0.9 })
  + `<path d="M13,46 L35,45 M12,51 L36,50" stroke="#C8B060" stroke-width="0.9" opacity="0.6"/>`;
// Brume au-dessus du groupe : elle flotte, tremble, sa lueur respire (vivante)
function brume(D, [x, y], s) {
  return vif(`<g transform="translate(${x} ${y})"><g>${vaVient('translate', '0 0', '0 -5', 2.8)}<circle cx="0" cy="-12" r="${f(s * 24)}" fill="${D.rad([[0, '#E4F6FF', 0.5], [0.4, '#BFE2F6', 0.18], [1, '#BFE2F6', 0]], 0, -12, s * 24)}">${boucle('opacity', [0.8, 1, 0.85], 3)}</circle>${brumeVive('content', s, 1, [4, 2.2])}</g></g>`);
}

// La scène, selon la variante : 'base' (la veillée), 'longuevue' (la même ; Lorena vise l'îlot à la longue-vue) ou
// 'habits' (plus près : Agathe, debout, tend à l'avatar ses habits recousus ; le feu à gauche ; à deux, avec Brume).
// o.avatar : la place de l'avatar (scenes.json), que le jeu pose
function campVeillee(pref, o) {
  const D = Defs(pref);
  debut(`${pref}b`);
  const P = pref;
  const variante = o.variante || 'base', habits = variante === 'habits';
  const feu = habits ? [64, 334] : [200, 318];
  let s = papiers(pref) + papiersCamp(pref);
  s += ciel(D, P) + mer(D, P) + terre(D, P, feu);
  s += voile(D, P) + (habits ? '' : torche(D, P, 62, 286)) + puits(D, P, 344, 262) + caisse(D, P, 370, 300, 36, 26, 1) + tonneau(D, P, 330, 312);
  if (!habits) s += caisse(D, P, 142, 290, 34, 22, 2) + caisse(D, P, 258, 326, 34, 22, 3);
  // la nuit sur le décor, plus légère près du feu ; la lumière chaude du feu (et de la torche) sur le camp (les
  // personnages ont la leur)
  s += `<rect width="${W}" height="${W}" fill="${D.rad([[0, '#141C44', 0], [0.32, '#141C44', 0.28], [0.7, '#0A1232', 0.5], [1, '#060C26', 0.66]], feu[0], feu[1] - 10, 300)}"/>`;
  s += `<circle cx="${feu[0]}" cy="${feu[1] - 16}" r="170" fill="${D.rad([[0, '#FFB060', 0.34], [0.4, '#F08A40', 0.12], [1, '#F08A40', 0]], feu[0], feu[1] - 16, 170)}"/>`;
  s += lune(D);
  // les lumières des personnages : le feu, la torche ; la lune, froide
  const L = { chauds: [{ x: feu[0], y: feu[1] - 20, portee: habits ? 260 : 200, force: 1 }, ...(habits ? [] : [{ x: 62, y: 180, portee: 110, force: 0.45 }])], froid: { x: 62, y: 44, couleur: '#CFE4FF' } };
  if (habits) {
    // Agathe, debout, tend les habits recousus à l'avatar (à sa gauche) ; le feu à gauche
    s += foyer(D, P, feu);
    s += debout(avecMainsTendues(NAU.Cannelle), 'se', 'action', 0, [286, 384], 2.8, 1, `${pref}ag`, L, 'neutre', pileHabits(D, P));
    s += brume(D, [196, 168], 1.7);
  } else {
    // au fond : Lorena debout, Léo contre le puits
    s += variante === 'longuevue' ? debout(NAU.Aster, 'se', 'action', 1, [212, 262], 1.85, -1, `${pref}lo`, L) : debout(NAU.Aster, 'se', 'repos', 0, [212, 262], 1.85, -1, `${pref}lo`, L, 'neutre');
    s += pantin(NAU.Ondin, 'se', [302, 270], 1.6, -1, `${pref}le`, L, feu, { vivants: ['tete'], entre: couverture(D, P), i: 1 });
    // Nathan sur sa caisse, à gauche ; le feu ; Agathe sur la sienne, à droite, qui touille
    s += pantin(NAU.Rivet, 'front', [142, 290], 1.85, 1, `${pref}na`, L, feu, { geste: assisMetier(0), vivants: ['tete'], i: 2 });
    s += foyer(D, P, feu);
    s += pantin(NAU.Cannelle, 'se', [258, 326], 1.9, 1, `${pref}ag`, L, feu, { geste: touiller, vivants: ['brasG'], i: 3 });
    s += brume(D, [130, 176], 1.7);
  }
  s += cordage(D, 352, 384);
  if (o.avatar && /^assis/.test(o.avatar.pose)) s += rondin(D, P, o.avatar.x, o.avatar.y - 16, o.avatar.echelle);
  s += grain(pref);
  return D.out(s);
}

module.exports = { campVeillee };
