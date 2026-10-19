// Mémoire de l'appareil (localStorage) en JSON, sans jamais lever : en navigation privée, stockage plein
// ou bloqué, la lecture rend la valeur par défaut et l'écriture ne fait rien. Pour le confort d'affichage
// seulement : ce qui compte (carnet, écus, île) est gardé par le serveur.
export function load(key, fallback = null) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Stockage indisponible : la valeur reste valable pour la session
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Stockage indisponible
  }
}

// Le même confort pour une valeur gardée en texte brut, sans JSON (un identifiant, « 1 ») : le format déjà écrit sur
// les appareils ne change pas. Absente ou illisible : null.
export function loadText(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function saveText(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Stockage indisponible
  }
}
