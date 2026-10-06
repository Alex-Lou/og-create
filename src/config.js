// Base de l'API : même origine que le site (/api), relayée vers le backend par le serveur du site
// (règle de réécriture Render en production, proxy de Vite en local). Une autre origine casserait
// les cookies de session SameSite=Strict : VUE_APP_API_URL ne sert qu'à changer ce chemin.
export const API_URL = (import.meta.env.VUE_APP_API_URL || '/api').replace(/\/+$/, '');
