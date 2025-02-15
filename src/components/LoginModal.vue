<template>
    <div class="login-container">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        class="login-icon"
        @click="toggleDropdown"
      >
        <path 
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
          :fill="isDarkMode ? '#cfcfcf' : '#666666'"
        />
      </svg>
  
      <!-- Dropdown Menu -->
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
          <p>Connecté en tant que : {{ currentUser.username }}</p>
          <button @click="handleLogout" class="logout-btn">
            Déconnexion
          </button>
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
import AuthService from '@/services/authService';
  
export default {
    name: 'LoginIcon',
    props: {
      isDarkMode: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        isOpen: false,
        loginType: 'login',
        email: '',
        password: '',
        errorMessage: '',
        isLoading: false,
        currentUser: null
      }
    },
    computed: {
      isLoggedIn() {
        return AuthService.isAuthenticated();
      }
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen
        this.resetForm()
        
        // Récupérer l'utilisateur connecté si existe
        if (this.isLoggedIn) {
          this.currentUser = AuthService.getCurrentUser();
        }
      },
      resetForm() {
        this.email = ''
        this.password = ''
        this.errorMessage = ''
      },
      async handleSubmit() {
        this.errorMessage = ''
        this.isLoading = true
  
        try {
          if (this.loginType === 'login') {
            const response = await AuthService.login(this.email, this.password)
            this.currentUser = response
            this.$emit('login-success', response)
          } else {
            const response = await AuthService.register(this.email, this.password)
            this.currentUser = response
            this.$emit('register-success', response)
          }
          
          this.isOpen = false
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Une erreur est survenue'
        } finally {
          this.isLoading = false
        }
      },
      handleLogout() {
        AuthService.logout();
        this.currentUser = null;
        this.isOpen = false;
        this.$emit('logout');
      }
    },
    mounted() {
      // Ferme le dropdown si on clique ailleurs
      document.addEventListener('click', (e) => {
        if (!this.$el.contains(e.target)) {
          this.isOpen = false
        }
      });
    }
  }
</script>
  
<style scoped>
/* Vos styles précédents */
.error-message {
  color: #ff4136;
  margin-bottom: 10px;
  text-align: center;
}

.logged-in-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
}

.logout-btn {
  width: 100%;
  padding: 8px;
  background: #FF4136;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background: #d02f24;
}
</style>