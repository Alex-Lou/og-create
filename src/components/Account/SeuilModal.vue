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
      <div class="g-field">
        <label for="seuil-password">Mot de passe · 8 caractères min.</label>
        <input
          id="seuil-password"
          v-model="password"
          type="password"
          minlength="8"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          required
        />
      </div>
      <p v-if="error" class="g-note g-note--error" role="alert">{{ error }}</p>
      <div class="seuil__actions">
        <button type="button" class="g-btn g-btn--ghost" @click="$emit('close')">Continuer en invité</button>
        <button type="submit" class="g-btn" :disabled="loading">
          {{ loading ? 'Un instant…' : mode === 'login' ? 'Entrer' : 'Créer mon compte' }}
        </button>
      </div>
    </form>
  </GModal>
</template>

<script>
import AuthService from '@/services/authService';
import GModal from '@/components/ui/GModal.vue';

// Connexion / inscription ; en cas de succès, AuthService recharge la page
export default {
  name: 'SeuilModal',
  components: { GModal },
  emits: ['close'],
  data() {
    return { mode: 'login', email: '', password: '', error: '', loading: false };
  },
  watch: {
    mode() {
      this.error = '';
    }
  },
  methods: {
    async submit() {
      this.loading = true;
      this.error = '';
      try {
        if (this.mode === 'login') await AuthService.login(this.email, this.password);
        else await AuthService.register(this.email, this.password);
      } catch (error) {
        this.error = error.response?.data?.message || 'Email ou mot de passe incorrect.';
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
.seuil__actions { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 6px; }
@media (max-width: 520px) {
  .seuil__actions { flex-direction: column-reverse; }
}
</style>
