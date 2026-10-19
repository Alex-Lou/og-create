// La brume adoucie au bord de ce qui est dégagé (featheredVeil).

// Le voile s'épaissit avec la distance à la terre dégagée la plus proche, sur FEATHER cases (choix de l'auteur,
// 15 oct. : la brume froide, légère au bord, pleine au loin) ; relu à chaque préparation d'un carré (le voile change
// quand un quartier s'achète). box : { x0, y0, x1, y1 }, les cases à lire (toute l'île sinon). La distance (en cases,
// diagonales comprises) se calcule en deux passes sur ces cases élargies de FEATHER : un coût à la mesure du carré, et
// seulement à la première case voilée (un carré tout dégagé ne la calcule pas)
export const FEATHER = 6;

const DEPTH = [0, 0.5, 0.62, 0.74, 0.85, 0.93, 0.98, 1];

export function featheredVeil(M, veilOf, box = null) {
  const n = M.n, far = FEATHER + 1;
  const x0 = Math.max(0, (box ? box.x0 : 0) - FEATHER), y0 = Math.max(0, (box ? box.y0 : 0) - FEATHER);
  const x1 = Math.min(n - 1, (box ? box.x1 : n - 1) + FEATHER), y1 = Math.min(n - 1, (box ? box.y1 : n - 1) + FEATHER);
  const w = Math.max(0, x1 - x0 + 1), h = Math.max(0, y1 - y0 + 1);
  let dist = null;
  const distances = () => {
    dist = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) dist[y * w + x] = M.land(x0 + x, y0 + y) && veilOf(x0 + x, y0 + y) <= 0 ? 0 : far;
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? far : dist[y * w + x]);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      dist[y * w + x] = Math.min(dist[y * w + x], at(x - 1, y) + 1, at(x - 1, y - 1) + 1, at(x, y - 1) + 1, at(x + 1, y - 1) + 1);
    }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
      dist[y * w + x] = Math.min(dist[y * w + x], at(x + 1, y) + 1, at(x + 1, y + 1) + 1, at(x, y + 1) + 1, at(x - 1, y + 1) + 1);
    }
  };
  return (x, y) => {
    const v = veilOf(x, y);
    if (v <= 0) return v;
    if (!dist) distances();
    const d = x >= x0 && x <= x1 && y >= y0 && y <= y1 ? dist[(y - y0) * w + (x - x0)] : far;
    return v * DEPTH[Math.min(far, d)];
  };
}
