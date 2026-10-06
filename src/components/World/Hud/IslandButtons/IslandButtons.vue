<template>
  <!-- Coffres : celui du jour et ceux qui attendent (pastille) -->
  <button
    v-if="chests"
    type="button"
    :class="['world__chest-btn', { 'is-ready': chestCount }]"
    :aria-label="chestCount ? `Coffres : ${chestCount} à ouvrir` : 'Coffres'"
    @click="$emit('chests')"
  >
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
      <path d="M5,15 v-3 a11,5 0 0 1 22,0 v3 z" fill="#B57A44" stroke="#5A3A1E" stroke-width="1.4" />
      <rect x="5" y="15" width="22" height="11" rx="2" fill="#9A6A3E" stroke="#5A3A1E" stroke-width="1.4" />
      <rect x="5" y="17.5" width="22" height="2" fill="#E2B546" />
      <rect x="13.5" y="14" width="5" height="6" rx="1.2" fill="#F4D67A" stroke="#5A3A1E" stroke-width="1" />
    </svg>
    <span v-if="chestCount" class="world__chest-badge" aria-hidden="true">{{ chestCount }}</span>
  </button>
  <!-- Carnet d'explorateur : les lieux remarquables (pastille : ceux qui attendent d'être découverts) -->
  <button
    v-if="landmarks"
    type="button"
    :class="['world__log-btn', { 'is-ready': waitingLandmarks }]"
    :aria-label="waitingLandmarks ? `Carnet d’explorateur : ${waitingLandmarks} lieu${waitingLandmarks > 1 ? 'x' : ''} à découvrir` : 'Carnet d’explorateur'"
    @click="$emit('log')"
  >
    <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
      <rect x="7" y="5" width="19" height="23" rx="2.5" fill="#7A4E2C" stroke="#3E2615" stroke-width="1.3" />
      <rect x="9.5" y="7" width="15" height="19" rx="1.5" fill="#F6EEDD" />
      <path d="M17,10 L19,16 L17,22 L15,16 Z" fill="#C9473A" />
      <circle cx="17" cy="16" r="5" fill="none" stroke="#5A3A1E" stroke-width="1" />
      <rect x="5" y="9" width="4" height="2" rx="1" fill="#E2B546" /><rect x="5" y="20" width="4" height="2" rx="1" fill="#E2B546" />
    </svg>
    <span v-if="waitingLandmarks" class="world__chest-badge" aria-hidden="true">{{ waitingLandmarks }}</span>
  </button>
  <!-- Trouvailles de climat : la réserve à part (pastille : gisements prêts dans les quartiers à soi) -->
  <button
    v-if="finds"
    type="button"
    :class="['world__finds-btn', { 'is-ready': readyDeposits }]"
    :aria-label="readyDeposits ? `Trouvailles : ${readyDeposits} gisement${readyDeposits > 1 ? 's' : ''} prêt${readyDeposits > 1 ? 's' : ''}` : 'Trouvailles'"
    @click="$emit('finds')"
  >
    <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
      <path d="M10,11 Q16,7 22,11 L25,24 Q16,30 7,24 Z" fill="#B57A44" stroke="#5A3A1E" stroke-width="1.4" stroke-linejoin="round" />
      <path d="M10,11 Q16,14 22,11" fill="none" stroke="#5A3A1E" stroke-width="1.2" />
      <path d="M12,10 Q16,4 20,10" fill="none" stroke="#E2B546" stroke-width="1.6" />
      <path d="M13,18 l3,-3 l3,3 l-3,4 Z" fill="#BFE7F7" stroke="#2E6A9E" stroke-width="0.8" />
    </svg>
    <span v-if="readyDeposits" class="world__chest-badge" aria-hidden="true">{{ readyDeposits }}</span>
  </button>
  <!-- Expédition en route : une boussole et le temps avant son retour -->
  <button v-if="tripLeft" type="button" class="world__trip-btn" :aria-label="`Expédition en route : retour dans ${tripLeft}`" @click="$emit('trip')">
    <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#F6EEDD" stroke="#5A3A1E" stroke-width="1.6" />
      <path d="M16,6 L19,16 L16,26 L13,16 Z" fill="#C9473A" stroke="#5A3A1E" stroke-width="0.8" />
      <path d="M16,16 L19,16 L16,26 L13,16 Z" fill="#E9DCC4" />
      <circle cx="16" cy="16" r="1.6" fill="#5A3A1E" />
    </svg>
    <span class="world__trip-left">{{ tripLeft }}</span>
  </button>
  <div class="world__zoom">
    <button type="button" aria-label="Zoomer" @click="$emit('zoom', 1.25)">+</button>
    <button type="button" aria-label="Dézoomer" @click="$emit('zoom', 0.8)">−</button>
    <!-- Plein écran : l'île seule, sans barres (et l'écran entier quand l'appareil le permet) -->
    <button type="button" :aria-label="immersive ? 'Quitter le plein écran' : 'Plein écran'" :aria-pressed="immersive" @click="$emit('immersive')">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path v-if="immersive" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        <path v-else d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      </svg>
    </button>
  </div>
</template>

<script>
// Boutons posés sur l'île : coffres, carnet d'explorateur, trouvailles (avec leurs pastilles), expédition en route,
// zoom et plein écran. Ce qu'ils ouvrent reste à l'île, qui les reçoit en événements. Ses styles sont ceux de l'île
// (WorldView, classes world__)
export default {
  name: 'IslandButtons',
  props: {
    // L'île a des coffres ; combien attendent d'être ouverts
    chests: { type: Boolean, default: false },
    chestCount: { type: Number, default: 0 },
    // Des lieux remarquables à montrer ; combien attendent d'être découverts
    landmarks: { type: Boolean, default: false },
    waitingLandmarks: { type: Number, default: 0 },
    // Des trouvailles de climat ; combien de gisements sont prêts
    finds: { type: Boolean, default: false },
    readyDeposits: { type: Number, default: 0 },
    // Expédition en route : le temps avant son retour, en clair ('' : aucune)
    tripLeft: { type: String, default: '' },
    immersive: { type: Boolean, default: false }
  },
  emits: ['chests', 'log', 'finds', 'trip', 'zoom', 'immersive']
};
</script>

<style scoped src="./IslandButtons.css"></style>
