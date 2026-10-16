// Le village (world/village.js) : les habitants. Qui vit où (la troupe rencontrée, les visiteurs installés, le visiteur
// du moment), leurs tournées du jour et du soir, l'arrivée d'un naufragé, et ce qu'on dessine d'eux à chaque instant,
// leur familier compris.
import { villagerSprite, ROLES, SKINS, HAIRS } from '../villagers';
import { visitorLook } from '../visitors';
import { masterSprite } from '../masterArt';
import { FAMILIARS } from '../bestiary';
import { besideOf, nearestWalk, doorOf } from './paths';
import { hash, beast } from './beast';
import { plankAt, PLANK_SPRITE, PLANK_LIFT } from './plank';
import { momentOf, visitOf, HOURS } from './agenda';
import { coach } from '@/game/coach';
import { SEASON } from '../plants';

const SPEED = 0.8; // cases par seconde, à pied
const WORK_ORDER = ['potager', 'carriere', 'bosquet', 'puits', 'ponton', 'atelier'];
// Sans leur bâtiment, Lorena (Ponton) et Nathan (Atelier) vivent au camp, près du Foyer (bible, § 6.6)
const CAMP = ['ponton', 'atelier'];
// Où regarde un habitant au repos (tiré toutes les 9 s) : souvent de côté, parfois vers le joueur ou au loin
const IDLE_VIEWS = ['se', 'se', 'front', 'ne'];
// Le geste de chaque maître sur son annexe (poses de travail de la bibliothèque), un par jour : Maggy bêche, sème,
// arrose et récolte ; Maerys taille et scie ; Nathan scie ; Agathe récolte et arrose ; Léo arrose
const CHORES = { potager: ['becher', 'semer', 'arroser', 'recolter'], bosquet: ['tailler', 'scier'], atelier: ['scier'], foyer: ['recolter', 'arroser'], puits: ['arroser'] };
const CALM_REACH = 2;
const ARRIVE_SPEED = 1.5;
const ARRIVE_PAUSE = 12;
// Son allure selon son humeur (serveur : moodsOf) : traînante quand il est triste, un peu plus vive quand il est heureux
const MOOD_PACE = { triste: 0.72, heureux: 1.1 };
// Les lieux de ses rituels (village/agenda.js) : la case où l'on marche la plus proche, à tant de cases au plus, qui
// touche l'eau douce (Léo) ou la forêt (Maerys)
const EDGE_REACH = 10;
const EDGES = { water: ['w'], forest: ['f', 't'] };
const SIDES = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function edgeOf(grid, M, from, codes) {
  if (!M || !from) return null;
  let best = null;
  let dist = Infinity;
  for (const c of grid.walkable) {
    const d = Math.abs(c.x - from.x) + Math.abs(c.y - from.y);
    if (d > EDGE_REACH || d >= dist) continue;
    if (SIDES.some(([dx, dy]) => codes.includes(M.ground(c.x + dx, c.y + dy)))) {
      best = c;
      dist = d;
    }
  }
  return best;
}

// Habitants : la troupe rencontrée (8 au plus). Son bâtiment bâti, chacun y travaille ; sans bâtiment, Lorena et Nathan
// vivent au camp (la porte du Foyer), les dormeurs restent près de l'emplacement du leur (couchés, puis éveillés)
// beds : où dort un naufragé avant qu'on le réveille, quand ce n'est pas sa place (Map rôle → case : Maerys, à l'orée de sa
// forêt ; WorldView, castaways.js : bedsOf)
// M : la carte (les lieux des rituels : l'eau douce, la forêt). Chacun a ses heures (agenda.js : HOURS), son lit (bedAt :
// sa porte, le camp, ou sa maison pour un voyageur installé ; le voyageur de passage n'en a pas) et son humeur
export function residentsOf({ grid, M, sites, built, doors, home, foyer, troupe, posts, beds, settlers, visitor, annexes, bestiary }) {
  const residents = [];
  const present = troupe && new Map(troupe.map(v => [v.id, v]));
  if (home) {
    for (const id of [...WORK_ORDER, 'foyer']) {
      const site = sites.find(s => s.id === id);
      const who = present ? present.get(id) : built.includes(site) && { built: true };
      if (!site || !who) continue;
      const asleep = Boolean(who.asleep);
      const post = posts && posts.get(id);
      // (qui nage reste à sa case d'eau : elle ne se marche pas)
      const swim = Boolean(post && post.swim);
      const camp = !who.built && CAMP.includes(id) && !post;
      const bed = asleep && beds && beds.get(id);
      const work = swim ? { x: post.x, y: post.y } : post && post !== 'site' ? nearestWalk(grid, post) : bed ? nearestWalk(grid, bed) : who.built ? doors[id] : camp ? home : doorOf(grid, site);
      if (!work) continue;
      const k = residents.length;
      residents.push({
        id: `vil:${id}`, k, key: `vil-${k}`, role: id, site: camp && foyer ? foyer.name : site.name,
        camp, waiting: !who.built && !camp && !asleep, asleep, swim,
        // Léo endormi sur sa planche échouée (game/stages.js : planche ; WorldView, castaways.js : { at } de sa dérive)
        plank: (post && post.plank) || null,
        // Naufragé tant que son bâtiment n'est pas fondé (dessin de la bibliothèque : masterArt.js)
        castaway: !who.built,
        look: { skin: SKINS[Math.floor(hash(k, 3) * SKINS.length)], hair: HAIRS[Math.floor(hash(k, 5) * HAIRS.length)], ...ROLES[id] },
        work, wake: (HOURS[id] && HOURS[id].wake) || 6.4 + (k % 3) * 0.25, bed: (HOURS[id] && HOURS[id].bed) || 21.6 + (k % 3) * 0.3,
        master: true, mood: who.mood || null, bedAt: work,
        // Son familier, s'il est venu (bestiary.js)
        pet: bestiary.familiars.has(id) ? id : null,
        // Une annexe à soi (la première posée) : on y travaille une partie de la journée
        field: (() => { const annex = who.built && annexes.find(a => a.site === id); return annex ? besideOf(grid, annex, doors[id]) : null; })(),
        water: id === 'puits' ? edgeOf(grid, M, work, EDGES.water) : null,
        forest: id === 'bosquet' ? edgeOf(grid, M, work, EDGES.forest) : null
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
      // (il dort à sa maison, sinon à la porte de son métier)
      residents[k].bedAt = residents[k].field || residents[k].work;
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
  return residents;
}

// Son allure à pied : la sienne, selon son humeur
const speedOf = r => SPEED * (0.8 + 0.35 * hash(r.k, 7)) * (MOOD_PACE[r.mood] || 1);

// Les tournées des habitants et l'arrivée d'un naufragé, gardées une fois tirées, et sa place à chaque instant selon
// son agenda (village/agenda.js) : { planOf, introOf, placeOf, peekOf, seen }
export function plannerOf({ grid, stops, home, calm, routeOf }) {
  // Place d'un habitant à un arrêt : une case où l'on marche autour de la porte (ou la porte elle-même). Le tour
  // commence à une case tirée pour l'arrêt, puis chacun prend la suivante selon son rang : à un même arrêt, deux
  // habitants ne prennent pas la même case (tant qu'il y a des cases)
  const RING = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  const spotOf = (r, stop, salt) => {
    const around = RING.map(([dx, dy]) => ({ x: stop.x + dx, y: stop.y + dy })).filter((c, i) => i === 0 || grid.walk(c.x, c.y));
    return around[(Math.floor(hash(stop.x * 31 + stop.y, salt) * around.length) + r.k) % around.length];
  };
  // Une case où flâner, à quelques pas de son travail (pendant le tutoriel, tout près)
  const roamOf = (r, salt) => {
    const reach = calm ? CALM_REACH : 6;
    const near = grid.walkable.filter(c => Math.abs(c.x - r.work.x) + Math.abs(c.y - r.work.y) <= reach);
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
    if (calm && !r.guest) {
      // Le tutoriel : chacun à sa place (son travail, quelques pas autour), le soir aussi : on sait où le trouver
      seq = [[spotOf(r, r.work, salt(0)), roll(0, 60, 110), evening ? 'idle' : 'work'], [roamOf(r, salt(1)), roll(1, 10, 25), 'idle'], [spotOf(r, r.work, salt(2)), roll(2, 50, 90), evening ? 'idle' : 'work']];
    } else if (evening) {
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
        i => [spotOf(r, r.field || r.work, salt(i)), roll(i, 70, 120), r.field ? 'field' : 'work'],
        i => [spotOf(r, other(i), salt(i)), roll(i, 15, 35), 'idle'],
        i => [roamOf(r, salt(i)), roll(i, 10, 25), 'idle'],
        i => [spotOf(r, home, salt(i)), roll(i, 20, 40), 'idle']
      ];
      seq = [[spotOf(r, r.work, salt(0)), roll(0, 60, 110), 'work']];
      for (let i = 1; i <= 5; i++) seq.push(moments[Math.floor(hash(r.k * 5 + i, salt(9)) * moments.length)](i));
      seq.push([spotOf(r, r.work, salt(8)), roll(8, 50, 90), 'work']);
    }
    const speed = speedOf(r);
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
  // L'arrivée d'un naufragé (arrivals) : de la case près de l'épave à sa place, d'un pas pressé, puis un temps arrêté
  const intros = new Map();
  const introOf = (r, wreck) => {
    if (intros.has(r.id)) return intros.get(r.id);
    // (la case où l'on marche la plus proche de l'épave)
    const d = c => Math.hypot(c.x - wreck.x, c.y - wreck.y);
    const from = grid.walkable.reduce((best, c) => (!best || d(c) < d(best) ? c : best), null) || wreck;
    const to = spotOf(r, r.work, 0);
    const path = routeOf(from, to) || [from, to];
    const walk = (path.length - 1) / ARRIVE_SPEED;
    const intro = { legs: [{ path, walk, pause: ARRIVE_PAUSE, act: 'idle', start: 0 }], total: walk + ARRIVE_PAUSE, speed: ARRIVE_SPEED, lane: 0, rest: { x: 0, y: 0 }, offset: 0 };
    intros.set(r.id, intro);
    return intro;
  };
  // Une place tenue (son lit, son abri, son rituel, le repas, une visite) : un arrêt sans fin, sa pose et où il regarde
  const holds = new Map();
  const holdOf = (r, key, at, act, view = null) => {
    const id = `${r.id}:${key}:${at.x},${at.y}`;
    if (!holds.has(id)) holds.set(id, { legs: [{ path: [at], walk: 0, pause: 1, act, view, start: 0 }], total: 1, speed: speedOf(r), lane: 0, rest: { x: Math.cos(r.k * 2.4) * 0.26, y: Math.sin(r.k * 2.4) * 0.26 }, offset: 0 });
    return holds.get(id);
  };
  // Ce que vise son agenda (m : agenda.js, momentOf) ce jour-là : une tournée, ou une place tenue. doorOf : la porte
  // d'un camarade (sa visite)
  const targetOf = (r, m, day, doorOf) => {
    if (m.mode === 'nuit') return holdOf(r, 'nuit', spotOf(r, r.bedAt || r.work, 59), 'sleep');
    if (m.mode === 'abri') return holdOf(r, 'abri', spotOf(r, r.work, 71), 'idle');
    if (m.ritual) {
      const where = { work: r.work, field: r.field || r.work, water: r.water || r.work, forest: r.forest || r.work }[m.ritual.where];
      return holdOf(r, m.mode, spotOf(r, where, 79), m.ritual.where === 'field' && m.ritual.pose === 'work' ? 'field' : m.ritual.pose, m.ritual.view || null);
    }
    if (m.mode === 'repas' && home) return holdOf(r, 'repas', spotOf(r, home, 83), 'idle');
    if (m.mode === 'visite') return holdOf(r, 'visite', spotOf(r, doorOf(m.visit.who) || r.work, 91), 'idle');
    return planOf(r, m.mode === 'soir', day);
  };
  // Sa place à l'instant t : quand son agenda change, il marche de là où il était jusqu'à sa nouvelle place (rien ne
  // saute), puis la suit ; à la première image, il y est déjà
  const moves = new Map();
  const placeOf = (r, m, t, day, doorOf) => {
    const target = targetOf(r, m, day, doorOf);
    let move = moves.get(r.id);
    if (!move || move.mode !== m.mode || move.day !== day || move.target !== target) {
      const from = move && move.last;
      const to = onPlan(target, t);
      const path = from && Math.hypot(from.x - to.x, from.y - to.y) > 0.6 ? routeOf({ x: Math.round(from.x), y: Math.round(from.y) }, { x: Math.round(to.x), y: Math.round(to.y) }) : null;
      const walk = path && path.length > 1 ? (path.length - 1) / speedOf(r) : 0;
      // (le chemin part de là où il se tient, pas du milieu de sa case)
      const trip = walk ? { legs: [{ path: [{ x: from.x, y: from.y }, ...path.slice(1)], walk, pause: 0, act: 'idle', start: 0 }], total: walk, speed: speedOf(r), lane: target.lane, rest: target.rest, offset: 0 } : null;
      move = { mode: m.mode, day, at: t, walk, trip, target, last: from };
      moves.set(r.id, move);
    }
    const since = t - move.at;
    const p = move.trip && since < move.walk ? onPlan(move.trip, since) : onPlan(target, t - move.walk);
    move.last = p;
    return p;
  };
  // Où il était à l'instant t (son familier le suit, un pas derrière), sans rien changer
  const peekOf = (r, t) => {
    const move = moves.get(r.id);
    if (!move || !move.target) return null;
    const since = t - move.at;
    return move.trip && since < move.walk ? onPlan(move.trip, Math.max(0, since)) : onPlan(move.target, t - move.walk);
  };
  // Sa place, vue d'ailleurs (sa marche d'arrivée) : son agenda repartira de là
  const seen = (r, p) => moves.set(r.id, { ...(moves.get(r.id) || {}), mode: null, last: p });
  return { planOf, introOf, placeOf, peekOf, seen };
}

// Place sur une tournée à l'instant t : case (fractionnaire), sens de marche, pose. En marche, un petit pas de côté
// (perpendiculaire au chemin) ; à l'arrêt, sa place dans la case ; on passe de l'une à l'autre dans la première et
// la dernière case du chemin (pas de saut)
export function onPlan(plan, t) {
  // (un familier qui suit son maître tout juste arrivé regarde un peu avant le départ : il attend au début du chemin)
  const tt = (Math.max(0, t) + plan.offset) % plan.total;
  const leg = plan.legs.reduce((found, l) => (tt >= l.start ? l : found), plan.legs[0]);
  const into = tt - leg.start;
  const last = leg.path[leg.path.length - 1];
  if (into >= leg.walk || leg.path.length < 2) return { x: last.x + plan.rest.x, y: last.y + plan.rest.y, pose: leg.act, view: leg.view || null, back: false, flip: false };
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

// Les habitants à l'instant du dessin (f : t, h, rain, islandDay, phase, tapped, out, lights), selon leur agenda
// (village/agenda.js), leur familier avec eux. calm : le tutoriel
export function drawResidents(f, { residents, introOf, placeOf, peekOf, seen, arrivals, bestiary, calm = false }) {
  const { t, h, rain, islandDay: day, phase, tapped, out, lights, meets = [] } = f;
  // (la tenue des maîtres : d'hiver toute la saison, de pluie sous une averse ; le parapluie, au-delà de 0,5, passe avant)
  const tenue = SEASON === 'hiver' ? 'hiver' : rain > 0.15 ? 'pluie' : null;
  // Celui que le coach montre (« île:habitant:<rôle> » : Nathan qui sort de la brume) ne se cache jamais, ni au lit ni
  // sous la pluie : sans lui, ni « ! », ni flèche, ni « Me montrer »
  const lesson = coach.state.lesson;
  const shown = lesson && lesson.steps.find(st => st.target && st.target.startsWith('île:habitant:'));
  const wanted = shown ? shown.target.slice('île:habitant:'.length) : null;
  // Un familier prêt à dessiner (le bocal de Léo : avec Bulle, ou vide)
  const familiar = (r, x, y, z, flip, frame, look = null) => {
    const pet = FAMILIARS[r.role];
    const variant = r.role === 'puits' ? (bestiary.bulle ? 'bulle' : '') : pet.variant || '';
    return beast(`fam:${r.role}`, pet.species, variant, x, y, z, flip, frame, look);
  };
  // Un familier suit son maître (p : sa place ; where(dt) : où il était dt secondes plus tôt) : Tic-Tac et Lunette
  // volent autour de lui, les autres marchent un pas derrière (Basalte, la tortue, traîne davantage) ; touché, il
  // sautille
  const follow = (r, pet, where, p, flip, now) => {
    const hop = tapped(`fam:${pet}`, 0.6);
    const lift = hop === null ? 0 : Math.sin(hop * Math.PI) * 4;
    if (pet === 'atelier') {
      // Tic-Tac s'arrête toutes les 23 s, au mauvais moment, et tombe le temps qu'on le remonte
      const stop = (now + r.k * 5) % 23 < 2.4;
      const a = now * 1.4;
      out.push(familiar(r, p.x + Math.cos(a) * 0.32, p.y + Math.sin(a) * 0.22, stop ? 0 : 13 + Math.sin(now * 3.2) * 2 + lift, Math.sin(a) > 0, stop ? 'rest' : Math.floor(now * 12) % 2));
      // Abeille écrite : Nathan lui a fabriqué une amie
      if (bestiary.friend) out.push(beast('fam:atelier:amie', 'bee', 'amie', p.x + Math.cos(a + 2.6) * 0.38, p.y + Math.sin(a + 2.6) * 0.26, 12 + Math.cos(now * 2.8) * 2, Math.sin(a + 2.6) > 0, Math.floor(now * 12 + 1) % 2));
      return;
    }
    if (pet === 'potager') {
      const a = now * 0.9;
      out.push(familiar(r, p.x + Math.cos(a) * 0.36, p.y + Math.sin(a) * 0.24, 14 + Math.sin(now * 2.2) * 3 + lift, Math.cos(a) < 0, Math.floor(now * 6) % 2));
      return;
    }
    const q = where(pet === 'carriere' ? 2.4 : 0.8) || p;
    const moving = q.pose === 'walk';
    // Mousse se cache : on ne le voit que quand Maerys s'arrête, et pas juste après l'avoir touché
    if (pet === 'bosquet' && (moving || tapped(`fam:${pet}`, 20) !== null)) return;
    const jump = pet === 'foyer' && moving && Math.floor(now * 2) % 2 === 1;
    const frame = pet === 'foyer' ? (jump ? 1 : 0) : moving ? Math.floor(now * (pet === 'carriere' ? 1.5 : 5)) % 2 : 0;
    // (en marche, dans la vue de son maître : de trois quarts avant, ou de dos)
    out.push(familiar(r, q.x + 0.3, q.y + 0.22, lift + (jump ? 2.5 : 0), moving ? q.flip : flip, frame, moving ? { view: q.back ? 'dos' : 'avant', pose: 'marche', n: frame + 1 } : null));
  };
  // Les visites du jour (un camarade éveillé, à sa porte) : qui va voir qui
  const mates = residents.filter(r => r.master && !r.asleep && !r.swim);
  const doorOf = role => (mates.find(r => r.role === role) || {}).work || null;
  // Où se tient chacun à cette image, et qui est arrivé chez le camarade qu'il visite (les rencontres : meets)
  const standing = new Map();
  const visiting = [];
  // Habitants
  for (const r of residents) {
    // Sa planche, qui dérive encore jusqu'au sable : il dort dessus, son bocal à côté de lui (devant elle : un rien plus
    // haut dans la case)
    const bed = r.plank ? plankAt(r.plank, r.work.x, r.work.y, t) : { x: r.work.x, y: r.work.y, z: 0 };
    const lift = r.plank ? bed.z + PLANK_LIFT : 0;
    if (r.plank) out.push({ id: `${r.id}:planche`, kind: 'plank', x: bed.x, y: bed.y - 0.01, z: bed.z, flip: false, sprite: PLANK_SPRITE });
    // Le bocal de Léo reste près de lui, de jour comme de nuit ; Bulle y revient quand Poisson est écrit
    if (r.pet === 'puits') out.push(familiar(r, bed.x + 0.42, bed.y + 0.34, r.plank ? bed.z : 0, false, Math.floor(t * 0.7 + r.k) % 2));
    const pet = r.pet && r.pet !== 'puits' ? r.pet : null;
    // Un dormeur reste couché à sa place, jour et nuit, des « z » au-dessus de la tête (bible, § 6.7 et § 14) ; son
    // familier dort à côté de lui
    if (r.asleep) {
      const frame = Math.floor(t * 0.8 + r.k) % 2;
      const art = masterSprite(r.role, r.castaway, { pose: 'sleep', frame });
      out.push({
        id: r.id, kind: 'villager', role: r.role, x: bed.x, y: bed.y, z: lift, flip: false, pose: 'sleep',
        sprite: art ? [art.key, art.make] : [`${r.key}-sleep-${frame}`, () => villagerSprite(r.look, { pose: 'sleep', view: 'se', frame })]
      });
      if (pet) out.push(familiar(r, r.work.x + 0.34, r.work.y + 0.28, 0, false, 'rest'));
      continue;
    }
    // Qui nage encore vers notre plage (Lorena avant sa scène : game/stages.js, nage) : à sa case d'eau, épuisé (sa
    // marche triste ; à défaut, il fait signe) ; la houle le berce (draw/life.js l'enfonce jusqu'aux épaules)
    if (r.swim) {
      const tired = masterSprite(r.role, r.castaway, { pose: 'tired', frame: Math.floor(t * 3 + r.k) });
      const opts = { pose: 'wave', view: 'front', frame: Math.floor(t * 2.5 + r.k) % 2 };
      const art = tired || masterSprite(r.role, r.castaway, opts);
      out.push({
        id: r.id, kind: 'villager', role: r.role, x: r.work.x, y: r.work.y, z: Math.sin(t * 1.8 + r.k) * 1.2, flip: false, pose: 'wave', swim: true,
        sprite: art ? [art.key, art.make] : [`${r.key}-wave-front-${opts.frame}`, () => villagerSprite(r.look, opts)]
      });
      continue;
    }
    const evening = h >= phase.set + 0.4;
    // Un naufragé qui débarque : rien avant son arrivée ; sa marche depuis l'épave (de jour comme de nuit) ; puis son
    // agenda, qui repart de là où il s'est arrêté (aucun saut)
    const arrive = arrivals && arrivals.get(r.role);
    let p = null;
    let where = null;
    let m = null;
    if (arrive) {
      const since = t - arrive.at;
      if (since < 0) continue;
      const intro = introOf(r, arrive.from);
      if (since < intro.total) {
        p = onPlan(intro, since);
        seen(r, p);
        where = dt => onPlan(intro, Math.max(0, since - dt));
      }
    }
    if (!p) {
      const others = mates.filter(o => o !== r).map(o => o.role);
      m = momentOf(r, h, phase, { rain, calm, visit: r.master && !calm ? visitOf(r, day, others) : null, shown: r.role === wanted });
      // (un voyageur de passage n'a pas de lit sur l'île : la nuit, on ne le voit pas)
      if (m.mode === 'absent') continue;
      p = placeOf(r, m, t, day, doorOf);
      where = dt => peekOf(r, t - dt);
      if (m.mode === 'visite' && p.pose !== 'walk') {
        visiting.push({ from: r.role, to: m.visit.who, day, x: p.x, y: p.y });
        // (arrivé, il se tourne vers son camarade : de trois quarts, du côté de l'écran où il se tient)
        const mate = mates.find(o => o.role === m.visit.who);
        const there = mate && peekOf(mate, t);
        if (there) p = { ...p, view: 'se', toward: there.x - there.y < p.x - p.y };
      }
    }
    if (p.pose !== 'walk') standing.set(r.role, p);
    // La nuit, il dort couché à sa place, son familier à côté de lui (agenda.js : chez lui)
    if (p.pose === 'sleep') {
      const frame = Math.floor(t * 0.8 + r.k) % 2;
      const art = r.key.startsWith('vil-') ? masterSprite(r.role, r.castaway, { pose: 'sleep', frame }) : null;
      out.push({
        // (night : il dort sa nuit, on ne le « réveille » pas comme un naufragé endormi ; gestures.js)
        id: r.id, kind: 'villager', role: r.role, x: p.x, y: p.y, z: 0, flip: false, pose: 'sleep', night: true,
        sprite: art ? [art.key, art.make] : [`${r.key}-sleep-${frame}`, () => villagerSprite(r.look, { pose: 'sleep', view: 'se', frame })]
      });
      if (pet) out.push(familiar(r, p.x + 0.34, p.y + 0.28, 0, false, 'rest'));
      continue;
    }
    const lantern = evening && phase.lit > 0.35;
    // (à l'abri à sa porte, il n'a pas besoin de son parapluie)
    const umbrella = rain > 0.5 && !(m && m.mode === 'abri');
    // En marche, il regarde où il va (4 images) ; au travail, de trois quarts ; au repos, de face, de côté ou au loin,
    // selon le moment ; touché, il se tourne vers le joueur et fait coucou
    const walking = p.pose === 'walk';
    // (sur son annexe, il travaille avec le geste de son métier : CHORES, un par jour)
    const field = p.pose === 'field';
    const working = field || p.pose === 'work';
    const chores = field && CHORES[r.role];
    const chore = chores ? chores[(day + r.k) % chores.length] : null;
    const frame = walking ? Math.floor(t * 6) % 4 : working ? Math.floor(t * 1.6 + r.k) % 2 : (t + r.k * 1.3) % 5 < 0.18 ? 1 : 0;
    const hop = tapped(r.id, 0.6);
    const glance = IDLE_VIEWS[Math.floor(hash(r.k, Math.floor(t / 9)) * IDLE_VIEWS.length)];
    // (à son rituel, il regarde où il le tient : au loin, vers l'eau…)
    const view = hop !== null ? 'front' : walking ? (p.back ? 'ne' : 'se') : p.view || (working ? 'se' : glance);
    const opts = { pose: hop !== null ? 'wave' : working ? 'work' : p.pose, view, frame: hop !== null ? Math.floor(t * 5) % 2 : frame, lantern, umbrella, chore, tenue };
    // Un maître : son dessin de la bibliothèque (jamais en miroir de face ; la lanterne luit où il la tient)
    const art = r.key.startsWith('vil-') ? masterSprite(r.role, r.castaway, opts) : null;
    const flip = hop !== null || (art && art.view === 'face') ? false : walking ? p.flip : p.toward !== undefined ? p.toward : hash(r.k, Math.floor(t / 20)) < 0.5;
    out.push({
      id: r.id, kind: 'villager', role: r.role, x: p.x, y: p.y, z: hop === null ? 0 : Math.sin(hop * Math.PI) * 6, flip, pose: opts.pose,
      sprite: art ? [art.key, art.make] : [`${r.key}-${opts.pose}-${view}-${opts.frame}-${lantern ? 1 : 0}-${umbrella ? 1 : 0}`, () => villagerSprite(r.look, { ...opts, chore: undefined })]
    });
    if (art ? art.lantern : lantern) lights.push(art ? { x: p.x, y: p.y, dx: flip ? -art.lantern[0] : art.lantern[0], dy: art.lantern[1] } : { x: p.x, y: p.y, dx: flip ? 5.8 : -5.8, dy: -3 });
    if (pet) follow(r, pet, where, p, flip, t);
  }
  // Une rencontre : le visiteur arrivé, son hôte chez lui, tout près (agenda.js : la visite)
  for (const v of visiting) {
    const host = standing.get(v.to);
    if (host && Math.hypot(host.x - v.x, host.y - v.y) < 2.5) meets.push({ ...v, host: { x: host.x, y: host.y } });
  }
}
