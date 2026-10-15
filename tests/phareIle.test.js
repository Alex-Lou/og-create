import { describe, expect, it } from 'vitest';
import { phareArtLayer } from '../src/world/decorArt';

describe('le phare des Anciens sur son îlot', () => {
  it('éteint, puis sans sa lentille ; sous la neige l’hiver, mouillé sous l’averse', () => {
    expect(phareArtLayer({}, 0).key).toBe('lib-ruine-phare_des_anciens-0');
    expect(phareArtLayer({ vide: true }, 0).key).toBe('lib-ruine-phare_des_anciens_vide-0');
    expect(phareArtLayer({ hiver: true }, 0).key).toBe('lib-ruine-phare_des_anciens_hiver-0');
    expect(phareArtLayer({ vide: true, mouille: true }, 0).key).toBe('lib-ruine-phare_des_anciens_vide_mouille-0');
    // (l'hiver passe avant la pluie : la neige reste sur la tour)
    expect(phareArtLayer({ hiver: true, mouille: true }, 0).key).toBe('lib-ruine-phare_des_anciens_hiver-0');
  });
  it('ses huit images tournent à la cadence de la bibliothèque', () => {
    const keys = new Set(Array.from({ length: 40 }, (_, i) => phareArtLayer({}, i * 0.1).key));
    expect(keys.size).toBe(8);
  });
});
