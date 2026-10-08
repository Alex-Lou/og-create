// Le camp des naufragés (design/bibliotheque/svg/decor/camp, camp.json) dans le jeu : chaque dessin que le serveur peut
// envoyer (world/camp.js : art) existe, au cadre du jeu × 1,25 ; un dessin animé change d'image à sa cadence
import { describe, it, expect } from 'vitest';
import { campLayer, campName, eggLayer } from '@/world/campArt';
import CAMP from '../design/bibliotheque/svg/decor/camp/camp.json';
import POULES from '../design/bibliotheque/svg/decor/camp/poules/poules.json';

// Les dessins du camp que le serveur pose (sobre : épave, cuisine de Cannelle, coins d'Aster et de Rivet, voyageurs, objets)
const ARTS = [
  'hirondelle', 'cannelle_debris', 'tente', 'hamac', 'sos', 'caisses', 'filet', 'rondins', 'cage_coincee', 'cage_ouverte',
  ...['aster', 'rivet'].flatMap(who => ['debris', 'abri', 'cabanon'].map(state => `${who}_${state}`))
];

describe('camp des naufragés', () => {
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
});
