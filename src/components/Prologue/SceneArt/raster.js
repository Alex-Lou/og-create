// Les dessins d'une scène du tutoriel (SVG), lus une fois à la taille où SceneArt les peint : href → une image (canvas)
// de w × h pixels, ou null si elle n'a pas pu être lue. Le navigateur repeignait leurs vecteurs à chaque image de
// l'écran (la scène du conseil ramait) ; une image toute prête ne fait plus que se recopier. Les dernières lues restent
// (les images d'une scène et de son avatar ; au-delà, la plus ancienne part : une image d'un grand écran pèse lourd)
const KEEP = 8;
const cache = new Map();
// Un grand dessin se peint par bandes, une à chaque image de l'écran, chacune d'au plus SLICE_MS : peint d'un bloc, le
// fond de la veillée gelait l'écran (362 ms sur un PC, plus d'une seconde sur un téléphone). La première bande compte
// FIRST_ROWS lignes, les suivantes s'ajustent au temps qu'a pris la précédente
const SLICE_MS = 10;
const FIRST_ROWS = 24;
const MIN_ROWS = 8;

// La finesse des images d'une scène au plus (pixels par pixel d'écran) ; le carré de ses dessins (unités de leurs SVG)
export const MAX_DPR = 3;
const ART = 400;

// La taille (pixels) où se lisent les calques qui couvrent tout le carré d'une scène, la même pour toutes : le carré ne
// dépasse jamais le plus petit côté de l'écran, et SceneArt la réduit à sa taille en la recopiant. Une scène peut ainsi
// se lire avant de s'ouvrir (prepareScene), sans connaître la place qu'elle aura
export function squarePx() {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  return Math.max(1, Math.round(Math.min(window.innerWidth, window.innerHeight) * dpr));
}

// (un canvas lu en mémoire : sa peinture se fait tout de suite, bande après bande, et ses couleurs se relisent)
function paintBands(img, w, h) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let y = 0;
    let rows = FIRST_ROWS;
    const band = () => {
      const start = performance.now();
      const n = Math.min(rows, h - y);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y, w, n);
      ctx.clip();
      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();
      // (la peinture d'un canvas attend d'être lue : lue ici, elle se fait dans cette image de l'écran)
      ctx.getImageData(0, y, 1, 1);
      y += n;
      const spent = performance.now() - start;
      rows = Math.max(MIN_ROWS, Math.round(spent > 0.5 ? (n * SLICE_MS) / spent : n * 2));
      if (y < h) requestAnimationFrame(band);
      else resolve(canvas);
    };
    band();
  });
}

export function rasterOf(href, w, h) {
  const key = `${href}@${w}x${h}`;
  let ready = cache.get(key);
  if (ready) {
    cache.delete(key);
    cache.set(key, ready);
    return ready;
  }
  ready = new Promise(resolve => {
    const img = new Image();
    img.onload = () => paintBands(img, w, h).then(resolve);
    img.onerror = () => resolve(null);
    img.src = href;
  });
  cache.set(key, ready);
  if (cache.size > KEEP) cache.delete(cache.keys().next().value);
  return ready;
}

// Un calque d'une scène (SceneArt : { href, x, y, w, h }, en unités du carré) lu pour un carré de px pixels : ceux qui le
// couvrent tout entier à la taille commune (squarePx), les autres (l'avatar) à leur taille exacte
export function layerRaster(layer, px) {
  if (layer.x === 0 && layer.y === 0 && layer.w === ART && layer.h === ART) {
    const size = squarePx();
    return rasterOf(layer.href, size, size);
  }
  const k = px / ART;
  return rasterOf(layer.href, Math.max(1, Math.round(layer.w * k)), Math.max(1, Math.round(layer.h * k)));
}

// Une scène de la bibliothèque (game/sceneArt.js : sceneOf) lue d'avance, son fond et son devant, avant qu'elle s'ouvre :
// elle s'ouvre alors toute peinte (App : la scène de l'arc du Phare qui vient)
export function prepareScene(data) {
  if (!data) return;
  const size = squarePx();
  [...data.back, ...data.front].forEach(href => rasterOf(href, size, size));
}

// La couleur moyenne d'une bande de lignes d'une image (canvas), en « rgb(r, g, b) »
function bandColor(canvas, y, rows) {
  const { data } = canvas.getContext('2d').getImageData(0, y, canvas.width, rows);
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  return n ? `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})` : null;
}

// Les couleurs du haut et du bas d'une image (son ciel, son sol), pour prolonger la scène jusqu'aux bords de l'écran,
// nettes (choix de l'auteur, 16 oct. : rien de flouté) : { top, bottom } ; null si l'image ne se lit pas
export function edgeColors(canvas) {
  if (!canvas || !canvas.width || !canvas.height) return null;
  const rows = Math.max(1, Math.round(canvas.height / 200));
  try {
    const top = bandColor(canvas, 0, rows);
    const bottom = bandColor(canvas, canvas.height - rows, rows);
    return top && bottom ? { top, bottom } : null;
  } catch {
    return null;
  }
}
