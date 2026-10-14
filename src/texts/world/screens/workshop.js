// L'établi du Foyer (components/World/Workshop) : la liste des créations d'île (CraftBench) et leur assemblage, en
// puzzle (CraftPuzzle).

// L'établi (CraftBench) : la note du haut ; une création qui n'a aucune case où se poser (bulle de « Poser »)
export const CRAFT_BENCH = {
  note: 'Assemble une création, puis pose-la sur l’île : chacune a sa place. Chaque création faite en ouvre d’autres.',
  noSpot: 'Aucune case libre ne convient pour l’instant.'
};

// L'assemblage (CraftPuzzle) : la consigne (sa fin selon que les pièces arrivent tournées ou non), le gabarit plein,
// la création faite
export const CRAFT_PUZZLE = {
  hint: 'Glisse chaque pièce dans le gabarit, ou touche une pièce puis une case.',
  hintTurned: ' Les pièces arrivent tournées : touche encore une pièce prise pour la tourner.',
  hintTurn: ' Touche encore une pièce prise pour la tourner.',
  complete: 'Tout est en place !',
  holes: 'Il reste des trous : reprends une pièce.',
  made: name => `${name} : c’est assemblé ! Elle t’attend dans la réserve de l’établi.`
};
