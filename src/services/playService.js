import http from './http';

// Serveur de jeu : les recettes restent sur le serveur, le navigateur ne reçoit que des résultats.
// Un joueur sans compte reçoit un carnet invité (cookie httpOnly) à sa première visite.

let guestCreation = null;

function ensureGuest() {
  if (!guestCreation) guestCreation = http.post('/play/guest').finally(() => { guestCreation = null; });
  return guestCreation;
}

// Rejoue une fois la requête après création du carnet invité, si le serveur n'en connaissait aucun
async function asPlayer(request) {
  try {
    return (await request()).data;
  } catch (error) {
    if (error.response?.data?.code !== 'NO_PLAYER') throw error;
    await ensureGuest();
    return (await request()).data;
  }
}

export default {
  // { kind, elements, known: {nom: {emoji, family}}, families: {famille: total}, unexplored }
  state() {
    return asPlayer(() => http.get('/play/state'));
  },
  // { result: null } ou { result, emoji, family, isNew, unexplored? }
  // page : page du Livre visée (facultatif) ; la réponse dit alors combien d'ingrédients sont justes
  combine(mode, ingredients, page = null) {
    return asPlayer(() => http.post('/play/combine', page ? { mode, ingredients, page } : { mode, ingredients }));
  },
  // Début d'une question de l'Épreuve ({ questionId, launch })
  startRun(mode, details) {
    return asPlayer(() => http.post('/play/run', { mode, ...details }));
  },
  // Le Livre : { stars, chapters: [{ id, name, families, need, open, total, found, far, pages }] }
  book() {
    return asPlayer(() => http.get('/play/book'));
  },
  // Encre du Livre (compte requis, payée en écus) : { page, ingredient, coins }
  ink(page) {
    return asPlayer(() => http.post('/play/ink', { page }));
  },
  // Pendu d'une page : une lettre posée dans une case, jugée par le serveur
  // → { page, verdict: 'hit'|'elsewhere'|'miss', hangman, inscribed? } (inscribed : élément ajouté au carnet)
  letter(page, position, letter) {
    return asPlayer(() => http.post('/play/letter', { page, position, letter }));
  },
  // Rejouer un pendu perdu contre des écus (compte) → { page, coins, hangman }
  retryLetters(page) {
    return asPlayer(() => http.post('/play/letter/retry', { page }));
  },
  // Le Monde (compte requis) : { size, sites, stock, charges, harvest, rate, capHours, pending, tiles: [{ x, y, element, emoji, family }] }
  world() {
    return http.get('/play/world').then(response => response.data);
  },
  worldPlace(element, x, y) {
    return http.post('/play/world/place', { element, x, y }).then(response => response.data);
  },
  worldRemove(x, y) {
    return http.post('/play/world/remove', { x, y }).then(response => response.data);
  },
  // { gained, coins, world }
  worldCollect() {
    return http.post('/play/world/collect').then(response => response.data);
  },
  // { built, world }
  worldBuild(site) {
    return http.post('/play/world/build', { site }).then(response => response.data);
  },
  // Récolte : { id, seed, kinds, maxMoves, boosts } puis { gains, world } une fois les coups rejoués par le serveur
  harvestStart() {
    return http.post('/play/world/harvest/start').then(response => response.data);
  },
  harvestFinish(run, moves) {
    return http.post('/play/world/harvest/finish', { run, moves }).then(response => response.data);
  },
  // Joker de l'Épreuve : { freeJokers, coins?, ingredients? | ingredient? }
  joker(kind) {
    return asPlayer(() => http.post('/play/joker', { kind }));
  },
  // Fin du sablier : { score, credited, coins? } (score compté par le serveur)
  finishTimer() {
    return asPlayer(() => http.post('/play/timer/finish'));
  }
};
