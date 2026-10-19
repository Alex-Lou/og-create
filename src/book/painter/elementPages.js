// Les pages d'un élément : trouvé (sa citation, son tampon), à portée (les cases à deviner) ou encore loin.
import { aimNote } from '../aim';
import { CHAPTER_STYLE } from '../chapters';
import { FAMILY_WORDS, AN_ELEMENT, PAGES as T } from '@/texts/book/painter';
import { FAMILY_SHORT, familyHints, clueText, familyName } from './clues';
import { glyph } from './glyphs';
import { VELLUM, rr } from './paper';
import { FELL, CAPS, INK, TEXT_INK, NOTE, FAINT, setFont, fitFont, fitText, wrap, alpha } from './type';
import { frame, folio, header, MEDAL, vignette } from './ornaments';
import { patchwork, bigQuestion, BOX, recipeRow } from './blocks';

// Le pendu (deviner le nom lettre par lettre) : en réserve, il reviendra en joker payant
const HANGMAN = false;

/* ---------- Pages ---------- */
// Citation en italique sous le nom (énigme, ou familles) : trois lignes au plus, le corps se réduit pour tenir ;
// renvoie la ligne de base de la dernière ligne (u)
function paintQuote(ctx, u, text, top) {
  const quote = `«\u00a0${text}\u00a0»`;
  let size = 5.2;
  setFont(ctx, u, size, FELL, true);
  let lines = wrap(ctx, quote, 76 * u);
  while (lines.length > 3 && size > 4.2) {
    size -= 0.2;
    setFont(ctx, u, size, FELL, true);
    lines = wrap(ctx, quote, 76 * u);
  }
  lines = lines.slice(0, 3);
  const lead = size * 1.18;
  ctx.fillStyle = TEXT_INK;
  ctx.textAlign = 'center';
  lines.forEach((line, k) => ctx.fillText(line, 52 * u, (top + k * lead) * u));
  return top + (lines.length - 1) * lead;
}

// Nom à trouver, une case par lettre : lettres trouvées à l'encre, un trait pour chacune qui manque
function paintMask(ctx, u, mask, y, ink) {
  const cell = Math.min(8.4, 80 / Math.max(1, mask.length));
  const x0 = 52 - (cell * mask.length) / 2;
  setFont(ctx, u, Math.min(9.6, cell * 1.15), FELL);
  ctx.textAlign = 'center';
  ctx.fillStyle = ink;
  ctx.strokeStyle = alpha(ink, 0.45);
  ctx.lineWidth = 0.45 * u;
  ctx.lineCap = 'round';
  mask.forEach((char, k) => {
    const cx = x0 + cell * (k + 0.5);
    if (char === ' ') return;
    if (char) {
      ctx.fillText(char, cx * u, y * u);
      return;
    }
    ctx.beginPath();
    ctx.moveTo((cx - cell * 0.3) * u, (y + 0.6) * u);
    ctx.lineTo((cx + cell * 0.3) * u, (y + 0.6) * u);
    ctx.stroke();
  });
}

// Nom et famille sous le médaillon (page inscrite ou à trouver) ; renvoie le haut de la rangée du mélange (u),
// sous l'énigme
const NAME_Y = 62;

function familyLine(ctx, u, text, ink) {
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  fitFont(ctx, u, text, 80, 4.8, 3.8, CAPS, false, 0.04);
  ctx.fillText(text, 52 * u, (NAME_Y + 7) * u);
}

const quoteBottom = last => Math.max(89.5, last + 3.6);

// Tampon « Inscrite » à l'encre du chapitre, de biais au bord du médaillon
function stamp(ctx, u, color) {
  ctx.save();
  ctx.translate(67.5 * u, 49.5 * u);
  ctx.rotate(-0.16);
  rr(ctx, -11 * u, -3.6 * u, 22 * u, 7.2 * u, 1.4 * u);
  ctx.fillStyle = 'rgba(255, 250, 238, .85)';
  ctx.fill();
  ctx.strokeStyle = alpha(color, 0.9);
  ctx.lineWidth = 0.55 * u;
  ctx.stroke();
  rr(ctx, -10 * u, -2.6 * u, 20 * u, 5.2 * u, 1 * u);
  ctx.lineWidth = 0.22 * u;
  ctx.stroke();
  setFont(ctx, u, 4.2, CAPS, false, 0.12);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Inscrite', 0, 0.3 * u);
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

function paintFound(ctx, u, model, i, assets) {
  const { chapter, page } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, 1);
  const spot = vignette(ctx, u, style, 'found');
  glyph(ctx, page.emoji, MEDAL.x * u, MEDAL.y * u, MEDAL.r * 1.2 * u, assets.onReady);
  stamp(ctx, u, style.wax);
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  fitFont(ctx, u, page.name, 80, 10, 6, FELL);
  ctx.fillText(page.name, 52 * u, NAME_Y * u);
  familyLine(ctx, u, familyName(page.family), style.ink);
  // L'énigme reste sur la page trouvée, comme une épigraphe
  const top = page.riddle ? quoteBottom(paintQuote(ctx, u, page.riddle, NAME_Y + 14.5)) : 89.5;
  if (page.recipe) {
    const parts = page.recipe.map(name => ({ name, emoji: assets.emojiOf(name) }));
    recipeRow(ctx, u, parts, { name: page.name, emoji: page.emoji }, style.ink, assets.onReady, top);
  } else {
    setFont(ctx, u, 4.8, FELL, true);
    ctx.fillStyle = NOTE;
    ctx.textAlign = 'center';
    const first = ['Eau', 'Feu', 'Terre', 'Air'].includes(page.name);
    ctx.fillText(first ? T.firstElement : T.lostRecipe, 52 * u, (top + 6) * u);
  }
  folio(ctx, u, i);
  return { hotspots: [spot], label: T.found(page.name, familyName(page.family), page.riddle, page.recipe) };
}

// Marque-page du fil d'Ariane (bible, § 6.1) : un ruban de soie qui pend du haut de la page marquée
function bookmark(ctx, u) {
  const x = 74 * u;
  const w = 7 * u;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x + w, 0);
  ctx.lineTo(x + w, 21 * u);
  ctx.lineTo(x + w / 2, 17.6 * u);
  ctx.lineTo(x, 21 * u);
  ctx.closePath();
  ctx.fillStyle = '#B8322A';
  ctx.fill();
  ctx.strokeStyle = '#E3A93B';
  ctx.lineWidth = 0.7 * u;
  ctx.stroke();
}

// Boutons du bas d'une page à trouver (u) ; leur zone de toucher déborde un peu le dessin
const BTN = { y: 115.2, h: 8.6, pad: 1.6 };

function paintReach(ctx, u, model, i, assets) {
  const { chapter, page, revealed, aim, freeInk, tried, whisper = null } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, 0);
  if (page.marked) bookmark(ctx, u);
  const spot = vignette(ctx, u, style, 'reach');
  // (le pendu reviendra plus tard, en joker payant : en attendant, ni la page, ni ses traits, ni un bouton ne l'ouvrent)
  const hm = HANGMAN && page.hangman ? page.hangman : null;
  // Le grand « ? » tant qu'aucune pièce de l'illustration n'est gagnée
  if (!hm || !hm.emoji) bigQuestion(ctx, u, alpha(style.ink, 0.45));
  patchwork(ctx, u, page, style.ink, assets.onReady);
  // Lettres trouvées à leur place (pendu, ou première lettre donnée), un trait pour les autres
  const mask = hm ? hm.mask : [...Array(page.letters)].map((_, k) => (k === 0 && page.first ? page.first : null));
  paintMask(ctx, u, mask, NAME_Y, style.ink);
  familyLine(ctx, u, T.letters(familyName(page.family), page.letters), style.ink);
  // L'énigme de l'élément d'abord (sans énigme : les familles en toutes lettres)
  const top = quoteBottom(paintQuote(ctx, u, page.riddle || clueText(page.clue, page.groups), NAME_Y + 14.5));
  // L'équation suit l'Athanor : les éléments posés s'y inscrivent ; sinon l'ingrédient révélé par l'Encre
  const picked = assets.picked || [];
  const parts = page.clue.map((family, k) => {
    if (picked.length) return picked[k] ? { name: picked[k], emoji: assets.emojiOf(picked[k]) } : null;
    return k === 0 && revealed ? { name: revealed, emoji: assets.emojiOf(revealed) } : null;
  });
  // Après un premier essai sur la page, la famille de chaque ingrédient apparaît sous sa case ; avant, celle qu'un maître
  // a soufflée (Savoirs : bible, § 6.4), sous la première case, là où l'Encre pose son ingrédient
  const heard = whisper && whisper.family && !revealed ? whisper : null;
  const hints = page.riddle && tried ? familyHints(page.clue, page.groups) : heard ? [FAMILY_SHORT[heard.family] || 'élément'] : null;
  const ready = picked.length >= 2;
  const sealX = recipeRow(ctx, u, parts, null, style.ink, assets.onReady, top, hints, { wax: style.wax, ready });
  // Verdict du dernier essai visé (ou essais ratés), rétréci pour tenir sur une ligne ; sinon, qui a soufflé l'indice
  const note = aimNote(aim, page.misses, page.freeInkAfter) || (heard ? T.whispered(heard.who) : '');
  if (note) {
    ctx.fillStyle = aim && aim.right ? style.ink : NOTE;
    ctx.textAlign = 'center';
    fitFont(ctx, u, note, 80, 4.6, 3.4, FELL, true);
    ctx.fillText(note, 52 * u, (top + 20.8) * u);
  }
  // Deux boutons : le pendu (deviner le nom) et l'encre (révéler un ingrédient)
  const guessLabel = hm && hm.failedUntil ? '✎ Pendu perdu' : '✎ Deviner le nom';
  const hotspots = [{ ...spot, pulse: true, ...(hm ? { action: 'guess', data: page.id, label: T.openHangman } : {}) }];
  // (l'énigme, repérée sans être un bouton : le coach y pose la main quand le second ingrédient s'y lit)
  if (page.riddle) hotspots.push({ id: 'riddle', x: 12, y: NAME_Y + 9, w: 80, h: Math.max(6, top - NAME_Y - 10), mark: true });
  const button = (x, w, fill, text, color, raised) => {
    ctx.save();
    rr(ctx, x * u, BTN.y * u, w * u, BTN.h * u, (BTN.h / 2) * u);
    ctx.fillStyle = fill;
    if (raised) { ctx.shadowColor = 'rgba(0, 0, 0, .18)'; ctx.shadowOffsetY = 0.5 * u; }
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fitText(ctx, u, text, w - 4, 4.6, 3.4, FELL), (x + w / 2) * u, (BTN.y + BTN.h / 2 + 0.3) * u);
    ctx.textBaseline = 'alphabetic';
  };
  const zone = (id, x, w, rest) => ({ id, x, y: BTN.y - BTN.pad, w, h: BTN.h + 2 * BTN.pad, ...rest });
  const inkX = hm ? 54 : 28;
  const inkW = hm ? 37 : 48;
  if (hm) {
    // Les traits du nom ouvrent aussi le pendu : c'est là qu'on a envie de toucher
    hotspots.push({ id: 'blanks', x: 12, y: NAME_Y - 8, w: 80, h: 11, action: 'guess', data: page.id, label: T.guessBlanks });
    button(13, 37, style.color, guessLabel, style.ink, true);
    hotspots.push(zone('guess', 13, 37, { action: 'guess', data: page.id, label: T.guessButton }));
  }
  const told = revealed && whisper && whisper.ingredient === revealed ? T.whispered(whisper.who) : 'Encre utilisée';
  // (le Grimoire nu du tutoriel : ni bouton ni Encre, la page et son énigme seulement)
  if (!assets.bare) button(inkX, inkW, revealed ? VELLUM : freeInk ? '#B7862F' : INK, revealed ? told : freeInk ? '✒︎ Encre offerte' : `✒︎ Encre · ${assets.inkPrice} écus`, revealed ? FAINT : '#FFFDF8', !revealed);
  if (!revealed && !assets.bare) hotspots.push(zone('ink', inkX, inkW, { action: 'ink', data: page.id, label: freeInk ? T.inkFree : T.inkPaid(assets.inkPrice) }));
  // Le sceau mélange ce qui est posé dans l'Athanor (comme « Transmuer »)
  if (ready && sealX !== null) hotspots.push({ id: 'seal', x: sealX - 6, y: top - 0.5, w: 12, h: BOX + 1, action: 'seal', data: page.id, label: T.seal(picked) });
  folio(ctx, u, i);
  const start = page.first ? T.starts(page.first) : '';
  // (les familles en toutes lettres seulement après un essai, comme à l'écran ; la famille soufflée se dit à part)
  const clue = page.riddle ? T.riddle(page.riddle, tried ? ` ${clueText(page.clue, page.groups)}` : '') : clueText(page.clue, page.groups);
  const said = heard ? T.heard(FAMILY_WORDS[heard.family] || AN_ELEMENT) : '';
  return { hotspots, label: T.reach(familyName(page.family), page.letters, start, clue, note ? ` ${note}.` : '', said, revealed ? T.revealed(revealed) : '') };
}

function paintFar(ctx, u, model, i) {
  const { chapter, count, waiting = 0 } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, null);
  vignette(ctx, u, style, 'far');
  bigQuestion(ctx, u, FAINT);
  const far = T.far(count);
  // Pages à portée pas encore ouvertes : elles viennent une à une, les plus simples d'abord
  const queued = T.queued(waiting);
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  fitFont(ctx, u, waiting ? queued : far, 80, 8.4, 6, FELL);
  ctx.fillText(waiting ? queued : far, 52 * u, (NAME_Y + 1) * u);
  setFont(ctx, u, 5, FELL, true);
  ctx.fillStyle = TEXT_INK;
  const text = waiting
    ? T.queuedText
    : T.farText;
  const lines = wrap(ctx, text, 74 * u);
  lines.forEach((line, k) => ctx.fillText(line, 52 * u, (73 + k * 6.2) * u));
  if (waiting && count) {
    setFont(ctx, u, 4.8, CAPS);
    ctx.fillStyle = NOTE;
    ctx.fillText(T.beyond(far), 52 * u, (78 + lines.length * 6.2) * u);
  }
  folio(ctx, u, i);
  return { hotspots: [], label: waiting ? T.queuedLabel(queued, count, far) : T.farLabel(far) };
}

export { paintFound, paintReach, paintFar };
