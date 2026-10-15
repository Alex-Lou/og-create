// Le corps d'un dessin (une vignette de création, de la bibliothèque ou dessinée par code) : ce qu'il peint vraiment,
// sans son halo ni son ombre douce, en part de l'image ({ x, y, w, h }, de 0 à 1) et ses proportions (ratio : largeur /
// hauteur). Le puzzle d'assemblage cale ce corps sur son gabarit (crafts.artFit). Mesuré une fois par image, sur ses
// pixels ; null tant que ce n'est pas fait (ou si l'image ne se lit pas)
import { reactive } from 'vue';
import { BLANK } from './library';

// L'opacité au-delà de laquelle un pixel est du corps (un halo, une ombre douce restent en dessous) ; pixels de mesure
// par pixel de l'image
const SOLID = 60;
const SCAN = 2;

const bodies = reactive(new Map());
const started = new Set();

async function measure(src) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const w = Math.round(img.naturalWidth * SCAN), h = Math.round(img.naturalHeight * SCAN);
  if (!w || !h) throw new Error('image vide');
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  canvas.width = canvas.height = 0;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] <= SOLID) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) throw new Error('dessin vide');
  return { x: x0 / w, y: y0 / h, w: (x1 + 1 - x0) / w, h: (y1 + 1 - y0) / h, ratio: img.naturalWidth / img.naturalHeight };
}

export function artBody(src) {
  // (une vignette en cours de lecture : l'image vide, rien à mesurer)
  if (!src || src === BLANK) return null;
  if (!started.has(src)) {
    started.add(src);
    measure(src).then(body => { bodies.set(src, body); }, () => {});
  }
  return bodies.get(src) || null;
}
