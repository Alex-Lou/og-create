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
        <form @submit.prevent="handleSubmit">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Email"
            class="login-input"
          />
          <input 
            type="password" 
            v-model="password" 
            placeholder="Mot de passe"
            class="login-input"
          />
          <div class="login-type-selector">
            <button 
              type="button"
              :class="['type-btn', { active: loginType === 'login' }]"
              @click="loginType = 'login'"
            >
              Connexion
            </button>
            <button 
              type="button"
              :class="['type-btn', { active: loginType === 'register' }]"
              @click="loginType = 'register'"
            >
              Inscription
            </button>
          </div>
          <button type="submit" class="submit-btn">
            Confirmer
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
      }
    },
    data() {
      return {
        isOpen: false,
        loginType: 'login',
        email: '',
        password: ''
      }
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen;
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
    margin-right: 60px;
    margin-bottom: 7px;
  }
  
  .login-icon {
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .login-icon:hover {
    transform: scale(1.1);
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
    color: #cfcfcf;
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
  </style>