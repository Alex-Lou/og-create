import { createApp } from 'vue';
import App from './components/General/App.vue';
import '@animxyz/core';

const app = createApp(App);

// Configuration pour réduire les logs
if (process.env.NODE_ENV === 'production') {
  app.config.silent = true;
  app.config.errorHandler = null;
  app.config.warnHandler = null;
}

app.mount('#app');