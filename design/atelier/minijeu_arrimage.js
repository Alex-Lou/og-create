// Mini-jeux — l'Arrimage, le « Tetris » de l'île (design/conception/minijeux_grille.md, § 6) : la cale de 8 × 14 cases
// (case 16 × 16, cale 128 × 224), les quatre marchandises dessinées case par case, l'ombre de pose, la marque des
// marchandises fragiles, la marée qui monte, la rangée arrimée. Le jeu compose chaque marchandise avec les cases de sa
// sorte : la case n'a de contour que là où la pièce s'arrête (son masque dit quelles voisines sont de la même pièce).
// Boucles en SMIL, coups en suites d'images, fichiers × 4.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const C = 16;

// ——— les 7 formes (cases occupées dans un carré 4 × 4, orientation de départ) et leur rotation ———
const FORMES = {
  I: [[0, 1], [1, 1], [2, 1], [3, 1]], O: [[1, 0], [2, 0], [1, 1], [2, 1]], T: [[1, 0], [0, 1], [1, 1], [2, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]], Z: [[0, 0], [1, 0], [1, 1], [2, 1]], J: [[0, 0], [0, 1], [1, 1], [2, 1]], L: [[2, 0], [0, 1], [1, 1], [2, 1]]
};
const tourne = (cases, r) => { let c = cases; for (let i = 0; i < r; i++) c = c.map(([x, y]) => [3 - y, x]); const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - mx, y - my]); };

// ——— les quatre marchandises : le dessin d'une case ———
const SORTES = {
  caisse: { nom: 'caisse (bois)', fond: '#C8925A', clair: '#E2B47A', fonce: '#8A5A32' },
  tonneau: { nom: 'tonneau (eau)', fond: '#9A6440', clair: '#C08A5E', fonce: '#5E3A22', cercle: '#A8B0BA' },
  sac: { nom: 'sac (nourriture)', fond: '#E2CC98', clair: '#F4E4B8', fonce: '#B89E68' },
  lest: { nom: 'lest (pierre)', fond: '#A8A298', clair: '#CFCAC0', fonce: '#78726A' }
};
function caseDe(sorte, x, y, voisins) {
  const c = SORTES[sorte], X = x * C, Y = y * C;
  let s = `<rect x="${X}" y="${Y}" width="${C}" height="${C}" fill="${c.fond}"/>`;
  if (sorte === 'caisse') s += `<path d="M${X},${Y + 5.3} L${X + C},${Y + 5.3} M${X},${Y + 10.7} L${X + C},${Y + 10.7}" stroke="${c.fonce}" stroke-width="0.6"/><path d="M${X + 1},${Y + 1.4} L${X + C - 1},${Y + 1.4}" stroke="${c.clair}" stroke-width="0.8"/>` + [[3, 3], [13, 3], [3, 13], [13, 13]].map(([a, b]) => E(X + a, Y + b, 0.6, 0.6, c.fonce)).join('') + `<path d="M${X + 2},${Y + 2} L${X + C - 2},${Y + C - 2}" stroke="${c.fonce}" stroke-width="1.2" opacity=".5"/>`;
  if (sorte === 'tonneau') s += `<rect x="${X + 1.5}" y="${Y + 1}" width="${C - 3}" height="${C - 2}" rx="5" fill="${c.clair}" stroke="${c.fonce}" stroke-width="0.7"/>` + `<path d="M${X + 1.5},${Y + 4.4} L${X + C - 1.5},${Y + 4.4} M${X + 1.5},${Y + 11.6} L${X + C - 1.5},${Y + 11.6}" stroke="${c.cercle}" stroke-width="1.4"/>` + `<path d="M${X + 5.4},${Y + 1.4} L${X + 5.4},${Y + 14.6} M${X + 10.6},${Y + 1.4} L${X + 10.6},${Y + 14.6}" stroke="${c.fonce}" stroke-width="0.5" opacity=".6"/>` + E(X + 4, Y + 7.6, 0.9, 1.6, WHITE).replace('/>', ' opacity=".35"/>');
  if (sorte === 'sac') s += `<path d="M${X + 1.5},${Y + 3} Q${X + 8},${Y - 0.6} ${X + C - 1.5},${Y + 3} Q${X + C + 0.6},${Y + 8} ${X + C - 1.5},${Y + 13} Q${X + 8},${Y + C + 0.6} ${X + 1.5},${Y + 13} Q${X - 0.6},${Y + 8} ${X + 1.5},${Y + 3} Z" fill="${c.clair}" stroke="${c.fonce}" stroke-width="0.6"/>` + `<path d="M${X + 4},${Y + 5} l1,1 M${X + 9},${Y + 9} l1,1 M${X + 6},${Y + 11} l1,-1 M${X + 11},${Y + 4} l-1,1" stroke="${c.fonce}" stroke-width="0.5"/>` + E(X + 5, Y + 5.4, 1.6, 1, WHITE).replace('/>', ' opacity=".35"/>');
  if (sorte === 'lest') s += `<path d="M${X + 1},${Y + 1} L${X + C - 1},${Y + 1} L${X + C - 1},${Y + C - 1} L${X + 1},${Y + C - 1} Z" fill="${c.fond}" stroke="${c.fonce}" stroke-width="0.6"/>` + `<path d="M${X + 3},${Y + 6} Q${X + 7},${Y + 4} ${X + 12},${Y + 7} M${X + 4},${Y + 11} Q${X + 8},${Y + 13} ${X + 13},${Y + 10.6}" fill="none" stroke="${c.fonce}" stroke-width="0.6" opacity=".7"/>` + `<path d="M${X + 2},${Y + 2.4} L${X + 9},${Y + 2.4}" stroke="${c.clair}" stroke-width="1" stroke-linecap="round"/>`;
  // le contour : seulement là où la pièce s'arrête
  const [h, d, b, g] = voisins;
  let o = '';
  if (!h) o += `M${X},${Y} L${X + C},${Y} `; if (!d) o += `M${X + C},${Y} L${X + C},${Y + C} `; if (!b) o += `M${X},${Y + C} L${X + C},${Y + C} `; if (!g) o += `M${X},${Y} L${X},${Y + C} `;
  return s + (o ? `<path d="${o}" fill="none" stroke="${OUT}" stroke-width="1.2" stroke-linecap="square"/>` : '');
}
// la marque d'une marchandise fragile (verre, œufs), sur une de ses cases
const marqueFragile = () => `<g transform="translate(8 8)">${P('M-4,-2 L4,-2 L4,2 L-4,2 Z', '#E8504A', 0.6)}<path d="M-1,-1 L0,0.6 L1,-1" fill="none" stroke="${WHITE}" stroke-width="0.6"/></g>`;
// une marchandise : forme, rotation, sorte, position (en cases)
function marchandise(forme, r, sorte, px = 0, py = 0, fragile = false) {
  const cases = tourne(FORMES[forme], r), has = (x, y) => cases.some(([a, b]) => a === x && b === y);
  let s = cases.map(([x, y]) => caseDe(sorte, px + x, py + y, [has(x, y - 1), has(x + 1, y), has(x, y + 1), has(x - 1, y)])).join('');
  if (fragile) { const [x, y] = cases[1]; s += `<g transform="translate(${(px + x) * C} ${(py + y) * C})">${marqueFragile()}</g>`; }
  return s;
}
// l'ombre de pose : une case en pointillé ; ombre() en trace une par case de la pièce, là où elle tombera
const ombreCase = (x = 0, y = 0) => `<rect x="${x * C + 1}" y="${y * C + 1}" width="${C - 2}" height="${C - 2}" rx="2" fill="#FFFFFF" fill-opacity=".12" stroke="#FFFFFF" stroke-width="0.8" stroke-dasharray="2 1.4" opacity=".8"/>`;
const ombre = (forme, r, px, py) => tourne(FORMES[forme], r).map(([x, y]) => ombreCase(px + x, py + y)).join('');

// ——— la cale (8 × 14 cases) : bordage, membrures, la lanterne qui balance (SMIL), l'eau de cale ———
function cale(anim = true) {
  let s = `<defs><linearGradient id="calefond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E3E26"/><stop offset="1" stop-color="#3E2818"/></linearGradient></defs><rect x="0" y="0" width="128" height="224" fill="url(#calefond)"/>`;
  for (let y = 0; y < 224; y += 9) s += `<path d="M0,${y} L128,${y}" stroke="#2E1E12" stroke-width="0.6" opacity=".7"/><path d="M0,${y + 1} L128,${y + 1}" stroke="#7A5A3A" stroke-width="0.4" opacity=".4"/>`;
  for (const x of [0, 64, 128]) s += `<rect x="${x - 3}" y="0" width="6" height="224" fill="#4A3020" opacity=".55"/>`;
  for (let y = 18; y < 224; y += 36) for (const x of [32, 96]) s += E(x, y, 0.9, 0.9, '#2E1E12');
  // la lanterne, au crochet, qui balance ; sa lumière chaude
  const lant = `<g>${anim ? '<animateTransform attributeName="transform" type="rotate" values="-6 64 0;6 64 0;-6 64 0" dur="3s" repeatCount="indefinite"/>' : ''}<path d="M64,0 L64,8" stroke="${OUT}" stroke-width="0.8"/><circle cx="64" cy="20" r="26" fill="#FFD27A" opacity=".12"/>${P('M60,8 L68,8 L69,10 L59,10 Z', '#5A5A5A', 0.6)}${P('M59.4,10 L68.6,10 L67.6,19 L60.4,19 Z', '#FFE8A8', 0.7)}${E(64, 14.6, 1.6, 2.6, '#FFB040')}${P('M59,19 L69,19 L68,21 L60,21 Z', '#5A5A5A', 0.6)}</g>`;
  s += lant;
  return s;
}
// la marée (calque posé par-dessus les marchandises) : l'eau de cale monte (niveau de 0 à 1), ses vaguelettes défilent
function maree(niveau, anim = true) {
  const h = 8 + niveau * 64;
  return `<rect x="0" y="${224 - h}" width="128" height="${h}" fill="#3A8AC0" opacity=".38"/><g>${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;-16 0" dur="1.6s" repeatCount="indefinite"/>' : ''}<path d="M0,${224 - h} q8,-2.4 16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0 t16,0" fill="none" stroke="#BFE8FA" stroke-width="1.2" opacity=".85"/></g>`;
}
// la rangée arrimée (4 images, cadre 128 × 16), posée par-dessus la rangée : deux cordes se serrent, un éclat ; à la
// dernière image, le jeu retire la rangée et les étoiles filent
function arrime(k) {
  if (k === 0) return `<path d="M-2,3 Q64,7 130,3 M-2,13 Q64,9 130,13" fill="none" stroke="#E8D8B0" stroke-width="1.4" stroke-dasharray="2 1"/>`;
  if (k === 1) return `<path d="M0,4 L128,4 M0,12 L128,12" stroke="#E8D8B0" stroke-width="1.8"/>` + `<rect x="0" y="0" width="128" height="16" fill="#FFF6C8" opacity=".35"/>`;
  if (k === 2) return `<rect x="0" y="0" width="128" height="16" fill="#FFF6C8" opacity=".75"/>` + [8, 40, 72, 104].map(x => `<path d="M${x},8 l2,-5 l2,5 l5,2 l-5,2 l-2,5 l-2,-5 l-5,-2 Z" fill="#FFFBE8"/>`).join('');
  return [12, 44, 76, 108].map((x, i) => `<g transform="translate(${x + i * 3} ${-4 - i})" opacity=".6"><path d="M0,8 l2,-4 l2,4 l4,2 l-4,2 l-2,4 l-2,-4 l-4,-2 Z" fill="#FFE07A"/></g>`).join('');
}


// ——— les pièces : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const CASE = [0, 0, 16, 16];
piece('cale', 'La cale (8 × 14 cases ; la lanterne balance, en boucle)', [0, 0, 128, 224], () => cale());
// masque des voisines de la même pièce : haut 1, droite 2, bas 4, gauche 8
for (const k of Object.keys(SORTES)) for (let m = 0; m < 16; m++) piece(`case-${k}_${m}`, `Une case de ${SORTES[k].nom}, voisines ${m}`, CASE, () => caseDe(k, 0, 0, [m & 1, m & 2, m & 4, m & 8]));
piece('ombre', 'L\'ombre de pose (une case)', CASE, () => ombreCase());
piece('fragile', 'La marque d\'une marchandise fragile (par-dessus une case)', CASE, marqueFragile);
for (let n = 0; n < 10; n++) piece(`maree_${n}`, `La marée, cran ${n} (par-dessus la cale ; les vaguelettes défilent, en boucle)`, [0, 0, 128, 224], () => maree(n / 9));
for (let k = 0; k < 4; k++) piece(`arrime_${k + 1}`, 'La rangée arrimée (par-dessus la rangée)', [0, 0, 128, 16], () => arrime(k), 'arrime', 140);

const TITRE = 'L\'Arrimage (la cale du bateau)', FOND = '#3E2818';
const LISEZ_MOI = 'L\'Arrimage : une case a un cadre de 16 × 16, la cale 128 × 224 (8 × 14 cases). Une marchandise se compose de 4 cases de sa sorte (caisse, tonneau, sac, lest) : case-<sorte>_<masque>, où le masque dit quelles voisines sont de la même pièce (haut 1, droite 2, bas 4, gauche 8) ; la case n\'a de contour que là où la pièce s\'arrête. Par-dessus les cases : l\'ombre de pose, la marque fragile. La marée (10 crans) se pose par-dessus la cale et les marchandises. La rangée arrimée (128 × 16) se pose par-dessus la rangée ; le jeu la retire à la dernière image.';
module.exports = { FORMES, SORTES, PIECES, TITRE, FOND, LISEZ_MOI, tourne, caseDe, marchandise, marqueFragile, ombreCase, ombre, cale, maree, arrime };
