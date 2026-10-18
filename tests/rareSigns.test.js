// Le petit signe des raretés (world/rareSigns.js) : une créature rare ou légendaire qui sort près de ce qu'on regarde se
// signale une fois par sortie, au plus une toutes les SIGN_CALM ms ; ni les communes, ni le Kraken, ni les égarés
import { describe, it, expect } from 'vitest';
import { rareSigns, rareOfHit, SIGN_CALM } from '@/world/rareSigns';

const VIEW = { x: 0, y: 0, w: 100, h: 100 };
const wild = (entry, x = 50, y = 50) => ({ key: `wild:${entry}:foret:0`, who: { id: `wild:${entry}:foret:0` }, x, y });
const ids = signs => signs.map(s => s.creature.id);

describe('le petit signe des raretés', () => {
  it('une bête rare, le Géant ; ni une commune, ni le Kraken, ni un égaré, ni un habitant', () => {
    expect(rareOfHit(wild('cerf')).id).toBe('cerf');
    expect(rareOfHit({ key: 'geant:3', kind: 'geant', x: 0, y: 0 }).rarity).toBe('légendaire');
    expect([wild('lapin'), { key: 'kraken:7', kind: 'kraken' }, { key: 'stray:n1', kind: 'stray', art: 'esprit' }, { key: 'vil:ponton', who: { id: 'vil:ponton' } }].map(rareOfHit))
      .toEqual([null, null, null, null]);
  });

  it('une fois par sortie, seulement dans ce qu’on regarde ; à sa sortie suivante, de nouveau', () => {
    const signs = rareSigns();
    // (dehors, hors de la vue : rien ; elle y entre : son signe, une fois)
    expect(signs.see(VIEW, 0, [wild('cerf', 500, 50)])).toEqual([]);
    expect(ids(signs.see(VIEW, 10, [wild('cerf')]))).toEqual(['cerf']);
    expect(signs.see(VIEW, 20 + SIGN_CALM, [wild('cerf')])).toEqual([]);
    // (rentrée, puis ressortie : un nouveau signe)
    signs.see(VIEW, 30 + SIGN_CALM, []);
    expect(ids(signs.see(VIEW, 40 + SIGN_CALM, [wild('cerf')]))).toEqual(['cerf']);
  });

  it('au plus un signe toutes les SIGN_CALM ms : la suivante attend, toujours dehors', () => {
    const signs = rareSigns();
    const both = [wild('cerf'), { key: 'geant:1', kind: 'geant', x: 60, y: 60 }];
    expect(ids(signs.see(VIEW, 0, both))).toEqual(['cerf']);
    expect(signs.see(VIEW, SIGN_CALM - 1, both)).toEqual([]);
    expect(ids(signs.see(VIEW, SIGN_CALM, [], both))).toEqual(['geant']);
  });
});
