// Formulaire de contact : un message à l'équipe (serveur : POST /contact/send)
import http from './http';

export default {
  send: (email, message) => http.post('/contact/send', { email, message })
};
