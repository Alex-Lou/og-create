// Le village (world/village.js) : les bêtes sauvages vivent (choix de l'auteur, 18 oct.). Chacune a ses zones, son coin
// (lisière, prés, berges, rivage, sable, arbres, cases libres), sa rareté et ses conditions, à la façon d'un carnet de
// naturaliste : ses heures, le temps qu'il fait, la pleine lune. Ses conditions réunies (et la bête venue sur l'île :
// acte fini, élément écrit au Grimoire), elle sort de son coin, se promène de case en case, s'arrête (regarde, broute,
// fait la sieste), rentre, et ressort ailleurs un peu plus tard ; sinon, rien d'elle dans la zone. Seules les zones à soi
// ont leurs bêtes (sous la brume, aucune). Ses sorties se tirent pour chaque cycle de l'horloge du jeu (gameClock.js) et
// se lisent à la minute du cycle : la même île sur tous les appareils, rien à garder ni à demander au serveur, et aucun
// saut (elle n'apparaît et ne disparaît qu'en sortant et en rentrant, ou quand ses conditions changent).
import { hash } from './beast';
import { viewOf, stepAt, lookOf } from '../beastArt';
import { minuteOf, cycleAt, CYCLE_MS } from '../gameClock';
import { moonOf } from '../lumiere/ombres';

// La rareté : combien par zone, combien d'arrêts par sortie, leurs pauses et le temps passé rentrée entre deux sorties
// (minutes réelles), la sieste (chance par sortie), un cycle du jeu sur combien où elle se montre
const RARITY = {
  commun: { count: 2, stops: [3, 4], pause: [0.4, 1], gap: [0.5, 1.5], nap: 0.5, every: 1 },
  'peu commun': { count: 1, stops: [2, 3], pause: [0.35, 0.7], gap: [2, 4], nap: 0.3, every: 1 },
  rare: { count: 1, stops: [1, 2], pause: [0.25, 0.5], gap: [6, 10], nap: 0, every: 2 }
};
// Sa façon d'aller (cases par minute réelle) : à pas, en bonds, au trot, lentement, en broutant ; perchée, elle vole
// d'arbre en arbre ; en l'air, elle flotte d'une case à l'autre
const SPEED = { pas: 40, bonds: 50, trot: 60, lent: 18, broute: 30, perche: 150, vol: 30 };
// Jusqu'où elle se promène autour du point où elle est sortie (cases, à pied ; de proche en proche pour les arbres)
const REACH = 5;
// La pleine lune (lumiere/ombres.js : part éclairée de la lune, d'après la date réelle)
const FULL_MOON = 0.85;
// Perchée : sa hauteur dans l'arbre ; en vol, de combien elle monte au plus
const PERCH_Z = 14;
const FLIGHT_Z = 10;
const CYCLE_MIN = CYCLE_MS / 60000;
// (une sortie finit avant la fin du cycle : le cycle suivant tire les siennes)
const CYCLE_END = 0.5;
// Les sols : des prés (herbe, prairie), du sable ; ceux où se pose une bête des cases libres (ni eau, ni lac gelé, ni lave,
// ni pont, ni forêt, ni roche)
const MEADOW = 'gm';
const SAND = 'sd';
const FREE_GROUND = 'gmsdpnlxja';

// Les bêtes : leurs zones (identifiants des quartiers), leur coin, leur rareté, leurs heures (aube, jour, crepuscule,
// nuit, toujours), le temps qu'elles aiment (null : tous), la pleine lune, ce qui les fait venir sur l'île (un acte fini,
// un élément écrit au Grimoire ; rien : la zone à soi suffit), leur façon d'aller ; count : combien par zone, s'il
// n'est pas celui de leur rareté
const DAY_SKY = ['clair', 'voile'];
export const WILD_LIFE = [
  { id: 'lapin', species: 'rabbit', zones: ['coeur', 'colline'], home: 'pres', rarity: 'commun', hours: ['jour'], weather: DAY_SKY, act: 'I', move: 'bonds' },
  { id: 'ecureuil', species: 'squirrel', zones: ['coeur', 'lisiere'], home: 'arbres', rarity: 'commun', hours: ['jour'], weather: [...DAY_SKY, 'brume'], act: 'T', move: 'perche' },
  { id: 'mesange', species: 'bird', zones: ['coeur', 'jardins'], home: 'arbres', rarity: 'commun', hours: ['jour'], weather: DAY_SKY, element: 'Oiseau', move: 'perche' },
  { id: 'papillons', species: 'butterfly', variants: ['jaune', 'bleu'], zones: ['jardins', 'colline'], home: 'pres', rarity: 'commun', hours: ['jour'], weather: ['clair'], element: 'Papillon', move: 'vol' },
  { id: 'papillon-lune', species: 'butterfly', variants: ['lune'], zones: ['jardins'], home: 'pres', rarity: 'rare', hours: ['nuit'], weather: ['clair'], moon: true, element: 'Papillon', move: 'vol' },
  { id: 'renard', species: 'fox', zones: ['lisiere'], home: 'lisiere', rarity: 'peu commun', hours: ['crepuscule', 'nuit'], weather: [...DAY_SKY, 'brume'], act: 'II', move: 'trot' },
  { id: 'herisson', species: 'hedgehog', zones: ['jardins'], home: 'pres', rarity: 'peu commun', hours: ['nuit'], weather: [...DAY_SKY, 'pluie'], act: 'II', move: 'lent' },
  { id: 'heron', species: 'heron', zones: ['crique'], home: 'rivage', rarity: 'peu commun', hours: ['aube'], weather: ['clair', 'brume'], act: 'I', move: 'lent' },
  { id: 'crabe', species: 'crab', zones: ['coeur', 'crique'], home: 'sable', rarity: 'commun', hours: ['nuit'], weather: null, act: 'T', move: 'pas' },
  { id: 'lucioles', species: 'firefly', zones: ['bayou', 'lisiere'], home: 'libre', rarity: 'commun', count: 5, hours: ['crepuscule', 'nuit'], weather: DAY_SKY, element: 'Luciole', move: 'vol' },
  { id: 'cerf', species: 'deer', zones: ['foret'], home: 'lisiere', rarity: 'rare', hours: ['aube', 'crepuscule'], weather: ['clair', 'brume'], act: 'T', move: 'pas' },
  { id: 'hibou', species: 'owl', zones: ['foret'], home: 'arbres', rarity: 'rare', hours: ['nuit'], weather: DAY_SKY, element: 'Hibou', move: 'perche' },
  { id: 'grenouille', species: 'frog', zones: ['coeur', 'jardins', 'lisiere', 'foret'], home: 'berges', rarity: 'commun', hours: ['toujours'], weather: null, element: 'Grenouille', move: 'bonds' },
  { id: 'tortue', species: 'tortoise', zones: ['coeur', 'jardins'], home: 'berges', rarity: 'peu commun', hours: ['jour'], weather: DAY_SKY, element: 'Tortue', move: 'lent' },
  // Les bêtes des climats : leur zone à soi suffit
  { id: 'macareux', species: 'puffin', zones: ['falaises'], home: 'libre', rarity: 'commun', hours: ['jour'], weather: [...DAY_SKY, 'brume'], move: 'pas' },
  { id: 'poney', species: 'pony', zones: ['menhirs'], home: 'libre', rarity: 'peu commun', hours: ['jour'], weather: [...DAY_SKY, 'brume'], move: 'broute' },
  { id: 'grenouille-marais', species: 'frog', zones: ['roselieres', 'bayou'], home: 'libre', rarity: 'commun', hours: ['toujours'], weather: null, move: 'bonds' },
  { id: 'tortue-marais', species: 'tortoise', zones: ['roselieres'], home: 'libre', rarity: 'peu commun', hours: ['jour'], weather: DAY_SKY, move: 'lent' },
  { id: 'bouquetin', species: 'ibex', zones: ['contreforts', 'neiges'], home: 'libre', rarity: 'peu commun', hours: ['jour'], weather: DAY_SKY, move: 'broute' },
  { id: 'renard-polaire', species: 'snowFox', zones: ['neiges'], home: 'libre', rarity: 'rare', hours: ['jour'], weather: ['brume', 'voile'], move: 'trot' },
  { id: 'chameau', species: 'camel', zones: ['oasis'], home: 'libre', rarity: 'peu commun', hours: ['jour'], weather: ['clair'], move: 'lent' },
  { id: 'fennec', species: 'fennec', zones: ['dunes'], home: 'libre', rarity: 'rare', hours: ['nuit'], weather: ['clair'], move: 'trot' },
  { id: 'toucan', species: 'toucan', zones: ['canopee', 'cascade'], home: 'libre', rarity: 'commun', hours: ['jour'], weather: [...DAY_SKY, 'pluie'], move: 'pas' },
  { id: 'cameleon', species: 'chameleon', zones: ['canopee'], home: 'libre', rarity: 'rare', hours: ['jour'], weather: ['pluie'], move: 'lent' },
  { id: 'corbeau', species: 'crow', zones: ['coulees', 'cratere'], home: 'libre', rarity: 'commun', hours: ['jour'], weather: null, move: 'pas' },
  { id: 'salamandre', species: 'salamander', zones: ['cratere'], home: 'libre', rarity: 'rare', hours: ['toujours'], weather: ['orage'], move: 'lent' }
];
// Les sortes qui vivent ainsi (touchées, elles sursautent : village.js, isWild)
export const WILD_LIFE_SPECIES = [...new Set(WILD_LIFE.map(b => b.species))];

// Les coins de chaque zone à soi (indice du quartier → { lisiere, pres, berges, rivage, sable, libre, arbres }) :
// lisière, l'herbe au bord du bois ; prés, l'herbe ; berges, l'herbe au bord de l'eau douce ; rivage, au bord de l'eau
// douce ou de la mer ; sable ; libre, une case libre d'un sol où l'on se pose ; arbres, les arbres du décor. avoid : les
// cases à laisser libres autour (gisements, lieux remarquables)
export function homesOf({ n, M, owned, grid, props, avoid = [] }) {
  const homes = new Map();
  const of = z => {
    if (!homes.has(z)) homes.set(z, { lisiere: [], pres: [], berges: [], rivage: [], sable: [], libre: [], arbres: [] });
    return homes.get(z);
  };
  const taken = new Set(props.map(p => p.y * n + p.x));
  for (const a of avoid) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) taken.add((a.y + dy) * n + a.x + dx);
  const AROUND = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const z = M.zone(x, y);
      if (!owned.has(z)) continue;
      const g = M.ground(x, y);
      const cell = { x, y };
      if (grid.free(x, y) && !taken.has(y * n + x) && FREE_GROUND.includes(g)) of(z).libre.push(cell);
      if (!grid.walk(x, y)) continue;
      const near = AROUND.map(([dx, dy]) => M.ground(x + dx, y + dy));
      if (SAND.includes(g)) of(z).sable.push(cell);
      if (near.some(v => v === 'w' || v === '~')) of(z).rivage.push(cell);
      if (!MEADOW.includes(g)) continue;
      of(z).pres.push(cell);
      if (near.some(v => v === 'f' || v === 't')) of(z).lisiere.push(cell);
      if (near.some(v => v === 'w')) of(z).berges.push(cell);
    }
  }
  for (const p of props) {
    if (['tree', 'apple', 'birch', 'autumn'].includes(p.kind) && owned.has(M.zone(p.x, p.y))) of(M.zone(p.x, p.y)).arbres.push({ x: p.x, y: p.y });
  }
  return homes;
}

// Les cases que rejoint une bête à pied depuis start, à reach pas au plus : Map clé (y × n + x) → clé de la case d'où
// l'on y vient (start : -1). ok(x, y) : elle peut s'y tenir ; step : la marche de relief se franchit (paths.js : gridOf)
function reachOf(start, reach, ok, step, n) {
  const from = new Map([[start.y * n + start.x, -1]]);
  let ring = [start];
  for (let d = 0; d < reach && ring.length; d++) {
    const next = [];
    for (const c of ring) {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = c.x + dx;
        const y = c.y + dy;
        const key = y * n + x;
        if (from.has(key) || !ok(x, y) || !step(c, { x, y })) continue;
        from.set(key, c.y * n + c.x);
        next.push({ x, y });
      }
    }
    ring = next;
  }
  return from;
}
// Le chemin d'une case à une autre par l'arbre de reachOf (en remontant vers le départ jusqu'à leur croisement)
function walkOf(from, a, b, n) {
  const up = key => {
    const out = [];
    for (let k = key; k !== -1; k = from.get(k)) out.push(k);
    return out;
  };
  const ua = up(a.y * n + a.x);
  const ub = up(b.y * n + b.x);
  const inA = new Map(ua.map((k, i) => [k, i]));
  const j = ub.findIndex(k => inA.has(k));
  const keys = [...ua.slice(0, inA.get(ub[j]) + 1), ...ub.slice(0, j).reverse()];
  return keys.map(k => ({ x: k % n, y: Math.floor(k / n) }));
}

// Les bêtes sauvages de l'île : { at(f, painter, ctx) } ; homes : homesOf ; zoneIds : l'identifiant de chaque quartier
// (par indice) ; grid : la grille où l'on marche (paths.js) ; n : la taille de l'île
export function wildLifeOf({ homes, zoneIds, grid, n }) {
  // Chaque bête de chaque zone : son tirage (seed), ses cases, ce qui la tient (ok : à pied ; arbres et airs, aucune)
  const zoneOf = new Map(zoneIds.map((id, i) => [id, i]));
  const free = new Map();
  const freeOf = z => {
    if (!free.has(z)) free.set(z, new Set(homes.get(z).libre.map(c => c.y * n + c.x)));
    return free.get(z);
  };
  const beasts = [];
  for (const b of WILD_LIFE) {
    const r = RARITY[b.rarity];
    for (const zid of b.zones) {
      const z = zoneOf.get(zid);
      const cells = z === undefined || !homes.has(z) ? [] : homes.get(z)[b.home];
      if (!cells.length) continue;
      const count = b.count || r.count;
      for (let k = 0; k < count; k++) {
        const seed = hash(b.id.length * 13 + z * 7 + k, b.id.charCodeAt(0) + b.id.charCodeAt(b.id.length - 1));
        const variant = b.variants ? b.variants[k % b.variants.length] : '';
        // (les bêtes des cases libres n'en sortent pas : ni décor, ni clairière d'un gisement ou d'un lieu remarquable)
        const ok = b.home === 'libre' ? (x, y) => freeOf(z).has(y * n + x) : (x, y) => grid.walk(x, y) && grid.M.zone(x, y) === z;
        beasts.push({ ...b, key: `wild:${b.id}:${zid}:${k}`, z, k, seed, variant, cells, ok, rarity: r });
      }
    }
  }
  // Ses sorties d'un cycle du jeu, tirées une fois (gardées pour le cycle en cours)
  const outings = new Map();
  let shownCycle = null;
  const outingsOf = (w, cycle) => {
    if (cycle !== shownCycle) {
      outings.clear();
      shownCycle = cycle;
    }
    if (!outings.has(w.key)) outings.set(w.key, plan(w, cycle));
    return outings.get(w.key);
  };
  function plan(w, cycle) {
    const r = w.rarity;
    const roll = (i, a = 0, b = 1) => a + (b - a) * hash(w.seed * 997 + i * 7.13, cycle * 0.37 + w.k);
    // (une bête rare ne se montre pas à chaque cycle)
    if (roll(0) * r.every >= 1) return [];
    const speed = SPEED[w.move];
    const out = [];
    let m = roll(1, 0, r.gap[1]);
    for (let i = 0; i < 60; i++) {
      const s = 100 + i * 20;
      const legs = w.move === 'perche' || w.move === 'vol' ? flightOf(w, s, roll, speed) : walkingOf(w, s, roll, speed, r);
      const total = legs.reduce((sum, leg) => sum + leg.walk + leg.pause, 0);
      if (m + total > CYCLE_MIN - CYCLE_END) break;
      out.push({ start: m, total, legs });
      m += total + roll(s + 19, r.gap[0], r.gap[1]);
    }
    return out;
  }
  // Une sortie à pied : elle sort à une case de son coin, va d'arrêt en arrêt par les cases qu'elle rejoint, et revient
  // rentrer où elle était sortie
  function walkingOf(w, s, roll, speed, r) {
    const den = w.cells[Math.floor(roll(s) * w.cells.length)];
    const from = reachOf(den, REACH, w.ok, grid.step, n);
    const reached = [...from.keys()].filter(key => key !== den.y * n + den.x).map(key => ({ x: key % n, y: Math.floor(key / n) }));
    const count = Math.round(roll(s + 1, r.stops[0], r.stops[1]));
    const stops = reached.length ? Array.from({ length: count }, (_, i) => reached[Math.floor(roll(s + 2 + i) * reached.length)]) : [];
    const napAt = roll(s + 9) < r.nap ? Math.floor(roll(s + 10) * stops.length) : -1;
    const legs = [{ path: [den], walk: 0, pause: roll(s + 11, 0.1, 0.25), act: 'regarde' }];
    let at = den;
    stops.forEach((stop, i) => {
      const path = walkOf(from, at, stop, n);
      const nap = i === napAt;
      legs.push({ path, walk: (path.length - 1) / speed, pause: nap ? roll(s + 12 + i, 1, 1.6) : roll(s + 12 + i, r.pause[0], r.pause[1]), act: nap ? 'sieste' : roll(s + 30 + i) < 0.5 ? 'broute' : 'regarde' });
      at = stop;
    });
    const home = walkOf(from, at, den, n);
    legs.push({ path: home, walk: (home.length - 1) / speed, pause: 0, act: 'regarde' });
    return legs;
  }
  // Une sortie en l'air : d'un arbre (ou d'une case) à l'autre de son coin, tout droit, en s'arrêtant à chacun
  function flightOf(w, s, roll, speed) {
    const den = w.cells[Math.floor(roll(s) * w.cells.length)];
    const near = w.cells.filter(c => Math.abs(c.x - den.x) + Math.abs(c.y - den.y) <= REACH + 1);
    const count = Math.round(roll(s + 1, 2, 4));
    const legs = [{ path: [den], walk: 0, pause: roll(s + 2, 0.4, 1), act: 'regarde', straight: true }];
    let at = den;
    for (let i = 0; i < count; i++) {
      const to = near[Math.floor(roll(s + 3 + i) * near.length)];
      legs.push({ path: [at, to], walk: Math.hypot(to.x - at.x, to.y - at.y) / speed, pause: roll(s + 10 + i, 0.4, 1.2), act: 'regarde', straight: true });
      at = to;
    }
    return legs;
  }
  // Où elle est m minutes après le début de sa sortie : { x, y, dx, dy, moving, act, d (cases parcourues), k (part du vol) }
  function placeOn(legs, speed, m) {
    let start = 0;
    let last = { dx: 1, dy: 0 };
    for (const leg of legs) {
      const end = leg.path[leg.path.length - 1];
      if (leg.path.length > 1 && m < start + leg.walk) {
        const into = m - start;
        if (leg.straight) {
          const [a, b] = leg.path;
          const k = leg.walk ? into / leg.walk : 1;
          return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, dx: b.x - a.x, dy: b.y - a.y, moving: true, act: 'marche', d: into * speed, k };
        }
        const d = into * speed;
        const i = Math.min(leg.path.length - 2, Math.floor(d));
        const [a, b] = [leg.path[i], leg.path[i + 1]];
        const k = d - i;
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, dx: b.x - a.x, dy: b.y - a.y, moving: true, act: 'marche', d, k };
      }
      if (leg.path.length > 1) {
        const [a, b] = [leg.path[leg.path.length - 2], end];
        last = { dx: b.x - a.x, dy: b.y - a.y };
      }
      start += leg.walk;
      if (m < start + leg.pause) return { x: end.x, y: end.y, ...last, moving: false, act: leg.act, d: 0, k: 1 };
      start += leg.pause;
    }
    return null;
  }

  // Les bêtes à l'instant du dessin (f : t, h, phase, rain, dawn, dusk, dayTime, night) : celles dont les conditions sont
  // réunies et qui sont sorties ; put : le pinceau des bêtes sauvages (wild.js : wildPainter, leur sursaut) ; doneAct,
  // bestiary : ce qui les fait venir
  function at(f, put, { doneAct, bestiary }) {
    const { t, h, phase, dawn, dusk, dayTime, night } = f;
    const slots = { aube: dawn, jour: dayTime, crepuscule: dusk, nuit: night, toujours: true };
    const sky = phase.weather.kind;
    const fullMoon = moonOf(new Date()).light >= FULL_MOON;
    const cycle = cycleAt(Date.now());
    const m = minuteOf(h);
    for (const w of beasts) {
      if (!w.hours.some(slot => slots[slot]) || (w.weather && !w.weather.includes(sky)) || (w.moon && !fullMoon)) continue;
      if ((w.act && !doneAct(w.act)) || (w.element && !bestiary.has(w.element))) continue;
      const outing = outingsOf(w, cycle).find(o => m >= o.start && m < o.start + o.total);
      const p = outing && placeOn(outing.legs, SPEED[w.move], m - outing.start);
      if (!p) continue;
      put(w.key, w.species, poseOf(w, p, t));
    }
  }
  return { at, count: beasts.length };
}

// Sa pose à cette image : sa place dans la case (un petit décalage à elle), sa hauteur, son image, sa vue
function poseOf(w, p, t) {
  const ox = (w.seed - 0.5) * 0.4;
  const oy = (hash(w.seed, 3) - 0.5) * 0.4;
  const flip = p.dx - p.dy < 0;
  const base = { x: p.x + ox, y: p.y + oy, variant: w.variant };
  if (w.move === 'perche') {
    // Perchée (devant le feuillage, comme avant) : elle picore ou cligne des yeux ; en vol, elle monte en arc d'un arbre
    // à l'autre
    const z = PERCH_Z + (p.moving ? Math.sin(p.k * Math.PI) * FLIGHT_Z : 0);
    const frame = w.species === 'owl' ? (t % 5 < 0.25 ? 1 : 0) : p.moving ? Math.floor(t * 6) % 2 : (t + w.seed * 9) % 4 < 0.5 ? 1 : 0;
    return { ...base, x: p.x + 0.14, y: p.y + 0.12, z, frame, flip };
  }
  if (w.move === 'vol') {
    // En l'air : elle flotte d'une case à l'autre, en tournant un peu sur elle-même
    const a = t * (w.species === 'firefly' ? 0.35 : 0.6) + w.seed * 6;
    const frame = w.species === 'firefly' ? Math.floor(t * 1.6 + w.seed * 5) % 2 : Math.floor(t * 7 + w.k) % 2;
    const z = (w.species === 'firefly' ? 4 + w.k * 1.6 : 6) + Math.sin(t * 2.4 + w.k) * 2;
    return { ...base, x: p.x + Math.cos(a) * 0.35, y: p.y + Math.sin(a * 1.3) * 0.3, z, frame, flip: Math.cos(a) < 0 };
  }
  if (p.moving) {
    // En marche, elle regarde où elle va ; en bonds, elle saute à chaque case
    const z = w.move === 'bonds' ? Math.abs(Math.sin(p.d * Math.PI)) * 4 : 0;
    return { ...base, z, frame: 0, flip, look: { view: viewOf(p.dx, p.dy), pose: 'marche', n: stepAt(t, w.k + w.seed * 3) } };
  }
  if (p.act === 'sieste') return { ...base, z: 0, frame: 'rest', flip };
  if (p.act === 'broute') {
    const frame = (t + w.seed * 7) % 3 < 1.2 ? 1 : 0;
    return { ...base, z: 0, frame, flip, look: lookOf(frame, w.species) };
  }
  return { ...base, z: 0, frame: 0, flip, look: { view: viewOf(p.dx, p.dy), pose: 'marche', n: 1 } };
}
