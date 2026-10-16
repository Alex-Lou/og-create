// Planche d'étude de la refonte d'Anya, l'Âme de l'Île : l'actuelle et la refonte côte à côte (face, trois quarts,
// dos), ses saisons, ses deux états, ses expressions, son cerf de lune à ses côtés, la taille du jeu.
// node design/personnages/refonte/apercu_anya.js → design/personnages/refonte/anya_refonte.html
const fs = require('fs');
const path = require('path');
const ancienne = require('../../atelier/anya');
const { anya, SAISONS } = require('./anya_refonte');
const { ETATS } = require('./anya_tenues');
const { cerfLune } = require('./cerf_lune');

let uid = 0;
const sv = (body, k, label, w = 80, h = 128) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * k}" height="${h * k}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`;
// (l'actuelle paraît plusieurs fois : chacune de ses images reçoit ses propres ids)
const av = (k, v, saison = 'ete') => { const u = `v${uid++}`; return ancienne.svgA(ancienne.anyaFrame(v, v === 'front' ? 'repos' : 'marche', 0, 'neutre', saison), k).replace(/id="/g, `id="${u}`).replace(/url\(#/g, `url(#${u}`); };
const an = (k, v, o = {}, saison = 'ete') => sv(anya({ uid: `ap${uid++}`, saison }, v, { lev: 2, ...o }), k, `Anya, ${SAISONS[saison].nom}`);

const EXPRS = [['veille', 'Sereine', 'au repos : les paupières un peu basses, un très léger sourire'], ['bienveillante', 'Bienveillante', 'elle bénit, elle crée'],
  ['parle', 'Elle parle', '« L\'île le sent. »'], ['recueillie', 'Recueillie', 'les yeux fermés : endormie, ou quand elle crée'], ['sourire', 'Le sourire', 'rare, lumineux'], ['triste', 'Triste', 'ce que le Voile a pris']];

const html = `<title>Anya, refonte du sprite</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche : l'actuelle contre la refonte, ses saisons, ses états, ses expressions, son cerf, puis la taille du jeu. Fond de planche clair, comme les planches du kit ; ses cartes de nuit (elle luit). */
:root { --fond: #F5EEDF; --carte: #2E3A4E; --trait: #3C2819; --sous: #6B5A48; --clair: #E8EEF8;
  --display: "Big Shoulders Display", Impact, "Arial Narrow", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--trait); font-family: var(--mono); font-size: 13px; }
.wrap { max-width: 1180px; margin: 0 auto; padding-block: 28px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 22px; }
h1, h2 { font-family: var(--display); font-weight: 900; text-transform: uppercase; margin: 0; line-height: .95; }
h1 { font-size: 2.8rem; } h2 { font-size: 1.6rem; }
p { margin: 0; max-width: 74ch; line-height: 1.5; color: var(--sous); }
.row { display: flex; flex-wrap: wrap; gap: 16px; }
.card { background: var(--carte); color: var(--clair); border-radius: 12px; padding: 14px 16px; display: grid; gap: 8px; justify-items: center; }
.pair { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; justify-content: center; }
.card b { font-family: var(--display); font-size: 1.25rem; text-transform: uppercase; }
.card span { color: #B9C4DA; font-size: .75rem; text-align: center; }
.vs { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
.grass { background: repeating-conic-gradient(#7FA65A 0 25%, #87AE60 0 50%) 0 0 / 32px 32px; border-radius: 12px; padding: 18px; display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; justify-content: center; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>Anya · refonte du sprite</h1>
  <p><b>Anya</b>, l'Âme de l'Île : un esprit, la déesse et la créatrice de l'île (HISTOIRE.md § 6.14). Les formes de l'Anya d'aujourd'hui : ses proportions, les deux mèches qui encadrent son visage jusqu'à la taille, le manteau vivant qui l'enveloppe des épaules au sol, ouvert devant sur la robe claire, son ourlet de plumes, ses feuilles, ses fleurs et ses papillons ; le dos coiffé, une couronne de fleurs derrière la tête. Les couleurs et les effets de la lune et de l'argent : la peau nacrée parcourue de veines comme des constellations ; la chevelure d'argent vivante, qui ondule ; les oreilles pointues ; les yeux bleu-gris cerclés de lumière ; les grands bois d'argent fleuris où nichent un oiseau et des lucioles ; la gemme verte (la Terre, au centre des sept sceaux) ; la robe qui se défait en brume. Elle flotte. À ses côtés, le cerf de lune.</p>
  <div class="vs">
    <div class="card"><b>Aujourd'hui</b><div class="pair">${['front', 'se', 'ne'].map(v => av(2, v)).join('')}</div><span>×2 · face, trois quarts, dos</span></div>
    <div class="card"><b>Refonte</b><div class="pair">${['front', 'se', 'ne'].map(v => an(2, v)).join('')}</div><span>×2 · face, trois quarts, dos</span></div>
  </div>
  <h2>Le manteau vivant, au fil des saisons</h2>
  <p>Sa couleur, ses nervures qui luisent, son ourlet, ses plumes, ce qui pousse dessus et les ailes de ses papillons.</p>
  <div class="row">${Object.entries(SAISONS).map(([k, S]) => `<div class="card"><b>${S.nom}</b><div class="pair">${an(2, 'front', {}, k)}${an(2, 'ne', {}, k)}</div></div>`).join('')}</div>
  <h2>Ses deux états</h2>
  <div class="row">${Object.entries(ETATS).map(([k, E]) => `<div class="card"><b>${E.nom}</b><div class="pair">${['front', 'se', 'ne'].map(v => an(2, v, k === 'voilee' ? { pierre: 1, lierre: 1, lev: 0 } : {})).join('')}</div><span>${E.quand}</span></div>`).join('')}</div>
  <h2>Ses expressions</h2>
  <div class="row">${EXPRS.map(([e, n, t]) => `<div class="card"><b>${n}</b>${sv(anya({ uid: `ex${uid++}` }, 'front', { lev: 2, expr: e }), 2, `Anya, ${n}`, 80, 128).replace('viewBox="0 0 80 128"', 'viewBox="14 6 52 52"').replace(/width="160" height="256"/, 'width="156" height="156"')}<span>${t}</span></div>`).join('')}</div>
  <h2>Le cerf de lune, à ses côtés</h2>
  <p>Son compagnon, un sprite à part (cerf_lune.js), à la même échelle : grand et élancé, la robe nacrée, d'immenses bois d'argent en lyre portant fleurs et lucioles, un croissant de lune entre eux, des constellations sur le flanc, la gorge claire, des yeux bleu-gris nobles, des sabots d'argent.</p>
  <div class="card"><svg xmlns="http://www.w3.org/2000/svg" width="555" height="432" viewBox="0 0 185 144" role="img" aria-label="Anya et le cerf de lune"><g transform="translate(0 16)">${anya({ uid: 'cote' }, 'se', { lev: 2 })}</g><g transform="translate(65 0)">${cerfLune('se', 'debout', 0)}</g></svg></div>
  <h2>À la taille du jeu</h2>
  <div class="grass">${av(1, 'front')}${an(1, 'front')}${an(1, 'se')}${an(1, 'ne')}${av(1.5, 'front')}${an(1.5, 'front')}${an(1.5, 'se', {}, 'automne')}${an(1.5, 'front', { pierre: 1, lierre: 1, lev: 0 })}${sv(cerfLune('se', 'debout', 0, { id: 'jeu' }), 1, 'Le cerf de lune', 120, 144)}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'anya_refonte.html'), html);
console.log('écrit : anya_refonte.html');
