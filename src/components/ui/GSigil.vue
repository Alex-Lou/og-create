<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 480 480"
    :role="label ? 'img' : null"
    :aria-label="label || null"
    :aria-hidden="label ? null : 'true'"
    class="g-sigil"
  >
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
    <circle cx="240" cy="240" r="7" fill="var(--oc-gold)"></circle>
    <circle cx="240" cy="240" r="16" fill="none" stroke="var(--oc-gold)" stroke-opacity=".5"></circle>
  </svg>
</template>

<script>
import { sigilPaths } from '@/utils/sigil';

// Sceau du joueur (voir utils/sigil.js) ; hérite de la couleur d'encre du parent
export default {
  name: 'GSigil',
  props: {
    // Part découverte de chaque famille (0..1), dans un ordre stable
    shares: { type: Array, default: () => [] },
    rings: { type: Number, default: 0 },
    size: { type: Number, default: 48 },
    // Vide : décoratif (le parent porte déjà le nom accessible)
    label: { type: String, default: 'Sceau du joueur' }
  },
  computed: {
    paths() {
      return sigilPaths(this.shares, this.rings);
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
</style>
