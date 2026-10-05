<template>
  <GModal eyebrow="Coffres" title="Tes coffres" :width="400" @close="$emit('close')">
    <div class="chests">
      <!-- Coffre du jour : la série de la semaine, du commun à l'épique (légendaire tous les 28 jours) -->
      <section class="chests__daily" aria-label="Coffre du jour">
        <h3 class="chests__title">Coffre du jour</h3>
        <ol class="chests__week">
          <li
            v-for="(rarity, i) in daily.week"
            :key="i"
            :class="['chests__day', { 'is-done': i < today || (i === today && !daily.available), 'is-today': i === today }]"
            :style="{ '--rarity': RARITY[rarity].color }"
            :aria-label="`Jour ${first + i} : ${RARITY[rarity].label}`"
          >
            <span aria-hidden="true">{{ first + i }}</span>
          </li>
        </ol>
        <p v-if="daily.available" class="chests__line">
          Jour {{ daily.streak }} de ta série : un coffre <strong>{{ RARITY[daily.rarity].label.toLowerCase() }}</strong> t’attend.
        </p>
        <p v-else class="chests__line">Ouvert aujourd’hui. Demain : un coffre {{ RARITY[daily.tomorrow].label.toLowerCase() }}, si tu reviens.</p>
        <button v-if="daily.available" type="button" class="g-btn chests__open" :disabled="busy" @click="$emit('open', 'jour')">Ouvrir</button>
      </section>

      <!-- Coffres qui attendent : chapitres ouverts, quêtes de Brume réclamées -->
      <section v-if="pending.length" class="chests__pending" aria-label="Coffres en attente">
        <h3 class="chests__title">En attente</h3>
        <ul class="chests__list">
          <li v-for="chest in pending" :key="chest.source" class="chests__item">
            <span class="chests__chip" :style="{ '--rarity': RARITY[chest.rarity].color }">{{ RARITY[chest.rarity].label }}</span>
            <span class="chests__label">{{ chest.label }}</span>
            <button type="button" class="g-btn g-btn--ghost chests__item-btn" :disabled="busy" @click="$emit('open', chest.source)">Ouvrir</button>
          </li>
        </ul>
      </section>

      <p class="chests__hint">
        <template v-if="bottle">Une bouteille s’est échouée sur une plage de ton île : touche-la pour l’ouvrir<template v-if="openable > 1">, ou ouvre tout d’un coup</template>.</template>
        <template v-else>Les Récoltes lâchent parfois un coffre, sûr avec une chaîne de 8 tuiles. Une bouteille s’échoue sur tes plages toutes les 6 heures.</template>
      </p>
    </div>
    <!-- « Tout ouvrir » : dès deux coffres (bouteille comprise), en plus des boutons de chacun -->
    <template v-if="openable > 1" #actions>
      <button type="button" class="g-btn chests__all" :disabled="busy" @click="$emit('open-all')">Tout ouvrir · {{ openable }}</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import { RARITY, openableOf } from '@/world/chest';

// Les coffres de l'île : celui du jour (série), ceux qui attendent d'être ouverts, et où trouver les autres ; « Tout
// ouvrir » les ouvre tous d'un coup
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
    return { RARITY };
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
    }
  }
};
</script>

<style scoped>
.chests { display: grid; gap: 18px; font-family: var(--font-ui); }
.chests__title { margin: 0 0 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); }
.chests__week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin: 0 0 10px; padding: 0; list-style: none; }
.chests__day {
  display: grid; place-items: center; aspect-ratio: 1; border-radius: 10px;
  border: 2px solid var(--rarity); color: var(--ink-700); font-weight: 900; font-size: 13px; background: var(--vellum-50);
}
.chests__day.is-done { background: var(--rarity); color: var(--ink-900); }
.chests__day.is-today { box-shadow: 0 0 0 3px rgba(242, 192, 75, .45); }
.chests__line { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.4; }
.chests__open { margin-top: 10px; width: 100%; }
.chests__list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.chests__item { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; }
.chests__chip { padding: 2px 8px; border-radius: 999px; background: var(--rarity); color: var(--ink-900); font-size: 11px; font-weight: 900; }
.chests__label { font-size: 14px; font-weight: 700; }
.chests__item-btn { min-height: 36px; padding: 4px 14px; }
.chests__all { width: 100%; }
.chests__hint { margin: 0; font-size: 13px; color: var(--ink-500); font-style: italic; line-height: 1.4; }
</style>
