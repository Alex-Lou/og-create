// Planche d'étude de la refonte de Maggy (anciennement Mélisse ; fichiers du jeu : melisse) :
// l'actuel et la refonte côte à côte (face, trois quarts, dos), ses expressions, la taille du jeu.
// node design/personnages/refonte/apercu_maggy.js → design/personnages/refonte/maggy_refonte.html
const fs = require('fs');
const path = require('path');
const { frame } = require('../troupe');
const melisse = require('../melisse');
const { maggy } = require('./maggy_refonte');

const sv = (body, k, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${48 * k}" height="${64 * k}" viewBox="0 0 48 64" role="img" aria-label="${label}">${body}</svg>`;
const as = (k, label, v = 'front') => sv(frame({ ...melisse, uid: `me${k}${v}` }, v, 'repos', 0), k, label);
const hr = (expr, k, n = 0, v = 'front') => sv(frame({ ...maggy, uid: `mg${expr}${k}${n}${v}` }, v, 'repos', n, expr), k, `Maggy, ${expr}`);

const FAMILLES = [
  ['Le caractère', [['veille', 'Calme absolu', 'le repos : les paupières lourdes, un sourire en coin'], ['pensive', 'Mystérieuse', 'elle répond par une question'], ['ironique', 'Pince-sans-rire', '« Chaque chose en sa lune. »'], ['concentree', 'Concentrée', 'la graine choisie'], ['mefiante', 'Méfiante', 'ce qui la suivait dans la forêt'], ['lune', 'À la lune', 'les yeux fermés, elle écoute pousser']]],
  ['La joie', [['sourire', 'Le sourire', 'lent, tranquille'], ['rire', 'Rire', 'rare, et doux'], ['tendresse', 'Tendresse', 'Lunette sur son chapeau'], ['emerveillee', 'Émerveillée', 'les graines qui luisent'], ['soulagee', 'Soulagée', 'des gens, enfin']]],
  ['La peine', [['inquiete', 'Inquiète', 'quelqu\'un la suivait'], ['triste', 'Triste', 'le jardin de sa grand-mère'], ['sanglot', 'Sanglot', 'la barque brisée'], ['coupable', 'Coupable', 'une graine perdue'], ['genee', 'Gênée', 'on la remercie']]],
  ['La peur, la colère', [['essoufflee', 'Essoufflée', 'elle sort de la forêt, en danger'], ['surprise', 'Surprise', 'un bruit derrière elle'], ['peur', 'Peur', 'la forêt, la nuit'], ['boude', 'Boude', 'on a marché sur ses semis'], ['colere', 'Colère', 'rare et froide']]],
  ['Le corps', [['epuisee', 'Épuisée', 'après la fuite'], ['endormie', 'Endormie', 'la tête sur sa boîte'], ['froid', 'Froid', 'l\'averse sur le Potager'], ['douleur', 'Aïe', 'une ronce'], ['clin', 'Clin d\'œil', 'son secret']]]
];

const html = `<title>Maggy, refonte du sprite</title>
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
  <h1>Maggy · refonte du sprite</h1>
  <p><b>Maggy</b> est le nouveau nom de Mélisse, la jardinière des lunes (dans les fichiers du jeu : melisse).</p>
  <p>Le même personnage, le même cadre 48 × 64, le même trait et le même kit. Poussé plus loin : 35 ans, calme absolu ; les yeux lavande aux paupières lourdes, un sourire en coin, le regard ailleurs ; le grand chapeau de paille tressée, son ruban prune et le bouquet de fleurs séchées (lavande, rose, fleur jaune) ; la longue tresse nattée qui sort de derrière la tête et tombe sur son épaule, ses mèches croisées, son lien prune et sa fleur ; le châle couleur nuit brodé de croissants et d'étoiles, ses franges ; la robe sauge, les sabots de bois sur les bas sombres, les mains toujours terreuses ; la boîte à graines en fer, rivetée, le croissant embouti et le loquet de laiton, serrée au creux de son bras. À son arrivée, elle sort de la forêt où quelqu'un la suivait : le châle accroché aux ronces, une feuille et une brindille dans le chapeau de travers, la tresse défaite, une égratignure.</p>
  <div class="vs">
    <div class="card"><b>Aujourd'hui</b><div class="pair">${['front', 'se', 'ne'].map(v => as(3, 'Mélisse, le dessin actuel', v)).join('')}</div><span>×3 · face, trois quarts, dos</span></div>
    <div class="card"><b>Refonte</b><div class="pair">${['front', 'se', 'ne'].map(v => hr('veille', 3, 0, v)).join('')}</div><span>×3 · au repos, calme absolu</span></div>
  </div>
  ${FAMILLES.map(([f, list]) => `<h2>${f}</h2>
  <div class="row">${list.map(([k, n, t]) => `<div class="card"><b>${n}</b>${hr(k, 3)}<span>${t}</span></div>`).join('')}</div>`).join('\n  ')}
  <h2>À la taille du jeu</h2>
  <div class="grass">${as(1, 'Mélisse ×1')}${hr('veille', 1)}${hr('rire', 1)}${hr('peur', 1)}${hr('triste', 1)}${as(2, 'Mélisse ×2')}${hr('veille', 2)}${hr('essoufflee', 2)}${hr('rire', 2)}${hr('peur', 2)}${hr('sanglot', 2)}${hr('endormie', 2)}</div>
</div>`;
fs.writeFileSync(path.join(__dirname, 'maggy_refonte.html'), html);
console.log('écrit : maggy_refonte.html');
