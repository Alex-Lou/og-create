DarkToggle.vue: 

  <template>
    <button id="toggle-dark-mode" @click="toggleDarkMode">
      <span class="toggle-indicator"></span>
    </button>
  </template>

  <script>
  import "@/assets/ComponentsStyle/HeaderStyle/ToggleDarkStyle.css";
  export default {
    props: {
      isDarkMode: {
        type: Boolean,
        required: true,
      },
    },
    emits: ["update:darkMode"],
    methods: {
      toggleDarkMode() {
    document.body.classList.add("transition-mode");
    setTimeout(() => {
      document.body.classList.remove("transition-mode");
    }, 500);

    this.$emit("update:darkMode", !this.isDarkMode);
    document.body.classList.toggle("light-mode", !this.isDarkMode);
    document.body.classList.toggle("dark-mode", this.isDarkMode);
  },
    },
    mounted() {
      // Assurez-vous que la classe correcte est appliquée au chargement
      document.body.classList.add(this.isDarkMode ? "dark-mode" : "light-mode");
    },
  };
  </script>