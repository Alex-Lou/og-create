import { describe, it, expect } from 'vitest';
import { P, TW, TH, box } from '@/world/iso';
import { phaseAt } from '@/world/scene';
import { BUILDINGS, NATURE } from '@/world/sprites';
import { FUTURE, UPGRADES, fountainFrames, orbSprite } from '@/world/buildings2';
import { NATURE2, CRITTERS, PLINTH } from '@/world/nature';
import { SHOP_SPRITES, itemLayers, itemLight, itemThumb } from '@/world/shopSprites';

const at = (h, m = 0) => {
  const d = new Date(2026, 9, 4, h, m);
  return phaseAt(d);
};

describe('géométrie isométrique', () => {
  it('projette une case en losange 2:1, z vers le haut', () => {
    expect(P(0, 0, 0)).toEqual([0, 0]);
    expect(P(1, 0, 0)).toEqual([TW / 2, TH / 2]);
    expect(P(0, 1, 0)).toEqual([-TW / 2, TH / 2]);
    expect(P(0, 0, 10)).toEqual([0, -10]);
  });
  it('une boîte ne montre que ses trois faces visibles', () => {
    expect(box(0, 0, 1, 1, 0, 10, { top: '#a', left: '#b', right: '#c' }).match(/<polygon/g)).toHaveLength(3);
  });
});

describe('sprites', () => {
  it('chaque bâtiment et chaque élément de nature donne un SVG cadré', () => {
    const all = [
      ...Object.values(BUILDINGS).flat(), ...Object.values(NATURE), ...Object.values(FUTURE).flat(), ...Object.values(UPGRADES),
      ...Object.values(NATURE2), ...Object.values(CRITTERS).flat(), PLINTH, orbSprite, ...fountainFrames().map(f => () => f)
    ];
    for (const make of all) {
      const { svg, box: frame } = make();
      expect(svg.startsWith('<svg')).toBe(true);
      expect(frame.w).toBeGreaterThan(0);
      expect(svg).not.toMatch(/NaN|undefined/);
    }
  });
  it('le chantier a trois phases', () => {
    expect(BUILDINGS.chantier).toHaveLength(3);
  });
});

// Articles de la boutique vendus par le serveur (outils et objets ; les skins changent le dessin du bâtiment)
const SHOP_ITEMS = {
  potager: ['pelle', 'arrosoir', 'poulailler', 'ruche'], carriere: ['pioche', 'wagonnet', 'lanterne-mine', 'rails'],
  bosquet: ['hache', 'scie', 'nichoir', 'charrette'], puits: ['seau-cuivre', 'poulie', 'abreuvoir', 'pompe'],
  ponton: ['canne', 'filet', 'casier', 'barque'], atelier: ['etabli', 'enclume', 'soufflet'], foyer: ['cuisine', 'lit', 'chat', 'chien']
};
const SKINS = {
  foyer: [1, ['toit-rouge', 'toit-bleu-foyer', 'toit-chaume-foyer']], carriere: [0, ['roche-ocre', 'roche-granit', 'roche-cristal']],
  bosquet: [0, ['printemps', 'automne', 'givre']], puits: [0, ['toit-bleu', 'toit-chaume', 'pierre-blanche']],
  potager: [0, ['cloture-blanche', 'cloture-pierre', 'cloture-fleurie']], atelier: [0, ['enseigne-doree', 'toit-ardoise']]
};

describe('boutique des ateliers', () => {
  it('chaque article du catalogue a son dessin, à chaque niveau de son bâtiment', () => {
    const ids = Object.values(SHOP_ITEMS).flat();
    expect(Object.keys(SHOP_SPRITES).sort()).toEqual([...ids].sort());
    for (const id of ids) {
      for (const level of [1, 2, 3]) {
        const layers = itemLayers(id, level, 0);
        expect(layers.length).toBeGreaterThan(0);
        for (const layer of layers) {
          const { svg, box: frame } = layer.make();
          expect(svg).toMatch(/^<svg [^>]*viewBox=/);
          expect(svg).not.toMatch(/NaN|undefined/);
          // Cadre serré (mémoire) et dans l'emprise du bâtiment
          expect(frame.w * frame.h).toBeLessThanOrEqual(70 * 70);
          expect(frame.x).toBeGreaterThanOrEqual(-80);
          expect(frame.x + frame.w).toBeLessThanOrEqual(80);
        }
        expect(itemThumb(id, level).svg).not.toMatch(/NaN|undefined/);
      }
    }
  });
  it('les objets vivants s’animent : images différentes et clés distinctes, mouvement continu', () => {
    const hens = [0, 0.3, 0.6].map(t => itemLayers('poulailler', 1, t)[1]);
    expect(new Set(hens.map(l => l.key)).size).toBe(3);
    expect(new Set(hens.map(l => l.make().svg)).size).toBe(3);
    const wagon = [0, 3, 4.5].map(t => itemLayers('rails', 2, t)[1].offset[1]);
    expect(new Set(wagon).size).toBeGreaterThan(1);
    expect(itemLayers('barque', 2, 0)[0].back).toBe(true);
  });
  it('la lanterne, le four et la pièce rougie éclairent la nuit', () => {
    expect(itemLight('lanterne-mine', 1)).toHaveLength(4);
    expect(itemLight('cuisine', 2)).toHaveLength(4);
    expect(itemLight('enclume', 2)).toHaveLength(4);
    expect(itemLight('pelle', 1)).toBeNull();
  });
  it('chaque skin change le dessin du bâtiment, au niveau 1 comme au niveau 2', () => {
    for (const [site, [first, skins]] of Object.entries(SKINS)) {
      const looks = [BUILDINGS[site][first], UPGRADES[site] || BUILDINGS[site][first + 1]];
      for (const look of looks) {
        const origin = look().svg;
        const variants = skins.map(skin => look(skin).svg);
        variants.forEach(svg => expect(svg).not.toBe(origin));
        expect(new Set(variants).size).toBe(skins.length);
      }
    }
  });
});

describe('heure de l’île', () => {
  it('suit l’heure locale : aube, jour, crépuscule, nuit', () => {
    expect(at(6).id).toBe('dawn');
    expect(at(12).id).toBe('day');
    expect(at(19).id).toBe('dusk');
    expect(at(23).id).toBe('night');
    expect(at(2).id).toBe('night');
  });
  it('la nuit monte doucement : nulle le jour, pleine à minuit', () => {
    expect(at(12).night).toBe(0);
    expect(at(0).night).toBe(1);
    expect(at(20, 30).night).toBeGreaterThan(0);
    expect(at(20, 30).night).toBeLessThan(1);
  });
});
