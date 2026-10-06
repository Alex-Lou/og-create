<template>
  <div class="annexes">
    <p v-if="site.level < 2" class="annexes__note">Les annexes s’ouvrent au palier II de ce bâtiment.</p>
    <p v-else class="annexes__note">
      Pose-les toi-même autour du bâtiment, sur une case libre de son quartier, à deux cases au plus. Elles travaillent dès
      leur pose, et se déplacent gratuitement.
    </p>
    <ul class="annexes__list">
      <li v-for="annex in site.annexes" :key="annex.id" :class="['annexes__card', `is-${stateOf(annex).state}`]">
        <span class="annexes__art">
          <img :src="artOf(annex)" alt="" />
          <span class="annexes__palier" :aria-label="`Palier ${roman(annex.levels[0])}`">{{ roman(annex.levels[0]) }}</span>
          <span v-if="annex.built" class="annexes__badge">{{ annex.max > 1 ? `${annex.built}/${annex.max}` : '✓' }}</span>
        </span>
        <span class="annexes__body">
          <span class="annexes__kind">{{ KIND_LABEL[annex.kind] }}<template v-if="annex.max > 1"> · jusqu’à {{ annex.max }} (paliers {{ annex.levels.map(roman).join(', ') }})</template></span>
          <span class="annexes__name">{{ annex.name }}</span>
          <span class="annexes__effect">{{ annex.effect }}</span>
          <CostList v-if="annex.next" class="annexes__cost" :cost="annex.next.cost" :finds="annex.next.finds" :coins="annex.next.coins" :stock="stock" :have="coins" />
        </span>
        <button
          v-if="annex.next"
          type="button"
          :class="['annexes__btn', { 'is-off': stateOf(annex).state !== 'ready' }]"
          :disabled="busy || stateOf(annex).state !== 'ready'"
          :aria-label="stateOf(annex).state === 'ready' ? `Poser ${annex.name}` : `${annex.name} : ${stateOf(annex).text}`"
          @click="$emit('place', annex)"
        >{{ stateOf(annex).text }}</button>
        <span v-else class="annexes__done">Sur ton île</span>
      </li>
    </ul>
  </div>
</template>

<script>
import CostList from '@/components/World/Sites/CostList/CostList.vue';
import { roman } from '@/utils/roman';
import { spriteUrl } from '@/world/spriteCache';
import { annexThumb } from '@/world/annexSprites';
import { annexState, KIND_LABEL } from '@/world/annexes';

// Onglet « Annexes » de la fiche d'un bâtiment : ses trois annexes, ce qu'elles font, ce qu'elles coûtent, et le bouton
// qui lance la pose sur l'île (le choix de la case se fait sur la carte)
export default {
  name: 'AnnexPanel',
  components: { CostList },
  props: {
    site: { type: Object, required: true },
    // Ressources et trouvailles de climat
    stock: { type: Object, required: true },
    // Solde connu, ou null (le serveur tranchera)
    coins: { type: Number, default: null },
    busy: { type: Boolean, default: false }
  },
  emits: ['place'],
  data() {
    return { KIND_LABEL };
  },
  methods: {
    roman,
    stateOf(annex) {
      return annexState(annex, this.site, this.stock, this.coins);
    },
    // Vignette : l'exemplaire suivant (ce qui y poussera), ou le premier si tout est posé
    artOf(annex) {
      const variant = annex.next && annex.max > 1 ? annex.built : 0;
      return spriteUrl(`annex-thumb-${annex.id}-${variant}`, () => annexThumb(annex.id, variant));
    }
  }
};
</script>

<style scoped src="./AnnexPanel.css"></style>
