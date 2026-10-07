// Vie ambiante de l'île : habitants et bêtes. Qui vit où, par où ils passent et ce qu'ils font à chaque instant,
// selon l'heure et le temps qu'il fait (sky.js). Rien n'est gardé par le serveur : tout se déduit de l'île (bâtiments
// bâtis, quartiers à soi, décor) et du temps.
// - Habitants : un par bâtiment bâti (son métier), plus la cuisinière du Foyer, dessinés sous trois angles
//   (villagers.js) : ils regardent où ils vont. Le jour ils travaillent et font leurs tournées par les chemins ; le soir ils rentrent au Foyer avec une lanterne ; la nuit ils dorment. Sous la pluie,
//   un sur deux reste à l'abri, les autres sortent avec un parapluie. Chacun a son allure, sa file quand il marche,
//   sa place autour d'un arrêt (personne ne marche sur personne), et une tournée qui change chaque jour.
// - Visiteur (lot 7d, vue du serveur) : arrivé en bateau, il flâne entre le Ponton, le Foyer et les bâtiments. Les
//   visiteurs installés travaillent au bâtiment de leur métier et passent par leur maison.
// - Ferme (avec les paliers du Potager) : poules de race et poussins, vache, moutons, cochon, chèvre, qui broutent
//   autour du Potager, se couchent la nuit et ne bougent plus sous la pluie.
// - Bois : lapins le jour, cerf à l'aube et au crépuscule, renard et hérisson la nuit, écureuil dans les arbres.
//   Touchés, ils s'enfuient. Eau : carpes koï dans l'eau douce, héron le matin.
// - Climats : deux bêtes par climat, une de chaque dans chaque quartier à soi de ce climat, sur une case libre (ni
//   décor, ni bâtiment, ni création, ni annexe, ni la clairière d'un gisement ou d'un lieu remarquable). Chacune a ses
//   heures (le fennec et la salamandre sortent la nuit) ; hors de ses heures, ou sous la pluie, elle se couche sur place.
//   Touchées, elles s'enfuient.
// - Bestiaire (bible, § 6.5 : bestiary.js) : les bêtes écrites dans le Grimoire s'y ajoutent (mésanges et hibou dans
//   les arbres, papillons et abeilles le jour, lucioles la nuit, grenouille et tortue au bord de l'eau douce, une
//   variante de plus à la ferme). Les familiers suivent leur maître, un pas derrière lui ; le bocal d'Ondin attend
//   près de lui, vide tant que Poisson n'est pas écrit.
// - Anya (bible, § 6.14, v6), une fois révélée : elle erre. Les jours de son passage, à l'aube ou au crépuscule, elle
//   se tient où le serveur l'a tirée, avec son grand cerf blanc et un halo de lucioles, et les bêtes alentour se
//   tournent toutes vers elle. Ses créatures (les loutres) jouent chaque jour au bord de l'eau douce. Avant même la
//   Révélation, Cannelle pose chaque soir un bol de soupe « pour la Dame » au bord du Foyer.
import { villagerSprite, ROLES, SKINS, HAIRS } from './villagers';
import { visitorLook } from './visitors';
import { masterSprite } from './masterArt';
import { ANIMAL_SPRITES } from './animals';
import { beastSprite, lookOf, viewOf, stepAt } from './beastArt';
import { bestiaryOf, FAMILIARS } from './bestiary';
import { anyaHere } from '@/game/anya';

// Les bêtes qui se tournent vers Anya : à moins de 8 cases d'elle
const ANYA_SIGN_RANGE = 8;
// Une bête sauvage touchée : son sursaut dure 2,4 s ; elle trottine de 0,35 case (sur chaque axe) et revient
const STARTLE = 2.4;
const STARTLE_TROT = 0.35;
// Celles qui se tiennent en l'air (branche, vol) : touchées, elles ne trottinent pas
const ALOFT = new Set(['squirrel', 'bird', 'owl', 'butterfly', 'bee', 'firefly']);
const smooth = k => k * k * (3 - 2 * k);

const SPEED = 0.8; // cases par seconde, à pied
const WALK = 'gsmdpkb';
const STAIRS = 'pkb';
const BLOCKING = new Set(['tree', 'pine', 'palm', 'bush', 'rock', 'rocks', 'crag', 'apple', 'birch', 'autumn', 'stump', 'log', 'mossy', 'lantern', 'bench', 'nest']);
const WORK_ORDER = ['potager', 'carriere', 'bosquet', 'puits', 'ponton', 'atelier'];
// Sans leur bâtiment, Aster (Ponton) et Rivet (Atelier) vivent au camp, près du Foyer (bible, § 6.6)
const CAMP = ['ponton', 'atelier'];
// Où regarde un habitant au repos (tiré toutes les 9 s) : souvent de côté, parfois vers le joueur ou au loin
const IDLE_VIEWS = ['se', 'se', 'front', 'ne'];
const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));

// Paroles des habitants (toucher), par métier et selon le moment
const WORK_LINES = {
  potager: ['Chaque chose en sa lune. Les carottes aussi.', 'Tu entends ? Les courges se disputent encore.'],
  carriere: ['Hm.', 'Hm. Belle pierre.'],
  bosquet: ['Chut. Arbre dort.', 'Graine, pousse… pousse…'],
  puits: ['Chut… l’eau parle.', 'Ma baguette tremble. Il y a de l’eau là-dessous.'],
  ponton: ['Ce nuage, c’est Gaston. Il apporte la pluie.', 'Vent d’ouest ! Ça mord, aujourd’hui !'],
  atelier: ['Clic… tac… Attends. Voilà !', 'Encore une vis et ça tourne. Tac !'],
  foyer: ['Ce qui mijote ne se presse pas !', 'Goûte-moi ça, ma brindille. Alors ?']
};
const SOUNDS = { hen: 'Cot cot !', chick: 'Piou piou !', cow: 'Meuh !', sheep: 'Bêêê !', pig: 'Groin groin !', goat: 'Mêêê !' };
export const BEAST_NAMES = {
  hen: ['Poule', 'Elle picore autour du Potager.'], chick: ['Poussin', 'Il suit sa mère partout.'],
  cow: ['Vache', 'Elle broute près du Potager et dort couchée la nuit.'], sheep: ['Mouton', 'Il broute en troupeau près du Potager.'],
  pig: ['Cochon', 'Il fouille la terre du bout du groin.'], goat: ['Chèvre', 'Elle grimpe partout où elle peut.'],
  deer: ['Cerf', 'Il sort du bois à l’aube et au crépuscule.'], fox: ['Renard', 'Il rôde au crépuscule et la nuit.'],
  rabbit: ['Lapin', 'Il gambade près du bois le jour.'], hedgehog: ['Hérisson', 'Il renifle les buissons la nuit.'],
  squirrel: ['Écureuil', 'Il saute d’arbre en arbre.'], koi: ['Carpe koï', 'Elle nage dans l’eau douce.'], heron: ['Héron', 'Il pêche au bord de l’eau le matin.'],
  snowFox: ['Renard des neiges', 'Il trotte sur la neige des Cimes.'], ibex: ['Bouquetin', 'Il broute entre les rochers des Cimes.'],
  puffin: ['Macareux', 'Il bat des ailes au bord des Landes.'], pony: ['Poney', 'Il broute la bruyère des Landes.'],
  frog: ['Grenouille', 'Elle saute dans le Marais, même sous la pluie.'], tortoise: ['Tortue', 'Elle avance tout doucement dans le Marais.'],
  fennec: ['Fennec', 'Il dort le jour et trotte la nuit dans les Dunes.'], camel: ['Dromadaire', 'Il traverse les Dunes à pas lents.'],
  chameleon: ['Caméléon', 'Il change de teinte sous les feuilles de la Jungle.'], toucan: ['Toucan', 'Il penche la tête sous les feuilles de la Jungle.'],
  salamander: ['Salamandre', 'Elle sort la nuit et sous la pluie, sur les cendres du Volcan.'], crow: ['Corbeau des cendres', 'Il croasse sur les pentes du Volcan.'],
  otter: ['Loutre', 'Une créature d’Anya : elle joue au bord de l’eau douce.'],
  bird: ['Mésange', 'Elle sautille dans les arbres, le jour.'], butterfly: ['Papillon', 'Il volette au bord des bois, le jour.'],
  firefly: ['Luciole', 'Elle s’allume la nuit, près de l’eau.'], bee: ['Abeille', 'Elle butine autour du Potager.'], owl: ['Hibou', 'Il veille la nuit, perché dans un arbre.']
};
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

/* ---------- Chemins ---------- */
// Grille où l'on marche : sol praticable des quartiers à soi, ni bâtiment, ni création, ni annexe, ni arbre ou
// rocher ; d'une case à l'autre à la même hauteur, ou par les marches des chemins
function gridOf({ n, M, sites, owned, crafts, props, annexes }) {
  const blocked = new Uint8Array(n * n);
  for (const s of sites) for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) if (x >= 0 && y >= 0 && x < n && y < n) blocked[y * n + x] = 1;
  for (const t of [...crafts, ...annexes]) blocked[t.y * n + t.x] = 1;
  for (const p of props) if (BLOCKING.has(p.kind)) blocked[p.y * n + p.x] = 1;
  const walk = (x, y) => x >= 0 && y >= 0 && x < n && y < n && !blocked[y * n + x] && owned.has(M.zone(x, y)) && WALK.includes(M.ground(x, y));
  const step = (a, b) => {
    const [ga, gb] = [M.ground(a.x, a.y), M.ground(b.x, b.y)];
    const dh = Math.abs(M.height(a.x, a.y) - M.height(b.x, b.y));
    return dh === 0 || (STAIRS.includes(ga) && STAIRS.includes(gb) && dh <= 1) || ga === 'b' || gb === 'b';
  };
  // Case libre (pour les bêtes des climats, qui ne suivent pas les chemins)
  const free = (x, y) => x >= 0 && y >= 0 && x < n && y < n && !blocked[y * n + x];
  // Cases où l'on marche (pour flâner)
  const walkable = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (walk(x, y)) walkable.push({ x, y });
  return { n, M, walk, step, free, walkable };
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
// crafts : créations d'île posées ({ x, y }) ; props : décor naturel ({ kind, x, y }) ; annexes : annexes posées ({ x, y, site }) ;
// visitor : visiteur du moment (vue du serveur) ou null ; settlers : visiteurs installés ({ id, seed, role, site, home }) ;
// climates : climat de chaque quartier (par indice) ; avoid : cases à laisser libres autour (gisements, lieux remarquables) ;
// troupe : la troupe rencontrée, vue du serveur ({ id, built, asleep } : bible, § 6.6), ou null (un par bâtiment bâti) ;
// written : les éléments écrits dans le Grimoire (le Bestiaire et les familiers), ou null ; anya : une fois Anya
// révélée, { visit } (son passage du jour, vu du serveur : { slot, x, y }, ou null), sinon null ; dame : le bol de soupe
// du soir « pour la Dame »
export function villageOf({ n, M, sites, owned, crafts = [], props, annexes = [], visitor = null, settlers = [], climates = [], avoid = [], troupe = null, written = null, anya = null, dame = false }) {
  const grid = gridOf({ n, M, sites, owned, crafts, props, annexes });
  const bestiary = bestiaryOf(written);
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

  // Habitants : la troupe rencontrée (8 au plus). Son bâtiment bâti, chacun y travaille ; sans bâtiment, Aster et Rivet
  // vivent au camp (la porte du Foyer), les dormeurs restent près de l'emplacement du leur (couchés, puis éveillés)
  const residents = [];
  const present = troupe && new Map(troupe.map(v => [v.id, v]));
  if (home) {
    for (const id of [...WORK_ORDER, 'foyer']) {
      const site = sites.find(s => s.id === id);
      const who = present ? present.get(id) : built.includes(site) && { built: true };
      if (!site || !who) continue;
      const asleep = Boolean(who.asleep);
      const camp = !who.built && CAMP.includes(id);
      const work = who.built ? doors[id] : camp ? home : doorOf(grid, site);
      if (!work) continue;
      const k = residents.length;
      residents.push({
        id: `vil:${id}`, k, key: `vil-${k}`, role: id, site: camp && foyer ? foyer.name : site.name,
        camp, waiting: !who.built && !camp && !asleep, asleep,
        // Naufragé tant que son bâtiment n'est pas fondé (dessin de la bibliothèque : masterArt.js)
        castaway: !who.built,
        look: { skin: SKINS[Math.floor(hash(k, 3) * SKINS.length)], hair: HAIRS[Math.floor(hash(k, 5) * HAIRS.length)], ...ROLES[id] },
        work, wake: 6.4 + (k % 3) * 0.25, bed: 21.6 + (k % 3) * 0.3,
        // Son familier, s'il est venu (bestiary.js)
        pet: bestiary.familiars.has(id) ? id : null,
        // Une annexe à soi (la première posée) : on y travaille une partie de la journée
        field: (() => { const annex = who.built && annexes.find(a => a.site === id); return annex ? besideOf(grid, annex, doors[id]) : null; })()
      });
    }
    // Visiteurs installés : au bâtiment de leur métier, et à leur maison (à la place de l'annexe)
    for (const s of settlers) {
      if (!doors[s.site]) continue;
      const k = residents.length;
      residents.push({
        id: `vil:${s.id}`, k, key: `set-${s.seed}`, role: s.site, site: built.find(b => b.id === s.site).name,
        look: visitorLook(s.seed, s.role), work: doors[s.site], wake: 6.6 + (k % 3) * 0.25, bed: 21.4 + (k % 3) * 0.3,
        field: s.home ? besideOf(grid, s.home, doors[s.site]) : null
      });
    }
    // Le visiteur : il débarque au Ponton et flâne (il ne travaille pas)
    if (visitor && doors.ponton) {
      const k = residents.length;
      residents.push({
        id: `vis:${visitor.id}`, k, key: `vis-${visitor.seed}`, role: 'visitor', guest: visitor, site: built.find(s => s.id === 'ponton').name,
        look: visitorLook(visitor.seed, visitor.role), work: doors.ponton, wake: 7, bed: 21.3, field: null
      });
    }
  }
  // Place d'un habitant à un arrêt : une case où l'on marche autour de la porte (ou la porte elle-même). Le tour
  // commence à une case tirée pour l'arrêt, puis chacun prend la suivante selon son rang : à un même arrêt, deux
  // habitants ne prennent pas la même case (tant qu'il y a des cases)
  const RING = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  const spotOf = (r, stop, salt) => {
    const around = RING.map(([dx, dy]) => ({ x: stop.x + dx, y: stop.y + dy })).filter((c, i) => i === 0 || grid.walk(c.x, c.y));
    return around[(Math.floor(hash(stop.x * 31 + stop.y, salt) * around.length) + r.k) % around.length];
  };
  // Une case où flâner, à quelques pas de son travail
  const roamOf = (r, salt) => {
    const near = grid.walkable.filter(c => Math.abs(c.x - r.work.x) + Math.abs(c.y - r.work.y) <= 6);
    return near.length ? near[Math.floor(hash(r.k * 29 + salt, 53) * near.length)] : r.work;
  };
  // Tournée d'un habitant pour la journée (ou la soirée) : une suite d'arrêts, chacun avec la marche pour y aller et
  // une pause ; elle tourne en boucle. Tirée pour lui et pour ce jour-là : elle change d'un habitant et d'un jour à
  // l'autre. Chacun marche à son allure, dans sa file (un petit pas de côté)
  const plans = new Map();
  const planOf = (r, evening, day) => {
    const key = `${r.id}:${evening ? 'soir' : 'jour'}:${day}`;
    if (plans.has(key)) return plans.get(key);
    const salt = i => day * 13 + i;
    const roll = (i, a, b) => a + (b - a) * hash(r.k * 7 + i, day % 997 + 3);
    const other = i => stops[Math.floor(hash(r.k * 7 + i, salt(13)) * stops.length)] || r.work;
    const near = stops.filter(s => s !== home).sort((a, b) => Math.hypot(a.x - home.x, a.y - home.y) - Math.hypot(b.x - home.x, b.y - home.y));
    let seq;
    if (evening) {
      // Le soir : chacun sa place autour du feu, un petit tour (un bâtiment proche ou quelques pas), puis le feu encore
      const stroll = hash(r.k, salt(5)) < 0.5 && near.length ? spotOf(r, near[Math.floor(hash(r.k, salt(6)) * Math.min(3, near.length))], 61) : roamOf(r, salt(7));
      seq = [[spotOf(r, home, salt(1)), roll(1, 30, 70), 'idle'], [stroll, roll(2, 10, 25), 'idle'], [spotOf(r, home, salt(2)), roll(3, 40, 90), 'idle']];
    } else if (r.guest) {
      seq = [[spotOf(r, r.work, 1), roll(1, 40, 80), 'idle'], [spotOf(r, other(1), 2), roll(2, 25, 45), 'idle'], [roamOf(r, salt(3)), roll(3, 15, 30), 'idle'],
        [spotOf(r, home, 4), roll(4, 30, 50), 'idle'], [spotOf(r, other(2), 5), roll(5, 25, 45), 'idle']];
    } else {
      // Le jour : le travail d'abord, puis cinq moments tirés parmi travailler (ou son annexe), passer voir un autre
      // bâtiment, flâner, une pause au Foyer ; le travail pour finir
      const moments = [
        i => [spotOf(r, r.field || r.work, salt(i)), roll(i, 70, 120), 'work'],
        i => [spotOf(r, other(i), salt(i)), roll(i, 15, 35), 'idle'],
        i => [roamOf(r, salt(i)), roll(i, 10, 25), 'idle'],
        i => [spotOf(r, home, salt(i)), roll(i, 20, 40), 'idle']
      ];
      seq = [[spotOf(r, r.work, salt(0)), roll(0, 60, 110), 'work']];
      for (let i = 1; i <= 5; i++) seq.push(moments[Math.floor(hash(r.k * 5 + i, salt(9)) * moments.length)](i));
      seq.push([spotOf(r, r.work, salt(8)), roll(8, 50, 90), 'work']);
    }
    const speed = SPEED * (0.8 + 0.35 * hash(r.k, 7));
    const legs = [];
    let at = seq[seq.length - 1][0];
    let total = 0;
    for (const [to, pause, act] of seq) {
      const path = routeOf(at, to) || [to];
      const walk = (path.length - 1) / speed;
      legs.push({ path, walk, pause, act, start: total });
      total += walk + pause;
      at = to;
    }
    // À l'arrêt, chacun se tient à sa place dans la case, sur un petit cercle (angle d'or : deux rangs voisins sont loin)
    const rest = { x: Math.cos(r.k * 2.4) * 0.26, y: Math.sin(r.k * 2.4) * 0.26 };
    const plan = { legs, total, speed, lane: (hash(r.k, 9) - 0.5) * 0.24, rest, offset: hash(r.k, salt(21)) * total };
    plans.set(key, plan);
    return plan;
  };
  // Place sur une tournée à l'instant t : case (fractionnaire), sens de marche, pose. En marche, un petit pas de côté
  // (perpendiculaire au chemin) ; à l'arrêt, sa place dans la case ; on passe de l'une à l'autre dans la première et
  // la dernière case du chemin (pas de saut)
  function onPlan(plan, t) {
    const tt = (t + plan.offset) % plan.total;
    const leg = plan.legs.reduce((found, l) => (tt >= l.start ? l : found), plan.legs[0]);
    const into = tt - leg.start;
    const last = leg.path[leg.path.length - 1];
    if (into >= leg.walk || leg.path.length < 2) return { x: last.x + plan.rest.x, y: last.y + plan.rest.y, pose: leg.act, back: false, flip: false };
    const d = into * plan.speed;
    const i = Math.min(leg.path.length - 2, Math.floor(d));
    const k = d - i;
    const [a, b] = [leg.path[i], leg.path[i + 1]];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const side = { x: dy ? plan.lane : 0, y: dx ? plan.lane : 0 };
    const blend = leg.path.length === 2 ? 1 : i === leg.path.length - 2 ? k : i === 0 ? 1 - k : 0;
    const ox = side.x + (plan.rest.x - side.x) * blend;
    const oy = side.y + (plan.rest.y - side.y) * blend;
    return { x: a.x + dx * k + ox, y: a.y + dy * k + oy, pose: 'walk', back: dx + dy < 0, flip: dx - dy < 0 };
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
    // seg : durée d'un tour (secondes) : marche vers une case du pré, puis broute ou picore ; beast : son nom au serveur
    // (bêtes de ferme, bible § 6.16 : on la nourrit, elle remplit sa bulle), pour celles que le palier amène
    const add = (species, variant, seg, beast = null) => farm.push({ id: `farm:${species}:${farm.length}`, species, variant, k: farm.length, seg, beast });
    add('hen', 'rousse', 8, 'poule-rousse');
    add('hen', 'noire', 9, 'poule-noire');
    if (potager.level >= 3) add('cow', '', 16, 'vache');
    if (potager.level >= 4) {
      add('sheep', '', 13, 'mouton');
      add('sheep', '', 14, 'brebis');
    }
    if (potager.level >= 5) add('pig', '', 12, 'cochon');
    if (potager.level >= 6) add('goat', '', 11, 'chevre');
    // Le Bestiaire : un élément de la ferme écrit ajoute une variante aux bêtes que le palier montre déjà
    const kinds = new Set(farm.map(a => a.species));
    bestiary.farm.filter(([species]) => kinds.has(species)).forEach(([species, variant], i) => add(species, variant, 10 + i));
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

  // Un familier prêt à dessiner (le bocal d'Ondin : avec Bulle, ou vide)
  const familiar = (r, x, y, z, flip, frame, look = null) => {
    const pet = FAMILIARS[r.role];
    const variant = r.role === 'puits' ? (bestiary.bulle ? 'bulle' : '') : pet.variant || '';
    return beast(`fam:${r.role}`, pet.species, variant, x, y, z, flip, frame, look);
  };

  // Tout ce qui vit à l'instant t (secondes) sous ce ciel : [{ id, kind, species, x, y, z, flip, sprite: [clé, dessin] }]
  // et les lanternes [{ x, y }] ; scared : touchers récents (Map id → { at })
  function at(t, phase, scared = new Map()) {
    const out = [];
    const lights = [];
    const h = phase.hour;
    const rain = phase.weather.rain;
    // Le jour (les tournées des habitants et les places des bêtes en changent)
    const day = Math.floor(Date.now() / 86400000);
    const tapped = (id, span) => {
      const s = scared.get(id);
      return s && t - s.at < span ? (t - s.at) / span : null;
    };
    // Un familier suit son maître (p : sa place, sur sa tournée plan) : Tic-Tac et Lunette volent autour de lui, les
    // autres marchent un pas derrière (Basalte, la tortue, traîne davantage) ; touché, il sautille
    const follow = (r, pet, plan, p, flip, now) => {
      const hop = tapped(`fam:${pet}`, 0.6);
      const lift = hop === null ? 0 : Math.sin(hop * Math.PI) * 4;
      if (pet === 'atelier') {
        // Tic-Tac s'arrête toutes les 23 s, au mauvais moment, et tombe le temps qu'on le remonte
        const stop = (now + r.k * 5) % 23 < 2.4;
        const a = now * 1.4;
        out.push(familiar(r, p.x + Math.cos(a) * 0.32, p.y + Math.sin(a) * 0.22, stop ? 0 : 13 + Math.sin(now * 3.2) * 2 + lift, Math.sin(a) > 0, stop ? 'rest' : Math.floor(now * 12) % 2));
        // Abeille écrite : Rivet lui a fabriqué une amie
        if (bestiary.friend) out.push(beast('fam:atelier:amie', 'bee', 'amie', p.x + Math.cos(a + 2.6) * 0.38, p.y + Math.sin(a + 2.6) * 0.26, 12 + Math.cos(now * 2.8) * 2, Math.sin(a + 2.6) > 0, Math.floor(now * 12 + 1) % 2));
        return;
      }
      if (pet === 'potager') {
        const a = now * 0.9;
        out.push(familiar(r, p.x + Math.cos(a) * 0.36, p.y + Math.sin(a) * 0.24, 14 + Math.sin(now * 2.2) * 3 + lift, Math.cos(a) < 0, Math.floor(now * 6) % 2));
        return;
      }
      const q = onPlan(plan, now - (pet === 'carriere' ? 2.4 : 0.8));
      const moving = q.pose === 'walk';
      // Mousse se cache : on ne le voit que quand Sylve s'arrête, et pas juste après l'avoir touché
      if (pet === 'bosquet' && (moving || tapped(`fam:${pet}`, 20) !== null)) return;
      const jump = pet === 'foyer' && moving && Math.floor(now * 2) % 2 === 1;
      const frame = pet === 'foyer' ? (jump ? 1 : 0) : moving ? Math.floor(now * (pet === 'carriere' ? 1.5 : 5)) % 2 : 0;
      // (en marche, dans la vue de son maître : de trois quarts avant, ou de dos)
      out.push(familiar(r, q.x + 0.3, q.y + 0.22, lift + (jump ? 2.5 : 0), moving ? q.flip : flip, frame, moving ? { view: q.back ? 'dos' : 'avant', pose: 'marche', n: frame + 1 } : null));
    };
    // Habitants
    for (const r of residents) {
      // Le bocal d'Ondin reste près de lui, de jour comme de nuit ; Bulle y revient quand Poisson est écrit
      if (r.pet === 'puits') out.push(familiar(r, r.work.x + 0.42, r.work.y + 0.34, 0, false, Math.floor(t * 0.7 + r.k) % 2));
      const pet = r.pet && r.pet !== 'puits' ? r.pet : null;
      // Un dormeur reste couché à sa place, jour et nuit, des « z » au-dessus de la tête (bible, § 6.7 et § 14) ; son
      // familier dort à côté de lui
      if (r.asleep) {
        const frame = Math.floor(t * 0.8 + r.k) % 2;
        const art = masterSprite(r.role, r.castaway, { pose: 'sleep', frame });
        out.push({
          id: r.id, kind: 'villager', role: r.role, x: r.work.x, y: r.work.y, z: 0, flip: false, pose: 'sleep',
          sprite: art ? [art.key, art.make] : [`${r.key}-sleep-${frame}`, () => villagerSprite(r.look, { pose: 'sleep', view: 'se', frame })]
        });
        if (pet) out.push(familiar(r, r.work.x + 0.34, r.work.y + 0.28, 0, false, 'rest'));
        continue;
      }
      if (h < r.wake || h >= r.bed) continue;
      if (rain > 0.5 && r.k % 2 === 1) continue;
      const evening = h >= phase.set + 0.4;
      const plan = planOf(r, evening, day);
      const p = onPlan(plan, t);
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
      // Un maître : son dessin de la bibliothèque (jamais en miroir de face ; la lanterne luit où il la tient)
      const art = r.key.startsWith('vil-') ? masterSprite(r.role, r.castaway, opts) : null;
      const flip = hop !== null || (art && art.view === 'face') ? false : walking ? p.flip : hash(r.k, Math.floor(t / 20)) < 0.5;
      out.push({
        id: r.id, kind: 'villager', role: r.role, x: p.x, y: p.y, z: hop === null ? 0 : Math.sin(hop * Math.PI) * 6, flip, pose: opts.pose,
        sprite: art ? [art.key, art.make] : [`${r.key}-${opts.pose}-${view}-${opts.frame}-${lantern ? 1 : 0}-${umbrella ? 1 : 0}`, () => villagerSprite(r.look, opts)]
      });
      if (art ? art.lantern : lantern) lights.push(art ? { x: p.x, y: p.y, dx: flip ? -art.lantern[0] : art.lantern[0], dy: art.lantern[1] } : { x: p.x, y: p.y, dx: flip ? 5.8 : -5.8, dy: -3 });
      if (pet) follow(r, pet, plan, p, flip, t);
    }
    // Ferme
    for (const a of farm) {
      const rest = pen[Math.floor(hash(a.k, 31) * pen.length)];
      const target = i => pen[Math.floor(hash(a.k * 13 + i, 37) * pen.length)];
      let x = rest.x;
      let y = rest.y;
      let frame = 0;
      let flip = hash(a.k, 2) < 0.5;
      let look = null;
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
        // Dessin de la bibliothèque : de trois quarts selon sa direction, ses pas à sa cadence ; arrêtée, dans la même vue
        look = { view: viewOf(to.x - from.x, to.y - from.y), pose: 'marche', n: move < 1 ? stepAt(t, a.k) : frame + 1 };
      }
      const hop = tapped(a.id, 0.6);
      // Touchée, elle bondit de joie (un cœur), sauf endormie
      const glad = hop !== null && frame !== 'rest' ? { view: look ? look.view : 'profil', pose: 'joie' } : look;
      out.push({ ...beast(a.id, a.species, a.variant, x, y, hop === null ? 0 : Math.sin(hop * Math.PI) * 5, flip, frame, glad), ...(a.beast ? { beast: a.beast } : {}) });
      // Les poussins suivent la poule rousse (tournés comme elle)
      if (a.species === 'hen' && a.variant === 'rousse') {
        [[-0.32, 0.18], [-0.22, 0.4]].forEach(([dx, dy], c) => {
          const step = phase.night > 0.6 ? 0 : Math.floor(t * 2 + c) % 2;
          out.push(beast(`farm:chick:${c}`, 'chick', '', x + dx, y + dy, 0, flip, step, look && { view: look.view, pose: 'marche', n: step + 1 }));
        });
      }
    }
    // Bois : chaque bête a ses heures ; elle change de place à chaque heure
    const spot = (list, salt) => list[Math.floor(hash(day * 31 + Math.floor(h), salt) * list.length)];
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
    const wild = (id, species, cells, when, place) => {
      if (!cells.length || !when) return;
      const base = place(spot(cells, species.length * 7));
      const s = tapped(id, STARTLE);
      const b = s === null ? base : startled(base, s, ALOFT.has(species));
      out.push(beast(id, species, b.variant || '', b.x, b.y, b.z || 0, b.flip, b.frame, b.look));
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
      const flip = Math.cos(t * 0.25) < 0;
      const frame = Math.floor(t * 4) % 2;
      return { x: c.x - 1 + k * 2, y: c.y, frame, flip, look: along(flip, frame) };
    });
    wild('wild:hedgehog', 'hedgehog', edge, night && rain < 0.5, c => {
      const flip = Math.cos(t * 0.2) < 0;
      const frame = Math.floor(t * 1.5) % 2;
      return { x: c.x + Math.sin(t * 0.2) * 0.3, y: c.y + 0.3, frame, flip, look: along(flip, frame) };
    });
    if (trees.length >= 2) {
      wild('wild:squirrel', 'squirrel', trees, dayTime && rain < 0.5, c => {
        const leap = (t % 7) / 7;
        return { x: c.x + 0.12, y: c.y + 0.12, z: 14 + (leap > 0.85 ? Math.sin(((leap - 0.85) / 0.15) * Math.PI) * 6 : 0), frame: Math.floor(t * 2) % 2, flip: hash(day, 9) < 0.5 };
      });
    }
    wild('wild:heron', 'heron', banks, dawn && rain < 0.5, c => ({ ...c, frame: (t % 6) < 0.6 ? 1 : 0, flip: hash(day, 6) < 0.5 }));
    // Climats : chaque bête vit à ses heures ; sinon (ou sous la pluie, si elle ne l'aime pas) elle se couche sur place
    for (const [z, cells] of wildZones) {
      CLIMATE_BEASTS[climates[z]].forEach(([species, hours, move, wet], k) => {
        const awake = (hours === 'always' || (hours === 'day' ? dayTime : night || dusk)) && (wet || rain < 0.5);
        const salt = z * 7 + k * 3;
        // Elle reste dans sa case (moins d'une demi-case de chaque côté) : ni eau ni décor voisins sous ses pattes
        wild(`clim:${z}:${species}`, species, cells, true, c => {
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
      [0, 1].forEach(k => wild(`best:bird:${k}`, 'bird', treeHalves[k], dayTime && rain < 0.5, c => {
        const peck = (t + k * 1.7) % 4 < 0.5;
        // Devant le feuillage (comme l'écureuil) : un peu plus vers le joueur que l'arbre
        return { x: c.x + 0.14, y: c.y + 0.12 + k * 0.04, z: 13 + k * 2 + ((t + k) % 3.2 < 0.25 ? 1.5 : 0), frame: peck ? 1 : 0, flip: hash(day + k, 12) < 0.5 };
      }));
    }
    if (bestiary.has('Hibou')) wild('best:owl', 'owl', trees, (night || dusk) && rain < 0.8, c => ({ x: c.x + 0.14, y: c.y + 0.14, z: 14, frame: t % 5 < 0.25 ? 1 : 0, flip: false }));
    if (bestiary.has('Papillon')) {
      ['jaune', 'bleu'].forEach((variant, k) => wild(`best:butterfly:${k}`, 'butterfly', edgeHalves[k], dayTime && rain < 0.4, c => {
        const a = t * 0.6 + k * 2;
        return { x: c.x + Math.sin(a) * 0.5, y: c.y + Math.cos(a * 0.7) * 0.3, z: 6 + Math.sin(t * 2.4 + k) * 2.5, frame: Math.floor(t * 7 + k) % 2, flip: Math.cos(a) < 0, variant };
      }));
    }
    if (bestiary.has('Abeille')) {
      const hive = doors.potager ? [doors.potager] : edge;
      [0, 1].forEach(k => wild(`best:bee:${k}`, 'bee', hive, dayTime && rain < 0.4, c => {
        const a = t * 1.8 + k * 3;
        return { x: c.x + Math.cos(a) * 0.5, y: c.y + Math.sin(a * 1.2) * 0.4, z: 7 + Math.sin(t * 4 + k) * 1.5, frame: Math.floor(t * 14 + k) % 2, flip: Math.sin(a) > 0 };
      }));
    }
    if (bestiary.has('Luciole')) {
      const glade = banks.length ? banks : edge;
      for (let k = 0; k < 5; k++) {
        wild(`best:firefly:${k}`, 'firefly', glade, (night || dusk) && rain < 0.5, c => {
          const a = t * 0.35 + k * 1.3;
          return { x: c.x + Math.cos(a) * (0.35 + k * 0.08), y: c.y + Math.sin(a * 1.3) * 0.32, z: 4 + k * 1.6 + Math.sin(t * 1.1 + k) * 1.5, frame: Math.floor(t * 1.6 + k * 0.7) % 2, flip: false };
        });
      }
    }
    if (bestiary.has('Grenouille')) {
      wild('best:frog', 'frog', banks, true, c => {
        const go = clamp((((t + 5) % 4) - 3.2) / 0.6);
        const jump = go > 0 && go < 1;
        return { x: c.x + 0.3 * go - 0.15, y: c.y, z: jump ? Math.sin(go * Math.PI) * 4 : 0, frame: night && rain < 0.3 ? 'rest' : jump ? 1 : 0, flip: hash(day, 14) < 0.5 };
      });
    }
    if (bestiary.has('Tortue')) {
      wild('best:tortoise', 'tortoise', banks, true, c => {
        const a = t * 0.08 + 3;
        const frame = Math.floor(t * 1.2) % 2;
        return dayTime ? { x: c.x + Math.sin(a) * 0.3, y: c.y, frame, flip: Math.cos(a) < 0, look: along(Math.cos(a) < 0, frame) } : { ...c, frame: 'rest', flip: false };
      });
    }
    // Anya, le jour de son passage, à son moment (l'aube ou le crépuscule) : son cerf blanc, ses lucioles
    const here = anya && anya.visit && anyaHere(h, phase.rise, phase.set, anya.visit.slot) ? anya.visit : null;
    if (here) {
      const hop = tapped('anya:dame', 0.8);
      out.push(beast('anya:dame', 'anya', '', here.x + 0.5, here.y + 0.5, hop === null ? 0 : Math.sin(hop * Math.PI) * 3, false, Math.floor(t * 0.5) % 2));
      out.push(beast('anya:cerf', 'deer', 'blanc', here.x + 1.3, here.y + 0.9, 0, true, Math.floor(t / 5) % 2));
      for (let k = 0; k < 6; k++) {
        const a = t * 0.3 + k * 1.05;
        out.push(beast(`anya:luciole:${k}`, 'firefly', '', here.x + 0.5 + Math.cos(a) * 0.9, here.y + 0.5 + Math.sin(a) * 0.6, 18 + k * 4 + Math.sin(t + k) * 3, false, Math.floor(t * 1.4 + k) % 2));
      }
    }
    if (anya && banks.length) {
      [0, 1].forEach(k => wild(`anya:otter:${k}`, 'otter', k ? banks.slice().reverse() : banks, dayTime && rain < 0.6, c => {
        const up = (t + k * 2) % 6 < 1.2;
        const flip = Math.cos(t * 0.2 + k) < 0;
        return { x: c.x + Math.sin(t * 0.2 + k) * 0.3, y: c.y, frame: up ? 1 : 0, flip, look: along(flip, up ? 1 : 0) };
      }));
    }
    // Le bol de soupe « pour la Dame », posé chaque soir au bord du Foyer
    if (dame && home && (night || h >= phase.set + 0.4)) out.push(beast('dame:bol', 'soup', '', home.x + 0.45, home.y + 0.35, 0, false, Math.floor(t * 1.5) % 2));
    // Carpes koï : trois qui tournent dans l'eau douce
    if (water.length >= 3) {
      const pond = water[Math.floor(hash(day, 41) * water.length)];
      ['#F08A3A', '#FFFFFF', '#F2C04B'].forEach((color, k) => {
        const a = t * (0.35 + k * 0.08) + k * 2.1;
        out.push(beast(`koi:${k}`, 'koi', color, pond.x + Math.cos(a) * 0.32, pond.y + Math.sin(a) * 0.26, -6, Math.sin(a) > 0, Math.floor(t * 3 + k) % 2));
      });
    }
    // Le signe de son passage (§ 6.14) : les bêtes alentour se tournent toutes vers Anya (les poissons non)
    if (here) {
      for (const b of out) {
        if (b.id.startsWith('anya:') || b.species === 'koi' || Math.hypot(b.x - here.x, b.y - here.y) > ANYA_SIGN_RANGE) continue;
        b.flip = (here.x - b.x) - (here.y - b.y) < 0;
      }
    }
    // La lueur des lucioles, la nuit (la teinte de la nuit éteindrait le halo de leur dessin)
    for (const b of out) if (b.glow) lights.push({ x: b.x, y: b.y, dx: 0, dy: -b.z, r: 9, color: '255,236,140', a: b.glow });
    return { list: out, lights };
  }
  // Ce que dit un familier qu'on touche, ou sa fiche courte (appui long)
  function petInfo(who, long) {
    const id = who.id.split(':')[1];
    if (who.id === 'fam:atelier:amie') return { title: 'L’amie de Tic-Tac', text: long ? 'Une vraie abeille : Rivet l’a fabriquée pour Tic-Tac quand Abeille a été écrite.' : 'Bzz !' };
    if (id === 'puits') {
      if (!bestiary.bulle) return { title: 'Le bocal d’Ondin', text: long ? 'Vide : « Bulle est retourné dans la mer. » Ce qu’on écrit renaît…' : '« Bulle est retourné dans la mer. »' };
      return { title: 'Bulle', text: long ? 'Le petit poisson d’Ondin, revenu quand Poisson a été écrit : ce qu’on écrit renaît.' : 'Blub !' };
    }
    const f = FAMILIARS[id];
    return { title: long ? `${f.name} · familier` : f.name, text: long ? f.text : f.says };
  }
  // Anya, son cerf, ses lucioles, ses loutres ; le bol de la Dame (toucher : ce qu'ils disent ; appui long : leur fiche)
  function storyInfo(who, long) {
    if (who.id === 'anya:dame') return { title: 'Anya', text: long ? 'L’Âme de l’Île. Elle erre ; on la croise rarement, à l’aube ou au crépuscule.' : 'La forêt se souvient de toi.', ...(long ? { hint: 'Toucher : son Souffle, une fois par passage' } : {}) };
    if (who.id === 'anya:cerf') return { title: 'Le cerf blanc', text: long ? 'Le grand cerf blanc d’Anya. Il ne quitte pas sa Dame.' : 'Il incline ses bois.', ...(long ? { hint: 'Toucher : il incline ses bois' } : {}) };
    if (who.id === 'dame:bol') return { title: 'Un bol de soupe', text: '« Pour la Dame. » Cannelle le pose chaque soir au bord du Foyer.', ...(long ? { hint: 'Toucher : le regarder' } : {}) };
    if (who.id.startsWith('anya:otter')) return long ? { title: 'Loutre', text: BEAST_NAMES.otter[1], hint: 'Toucher : elle sursaute' } : null;
    return long ? { title: 'Luciole', text: 'Le halo d’Anya.', hint: 'Toucher : elle clignote' } : null;
  }
  // Ce que dit un habitant ou une bête de la ferme qu'on touche ; null pour les bêtes sauvages (elles s'enfuient)
  function say(who, phase) {
    if (who.id && who.id.startsWith('fam:')) return petInfo(who, false);
    if (who.id && (who.id.startsWith('anya:') || who.id === 'dame:bol')) return storyInfo(who, false);
    if (who.kind === 'villager') {
      const r = residents.find(v => v.id === who.id);
      if (!r) return null;
      if (r.guest) return { title: r.guest.name, text: '' };
      if (r.asleep) return { title: r.look.label, text: 'Zzz…' };
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
      if (r && r.guest) return { title: `${r.guest.name} · ${r.guest.role}`, text: 'De passage sur l’île : son bateau attend au Ponton.', hint: 'Toucher : lui parler' };
      if (r && r.asleep) return { title: r.look.label, text: 'Il dort dans la brume. Parle-lui pour le réveiller.', hint: 'Toucher : lui parler' };
      if (r && r.camp) return { title: r.look.label, text: `Vit au camp, près de « ${r.site} », en attendant son bâtiment.`, hint: 'Toucher : lui parler' };
      if (r && r.waiting) return { title: r.look.label, text: `Attend que « ${r.site} » sorte de terre, tout près.`, hint: 'Toucher : lui parler' };
      return r ? { title: r.look.label, text: `Travaille à « ${r.site} » le jour, rentre au Foyer le soir.`, hint: 'Toucher : lui parler' } : null;
    }
    if (who.id && who.id.startsWith('fam:')) return { ...petInfo(who, true), hint: 'Toucher : le saluer' };
    if (who.id && (who.id.startsWith('anya:') || who.id === 'dame:bol')) return storyInfo(who, true);
    const [title, text] = BEAST_NAMES[who.species] || ['Une bête', ''];
    return { title, text, hint: WILD.has(who.species) ? 'Toucher : il sursaute' : 'Toucher : la faire réagir' };
  }
  return { residents, farm, at, say, describe, home, foyer };
}

// Une bête prête à dessiner : le dessin de la bibliothèque (beastArt.js ; look : sa vue, sa pose et son image, sinon
// déduits de l'image du jeu, de profil), sinon celui du code (clé d'image par sorte, variante et image)
// (dessinée de face, le hibou ou un papillon, elle ne se retourne jamais)
// (dessinée de face, le hibou ou un papillon, elle ne se retourne jamais ; une luciole luit, plus fort quand elle
// s'allume : glow)
function beast(id, species, variant, x, y, z, flip, frame, look = null) {
  const art = beastSprite(species, variant, look || lookOf(frame, species));
  return {
    id, kind: 'beast', species, x, y, z, flip: art && art.face ? false : flip,
    sprite: art ? [art.key, art.make] : [`beast-${species}-${variant}-${frame}`, () => ANIMAL_SPRITES[species](frame, variant)],
    ...(species === 'firefly' ? { glow: frame === 1 ? 1 : 0.55 } : {})
  };
}
export const isWild = species => WILD.has(species);
