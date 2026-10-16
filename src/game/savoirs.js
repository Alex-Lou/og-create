// Les Savoirs des maîtres (HISTOIRE.md, § 6.4) : au premier bavardage du jour, un maître souffle un indice sur une page
// de son Art (serveur : POST /world/villager/talk → savoir). Le serveur ne garde rien : l'appareil garde ce qui a été
// soufflé, comme l'Encre. L'ingrédient rejoint ceux de l'Encre (oc_book_ink : la page le montre de la même façon) ;
// oc_book_savoirs retient qui l'a soufflé, ou la famille soufflée.
import * as storage from '@/utils/storage';
import { FAMILY_WORDS } from '@/book/painter';
import { SAVOIRS as T } from '@/texts/game/savoirs';
import { AN_ELEMENT } from '@/texts/book/painter';

export const INK_KEY = 'oc_book_ink';
export const SAVOIRS_KEY = 'oc_book_savoirs';
// Le serveur en lit 400 au plus
const SENT = 400;

// Les prénoms d'avant (choix de l'auteur, 15 oct.) : un Savoir gardé sur l'appareil sous l'ancien prénom dit le nouveau
const RENAMED = { Jovin: 'Nathan', Saturnin: 'Robby', Freya: 'Maerys', Flore: 'Maggy' };
export const loadSavoirs = () => Object.fromEntries(Object.entries(storage.load(SAVOIRS_KEY, {}))
  .map(([page, savoir]) => [page, savoir && RENAMED[savoir.who] ? { ...savoir, who: RENAMED[savoir.who] } : savoir]));

// Pages dont l'appareil a déjà un indice, jointes au bavardage : known (un ingrédient), heard (une famille)
export function heardPages() {
  const ink = storage.load(INK_KEY, {});
  const savoirs = loadSavoirs();
  return {
    known: Object.keys(ink).slice(-SENT),
    heard: Object.keys(savoirs).filter(id => savoirs[id].family && !ink[id]).slice(-SENT)
  };
}

// Garde un Savoir sur l'appareil ; who : le prénom du maître
export function keepSavoir(savoir, who) {
  const savoirs = loadSavoirs();
  savoirs[savoir.page] = savoir.ingredient ? { who, ingredient: savoir.ingredient } : { who, family: savoir.family };
  storage.save(SAVOIRS_KEY, savoirs);
  if (savoir.ingredient) storage.save(INK_KEY, { ...storage.load(INK_KEY, {}), [savoir.page]: savoir.ingredient });
}

// Le Savoir de chaque maître (bible, § 4.2 et § 8.2) : son chapitre et son Art, pour sa fiche
const ARTS = {
  ponton: ['I', 'Phénomènes naturels'],
  carriere: ['II', 'Matériaux, Chimie, Physique'],
  puits: ['III', 'Cosmos, Formations naturelles'],
  bosquet: ['IV', 'Vie et créatures'],
  potager: ['IV', 'Flore, Biologie'],
  foyer: ['V', 'Corps et esprit, Créations humaines'],
  atelier: ['VI', 'Histoire, Technologie'],
  brume: ['VII', 'Légendes']
};
export const artOf = id => (ARTS[id] ? T.art(ARTS[id][1], ARTS[id][0]) : '');

// Ce que dit le maître en soufflant (chacun à sa façon ; Robby dit « Hm. », Brume traduit : texts/game/savoirs.js)
export function savoirLine(id, savoir) {
  const what = savoir.ingredient ? T.ingredient(savoir.ingredient) : T.family(FAMILY_WORDS[savoir.family] || AN_ELEMENT);
  return T.line(T.openers[id] || T.opener, savoir.chapter, what);
}
