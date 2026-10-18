// La marmite d’Agathe (choix de l'auteur, 13 oct. : B4, une scène à part comme la chasse aux poules ; refaite le
// 18 oct. : quatre gestes vivants, sans échec possible) : sa soupe du jour 3. Verser : le seau tenu au-dessus de la
// marmite, l'eau coule tant qu'on le tient, jusqu'au trait doré ; jeter : chaque ingrédient glissé dans la marmite y
// tombe ; touiller : des tours de doigt autour de son centre (trop vite, ça éclabousse : un effet, le tour compte quand
// même) ; servir : la louche plonge, se remplit, et tenue au-dessus du bol, elle y verse. Trois étoiles disent la
// justesse (l'eau au trait, sans éclabousser, sans en perdre une goutte), jamais un échec. Règles pures, sans dessin :
// CookingPot.vue les anime. L'aire de jeu se mesure en unités de sa largeur (x de 0 à 100 vers la droite, y de 0 à
// 125 vers le bas) ; le doigt qui touille, en rayons de la marmite autour de son centre.

// Les ingrédients qu'on jette, dans l'ordre de la planche (l'eau, elle, se verse d'abord)
export const ITEMS = ['coquillages', 'algues'];
// Les tours de louche avant de servir
export const TURNS = 3;
// L'eau monte de tant de la marmite par seconde de seau tenu ; le trait doré, de LINE.min à LINE.max (au-dessous, on
// verse encore ; au-delà, l'étoile s'en va) ; pleine, elle déborde
const POUR_RATE = 0.3;
export const LINE = { min: 0.68, max: 0.86 };
const FULL = 1;
// La louche verse dans le bol tant par seconde (une louche pleine remplit le bol) ; tant que le serveur n'a pas dit
// oui, le bol s'arrête juste avant le bord
const SERVE_RATE = 0.85;
const UNPAID_CAP = 0.9;
// La louche lâchée hors du bol avec plus que ce reste : elle se renverse
const SPILL_LEFT = 0.1;
// La bouche de la marmite, le bol (le seau et la louche s'y tiennent au-dessus) ; reach : la portée d'un lâcher
export const POT = { x: 58, y: 54, reach: 22 };
export const BOWL = { x: 80, y: 103 };
// Le doigt compte dans cet anneau autour du centre (en rayons de la marmite) ; au-delà de FAST tours par seconde, ça
// éclabousse, au plus une fois toutes les SPLASH_GAP s
const RING = { min: 0.2, max: 1.6 };
const FAST = 2.2;
const SPLASH_GAP = 0.7;
const TURN = 2 * Math.PI;

// Une marmite vide, au premier temps. level : l'eau (de 0 à 1) ; ladle : la louche (de 0 à 1) ; bowl : le bol (de 0 à
// 1) ; line, splashed, spilled : ce que disent les étoiles
export function potOf() {
  return { phase: 'verser', level: 0, overflowed: false, line: false, added: [], turns: 0, angle: 0, last: null, splashAt: -Infinity, splashed: false, ladle: 0, bowl: 0, spilled: false };
}

/* ---------- Verser ---------- */
// Le seau au-dessus de la marmite (b : son centre) ?
export const overPot = b => Math.abs(b.x - POT.x) <= 24 && b.y <= POT.y - 4 && b.y >= POT.y - 44;

// Le seau verse pendant dt secondes : { entered, overflow } (l'eau vient d'atteindre le trait ; elle déborde)
export function pour(pot, dt) {
  const none = { entered: false, overflow: false };
  if (pot.phase !== 'verser' || dt <= 0) return none;
  const before = pot.level;
  pot.level = Math.min(FULL, before + POUR_RATE * dt);
  const overflow = pot.level >= FULL;
  if (overflow) pot.overflowed = true;
  return { entered: before < LINE.min && pot.level >= LINE.min, overflow };
}

// Le seau reposé : assez d'eau, on passe aux ingrédients (l'étoile si l'eau est au trait, sans avoir débordé). Faux s'il
// en manque : on verse encore
export function setDown(pot) {
  if (pot.phase !== 'verser' || pot.level < LINE.min) return false;
  pot.line = pot.level <= LINE.max && !pot.overflowed;
  pot.phase = 'jeter';
  return true;
}

// Au clavier : l'eau juste au trait, d'un coup
export function pourAll(pot) {
  if (pot.phase !== 'verser') return false;
  pot.level = (LINE.min + LINE.max) / 2;
  return setDown(pot);
}

/* ---------- Jeter ---------- */
// Un ingrédient tombe dans la marmite ; le dernier ouvre le temps de touiller. Faux s'il y est déjà, ou pas ce temps-ci
export function addItem(pot, id) {
  if (pot.phase !== 'jeter' || !ITEMS.includes(id) || pot.added.includes(id)) return false;
  pot.added.push(id);
  if (pot.added.length === ITEMS.length) pot.phase = 'touiller';
  return true;
}

// Un ingrédient lâché en p tombe-t-il dans la marmite ?
export const inPot = p => Math.hypot(p.x - POT.x, p.y - POT.y) <= POT.reach;

/* ---------- Touiller ---------- */
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
  if (splash) {
    pot.splashAt = t;
    pot.splashed = true;
  }
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

/* ---------- Servir ---------- */
// La louche (l : le centre de son creux) au-dessus du bol ?
export const overBowl = l => Math.abs(l.x - BOWL.x) <= 15 && l.y <= BOWL.y + 2 && l.y >= BOWL.y - 30;

// La louche plonge dans la marmite : elle se remplit
export function dip(pot) {
  if (pot.phase !== 'servir') return false;
  pot.ladle = 1;
  return true;
}

// La louche verse dans le bol pendant dt secondes (paid : le serveur a dit oui ; sinon le bol s'arrête avant le bord).
// Vrai quand le bol est plein
export function fill(pot, dt, paid) {
  if (pot.phase !== 'servir' || dt <= 0) return false;
  const d = Math.max(0, Math.min(SERVE_RATE * dt, pot.ladle, (paid ? 1 : UNPAID_CAP) - pot.bowl));
  pot.ladle -= d;
  pot.bowl += d;
  return pot.bowl >= 1 - 1e-9;
}

// La louche lâchée : au-dessus du bol, elle retourne à la marmite avec ce qui lui reste ; ailleurs, pleine, elle se
// renverse (l'étoile s'en va). Vrai si elle s'est renversée
export function letGo(pot, onBowl) {
  if (pot.phase !== 'servir') return false;
  const spilt = !onBowl && pot.ladle > SPILL_LEFT;
  if (spilt) pot.spilled = true;
  pot.ladle = 0;
  return spilt;
}

// La soupe est servie : le bol plein, payé au serveur
export function serve(pot) {
  if (pot.phase !== 'servir' || pot.bowl < 1 - 1e-9) return false;
  pot.phase = 'fin';
  return true;
}

// Ce que disent les trois étoiles : l'eau au trait, touillé sans éclabousser, servi sans en perdre une goutte
export const starsOf = pot => ({ line: pot.line, gentle: !pot.splashed, clean: !pot.spilled });
