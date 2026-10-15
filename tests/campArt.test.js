// Le camp des naufragés (design/bibliotheque/svg/decor/camp, camp.json) dans le jeu : chaque dessin que le serveur peut
// envoyer (world/camp.js : art) existe, au cadre du jeu × 1,25 ; un dessin animé change d'image à sa cadence
import { describe, it, expect } from 'vitest';
import { campLayer, campLayers, campLights, campPerches, campShadow, campName, eggLayer } from '@/world/campArt';
import CAMP from '../design/bibliotheque/svg/decor/camp/camp.json';
import POULES from '../design/bibliotheque/svg/decor/camp/poules/poules.json';

// Les dessins du camp que le serveur pose (sobre : épave, cuisine d’Agathe, coins de Lorena et de Jovin, voyageurs, objets)
const ARTS = [
  'hirondelle', 'hirondelle_petite', 'hirondelle_poupe', 'palmier', 'etoile_de_mer', 'cannelle_debris', 'tente', 'hamac', 'sos', 'caisses', 'filet', 'rondins', 'cage_coincee', 'cage_ouverte',
  ...['aster', 'rivet'].flatMap(who => ['debris', 'abri', 'cabanon'].map(state => `${who}_${state}`))
];

describe('camp des naufragés', () => {
  it('les coins des maîtres portent leurs prénoms d’aujourd’hui (la bibliothèque garde ceux d’avant)', () => {
    expect([campName('aster_abri'), campName('cannelle_cabanon')]).toEqual(['Lorena · abri', 'Agathe · cabanon']);
  });
  it('chaque dessin envoyé par le serveur a son calque et son nom', () => {
    for (const art of ARTS) {
      const layer = campLayer(art);
      expect(layer, art).not.toBeNull();
      const [x, y, w, h] = (CAMP.objets[art] || POULES.poules[art]).cadre;
      expect(layer.make().box).toEqual({ x: x / 1.25, y: y / 1.25, w: w / 1.25, h: h / 1.25 });
      expect(campName(art)).not.toBe('');
    }
  });

  it('un dessin animé suit sa cadence ; un dessin inconnu ne donne rien', () => {
    const hamac = CAMP.objets.hamac;
    expect(campLayer('hamac', 0).key).toBe('camp-hamac-0');
    expect(campLayer('hamac', hamac.ms / 1000 + 0.01).key).toBe('camp-hamac-1');
    expect(campLayer('nulle-part')).toBeNull();
    // La cage coincée remue (deux images) ; l'œuf, posé au sol
    expect(campLayer('cage_coincee', 0).key).not.toBe(campLayer('cage_coincee', POULES.poules.cage_coincee.ms_par_image / 1000 + 0.01).key);
    expect(eggLayer()).not.toBeNull();
  });
  it('la grande Hirondelle se pose en calques selon son état : végétation, givre, pluie, lanterne, ce qui bouge', () => {
    const keys = look => campLayers('hirondelle', 0, look).map(l => l.key);
    // (au repos : la coque, puis ce qui bouge par-dessus)
    expect(keys({})).toEqual(['camp-hirondelle-0', 'camp-hirondelle_vie-0']);
    expect(keys({ stade: 2, hiver: true, mouille: true, lanterne: true })).toEqual(['camp-hirondelle-0', 'camp-hirondelle_envahie_2-0', 'camp-hirondelle_neige-0', 'camp-hirondelle_mouillee-0', 'camp-hirondelle_lanterne-0', 'camp-hirondelle_vie-0']);
    // (un stade au-delà du dernier : le dernier)
    expect(keys({ stade: 9 })[1]).toBe('camp-hirondelle_envahie_3-0');
    // Les calques ont tous le cadre de la coque : ils se posent l'un sur l'autre
    const cadre = JSON.stringify(CAMP.objets.hirondelle.cadre);
    for (const name of Object.values(CAMP.objets.hirondelle.calques).flat()) expect(JSON.stringify(CAMP.objets[name].cadre)).toBe(cadre);
    // Sa lumière (la lanterne de Lorena), ses perchoirs et son ombre, au jeu (÷ 1,25)
    const [light] = campLights('hirondelle');
    expect([light.lanterne, light.z, light.r]).toEqual([true, CAMP.objets.hirondelle.lumieres[0].z / 1.25, 20]);
    expect(campPerches('hirondelle').length).toBeGreaterThanOrEqual(5);
    expect(campShadow('hirondelle')).toEqual({ hw: 2.9, hh: 0.72, h: 46 });
    // Un dessin sans calques : lui seul
    expect(campLayers('tente').map(l => l.key)).toEqual(['camp-tente-0']);
  });
});
