// Planche des tenues, palettes et états de Maerys (anciennement Sylve ; fichiers du jeu : sylve).
// node design/personnages/refonte/apercu_maerys_tenues.js → design/personnages/refonte/maerys_tenues.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const { habiller, TENUES, PALETTES, ETATS } = require('./maerys_tenues');
const { C } = require('./maerys_refonte');

let n = 0;
const fig = (tenue, palette, etat, k, expr = 'veille', legende = '', vue = 'front') => {
  const c = habiller(tenue, palette, etat);
  const body = frame({ ...c, uid: `${c.uid}${n++}` }, vue, 'repos', 0, expr);
  return `<figure><svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="Maerys, ${TENUES[tenue].nom}, ${ETATS[etat].nom}">${body}</svg>${legende ? `<figcaption>${legende}</figcaption>` : ''}</figure>`;
};
const chip = (hex, nom) => `<div class="chip"><i style="background:${hex}"></i><span>${nom}<code>${hex}</code></span></div>`;

const ORDRE = ['propre', 'sale', 'rafistole', 'sauvage', 'naufrage', 'trempe'];
const EXPR_ETAT = { propre: 'sourire', sale: 'concentree', rafistole: 'pensive', sauvage: 'veille', naufrage: 'epuisee', trempe: 'froid' };

const html = `<title>Maerys, tenues et états</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche de Maerys : les états en frise, puis les tenues, les palettes, les couleurs et l'appel prêt à intégrer. Fond clair des planches du kit. */
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
  <h1>Maerys · tenues et états</h1>
  <p><span class="name">MAERYS</span> est le nouveau nom de Sylve, la gardienne des bois (dans les fichiers du jeu : sylve). Même dessin que la refonte du sprite ; ici, ce qu'elle porte et dans quel état, de face, de trois quarts et de dos.</p>

  <h2>Ses états, du naufrage au propre</h2>
  <p>La cape de feuilles et la tunique, dans l'ordre de l'histoire. Comme Robby, c'est une ancienne naufragée : on ne la trouve pas endormie sur la plage, on la découvre, cachée à La Lisière depuis des années (une lueur dans les arbres, la queue rousse de Mousse) ; c'est la sauvage (la terre de la forêt, la mousse, deux brindilles dans les cheveux). Chaque état règle ce qu'on voit sur elle : la terre au bas de la tunique, sur sa joue et sur ses pieds, la mousse collée, les brindilles, la pièce cousue au camp, l'eau qui fonce le lin, les feuilles et les cheveux, et qui goutte. Naufragée (le jour où son radeau s'est brisé) : délavée par la mer, la cape perdue (il n'en reste qu'un bout de liane et deux feuilles flétries), une bande de voile en ceinture, la tunique trouée, le sel ; son don oublié, la graine ne germe plus.</p>
  <div class="row">${['naufrage', 'sauvage', 'rafistole', 'sale', 'propre'].map((e, i) => `${i ? '<span class="arrow">→</span>' : ''}<div class="card"><b>${ETATS[e].nom}</b>${fig('cape', null, e, 3, EXPR_ETAT[e])}<span>${ETATS[e].quand}</span></div>`).join('')}
    <div class="card"><b>${ETATS.trempe.nom}</b>${fig('cape', null, 'trempe', 3, 'froid')}<span>${ETATS.trempe.quand}</span></div></div>

  <h2>Ses tenues, sous tous les côtés</h2>
  <p>Trois tenues, propres puis un peu sales, de face, de trois quarts et de dos. Toutes se portent dans n'importe quel état et avec n'importe quelle palette. La cape de feuilles (son arrivée) : la cape au bas en pointes de feuilles, nouée au cou d'un col de feuilles ; de dos, les rangées de feuilles qui se recouvrent ; la tunique de lin sans manches, au bas déchiré, la liane en ceinture et au poignet, les bras nus. La robe d'Agathe (au village, une fois apprivoisée) : le lin sauge, l'encolure lacée, les manches courtes à l'ourlet brodé, une guirlande de feuilles brodée au bas ; elle y garde sa liane. Le manteau de mousse (la pluie, l'hiver) : la mousse cousue sur une toile, le lichen, le bas en touffes, le col de mousse épaisse, deux chevilles d'écorce, les manches longues aux poignets de mousse, la capuche rabattue.</p>
  <div class="row">${Object.entries(TENUES).map(([id, t]) => `<div class="card"><b>${t.nom}</b><div class="pair">${['front', 'se', 'ne'].map(v => fig(id, null, 'propre', 2, 'veille', v === 'front' ? 'face' : v === 'se' ? 'trois quarts' : 'dos', v)).join('')}</div><div class="pair">${['front', 'se', 'ne'].map(v => fig(id, null, 'sale', 2, 'veille', 'un peu sale', v)).join('')}</div><span>palette : ${PALETTES[t.palette].nom}</span></div>`).join('')}</div>

  <h2>Ses palettes</h2>
  <p>Le vêtement change de couleur (la tunique, la robe ou le manteau) ; les cheveux sombres en zigzag, la plume de geai, les traits verts peints, la cape de feuilles et la liane restent : on la reconnaît toujours.</p>
  <div class="row">${Object.entries(PALETTES).map(([id, p]) => `<div class="card"><b>${p.nom}</b><div class="pair">${fig('cape', id, 'sauvage', 2)}${fig('robe', id, 'propre', 2)}${fig('mousse', id, 'propre', 2)}</div><span>${p.m} · ${p.mS}</span></div>`).join('')}</div>

  <h2>Ses couleurs fixes</h2>
  <div class="chips">${[[C.skin, 'Peau'], [C.hair, 'Cheveux sauvages'], [C.iris, 'Iris vert noisette'], [C.cheek, 'Joues'], [C.paint, 'Traits peints'], [C.feather, 'Plume de geai'], [C.twig, 'Brindilles'], [C.leaf, 'Cape de feuilles'], [C.vine, 'Liane'], [C.tunic, 'Tunique de lin'], [C.robe, 'Robe d\'Agathe'], [C.thread, 'Broderie'], [C.moss, 'Manteau de mousse'], [C.lichen, 'Lichen'], [C.bark, 'Écorce'], [C.wither, 'Feuilles flétries'], [C.canvas, 'Toile de voile'], [C.mud, 'Terre de la forêt'], [C.patch, 'Pièce cousue'], ['#3C2819', 'Trait de la troupe']].map(([h, n]) => chip(h, n)).join('')}</div>

  <h2>À la taille du jeu</h2>
  <div class="grass">${ORDRE.map(e => fig('cape', null, e, 1)).join('')}${['cape', 'robe', 'mousse'].map(t => fig(t, null, 'sale', 2)).join('')}${fig('cape', 'ecorce', 'sauvage', 2)}${fig('robe', 'bruyere', 'rafistole', 2)}</div>

  <h2>Prêt à intégrer</h2>
  <p>Même usage que pour Lorena, Agathe, Nathan, Robby et Léo : on habille Maerys, puis on la passe au kit comme n'importe quel maître.</p>
<pre>const { frame, svg } = require('design/personnages/troupe');
const { habiller } = require('design/personnages/refonte/maerys_tenues');

// tenue : ${Object.keys(TENUES).join(' | ')}
// palette : ${Object.keys(PALETTES).join(' | ')}  (sinon celle de la tenue)
// état : ${Object.keys(ETATS).join(' | ')}
const maerys = habiller('robe', 'sauge', 'propre');
svg(frame(maerys, 'front', 'repos', 0, 'veille'));</pre>
</div>`;
fs.writeFileSync(path.join(__dirname, 'maerys_tenues.html'), html);
console.log('écrit : maerys_tenues.html');
