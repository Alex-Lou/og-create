// Le monde découpé en carreaux, pour ce qui flotte dans l'air de l'île (climats, pluie, rayons, brume) : chaque carreau
// porte ses particules, tirées au sort une fois pour toutes ; seuls ceux autour de la vue sont dessinés. Ce qui y est
// posé reste à sa place quand on glisse et grandit avec le zoom.

// La taille d'un carreau (unités du monde)
export const TUILE = 320;
// Les carreaux d'une vue (rectangle du monde), élargie vers le bas (ce qui flotte haut au-dessus d'un sol hors de la
// vue s'y voit encore) : [{ X, Y, n }] (n : leur numéro, pour le hasard)
export function tuilesOf(view, haut = 200) {
  const out = [];
  const x0 = Math.floor((view.x - TUILE / 2) / TUILE), x1 = Math.floor((view.x + view.w + TUILE / 2) / TUILE);
  const y0 = Math.floor((view.y - TUILE / 2) / TUILE), y1 = Math.floor((view.y + view.h + haut) / TUILE);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) out.push({ X: tx * TUILE, Y: ty * TUILE, n: ((tx * 73856093) ^ (ty * 19349663)) & 0xffff });
  return out;
}

