<template>
  <!-- La pose d'un trait (clôture, muret : WorldView/workshop.js) : ce que fait le doigt et le compte ; retirer la
       dernière case (pendant une leçon des clôtures, aussi le dernier piquet posé), annuler, poser (« Valider » pendant la
       leçon). Styles : island-ui.css (world__banner--road, world__road-*), ceux du mode chemin -->
  <div class="world__banner world__banner--road" role="status">
    <span class="world__road-text">{{ text }}</span>
    <span class="world__road-row">
      <button type="button" class="world__link world__road-undo" :aria-label="UNDO_CELL" :disabled="!undo || busy" @click="$emit('undo')">↶</button>
      <button type="button" class="world__link" @click="$emit('cancel')">Annuler</button>
      <button type="button" class="world__road-go" data-coach="line-go" :data-full="full ? '' : null" :disabled="!cells || busy" @click="$emit('confirm')">{{ lesson ? 'Valider' : 'Poser' }}</button>
    </span>
  </div>
</template>

<script>
import { UNDO_CELL } from '@/texts/world/screens/hud';

export default {
  name: 'LineBar',
  props: {
    text: { type: String, required: true },
    // Cases du trait en attente
    cells: { type: Number, default: 0 },
    // ↶ a quelque chose à défaire ; une leçon des clôtures du tutoriel est en cours
    undo: { type: Boolean, default: false },
    lesson: { type: Boolean, default: false },
    // Le trait boucle l'enclos (le coach du tutoriel le guette)
    full: { type: Boolean, default: false },
    busy: { type: Boolean, default: false }
  },
  emits: ['undo', 'cancel', 'confirm'],
  data() {
    return { UNDO_CELL };
  }
};
</script>
