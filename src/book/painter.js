// Peinture des pages du Livre en Canvas 2D : une seule source pour la page au repos et la page qui tourne.
// Coordonnées en unités u = largeur / 100 ; la page fait 100 × 133,3 u.
// Chaque peinture renvoie { hotspots, label } : zones interactives (en u) et texte pour les lecteurs d'écran.
import { glyphSrc } from '@/utils/glyph';
import { roman } from '@/utils/roman';

export const CHAPTER_STYLE = {
  I: { color: '#CFE6F5', ink: '#2F6286', wax: '#5B8DB8' },
  II: { color: '#F2DDB0', ink: '#86591C', wax: '#B8792F' },
  III: { color: '#DCD3F2', ink: '#5A4A8C', wax: '#7D6BB5' },
  IV: { color: '#D3E8C8', ink: '#3E6B2E', wax: '#5E9446' },
  V: { color: '#F6D5C3', ink: '#9A4B2A', wax: '#C46E45' },
  VI: { color: '#D2DCE4', ink: '#3E5568', wax: '#62788C' },
  VII: { color: '#F1D3D8', ink: '#8C3D52', wax: '#B5637A' }
};

// Familles des ingrédients d'une page à portée, dites en mots (jamais l'élément lui-même)
const FAMILY_WORDS = {
  'Elements Fondamentaux': 'un élément premier',
  'Matériaux': 'un matériau',
  'Chimie': 'une substance chimique',
  'Physique': 'une force de la physique',
  'Phénomènes Naturels': 'un phénomène naturel',
  'Cosmos': 'un astre du cosmos',
  'Formations Naturelles': 'un paysage',
  'Flore': 'une plante',
  'Biologie': 'une chose du vivant',
  'Vie et Créatures': 'une créature',
  'Corps et Esprit': 'une part du corps ou de l’esprit',
  'Créations Humaines': 'une création humaine',
  'Histoire': 'un fragment d’histoire',
  'Technologie': 'une technologie',
  'Légendes': 'une légende'
};
export function clueText(clue) {
  const words = clue.map((family, i) => {
    const word = FAMILY_WORDS[family] || 'un élément';
    return clue.indexOf(family) < i ? word.replace(/^(un|une) /, '$1 autre ') : word;
  });
  if (words.length <= 1) return `Naît ${words[0] || 'd’un mélange'}.`;
  return `Mêle ${words.slice(0, -1).join(', ')} et ${words[words.length - 1]}.`;
}
const familyName = family => (family === 'Elements Fondamentaux' ? 'Éléments fondamentaux' : family);

/* ---------- Glyphes : emoji (texte) ou dessin du jeu (SVG chargé une fois) ---------- */
const drawings = new Map();
// Charge un dessin ; onReady est appelé quand il est prêt (la page est alors repeinte)
function drawing(src, onReady) {
  if (drawings.has(src)) return drawings.get(src);
  const entry = { img: null };
  drawings.set(src, entry);
  // Les dessins n'ont qu'un viewBox : sans taille explicite, un canvas les dessinerait en 300 × 150, déformés
  fetch(src)
    .then(response => (response.ok ? response.text() : Promise.reject(new Error(src))))
    .then(text => {
      const sized = /<svg[^>]*\swidth=/.test(text) ? text : text.replace('<svg', '<svg width="256" height="256"');
      const img = new Image();
      img.onload = () => { entry.img = img; if (onReady) onReady(); };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
    })
    .catch(() => {});
  return entry;
}
// Dessine le glyphe d'un élément (emoji ou dessin du jeu) centré en (cx, cy) ; aussi utilisé par le Monde
export function glyph(ctx, emoji, cx, cy, size, onReady, alpha = 1) {
  const src = glyphSrc(emoji);
  ctx.save();
  ctx.globalAlpha = alpha;
  if (src) {
    const entry = drawing(src, onReady);
    if (entry.img) ctx.drawImage(entry.img, cx - size / 2, cy - size / 2, size, size);
  } else {
    ctx.font = `${size * 0.86}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji || '❔', cx, cy + size * 0.04);
  }
  ctx.restore();
}

/* ---------- Papier ---------- */
let noiseTile = null;
export function paperNoise() {
  if (noiseTile) return noiseTile;
  noiseTile = document.createElement('canvas');
  noiseTile.width = noiseTile.height = 128;
  const g = noiseTile.getContext('2d');
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 70;
    img.data[i] = v; img.data[i + 1] = v * 0.9; img.data[i + 2] = v * 0.76; img.data[i + 3] = Math.random() * 16;
  }
  g.putImageData(img, 0, 0);
  return noiseTile;
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r * 0.46 : r;
    ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
}
const TITLE = 'Fraunces, Georgia, serif';
const TEXT = "Nunito, 'Trebuchet MS', sans-serif";
function setFont(ctx, u, size, weight, family, italic, spacing) {
  ctx.font = `${italic ? 'italic ' : ''}${weight} ${size * u}px ${family}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${(spacing || 0) * size * u}px`;
}
function wrap(ctx, text, max) {
  const lines = [];
  let line = '';
  for (const word of String(text).split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
function alpha(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
function paperBase(ctx, w, h, u) {
  ctx.fillStyle = '#FBF6EA';
  ctx.fillRect(0, 0, w, h);
  let g = ctx.createRadialGradient(w * 0.7, h * 0.18, 0, w * 0.7, h * 0.18, w);
  g.addColorStop(0, 'rgba(255, 255, 255, .6)');
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ctx.createPattern(paperNoise(), 'repeat');
  ctx.fillRect(0, 0, w, h);
  g = ctx.createRadialGradient(w / 2, h / 2, w * 0.5, w / 2, h / 2, w);
  g.addColorStop(0, 'rgba(130, 95, 60, 0)');
  g.addColorStop(1, 'rgba(130, 95, 60, .12)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  g = ctx.createLinearGradient(0, 0, 10 * u, 0);
  g.addColorStop(0, 'rgba(74, 52, 38, .24)');
  g.addColorStop(1, 'rgba(74, 52, 38, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 10 * u, h);
}
function frame(ctx, u, ink) {
  rr(ctx, 7 * u, 3.4 * u, 89.5 * u, 126.5 * u, 3 * u);
  ctx.strokeStyle = alpha(ink || '#4A3426', 0.22);
  ctx.lineWidth = 0.45 * u;
  ctx.stroke();
}
function folio(ctx, u, i) {
  setFont(ctx, u, 3.6, 500, TITLE, true);
  ctx.fillStyle = '#8A7262';
  ctx.textAlign = 'center';
  // Folio en chiffres romains tant qu'ils restent lisibles, puis en chiffres
  ctx.fillText(i <= 39 ? roman(i).toLowerCase() : String(i), 52 * u, 127 * u);
}
function pill(ctx, u, cx, cy, w, h, fill, text, color, size) {
  rr(ctx, (cx - w / 2) * u, (cy - h / 2) * u, w * u, h * u, (h / 2) * u);
  ctx.fillStyle = fill;
  ctx.fill();
  setFont(ctx, u, size || 3.6, 800, TEXT, false);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx * u, (cy + 0.2) * u);
  ctx.textBaseline = 'alphabetic';
}
function header(ctx, u, chapter, style, stars) {
  setFont(ctx, u, 3.2, 900, TEXT, false, 0.12);
  ctx.fillStyle = style.ink;
  ctx.textAlign = 'left';
  ctx.fillText(`${chapter.id} · ${chapter.name}`.toUpperCase(), 13 * u, 11 * u);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  if (stars !== null) {
    starPath(ctx, 90 * u, 9.9 * u, 2.4 * u);
    ctx.fillStyle = stars ? '#E3A93B' : 'rgba(189, 170, 148, .55)';
    ctx.fill();
  }
}
function vignette(ctx, u, style, mode) {
  const vx = 52, vy = 36, vr = 19;
  ctx.save();
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, (vr + 1.6) * u, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(74, 52, 38, .2)';
  ctx.shadowBlur = 3.4 * u;
  ctx.shadowOffsetY = 1.4 * u;
  ctx.fillStyle = '#FFFDF8';
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, vr * u, 0, Math.PI * 2);
  ctx.clip();
  if (mode === 'far') {
    ctx.fillStyle = '#F1E7D2';
    ctx.fillRect((vx - vr) * u, (vy - vr) * u, vr * 2 * u, vr * 2 * u);
    ctx.strokeStyle = 'rgba(189, 170, 148, .45)';
    ctx.lineWidth = 1.2 * u;
    for (let k = -vr * 2; k < vr * 2; k += 4) {
      ctx.beginPath();
      ctx.moveTo((vx + k) * u, (vy - vr) * u);
      ctx.lineTo((vx + k + vr * 2) * u, (vy + vr) * u);
      ctx.stroke();
    }
  } else {
    const g = ctx.createRadialGradient((vx - 6) * u, (vy - 8) * u, 0, vx * u, vy * u, vr * u);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(1, style.color);
    ctx.fillStyle = g;
    ctx.fillRect((vx - vr) * u, (vy - vr) * u, vr * 2 * u, vr * 2 * u);
  }
  ctx.restore();
  return { id: 'vignette', x: vx - vr, y: vy - vr, w: vr * 2, h: vr * 2 };
}
function bigQuestion(ctx, u, color) {
  setFont(ctx, u, 16, 700, TITLE, false);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText('?', 52 * u, 41.6 * u);
}
function iconBox(ctx, u, name, emoji, cx, top, ink, onReady) {
  const s = 13;
  ctx.save();
  rr(ctx, (cx - s / 2) * u, top * u, s * u, s * u, 3.6 * u);
  if (name) {
    ctx.shadowColor = 'rgba(74, 52, 38, .16)';
    ctx.shadowBlur = 1.6 * u;
    ctx.shadowOffsetY = 0.6 * u;
    ctx.fillStyle = '#FFFDF8';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = alpha(ink, 0.28);
    ctx.lineWidth = 0.4 * u;
    ctx.stroke();
    glyph(ctx, emoji, cx * u, (top + s / 2) * u, 8.6 * u, onReady);
    setFont(ctx, u, 2.9, 800, TEXT, false);
    ctx.fillStyle = '#8A7262';
    ctx.textAlign = 'center';
    const label = name.length > 12 ? `${name.slice(0, 11)}…` : name;
    ctx.fillText(label, cx * u, (top + s + 4.2) * u);
  } else {
    ctx.setLineDash([1.4 * u, 1.1 * u]);
    ctx.strokeStyle = '#BDAA94';
    ctx.lineWidth = 0.4 * u;
    ctx.stroke();
    ctx.setLineDash([]);
    setFont(ctx, u, 6.4, 700, TITLE, false);
    ctx.fillStyle = '#BDAA94';
    ctx.textAlign = 'center';
    ctx.fillText('?', cx * u, (top + 9) * u);
  }
  ctx.restore();
}
function recipeRow(ctx, u, parts, result, ink, onReady) {
  const [a, b, c] = parts;
  const xs = parts.length > 2 ? [24, 41, 58, 79] : [30, 52, 74];
  iconBox(ctx, u, a && a.name, a && a.emoji, xs[0], 89, ink, onReady);
  iconBox(ctx, u, b && b.name, b && b.emoji, xs[1], 89, ink, onReady);
  if (parts.length > 2) iconBox(ctx, u, c && c.name, c && c.emoji, xs[2], 89, ink, onReady);
  iconBox(ctx, u, result && result.name, result && result.emoji, xs[xs.length - 1], 89, ink, onReady);
  setFont(ctx, u, 5.6, 400, TITLE, false);
  ctx.fillStyle = '#BDAA94';
  ctx.textAlign = 'center';
  for (let k = 0; k < xs.length - 1; k++) {
    ctx.fillText(k === xs.length - 2 ? '=' : '+', ((xs[k] + xs[k + 1]) / 2) * u, 97.6 * u);
  }
}

/* ---------- Pages ---------- */
function paintFound(ctx, u, model, i, assets) {
  const { chapter, page } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, 1);
  const spot = vignette(ctx, u, style, 'found');
  glyph(ctx, page.emoji, 52 * u, 36 * u, 22 * u, assets.onReady);
  ctx.save();
  ctx.translate(66 * u, 52 * u);
  ctx.rotate(-0.14);
  pill(ctx, u, 0, 0, 22, 6, style.ink, 'INSCRITE', '#FFFDF8', 3);
  ctx.restore();
  setFont(ctx, u, page.name.length > 14 ? 7 : 8.6, 600, TITLE, false);
  ctx.fillStyle = '#4A3426';
  ctx.textAlign = 'center';
  ctx.fillText(page.name, 52 * u, 67 * u);
  setFont(ctx, u, 3.2, 900, TEXT, false, 0.1);
  ctx.fillStyle = style.ink;
  ctx.fillText(familyName(page.family).toUpperCase(), 52 * u, 74 * u);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  if (page.recipe) {
    const parts = page.recipe.map(name => ({ name, emoji: assets.emojiOf(name) }));
    recipeRow(ctx, u, parts, { name: page.name, emoji: page.emoji }, style.ink, assets.onReady);
  } else {
    setFont(ctx, u, 4.4, 400, TITLE, true);
    ctx.fillStyle = '#8A7262';
    const first = ['Eau', 'Feu', 'Terre', 'Air'].includes(page.name);
    ctx.fillText(first ? 'Élément premier : tout commence ici.' : 'Né d’un mélange dont la trace s’est perdue.', 52 * u, 96 * u);
  }
  folio(ctx, u, i);
  return { hotspots: [spot], label: `${page.name}, inscrite. Famille ${familyName(page.family)}.${page.recipe ? ` Née de ${page.recipe.join(' et ')}.` : ''}` };
}

function paintReach(ctx, u, model, i, assets) {
  const { chapter, page, revealed } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, 0);
  const spot = vignette(ctx, u, style, 'reach');
  bigQuestion(ctx, u, alpha(style.ink, 0.45));
  setFont(ctx, u, 7, 600, TITLE, false, 0.22);
  ctx.fillStyle = '#BDAA94';
  ctx.textAlign = 'center';
  const blanks = '_'.repeat(Math.min(page.letters, 14));
  ctx.fillText(blanks, 52 * u, 66 * u);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  setFont(ctx, u, 3.2, 900, TEXT, false, 0.1);
  ctx.fillStyle = style.ink;
  ctx.fillText(`${familyName(page.family).toUpperCase()} · ${page.letters} LETTRES`, 52 * u, 73.5 * u);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  setFont(ctx, u, 4.3, 400, TITLE, true);
  ctx.fillStyle = '#8A7262';
  wrap(ctx, `« ${clueText(page.clue)} »`, 74 * u).slice(0, 2).forEach((line, k) => ctx.fillText(line, 52 * u, (80.5 + k * 5.6) * u));
  const parts = page.clue.map((family, k) => (k === 0 && revealed ? { name: revealed, emoji: assets.emojiOf(revealed) } : null));
  recipeRow(ctx, u, parts, null, style.ink, assets.onReady);
  const hotspots = [{ ...spot, pulse: true }];
  ctx.save();
  rr(ctx, 28 * u, 115.5 * u, 48 * u, 8 * u, 4 * u);
  ctx.fillStyle = revealed ? '#F1E7D2' : '#4A3426';
  if (!revealed) { ctx.shadowColor = 'rgba(0, 0, 0, .18)'; ctx.shadowOffsetY = 0.5 * u; }
  ctx.fill();
  ctx.restore();
  setFont(ctx, u, 3.5, 900, TEXT, false);
  ctx.fillStyle = revealed ? '#BDAA94' : '#FFFDF8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(revealed ? 'Encre utilisée' : `✒︎ Encre · ${assets.inkPrice} écus`, 52 * u, 119.7 * u);
  ctx.textBaseline = 'alphabetic';
  if (!revealed) hotspots.push({ id: 'ink', x: 28, y: 115.5, w: 48, h: 8, action: 'ink', data: page.id, label: `Encre : révéler un ingrédient pour ${assets.inkPrice} écus` });
  folio(ctx, u, i);
  return { hotspots, label: `Page à trouver : ${familyName(page.family)}, ${page.letters} lettres. ${clueText(page.clue)}${revealed ? ` Un ingrédient : ${revealed}.` : ''}` };
}

function paintFar(ctx, u, model, i) {
  const { chapter, count } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, null);
  vignette(ctx, u, style, 'far');
  bigQuestion(ctx, u, '#BDAA94');
  setFont(ctx, u, 7.6, 600, TITLE, false);
  ctx.fillStyle = '#4A3426';
  ctx.textAlign = 'center';
  ctx.fillText(`${count} page${count > 1 ? 's' : ''} lointaine${count > 1 ? 's' : ''}`, 52 * u, 67 * u);
  setFont(ctx, u, 4.3, 400, TITLE, true);
  ctx.fillStyle = '#8A7262';
  wrap(ctx, 'Il te manque encore des ingrédients pour les tenter. Chaque découverte en rapproche quelques-unes.', 72 * u)
    .forEach((line, k) => ctx.fillText(line, 52 * u, (76 + k * 5.8) * u));
  folio(ctx, u, i);
  return { hotspots: [], label: `${count} pages encore lointaines dans ce chapitre.` };
}

function paintChapter(ctx, u, model, i, assets) {
  const { chapter } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  ctx.save();
  ctx.beginPath();
  ctx.arc(52 * u, 34 * u, 16.4 * u, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(74, 52, 38, .18)';
  ctx.shadowBlur = 3 * u;
  ctx.shadowOffsetY = 1.2 * u;
  ctx.fillStyle = '#FFFDF8';
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(52 * u, 34 * u, 15 * u, 0, Math.PI * 2);
  ctx.fillStyle = chapter.open ? style.color : '#EFE6D3';
  ctx.fill();
  setFont(ctx, u, chapter.id.length > 2 ? 10 : 13, 700, TITLE, false);
  ctx.fillStyle = chapter.open ? style.ink : '#BDAA94';
  ctx.textAlign = 'center';
  ctx.fillText(chapter.id, 52 * u, 38.6 * u);
  setFont(ctx, u, 3.3, 900, TEXT, false, 0.16);
  ctx.fillStyle = style.ink;
  ctx.fillText(`CHAPITRE ${chapter.id}`, 52 * u, 59 * u);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  setFont(ctx, u, 8.6, 700, TITLE, false);
  ctx.fillStyle = '#4A3426';
  const lines = wrap(ctx, chapter.name, 78 * u);
  lines.forEach((line, k) => ctx.fillText(line, 52 * u, (69 + k * 9) * u));
  setFont(ctx, u, 4.1, 400, TITLE, true);
  ctx.fillStyle = '#8A7262';
  const top = 69 + lines.length * 9;
  wrap(ctx, assets.familiesOf(chapter.id).map(familyName).join(' · '), 76 * u).forEach((line, k) => ctx.fillText(line, 52 * u, (top + k * 5.6) * u));
  if (chapter.open) {
    pill(ctx, u, 52, 106, 50, 8.4, alpha(style.color, 0.95), `${chapter.found} / ${chapter.total} pages inscrites`, '#4A3426', 3.4);
    const reach = chapter.pages.filter(p => p.status === 'reach').length;
    setFont(ctx, u, 3.4, 800, TEXT, false);
    ctx.fillStyle = '#8A7262';
    ctx.fillText(reach ? `${reach} à portée de mélange` : 'Rien à portée pour l’instant', 52 * u, 116.5 * u);
  } else {
    pill(ctx, u, 52, 106, 56, 8.4, '#EFE6D3', `Scellé · encore ${Math.max(0, chapter.need - assets.stars)} découvertes`, '#8A7262', 3.4);
  }
  folio(ctx, u, i);
  return { hotspots: [], label: `Chapitre ${chapter.id}, ${chapter.name}. ${chapter.open ? `${chapter.found} pages inscrites sur ${chapter.total}.` : `Scellé : encore ${Math.max(0, chapter.need - assets.stars)} découvertes.`}` };
}

function paintToc(ctx, u, model, index, assets) {
  frame(ctx, u);
  const hotspots = [];
  setFont(ctx, u, 10, 700, TITLE, false);
  ctx.fillStyle = '#4A3426';
  ctx.textAlign = 'center';
  ctx.fillText('Le Livre', 52 * u, 20 * u);
  setFont(ctx, u, 4.2, 400, TITLE, true);
  ctx.fillStyle = '#8A7262';
  ctx.fillText(`Grimoire d’alchimie · ${assets.stars} découverte${assets.stars > 1 ? 's' : ''}`, 52 * u, 27.5 * u);
  model.chapters.forEach((chapter, k) => {
    const style = CHAPTER_STYLE[chapter.id];
    const y = 33 + k * 12.6;
    rr(ctx, 12 * u, y * u, 80 * u, 11 * u, 3.2 * u);
    ctx.fillStyle = chapter.open ? alpha(style.color, 0.75) : '#F1E7D2';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(18.6 * u, (y + 5.5) * u, 3.8 * u, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFDF8';
    ctx.fill();
    setFont(ctx, u, chapter.id.length > 2 ? 2.8 : 3.6, 700, TITLE, false);
    ctx.fillStyle = chapter.open ? style.ink : '#BDAA94';
    ctx.textAlign = 'center';
    ctx.fillText(chapter.id, 18.6 * u, (y + 6.8) * u);
    setFont(ctx, u, 3.6, 900, TEXT, false);
    ctx.fillStyle = chapter.open ? '#4A3426' : '#8A7262';
    ctx.textAlign = 'left';
    ctx.fillText(chapter.name, 25 * u, (y + 4.9) * u);
    rr(ctx, 25 * u, (y + 6.8) * u, 50 * u, 1.4 * u, 0.7 * u);
    ctx.fillStyle = 'rgba(255, 253, 248, .9)';
    ctx.fill();
    if (chapter.open && chapter.found) {
      rr(ctx, 25 * u, (y + 6.8) * u, Math.max(1.4, (50 * chapter.found) / chapter.total) * u, 1.4 * u, 0.7 * u);
      ctx.fillStyle = style.ink;
      ctx.fill();
    }
    setFont(ctx, u, 3.1, 900, TEXT, false);
    ctx.textAlign = 'right';
    ctx.fillStyle = chapter.open ? '#4A3426' : '#8A7262';
    ctx.fillText(chapter.open ? `${chapter.found}/${chapter.total}` : `🔒 ${chapter.need}`, 89 * u, (y + 7) * u);
    hotspots.push({ id: `toc-${chapter.id}`, x: 12, y, w: 80, h: 11, action: 'goto', data: model.chapterIndex[chapter.id], label: `Chapitre ${chapter.id}, ${chapter.name}${chapter.open ? '' : ', scellé'}` });
  });
  setFont(ctx, u, 3.3, 700, TEXT, false);
  ctx.fillStyle = '#8A7262';
  ctx.textAlign = 'center';
  ctx.fillText('Glisse la page du doigt, ou touche son bord.', 52 * u, 125 * u);
  return { hotspots, label: `Sommaire du Livre. ${model.chapters.map(c => `Chapitre ${c.id}, ${c.name}`).join('. ')}.` };
}

// model : { type: 'toc' | 'chapter' | 'found' | 'reach' | 'far', … } ; assets : { emojiOf, onReady, inkPrice, stars, familiesOf }
export function paintPage(model, index, ctx, w, h, assets) {
  const u = w / 100;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  paperBase(ctx, w, h, u);
  const painters = { toc: paintToc, chapter: paintChapter, found: paintFound, reach: paintReach, far: paintFar };
  const result = painters[model.type](ctx, u, model, index, assets);
  ctx.restore();
  return result;
}
