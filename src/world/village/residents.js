// Le village (world/village.js) : les habitants. Qui vit où (la troupe rencontrée, les visiteurs installés, le visiteur
// du moment), leurs tournées du jour et du soir, l'arrivée d'un naufragé, et ce qu'on dessine d'eux à chaque instant,
// leur familier compris.
import { villagerSprite, ROLES, SKINS, HAIRS } from '../villagers';
import { visitorLook } from '../visitors';
import { masterSprite } from '../masterArt';
import { FAMILIARS } from '../bestiary';
import { besideOf, nearestWalk, doorOf } from './paths';
import { hash, beast } from './beast';
import { coach } from '@/game/coach';

const SPEED = 0.8; // cases par seconde, à pied
const WORK_ORDER = ['potager', 'carriere', 'bosquet', 'puits', 'ponton', 'atelier'];
// Sans leur bâtiment, Aster (Ponton) et Rivet (Atelier) vivent au camp, près du Foyer (bible, § 6.6)
const CAMP = ['ponton', 'atelier'];
// Où regarde un habitant au repos (tiré toutes les 9 s) : souvent de côté, parfois vers le joueur ou au loin
const IDLE_VIEWS = ['se', 'se', 'front', 'ne'];
// Le geste de chaque maître sur son annexe (poses de travail de la bibliothèque), un par jour : Mélisse bêche, sème,
// arrose et récolte ; Sylve taille et scie ; Rivet scie ; Cannelle récolte et arrose ; Ondin arrose
const CHORES = { potager: ['becher', 'semer', 'arroser', 'recolter'], bosquet: ['tailler', 'scier'], atelier: ['scier'], foyer: ['recolter', 'arroser'], puits: ['arroser'] };
const CALM_REACH = 2;
const ARRIVE_SPEED = 1.5;
const ARRIVE_PAUSE = 12;

// Habitants : la troupe rencontrée (8 au plus). Son bâtiment bâti, chacun y travaille ; sans bâtiment, Aster et Rivet
// vivent au camp (la porte du Foyer), les dormeurs restent près de l'emplacement du leur (couchés, puis éveillés)
export function residentsOf({ grid, sites, built, doors, home, foyer, troupe, posts, settlers, visitor, annexes, bestiary }) {
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
      const work = swim ? { x: post.x, y: post.y } : post && post !== 'site' ? nearestWalk(grid, post) : who.built ? doors[id] : camp ? home : doorOf(grid, site);
      if (!work) continue;
      const k = residents.length;
      residents.push({
        id: `vil:${id}`, k, key: `vil-${k}`, role: id, site: camp && foyer ? foyer.name : site.name,
        camp, waiting: !who.built && !camp && !asleep, asleep, swim,
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
  return residents;
}

// Les tournées des habitants et l'arrivée d'un naufragé, gardées une fois tirées : { planOf, introOf }
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
  return { planOf, introOf };
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

// Les habitants à l'instant du dessin (f : t, h, rain, day, phase, tapped, out, lights), leur familier avec eux
export function drawResidents(f, { residents, planOf, introOf, arrivals, bestiary }) {
  const { t, h, rain, day, phase, tapped, out, lights } = f;
  // Celui que le coach montre (« île:habitant:<rôle> » : Rivet qui sort de la brume) ne se cache jamais, ni au lit ni
  // sous la pluie : sans lui, ni « ! », ni flèche, ni « Me montrer »
  const lesson = coach.state.lesson;
  const shown = lesson && lesson.steps.find(st => st.target && st.target.startsWith('île:habitant:'));
  const wanted = shown ? shown.target.slice('île:habitant:'.length) : null;
  // Un familier prêt à dessiner (le bocal d'Ondin : avec Bulle, ou vide)
  const familiar = (r, x, y, z, flip, frame, look = null) => {
    const pet = FAMILIARS[r.role];
    const variant = r.role === 'puits' ? (bestiary.bulle ? 'bulle' : '') : pet.variant || '';
    return beast(`fam:${r.role}`, pet.species, variant, x, y, z, flip, frame, look);
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
    // Qui nage encore vers notre plage (Aster avant sa scène : game/stages.js, nage) : à sa case d'eau, épuisé (sa
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
    // Un naufragé qui débarque : rien avant son arrivée ; sa marche depuis l'épave (de jour comme de nuit) ; puis sa
    // journée, reprise à son début (à sa place : aucun saut)
    const arrive = arrivals && arrivals.get(r.role);
    let plan;
    let tt = t;
    if (arrive) {
      const since = t - arrive.at;
      if (since < 0) continue;
      const intro = introOf(r, arrive.from);
      if (since < intro.total) {
        plan = intro;
        tt = since;
      } else {
        plan = planOf(r, evening, day);
        tt = since - intro.total - plan.offset;
      }
    }
    if (!plan || plan.legs.length > 1) {
      if (r.role !== wanted && (h < r.wake || h >= r.bed)) continue;
      if (r.role !== wanted && rain > 0.5 && r.k % 2 === 1) continue;
    }
    if (!plan) plan = planOf(r, evening, day);
    const p = onPlan(plan, tt);
    const lantern = evening && phase.lit > 0.35;
    const umbrella = rain > 0.5;
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
    const view = hop !== null ? 'front' : walking ? (p.back ? 'ne' : 'se') : working ? 'se' : glance;
    const opts = { pose: hop !== null ? 'wave' : working ? 'work' : p.pose, view, frame: hop !== null ? Math.floor(t * 5) % 2 : frame, lantern, umbrella, chore };
    // Un maître : son dessin de la bibliothèque (jamais en miroir de face ; la lanterne luit où il la tient)
    const art = r.key.startsWith('vil-') ? masterSprite(r.role, r.castaway, opts) : null;
    const flip = hop !== null || (art && art.view === 'face') ? false : walking ? p.flip : hash(r.k, Math.floor(t / 20)) < 0.5;
    out.push({
      id: r.id, kind: 'villager', role: r.role, x: p.x, y: p.y, z: hop === null ? 0 : Math.sin(hop * Math.PI) * 6, flip, pose: opts.pose,
      sprite: art ? [art.key, art.make] : [`${r.key}-${opts.pose}-${view}-${opts.frame}-${lantern ? 1 : 0}-${umbrella ? 1 : 0}`, () => villagerSprite(r.look, { ...opts, chore: undefined })]
    });
    if (art ? art.lantern : lantern) lights.push(art ? { x: p.x, y: p.y, dx: flip ? -art.lantern[0] : art.lantern[0], dy: art.lantern[1] } : { x: p.x, y: p.y, dx: flip ? 5.8 : -5.8, dy: -3 });
    if (pet) follow(r, pet, plan, p, flip, tt);
  }
}
