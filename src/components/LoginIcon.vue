<template>
  <div class="login-container">
    <div class="user-frame" @click="toggleDropdown">
      <img 
        src="@/assets/Svgs/basicCadre.png" 
        alt="Cadre" 
        class="frame-image"
      />
      <img 
        :src="require(`@/assets/Svgs/${isLoggedIn ? 'coin.png' : 'unknownUser.png'}`)"
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

<style scoped>
.login-container {
  position: relative;
  margin-right: -110px;
  margin-bottom: 1px;
}

.user-frame {
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-frame:hover {
  transform: scale(1.1);
}

.frame-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.user-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  object-fit: contain;
  z-index: 1;
}

.login-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 15px;
  width: 220px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.login-type-selector {
  display: flex;
  gap: 8px;
  margin: 15px 0;
}

.type-btn {
  flex: 1;
  padding: 5px;
  background: transparent;
  border: 1px solid #444;
  color: #604c4c;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn.active {
  background: #333;
  border-color: #666;
}

.login-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #cfcfcf;
}

.submit-btn {
  width: 100%;
  padding: 8px;
  background: #2D96A4;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #1f7a85;
}

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

.logged-in-section p {
  color: #cfcfcf;
  margin-bottom: 15px;
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