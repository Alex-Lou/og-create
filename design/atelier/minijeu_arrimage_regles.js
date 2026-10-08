// Mini-jeux — l'Arrimage, les pièces des règles (design/conception/minijeux_grille.md, § 6) : trois nouvelles
// marchandises (planches, filet, coffre long), le quai à 3 places, le manifeste du jour et ses icônes, la jauge de gîte,
// les sangles d'une rangée pleine. Mêmes règles que l'Arrimage : case 16 × 16, boucles en SMIL, coups en suites
// d'images, fichiers × 4. Chaque pièce porte ses propres dégradés (ids préfixés).
const A = require('./minijeu_arrimage');
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const L = (d, c, w, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;
const C = 16;

// ——— les trois nouvelles marchandises : une case (16 × 16) ; le contour seulement là où la pièce s'arrête ———
const NOUVELLES = {
  planches: { nom: 'planches (bois)', clair: '#F2D29A', fond: '#DDB074', fonce: '#A8784A' },
  filet: { nom: 'filet (nourriture)', clair: '#CFE8D8', fond: '#9CC8B0', fonce: '#5E8A76' },
  coffre: { nom: 'coffre long (bois)', clair: '#B87A52', fond: '#8A5434', fonce: '#5A3420' }
};
function caseNeuve(sorte, voisins, p = `n${sorte}`) {
  const c = NOUVELLES[sorte];
  let s = `<defs>${lin(p, [[0, c.clair], [0.55, c.fond], [1, c.fonce]])}</defs><rect x="0" y="0" width="${C}" height="${C}" fill="url(#${p})"/>`;
  if (sorte === 'planches') {
    // trois planches couchées, leurs veines, deux clous à chaque bout ouvert
    s += [5.3, 10.7].map(y => L(`M0,${y} L16,${y}`, c.fonce, 0.7)).join('') + [2.6, 8, 13.4].map(y => L(`M1,${y} q4,-0.8 7,0 t7,0`, c.fonce, 0.35, ' opacity=".6"')).join('');
    s += L('M0.6,1.2 L15.4,1.2', '#FFF2D0', 0.7, ' opacity=".8"');
    if (!voisins[3]) s += [2.6, 8, 13.4].map(y => E(2, y, 0.55, 0.55, '#6A6A72')).join('');
    if (!voisins[1]) s += [2.6, 8, 13.4].map(y => E(14, y, 0.55, 0.55, '#6A6A72')).join('');
  }
  if (sorte === 'filet') {
    // un filet de corde tendu sur un ballot vert d'eau, des flotteurs de liège aux bords
    s += `<defs><clipPath id="${p}c"><rect x="0" y="0" width="16" height="16"/></clipPath></defs><g clip-path="url(#${p}c)">` + [-8, -2, 4, 10, 16].map(x => L(`M${x},0 L${x + 16},16 M${x + 16},0 L${x},16`, '#E8DCC0', 0.8)).join('') + [-8, -2, 4, 10, 16].map(x => L(`M${x},0 L${x + 16},16`, c.fonce, 0.3, ' opacity=".6"')).join('') + '</g>';
    s += [[4, 4], [12, 4], [8, 8], [4, 12], [12, 12]].map(([x, y]) => E(x, y, 0.7, 0.7, '#C8B080', 0.3)).join('');
    if (!voisins[0]) s += E(8, 1.6, 2, 1.2, '#E8A84A', 0.5) + E(7.4, 1.2, 0.6, 0.35, WHITE);
  }
  if (sorte === 'coffre') {
    // du bois sombre, une bande de laiton riveté au milieu, un reflet
    s += `<defs>${lin(p + 'l', [[0, '#FFE8A0'], [0.5, '#E2B44E'], [1, '#A8782A']])}</defs>` + `<rect x="0" y="6.2" width="16" height="3.6" fill="url(#${p}l)"/>` + L('M0,6.2 L16,6.2 M0,9.8 L16,9.8', OUT, 0.5, ' opacity=".6"') + L('M0,6.9 L16,6.9', '#FFF2C4', 0.5, ' opacity=".8"');
    s += [4, 12].map(x => E(x, 8, 0.7, 0.7, '#FFF2C4', 0.3)).join('') + L('M1,2.4 L15,2.4 M1,13.6 L15,13.6', c.fonce, 0.5, ' opacity=".7"') + L('M1.2,1 L8,1', '#D89A70', 0.8, ' opacity=".8"');
  }
  const [h, d, b, g] = voisins;
  let o = '';
  if (!h) o += 'M0,0 L16,0 '; if (!d) o += 'M16,0 L16,16 '; if (!b) o += 'M0,16 L16,16 '; if (!g) o += 'M0,0 L0,16 ';
  return s + (o ? `<path d="${o}" fill="none" stroke="${OUT}" stroke-width="1.2" stroke-linecap="square"/>` : '');
}

// ——— le quai (128 × 40) : un ponton de planches au-dessus de la cale, trois palettes où attendent les marchandises ———
// la place choisie (40 × 40) : un liseré doré qui pulse autour de la palette (SMIL)
const PLACES = [8, 44, 80]; // le bord gauche de chaque palette (36 de large)
function quai() {
  const p = 'qa';
  let s = `<defs>${lin(p + 'p', [[0, '#C8925A'], [1, '#8A5A32']])}${lin(p + 'b', [[0, '#E8C08A'], [1, '#B8864E']])}${lin(p + 'e', [[0, '#5EB0D8'], [1, '#2E7AA8']])}</defs>`;
  s += `<rect x="0" y="30" width="128" height="10" fill="url(#${p}e)"/>` + L('M0,33 q8,-2 16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0', '#BFE8FA', 0.9, ' opacity=".8"');
  // les pieux et le plancher
  s += [6, 42, 78, 114].map(x => P(`M${x},24 L${x + 6},24 L${x + 6},38 Q${x + 3},39.4 ${x},38 Z`, '#7A4A2A', 0.9)).join('');
  s += P('M1,8 Q1,6 3,6 L125,6 Q127,6 127,8 L127,26 Q127,28 125,28 L3,28 Q1,28 1,26 Z', `url(#${p}p)`, 1.2);
  s += [12.6, 19.4].map(y => L(`M2,${y} L126,${y}`, '#6A4224', 0.7)).join('') + [30, 64, 98].map(x => L(`M${x},7 L${x},27`, '#6A4224', 0.6, ' opacity=".7"')).join('') + L('M3,7.4 L125,7.4', '#E8C08A', 0.9, ' opacity=".8"');
  s += [[4, 9], [124, 9], [4, 25], [124, 25]].map(([x, y]) => E(x, y, 0.7, 0.7, '#A8B0BA', 0.3)).join('');
  // trois palettes, un numéro gravé en points (1, 2, 3) pour que l'ordre se lise sans texte
  PLACES.forEach((x, i) => {
    s += P(`M${x},4 L${x + 36},4 L${x + 36},26 L${x},26 Z`, `url(#${p}b)`, 0.9) + [10, 17].map(y => L(`M${x + 1},${y + 4} L${x + 35},${y + 4}`, '#A8784A', 0.6)).join('') + L(`M${x + 1},5.4 L${x + 35},5.4`, '#FFF2D0', 0.7, ' opacity=".8"');
    s += [...Array(i + 1).keys()].map(j => E(x + 33 - j * 2.4, 23.4, 0.7, 0.7, '#8A5A32')).join('');
  });
  // une bitte d'amarrage et un rouleau de corde au bout du quai
  s += P('M119,0.6 L125,0.6 L125,6 L119,6 Z', '#5A5A62', 0.8) + E(122, 0.8, 3.4, 1.2, '#7A7A84', 0.7);
  return s;
}
function quaiChoisie(anim = true) {
  return `<rect x="1" y="1" width="38" height="26" rx="3" fill="none" stroke="#FFD24A" stroke-width="2">${anim ? '<animate attributeName="stroke-opacity" values="1;.35;1" dur="0.8s" repeatCount="indefinite"/>' : ''}</rect><rect x="1" y="1" width="38" height="26" rx="3" fill="none" stroke="#FFFBE8" stroke-width="0.7"/>` + etoile(37, 2, 2.4) + etoile(3, 26, 1.8);
}

// ——— le manifeste du jour (56 × 80) : un parchemin cacheté, six lignes ; sur chaque ligne le jeu pose une icône
// (10 × 10, en x = 6, y = 13 + 10 × i) et écrit le compte ; une coche (10 × 10, en x = 42) quand la ligne est chargée ———
function manifeste() {
  const p = 'mf';
  let s = `<defs>${rad(p, [[0, '#FFF8E6'], [0.7, '#F4E8C8'], [1, '#E2D0A4']], 0.5, 0.4, 0.8)}${lin(p + 'r', [[0, '#C8925A'], [1, '#8A5A32']])}</defs>`;
  s += P('M4,6 L52,6 L52,74 Q46,77 40,74 Q34,71 28,74 Q22,77 16,74 Q10,71 4,74 Z', `url(#${p})`, 1);
  s += `<rect x="1" y="2" width="54" height="7" rx="3.5" fill="url(#${p}r)"${st(1)}/>` + L('M3,3.6 L53,3.6', '#E8C08A', 0.8, ' opacity=".8"');
  s += [...Array(6).keys()].map(i => L(`M6,${f(23.5 + i * 10)} L50,${f(23.5 + i * 10)}`, '#D8C49A', 0.5, ' stroke-dasharray="1.4 1.2"')).join('');
  // le cachet de cire, avec l'hirondelle d'Aster en creux
  s += E(44, 66, 5, 5, '#C8402E', 0.8) + E(44, 66, 3.4, 3.4, '#E2604A') + L('M41.6,66.6 Q43,64.6 44.4,66 Q45.6,64.2 47,65.4', '#8A2A1E', 0.8) + E(42.6, 64.4, 0.9, 0.6, WHITE).replace('/>', ' opacity=".6"/>');
  return s;
}
// une icône du manifeste (10 × 10) : la marchandise en petit, sur une case
function icone(sorte) {
  if (NOUVELLES[sorte]) return `<g transform="translate(0.6 0.6) scale(0.55)">${caseNeuve(sorte, [0, 0, 0, 0], `ic${sorte}`)}</g>`;
  return `<g transform="translate(0.6 0.6) scale(0.55)">${A.caseDe(sorte, 0, 0, [0, 0, 0, 0])}</g>`;
}
const coche = () => L('M1.2,5.4 L3.8,8 L8.8,2.2', OUT, 2.4) + L('M1.2,5.4 L3.8,8 L8.8,2.2', '#5FA548', 1.3);

// ——— la jauge de gîte (64 × 36) : un arc peint (vert au milieu, ambre puis rouge vers les bords), un petit bateau au
// centre ; l'aiguille (64 × 36) tourne autour de (32, 30) : le jeu la tourne de −45° à +45° ———
function gite() {
  const p = 'gi';
  const arc = (a0, a1, r) => { const x0 = 32 + r * Math.cos(a0), y0 = 30 + r * Math.sin(a0), x1 = 32 + r * Math.cos(a1), y1 = 30 + r * Math.sin(a1); return `M${f(x0)},${f(y0)} A${r},${r} 0 0 1 ${f(x1)},${f(y1)}`; };
  const deg = d => (d - 90) * Math.PI / 180;
  let s = `<defs>${lin(p + 'b', [[0, '#C8925A'], [1, '#8A5A32']])}${rad(p + 'f', [[0, '#FFF8E6'], [1, '#F2E2C0']], 0.5, 0.9, 0.9)}</defs>`;
  s += P('M3,31 A29,29 0 0 1 61,31 L61,34 Q61,35 60,35 L4,35 Q3,35 3,34 Z', `url(#${p}b)`, 1.1) + P('M7,31 A25,25 0 0 1 57,31 Z', `url(#${p}f)`, 0.8);
  for (const [a0, a1, c] of [[-60, -35, '#E8604A'], [-35, -15, '#F2B84A'], [-15, 15, '#7EC25A'], [15, 35, '#F2B84A'], [35, 60, '#E8604A']]) s += L(arc(deg(a0), deg(a1), 21), c, 3.4);
  for (let d = -60; d <= 60; d += 15) s += L(`M${f(32 + 17.6 * Math.cos(deg(d)))},${f(30 + 17.6 * Math.sin(deg(d)))} L${f(32 + 15.4 * Math.cos(deg(d)))},${f(30 + 15.4 * Math.sin(deg(d)))}`, '#8A6A40', d % 30 ? 0.5 : 0.9);
  // le petit bateau au pied de l'aiguille
  s += P('M25,30 L39,30 Q38,34 32,34.4 Q26,34 25,30 Z', '#9A6440', 0.7) + L('M32,30 L32,24.6', '#7A4A2A', 0.8) + P('M32.6,24.8 Q36.4,27 35.6,29.4 L32.6,29.4 Z', '#F4EBD2', 0.5);
  return s;
}
const giteAiguille = () => P('M31,30 L32,12 L33,30 Z', '#3C2819', 0.4) + L('M32,13 L32,26', '#E8604A', 0.7) + E(32, 30, 2.2, 2.2, '#E2B44E', 0.7) + E(31.4, 29.4, 0.6, 0.6, WHITE);

// ——— les sangles d'une rangée pleine (128 × 16, par-dessus la rangée) : elles se tendent (3 images), puis restent
// (la rangée sanglée, figée) ———
function sangle(x, k, p) {
  // une sangle de toile verticale qui serre la rangée, sa boucle de laiton au milieu
  const tension = [0.6, 1, 1][k];
  return `<g transform="translate(${x} 8) scale(1 ${tension}) translate(0 -8)">${P('M-2.2,-1 L2.2,-1 L2.2,17 L-2.2,17 Z', `url(#${p}t)`, 0.7)}${L('M-1.2,-0.6 L-1.2,16.6', '#FFF2D0', 0.5, ' opacity=".7"')}</g>` + P(`M${x - 3},5.4 L${x + 3},5.4 L${x + 3},10.6 L${x - 3},10.6 Z`, `url(#${p}l)`, 0.7) + `<rect x="${x - 1.6}" y="6.8" width="3.2" height="2.4" fill="#5A3420"/>`;
}
function sanglage(k) {
  const p = `sg${k}`;
  let s = `<defs>${lin(p + 't', [[0, '#E8D8B0'], [1, '#C8B080']], 1, 0)}${lin(p + 'l', [[0, '#FFE8A0'], [0.5, '#E2B44E'], [1, '#A8782A']])}</defs>`;
  if (k < 2) s += `<rect x="0" y="0" width="128" height="16" fill="#FFF6C8" opacity="${[0.15, 0.35][k]}"/>`;
  s += [16, 48, 80, 112].map(x => sangle(x, Math.min(k, 2), p)).join('');
  if (k === 1) s += [[32, 4], [96, 12], [64, 3]].map(([x, y]) => etoile(x, y, 2.6)).join('');
  if (k === 2) s += [8, 40, 72, 104].map(x => L(`M${x},1.6 L${x + 16},1.6`, '#FFFBE8', 0.9, ' opacity=".6"')).join('');
  return s;
}

// ——— les pièces ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const CASE = [0, 0, 16, 16];
for (const k of Object.keys(NOUVELLES)) for (let m = 0; m < 16; m++) piece(`case-${k}_${m}`, `Une case de ${NOUVELLES[k].nom}, voisines ${m}`, CASE, () => caseNeuve(k, [m & 1, m & 2, m & 4, m & 8], `n${k}${m}`));
piece('quai', 'Le quai et ses trois palettes', [0, 0, 128, 40], quai);
piece('quai-choisie', 'La palette choisie (le liseré pulse, en boucle)', [0, 0, 40, 28], () => quaiChoisie());
piece('manifeste', 'Le manifeste du jour (six lignes)', [0, 0, 56, 80], manifeste);
for (const k of [...Object.keys(A.SORTES), ...Object.keys(NOUVELLES)]) piece(`icone-${k}`, `L'icône du manifeste : ${(A.SORTES[k] || NOUVELLES[k]).nom}`, [0, 0, 10, 10], () => icone(k));
piece('coche', 'La coche d\'une ligne chargée', [0, 0, 10, 10], coche);
piece('gite', 'La jauge de gîte', [0, 0, 64, 36], gite);
piece('gite-aiguille', 'L\'aiguille de la jauge (le jeu la tourne autour de 32, 30)', [0, 0, 64, 36], giteAiguille);
for (let k = 0; k < 2; k++) piece(`sanglage_${k + 1}`, 'Les sangles qui se tendent (par-dessus la rangée)', [0, 0, 128, 16], () => sanglage(k), 'sanglage', 140);
piece('sanglee', 'La rangée sanglée (reste par-dessus la rangée figée)', [0, 0, 128, 16], () => sanglage(2));

const LISEZ_MOI = 'Les règles (design/conception/minijeux_grille.md, § 6) : trois nouvelles marchandises, case-<sorte>_<masque> comme les autres (planches, filet, coffre). Le quai (128 × 40) se pose au-dessus de la cale ; les palettes commencent en x = 8, 44, 80 (36 de large) ; la palette choisie (40 × 28) se pose en x − 2, y 0. Le manifeste (56 × 80) : sur la ligne i, l\'icône (10 × 10) en x = 6, y = 13 + 10 × i, le compte écrit par le jeu à droite, la coche (10 × 10) en x = 42. La jauge de gîte (64 × 36) et son aiguille (même cadre), que le jeu tourne autour de (32, 30). Les sangles (128 × 16) se posent sur la rangée pleine : deux images, puis la rangée sanglée qui reste. La suivante et la mise de côté ne servent plus avec ces règles.';
module.exports = { NOUVELLES, PLACES, PIECES, LISEZ_MOI, caseNeuve, quai, quaiChoisie, manifeste, icone, coche, gite, giteAiguille, sanglage };
