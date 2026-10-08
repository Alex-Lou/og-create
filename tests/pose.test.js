// La pose (lot Pose) : une annexe posée prend la couleur choisie (look), sinon celle de son rang comme avant ; les
// couleurs au choix du serveur (services/annexes.js, LOOKS) sont celles que la bibliothèque a dessinées, nommées
import { describe, it, expect } from 'vitest';
import { variantsOf, ranksOf } from '@/world/annexes';
import { annexLookNames, annexArtLayer } from '@/world/decorArt';

// Couleurs au choix annoncées par le serveur (annexes.js : LOOKS) ; une seule pour les autres annexes
const LOOKS = { champ: 3, filon: 3, coupe: 3, citerne: 3, vivier: 3, maison: 4 };

describe('pose : couleurs et rang', () => {
  it('la couleur choisie l’emporte ; sans choix, le rang (comme avant) ; le rang ne bouge pas', () => {
    const rows = [
      { x: 1, y: 1, annex: 'champ', look: null }, { x: 2, y: 1, annex: 'champ', look: 0 },
      { x: 3, y: 1, annex: 'champ' }, { x: 4, y: 1, annex: 'maison', look: 3, flip: true }
    ];
    const v = variantsOf(rows);
    expect(['1,1', '2,1', '3,1', '4,1'].map(k => v.get(k))).toEqual([0, 0, 2, 3]);
    const r = ranksOf(rows);
    expect(['1,1', '2,1', '3,1', '4,1'].map(k => r.get(k))).toEqual([0, 1, 2, 0]);
  });

  it('chaque couleur au choix du serveur est dessinée et nommée', () => {
    for (const [id, n] of Object.entries(LOOKS)) {
      const names = annexLookNames(id);
      expect(names.length, id).toBe(n);
      for (let k = 0; k < n; k++) {
        expect(names[k], `${id} ${k}`).not.toBe('');
        expect(annexArtLayer(id, k), `${id} ${k}`).not.toBeNull();
      }
    }
    expect(annexLookNames('champ')).toEqual(['blé', 'carottes', 'citrouilles']);
    expect(annexLookNames('grenier').length).toBe(1);
    expect(annexLookNames('nulle-part')).toEqual([]);
  });
});
