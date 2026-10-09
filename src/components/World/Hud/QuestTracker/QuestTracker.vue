<template>
  <!-- Le suivi des quêtes, toujours là (world/tracker.js) : la quête principale de Brume (le tutoriel tant qu'il dure),
       puis ce qui attend ailleurs sur l'île. Replié, une ligne ; déplié, la quête, sa progression, le geste suivant et
       la liste « À faire aussi ». Le choix (replié ou non) est gardé sur l'appareil. -->
  <aside v-if="main || todo.length" :class="['tracker', { 'is-open': open, 'is-done': main && main.done, 'is-low': belowTrip }]" aria-label="Suivi des quêtes">
    <button type="button" class="tracker__head" :aria-expanded="open ? 'true' : 'false'" @click="$emit('toggle')">
      <span class="tracker__seal" aria-hidden="true">{{ main && main.done ? '!' : '✦' }}</span>
      <span class="tracker__head-text">
        <span class="tracker__tag">{{ main ? main.tag : 'À faire' }}</span>
        <span v-if="!open" class="tracker__peek">{{ main ? main.label : todo[0].text }}</span>
      </span>
      <span v-if="!open && todo.length" class="tracker__count" :aria-label="`${todo.length + more} autres choses à faire`">+{{ todo.length + more }}</span>
      <span class="tracker__chevron" aria-hidden="true">{{ open ? '▴' : '▾' }}</span>
    </button>
    <div v-if="open" class="tracker__body">
      <div v-if="main" class="tracker__main">
        <button type="button" class="tracker__quest" @click="$emit('main')">
          <span class="tracker__label">{{ main.label }}</span>
          <span v-if="!main.rested && main.need > 1" class="tracker__bar" aria-hidden="true"><span :style="{ width: `${Math.min(1, (main.have || 0) / main.need) * 100}%` }"></span></span>
          <span v-if="!main.rested && main.need > 1" class="tracker__progress">{{ Math.min(main.have || 0, main.need) }} / {{ main.need }}</span>
        </button>
        <button v-if="main.done" type="button" class="tracker__act is-claim" @click="$emit('claim')">Réclamer auprès de Brume<span v-if="main.coins"> · {{ main.coins }} écus</span></button>
        <button v-else-if="action" type="button" class="tracker__act" @click="$emit('act')">{{ action }}</button>
      </div>
      <template v-if="todo.length">
        <p class="tracker__subtitle">À faire aussi</p>
        <ul class="tracker__list">
          <li v-for="item in todo" :key="item.id">
            <button type="button" class="tracker__item" @click="$emit('go', item)">{{ item.text }}</button>
          </li>
        </ul>
        <p v-if="more" class="tracker__more">et {{ more }} de plus</p>
      </template>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'QuestTracker',
  props: {
    // La quête principale (world/tracker.js : mainOf), ou null
    main: { type: Object, default: null },
    // Le libellé du geste suivant de la quête (WorldView : questAction), ou ''
    action: { type: String, default: '' },
    // « À faire aussi » (world/tracker.js : todoOf, coupé à MAX_TODO) et ce qui reste au-delà
    todo: { type: Array, default: () => [] },
    more: { type: Number, default: 0 },
    open: { type: Boolean, default: true },
    // La boussole (expédition) est affichée sous les boutons de gauche : le suivi passe dessous
    belowTrip: { type: Boolean, default: false }
  },
  emits: ['toggle', 'main', 'claim', 'act', 'go']
};
</script>

<style scoped src="./QuestTracker.css"></style>
