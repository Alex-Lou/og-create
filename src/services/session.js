// Session utilisateur persistée dans localStorage (clé 'user') : seule source de vérité du token.
const KEY = 'user';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

// Construit et enregistre la session à partir d'une réponse /auth (login, register, refresh)
export function saveSession(data, refreshToken = data.refreshToken) {
  const session = {
    token: data.token,
    refreshToken,
    userId: data.userId,
    username: data.username,
    expiresAt: Date.now() + (data.expiresIn || 3600) * 1000
  };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
