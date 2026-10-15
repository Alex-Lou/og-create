// L'horloge du tutoriel (choix de l'auteur, 10 oct. : « le tuto est accéléré au niveau du temps, sinon pas tenable ») :
// pendant le tutoriel, l'île ne suit pas l'heure réelle. Chaque étape a son moment de la journée ([début, fin], en
// heures), et le temps y avance en accéléré (SPEED : une minute de l'île par seconde), sans dépasser la fin de son
// moment. Le premier jour finit dans la nuit, avec Brume ; le matin vient après avoir dormi, avec Lorena. Après le
// tutoriel, l'île revient à l'heure réelle.
const SPEED = 60;
// Son soleil (retour de l'auteur, 11 oct. : « 18 h affiché, je suis en plein jour ») : le même en toute saison, pour que
// l'heure dise la lumière ; 18 h, le couchant ; 19 h 30, la nuit ; 7 h 30, le matin (world/sky.js : fixSun)
export const TUTO_SUN = { rise: 7.3, set: 18, noon: 12.65 };
const HOUR_MS = 3600000;
export const MOMENTS = {
  // Jour 1, seul avec Brume (choix de l'auteur, 11 oct.) : l'arrivée au crépuscule bleu, le ramassage à la tombée de
  // la nuit, le feu bâti en pleine nuit, puis la nuit autour du feu
  pages: [18.9, 19.1],
  ramasser: [19.1, 19.6],
  feu: [19.6, 20.5],
  nuit: [21.5, 23.5],
  // Jour 2, Lorena (choix de l'auteur, 11 oct. : l'heure avance à chaque étape) : sa scène au réveil et sa caisse, sa
  // longue-vue et sa Récolte, son Ponton, le chemin, ses piquets, ses portes au couchant ; le soir autour du feu, puis
  // la deuxième nuit
  caisse: [7.5, 9.5],
  recolte: [10, 11.5],
  'premier-ponton': [12, 13.5],
  'chemin-aster': [14, 15.5],
  clotures: [16, 17.5],
  portes: [17.5, 18.5],
  veille: [19, 23.5],
  // Jour 3, Agathe (choix de l'auteur, 11 oct.) : sa scène au réveil et sa soupe, la cage, ses poules, leur
  // poulailler ; le soir à trois autour du feu, puis la troisième nuit
  soupe: [8, 10.5],
  cage: [11, 12],
  poules: [12, 14],
  poulailler: [14, 15.5],
  // (son abri, puis son enclos : choix de l'auteur, 13 oct.)
  'abri-cannelle': [15.5, 16.5],
  'enclos-cannelle': [16.5, 18],
  'nuit-cannelle': [19, 23.5],
  // Jour 4, Jovin (choix de l'auteur, 13 oct. : chaque personnage son jour) : il sort de la brume au matin, sa
  // lanterne, ses trois torches l'après-midi ; le soir à quatre, puis la quatrième nuit
  deco: [8, 12],
  'torches-rivet': [13, 17.5],
  'nuit-rivet': [19, 23.5],
  // Jour 5, Léo : on le trouve endormi au matin, sa Pluie, son Puits, son chemin
  'eveil-ondin': [8, 10],
  'souvenir-ondin': [10, 12],
  'puits-ondin': [12, 15],
  chemin: [15, 17]
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
