<template>
  <div class="login-container">
    <div class="user-frame" @click="toggleDropdown">
      <img 
        :src="require(`@/assets/Svgs/${userFrame}`)" 
        alt="Cadre" 
        class="frame-image"
      />
      <img 
        :src="require(`@/assets/Svgs/${userAvatar}`)"
        :alt="isLoggedIn ? 'Utilisateur connecté' : 'Utilisateur non connecté'"
        class="user-image"
      />
    </div>

    <div v-if="isOpen" class="login-dropdown">
      <div v-if="!isLoggedIn" class="login-type-selector">
        <button 
          :class="['type-btn', { active: loginType === 'login' }]"
          @click="loginType = 'login'"
        >
          Connexion
        </button>
        <button 
          :class="['type-btn', { active: loginType === 'register' }]"
          @click="loginType = 'register'"
        >
          Inscription
        </button>
      </div>

      <div v-else class="logged-in-section">
        <p>Connecté en tant que: {{ currentUser.username }}</p>
        <div class="logged-in-buttons">
          <button 
            @click="openCustomizeModal" 
            class="customize-btn"
            style="margin-bottom: 10px;"
          >
            Personnaliser
          </button>
          <button @click="handleLogout" class="logout-btn">
            Déconnexion
          </button>
        </div>
      </div>

      <form v-if="!isLoggedIn" @submit.prevent="handleSubmit">
        <input 
          type="email" 
          v-model="email" 
          placeholder="Email"
          class="login-input"
          required
        />
        <input 
          type="password" 
          v-model="password" 
          placeholder="Mot de passe"
          class="login-input"
          required
          minlength="8"
        />
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Chargement...' : (loginType === 'login' ? 'Confirmer' : 'S\'inscrire') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import '@/assets/LoginIconStyle.css';
export default {
  name: 'LoginIcon',
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    },
    isLoggedIn: {
      type: Boolean,
      required: true
    },
    currentUser: {
      type: Object,
      default: () => ({})
    },
    // Nouvelles props pour la personnalisation
    selectedFrame: {
      type: String,
      default: 'basicCadre.png'
    },
    selectedAvatar: {
      type: String,
      default: 'coin.png'
    }
  },
  data() {
    return {
      isOpen: false,
      loginType: 'login',
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    }
  },
  computed: {
    userFrame() {
      // Utiliser le cadre personnalisé si l'utilisateur est connecté
      if (this.isLoggedIn) {
        return this.selectedFrame;
      }
      return 'basicCadre.png';
    },
    userAvatar() {
      // Utiliser l'avatar personnalisé si l'utilisateur est connecté
      if (this.isLoggedIn) {
        return this.selectedAvatar;
      }
      return 'unknownUser.png';
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      this.resetForm();
    },
    resetForm() {
      this.email = '';
      this.password = '';
      this.errorMessage = '';
    },
    handleSubmit() {
      const credentials = {
        email: this.email,
        password: this.password
      };
      
      if (this.loginType === 'login') {
        this.$emit('login-attempt', credentials);
      } else {
        this.$emit('register-attempt', credentials);
      }
      
      this.email = '';
      this.password = '';
      this.isOpen = false;
    },
    handleLogout() {
      this.$emit('logout');
      this.isOpen = false;
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    },
    openCustomizeModal() {
      this.$emit('open-customize-modal');
      this.isOpen = false;
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>