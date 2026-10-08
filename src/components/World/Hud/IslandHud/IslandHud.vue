<template>
  <header class="world__head">
    <div class="world__head-left">
      <h2 class="oc-sr-only">Le Monde</h2>
      <IslandClock v-if="clock" v-bind="clock" :warping="warping" @warp="$emit('warp')" />
      <span v-if="!show || show.purse" class="world__purse" :aria-label="`${coins} écus`"><span class="world__coin" aria-hidden="true"></span>{{ coinsText }}</span>
    </div>
    <!-- « Tout ramasser » : ce que tous les bâtiments ont produit (écus et ressources), d'un toucher ; le solde reste
         dans l'en-tête. (« Récolte » désigne le jeu de tuiles, pas ce ramassage.) -->
    <button
      v-if="harvestable.length && (!show || show.collect)"
      type="button"
      class="world__coins is-ready"
      :disabled="busy"
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
  </header>
  <!-- Réserves de l'île et Récolte -->
  <div v-if="stock && (!show || show.stock || show.harvest)" class="world__hud">
    <ul v-if="!show || show.stock" class="world__stock" aria-label="Réserves">
      <li v-for="r in RESOURCES" :key="r.id" class="world__res" :title="r.label">
        <span aria-hidden="true"><ElementGlyph :glyph="r.glyph" /></span><strong>{{ stock[r.id] }}</strong><span class="oc-sr-only">{{ r.label }}</span>
      </li>
    </ul>
    <button v-if="!show || show.harvest" type="button" class="world__play" :disabled="busy || !charges" @click="$emit('harvest')">
      <span class="world__play-label">Récolte</span>
      <span class="world__play-sub">{{ chargesText }}</span>
    </button>
  </div>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import IslandClock from '../IslandClock/IslandClock.vue';
import { RESOURCES } from '@/game/resources';
// Barre du haut de l'île (dans .world__top, que l'île mesure) : horloge, écus, « Tout ramasser », réserves et Récolte.
// Ramasser, jouer et accélérer la journée restent à l'île, qui les reçoit en événements. Ses styles sont ceux de l'île
// (WorldView, classes world__)
export default {
  name: 'IslandHud',
  components: { ElementGlyph, IslandClock },
  props: {
    // Horloge de l'en-tête (IslandClock), ou null ; journée en accéléré
    // Ce que le tutoriel laisse voir (game/prologue.js, islandShow) ; null : tout
    show: { type: Object, default: null },
    clock: { type: Object, default: null },
    warping: { type: Boolean, default: false },
    // Solde d'écus (null : pas encore connu)
    coins: { type: Number, default: null },
    // Ce qui attend dans les bâtiments : [{ id, glyph, n, label }]
    harvestable: { type: Array, default: () => [] },
    // Réserves de l'île (null : l'île n'est pas encore chargée) ; parties de Récolte et leur texte
    stock: { type: Object, default: null },
    charges: { type: Number, default: 0 },
    chargesText: { type: String, default: '' },
    busy: { type: Boolean, default: false }
  },
  emits: ['warp', 'collect', 'harvest'],
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
