// Lot E — les bâtiments : 7 bâtiments × 7 paliers (images animées, et les mêmes l'hiver), 20 skins, 48 objets de la boutique (calques), 14
// pièces rares, chantier, teintes. Dessins du jeu portés au trait de la troupe (port/src/world, aides restylées),
// dans les cadres du jeu × 1,25. SVG dans lib/batiments/, index batiments.json, planches, page animée.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { LOOKS, lookAt, artMake, boatOf, boatOffset } from './port/src/world/looks.js';
import { SHOP_SPRITES, itemLayers, itemLight } from './port/src/world/shopSprites.js';
import { SHOP_ITEMS, paliers, calques } from './objets_boutique.mjs';
import { RARE_SPRITES } from './port/src/world/rareSprites.js';
import { BUILDINGS } from './port/src/world/sprites.js';
import { TINTS, RARE_TINTS, tintSvg } from './port/src/world/tints.js';
import { setHiver } from './port/src/world/iso.js';
import { fitFrame, closeFit } from './fit.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'batiments');
const PNG = path.join(DIR, 'planches');
const K = 1.25;
const r2 = n => Math.round(n * 100) / 100;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const big = ({ x, y, w, h }) => [x, y, w, h].map(n => r2(n * K));
const up = body => `<g transform="scale(${K})">${body}</g>`;
const svgOf = (frame, body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * scale)}" height="${r2(frame[3] * scale)}" viewBox="${frame.join(' ')}">${body}</svg>`;

const SITES = { foyer: 'Foyer', carriere: 'Carrière', bosquet: 'Bosquet', puits: 'Puits', potager: 'Potager', atelier: 'Atelier', ponton: 'Ponton' };
const SKINS_OF = {
  foyer: ['toit-rouge', 'toit-bleu-foyer', 'toit-chaume-foyer'], carriere: ['roche-ocre', 'roche-granit', 'roche-cristal'],
  bosquet: ['printemps', 'automne', 'givre'], puits: ['toit-bleu', 'toit-chaume', 'pierre-blanche'],
  potager: ['cloture-blanche', 'cloture-pierre', 'cloture-fleurie'], atelier: ['enseigne-doree', 'toit-ardoise', 'toit-cuivre'], ponton: ['voile-rouge', 'voile-rayee', 'voile-bleue']
};
const SKIN_LABEL = {
  'toit-rouge': 'toit rouge', 'toit-bleu-foyer': 'toit bleu', 'toit-chaume-foyer': 'toit de chaume', 'roche-ocre': 'roche ocre', 'roche-granit': 'granit',
  'roche-cristal': 'veines de cristal', printemps: 'printemps', automne: 'automne', givre: 'givre', 'toit-bleu': 'kiosque bleu', 'toit-chaume': 'kiosque de chaume',
  'pierre-blanche': 'pierre blanche', 'cloture-blanche': 'clôture blanche', 'cloture-pierre': 'muret de pierre', 'cloture-fleurie': 'clôture fleurie',
  'enseigne-doree': 'enseigne dorée', 'toit-ardoise': 'toit d\'ardoise', 'toit-cuivre': 'toit de cuivre', 'voile-rouge': 'voile rouge', 'voile-rayee': 'voile rayée', 'voile-bleue': 'voile bleue'
};
const RARE_OF = {
  potager: ['papillons', 'tournesols'], carriere: ['filon-or', 'coeur-lave'], bosquet: ['fees', 'petales'], puits: ['arc-en-ciel', 'nenuphars'],
  ponton: ['pavois', 'mouettes'], atelier: ['etincelles', 'engrenages'], foyer: ['lampions', 'lierre']
};
const NAME = s => s.replace(/-/g, ' ');

const index = { _lisez_moi: 'Cadres en pixels (x, y, largeur, hauteur) autour de l\'ancre (0, 0), centre de l\'emprise au sol (2 × 2 cases aux paliers I-III, 3 × 3 ensuite), à l\'échelle du jeu × 1,25 (case de 80 × 40). Paliers : images composées (bâtiment + parties animées + voilier du Ponton) ; lumieres [u, v, z, rayon] et fumees [u, v, z] en cases et pixels × 1,25. Paliers d\'hiver (paliers_hiver) : les mêmes images, les toits sous la neige, même ancre ; ete = le palier d\'été qu\'il remplace. Objets : un fichier par calque, ancré à sa place au sol ; place = [u, v] en cases autour du centre du bâtiment, par palier ; derriere = à peindre avant le bâtiment ; mouvement = le jeu le déplace en plus. Teintes : recolorations (teintes/teinter.mjs). Quand un dessin du jeu dépasse un peu de son cadre (faisceau du phare, ombre d\'un objet), le cadre est élargi juste ce qu\'il faut, l\'ancre ne bouge pas : prendre le cadre noté ici.', paliers: {}, paliers_hiver: {}, chantier: {}, skins: {}, objets: {}, pieces_rares: {}, teintes: {} };
let count = 0;
const put = (rel, frame, body) => { write(path.join(LIB, rel), svgOf(frame, body)); count++; return rel; };
const light = l => ({ u: r2(l[0]), v: r2(l[1]), z: r2(l[2] * K), rayon: r2(l[3] * K) });

/* ---------- Paliers (l'été, puis les mêmes l'hiver, les toits sous la neige) ---------- */
const tierAnim = [];
const tierCells = [];
const winterCells = [];
for (const [hiver, site] of [false, true].flatMap(h => Object.keys(SITES).map(s => [h, s]))) {
  setHiver(hiver);
  for (let lv = 1; lv <= 7; lv++) {
    const look = lookAt(site, lv);
    const b = look.make(undefined);
    const n = Math.max(1, ...look.anims.map(a => a.n));
    const lead = look.anims.find(a => a.n === n);
    let boat = '';
    if (look.boat) { const [dx, dy] = boatOffset(look.boat); boat = `<g transform="translate(${dx} ${dy})">${inner(boatOf(undefined))}</g>`; }
    const frames = Array.from({ length: n }, (_, k) => up(inner(b) + look.anims.map(a => inner(a.frame(k % a.n))).join('') + boat));
    const frame = await fitFrame(big(b.box), frames);
    const ete = `${site}_palier${lv}`, base = hiver ? `${ete}_hiver` : ete;
    const files = frames.map((body, k) => put(`${hiver ? 'paliers_hiver' : 'paliers'}/${site}/${n > 1 ? `${base}_${k + 1}` : base}.svg`, frame, body));
    index[hiver ? 'paliers_hiver' : 'paliers'][base] = {
      nom: `${SITES[site]} — palier ${ROMAN[lv - 1]}${hiver ? ', l\'hiver' : ''}`, ...(hiver ? { ete } : {}), fichiers: files, cadre: frame, emprise: lv >= 4 ? '3 × 3' : '2 × 2',
      ...(n > 1 ? { ms_par_image: Math.round(1000 / lead.fps), animations: look.anims.map(a => `${a.key} (${a.n} images, ${a.fps}/s)`) } : {}),
      ...(look.lights.length ? { lumieres: look.lights.map(light) } : {}), ...(look.smoke.length ? { fumees: look.smoke.map(s => ({ u: r2(s[0]), v: r2(s[1]), z: r2(s[2] * K) })) } : {}),
      ...(look.sway ? { souplesse_au_vent: look.sway } : {}), ...(look.boat ? { voilier: 'compris dans l\'image (le jeu le berce à part : décor/ilots/voilier)' } : {})
    };
    (hiver ? winterCells : tierCells).push({ site, lv, frame, frames, ms: n > 1 ? Math.round(1000 / lead.fps) : 0 });
  }
}
setHiver(false);

/* ---------- Chantier ---------- */
const chantier = [];
for (const [k, make] of BUILDINGS.chantier.entries()) { const s = make(); const frame = await fitFrame(big(s.box), [up(inner(s))]); chantier.push({ frame, body: up(inner(s)), file: put(`chantier/chantier_${k + 1}.svg`, frame, up(inner(s))) }); }
index.chantier = { nom: 'Chantier (3 phases)', fichiers: chantier.map(c => c.file), cadres: chantier.map(c => c.frame) };

/* ---------- Skins : seulement les paliers où le skin change le dessin ---------- */
const skinCells = [];
for (const [site, skins] of Object.entries(SKINS_OF)) {
  for (const skin of skins) {
    const files = [];
    for (let lv = 1; lv <= 7; lv++) {
      const plain = artMake(site, lv)();
      const s = artMake(site, lv, skin)();
      if (s.svg === plain.svg) continue;
      const frame = await fitFrame(big(s.box), [up(inner(s))]);
      files.push({ rel: put(`skins/${site}/${skin}/${site}_${skin}_palier${lv}.svg`, frame, up(inner(s))), frame });
      if (lv === 3 || lv === 7) skinCells.push({ label: `${SITES[site]} ${ROMAN[lv - 1]} — ${SKIN_LABEL[skin]}`, frame, body: up(inner(s)) });
    }
    index.skins[skin] = { nom: `${SITES[site]} — ${SKIN_LABEL[skin]}`, batiment: site, fichiers: files.map(f => f.rel), cadres: files.map(f => f.frame) };
  }
}

/* ---------- Objets de la boutique : un fichier par calque (et par image), ancré à sa place ---------- */
const itemCells = [], itemAnim = [];
for (const [site, ids] of Object.entries(SHOP_ITEMS)) {
  for (const id of ids) {
    const { late, levels } = paliers(site, id);
    const item = SHOP_SPRITES[id];
    const layers = [];
    for (const { layer, variantes: variants, nom } of calques(site, id)) {
      const files = [], cadres = [];
      for (const vr of variants) {
        const fr = await fitFrame(vr.frame.map(n => r2(n * K)), vr.frames.map(body => up(body)));
        cadres.push(fr);
        vr.frames.forEach((body, f) => files.push(put(`objets/${site}/${id}/${nom(vr, f)}.svg`, fr, up(body))));
      }
      const place = {};
      for (const lv of levels) {
        const at = layer.at;
        const base = typeof at[0] === 'number' ? at : at[Math.min(lv, 3)] || at[2] || at[1];
        const k2 = lv >= 4 ? 1.5 : 1;
        place[ROMAN[lv - 1]] = [r2(base[0] * k2), r2(base[1] * k2)];
      }
      layers.push({ fichiers: files, cadre: cadres.length === 1 ? cadres[0] : cadres, derriere: !!layer.back, ...(layer.n ? { ms_par_image: Math.round(1000 / layer.fps) } : {}), ...(layer.motion ? { mouvement: true } : {}), place });
    }
    const lt = itemLight(id, levels[levels.length - 1]);
    index.objets[id] = { nom: NAME(id), batiment: site, paliers: late ? 'V à VII' : 'I à VII', calques: layers, ...(lt ? { lumiere: { u: r2(lt[0]), v: r2(lt[1]), z: r2(lt[2] * K), rayon: r2(lt[3] * K) } } : {}) };
    // vignette et animation : tous les calques composés à leur place, au palier III (ou V), cadrés au plus juste
    const lv = late ? 5 : 3;
    const comp = t => itemLayers(id, lv, t).map(l => ({ ...l, s: l.make() }));
    const boxOf = parts => { const bs = parts.map(p => ({ x: p.s.box.x + p.offset[0], y: p.s.box.y + p.offset[1], w: p.s.box.w, h: p.s.box.h })); const x = Math.min(...bs.map(b => b.x)), y = Math.min(...bs.map(b => b.y)); return { x, y, w: Math.max(...bs.map(b => b.x + b.w)) - x, h: Math.max(...bs.map(b => b.y + b.h)) - y }; };
    const draw = parts => parts.filter(p => p.back).concat(parts.filter(p => !p.back)).map(p => `<g transform="translate(${p.offset[0]} ${p.offset[1]})">${inner(p.s)}</g>`).join('');
    const p0 = comp(0);
    const animFrames = Array.from({ length: 8 }, (_, k) => up(draw(comp(k / 8))));
    const pad = await fitFrame(big(boxOf(p0)), [up(draw(p0)), ...animFrames]);
    itemCells.push({ label: `${NAME(id)} (${SITES[site]})`, frame: pad, body: up(draw(p0)) });
    if (item.layers.some(l => l.n || l.motion)) itemAnim.push({ label: `${NAME(id)} (${SITES[site]})`, frame: pad, frames: animFrames, ms: 125 });
  }
}

/* ---------- Pièces rares : bâtiment teinté + accessoire, à chaque palier ---------- */
const rareCells = [], rareAnim = [];
for (const [site, ids] of Object.entries(RARE_OF)) {
  for (const id of ids) {
    const files = [];
    for (let lv = 1; lv <= 7; lv++) {
      const s = artMake(site, lv, id)();
      const frame = await fitFrame(big(s.box), [up(inner(s))]);
      files.push({ rel: put(`pieces_rares/${id}/${id}_${site}_palier${lv}.svg`, frame, up(inner(s))), frame });
      if (lv === 7) rareCells.push({ label: `${NAME(id)} (${SITES[site]} VII)`, frame, body: up(inner(s)) });
    }
    index.pieces_rares[id] = { nom: NAME(id), batiment: site, fichiers: files.map(f => f.rel), cadres: files.map(f => f.frame), note: 'image 1 de l\'accessoire ; le jeu l\'anime (calques de shopSprites)' };
    // animation au palier VII : accessoire à 8 instants (le bâtiment ne bouge pas)
    const look = lookAt(site, 7);
    const b = look.make(id);
    const parts = t => itemLayers(id, 7, t).map(l => ({ ...l, s: l.make() }));
    const placed = (ps, side) => ps.filter(p => p.back === side).map(p => `<g transform="translate(${p.offset[0]} ${p.offset[1]})">${inner(p.s)}</g>`).join('');
    const ref = artMake(site, 7, id)();
    const rf = Array.from({ length: 8 }, (_, k) => { const ps = parts(k / 8); return up(placed(ps, true) + inner(b) + look.anims.map(a => inner(a.frame(k % a.n))).join('') + placed(ps, false)); });
    rareAnim.push({ label: `${NAME(id)} (${SITES[site]} VII)`, frame: await fitFrame(big(ref.box), rf), frames: rf, ms: 125 });
  }
}

/* ---------- Teintes : table et outil de recoloration (le trait de la troupe ne change pas) ---------- */
index.teintes = { vendues: Object.fromEntries(Object.entries(TINTS).map(([k, v]) => [k, v.name])), des_pieces_rares: Object.keys(RARE_TINTS), outil: 'teintes/teinter.mjs : tintSvg(svg, idDeTeinte)' };
write(path.join(LIB, 'teintes', 'teintes.json'), JSON.stringify({ TINTS, RARE_TINTS }, null, 1));
fs.copyFileSync(path.join(DIR, 'port/src/world/tints.js'), path.join(LIB, 'teintes', 'teinter.mjs'));
write(path.join(LIB, 'batiments.json'), JSON.stringify(index, null, 1));

/* ---------- Planches ---------- */
const cell = (frame, body, label, s) => [svgOf(frame, unique(body), s), label];
const shots = [];
const scale = f => Math.min(1, 210 / Math.max(f[2], f[3]));
const tierRows = Object.keys(SITES).map(site => row(SITES[site], tierCells.filter(t => t.site === site).map(t => cell(t.frame, t.frames[0], `palier ${ROMAN[t.lv - 1]}${t.frames.length > 1 ? ` · ${t.frames.length} images` : ''}`, 0.62))));
tierRows.push(row('Chantier', chantier.map((c, k) => cell(c.frame, c.body, `phase ${k + 1}`, 0.62))));
shots.push([path.join(PNG, 'batiments_paliers.png'), sheet('Bâtiments — les 7 paliers', 'Dessins du jeu au trait de la troupe. Paliers I-III : cadre BUILDING_BOX × 1,25 (2 × 2 cases) ; IV-VII : BIG_BOX × 1,25 (3 × 3). Ancre au centre de l\'emprise.', tierRows), 1500]);
const winterRows = Object.keys(SITES).map(site => row(SITES[site], winterCells.filter(t => t.site === site).map(t => cell(t.frame, t.frames[0], `palier ${ROMAN[t.lv - 1]}`, 0.62))));
shots.push([path.join(PNG, 'batiments_hiver.png'), sheet('Bâtiments — l\'hiver', 'Les 7 paliers, les toits sous la neige : une calotte de neige sur chaque toit, son ombre bleutée, des glaçons sous l\'égout, un chapeau de neige sur les cheminées. Même ancre que l\'été.', winterRows), 1500]);
shots.push([path.join(PNG, 'batiments_skins.png'), sheet('Bâtiments — les 20 skins', 'Chaque skin à tous les paliers où il change le dessin (ici paliers III et VII).', [row('', skinCells.map(c => cell(c.frame, c.body, c.label, scale(c.frame) * 0.8)))]), 1500]);
shots.push([path.join(PNG, 'batiments_objets.png'), sheet('Bâtiments — les 48 objets de la boutique', 'Calques composés à leur place (palier III, ou V pour les trois derniers de chaque boutique). Les SVG : un fichier par calque, ancré à sa place au sol.', [row('', itemCells.map(c => cell(c.frame, c.body, c.label, Math.min(2, 120 / Math.max(c.frame[2], c.frame[3])))))]), 1500]);
shots.push([path.join(PNG, 'batiments_pieces_rares.png'), sheet('Bâtiments — les 14 pièces rares', 'Bâtiment teinté et accessoire, au palier VII (tous les paliers dans les SVG).', [row('', rareCells.map(c => cell(c.frame, c.body, c.label, 0.75)))]), 1500]);
// démonstration des teintes : Foyer III et Potager VII
const demo = ['foyer', 3, 'potager', 7];
const tintRows = [];
for (let i = 0; i < demo.length; i += 2) {
  const s = artMake(demo[i], demo[i + 1])();
  const frame = big(s.box);
  tintRows.push(row(`${SITES[demo[i]]} ${ROMAN[demo[i + 1] - 1]}`, [cell(frame, up(inner(s)), 'd\'origine', 0.5), ...Object.entries(TINTS).map(([k, v]) => cell(frame, up(inner({ svg: tintSvg(s.svg, k) })), v.name, 0.5))]));
}
shots.push([path.join(PNG, 'batiments_teintes.png'), sheet('Bâtiments — les 12 teintes', 'Recolorations du dessin (84 skins vendus = 12 teintes × 7 bâtiments), à faire avec teintes/teinter.mjs. Le trait brun de la troupe ne change pas.', tintRows), 1500]);

/* ---------- Page animée ---------- */
const box = (label, frame, frames, ms, s) => ({ label, frames: frames.map(b => svgOf(frame, unique(b), s)), timings: [ms], w: r2(frame[2] * s), h: r2(frame[3] * s) });
const anim = [
  ['Paliers animés', tierCells.filter(t => t.frames.length > 1).map(t => box(`${SITES[t.site]} ${ROMAN[t.lv - 1]}`, t.frame, t.frames, t.ms, scale(t.frame)))],
  ['Objets de la boutique', itemAnim.map(a => box(a.label, a.frame, a.frames, a.ms, Math.min(2, 130 / Math.max(a.frame[2], a.frame[3]))))],
  ['Pièces rares', rareAnim.map(a => box(a.label, a.frame, a.frames, a.ms, scale(a.frame)))]
];
write(path.join(DIR, 'batiments_apercu.html'), animated('Les bâtiments en mouvement', 'Lot E : paliers (vitesse du jeu), objets et pièces rares.', anim));
await shoot(shots);
await closeFit();
console.log('ok', count, 'SVG');
