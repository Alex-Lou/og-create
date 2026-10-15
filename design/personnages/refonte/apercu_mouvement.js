// Planche animée de Lorena (anciennement Hermine ; fichiers du jeu : aster) : la marche dans les quatre directions, le
// repos, le salut, la longue-vue, ses poses de face et de trois quarts, ses tenues et états en mouvement.
// Chaque animation est un seul SVG : ses images s'y relaient en SMIL (une image à la fois, en boucle), comme en jeu.
// node design/personnages/refonte/apercu_mouvement.js → design/personnages/refonte/lorena_mouvement.html
const fs = require('fs');
const path = require('path');
const { frame, IMAGES } = require('../troupe');
const { habiller, TENUES, ETATS } = require('./lorena_tenues');
const { POSES, dessinerPose } = require('./lorena_poses');

// Les durées d'une image (s) : la marche à 10 images par seconde, le repos qui respire lentement
const DUREE = { marche: 0.1, repos: 0.55, salut: 0.22, action: 0.45, pose2: 0.42, pose4: 0.2 };
let uid = 0;
// Une animation : les images dans l'ordre, chacune visible à son tour ; miroir pour les directions de gauche
function anim(images, dt, k = 3, miroir = false, label = '') {
  const N = images.length, dur = `${(N * dt).toFixed(2)}s`;
  const kt = images.map((_, i) => (i / N).toFixed(4)).join(';');
  const g = images.map((s, i) => `<g opacity="${i ? 0 : 1}"><animate attributeName="opacity" dur="${dur}" repeatCount="indefinite" calcMode="discrete" keyTimes="${kt}" values="${images.map((_, j) => (j === i ? 1 : 0)).join(';')}"/>${s}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${label}">${miroir ? `<g transform="translate(48 0) scale(-1 1)">${g}</g>` : g}</svg>`;
}
const corps = (c, view, pose, n, expr) => frame({ ...c, uid: `${c.uid}m${uid++}` }, view, pose, n, expr);
const cycle = (c, view, pose, expr) => [...Array(IMAGES[pose]).keys()].map(n => corps(c, view, pose, n, expr));
const carte = (titre, svg, sous = '') => `<figure class="card">${svg}<figcaption><b>${titre}</b>${sous ? `<span>${sous}</span>` : ''}</figcaption></figure>`;

const base = habiller('cire', null, 'rescapee');
const marche = [
  ['Vers le bas, à gauche', 'se', false], ['Vers le bas, à droite', 'se', true],
  ['Vers le haut, à droite', 'ne', false], ['Vers le haut, à gauche', 'ne', true]
].map(([t, v, m]) => carte(t, anim(cycle(base, v, 'marche'), DUREE.marche, 3, m, `Lorena marche, ${t}`), `${v === 'se' ? 'trois quarts avant' : 'trois quarts dos'}${m ? ', en miroir' : ''} · 8 images`)).join('');

const quotidien = carte('Repos', anim(cycle(base, 'front', 'repos'), DUREE.repos, 3, false, 'Lorena au repos'), 'de face · 4 images, elle respire, elle cligne')
  + carte('Salut', anim(cycle(base, 'front', 'salut'), DUREE.salut, 3, false, 'Lorena salue'), 'de face · 4 images')
  + carte('Longue-vue', anim(cycle(base, 'se', 'action'), DUREE.action, 3, false, 'Lorena à la longue-vue'), 'trois quarts · 2 images');

const poses = view => Object.entries(POSES).map(([nom, p]) => {
  const imgs = [...Array(p.images).keys()].map(n => dessinerPose({ ...base, uid: `${base.uid}${view}${nom}${uid++}` }, nom, view, n));
  return carte(p.nom, anim(imgs, p.images === 4 ? DUREE.pose4 : DUREE.pose2, 3, false, `Lorena, ${p.nom}`), `${p.images} images`);
}).join('');

// Les tenues et les états, en marche vers le bas
const tenues = Object.keys(TENUES).map(t => carte(TENUES[t].nom, anim(cycle(habiller(t, null, 'poussiere'), 'se', 'marche'), DUREE.marche, 2, false, `Lorena en marche, ${TENUES[t].nom}`), 'un peu sale')).join('');
const etats = ['naufragee', 'rescapee', 'rafistolee', 'poussiere', 'propre', 'trempee'].map(e => carte(ETATS[e].nom, anim(cycle(habiller('cire', null, e), 'se', 'marche'), DUREE.marche, 2, false, `Lorena en marche, ${ETATS[e].nom}`))).join('');

const html = `<title>Lorena, mouvement et poses</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche animée : la marche, le quotidien, les poses (face, trois quarts), puis tenues et états en mouvement. Fond clair des planches du kit. */
:root { --fond: #F5EEDF; --carte: #E4EFD3; --trait: #3C2819; --sous: #6B5A48; --accent: #C8463A;
  --display: "Big Shoulders Display", Impact, "Arial Narrow", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--trait); font-family: var(--mono); font-size: 13px; }
.wrap { max-width: 1240px; margin: 0 auto; padding-block: 28px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 20px; }
h1, h2 { font-family: var(--display); font-weight: 900; text-transform: uppercase; margin: 0; line-height: .95; }
h1 { font-size: 2.8rem; } h2 { font-size: 1.6rem; }
p { margin: 0; max-width: 78ch; line-height: 1.5; color: var(--sous); }
.name { display: inline-block; background: var(--accent); color: #FFF6EA; font-family: var(--display); font-weight: 900; font-size: 1.1rem; letter-spacing: .04em; padding: 2px 10px; border-radius: 4px; }
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.card { margin: 0; background: var(--carte); border-radius: 12px; padding: 12px 14px; display: grid; gap: 6px; justify-items: center; align-content: start; }
.card figcaption { display: grid; justify-items: center; gap: 2px; text-align: center; }
.card b { font-family: var(--display); font-size: 1.15rem; text-transform: uppercase; }
.card span { color: var(--sous); font-size: .72rem; max-width: 22ch; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>Lorena · mouvement et poses</h1>
  <p><span class="name">LORENA</span> est le nouveau nom d'Hermine, la navigatrice (dans les fichiers du jeu : aster). Tout ce qui suit bouge : chaque carte rejoue ses images en boucle, au rythme du jeu. La queue de cheval, les épis et les gouttes bougent en continu par-dessus.</p>
  <h2>La marche, dans les quatre directions</h2>
  <p>Trois quarts avant et trois quarts dos ; les deux autres directions sont leur miroir, comme pour toute la troupe. Les bras balancent avec leurs manches, le corps monte au passage des jambes, le bas du ciré balance avec le pas.</p>
  <div class="row">${marche}</div>
  <h2>Le quotidien</h2>
  <div class="row">${quotidien}</div>
  <h2>Ses poses, de face</h2>
  <p>Des expressions du corps, à la façon chibi : chaque pose a son expression du visage, et se combine avec n'importe quelle tenue et n'importe quel état.</p>
  <div class="row">${poses('front')}</div>
  <h2>Ses poses, de trois quarts</h2>
  <div class="row">${poses('se')}</div>
  <h2>Ses tenues, en marche</h2>
  <div class="row">${tenues}</div>
  <h2>Ses états, en marche</h2>
  <div class="row">${etats}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'lorena_mouvement.html'), html);
console.log('écrit : lorena_mouvement.html');
