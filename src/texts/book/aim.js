// Le verdict d'un mélange visé sur une page à portée (book/aim.js) : combien d'ingrédients sont justes, jamais lesquels.
// La ligne courte peinte sur la page, puis la phrase de l'Athanor quand le mélange visé ne donne rien.
export const AIM = {
  // right : ingrédients justes ; of : ingrédients de la page
  verdict: (right, of) => `${right} ingrédient${right > 1 ? 's' : ''} juste${right > 1 ? 's' : ''} sur ${of}`,
  none: 'aucun ingrédient juste',
  // (sur la page) le mélange essayé n'a pas le bon nombre d'ingrédients ; les essais ratés, avant l'encre offerte
  count: of => ` · il en faut ${of}`,
  misses: (misses, need) => `${misses} essai${misses > 1 ? 's' : ''} raté${misses > 1 ? 's' : ''} · encre offerte à ${need}`,
  // (l'Athanor) « Pas cette page : verdict. », puis le nombre d'ingrédients, puis l'encre
  size: of => ` Cette page se fait avec ${of} ingrédients.`,
  freeInk: ' L’encre de la page est offerte.',
  left: left => ` Encore ${left} essai${left > 1 ? 's' : ''} et l’encre est offerte.`,
  message: (verdict, count, ink) => `Pas cette page : ${verdict}.${count}${ink}`
};
