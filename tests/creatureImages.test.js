// Les images des créatures de l'Athanor (CraftZone) : le chemin du glob doit mener à src/assets/creatures. Un
// déplacement du composant (#173) l'avait rompu sans bruit : aucune image ne s'affichait plus à la révélation.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const FILE = resolve(__dirname, '../src/components/Craft/CraftZone/CraftZone.vue');

describe('images des créatures', () => {
  it('le glob de CraftZone vise le dossier des images, qui en contient', () => {
    const source = readFileSync(FILE, 'utf8');
    const globs = [...source.matchAll(/import\.meta\.glob\('([^']+)'/g)].map(m => m[1]).filter(p => p.includes('creatures'));
    expect(globs).toHaveLength(1);
    const folder = resolve(dirname(FILE), dirname(globs[0]));
    expect(folder).toBe(resolve(__dirname, '../src/assets/creatures'));
    expect(readdirSync(folder).filter(f => f.endsWith('.png')).length).toBeGreaterThan(30);
    // La clé lue par creatureImage suit le même chemin que le glob
    expect(source).toContain(`CREATURES[\`${dirname(globs[0])}/\${name}.png\`]`);
  });
});
