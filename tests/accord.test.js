// Le joueur dans les répliques (choix de l'auteur, 14 oct. : ecriture/ton.md, décisions 1 et 20) : les deux formes
// « masculin|féminin » accordées au genre de son avatar ; son genre lu sur un avatar composé, ou dans le catalogue pour
// un exemple
import { describe, it, expect } from 'vitest';
import { accord, readGenre, setPlayer, player } from '@/game/accord';

describe('l’accord du joueur', () => {
  it('garde la forme de son genre, la première s’il n’est pas connu', () => {
    // (chaque paire est d'un mot : « un|une naufragé|naufragée »)
    const line = 'Pas mal, pour un|une naufragé|naufragée. Si seulement j’étais arrivé|arrivée ici.';
    expect(accord(line, 'femme')).toBe('Pas mal, pour une naufragée. Si seulement j’étais arrivée ici.');
    expect(accord(line, 'homme')).toBe('Pas mal, pour un naufragé. Si seulement j’étais arrivé ici.');
    expect(accord('Il faudra être patient|patiente.', 'femme')).toBe('Il faudra être patiente.');
    expect(accord('Il faudra être patient|patiente.', 'homme')).toBe('Il faudra être patient.');
    expect(accord('Il faudra être patient|patiente.', null)).toBe('Il faudra être patient.');
    expect(accord('Sans barre, rien ne change.', 'femme')).toBe('Sans barre, rien ne change.');
  });
  it('lit le genre d’un avatar composé tout de suite, celui d’un exemple dans le catalogue, à la demande', async () => {
    setPlayer({ look: { genre: 'homme' }, name: 'Ysé' });
    expect([player.genre, player.name]).toEqual(['homme', 'Ysé']);
    expect(accord('naufragé|naufragée')).toBe('naufragé');
    setPlayer({ look: 'avatar-01', name: 'Ysé' });
    expect(player.genre).toBeNull();
    expect(await readGenre()).toBe('femme');
    expect(accord('naufragé|naufragée')).toBe('naufragée');
    setPlayer({ look: 'inconnu', name: null });
    expect(await readGenre()).toBeNull();
  });
});
