// Le suivi des quêtes (Hud/QuestTracker) : la quête principale de Brume (le tutoriel tant qu'il dure) et ce qui attend
// le joueur ailleurs sur l'île, pour qu'il ne soit jamais perdu. Rien n'est inventé ici : tout se lit dans la vue de l'île
// (serveur) et dans les règles déjà connues du jeu (besoins, voyageurs, coffres, bâtiments).
import { missingOf, affordable } from './needs';
import { readyOf } from './visitors';
import { inPrologue } from '@/game/prologue';

// Au plus tant de choses « à faire aussi » à la fois (le reste se compte)
export const MAX_TODO = 4;

const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

// La quête principale : { id, tag, tutorial, label, have, need, done, coins }, l'île apaisée ({ rested }), ou null
export function mainOf(brume) {
  if (!brume) return null;
  const quest = brume.quest;
  if (!quest) return brume.rested ? { id: 'rested', tag: 'Île apaisée', label: brume.rested, rested: true, done: false } : null;
  const tutorial = Boolean(brume.tutorial && !brume.skipped && inPrologue(quest.id));
  return {
    id: quest.id,
    tag: tutorial || quest.act === 'T' ? 'Tutoriel' : `Acte ${quest.act}`,
    tutorial,
    label: quest.label,
    have: quest.have,
    need: quest.need,
    done: Boolean(quest.done),
    coins: quest.coins || 0
  };
}

// Ce qui attend ailleurs (rien pendant le tutoriel : une chose à la fois, WorldView : trackerAll), du plus pressant au
// moins pressant : [{ id, kind, arg, text }]. kind dit au WorldView quoi
// ouvrir (trackerGo) : site, build, villager, visitor, beast, chests, craft, landmark, finds
// ctx : { state (vue de l'île), stock (ce qui se dépense, production comprise), chests (coffres à ouvrir),
// landmarks (lieux à découvrir : [{ id }]), deposits (gisements prêts), buildable (bâtiments qui peuvent grandir) }
export function todoOf({ state, stock = {}, chests = 0, landmarks = [], deposits = 0, buildable = [] } = {}) {
  if (!state) return [];
  const out = [];
  const siteName = id => ((state.sites || []).find(s => s.id === id) || {}).name || 'un bâtiment';
  // Une nuit a laissé un bâtiment en panne
  const blight = state.nights && state.nights.blight;
  if (blight) out.push({ id: `panne:${blight.site}`, kind: 'site', arg: blight.site, text: `Répare ${siteName(blight.site)}` });
  // Un habitant attend : un besoin qui manque et que le stock peut combler (un dormeur se réveille par sa quête, au
  // moment voulu par l'histoire : il n'est pas proposé ici)
  for (const v of state.villagers || []) {
    if (v.asleep) continue;
    const missing = missingOf(v).filter(n => !n.cost || affordable(n, stock));
    if (missing.length) out.push({ id: `besoin:${v.id}`, kind: 'villager', arg: v.id, text: missing.some(n => n.id === 'manger') ? `${v.name} a faim` : `${v.name} a besoin de toi` });
  }
  // Un voyageur : sa demande peut être comblée, ou il peut s'installer
  const visitor = state.visitor;
  if (visitor) {
    const houses = state.houses || { total: 0, used: 0 };
    if (readyOf(visitor, stock)) out.push({ id: 'voyageur', kind: 'visitor', text: `${visitor.name} attend sa demande` });
    else if (visitor.satisfied && houses.total > houses.used) out.push({ id: 'voyageur', kind: 'visitor', text: `${visitor.name} peut s’installer` });
  }
  // Les bêtes : à nourrir, ou ce qu'elles ont donné
  const beasts = (state.beasts && state.beasts.list) || [];
  const hungry = beasts.filter(b => !b.fed);
  if (hungry.length) out.push({ id: 'betes:faim', kind: 'beast', arg: hungry[0].id, text: hungry.length > 1 ? plural(hungry.length, 'bête a faim', 'bêtes ont faim') : `${hungry[0].name} a faim` });
  const given = beasts.filter(b => b.ready > 0);
  if (given.length) out.push({ id: 'betes:dons', kind: 'beast', arg: given[0].id, text: 'Tes bêtes ont quelque chose pour toi' });
  if (chests > 0) out.push({ id: 'coffres', kind: 'chests', text: plural(chests, 'coffre à ouvrir', 'coffres à ouvrir') });
  for (const site of buildable) out.push({ id: `grandir:${site.id}`, kind: 'build', arg: site.id, text: `${site.name} peut grandir` });
  // Une création fabriquée qui attend sa place
  const waiting = ((state.crafts && state.crafts.catalog) || []).filter(c => c.reserve > 0 && (c.spots || []).length);
  if (waiting.length) out.push({ id: `poser:${waiting[0].id}`, kind: 'craft', arg: waiting[0].id, text: `Pose : ${waiting[0].name}` });
  if (landmarks.length) out.push({ id: 'lieux', kind: 'landmark', arg: landmarks[0].id, text: plural(landmarks.length, 'lieu à découvrir', 'lieux à découvrir') });
  if (deposits > 0) out.push({ id: 'gisements', kind: 'finds', text: plural(deposits, 'gisement prêt', 'gisements prêts') });
  return out;
}
