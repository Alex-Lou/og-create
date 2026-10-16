// La veillée du conseil, dessinée hors de la bibliothèque (outils/scenes/conseil.cjs ; choix de l'auteur, 16 oct.) : un
// fond immobile, que SceneArt peint une fois, et un calque animé léger (la flamme, Brume, l'éclair qui couve) ; l'avatar
// de dos, assis, les mains tendues vers le feu qui est devant lui
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sceneOf } from '@/game/sceneArt';
import { SCENES } from '@/texts/tutorial/scenes';

const read = file => readFileSync(fileURLToPath(new URL(`../src/assets/scenes/conseil/${file}`, import.meta.url)), 'utf8');

describe('la veillée du conseil', () => {
  it('le conseil et sa suite se jouent sur elle', () => {
    expect(new Set([...SCENES.conseil, ...SCENES['conseil-suite']].map(frame => frame.scene))).toEqual(new Set(['conseil_veillee']));
    const scene = sceneOf('conseil_veillee');
    expect([scene.frames, scene.back.length, scene.live.length, scene.front.length]).toEqual([1, 1, 1, 1]);
    expect(scene.avatar).toMatchObject({ vue: 'dos', pose: 'assis-mains-tendues' });
  });
  it('un fond immobile, un calque animé léger et sans filtre', () => {
    expect(read('conseil_fond.svg')).not.toMatch(/<animate|<set /);
    const anime = read('conseil_anime.svg');
    const n = (anime.match(/<animate/g) || []).length;
    expect(n).toBeGreaterThan(5);
    expect(n).toBeLessThanOrEqual(30);
    expect(anime).not.toMatch(/<filter/);
  });
});
