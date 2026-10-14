<template>
  <GModal sheet eyebrow="Tout ouvrir" :title="title" :width="460" align="center" @close="$emit('close')">
    <!-- Les coffres arrivent, puis s'ouvrent l'un après l'autre : chacun tremble, s'ouvre (ses images de la bibliothèque),
         son lot jaillit dans la lumière de sa rareté. Un toucher ouvre tout d'un coup. Le total monte à chaque coffre -->
    <div ref="root" :class="['haul', { 'is-done': done }]" @click="skip">
      <p class="haul__total" role="status">
        <span class="haul__total-label">{{ done ? 'Au total' : 'Ouverture…' }}</span>
        <span v-if="total.coins" :key="`c${total.coins}`" class="haul__sum">+{{ total.coins }} <ElementGlyph glyph="ui:coin" /></span>
        <span v-for="s in total.stock" :key="`${s.label}${s.n}`" class="haul__sum">+{{ s.n }} <ElementGlyph :glyph="s.glyph" /></span>
        <span v-if="total.items" :key="`i${total.items}`" class="haul__sum">{{ HAUL_ITEMS(total.items) }}</span>
      </p>
      <!-- Un mot d'Héliane trouvé dans la bouteille -->
      <p v-if="note" class="haul__note">« {{ note }} »</p>
      <ul class="haul__grid">
        <li
          v-for="(item, i) in items"
          :key="item.chest.source"
          :class="['haul__card', `is-${item.chest.rarity}`, { 'is-open': steps[i] >= OPEN }]"
          :style="{ '--rarity': rarityOf(item).color, '--i': i }"
        >
          <span class="haul__rarity">{{ rarityOf(item).label }}</span>
          <span ref="stages" class="haul__stage" aria-hidden="true">
            <span class="haul__rays"></span>
            <span class="haul__glow"></span>
            <!-- Le coffre de la bibliothèque : fermé, son ouverture, puis ouvert (ses deux images respirent) ; toutes
                 posées d'avance, une seule visible -->
            <span v-if="art[i]" class="haul__chest">
              <img :src="art[i].closed[0].src" alt="" :class="{ 'is-on': steps[i] < 0 }" />
              <img v-for="(f, k) in art[i].opening" :key="`o${k}`" :src="f.src" alt="" :class="{ 'is-on': steps[i] === k }" />
              <img v-for="(f, k) in art[i].open" :key="`v${k}`" :src="f.src" alt="" :class="['is-breath', `f${k}`, { 'is-on': steps[i] >= OPEN }]" />
            </span>
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
      <!-- Les étincelles, les pièces et les mots : la scène commune (game/stage), par-dessus, sans toucher au doigt -->
      <canvas ref="fx" class="haul__fx" aria-hidden="true"></canvas>
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
import { chestFrames } from '@/world/chestArt';
import { fxOf, startOf, chestBurst } from '@/game/chestFx';
import { createStage } from '@/game/stage/stage';
import { vibrate, reducedMotion } from '@/utils/fx';
import { HAUL_ITEMS } from '@/texts/world/screens/chests';

// L'étape d'un coffre : -1 fermé, 0 à 3 son ouverture (les images de la bibliothèque), OPEN ouvert
const OPEN = 4;

// « Tout ouvrir » (choix de l'auteur, 14 oct. : la fenêtre, ses animations et ses effets refaits) : les coffres ouverts
// d'un coup arrivent en cartes, puis s'ouvrent en rafale (game/chestFx.js : le rythme, les effets de chaque rareté) et
// restent en grille (lot, rareté, d'où il vient, « Porter » pour une teinte ou une pièce rare), sous le total qui monte à
// chaque coffre. Les lots sont déjà acquis : la fenêtre les montre. Rien n'est redessiné à chaque image par Vue : la
// rafale avance par minuteries (une étape par image du coffre), les effets vivent sur la scène commune.
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
    return { OPEN, HAUL_ITEMS, steps: this.items.map(() => -1), done: false };
  },
  computed: {
    title() {
      return this.items.length > 1 ? `${this.items.length} coffres ouverts` : '1 coffre ouvert';
    },
    // Les images de chaque coffre (la bibliothèque), ou null
    art() {
      return this.items.map(item => chestFrames(item.chest.rarity));
    },
    // Le total de ce qui est déjà ouvert : il monte à chaque coffre
    total() {
      return haulOf(this.items.filter((item, i) => this.steps[i] >= OPEN).map(item => item.chest));
    }
  },
  created() {
    this.timers = [];
    this.reduced = reducedMotion();
  },
  mounted() {
    this.fx = createStage(this.$refs.fx, () => false, { reduced: this.reduced });
    if (this.reduced) {
      this.openAll();
      return;
    }
    const n = this.items.length;
    this.items.forEach((item, i) => this.later(() => this.open(i), startOf(i, n)));
  },
  beforeUnmount() {
    this.timers.forEach(clearTimeout);
    this.fx && this.fx.destroy();
  },
  methods: {
    prizeText,
    sourceText,
    stockOf,
    rarityOf(item) {
      return RARITY[item.chest.rarity] || RARITY.commun;
    },
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    // Le coffre i s'ouvre : ses images d'ouverture à leur cadence, puis il est ouvert (son lot, ses effets)
    open(i) {
      const frames = this.art[i] ? this.art[i].opening : [];
      let at = 0;
      frames.forEach((f, k) => {
        this.later(() => this.step(i, k), at);
        at += f.ms;
      });
      this.later(() => this.reveal(i), at);
    },
    step(i, k) {
      if (this.steps[i] < k) this.steps.splice(i, 1, k);
    },
    reveal(i) {
      if (this.steps[i] >= OPEN) return;
      this.steps.splice(i, 1, OPEN);
      this.burst(i);
      if (this.steps.every(s => s >= OPEN)) this.later(() => { this.done = true; }, 350);
    },
    // Un toucher : tout s'ouvre d'un coup (sans la gerbe de chaque coffre)
    skip() {
      if (this.done) return;
      this.openAll();
    },
    openAll() {
      this.timers.forEach(clearTimeout);
      this.timers = [];
      this.steps = this.items.map(() => OPEN);
      this.done = true;
    },
    // La gerbe d'un coffre qui s'ouvre (game/chestFx.js), au cœur de son coffre, son mot au-dessus de sa carte
    burst(i) {
      const { chest } = this.items[i];
      vibrate(fxOf(chest.rarity).buzz);
      const stage = this.$refs.stages && this.$refs.stages[i];
      if (!stage || !this.$refs.root) return;
      const s = stage.getBoundingClientRect(), r = this.$refs.root.getBoundingClientRect();
      chestBurst(this.fx, { x: s.left - r.left + s.width / 2, y: s.top - r.top + s.height * 0.62, top: s.top - r.top + 6, rarity: chest.rarity, coins: chest.prize.kind === 'coins' });
    }
  }
};
</script>

<style scoped src="./ChestHaul.css"></style>
