import { describe, it, expect } from 'vitest';
import { ambientOf } from '@/world/lumiere/carte';
import { phase } from './phase';

const lum = hex => [1, 3, 5].reduce((sum, i) => sum + parseInt(hex.slice(i, i + 2), 16), 0);

describe('ambiante', () => {
  it('s\'assombrit la nuit, blanchit au flash', () => {
    const nuit = phase({ tint: '#5a68a6', night: 1 });

    expect(ambientOf(nuit)).not.toBe('#5a68a6');
    expect(lum(ambientOf(nuit, 1))).toBeGreaterThan(lum(ambientOf(nuit)) + 200);
  });
});
