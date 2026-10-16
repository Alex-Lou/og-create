// L'agenda des habitants (choix de l'auteur, 16 oct. : chacun sa journée, ses rituels, son lit) : à une heure de l'île,
// ce que fait chacun. Il dort chez lui la nuit (couché à sa place), s'abrite sous la pluie à sa porte (un sur deux ;
// les autres sortent avec un parapluie), tient son rituel, mange au Foyer avec les autres à midi, passe voir un
// camarade l'après-midi (un jour sur deux environ), sinon fait sa tournée du jour ou du soir (village/residents.js).
// Tout se déduit de l'habitant, de l'heure et du jour de l'île : rien n'est gardé, tous les appareils voient la même vie.
import { hash } from './beast';

// Les rituels des maîtres (choix de l'auteur, 16 oct.) : de quand à quand (heures de l'île ; sun : le lever et le
// coucher du soleil de l'île), où (work : sa place de travail ; field : son annexe, sinon sa place ; water : le bord de
// l'eau douce la plus proche ; forest : l'orée de la forêt la plus proche), sa pose et où il regarde (ne : au loin)
export const RITUALS = {
  // Lorena au Ponton à l'aube, sa longue-vue vers l'îlot
  ponton: [{ id: 'aube', from: sun => sun.rise - 0.2, to: sun => sun.rise + 0.9, where: 'work', pose: 'idle', view: 'ne' }],
  // Agathe au Foyer aux heures des repas
  foyer: [{ id: 'midi', from: () => 11.6, to: () => 13, where: 'work', pose: 'work' }, { id: 'soupe', from: sun => sun.set - 1, to: sun => sun.set + 0.3, where: 'work', pose: 'work' }],
  // Nathan tard à l'Atelier, à la lanterne
  atelier: [{ id: 'veille', from: () => 21.4, to: () => 23.2, where: 'work', pose: 'work' }],
  // Léo au bord de l'eau le matin
  puits: [{ id: 'eau', from: () => 8, to: () => 9.4, where: 'water', pose: 'idle', view: 'se' }],
  // Maerys à l'orée de la forêt au crépuscule
  bosquet: [{ id: 'oree', from: sun => sun.set - 1.2, to: sun => sun.set + 0.2, where: 'forest', pose: 'idle', view: 'ne' }],
  // Robby à la carrière, tôt
  carriere: [{ id: 'tot', from: () => 5.8, to: () => 7.6, where: 'work', pose: 'work' }],
  // Maggy au potager, et à la lune la nuit
  potager: [{ id: 'lune', from: () => 22.4, to: () => 23.7, where: 'field', pose: 'idle', view: 'ne' }]
};
// Leurs heures, quand un rituel les déplace : Robby se lève tôt ; Nathan et Maggy veillent
export const HOURS = { carriere: { wake: 5.8 }, atelier: { bed: 23.2 }, potager: { bed: 23.7 } };
// Le repas de midi, tous au Foyer
export const MEAL = { from: 12.2, to: 12.9 };
// La visite du jour à un camarade : un jour sur deux environ, l'après-midi, le temps d'une causette
const VISIT_ODDS = 0.55;
const VISIT_FROM = 14;
const VISIT_SPREAD = 2.5;
const VISIT_HOURS = 0.7;
// Le soir commence un peu après le coucher du soleil (la tournée du soir, autour du feu)
const EVENING = 0.4;

// La visite d'un habitant ce jour-là : { from, to, who } (who : le rôle du camarade), ou null. others : les rôles des
// camarades qu'on peut aller voir (pas lui)
export function visitOf(r, day, others) {
  if (!others.length || hash(r.k * 11 + 1, day) > VISIT_ODDS) return null;
  const from = VISIT_FROM + hash(r.k * 11 + 2, day) * VISIT_SPREAD;
  return { from, to: from + VISIT_HOURS, who: others[Math.floor(hash(r.k * 11 + 3, day) * others.length)] };
}

// Ce que fait un habitant à l'heure h (sun : { rise, set } ; rain : de 0 à 1 ; calm : le tutoriel, chacun reste près
// de sa place ; visit : sa visite du jour, ou null ; shown : le coach le montre, il reste debout et dehors) :
// { mode, ritual? } ; mode : 'nuit', 'absent' (un voyageur de passage, la nuit : il n'a pas de lit sur l'île), 'abri',
// 'rituel:<id>', 'repas', 'visite', 'soir' ou 'jour'
export function momentOf(r, h, sun, { rain = 0, calm = false, visit = null, shown = false } = {}) {
  const evening = h >= sun.set + EVENING;
  if (!shown && (h < r.wake || h >= r.bed)) return { mode: r.guest ? 'absent' : 'nuit' };
  if (!shown && rain > 0.5 && r.k % 2 === 1) return { mode: 'abri' };
  if (calm || r.guest) return { mode: evening ? 'soir' : 'jour' };
  const ritual = r.master && (RITUALS[r.role] || []).find(x => h >= x.from(sun) && h < x.to(sun));
  if (ritual) return { mode: `rituel:${ritual.id}`, ritual };
  if (r.master && h >= MEAL.from && h < MEAL.to) return { mode: 'repas' };
  if (visit && h >= visit.from && h < visit.to) return { mode: 'visite', visit };
  return { mode: evening ? 'soir' : 'jour' };
}
