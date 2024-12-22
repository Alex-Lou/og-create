import { createApp } from 'vue';
import App from './App.vue';
import '@animxyz/core'; // Import du CSS AnimXYZ

const app = createApp(App);

// Pas besoin de `app.use(xyz)` car AnimXYZ n'est pas un plugin Vue
app.mount('#app');
