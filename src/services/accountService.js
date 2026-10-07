// « Mon compte » (Sceau) : le profil, le mot de passe, une nouvelle adresse confirmée par un lien, la pause, la
// suppression avec sept jours de grâce et l'export des données (serveur : routes/account.js)
import http from './http';

const data = response => response.data;

export default {
  // { email, username, name, look, createdAt, provisional, pendingEmail }
  profile: () => http.get('/account').then(data),
  changePassword: (current, password) => http.post('/account/password', { current, password }).then(data),
  // → { message, pendingEmail } : l'adresse ne change qu'une fois le lien ouvert
  changeEmail: (password, email) => http.post('/account/email', { password, email }).then(data),
  confirmEmail: token => http.post('/account/email/confirm', { token }).then(data),
  suspend: () => http.post('/account/suspend').then(data),
  // → { message, deleteAt }
  remove: password => http.post('/account/delete', { password }).then(data),
  exportData: () => http.get('/account/export').then(data)
};
