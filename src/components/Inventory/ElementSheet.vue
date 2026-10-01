<template>
  <GModal :eyebrow="family" :title="name" align="center" :width="440" @close="$emit('close')">
    <span class="sheet__ink g-ink--glow" aria-hidden="true">{{ emoji }}</span>

    <div class="sheet__block">
      <span class="g-mono">Naît de</span>
      <p v-if="!origins.length" class="g-italic sheet__line">{{ isBase ? 'Élément premier : il ne naît de rien.' : 'Venu d’ailleurs : aucune recette connue ne le donne.' }}</p>
      <p v-for="parts in origins.slice(0, MAX_ORIGINS)" :key="parts.join('+')" class="sheet__line">{{ parts.join(' + ') }}</p>
      <p v-if="origins.length > MAX_ORIGINS" class="g-mono">et {{ origins.length - MAX_ORIGINS }} autre{{ origins.length - MAX_ORIGINS > 1 ? 's' : '' }} voie{{ origins.length - MAX_ORIGINS > 1 ? 's' : '' }}</p>
    </div>

    <p :class="['g-italic', 'sheet__pending', { 'is-done': !pending }]">
      {{ pending ? `Encore ${pending} mélange${pending > 1 ? 's' : ''} inconnu${pending > 1 ? 's' : ''} le réclame${pending > 1 ? 'nt' : ''}.` : 'Il a livré tous ses secrets.' }}
    </p>

    <template #actions>
      <button type="button" class="g-btn" @click="$emit('use', name)">Poser dans l’Athanor</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import { BASE_ELEMENTS } from '@/utils/gameConstants';

// Fiche d'un élément du registre : d'où il vient, ce qu'il cache encore
export default {
  name: 'ElementSheet',
  components: { GModal },
  props: {
    name: { type: String, required: true },
    emoji: { type: String, default: '✨' },
    family: { type: String, default: '' },
    // Recettes à portée qui donnent l'élément (listes d'ingrédients)
    origins: { type: Array, default: () => [] },
    // Recettes inexplorées qui l'utilisent
    pending: { type: Number, default: 0 }
  },
  emits: ['close', 'use'],
  data() {
    return { MAX_ORIGINS: 3 };
  },
  computed: {
    isBase() {
      return BASE_ELEMENTS.includes(this.name);
    }
  }
};
</script>

<style scoped>
.sheet__ink { font-size: 72px; line-height: 1; }
.sheet__block { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.sheet__line { margin: 0; font-size: 18px; color: var(--oc-text-strong); }
.sheet__pending { margin: 0; font-size: 17px; color: var(--oc-gold); }
.sheet__pending.is-done { color: var(--oc-verdigris); }
</style>
