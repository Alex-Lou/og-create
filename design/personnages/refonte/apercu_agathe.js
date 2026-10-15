// Planche d'étude de la refonte d'Agathe (anciennement Marcelle ; fichiers du jeu : cannelle) : l'actuel et la refonte côte à côte, ses expressions, la taille du jeu.
// node design/personnages/refonte/apercu_agathe.js → design/personnages/refonte/agathe_refonte.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const cannelle = require('../cannelle');
const { agathe } = require('./agathe_refonte');

const sv = (body, k, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${label}">${body}</svg>`;
const as = (k, label) => sv(frame({ ...cannelle, uid: `ca${k}` }, 'front', 'repos', 0), k, label);
const hr = (expr, k, n = 0) => sv(frame({ ...agathe, uid: `ag${expr}${k}${n}` }, 'front', 'repos', n, expr), k, `Agathe, ${expr}`);

const FAMILLES = [
  ['Le caractère', [['veille', 'Soucieuse', 'le repos'], ['decidee', 'Décidée', 'en cuisine, aux ordres'], ['mefiante', 'Méfiante', 'un sourcil, de côté'], ['pensive', 'Pensive', 'le regard ailleurs'], ['ironique', 'Ironique', 'un coin de bouche'], ['concentree', 'Concentrée', 'la lèvre mordue']]],
  ['La joie', [['sourire', 'Le sourire rare', 'en coin, fatigué'], ['rire', 'Rire', 'enfin'], ['tendresse', 'Tendresse', 'mon caneton'], ['soulagee', 'Soulagée', 'ouf'], ['emerveillee', 'Émerveillée', 'un feu follet… gentil']]],
  ['La peine', [['inquiete', 'Inquiète', 'et Pierrot ?'], ['triste', 'Triste', 'le goût perdu'], ['sanglot', 'Sanglot', 'ça lâche'], ['coupable', 'Coupable', 'le regard qui tombe'], ['genee', 'Gênée', 'regard fuyant']]],
  ['La peur, la colère', [['surprise', 'Surprise', 'les yeux grands'], ['peur', 'Peur', 'pupilles serrées'], ['colere', 'Colère', 'les dents serrées'], ['cri', 'Cri', 'à table !'], ['boude', 'Boude', 'la moue']]],
  ['Le corps', [['epuisee', 'Épuisée', 'après la nuit'], ['endormie', 'Endormie', 'au coin du feu'], ['froid', 'Froid', 'mouillée, au vent'], ['douleur', 'Douleur', 'une brûlure'], ['clin', 'Clin d\'œil', 'complice']]]
];

const html = `<title>Agathe, refonte du sprite</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Planche : l'actuel contre la refonte, puis la gamme d'expressions, puis la taille du jeu. Fond de planche clair, comme les planches du kit. */
:root { --fond: #F5EEDF; --carte: #E4EFD3; --trait: #3C2819; --sous: #6B5A48; --accent: #C8463A;
  --display: "Big Shoulders Display", Impact, "Arial Narrow", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--trait); font-family: var(--mono); font-size: 13px; }
.wrap { max-width: 1180px; margin: 0 auto; padding-block: 28px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 22px; }
h1, h2 { font-family: var(--display); font-weight: 900; text-transform: uppercase; margin: 0; line-height: .95; }
h1 { font-size: 2.8rem; } h2 { font-size: 1.6rem; }
p { margin: 0; max-width: 74ch; line-height: 1.5; color: var(--sous); }
.row { display: flex; flex-wrap: wrap; gap: 16px; }
.card { background: var(--carte); border-radius: 12px; padding: 14px 16px; display: grid; gap: 8px; justify-items: center; }
.card b { font-family: var(--display); font-size: 1.25rem; text-transform: uppercase; }
.card span { color: var(--sous); font-size: .75rem; }
.vs { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.grass { background: repeating-conic-gradient(#7FA65A 0 25%, #87AE60 0 50%) 0 0 / 32px 32px; border-radius: 12px; padding: 18px; display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; justify-content: center; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>Agathe · refonte du sprite</h1>
  <p><b>Agathe</b> est le nouveau nom de Marcelle (la cuisinière-guérisseuse ; dans les fichiers du jeu : cannelle).</p>
  <p>Le même personnage, le même cadre 48 × 64 (vue de face pour l'instant), le même trait et le même kit. Poussé plus loin : yeux bruns à paupière lourde, les rides de son âge, soucieuse au repos (le sourire devient rare), et le naufrage sur elle (la suie du feu sur la joue et le front, le chignon à moitié défait, le tablier déchiré et taché, le sel au bas de la robe, un brin d'herbes dans la poche, les manches retroussées). Les mèches échappées bougent au vent.</p>
  <div class="vs">
    <div class="card"><b>Aujourd'hui</b>${as(5, 'Marcelle, le dessin actuel')}<span>×5</span></div>
    <div class="card"><b>Refonte</b>${hr('veille', 5)}<span>×5 · au repos, soucieuse</span></div>
  </div>
  ${FAMILLES.map(([f, list]) => `<h2>${f}</h2>
  <div class="row">${list.map(([k, n, t]) => `<div class="card"><b>${n}</b>${hr(k, 3)}<span>${t}</span></div>`).join('')}</div>`).join('\n  ')}
  <h2>À la taille du jeu</h2>
  <div class="grass">${as(1, 'Marcelle ×1')}${hr('veille', 1)}${hr('rire', 1)}${hr('peur', 1)}${hr('triste', 1)}${as(2, 'Marcelle ×2')}${hr('veille', 2)}${hr('rire', 2)}${hr('mefiante', 2)}${hr('peur', 2)}${hr('sanglot', 2)}${hr('froid', 2)}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'agathe_refonte.html'), html);
console.log('écrit : agathe_refonte.html');
