// Peinture des pages du Livre en Canvas 2D : une seule source pour la page au repos et la page qui tourne.
// Coordonnées en unités u = largeur / 100 ; la page fait 100 × 133,3 u.
// Chaque peinture renvoie { hotspots, label } : zones interactives (en u) et texte pour les lecteurs d'écran.
import { aimNote } from './aim';
import { glyphSrc } from '@/utils/glyph';
import { roman } from '@/utils/roman';
import { shownPatches, PATCHES } from './patchwork';
import { CHAPTER_STYLE, BOOK_TITLE, tintOfFamily } from './chapters';
import { SIGILS, ORNAMENTS, GOLD } from './grimoire';

// Le pendu (deviner le nom lettre par lettre) : en réserve, il reviendra en joker payant
const HANGMAN = false;

// Les pages des chapitres suivent leurs couleurs (book/chapters.js)
export { CHAPTER_STYLE };

// Familles dites en mots : ingrédients d'une page à portée, et type de l'élément dans le pendu
export const FAMILY_WORDS = {
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
// Les mêmes, en un mot, sous les cases vides d'une page (après un premier essai)
const FAMILY_SHORT = {
  'Elements Fondamentaux': 'premier',
  'Matériaux': 'matériau',
  'Chimie': 'chimie',
  'Physique': 'physique',
  'Phénomènes Naturels': 'phénomène',
  'Cosmos': 'astre',
  'Formations Naturelles': 'paysage',
  'Flore': 'plante',
  'Biologie': 'vivant',
  'Vie et Créatures': 'créature',
  'Corps et Esprit': 'corps, esprit',
  'Créations Humaines': 'création',
  'Histoire': 'histoire',
  'Technologie': 'technique',
  'Légendes': 'légende'
};
// Mot de chaque case : la famille, ou « le même » pour un ingrédient déjà compté (groups identiques)
export function familyHints(clue, groups) {
  const ids = groups && groups.length === clue.length ? groups : clue.map((_, i) => i);
  return clue.map((family, i) => (ids.indexOf(ids[i]) < i ? 'le même' : FAMILY_SHORT[family] || 'élément'));
}
const TIMES = ['', '', 'deux', 'trois', 'quatre'];
// groups : même numéro = même ingrédient (Eau + Eau → [0, 0]) ; sans eux, chaque ingrédient compte à part
export function clueText(clue, groups) {
  const ids = groups && groups.length === clue.length ? groups : clue.map((_, i) => i);
  const parts = [];
  ids.forEach((id, i) => {
    const part = parts.find(p => p.id === id);
    if (part) part.count++;
    else parts.push({ id, family: clue[i], count: 1 });
  });
  const words = parts.map((part, k) => {
    const word = FAMILY_WORDS[part.family] || 'un élément';
    if (part.count > 1) return `${TIMES[part.count]} fois ${word.replace(/^un /, 'le même ').replace(/^une /, 'la même ')}`;
    // « un autre » : un ingrédient différent d'une famille déjà nommée
    return parts.findIndex(p => p.family === part.family) < k ? word.replace(/^(un|une) /, '$1 autre ') : word;
  });
  if (clue.length <= 1) return `Naît ${words[0] || 'd’un mélange'}.`;
  if (words.length === 1) return `Mêle ${words[0]}.`;
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
  const load = url => {
    const img = new Image();
    img.onload = () => { entry.img = img; if (onReady) onReady(); };
    img.src = url;
  };
  // Icônes de l'interface (utils/icons.js) : déjà en mémoire, à leur taille
  if (src.startsWith('data:')) {
    load(src);
    return entry;
  }
  // Les dessins n'ont qu'un viewBox : sans taille explicite, un canvas les dessinerait en 300 × 150, déformés
  fetch(src)
    .then(response => (response.ok ? response.text() : Promise.reject(new Error(src))))
    .then(text => {
      // (dessiné en grand pour rester net une fois agrandi : celui qui a un viewBox perd sa petite taille)
      const sized = text.replace(/<svg\b([^>]*)>/, (tag, attrs) => (/\sviewBox=/.test(attrs)
        ? `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, '')} width="256" height="256">`
        : /\swidth=/.test(attrs) ? tag : `<svg${attrs} width="256" height="256">`));
      load(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`);
    })
    .catch(() => {});
  return entry;
}
// Sortie du Livre ou de l'île : les dessins chargés sont libérés (ils se rechargeront au besoin)
export function clearDrawings() {
  drawings.clear();
}
// Dessine le glyphe d'un élément (emoji ou dessin du jeu) centré en (cx, cy) ; aussi utilisé par le Monde
export function glyph(ctx, emoji, cx, cy, size, onReady, alpha = 1) {
  const src = glyphSrc(emoji || 'ui:unknown');
  ctx.save();
  ctx.globalAlpha = alpha;
  if (src) {
    const entry = drawing(src, onReady);
    if (entry.img) ctx.drawImage(entry.img, cx - size / 2, cy - size / 2, size, size);
  } else {
    ctx.font = `${size * 0.86}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, cx, cy + size * 0.04);
  }
  ctx.restore();
}

/* ---------- Papier ---------- */
// Parchemin : fond des pages, verso des feuilles qui tournent (moteur), ivoire des médaillons et vélin des cases éteintes
export const PAPER = '#F5EAD0';
export const PAPER_BACK = '#EADBBA';
const IVORY = '#FFF8E8';
const VELLUM = '#EEE1C3';
// Hasard reproductible : chaque page garde ses fibres et ses taches d'une peinture à l'autre
function seeded(seed) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Chemins SVG des ornements et des sigles, préparés une fois
const paths = new Map();
const path2d = d => {
  if (!paths.has(d)) paths.set(d, new Path2D(d));
  return paths.get(d);
};
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
// Polices de l'intérieur (déclarées dans BookView.vue) : IM Fell English, ses petites capitales, et une fraktur
// pour les lettrines. Une seule graisse : jamais de gras (le navigateur l'imiterait mal).
const FELL = "'IM Fell English', Georgia, 'Times New Roman', serif";
const CAPS = "'IM Fell English SC', 'IM Fell English', Georgia, serif";
const GOTHIC = "UnifrakturMaguntia, 'IM Fell English', Georgia, serif";
// Encres : titres, texte, notes (lisibles sur le parchemin) ; les blancs et les traits ne servent qu'au décor
const INK = '#3E2A1E';
const TEXT_INK = '#523B2C';
const NOTE = '#6E5646';
const FAINT = '#B3A08A';
// Le canvas ne dessine une police qu'une fois chargée : le Livre repeint ses pages quand elles sont prêtes
export function bookFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();
  const faces = [`16px ${FELL}`, `italic 16px ${FELL}`, `16px ${CAPS}`, `16px ${GOTHIC}`];
  return Promise.all(faces.map(face => document.fonts.load(face))).then(() => {}, () => {});
}
// Corps en u, interlettrage en fraction du corps
function setFont(ctx, u, size, family, italic = false, spacing = 0) {
  ctx.font = `${italic ? 'italic ' : ''}400 ${size * u}px ${family}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${spacing * size * u}px`;
}
// Le plus grand corps, de size à min, qui fait tenir text sur max u
function fitFont(ctx, u, text, max, size, min, family, italic = false, spacing = 0) {
  let s = size;
  setFont(ctx, u, s, family, italic, spacing);
  while (s > min && ctx.measureText(text).width > max * u) {
    s -= 0.2;
    setFont(ctx, u, s, family, italic, spacing);
  }
  return s;
}
// Comme fitFont, puis coupé d'une ellipse s'il dépasse encore
function fitText(ctx, u, text, max, size, min, family, italic = false) {
  fitFont(ctx, u, text, max, size, min, family, italic);
  if (ctx.measureText(text).width <= max * u) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > max * u) cut = cut.slice(0, -1);
  return `${cut.trimEnd()}…`;
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
// Parchemin vieilli : grain, fibres, piqûres et parfois une auréole (propres à chaque page), bords brunis,
// et l'ombre du pli côté reliure (à gauche d'une page de droite, à droite d'une page de gauche)
function paperBase(ctx, w, h, u, side = 'right', seed = 0) {
  const rand = seeded(seed + 1);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  let g = ctx.createRadialGradient(w * 0.62, h * 0.22, 0, w * 0.62, h * 0.22, w * 1.05);
  g.addColorStop(0, 'rgba(255, 252, 240, .7)');
  g.addColorStop(1, 'rgba(255, 252, 240, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ctx.createPattern(paperNoise(), 'repeat');
  ctx.fillRect(0, 0, w, h);
  // Fibres
  ctx.lineCap = 'round';
  for (let k = 0; k < 34; k++) {
    const x = rand() * w, y = rand() * h, len = (4 + rand() * 14) * u, a = rand() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + (rand() - 0.5) * 2 * u, y + Math.sin(a) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.strokeStyle = `rgba(${rand() < 0.5 ? '140, 104, 60' : '255, 250, 235'}, ${0.07 + rand() * 0.08})`;
    ctx.lineWidth = (0.12 + rand() * 0.18) * u;
    ctx.stroke();
  }
  // Piqûres (rousseurs), plutôt près des bords
  for (let k = 0, n = 4 + Math.floor(rand() * 9); k < n; k++) {
    const edge = rand() < 0.5;
    const x = edge ? (rand() < 0.5 ? rand() * 12 : 88 + rand() * 12) * u : rand() * w;
    const y = edge ? rand() * h : (rand() < 0.5 ? rand() * 14 : 119 + rand() * 14) * u;
    ctx.beginPath();
    ctx.arc(x, y, (0.2 + rand() * 0.6) * u, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(150, 96, 44, ${0.08 + rand() * 0.12})`;
    ctx.fill();
  }
  // Une page sur trois garde l'auréole d'une goutte, très pâle
  if (rand() < 0.34) {
    const x = (18 + rand() * 64) * u, y = (20 + rand() * 94) * u, r = (5 + rand() * 7) * u;
    g = ctx.createRadialGradient(x, y, r * 0.7, x, y, r);
    g.addColorStop(0, 'rgba(150, 100, 50, 0)');
    g.addColorStop(0.85, 'rgba(150, 100, 50, .07)');
    g.addColorStop(1, 'rgba(150, 100, 50, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Bords brunis
  g = ctx.createRadialGradient(w / 2, h / 2, w * 0.42, w / 2, h / 2, w * 0.98);
  g.addColorStop(0, 'rgba(120, 78, 36, 0)');
  g.addColorStop(1, 'rgba(120, 78, 36, .2)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const outer = side === 'left' ? 0 : w;
  g = ctx.createLinearGradient(outer, 0, side === 'left' ? 3 * u : w - 3 * u, 0);
  g.addColorStop(0, 'rgba(110, 66, 28, .16)');
  g.addColorStop(1, 'rgba(110, 66, 28, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(side === 'left' ? 0 : w - 3 * u, 0, 3 * u, h);
  // Pli de la reliure
  const spine = side === 'left' ? w : 0;
  g = ctx.createLinearGradient(spine, 0, side === 'left' ? w - 11 * u : 11 * u, 0);
  g.addColorStop(0, 'rgba(74, 46, 26, .3)');
  g.addColorStop(0.35, 'rgba(74, 46, 26, .1)');
  g.addColorStop(1, 'rgba(74, 46, 26, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(side === 'left' ? w - 11 * u : 0, 0, 11 * u, h);
}
// Un ornement doré (chemin d'ORNAMENTS ou d'un sigle) posé en (x, y) u, tourné de rot, à l'échelle k
function ornament(ctx, u, d, x, y, rot, k, fill, stroke) {
  ctx.save();
  ctx.translate(x * u, y * u);
  ctx.rotate(rot);
  ctx.scale(k * u, k * u);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(path2d(d));
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.22;
    ctx.stroke(path2d(d));
  }
  ctx.restore();
}
// Sigle de planète d'un chapitre, tracé en (cx, cy) u sur size u
function sigil(ctx, u, id, cx, cy, size, color, width = 2) {
  const k = size / 24;
  ctx.save();
  ctx.translate((cx - size / 2) * u, (cy - size / 2) * u);
  ctx.scale(k * u, k * u);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(path2d(SIGILS[id].d));
  ctx.restore();
}
// Cadre enluminé : filet d'encre, filet d'or, fleurons aux coins et losanges au milieu des bords
function frame(ctx, u, ink) {
  const color = ink || '#4A3426';
  rr(ctx, 7 * u, 3.4 * u, 89.5 * u, 126.5 * u, 3 * u);
  ctx.strokeStyle = alpha(color, 0.32);
  ctx.lineWidth = 0.5 * u;
  ctx.stroke();
  rr(ctx, 8.3 * u, 4.7 * u, 86.9 * u, 123.9 * u, 2.2 * u);
  ctx.strokeStyle = alpha(GOLD.base, 0.6);
  ctx.lineWidth = 0.28 * u;
  ctx.stroke();
  const gold = alpha(GOLD.base, 0.92), edge = alpha(GOLD.edge, 0.55);
  ornament(ctx, u, ORNAMENTS.corner, 9.2, 5.6, 0, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.corner, 94.3, 5.6, Math.PI / 2, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.corner, 94.3, 127.7, Math.PI, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.corner, 9.2, 127.7, -Math.PI / 2, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.diamond, 51.75, 3.4, 0, 1, gold, edge);
  ornament(ctx, u, ORNAMENTS.diamond, 51.75, 129.9, 0, 1, gold, edge);
}
function folio(ctx, u, i) {
  setFont(ctx, u, 4.4, FELL, true);
  ctx.fillStyle = NOTE;
  ctx.textAlign = 'center';
  // Folio en chiffres romains tant qu'ils restent lisibles, puis en chiffres ; un point doré de chaque côté
  const text = i <= 39 ? roman(i).toLowerCase() : String(i);
  ctx.fillText(text, 52 * u, 127.4 * u);
  const half = ctx.measureText(text).width / (2 * u) + 2.6;
  ctx.fillStyle = alpha(GOLD.base, 0.8);
  [-half, half].forEach(dx => {
    ctx.beginPath();
    ctx.arc((52 + dx) * u, 126.1 * u, 0.6 * u, 0, Math.PI * 2);
    ctx.fill();
  });
}
// Filet d'or à la hauteur y, de a à b (u), coupé d'un losange au milieu si diamond
function rule(ctx, u, y, a, b, diamond = false) {
  const mid = (a + b) / 2, gap = diamond ? 3.4 : 0;
  ctx.strokeStyle = alpha(GOLD.base, 0.7);
  ctx.lineWidth = 0.3 * u;
  [[a, mid - gap], [mid + gap, b]].forEach(([x0, x1]) => {
    ctx.beginPath();
    ctx.moveTo(x0 * u, y * u);
    ctx.lineTo(x1 * u, y * u);
    ctx.stroke();
  });
  if (diamond) ornament(ctx, u, ORNAMENTS.diamond, mid, y, 0, 1, alpha(GOLD.base, 0.92), alpha(GOLD.edge, 0.55));
}
// Titre courant : le chapitre en petites capitales sur un filet d'or ; à droite, l'étoile de la page ou un repère
function header(ctx, u, chapter, style, stars, mark = null) {
  ctx.fillStyle = style.ink;
  ctx.textAlign = 'left';
  ctx.fillText(fitText(ctx, u, `${chapter.id} · ${chapter.name}`, mark ? 54 : 70, 4.8, 3.8, CAPS), 13 * u, 11.4 * u);
  if (mark) {
    setFont(ctx, u, 4.4, CAPS);
    ctx.fillStyle = NOTE;
    ctx.textAlign = 'right';
    ctx.fillText(mark, 91 * u, 11.4 * u);
  } else if (stars !== null) {
    starPath(ctx, 89.6 * u, 9.8 * u, 2.5 * u);
    ctx.fillStyle = stars ? '#E3A93B' : 'rgba(179, 160, 138, .6)';
    ctx.fill();
  }
  ctx.strokeStyle = alpha(GOLD.base, 0.5);
  ctx.lineWidth = 0.25 * u;
  ctx.beginPath();
  ctx.moveTo(13 * u, 14.2 * u);
  ctx.lineTo(91 * u, 14.2 * u);
  ctx.stroke();
}
// Médaillon des pages d'élément : centre et rayon (u)
const MEDAL = { x: 52, y: 35, r: 15 };
function vignette(ctx, u, style, mode) {
  const { x: vx, y: vy, r: vr } = MEDAL;
  ctx.save();
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, (vr + 1.6) * u, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(74, 52, 38, .2)';
  ctx.shadowBlur = 3.4 * u;
  ctx.shadowOffsetY = 1.4 * u;
  ctx.fillStyle = IVORY;
  ctx.fill();
  ctx.restore();
  // Médaillon serti d'or : filet plein et couronne de points
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, (vr + 2.5) * u, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(GOLD.base, 0.75);
  ctx.lineWidth = 0.35 * u;
  ctx.stroke();
  ctx.fillStyle = alpha(GOLD.base, 0.7);
  for (let k = 0; k < 32; k++) {
    const a = (k / 32) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc((vx + Math.cos(a) * (vr + 3.5)) * u, (vy + Math.sin(a) * (vr + 3.5)) * u, 0.3 * u, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, vr * u, 0, Math.PI * 2);
  ctx.clip();
  if (mode === 'far') {
    ctx.fillStyle = VELLUM;
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
    const g = ctx.createRadialGradient((vx - 5) * u, (vy - 6.5) * u, 0, vx * u, vy * u, vr * u);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(1, style.color);
    ctx.fillStyle = g;
    ctx.fillRect((vx - vr) * u, (vy - vr) * u, vr * 2 * u, vr * 2 * u);
  }
  ctx.restore();
  return { id: 'vignette', x: vx - vr, y: vy - vr, w: vr * 2, h: vr * 2 };
}
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
    ctx.fillText(first ? 'Élément premier : tout commence ici.' : 'Né d’un mélange dont la trace s’est perdue.', 52 * u, (top + 6) * u);
  }
  folio(ctx, u, i);
  return { hotspots: [spot], label: `${page.name}, inscrite. Famille ${familyName(page.family)}.${page.riddle ? ` « ${page.riddle} »` : ''}${page.recipe ? ` Née de ${page.recipe.join(' et ')}.` : ''}` };
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
  familyLine(ctx, u, `${familyName(page.family)} · ${page.letters} lettres`, style.ink);
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
  const note = aimNote(aim, page.misses, page.freeInkAfter) || (heard ? `Soufflé par ${heard.who}` : '');
  if (note) {
    ctx.fillStyle = aim && aim.right ? style.ink : NOTE;
    ctx.textAlign = 'center';
    fitFont(ctx, u, note, 80, 4.6, 3.4, FELL, true);
    ctx.fillText(note, 52 * u, (top + 20.8) * u);
  }
  // Deux boutons : le pendu (deviner le nom) et l'encre (révéler un ingrédient)
  const guessLabel = hm && hm.failedUntil ? '✎ Pendu perdu' : '✎ Deviner le nom';
  const hotspots = [{ ...spot, pulse: true, ...(hm ? { action: 'guess', data: page.id, label: 'Ouvrir le pendu de la page' } : {}) }];
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
    hotspots.push({ id: 'blanks', x: 12, y: NAME_Y - 8, w: 80, h: 11, action: 'guess', data: page.id, label: 'Deviner le nom lettre par lettre' });
    button(13, 37, style.color, guessLabel, style.ink, true);
    hotspots.push(zone('guess', 13, 37, { action: 'guess', data: page.id, label: 'Pendu : deviner le nom lettre par lettre' }));
  }
  const told = revealed && whisper && whisper.ingredient === revealed ? `Soufflé par ${whisper.who}` : 'Encre utilisée';
  button(inkX, inkW, revealed ? VELLUM : freeInk ? '#B7862F' : INK, revealed ? told : freeInk ? '✒︎ Encre offerte' : `✒︎ Encre · ${assets.inkPrice} écus`, revealed ? FAINT : '#FFFDF8', !revealed);
  if (!revealed) hotspots.push(zone('ink', inkX, inkW, { action: 'ink', data: page.id, label: freeInk ? 'Encre offerte : révéler un ingrédient' : `Encre : révéler un ingrédient pour ${assets.inkPrice} écus` }));
  // Le sceau mélange ce qui est posé dans l'Athanor (comme « Transmuer »)
  if (ready && sealX !== null) hotspots.push({ id: 'seal', x: sealX - 6, y: top - 0.5, w: 12, h: BOX + 1, action: 'seal', data: page.id, label: `Sceller le mélange : ${picked.join(' et ')}` });
  folio(ctx, u, i);
  const start = page.first ? `, commence par ${page.first}` : '';
  // (les familles en toutes lettres seulement après un essai, comme à l'écran ; la famille soufflée se dit à part)
  const clue = page.riddle ? `Énigme : ${page.riddle}${tried ? ` ${clueText(page.clue, page.groups)}` : ''}` : clueText(page.clue, page.groups);
  const said = heard ? ` Un ingrédient est ${FAMILY_WORDS[heard.family] || 'un élément'}.` : '';
  return { hotspots, label: `Page à trouver : ${familyName(page.family)}, ${page.letters} lettres${start}. ${clue}${note ? ` ${note}.` : ''}${said}${revealed ? ` Un ingrédient : ${revealed}.` : ''}` };
}

function paintFar(ctx, u, model, i) {
  const { chapter, count, waiting = 0 } = model;
  const style = CHAPTER_STYLE[chapter.id];
  frame(ctx, u, style.ink);
  header(ctx, u, chapter, style, null);
  vignette(ctx, u, style, 'far');
  bigQuestion(ctx, u, FAINT);
  const far = `${count} page${count > 1 ? 's' : ''} lointaine${count > 1 ? 's' : ''}`;
  // Pages à portée pas encore ouvertes : elles viennent une à une, les plus simples d'abord
  const queued = `${waiting} page${waiting > 1 ? 's' : ''} en attente`;
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  fitFont(ctx, u, waiting ? queued : far, 80, 8.4, 6, FELL);
  ctx.fillText(waiting ? queued : far, 52 * u, (NAME_Y + 1) * u);
  setFont(ctx, u, 5, FELL, true);
  ctx.fillStyle = TEXT_INK;
  const text = waiting
    ? 'Elles s’ouvrent une à une : chaque page trouvée dans ce chapitre en ouvre une autre.'
    : 'Il te manque encore des ingrédients pour les tenter. Chaque découverte en rapproche quelques-unes.';
  const lines = wrap(ctx, text, 74 * u);
  lines.forEach((line, k) => ctx.fillText(line, 52 * u, (73 + k * 6.2) * u));
  if (waiting && count) {
    setFont(ctx, u, 4.8, CAPS);
    ctx.fillStyle = NOTE;
    ctx.fillText(`Et ${far} au-delà.`, 52 * u, (78 + lines.length * 6.2) * u);
  }
  folio(ctx, u, i);
  return { hotspots: [], label: waiting ? `${queued} dans ce chapitre${count ? `, et ${far}` : ''}.` : `${far} dans ce chapitre.` };
}

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
      label: found ? `${entry.page.name}, inscrite` : `Page à trouver, ${entry.page.letters} lettres`
    });
  });
  folio(ctx, u, i);
  const reach = entries.filter(e => e.page.status !== 'found').length;
  return { hotspots, label: `Table du chapitre ${chapter.id}${parts > 1 ? `, feuille ${part} sur ${parts}` : ''} : ${reach} page${reach > 1 ? 's' : ''} à trouver, ${entries.length - reach} inscrite${entries.length - reach > 1 ? 's' : ''}.` };
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
    ctx.fillText(`${chapter.found} / ${chapter.total} pages inscrites`, 52 * u, 112 * u);
    const reach = chapter.pages.filter(p => p.status === 'reach').length;
    setFont(ctx, u, 4.6, FELL, true);
    ctx.fillStyle = NOTE;
    ctx.fillText(reach ? `${reach} à portée de mélange` : 'Rien à portée pour l’instant', 52 * u, 118.6 * u);
  } else {
    const left = Math.max(0, chapter.need - assets.stars);
    setFont(ctx, u, 5.2, CAPS, false, 0.06);
    ctx.fillStyle = NOTE;
    ctx.fillText('Chapitre scellé', 52 * u, 112 * u);
    setFont(ctx, u, 4.6, FELL, true);
    ctx.fillText(`encore ${left} découverte${left > 1 ? 's' : ''} pour l’ouvrir`, 52 * u, 118.6 * u);
  }
  folio(ctx, u, i);
  return { hotspots: [], label: `Chapitre ${chapter.id}, ${chapter.name}.${chapter.verse ? ` ${chapter.verse}` : ''} ${chapter.open ? `${chapter.found} pages inscrites sur ${chapter.total}.` : `Scellé : encore ${Math.max(0, chapter.need - assets.stars)} découvertes.`}` };
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
  const found = assets.stars ? `${assets.stars} découverte${assets.stars > 1 ? 's' : ''}` : 'aucune découverte';
  ctx.fillText(`Grimoire d’alchimie · ${found}`, 52 * u, 27.6 * u);
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
    hotspots.push({ id: `toc-${chapter.id}`, x: 12, y, w: 80, h, action: 'goto', data: model.chapterIndex[chapter.id], label: `Chapitre ${chapter.id}, ${chapter.name}${chapter.open ? '' : ', scellé'}` });
  });
  setFont(ctx, u, 4.2, FELL, true);
  ctx.fillStyle = NOTE;
  ctx.textAlign = 'center';
  ctx.fillText('Touche un chapitre, ou tourne la page.', 52 * u, 126.8 * u);
  return { hotspots, label: `Sommaire du ${BOOK_TITLE}. ${model.chapters.map(c => `Chapitre ${c.id}, ${c.name}`).join('. ')}.` };
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
  return { hotspots: [], label: front ? `Garde du grimoire : ex-libris du ${BOOK_TITLE}.` : 'Garde de fin du grimoire.' };
}

// model : { type: 'toc' | 'chapter' | 'found' | 'reach' | 'far', … } ; assets : { emojiOf, onReady, inkPrice, stars, familiesOf }
// side : 'right' (page seule, ou de droite) ou 'left' (double page : la reliure à droite, le contenu décalé vers
// l'extérieur, zones comprises)
export function paintPage(model, index, ctx, w, h, assets, side = 'right') {
  const u = w / 100;
  const shift = side === 'left' ? -4 : 0;
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  paperBase(ctx, w, h, u, side, index);
  ctx.translate(shift * u, 0);
  const painters = { toc: paintToc, chapter: paintChapter, index: paintIndex, found: paintFound, reach: paintReach, far: paintFar };
  const result = painters[model.type](ctx, u, model, index, assets);
  ctx.restore();
  return shift ? { ...result, hotspots: result.hotspots.map(spot => ({ ...spot, x: spot.x + shift })) } : result;
}
