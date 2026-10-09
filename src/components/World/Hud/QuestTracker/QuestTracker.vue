<template>
  <!-- Le suivi des quêtes (world/tracker.js), en tête de la colonne de gauche de l'île : un médaillon (le sceau de Brume,
       sa progression en anneau, « ! » quand la quête est à réclamer, le nombre de choses à faire en pastille) ; touché,
       il déplie à sa droite une fiche étroite : la quête, sa progression, le geste suivant (pendant le tutoriel, toutes
       ses étapes), puis « À faire aussi ».
       Le choix (déplié ou non) est gardé sur l'appareil. -->
  <div v-if="main || todo.length" :class="['tracker', { 'is-open': open, 'is-done': main && main.done }]">
    <button
      type="button"
      class="tracker__seal"
      :aria-expanded="open ? 'true' : 'false'"
      aria-controls="tracker-card"
      :aria-label="main ? `${main.tag} : ${main.label}` : 'À faire'"
      @click="$emit('toggle')"
    >
      <svg class="tracker__ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r="19" class="tracker__ring-track" />
        <circle cx="22" cy="22" r="19" class="tracker__ring-fill" :style="{ strokeDashoffset: `${RING * (1 - share)}` }" />
      </svg>
      <span class="tracker__glyph" aria-hidden="true">{{ main && main.done ? '!' : '✦' }}</span>
      <span v-if="!open && count" class="tracker__badge" aria-hidden="true">{{ count }}</span>
    </button>
    <section v-if="open" id="tracker-card" class="tracker__card" :aria-label="main ? main.tag : 'À faire'">
      <template v-if="main">
        <p class="tracker__tag">{{ main.tag }}</p>
        <button type="button" class="tracker__quest" @click="$emit('main')">
          <span class="tracker__label">{{ main.label }}</span>
          <span v-if="steps" class="tracker__progress">{{ Math.min(main.have || 0, main.need) }}/{{ main.need }}</span>
        </button>
        <button v-if="main.done" type="button" class="tracker__act is-claim" @click="$emit('claim')">Réclamer<span v-if="main.coins"> · {{ main.coins }} écus</span></button>
        <button v-else-if="action" type="button" class="tracker__act" @click="$emit('act')">{{ action }}</button>
        <!-- Le tutoriel : toutes ses étapes, faites (cochées), en cours, à venir -->
        <ol v-if="main.steps" class="tracker__steps" aria-label="Les étapes du tutoriel">
          <li v-for="step in main.steps.list" :key="step.id" :class="['tracker__step', `is-${step.state}`]" :aria-current="step.state === 'now' ? 'step' : null">
            <span class="tracker__step-mark" aria-hidden="true">{{ step.state === 'done' ? '✓' : step.state === 'now' ? '➜' : '·' }}</span>
            <span>{{ step.label }}<span v-if="step.state === 'done'" class="oc-sr-only"> (faite)</span></span>
          </li>
        </ol>
      </template>
      <template v-if="todo.length">
        <p class="tracker__tag">À faire aussi</p>
        <ul class="tracker__list">
          <li v-for="item in todo" :key="item.id">
            <button type="button" class="tracker__item" @click="$emit('go', item)">{{ item.text }}</button>
          </li>
        </ul>
        <p v-if="more" class="tracker__more">et {{ more }} de plus</p>
      </template>
    </section>
  </div>
</template>

<script>
// Longueur de l'anneau de progression (2πr, r = 19)
const RING = 2 * Math.PI * 19;

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
    open: { type: Boolean, default: true }
  },
  emits: ['toggle', 'main', 'claim', 'act', 'go'],
  data() {
    return { RING };
  },
  computed: {
    // Une quête en plusieurs fois (6 trouvailles, 3 Récoltes…) : sa progression se compte
    steps() {
      return Boolean(this.main && !this.main.rested && this.main.need > 1);
    },
    share() {
      if (!this.main || this.main.rested) return 0;
      if (this.main.done) return 1;
      return this.main.need ? Math.min(1, (this.main.have || 0) / this.main.need) : 0;
    },
    // Replié : ce qui attend, quête à réclamer comprise
    count() {
      return this.todo.length + this.more + (this.main && this.main.done ? 1 : 0);
    }
  }
};
</script>

<style scoped src="./QuestTracker.css"></style>
