// L'île : les créations d'île. L'établi, l'assemblage, la pose sur les cases dorées, le menu d'une création posée
// (déplacer, pivoter, ranger). Mixin de WorldView.vue : ses données et méthodes s'ajoutent à celles de l'île, qui les lit dans
// son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { TW } from '@/world/view/constants';
import { moveSpots } from '@/world/crafts';
import { POSE_MENU_H } from './annexes';
import { coach } from '@/game/coach';
import { enclosOf, cornerRingOf, torchSpotsOf } from '@/game/prologue';
import { stepCells } from '@/game/roads';
import { costText } from '@/world/needs';
import { FAILED, TOASTS } from '@/texts/world/screens/alerts';
import { BANNERS } from '@/texts/world/screens/island';

// Les leçons du tutoriel où la pose reprend tant que la réserve en garde (l'enclos d'Hermine : game/prologue.js)
const CHAIN_LESSONS = new Set(['quest-clotures', 'quest-enclos-cannelle']);
// Au plus tant de cases d'un trait (serveur : crafts.js, LINE_MAX)
const LINE_MAX = 40;

export default {
  data() {
    return {
      menuPos: { x: 0, y: 0 },
      // Créations d'île : établi ouvert ; assemblage en cours ({ id, craft, shape, pieces, turned }), son envoi, son refus,
      // sa réussite ; pose ou déplacement en cours ({ craft, from: { x, y } | null }) et case dorée choisie ({ x, y, px,
      // py }), posée en miroir ou non (craftFlip) ; menu d'une création posée ({ x, y, craft })
      benchOpen: false,
      craftRun: null,
      craftStarting: false,
      craftSending: false,
      craftError: '',
      craftMade: false,
      craftPlacing: null,
      craftConfirm: null,
      craftFlip: false,
      craftMenu: null,
      // Le trait en attente d'une création qui se pose en ligne (clôture, muret ; choix de l'auteur, 13 oct.) : { cells },
      // ou null ; la case refusée un instant ({ x, y, at })
      craftTrace: null,
      traceRefused: null,
      // Les piquets posés pendant une leçon des clôtures (choix de l'auteur, 15 oct. : on peut les défaire un à un jusqu'au
      // premier, tant que l'enclos n'est pas validé) : { lesson, cells: [{ x, y }] }, ou null
      lessonPosed: null
    };
  },
  mounted() {
    window.addEventListener('keydown', this.undoKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.undoKey);
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
    // La lanterne de Jovin, puis ses torches, au tutoriel : la main guide leur assemblage (CraftPuzzle, guided)
    craftGuided() {
      return Boolean(coach.state.lesson && ['quest-deco', 'quest-torches-rivet'].includes(coach.state.lesson.id));
    },
    craftSpots() {
      const from = this.craftPlacing && this.craftPlacing.from;
      if (!this.placingCraft) return [];
      if (from) return moveSpots(this.placingCraft.spots, from, this.placedAt(from).keeps);
      // (l'enclos d'Hermine : l'anneau autour du Feu, game/prologue.js : enclosOf ; s'il est bouclé, toutes les cases)
      const lesson = coach.state.lesson;
      if (lesson && CHAIN_LESSONS.has(lesson.id)) {
        const ring = this.enclos;
        if (ring.length) return ring;
      }
      // (les torches de Jovin : du côté d'où venaient les égarés, game/prologue.js : torchSpotsOf ; tous gardés, toutes)
      if (lesson && lesson.id === 'quest-torches-rivet') {
        const fire = this.state.sites.find(s => s.id === 'foyer' && s.level > 0);
        const sides = fire ? torchSpotsOf(fire, this.placingCraft.spots, this.crafted.filter(p => p.craft === 'torche')) : [];
        if (sides.length) return sides;
      }
      // (la lanterne de Jovin : au bord du chemin, près du feu, à quatre cases au plus ; sinon toutes)
      const foyer = lesson && lesson.id === 'quest-deco' && this.state.sites.find(s => s.id === 'foyer');
      if (foyer) {
        const near = this.placingCraft.spots.filter(sp => Math.max(Math.abs(sp.x - (foyer.x + 0.5)), Math.abs(sp.y - (foyer.y + 0.5))) <= 4);
        if (near.length) return near;
      }
      return this.placingCraft.spots;
    },
    // L'anneau de l'enclos encore libre (dans l'ordre du tour, depuis la brèche), pendant la leçon des clôtures : autour
    // du Feu, ou autour du coin de Marcelle (le jour de son abri)
    enclos() {
      const foyer = this.state && this.state.sites.find(s => s.id === 'foyer' && s.level > 0);
      if (!foyer || !this.placingCraft) return [];
      const lesson = coach.state.lesson;
      if (lesson && lesson.id === 'quest-enclos-cannelle') {
        const corner = (this.state.camp || []).find(c => c.id === 'cannelle');
        return corner ? cornerRingOf(corner, foyer, this.placingCraft.spots) : [];
      }
      return enclosOf(foyer, this.placingCraft.spots);
    },
    // La création en pose se trace d'un glisser (pas en déplacement)
    lineCraft() {
      return Boolean(this.placingCraft && this.placingCraft.line && this.craftPlacing && !this.craftPlacing.from);
    },
    // Combien un trait peut en poser : la réserve, puis ce que le stock paie (production en attente comprise)
    lineRoom() {
      const c = this.placingCraft;
      if (!c || !this.state) return 0;
      const has = r => ((this.state.stock && this.state.stock[r]) || 0) + ((this.state.pendingStock && this.state.pendingStock[r]) || 0);
      const paid = Math.min(...Object.entries(c.cost || {}).map(([r, n]) => Math.floor(has(r) / n)));
      return Math.min(LINE_MAX, c.reserve + (Number.isFinite(paid) ? paid : LINE_MAX));
    },
    // Le trait boucle l'enclos : toutes ses cases encore libres y sont (au tutoriel, « Poser » vient alors)
    // Le trait boucle l'enclos de la leçon ('anneau'), ou il pose déjà tout ce que la réserve et le stock paient ('bois' :
    // l'enclos de Marcelle sans assez de bois pour tout ; on valide ce qu'on peut, la Récolte donnera le reste ; sinon la
    // leçon attendait un bouclage impossible) ; '' sinon
    lineFull() {
      const cells = this.craftTrace ? this.craftTrace.cells : [];
      if (!cells.length) return '';
      if (this.enclos.length > 0 && this.enclos.every(sp => cells.some(c => c.x === sp.x && c.y === sp.y))) return 'anneau';
      return cells.length >= this.lineRoom ? 'bois' : '';
    },
    lineBanner() {
      const c = this.placingCraft;
      const n = this.craftTrace ? this.craftTrace.cells.length : 0;
      if (!c) return '';
      if (!n) return BANNERS.line(c.name.toLowerCase());
      const paid = Math.max(0, n - c.reserve);
      const price = paid ? ` · ${costText(Object.fromEntries(Object.entries(c.cost).map(([r, k]) => [r, k * paid])))}` : '';
      return `${c.name} : ${n} / ${this.lineRoom}${price}`;
    },
    // Le trait en attente, dessiné en transparence (draw/loop.js)
    lineGhosts() {
      if (!this.craftTrace || !this.placingCraft) return [];
      return this.craftTrace.cells.map(c => ({ x: c.x, y: c.y, craft: this.placingCraft.id, flip: false, ghost: true }));
    },
    craftBanner() {
      const name = this.placingCraft ? this.placingCraft.name : '';
      return this.craftPlacing && this.craftPlacing.from ? BANNERS.move(name) : BANNERS.pose(name);
    },
    // Le menu de pose se tient au-dessus de l'aperçu (sans le cacher), sans sortir de la vue par le haut
    craftConfirmStyle() {
      const c = this.craftConfirm;
      if (!c || !this.geo) return {};
      return { left: `${Math.max(110, Math.min(this.geo.width - 110, c.px))}px`, top: `${Math.max(POSE_MENU_H, c.py - TW * this.cam.s * 1.15)}px` };
    },
    menuStyle() {
      return { left: `${this.menuPos.x}px`, top: `${this.menuPos.y}px` };
    },
    // La création en attente de confirmation, dessinée en transparence sur sa case dorée
    craftGhost() {
      const c = this.craftConfirm;
      if (!c || !this.placingCraft || (this.craftPlacing && this.craftPlacing.from)) return null;
      return { x: c.x, y: c.y, craft: this.placingCraft.id, flip: this.craftFlip, ghost: true };
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
        const { run, coins } = await playService.craftStart(craftId);
        // Les écus qui attendaient ont pu être encaissés au passage (le serveur ramasse avant de payer)
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.craftRun = run;
        this.craftError = '';
        this.craftMade = false;
      } catch (error) {
        const message = messageOf(error, FAILED.assemble);
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
        this.craftError = messageOf(error, FAILED.check);
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
      this.craftFlip = false;
      this.craftTrace = null;
      if (!this.craftSpots.length) {
        this.craftPlacing = null;
        // Une création qui en garde une autre à portée le dit (règle « près de »)
        this.$emit('show-alert', (from && this.placedAt(from).keepText) || TOASTS.craftNoRoom);
        return;
      }
      vibrate(8);
      const near = this.focusOnSpots();
      // (un seul niveau de cases dorées : celui de sa place, ou de la case dorée la plus proche, poseLevel.js)
      const at = from || near;
      if (at) this.beginPoseLevel(at.x, at.y, this.craftSpots);
      this.draw(performance.now());
    },
    placeFromBench(craftId) {
      this.startCraftPlace(craftId);
    },
    placeFromPuzzle() {
      this.startCraftPlace(this.craftRun.craft);
    },
    // La caméra va vers la case dorée la plus proche du centre de la vue ; rend cette case
    focusOnSpots() {
      if (!this.craftSpots.length) return null;
      const near = this.craftSpots.map(sp => ({ sp, c: this.ground(sp.x, sp.y) }))
        .reduce((a, b) => (Math.hypot(b.c.x - this.cam.x, b.c.y - this.cam.y) < Math.hypot(a.c.x - this.cam.x, a.c.y - this.cam.y) ? b : a));
      this.cam.x = near.c.x;
      this.cam.y = near.c.y - 10;
      this.cam.s = Math.max(this.cam.s, 1.15);
      this.clampCam();
      return near.sp;
    },
    cancelCraft() {
      this.craftPlacing = null;
      this.craftConfirm = null;
      this.craftTrace = null;
      this.draw(performance.now());
    },
    // L'abri d'un coin du camp (celui de Marcelle : world/shelters.js, serveur) : bâti, payé ; il surgit en éclats
    async buildShelter(who) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { coins, world } = await playService.shelter(who);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        const corner = (this.state.camp || []).find(c => c.id === who);
        if (corner) this.sparkleCell('eclat', { x: corner.x, y: corner.y });
        vibrate([12, 40, 18]);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.shelter), 'error');
      } finally {
        this.busy = false;
      }
    },
    /* ---------- Pose d'un trait (clôture, muret) : l'appui long puis le glisser, comme un chemin (roads.js) ---------- */
    // L'appui long sur l'île : le doigt trace. gesture : le geste en cours (gestures.js)
    lineHold(gesture) {
      if (!gesture || gesture !== this.gesture || !this.lineCraft || this.pointers.size !== 1) return;
      const tile = this.tileAt(gesture.start.x, gesture.start.y);
      if (!tile) return;
      this.craftConfirm = null;
      if (!this.craftTrace) this.craftTrace = { cells: [] };
      gesture.line = { last: tile };
      gesture.held = true;
      this.lineAdd(tile);
      vibrate(14);
      this.drawSoon();
    },
    lineMove(trace, px, py) {
      const tile = this.tileAt(px, py);
      if (!tile || (tile.x === trace.last.x && tile.y === trace.last.y)) return;
      for (const c of stepCells(trace.last, tile)) this.lineAdd(c);
      trace.last = tile;
      this.drawSoon();
    },
    // Une case de plus au trait : seulement une case dorée, pas deux fois, et tant que le stock le paie
    lineAdd(c) {
      const cells = this.craftTrace.cells;
      if (cells.some(e => e.x === c.x && e.y === c.y)) return;
      if (!this.craftSpots.some(sp => sp.x === c.x && sp.y === c.y)) return;
      if (cells.length >= this.lineRoom) {
        if (!this.traceRefused || performance.now() - this.traceRefused.at > 600) vibrate([6, 30, 6]);
        this.traceRefused = { x: c.x, y: c.y, at: performance.now() };
        return;
      }
      cells.push({ x: c.x, y: c.y });
      vibrate(3);
    },
    // La leçon des clôtures en cours (CHAIN_LESSONS), ou null
    fenceLesson() {
      const lesson = coach.state.lesson;
      return lesson && CHAIN_LESSONS.has(lesson.id) ? lesson.id : null;
    },
    // Ce que ↶ peut défaire : une case du trait, sinon un piquet posé pendant cette leçon
    canUndoLine() {
      if (this.craftTrace && this.craftTrace.cells.length) return true;
      return Boolean(this.lessonPosed && this.lessonPosed.lesson === this.fenceLesson() && this.lessonPosed.cells.length);
    },
    // Les piquets que le serveur vient de poser pendant une leçon des clôtures : retenus pour ↶
    keepLessonPosed(cells) {
      const lesson = this.fenceLesson();
      if (!lesson || !cells.length) return;
      if (!this.lessonPosed || this.lessonPosed.lesson !== lesson) this.lessonPosed = { lesson, cells: [] };
      this.lessonPosed.cells.push(...cells.map(c => ({ x: c.x, y: c.y })));
    },
    // ↶ (ou Ctrl+Z) : la dernière case du trait est retirée ; sans trait, pendant une leçon des clôtures, le dernier piquet
    // posé est défait, jusqu'au premier (le serveur : celui de la caisse d'Hermine retourne dans la réserve, un piquet
    // payé rend son bois)
    undoLine() {
      if (this.craftTrace && this.craftTrace.cells.length) {
        this.craftTrace.cells.pop();
        vibrate(4);
        this.drawSoon();
        return;
      }
      if (this.canUndoLine()) this.unposeLast();
    },
    async unposeLast() {
      if (this.busy) return;
      const cell = this.lessonPosed.cells[this.lessonPosed.cells.length - 1];
      this.busy = true;
      try {
        const { coins, world } = await playService.craftUnpose(cell.x, cell.y);
        this.lessonPosed.cells.pop();
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate(4);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.craftStore), 'error');
      } finally {
        this.busy = false;
      }
    },
    undoKey(event) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z' || !this.lineCraft) return;
      event.preventDefault();
      this.undoLine();
    },
    // « Poser » : le serveur pose chaque case dans l'ordre (la réserve d'abord, puis fabriquées et payées en passant) ; ce
    // qu'il n'a pas pu poser, il le dit. Les pièces surgissent l'une après l'autre
    async confirmLine() {
      const craft = this.placingCraft;
      const cells = this.craftTrace ? this.craftTrace.cells.slice() : [];
      if (!craft || !cells.length || this.busy) return;
      this.busy = true;
      try {
        const { placed, stopped, coins, world } = await playService.craftLine(craft.id, cells.map(c => [c.x, c.y]));
        this.craftPlacing = null;
        this.craftTrace = null;
        this.keepLessonPosed(cells.slice(0, placed));
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        if (stopped) this.$emit('show-alert', TOASTS.linePlaced(placed, stopped));
        cells.slice(0, placed).forEach((c, i) => setTimeout(() => this.sparkleCell('eclat', c), i * 60));
        vibrate([12, 40, 18]);
        const left = this.state.crafts.catalog.find(c => c.id === craft.id);
        if (left && left.reserve > 0 && coach.state.lesson && CHAIN_LESSONS.has(coach.state.lesson.id)) this.$nextTick(() => this.startCraftPlace(craft.id));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.line), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Toucher pendant la pose : une case dorée du niveau allumé demande confirmation (déplacement : elle s'y pose
    // aussitôt) ; ailleurs, le doigt peut faire passer à un autre niveau (poseLevel.js). Un trait en attente : le toucher
    // ajoute ou retire sa case
    tapCraftSpot(px, py) {
      if (this.craftTrace && this.craftTrace.cells.length) {
        const tile = this.tileAt(px, py);
        const cells = this.craftTrace.cells;
        const at = tile ? cells.findIndex(c => c.x === tile.x && c.y === tile.y) : -1;
        if (at >= 0) cells.splice(at, 1);
        else if (tile) this.lineAdd(tile);
        this.drawSoon();
        return;
      }
      const { cell, switched } = this.pickPoseSpot(px, py, this.craftSpots);
      if (!cell) {
        this.craftConfirm = null;
        if (!switched) this.$emit('show-alert', this.placingCraft ? TOASTS.craftChooseFor(this.placingCraft.place.toLowerCase()) : TOASTS.craftChoose);
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
        const { coins, world } = await playService.craftPlace(craft.id, target.x, target.y, this.craftFlip);
        this.craftPlacing = null;
        this.craftConfirm = null;
        this.keepLessonPosed([target]);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        // (au tutoriel, les piquets d'Hermine : la pose reprend tant qu'il en reste, sans rouvrir l'établi)
        const left = this.state.crafts.catalog.find(c => c.id === craft.id);
        if (left && left.reserve > 0 && coach.state.lesson && CHAIN_LESSONS.has(coach.state.lesson.id)) this.$nextTick(() => this.startCraftPlace(craft.id));
        // (elle tombe à sa place quand le serveur l'y a mise : world/fetes.js)
        this.pops.set(key, performance.now());
        this.sparkleCell('pose', target);
        vibrate([12, 40, 18]);
      } catch (error) {
        this.pops.delete(key);
        this.craftConfirm = null;
        this.$emit('show-alert', messageOf(error, FAILED.craftPose), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Déplacement gratuit vers la case dorée touchée
    async moveCraftTo(cell) {
      const { from, craft } = this.craftPlacing;
      const key = `craft:${cell.x},${cell.y}`;
      this.craftPlacing = null;
      this.busy = true;
      try {
        const { coins, world } = await playService.craftMove(from.x, from.y, cell.x, cell.y);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        // (le tutoriel apprend à déplacer : App, story.js)
        this.$emit('moved', craft);
        this.pops.set(key, performance.now());
        this.sparkleCell('pose', cell);
        vibrate([10, 30, 10]);
      } catch (error) {
        this.pops.delete(key);
        this.$emit('show-alert', messageOf(error, FAILED.craftMove), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Pose en attente de confirmation : pivoter (l'aperçu sur la case suit)
    turnPlacingCraft() {
      this.craftFlip = !this.craftFlip;
      vibrate(6);
      this.draw(performance.now());
    },
    // Menu d'une création posée : pivoter, gratuitement (le menu reste ouvert pour pivoter encore)
    async turnFromMenu() {
      if (!this.craftMenu || this.busy) return;
      const { x, y } = this.craftMenu;
      this.busy = true;
      try {
        const { coins, world } = await playService.craftTurn(x, y, !this.placedAt({ x, y }).flip);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.craftTurn), 'error');
      } finally {
        this.busy = false;
      }
    },
    // Menu d'une création posée (appui long) : déplacer, pivoter, ranger
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
        this.$emit('show-alert', TOASTS.craftStored(this.craftName(craft)));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.craftStore), 'error');
      } finally {
        this.busy = false;
      }
    }
  }
};
