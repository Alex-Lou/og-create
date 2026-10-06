// Images des sprites SVG de l'île, rendues une fois dans un canvas puis gardées : l'île les recopie sans recalcul.
// Rendu à 4 fois la taille du monde : net jusqu'au zoom maximal sur écran haute densité. Vue de loin, réduire une
// image si grande coûte cher à chaque dessin : des versions réduites (2×, 1×, ½, ¼) sont faites une fois, à la
// demande, et l'île dit à chaque image à quel détail elle dessine (setSpriteDetail).
// Chargées par paquets (LOADS à la fois, les autres attendent leur tour) ; clearSprites() vide tout à la sortie de l'île.
const RES = 4;
// Détails possibles (pixels de l'image par unité du monde), du plus fin au plus grossier ; détail de l'image en cours
const LEVELS = [4, 2, 1, 0.5, 0.25];
let detail = RES;
const LOADS = 6;
const cache = new Map();
const queue = [];
let loading = 0;

function pump() {
  while (loading < LOADS && queue.length) {
    const job = queue.shift();
    if (cache.get(job.key) !== job.entry) continue;
    loading++;
    const img = new Image();
    const done = () => {
      loading--;
      pump();
    };
    img.onload = () => {
      job.entry.img = bitmapOf(img);
      done();
      if (job.onReady) job.onReady();
    };
    img.onerror = done;
    // Un dessin de la bibliothèque se lit d'abord (load) ; un dessin par code est déjà là (svg)
    if (job.load) job.load().then(svg => { img.src = srcOf(svg); }, done);
    else img.src = srcOf(job.svg);
  }
}

// Adresse d'image d'un SVG, agrandi RES fois
function srcOf(svg) {
  const sized = svg.replace(/width="([\d.]+)" height="([\d.]+)"/, (_, w, h) => `width="${w * RES}" height="${h * RES}"`);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
}

// Une image SVG redessinée telle quelle est souvent recalculée par le navigateur à chaque dessin (surtout penchée ou
// réduite) : elle est peinte une fois dans un canvas, que le dessin de l'île recopie ensuite
function bitmapOf(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  if (!canvas.width || !canvas.height) return img;
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Image prête d'un sprite { svg, box } (dessiné par code) ou { load, box } (lu dans la bibliothèque, load : promesse de
// son SVG), ou null pendant le chargement (onReady redessine l'île)
export function imageOf(key, make, onReady) {
  let entry = cache.get(key);
  if (!entry) {
    const sprite = make();
    entry = { img: null, box: sprite.box };
    cache.set(key, entry);
    queue.push({ key, entry, onReady, svg: sprite.svg, load: sprite.load });
    pump();
  }
  return entry;
}

// Sortie de l'île : les images sont libérées (elles se rechargeront au retour)
export function clearSprites() {
  for (const entry of cache.values()) {
    if (entry.img && entry.img.getContext) entry.img.width = entry.img.height = 0;
    for (const mip of Object.values(entry.mips || {})) mip.width = mip.height = 0;
  }
  cache.clear();
  queue.length = 0;
}

// Détail des dessins de l'image en cours : px, les pixels de l'écran par unité du monde (zoom × densité de l'écran).
// Le plus petit détail qui reste net à ce zoom
export function setSpriteDetail(px) {
  detail = [...LEVELS].reverse().find(level => level >= px) || RES;
}
// Version réduite d'une image au détail voulu, faite une fois (par moitiés successives, pour rester nette)
function mipOf(entry, level) {
  if (level >= RES || !entry.img.getContext) return entry.img;
  entry.mips = entry.mips || {};
  if (!entry.mips[level]) {
    const from = mipOf(entry, level * 2);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(from.width / 2));
    canvas.height = Math.max(1, Math.round(from.height / 2));
    canvas.getContext('2d').drawImage(from, 0, 0, canvas.width, canvas.height);
    entry.mips[level] = canvas;
  }
  return entry.mips[level];
}

// Dessine un sprite ancré en (x, y) du monde ; rien tant que son image n'est pas prête
export function drawSprite(ctx, key, make, x, y, onReady) {
  const entry = imageOf(key, make, onReady);
  if (!entry.img) return false;
  const { box } = entry;
  ctx.drawImage(mipOf(entry, detail), x + box.x, y + box.y, box.w, box.h);
  return true;
}

// La partie d'un sprite ancré en (x, y) qui tombe dans un rectangle du monde ({ x, y, w, h }) : seuls ces pixels sont
// dessinés ; rien tant que son image n'est pas prête
export function drawSpriteIn(ctx, key, make, x, y, rect) {
  const entry = imageOf(key, make);
  if (!entry.img) return false;
  const { box } = entry;
  const x0 = Math.max(x + box.x, rect.x);
  const y0 = Math.max(y + box.y, rect.y);
  const x1 = Math.min(x + box.x + box.w, rect.x + rect.w);
  const y1 = Math.min(y + box.y + box.h, rect.y + rect.h);
  if (x1 <= x0 || y1 <= y0) return true;
  const img = mipOf(entry, detail);
  const kx = img.width / box.w;
  const ky = img.height / box.h;
  ctx.drawImage(img, (x0 - x - box.x) * kx, (y0 - y - box.y) * ky, (x1 - x0) * kx, (y1 - y0) * ky, x0, y0, x1 - x0, y1 - y0);
  return true;
}

// Adresse d'image d'un sprite, pour l'afficher hors du canvas (vignette d'une fiche)
const urls = new Map();
export function spriteUrl(key, make) {
  if (!urls.has(key)) urls.set(key, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(make().svg)}`);
  return urls.get(key);
}
