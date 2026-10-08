import { describe, it, expect } from 'vitest';
import { create, chainOk, play, replay, BASE_KINDS } from '../src/game/harvest';

// Même vecteur que test/harvest.test.js côté serveur : si l'un change, les deux moteurs ont divergé
const SHORT = { stone: 'S', wood: 'W', water: 'E', food: 'F', fish: 'P' };
const rows = board => board.map(row => row.map(k => SHORT[k]).join(''));
const SEED = 12345;
const START = ['FWWFEW', 'SFFFWF', 'FFESWW', 'FFEFFE', 'WSWSFS', 'WSEFWS'];
const MOVES = [[[0, 0], [1, 1], [2, 1]], [[2, 0], [3, 0], [3, 1]], [[3, 0], [4, 0], [3, 1]], [[2, 0], [3, 1], [3, 2]]];
const END = ['SEFEEW', 'SWWFWF', 'FFEFWW', 'FFEFFE', 'WSWSFS', 'WSEFWS'];

describe('Récolte (moteur partagé avec le serveur)', () => {
  it('même graine, même plateau, mêmes chutes', () => {
    const game = create(SEED, BASE_KINDS);
    expect(rows(game.board)).toEqual(START);
    for (const path of MOVES) {
      expect(chainOk(game.board, path)).toBe(true);
      play(game, path);
    }
    expect(rows(game.board)).toEqual(END);
  });
  it('même gain que le serveur', () => {
    expect(replay(SEED, BASE_KINDS, MOVES, 15, { stone: 2 })).toEqual({ ok: true, gains: { stone: 6, wood: 0, water: 3, food: 6 }, totals: [3, 6, 9, 15] });
    expect(replay(SEED, BASE_KINDS, [[[0, 0], [1, 1]]], 15).ok).toBe(false);
  });
});
