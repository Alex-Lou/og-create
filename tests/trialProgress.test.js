import { describe, expect, it } from 'vitest';
import { doneCount, emptyProgress, isChapterDone, markDone } from '@/utils/trialProgress';

describe('progression de l’Épreuve', () => {
  it('compte les questions réussies et scelle le chapitre à la dernière', () => {
    let { progress, isNew } = markDone(emptyProgress(), 'Facile', 'Cosmos', 7, 2);
    expect(isNew).toBe(true);
    expect(doneCount(progress, 'Facile', 'Cosmos', 2)).toBe(1);
    expect(isChapterDone(progress, 'Facile', 'Cosmos', 2)).toBe(false);
    ({ progress } = markDone(progress, 'Facile', 'Cosmos', 9, 2));
    expect(isChapterDone(progress, 'Facile', 'Cosmos', 2)).toBe(true);
    expect(progress.unlockedCategories.Facile).toEqual(['Cosmos']);
  });
  it('une question déjà réussie ne compte pas deux fois', () => {
    const first = markDone(null, 'Moyen', 'Flore', 3, 5);
    const again = markDone(first.progress, 'Moyen', 'Flore', 3, 5);
    expect(again.isNew).toBe(false);
    expect(doneCount(again.progress, 'Moyen', 'Flore', 5)).toBe(1);
  });
  it('un chapitre scellé sans détail compte comme complet', () => {
    const progress = { ...emptyProgress(), unlockedCategories: { Facile: ['Chimie'] } };
    expect(doneCount(progress, 'Facile', 'Chimie', 4)).toBe(4);
    expect(isChapterDone(progress, 'Facile', 'Chimie', 4)).toBe(true);
  });
  it('ne modifie pas la progression reçue', () => {
    const start = emptyProgress();
    markDone(start, 'Facile', 'Cosmos', 1, 3);
    expect(start).toEqual(emptyProgress());
  });
});
