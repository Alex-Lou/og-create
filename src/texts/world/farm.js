// Les bêtes de ferme (world/farmBeasts.js ; leur fiche : BeastSheet.vue) : ce qu'elles aiment, ce qui remplit leur
// bulle, leur humeur, ce qu'elles donnent et ce qui attend dans leur bulle. Clés : l'espèce (hen, rooster, chick, cow,
// sheep, pig, goat ; serveur : services/beasts.js).

// Ce qu'elles aiment (leur fiche)
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

// Son humeur, contente (she : elle ; hours : le temps qui reste) : « Contente encore 9 h », « Content encore 2 h »
export const MOOD_FED = (she, hours) => `${she ? 'Contente' : 'Content'} encore ${hours} h`;
// Ce qu'elle donne, contente : un poussin grandit ; le coq veille ; Réglisse ne pond pas ; les œufs des poules comptent
// en vivres (choix de l'auteur, 14 oct.) ; les autres bêtes (gives : ce qui remplit leur bulle, sinon any)
export const GIVES_LINE = {
  chick: 'Trop petit pour pondre : il grandit.',
  rooster: name => `${name} ne pond pas. Il veille.`,
  none: name => `${name} ne pond pas. Elle juge.`,
  hen: daily => `Contente, elle remplit sa bulle d’œufs : ${daily} œufs par jour, comptés en vivres.`,
  any: 'de nourriture',
  other: (she, gives, daily) => `${she ? 'Contente, elle' : 'Content, il'} remplit sa bulle ${gives} : ${daily} vivres par jour.`
};
// Ce qui attend dans sa bulle (s : la marque du pluriel) : des œufs pour une poule, des vivres sinon
export const READY_LINE = {
  hen: (ready, s) => `${ready} œuf${s} dans sa bulle`,
  other: (ready, s) => `${ready} vivre${s} dans sa bulle`
};
