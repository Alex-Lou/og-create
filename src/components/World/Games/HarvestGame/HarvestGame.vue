<template>
  <div class="harvest" role="dialog" aria-modal="true" aria-label="Récolte">
    <div class="harvest__card">
      <header class="harvest__head">
        <div>
          <span class="harvest__eyebrow">Récolte<template v-if="run.level"> · Niveau {{ run.level }}</template></span>
          <span class="harvest__title">{{ finished ? 'Récolte rentrée' : `${movesLeft} coup${movesLeft > 1 ? 's' : ''}` }}</span>
        </div>
        <button v-if="!finished" type="button" class="harvest__end" :disabled="sending || animating || quitting" @click="end">
          {{ moves.length ? 'Rentrer la récolte' : 'Quitter' }}
        </button>
      </header>

      <!-- Quitter sans un coup : la partie est perdue (elle ne compte ni pour les quêtes ni pour les visiteurs) -->
      <div v-if="quitting" class="harvest__quit" role="alertdialog" aria-label="Quitter la Récolte">
        <p>Quitter sans jouer ? La partie est perdue et ne compte pas.</p>
        <div class="harvest__quit-actions">
          <button type="button" class="harvest__btn harvest__btn--ghost" @click="quitting = false">Jouer</button>
          <button type="button" class="harvest__btn" @click="finish">Quitter quand même</button>
        </div>
      </div>

      <!-- Gains de la partie : estimés pendant le jeu, ceux du serveur à la fin -->
      <ul class="harvest__tally" aria-label="Gains">
        <li v-for="r in RESOURCES" :key="r.id" :class="['harvest__res', { 'is-boost': run.boosts[r.id] }]">
          <span aria-hidden="true"><ElementGlyph :glyph="r.glyph" /></span>
          <strong>{{ shown[r.id] }}</strong>
          <span class="oc-sr-only">{{ r.label }}</span>
          <em v-if="run.boosts[r.id]" class="harvest__boost">×{{ run.boosts[r.id] }}</em>
        </li>
      </ul>

      <!-- L'objectif du niveau (game/levels.js) ; la première fois, ce que sont les niveaux et les étoiles -->
      <p v-if="run.goal && !finished" class="harvest__goal">
        {{ run.goal.text }} · <strong>{{ Math.min(total, run.goal.need) }} / {{ run.goal.need }}</strong>
      </p>
      <p v-if="run.goal && !finished && !moves.length && firstTime" class="harvest__tip">
        Chaque partie a un objectif. Rempli, il donne 1 à 3 étoiles selon les coups qu’il te reste ; une étoile ouvre le niveau suivant.
      </p>
      <div v-if="!finished" class="harvest__hint" aria-live="polite">
        <template v-if="path.length >= MIN_CHAIN">Chaîne de {{ path.length }} : +{{ preview.amount }} <ElementGlyph :glyph="GLYPH[preview.kind]" /></template>
        <template v-else-if="path.length">Encore {{ MIN_CHAIN - path.length }}…</template>
        <template v-else>Relie au doigt 3 tuiles identiques voisines ou plus.</template>
      </div>

      <div
        v-if="!finished"
        ref="board"
        class="harvest__board"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
      >
        <div
          v-for="tile in tiles"
          :key="tile.id"
          :class="['harvest__tile', `is-${tile.kind}`, { 'is-picked': picked.has(tile.y * SIZE + tile.x), 'is-gone': gone.has(tile.y * SIZE + tile.x), 'is-fresh': tile.from !== null, 'has-art': Boolean(artOf(tile)) }]"
          :style="{ '--x': tile.x, '--y': tile.y, '--from': tile.from === null ? tile.y : tile.from }"
        >
          <!-- La tuile de la bibliothèque (au repos, choisie, cueillie, qui atterrit), sinon son icône -->
          <img v-if="artOf(tile)" :class="['harvest__art', { 'is-wide': gone.has(tile.y * SIZE + tile.x) }]" :src="artOf(tile)" alt="" draggable="false" />
          <span v-else aria-hidden="true"><ElementGlyph :glyph="GLYPH[tile.kind]" /></span>
          <img v-if="burst && gone.has(tile.y * SIZE + tile.x)" class="harvest__art is-wide" :src="burstArt" alt="" draggable="false" />
        </div>
        <svg class="harvest__path" viewBox="0 0 6 6" aria-hidden="true">
          <polyline v-if="path.length > 1" :points="pathPoints" />
        </svg>
      </div>

      <div v-else class="harvest__result">
        <p v-if="error" class="harvest__error" role="alert">{{ error }}</p>
        <p v-else-if="sending" class="harvest__wait">Le serveur pèse ta récolte…</p>
        <p v-else-if="!moves.length" class="harvest__done">Partie quittée sans jouer : elle est perdue.</p>
        <p v-else class="harvest__done">Ta récolte rejoint les réserves de l’île.</p>
        <p v-if="earned && !error && !sending" class="harvest__coins">
          +{{ earned }} <ElementGlyph glyph="ui:coin" /> <span>{{ earned > 1 ? 'écus' : 'écu' }} : un pour chaque dizaine de ressources</span>
        </p>
        <p v-if="chest && !error && !sending" class="harvest__chest">Un coffre {{ chestLabel }} est tombé ! Il s’ouvre au retour sur l’île.</p>
        <LevelBilan v-if="level && !error && !sending" :level="level" :stages="stages" />
        <!-- (une partie de la réserve ; un coffre tombé s'ouvre d'abord au retour sur l'île) -->
        <div v-if="level && charges && !chest && !sending" class="harvest__again">
          <!-- (pendant le tutoriel, grisés : la main ramène à l'île, où Brume attend avec la récompense) -->
          <button v-if="nextLevel" type="button" :class="['harvest__btn', { 'is-locked': tutorial }]" :disabled="tutorial" @click="$emit('again', nextLevel)">Niveau {{ nextLevel }}</button>
          <button type="button" :class="['harvest__btn', 'harvest__btn--ghost', { 'is-locked': tutorial }]" :disabled="tutorial" @click="$emit('again', level.level)">Rejouer ce niveau</button>
        </div>
        <button type="button" class="harvest__btn" data-coach="harvest-close" :disabled="sending" @click="$emit('close')">Retour à l’île</button>
      </div>
    </div>
  </div>
</template>

<script>
import { SIZE, MIN_CHAIN, create, play, gainOf } from '@/game/harvest';
import { vibrate, reducedMotion } from '@/utils/fx';
import { GLYPH, RESOURCES } from '@/game/resources';
import { RARITY } from '@/world/chest';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import LevelBilan from '../LevelBilan/LevelBilan.vue';
import { openOf } from '@/game/levels';
import { tileArt, chainArt, frameAt, PICK_MS, PICK_FRAMES, LAND_MS, LAND_FRAMES, LONG_CHAIN } from '@/game/harvestArt';

// Les tuiles cueillies : le temps de leur cueillette (4 images de la bibliothèque)
const GONE_MS = PICK_MS * PICK_FRAMES;
// Les tuiles tombées : elles atterrissent à la fin de leur chute (.34 s), en 2 images
const LAND_AFTER = 300;

// Récolte : le plateau vient de la graine du serveur ; les coups joués lui sont renvoyés à la fin,
// il les rejoue et décide seul du gain (result). Le moteur est partagé avec le serveur.
export default {
  name: 'HarvestGame',
  components: { ElementGlyph, LevelBilan },
  props: {
    run: { type: Object, required: true },
    sending: { type: Boolean, default: false },
    // Rareté du coffre tombé pendant la partie ('' : aucun)
    chest: { type: String, default: '' },
    result: { type: Object, default: null },
    // Écus de la partie (1 par tranche de 10 ressources), donnés par le serveur à la fin
    earned: { type: Number, default: 0 },
    error: { type: String, default: '' },
    // Le niveau joué, vu du serveur à la fin ({ level, goal, stars, best, bonus }) ; les étoiles des 30 niveaux ; les
    // parties en réserve (pour rejouer depuis le bilan)
    level: { type: Object, default: null },
    stages: { type: Array, default: () => [] },
    charges: { type: Number, default: 0 },
    // Le tutoriel est en cours : ni niveau suivant ni partie rejouée depuis le bilan
    tutorial: { type: Boolean, default: false }
  },
  emits: ['finish', 'again', 'close'],
  data() {
    return {
      SIZE, MIN_CHAIN, GLYPH, RESOURCES,
      tiles: [],
      path: [],
      gone: new Set(),
      moves: [],
      gains: { stone: 0, wood: 0, water: 0, food: 0 },
      animating: false,
      finished: false,
      // « Quitter » touché sans avoir joué : on demande d'abord
      quitting: false,
      // Les suites d'images de la bibliothèque : l'instant présent (pendant une animation), la cueillette (et l'éclat
      // d'une longue chaîne), les tuiles qui atterrissent
      now: 0, goneAt: 0, burst: false, landing: new Set(), landAt: 0
    };
  },
  computed: {
    chestLabel() {
      return (RARITY[this.chest] || RARITY.commun).label.toLowerCase();
    },
    movesLeft() {
      return this.run.maxMoves - this.moves.length;
    },
    // Les ressources de la partie (l'objectif du niveau)
    total() {
      return Object.values(this.gains).reduce((a, b) => a + b, 0);
    },
    // Aucune étoile encore : la bulle qui explique les niveaux
    firstTime() {
      return !openOf(this.stages).stars;
    },
    nextLevel() {
      const done = this.level;
      if (!done || !done.best) return null;
      return done.level + 1 <= openOf(this.stages).max ? done.level + 1 : null;
    },
    picked() {
      return new Set(this.path.map(([x, y]) => y * SIZE + x));
    },
    pathPoints() {
      return this.path.map(([x, y]) => `${x + 0.5},${y + 0.5}`).join(' ');
    },
    preview() {
      if (!this.path.length) return { amount: 0, kind: 'stone' };
      const [x, y] = this.path[0];
      const kind = this.game.board[y][x];
      return { kind, amount: gainOf(kind, this.path.length, this.run.boosts).amount };
    },
    shown() {
      return this.result || this.gains;
    },
    burstArt() {
      return chainArt(frameAt(this.goneAt, this.now, PICK_MS, PICK_FRAMES));
    }
  },
  created() {
    // Non réactifs : moteur et identifiants stables des tuiles (pour animer les chutes)
    this.game = create(this.run.seed, this.run.kinds);
    this.ids = this.game.board.map(row => row.map(() => 0));
    this.nextId = 1;
    this.timer = 0;
    this.pointer = null;
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) this.ids[y][x] = this.nextId++;
    this.tiles = this.layout(new Set());
  },
  beforeUnmount() {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
  },
  methods: {
    // Le dessin d'une tuile à cet instant : cueillie, qui atterrit, choisie, au repos ; null sans dessin
    artOf(tile) {
      const key = tile.y * SIZE + tile.x;
      if (this.gone.has(key)) return tileArt(tile.kind, 'cueillie', frameAt(this.goneAt, this.now, PICK_MS, PICK_FRAMES));
      if (this.landing.has(tile.id) && this.now >= this.landAt) return tileArt(tile.kind, 'atterrit', frameAt(this.landAt, this.now, LAND_MS, LAND_FRAMES));
      return tileArt(tile.kind, this.picked.has(key) ? 'choisie' : 'tuile');
    },
    // Fait avancer les suites d'images jusqu'à until (ms)
    animate(until) {
      cancelAnimationFrame(this.raf);
      if (reducedMotion()) return;
      const step = () => {
        this.now = performance.now();
        if (this.now < until) this.raf = requestAnimationFrame(step);
        else if (this.landing.size && this.now >= this.landAt + LAND_MS * LAND_FRAMES) this.landing = new Set();
      };
      step();
    },
    // Tuiles à afficher ; fresh : cases tombées du haut (avec leur hauteur de départ)
    layout(fresh, drops = {}) {
      const out = [];
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          const isFresh = fresh.has(this.ids[y][x]);
          out.push({ id: this.ids[y][x], kind: this.game.board[y][x], x, y, from: isFresh ? y - (drops[x] || SIZE) : null });
        }
      }
      return out;
    },
    cellAt(event) {
      const rect = this.$refs.board.getBoundingClientRect();
      const fx = ((event.clientX - rect.left) / rect.width) * SIZE;
      const fy = ((event.clientY - rect.top) / rect.height) * SIZE;
      const x = Math.floor(fx), y = Math.floor(fy);
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return null;
      // Seul le cœur de la case compte : les diagonales se prennent sans accrocher les voisines
      const near = Math.hypot(fx - x - 0.5, fy - y - 0.5) < 0.44;
      return near ? [x, y] : null;
    },
    onDown(event) {
      if (this.animating || this.finished || this.movesLeft <= 0) return;
      const cell = this.cellAt(event);
      if (!cell) return;
      this.pointer = event.pointerId;
      this.$refs.board.setPointerCapture(event.pointerId);
      this.path = [cell];
      vibrate(5);
    },
    onMove(event) {
      if (this.pointer !== event.pointerId || !this.path.length) return;
      const cell = this.cellAt(event);
      if (!cell) return;
      const [x, y] = cell;
      const last = this.path[this.path.length - 1];
      if (last[0] === x && last[1] === y) return;
      // Retour sur la case précédente : la chaîne recule
      const before = this.path[this.path.length - 2];
      if (before && before[0] === x && before[1] === y) {
        this.path.pop();
        return;
      }
      const [fx, fy] = this.path[0];
      const sameKind = this.game.board[y][x] === this.game.board[fy][fx];
      const touching = Math.max(Math.abs(last[0] - x), Math.abs(last[1] - y)) === 1;
      if (sameKind && touching && !this.picked.has(y * SIZE + x)) {
        this.path.push([x, y]);
        vibrate(this.path.length >= MIN_CHAIN ? 8 : 5);
      }
    },
    onUp(event) {
      if (this.pointer !== event.pointerId) return;
      this.pointer = null;
      const path = this.path;
      if (path.length < MIN_CHAIN) {
        this.path = [];
        return;
      }
      this.commit(path);
    },
    // Coup joué : les tuiles s'envolent, puis les colonnes tombent et le haut se remplit
    commit(path) {
      const kind = this.game.board[path[0][1]][path[0][0]];
      const gain = gainOf(kind, path.length, this.run.boosts);
      this.gains = { ...this.gains, [gain.resource]: this.gains[gain.resource] + gain.amount };
      this.moves.push(path.map(([x, y]) => [x, y]));
      this.gone = new Set(path.map(([x, y]) => y * SIZE + x));
      this.burst = path.length >= LONG_CHAIN;
      this.goneAt = performance.now();
      this.animate(this.goneAt + GONE_MS);
      this.path = [];
      this.animating = true;
      vibrate(path.length >= 5 ? [14, 30, 14] : 12);
      this.timer = setTimeout(() => {
        const removed = this.gone;
        const fresh = new Set();
        const drops = {};
        // Mêmes chutes que le moteur : par colonne, les tuiles gardées descendent, les nouvelles arrivent au-dessus
        for (let x = 0; x < SIZE; x++) {
          const kept = [];
          for (let y = 0; y < SIZE; y++) if (!removed.has(y * SIZE + x)) kept.push(this.ids[y][x]);
          const added = Array.from({ length: SIZE - kept.length }, () => this.nextId++);
          added.forEach(id => fresh.add(id));
          drops[x] = added.length;
          [...added, ...kept].forEach((id, y) => { this.ids[y][x] = id; });
        }
        play(this.game, path);
        if (this.game.shuffled) {
          for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
              this.ids[y][x] = this.nextId++;
              fresh.add(this.ids[y][x]);
            }
          }
          for (let x = 0; x < SIZE; x++) drops[x] = SIZE;
        }
        this.gone = new Set();
        this.burst = false;
        this.tiles = this.layout(fresh, drops);
        this.landing = fresh;
        this.landAt = performance.now() + LAND_AFTER;
        this.animate(this.landAt + LAND_MS * LAND_FRAMES + 20);
        this.timer = setTimeout(() => {
          this.animating = false;
          if (this.movesLeft <= 0) this.finish();
        }, 300);
      }, GONE_MS);
    },
    // Rentrer la récolte ; sans un coup joué, on demande d'abord (la partie serait perdue)
    end() {
      if (this.moves.length) this.finish();
      else this.quitting = true;
    },
    finish() {
      if (this.finished) return;
      this.finished = true;
      this.quitting = false;
      this.$emit('finish', this.moves);
    }
  }
};
</script>

<style scoped src="./HarvestGame.css"></style>
