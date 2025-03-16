<template>
  <div class="map-selector" v-if="showSelector">
    <span class="map-selector-label">Carte:</span>
    <div class="custom-select-container">
      <select v-model="selectedMapId" @change="onMapChange" class="map-select">
        <option v-for="mapId in unlockedMaps" :key="mapId" :value="mapId">
          {{ getMapName(mapId) }}
        </option>
      </select>
      <svg class="custom-select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path 
          d="M7,10L12,15L17,10"
          stroke="#9c6fc1" 
          stroke-width="2" 
          fill="none" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import mapUtils from '@/utils/mapUtils';
import '@/assets/ComponentsStyle/ExplorerStyle/MapSelectorStyle.css';

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