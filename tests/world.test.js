import { describe, it, expect } from 'vitest';
import { P, TW, TH, box, boulder, mixHex } from '@/world/iso';
import { phaseAt } from '@/world/scene';
import { BUILDINGS, NATURE } from '@/world/sprites';
import { FUTURE, UPGRADES, fountainFrames, orbSprite } from '@/world/buildings2';
import { NATURE2, CRITTERS, PLINTH } from '@/world/nature';
import { SHOP_SPRITES, itemLayers, itemLight, itemThumb } from '@/world/shopSprites';
import { LOOKS, lookAt, artMake } from '@/world/looks';

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

describe('rochers à facettes', () => {
  const ROCK = { top: '#CCCCCC', left: '#999999', right: '#666666' };
  it('même graine, même rocher ; seules les facettes tournées vers le joueur sont tracées, le dessus en dernier', () => {
    const a = boulder(0, 0, 0.3, 0.25, 12, ROCK, 3);
    expect(a).toBe(boulder(0, 0, 0.3, 0.25, 12, ROCK, 3));
    expect(a).not.toBe(boulder(0, 0, 0.3, 0.25, 12, ROCK, 4));
    const faces = a.match(/<polygon/g).length;
    expect(faces).toBeGreaterThan(4);
    expect(faces).toBeLessThan(2 * 8 + 1);
    expect(a.endsWith(`fill="${ROCK.top}"${' stroke="rgba(60,40,25,.28)" stroke-width="0.8" stroke-linejoin="round"'}/>`)).toBe(true);
  });
  it('mélange de couleurs', () => {
    expect(mixHex('#000000', '#FFFFFF', 0)).toBe('#000000');
    expect(mixHex('#000000', '#FFFFFF', 1)).toBe('#ffffff');
    expect(mixHex('#102030', '#305070', 0.5)).toBe('#203850');
  });
  it('trois rochers différents pour le sol rocheux', () => {
    ['rock', 'rocks', 'crag'].forEach(kind => expect(NATURE[kind]().svg).toContain('<polygon'));
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
  potager: ['pelle', 'arrosoir', 'poulailler', 'ruche', 'brouette', 'epouvantail', 'citrouille'],
  carriere: ['pioche', 'wagonnet', 'lanterne-mine', 'rails', 'casque', 'geode', 'golem'],
  bosquet: ['hache', 'scie', 'nichoir', 'charrette', 'passe-partout', 'ecureuil', 'cerf'],
  puits: ['seau-cuivre', 'poulie', 'abreuvoir', 'pompe', 'sourcier', 'canards', 'naiade'],
  ponton: ['canne', 'filet', 'casier', 'barque', 'harpon', 'pelican', 'sirene'],
  atelier: ['etabli', 'enclume', 'soufflet', 'marteau-pilon', 'automate', 'athanor'],
  foyer: ['cuisine', 'lit', 'chat', 'chien', 'sablier', 'hibou', 'grimoire']
};
// Articles des paliers V à VII (les trois derniers de chaque boutique) : ils ne se montrent qu'aux grandes emprises (3 × 3)
const LATE_ITEMS = Object.values(SHOP_ITEMS).flatMap(ids => ids.slice(-3));
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
      for (const level of LATE_ITEMS.includes(id) ? [5, 6, 7] : [1, 2, 3, 4, 7]) {
        const reach = level >= 4 ? 112 : 80;
        const layers = itemLayers(id, level, 0);
        expect(layers.length).toBeGreaterThan(0);
        for (const layer of layers) {
          const { svg, box: frame } = layer.make();
          expect(svg).toMatch(/^<svg [^>]*viewBox=/);
          expect(svg).not.toMatch(/NaN|undefined/);
          // Cadre serré (mémoire) et dans l'emprise du bâtiment
          expect(frame.w * frame.h).toBeLessThanOrEqual(70 * 70);
          expect(frame.x).toBeGreaterThanOrEqual(-reach);
          expect(frame.x + frame.w).toBeLessThanOrEqual(reach);
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
  it('la lanterne, le four et la pièce rougie éclairent la nuit, d’une lueur chaude', () => {
    for (const [id, level] of [['lanterne-mine', 1], ['cuisine', 2], ['enclume', 2]]) {
      const light = itemLight(id, level);
      expect(light.slice(0, 4).every(Number.isFinite)).toBe(true);
      expect(light[4]).toBeUndefined();
    }
    expect(itemLight('pelle', 1)).toBeNull();
  });
  it('les pièces enchantées des paliers VI et VII luisent la nuit, chacune de sa couleur, dans l’emprise 3 × 3', () => {
    for (const id of ['citrouille', 'geode', 'golem', 'cerf', 'naiade', 'sirene', 'athanor', 'grimoire']) {
      const [u, v, z, r, color] = itemLight(id, 7);
      expect(Math.max(Math.abs(u), Math.abs(v))).toBeLessThan(1.5);
      expect(z).toBeGreaterThan(0);
      expect(r).toBeGreaterThan(0);
      if (color !== undefined) expect(color).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
    }
    expect(itemLight('golem', 7)[4]).toBe('120,230,255');
  });
  it('les nouveaux objets vivent : le grimoire flotte, le marteau-pilon frappe, la cane fait le tour de sa mare', () => {
    const book = [0, 1, 2].map(t => itemLayers('grimoire', 7, t)[1].offset[1]);
    expect(new Set(book).size).toBe(3);
    const hammer = [0, 0.5].map(t => itemLayers('marteau-pilon', 5, t)[0].make().svg);
    expect(hammer[0]).not.toBe(hammer[1]);
    const ducks = [0, 2, 4].map(t => itemLayers('canards', 6, t)[0].key);
    expect(new Set(ducks).size).toBe(3);
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

describe('paliers des bâtiments', () => {
  const SKINS_OF = {
    foyer: ['toit-rouge', 'toit-bleu-foyer', 'toit-chaume-foyer'], carriere: ['roche-ocre', 'roche-granit', 'roche-cristal'],
    bosquet: ['printemps', 'automne', 'givre'], puits: ['toit-bleu', 'toit-chaume', 'pierre-blanche'],
    potager: ['cloture-blanche', 'cloture-pierre', 'cloture-fleurie'], atelier: ['enseigne-doree', 'toit-ardoise'], ponton: ['voile-rouge', 'voile-rayee', 'voile-bleue']
  };
  it('chaque bâtiment a ses 7 paliers, chacun dessiné sans valeur manquante, avec et sans skin', () => {
    for (const [site, skins] of Object.entries(SKINS_OF)) {
      expect(LOOKS[site]).toHaveLength(7);
      for (let level = 1; level <= 7; level++) {
        for (const skin of [undefined, ...skins]) {
          const { svg, box: frame } = artMake(site, level, skin)();
          expect(svg).not.toMatch(/NaN|undefined/);
          // Paliers IV et suivants : emprise 3 × 3, cadre élargi
          expect(frame.w).toBe(level >= 4 ? 224 : 152);
        }
        const look = lookAt(site, level);
        look.anims.forEach(anim => {
          const frames = Array.from({ length: anim.n }, (_, f) => anim.frame(f).svg);
          frames.forEach(f => expect(f).not.toMatch(/NaN|undefined/));
          expect(new Set(frames).size).toBeGreaterThan(1);
        });
        look.lights.forEach(light => expect(light).toHaveLength(4));
        look.smoke.forEach(at => expect(at).toHaveLength(3));
      }
    }
  });
  it('les skins changent aussi les grands paliers', () => {
    for (const site of ['foyer', 'carriere', 'bosquet', 'puits', 'atelier']) {
      for (const level of [4, 7]) {
        const origin = lookAt(site, level).make().svg;
        expect(lookAt(site, level).make(SKINS_OF[site][0]).svg).not.toBe(origin);
      }
    }
  });
  it('au-delà du dernier dessin, le plus haut palier sert', () => {
    expect(lookAt('foyer', 9)).toBe(LOOKS.foyer[6]);
    expect(lookAt('carriere', 0)).toBe(LOOKS.carriere[0]);
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
