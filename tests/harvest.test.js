import { describe, it, expect } from 'vitest';
import { create, chainOk, play, replay, gainOf, hasChain, kindOfPath, streakOf, streakAfter, BASE_KINDS, MOON, SIZE } from '../src/game/harvest';

// Même vecteur que test/harvest.test.js côté serveur : si l'un change, les deux moteurs ont divergé
const SHORT = { stone: 'S', wood: 'W', water: 'E', food: 'F', fish: 'P', lune: 'L' };
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

// Règles 2 (les combos : la lune et la série) : même vecteur que le serveur (graine 2, six longues chaînes)
const SEED2 = 2;
const MOVES2 = [
  [[3, 1], [3, 2], [3, 3], [4, 3], [5, 3], [5, 4], [4, 5], [5, 5]],
  [[0, 3], [1, 4], [2, 3], [1, 2], [2, 1], [3, 0], [4, 0], [3, 1], [4, 2], [4, 3]],
  [[3, 1], [2, 2], [1, 2], [0, 2], [0, 3], [1, 3], [2, 4], [1, 5], [0, 5]],
  [[0, 0], [1, 1], [1, 2], [0, 3], [1, 3], [2, 4], [3, 3], [4, 3], [3, 4], [3, 5], [4, 4], [5, 5]],
  [[1, 0], [1, 1], [0, 2], [1, 3], [2, 2], [3, 1], [4, 1], [4, 2], [3, 3], [2, 3], [2, 4], [3, 4]],
  [[3, 1], [3, 2], [4, 3], [5, 3], [4, 4], [3, 4], [2, 4], [1, 4], [0, 3], [0, 4], [0, 5], [1, 5]]
];

describe('Récolte, règles 2 (même vecteur que le serveur)', () => {
  it('une chaîne de 7 ou plus laisse une lune sur sa dernière case, qui tombe avec les tuiles gardées', () => {
    const game = create(SEED2, BASE_KINDS);
    expect(rows(game.board)).toEqual(['EWWEFE', 'WWFSFS', 'WFESEW', 'FSFSSS', 'SFWEFS', 'WWSESS']);
    expect(play(game, MOVES2[0], 2)).toBe('stone');
    expect([game.moons, game.moon]).toEqual([0, [5, 5]]);
    expect(rows(game.board)).toEqual(['EWWFFF', 'WWFFSE', 'WFESFE', 'FSFEFS', 'SFWEEW', 'WWSEFL']);
    play(game, MOVES2[1], 2);
    expect(rows(game.board)[3]).toBe('WWEELS');
    expect(replay(SEED2, BASE_KINDS, MOVES2, 15, { wood: 2 })).toEqual({ ok: false, error: 'Coup impossible' });
  });
  it('la lune est un joker (+2 par lune), la série monte de 10 % par coup jusqu’à +50 %', () => {
    expect(replay(SEED2, BASE_KINDS, MOVES2, 15, { wood: 2 }, 2)).toEqual({ ok: true, gains: { stone: 45, wood: 31, water: 28, food: 41 }, totals: [12, 28, 59, 87, 112, 145] });
    expect(gainOf('water', 12, {}, { moons: 2, streak: 4, rules: 2 })).toEqual({ resource: 'water', amount: 28 });
    expect(gainOf('fish', 3, { food: 2 }, { moons: 1, streak: 1, rules: 2 })).toEqual({ resource: 'food', amount: 30 });
    expect([1, 2, 3, 6, 9].map(streakOf)).toEqual([1, 1.1, 1.2, 1.5, 1.5]);
    expect([[0, 5], [1, 7], [3, 4], [0, 3]].map(([k, n]) => streakAfter(k, n))).toEqual([1, 2, 0, 0]);
    expect(gainOf('water', 12, {}, { moons: 2, streak: 4 })).toEqual({ resource: 'water', amount: 18 });
  });
  it('une chaîne de lunes seules est refusée ; les lunes comptent dans le minimum et pour une chaîne possible', () => {
    const plain = Array.from({ length: SIZE }, (_, y) => Array.from({ length: SIZE }, (_, x) => (y % 2 ? ['water', 'food'] : ['stone', 'wood'])[x % 2]));
    const board = plain.map((row, y) => row.map((t, x) => (y === 1 && x < 3 ? MOON : t)));
    expect([hasChain(plain), hasChain(board)]).toEqual([false, true]);
    expect(chainOk(board, [[0, 1], [1, 1], [2, 1]])).toBe(false);
    expect(chainOk(board, [[0, 1], [1, 1], [0, 0]])).toBe(true);
    expect(kindOfPath(board, [[0, 1], [1, 1], [0, 0]])).toBe('stone');
    expect(chainOk(board, [[0, 0], [0, 1], [1, 0]])).toBe(false);
  });
});
