// L'île : ses enclos (choix de l'auteur, 15 oct.). Une boucle de clôtures, de murets et de portes, que ferment aussi les
// bâtiments, le camp et l'eau (world/enclosures.js) : son intérieur s'éclaire doucement ; quand une pose ferme une boucle
// (ou presque : un sentier la traverse), l'île propose une porte, avec son verrou ou sans (Hud/DoorOffer) ; la porte se
// pose sur une case dorée du mur (un trou, sinon un piquet qui retourne dans la réserve). Le menu d'une porte posée la
// verrouille ou ôte son verrou. Le serveur décide de tout (creations.js : placeDoor, lockDoor). Mixin de WorldView.vue.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { coach } from '@/game/coach';
import { TW, TH } from '@/world/view/constants';
import { enclosuresOf, loopHintOf } from '@/world/enclosures';
import { costText } from '@/world/needs';
import { FAILED } from '@/texts/world/screens/alerts';
import { DOOR_OFFER } from '@/texts/world/screens/island';

// Ce qui fait un mur (serveur : crafts.WALL_CRAFTS), et la porte
const WALL_CRAFTS = new Set(['cloture', 'muret', 'porte']);
const DOOR = 'porte';
// Les sols où une porte peut aller (herbe, sable, mousse, chemins, terre battue : serveur, la porte « gsmpkt »)
const DOOR_GROUND = 'gsmpkt';

export default {
  data() {
    return {
      // La porte proposée après une pose qui ferme un enclos : { key, missing, cells }, ou null
      doorOffer: null
    };
  },
  computed: {
    // Ce qui ferme un enclos sans être une création (et où un mur s'accroche : walls.js) : les bâtiments bâtis, le camp
    // (l'épave comprise). Set de « x,y »
    wallAnchors() {
      const out = new Set();
      const state = this.state;
      if (!state) return out;
      const add = (x0, y0, w, h) => {
        for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) out.add(`${x0 + dx},${y0 + dy}`);
      };
      for (const site of state.sites || []) if (site.level && !site.hidden) add(site.x, site.y, site.w, site.h);
      for (const item of state.camp || []) add(Math.round(item.x), Math.round(item.y), item.w || 1, item.h || 1);
      return out;
    },
    // Ce qui fait les enclos de l'île, pour world/enclosures.js : { size, land, wall, fence, open }, ou null
    enclosureMap() {
      const state = this.state;
      const M = this.M;
      if (!state || !M || !state.crafts) return null;
      const n = state.size;
      const walls = new Set();
      const fences = new Set();
      const taken = new Set();
      for (const c of state.crafts.placed) {
        const k = c.y * n + c.x;
        taken.add(k);
        if (WALL_CRAFTS.has(c.craft)) {
          walls.add(k);
          fences.add(k);
        }
      }
      for (const cell of this.wallAnchors) {
        const [x, y] = cell.split(',').map(Number);
        walls.add(y * n + x);
      }
      for (const annex of state.annexes || []) taken.add(annex.y * n + annex.x);
      return {
        size: n,
        land: (x, y) => M.land(x, y),
        wall: (x, y) => walls.has(y * n + x),
        fence: (x, y) => fences.has(y * n + x),
        open: (x, y) => !taken.has(y * n + x) && DOOR_GROUND.includes(M.ground(x, y))
      };
    },
    // Les enclos de l'île : [{ key, cells, gaps, fences }] (world/enclosures.js)
    enclosures() {
      return this.enclosureMap ? enclosuresOf(this.enclosureMap) : [];
    },
    // Le trait d'une clôture ou d'un muret en cours (hors leçon du tutoriel, qui montre déjà sa ligne) : la boucle qui
    // le fermerait, en pointillés, et ce qu'il y manque (world/enclosures.js : loopHintOf) ; { cells, closes }, ou null
    loopHint() {
      const map = this.enclosureMap;
      const cells = this.lineCraft && this.craftTrace ? this.craftTrace.cells : [];
      if (!map || !cells.length || this.fenceLesson()) return null;
      const spots = new Set(this.craftSpots.map(c => c.y * map.size + c.x));
      return loopHintOf({ ...map, spot: (x, y) => spots.has(y * map.size + x), trace: cells, before: new Set(this.enclosures.map(p => p.key)) });
    },
    // Les cases des enclos fermés (sans trou), qui s'éclairent
    penCells() {
      return this.enclosures.filter(pen => !pen.gaps.length).flatMap(pen => pen.cells);
    },
    // La porte à l'établi : son prix, celui de son verrou, ce qui attend en réserve
    doorCard() {
      return this.state && this.state.crafts ? this.state.crafts.catalog.find(c => c.id === DOOR) || null : null;
    },
    // Ce que coûte le verrou d'une porte posée (son menu)
    lockPrice() {
      const card = this.doorCard;
      return card && card.lock ? costText(card.lock.cost) : '';
    },
    doorCosts() {
      const card = this.doorCard;
      if (!card) return { lock: '', plain: '' };
      const lock = card.lock || { cost: {}, ready: 0 };
      const both = { ...card.cost };
      for (const [r, k] of Object.entries(lock.cost)) both[r] = (both[r] || 0) + k;
      return {
        lock: lock.ready ? DOOR_OFFER.reserve : card.reserve ? costText(lock.cost) : costText(both),
        // (rien à payer tant qu'une porte attend en réserve, même verrouillée : serveur, placeDoor)
        plain: card.reserve > 0 ? DOOR_OFFER.reserve : costText(card.cost)
      };
    }
  },
  methods: {
    // Les enclos d'avant une pose (leur clé et leurs trous), pour voir lequel elle ferme (offerDoor)
    penMarks() {
      return new Map(this.enclosures.map(pen => [pen.key, pen.gaps.length]));
    },
    // Après une pose : un enclos nouveau, ou dont un trou vient de se combler, sans porte encore, propose la sienne (pas
    // pendant une leçon du tutoriel : sa barrière du nord n'enclôt rien, choix de l'auteur, 19 oct.)
    offerDoor(before) {
      if (coach.state.lesson) return;
      const doors = new Set(this.crafted.filter(c => c.craft === DOOR).map(c => `${c.x},${c.y}`));
      const pen = this.enclosures.find(p => !before.has(p.key) && !p.fences.some(c => doors.has(`${c.x},${c.y}`)));
      if (!pen) return;
      this.doorOffer = { key: pen.key, missing: pen.gaps.length };
      vibrate([8, 30, 8]);
    },
    // « Avec verrou » ou « Sans verrou » : les cases dorées du mur (ses trous d'abord ; sinon ses piquets, pas ses portes)
    startDoorPlace(lock) {
      const offer = this.doorOffer;
      this.doorOffer = null;
      const pen = offer && this.enclosures.find(p => p.key === offer.key);
      if (!pen) return;
      const doors = new Set(this.crafted.filter(c => c.craft === DOOR).map(c => `${c.x},${c.y}`));
      const cells = pen.gaps.length ? pen.gaps : pen.fences.filter(c => !doors.has(`${c.x},${c.y}`));
      if (!cells.length) return;
      this.craftMenu = null;
      this.craftConfirm = null;
      this.craftTrace = null;
      this.craftPlacing = { craft: DOOR, from: null, door: { lock, key: pen.key, cells: cells.map(c => ({ x: c.x, y: c.y })) } };
      vibrate(8);
      const near = this.focusOnSpots();
      if (near) this.beginPoseLevel(near.x, near.y, this.craftSpots);
      this.draw(performance.now());
    },
    // « Poser ici » d'une porte : le serveur la pose (et paie ce qu'il faut) ; s'il reste des trous dans ce mur, la pose
    // continue sur eux ; l'enclos fermé, il le dit
    async confirmDoor() {
      const target = this.craftConfirm;
      const door = this.craftPlacing && this.craftPlacing.door;
      if (!target || !door || this.busy) return;
      this.busy = true;
      const key = `craft:${target.x},${target.y}`;
      try {
        const { coins, world } = await playService.craftDoor(target.x, target.y, door.lock);
        this.craftPlacing = null;
        this.craftConfirm = null;
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.pops.set(key, performance.now());
        this.sparkleCell('pose', target);
        vibrate([12, 40, 18]);
        const pen = this.enclosures.find(p => p.key === door.key);
        if (pen && pen.gaps.length) {
          this.craftPlacing = { craft: DOOR, from: null, door: { ...door, cells: pen.gaps.map(c => ({ x: c.x, y: c.y })) } };
          this.focusOnSpots();
        } else if (pen) this.$emit('show-alert', DOOR_OFFER.done);
      } catch (error) {
        this.pops.delete(key);
        this.craftConfirm = null;
        this.$emit('show-alert', messageOf(error, FAILED.craftPose), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Le menu d'une porte posée : la verrouiller (payé), ou ôter son verrou
    async lockFromMenu(lock) {
      if (!this.craftMenu || this.busy) return;
      const { x, y } = this.craftMenu;
      await this.runAction(FAILED.craftPose, async () => {
          const { coins, world } = await playService.craftLock(x, y, lock);
          this.apply(world);
          if (coins !== undefined) this.$emit('coins-updated', coins);
          vibrate(10);
      });
    },
    // La boucle suggérée d'un trait : des pointillés clairs qui courent sur les cases qui la fermeraient, et leur cœur
    // blanc doré qui respire (par-dessus tout, comme le trait, plus francs que les cases dorées autour)
    drawLoopHint(ctx, view, t, s) {
      const hint = this.loopHint;
      if (!hint || !hint.cells.length) return;
      const still = this.reduced();
      const k = still ? 1 : 0.75 + 0.25 * Math.sin(t * 3);
      ctx.save();
      ctx.lineJoin = 'round';
      for (const cell of hint.cells) {
        const c = this.ground(cell.x, cell.y);
        if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TW || c.y > view.y + view.h + TW) continue;
        this.diamond(ctx, c.x, c.y, TW * 0.86, TH * 0.86);
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(255, 250, 228, ${(0.48 * k).toFixed(3)})`;
        ctx.fill();
        ctx.setLineDash([7 / s, 5 / s]);
        ctx.lineDashOffset = still ? 0 : -t * 14 / s;
        ctx.strokeStyle = 'rgba(92, 56, 12, .85)';
        ctx.lineWidth = 4 / s;
        ctx.stroke();
        ctx.strokeStyle = '#FFF4C8';
        ctx.lineWidth = 2.2 / s;
        ctx.stroke();
      }
      ctx.restore();
    },
    // L'intérieur des enclos fermés : une lueur chaude qui respire à peine (sous ce qui s'y tient)
    drawPens(ctx, view, t) {
      if (!this.penCells.length) return;
      const k = this.reduced() ? 0.5 : 0.5 + 0.5 * Math.sin(t * 1.2);
      ctx.fillStyle = `rgba(255, 228, 150, ${(0.1 + 0.05 * k).toFixed(3)})`;
      for (const cell of this.penCells) {
        const c = this.ground(cell.x, cell.y);
        if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TW || c.y > view.y + view.h + TW) continue;
        this.diamond(ctx, c.x, c.y, TW, TH);
        ctx.fill();
      }
    }
  }
};
