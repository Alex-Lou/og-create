<template>
  <header class="world__head">
    <div class="world__head-left">
      <h2 class="oc-sr-only">Le Monde</h2>
      <IslandClock v-if="clock" v-bind="clock" :warping="warping" :class="{ 'is-locked': locked }" :disabled="locked" @warp="$emit('warp')" />
      <span class="world__purse" :aria-label="`${coins} écus`"><span class="world__coin" aria-hidden="true"></span>{{ coinsText }}</span>
      <!-- « Tout ramasser » : ce que tous les bâtiments ont produit (écus et ressources), d'un toucher, juste à côté des
           écus et à leur hauteur. (« Récolte » désigne le jeu de tuiles, pas ce ramassage.) -->
      <button
        v-if="harvestable.length"
        type="button"
        :class="['world__coins', 'is-ready', { 'is-locked': locked }]"
        :disabled="busy || locked"
        :aria-label="`Tout ramasser : ${harvestable.map(g => `${g.n} ${g.label}`).join(', ')}`"
        @click="$emit('collect', $event)"
      >
        <span class="world__coins-icon" aria-hidden="true"><ElementGlyph glyph="ui:basket" /></span>
        <span class="world__coins-text" aria-hidden="true">
          <span class="world__coins-label"><span class="world__coins-long">Tout ramasser</span><span class="world__coins-short">Ramasser</span></span>
          <span class="world__coins-gains">
            <span v-for="g in harvestable" :key="g.id">+{{ g.n }}<ElementGlyph :glyph="g.glyph" /></span>
          </span>
        </span>
      </button>
    </div>
  </header>
  <!-- Réserves de l'île (la Récolte, action principale, est en bas à droite de l'île, sous le pouce : IslandButtons) -->
  <div v-if="stock" class="world__hud">
    <ul class="world__stock" aria-label="Réserves">
      <li v-for="r in RESOURCES" :key="r.id" class="world__res" :title="r.label">
        <span aria-hidden="true"><ElementGlyph :glyph="r.glyph" /></span><strong>{{ stock[r.id] }}</strong><span class="oc-sr-only">{{ r.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import IslandClock from '../IslandClock/IslandClock.vue';
import { RESOURCES } from '@/game/resources';
// Barre du haut de l'île (dans .world__top, que l'île mesure) : horloge, écus, « Tout ramasser », puis les réserves.
// Ramasser, jouer et accélérer la journée restent à l'île, qui les reçoit en événements. Ses styles sont ceux de l'île
// (WorldView, classes world__)
export default {
  name: 'IslandHud',
  components: { ElementGlyph, IslandClock },
  props: {
    // Horloge de l'en-tête (IslandClock), ou null ; journée en accéléré
    clock: { type: Object, default: null },
    warping: { type: Boolean, default: false },
    // Solde d'écus (null : pas encore connu)
    coins: { type: Number, default: null },
    // Ce qui attend dans les bâtiments : [{ id, glyph, n, label }]
    harvestable: { type: Array, default: () => [] },
    // Réserves de l'île (null : l'île n'est pas encore chargée)
    stock: { type: Object, default: null },
    busy: { type: Boolean, default: false },
    // Pendant le tutoriel : l'horloge (accélérer la journée) et « Tout ramasser » ne sont pas enseignés, grisés
    locked: { type: Boolean, default: false }
  },
  emits: ['warp', 'collect'],
  data() {
    return { RESOURCES };
  },
  computed: {
    // Écus, dans la barre du haut (l'en-tête général est sous l'île)
    coinsText() {
      return new Intl.NumberFormat('fr-FR').format(this.coins || 0);
    }
  }
};
</script>

<style scoped src="./IslandHud.css"></style>
