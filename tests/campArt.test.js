// Le camp des naufragés (design/bibliotheque/svg/decor/camp, camp.json) dans le jeu : chaque dessin que le serveur peut
// envoyer (world/camp.js : art) existe, au cadre du jeu × 1,25 ; un dessin animé change d'image à sa cadence
import { describe, it, expect } from 'vitest';
import { campLayer, campName, eggLayer, campHearth } from '@/world/campArt';
import CAMP from '../design/bibliotheque/svg/decor/camp/camp.json';
import POULES from '../design/bibliotheque/svg/decor/camp/poules/poules.json';

// Les dessins du camp que le serveur pose (sobre : épave, cuisine d’Agathe, coins de Lorena et de Nathan, voyageurs, objets)
const ARTS = [
  'hirondelle', 'cannelle_debris', 'cannelle_abri', 'cannelle_cabanon', 'tente', 'hamac', 'sos', 'caisses', 'filet', 'rondins', 'cage_coincee', 'cage_ouverte',
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
      // (la cuisine d’Agathe, plus grande sur l'île : × 1,3, choix de l'auteur, 16 oct.)
      const k = art.startsWith('cannelle_') ? 1.3 : 1;
      expect(layer.make().box).toEqual({ x: (x / 1.25) * k, y: (y / 1.25) * k, w: (w / 1.25) * k, h: (h / 1.25) * k });
      expect(campName(art)).not.toBe('');
    }
  });

  it('la cuisine d’Agathe a son foyer, à sa taille sur l’île, dans son dessin ; les autres coins n’en ont pas', () => {
    for (const art of ['cannelle_debris', 'cannelle_abri', 'cannelle_cabanon']) {
      const hearth = campHearth(art);
      const box = campLayer(art).make().box;
      expect(hearth.r, art).toBeGreaterThan(30);
      // (le cœur de la flamme, dans le cadre du dessin)
      expect(hearth.x > box.x && hearth.x < box.x + box.w && hearth.y > box.y && hearth.y < box.y + box.h, art).toBe(true);
    }
    expect(campHearth('cannelle_debris')).toEqual({ x: 3 * 1.3, y: -9.5 * 1.3, r: 36 * 1.3 });
    expect([campHearth('hirondelle'), campHearth('aster_debris'), campHearth('cage_ouverte')]).toEqual([null, null, null]);
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
