// Message d'une erreur d'API pour le joueur : celui du serveur s'il en donne un, sinon le message prévu
export function messageOf(error, fallback) {
  return error?.response?.data?.message || fallback;
}
