// Les bêtes de ferme (bible, § 6.16 ; serveur : services/beasts.js) : ce qu'elles aiment, ce qu'elles donnent, et ce
// que dit leur fiche. Le serveur décide (repas, contentement, bulle) ; ici, seulement les mots.
import { LIKES, GIVES, MOOD_FED, GIVES_LINE, READY_LINE } from '@/texts/world/farm';

// Ce qu'elles aiment ; ce qui remplit leur bulle (« sa bulle d’œufs »)
export { LIKES, GIVES };

// Le sur-titre de sa fiche : les bêtes du poulailler de Marcelle, puis celles de la ferme
const EYEBROWS = { hen: 'Poule de Marcelle', rooster: 'Coq de Marcelle', chick: 'Poussin de Marcelle' };
export const eyebrowOf = beast => EYEBROWS[beast.species] || 'Bête de la ferme';

// « La vache » : elle ; « Le cochon » : il ; le coq et un poussin : il
export const isShe = beast => !beast.name.startsWith('Le ') && beast.species !== 'rooster' && beast.species !== 'chick';
const hoursOf = ms => Math.max(1, Math.round(ms / 3600000));
// Son humeur : « Contente encore 9 h », « Content encore 2 h » ou « A faim »
export const moodLine = beast => (beast.fed ? MOOD_FED(isShe(beast), hoursOf(beast.left)) : 'A faim');
// Ce qu'elle donne, contente (Réglisse ne pond pas : « Elle juge. » ; le coq veille ; un poussin grandit) ; les œufs des
// poules comptent en vivres (choix de l'auteur, 14 oct.)
export function givesLine(beast) {
  if (beast.chick) return GIVES_LINE.chick;
  if (beast.species === 'rooster') return GIVES_LINE.rooster(beast.name);
  if (!beast.daily) return GIVES_LINE.none(beast.name);
  if (beast.species === 'hen') return GIVES_LINE.hen(beast.daily);
  return GIVES_LINE.other(isShe(beast), GIVES[beast.species] || GIVES_LINE.any, beast.daily);
}
// Ce qui attend dans sa bulle : des œufs pour une poule, des vivres sinon
export const readyLine = beast => {
  const s = beast.ready > 1 ? 's' : '';
  return beast.species === 'hen' ? READY_LINE.hen(beast.ready, s) : READY_LINE.other(beast.ready, s);
};
