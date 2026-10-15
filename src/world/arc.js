// Les moments de l'arc du Phare sur l'île (lot 08 ; leurs déclencheurs : choix de l'auteur, 15 oct.), d'un état de l'île
// au suivant : une quête réclamée, un bâtiment qui atteint un palier, un quartier acheté. Seulement ce qui vient de se
// passer (un compte déjà plus loin ne rejoue rien). Pur.
import { ARC_LINES, FIRE_LINES } from '@/texts/world/phare';

const levelOf = (state, site) => ((state.sites || []).find(s => s.id === site) || {}).level || 0;
const owned = (state, zone) => Boolean(((state.map && state.map.zones) || []).find(z => z.id === zone && z.owned));

// [{ key, lines }] : ce que l'île dit, de prev (l'état d'avant) à next (celui qui arrive) ; [] au premier chargement
export function arcMomentsOf(prev, next, lines = ARC_LINES) {
  if (!prev || !next) return [];
  const out = [];
  const was = prev.brume && prev.brume.quest;
  const now = next.brume && next.brume.quest;
  if (was && was.done && (!now || now.id !== was.id) && lines.quests[was.id]) out.push({ key: `quete-${was.id}`, lines: lines.quests[was.id] });
  for (const [site, { level, lines: said }] of Object.entries(lines.levels)) {
    if (levelOf(prev, site) < level && levelOf(next, site) >= level) out.push({ key: `palier-${site}-${level}`, lines: said });
  }
  for (const [zone, said] of Object.entries(lines.zones)) {
    if (!owned(prev, zone) && owned(next, zone)) out.push({ key: `quartier-${zone}`, lines: said });
  }
  return out;
}

// Ce que dit un lieu au feu rallumé (FIRE_LINES), selon les actes finis (acts) : sa variante d'avant ou d'après l'acte
// qui la sépare (les Roselières, l'acte VII ; la Cascade des Brumes, l'acte VI) ; [] s'il ne dit rien
export function fireLinesOf(id, acts = [], lines = FIRE_LINES) {
  const entry = lines[id];
  if (!entry) return [];
  return Array.isArray(entry) ? entry : acts.includes(entry.act) ? entry.after : entry.before;
}

// Les scènes de l'arc qui attendent une veillée (le navire des parents de Pierrot : après la veillée VII)
const AFTER_VIGIL = { navire: 'VII' };
// La scène de l'arc à jouer maintenant : la première due (serveur : brume.scenes.due), pas encore jouée ici (played),
// dont la veillée attendue est vue (vigils) ; ou null
export function arcSceneOf(due, played, vigils) {
  return due.find(id => !played.includes(id) && (!AFTER_VIGIL[id] || vigils.includes(AFTER_VIGIL[id]))) || null;
}
