// Planche des tenues, palettes et états de Robby (anciennement Galet, Saturnin dans HISTOIRE.md ; fichiers du jeu : galet).
// node design/personnages/refonte/apercu_robby_tenues.js → design/personnages/refonte/robby_tenues.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const { habiller, TENUES, PALETTES, ETATS } = require('./robby_tenues');
const { C } = require('./robby_refonte');

let n = 0;
const fig = (tenue, palette, etat, k, expr = 'veille', legende = '', vue = 'front') => {
  const c = habiller(tenue, palette, etat);
  const body = frame({ ...c, uid: `${c.uid}${n++}` }, vue, 'repos', 0, expr);
  return `<figure><svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="Robby, ${TENUES[tenue].nom}, ${ETATS[etat].nom}">${body}</svg>${legende ? `<figcaption>${legende}</figcaption>` : ''}</figure>`;
};
const chip = (hex, nom) => `<div class="chip"><i style="background:${hex}"></i><span>${nom}<code>${hex}</code></span></div>`;

const ORDRE = ['propre', 'poussiere', 'rafistole', 'ermite', 'naufrage', 'trempe'];
const EXPR_ETAT = { propre: 'sourire', poussiere: 'concentree', rafistole: 'pensive', ermite: 'veille', naufrage: 'epuisee', trempe: 'froid' };

const html = `<title>Robby, tenues et états</title>
<title>Lorena, tenues et états</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche de Robby : les états en frise, puis les tenues, les palettes, les couleurs et l'appel prêt à intégrer. Fond clair des planches du kit. */
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
  <h1>Robby · tenues et états</h1>
  <p><span class="name">ROBBY</span> est le nouveau nom de Galet, le vieux tailleur de runes, le mineur (Saturnin dans HISTOIRE.md ; dans les fichiers du jeu : galet). Même dessin que la refonte du sprite ; ici, ce qu'il porte et dans quel état, de face, de trois quarts et de dos.</p>

  <h2>Ses états, du naufrage au propre</h2>
  <p>La blouse de tailleur et le bonnet rouille, dans l'ordre de l'histoire. Robby est un ancien naufragé : à son arrivée, c'est l'ermite de la fissure (des années seul, la mousse sur le bonnet et le lichen dans la barbe, les deux trous du bonnet, les pièces cousues sur la blouse, la poussière de pierre). Chaque état règle ce qu'on voit sur lui : la poussière de pierre, la mousse, le sel, la boue aux chaussures, les pièces, le bonnet troué ou reprisé, l'eau qui fonce la laine et la barbe, et qui goutte. Naufragé (le naufrage de son caboteur, il y a longtemps) : le poncho de toile de voile noué d'une corde, le pantalon retroussé, un pied nu ; il a oublié son don, la rune ne s'allume pas.</p>
  <div class="row">${['naufrage', 'ermite', 'rafistole', 'poussiere', 'propre'].map((e, i) => `${i ? '<span class="arrow">→</span>' : ''}<div class="card"><b>${ETATS[e].nom}</b>${fig('blouse', null, e, 3, EXPR_ETAT[e])}<span>${ETATS[e].quand}</span></div>`).join('')}
    <div class="card"><b>${ETATS.trempe.nom}</b>${fig('blouse', null, 'trempe', 3, 'froid')}<span>${ETATS.trempe.quand}</span></div></div>

  <h2>Ses tenues, sous tous les côtés</h2>
  <p>Trois tenues, propres puis un peu sales, de face, de trois quarts et de dos. Toutes se portent dans n'importe quel état et avec n'importe quelle palette. La blouse de tailleur : sa ceinture de cuir et sa boucle, le ciseau glissé à la hanche, le maillet en main. Le tablier de carrier : le cuir épais griffé par les éclats, les bretelles croisées dans le dos, les genouillères, les manches retroussées. La pelisse de la Lande : la veste de laine bouillie ouverte sur la blouse, le col de mouton, les brandebourgs de bois.</p>
  <div class="row">${Object.entries(TENUES).map(([id, t]) => `<div class="card"><b>${t.nom}</b><div class="pair">${['front', 'se', 'ne'].map(v => fig(id, null, 'propre', 2, 'veille', v === 'front' ? 'face' : v === 'se' ? 'trois quarts' : 'dos', v)).join('')}</div><div class="pair">${['front', 'se', 'ne'].map(v => fig(id, null, 'poussiere', 2, 'veille', 'un peu sale', v)).join('')}</div><span>palette : ${PALETTES[t.palette].nom}</span></div>`).join('')}</div>

  <h2>Ses palettes</h2>
  <p>Le bonnet change de couleur ; la barbe de lichen, la peau de granit, la blouse et le maillet restent : on le reconnaît toujours.</p>
  <div class="row">${Object.entries(PALETTES).map(([id, p]) => `<div class="card"><b>${p.nom}</b><div class="pair">${fig('blouse', id, 'rafistole', 2)}${fig('carrier', id, 'propre', 2)}${fig('pelisse', id, 'propre', 2)}</div><span>${p.wool} · ${p.woolS}</span></div>`).join('')}</div>

  <h2>Ses couleurs fixes</h2>
  <div class="chips">${[[C.skin, 'Peau de granit'], [C.white, 'Cheveux et sourcils blancs'], [C.iris, 'Iris gris-bleu'], [C.beard, 'Barbe de lichen'], [C.lichen, 'Lichen jaune'], [C.lichenB, 'Lichen gris'], [C.wool, 'Bonnet rouille'], [C.darn, 'Reprise du bonnet'], [C.smock, 'Blouse'], [C.patch, 'Pièces'], [C.belt, 'Ceinture'], [C.apron, 'Cuir du carrier'], [C.coat, 'Pelisse'], [C.fleece, 'Col de mouton'], [C.wood, 'Maillet'], [C.steel, 'Ciseau'], [C.glow, 'La rune allumée'], [C.dust, 'Poussière de pierre'], [C.moss, 'Mousse'], [C.salt, 'Sel'], [C.mud, 'Boue'], ['#3C2819', 'Trait de la troupe']].map(([h, n]) => chip(h, n)).join('')}</div>

  <h2>À la taille du jeu</h2>
  <div class="grass">${ORDRE.map(e => fig('blouse', null, e, 1)).join('')}${['blouse', 'carrier', 'pelisse'].map(t => fig(t, null, 'poussiere', 2)).join('')}${fig('blouse', 'chauffe', 'ermite', 2)}${fig('carrier', 'lichen', 'rafistole', 2)}</div>

  <h2>Prêt à intégrer</h2>
  <p>Même usage que pour Lorena, Agathe et Nathan : on habille Robby, puis on le passe au kit comme n'importe quel maître.</p>
<pre>const { frame, svg } = require('design/personnages/troupe');
const { habiller } = require('design/personnages/refonte/robby_tenues');

// tenue : ${Object.keys(TENUES).join(' | ')}
// palette : ${Object.keys(PALETTES).join(' | ')}  (sinon celle de la tenue)
// état : ${Object.keys(ETATS).join(' | ')}
const robby = habiller('carrier', 'lichen', 'poussiere');
svg(frame(robby, 'front', 'repos', 0, 'veille'));</pre>
</div>`;
fs.writeFileSync(path.join(__dirname, 'robby_tenues.html'), html);
console.log('écrit : robby_tenues.html');
