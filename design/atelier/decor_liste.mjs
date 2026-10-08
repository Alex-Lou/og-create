// L'inventaire du décor iso (créations d'île, lieux remarquables, gisements, annexes, enseignes, îlots et objets de la
// mer), en un seul endroit : preview_decor.mjs le publie, le générateur du décor (generateur_decor.mjs) le dessine.
// inventaire() rend les dessins dans l'ordre de la bibliothèque : { cat, dir, base, label, frame, frames, ms, cell,
// meta, view }.
import { ANNEX_SPRITES, annexLight } from './port/src/world/annexSprites.js';
import { tools } from './port/src/world/shopSprites.js';
import CR from './crafts.js';
import LMK from './landmarks.js';
import DE from './deco.js';
import D2 from './decor2.js';

const { C } = CR, { LM, LAND } = LMK, { PROP } = DE, { up, big, G, S, SIGN_TEXT, SIGN_FRAME, M, silhouette } = D2;
const r2 = n => Math.round(n * 100) / 100;

/* ---------- Libellés ---------- */
export const CRAFTS = {
  cloture: 'Clôture', massif: 'Massif de fleurs', muret: 'Muret', lanterne: 'Lanterne', banc: 'Banc', epouvantail: 'Épouvantail', nichoir: 'Nichoir',
  girouette: 'Girouette', fontaine: 'Fontaine', brasero: 'Brasero', pergola: 'Pergola', statue: 'Statue', arche: 'Arche fleurie', etal: 'Étal du marché',
  kiosque: 'Kiosque', cadran: 'Cadran solaire', bassin: 'Bassin', longuevue: 'Longue-vue',
  igloo: 'Igloo (cimes)', sculpture: 'Sculpture de glace (cimes)', parc: 'Parc à moutons (landes)', cairn: 'Cairn aux rubans (landes)',
  passerelle: 'Passerelle de roseaux (marais)', heron: 'Héron de bois (marais)', tente: 'Tente nomade (dunes)', cadransel: 'Cadran de sel (dunes)',
  hamac: 'Hamac (jungle)', totem: 'Totem (jungle)', obelisque: 'Obélisque d\'obsidienne (volcan)', bassinchaud: 'Bassin chaud (volcan)'
};
export const LIEUX = {
  grotte: 'Grotte de glace', lac: 'Lac gelé', col: 'Col du Vent', menhirs: 'Cercle de menhirs', menhirs_fleuri: 'Cercle de menhirs (fleuri)',
  arche: 'Arche des falaises', saule: 'Saule millénaire', pilotis: 'Cabane sur pilotis', oasis: 'Source de l\'oasis', pyramide: 'Pyramide ensablée',
  arbre: 'Arbre-géant', cascade: 'Grande cascade', geyser: 'Geyser', cratere: 'Lac de lave'
};
export const GISEMENTS = { glace: 'Cristaux de glace', laine: 'Moutons à tondre', roseau: 'Roseaux', sel: 'Croûte de sel', fruits: 'Arbre à fruits', obsidienne: 'Éclats d\'obsidienne' };
export const ANNEXES = {
  champ: 'Champ', grenier: 'Grenier', enclos: 'Enclos', filon: 'Filon', depot: 'Dépôt de pierres', taille: 'Atelier de taille', coupe: 'Coupe de bois',
  remise: 'Remise à bois', pepiniere: 'Pépinière', citerne: 'Citerne', reservoir: 'Réservoir', eolienne: 'Éolienne', vivier: 'Vivier', fumoir: 'Fumoir',
  huitres: 'Parc à huîtres', jardin: 'Jardin d\'herbes', four: 'Four à pain', belvedere: 'Belvédère', charbon: 'Charbonnière', hangar: 'Hangar',
  fourneau: 'Haut-fourneau', maison: 'Maison', glaciere: 'Glacière (cimes)', metier: 'Métier à tisser (landes)', hutte: 'Hutte de roseaux (marais)',
  saline: 'Saline (dunes)', serre: 'Serre tropicale (jungle)', fonderie: 'Forge d\'obsidienne (volcan)'
};
// Variantes : le n° d'exemplaire de l'annexe (0, 1, 2…) dans le jeu
export const VARIANTS = {
  champ: ['ble', 'carottes', 'citrouilles'], filon: ['quartz', 'cuivre', 'cristaux'], coupe: ['rondins', 'souches', 'chevalet'],
  citerne: ['tonneau', 'pompe', 'cuivre'], vivier: ['orange', 'argent', 'bleu_or'], maison: ['toit_rouge', 'toit_bleu', 'chaume', 'ardoise']
};
export const ENSEIGNES = { bois: 'Planche de bois', ardoise: 'Ardoise', fer: 'Fer forgé', laiton: 'Plaque de laiton', fleurie: 'Fleurie', lanterne: 'Lanternes' };
export const ILOTS = {
  ponton: 'Ponton d\'amarrage', pont: 'Pont de planches', barque_volante: 'Barque volante du passeur', bateau_visiteur: 'Bateau des visiteurs',
  voilier: 'Voilier du Ponton', bouteille: 'Bouteille à la mer', panneau_quartier: 'Panneau de quartier (cadenas)',
  epave_radeau: 'Épave : radeau', epave_bateau: 'Épave : caboteur', epave_barque: 'Épave : barque de graines'
};

export const VLABEL = { ble: 'blé', bleu_or: 'bleu-or', toit_rouge: 'toit rouge', toit_bleu: 'toit bleu', rayee: 'rayée', bout_avant: 'bout avant', bout_arriere: 'bout arrière' };
export const vl = v => VLABEL[v] || v;
// Cadrage des planches seulement (les SVG gardent le cadre du jeu) : voilier et ponton dans un cadre de bâtiment
export const VIEW = { voilier: [-62, -70, 96, 92], ponton: [-58, -36, 116, 70] };

export function inventaire() {
  const items = [];
  const add = it => items.push({ ms: 380, cell: true, meta: {}, ...it });
  for (const [id, c] of Object.entries(C)) add({ cat: 'creations', dir: 'creations', base: id, label: CRAFTS[id], frame: PROP, frames: Array.from({ length: c.n }, (_, f) => c.draw(f)), ms: id === 'girouette' ? 300 : 420 });
  for (const [id, l] of Object.entries(LM)) add({ cat: 'lieux', dir: 'lieux', base: id, label: LIEUX[id], frame: LAND, frames: Array.from({ length: l.n }, (_, f) => l.draw(f)), ms: 520, meta: { echelle_jeu: id === 'cascade' ? 1 : 1.35 } });
  for (const [id, g] of Object.entries(G)) {
    add({ cat: 'gisements', dir: 'gisements', base: `${id}_pret`, label: `${GISEMENTS[id]} — prêt`, frame: big(g.frames[0]), frames: [0, 1].map(f => up(g.draw(false, f))), ms: 450 });
    add({ cat: 'gisements', dir: 'gisements', base: `${id}_ramasse`, label: `${GISEMENTS[id]} — ramassé`, frame: big(g.frames[1]), frames: [up(g.draw(true, 0))] });
    // la repousse, entre ramassé et prêt : deux étapes, dans le cadre du gisement prêt
    for (const [k, t] of [[1, 0.35], [2, 0.7]]) add({ cat: 'gisements', dir: 'gisements', base: `${id}_repousse${k}`, label: `${GISEMENTS[id]} — repousse (${k}/2)`, frame: big(g.frames[0]), frames: [0, 1].map(f => up(g.draw(false, f, t))), ms: 450 });
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
    for (const v of m.variants || [null]) {
      const frames = Array.from({ length: m.n }, (_, f) => up(m.draw(f, v || undefined)));
      const base = v ? `${id}_${v}` : id;
      const cell = /ponton|pont|panneau/.test(id);
      add({ cat: 'ilots', dir: 'ilots', base, label: ILOTS[id] + (v ? ` — ${vl(v)}` : ''), frame: big(m.frame), frames, ms: id === 'bouteille' ? 700 : 300, cell, view: VIEW[id] });
      if (id === 'pont') add({ cat: 'ilots', dir: 'ilots', base: `${base}_v`, label: `${ILOTS[id]} — ${vl(v)} (le long de v)`, frame: big(m.frame), frames: frames.map(b => `<g transform="scale(-1 1)">${b}</g>`), cell });
    }
    if (/^epave/.test(id)) add({ cat: 'ilots', dir: 'ilots', base: `${id}_silhouette`, label: `${ILOTS[id]} (silhouette du prologue)`, frame: big(m.frame), frames: [silhouette(up(m.draw(0)))], cell: false });
  }
  return items;
}
