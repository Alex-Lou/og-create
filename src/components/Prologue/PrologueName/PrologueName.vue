<template>
  <!-- Étape 2 du tutoriel (HISTOIRE.md, § 9) : la page de garde du Grimoire, une plume. On y écrit son nom ; pour un
       invité, la même page crée le compte (e-mail, mot de passe) : sa partie d'invité le suit. -->
  <div class="pn" role="dialog" aria-modal="true" aria-labelledby="pn-title">
    <form class="pn__page" @submit.prevent="submit">
      <p class="pn__brume"><BrumeWisp :size="26" :stage="0" /> <span>{{ LINES.nom }}</span></p>
      <p class="pn__ex">Ex libris</p>
      <h2 id="pn-title" class="pn__title">Codex Mundi</h2>
      <label class="pn__name">
        <span class="pn__label">Ton nom</span>
        <input ref="name" v-model="name" type="text" :maxlength="NAME_MAX" autocomplete="nickname" spellcheck="false" required />
        <svg class="pn__quill" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 3C12 4 7 9 5 17l-1.5 4L6 19.5C14 17 19 12 20 3zM5 17c3-1 6-3 8-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </label>
      <template v-if="account">
        <p class="pn__lead">{{ login ? 'Retrouve ton Grimoire :' : 'Pour que l’île te garde, d’un appareil à l’autre :' }}</p>
        <label class="pn__field"><span>E-mail</span><input v-model.trim="email" type="email" autocomplete="email" required /></label>
        <label class="pn__field">
          <span>Mot de passe · 8 caractères min.</span>
          <input v-model="password" type="password" minlength="8" :autocomplete="login ? 'current-password' : 'new-password'" required />
        </label>
      </template>
      <p v-if="error" class="pn__error" role="alert">{{ error }}</p>
      <button type="submit" class="pn__sign" :disabled="busy">{{ busy ? 'Un instant…' : login ? 'Ouvrir mon Grimoire' : 'Signer le Grimoire' }}</button>
      <div class="pn__links">
        <button v-if="account" type="button" class="pn__link" @click="login = !login">{{ login ? 'Créer un compte' : 'J’ai déjà un compte' }}</button>
        <button type="button" class="pn__link" @click="$emit('skip')">Passer</button>
      </div>
    </form>
  </div>
</template>

<script>
import AuthService from '@/services/authService';
import BrumeWisp from '@/components/Guide/BrumeWisp/BrumeWisp.vue';
import { LINES } from '@/game/prologueScenes';
import { messageOf } from '@/utils/errors';
import { NAME_MAX, cleanName } from '@/utils/names';

export default {
  name: 'PrologueName',
  components: { BrumeWisp },
  props: {
    // Invité : la page crée aussi le compte ; sinon, seulement le nom
    account: { type: Boolean, default: true },
    // Le nom déjà écrit sur la carte d'embarquement
    initialName: { type: String, default: '' }
  },
  // named : le nom (compte déjà ouvert) ; signing : le nom, juste avant l'inscription (la page se recharge ensuite) ;
  // signed-in : un compte existant retrouvé
  emits: ['named', 'signing', 'unsigned', 'signed-in', 'skip'],
  data() {
    return { LINES, NAME_MAX, name: this.initialName, email: '', password: '', login: false, error: '', busy: false };
  },
  mounted() {
    this.$refs.name.focus();
  },
  methods: {
    async submit() {
      // Même règle que les noms de l'île (serveur : services/naming.js)
      const name = cleanName(this.name);
      if (!name) {
        this.error = `Un nom de 2 à ${NAME_MAX} lettres ou chiffres (espace, tiret ou apostrophe entre deux).`;
        return;
      }
      this.error = '';
      if (!this.account) {
        this.$emit('named', name);
        return;
      }
      this.busy = true;
      try {
        if (this.login) {
          this.$emit('signed-in');
          await AuthService.login(this.email, this.password);
        } else {
          this.$emit('signing', name);
          await AuthService.register(this.email, this.password);
        }
      } catch (error) {
        if (!this.login) this.$emit('unsigned');
        this.error = messageOf(error, this.login ? 'Email ou mot de passe incorrect.' : 'Le compte n’a pas pu être créé.');
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>

<style scoped src="./PrologueName.css"></style>
