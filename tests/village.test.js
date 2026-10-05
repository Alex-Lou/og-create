import { describe, it, expect } from 'vitest';
import { villageOf } from '@/world/village';
import { skyAt } from '@/world/sky';
import { villagerSprite, personOf, ROLES, VIEWS, BUILDS, STYLES } from '@/world/villagers';
import { ANIMAL_SPRITES, HEN_BREEDS } from '@/world/animals';

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
  { id: 'atelier', name: 'Atelier', x: 9, y: 9, w: 2, h: 2, level: 0 }
];
const village = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [{ kind: 'tree', x: 5, y: 1 }, { kind: 'apple', x: 6, y: 2 }] });
const at = (h, weather = 'clair') => skyAt(new Date(2026, 5, 21, 0, Math.round(h * 60)), { weather });

describe('village : habitants', () => {
  it('un habitant par bâtiment bâti, plus la cuisinière du Foyer ; pas de chantier', () => {
    expect(village.residents.map(r => r.role)).toEqual(['potager', 'ponton', 'foyer']);
    expect(village.residents.every(r => r.look.skin && r.look.hair && ROLES[r.role])).toBe(true);
  });
  it('ils marchent par des cases praticables voisines, le jour ; dorment la nuit ; rentrent avec une lanterne le soir', () => {
    const noon = at(13);
    for (let t = 0; t < 600; t += 7) {
      const people = village.at(t, noon).list.filter(c => c.kind === 'villager');
      expect(people).toHaveLength(3);
      for (const p of people) {
        expect(M.ground(Math.round(p.x), Math.round(p.y))).toMatch(/[gp]/);
        expect(p.sprite[1]().svg).not.toMatch(/NaN|undefined/);
      }
    }
    // Ils bougent : deux instants, deux places
    const a = village.at(10, noon).list.filter(c => c.kind === 'villager').map(p => `${p.x},${p.y}`).join();
    const b = village.at(200, noon).list.filter(c => c.kind === 'villager').map(p => `${p.x},${p.y}`).join();
    expect(a).not.toBe(b);
    expect(village.at(5, at(2)).list.filter(c => c.kind === 'villager')).toHaveLength(0);
    const evening = at(22);
    const life = village.at(5, evening);
    expect(life.list.filter(c => c.kind === 'villager').length).toBeGreaterThan(0);
    expect(life.lights.length).toBe(life.list.filter(c => c.kind === 'villager').length);
  });
  it('sous la pluie, un sur deux reste à l’abri, les autres ont un parapluie', () => {
    const people = village.at(30, at(13, 'pluie')).list.filter(c => c.kind === 'villager');
    expect(people).toHaveLength(2);
    expect(people.every(p => p.sprite[0].endsWith('-1'))).toBe(true);
  });
  it('touchés, ils parlent selon leur métier et le temps ; appui long : leur fiche', () => {
    const who = village.at(30, at(13)).list.find(c => c.id === 'vil:ponton');
    expect(village.say(who, at(13)).title).toBe('Pêcheuse');
    expect(village.say(who, at(13, 'orage')).text).toMatch(/orage/);
    expect(village.describe(who).text).toMatch(/Ponton/);
  });
});

describe('village : visiteur et visiteurs installés', () => {
  const visitor = { id: 3, seed: 77, name: 'Iris', role: 'Cartographe', site: 'ponton' };
  const settlers = [{ id: 'v5', seed: 99, name: 'Basile', role: 'Botaniste', site: 'potager', home: { x: 8, y: 2 } }];
  const busy = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [], visitor, settlers });
  it('un installé travaille au bâtiment de son métier, le visiteur flâne depuis le Ponton', () => {
    const settler = busy.residents.find(r => r.id === 'vil:v5');
    const guest = busy.residents.find(r => r.id === 'vis:3');
    expect([settler.role, settler.key, settler.look.label]).toEqual(['potager', 'set-99', 'Botaniste']);
    expect(settler.field).toBeTruthy();
    expect([guest.role, guest.key, guest.guest.name]).toEqual(['visitor', 'vis-77', 'Iris']);
    expect(busy.residents.map(r => r.look.build).includes('child')).toBe(false);
  });
  it('le visiteur ne travaille pas ; touché, il laisse l’île parler pour lui ; appui long : son bateau au Ponton', () => {
    const noon = at(12);
    const seen = new Set();
    for (let t = 0; t < 600; t += 7) {
      const me = busy.at(t, noon).list.find(w => w.id === 'vis:3');
      if (me) seen.add(me.sprite[0].split('-')[2]);
    }
    expect(seen.has('work')).toBe(false);
    const who = { kind: 'villager', id: 'vis:3' };
    expect(busy.say(who, noon)).toEqual({ title: 'Iris', text: '' });
    expect(busy.describe(who).text).toMatch(/Ponton/);
  });
});

describe('village : bêtes', () => {
  it('la ferme suit le palier du Potager : poules, poussins, vache, moutons ; couchés la nuit', () => {
    const species = village.at(12, at(13)).list.filter(c => c.kind === 'beast').map(c => c.species);
    expect(species.filter(s => s === 'hen')).toHaveLength(2);
    expect(species.filter(s => s === 'chick')).toHaveLength(2);
    expect(species).toContain('cow');
    expect(species.filter(s => s === 'sheep')).toHaveLength(2);
    expect(species).not.toContain('pig');
    const cow = village.at(12, at(2)).list.find(c => c.species === 'cow');
    expect(cow.sprite[0]).toMatch(/rest$/);
    expect(village.say({ kind: 'beast', species: 'cow' }, at(13)).text).toBe('Meuh !');
  });
  it('les bêtes sauvages ont leurs heures ; touchées, elles s’enfuient puis disparaissent', () => {
    const day = at(13);
    const night = at(1);
    expect(village.at(3, day).list.some(c => c.species === 'rabbit')).toBe(true);
    expect(village.at(3, day).list.some(c => c.species === 'fox')).toBe(false);
    expect(village.at(3, night).list.some(c => c.species === 'fox' || c.species === 'hedgehog')).toBe(true);
    expect(village.at(3, day).list.some(c => c.species === 'koi')).toBe(true);
    const scared = new Map([['wild:rabbit:0', { at: 2 }]]);
    expect(village.at(2.5, day, scared).list.find(c => c.id === 'wild:rabbit:0').flip).toBe(true);
    expect(village.at(10, day, scared).list.find(c => c.id === 'wild:rabbit:0')).toBeUndefined();
    expect(village.say({ kind: 'beast', species: 'fox' }, night)).toBeNull();
  });
  it('chaque dessin de bête et d’habitant se fait sans valeur manquante', () => {
    for (const breed of Object.keys(HEN_BREEDS)) [0, 1].forEach(f => expect(ANIMAL_SPRITES.hen(f, breed).svg).not.toMatch(/NaN|undefined/));
    for (const k of ['cow', 'sheep', 'pig', 'goat']) [0, 1, 'rest'].forEach(f => expect(ANIMAL_SPRITES[k](f).svg).not.toMatch(/NaN|undefined/));
    for (const k of ['chick', 'deer', 'fox', 'rabbit', 'hedgehog', 'squirrel', 'heron']) [0, 1].forEach(f => expect(ANIMAL_SPRITES[k](f).svg).not.toMatch(/NaN|undefined/));
    for (const [id, role] of Object.entries(ROLES)) {
      for (const pose of ['walk', 'idle', 'work', 'wave']) {
        for (const view of VIEWS) {
          for (const frame of [0, 1, 2, 3]) {
            const { svg } = villagerSprite({ ...role, skin: '#F6D3B3', hair: '#3A2A1E' }, { pose, view, frame, lantern: true, umbrella: id === 'ponton' });
            expect(svg).not.toMatch(/NaN|undefined/);
          }
        }
      }
    }
    // Ancien nom de la vue de dos ; visiteurs tirés au hasard, toutes silhouettes et coiffures
    expect(villagerSprite({ ...ROLES.potager, skin: '#F6D3B3', hair: '#3A2A1E' }, { back: true }).svg).toBe(villagerSprite({ ...ROLES.potager, skin: '#F6D3B3', hair: '#3A2A1E' }, { view: 'ne' }).svg);
    const builds = new Set();
    const styles = new Set();
    for (let i = 0; i < 80; i++) {
      const look = personOf(i * 7919 + 3);
      builds.add(look.build);
      styles.add(look.style);
      for (const view of VIEWS) expect(villagerSprite(look, { pose: 'walk', view, frame: i % 4 }).svg).not.toMatch(/NaN|undefined|null/);
    }
    expect([...builds].sort()).toEqual(Object.keys(BUILDS).sort());
    expect(styles.size).toBe(STYLES.length);
    expect(personOf(42)).toEqual(personOf(42));
  });
  it('chaque habitant est un SVG bien formé (une image se charge seulement sans attribut en double)', () => {
    const doubled = svg => [...svg.matchAll(/<(\w+)([^>]*)>/g)].filter(m => {
      const names = [...m[2].matchAll(/\s([\w-]+)=/g)].map(x => x[1]);
      return new Set(names).size !== names.length;
    });
    for (const role of Object.values(ROLES)) {
      for (const view of VIEWS) {
        for (const pose of ['walk', 'idle', 'work', 'wave']) {
          const { svg } = villagerSprite({ ...role, skin: '#F6D3B3', hair: '#3A2A1E' }, { pose, view, frame: 1, lantern: true, umbrella: true });
          expect(doubled(svg)).toEqual([]);
        }
      }
    }
    for (let i = 0; i < 30; i++) expect(doubled(villagerSprite(personOf(i * 31 + 1), { view: VIEWS[i % 3], pose: 'walk', frame: i % 4 }).svg)).toEqual([]);
  });
});

describe('village : bêtes des climats', () => {
  // Deux quartiers : à l'ouest le cœur (sans climat), à l'est des dunes ; un cactus et un gisement à laisser libres
  const dunesM = {
    ground: (x, y) => (x < 0 || y < 0 || x >= N || y >= N || x === 0 || y === 0 || x === N - 1 || y === N - 1 ? '~' : x >= 7 ? 's' : 'g'),
    height: () => 1,
    zone: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : x >= 7 ? 1 : 0)
  };
  const props = [{ kind: 'cactus', x: 10, y: 3 }];
  const deposit = { x: 10, y: 9 };
  const make = owned => villageOf({ n: N, M: dunesM, sites: [], owned, crafts: [], props, climates: [null, 'dunes'], avoid: [deposit] });
  const dunes = make(new Set([0, 1]));
  const climBeasts = (v, t, phase) => v.at(t, phase).list.filter(c => c.id.startsWith('clim:'));
  const free = c => !(c.x === 10 && c.y === 3) && !(Math.abs(c.x - deposit.x) <= 1 && Math.abs(c.y - deposit.y) <= 1);
  it('une bête de chaque par quartier à soi de son climat, sur une case libre ; aucune ailleurs', () => {
    for (const h of [3, 13]) {
      const list = climBeasts(dunes, 5, at(h));
      expect(list.map(c => c.species).sort()).toEqual(['camel', 'fennec']);
      // Celle qui dort est posée au centre de sa case : dans les dunes, hors du décor et de la clairière du gisement
      const asleep = list.find(c => c.sprite[0].endsWith('rest'));
      expect(dunesM.zone(asleep.x, asleep.y)).toBe(1);
      expect(free(asleep)).toBe(true);
    }
    expect(climBeasts(make(new Set([0])), 5, at(13))).toEqual([]);
  });
  it('chacune à ses heures : le fennec dort le jour et trotte la nuit, le dromadaire l’inverse', () => {
    const key = (h, s) => climBeasts(dunes, 5, at(h)).find(c => c.species === s).sprite[0];
    expect(key(13, 'fennec')).toMatch(/rest$/);
    expect(key(13, 'camel')).not.toMatch(/rest$/);
    expect(key(2, 'fennec')).not.toMatch(/rest$/);
    expect(key(2, 'camel')).toMatch(/rest$/);
    // Sous la pluie, le dromadaire se couche
    expect(climBeasts(dunes, 5, at(13, 'pluie')).find(c => c.species === 'camel').sprite[0]).toMatch(/rest$/);
  });
  it('touchées, elles s’enfuient puis disparaissent ; appui long : leur fiche', () => {
    const id = climBeasts(dunes, 5, at(13)).find(c => c.species === 'camel').id;
    const scared = new Map([[id, { at: 2 }]]);
    expect(dunes.at(2.5, at(13), scared).list.find(c => c.id === id).flip).toBe(true);
    expect(dunes.at(10, at(13), scared).list.find(c => c.id === id)).toBeUndefined();
    expect(dunes.describe({ kind: 'beast', species: 'fennec' })).toEqual({ title: 'Fennec', text: 'Il dort le jour et trotte la nuit dans les Dunes.', hint: 'Toucher : il s’enfuit' });
    expect(dunes.say({ kind: 'beast', species: 'camel' }, at(13))).toBeNull();
  });
  it('les douze dessins se font sans valeur manquante ni attribut en double, à chaque image', () => {
    const doubled = svg => [...svg.matchAll(/<(\w+)([^>]*)>/g)].filter(m => {
      const names = [...m[2].matchAll(/\s([\w-]+)=/g)].map(x => x[1]);
      return new Set(names).size !== names.length;
    });
    const species = ['snowFox', 'ibex', 'puffin', 'pony', 'frog', 'tortoise', 'fennec', 'camel', 'chameleon', 'toucan', 'salamander', 'crow'];
    for (const k of species) {
      const frames = [0, 1, 'rest'].map(f => ANIMAL_SPRITES[k](f).svg);
      for (const svg of frames) {
        expect(svg).not.toMatch(/NaN|undefined/);
        expect(doubled(svg)).toEqual([]);
      }
      // Trois images distinctes : le geste et le sommeil se voient
      expect(new Set(frames).size).toBe(3);
    }
  });
});
