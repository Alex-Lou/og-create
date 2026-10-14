// Phrase d'un mélange raté (Infini) : une image selon les familles mélangées, puis un indice.
// L'indice ne dit que ce que le joueur voit déjà dans la fiche d'un élément (« N mélanges inconnus »),
// jamais un ingrédient ni un résultat : aucune recette ne peut s'en déduire. Les phrases : texts/game/failLine.js.
import { FAIL_LINES as T } from '@/texts/game/failLine';

// Familles regroupées en grands thèmes
const THEME = {
  'Elements Fondamentaux': 'brut',
  'Matériaux': 'matiere', 'Chimie': 'matiere', 'Physique': 'matiere',
  'Phénomènes Naturels': 'nature', 'Formations Naturelles': 'nature', 'Cosmos': 'nature',
  'Vie et Créatures': 'vivant', 'Flore': 'vivant', 'Biologie': 'vivant', 'Corps et Esprit': 'vivant',
  'Créations Humaines': 'humain', 'Histoire': 'humain', 'Technologie': 'humain',
  'Légendes': 'mythe'
};

// Images par paire de thèmes (clé triée) ; « x+x » pour un seul thème
const LINES = T.images;
const GENERIC = T.generic;

function pick(list, rand) {
  return list[Math.min(list.length - 1, Math.floor(rand() * list.length))];
}

// Image du raté : les deux premiers thèmes distincts du mélange (ou un seul s'ils sont tous pareils)
function image(themes, rand) {
  const distinct = [...new Set(themes.filter(Boolean))].sort();
  if (!distinct.length) return pick(GENERIC, rand);
  const key = distinct.length === 1 ? `${distinct[0]}+${distinct[0]}` : `${distinct[0]}+${distinct[1]}`;
  return pick(LINES[key] || GENERIC, rand);
}

// Indice : l'ingrédient qui cache le plus de mélanges inconnus, ou « tout est exploré »
function nudge(names, unexplored) {
  let best = null;
  for (const name of new Set(names)) {
    const n = unexplored[name] || 0;
    if (n > 0 && (!best || n > best.n)) best = { name, n };
  }
  if (!best) return T.explored;
  // Au-delà d'une poignée, le chiffre exact ne parle plus
  if (best.n > 9) return T.many(best.name);
  return T.few(best.name, best.n);
}

// ingredients : noms mélangés ; familyOf(nom) → famille ; unexplored : { nom: nombre } du serveur
export function failLine(ingredients, { familyOf, unexplored = {}, rand = Math.random } = {}) {
  const themes = ingredients.map(name => THEME[familyOf ? familyOf(name) : '']);
  return `${image(themes, rand)} ${nudge(ingredients, unexplored)}`;
}
