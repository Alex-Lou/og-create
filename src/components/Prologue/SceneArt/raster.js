// Les dessins d'une scène du tutoriel (SVG), lus une fois à la taille où SceneArt les peint : href → une image (canvas)
// de w × h pixels, ou null si elle n'a pas pu être lue. Le navigateur repeignait leurs vecteurs à chaque image de
// l'écran (la scène du conseil ramait) ; une image toute prête ne fait plus que se recopier. Les dernières lues restent
// (les images d'une scène et de son avatar ; au-delà, la plus ancienne part : une image d'un grand écran pèse lourd)
const KEEP = 8;
const cache = new Map();

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
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas);
    };
    img.onerror = () => resolve(null);
    img.src = href;
  });
  cache.set(key, ready);
  if (cache.size > KEEP) cache.delete(cache.keys().next().value);
  return ready;
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
