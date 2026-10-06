// Les veillées, les liens et les étapes de civilisation (HISTOIRE.md, § 6.8 à 6.10 et § 10) : une veillée à la fin
// de chaque acte, quand sa dernière quête est réclamée. Tout se déduit des actes finis (serveur : brume.acts) et du nom
// du peuple ; l'appareil ne retient que les veillées déjà vues (« déduit des quêtes » sur un autre appareil : seule la
// veillée du dernier acte fini peut encore attendre).
import { talkLine } from '@/world/friends';
import { NAMES } from '@/world/faces';

export const ACTS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// Étapes de civilisation, atteintes à la fin de chaque acte (le Campement : fin du tutoriel)
const STAGES = { T: 'Le Campement', I: 'Le Camp des naufragés', II: 'Le Hameau', III: 'Le Village', IV: 'Le Bourg', V: null, VI: 'La Civilisation', VII: 'La Légende' };
export const peopleOf = people => `Le peuple de « ${people || '…'} »`;
// L'étape du dernier acte fini, ou null (rien encore)
export function stageOf(acts, people) {
  const last = (acts || [])[acts ? acts.length - 1 : 0];
  if (!last) return null;
  return last === 'V' ? peopleOf(people) : STAGES[last] || null;
}

// La troupe autour du feu, à chaque veillée (les nouveaux venus de l'acte se présentent)
const ALL = ['ponton', 'foyer', 'atelier', 'puits', 'bosquet', 'carriere', 'potager'];
const CAST = {
  I: ['ponton', 'foyer', 'atelier', 'puits', 'bosquet'],
  II: ['ponton', 'foyer', 'atelier', 'puits', 'bosquet', 'carriere'],
  III: ALL, IV: ALL, V: ALL, VI: ALL, VII: ALL
};
const NEWCOMERS = { I: ['bosquet'], II: ['carriere'], III: ['potager'] };

// Les liens : une recette qui réunit les Arts de deux naufragés (§ 6.9)
export const LINKS = [
  { id: 'vie', act: 'I', name: 'La Vie à quatre', cast: ['ponton', 'foyer', 'atelier', 'puits'], recipe: 'Vie = Air + Eau + Feu + Terre', text: 'Les quatre mains au-dessus du feu.', lines: [{ who: 'Brume', text: 'Aster, Ondin, Cannelle, Rivet. Air, Eau, Feu, Terre. Ensemble… la Vie.' }] },
  { id: 'soupe', act: 'I', name: 'La soupe et la source', cast: ['foyer', 'puits'], recipe: 'Soupe = Eau + Feu + Poisson', text: 'Cannelle gronde Ondin parce qu’il dort debout ; il lui promet l’eau la plus claire de l’île.' },
  { id: 'bois', act: 'II', name: 'Le bois et la pierre', cast: ['bosquet', 'carriere'], recipe: 'Bois = Arbre + Métal', text: 'Sylve refuse qu’on coupe ses arbres ; Galet lui montre le bois mort et le métal qui l’aide : l’Abri tient.' },
  { id: 'flamme', act: 'II', name: 'La feuille et la flamme', cast: ['bosquet', 'foyer'], recipe: 'Phénix = Feu + Vie (annonce)', text: 'Sylve a peur du feu ; Cannelle lui montre le feu qui nourrit.' },
  { id: 'enclume', act: 'III', name: 'L’enclume', cast: ['atelier', 'carriere'], recipe: 'Marteau = Bois + Métal', text: 'Rivet forge le premier vrai ciseau de Galet.', lines: [{ who: 'Galet', text: 'Hm.' }, { who: 'Brume', text: 'Il dit merci.' }] },
  { id: 'fruit', act: 'III', name: 'Le premier fruit', cast: ['bosquet', 'potager'], recipe: 'Fruit = Arbre + Fleur', text: 'La forêt et le jardin plantent ensemble.' },
  { id: 'nager', act: 'IV', name: 'Apprendre à nager', cast: ['ponton', 'puits'], recipe: 'Bateau = Bois + Eau', text: 'Ondin a peur de l’eau profonde ; Aster lui apprend.' },
  { id: 'tablee', act: 'V', name: 'La grande tablée', cast: ALL, recipe: 'Village = Maison + Maison', text: 'Une table pour tous ; on y choisit le nom du peuple.' },
  { id: 'pardon', act: 'VI', name: 'Le pardon', cast: ALL, recipe: 'Phénix = Feu + Vie', text: 'Chacun tend son Souffle vers Brume.', lines: [{ who: 'Tous', text: 'Ta flamme, notre vie.' }] }
];

// Le rite et les répliques propres à chaque veillée (§ 10)
const RITES = {
  I: { recipe: 'Lanterne = Feu + Lumière', text: 'La première lanterne s’allume, et la brume recule d’un cran sur toute la côte.' },
  II: { recipe: 'Pierre qui chante', text: 'L’orage gronde, l’Abri tient. Galet grave sa première rune sur une pierre du foyer, qui chante.' },
  IV: { recipe: 'Vent = Air + Air', text: 'Aster siffle, le vent tourne, et les voiles des voyageurs se gonflent.' },
  VII: { recipe: 'Feu follet', text: 'Un navire perdu voit la lumière et accoste : de nouveaux naufragés, cette fois accueillis.' }
};
const LINES = {
  I: [{ who: 'Brume', text: 'Chaque lumière repousse la brume. Allumons-les toutes.' }],
  III: [{ who: 'Mélisse', text: 'Trois naufrages en une saison… Il y a quelque chose, avec cette île.' }, { text: 'Brume baisse les yeux.' }],
  V: [{ text: 'Les autres t’appellent « Alchimiste ».' }, { who: 'Cannelle', text: 'Du sel ! Je sens le sel !' }],
  VI: [{ who: 'Aster', text: 'Moi aussi, je croyais que c’était ma faute.' }, { text: 'Sylve, qui avait peur du feu, allume la flamme.' }, { text: 'Phénix : Brume renaît, plus vive que jamais.' }],
  VII: [{ who: 'Brume', text: 'La brume s’est levée. {peuple} veille sur la mer.' }]
};

// La finale (§ 10, acte VII) : le Phare de Brume s'allume, juste avant la veillée VII (et l'épilogue qu'elle porte)
const FINALE = [
  { art: 'phare', caption: 'Le Phare de Brume', text: 'Tout en haut du phare, Rivet monte la lentille. « Tac ! Elle tient. »' },
  { art: 'reflet', caption: 'Le Phare de Brume', text: 'Ondin se penche sur l’eau. Dans le reflet, il voit le vrai visage de Brume.' },
  { art: 'soleil', caption: 'Le Phare de Brume', text: 'Brume entre dans la lanterne et devient le soleil du phare. La brume se lève sur l’île et sur la mer.' },
  { art: 'flammeche', text: 'Une petite flamme se détache de la lanterne et revient tout près de toi.' },
  { art: 'flammeche', who: 'Brume', text: 'Je reste avec toi.' }
];

// La veillée d'un acte, image par image (PrologueScene) ; people : le nom du peuple. La VII commence par la finale
export function vigilFrames(act, { people = null } = {}) {
  const cast = CAST[act];
  const frames = [...(act === 'VII' ? FINALE : []), { art: 'veillee', cast, caption: `Veillée ${act}`, text: 'La nuit, le feu du Foyer. La troupe se rassemble en cercle ; Brume veille au-dessus.' }];
  (NEWCOMERS[act] || []).forEach(id => frames.push({ art: 'veillee', cast, who: NAMES[id], text: talkLine(id, 0) }));
  if (RITES[act]) frames.push({ art: 'rite', cast, recipe: RITES[act].recipe, caption: 'Le rite', text: RITES[act].text });
  LINKS.filter(link => link.act === act).forEach(link => {
    frames.push({ art: 'lien', cast: link.cast, recipe: link.recipe, caption: link.name, text: link.text });
    (link.lines || []).forEach(line => frames.push({ art: 'lien', cast: link.cast, recipe: link.recipe, caption: link.name, who: line.who, text: line.text }));
  });
  (LINES[act] || []).forEach(line => frames.push({ art: 'veillee', cast, who: line.who || null, text: line.text.replace('{peuple}', peopleOf(people)) }));
  frames.push({ art: 'horizon', caption: 'Étape', text: act === 'V' ? peopleOf(people) : STAGES[act] });
  return frames;
}

// La veillée qui attend : celle du dernier acte fini (hors prologue), si elle n'a pas été vue
export function vigilDue(acts, seen) {
  const last = (acts || []).filter(act => ACTS.includes(act)).pop();
  return last && !(seen || []).includes(last) ? last : null;
}
// Liens et souvenirs déjà vécus (la Chronique) : ceux des actes finis
export const linksOf = acts => LINKS.filter(link => (acts || []).includes(link.act));
