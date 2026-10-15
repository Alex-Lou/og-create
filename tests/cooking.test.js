import { describe, it, expect } from 'vitest';
import { potOf, addItem, inPot, stir, lift, stirOnce, inBowl, serve, ITEMS, TURNS, POT, BOWL } from '@/game/cooking';

// Le doigt fait n tours autour du centre (rayon r, en rayons de la marmite), en s secondes, par petits pas
const circle = (pot, n, { r = 0.8, s = n, from = 0, dir = 1, start = 0 } = {}) => {
  const out = [];
  const steps = Math.ceil(n * 24);
  for (let i = 0; i <= steps; i++) {
    const a = start + dir * (i / steps) * n * 2 * Math.PI;
    out.push(stir(pot, { x: Math.cos(a) * r, y: Math.sin(a) * r }, from + (i / steps) * s));
  }
  return out;
};
const filled = () => {
  const pot = potOf();
  ITEMS.forEach(id => addItem(pot, id));
  return pot;
};

describe('la marmite d’Agathe', () => {
  it('chaque ingrédient tombe une fois ; le dernier ouvre le temps de touiller', () => {
    const pot = potOf();
    expect(pot.phase).toBe('mettre');
    expect(addItem(pot, 'coquillages')).toBe(true);
    expect(addItem(pot, 'coquillages')).toBe(false);
    expect(addItem(pot, 'caillou')).toBe(false);
    expect(addItem(pot, 'eau')).toBe(true);
    expect(pot.phase).toBe('mettre');
    expect(addItem(pot, 'algues')).toBe(true);
    expect(pot.phase).toBe('touiller');
    expect(pot.added).toEqual(['coquillages', 'eau', 'algues']);
  });
  it('on ne touille pas une marmite vide, et on ne met plus rien une fois qu’on touille', () => {
    const pot = potOf();
    expect(circle(pot, 4).some(r => r.turned)).toBe(false);
    expect(pot.turns).toBe(0);
    ITEMS.forEach(id => addItem(pot, id));
    expect(addItem(pot, 'coquillages')).toBe(false);
  });
  it('un lâcher compte dans la marmite ou près du bol, pas à côté', () => {
    expect(inPot({ x: POT.x + 5, y: POT.y - 5 })).toBe(true);
    expect(inPot({ x: 5, y: 95 })).toBe(false);
    expect(inBowl({ x: BOWL.x - 4, y: BOWL.y + 3 })).toBe(true);
    expect(inBowl({ x: POT.x, y: POT.y })).toBe(false);
  });
  it('trois tours, sans se presser : on passe au service, sans éclabousser', () => {
    const pot = filled();
    const done = circle(pot, TURNS + 0.1, { s: (TURNS + 0.1) * 1.2 });
    expect(done.filter(r => r.turned)).toHaveLength(TURNS);
    expect(done.some(r => r.splash)).toBe(false);
    expect(pot.phase).toBe('servir');
  });
  it('dans l’autre sens aussi ; un retour en arrière défait le tour pas fini', () => {
    const pot = filled();
    circle(pot, 1.1, { dir: -1 });
    expect(pot.turns).toBe(1);
    const back = potOf();
    ITEMS.forEach(id => addItem(back, id));
    circle(back, 0.9);
    circle(back, 0.5, { from: 2, dir: -1, start: 0.9 * 2 * Math.PI });
    expect(back.turns).toBe(0);
    expect(back.angle).toBeCloseTo(0.4 * 2 * Math.PI, 5);
  });
  it('trop vite, ça éclabousse (un effet, pas un échec : le tour compte quand même)', () => {
    const pot = filled();
    const fast = circle(pot, 1.2, { s: 0.3 });
    expect(fast.some(r => r.splash)).toBe(true);
    expect(pot.turns).toBe(1);
  });
  it('le doigt trop près du centre ou hors de la marmite ne compte pas ; lever le doigt repart de sa place', () => {
    const pot = filled();
    circle(pot, 2, { r: 0.1 });
    circle(pot, 2, { r: 3 });
    expect(pot.turns).toBe(0);
    stir(pot, { x: 0.8, y: 0 }, 0);
    lift(pot);
    // (un saut d'un demi-tour après le doigt levé ne compte pas)
    stir(pot, { x: -0.8, y: 0 }, 0.1);
    expect(pot.angle).toBe(0);
  });
  it('au clavier : un tour à chaque appui', () => {
    const pot = filled();
    for (let i = 0; i < TURNS; i++) expect(stirOnce(pot)).toBe(true);
    expect(pot.phase).toBe('servir');
    expect(stirOnce(pot)).toBe(false);
  });
  it('servie seulement au temps du service', () => {
    const pot = filled();
    expect(serve(pot)).toBe(false);
    for (let i = 0; i < TURNS; i++) stirOnce(pot);
    expect(serve(pot)).toBe(true);
    expect(pot.phase).toBe('fin');
  });
});
