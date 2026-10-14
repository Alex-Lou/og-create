<template>
  <!-- Le niveau de la partie : on choisit parmi ceux qui sont ouverts ; son objectif, ses meilleures étoiles. Dessous, la
       piste des 10 niveaux de la saison (chaque case dorée selon ses étoiles, on la touche pour y aller) et ce qui manque
       pour ouvrir la saison suivante (dès la première étoile). Le nom, l'objectif et les étoiles rebondissent à chaque changement -->
  <div class="lvl" role="group" :aria-label="`Niveau ${modelValue}`">
    <div class="lvl__row">
      <button type="button" class="lvl__arrow" :disabled="modelValue <= 1" aria-label="Niveau précédent" @click="go(modelValue - 1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" /></svg>
      </button>
      <div :key="`n${modelValue}`" :class="['lvl__name', `is-${dir}`]">
        <span class="lvl__season">Saison {{ season }}</span>
        <strong>Niveau {{ modelValue }}</strong>
      </div>
      <button type="button" class="lvl__arrow" :disabled="modelValue >= open.max" aria-label="Niveau suivant" @click="go(modelValue + 1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" /></svg>
      </button>
    </div>
    <p :key="`g${modelValue}`" class="lvl__goal">{{ goal.text }}</p>
    <p :key="`s${modelValue}`" class="lvl__stars" :aria-label="`${best} étoile${best > 1 ? 's' : ''} sur 3`">
      <img v-for="k in 3" :key="k" :src="k <= best ? STAR_ON : STAR_OFF" alt="" width="22" height="22" :style="{ '--k': k }" />
    </p>
    <ol class="lvl__track" :aria-label="`Les niveaux de la saison ${season}`">
      <li v-for="p in track.pips" :key="p.level">
        <button
          type="button"
          :class="['lvl__pip', `is-s${p.stars}`, { 'is-on': p.current, 'is-locked': !p.open }]"
          :disabled="!p.open"
          :aria-current="p.current ? 'true' : null"
          :aria-label="p.open ? `Niveau ${p.level}, ${p.stars} étoile${p.stars > 1 ? 's' : ''}` : `Niveau ${p.level}, fermé`"
          @click="go(p.level)"
        >{{ p.level }}</button>
      </li>
    </ol>
    <p v-if="track.next && open.stars" class="lvl__next">
      <img :src="STAR_ON" alt="" width="14" height="14" /> {{ track.next.have }} / {{ track.next.need }} pour ouvrir la saison {{ track.next.season }}
    </p>
    <!-- La première fois : ce que sont les niveaux et les étoiles -->
    <p v-if="!open.stars" class="lvl__tip">
      Chaque partie a un objectif. Rempli, il donne 1 à 3 étoiles selon ce qu’il te reste ; une étoile ouvre le niveau suivant, et la première fois, chaque étoile rapporte quelques écus.
    </p>
  </div>
</template>

<script>
import { goalOf, openOf, seasonOf } from '@/game/levels';
import { trackOf } from '@/game/levelTrack';
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
    // dir : le sens du dernier changement (le nom arrive de ce côté), rien à l'ouverture
    return { STAR_ON, STAR_OFF, dir: 'here' };
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
    },
    track() {
      return trackOf(this.stages, this.modelValue);
    }
  },
  watch: {
    modelValue(now, before) {
      this.dir = now > before ? 'next' : 'prev';
    }
  },
  methods: {
    go(n) {
      if (n !== this.modelValue && n >= 1 && n <= this.open.max) this.$emit('update:modelValue', n);
    }
  }
};
</script>

<style scoped src="./LevelPicker.css"></style>
