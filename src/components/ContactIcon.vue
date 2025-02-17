<template>
    <div class="contact-icon-container">
      <button 
        class="contact-icon-button"
        @click="toggleModal"
        :class="{ 'dark': isDarkMode }"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          :stroke="isDarkMode ? '#ffffff' : '#000000'"
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
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
      isModalOpen: false
    }
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen
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
  margin-left: 30px;
}
  
.contact-icon-button:hover {
  background-color: rgba(128, 128, 128, 0.2);
}
  
.contact-icon-button.dark:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
  
.contact-icon-button svg {
  transition: transform 0.3s ease;
}
  
.contact-icon-button:hover svg {
  transform: scale(1.1);
}
</style>