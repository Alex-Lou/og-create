import { describe, expect, it } from 'vitest';
import { phareArtLayer, phareArtLayers, fanalArtLayer } from '../src/world/decorArt';

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
  // (le vol du conseil les lit toutes d'avance : lues à son apparition, la tour manquait à l'arrivée ; WorldView, phare.js)
  it('toutes ses images d’un coup, sous les mêmes clés que celles que l’île dessine', () => {
    const look = { mouille: true };
    const all = phareArtLayers(look).map(layer => layer.key);
    expect(all).toHaveLength(8);
    const drawn = new Set(Array.from({ length: 40 }, (_, i) => phareArtLayer(look, i * 0.1).key));
    expect(new Set(all)).toEqual(drawn);
  });
});

describe('le fanal des Anciens de la Route des feux', () => {
  it('froid tant que son feu n’est pas rallumé, vif ensuite : les deux images de la bibliothèque', () => {
    expect(fanalArtLayer(false).key).toBe('lib-ruine-fanal_des_anciens-0');
    expect(fanalArtLayer(true).key).toBe('lib-ruine-fanal_des_anciens-1');
  });
});
