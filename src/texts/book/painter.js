// Les pages peintes du Grimoire (book/painter.js) : ce qui s'écrit sur les pages (familles en mots, énigmes en
// familles, pages lointaines, chapitres, sommaire) et ce que chaque page dit aux lecteurs d'écran. Les libellés
// (« Inscrite », « Table », « Chapitre scellé », les boutons de l'Encre et du pendu, les familles en un mot sous les
// cases) restent dans le code. Aussi lus par game/savoirs.js (un Savoir soufflé), le pendu (HangmanSheet) et la feuille
// des chapitres (ChapterSheet).

// Un ingrédient dont on ne sait rien
export const AN_ELEMENT = 'un élément';

// Familles dites en mots : ingrédients d'une page à portée, et type de l'élément dans le pendu
export const FAMILY_WORDS = {
  'Elements Fondamentaux': 'un élément premier',
  'Matériaux': 'un matériau',
  'Chimie': 'une substance chimique',
  'Physique': 'une force de la physique',
  'Phénomènes Naturels': 'un phénomène naturel',
  'Cosmos': 'un astre du cosmos',
  'Formations Naturelles': 'un paysage',
  'Flore': 'une plante',
  'Biologie': 'une chose du vivant',
  'Vie et Créatures': 'une créature',
  'Corps et Esprit': 'une part du corps ou de l’esprit',
  'Créations Humaines': 'une création humaine',
  'Histoire': 'un fragment d’histoire',
  'Technologie': 'une technologie',
  'Légendes': 'une légende'
};

// Une page sans énigme se dit par les familles de ses ingrédients (« Mêle un matériau et une plante. »)
export const CLUE = {
  // Un même ingrédient plusieurs fois : « deux fois le même matériau »
  times: ['', '', 'deux', 'trois', 'quatre'],
  again: word => word.replace(/^un /, 'le même ').replace(/^une /, 'la même '),
  timesOf: (times, word) => `${times} fois ${word}`,
  // Un ingrédient différent d'une famille déjà nommée : « un autre matériau »
  another: word => word.replace(/^(un|une) /, '$1 autre '),
  // Un seul ingrédient (ou aucun connu), un seul nommé, plusieurs
  born: word => `Naît ${word}.`,
  bornUnknown: 'd’un mélange',
  mixOne: word => `Mêle ${word}.`,
  mix: (words, last) => `Mêle ${words} et ${last}.`
};

export const PAGES = {
  // Page trouvée, sans recette : un élément premier, ou une recette perdue
  firstElement: 'Élément premier : tout commence ici.',
  lostRecipe: 'Né d’un mélange dont la trace s’est perdue.',
  // (lecteurs d'écran) la page trouvée : son nom, sa famille, son énigme, sa recette
  found: (name, family, riddle, recipe) => `${name}, inscrite. Famille ${family}.${riddle ? ` « ${riddle} »` : ''}${recipe ? ` Née de ${recipe.join(' et ')}.` : ''}`,

  // Page à portée : sa famille et ses lettres, sous les traits du nom ; qui a soufflé l'indice (Savoirs)
  letters: (family, n) => `${family} · ${n} lettres`,
  whispered: who => `Soufflé par ${who}`,
  // (lecteurs d'écran) les zones de la page : le pendu, l'Encre, le sceau
  openHangman: 'Ouvrir le pendu de la page',
  guessBlanks: 'Deviner le nom lettre par lettre',
  guessButton: 'Pendu : deviner le nom lettre par lettre',
  inkFree: 'Encre offerte : révéler un ingrédient',
  inkPaid: price => `Encre : révéler un ingrédient pour ${price} écus`,
  seal: picked => `Sceller le mélange : ${picked.join(' et ')}`,
  // (lecteurs d'écran) la page à portée : « Page à trouver : famille, n lettres, commence par… Énigme : … », puis le
  // verdict, la famille soufflée, l'ingrédient révélé
  starts: first => `, commence par ${first}`,
  riddle: (riddle, more) => `Énigme : ${riddle}${more}`,
  heard: words => ` Un ingrédient est ${words}.`,
  revealed: name => ` Un ingrédient : ${name}.`,
  reach: (family, letters, start, clue, note, said, revealed) => `Page à trouver : ${family}, ${letters} lettres${start}. ${clue}${note}${said}${revealed}`,

  // Pages lointaines (il manque des ingrédients) ou en attente (elles s'ouvrent une à une)
  far: count => `${count} page${count > 1 ? 's' : ''} lointaine${count > 1 ? 's' : ''}`,
  queued: waiting => `${waiting} page${waiting > 1 ? 's' : ''} en attente`,
  queuedText: 'Elles s’ouvrent une à une : chaque page trouvée dans ce chapitre en ouvre une autre.',
  farText: 'Il te manque encore des ingrédients pour les tenter. Chaque découverte en rapproche quelques-unes.',
  beyond: far => `Et ${far} au-delà.`,
  queuedLabel: (queued, count, far) => `${queued} dans ce chapitre${count ? `, et ${far}` : ''}.`,
  farLabel: far => `${far} dans ce chapitre.`,

  // La table d'un chapitre (et la feuille des chapitres) : chaque page, pour les lecteurs d'écran ; la table entière
  entryFound: name => `${name}, inscrite`,
  entryReach: letters => `Page à trouver, ${letters} lettres`,
  index: (id, part, parts, reach, inscribed) => `Table du chapitre ${id}${parts > 1 ? `, feuille ${part} sur ${parts}` : ''} : ${reach} page${reach > 1 ? 's' : ''} à trouver, ${inscribed} inscrite${inscribed > 1 ? 's' : ''}.`,

  // La page de titre d'un chapitre : ses pages inscrites, celles à portée ; scellé, ce qui manque
  inscribed: (found, total) => `${found} / ${total} pages inscrites`,
  inReach: reach => `${reach} à portée de mélange`,
  nothingInReach: 'Rien à portée pour l’instant',
  sealedLeft: left => `encore ${left} découverte${left > 1 ? 's' : ''} pour l’ouvrir`,
  // (lecteurs d'écran) « Chapitre I, nom. Sa phrase. », puis son état
  chapter: (id, name, verse, state) => `Chapitre ${id}, ${name}.${verse ? ` ${verse}` : ''} ${state}`,
  chapterOpen: (found, total) => `${found} pages inscrites sur ${total}.`,
  chapterSealed: left => `Scellé : encore ${left} découvertes.`,

  // Le sommaire : les découvertes sous le titre, la consigne en bas ; pour les lecteurs d'écran, chaque chapitre
  discoveries: n => `${n} découverte${n > 1 ? 's' : ''}`,
  noDiscovery: 'aucune découverte',
  subtitle: found => `Grimoire d’alchimie · ${found}`,
  tocHint: 'Touche un chapitre, ou tourne la page.',
  tocEntry: (id, name, open) => `Chapitre ${id}, ${name}${open ? '' : ', scellé'}`,
  toc: (title, chapters) => `Sommaire du ${title}. ${chapters}.`,
  tocChapter: (id, name) => `Chapitre ${id}, ${name}`,

  // (lecteurs d'écran) les gardes du grimoire
  endpaperFront: title => `Garde du grimoire : ex-libris du ${title}.`,
  endpaperBack: 'Garde de fin du grimoire.'
};
