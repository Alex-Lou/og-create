import { describe, it, expect, afterEach } from 'vitest';
import gestures from '@/world/view/gestures';
import { coach } from '@/game/coach';

// Le tutoriel : seule la cible de l'étape se touche (et Brume) ; hors du tutoriel, tout (choix de l'auteur, 13 oct.)
const island = (tutorial = true, parts = {}) => ({ thickMist: () => tutorial, needBubbles: [], looseHens: new Map(), tapNames: gestures.tapNames, ...parts });
const allowed = (ctx, hit) => gestures.tapAllowed.call(ctx, hit);
const aster = { animal: { who: { kind: 'villager', id: 'vil:ponton' } } };
const cannelle = { animal: { who: { kind: 'villager', id: 'vil:foyer' } } };
const bois = { deposit: { kind: 'bois', pickup: true } };

describe('au tutoriel, seul ce que montre l’étape se touche', () => {
  afterEach(() => coach.show(null));

  it('la cible de la leçon (et ses précisions : une trouvaille de cette sorte), Brume toujours ; rien d’autre', () => {
    coach.show({ id: 'quest-aster-caisse', steps: [{ target: 'île:habitant:ponton', text: '' }] });
    expect(allowed(island(), aster)).toBe(true);
    expect(allowed(island(), cannelle)).toBe(false);
    expect(allowed(island(), bois)).toBe(false);
    expect(allowed(island(), { brume: true })).toBe(true);
    coach.show({ id: 'quest-ramasser', steps: [{ target: 'île:trouvaille', text: '' }] });
    expect(allowed(island(), bois)).toBe(true);
  });

  it('une poule qui a faim se touche quand l’étape montre la faim ; sans leçon, seule Brume', () => {
    coach.show({ id: 'quest-poules', steps: [{ target: 'île:faim', text: '' }] });
    const hen = { animal: { who: { beast: 'poule-rousse' } } };
    expect(allowed(island(true, { needBubbles: [{ beast: 'poule-rousse', ready: false }] }), hen)).toBe(true);
    coach.show(null);
    expect(allowed(island(), aster)).toBe(false);
    expect(allowed(island(), { brume: true })).toBe(true);
  });

  it('le panneau du quartier que l’étape montre se touche (La Lisière, jour 6), pas celui d’un autre', () => {
    coach.show({ id: 'quest-lisiere', steps: [{ target: 'île:quartier:lisiere', text: '' }] });
    expect(allowed(island(), { zone: { id: 'lisiere' } })).toBe(true);
    expect(allowed(island(), { zone: { id: 'colline' } })).toBe(false);
  });

  it('hors du tutoriel, tout se touche', () => {
    expect(allowed(island(false), cannelle)).toBe(true);
  });
});
