// La marmite de Cannelle (choix de l'auteur, 13 oct. : B4, une scène à part comme la chasse aux poules) : sa soupe du
// jour 3, en trois temps et sans échec possible. Mettre : chaque ingrédient glissé dans la marmite y tombe ; touiller :
// des tours de doigt autour de son centre (trop vite, ça éclabousse : un effet, le tour compte quand même) ; servir : la
// louche glissée jusqu'au bol. Règles pures, sans dessin : CookingPot.vue les anime. Coordonnées de l'aire de jeu en pour
// cent (x vers la droite, y vers le bas) ; le doigt qui touille, en rayons de la marmite autour de son centre.

// Les ingrédients, dans l'ordre de la planche
export const ITEMS = ['coquillages', 'algues', 'eau'];
// Les tours de louche avant de servir
export const TURNS = 3;
// La marmite et le bol dans l'aire de jeu (le bol ne paraît qu'au service) ; reach : la portée d'un lâcher (%)
export const POT = { x: 56, y: 50, reach: 24 };
export const BOWL = { x: 80, y: 84, reach: 16 };
// Le doigt compte dans cet anneau autour du centre (en rayons de la marmite) ; au-delà de FAST tours par seconde, ça
// éclabousse, au plus une fois toutes les SPLASH_GAP s
const RING = { min: 0.2, max: 1.6 };
const FAST = 2.2;
const SPLASH_GAP = 0.7;
const TURN = 2 * Math.PI;

const near = (p, at) => Math.hypot(p.x - at.x, p.y - at.y) <= at.reach;

// Une marmite vide, au premier temps
export function potOf() {
  return { phase: 'mettre', added: [], turns: 0, angle: 0, last: null, splashAt: -Infinity };
}

// Un ingrédient tombe dans la marmite ; le dernier ouvre le temps de touiller. Faux s'il y est déjà, ou pas ce temps-ci
export function addItem(pot, id) {
  if (pot.phase !== 'mettre' || !ITEMS.includes(id) || pot.added.includes(id)) return false;
  pot.added.push(id);
  if (pot.added.length === ITEMS.length) pot.phase = 'touiller';
  return true;
}

// Un ingrédient lâché en p tombe-t-il dans la marmite ?
export const inPot = p => near(p, POT);

// Le doigt touille : p, sa place autour du centre (en rayons) ; t, l'instant (s). Les tours se comptent dans un sens ou
// dans l'autre (un retour en arrière les défait) ; le dernier ouvre le service. { turned, splash } : un tour de plus,
// une éclaboussure
export function stir(pot, p, t) {
  const none = { turned: false, splash: false };
  if (pot.phase !== 'touiller') return none;
  const r = Math.hypot(p.x, p.y);
  if (r < RING.min || r > RING.max) {
    pot.last = null;
    return none;
  }
  const a = Math.atan2(p.y, p.x);
  const last = pot.last;
  pot.last = { a, t };
  if (!last) return none;
  // (le plus court chemin d'un angle à l'autre)
  let d = a - last.a;
  if (d > Math.PI) d -= TURN;
  if (d < -Math.PI) d += TURN;
  pot.angle += d;
  const dt = t - last.t;
  const splash = dt > 0 && Math.abs(d) / TURN / dt > FAST && t - pot.splashAt >= SPLASH_GAP;
  if (splash) pot.splashAt = t;
  const turns = Math.min(TURNS, Math.floor(Math.abs(pot.angle) / TURN));
  const turned = turns > pot.turns;
  pot.turns = Math.max(pot.turns, turns);
  if (pot.turns >= TURNS) pot.phase = 'servir';
  return { turned, splash };
}

// Le doigt se lève : le prochain toucher repart de sa place
export function lift(pot) {
  pot.last = null;
}

// Un tour entier d'un coup (au clavier, sans glisser)
export function stirOnce(pot) {
  if (pot.phase !== 'touiller') return false;
  pot.turns++;
  pot.angle = pot.turns * TURN;
  if (pot.turns >= TURNS) pot.phase = 'servir';
  return true;
}

// La louche lâchée en p atteint-elle le bol ?
export const inBowl = p => near(p, BOWL);

// La soupe est servie (le serveur l'a payée)
export function serve(pot) {
  if (pot.phase !== 'servir') return false;
  pot.phase = 'fin';
  return true;
}
