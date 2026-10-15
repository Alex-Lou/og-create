// Amitié des habitants (lot 6d) : ce qu'ils disent quand on bavarde avec eux, selon leurs cœurs (0 à 5), et quand on
// leur offre ce qu'ils adorent. Les prénoms, les goûts, les points et les récompenses viennent du serveur
// (services/villagers.js, mêmes identifiants : le bâtiment où chacun travaille).
// Leurs voix et leur passé, raconté cœur après cœur, suivent la bible (HISTOIRE.md, § 8.2).

import { TALKS, LOVED, LIKED, OTHER, SETTLER_TALKS } from '@/texts/world/friends';

// Réplique quand on bavarde, selon les cœurs
export function talkLine(id, hearts) {
  const lines = TALKS[id] || (/^v\d+$/.test(id) ? SETTLER_TALKS : TALKS.foyer);
  return lines[Math.max(0, Math.min(lines.length - 1, hearts))];
}
// Réaction à un cadeau : la phrase du maître, ou la phrase commune (un voyageur installé)
export function giftLine(id, villager, resource) {
  if (resource === villager.loves) return LOVED[id] || LIKED[id] || LIKED.common;
  const lines = resource === villager.likes ? LIKED : OTHER;
  return lines[id] || lines.common;
}
// Récompense d'un cœur, en clair : « 40 écus », « Coffre épique »
const RARITY_LABEL = { commun: 'commun', rare: 'rare', epique: 'épique', legendaire: 'légendaire' };
export function rewardText(reward) {
  return reward.kind === 'coins' ? `${reward.amount} écus` : `Coffre ${RARITY_LABEL[reward.rarity] || ''}`.trim();
}
// Un habitant attend une visite aujourd'hui : pas encore bavardé ou pas encore de cadeau
export const awaits = villager => !villager.talked || !villager.gifted;
