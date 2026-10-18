import { describe, it, expect, vi, afterEach } from 'vitest';
import { villageOf } from '@/world/village';
import { skyAt } from '@/world/sky';
import { villagerSprite, personOf, ROLES, VIEWS, BUILDS, STYLES } from '@/world/villagers';
import { ANIMAL_SPRITES, HEN_BREEDS } from '@/world/animals';
import { CREATURE_TEXTS } from '@/texts/world/creatures';
import { RITUAL_SAYS, MEAL_SAYS, MOOD_SAYS, MEETINGS, VISIT_SAYS, WINTER_SAYS, SEASON_SAYS, SETTLER_SAYS, MARKET_SAYS } from '@/texts/village';
import { marketDay } from '@/world/village/agenda';
import { cycleStart, dayHourOf } from '@/world/gameClock';

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
// Les poules d’Agathe, leur cage ouverte au camp (serveur : beasts.list) ; la bulle de Caramel attend
const coop = { x: 9, y: 10, hens: [{ id: 'poule-rousse', name: 'Caramel', ready: 2 }, { id: 'poule-blanche', name: 'Flocon', ready: 0 }, { id: 'poule-noire', name: 'Réglisse', ready: 0 }] };
const village = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [{ kind: 'tree', x: 5, y: 1 }, { kind: 'apple', x: 6, y: 2 }], coop, acts: ['T', 'I', 'II', 'III'] });
const at = (h, weather = 'clair') => skyAt(new Date(2026, 5, 21, 0, Math.round(h * 60)), { weather });

describe('village : habitants', () => {
  it('un habitant par bâtiment bâti, plus la cuisinière du Foyer ; pas de chantier', () => {
    expect(village.residents.map(r => r.role)).toEqual(['potager', 'ponton', 'foyer']);
    expect(village.residents.every(r => r.look.skin && r.look.hair && ROLES[r.role])).toBe(true);
    // La peau et les cheveux fixés par la fiche l'emportent sur le tirage (Robby, peau de granit ; Nathan, mèche grise)
    for (const r of village.residents) for (const k of ['skin', 'hair']) if (ROLES[r.role][k]) expect(r.look[k]).toBe(ROLES[r.role][k]);
  });
  // (la nuit, chacun dort couché chez lui : choix de l'auteur, 16 oct. ; agenda.js)
  it('ils marchent par des cases praticables voisines, le jour ; dorment chez eux la nuit ; rentrent avec une lanterne le soir', () => {
    const noon = at(13);
    for (let t = 0; t < 600; t += 7) {
      const people = village.at(t, noon).list.filter(c => c.kind === 'villager');
      expect(people).toHaveLength(3);
      for (const p of people) {
        expect(M.ground(Math.round(p.x), Math.round(p.y))).toMatch(/[gp]/);
        // Dessin du jeu (svg tout de suite) ou de la bibliothèque (un maître : cadre tout de suite, dessin à la lecture)
        const drawn = p.sprite[1]();
        expect(drawn.box.w).toBeGreaterThan(0);
        if (drawn.svg) expect(drawn.svg).not.toMatch(/NaN|undefined/);
      }
    }
    // Ils bougent : deux instants, deux places
    const a = village.at(10, noon).list.filter(c => c.kind === 'villager').map(p => `${p.x},${p.y}`).join();
    const b = village.at(200, noon).list.filter(c => c.kind === 'villager').map(p => `${p.x},${p.y}`).join();
    expect(a).not.toBe(b);
    // (le temps de rentrer chez soi : ils y marchent, puis s'y couchent)
    village.at(5, at(2));
    const night = village.at(400, at(2)).list.filter(c => c.kind === 'villager');
    expect(night).toHaveLength(3);
    expect(night.every(p => p.pose === 'sleep')).toBe(true);
    const evening = at(22);
    const life = village.at(5, evening);
    expect(life.list.filter(c => c.kind === 'villager').length).toBeGreaterThan(0);
    expect(life.lights.length).toBe(life.list.filter(c => c.kind === 'villager' && c.pose !== 'sleep').length);
  });
  // (choix de l'auteur, 16 oct. : celui qui s'abrite reste visible, à sa porte, sans parapluie)
  it('sous la pluie, un sur deux s’abrite à sa porte, les autres ont un parapluie', () => {
    village.at(30, at(13, 'pluie'));
    const people = village.at(400, at(13, 'pluie')).list.filter(c => c.kind === 'villager');
    expect(people).toHaveLength(3);
    const umbrella = p => p.sprite[0].endsWith('-1') || p.sprite[0].includes('_parapluie_');
    const sheltered = people.filter(p => !umbrella(p));
    expect(sheltered.map(p => p.id)).toEqual(['vil:ponton']);
    const ponton = village.residents.find(r => r.role === 'ponton');
    expect(Math.hypot(sheltered[0].x - ponton.work.x, sheltered[0].y - ponton.work.y)).toBeLessThan(1.8);
  });
  it('touchés, ils parlent selon leur métier et le temps ; appui long : leur fiche', () => {
    const who = village.at(30, at(13)).list.find(c => c.id === 'vil:ponton');
    expect(village.say(who, at(13)).title).toBe('Navigatrice');
    expect(village.say(who, at(13, 'orage')).text).toMatch(/coup de vent/);
    expect(village.describe(who).text).toMatch(/Ponton/);
  });
});

describe('village : la troupe envoyée par le serveur (bible, § 6.6 et § 6.7)', () => {
  // Sans Atelier ni Potager bâtis : Nathan au camp, Maggy endormie près de l'emplacement du Potager
  const unbuilt = sites.map(s => (s.id === 'potager' ? { ...s, level: 0 } : s));
  const troupe = [{ id: 'potager', built: false, asleep: true }, { id: 'ponton', built: true }, { id: 'atelier', built: false }, { id: 'foyer', built: true }];
  const life = villageOf({ n: N, M, sites: unbuilt, owned: new Set([0]), crafts: [], props: [], troupe });
  const who = role => life.residents.find(r => r.role === role);
  it('chacun à sa place : au travail, au camp, ou couché près de son futur bâtiment', () => {
    expect(life.residents.map(r => r.role)).toEqual(['potager', 'ponton', 'atelier', 'foyer']);
    expect([who('atelier').camp, who('atelier').work]).toEqual([true, who('foyer').work]);
    expect([who('potager').asleep, who('potager').camp]).toEqual([true, false]);
    expect(Math.abs(who('potager').work.x - 9.5) + Math.abs(who('potager').work.y - 3.5)).toBeLessThan(4);
  });
  it('le dormeur reste couché jour et nuit, et ne dit rien quand on le touche', () => {
    for (const h of [3, 13, 22]) {
      const sleeper = life.at(5, at(h)).list.find(c => c.id === 'vil:potager');
      expect(sleeper.sprite[0]).toMatch(/-sleep-[01]$|_couche_[12]$/);
    }
    expect(life.say({ kind: 'villager', id: 'vil:potager' }, at(13)).text).toBe('');
    expect(life.describe({ kind: 'villager', id: 'vil:potager' }).text).toMatch(/réveiller/);
    expect(life.describe({ kind: 'villager', id: 'vil:atelier' }).text).toMatch(/camp/);
  });
  it('réveillé sans bâtiment, il attend près de son emplacement (pas au camp)', () => {
    const awake = villageOf({ n: N, M, sites: unbuilt, owned: new Set([0]), crafts: [], props: [], troupe: troupe.map(v => (v.id === 'potager' ? { ...v, asleep: false } : v)) });
    const melisse = awake.residents.find(r => r.role === 'potager');
    expect([melisse.asleep, melisse.camp, melisse.waiting]).toEqual([false, false, true]);
    expect(melisse.work).toEqual(who('potager').work);
  });
});

describe('village : tournées variées', () => {
  it('à l’arrêt, personne ne se tient sur personne (le soir autour du feu non plus)', () => {
    for (const h of [10, 13, 22]) {
      for (let t = 0; t < 900; t += 11) {
        const still = village.at(t, at(h)).list.filter(c => c.kind === 'villager' && c.pose !== 'walk');
        for (let i = 0; i < still.length; i++) {
          for (let j = i + 1; j < still.length; j++) expect(Math.hypot(still[i].x - still[j].x, still[i].y - still[j].y)).toBeGreaterThan(0.1);
        }
      }
    }
  });
  it('chacun sa tournée, et elle change d’un jour à l’autre', () => {
    const track = (v, id) => Array.from({ length: 60 }, (_, i) => v.at(i * 15, at(11)).list.find(c => c.id === id)).map(c => (c ? `${c.x.toFixed(2)},${c.y.toFixed(2)}` : '-')).join(' ');
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(2026, 9, 5, 11));
      const a = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [] });
      const day1 = track(a, 'vil:potager');
      expect(day1).not.toBe(track(a, 'vil:ponton'));
      vi.setSystemTime(new Date(2026, 9, 6, 11));
      expect(track(a, 'vil:potager')).not.toBe(day1);
    } finally {
      vi.useRealTimers();
    }
  });
});

// La vie des habitants, lot B (choix de l'auteur, 16 oct. : textes validés) : ce qu'ils disent selon ce qu'ils font
describe('village : ce qu’ils disent selon leur journée', () => {
  const who = id => ({ kind: 'villager', id });
  it('à son rituel, la réplique du rituel ; au repas, celle du repas ; la nuit, rien', () => {
    // (son rituel la tire du lit, un peu avant le lever du soleil)
    const dawn = at(at(12).rise - 0.1);
    expect(village.say(who('vil:ponton'), dawn).text).toBe(RITUAL_SAYS.ponton);
    expect(village.say(who('vil:ponton'), at(12.5)).text).toBe(MEAL_SAYS.ponton);
    // (Agathe, au Foyer à midi : c'est son rituel)
    expect(village.say(who('vil:foyer'), at(12.5)).text).toBe(RITUAL_SAYS.foyer);
    expect(village.say(who('vil:ponton'), at(2)).text).toBe('');
  });
  it('son humeur s’ajoute à ce qu’il peut dire, et il ne redit pas tout de suite la même chose', () => {
    const troupe = [{ id: 'potager', built: true }, { id: 'ponton', built: true, mood: 'triste' }, { id: 'foyer', built: true }];
    const sad = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [], troupe });
    vi.useFakeTimers();
    try {
      const said = [];
      for (let i = 0; i < 80; i++) {
        vi.setSystemTime(new Date(2026, 9, 5, 15, 0, i * 7));
        said.push(sad.say(who('vil:ponton'), at(10.5)).text);
      }
      expect(said).toContain(MOOD_SAYS.triste.ponton);
      expect(said.every((t, i) => !i || t !== said[i - 1])).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
  it('chaque maître a ses répliques ; les rencontres vont d’un maître à un autre, en deux bulles', () => {
    const masters = ['ponton', 'foyer', 'atelier', 'puits', 'bosquet', 'carriere', 'potager'];
    for (const table of [RITUAL_SAYS, VISIT_SAYS, MARKET_SAYS, MOOD_SAYS.triste, MOOD_SAYS.heureux, WINTER_SAYS]) expect(Object.keys(table).sort()).toEqual([...masters].sort());
    expect(Object.keys(MEAL_SAYS).sort()).toEqual(masters.filter(m => m !== 'foyer').sort());
    for (const [key, lines] of Object.entries(MEETINGS)) {
      const [from, to] = key.split('>');
      expect(masters.includes(from) && masters.includes(to) && from !== to).toBe(true);
      expect(lines).toHaveLength(2);
    }
    // (lot C : une rencontre par paire de camarades, dans un sens ou dans l'autre ; chaque saison, chaque métier)
    const pairs = Object.keys(MEETINGS).map(key => key.split('>').sort().join('+'));
    expect(new Set(pairs).size).toBe(pairs.length);
    expect(pairs).toHaveLength((masters.length * (masters.length - 1)) / 2);
    for (const season of ['printemps', 'ete', 'automne']) expect(Object.keys(SEASON_SAYS[season]).sort()).toEqual([...masters].sort());
    expect(Object.keys(SETTLER_SAYS).sort()).toEqual([...masters].sort());
    const all = [RITUAL_SAYS, MEAL_SAYS, VISIT_SAYS, MARKET_SAYS, MOOD_SAYS.triste, MOOD_SAYS.heureux, WINTER_SAYS, ...Object.values(SEASON_SAYS)].flatMap(Object.values)
      .concat(Object.values(SETTLER_SAYS).flat(), Object.values(MEETINGS).flat());
    for (const text of all) expect(text.length, text).toBeLessThanOrEqual(140);
  });
  it('un voyageur installé parle de son métier, pas avec la voix du maître qui travaille là', () => {
    const settlers = [{ id: 'v5', seed: 99, name: 'Basile', role: 'Botaniste', site: 'potager', home: { x: 8, y: 2 } }];
    const busy = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [], settlers });
    vi.useFakeTimers();
    try {
      const said = new Set();
      for (let i = 0; i < 40; i++) {
        vi.setSystemTime(new Date(2026, 9, 5, 15, 0, i * 7));
        said.add(busy.say({ kind: 'villager', id: 'vil:v5' }, at(10.5)).text);
      }
      expect([...said].some(text => SETTLER_SAYS.potager.includes(text))).toBe(true);
      expect([...said].some(text => text.includes('carottes'))).toBe(false);
    } finally {
      vi.useRealTimers();
    }
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
    expect(species.filter(s => s === 'hen')).toHaveLength(3);
    expect(species.filter(s => s === 'chick')).toHaveLength(2);
    expect(species).toContain('cow');
    expect(species.filter(s => s === 'sheep')).toHaveLength(2);
    expect(species).not.toContain('pig');
    const cow = village.at(12, at(2)).list.find(c => c.species === 'cow');
    // (couchée : rest, ou de la bibliothèque, couchée les yeux fermés)
    expect(cow.sprite[0]).toMatch(/rest$|_clignement$/);
    expect(village.say({ kind: 'beast', species: 'cow' }, at(13)).text).toBe('(Elle meugle.)');
    // Chaque bête porte son nom au serveur (bible, § 6.16 : on la nourrit) ; les poussins, non
    const named = village.at(12, at(13)).list.filter(c => c.beast).map(c => c.beast);
    expect(named).toEqual(['poule-rousse', 'poule-blanche', 'poule-noire', 'vache', 'mouton', 'brebis']);
  });
  it('les poules d’Agathe vivent au camp, autour de leur cage ; un œuf au sol tant que la bulle attend', () => {
    const list = village.at(12, at(13)).list;
    for (const hen of list.filter(c => c.species === 'hen')) expect(Math.max(Math.abs(hen.x - coop.x), Math.abs(hen.y - coop.y))).toBeLessThan(4.5);
    expect(list.filter(c => c.kind === 'egg').map(c => c.id)).toEqual(['egg:poule-rousse']);
    const madame = list.find(c => c.beast === 'poule-noire');
    expect([village.describe(madame).title, village.describe(madame).text]).toEqual(['Réglisse', 'Réglisse ne pond pas. Elle juge.']);
    expect(village.say(list.find(c => c.beast === 'poule-rousse'), at(13)).title).toBe('Caramel');
    // La cage fermée (ou pas encore là) : pas de poules ; la vache et les moutons restent au Potager
    const closed = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [] }).at(12, at(13)).list;
    expect(closed.some(c => c.species === 'hen' || c.kind === 'egg')).toBe(false);
    expect(closed.some(c => c.species === 'cow')).toBe(true);
  });
  it('les bêtes sauvages vivent à leurs heures, dans leurs zones ; touchées, elles sursautent, trottinent et reviennent, sans disparaître', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 12) });
    const wild = villageOf({ n: N, M, sites, owned: new Set([0]), crafts: [], props: [{ kind: 'tree', x: 5, y: 1 }, { kind: 'apple', x: 6, y: 2 }], coop, acts: ['T', 'I', 'II', 'III'], zoneIds: ['coeur'] });
    const species = h => wild.at(3, at(h)).list.map(c => c.species);
    const days = Array.from({ length: 60 }, (_, i) => 8 + i * 0.16);
    const nights = Array.from({ length: 30 }, (_, i) => 22.5 + i * 0.05);
    // Le lapin vit au cœur, le jour ; le renard et le hérisson, à la Lisière et aux Jardins : jamais au cœur
    expect(days.some(h => species(h).includes('rabbit'))).toBe(true);
    expect(nights.some(h => species(h).includes('rabbit'))).toBe(false);
    expect([...days, ...nights].some(h => species(h).includes('fox') || species(h).includes('hedgehog'))).toBe(false);
    expect(species(13)).toContain('koi');
    // Un lapin dehors regarde d'un côté ; touché, il bondit, trottine de ce côté (moins d'une demi-case), se retourne et
    // revient
    const h = days.find(x => wild.at(2, at(x)).list.some(c => c.species === 'rabbit'));
    const id = wild.at(2, at(h)).list.find(c => c.species === 'rabbit').id;
    const rabbit = (time, scared) => wild.at(time, at(h), scared).list.find(c => c.id === id);
    const calm = rabbit(2);
    const scared = new Map([[id, { at: 2 }]]);
    expect(rabbit(2.15, scared).z).toBeGreaterThan(calm.z);
    const away = rabbit(3.3, scared);
    const step = (calm.flip ? -1 : 1) * 0.35;
    expect(away.x - calm.x).toBeCloseTo(step, 1);
    expect(away.y - calm.y).toBeCloseTo(-step, 1);
    expect(away.flip).toBe(calm.flip);
    expect(rabbit(4, scared).flip).toBe(!calm.flip);
    // Revenu à sa place, toujours là
    const pose = c => ({ x: c.x, y: c.y, flip: c.flip });
    expect(pose(rabbit(10, scared))).toEqual(pose(rabbit(10)));
    expect(wild.describe({ kind: 'beast', species: 'fox' }).hint).toBe('Toucher : il sursaute');
    expect(wild.say({ kind: 'beast', species: 'fox' }, at(1))).toBeNull();
    vi.useRealTimers();
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
  // Deux quartiers : à l'ouest le cœur (sans climat), à l'est un climat (les Dunes d'Or, ou l'Oasis cachée) ; un cactus et
  // un gisement à laisser libres
  const dunesM = {
    ground: (x, y) => (x < 0 || y < 0 || x >= N || y >= N || x === 0 || y === 0 || x === N - 1 || y === N - 1 ? '~' : x >= 7 ? 's' : 'g'),
    height: () => 1,
    zone: (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? -1 : x >= 7 ? 1 : 0)
  };
  const props = [{ kind: 'cactus', x: 10, y: 3 }];
  const deposit = { x: 10, y: 9 };
  const make = (owned, east) => villageOf({ n: N, M: dunesM, sites: [], owned, crafts: [], props, zoneIds: ['coeur', east], avoid: [deposit] });
  const beasts = (v, h, weather, t = 5, scared) => v.at(t, at(h, weather), scared).list.filter(c => c.id.startsWith('wild:'));
  const free = c => !(Math.round(c.x) === 10 && Math.round(c.y) === 3) && !(Math.abs(Math.round(c.x) - deposit.x) <= 1 && Math.abs(Math.round(c.y) - deposit.y) <= 1);
  const days = Array.from({ length: 60 }, (_, i) => 8 + i * 0.16);
  afterEach(() => vi.useRealTimers());
  it('le dromadaire de l’Oasis, le jour par temps clair, sur une case libre de sa zone ; aucun ailleurs, ni la nuit, ni sous la pluie', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 12) });
    const oasis = make(new Set([0, 1]), 'oasis');
    const seen = days.flatMap(h => beasts(oasis, h, 'clair'));
    expect(seen.some(c => c.species === 'camel')).toBe(true);
    for (const c of seen) {
      expect(dunesM.zone(Math.round(c.x), Math.round(c.y))).toBe(1);
      expect(free(c)).toBe(true);
    }
    expect(days.some(h => beasts(oasis, h, 'pluie').length)).toBe(false);
    expect(Array.from({ length: 20 }, (_, i) => 23 + i * 0.1).some(h => beasts(oasis, h, 'clair').length)).toBe(false);
    expect(days.some(h => beasts(make(new Set([0]), 'oasis'), h, 'clair').length)).toBe(false);
    // (le fennec n'est pas de l'Oasis)
    expect(seen.some(c => c.species === 'fennec')).toBe(false);
  });
  it('touchées, elles sursautent et reviennent, sans disparaître ; appui long : leur fiche', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 12) });
    const oasis = make(new Set([0, 1]), 'oasis');
    const h = days.find(x => beasts(oasis, x, 'clair').some(c => c.species === 'camel'));
    const id = beasts(oasis, h, 'clair').find(c => c.species === 'camel').id;
    const scared = new Map([[id, { at: 2 }]]);
    const camel = (time, sc) => beasts(oasis, h, 'clair', time, sc).find(c => c.id === id);
    expect(camel(2.5, scared)).toBeDefined();
    const pose = c => ({ x: c.x, y: c.y, flip: c.flip });
    expect(pose(camel(10, scared))).toEqual(pose(camel(10)));
    // Il reste dans sa case : moins d'une demi-case de chaque côté
    for (const time of [2.1, 2.5, 3, 3.3, 3.8, 4.2]) {
      expect(Math.abs(camel(time, scared).x - camel(time).x)).toBeLessThan(0.5);
      expect(Math.abs(camel(time, scared).y - camel(time).y)).toBeLessThan(0.5);
    }
    // (sa fiche : celle du Bestiaire, texts/world/creatures.js)
    expect(oasis.describe({ kind: 'beast', species: 'camel', id })).toEqual({ title: CREATURE_TEXTS.chameau[0], text: CREATURE_TEXTS.chameau[1], hint: 'Toucher : il sursaute' });
    expect(oasis.say({ kind: 'beast', species: 'camel' }, at(13))).toBeNull();
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

// Les fondations de la vie (choix de l'auteur, 18 oct.) : un rang fixe par habitant, un village refait sans saut ni
// calcul pour rien, un voyageur installé qui ne prend pas la place de son maître
describe('village : fondations de la vie', () => {
  const base = { n: N, M, sites, owned: new Set([0]), crafts: [], props: [] };
  const people = (v, t, h = 10) => v.at(t, at(h)).list.filter(c => c.kind === 'villager');
  it('un rang fixe : celui de la troupe, puis les voyageurs installés, puis le voyageur de passage', () => {
    const settlers = [{ id: 'v5', seed: 99, name: 'Basile', role: 'Botaniste', site: 'potager', home: { x: 8, y: 2 } }];
    const v = villageOf({ ...base, settlers, visitor: { id: 3, seed: 77, name: 'Iris', role: 'Cartographe', site: 'ponton' } });
    expect(v.residents.map(r => [r.id, r.k])).toEqual([['vil:potager', 0], ['vil:ponton', 4], ['vil:foyer', 6], ['vil:v5', 7], ['vis:3', 11]]);
    // (un maître de plus dans la troupe ne change pas le rang des autres)
    const fewer = villageOf({ ...base, troupe: [{ id: 'potager', built: true }, { id: 'foyer', built: true }] });
    expect(fewer.residents.map(r => [r.role, r.k])).toEqual([['potager', 0], ['foyer', 6]]);
  });
  it('refait à l’identique, le village garde ses tournées : personne ne bouge d’une image à l’autre', () => {
    const v1 = villageOf(base);
    people(v1, 30);
    const before = people(v1, 300);
    const v2 = villageOf({ ...base, before: v1 });
    expect(v2.life.planner).toBe(v1.life.planner);
    for (const p of people(v2, 300.016)) {
      const q = before.find(b => b.id === p.id);
      expect(Math.hypot(p.x - q.x, p.y - q.y), p.id).toBeLessThan(0.1);
    }
  });
  it('refait autrement (une création posée), chacun repart de là où il se tenait : rien ne saute', () => {
    const v1 = villageOf(base);
    people(v1, 30);
    const before = people(v1, 300);
    const v2 = villageOf({ ...base, crafts: [{ craft: 'banc', x: 2, y: 12 }], before: v1 });
    expect(v2.life.planner).not.toBe(v1.life.planner);
    for (const p of people(v2, 300.016)) {
      const q = before.find(b => b.id === p.id);
      expect(Math.hypot(p.x - q.x, p.y - q.y), p.id).toBeLessThan(0.1);
    }
  });
  it('d’une image à l’autre, personne ne saute : ni quand l’agenda change (le repas), ni aux virages', () => {
    const v = villageOf(base);
    let prev = null;
    let worst = 0;
    for (let i = 0; i < 2400; i++) {
      const list = people(v, 30 + i * 0.016, 11.4 + i * 0.0005);
      if (prev) for (const p of list) { const q = prev.find(o => o.id === p.id); if (q) worst = Math.max(worst, Math.hypot(p.x - q.x, p.y - q.y)); }
      prev = list;
    }
    // (un pas d'une image : bien moins d'une case)
    expect(worst).toBeLessThan(0.05);
  });
  it('chacun a sa zone de vie : son bâtiment et 3 cases autour, où l’on marche ; son terrain de métier y est', () => {
    const v = villageOf(base);
    for (const r of v.residents) {
      const site = sites.find(s => s.id === r.role);
      expect(r.zone.cells.length, r.id).toBeGreaterThan(1);
      for (const c of r.zone.cells) {
        expect(c.x >= site.x - 3 && c.x < site.x + site.w + 3 && c.y >= site.y - 3 && c.y < site.y + site.h + 3, `${r.id} ${c.x},${c.y}`).toBe(true);
        expect(M.ground(c.x, c.y)).not.toBe('~');
      }
      expect(r.zone.trade.every(c => r.zone.cells.includes(c))).toBe(true);
    }
    // (Maggy, l'herbe ; Agathe, les chemins)
    expect(v.residents.find(r => r.role === 'potager').zone.trade.every(c => M.ground(c.x, c.y) === 'g')).toBe(true);
    expect(v.residents.find(r => r.role === 'foyer').zone.trade.length).toBeGreaterThan(0);
  });
  it('il flâne dans sa zone de vie : loin des portes, on le trouve toujours chez lui', () => {
    const v = villageOf(base);
    const doors = v.residents.map(r => r.work);
    let checked = 0;
    for (let i = 0; i < 1500; i++) {
      for (const p of people(v, 30 + i * 2, 9 + i * 0.002)) {
        if (p.pose === 'walk' || doors.some(d => Math.hypot(d.x - p.x, d.y - p.y) < 2.2) || Math.hypot(v.home.x - p.x, v.home.y - p.y) < 2.2) continue;
        const r = v.residents.find(o => o.id === p.id);
        expect(r.zone.cells.some(c => Math.hypot(c.x - p.x, c.y - p.y) < 0.8), `${p.id} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).toBe(true);
        checked++;
      }
    }
    // (assez de flâneries vues pour que le test dise quelque chose)
    expect(checked).toBeGreaterThan(100);
  });
  it('la tournée du jour couvre la journée, de son lever au soir, sans boucle', () => {
    const v = villageOf(base);
    const day = dayHourOf(Date.now()).day;
    for (const r of v.residents) {
      const plan = v.life.planner.planOf(r, false, day);
      expect(plan.total, r.id).toBeGreaterThan(72 * 60);
      expect(plan.legs.length, r.id).toBeGreaterThan(8);
      expect(plan.legs.length, r.id).toBeLessThan(40);
    }
    // (d'un jour à l'autre, une autre tournée)
    const r = v.residents[0];
    expect(v.life.planner.planOf(r, false, day + 1).legs.map(l => l.act).join()).not.toBe(v.life.planner.planOf(r, false, day).legs.map(l => l.act).join());
  });
  it('le jour de marché, le matin, chacun passe au Foyer et en parle', () => {
    let cycle = dayHourOf(Date.now()).day;
    while (!marketDay(cycle)) cycle++;
    vi.useFakeTimers();
    try {
      vi.setSystemTime(cycleStart(cycle) + 25 * 60 * 1000);
      const v = villageOf(base);
      expect(v.marketOn(cycle)).toBe(true);
      people(v, 30, 10);
      const there = people(v, 900, 10);
      for (const p of there) expect(Math.hypot(p.x - v.home.x, p.y - v.home.y), p.id).toBeLessThan(2.2);
      expect(Object.values(MARKET_SAYS)).toContain(v.say(there.find(p => p.id === 'vil:potager'), at(10)).text);
      // (sans le Foyer à son palier, pas de marché)
      expect(villageOf({ ...base, sites: sites.map(s => (s.id === 'foyer' ? { ...s, level: 1 } : s)) }).marketOn(cycle)).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
  it('un voyageur installé n’attend pas l’arrivée du maître de son bâtiment', () => {
    const settlers = [{ id: 'v5', seed: 99, name: 'Basile', role: 'Botaniste', site: 'potager', home: { x: 8, y: 2 } }];
    const arrivals = new Map([['potager', { from: { x: 1, y: 1 }, at: 1000 }]]);
    const ids = people(villageOf({ ...base, settlers, arrivals }), 30).map(p => p.id);
    expect(ids).toContain('vil:v5');
    expect(ids).not.toContain('vil:potager');
  });
});
