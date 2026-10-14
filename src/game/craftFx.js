// Le spectacle de l'assemblage à l'établi (choix de l'auteur, 14 oct. ; design/conception/onomatopees.md) : le bruit
// d'une pièce posée, d'une pièce qui ne tient pas, du gabarit rempli et de la création assemblée. Rien ici ne change
// l'assemblage (world/crafts.js, vérifié par le serveur). Les mots : texts/game/onomatopees.js
import { CRAFT_WORDS } from '@/texts/game/onomatopees';

// Une pièce posée : un mot, à tour de rôle
export const PLACE_WORDS = CRAFT_WORDS.place;
// Une pièce qui ne tient pas
export const MISS_WORD = CRAFT_WORDS.miss;
// Le gabarit rempli, puis la création assemblée
export const FULL_WORD = CRAFT_WORDS.full;
export const MADE_WORD = CRAFT_WORDS.made;
// Les étincelles d'une pose (l'or de l'établi), les copeaux de bois
export const SPARKS = ['#FFF3C4', '#F2B33D', '#D98B1F'];
export const CHIPS = ['#C99A62', '#A8773F'];
// Les couleurs des mots : la pose (bois doré), le raté (gris doux), le gabarit rempli (or), la création (rose magique)
export const FILLS = { place: ['#FFF3C4', '#C98A3A'], miss: ['#FFFFFF', '#9A8F86'], full: ['#FFF3C4', '#E9A23B'], made: ['#FFE0F0', '#C46BD8'] };

export const nth = (words, n) => words[n % words.length];
