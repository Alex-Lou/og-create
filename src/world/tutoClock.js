// L'horloge du tutoriel (choix de l'auteur, 10 oct. : « le tuto est accéléré au niveau du temps, sinon pas tenable ») :
// pendant le tutoriel, l'île ne suit pas l'heure réelle. Chaque étape a son moment de la journée ([début, fin], en
// heures), et le temps y avance en accéléré (SPEED : une minute de l'île par seconde), sans dépasser la fin de son
// moment. Le premier jour finit dans la nuit, avec Brume ; le matin vient après avoir dormi, avec Aster. Après le
// tutoriel, l'île revient à l'heure réelle.
const SPEED = 60;
const HOUR_MS = 3600000;
export const MOMENTS = {
  // Jour 1, seul avec Brume : la fin d'après-midi, le crépuscule, puis la nuit autour du feu
  pages: [17.5, 18],
  ramasser: [18, 19],
  feu: [19, 20.5],
  nuit: [21.5, 23.5],
  // Jour 2 : le matin d'Aster, sa journée, puis la deuxième nuit autour du feu
  recolte: [7.5, 17],
  veille: [21, 23.5],
  // Jour 3 : Cannelle au matin, puis la suite
  soupe: [8, 11],
  poules: [11, 13],
  deco: [13, 15],
  'achat-source': [15, 16],
  'eveil-ondin': [15, 16],
  'souvenir-ondin': [16, 17],
  'puits-ondin': [17, 18],
  chemin: [18, 19]
};

// La date du ciel pour l'étape quest, elapsed ms après qu'elle a commencé (sur cet appareil), le jour de today ; null
// hors du tutoriel (l'heure réelle)
export function tutorialDate(quest, elapsed, today = new Date()) {
  const moment = MOMENTS[quest];
  if (!moment) return null;
  const [from, to] = moment;
  const hours = Math.min(to, from + (Math.max(0, elapsed) / 1000) * (SPEED / 3600));
  const date = new Date(today);
  date.setHours(0, 0, 0, 0);
  return new Date(date.getTime() + hours * HOUR_MS);
}
