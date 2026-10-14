// Les étapes de l'arrivée sur l'île (IslandLoader), dans le ton du jeu, d'après ce que l'île a déjà prêt (WorldView :
// loading) : { code, map, sol: [prêts, à l'écran], decor, batiments, vivants: [prêts, demandés] }. Un groupe absent
// d'une image comptée (aucun habitant à l'écran…) n'a rien à attendre. Les textes : texts/game/loading.js.
import { LOADING_STEPS as T } from '@/texts/game/loading';

const STEPS = [
  ['code', T.code],
  ['map', T.map],
  ['sol', T.sol],
  ['decor', T.decor],
  ['batiments', T.batiments],
  ['vivants', T.vivants]
];

// [{ id, label, count: [prêts, en tout] ou null, done }]
export function islandSteps(progress = {}) {
  const counted = Array.isArray(progress.sol);
  return STEPS.map(([id, label]) => {
    const value = progress[id];
    const count = Array.isArray(value) ? value : null;
    const done = count ? count[0] >= count[1] : Boolean(value) || (counted && value === undefined && id !== 'code' && id !== 'map');
    return { id, label, count, done };
  });
}

// Part du chemin faite, de 0 à 1 : chaque étape compte autant ; une étape comptée, au prorata
export function islandShare(progress = {}) {
  const steps = islandSteps(progress);
  const part = step => (step.done ? 1 : step.count && step.count[1] ? step.count[0] / step.count[1] : 0);
  return steps.reduce((sum, step) => sum + part(step), 0) / steps.length;
}
