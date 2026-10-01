// Indice de session pour l'interface (clé 'user') : identifiant et pseudo seulement.
// Les jetons vivent dans des cookies httpOnly que le JavaScript ne peut pas lire ; si la session
// a expiré côté serveur, le client HTTP le découvre au premier 401 et efface cet indice.
const KEY = 'user';

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(KEY));
    return session?.userId ? session : null;
  } catch {
    return null;
  }
}

// Enregistre l'indice à partir d'une réponse /auth (login, register, refresh)
export function saveSession(data) {
  const session = { userId: data.userId, username: data.username };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
