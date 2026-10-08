// Le récit sur l'île (bible HISTOIRE.md, § 6.2, § 6.7 et § 14) : les naufrages annoncés, les souvenirs retrouvés.
// Rien n'est décidé ici : la quête active et les quêtes réclamées viennent du serveur ; seuls les naufrages déjà vus
// sont retenus sur l'appareil.

// Les naufragés déjà vus débarquer sur cet appareil (WorldView/folk.js : arrivalsOf ; « Recommencer l'île » l'oublie)
export const ARRIVED_KEY = 'oc_arrived';

// Chaque manque amène un naufrage, annoncé quand la quête qui ouvre son acte devient active : l'image d'une nuit, une
// épave au loin, et Brume. zone : où dort le naufragé
export const WRECKS = {
  lisiere: { villager: 'bosquet', zone: 'lisiere', wreck: 'raft', text: 'Cette nuit, un autre bateau s’est brisé… Un radeau de bois flotté, à l’ouest.' },
  colline: { villager: 'carriere', zone: 'colline', wreck: 'boat', text: 'Cette nuit, un autre bateau s’est brisé… Un caboteur chargé de pierres, au nord-est.' },
  jardins: { villager: 'potager', zone: 'jardins', wreck: 'barque', text: 'Cette nuit, un autre bateau s’est brisé… Une barque pleine de graines, au nord.' }
};
// Le naufrage à annoncer pour cette quête active, s'il n'a pas déjà été vu sur cet appareil ; sinon null
export function wreckOf(quest, seen = []) {
  const wreck = quest && !quest.done && WRECKS[quest.id];
  return wreck && !seen.includes(quest.id) ? { id: quest.id, ...wreck } : null;
}

// Le souvenir retrouvé (le plan du palier I, § 6.2) : la quête dont la réclamation le rend, l'habitant, sa réplique.
// Mélisse se souvient dès son réveil : ses pages étaient déjà écrites
export const MEMORIES = {
  'souvenir-ondin': { villager: 'puits', line: 'Là ! Ça tire ! L’eau est là-dessous ! Ma baguette se souvient.' },
  'souvenir-sylve': { villager: 'bosquet', line: 'Arbre… Je me souviens. Ma forêt. Mes mains savent planter.' },
  'souvenir-galet': { villager: 'carriere', line: 'Hm. (Brume : “Il dit qu’il se souvient de la pierre. Et qu’il a faim.”) Hm !' },
  'eveil-melisse': { villager: 'potager', line: 'Tes pages m’ont réveillée avant toi. La Plante… je m’en souviens.' },
  'souvenir-aster': { villager: 'ponton', line: 'Un bateau… Par tous les alizés, je sais encore tenir une barre !' }
};
export const memoryOf = questId => MEMORIES[questId] || null;
