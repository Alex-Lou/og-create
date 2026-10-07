// Les étapes de l'arrivée sur l'île (IslandLoader), dans le ton du jeu, d'après ce que l'île a déjà prêt (WorldView :
// loading) : { code, map, sol: [prêts, à l'écran], decor, batiments, vivants: [prêts, demandés] }. Un groupe absent
// d'une image comptée (aucun habitant à l'écran…) n'a rien à attendre.
const STEPS = [
  ['code', 'Le chemin s’ouvre'],
  ['map', 'La carte se déplie'],
  ['sol', 'Le sol se dessine'],
  ['decor', 'Le décor pousse'],
  ['batiments', 'Les bâtiments sortent de la brume'],
  ['vivants', 'Les habitants se réveillent']
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
