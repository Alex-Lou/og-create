<template>
  <div class="contact-icon-container">
    <button 
      class="contact-icon-button"
      @click="toggleModal"
      :class="{ 'dark': isDarkMode, 'clicked': isClicked }"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <div class="image-container">
        <img 
          src="@/assets/Svgs/enveloppe.png"
          alt="Contact"
          class="contact-image"
        />
      </div>
    </button>

    <ContactModal 
      v-if="isModalOpen"
      :isDarkMode="isDarkMode"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script>
import ContactModal from './ContactModal.vue'

export default {
  name: 'ContactIcon',
  components: {
    ContactModal
  },
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isModalOpen: false,
      isClicked: false
    }
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen
    },
    handleMouseDown() {
      this.isClicked = true;
    },
    handleMouseUp() {
      this.isClicked = false;
    }
  }
}
</script>

<style scoped>
.contact-icon-container {
  display: flex;
  align-items: center;
  height: 100%;
  margin-bottom: 5px;
  margin-right: 40px;
  width: 50px;
}

.contact-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: 5px;
  padding: 0;
  width: 40px;
  height: 40px;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.contact-image {
  width: 85px;
  height: 85px;
  transition: all 0.15s ease;
  object-fit: contain;
}

.contact-icon-button:hover {
  background-color: rgba(128, 128, 128, 0.2);
}

.contact-icon-button.dark:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.contact-icon-button:hover .contact-image {
  transform: scale(1.1);
}

/* Nouveaux styles pour l'effet de clic */
.contact-icon-button.clicked .contact-image {
  transform: scale(0.9);
  filter: brightness(0.9);
}

.contact-icon-button.clicked {
  background-color: rgba(128, 128, 128, 0.3);
}

.contact-icon-button.dark.clicked {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>