// Les coffres de l'île (components/World/Chests) : la liste des coffres (ChestList), l'ouverture d'un coffre
// (ChestReveal) et de tous d'un coup (ChestHaul).

// La liste des coffres (ChestList). (« Jour… de ta série : un coffre <strong>…</strong> t’attend. » reste dans le
// gabarit, à cause de sa balise.)
export const CHEST_LIST = {
  tomorrow: rarity => `Ouvert aujourd’hui. Demain : un coffre ${rarity}, si tu reviens.`,
  // (une bouteille échouée : la phrase, puis, dès deux coffres à ouvrir, sa fin entre parenthèses, et le point)
  bottle: 'Une bouteille s’est échouée sur une plage de ton île : touche-la pour l’ouvrir, ou ouvre-la d’ici',
  bottleAll: ' (ou tout d’un coup)',
  elsewhere: 'Une Récolte d’au moins 5 coups lâche parfois un coffre, sûr avec une chaîne de 8 tuiles. Une bouteille s’échoue sur tes plages toutes les 6 heures.'
};

// Ce qu'est le lot d'un coffre ouvert, sous son nom (ChestReveal)
export const PRIZE_KIND = {
  rare: 'Pièce rare, à porter sur son bâtiment',
  tint: 'Teinte, à porter sur son bâtiment',
  stock: 'Dans les réserves de l’île'
};

// Le total de « Tout ouvrir » : les objets gagnés (ChestHaul)
export const HAUL_ITEMS = n => `${n} ${n > 1 ? 'objets' : 'objet'} pour tes bâtiments`;
