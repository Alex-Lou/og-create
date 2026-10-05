// Vie ambiante de l'île : habitants et bêtes. Qui vit où, par où ils passent et ce qu'ils font à chaque instant,
// selon l'heure et le temps qu'il fait (sky.js). Rien n'est gardé par le serveur : tout se déduit de l'île (bâtiments
// bâtis, quartiers à soi, décor) et du temps.
// - Habitants : un par bâtiment bâti (son métier), plus la cuisinière du Foyer, dessinés sous trois angles
//   (villagers.js) : ils regardent où ils vont. Le jour ils travaillent et font leurs tournées par les chemins ; le soir ils rentrent au Foyer avec une lanterne ; la nuit ils dorment. Sous la pluie,
//   un sur deux reste à l'abri, les autres sortent avec un parapluie.
// - Ferme (avec les paliers du Potager) : poules de race et poussins, vache, moutons, cochon, chèvre, qui broutent
//   autour du Potager, se couchent la nuit et ne bougent plus sous la pluie.
// - Bois : lapins le jour, cerf à l'aube et au crépuscule, renard et hérisson la nuit, écureuil dans les arbres.
//   Touchés, ils s'enfuient. Eau : carpes koï dans l'eau douce, héron le matin.
import { villagerSprite, ROLES, SKINS, HAIRS } from './villagers';
import { ANIMAL_SPRITES } from './animals';

const SPEED = 0.8; // cases par seconde, à pied
const WALK = 'gsmdpkb';
const STAIRS = 'pkb';
const BLOCKING = new Set(['tree', 'pine', 'palm', 'bush', 'rock', 'rocks', 'crag', 'apple', 'birch', 'autumn', 'stump', 'log', 'mossy', 'lantern', 'bench', 'nest']);
const WORK_ORDER = ['potager', 'carriere', 'bosquet', 'puits', 'ponton', 'atelier'];
// Où regarde un habitant au repos (tiré toutes les 9 s) : souvent de côté, parfois vers le joueur ou au loin
const IDLE_VIEWS = ['se', 'se', 'front', 'ne'];
const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));

// Paroles des habitants (toucher), par métier et selon le moment
const WORK_LINES = {
  potager: ['Les tomates rougissent à vue d’œil.', 'Un peu d’eau et ça repart !'],
  carriere: ['Ce filon promet !', 'La pierre est dure aujourd’hui.'],
  bosquet: ['Attention, ça va tomber !', 'Ce chêne a plus de cent ans.'],
  puits: ['L’eau du puits est bien fraîche.', 'Deux seaux et j’y retourne.'],
  ponton: ['Ça mord, aujourd’hui !', 'J’ai vu passer les dauphins.'],
  atelier: ['Le fer se travaille chaud.', 'Encore un clou et c’est fini.'],
  foyer: ['La soupe est presque prête.', 'Ça sent bon le pain chaud.']
};
const SOUNDS = { hen: 'Cot cot !', chick: 'Piou piou !', cow: 'Meuh !', sheep: 'Bêêê !', pig: 'Groin groin !', goat: 'Mêêê !' };
export const BEAST_NAMES = {
  hen: ['Poule', 'Elle picore autour du Potager.'], chick: ['Poussin', 'Il suit sa mère partout.'],
  cow: ['Vache', 'Elle broute près du Potager et dort couchée la nuit.'], sheep: ['Mouton', 'Il broute en troupeau près du Potager.'],
  pig: ['Cochon', 'Il fouille la terre du bout du groin.'], goat: ['Chèvre', 'Elle grimpe partout où elle peut.'],
  deer: ['Cerf', 'Il sort du bois à l’aube et au crépuscule.'], fox: ['Renard', 'Il rôde au crépuscule et la nuit.'],
  rabbit: ['Lapin', 'Il gambade près du bois le jour.'], hedgehog: ['Hérisson', 'Il renifle les buissons la nuit.'],
  squirrel: ['Écureuil', 'Il saute d’arbre en arbre.'], koi: ['Carpe koï', 'Elle nage dans l’eau douce.'], heron: ['Héron', 'Il pêche au bord de l’eau le matin.']
};
const WILD = new Set(['deer', 'fox', 'rabbit', 'hedgehog', 'squirrel', 'heron']);

/* ---------- Chemins ---------- */
// Grille où l'on marche : sol praticable des quartiers à soi, ni bâtiment, ni décoration, ni annexe, ni arbre ou
// rocher ; d'une case à l'autre à la même hauteur, ou par les marches des chemins
function gridOf({ n, M, sites, owned, tiles, props, annexes }) {
  const blocked = new Uint8Array(n * n);
  for (const s of sites) for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) if (x >= 0 && y >= 0 && x < n && y < n) blocked[y * n + x] = 1;
  for (const t of [...tiles, ...annexes]) blocked[t.y * n + t.x] = 1;
  for (const p of props) if (BLOCKING.has(p.kind)) blocked[p.y * n + p.x] = 1;
  const walk = (x, y) => x >= 0 && y >= 0 && x < n && y < n && !blocked[y * n + x] && owned.has(M.zone(x, y)) && WALK.includes(M.ground(x, y));
  const step = (a, b) => {
    const [ga, gb] = [M.ground(a.x, a.y), M.ground(b.x, b.y)];
    const dh = Math.abs(M.height(a.x, a.y) - M.height(b.x, b.y));
    return dh === 0 || (STAIRS.includes(ga) && STAIRS.includes(gb) && dh <= 1) || ga === 'b' || gb === 'b';
  };
  return { n, M, walk, step };
}
// Plus court chemin (les chemins coûtent moitié moins que l'herbe) : liste de cases, ou null
function route(grid, from, to) {
  const { n, M, walk, step } = grid;
  if (!from || !to) return null;
  const dist = new Float32Array(n * n).fill(Infinity);
  const prev = new Int32Array(n * n).fill(-1);
  const start = from.y * n + from.x;
  const goal = to.y * n + to.x;
  dist[start] = 0;
  // File à seaux : les coûts sont 1 (chemin) ou 2 (herbe)
  const buckets = [[start]];
  for (let d = 0; d < buckets.length; d++) {
    const bucket = buckets[d];
    if (!bucket) continue;
    for (const i of bucket) {
      if (dist[i] !== d) continue;
      if (i === goal) break;
      const x = i % n;
      const y = (i - x) / n;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (!walk(nx, ny) || !step({ x, y }, { x: nx, y: ny })) continue;
        const j = ny * n + nx;
        const nd = d + (STAIRS.includes(M.ground(nx, ny)) ? 1 : 2);
        if (nd < dist[j]) {
          dist[j] = nd;
          prev[j] = i;
          (buckets[nd] = buckets[nd] || []).push(j);
        }
      }
    }
    if (dist[goal] <= d) break;
  }
  if (!Number.isFinite(dist[goal])) return null;
  const path = [];
  for (let i = goal; i !== -1; i = prev[i]) path.push({ x: i % n, y: Math.floor(i / n) });
  return path.reverse();
}
// Case où l'on travaille à une annexe : une case praticable qui la touche, la plus proche de la porte du bâtiment
function besideOf(grid, annex, door) {
  const ok = [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([dx, dy]) => ({ x: annex.x + dx, y: annex.y + dy })).filter(c => grid.walk(c.x, c.y));
  if (!ok.length) return null;
  const d = c => (door ? Math.abs(c.x - door.x) + Math.abs(c.y - door.y) : 0);
  return ok.reduce((a, b) => (d(b) < d(a) ? b : a));
}
// Porte d'un bâtiment : la case praticable autour de son emprise la plus en avant (vers le joueur), un chemin si possible
function doorOf(grid, site) {
  const ring = [];
  for (let x = site.x - 1; x <= site.x + site.w; x++) for (const y of [site.y - 1, site.y + site.h]) ring.push({ x, y });
  for (let y = site.y; y < site.y + site.h; y++) for (const x of [site.x - 1, site.x + site.w]) ring.push({ x, y });
  const ok = ring.filter(c => grid.walk(c.x, c.y));
  if (!ok.length) return null;
  const score = c => c.x + c.y + (STAIRS.includes(grid.M.ground(c.x, c.y)) ? 0.6 : 0);
  return ok.reduce((a, b) => (score(b) > score(a) ? b : a));
}

/* ---------- Le village ---------- */
// sites : bâtiments de l'île ({ id, x, y, w, h, level, locked, name }) ; owned : indices des quartiers à soi ;
// tiles : décorations posées ; props : décor naturel ({ kind, x, y }) ; annexes : annexes posées ({ x, y, site })
export function villageOf({ n, M, sites, owned, tiles, props, annexes = [] }) {
  const grid = gridOf({ n, M, sites, owned, tiles, props, annexes });
  const built = sites.filter(s => s.level > 0 && !s.locked);
  const doors = Object.fromEntries(built.map(s => [s.id, doorOf(grid, s)]).filter(([, d]) => d));
  const foyer = built.find(s => s.id === 'foyer');
  const home = doors.foyer || Object.values(doors)[0] || null;
  const routes = new Map();
  const routeOf = (a, b) => {
    const key = `${a.x},${a.y}>${b.x},${b.y}`;
    if (!routes.has(key)) routes.set(key, route(grid, a, b));
    return routes.get(key);
  };
  const stops = Object.values(doors);

  // Habitants : un par bâtiment bâti qui a une porte, plus la cuisinière du Foyer (8 au plus)
  const residents = [];
  if (home) {
    for (const id of [...WORK_ORDER, 'foyer']) {
      const site = built.find(s => s.id === id);
      if (!site || !doors[id]) continue;
      const k = residents.length;
      residents.push({
        id: `vil:${id}`, k, role: id, site: site.name,
        look: { ...ROLES[id], skin: SKINS[Math.floor(hash(k, 3) * SKINS.length)], hair: HAIRS[Math.floor(hash(k, 5) * HAIRS.length)] },
        work: doors[id], wake: 6.4 + (k % 3) * 0.25, bed: 21.6 + (k % 3) * 0.3,
        // Une annexe à soi (la première posée) : on y travaille une partie de la journée
        field: (() => { const annex = annexes.find(a => a.site === id); return annex ? besideOf(grid, annex, doors[id]) : null; })()
      });
    }
  }
  // Tournée d'un habitant : une suite d'arrêts (travail, ailleurs, travail, Foyer…), chacun avec la marche pour y aller
  // et une pause ; elle tourne en boucle. evening : allers-retours entre le Foyer et le bâtiment le plus proche
  const plans = new Map();
  const planOf = (r, evening) => {
    const key = `${r.id}:${evening ? 'soir' : 'jour'}`;
    if (plans.has(key)) return plans.get(key);
    const near = stops.filter(s => s !== home).sort((a, b) => Math.hypot(a.x - home.x, a.y - home.y) - Math.hypot(b.x - home.x, b.y - home.y))[0] || r.work;
    const other = i => stops[Math.floor(hash(r.k * 7 + i, 13) * stops.length)] || r.work;
    const seq = evening
      ? [[home, 40, 'idle'], [near, 14, 'idle'], [home, 60, 'idle']]
      : [[r.work, 90, 'work'], [other(1), 25, 'idle'], [r.field || r.work, 110, 'work'], [home, 30, 'idle'], [r.work, 80, 'work'], [other(2), 20, 'idle']];
    const legs = [];
    let at = seq[seq.length - 1][0];
    let total = 0;
    for (const [to, pause, act] of seq) {
      const path = routeOf(at, to) || [to];
      const walk = (path.length - 1) / SPEED;
      legs.push({ path, walk, pause: pause * (0.8 + hash(r.k, legs.length) * 0.4), act, start: total });
      total += walk + legs[legs.length - 1].pause;
      at = to;
    }
    const plan = { legs, total, offset: hash(r.k, 21) * total };
    plans.set(key, plan);
    return plan;
  };
  // Place sur une tournée à l'instant t : case (fractionnaire), sens de marche, pose
  function onPlan(plan, t) {
    const tt = (t + plan.offset) % plan.total;
    const leg = plan.legs.reduce((found, l) => (tt >= l.start ? l : found), plan.legs[0]);
    const into = tt - leg.start;
    const last = leg.path[leg.path.length - 1];
    if (into >= leg.walk || leg.path.length < 2) return { x: last.x, y: last.y, pose: leg.act, back: false, flip: false };
    const d = into * SPEED;
    const i = Math.min(leg.path.length - 2, Math.floor(d));
    const k = d - i;
    const [a, b] = [leg.path[i], leg.path[i + 1]];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return { x: a.x + dx * k, y: a.y + dy * k, pose: 'walk', back: dx + dy < 0, flip: dx - dy < 0 };
  }

  // Ferme : bêtes autour du Potager, selon son palier
  const potager = built.find(s => s.id === 'potager');
  const pen = [];
  if (potager) {
    for (let y = potager.y - 3; y < potager.y + potager.h + 3; y++) {
      for (let x = potager.x - 3; x < potager.x + potager.w + 3; x++) if (grid.walk(x, y) && 'gm'.includes(M.ground(x, y))) pen.push({ x, y });
    }
  }
  const farm = [];
  if (potager && pen.length >= 3) {
    // seg : durée d'un tour (secondes) : marche vers une case du pré, puis broute ou picore
    const add = (species, variant, seg) => farm.push({ id: `farm:${species}:${farm.length}`, species, variant, k: farm.length, seg });
    add('hen', 'rousse', 8);
    add('hen', 'noire', 9);
    if (potager.level >= 3) add('cow', '', 16);
    if (potager.level >= 4) {
      add('sheep', '', 13);
      add('sheep', '', 14);
    }
    if (potager.level >= 5) add('pig', '', 12);
    if (potager.level >= 6) add('goat', '', 11);
  }
  // Bois : lisières (herbe ou prairie au bord d'une forêt ou d'un arbre), arbres du décor, eau douce
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

  // Tout ce qui vit à l'instant t (secondes) sous ce ciel : [{ id, kind, species, x, y, z, flip, sprite: [clé, dessin] }]
  // et les lanternes [{ x, y }] ; scared : touchers récents (Map id → { at })
  function at(t, phase, scared = new Map()) {
    const out = [];
    const lights = [];
    const h = phase.hour;
    const rain = phase.weather.rain;
    const tapped = (id, span) => {
      const s = scared.get(id);
      return s && t - s.at < span ? (t - s.at) / span : null;
    };
    // Habitants
    for (const r of residents) {
      if (h < r.wake || h >= r.bed) continue;
      if (rain > 0.5 && r.k % 2 === 1) continue;
      const evening = h >= phase.set + 0.4;
      const p = onPlan(planOf(r, evening), t);
      const lantern = evening && phase.lit > 0.35;
      const umbrella = rain > 0.5;
      // En marche, il regarde où il va (4 images) ; au travail, de trois quarts ; au repos, de face, de côté ou au loin,
      // selon le moment ; touché, il se tourne vers le joueur et fait coucou
      const walking = p.pose === 'walk';
      const frame = walking ? Math.floor(t * 6) % 4 : p.pose === 'work' ? Math.floor(t * 1.6 + r.k) % 2 : (t + r.k * 1.3) % 5 < 0.18 ? 1 : 0;
      const hop = tapped(r.id, 0.6);
      const glance = IDLE_VIEWS[Math.floor(hash(r.k, Math.floor(t / 9)) * IDLE_VIEWS.length)];
      const view = hop !== null ? 'front' : walking ? (p.back ? 'ne' : 'se') : p.pose === 'work' ? 'se' : glance;
      const opts = { pose: hop !== null ? 'wave' : p.pose, view, frame: hop !== null ? Math.floor(t * 5) % 2 : frame, lantern, umbrella };
      const flip = hop !== null ? false : walking ? p.flip : hash(r.k, Math.floor(t / 20)) < 0.5;
      out.push({
        id: r.id, kind: 'villager', role: r.role, x: p.x, y: p.y, z: hop === null ? 0 : Math.sin(hop * Math.PI) * 6, flip,
        sprite: [`vil-${r.k}-${opts.pose}-${view}-${opts.frame}-${lantern ? 1 : 0}-${umbrella ? 1 : 0}`, () => villagerSprite(r.look, opts)]
      });
      if (lantern) lights.push({ x: p.x, y: p.y, dx: flip ? 5.8 : -5.8, dy: -3 });
    }
    // Ferme
    for (const a of farm) {
      const rest = pen[Math.floor(hash(a.k, 31) * pen.length)];
      const target = i => pen[Math.floor(hash(a.k * 13 + i, 37) * pen.length)];
      let x = rest.x;
      let y = rest.y;
      let frame = 0;
      let flip = hash(a.k, 2) < 0.5;
      if (phase.night > 0.6) frame = a.species === 'hen' ? 0 : 'rest';
      else if (rain <= 0.5) {
        const seg = (t + a.k * 3.7) / a.seg;
        const i = Math.floor(seg);
        const k = seg - i;
        const [from, to] = [target(i - 1), target(i)];
        const move = clamp(k / 0.4);
        x = from.x + (to.x - from.x) * move;
        y = from.y + (to.y - from.y) * move;
        flip = (to.x - from.x) - (to.y - from.y) < 0;
        // En marche : image 0 ; arrêtée : elle broute ou picore de temps en temps (image 1)
        frame = move < 1 ? 0 : Math.floor(t * 1.2 + a.k) % 3 === 0 ? 1 : 0;
      }
      const hop = tapped(a.id, 0.6);
      out.push(beast(a.id, a.species, a.variant, x, y, hop === null ? 0 : Math.sin(hop * Math.PI) * 5, flip, frame));
      // Les poussins suivent la poule rousse
      if (a.species === 'hen' && a.variant === 'rousse') {
        [[-0.32, 0.18], [-0.22, 0.4]].forEach(([dx, dy], c) => out.push(beast(`farm:chick:${c}`, 'chick', '', x + dx, y + dy, 0, flip, phase.night > 0.6 ? 0 : Math.floor(t * 2 + c) % 2)));
      }
    }
    // Bois : chaque bête a ses heures ; elle change de place à chaque heure
    const day = Math.floor(Date.now() / 86400000);
    const spot = (list, salt) => list[Math.floor(hash(day * 31 + Math.floor(h), salt) * list.length)];
    const wild = (id, species, cells, when, place) => {
      if (!cells.length || !when) return;
      const fled = tapped(id, 60);
      if (fled !== null && fled * 60 > 1.6) return;
      const base = place(spot(cells, species.length * 7));
      const run = fled === null ? 0 : (fled * 60) / 1.6;
      out.push(beast(id, species, base.variant || '', base.x + run * 2.2, base.y - run * 1.2, base.z || 0, run > 0 ? true : base.flip, run > 0 ? 1 : base.frame));
    };
    const dawn = h > phase.rise - 0.6 && h < phase.rise + 1.6;
    const dusk = h > phase.set - 1.2 && h < phase.set + 0.6;
    const dayTime = h > phase.rise + 0.5 && h < phase.set - 0.5;
    const night = phase.night > 0.5;
    wild('wild:deer', 'deer', edge, (dawn || dusk) && rain < 0.5, c => ({ ...c, frame: Math.floor(t / 4) % 2, flip: hash(day, 4) < 0.5 }));
    [0, 1].forEach(k => wild(`wild:rabbit:${k}`, 'rabbit', edge, dayTime && rain < 0.5, c => {
      const hop = (t + k * 2.3) % 5;
      const go = clamp((hop - 3.4) / 0.6);
      return { x: c.x + k * 0.6 + Math.sin(Math.floor((t + k * 2.3) / 5) * 1.7) * 0.4 * go, y: c.y + k * 0.4, z: go > 0 && go < 1 ? Math.sin(go * Math.PI) * 4 : 0, frame: go > 0 && go < 1 ? 1 : 0, flip: k === 1 };
    }));
    wild('wild:fox', 'fox', edge, (dusk || night) && rain < 0.8, c => {
      const k = (Math.sin(t * 0.25) + 1) / 2;
      return { x: c.x - 1 + k * 2, y: c.y, frame: Math.floor(t * 4) % 2, flip: Math.cos(t * 0.25) < 0 };
    });
    wild('wild:hedgehog', 'hedgehog', edge, night && rain < 0.5, c => ({ x: c.x + Math.sin(t * 0.2) * 0.3, y: c.y + 0.3, frame: Math.floor(t * 1.5) % 2, flip: Math.cos(t * 0.2) < 0 }));
    if (trees.length >= 2) {
      wild('wild:squirrel', 'squirrel', trees, dayTime && rain < 0.5, c => {
        const leap = (t % 7) / 7;
        return { x: c.x + 0.12, y: c.y + 0.12, z: 14 + (leap > 0.85 ? Math.sin(((leap - 0.85) / 0.15) * Math.PI) * 6 : 0), frame: Math.floor(t * 2) % 2, flip: hash(day, 9) < 0.5 };
      });
    }
    wild('wild:heron', 'heron', banks, dawn && rain < 0.5, c => ({ ...c, frame: (t % 6) < 0.6 ? 1 : 0, flip: hash(day, 6) < 0.5 }));
    // Carpes koï : trois qui tournent dans l'eau douce
    if (water.length >= 3) {
      const pond = water[Math.floor(hash(day, 41) * water.length)];
      ['#F08A3A', '#FFFFFF', '#F2C04B'].forEach((color, k) => {
        const a = t * (0.35 + k * 0.08) + k * 2.1;
        out.push(beast(`koi:${k}`, 'koi', color, pond.x + Math.cos(a) * 0.32, pond.y + Math.sin(a) * 0.26, -6, Math.sin(a) > 0, Math.floor(t * 3 + k) % 2));
      });
    }
    return { list: out, lights };
  }
  // Ce que dit un habitant ou une bête de la ferme qu'on touche ; null pour les bêtes sauvages (elles s'enfuient)
  function say(who, phase) {
    if (who.kind === 'villager') {
      const r = residents.find(v => v.id === who.id);
      if (!r) return null;
      const evening = phase.hour >= phase.set + 0.4;
      const lines = phase.weather.storm > 0.5
        ? ['L’orage gronde, mieux vaut rentrer !']
        : phase.weather.rain > 0.5
          ? ['Quel temps ! Heureusement, j’ai mon parapluie.']
          : evening
            ? ['Belle soirée… je rentre au Foyer.', 'Les étoiles sont de sortie.']
            : phase.hour < phase.rise + 1.5
              ? ['Bonjour ! Le jour se lève sur l’île.', ...WORK_LINES[r.role]]
              : WORK_LINES[r.role];
      return { title: r.look.label, text: lines[Math.floor(hash(Math.floor(Date.now() / 7000), r.k) * lines.length)] };
    }
    return SOUNDS[who.species] ? { title: BEAST_NAMES[who.species][0], text: SOUNDS[who.species] } : null;
  }
  // Fiche courte (appui long)
  function describe(who) {
    if (who.kind === 'villager') {
      const r = residents.find(v => v.id === who.id);
      return r ? { title: r.look.label, text: `Travaille à « ${r.site} » le jour, rentre au Foyer le soir.`, hint: 'Toucher : lui parler' } : null;
    }
    const [title, text] = BEAST_NAMES[who.species] || ['Une bête', ''];
    return { title, text, hint: WILD.has(who.species) ? 'Toucher : il s’enfuit' : 'Toucher : la faire réagir' };
  }
  return { residents, farm, at, say, describe, home, foyer };
}

// Une bête prête à dessiner (clé d'image par sorte, variante et image)
function beast(id, species, variant, x, y, z, flip, frame) {
  return { id, kind: 'beast', species, x, y, z, flip, sprite: [`beast-${species}-${variant}-${frame}`, () => ANIMAL_SPRITES[species](frame, variant)] };
}
export const isWild = species => WILD.has(species);
