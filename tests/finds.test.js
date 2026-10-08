import { describe, it, expect } from 'vitest';
import { DEPOSIT_SPRITES, PICKUP_SPRITES, depositLayer } from '@/world/depositSprites';
import { FIND_GLYPH, DEPOSIT_NAMES, depositsShown, depositsReady, depositWait, waitText, pickupsShown } from '@/world/finds';
import { iconSrc, libraryIcon } from '@/utils/icons';
import { NATURE2 } from '@/world/nature';

// Les 6 trouvailles du serveur (services/finds.js), mêmes identifiants
const IDS = ['glace', 'laine', 'roseau', 'sel', 'fruits', 'obsidienne'];

describe('trouvailles de climat : dessins et icônes', () => {
  it('chaque trouvaille a son icône, son gisement prêt (animé) et ramassé', () => {
    expect(Object.keys(DEPOSIT_SPRITES).sort()).toEqual([...IDS].sort());
    for (const id of IDS) {
      expect(iconSrc(id)).toBe(libraryIcon(id));
      expect(libraryIcon(id)).toBeTruthy();
      expect(FIND_GLYPH[id]).toBe(`ui:${id}`);
      expect(DEPOSIT_NAMES[id]).toHaveLength(2);
      const keys = new Set();
      // Le dessin de la bibliothèque (lu à la demande : load, decorArt.js), sinon celui du code (svg)
      for (const t of [0, 0.4, 0.5, 1.3, 2.9]) {
        const layer = depositLayer(id, true, t);
        const { svg, load, box } = layer.make();
        expect(Boolean(svg || load)).toBe(true);
        if (svg) expect(svg).not.toMatch(/NaN|undefined|Infinity/);
        expect(box.w).toBeGreaterThan(0);
        keys.add(layer.key);
      }
      expect(keys.size).toBeGreaterThan(1);
      const spent = depositLayer(id, false, 1.3);
      expect(spent.key).toMatch(new RegExp(`deposit-${id}-s|lib-${id}_ramasse`));
      expect(spent.make().box.w).toBeGreaterThan(0);
    }
    expect(depositLayer('nulle', true)).toBeNull();
  });
  it('ce que la mer rend sur la Grève : bois flotté, coquillages, galets, dessinés prêts (animés) et ramassés', () => {
    expect(Object.keys(PICKUP_SPRITES).sort()).toEqual(['bois', 'coquillage', 'galet']);
    for (const id of Object.keys(PICKUP_SPRITES)) {
      expect(DEPOSIT_NAMES[id]).toHaveLength(2);
      const keys = new Set([0, 0.6, 1.3, 2.9].map(t => depositLayer(id, true, t).key));
      expect(keys.size).toBeGreaterThan(1);
      for (const ready of [true, false]) {
        const { svg, box } = depositLayer(id, ready, 1.3).make();
        expect(svg).not.toMatch(/NaN|undefined|Infinity/);
        expect(box.w).toBeGreaterThan(0);
      }
    }
    // Vus de l'île comme des gisements : leur sorte, et pickup
    const state = { pickups: [{ id: 'greve-bois-1', kind: 'bois', zone: 'coeur', x: 93, y: 98, readyIn: 0 }] };
    expect(pickupsShown(state)).toEqual([{ ...state.pickups[0], find: 'bois', pickup: true }]);
    expect(pickupsShown({})).toEqual([]);
    // (ils ne comptent pas parmi les gisements de climat : le sac des trouvailles ne s'en occupe pas)
    expect(depositsShown(state)).toEqual([]);
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
