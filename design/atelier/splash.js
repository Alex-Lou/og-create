// L'écran de démarrage (index.html, #splash), en deux calques SVG animés en SMIL (ils bougent d'eux-mêmes, en <img>) :
// - fond() : le décor plein écran, recadré à toutes les tailles (xMidYMid slice) : la nuit, la lune, la mer qui roule ;
//   l'île au centre avec ses constructions, ses lanternes et sa fumée ; Anya sur la colline, devant la lune, son halo et
//   ses lucioles ; des nappes de brume. Ce qui compte tient au centre (sur un téléphone en hauteur, on ne voit que la
//   bande du milieu, 460 de large sur 1600), et au-dessus de y = 580 (l'avant-plan couvre le bas).
// - heros(choix) : l'avant-plan, posé en bas de l'écran : un avatar (tiré au hasard par le jeu parmi ceux qu'on écrit)
//   qui fait un clin d'œil et lève le pouce vers nous ; à sa droite, Brume et le Grimoire qui flottent, reliés par des
//   étincelles.
// Pas de filtre (le flou se fait aux dégradés), tout mouvement adouci, des durées décalées.
const fs = require('fs');
const path = require('path');
const { OUT, P, E, L, arm, frame } = require('./troupe');
const { anyaVeille, outils: { eclairer } } = require('./splash_anya');
const { brumeHeroine } = require('./splash_brume');
const { ileVivante } = require('./splash_ile');
const { avatar } = require('../personnages/avatar.js');
const { f, lin, rad, rnd, SPLINE, vaVient, defile, palpite, halo, nappeDouce, houle } = require('./scenes7').outils;

const BIB = path.join(__dirname, '..', 'bibliotheque', 'svg');
const FOND = [1600, 1000];
const AVANT = [900, 1000];

// Un dessin de la bibliothèque posé dans un autre : son contenu, ses identifiants préfixés (deux dessins posés ensemble
// ne partagent jamais un identifiant) ; son point d'ancrage (ax, ay) tombe en (x, y), à l'échelle s
const corpsDe = (rel, prefixe) => fs.readFileSync(path.join(BIB, rel), 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  .replace(/id="([^"]+)"/g, `id="${prefixe}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefixe}$1)`).replace(/href="#([^"]+)"/g, `href="#${prefixe}$1"`);
function poser(rel, prefixe, x, y, s, [ax, ay] = [0, 0]) {
  return `<g transform="translate(${f(x - ax * s)} ${f(y - ay * s)}) scale(${f(s)})">${corpsDe(rel, prefixe)}</g>`;
}
// Une animation qui suit une suite de valeurs, adoucie à chaque étape (spline), sans fin
const suite = (attr, values, keyTimes, dur, begin = 0, type) => {
  const n = values.split(';').length - 1;
  const splines = Array(n).fill('0.45 0 0.55 1').join(';');
  return type
    ? `<animateTransform attributeName="transform" type="${type}" values="${values}" keyTimes="${keyTimes}" calcMode="spline" keySplines="${splines}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" additive="sum"/>`
    : `<animate attributeName="${attr}" values="${values}" keyTimes="${keyTimes}" calcMode="spline" keySplines="${splines}" dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"/>`;
};

// ═══ le fond ═══
// Les étoiles : petites, de tailles et de rythmes différents ; les plus grosses ont une croix de lumière
function ciel() {
  const [W] = FOND, g = rnd(29);
  let s = '';
  for (let i = 0; i < 90; i++) {
    const x = f(g() * W), y = f(g() * 380), r = f(0.7 + g() * 1.5), d = f(2.4 + g() * 3.4);
    s += i % 3 ? `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6DC" opacity=".7"/>` : `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6DC">${palpite('opacity', '0.9;0.25;0.9', d, g() * d)}</circle>`;
    if (r > 1.9) s += `<path d="M${x},${f(y - r * 3.4)} L${x},${f(y + r * 3.4)} M${f(x - r * 3.4)},${y} L${f(x + r * 3.4)},${y}" stroke="#FFF6DC" stroke-width="0.6" opacity=".5"/>`;
  }
  // une étoile filante, rare
  s += `<g opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.86;0.88;0.95;1" dur="11s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;0 0;260 110;260 110" keyTimes="0;0.86;0.95;1" dur="11s" repeatCount="indefinite"/><path d="M380,70 l-70,-30" stroke="#FFF6DC" stroke-width="2" stroke-linecap="round" opacity=".8"/><circle cx="380" cy="70" r="2.4" fill="#FFFFFF"/></g>`;
  return s;
}
// Un nuage doux : des bulles à dégradé radial (sans trait), qui glisse lentement
const nuage = (id, x, y, k, a, dur, dx, begin = 0) => `<defs>${rad(id, [[0, '#C9DDF0', a], [0.6, '#8FB0D2', a * 0.45], [1, '#5E7FA8', 0]])}</defs><g>${vaVient('translate', `${-dx} 0`, `${dx} 0`, dur, begin)}`
  + [[-90, 6, 120, 34], [0, -12, 150, 46], [100, 0, 130, 38], [190, 12, 90, 26], [-170, 14, 80, 22]].map(([cx, cy, rx, ry]) => `<ellipse cx="${f(x + cx * k)}" cy="${f(y + cy * k)}" rx="${f(rx * k)}" ry="${f(ry * k)}" fill="url(#${id})"/>`).join('') + '</g>';
// Un îlot lointain, à l'horizon : une silhouette bleutée, presque fondue dans la brume
const ilot = (d, couleur) => P(d, couleur, 0);
// Une luciole qui tourne autour d'un point, sur une ellipse, et scintille
const luciole = (cx, cy, rx, ry, dur, begin, r = 2.2) => `<g data-mouvant=""><animateMotion dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite" path="M${f(cx + rx)},${f(cy)} A${f(rx)},${f(ry)} 0 1,1 ${f(cx - rx)},${f(cy)} A${f(rx)},${f(ry)} 0 1,1 ${f(cx + rx)},${f(cy)}"/>`
  + `<circle r="${f(r * 3)}" fill="rgb(255,236,150)" opacity=".28">${palpite('opacity', '0.1;0.4;0.1', f(dur / 3), begin)}</circle><circle r="${f(r)}" fill="#FFF6C0">${palpite('opacity', '0.4;1;0.4', f(dur / 3), begin)}</circle></g>`;

function fond() {
  const [W, H] = FOND, HZ = 430, CX = 800;
  let s = `<defs>${lin('spCiel', [[0, '#050C22'], [0.42, '#0F2246'], [0.8, '#2A4874'], [1, '#5B789E']])}`
    + `${rad('spAube', [[0, '#FFC9A0', 0.32], [0.5, '#E89A7A', 0.1], [1, '#E89A7A', 0]])}`
    + `${rad('spLune', [[0, '#FFFDF2'], [0.55, '#F7E7B0'], [1, '#D9B060']], 0.38, 0.32, 0.75)}`
    + `${rad('spHaloL', [[0, '#FFF2B8', 0.5], [0.4, '#DCEBFF', 0.16], [1, '#B9E2F0', 0]])}`
    + `${rad('spAura', [[0, '#FFF3B0', 0.6], [0.45, '#FFD86A', 0.2], [1, '#FFD86A', 0]])}`
    + `${lin('spHaut', [[0, '#030814', 0.75], [1, '#030814', 0]])}`
    + `${lin('spBas', [[0, '#030814', 0], [1, '#030814', 0.6]])}</defs>`;
  // le ciel, une lueur d'aube derrière l'île, la lune et son halo qui respire
  s += `<rect width="${W}" height="${HZ + 4}" fill="url(#spCiel)"/><ellipse cx="${CX}" cy="${HZ}" rx="700" ry="170" fill="url(#spAube)"/>` + ciel();
  s += `<circle cx="${CX}" cy="245" r="320" fill="url(#spHaloL)">${palpite('r', '280;320;280', 7)}</circle>`
    + `<g>${vaVient('translate', '0 0', '0 -4', 12)}<circle cx="${CX}" cy="245" r="120" fill="url(#spLune)" stroke="#FFF0B6" stroke-opacity=".6" stroke-width="3"/>`
    + [[728, 200, 20], [880, 280, 14], [742, 310, 10], [870, 180, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#D2A458" opacity=".18"/><path d="M${x - r * 0.7},${y + r * 0.5} a${r},${r} 0 0,0 ${r * 1.4},0" fill="none" stroke="#FFF8DA" stroke-width="1.6" opacity=".35"/>`).join('') + '</g>';
  s += nuage('spN1', 300, 150, 1.1, 0.22, 46, 60) + nuage('spN2', 1290, 110, 1.3, 0.18, 58, 70, 20) + nuage('spN3', 1080, 330, 0.9, 0.2, 40, 50, 9) + nuage('spN4', 470, 340, 0.8, 0.16, 52, 55, 30);
  // la mer (une houle de 400 de large, étirée sur toute la largeur) et deux îlots au loin
  s += `<g transform="scale(4 1)">${houle('spMer', HZ, H, { haut: '#2E5878', bas: '#081A35', vague: '#3E719A', ecume: '#CFE6F2' }, { vitesse: 0.55, lum: { x: 200, rgb: '255,236,180', a: 0.55 } })}</g>`;
  s += ilot(`M60,${HZ + 2} Q120,${HZ - 34} 200,${HZ - 26} Q270,${HZ - 52} 350,${HZ - 18} Q400,${HZ - 6} 430,${HZ + 2} Z`, '#24405F')
    + ilot(`M1190,${HZ + 2} Q1250,${HZ - 30} 1330,${HZ - 34} Q1420,${HZ - 58} 1490,${HZ - 20} Q1540,${HZ - 8} 1580,${HZ + 2} Z`, '#203A58');
  s += `<g transform="scale(4 1)">${nappeDouce('spB1', HZ - 6, 0.3, 24, 10, 0.8, '210,226,242', 3)}</g>`;
  // Anya, immense, derrière l'île : la gardienne qui veille, les mains ouvertes ; son aura respire, des lucioles
  // tournent autour d'elle
  const ka = 3.2;
  s += `<ellipse cx="${CX}" cy="300" rx="250" ry="280" fill="url(#spAura)">${palpite('rx', '235;265;235', 5.2)}${palpite('ry', '265;295;265', 5.2)}</ellipse>`
    + `<g transform="translate(${f(CX - 40 * ka)} ${f(176 - 4 * ka)}) scale(${ka})">${anyaVeille()}</g>`
    + [[CX, 260, 190, 70, 11, 0], [CX, 330, 230, 50, 14, 3], [CX, 220, 140, 110, 12, 5], [CX - 20, 380, 250, 40, 16, 7], [CX + 30, 200, 110, 60, 9, 2]].map(([cx, cy, rx, ry, d, b]) => luciole(cx, cy, rx, ry, d, b)).join('');
  // l'île des naufragés, dessinée pour cet écran (splash_ile.js), devant elle
  s += `<g transform="translate(${CX} 470) scale(.78)">${ileVivante()}</g>`;
  // la brume devant l'île, puis le voile du haut (le logo s'y lit) et du bas (l'avant-plan s'y pose)
  s += `<g transform="scale(4 1)">${nappeDouce('spB2', 640, 0.24, 20, 12, 1, '214,232,244', 5)}${nappeDouce('spB3', 780, 0.18, 26, 10, 1.3, '200,220,238', 7)}</g>`;
  s += `<rect width="${W}" height="220" fill="url(#spHaut)"/><rect y="${H - 300}" width="${W}" height="300" fill="url(#spBas)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
}

// ═══ l'affiche ═══
// Le Grimoire ouvert, de près, qui flotte : la couverture de cuir et ses coins de laiton, deux pages bombées où luisent
// des signes, une page qui tourne sans fin, le signet qui se balance ; une colonne de lumière monte de sa reliure
const SCEAUX = ['#E8584A', '#F2C04B', '#7EC45B', '#5EA8E8', '#B07EE0', '#F28A2E', '#E8E4DA'];
function livre(x, y) {
  const page = (sx) => `M0,-6 Q${70 * sx},-30 ${140 * sx},-12 L${136 * sx},34 Q${70 * sx},16 0,40 Z`;
  const tourne = ['M0,-6 Q70,-30 140,-12 L136,34 Q70,16 0,40 Z', 'M0,-6 Q14,-86 30,-140 L26,-96 Q12,-40 0,40 Z', 'M0,-6 Q-70,-30 -140,-12 L-136,34 Q-70,16 0,40 Z'];
  let s = `<defs>${lin('spCuir', [[0, '#8A4A2C'], [0.5, '#5E2E1C'], [1, '#2E1610']])}${lin('spPage', [[0, '#FFFBEA'], [0.6, '#F4E4BC'], [1, '#D8BC86']])}`
    + `${lin('spPageD', [[0, '#D8BC86'], [0.4, '#F4E4BC'], [1, '#FFFBEA']], 1, 0)}${lin('spRayon', [[0, '#FFF6C8', 0], [0.55, '#FFF0B0', 0.35], [1, '#FFE8A0', 0.75]])}`
    + `${rad('spSous', [[0, '#FFE69A', 0.65], [0.5, '#FFC860', 0.2], [1, '#FFC860', 0]])}</defs>`;
  s += `<ellipse cx="${x}" cy="${y + 20}" rx="230" ry="90" fill="url(#spSous)">${palpite('rx', '210;245;210', 3.2)}</ellipse>`;
  s += `<g transform="translate(${x} ${y})"><g>${vaVient('translate', '0 0', '0 -10', 3.6)}${vaVient('rotate', '-5', '-1', 5.2, 1)}`
    // la colonne de lumière, de la reliure vers Brume
    + `<path d="M-46,0 L-120,-420 L120,-420 L46,0 Z" fill="url(#spRayon)" transform="scale(1 1)">${palpite('opacity', '0.55;0.9;0.55', 2.6)}</path>`
    // la couverture, les coins de laiton, les tranches des pages
    + P('M-158,6 Q-80,-14 0,8 Q80,-14 158,6 L150,52 Q78,34 0,60 Q-78,34 -150,52 Z', 'url(#spCuir)', 3.4)
    + [[-152, 30], [152, 30]].map(([cx, cy]) => `<path d="M${cx},${cy - 22} l${cx < 0 ? 14 : -14},2 l${cx < 0 ? -2 : 2},20 Z" fill="#E8C060" stroke="${OUT}" stroke-width="2"/>`).join('')
    + P('M-144,-6 Q-70,-26 0,-2 L0,46 Q-70,24 -140,40 Z', '#E4CC98', 2.4) + P('M144,-6 Q70,-26 0,-2 L0,46 Q70,24 140,40 Z', '#E4CC98', 2.4)
    + [0, 4, 8].map(d => `<path d="M-140,${f(36 - d * 0.4 + 4)} Q-70,${f(20 + d)} 0,${f(42 + d * 0.3)} Q70,${f(20 + d)} 140,${f(40 - d * 0.4)}" fill="none" stroke="#B89A68" stroke-width="1.2" opacity=".8"/>`).join('')
    // les deux pages, leurs lignes d'écriture, les sept signes qui luisent
    + P(page(-1), 'url(#spPage)', 2.6) + P(page(1), 'url(#spPageD)', 2.6)
    + [-1, 1].map(sx => [0, 1, 2, 3, 4].map(i => `<path d="M${f(sx * 22)},${f(4 + i * 6)} Q${f(sx * 70)},${f(-16 + i * 6)} ${f(sx * 118)},${f(-4 + i * 7)}" fill="none" stroke="#9A7A50" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="${8 + i * 3} 5" opacity=".45"/>`).join('')).join('')
    + SCEAUX.map((c, i) => { const px = -112 + i * 37 + (i > 2 ? 10 : 0), py = -2 + Math.abs(i - 3) * -3; return `<circle cx="${f(px)}" cy="${f(py)}" r="5" fill="${c}" opacity=".9">${palpite('opacity', '0.4;1;0.4', 2.2, i * 0.31)}</circle>`; }).join('')
    // la page qui tourne, et sa lumière qui passe
    + `<path d="${tourne[0]}" fill="#FFFBEA" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round" opacity="0"><animate attributeName="d" values="${tourne[0]};${tourne[0]};${tourne[1]};${tourne[2]};${tourne[2]}" keyTimes="0;0.55;0.75;0.95;1" calcMode="spline" keySplines="0 0 1 1;0.4 0 0.6 1;0.4 0 0.6 1;0 0 1 1" dur="6s" repeatCount="indefinite"/>`
    + `<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.54;0.56;0.93;1" dur="6s" repeatCount="indefinite"/></path>`
    // le signet rouge qui pend et se balance
    + `<g transform="translate(6 52)"><g>${vaVient('rotate', '-10', '8', 2.8)}${P('M-5,0 Q-8,30 -2,58 L4,50 L9,58 Q12,30 6,0 Z', '#C8463A', 2)}</g></g>`
    + '</g></g>';
  return s;
}
// Brume, en très grand au premier plan (splash_brume.js), qui flotte et se balance d'un rien
function brumeGrande(x, y, k) {
  return `<g transform="translate(${f(x)} ${f(y)})"><g>${vaVient('translate', '0 0', `0 ${f(-k * 0.6)}`, 3)}${vaVient('rotate', '-1.5', '1.5', 4.6)}`
    + `<g transform="translate(${f(-20 * k)} ${f(-41 * k)}) scale(${f(k)})">${brumeHeroine()}</g></g></g>`;
}
// Des ondes de lumière qui partent de Brume et s'élargissent en s'effaçant, l'une après l'autre
function ondes(x, y) {
  return [0, 1, 2].map(i => `<ellipse cx="${x}" cy="${y}" rx="40" ry="14" fill="none" stroke="#BFEFFF" stroke-width="3" opacity="0">`
    + `<animate attributeName="rx" values="40;300" dur="4.2s" begin="${f(-i * 1.4)}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.4 1"/>`
    + `<animate attributeName="ry" values="14;90" dur="4.2s" begin="${f(-i * 1.4)}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.4 1"/>`
    + `<animate attributeName="opacity" values="0;0.7;0" keyTimes="0;0.15;1" dur="4.2s" begin="${f(-i * 1.4)}s" repeatCount="indefinite"/></ellipse>`).join('');
}
// Le cercle de runes, couché sous le Grimoire, qui tourne lentement (deux anneaux en sens contraires)
function cercle(x, y) {
  const anneau = (r, sens, dur, tirets, larg, a) => `<g><animateTransform attributeName="transform" type="rotate" values="0;${sens * 360}" dur="${dur}s" repeatCount="indefinite"/>`
    + `<circle r="${r}" fill="none" stroke="#FFE6A0" stroke-width="${larg}" stroke-dasharray="${tirets}" opacity="${a}"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(1 0.3)">${palpite('opacity', '0.7;1;0.7', 3)}`
    + anneau(250, 1, 60, '2 10 18 10', 3, 0.7) + anneau(222, -1, 44, '30 8 4 8', 2, 0.5) + anneau(200, 1, 80, '1 6', 4, 0.4)
    + SCEAUX.map((c, i) => { const t = i / 7 * Math.PI * 2; return `<circle cx="${f(Math.cos(t) * 236)}" cy="${f(Math.sin(t) * 236)}" r="9" fill="${c}" opacity=".85"/>`; }).join('') + '</g>';
}
// Des rayons qui tournent lentement derrière Brume, chacun respire à son rythme
function rayons(x, y) {
  return `<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="rotate" values="0;360" dur="90s" repeatCount="indefinite"/>`
    + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<path d="M0,0 L${f(Math.cos(i * 0.5236 - 0.05) * 420)},${f(Math.sin(i * 0.5236 - 0.05) * 420)} L${f(Math.cos(i * 0.5236 + 0.05) * 420)},${f(Math.sin(i * 0.5236 + 0.05) * 420)} Z" fill="url(#spRai)" opacity="${f(0.25 + (i % 3) * 0.12)}"/>`).join('')
    + '</g></g>';
}
// Les sept sceaux, des perles de couleur qui tournent autour de Brume
const sceaux = (cx, cy, rx, ry, dur) => SCEAUX.map((c, i) => `<g><animateMotion dur="${dur}s" begin="${f(-i * dur / 7)}s" repeatCount="indefinite" path="M${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy}"/>`
  + `<circle r="22" fill="${c}" opacity=".22">${palpite('r', '17;24;17', 2, i * 0.3)}</circle><circle r="9" fill="${c}" stroke="${OUT}" stroke-width="2"/><circle cx="-2.6" cy="-3" r="2.8" fill="#FFFFFF" opacity=".75"/></g>`).join('');
// Des étincelles qui montent des pages, en spirale douce
const etincelles = (x, y) => [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const dx = (i % 2 ? 1 : -1) * (30 + i * 9), d = 3 + (i % 3) * 0.6; return `<g opacity="0"><animateMotion dur="${d}s" begin="${f(-i * 0.47)}s" repeatCount="indefinite" path="M${x + dx * 0.3},${y} Q${x + dx},${y - 120} ${x + dx * 0.4},${y - 260}"/>`
  + `<animate attributeName="opacity" values="0;1;0" keyTimes="0;0.3;1" dur="${d}s" begin="${f(-i * 0.47)}s" repeatCount="indefinite"/>`
  + P('M0,-5 Q0.8,-0.8 5,0 Q0.8,0.8 0,5 Q-0.8,0.8 -5,0 Q-0.8,-0.8 0,-5 Z', i % 3 ? '#FFF3B0' : '#BFEFFF', 0) + '</g>'; }).join('');
// Un maître de la bibliothèque, debout, qui respire, éclairé comme tout l'écran (eclairer : contre-jour, modelé) ; son
// ombre au sol ; plus il est loin, plus la nuit le voile. (qui et pose, x et y des pieds, échelle, voile, décalage)
function maitre([qui, pose], x, y, k, voile, begin) {
  const rel = `personnages/maitres/${qui}/${qui}_${pose}_1.svg`, id = `sp${qui}`, cote = x < 450 ? 1 : -1;
  const corps = eclairer(corpsDe(rel, id), `${id}e`, [0, 0, 48, 64], cote, 1, '#CFEFFF');
  const brume = voile ? `<rect x="-4" y="-4" width="56" height="72" fill="#152A50" opacity="${voile}" mask="url(#${id}eM)"/>` : '';
  return `<defs>${rad(`${id}O`, [[0, '#020817', 0.6], [1, '#020817', 0]])}</defs><ellipse cx="${f(x)}" cy="${f(y - k)}" rx="${f(k * 15)}" ry="${f(k * 3.4)}" fill="url(#${id}O)"/>`
    + `<g transform="translate(${f(x - 24 * k)} ${f(y - 62 * k)}) scale(${f(k)})">${corps}${brume}</g>`;
}
// Les maîtres, en trois rangs de chaque côté (le plus proche, le plus grand), tournés vers le centre
const TROUPE = [
  [['ondin', 'avant_salut'], 190, 640, 4.2, 0.4, 0.4], [['sylve', 'avant_mains-tendues'], 310, 600, 3.8, 0.42, 1.3], [['cannelle', 'face_mains-tendues'], 600, 600, 3.8, 0.42, 2.1],
  [['galet', 'avant_applaudir'], 230, 780, 5.4, 0.2, 0.8], [['melisse', 'face_applaudir'], 680, 780, 5.4, 0.2, 1.7],
  [['aster', 'avant_salut'], 110, 990, 6.4, 0, 2.6], [['rivet', 'face_salut'], 800, 990, 6.4, 0, 0.2]
];

// L'affiche, en deux calques pour rester fluide sur téléphone (un SVG animé se redessine en entier à chaque image) :
// affiche() est immobile (les maîtres, le Grimoire ouvert, les rayons) ; brume() est petit et animé (Brume, les
// sept sceaux, les ondes, les étincelles), posé par-dessus par index.html dans le cadre BRUME du repère de l'affiche
const BRUME = [150, 90, 600, 690];
function affiche() {
  const [W, H] = AVANT, BX = 450;
  let s = `<defs>${rad('spRai', [[0, '#DFF6FF', 0.7], [1, '#DFF6FF', 0]])}${rad('spNb', [[0, '#D8ECFA', 0.3], [1, '#D8ECFA', 0]])}</defs>`;
  s += rayons(BX, 520) + TROUPE.slice(0, 5).map(t => maitre(...t)).join('');
  s += TROUPE.slice(5).map(t => maitre(...t)).join('');
  // le Grimoire ouvert, grand, au centre, au premier plan
  s += `<g transform="translate(450 800) scale(1.85) translate(-450 -640)">${livre(450, 640)}</g>`;
  s += [[270, 960, 230], [630, 975, 250]].map(([cx, cy, rx]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * 0.18)}" fill="url(#spNb)"/>`).join('');
  return fixe(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${s}</svg>`);
}
// Brume qui jaillit des pages, les sceaux qui tournent autour d'elle, des ondes et des étincelles
function brume() {
  const BX = 450, [x, y, w, h] = BRUME;
  const s = `<defs>${rad('spbC', [[0, '#FFFFFF', 0.9], [1, '#FFFFFF', 0]])}</defs>` + ondes(BX, 640) + brumeGrande(BX, 610, 10.5) + sceaux(BX, 430, 230, 64, 14) + etincelles(BX, 700);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}">${s}</svg>`;
}

// La version immobile d'un dessin (pour qui demande moins de mouvement) : sans ses animations ; ce qui ne tient sa
// place que par un trajet (les lucioles) s'en va avec
const fixe = svg => svg.replace(/<g data-mouvant="">[\s\S]*?<\/g>/g, '').replace(/<animate(Transform|Motion)?\b[^>]*\/>/g, '');

module.exports = { fond, affiche, brume, BRUME, fixe, FOND, AVANT, SPLINE };
