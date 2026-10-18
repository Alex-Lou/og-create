// Les pages du Bestiaire (BestiaryBook ; choix de l'auteur, 18 oct.), de la main du Livre (painter.js : papier, cadre,
// filets, folio, polices) : le sommaire des catégories, leurs pages de cases (une par créature : son numéro, son dessin,
// ou sa silhouette d'encre tant qu'elle n'est pas rencontrée, son nom, sa rareté, et le tampon « Rencontré »), l'index.
// Une catégorie complète porte un sceau d'or, au sommaire et sur ses pages. Page de 100 u de large sur 133,3 de haut ;
// chaque page rend ses zones à toucher (en u) et ce qu'elle dit à voix haute.
import { paperBase, frame, rule, folio, rr, alpha, setFont, fitText, seeded, FELL, CAPS, INK, TEXT_INK, NOTE, FAINT, IVORY } from './painter';
import { GOLD } from './grimoire';
import { BESTIARY as T, CATEGORY_TITLES } from '@/texts/world/creatures';

// Les cases d'une page : deux colonnes, trois rangées
export const PER_PAGE = 6;
const COLS = [12, 54];
const ROWS = [18, 53, 88];
export const CELL = { w: 38, h: 32 };
// Le tampon, dans le coin de sa case (son centre, en u depuis le coin de la case ; k : sa taille)
export const STAMP_AT = { dx: CELL.w - 6.6, dy: 12.6, k: 0.8 };
// Les points de rareté (une légendaire : une étoile d'or)
const DOTS = { commun: 1, 'peu commun': 2, rare: 3 };
// Les lignes de l'index : deux colonnes de INDEX_ROWS par page
const INDEX_ROWS = 16;
// Le sommaire : ses lignes entre top et bottom (u), de row de haut au plus, séparées de gap
const TOC = { top: 37, bottom: 119, row: 10, gap: 1.6 };
// L'encre du tampon, et celle des silhouettes
const STAMP_INK = '#9C3A2B';
const SHADOW_INK = '#4A3426';

// Les pages du livre : le sommaire, chaque catégorie en pages de PER_PAGE cases (complete : toutes rencontrées), l'index
// (sur autant de pages qu'il faut). creatures : world/creatures.js (CREATURES) ; met : Map id → instant de la rencontre.
// [{ type, … }], la page de chaque créature (id → index), la première page de l'index
export function bestiaryPages(creatures, categories, met) {
  const pages = [{ type: 'toc', rows: [] }];
  const pageOf = new Map();
  for (const category of categories) {
    const list = creatures.filter(c => c.category === category);
    const found = list.filter(c => met.has(c.id)).length;
    const complete = found === list.length;
    pages[0].rows.push({ category, start: pages.length, found, total: list.length, complete });
    for (let k = 0; k < list.length; k += PER_PAGE) {
      const cells = list.slice(k, k + PER_PAGE);
      cells.forEach(c => pageOf.set(c.id, pages.length));
      pages.push({ type: 'grid', category, cells, first: k === 0, complete });
    }
  }
  const index = pages.length;
  for (let k = 0; k < creatures.length; k += 2 * INDEX_ROWS) pages.push({ type: 'index', from: k, to: Math.min(creatures.length, k + 2 * INDEX_ROWS) });
  return { pages, pageOf, index };
}

// Une page (model : bestiaryPages) ; assets : { creatures, met (Map), image(creature) → image prête ou null, hidden
// (Set : tampons qui attendent de tomber), pageOf, indexPage, dateOf(ms) }
export function paintBestiaryPage(model, index, ctx, w, h, assets, side = 'right') {
  const u = w / 100;
  const shift = side === 'left' ? -4 : 0;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  paperBase(ctx, w, h, u, side, index + 101);
  ctx.translate(shift * u, 0);
  frame(ctx, u);
  const painters = { toc: paintToc, grid: paintGrid, index: paintIndex };
  const result = painters[model.type](ctx, u, model, index, assets);
  if (index > 0) folio(ctx, u, index);
  ctx.restore();
  return shift ? { ...result, hotspots: result.hotspots.map(spot => ({ ...spot, x: spot.x + shift })) } : result;
}

function paintToc(ctx, u, model, index, assets) {
  const hotspots = [];
  const found = assets.met.size;
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  setFont(ctx, u, 11.5, FELL);
  ctx.fillText(T.title, 52 * u, 22 * u);
  setFont(ctx, u, 4.8, FELL, true);
  ctx.fillStyle = NOTE;
  ctx.fillText(T.subtitle(found, assets.creatures.length), 52 * u, 29 * u);
  rule(ctx, u, 33, 28, 76, true);
  const rows = [...model.rows.map(r => ({ ...r, title: CATEGORY_TITLES[r.category] })), { title: T.index, start: assets.indexPage, found: null }];
  // (les lignes se resserrent pour tenir entre le filet et la note du bas)
  const step = Math.min(TOC.row + TOC.gap, (TOC.bottom - TOC.top) / rows.length);
  const hh = step - TOC.gap;
  rows.forEach((row, k) => {
    const y = TOC.top + k * step;
    const base = y + hh * 0.66;
    rr(ctx, 12 * u, y * u, 80 * u, hh * u, 3 * u);
    ctx.fillStyle = alpha(IVORY, 0.7);
    ctx.fill();
    ctx.strokeStyle = alpha(GOLD.base, 0.45);
    ctx.lineWidth = 0.3 * u;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(fitText(ctx, u, row.title, 50, Math.min(5.4, hh * 0.6), 4.2, FELL), 17 * u, base * u);
    setFont(ctx, u, 4.6, FELL);
    ctx.textAlign = 'right';
    ctx.fillStyle = NOTE;
    ctx.fillText(row.found === null ? String(row.start) : `${row.found}/${row.total}`, 88 * u, base * u);
    if (row.complete) seal(ctx, u, 72, y + hh / 2, Math.min(3.6, hh * 0.42));
    const label = row.found === null ? row.title : `${row.title}, ${row.found}/${row.total}${row.complete ? `, ${T.complete}` : ''}`;
    hotspots.push({ id: `toc-${k}`, x: 12, y, w: 80, h: hh, action: 'goto', data: row.start, label });
  });
  setFont(ctx, u, 4.2, FELL, true);
  ctx.fillStyle = NOTE;
  ctx.textAlign = 'center';
  ctx.fillText(T.tocHint, 52 * u, 124 * u);
  return { hotspots, label: `${T.title}. ${T.toc}.` };
}

function paintGrid(ctx, u, model, index, assets) {
  const hotspots = [];
  // Le titre courant : la catégorie en petites capitales, sur un filet d'or
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  // (complète : son sceau d'or devant le titre, loin du signet)
  const left = model.complete ? 21.5 : 13;
  ctx.fillText(fitText(ctx, u, CATEGORY_TITLES[model.category], 83 - left, 4.8, 3.8, CAPS), left * u, 11.6 * u);
  rule(ctx, u, 14, 12, 92);
  if (model.complete) seal(ctx, u, 16, 9.6, 4);
  model.cells.forEach((creature, k) => {
    const x = COLS[k % 2];
    const y = ROWS[Math.floor(k / 2)];
    const met = assets.met.get(creature.id);
    paintCell(ctx, u, creature, x, y, met, assets);
    hotspots.push({ id: `cell-${creature.id}`, x, y, w: CELL.w, h: CELL.h, action: 'creature', data: creature.id, label: met ? creature.name : `N° ${creature.no}, ${T.unknownName}` });
  });
  const title = model.complete ? `${CATEGORY_TITLES[model.category]}, ${T.complete}` : CATEGORY_TITLES[model.category];
  return { hotspots, label: `${title}. ${model.cells.map(c => (assets.met.has(c.id) ? c.name : T.unknownName)).join(', ')}` };
}

// Une case : son numéro, sa rareté, son dessin (ou sa silhouette), son nom, et le tampon s'il est rencontré
function paintCell(ctx, u, creature, x, y, met, assets) {
  rr(ctx, x * u, y * u, CELL.w * u, CELL.h * u, 2.4 * u);
  ctx.fillStyle = alpha(IVORY, 0.55);
  ctx.fill();
  ctx.strokeStyle = alpha(GOLD.base, 0.5);
  ctx.lineWidth = 0.3 * u;
  ctx.stroke();
  setFont(ctx, u, 3.4, CAPS, false, 0.08);
  ctx.fillStyle = NOTE;
  ctx.textAlign = 'left';
  ctx.fillText(`N° ${String(creature.no).padStart(2, '0')}`, (x + 2.4) * u, (y + 4.6) * u);
  paintRarity(ctx, u, creature.rarity, x + CELL.w, y + 3.4);
  const img = assets.image(creature);
  if (img) {
    const box = { w: 24, h: 17 };
    const k = Math.min((box.w * u) / img.width, (box.h * u) / img.height);
    const dw = img.width * k;
    const dh = img.height * k;
    const cx = (x + CELL.w / 2) * u;
    const cy = (y + 15.5) * u;
    ctx.drawImage(met ? img : silhouette(img, Math.ceil(dw), Math.ceil(dh)), cx - dw / 2, cy - dh / 2, dw, dh);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = met ? INK : FAINT;
  ctx.fillText(fitText(ctx, u, met ? creature.name : T.unknownName, CELL.w - 4, 4.6, 3.4, FELL), (x + CELL.w / 2) * u, (y + 28.6) * u);
  if (met && !assets.hidden.has(creature.id)) stamp(ctx, u * STAMP_AT.k, (x + STAMP_AT.dx) / STAMP_AT.k, (y + STAMP_AT.dy) / STAMP_AT.k, assets.dateOf(met), creature.no);
}

// Le tampon « Rencontré » et sa date, d'encre un peu inégale, de travers (cx, cy en u)
export function stamp(ctx, u, cx, cy, date, seed) {
  const rand = seeded(seed * 31);
  ctx.save();
  ctx.translate(cx * u, cy * u);
  ctx.rotate(-0.32 + rand() * 0.14);
  ctx.globalAlpha = 0.86;
  ctx.strokeStyle = STAMP_INK;
  ctx.fillStyle = STAMP_INK;
  ctx.lineWidth = 0.5 * u;
  ctx.beginPath();
  ctx.arc(0, 0, 6.6 * u, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 0.22 * u;
  ctx.beginPath();
  ctx.arc(0, 0, 5.6 * u, 0, Math.PI * 2);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(fitText(ctx, u, T.stamp, 9.6, 2.2, 1.6, CAPS), 0, -1.1 * u);
  ctx.fillText(fitText(ctx, u, date, 9.6, 2.4, 1.8, FELL, true), 0, 1.9 * u);
  // (l'encre manque par endroits)
  ctx.globalCompositeOperation = 'destination-out';
  for (let k = 0; k < 26; k++) {
    ctx.beginPath();
    ctx.arc((rand() - 0.5) * 14 * u, (rand() - 0.5) * 14 * u, (0.1 + rand() * 0.35) * u, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// La rareté, dans le coin haut de la case (right, cy : son bord droit et sa ligne, en u) : un, deux ou trois points d'or ;
// une légendaire, une étoile
function paintRarity(ctx, u, rarity, right, cy) {
  if (rarity === 'légendaire') {
    star(ctx, (right - 5.4) * u, cy * u, 2 * u);
    ctx.fillStyle = GOLD.base;
    ctx.fill();
    ctx.strokeStyle = GOLD.edge;
    ctx.lineWidth = 0.14 * u;
    ctx.stroke();
    return;
  }
  for (let d = 0; d < 3; d++) {
    ctx.beginPath();
    ctx.arc((right - 3 - d * 2.4) * u, cy * u, 0.8 * u, 0, Math.PI * 2);
    ctx.fillStyle = d < DOTS[rarity] ? alpha(GOLD.base, 0.95) : alpha(FAINT, 0.35);
    ctx.fill();
  }
}

// Une étoile à cinq branches (son tracé : centre et rayon en pixels)
function star(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const d = i % 2 ? r * 0.42 : r;
    ctx.lineTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d);
  }
  ctx.closePath();
}

// Le sceau d'or d'une catégorie complète (cx, cy, r en u) : une rosette dentelée, d'or bombé, un anneau, une étoile
function seal(ctx, u, cx, cy, r) {
  ctx.save();
  ctx.translate(cx * u, cy * u);
  const R = r * u;
  const gold = ctx.createRadialGradient(-R * 0.35, -R * 0.35, 0, 0, 0, R);
  gold.addColorStop(0, GOLD.light);
  gold.addColorStop(0.55, GOLD.base);
  gold.addColorStop(1, GOLD.dark);
  ctx.beginPath();
  for (let i = 0; i < 36; i++) {
    const a = (i * Math.PI) / 18;
    const d = i % 2 ? R * 0.88 : R;
    ctx.lineTo(Math.cos(a) * d, Math.sin(a) * d);
  }
  ctx.closePath();
  ctx.shadowColor = 'rgba(60, 40, 10, 0.35)';
  ctx.shadowBlur = 0.8 * u;
  ctx.shadowOffsetY = 0.3 * u;
  ctx.fillStyle = gold;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = GOLD.edge;
  ctx.lineWidth = 0.16 * u;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.66, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(GOLD.edge, 0.75);
  ctx.lineWidth = 0.14 * u;
  ctx.stroke();
  star(ctx, 0, 0, R * 0.46);
  ctx.fillStyle = GOLD.light;
  ctx.fill();
  ctx.strokeStyle = GOLD.edge;
  ctx.lineWidth = 0.12 * u;
  ctx.stroke();
  ctx.restore();
}

// La silhouette d'encre d'une créature pas encore rencontrée : son dessin, plein d'une encre sombre, tracé à la taille où
// la page le peint (gardée par image et par taille : une seule à la fois, celle de la dernière taille)
const shadows = new WeakMap();
function silhouette(img, w, h) {
  const kept = shadows.get(img);
  if (kept && kept.width === w && kept.height === h) return kept;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0, w, h);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = alpha(SHADOW_INK, 0.72);
  g.fillRect(0, 0, c.width, c.height);
  shadows.set(img, c);
  return c;
}

function paintIndex(ctx, u, model, index, assets) {
  const hotspots = [];
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  setFont(ctx, u, 7, FELL);
  ctx.fillText(T.index, 52 * u, 19 * u);
  rule(ctx, u, 23, 30, 74, true);
  assets.creatures.slice(model.from, model.to).forEach((creature, k) => {
    const x = k < INDEX_ROWS ? 13 : 54;
    const y = 30 + (k % INDEX_ROWS) * 5.8;
    const met = assets.met.has(creature.id);
    setFont(ctx, u, 3.6, FELL);
    ctx.textAlign = 'left';
    ctx.fillStyle = NOTE;
    ctx.fillText(String(creature.no).padStart(2, '0'), x * u, y * u);
    ctx.fillStyle = met ? TEXT_INK : FAINT;
    ctx.fillText(fitText(ctx, u, met ? creature.name : T.unknownName, 26, 3.6, 3, FELL), (x + 5) * u, y * u);
    hotspots.push({ id: `index-${creature.id}`, x, y: y - 4, w: 34, h: 5.4, action: 'goto', data: assets.pageOf.get(creature.id), label: met ? creature.name : `N° ${creature.no}` });
  });
  return { hotspots, label: T.index };
}
