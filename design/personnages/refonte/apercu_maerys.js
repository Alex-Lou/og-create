// Planche d'étude de la refonte de Maerys (anciennement Sylve ; fichiers du jeu : sylve) :
// l'actuel et la refonte côte à côte (face, trois quarts, dos), ses expressions, la taille du jeu.
// node design/personnages/refonte/apercu_maerys.js → design/personnages/refonte/maerys_refonte.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const sylve = require('../sylve');
const { maerys } = require('./maerys_refonte');

const sv = (body, k, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${label}">${body}</svg>`;
const as = (k, label, v = 'front') => sv(frame({ ...sylve, uid: `sy${k}${v}` }, v, 'repos', 0), k, label);
const hr = (expr, k, n = 0, v = 'front') => sv(frame({ ...maerys, uid: `my${expr}${k}${n}${v}` }, v, 'repos', n, expr), k, `Maerys, ${expr}`);

const FAMILLES = [
  ['Le caractère', [['veille', 'Aux aguets', 'le repos : le regard de côté, prête à filer'], ['mefiante', 'Méfiante', 'un humain, trop près'], ['pensive', 'Pensive', 'elle écoute les arbres'], ['concentree', 'Concentrée', 'la graine va germer'], ['decidee', 'Décidée', '« On ne coupe pas mes arbres. »'], ['chante', 'Elle chante', 'aux graines, les yeux fermés']]],
  ['La joie', [['sourire', 'Le sourire', 'rare, puis de plus en plus'], ['rire', 'Rire', 'vive et rieuse, une fois en confiance'], ['tendresse', 'Tendresse', 'un rouge-gorge sur son doigt'], ['emerveillee', 'Émerveillée', 'la pousse qui sort'], ['soulagee', 'Soulagée', 'la forêt brûlée repousse ici']]],
  ['La peine', [['inquiete', 'Inquiète', 'une bête perdue'], ['triste', 'Triste', 'sa forêt, l\'incendie'], ['sanglot', 'Sanglot', 'le radeau'], ['coupable', 'Coupable', 'elle s\'est cachée trop longtemps'], ['genee', 'Gênée', 'on la regarde']]],
  ['La peur, la colère', [['cachee', 'Cachée', 'entre ses doigts'], ['surprise', 'Surprise', 'un bruit dans les fougères'], ['peur', 'Peur', 'le feu'], ['boude', 'Boude', 'on a cassé une branche'], ['colere', 'Colère', 'la hache'], ['cri', 'Cri', '« Le feu ! »']]],
  ['Le corps', [['epuisee', 'Épuisée', 'des nuits à veiller les bêtes'], ['endormie', 'Endormie', 'contre la vieille souche'], ['froid', 'Froid', 'la pluie sous les arbres'], ['douleur', 'Aïe', 'une ronce'], ['clin', 'Clin d\'œil', 'complice, avec Mousse']]]
];

const html = `<title>Maerys, refonte du sprite</title>
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
.pair { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; justify-content: center; }
.card b { font-family: var(--display); font-size: 1.25rem; text-transform: uppercase; }
.card span { color: var(--sous); font-size: .75rem; }
.vs { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.grass { background: repeating-conic-gradient(#7FA65A 0 25%, #87AE60 0 50%) 0 0 / 32px 32px; border-radius: 12px; padding: 18px; display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; justify-content: center; }
svg { display: block; max-width: 100%; height: auto; }
</style>
<div class="wrap">
  <h1>Maerys · refonte du sprite</h1>
  <p><b>Maerys</b> est le nouveau nom de Sylve, la gardienne des bois (dans les fichiers du jeu : sylve).</p>
  <p>Le même personnage, le même cadre 48 × 64, le même trait et le même kit. Poussé plus loin : une jeune fille de 17 ans, seule dans la forêt depuis des années ; les yeux vert noisette, au repos sur ses gardes (le regard de côté, la bouche serrée de travers) ; les sourcils sombres, le petit nez droit, deux traits verts peints sur chaque pommette ; les cheveux sauvages de Sylve, la masse large aux pointes en zigzag jusqu'aux épaules, la frange en désordre, les mèches de côté qui pendent à côté du visage, les brindilles prises sur les côtés et la plume de geai ; la cape de feuilles cousues, au bas en pointes de feuilles, nouée au cou d'un col de feuilles ; la tunique de lin au bas déchiré en languettes, des fils qui pendent ; la liane en ceinture, une feuille glissée dans le nœud, et au poignet, une petite feuille qui y pousse ; pieds nus, la terre et la mousse de la forêt.</p>
  <div class="vs">
    <div class="card"><b>Aujourd'hui</b><div class="pair">${['front', 'se', 'ne'].map(v => as(3, 'Sylve, le dessin actuel', v)).join('')}</div><span>×3 · face, trois quarts, dos</span></div>
    <div class="card"><b>Refonte</b><div class="pair">${['front', 'se', 'ne'].map(v => hr('veille', 3, 0, v)).join('')}</div><span>×3 · au repos, aux aguets</span></div>
  </div>
  ${FAMILLES.map(([f, list]) => `<h2>${f}</h2>
  <div class="row">${list.map(([k, n, t]) => `<div class="card"><b>${n}</b>${hr(k, 3)}<span>${t}</span></div>`).join('')}</div>`).join('\n  ')}
  <h2>À la taille du jeu</h2>
  <div class="grass">${as(1, 'Sylve ×1')}${hr('veille', 1)}${hr('rire', 1)}${hr('peur', 1)}${hr('triste', 1)}${as(2, 'Sylve ×2')}${hr('veille', 2)}${hr('cachee', 2)}${hr('rire', 2)}${hr('peur', 2)}${hr('sanglot', 2)}${hr('endormie', 2)}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'maerys_refonte.html'), html);
console.log('écrit : maerys_refonte.html');
