<template>
  <!-- Un enclos vient de se fermer, ou presque (choix de l'auteur, 15 oct. ; WorldView, enclosures.js) : une porte, avec
       son verrou ou sans (chacune avec son prix, ou « en réserve »), ou plus tard (sauf à la leçon des portes) -->
  <div class="world__banner door-offer" role="dialog" :aria-label="text">
    <p class="door-offer__text">{{ text }}</p>
    <div class="door-offer__row">
      <button type="button" class="door-offer__choice is-lock" data-coach="door-lock" :disabled="busy" :aria-label="T.choice(T.lock, lockCost)" @click="$emit('choose', true)">
        <span class="door-offer__name">{{ T.lock }}</span>
        <span class="door-offer__cost">{{ lockCost }}</span>
      </button>
      <button type="button" class="door-offer__choice" data-coach="door-plain" :disabled="busy" :aria-label="T.choice(T.plain, plainCost)" @click="$emit('choose', false)">
        <span class="door-offer__name">{{ T.plain }}</span>
        <span class="door-offer__cost">{{ plainCost }}</span>
      </button>
    </div>
    <button v-if="later" type="button" class="world__link door-offer__later" @click="$emit('later')">{{ T.later }}</button>
  </div>
</template>

<script>
import { DOOR_OFFER as T } from '@/texts/world/screens/island';

export default {
  name: 'DoorOffer',
  props: {
    // Il manque tant de portes pour fermer l'enclos (0 : il est fermé, la porte est un choix)
    missing: { type: Number, default: 0 },
    // Ce que coûtent la porte à verrou et la porte simple (ou « en réserve »)
    lockCost: { type: String, required: true },
    plainCost: { type: String, required: true },
    busy: { type: Boolean, default: false },
    // « Plus tard » (pas pendant la leçon des portes du tutoriel)
    later: { type: Boolean, default: true }
  },
  emits: ['choose', 'later'],
  data() {
    return { T };
  },
  computed: {
    text() {
      return this.missing ? T.almost(this.missing) : T.closed;
    }
  }
};
</script>

<style scoped src="./DoorOffer.css"></style>
