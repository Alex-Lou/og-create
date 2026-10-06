// L'île : les créations d'île. L'établi, l'assemblage, la pose sur les cases dorées, le menu d'une création posée
// (déplacer, ranger). Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans
// son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { burst, ring, vibrate, center } from '@/utils/fx';
import { TW } from '@/world/view/constants';
import { moveSpots } from '@/world/crafts';

export default {
  data() {
    return {
      menuPos: { x: 0, y: 0 },
      // Créations d'île : établi ouvert ; assemblage en cours ({ id, craft, shape, pieces, turned }), son envoi, son refus,
      // sa réussite ; pose ou déplacement en cours ({ craft, from: { x, y } | null }) et case dorée choisie ({ x, y, px,
      // py }) ; menu d'une création posée ({ x, y, craft })
      benchOpen: false,
      craftRun: null,
      craftStarting: false,
      craftSending: false,
      craftError: '',
      craftMade: false,
      craftPlacing: null,
      craftConfirm: null,
      craftMenu: null
    };
  },
  computed: {
    // Créations d'île posées ([{ x, y, craft }])
    crafted() {
      return this.state && this.state.crafts ? this.state.crafts.placed : [];
    },
    // Création en cours de pose : sa carte du catalogue ; ses cases dorées (sans la sienne, si on la déplace)
    placingCraft() {
      return this.craftPlacing && this.state ? this.state.crafts.catalog.find(c => c.id === this.craftPlacing.craft) || null : null;
    },
    craftSpots() {
      const from = this.craftPlacing && this.craftPlacing.from;
      if (!this.placingCraft) return [];
      return from ? moveSpots(this.placingCraft.spots, from, this.placedAt(from).keeps) : this.placingCraft.spots;
    },
    craftBanner() {
      const name = this.placingCraft ? this.placingCraft.name : '';
      return this.craftPlacing && this.craftPlacing.from ? `Touche une case dorée pour y déplacer : ${name}.` : `Touche une case dorée pour poser : ${name}.`;
    },
    craftConfirmStyle() {
      const c = this.craftConfirm;
      if (!c || !this.geo) return {};
      return { left: `${Math.max(110, Math.min(this.geo.width - 110, c.px))}px`, top: `${Math.max(56, c.py - 24)}px` };
    },
    menuStyle() {
      return { left: `${this.menuPos.x}px`, top: `${this.menuPos.y}px` };
    }
  },
  methods: {
    /* ---------- Créations d'île : établi, assemblage, pose ---------- */
    craftName(id) {
      const c = this.state && this.state.crafts ? this.state.crafts.catalog.find(k => k.id === id) : null;
      return c ? c.name : id;
    },
    openBench() {
      this.site = null;
      this.questOpen = false;
      this.benchOpen = true;
    },
    // « Assembler » (ou Recommencer) : le serveur tire les pièces ; rien n'est payé avant la réussite
    async assemble(craftId) {
      if (this.craftStarting) return;
      this.craftStarting = true;
      try {
        const { run } = await playService.craftStart(craftId);
        this.craftRun = run;
        this.craftError = '';
        this.craftMade = false;
      } catch (error) {
        const message = messageOf(error, 'L’assemblage n’a pas pu commencer.');
        if (this.craftRun) this.craftError = message;
        else this.$emit('show-alert', message);
      } finally {
        this.craftStarting = false;
      }
    },
    // Gabarit rempli : le serveur vérifie la disposition, prend les ressources, met la création en réserve
    async finishCraft(layout) {
      if (!this.craftRun || this.craftSending) return;
      this.craftSending = true;
      try {
        const { world } = await playService.craftFinish(this.craftRun.id, layout);
        this.apply(world);
        this.craftMade = true;
        vibrate([10, 30, 10]);
      } catch (error) {
        // Refusé : cet assemblage est rendu ; « Recommencer » en tire un autre
        this.craftError = messageOf(error, 'L’assemblage n’a pas pu être vérifié.');
      } finally {
        this.craftSending = false;
      }
    },
    closePuzzle() {
      this.craftRun = null;
      this.craftError = '';
      this.craftMade = false;
    },
    // « Poser » (établi, ou juste après l'assemblage) : les cases permises s'allument sur l'île
    startCraftPlace(craftId, from = null) {
      this.benchOpen = false;
      this.closePuzzle();
      this.craftMenu = null;
      this.craftConfirm = null;
      this.craftPlacing = { craft: craftId, from };
      if (!this.craftSpots.length) {
        this.craftPlacing = null;
        // Une création qui en garde une autre à portée le dit (règle « près de »)
        this.$emit('show-alert', (from && this.placedAt(from).keepText) || 'Aucune case libre ne convient pour l’instant : sa règle de pose est dans l’établi.');
        return;
      }
      vibrate(8);
      this.focusOnSpots();
      this.draw(performance.now());
    },
    placeFromBench(craftId) {
      this.startCraftPlace(craftId);
    },
    placeFromPuzzle() {
      this.startCraftPlace(this.craftRun.craft);
    },
    // La caméra va vers la case dorée la plus proche du centre de la vue
    focusOnSpots() {
      if (!this.craftSpots.length) return;
      const near = this.craftSpots.map(sp => ({ sp, c: this.ground(sp.x, sp.y) }))
        .reduce((a, b) => (Math.hypot(b.c.x - this.cam.x, b.c.y - this.cam.y) < Math.hypot(a.c.x - this.cam.x, a.c.y - this.cam.y) ? b : a));
      this.cam.x = near.c.x;
      this.cam.y = near.c.y - 10;
      this.cam.s = Math.max(this.cam.s, 1.15);
      this.clampCam();
    },
    cancelCraft() {
      this.craftPlacing = null;
      this.craftConfirm = null;
      this.draw(performance.now());
    },
    // Toucher pendant la pose : une case dorée demande confirmation (déplacement : elle s'y pose aussitôt)
    tapCraftSpot(px, py) {
      const cell = this.tileAt(px, py);
      if (!cell || !this.craftSpots.some(sp => sp.x === cell.x && sp.y === cell.y)) {
        this.craftConfirm = null;
        this.$emit('show-alert', this.placingCraft ? `Choisis une case dorée : ${this.placingCraft.place.toLowerCase()}` : 'Choisis une case dorée.');
        this.draw(performance.now());
        return;
      }
      vibrate(6);
      if (this.craftPlacing.from) this.moveCraftTo(cell);
      else this.craftConfirm = { x: cell.x, y: cell.y, px, py };
      this.draw(performance.now());
    },
    // Pose confirmée : le serveur vérifie la règle ; la création surgit dans un nuage d'éclats
    async confirmCraft() {
      const target = this.craftConfirm;
      const craft = this.placingCraft;
      if (!target || !craft || this.busy) return;
      this.busy = true;
      const key = `craft:${target.x},${target.y}`;
      try {
        this.pops.set(key, performance.now());
        const { coins, world } = await playService.craftPlace(craft.id, target.x, target.y);
        this.craftPlacing = null;
        this.craftConfirm = null;
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.$nextTick(() => {
          const at = center(this.screenRectOf(target.x, target.y));
          ring(at, 80);
          burst(at, 18, 60);
          vibrate([12, 40, 18]);
        });
      } catch (error) {
        this.pops.delete(key);
        this.craftConfirm = null;
        this.$emit('show-alert', messageOf(error, 'La création n’a pas pu être posée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Déplacement gratuit vers la case dorée touchée
    async moveCraftTo(cell) {
      const { from } = this.craftPlacing;
      const key = `craft:${cell.x},${cell.y}`;
      this.craftPlacing = null;
      this.busy = true;
      try {
        this.pops.set(key, performance.now());
        const { coins, world } = await playService.craftMove(from.x, from.y, cell.x, cell.y);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.$nextTick(() => {
          burst(center(this.screenRectOf(cell.x, cell.y)), 14, 50);
          vibrate([10, 30, 10]);
        });
      } catch (error) {
        this.pops.delete(key);
        this.$emit('show-alert', messageOf(error, 'La création n’a pas pu être déplacée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Menu d'une création posée (appui long) : déplacer, ranger
    openCraftMenu(craft) {
      const c = this.ground(craft.x, craft.y);
      const sp = this.toScreen(c.x, c.y);
      // Le menu tient au-dessus de la création, sans sortir de la vue par le haut
      this.menuPos = { x: Math.max(80, Math.min(this.geo.width - 80, sp.x)), y: Math.max(56, sp.y - TW * this.cam.s * 1.15) };
      this.craftMenu = { x: craft.x, y: craft.y, craft: craft.craft };
    },
    moveFromMenu() {
      const { x, y, craft } = this.craftMenu;
      this.startCraftPlace(craft, { x, y });
    },
    // Création posée à cette case ({ x, y, craft, keeps?, keepText? }), ou un objet vide
    placedAt(cell) {
      return this.crafted.find(c => c.x === cell.x && c.y === cell.y) || {};
    },
    // Rangée dans la réserve de l'établi : elle se repose plus tard, sans rien payer ; pas si une autre compte sur elle
    async storeFromMenu() {
      const { x, y, craft } = this.craftMenu;
      this.craftMenu = null;
      const { keepText } = this.placedAt({ x, y });
      if (keepText) {
        this.$emit('show-alert', keepText);
        return;
      }
      this.busy = true;
      try {
        const { coins, world } = await playService.craftStore(x, y);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.$emit('show-alert', `${this.craftName(craft)} rangée dans la réserve de l’établi.`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La création n’a pas pu être rangée.'));
      } finally {
        this.busy = false;
      }
    }
  }
};
