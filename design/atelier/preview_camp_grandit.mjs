// Lot G5 — planche « le camp grandit » : le camp des naufragés composé à chaque étape de l'histoire, avec les dessins
// de camp.mjs posés autour du feu (l'emplacement de chaque chose est une maquette, pas une règle de pose). À chaque
// étape : ce qui est arrivé jusque-là, le coin de chaque maître dans son dernier état, ce qui a été remplacé en moins.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { CAMP } from './camp.mjs';
import { P } from './port/src/world/iso.js';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, shoot } = require('./planche.js');
const PNG = path.join(DIR, 'planches');
// le feu de camp : c'est le Foyer au palier I, bâti par le joueur (HISTOIRE.md § 9, étape 5) ; son dessin vient de la
// bibliothèque (cadre du jeu × 1,25), ramené aux pixels du jeu comme les dessins du camp
const FOYER = fs.readFileSync(path.join(DIR, '..', 'bibliotheque', 'svg', 'batiments', 'paliers', 'foyer', 'foyer_palier1_1.svg'), 'utf8')
  .replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const ORDER = ['T1', 'T2', 'T3', 'T4', 'T5', 'I', 'II', 'III', 'IV'];
const TITLE = {
  T1: 'Étape 1 — la plage de Brumelune, la nuit : l\'épave, le feu de Brume',
  T2: 'Étape 2 — Aster repêche les caisses',
  T3: 'Étape 3 — la cuisine de Cannelle',
  T4: 'Étape 4 — Rivet sous sa voile',
  T5: 'Étape 5 — Ondin (La Source) ; « Le Campement »',
  I: 'Acte I — « Le Camp des naufragés » : des abris, Sylve',
  II: 'Acte II — « Le Hameau » : des cabanons, Galet',
  III: 'Acte III — « Le Village » : Mélisse',
  IV: 'Acte IV — les voyageurs plantent leurs tentes'
};
// la maquette : où poser chaque chose. Positions à l'écran (px du jeu) sur deux anneaux autour du feu : les coins et
// l'épave sur le grand (210 × 110), les objets sur le petit (118 × 60) ; converties en cases (u, v)
const ring = (deg, rx, ry, k = 1) => { const x = Math.cos(deg * Math.PI / 180) * rx * k, y = Math.sin(deg * Math.PI / 180) * ry * k; return [(x / 32 + y / 16) / 2, (y / 16 - x / 32) / 2]; };
const BIG = (deg, k) => ring(deg, 210, 110, k), SMALL = deg => ring(deg, 118, 60);
const AT = {
  hirondelle: BIG(212),
  galet: BIG(248), cannelle: BIG(288), ondin: BIG(330), rivet: BIG(14), melisse: BIG(66), sylve: BIG(114), aster: BIG(160),
  tente: BIG(38, 1.28), hamac: BIG(90, 1.18),
  caisses: SMALL(205), sos: SMALL(250), etendoir: SMALL(296), tonneau: SMALL(336), rondins: SMALL(18), torche: SMALL(72), filet: SMALL(122), paillasse: SMALL(166), etabli: SMALL(44),
  bol: ring(28, 46, 24) // au bord du feu
};
// ce qui s'efface (remplacé par un bâtiment du jeu, ou par l'établi de l'abri de Rivet), à partir de quelle étape
const GONE = { cannelle_debris: 'II', galet_debris: 'III', etabli: 'I' };
const idx = s => ORDER.indexOf(s);

function scene(step) {
  const k = idx(step);
  const shown = [];
  const corners = {};
  for (const [key, a] of Object.entries(CAMP)) {
    if (idx(a.step) > k) continue;
    if (GONE[key] && idx(GONE[key]) <= k) continue;
    const who = key.split('_')[0];
    if (AT[who]) { corners[who] = key; continue; } // le dernier état arrivé l'emporte
    shown.push(key);
  }
  for (const key of Object.values(corners)) shown.push(key);
  const at = key => AT[key] || AT[key.split('_')[0]];
  const parts = [{ key: 'foyer', u: 0, v: 0, d: unique(`<g transform="scale(0.8)">${FOYER}</g>`) }, ...shown.map(key => { const [u, v] = at(key); return { key, u, v, d: unique(CAMP[key].draw(0)) }; })]
    .sort((p, q) => p.u + p.v - (q.u + q.v));
  // le sol : la plage de Brumelune (sable), la mer en haut à gauche, l'écume
  let o = `<rect x="-310" y="-210" width="620" height="370" fill="#CFE3B4"/>`;
  o += `<path d="M-310,-210 L-20,-210 Q-110,-160 -210,-128 Q-280,-104 -310,-60 Z" fill="#7FC3E0"/><path d="M-20,-210 Q-110,-160 -210,-128 Q-280,-104 -310,-60" fill="none" stroke="#F4FAFD" stroke-width="3" stroke-linecap="round"/>`;
  o += `<ellipse cx="0" cy="0" rx="305" ry="160" fill="#E8D7A8"/><ellipse cx="-10" cy="-6" rx="230" ry="118" fill="#EFE1B8"/>`;
  for (const p of parts) { const [x, y] = P(p.u, p.v, 0); o += `<g transform="translate(${x} ${y})">${p.d}</g>`; }
  // la nuit de l'étape 1 : le noir autour, la lueur du feu
  if (step === 'T1') o += `<defs><radialGradient id="nuit"><stop offset="0" stop-color="#1B2440" stop-opacity="0"/><stop offset=".18" stop-color="#1B2440" stop-opacity=".2"/><stop offset="1" stop-color="#1B2440" stop-opacity=".58"/></radialGradient></defs><rect x="-310" y="-210" width="620" height="370" fill="url(#nuit)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="${Math.round(370 * 700 / 620)}" viewBox="-310 -210 620 370">${unique(o)}</svg>`;
}

const rows = [];
for (let i = 0; i < ORDER.length; i += 2) rows.push(row('', ORDER.slice(i, i + 2).map(s => [scene(s), TITLE[s]])));
await shoot([[path.join(PNG, 'camp_grandit.png'), sheet('Le camp grandit', 'Le camp des naufragés à chaque étape de l\'histoire (HISTOIRE.md § 9 et § 10). Maquette : les emplacements sont indicatifs ; le coin de chaque maître montre son dernier état (débris → abri → cabanon). La cuisine de Cannelle s\'efface à l\'Abri (Foyer II, acte II), le muret de Galet à la Carrière.', rows), 1500]]);
console.log('ok');
