import { describe, it, expect } from 'vitest';
import {
  potOf, overPot, pour, setDown, pourAll, addItem, inPot, stir, lift, stirOnce, overBowl, dip, fill, letGo, serve, starsOf,
  ITEMS, TURNS, LINE, POT, BOWL
} from '@/game/cooking';

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
// Le seau tenu au-dessus de la marmite pendant s secondes, par pas de 1/60 s
const pourFor = (pot, s) => {
  const out = [];
  for (let t = 0; t < s; t += 1 / 60) out.push(pour(pot, 1 / 60));
  return out;
};
// Une marmite au temps de jeter, de touiller, de servir
const watered = () => {
  const pot = potOf();
  pourAll(pot);
  return pot;
};
const filled = () => {
  const pot = watered();
  ITEMS.forEach(id => addItem(pot, id));
  return pot;
};
const ready = () => {
  const pot = filled();
  for (let i = 0; i < TURNS; i++) stirOnce(pot);
  return pot;
};

describe('la marmite d’Agathe : verser', () => {
  it('le seau compte au-dessus de la marmite, pas à côté ni dessous', () => {
    expect(overPot({ x: POT.x + 10, y: POT.y - 20 })).toBe(true);
    expect(overPot({ x: POT.x + 40, y: POT.y - 20 })).toBe(false);
    expect(overPot({ x: POT.x, y: POT.y + 10 })).toBe(false);
  });
  it('l’eau monte tant qu’on tient le seau ; elle annonce le trait doré quand elle l’atteint', () => {
    const pot = potOf();
    const steps = pourFor(pot, 2.5);
    expect(steps.filter(r => r.entered)).toHaveLength(1);
    expect(pot.level).toBeGreaterThanOrEqual(LINE.min);
    expect(pot.level).toBeLessThanOrEqual(LINE.max);
  });
  it('reposé trop tôt, le seau ne passe pas la main : on verse encore', () => {
    const pot = potOf();
    pourFor(pot, 1);
    expect(setDown(pot)).toBe(false);
    expect(pot.phase).toBe('verser');
    pourFor(pot, 1.5);
    expect(setDown(pot)).toBe(true);
    expect(pot.phase).toBe('jeter');
    expect(pot.line).toBe(true);
  });
  it('trop d’eau : ça déborde (un effet, pas un échec), l’étoile du trait s’en va', () => {
    const pot = potOf();
    const steps = pourFor(pot, 5);
    expect(steps.some(r => r.overflow)).toBe(true);
    expect(pot.level).toBe(1);
    expect(setDown(pot)).toBe(true);
    expect(pot.line).toBe(false);
  });
  it('au-dessus du trait sans déborder : on passe, sans l’étoile', () => {
    const pot = potOf();
    pourFor(pot, 3.1);
    expect(pot.level).toBeGreaterThan(LINE.max);
    expect(setDown(pot)).toBe(true);
    expect(pot.line).toBe(false);
  });
  it('au clavier : l’eau juste au trait, d’un coup', () => {
    const pot = potOf();
    expect(pourAll(pot)).toBe(true);
    expect(pot.line).toBe(true);
    expect(pourAll(pot)).toBe(false);
  });
  it('le seau ne verse plus une fois l’eau versée', () => {
    const pot = watered();
    const level = pot.level;
    pourFor(pot, 1);
    expect(pot.level).toBe(level);
  });
});

describe('la marmite d’Agathe : jeter', () => {
  it('rien ne tombe avant l’eau ; chaque ingrédient tombe une fois ; le dernier ouvre le temps de touiller', () => {
    expect(addItem(potOf(), 'coquillages')).toBe(false);
    const pot = watered();
    expect(addItem(pot, 'coquillages')).toBe(true);
    expect(addItem(pot, 'coquillages')).toBe(false);
    expect(addItem(pot, 'caillou')).toBe(false);
    expect(pot.phase).toBe('jeter');
    expect(addItem(pot, 'algues')).toBe(true);
    expect(pot.phase).toBe('touiller');
    expect(pot.added).toEqual(['coquillages', 'algues']);
  });
  it('un lâcher compte dans la marmite, pas à côté', () => {
    expect(inPot({ x: POT.x + 5, y: POT.y - 5 })).toBe(true);
    expect(inPot({ x: 5, y: 115 })).toBe(false);
  });
});

describe('la marmite d’Agathe : touiller', () => {
  it('on ne touille pas avant les ingrédients, et on ne met plus rien une fois qu’on touille', () => {
    const pot = watered();
    expect(circle(pot, 4).some(r => r.turned)).toBe(false);
    expect(pot.turns).toBe(0);
    ITEMS.forEach(id => addItem(pot, id));
    expect(addItem(pot, 'coquillages')).toBe(false);
  });
  it('trois tours, sans se presser : on passe au service, sans éclabousser', () => {
    const pot = filled();
    const done = circle(pot, TURNS + 0.1, { s: (TURNS + 0.1) * 1.2 });
    expect(done.filter(r => r.turned)).toHaveLength(TURNS);
    expect(done.some(r => r.splash)).toBe(false);
    expect(pot.splashed).toBe(false);
    expect(pot.phase).toBe('servir');
  });
  it('dans l’autre sens aussi ; un retour en arrière défait le tour pas fini', () => {
    const pot = filled();
    circle(pot, 1.1, { dir: -1 });
    expect(pot.turns).toBe(1);
    const back = filled();
    circle(back, 0.9);
    circle(back, 0.5, { from: 2, dir: -1, start: 0.9 * 2 * Math.PI });
    expect(back.turns).toBe(0);
    expect(back.angle).toBeCloseTo(0.4 * 2 * Math.PI, 5);
  });
  it('trop vite, ça éclabousse (un effet, pas un échec : le tour compte quand même, l’étoile s’en va)', () => {
    const pot = filled();
    const fast = circle(pot, 1.2, { s: 0.3 });
    expect(fast.some(r => r.splash)).toBe(true);
    expect(pot.turns).toBe(1);
    expect(pot.splashed).toBe(true);
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
});

describe('la marmite d’Agathe : servir', () => {
  it('la louche compte au-dessus du bol, pas ailleurs', () => {
    expect(overBowl({ x: BOWL.x - 4, y: BOWL.y - 12 })).toBe(true);
    expect(overBowl({ x: POT.x, y: POT.y })).toBe(false);
  });
  it('la louche plonge et se remplit ; elle verse dans le bol, qui attend au bord tant que ce n’est pas payé', () => {
    const pot = ready();
    expect(fill(pot, 1, true)).toBe(false);
    expect(dip(pot)).toBe(true);
    expect(pot.ladle).toBe(1);
    for (let i = 0; i < 120; i++) fill(pot, 1 / 60, false);
    expect(pot.bowl).toBeCloseTo(0.9, 5);
    expect(serve(pot)).toBe(false);
    let full = false;
    for (let i = 0; i < 60 && !full; i++) full = fill(pot, 1 / 60, true);
    expect(full).toBe(true);
    expect(serve(pot)).toBe(true);
    expect(pot.phase).toBe('fin');
  });
  it('pleine, lâchée hors du bol : elle se renverse (l’étoile s’en va) ; au-dessus du bol, elle revient sans rien perdre', () => {
    const pot = ready();
    dip(pot);
    expect(letGo(pot, true)).toBe(false);
    expect(pot.spilled).toBe(false);
    dip(pot);
    expect(letGo(pot, false)).toBe(true);
    expect(pot.spilled).toBe(true);
    expect(pot.ladle).toBe(0);
  });
  it('une louche vide lâchée n’importe où ne renverse rien', () => {
    const pot = ready();
    dip(pot);
    for (let i = 0; i < 120; i++) fill(pot, 1 / 60, true);
    expect(letGo(pot, false)).toBe(false);
    expect(pot.spilled).toBe(false);
  });
  it('servie seulement au temps du service, le bol plein', () => {
    const pot = filled();
    expect(serve(pot)).toBe(false);
    for (let i = 0; i < TURNS; i++) stirOnce(pot);
    expect(serve(pot)).toBe(false);
  });
  it('les trois étoiles disent la justesse : l’eau au trait, sans éclabousser, sans renverser', () => {
    const pot = ready();
    expect(starsOf(pot)).toEqual({ line: true, gentle: true, clean: true });
    const messy = potOf();
    pourFor(messy, 5);
    setDown(messy);
    ITEMS.forEach(id => addItem(messy, id));
    circle(messy, 1.2, { s: 0.3 });
    for (let i = 0; i < TURNS; i++) stirOnce(messy);
    dip(messy);
    letGo(messy, false);
    expect(starsOf(messy)).toEqual({ line: false, gentle: false, clean: false });
  });
});
