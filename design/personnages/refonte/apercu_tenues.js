// Planche des tenues, palettes et états de Lorena (anciennement Hermine ; fichiers du jeu : aster).
// node design/personnages/refonte/apercu_tenues.js → design/personnages/refonte/lorena_tenues.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const { habiller, TENUES, PALETTES, ETATS } = require('./lorena_tenues');
const { C } = require('./lorena_refonte');

let n = 0;
const fig = (tenue, palette, etat, k, expr = 'veille', legende = '') => {
  const c = habiller(tenue, palette, etat);
  const body = frame({ ...c, uid: `${c.uid}${n++}` }, 'front', 'repos', 0, expr);
  return `<figure><svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="Lorena, ${TENUES[tenue].nom}, ${ETATS[etat].nom}">${body}</svg>${legende ? `<figcaption>${legende}</figcaption>` : ''}</figure>`;
};
const chip = (hex, nom) => `<div class="chip"><i style="background:${hex}"></i><span>${nom}<code>${hex}</code></span></div>`;

const ORDRE = ['propre', 'poussiere', 'rafistolee', 'rescapee', 'naufragee', 'trempee'];
const EXPR_ETAT = { propre: 'sourire', poussiere: 'veille', rafistolee: 'decidee', rescapee: 'veille', naufragee: 'epuisee', trempee: 'froid' };

const html = `<title>Lorena, tenues et états</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche : les états en frise, puis les tenues, les palettes, les couleurs et l'appel prêt à intégrer. Fond clair des planches du kit. */
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
  <h1>Lorena · tenues et états</h1>
  <p><span class="name">LORENA</span> est le nouveau nom d'Hermine, la navigatrice (dans les fichiers du jeu : aster). Même dessin que la refonte du sprite ; ici, ce qu'elle porte et dans quel état.</p>

  <h2>Ses états, du naufrage au propre</h2>
  <p>Le ciré jaune signal, de gauche à droite dans l'ordre de l'histoire. Chaque état règle ce qu'on voit sur elle : ourlet déchiré, recousu ou net ; sel, poussière et boue ; pièce de toile, corde, sparadrap, poignet bandé ; l'eau qui fonce le tissu.</p>
  <div class="row">${['naufragee', 'rescapee', 'rafistolee', 'poussiere', 'propre'].map((e, i) => `${i ? '<span class="arrow">→</span>' : ''}<div class="card"><b>${ETATS[e].nom}</b>${fig('cire', null, e, 3, EXPR_ETAT[e])}<span>${ETATS[e].quand}</span></div>`).join('')}
    <div class="card"><b>${ETATS.trempee.nom}</b>${fig('cire', null, 'trempee', 3, 'froid')}<span>${ETATS.trempee.quand}</span></div></div>

  <h2>Ses tenues</h2>
  <p>Quatre tenues, chacune avec sa palette par défaut, ici propre puis un peu sale. Toutes se portent dans n'importe quel état.</p>
  <div class="row">${Object.entries(TENUES).map(([id, t]) => `<div class="card"><b>${t.nom}</b><div class="pair">${fig(id, null, 'propre', 3, 'veille', 'propre')}${fig(id, null, 'poussiere', 3, 'veille', 'un peu sale')}</div><span>palette : ${PALETTES[t.palette].nom}</span></div>`).join('')}</div>

  <h2>Ses palettes</h2>
  <p>Le dessus (ciré, vareuse ou gilet) change de couleur ; le foulard rouge, le roux et le laiton restent : on la reconnaît toujours.</p>
  <div class="row">${Object.entries(PALETTES).map(([id, p]) => `<div class="card"><b>${p.nom}</b><div class="pair">${fig('cire', id, 'rafistolee', 2)}${fig('vareuse', id, 'propre', 2)}</div><span>${p.coat} · ${p.coatS}</span></div>`).join('')}</div>

  <h2>Ses couleurs fixes</h2>
  <div class="chips">${[[C.skin, 'Peau'], [C.hair, 'Roux'], [C.hairH, 'Reflet des cheveux'], [C.iris, 'Iris vert d\'eau'], [C.scarf, 'Foulard'], [C.brass, 'Laiton'], [C.rope, 'Filin'], [C.cloth, 'Toile (sparadrap, bandage)'], [C.shirt, 'Lin, marinière'], [C.stripe, 'Rayure marine'], [C.salt, 'Sel'], [C.mud, 'Boue'], [C.rim, 'Contre-jour de brume'], ['#3C2819', 'Trait de la troupe']].map(([h, n]) => chip(h, n)).join('')}</div>

  <h2>À la taille du jeu</h2>
  <div class="grass">${ORDRE.map(e => fig('cire', null, e, 1)).join('')}${['cire', 'ouvert', 'vareuse', 'chemise'].map(t => fig(t, null, 'poussiere', 2)).join('')}${fig('cire', 'rouille', 'rescapee', 2)}${fig('cire', 'algue', 'rafistolee', 2)}</div>

  <h2>Prêt à intégrer</h2>
  <p>Même usage que les tenues d'hiver et de pluie de l'atelier : on habille Lorena, puis on la passe au kit comme n'importe quel maître.</p>
<pre>const { frame, svg } = require('design/personnages/troupe');
const { habiller } = require('design/personnages/refonte/lorena_tenues');

// tenue : ${Object.keys(TENUES).join(' | ')}
// palette : ${Object.keys(PALETTES).join(' | ')}  (sinon celle de la tenue)
// état : ${Object.keys(ETATS).join(' | ')}
const lorena = habiller('vareuse', 'nuit', 'rafistolee');
svg(frame(lorena, 'front', 'repos', 0, 'decidee'));</pre>
</div>`;
fs.writeFileSync(path.join(__dirname, 'lorena_tenues.html'), html);
console.log('écrit : lorena_tenues.html');
