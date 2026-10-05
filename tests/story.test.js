// Lot H3 (HISTOIRE.md § 6.2, § 6.7, § 14) : naufrages annoncés, souvenirs retrouvés, dormeurs couchés
import { describe, it, expect } from 'vitest';
import { WRECKS, wreckOf, MEMORIES, memoryOf } from '@/world/story';
import { villagerSprite, ROLES } from '@/world/villagers';

describe('le récit sur l’île', () => {
  it('un naufrage s’annonce quand la quête qui ouvre son acte devient active, une seule fois par appareil', () => {
    expect(Object.keys(WRECKS)).toEqual(['lisiere', 'colline', 'jardins']);
    expect(wreckOf({ id: 'lisiere', done: false }, [])).toMatchObject({ id: 'lisiere', villager: 'bosquet', zone: 'lisiere' });
    expect(wreckOf({ id: 'lisiere', done: false }, ['lisiere'])).toBeNull();
    expect(wreckOf({ id: 'lisiere', done: true }, [])).toBeNull();
    expect(wreckOf({ id: 'vie', done: false }, [])).toBeNull();
    expect(wreckOf(null, [])).toBeNull();
    for (const wreck of Object.values(WRECKS)) expect(wreck.text).toMatch(/^Cette nuit, un autre bateau s’est brisé… /);
  });
  it('chaque souvenir retrouvé a sa réplique, dans une bulle ; Mélisse se souvient dès son réveil', () => {
    expect(Object.keys(MEMORIES)).toEqual(['souvenir-ondin', 'souvenir-sylve', 'souvenir-galet', 'eveil-melisse', 'souvenir-aster']);
    expect(memoryOf('eveil-melisse').line).toMatch(/Tes pages m’ont réveillée avant toi/);
    expect(memoryOf('lisiere')).toBeNull();
    for (const { villager, line } of Object.values(MEMORIES)) {
      expect(ROLES[villager]).toBeTruthy();
      expect(line.length).toBeLessThanOrEqual(140);
    }
  });
  it('un dormeur se dessine couché, les yeux fermés, sans outil, avec des « z » (deux images)', () => {
    for (const [id, role] of Object.entries(ROLES)) {
      const look = { ...role, skin: '#F6D3B3', hair: '#3A2A1E' };
      const [a, b] = [0, 1].map(frame => villagerSprite(look, { pose: 'sleep', view: 'se', frame }).svg);
      expect(a, id).not.toMatch(/NaN|undefined/);
      expect(a).toContain('rotate(-82)');
      expect(a).not.toBe(b);
    }
  });
});
