<template>
  <!-- Ce que coûte une chose : ressources, trouvailles de climat, écus ; ce qui manque est en rouge -->
  <ul class="cost" :aria-label="`Coût : ${label}`">
    <li v-for="(n, r) in cost" :key="r" :class="{ 'is-missing': (stock[r] || 0) < n }">
      <ElementGlyph :glyph="GLYPH[r]" /> {{ n }}
    </li>
    <li v-for="(n, f) in finds || {}" :key="f" :class="{ 'is-missing': (stock[f] || 0) < n }">
      <ElementGlyph :glyph="FIND_GLYPH[f]" /> {{ n }}
    </li>
    <li v-if="coins !== null" :class="{ 'is-missing': have !== null && have < coins }"><ElementGlyph glyph="ui:coin" /> {{ coins }}</li>
  </ul>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { GLYPH, costLabel } from '@/game/resources';
import { FIND_GLYPH } from '@/world/finds';

// Liste des coûts commune à l'établi (CraftBench) et aux annexes (AnnexPanel)
export default {
  name: 'CostList',
  components: { ElementGlyph },
  props: {
    // { ressource: nombre }
    cost: { type: Object, required: true },
    // Trouvailles de climat : { trouvaille: nombre }
    finds: { type: Object, default: null },
    // Écus demandés (null : aucun)
    coins: { type: Number, default: null },
    // Ressources et trouvailles à soi
    stock: { type: Object, required: true },
    // Solde connu, ou null (le serveur tranchera)
    have: { type: Number, default: null }
  },
  data() {
    return { GLYPH, FIND_GLYPH };
  },
  computed: {
    label() {
      return costLabel(this.cost, this.finds, this.coins);
    }
  }
};
</script>

<style scoped src="./CostList.css"></style>
