import { describe, expect, it } from 'vitest';
import { frenchSpaces } from '@/utils/typo';

describe('typographie française', () => {
  it('colle les guillemets et la ponctuation haute à leur mot', () => {
    expect(frenchSpaces('Fais naître « Porcelaine » !')).toBe('Fais naître «\u00a0Porcelaine\u00a0»\u00a0!');
    expect(frenchSpaces('Déjà collé\u00a0?')).toBe('Déjà collé\u00a0?');
    expect(frenchSpaces(null)).toBe('');
  });
});
