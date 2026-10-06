<template>
  <div :class="['picking', { 'is-stung': stung, 'is-slip': slipped }]">
    <div class="picking__bar">
      <span class="picking__time" aria-hidden="true"><strong>{{ secondsLeft }}</strong> s</span>
      <span class="picking__meter" aria-hidden="true"><span :style="{ width: `${(1 - now / PICKING.duration) * 100}%` }"></span></span>
      <span class="picking__basket" aria-live="polite"><strong>{{ got.length }}</strong> cueillie{{ got.length > 1 ? 's' : '' }}</span>
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
        <svg class="picking__leaves" viewBox="0 0 60 60" aria-hidden="true">
          <ellipse cx="30" cy="52" rx="22" ry="5" fill="rgba(40,60,20,.25)" />
          <circle cx="18" cy="36" r="13" fill="#4E8F3A" />
          <circle cx="42" cy="36" r="13" fill="#4E8F3A" />
          <circle cx="30" cy="26" r="15" fill="#5FA548" />
          <circle cx="24" cy="40" r="12" fill="#68B04F" />
          <circle cx="38" cy="41" r="11" fill="#5FA548" />
          <circle cx="26" cy="20" r="4" fill="rgba(255,255,255,.18)" />
        </svg>
        <span v-if="bush.kind" :key="bush.id" class="picking__fruit"><GameIcon :kind="bush.kind" :size="34" /></span>
      </button>
    </div>
    <p class="picking__hint">Mûres, fraises, myrtilles, cèpes : cueille-les avant qu’ils tombent. Gare aux guêpes !</p>
  </div>
</template>

<script>
import GameIcon from './GameIcon.vue';
import { PICKING, BERRIES, pickingOf, ripeAt } from '@/game/minigames';
import { vibrate } from '@/utils/fx';

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
    return { PICKING, NAMES, now: 0, got: [], popped: -1, stung: false, slipped: false, ended: false };
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
        return { cell, kind: e ? e.kind : null, id: e ? e.id : -1, late: Boolean(e && e.until - this.now < LATE_MS) };
      });
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

<style scoped>
.picking { display: grid; gap: 10px; font-family: var(--font-ui); }
.picking__bar { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; min-height: 34px; }
.picking__time { font-size: 13px; font-weight: 800; color: var(--ink-700); }
.picking__time strong { font-size: 18px; font-weight: 900; color: var(--ink-900); font-variant-numeric: tabular-nums; }
.picking__meter { height: 8px; border-radius: var(--r-pill); background: rgba(var(--shade-rgb), .15); overflow: hidden; }
.picking__meter span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #7FBF55, var(--oc-gold-bright)); }
.picking__basket { font-size: 13px; font-weight: 800; color: var(--ink-700); }
.picking__basket strong { font-size: 18px; font-weight: 900; color: var(--ink-900); font-variant-numeric: tabular-nums; }
.picking__patch {
  display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: 6px; padding: 10px; border-radius: var(--r-board);
  background: radial-gradient(circle at 50% 40%, #B9DC8F, #8FBF62); box-shadow: inset 0 3px 8px rgba(40, 70, 20, .3);
  touch-action: none; user-select: none; -webkit-user-select: none; transition: filter .2s ease;
}
.picking.is-stung .picking__patch { filter: saturate(.4) brightness(.85); box-shadow: inset 0 0 0 4px rgba(226, 87, 74, .7); }
.picking.is-slip .picking__patch { filter: brightness(.94); }
.picking__bush {
  position: relative; aspect-ratio: 1; padding: 0; border: 0; background: transparent; cursor: pointer;
  display: grid; place-items: center; -webkit-tap-highlight-color: transparent;
}
.picking__bush:disabled { cursor: default; }
.picking__leaves { position: absolute; inset: 0; width: 100%; height: 100%; transition: transform .15s ease; }
.picking__bush:active .picking__leaves { transform: scale(.94) rotate(-2deg); }
.picking__fruit { position: relative; margin-top: 6%; animation: picking-grow .3s cubic-bezier(.3, 1.6, .5, 1); filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .25)); }
.picking__bush.has-cepe .picking__fruit { filter: drop-shadow(0 0 8px rgba(255, 220, 110, .95)); }
.picking__bush.has-guepes .picking__fruit { animation: picking-grow .3s cubic-bezier(.3, 1.6, .5, 1), picking-buzz .18s linear infinite; }
.picking__bush.is-late .picking__fruit { animation: picking-wobble .22s ease-in-out infinite; opacity: .8; }
.picking__bush.is-picked .picking__leaves { animation: picking-shake .26s ease; }
.picking__hint { margin: 0; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink-500); }
@keyframes picking-grow { from { transform: scale(.2); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes picking-wobble { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg) translateY(2px); } }
@keyframes picking-buzz { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(1px, -1px); } 75% { transform: translate(-1px, 1px); } }
@keyframes picking-shake { 0%, 100% { transform: none; } 40% { transform: rotate(-4deg) scale(1.04); } 70% { transform: rotate(3deg); } }
@media (prefers-reduced-motion: reduce) {
  .picking__fruit, .picking__bush.is-late .picking__fruit, .picking__bush.has-guepes .picking__fruit, .picking__bush.is-picked .picking__leaves { animation: none; }
}
</style>
