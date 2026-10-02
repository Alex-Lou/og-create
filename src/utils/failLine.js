// Phrase d'un mélange raté (Infini) : une image selon les familles mélangées, puis un indice.
// L'indice ne dit que ce que le joueur voit déjà dans la fiche d'un élément (« N mélanges inconnus »),
// jamais un ingrédient ni un résultat : aucune recette ne peut s'en déduire.

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
const LINES = {
  'brut+brut': ['Les éléments se repoussent, encore trop bruts.', 'Ça bouillonne… puis plus rien.'],
  'brut+matiere': ['La matière résiste.', 'Un peu de fumée, aucune transformation.'],
  'brut+nature': ['La nature hausse les épaules.', 'Le vent emporte le mélange.'],
  'brut+vivant': ['La vie se recroqueville, intacte.', 'Ça frétille… mais rien ne naît.'],
  'brut+humain': ['L’outil reste un outil.', 'L’atelier reste silencieux.'],
  'brut+mythe': ['La magie refuse ce mélange.', 'Une étincelle, puis le silence des légendes.'],
  'matiere+matiere': ['Les matières ne se mêlent pas.', 'Rien ne fond, rien ne prend.'],
  'matiere+nature': ['La roche ne bronche pas.', 'Le mélange retombe en poussière.'],
  'matiere+vivant': ['La vie contourne l’obstacle.', 'Rien ne pousse là-dessus.'],
  'humain+matiere': ['L’artisan se gratte la tête.', 'Il manque un savoir-faire.'],
  'matiere+mythe': ['Le métal ne se laisse pas enchanter.', 'L’alchimie n’opère pas… pas encore.'],
  'nature+nature': ['Le ciel et la terre s’ignorent.', 'L’orage gronde au loin, sans suite.'],
  'nature+vivant': ['La créature s’enfuit devant l’orage.', 'La nature suit son cours, sans rien créer.'],
  'humain+nature': ['La nature garde son mystère.', 'Le paysage ne se laisse pas apprivoiser.'],
  'mythe+nature': ['Les légendes se taisent sous ce ciel.', 'La brume se lève, puis se dissipe.'],
  'vivant+vivant': ['Ils se regardent… et chacun repart de son côté.', 'Aucune étincelle entre eux.'],
  'humain+vivant': ['Personne ne sait quoi en faire.', 'La bête refuse d’être domptée.'],
  'mythe+vivant': ['La créature ne croit pas aux légendes.', 'Le conte s’arrête avant la fin.'],
  'humain+humain': ['Deux idées qui ne s’entendent pas.', 'L’invention attendra.'],
  'humain+mythe': ['La science reste sceptique.', 'Le sortilège échoue sur la machine.'],
  'mythe+mythe': ['Les légendes se disputent la vedette.', 'Trop de magie tue la magie.']
};
const GENERIC = ['Rien ne se passe… Essaie une autre combinaison.', 'L’Athanor reste muet.', 'Le mélange fume, mais rien ne naît.'];

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
  if (!best) return 'Ces éléments ont livré tous leurs secrets.';
  // Au-delà d'une poignée, le chiffre exact ne parle plus
  if (best.n > 9) return `Mais ${best.name} cache encore bien des mélanges.`;
  return `Mais ${best.name} cache encore ${best.n} mélange${best.n > 1 ? 's' : ''}.`;
}

// ingredients : noms mélangés ; familyOf(nom) → famille ; unexplored : { nom: nombre } du serveur
export function failLine(ingredients, { familyOf, unexplored = {}, rand = Math.random } = {}) {
  const themes = ingredients.map(name => THEME[familyOf ? familyOf(name) : '']);
  return `${image(themes, rand)} ${nudge(ingredients, unexplored)}`;
}
