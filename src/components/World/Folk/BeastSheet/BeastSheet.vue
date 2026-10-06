<template>
  <GModal eyebrow="Bête de la ferme" :title="beast.name" :width="380" align="center" @close="$emit('close')">
    <div class="beast">
      <span class="beast__portrait"><img :src="portrait" alt="" /></span>
      <p class="beast__likes">{{ isShe(beast) ? 'Elle' : 'Il' }} aime {{ LIKES[beast.species] }}.</p>
      <p :class="['beast__mood', { 'is-hungry': !beast.fed }]">{{ moodLine(beast) }}</p>
      <p class="beast__gives">{{ givesLine(beast) }}</p>

      <div class="beast__bubble">
        <span class="beast__bubble-text">
          <ElementGlyph :glyph="GLYPH.food" />
          {{ beast.ready ? `${beast.ready} vivre${beast.ready > 1 ? 's' : ''} dans sa bulle` : 'Sa bulle est vide' }}
        </span>
        <button type="button" class="g-btn g-btn--ghost" :disabled="busy || !beast.ready" @click="$emit('collect')">Ramasser</button>
      </div>

      <button type="button" class="g-btn beast__feed" :disabled="busy || !beast.refill || !canPay" @click="$emit('feed')">
        <template v-if="!beast.refill">{{ isShe(beast) ? 'Elle' : 'Il' }} n’a pas encore faim</template>
        <template v-else>
          Nourrir ·
          <span v-for="(n, r) in cost" :key="r" class="beast__cost"><ElementGlyph :glyph="GLYPH[r]" />{{ n }}</span>
        </template>
      </button>
      <p v-if="beast.refill && !canPay" class="beast__short">Il te faut {{ costText }} : ramasse la production du Potager.</p>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { GLYPH } from '@/game/resources';
import { LIKES, isShe, moodLine, givesLine } from '@/world/farmBeasts';

// Fiche d'une bête de ferme (bible, § 6.16 ; appui long sur elle, ou sa bulle de faim) : ce qu'elle aime, son humeur,
// ce qu'elle donne ; la nourrir (vivres du stock) et ramasser les bulles. Le serveur décide ; l'île envoie et met à jour.
export default {
  name: 'BeastSheet',
  components: { GModal, ElementGlyph },
  props: {
    // La bête, vue du serveur : { id, species, name, daily, fed, left, refill, ready }
    beast: { type: Object, required: true },
    // Prix d'un repas : { food: 2 }
    cost: { type: Object, required: true },
    stock: { type: Object, required: true },
    portrait: { type: String, required: true },
    busy: { type: Boolean, default: false }
  },
  emits: ['feed', 'collect', 'close'],
  data() {
    return { GLYPH, LIKES };
  },
  computed: {
    canPay() {
      return Object.entries(this.cost).every(([r, n]) => (this.stock[r] || 0) >= n);
    },
    // Le repas se paie en vivres (le serveur : 2)
    costText() {
      return `${this.cost.food} vivres`;
    }
  },
  methods: { isShe, moodLine, givesLine }
};
</script>

<style scoped src="./BeastSheet.css"></style>
