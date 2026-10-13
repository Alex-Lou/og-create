<template>
  <!-- La pose d'un trait (clôture, muret : WorldView/workshop.js) : ce que fait le doigt et le compte ; retirer la
       dernière case, annuler, poser. Styles : island-ui.css (world__banner--road, world__road-*), ceux du mode chemin -->
  <div class="world__banner world__banner--road" role="status">
    <span class="world__road-text">{{ text }}</span>
    <span class="world__road-row">
      <button type="button" class="world__link world__road-undo" aria-label="Retirer la dernière case" :disabled="!cells" @click="$emit('undo')">↶</button>
      <button type="button" class="world__link" @click="$emit('cancel')">Annuler</button>
      <button type="button" class="world__road-go" data-coach="line-go" :data-full="full ? '' : null" :disabled="!cells || busy" @click="$emit('confirm')">Poser</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'LineBar',
  props: {
    text: { type: String, required: true },
    // Cases du trait en attente
    cells: { type: Number, default: 0 },
    // Le trait boucle l'enclos (le coach du tutoriel le guette)
    full: { type: Boolean, default: false },
    busy: { type: Boolean, default: false }
  },
  emits: ['undo', 'cancel', 'confirm']
};
</script>
