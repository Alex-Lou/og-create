<template>
  <!-- La carte d'embarquement, sortie trempée d'une poche (HISTOIRE.md, § 9, étape 0, après le réveil sur la Grève) :
       le joueur se retrouve. Sa photo se compose (l'un des avatars de la bibliothèque, en tenue de croisière) et son
       nom s'écrit sur la ligne « Nom » ; ensuite, on le voit sur la Grève, naufragé -->
  <div class="pav" role="dialog" aria-modal="true" aria-labelledby="pav-title">
    <SceneArt scene="00_carte" :look="look" :name="shownName" />
    <form class="pav__panel" @submit.prevent="submit">
      <p id="pav-title" class="pav__thought">(La photo a bu la mer. C’était moi, ça ? … Oui. Ça me revient.)</p>
      <div class="pav__pick" role="group" aria-label="Ta photo">
        <button type="button" class="pav__arrow" aria-label="Photo précédente" @click="turn(-1)">‹</button>
        <span class="pav__count">{{ k + 1 }} / {{ LOOKS.length }}</span>
        <button type="button" class="pav__arrow" aria-label="Photo suivante" @click="turn(1)">›</button>
        <button type="button" class="pav__luck" @click="luck">Au hasard</button>
      </div>
      <label class="pav__name">
        <span class="pav__label">Ton nom</span>
        <input ref="name" v-model="name" type="text" :maxlength="NAME_MAX" autocomplete="nickname" spellcheck="false" required />
      </label>
      <p v-if="error" class="pav__error" role="alert">{{ error }}</p>
      <button type="submit" class="pav__ok">C’est moi</button>
    </form>
    <button type="button" class="pav__skip" @click="$emit('skip')">Passer le prologue</button>
  </div>
</template>

<script>
import SceneArt from '../SceneArt/SceneArt.vue';
import { LOOKS } from '@/game/sceneArt';
import { NAME_MAX, cleanName } from '@/utils/names';

export default {
  name: 'PrologueAvatar',
  components: { SceneArt },
  // chosen : { look, name }
  emits: ['chosen', 'skip'],
  data() {
    return { LOOKS, NAME_MAX, k: Math.floor(Math.random() * LOOKS.length), name: '', error: '' };
  },
  computed: {
    look() {
      return LOOKS[this.k];
    },
    // Le nom tel qu'il s'écrit sur la carte, au fil de la frappe
    shownName() {
      return this.name.trim().replace(/\s+/g, ' ').slice(0, NAME_MAX);
    }
  },
  methods: {
    turn(step) {
      this.k = (this.k + step + LOOKS.length) % LOOKS.length;
    },
    // Une autre photo que celle-ci, tirée au hasard
    luck() {
      this.k = (this.k + 1 + Math.floor(Math.random() * (LOOKS.length - 1))) % LOOKS.length;
    },
    submit() {
      // Même règle que les noms de l'île (serveur : services/naming.js)
      const name = cleanName(this.name);
      if (!name) {
        this.error = `Un nom de 2 à ${NAME_MAX} lettres ou chiffres (espace, tiret ou apostrophe entre deux).`;
        this.$refs.name.focus();
        return;
      }
      this.$emit('chosen', { look: this.look, name });
    }
  }
};
</script>

<style scoped src="./PrologueAvatar.css"></style>
