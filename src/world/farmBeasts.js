// Les bêtes de ferme (bible, § 6.16 ; serveur : services/beasts.js) : ce qu'elles aiment, ce qu'elles donnent, et ce
// que dit leur fiche. Le serveur décide (repas, contentement, bulle) ; ici, seulement les mots.
export const LIKES = {
  hen: 'le grain, picorer au soleil et caqueter en bande',
  cow: 'l’herbe haute, et qu’on lui gratte le front',
  sheep: 'brouter tout près des autres',
  pig: 'fouiller la terre fraîche du bout du groin',
  goat: 'grimper sur tout ce qui dépasse'
};
// Ce qui remplit sa bulle (« sa bulle d’œufs »)
export const GIVES = { hen: 'd’œufs', cow: 'de lait', sheep: 'de lait et de fromage', pig: 'de truffes', goat: 'de lait et de fromage' };

// « La vache » : elle ; « Le cochon » : il
export const isShe = beast => !beast.name.startsWith('Le ');
const hoursOf = ms => Math.max(1, Math.round(ms / 3600000));
// Son humeur : « Contente encore 9 h », « Content encore 2 h » ou « A faim »
export const moodLine = beast => (beast.fed ? `${isShe(beast) ? 'Contente' : 'Content'} encore ${hoursOf(beast.left)} h` : 'A faim');
// Ce qu'elle donne, contente
export const givesLine = beast => `${isShe(beast) ? 'Contente, elle' : 'Content, il'} remplit sa bulle ${GIVES[beast.species] || 'de nourriture'} : ${beast.daily} vivres par jour.`;
