// Les dessins de la bibliothèque dans le jeu (src/world/library.js : textsOf) : émis tels quels par le build (jamais un
// module de code par dessin, jamais intégrés au code), lus une fois par fetch, gardés par le service worker
import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { textsOf } from '@/world/library';
import { libraryInline, libraryUrls } from '../vite.library.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"/>';
const served = (body, { status = 200, type = 'image/svg+xml' } = {}) => vi.fn(async () => new Response(body, { status, headers: { 'content-type': type } }));
// (chaque test a ses adresses : un dessin lu le reste pour tout le module)
let n = 0;
const fresh = () => `/img/dessin-${++n}.svg`;

describe('les dessins lus en texte', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('gardent leurs clés et se lisent une fois', async () => {
    const fetcher = served(svg);
    vi.stubGlobal('fetch', fetcher);
    const url = fresh();
    const files = textsOf({ '/design/bibliotheque/svg/a.svg': url });
    expect(Object.keys(files)).toEqual(['/design/bibliotheque/svg/a.svg']);
    expect(await files['/design/bibliotheque/svg/a.svg']()).toBe(svg);
    expect(await files['/design/bibliotheque/svg/a.svg']()).toBe(svg);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe(url);
  });

  it('un fichier absent, ou la page du jeu à sa place, échoue ; il se relit à la demande suivante', async () => {
    const url = fresh();
    const files = textsOf({ a: url });
    vi.stubGlobal('fetch', served('', { status: 404 }));
    await expect(files.a()).rejects.toThrow(url);
    vi.stubGlobal('fetch', served('<!doctype html>', { type: 'text/html' }));
    await expect(files.a()).rejects.toThrow(url);
    vi.stubGlobal('fetch', served(svg));
    expect(await files.a()).toBe(svg);
  });
});

describe('les dessins dans le build', () => {
  const sources = dir => readdirSync(ROOT + dir, { recursive: true }).filter(f => /\.(js|vue)$/.test(f)).map(f => ({ file: `${dir}/${f}`, code: readFileSync(`${ROOT}${dir}/${f}`, 'utf8') }));
  const globs = sources('src').flatMap(({ file, code }) => [...code.matchAll(/import\.meta\.glob\(\s*(\[[\s\S]*?\]|'[^']*')\s*,\s*(\{[^}]*\})/g)].map(m => ({ file, patterns: m[1], options: m[2] })));

  it('aucun ne devient un module de code (un fichier JS par dessin : le build manquait de mémoire)', () => {
    const library = globs.filter(g => g.patterns.includes('/design/bibliotheque/'));
    expect(library.length).toBeGreaterThan(20);
    expect(library.filter(g => g.options.includes('?raw')).map(g => g.file)).toEqual([]);
  });

  it('restent des fichiers, dans un dossier que le service worker garde', () => {
    expect(libraryInline('/srv/og-create/design/bibliotheque/svg/plantes/touffe.svg')).toBe(false);
    expect(libraryInline('/srv/og-create/src/assets/success/premier.png')).toBeUndefined();
    expect(readFileSync(ROOT + 'vite.config.mjs', 'utf8')).toMatch(/assetsInlineLimit: libraryInline/);
    expect(readFileSync(ROOT + 'public/sw.js', 'utf8')).toMatch(/STATIC_PREFIXES = \[[^\]]*'\/img\/'/);
  });

  it('en développement et sous vitest, leurs adresses s’écrivent sans un module par dessin', () => {
    const plugin = libraryUrls();
    plugin.configResolved({ root: '/srv/og-create' });
    // (composé ici : écrit en clair, le plugin de vitest.config.mjs le transformerait aussi dans ce fichier)
    const glob = (name, spec) => `import { default as ${name} } from "${spec}";`;
    const code = [
      glob('__vite_glob_0_0', '../../design/bibliotheque/svg/plantes/touffe.svg?url'),
      glob('__vite_glob_1_0', '/design/bibliotheque/svg/coffres/bois/bois_ferme.svg?url'),
      glob('__vite_glob_2_0', '../assets/success/premier.png'),
      'const URLS = { a: __vite_glob_0_0, b: __vite_glob_1_0 };'
    ].join('\n');
    expect(plugin.transform(code, '/srv/og-create/tests/plants.test.js')).toBeNull();
    expect(plugin.transform(code, '/srv/og-create/src/world/plants.js').code.split('\n')).toEqual([
      'const __vite_glob_0_0 = "/design/bibliotheque/svg/plantes/touffe.svg";',
      'const __vite_glob_1_0 = "/design/bibliotheque/svg/coffres/bois/bois_ferme.svg";',
      'import { default as __vite_glob_2_0 } from "../assets/success/premier.png";',
      'const URLS = { a: __vite_glob_0_0, b: __vite_glob_1_0 };'
    ]);
    expect(plugin.apply).toBe('serve');
    for (const config of ['vite.config.mjs', 'vitest.config.mjs']) expect(readFileSync(ROOT + config, 'utf8')).toMatch(/libraryUrls\(\)/);
  });
});
