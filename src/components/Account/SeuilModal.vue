<template>
  <GModal eyebrow="Le Seuil" title="Inscris ton nom au registre" :width="480" @close="$emit('close')">
    <p class="g-italic seuil__lead">Sans compte, tu joues en invité : rien n’est gardé.</p>
    <div class="g-tabs" role="tablist" aria-label="Type de compte">
      <button type="button" role="tab" :aria-selected="mode === 'login'" @click="mode = 'login'">Connexion</button>
      <button type="button" role="tab" :aria-selected="mode === 'register'" @click="mode = 'register'">Inscription</button>
    </div>
    <form class="seuil__form" @submit.prevent="submit">
      <div class="g-field">
        <label for="seuil-email">Email</label>
        <input id="seuil-email" v-model.trim="email" type="email" autocomplete="email" required />
      </div>
      <div v-if="mode !== 'forgot'" class="g-field">
        <label for="seuil-password">Mot de passe · 8 caractères min.</label>
        <input
          id="seuil-password"
          v-model="password"
          type="password"
          minlength="8"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          required
        />
        <button v-if="mode === 'login'" type="button" class="seuil__forgot" @click="mode = 'forgot'">Mot de passe oublié ?</button>
      </div>
      <p v-if="mode === 'forgot' && !notice" class="g-italic seuil__lead">Un lien pour choisir un nouveau mot de passe te sera envoyé.</p>
      <p v-if="notice" class="g-note g-note--ok" role="status">{{ notice }}</p>
      <p v-if="error" class="g-note g-note--error" role="alert">{{ error }}</p>
      <div class="seuil__actions">
        <button type="button" class="g-btn g-btn--ghost" @click="$emit('close')">Continuer en invité</button>
        <button type="submit" class="g-btn" :disabled="loading">
          {{ loading ? 'Un instant…' : submitLabel }}
        </button>
      </div>
    </form>
  </GModal>
</template>

<script>
import { messageOf } from '@/utils/errors';
import AuthService from '@/services/authService';
import GModal from '@/components/ui/GModal/GModal.vue';

// Connexion / inscription ; en cas de succès, AuthService recharge la page
export default {
  name: 'SeuilModal',
  components: { GModal },
  emits: ['close'],
  data() {
    return { mode: 'login', email: '', password: '', error: '', notice: '', loading: false };
  },
  computed: {
    submitLabel() {
      return { login: 'Entrer', register: 'Créer mon compte', forgot: 'Recevoir le lien' }[this.mode];
    }
  },
  watch: {
    mode() {
      this.error = '';
      this.notice = '';
    }
  },
  methods: {
    async submit() {
      this.loading = true;
      this.error = '';
      try {
        if (this.mode === 'forgot') this.notice = (await AuthService.forgotPassword(this.email)).message;
        else if (this.mode === 'login') await AuthService.login(this.email, this.password);
        else await AuthService.register(this.email, this.password);
      } catch (error) {
        this.error = messageOf(error, this.mode === 'forgot' ? 'Le lien n’a pas pu être envoyé.' : 'Email ou mot de passe incorrect.');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.seuil__lead { margin: -6px 0 0; font-size: 17px; }
.seuil__form { display: flex; flex-direction: column; gap: 18px; }
.seuil__forgot {
  appearance: none;
  align-self: flex-end;
  min-height: 32px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: var(--oc-font-italic);
  font-style: italic;
  font-size: 15px;
  color: var(--oc-text-muted);
}
.seuil__forgot:hover { color: var(--oc-gold); }
.seuil__actions { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 6px; }
@media (max-width: 520px) {
  .seuil__actions { flex-direction: column-reverse; }
}
</style>
