// Le Grand Œuvre (HISTOIRE.md, § 4.3, § 10 et § 13) : l'arc de l'île et les stades de Brume. Tout se déduit des actes
// finis (serveur : brume.acts), de la quête active de Brume et des éléments écrits ; rien n'est gardé.
import { ACTS } from './vigils';

// L'acte en cours : 'T' (le prologue), 'I' à 'VII', ou null quand l'île est finie (le Phare allumé)
export function actNow(acts) {
  const done = acts || [];
  if (!done.includes('T')) return 'T';
  return ACTS.find(act => !done.includes(act)) || null;
}

// L'étape alchimique de la lumière (sky.js, OPUS) : noir (prologue, I, II), blanc (III, IV), jaune (V, VI), rouge (VII
// et après)
const OPUS = { T: 'noir', I: 'noir', II: 'noir', III: 'blanc', IV: 'blanc', V: 'jaune', VI: 'jaune', VII: 'rouge' };
export const opusOf = acts => OPUS[actNow(acts)] || 'rouge';

// Acte VI : les quêtes qui suivent l'Écriture (Galet a lu la dernière rune des Anciens : Brume pâlit)
const AFTER_RUNE = ['cle', 'tour', 'civilisation', 'phenix'];
const pales = (now, quest) => now === 'VI' && Boolean(quest) && AFTER_RUNE.includes(quest.id);

// Le stade de Brume (§ 13) : { stage 0 à 7, pale (acte VI, après la rune), burst (le Phénix écrit), sun (le Phare
// allumé : elle est le soleil du phare, une petite flamme reste près de toi) }
export function brumeLook({ acts, quest = null, elements = [] }) {
  const now = actNow(acts);
  if (!now) return { stage: 7, sun: true };
  const stage = now === 'T' ? 0 : ACTS.indexOf(now) + 1;
  if (now !== 'VI') return { stage };
  const phenix = (elements || []).includes('Phénix');
  return { stage, pale: pales(now, quest) && !phenix, burst: phenix };
}

// Le secret de Brume (acte VI, § 10) : dit une fois, quand Galet a lu la dernière rune ; quatrième pressentiment d'Anya
export const secretDue = (acts, quest) => pales(actNow(acts), quest);
export const SECRET = [
  { id: 'secret-galet', who: 'Galet', face: 'carriere', text: 'Hm. Hm… (Brume traduit : « La dernière rune des Anciens. La brume naît d’un chagrin. »)' },
  { id: 'secret-brume', text: 'Mon chagrin… C’est moi qui fais la brume de la mer ? … parce que l’île est seule. Parce qu’Elle dort.' },
  { id: 'secret-suite', text: 'Je pâlis, je sais. Ce n’est rien : continuons. Les quêtes, elles, ne s’arrêtent pas.' }
];

// Feu follet écrit avant l'acte VII (§ 10, le cas particulier) : Brume réagit une fois ; la finale reste au Phare
export const EARLY_WISP = { id: 'feu-follet-tot', text: 'C’est… moi ? Comme c’est étrange.' };
export const earlyWisp = (acts, elements) => (elements || []).includes('Feu follet') && !['VII', null].includes(actNow(acts));
