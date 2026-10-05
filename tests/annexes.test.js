import { describe, it, expect } from 'vitest';
import { ANNEX_SPRITES, annexLayers, annexLight, annexThumb } from '@/world/annexSprites';
import { annexState, annexReady, variantsOf, annexYield, KIND_LABEL } from '@/world/annexes';
import { villageOf } from '@/world/village';
import { skyAt } from '@/world/sky';

// Les 21 annexes du serveur (services/annexes.js), mêmes identifiants
const IDS = ['champ', 'grenier', 'enclos', 'filon', 'depot', 'taille', 'coupe', 'remise', 'pepiniere', 'citerne', 'reservoir', 'eolienne',
  'vivier', 'fumoir', 'huitres', 'jardin', 'four', 'belvedere', 'charbon', 'hangar', 'fourneau'];

describe('annexes : dessins', () => {
  it('chaque annexe du serveur a son dessin, propre à chaque image et chaque exemplaire', () => {
    expect(Object.keys(ANNEX_SPRITES).sort()).toEqual([...IDS].sort());
    for (const id of IDS) {
      for (const variant of [0, 1, 2]) {
        for (const t of [0, 0.37, 1.9]) {
          const layers = annexLayers(id, variant, t);
          expect(layers.length).toBeGreaterThan(0);
          for (const layer of layers) {
            const { svg, box } = layer.make();
            expect(svg).not.toMatch(/NaN|undefined|Infinity/);
            expect(box.w).toBeGreaterThan(0);
            expect(layer.key).toContain(`annex-${id}-${variant}`);
          }
        }
      }
      expect(annexThumb(id, 0).svg).toContain('<svg');
    }
    expect(annexLayers('nulle-part')).toEqual([]);
    expect(annexThumb('nulle-part')).toBeNull();
  });
  it('les petites annexes changent selon l’exemplaire ; les animations ont plusieurs images', () => {
    expect(annexLayers('champ', 0, 0)[0].make().svg).not.toBe(annexLayers('champ', 1, 0)[0].make().svg);
    expect(annexLayers('vivier', 0, 0)[0].make().svg).not.toBe(annexLayers('vivier', 2, 0)[0].make().svg);
    expect(annexLayers('eolienne', 0, 0)[0].key).not.toBe(annexLayers('eolienne', 0, 0.2)[0].key);
  });
  it('lumières de nuit : lanternes, braises et feux (le four et le haut fourneau vacillent)', () => {
    for (const id of IDS) {
      const light = annexLight(id);
      if (!light) continue;
      expect(light.slice(0, 4).every(Number.isFinite)).toBe(true);
    }
    expect(annexLight('four')[5]).toBe(true);
    expect(annexLight('fourneau')[5]).toBe(true);
    expect(annexLight('champ')).toBeNull();
  });
});

describe('annexes : fiche du bâtiment', () => {
  const champ = { id: 'champ', kind: 'small', max: 3, built: 1, gain: { rate: 3, earn: 2 }, next: { level: 3, cost: { wood: 40, water: 40 }, coins: 250 } };
  const grenier = { id: 'grenier', kind: 'reserve', max: 1, built: 1, gain: { cap: 4 }, next: null };
  const site = { level: 3, spots: [{ x: 1, y: 1 }], annexes: [champ, grenier] };
  const stock = { stone: 0, wood: 50, water: 50, food: 0 };
  it('l’état de chaque carte : posée, palier, ressources, écus, place, prête', () => {
    expect(annexState(grenier, site, stock, 1000)).toEqual({ state: 'done', text: 'Posée' });
    expect(annexState({ ...champ, next: null }, site, stock, 1000).text).toBe('Toutes posées');
    expect(annexState(champ, { ...site, level: 2 }, stock, 1000)).toEqual({ state: 'locked', text: 'Palier III' });
    expect(annexState(champ, site, { ...stock, wood: 10 }, 1000).state).toBe('poor');
    expect(annexState(champ, site, stock, 100)).toEqual({ state: 'poor', text: 'Il manque 150' });
    expect(annexState(champ, { ...site, spots: [] }, stock, 1000).state).toBe('full');
    expect(annexState(champ, site, stock, null).state).toBe('ready');
    expect(annexReady(site, stock, 1000)).toBe(true);
    expect(annexReady({ ...site, level: 2 }, stock, 1000)).toBe(false);
    expect(KIND_LABEL.reserve).toBe('Réserve');
  });
  it('variante de chaque annexe posée et production qu’elles ajoutent', () => {
    const v = variantsOf([{ x: 1, y: 1, annex: 'champ' }, { x: 2, y: 1, annex: 'grenier' }, { x: 3, y: 1, annex: 'champ' }]);
    expect([v.get('1,1'), v.get('2,1'), v.get('3,1')]).toEqual([0, 0, 1]);
    expect(annexYield({ annexes: [{ ...champ, built: 2 }, grenier] })).toEqual({ count: 3, rate: 6, earn: 4 });
    expect(annexYield({})).toEqual({ count: 0, rate: 0, earn: 0 });
  });
});

describe('annexes : les habitants y travaillent', () => {
  const N = 14;
  const ground = Array.from({ length: N }, (_, y) => Array.from({ length: N }, (_, x) => (x === 0 || y === 0 || x === N - 1 || y === N - 1 ? '~' : x === 7 || y === 7 ? 'p' : 'g')).join(''));
  const M = { ground: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? '~' : ground[y][x]), height: () => 1, zone: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : 0) };
  const sites = [{ id: 'foyer', name: 'Maison', x: 4, y: 4, w: 2, h: 2, level: 2 }, { id: 'potager', name: 'Serre', x: 9, y: 3, w: 2, h: 2, level: 2 }];
  it('le fermier passe au champ ; personne ne marche sur une annexe', () => {
    const annexes = [{ x: 11, y: 9, annex: 'champ', site: 'potager' }];
    const village = villageOf({ n: N, M, sites, owned: new Set([0]), tiles: [], props: [], annexes });
    const farmer = village.residents.find(r => r.role === 'potager');
    expect(farmer.field).toBeTruthy();
    expect(Math.abs(farmer.field.x - 11) + Math.abs(farmer.field.y - 9)).toBe(1);
    const noon = skyAt(new Date(2026, 5, 21, 13, 0), { weather: 'clair' });
    for (let t = 0; t < 900; t += 5) {
      for (const p of village.at(t, noon).list.filter(c => c.kind === 'villager')) {
        expect(Math.round(p.x) === 11 && Math.round(p.y) === 9).toBe(false);
      }
    }
    // Sans annexe : pas de champ
    expect(villageOf({ n: N, M, sites, owned: new Set([0]), tiles: [], props: [] }).residents.find(r => r.role === 'potager').field).toBeNull();
  });
});
