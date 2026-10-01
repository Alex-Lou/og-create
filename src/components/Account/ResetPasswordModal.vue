<template>
  <GModal eyebrow="Le Seuil" title="Choisis un nouveau mot de passe" :width="460" @close="$emit('close')">
    <form v-if="!done" class="reset__form" @submit.prevent="submit">
      <div class="g-field">
        <label for="reset-password">Nouveau mot de passe · 8 caractères min.</label>
        <input id="reset-password" v-model="password" type="password" minlength="8" autocomplete="new-password" required />
      </div>
      <div class="g-field">
        <label for="reset-confirm">Encore une fois</label>
        <input id="reset-confirm" v-model="confirm" type="password" minlength="8" autocomplete="new-password" required />
      </div>
      <p v-if="error" class="g-note g-note--error" role="alert">{{ error }}</p>
      <div class="reset__actions">
        <button type="submit" class="g-btn" :disabled="loading">{{ loading ? 'Un instant…' : 'Changer le mot de passe' }}</button>
      </div>
    </form>
    <template v-else>
      <p class="g-note g-note--ok" role="status">{{ done }}</p>
      <div class="reset__actions">
        <button type="button" class="g-btn" @click="$emit('login')">Me connecter</button>
      </div>
    </template>
  </GModal>
</template>

<script>
import AuthService from '@/services/authService';
import GModal from '@/components/ui/GModal.vue';

// Ouvert par le lien reçu par e-mail (?reset=…) : le jeton n'est valable qu'une fois
export default {
  name: 'ResetPasswordModal',
  components: { GModal },
  props: {
    token: { type: String, required: true }
  },
  emits: ['close', 'login'],
  data() {
    return { password: '', confirm: '', error: '', done: '', loading: false };
  },
  methods: {
    async submit() {
      if (this.password !== this.confirm) {
        this.error = 'Les deux mots de passe ne sont pas identiques.';
        return;
      }
      this.loading = true;
      this.error = '';
      try {
        this.done = (await AuthService.resetPassword(this.token, this.password)).message;
      } catch (error) {
        this.error = error.response?.data?.message || 'Le mot de passe n’a pas pu être changé.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.reset__form { display: flex; flex-direction: column; gap: 18px; }
.reset__actions { display: flex; justify-content: flex-end; margin-top: 6px; }
</style>
