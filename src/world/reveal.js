// L'île se découvre peu à peu (choix de l'auteur, 9 oct. : « chaque espace se débloque progressivement ») : pour un
// compte qui suit l'histoire de Brume, un quartier qui n'est pas à soi reste sous la brume épaisse, sauf celui que vise
// la quête, et — passé le prologue — ceux qui touchent un quartier à soi et peuvent s'ouvrir maintenant (chapitre du
// Grimoire ouvert, ou expédition possible). Chaque achat ou chapitre ouvert en montre ainsi un ou deux de plus, jamais
// toute l'île d'un coup. Qui a passé le tutoriel (ou sans état de Brume) voit son île entière. Rien ne change aux
// règles : ce que le serveur permet reste permis, seule la brume se dessine autrement.

import { ZONES, inRect } from './zones';

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
// La bande libre entre deux zones ouvertes (là où passent les chemins qui les relient, choix de l'auteur, 11 oct.) :
// une case à BAND cases au plus de deux d'entre elles se découvre (les zones sont proches : deux cases suffisent)
const BAND = 2;
// L'anse se découvre jusqu'à une case à l'ouest du camp d'Aster, pas au-delà (choix de l'auteur, 11 oct. : la brume
// se rapproche de son Ponton)
const COVE_WEST = 89;
const gapTo = (x, y, [rx, ry, w, h]) => Math.max(rx - x, 0, x - (rx + w - 1), ry - y, y - (ry + h - 1));
// Au tout premier tutoriel (Brume seule, avant qu'Aster n'arrive), seule cette plage se voit : un carré parfait de
// 9 × 9 cases autour du feu, de l'épave et des trouvailles (choix de l'auteur, 12 oct.), tout le reste reste sous la
// brume, même le sable de l'anse
export const SHORE = [94, 90, 9, 9];
export const inShore = (x, y) => inRect(x, y, SHORE);

// Tout le sable de l'anse du débarquement (choix de l'auteur, 11 oct. : le joueur y est en tout premier, elle n'a pas
// de brume) : le sable du cœur relié, case à case, à celui de la plage ; l'herbe et l'intérieur des terres restent à
// découvrir. groundOf(x, y) : le sol de la carte ('s', 'd' : le sable). Set de clés (y × n + x)
function coveOf({ n, zoneOf, zones, groundOf }) {
  const cove = new Set();
  if (!groundOf) return cove;
  const sandy = (x, y) => x >= COVE_WEST && y >= 0 && x < n && y < n && ['s', 'd'].includes(groundOf(x, y)) && zones[zoneOf(x, y)] && zones[zoneOf(x, y)].id === 'coeur';
  const todo = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (inShore(x, y) && sandy(x, y)) todo.push([x, y]);
  while (todo.length) {
    const [x, y] = todo.pop();
    const key = y * n + x;
    if (cove.has(key)) continue;
    cove.add(key);
    for (const [a, b] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) if (sandy(a, b) && !cove.has(b * n + a)) todo.push([a, b]);
  }
  return cove;
}

// Le cœur de l'île se découvre lui aussi peu à peu, pendant le prologue d'un compte qui suit l'histoire (choix de
// l'auteur, 9 et 10 oct.) : tant que Brume est seule, la plage du débarquement ; puis, à mesure qu'ils arrivent, la zone
// de chacun (world/zones.js : un personnage à la fois, jamais tous mélangés), la bande libre entre deux zones ouvertes
// (BAND), et un morceau autour de chaque camp et de chaque chantier qui se montre (une île d'avant les zones garde ses bâtiments aux places de la carte). Les cases du
// cœur encore sous la brume : Set de clés (y × n + x). state : la vue de l'île ; zoneOf(x, y) : la carte ; prologue :
// le tutoriel est en cours (WorldView : thickMist) ; groundOf(x, y) : le sol de la carte (l'anse, coveOf)
export function veiledCellsOf({ state, n, zoneOf, prologue, waiting = [], groundOf = null }) {
  const veiled = new Set();
  const brume = state && state.brume;
  if (!prologue || !brume || !brume.tutorial || brume.skipped) return veiled;
  // (Brume seule : rien ne se découvre que la plage. Qui n'a pas encore paru, ou pas encore choisi son camp (waiting) :
  // sa zone reste sous la brume, celles des autres non ; elle s'ouvre quand il s'y installe)
  const alone = Boolean(brume.quest && BRUME_QUESTS.includes(brume.quest.id));
  const away = new Set(waiting);
  // Un morceau autour de ce qui n'est dans aucune zone (une île d'avant les zones garde ses bâtiments aux places de la
  // carte) ; dans une zone, la zone suffit
  const discs = [];
  const around = (thing, r) => {
    const x = thing.x + (thing.w || 1) / 2 - 0.5;
    const y = thing.y + (thing.h || 1) / 2 - 0.5;
    if (!ZONES.some(z => inRect(Math.round(x), Math.round(y), z.rect))) discs.push({ x, y, r });
  };
  for (const c of state.camp || []) if (c.id === 'hirondelle' || !alone) around(c, c.id === 'hirondelle' ? RADIUS.hirondelle : RADIUS.camp);
  for (const s of state.sites || []) if (!s.hidden && !away.has(s.id) && (s.id === 'foyer' || !alone)) around(s, RADIUS.site);
  // Les zones dont le personnage est là : un habitant (même endormi), ou son chantier qui se montre ; la plage, dès que
  // Brume n'est plus seule. Une zone taillée dans la plage reste sous la brume tant que la sienne est fermée (ouverte,
  // la plage la contient : elle ne compte pas à part)
  const here = new Set([...(state.villagers || []).map(v => v.id), ...(state.sites || []).filter(s => !s.hidden).map(s => s.id)]
    .filter(id => !away.has(id)));
  const opens = z => !alone && (z.beach || here.has(z.who || z.site));
  const open = ZONES.filter(z => !z.carved && opens(z)).map(z => z.rect);
  const carved = ZONES.filter(z => z.carved && !opens(z)).map(z => z.rect);
  const zones = state.map.zones;
  const cove = coveOf({ n, zoneOf, zones, groundOf });
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const zone = zones[zoneOf(x, y)];
      if (!zone || zone.id !== 'coeur' || !zone.owned) continue;
      // Brume seule : seul le carré de la plage du débarquement se voit, le reste attend Aster
      if (alone) {
        if (!inShore(x, y)) veiled.add(y * n + x);
        continue;
      }
      if (carved.some(rect => inRect(x, y, rect))) {
        veiled.add(y * n + x);
        continue;
      }
      if (cove.has(y * n + x)) continue;
      if (inShore(x, y) || open.some(rect => inRect(x, y, rect))) continue;
      if (open.filter(rect => gapTo(x, y, rect) <= BAND).length >= 2) continue;
      if (discs.some(d => (x - d.x) ** 2 + (y - d.y) ** 2 <= d.r * d.r)) continue;
      veiled.add(y * n + x);
    }
  }
  return veiled;
}
