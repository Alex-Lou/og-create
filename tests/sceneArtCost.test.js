import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Une scène du tutoriel (SceneArt) pose son fond animé une seule fois : ses copies (le fond flouté, les bords
// prolongés) sont une image fixe. Le fond de la veillée a plus de 400 animations : posé quatre fois, dont trois à
// travers un flou, il figeait le téléphone au geste de la bûche (15 oct.)
const TEMPLATE = readFileSync(fileURLToPath(new URL('../src/components/Prologue/SceneArt/SceneArt.vue', import.meta.url)), 'utf8').split('<script>')[0];

describe('le coût d’une scène du tutoriel', () => {
  it('le fond animé n’est posé qu’une fois, dans le carré', () => {
    expect(TEMPLATE.match(/data\.back\[0\]/g) || []).toHaveLength(0);
    expect(TEMPLATE.match(/v-for="\(href, k\) in data\.back"/g)).toHaveLength(1);
  });
  it('le fond flouté et les bords sont des canvas peints une fois', () => {
    for (const cls of ['sa__backdrop', 'sa__edge--top', 'sa__edge--bottom']) expect(TEMPLATE).toMatch(new RegExp(`<canvas [^>]*class="[^"]*${cls}`));
  });
});
