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
import '@/assets/ComponentsStyle/HeaderStyle/ContactIconStyle.css'

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