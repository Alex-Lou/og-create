// Les pièces d'une page d'élément : le patchwork des familles, le grand point d'interrogation, les cases d'ingrédients
// et la ligne d'une recette.
import { shownPatches, PATCHES } from '../patchwork';
import { glyph } from './glyphs';
import { IVORY, rr } from './paper';
import { FELL, NOTE, FAINT, setFont, fitText, alpha } from './type';
import { MEDAL } from './ornaments';

// Pendu : les pièces gagnées de l'illustration, posées sur le médaillon de la page
function patchwork(ctx, u, page, ink, onReady) {
  const shown = shownPatches(page.id, page.hangman);
  if (!shown.size) return;
  const { x: vx, y: vy, r: vr } = MEDAL;
  const cell = (vr * 2) / 3, size = vr * 1.26;
  // Illustration entière (nom trouvé) : d'un seul tenant, sans coutures
  if (shown.size === PATCHES) {
    glyph(ctx, page.hangman.emoji, vx * u, vy * u, size * u, onReady);
    return;
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, vr * u, 0, Math.PI * 2);
  ctx.clip();
  // Pièces encore cachées : un petit « ? » chacune
  setFont(ctx, u, 4.6, FELL);
  ctx.fillStyle = alpha(ink, 0.35);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let k = 0; k < PATCHES; k++) {
    if (!shown.has(k)) ctx.fillText('?', (vx - vr + (k % 3 + 0.5) * cell) * u, (vy - vr + (Math.floor(k / 3) + 0.5) * cell) * u);
  }
  ctx.textBaseline = 'alphabetic';
  shown.forEach(k => {
    const x = vx - vr + (k % 3) * cell;
    const y = vy - vr + Math.floor(k / 3) * cell;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x * u, y * u, cell * u, cell * u);
    ctx.clip();
    ctx.fillStyle = IVORY;
    ctx.fillRect(x * u, y * u, cell * u, cell * u);
    glyph(ctx, page.hangman.emoji, vx * u, vy * u, size * u, onReady);
    ctx.restore();
    // Coutures du patchwork tant qu'il manque des pièces
    ctx.setLineDash([1 * u, 0.8 * u]);
    ctx.strokeStyle = alpha(ink, 0.35);
    ctx.lineWidth = 0.35 * u;
    ctx.strokeRect(x * u, y * u, cell * u, cell * u);
    ctx.setLineDash([]);
  });
  ctx.restore();
}

function bigQuestion(ctx, u, color) {
  setFont(ctx, u, 14, FELL);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText('?', MEDAL.x * u, (MEDAL.y + 4.6) * u);
}

// Case d'ingrédient (ou de résultat) : le dessin et son nom dessous, ou un « ? » et le mot de sa famille
const BOX = 12;

function iconBox(ctx, u, name, emoji, cx, top, ink, onReady, labelW, hint = null) {
  ctx.save();
  rr(ctx, (cx - BOX / 2) * u, top * u, BOX * u, BOX * u, 3.2 * u);
  ctx.textAlign = 'center';
  if (name) {
    ctx.shadowColor = 'rgba(74, 52, 38, .16)';
    ctx.shadowBlur = 1.6 * u;
    ctx.shadowOffsetY = 0.6 * u;
    ctx.fillStyle = IVORY;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = alpha(ink, 0.28);
    ctx.lineWidth = 0.4 * u;
    ctx.stroke();
    glyph(ctx, emoji, cx * u, (top + BOX / 2) * u, 8 * u, onReady);
    ctx.fillStyle = NOTE;
    ctx.fillText(fitText(ctx, u, name, labelW, 4.2, 3.2, FELL), cx * u, (top + BOX + 4.4) * u);
  } else {
    ctx.setLineDash([1.4 * u, 1.1 * u]);
    ctx.strokeStyle = FAINT;
    ctx.lineWidth = 0.4 * u;
    ctx.stroke();
    ctx.setLineDash([]);
    setFont(ctx, u, 6.4, FELL);
    ctx.fillStyle = FAINT;
    ctx.fillText('?', cx * u, (top + 8.2) * u);
    if (hint) {
      ctx.fillStyle = alpha(ink, 0.9);
      ctx.fillText(fitText(ctx, u, hint, labelW, 4, 3.2, FELL, true), cx * u, (top + BOX + 4.4) * u);
    }
  }
  ctx.restore();
}

// Positions des cases (ingrédients puis résultat) selon le nombre d'ingrédients : 2, 3 ou 4
const ROW_XS = { 2: [30, 52, 74], 3: [24, 41, 58, 79], 4: [17, 33, 49, 65, 85] };

// Rangée du mélange, cases en haut à top (u) ; hints : un mot sous chaque case vide d'ingrédient (familles), ou null
// seal : { wax, ready } pour peindre le « = » en sceau de l'Athanor ; renvoie le centre du sceau (en u)
function recipeRow(ctx, u, parts, result, ink, onReady, top, hints = null, seal = null) {
  const xs = ROW_XS[Math.min(4, Math.max(2, parts.length))];
  const labelW = xs[1] - xs[0] - 1;
  parts.slice(0, 4).forEach((part, k) => iconBox(ctx, u, part && part.name, part && part.emoji, xs[k], top, ink, onReady, labelW, hints && hints[k]));
  iconBox(ctx, u, result && result.name, result && result.emoji, xs[xs.length - 1], top, ink, onReady, labelW);
  const mid = top + BOX / 2;
  setFont(ctx, u, 6.4, FELL);
  ctx.fillStyle = FAINT;
  ctx.textAlign = 'center';
  for (let k = 0; k < xs.length - 2; k++) {
    ctx.fillText('+', ((xs[k] + xs[k + 1]) / 2) * u, (mid + 2) * u);
  }
  const sx = (xs[xs.length - 2] + xs[xs.length - 1]) / 2;
  if (!seal) {
    ctx.fillText('=', sx * u, (mid + 2) * u);
    return null;
  }
  // Sceau de cire : pâle tant qu'il manque un ingrédient, à la couleur du chapitre quand on peut sceller
  ctx.save();
  if (seal.ready) {
    ctx.beginPath();
    ctx.arc(sx * u, mid * u, 4.8 * u, 0, Math.PI * 2);
    ctx.fillStyle = alpha(seal.wax, 0.22);
    ctx.fill();
    ctx.shadowColor = 'rgba(74, 52, 38, .3)';
    ctx.shadowBlur = 1.2 * u;
    ctx.shadowOffsetY = 0.5 * u;
  }
  ctx.beginPath();
  ctx.arc(sx * u, mid * u, 3.6 * u, 0, Math.PI * 2);
  ctx.fillStyle = seal.ready ? seal.wax : '#E6DCC8';
  ctx.fill();
  ctx.restore();
  setFont(ctx, u, 5.8, FELL);
  ctx.fillStyle = seal.ready ? '#FFFDF8' : FAINT;
  ctx.textAlign = 'center';
  ctx.fillText('=', sx * u, (mid + 1.8) * u);
  return sx;
}

export { patchwork, bigQuestion, BOX, recipeRow };
