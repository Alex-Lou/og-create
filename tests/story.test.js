// Lot H3 (HISTOIRE.md § 6.2, § 6.7, § 14) : naufrages annoncés, souvenirs retrouvés, dormeurs couchés
import { describe, it, expect } from 'vitest';
import { WRECKS, wreckOf, MEMORIES, memoryOf } from '@/world/story';
import { villagerSprite, ROLES } from '@/world/villagers';
import { ARRIVAL_LINES } from '@/texts/story';
import { TALKS } from '@/texts/world/friends';

describe('le récit sur l’île', () => {
  it('un naufrage s’annonce quand la quête qui ouvre son acte devient active, une seule fois par appareil', () => {
    expect(Object.keys(WRECKS)).toEqual(['lisiere', 'colline', 'jardins']);
    expect(wreckOf({ id: 'lisiere', done: false }, [])).toMatchObject({ id: 'lisiere', villager: 'bosquet', zone: 'lisiere' });
    expect(wreckOf({ id: 'lisiere', done: false }, ['lisiere'])).toBeNull();
    expect(wreckOf({ id: 'lisiere', done: true }, [])).toBeNull();
    expect(wreckOf({ id: 'vie', done: false }, [])).toBeNull();
    expect(wreckOf(null, [])).toBeNull();
    // (Maerys et Robby vivaient déjà sur l'île : une découverte ; Maggy seule fait naufrage)
    expect(WRECKS.lisiere.text).toMatch(/^Là-bas, à la lisière, une lueur entre les arbres\. /);
    expect(WRECKS.colline.text).toMatch(/^Écoute… Du côté de la Colline\. /);
    expect(WRECKS.jardins.text).toMatch(/^Cette nuit, un autre bateau s’est brisé dans ma brume\. /);
    // (l'annonce refermée, Lorena ne pose plus de questions : choix de l'auteur, 18 oct.)
    expect(WRECKS.lisiere.after).toMatchObject([{ who: 'ponton' }]);
  });
  it('Maerys, qui se cachait, se montre à son réveil : sa rencontre, en bulles ; sa première phrase reste pour la veillée', () => {
    const lines = ARRIVAL_LINES.bosquet;
    for (const line of lines) expect(line.text.length, line.text).toBeLessThanOrEqual(140);
    expect(lines[0]).toMatchObject({ who: 'bosquet' });
    expect(lines[0].text).not.toBe(TALKS.bosquet[0]);
    expect(lines.some(line => line.who === 'joueur')).toBe(true);
    expect(lines[lines.length - 1]).toMatchObject({ aside: true });
  });
  it('chaque souvenir retrouvé a sa réplique, dans une bulle ; Maggy se souvient dès son réveil', () => {
    expect(Object.keys(MEMORIES)).toEqual(['souvenir-ondin', 'souvenir-sylve', 'bosquet', 'souvenir-galet', 'eveil-melisse', 'souvenir-aster']);
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
