<template>
  <!-- Brume, le feu follet guide (fiches, Livre) : le dessin de son stade dans la bibliothèque, comme sur l'île
       (world/brumeArt.js), ses quatre images en boucle -->
  <span v-if="frames" class="wisp wisp--art" :style="boxStyle" aria-hidden="true">
    <img v-for="(src, n) in frames" :key="n" :src="src" alt="" class="wisp__frame" :style="[artStyle, { animationDelay: delayOf(n) }]" />
  </span>
  <!-- Sa naissance (les yeux qui s'ouvrent), ou un stade que la bibliothèque n'a pas : le feu follet en SVG, flamme qui
       vacille et deux yeux qui clignent -->
  <svg v-else :class="['wisp', { 'is-ready': ready, 'is-waking': waking }]" :width="size" :height="Math.round(size * 1.25)" viewBox="-14 -26 28 35" aria-hidden="true">
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
import { brumeArtUrls, ART_R, BRUME_FRAMES, BRUME_MS } from '@/world/brumeArt';

// Le feu follet en SVG : 28 de large, le centre du bas de la flamme à 14 du bord gauche et 26 du haut, rayon 8
const SVG_W = 28, SVG_TOP = 26 / 35, SVG_R = 8;

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
    // Les quatre images de son stade (null : le SVG)
    frames() {
      return this.waking ? null : brumeArtUrls({ stage: this.stage ?? 1 }, this.ready);
    },
    boxStyle() {
      return { width: `${this.size}px`, height: `${Math.round(this.size * 1.25)}px` };
    },
    // Le dessin (40 × 48, flamme au rayon 9 centrée en 20, 32) posé comme le feu follet en SVG
    artStyle() {
      const k = (this.size / SVG_W) * (SVG_R / ART_R);
      return {
        width: `${40 * k}px`,
        height: `${48 * k}px`,
        left: `${this.size / 2 - 20 * k}px`,
        top: `${Math.round(this.size * 1.25) * SVG_TOP - 32 * k}px`
      };
    },
    tone() {
      if (this.ready) return WISP.ready;
      return this.stage === null ? WISP.calm : STAGES[this.stage] || WISP.calm;
    }
  },
  methods: {
    // Chaque image paraît à son tour (une animation CSS, décalée)
    delayOf(n) {
      return `${-((BRUME_FRAMES - n) % BRUME_FRAMES) * BRUME_MS}ms`;
    }
  }
};
</script>

<style scoped src="./BrumeWisp.css"></style>
