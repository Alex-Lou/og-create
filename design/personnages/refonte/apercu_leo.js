// Planche d'étude de la refonte de Léo (anciennement Ondin, Pierrot dans les premières bibles ; fichiers du jeu : ondin) :
// l'actuel et la refonte côte à côte (face, trois quarts, dos), ses expressions, la taille du jeu.
// node design/personnages/refonte/apercu_leo.js → design/personnages/refonte/leo_refonte.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const ondin = require('../ondin');
const { leo } = require('./leo_refonte');

const sv = (body, k, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${label}">${body}</svg>`;
const as = (k, label, v = 'front') => sv(frame({ ...ondin, uid: `on${k}${v}` }, v, 'repos', 0), k, label);
const hr = (expr, k, n = 0, v = 'front') => sv(frame({ ...leo, uid: `le${expr}${k}${n}${v}` }, v, 'repos', n, expr), k, `Léo, ${expr}`);

const FAMILLES = [
  ['Le caractère', [['veille', 'À moitié endormi', 'le repos : la brume le tient encore'], ['reveil', 'Réveillé d\'un coup', '« Là ! Ça tire ! »'], ['pensive', 'Rêveur', 'il raconte ses rêves comme des faits'], ['mefiante', 'Sceptique', 'l\'eau profonde'], ['concentree', 'Concentré', 'la baguette qui tremble'], ['decidee', 'Décidé', 'je trouverai ce que tu as perdu']]],
  ['La joie', [['sourire', 'Le sourire', 'tout petit, ensommeillé'], ['rire', 'Rire', 'drôle sans le vouloir'], ['tendresse', 'Tendresse', 'Bulle est revenu'], ['emerveillee', 'Émerveillé', 'la lune lui parle'], ['soulagee', 'Soulagé', 'Tatie est là']]],
  ['La peine', [['inquiete', 'Inquiet', 'la brume monte'], ['triste', 'Triste', '« Bulle est retourné dans la mer. »'], ['sanglot', 'Sanglot', 'ses parents'], ['coupable', 'Coupable', 'il a perdu la clé'], ['genee', 'Gêné', '« Tatie » devant tout le monde']]],
  ['La peur, la colère', [['surprise', 'Surprise', 'la baguette qui plonge'], ['peur', 'Peur', 'l\'eau profonde'], ['boude', 'Boude', 'il ne veut pas se coucher'], ['cri', 'Cri', 'Bulle !'], ['colere', 'Colère', 'rare, et toute petite']]],
  ['Le corps', [['epuisee', 'Épuisé', 'il s\'endort debout'], ['endormie', 'Endormi', 'sur sa planche, à La Source'], ['froid', 'Froid', 'la nuit sur la plage'], ['douleur', 'Aïe', 'un caillou sous le pied nu'], ['clin', 'Clin d\'œil', 'complice']]]
];

const html = `<title>Léo, refonte du sprite</title>
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
  <h1>Léo · refonte du sprite</h1>
  <p><b>Léo</b> est le nouveau nom d'Ondin, le petit sourcier (Pierrot dans les premières bibles ; dans les fichiers du jeu : ondin).</p>
  <p>Le même personnage, le même cadre 48 × 64, le même trait et le même kit. Poussé plus loin : un enfant de 10 ans, la tête posée plus bas sur un corps plus court ; les grands yeux d'enfant à l'iris bleu d'eau, mi-clos au repos, le regard qui monte vers la lune (la brume le tient encore) ; les sourcils clairs et fins, le nez bouton, les joues roses ; les boucles blondes en frange sous le revers, leurs vrilles ; le bonnet de nuit aux rayures qui suivent le cône, son pompon qui se balance ; le ciré bleu trop grand jusqu'aux genoux, son grand col, ses chevilles de bois, la grande poche, les manches retroussées ; la ceinture de corde nouée, le bocal de Bulle (vide, ou Bulle revenu) ; la baguette de noisetier fourchue, son écorce et sa feuille ; l'algue prise dans les boucles et le sel du ciré, la vague qui l'a posé sur sa planche.</p>
  <div class="vs">
    <div class="card"><b>Aujourd'hui</b><div class="pair">${['front', 'se', 'ne'].map(v => as(3, 'Ondin, le dessin actuel', v)).join('')}</div><span>×3 · face, trois quarts, dos</span></div>
    <div class="card"><b>Refonte</b><div class="pair">${['front', 'se', 'ne'].map(v => hr('veille', 3, 0, v)).join('')}</div><span>×3 · au repos, à moitié endormi</span></div>
  </div>
  ${FAMILLES.map(([f, list]) => `<h2>${f}</h2>
  <div class="row">${list.map(([k, n, t]) => `<div class="card"><b>${n}</b>${hr(k, 3)}<span>${t}</span></div>`).join('')}</div>`).join('\n  ')}
  <h2>À la taille du jeu</h2>
  <div class="grass">${as(1, 'Ondin ×1')}${hr('veille', 1)}${hr('rire', 1)}${hr('peur', 1)}${hr('triste', 1)}${as(2, 'Ondin ×2')}${hr('veille', 2)}${hr('reveil', 2)}${hr('rire', 2)}${hr('peur', 2)}${hr('sanglot', 2)}${hr('endormie', 2)}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'leo_refonte.html'), html);
console.log('écrit : leo_refonte.html');
