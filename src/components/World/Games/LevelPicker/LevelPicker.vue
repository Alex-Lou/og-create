<template>
  <!-- Le niveau de la partie : on choisit parmi ceux qui sont ouverts ; son objectif, ses meilleures étoiles -->
  <div class="lvl" role="group" :aria-label="`Niveau ${modelValue}`">
    <div class="lvl__row">
      <button type="button" class="lvl__arrow" :disabled="modelValue <= 1" aria-label="Niveau précédent" @click="$emit('update:modelValue', modelValue - 1)">‹</button>
      <div class="lvl__name">
        <span class="lvl__season">Saison {{ season }}</span>
        <strong>Niveau {{ modelValue }}</strong>
      </div>
      <button type="button" class="lvl__arrow" :disabled="modelValue >= open.max" aria-label="Niveau suivant" @click="$emit('update:modelValue', modelValue + 1)">›</button>
    </div>
    <p class="lvl__goal">{{ goal.text }}</p>
    <p class="lvl__stars" :aria-label="`${best} étoile${best > 1 ? 's' : ''} sur 3`">
      <img v-for="k in 3" :key="k" :src="k <= best ? STAR_ON : STAR_OFF" alt="" width="22" height="22" />
    </p>
    <!-- La première fois : ce que sont les niveaux et les étoiles -->
    <p v-if="!open.stars" class="lvl__tip">
      Chaque partie a un objectif. Rempli, il donne 1 à 3 étoiles selon ce qu’il te reste ; une étoile ouvre le niveau suivant, et la première fois, chaque étoile rapporte quelques écus.
    </p>
  </div>
</template>

<script>
import { goalOf, openOf, seasonOf } from '@/game/levels';
import { gamePiece } from '@/game/minigameArt';

// Les étoiles du bilan (bibliothèque, minijeux/filon) servent à tous les jeux à grille
const STAR_ON = gamePiece('filon', 'etoile-gagnee_3');
const STAR_OFF = gamePiece('filon', 'etoile_vide');

export default {
  name: 'LevelPicker',
  props: {
    // Le jeu (recolte, filon, cueillette), les étoiles de ses 30 niveaux (vue du serveur : stages), le niveau choisi
    game: { type: String, required: true },
    stages: { type: Array, default: () => [] },
    modelValue: { type: Number, required: true }
  },
  emits: ['update:modelValue'],
  data() {
    return { STAR_ON, STAR_OFF };
  },
  computed: {
    open() {
      return openOf(this.stages);
    },
    season() {
      return seasonOf(this.modelValue);
    },
    goal() {
      return goalOf(this.game, this.modelValue);
    },
    best() {
      return this.stages[this.modelValue - 1] || 0;
    }
  }
};
</script>

<style scoped src="./LevelPicker.css"></style>
