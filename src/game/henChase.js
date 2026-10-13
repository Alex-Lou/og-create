// La chasse aux poules (choix de l'auteur, 13 oct. : une scène à part, le grain et le bon moment) : les poules de
// Cannelle trottent sans s'arrêter ; un toucher au sable lance du grain, celles qui le voient y courent et picorent ; une
// poule qui picore se laisse prendre, une poule touchée en pleine course s'esquive en caquetant. Chacune son caractère :
// Paprika rapide, Brioche gourmande, Madame méfiante (elle zigzague et hésite avant le grain). Règles pures, sans
// dessin : HenChase.vue les anime. Coordonnées en pour cent de l'enclos (x vers la droite, y vers le bas).

// Le caractère de chaque poule : vitesse (%/s), durée d'un picorage (s), portée du regard vers le grain (%), hésitation
// avant d'y aller (s), zigzag (amplitude, %)
export const NATURES = {
  'poule-rousse': { speed: 40, peck: 1.2, sight: 60, doubt: 0, zigzag: 0 },
  'poule-blanche': { speed: 24, peck: 2.2, sight: 100, doubt: 0, zigzag: 0 },
  'poule-noire': { speed: 30, peck: 1.5, sight: 60, doubt: 0.6, zigzag: 6 }
};
// L'enclos où elles trottent (la cage, en haut à droite, n'en fait pas partie)
const AREA = { x0: 8, x1: 92, y0: 30, y1: 92 };
export const CAGE = { x: 80, y: 18 };
// Une esquive : sa durée (s), sa vitesse (× la sienne)
const FLEE = { s: 0.8, k: 2.2 };
// Le grain : grains par poignée, durée de vie (s), poignées à la fois
const GRAIN = { amount: 3, life: 7, max: 3 };
// La prise : la joie (s), puis le saut jusqu'à la cage (s)
export const CATCH = { joy: 0.6, hop: 0.9 };
// Trois esquives de suite : elle picore plus longtemps (le jeu ne laisse personne coincé)
const PATIENCE = { misses: 3, k: 1.5 };

const clampTo = (v, a, b) => Math.min(b, Math.max(a, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Une partie : ses poules (ids : 'poule-rousse'…), placées en ligne au départ. rand : [0, 1)
export function chaseOf(ids, rand = Math.random) {
  const hens = ids.filter(id => NATURES[id]).map((id, i, all) => ({
    id, x: 20 + (60 * (i + 0.5)) / all.length, y: 60 + 10 * (i % 2), state: 'trot', t: 0, facing: 1, misses: 0,
    goal: null, grain: null, age: rand() * 3
  }));
  const chase = { hens, grains: [], rand, caught: [], time: 0 };
  hens.forEach(hen => wander(chase, hen));
  return chase;
}

// Un but au hasard dans l'enclos
function wander(chase, hen) {
  const r = chase.rand;
  hen.goal = { x: AREA.x0 + r() * (AREA.x1 - AREA.x0), y: AREA.y0 + r() * (AREA.y1 - AREA.y0) };
  hen.grain = null;
}

// Un pas de dt secondes : chaque poule va vers son but (ou s'arrête et picore), le grain vieillit
export function stepChase(chase, dt) {
  chase.time += dt;
  chase.grains = chase.grains.filter(g => g.amount > 0 && chase.time - g.born < GRAIN.life);
  for (const hen of chase.hens) {
    const nature = NATURES[hen.id];
    hen.t += dt;
    hen.age += dt;
    if (hen.state === 'caught') {
      if (hen.t >= CATCH.joy + CATCH.hop) hen.state = 'home';
      continue;
    }
    if (hen.state === 'home') continue;
    if (hen.state === 'peck') {
      if (hen.t >= nature.peck * (hen.misses >= PATIENCE.misses ? PATIENCE.k : 1)) {
        if (hen.grain) hen.grain.amount--;
        hen.state = 'trot';
        hen.t = 0;
        wander(chase, hen);
      }
      continue;
    }
    if (hen.state === 'doubt') {
      if (hen.t >= nature.doubt) Object.assign(hen, { state: 'trot', t: 0 });
      continue;
    }
    if (hen.state === 'flee' && hen.t >= FLEE.s) {
      Object.assign(hen, { state: 'trot', t: 0 });
      wander(chase, hen);
    }
    // (le grain qu'elle visait a disparu : elle repart au hasard)
    if (hen.grain && !chase.grains.includes(hen.grain)) wander(chase, hen);
    const speed = nature.speed * (hen.state === 'flee' ? FLEE.k : 1);
    const dx = hen.goal.x - hen.x;
    const dy = hen.goal.y - hen.y;
    const d = Math.hypot(dx, dy);
    if (d < 1.5) {
      if (hen.grain) Object.assign(hen, { state: 'peck', t: 0 });
      else wander(chase, hen);
      continue;
    }
    const k = Math.min(1, (speed * dt) / d);
    // (Madame zigzague : un pas de côté qui va et vient)
    const side = nature.zigzag && hen.state !== 'flee' ? Math.sin(hen.age * 5) * nature.zigzag * dt : 0;
    hen.x = clampTo(hen.x + dx * k + (-dy / d) * side, AREA.x0, AREA.x1);
    hen.y = clampTo(hen.y + dy * k + (dx / d) * side, AREA.y0, AREA.y1);
    if (Math.abs(dx) > 0.5) hen.facing = dx > 0 ? 1 : -1;
  }
}

// Du grain lancé au point touché : les poules qui le voient y courent (Madame hésite d'abord). Faux si l'enclos en a déjà
// assez (ou si le point est hors de l'enclos)
export function throwGrain(chase, at) {
  if (at.x < AREA.x0 || at.x > AREA.x1 || at.y < AREA.y0 || at.y > AREA.y1) return false;
  if (chase.grains.length >= GRAIN.max) return false;
  const grain = { x: at.x, y: at.y, amount: GRAIN.amount, born: chase.time };
  chase.grains.push(grain);
  for (const hen of chase.hens) {
    if (!['trot', 'flee'].includes(hen.state) || hen.grain) continue;
    const nature = NATURES[hen.id];
    if (dist(hen, grain) > nature.sight) continue;
    hen.goal = { x: grain.x, y: grain.y };
    hen.grain = grain;
    if (nature.doubt && hen.state === 'trot') Object.assign(hen, { state: 'doubt', t: 0 });
  }
  return true;
}

// Toucher une poule : celle qui picore est prise ('caught') ; les autres s'esquivent loin du doigt ('dodge'). null si
// elle n'est plus là
export function tapHen(chase, id, at = null) {
  const hen = chase.hens.find(h => h.id === id);
  if (!hen || ['caught', 'home'].includes(hen.state)) return null;
  if (hen.state === 'peck') {
    Object.assign(hen, { state: 'caught', t: 0, grain: null, from: { x: hen.x, y: hen.y } });
    chase.caught.push(id);
    return 'caught';
  }
  const from = at || { x: hen.x, y: hen.y + 1 };
  const away = Math.hypot(hen.x - from.x, hen.y - from.y) || 1;
  hen.misses++;
  hen.goal = {
    x: clampTo(hen.x + ((hen.x - from.x) / away) * 25, AREA.x0, AREA.x1),
    y: clampTo(hen.y + ((hen.y - from.y) / away) * 25, AREA.y0, AREA.y1)
  };
  Object.assign(hen, { state: 'flee', t: 0, grain: null });
  return 'dodge';
}

// Où se tient une poule prise : elle saute de joie, puis bondit jusqu'à la cage (en arc)
export function caughtAt(hen) {
  const k = clampTo((hen.t - CATCH.joy) / CATCH.hop, 0, 1);
  return { x: hen.from.x + (CAGE.x - hen.from.x) * k, y: hen.from.y + (CAGE.y - hen.from.y) * k - Math.sin(k * Math.PI) * 18, k };
}

// Toutes rentrées dans la cage
export const chaseDone = chase => chase.hens.every(h => h.state === 'home');
