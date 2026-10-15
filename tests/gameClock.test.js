import { describe, it, expect } from 'vitest';
import { CYCLE_MS, dayHourOf, gameDate, hourIn } from '@/world/gameClock';
import { slotKind, weatherAt } from '@/world/sky';

// L'horloge du jeu : même vecteur que test/nights.test.js côté serveur (services/gameClock.js) ; si l'un change, les
// nuits et la pluie que le serveur compte ne sont plus celles que le jeu montre
describe('l’horloge du jeu, partagée avec le serveur', () => {
  it('un cycle d’1 h 30 : l’aube, le jour, le crépuscule, la nuit', () => {
    expect(CYCLE_MS).toBe(90 * 60 * 1000);
    expect([0, 5, 35, 65, 70, 90].map(hourIn)).toEqual([6, 7, 13, 19, 21, 30]);
    expect(['2026-10-15T12:00:00Z', '2026-10-15T13:10:00Z'].map(t => dayHourOf(Date.parse(t)))).toEqual([{ day: 4600, hour: 6 }, { day: 4600, hour: 21 }]);
  });

  it('le ciel lit l’heure de l’île et la météo de son jour', () => {
    for (let t = Date.parse('2026-10-15T00:00:00Z'); t < Date.parse('2026-10-16T00:00:00Z'); t += 7 * 60 * 1000) {
      const { day, hour } = dayHourOf(t);
      const date = gameDate(t);
      expect(date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600 + date.getMilliseconds() / 3600000).toBeCloseTo(hour, 5);
      expect(weatherAt(date).kind).toBe(slotKind(day, Math.floor(hour / 6)));
    }
  });
});
