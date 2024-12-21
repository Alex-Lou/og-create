<template>
  <button id="toggle-dark-mode" @click="toggleDarkMode">
    {{ isDarkMode ? 'Mode Jour' : 'Mode Nuit' }}
  </button>
</template>

<script>
export default {
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  emits: ["update:darkMode"],
  methods: {
    toggleDarkMode() {
      this.$emit("update:darkMode", !this.isDarkMode);
    }
  }
};
</script>

<style scoped>
@import "@/assets/ToggleDarkStyle.css"; /* Chemin vers ton fichier CSS */
</style>
