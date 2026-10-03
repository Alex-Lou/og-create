// Recherche dans le registre : sans accents ni majuscules, tolère une faute de frappe.

export function normalize(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Distance d'édition (insertion, suppression, substitution, inversion de deux lettres voisines),
// arrêtée dès qu'elle dépasse `max`
export function distance(a, b, max = Infinity) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let before = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (before && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) row[j] = Math.min(row[j], before[j - 2] + 1);
      if (row[j] < best) best = row[j];
    }
    if (best > max) return max + 1;
    before = prev;
    prev = row;
  }
  return prev[b.length];
}

// Une faute de frappe tolérée à partir de 4 lettres : le début d'un mot du nom ressemble à la requête
// (on compare aux débuts de mot d'une lettre de moins à une lettre de plus, pour la saisie en cours)
function closeWord(name, q) {
  if (q.length < 4) return false;
  return name.split(/[\s'’-]+/).some(word =>
    [q.length - 1, q.length, q.length + 1].some(len => len <= word.length && distance(word.slice(0, len), q, 1) <= 1)
  );
}

// Rang d'un nom pour la requête (déjà normalisée) : plus petit = meilleur ; null = aucun rapport
export function rank(name, q) {
  const n = normalize(name);
  if (n === q) return 0;
  if (n.startsWith(q)) return 1;
  if (n.split(/[\s'’-]+/).some(word => word.startsWith(q))) return 2;
  if (n.includes(q)) return 3;
  if (closeWord(n, q)) return 4;
  return null;
}

// Noms qui répondent à la requête, du plus pertinent au moins pertinent (à rang égal : ordre alphabétique)
export function search(names, query) {
  const q = normalize(query.trim());
  if (!q) return [];
  return names
    .map(name => ({ name, r: rank(name, q) }))
    .filter(x => x.r !== null)
    .sort((a, b) => a.r - b.r || a.name.localeCompare(b.name, 'fr'))
    .map(x => x.name);
}

// Rien ne répond : le nom connu le plus proche (2 fautes au plus), ou null
export function suggest(names, query) {
  const q = normalize(query.trim());
  if (q.length < 3) return null;
  let best = null;
  let bestD = 3;
  for (const name of names) {
    const d = distance(normalize(name), q, 2);
    if (d < bestD) {
      best = name;
      bestD = d;
    }
  }
  return best;
}
