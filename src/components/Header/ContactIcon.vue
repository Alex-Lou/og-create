<template>
  <div class="contact-icon-container">
    <button
      type="button"
      class="g-icon-btn"
      aria-label="Écrire aux créateurs"
      aria-haspopup="dialog"
      :aria-expanded="isModalOpen ? 'true' : 'false'"
      @click="toggleModal"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
        <path d="M3 6h18v12H3z"></path>
        <path d="M3 6l9 7 9-7"></path>
      </svg>
    </button>

    <ContactModal v-if="isModalOpen" :isDarkMode="isDarkMode" @close="closeModal" />
  </div>
</template>

<script>
import ContactModal from './ContactModal.vue';

// Bouton d'en-tête qui ouvre la fenêtre « Écrire aux créateurs »
export default {
  name: 'ContactIcon',
  components: { ContactModal },
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { isModalOpen: false };
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    closeModal() {
      this.isModalOpen = false;
    }
  }
};
</script>

<style scoped>
.contact-icon-container { display: inline-flex; }
</style>
