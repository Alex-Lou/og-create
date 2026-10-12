// La boucle d'animation et le dessin de l'île : sol, mer, ce qui se tient debout, lumières, météo, bulles, les « ! » du
// tutoriel, les fêtes. Méthodes de WorldView.vue (this : le composant), extraites telles quelles (lot santé), rangées par sujet dans
// draw/ et réunies ici.

import loop from './draw/loop';
import sites from './draw/sites';
import nature from './draw/nature';
import bubbles from './draw/bubbles';
import life from './draw/life';
import air from './draw/air';
import brume from './draw/brume';
import loading from './draw/loading';
import marks from './draw/marks';
import fetes from './draw/fetes';

export default { ...loop, ...sites, ...nature, ...bubbles, ...life, ...air, ...brume, ...loading, ...marks, ...fetes };
