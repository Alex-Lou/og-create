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
// un éclair). Brume, c'est une goutte de flamme et deux yeux : lui aussi, rien de plus (ni bouche, ni cornes, ni
// marques) ; tout est dans le rendu. La goutte brûle : elle s'embrase en langues de feu qui montent, en trois couches
// (cramoisi, orangé, or), chacune au trait fin et à sa fibre ; dedans, le feu sombre en haut, chauffé à blanc en bas,
// ses filaments et son grain ; deux yeux en amande, inclinés, qui brûlent. Immobile (comme tout l'écran :
// preview_splash.js). Même repère que Brume ; les flammes débordent son cadre de 40 × 48 (l'image de Brume a de la
// place autour : x de -8 à 48, y de -8 à 57).
const SOMBRE = '#3E0806';
// Une langue de feu : sa base en (x, y), sa demi-largeur w, sa hauteur h ; sa pointe penche de p, sa taille ondule de o
function langue(x, y, w, h, p, o) {
  const tx = x + p, ty = y - h;
  return `M${f(x - w)},${f(y)} C${f(x - w * 1.25)},${f(y - h * 0.4)} ${f(x + p * 0.5 - w * 0.55 + o)},${f(y - h * 0.68)} ${f(tx)},${f(ty)}`
    + ` C${f(x + p * 0.45 + w * 0.3 + o)},${f(y - h * 0.62)} ${f(x + w * 1.15)},${f(y - h * 0.35)} ${f(x + w)},${f(y)} Q${f(x)},${f(y + w * 1.1)} ${f(x - w)},${f(y)} Z`;
}
// sa fibre : un trait de la base vers la pointe, qui suit son ondulation
const fibre = (x, y, w, h, p, o) => `M${f(x)},${f(y)} Q${f(x + p * 0.35 + o * 0.6)},${f(y - h * 0.55)} ${f(x + p * 0.86)},${f(y - h * 0.86)}`;
function couche(liste, fill, trait, fibreC) {
  return `<g fill="${fill}" stroke="${trait}" stroke-width=".38" stroke-linejoin="round">${liste.map(l => `<path d="${langue(...l)}"/>`).join('')}</g>`
    + `<path d="${liste.map(l => fibre(...l)).join(' ')}" fill="none" stroke="${fibreC}" stroke-width=".24" stroke-linecap="round" opacity=".75"/>`;
}
function brumeDemon() {
  const g = rnd(23);
  const defs = '<defs>'
    + rayonne('bdHalo', 20, 26, 26, [[0, '#FF8A2A', 0.7], [0.45, '#E2401E', 0.32], [1, '#C8301C', 0]])
    + rayonne('bdChaleur', 20, 31, 14.5, [[0, '#FFC24A', 0.55], [0.7, '#FF8A2A', 0.3], [1, '#FF8A2A', 0]])
    + degrade('bdLoin', 0, -4, 0, 30, [[0, '#7A1410'], [1, '#C8301C']])
    + degrade('bdMi', 0, 0, 0, 30, [[0, '#E2501E'], [1, '#FF8A2A']])
    + degrade('bdPres', 0, 4, 0, 26, [[0, '#FFB43C'], [1, '#FFE08A']])
    + rayonne('bdCorps', 20, 38.5, 25, [[0, '#FFF8DC'], [0.18, '#FFD866'], [0.42, '#F2782A'], [0.7, '#B8261A'], [1, '#5E0C0A']])
    + rayonne('bdOeil', 0.5, 0.55, 0.6, [[0, '#FFFFFF'], [0.45, '#FFF4C0'], [0.8, '#FFC650'], [1, '#FF8A2A']]).replace('gradientUnits="userSpaceOnUse" ', '')
    + rayonne('bdLueur', 0.5, 0.5, 0.5, [[0, '#FFE08A', 0.7], [0.5, '#FFB43C', 0.25], [1, '#FF8A2A', 0]]).replace('gradientUnits="userSpaceOnUse" ', '')
    + `<clipPath id="bdDedans"><path d="${flamme(0)}"/></clipPath>`
    + '</defs>';
  let s = defs + '<ellipse cx="20" cy="26" rx="26" ry="30" fill="url(#bdHalo)"/>';
  // les langues de feu, du fond vers l'avant : elles naissent dans la goutte et montent au-dessus d'elle
  s += couche([[20, 27, 3.6, 31, 1.2, -2.2], [14.6, 31, 3.4, 25, -5, 2.4], [25.4, 31, 3.4, 24, 5.4, -2.6], [12, 37, 3, 19, -8.4, 2],
    [28, 37, 3, 18, 8.6, -1.8], [17.2, 29, 2.8, 27, -2.6, 2.6], [23, 29, 2.8, 28, 3.2, -2.8]], 'url(#bdLoin)', SOMBRE, '#E2501E');
  s += couche([[20, 25, 2.8, 25, -1.4, 2], [15.8, 30, 2.6, 20, -4.2, -1.8], [24.2, 30, 2.6, 21, 4, 2], [13, 36, 2.2, 14, -6, 1.4],
    [27, 36, 2.2, 15, 6.4, -1.4]], 'url(#bdMi)', '#6A1008', '#FFB43C');
  s += couche([[20, 23, 1.9, 17, 1, -1.4], [17.4, 26, 1.7, 13, -2.6, 1.2], [22.6, 26, 1.7, 14, 2.8, -1]], 'url(#bdPres)', '#A8261A', '#FFF2C0');
  // une chaleur vive tout autour de la goutte : elle se détache des flammes
  s += '<ellipse cx="20" cy="31" rx="14" ry="15" fill="url(#bdChaleur)"/>';
  // la goutte : le feu sombre en haut, chauffé à blanc en bas ; au bord, une chaleur plus vive, dedans
  s += `<path d="${flamme(0)}" fill="url(#bdCorps)"/>`;
  s += `<g clip-path="url(#bdDedans)"><path d="${flamme(0)}" fill="none" stroke="#FF7A2A" stroke-width="2.2" opacity=".35"/>`;
  // ses filaments : des fibres qui montent du cœur et suivent sa forme
  s += '<path d="M14,40.4 Q12.6,31 18.4,19.6 M26,40.4 Q27.4,31 21.6,19.6 M16.6,40.8 Q16,32 19.2,23.4 M23.4,40.8 Q24,32 20.8,23.4 M11.6,39.4 Q10.4,33.6 13.6,27.4 M28.4,39.4 Q29.6,33.6 26.4,27.4"'
    + ' fill="none" stroke="#7A1410" stroke-width=".28" stroke-linecap="round" opacity=".55"/>'
    + '<path d="M18.2,40.6 Q17.6,36 19.4,30.4 M21.8,40.6 Q22.4,36 20.6,30.4" fill="none" stroke="#FFF2C0" stroke-width=".3" stroke-linecap="round" opacity=".6"/>';
  // son grain : de petits points clairs, plus serrés vers le cœur
  for (let i = 0; i < 170; i++) {
    const x = 8.5 + g() * 23, y = 14 + Math.pow(g(), 0.6) * 27;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.08 + g() * 0.16)}" fill="#FFF4D0" opacity="${f(0.2 + g() * 0.5)}"/>`;
  }
  s += '</g>';
  s += `<path d="${flamme(0)}" fill="none" stroke="${SOMBRE}" stroke-width=".9" stroke-linejoin="round"/>`;
  // les deux yeux : en amande, inclinés vers le dedans (le haut presque droit : le regard dur), qui brûlent ; leur lueur
  s += [[16.6, 1], [23.4, -1]].map(([x, k]) => {
    const dx = k * 2.7;
    const oeil = `M${f(x - dx)},${f(30.2)} Q${f(x - dx * 0.1)},${f(30)} ${f(x + dx)},${f(32.1)} Q${f(x + dx * 0.15)},${f(35.4)} ${f(x - dx)},${f(30.2)} Z`;
    return `<ellipse cx="${f(x)}" cy="32.4" rx="4.4" ry="3.6" fill="url(#bdLueur)"/>`
      + `<path d="${oeil}" fill="url(#bdOeil)" stroke="${SOMBRE}" stroke-width=".5" stroke-linejoin="round"/>`
      + `<ellipse cx="${f(x + k * 0.2)}" cy="32.3" rx="1.2" ry=".75" fill="#FFFFFF" opacity=".9" transform="rotate(${f(k * 26)} ${f(x + k * 0.2)} 32.3)"/>`;
  }).join('');
  // quelques braises qui montent avec les flammes
  s += [[6, 12, 0.28], [34, 10, 0.26], [13, 0, 0.24], [27, -2, 0.24], [20, -6, 0.22]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${f(r * 3)}" fill="#FFB43C" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF0B0"/>`).join('');
  return s;
}

module.exports = { brumeHeroine, brumeDemon };
