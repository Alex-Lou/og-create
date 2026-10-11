// Les zones des personnages (choix de l'auteur, 10 oct.) : sur une île à la plage, chaque personnage a la sienne, avec
// son bâtiment au milieu (serveur : world/places.js, BEACH, mêmes cases), la place autour pour ses annexes, ses objets
// et deux bâtiments à venir, et une bande libre entre deux zones pour les chemins que le joueur trace. Une zone ne se
// découvre qu'avec son personnage (world/reveal.js) : on ne les mélange pas.
// rect : [x, y, largeur, hauteur] en cases ; site : le bâtiment (et l'habitant) de la zone
export const ZONES = [
  // La plage du débarquement (le quadrilatère 22-74-205-131) : Brume l'ouvre le premier jour, Cannelle et son Feu y vivent
  { id: 'plage', site: 'foyer', rect: [95, 91, 9, 8] },
  // Chaque zone d'un personnage : la grande emprise de son bâtiment (3 × 3) et deux cases autour, la place d'un rang
  // d'annexes et de son coin (choix de l'auteur, 11 oct. : on ne dévoile que de petites zones, l'île doit toujours
  // paraître grande). Aster contre l'épave, sur le rivage : son Ponton (92, 96) et son petit camp, la mer au sud
  { id: 'aster', site: 'ponton', rect: [90, 93, 5, 6] },
  // Rivet juste au nord du Feu, au-delà du sentier : son Atelier (95, 85), son coin à l'ouest
  { id: 'rivet', site: 'atelier', rect: [93, 83, 7, 7] },
  // Ondin à l'ouest, contre le village (choix de l'auteur, 11 oct.), la mare dans sa zone : son Puits (88, 86)
  { id: 'ondin', site: 'puits', rect: [86, 84, 7, 7] },
  // Les actes suivants, au bord de leur quartier (à acheter pour y bâtir)
  { id: 'galet', site: 'carriere', rect: [84, 65, 8, 8] },
  { id: 'melisse', site: 'potager', rect: [71, 68, 7, 9] },
  { id: 'sylve', site: 'bosquet', rect: [70, 84, 7, 9] }
];

export const inRect = (x, y, [rx, ry, w, h]) => x >= rx && x < rx + w && y >= ry && y < ry + h;
