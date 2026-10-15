// La Route des feux (HISTOIRE.md, § 6.18) : près de chaque lieu remarquable, le fanal des Anciens, une vasque de pierre
// sur son pilier. Les Anciens guidaient les navires par cette chaîne de feux ; le Voile les a soufflés. Fonctions pures :
// quels fanaux l'île montre, où, et comment brûle un feu rallumé à un instant (heure, pluie, orage, vent).
// Le serveur décide de tout (vue de l'île : landmarks, fire, found, lit) : un lieu ne se découvre que dans un quartier
// à soi, son feu ne se rallume qu'une fois le lieu découvert.
import { gustAt, windStrength } from './lumiere/vent';

// Les fanaux que l'île montre : un lieu qui a son feu, découvert, dans un quartier à soi. Rien d'autre, pas même la
// vasque froide : un quartier qu'on n'a pas encore, un lieu pas encore trouvé n'ont pas de fanal. [{ id, x, y, lit }]
export function feuxOf(state) {
  if (!state || !state.landmarks || !state.map) return [];
  const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
  return state.landmarks
    .filter(l => l.known !== false && l.fire && l.found && owned.has(l.zone))
    .map(l => ({ id: l.id, x: l.x, y: l.y, lit: Boolean(l.lit) }));
}

// Où se tient le fanal près de son lieu : [u, v] depuis le centre de sa case, en cases. Sur le bord avant droit du
// socle que dessine le lieu (hors du dessin du lieu lui-même), ou là où ce dessin laisse de la place
const AT = {};
const AT_DEFAULT = [1.55, -0.4];
export const feuAt = id => AT[id] || AT_DEFAULT;

// Hauteur de la vasque au-dessus du sol (unités du monde) : là où naît la flamme
export const VASQUE = 29;

const clamp = x => Math.min(1, Math.max(0, x));

// Comment brûle un feu rallumé (x, y : sa case ; t : le temps en secondes, 0 en mouvement réduit ; seed : propre à
// chaque feu, pour qu'ils ne battent pas ensemble) :
// - haut : la taille de la flamme (1 par temps sec) ; la pluie la tasse, une rafale l'étire un peu
// - penche : son inclinaison sous le vent (radians, vers la droite de l'écran, comme la fumée), plus forte dans l'orage
// - vif : le battement de la flamme (0 à 1), plus nerveux dans l'orage
// - lumiere, portee : sa lumière sur l'île (force, rayon en unités du monde). Le jour il brûle sans éclairer grand-chose,
//   la nuit il porte loin
// - fumee : ce qui s'en échappe (la pluie la change en vapeur ; les braises suivent les règles du feu de camp :
//   lumiere/petiteVie.js, braisesFor)
export function flammeOf(phase, x, y, t, seed = 0) {
  const { rain = 0, storm = 0 } = phase.weather || {};
  const lit = clamp(phase.lit || 0);
  const wind = windStrength(phase.weather);
  const gust = gustAt(x, y, t);
  const nerf = 1 + 1.4 * storm;
  const vif = clamp(0.84 + nerf * (0.09 * Math.sin(t * 9.3 + seed) + 0.07 * Math.sin(t * 15.1 + seed * 2.3)));
  const haut = (1 - 0.32 * rain) * (0.92 + 0.08 * vif + 0.12 * gust);
  const penche = Math.min(0.7, (0.1 + 0.28 * gust) * wind);
  const lumiere = Math.max(0.35, 0.85 * lit) * vif * (1 - 0.25 * rain);
  const portee = (26 + 26 * lit) * (1 - 0.3 * rain);
  const fumee = 0.25 + 0.75 * rain;
  return { haut, penche, vif, lumiere, portee, fumee };
}

// Le Voile recule autour d'un feu rallumé, de jour comme de nuit (le feu des Anciens le tient à distance) : environ
// trois cases (world/voile.js : clearingOf, qui porte à 3,2 fois ce rayon)
export const VOILE_RECULE = 0.95;
