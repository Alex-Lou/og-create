// Mini-jeux — l'Arrimage, compléments (design/conception/minijeux_grille.md, § 6) : la vague de la saison 3 et son
// alerte, les cases « suivante » et « mise de côté », le bilan (le bateau d'Aster chargé, qui tangue). Mêmes règles que
// l'Arrimage : case 16 × 16, boucles en SMIL, coups en suites d'images, fichiers × 4.
const A = require('./minijeu_arrimage');
const OUT = '#3C2819', WHITE = '#FFFFFF';
const f = n => Math.round(n * 100) / 100;
const st = w => ` stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, fill, w = 1) => `<path d="${d}" fill="${fill}"${w ? st(w) : ''}/>`;
const E = (x, y, rx, ry, fill, w = 0) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${w ? st(w) : ''}/>`;
const etoile = (x, y, r, fill = '#FFFBE8') => `<path d="M${f(x)},${f(y - r)} Q${f(x + r * 0.16)},${f(y - r * 0.16)} ${f(x + r)},${f(y)} Q${f(x + r * 0.16)},${f(y + r * 0.16)} ${f(x)},${f(y + r)} Q${f(x - r * 0.16)},${f(y + r * 0.16)} ${f(x - r)},${f(y)} Q${f(x - r * 0.16)},${f(y - r * 0.16)} ${f(x)},${f(y - r)} Z" fill="${fill}"/>`;

// ——— la vague (saison 3) : elle traverse la bande de la rangée du haut (cadre 128 × 48, 4 images) ———
// 1 elle entre par la gauche, 2 elle s'enroule, 3 elle s'écrase en gerbe, 4 l'écume retombe en gouttes
function vague(k) {
  const x = [8, 46, 88, 128][k];
  let s = '';
  if (k < 3) {
    // le corps de la vague : une crête enroulée, son creux plus clair, l'écume en festons
    s += `<g transform="translate(${x} 2)">` + P('M-40,48 L-40,30 Q-14,24 0,10 Q10,0 22,4 Q30,8 26,16 Q22,22 14,18 Q18,12 12,10 Q4,12 2,26 Q8,40 30,48 Z', '#3A8AC0', 1.1)
      + P('M-36,46 Q-12,36 -2,22 Q2,34 18,46 Z', '#6AB8E8', 0)
      + `<path d="M0,10 Q10,0 22,4 Q30,8 26,16" fill="none" stroke="${WHITE}" stroke-width="2.2" stroke-linecap="round"/>`
      + [[-30, 30], [-18, 26], [-6, 18]].map(([a, b]) => E(a, b, 3, 1.8, WHITE)).join('') + '</g>';
    if (k === 2) s += [0, 1, 2, 3, 4, 5, 6].map(i => { const a = -Math.PI * (0.15 + i * 0.12); return E(x + 18 + Math.cos(a) * 16, 20 + Math.sin(a) * 13, 2.4 - i * 0.15, 1.8, i % 2 ? '#BFE6FF' : WHITE, 0.5); }).join('');
  } else {
    s += [[20, 30], [44, 22], [66, 34], [90, 24], [110, 32]].map(([a, b], i) => P(`M${a},${b - 4} Q${a + 2.6},${b} ${a},${b + 2} Q${a - 2.6},${b} ${a},${b - 4} Z`, i % 2 ? '#BFE6FF' : '#7EC8F0', 0.5)).join('') + `<path d="M0,46 Q16,42 32,46 T64,46 T96,46 T128,46" fill="none" stroke="${WHITE}" stroke-width="1.6" opacity=".7"/>`;
  }
  return s;
}
// l'alerte de la vague (32 × 32, SMIL : elle bat) : un hublot rouge où roule une petite vague
function alerte(anim = true) {
  return `<g>${anim ? '<animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="0.5s" repeatCount="indefinite" additive="sum"/>' : ''}`.replace('<g>', '<g transform-origin="16 16">')
    + E(16, 16, 13, 13, '#E8504A', 1.2) + E(16, 16, 10, 10, '#FFE8E0', 0.8)
    + P('M7,20 Q10,16 13,18 Q16,10 21,11 Q25,12 24,16 Q22,19 20,17 Q21,14 18,15 Q16,17 18,22 L7,22 Z', '#3A8AC0', 0.7)
    + `<path d="M13,18 Q16,10 21,11" fill="none" stroke="${WHITE}" stroke-width="1" stroke-linecap="round"/>` + `</g>`;
}

// ——— les cases du bord : la suivante (un hublot) et la mise de côté (une caisse ouverte, avec sa corde) ———
// cadre 48 × 48 ; le jeu pose la marchandise au centre, réduite de moitié (les cases de 8 × 8)
function suivante() {
  let s = E(24, 24, 22, 22, '#8A6A48', 1.2) + E(24, 24, 18.4, 18.4, '#A8B0BA', 1) + E(24, 24, 15.6, 15.6, '#2E4A5E', 0.8);
  s += [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return E(24 + Math.cos(a) * 17, 24 + Math.sin(a) * 17, 1.1, 1.1, '#6A727C', 0.4); }).join('');
  s += `<path d="M14,15 Q18,11 23,10" fill="none" stroke="${WHITE}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>`;
  return s;
}
function miseDeCote(bloquee = false) {
  let s = P('M3,10 L45,10 L45,45 L3,45 Z', '#C8925A', 1.2) + P('M7,14 L41,14 L41,41 L7,41 Z', '#5E3E26', 0.8);
  s += `<path d="M3,22 L7,22 M41,22 L45,22 M3,33 L7,33 M41,33 L45,33" stroke="#8A5A32" stroke-width="1"/>`;
  s += [[5, 12], [43, 12], [5, 43], [43, 43]].map(([x, y]) => E(x, y, 0.9, 0.9, '#8A5A32')).join('');
  // la corde enroulée sur le couvercle, posé en biais derrière
  s = P('M6,10 L40,2 L42,7 L8,15 Z', '#B07A4A', 1) + s + `<path d="M10,6 Q14,3 18,6 Q22,9 26,5" fill="none" stroke="#E8D8B0" stroke-width="1.4" stroke-linecap="round"/>`;
  if (bloquee) s += P('M7,14 L41,14 L41,41 L7,41 Z', '#3C2819', 0).replace('/>', ' opacity=".45"/>') + `<g transform="translate(24 28)">${P('M-5,-2 L5,-2 L5,6 L-5,6 Z', '#A8B0BA', 0.9)}<path d="M-3,-2 L-3,-5 Q0,-9 3,-5 L3,-2" fill="none" stroke="${OUT}" stroke-width="1.4"/>${E(0, 2, 1, 1.2, OUT)}</g>`;
  return s;
}

// ——— le bilan : le bateau d'Aster, chargé de 0 à 4 rangs, qui tangue sur l'eau (SMIL ; cadre 96 × 72) ———
function bateau(n, anim = true) {
  const mer = `<path d="M0,58 Q12,55 24,58 T48,58 T72,58 T96,58 L96,72 L0,72 Z" fill="#6AB8E8"/><path d="M0,62 Q12,59 24,62 T48,62 T72,62 T96,62" fill="none" stroke="${WHITE}" stroke-width="1" opacity=".6">${anim ? '<animateTransform attributeName="transform" type="translate" values="0 0;-24 0" dur="2s" repeatCount="indefinite"/>' : ''}</path>`;
  let b = '';
  // le mât et la voile, frappée du tourbillon d'Aster (l'Air)
  b += `<rect x="47" y="6" width="2.4" height="44" rx="1" fill="#8A5A32"${st(0.7)}/>` + P('M50,9 Q70,18 68,40 L50,40 Z', '#F4EBD2', 1) + `<path d="M59,24 q4,-3 6,1 q1,4 -3,4 q-3,0 -2,-3" fill="none" stroke="#7EC8D8" stroke-width="1.2" stroke-linecap="round"/>` + P('M48,4 L58,7 L48,10 Z', '#7EC8D8', 0.6);
  // la cargaison, rang par rang, sur le pont
  const rangs = [[['caisse', 18], ['sac', 30], ['tonneau', 58], ['caisse', 70]], [['lest', 22], ['caisse', 64]], [['sac', 26], ['tonneau', 66]], [['caisse', 30], ['sac', 62]]];
  rangs.slice(0, n).forEach((r, i) => r.forEach(([so, x]) => { b += `<g transform="translate(${x - 6} ${40 - i * 8}) scale(0.75)">${A.caseDe(so, 0, 0, [0, 0, 0, 0])}</g>`; }));
  // la coque
  b += P('M8,46 L88,46 Q86,58 74,60 L22,60 Q10,58 8,46 Z', '#9A6440', 1.2) + `<path d="M11,50 L85,50" stroke="#C08A5E" stroke-width="1.4"/>` + [24, 40, 56, 72].map(x => E(x, 54, 1.8, 1.8, '#5E3A22', 0.5) + E(x - 0.4, 53.6, 0.6, 0.6, '#A8D8F0')).join('');
  if (n === 4) b += etoile(14, 30, 3) + etoile(84, 22, 2.4) + etoile(40, 14, 2);
  const tangage = anim ? '<animateTransform attributeName="transform" type="rotate" values="-2 48 56;2 48 56;-2 48 56" dur="2.6s" repeatCount="indefinite"/>' : '';
  return `<g>${tangage}${b}</g>` + mer;
}

// ——— les pièces (dans le dossier de l'Arrimage) : { id, nom, cadre, dessin, suite, ms par image, boucle } ———
const PIECES = [];
const piece = (id, nom, cadre, dessin, suite = null, ms = null, boucle = false) => PIECES.push({ id, nom, cadre, dessin, suite, ms, boucle });
for (let k = 0; k < 4; k++) piece(`vague_${k + 1}`, 'La vague (sur la bande de la rangée du haut)', [0, 0, 128, 48], () => vague(k), 'vague', 110);
piece('alerte-vague', 'L\'alerte de la vague (elle bat, en boucle)', [0, 0, 32, 32], () => alerte());
piece('suivante', 'La case de la marchandise suivante (un hublot)', [0, 0, 48, 48], suivante);
piece('mise-de-cote', 'La case de mise de côté (une caisse ouverte)', [0, 0, 48, 48], () => miseDeCote(false));
piece('mise-de-cote_bloquee', 'La case de mise de côté, déjà utilisée pour cette marchandise', [0, 0, 48, 48], () => miseDeCote(true));
for (let n = 0; n <= 4; n++) piece(`bateau_${n}`, `Le bilan : le bateau d'Aster, ${n} rang${n > 1 ? 's' : ''} de cargaison (il tangue, en boucle)`, [0, 0, 96, 72], () => bateau(n));

const LISEZ_MOI = 'Compléments : la vague (128 × 48) se pose sur la bande de la rangée du haut, pendant que le jeu secoue la cale ; l\'alerte (32 × 32) la précède. La suivante et la mise de côté (48 × 48) : le jeu pose la marchandise au centre, réduite de moitié. Le bilan : le bateau d\'Aster (96 × 72), chargé de 0 à 4 rangs selon le résultat, avec les étoiles du Filon.';
module.exports = { PIECES, LISEZ_MOI, vague, alerte, suivante, miseDeCote, bateau };
