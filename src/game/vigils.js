// Les veillées, les liens et les étapes de civilisation (HISTOIRE.md, § 6.8 à 6.10 et § 10) : une veillée à la fin
// de chaque acte, quand sa dernière quête est réclamée. Tout se déduit des actes finis (serveur : brume.acts) et du nom
// du peuple ; l'appareil ne retient que les veillées déjà vues (« déduit des quêtes » sur un autre appareil : seule la
// veillée du dernier acte fini peut encore attendre).
import { talkLine } from '@/world/friends';
import { NAMES } from '@/world/faces';
import { VIGILS as T } from '@/texts/game/vigils';

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
  { id: 'vie', act: 'I', name: 'La Vie à quatre', cast: ['ponton', 'foyer', 'atelier', 'puits'], recipe: 'Vie = Air + Eau + Feu + Terre', text: T.links.vie, lines: [{ who: 'Brume', text: T.linkLines.vieBrume }] },
  { id: 'soupe', act: 'I', name: 'La soupe et la source', cast: ['foyer', 'puits'], recipe: 'Soupe = Eau + Feu + Poisson', text: T.links.soupe, lines: [{ who: 'Marcelle', text: T.linkLines.soupeMarcelle }, { who: 'Pierrot', text: T.linkLines.soupePierrot }, { who: 'Pierrot', text: T.linkLines.soupePierrotSource }, { who: 'Marcelle', text: T.linkLines.soupeMarcelleNuit }] },
  { id: 'bois', act: 'II', name: 'Le bois et la pierre', cast: ['bosquet', 'carriere'], recipe: 'Bois = Arbre + Métal', text: T.links.bois, lines: [{ who: 'Freya', text: T.linkLines.boisFreya }, { who: 'Saturnin', text: T.linkLines.boisSaturnin }, { who: 'Freya', text: T.linkLines.boisFreyaMorte }, { who: 'Saturnin', text: T.linkLines.boisSaturninFinie }] },
  // (sa dernière réplique, un récit : sans personne qui parle)
  { id: 'flamme', act: 'II', name: 'La feuille et la flamme', cast: ['bosquet', 'foyer'], recipe: 'Phénix = Feu + Vie (annonce)', text: T.links.flamme, lines: [{ who: 'Marcelle', text: T.linkLines.flammeMarcelle }, { who: 'Freya', text: T.linkLines.flammeFreya }, { who: 'Marcelle', text: T.linkLines.flammeMarcelleBol }, { text: T.linkLines.flammeRecit }] },
  { id: 'enclume', act: 'III', name: 'L’enclume', cast: ['atelier', 'carriere'], recipe: 'Marteau = Bois + Métal', text: T.links.enclume, lines: [{ who: 'Saturnin', text: T.linkLines.enclumeSaturnin }, { who: 'Brume', text: T.linkLines.enclumeBrume }] },
  { id: 'fruit', act: 'III', name: 'Le premier fruit', cast: ['bosquet', 'potager'], recipe: 'Fruit = Arbre + Fleur', text: T.links.fruit, lines: [{ who: 'Flore', text: T.linkLines.fruitFlore }, { who: 'Freya', text: T.linkLines.fruitFreya }, { who: 'Flore', text: T.linkLines.fruitFloreLune }] },
  { id: 'nager', act: 'IV', name: 'Apprendre à nager', cast: ['ponton', 'puits'], recipe: 'Bateau = Bois + Eau', text: T.links.nager, lines: [{ who: 'Pierrot', text: T.linkLines.nagerPierrot }, { who: 'Lorena', text: T.linkLines.nagerLorena }, { who: 'Pierrot', text: T.linkLines.nagerPierrotMain }, { who: 'Lorena', text: T.linkLines.nagerLorenaJamais }] },
  { id: 'tablee', act: 'V', name: 'La grande tablée', cast: ALL, recipe: 'Village = Maison + Maison', text: T.links.tablee, lines: [{ who: 'Marcelle', text: T.linkLines.tableeMarcelle }, { who: 'Lorena', text: T.linkLines.tableeLorena }, { who: 'Flore', text: T.linkLines.tableeFlore }] },
  { id: 'pardon', act: 'VI', name: 'Le pardon', cast: ALL, recipe: 'Phénix = Feu + Vie', text: T.links.pardon, lines: [{ who: 'Tous', text: T.linkLines.pardonTous }] }
];

// Le rite et les répliques propres à chaque veillée (§ 10)
const RITES = {
  I: { recipe: 'Lanterne = Feu + Lumière', text: T.rites.I },
  II: { recipe: 'Pierre qui chante', text: T.rites.II },
  IV: { recipe: 'Vent = Air + Air', text: T.rites.IV },
  VII: { recipe: 'Feu follet', text: T.rites.VII }
};
const LINES = {
  I: [{ who: 'Brume', text: T.lines.I.brume }, { who: 'Brume', text: T.lines.I.brumeToutes }],
  III: [{ who: 'Flore', text: T.lines.III.flore }, { text: T.lines.III.recit }],
  V: [{ text: T.lines.V.recit }, { who: 'Marcelle', text: T.lines.V.marcelle }],
  VI: [{ who: 'Lorena', text: T.lines.VI.lorena }, { text: T.lines.VI.recit }, { text: T.lines.VI.phenix }],
  VII: [{ who: 'Brume', text: T.lines.VII.brume }]
};

// La finale (§ 10, acte VII) : le Phare de Brume s'allume, juste avant la veillée VII (et l'épilogue qu'elle porte)
const FINALE = [
  { art: 'phare', caption: 'Le Phare de Brume', text: T.finale.phare },
  { art: 'reflet', caption: 'Le Phare de Brume', text: T.finale.reflet },
  { art: 'soleil', caption: 'Le Phare de Brume', text: T.finale.soleil },
  { art: 'flammeche', text: T.finale.flammeche },
  { art: 'flammeche', who: 'Brume', text: T.finale.brume }
];

// La veillée d'un acte, image par image (PrologueScene) ; people : le nom du peuple. La VII commence par la finale
export function vigilFrames(act, { people = null } = {}) {
  const cast = CAST[act];
  const frames = [...(act === 'VII' ? FINALE : []), { art: 'veillee', cast, caption: `Veillée ${act}`, text: T.open }];
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
