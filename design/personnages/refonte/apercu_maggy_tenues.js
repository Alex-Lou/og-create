// Planche des tenues, palettes et états de Maggy (anciennement Mélisse ; fichiers du jeu : melisse).
// node design/personnages/refonte/apercu_maggy_tenues.js → design/personnages/refonte/maggy_tenues.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const { habiller, TENUES, PALETTES, ETATS } = require('./maggy_tenues');
const { C } = require('./maggy_refonte');

let n = 0;
const fig = (tenue, palette, etat, k, expr = 'veille', legende = '', vue = 'front') => {
  const c = habiller(tenue, palette, etat);
  const body = frame({ ...c, uid: `${c.uid}${n++}` }, vue, 'repos', 0, expr);
  return `<figure><svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="Maggy, ${TENUES[tenue].nom}, ${ETATS[etat].nom}">${body}</svg>${legende ? `<figcaption>${legende}</figcaption>` : ''}</figure>`;
};
const chip = (hex, nom) => `<div class="chip"><i style="background:${hex}"></i><span>${nom}<code>${hex}</code></span></div>`;

const ORDRE = ['propre', 'terreuse', 'rafistole', 'poursuivie', 'naufrage', 'trempe'];
const EXPR_ETAT = { propre: 'sourire', terreuse: 'concentree', rafistole: 'pensive', poursuivie: 'essoufflee', naufrage: 'epuisee', trempe: 'froid' };

const html = `<title>Maggy, tenues et états</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche de Maggy : les états en frise, puis les tenues, les palettes, les couleurs et l'appel prêt à intégrer. Fond clair des planches du kit. */
:root { --fond: #F5EEDF; --carte: #E4EFD3; --trait: #3C2819; --sous: #6B5A48; --accent: #C8463A;
  --display: "Big Shoulders Display", Impact, "Arial Narrow", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--trait); font-family: var(--mono); font-size: 13px; }
.wrap { max-width: 1180px; margin: 0 auto; padding-block: 28px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 22px; }
h1, h2 { font-family: var(--display); font-weight: 900; text-transform: uppercase; margin: 0; line-height: .95; }
h1 { font-size: 2.8rem; } h2 { font-size: 1.6rem; }
p { margin: 0; max-width: 76ch; line-height: 1.5; color: var(--sous); }
.name { display: inline-block; background: var(--accent); color: #FFF6EA; font-family: var(--display); font-weight: 900; font-size: 1.1rem; letter-spacing: .04em; padding: 2px 10px; border-radius: 4px; }
.row { display: flex; flex-wrap: wrap; gap: 14px; }
.card { background: var(--carte); border-radius: 12px; padding: 14px 16px; display: grid; gap: 8px; justify-items: center; align-content: start; }
.card b { font-family: var(--display); font-size: 1.25rem; text-transform: uppercase; }
.card span { color: var(--sous); font-size: .75rem; text-align: center; max-width: 18ch; }
.pair { display: flex; gap: 10px; align-items: flex-end; }
figure { margin: 0; display: grid; justify-items: center; gap: 4px; }
figcaption { font-size: .7rem; color: var(--sous); }
.arrow { align-self: center; color: var(--sous); font-size: 1.4rem; }
.chips { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
.chip { display: grid; grid-template-columns: 40px 1fr; gap: 10px; align-items: center; background: #FFFDF7; border-radius: 10px; padding: 8px; }
.chip i { width: 40px; height: 40px; border-radius: 8px; box-shadow: inset 0 0 0 1px #0002; }
.chip span { display: grid; font-size: .78rem; }
.chip code { color: var(--sous); font-size: .7rem; }
pre { margin: 0; background: #2B211A; color: #F1E6CC; padding: 16px; border-radius: 12px; overflow-x: auto; font-size: .8rem; line-height: 1.5; }
.grass { background: repeating-conic-gradient(#7FA65A 0 25%, #87AE60 0 50%) 0 0 / 32px 32px; border-radius: 12px; padding: 18px; display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; justify-content: center; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>Maggy · tenues et états</h1>
  <p><span class="name">MAGGY</span> est le nouveau nom de Mélisse, la jardinière des lunes (dans les fichiers du jeu : melisse). Même dessin que la refonte du sprite ; ici, ce qu'elle porte et dans quel état, de face, de trois quarts et de dos.</p>

  <h2>Ses états, du naufrage au propre</h2>
  <p>Le châle de nuit sur la robe sauge, dans l'ordre de l'histoire. Sa barque de graines s'est brisée sur une autre côte ; elle a erré dans la forêt, quelqu'un la suivait ; elle en sort, en danger, et trouve des gens : c'est la poursuivie (le châle accroché aux ronces, une feuille et une brindille prises au chapeau de travers, la tresse défaite, une égratignure, l'accroc au bas de la robe). Chaque état règle ce qu'on voit sur elle : la terre du Potager (aux mains, au bas de la robe, sur les sabots), la pièce cousue au camp, l'eau qui fonce la robe, le châle, la paille et les cheveux, et qui goutte. Naufragée (le jour de la barque) : délavée par la mer, le bas de la robe en lambeaux, le châle noué à la taille, le bord du chapeau déchiré et une algue accrochée, le sel, un sabot perdu.</p>
  <div class="row">${['naufrage', 'poursuivie', 'rafistole', 'terreuse', 'propre'].map((e, i) => `${i ? '<span class="arrow">→</span>' : ''}<div class="card"><b>${ETATS[e].nom}</b>${fig('chale', null, e, 3, EXPR_ETAT[e])}<span>${ETATS[e].quand}</span></div>`).join('')}
    <div class="card"><b>${ETATS.trempe.nom}</b>${fig('chale', null, 'trempe', 3, 'froid')}<span>${ETATS.trempe.quand}</span></div></div>

  <h2>Ses tenues, sous tous les côtés</h2>
  <p>Trois tenues, propres puis terreuses, de face, de trois quarts et de dos. Toutes se portent dans n'importe quel état et avec n'importe quelle palette. Le châle de nuit (son arrivée) : brodé de croissants et d'étoiles, ses franges, sa pointe dans le dos. Le tablier du Potager : la bavette et ses bretelles croisées dans le dos, deux grandes poches (le transplantoir, un sachet de graines), les manches retroussées. La pèlerine de pluie : cirée, jusqu'aux coudes, ses deux brides de laiton, la capuche rabattue.</p>
  <div class="row">${Object.entries(TENUES).map(([id, t]) => `<div class="card"><b>${t.nom}</b><div class="pair">${['front', 'se', 'ne'].map(v => fig(id, null, 'propre', 2, 'veille', v === 'front' ? 'face' : v === 'se' ? 'trois quarts' : 'dos', v)).join('')}</div><div class="pair">${['front', 'se', 'ne'].map(v => fig(id, null, 'terreuse', 2, 'veille', 'terreuse', v)).join('')}</div><span>palette : ${PALETTES[t.palette].nom}</span></div>`).join('')}</div>

  <h2>Ses palettes</h2>
  <p>La robe change de couleur (et la pèlerine, pour la pluie) ; le grand chapeau de paille et son bouquet, la tresse, le châle couleur nuit et la boîte à graines restent : on la reconnaît toujours.</p>
  <div class="row">${Object.entries(PALETTES).map(([id, p]) => `<div class="card"><b>${p.nom}</b><div class="pair">${fig('chale', id, 'propre', 2)}${fig('tablier', id, 'propre', 2)}${fig('pluie', id, 'propre', 2)}</div><span>${p.m} · ${p.mS}</span></div>`).join('')}</div>

  <h2>Ses couleurs fixes</h2>
  <div class="chips">${[[C.skin, 'Peau'], [C.hand, 'Mains terreuses'], [C.hair, 'Cheveux et tresse'], [C.iris, 'Iris lavande'], [C.cheek, 'Joues'], [C.straw, 'Paille du chapeau'], [C.band, 'Ruban prune'], [C.lavender, 'Lavande séchée'], [C.pink, 'Rose séchée'], [C.yellow, 'Fleur jaune'], [C.shawl, 'Châle couleur nuit'], [C.moon, 'Lunes brodées'], [C.dress, 'Robe sauge'], [C.apron, 'Tablier'], [C.cape, 'Pèlerine'], [C.wood, 'Sabots'], [C.iron, 'Boîte en fer'], [C.brass, 'Loquet de laiton'], [C.glow, 'Graines qui luisent'], [C.mud, 'Terre du Potager'], ['#3C2819', 'Trait de la troupe']].map(([h, n]) => chip(h, n)).join('')}</div>

  <h2>À la taille du jeu</h2>
  <div class="grass">${ORDRE.map(e => fig('chale', null, e, 1)).join('')}${['chale', 'tablier', 'pluie'].map(t => fig(t, null, 'terreuse', 2)).join('')}${fig('chale', 'ocre', 'poursuivie', 2)}${fig('tablier', 'rose', 'rafistole', 2)}</div>

  <h2>Prêt à intégrer</h2>
  <p>Même usage que pour toute la troupe refondue : on habille Maggy, puis on la passe au kit comme n'importe quel maître.</p>
<pre>const { frame, svg } = require('design/personnages/troupe');
const { habiller } = require('design/personnages/refonte/maggy_tenues');

// tenue : ${Object.keys(TENUES).join(' | ')}
// palette : ${Object.keys(PALETTES).join(' | ')}  (sinon celle de la tenue)
// état : ${Object.keys(ETATS).join(' | ')}
const maggy = habiller('tablier', 'lavande', 'terreuse');
svg(frame(maggy, 'front', 'repos', 0, 'veille'));</pre>
</div>`;
fs.writeFileSync(path.join(__dirname, 'maggy_tenues.html'), html);
console.log('écrit : maggy_tenues.html');
