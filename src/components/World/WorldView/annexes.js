// L'île : les annexes des bâtiments. La pose et le déplacement sur les cases dorées, la bulle et la fiche d'une annexe
// posée. Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { annexReady } from '@/world/annexes';
import { burst, ring, vibrate, center } from '@/utils/fx';

export default {
  data() {
    return {
      // Annexe en cours de pose ou de déplacement : { siteId, annexId, from: { x, y } | null } ; case dorée choisie, en
      // attente de confirmation : { x, y, px, py } ; fiche d'une annexe posée ouverte : { x, y }
      annexPlacing: null,
      annexConfirm: null,
      annexSheet: null
    };
  },
  computed: {
    // Annexe en cours de pose : son bâtiment et sa carte du catalogue
    placingSite() {
      return this.annexPlacing && this.state ? this.state.sites.find(s => s.id === this.annexPlacing.siteId) || null : null;
    },
    placingAnnex() {
      return this.placingSite ? this.placingSite.annexes.find(a => a.id === this.annexPlacing.annexId) || null : null;
    },
    annexBanner() {
      const name = this.placingAnnex ? this.placingAnnex.name : '';
      return this.annexPlacing && this.annexPlacing.from ? `Touche une case dorée pour y déplacer : ${name}.` : `Touche une case dorée pour poser : ${name}.`;
    },
    annexConfirmStyle() {
      const c = this.annexConfirm;
      if (!c || !this.geo) return {};
      return { left: `${Math.max(110, Math.min(this.geo.width - 110, c.px))}px`, top: `${Math.max(56, c.py - 24)}px` };
    },
    // Fiche d'une annexe posée : sa carte du catalogue, son bâtiment, son n° d'exemplaire
    sheetAnnex() {
      if (!this.annexSheet || !this.state) return null;
      const { x, y } = this.annexSheet;
      const row = (this.state.annexes || []).find(a => a.x === x && a.y === y);
      const site = row && this.state.sites.find(s => s.id === row.site);
      const annex = site && site.annexes.find(a => a.id === row.annex);
      return annex ? { annex, site, variant: this.annexVariants.get(`${x},${y}`) || 0 } : null;
    }
  },
  methods: {
    /* ---------- Annexes ---------- */
    annexReady,
    // Ce que dit la bulle d'une annexe touchée
    annexTip(annex) {
      const site = this.state.sites.find(s => s.id === annex.site);
      const entry = site && site.annexes.find(a => a.id === annex.annex);
      return entry ? { title: entry.name, text: `${entry.effect} · ${site.name}`, hint: 'Appui long : sa fiche' } : null;
    },
    // La carte se recentre sur un bâtiment, assez près pour voir ses cases autour
    focusOn(site) {
      const c = this.centerOf(site);
      this.cam.x = c.x;
      this.cam.y = c.y - 10;
      this.cam.s = Math.max(this.cam.s, 1.15);
      this.clampCam();
      this.draw(performance.now());
    },
    // « Poser » dans l'onglet Annexes : la fiche se ferme, les cases autorisées s'allument autour du bâtiment
    startAnnex(site, annex) {
      this.site = null;
      this.annexSheet = null;
      this.annexConfirm = null;
      this.annexPlacing = { siteId: site.id, annexId: annex.id, from: null };
      vibrate(8);
      this.$nextTick(() => this.focusOn(site));
    },
    cancelAnnex() {
      this.annexPlacing = null;
      this.annexConfirm = null;
      this.draw(performance.now());
    },
    // Toucher pendant la pose : une case dorée demande confirmation (déplacement : elle s'y pose aussitôt)
    tapAnnexSpot(px, py) {
      const cell = this.tileAt(px, py);
      const site = this.placingSite;
      if (!site || !cell || !site.spots.some(spot => spot.x === cell.x && spot.y === cell.y)) {
        this.annexConfirm = null;
        this.$emit('show-alert', `Choisis une case dorée autour de ${site ? site.name : 'son bâtiment'}.`);
        this.draw(performance.now());
        return;
      }
      vibrate(6);
      if (this.annexPlacing.from) this.moveAnnex(cell);
      else this.annexConfirm = { x: cell.x, y: cell.y, px, py };
      this.draw(performance.now());
    },
    // Pose confirmée : le serveur vérifie et débite ; l'annexe surgit dans un nuage d'éclats
    async confirmAnnex() {
      const target = this.annexConfirm;
      const annex = this.placingAnnex;
      if (!target || !annex || this.busy) return;
      this.busy = true;
      try {
        const { built, coins, world } = await playService.worldAnnex(annex.id, target.x, target.y);
        this.annexPlacing = null;
        this.annexConfirm = null;
        this.pops.set(`annex:${target.x},${target.y}`, performance.now());
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.$nextTick(() => {
          const at = center(this.screenRectOf(target.x, target.y));
          ring(at, 90);
          burst(at, 20, 70);
          vibrate([12, 40, 18]);
        });
        this.$emit('show-alert', `Nouvelle annexe : ${built}\u00a0!`);
      } catch (error) {
        this.annexConfirm = null;
        this.$emit('show-alert', messageOf(error, 'L’annexe n’a pas pu être posée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Déplacement gratuit vers la case dorée touchée
    async moveAnnex(cell) {
      const { from } = this.annexPlacing;
      const key = `annex:${cell.x},${cell.y}`;
      this.annexPlacing = null;
      this.busy = true;
      try {
        this.pops.set(key, performance.now());
        this.apply(await playService.worldAnnexMove(from.x, from.y, cell.x, cell.y));
        this.$nextTick(() => {
          burst(center(this.screenRectOf(cell.x, cell.y)), 14, 50);
          vibrate([10, 30, 10]);
        });
      } catch (error) {
        this.pops.delete(key);
        this.$emit('show-alert', messageOf(error, 'L’annexe n’a pas pu être déplacée.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Fiche d'une annexe : « Déplacer » allume les cases libres autour de son bâtiment ; « Bâtiment » ouvre sa fiche
    moveFromSheet() {
      const info = this.sheetAnnex;
      if (!info) return;
      const { x, y } = this.annexSheet;
      this.annexSheet = null;
      this.annexPlacing = { siteId: info.site.id, annexId: info.annex.id, from: { x, y } };
      this.focusOn(info.site);
    },
    siteFromSheet() {
      const info = this.sheetAnnex;
      this.annexSheet = null;
      if (!info) return;
      this.site = info.site;
      this.siteTab = 'annexes';
    }
  }
};
