// Les bâtiments de la bibliothèque (design/bibliotheque/svg/batiments) dans le jeu : chantier, paliers, skins dessinés,
// teintes. Chaque image d'un palier se coupe, sans rien perdre, en partie fixe, bloc qui bouge et voilier ; un skin
// dessiné reprend le bloc qui bouge du palier ; les lumières et les fumées de la bibliothèque sont celles du jeu.
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { piecesOf, splitFrames, buildingArt, chantierArt, buildingThumb } from '@/world/buildingArt';
import { lookAt } from '@/world/looks';
import { BLANK } from '@/world/library';
import { tintSvg } from '../design/bibliotheque/svg/batiments/teintes/teinter.mjs';
import DATA from '../design/bibliotheque/svg/batiments/batiments.json';

const ROOT = fileURLToPath(new URL('../design/bibliotheque/svg/batiments/', import.meta.url));
const read = file => readFileSync(ROOT + file, 'utf8');
const SITES = ['foyer', 'carriere', 'bosquet', 'puits', 'potager', 'atelier', 'ponton'];
const FILES = [...Object.values(DATA.paliers).flatMap(art => art.fichiers.map(file => [file, art.cadre])), ...DATA.chantier.fichiers.map((file, k) => [file, DATA.chantier.cadres[k]])];

describe('les bâtiments de la bibliothèque', () => {
  it('chaque image est calée sur son cadre, et se coupe en éléments qui la redonnent telle quelle', () => {
    for (const [file, cadre] of FILES) {
      const svg = read(file);
      expect(svg.match(/viewBox="([^"]+)"/)[1], file).toBe(cadre.join(' '));
      const { head, items, tail } = piecesOf(svg);
      expect(items.length, file).toBeGreaterThan(3);
      expect(head + items.join('') + tail, file).toBe(svg);
    }
  });

  it('chaque palier se coupe en partie fixe, bloc qui bouge (seul à changer) et voilier, sans rien perdre', () => {
    for (const [key, art] of Object.entries(DATA.paliers)) {
      const boat = key.startsWith('ponton');
      const frames = art.fichiers.map(read);
      const split = splitFrames(frames, boat);
      frames.forEach((svg, f) => {
        const items = [...split.before, ...split.moving[f], ...split.after, ...(boat ? [split.boat] : [])];
        expect(items, `${key} image ${f + 1}`).toEqual(piecesOf(svg).items);
      });
      if (frames.length > 1) expect(split.moving.every(items => items.length > 0), key).toBe(true);
      if (boat) expect(split.boat, key).toMatch(/^<g transform="translate\([-\d. ]+\)">/);
    }
  });

  it('chaque bâtiment a son dessin à chaque palier ; l\'animation suit ses images et leur durée', () => {
    for (const id of SITES) {
      for (let level = 1; level <= 7; level++) {
        const art = buildingArt(id, level);
        const lib = DATA.paliers[`${id}_palier${level}`];
        expect(art.base.key, `${id} ${level}`).toBe(`lib-${id}-${level}-base`);
        expect(art.anim ? [art.anim.n, art.anim.ms] : null, `${id} ${level}`).toEqual(lib.fichiers.length > 1 ? [lib.fichiers.length, lib.ms_par_image] : null);
        expect(Boolean(art.boat), `${id} ${level}`).toBe(id === 'ponton');
      }
    }
    expect(buildingArt('foyer', 8)).toBe(null);
    expect(buildingArt('phare', 1)).toBe(null);
    expect([0, 1, 2].map(stage => chantierArt(stage).key)).toEqual(['lib-chantier-0', 'lib-chantier-1', 'lib-chantier-2']);
    expect(chantierArt(3)).toBe(null);
  });

  it('les parties se lisent au cadre du jeu ; sans mesure possible (ici), le bloc qui bouge garde le cadre du palier', async () => {
    const art = buildingArt('foyer', 4);
    const frame = { x: -112, y: -200, w: 224, h: 264 };
    const base = art.base.make();
    expect(base.box).toEqual(frame);
    expect((await base.load()).match(/<svg[^>]*>/)[0]).toContain('width="224" height="264" viewBox="-140 -250 280 330"');
    const moving = await art.anim.frame(1).make().load();
    expect(moving.box).toEqual(frame);
    expect(moving.svg).toContain('width="224" height="264"');
    expect(moving.svg.length).toBeLessThan(read(DATA.paliers.foyer_palier4.fichiers[1]).length / 10);
    const boat = await buildingArt('ponton', 7).boat.make().load();
    expect(boat.svg).toMatch(/<g transform="scale\(1\.25\)"><g transform="translate\(-7\.04 4\.48\)">/);
  });

  it('les lumières et les fumées de la bibliothèque sont celles du jeu (× 1,25)', () => {
    for (const [key, art] of Object.entries(DATA.paliers)) {
      const [id, level] = key.split('_palier');
      const look = lookAt(id, Number(level));
      const lights = (art.lumieres || []).map(l => [l.u, l.v, l.z / 1.25, l.rayon / 1.25]);
      const smoke = (art.fumees || []).map(f => [f.u, f.v, f.z / 1.25]);
      expect(look.lights.length, key).toBe(lights.length);
      look.lights.forEach((l, i) => l.slice(0, 4).forEach((v, j) => expect(v, `${key} lumière ${i}`).toBeCloseTo(lights[i][j], 1)));
      expect(look.smoke.length, key).toBe(smoke.length);
      look.smoke.forEach((s, i) => s.forEach((v, j) => expect(v, `${key} fumée ${i}`).toBeCloseTo(smoke[i][j], 1)));
    }
  });

  it('la vignette d\'un bâtiment est la première image de son palier, ou le chantier dans sa phase', () => {
    // L'adresse du fichier, ou le fichier lui-même quand il est petit (Vite l'écrit en ligne)
    const shows = (url, file) => url.endsWith(file.split('/').pop()) || (url.startsWith('data:image/svg+xml') && decodeURIComponent(url).includes("viewBox='-95 -155 190 210'"));
    for (const id of SITES) {
      for (let level = 1; level <= 7; level++) expect(shows(buildingThumb(id, level), DATA.paliers[`${id}_palier${level}`].fichiers[0]), `${id} ${level}`).toBe(true);
    }
    expect(buildingThumb('foyer', 4)).toMatch(/foyer_palier4_1\.svg$/);
    [0, 1, 2].forEach(stage => expect(shows(buildingThumb('foyer', 0, stage), DATA.chantier.fichiers[stage]), `chantier ${stage}`).toBe(true));
    expect(buildingThumb('foyer', 9)).toBe(null);
  });

  const SKIN_FILES = Object.entries(DATA.skins).flatMap(([skin, e]) => e.fichiers.map((file, k) => ({ skin, site: e.batiment, file, cadre: e.cadres[k], level: Number(file.match(/palier(\d)/)[1]) })));

  it('un skin dessiné est le palier, sa partie fixe changée : le bloc qui bouge et ce qui suit sont ceux du palier', () => {
    for (const { skin, site, file, cadre, level } of SKIN_FILES) {
      const svg = read(file);
      expect(svg.match(/viewBox="([^"]+)"/)[1], file).toBe(cadre.join(' '));
      const { head, items, tail } = piecesOf(svg);
      expect(head + items.join('') + tail, file).toBe(svg);
      const boat = site === 'ponton';
      const art = DATA.paliers[`${site}_palier${level}`];
      const split = splitFrames(art.fichiers.map(read), boat);
      const mine = boat ? items.slice(0, -1) : items;
      if (boat) expect(items[items.length - 1], file).toMatch(/^<g transform="translate\(/);
      // Le jeu anime ce palier sous ce skin : le skin finit par le bloc de la première image ; sinon (kiosque du Puits),
      // il ne l'a pas
      const block = [...split.moving[0], ...split.after];
      const skipped = lookAt(site, level).anims.some(a => a.skip && a.skip(skin));
      if (art.fichiers.length > 1 && !skipped) expect(mine.slice(mine.length - block.length), file).toEqual(block);
      if (skipped) expect(mine.join(''), file).not.toContain(split.moving[0].join(''));
    }
  });

  it('chaque skin a son dessin à chaque palier ; sans fichier, le jeu n\'y dessine pas le skin : le dessin par défaut vaut', () => {
    for (const [skin, e] of Object.entries(DATA.skins)) {
      for (let level = 1; level <= 7; level++) {
        const art = buildingArt(e.batiment, level, skin);
        const own = e.fichiers.some(file => file.endsWith(`_palier${level}.svg`));
        if (!own) {
          expect(art, `${skin} ${level}`).toBe(buildingArt(e.batiment, level));
          expect(lookAt(e.batiment, level).make(skin).svg, `${skin} ${level}`).toBe(lookAt(e.batiment, level).make().svg);
          continue;
        }
        expect(art.base.key, `${skin} ${level}`).toBe(`lib-${e.batiment}-${level}-${skin}-base`);
        const plain = buildingArt(e.batiment, level);
        const skipped = lookAt(e.batiment, level).anims.some(a => a.skip && a.skip(skin));
        // Même bloc qui bouge que le palier : mêmes images (même mémoire)
        expect(art.anim && art.anim.frame(0).key, `${skin} ${level}`).toBe(plain.anim && !skipped ? plain.anim.frame(0).key : null);
      }
    }
    expect(buildingArt('foyer', 3, 'roche-ocre')).toBe(null);
    expect(buildingArt('potager', 3, 'papillons')).toBe(null);
  });

  it('une teinte recolore la partie fixe et le voilier (le trait reste brun), le bloc qui bouge là où le jeu le teinte', async () => {
    const plain = await buildingArt('foyer', 4).base.make().load();
    const tinted = await buildingArt('foyer', 4, 'sakura-foyer').base.make().load();
    expect(tinted).toBe(tintSvg(plain, 'sakura'));
    expect(tinted).not.toBe(plain);
    expect(tinted).toContain('#3C2819');
    for (const id of ['foyer', 'carriere', 'bosquet', 'puits', 'potager', 'atelier', 'ponton']) {
      for (let level = 1; level <= 7; level++) {
        const art = buildingArt(id, level, `craie-${id}`);
        const plainArt = buildingArt(id, level);
        const tintedAnim = lookAt(id, level).anims.some(a => a.skinned);
        if (plainArt.anim) expect(art.anim.frame(0).key, `${id} ${level}`).toBe(tintedAnim ? `lib-${id}-${level}-craie-a0` : plainArt.anim.frame(0).key);
      }
    }
    const boat = await buildingArt('ponton', 2, 'ocean-ponton').boat.make().load();
    const plainBoat = await buildingArt('ponton', 2).boat.make().load();
    expect(boat.svg).toBe(tintSvg(plainBoat.svg, 'ocean'));
  });

  it('vignettes : le fichier du skin dessiné, la première image teinte à la lecture ; rien pour une pièce rare', async () => {
    expect(buildingThumb('foyer', 4, 0, 'toit-rouge')).toMatch(/foyer_toit-rouge_palier4\.svg$/);
    expect(buildingThumb('foyer', 1, 0, 'toit-rouge')).toBe(buildingThumb('foyer', 1));
    expect(buildingThumb('potager', 3, 0, 'papillons')).toBe(null);
    expect(buildingThumb('atelier', 2, 0, 'lavande-atelier')).toBe(BLANK);
    await vi.waitFor(() => expect(buildingThumb('atelier', 2, 0, 'lavande-atelier')).not.toBe(BLANK));
    const svg = decodeURIComponent(buildingThumb('atelier', 2, 0, 'lavande-atelier').split(',')[1]);
    expect(svg).toBe(tintSvg(read(DATA.paliers.atelier_palier2.fichiers[0]), 'lavande'));
  });
});
