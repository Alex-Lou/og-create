import { describe, it, expect } from 'vitest';
import { DEPOSIT_SPRITES, depositLayer } from '@/world/depositSprites';
import { FIND_GLYPH, DEPOSIT_NAMES, depositsShown, depositsReady, depositWait, waitText } from '@/world/finds';
import { iconSrc } from '@/utils/icons';
import { NATURE2 } from '@/world/nature';

// Les 6 trouvailles du serveur (services/finds.js), mêmes identifiants
const IDS = ['glace', 'laine', 'roseau', 'sel', 'fruits', 'obsidienne'];

describe('trouvailles de climat : dessins et icônes', () => {
  it('chaque trouvaille a son icône, son gisement prêt (animé) et ramassé', () => {
    expect(Object.keys(DEPOSIT_SPRITES).sort()).toEqual([...IDS].sort());
    for (const id of IDS) {
      expect(iconSrc(id)).toMatch(/^data:image\/svg\+xml/);
      expect(FIND_GLYPH[id]).toBe(`ui:${id}`);
      expect(DEPOSIT_NAMES[id]).toHaveLength(2);
      const keys = new Set();
      for (const t of [0, 0.4, 1.3, 2.9]) {
        const layer = depositLayer(id, true, t);
        const { svg, box } = layer.make();
        expect(svg).not.toMatch(/NaN|undefined|Infinity/);
        expect(box.w).toBeGreaterThan(0);
        keys.add(layer.key);
      }
      expect(keys.size).toBeGreaterThan(1);
      const spent = depositLayer(id, false, 1.3);
      expect(spent.key).toContain(`deposit-${id}-s`);
      expect(spent.make().svg).not.toMatch(/NaN|undefined/);
    }
    expect(depositLayer('nulle', true)).toBeNull();
  });
  it('le décor des climats : pin enneigé, cactus, arbre mort, bruyère', () => {
    for (const id of ['snowpine', 'cactus', 'deadtree', 'heather']) {
      const { svg } = NATURE2[id]();
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).not.toMatch(/NaN|undefined/);
    }
  });
});

describe('trouvailles de climat : gisements', () => {
  const state = {
    map: { zones: [{ id: 'menhirs', owned: true }, { id: 'falaises', owned: false }] },
    deposits: [
      { id: 'menhirs-1', zone: 'menhirs', find: 'laine', readyIn: 0 },
      { id: 'menhirs-2', zone: 'menhirs', find: 'laine', readyIn: 60000 },
      { id: 'falaises-1', zone: 'falaises', find: 'laine', readyIn: 0 }
    ]
  };
  it('prêts : ceux d’un quartier à soi qui ont repoussé, le temps passant', () => {
    expect(depositsShown(state)).toHaveLength(3);
    expect(depositsReady(state).map(d => d.id)).toEqual(['menhirs-1']);
    expect(depositsReady(state, 60000).map(d => d.id)).toEqual(['menhirs-1', 'menhirs-2']);
    expect(depositWait(state.deposits[1], 20000)).toBe(40000);
    expect(depositsShown(null)).toEqual([]);
    expect(depositsReady({ map: { zones: [] } })).toEqual([]);
  });
  it('durée lisible', () => {
    expect(waitText(30000)).toBe('1 min');
    expect(waitText(12 * 60000)).toBe('12 min');
    expect(waitText(3 * 3600000 + 5 * 60000)).toBe('3 h 05');
    expect(waitText(2 * 3600000)).toBe('2 h');
  });
});
