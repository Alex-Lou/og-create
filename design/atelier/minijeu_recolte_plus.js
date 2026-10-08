// Mini-jeux — la Récolte, nouvelle version (design/conception/minijeux_grille.md, § 3) : les tuiles spéciales (la gerbe,
// la graine dorée), les obstacles (le rocher, la ronce), les effets (l'onde de la gerbe, l'éclat d'une cascade, le fil
// doré de la chaîne) et le panneau de la commande. Mêmes règles que la Récolte : tuile 32 × 32, boucles en SMIL, coups
// en suites d'images, fichiers × 4.
const R = require('./minijeu_recolte');
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;
const CARRE = 'M6,2.5 L26,2.5 Q29.5,2.5 29.5,6 L29.5,26 Q29.5,29.5 26,29.5 L6,29.5 Q2.5,29.5 2.5,26 L2.5,6 Q2.5,2.5 6,2.5 Z';
const fondTuile = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><path d="${CARRE}" fill="url(#${id})"${st(1)}/><path d="M6.4,4.4 L25.6,4.4" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`;

// ——— la gerbe (SMIL : ses épis ondulent) : une botte de blé liée d'un ruban rouge ———
function gerbe(anim = true) {
  let epis = '';
  for (let i = -3; i <= 3; i++) { const x = 16 + i * 2.2, top = 6 + Math.abs(i) * 1.2; epis += `<path d="M16,20 Q${f(16 + i * 1.2)},14 ${f(x)},${f(top)}" fill="none" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round"/><path d="M16,20 Q${f(16 + i * 1.2)},14 ${f(x)},${f(top)}" fill="none" stroke="#E2B44E" stroke-width="0.7" stroke-linecap="round"/>` + [0, 1, 2].map(j => E(x - i * 0.15, top + j * 1.7, 0.9, 1.3, '#F2C94C', 0.45)).join(''); }
  const tiges = [-4, -2, 0, 2, 4].map(dx => `<path d="M16,20 L${16 + dx},27" stroke="#C8962A" stroke-width="1.1" stroke-linecap="round"/>`).join('');
  return fondTuile('rg', '#FFF2C4', '#F2D88A') + `<g>${anim ? '<animateTransform attributeName="transform" type="rotate" values="-3 16 22;3 16 22;-3 16 22" dur="1.8s" repeatCount="indefinite"/>' : ''}${tiges}${epis}</g>` + P('M12.6,19 L19.4,19 L19,22.4 L13,22.4 Z', '#D8443A', 0.8) + P('M16,20.6 L13,25 M16,20.6 L19,25', 'none', 0).replace('fill="none"', 'fill="none" stroke="#D8443A" stroke-width="1.4" stroke-linecap="round"');
}
// ——— la graine dorée (SMIL : elle luit et tourne un peu) ———
function graine(anim = true) {
  const halo = `<circle cx="16" cy="16" r="12" fill="#FFF2B8" opacity=".5">${anim ? '<animate attributeName="r" values="10;13;10" dur="1.4s" repeatCount="indefinite"/>' : ''}</circle>`;
  const g = P('M16,6 Q23,9 22.6,17 Q22,25 16,26.6 Q10,25 9.4,17 Q9,9 16,6 Z', '#F2C94C', 1.1) + `<path d="M16,7.6 Q19,16 16,25" fill="none" stroke="#C8962A" stroke-width="0.8"/>` + `<path d="M12,11 Q13,8.6 15,8" fill="none" stroke="${WHITE}" stroke-width="1.4" stroke-linecap="round"/>`;
  return fondTuile('rd', '#FFF8E0', '#F8E6A8') + halo + `<g>${anim ? '<animateTransform attributeName="transform" type="rotate" values="-8 16 16;8 16 16;-8 16 16" dur="2.2s" repeatCount="indefinite"/>' : ''}${g}</g>` + etoile(24, 7, 2.2) + etoile(7, 24, 1.6);
}
// ——— le rocher : intact, fendu ; il casse (3 images, cadre 48 × 48) ———
const ROC = 'M5,26 Q3,16 9,10 Q15,4.6 22,7 Q29,10 28,19 Q28.4,26.4 22,28 Q13,29.4 5,26 Z';
function rocher(etat) {
  let s = fondTuile('rr' + etat, '#D8D2C6', '#B8B0A2') + P(ROC, '#9A948A', 1.1) + `<path d="M8,14 Q12,9.4 17,9" fill="none" stroke="#C8C2B6" stroke-width="1.6" stroke-linecap="round"/>` + E(20, 21, 2, 1.2, '#7E786E');
  if (etat >= 1) s += `<path d="M16,8 L14.4,13 L17.2,16 L14.6,21 L16.8,27" fill="none" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`;
  return s;
}
function rocherCasse(k) {
  const t = (k + 1) / 3;
  let s = '';
  const morceaux = [['M5,26 Q3,16 9,10 L15,12 L14,20 Z', -1, -0.6], ['M9,10 Q15,4.6 22,7 L18,14 L15,12 Z', 0.2, -1], ['M22,7 Q29,10 28,19 L20,18 L18,14 Z', 1, -0.5], ['M5,26 L14,20 L20,24 L22,28 Q13,29.4 5,26 Z', -0.4, 1], ['M20,18 L28,19 Q28.4,26.4 22,28 L20,24 Z', 1, 0.8]];
  morceaux.forEach(([d, dx, dy]) => { s += `<g transform="translate(${f(dx * t * 9)} ${f(dy * t * 6 + t * t * 2)}) rotate(${f(dx * t * 40)} 16 18)" opacity="${f(1 - Math.max(0, t - 0.5) * 1.6)}">${P(d, '#9A948A', 0.9)}</g>`; });
  for (let i = 0; i < 6; i++) { const a = i * 1.05, d = 6 + t * 14; s += E(16 + Math.cos(a) * d, 17 + Math.sin(a) * d * 0.8, 3 + t * 3, 2 + t * 2, '#DDD6C8').replace('/>', ` opacity="${f(0.6 * (1 - t))}"/>`); }
  return s + (k === 0 ? etoile(16, 16, 6) : '');
}
// ——— la ronce, posée par-dessus la tuile qu'elle prend : elle pousse (3 images, la dernière reste), elle est coupée
// (3 images) ———
function ronce(n) {
  const k = [0.4, 0.75, 1][n];
  let s = '';
  const tiges = [['M3,28 Q9,20 8,12 Q8,6 14,4', '#7A3A4A'], ['M29,26 Q22,22 23,14 Q24,7 18,5', '#7A3A4A'], ['M6,6 Q12,14 20,16 Q26,18 28,28', '#8A4A5A']];
  tiges.slice(0, n + 1).forEach(([d, c]) => { s += `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="${f(40 * k)} 60"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="${f(40 * k)} 60"/>`; });
  // épines et feuilles
  const pts = [[7, 20], [9, 10], [23, 20], [21, 9], [14, 14], [24, 22]].slice(0, 2 + n * 2);
  pts.forEach(([x, y], i) => { s += `<path d="M${x},${y} l1.6,-1 l-0.4,1.8 Z" fill="#E8E0D0" stroke="${OUT}" stroke-width="0.4"/>`; if (i % 2) s += P(`M${x + 1},${y + 1} q2.4,-2.2 4,0 q-2,2 -4,0 Z`, '#5E9A3C', 0.5); });
  if (n === 2) s += [[11, 7], [25, 16]].map(([x, y]) => E(x, y, 1.2, 1.2, '#4A2A5A', 0.4) + E(x + 1.4, y + 0.4, 1.1, 1.1, '#4A2A5A', 0.4)).join('');
  return s;
}
function ronceCoupee(k) {
  const t = (k + 1) / 3;
  let s = '';
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.6, d = 4 + t * 12; s += `<g transform="translate(${f(16 + Math.cos(a) * d)} ${f(16 + Math.sin(a) * d + t * t * 8)}) rotate(${f(i * 70 + t * 160)})" opacity="${f(1 - t * 0.7)}"><path d="M-3,0 L3,0" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/><path d="M-3,0 L3,0" stroke="#7A3A4A" stroke-width="1" stroke-linecap="round"/></g>`; }
  if (k === 0) s += `<path d="M4,26 L28,6" stroke="${WHITE}" stroke-width="2" stroke-linecap="round" opacity=".9"/>`;
  return s;
}
// ——— l'onde de la gerbe : elle balaie sa ligne (cadre 192 × 32, 4 images ; tournée d'un quart pour la colonne) ———
function onde(k) {
  const x = 16 + k * 52;
  return `<rect x="0" y="8" width="192" height="16" rx="8" fill="#FFF2B8" opacity="${f(0.35 - k * 0.06)}"/>` + `<g transform="translate(${x} 16)">${P('M-10,0 Q0,-9 10,0 Q0,9 -10,0 Z', '#FFE07A', 0.6).replace('/>', ' opacity=".85"/>')}</g>` + [0, 1, 2].map(i => etoile(x - 14 - i * 10, 16 + (i % 2 ? -4 : 4), 2.4 - i * 0.6)).join('');
}
// ——— l'éclat d'une cascade (4 images, cadre 48 × 48) : une étoile, des gouttes de lumière qui tombent en pluie (le jeu
// écrit le bonus lui-même) ———
function cascade(k) {
  const t = (k + 1) / 4;
  let s = k < 2 ? etoile(16, 8 - k * 3, 4 - k * 1.2, '#FFE07A') : '';
  for (let i = 0; i < 7; i++) { const x = -3 + i * 6.3, y = -2 + t * 30 + (i % 3) * 3; s += P(`M${f(x)},${f(y - 4.4)} Q${f(x + 2.8)},${f(y)} ${f(x)},${f(y + 2)} Q${f(x - 2.8)},${f(y)} ${f(x)},${f(y - 4.4)} Z`, i % 2 ? '#BFE6FF' : '#FFE07A', 0.4).replace('/>', ` opacity="${f(1 - t * 0.6)}"/>`); }
  return s;
}
// ——— la commande (96 × 44) : une planchette pendue à trois cases ; chaque case (30 × 44, posée en x = 4 + 30 × i) montre
// la ressource demandée et une étiquette vide où le jeu écrit le compte (« 12/20 ») ; faite : l'étiquette passe au vert,
// une coche ———
const planchette = () => `<path d="M12,7 L48,1.4 L84,7" fill="none" stroke="#8A6A4A" stroke-width="0.9"/>` + P('M3,7 L93,7 Q95,7 95,9 L95,41 Q95,43 93,43 L3,43 Q1,43 1,41 L1,9 Q1,7 3,7 Z', '#C8925A', 1.2) + `<path d="M3,16 L93,16 M3,30 L93,30" stroke="#9A6A3A" stroke-width="0.6"/>` + E(12, 7, 1.8, 1.8, '#A8B0BA', 0.8) + E(84, 7, 1.8, 1.8, '#A8B0BA', 0.8);
function caseCommande(k, fait) {
  let s = `<g transform="translate(5 8.4) scale(0.6)">${R.objet(k)}</g>`;
  s += P('M2,32 L26,32 Q27,32 27,33 L27,39.4 Q27,40.4 26,40.4 L2,40.4 Q1,40.4 1,39.4 L1,33 Q1,32 2,32 Z', fait ? '#CDE8B4' : '#F4EBD2', 0.7);
  if (fait) s += `<path d="M21,27.4 l2,2 l4,-4.2" fill="none" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21,27.4 l2,2 l4,-4.2" fill="none" stroke="#5FA548" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}
// ——— le fil doré entre deux tuiles de la chaîne (cadre 32 × 32 centré sur le lien), SMIL : il brille ———
const fil = (diag, anim = true) => { const d = diag ? 'M4,28 L28,4' : 'M0,16 L32,16'; return `<path d="${d}" stroke="${OUT}" stroke-width="5" stroke-linecap="round" opacity=".35"/><path d="${d}" stroke="#FFD24A" stroke-width="3" stroke-linecap="round"/><path d="${d}" stroke="#FFF6C8" stroke-width="1" stroke-linecap="round" stroke-dasharray="3 5">${anim ? '<animate attributeName="stroke-dashoffset" values="0;-16" dur=".6s" repeatCount="indefinite"/>' : ''}</path>`; };

// ——— les pièces (dans le dossier de la Récolte) : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
const T = [0, 0, 32, 32], LARGE = [-8, -8, 48, 48];
piece('gerbe', 'La gerbe (chaîne de 6 ; ses épis ondulent, en boucle)', T, () => gerbe());
piece('graine', 'La graine dorée (chaîne de 9 ; elle luit, en boucle)', T, () => graine());
piece('rocher', 'Le rocher', T, () => rocher(0));
piece('rocher_fendu', 'Le rocher fendu', T, () => rocher(1));
for (let k = 0; k < 3; k++) piece(`rocher-casse_${k + 1}`, 'Le rocher qui casse', LARGE, () => rocherCasse(k), 'rocher-casse', 110);
for (let n = 0; n < 3; n++) piece(`ronce_${n + 1}`, 'La ronce qui pousse (par-dessus la tuile ; la dernière image reste)', T, () => ronce(n), 'ronce', 300);
for (let k = 0; k < 3; k++) piece(`ronce-coupee_${k + 1}`, 'La ronce coupée', T, () => ronceCoupee(k), 'ronce-coupee', 110);
for (let k = 0; k < 4; k++) piece(`onde_${k + 1}`, 'L\'onde de la gerbe sur sa ligne', [0, 0, 192, 32], () => onde(k), 'onde', 90);
for (let k = 0; k < 4; k++) piece(`cascade_${k + 1}`, 'L\'éclat d\'une cascade', LARGE, () => cascade(k), 'cascade', 110);
piece('fil', 'Le fil doré de la chaîne, droit (il brille, en boucle)', T, () => fil(false));
piece('fil_diagonale', 'Le fil doré de la chaîne, en diagonale (il brille, en boucle)', T, () => fil(true));
piece('commande', 'Le panneau de la commande (trois cases)', [0, 0, 96, 44], planchette);
for (const k of Object.keys(R.SORTES)) for (const fait of [false, true]) piece(`commande-${k}${fait ? '_faite' : ''}`, `Une case de la commande : ${R.SORTES[k].nom}${fait ? ', faite' : ''}`, [0, 0, 30, 44], () => caseCommande(k, fait));

const LISEZ_MOI = 'La Récolte, nouvelle version (design/conception/minijeux_grille.md) : la gerbe, la graine dorée, le rocher et le rocher fendu ont le cadre d\'une tuile (32 × 32). La ronce et la ronce coupée se posent par-dessus la tuile qu\'elles prennent. Le rocher qui casse et l\'éclat d\'une cascade : 48 × 48 centrés sur la tuile. L\'onde de la gerbe : 192 × 32 sur sa ligne (tournée d\'un quart pour sa colonne). Le fil doré : 32 × 32 centré sur le lien entre deux tuiles (droit : tourné d\'un quart à la verticale ; en diagonale : retourné pour l\'autre sens). La commande : le panneau (96 × 44) et, par-dessus, une case par ressource (30 × 44, en x = 4 + 30 × i) ; le jeu écrit le compte dans l\'étiquette.';
module.exports = { PIECES, LISEZ_MOI, gerbe, graine, rocher, rocherCasse, ronce, ronceCoupee, onde, cascade, planchette, caseCommande, fil };
