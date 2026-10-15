// Planche d'étude de la refonte de Robby (anciennement Galet, Saturnin dans HISTOIRE.md ; fichiers du jeu : galet) :
// l'actuel et la refonte côte à côte (face, trois quarts, dos), ses expressions, la taille du jeu.
// node design/personnages/refonte/apercu_robby.js → design/personnages/refonte/robby_refonte.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const galet = require('../galet');
const { robby } = require('./robby_refonte');

const sv = (body, k, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${label}">${body}</svg>`;
const as = (k, label, v = 'front') => sv(frame({ ...galet, uid: `ga${k}${v}` }, v, 'repos', 0), k, label);
const hr = (expr, k, n = 0, v = 'front') => sv(frame({ ...robby, uid: `rb${expr}${k}${n}${v}` }, v, 'repos', n, expr), k, `Robby, ${expr}`);

const FAMILLES = [
  ['Le caractère', [['veille', 'Bourru', 'le repos : « Hm. »'], ['decidee', 'Décidé', 'Hm !'], ['mefiante', 'Méfiant', 'un sourcil qui se lève'], ['pensive', 'Pensif', 'sa femme parlait pour deux'], ['ironique', 'Ironique', 'l\'humour sec'], ['concentree', 'Concentré', 'le ciseau sur la pierre']]],
  ['La joie', [['sourire', 'Le sourire', 'sous la moustache'], ['rire', 'Rire', 'rare, mais franc'], ['tendresse', 'Tendresse', 'la pierre qui chante'], ['soulagee', 'Soulagé', 'Basalte est là'], ['emerveillee', 'Émerveillé', 'le cristal']]],
  ['La peine', [['inquiete', 'Inquiet', 'l\'orage approche'], ['triste', 'Triste', 'seul, des années'], ['sanglot', 'Sanglot', 'Sat'], ['coupable', 'Coupable', 'il ne dit rien'], ['genee', 'Gêné', 'quand Brume traduit']]],
  ['La peur, la colère', [['surprise', 'Surprise', 'les sourcils qui montent'], ['peur', 'Peur', 'l\'éboulement'], ['colere', 'Colère', 'Hm !!'], ['cri', 'Cri', 'à l\'abri !'], ['boude', 'Boude', 'la moue sous la barbe']]],
  ['Le corps', [['epuisee', 'Épuisé', 'trop de marches à La Colline'], ['endormie', 'Endormi', 'dans sa fissure'], ['froid', 'Froid', 'la Lande en hiver'], ['douleur', 'Douleur', 'le maillet sur le doigt'], ['clin', 'Clin d\'œil', 'complice']]]
];

const html = `<title>Robby, refonte du sprite</title>
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
  <h1>Robby · refonte du sprite</h1>
  <p><b>Robby</b> est le nouveau nom de Galet, le vieux tailleur de runes, le mineur (Saturnin dans HISTOIRE.md ; dans les fichiers du jeu : galet).</p>
  <p>Le même personnage, le même cadre 48 × 64, le même trait et le même kit. Poussé plus loin : les yeux gris-bleu sous des paupières lourdes, bourru au repos, la bouche cachée sous la moustache (« Hm. ») ; les vrais sourcils broussailleux qui retombent sur les yeux (l'actuel avait deux barres plates) ; les rides et les grandes oreilles du vieil homme ; la barbe de lichen texturée, piquée de lichen jaune et gris ; le bonnet tricoté, ses mailles, ses trous d'où sortent les mèches blanches, la reprise, la mousse ; la poussière de pierre partout sur lui ; les pièces cousues sur la blouse ; le maillet au manche gainé de cuir, le ciseau à la tête écrasée. De dos, les cheveux blancs en mèches jusqu'à la nuque, au lieu du crâne lisse qui faisait un visage vide. La petite queue du bonnet bouge au vent.</p>
  <div class="vs">
    <div class="card"><b>Aujourd'hui</b><div class="pair">${['front', 'se', 'ne'].map(v => as(3, 'Galet, le dessin actuel', v)).join('')}</div><span>×3 · face, trois quarts, dos</span></div>
    <div class="card"><b>Refonte</b><div class="pair">${['front', 'se', 'ne'].map(v => hr('veille', 3, 0, v)).join('')}</div><span>×3 · au repos, bourru</span></div>
  </div>
  ${FAMILLES.map(([f, list]) => `<h2>${f}</h2>
  <div class="row">${list.map(([k, n, t]) => `<div class="card"><b>${n}</b>${hr(k, 3)}<span>${t}</span></div>`).join('')}</div>`).join('\n  ')}
  <h2>À la taille du jeu</h2>
  <div class="grass">${as(1, 'Galet ×1')}${hr('veille', 1)}${hr('rire', 1)}${hr('peur', 1)}${hr('triste', 1)}${as(2, 'Galet ×2')}${hr('veille', 2)}${hr('rire', 2)}${hr('mefiante', 2)}${hr('peur', 2)}${hr('sanglot', 2)}${hr('froid', 2)}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'robby_refonte.html'), html);
console.log('écrit : robby_refonte.html');
