// URL de base de l'API, injectée au build (VUE_APP_API_URL), sans slash final.
// En local, le backend tourne par défaut sur le port 3000.
export const API_URL = (process.env.VUE_APP_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
