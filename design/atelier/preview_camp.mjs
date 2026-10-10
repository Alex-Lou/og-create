// Lot G3 — le camp des naufragés en iso : l'épave de l'Hirondelle, le coin de chaque maître en
// trois états (débris → abri → cabanon ; Cannelle et Galet : débris seulement), les objets du camp, la tente et le
// hamac des voyageurs. Dessins de camp.mjs (trait de la troupe), cadres du jeu × 1,25 élargis juste ce qu'il faut
// (fitFrame). SVG dans lib/decor/camp/, index camp.json (avec l'étape de l'histoire), planche, page animée.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { CAMP } from './camp.mjs';
import { fitFrame, closeFit } from './fit.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'decor', 'camp');
const PNG = path.join(DIR, 'planches');
const K = 1.25;
const r2 = n => Math.round(n * 100) / 100;
const big = ({ x, y, w, h }) => [x, y, w, h].map(n => r2(n * K));
const up = body => `<g transform="scale(${K})">${body}</g>`;
const svgOf = (frame, body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * scale)}" height="${r2(frame[3] * scale)}" viewBox="${frame.join(' ')}">${body}</svg>`;

// Étapes de l'histoire (HISTOIRE.md § 9 et § 10), dans l'ordre
const STEPS = {
  T1: 'tutoriel, étape 1 — la plage de Brumelune, la nuit (Brume allume le feu)',
  T2: 'tutoriel, étape 2 — Aster repêche les caisses',
  T3: 'tutoriel, étape 3 — Cannelle derrière l\'épave',
  T4: 'tutoriel, étape 4 — Rivet sous une voile échouée',
  T5: 'tutoriel, étape 5 — Ondin à La Source ; fin : « Le Campement »',
  I: 'acte I — veillée I, « Le Camp des naufragés » (Sylve arrive)',
  II: 'acte II — veillée II, « Le Hameau » (Galet arrive)',
  III: 'acte III — veillée III, « Le Village » (Mélisse arrive)',
  IV: 'acte IV — la première barque de voyageurs'
};
const MASTERS = { aster: 'Aster', cannelle: 'Cannelle', rivet: 'Rivet', ondin: 'Ondin', sylve: 'Sylve', galet: 'Galet', melisse: 'Mélisse' };
const STATE = { debris: 'débris', abri: 'abri', cabanon: 'cabanon' };
// Ce qui prend la suite (proposition, à valider avec l'intégration)
const UNTIL = {
  cannelle_debris: 'jusqu\'à l\'Abri (Foyer II, acte II)',
  galet_debris: 'jusqu\'à la Carrière I (acte II)',
  cabanon: 'jusqu\'aux maisons du Foyer (annexes) : l\'intégration choisira le moment'
};
const MS = { cannelle_debris: 111, torche: 111, aster_cabanon: 500, ondin_debris: 600, ondin_abri: 600, ondin_cabanon: 600, hamac: 900, etendoir: 600 };
const CAT = k => (k === 'hirondelle' ? 'epave' : k === 'tente' || k === 'hamac' ? 'voyageurs' : MASTERS[k.split('_')[0]] ? 'coins' : 'objets');
const dirOf = k => (CAT(k) === 'coins' ? `coins/${k.split('_')[0]}` : CAT(k));

const index = {
  _lisez_moi: [
    'Décor iso du camp des naufragés, au trait de la troupe, à l\'échelle du jeu × 1,25 (case de 80 × 40). Ancre (0, 0) au centre de l\'emprise au sol : coins, tente, hamac et épave sur 2 × 2 cases (cadre BUILDING_BOX ; l\'épave un peu plus large), objets sur une case (PROP_BOX). Quand un dessin dépasse un peu, le cadre est élargi, l\'ancre ne bouge pas : prendre le cadre noté ici.',
    'Coins des maîtres : débris (à l\'arrivée), abri, cabanon ; Cannelle (la cuisine de l\'épave) et Galet (le muret de la Fissure) n\'ont que des débris, leur bâtiment prend vite le relais. Les maîtres quittent le look du naufragé au souvenir retrouvé (lib/personnages/naufrages/), mais leur coin reste leur toit jusqu\'aux maisons.',
    'etape : quand l\'objet apparaît (codes de STEPS) ; images et ms : animation en boucle (le feu à la vitesse du jeu, 9 images/s). Les étapes sont une proposition tirée de HISTOIRE.md.'
  ],
  etapes: STEPS,
  objets: {}
};
const cells = { epave: [], coins: {}, objets: [], voyageurs: [] };
const anim = [];
let count = 0;

for (const [key, a] of Object.entries(CAMP)) {
  const bodies = Array.from({ length: a.n }, (_, n) => up(a.draw(n)));
  const frame = await fitFrame(big(a.frame), bodies);
  const dir = dirOf(key);
  const files = bodies.map((b, n) => { const rel = `${dir}/${key}_${n + 1}.svg`; write(path.join(LIB, rel), svgOf(frame, b)); count++; return rel; });
  const [who, st] = key.split('_');
  const entry = { nom: a.label, categorie: CAT(key), etape: a.step, cadre: frame, images: a.n, ...(a.n > 1 ? { ms: MS[key] || 400 } : {}), fichiers: files };
  if (CAT(key) === 'coins') Object.assign(entry, { maitre: MASTERS[who], etat: STATE[st], ...(UNTIL[key] || st === 'cabanon' ? { suite: UNTIL[key] || UNTIL.cabanon } : {}) });
  index.objets[key] = entry;
  const s = CAT(key) === 'objets' ? 1.6 : key === 'hirondelle' ? 1 : 1.15;
  const c = [svgOf(frame, unique(bodies[0]), s), CAT(key) === 'coins' ? `${STATE[st]} · ${a.step}${a.n > 1 ? ` · ${a.n} images` : ''}` : `${a.label} · ${a.step}${a.n > 1 ? ` · ${a.n} images` : ''}`];
  if (CAT(key) === 'coins') (cells.coins[who] ||= []).push(c); else cells[CAT(key)].push(c);
  if (a.n > 1) anim.push({ label: a.label, frames: bodies.map(b => svgOf(frame, unique(b), s * 1.4)), timings: [entry.ms], w: r2(frame[2] * s * 1.4), h: r2(frame[3] * s * 1.4) });
}

write(path.join(LIB, 'camp.json'), JSON.stringify(index, null, 1));
const rows = [
  row('L\'épave et le feu', cells.epave),
  ...Object.entries(cells.coins).map(([who, c]) => row(`Coin de ${MASTERS[who]}`, c)),
  row('Objets du camp', cells.objets),
  row('Les voyageurs', cells.voyageurs)
];
write(path.join(DIR, 'camp_apercu.html'), animated('Le camp des naufragés', 'Lot G3 : ce qui bouge dans le camp (le feu à la vitesse du jeu).', [['Le camp', anim]]));
await shoot([[path.join(PNG, 'camp_naufrages.png'), sheet('Le camp des naufragés', 'Iso du jeu × 1,25, ancre au centre de l\'emprise. Coins : débris → abri → cabanon ; l\'étape de l\'histoire où chaque chose apparaît (T = tutoriel, I-IV = actes).', rows), 1500]]);
await closeFit();
console.log('ok', count, 'SVG');
