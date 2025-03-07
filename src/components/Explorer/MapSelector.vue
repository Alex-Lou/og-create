<template>
    <div class="map-selector" v-if="showSelector">
      <span class="map-selector-label">Carte:</span>
      <select v-model="selectedMapId" @change="onMapChange" class="map-select">
        <option v-for="mapId in unlockedMaps" :key="mapId" :value="mapId">
          {{ getMapName(mapId) }}
        </option>
      </select>
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