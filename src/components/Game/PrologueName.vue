<template>
  <!-- Étape 2 du tutoriel (HISTOIRE.md, § 9) : la page de garde du Grimoire, une plume. On y écrit son nom ; pour un
       invité, la même page crée le compte (e-mail, mot de passe) : sa partie d'invité le suit. -->
  <div class="pn" role="dialog" aria-modal="true" aria-labelledby="pn-title">
    <form class="pn__page" @submit.prevent="submit">
      <p class="pn__brume"><BrumeWisp :size="26" /> <span>{{ LINES.nom }}</span></p>
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
import BrumeWisp from '@/components/ui/BrumeWisp.vue';
import { LINES } from '@/game/prologueScenes';
import { messageOf } from '@/utils/errors';
import { NAME_MAX, cleanName } from '@/utils/names';

export default {
  name: 'PrologueName',
  components: { BrumeWisp },
  props: {
    // Invité : la page crée aussi le compte ; sinon, seulement le nom
    account: { type: Boolean, default: true }
  },
  // named : le nom (compte déjà ouvert) ; signing : le nom, juste avant l'inscription (la page se recharge ensuite) ;
  // signed-in : un compte existant retrouvé
  emits: ['named', 'signing', 'unsigned', 'signed-in', 'skip'],
  data() {
    return { LINES, NAME_MAX, name: '', email: '', password: '', login: false, error: '', busy: false };
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

<style scoped>
.pn {
  position: fixed; inset: 0; z-index: var(--z-prologue); display: grid; place-items: center; padding: 16px; overflow-y: auto;
  background: radial-gradient(circle at 50% 40%, rgba(40, 26, 18, .82), rgba(12, 8, 6, .94));
}
.pn__page {
  position: relative; width: min(440px, 100%); padding: 22px 24px 18px; border-radius: 10px;
  background: radial-gradient(circle at 50% 28%, #FBF3DF, #ECDCB6);
  box-shadow: inset 0 0 0 2px #C9A86A, inset 0 0 0 7px #F3E6C6, inset 0 0 0 8px #B99556, 0 18px 50px rgba(0, 0, 0, .55);
  color: #3E2A1E; text-align: center;
}
.pn__brume { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; text-align: left; font-family: var(--font-fell); font-style: italic; font-size: 17px; color: #523B2C; }
.pn__ex { margin: 0; font-family: var(--font-fell); font-style: italic; font-size: 16px; color: #6E5646; }
.pn__title { margin: 0 0 14px; font-family: var(--font-fell); font-weight: 400; font-size: 34px; }
.pn__name { position: relative; display: block; margin: 0 auto 14px; max-width: 320px; }
.pn__label { display: block; font-family: var(--font-fell-sc); font-size: 15px; letter-spacing: .06em; color: #2F6286; }
.pn__name input {
  width: 100%; padding: 6px 32px 4px; border: 0; border-bottom: 2px solid #8A6A3A; background: transparent; text-align: center;
  font-family: var(--font-fell); font-size: 30px; color: #2A1A10; outline: none;
}
.pn__name input:focus { border-bottom-color: #2F6286; }
.pn__quill { position: absolute; right: 2px; bottom: 8px; width: 24px; height: 24px; color: #6E5646; }
.pn__lead { margin: 4px 0 8px; font-family: var(--font-fell); font-style: italic; font-size: 16px; color: #523B2C; }
.pn__field { display: block; margin: 0 0 10px; text-align: left; font-family: var(--font-ui); font-size: 12px; font-weight: 800; color: #6E5646; }
.pn__field input {
  display: block; width: 100%; margin-top: 4px; padding: 10px 12px; border: 0; border-radius: 10px;
  background: rgba(255, 253, 248, .85); box-shadow: inset 0 0 0 1px rgba(138, 106, 58, .45);
  font: inherit; font-size: 15px; font-weight: 700; color: #2A1A10;
}
.pn__field input:focus-visible { outline: 2px solid #2F6286; }
.pn__error { margin: 6px 0; font-family: var(--font-ui); font-size: 13px; font-weight: 800; color: #9A2A1E; }
.pn__sign {
  width: 100%; min-height: 48px; margin-top: 6px; border: 0; border-radius: var(--r-pill); cursor: pointer;
  background: #3E2A1E; color: #FFF8E8; box-shadow: 0 4px 0 #1E120A;
  font-family: var(--font-fell); font-size: 20px;
}
.pn__sign:disabled { opacity: .7; cursor: default; }
.pn__links { display: flex; justify-content: space-between; margin-top: 12px; }
.pn__link { border: 0; background: none; cursor: pointer; padding: 6px 4px; font-family: var(--font-ui); font-size: 13px; font-weight: 800; color: #6E5646; text-decoration: underline; }
.pn__sign:focus-visible, .pn__link:focus-visible { outline: 3px solid #E3A93B; outline-offset: 2px; }
</style>
