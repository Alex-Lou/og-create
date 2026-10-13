// L'île : déplacer un bâtiment (choix de l'auteur, 9 oct. : « disposer mes bâtiments où je veux, comme je veux »).
// Depuis sa fiche, « Déplacer » : le serveur dit où il peut aller (services/world/moves.js : les coins de sa grande
// emprise 3 × 3) ; leurs cases du milieu s'allument en doré ; un toucher montre la place (son emprise en transparence)
// et demande confirmation. Mixin de WorldView.vue.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { TW } from '@/world/view/constants';
import { POSE_MENU_H } from './annexes';

// Le milieu d'une grande emprise, depuis son coin (et inversement)
const MID = 1;

export default {
  data() {
    return {
      // { site, spots: [{ x, y }] (milieux des places permises) }, ou null ; la place choisie { x, y, px, py } (milieu)
      siteMoving: null,
      siteMoveConfirm: null
    };
  },
  computed: {
    movingSite() {
      return this.siteMoving && this.state ? this.state.sites.find(s => s.id === this.siteMoving.site) || null : null;
    },
    siteMoveStyle() {
      const c = this.siteMoveConfirm;
      if (!c || !this.geo) return {};
      return { left: `${Math.max(110, Math.min(this.geo.width - 110, c.px))}px`, top: `${Math.max(POSE_MENU_H, c.py - TW * this.cam.s * 1.6)}px` };
    }
  },
  methods: {
    async startSiteMove(siteId) {
      if (this.busy) return;
      this.site = null;
      this.busy = true;
      try {
        const corners = await playService.siteSpots(siteId);
        if (!corners.length) {
          this.$emit('show-alert', 'Aucune place libre pour ce bâtiment pour l’instant.');
          return;
        }
        this.siteMoving = { site: siteId, spots: corners.map(c => ({ x: c.x + MID, y: c.y + MID })) };
        this.siteMoveConfirm = null;
        // (un seul niveau de cases dorées : celui où il se tient, poseLevel.js)
        const site = this.state.sites.find(s => s.id === siteId);
        if (site) this.beginPoseLevel(site.x + Math.floor(site.w / 2), site.y + Math.floor(site.h / 2), this.siteMoving.spots);
        vibrate(8);
        this.draw(performance.now());
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le bâtiment ne peut pas être déplacé pour l’instant.'), 'error');
      } finally {
        this.busy = false;
      }
    },
    cancelSiteMove() {
      this.siteMoving = null;
      this.siteMoveConfirm = null;
      this.draw(performance.now());
    },
    // Toucher pendant le déplacement : une case dorée (le milieu d'une place permise) du niveau allumé demande
    // confirmation ; ailleurs, le doigt peut faire passer à un autre niveau (poseLevel.js)
    tapSiteSpot(px, py) {
      const { cell, switched } = this.pickPoseSpot(px, py, this.siteMoving.spots);
      if (!cell) {
        this.siteMoveConfirm = null;
        if (!switched) this.$emit('show-alert', 'Choisis une case dorée : le bâtiment s’y pose, centré.');
      } else {
        vibrate(6);
        this.siteMoveConfirm = { x: cell.x, y: cell.y, px, py };
      }
      this.draw(performance.now());
    },
    // Son emprise à la place choisie, pour l'aperçu : [{ x, y }]
    siteMoveCells() {
      const c = this.siteMoveConfirm;
      if (!c) return [];
      return Array.from({ length: 9 }, (_, i) => ({ x: c.x - MID + (i % 3), y: c.y - MID + Math.floor(i / 3) }));
    },
    async confirmSiteMove() {
      const target = this.siteMoveConfirm;
      const moving = this.siteMoving;
      if (!target || !moving || this.busy) return;
      this.busy = true;
      try {
        const world = await playService.siteMove(moving.site, target.x - MID, target.y - MID);
        this.siteMoving = null;
        this.siteMoveConfirm = null;
        this.apply(world);
        // (il tombe à sa place, la poussière roule autour de son emprise : world/fetes.js)
        const site = this.state.sites.find(s => s.id === moving.site);
        this.pops.set(`site:${moving.site}`, performance.now());
        if (site) this.sparkle('pose', this.siteAt(site));
        else this.sparkleCell('pose', target);
        vibrate([12, 40, 18]);
      } catch (error) {
        this.siteMoveConfirm = null;
        this.$emit('show-alert', messageOf(error, 'Le bâtiment n’a pas pu être déplacé.'), 'error');
      } finally {
        this.busy = false;
      }
    }
  }
};
