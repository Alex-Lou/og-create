// La feuille des chapitres (components/Book/ChapterSheet), ouverte depuis la puce au-dessus du Livre : chaque chapitre
// et chaque page pour les lecteurs d'écran, et un chapitre sans page à portée. Les libellés (« Sommaire »,
// « Chapitres », « Couverture », les flèches) restent dans le code.
import { PAGES } from './painter';

export const CHAPTER_SHEET = {
  open: (id, name, found, total) => `Chapitre ${id}, ${name} : ${found} pages sur ${total}, voir ses pages`,
  sealed: (id, name, left) => `Chapitre ${id}, ${name}, scellé : encore ${left} découvertes`,
  // Chaque page : les mêmes mots que sur la table du chapitre (texts/book/painter.js)
  entryFound: PAGES.entryFound,
  entryReach: PAGES.entryReach,
  empty: 'Rien à portée pour l’instant : chaque découverte en rapproche.'
};
