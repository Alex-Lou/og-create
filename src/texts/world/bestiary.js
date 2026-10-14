// Le Bestiaire vivant (world/bestiary.js ; la Chronique, les fiches des familiers) : ce que dit la fiche de chaque
// familier et sa réaction quand on le touche ; où vit chaque bête écrite au Grimoire. Clés des familiers : le bâtiment
// de leur maître.

// Les familiers : leur fiche (text) et ce qu'ils font quand on les touche (says)
export const FAMILIAR_TEXTS = {
  ponton: { text: 'Le macareux bougon d’Hermine. Il ne la quitte pas d’une plume.', says: 'Krrr…' },
  foyer: { text: 'La grenouille dodue de Marcelle : elle goûte tout.', says: 'Croâ ! (Il goûte ta manche.)' },
  atelier: { text: 'L’abeille mécanique de Jovin. Elle s’arrête toujours au mauvais moment.', says: 'Tic… tac… tic… clac.' },
  puits: { text: 'Le bocal de Pierrot.', says: 'Blub !' },
  bosquet: { text: 'Le renardeau de Freya. Il se cache dès qu’on le regarde.', says: 'Mousse file se cacher derrière Freya.' },
  carriere: { text: 'La tortue de Saturnin. Elle marche à son rythme.', says: 'Basalte rentre la tête. Hm.' },
  potager: { text: 'Le papillon de nuit de Flore.', says: 'Lunette danse autour de toi.' }
};

// La Chronique : où vivent les bêtes écrites ; une bête qui n'a pas encore sa place
export const PLACE = { mer: 'dans la mer', eau: 'au bord de l’eau', air: 'dans l’air et les arbres', bois: 'dans les bois', ferme: 'à la ferme du Potager', foyer: 'autour du Foyer' };
export const PLACE_SOON = 'bientôt sur l’île';
