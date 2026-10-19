// Les pages d'un chapitre : l'index, la page de chapitre (sa lettrine), la table des matières et les gardes.
import { CHAPTER_STYLE, BOOK_TITLE, tintOfFamily } from '../chapters';
import { SIGILS, GOLD } from '../grimoire';
import { PAGES as T } from '@/texts/book/painter';
import { familyName } from './clues';
import { glyph } from './glyphs';
import { PAPER, IVORY, VELLUM, seeded, rr } from './paper';
import { FELL, CAPS, GOTHIC, INK, TEXT_INK, NOTE, FAINT, setFont, fitFont, fitText, wrap, alpha } from './type';
import { sigil, frame, folio, rule, header } from './ornaments';

// Table d'un chapitre : jusqu'à 16 pages par feuille, sur deux colonnes (à trouver d'abord, puis inscrites) ;
// chacune mène à sa page
const INDEX_COLS = 2;

const INDEX_ROW = 13.3;

function paintIndex(ctx, u, model, i, assets) {
  const { chapter, entries, part, parts } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, null, parts > 1 ? `Table ${part}/${parts}` : 'Table');
  const hotspots = [];
  const cellW = 80 / INDEX_COLS;
  const h = INDEX_ROW - 1.2;
  entries.forEach((entry, k) => {
    const x = 12 + (k % INDEX_COLS) * cellW;
    const y = 17 + Math.floor(k / INDEX_COLS) * INDEX_ROW;
    const found = entry.page.status === 'found';
    // Case inscrite : teinte de la famille de l'élément (comme sa tuile) ; case à trouver : vélin pointillé
    const tint = found ? tintOfFamily(entry.page.family) : null;
    rr(ctx, (x + 0.6) * u, y * u, (cellW - 1.2) * u, h * u, 2.6 * u);
    ctx.fillStyle = found ? tint.card : IVORY;
    ctx.fill();
    ctx.lineWidth = 0.35 * u;
    if (found) {
      ctx.strokeStyle = alpha(tint.ink, 0.25);
      ctx.stroke();
    } else {
      ctx.setLineDash([1.2 * u, 0.9 * u]);
      ctx.strokeStyle = alpha(style.ink, 0.45);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const cx = x + 6.6, cy = y + h / 2;
    ctx.beginPath();
    ctx.arc(cx * u, cy * u, 4.4 * u, 0, Math.PI * 2);
    ctx.fillStyle = found ? IVORY : alpha(style.color, 0.7);
    ctx.fill();
    if (found) glyph(ctx, entry.page.emoji, cx * u, cy * u, 6.4 * u, assets.onReady);
    else {
      setFont(ctx, u, 6, FELL);
      ctx.fillStyle = style.ink;
      ctx.textAlign = 'center';
      ctx.fillText('?', cx * u, (cy + 2) * u);
    }
    // Nom inscrit, ou lettres trouvées d'une page à portée (« S _ _ e »)
    const text = found ? entry.page.name : maskText(entry.page);
    ctx.fillStyle = found ? INK : style.ink;
    ctx.textAlign = 'left';
    ctx.fillText(fitText(ctx, u, text, cellW - 14, 4.8, 3.4, FELL), (x + 12.4) * u, (cy + 1.6) * u);
    hotspots.push({
      id: `idx-${entry.key}`, x: x + 0.6, y, w: cellW - 1.2, h, action: 'goto', data: entry.index,
      label: found ? T.entryFound(entry.page.name) : T.entryReach(entry.page.letters)
    });
  });
  folio(ctx, u, i);
  const reach = entries.filter(e => e.page.status !== 'found').length;
  return { hotspots, label: T.index(chapter.id, part, parts, reach, entries.length - reach) };
}

// Masque d'une page à portée : lettres trouvées, blancs ailleurs
function maskText(page) {
  const mask = page.hangman ? page.hangman.mask : [...Array(page.letters)].map((_, k) => (k === 0 && page.first ? page.first : null));
  // Espace fine au-delà de 6 lettres : le mot tient sur sa case
  return mask.map(char => (char === ' ' ? '·' : char || '_')).join(mask.length > 6 ? '\u2009' : ' ');
}

// Lettrine : la première lettre en fraktur, à la cire du chapitre, haute de deux lignes ; le texte, en italique,
// coule autour (deux lignes à côté, puis pleine largeur), en lignes de 5,9 u depuis la ligne de base top ; au
// plus maxLines lignes
function lettrine(ctx, u, text, top, style, maxLines) {
  const x0 = 14, right = 90, lead = 5.9;
  setFont(ctx, u, 15, GOTHIC);
  ctx.fillStyle = style.wax;
  ctx.textAlign = 'left';
  ctx.fillText(text[0], x0 * u, (top + lead) * u);
  const indent = x0 + ctx.measureText(text[0]).width / u + 1.8;
  setFont(ctx, u, 4.8, FELL, true);
  ctx.fillStyle = TEXT_INK;
  const words = text.slice(1).split(' ');
  let line = '', n = 0;
  const lineX = k => (k < 2 ? indent : x0);
  const flush = () => {
    ctx.fillText(line, lineX(n) * u, (top + n * lead) * u);
    n++;
    line = '';
  };
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > (right - lineX(n)) * u && line) {
      if (n === maxLines - 1) {
        line = `${line}…`;
        break;
      }
      flush();
      line = word;
    } else line = next;
  }
  if (line && n < maxLines) flush();
}

function paintChapter(ctx, u, model, i, assets) {
  const { chapter } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  const cx = 52, cy = 31;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx * u, cy * u, 15.4 * u, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(74, 52, 38, .18)';
  ctx.shadowBlur = 3 * u;
  ctx.shadowOffsetY = 1.2 * u;
  ctx.fillStyle = IVORY;
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx * u, cy * u, 16.4 * u, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(GOLD.base, 0.75);
  ctx.lineWidth = 0.35 * u;
  ctx.stroke();
  // Les sept sigles en couronne : celui du chapitre en or
  Object.keys(SIGILS).forEach((id, k) => {
    const a = -Math.PI / 2 + (k * Math.PI * 2) / 7;
    const own = id === chapter.id;
    sigil(ctx, u, id, cx + Math.cos(a) * 21, cy + Math.sin(a) * 21, own ? 5.2 : 4.2, own ? GOLD.base : alpha(style.ink, 0.3), own ? 2.4 : 2);
  });
  ctx.beginPath();
  ctx.arc(cx * u, cy * u, 13.8 * u, 0, Math.PI * 2);
  ctx.fillStyle = chapter.open ? style.color : VELLUM;
  ctx.fill();
  setFont(ctx, u, chapter.id.length > 2 ? 10 : 12.6, FELL);
  ctx.fillStyle = chapter.open ? style.ink : FAINT;
  ctx.textAlign = 'center';
  ctx.fillText(chapter.id, cx * u, (cy + 4.3) * u);
  setFont(ctx, u, 5, CAPS, false, 0.14);
  ctx.fillStyle = style.ink;
  ctx.fillText(`Chapitre ${chapter.id}`, 52 * u, 59.5 * u);
  // Le nom, sur une ligne si possible, puis un filet d'or
  let size = 10;
  setFont(ctx, u, size, FELL);
  if (ctx.measureText(chapter.name).width > 80 * u) {
    size = 8.6;
    setFont(ctx, u, size, FELL);
  }
  ctx.fillStyle = INK;
  const lines = wrap(ctx, chapter.name, 80 * u);
  const lead = size * 0.94;
  lines.forEach((line, k) => ctx.fillText(line, 52 * u, (70 + k * lead) * u));
  const ruleY = 70 + (lines.length - 1) * lead + 5.6;
  rule(ctx, u, ruleY, 30, 74, true);
  const top = ruleY + 8.6;
  // La phrase du chapitre en lettrine (à défaut, ses familles)
  if (chapter.verse) lettrine(ctx, u, chapter.verse, top, style, lines.length > 1 ? 3 : 4);
  else {
    setFont(ctx, u, 4.8, FELL, true);
    ctx.fillStyle = NOTE;
    ctx.textAlign = 'center';
    ctx.fillText(fitText(ctx, u, assets.familiesOf(chapter.id).map(familyName).join(' · '), 80, 4.8, 3.6, FELL, true), 52 * u, top * u);
  }
  ctx.textAlign = 'center';
  if (chapter.open) {
    setFont(ctx, u, 5.4, FELL);
    ctx.fillStyle = INK;
    ctx.fillText(T.inscribed(chapter.found, chapter.total), 52 * u, 112 * u);
    const reach = chapter.pages.filter(p => p.status === 'reach').length;
    setFont(ctx, u, 4.6, FELL, true);
    ctx.fillStyle = NOTE;
    ctx.fillText(reach ? T.inReach(reach) : T.nothingInReach, 52 * u, 118.6 * u);
  } else {
    const left = Math.max(0, chapter.need - assets.stars);
    setFont(ctx, u, 5.2, CAPS, false, 0.06);
    ctx.fillStyle = NOTE;
    ctx.fillText('Chapitre scellé', 52 * u, 112 * u);
    setFont(ctx, u, 4.6, FELL, true);
    ctx.fillText(T.sealedLeft(left), 52 * u, 118.6 * u);
  }
  folio(ctx, u, i);
  return { hotspots: [], label: T.chapter(chapter.id, chapter.name, chapter.verse, chapter.open ? T.chapterOpen(chapter.found, chapter.total) : T.chapterSealed(Math.max(0, chapter.need - assets.stars))) };
}

function paintToc(ctx, u, model, index, assets) {
  frame(ctx, u);
  const hotspots = [];
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  fitFont(ctx, u, BOOK_TITLE, 76, 11.5, 8, FELL);
  ctx.fillText(BOOK_TITLE, 52 * u, 20.5 * u);
  setFont(ctx, u, 4.8, FELL, true);
  ctx.fillStyle = NOTE;
  // Les chiffres anciens d'IM Fell font du zéro un « o » : en toutes lettres
  const found = assets.stars ? T.discoveries(assets.stars) : T.noDiscovery;
  ctx.fillText(T.subtitle(found), 52 * u, 27.6 * u);
  rule(ctx, u, 31, 28, 76, true);
  const h = 11.6;
  model.chapters.forEach((chapter, k) => {
    const style = CHAPTER_STYLE[chapter.id];
    const y = 34.4 + k * 12.7;
    const mid = y + h / 2;
    rr(ctx, 12 * u, y * u, 80 * u, h * u, 3 * u);
    ctx.fillStyle = chapter.open ? alpha(style.color, 0.75) : VELLUM;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(18.4 * u, mid * u, 4.2 * u, 0, Math.PI * 2);
    ctx.fillStyle = IVORY;
    ctx.fill();
    ctx.fillStyle = chapter.open ? style.ink : FAINT;
    ctx.textAlign = 'center';
    fitFont(ctx, u, chapter.id, 7, 5, 3, FELL);
    ctx.fillText(chapter.id, 18.4 * u, (mid + 1.6) * u);
    ctx.fillStyle = chapter.open ? INK : NOTE;
    ctx.textAlign = 'left';
    ctx.fillText(fitText(ctx, u, chapter.name, 46, 5.4, 4.2, FELL), 25.4 * u, (y + 5.6) * u);
    rr(ctx, 25.4 * u, (y + 7.6) * u, 47 * u, 1.3 * u, 0.65 * u);
    ctx.fillStyle = 'rgba(255, 253, 248, .9)';
    ctx.fill();
    if (chapter.open && chapter.found) {
      rr(ctx, 25.4 * u, (y + 7.6) * u, Math.max(1.3, (47 * chapter.found) / chapter.total) * u, 1.3 * u, 0.65 * u);
      ctx.fillStyle = style.ink;
      ctx.fill();
    }
    setFont(ctx, u, 4.6, FELL);
    ctx.textAlign = 'right';
    ctx.fillStyle = chapter.open ? INK : NOTE;
    const count = chapter.open ? `${chapter.found}/${chapter.total}` : String(chapter.need);
    ctx.fillText(count, 89.4 * u, (mid + 1.6) * u);
    // Chapitre scellé : un cadenas devant le nombre de découvertes qu'il demande
    if (!chapter.open) glyph(ctx, 'ui:lock', 89.4 * u - ctx.measureText(count).width - 2.6 * u, mid * u, 3.8 * u, assets.onReady);
    hotspots.push({ id: `toc-${chapter.id}`, x: 12, y, w: 80, h, action: 'goto', data: model.chapterIndex[chapter.id], label: T.tocEntry(chapter.id, chapter.name, chapter.open) });
  });
  setFont(ctx, u, 4.2, FELL, true);
  ctx.fillStyle = NOTE;
  ctx.textAlign = 'center';
  ctx.fillText(T.tocHint, 52 * u, 126.8 * u);
  return { hotspots, label: T.toc(BOOK_TITLE, model.chapters.map(c => T.tocChapter(c.id, c.name)).join('. ')) };
}

// Gardes du grimoire (double page) : papier marbré peigné ; au revers de la couverture, l'ex-libris (et l'étape de
// civilisation du joueur, s'il en a une)
export function paintEndpaper(ctx, w, h, side, front, stage = null) {
  const u = w / 100;
  const rand = seeded(front ? 7 : 11);
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#2E1A22';
  ctx.fillRect(0, 0, w, h);
  const colors = ['110, 38, 51', '184, 139, 62', '39, 67, 79', '227, 210, 172', '74, 26, 36', '140, 90, 43'];
  ctx.lineCap = 'round';
  for (let k = 0; k < 54; k++) {
    const y0 = rand() * h, amp = (2 + rand() * 8) * u, freq = (0.05 + rand() * 0.07) / u, ph = rand() * 6.28;
    ctx.beginPath();
    for (let x = -2 * u; x <= w + 2 * u; x += 1.5 * u) {
      const y = y0 + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.7 + ph * 1.3) * amp * 0.35;
      if (x < 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${colors[Math.floor(rand() * colors.length)]}, ${0.45 + rand() * 0.45})`;
    ctx.lineWidth = (0.5 + rand() * 3.4) * u;
    ctx.stroke();
  }
  // Coups de peigne : fines ondes verticales claires
  for (let x = 0; x < w; x += 2.6 * u) {
    ctx.beginPath();
    for (let y = 0; y <= h; y += 2 * u) {
      const dx = Math.sin(y / (6 * u) + x / (9 * u)) * 1.2 * u;
      if (!y) ctx.moveTo(x + dx, y);
      else ctx.lineTo(x + dx, y);
    }
    ctx.strokeStyle = 'rgba(255, 236, 200, .07)';
    ctx.lineWidth = 0.3 * u;
    ctx.stroke();
  }
  const spine = side === 'left' ? w : 0;
  const g = ctx.createLinearGradient(spine, 0, side === 'left' ? w - 12 * u : 12 * u, 0);
  g.addColorStop(0, 'rgba(0, 0, 0, .45)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(side === 'left' ? w - 12 * u : 0, 0, 12 * u, h);
  if (front) {
    // Ex-libris : cartouche de parchemin à double filet
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, .45)';
    ctx.shadowBlur = 3 * u;
    ctx.shadowOffsetY = 1 * u;
    rr(ctx, 24 * u, 46 * u, 52 * u, (stage ? 42 : 38) * u, 2 * u);
    ctx.fillStyle = PAPER;
    ctx.fill();
    ctx.restore();
    rr(ctx, 25.6 * u, 47.6 * u, 48.8 * u, (stage ? 38.8 : 34.8) * u, 1.4 * u);
    ctx.strokeStyle = 'rgba(74, 52, 38, .55)';
    ctx.lineWidth = 0.4 * u;
    ctx.stroke();
    rr(ctx, 26.8 * u, 48.8 * u, 46.4 * u, (stage ? 36.4 : 32.4) * u, 1 * u);
    ctx.strokeStyle = alpha(GOLD.base, 0.8);
    ctx.lineWidth = 0.25 * u;
    ctx.stroke();
    ctx.textAlign = 'center';
    setFont(ctx, u, 4.4, FELL, true);
    ctx.fillStyle = NOTE;
    ctx.fillText('Ex libris', 50 * u, 56.5 * u);
    fitFont(ctx, u, BOOK_TITLE, 44, 8, 5, FELL);
    ctx.fillStyle = INK;
    ctx.fillText(BOOK_TITLE, 50 * u, 66.4 * u);
    Object.keys(SIGILS).forEach((id, k) => sigil(ctx, u, id, 32 + k * 6, 74.5, 3.6, alpha(GOLD.dark, 0.85), 2.2));
    if (stage) {
      ctx.fillStyle = NOTE;
      ctx.fillText(fitText(ctx, u, stage, 44, 4.2, 3, FELL, true), 50 * u, 81.6 * u);
    }
  }
  ctx.restore();
  return { hotspots: [], label: front ? T.endpaperFront(BOOK_TITLE) : T.endpaperBack };
}

export { paintIndex, paintChapter, paintToc };
