// L'île se découvre peu à peu (choix de l'auteur, 9 oct. : « chaque espace se débloque progressivement ») : pour un
// compte qui suit l'histoire de Brume, un quartier qui n'est pas à soi reste sous la brume épaisse, sauf celui que vise
// la quête, et — passé le prologue — ceux qui touchent un quartier à soi et peuvent s'ouvrir maintenant (chapitre du
// Grimoire ouvert, ou expédition possible). Chaque achat ou chapitre ouvert en montre ainsi un ou deux de plus, jamais
// toute l'île d'un coup. Un compte d'avant la bible (tutorial faux), ou qui a passé le tutoriel, voit son île comme
// avant. Rien ne change aux règles : ce que le serveur permet reste permis, seule la brume se dessine autrement.

// Les quartiers qui se touchent (par un côté de case), d'après la grille de l'île : Map(index → Set(index)).
// zoneOf(x, y) : l'index du quartier d'une case, ou -1 (la mer)
export function neighborsOf(zoneOf, n) {
  const out = new Map();
  const link = (a, b) => {
    if (a < 0 || b < 0 || a === b) return;
    if (!out.has(a)) out.set(a, new Set());
    if (!out.has(b)) out.set(b, new Set());
    out.get(a).add(b);
    out.get(b).add(a);
  };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const here = zoneOf(x, y);
      if (here < 0) continue;
      link(here, zoneOf(x + 1, y));
      link(here, zoneOf(x, y + 1));
    }
  }
  return out;
}

// Le quartier reste-t-il sous la brume épaisse ? zone : celui de la vue de l'île ; brume : state.brume ; prologue : le
// tutoriel est en cours (WorldView : thickMist) ; touchesOwned : il touche un quartier à soi
export function zoneThick({ zone, brume, prologue, touchesOwned }) {
  if (!zone || zone.owned) return false;
  if (!brume || !brume.tutorial || brume.skipped) return false;
  const target = brume.quest && brume.quest.target;
  if (target && target.zone === zone.id) return false;
  if (prologue) return true;
  const ready = zone.known === false ? Boolean(zone.explorable) : Boolean(zone.open);
  return !(ready && touchesOwned);
}

// Les quêtes où Brume est seule avec le joueur (serveur : quests.js) : la plage seule se voit
export const BRUME_QUESTS = ['pages', 'ramasser', 'feu'];
const RADIUS = { hirondelle: 3, camp: 4, site: 3 };

// Le cœur de l'île se découvre lui aussi peu à peu, pendant le prologue d'un compte qui suit l'histoire (choix de
// l'auteur, 9 oct.) : tant que Brume est seule, la plage (le sable), l'épave et le Feu ; puis, à mesure qu'ils
// arrivent, un morceau autour du camp de chacun et de chaque chantier qui se montre. Les cases du cœur encore sous la
// brume : Set de clés (y × n + x). state : la vue de l'île ; zoneOf(x, y), groundOf(x, y) : la carte ; prologue : le
// tutoriel est en cours (WorldView : thickMist)
export function veiledCellsOf({ state, n, zoneOf, groundOf, prologue }) {
  const veiled = new Set();
  const brume = state && state.brume;
  if (!prologue || !brume || !brume.tutorial || brume.skipped) return veiled;
  const alone = Boolean(brume.quest && BRUME_QUESTS.includes(brume.quest.id));
  const discs = [];
  const around = (thing, r) => discs.push({ x: thing.x + (thing.w || 1) / 2 - 0.5, y: thing.y + (thing.h || 1) / 2 - 0.5, r });
  for (const c of state.camp || []) if (c.id === 'hirondelle' || !alone) around(c, c.id === 'hirondelle' ? RADIUS.hirondelle : RADIUS.camp);
  for (const s of state.sites || []) if (!s.hidden && (s.id === 'foyer' || !alone)) around(s, RADIUS.site);
  const zones = state.map.zones;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const zone = zones[zoneOf(x, y)];
      if (!zone || zone.id !== 'coeur' || !zone.owned || groundOf(x, y) === 's') continue;
      if (discs.some(d => (x - d.x) ** 2 + (y - d.y) ** 2 <= d.r * d.r)) continue;
      veiled.add(y * n + x);
    }
  }
  return veiled;
}
