// Les notifications (services/toastRules.js) : au plus trois à la fois, jamais une erreur avant une autre ;
// un même gain qui revient s'additionne au lieu d'en ajouter un.
import { describe, expect, it } from 'vitest';
import { addGains, toEvict, MAX_TOASTS } from '@/services/toastRules';

const t = (id, type = 'info') => ({ id, type });

describe('les notifications', () => {
  it('les gains d’une même icône s’additionnent, les nouveaux s’ajoutent', () => {
    const a = [{ glyph: 'ui:wood', text: '+3' }];
    expect(addGains(a, [{ glyph: 'ui:wood', text: '+2' }, { glyph: 'ui:stone', text: '+1' }])).toEqual([
      { glyph: 'ui:wood', text: '+5' }, { glyph: 'ui:stone', text: '+1' }
    ]);
    // (la liste d'origine ne bouge pas)
    expect(a).toEqual([{ glyph: 'ui:wood', text: '+3' }]);
  });

  it('au plus MAX_TOASTS : la plus ancienne qui n’est pas une erreur laisse sa place', () => {
    expect(MAX_TOASTS).toBe(3);
    expect(toEvict([t(1), t(2), t(3)])).toBe(null);
    const list = [t(1, 'error'), t(2, 'gain'), t(3), t(4)];
    expect(toEvict(list).id).toBe(2);
    // (que des erreurs : la plus ancienne)
    expect(toEvict([t(1, 'error'), t(2, 'error'), t(3, 'error'), t(4, 'error')]).id).toBe(1);
  });
});
