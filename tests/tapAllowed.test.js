import { describe, it, expect, afterEach } from 'vitest';
import gestures from '@/world/view/gestures';
import { coach } from '@/game/coach';

// Tout se touche, au tutoriel aussi (choix de l'auteur, 27 oct.) ; la cible de l'étape passe d'abord (et Brume) : ce qui
// est devant elle ne prend pas le toucher (retour de l'auteur, 18 oct.)
const island = (parts = {}) => ({ needBubbles: [], looseHens: new Map(), tapNames: gestures.tapNames, ...parts });
const onStep = (ctx, hit) => gestures.onStep.call(ctx, hit);
const aster = { animal: { who: { kind: 'villager', id: 'vil:ponton' } } };
const cannelle = { animal: { who: { kind: 'villager', id: 'vil:foyer' } } };
const bois = { deposit: { kind: 'bois', pickup: true } };

describe('au tutoriel, la cible de l’étape passe d’abord', () => {
  afterEach(() => coach.show(null));

  it('la cible de la leçon (et ses précisions : une trouvaille de cette sorte), Brume toujours ; pas le reste', () => {
    coach.show({ id: 'quest-aster-caisse', steps: [{ target: 'île:habitant:ponton', text: '' }] });
    expect(onStep(island(), aster)).toBe(true);
    expect(onStep(island(), cannelle)).toBe(false);
    expect(onStep(island(), bois)).toBe(false);
    expect(onStep(island(), { brume: true })).toBe(true);
    coach.show({ id: 'quest-ramasser', steps: [{ target: 'île:trouvaille', text: '' }] });
    expect(onStep(island(), bois)).toBe(true);
  });

  it('une poule qui a faim est la cible quand l’étape montre la faim ; sans leçon, seule Brume', () => {
    coach.show({ id: 'quest-poules', steps: [{ target: 'île:faim', text: '' }] });
    const hen = { animal: { who: { beast: 'poule-rousse' } } };
    expect(onStep(island({ needBubbles: [{ beast: 'poule-rousse', ready: false }] }), hen)).toBe(true);
    coach.show(null);
    expect(onStep(island(), aster)).toBe(false);
    expect(onStep(island(), { brume: true })).toBe(true);
  });

  it('le panneau du quartier que l’étape montre (La Lisière, jour 6), pas celui d’un autre', () => {
    coach.show({ id: 'quest-lisiere', steps: [{ target: 'île:quartier:lisiere', text: '' }] });
    expect(onStep(island(), { zone: { id: 'lisiere' } })).toBe(true);
    expect(onStep(island(), { zone: { id: 'colline' } })).toBe(false);
  });
});

describe('le toucher sur l’île, au tutoriel', () => {
  afterEach(() => coach.show(null));
  // (une île réduite : un toucher prend ce que hitAt trouve ; tapReact note ce qui a été touché)
  const tapped = (hits, lesson) => {
    coach.show(lesson);
    const seen = [];
    const ctx = island({
      thickMist: () => true, ringHit: () => null, tapMode: () => false, tapAtOnce: () => false, dropPick() {}, pickOf: () => null, meetCreature() {},
      hitAt: (x, y, keep) => hits.find(h => !keep || keep(h)) || null,
      tapReact: hit => seen.push(hit)
    });
    ctx.onStep = gestures.onStep;
    gestures.tap.call(ctx, 10, 10);
    return seen[0];
  };

  it('ce qui n’est pas la cible se touche aussi (une trouvaille, un habitant)', () => {
    expect(tapped([bois], { id: 'quest-aster-caisse', steps: [{ target: 'île:habitant:ponton', text: '' }] })).toBe(bois);
  });

  it('la cible cachée derrière quelque chose passe d’abord', () => {
    expect(tapped([bois, aster], { id: 'quest-aster-caisse', steps: [{ target: 'île:habitant:ponton', text: '' }] })).toBe(aster);
  });
});
