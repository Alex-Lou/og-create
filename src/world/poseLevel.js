// Les cases dorées d'une pose (déplacer un bâtiment, poser une annexe ou une création), un seul niveau à la fois (choix
// de l'auteur, 13 oct.) : sur une île à plateaux, les cases du plateau et celles du sol se dessinaient les unes sur les
// autres et l'on touchait la mauvaise. Seules les cases du niveau actif s'allument et se touchent ; au départ, le niveau
// du bâtiment ; un toucher où le niveau actif n'a pas de case dorée passe au niveau de la case sous le doigt.
// levelAt(x, y) : le niveau (la hauteur du sol) d'une case.

// Les cases dorées du niveau actif (toutes s'il n'y en a aucune, ou pas de niveau choisi)
export function spotsOnLevel(spots, level, levelAt) {
  if (level === null || level === undefined) return spots;
  const on = spots.filter(sp => levelAt(sp.x, sp.y) === level);
  return on.length ? on : spots;
}

// Le niveau du départ : celui demandé s'il a des cases dorées, sinon celui de la première case dorée
export function startLevel(level, spots, levelAt) {
  if (spots.some(sp => levelAt(sp.x, sp.y) === level)) return level;
  return spots.length ? levelAt(spots[0].x, spots[0].y) : null;
}

// Un toucher : tileAt(keep) rend la case sous le doigt, la plus en avant, parmi celles que keep(x, y) garde (toutes sans
// keep), ou null. D'abord une case dorée du niveau actif ; sinon le niveau passe à celui de la case sous le doigt (elle
// est choisie si elle est dorée). Rend { cell (la case choisie, ou null), level (le niveau actif après ce toucher) }
export function pickSpot({ spots, level, levelAt, tileAt }) {
  const golden = (x, y) => spots.some(sp => sp.x === x && sp.y === y);
  if (level !== null && level !== undefined) {
    const own = tileAt((x, y) => levelAt(x, y) === level && golden(x, y));
    if (own) return { cell: own, level };
  }
  const front = tileAt();
  if (!front) return { cell: null, level };
  return { cell: golden(front.x, front.y) ? front : null, level: levelAt(front.x, front.y) };
}
