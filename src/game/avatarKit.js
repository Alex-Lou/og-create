// L'avatar composé du joueur (HISTOIRE.md § 6.17) : ses choix (un objet, gardé par le serveur), dessinés par le
// générateur de la bibliothèque (design/bibliotheque/generateur/avatar.mjs), chargé à la demande (il pèse ~200 Ko).
// Le catalogue des choix (noms, nuanciers, accessoires, ce qui est gratuit : avatar.json) est dans avatarCatalog.js,
// lu seulement par l'éditeur (chargé à la demande) : ce module-ci part au démarrage (les scènes), sans ses 260 Ko.
// Un avatar est soit l'un des douze exemples de la bibliothèque (« avatar-03 », game/sceneArt.js), soit ses choix.
import { reactive } from 'vue';
import { gravee } from './acteur';

const state = reactive({ kit: null, failed: false, exemples: null });
let loading = null;

// Un avatar composé (ses choix), et non l'un des exemples
export const isCustom = look => Boolean(look) && typeof look === 'object' && !Array.isArray(look);

// Le générateur, chargé une fois ; rend le module (ou null s'il n'a pas pu l'être)
export function loadKit() {
  if (!loading) {
    loading = import('../../design/bibliotheque/generateur/avatar.mjs')
      .then(kit => (state.kit = kit))
      .catch(() => {
        state.failed = true;
        return null;
      });
  }
  return loading;
}

// Le générateur s'il est là (réactif : un calcul qui le lit se refait quand il arrive), sinon null (il se charge)
export function kitNow() {
  if (!state.kit && !state.failed) loadKit();
  return state.kit;
}
export const kitFailed = () => state.failed;

// Les poses de face : celle du kit, son nombre d'images, son geste
const FACE = { repos: ['repos', 2], salut: ['salut', 2], grelotter: ['action', 2, 'grelotter'], lire: ['action', 2, 'lire'] };

const toUrl = svg => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
// Le trois quarts avant du kit regarde en bas à gauche ; la bibliothèque et le jeu le tournent en bas à droite
const mirrored = body => `<g transform="translate(48 0) scale(-1 1)">${body}</g>`;

const cache = new Map();
function memo(key, make) {
  if (!cache.has(key)) {
    // (l'aperçu qui tourne et les vignettes de l'éditeur : quelques centaines d'images, ~12 Ko chacune)
    if (cache.size > 400) cache.clear();
    cache.set(key, make());
  }
  return cache.get(key);
}

// Le personnage du kit pour ces choix (naufragé ou en tenue de croisière) ; null si un choix est inconnu
function characterOf(kit, choices, naufrage) {
  try {
    return naufrage ? kit.avatarNaufrage(choices, { uid: 'avn' }) : kit.avatar(choices, { uid: 'av' });
  } catch (error) {
    return null;
  }
}

// Les images de l'avatar composé pour une scène (mêmes vues et poses que les exemples, game/sceneArt.js) : des URL
// data:, dans l'ordre ; [] tant que le générateur se charge, ou si un choix est inconnu. En néon (une scène en papier
// néon) : chaque image passe par le rendu néon de game/acteur.js (ses couleurs ravivées, le cerne indigo, le liseré)
export function customFrames(choices, { vue = 'face', pose = 'repos', naufrage = true, neon = false, lumiere = {} } = {}) {
  const kit = kitNow();
  if (!kit) return [];
  return memo(`${JSON.stringify(choices)}|${vue}|${pose}|${naufrage}|${neon}|${JSON.stringify(lumiere)}`, () => {
    const c = characterOf(kit, choices, naufrage);
    if (!c) return [];
    const svg = neon ? body => gravee(body, 'n', { ...NEON_STATIQUE, ...lumiere }) : body => kit.svg(body);
    if (vue === 'face' || pose === 'salut') {
      const [kitPose, n, geste] = FACE[pose] || FACE.repos;
      const who = geste ? { ...c, geste } : c;
      return Array.from({ length: n }, (_, i) => toUrl(svg(kit.frame(who, 'front', kitPose, i))));
    }
    // assis les mains tendues vers le feu (la veillée), ou debout les mains tendues : de trois quarts avant, 2 images
    if (vue === 'avant' && (pose === 'assis-mains-tendues' || pose === 'mains-tendues')) {
      const body = n => (pose === 'mains-tendues' ? kit.frame(kit.avecMainsTendues(c), 'se', 'action', n) : kit.assis(c, 'se', n, null, kit.tendre));
      return [0, 1].map(n => toUrl(svg(mirrored(body(n)))));
    }
    // de dos, assis les mains tendues vers le feu qui est devant lui (le conseil), 2 images
    if (vue === 'dos' && pose === 'assis-mains-tendues') return [0, 1].map(n => toUrl(svg(kit.assis(c, 'ne', n, null, kit.tendre))));
    const view = vue === 'avant' ? 'se' : 'ne';
    const body = kit.frame(c, view, 'marche', 1);
    return [toUrl(svg(view === 'se' ? mirrored(body) : body))];
  });
}

// (la lumière d'une scène fixe en néon, si elle n'en donne pas (avatar.lumiere) : la nuit violette, la lumière à gauche)
const NEON_STATIQUE = { neon: true, cote: 1 };

// Les choix des exemples de la bibliothèque (avatar.json, avec le catalogue de l'éditeur : chargé à la demande), pour
// qu'un joueur qui a choisi un exemple joue lui aussi les scènes (réactif, comme le kit)
let exemplesLoading = null;
function exemplesNow() {
  if (!state.exemples && !exemplesLoading) {
    exemplesLoading = import('./avatarCatalog')
      .then(m => (state.exemples = m.CATALOG.exemples))
      .catch(() => (state.exemples = {}));
  }
  return state.exemples;
}
// Les choix d'un avatar : les siens (composé), ou ceux de l'exemple choisi ; null tant que les exemples se chargent
export function choixDe(look) {
  if (isCustom(look)) return look;
  const ex = exemplesNow();
  if (!ex) return null;
  const exemple = ex[look] || Object.values(ex)[0];
  return exemple ? exemple.choix : null;
}
// Les animations du kit (MOUVEMENTS : leurs images, leur durée), ou null tant qu'il se charge
export const mouvementsKit = () => (kitNow() || {}).MOUVEMENTS || null;
// Les images d'un clip de la piste « acteur » (game/acteur.js) : l'avatar (ses choix, ou l'un des exemples) qui joue
// cette animation dans cette direction, gravé à la lumière de la scène ; des URL data:, dans l'ordre ; [] tant que le
// kit ou les exemples se chargent, ou si l'animation n'existe pas
export function acteurImages(look, { anim, dir, expr }, { naufrage = true, lumiere = {} } = {}) {
  const kit = kitNow();
  if (!kit || !kit.MOUVEMENTS[anim]) return [];
  let choices = look;
  if (!isCustom(look)) {
    const ex = exemplesNow();
    if (!ex) return [];
    const exemple = ex[look] || Object.values(ex)[0];
    if (!exemple) return [];
    choices = exemple.choix;
  }
  return memo(`${JSON.stringify(choices)}|acteur|${anim}|${dir}|${expr}|${naufrage}|${JSON.stringify(lumiere)}`, () => {
    const c = characterOf(kit, choices, naufrage);
    if (!c) return [];
    try {
      return Array.from({ length: kit.MOUVEMENTS[anim].images }, (_, n) => toUrl(gravee(kit.mouvement(c, anim, dir, n, expr), `a${n}`, lumiere)));
    } catch (error) {
      return [];
    }
  });
}

// Le tour sur soi-même de l'aperçu (la carte d'embarquement) : de face, trois quarts avant, dos, puis l'autre côté
export const TURN = [
  { view: 'front', flip: false }, { view: 'se', flip: true }, { view: 'ne', flip: false },
  { view: 'ne', flip: true }, { view: 'se', flip: false }
];
// Une image du tour (step : TURN) : de face, au repos (n : 0, ou 1 pour le clignement) ; sinon, les pieds joints
export function turnFrame(choices, step, n = 0, naufrage = false) {
  const kit = kitNow();
  if (!kit) return null;
  return memo(`${JSON.stringify(choices)}|turn|${step.view}|${step.flip}|${n}|${naufrage}`, () => {
    const c = characterOf(kit, choices, naufrage);
    if (!c) return null;
    const body = step.view === 'front' ? kit.frame(c, 'front', 'repos', n) : kit.frame(c, step.view, 'marche', 1);
    return toUrl(kit.svg(step.flip ? mirrored(body) : body));
  });
}

// Une image du salut (« C'est moi », à la fin de l'éditeur) : de face, l'air content, la main qui va et vient (n de 0 à 3)
export function waveFrame(choices, n) {
  const kit = kitNow();
  if (!kit) return null;
  return memo(`${JSON.stringify(choices)}|salut|${n}`, () => {
    const c = characterOf(kit, choices, false);
    return c ? toUrl(kit.svg(kit.frame(c, 'front', 'salut', n))) : null;
  });
}

// Les cadres des vignettes de l'éditeur (dans le cadre 48 × 64 du personnage, de face, carrés) : la tête, la coiffure,
// le buste, les jambes, les pieds, le personnage en pied (choix de l'auteur, 13 oct. : des vignettes vivantes)
export const CROPS = { tete: '10 2 28 28', coiffure: '5 0 38 38', buste: '9 20 30 30', jambes: '10 34 28 28', pieds: '12 44 24 24', pied: '0 0 48 64' };
// Une vignette : le personnage de ces choix, de face, au repos, vu par ce cadre (CROPS) ; null tant que le générateur se
// charge, ou si un choix est inconnu
export function cropFrame(choices, crop) {
  const kit = kitNow();
  if (!kit) return null;
  return memo(`${JSON.stringify(choices)}|crop|${crop}`, () => {
    const c = characterOf(kit, choices, false);
    if (!c) return null;
    const box = CROPS[crop] || CROPS.pied;
    // (un cadre carré : l'image aussi, pour qu'elle ne garde pas la proportion du personnage en pied)
    const square = box === CROPS.pied ? '' : 'width="96" height="96" ';
    return toUrl(kit.svg(kit.frame(c, 'front', 'repos', 0)).replace('width="48" height="64" viewBox="0 0 48 64"', `${square || 'width="48" height="64" '}viewBox="${box}"`));
  });
}
