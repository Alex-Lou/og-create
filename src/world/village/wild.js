// Le village (world/village.js) : les bêtes sauvages. Celles des bois et de l'eau, des climats, du Bestiaire (les
// éléments écrits au Grimoire), le chat et le chien du Foyer, les carpes koï ; où elles vivent, et comment elles
// sursautent quand on les touche.
import { hash, clamp, smooth, beast } from './beast';

// Une bête sauvage touchée : son sursaut dure 2,4 s ; elle trottine de 0,35 case (sur chaque axe) et revient
const STARTLE = 2.4;
const STARTLE_TROT = 0.35;
// Celles qui se tiennent en l'air (branche, vol) : touchées, elles ne trottinent pas
const ALOFT = new Set(['squirrel', 'bird', 'owl', 'butterfly', 'bee', 'firefly']);
// Bêtes des climats : les deux de chaque climat, leurs heures (jour, nuit, toujours), leur façon de bouger, et si
// elles aiment la pluie
const CLIMATE_BEASTS = {
  cimes: [['snowFox', 'day', 'trot'], ['ibex', 'day', 'graze']],
  landes: [['puffin', 'day', 'idle'], ['pony', 'day', 'graze']],
  marais: [['frog', 'always', 'hop', true], ['tortoise', 'day', 'slow']],
  dunes: [['fennec', 'night', 'trot'], ['camel', 'day', 'slow']],
  jungle: [['chameleon', 'day', 'idle'], ['toucan', 'day', 'idle']],
  volcan: [['salamander', 'night', 'slow', true], ['crow', 'day', 'idle']]
};
// Sols où se posent les bêtes des climats (ni eau, ni lac gelé, ni lave, ni pont, ni forêt, ni roche)
const BEAST_GROUND = 'gmsdpnlxja';
const WILD = new Set(['deer', 'fox', 'rabbit', 'hedgehog', 'squirrel', 'heron', ...Object.values(CLIMATE_BEASTS).flat().map(([s]) => s),
  'bird', 'butterfly', 'firefly', 'bee', 'owl', 'otter']);
export const isWild = species => WILD.has(species);

// Où vivent les bêtes : lisières, eau douce et ses berges, arbres (en deux moitiés : deux bêtes d'une même sorte ne se
// posent pas au même endroit), cases libres des quartiers qui ont un climat
export function habitatsOf({ n, M, owned, grid, props, avoid, climates }) {
  const edge = [];
  const water = [];
  const banks = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!owned.has(M.zone(x, y))) continue;
      const g = M.ground(x, y);
      if (g === 'w') water.push({ x, y });
      if (!grid.walk(x, y) || !'gm'.includes(g)) continue;
      const near = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].map(([dx, dy]) => M.ground(x + dx, y + dy));
      if (near.some(v => v === 'f' || v === 't')) edge.push({ x, y });
      if (near.some(v => v === 'w')) banks.push({ x, y });
    }
  }
  const trees = props.filter(p => (p.kind === 'tree' || p.kind === 'apple' || p.kind === 'birch' || p.kind === 'autumn') && owned.has(M.zone(p.x, p.y)));
  // Deux moitiés des arbres et des lisières : deux bêtes d'une même sorte ne se posent pas au même endroit
  const halves = list => [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)];
  const treeHalves = halves(trees);
  const edgeHalves = halves(edge);
  // Climats : cases libres de chaque quartier à soi qui a un climat (quartier → cases)
  const taken = new Set(props.map(p => p.y * n + p.x));
  for (const a of avoid) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) taken.add((a.y + dy) * n + a.x + dx);
  const wildZones = new Map();
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const z = M.zone(x, y);
      if (!owned.has(z) || !CLIMATE_BEASTS[climates[z]] || taken.has(y * n + x) || !grid.free(x, y) || !BEAST_GROUND.includes(M.ground(x, y))) continue;
      if (!wildZones.has(z)) wildZones.set(z, []);
      wildZones.get(z).push({ x, y });
    }
  }
  return { edge, water, banks, trees, treeHalves, edgeHalves, wildZones };
}

// Ce qui pose une bête sauvage à l'instant du dessin (f : t, h, day, tapped, out) : { wild, along }
export function wildPainter(f, calm) {
  const { t, h, day, islandDay, tapped, out } = f;
  // Sa case, tirée pour toute sa sortie : elle n'en change que hors de la vue (tirée à chaque heure de l'île, elle
  // disparaissait d'un coup pour reparaître ailleurs). turn : bête du jour, à minuit de l'île, quand elle dort ; de la
  // nuit, à midi ; toujours là, chaque jour (réel)
  const outing = { jour: islandDay, nuit: islandDay + (h >= 12 ? 1 : 0), toujours: day };
  const spot = (list, salt, turn) => list[Math.floor(hash(outing[turn] * 31, salt) * list.length)];
  // Touchée, elle sursaute (un bond sur place), trottine un peu du côté où elle regarde, se retourne et revient à sa
  // place ; perchée ou en vol (ALOFT), elle sursaute et se retourne sans quitter sa branche. Elle ne disparaît jamais
  // et reste dans sa case (moins d'une demi-case de chaque côté)
  const startled = (base, s, aloft) => {
    const jump = s < 0.15 ? Math.sin((s / 0.15) * Math.PI) * 5 : 0;
    const turned = s >= 0.6 || (aloft && s >= 0.15);
    const flip = turned ? !base.flip : base.flip;
    if (aloft) return { ...base, z: (base.z || 0) + jump, flip, frame: jump ? 1 : base.frame === 'rest' ? 0 : base.frame, look: null };
    const away = s < 0.15 ? 0 : s < 0.5 ? smooth((s - 0.15) / 0.35) : s < 0.6 ? 1 : 1 - smooth((s - 0.6) / 0.4);
    const d = away * STARTLE_TROT * (base.flip ? -1 : 1);
    const trotting = (s > 0.15 && s < 0.5) || s > 0.6;
    return { ...base, x: base.x + d, y: base.y - d, z: jump, flip, frame: trotting ? Math.floor(t * 8) % 2 : jump ? 1 : 0, look: null };
  };
  // Une bête qui va et vient le long d'une rangée de cases (x) : de trois quarts avant à l'aller (x croissant, vers le
  // bas de l'écran), de dos au retour (flip) ; ses images 0 et 1, ses pas
  const along = (flip, frame) => ({ view: flip ? 'dos' : 'avant', pose: 'marche', n: frame + 1 });
  const wild = (id, species, cells, when, turn, place) => {
    // (pendant le tutoriel, ni bêtes des bois ni bêtes des climats : elles arrivent à sa fin)
    if (!cells.length || !when || (calm && (id.startsWith('wild:') || id.startsWith('clim:')))) return;
    const base = place(spot(cells, species.length * 7, turn));
    const s = tapped(id, STARTLE);
    const b = s === null ? base : startled(base, s, ALOFT.has(species));
    out.push(beast(id, species, b.variant || '', b.x, b.y, b.z || 0, b.flip, b.frame, b.look));
  };
  return { wild, along };
}

// Les bêtes des bois, des climats et du Bestiaire, le chat et le chien du Foyer
export function drawWild(f, { wild, along }, { habitats, bestiary, doneAct, doors, home, climates }) {
  const { t, day, rain, dawn, dusk, dayTime, night } = f;
  const { edge, banks, trees, treeHalves, edgeHalves, wildZones } = habitats;
  wild('wild:deer', 'deer', edge, doneAct('T') && (dawn || dusk) && rain < 0.5, 'jour', c => ({ ...c, frame: Math.floor(t / 4) % 2, flip: hash(day, 4) < 0.5 }));
  [0, 1].forEach(k => wild(`wild:rabbit:${k}`, 'rabbit', edge, doneAct('I') && dayTime && rain < 0.5, 'jour', c => {
    const hop = (t + k * 2.3) % 5;
    const go = clamp((hop - 3.4) / 0.6);
    return { x: c.x + k * 0.6 + Math.sin(Math.floor((t + k * 2.3) / 5) * 1.7) * 0.4 * go, y: c.y + k * 0.4, z: go > 0 && go < 1 ? Math.sin(go * Math.PI) * 4 : 0, frame: go > 0 && go < 1 ? 1 : 0, flip: k === 1 };
  }));
  wild('wild:fox', 'fox', edge, doneAct('II') && (dusk || night) && rain < 0.8, 'nuit', c => {
    const k = (Math.sin(t * 0.25) + 1) / 2;
    const flip = Math.cos(t * 0.25) < 0;
    const frame = Math.floor(t * 4) % 2;
    return { x: c.x - 1 + k * 2, y: c.y, frame, flip, look: along(flip, frame) };
  });
  wild('wild:hedgehog', 'hedgehog', edge, doneAct('II') && night && rain < 0.5, 'nuit', c => {
    const flip = Math.cos(t * 0.2) < 0;
    const frame = Math.floor(t * 1.5) % 2;
    return { x: c.x + Math.sin(t * 0.2) * 0.3, y: c.y + 0.3, frame, flip, look: along(flip, frame) };
  });
  if (trees.length >= 2) {
    wild('wild:squirrel', 'squirrel', trees, doneAct('T') && dayTime && rain < 0.5, 'jour', c => {
      const leap = (t % 7) / 7;
      return { x: c.x + 0.12, y: c.y + 0.12, z: 14 + (leap > 0.85 ? Math.sin(((leap - 0.85) / 0.15) * Math.PI) * 6 : 0), frame: Math.floor(t * 2) % 2, flip: hash(day, 9) < 0.5 };
    });
  }
  wild('wild:heron', 'heron', banks, doneAct('I') && dawn && rain < 0.5, 'jour', c => ({ ...c, frame: (t % 6) < 0.6 ? 1 : 0, flip: hash(day, 6) < 0.5 }));
  // Climats : chaque bête vit à ses heures ; sinon (ou sous la pluie, si elle ne l'aime pas) elle se couche sur place
  for (const [z, cells] of wildZones) {
    CLIMATE_BEASTS[climates[z]].forEach(([species, hours, move, wet], k) => {
      const awake = (hours === 'always' || (hours === 'day' ? dayTime : night || dusk)) && (wet || rain < 0.5);
      const salt = z * 7 + k * 3;
      // Elle reste dans sa case (moins d'une demi-case de chaque côté) : ni eau ni décor voisins sous ses pattes
      wild(`clim:${z}:${species}`, species, cells, true, 'toujours', c => {
        const flip = hash(day, salt) < 0.5;
        if (!awake) return { ...c, frame: 'rest', flip };
        if (move === 'trot') {
          const a = t * 0.25 + salt;
          const frame = Math.floor(t * 4) % 2;
          return { x: c.x + Math.sin(a) * 0.4, y: c.y, frame, flip: Math.cos(a) < 0, look: along(Math.cos(a) < 0, frame) };
        }
        if (move === 'slow') {
          const a = t * 0.08 + salt;
          const frame = Math.floor(t * 1.2) % 2;
          return { x: c.x + Math.sin(a) * 0.35, y: c.y, frame, flip: Math.cos(a) < 0, look: along(Math.cos(a) < 0, frame) };
        }
        if (move === 'hop') {
          const go = clamp((((t + salt) % 4) - 3.2) / 0.6);
          const jump = go > 0 && go < 1;
          return { x: c.x + (flip ? -0.3 : 0.3) * go, y: c.y, z: jump ? Math.sin(go * Math.PI) * 4 : 0, frame: jump ? 1 : 0, flip };
        }
        // Broute ou fait son geste (ailes, teinte, tête penchée, croassement) de temps en temps
        const every = move === 'graze' ? 3 : 5;
        return { ...c, frame: (t + salt) % every < (move === 'graze' ? 1.2 : 0.8) ? 1 : 0, flip };
      });
    });
  }
  // Le Bestiaire (bible, § 6.5) : les bêtes écrites dans le Grimoire, en plus de celles des bois, de la mer et des climats
  if (bestiary.has('Oiseau')) {
    [0, 1].forEach(k => wild(`best:bird:${k}`, 'bird', treeHalves[k], dayTime && rain < 0.5, 'jour', c => {
      const peck = (t + k * 1.7) % 4 < 0.5;
      // Devant le feuillage (comme l'écureuil) : un peu plus vers le joueur que l'arbre
      return { x: c.x + 0.14, y: c.y + 0.12 + k * 0.04, z: 13 + k * 2 + ((t + k) % 3.2 < 0.25 ? 1.5 : 0), frame: peck ? 1 : 0, flip: hash(day + k, 12) < 0.5 };
    }));
  }
  if (bestiary.has('Hibou')) wild('best:owl', 'owl', trees, (night || dusk) && rain < 0.8, 'nuit', c => ({ x: c.x + 0.14, y: c.y + 0.14, z: 14, frame: t % 5 < 0.25 ? 1 : 0, flip: false }));
  if (bestiary.has('Papillon')) {
    ['jaune', 'bleu'].forEach((variant, k) => wild(`best:butterfly:${k}`, 'butterfly', edgeHalves[k], dayTime && rain < 0.4, 'jour', c => {
      const a = t * 0.6 + k * 2;
      return { x: c.x + Math.sin(a) * 0.5, y: c.y + Math.cos(a * 0.7) * 0.3, z: 6 + Math.sin(t * 2.4 + k) * 2.5, frame: Math.floor(t * 7 + k) % 2, flip: Math.cos(a) < 0, variant };
    }));
  }
  if (bestiary.has('Abeille')) {
    const hive = doors.potager ? [doors.potager] : edge;
    [0, 1].forEach(k => wild(`best:bee:${k}`, 'bee', hive, dayTime && rain < 0.4, 'jour', c => {
      const a = t * 1.8 + k * 3;
      return { x: c.x + Math.cos(a) * 0.5, y: c.y + Math.sin(a * 1.2) * 0.4, z: 7 + Math.sin(t * 4 + k) * 1.5, frame: Math.floor(t * 14 + k) % 2, flip: Math.sin(a) > 0 };
    }));
  }
  if (bestiary.has('Luciole')) {
    const glade = banks.length ? banks : edge;
    for (let k = 0; k < 5; k++) {
      wild(`best:firefly:${k}`, 'firefly', glade, (night || dusk) && rain < 0.5, 'nuit', c => {
        const a = t * 0.35 + k * 1.3;
        return { x: c.x + Math.cos(a) * (0.35 + k * 0.08), y: c.y + Math.sin(a * 1.3) * 0.32, z: 4 + k * 1.6 + Math.sin(t * 1.1 + k) * 1.5, frame: Math.floor(t * 1.6 + k * 0.7) % 2, flip: false };
      });
    }
  }
  if (bestiary.has('Grenouille')) {
    wild('best:frog', 'frog', banks, true, 'toujours', c => {
      const go = clamp((((t + 5) % 4) - 3.2) / 0.6);
      const jump = go > 0 && go < 1;
      return { x: c.x + 0.3 * go - 0.15, y: c.y, z: jump ? Math.sin(go * Math.PI) * 4 : 0, frame: night && rain < 0.3 ? 'rest' : jump ? 1 : 0, flip: hash(day, 14) < 0.5 };
    });
  }
  if (bestiary.has('Tortue')) {
    wild('best:tortoise', 'tortoise', banks, true, 'toujours', c => {
      const a = t * 0.08 + 3;
      const frame = Math.floor(t * 1.2) % 2;
      return dayTime ? { x: c.x + Math.sin(a) * 0.3, y: c.y, frame, flip: Math.cos(a) < 0, look: along(Math.cos(a) < 0, frame) } : { ...c, frame: 'rest', flip: false };
    });
  }
  // Le Chat et le Chien écrits : ils vivent autour de la porte du Foyer (leur pelage tiré pour l'île) ; le jour, ils
  // vont et viennent et s'assoient un moment ; la nuit, ils dorment roulés en boule
  if (home) {
    [['Chat', 'cat', ['', 'noir', 'gris', 'blanc'], 0.6], ['Chien', 'dog', ['', 'brun', 'noir', 'roux'], 0.9]].forEach(([name, species, coats, reach], k) => {
      if (!bestiary.has(name)) return;
      const variant = coats[Math.floor(hash(k + 3, 71) * coats.length)];
      wild(`best:${species}`, species, [home], true, 'toujours', c => {
        const at = { x: c.x + 0.4 + k * 1.1, y: c.y + 0.5 + k * 0.55, variant };
        const breath = Math.floor(t * 0.8 + k) % 2 + 1;
        if (night) return { ...at, frame: 'rest', flip: false, look: { view: 'avant', pose: 'dodo', n: breath } };
        if ((t + k * 7) % 20 < 8) return { ...at, frame: 0, flip: k === 1, look: { view: 'avant', pose: 'assis', n: breath } };
        const a = (t + k * 7) * 0.3;
        const flip = Math.cos(a) < 0;
        const frame = Math.floor(t * 4) % 2;
        return { ...at, x: at.x + Math.sin(a) * reach, frame, flip, look: along(flip, frame) };
      });
    });
  }
}

  // Carpes koï : trois qui tournent dans l'eau douce (après le tutoriel)
export function drawKoi(f, water, calm) {
  const { t, day, out } = f;
  if (water.length >= 3 && !calm) {
    const pond = water[Math.floor(hash(day, 41) * water.length)];
    ['#F08A3A', '#FFFFFF', '#F2C04B'].forEach((color, k) => {
      const a = t * (0.35 + k * 0.08) + k * 2.1;
      out.push(beast(`koi:${k}`, 'koi', color, pond.x + Math.cos(a) * 0.32, pond.y + Math.sin(a) * 0.26, -6, Math.sin(a) > 0, Math.floor(t * 3 + k) % 2));
    });
  }
}
