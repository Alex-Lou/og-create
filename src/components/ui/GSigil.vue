<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 480 480"
    :role="label ? 'img' : null"
    :aria-label="label || null"
    :aria-hidden="label ? null : 'true'"
    :class="['g-sigil', { 'g-sigil--small': size <= SMALL }]"
  >
    <!-- Corps vivant, réduit pour laisser l'anneau extérieur au cadre -->
    <g v-if="!bare" :transform="scaleAround(BODY_SCALE)">
      <g fill="none" stroke="currentColor" stroke-linecap="round">
        <path :d="paths.halo" stroke-opacity=".12"></path>
        <path :d="paths.rings" stroke-opacity=".4" stroke-dasharray="1.5 5"></path>
        <path :d="paths.web" stroke-opacity=".16"></path>
        <path :d="paths.core" stroke-opacity=".7" stroke-width="1.5"></path>
        <path :d="paths.branches" stroke-opacity=".9" stroke-width="2"></path>
        <path :d="paths.twigs" stroke-opacity=".55" stroke-width="1.2"></path>
        <path :d="paths.tips" fill="currentColor" fill-opacity=".85" stroke="none"></path>
      </g>
      <path :d="paths.gold" fill="var(--oc-gold)"></path>
    </g>
    <!-- Gravures du Cabinet : le cadre autour, l'emblème au cœur -->
    <path v-for="(stroke, i) in frameArt" :key="`f${i}`" v-bind="attrs(stroke)"></path>
    <g :transform="scaleAround(EMBLEM_SCALE)">
      <path v-for="(stroke, i) in emblemArt" :key="`e${i}`" v-bind="attrs(stroke)"></path>
    </g>
  </svg>
</template>

<script>
import { sigilPaths } from '@/utils/sigil';
import { BODY_SCALE, DEFAULT_EMBLEM, DEFAULT_FRAME, EMBLEM_ART, EMBLEM_SCALE, FRAME_ART } from '@/utils/cabinet';

// En dessous de cette taille (px), les traits gardent leur épaisseur à l'écran au lieu de fondre
const SMALL = 64;

// Sceau du joueur (voir utils/sigil.js et utils/cabinet.js) ; hérite de la couleur d'encre du parent
export default {
  name: 'GSigil',
  props: {
    // Part découverte de chaque famille (0..1), dans un ordre stable
    shares: { type: Array, default: () => [] },
    rings: { type: Number, default: 0 },
    size: { type: Number, default: 48 },
    // Vide : décoratif (le parent porte déjà le nom accessible)
    label: { type: String, default: 'Sceau du joueur' },
    // Pièces du Cabinet portées (image_path) ; inconnues ou vides : celles de départ
    frame: { type: String, default: DEFAULT_FRAME },
    emblem: { type: String, default: DEFAULT_EMBLEM },
    // Vrai : gravures seules, sans le corps vivant (vignettes d'emblèmes)
    bare: { type: Boolean, default: false }
  },
  data() {
    return { BODY_SCALE, EMBLEM_SCALE, SMALL };
  },
  computed: {
    paths() {
      return sigilPaths(this.shares, this.rings);
    },
    frameArt() {
      return FRAME_ART[this.frame] || FRAME_ART[DEFAULT_FRAME];
    },
    emblemArt() {
      return EMBLEM_ART[this.emblem] || EMBLEM_ART[DEFAULT_EMBLEM];
    }
  },
  methods: {
    scaleAround(k) {
      return `translate(240 240) scale(${k}) translate(-240 -240)`;
    },
    attrs({ d, w = 1.5, o = 1, gold = false, fill = false }) {
      const color = gold ? 'var(--oc-gold)' : 'currentColor';
      return fill
        ? { d, fill: color, 'fill-opacity': o, stroke: 'none' }
        : { d, fill: 'none', stroke: color, 'stroke-opacity': o, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    }
  }
};
</script>

<style scoped>
.g-sigil {
  display: block;
  color: var(--oc-text);
  flex-shrink: 0;
}
.g-sigil--small path { vector-effect: non-scaling-stroke; }
</style>
