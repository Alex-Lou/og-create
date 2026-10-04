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
import GModal from '@/components/ui/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
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

<style scoped>
.chest { display: grid; justify-items: center; gap: 10px; text-align: center; font-family: var(--font-ui); }
.chest.is-commun { --wood: #9A6A3E; --band: #6E6A64; --lock: #C9A04A; }
.chest.is-rare { --wood: #9A6A3E; --band: #3E78C8; --lock: #DDE7F4; }
.chest.is-epique { --wood: #6C3FA2; --band: #E2B546; --lock: #F4D67A; }
.chest.is-legendaire { --wood: #E2AE3A; --band: #B23A48; --lock: #FFF1C2; }
.chest__note { margin: 0; max-width: 300px; color: var(--ink-500); font-style: italic; font-size: 14px; line-height: 1.4; }
.chest__stage { position: relative; display: grid; place-items: center; width: 220px; height: 170px; }
.chest__box { position: relative; width: 168px; height: 140px; overflow: visible; animation: chest-shake .7s ease-in-out both; }
.chest__wood { fill: var(--wood); stroke: rgba(40, 24, 12, .55); stroke-width: 1.4; }
.chest__band { fill: var(--band); }
.chest__lock { fill: var(--lock); stroke: rgba(40, 24, 12, .5); stroke-width: 1; }
.chest__lid { transform-box: view-box; transform-origin: 102px 46px; animation: chest-lid .45s .7s cubic-bezier(.3, 1.6, .5, 1) both; }
.chest__glow, .chest__rays { position: absolute; inset: 0; margin: auto; border-radius: 50%; opacity: 0; }
.chest__glow { width: 150px; height: 150px; background: radial-gradient(circle, var(--rarity) 0%, transparent 68%); animation: chest-glow .6s .75s ease-out both; }
.chest__rays {
  width: 230px; height: 230px;
  background: repeating-conic-gradient(from 0deg, var(--rarity) 0deg 9deg, transparent 9deg 30deg);
  -webkit-mask: radial-gradient(circle, #000 18%, transparent 70%); mask: radial-gradient(circle, #000 18%, transparent 70%);
  animation: chest-glow .6s .8s ease-out both, chest-spin 9s .8s linear infinite;
}
.chest__prize { display: grid; justify-items: center; gap: 4px; animation: chest-prize .4s 1s cubic-bezier(.3, 1.5, .5, 1) both; }
.chest__art { width: 120px; height: 120px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .25)); }
.chest__icons { display: flex; gap: 6px; font-size: 44px; line-height: 1; }
.chest__name { font-size: 20px; font-weight: 900; color: var(--ink-900); }
.chest__kind { font-size: 13px; font-weight: 700; color: var(--ink-500); }
@keyframes chest-shake {
  0%, 100% { transform: none; }
  15% { transform: rotate(-4deg); } 30% { transform: rotate(4deg); } 45% { transform: rotate(-5deg) translateY(-2px); }
  60% { transform: rotate(5deg) translateY(-2px); } 80% { transform: translateY(2px) scale(1.04, .96); }
}
@keyframes chest-lid { from { transform: none; } to { transform: translate(-4px, -18px) rotate(-16deg); } }
@keyframes chest-glow { from { opacity: 0; transform: scale(.4); } to { opacity: .85; transform: none; } }
@keyframes chest-spin { to { rotate: 360deg; } }
@keyframes chest-prize { from { opacity: 0; transform: translateY(14px) scale(.7); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .chest__box, .chest__prize { animation: none; }
  .chest__lid { animation: none; transform: translate(-4px, -18px) rotate(-16deg); }
  .chest__glow, .chest__rays { animation: none; opacity: .7; }
}
</style>
