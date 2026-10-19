// L'indice d'une recette en mots : la famille de chaque ingrédient, « le même », « un autre », « deux fois ».
import { FAMILY_WORDS, AN_ELEMENT, CLUE } from '@/texts/book/painter';

// Les mêmes, en un mot, sous les cases vides d'une page (après un premier essai)
const FAMILY_SHORT = {
  'Elements Fondamentaux': 'premier',
  'Matériaux': 'matériau',
  'Chimie': 'chimie',
  'Physique': 'physique',
  'Phénomènes Naturels': 'phénomène',
  'Cosmos': 'astre',
  'Formations Naturelles': 'paysage',
  'Flore': 'plante',
  'Biologie': 'vivant',
  'Vie et Créatures': 'créature',
  'Corps et Esprit': 'corps, esprit',
  'Créations Humaines': 'création',
  'Histoire': 'histoire',
  'Technologie': 'technique',
  'Légendes': 'légende'
};

// Mot de chaque case : la famille, ou « le même » pour un ingrédient déjà compté (groups identiques)
export function familyHints(clue, groups) {
  const ids = groups && groups.length === clue.length ? groups : clue.map((_, i) => i);
  return clue.map((family, i) => (ids.indexOf(ids[i]) < i ? 'le même' : FAMILY_SHORT[family] || 'élément'));
}

const TIMES = CLUE.times;

// groups : même numéro = même ingrédient (Eau + Eau → [0, 0]) ; sans eux, chaque ingrédient compte à part
export function clueText(clue, groups) {
  const ids = groups && groups.length === clue.length ? groups : clue.map((_, i) => i);
  const parts = [];
  ids.forEach((id, i) => {
    const part = parts.find(p => p.id === id);
    if (part) part.count++;
    else parts.push({ id, family: clue[i], count: 1 });
  });
  const words = parts.map((part, k) => {
    const word = FAMILY_WORDS[part.family] || AN_ELEMENT;
    if (part.count > 1) return CLUE.timesOf(TIMES[part.count], CLUE.again(word));
    // « un autre » : un ingrédient différent d'une famille déjà nommée
    return parts.findIndex(p => p.family === part.family) < k ? CLUE.another(word) : word;
  });
  if (clue.length <= 1) return CLUE.born(words[0] || CLUE.bornUnknown);
  if (words.length === 1) return CLUE.mixOne(words[0]);
  return CLUE.mix(words.slice(0, -1).join(', '), words[words.length - 1]);
}

const familyName = family => (family === 'Elements Fondamentaux' ? 'Éléments fondamentaux' : family);

export { FAMILY_SHORT, familyName };
