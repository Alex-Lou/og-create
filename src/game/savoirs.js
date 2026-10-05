// Les Savoirs des maîtres (HISTOIRE.md, § 6.4) : au premier bavardage du jour, un maître souffle un indice sur une page
// de son Art (serveur : POST /world/villager/talk → savoir). Le serveur ne garde rien : l'appareil garde ce qui a été
// soufflé, comme l'Encre. L'ingrédient rejoint ceux de l'Encre (oc_book_ink : la page le montre de la même façon) ;
// oc_book_savoirs retient qui l'a soufflé, ou la famille soufflée.
import * as storage from '@/utils/storage';
import { FAMILY_WORDS } from '@/book/painter';

export const INK_KEY = 'oc_book_ink';
export const SAVOIRS_KEY = 'oc_book_savoirs';
// Le serveur en lit 400 au plus
const SENT = 400;

export const loadSavoirs = () => storage.load(SAVOIRS_KEY, {});

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
  atelier: ['VI', 'Histoire, Technologie']
};
export const artOf = id => (ARTS[id] ? `Son Savoir : ${ARTS[id][1]} (chapitre ${ARTS[id][0]}). Un indice par jour, en bavardant.` : '');

// Ce que dit le maître en soufflant (chacun à sa façon ; Galet dit « Hm. », Brume traduit)
const OPENERS = {
  ponton: 'Le vent me l’a soufflé :',
  foyer: 'Goûte-moi ça, ma brindille :',
  atelier: 'Tac ! Calcul fait :',
  puits: 'Chut… l’eau me dit :',
  bosquet: 'Feuilles disent :',
  carriere: 'Hm. (Brume traduit :)',
  potager: 'La lune me souffle :'
};
export function savoirLine(id, savoir) {
  const what = savoir.ingredient ? `il faut « ${savoir.ingredient} »` : `un ingrédient est ${FAMILY_WORDS[savoir.family] || 'un élément'}`;
  return `${OPENERS[id] || 'Écoute :'} sur une page du chapitre ${savoir.chapter}, ${what}. C’est noté au Grimoire.`;
}
