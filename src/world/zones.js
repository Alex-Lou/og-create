// Les zones des personnages (choix de l'auteur, 10 oct.) : sur une île à la plage, chaque personnage a la sienne, avec
// son bâtiment au milieu (serveur : world/places.js, BEACH, mêmes cases), la place autour pour ses annexes, ses objets
// et deux bâtiments à venir, et une bande libre entre deux zones pour les chemins que le joueur trace. Une zone ne se
// découvre qu'avec son personnage (world/reveal.js) : on ne les mélange pas.
// rect : [x, y, largeur, hauteur] en cases ; site : le bâtiment (et l'habitant) de la zone
export const ZONES = [
  // La plage du débarquement (le quadrilatère 22-74-205-131) : Brume l'ouvre le premier jour, Cannelle et son Feu y vivent
  { id: 'plage', site: 'foyer', rect: [94, 91, 10, 8] },
  // Aster au sud-ouest, contre la mer : son Ponton
  { id: 'aster', site: 'ponton', rect: [85, 92, 8, 9] },
  // Rivet au nord du Feu : son Atelier
  { id: 'rivet', site: 'atelier', rect: [91, 81, 8, 8] },
  // Ondin à l'ouest, le ruisseau dans sa zone : son Puits
  { id: 'ondin', site: 'puits', rect: [81, 82, 8, 9] },
  // Les actes suivants, au bord de leur quartier (à acheter pour y bâtir)
  { id: 'galet', site: 'carriere', rect: [84, 65, 8, 8] },
  { id: 'melisse', site: 'potager', rect: [71, 68, 7, 9] },
  { id: 'sylve', site: 'bosquet', rect: [70, 84, 7, 9] }
];

export const inRect = (x, y, [rx, ry, w, h]) => x >= rx && x < rx + w && y >= ry && y < ry + h;
