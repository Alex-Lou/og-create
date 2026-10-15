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
import { enclosuresOf } from '@/world/enclosures';
import { costText } from '@/world/needs';
import { FAILED } from '@/texts/world/screens/alerts';
import { DOOR_OFFER } from '@/texts/world/screens/island';

// Ce qui fait un mur (serveur : crafts.WALL_CRAFTS), et la porte
const WALL_CRAFTS = new Set(['cloture', 'muret', 'porte']);
const DOOR = 'porte';
// Les sols où une porte peut aller (herbe, sable, mousse, chemins : serveur, la porte « gsmpk »)
const DOOR_GROUND = 'gsmpk';
// Les leçons du tutoriel où la porte se propose quand même (les clôtures d'Hermine, ses portes)
const DOOR_LESSONS = new Set(['quest-clotures', 'quest-portes']);

export default {
  data() {
    return {
      // La porte proposée après une pose qui ferme un enclos : { key, missing, cells }, ou null
      doorOffer: null
    };
  },
  computed: {
    // Les enclos de l'île : [{ key, cells, gaps, fences }] (world/enclosures.js)
    enclosures() {
      const state = this.state;
      const M = this.M;
      if (!state || !M || !state.crafts) return [];
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
      for (const site of state.sites || []) {
        if (!site.level || site.hidden) continue;
        for (let dy = 0; dy < site.h; dy++) for (let dx = 0; dx < site.w; dx++) walls.add((site.y + dy) * n + site.x + dx);
      }
      for (const item of state.camp || []) {
        for (let dy = 0; dy < (item.h || 1); dy++) for (let dx = 0; dx < (item.w || 1); dx++) walls.add((Math.round(item.y) + dy) * n + Math.round(item.x) + dx);
      }
      for (const annex of state.annexes || []) taken.add(annex.y * n + annex.x);
      return enclosuresOf({
        size: n,
        land: (x, y) => M.land(x, y),
        wall: (x, y) => walls.has(y * n + x),
        fence: (x, y) => fences.has(y * n + x),
        open: (x, y) => !taken.has(y * n + x) && DOOR_GROUND.includes(M.ground(x, y))
      });
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
        plain: card.reserve > lock.ready ? DOOR_OFFER.reserve : costText(card.cost)
      };
    }
  },
  methods: {
    // Les enclos d'avant une pose (leur clé et leurs trous), pour voir lequel elle ferme (offerDoor)
    penMarks() {
      return new Map(this.enclosures.map(pen => [pen.key, pen.gaps.length]));
    },
    // Après une pose : un enclos nouveau, ou dont un trou vient de se combler, sans porte encore, propose la sienne (pas
    // pendant une leçon du tutoriel, sauf celles des portes d'Hermine)
    offerDoor(before) {
      const lesson = coach.state.lesson;
      if (lesson && !DOOR_LESSONS.has(lesson.id)) return;
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
      this.busy = true;
      try {
        const { coins, world } = await playService.craftLock(x, y, lock);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate(10);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.craftPose), 'error');
      } finally {
        this.busy = false;
      }
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
