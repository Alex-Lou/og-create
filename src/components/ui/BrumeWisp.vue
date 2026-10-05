<template>
  <!-- Brume, le feu follet guide, en SVG (fiches, Livre) : le même que sur l'île (world/brume.js), flamme qui vacille
       et deux yeux qui clignent -->
  <svg :class="['wisp', { 'is-ready': ready, 'is-waking': waking }]" :width="size" :height="Math.round(size * 1.25)" viewBox="-14 -26 28 35" aria-hidden="true">
    <defs>
      <radialGradient :id="`${uid}-body`" gradientUnits="userSpaceOnUse" cx="0" cy="-2.4" r="17.6" fx="0" fy="1.6">
        <stop offset="0" :stop-color="tone.core" />
        <stop offset=".45" :stop-color="tone.flame" />
        <stop offset="1" :stop-color="tone.edge" />
      </radialGradient>
      <radialGradient :id="`${uid}-halo`">
        <stop offset="0" :stop-color="`rgba(${tone.halo},.45)`" />
        <stop offset="1" :stop-color="`rgba(${tone.halo},0)`" />
      </radialGradient>
    </defs>
    <circle cx="0" cy="-5" r="13.5" :fill="`url(#${uid}-halo)`" />
    <g class="wisp__flame">
      <path d="M0,8 C10.4,8 9.2,-3.6 0,-16.4 C-9.2,-3.6 -10.4,8 0,8 Z" :fill="`url(#${uid}-body)`" />
      <path d="M0,8.4 C5.7,8.4 5.1,2 0,-4.4 C-5.1,2 -5.7,8.4 0,8.4 Z" fill="rgba(255,255,255,.75)" />
    </g>
    <g class="wisp__eyes" :fill="WISP.eye">
      <ellipse cx="-2.9" cy="-0.8" rx="1.25" ry="1.75" />
      <ellipse cx="2.9" cy="-0.8" rx="1.25" ry="1.75" />
    </g>
  </svg>
</template>

<script>
import { WISP, STAGES } from '@/world/brume';

let count = 0;

export default {
  name: 'BrumeWisp',
  props: {
    // Largeur en px (la hauteur suit)
    size: { type: Number, default: 32 },
    // Récompense à réclamer : le feu follet devient doré
    ready: { type: Boolean, default: false },
    // Naissance (BrumeGuide) : les yeux restent fermés, puis s'ouvrent
    waking: { type: Boolean, default: false },
    // Son stade (game/opus.js : brumeLook), qui donne sa couleur ; null : la couleur de toujours
    stage: { type: Number, default: null }
  },
  data() {
    count += 1;
    return { WISP, uid: `wisp-${count}` };
  },
  computed: {
    tone() {
      if (this.ready) return WISP.ready;
      return this.stage === null ? WISP.calm : STAGES[this.stage] || WISP.calm;
    }
  }
};
</script>

<style scoped>
.wisp { display: inline-block; vertical-align: middle; overflow: visible; }
.wisp__flame { transform-box: fill-box; transform-origin: 50% 100%; animation: wisp-flicker 1.7s ease-in-out infinite; }
.wisp__eyes ellipse { transform-box: fill-box; transform-origin: 50% 50%; animation: wisp-blink 4s steps(1, end) infinite; }
@keyframes wisp-flicker {
  0%, 100% { transform: skewX(0deg) scaleY(1); }
  30% { transform: skewX(-6deg) scaleY(1.05); }
  60% { transform: skewX(5deg) scaleY(.97); }
}
@keyframes wisp-blink { 0%, 96% { transform: scaleY(1); } 97% { transform: scaleY(.2); } }
.wisp.is-waking .wisp__eyes ellipse { animation: wisp-wake 2.4s ease-out both, wisp-blink 4s steps(1, end) 2.4s infinite; }
@keyframes wisp-wake { 0%, 82% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
@media (prefers-reduced-motion: reduce) {
  .wisp__flame, .wisp__eyes ellipse { animation: none; }
}
</style>
