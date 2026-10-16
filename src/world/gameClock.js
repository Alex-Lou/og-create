// L'horloge du jeu (choix de l'auteur, 15 oct.) : la même pour tous, détachée de l'heure réelle. Un cycle d'1 h 30 :
// l'aube (5 min), le jour (60 min : le matin, midi, l'après-midi), le crépuscule (5 min), la nuit (20 min). Sur
// l'horloge de l'île : l'aube va de 6 h à 7 h, le jour de 7 h à 19 h, le crépuscule de 19 h à 21 h, la nuit de 21 h à 6 h.
// Elle mène le ciel, la lumière et la météo (hors du tutoriel, qui a la sienne : tutoClock.js) ; le serveur fait le
// même calcul pour les nuits, la météo et Anya (services/gameClock.js du dépôt serveur).
const MINUTE = 60 * 1000;
const HOUR_MS = 60 * MINUTE;
export const CYCLE_MS = 90 * MINUTE;
// Le premier cycle commence à l'aube du 1er janvier 2026 (minuit UTC)
const EPOCH = Date.UTC(2026, 0, 1);
// Les repères du cycle : [minute du cycle, heure de l'île] ; entre deux repères, l'heure avance d'un pas régulier
const ANCHORS = [[0, 6], [5, 7], [65, 19], [70, 21], [90, 30]];
// Son soleil, le même chaque jour (world/sky.js : fixSun) : le lever dans l'aube, le coucher au début du crépuscule ;
// la nuit franche (sky.js, KEYS : 1,6 h après le coucher) tombe avec celle des égarés, à 21 h
export const GAME_SUN = { rise: 6.6, set: 19.3, noon: 12.95 };

const cycleOf = ms => Math.floor((ms - EPOCH) / CYCLE_MS);
// Le cycle d'un instant, et l'instant où il commence (le Kraken tire ses nuits sur ce cycle : faune/kraken.js)
export const cycleAt = ms => cycleOf(ms);
export const cycleStart = cycle => EPOCH + cycle * CYCLE_MS;

// L'heure de l'île à la minute m d'un cycle (6 à 30 : après minuit, 24 de plus)
export function hourIn(m) {
  for (let k = 1; k < ANCHORS.length; k++) {
    const [m1, h1] = ANCHORS[k];
    const [m0, h0] = ANCHORS[k - 1];
    if (m <= m1) return h0 + ((m - m0) / (m1 - m0)) * (h1 - h0);
  }
  return ANCHORS[ANCHORS.length - 1][1];
}
// La minute du cycle d'une heure de l'île (l'inverse de hourIn ; avant 6 h, la fin du cycle : 24 de plus)
export function minuteOf(hour) {
  const h = hour < ANCHORS[0][1] ? hour + 24 : hour;
  for (let k = 1; k < ANCHORS.length; k++) {
    const [m1, h1] = ANCHORS[k];
    const [m0, h0] = ANCHORS[k - 1];
    if (h <= h1) return m0 + ((h - h0) / (h1 - h0)) * (m1 - m0);
  }
  return ANCHORS[ANCHORS.length - 1][0];
}
// Le jour de l'île (n° depuis le 1er janvier 2026, il change à minuit) et l'heure (0 à 24) d'un instant
export function dayHourOf(ms) {
  const cycle = cycleOf(ms);
  const hours = cycle * 24 + hourIn((ms - EPOCH - cycle * CYCLE_MS) / MINUTE);
  const day = Math.floor(hours / 24);
  return { day, hour: hours - day * 24 };
}
// La date du ciel à un instant : le jour de l'île compté depuis le 1er janvier 2026 (sky.js en tire la météo), à
// l'heure de l'île (heure locale ; un jour de changement d'heure, l'heure qui n'existe pas se lit une heure plus tard,
// en pleine nuit)
export function gameDate(ms) {
  const { day, hour } = dayHourOf(ms);
  return new Date(2026, 0, 1 + day, 0, 0, 0, Math.round(hour * HOUR_MS));
}
