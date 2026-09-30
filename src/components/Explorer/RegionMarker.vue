<template>
  <button
    type="button"
    class="region-marker"
    :class="[markerClasses, `region-marker--${runeState}`]"
    :style="markerStyle"
    :aria-label="`${region.name} : ${stateLabel}`"
    @click="$emit('region-click')"
  >
    <!-- Rune au trait : l'état de la région se lit à la marque -->
    <svg class="region-marker__rune" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r="15" class="region-marker__disc"></circle>
      <path v-if="runeState === 'done'" d="M11 17l4 4 8-9"></path>
      <path v-else-if="runeState === 'boss'" d="M17 8v18M10 12l14 10M24 12L10 22"></path>
      <path v-else-if="runeState === 'locked'" d="M12 15h10v9H12zM14 15v-3a3 3 0 0 1 6 0v3"></path>
      <path v-else d="M13.5 13.5a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.2-1.5 2.3v.5M17 23.5v.5"></path>
    </svg>
    <span class="region-marker__name">{{ region.name }}</span>
  </button>
</template>

<script>
export default {
  name: 'RegionMarker',
  props: {
    region: {
      type: Object,
      required: true
    },
    isUnlocked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['region-click'],
  computed: {
    markerClasses() {
      return {
        'visited': this.region.visited,
        'completed': this.region.completed,
        'locked': !this.isUnlocked,
        'partially-completed': this.region.partiallyCompleted,
        'boss-region': this.region.is_boss
      };
    },
    markerStyle() {
      const x = this.region.position_x || 50;
      const y = this.region.position_y || 50;

      return {
        left: `${x}%`,
        top: `${y}%`,
        display: 'block',
        zIndex: 10
      };
    },
    // Explorée, gardien, scellée ou à parcourir
    runeState() {
      if (this.region.completed) return 'done';
      if (this.region.is_boss) return 'boss';
      if (!this.isUnlocked) return 'locked';
      return 'open';
    },
    stateLabel() {
      if (this.runeState === 'done') return 'explorée';
      if (this.runeState === 'boss') return this.isUnlocked ? 'gardien' : 'gardien, scellée';
      if (this.runeState === 'locked') return 'scellée';
      return 'à parcourir';
    }
  }
}
</script>

<style scoped>
.region-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
  padding: 5px 4px;
  border: 0;
  background: none;
  cursor: pointer;
  color: var(--oc-text-faint);
  text-align: center;
  transition: transform var(--oc-fast) var(--oc-ease-out);
}
.region-marker:hover { transform: translate(-50%, -50%) scale(1.06); }

.region-marker__rune {
  display: block;
  margin: 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.region-marker__disc {
  fill: var(--oc-bg);
  fill-opacity: 0.72;
  stroke-width: 1;
}
.region-marker__name {
  display: block;
  margin-top: 6px;
  font-family: var(--oc-font-display);
  font-size: 15px;
  letter-spacing: 0.04em;
  line-height: 1.1;
  white-space: nowrap;
  color: var(--oc-text-strong);
  text-shadow: 0 1px 6px var(--oc-bg), 0 0 2px var(--oc-bg);
}

.region-marker--done { color: var(--oc-verdigris); }
.region-marker--open { color: var(--oc-gold); }
.region-marker--open .region-marker__rune { filter: drop-shadow(0 0 6px rgba(224, 182, 84, 0.45)); }
.region-marker--boss { color: var(--oc-danger); }
.region-marker--locked .region-marker__name { color: var(--oc-text-muted); }
.region-marker--boss.locked { opacity: 0.7; }

@media (max-width: 859px) {
  .region-marker__name { font-size: 13px; }
}
</style>
