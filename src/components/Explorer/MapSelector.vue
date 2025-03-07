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
    align-items: center;
    gap: 8px;
  }
  
  .map-selector-label {
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
  }
  
  .map-select {
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .map-select:hover {
    background-color: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .map-select:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
  }
  
  .map-select option {
    background-color: #11171e;
    color: white;
  }
  </style>