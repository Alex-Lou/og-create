import { describe, it, expect } from 'vitest';
import gestures from '@/world/view/gestures';
import { ARRIVAL_WELCOME } from '@/texts/world/screens/folk';

// Le toucher en deux temps : un premier toucher choisit (un bouton, un contour), le second ouvre ; ce qui ne fait que
// réagir (une bête sauvage, Brume, une case libre) ne se choisit pas
const OPENS = ['openBeast', 'openArrival', 'openVillager', 'talkVillager', 'openChest', 'buildShelter', 'openCage', 'openCraftMenu', 'findLandmark', 'gatherDeposit'];
function island(parts = {}) {
  const opened = [];
  return {
    ...gestures,
    opened,
    state: { arrival: { name: 'Mila', moment: 'ponton' }, shelters: { agathe: { open: true, built: false, cost: { bois: 2 } } }, camp: [], annexes: [], finds: [], map: { zones: [{ id: 'crique', owned: true }, { id: 'falaise', owned: false }] } },
    village: null, clock: 0, loadedAt: 0, bottleSpot: { x: 0, y: 0 },
    tipOf: () => ({}), named: () => null, ground: () => ({ x: 0, y: 0 }), centerOf: () => ({ x: 0, y: 0 }), canvasPoint: () => ({}),
    friendOf: () => null, beastOf: () => null, guestOf: () => false, signShown: () => true,
    ...Object.fromEntries(OPENS.map(name => [name, () => opened.push(name)])),
    ...parts
  };
}
// Ce que choisit le premier toucher (sa clé, son bouton) et ce qu'ouvre le second ; null s'il ne choisit rien
function picked(hit, parts) {
  const ctx = island(parts);
  const pick = ctx.pickOf(hit, 0, 0);
  if (!pick) return null;
  pick.run();
  return [pick.key, pick.action, ctx.opened.join(' ')];
}
const at = { x: 0, y: 0, r: 4 };
const villager = { kind: 'villager', id: 'vil:ponton' };

describe('un premier toucher choisit, le second ouvre', () => {
  it('une bête qui réclame, un habitant qui réclame, l’arrivant : leur fiche, ou l’accueil', () => {
    expect(picked({ asking: { beast: 'vache', ...at } })).toEqual(['ask:beast:vache', 'Sa fiche', 'openBeast']);
    expect(picked({ asking: { id: 'ponton', ...at } })).toEqual(['ask:ponton', 'Sa fiche', 'openVillager']);
    expect(picked({ asking: { visitor: true, ...at } })).toEqual(['ask:visitor', ARRIVAL_WELCOME.welcome, 'openArrival']);
    expect(picked({ animal: { kind: 'vboat', ...at } })).toEqual(['visitor', ARRIVAL_WELCOME.welcome, 'openArrival']);
  });

  it('un camarade qui fait la sieste se réveille (on lui parle) ; éveillé, sa fiche ; une bête de la ferme, la sienne', () => {
    const friend = { friendOf: () => ({ id: 'ponton' }) };
    expect(picked({ animal: { who: { ...villager, pose: 'sleep' }, ...at } }, friend)).toEqual(['vil:ponton', 'Le réveiller', 'openVillager talkVillager']);
    expect(picked({ animal: { who: villager, ...at } }, friend)).toEqual(['vil:ponton', 'Sa fiche', 'openVillager']);
    expect(picked({ animal: { who: { beast: 'vache' }, ...at } }, { beastOf: () => ({}) })).toEqual(['beast:vache', 'Sa fiche', 'openBeast']);
  });

  it('les choses : la bouteille, le coin d’un abri à bâtir, la cage, une création', () => {
    expect(picked({ bottle: true })).toEqual(['bottle', 'L’ouvrir', 'openChest']);
    expect(picked({ campItem: { id: 'agathe', x: 0, y: 0, w: 2, h: 2 } })).toEqual(['coin:agathe', 'Bâtir son abri', 'buildShelter']);
    expect(picked({ cage: { x: 0, y: 0 } })).toEqual(['cage', 'L’ouvrir', 'openCage']);
    expect(picked({ craft: { x: 1, y: 2, craft: 'banc' } })).toEqual(['craft:1,2', 'La déplacer ou la ranger', 'openCraftMenu']);
  });

  it('les lieux : un lieu à découvrir, un gisement prêt (dans un quartier à soi), un bâtiment', () => {
    expect(picked({ landmark: { id: 'phare', zone: 'crique', x: 0, y: 0, found: false } })).toEqual(['landmark:phare', 'Le découvrir', 'findLandmark']);
    expect(picked({ deposit: { id: 'd1', zone: 'crique', x: 0, y: 0, pickup: true, readyIn: 0 } })).toEqual(['deposit:d1', 'Ramasser', 'gatherDeposit']);
    expect(picked({ deposit: { id: 'd1', zone: 'falaise', x: 0, y: 0, pickup: true, readyIn: 0 } })).toBe(null);
    expect(picked({ site: { id: 'atelier', level: 0, w: 2, h: 2 } })).toEqual(['site:atelier', 'Bâtir', '']);
    expect(picked({ site: { id: 'foyer', level: 2, w: 2, h: 2 } })).toEqual(['site:foyer', 'Sa fiche', '']);
  });

  it('ce qui ne fait que réagir ne se choisit pas : une bête sauvage, Brume, une case libre', () => {
    expect(picked({ animal: { who: null, ...at } })).toBe(null);
    expect(picked({ brume: true })).toBe(null);
    expect(picked({ cell: { x: 0, y: 0 } })).toBe(null);
  });
});
