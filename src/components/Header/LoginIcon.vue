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
      <!-- Cadre décoratif interne (ne modifie pas la structure globale) -->
      <div class="login-dropdown-frame">
        <div class="frame-corner corner-tl">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-tl">✧</div>
        </div>
        <div class="frame-corner corner-tr">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-tr">✧</div>
        </div>
        <div class="frame-corner corner-bl">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-bl">✧</div>
        </div>
        <div class="frame-corner corner-br">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-br">✧</div>
        </div>
      </div>
      
      <!-- Contenu du modal tel qu'initialement défini -->
      <div class="login-content">
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
  </div>
</template>

<script>
import '@/assets/ComponentsStyle/HeaderStyle/LoginIconStyle.css';
import AuthService from '@/services/authService';

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
    toggleDropdown(event) {
      // Empêcher la propagation pour éviter que le document.addEventListener déclenche handleClickOutside
      if (event) {
        event.stopPropagation();
      }
      this.isOpen = !this.isOpen;
      
      // Ajouter le modal directement au body pour éviter les problèmes de z-index
      if (this.isOpen) {
        this.resetForm();
        // Ajouter une classe au body pour indiquer que le dropdown est ouvert
        document.body.classList.add('login-dropdown-open');
      } else {
        document.body.classList.remove('login-dropdown-open');
      }
    },
    resetForm() {
      this.email = '';
      this.password = '';
      this.errorMessage = '';
    },
    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        if (this.loginType === 'login') {
          // Connexion directe avec AuthService
          await AuthService.login(this.email, this.password);
          
          // Émettre également l'événement pour le parent
          this.$emit('login-attempt', { email: this.email, password: this.password });
          
          // Fermer le modal
          this.isOpen = false;
        } else {
          // Inscription directe avec AuthService
          await AuthService.register(this.email, this.password);
          
          // Émettre également l'événement pour le parent
          this.$emit('register-attempt', { email: this.email, password: this.password });
          
          // Fermer le modal
          this.isOpen = false;
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        this.errorMessage = error.response?.data?.message || 'Erreur d\'authentification';
      } finally {
        this.isLoading = false;
      }
    },
    handleLogout() {
      // Déconnecter directement
      AuthService.logout();
      // Émettre l'événement pour le parent
      this.$emit('logout');
      // Fermer le dropdown
      this.isOpen = false;
    },
    handleClickOutside(e) {
      // Ne pas déclencher si le clic est dans le composant
      if (this.$el && !this.$el.contains(e.target) && this.isOpen) {
        this.isOpen = false;
      }
    },
    openCustomizeModal() {
      this.$emit('open-customize-modal');
      this.isOpen = false;
    }
  },
  mounted() {
    // Utiliser setTimeout pour assurer que la référence à this reste correcte
    setTimeout(() => {
      document.addEventListener('click', this.handleClickOutside);
    }, 100);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>