// Les trouvailles de climat (world/finds.js ; la bulle sur l'île : world/view/gestures.js ; le sac : FindsSheet.vue) :
// le nom du gisement de chaque trouvaille et ce qu'on y fait (« Achète … pour les tondre. ») ; le verrou d'une
// trouvaille dont la clé du Grimoire n'est pas encore écrite.

// Ce qu'est le gisement de chaque trouvaille, et ce qu'on y fait
export const DEPOSIT_NAMES = {
  glace: ['Cristaux de glace', 'les détacher'], laine: ['Moutons à tondre', 'les tondre'], roseau: ['Roseaux', 'les couper'],
  sel: ['Croûte de sel', 'la gratter'], fruits: ['Arbre à fruits', 'le cueillir'], obsidienne: ['Éclats d’obsidienne', 'les ramasser'],
  // Ce que la mer rend sur la plage de Brumelune (pickups : bois, vivres, pierre pour les réserves)
  bois: ['Bois flotté', 'le ramasser'], coquillage: ['Coquillages', 'les ramasser'], galet: ['Galets', 'les ramasser'],
  // (les débris de l'Hirondelle, sur l'ancienne butte devant le Feu)
  planche: ['Planches de l’Hirondelle', 'les ramasser'], ferraille: ['Ferraille de l’Hirondelle', 'la ramasser']
};
// Le verrou parlant d'une trouvaille (name : son nom ; key : sa clé ; pages : les pages jusqu'à elle) : « Laine : il
// faut d'abord connaître « Falaise » — à écrire au Grimoire, 5 pages. »
export const LOCK_TEXT = (name, key, pages) => `${name} : il faut d’abord connaître « ${key} » — à écrire au Grimoire${pages ? `, ${pages} page${pages > 1 ? 's' : ''}` : ''}.`;
