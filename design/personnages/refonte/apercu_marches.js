// Planche des marches de la troupe refondue (Lorena, Agathe, Nathan, Robby, Léo) : chacun marche dans les quatre directions,
// sur place, puis en promenade sur un losange (il change de direction à chaque coin). Chaque marche est un seul SVG dont
// les images se relaient en SMIL, au rythme du jeu.
// node design/personnages/refonte/apercu_marches.js → design/personnages/refonte/marches.html
const fs = require('fs');
const path = require('path');

const TROUPE = [
  ['Lorena', require('./lorena_tenues').habiller('cire', null, 'rescapee'), require('./lorena_anims')],
  ['Agathe', require('./agathe_tenues').habiller('robe', null, 'rescapee'), require('./agathe_anims')],
  ['Nathan', require('./nathan_tenues').habiller('atelier', null, 'rescape'), require('./nathan_anims')],
  ['Robby', require('./robby_tenues').habiller('blouse', null, 'ermite'), require('./robby_anims')],
  ['Léo', require('./leo_tenues').habiller('cire', null, 'rescape'), require('./leo_anims')]
];
const DIRS = ['bas_gauche', 'bas_droite', 'haut_droite', 'haut_gauche'];

let uid = 0;
// les 8 images d'une marche, qui se relaient (begin : décalage, pour la promenade)
function cycle(c, A, dir) {
  const M = A.ANIMS.marche, N = M.images, dur = `${(N * M.dt).toFixed(2)}s`;
  const kt = [...Array(N).keys()].map(i => (i / N).toFixed(4)).join(';');
  return [...Array(N).keys()].map(i => `<g opacity="${i ? 0 : 1}"><animate attributeName="opacity" dur="${dur}" repeatCount="indefinite" calcMode="discrete" keyTimes="${kt}" values="${[...Array(N).keys()].map(j => (j === i ? 1 : 0)).join(';')}"/>${A.dessiner({ ...c, uid: `${c.uid}m${uid++}` }, 'marche', dir, i)}</g>`).join('');
}
const surPlace = (nom, c, A, dir, k = 2.4) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${nom}, marche, ${A.DIRECTIONS[dir].nom}"><ellipse cx="24" cy="62" rx="9" ry="1.6" fill="rgba(40,55,20,.18)"/>${cycle(c, A, dir)}</svg>`;

// La promenade : un losange parcouru en 4 côtés (vers le bas à gauche, vers le bas à droite, vers le haut à droite, vers
// le haut à gauche) ; le personnage avance à sa vitesse de marche, sa direction change à chaque coin. Les plus proches
// (plus bas) passent devant.
const T = 2.4; // durée d'un côté (s)
const W = 760, H = 400, CX = W / 2, CY = H / 2 + 30, RX = 270, RY = 125;
const coins = [[CX, CY - RY], [CX - RX, CY], [CX, CY + RY], [CX + RX, CY]]; // haut, gauche, bas, droite
function promeneur(nom, c, A, i) {
  const k = 1.7, w = 48 * k, h = 64 * k, decal = -(i * 4 * T / TROUPE.length); // chacun part d'un point différent, répartis le long du losange
  const pts = [...coins, coins[0]].map(([x, y]) => `${x - w / 2},${y - h + 4}`).join(';');
  const tot = 4 * T;
  const vues = DIRS.map((d, j) => {
    const vals = DIRS.map((_, q) => (q === j ? 1 : 0)).join(';');
    return `<g opacity="${j ? 0 : 1}"><animate attributeName="opacity" dur="${tot}s" begin="${decal}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;.25;.5;.75" values="${vals}"/><g transform="scale(${k})">${cycle(c, A, d)}</g></g>`;
  }).join('');
  return `<g><animateTransform attributeName="transform" type="translate" dur="${tot}s" begin="${decal}s" repeatCount="indefinite" calcMode="linear" keyTimes="0;.25;.5;.75;1" values="${pts}"/>`
    + `<ellipse cx="${w / 2}" cy="${h - 3}" rx="${10 * k}" ry="${1.8 * k}" fill="rgba(40,55,20,.2)"/>${vues}<text x="${w / 2}" y="${h + 10}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="#3C2819">${nom}</text></g>`;
}
const sol = `<path d="M${coins.map(p => p.join(',')).join(' L')} Z" fill="none" stroke="#9DB884" stroke-width="2" stroke-dasharray="6 6"/>`;
const promenade = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + 40}" viewBox="0 -20 ${W} ${H + 40}" role="img" aria-label="La troupe en promenade, dans les quatre directions"><rect x="0" y="-20" width="${W}" height="${H + 40}" fill="#8FB46A"/>${sol}${TROUPE.map(([n, c, A], i) => promeneur(n, c, A, i)).join('')}</svg>`;

const html = `<title>Marches de la troupe</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche des marches : la promenade en haut, puis une ligne par personnage, ses quatre directions. Fond clair des planches du kit. */
:root { --fond: #F5EEDF; --carte: #E4EFD3; --trait: #3C2819; --sous: #6B5A48;
  --display: "Big Shoulders Display", Impact, "Arial Narrow", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--trait); font-family: var(--mono); font-size: 13px; }
.wrap { max-width: 1180px; margin: 0 auto; padding-block: 28px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 20px; }
h1, h2 { font-family: var(--display); font-weight: 900; text-transform: uppercase; margin: 0; line-height: .95; }
h1 { font-size: 2.8rem; } h2 { font-size: 1.6rem; }
p { margin: 0; max-width: 78ch; line-height: 1.5; color: var(--sous); }
.scene { border-radius: 14px; overflow: hidden; justify-self: start; max-width: 100%; }
.row { display: flex; flex-wrap: wrap; gap: 10px; }
.card { margin: 0; background: var(--carte); border-radius: 12px; padding: 10px 12px; display: grid; gap: 6px; justify-items: center; }
.card figcaption { font-family: var(--display); font-size: .95rem; text-transform: uppercase; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>La troupe · marches</h1>
  <p>Lorena, Agathe, Nathan, Robby et Léo marchent dans les quatre directions du jeu. Huit images par pas : le pied d'appui recule au sol, l'autre passe genou plié ; chaque bras balance à l'opposé de sa jambe ; la foulée suit la diagonale du regard.</p>
  <h2>En promenade</h2>
  <div class="scene">${promenade}</div>
  ${TROUPE.map(([nom, c, A]) => `<h2>${nom}</h2><div class="row">${DIRS.map(d => `<figure class="card">${surPlace(nom, c, A, d)}<figcaption>${A.DIRECTIONS[d].nom}</figcaption></figure>`).join('')}</div>`).join('\n  ')}
</div>`;
fs.writeFileSync(path.join(__dirname, 'marches.html'), html);
console.log('écrit : marches.html', Math.round(html.length / 1024), 'Ko');
