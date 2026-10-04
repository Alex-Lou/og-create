// Indice de session pour l'interface (clé 'user') : identifiant et pseudo seulement.
// Les jetons vivent dans des cookies httpOnly que le JavaScript ne peut pas lire ; si la session
// a expiré côté serveur, le client HTTP le découvre au premier 401 et efface cet indice.
import { load, save, remove } from '@/utils/storage';

const KEY = 'user';

export function getSession() {
  const session = load(KEY);
  return session?.userId ? session : null;
}

// Enregistre l'indice à partir d'une réponse /auth (login, register, refresh)
export function saveSession(data) {
  const session = { userId: data.userId, username: data.username };
  save(KEY, session);
  return session;
}

export function clearSession() {
  remove(KEY);
}
