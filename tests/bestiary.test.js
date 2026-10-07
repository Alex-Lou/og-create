// Lot H6 (HISTOIRE.md, § 6.4, § 6.5 et § 16) : les bêtes écrites dans le Grimoire vivent sur l'île, en plus de celles
// qui y sont déjà ; les familiers suivent leur maître ; Bulle revient dans son bocal quand on écrit Poisson. Les
// Savoirs des maîtres se disent en une bulle et restent sur l'appareil, comme l'Encre.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { villageOf } from '@/world/village';
import { skyAt } from '@/world/sky';
import { ANIMAL_SPRITES } from '@/world/animals';
import { BEASTS, FAMILIARS, bestiaryOf, beastsOf, familiarsOf } from '@/world/bestiary';
import { savoirLine, keepSavoir, heardPages, loadSavoirs, INK_KEY } from '@/game/savoirs';
import { FAMILY_WORDS } from '@/book/painter';

// Petite île de 14 × 14 : un chemin en croix, de l'herbe, une forêt au nord-ouest, une mare au sud-est
const N = 14;
const ground = Array.from({ length: N }, (_, y) => Array.from({ length: N }, (_, x) => {
  if (x === 0 || y === 0 || x === N - 1 || y === N - 1) return '~';
  if (x === 7 || y === 7) return 'p';
  if (x < 4 && y < 4) return 'f';
  if (x > 10 && y > 10) return 'w';
  return 'g';
}).join(''));
const M = {
  ground: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? '~' : ground[y][x]),
  height: () => 1,
  zone: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : 0)
};
const sites = [
  { id: 'foyer', name: 'Maison', x: 4, y: 4, w: 2, h: 2, level: 3 },
  { id: 'potager', name: 'Ferme', x: 9, y: 3, w: 2, h: 2, level: 4 },
  { id: 'ponton', name: 'Ponton', x: 3, y: 9, w: 2, h: 2, level: 1 },
  { id: 'puits', name: 'Puits', x: 9, y: 8, w: 1, h: 1, level: 1 },
  { id: 'atelier', name: 'Atelier', x: 5, y: 10, w: 2, h: 2, level: 1 }
];
const props = [{ kind: 'tree', x: 5, y: 1 }, { kind: 'apple', x: 6, y: 2 }, { kind: 'tree', x: 2, y: 5 }];
const islandOf = written => villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props, written });
const at = (h, weather = 'clair') => skyAt(new Date(2026, 5, 21, 0, Math.round(h * 60)), { weather });
const ids = (village, h) => village.at(30, at(h)).list.map(c => c.id);

const ALL = ['Poisson', 'Oiseau', 'Papillon', 'Abeille', 'Luciole', 'Hibou', 'Grenouille', 'Tortue', 'Poule', 'Mouton', 'Vache'];

describe('le Bestiaire vivant', () => {
  it('rien d’écrit : seuls Tic-Tac (un automate) et le bocal vide d’Ondin sont là', () => {
    const life = bestiaryOf([]);
    expect([...life.familiars].sort()).toEqual(['atelier', 'puits']);
    expect([life.bulle, life.friend, life.farm]).toEqual([false, false, []]);
    const island = islandOf([]);
    const noon = ids(island, 13);
    expect(noon.filter(id => id.startsWith('best:'))).toEqual([]);
    expect(noon).toContain('fam:atelier');
    const bowl = island.at(30, at(13)).list.find(c => c.id === 'fam:puits');
    // (par code, ou de la bibliothèque)
    expect(bowl.sprite[0]).toMatch(/^beast-bowl--|^lib-bocal-vide_/);
    expect(island.say(bowl, at(13)).text).toBe('« Bulle est retourné dans la mer. »');
  });
  it('Bulle revient quand on écrit Poisson', () => {
    const island = islandOf(['Poisson']);
    const bowl = island.at(30, at(13)).list.find(c => c.id === 'fam:puits');
    expect(bowl.sprite[0]).toMatch(/^beast-bowl-bulle-|^lib-bocal-bulle_/);
    expect(island.say(bowl, at(13)).title).toBe('Bulle');
    // De nuit aussi, le bocal reste près d'Ondin
    expect(ids(island, 2)).toContain('fam:puits');
  });
  it('les bêtes écrites s’ajoutent : arbres, air, eau douce ; lucioles et hibou la nuit', () => {
    const island = islandOf(ALL);
    const noon = ids(island, 13);
    for (const id of ['best:bird:0', 'best:butterfly:0', 'best:butterfly:1', 'best:bee:0', 'best:frog', 'best:tortoise']) expect(noon, id).toContain(id);
    expect(noon.some(id => id.startsWith('best:firefly'))).toBe(false);
    const night = ids(island, 23.5);
    expect(night).toContain('best:owl');
    expect(night.filter(id => id.startsWith('best:firefly'))).toHaveLength(5);
    // Chaque luciole luit la nuit (une lumière à sa place, plus forte quand elle s'allume)
    const { list, lights } = island.at(30, at(23.5));
    const flies = list.filter(c => c.id.startsWith('best:firefly'));
    expect(flies.map(f => lights.filter(l => l.r === 9 && l.x === f.x && l.y === f.y && l.dy === -f.z).length)).toEqual([1, 1, 1, 1, 1]);
    expect(flies.every(f => f.glow === 1 || f.glow === 0.55)).toBe(true);
    // Elles sont toutes sur des cases de l'île (ni hors carte, ni NaN) et se dessinent
    for (const h of [6, 13, 19, 23.5]) {
      for (const c of island.at(40, at(h)).list.filter(c => c.kind === 'beast')) {
        expect(Number.isFinite(c.x) && Number.isFinite(c.y) && Number.isFinite(c.z), c.id).toBe(true);
        // (le dessin de la bibliothèque se lit à la demande : load)
        const { svg, load } = c.sprite[1]();
        expect(Boolean(svg || load), c.id).toBe(true);
        if (svg) expect(svg, c.id).not.toMatch(/NaN|undefined/);
      }
    }
  });
  it('la ferme suit le palier du Potager ; l’élément écrit ajoute seulement une variante', () => {
    const farm = islandOf(ALL).farm.map(a => `${a.species}:${a.variant}`);
    expect(farm).toEqual(expect.arrayContaining(['hen:rousse', 'hen:noire', 'hen:blanche', 'hen:grise', 'cow:', 'cow:rousse', 'sheep:', 'sheep:noir']));
    // Pas de cochon au palier 4 : Cochon écrit n'en fait pas venir
    expect(islandOf(['Cochon']).farm.some(a => a.species === 'pig')).toBe(false);
    expect(islandOf([]).farm.map(a => `${a.species}:${a.variant}`)).toEqual(['hen:rousse', 'hen:noire', 'cow:', 'sheep:', 'sheep:']);
  });
  it('les familiers suivent leur maître, et se présentent quand on les touche', () => {
    const island = islandOf(['Oiseau', 'Abeille']);
    for (let t = 0; t < 400; t += 37) {
      const list = island.at(t, at(13)).list;
      const aster = list.find(c => c.id === 'vil:ponton');
      const bosco = list.find(c => c.id === 'fam:ponton');
      expect(Math.hypot(aster.x - bosco.x, aster.y - bosco.y)).toBeLessThan(2.5);
    }
    const list = island.at(30, at(13)).list;
    expect(list.map(c => c.id)).toContain('fam:atelier:amie');
    expect(island.say(list.find(c => c.id === 'fam:ponton'), at(13)).title).toBe('Bosco');
    expect(island.describe(list.find(c => c.id === 'fam:ponton')).title).toBe('Bosco · familier');
    // Les familiers ne s'enfuient pas comme les bêtes sauvages : ils ont toujours quelque chose à dire
    for (const id of Object.keys(FAMILIARS)) expect(FAMILIARS[id].says, id).toBeTruthy();
  });
  it('la Chronique : les bêtes écrites, où elles vivent ; les familiers venus', () => {
    expect(BEASTS).toHaveLength(22);
    expect(beastsOf(['Eau', 'Poisson', 'Chat']).map(b => b.name)).toEqual(['Poisson', 'Chat']);
    expect(beastsOf(['Poisson'])[0].where).toBe('dans la mer');
    expect(familiarsOf([]).map(f => f.name)).toEqual(['Tic-Tac']);
    expect(familiarsOf(['Poisson', 'Renard']).map(f => f.name).sort()).toEqual(['Bulle', 'Mousse', 'Tic-Tac']);
  });
  it('chaque dessin nouveau se dessine à chaque image', () => {
    for (const species of ['bird', 'butterfly', 'firefly', 'bee', 'owl', 'tictac', 'bowl', 'kit']) {
      for (const frame of [0, 1, 'rest']) expect(ANIMAL_SPRITES[species](frame, '').svg, species).toMatch(/^<svg/);
    }
    for (const [species, variant] of [['cow', 'rousse'], ['sheep', 'noir'], ['pig', 'tachete'], ['goat', 'brune'], ['butterfly', 'lune'], ['bowl', 'bulle']]) {
      expect(ANIMAL_SPRITES[species](0, variant).svg).not.toBe(ANIMAL_SPRITES[species](0, '').svg);
    }
  });
});

describe('les Savoirs des maîtres', () => {
  const memory = new Map();
  beforeEach(() => {
    memory.clear();
    vi.stubGlobal('localStorage', { getItem: k => (memory.has(k) ? memory.get(k) : null), setItem: (k, v) => memory.set(k, String(v)), removeItem: k => memory.delete(k) });
  });
  it('chaque Savoir tient en une bulle', () => {
    for (const id of ['ponton', 'carriere', 'puits', 'bosquet', 'potager', 'foyer', 'atelier', 'brume']) {
      for (const family of Object.keys(FAMILY_WORDS)) expect(savoirLine(id, { page: 'p', chapter: 'VII', family }).length).toBeLessThanOrEqual(140);
      expect(savoirLine(id, { page: 'p', chapter: 'VII', ingredient: 'Créations Humaines' }).length).toBeLessThanOrEqual(140);
    }
  });
  it('l’appareil garde ce qui a été soufflé ; l’ingrédient rejoint ceux de l’Encre', () => {
    keepSavoir({ page: 'p1', chapter: 'II', family: 'Matériaux' }, 'Galet');
    keepSavoir({ page: 'p2', chapter: 'I', ingredient: 'Air' }, 'Aster');
    expect(loadSavoirs()).toEqual({ p1: { who: 'Galet', family: 'Matériaux' }, p2: { who: 'Aster', ingredient: 'Air' } });
    expect(JSON.parse(memory.get(INK_KEY))).toEqual({ p2: 'Air' });
    expect(heardPages()).toEqual({ known: ['p2'], heard: ['p1'] });
    // Un ingrédient soufflé plus tard sur une page dont on avait la famille : elle passe aux pages connues
    keepSavoir({ page: 'p1', chapter: 'II', ingredient: 'Métal' }, 'Galet');
    expect(heardPages()).toEqual({ known: ['p2', 'p1'], heard: [] });
  });
});
