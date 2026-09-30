<template>
  <div class="map-selector" v-if="showSelector">
    <label class="g-mono" for="xp-map-select">Carte</label>
    <div class="map-selector__field">
      <select id="xp-map-select" v-model="selectedMapId" @change="onMapChange" class="map-selector__select">
        <option v-for="mapId in unlockedMaps" :key="mapId" :value="mapId">
          {{ getMapName(mapId) }}
        </option>
      </select>
      <svg class="map-selector__chevron" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    </div>
  </div>
</template>

<script>
import mapUtils from '@/utils/mapUtils';

export default {
  name: 'MapSelector',
  props: {
    currentMapId: {
      type: Number,
      required: true
    },
    unlockedMaps: {
      type: Array,
      default: () => [1]
    },
    regions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedMapId: this.currentMapId
    };
  },
  computed: {
    showSelector() {
      return this.unlockedMaps.length > 1;
    }
  },
  watch: {
    currentMapId(newValue) {
      this.selectedMapId = newValue;
    }
  },
  methods: {
    getMapName(mapId) {
      return mapUtils.getMapName(mapId, this.regions);
    },
    onMapChange() {
      if (this.selectedMapId !== this.currentMapId) {
        this.$emit('map-change', this.selectedMapId);
      }
    }
  }
};
</script>

<style scoped>
.map-selector {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
}
.map-selector__field { position: relative; }
.map-selector__select {
  appearance: none;
  width: 100%;
  min-height: 44px;
  padding: 0 28px 0 0;
  border: 0;
  border-bottom: 1px solid var(--oc-line-strong);
  border-radius: 0;
  background: none;
  cursor: pointer;
  font-family: var(--oc-font-display);
  font-size: 18px;
  letter-spacing: 0.04em;
  color: var(--oc-text-strong);
}
.map-selector__select:focus { border-bottom-color: var(--oc-accent-line); }
.map-selector__select option { background: var(--oc-surface-strong); color: var(--oc-text); }
.map-selector__chevron {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  fill: none;
  stroke: var(--oc-gold);
  stroke-width: 1.5;
}
</style>
