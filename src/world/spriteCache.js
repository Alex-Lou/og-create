// Images des sprites SVG de l'île, rendues une fois puis gardées : le canvas les redessine sans recalcul.
// Rendu à 4 fois la taille du monde : net jusqu'au zoom maximal sur écran haute densité.
// Chargées par paquets (LOADS à la fois, les autres attendent leur tour) ; clearSprites() vide tout à la sortie de l'île.
const RES = 4;
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
      job.entry.img = img;
      done();
      if (job.onReady) job.onReady();
    };
    img.onerror = done;
    img.src = job.src;
  }
}

// Image prête d'un sprite { svg, box }, ou null pendant le chargement (onReady redessine l'île)
export function imageOf(key, make, onReady) {
  let entry = cache.get(key);
  if (!entry) {
    const sprite = make();
    entry = { img: null, box: sprite.box };
    cache.set(key, entry);
    const sized = sprite.svg.replace(/width="([\d.]+)" height="([\d.]+)"/, (_, w, h) => `width="${w * RES}" height="${h * RES}"`);
    queue.push({ key, entry, onReady, src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}` });
    pump();
  }
  return entry;
}

// Sortie de l'île : les images sont libérées (elles se rechargeront au retour)
export function clearSprites() {
  cache.clear();
  queue.length = 0;
}

// Dessine un sprite ancré en (x, y) du monde ; rien tant que son image n'est pas prête
export function drawSprite(ctx, key, make, x, y, onReady) {
  const entry = imageOf(key, make, onReady);
  if (!entry.img) return false;
  const { box } = entry;
  ctx.drawImage(entry.img, x + box.x, y + box.y, box.w, box.h);
  return true;
}

// Adresse d'image d'un sprite, pour l'afficher hors du canvas (vignette d'une fiche)
const urls = new Map();
export function spriteUrl(key, make) {
  if (!urls.has(key)) urls.set(key, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(make().svg)}`);
  return urls.get(key);
}
