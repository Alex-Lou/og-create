// Lot D — le décor iso : créations d'île, lieux remarquables, gisements, annexes, enseignes, îlots et objets de la mer.
// SVG dans lib/decor/<catégorie>/, index decor.json (cadres, ancres, images/s, lumières, cadre du nom des enseignes),
// une planche PNG par catégorie, page animée decor_apercu.html. Les annexes sont les dessins du jeu, portés au trait
// de la troupe (port/src/world, aides restylées) ; le reste est dessiné ici (crafts.js, landmarks.js, decor2.js).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { ANNEX_SPRITES, annexLight } from './port/src/world/annexSprites.js';
import { tools } from './port/src/world/shopSprites.js';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const { C } = require('./crafts.js');
const { LM, LAND } = require('./landmarks.js');
const { PROP } = require('./deco.js');
const { up, big, G, S, SIGN_TEXT, SIGN_FRAME, M, silhouette } = require('./decor2.js');

const LIB = path.join(DIR, 'lib', 'decor');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const CELL = '<polygon points="0,-20 40,0 0,20 -40,0" fill="#BFD99A" stroke="#A8C680" stroke-width="0.6"/>';
const svgOf = (frame, body, scale = 1, cell = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * scale)}" height="${r2(frame[3] * scale)}" viewBox="${frame.map(r2).join(' ')}">${cell ? CELL : ''}${body}</svg>`;

/* ---------- Libellés ---------- */
const CRAFTS = {
  cloture: 'Clôture', massif: 'Massif de fleurs', muret: 'Muret', lanterne: 'Lanterne', banc: 'Banc', epouvantail: 'Épouvantail', nichoir: 'Nichoir',
  girouette: 'Girouette', fontaine: 'Fontaine', brasero: 'Brasero', pergola: 'Pergola', statue: 'Statue', arche: 'Arche fleurie', etal: 'Étal du marché',
  kiosque: 'Kiosque', cadran: 'Cadran solaire', bassin: 'Bassin', longuevue: 'Longue-vue',
  igloo: 'Igloo (cimes)', sculpture: 'Sculpture de glace (cimes)', parc: 'Parc à moutons (landes)', cairn: 'Cairn aux rubans (landes)',
  passerelle: 'Passerelle de roseaux (marais)', heron: 'Héron de bois (marais)', tente: 'Tente nomade (dunes)', cadransel: 'Cadran de sel (dunes)',
  hamac: 'Hamac (jungle)', totem: 'Totem (jungle)', obelisque: 'Obélisque d\'obsidienne (volcan)', bassinchaud: 'Bassin chaud (volcan)'
};
const LIEUX = {
  grotte: 'Grotte de glace', lac: 'Lac gelé', col: 'Col du Vent', menhirs: 'Cercle de menhirs', menhirs_fleuri: 'Cercle de menhirs (fleuri)',
  arche: 'Arche des falaises', saule: 'Saule millénaire', pilotis: 'Cabane sur pilotis', oasis: 'Source de l\'oasis', pyramide: 'Pyramide ensablée',
  arbre: 'Arbre-géant', cascade: 'Grande cascade', geyser: 'Geyser', cratere: 'Lac de lave'
};
const GISEMENTS = { glace: 'Cristaux de glace', laine: 'Moutons à tondre', roseau: 'Roseaux', sel: 'Croûte de sel', fruits: 'Arbre à fruits', obsidienne: 'Éclats d\'obsidienne' };
const ANNEXES = {
  champ: 'Champ', grenier: 'Grenier', enclos: 'Enclos', filon: 'Filon', depot: 'Dépôt de pierres', taille: 'Atelier de taille', coupe: 'Coupe de bois',
  remise: 'Remise à bois', pepiniere: 'Pépinière', citerne: 'Citerne', reservoir: 'Réservoir', eolienne: 'Éolienne', vivier: 'Vivier', fumoir: 'Fumoir',
  huitres: 'Parc à huîtres', jardin: 'Jardin d\'herbes', four: 'Four à pain', belvedere: 'Belvédère', charbon: 'Charbonnière', hangar: 'Hangar',
  fourneau: 'Haut-fourneau', maison: 'Maison', glaciere: 'Glacière (cimes)', metier: 'Métier à tisser (landes)', hutte: 'Hutte de roseaux (marais)',
  saline: 'Saline (dunes)', serre: 'Serre tropicale (jungle)', fonderie: 'Forge d\'obsidienne (volcan)'
};
// Variantes : le n° d'exemplaire de l'annexe (0, 1, 2…) dans le jeu
const VARIANTS = {
  champ: ['ble', 'carottes', 'citrouilles'], filon: ['quartz', 'cuivre', 'cristaux'], coupe: ['rondins', 'souches', 'chevalet'],
  citerne: ['tonneau', 'pompe', 'cuivre'], vivier: ['orange', 'argent', 'bleu_or'], maison: ['toit_rouge', 'toit_bleu', 'chaume', 'ardoise']
};
const ENSEIGNES = { bois: 'Planche de bois', ardoise: 'Ardoise', fer: 'Fer forgé', laiton: 'Plaque de laiton', fleurie: 'Fleurie', lanterne: 'Lanternes' };
const ILOTS = {
  ponton: 'Ponton d\'amarrage', pont: 'Pont de planches', barque_volante: 'Barque volante du passeur', bateau_visiteur: 'Bateau des visiteurs',
  voilier: 'Voilier du Ponton', bouteille: 'Bouteille à la mer', panneau_quartier: 'Panneau de quartier (cadenas)',
  epave_radeau: 'Épave : radeau', epave_bateau: 'Épave : caboteur', epave_barque: 'Épave : barque de graines'
};

const VLABEL = { ble: 'blé', bleu_or: 'bleu-or', toit_rouge: 'toit rouge', toit_bleu: 'toit bleu', rayee: 'rayée', bout_avant: 'bout avant', bout_arriere: 'bout arrière' };
const vl = v => VLABEL[v] || v;
// Cadrage des planches seulement (les SVG gardent le cadre du jeu) : voilier et ponton dans un cadre de bâtiment
const VIEW = { voilier: [-62, -70, 96, 92], ponton: [-58, -36, 116, 70] };

/* ---------- Inventaire : [{ cat, dir, base, label, frame, frames: [body], ms, cell, meta }] ---------- */
const items = [];
const add = it => items.push({ ms: 380, cell: true, meta: {}, ...it });
for (const [id, c] of Object.entries(C)) add({ cat: 'creations', dir: 'creations', base: id, label: CRAFTS[id], frame: PROP, frames: Array.from({ length: c.n }, (_, f) => c.draw(f)), ms: id === 'girouette' ? 300 : 420 });
for (const [id, l] of Object.entries(LM)) add({ cat: 'lieux', dir: 'lieux', base: id, label: LIEUX[id], frame: LAND, frames: Array.from({ length: l.n }, (_, f) => l.draw(f)), ms: 520, meta: { echelle_jeu: id === 'cascade' ? 1 : 1.35 } });
for (const [id, g] of Object.entries(G)) {
  add({ cat: 'gisements', dir: 'gisements', base: `${id}_pret`, label: `${GISEMENTS[id]} — prêt`, frame: big(g.frames[0]), frames: [0, 1].map(f => up(g.draw(false, f))), ms: 450 });
  add({ cat: 'gisements', dir: 'gisements', base: `${id}_ramasse`, label: `${GISEMENTS[id]} — ramassé`, frame: big(g.frames[1]), frames: [up(g.draw(true, 0))] });
}
for (const [id, a] of Object.entries(ANNEX_SPRITES)) {
  const l = a.layers[0];
  const light = annexLight(id);
  const vs = VARIANTS[id] || [null];
  vs.forEach((vn, v) => {
    const n = l.n || 1;
    add({
      cat: 'annexes', dir: `annexes/${id}`, base: vn ? `${id}_${vn}` : id, label: ANNEXES[id] + (vn ? ` — ${vl(vn)}` : ''), frame: big(l.frame),
      frames: Array.from({ length: n }, (_, f) => up(l.draw(tools(0, 0, `${id}-${v}`), f, n, v))), ms: l.fps ? Math.round(1000 / l.fps) : 0,
      meta: { variante_jeu: v, ips: l.fps || 0, ...(light ? { lumiere: { u: light[0], v: light[1], z: r2(light[2] * 1.25), rayon: r2(light[3] * 1.25), couleur: light[4] || 'chaude', vacille: !!light[5] } } : {}) }
    });
  });
}
for (const [id, s] of Object.entries(S)) add({ cat: 'enseignes', dir: 'enseignes', base: id, label: ENSEIGNES[id], frame: big(SIGN_FRAME), frames: Array.from({ length: s.n }, (_, f) => up(s.draw(f))), ms: id === 'fer' ? 200 : id === 'laiton' ? 900 : 260, cell: false, meta: { cadre_du_nom: SIGN_TEXT[id] } });
for (const [id, m] of Object.entries(M)) {
  if (id === 'nid') continue; // déjà dans le lot C (plantes/nid.svg)
  for (const v of m.variants || [null]) {
    const frames = Array.from({ length: m.n }, (_, f) => up(m.draw(f, v || undefined)));
    const base = v ? `${id}_${v}` : id;
    const cell = /ponton|pont|panneau/.test(id);
    add({ cat: 'ilots', dir: 'ilots', base, label: ILOTS[id] + (v ? ` — ${vl(v)}` : ''), frame: big(m.frame), frames, ms: id === 'bouteille' ? 700 : 300, cell, view: VIEW[id] });
    if (id === 'pont') add({ cat: 'ilots', dir: 'ilots', base: `${base}_v`, label: `${ILOTS[id]} — ${vl(v)} (le long de v)`, frame: big(m.frame), frames: frames.map(b => `<g transform="scale(-1 1)">${b}</g>`), cell });
  }
  if (/^epave/.test(id)) add({ cat: 'ilots', dir: 'ilots', base: `${id}_silhouette`, label: `${ILOTS[id]} (silhouette du prologue)`, frame: big(m.frame), frames: [silhouette(up(m.draw(0)))], cell: false });
}

/* ---------- Écriture ---------- */
const index = {};
let count = 0;
for (const it of items) {
  const files = it.frames.map((body, k) => {
    const name = it.frames.length > 1 ? `${it.base}_${k + 1}.svg` : `${it.base}.svg`;
    write(path.join(LIB, it.dir, name), svgOf(it.frame, body));
    count++;
    return `${it.dir}/${name}`;
  });
  (index[it.cat] = index[it.cat] || {})[it.base] = { nom: it.label, fichiers: files, cadre: it.frame.map(r2), ...(it.frames.length > 1 && it.ms ? { ms_par_image: it.ms } : {}), ...it.meta };
}
write(path.join(LIB, 'decor.json'), JSON.stringify({
  _lisez_moi: 'Cadres en pixels (x, y, largeur, hauteur) autour de l\'ancre (0, 0) : centre de la case (créations, lieux, gisements, annexes, ponton, pont, panneau), pied (enseignes), ligne de flottaison (bateaux), point d\'échouage (bouteille). Tout est à l\'échelle du jeu × 1,25 (case de 80 × 40). Annexes : ips = images par seconde du jeu. Enseignes : cadre_du_nom = où écrire le nom (centre x, y ; largeur, hauteur max ; corps de police), déjà × 1,25.',
  ...index
}, null, 1));

/* ---------- Planches et page animée ---------- */
const TITLES = { creations: 'Créations d\'île', lieux: 'Lieux remarquables', gisements: 'Gisements des climats', annexes: 'Annexes des bâtiments', enseignes: 'Enseignes au nom du joueur', ilots: 'Îlots, bateaux et objets de la mer' };
const SUBS = {
  creations: 'Une case, ancre au centre (losange montré), cadre PROP_BOX × 1,25.',
  lieux: 'Une case, ancre au centre ; un lieu déborde comme un monument. Le jeu les affiche × 1,35 (la cascade × 1).',
  gisements: 'Prêt (2 images) ou ramassé (il repousse). Cadres du jeu × 1,25, ancre au centre de la case.',
  annexes: 'Dessins du jeu au trait de la troupe, toutes leurs images (page animée) ; ici la première image de chaque variante. Cadres du jeu × 1,25.',
  enseignes: 'Le nom n\'est pas dessiné : le jeu l\'écrit dans le cadre pointillé (decor.json). Ancre au pied de l\'enseigne.',
  ilots: 'Ponton et voilier dans le cadre d\'un bâtiment, bateaux ancrés à la ligne de flottaison et tournés vers la droite (miroir pour la gauche). Pont : une case, dans les deux sens.'
};
const shots = [], anim = [];
for (const cat of Object.keys(TITLES)) {
  const list = items.filter(i => i.cat === cat);
  const cells = [];
  const all = cat === 'gisements' || cat === 'enseignes' || cat === 'ilots';
  for (const it of list) {
    const view = it.view || it.frame;
    const s = Math.min(cat === 'annexes' ? 1.5 : 1.6, 190 / Math.max(view[2], view[3]));
    const txt = cat === 'enseignes' ? (() => { const t = SIGN_TEXT[it.base]; return `<rect x="${r2(t.x - t.w / 2)}" y="${r2(t.y - t.h / 2)}" width="${t.w}" height="${t.h}" fill="none" stroke="#E2483A" stroke-width="0.5" stroke-dasharray="1.5 1"/>`; })() : '';
    const frames = all ? it.frames : it.frames.slice(0, 1);
    frames.forEach((body, k) => cells.push([svgOf(view, unique(body) + (k ? '' : txt), s, it.cell),
      `${it.label}${all && it.frames.length > 1 ? ` · ${k + 1}` : ''}${!all && it.frames.length > 1 ? `<br><i>${it.frames.length} images</i>` : ''}`]));
  }
  const rows = [row('', cells)];
  shots.push([path.join(PNG, `decor_${cat}.png`), sheet(`Décor — ${TITLES[cat]}`, SUBS[cat], rows), 1250]);
  const boxes = list.filter(it => it.frames.length > 1).map(it => {
    const view = it.view || it.frame;
    const s = Math.min(1.6, 190 / Math.max(view[2], view[3]));
    return { label: it.label, frames: it.frames.map(body => svgOf(view, unique(body), s, it.cell)), timings: [it.ms || 400], w: r2(view[2] * s), h: r2(view[3] * s) };
  });
  if (boxes.length) anim.push([TITLES[cat], boxes]);
}
write(path.join(DIR, 'decor_apercu.html'), animated('Le décor en mouvement', 'Lot D : créations, lieux, gisements, annexes (vitesse du jeu), enseignes et bateaux.', anim));
await shoot(shots);
console.log('ok', count, 'SVG ;', items.length, 'dessins');
