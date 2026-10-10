// Portraits des sept maîtres hors de l'île (bulles du guide, scènes, fiches) : la première image d'une pose, de face ou
// de trois quarts avant, en naufragé ou en maître. Séparé de masterArt.js (les dessins de l'île) pour que le code chargé
// au démarrage n'emporte ni la liste de toutes les poses de l'île ni quotidien.json : les adresses se lisent au nom
// des fichiers de la bibliothèque (maitres/<nom>/<nom>_<vue>_<pose>_1.svg, naufrages/<nom>/<nom>-naufrage_…), le même
// que celui que liste quotidien.json (tests/masterPortraits.test.js le vérifie pour chaque maître et chaque pose).
const ROOT = '/design/bibliotheque/svg/personnages/';
const URLS = import.meta.glob('/design/bibliotheque/svg/personnages/{maitres,naufrages}/*/*_{face,avant}_{repos,travail,marche,assis}_1.svg', { query: '?url', import: 'default', eager: true });

// Le maître de chaque bâtiment
export const MASTERS = { ponton: 'aster', foyer: 'cannelle', atelier: 'rivet', puits: 'ondin', bosquet: 'sylve', carriere: 'galet', potager: 'melisse' };
export const VIEWS = { front: 'face', se: 'avant', ne: 'dos' };
export const POSES = { walk: 'marche', idle: 'repos', work: 'travail', wave: 'salut', sit: 'assis' };

const fileOf = (name, castaway, drawn, pose) => `${ROOT}${castaway ? `naufrages/${name}/${name}-naufrage` : `maitres/${name}/${name}`}_${drawn}_${pose}_1.svg`;

// L'adresse du portrait (sans geste dans la bibliothèque : au repos), ou null
export function masterPortrait(role, castaway, { view = 'front', pose = 'idle' } = {}) {
  const name = MASTERS[role];
  const drawn = VIEWS[view];
  if (!name || !drawn) return null;
  return URLS[fileOf(name, castaway, drawn, POSES[pose])] || URLS[fileOf(name, castaway, drawn, 'repos')] || null;
}
