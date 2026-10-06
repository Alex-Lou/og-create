<template>
  <svg :width="size" :height="size" viewBox="0 0 54 54" aria-hidden="true" class="g-seal">
    <g fill="none" stroke="currentColor" stroke-linecap="round">
      <circle cx="27" cy="27" r="24" stroke-opacity=".6"></circle>
      <circle cx="27" cy="27" r="19" stroke-opacity=".25" stroke-dasharray="1.5 4"></circle>
      <path d="M27 8v38M8 27h38M13.6 13.6l26.8 26.8M40.4 13.6L13.6 40.4" stroke-opacity=".45"></path>
    </g>
    <circle cx="27" cy="27" r="4" fill="currentColor"></circle>
  </svg>
</template>

<script>
// Sceau doré gravé : illustration par défaut d'un succès obtenu
export default {
  name: 'GSeal',
  props: {
    size: { type: Number, default: 54 }
  }
};
</script>

<style scoped src="./GSeal.css"></style>
