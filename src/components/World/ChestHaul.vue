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
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
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

<style scoped>
.haul { display: grid; gap: 14px; font-family: var(--font-ui); }
.haul__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 10px; margin: 0; padding: 0; list-style: none; }
.haul__card {
  display: grid; justify-items: center; align-content: start; gap: 4px; padding: 8px 8px 12px; border-radius: var(--r-md);
  background: var(--vellum-50); box-shadow: inset 0 0 0 2px var(--rarity); text-align: center;
}
.haul__card.is-commun { --wood: #9A6A3E; --band: #6E6A64; --lock: #C9A04A; }
.haul__card.is-rare { --wood: #9A6A3E; --band: #3E78C8; --lock: #DDE7F4; }
.haul__card.is-epique { --wood: #6C3FA2; --band: #E2B546; --lock: #F4D67A; }
.haul__card.is-legendaire { --wood: #E2AE3A; --band: #B23A48; --lock: #FFF1C2; }
.haul__rarity {
  padding: 1px 8px; border-radius: var(--r-pill); background: var(--rarity); color: var(--ink-900);
  font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .05em;
}
.haul__stage { position: relative; display: grid; place-items: center; width: 100%; height: 72px; }
.haul__box, .haul__prize, .haul__glow { position: absolute; inset: 0; margin: auto; }
.haul__box { width: 66px; height: 57px; overflow: visible; animation: haul-shake .5s var(--delay) ease-in-out both, haul-gone .3s calc(var(--delay) + .8s) ease-in both; }
.haul__wood { fill: var(--wood); stroke: rgba(40, 24, 12, .55); stroke-width: 1.2; }
.haul__band { fill: var(--band); }
.haul__lock { fill: var(--lock); stroke: rgba(40, 24, 12, .5); stroke-width: .8; }
.haul__lid { transform-box: view-box; transform-origin: 51px 24px; animation: haul-lid .3s calc(var(--delay) + .5s) cubic-bezier(.3, 1.6, .5, 1) both; }
.haul__glow {
  width: 76px; height: 76px; border-radius: var(--r-round); background: radial-gradient(circle, var(--rarity) 0%, transparent 68%);
  animation: haul-glow .5s calc(var(--delay) + .75s) ease-out both;
}
.haul__prize { display: grid; place-items: center; animation: haul-pop .35s calc(var(--delay) + .85s) cubic-bezier(.3, 1.5, .5, 1) both; }
.haul__art { width: 66px; height: 66px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, .22)); }
.haul__icons { display: flex; gap: 4px; font-size: 34px; line-height: 1; }
.haul__text { display: grid; justify-items: center; gap: 3px; animation: haul-in .3s calc(var(--delay) + .95s) ease-out both; }
.haul__name { font-size: 14px; font-weight: 900; line-height: 1.2; color: var(--ink-900); }
.haul__from { font-size: 11px; font-weight: 700; color: var(--ink-500); }
.haul__wear {
  margin-top: 4px; min-height: 32px; padding: 4px 16px; border: 0; border-radius: var(--r-pill);
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 13px;
  cursor: pointer; touch-action: manipulation;
}
.haul__wear:disabled { opacity: .5; cursor: default; }
.haul__worn { margin-top: 4px; color: #4E8A3A; font-size: 12px; font-weight: 900; }
.haul__note { margin: 0 0 10px; color: var(--ink-500); font-style: italic; font-size: 14px; line-height: 1.4; }
.haul__total {
  display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px 12px; margin: 0;
  padding: 8px 12px; border-radius: var(--r-sm); background: var(--vellum-200); font-size: 15px; font-weight: 900; color: var(--ink-900);
  animation: haul-in .3s var(--delay) ease-out both;
}
.haul__total-label { width: 100%; text-align: center; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
/* Rafale passée d'un toucher : chaque animation saute à sa fin */
.haul.is-skipped * { animation-delay: 0s !important; animation-duration: 0s !important; }
@keyframes haul-shake {
  0%, 100% { transform: none; }
  20% { transform: rotate(-5deg); } 40% { transform: rotate(5deg); } 60% { transform: rotate(-4deg) translateY(-2px); }
  80% { transform: translateY(1px) scale(1.05, .95); }
}
@keyframes haul-lid { from { transform: none; } to { transform: translate(-3px, -10px) rotate(-18deg); } }
@keyframes haul-gone { from { opacity: 1; } to { opacity: 0; } }
@keyframes haul-glow { from { opacity: 0; transform: scale(.4); } to { opacity: .55; transform: none; } }
@keyframes haul-pop { from { opacity: 0; transform: translateY(10px) scale(.6); } to { opacity: 1; transform: none; } }
@keyframes haul-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .haul__box { display: none; }
  .haul__prize, .haul__text, .haul__total { animation: none; }
  .haul__glow { animation: none; opacity: .45; }
}
</style>
