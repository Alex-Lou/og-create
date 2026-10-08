<template>
  <!-- La carte d'embarquement, sortie trempée d'une poche (HISTOIRE.md, § 9, étape 0, après le réveil sur la Grève) :
       le joueur se retrouve. D'abord il se compose, en pied (AvatarMaker) ; puis sa photo paraît sur la carte, à
       mi-corps, et son nom s'écrit sur la ligne « Nom » ; ensuite, on le voit sur la Grève, naufragé.
       editing : le même éditeur, depuis « Mon compte » (sans la carte ni le nom) -->
  <div class="pav" role="dialog" aria-modal="true" aria-labelledby="pav-title">
    <template v-if="step === 'maker'">
      <div class="pav__maker">
        <p id="pav-title" class="pav__thought">{{ editing ? 'Un coup de peigne, une autre chemise… C’est toujours moi.' : '(Qui étais-je, déjà, avant la vague ? … Ça me revient.)' }}</p>
        <AvatarMaker v-model="choices" class="pav__editor" />
        <div class="pav__actions">
          <button v-if="editing" type="button" class="pav__back" @click="$emit('close')">Annuler</button>
          <button type="button" class="pav__ok" :disabled="busy" @click="next">{{ editing ? 'Garder' : 'C’est moi' }}</button>
        </div>
        <p v-if="error" class="pav__error" role="alert">{{ error }}</p>
      </div>
    </template>
    <template v-else>
      <SceneArt scene="00_carte" :look="choices" :name="shownName" />
      <form class="pav__panel" @submit.prevent="submit">
        <p id="pav-title" class="pav__thought">(La photo a bu la mer. C’était moi, ça ? … Oui. Et mon nom…)</p>
        <label class="pav__name">
          <span class="pav__label">Ton nom</span>
          <input ref="name" v-model="name" type="text" :maxlength="NAME_MAX" autocomplete="nickname" spellcheck="false" required />
        </label>
        <p v-if="nameError" class="pav__error" role="alert">{{ nameError }}</p>
        <div class="pav__actions">
          <button type="button" class="pav__back" @click="step = 'maker'">Retour</button>
          <button type="submit" class="pav__ok">C’est moi</button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import SceneArt from '../SceneArt/SceneArt.vue';
import AvatarMaker from '../AvatarMaker/AvatarMaker.vue';
import { LOOKS } from '@/game/sceneArt';
import { freeChoicesOf } from '@/game/avatarKit';
import { NAME_MAX, cleanName } from '@/utils/names';

export default {
  name: 'PrologueAvatar',
  components: { SceneArt, AvatarMaker },
  props: {
    // L'avatar de départ (des choix, ou l'un des exemples) ; sans lui, l'un des exemples au hasard
    start: { type: [String, Object], default: null },
    // Depuis « Mon compte » : l'éditeur seul ; busy : l'avatar part au serveur
    editing: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    error: { type: String, default: '' }
  },
  // chosen : { look (les choix), name } (name : seulement au tutoriel) ; close : sans rien changer (Mon compte)
  emits: ['chosen', 'close'],
  data() {
    return {
      NAME_MAX, step: 'maker', name: '', nameError: '',
      choices: freeChoicesOf(this.start || LOOKS[Math.floor(Math.random() * LOOKS.length)])
    };
  },
  computed: {
    // Le nom tel qu'il s'écrit sur la carte, au fil de la frappe
    shownName() {
      return this.name.trim().replace(/\s+/g, ' ').slice(0, NAME_MAX);
    }
  },
  methods: {
    next() {
      if (this.editing) {
        this.$emit('chosen', { look: this.choices });
        return;
      }
      this.step = 'card';
      this.$nextTick(() => this.$refs.name && this.$refs.name.focus());
    },
    submit() {
      // Même règle que les noms de l'île (serveur : services/naming.js)
      const name = cleanName(this.name);
      if (!name) {
        this.nameError = `Un nom de 2 à ${NAME_MAX} lettres ou chiffres (espace, tiret ou apostrophe entre deux).`;
        this.$refs.name.focus();
        return;
      }
      this.$emit('chosen', { look: this.choices, name });
    }
  }
};
</script>

<style scoped src="./PrologueAvatar.css"></style>
