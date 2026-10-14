// Le spectacle de la Récolte (choix de l'auteur, 14 oct. : « pas trop, mais waouh ») : ce que dit et fait chaque coup,
// selon la ressource cueillie et la longueur de la chaîne. Des mots doux d'île magique, pas de bagarre (choix de
// l'auteur, 14 oct. ; la série des autres mini-jeux : design/conception/onomatopees.md). Rien ici ne change le jeu :
// les gains restent ceux du moteur (game/harvest.js), que le serveur rejoue.
import { TIERS, tierAt } from './stage/tiers';

// Chaque ressource : ses onomatopées (une par coup, à tour de rôle), sa matière (forme et couleurs des éclats), sa couleur
export const KIND_FX = {
  wood: { words: ['Toc !', 'Toc toc !', 'Cric-crac !'], shape: 'splinter', colors: ['#C98A4A', '#E2BD8C', '#8E5A2B', '#F2DEC0'], fill: ['#FFE1A8', '#E09A45'] },
  stone: { words: ['Cloc !', 'Clic-clac !', 'Tac !'], shape: 'chip', colors: ['#A9A296', '#D9D2C5', '#7E776C', '#EFEAE0'], fill: ['#F4F1EA', '#A9A296'] },
  water: { words: ['Plic !', 'Ploc !', 'Flic-floc !'], shape: 'drop', colors: ['#6FB8E6', '#A9DBF1', '#3E8FD0', '#E4F6FF'], fill: ['#D8F2FF', '#4FA3E0'] },
  food: { words: ['Frou-frou !', 'Hop !', 'Miam !'], shape: 'leaf', colors: ['#E8604C', '#F7C1A5', '#7DB46E', '#F2B33D'], fill: ['#FFD7C4', '#E8604C'] },
  fish: { words: ['Bloup !', 'Flip-flap !', 'Plouf !'], shape: 'bubble', colors: ['#9CCBE6', '#E4F6FF', '#5E9CC8', '#F2B33D'], fill: ['#E4F6FF', '#5E9CC8'] },
  // la lune (règles 2) : jamais la sorte d'une chaîne, elle n'a pas de mot ; ses éclats sont des étoiles d'or
  lune: { words: [], shape: 'star', colors: ['#FFD24A', '#FFF2B8', '#F2B33D', '#FFFFFF'], fill: ['#FFF2B8', '#F2B33D'] }
};

// Les paliers (game/stage/tiers.js) selon la longueur de la chaîne : Joli ! à 4 tuiles, Superbe ! à 5, Magique ! à 7,
// Féerique ! à 9, Clair de lune ! à 12
const CHAIN_STEPS = [4, 5, 7, 9, 12];
export { TIERS };
export const tierOf = n => tierAt(n, CHAIN_STEPS);

// L'onomatopée d'un coup : celle de sa ressource, à tour de rôle (moveIndex : le rang du coup dans la partie)
export const wordOf = (kind, moveIndex) => {
  const words = (KIND_FX[kind] || KIND_FX.stone).words;
  return words[moveIndex % words.length];
};

// La série en cours : combien de coups d'affilée, jusqu'au dernier, ont fait une belle chaîne (au moins `min` tuiles)
export function streakOf(lengths, min = 5) {
  let n = 0;
  for (let i = lengths.length - 1; i >= 0 && lengths[i] >= min; i--) n++;
  return n;
}
