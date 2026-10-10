// Les fichiers de l'écran de démarrage (public/img/splash, public/splash.css) gardent le même nom d'une version à
// l'autre : index.html les cite avec l'empreinte de leur contenu (?v=…, écrite par design/atelier/preview_splash.js),
// sinon le service worker et le navigateur resserviraient l'ancienne image ou l'ancien style
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const html = readFileSync(`${root}index.html`, 'utf8');
const empreinte = file => createHash('sha1').update(readFileSync(`${root}public${file}`)).digest('hex').slice(0, 10);

describe('écran de démarrage', () => {
  it('cite chaque fichier avec l\'empreinte de son contenu', () => {
    const refs = [...html.matchAll(/"(\/(?:img\/splash\/[a-z]+\.svg|splash\.css))(?:\?v=([0-9a-f]+))?"/g)];
    expect(refs.length).toBeGreaterThanOrEqual(5);
    for (const [, file, v] of refs) expect(v, file).toBe(empreinte(file));
  });
});
