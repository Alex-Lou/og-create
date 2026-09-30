// src/utils/achievementChecker.js
// Conditions de succès supportées (sans évaluation de code) :
//   "this.discoveredElements.includes('Vie')"   -> l'élément est découvert
//   "this.discoveredElements.length >= 20"      -> au moins N éléments découverts
// Plusieurs clauses peuvent être combinées avec &&. Une condition non reconnue n'est jamais remplie.

const INCLUDES = /includes\(\s*['"]([^'"]+)['"]\s*\)/;
const LENGTH = /length\s*>=\s*(\d+)/;

function isClauseMet(clause, elements) {
  const includes = clause.match(INCLUDES);
  if (includes) return elements.includes(includes[1]);
  const length = clause.match(LENGTH);
  if (length) return elements.length >= parseInt(length[1], 10);
  return false;
}

export function isConditionMet(condition, elements) {
  if (typeof condition !== 'string' || !Array.isArray(elements)) return false;
  return condition.split('&&').every(clause => isClauseMet(clause, elements));
}

// Succès pas encore débloqués dont la condition est remplie
export function findNewlyUnlocked(achievements, elements) {
  return (achievements || []).filter(a => !a.unlocked && isConditionMet(a.condition, elements));
}
