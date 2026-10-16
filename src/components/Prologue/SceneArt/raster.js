// Les dessins d'une scène du tutoriel (SVG), lus une fois à la taille où SceneArt les peint : href → une image (canvas)
// de w × h pixels, ou null si elle n'a pas pu être lue. Le navigateur repeignait leurs vecteurs à chaque image de
// l'écran (la scène du conseil ramait) ; une image toute prête ne fait plus que se recopier. Les dernières lues restent
// (les images d'une scène et de son avatar, ou les pièces de deux scènes en plans, celle qui joue et la suivante, lue
// d'avance ; au-delà, la plus ancienne part : une image d'un grand écran pèse lourd)
const KEEP = 160;
const cache = new Map();
// Un grand dessin se peint par bandes, une à chaque image de l'écran, chacune d'au plus SLICE_MS : peint d'un bloc, le
// fond de la veillée gelait l'écran (362 ms sur un PC, plus d'une seconde sur un téléphone). La première bande compte
// FIRST_ROWS lignes, les suivantes s'ajustent au temps qu'a pris la précédente
const SLICE_MS = 10;
const FIRST_ROWS = 24;
const MIN_ROWS = 8;

// La finesse des images d'une scène au plus (pixels par pixel d'écran) ; la largeur de ses dessins (unités de leurs SVG :
// un carré de ART, ou plus haut, h : la veillée du conseil, en hauteur pour remplir un téléphone)
export const MAX_DPR = 3;
export const ART = 400;

// La largeur (pixels) où se lisent les calques qui couvrent toute une scène de hauteur h, la même pour toutes : la scène
// ne dépasse jamais l'écran, ni en largeur ni en hauteur, et SceneArt la réduit à sa taille en la recopiant. Une scène
// peut ainsi se lire avant de s'ouvrir (prepareScene), sans connaître la place qu'elle aura
export function squarePx(h = ART) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  return Math.max(1, Math.round(Math.min(window.innerWidth, (window.innerHeight * ART) / h) * dpr));
}
const tall = (w, h) => Math.max(1, Math.round((w * h) / ART));

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

// Un calque d'une scène de hauteur h (SceneArt : { href, x, y, w, h }, en unités de la scène) lu pour une scène de px
// pixels de large : ceux qui la couvrent tout entière à la taille commune (squarePx), les autres (l'avatar) à leur
// taille exacte
export function layerRaster(layer, px, h = ART) {
  if (layer.x === 0 && layer.y === 0 && layer.w === ART && layer.h === h) {
    const w = squarePx(h);
    return rasterOf(layer.href, w, tall(w, h));
  }
  const k = px / ART;
  return rasterOf(layer.href, Math.max(1, Math.round(layer.w * k)), Math.max(1, Math.round(layer.h * k)));
}

// Une scène de la bibliothèque (game/sceneArt.js : sceneOf) lue d'avance, son fond et son devant, avant qu'elle s'ouvre :
// elle s'ouvre alors toute peinte (App : la scène de l'arc du Phare qui vient)
export function prepareScene(data) {
  if (!data) return;
  const w = squarePx(data.h);
  [...data.back, ...data.front].forEach(href => rasterOf(href, w, tall(w, data.h)));
}

// La largeur (pixels) où se lisent les pièces d'une scène en plans (ScenePlans), la même pour toutes : celle du plus grand
// carré de l'écran, à une finesse d'au plus PLAN_DPR (une pile de pièces pèse plus qu'une image). Une scène en plans peut
// ainsi se lire avant de s'ouvrir (preparePlans), sans connaître la place qu'elle aura
export const PLAN_DPR = 2;
export function planPx() {
  return Math.max(1, Math.round(Math.min(window.innerWidth, window.innerHeight) * Math.min(window.devicePixelRatio || 1, PLAN_DPR)));
}
// La taille (pixels) où se lit une pièce (game/sceneArt.js : sceneOf, ses plans) : son cadre, ou le carré et sa marge
export function planSize(plan, px = planPx()) {
  const m = plan.marge || 0, [, , w, h] = plan.cadre || [-m, -m, ART + 2 * m, ART + 2 * m], k = (px * (plan.flou || 1)) / ART;
  return [Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k))];
}
// Une scène en plans lue d'avance, toutes ses pièces : elle s'ouvre alors toute peinte (PrologueScene : la scène qui vient)
export function preparePlans(data) {
  if (!data || !data.plans) return;
  const px = planPx();
  for (const plan of data.plans) if (plan.href) rasterOf(plan.href, ...planSize(plan, px));
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
