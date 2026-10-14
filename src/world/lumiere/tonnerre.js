// Le tonnerre : après un coup de foudre (eclairs.js, jamais après un éclair de chaleur lointain), le grondement arrive
// avec un peu de retard et fait trembler l'île doucement, puis s'éteint. Tout se déduit du temps, comme l'éclair.
import { hash } from '../scene';
import { coupOf, cycleOf, LEADER } from './eclairs';

const RETARD = 0.35; // secondes après le coup de retour, au moins (plus loin, plus tard : jusqu'à 0,9 s de plus)
const MONTEE = 0.06;
const TENUE = 0.45; // la secousse retombe en exp(-u / TENUE)
const DUREE = 1.6;
const NONE = { x: 0, y: 0 };

// Le décalage de l'île (en px d'écran) à l'instant t : { x, y }, nul hors d'un grondement ou sans orage. Le coup du
// cycle précédent peut encore gronder au début du suivant
export function tonnerreAt(t, storm) {
  if (storm < 0.5) return NONE;
  const now = cycleOf(t);
  for (const cycle of [now, now - 1]) {
    const coup = coupOf(cycle);
    if (coup.lointain) continue;
    const u = t - coup.start - LEADER - RETARD - hash(cycle, 17) * 0.9;
    if (u < 0 || u > DUREE) continue;
    const a = (1.4 + hash(cycle, 19) * 1.2) * storm * Math.min(1, u / MONTEE) * Math.exp(-u / TENUE);
    return { x: a * (0.6 * Math.sin(u * 37) + 0.4 * Math.sin(u * 23 + 1)), y: a * 0.5 * Math.sin(u * 29 + 2) };
  }
  return NONE;
}
