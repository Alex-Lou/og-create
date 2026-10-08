<template>
  <div class="pose-choice" role="group" aria-label="Pose">
    <button
      v-for="option in options"
      :key="option.n"
      type="button"
      :class="['pose-choice__look', { 'is-on': option.n === look }]"
      :aria-pressed="option.n === look ? 'true' : 'false'"
      :aria-label="option.label"
      :title="option.label"
      :disabled="busy"
      @click="option.n !== look && $emit('look', option.n)"
    >
      <img :src="option.url" alt="" :class="{ 'is-flipped': flip }" />
    </button>
    <button type="button" class="pose-choice__turn" :aria-pressed="flip ? 'true' : 'false'" :disabled="busy" @click="$emit('turn')">
      <span class="pose-choice__turn-icon" aria-hidden="true">⇋</span> Pivoter
    </button>
  </div>
</template>

<script>
import { spriteUrl } from '@/world/spriteCache';
import { annexThumb } from '@/world/annexSprites';
import { annexArtThumb, annexLookNames } from '@/world/decorArt';

// Pose d'une annexe : ses couleurs dessinées (une vignette chacune, en miroir si elle l'est) et « Pivoter ». Sans
// couleurs au choix (looks : 1, ou une création : id vide), seulement « Pivoter »
export default {
  name: 'PoseChoice',
  props: {
    id: { type: String, default: '' },
    looks: { type: Number, default: 1 },
    look: { type: Number, default: 0 },
    flip: { type: Boolean, default: false },
    busy: { type: Boolean, default: false }
  },
  emits: ['look', 'turn'],
  computed: {
    options() {
      if (!this.id || this.looks < 2) return [];
      const names = annexLookNames(this.id);
      return Array.from({ length: this.looks }, (_, n) => ({
        n,
        label: names[n] ? `Couleur : ${names[n]}` : `Couleur ${n + 1}`,
        url: annexArtThumb(this.id, n) ?? spriteUrl(`annex-thumb-${this.id}-${n}`, () => annexThumb(this.id, n))
      }));
    }
  }
};
</script>

<style scoped src="./PoseChoice.css"></style>
