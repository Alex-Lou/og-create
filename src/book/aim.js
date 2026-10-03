// Verdict d'un mélange visé sur une page à portée : combien d'ingrédients sont justes, jamais lesquels.
// aim = { tried: [noms essayés], right, of, misses (null pour un invité), need, freeInk }

const verdict = aim => (aim.right
  ? `${aim.right} ingrédient${aim.right > 1 ? 's' : ''} juste${aim.right > 1 ? 's' : ''} sur ${aim.of}`
  : 'aucun ingrédient juste');

// Ligne courte peinte sur la page
export function aimNote(aim, misses, need) {
  if (aim) {
    const count = aim.tried.length !== aim.of ? ` · il en faut ${aim.of}` : '';
    return `${aim.tried.join(' + ')} → ${verdict(aim)}${count}`;
  }
  if (misses && need && misses < need) return `${misses} essai${misses > 1 ? 's' : ''} raté${misses > 1 ? 's' : ''} · encre offerte à ${need}`;
  return '';
}

// Phrase de l'Athanor quand le mélange visé ne donne rien
export function aimMessage(aim) {
  const count = aim.tried.length !== aim.of ? ` Cette page se fait avec ${aim.of} ingrédients.` : '';
  let ink = '';
  if (aim.freeInk) ink = ' L’encre de la page est offerte.';
  else if (aim.misses !== null && aim.need) {
    const left = aim.need - aim.misses;
    ink = ` Encore ${left} essai${left > 1 ? 's' : ''} et l’encre est offerte.`;
  }
  return `Pas cette page : ${verdict(aim)}.${count}${ink}`;
}
