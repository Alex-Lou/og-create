// L'île se découvre peu à peu (choix de l'auteur, 9 oct. : « chaque espace se débloque progressivement ») : pour un
// compte qui suit l'histoire de Brume, un quartier qui n'est pas à soi reste sous la brume épaisse, sauf celui que vise
// la quête, et — passé le prologue — ceux qui touchent un quartier à soi et peuvent s'ouvrir maintenant (chapitre du
// Grimoire ouvert, ou expédition possible). Chaque achat ou chapitre ouvert en montre ainsi un ou deux de plus, jamais
// toute l'île d'un coup. Un compte d'avant la bible (tutorial faux), ou qui a passé le tutoriel, voit son île comme
// avant. Rien ne change aux règles : ce que le serveur permet reste permis, seule la brume se dessine autrement.

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
// Au tout premier tutoriel (Brume seule, avant qu'Aster n'arrive), seule cette plage se voit : le quadrilatère des
// cases 22 → 74 → 205 → 131 (choix de l'auteur, 10 oct.), tout le reste reste sous la brume
export const SHORE_QUAD = [[95, 98], [94, 91], [103, 91], [103, 98]];
export function inShore(x, y) {
  let inside = false;
  for (let i = 0, j = SHORE_QUAD.length - 1; i < SHORE_QUAD.length; j = i++) {
    const [xi, yi] = SHORE_QUAD[i];
    const [xj, yj] = SHORE_QUAD[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Le cœur de l'île se découvre lui aussi peu à peu, pendant le prologue d'un compte qui suit l'histoire (choix de
// l'auteur, 9 et 10 oct.) : tant que Brume est seule, la plage du débarquement ; puis, à mesure qu'ils arrivent, la zone
// de chacun (world/zones.js : un personnage à la fois, jamais tous mélangés), et un morceau autour de chaque camp et de
// chaque chantier qui se montre (une île d'avant les zones garde ses bâtiments aux places de la carte). Les cases du
// cœur encore sous la brume : Set de clés (y × n + x). state : la vue de l'île ; zoneOf(x, y) : la carte ; prologue :
// le tutoriel est en cours (WorldView : thickMist)
export function veiledCellsOf({ state, n, zoneOf, prologue, waiting = [] }) {
  const veiled = new Set();
  const brume = state && state.brume;
  if (!prologue || !brume || !brume.tutorial || brume.skipped) return veiled;
  // (celui qui attend dans les vagues n'est pas encore là : tant qu'il attend, rien ne se découvre que la plage ; sa zone
  // s'ouvre quand il débarque)
  const alone = Boolean(brume.quest && BRUME_QUESTS.includes(brume.quest.id)) || waiting.length > 0;
  const discs = [];
  const around = (thing, r) => discs.push({ x: thing.x + (thing.w || 1) / 2 - 0.5, y: thing.y + (thing.h || 1) / 2 - 0.5, r });
  for (const c of state.camp || []) if (c.id === 'hirondelle' || !alone) around(c, c.id === 'hirondelle' ? RADIUS.hirondelle : RADIUS.camp);
  for (const s of state.sites || []) if (!s.hidden && (s.id === 'foyer' || !alone)) around(s, RADIUS.site);
  // Les zones dont le personnage est là : un habitant (même endormi), ou son chantier qui se montre
  const here = new Set([...(state.villagers || []).map(v => v.id), ...(state.sites || []).filter(s => !s.hidden).map(s => s.id)]);
  const open = alone ? [] : ZONES.filter(z => here.has(z.site)).map(z => z.rect);
  const zones = state.map.zones;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const zone = zones[zoneOf(x, y)];
      if (!zone || zone.id !== 'coeur' || !zone.owned) continue;
      // Brume seule : seule la plage du débarquement se voit (le quadrilatère), le reste attend Aster
      if (alone) {
        if (!inShore(x, y)) veiled.add(y * n + x);
        continue;
      }
      if (inShore(x, y) || open.some(rect => inRect(x, y, rect))) continue;
      if (discs.some(d => (x - d.x) ** 2 + (y - d.y) ** 2 <= d.r * d.r)) continue;
      veiled.add(y * n + x);
    }
  }
  return veiled;
}
