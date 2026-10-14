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
          :placeholder="T.placeholder"
          maxlength="5000"
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
import { messageOf } from '@/utils/errors';
import http from '@/services/http';
import GModal from '@/components/ui/GModal/GModal.vue';
import { CONTACT } from '@/texts/ui/settings';

// Formulaire de contact : envoi à l'API, puis fermeture 2 s après le succès
export default {
  name: 'ContactModal',
  components: { GModal },
  emits: ['close'],
  data() {
    return {
      T: CONTACT,
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
        await http.post('/contact/send', {
          email: this.email,
          message: this.message
        });

        this.successMessage = CONTACT.sent;
        this.email = '';
        this.message = '';

        this.closeTimer = setTimeout(() => {
          this.$emit('close');
        }, 2000);
      } catch (error) {
        // Raison donnée par le serveur (adresse invalide, message trop long, trop d'envois…)
        this.errorMessage = messageOf(error, CONTACT.failed);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped src="./ContactModal.css"></style>
