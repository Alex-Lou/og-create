// Le Bestiaire des animaux rencontrés (world/creatures.js ; book/bestiaryPainter.js) : ses 31 créatures (la même liste
// que le serveur : services/animals.js), leur dessin, leur « où et quand » tiré de leur règle, ce qu'un toucher vise,
// les pages du livre
import { describe, it, expect } from 'vitest';
import { CREATURES, CATEGORIES, creatureOf, creatureOfHit, whereWhen, arrivalOf } from '@/world/creatures';
import { WILD_LIFE } from '@/world/village/wildLife';
import { subjectOf } from '@/world/beastArt';
import { bestiaryPages, PER_PAGE } from '@/book/bestiaryPainter';

// (serveur : services/animals.js, ANIMALS ; un animal hors de cette liste y est refusé)
const SERVER = [
  'lapin', 'ecureuil', 'mesange', 'renard', 'herisson', 'cerf', 'hibou',
  'papillon', 'papillon-lune', 'luciole', 'abeille',
  'grenouille', 'tortue', 'heron', 'koi', 'loutre',
  'crabe', 'mouette', 'sardines', 'dauphin', 'baleine',
  'macareux', 'poney', 'bouquetin', 'renard-polaire', 'chameau', 'fennec', 'toucan', 'cameleon', 'corbeau', 'salamandre'
];

describe('le Bestiaire', () => {
  it('31 créatures, numérotées dans l’ordre du livre, la même liste que le serveur ; chacune a son nom, sa phrase et son dessin', () => {
    expect(CREATURES.map(c => c.id)).toEqual(SERVER);
    expect(CREATURES.map(c => c.no)).toEqual(SERVER.map((_, k) => k + 1));
    for (const c of CREATURES) {
      expect(CATEGORIES).toContain(c.category);
      expect(c.name && c.text, c.id).toBeTruthy();
      expect(subjectOf(c.species, c.variant), c.id).toBeTruthy();
      expect(['commun', 'peu commun', 'rare']).toContain(c.rarity);
    }
    // (chaque bête qui vit sur l'île a sa page)
    for (const b of WILD_LIFE) expect(creatureOf(b.animal || b.id), b.id).not.toBeNull();
  });

  it('ce qu’un toucher vise : une bête qui vit, une carpe, une abeille, une loutre ; en mer, dauphins, baleine, banc, mouettes', () => {
    expect(creatureOfHit({ kind: 'frog', who: { id: 'wild:grenouille-marais:bayou:1' } })).toBe('grenouille');
    expect(creatureOfHit({ kind: 'butterfly', who: { id: 'wild:papillon-lune:jardins:0' } })).toBe('papillon-lune');
    expect(creatureOfHit({ kind: 'koi', who: { id: 'koi:2' } })).toBe('koi');
    expect(creatureOfHit({ kind: 'bee', who: { id: 'best:bee:1' } })).toBe('abeille');
    expect(creatureOfHit({ kind: 'otter', who: { id: 'anya:otter:0' } })).toBe('loutre');
    expect([{ kind: 'pod' }, { kind: 'whale' }, { kind: 'school' }, { kind: 'perch' }].map(creatureOfHit)).toEqual(['dauphin', 'baleine', 'sardines', 'mouette']);
    // (un habitant, une poule d’Agathe, le chat : rien)
    expect([{ who: { id: 'vil:ponton' } }, { who: { id: 'farm:hen:0' } }, { who: { id: 'best:cat' } }, null].map(creatureOfHit)).toEqual([null, null, null, null]);
  });

  it('le « où et quand » se tire de sa règle ; une terre inconnue ne se nomme pas ; ce qui la fera venir', () => {
    const zones = [{ id: 'jardins', name: 'Les Jardins' }, { id: 'foret', name: 'La Grande Forêt', known: false }];
    expect(whereWhen(creatureOf('papillon-lune'), zones)).toBe('Les Jardins · la nuit · ciel clair · pleine lune');
    expect(whereWhen(creatureOf('cerf'), zones)).toBe('Une terre inconnue · à l’aube, au crépuscule · ciel clair, brume');
    expect(whereWhen(creatureOf('salamandre'), zones)).toMatch(/à toute heure · orage$/);
    expect(whereWhen(creatureOf('abeille'), zones)).toMatch(/^Autour du Potager · le jour/);
    expect(arrivalOf(creatureOf('hibou'), { elements: [] })).toMatch(/Hibou/);
    expect(arrivalOf(creatureOf('hibou'), { elements: ['Hibou'] })).toBeNull();
    expect(arrivalOf(creatureOf('renard'), { acts: ['T', 'I'] })).toMatch(/II/);
  });

  it('les pages : le sommaire, chaque catégorie en pages de six cases, l’index ; chaque créature a sa page', () => {
    const met = new Map([['cerf', 1], ['lapin', 2]]);
    const { pages, pageOf, index } = bestiaryPages(CREATURES, CATEGORIES, met);
    expect(pages[0].type).toBe('toc');
    expect(pages[index].type).toBe('index');
    const grids = pages.filter(p => p.type === 'grid');
    expect(grids.every(p => p.cells.length <= PER_PAGE)).toBe(true);
    expect(grids.flatMap(p => p.cells.map(c => c.id))).toEqual(CATEGORIES.flatMap(cat => CREATURES.filter(c => c.category === cat).map(c => c.id)));
    for (const c of CREATURES) expect(pages[pageOf.get(c.id)].cells).toContain(c);
    // (le sommaire compte les rencontrées de chaque catégorie)
    expect(pages[0].rows.find(r => r.category === 'bois')).toMatchObject({ found: 2, total: 7 });
  });
});
