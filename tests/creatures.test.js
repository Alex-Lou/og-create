// Le Bestiaire des animaux rencontrés (world/creatures.js ; book/bestiaryPainter.js) : ses 45 créatures (la même liste
// que le serveur : services/animals.js), leur dessin, leur « où et quand » tiré de leur règle, ce qu'un toucher vise,
// les pages du livre
import { describe, it, expect } from 'vitest';
import { CREATURES, CATEGORIES, creatureOf, creatureOfHit, whereWhen, arrivalOf } from '@/world/creatures';
import { WILD_LIFE } from '@/world/village/wildLife';
import { subjectOf } from '@/world/beastArt';
import EGARES from '../design/bibliotheque/svg/egares/egares.json';
import { bestiaryPages, PER_PAGE } from '@/book/bestiaryPainter';

// (serveur : services/animals.js, CATEGORIES ; un animal hors de cette liste y est refusé)
const SERVER_CATEGORIES = {
  bois: ['lapin', 'ecureuil', 'mesange', 'renard', 'herisson', 'cerf', 'hibou'],
  fleurs: ['papillon', 'papillon-lune', 'luciole', 'abeille'],
  eau: ['grenouille', 'tortue', 'heron', 'koi', 'loutre'],
  mer: ['crabe', 'mouette', 'sardines', 'dauphin', 'baleine', 'geant', 'kraken'],
  lointain: ['macareux', 'poney', 'bouquetin', 'renard-polaire', 'chameau', 'fennec', 'toucan', 'cameleon', 'corbeau', 'salamandre'],
  ferme: ['poule', 'coq', 'poussin', 'vache', 'mouton', 'cochon', 'chevre', 'chat', 'chien', 'bosco', 'bouillon', 'tic-tac', 'bulle', 'mousse', 'basalte', 'lunette'],
  brume: [
    'fantome', 'zombie', 'noye', 'racine', 'esprit',
    'lapin-de-brume', 'bouquetin-de-brume', 'poney-de-brume', 'grenouille-de-brume', 'fennec-de-brume', 'cameleon-de-brume', 'salamandre-de-brume'
  ],
  legendes: ['cerf-blanc', 'phenix']
};
const SERVER = Object.values(SERVER_CATEGORIES).flat();

describe('le Bestiaire', () => {
  it('63 créatures, numérotées dans l’ordre du livre, les mêmes catégories que le serveur ; chacune a son nom, sa phrase et son dessin', () => {
    expect(CREATURES.map(c => c.id)).toEqual(SERVER);
    expect(CATEGORIES).toEqual(Object.keys(SERVER_CATEGORIES));
    for (const [category, ids] of Object.entries(SERVER_CATEGORIES)) expect(CREATURES.filter(c => c.category === category).map(c => c.id)).toEqual(ids);
    expect(CREATURES.map(c => c.no)).toEqual(SERVER.map((_, k) => k + 1));
    // (les ids passent la règle du serveur : routes/play/world.js)
    expect(SERVER.every(id => /^[a-z-]{1,20}$/.test(id))).toBe(true);
    for (const c of CREATURES) {
      expect(CATEGORIES).toContain(c.category);
      expect(c.name && c.text, c.id).toBeTruthy();
      // (une bête de la bibliothèque ; un égaré, le sien ; le Géant, le Kraken, le cerf blanc et le Phénix, le leur :
      // creatureArt.js)
      if (c.species === 'stray') expect(EGARES.egares[c.variant], c.id).toBeTruthy();
      else if (c.species !== 'legend') expect(subjectOf(c.species, c.variant), c.id).toBeTruthy();
      expect(['commun', 'peu commun', 'rare', 'légendaire']).toContain(c.rarity);
    }
    expect(CREATURES.filter(c => c.rarity === 'légendaire').map(c => c.id)).toEqual(['geant', 'kraken', 'cerf-blanc', 'phenix']);
    // (les familiers ont le nom et la phrase de l'île : world/bestiary.js, FAMILIARS)
    expect(creatureOf('mousse')).toMatchObject({ name: 'Mousse', building: 'bosquet', element: 'Renard' });
    expect(creatureOf('bulle')).toMatchObject({ species: 'bowl', variant: 'bulle' });
    // (chaque égaré de la bibliothèque a sa page)
    expect(CREATURES.filter(c => c.category === 'brume').map(c => c.id)).toEqual(Object.keys(EGARES.egares));
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
    expect([{ kind: 'geant' }, { kind: 'kraken' }].map(creatureOfHit)).toEqual(['geant', 'kraken']);
    // (un égaré repoussé : son dessin, celui du climat d'où sort une bête de brume)
    expect(creatureOfHit({ kind: 'stray', stray: { id: 'n1' }, art: 'fennec-de-brume' })).toBe('fennec-de-brume');
    expect(creatureOfHit({ kind: 'stray', stray: { id: 'n1' }, art: 'licorne' })).toBeNull();
    // (la ferme, ses poules du Foyer, le chat, un familier, le cerf blanc, le Phénix)
    expect([{ who: { id: 'farm:hen:0' } }, { kind: 'chicken' }, { who: { id: 'farm:goat:2' } }, { who: { id: 'best:cat' } }, { who: { id: 'fam:bosquet' } }, { who: { id: 'anya:cerf' } }, { kind: 'phenix' }].map(creatureOfHit))
      .toEqual(['poule', 'poule', 'chevre', 'chat', 'mousse', 'cerf-blanc', 'phenix']);
    // (un habitant, l'amie de Tic-Tac, Anya : rien)
    expect([{ who: { id: 'vil:ponton' } }, { who: { id: 'fam:atelier:amie' } }, { who: { id: 'anya:dame' } }, null].map(creatureOfHit)).toEqual([null, null, null, null]);
  });

  it('le « où et quand » se tire de sa règle ; une terre inconnue ne se nomme pas ; ce qui la fera venir', () => {
    const zones = [{ id: 'jardins', name: 'Les Jardins' }, { id: 'foret', name: 'La Grande Forêt', known: false }];
    expect(whereWhen(creatureOf('papillon-lune'), zones)).toBe('Les Jardins · la nuit · ciel clair · pleine lune');
    expect(whereWhen(creatureOf('cerf'), zones)).toBe('Une terre inconnue · à l’aube, au crépuscule · ciel clair, brume');
    expect(whereWhen(creatureOf('salamandre'), zones)).toMatch(/à toute heure · orage$/);
    expect(whereWhen(creatureOf('abeille'), zones)).toMatch(/^Autour du Potager · le jour/);
    expect(whereWhen(creatureOf('noye'), zones)).toBe('Hors de la mer · la nuit');
    expect(whereWhen(creatureOf('fennec-de-brume'), zones)).toBe('Au bord de la brume, dans les Dunes · la nuit');
    expect(whereWhen(creatureOf('geant'), zones)).toBe('Au large · à toute heure');
    expect(whereWhen(creatureOf('basalte'), zones)).toBe('Auprès de son maître · à toute heure');
    // (le Phénix ne dit pas ce qui le fait venir)
    expect(arrivalOf(creatureOf('phenix'), { elements: [] })).toBeNull();
    expect(arrivalOf(creatureOf('hibou'), { elements: [] })).toMatch(/Hibou/);
    expect(arrivalOf(creatureOf('hibou'), { elements: ['Hibou'] })).toBeNull();
    expect(arrivalOf(creatureOf('renard'), { acts: ['T', 'I'] })).toMatch(/II/);
  });

  it('les pages : le sommaire, chaque catégorie en pages de six cases, l’index ; chaque créature a sa page', () => {
    const met = new Map([['cerf', 1], ['lapin', 2]]);
    const { pages, pageOf, index } = bestiaryPages(CREATURES, CATEGORIES, met);
    expect(pages[0].type).toBe('toc');
    expect(pages[index].type).toBe('index');
    // (l'index, sur deux pages, nomme chaque créature une fois)
    const indexes = pages.slice(index);
    expect(indexes.map(p => p.type)).toEqual(['index', 'index']);
    expect(indexes.flatMap(p => CREATURES.slice(p.from, p.to).map(c => c.id))).toEqual(SERVER);
    const grids = pages.filter(p => p.type === 'grid');
    expect(grids.every(p => p.cells.length <= PER_PAGE)).toBe(true);
    expect(grids.flatMap(p => p.cells.map(c => c.id))).toEqual(CATEGORIES.flatMap(cat => CREATURES.filter(c => c.category === cat).map(c => c.id)));
    for (const c of CREATURES) expect(pages[pageOf.get(c.id)].cells).toContain(c);
    // (le sommaire compte les rencontrées de chaque catégorie)
    expect(pages[0].rows.find(r => r.category === 'bois')).toMatchObject({ found: 2, total: 7, complete: false });
  });

  it('une catégorie toute rencontrée porte son sceau, au sommaire et sur ses pages', () => {
    const met = new Map(CREATURES.filter(c => c.category === 'fleurs').map(c => [c.id, 1]));
    const { pages } = bestiaryPages(CREATURES, CATEGORIES, met);
    expect(pages[0].rows.filter(r => r.complete).map(r => r.category)).toEqual(['fleurs']);
    expect(pages.filter(p => p.type === 'grid' && p.complete).map(p => p.category)).toEqual(['fleurs']);
  });
});
