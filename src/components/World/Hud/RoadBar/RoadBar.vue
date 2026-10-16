<template>
  <!-- Le mode chemin (WorldView/roads.js) : ce que fait le doigt et le compte ; retirer la dernière case, la gomme, le
       pavé (la Carrière bâtie), annuler, tracer (ou effacer, ou paver). Styles : island-ui.css (world__banner--road,
       world__road-*) -->
  <div class="world__banner world__banner--road" role="status">
    <span class="world__road-text">{{ text }}</span>
    <span class="world__road-row">
      <button type="button" class="world__link world__road-undo" :aria-label="UNDO_CELL" :disabled="!cells" @click="$emit('undo')">↶</button>
      <button type="button" :class="['world__link', { 'is-on': eraser }]" :aria-pressed="eraser" @click="$emit('eraser')">Gomme</button>
      <button v-if="paveOpen" type="button" :class="['world__link', { 'is-on': paver }]" :aria-pressed="paver" @click="$emit('paver')">Pavé</button>
      <button type="button" class="world__link" @click="$emit('cancel')">Annuler</button>
      <button type="button" class="world__road-go" data-coach="road-go" :data-linked="linked ? '' : null" :disabled="!ready || busy" @click="$emit('confirm')">{{ eraser ? 'Effacer' : paver ? 'Paver' : 'Tracer' }}</button>
    </span>
  </div>
</template>

<script>
import bottomBand from '../bottomBand';
import { UNDO_CELL } from '@/texts/world/screens/hud';

export default {
  name: 'RoadBar',
  mixins: [bottomBand],
  props: {
    text: { type: String, required: true },
    // La gomme est prise (on efface au lieu de tracer)
    eraser: { type: Boolean, default: false },
    // L'outil du pavé est pris (on pave ou dépave) ; il s'offre (la Carrière bâtie)
    paver: { type: Boolean, default: false },
    paveOpen: { type: Boolean, default: false },
    // Cases déjà touchées dans ce mode (tracées ou à effacer) : de quoi retirer la dernière
    cells: { type: Number, default: 0 },
    // Le tracé relie deux lieux (le coach le guette) ; il peut partir
    linked: { type: Boolean, default: false },
    ready: { type: Boolean, default: false },
    busy: { type: Boolean, default: false }
  },
  emits: ['undo', 'eraser', 'paver', 'cancel', 'confirm'],
  data() {
    return { UNDO_CELL };
  }
};
</script>
