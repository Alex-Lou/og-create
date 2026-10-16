// Planche « en jeu » de Léo (anciennement Ondin, Pierrot dans les premières bibles ; fichiers du jeu : ondin) : toutes ses
// animations, dans toutes leurs directions, rangées selon le contexte du jeu ; puis ses états en mouvement. Chaque
// animation est un seul SVG dont les images se relaient en SMIL, au rythme du jeu.
// node design/personnages/refonte/apercu_leo_jeu.js → design/personnages/refonte/leo_jeu.html
const fs = require('fs');
const path = require('path');
const { habiller, ETATS } = require('./leo_tenues');
const { ANIMS, DIRECTIONS, dessiner } = require('./leo_anims');

let uid = 0;
function anim(c, nom, dir, k = 3) {
  const A = ANIMS[nom], [x, y, w, h] = A.cadre || [0, 0, 48, 64], N = A.images, dur = `${(N * A.dt).toFixed(2)}s`;
  const kt = [...Array(N).keys()].map(i => (i / N).toFixed(4)).join(';');
  const g = [...Array(N).keys()].map(i => `<g opacity="${i ? 0 : 1}">${N > 1 ? `<animate attributeName="opacity" dur="${dur}" repeatCount="indefinite" calcMode="discrete" keyTimes="${kt}" values="${[...Array(N).keys()].map(j => (j === i ? 1 : 0)).join(';')}"/>` : ''}${dessiner({ ...c, uid: `${c.uid}j${uid++}` }, nom, dir, i)}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * k}" height="${h * k}" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="Léo, ${A.nom}, ${DIRECTIONS[dir].nom}">${g}</svg>`;
}
const carte = (titre, svg, sous = '') => `<figure class="card">${svg}<figcaption><b>${titre}</b>${sous ? `<span>${sous}</span>` : ''}</figcaption></figure>`;

const base = habiller('cire', null, 'rescape');
// Les groupes, dans l'ordre du jeu : se déplacer, s'arrêter, rester, travailler, dormir, réagir
const GROUPES = [
  ['Se déplacer', ['marche', 'course']],
  ['S\'arrêter, rester là', ['arret', 'repos', 'salut']],
  ['Travailler', ['sourcier', 'chercher', 'bulle', 'lune', 'bailler']],
  ['Dormir', ['dodo', 'dodoCouche']],
  ['Réagir, parler : ses poses', Object.keys(ANIMS).filter(k => k.startsWith('pose_'))]
];
const ligne = nom => {
  const A = ANIMS[nom];
  // les poses : de face et vers le bas à gauche (l'autre sens est dessiné de même, comme pour la marche)
  const dirs = A.pose ? ['face', 'bas_gauche'] : A.dirs;
  return `<div class="anim"><div class="head"><h3>${A.nom}</h3><p>${A.contexte}</p><span class="mono">${A.images} images · ${Math.round(1 / A.dt)} images/s</span></div>`
    + `<div class="row">${dirs.map(d => carte(DIRECTIONS[d].nom, anim(base, nom, d, A.cadre ? 2.2 : 2.6))).join('')}</div></div>`;
};
const contexte = [
  ['Il se déplace sur l\'île, pieds nus, à petits pas', 'Marche', '4 directions'],
  ['Urgence : la baguette qui tire, la brume, Bulle', 'Course', '4 directions'],
  ['Il arrive à destination', 'Arrêt, puis Repos', '4 directions'],
  ['Il attend, le joueur passe', 'Repos ; Salut quand on le touche', '5 vues ; de face'],
  ['À La Source : trouver l\'eau', 'La baguette de sourcier', '5 vues'],
  ['Retrouver ce qui est perdu (la clé du phare, acte VI)', 'Chercher', '5 vues'],
  ['Bulle dans son bocal, ou le bocal vide', 'Bulle', 'face, trois quarts'],
  ['La nuit : la lune lui parle', 'Parler à la lune', '5 vues'],
  ['La brume le tient encore', 'Bâiller', '5 vues'],
  ['La nuit', 'Dodo, assis contre un rocher ; ou couché', 'de face'],
  ['Dialogue, quête, surprise, froid, victoire', 'Ses poses', 'face, trois quarts']
];

const etats = ['naufrage', 'rescape', 'rafistole', 'source', 'propre', 'trempe'].map(e => {
  const c = habiller('cire', null, e);
  return `<div class="anim"><div class="head"><h3>${ETATS[e].nom}</h3><p>${ETATS[e].quand}</p></div><div class="row">${['repos', 'marche', 'course'].map(nom => carte(ANIMS[nom].nom, anim(c, nom, nom === 'repos' ? 'face' : 'bas_gauche', 2))).join('')}</div></div>`;
}).join('');

const html = `<title>Léo en jeu</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche « en jeu » : le contexte en tableau, puis une bande par groupe d'animations, chaque animation dans toutes ses directions. Fond clair des planches du kit. */
:root { --fond: #F5EEDF; --carte: #E4EFD3; --trait: #3C2819; --sous: #6B5A48; --accent: #C8463A; --filet: #DCD2BC;
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
th { font-family: var(--display); font-size: 1rem; text-transform: uppercase; background: var(--carte); }
.anim { display: grid; gap: 10px; }
.anim .head { display: grid; gap: 4px; }
.row { display: flex; flex-wrap: wrap; gap: 10px; }
.pair { display: flex; gap: 6px; align-items: flex-end; }
.card { margin: 0; background: var(--carte); border-radius: 12px; padding: 10px 12px; display: grid; gap: 6px; justify-items: center; align-content: start; }
.card figcaption { display: grid; justify-items: center; gap: 2px; text-align: center; }
.card b { font-family: var(--display); font-size: 1rem; text-transform: uppercase; }
.card span { color: var(--sous); font-size: .72rem; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>Léo · en jeu</h1>
  <p><span class="name">LÉO</span> est le nouveau nom d'Ondin, le petit sourcier (Pierrot dans les premières bibles ; dans les fichiers du jeu : ondin). Toutes ses animations, dans toutes leurs directions. Les quatre directions sont dessinées chacune pour elle-même : quand il se retourne, le bocal reste à sa hanche gauche, le nœud de corde à sa droite, l'algue dans ses boucles à sa droite, les lambeaux du naufragé du même côté. Toujours à moitié endormi : la brume le tient encore.</p>
  <div class="table"><table><thead><tr><th>Dans le jeu</th><th>Son animation</th><th>Directions</th></tr></thead><tbody>${contexte.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="mono">Le contexte est une proposition, à caler avec la logique du jeu : rien n'est branché.</p>
  ${GROUPES.slice(0, -1).map(([g, list]) => `<h2>${g}</h2>${list.map(ligne).join('')}`).join('\n  ')}
  <h2>Réagir, parler : ses poses</h2>
  <p>Dialogue, quête, surprise, froid, victoire : les poses de la troupe refondue, chacune avec son expression, de face et de trois quarts (l'autre sens est dessiné de même).</p>
  <div class="row">${GROUPES.at(-1)[1].map(nom => `<figure class="card"><div class="pair">${anim(base, nom, 'face', 2.2)}${anim(base, nom, 'bas_gauche', 2.2)}</div><figcaption><b>${ANIMS[nom].nom}</b><span>${ANIMS[nom].images} images</span></figcaption></figure>`).join('')}</div>
  <h2>Ses états, en mouvement</h2>
  <p>Le ciré trop grand et le bonnet de nuit, au repos, en marche, en course, du naufragé au propre.</p>
  ${etats}
</div>`;
fs.writeFileSync(path.join(__dirname, 'leo_jeu.html'), html);
console.log('écrit : leo_jeu.html', Math.round(html.length / 1024), 'Ko');
