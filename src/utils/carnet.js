// Dernier carnet de l'Infini connu sur cet appareil, pour l'afficher sans attendre le serveur.
// Il ne contient que ce que le joueur possède déjà (ni recette ni élément inconnu), lié à son compte ;
// le serveur reste la vérité : sa réponse remplace toujours cette copie.
const KEY = 'oc_carnet';

const defaultStorage = () => (typeof localStorage === 'undefined' ? null : localStorage);

// État enregistré pour ce compte, ou null (autre compte, absent, illisible)
export function readCarnet(userId, storage = defaultStorage()) {
  try {
    const saved = JSON.parse(storage.getItem(KEY));
    if (!saved || saved.userId !== userId || !Array.isArray(saved.state?.elements)) return null;
    return saved.state;
  } catch {
    return null;
  }
}

export function writeCarnet(userId, state, storage = defaultStorage()) {
  try {
    storage.setItem(KEY, JSON.stringify({ userId, state }));
  } catch {
    // Stockage plein ou bloqué : le prochain lancement attendra simplement le serveur
  }
}

export function clearCarnet(storage = defaultStorage()) {
  try {
    storage.removeItem(KEY);
  } catch {
    // Rien à effacer
  }
}
