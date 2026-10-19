import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Les couches du jeu : la logique (world, game, book) ne parle pas au serveur et ne dépend d'aucun composant ; les
// petits outils (utils) non plus d'un composant. Les appels au serveur passent par src/services, depuis les composants.
const SRC = join(__dirname, '..', 'src');

function filesOf(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return filesOf(path);
    return /\.(js|vue)$/.test(name) ? [path] : [];
  });
}

const importsOf = path => [...readFileSync(path, 'utf8').matchAll(/(?:from|import\()\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const reaches = (spec, folder) => spec.startsWith(`@/${folder}/`) || new RegExp(`(^|/)\\.\\.?/(\\.\\./)*${folder}/`).test(spec);

function offenders(folders, forbidden) {
  return folders.flatMap(folder => filesOf(join(SRC, folder)).flatMap(path => importsOf(path)
    .filter(spec => forbidden.some(f => reaches(spec, f)))
    .map(spec => `${relative(SRC, path)} → ${spec}`)));
}

describe('les couches du jeu', () => {
  it('world, game et book n’importent ni service ni composant', () => {
    expect(offenders(['world', 'game', 'book'], ['services', 'components'])).toEqual([]);
  });
  it('utils n’importe aucun composant', () => {
    expect(offenders(['utils'], ['components'])).toEqual([]);
  });
});
