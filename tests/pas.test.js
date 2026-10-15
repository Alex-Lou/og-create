// Sous les pas des habitants (world/pas.js) : ce que soulève chaque sol, et quand.
import { describe, expect, it } from 'vitest';
import { solDePas, pasOf, bouffeesOf } from '@/world/pas';

describe('sous les pas', () => {
  it('le sable fait une bouffée claire, le chemin de la poussière ; l’herbe sèche rien ; mouillé, des gouttes', () => {
    expect(solDePas('s')).toBe('sable');
    expect(solDePas('d')).toBe('sable');
    expect(solDePas('p')).toBe('terre');
    expect(solDePas('g')).toBe(null);
    expect(solDePas('b')).toBe(null);
    expect(solDePas('s', 0.5)).toBe('eau');
    expect(solDePas('g', 0.5)).toBe(null);
    expect(solDePas('g', 0.8)).toBe('eau');
  });

  it('un pas tous les tiers de seconde, un pied puis l’autre ; chaque bouffée vit un peu plus d’une demi-seconde', () => {
    const vus = pasOf(1.01);
    expect(vus.length).toBeGreaterThan(0);
    expect(vus.length).toBeLessThanOrEqual(3);
    expect(vus.every(p => p.age >= 0 && p.age < 1)).toBe(true);
    const [a, b] = pasOf(1.2);
    if (b) expect(a.cote).toBe(-b.cote);
    // (deux marcheurs ne posent pas le pied ensemble)
    expect(pasOf(1.01, 0)[0].age).not.toBeCloseTo(pasOf(1.01, 0.5)[0].age, 3);
  });

  it('la bouffée grandit, monte et s’efface ; les gouttes sautent et retombent', () => {
    const tot = bouffeesOf('sable', 0.2, 1), tard = bouffeesOf('sable', 0.9, 1);
    expect(tard[0].r).toBeGreaterThan(tot[0].r);
    expect(tard[0].dy).toBeLessThan(tot[0].dy);
    expect(tard[0].a).toBeLessThan(tot[0].a);
    const gouttes = bouffeesOf('eau', 0.5, -1).filter(b => !b.rond);
    expect(gouttes.every(b => b.dy < 0)).toBe(true);
    expect(bouffeesOf('eau', 0.999, -1).filter(b => !b.rond).every(b => Math.abs(b.dy) < 0.1)).toBe(true);
  });
});
