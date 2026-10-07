// Images des sprites SVG de l'île, rendues dans des canvas puis gardées : l'île les recopie sans recalcul.
// Chaque dessin n'est rendu qu'au détail où l'île le montre (pixels de l'image par unité du monde : 4, 2, 1, ½ ou ¼, le
// plus petit qui reste net au zoom et à la densité de l'écran, que l'île donne à chaque image : setSpriteDetail). Vu de
// loin, un dessin pèse seize fois moins que de près : la mémoire des images reste dans le budget d'un téléphone (garder
// tout à 4 fois la taille du monde la faisait déborder, et le navigateur recopiait alors les images à chaque dessin).
// Un détail pas encore prêt est remplacé par un autre déjà rendu, le temps de sa lecture ; un dessin pas encore lu du
// tout, par la dernière image du même sujet (drawSprite : hold), pour qu'un habitant qui change de pose ou une
// animation qui passe à l'image suivante ne disparaisse pas un instant. Les images gardées tiennent dans BUDGET_PX :
// seules partent celles qui n'ont pas servi depuis KEEP_MS (d'un autre détail que celui de l'écran d'abord, puis les
// plus anciennes), en laissant une copie légère (trim) ; elles se refont si l'île les redemande. Ce qui a servi
// récemment reste, même au-delà du budget : libérer une image encore à l'écran, ou l'image suivante d'une animation, la
// faisait clignoter.
// Lectures par paquets (LOADS à la fois, les autres attendent leur tour), peintes dans leur canvas quelques-unes par
// image de l'écran (RASTER_MS) : un SVG se peint sur le fil principal, et une arrivée en nombre (un zoom, une zone
// découverte en glissant) arrêtait l'île. clearSprites() vide tout à la sortie de l'île.
const LEVELS = [4, 2, 1, 0.5, 0.25];
const LOADS = 6;
const RASTER_MS = 6;
// Pixels gardés (≈ 64 Mo) au-delà desquels les images qui n'ont pas servi depuis KEEP_MS partent
const BUDGET_PX = 16e6;
const KEEP_MS = 10000;
const FLOOR = 1;
let detail = LEVELS[0];
// Numéro et heure de l'image de l'île en cours (setSpriteDetail) : budget des réductions, ce qui a servi récemment
let tick = 0;
let stamp = 0;
let kept = 0;
const cache = new Map();
const queue = [];
let loading = 0;
const rasters = [];
let rasterRaf = 0;

// Le texte SVG d'un dessin, lu une fois : tout de suite pour un dessin par code, à la lecture pour la bibliothèque
// (load : son SVG, ou { svg, box } s'il est recadré à la lecture : le cadre change alors)
function textOf(entry) {
  if (!entry.text) {
    entry.text = entry.load
      ? entry.load().then(read => {
        if (typeof read === 'string') return read;
        entry.box = read.box;
        return read.svg;
      })
      : Promise.resolve(entry.svg);
  }
  return entry.text;
}

function pump() {
  while (loading < LOADS && queue.length) {
    const { key, entry, level } = queue.shift();
    const slot = entry.levels.get(level);
    if (cache.get(key) !== entry || !slot || slot.canvas) continue;
    loading++;
    const done = () => {
      loading--;
      pump();
    };
    textOf(entry).then(svg => {
      const img = new Image();
      img.onload = () => {
        done();
        rasters.push({ key, entry, level, slot, img });
        if (!rasterRaf) rasterRaf = requestAnimationFrame(rasterize);
      };
      img.onerror = done;
      img.src = srcOf(svg, level);
    }, done);
  }
}

// Les images lues, peintes dans leur canvas dans le budget de cette image de l'écran (au moins une) ; la suite à la
// prochaine. Un dessin dont l'image arrive redessine l'île (onReady)
function rasterize() {
  rasterRaf = 0;
  const start = performance.now();
  while (rasters.length && (performance.now() - start < RASTER_MS)) {
    const { key, entry, level, slot, img } = rasters.shift();
    // Vidé entre-temps (sortie de l'île, ou détail parti du budget) : l'image ne sert plus
    if (cache.get(key) !== entry || entry.levels.get(level) !== slot) continue;
    slot.canvas = bitmapOf(img);
    // (demandée il y a peut-être longtemps : elle compte d'aujourd'hui, sans quoi elle partirait aussitôt arrivée)
    slot.at = stamp;
    kept += slot.canvas.width * slot.canvas.height;
    trim();
    // (vidée d'abord : un redessin peut redemander ce dessin)
    const waiting = [...entry.waiting];
    entry.waiting.clear();
    for (const onReady of waiting) onReady();
  }
  if (rasters.length) rasterRaf = requestAnimationFrame(rasterize);
}

// Adresse d'image d'un SVG, rendu à ce détail (pixels par unité du monde)
function srcOf(svg, level) {
  const sized = svg.replace(/width="([\d.]+)" height="([\d.]+)"/, (_, w, h) => `width="${Math.max(1, Math.round(w * level))}" height="${Math.max(1, Math.round(h * level))}"`);
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

// La seule image prête d'un dessin
const lastOf = (entry, level) => ![...entry.levels].some(([other, slot]) => other !== level && slot.canvas);

// Au-delà du budget : les images qui n'ont pas servi depuis KEEP_MS partent, celles d'un autre détail que celui de
// l'écran d'abord, puis les plus anciennes, jusqu'à un peu sous le budget (ou jusqu'à ce qu'il n'en reste plus d'aussi
// anciennes). La dernière image d'un dessin laisse une copie au détail FLOOR (seize fois plus légère qu'au détail 4) :
// redemandé, il se montre flou un instant, le temps d'être relu, plutôt que pas du tout
let trimAt = -Infinity;
function trim() {
  // (une fois par seconde au plus : au-delà du budget, ce qui vient de servir reste, et chaque image lue referait le
  // tour de toutes les autres pour rien)
  if (kept <= BUDGET_PX || stamp - trimAt < 1000) return;
  trimAt = stamp;
  const old = [];
  for (const entry of cache.values()) {
    for (const [level, slot] of entry.levels) {
      if (!slot.canvas || slot.at >= stamp - KEEP_MS || (level <= FLOOR && lastOf(entry, level))) continue;
      old.push({ entry, level, slot });
    }
  }
  old.sort((a, b) => (a.level === detail) - (b.level === detail) || a.slot.at - b.slot.at);
  for (const { entry, level, slot } of old) {
    if (kept <= BUDGET_PX * 0.85) break;
    if (lastOf(entry, level)) {
      // (devenue la dernière en route, déjà légère : elle reste)
      if (level <= FLOOR) continue;
      const canvas = reduce(slot.canvas, level, FLOOR);
      entry.levels.set(FLOOR, { canvas, at: slot.at });
      kept += canvas.width * canvas.height;
    }
    kept -= slot.canvas.width * slot.canvas.height;
    if (slot.canvas.getContext) slot.canvas.width = slot.canvas.height = 0;
    entry.levels.delete(level);
  }
}

// Réductions faites pendant l'image en cours (ms), et leur budget : un dézoom n'arrête pas l'île
const REDUCE_MS = 4;
let reduceTick = -1;
let reduceSpent = 0;

// Une image déjà rendue, réduite par moitiés (nette) jusqu'au détail voulu
function reduce(canvas, from, to) {
  let out = canvas;
  for (let level = from; level > to; level /= 2) {
    const half = document.createElement('canvas');
    half.width = Math.max(1, Math.round(out.width / 2));
    half.height = Math.max(1, Math.round(out.height / 2));
    half.getContext('2d').drawImage(out, 0, 0, half.width, half.height);
    if (out !== canvas) out.width = out.height = 0;
    out = half;
  }
  return out;
}

// Le détail voulu d'un dessin est demandé s'il ne l'est pas encore ; onReady redessine l'île quand il arrive. Plus
// petit qu'une image déjà rendue, il en est réduit (sans relire le SVG), dans le budget de l'image en cours : d'ici là,
// l'image plus fine sert. Sinon, le SVG est lu à ce détail
function want(key, entry, level, onReady) {
  if (entry.levels.has(level)) {
    if (onReady && !entry.levels.get(level).canvas) entry.waiting.add(onReady);
    return;
  }
  const finer = LEVELS.filter(l => l > level).reverse().find(l => entry.levels.get(l)?.canvas);
  if (finer) {
    if (reduceTick !== tick) {
      reduceTick = tick;
      reduceSpent = 0;
    }
    if (reduceSpent >= REDUCE_MS) return;
    const start = performance.now();
    const canvas = reduce(entry.levels.get(finer).canvas, finer, level);
    reduceSpent += performance.now() - start;
    entry.levels.set(level, { canvas, at: stamp });
    kept += canvas.width * canvas.height;
    trim();
    return;
  }
  if (onReady) entry.waiting.add(onReady);
  entry.levels.set(level, { canvas: null, at: stamp });
  queue.push({ key, entry, level });
  pump();
}

// L'image à dessiner : celle du détail voulu, sinon la plus proche déjà prête (plus fine d'abord), ou null
function pick(entry) {
  const exact = entry.levels.get(detail);
  let slot = exact && exact.canvas ? exact : null;
  if (!slot) {
    const at = LEVELS.indexOf(detail);
    const order = [...LEVELS.slice(0, at).reverse(), ...LEVELS.slice(at + 1)];
    for (const level of order) {
      const other = entry.levels.get(level);
      if (other && other.canvas) {
        slot = other;
        break;
      }
    }
  }
  if (!slot) return null;
  slot.at = stamp;
  return slot.canvas;
}

// Le sprite { svg, box } (dessiné par code) ou { load, box } (lu dans la bibliothèque, load : promesse de son SVG, ou
// de { svg, box } quand son cadre se mesure à la lecture), demandé au détail en cours : { box, img } (img : la meilleure
// image prête, ou null pendant la lecture ; onReady redessine l'île)
export function imageOf(key, make, onReady) {
  let entry = cache.get(key);
  if (!entry) {
    const sprite = make();
    entry = { box: sprite.box, svg: sprite.svg, load: sprite.load, text: null, levels: new Map(), waiting: new Set() };
    Object.defineProperty(entry, 'img', { get: () => pick(entry) });
    cache.set(key, entry);
  }
  want(key, entry, detail, onReady);
  return entry;
}

// Sortie de l'île : les images sont libérées (elles se rechargeront au retour)
export function clearSprites() {
  for (const entry of cache.values()) {
    for (const slot of entry.levels.values()) if (slot.canvas && slot.canvas.getContext) slot.canvas.width = slot.canvas.height = 0;
  }
  cache.clear();
  holds.clear();
  trimAt = -Infinity;
  queue.length = 0;
  rasters.length = 0;
  kept = 0;
}

// Détail des dessins de l'image en cours : px, les pixels de l'écran par unité du monde (zoom × densité de l'écran).
// Le plus petit détail qui reste net à ce zoom ; une nouvelle image de l'île commence
export function setSpriteDetail(px) {
  detail = [...LEVELS].reverse().find(level => level >= px) || LEVELS[0];
  tick++;
  stamp = performance.now();
}

// La dernière image dessinée de chaque sujet (drawSprite : hold)
const holds = new Map();

// Dessine un sprite ancré en (x, y) du monde ; vrai s'il était prêt. hold : le sujet qu'il montre (un habitant, une
// annexe…), qui garde sa dernière image tant que celle-ci n'est pas prête ; sans lui, rien n'est dessiné d'ici là
export function drawSprite(ctx, key, make, x, y, onReady, hold) {
  let entry = imageOf(key, make, onReady);
  let img = pick(entry);
  const ready = Boolean(img);
  if (hold !== undefined) {
    if (img) holds.set(hold, entry);
    else if (holds.has(hold)) {
      entry = holds.get(hold);
      img = pick(entry);
    }
  }
  if (!img) return false;
  const { box } = entry;
  ctx.drawImage(img, x + box.x, y + box.y, box.w, box.h);
  return ready;
}

// La partie d'un sprite ancré en (x, y) qui tombe dans un rectangle du monde ({ x, y, w, h }) : seuls ces pixels sont
// dessinés ; rien tant qu'aucune de ses images n'est prête
export function drawSpriteIn(ctx, key, make, x, y, rect) {
  const entry = imageOf(key, make);
  const img = pick(entry);
  if (!img) return false;
  const { box } = entry;
  const x0 = Math.max(x + box.x, rect.x);
  const y0 = Math.max(y + box.y, rect.y);
  const x1 = Math.min(x + box.x + box.w, rect.x + rect.w);
  const y1 = Math.min(y + box.y + box.h, rect.y + rect.h);
  if (x1 <= x0 || y1 <= y0) return true;
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
