// Brume en très grand, au premier plan de l'écran de démarrage (splash.js) : son dessin du jeu (brume.js, stade s1 :
// la flamme bleue, son cœur clair, ses yeux, ses joues), même forme, mêmes couleurs, avec un rendu fait pour être vu
// de près : une flamme vitrée qui ondule (sa pointe se balance, deux langues de feu s'en échappent), une lumière
// intérieure qui respire, des reflets de verre, des particules qui montent dedans ; elle cligne doucement des yeux.
// Repère : celui de son dessin (40 × 48 ; la flamme va de y = 13,5, la pointe, à y = 41, la base).
const { degrade, rayonne } = require('./splash_anya').outils;
const { f, rnd, palpite } = require('./scenes7').outils;

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
    + `<clipPath id="bgDedans"><path d="${flamme(0, 0.9)}"/></clipPath>`
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

// Son autre visage, pour l'orage (choix de l'auteur, 17 oct. : un démon de feu, qu'on ne voit qu'un instant, à travers
// un éclair ; une goutte de flamme et deux yeux, rien de plus ; un aspect sérieux, pas une caricature). Ni trait noir ni
// forme dessinée : tout se lit à la lumière. La goutte est une matière calcinée, sombre, veinée de braise, éclairée sur
// ses bords par le feu qui la dévore ; au-dessus d'elle, de vraies flammes, fines, ondulantes, qui s'effilent en
// transparence (rouge sombre derrière, puis orangé, or, et un cœur presque blanc) ; deux fentes de lumière pour les
// yeux. Immobile (comme tout l'écran : preview_splash.js). Même repère que Brume ; les flammes débordent son cadre de
// 40 × 48 (l'image de Brume a de la place autour : x de -8 à 48, y de -8 à 57). Pas de filtre : tout aux dégradés.
// Une langue de feu : sa base en (x, y), sa demi-largeur w, sa hauteur h ; sa pointe penche de p, sa taille ondule de o
function langue(x, y, w, h, p, o) {
  return `M${f(x - w)},${f(y)} C${f(x - w * 1.1)},${f(y - h * 0.3)} ${f(x + p * 0.4 - w * 0.45 + o)},${f(y - h * 0.62)} ${f(x + p)},${f(y - h)}`
    + ` C${f(x + p * 0.35 + w * 0.15 + o)},${f(y - h * 0.58)} ${f(x + w * 1.05)},${f(y - h * 0.3)} ${f(x + w)},${f(y)} Q${f(x)},${f(y + w)} ${f(x - w)},${f(y)} Z`;
}
// Une couche de flammes, tirées au hasard au-dessus de la goutte (n, leur hauteur, leur largeur), dans un dégradé qui
// s'efface vers la pointe
function flammes(g, n, hMin, hMax, wMin, wMax, fill) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = 11 + t * 18 + (g() - 0.5) * 1.6, centre = 1 - Math.abs(t - 0.5) * 2;
    const y = 33 - centre * 12 + g() * 2.4, h = Math.min(y + 6.5, (hMin + g() * (hMax - hMin)) * (0.55 + centre * 0.6));
    d += `<path d="${langue(x, y, wMin + g() * (wMax - wMin), h, (t - 0.5) * 7 + (g() - 0.5) * 4, (g() - 0.5) * 3.2)}"/>`;
  }
  return `<g fill="${fill}">${d}</g>`;
}
// Une veine de braise : une fêlure brisée, sa lueur large et pâle, son cœur vif
const veine = (pts, w) => {
  const d = `M${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}`;
  return `<path d="${d}" fill="none" stroke="#FF6A1E" stroke-width="${f(w * 3.4)}" stroke-linecap="round" stroke-linejoin="round" opacity=".22"/>`
    + `<path d="${d}" fill="none" stroke="#FFB43C" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
};
function brumeDemon() {
  const g = rnd(29);
  const monte = (id, stops) => `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  const defs = '<defs>'
    + rayonne('bdHalo', 20, 24, 27, [[0, '#E2501E', 0.55], [0.45, '#9E1C12', 0.25], [1, '#6A0E0C', 0]])
    + monte('bdRouge', [[0, '#8E1A10', 0.95], [0.55, '#B82A16', 0.6], [1, '#C8381A', 0]])
    + monte('bdOrange', [[0, '#F2701E', 0.95], [0.6, '#E2501E', 0.55], [1, '#E2501E', 0]])
    + monte('bdOr', [[0, '#FFD06A', 0.95], [0.5, '#FFA83A', 0.55], [1, '#FF8A2A', 0]])
    + monte('bdBlanc', [[0, '#FFF8E0', 0.95], [0.6, '#FFE6A0', 0.5], [1, '#FFD06A', 0]])
    + rayonne('bdCorps', 20, 29, 15, [[0, '#2A0A06'], [0.55, '#1C0604'], [0.85, '#3A0C08'], [1, '#6A1A0C']])
    + rayonne('bdFoyer', 20, 42, 12, [[0, '#FFE6A0', 0.95], [0.3, '#FF9A2E', 0.7], [0.7, '#E2401E', 0.25], [1, '#E2401E', 0]])
    + rayonne('bdLueur', 0.5, 0.5, 0.5, [[0, '#FFE08A', 0.75], [0.4, '#FF9A2E', 0.35], [1, '#E2401E', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
    + rayonne('bdOeil', 0.5, 0.5, 0.5, [[0, '#FFFFFF'], [0.4, '#FFF2C0'], [0.8, '#FFB43C'], [1, '#FF7A1E', 0.6]]).replace('gradientUnits="userSpaceOnUse" ', '')
    + `<clipPath id="bdDedans"><path d="${flamme(0)}"/></clipPath>`
    + '</defs>';
  let s = defs + '<ellipse cx="20" cy="24" rx="27" ry="31" fill="url(#bdHalo)"/>';
  // les flammes, du fond vers l'avant
  s += flammes(g, 15, 22, 36, 2.2, 3.6, 'url(#bdRouge)');
  s += flammes(g, 12, 16, 28, 1.6, 2.8, 'url(#bdOrange)');
  s += flammes(g, 9, 11, 20, 1.1, 2, 'url(#bdOr)');
  s += flammes(g, 5, 7, 12, 0.7, 1.3, 'url(#bdBlanc)');
  // la goutte : la matière calcinée ; ses bords éclairés par le feu ; le foyer en bas ; ses veines de braise
  s += `<path d="${flamme(0)}" fill="url(#bdCorps)"/><g clip-path="url(#bdDedans)">`;
  s += `<path d="${flamme(0)}" fill="none" stroke="#E2501E" stroke-width="2.6" opacity=".55"/>`
    + `<path d="${flamme(0)}" fill="none" stroke="#FFB43C" stroke-width=".8" opacity=".7"/>`
    + '<ellipse cx="20" cy="42" rx="12" ry="9" fill="url(#bdFoyer)"/>';
  s += veine([[20, 41], [19.2, 38.6], [20.4, 36.8], [19.6, 35.2]], 0.32) + veine([[13.4, 39.6], [14.8, 37.4], [14.2, 35.6], [15.6, 34.2]], 0.26)
    + veine([[26.8, 39.8], [25.4, 37.8], [26.2, 36], [24.8, 34.6]], 0.26) + veine([[11.4, 36], [12.6, 34.8], [12.2, 33.2]], 0.2)
    + veine([[28.8, 35.6], [27.6, 34.6], [28, 33]], 0.2);
  s += '</g>';
  // les yeux : deux fentes de lumière, inclinées vers le dedans, et leur lueur sur la matière autour
  s += [[16.5, 1], [23.5, -1]].map(([x, k]) => `<ellipse cx="${f(x)}" cy="31.8" rx="4.2" ry="2.8" fill="url(#bdLueur)"/>`
    + `<path d="M${f(x - k * 2.8)},${f(30.6)} Q${f(x - k * 0.4)},${f(30.9)} ${f(x + k * 2.4)},${f(32.5)} Q${f(x - k * 0.2)},${f(33.2)} ${f(x - k * 2.8)},${f(30.6)} Z" fill="url(#bdOeil)"/>`).join('');
  // des braises qui montent, avec leur traînée
  s += [[8, 10, 0.2], [32, 8, 0.18], [14, -2, 0.16], [26, -5, 0.16], [36, 18, 0.14], [4, 20, 0.14]]
    .map(([x, y, r]) => `<path d="M${x},${f(y + 2.4)} L${x},${y}" stroke="#FF9A2E" stroke-width="${f(r * 1.4)}" stroke-linecap="round" opacity=".4"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF0C0"/>`).join('');
  return s;
}

module.exports = { brumeHeroine, brumeDemon };
