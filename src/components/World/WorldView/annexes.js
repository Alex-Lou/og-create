// L'île : les annexes des bâtiments. La pose et le déplacement sur les cases dorées, la bulle et la fiche d'une annexe
// posée. Une annexe qui s'assemble (le poulailler d’Agathe, choix de l'auteur, 15 oct.) passe d'abord par son
// casse-tête (CraftPuzzle, comme à l'établi), rendu au serveur avec sa pose. Mixin de WorldView.vue : ses données et
// méthodes s'ajoutent à celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { annexReady, ranksOf } from '@/world/annexes';
import { annexPicture } from '@/world/annexSprites';
import { coach } from '@/game/coach';
import { vibrate } from '@/utils/fx';
import { TW } from '@/world/view/constants';
import { FAILED, TOASTS } from '@/texts/world/screens/alerts';
import { BANNERS, BUBBLES } from '@/texts/world/screens/island';

// Hauteur du menu de pose (nom, couleurs, boutons), pour qu'il tienne dans la vue
export const POSE_MENU_H = 150;
// Un casse-tête assemblé reste bon tant de temps (le serveur en accorde 30 min : world/rules.js, CRAFT_TTL_MS) : la
// pose annulée, on ne le refait pas
const ASSEMBLED_MS = 25 * 60 * 1000;

export default {
  data() {
    return {
      // Annexe en cours de pose ou de déplacement : { siteId, annexId, from: { x, y } | null } ; case dorée choisie, en
      // attente de confirmation : { x, y, px, py } ; sa pose choisie (miroir, couleur) : { flip, look } ; fiche d'une
      // annexe posée ouverte : { x, y }
      annexPlacing: null,
      annexConfirm: null,
      annexPose: { flip: false, look: 0 },
      annexSheet: null,
      // Le casse-tête d'une annexe ouvert : { id, annex, shape, pieces, turned, siteId, name } (serveur, et son
      // bâtiment), ou null ; celui qui est assemblé, en attente de sa pose : { annexId, run, layout, at }, ou null
      annexRun: null,
      annexAssembled: null,
      annexStarting: false
    };
  },
  computed: {
    // Au tutoriel, la leçon du poulailler : la main guide son assemblage (CraftPuzzle, guided)
    annexGuided() {
      return Boolean(coach.state.lesson && coach.state.lesson.id === 'quest-poulailler');
    },
    annexRunPicture() {
      return this.annexRun ? annexPicture(this.annexRun.annex) : '';
    },
    // Annexe en cours de pose : son bâtiment et sa carte du catalogue
    placingSite() {
      return this.annexPlacing && this.state ? this.state.sites.find(s => s.id === this.annexPlacing.siteId) || null : null;
    },
    placingAnnex() {
      return this.placingSite ? this.placingSite.annexes.find(a => a.id === this.annexPlacing.annexId) || null : null;
    },
    // Les cases de l'annexe posée : les siennes si elle demande son sol (le poulailler, sur l'herbe), sinon celles de son
    // bâtiment
    annexSpots() {
      if (!this.placingSite) return [];
      return (this.placingAnnex && this.placingAnnex.spots) || this.placingSite.spots || [];
    },
    annexBanner() {
      const name = this.placingAnnex ? this.placingAnnex.name : '';
      return this.annexPlacing && this.annexPlacing.from ? BANNERS.move(name) : BANNERS.pose(name);
    },
    // Le menu de pose se tient au-dessus de l'aperçu (sans le cacher), sans sortir de la vue par le haut
    annexConfirmStyle() {
      const c = this.annexConfirm;
      if (!c || !this.geo) return {};
      return { left: `${Math.max(160, Math.min(this.geo.width - 160, c.px))}px`, top: `${Math.max(POSE_MENU_H, c.py - TW * this.cam.s * 1.15)}px` };
    },
    // Fiche d'une annexe posée : sa carte du catalogue, son bâtiment, son n° d'exemplaire, sa pose (couleur dessinée,
    // miroir)
    sheetAnnex() {
      if (!this.annexSheet || !this.state) return null;
      const { x, y } = this.annexSheet;
      const rows = this.state.annexes || [];
      const row = rows.find(a => a.x === x && a.y === y);
      const site = row && this.state.sites.find(s => s.id === row.site);
      const annex = site && site.annexes.find(a => a.id === row.annex);
      if (!annex) return null;
      return { annex, site, rank: ranksOf(rows).get(`${x},${y}`) || 0, look: (this.annexVariants.get(`${x},${y}`) || 0) % (annex.looks || 1), flip: Boolean(row.flip) };
    },
    // L'annexe en attente de confirmation, dessinée en transparence sur sa case dorée avec la pose choisie
    annexGhost() {
      const c = this.annexConfirm;
      if (!c || !this.placingAnnex || (this.annexPlacing && this.annexPlacing.from)) return null;
      return { x: c.x, y: c.y, annex: this.placingAnnex.id, flip: this.annexPose.flip, look: this.annexPose.look, ghost: true };
    }
  },
  methods: {
    /* ---------- Annexes ---------- */
    annexReady,
    // Ce que dit la bulle d'une annexe touchée
    annexTip(annex) {
      const site = this.state.sites.find(s => s.id === annex.site);
      const entry = site && site.annexes.find(a => a.id === annex.annex);
      return entry ? { title: entry.name, text: `${entry.effect} · ${site.name}`, hint: BUBBLES.hold } : null;
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
    // « Poser » dans l'onglet Annexes : la fiche se ferme, les cases autorisées s'allument dans le quartier du bâtiment
    startAnnex(site, annex) {
      // (une annexe qui s'assemble : son casse-tête d'abord, s'il n'est pas déjà fait)
      if (annex.assembly && !this.assembledFor(annex.id)) {
        this.assembleAnnex(site, annex);
        return;
      }
      this.site = null;
      this.annexSheet = null;
      this.annexConfirm = null;
      this.annexPlacing = { siteId: site.id, annexId: annex.id, from: null };
      // Pose par défaut : la couleur de son rang (comme avant le choix), sans miroir
      this.annexPose = { flip: false, look: annex.built % (annex.looks || 1) };
      // (un seul niveau de cases dorées : celui de son bâtiment, poseLevel.js)
      this.beginPoseLevel(site.x + Math.floor(site.w / 2), site.y + Math.floor(site.h / 2), annex.spots || site.spots || []);
      vibrate(8);
      this.$nextTick(() => this.focusOn(site));
    },
    // Le casse-tête assemblé de cette annexe, encore bon ({ run, layout }), ou null
    assembledFor(annexId) {
      const done = this.annexAssembled;
      return done && done.annexId === annexId && Date.now() - done.at < ASSEMBLED_MS ? { run: done.run, layout: done.layout } : null;
    },
    // « Assembler » : le serveur tire ses pièces (rien n'est payé avant la pose), le casse-tête s'ouvre
    async assembleAnnex(site, annex) {
      if (this.annexStarting) return;
      this.annexStarting = true;
      try {
        const { run } = await playService.worldAnnexAssemble(annex.id);
        this.site = null;
        this.annexRun = { ...run, siteId: site.id, name: annex.name };
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.assemble), 'error');
      } finally {
        this.annexStarting = false;
      }
    },
    // Gabarit rempli, « Assembler » : le casse-tête est gardé pour la pose, les cases dorées s'allument
    annexAssembledDone(layout) {
      const run = this.annexRun;
      this.annexRun = null;
      if (!run) return;
      this.annexAssembled = { annexId: run.annex, run: run.id, layout: layout.map(step => ({ ...step })), at: Date.now() };
      const site = this.state.sites.find(s => s.id === run.siteId);
      const annex = site && site.annexes.find(a => a.id === run.annex);
      if (annex) this.startAnnex(site, annex);
    },
    closeAnnexPuzzle() {
      this.annexRun = null;
    },
    cancelAnnex() {
      this.annexPlacing = null;
      this.annexConfirm = null;
      this.draw(performance.now());
    },
    // Toucher pendant la pose : une case dorée du niveau allumé demande confirmation (déplacement : elle s'y pose
    // aussitôt) ; ailleurs, le doigt peut faire passer à un autre niveau (poseLevel.js)
    tapAnnexSpot(px, py) {
      const site = this.placingSite;
      const { cell, switched } = site ? this.pickPoseSpot(px, py, this.annexSpots) : { cell: null, switched: false };
      if (!cell) {
        this.annexConfirm = null;
        if (!switched) this.$emit('show-alert', TOASTS.annexAround(site));
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
        const { flip, look } = this.annexPose;
        const assembly = annex.assembly ? this.assembledFor(annex.id) || {} : {};
        const { built, coins, world } = await playService.worldAnnex(annex.id, target.x, target.y, annex.looks > 1 ? { flip, look } : { flip }, assembly);
        if (annex.assembly) this.annexAssembled = null;
        this.annexPlacing = null;
        this.annexConfirm = null;
        this.pops.set(`annex:${target.x},${target.y}`, performance.now());
        this.apply(world);
        this.$emit('coins-updated', coins);
        // (elle tombe à sa place, la poussière roule, et son nom monte : world/fetes.js)
        this.sparkleCell('pose', target, [{ text: built }]);
        vibrate([12, 40, 18]);
      } catch (error) {
        this.annexConfirm = null;
        const message = messageOf(error, FAILED.annexPose);
        // (son casse-tête refusé, rendu ou trop ancien : la prochaine pose le refait ; une case prise, il reste bon)
        if (annex.assembly && /assemblage/i.test(message)) {
          this.annexAssembled = null;
          this.annexPlacing = null;
        }
        this.$emit('show-alert', message, 'error');
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
        this.apply(await playService.worldAnnexMove(from.x, from.y, cell.x, cell.y));
        // (elle tombe à sa place quand le serveur l'y a mise : world/fetes.js)
        this.pops.set(key, performance.now());
        this.sparkleCell('pose', cell);
        vibrate([10, 30, 10]);
      } catch (error) {
        this.pops.delete(key);
        this.$emit('show-alert', messageOf(error, FAILED.annexMove), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Pose en attente de confirmation : pivoter, choisir la couleur (l'aperçu sur la case suit)
    turnPlacingAnnex() {
      this.annexPose = { ...this.annexPose, flip: !this.annexPose.flip };
      vibrate(6);
      this.draw(performance.now());
    },
    lookPlacingAnnex(look) {
      this.annexPose = { ...this.annexPose, look };
      vibrate(6);
      this.draw(performance.now());
    },
    // Fiche d'une annexe : pivoter ou changer sa couleur, gratuitement (pose : { flip } ou { look })
    async poseFromSheet(pose) {
      if (!this.annexSheet || this.busy) return;
      const { x, y } = this.annexSheet;
      this.busy = true;
      try {
        this.apply(await playService.worldAnnexPose(x, y, pose));
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.annexLook), 'error');
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
