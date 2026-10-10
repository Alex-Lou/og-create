// Brume en très grand, au premier plan de l'écran de démarrage (splash.js) : son dessin du jeu (brume.js, stade s1 :
// la flamme bleue, son cœur clair, ses yeux, ses joues), même forme, mêmes couleurs, avec un rendu fait pour être vu
// de près : une flamme vitrée qui ondule (sa pointe se balance, deux langues de feu s'en échappent), une lumière
// intérieure qui respire, des reflets de verre, des particules qui montent dedans ; elle cligne doucement des yeux.
// Repère : celui de son dessin (40 × 48 ; la flamme va de y = 13,5, la pointe, à y = 41, la base).
const { degrade, rayonne } = require('./splash_anya').outils;
const { f, palpite } = require('./scenes7').outils;

const SPL = '0.45 0 0.55 1';
// La flamme du jeu, et deux variantes où sa pointe penche (même suite de commandes : elles se fondent l'une dans l'autre)
const flamme = (dx, r = 1) => `M20,41 C${f(20 + 11.7 * r)},41 ${f(20 + 10.35 * r)},27.95 ${f(20 + dx)},${f(41 - 27.45 * r)} C${f(20 - 10.35 * r)},27.95 ${f(20 - 11.7 * r)},41 20,41 Z`;
const ondule = (r, dur, begin = 0) => `<animate attributeName="d" values="${flamme(0, r)};${flamme(1.6, r)};${flamme(-1.4, r)};${flamme(0, r)}" keyTimes="0;0.33;0.7;1" calcMode="spline" keySplines="${SPL};${SPL};${SPL}" dur="${dur}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;

function brumeHeroine() {
  const defs = '<defs>'
    + rayonne('bgFlamme', 20, 34, 18, [[0, '#B8F2FF'], [0.45, '#6ED4F6'], [0.8, '#3AA6E2'], [1, '#2A80C8']], 18, 38)
    + rayonne('bgMilieu', 20, 34, 12, [[0, '#F2FDFF'], [0.6, '#C8F3FF'], [1, '#A6E8FF']])
    + rayonne('bgCoeur', 20, 36, 7.5, [[0, '#FFFFFF'], [0.7, '#FFFFFF', 0.95], [1, '#FFFFFF', 0.6]])
    + rayonne('bgHalo', 20, 30, 16, [[0, '#9FE6FF', 0.6], [0.5, '#6CCBF0', 0.2], [1, '#6CCBF0', 0]])
    + rayonne('bgOeil', 0, 0, 1, [[0, '#3A5E9A'], [0.6, '#1D3557'], [1, '#14243C']], 0.4, 0.75).replace('gradientUnits="userSpaceOnUse" ', '')
    + rayonne('bgJoue', 0.5, 0.5, 0.5, [[0, '#FF9EB0', 0.85], [1, '#FF9EB0', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
    + degrade('bgReflet', 12, 18, 16, 32, [[0, '#FFFFFF', 0.85], [1, '#FFFFFF', 0]])
    + `<clipPath id="bgDedans"><path d="${flamme(0)}">${ondule(1, 3.2)}</path></clipPath>`
    + '</defs>';
  let s = defs;
  // le halo qui respire autour d'elle
  s += `<ellipse cx="20" cy="30" rx="15" ry="17" fill="url(#bgHalo)">${palpite('rx', '14;16;14', 2.8)}${palpite('ry', '16;18;16', 2.8)}</ellipse>`;
  // deux langues de feu qui s'échappent de ses flancs et montent en s'effaçant
  s += [[-1, 0], [1, 1.3]].map(([k, b]) => `<path d="M${20 + k * 7},26 Q${20 + k * 10},21 ${20 + k * 8},16 Q${20 + k * 6},21 ${20 + k * 5},26 Z" fill="#7FDCFA" opacity="0">`
    + `<animate attributeName="opacity" values="0;0.8;0" dur="2.6s" begin="${-b}s" repeatCount="indefinite"/>`
    + `<animateTransform attributeName="transform" type="translate" values="0 2;${k * 1.5} -4" dur="2.6s" begin="${-b}s" repeatCount="indefinite"/></path>`).join('');
  // la flamme, son milieu clair, son cœur blanc qui respire : chacune ondule à son rythme
  s += `<path d="${flamme(0)}" fill="url(#bgFlamme)" stroke="#23647F" stroke-width="0.9" stroke-linejoin="round">${ondule(1, 3.2)}</path>`;
  s += `<path d="${flamme(0, 0.79)}" transform="translate(0 -0.5)" fill="url(#bgMilieu)">${ondule(0.79, 2.6, 0.4)}</path>`;
  s += `<ellipse cx="20" cy="35" rx="5.8" ry="5.2" fill="url(#bgCoeur)">${palpite('rx', '5.4;6.4;5.4', 2.2)}${palpite('ry', '4.8;5.6;4.8', 2.2)}</ellipse>`;
  // des particules de lumière qui montent dans la flamme
  s += '<g clip-path="url(#bgDedans)">' + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${f(15 + i * 2)}" cy="40" r="${f(0.35 + (i % 3) * 0.15)}" fill="#FFFFFF" opacity="0">`
    + `<animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? 1 : -1} -12;${i % 2 ? -0.5 : 0.8} -24" dur="${f(3 + i * 0.35)}s" begin="${f(-i * 0.6)}s" repeatCount="indefinite"/>`
    + `<animate attributeName="opacity" values="0;0.9;0" dur="${f(3 + i * 0.35)}s" begin="${f(-i * 0.6)}s" repeatCount="indefinite"/></circle>`).join('') + '</g>';
  // les reflets de verre : une longue courbe à gauche, une goutte en haut, un liseré à droite
  s += '<path d="M14.6,22 Q11.4,28 12,35" fill="none" stroke="url(#bgReflet)" stroke-width="1.3" stroke-linecap="round"/>'
    + '<ellipse cx="17.6" cy="19.6" rx=".55" ry=".9" fill="#FFFFFF" opacity=".85" transform="rotate(25 17.6 19.6)"/>'
    + '<path d="M27.4,28 Q29.4,33 28,38" fill="none" stroke="#E6FBFF" stroke-width=".6" stroke-linecap="round" opacity=".7"/>';
  // les joues, les yeux (le regard du jeu, en plus profond et plus brillant) qui clignent doucement
  s += '<ellipse cx="14.6" cy="34.4" rx="2" ry="1.2" fill="url(#bgJoue)"/><ellipse cx="25.4" cy="34.4" rx="2" ry="1.2" fill="url(#bgJoue)"/>';
  const oeil = x => `<ellipse cx="${x}" cy="31.55" rx="1.42" ry="1.98" fill="url(#bgOeil)"/><ellipse cx="${f(x + 0.55)}" cy="30.5" rx=".66" ry=".66" fill="#FFFFFF"/>`
    + `<ellipse cx="${f(x - 0.5)}" cy="32.6" rx=".32" ry=".32" fill="#FFFFFF"/><ellipse cx="${f(x - 0.2)}" cy="32.9" rx=".9" ry=".35" fill="#7FB8FF" opacity=".45"/>`;
  s += `<g transform="translate(0 31.55)"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 0.1;1 1;1 1" keyTimes="0;0.92;0.95;0.98;1" calcMode="spline" keySplines="${SPL};${SPL};${SPL};${SPL}" dur="5.5s" repeatCount="indefinite"/>`
    + `<g transform="translate(0 -31.55)">${oeil(16.8)}${oeil(23.2)}</g></g></g>`;
  return s;
}

module.exports = { brumeHeroine };
