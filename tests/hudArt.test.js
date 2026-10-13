import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Les pièces du HUD de la bibliothèque (design/bibliotheque/svg/hud) que le CSS du jeu pose en border-image ou en fond :
// chacune existe, et la découpe d'un cadre étiré est bien sa tranche (hud.json : tranche_fichier), sans quoi ses coins
// s'étireraient
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const HUD = join(ROOT, 'design/bibliotheque/svg/hud');
const pieces = JSON.parse(readFileSync(join(HUD, 'hud.json'), 'utf8')).pieces;
const styles = [];
const walk = dir => readdirSync(dir).forEach(name => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (/\.(css|vue)$/.test(name)) styles.push([path.slice(ROOT.length), readFileSync(path, 'utf8')]);
});
walk(join(ROOT, 'src'));

describe('les pièces du HUD dans le CSS du jeu', () => {
  const uses = styles.flatMap(([file, text]) => [...text.matchAll(/svg\/hud\/([\w]+)\.svg'\)(?:\s+([\d ]+)\s+fill)?/g)].map(([, id, cut]) => ({ file, id, cut })));

  it('chaque pièce citée existe', () => {
    expect(uses.length).toBeGreaterThan(20);
    for (const { file, id } of uses) expect(existsSync(join(HUD, `${id}.svg`)) && Boolean(pieces[id]), `${file} : ${id}`).toBe(true);
  });

  it('un cadre étiré est découpé à sa tranche', () => {
    for (const { file, id, cut } of uses.filter(u => u.cut)) {
      expect(pieces[id].tranche_fichier, `${file} : ${id}`).toEqual(cut.trim().split(/\s+/).map(Number));
    }
  });
});
