// Les bêtes de ferme (bible, § 6.16 ; serveur : services/beasts.js) : ce qu'elles aiment, ce qu'elles donnent, et ce
// que dit leur fiche. Le serveur décide (repas, contentement, bulle) ; ici, seulement les mots.
export const LIKES = {
  hen: 'le grain, picorer au soleil et caqueter en bande',
  rooster: 'percher haut, chanter fort et veiller sur ses poules',
  chick: 'suivre sa mère partout et dormir sous son aile',
  cow: 'l’herbe haute, et qu’on lui gratte le front',
  sheep: 'brouter tout près des autres',
  pig: 'fouiller la terre fraîche du bout du groin',
  goat: 'grimper sur tout ce qui dépasse'
};
// Ce qui remplit sa bulle (« sa bulle d’œufs »)
export const GIVES = { hen: 'd’œufs', cow: 'de lait', sheep: 'de lait et de fromage', pig: 'de truffes', goat: 'de lait et de fromage' };

// Le sur-titre de sa fiche : les bêtes du poulailler de Marcelle, puis celles de la ferme
const EYEBROWS = { hen: 'Poule de Marcelle', rooster: 'Coq de Marcelle', chick: 'Poussin de Marcelle' };
export const eyebrowOf = beast => EYEBROWS[beast.species] || 'Bête de la ferme';

// « La vache » : elle ; « Le cochon » : il ; le coq et un poussin : il
export const isShe = beast => !beast.name.startsWith('Le ') && beast.species !== 'rooster' && beast.species !== 'chick';
const hoursOf = ms => Math.max(1, Math.round(ms / 3600000));
// Son humeur : « Contente encore 9 h », « Content encore 2 h » ou « A faim »
export const moodLine = beast => (beast.fed ? `${isShe(beast) ? 'Contente' : 'Content'} encore ${hoursOf(beast.left)} h` : 'A faim');
// Ce qu'elle donne, contente (Réglisse ne pond pas : « Elle juge. » ; le coq veille ; un poussin grandit) ; les œufs des
// poules comptent en vivres (choix de l'auteur, 14 oct.)
export function givesLine(beast) {
  if (beast.chick) return 'Trop petit pour pondre : il grandit.';
  if (beast.species === 'rooster') return `${beast.name} ne pond pas. Il veille.`;
  if (!beast.daily) return `${beast.name} ne pond pas. Elle juge.`;
  if (beast.species === 'hen') return `Contente, elle remplit sa bulle d’œufs : ${beast.daily} œufs par jour, comptés en vivres.`;
  return `${isShe(beast) ? 'Contente, elle' : 'Content, il'} remplit sa bulle ${GIVES[beast.species] || 'de nourriture'} : ${beast.daily} vivres par jour.`;
}
// Ce qui attend dans sa bulle : des œufs pour une poule, des vivres sinon
export const readyLine = beast => {
  const s = beast.ready > 1 ? 's' : '';
  return beast.species === 'hen' ? `${beast.ready} œuf${s} dans sa bulle` : `${beast.ready} vivre${s} dans sa bulle`;
};
