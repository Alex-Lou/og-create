// Le suivi des quêtes (world/tracker.js) : la quête principale (le tutoriel tant qu'il dure) et ce qui attend ailleurs
import { describe, it, expect } from 'vitest';
import { mainOf, todoOf, MAX_TODO } from '@/world/tracker';

const quest = over => ({ id: 'feu', act: 'T', step: 3, total: 60, label: 'Bâtis le feu de camp', have: 0, need: 1, done: false, coins: 20, ...over });

describe('quête principale', () => {
  it('le tutoriel tant que Brume guide ; sinon l’acte ; prête à réclamer', () => {
    expect(mainOf({ quest: quest(), tutorial: true, skipped: false })).toMatchObject({ tag: 'Tutoriel', tutorial: true, label: 'Bâtis le feu de camp', done: false, coins: 20 });
    expect(mainOf({ quest: quest({ id: 'lisiere', act: 'I' }), tutorial: true })).toMatchObject({ tag: 'Acte I', tutorial: false });
    expect(mainOf({ quest: quest({ id: 'feu', act: 'T' }), tutorial: false })).toMatchObject({ tag: 'Tutoriel', tutorial: false });
    expect(mainOf({ quest: quest({ id: 'ramasser', act: 'I', have: 6, need: 6, done: true }), tutorial: true, skipped: true })).toMatchObject({ tag: 'Acte I', done: true, have: 6, need: 6 });
  });
  it('toutes les quêtes faites : l’île apaisée ; rien du serveur : rien', () => {
    expect(mainOf({ quest: null, rested: 'La brume s’est levée.' })).toMatchObject({ rested: true, label: 'La brume s’est levée.' });
    expect(mainOf({ quest: null })).toBeNull();
    expect(mainOf(null)).toBeNull();
  });
});

describe('à faire aussi', () => {
  const sites = [{ id: 'foyer', name: 'Le Foyer' }, { id: 'puits', name: 'Le Puits' }];
  it('du plus pressant au moins pressant, chaque ligne dit ce qu’elle ouvre', () => {
    const state = {
      sites,
      nights: { blight: { site: 'puits' } },
      villagers: [
        { id: 'puits', name: 'Ondin', asleep: true, needs: [{ id: 'manger', met: false }] }, // il dort : sa quête le réveillera
        { id: 'foyer', name: 'Cannelle', needs: [{ id: 'manger', met: false, cost: { food: 2 } }] },
        { id: 'atelier', name: 'Rivet', needs: [{ id: 'outils', met: false, cost: { stone: 9 } }] }, // trop cher : pas encore
        { id: 'ponton', name: 'Aster', needs: [{ id: 'manger', met: true }] }
      ],
      visitor: { name: 'Pip', satisfied: false, request: { kind: 'livrer', resource: 'wood', amount: 3 } },
      beasts: { list: [{ id: 'b1', name: 'Paprika', fed: false, ready: 0 }, { id: 'b2', name: 'Brioche', fed: true, ready: 2 }] },
      crafts: { catalog: [{ id: 'lanterne', name: 'Lanterne', reserve: 1, spots: [[1, 2]] }, { id: 'banc', name: 'Banc', reserve: 1, spots: [] }] }
    };
    const todo = todoOf({ state, stock: { food: 5, wood: 3, stone: 1 }, chests: 2, landmarks: [{ id: 'menhir' }], deposits: 1, buildable: [sites[0]] });
    expect(todo.map(t => [t.kind, t.arg ?? null, t.text])).toEqual([
      ['site', 'puits', 'Répare Le Puits'],
      ['villager', 'foyer', 'Cannelle a faim'],
      ['visitor', null, 'Pip attend sa demande'],
      ['beast', 'b1', 'Paprika a faim'],
      ['beast', 'b2', 'Tes bêtes ont quelque chose pour toi'],
      ['chests', null, '2 coffres à ouvrir'],
      ['build', 'foyer', 'Le Foyer peut grandir'],
      ['craft', 'lanterne', 'Pose : Lanterne'],
      ['landmark', 'menhir', '1 lieu à découvrir'],
      ['finds', null, '1 gisement prêt']
    ]);
    expect(new Set(todo.map(t => t.id)).size).toBe(todo.length);
    expect(MAX_TODO).toBe(4);
  });
  it('un voyageur comblé s’installe s’il reste une maison ; plusieurs bêtes affamées comptées ; rien sans île', () => {
    const base = { sites, villagers: [] };
    expect(todoOf({ state: { ...base, visitor: { name: 'Pip', satisfied: true, request: { kind: 'livrer' } }, houses: { total: 2, used: 1 } } })[0].text).toBe('Pip peut s’installer');
    expect(todoOf({ state: { ...base, visitor: { name: 'Pip', satisfied: true, request: { kind: 'livrer' } }, houses: { total: 1, used: 1 } } })).toEqual([]);
    expect(todoOf({ state: { ...base, beasts: { list: [{ id: 'a', fed: false }, { id: 'b', fed: false }] } } })[0].text).toBe('2 bêtes ont faim');
    expect(todoOf({ state: null })).toEqual([]);
    expect(todoOf({ state: base })).toEqual([]);
  });
});
