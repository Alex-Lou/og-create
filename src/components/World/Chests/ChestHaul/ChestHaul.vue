<template>
  <GModal eyebrow="Tout ouvrir" :title="title" :width="460" align="center" @close="$emit('close')">
    <!-- Les coffres s'ouvrent en rafale, l'un après l'autre ; un toucher sur la grille montre tout de suite les lots -->
    <div :class="['haul', { 'is-skipped': skipped }]" @click="skipped = true">
      <!-- Le bilan d'abord (visible sans faire défiler), il apparaît une fois la rafale finie -->
      <p class="haul__total" role="status" :style="{ '--delay': `${items.length * step + 0.6}s` }">
        <span class="haul__total-label">Au total</span>
        <span v-if="total.coins">+{{ total.coins }} <ElementGlyph glyph="ui:coin" /></span>
        <span v-for="s in total.stock" :key="s.label">+{{ s.n }} <ElementGlyph :glyph="s.glyph" /></span>
        <span v-if="total.items">{{ total.items }} {{ total.items > 1 ? 'objets' : 'objet' }} pour tes bâtiments</span>
      </p>
      <!-- Un mot d'Héliane trouvé dans la bouteille -->
      <p v-if="note" class="haul__note">« {{ note }} »</p>
      <ul class="haul__grid">
        <li
          v-for="(item, i) in items"
          :key="item.chest.source"
          :class="['haul__card', `is-${item.chest.rarity}`]"
          :style="{ '--rarity': rarityOf(item).color, '--delay': `${i * step}s` }"
        >
          <span class="haul__rarity">{{ rarityOf(item).label }}</span>
          <span class="haul__stage" aria-hidden="true">
            <span class="haul__glow"></span>
            <svg class="haul__box" viewBox="0 0 60 52">
              <ellipse cx="30" cy="47" rx="21" ry="3" fill="rgba(40,26,16,.22)" />
              <rect x="9" y="24" width="42" height="21" rx="3" class="haul__wood" />
              <rect x="9" y="29" width="42" height="3" class="haul__band" />
              <rect x="26" y="26" width="8" height="8" rx="1.6" class="haul__lock" />
              <g class="haul__lid">
                <path d="M9,25 v-5 a21,8 0 0 1 42,0 v5 z" class="haul__wood" />
                <rect x="27" y="21" width="6" height="4" rx="1" class="haul__lock" />
              </g>
            </svg>
            <span class="haul__prize">
              <img v-if="item.art" :src="item.art" alt="" class="haul__art" />
              <span v-else class="haul__icons">
                <ElementGlyph v-if="item.chest.prize.kind === 'coins'" glyph="ui:coin" />
                <template v-else-if="item.chest.prize.kind === 'stock'">
                  <ElementGlyph v-for="s in stockOf(item.chest.prize)" :key="s.label" :glyph="s.glyph" />
                </template>
                <ElementGlyph v-else glyph="ui:spark" />
              </span>
            </span>
          </span>
          <span class="haul__text">
            <strong class="haul__name">{{ prizeText(item.chest.prize) }}</strong>
            <span class="haul__from">{{ sourceText(item.chest.source) }}</span>
            <button v-if="item.wearable" type="button" class="haul__wear" :disabled="busy" @click.stop="$emit('wear', i)">Porter</button>
            <span v-else-if="item.worn" class="haul__worn">Porté</span>
          </span>
        </li>
      </ul>
    </div>
    <template #actions>
      <button type="button" class="g-btn" @click="$emit('close')">Super&nbsp;!</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { RARITY, haulOf, prizeText, sourceText, stockOf } from '@/world/chest';

// « Tout ouvrir » : les coffres ouverts d'un coup s'ouvrent en rafale, puis restent en grille (lot, rareté, d'où il
// vient, « Porter » pour une teinte ou une pièce rare), sous le total. Les lots sont déjà acquis : la fenêtre les montre.
export default {
  name: 'ChestHaul',
  components: { GModal, ElementGlyph },
  props: {
    // [{ chest: { source, rarity, prize }, art, wearable, worn }] (aperçu et état du bâtiment calculés par l'île)
    items: { type: Array, required: true },
    // Le mot d'Héliane d'une bouteille de la rafale (un mot d'histoire), ou rien
    note: { type: String, default: '' },
    busy: { type: Boolean, default: false }
  },
  emits: ['close', 'wear'],
  data() {
    return { skipped: false };
  },
  computed: {
    title() {
      return this.items.length > 1 ? `${this.items.length} coffres ouverts` : '1 coffre ouvert';
    },
    // Écart entre deux coffres : la rafale entière tient en un peu plus de 2 s, même avec beaucoup de coffres
    step() {
      return Math.min(0.35, 2.2 / Math.max(this.items.length, 1));
    },
    total() {
      return haulOf(this.items.map(item => item.chest));
    }
  },
  methods: {
    prizeText,
    sourceText,
    stockOf,
    rarityOf(item) {
      return RARITY[item.chest.rarity] || RARITY.commun;
    }
  }
};
</script>

<style scoped src="./ChestHaul.css"></style>
