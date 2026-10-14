// La piste des niveaux d'une saison, pour le choix du niveau (LevelPicker) : ses 10 cases (étoiles, ouverte ou non, la
// case choisie), et ce qui manque pour ouvrir la saison suivante. Ne fait que lire les règles de game/levels.js.
import { PER_SEASON, SEASONS, SEASON_STARS, openOf, seasonOf } from './levels';

// stages : les étoiles des 30 niveaux (vue du serveur) ; n : le niveau choisi
export function trackOf(stages = [], n = 1) {
  const open = openOf(stages);
  const season = seasonOf(n);
  const first = (season - 1) * PER_SEASON + 1;
  const pips = Array.from({ length: PER_SEASON }, (_, i) => {
    const level = first + i;
    return { level, stars: stages[level - 1] || 0, open: level <= open.max, current: level === n };
  });
  const have = pips.reduce((a, p) => a + p.stars, 0);
  // la saison suivante, tant qu'elle est fermée et que c'est celle-ci qui l'ouvre
  const next = season === open.seasons && season < SEASONS ? { season: season + 1, have, need: SEASON_STARS } : null;
  return { season, pips, next };
}
