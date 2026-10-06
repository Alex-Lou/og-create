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
/* Ses jetons (l'encre et le bleu du prologue : tokens/prologue.css) : le voile, la page (papier, cadre, coins),
   les encres, le trait de la plume, le champ, l'erreur, le bouton pour signer */
.pn {
  --pn-veil: radial-gradient(circle at 50% 40%, rgba(40, 26, 18, .82), rgba(12, 8, 6, .94));
  --pn-radius: 10px;
  --pn-paper: radial-gradient(circle at 50% 28%, #fbf3df, #ecdcb6);
  --pn-frame-outer: #c9a86a;
  --pn-frame-inner: #f3e6c6;
  --pn-frame-line: #b99556;
  --pn-brume-ink: #523b2c;
  --pn-muted: #6e5646;
  --pn-input-line: #8a6a3a;
  --pn-input-ink: #2a1a10;
  --pn-field-bg: rgba(255, 253, 248, .85);
  --pn-field-ring: rgba(138, 106, 58, .45);
  --pn-error: #9a2a1e;
  --pn-sign-ink: #fff8e8;
  --pn-sign-edge: #1e120a;
}
.pn {
  position: fixed; inset: 0; z-index: var(--z-prologue); display: grid; place-items: center; padding: 16px; overflow-y: auto;
  background: var(--pn-veil);
}
.pn__page {
  position: relative; width: min(440px, 100%); padding: 22px 24px 18px; border-radius: var(--pn-radius);
  background: var(--pn-paper);
  box-shadow: inset 0 0 0 2px var(--pn-frame-outer), inset 0 0 0 7px var(--pn-frame-inner), inset 0 0 0 8px var(--pn-frame-line), 0 18px 50px rgba(0, 0, 0, .55);
  color: var(--prologue-ink); text-align: center;
}
.pn__brume { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; text-align: left; font-family: var(--font-fell); font-style: italic; font-size: 17px; color: var(--pn-brume-ink); }
.pn__ex { margin: 0; font-family: var(--font-fell); font-style: italic; font-size: 16px; color: var(--pn-muted); }
.pn__title { margin: 0 0 14px; font-family: var(--font-fell); font-weight: 400; font-size: 34px; }
.pn__name { position: relative; display: block; margin: 0 auto 14px; max-width: 320px; }
.pn__label { display: block; font-family: var(--font-fell-sc); font-size: 15px; letter-spacing: .06em; color: var(--prologue-blue); }
.pn__name input {
  width: 100%; padding: 6px 32px 4px; border: 0; border-bottom: 2px solid var(--pn-input-line); background: transparent; text-align: center;
  font-family: var(--font-fell); font-size: 30px; color: var(--pn-input-ink); outline: none;
}
.pn__name input:focus { border-bottom-color: var(--prologue-blue); }
.pn__quill { position: absolute; right: 2px; bottom: 8px; width: 24px; height: 24px; color: var(--pn-muted); }
.pn__lead { margin: 4px 0 8px; font-family: var(--font-fell); font-style: italic; font-size: 16px; color: var(--pn-brume-ink); }
.pn__field { display: block; margin: 0 0 10px; text-align: left; font-family: var(--font-ui); font-size: 12px; font-weight: 800; color: var(--pn-muted); }
.pn__field input {
  display: block; width: 100%; margin-top: 4px; padding: 10px 12px; border: 0; border-radius: var(--pn-radius);
  background: var(--pn-field-bg); box-shadow: inset 0 0 0 1px var(--pn-field-ring);
  font: inherit; font-size: 15px; font-weight: 700; color: var(--pn-input-ink);
}
.pn__field input:focus-visible { outline: 2px solid var(--prologue-blue); }
.pn__error { margin: 6px 0; font-family: var(--font-ui); font-size: 13px; font-weight: 800; color: var(--pn-error); }
.pn__sign {
  width: 100%; min-height: 48px; margin-top: 6px; border: 0; border-radius: var(--r-pill); cursor: pointer;
  background: var(--prologue-ink); color: var(--pn-sign-ink); box-shadow: 0 4px 0 var(--pn-sign-edge);
  font-family: var(--font-fell); font-size: 20px;
}
.pn__sign:disabled { opacity: .7; cursor: default; }
.pn__links { display: flex; justify-content: space-between; margin-top: 12px; }
.pn__link { border: 0; background: none; cursor: pointer; padding: 6px 4px; font-family: var(--font-ui); font-size: 13px; font-weight: 800; color: var(--pn-muted); text-decoration: underline; }
.pn__sign:focus-visible, .pn__link:focus-visible { outline: 3px solid var(--oc-aim); outline-offset: 2px; }
</style>
