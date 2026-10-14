<template>
  <GModal sheet eyebrow="Coffres" title="Tes coffres" :width="400" @close="$emit('close')">
    <div class="chests">
      <!-- Coffre du jour : la série de la semaine, du commun à l'épique (légendaire tous les 28 jours) -->
      <section :class="['chests__daily', { 'is-ready': daily.available }]" :style="{ '--rarity': RARITY[heroRarity].color }" aria-label="Coffre du jour">
        <h3 class="chests__title">Coffre du jour</h3>
        <!-- Le coffre du jour, en grand (la bibliothèque) : il attend dans sa lumière et sautille ; ouvert, il se repose -->
        <span v-if="hero" class="chests__hero" aria-hidden="true">
          <span class="chests__rays"></span>
          <span class="chests__glow"></span>
          <img class="chests__hero-art" :src="hero" alt="" />
        </span>
        <ol class="chests__week">
          <li
            v-for="(rarity, i) in daily.week"
            :key="i"
            :class="['chests__day', { 'is-done': i < today || (i === today && !daily.available), 'is-today': i === today }]"
            :style="{ '--rarity': RARITY[rarity].color }"
            :aria-label="`Jour ${first + i} : ${RARITY[rarity].label}`"
          >
            <img v-if="iconOf(rarity)" class="chests__day-art" :src="iconOf(rarity)" alt="" aria-hidden="true" />
            <span class="chests__day-n" aria-hidden="true">{{ first + i }}</span>
          </li>
        </ol>
        <p v-if="daily.available" class="chests__line">
          Jour {{ daily.streak }} de ta série : un coffre <strong>{{ RARITY[daily.rarity].label.toLowerCase() }}</strong> t’attend.
        </p>
        <p v-else class="chests__line">{{ T.tomorrow(RARITY[daily.tomorrow].label.toLowerCase()) }}</p>
        <button v-if="daily.available" type="button" class="g-btn chests__open" :disabled="busy" @click="$emit('open', 'jour')">Ouvrir</button>
      </section>

      <!-- Coffres qui attendent : chapitres ouverts, quêtes de Brume réclamées -->
      <section v-if="pending.length" class="chests__pending" aria-label="Coffres en attente">
        <h3 class="chests__title">En attente</h3>
        <ul class="chests__list">
          <li v-for="(chest, i) in pending" :key="chest.source" class="chests__item" :style="{ '--rarity': RARITY[chest.rarity].color, '--i': i }">
            <span v-if="iconOf(chest.rarity)" class="chests__icon" aria-hidden="true"><img :src="iconOf(chest.rarity)" alt="" /></span>
            <span class="chests__chip" :style="{ '--rarity': RARITY[chest.rarity].color }">{{ RARITY[chest.rarity].label }}</span>
            <span class="chests__label">{{ chest.label }}</span>
            <button type="button" class="g-btn g-btn--ghost chests__item-btn" :disabled="busy" @click="$emit('open', chest.source)">Ouvrir</button>
          </li>
        </ul>
      </section>

      <p class="chests__hint">
        <template v-if="bottle">{{ T.bottle }}<template v-if="openable > 1">{{ T.bottleAll }}</template>.</template>
        <template v-else>{{ T.elsewhere }}</template>
      </p>
      <button v-if="bottle" type="button" class="g-btn g-btn--ghost chests__bottle" :disabled="busy" @click="$emit('open', 'bouteille')">Ouvrir la bouteille</button>
    </div>
    <!-- « Tout ouvrir » : dès deux coffres (bouteille comprise), en plus des boutons de chacun -->
    <template v-if="openable > 1" #actions>
      <button type="button" class="g-btn chests__all" :disabled="busy" @click="$emit('open-all')">Tout ouvrir · {{ openable }}</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import { RARITY, openableOf } from '@/world/chest';
import { chestIcon, chestFrames } from '@/world/chestArt';
import { CHEST_LIST as T } from '@/texts/world/screens/chests';

// Les coffres de l'île : celui du jour (série), ceux qui attendent d'être ouverts, et où trouver les autres ; « Tout
// ouvrir » les ouvre tous d'un coup. Les vrais coffres de la bibliothèque (choix de l'auteur, 14 oct., comme « Tout
// ouvrir ») : celui du jour en grand, dans la lumière de sa rareté ; la série de la semaine en icônes de coffres
export default {
  name: 'ChestList',
  components: { GModal },
  props: {
    // Vue du serveur : { pending: [{ source, rarity, label }], daily: { available, streak, rarity, tomorrow, week }, bottle }
    chests: { type: Object, required: true },
    busy: { type: Boolean, default: false }
  },
  emits: ['open', 'open-all', 'close'],
  data() {
    return { T, RARITY };
  },
  computed: {
    daily() {
      return this.chests.daily;
    },
    pending() {
      return this.chests.pending;
    },
    bottle() {
      return this.chests.bottle.available;
    },
    openable() {
      return openableOf(this.chests);
    },
    // Place du jour dans la semaine de la série, et numéro du premier jour de cette semaine
    today() {
      return (this.daily.streak - 1) % 7;
    },
    first() {
      return this.daily.streak - this.today;
    },
    // Le coffre du jour en grand : fermé s'il attend, ouvert s'il a été ouvert aujourd'hui, ou rien si la
    // bibliothèque ne l'a pas
    heroRarity() {
      return RARITY[this.daily.rarity] ? this.daily.rarity : this.daily.tomorrow;
    },
    hero() {
      const art = chestFrames(this.heroRarity);
      if (!art) return null;
      return this.daily.available ? art.closed[0].src : art.open[0].src;
    }
  },
  methods: {
    // L'icône d'un coffre de cette rareté (bibliothèque), ou null
    iconOf: chestIcon
  }
};
</script>

<style scoped src="./ChestList.css"></style>
