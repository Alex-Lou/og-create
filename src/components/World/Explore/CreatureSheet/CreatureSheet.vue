<template>
  <GModal :title="met ? creature.name : T.unknownName" :eyebrow="`N° ${String(creature.no).padStart(2, '0')} · ${T.rarity[creature.rarity]}`" :width="420" align="center" @close="$emit('close')">
    <div class="creature">
      <img v-if="portrait" :class="['creature__art', { 'is-shadow': !met }]" :src="portrait" alt="" />
      <p class="creature__where">{{ where }}</p>
      <p v-if="met" class="creature__text">« {{ creature.text }} »</p>
      <p v-if="met" class="creature__date">{{ T.metOn(longDate) }}</p>
      <template v-else>
        <p v-if="arrival" class="creature__hint">{{ arrival }}</p>
        <p class="creature__hint">{{ T.notYet }}</p>
      </template>
    </div>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import { beastPortraitUrl } from '@/world/beastArt';
import { whereWhen, arrivalOf } from '@/world/creatures';
import { BESTIARY as T } from '@/texts/world/creatures';

// La fiche d'une créature du Bestiaire (BestiaryBook) : rencontrée, son dessin, où et quand elle vit, sa phrase et la
// date de la rencontre ; sinon, sa silhouette, où et quand la chercher, et ce qui la fera venir sur l'île
export default {
  name: 'CreatureSheet',
  components: { GModal },
  props: {
    // world/creatures.js (CREATURES)
    creature: { type: Object, required: true },
    // L'instant de la rencontre (ms), ou null
    met: { type: Number, default: null },
    zones: { type: Array, required: true },
    elements: { type: Array, default: () => [] },
    acts: { type: Array, default: () => [] }
  },
  emits: ['close'],
  data() {
    return { T };
  },
  computed: {
    portrait() {
      return beastPortraitUrl(this.creature.species, this.creature.variant);
    },
    where() {
      return whereWhen(this.creature, this.zones);
    },
    arrival() {
      return arrivalOf(this.creature, { elements: this.elements, acts: this.acts });
    },
    longDate() {
      return new Date(this.met).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
};
</script>

<style scoped src="./CreatureSheet.css"></style>
