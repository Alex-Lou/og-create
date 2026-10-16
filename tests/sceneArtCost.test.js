import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Une scène du tutoriel (SceneArt) est peinte une fois par image de la scène, dans deux canvas : ses dessins (le fond
// de la veillée a plus de 400 animations) ne sont plus posés tels quels, que le navigateur repeignait à chaque image de
// l'écran (la scène du conseil ramait, 16 oct.) ; rien n'y est flouté (choix de l'auteur, 16 oct. : des images claires)
const read = file => readFileSync(fileURLToPath(new URL(`../src/components/Prologue/SceneArt/${file}`, import.meta.url)), 'utf8');
const TEMPLATE = read('SceneArt.vue').split('<script>')[0];
const CSS = read('SceneArt.css');

describe('le coût d’une scène du tutoriel', () => {
  it('le fond, l’avatar et le devant sont peints dans deux canvas ; seul le calque « anime » se joue tel quel', () => {
    const [plans, image] = TEMPLATE.split('<div v-else');
    expect(image.match(/<canvas ref="(under|over)"/g)).toHaveLength(2);
    expect(TEMPLATE).not.toMatch(/data\.(back|front)/);
    expect(TEMPLATE).not.toMatch(/<image /);
    expect(image.match(/v-for="\(href, k\) in data\.live"/g)).toHaveLength(1);
    // (une scène en plans : ScenePlans peint ses plans, une fois chacun ; l'avatar dans son canvas, le calque anime tel quel)
    expect(plans.match(/<canvas ref="over"/g)).toHaveLength(1);
    expect(plans.match(/v-for="\(href, k\) in data\.live"/g)).toHaveLength(1);
    expect(read('ScenePlans.vue')).toMatch(/<canvas v-else/);
  });
  it('rien n’est flouté', () => {
    expect(CSS).not.toMatch(/blur\(/);
    expect(read('ScenePlans.vue')).not.toMatch(/blur\(/);
    expect(TEMPLATE).not.toMatch(/sa__backdrop|sa__edge/);
  });
});
