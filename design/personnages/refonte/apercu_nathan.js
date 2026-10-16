// Planche d'étude de la refonte de Nathan (anciennement Rivet, Jovin dans HISTOIRE.md ; fichiers du jeu : rivet) : l'actuel
// et la refonte côte à côte (face, trois quarts, dos), ses expressions, la taille du jeu.
// node design/personnages/refonte/apercu_nathan.js → design/personnages/refonte/nathan_refonte.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const rivet = require('../rivet');
const { nathan } = require('./nathan_refonte');

const sv = (body, k, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${label}">${body}</svg>`;
const as = (k, label, v = 'front') => sv(frame({ ...rivet, uid: `ri${k}${v}` }, v, 'repos', 0), k, label);
const hr = (expr, k, n = 0, v = 'front') => sv(frame({ ...nathan, uid: `na${expr}${k}${n}${v}` }, v, 'repos', n, expr), k, `Nathan, ${expr}`);

const FAMILLES = [
  ['Le caractère', [['veille', 'Ailleurs', 'le repos : il pense déjà à autre chose'], ['decidee', 'Décidé', 'je m\'en occupe'], ['mefiante', 'Méfiant', 'les puits ne parlent pas'], ['pensive', 'Pensif', 'attends… non. si.'], ['ironique', 'Ironique', 'son jeu de mots tombe à plat'], ['concentree', 'Concentré', 'les lèvres pincées'], ['examine', 'Il examine', 'un œil plissé, de près']]],
  ['La joie', [['sourire', 'Le sourire', 'clic : la pièce s\'emboîte'], ['rire', 'Rire', 'elle tient !'], ['tendresse', 'Tendresse', 'Tic-Tac'], ['soulagee', 'Soulagé', 'tout se répare'], ['emerveillee', 'Émerveillé', 'eurêka']]],
  ['La peine', [['inquiete', 'Inquiet', 'ton feu tousse'], ['triste', 'Triste', 'l\'incendie'], ['sanglot', 'Sanglot', 'presque tout se répare'], ['coupable', 'Coupable', 'c\'était mon automate'], ['genee', 'Gêné', 'des poules ? sur une île ?']]],
  ['La peur, la colère', [['surprise', 'Surprise', 'les yeux grands'], ['peur', 'Peur', 'le feu'], ['colere', 'Colère', 'les dents serrées'], ['cri', 'Cri', 'attention, ça cède !'], ['boude', 'Boude', 'la moue']]],
  ['Le corps', [['epuisee', 'Épuisé', 'trois nuits à l\'établi'], ['endormie', 'Endormi', 'sur sa boîte de vis'], ['froid', 'Froid', 'trempé, au vent'], ['douleur', 'Douleur', 'le doigt pincé'], ['clin', 'Clin d\'œil', 'complice']]]
];

const html = `<title>Nathan, refonte du sprite</title>
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
  <h1>Nathan · refonte du sprite</h1>
  <p><b>Nathan</b> est le nouveau nom de Rivet, l'horloger-artificier (Jovin dans HISTOIRE.md ; dans les fichiers du jeu : rivet).</p>
  <p>Le même personnage, le même cadre 48 × 64, le même trait et le même kit. Poussé plus loin : les yeux noisette, le regard ailleurs au repos (il pense déjà à autre chose), une barbe de quelques jours ; les lunettes à quatre loupes cerclées de laiton et vissées, la grande de sa gauche fêlée ; les brassards d'horloger qui tiennent les manches retroussées ; la vieille brûlure sur l'avant-bras gauche et sur le tablier (l'incendie de son atelier, son secret) ; la clé de remontoir de Tic-Tac pendue au tablier ; le tablier rivé et surpiqué, sa poche décousue ; le cambouis sur la joue. L'épi gris bouge au vent. De dos, un crayon derrière chaque oreille (l'actuel n'en montrait qu'un).</p>
  <div class="vs">
    <div class="card"><b>Aujourd'hui</b><div class="pair">${['front', 'se', 'ne'].map(v => as(3, 'Rivet, le dessin actuel', v)).join('')}</div><span>×3 · face, trois quarts, dos</span></div>
    <div class="card"><b>Refonte</b><div class="pair">${['front', 'se', 'ne'].map(v => hr('veille', 3, 0, v)).join('')}</div><span>×3 · au repos, ailleurs</span></div>
  </div>
  ${FAMILLES.map(([f, list]) => `<h2>${f}</h2>
  <div class="row">${list.map(([k, n, t]) => `<div class="card"><b>${n}</b>${hr(k, 3)}<span>${t}</span></div>`).join('')}</div>`).join('\n  ')}
  <h2>À la taille du jeu</h2>
  <div class="grass">${as(1, 'Rivet ×1')}${hr('veille', 1)}${hr('rire', 1)}${hr('peur', 1)}${hr('triste', 1)}${as(2, 'Rivet ×2')}${hr('veille', 2)}${hr('rire', 2)}${hr('mefiante', 2)}${hr('peur', 2)}${hr('sanglot', 2)}${hr('froid', 2)}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'nathan_refonte.html'), html);
console.log('écrit : nathan_refonte.html');
