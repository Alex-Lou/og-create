<template>
  <GModal :eyebrow="rarity.label" :title="title" :width="380" align="center" @close="$emit('close')">
    <div :class="['chest', `is-${chest.rarity}`]" :style="{ '--rarity': rarity.color }">
      <p v-if="note" class="chest__note">« {{ note }} »</p>
      <div class="chest__stage" aria-hidden="true">
        <span class="chest__rays"></span>
        <span class="chest__glow"></span>
        <svg class="chest__box" viewBox="0 0 120 100">
          <ellipse cx="60" cy="90" rx="44" ry="6" fill="rgba(40,26,16,.25)" />
          <g class="chest__body">
            <rect x="18" y="46" width="84" height="40" rx="5" class="chest__wood" />
            <rect x="18" y="56" width="84" height="5" class="chest__band" />
            <rect x="30" y="46" width="6" height="40" class="chest__band" />
            <rect x="84" y="46" width="6" height="40" class="chest__band" />
            <rect x="52" y="52" width="16" height="16" rx="3" class="chest__lock" />
            <circle cx="60" cy="59" r="2.4" fill="#3A2614" />
            <rect x="59" y="60" width="2" height="5" fill="#3A2614" />
          </g>
          <g class="chest__lid">
            <path d="M18,48 v-10 a42,15 0 0 1 84,0 v10 z" class="chest__wood" />
            <path d="M30,48 v-19 a30,6 0 0 1 6,-1.6 v20.6 z M84,27.4 a30,6 0 0 1 6,1.6 v19 h-6 z" class="chest__band" />
            <path d="M24,34 a38,12 0 0 1 72,0" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2" />
            <rect x="54" y="42" width="12" height="7" rx="2" class="chest__lock" />
          </g>
        </svg>
      </div>
      <div class="chest__prize" role="status">
        <img v-if="art" :src="art" alt="" class="chest__art" />
        <span v-else-if="chest.prize.kind === 'coins'" class="chest__icons" aria-hidden="true"><ElementGlyph glyph="ui:coin" /></span>
        <span v-else-if="chest.prize.kind === 'stock'" class="chest__icons" aria-hidden="true">
          <ElementGlyph v-for="s in stock" :key="s.label" :glyph="s.glyph" />
        </span>
        <strong class="chest__name">{{ text }}</strong>
        <span v-if="kindText" class="chest__kind">{{ kindText }}</span>
      </div>
    </div>
    <template #actions>
      <button v-if="wearable" type="button" class="g-btn g-btn--ghost" :disabled="busy" @click="$emit('wear')">Porter</button>
      <button type="button" class="g-btn" @click="$emit('close')">Super&nbsp;!</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { RARITY, prizeText, sourceText, stockOf } from '@/world/chest';

// Ouverture d'un coffre : il tremble, s'ouvre dans la couleur de sa rareté, puis montre son lot (aperçu du bâtiment
// pour une teinte ou une pièce rare). Le lot est déjà acquis : la fenêtre ne fait que le montrer.
export default {
  name: 'ChestReveal',
  components: { GModal, ElementGlyph },
  props: {
    chest: { type: Object, required: true },
    // Série du coffre du jour (titre), mot de la bouteille, aperçu du bâtiment paré
    streak: { type: Number, default: 0 },
    note: { type: String, default: '' },
    art: { type: String, default: '' },
    wearable: { type: Boolean, default: false },
    busy: { type: Boolean, default: false }
  },
  emits: ['close', 'wear'],
  computed: {
    rarity() {
      return RARITY[this.chest.rarity] || RARITY.commun;
    },
    title() {
      return sourceText(this.chest.source, this.streak);
    },
    text() {
      return prizeText(this.chest.prize);
    },
    stock() {
      return stockOf(this.chest.prize);
    },
    kindText() {
      const { kind } = this.chest.prize;
      if (kind === 'rare') return 'Pièce rare, à porter sur son bâtiment';
      if (kind === 'tint') return 'Teinte, à porter sur son bâtiment';
      return kind === 'stock' ? 'Dans les réserves de l’île' : '';
    }
  }
};
</script>

<style scoped src="./ChestReveal.css"></style>
