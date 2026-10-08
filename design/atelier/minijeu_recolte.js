// Mini-jeux — la Récolte (le plateau 6 × 6 de l'île) : on relie au doigt des tuiles identiques voisines. Tuile 32 × 32.
// Le jeu les pose en DOM : les boucles sont animées en SMIL (la tuile au repos respire, la tuile choisie pulse) ; ce qui
// arrive une fois (la tuile cueillie, la tuile qui atterrit, l'éclat d'une longue chaîne) est en suites d'images. Les
// sortes gardent les noms du jeu (stone, wood, water, food, fish). Fichiers × 4.
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;

// ——— les cinq sortes : le fond de la tuile, l'objet dessus ———
const SORTES = {
  stone: { nom: 'pierre', fond: ['#E4E0D8', '#C8C2B6'], lueur: '#FFFFFF' },
  wood: { nom: 'bois', fond: ['#F2DEC0', '#DDBE92'], lueur: '#FFE8C0' },
  water: { nom: 'eau', fond: ['#D8EEFA', '#AED6EE'], lueur: '#E8F8FF' },
  food: { nom: 'nourriture', fond: ['#F4EAC0', '#E2CE8A'], lueur: '#FFF4C8' },
  fish: { nom: 'poisson', fond: ['#D4EEF0', '#A8D8DC'], lueur: '#E8FCFF' }
};
const CARRE = 'M6,2.5 L26,2.5 Q29.5,2.5 29.5,6 L29.5,26 Q29.5,29.5 26,29.5 L6,29.5 Q2.5,29.5 2.5,26 L2.5,6 Q2.5,2.5 6,2.5 Z';
const fond = (k, id) => { const c = SORTES[k]; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.fond[0]}"/><stop offset="1" stop-color="${c.fond[1]}"/></linearGradient></defs><path d="${CARRE}" fill="url(#${id})"${st(1)}/><path d="M6.4,4.4 L25.6,4.4" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/><path d="M5,27.6 L27,27.6" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round" opacity=".15"/>`; };
function objet(k) {
  switch (k) {
    case 'stone': // un petit tas de trois pierres
      return E(16, 25, 10, 2, 'rgba(60,40,20,.15)') + P('M7,24 Q6,17 11,16 Q15,15.6 16.4,19.6 Q17,24.6 12,25 Q8,25.2 7,24 Z', '#A8A298', 1) + P('M15,24.6 Q14.4,17 20,16 Q25.6,15.6 25.6,21 Q25.4,25 20,25.2 Q16,25.2 15,24.6 Z', '#BDB7AC', 1) + P('M10.6,16.6 Q11,9.6 16.4,9.4 Q21.4,9.6 21,15.6 Q20,18.4 15.6,18.2 Q11,18 10.6,16.6 Z', '#CFCAC0', 1) + `<path d="M13,12 Q15,10.6 17,11" fill="none" stroke="${WHITE}" stroke-width="1" stroke-linecap="round" opacity=".8"/>` + E(19, 20, 0.6, 0.4, '#8E887E') + E(10, 20, 0.6, 0.4, '#8E887E');
    case 'wood': // deux bûches et une feuille
      return E(16, 25.4, 10, 2, 'rgba(60,40,20,.15)') + [[16, 21.6], [16, 14.6]].map(([x, y], i) => `<g transform="rotate(${i ? -8 : 6} ${x} ${y})">${P(`M${x - 9},${y - 3} L${x + 7},${y - 3} L${x + 7},${y + 3} L${x - 9},${y + 3} Z`, '#B07A4A', 1)}<path d="M${x - 7},${y - 1} L${x + 5},${y - 1} M${x - 6},${y + 1.2} L${x + 4},${y + 1.2}" stroke="#8A5A32" stroke-width="0.5"/>${E(x + 7, y, 2.4, 3, '#E8C890', 1)}${E(x + 7, y, 1.2, 1.6, 'none').replace('fill="none"', 'fill="none" stroke="#B88A50" stroke-width="0.5"')}</g>`).join('') + `<g transform="translate(9 10) rotate(-30)">${P('M0,3 Q-2.6,-1 0,-4.4 Q2.6,-1 0,3 Z', '#7EC25A', 0.8)}</g>`;
    case 'water': // une grosse goutte chibi
      return E(16, 26, 7, 1.6, 'rgba(40,90,140,.18)') + P('M16,4.4 Q24.6,14.6 24.4,19 Q24,26 16,26.4 Q8,26 7.6,19 Q7.4,14.6 16,4.4 Z', '#6AB8E8', 1.1) + P('M16,8 Q21.6,15 21.4,19 Q21,23.6 16,23.8 Q11,23.6 10.6,19 Q10.4,15 16,8 Z', '#8ECCF2', 0) + `<path d="M11.6,16 Q12.4,12.6 14.4,10.6" fill="none" stroke="${WHITE}" stroke-width="1.6" stroke-linecap="round"/>` + E(19.4, 20.4, 1.1, 0.8, WHITE).replace('/>', ' opacity=".8"/>');
    case 'food': // un panier de blé et une pomme
      return E(16, 26, 10, 1.8, 'rgba(60,40,20,.15)') + [-5, -1.5, 2, 5.5].map((dx, i) => `<path d="M${16 + dx * 0.4},22 Q${16 + dx},14 ${16 + dx * 1.4},${8 + (i % 2) * 2}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M${16 + dx * 0.4},22 Q${16 + dx},14 ${16 + dx * 1.4},${8 + (i % 2) * 2}" fill="none" stroke="#E2B44E" stroke-width="0.7" stroke-linecap="round"/>` + [0, 1, 2].map(j => E(16 + dx * 1.35 - 0.6, 9 + (i % 2) * 2 + j * 1.8, 1, 1.4, '#F2C94C', 0.5)).join('')).join('') + P('M8,19 L24,19 L22.4,26.4 Q16,27.6 9.6,26.4 Z', '#C8925A', 1) + `<path d="M8.6,22 Q16,23.4 23.4,22" fill="none" stroke="#9A6A3A" stroke-width="0.7"/>` + P('M20.6,15.6 Q24,14.4 25.4,17.6 Q26.6,21.6 23,22.6 Q20.4,23.2 19.4,20.6 Q18.6,17 20.6,15.6 Z', '#E8504A', 0.9) + `<path d="M22.4,15.2 Q22.6,13.4 23.6,12.6" stroke="${OUT}" stroke-width="0.7" fill="none"/>` + E(21.2, 17.4, 0.6, 0.9, WHITE).replace('/>', ' opacity=".7"/>');
    case 'fish': // un poisson qui saute, vu de profil, une goutte
      return E(16, 26, 9, 1.6, 'rgba(40,90,140,.18)') + `<g transform="translate(17.4 16.4) scale(0.8) rotate(-18) translate(-15 -16)">${P('M6.4,16 Q3,12 2,10.4 Q3.4,16 2,21.6 Q3,20 6.4,16 Z', '#E8604A', 0.9)}${P('M27,16 Q26,9.6 17,9.4 Q8.6,9.6 6,16 Q8.6,22.4 17,22.6 Q26,22.4 27,16 Z', '#9CC8E8', 1)}<path d="M8,16 Q17,13.4 26,15" fill="none" stroke="${WHITE}" stroke-width="1" opacity=".6"/>${P('M14,9.8 Q17,6.4 21,9.6 Z', '#E8604A', 0.8)}${E(22.6, 14.4, 1.7, 1.9, '#2A2420')}${E(23.1, 13.7, 0.65, 0.65, WHITE)}${E(21.6, 18, 1.1, 0.6, '#F29E9A').replace('/>', ' opacity=".7"/>')}<path d="M26,17.6 Q26.7,18 26.1,18.6" fill="none" stroke="${OUT}" stroke-width="0.6"/></g>` + P('M26,6 q1.4,2 0,3 q-1.4,-1 0,-3 Z', '#BFE6FF', 0.5);
  }
  return '';
}
// la tuile au repos (SMIL) : l'objet respire, un éclat passe de temps en temps
function tuile(k, id, anim = true) {
  const c = SORTES[k];
  const reflet = anim ? `<g opacity="0">${etoile(24, 8, 2.4, c.lueur === '#FFFFFF' ? '#FFFFFF' : '#FFFBE8')}<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.08;0.16;1" dur="4s" begin="${f((k.length * 0.37) % 1 * 4)}s" repeatCount="indefinite"/></g>` : '';
  const souffle = anim ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -0.5;0 0" dur="2.4s" repeatCount="indefinite"/>` : '';
  return fond(k, id) + `<g>${souffle}${objet(k)}</g>` + reflet;
}
// la tuile choisie (SMIL) : elle se soulève, un liseré doré qui pulse, de petites étoiles
function choisie(k, id, anim = true) {
  const ring = `<path d="${CARRE}" fill="none" stroke="#FFD24A" stroke-width="2.2">${anim ? '<animate attributeName="stroke-opacity" values="1;.45;1" dur="0.8s" repeatCount="indefinite"/>' : ''}</path>`;
  return `<g transform="translate(16 16) scale(1.06) translate(-16 -16.6)">${fond(k, id)}${objet(k)}</g>` + ring + etoile(5, 5, 2) + etoile(27.4, 26.6, 1.6);
}
// la tuile cueillie (4 images) : elle saute, se change en éclats de sa couleur, l'objet file vers les réserves
function cueillie(k, i, id) {
  const c = SORTES[k], t = (i + 1) / 4;
  let s = '';
  for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4 + 0.3, d = 6 + t * 12; s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(16 + Math.sin(a) * d)}) rotate(${j * 45 + i * 30})" opacity="${f(1 - t * 0.8)}">${P('M0,-2 L1.4,0 L0,2 L-1.4,0 Z', c.fond[1], 0.5)}</g>`; }
  if (i === 0) s += `<g transform="translate(16 16) scale(1.12) translate(-16 -16)">${fond(k, id)}${objet(k)}</g>`;
  else s += `<g transform="translate(16 ${f(16 - i * 4)}) scale(${f(1 - i * 0.18)}) translate(-16 -16)">${objet(k)}</g>`;
  return s + (i === 1 ? etoile(16, 16, 6) : '');
}
// la tuile qui atterrit (2 images) : elle s'écrase un peu en touchant, puis rebondit
const atterrit = (k, i, id) => `<g transform="translate(16 29.5) scale(${i ? '0.97 1.04' : '1.08 0.88'}) translate(-16 -29.5)">${fond(k, id)}${objet(k)}</g>` + (i === 0 ? `<path d="M4,30 L1.4,31.4 M28,30 L30.6,31.4" stroke="${OUT}" stroke-width="0.8" stroke-linecap="round" opacity=".6"/>` : '');
// l'éclat d'une longue chaîne (4 images, cadre 48 × 48 centré sur la tuile) : une couronne d'étoiles qui s'ouvre
function chaine(i) {
  const t = (i + 1) / 4;
  let s = `<circle cx="16" cy="16" r="${f(6 + t * 16)}" fill="none" stroke="#FFE07A" stroke-width="${f(2.4 * (1 - t * 0.7))}" opacity="${f(1 - t * 0.7)}"/>`;
  for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4 + i * 0.2, d = 4 + t * 16; s += etoile(16 + Math.cos(a) * d, 16 + Math.sin(a) * d, f(2.6 * (1 - t * 0.5)), j % 2 ? '#FFE07A' : '#FFFBE8'); }
  return s;
}

// ——— les pièces : { id (le fichier), nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const T = [0, 0, 32, 32], LARGE = [-8, -8, 48, 48];
for (const k of Object.keys(SORTES)) {
  const n = SORTES[k].nom;
  piece(`tuile-${k}`, `La tuile ${n} au repos (elle respire, en boucle)`, T, () => tuile(k, `rt${k}`));
  piece(`choisie-${k}`, `La tuile ${n} choisie (le liseré pulse, en boucle)`, T, () => choisie(k, `rc${k}`));
  for (let i = 0; i < 4; i++) piece(`cueillie-${k}_${i + 1}`, `La tuile ${n} cueillie`, LARGE, () => cueillie(k, i, `rq${k}${i}`), `cueillie-${k}`, 90);
  for (let i = 0; i < 2; i++) piece(`atterrit-${k}_${i + 1}`, `La tuile ${n} qui atterrit`, T, () => atterrit(k, i, `ra${k}${i}`), `atterrit-${k}`, 140);
}
for (let i = 0; i < 4; i++) piece(`chaine_${i + 1}`, 'L\'éclat d\'une longue chaîne', LARGE, () => chaine(i), 'chaine', 90);

const TITRE = 'La Récolte (le plateau de l\'île)', FOND = '#E8D8B4';
const LISEZ_MOI = 'La Récolte : une tuile a un cadre de 32 × 32 ; la tuile cueillie et l\'éclat d\'une longue chaîne ont un cadre de 48 × 48 centré sur la tuile (1,5 fois sa taille). Les sortes gardent les noms du jeu (stone, wood, water, food, fish). Boucles animées dans le SVG (SMIL) : la tuile au repos, la tuile choisie. Suites d\'images à enchaîner une fois : la tuile cueillie, la tuile qui atterrit, l\'éclat d\'une longue chaîne.';
module.exports = { SORTES, PIECES, TITRE, FOND, LISEZ_MOI, tuile, choisie, cueillie, atterrit, chaine, objet };
