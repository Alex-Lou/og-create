// Images des sprites SVG de l'île, rendues une fois puis gardées : le canvas les redessine sans recalcul.
// Rendu à 4 fois la taille du monde : net jusqu'au zoom maximal sur écran haute densité.
const RES = 4;
const cache = new Map();

// Image prête d'un sprite { svg, box }, ou null pendant le chargement (onReady redessine l'île)
export function imageOf(key, make, onReady) {
  let entry = cache.get(key);
  if (!entry) {
    const sprite = make();
    entry = { img: null, box: sprite.box };
    cache.set(key, entry);
    const sized = sprite.svg.replace(/width="([\d.]+)" height="([\d.]+)"/, (_, w, h) => `width="${w * RES}" height="${h * RES}"`);
    const img = new Image();
    img.onload = () => {
      entry.img = img;
      if (onReady) onReady();
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
  }
  return entry;
}

// Dessine un sprite ancré en (x, y) du monde ; rien tant que son image n'est pas prête
export function drawSprite(ctx, key, make, x, y, onReady) {
  const entry = imageOf(key, make, onReady);
  if (!entry.img) return false;
  const { box } = entry;
  ctx.drawImage(entry.img, x + box.x, y + box.y, box.w, box.h);
  return true;
}
