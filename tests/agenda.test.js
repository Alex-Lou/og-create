// L'agenda des habitants (world/village/agenda.js ; choix de l'auteur, 16 oct.) : chacun sa journée, ses rituels, son
// lit ; tout se déduit de l'habitant, de l'heure et du jour de l'île
import { describe, it, expect } from 'vitest';
import { momentOf, visitOf, shiftOf, marketDay, RITUALS, HOURS, MEAL, MARKET } from '@/world/village/agenda';
import { GAME_SUN } from '@/world/gameClock';

const sun = GAME_SUN;
const master = (role, k = 0) => ({ role, k, master: true, wake: (HOURS[role] && HOURS[role].wake) || 6.4, bed: (HOURS[role] && HOURS[role].bed) || 21.6 });
const mode = (r, h, o) => momentOf(r, h, sun, o).mode;

describe('l’agenda des habitants', () => {
  it('la nuit, chacun dort chez lui ; le voyageur de passage n’a pas de lit sur l’île', () => {
    expect(mode(master('ponton'), 3)).toBe('nuit');
    expect(mode(master('ponton'), 22)).toBe('nuit');
    expect(mode({ role: 'visitor', k: 4, guest: {}, wake: 7, bed: 21.3 }, 23)).toBe('absent');
  });
  it('chaque maître tient son rituel, à son heure', () => {
    expect(momentOf(master('ponton'), sun.rise, sun)).toMatchObject({ mode: 'rituel:aube', ritual: { view: 'ne' } });
    expect(mode(master('foyer'), 12)).toBe('rituel:midi');
    expect(mode(master('foyer'), sun.set - 0.5)).toBe('rituel:soupe');
    expect(mode(master('atelier'), 22.5)).toBe('rituel:veille');
    expect(mode(master('puits'), 8.5)).toBe('rituel:eau');
    expect(mode(master('bosquet'), sun.set - 0.6)).toBe('rituel:oree');
    expect(mode(master('carriere'), 6)).toBe('rituel:tot');
    expect(mode(master('potager'), 23)).toBe('rituel:lune');
    // (Robby se lève tôt ; Nathan et Maggy veillent ; les autres dorment déjà)
    expect([mode(master('carriere'), 6), mode(master('ponton'), 6)]).toEqual(['rituel:tot', 'nuit']);
    expect(mode(master('puits'), 22.5)).toBe('nuit');
    expect(Object.keys(RITUALS).sort()).toEqual(['atelier', 'bosquet', 'carriere', 'foyer', 'ponton', 'potager', 'puits']);
  });
  it('à midi, tous au Foyer ; l’après-midi, la visite à un camarade ; sinon la tournée du jour, puis celle du soir', () => {
    expect(mode(master('ponton'), (MEAL.from + MEAL.to) / 2)).toBe('repas');
    const visit = { from: 15, to: 15.7, who: 'puits' };
    expect(momentOf(master('ponton'), 15.3, sun, { visit })).toMatchObject({ mode: 'visite', visit });
    expect(mode(master('ponton'), 16, { visit })).toBe('jour');
    expect(mode(master('ponton'), sun.set + 1)).toBe('soir');
  });
  it('sous la pluie, un sur deux s’abrite ; le tutoriel garde chacun à sa place, sans rituel ; le coach garde dehors qui il montre', () => {
    expect([mode(master('ponton', 0), 10, { rain: 1 }), mode(master('ponton', 1), 10, { rain: 1 })]).toEqual(['jour', 'abri']);
    expect(mode(master('ponton'), sun.rise, { calm: true })).toBe('jour');
    expect(mode(master('ponton'), 3, { shown: true })).toBe('jour');
    expect(mode(master('ponton', 1), 10, { rain: 1, shown: true })).toBe('jour');
  });
  it('la visite du jour : tirée pour lui et pour ce jour-là, l’après-midi, chez un autre', () => {
    const r = master('ponton', 2);
    expect(visitOf(r, 40, [])).toBe(null);
    const days = Array.from({ length: 60 }, (_, d) => visitOf(r, d, ['puits', 'foyer']));
    expect(days.filter(Boolean).length).toBeGreaterThan(15);
    expect(days.filter(Boolean).length).toBeLessThan(50);
    for (const v of days.filter(Boolean)) {
      expect(v.from).toBeGreaterThanOrEqual(14);
      expect(v.to).toBeLessThanOrEqual(17.3);
      expect(['puits', 'foyer']).toContain(v.who);
    }
    expect(visitOf(r, 7, ['puits', 'foyer'])).toEqual(visitOf(r, 7, ['puits', 'foyer']));
  });
  it('ses heures bougent un peu d’un jour à l’autre, au plus de 20 minutes, rituels compris ; le repas reste à midi', () => {
    const r = master('carriere', 1);
    const shifts = Array.from({ length: 60 }, (_, d) => shiftOf(r, d));
    expect(Math.max(...shifts.map(Math.abs))).toBeLessThanOrEqual(1 / 3);
    expect(new Set(shifts.map(v => v.toFixed(3))).size).toBeGreaterThan(30);
    expect(shiftOf(r, undefined)).toBe(0);
    for (let d = 0; d < 20; d++) {
      const s = shiftOf(r, d);
      // (son rituel du matin, décalé du même pas que son lever)
      expect(mode(r, 5.8 + s + 0.01, { day: d })).toBe('rituel:tot');
      expect(mode(r, 5.8 + s - 0.01, { day: d })).toBe('nuit');
      expect(mode(r, (MEAL.from + MEAL.to) / 2, { day: d })).toBe('repas');
    }
  });
  it('le jour de marché : un jour de la semaine de l’île, le matin au Foyer, et plus de visites l’après-midi', () => {
    expect(Array.from({ length: 14 }, (_, d) => marketDay(d)).filter(Boolean)).toHaveLength(2);
    const r = master('potager', 3);
    expect(mode(r, (MARKET.from + MARKET.to) / 2, { market: true })).toBe('marche');
    expect(mode(r, (MARKET.from + MARKET.to) / 2)).toBe('jour');
    // (un rituel passe avant : Léo à l'eau ; le tutoriel, rien)
    expect(mode(master('puits', 3), 9, { market: true })).toBe('rituel:eau');
    expect(mode(r, (MARKET.from + MARKET.to) / 2, { market: true, calm: true })).toBe('jour');
    const count = market => Array.from({ length: 200 }, (_, d) => visitOf(r, d, ['puits', 'foyer'], market)).filter(Boolean).length;
    expect(count(true)).toBeGreaterThan(count(false));
  });
  it('un voyageur installé mange avec la troupe ; le voyageur de passage, non', () => {
    const settler = { role: 'potager', k: 7, wake: 6.6, bed: 21.4 };
    expect(mode(settler, (MEAL.from + MEAL.to) / 2)).toBe('repas');
    expect(mode({ ...settler, guest: {}, k: 11 }, (MEAL.from + MEAL.to) / 2)).toBe('jour');
  });
});
