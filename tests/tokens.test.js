import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Jetons de design (src/styles/tokens) : un jeton en canaux (--x-rgb: r, g, b), qui sert à écrire une couleur à toute
// transparence, doit garder la valeur de sa couleur (--x: #rrggbb), en clair comme en Veillée
const DIR = fileURLToPath(new URL('../src/styles/tokens/', import.meta.url));
const read = file => Object.fromEntries([...readFileSync(DIR + file, 'utf8').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));
const light = Object.assign({}, ...readdirSync(DIR).filter(f => f.endsWith('.css') && f !== 'dark.css').map(read));
const dark = read('dark.css');

describe('jetons de design', () => {
  const pairs = Object.keys(light).filter(k => k.endsWith('-rgb') && light[k.slice(0, -4)]);

  it('un canal garde la valeur de sa couleur', () => {
    expect(pairs.length).toBeGreaterThan(0);
    for (const k of pairs) {
      const hex = light[k.slice(0, -4)];
      expect(hex, k).toMatch(/^#[0-9a-f]{6}$/);
      expect(light[k], k).toBe([1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', '));
    }
  });

  it('une couleur doublée de ses canaux ne change pas seule en Veillée', () => {
    for (const k of pairs) expect(k.slice(0, -4) in dark && !(k in dark), k).toBe(false);
  });
});
