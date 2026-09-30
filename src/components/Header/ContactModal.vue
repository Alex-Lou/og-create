<template>
  <GModal eyebrow="Correspondance" title="Écrire aux créateurs" :width="520" @close="$emit('close')">
    <form class="contact__form" @submit.prevent="handleSubmit">
      <div class="g-field">
        <label for="contact-email">Ton email</label>
        <input
          id="contact-email"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="toi@exemple.fr"
          required
        />
      </div>
      <div class="g-field">
        <label for="contact-message">Ton message</label>
        <textarea
          id="contact-message"
          v-model="message"
          placeholder="Une idée, un bug, une recette qui manque…"
          required
        ></textarea>
      </div>
      <p v-if="errorMessage" class="g-note g-note--error" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="g-note g-note--ok" role="status">{{ successMessage }}</p>
      <div class="contact__actions">
        <button type="submit" class="g-btn" :disabled="isLoading">
          {{ isLoading ? 'Envoi…' : 'Envoyer' }}
        </button>
      </div>
    </form>
  </GModal>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/config';
import GModal from '@/components/ui/GModal.vue';

// Formulaire de contact : envoi à l'API, puis fermeture 2 s après le succès
export default {
  name: 'ContactModal',
  components: { GModal },
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data() {
    return {
      email: '',
      message: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false,
      closeTimer: null
    };
  },
  beforeUnmount() {
    clearTimeout(this.closeTimer);
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        await axios.post(`${API_URL}/contact/send`, {
          email: this.email,
          message: this.message
        });

        this.successMessage = 'Message envoyé. Merci.';
        this.email = '';
        this.message = '';

        this.closeTimer = setTimeout(() => {
          this.$emit('close');
        }, 2000);
      } catch (error) {
        this.errorMessage = 'Erreur lors de l’envoi du message. Veuillez réessayer.';
        console.error('Erreur:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.contact__form { display: flex; flex-direction: column; gap: 20px; }
.contact__actions { display: flex; justify-content: flex-end; }
@media (max-width: 520px) {
  .contact__actions > .g-btn { flex: 1; }
}
</style>
