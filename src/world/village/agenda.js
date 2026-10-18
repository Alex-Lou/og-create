// L'agenda des habitants (choix de l'auteur, 16 oct. : chacun sa journée, ses rituels, son lit) : à une heure de l'île,
// ce que fait chacun. Il dort chez lui la nuit (couché à sa place), s'abrite sous la pluie à sa porte (un sur deux ;
// les autres sortent avec un parapluie), tient son rituel, mange au Foyer avec les autres à midi, passe voir un
// camarade l'après-midi (un jour sur deux environ), sinon fait sa tournée du jour ou du soir (village/residents.js).
// Tout se déduit de l'habitant, de l'heure et du jour de l'île : rien n'est gardé, tous les appareils voient la même vie.
import { hash } from './beast';

// Les rituels des maîtres (choix de l'auteur, 16 oct.) : de quand à quand (heures de l'île ; sun : le lever et le
// coucher du soleil de l'île), où (work : sa place de travail ; field : son annexe, sinon sa place ; water : le bord de
// l'eau douce la plus proche ; forest : l'orée de la forêt la plus proche), sa pose et où il regarde (ne : au loin) ;
// steady : il tient au soleil ou au repas, il ne bouge pas d'un jour à l'autre (shiftOf)
export const RITUALS = {
  // Lorena au Ponton à l'aube, sa longue-vue vers l'îlot
  ponton: [{ id: 'aube', from: sun => sun.rise - 0.2, to: sun => sun.rise + 0.9, where: 'work', pose: 'idle', view: 'ne', steady: true }],
  // Agathe au Foyer aux heures des repas
  foyer: [{ id: 'midi', from: () => 11.6, to: () => 13, where: 'work', pose: 'work', steady: true }, { id: 'soupe', from: sun => sun.set - 1, to: sun => sun.set + 0.3, where: 'work', pose: 'work', steady: true }],
  // Nathan tard à l'Atelier, à la lanterne
  atelier: [{ id: 'veille', from: () => 21.4, to: () => 23.2, where: 'work', pose: 'work' }],
  // Léo au bord de l'eau le matin
  puits: [{ id: 'eau', from: () => 8, to: () => 9.4, where: 'water', pose: 'idle', view: 'se' }],
  // Maerys à l'orée de la forêt au crépuscule
  bosquet: [{ id: 'oree', from: sun => sun.set - 1.2, to: sun => sun.set + 0.2, where: 'forest', pose: 'idle', view: 'ne', steady: true }],
  // Robby à la carrière, tôt
  carriere: [{ id: 'tot', from: () => 5.8, to: () => 7.6, where: 'work', pose: 'work' }],
  // Maggy au potager, et à la lune la nuit
  potager: [{ id: 'lune', from: () => 22.4, to: () => 23.7, where: 'field', pose: 'idle', view: 'ne' }]
};
// Leurs heures, quand un rituel les déplace : Robby se lève tôt ; Nathan et Maggy veillent (un rituel tire aussi de
// son lit celui qui le tient : Lorena à l'aube, sous tous les soleils)
export const HOURS = { carriere: { wake: 5.8 }, atelier: { bed: 23.2 }, potager: { bed: 23.7 } };
// Le repas de midi, tous au Foyer
export const MEAL = { from: 12.2, to: 12.9 };
// Le jour de marché (choix de l'auteur, 18 oct.) : un jour de la semaine de l'île (7 jours), une fois le Foyer à ce
// palier ; le matin, chacun passe au Foyer échanger ; l'après-midi, plus de visites
export const MARKET = { from: 9.6, to: 10.8, weekday: 3, level: 2 };
export const marketDay = day => ((day % 7) + 7) % 7 === MARKET.weekday;
// Ses heures bougent un peu d'un jour à l'autre (choix de l'auteur, 18 oct.) : son lever, son coucher et ses rituels à
// heure fixe, d'un même décalage (au plus JITTER heure, avant ou après) ; l'aube, le crépuscule, le repas et le marché
// restent à leur heure
const JITTER = 1 / 3;
export const shiftOf = (r, day) => (day === undefined ? 0 : (hash(r.k * 17 + 5, day) - 0.5) * 2 * JITTER);
// La visite du jour à un camarade : un jour sur deux environ, l'après-midi, le temps d'une causette (plus souvent les
// jours de marché)
const VISIT_ODDS = 0.55;
const VISIT_ODDS_MARKET = 0.8;
const VISIT_FROM = 14;
const VISIT_SPREAD = 2.5;
const VISIT_HOURS = 0.7;
// Le soir commence un peu après le coucher du soleil (la tournée du soir, autour du feu)
const EVENING = 0.4;

// La troupe des maîtres, dans son ordre : leur rang fixe (village/residents.js), qu'ils soient arrivés ou non ; les
// camarades d'un maître, toujours les mêmes, dans cet ordre (sa visite du jour se tire parmi eux : celle d'un camarade
// pas encore là, ou endormi, n'a pas lieu ; un jour passé se tire donc toujours de même)
export const MASTERS = ['potager', 'carriere', 'bosquet', 'puits', 'ponton', 'atelier', 'foyer'];
export const matesOf = role => MASTERS.filter(id => id !== role);

// La visite d'un habitant ce jour-là : { from, to, who } (who : le rôle du camarade), ou null. others : les rôles des
// camarades qu'on peut aller voir (pas lui ; matesOf) ; market : jour de marché
export function visitOf(r, day, others, market = false) {
  if (!others.length || hash(r.k * 11 + 1, day) > (market ? VISIT_ODDS_MARKET : VISIT_ODDS)) return null;
  const from = VISIT_FROM + hash(r.k * 11 + 2, day) * VISIT_SPREAD;
  return { from, to: from + VISIT_HOURS, who: others[Math.floor(hash(r.k * 11 + 3, day) * others.length)] };
}

// Ce que fait un habitant à l'heure h (sun : { rise, set } ; rain : de 0 à 1 ; calm : le tutoriel, chacun reste près
// de sa place ; visit : sa visite du jour, ou null ; shown : le coach le montre, il reste debout et dehors ; day : le
// jour de l'île, ses heures en bougent un peu ; market : jour de marché) : { mode, ritual? } ; mode : 'nuit',
// 'absent' (un voyageur de passage, la nuit : il n'a pas de lit sur l'île), 'abri', 'rituel:<id>', 'marche', 'repas',
// 'visite', 'soir' ou 'jour'
export function momentOf(r, h, sun, { rain = 0, calm = false, visit = null, shown = false, day, market = false } = {}) {
  const evening = h >= sun.set + EVENING;
  const shift = calm ? 0 : shiftOf(r, day);
  const ritual = !calm && r.master && (RITUALS[r.role] || []).find(x => h >= x.from(sun) + (x.steady ? 0 : shift) && h < x.to(sun) + (x.steady ? 0 : shift));
  if (!shown && !ritual && (h < r.wake + shift || h >= r.bed + shift)) return { mode: r.guest ? 'absent' : 'nuit' };
  // (un sur deux parmi ceux qui sont là : son tour dans la troupe présente, row ; à défaut, son rang)
  if (!shown && rain > 0.5 && (r.row ?? r.k) % 2 === 1) return { mode: 'abri' };
  if (calm || r.guest) return { mode: evening ? 'soir' : 'jour' };
  if (ritual) return { mode: `rituel:${ritual.id}`, ritual };
  if (market && h >= MARKET.from && h < MARKET.to) return { mode: 'marche' };
  // (le repas : toute la troupe, voyageurs installés compris)
  if (h >= MEAL.from && h < MEAL.to) return { mode: 'repas' };
  if (visit && h >= visit.from && h < visit.to) return { mode: 'visite', visit };
  return { mode: evening ? 'soir' : 'jour' };
}
