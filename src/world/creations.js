// Les créations d'île dessinées dans la bibliothèque (design/bibliotheque/svg/decor/creations) : chaque création du jeu
// prend son dessin et son animation (decor.json : fichiers dans l'ordre, ms_par_image), au cadre des décors du jeu
// × 1,25. Une création que la bibliothèque n'a pas garde son dessin par code (craftSprites.js).
import { reactive } from 'vue';
import DECOR from '../../design/bibliotheque/svg/decor/decor.json';
import { PROP_BOX } from './palette';
import { librarySprite } from './library';

// Chargés à la demande, un fichier à la fois (le jeu ne lit que ce qui est posé sur l'île)
const FILES = import.meta.glob('/design/bibliotheque/svg/decor/creations/*.svg', { query: '?raw', import: 'default' });
const ROOT = '/design/bibliotheque/svg/decor/';

// Lumière de nuit recalée sur le dessin de la bibliothèque (u, v, z du jeu, mesurés sur le dessin) : la flamme de la
// lanterne, la porte de l'igloo. Les autres tombent déjà juste (brasero, fontaine, kiosque, obélisque)
export const ART_LIGHTS = { lanterne: [0, 0, 41], igloo: [0.11, 0.21, 6] };

// L'image d'une animation à l'instant t (secondes) : ms_par_image est une durée, ou une durée par image
function frameAt(art, t) {
  const n = art.fichiers.length;
  if (n < 2) return 0;
  const durations = Array.isArray(art.ms_par_image) ? art.ms_par_image : Array(n).fill(art.ms_par_image);
  let r = (t * 1000) % durations.reduce((a, b) => a + b, 0);
  for (let f = 0; f < n; f++) {
    if (r < durations[f]) return f;
    r -= durations[f];
  }
  return n - 1;
}

const makes = new Map();
// Le calque d'une création à l'instant t (secondes) : { key, make }, ou null si la bibliothèque ne l'a pas
export function creationLayer(id, t = 0) {
  const art = DECOR.creations[id];
  if (!art) return null;
  const f = frameAt(art, t);
  const path = ROOT + art.fichiers[f];
  if (!FILES[path]) return null;
  if (!makes.has(path)) makes.set(path, librarySprite(FILES[path], PROP_BOX));
  return { key: `creation-${id}-${f}`, make: makes.get(path) };
}

// Le même SVG cadré sur box (unités du dessin) : il ne montre plus que cette partie
export function cropTo(svg, box) {
  const { x, y, w, h } = box;
  return svg.replace(/width="[\d.]+" height="[\d.]+" viewBox="[^"]+"/, `width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"`);
}

// Ce que peint un SVG (unités du dessin, à MARGIN près), mesuré sur ses pixels : un tracé ou une ombre légère compte,
// une forme invisible non. SCAN pixels par unité
const SCAN = 2;
const MARGIN = 1.5;
async function paintedBox(svg) {
  const [vx, vy, vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const img = new Image();
  const sized = svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${vw * SCAN}" height="${vh * SCAN}"`);
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = vw * SCAN;
  canvas.height = vh * SCAN;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let x0 = canvas.width, y0 = canvas.height, x1 = -1, y1 = -1;
  for (let py = 0; py < canvas.height; py++) {
    for (let px = 0; px < canvas.width; px++) {
      if (data[(py * canvas.width + px) * 4 + 3] <= 8) continue;
      x0 = Math.min(x0, px);
      x1 = Math.max(x1, px);
      y0 = Math.min(y0, py);
      y1 = Math.max(y1, py);
    }
  }
  canvas.width = canvas.height = 0;
  if (x1 < 0) throw new Error('dessin vide');
  const round = v => Math.round(v * 10) / 10;
  return {
    x: round(vx + x0 / SCAN - MARGIN),
    y: round(vy + y0 / SCAN - MARGIN),
    w: round((x1 + 1 - x0) / SCAN + 2 * MARGIN),
    h: round((y1 + 1 - y0) / SCAN + 2 * MARGIN)
  };
}

// Vignette d'une création (établi, gabarit, aperçu du Foyer) : la première image de son dessin, recadrée sur ce
// qu'elle peint. Lue et mesurée une fois, à la première demande ; une image vide pendant ce temps (l'ancienne vignette
// ne passe pas en éclair). null si la bibliothèque ne l'a pas ou si la lecture échoue : l'ancienne vignette reste
const BLANK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>')}`;
const started = new Set();
const thumbs = reactive({});
export function creationThumb(id) {
  const art = DECOR.creations[id];
  const load = art && FILES[ROOT + art.fichiers[0]];
  if (!load) return null;
  if (!started.has(id)) {
    started.add(id);
    load()
      .then(svg => paintedBox(svg).then(box => cropTo(svg, box)))
      .then(svg => { thumbs[id] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; }, () => { thumbs[id] = null; });
  }
  return id in thumbs ? thumbs[id] : BLANK;
}
