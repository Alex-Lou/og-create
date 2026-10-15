<template>
  <!-- L'objectif de fond (l'arc du Phare, choix de l'auteur, 15 oct.) : « Rallumer le phare », et l'étape de l'acte en
       cours (serveur : brume.goal) ; en tête du Carnet, et en une ligne dans la fiche de Brume (compact). La tour, noire
       tant qu'il dort, s'allume quand il brille -->
  <div :class="['phare-goal', { 'is-compact': compact, 'is-lit': !goal.act }]" role="note">
    <svg class="phare-goal__tower" viewBox="0 0 24 34" aria-hidden="true">
      <path class="phare-goal__beam" d="M12 6 L1 1 V11 Z M12 6 L23 1 V11 Z" />
      <path class="phare-goal__body" d="M9 10 H15 L17 32 H7 Z" />
      <rect class="phare-goal__lamp" x="8.5" y="4" width="7" height="5" rx="1" />
      <path class="phare-goal__roof" d="M7.5 4.4 L12 1 L16.5 4.4 Z" />
      <path class="phare-goal__band" d="M8.3 17 H15.7 L16 20 H8 Z M7.7 25 H16.3 L16.6 28 H7.4 Z" />
    </svg>
    <span class="phare-goal__text">
      <span class="phare-goal__eyebrow">{{ goal.act ? T.act(goal.act) : T.eyebrow }}</span>
      <strong class="phare-goal__label">{{ goal.label }}</strong>
      <span class="phare-goal__step">{{ goal.step }}</span>
    </span>
  </div>
</template>

<script>
import { PHARE_GOAL as T } from '@/texts/world/phare';

export default {
  name: 'PhareGoal',
  props: {
    // { label, act, step } (serveur : quests.goalOf) ; act null : le phare brille
    goal: { type: Object, required: true },
    // Une ligne seulement (la fiche de Brume)
    compact: { type: Boolean, default: false }
  },
  data() {
    return { T };
  }
};
</script>

<style scoped src="./PhareGoal.css"></style>
