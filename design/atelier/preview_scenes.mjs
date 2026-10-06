// Lot J — les scènes de l'histoire : un SVG animé par image de PrologueArt.vue (même clé « art », même cadre 400 × 400),
// au trait de la troupe. Écrit lib/scenes/<groupe>/<art>.svg, l'index scenes.json, une planche par groupe (images clés,
// sans animation) et la page animée scenes_apercu.html (chaque scène dans une <img> : elle s'anime seule).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { SC, sceneSvg } from './scenes.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'scenes');
const PNG = path.join(DIR, 'planches');

const GROUPS = { tutoriel: 'Le tutoriel « Le Naufrage de l\'Hirondelle »', veillees: 'Les veillées', anya: 'Anya', finale: 'La finale' };
const STEPS = { T1: 'étape 1 — Brume', T2: 'étape 2 — Aster', T3: 'étape 3 — Cannelle', T4: 'étape 4 — Rivet', T5: 'étape 5 — Ondin' };
const groupOf = sc => sc.group || (sc.step.startsWith('T') ? 'tutoriel' : 'veillees');
// Ce qui bouge, lu dans le SVG (classes sc-…)
const MOVES = [['sc-flames', 'les flammes'], ['sc-float', 'Brume flotte'], ['sc-blink', 'clignements'], ['sc-twinkle', 'étoiles qui scintillent'], ['sc-drift', 'la brume dérive'], ['sc-foam', 'l\'écume'],
  ['sc-glow', 'lueurs qui respirent'], ['sc-rain', 'la pluie'], ['sc-bolt', 'un éclair'], ['sc-roll', 'le roulis'], ['sc-wave', 'la vague monte (une fois)'], ['sc-dark', 'le noir tombe à 6 s (une fois)'], ['sc-cy', 'images qui défilent']];

const index = {
  _lisez_moi: [
    'Les images plein écran de l\'histoire (src/components/Game/PrologueArt.vue), au trait de la troupe : même clé « art », même cadre 400 × 400, même mise en place. Le cadre se recadre sur l\'écran (preserveAspectRatio="xMidYMid slice") : l\'essentiel tient dans la zone utile, x de 108 à 292 (téléphone en hauteur) et y de 88 à 312 (écran large).',
    'Chaque SVG s\'anime seul (CSS dans le fichier, noms en sc-) ; avec le mouvement réduit (prefers-reduced-motion), il montre l\'image clé. Les identifiants sont préfixés par la scène : on peut en poser deux dans la même page (fondu enchaîné).',
    'Tenues : un maître est en naufragé jusqu\'à son souvenir retrouvé (HISTOIRE.md § 8) — Cannelle au feu (T3), Ondin au Puits (T5), Sylve à l\'acte I, Galet à l\'acte II, Rivet et Mélisse à l\'acte III, Aster à l\'acte IV.'
  ],
  zone_utile: { x: 108, y: 88, w: 184, h: 224 },
  scenes: {}
};
const cells = Object.fromEntries(Object.keys(GROUPS).map(g => [g, []]));
const boxes = Object.fromEntries(Object.keys(GROUPS).map(g => [g, []]));
let count = 0;
for (const [art, sc] of Object.entries(SC)) {
  const grp = groupOf(sc);
  const svg = sceneSvg(art);
  const rel = `${grp}/${art}.svg`;
  write(path.join(LIB, rel), svg);
  count++;
  index.scenes[art] = { nom: sc.label, groupe: grp, etape: STEPS[sc.step] || sc.step, fichier: rel, bouge: MOVES.filter(([c]) => svg.includes(`class="${c}`)).map(([, t]) => t) };
  cells[grp].push([svg.replace('width="400" height="400"', 'width="300" height="300"').replace(/<svg /, '<svg ').replace(/^/, '').replace('<style>', '<style>*{animation:none!important}'), `${art} · ${sc.label}`]);
  boxes[grp].push(`<div class="box"><img width="320" height="320" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" alt=""><div class="lab">${art} · ${sc.label}</div></div>`);
}
write(path.join(LIB, 'scenes.json'), JSON.stringify(index, null, 1));
const used = Object.keys(GROUPS).filter(g => cells[g].length);
const css = 'body{margin:0;font-family:system-ui,sans-serif;background:#F4EEDF;color:#3C2819}h1{font-size:20px;margin:16px 20px 4px}h2{font-size:17px;margin:18px 20px 6px}p{margin:0 20px 12px;font-size:13px}.grid{display:flex;flex-wrap:wrap;gap:14px;margin:0 20px 10px}.box{background:#CFE3B4;border-radius:14px;padding:10px;text-align:center}.lab{font-size:13px;margin-top:4px}';
write(path.join(DIR, 'scenes_apercu.html'), `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Les scènes de l'histoire</title><style>${css}</style></head><body><h1>Les scènes de l'histoire</h1><p>Lot J : chaque scène s'anime seule (CSS dans le SVG). Cadre 400 × 400 recadré à l'écran : l'essentiel tient au milieu.</p>${used.map(g => `<h2>${GROUPS[g]}</h2><div class="grid">${boxes[g].join('')}</div>`).join('')}</body></html>`);
// Planches : les images clés (sans animation), quatre par rangée ; chaque scène a ses identifiants propres
await shoot(used.map(g => [path.join(PNG, `scenes_${g}.png`), sheet(`Scènes — ${GROUPS[g]}`, 'Images clés (sans animation, comme avec le mouvement réduit). Cadre 400 × 400 ; l\'essentiel tient dans x 108 → 292, y 88 → 312.', [0, 4, 8, 12, 16, 20].filter(i => i < cells[g].length).map(i => row('', cells[g].slice(i, i + 4).map(([h, c]) => [unique(h), c])))), 1340]));
console.log('ok', count, 'SVG');
