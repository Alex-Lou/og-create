// L'île : les cases dorées d'une pose, un seul niveau à la fois (world/poseLevel.js) ; déplacer un bâtiment
// (siteMove.js), poser une annexe (annexes.js) ou une création (workshop.js). Mixin de WorldView.vue.

import { pickSpot, spotsOnLevel, startLevel } from '@/world/poseLevel';
import { vibrate } from '@/utils/fx';

export default {
  data() {
    return {
      // Le niveau (la hauteur du sol) dont les cases dorées s'allument et se touchent, ou null (toutes)
      poseLevel: null
    };
  },
  methods: {
    levelAt(x, y) {
      return this.M ? this.M.surface(Math.round(x), Math.round(y)) : 0;
    },
    // Les cases dorées à dessiner et à toucher
    poseSpots(spots) {
      return spotsOnLevel(spots, this.poseLevel, (x, y) => this.levelAt(x, y));
    },
    // Au début d'une pose : le niveau de cette case (le bâtiment), s'il a des cases dorées
    beginPoseLevel(x, y, spots) {
      this.poseLevel = startLevel(this.levelAt(x, y), spots, (x2, y2) => this.levelAt(x2, y2));
    },
    // Un toucher pendant la pose : { cell (la case dorée choisie, ou null), switched (le doigt a fait passer à un autre
    // niveau : ce n'est pas une erreur, ses cases s'allument) }
    pickPoseSpot(px, py, spots) {
      const { cell, level } = pickSpot({ spots, level: this.poseLevel, levelAt: (x, y) => this.levelAt(x, y), tileAt: keep => this.tileAt(px, py, keep) });
      const switched = level !== this.poseLevel;
      this.poseLevel = level;
      if (switched && !cell) vibrate(4);
      return { cell, switched };
    }
  }
};
