// Lot H0 (HISTOIRE.md § 16) : la troupe de la bible et ses répliques. Aucune réplique ne cite un ancien prénom ni
// « le dernier alchimiste » ; chaque bulle tient en 140 caractères (§ 7.4) ; Brume ne se présente qu'une fois.
import { describe, it, expect } from 'vitest';
import { talkLine, giftLine } from '@/world/friends';
import { noteOf } from '@/world/chest';
import { ROLES } from '@/world/roles';
import { TIPS } from '@/texts/guide/tips';

const IDS = ['potager', 'carriere', 'bosquet', 'puits', 'ponton', 'atelier', 'foyer'];
const OLD = /\b(Paulette|Marine|Ferdinand|Anatole|Léonie|Gaspard|Rose)\b|dernier alchimiste/;
const LOVES = { potager: 'water', carriere: 'food', bosquet: 'water', puits: 'water', ponton: 'wood', atelier: 'stone', foyer: 'food' };

describe('la troupe de la bible', () => {
  it('chaque rôle est celui du § 8.1', () => {
    expect(Object.fromEntries(IDS.map(id => [id, ROLES[id].label]))).toEqual({
      potager: 'Jardinière des lunes',
      carriere: 'Tailleur de runes',
      bosquet: 'Gardienne des bois',
      puits: 'Petit sourcier',
      ponton: 'Navigatrice',
      atelier: 'Horloger-artificier',
      foyer: 'Cuisinière-guérisseuse'
    });
  });
  it('chacun a son sceau (sa tenue est celle de la bibliothèque : masterArt.js)', () => {
    expect(IDS.every(id => ROLES[id].seal)).toBe(true);
  });
  it('ses répliques (cœurs 0 à 5, cadeau adoré) tiennent en une bulle et ne citent aucun ancien prénom', () => {
    for (const id of IDS) {
      const lines = [0, 1, 2, 3, 4, 5].map(h => talkLine(id, h));
      lines.push(giftLine(id, { loves: LOVES[id], likes: null }, LOVES[id]));
      for (const line of lines) {
        expect(line.length, line).toBeLessThanOrEqual(140);
        expect(line, line).not.toMatch(OLD);
      }
    }
  });
  it('les mots des bouteilles sont signés « H. » et parlent du Grimoire', () => {
    const notes = new Set(Array.from({ length: 400 }, (_, i) => noteOf(`bouteille:${i}`)));
    expect(notes.size).toBe(12);
    for (const note of notes) {
      expect(note.endsWith(' — H.')).toBe(true);
      expect(note).not.toMatch(OLD);
      expect(note).not.toMatch(/Livre/);
    }
  });
  it('Brume ne se présente pas dans ses aides (le tutoriel le fait), et dit « Grimoire »', () => {
    const tips = Object.values(TIPS).flat();
    expect(tips.filter(t => /Je suis Brume/.test(t))).toEqual([]);
    for (const tip of tips) expect(tip).not.toMatch(/Codex|Livre|dernier alchimiste/);
  });
});
