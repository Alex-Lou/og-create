<template>
  <!-- La carte d'embarquement, sortie trempée d'une poche (HISTOIRE.md, § 9, étape 0, après le réveil sur la plage de Brumelune) :
       le joueur se retrouve. D'abord il se compose, en pied (AvatarMaker) ; puis sa photo paraît sur la carte, à
       mi-corps, et son nom s'écrit sur la ligne « Nom » ; ensuite, on le voit sur la plage de Brumelune, naufragé.
       editing : le même éditeur, depuis « Mon compte » (sans la carte ni le nom). À « C'est moi », il s'ébroue, la
       brume revient, la plage s'efface dans la nuit et la carte glisse de la poche en se posant -->
  <div class="pav" role="dialog" aria-modal="true" aria-labelledby="pav-title">
    <Transition name="pav-scene" mode="out-in" :duration="sceneMs" @after-enter="focusName">
      <!-- la pensée se pose sur la plage, les boutons sous la feuille des choix (AvatarMaker : thought, actions) ;
           au prologue, on se voit d'abord échoué -->
      <div v-if="step === 'maker'" class="pav__maker">
        <AvatarMaker ref="maker" v-model="choices" :castaway="!editing" class="pav__editor">
          <template #thought>
            <p id="pav-title" class="pav__thought">{{ editing ? THOUGHTS.editing : THOUGHTS.maker }}</p>
          </template>
          <template #actions>
            <div class="pav__actions">
              <button v-if="editing" type="button" class="pav__back" @click="$emit('close')">Annuler</button>
              <button type="button" class="pav__ok" :disabled="busy" @click="next">{{ editing ? 'Garder' : 'C’est moi' }}</button>
            </div>
            <p v-if="error" class="pav__error" role="alert">{{ error }}</p>
          </template>
        </AvatarMaker>
      </div>
      <!-- La carte trempée, sortie de la poche : la photo à mi-corps, le nom qui s'écrit au fil de la frappe -->
      <div v-else class="pav__scene">
        <div class="pav__card"><BoardingCard :look="choices" :name="shownName" kind="trempee" class="pav__boarding" /></div>
        <form class="pav__panel" @submit.prevent="submit">
          <p id="pav-title" class="pav__thought">{{ THOUGHTS.card }}</p>
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
      </div>
    </Transition>
  </div>
</template>

<script>
import BoardingCard from '../BoardingCard/BoardingCard.vue';
import AvatarMaker from '../AvatarMaker/AvatarMaker.vue';
import { LOOKS } from '@/game/sceneArt';
import { freeChoicesOf } from '@/game/avatarCatalog';
import { NAME_MAX, cleanName } from '@/utils/names';
import { reducedMotion } from '@/utils/fx';
import { THOUGHTS } from '@/texts/ui/prologue';
import { NAME_RULE } from '@/texts/ui/names';

// D'une scène à l'autre (ms) : la plage s'efface ; la carte glisse et se pose, puis le panneau du nom monte
// (PrologueAvatar.css : pav-pose, pav-monte)
const SCENE_MS = { enter: 760, leave: 320 };

export default {
  name: 'PrologueAvatar',
  components: { BoardingCard, AvatarMaker },
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
      THOUGHTS, NAME_MAX, step: 'maker', name: '', nameError: '', leaving: false, sceneMs: reducedMotion() ? 0 : SCENE_MS,
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
    // « C'est moi » : il s'ébroue, la brume revient (AvatarMaker : bow), puis la carte ; un seul départ à la fois
    async next() {
      if (this.editing) {
        this.$emit('chosen', { look: this.choices });
        return;
      }
      if (this.leaving) return;
      this.leaving = true;
      await this.$refs.maker.bow();
      this.leaving = false;
      this.step = 'card';
    },
    // La carte posée, on écrit son nom
    focusName() {
      if (this.step === 'card' && this.$refs.name) this.$refs.name.focus();
    },
    submit() {
      // Même règle que les noms de l'île (serveur : services/naming.js)
      const name = cleanName(this.name);
      if (!name) {
        this.nameError = NAME_RULE(NAME_MAX);
        this.$refs.name.focus();
        return;
      }
      this.$emit('chosen', { look: this.choices, name });
    }
  }
};
</script>

<style scoped src="./PrologueAvatar.css"></style>
