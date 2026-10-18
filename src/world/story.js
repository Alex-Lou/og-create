// Le récit sur l'île (bible HISTOIRE.md, § 6.2, § 6.7 et § 14) : les naufrages annoncés, les souvenirs retrouvés.
// Rien n'est décidé ici : la quête active et les quêtes réclamées viennent du serveur ; seuls les naufrages déjà vus
// sont retenus sur l'appareil.

import { WRECK_TEXTS, WRECK_AFTER, MEMORY_LINES } from '@/texts/story';

// Les naufragés déjà vus débarquer sur cet appareil (WorldView/castaways.js : arrivalsOf ; « Recommencer l'île » l'oublie)
export const ARRIVED_KEY = 'oc_arrived';

// Chaque manque amène un naufrage, annoncé quand la quête qui ouvre son acte devient active : l'image d'une nuit, une
// épave au loin, et Brume. zone : où dort le naufragé ; after : ce qu'on dit, l'annonce refermée
export const WRECKS = {
  lisiere: { villager: 'bosquet', zone: 'lisiere', wreck: 'raft', text: WRECK_TEXTS.lisiere, after: WRECK_AFTER.lisiere },
  colline: { villager: 'carriere', zone: 'colline', wreck: 'boat', text: WRECK_TEXTS.colline },
  jardins: { villager: 'potager', zone: 'jardins', wreck: 'barque', text: WRECK_TEXTS.jardins }
};
// Le naufrage à annoncer pour cette quête active, s'il n'a pas déjà été vu sur cet appareil ; sinon null
export function wreckOf(quest, seen = []) {
  const wreck = quest && !quest.done && WRECKS[quest.id];
  return wreck && !seen.includes(quest.id) ? { id: quest.id, ...wreck } : null;
}

// Le souvenir retrouvé (le plan du palier I, § 6.2) : la quête dont la réclamation le rend, l'habitant, sa réplique.
// Maggy se souvient dès son réveil : ses pages étaient déjà écrites
export const MEMORIES = {
  'souvenir-ondin': { villager: 'puits', line: MEMORY_LINES['souvenir-ondin'] },
  'souvenir-sylve': { villager: 'bosquet', line: MEMORY_LINES['souvenir-sylve'] },
  // (son Bosquet planté, choix de l'auteur, 14 oct. : ce qu'il donne, dit par elle ; il double le bois de la Récolte)
  bosquet: { villager: 'bosquet', line: MEMORY_LINES.bosquet },
  'souvenir-galet': { villager: 'carriere', line: MEMORY_LINES['souvenir-galet'] },
  'eveil-melisse': { villager: 'potager', line: MEMORY_LINES['eveil-melisse'] },
  'souvenir-aster': { villager: 'ponton', line: MEMORY_LINES['souvenir-aster'] }
};
export const memoryOf = questId => MEMORIES[questId] || null;
