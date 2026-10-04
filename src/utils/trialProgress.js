// Progression de l'Épreuve : questions réussies par niveau et chapitre, chapitres scellés, records.
// Fonctions pures : le serveur fusionne de son côté (rien ne se perd entre deux appareils).
export const LEVELS = ['Facile', 'Moyen', 'Difficile'];

export const emptyProgress = () => ({
  completedQuestions: {},
  unlockedCategories: {},
  bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
});

const doneIn = (progress, level, chapter) => {
  const done = progress?.completedQuestions?.[level]?.[chapter];
  return Array.isArray(done) ? done : [];
};
const sealed = (progress, level, chapter) => Boolean(progress?.unlockedCategories?.[level]?.includes(chapter));

// Questions réussies d'un chapitre (un chapitre scellé sans détail compte comme complet)
export function doneCount(progress, level, chapter, total) {
  const count = doneIn(progress, level, chapter).length;
  return count === 0 && sealed(progress, level, chapter) ? total : count;
}

export function isChapterDone(progress, level, chapter, total) {
  return sealed(progress, level, chapter) || doneIn(progress, level, chapter).length >= total;
}

// Marque une question réussie : { progress (copie mise à jour), isNew } ; le chapitre est scellé à la dernière
export function markDone(progress, level, chapter, id, total) {
  const current = progress || emptyProgress();
  const done = doneIn(current, level, chapter);
  if (done.includes(id)) return { progress: current, isNew: false };
  const nextDone = [...done, id];
  const unlocked = current.unlockedCategories?.[level] || [];
  return {
    isNew: true,
    progress: {
      ...current,
      completedQuestions: { ...current.completedQuestions, [level]: { ...current.completedQuestions?.[level], [chapter]: nextDone } },
      unlockedCategories: {
        ...current.unlockedCategories,
        [level]: nextDone.length >= total && !unlocked.includes(chapter) ? [...unlocked, chapter] : unlocked
      }
    }
  };
}
