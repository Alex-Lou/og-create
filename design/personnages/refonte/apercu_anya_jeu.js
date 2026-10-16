// Planche « en jeu » d'Anya et de son cerf de lune : toutes leurs animations, dans toutes leurs directions, rangées selon
// le moment du jeu (la Révélation, puis son errance) ; puis ses saisons en mouvement. Chaque animation est un seul SVG
// dont les images se relaient en SMIL, au rythme du jeu.
// node design/personnages/refonte/apercu_anya_jeu.js → design/personnages/refonte/anya_jeu.html
const fs = require('fs');
const path = require('path');
const { habiller, SAISONS } = require('./anya_tenues');
const { ANIMS, DIRECTIONS, BULLES, dessiner } = require('./anya_anims');
const { cerfLune } = require('./cerf_lune');

let uid = 0;
// une animation en SMIL : ses images, l'une après l'autre ; img(i) rend l'image i
function smil(N, dt, w, h, k, label, img) {
  const dur = `${(N * dt).toFixed(2)}s`, kt = [...Array(N).keys()].map(i => (i / N).toFixed(4)).join(';');
  const g = [...Array(N).keys()].map(i => `<g opacity="${i ? 0 : 1}">${N > 1 ? `<animate attributeName="opacity" dur="${dur}" repeatCount="indefinite" calcMode="discrete" keyTimes="${kt}" values="${[...Array(N).keys()].map(j => (j === i ? 1 : 0)).join(';')}"/>` : ''}${img(i)}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * k}" height="${h * k}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${g}</svg>`;
}
const anim = (c, nom, dir, k = 2) => smil(ANIMS[nom].images, ANIMS[nom].dt, 80, 128, k, `Anya, ${ANIMS[nom].nom}, ${DIRECTIONS[dir].nom}`, i => dessiner({ ...c, uid: `${c.uid}j${uid++}` }, nom, dir, i));
const carte = (titre, svg, sous = '') => `<figure class="card">${svg}<figcaption><b>${titre}</b>${sous ? `<span>${sous}</span>` : ''}</figcaption></figure>`;

const GROUPES = [
  ['La Révélation', ['voile', 'eveil', 'parler', 'souffler']],
  ['Son errance', ['apparaitre', 'repos', 'murmure', 'flotter', 'benediction', 'creer', 'disparaitre']]
];
const ligne = nom => {
  const A = ANIMS[nom], c = habiller('ete', A.etat);
  // (le murmure : ses trois phrases, de face, après ses directions)
  const phrases = nom === 'murmure' ? `<div class="row">${BULLES.map((b, i) => carte(`Phrase ${i + 1}`, anim({ ...c, murmure: i }, nom, 'face'), `${b.length} glyphes`)).join('')}</div>` : '';
  return `<div class="anim"><div class="head"><h3>${A.nom}</h3><p>${A.contexte}</p><span class="mono">${A.images} images · ${Math.round(1 / A.dt)} images/s</span></div>`
    + `<div class="row">${A.dirs.map(d => carte(DIRECTIONS[d].nom, anim(c, nom, d))).join('')}</div>${phrases}</div>`;
};
const contexte = [
  ['Avant la Révélation : au centre du Cercle de menhirs', 'Endormie sous le Voile', '5 vues'],
  ['La Révélation : le Cercle fleurit, Anya se lève', 'L\'éveil', 'de face, trois quarts'],
  ['La Révélation : elle parle au peuple', 'Parler', '5 vues'],
  ['La Révélation : elle souffle sur le Grimoire ; plus tard, son Souffle', 'Souffler', 'de face, trois quarts'],
  ['Son errance : à l\'aube ou au crépuscule, pour un court moment', 'Apparaître, puis Disparaître', '5 vues'],
  ['On la croise : elle attend', 'Repos', '5 vues'],
  ['Rarement, quand on la touche pendant qu\'elle flotte', 'Le murmure : une bulle de son écriture de lune', '5 vues'],
  ['Elle va sur l\'île, des fleurs s\'ouvrent sur son chemin', 'Se déplacer, en flottant', '4 directions'],
  ['Sa Bénédiction sur l\'île', 'La bénédiction', 'de face, trois quarts'],
  ['Ses créatures, qui n\'existent qu\'avec elle', 'Créer', 'de face, trois quarts'],
  ['Le cerf de lune, à ses côtés', 'Debout, marche, couché, salut', '5 vues']
];

// le cerf de lune : ses quatre poses, dans ses cinq directions (le miroir donne la gauche)
const CERF = [['debout', 4, 0.42, 'Debout : il respire, une oreille frémit, la queue bat, il cligne'], ['marche', 8, 0.12, 'La marche : le pas latéral'], ['couche', 4, 0.52, 'Couché, les pattes repliées'], ['salut', 4, 0.42, 'Le salut : il incline la tête']];
const DIRS_CERF = [['front', 'De face', false], ['se', 'Vers le bas, à gauche', false], ['se', 'Vers le bas, à droite', true], ['ne', 'Vers le haut, à droite', false], ['ne', 'Vers le haut, à gauche', true]];
const cerf = CERF.map(([p, N, dt, titre]) => `<div class="anim"><div class="head"><h3>${titre}</h3><span class="mono">${N} images · ${Math.round(1 / dt)} images/s</span></div><div class="row">${DIRS_CERF.map(([v, lab, m]) => carte(lab, smil(N, dt, 120, 144, 1.5, `Le cerf de lune, ${p}, ${lab}`, i => {
  // (chaque image a ses propres ids : la même vue paraît deux fois, à l'endroit et en miroir)
  const s = cerfLune(v, p, i, { id: `j${uid++}` });
  return m ? `<g transform="translate(120 0) scale(-1 1)">${s}</g>` : s;
}))).join('')}</div></div>`).join('');

const saisons = Object.entries(SAISONS).map(([k, S]) => `<div class="anim"><div class="head"><h3>${S.nom}</h3></div><div class="row">${[['repos', 'face'], ['flotter', 'bas_gauche']].map(([nom, d]) => carte(ANIMS[nom].nom, anim(habiller(k, 'eveillee'), nom, d, 1.6), DIRECTIONS[d].nom)).join('')}</div></div>`).join('');

const html = `<title>Anya en jeu</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche « en jeu » : le contexte en tableau, puis une bande par moment du jeu, chaque animation dans toutes ses directions ; ses cartes de nuit (elle luit). Fond clair des planches du kit. */
:root { --fond: #F5EEDF; --carte: #2E3A4E; --trait: #3C2819; --sous: #6B5A48; --accent: #4E6E9E; --filet: #DCD2BC; --clair: #E8EEF8;
  --display: "Big Shoulders Display", Impact, "Arial Narrow", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--trait); font-family: var(--mono); font-size: 13px; }
.wrap { max-width: 1240px; margin: 0 auto; padding-block: 28px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 22px; }
h1, h2, h3 { font-family: var(--display); font-weight: 900; text-transform: uppercase; margin: 0; line-height: .95; }
h1 { font-size: 2.8rem; } h2 { font-size: 1.9rem; border-top: 2px solid var(--trait); padding-top: 14px; } h3 { font-size: 1.35rem; }
p { margin: 0; max-width: 78ch; line-height: 1.5; color: var(--sous); }
.mono { font-size: .72rem; color: var(--sous); }
.name { display: inline-block; background: var(--accent); color: #FFF6EA; font-family: var(--display); font-weight: 900; font-size: 1.1rem; letter-spacing: .04em; padding: 2px 10px; border-radius: 4px; }
.table { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; min-width: 560px; background: #FFFDF7; border-radius: 12px; overflow: hidden; }
th, td { text-align: left; padding: 9px 12px; border-bottom: 1px solid var(--filet); vertical-align: top; }
th { font-family: var(--display); font-size: 1rem; text-transform: uppercase; background: #E4E9F2; }
.anim { display: grid; gap: 10px; }
.anim .head { display: grid; gap: 4px; }
.row { display: flex; flex-wrap: wrap; gap: 10px; }
.card { margin: 0; background: var(--carte); color: var(--clair); border-radius: 12px; padding: 10px 12px; display: grid; gap: 6px; justify-items: center; align-content: start; }
.card figcaption { display: grid; justify-items: center; gap: 2px; text-align: center; }
.card b { font-family: var(--display); font-size: 1rem; text-transform: uppercase; }
.card span { color: #B9C4DA; font-size: .72rem; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>Anya · en jeu</h1>
  <p><span class="name">ANYA</span> l'Âme de l'Île : toutes ses animations, dans toutes leurs directions, et celles de son cerf de lune. Elle flotte : jamais de pas ; elle glisse, sa chevelure et son manteau traînent derrière elle. Les quatre directions sont dessinées chacune pour elle-même ; celles de gauche sont le miroir de celles de droite, l'oiseau de ses bois passé de l'autre côté avant.</p>
  <div class="table"><table><thead><tr><th>Dans le jeu</th><th>Son animation</th><th>Directions</th></tr></thead><tbody>${contexte.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="mono">Le contexte est une proposition, à caler avec la logique du jeu (HISTOIRE.md § 6.14) : rien n'est branché.</p>
  ${GROUPES.map(([g, list]) => `<h2>${g}</h2>${list.map(ligne).join('')}`).join('\n  ')}
  <h2>Le cerf de lune</h2>
  <p>Un sprite à part (cerf_lune.js), 120 × 144, à la même échelle qu'Anya : il se tient à ses côtés.</p>
  ${cerf}
  <h2>Ses saisons, en mouvement</h2>
  <p>Le manteau vivant change avec les saisons, dans toutes ses animations.</p>
  ${saisons}
</div>`;
fs.writeFileSync(path.join(__dirname, 'anya_jeu.html'), html);
console.log('écrit : anya_jeu.html', Math.round(html.length / 1024), 'Ko');
