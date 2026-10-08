<template>
  <div :class="['picking', { 'is-stung': stung, 'is-slip': slipped }]">
    <div class="picking__bar">
      <span class="picking__time" aria-hidden="true"><strong>{{ secondsLeft }}</strong> s</span>
      <span class="picking__meter" aria-hidden="true"><span :style="{ width: `${(1 - now / PICKING.duration) * 100}%` }"></span></span>
      <span class="picking__basket" aria-live="polite"><img v-if="basketArt" class="picking__basket-art" :src="basketArt" alt="" /><strong>{{ got.length }}</strong> cueillie{{ got.length > 1 ? 's' : '' }}</span>
    </div>
    <div class="picking__patch" :style="{ '--cols': PICKING.cols }">
      <button
        v-for="bush in bushes"
        :key="bush.cell"
        type="button"
        :class="['picking__bush', bush.kind && `has-${bush.kind}`, { 'is-late': bush.late, 'is-picked': popped === bush.cell }]"
        :disabled="!playing || ended"
        :aria-label="bush.kind ? `Buisson ${bush.cell + 1} : ${NAMES[bush.kind]}` : `Buisson ${bush.cell + 1}`"
        @pointerdown.prevent="pick(bush.cell)"
        @keydown.enter.prevent="pick(bush.cell)"
        @keydown.space.prevent="pick(bush.cell)"
      >
        <!-- Le buisson de la bibliothèque (secoué quand on y cueille), sinon celui d'ici -->
        <img v-if="bushArt(bush)" class="picking__leaves" :src="bushArt(bush)" alt="" draggable="false" />
        <svg v-else class="picking__leaves" viewBox="0 0 60 60" aria-hidden="true">
          <ellipse cx="30" cy="52" rx="22" ry="5" fill="rgba(40,60,20,.25)" />
          <circle cx="18" cy="36" r="13" fill="#4E8F3A" />
          <circle cx="42" cy="36" r="13" fill="#4E8F3A" />
          <circle cx="30" cy="26" r="15" fill="#5FA548" />
          <circle cx="24" cy="40" r="12" fill="#68B04F" />
          <circle cx="38" cy="41" r="11" fill="#5FA548" />
          <circle cx="26" cy="20" r="4" fill="rgba(255,255,255,.18)" />
        </svg>
        <span v-if="bush.kind" :key="bush.id" class="picking__fruit">
          <img v-if="fruitArt(bush)" class="picking__fruit-art" :src="fruitArt(bush)" alt="" draggable="false" />
          <GameIcon v-else :kind="bush.kind" :size="34" />
        </span>
        <!-- Ce qu'on vient de cueillir (le jus gicle) ou la piqûre des guêpes -->
        <img v-else-if="burst && burst.cell === bush.cell && burstArt" :key="`burst-${burst.at}`" class="picking__fruit-art picking__burst" :src="burstArt" alt="" draggable="false" />
      </button>
    </div>
    <p class="picking__hint">Mûres, fraises, myrtilles, cèpes : cueille-les avant qu’ils tombent. Gare aux guêpes !</p>
  </div>
</template>

<script>
import GameIcon from '../GameIcon/GameIcon.vue';
import { PICKING, BERRIES, pickingOf, ripeAt } from '@/game/minigames';
import { vibrate } from '@/utils/fx';
import { gamePiece, gameFrame, gameSuiteMs } from '@/game/minigameArt';

const NAMES = { mure: 'des mûres', fraise: 'une fraise', myrtille: 'des myrtilles', cepe: 'un cèpe', guepes: 'un nid de guêpes' };
const LATE_MS = 450;

// Cueillette : ce qui mûrit vient de la graine du serveur ; les gestes [t, buisson] lui sont renvoyés à la fin (end) et
// il les rejoue. Un buisson vide fait perdre un instant, les guêpes davantage (mêmes règles des deux côtés).
export default {
  name: 'PickingBoard',
  components: { GameIcon },
  props: {
    seed: { type: Number, required: true },
    playing: { type: Boolean, default: false }
  },
  emits: ['tally', 'end'],
  data() {
    // burst : la dernière cueillette ({ cell, kind, at }), le temps de son éclat
    return { PICKING, NAMES, now: 0, got: [], popped: -1, stung: false, slipped: false, ended: false, burst: null };
  },
  computed: {
    secondsLeft() {
      return Math.ceil((PICKING.duration - this.now) / 1000);
    },
    // Chaque buisson et ce qu'il porte en ce moment (le pas encore cueilli)
    bushes() {
      void this.got.length;
      return Array.from({ length: PICKING.cols * PICKING.rows }, (_, cell) => {
        const e = ripeAt(this.events, this.picked, this.now, cell);
        return { cell, kind: e ? e.kind : null, id: e ? e.id : -1, at: e ? e.at : 0, late: Boolean(e && e.until - this.now < LATE_MS) };
      });
    },
    // Le panier de la bibliothèque : vide, à moitié, plein
    basketArt() {
      const n = this.got.filter(k => k !== 'guepes').length;
      return gamePiece('cueillette', n ? (n < 20 ? 'panier_a-moitie' : 'panier_plein') : 'panier_vide');
    },
    burstArt() {
      if (!this.burst) return null;
      const suite = this.burst.kind === 'guepes' ? 'piqure' : `cueilli-${this.burst.kind}`;
      return this.now - this.burst.at < gameSuiteMs('cueillette', suite) ? gameFrame('cueillette', suite, this.now - this.burst.at) : null;
    }
  },
  watch: {
    playing(on) {
      if (on && !this.started) {
        this.started = performance.now();
        this.loop();
      }
    }
  },
  created() {
    // Non réactifs : la partie, ce qui est cueilli, les gestes
    this.events = pickingOf(this.seed);
    this.picked = new Set();
    this.picks = [];
    this.stunned = 0;
    this.started = 0;
    this.raf = 0;
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.fxTimer);
  },
  methods: {
    // Le buisson : secoué juste après une cueillette, sinon au repos (il respire, dans son SVG)
    bushArt(bush) {
      const since = this.burst && this.burst.cell === bush.cell ? this.now - this.burst.at : Infinity;
      return since < gameSuiteMs('cueillette', 'buisson-secoue') ? gameFrame('cueillette', 'buisson-secoue', since) : gamePiece('cueillette', 'buisson');
    },
    // Ce qu'il porte : qui mûrit (ses premiers instants), mûr, trop mûr (bientôt tombé) ; les guêpes
    fruitArt(bush) {
      if (bush.kind === 'guepes') return gamePiece('cueillette', 'guepes');
      const since = this.now - bush.at;
      if (since < gameSuiteMs('cueillette', `murit-${bush.kind}`)) return gameFrame('cueillette', `murit-${bush.kind}`, since);
      return gamePiece('cueillette', `${bush.kind}_${bush.late ? 'trop-mur' : 'mur'}`);
    },
    elapsed() {
      return this.started ? Math.min(PICKING.duration, Math.round(performance.now() - this.started)) : 0;
    },
    loop() {
      this.now = this.elapsed();
      if (this.now >= PICKING.duration) {
        this.finish();
        return;
      }
      this.raf = requestAnimationFrame(() => this.loop());
    },
    pick(cell) {
      if (!this.playing || this.ended) return;
      const t = this.elapsed();
      if (t < this.stunned || this.picks.length >= PICKING.maxPicks) return;
      this.picks.push([t, cell]);
      const e = ripeAt(this.events, this.picked, t, cell);
      clearTimeout(this.fxTimer);
      if (!e) {
        this.stunned = t + PICKING.slip;
        this.slipped = true;
        this.fxTimer = setTimeout(() => { this.slipped = false; }, PICKING.slip);
        vibrate(4);
        return;
      }
      this.picked.add(e.id);
      this.got.push(e.kind);
      this.popped = cell;
      this.burst = { cell, kind: e.kind, at: t };
      if (e.kind === 'guepes') {
        this.stunned = t + PICKING.stun;
        this.stung = true;
        this.fxTimer = setTimeout(() => { this.stung = false; }, PICKING.stun);
        vibrate([30, 40, 30]);
      } else {
        this.fxTimer = setTimeout(() => { this.popped = -1; }, 260);
        vibrate(e.kind === 'cepe' ? [12, 30, 16] : 8);
      }
      this.$emit('tally', { raw: this.got.reduce((s, k) => s + BERRIES[k].value, 0), detail: this.got.slice() });
    },
    finish() {
      if (this.ended) return;
      this.ended = true;
      cancelAnimationFrame(this.raf);
      this.$emit('end', this.picks.slice());
    },
    stop() {
      this.finish();
    }
  }
};
</script>

<style scoped src="./PickingBoard.css"></style>
