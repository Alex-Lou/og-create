// Les glyphes des éléments : un emoji (texte) ou un dessin du jeu (SVG chargé une fois, gardé).
import { glyphSrc } from '@/utils/glyph';

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
