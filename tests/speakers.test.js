// Qui parle, dans une bulle (game/speakers.js) : chacun sa couleur et son motif ; un inconnu en gris, sous « ??? » ;
// un hostile, sombre
import { describe, it, expect } from 'vitest';
import { speakerOf, SPEAKERS } from '@/game/speakers';

describe('qui parle', () => {
  it('un ami connu : sa couleur, son motif, son nom', () => {
    expect(speakerOf('Hermine')).toMatchObject({ family: 'ami', name: 'Hermine', color: SPEAKERS.Hermine.color });
    expect(speakerOf('Hermine').motif).toBeTruthy();
    // (chacun la sienne)
    expect(new Set(Object.values(SPEAKERS).map(s => s.color)).size).toBe(Object.keys(SPEAKERS).length);
  });
  it('un inconnu : « ??? », en gris, sans motif ; un hostile : sombre, son nom gardé', () => {
    expect(speakerOf('Marcelle', { stranger: true })).toMatchObject({ family: 'inconnu', name: '???', motif: null });
    expect(speakerOf('L’Ombre', { hostile: true })).toMatchObject({ family: 'hostile', name: 'L’Ombre' });
  });
  it('un nom hors de la table parle sans couleur', () => {
    expect(speakerOf('Le haut-parleur')).toMatchObject({ family: 'ami', color: null, motif: null });
  });
});
