// Les polices et les encres du Livre, et le texte qui tient dans sa place (taille ajustée, retour à la ligne).

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

export { FELL, CAPS, GOTHIC, INK, TEXT_INK, NOTE, FAINT, setFont, fitFont, fitText, wrap, alpha };
