import { createApp } from 'vue';
import App from './App.vue';
import { xyz } from '@animxyz/vue'; // Import AnimXYZ
import '@animxyz/core'; // Import du CSS AnimXYZ

const app = createApp(App);

app.use(xyz); // Utilise AnimXYZ comme plugin
app.mount('#app');
